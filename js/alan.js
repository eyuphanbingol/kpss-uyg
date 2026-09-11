(function (global) {
    var ALAN = [
        "Hukuk", "İktisat", "Maliye", "Muhasebe", "İşletme", "İstatistik",
        "Kamu Yönetimi", "Uluslararası İlişkiler", "ÇEKO"
    ];
    var AGS = [
        "AGS Sözel Yetenek", "AGS Sayısal Yetenek", "AGS Tarih", "AGS Türkiye Coğrafyası",
        "AGS Eğitim Bilimleri", "AGS Mevzuat"
    ];
    var OABT = [
        "ÖABT Türkçe", "ÖABT İlköğretim Matematik", "ÖABT Matematik", "ÖABT Fen Bilimleri",
        "ÖABT Fizik", "ÖABT Kimya", "ÖABT Biyoloji", "ÖABT Sosyal Bilgiler",
        "ÖABT Türk Dili ve Edebiyatı", "ÖABT Tarih", "ÖABT Coğrafya", "ÖABT DKAB / İHL",
        "ÖABT Rehberlik", "ÖABT Beden Eğitimi", "ÖABT Sınıf Öğretmenliği",
        "ÖABT Okul Öncesi", "ÖABT Özel Eğitim"
    ];
    var OGRETMEN = AGS.concat(OABT);
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
            if (isAlanDers(d) || isOgretmenDers(d)) return;
            out[d] = src[d];
        });
        return out;
    }
    function dersLabel(ders) {
        return String(ders || "").replace(/^AGS\s+/, "").replace(/^ÖABT\s+/, "");
    }
    function groupCatalogDersler(data) {
        var src = data || {};
        var have = {};
        Object.keys(src).forEach(function (d) { have[d] = true; });
        function pick(list) {
            return list.filter(function (d) { return have[d]; });
        }
        var ags = pick(AGS);
        var oabt = pick(OABT);
        var nested = {};
        ags.concat(oabt).forEach(function (d) { nested[d] = true; });
        var other = Object.keys(src).filter(function (d) { return !nested[d]; });
        var out = [];
        if (other.length) {
            out.push({ id: "gygk", title: (ags.length || oabt.length) ? "GY-GK" : "", dersler: other });
        }
        if (ags.length) out.push({ id: "ags", title: "AGS", dersler: ags });
        if (oabt.length) out.push({ id: "oabt", title: "ÖABT", dersler: oabt });
        return out;
    }
    global.AlanCatalog = {
        DERSLER: ALAN,
        AGS_DERSLER: AGS,
        OABT_DERSLER: OABT,
        OGRETMEN_DERSLER: OGRETMEN,
        isAlanDers: isAlanDers,
        isOgretmenDers: isOgretmenDers,
        isAlanUser: isAlanUser,
        isOgretmenUser: isOgretmenUser,
        filterCatalog: filterCatalog,
        dersLabel: dersLabel,
        groupCatalogDersler: groupCatalogDersler
    };
})(typeof window !== "undefined" ? window : globalThis);
