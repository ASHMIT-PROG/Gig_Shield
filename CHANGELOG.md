# GigShield — Changelog

All notable changes to this project are documented here.

---

## [Unreleased] — 2026-04-02

### 🔴 Removed

#### Feature pills from Login Page

Removed three decorative badge pills from the Login / Hero section:

| Badge | Emoji | Purpose (removed) |
|-------|-------|--------------------|
| **Rain Coverage** | 🌧️ | Indicated parametric rain-event protection |
| **AQI Protection** | 🌫️ | Indicated air-quality index protection |
| **Curfew Shield** | 🚔 | Indicated curfew-event protection |

These were displayed below the "AI-powered parametric income protection" tagline on the login screen. Removed to simplify the login UI.

| File | Change |
|------|--------|
| `src/pages/auth/LoginPage.jsx` | Removed the `{/* Feature pills */}` `<div>` block (lines 75–87) containing the three badge elements and their `.map()` renderer. |

> **Note:** Feature labels used elsewhere (e.g., `HomePage.jsx`, `triggerConfig.js`, `cards/index.jsx`) were left unchanged — they serve functional purposes.

---

### 📄 Added — Documentation

Created two comprehensive documentation files covering the entire codebase:

#### `ARCHITECTURE.md` — System Architecture

| Section | Description |
|---------|-------------|
| Product Overview | Parametric insurance concept, core features table |
| Technology Stack | Full dependency table (React 18, Vite 5, TailwindCSS 3, Recharts, jsPDF, etc.) |
| High-Level Architecture | ASCII diagram of the SPA structure (Router → Pages → Hooks → Mock Data) |
| App Shell & Layout | Sidebar + TopBar desktop layout diagram, auth vs protected rendering |
| Auth & Authorization Flow | Mermaid flowchart: phone → OTP → role detection → route guards |
| Data Architecture | All 13 mock data entities documented with types and record counts |
| Custom Hooks | 5 hooks with signatures, return types, and descriptions |
| Routing Map | 8 routes with auth/admin requirements |
| Insurance Score System | Score tiers (0–100), component weights, loan eligibility thresholds |
| Trigger Event System | Event types, severities, payout calculation formula |
| Pool Economics | Inflow/outflow model, reserve ratio health assessment |
| Design System | CSS custom properties, typography (3 fonts), 8 animations |
| Production Readiness | Mock vs production-ready checklist |

#### `FILE_REFERENCE.md` — File-by-File Breakdown

Complete documentation of every file and folder in the project:

