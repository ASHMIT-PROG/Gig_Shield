// ─── Firebase Configuration ────────────────────────────────────
// Initializes Firebase app, Auth, and Firestore for the GigShield frontend.
// Config values are loaded from Vite environment variables (VITE_FIREBASE_*).
// If not configured, exports null — the app falls back to mock data.

let app = null;
let auth = null;
let db = null;

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

// Only initialize Firebase if config is actually present
if (apiKey) {
  const { initializeApp } = await import("firebase/app");
  const { getAuth } = await import("firebase/auth");
  const { getFirestore } = await import("firebase/firestore");

  const firebaseConfig = {
    apiKey,
    authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  };

  app  = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db   = getFirestore(app);

  console.log("[GigShield] Firebase initialized ✅");
} else {
  console.log("[GigShield] Firebase not configured — using mock data");
}

export { app, auth, db };
