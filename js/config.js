(function (global) {
    var URL = "https://feblrqillsrfsbmrkjyc.supabase.co";
    var ANON = "sb_publishable_3TaCTFJJiJtEdQtF_ZbCCw_Pxf-pzRE";

    global.APP_CONFIG = {
        SUPABASE_URL: URL,
        SUPABASE_ANON_KEY: ANON
    };

    global.KpssConfig = {
        supabaseUrl: URL,
        supabaseAnonKey: ANON,
        appName: "Atanly",
        logoUrl: "icons/atanom.png?v=18",
        platform: "web",
        productionUrl: "https://www.atanly.com",
        allowedOrigins: [
            "https://www.atanly.com",
            "https://atanly.com",
            "https://kpss-uyg.vercel.app"
        ],
        legal: {
            operator: "Atanly işletmecisi",
            email: "atanly10@gmail.com"
        },
        premiumEnabled: false,
        // Uygulama mağaza sayfaları (Premium ekranındaki indirme bağlantıları; boşsa gösterilmez)
        stores: {
            play: "https://play.google.com/store/apps/details?id=app.atanly.mobile",
            appStore: ""
        },
        freeWeeklyExams: 2,
        freeDailyMixed: 3,
        // ÖSYM'nin açıkladığı sınav günü (YYYY-AA-GG). Boş: bir sonraki KPSS tarihi henüz açıklanmadı;
        // kullanıcı kendi hedef tarihini seçer. Açıklanınca buraya yazmak yeterli (web: js/config.js, mobil: mobile/src/lib/config.js).
        examDateByLevel: {
            lisans: "",
            onlisans: "",
            ortaogretim: ""
        },
        modules: [
            { id: "gygk", title: "GY-GK", ready: true, lessons: ["Tarih", "Coğrafya", "Türkçe", "Vatandaşlık", "Güncel Bilgiler", "Geometri"] }
        ],
        targetModules: {
            B: ["gygk"]
        },
        targetTypes: [
            { id: "B", t: "B Grubu · GY-GK" }
        ]
    };
})(window);
