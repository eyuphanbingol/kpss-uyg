const CACHE = "kpss-shell-v5";

self.addEventListener("install", function () {
    self.skipWaiting();
});

self.addEventListener("activate", function (e) {
    e.waitUntil(
        caches.keys().then(function (keys) {
            return Promise.all(keys.map(function (k) { return caches.delete(k); }));
        }).then(function () { return self.clients.claim(); })
    );
});

self.addEventListener("fetch", function (e) {
    if (e.request.method !== "GET") return;
    var url;
    try { url = new URL(e.request.url); } catch (err) { return; }
    if (url.origin !== self.location.origin) return;
    e.respondWith(fetch(e.request));
});
