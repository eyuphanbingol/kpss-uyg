(function (global) {
    var REGION_LABEL = {
        marmara: "Marmara", ege: "Ege", akdeniz: "Akdeniz", ic: "İç Anadolu",
        karadeniz: "Karadeniz", dogu: "Doğu Anadolu", guneydogu: "Güneydoğu Anadolu"
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

    var PROVINCE_LL = {
        TR01: [35.32, 37.00], TR02: [38.28, 37.76], TR03: [30.53, 38.76], TR04: [43.05, 39.72], TR05: [35.83, 40.65],
        TR06: [32.85, 39.93], TR07: [30.71, 36.90], TR08: [41.82, 41.18], TR09: [27.84, 37.84], TR10: [27.88, 39.65],
        TR11: [29.98, 40.14], TR12: [40.50, 38.89], TR13: [42.11, 38.40], TR14: [31.61, 40.73], TR15: [30.29, 37.72],
        TR16: [29.06, 40.19], TR17: [26.41, 40.16], TR18: [33.61, 40.60], TR19: [34.95, 40.55], TR20: [29.09, 37.78],
        TR21: [40.23, 37.91], TR22: [26.56, 41.68], TR23: [39.22, 38.67], TR24: [39.49, 39.75], TR25: [41.27, 39.91],
        TR26: [30.52, 39.78], TR27: [37.38, 37.07], TR28: [38.39, 40.91], TR29: [39.47, 40.46], TR30: [43.74, 37.57],
        TR31: [36.16, 36.20], TR32: [30.55, 37.76], TR33: [34.63, 36.81], TR34: [28.98, 41.01], TR35: [27.14, 38.42],
        TR36: [43.10, 40.60], TR37: [33.78, 41.38], TR38: [35.49, 38.73], TR39: [27.23, 41.73], TR40: [34.16, 39.15],
        TR41: [29.92, 40.77], TR42: [32.49, 37.87], TR43: [29.98, 39.42], TR44: [38.31, 38.35], TR45: [27.43, 38.61],
        TR46: [36.92, 37.59], TR47: [40.73, 37.31], TR48: [28.37, 37.22], TR49: [41.49, 38.74], TR50: [34.71, 38.62],
        TR51: [34.68, 37.97], TR52: [37.88, 40.98], TR53: [40.52, 41.02], TR54: [30.40, 40.76], TR55: [36.33, 41.29],
        TR56: [41.94, 37.93], TR57: [35.15, 42.03], TR58: [37.02, 39.75], TR59: [27.51, 40.98], TR60: [36.55, 40.32],
        TR61: [39.72, 41.00], TR62: [39.54, 39.11], TR63: [38.79, 37.17], TR64: [29.41, 38.67], TR65: [43.41, 38.50],
        TR66: [34.81, 39.82], TR67: [31.79, 41.46], TR68: [34.03, 38.37], TR69: [40.23, 40.26], TR70: [33.22, 37.18],
        TR71: [33.51, 39.85], TR72: [41.14, 37.88], TR73: [42.45, 37.52], TR74: [32.34, 41.64], TR75: [42.70, 41.11],
        TR76: [44.04, 39.92], TR77: [29.27, 40.65], TR78: [32.63, 41.20], TR79: [37.12, 36.72], TR80: [36.25, 37.07],
        TR81: [31.16, 40.84]
    };

    var ITEM_LL = {
        "Ağrı Dağı": [44.30, 39.70], "Tendürek Dağı": [43.87, 39.35], "Süphan Dağı": [42.83, 38.93],
        "Nemrut Dağı (volkan)": [42.02, 38.62], "Erciyes Dağı": [35.45, 38.53], "Hasan Dağı": [34.17, 38.13],
        "Melendiz Dağı": [34.63, 38.37], "Karadağ": [33.18, 37.40], "Karacadağ": [39.83, 37.75],
        "Göllüdağ": [34.55, 38.26], "Kula volkanları": [28.65, 38.55],
        "Bozdağlar": [28.05, 38.32], "Aydın Dağları": [27.95, 37.95], "Madra Dağları": [27.20, 39.35],
        "Yunt Dağları": [27.20, 38.90], "Honaz Dağı": [29.27, 37.68], "Menteşe Dağları": [28.20, 37.15],
        "Yıldız Dağları": [27.50, 41.75], "Küre Dağları": [33.20, 41.55], "Ilgaz Dağları": [33.65, 41.05],
        "Köroğlu Dağları": [31.80, 40.55], "Canik Dağları": [36.80, 40.85], "Giresun Dağları": [38.40, 40.55],
        "Kaçkar Dağları": [41.20, 40.85], "Beydağları": [30.12, 36.70], "Bolkar Dağları": [34.35, 37.40],
        "Aladağlar": [35.20, 37.80], "Amanoslar": [36.25, 36.75],
        "Haymana Platosu": [32.50, 39.43], "Cihanbeyli Platosu": [32.80, 38.65], "Obruk Platosu": [33.20, 38.20],
        "Bozok Platosu": [35.20, 39.70], "Uzunyayla": [37.00, 38.80],
        "Erzurum-Kars Platosu": [41.80, 40.40], "Ardahan Platosu": [42.70, 41.11],
        "Gaziantep Platosu": [37.38, 37.20], "Şanlıurfa Platosu": [38.79, 37.30], "Mardin-Midyat Eşiği": [41.05, 37.45],
        "Taşeli Platosu": [33.20, 36.55],
        "Bafra Deltası": [35.90, 41.57], "Çarşamba Deltası": [36.72, 41.20], "Çukurova Deltası": [35.40, 36.78],
        "Silifke Deltası": [33.93, 36.38], "Menemen Deltası": [27.07, 38.58], "Söke / Balat Deltası": [27.40, 37.48],
        "Selçuk Deltası": [27.37, 37.95],
        "Kızılırmak": [36.10, 41.55], "Yeşilırmak": [36.65, 41.22], "Sakarya": [30.40, 41.12],
        "Gediz": [27.10, 38.60], "Büyük Menderes": [27.30, 37.55], "Küçük Menderes": [27.35, 37.95],
        "Seyhan": [35.33, 36.78], "Ceyhan": [35.82, 36.85], "Göksu": [33.93, 36.38], "Asi": [36.20, 36.25],
        "Fırat": [38.25, 37.00], "Dicle": [40.55, 37.90], "Aras": [44.10, 39.95],
        "Van Gölü": [43.00, 38.63], "Tuz Gölü": [33.40, 38.75], "Beyşehir Gölü": [31.50, 37.70],
        "Eğirdir Gölü": [30.85, 37.85], "İznik Gölü": [29.52, 40.43], "Sapanca Gölü": [30.26, 40.72],
        "Manyas (Kuş) Gölü": [28.00, 40.18], "Burdur Gölü": [30.20, 37.73],
        "Bafra Ovası": [35.90, 41.50], "Çarşamba Ovası": [36.72, 41.15], "Çukurova": [35.40, 36.85],
        "Harran Ovası": [39.05, 36.86], "Ergene Ovası": [26.90, 41.15],
        "Kapadokya": [34.83, 38.67], "Zigana Geçidi": [39.40, 40.65], "Kop Geçidi": [40.20, 40.05],
        "Gülek Boğazı": [34.80, 37.28], "Sertavul Geçidi": [33.30, 36.90], "Belen Geçidi": [36.22, 36.48],
        "Kızılırmak → Bafra": [35.90, 41.57], "Yeşilırmak → Çarşamba": [36.72, 41.20]
    };

    var TREE = [
        {
            id: "yer", title: "Yer şekilleri", icon: "🗻",
            kids: [
                { id: "volkanik", title: "Volkanik dağlar", icon: "🌋" },
                { id: "kirik", title: "Kırık dağlar", icon: "↗️" },
                { id: "kivrim", title: "Kıvrım dağlar", icon: "🌊" },
                { id: "masif", title: "Masif araziler", icon: "🪨" },
                { id: "plato-ic", title: "İç Anadolu platoları", icon: "🏜️" },
                { id: "plato-dogu", title: "Doğu Anadolu platoları", icon: "🏜️" },
                { id: "plato-gd", title: "Güneydoğu platoları", icon: "🏜️" },
                { id: "plato-akdeniz", title: "Akdeniz platoları", icon: "🏜️" },
                { id: "ovalar", title: "Ovalar", icon: "🌾" },
                { id: "delta", title: "Delta ovaları", icon: "🌊" },
                { id: "karst", title: "Karstik alanlar", icon: "🪨" },
                { id: "volkanik-arazi", title: "Volkanik araziler", icon: "🌋" }
            ]
        },
        {
            id: "su", title: "Sular", icon: "💧",
            kids: [
                { id: "akarsu", title: "Akarsular", icon: "💧" },
                { id: "goller", title: "Göller", icon: "🏞️" },
                { id: "havza", title: "Havzalar", icon: "🌊" },
                { id: "gecit", title: "Geçitler", icon: "🏔️" },
                { id: "kiyi", title: "Kıyı tipleri", icon: "🏖️" }
            ]
        },
        {
            id: "canli", title: "Bitki · tarım · toprak", icon: "🌱",
            kids: [
                { id: "bitki", title: "Bitki örtüsü", icon: "🌱" },
                { id: "tarim", title: "Tarım ürünleri", icon: "🌾" },
                { id: "toprak", title: "Toprak tipleri", icon: "🟤" }
            ]
        },
        {
            id: "koruma", title: "Milli parklar", icon: "🏞️",
            kids: [
                { id: "milli", title: "Tümü (54 park)", icon: "🏞️" },
                { id: "milli-marmara", title: "Marmara", icon: "🏞️" },
                { id: "milli-ege", title: "Ege", icon: "🏞️" },
                { id: "milli-akdeniz", title: "Akdeniz", icon: "🏞️" },
                { id: "milli-ic", title: "İç Anadolu", icon: "🏞️" },
                { id: "milli-karadeniz", title: "Karadeniz", icon: "🏞️" },
                { id: "milli-dogu", title: "Doğu Anadolu", icon: "🏞️" },
                { id: "milli-guneydogu", title: "Güneydoğu", icon: "🏞️" }
            ]
        },
        {
            id: "kpss", title: "KPSS tuzakları", icon: "🧠",
            kids: [
                { id: "tuzak", title: "İstisnalar ve karışanlar", icon: "🧠" }
            ]
        }
    ];

    function shuffle(arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a;
    }

    function fold(s) {
        return String(s || "").toLocaleLowerCase("tr-TR")
            .replace(/â/g, "a").replace(/î/g, "i").replace(/û/g, "u")
            .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u")
            .replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
            .replace(/[^a-z0-9]+/g, " ").trim();
    }

    var NAME_TO_CODE = {};
    Object.keys(NAMES).forEach(function (k) { NAME_TO_CODE[fold(NAMES[k])] = k; });
    NAME_TO_CODE[fold("Hakkari")] = "TR30";
    NAME_TO_CODE[fold("Igdir")] = "TR76";
    NAME_TO_CODE[fold("Sanliurfa")] = "TR63";
    NAME_TO_CODE[fold("Kahramanmaras")] = "TR46";
    NAME_TO_CODE[fold("Afyon")] = "TR03";
    NAME_TO_CODE[fold("Icel")] = "TR33";
    NAME_TO_CODE[fold("K.Maras")] = "TR46";

    function codesFromPlaces(text) {
        if (!text) return [];
        var parts = String(text).split(/[-–,\/]| ve /i);
        var out = [];
        parts.forEach(function (p) {
            var c = NAME_TO_CODE[fold(p)];
            if (c && out.indexOf(c) < 0) out.push(c);
        });
        return out;
    }

    function regionOfCode(code) {
        return PROVINCE_REGION[String(code || "").toUpperCase()] || null;
    }

    function codesOfRegion(region) {
        return Object.keys(PROVINCE_REGION).filter(function (k) { return PROVINCE_REGION[k] === region; });
    }

    function F(topic, name, places, extra) {
        extra = extra || {};
        var codes = extra.codes || codesFromPlaces(places);
        var region = extra.region || (codes[0] ? regionOfCode(codes[0]) : null);
        var prompt = extra.prompt || (name + " nerede? Haritada bul.");
        return {
            topic: topic,
            name: name,
            prompt: prompt,
            codes: codes,
            region: region,
            places: places || "",
            follow: extra.follow || null,
            mcq: extra.mcq || false,
            choices: extra.choices || null,
            answer: extra.answer || null
        };
    }

    var ITEMS = [];

    [
        ["Ağrı Dağı", "Ağrı-Iğdır", { follow: { q: "Türkiye'nin en yüksek dağı hangisidir?", choices: ["Erciyes", "Süphan", "Ağrı Dağı", "Kaçkar"], answer: "Ağrı Dağı" } }],
        ["Tendürek Dağı", "Ağrı-Van", null],
        ["Süphan Dağı", "Bitlis-Van", { follow: { q: "Süphan ve Nemrut hangi bölgededir?", choices: ["Ege", "İç Anadolu", "Doğu Anadolu", "Akdeniz"], answer: "Doğu Anadolu" } }],
        ["Nemrut Dağı (volkan)", "Bitlis", { prompt: "Bitlis'teki volkanik Nemrut Dağı'nı bul. (Adıyaman'daki Nemrut ile karıştırma.)" }],
        ["Erciyes Dağı", "Kayseri", { follow: { q: "Erciyes'in oluşum tipi nedir?", choices: ["Kıvrım", "Kırık", "Volkanik", "Karstik"], answer: "Volkanik" } }],
        ["Hasan Dağı", "Aksaray-Niğde", null],
        ["Melendiz Dağı", "Niğde", null],
        ["Karadağ", "Karaman", null],
        ["Karacadağ", "Diyarbakır-Şanlıurfa", null],
        ["Göllüdağ", "Niğde", null],
        ["Kula volkanları", "Manisa", { follow: { q: "Volkanik dağ ile volkanik arazi aynı şey midir?", choices: ["Evet, aynıdır", "Hayır; Erciyes dağ, Kapadokya aşınım alanıdır"], answer: "Hayır; Erciyes dağ, Kapadokya aşınım alanıdır" } }]
    ].forEach(function (r) { ITEMS.push(F("volkanik", r[0], r[1], r[2] || {})); });

    [
        ["Bozdağlar", "İzmir-Manisa", { follow: { q: "Ege'de dağ ve ovaların uzanış yönü?", choices: ["Kuzey-güney", "Doğu-batı", "Rastgele", "Sadece kıyıya paralel"], answer: "Doğu-batı" } }],
        ["Aydın Dağları", "Aydın", null],
        ["Madra Dağları", "Balıkesir-İzmir", null],
        ["Yunt Dağları", "Manisa", null],
        ["Honaz Dağı", "Denizli", null],
        ["Menteşe Dağları", "Muğla", null]
    ].forEach(function (r) { ITEMS.push(F("kirik", r[0], r[1], r[2] || {})); });

    [
        ["Yıldız Dağları", "Kırklareli", "kivrim"],
        ["Küre Dağları", "Kastamonu-Bartın", "kivrim"],
        ["Ilgaz Dağları", "Kastamonu-Çankırı", "kivrim"],
        ["Köroğlu Dağları", "Bolu", "kivrim"],
        ["Canik Dağları", "Samsun-Ordu", "kivrim"],
        ["Giresun Dağları", "Giresun", "kivrim"],
        ["Kaçkar Dağları", "Rize-Artvin", "kivrim"],
        ["Beydağları", "Antalya", "kivrim"],
        ["Bolkar Dağları", "Niğde-Mersin", "kivrim"],
        ["Aladağlar", "Niğde-Adana-Kayseri", "kivrim"],
        ["Amanoslar", "Hatay-Osmaniye", "kivrim"]
    ].forEach(function (r) { ITEMS.push(F(r[2], r[0], r[1])); });

    [
        ["Istranca / Yıldız masifi", "Kırklareli"],
        ["Menderes Masifi", "Aydın-Denizli"],
        ["Kazdağı Masifi", "Balıkesir-Çanakkale"],
        ["Uludağ çevresi", "Bursa"],
        ["Kırşehir Masifi", "Kırşehir"],
        ["Bitlis Masifi", "Bitlis"]
    ].forEach(function (r) { ITEMS.push(F("masif", r[0], r[1])); });

    [
        ["Haymana Platosu", "Ankara"],
        ["Cihanbeyli Platosu", "Konya"],
        ["Obruk Platosu", "Konya"],
        ["Bozok Platosu", "Yozgat"],
        ["Uzunyayla", "Sivas-Kayseri"]
    ].forEach(function (r) { ITEMS.push(F("plato-ic", r[0], r[1])); });

    [
        ["Erzurum-Kars Platosu", "Erzurum-Kars", { follow: { q: "Bu platonun hayvancılık tipi?", choices: ["Küçükbaş ağırlıklı", "Büyükbaş / mera", "Sadece kümes", "Sera"], answer: "Büyükbaş / mera" } }],
        ["Ardahan Platosu", "Ardahan", null]
    ].forEach(function (r) { ITEMS.push(F("plato-dogu", r[0], r[1], r[2] || {})); });

    [
        ["Gaziantep Platosu", "Gaziantep"],
        ["Şanlıurfa Platosu", "Şanlıurfa"],
        ["Mardin-Midyat Eşiği", "Mardin"]
    ].forEach(function (r) { ITEMS.push(F("plato-gd", r[0], r[1])); });

    ITEMS.push(F("plato-akdeniz", "Taşeli Platosu", "Mersin-Antalya", { prompt: "Mersin–Antalya arasında, Toroslara yakın Taşeli Platosu'nu bul." }));

    [
        ["Bursa Ovası", "Bursa"], ["Ergene Ovası", "Tekirdağ-Edirne"], ["Adapazarı Ovası", "Sakarya"],
        ["Bakırçay Ovası", "İzmir"], ["Gediz Ovası", "Manisa-İzmir"], ["Büyük Menderes Ovası", "Aydın"],
        ["Konya Ovası", "Konya"], ["Ankara Ovası", "Ankara"],
        ["Çarşamba Ovası", "Samsun"], ["Bafra Ovası", "Samsun"],
        ["Çukurova", "Adana-Mersin"], ["Amik Ovası", "Hatay"], ["Antalya Ovası", "Antalya"],
        ["Erzurum Ovası", "Erzurum"], ["Iğdır Ovası", "Iğdır"], ["Malatya Ovası", "Malatya"],
        ["Harran Ovası", "Şanlıurfa"], ["Suruç Ovası", "Şanlıurfa"]
    ].forEach(function (r) { ITEMS.push(F("ovalar", r[0], r[1])); });

    [
        ["Bafra Deltası", "Samsun", { prompt: "Kızılırmak'ın oluşturduğu deltayı bul.", follow: { q: "Bafra'yı hangi akarsu oluşturur?", choices: ["Yeşilırmak", "Kızılırmak", "Sakarya", "Gediz"], answer: "Kızılırmak" } }],
        ["Çarşamba Deltası", "Samsun", { prompt: "Yeşilırmak'ın oluşturduğu deltayı bul.", follow: { q: "Çarşamba'yı hangi akarsu oluşturur?", choices: ["Kızılırmak", "Yeşilırmak", "Göksu", "Seyhan"], answer: "Yeşilırmak" } }],
        ["Çukurova Deltası", "Adana-Mersin", { prompt: "Seyhan ve Ceyhan'ın oluşturduğu deltayı bul.", follow: { q: "Çukurova'yı oluşturan akarsular?", choices: ["Kızılırmak", "Seyhan + Ceyhan", "Göksu", "Gediz"], answer: "Seyhan + Ceyhan" } }],
        ["Silifke Deltası", "Mersin", { prompt: "Göksu'nun oluşturduğu deltayı bul." }],
        ["Menemen Deltası", "İzmir", { prompt: "Gediz'in oluşturduğu deltayı (Menemen) bul." }],
        ["Söke / Balat Deltası", "Aydın", { prompt: "Büyük Menderes deltasını (Söke–Balat) bul." }],
        ["Selçuk Deltası", "İzmir", { prompt: "Küçük Menderes deltasını (Selçuk) bul." }]
    ].forEach(function (r) { ITEMS.push(F("delta", r[0], r[1], r[2])); });

    ITEMS.push(F("karst", "Taşeli karstik alanları", "Mersin-Antalya", { prompt: "Karstik yapının yaygın olduğu Taşeli–Akdeniz kuşağını bul." }));
    ITEMS.push(F("karst", "Teke Yarımadası", "Antalya", { prompt: "Teke Yarımadası karstik alanını bul." }));
    ITEMS.push(F("volkanik-arazi", "Kapadokya", "Nevşehir", { prompt: "Volkanik tüflerin aşındığı Kapadokya'yı bul. (Erciyes dağdır, burası arazi.)", follow: { q: "Kapadokya neyin örneğidir?", choices: ["Volkanik dağ", "Volkanik tüf aşınım alanı", "Kırık dağ", "Delta"], answer: "Volkanik tüf aşınım alanı" } }));

    [
        ["Kızılırmak", "Samsun", { prompt: "Karadeniz'e dökülen Kızılırmak'ın ağzını (Bafra / Samsun) bul." }],
        ["Yeşilırmak", "Samsun", { prompt: "Yeşilırmak'ın Karadeniz'e döküldüğü alanı (Çarşamba) bul." }],
        ["Sakarya", "Sakarya", { prompt: "Sakarya Nehri'nin döküldüğü ili bul." }],
        ["Gediz", "İzmir"], ["Büyük Menderes", "Aydın"], ["Küçük Menderes", "İzmir"],
        ["Seyhan", "Adana"], ["Ceyhan", "Adana"], ["Göksu", "Mersin"], ["Asi", "Hatay"],
        ["Fırat", "Şanlıurfa"], ["Dicle", "Diyarbakır"], ["Aras", "Iğdır"]
    ].forEach(function (r) { ITEMS.push(F("akarsu", r[0], r[1], r[2] || {})); });

    [
        ["Van Gölü", "Van"], ["Tuz Gölü", "Aksaray-Konya"], ["Beyşehir Gölü", "Konya"],
        ["Eğirdir Gölü", "Isparta"], ["İznik Gölü", "Bursa"], ["Sapanca Gölü", "Sakarya"],
        ["Manyas (Kuş) Gölü", "Balıkesir"], ["Burdur Gölü", "Burdur"]
    ].forEach(function (r) { ITEMS.push(F("goller", r[0], r[1])); });

    [
        ["Tuz Gölü kapalı havzası", "Aksaray", { prompt: "İç Anadolu'daki önemli kapalı havzayı (Tuz Gölü) bul." }],
        ["Van Gölü havzası", "Van", { prompt: "Doğu Anadolu'daki kapalı göl havzasını bul." }]
    ].forEach(function (r) { ITEMS.push(F("havza", r[0], r[1], r[2])); });

    [
        ["Zigana Geçidi", "Trabzon-Gümüşhane"],
        ["Kop Geçidi", "Bayburt-Erzurum"],
        ["Gülek Boğazı", "Mersin"],
        ["Sertavul Geçidi", "Karaman"],
        ["Belen Geçidi", "Hatay"]
    ].forEach(function (r) { ITEMS.push(F("gecit", r[0], r[1])); });

    ITEMS.push(F("kiyi", "Ria (dalmaçya) kıyı", "Muğla-İzmir", { prompt: "Ege'de enine kıyı / ria karakterinin görüldüğü ili bul.", region: "ege" }));
    ITEMS.push(F("kiyi", "Boyuna kıyı", "Antalya", { prompt: "Akdeniz'de kıyıya paralel (boyuna) kıyı örneğini bul." }));

    ITEMS.push(F("bitki", "Doğu Karadeniz ormanı", "Rize", { prompt: "Gür ormanın tipik olduğu Doğu Karadeniz ilini bul.", follow: { q: "Karadeniz'in doğal bitki örtüsü?", choices: ["Maki", "Bozkır", "Orman", "Çöl"], answer: "Orman" } }));
    ITEMS.push(F("bitki", "Maki alanı", "Antalya", { prompt: "Maki bitki örtüsünün tipik olduğu ili bul.", region: "akdeniz", follow: { q: "Hangisi maki elemanıdır?", choices: ["Ladin", "Zakkum", "Kayın", "Sarıçam"], answer: "Zakkum" } }));
    ITEMS.push(F("bitki", "İç Anadolu bozkırı", "Konya", { prompt: "Bozkırın tipik olduğu İç Anadolu ilini bul.", follow: { q: "İç Anadolu'nun doğal bitkisi?", choices: ["Maki", "Bozkır", "Mangrov", "Yağmur ormanı"], answer: "Bozkır" } }));
    ITEMS.push(F("bitki", "Erzurum-Kars çayırı", "Erzurum-Kars", { prompt: "Çayır örtüsünün güçlü olduğu yüksek alanı bul." }));

    [
        ["Çay", "Rize", { prompt: "Çayın temel üretim alanını bul." }],
        ["Fındık", "Ordu-Giresun-Trabzon", { prompt: "Fındığın ana üretim kuşağını bul." }],
        ["Zeytin", "İzmir-Aydın-Balıkesir", { prompt: "Zeytinin önemli olduğu Ege/Güney Marmara ilini bul." }],
        ["Turunçgil", "Antalya-Mersin-Adana-Hatay", { prompt: "Turunçgilin yoğun olduğu Akdeniz ilini bul." }],
        ["Muz", "Mersin", { prompt: "Muzun (Anamur) yetiştiği ili bul." }],
        ["Üzüm", "Manisa", { prompt: "Üzüm üretiminde öne çıkan ili bul." }],
        ["Elma", "Isparta-Niğde-Karaman", { prompt: "Elma üretiminde öne çıkan ili bul." }],
        ["Ayçiçeği", "Tekirdağ-Edirne", { prompt: "Ayçiçeğinin (Trakya) alanını bul." }],
        ["Buğday", "Konya", { prompt: "Buğday ambarı olarak anılan ova ilini bul." }],
        ["Mısır / pamuk (Çukurova)", "Adana", { prompt: "Çukurova tarım alanını bul." }],
        ["Patates", "Niğde-Nevşehir", { prompt: "Patatesin öne çıktığı ili bul." }],
        ["Şeker pancarı", "Konya-Eskişehir", { prompt: "Şeker pancarının önemli olduğu ili bul." }],
        ["Pamuk (GAP)", "Şanlıurfa", { prompt: "GAP pamuğunun merkezi ova ilini bul." }],
        ["Antep fıstığı", "Gaziantep-Şanlıurfa-Siirt", { prompt: "Antep fıstığının önemli olduğu ili bul." }],
        ["Mercimek", "Şanlıurfa-Diyarbakır", { prompt: "Mercimeğin yoğun olduğu Güneydoğu ilini bul." }]
    ].forEach(function (r) { ITEMS.push(F("tarim", r[0], r[1], r[2])); });

    ITEMS.push(F("toprak", "Terra Rossa", "Antalya-Mersin-Adana", { prompt: "Terra rossanın yaygın olduğu Akdeniz ilini bul.", follow: { q: "Terra rossa hangi ana kaya üzerinde oluşur?", choices: ["Granit", "Kalker", "Bazalt", "Tuz"], answer: "Kalker" } }));
    ITEMS.push(F("toprak", "Kahverengi orman toprağı", "Zonguldak-Kastamonu", { prompt: "Orman altı kahverengi toprakların tipik olduğu Karadeniz ilini bul." }));
    ITEMS.push(F("toprak", "Bozkır toprakları", "Konya-Ankara", { prompt: "Kestane/kahverengi bozkır topraklarının alanını bul." }));
    ITEMS.push(F("toprak", "Çernezyom", "Erzurum-Kars", { prompt: "Çernezyomun özdeşleştiği alanı bul." }));
    ITEMS.push(F("toprak", "Tuzlu toprak", "Aksaray", { prompt: "Tuz Gölü çevresi tuzlu toprakları bul." }));
    ITEMS.push(F("toprak", "Alüvyal (Bafra)", "Samsun", { prompt: "Alüvyal toprağın tipik olduğu delta ilini (Bafra/Çarşamba) bul." }));

    var PARKS = [
        ["Nemrut Dağı", "Adıyaman-Malatya", "guneydogu"],
        ["Akdağ", "Afyonkarahisar-Denizli", "ege"],
        ["Başkomutan Tarihi Milli Parkı", "Afyonkarahisar-Kütahya-Uşak", "ege"],
        ["Ağrı Dağı", "Ağrı-Iğdır", "dogu"],
        ["Soğuksu", "Ankara", "ic"],
        ["Sakarya Meydan Muharebesi TMP", "Ankara", "ic"],
        ["Sarıçalı Dağı", "Ankara", "ic"],
        ["Güllük Dağı-Termessos", "Antalya", "akdeniz"],
        ["Beydağları Sahil", "Antalya", "akdeniz"],
        ["Altınbeşik Mağarası", "Antalya", "akdeniz"],
        ["Köprülü Kanyon", "Antalya-Isparta", "akdeniz"],
        ["Hatila Vadisi", "Artvin", "karadeniz"],
        ["Kaçkar Dağları", "Artvin", "karadeniz"],
        ["Dilek Yarımadası-Büyük Menderes", "Aydın", "ege"],
        ["Kuşcenneti", "Balıkesir", "marmara"],
        ["Kazdağı", "Balıkesir", "marmara"],
        ["Kop Dağı Müdafaası TMP", "Bayburt-Erzurum", "dogu"],
        ["Yedigöller", "Bolu", "karadeniz"],
        ["Abant Gölü", "Bolu", "karadeniz"],
        ["Uludağ", "Bursa", "marmara"],
        ["Troya TMP", "Çanakkale", "marmara"],
        ["Boğazköy-Alacahöyük", "Çorum", "karadeniz"],
        ["Honaz Dağı", "Denizli", "ege"],
        ["Gala Gölü", "Edirne", "marmara"],
        ["Nene Hatun TMP", "Erzurum", "dogu"],
        ["Hakkari Cilo ve Sat Dağları", "Hakkâri", "dogu"],
        ["Kızıldağ", "Isparta", "akdeniz"],
        ["Kovada Gölü", "Isparta", "akdeniz"],
        ["Geben Vadisi", "Kahramanmaraş", "akdeniz"],
        ["Sarıkamış-Allahuekber Dağları", "Kars-Erzurum", "dogu"],
        ["Küre Dağları", "Kastamonu-Bartın", "karadeniz"],
        ["Ilgaz Dağı", "Kastamonu-Çankırı", "karadeniz"],
        ["İstiklal Yolu TMP", "Kastamonu-Çankırı", "karadeniz"],
        ["Sultan Sazlığı", "Kayseri", "ic"],
        ["İğneada Longoz Ormanları", "Kırklareli", "marmara"],
        ["Beyşehir Gölü", "Konya", "ic"],
        ["Derebucak Çamlık Mağaraları", "Konya", "ic"],
        ["Spil Dağı", "Manisa", "ege"],
        ["Marmaris", "Muğla", "ege"],
        ["Saklıkent", "Muğla-Antalya", "ege"],
        ["Malazgirt Meydan Muharebesi TMP", "Muş", "dogu"],
        ["Aladağlar", "Niğde-Adana-Kayseri", "ic"],
        ["Karatepe-Aslantaş", "Osmaniye", "akdeniz"],
        ["Karagöl-Sahara", "Rize-Artvin", "karadeniz"],
        ["Botan Vadisi", "Siirt", "guneydogu"],
        ["Divriği", "Sivas", "ic"],
        ["Tek Tek Dağları", "Şanlıurfa", "guneydogu"],
        ["Altındere Vadisi", "Trabzon", "karadeniz"],
        ["Munzur Vadisi", "Tunceli", "dogu"],
        ["Yozgat Çamlığı", "Yozgat", "ic"],
        ["Fethiye-Kaş Deniz Milli Parkı", "Muğla-Antalya", "ege"],
        ["Kuzey Ege Deniz Milli Parkı", "Çanakkale-Tekirdağ", "marmara"],
        ["Nemrut Kalderası", "Bitlis", "dogu"],
        ["Van Gölü Deveboynu Yarımadası", "Van-Bitlis", "dogu"]
    ];
    PARKS.forEach(function (r) {
        var it = F("milli", r[0], r[1], { prompt: r[0] + " Milli Parkı'nı bul.", region: r[2] });
        it.parkRegion = r[2];
        ITEMS.push(it);
    });

    ITEMS.push(F("tuzak", "Kızılırmak → Bafra", "Samsun", { prompt: "Kızılırmak deltasını bul. (Yeşilırmak ile karıştırma: o Çarşamba.)" }));
    ITEMS.push(F("tuzak", "Yeşilırmak → Çarşamba", "Samsun", { prompt: "Yeşilırmak deltasını bul. (Kızılırmak Bafra'dır.)" }));
    ITEMS.push(F("tuzak", "Nemrut (Adıyaman) vs volkan", "Adıyaman", { prompt: "Adıyaman-Malatya Nemrut Dağı Milli Parkı'nı bul. (Bitlis volkanı değil.)" }));
    ITEMS.push(F("tuzak", "Karadağ ≠ Karacadağ", "Karaman", { prompt: "Karaman'daki volkanik Karadağ'ı bul. (Karacadağ Diyarbakır-Urfa'dadır.)" }));
    ITEMS.push(F("tuzak", "Karacadağ", "Diyarbakır", { prompt: "Karacadağ'ı bul. (Karaman Karadağ değil.)" }));

    ITEMS.forEach(function (it, i) { it.id = "m" + i; });

    function project(lon, lat) {
        return {
            x: ((lon - 25.6) / (44.9 - 25.6)) * 1000,
            y: ((42.15 - lat) / (42.15 - 35.85)) * 422
        };
    }

    ITEMS.forEach(function (it) {
        var ll = ITEM_LL[it.name];
        if (!ll && it.codes && it.codes[0]) ll = PROVINCE_LL[it.codes[0]];
        if (!ll) ll = [35.2, 39.0];
        var p = project(ll[0], ll[1]);
        it.x = p.x;
        it.y = p.y;
    });

    function topicIdOf(it) { return it.topic; }

    function itemsForTopic(topicId) {
        if (topicId === "milli") return ITEMS.filter(function (it) { return it.topic === "milli"; });
        if (topicId.indexOf("milli-") === 0) {
            var rg = topicId.slice(6);
            return ITEMS.filter(function (it) { return it.topic === "milli" && it.parkRegion === rg; });
        }
        return ITEMS.filter(function (it) { return it.topic === topicId; });
    }

    function topicMeta(topicId) {
        var found = null;
        TREE.forEach(function (g) {
            g.kids.forEach(function (k) { if (k.id === topicId) found = k; });
        });
        return found;
    }

    function resolveCodes(item) {
        if (item.codes && item.codes.length) return item.codes;
        if (item.region) return codesOfRegion(item.region);
        return [];
    }

    function isCorrect(item, code) {
        var c = String(code || "").toUpperCase();
        var ok = resolveCodes(item);
        return ok.indexOf(c) >= 0;
    }

    function nameOf(code) { return NAMES[String(code || "").toUpperCase()] || code; }

    function answerLabel(item) {
        if (item.codes && item.codes.length) return item.codes.map(nameOf).join(" / ");
        return (REGION_LABEL[item.region] || item.region || "") + " bölgesi";
    }

    function focusCodes(topicId) {
        var set = {};
        itemsForTopic(topicId).forEach(function (it) {
            resolveCodes(it).forEach(function (c) { set[c] = true; });
        });
        return Object.keys(set);
    }

    function expandRound(raw) {
        var steps = [];
        raw.forEach(function (it) {
            if (it.mcq) {
                steps.push({ type: "mcq", prompt: it.prompt, choices: it.choices, answer: it.answer, name: it.name, topic: it.topic });
                return;
            }
            steps.push({ type: "map", item: it, prompt: it.prompt, name: it.name, topic: it.topic });
            if (it.follow && it.follow.q) {
                steps.push({
                    type: "mcq",
                    prompt: it.follow.q,
                    choices: shuffle(it.follow.choices.slice()),
                    answer: it.follow.answer,
                    name: it.name,
                    topic: it.topic
                });
            }
        });
        return steps;
    }

    function pickRound(topicId, n) {
        var list = itemsForTopic(topicId);
        var take = Math.min(n || 8, list.length);
        return expandRound(shuffle(list).slice(0, take));
    }

    function tapChoices(item) {
        var codes = resolveCodes(item);
        if (codes.length && codes.length <= 12) {
            var extra = shuffle(Object.keys(NAMES).filter(function (k) { return codes.indexOf(k) < 0; })).slice(0, Math.max(4, 8 - codes.length));
            return shuffle(codes.concat(extra)).map(function (c) {
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
        return choice.id === item.region || (item.parkRegion && choice.id === item.parkRegion);
    }

    function countFor(topicId) { return itemsForTopic(topicId).length; }

    function jitterPins(pins) {
        var buckets = {};
        pins.forEach(function (p) {
            var key = Math.round(p.x / 14) + "," + Math.round(p.y / 14);
            (buckets[key] = buckets[key] || []).push(p);
        });
        Object.keys(buckets).forEach(function (k) {
            var g = buckets[k];
            if (g.length < 2) return;
            g.forEach(function (p, i) {
                var a = (i / g.length) * Math.PI * 2;
                p.x += Math.cos(a) * (12 + g.length * 2);
                p.y += Math.sin(a) * (10 + g.length * 2);
            });
        });
        return pins;
    }

    function topicLayer(topicId) {
        var pins = itemsForTopic(topicId).map(function (it) {
            return { id: it.id, name: it.name, x: it.x, y: it.y };
        });
        jitterPins(pins);
        var pad = 70;
        var xs = pins.map(function (p) { return p.x; });
        var ys = pins.map(function (p) { return p.y; });
        var minX = Math.max(0, Math.min.apply(null, xs) - pad);
        var minY = Math.max(0, Math.min.apply(null, ys) - pad);
        var maxX = Math.min(1000, Math.max.apply(null, xs) + pad);
        var maxY = Math.min(422, Math.max.apply(null, ys) + pad);
        if (maxX - minX < 280) {
            var cx = (minX + maxX) / 2;
            minX = Math.max(0, cx - 140);
            maxX = Math.min(1000, cx + 140);
        }
        if (maxY - minY < 180) {
            var cy = (minY + maxY) / 2;
            minY = Math.max(0, cy - 90);
            maxY = Math.min(422, cy + 90);
        }
        if (pins.length > 20) {
            minX = 0; minY = 0; maxX = 1000; maxY = 422;
        }
        return {
            pins: pins,
            viewBox: minX + " " + minY + " " + (maxX - minX) + " " + (maxY - minY)
        };
    }

    function topicLayerFromSvg(svg, topicId) {
        var boxes = {};
        var paths = svg.querySelectorAll("path[id]");
        Array.prototype.forEach.call(paths, function (p) {
            try {
                var b = p.getBBox();
                boxes[String(p.getAttribute("id") || "").toUpperCase()] = {
                    x: b.x + b.width / 2,
                    y: b.y + b.height / 2,
                    w: b.width,
                    h: b.height
                };
            } catch (e) { }
        });
        var PIN_OFF = {
            "Bafra Deltası": ["TR55", -0.38, -0.42],
            "Çarşamba Deltası": ["TR55", 0.42, -0.12],
            "Bafra Ovası": ["TR55", -0.32, -0.22],
            "Çarşamba Ovası": ["TR55", 0.36, 0.05],
            "Kızılırmak": ["TR55", -0.40, -0.40],
            "Yeşilırmak": ["TR55", 0.40, -0.08],
            "Kızılırmak → Bafra": ["TR55", -0.38, -0.42],
            "Yeşilırmak → Çarşamba": ["TR55", 0.42, -0.12],
            "Alüvyal (Bafra)": ["TR55", -0.28, -0.30],
            "Menemen Deltası": ["TR35", -0.25, -0.35],
            "Selçuk Deltası": ["TR35", 0.28, 0.40],
            "Gediz": ["TR35", -0.20, -0.30],
            "Küçük Menderes": ["TR35", 0.30, 0.38],
            "Söke / Balat Deltası": ["TR09", -0.25, 0.35],
            "Büyük Menderes": ["TR09", -0.10, 0.30],
            "Çukurova": ["TR01", 0.10, 0.35],
            "Çukurova Deltası": ["TR01", 0.05, 0.42],
            "Seyhan": ["TR01", -0.15, 0.28],
            "Ceyhan": ["TR01", 0.35, 0.22],
            "Silifke Deltası": ["TR33", -0.05, 0.45],
            "Göksu": ["TR33", -0.08, 0.42],
            "Erciyes Dağı": ["TR38", 0.05, 0.25],
            "Sultan Sazlığı": ["TR38", -0.15, 0.40],
            "Hasan Dağı": ["TR68", 0.20, 0.35],
            "Melendiz Dağı": ["TR51", -0.15, -0.20],
            "Göllüdağ": ["TR51", 0.25, -0.35],
            "Kapadokya": ["TR50", 0, 0],
            "Karadağ": ["TR70", 0.1, -0.15],
            "Karacadağ": ["TR21", -0.35, 0.20],
            "Nemrut Dağı (volkan)": ["TR13", -0.20, 0.25],
            "Süphan Dağı": ["TR13", 0.45, -0.35],
            "Ağrı Dağı": ["TR04", 0.35, -0.15],
            "Tendürek Dağı": ["TR04", 0.15, 0.40]
        };
        var list = itemsForTopic(topicId);
        var groups = {};
        list.forEach(function (it) {
            var spec = PIN_OFF[it.name];
            var code = (spec && spec[0]) || (it.codes && it.codes[0]);
            if (!code && it.region) {
                var regs = codesOfRegion(it.region);
                code = regs[Math.floor(regs.length / 2)] || "TR06";
            }
            code = String(code || "TR06").toUpperCase();
            (groups[code] = groups[code] || []).push(it);
        });
        var pins = [];
        Object.keys(groups).forEach(function (code) {
            var g = groups[code];
            var box = boxes[code] || { x: 500, y: 210, w: 48, h: 48 };
            g.forEach(function (it, i) {
                var spec = PIN_OFF[it.name];
                var x = box.x;
                var y = box.y;
                if (spec) {
                    x = box.x + spec[1] * box.w;
                    y = box.y + spec[2] * box.h;
                } else if (g.length > 1) {
                    var a = (i / g.length) * Math.PI * 2 - Math.PI / 2;
                    var r = Math.max(16, Math.min(box.w, box.h) * 0.34);
                    x = box.x + Math.cos(a) * r;
                    y = box.y + Math.sin(a) * r;
                }
                pins.push({ id: it.id, name: it.name, x: x, y: y });
            });
        });
        var minD = 26;
        var n;
        for (n = 0; n < 14; n++) {
            var i, j;
            for (i = 0; i < pins.length; i++) {
                for (j = i + 1; j < pins.length; j++) {
                    var dx = pins[j].x - pins[i].x;
                    var dy = pins[j].y - pins[i].y;
                    var d = Math.sqrt(dx * dx + dy * dy) || 0.01;
                    if (d < minD) {
                        var push = (minD - d) / 2 + 0.6;
                        pins[i].x -= (dx / d) * push;
                        pins[i].y -= (dy / d) * push;
                        pins[j].x += (dx / d) * push;
                        pins[j].y += (dy / d) * push;
                    }
                }
            }
        }
        return { pins: pins, viewBox: "0 0 1000 422" };
    }

    var api = {
        REGION_LABEL: REGION_LABEL,
        PROVINCE_REGION: PROVINCE_REGION,
        NAMES: NAMES,
        TREE: TREE,
        ITEMS: ITEMS,
        pickRound: pickRound,
        itemsForTopic: itemsForTopic,
        topicMeta: topicMeta,
        isCorrect: isCorrect,
        resolveCodes: resolveCodes,
        regionOfCode: regionOfCode,
        focusCodes: focusCodes,
        nameOf: nameOf,
        answerLabel: answerLabel,
        tapChoices: tapChoices,
        isTapCorrect: isTapCorrect,
        countFor: countFor,
        topicLayer: topicLayer,
        topicLayerFromSvg: topicLayerFromSvg,
        PARK_SOURCE: "Tarım ve Orman Bakanlığı DKMP — 54 milli park (2026)"
    };
    global.MapQuiz = api;
    if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
