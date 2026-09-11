export const KpssConfig = {
    supabaseUrl: "https://feblrqillsrfsbmrkjyc.supabase.co",
    supabaseAnonKey: "sb_publishable_3TaCTFJJiJtEdQtF_ZbCCw_Pxf-pzRE",
    appName: "Atanly",
    productionUrl: "https://kpss-uyg.vercel.app",
    premiumEnabled: false,
    freeWeeklyExams: 2,
    freeDailyMixed: 3,
    examDateByLevel: {
        lisans: "2026-09-06",
        onlisans: "2026-10-04",
        ortaogretim: "2026-10-25"
    },
    modules: [
        { id: "gygk", title: "GY-GK", ready: true, lessons: ["Tarih", "Coğrafya", "Türkçe", "Vatandaşlık", "Güncel Bilgiler"] },
            { id: "alan", title: "A Grubu Alan", ready: true, lessons: ["Hukuk", "İktisat", "Maliye", "Muhasebe", "İşletme", "İstatistik", "Kamu Yönetimi", "Uluslararası İlişkiler", "ÇEKO"] },
            { id: "ags", title: "MEB-AGS", ready: true, lessons: ["AGS Sözel Yetenek", "AGS Sayısal Yetenek", "AGS Tarih", "AGS Türkiye Coğrafyası", "AGS Eğitim Bilimleri", "AGS Mevzuat"] },
            { id: "oabt", title: "ÖABT", ready: true, lessons: ["ÖABT Türkçe", "ÖABT İlköğretim Matematik", "ÖABT Matematik", "ÖABT Fen Bilimleri", "ÖABT Fizik", "ÖABT Kimya", "ÖABT Biyoloji", "ÖABT Sosyal Bilgiler", "ÖABT Türk Dili ve Edebiyatı", "ÖABT Tarih", "ÖABT Coğrafya", "ÖABT DKAB / İHL", "ÖABT Rehberlik", "ÖABT Beden Eğitimi", "ÖABT Sınıf Öğretmenliği", "ÖABT Okul Öncesi", "ÖABT Özel Eğitim"] },
            { id: "dhbt", title: "Din Hizmetleri (DHBT)", ready: false, lessons: [] }
    ],
    targetModules: {
        B: ["gygk"],
        A: ["gygk", "alan"],
            ogretmen: ["gygk", "ags", "oabt"],
        dhbt: ["gygk", "dhbt"]
    },
    targetTypes: [
        { id: "B", t: "B Grubu · GY-GK" },
        { id: "A", t: "A Grubu · Alan" },
            { id: "ogretmen", t: "Öğretmenlik · AGS + ÖABT" },
        { id: "dhbt", t: "DHBT" }
    ]
};

export const APP_CONFIG = {
    SUPABASE_URL: KpssConfig.supabaseUrl,
    SUPABASE_ANON_KEY: KpssConfig.supabaseAnonKey
};
