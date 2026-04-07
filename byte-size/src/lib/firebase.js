import { initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth, GoogleAuthProvider, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Restrict Google sign-in to only request email and profile (no extra scopes)
const provider = new GoogleAuthProvider();
provider.addScope("email");
provider.addScope("profile");

setPersistence(auth, browserLocalPersistence);

// Firebase App Check — verifies requests come from your app, not scrapers/bots.
// Requires NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY in .env.local (reCAPTCHA v3 key from Firebase console).
if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY) {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY),
    isTokenAutoRefreshEnabled: true,
  });
}

export { app, auth, provider, db };
