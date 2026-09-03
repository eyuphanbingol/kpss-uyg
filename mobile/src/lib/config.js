export const KpssConfig = {
    supabaseUrl: "https://feblrqillsrfsbmrkjyc.supabase.co",
    supabaseAnonKey: "sb_publishable_3TaCTFJJiJtEdQtF_ZbCCw_Pxf-pzRE",
    appName: "Atanly",
    productionUrl: "https://kpss-uyg.vercel.app",
    freeWeeklyExams: 2,
    freeDailyMixed: 3,
    examDateByLevel: {
        lisans: "2026-09-06",
        onlisans: "2026-10-04",
        ortaogretim: "2026-10-25"
    },
    modules: [
        { id: "gygk", title: "GY-GK", ready: true, lessons: ["Tarih", "Coğrafya", "Türkçe", "Vatandaşlık", "Güncel Bilgiler"] },
        { id: "alan", title: "A Grubu Alan", ready: false, lessons: ["Hukuk", "İktisat", "Maliye", "Muhasebe"] },
        { id: "egitim", title: "Eğitim Bilimleri", ready: false, lessons: ["Gelişim", "Öğrenme", "Program", "Ölçme"] },
        { id: "oabt", title: "ÖABT", ready: false, lessons: [] },
        { id: "dhbt", title: "Din Hizmetleri (DHBT)", ready: false, lessons: [] }
    ],
    targetModules: {
        B: ["gygk"],
        A: ["gygk", "alan"],
        ogretmen: ["gygk", "egitim", "oabt"],
        dhbt: ["gygk", "dhbt"]
    },
    targetTypes: [
        { id: "B", t: "B Grubu · GY-GK" },
        { id: "A", t: "A Grubu · Alan" },
        { id: "ogretmen", t: "Öğretmenlik · ÖABT" },
        { id: "dhbt", t: "DHBT" }
    ]
};

export const APP_CONFIG = {
    SUPABASE_URL: KpssConfig.supabaseUrl,
    SUPABASE_ANON_KEY: KpssConfig.supabaseAnonKey
};
