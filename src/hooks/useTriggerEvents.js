// ─── useTriggerEvents: Real-time Firestore listener ───────────
// Attaches an onSnapshot listener to triggerEvents/{city}/events
// and returns only active events. Falls back to mock data if
// Firestore is not configured (no VITE_FIREBASE_API_KEY).

import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { MOCK_TRIGGER_EVENTS } from '../mockData';

export function useTriggerEvents(city) {
  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    // ── Fallback to mock data if Firebase isn't configured or db is null ──
    if (!db || !city) {
      setEvents(
        MOCK_TRIGGER_EVENTS.filter(e => e.city === city && e.isActive)
      );
      setLoading(false);
      return;
    }

    // ── Firestore real-time listener ──
    let unsubscribe;

    (async () => {
      try {
        const { collection, onSnapshot, query, where } = await import('firebase/firestore');

        // Collection path: triggerEvents/{city}/events
        // Filter: only active events
        const eventsRef = collection(db, 'triggerEvents', city, 'events');
        const activeQuery = query(eventsRef, where('active', '==', true));

        unsubscribe = onSnapshot(
          activeQuery,
          (snapshot) => {
            const liveEvents = snapshot.docs.map((doc) => {
              const data = doc.data();

              // ── Backward compatibility mapping ──
              // Firestore uses: active, startTime, endTime
              // Frontend expects: isActive, startedAt, endedAt (with .toDate() methods)
              return {
                id:            doc.id,
                city:          data.city,
                eventType:     data.eventType,
                severity:      data.severity,
                payoutPercent: data.payoutPercent,
                isActive:      data.active,                 // map active → isActive
                startedAt:     data.startTime ?? null,       // Firestore Timestamps already have .toDate()
                endedAt:       data.endTime   ?? null,
                source:        data.source    ?? 'unknown',
                updatedAt:     data.updatedAt ?? null,
              };
            });

            setEvents(liveEvents);
            setLoading(false);
            setError(null);
          },
          (err) => {
            console.error('[useTriggerEvents] Firestore listener error:', err);
            setError(err);
            setLoading(false);

            // Degrade gracefully: fall back to mock data on error
            setEvents(
              MOCK_TRIGGER_EVENTS.filter(e => e.city === city && e.isActive)
            );
          }
        );
      } catch (err) {
        console.error('[useTriggerEvents] Failed to setup listener:', err);
        // Fall back to mock data on any setup failure
        setEvents(
          MOCK_TRIGGER_EVENTS.filter(e => e.city === city && e.isActive)
        );
        setLoading(false);
      }
    })();

    // ── Cleanup: detach listener on unmount or city change ──
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [city]);

  return { events, loading, error };
}
