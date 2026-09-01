const CACHE = "kpss-shell-v3";

self.addEventListener("install", function (e) {
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
    var url = e.request.url;
    if (url.indexOf("/js/") !== -1 || url.indexOf("app.jsx") !== -1 || url.indexOf("unpkg.com") !== -1) {
        e.respondWith(fetch(e.request));
        return;
    }
    e.respondWith(
        fetch(e.request).then(function (res) {
            return res;
        }).catch(function () {
            return caches.match(e.request);
        })
    );
});
