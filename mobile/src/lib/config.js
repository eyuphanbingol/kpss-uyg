export const KpssConfig = {
    supabaseUrl: "https://feblrqillsrfsbmrkjyc.supabase.co",
    supabaseAnonKey: "sb_publishable_3TaCTFJJiJtEdQtF_ZbCCw_Pxf-pzRE",
    appName: "Atanly",
    productionUrl: "https://kpss-uyg.vercel.app",
    premiumEnabled: false,
    // Gelir modeli: mağaza ve reklam kimlikleri (gizli değildir). RevenueCat anahtarı boşsa satın alma düğmeleri
    // gizlenir; AdMob birimi boşsa Google'ın test reklamı gösterilir (gelir yok). Ayrıntı: docs/play-store.md §8.
    // Kilitlerin açık/kapalı olduğu sunucudadır (monet_settings), burada değil.
    monetization: {
        revenueCat: { androidKey: "", iosKey: "" },
        admob: { rewardedAndroid: "", rewardedIos: "" }
    },
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

export const APP_CONFIG = {
    SUPABASE_URL: KpssConfig.supabaseUrl,
    SUPABASE_ANON_KEY: KpssConfig.supabaseAnonKey
};
