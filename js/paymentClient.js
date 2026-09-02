(function (global) {
    var mock = true;

    function checkout(planId) {
        if (mock) {
            if (global.StudentStore && global.StudentStore.grantMockPremium) {
                global.StudentStore.grantMockPremium(7);
            }
            return Promise.resolve({
                ok: true,
                mock: true,
                checkoutUrl: null,
                message: "Sandbox: 7 günlük Premium açıldı. Gerçek iyzico anahtarı yok; canlı ödemede bu satır Edge Function’a gider."
            });
        }
        return Promise.resolve({ ok: false });
    }

    function applyReferral(code) {
        var st = global.StudentStore.getState();
        global.StudentStore.updateUserProfile({ referredBy: String(code || "").slice(0, 16) });
        return { ok: true, bonusDays: 7, note: "Davet kodu kaydedildi. Sunucu onayından sonra premium gün işlenir." };
    }

    function myCode() {
        var st = global.StudentStore.getState();
        var nick = (st.userProfile.nickname || st.profile.name || "kpss").replace(/\s+/g, "").slice(0, 8);
        return ("KPSS-" + nick + "-24").toUpperCase();
    }

    global.PaymentClient = {
        mock: mock,
        checkout: checkout,
        applyReferral: applyReferral,
        myCode: myCode
    };
})(window);
