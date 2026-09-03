
    var REGION_LABEL = {
        marmara: "Marmara",
        ege: "Ege",
        akdeniz: "Akdeniz",
        ic: "İç Anadolu",
        karadeniz: "Karadeniz",
        dogu: "Doğu Anadolu",
        guneydogu: "Güneydoğu Anadolu"
    };

    var PROVINCE_REGION = {
        TR01: "akdeniz", TR02: "guneydogu", TR03: "ege", TR04: "dogu", TR05: "karadeniz",
        TR06: "ic", TR07: "akdeniz", TR08: "karadeniz", TR09: "ege", TR10: "marmara",
        TR11: "marmara", TR12: "dogu", TR13: "dogu", TR14: "karadeniz", TR15: "akdeniz",
        TR16: "marmara", TR17: "marmara", TR18: "ic", TR19: "karadeniz", TR20: "ege",
        TR21: "guneydogu", TR22: "marmara", TR23: "dogu", TR24: "dogu", TR25: "dogu",
        TR26: "ic", TR27: "guneydogu", TR28: "karadeniz", TR29: "karadeniz", TR30: "dogu",
        TR31: "akdeniz", TR32: "akdeniz", TR33: "akdeniz", TR34: "marmara", TR35: "ege",
        TR36: "dogu", TR37: "karadeniz", TR38: "ic", TR39: "marmara", TR40: "ic",
        TR41: "marmara", TR42: "ic", TR43: "ege", TR44: "dogu", TR45: "ege",
        TR46: "akdeniz", TR47: "guneydogu", TR48: "ege", TR49: "dogu", TR50: "ic",
        TR51: "ic", TR52: "karadeniz", TR53: "karadeniz", TR54: "marmara", TR55: "karadeniz",
        TR56: "guneydogu", TR57: "karadeniz", TR58: "ic", TR59: "marmara", TR60: "karadeniz",
        TR61: "karadeniz", TR62: "dogu", TR63: "guneydogu", TR64: "ege", TR65: "dogu",
        TR66: "ic", TR67: "karadeniz", TR68: "ic", TR69: "karadeniz", TR70: "ic",
        TR71: "ic", TR72: "guneydogu", TR73: "guneydogu", TR74: "karadeniz", TR75: "dogu",
        TR76: "dogu", TR77: "marmara", TR78: "karadeniz", TR79: "guneydogu", TR80: "akdeniz",
        TR81: "karadeniz"
    };

    var NAMES = {
        TR01: "Adana", TR02: "Adıyaman", TR03: "Afyonkarahisar", TR04: "Ağrı", TR05: "Amasya",
        TR06: "Ankara", TR07: "Antalya", TR08: "Artvin", TR09: "Aydın", TR10: "Balıkesir",
        TR11: "Bilecik", TR12: "Bingöl", TR13: "Bitlis", TR14: "Bolu", TR15: "Burdur",
        TR16: "Bursa", TR17: "Çanakkale", TR18: "Çankırı", TR19: "Çorum", TR20: "Denizli",
        TR21: "Diyarbakır", TR22: "Edirne", TR23: "Elazığ", TR24: "Erzincan", TR25: "Erzurum",
        TR26: "Eskişehir", TR27: "Gaziantep", TR28: "Giresun", TR29: "Gümüşhane", TR30: "Hakkâri",
        TR31: "Hatay", TR32: "Isparta", TR33: "Mersin", TR34: "İstanbul", TR35: "İzmir",
        TR36: "Kars", TR37: "Kastamonu", TR38: "Kayseri", TR39: "Kırklareli", TR40: "Kırşehir",
        TR41: "Kocaeli", TR42: "Konya", TR43: "Kütahya", TR44: "Malatya", TR45: "Manisa",
        TR46: "Kahramanmaraş", TR47: "Mardin", TR48: "Muğla", TR49: "Muş", TR50: "Nevşehir",
        TR51: "Niğde", TR52: "Ordu", TR53: "Rize", TR54: "Sakarya", TR55: "Samsun",
        TR56: "Siirt", TR57: "Sinop", TR58: "Sivas", TR59: "Tekirdağ", TR60: "Tokat",
        TR61: "Trabzon", TR62: "Tunceli", TR63: "Şanlıurfa", TR64: "Uşak", TR65: "Van",
        TR66: "Yozgat", TR67: "Zonguldak", TR68: "Aksaray", TR69: "Bayburt", TR70: "Karaman",
        TR71: "Kırıkkale", TR72: "Batman", TR73: "Şırnak", TR74: "Bartın", TR75: "Ardahan",
        TR76: "Iğdır", TR77: "Yalova", TR78: "Karabük", TR79: "Kilis", TR80: "Osmaniye",
        TR81: "Düzce"
    };

    var BANK = [
        { prompt: "Ters olaylar (bakı tersliği vb.) bu bölgededir.", region: "karadeniz" },
        { prompt: "Alçak ve kalabalıktır.", region: "marmara" },
        { prompt: "Kırıklı fay hatları yaygın, geniş ovalar vardır.", region: "ege" },
        { prompt: "Karstik yapı yaygındır.", region: "akdeniz" },
        { prompt: "Düz ve kuraktır.", region: "guneydogu" },
        { prompt: "Yüksek ve volkaniktir.", region: "dogu" },
        { prompt: "Düzdür, etrafı dağlıktır.", region: "ic" },
        { prompt: "Teke ve Taşeli karstik platoları buradadır.", region: "akdeniz" },
        { prompt: "Erzurum–Kars–Ardahan platoları (en yüksek, yaz yağışı, büyükbaş mera).", region: "dogu" },
        { prompt: "Kapadokya / peri bacaları (Nevşehir çevresi).", region: "ic", codes: ["TR50"] },
        { prompt: "Ocak ayında en sıcak bölge.", region: "akdeniz" },
        { prompt: "Temmuzda en sıcak bölge (Samyeli / kesişleme).", region: "guneydogu" },
        { prompt: "Kışın en soğuk: Erzurum–Kars (Sibirya etkisi).", region: "dogu", codes: ["TR25", "TR36"] },
        { prompt: "Türkiye'nin en kalabalık kenti.", region: "marmara", codes: ["TR34"] },
        { prompt: "Ege'nin en büyük kenti, liman ve sanayi.", region: "ege", codes: ["TR35"] },
        { prompt: "Başkent.", region: "ic", codes: ["TR06"] },
        { prompt: "Çukurova (pamuk, turunçgil, erken sebze).", region: "akdeniz", codes: ["TR01", "TR33"] },
        { prompt: "Van Gölü çevresi.", region: "dogu", codes: ["TR65"] },
        { prompt: "GAP'ın merkezi ovaları (Harran).", region: "guneydogu", codes: ["TR63"] },
        { prompt: "Rize'de turunçgil (fön etkisi) — hangi bölge?", region: "karadeniz", codes: ["TR53"] },
        { prompt: "Karadeniz'de çay tarımı.", region: "karadeniz", codes: ["TR53", "TR08", "TR61"] },
        { prompt: "Akdeniz'de muz (kış ılıklığı) — Mersin/Anamur.", region: "akdeniz", codes: ["TR33"] },
        { prompt: "Antalya turizm ve seracılık kıyısı.", region: "akdeniz", codes: ["TR07"] },
        { prompt: "Zonguldak taşkömürü havzası.", region: "karadeniz", codes: ["TR67"] },
        { prompt: "Bursa (sanayi, ipek, otomotiv).", region: "marmara", codes: ["TR16"] },
        { prompt: "Konya ovası (tahıl ambarı).", region: "ic", codes: ["TR42"] },
        { prompt: "Kayseri (iç bölge sanayi / Erciyes).", region: "ic", codes: ["TR38"] },
        { prompt: "Adana.", region: "akdeniz", codes: ["TR01"] },
        { prompt: "Gaziantep (sanayi, antep fıstığı).", region: "guneydogu", codes: ["TR27"] },
        { prompt: "Trabzon (Doğu Karadeniz kıyısı).", region: "karadeniz", codes: ["TR61"] },
        { prompt: "Muğla / Bodrum–Fethiye turizm kıyısı.", region: "ege", codes: ["TR48"] },
        { prompt: "Şanlıurfa.", region: "guneydogu", codes: ["TR63"] },
        { prompt: "Elazığ / Keban çevresi.", region: "dogu", codes: ["TR23"] },
        { prompt: "Isparta (gül, göller yöresi).", region: "akdeniz", codes: ["TR32"] },
        { prompt: "Denizli (Pamukkale, tekstil).", region: "ege", codes: ["TR20"] }
    ];

    function shuffle(arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a;
    }

    function regionOfCode(code) {
        return PROVINCE_REGION[String(code || "").toUpperCase()] || null;
    }

    function isCorrect(item, code) {
        var c = String(code || "").toUpperCase();
        if (item.codes && item.codes.length) {
            return item.codes.indexOf(c) >= 0;
        }
        return regionOfCode(c) === item.region;
    }

    function pickRound(n) {
        return shuffle(BANK).slice(0, n || 10);
    }

    function hintCodes(item) {
        if (item.codes && item.codes.length) return item.codes;
        return Object.keys(PROVINCE_REGION).filter(function (k) { return PROVINCE_REGION[k] === item.region; });
    }

    function nameOf(code) {
        return NAMES[String(code || "").toUpperCase()] || code;
    }

    function answerLabel(item) {
        if (item.codes && item.codes.length) {
            return item.codes.map(nameOf).join(" / ");
        }
        return (REGION_LABEL[item.region] || item.region) + " bölgesi";
    }

    function tapChoices(item) {
        if (item.codes && item.codes.length) {
            var extra = shuffle(Object.keys(NAMES).filter(function (k) {
                return item.codes.indexOf(k) < 0;
            })).slice(0, 5);
            return shuffle(item.codes.concat(extra)).map(function (c) {
                return { kind: "code", id: c, label: nameOf(c) };
            });
        }
        return Object.keys(REGION_LABEL).map(function (r) {
            return { kind: "region", id: r, label: REGION_LABEL[r] };
        });
    }

    function isTapCorrect(item, choice) {
        if (!choice) return false;
        if (choice.kind === "code") return isCorrect(item, choice.id);
        return choice.id === item.region;
    }

    var api = {
        REGION_LABEL: REGION_LABEL,
        PROVINCE_REGION: PROVINCE_REGION,
        NAMES: NAMES,
        BANK: BANK,
        pickRound: pickRound,
        isCorrect: isCorrect,
        regionOfCode: regionOfCode,
        hintCodes: hintCodes,
        nameOf: nameOf,
        answerLabel: answerLabel,
        tapChoices: tapChoices,
        isTapCorrect: isTapCorrect
    };
export const MapQuiz = api;
