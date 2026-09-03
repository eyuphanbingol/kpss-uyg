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
        PARK_SOURCE: "Tarım ve Orman Bakanlığı DKMP — 54 milli park (2026)"
    };
    global.MapQuiz = api;
    if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
