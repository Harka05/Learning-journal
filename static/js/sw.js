
const CACHE_NAME = "journal-cache-v3";

const STATIC_ASSETS = [
    "/",
    "/journal",
    "/reflections",
    "/reflection",
    "/projects",
    "/about",
    "/zensnake",

    "/static/css/style.css",
    "/static/js/main.js",
    "/static/js/script.js",
    "/static/js/browser.js",
    "/static/offline.html",

    "/static/images/icon_192.png",
    "/static/images/icon_512.png"
];

// --------------------------
// INSTALL EVENT
// --------------------------
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
    );
    self.skipWaiting();
});

// --------------------------
// ACTIVATE EVENT
// --------------------------
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                })
            )
        )
    );
    self.clients.claim();
});

// --------------------------
// FETCH EVENT
// --------------------------
self.addEventListener("fetch", event => {
    const req = event.request;

    // --------------------------
    // Network-first for HTML
    // --------------------------
    if (req.headers.get("accept")?.includes("text/html")) {
        event.respondWith(
            fetch(req).catch(() => caches.match("/static/offline.html"))
        );
        return;
    }

    // --------------------------
    // Cache-first for static files
    // --------------------------
    event.respondWith(
        caches.match(req).then(cached => {
            return (
                cached ||
                fetch(req)
                    .then(response => {
                        return caches.open(CACHE_NAME).then(cache => {
                            cache.put(req, response.clone());
                            return response;
                        });
                    })
                    .catch(() => caches.match("/static/offline.html"))
            );
        })
    );
});
