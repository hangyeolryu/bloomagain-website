// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import {
  getMessaging,
  getToken,
  isSupported as isMessagingSupported,
} from "firebase/messaging";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app, 'asia-northeast3');

// Initialize Analytics (only in browser environment)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

/**
 * Request browser notification permission and obtain a Firebase Cloud Messaging
 * Web token. Returns the token string on success, or `null` when:
 *   * the browser doesn't support FCM (older Safari / private mode),
 *   * the user denied notification permission,
 *   * VAPID key is missing from env, or
 *   * the service worker registration fails.
 *
 * Used by the family-invite acceptance flow so the bloomagain-korea backend
 * can fan-out risk alerts directly to the child's browser.
 *
 * Requires `public/firebase-messaging-sw.js` to exist and the VAPID public
 * key to be set as `NEXT_PUBLIC_FIREBASE_VAPID_KEY`.
 */
export async function requestFcmToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  if (!("Notification" in window)) return null;

  try {
    const supported = await isMessagingSupported();
    if (!supported) return null;
  } catch {
    return null;
  }

  // Always (re)check permission — getToken throws when blocked.
  let permission = Notification.permission;
  if (permission === "default") {
    try {
      permission = await Notification.requestPermission();
    } catch {
      return null;
    }
  }
  if (permission !== "granted") return null;

  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
  if (!vapidKey) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[firebase] NEXT_PUBLIC_FIREBASE_VAPID_KEY not set — skipping FCM token request",
      );
    }
    return null;
  }

  try {
    const messaging = getMessaging(app);
    const token = await getToken(messaging, { vapidKey });
    return token || null;
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[firebase] getToken failed", err);
    }
    return null;
  }
}

export default app;
