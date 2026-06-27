// Life OS PWA service worker.
// Static assets are cache-first for offline use. version.json is always fetched
// network-first and is never permanently cached, so installed PWAs can detect
// new GitHub Pages deploys.
const APP_VERSION = "6.3.1";
const CACHE_PREFIX = "life-os-university-pwa-";
const CACHE_NAME = `${CACHE_PREFIX}${APP_VERSION}`;

const APP_SHELL = [
  "./",
  "./index.html",
  "./fresh.html",
  "./manifest.webmanifest",
  "./styles/main.css",
  "./src/storage.js",
  "./src/engine.js",
  "./src/roadmaps.generated.js",
  "./src/app.js",
  "./roadmaps/ai_automation.json",
  "./roadmaps/crypto_macro.json",
  "./roadmaps/longevity_health.json",
  "./roadmaps/elite_b2b_sales.json",
  "./roadmaps/psychology_decision.json",
  "./roadmaps/future_trends.json",
  "./roadmaps/workout.json",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", event => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  if (url.pathname.endsWith("/version.json") || url.pathname.endsWith("version.json")) {
    event.respondWith(fetch(event.request, { cache: "no-store" }));
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put("./index.html", copy));
          return response;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request)
        .then(response => {
          if (response.ok) {
            const responseCopy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseCopy));
          }
          return response;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});
