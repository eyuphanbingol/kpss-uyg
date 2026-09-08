(function (global) {
    var loaded = false;
    var autoPushed = false;

    function cfg() {
        return (global.KpssConfig && global.KpssConfig.adsense) || {};
    }

    function client() {
        var id = String(cfg().client || "").trim();
        return /^ca-pub-\d{10,22}$/.test(id) ? id : "";
    }

    function pubId() {
        var c = client();
        return c ? c.replace(/^ca-/, "") : "";
    }

    function slot(name) {
        var slots = cfg().slots || {};
        var id = String(slots[name] || "").trim();
        return /^\d{8,22}$/.test(id) ? id : "";
    }

    function showAds() {
        if (cfg().enabled === false) return false;
        if (!client()) return false;
        var st = global.StudentStore;
        if (st && st.premiumOfferEnabled && st.premiumOfferEnabled()) {
            var p = st.getState && st.getState().userProfile;
            if (p && p.premium) return false;
        }
        var consent = st && st.getState && st.getState().consent;
        if (!consent || !consent.marketing) return false;
        return true;
    }

    function init() {
        if (loaded || !showAds()) return;
        loaded = true;
        var id = client();
        var meta = document.querySelector('meta[name="google-adsense-account"]');
        if (!meta) {
            meta = document.createElement("meta");
            meta.setAttribute("name", "google-adsense-account");
            document.head.appendChild(meta);
        }
        meta.setAttribute("content", id);
        var s = document.createElement("script");
        s.async = true;
        s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + encodeURIComponent(id);
        s.crossOrigin = "anonymous";
        document.head.appendChild(s);
        s.onload = function () {
            if (autoPushed) return;
            autoPushed = true;
            try {
                (global.adsbygoogle = global.adsbygoogle || []).push({
                    google_ad_client: id,
                    enable_page_level_ads: true,
                    overlays: { bottom: false, top: false }
                });
            } catch (e) {}
        };
    }

    global.AtanlyAds = {
        client: client,
        pubId: pubId,
        slot: slot,
        showAds: showAds,
        init: init
    };
})(window);
