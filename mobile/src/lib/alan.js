export var ALAN_DERSLER = [
    "Hukuk", "İktisat", "Maliye", "Muhasebe", "İşletme", "İstatistik",
    "Kamu Yönetimi", "Uluslararası İlişkiler", "ÇEKO"
];
export var OGRETMEN_DERSLER = [
    "AGS Sözel Yetenek", "AGS Sayısal Yetenek", "AGS Tarih", "AGS Türkiye Coğrafyası",
    "AGS Eğitim Bilimleri", "AGS Mevzuat",
    "ÖABT Türkçe", "ÖABT İlköğretim Matematik", "ÖABT Matematik", "ÖABT Fen Bilimleri",
    "ÖABT Fizik", "ÖABT Kimya", "ÖABT Biyoloji", "ÖABT Sosyal Bilgiler",
    "ÖABT Türk Dili ve Edebiyatı", "ÖABT Tarih", "ÖABT Coğrafya", "ÖABT DKAB / İHL",
    "ÖABT Rehberlik", "ÖABT Beden Eğitimi", "ÖABT Sınıf Öğretmenliği",
    "ÖABT Okul Öncesi", "ÖABT Özel Eğitim"
];

var ALAN_SET = {}, OG_SET = {};
ALAN_DERSLER.forEach(function (d) { ALAN_SET[d] = true; });
OGRETMEN_DERSLER.forEach(function (d) { OG_SET[d] = true; });

function lis(student) {
    var up = (student && student.userProfile) || {};
    var edu = up.educationLevel;
    return !edu || edu === "lisans";
}
export function isAlanDers(ders) { return !!ALAN_SET[String(ders || "")]; }
export function isOgretmenDers(ders) { return !!OG_SET[String(ders || "")]; }
export function isAlanUser(student) {
    return lis(student) && ((student && student.userProfile) || {}).targetType === "A";
}
export function isOgretmenUser(student) {
    return lis(student) && ((student && student.userProfile) || {}).targetType === "ogretmen";
}
export function filterCatalog(data, student) {
    var src = data || {}, out = {};
    Object.keys(src).forEach(function (d) {
        if (isAlanDers(d) && !isAlanUser(student)) return;
        if (isOgretmenDers(d) && !isOgretmenUser(student)) return;
        out[d] = src[d];
    });
    return out;
}
