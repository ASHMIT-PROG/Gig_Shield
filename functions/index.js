/**
 * GigShield — Weather & AQI Event Detection Cloud Function
 *
 * Runs every 30 minutes via Pub/Sub schedule.
 * Fetches real-time weather (OpenWeatherMap) and air quality (WAQI) data
 * for all supported cities, evaluates thresholds, and writes trigger
 * events to Firestore. Curfew events are NEVER touched — admin-only.
 *
 * Firestore schema: triggerEvents/{city}/{eventType} (single doc per type per city)
 */

const { onSchedule } = require("firebase-functions/v2/scheduler");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

admin.initializeApp();
const db = admin.firestore();

// ─── Secrets (set via `firebase functions:secrets:set`) ───────────
const OPENWEATHER_API_KEY = defineSecret("OPENWEATHER_API_KEY");
const WAQI_TOKEN = defineSecret("WAQI_TOKEN");

// ─── City coordinates ────────────────────────────────────────────
const CITIES = {
  Delhi:     { lat: 28.6139, lon: 77.2090 },
  Mumbai:    { lat: 19.0760, lon: 72.8777 },
  Bengaluru: { lat: 12.9716, lon: 77.5946 },
  Chennai:   { lat: 13.0827, lon: 80.2707 },
  Hyderabad: { lat: 17.3850, lon: 78.4867 },
};

// ─── Threshold definitions ───────────────────────────────────────

/**
 * Rain thresholds based on mm/hr from OpenWeatherMap rain['1h'] field.
 * Returns { severity, payoutPercent, active } for the given rainfall.
 */
function evaluateRain(rainMmPerHr) {
  if (rainMmPerHr >= 15)  return { severity: "severe",   payoutPercent: 80, active: true };
  if (rainMmPerHr >= 7.5) return { severity: "moderate", payoutPercent: 60, active: true };
  if (rainMmPerHr >= 2.5) return { severity: "mild",     payoutPercent: 30, active: true };
  // Below 2.5 mm/hr → no event
  return { severity: null, payoutPercent: 0, active: false };
}

/**
 * AQI thresholds based on US AQI scale (0–500) from WAQI.
 * Returns { severity, payoutPercent, active } for the given AQI index.
 */
function evaluateAQI(aqiValue) {
  if (aqiValue >= 200) return { severity: "severe",   payoutPercent: 80, active: true };
  if (aqiValue >= 150) return { severity: "moderate", payoutPercent: 60, active: true };
  // Below 150 → no event
  return { severity: null, payoutPercent: 0, active: false };
}

// ─── API Fetchers ────────────────────────────────────────────────

// AbortController-based timeout for fetch (8 seconds)
function fetchWithTimeout(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer));
}

/**
 * Fetches rain data from OpenWeatherMap for a given lat/lon.
 * Returns rain in mm/hr. If no rain field exists, returns 0.
 */
async function fetchRainData(lat, lon, apiKey) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const res = await fetchWithTimeout(url);
  if (!res.ok) {
    throw new Error(`OpenWeatherMap responded with HTTP ${res.status}`);
  }
  const data = await res.json();

  // rain['1h'] may not exist if it's not raining — treat as 0
  const rainMm = data.rain?.["1h"] ?? 0;
  return rainMm;
}

/**
 * Fetches AQI data from WAQI for a given lat/lon.
 * Returns the AQI integer value.
 * Throws if the response is malformed or status !== 'ok'.
 */
