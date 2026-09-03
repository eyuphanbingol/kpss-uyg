(function (g) {
    var P = {
        flame: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
        book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z",
        cap: "M22 10v6M6 12.5V16a6 3 0 0 0 12 0v-3.5M2 9.5L12 4l10 5.5-10 5.5L2 9.5z",
        scale: "M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1zM2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1zM7 21h10M12 3v18M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2",
        moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
        sun: "M12 3v1M12 20v1M4.22 4.22l.7.7M18.36 18.36l.7.7M1 12h1M22 12h1M4.22 19.78l.7-.7M18.36 5.64l.7-.7M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
        user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
        clock: "M12 8v4l2 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z",
        lock: "M7 11V7a5 5 0 0 1 10 0v4M5 11h14v10H5z",
        check: "M20 6L9 17l-5-5",
        share: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13",
        medal: "M8 21h8M12 17v4M7 4h10v6a5 5 0 1 1-10 0V4zM7 4l-2 3M17 4l2 3",
        map: "M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15M15 6v15"
    };
    g.KpssIcon = function (name, cls) {
        return React.createElement("svg", {
            className: cls || "w-5 h-5",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            "aria-hidden": "true",
            strokeWidth: 1.75,
            strokeLinecap: "round",
            strokeLinejoin: "round"
        }, React.createElement("path", { d: P[name] || P.check }));
    };

    g.AtanomLogo = function (cls) {
        var src = (g.KpssConfig && g.KpssConfig.logoUrl) || "icons/atanom.png";
        return React.createElement("img", {
            src: src,
            alt: (g.KpssConfig && g.KpssConfig.appName) || "Atanly",
            className: cls || "h-16 w-16 object-contain"
        });
    };
})(window);
