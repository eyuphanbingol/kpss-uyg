(function (global) {
    var DERSLER = [
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
    var set = {};
    DERSLER.forEach(function (d) { set[d] = true; });

    function isAlanDers(ders) {
        return !!set[String(ders || "")];
    }

    function isAlanUser(student) {
        var up = (student && student.userProfile) || {};
        if (up.targetType !== "A") return false;
        var edu = up.educationLevel;
        return !edu || edu === "lisans";
    }

    function filterCatalog(data, student) {
        var src = data || {};
        if (isAlanUser(student)) return src;
        var out = {};
        Object.keys(src).forEach(function (d) {
            if (!isAlanDers(d)) out[d] = src[d];
        });
        return out;
    }

    global.AlanCatalog = {
        DERSLER: DERSLER,
        isAlanDers: isAlanDers,
        isAlanUser: isAlanUser,
        filterCatalog: filterCatalog
    };
})(typeof window !== "undefined" ? window : globalThis);
