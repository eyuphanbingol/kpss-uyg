export var colors = {
    bg: "#FAFAF9",
    bgDark: "#211F1D",
    navy: "#0D2C4D",
    navyDeep: "#1E1B4B",
    teal: "#1D8A99",
    gold: "#C5A059",
    text: "#211F1D",
    muted: "#78716C",
    border: "#D3D0CB",
    white: "#FFFFFF",
    indigo: "#4F46E5",
    rose: "#E11D48",
    emerald: "#0F766E",
    amber: "#D97706"
};

export var DERS_ICON = {
    "Tarih": "🏛️",
    "Coğrafya": "🗺️",
    "Türkçe": "✍️",
    "Vatandaşlık": "⚖️",
    "Güncel Bilgiler": "📰"
};

export function masteryLabel(m) {
    if (m === "iyi") return { text: "İyi", color: "#0F766E" };
    if (m === "orta") return { text: "Orta", color: "#D97706" };
    if (m === "zayif") return { text: "Zayıf", color: "#E11D48" };
    return { text: "Yeni", color: "#78716C" };
}

export function eduLabel(id) {
    if (id === "onlisans") return "Ön lisans";
    if (id === "ortaogretim") return "Ortaöğretim";
    return "Lisans";
}

export function examTrackName(level) {
    if (level === "onlisans") return "Ön lisans KPSS";
    if (level === "ortaogretim") return "Ortaöğretim KPSS";
    return "Lisans KPSS";
}

export function needsKulvar(level) {
    return !level || level === "lisans";
}

export function fmtExam(iso) {
    if (!iso) return "—";
    var p = String(iso).split("-");
    if (p.length === 3) return p[2] + "." + p[1] + "." + p[0];
    return iso;
}

export function stripHtml(html) {
    return String(html || "")
        .replace(/<style[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/\s+/g, " ")
        .trim();
}
