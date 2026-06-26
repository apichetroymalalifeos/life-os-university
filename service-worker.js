// Life OS PWA service worker.
// It caches only static local files so the dashboard can reopen offline after
// the first successful visit from HTTPS or localhost.
const CACHE_NAME = "life-os-university-pwa-v4";

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./styles/main.css",
  "./src/storage.js",
  "./src/engine.js",
  "./src/roadmaps.generated.js",
  "./src/app.js",
  "./roadmaps/ai.json",
  "./roadmaps/crypto.json",
  "./roadmaps/longevity.json",
  "./roadmaps/sales.json",
  "./roadmaps/psychology.json",
  "./roadmaps/future.json",
  "./roadmaps/workout.json",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request)
        .then(response => {
          const responseCopy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseCopy));
          return response;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});
