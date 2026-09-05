(function (global) {
    var cache = {};

    function transform(src) {
        var preset = (typeof Babel !== "undefined" && Babel.availablePresets && Babel.availablePresets.react)
            ? [Babel.availablePresets.react, { runtime: "classic" }]
            : ["react"];
        return Babel.transform(src, { presets: [preset], filename: "lazy.jsx" }).code;
    }

    function load(name, path) {
        global.KpssComponents = global.KpssComponents || {};
        if (global.KpssComponents[name]) return Promise.resolve(global.KpssComponents[name]);
        if (cache[name]) return cache[name];
        cache[name] = fetch(new URL(path, window.location.href).href.replace(/(\?.*)?$/, "") + "?v=42", { cache: "no-cache", credentials: "same-origin" }).then(function (r) {
            if (!r.ok) throw new Error("Bileşen yüklenemedi: " + path);
            return r.text();
        }).then(function (src) {
            var code = transform(src);
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

    global.JsxLoader = { load: load };
})(window);
