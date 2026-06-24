// Import the functions you need from the SDKs you need
//
// 2026-06: previously this file eagerly initialized auth/db/storage/
// functions even though the website never uses them (the Flutter app
// uses those — the website is marketing-only + invite acceptance via
// FCM). The unused getAuth(app) was triggering CONFIGURATION_NOT_FOUND
// 400s in browser console because Authentication isn't enabled on the
// website's Firebase project. Slim down to only what the website needs.
import { initializeApp } from "firebase/app";
import {
  getAnalytics,
  isSupported as isAnalyticsSupported,
  logEvent,
  type Analytics,
} from "firebase/analytics";
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

// Auth/Firestore/Storage/Functions are intentionally NOT initialized
// here — the website doesn't consume them. Re-add only if a future
// website feature genuinely needs one of those services, *and* the
// matching Firebase product is enabled on the project.

// Firebase Analytics is browser-only and needs an async `isSupported()`
// check before construction — calling getAnalytics in unsupported envs
// (older Safari private mode, some embedded browsers) throws. We expose
// a memoized promise so callers can fire-and-forget logEvent without
// worrying about init state or platform support.
let _analyticsPromise: Promise<Analytics | null> | null = null;
function ensureAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (_analyticsPromise) return _analyticsPromise;
  _analyticsPromise = isAnalyticsSupported()
    .then((ok) => (ok ? getAnalytics(app) : null))
    .catch(() => null);
  return _analyticsPromise;
}

/**
 * Fire a Firebase Analytics custom event. No-op when analytics isn't
 * supported (SSR, older browsers, blocked by ad blocker). Safe to call
 * from any client component without try/catch — failures are swallowed.
 *
 * Usage:
 *   logAnalyticsEvent('app_download_click', { store: 'ios' });
 *   logAnalyticsEvent('page_view', { page_path: '/about' });
 */
export function logAnalyticsEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>,
): void {
  ensureAnalytics()
    .then((a) => {
      if (a) logEvent(a, eventName, params);
    })
    .catch(() => {
      /* swallow */
    });
}

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
