(function (global) {
    var cache = {};

    function BackBtn(props) {
        var h = global.React.createElement;
        var label = props.label || "Geri";
        return h("button", { type: "button", onClick: props.onClick, className: "back-btn", "aria-label": label },
            h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": "true" },
                h("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.25, d: "M15 19l-7-7 7-7" })
            ),
            h("span", null, label)
        );
    }
    global.KpssBackBtn = BackBtn;

    // ---- Babel yalnızca gerektiğinde (derlenmiş kod önbellekte yoksa) yüklenir ----
    var BABEL_URLS = [
        "https://unpkg.com/@babel/standalone@7.29.9/babel.min.js",
        "https://cdn.jsdelivr.net/npm/@babel/standalone@7.29.9/babel.min.js",
        "https://unpkg.com/@babel/standalone/babel.min.js"
    ];
    var babelReady = null;
    function ensureBabel() {
        if (typeof global.Babel !== "undefined") return Promise.resolve(global.Babel);
        if (babelReady) return babelReady;
        babelReady = new Promise(function (resolve, reject) {
            var i = 0;
            function next() {
                if (i >= BABEL_URLS.length) { babelReady = null; reject(new Error("Babel yüklenemedi")); return; }
                var s = document.createElement("script");
                s.src = BABEL_URLS[i++];
                s.async = true;
                s.onload = function () { typeof global.Babel !== "undefined" ? resolve(global.Babel) : next(); };
                s.onerror = next;
                document.head.appendChild(s);
            }
            next();
        });
        return babelReady;
    }

    function transform(src, filename) {
        var preset = (typeof Babel !== "undefined" && Babel.availablePresets && Babel.availablePresets.react)
            ? [Babel.availablePresets.react, { runtime: "classic" }]
            : ["react"];
        return Babel.transform(src, { presets: [preset], filename: filename || "lazy.jsx" }).code;
    }

    // ---- Derlenmiş JSX önbelleği (IndexedDB). Anahtar: dosya adı; kaynak özeti değişince yeniden derlenir ----
    var COMPILER = "babel-7.29.9-react-classic";
    function hashOf(str) {
        str = String(str).replace(/\r\n?/g, "\n"); // Windows (CRLF) ve GitHub (LF) kopyası aynı özeti versin
        var h = 2166136261;
        for (var i = 0; i < str.length; i++) {
            h ^= str.charCodeAt(i);
            h = Math.imul(h, 16777619);
        }
        return COMPILER + ":" + str.length + ":" + (h >>> 0).toString(36);
    }
    var dbReady = null;
    function db() {
        if (dbReady) return dbReady;
        dbReady = new Promise(function (resolve) {
            try {
                if (!global.indexedDB) return resolve(null);
                var req = global.indexedDB.open("atanly-jsx", 1);
                req.onupgradeneeded = function () { req.result.createObjectStore("c"); };
                req.onsuccess = function () { resolve(req.result); };
                req.onerror = function () { resolve(null); };
                req.onblocked = function () { resolve(null); };
            } catch (e) { resolve(null); }
        });
        return dbReady;
    }
    function cacheGet(name, hash) {
        return db().then(function (d) {
            if (!d) return null;
            return new Promise(function (resolve) {
                try {
                    var r = d.transaction("c", "readonly").objectStore("c").get(name);
                    r.onsuccess = function () { var v = r.result; resolve(v && v.h === hash ? v.c : null); };
                    r.onerror = function () { resolve(null); };
                } catch (e) { resolve(null); }
            });
        }).catch(function () { return null; });
    }
    function cachePut(name, hash, code) {
        db().then(function (d) {
            if (!d) return;
            try { d.transaction("c", "readwrite").objectStore("c").put({ h: hash, c: code }, name); } catch (e) {}
        }).catch(function () {});
    }

    // scripts/build-jsx.js ile üretilen hazır derleme: js/compiled/<dosya>.js
    // İlk satırındaki özet kaynakla tutmazsa (derleme unutulduysa) kullanılmaz; tarayıcıda derlenir.
    function compiledUrl(name) {
        return String(name).replace(/^js\//, "js/compiled/").replace(/\.jsx$/, ".js");
    }
    function fetchPrebuilt(name) {
        return fetch(compiledUrl(name), { cache: "no-cache", credentials: "same-origin" })
            .then(function (r) { return r.ok ? r.text() : null; })
            .catch(function () { return null; });
    }

    function compile(src, name, prebuilt) {
        var hash = hashOf(src);
        return cacheGet(name, hash).then(function (hit) {
            if (hit) return hit;
            return Promise.resolve(prebuilt || fetchPrebuilt(name)).then(function (pre) {
                var nl = pre ? pre.indexOf("\n") : -1;
                var head = nl > 0 ? pre.slice(0, nl).replace(/\r$/, "") : "";
                if (pre && head === "/*jsx:" + hash + "*/") {
                    var code = pre.slice(nl + 1);
                    cachePut(name, hash, code);
                    return code;
                }
                return ensureBabel().then(function () {
                    var out = transform(src, name);
                    cachePut(name, hash, out);
                    return out;
                });
            });
        });
    }

    function fetchText(path) {
        return fetch(path, { cache: "no-cache", credentials: "same-origin" }).then(function (r) {
            if (!r.ok) throw new Error("Bileşen yüklenemedi: " + path);
            return r.text();
        });
    }

    function load(name, path) {
        global.KpssComponents = global.KpssComponents || {};
        if (global.KpssComponents[name]) return Promise.resolve(global.KpssComponents[name]);
        if (cache[name]) return cache[name];
        var url = new URL(path, window.location.href).href.replace(/(\?.*)?$/, "") + "?v=94";
        var file = path.replace(/\?.*$/, "");
        var pre = fetchPrebuilt(file);
        cache[name] = fetchText(url).then(function (src) {
            return compile(src, file, pre);
        }).then(function (code) {
            var runner = new Function("React", "ReactDOM", code);
            runner(global.React, global.ReactDOM);
            var C = global.KpssComponents[name];
            if (!C) throw new Error("Bileşen kayıtlı değil: " + name);
            return C;
        }).catch(function (err) {
            delete cache[name];
            console.warn(err);
            throw err;
        });
        return cache[name];
    }

    // Ana uygulama (js/app.jsx): eskiden <script type="text/babel"> ile her açılışta derleniyordu.
    // Artık derlenmiş hâli önbellekten gelir; aynı global kapsamda çalıştırılır.
    function boot(path) {
        var name = String(path).replace(/\?.*$/, "");
        function fail(err) {
            console.error(err);
            var root = document.getElementById("root");
            if (root) {
                root.innerHTML = '<div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:24px;text-align:center;background:linear-gradient(135deg,#041C24,#0A3842 48%,#127880);color:#F5EBC7;font:500 15px/1.5 Inter,system-ui,sans-serif">'
                    + "<p>Uygulama yüklenemedi. Bağlantını kontrol edip sayfayı yenile.</p>"
                    + '<button onclick="location.reload()" style="padding:10px 18px;border-radius:999px;border:0;background:#F5EBC7;color:#041C24;font-weight:700">Yenile</button></div>';
            }
        }
        var pre = fetchPrebuilt(name);
        return fetchText(path).then(function (src) {
            return compile(src, name, pre);
        }).then(function (code) {
            var s = document.createElement("script");
            s.text = code + "\n//# sourceURL=" + name;
            document.body.appendChild(s);
        }).catch(fail);
    }

    global.JsxLoader = { load: load, boot: boot, compile: compile, ensureBabel: ensureBabel, hashOf: hashOf };
})(window);
