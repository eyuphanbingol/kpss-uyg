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
            email: ""
        },
        premiumEnabled: false,
        freeWeeklyExams: 2,
        freeDailyMixed: 3,
        examDateByLevel: {
            lisans: "2026-09-06",
            onlisans: "2026-10-04",
            ortaogretim: "2026-10-25"
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
