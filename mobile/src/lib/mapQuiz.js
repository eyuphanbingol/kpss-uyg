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
        "Kaz Dağı": [26.85, 39.70], "Bozdağlar": [28.05, 38.32], "Aydın Dağları": [27.95, 37.95],
        "Madra Dağları": [27.20, 39.35], "Yunt Dağları": [27.20, 38.90], "Menteşe Dağları": [28.20, 37.15],
        "Nur (Amanos) Dağları": [36.25, 36.75],
        "Yıldız Dağları": [27.50, 41.75], "Küre Dağları": [33.20, 41.55], "Ilgaz Dağları": [33.65, 41.05],
        "Köroğlu Dağları": [31.80, 40.55], "Canik Dağları": [36.80, 40.85], "Giresun Dağları": [38.40, 40.55],
        "Kaçkar Dağları": [41.20, 40.85], "Beydağları": [30.12, 36.70], "Geyik Dağları": [32.20, 36.85],
        "Bolkar Dağları": [34.35, 37.40], "Aladağlar (Demirkazık)": [35.20, 37.80],
        "Tahtalı Dağları": [36.30, 38.20], "Binboğa Dağları": [36.70, 38.15], "Cilo / Buzul Dağları": [44.00, 37.50],
        "Haymana Platosu": [32.50, 39.43], "Cihanbeyli Platosu": [32.80, 38.65], "Obruk Platosu": [33.20, 38.20],
        "Bozok Platosu": [35.20, 39.70], "Uzunyayla": [37.00, 38.80], "Yazılıkaya Platosu": [30.70, 39.20],
        "Erzurum-Kars Platosu": [41.80, 40.40], "Ardahan Platosu": [42.70, 41.11],
        "Gaziantep Platosu": [37.38, 37.20], "Şanlıurfa Platosu": [38.79, 37.30], "Adıyaman Platosu": [38.28, 37.76],
        "Mardin-Midyat Eşiği": [41.05, 37.45], "Teke Platosu": [29.90, 36.85], "Taşeli Platosu": [33.20, 36.55],
        "Çatalca-Kocaeli Platosu": [29.20, 41.00],
        "Bafra Deltası": [35.90, 41.57], "Çarşamba Deltası": [36.72, 41.20], "Çukurova Deltası": [35.40, 36.78],
        "Silifke Deltası": [33.93, 36.38], "Menemen Deltası": [27.07, 38.58], "Söke / Balat Deltası": [27.40, 37.48],
        "Selçuk Deltası": [27.37, 37.95], "Dikili Deltası": [26.90, 39.08], "Meriç Deltası": [26.35, 40.75],
        "Kızılırmak": [36.10, 41.55], "Yeşilırmak": [36.65, 41.22], "Sakarya": [30.40, 41.12],
        "Gediz": [27.10, 38.60], "Büyük Menderes": [27.30, 37.55], "Küçük Menderes": [27.35, 37.95],
        "Bakırçay": [27.05, 39.05], "Seyhan": [35.33, 36.78], "Ceyhan": [35.82, 36.85], "Göksu": [33.93, 36.38],
        "Asi": [36.20, 36.25], "Fırat": [38.25, 37.00], "Dicle": [40.55, 37.90], "Aras": [44.10, 39.95],
        "Kura": [43.00, 41.20], "Çoruh": [41.50, 41.45], "Meriç": [26.50, 41.00],
        "Van Gölü": [43.00, 38.63], "Tuz Gölü": [33.40, 38.75], "Beyşehir Gölü": [31.50, 37.70],
        "Eğirdir Gölü": [30.85, 37.85], "İznik Gölü": [29.52, 40.43], "Sapanca Gölü": [30.26, 40.72],
        "Manyas (Kuş) Gölü": [28.00, 40.18], "Burdur Gölü": [30.20, 37.73], "Akşehir Gölü": [31.40, 38.48],
        "Eber Gölü": [31.15, 38.65], "Hazar Gölü": [39.42, 38.48], "Salda Gölü": [29.68, 37.55],
        "Meke Gölü": [33.64, 37.68], "Nemrut Krater Gölü": [42.02, 38.62], "Gölcük (Isparta)": [30.48, 37.72],
        "Tortum Gölü": [41.55, 40.65], "Bafa Gölü": [27.45, 37.50], "Köyceğiz Gölü": [28.65, 36.90],
        "Erçek Gölü": [43.55, 38.67], "Çıldır Gölü": [43.23, 41.05], "Abant Gölü": [31.28, 40.60],
        "Büyükçekmece": [28.55, 41.02], "Küçükçekmece": [28.75, 41.00], "Terkos (Durusu)": [28.55, 41.32],
        "Bafra Ovası": [35.90, 41.50], "Çarşamba Ovası": [36.72, 41.15], "Çukurova": [35.40, 36.85],
        "Harran Ovası": [39.05, 36.86], "Ergene Ovası": [26.90, 41.15], "Amik Ovası": [36.35, 36.35],
        "Kapadokya": [34.83, 38.67],
        "Zigana Geçidi": [39.40, 40.65], "Kop Geçidi": [40.20, 40.05], "Ovit Geçidi": [40.80, 40.62],
        "Cankurtaran Geçidi": [41.45, 41.25], "Ecevit Geçidi": [33.78, 41.70], "Ilgaz Geçidi": [33.65, 41.00],
        "Gülek Boğazı": [34.80, 37.28], "Sertavul Geçidi": [33.30, 36.90], "Belen Geçidi": [36.22, 36.48],
        "Çubuk Geçidi": [30.55, 37.15],
        "Kızılırmak → Bafra": [35.90, 41.57], "Yeşilırmak → Çarşamba": [36.72, 41.20]
    };

    var TREE = [
        {
            id: "yer", title: "Yer şekilleri · jeoloji", icon: "🗻",
            kids: [
                { id: "volkanik", title: "Volkanik dağlar", icon: "🌋" },
                { id: "volkanik-arazi", title: "Volkanik araziler", icon: "🌋" },
                { id: "kirik", title: "Kırık dağlar (horst–graben)", icon: "⛰️" },
                { id: "kivrim", title: "Kıvrım dağları", icon: "🏔️" },
                { id: "masif", title: "Masif araziler", icon: "🪨" },
                { id: "fay", title: "Fay hatları (KAF·DAF·BAF)", icon: "⚡" },
                { id: "deprem-az", title: "Deprem riski az alanlar", icon: "🟢" }
            ]
        },
        {
            id: "plato", title: "Platolar", icon: "🏜️",
            kids: [
                { id: "plato-karst", title: "Karstik platolar", icon: "🪨" },
                { id: "plato-volkan", title: "Volkanik / lav platoları", icon: "🌋" },
                { id: "plato-asinim", title: "Aşınım düzlüğü platoları", icon: "🟩" },
                { id: "plato-tabaka", title: "Tabaka düzlüğü platoları", icon: "🏜️" }
            ]
        },
        {
            id: "ova", title: "Ovalar", icon: "🌾",
            kids: [
                { id: "delta", title: "Delta ovaları", icon: "🌊" },
                { id: "ova-karst", title: "Karstik ovalar (TAKKEM)", icon: "🪨" },
                { id: "ova-tektonik", title: "Tektonik ovalar", icon: "🌾" },
                { id: "ova-volkan", title: "Volkanik ovalar", icon: "🌋" },
                { id: "ova-asinim", title: "Aşınım / dağ eteği ovaları", icon: "🌾" }
            ]
        },
        {
            id: "karst-g", title: "Karstik arazi", icon: "🪨",
            kids: [
                { id: "karst", title: "Karstik topografya", icon: "🪨" }
            ]
        },
        {
            id: "su", title: "Sular · kıyılar · geçitler", icon: "💧",
            kids: [
                { id: "akarsu", title: "Akarsular", icon: "💧" },
                { id: "goller", title: "Göller", icon: "🏞️" },
                { id: "havza", title: "Kapalı havzalar", icon: "🌊" },
                { id: "kiyi", title: "Kıyı tipleri", icon: "🏖️" },
                { id: "gecit", title: "Geçitler ve boğazlar", icon: "🏔️" }
            ]
        },
        {
            id: "iklim", title: "İklim · bitki · toprak", icon: "🌱",
            kids: [
                { id: "yagis", title: "Yağış dağılımı", icon: "🌧️" },
                { id: "mikro", title: "Mikroklima alanları", icon: "🌡️" },
                { id: "bitki", title: "Bitki örtüsü · relikt", icon: "🌿" },
                { id: "toprak", title: "Toprak tipleri", icon: "🟤" },
                { id: "tarim", title: "Tarım ürünleri", icon: "🌾" },
                { id: "hayvan", title: "Hayvancılık", icon: "🐄" }
            ]
        },
        {
            id: "beseri", title: "Nüfus · ulaşım · ekonomi", icon: "🏙️",
            kids: [
                { id: "nufus-seyrek", title: "Seyrek nüfuslu alanlar", icon: "🏕️" },
                { id: "nufus-yogun", title: "Yoğun nüfuslu alanlar", icon: "🏙️" },
                { id: "demiryolu", title: "Demiryolu olmayan yerler", icon: "🚫" },
                { id: "liman", title: "Limanlar ve hinterland", icon: "⚓" },
                { id: "maden", title: "Madenler", icon: "⛏️" },
                { id: "sanayi", title: "Sanayi tesisleri", icon: "🏭" },
                { id: "boru", title: "Enerji boru hatları", icon: "🛢️" }
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
        ["Ağrı Dağı", "Ağrı-Iğdır", { follow: { q: "Türkiye'nin en yüksek dağı hangisidir?", choices: ["Erciyes", "Süphan", "Ağrı Dağı", "Demirkazık"], answer: "Ağrı Dağı" } }],
        ["Tendürek Dağı", "Ağrı-Van", null],
        ["Süphan Dağı", "Bitlis-Van", { follow: { q: "Süphan hangi bölgededir?", choices: ["Ege", "İç Anadolu", "Doğu Anadolu", "Akdeniz"], answer: "Doğu Anadolu" } }],
        ["Nemrut Dağı (volkan)", "Bitlis", { prompt: "Bitlis Nemrut'u bul (volkan + krater gölü). Adıyaman Nemrut volkan değildir.", follow: { q: "Van Gölü'nün oluşumunda etkili volkan hangisidir?", choices: ["Erciyes", "Nemrut (Bitlis)", "Adıyaman Nemrut", "Hasan Dağı"], answer: "Nemrut (Bitlis)" } }],
        ["Erciyes Dağı", "Kayseri", { follow: { q: "Erciyes'in oluşum tipi nedir?", choices: ["Kıvrım", "Kırık", "Volkanik", "Karstik"], answer: "Volkanik" } }],
        ["Hasan Dağı", "Aksaray-Niğde", null],
        ["Melendiz Dağı", "Niğde", null],
        ["Karadağ", "Karaman", { prompt: "Karaman'daki volkanik Karadağ'ı bul. (Karacadağ Urfa–Diyarbakır'dadır.)" }],
        ["Karacadağ", "Diyarbakır-Şanlıurfa", { follow: { q: "Türkiye'nin tek kalkan tipi volkanı hangisidir?", choices: ["Erciyes", "Ağrı", "Karacadağ", "Kula"], answer: "Karacadağ" } }],
        ["Göllüdağ", "Niğde", null],
        ["Kula volkanları", "Manisa", { follow: { q: "Türkiye'nin en genç volkanik arazisi / ilk jeopark hangisidir?", choices: ["Kapadokya", "Kula", "Erciyes", "Nemrut"], answer: "Kula" } }]
    ].forEach(function (r) { ITEMS.push(F("volkanik", r[0], r[1], r[2] || {})); });

    ITEMS.push(F("volkanik-arazi", "Kapadokya", "Nevşehir", { prompt: "Volkanik tüf aşınım alanı Kapadokya'yı bul. (Erciyes dağdır, burası arazi.)", follow: { q: "Kapadokya neyin örneğidir?", choices: ["Volkanik dağ", "Volkanik tüf aşınım alanı", "Kırık dağ", "Delta"], answer: "Volkanik tüf aşınım alanı" } }));

    [
        ["Kaz Dağı", "Balıkesir-Çanakkale", null],
        ["Madra Dağları", "Balıkesir-İzmir", null],
        ["Yunt Dağları", "Manisa", null],
        ["Bozdağlar", "İzmir-Manisa", { follow: { q: "Ege horst-graben uzanışı nasıldır?", choices: ["Kuzey-güney", "Doğu-batı", "Rastgele", "Sadece kıyıya paralel"], answer: "Doğu-batı" } }],
        ["Aydın Dağları", "Aydın", null],
        ["Menteşe Dağları", "Muğla", null],
        ["Nur (Amanos) Dağları", "Hatay-Osmaniye", { follow: { q: "Ege dışındaki tek kırık dağ hangisidir?", choices: ["Kaçkar", "Nur (Amanos)", "Ilgaz", "Aladağlar"], answer: "Nur (Amanos)" } }]
    ].forEach(function (r) { ITEMS.push(F("kirik", r[0], r[1], r[2] || {})); });

    [
        ["Yıldız Dağları", "Kırklareli"],
        ["Küre Dağları", "Kastamonu-Bartın"],
        ["Ilgaz Dağları", "Kastamonu-Çankırı"],
        ["Köroğlu Dağları", "Bolu"],
        ["Canik Dağları", "Samsun-Ordu"],
        ["Giresun Dağları", "Giresun"],
        ["Kaçkar Dağları", "Rize-Artvin"]
    ].forEach(function (r) { ITEMS.push(F("kivrim", r[0], r[1], { follow: r[0] === "Kaçkar Dağları" ? { q: "Kıvrım dağlarının en yüksek kesimi hangisidir?", choices: ["Yıldız", "Küre", "Kaçkar", "Beydağları"], answer: "Kaçkar" } : null })); });

    [
        ["Beydağları", "Antalya", { prompt: "Batı Toroslar'daki Beydağları'nı bul." }],
        ["Geyik Dağları", "Antalya-Konya", { prompt: "Batı Toroslar'daki Geyik Dağları'nı bul." }],
        ["Bolkar Dağları", "Niğde-Mersin", null],
        ["Aladağlar (Demirkazık)", "Niğde-Adana-Kayseri", { follow: { q: "Kıvrım dağlarının en yüksek noktası hangisidir?", choices: ["Ağrı Dağı", "Demirkazık / Aladağlar", "Kaçkar", "Cilo"], answer: "Demirkazık / Aladağlar" } }],
        ["Tahtalı Dağları", "Kayseri-Kahramanmaraş", { prompt: "Doğu Toroslar'daki Tahtalı Dağları'nı bul." }],
        ["Binboğa Dağları", "Kahramanmaraş-Kayseri", null],
        ["Cilo / Buzul Dağları", "Hakkâri", { follow: { q: "Doğu Toroslar'ın buzullaşma görülen yüksek kesimi?", choices: ["Beydağları", "Cilo / Buzul Dağları", "Küre", "Madra"], answer: "Cilo / Buzul Dağları" } }]
    ].forEach(function (r) { ITEMS.push(F("kivrim", r[0], r[1], r[2] || {})); });

    [
        ["Istranca / Yıldız masifi", "Kırklareli"],
        ["Zonguldak masifi", "Zonguldak"],
        ["Kastamonu-Daday masifi", "Kastamonu"],
        ["Saruhan-Menteşe masifi", "Manisa-Muğla"],
        ["Kırşehir Masifi", "Kırşehir"],
        ["Anamur-Alanya masifi", "Mersin-Antalya"],
        ["Bitlis Masifi", "Bitlis"],
        ["Mardin Eşik Masifi", "Mardin"]
    ].forEach(function (r) { ITEMS.push(F("masif", r[0], r[1], r[0] === "Kırşehir Masifi" ? { follow: { q: "Masif arazilerde deprem riski nasıldır?", choices: ["Çok yüksek", "Az", "Sadece tsunami", "Sadece heyelan"], answer: "Az" } } : {})); });

    ITEMS.push(F("fay", "KAF (Kuzey Anadolu Fayı)", "Düzce-Bolu-Erzincan-Erzurum", { prompt: "Kuzey Anadolu Fayı'nın geçtiği bir ili bul (Düzce, Bolu, Erzincan, Erzurum…)." }));
    ITEMS.push(F("fay", "DAF (Doğu Anadolu Fayı)", "Hatay-Kahramanmaraş-Malatya-Elazığ-Bingöl", { prompt: "Doğu Anadolu Fayı'nın geçtiği bir ili bul." }));
    ITEMS.push(F("fay", "BAF (Batı Anadolu / Ege grabenleri)", "İzmir-Manisa-Aydın", { prompt: "Batı Anadolu fay/graben sisteminin geçtiği Ege ilini bul." }));

    [
        ["Tuz Gölü güneyi (Konya-Karaman)", "Konya-Karaman", { prompt: "Deprem riski az: Tuz Gölü güneyi / Konya–Karaman'ı bul." }],
        ["Taşeli Platosu", "Mersin-Antalya", { prompt: "Deprem riski az karstik Taşeli'yi bul." }],
        ["Ergene Havzası", "Edirne-Tekirdağ", { prompt: "Deprem riski az Ergene Havzası'nı bul." }],
        ["Mardin Eşik Masifi", "Mardin", { prompt: "Güneydoğu'nun güneyi / Mardin eşiği (risk az) alanını bul." }],
        ["Sinop çevresi", "Sinop", { prompt: "Deprem riski az Sinop çevresini bul." }],
        ["Doğu Karadeniz kıyısı", "Rize-Trabzon", { prompt: "Deprem riski görece az Doğu Karadeniz kıyı ilini bul." }]
    ].forEach(function (r) { ITEMS.push(F("deprem-az", r[0], r[1], r[2])); });

    ITEMS.push(F("plato-karst", "Teke Platosu", "Antalya", { follow: { q: "Teke–Taşeli'nin tarım/nüfus özelliği?", choices: ["Çok yoğun nüfus", "Seyrek nüfus, kıl keçisi", "Çeltik ambarı", "Çay monokültürü"], answer: "Seyrek nüfus, kıl keçisi" } }));
    ITEMS.push(F("plato-karst", "Taşeli Platosu", "Mersin-Antalya", { prompt: "Karstik Taşeli Platosu'nu bul." }));

    ITEMS.push(F("plato-volkan", "Erzurum-Kars Platosu", "Erzurum-Kars", { follow: { q: "Bu platonun hayvancılık tipi?", choices: ["Küçükbaş ağırlıklı", "Büyükbaş / mera", "Sadece kümes", "Sera"], answer: "Büyükbaş / mera" } }));
    ITEMS.push(F("plato-volkan", "Ardahan Platosu", "Ardahan", { prompt: "Lav platosu Ardahan'ı bul (çernozyum, soğuk, yüksek)." }));

    ITEMS.push(F("plato-asinim", "Çatalca-Kocaeli Platosu", "İstanbul-Kocaeli", { follow: { q: "En alçak ve en gelişmiş plato hangisidir?", choices: ["Teke", "Erzurum-Kars", "Çatalca-Kocaeli", "Taşeli"], answer: "Çatalca-Kocaeli" } }));

    [
        ["Haymana Platosu", "Ankara"], ["Cihanbeyli Platosu", "Konya"], ["Obruk Platosu", "Konya"],
        ["Bozok Platosu", "Yozgat"], ["Uzunyayla", "Sivas-Kayseri"], ["Yazılıkaya Platosu", "Eskişehir"],
        ["Gaziantep Platosu", "Gaziantep"], ["Şanlıurfa Platosu", "Şanlıurfa"], ["Adıyaman Platosu", "Adıyaman"]
    ].forEach(function (r) { ITEMS.push(F("plato-tabaka", r[0], r[1])); });

    [
        ["Bafra Deltası", "Samsun", { prompt: "Kızılırmak deltasını (Bafra) bul.", follow: { q: "Bafra'yı hangi akarsu oluşturur?", choices: ["Yeşilırmak", "Kızılırmak", "Sakarya", "Gediz"], answer: "Kızılırmak" } }],
        ["Çarşamba Deltası", "Samsun", { prompt: "Yeşilırmak deltasını (Çarşamba) bul.", follow: { q: "Çarşamba'yı hangi akarsu oluşturur?", choices: ["Kızılırmak", "Yeşilırmak", "Göksu", "Seyhan"], answer: "Yeşilırmak" } }],
        ["Çukurova Deltası", "Adana-Mersin", { prompt: "Seyhan–Ceyhan deltasını (en büyük) bul.", follow: { q: "Türkiye'nin en büyük deltası?", choices: ["Bafra", "Çukurova", "Silifke", "Meriç"], answer: "Çukurova" } }],
        ["Silifke Deltası", "Mersin", { prompt: "Göksu deltasını (Silifke) bul." }],
        ["Dikili Deltası", "İzmir", { prompt: "Bakırçay deltasını (Dikili) bul." }],
        ["Menemen Deltası", "İzmir", { prompt: "Gediz deltasını (Menemen) bul." }],
        ["Selçuk Deltası", "İzmir", { prompt: "Küçük Menderes deltasını (Selçuk) bul." }],
        ["Söke / Balat Deltası", "Aydın", { prompt: "Büyük Menderes deltasını (Balat/Söke) bul." }],
        ["Meriç Deltası", "Edirne", { prompt: "Marmara'daki Meriç Deltası'nı bul." }]
    ].forEach(function (r) { ITEMS.push(F("delta", r[0], r[1], r[2])); });

    [
        ["Tefenni Ovası", "Burdur", { follow: { q: "TAKKEM karstik ovaların toprağı?", choices: ["Çernozyum", "Terra-Rossa", "Podzol", "Alüvyal"], answer: "Terra-Rossa" } }],
        ["Acıpayam Ovası", "Denizli"], ["Korkuteli Ovası", "Antalya"],
        ["Kestel Ovası", "Burdur"], ["Elmalı Ovası", "Antalya"], ["Muğla Ovaları", "Muğla"]
    ].forEach(function (r) { ITEMS.push(F("ova-karst", r[0], r[1], r[2] || {})); });

    [
        ["Pasinler Ovası", "Erzurum"], ["Erzincan Ovası", "Erzincan"], ["Niksar Ovası", "Tokat"],
        ["Erbaa Ovası", "Tokat"], ["Düzce Ovası", "Düzce"], ["Bolu Ovası", "Bolu"],
        ["Amik Ovası", "Hatay", { follow: { q: "Nur Dağları'nın grabeni hangisidir?", choices: ["Konya Ovası", "Amik Ovası", "Harran", "Bafra"], answer: "Amik Ovası" } }],
        ["Malatya Ovası", "Malatya"], ["Muş Ovası", "Muş"], ["Yüksekova", "Hakkâri"],
        ["Gediz Ovası", "Manisa"], ["Büyük Menderes Ovası", "Aydın"], ["Bakırçay Ovası", "İzmir"],
        ["Konya Ovası", "Konya"], ["Harran Ovası", "Şanlıurfa"], ["Suruç Ovası", "Şanlıurfa"],
        ["Ceylanpınar Ovası", "Şanlıurfa"]
    ].forEach(function (r) { ITEMS.push(F("ova-tektonik", r[0], r[1], r[2] || {})); });

    ITEMS.push(F("ova-volkan", "Develi Ovası", "Kayseri", { prompt: "Erciyes çevresi volkanik Develi Ovası'nı bul." }));
    ITEMS.push(F("ova-volkan", "Kayseri Ovası", "Kayseri", null));
    ITEMS.push(F("ova-volkan", "Çaldıran Ovası", "Van", null));

    ITEMS.push(F("ova-asinim", "Çatalca Ovası", "İstanbul", { prompt: "Aşınım ovası Çatalca'yı bul." }));
    ITEMS.push(F("ova-asinim", "Safranbolu Ovası", "Karabük", { prompt: "Aşınım ovası Safranbolu'yu bul." }));
    ITEMS.push(F("ova-asinim", "Bursa Ovası", "Bursa", { prompt: "Dağ eteği / birikim ovası Bursa'yı bul." }));
    ITEMS.push(F("ova-asinim", "Dörtyol Ovası", "Hatay", { prompt: "Dağ eteği ovası Dörtyol'u bul." }));

    [
        ["Teke Yarımadası", "Antalya", { prompt: "Karstik Teke Yarımadası'nı bul." }],
        ["Taşeli karstik alanları", "Mersin-Antalya", { prompt: "Taşeli karstik kuşağını bul." }],
        ["Göller Yöresi", "Isparta-Burdur", { prompt: "Karstın yaygın olduğu Göller Yöresi'ni bul." }],
        ["Batı Toroslar karstı", "Antalya", { prompt: "Batı Toroslar karstik topografyasını bul." }],
        ["Silifke karstik kıyı", "Mersin", { prompt: "Kalanklı/karstik kıyı (Silifke) alanını bul." }]
    ].forEach(function (r) { ITEMS.push(F("karst", r[0], r[1], r[2])); });

    [
        ["Kızılırmak", "Samsun", { prompt: "Sınırlarımız içindeki en uzun akarsu Kızılırmak'ın ağzını (Bafra) bul.", follow: { q: "Türkiye sınırları içindeki en uzun akarsu?", choices: ["Fırat", "Kızılırmak", "Dicle", "Sakarya"], answer: "Kızılırmak" } }],
        ["Yeşilırmak", "Samsun", { prompt: "Yeşilırmak'ın döküldüğü Çarşamba'yı bul." }],
        ["Sakarya", "Sakarya", null],
        ["Gediz", "İzmir"], ["Büyük Menderes", "Aydın"], ["Küçük Menderes", "İzmir"], ["Bakırçay", "İzmir"],
        ["Seyhan", "Adana"], ["Ceyhan", "Adana"], ["Göksu", "Mersin"],
        ["Asi", "Hatay", { prompt: "Dışarıdan doğup bize dökülen Asi'yi (Hatay) bul.", follow: { q: "Asi nereden doğar?", choices: ["Bulgaristan", "Suriye / Lübnan", "Gürcistan", "İran"], answer: "Suriye / Lübnan" } }],
        ["Meriç", "Edirne", { prompt: "Bulgaristan'dan doğup bize dökülen Meriç'i bul." }],
        ["Fırat", "Şanlıurfa", { follow: { q: "Sınır aşan ve debisi en yüksek akarsu?", choices: ["Kızılırmak", "Fırat", "Sakarya", "Gediz"], answer: "Fırat" } }],
        ["Dicle", "Diyarbakır", { prompt: "Bizden doğup Basra'ya giden Dicle'yi bul." }],
        ["Aras", "Iğdır", { prompt: "Hazar'a giden (kapalı havza) Aras'ı bul." }],
        ["Kura", "Ardahan-Kars", { prompt: "Hazar'a giden Kura'yı bul." }],
        ["Çoruh", "Artvin", { prompt: "Gürcistan/Karadeniz'e dökülen Çoruh'u bul.", follow: { q: "Rejimi en düzenli akarsulardan biri?", choices: ["Gediz", "Çoruh", "Küçük Menderes", "Asi"], answer: "Çoruh" } }]
    ].forEach(function (r) { ITEMS.push(F("akarsu", r[0], r[1], r[2] || {})); });

    [
        ["Van Gölü", "Van", { follow: { q: "Türkiye'nin en büyük gölü?", choices: ["Tuz Gölü", "Van Gölü", "Beyşehir", "Eğirdir"], answer: "Van Gölü" } }],
        ["Tuz Gölü", "Aksaray-Konya", { follow: { q: "En büyük 2. göl hangisidir?", choices: ["Beyşehir", "Tuz Gölü", "Eğirdir", "İznik"], answer: "Tuz Gölü" } }],
        ["Beyşehir Gölü", "Konya", { follow: { q: "En büyük tatlı su gölü?", choices: ["Van", "Tuz", "Beyşehir", "İznik"], answer: "Beyşehir" } }],
        ["Eğirdir Gölü", "Isparta", { follow: { q: "Beyşehir ve Eğirdir'in oluşumu?", choices: ["Sadece karstik", "Tektonik + karstik", "Sadece volkanik", "Lagün"], answer: "Tektonik + karstik" } }],
        ["İznik Gölü", "Bursa"], ["Sapanca Gölü", "Sakarya"], ["Manyas (Kuş) Gölü", "Balıkesir"],
        ["Burdur Gölü", "Burdur"], ["Akşehir Gölü", "Konya-Afyonkarahisar"], ["Eber Gölü", "Afyonkarahisar"],
        ["Hazar Gölü", "Elazığ"], ["Salda Gölü", "Burdur"],
        ["Nemrut Krater Gölü", "Bitlis"], ["Meke Gölü", "Konya"], ["Gölcük (Isparta)", "Isparta"],
        ["Tortum Gölü", "Erzurum", { prompt: "Heyelan set gölü Tortum'u bul." }],
        ["Abant Gölü", "Bolu"], ["Çıldır Gölü", "Ardahan-Kars"], ["Erçek Gölü", "Van"],
        ["Bafa Gölü", "Aydın-Muğla", { prompt: "Alüvyal set gölü Bafa'yı (Çamiçi) bul." }],
        ["Köyceğiz Gölü", "Muğla"],
        ["Büyükçekmece", "İstanbul", { prompt: "Lagün / limani kıyı: Büyükçekmece'yi bul." }],
        ["Küçükçekmece", "İstanbul"], ["Terkos (Durusu)", "İstanbul"]
    ].forEach(function (r) { ITEMS.push(F("goller", r[0], r[1], r[2] || {})); });

    ITEMS.push(F("havza", "Tuz Gölü kapalı havzası", "Aksaray-Konya", { prompt: "İç Anadolu kapalı havzasını (Tuz Gölü) bul." }));
    ITEMS.push(F("havza", "Van Gölü havzası", "Van", { prompt: "Doğu Anadolu kapalı göl havzasını bul.", follow: { q: "Van Gölü'nün oluşumu?", choices: ["Sadece karstik", "Tektonik + volkanik set", "Sadece heyelan", "Lagün"], answer: "Tektonik + volkanik set" } }));
    ITEMS.push(F("havza", "Iğdır Havzası", "Iğdır", { prompt: "Kurak Iğdır Havzası'nı bul (en az yağış / pamuk mikrokliması)." }));

    [
        ["Boyuna kıyı (Karadeniz)", "Trabzon-Rize", { prompt: "Dağların kıyıya paralel olduğu boyuna Karadeniz kıyısını bul.", follow: { q: "Boyuna kıyıda hinterland nasıldır?", choices: ["Geniş", "Dar", "Yok", "Okyanus kadar"], answer: "Dar" } }],
        ["Boyuna kıyı (Akdeniz)", "Antalya", { prompt: "Akdeniz boyuna kıyı örneğini bul." }],
        ["Enine kıyı (Ege)", "İzmir-Aydın", { prompt: "Dağların kıyıya dik uzandığı enine Ege kıyısını bul.", follow: { q: "Enine kıyının özelliği?", choices: ["Koy-körfez az, hinterland dar", "Girinti-çıkıntı çok, hinterland geniş", "Sadece falez", "Buzul fiyort"], answer: "Girinti-çıkıntı çok, hinterland geniş" } }],
        ["Ria kıyı (Boğazlar)", "İstanbul-Çanakkale", { prompt: "Ria kıyı: İstanbul/Çanakkale boğazlarını bul." }],
        ["Ria kıyı (Gökova / Menteşe)", "Muğla", { prompt: "Ria kıyı: Gökova–Menteşe'yi bul." }],
        ["Dalmaçya kıyı (Kaş–Finike)", "Antalya", { prompt: "Dalmaçya kıyı: Kaş–Finike arasını (Antalya) bul." }],
        ["Limani kıyı (Çekmece)", "İstanbul", { prompt: "Limani kıyı: Büyük/Küçükçekmece'yi bul." }],
        ["Kalanklı (karstik) kıyı", "Mersin", { prompt: "Kalanklı kıyı: Silifke–Mersin'i bul." }]
    ].forEach(function (r) { ITEMS.push(F("kiyi", r[0], r[1], r[2])); });

    [
        ["Ecevit Geçidi", "Kastamonu", { prompt: "İnebolu–Kastamonu Ecevit Geçidi'ni bul." }],
        ["Ilgaz Geçidi", "Kastamonu-Çankırı", null],
        ["Zigana Geçidi", "Trabzon-Gümüşhane", { follow: { q: "Trabzon'u iç kesime bağlayan klasik geçit?", choices: ["Gülek", "Zigana", "Belen", "Sertavul"], answer: "Zigana" } }],
        ["Kop Geçidi", "Bayburt-Erzurum", null],
        ["Ovit Geçidi", "Rize-Erzurum", { prompt: "Rize–Erzurum Ovit Geçidi'ni bul. (Cankurtaran Artvin'dedir.)" }],
        ["Cankurtaran Geçidi", "Artvin", { prompt: "Artvin'deki Cankurtaran Geçidi'ni bul." }],
        ["Çubuk Geçidi", "Antalya-Isparta", { prompt: "Antalya'yı Göller Yöresi'ne bağlayan Çubuk Geçidi'ni bul." }],
        ["Sertavul Geçidi", "Karaman-Mersin", { prompt: "Silifke'yi Konya'ya bağlayan Sertavul'u bul." }],
        ["Gülek Boğazı", "Adana-Mersin", { prompt: "Çukurova'yı İç Anadolu'ya bağlayan Gülek'i bul." }],
        ["Belen Geçidi", "Hatay", { prompt: "Amanoslar üzerindeki Belen Geçidi'ni bul." }]
    ].forEach(function (r) { ITEMS.push(F("gecit", r[0], r[1], r[2] || {})); });

    [
        ["En çok yağış: Rize–Hopa", "Rize", { follow: { q: "Türkiye'de en çok yağış alan yerlerden biri?", choices: ["Tuz Gölü çevresi", "Rize–Hopa", "Iğdır", "Konya"], answer: "Rize–Hopa" } }],
        ["En çok yağış: Hakkâri", "Hakkâri", null],
        ["En çok yağış: Menteşe", "Muğla", null],
        ["En çok yağış: Yıldız Dağları", "Kırklareli", null],
        ["En az yağış: Tuz Gölü çevresi", "Aksaray-Konya", { follow: { q: "En az yağış alan yerlerden biri?", choices: ["Rize", "Muğla", "Tuz Gölü çevresi", "Hakkâri"], answer: "Tuz Gölü çevresi" } }],
        ["En az yağış: Iğdır Havzası", "Iğdır", null],
        ["En az yağış: GD'nin güneyi", "Şanlıurfa-Mardin", null]
    ].forEach(function (r) { ITEMS.push(F("yagis", r[0], r[1], r[2] || {})); });

    [
        ["Rize mikroklima (turunçgil)", "Rize", { follow: { q: "Rize mikroklimasında yetişen?", choices: ["Pamuk", "Turunçgil", "Muz", "Haşhaş"], answer: "Turunçgil" } }],
        ["Iğdır mikroklima (pamuk)", "Iğdır", { follow: { q: "Iğdır mikroklimasında yetişen?", choices: ["Çay", "Pamuk", "Fındık", "Muz"], answer: "Pamuk" } }],
        ["Çoruh Vadisi (zeytin)", "Artvin", { prompt: "Yusufeli / Çoruh Vadisi zeytin mikroklimasını bul.", follow: { q: "Çoruh Vadisi'nde yetişen?", choices: ["Zeytin", "Çay", "Muz", "Fındık"], answer: "Zeytin" } }],
        ["Anamur–Gazipaşa (muz)", "Mersin-Antalya", { follow: { q: "Muz mikrokliması nerede?", choices: ["Rize", "Iğdır", "Anamur–Gazipaşa", "Kars"], answer: "Anamur–Gazipaşa" } }]
    ].forEach(function (r) { ITEMS.push(F("mikro", r[0], r[1], r[2])); });

    [
        ["Doğu Karadeniz ormanı", "Rize", { follow: { q: "Karadeniz'in doğal bitki örtüsü?", choices: ["Maki", "Bozkır", "Orman", "Çöl"], answer: "Orman" } }],
        ["Maki alanı", "Antalya", { follow: { q: "Hangisi maki elemanıdır?", choices: ["Ladin", "Zakkum", "Kayın", "Sarıçam"], answer: "Zakkum" } }],
        ["İç Anadolu bozkırı", "Konya", { follow: { q: "İç Anadolu'nun doğal bitkisi?", choices: ["Maki", "Bozkır", "Mangrov", "Yağmur ormanı"], answer: "Bozkır" } }],
        ["Erzurum-Kars çayırı", "Erzurum-Kars", { prompt: "Çayır örtüsü / çernozyum alanını bul." }],
        ["Sığla (günlük) ağacı", "Muğla", { prompt: "Relikt sığla ağacı: Fethiye–Köyceğiz (Muğla) alanını bul." }],
        ["Kazdağı göknarı", "Balıkesir-Çanakkale", { prompt: "Endemik/relikt Kazdağı göknarını bul." }],
        ["Datça hurması", "Muğla", { prompt: "Datça hurmasının alanını bul." }],
        ["Kasnak meşesi", "Isparta", { prompt: "Eğirdir çevresi kasnak meşesini bul." }],
        ["Endemik yoğunluğu (Teke–Taşeli)", "Antalya-Mersin", { prompt: "Endemik türlerin yoğun olduğu Teke–Taşeli'yi bul." }]
    ].forEach(function (r) { ITEMS.push(F("bitki", r[0], r[1], r[2] || {})); });

    [
        ["Terra Rossa", "Antalya-Mersin", { follow: { q: "Terra rossa hangi ana kaya üzerinde oluşur?", choices: ["Granit", "Kalker", "Bazalt", "Tuz"], answer: "Kalker" } }],
        ["Kahverengi orman toprağı", "Zonguldak-Kastamonu", { prompt: "Karadeniz orman toprağını bul." }],
        ["Kestane / bozkır toprağı", "Konya-Ankara", { prompt: "İç Anadolu bozkır topraklarını bul." }],
        ["Çernozyum", "Erzurum-Kars", { follow: { q: "En verimli zonal toprak?", choices: ["Podzol", "Çernozyum", "Terra rossa", "Halomorfik"], answer: "Çernozyum" } }],
        ["Podzol", "Zonguldak-Bartın", { prompt: "Batı Karadeniz yüksekleri podzolunu bul." }],
        ["Alüvyal (delta)", "Samsun-Adana", { prompt: "Alüvyal toprağın tipik olduğu delta ilini bul." }],
        ["Halomorfik (tuzlu)", "Aksaray", { prompt: "Tuz Gölü çevresi tuzlu toprağı bul." }],
        ["Vertisol (Ergene)", "Edirne-Tekirdağ", { prompt: "Dönen toprak / vertisol: Ergene'yi bul." }],
        ["Regosol (Kapadokya)", "Nevşehir", { prompt: "Volkanik tüf üzerinde regosol alanını bul." }]
    ].forEach(function (r) { ITEMS.push(F("toprak", r[0], r[1], r[2])); });

    [
        ["Çay", "Rize", { prompt: "Çay monokültürünü (Rize) bul." }],
        ["Fındık", "Ordu-Giresun", { prompt: "Fındık kuşağını bul." }],
        ["Zeytin", "Aydın-İzmir-Balıkesir", null],
        ["Turunçgil", "Antalya-Mersin-Adana-Hatay", null],
        ["Muz", "Mersin", { prompt: "Anamur muzunu bul." }],
        ["İncir", "Aydın", { prompt: "Aydın incirini bul." }],
        ["Kayısı", "Malatya", { prompt: "Malatya kayısısını bul." }],
        ["Pamuk (GAP)", "Şanlıurfa", { prompt: "GAP pamuğunun öne çıktığı ili bul." }],
        ["Mısır (Konya / sulama)", "Konya", { prompt: "Sulama ile mısırın genişlediği Konya'yı bul." }],
        ["Şeker pancarı", "Konya-Eskişehir", { prompt: "Şeker pancarı (fabrika/kota) alanını bul." }],
        ["Çeltik", "Edirne-Samsun", { prompt: "Devlet kontrollü çeltik alanını (Ergene / Bafra) bul." }],
        ["Haşhaş", "Afyonkarahisar-Denizli", { prompt: "Kontrollü haşhaş ekim alanını bul." }],
        ["Tütün", "Manisa-Samsun", null],
        ["Üzüm", "Manisa", null],
        ["Elma", "Isparta-Niğde-Karaman", null],
        ["Ayçiçeği", "Tekirdağ-Edirne", null],
        ["Buğday", "Konya", null],
        ["Antep fıstığı", "Gaziantep-Şanlıurfa", null]
    ].forEach(function (r) { ITEMS.push(F("tarim", r[0], r[1], r[2] || {})); });

    [
        ["Büyükbaş mera (Erzurum-Kars)", "Erzurum-Kars-Ardahan", { follow: { q: "Büyükbaş mera hayvancılığının merkezi?", choices: ["Teke Platosu", "Erzurum-Kars", "Konya Ovası", "Çukurova"], answer: "Erzurum-Kars" } }],
        ["Kıl keçisi (Teke–Taşeli)", "Antalya-Mersin", { follow: { q: "Karstik engebeye uyumlu hayvan?", choices: ["Tiftik keçisi", "Kıl keçisi", "Manda", "İpek böceği"], answer: "Kıl keçisi" } }],
        ["Tiftik keçisi", "Ankara-Eskişehir", { prompt: "Ankara keçisi / tiftik alanını bul." }],
        ["İpek böcekçiliği", "Diyarbakır", { prompt: "İpek böcekçiliğinde öne çıkan ili bul." }],
        ["Çam balı (Muğla)", "Muğla", { prompt: "Muğla çam balı alanını bul." }],
        ["Kümes (Bolu / Marmara-Ege)", "Bolu-Manisa-Balıkesir", { prompt: "Pazara yakın kümes hayvancılığı ilini bul." }]
    ].forEach(function (r) { ITEMS.push(F("hayvan", r[0], r[1], r[2])); });

    [
        ["Yıldız Dağları (seyrek)", "Kırklareli", { follow: { q: "Yıldız Dağları'nda nüfusun seyrek olmasının nedeni?", choices: ["Sanayi yokluğu değil; engebe", "Sadece turizm", "Okyanus iklimi", "Petrol yok"], answer: "Sanayi yokluğu değil; engebe" } }],
        ["Biga–Gelibolu", "Çanakkale", { prompt: "Ulaşıma sapa Biga–Gelibolu'yu bul." }],
        ["Menteşe Yöresi", "Muğla", { prompt: "Engebeli seyrek nüfus: Menteşe'yi bul." }],
        ["Teke–Taşeli", "Antalya-Mersin", { prompt: "Karst + engebe nedeniyle seyrek nüfusu bul." }],
        ["Hakkâri Bölümü", "Hakkâri", { prompt: "Yükselti/engebe nedeniyle seyrek nüfusu bul." }],
        ["Sivas ve çevresi", "Sivas", { prompt: "İç kesimde seyrek nüfus: Sivas çevresini bul." }],
        ["Tuz Gölü çevresi (kuraklık)", "Aksaray", { prompt: "Kuraklık nedeniyle seyrek nüfus: Tuz Gölü çevresini bul." }]
    ].forEach(function (r) { ITEMS.push(F("nufus-seyrek", r[0], r[1], r[2])); });

    [
        ["Çatalca–Kocaeli", "İstanbul-Kocaeli", { follow: { q: "Çatalca–Kocaeli'nin yoğun nüfus nedeni?", choices: ["Karstik arazi", "Sanayi / ticaret / ulaşım", "Yüksek plato soğuğu", "Sadece hayvancılık"], answer: "Sanayi / ticaret / ulaşım" } }],
        ["Doğu Karadeniz kıyısı", "Trabzon-Rize-Ordu", { prompt: "Dar kıyıda toplanan yoğun nüfusu bul." }],
        ["Kıyı Ege", "İzmir-Aydın", null],
        ["Çukurova", "Adana-Mersin", null],
        ["Gaziantep ve çevresi", "Gaziantep", null]
    ].forEach(function (r) { ITEMS.push(F("nufus-yogun", r[0], r[1], r[2] || {})); });

    ["Antalya", "Muğla", "Sinop", "Trabzon", "Giresun", "Rize", "Ordu", "Çanakkale", "Hakkâri", "Şırnak", "Kastamonu", "Nevşehir"].forEach(function (il) {
        var extra = { prompt: il + " ilini bul. ÖSYM: buraya demiryolu ile ulaşılamaz." };
        if (il === "Antalya") extra.follow = { q: "Hangisi demiryolu bağlantısı olmayan kıyı kentlerindendir?", choices: ["İzmir", "Samsun", "Antalya", "Mersin"], answer: "Antalya" };
        ITEMS.push(F("demiryolu", il + " (demiryolu yok)", il, extra));
    });

    [
        ["İstanbul Limanı (geniş hinterland)", "İstanbul"],
        ["İzmir Limanı (geniş hinterland)", "İzmir"],
        ["Mersin Limanı (geniş hinterland)", "Mersin"],
        ["İskenderun Limanı", "Hatay"],
        ["Samsun Limanı (geniş hinterland)", "Samsun", { follow: { q: "Canik Dağları alçak olduğu için hinterlandı geniş liman?", choices: ["Sinop", "Samsun", "Rize", "Giresun"], answer: "Samsun" } }],
        ["Sinop Limanı (dar hinterland)", "Sinop", { follow: { q: "Doğal liman olduğu halde Küre Dağları yüzünden gelişemeyen?", choices: ["İzmir", "Sinop", "Mersin", "İstanbul"], answer: "Sinop" } }],
        ["Trabzon Limanı (transit)", "Trabzon", { prompt: "Zigana/Kop sayesinde transit Trabzon limanını bul." }],
        ["Kuşadası (kruvaziyer)", "Aydın"]
    ].forEach(function (r) { ITEMS.push(F("liman", r[0], r[1], r[2] || {})); });

    [
        ["Demir: Divriği", "Sivas", { follow: { q: "Divriği demiri başlıca nerede işlenir?", choices: ["Rize", "Ereğli / Karabük / İskenderun", "Van", "Muğla"], answer: "Ereğli / Karabük / İskenderun" } }],
        ["Demir: Hekimhan", "Malatya", { prompt: "Hekimhan–Hasançelebi demirini bul." }],
        ["Bakır: Murgul", "Artvin"], ["Bakır: Küre", "Kastamonu"], ["Bakır: Maden", "Elazığ"],
        ["Bakır işleme: Samsun", "Samsun", { follow: { q: "Bakırın işlendiği liman kenti?", choices: ["Antalya", "Samsun", "Van", "Konya"], answer: "Samsun" } }],
        ["Boksit: Akseki", "Antalya"], ["Boksit işleme: Seydişehir", "Konya"],
        ["Krom: Guleman", "Elazığ"], ["Krom: Fethiye–Dalaman", "Muğla"],
        ["Bor: Balıkesir–Eskişehir–Kütahya–Bursa", "Balıkesir-Eskişehir-Kütahya-Bursa", { prompt: "Bor kuşağının bir ilini bul (Marmara güneyi / İçbatı Anadolu)." }]
    ].forEach(function (r) { ITEMS.push(F("maden", r[0], r[1], r[2] || {})); });

    [
        ["Demir-çelik: Ereğli", "Zonguldak", { follow: { q: "Ereğli–Karabük tesisinin temel kuruluş nedeni?", choices: ["Turizm", "Enerji / taşkömürü yakınlığı", "Pamuk tarımı", "Kruvaziyer"], answer: "Enerji / taşkömürü yakınlığı" } }],
        ["Demir-çelik: Karabük", "Karabük"],
        ["Demir-çelik: İskenderun", "Hatay", { follow: { q: "İskenderun demir-çeliğinin avantajı?", choices: ["Buzul vadisi", "Liman / ulaşım", "Podzol toprak", "Fiyort"], answer: "Liman / ulaşım" } }],
        ["Alüminyum: Seydişehir", "Konya", { prompt: "Boksitin işlendiği Seydişehir'i bul." }]
    ].forEach(function (r) { ITEMS.push(F("sanayi", r[0], r[1], r[2] || {})); });

    [
        ["BTC (Bakü–Tiflis–Ceyhan)", "Adana-Hatay", { prompt: "BTC'nin deniz terminali Ceyhan/İskenderun yöresini bul." }],
        ["TANAP güzergâhı", "Ardahan-Kars-Erzincan-Ankara-Eskişehir-Çanakkale", { prompt: "TANAP'ın geçtiği bir ili bul." }],
        ["Mavi Akım (Samsun)", "Samsun", { prompt: "Mavi Akım'ın karaya çıktığı Samsun'u bul." }],
        ["TürkAkım (Kıyıköy / Trakya)", "Kırklareli-Tekirdağ", { prompt: "TürkAkım'ın Trakya girişini bul." }]
    ].forEach(function (r) { ITEMS.push(F("boru", r[0], r[1], r[2])); });

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

    ITEMS.push(F("tuzak", "Kızılırmak → Bafra", "Samsun", { prompt: "Kızılırmak deltasını bul. (Yeşilırmak Çarşamba'dır.)" }));
    ITEMS.push(F("tuzak", "Yeşilırmak → Çarşamba", "Samsun", { prompt: "Yeşilırmak deltasını bul. (Kızılırmak Bafra'dır.)" }));
    ITEMS.push(F("tuzak", "Nemrut (Adıyaman) vs volkan", "Adıyaman", { prompt: "Adıyaman Nemrut'u bul — Kommagene heykelleri; volkan değildir.", follow: { q: "Volkanik Nemrut nerededir?", choices: ["Adıyaman", "Bitlis", "Ankara", "Muğla"], answer: "Bitlis" } }));
    ITEMS.push(F("tuzak", "Karadağ ≠ Karacadağ", "Karaman", { prompt: "Karaman Karadağ'ı bul. (Karacadağ Urfa–Diyarbakır'dadır.)" }));
    ITEMS.push(F("tuzak", "Karacadağ (kalkan volkan)", "Diyarbakır", { prompt: "Karacadağ'ı bul. (Karaman Karadağ değil.)" }));
    ITEMS.push(F("tuzak", "En yüksek dağ vs kıvrım zirvesi", "Ağrı", { prompt: "Ağrı Dağı'nı bul.", follow: { q: "Türkiye'nin en yüksek noktası Ağrı'dır. Kıvrım dağlarının en yükseği?", choices: ["Ağrı", "Demirkazık / Aladağlar", "Kaz Dağı", "Madra"], answer: "Demirkazık / Aladağlar" } }));
    ITEMS.push(F("tuzak", "En büyük göl vs tatlı su", "Van", { prompt: "Van Gölü'nü bul.", follow: { q: "En büyük tatlı su gölü?", choices: ["Van", "Tuz", "Beyşehir", "İznik"], answer: "Beyşehir" } }));
    ITEMS.push(F("tuzak", "Ovit ≠ Cankurtaran", "Rize", { prompt: "Ovit (Rize–Erzurum) geçidini bul. Cankurtaran Artvin'dedir." }));
    ITEMS.push(F("tuzak", "Fiyort / skyer yok", "Trabzon", { prompt: "Karadeniz boyuna kıyıyı bul.", follow: { q: "Türkiye'de hangisi görülmez?", choices: ["Ria", "Dalmaçya", "Fiyort ve skyer", "Boyuna kıyı"], answer: "Fiyort ve skyer" } }));

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

    function topicGlyph(topicId) {
        var t = String(topicId || "");
        var meta = topicMeta(topicId);
        if (meta && meta.icon) return meta.icon;
        if (t.indexOf("milli") === 0) return "🏞️";
        return "📍";
    }

    function itemGlyph(it) {
        if (!it) return "📍";
        var t = String(it.topic || "");
        var n = fold(it.name);
        if (t === "tarim") {
            if (n.indexOf("cay") >= 0) return "🍵";
            if (n.indexOf("findik") >= 0) return "🥜";
            if (n.indexOf("zeytin") >= 0) return "🫒";
            if (n.indexOf("turunc") >= 0) return "🍊";
            if (n.indexOf("muz") >= 0) return "🍌";
            if (n.indexOf("incir") >= 0) return "🍇";
            if (n.indexOf("kayisi") >= 0) return "🍑";
            if (n.indexOf("pamuk") >= 0) return "🤍";
            if (n.indexOf("misir") >= 0) return "🌽";
            if (n.indexOf("seker") >= 0) return "🍬";
            if (n.indexOf("celtik") >= 0) return "🍚";
            if (n.indexOf("hashas") >= 0) return "🌺";
            if (n.indexOf("tutun") >= 0) return "🍂";
            if (n.indexOf("uzum") >= 0) return "🍇";
            if (n.indexOf("elma") >= 0) return "🍎";
            if (n.indexOf("aycicegi") >= 0) return "🌻";
            if (n.indexOf("bugday") >= 0) return "🌾";
            if (n.indexOf("fisti") >= 0) return "🥜";
            return "🌾";
        }
        if (t === "hayvan") {
            if (n.indexOf("kec") >= 0) return "🐐";
            if (n.indexOf("ipek") >= 0) return "🦋";
            if (n.indexOf("bal") >= 0) return "🐝";
            if (n.indexOf("kumes") >= 0) return "🐔";
            return "🐄";
        }
        if (t === "maden") {
            if (n.indexOf("demir") >= 0) return "⚙️";
            if (n.indexOf("bakir") >= 0) return "🔶";
            if (n.indexOf("boksit") >= 0) return "🧱";
            if (n.indexOf("krom") >= 0) return "🪨";
            if (n.indexOf("bor") >= 0) return "💎";
            return "⛏️";
        }
        if (t === "sanayi") {
            if (n.indexOf("aluminyum") >= 0 || n.indexOf("seydisehir") >= 0) return "🧱";
            return "🏭";
        }
        if (t === "yagis") return n.indexOf("en az") >= 0 ? "☀️" : "🌧️";
        if (t === "mikro") {
            if (n.indexOf("turunc") >= 0) return "🍊";
            if (n.indexOf("pamuk") >= 0) return "🤍";
            if (n.indexOf("zeytin") >= 0) return "🫒";
            if (n.indexOf("muz") >= 0) return "🍌";
            return "🌡️";
        }
        if (t === "kiyi") {
            if (n.indexOf("boyuna") >= 0) return "📏";
            if (n.indexOf("enine") >= 0) return "〰️";
            if (n.indexOf("ria") >= 0) return "🌊";
            if (n.indexOf("dalmac") >= 0) return "🏝️";
            if (n.indexOf("limani") >= 0) return "🛶";
            if (n.indexOf("kalank") >= 0 || n.indexOf("karst") >= 0) return "🪨";
            return "🏖️";
        }
        if (t === "goller") {
            if (n.indexOf("cekmece") >= 0 || n.indexOf("terkos") >= 0 || n.indexOf("akyatan") >= 0) return "🌅";
            if (n.indexOf("krater") >= 0 || n.indexOf("meke") >= 0 || n.indexOf("golcuk") >= 0 || n.indexOf("nemrut") >= 0) return "🌋";
            return "🏞️";
        }
        if (t === "bitki") {
            if (n.indexOf("sigla") >= 0 || n.indexOf("goknar") >= 0 || n.indexOf("mese") >= 0 || n.indexOf("hurma") >= 0) return "🌳";
            if (n.indexOf("maki") >= 0) return "🌿";
            if (n.indexOf("bozkir") >= 0) return "🌾";
            if (n.indexOf("cayir") >= 0) return "☘️";
            if (n.indexOf("orman") >= 0) return "🌲";
            return "🌿";
        }
        if (t === "toprak") {
            if (n.indexOf("terra") >= 0) return "🟥";
            if (n.indexOf("cernozyom") >= 0 || n.indexOf("cernezyom") >= 0) return "⬛";
            if (n.indexOf("tuz") >= 0 || n.indexOf("halo") >= 0) return "🧂";
            if (n.indexOf("aluvyal") >= 0) return "🟡";
            if (n.indexOf("podzol") >= 0) return "🌫️";
            return "🟤";
        }
        if (t === "akarsu") return "💧";
        if (t === "delta") return "🌊";
        if (t === "gecit") return "🏔️";
        if (t === "fay") return "⚡";
        if (t === "deprem-az") return "🟢";
        if (t === "volkanik" || t === "volkanik-arazi") return "🌋";
        if (t === "kirik") return "⛰️";
        if (t === "kivrim") return "🏔️";
        if (t === "liman") return n.indexOf("kruvaz") >= 0 ? "🚢" : "⚓";
        if (t === "boru") return "🛢️";
        if (t === "demiryolu") return "🚫";
        if (t === "nufus-seyrek") return "🏕️";
        if (t === "nufus-yogun") return "🏙️";
        if (t.indexOf("milli") === 0) return "🏞️";
        if (t === "tuzak") {
            if (n.indexOf("nemrut") >= 0) return "🗿";
            if (n.indexOf("bafra") >= 0 || n.indexOf("carsamba") >= 0) return "🌊";
            if (n.indexOf("agri") >= 0 || n.indexOf("karadag") >= 0 || n.indexOf("karacadag") >= 0) return "🌋";
            if (n.indexOf("gol") >= 0 || n.indexOf("van") >= 0) return "🏞️";
            if (n.indexOf("ovit") >= 0) return "🏔️";
            if (n.indexOf("fiyort") >= 0) return "🏖️";
            return "🧠";
        }
        return topicGlyph(t);
    }

    ITEMS.forEach(function (it) { it.glyph = itemGlyph(it); });

    function countFor(topicId) { return itemsForTopic(topicId).length; }

    function separatePins(pins, minD) {
        minD = minD || 44;
        var n, i, j;
        for (n = 0; n < 28; n++) {
            for (i = 0; i < pins.length; i++) {
                for (j = i + 1; j < pins.length; j++) {
                    var dx = pins[j].x - pins[i].x;
                    var dy = pins[j].y - pins[i].y;
                    var d = Math.sqrt(dx * dx + dy * dy) || 0.01;
                    if (d < minD) {
                        var push = (minD - d) / 2 + 1.2;
                        pins[i].x -= (dx / d) * push;
                        pins[i].y -= (dy / d) * push;
                        pins[j].x += (dx / d) * push;
                        pins[j].y += (dy / d) * push;
                    }
                }
            }
        }
        pins.forEach(function (p) {
            p.x = Math.max(18, Math.min(982, p.x));
            p.y = Math.max(18, Math.min(404, p.y));
        });
        return pins;
    }

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
            return { id: it.id, name: it.name, x: it.x, y: it.y, glyph: it.glyph || itemGlyph(it) };
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
            "Erciyes Dağı": ["TR38", 0.12, 0.08],
            "Sultan Sazlığı": ["TR38", -0.20, 0.42],
            "Hasan Dağı": ["TR68", -0.05, 0.42],
            "Melendiz Dağı": ["TR51", -0.28, -0.28],
            "Göllüdağ": ["TR51", 0.38, 0.32],
            "Kapadokya": ["TR50", 0, -0.1],
            "Karadağ": ["TR70", 0.05, 0.35],
            "Karacadağ": ["TR21", -0.35, 0.20],
            "Nemrut Dağı (volkan)": ["TR13", -0.20, 0.25],
            "Süphan Dağı": ["TR13", 0.45, -0.35],
            "Ağrı Dağı": ["TR04", 0.35, -0.15],
            "Tendürek Dağı": ["TR04", 0.15, 0.40],
            "Teke Platosu": ["TR07", -0.35, 0.05],
            "Taşeli Platosu": ["TR33", -0.35, 0.20],
            "Tefenni Ovası": ["TR15", -0.25, 0.20],
            "Kestel Ovası": ["TR15", 0.30, -0.15],
            "Korkuteli Ovası": ["TR07", -0.28, -0.05],
            "Elmalı Ovası": ["TR07", -0.18, 0.22],
            "Acıpayam Ovası": ["TR20", 0.10, 0.35],
            "Zigana Geçidi": ["TR61", 0.10, 0.35],
            "Ovit Geçidi": ["TR53", 0.05, 0.35]
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
                    var r = Math.max(28, Math.min(box.w, box.h) * 0.42);
                    x = box.x + Math.cos(a) * r;
                    y = box.y + Math.sin(a) * r;
                }
                pins.push({ id: it.id, name: it.name, x: x, y: y, glyph: it.glyph || itemGlyph(it) });
            });
        });
        separatePins(pins, 52);
        return { pins: pins, viewBox: "0 0 1000 422", glyph: topicGlyph(topicId) };
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
        topicGlyph: topicGlyph,
        itemGlyph: itemGlyph,
        PARK_SOURCE: "Tarım ve Orman Bakanlığı DKMP — 54 milli park (2026)"
    };
export const MapQuiz = api;