async function fetchAQIData(lat, lon, token) {
  const url = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${token}`;
  const res = await fetchWithTimeout(url);
  if (!res.ok) {
    throw new Error(`WAQI responded with HTTP ${res.status}`);
  }
  const json = await res.json();

  // Validate WAQI response structure
  if (json.status !== "ok" || typeof json.data?.aqi !== "number") {
    throw new Error(`WAQI returned invalid data: status=${json.status}, aqi=${json.data?.aqi}`);
  }

  return json.data.aqi;
}

// ─── Firestore Write Logic ───────────────────────────────────────

/**
 * Conditionally writes a trigger event document to Firestore.
 *
 * Rules:
 * 1. Only write if severity or active state has actually changed.
 * 2. If transitioning inactive → active: set startTime, clear endTime.
 * 3. If transitioning active → inactive: set endTime, keep startTime.
 * 4. Always update updatedAt on write.
 */
async function writeTriggerEvent(city, eventType, evaluation, source) {
  const docRef = db.collection("triggerEvents").doc(city).collection("events").doc(eventType);

  try {
    const snapshot = await docRef.get();
    const existing = snapshot.exists ? snapshot.data() : null;

    const currentSeverity = existing?.severity ?? null;
    const currentActive   = existing?.active   ?? false;

    const newSeverity = evaluation.severity;
    const newActive   = evaluation.active;

    // Rule 2: Skip write if nothing has changed
    if (currentSeverity === newSeverity && currentActive === newActive) {
      console.log(`[GigShield] Skipped (no change): ${city}/${eventType}`);
      return;
    }

    // Build the update payload
    const updateData = {
      city,
      eventType,
      severity:      newSeverity,
      payoutPercent: evaluation.payoutPercent,
      active:        newActive,
      updatedAt:     admin.firestore.FieldValue.serverTimestamp(),
      source,
    };

    // Handle startTime / endTime transitions
    if (newActive && !currentActive) {
      // Transitioning to active: set startTime, clear endTime
      updateData.startTime = admin.firestore.FieldValue.serverTimestamp();
      updateData.endTime   = null;
    } else if (!newActive && currentActive) {
      // Transitioning to inactive: set endTime, preserve startTime
      updateData.endTime = admin.firestore.FieldValue.serverTimestamp();
      // Do NOT touch startTime — keep whatever was set
    } else if (newActive && currentActive) {
      // Still active but severity changed — do NOT overwrite startTime
      updateData.endTime = null;
    }

    // Write (merge to preserve any fields we don't set here)
    await docRef.set(updateData, { merge: true });
    console.log(`[GigShield] Written: ${city}/${eventType} → severity=${newSeverity}, active=${newActive}`);
  } catch (err) {
    console.error(`[GigShield] Firestore write failed: ${city}/${eventType} —`, err.message);
  }
}

// ─── Main scheduled function ─────────────────────────────────────

exports.checkWeatherAndAQI = onSchedule(
  {
    schedule: "every 30 minutes",
    timeZone: "Asia/Kolkata",
    secrets: [OPENWEATHER_API_KEY, WAQI_TOKEN],
    // Allow up to 120s for all API calls + Firestore writes
    timeoutSeconds: 120,
    memory: "256MiB",
  },
  async (event) => {
    const owmKey   = OPENWEATHER_API_KEY.value();
    const waqiKey  = WAQI_TOKEN.value();

    console.log("[GigShield] Starting weather & AQI check for all cities…");

    // Process all cities in parallel
    const cityNames = Object.keys(CITIES);
    await Promise.all(
      cityNames.map(async (city) => {
        const { lat, lon } = CITIES[city];

        // Fetch rain and AQI in parallel for this city
        const results = await Promise.allSettled([
          // ── Rain ──────────────────────────────────────
          (async () => {
            try {
              const rainMm = await fetchRainData(lat, lon, owmKey);
              const evaluation = evaluateRain(rainMm);
              await writeTriggerEvent(city, "rain", evaluation, "openweather");
            } catch (err) {
              console.error(`[GigShield] API error: ${city}/rain —`, err.message);
              // Rule 5: Do NOT write to Firestore on API failure
            }
          })(),

          // ── AQI ──────────────────────────────────────
          (async () => {
            try {
              const aqiValue = await fetchAQIData(lat, lon, waqiKey);
              const evaluation = evaluateAQI(aqiValue);
              await writeTriggerEvent(city, "aqi", evaluation, "waqi");
            } catch (err) {
              console.error(`[GigShield] API error: ${city}/aqi —`, err.message);
              // Rule 5: Do NOT write to Firestore on API failure
            }
          })(),

          // Note: curfew events are NEVER processed here.
          // They are admin-managed only (source: "admin").
        ]);
      })
    );

    console.log("[GigShield] Weather & AQI check complete.");
  }
);
