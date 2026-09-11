(function (global) {
    var ALAN = [
        "Hukuk", "İktisat", "Maliye", "Muhasebe", "İşletme", "İstatistik",
        "Kamu Yönetimi", "Uluslararası İlişkiler", "ÇEKO"
    ];
    var OGRETMEN = [
        "AGS Sözel Yetenek", "AGS Sayısal Yetenek", "AGS Tarih", "AGS Türkiye Coğrafyası",
        "AGS Eğitim Bilimleri", "AGS Mevzuat",
        "ÖABT Türkçe", "ÖABT İlköğretim Matematik", "ÖABT Matematik", "ÖABT Fen Bilimleri",
        "ÖABT Fizik", "ÖABT Kimya", "ÖABT Biyoloji", "ÖABT Sosyal Bilgiler",
        "ÖABT Türk Dili ve Edebiyatı", "ÖABT Tarih", "ÖABT Coğrafya", "ÖABT DKAB / İHL",
        "ÖABT Rehberlik", "ÖABT Beden Eğitimi", "ÖABT Sınıf Öğretmenliği",
        "ÖABT Okul Öncesi", "ÖABT Özel Eğitim"
    ];
    var alanSet = {}, ogSet = {};
    ALAN.forEach(function (d) { alanSet[d] = true; });
    OGRETMEN.forEach(function (d) { ogSet[d] = true; });

    function lis(student) {
        var up = (student && student.userProfile) || {};
        var edu = up.educationLevel;
        return !edu || edu === "lisans";
    }
    function isAlanDers(ders) { return !!alanSet[String(ders || "")]; }
    function isOgretmenDers(ders) { return !!ogSet[String(ders || "")]; }
    function isAlanUser(student) {
        return lis(student) && ((student && student.userProfile) || {}).targetType === "A";
    }
    function isOgretmenUser(student) {
        return lis(student) && ((student && student.userProfile) || {}).targetType === "ogretmen";
    }
    function filterCatalog(data, student) {
        var src = data || {}, out = {};
        Object.keys(src).forEach(function (d) {
            if (isAlanDers(d) && !isAlanUser(student)) return;
            if (isOgretmenDers(d) && !isOgretmenUser(student)) return;
            out[d] = src[d];
        });
        return out;
    }
    global.AlanCatalog = {
        DERSLER: ALAN,
        OGRETMEN_DERSLER: OGRETMEN,
        isAlanDers: isAlanDers,
        isOgretmenDers: isOgretmenDers,
        isAlanUser: isAlanUser,
        isOgretmenUser: isOgretmenUser,
        filterCatalog: filterCatalog
    };
})(typeof window !== "undefined" ? window : globalThis);
