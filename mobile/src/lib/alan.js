export var ALAN_DERSLER = [
    "Hukuk",
    "İktisat",
    "Maliye",
    "Muhasebe",
    "İşletme",
    "İstatistik",
    "Kamu Yönetimi",
    "Uluslararası İlişkiler",
    "ÇEKO"
];

var SET = {};
ALAN_DERSLER.forEach(function (d) { SET[d] = true; });

export function isAlanDers(ders) {
    return !!SET[String(ders || "")];
}

export function isAlanUser(student) {
    var up = (student && student.userProfile) || {};
    if (up.targetType !== "A") return false;
    var edu = up.educationLevel;
    return !edu || edu === "lisans";
}

export function filterCatalog(data, student) {
    var src = data || {};
    if (isAlanUser(student)) return src;
    var out = {};
    Object.keys(src).forEach(function (d) {
        if (!isAlanDers(d)) out[d] = src[d];
    });
    return out;
}
