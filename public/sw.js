// ExamVault Production Service Worker — Version 1.0.0
const CACHE_NAME = "examvault-pwa-v1";

const PRECACHE_ASSETS = [
  "/",
  "/offline.html",
  "/manifest.json",
  "/icons/icon-192.svg",
  "/icons/icon-512.svg",
];

// Install Event — precache core offline shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate Event — cleanup old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch Event — Network-First strategy with fallback to cache & offline.html
self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Skip browser-extension or chrome-extension URLs
  if (!url.protocol.startsWith("http")) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone and store valid responses in cache
        if (response && response.status === 200 && response.type === "basic") {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(async () => {
        // Network failed — try to match from cache
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // If navigational request (HTML page), return offline.html
        if (event.request.mode === "navigate") {
          return caches.match("/offline.html");
        }

        return new Response("Offline resource unavailable", {
          status: 503,
          statusText: "Service Unavailable",
          headers: new Headers({ "Content-Type": "text/plain" }),
        });
      })
  );
});

// Push Event — Web Push Notifications
self.addEventListener("push", (event) => {
  let data = {
    title: "ExamVault Alert",
    body: "You have a new examination notification.",
    icon: "/icons/icon-192.svg",
    badge: "/icons/icon-192.svg",
    url: "/",
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    data: {
      url: data.url || "/",
    },
    vibrate: [100, 50, 100],
    actions: [
      { action: "explore", title: "View Details" },
      { action: "close", title: "Dismiss" },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification Click Event
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "close") return;

  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if (client.url.includes(targetUrl) && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});