| Coverage | Count |
|----------|-------|
| Root config files documented | 6 (`index.html`, `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `.gitignore`) |
| Source files documented | 31 |
| React components | 22 (with props, exports, and behavior documented) |
| Custom hooks | 5 (with parameters, return types, implementation notes) |
| Utility modules | 4 (with function signatures and descriptions) |
| Constants files | 3 (with full enum/value listings) |
| Page components | 8 (with layout, sections, modals, and logic documented) |

---

### 🔥 Added — Real-Time Weather & AQI Event Detection (Firebase Backend)

Replaced hardcoded mock trigger events with a production Firebase backend that fetches live weather and air quality data.

#### New Files

| File | Purpose |
|------|---------|
| `functions/package.json` | Cloud Functions dependencies: `firebase-admin`, `firebase-functions` v5, `node-fetch` v2 |
| `functions/index.js` | **Scheduled Cloud Function** — runs every 30 min via Pub/Sub |
| `functions/.env.example` | Template for API keys (`OPENWEATHER_API_KEY`, `WAQI_TOKEN`) |
| `firebase.json` | Firebase project config pointing to `functions/` dir and Firestore rules |
| `firestore.rules` | Security rules: authenticated read, admin-only write via Cloud Functions |
| `firestore.indexes.json` | Empty indexes file (no composite index needed) |
| `.env.example` | Template for frontend Firebase config (`VITE_FIREBASE_*` env vars) |

#### Modified Files

| File | Change |
|------|--------|
| `src/firebase.js` | **Replaced** placeholder comment with real Firebase initialization. Exports `app`, `auth`, `db` using Vite env vars. |
| `src/hooks/useTriggerEvents.js` | **Rewritten** to use Firestore `onSnapshot` real-time listener. Maps Firestore fields (`active` → `isActive`, `startTime` → `startedAt`) for backward compatibility. Gracefully falls back to mock data if Firebase is not configured. |
| `.gitignore` | Added `functions/node_modules/`, `functions/.env`, `firebase-debug.log`, `.firebase/` |
| `package.json` | Added `firebase` SDK dependency |

#### Cloud Function Details (`functions/index.js`)

**Schedule:** Every 30 minutes (Asia/Kolkata timezone)

**Data Sources:**

| Source | API | Data Retrieved |
|--------|-----|---------------|
| OpenWeatherMap | `/data/2.5/weather` | Rainfall in mm/hr (`rain['1h']`) |
| WAQI | `/feed/geo:{lat};{lon}/` | Air Quality Index (US scale 0–500) |

**Cities Monitored:** Delhi, Mumbai, Bengaluru, Chennai, Hyderabad

**Threshold Evaluation:**

| Event | Severity | Threshold | Payout % |
|-------|----------|-----------|:--------:|
| Rain | mild | 2.5–7.5 mm/hr | 30% |
| Rain | moderate | 7.5–15 mm/hr | 60% |
| Rain | severe | ≥ 15 mm/hr | 80% |
| AQI | moderate | 150–200 | 60% |
| AQI | severe | ≥ 200 | 80% |

**Write Logic:**
- Conditional writes — only updates Firestore when severity or active state changes
- Proper `startTime` / `endTime` lifecycle management
- **Never** touches curfew events (admin-managed only, `source: "admin"`)
- All 5 cities fetched in parallel; rain + AQI fetched in parallel per city

**Error Handling:**
- 8-second fetch timeout per API call
- On API failure: logs error, skips Firestore write, continues to next city
- Missing `rain['1h']` field treated as 0 mm (no rain)
- Malformed WAQI response → skip write

**Firestore Schema:** `triggerEvents/{city}/events/{eventType}`

| Field | Type | Description |
|-------|------|-------------|
| `city` | string | City name |
| `eventType` | string | `rain` \| `aqi` \| `curfew` |
| `severity` | string \| null | `mild` \| `moderate` \| `severe` \| `null` |
| `payoutPercent` | number | 0–80 |
| `active` | boolean | Whether event is currently active |
| `startTime` | Timestamp | Set on inactive → active transition |
| `endTime` | Timestamp \| null | Set on active → inactive transition |
| `updatedAt` | Timestamp | Updated on every write |
| `source` | string | `openweather` \| `waqi` \| `admin` |

#### Frontend Hook Changes (`src/hooks/useTriggerEvents.js`)

| Aspect | Before | After |
|--------|--------|-------|
| Data source | `MOCK_TRIGGER_EVENTS` array | Firestore `onSnapshot` real-time listener |
| Updates | Static, never changes | Live — updates instantly when Firestore changes |
| Fallback | N/A | Auto-falls back to mock data if Firebase not configured |
| Error handling | None | Catches listener errors, logs warning, degrades to mock |
| Cleanup | None | Returns `unsubscribe()` in `useEffect` cleanup |
| Backward compat | N/A | Maps `active` → `isActive`, `startTime` → `startedAt` |

**Zero breaking changes** — all existing UI components (`TriggerBanner`, `Sidebar`, `TopBar`, `cards/index.jsx`) work without modification.

---

### 🐛 Fixed — App Crash Without Firebase Config

The app showed a blank dark screen when running `npm run dev` because `src/firebase.js` called `initializeApp()` with undefined environment variables (no `.env.local` file), crashing the entire React app.

**Root Cause:** `initializeApp()` and top-level Firestore imports (`collection`, `onSnapshot`, etc.) threw errors when Firebase config was missing, preventing the React tree from rendering.

**Fix applied to 2 files:**

| File | Fix |
|------|-----|
| `src/firebase.js` | Wrapped initialization in a conditional: only calls `initializeApp()` if `VITE_FIREBASE_API_KEY` is present. Exports `null` for `app`, `auth`, `db` when unconfigured. Uses dynamic `await import()` for Firebase modules. |
| `src/hooks/useTriggerEvents.js` | Checks `if (!db)` before attaching Firestore listener — instantly falls back to mock data. Firestore SDK imports are now lazy (dynamic `import()` inside `useEffect`) so they never crash the module at load time. |

**Result:** The app now runs in **mock mode** without any `.env.local` — identical behavior to before the Firebase integration. Once Firebase config is added, it automatically switches to live Firestore.

---

## 📍 Current Project Status    (IMP)

### What We Have Now

| Layer | Status | Details |
|-------|--------|---------|
| **Frontend UI** | ✅ Fully working | All 8 pages render correctly — Login, Register, Dashboard, Payouts, Coverage, Tax, Profile, Admin |
| **Mock Data** | ✅ Active | App runs entirely on in-memory mock data (`mockData.js`) — deliveries, payouts, riders, scores, pool ledger |
| **Trigger Events (Mock)** | ✅ Active | One mock rain event in Chennai displayed on dashboard, sidebar, and notifications |
| **Cloud Function Code** | ✅ Written | `functions/index.js` — ready to deploy. Fetches live rain (OpenWeatherMap) + AQI (WAQI) every 30 min |
| **Firebase Config (Frontend)** | ✅ Written | `src/firebase.js` with conditional init — gracefully falls back to mock when not configured |
| **Firestore Hook** | ✅ Written | `src/hooks/useTriggerEvents.js` — real-time listener with mock fallback |
| **Firestore Rules** | ✅ Written | `firestore.rules` — authenticated read, admin-only write |
| **Firebase Project** | ❌ Not created | Need to create at [console.firebase.google.com](https://console.firebase.google.com) |
| **`.env.local` (Frontend)** | ❌ Not created | Need Firebase web app config values |
| **API Keys** | ❌ Not obtained | Need OpenWeatherMap key + WAQI token (both free) |
| **Cloud Function Deployed** | ❌ Not deployed | Code is ready but not deployed to Firebase |
| **Live Weather Data** | ❌ Not active | Requires all of the above to be completed first |

### How Live Weather Will Work (Once Deployed)

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────┐     ┌──────────────┐
│  OpenWeatherMap  │     │    WAQI API      │     │   Firebase   │     │   Your App   │
│  (Rain mm/hr)    │────►│  (AQI index)     │────►│  Cloud Func  │────►│  (React)     │
└──────────────────┘     └──────────────────┘     │  (every 30m) │     │              │
                                                   └──────┬───────┘     │  onSnapshot  │
                                                          │             │  listener    │
                                                          ▼             │  ◄───────────┤
                                                   ┌──────────────┐     │  Live events │
                                                   │  Firestore   │────►│  on screen   │
                                                   │  Database    │     └──────────────┘
                                                   └──────────────┘
```

### What You're Seeing Right Now

The app is running in **mock mode** because Firebase is not configured. This means:
- ✅ The app loads and works normally at `localhost:5173`
- ✅ You see mock trigger events (Chennai rain, etc.)
- ✅ All pages, charts, modals, and features work
- ❌ No live weather data — data is static/hardcoded
- ❌ Browser console shows: `[GigShield] Firebase not configured — using mock data`

### To Activate Live Weather — Setup Steps

#### Step 1: Create Firebase Project
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project (e.g., `gigshield`)
3. Enable **Firestore Database** (start in test mode)
4. Add a **Web App** and copy the config

#### Step 2: Create `.env.local` in project root
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=gigshield.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=gigshield
VITE_FIREBASE_STORAGE_BUCKET=gigshield.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

#### Step 3: Get Free API Keys
- **OpenWeatherMap:** [openweathermap.org/api](https://openweathermap.org/api) → Sign up → Free tier (60 calls/min)
- **WAQI:** [aqicn.org/data-platform/token](https://aqicn.org/data-platform/token) → Request token (1000 calls/day)

#### Step 4: Deploy Cloud Function
```bash
npm install -g firebase-tools
firebase login
firebase use gigshield
firebase functions:secrets:set OPENWEATHER_API_KEY
firebase functions:secrets:set WAQI_TOKEN
firebase deploy --only functions,firestore:rules
```

#### Step 5: Restart Frontend
```bash
npm run dev
```
The app will now connect to Firestore and show **live weather & AQI trigger events** for Delhi, Mumbai, Bengaluru, Chennai, and Hyderabad.
