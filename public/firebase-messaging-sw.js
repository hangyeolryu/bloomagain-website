/* Firebase Cloud Messaging service worker — required for Web Push.
 *
 * Loaded automatically at /firebase-messaging-sw.js by the Firebase SDK
 * when getToken() runs on the family-invite page. The SDK uses this worker
 * to receive push notifications even when the page is closed.
 *
 * Config below is the same `dasi-bom` Firebase project the rest of the site
 * uses. We CAN'T import process.env here (service workers don't see Next.js
 * build env), so the values are inlined. They are public-safe — Firebase Web
 * config is intentionally exposed; security comes from Firestore rules + the
 * tenant API key stored on the bloomagain-korea backend.
 */

importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDPYRldjkhT6AE7Y3z30ObwvGcnoRJKJ1g",
  authDomain: "dasi-bom.firebaseapp.com",
  projectId: "dasi-bom",
  storageBucket: "dasi-bom.appspot.com",
  messagingSenderId: "370394949702",
  appId: "1:370394949702:web:493d18518bd53de5d20247",
});

const messaging = firebase.messaging();

// Background message handler — fires when the page is closed and a push
// arrives from the bloomagain-korea backend's risk-alert fan-out.
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title ?? "다시, 봄 알림";
  const options = {
    body: payload.notification?.body ?? "",
    icon: "/icon-192.png",
    badge: "/icon-96.png",
    tag: payload.data?.tag ?? "family-alert",
    data: payload.data ?? {},
  };
  self.registration.showNotification(title, options);
});

// Click handler — bring focus to the home page (or a deep link from data).
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/";
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(url) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    }),
  );
});
