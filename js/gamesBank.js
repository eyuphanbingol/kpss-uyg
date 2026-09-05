(function (global) {
    var REGION_FACTS = {
        marmara: [
            ["Marmara Bölgesi'nin en kalabalık ili hangisidir?", ["İstanbul", "Bursa", "Kocaeli", "Tekirdağ"], "İstanbul"],
            ["Marmara'da sanayi yoğunluğu en fazla hangi ilde görülür?", ["Kocaeli", "Edirne", "Kırklareli", "Yalova"], "Kocaeli"]
        ],
        ege: [
            ["Ege Bölgesi'nin karakteristik tarım ürünü hangisidir?", ["Zeytin", "Çay", "Fındık", "Pamuk (Güneydoğu)"], "Zeytin"],
            ["Ege'de horst-graben sistemiyle oluşan ovalar hangi denize açılır?", ["Ege Denizi", "Karadeniz", "Marmara", "Akdeniz"], "Ege Denizi"]
        ],
        akdeniz: [
            ["Akdeniz ikliminde yazlar nasıl geçer?", ["Sıcak ve kurak", "Serin ve yağışlı", "Soğuk ve kurak", "Ilıman ve sisli"], "Sıcak ve kurak"],
            ["Akdeniz Bölgesi'nde seracılık en gelişmiş illerden hangisidir?", ["Antalya", "Rize", "Kars", "Zonguldak"], "Antalya"]
        ],
        ic: [
            ["İç Anadolu'da tarımda öne çıkan ürün hangisidir?", ["Buğday", "Çay", "Muz", "Fındık"], "Buğday"],
            ["İç Anadolu'nun iklim tipi hangisine yakındır?", ["Karasal", "Ekvatoral", "Muson", "Okyanusal"], "Karasal"]
        ],
        karadeniz: [
            ["Doğu Karadeniz'de en çok yetiştirilen tarım ürünü hangisidir?", ["Çay", "Antep fıstığı", "Pamuk", "Zeytin"], "Çay"],
            ["Karadeniz kıyısında yağışın fazla olmasının temel nedeni nedir?", ["Dağların kıyıya paralel uzanması", "Çöl etkisi", "Muson rüzgârları", "Gulf Stream"], "Dağların kıyıya paralel uzanması"]
        ],
        dogu: [
            ["Doğu Anadolu'da kışların sert geçmesinin başlıca nedeni nedir?", ["Yükselti", "Denizellik", "Muson", "Sera etkisi"], "Yükselti"],
            ["Doğu Anadolu'da hayvancılıkta öne çıkan faaliyet hangisidir?", ["Küçükbaş / büyükbaş mera", "Seracılık", "Çay", "Turunçgil"], "Küçükbaş / büyükbaş mera"]
        ],
        guneydogu: [
            ["Güneydoğu Anadolu Projesi (GAP) hangi iki ırmağa dayanır?", ["Fırat ve Dicle", "Kızılırmak ve Yeşilırmak", "Sakarya ve Gediz", "Çoruh ve Aras"], "Fırat ve Dicle"],
            ["Güneydoğu'da yaz kuraklığına rağmen tarımı büyüten etken hangisidir?", ["Sulama", "Muson yağışı", "Buzul", "Tundra"], "Sulama"]
        ]
    };

    var SPECIAL = {
        TR01: [
            ["Adana ve çevresinin verimli ovası hangisidir?", ["Çukurova", "Harran", "Ergene", "Çarşamba"], "Çukurova"],
            ["Çukurova'da öne çıkan sanayi bitkisi hangisidir?", ["Pamuk", "Çay", "Fındık", "Keten"], "Pamuk"]
        ],
        TR06: [
            ["Türkiye Cumhuriyeti'nin başkenti hangi ildir?", ["Ankara", "İstanbul", "İzmir", "Bursa"], "Ankara"],
            ["Ankara keçisi hangi ürünüyle ünlüdür?", ["Tiftik", "İpek", "Pamuk", "Keten"], "Tiftik"]
        ],
        TR07: [
            ["Antalya ekonomisinde öne çıkan sektör hangisidir?", ["Turizm", "Taşkömürü", "Çay", "Demir-çelik"], "Turizm"],
            ["Antalya hangi coğrafi bölgededir?", ["Akdeniz", "Ege", "Marmara", "İç Anadolu"], "Akdeniz"]
        ],
        TR16: [
            ["Bursa tarihsel olarak hangi üretimle anılır?", ["İpek / otomotiv", "Çay", "Taşkömürü", "Antep fıstığı"], "İpek / otomotiv"],
            ["Bursa hangi bölgededir?", ["Marmara", "Ege", "Karadeniz", "Akdeniz"], "Marmara"]
        ],
        TR17: [
            ["Çanakkale Savaşları hangi boğaz çevresinde yaşanmıştır?", ["Çanakkale Boğazı", "İstanbul Boğazı", "Hürmüz", "Cebelitarık"], "Çanakkale Boğazı"],
            ["Gelibolu Yarımadası hangi ildedir?", ["Çanakkale", "Edirne", "Tekirdağ", "Balıkesir"], "Çanakkale"]
        ],
        TR21: [
            ["Diyarbakır hangi tarım ürünüyle de anılır?", ["Karpuz", "Çay", "Fındık", "Muz"], "Karpuz"],
            ["Dicle Nehri hangi bölgeden geçer?", ["Güneydoğu Anadolu", "Marmara", "Karadeniz", "Ege"], "Güneydoğu Anadolu"]
        ],
        TR22: [
            ["Edirne'de Meriç Nehri hangi ülkeye doğru sınır oluşturur?", ["Yunanistan / Bulgaristan hattı", "Gürcistan", "Suriye", "Irak"], "Yunanistan / Bulgaristan hattı"],
            ["Edirne hangi bölgededir?", ["Marmara", "Ege", "Akdeniz", "İç Anadolu"], "Marmara"]
        ],
        TR25: [
            ["Erzurum Kongresi hangi yılda toplanmıştır?", ["1919", "1920", "1921", "1923"], "1919"],
            ["Erzurum-Kars Platosu hangi ekonomik faaliyet için elverişlidir?", ["Hayvancılık", "Muz", "Çay", "Zeytin"], "Hayvancılık"]
        ],
        TR27: [
            ["Gaziantep hangi tarım ürünüyle öne çıkar?", ["Antep fıstığı", "Çay", "Fındık", "Muz"], "Antep fıstığı"],
            ["Milli Mücadele'de Antep'e verilen unvan hangisidir?", ["Kahraman", "Gazi", "Ulu", "Büyük"], "Kahraman"]
        ],
        TR31: [
            ["Hatay'ın Türkiye'ye katıldığı yıl hangisidir?", ["1939", "1923", "1919", "1945"], "1939"],
            ["Amik Ovası hangi ildedir?", ["Hatay", "Adana", "Mersin", "Osmaniye"], "Hatay"]
        ],
        TR32: [
            ["Isparta hangi tarım ürünüyle ünlüdür?", ["Gül", "Çay", "Fındık", "Pamuk"], "Gül"],
            ["Eğirdir Gölü'ne kıyısı olan il hangisidir?", ["Isparta", "Van", "Konya", "Bursa"], "Isparta"]
        ],
        TR33: [
            ["Mersin'de öne çıkan hayvancılık türü hangisidir?", ["Kıl keçisi", "Ankara keçisi", "Manda", "İpek böceği"], "Kıl keçisi"],
            ["Taşeli Platosu hangi ile yakındır?", ["Mersin", "Rize", "Kars", "Edirne"], "Mersin"]
        ],
        TR34: [
            ["Türkiye'de nüfusu en fazla olan il hangisidir?", ["İstanbul", "Ankara", "İzmir", "Bursa"], "İstanbul"],
            ["İstanbul Boğazı hangi iki denizi birleştirir?", ["Karadeniz-Marmara", "Ege-Akdeniz", "Marmara-Ege", "Van-Tuz"], "Karadeniz-Marmara"]
        ],
        TR35: [
            ["İzmir Limanı hangi denize açılır?", ["Ege Denizi", "Karadeniz", "Marmara", "Akdeniz"], "Ege Denizi"],
            ["Gediz Nehri hangi ile yaklaşır?", ["İzmir", "Trabzon", "Van", "Şanlıurfa"], "İzmir"]
        ],
        TR36: [
            ["Kars Antlaşması hangi yıl imzalanmıştır?", ["1921", "1918", "1923", "1939"], "1921"],
            ["Kars-Erzurum yöresinde öne çıkan faaliyet hangisidir?", ["Mera hayvancılığı", "Çay", "Turunçgil", "Zeytin"], "Mera hayvancılığı"]
        ],
        TR38: [
            ["Erciyes Dağı hangi ildedir?", ["Kayseri", "Niğde", "Nevşehir", "Aksaray"], "Kayseri"],
            ["Kayseri sanayisinde öne çıkan dallardan biri hangisidir?", ["Mobilya / pastırma", "Çay", "Taşkömürü", "Fındık"], "Mobilya / pastırma"]
        ],
        TR41: [
            ["Türkiye'nin ağır sanayi koridorunda öne çıkan il hangisidir?", ["Kocaeli", "Rize", "Iğdır", "Burdur"], "Kocaeli"],
            ["Kocaeli hangi bölgededir?", ["Marmara", "Karadeniz", "Ege", "Akdeniz"], "Marmara"]
        ],
        TR42: [
            ["Konya Ovası hangi ürünle anılır?", ["Buğday", "Çay", "Muz", "Fındık"], "Buğday"],
            ["Tuz Gölü'ne komşu illerden biri hangisidir?", ["Konya", "Rize", "Hakkâri", "Edirne"], "Konya"]
        ],
        TR44: [
            ["Malatya hangi meyveyle ünlüdür?", ["Kayısı", "Fındık", "Çay", "Muz"], "Kayısı"],
            ["Malatya hangi bölgededir?", ["Doğu Anadolu", "Marmara", "Ege", "Karadeniz"], "Doğu Anadolu"]
        ],
        TR45: [
            ["Manisa'da öne çıkan tarım ürünlerinden biri hangisidir?", ["Üzüm / tütün", "Çay", "Fındık", "Antep fıstığı"], "Üzüm / tütün"],
            ["Gediz Grabeni hangi bölgededir?", ["Ege", "Karadeniz", "Doğu Anadolu", "Marmara"], "Ege"]
        ],
        TR50: [
            ["Peri bacaları hangi il çevresinde yoğunlaşır?", ["Nevşehir", "Rize", "Zonguldak", "Hakkâri"], "Nevşehir"],
            ["Kapadokya hangi coğrafi bölgededir?", ["İç Anadolu", "Akdeniz", "Karadeniz", "Marmara"], "İç Anadolu"]
        ],
        TR52: [
            ["Ordu hangi tarım ürünüyle öne çıkar?", ["Fındık", "Çay", "Pamuk", "Zeytin"], "Fındık"],
            ["Ordu'da arıcılıkla ünlü yaylalar hangi bölgededir?", ["Karadeniz", "Akdeniz", "Güneydoğu", "Marmara"], "Karadeniz"]
        ],
        TR53: [
            ["Rize'nin simge tarım ürünü hangisidir?", ["Çay", "Pamuk", "Antep fıstığı", "Zeytin"], "Çay"],
            ["Doğu Karadeniz'de en fazla yağış alan illerden biri hangisidir?", ["Rize", "Konya", "Şanlıurfa", "Iğdır"], "Rize"]
        ],
        TR55: [
            ["19 Mayıs 1919'da Mustafa Kemal hangi ile çıkmıştır?", ["Samsun", "İstanbul", "İzmir", "Antalya"], "Samsun"],
            ["Bafra ve Çarşamba ovaları hangi ile bağlıdır?", ["Samsun", "Ordu", "Trabzon", "Sinop"], "Samsun"]
        ],
        TR58: [
            ["Sivas Kongresi hangi yılda toplanmıştır?", ["1919", "1920", "1921", "1923"], "1919"],
            ["Sivas hangi bölgededir?", ["İç Anadolu", "Karadeniz", "Doğu Anadolu", "Marmara"], "İç Anadolu"]
        ],
        TR61: [
            ["Trabzon'da Sümela Manastırı hangi dağlık alanda yer alır?", ["Doğu Karadeniz dağları", "Toroslar", "Kaz Dağı", "Amanos"], "Doğu Karadeniz dağları"],
            ["Trabzon hangi bölgededir?", ["Karadeniz", "Marmara", "Ege", "Akdeniz"], "Karadeniz"]
        ],
        TR63: [
            ["Harran Ovası hangi ildedir?", ["Şanlıurfa", "Gaziantep", "Mardin", "Diyarbakır"], "Şanlıurfa"],
            ["Milli Mücadele'de Urfa'ya verilen unvan hangisidir?", ["Şanlı", "Kahraman", "Gazi", "Ulu"], "Şanlı"]
        ],
        TR65: [
            ["Türkiye'nin en büyük gölü hangisidir?", ["Van Gölü", "Tuz Gölü", "Beyşehir", "İznik"], "Van Gölü"],
            ["İnci kefali hangi gölle anılır?", ["Van Gölü", "Tuz Gölü", "Eğirdir", "Sapanca"], "Van Gölü"]
        ],
        TR67: [
            ["Zonguldak hangi yeraltı kaynağıyla ünlüdür?", ["Taşkömürü", "Petrol", "Bor", "Tuz"], "Taşkömürü"],
            ["Zonguldak hangi bölgededir?", ["Karadeniz", "Marmara", "Ege", "Akdeniz"], "Karadeniz"]
        ],
        TR09: [
            ["Aydın ve çevresinde öne çıkan tarım ürünü hangisidir?", ["İncir", "Çay", "Fındık", "Keten"], "İncir"],
            ["Büyük Menderes Grabeni hangi bölgededir?", ["Ege", "Karadeniz", "Doğu Anadolu", "Marmara"], "Ege"]
        ],
        TR48: [
            ["Muğla ekonomisinde öne çıkan sektör hangisidir?", ["Turizm", "Taşkömürü", "Çay", "Petrol"], "Turizm"],
            ["Muğla hangi bölgededir?", ["Ege", "Akdeniz", "Marmara", "Karadeniz"], "Ege"]
        ],
        TR80: [
            ["Osmaniye hangi ovalık alanın doğu ucuna yakındır?", ["Çukurova", "Ergene", "Çarşamba", "Harran"], "Çukurova"],
            ["Osmaniye hangi bölgededir?", ["Akdeniz", "Güneydoğu", "Ege", "Marmara"], "Akdeniz"]
        ]
    };

    var TABU = [
        { answer: "Moskova Antlaşması", clues: ["1921", "Gürcistan / Sovyetler", "Doğu sınırı"], choices: ["Moskova Antlaşması", "Kars Antlaşması", "Gümrü Antlaşması", "Lozan Antlaşması"] },
        { answer: "Kars Antlaşması", clues: ["1921", "Ermenistan / Gürcistan / Azerbaycan", "Doğu sınırını pekiştirir"], choices: ["Kars Antlaşması", "Moskova Antlaşması", "Sevr", "Mondros"] },
        { answer: "Gümrü Antlaşması", clues: ["1920", "TBMM'nin ilk siyasi antlaşması", "Ermenistan"], choices: ["Gümrü Antlaşması", "Lozan", "Mudanya", "Ankara Antlaşması"] },
        { answer: "Lozan Antlaşması", clues: ["24 Temmuz 1923", "Kapitülasyonlar kalkar", "Yeni Türk devletinin tapusu"], choices: ["Lozan Antlaşması", "Sevr", "Mondros", "Mudanya"] },
        { answer: "Mudanya Ateşkes", clues: ["11 Ekim 1922", "Doğu Trakya savaşsız", "İtilaf – TBMM"], choices: ["Mudanya Ateşkes", "Mondros", "Lozan", "Ankara"] },
        { answer: "Mondros Ateşkes", clues: ["30 Ekim 1918", "Limni", "İşgallere kapı açtı"], choices: ["Mondros Ateşkes", "Mudanya", "Sevr", "Lozan"] },
        { answer: "Sevr Antlaşması", clues: ["10 Ağustos 1920", "Osmanlı'yı parçalar", "TBMM tanımadı"], choices: ["Sevr Antlaşması", "Lozan", "Mondros", "Gümrü"] },
        { answer: "Misak-ı Millî", clues: ["28 Ocak 1920", "Son Osmanlı Mebusan", "Ulusal sınırlar"], choices: ["Misak-ı Millî", "Teşkilat-ı Esasiye", "Kanun-ı Esasi", "Tanzimat"] },
        { answer: "Erzurum Kongresi", clues: ["23 Temmuz 1919", "Mustafa Kemal başkan", "Doğu vilayetleri"], choices: ["Erzurum Kongresi", "Sivas Kongresi", "Amasya Genelgesi", "Havza"] },
        { answer: "Sivas Kongresi", clues: ["4 Eylül 1919", "Tek cemiyet", "Temsil Heyeti"], choices: ["Sivas Kongresi", "Erzurum Kongresi", "Balıkesir", "Alaşehir"] },
        { answer: "Amasya Genelgesi", clues: ["22 Haziran 1919", "Milletin istiklali", "Tarihin dönüm noktası"], choices: ["Amasya Genelgesi", "Havza Genelgesi", "Misak-ı Millî", "Nutuk"] },
        { answer: "TBMM'nin açılışı", clues: ["23 Nisan 1920", "Ankara", "Egemenlik kayıtsız şartsız milletindir"], choices: ["TBMM'nin açılışı", "Cumhuriyet", "Saltanatın kaldırılması", "Halifeliğin kaldırılması"] },
        { answer: "Saltanatın kaldırılması", clues: ["1 Kasım 1922", "Osmanlı hanedanı siyasi yetki", "Lozan öncesi"], choices: ["Saltanatın kaldırılması", "Halifeliğin kaldırılması", "Cumhuriyet", "Çok partili hayat"] },
        { answer: "Halifeliğin kaldırılması", clues: ["3 Mart 1924", "Laiklik adımı", "Öğretimin birliği aynı gün"], choices: ["Halifeliğin kaldırılması", "Saltanatın kaldırılması", "Medeni Kanun", "Harf Devrimi"] },
        { answer: "Cumhuriyetin ilanı", clues: ["29 Ekim 1923", "Gazi Mustafa Kemal", "Devletin şekli"], choices: ["Cumhuriyetin ilanı", "TBMM açılışı", "Lozan", "İzmir İktisat"] },
        { answer: "Sakarya Meydan Muharebesi", clues: ["23 Ağustos 1921", "Hattı müdafaa yoktur", "Mareşallik"], choices: ["Sakarya Meydan Muharebesi", "Başkomutanlık Meydan Muharebesi", "I. İnönü", "Kütahya-Eskişehir"] },
        { answer: "Başkomutanlık Meydan Muharebesi", clues: ["26 Ağustos 1922", "Dumlupınar", "Büyük Taarruz"], choices: ["Başkomutanlık Meydan Muharebesi", "Sakarya", "II. İnönü", "Aslıhanlar"] },
        { answer: "I. İnönü Muharebesi", clues: ["6-11 Ocak 1921", "İsmet Paşa", "Londra Konferansı'na giden yol"], choices: ["I. İnönü Muharebesi", "II. İnönü", "Sakarya", "Kütahya"] },
        { answer: "Teşkilat-ı Esasiye", clues: ["20 Ocak 1921", "İlk anayasa", "Egemenlik millete"], choices: ["Teşkilat-ı Esasiye", "1924 Anayasası", "1961 Anayasası", "1982 Anayasası"] },
        { answer: "Anayasa Mahkemesi", clues: ["15 üye", "Norm denetimi", "Yüce Divan da bakabilir"], choices: ["Anayasa Mahkemesi", "Danıştay", "Yargıtay", "Sayıştay"] },
        { answer: "TBMM", clues: ["Yasama", "Bütçe", "Seçim dönemi 5 yıl"], choices: ["TBMM", "Cumhurbaşkanlığı", "AYM", "Danıştay"] },
        { answer: "Kuvvetler ayrılığı", clues: ["Yasama", "Yürütme", "Yargı"], choices: ["Kuvvetler ayrılığı", "Kuvvetler birliği", "Üniter devlet", "Federasyon"] },
        { answer: "Laiklik", clues: ["Din ve devlet işleri", "Vicdan özgürlüğü", "1982 md. 2"], choices: ["Laiklik", "Milliyetçilik", "Sosyal devlet", "Hukuk devleti"] },
        { answer: "Hukuk devleti", clues: ["İdarenin yargı denetimi", "Kanunilik", "Temel haklar güvence"], choices: ["Hukuk devleti", "Polis devleti", "Teokrasi", "Oligarşi"] },
        { answer: "Sosyal devlet", clues: ["Asgari ücret", "Sosyal güvenlik", "Fırsat eşitliği"], choices: ["Sosyal devlet", "Liberal gece bekçisi", "Merkantilizm", "Feodalite"] },
        { answer: "Üniter devlet", clues: ["Tek yasama", "Tek yürütme", "İl sistemi"], choices: ["Üniter devlet", "Federasyon", "Konfederasyon", "Özerk cumhuriyetler"] },
        { answer: "Kapitülasyonlar", clues: ["Yabancılara imtiyaz", "Lozan'da kalktı", "Ekonomik bağımlılık"], choices: ["Kapitülasyonlar", "Düyun-ı Umumiye", "Reji", "Tımar"] },
        { answer: "Düyun-ı Umumiye", clues: ["Osmanlı borçları", "1881", "Gelirlerin denetimi"], choices: ["Düyun-ı Umumiye", "Kapitülasyon", "İltizam", "Mukataa"] },
        { answer: "İzmir İktisat Kongresi", clues: ["1923", "Karma ekonomi", "Misak-ı İktisadi"], choices: ["İzmir İktisat Kongresi", "Lozan", "Birinci Beş Yıllık", "Devletçilik 1930"] },
        { answer: "Nutuk", clues: ["15-20 Ekim 1927", "CHF kurultayı", "1919-1927 anlatısı"], choices: ["Nutuk", "Medeni Bilgiler", "Söylev ve Demeçler", "Arıburnu"] },
        { answer: "Takrir-i Sükûn", clues: ["1925", "Şeyh Sait sonrası", "Olağanüstü yetki"], choices: ["Takrir-i Sükûn", "Tesanüt", "Teşvik-i Sanayi", "Umumî Müfettişlik"] },
        { answer: "Harf Devrimi", clues: ["1 Kasım 1928", "Latin alfabesi", "Okuma yazma seferberliği"], choices: ["Harf Devrimi", "Kılık kıyafet", "Soyadı", "Takvim"] },
        { answer: "Medeni Kanun", clues: ["1926", "İsviçre örneği", "Kadın-erkek eşitliği adımı"], choices: ["Medeni Kanun", "Ceza Kanunu", "Borçlar", "İcra İflas"] },
        { answer: "Boğazlar", clues: ["Montrö 1936", "Egemenlik", "Karadeniz'e kıyıdaş"], choices: ["Montrö Boğazlar Sözleşmesi", "Lozan Boğazlar", "Sevr", "Londra"] },
        { answer: "Hatay'ın katılışı", clues: ["1939", "Sancak", "Fransa / Suriye"], choices: ["Hatay'ın katılışı", "Kars", "Boğazlar", "Musul"] },
        { answer: "Musul sorunu", clues: ["Lozan'da çözülemedi", "1926 Ankara", "Petrol / Irak"], choices: ["Musul sorunu", "Hatay", "Boğazlar", "Ege adaları"] },
        { answer: "Fırat", clues: ["Doğu Anadolu kaynak", "GAP", "Suriye'ye çıkar"], choices: ["Fırat", "Kızılırmak", "Sakarya", "Gediz"] },
        { answer: "Kızılırmak", clues: ["En uzun ırmak", "Bafra", "İç Anadolu yayı"], choices: ["Kızılırmak", "Fırat", "Dicle", "Yeşilırmak"] },
        { answer: "Toroslar", clues: ["Kıvrım dağları", "Akdeniz", "Gülek Boğazı"], choices: ["Toroslar", "Karadeniz Dağları", "Yıldız Dağları", "Kaz Dağı"] },
        { answer: "GAP", clues: ["Fırat-Dicle", "Sulama + enerji", "Güneydoğu"], choices: ["GAP", "DAP", "DOKAP", "KOP"] }
    ];

    var PANIC = [
        { q: "Milletvekili seçilme yaşı?", a: "18", choices: ["18", "21", "25", "30"] },
        { q: "Cumhurbaşkanı seçilme yaşı?", a: "40", choices: ["40", "35", "30", "18"] },
        { q: "Anayasa Mahkemesi üye sayısı?", a: "15", choices: ["15", "11", "13", "17"] },
        { q: "TBMM seçim dönemi (yıl)?", a: "5", choices: ["5", "4", "6", "7"] },
        { q: "Cumhurbaşkanı görev süresi (yıl)?", a: "5", choices: ["5", "4", "6", "7"] },
        { q: "Bir kimse en fazla kaç kez cumhurbaşkanı seçilebilir?", a: "2", choices: ["2", "1", "3", "sınırsız"] },
        { q: "TBMM üye tam sayısı?", a: "600", choices: ["600", "550", "450", "650"] },
        { q: "Anayasa değişikliği için TBMM'de en az kaç üye oyu gerekir? (3/5)", a: "360", choices: ["360", "400", "301", "330"] },
        { q: "Halkoyuna götürülen anayasa değişikliği için Meclis'te en az kaç oy?", a: "330", choices: ["330", "360", "400", "301"] },
        { q: "Olağanüstü hâl en fazla kaç ay ilan edilebilir? (ilk süre)", a: "6 ay", choices: ["6 ay", "3 ay", "1 yıl", "45 gün"] },
        { q: "Yerel seçim dönemi (yıl)?", a: "5", choices: ["5", "4", "6", "3"] },
        { q: "Olağanüstü hâl ilan yetkisi kimdedir?", a: "Cumhurbaşkanı", choices: ["Cumhurbaşkanı", "TBMM Başkanı", "Genelkurmay", "İçişleri Bakanı"] },
        { q: "Türkiye'nin başkenti?", a: "Ankara", choices: ["Ankara", "İstanbul", "Bursa", "İzmir"] },
        { q: "1982 Anayasası hangi yılda kabul edildi?", a: "1982", choices: ["1982", "1961", "1924", "1921"] },
        { q: "1921 Teşkilat-ı Esasiye hangi yılda?", a: "1921", choices: ["1921", "1924", "1961", "1982"] },
        { q: "1924 Anayasası hangi yılda?", a: "1924", choices: ["1924", "1921", "1961", "1982"] },
        { q: "1961 Anayasası hangi yılda?", a: "1961", choices: ["1961", "1982", "1924", "1921"] },
        { q: "Cumhuriyet hangi gün ilan edildi? (gün-ay)", a: "29 Ekim", choices: ["29 Ekim", "23 Nisan", "30 Ağustos", "19 Mayıs"] },
        { q: "Ulusal Egemenlik ve Çocuk Bayramı?", a: "23 Nisan", choices: ["23 Nisan", "19 Mayıs", "30 Ağustos", "29 Ekim"] },
        { q: "Zafer Bayramı?", a: "30 Ağustos", choices: ["30 Ağustos", "29 Ekim", "18 Mart", "19 Mayıs"] },
        { q: "Atatürk'ü Anma, Gençlik ve Spor Bayramı?", a: "19 Mayıs", choices: ["19 Mayıs", "23 Nisan", "30 Ağustos", "10 Kasım"] },
        { q: "Lozan Antlaşması yılı?", a: "1923", choices: ["1923", "1922", "1924", "1921"] },
        { q: "Sakarya Meydan Muharebesi yılı?", a: "1921", choices: ["1921", "1922", "1920", "1919"] },
        { q: "Büyük Taarruz yılı?", a: "1922", choices: ["1922", "1921", "1923", "1920"] },
        { q: "Erzurum Kongresi yılı?", a: "1919", choices: ["1919", "1920", "1918", "1921"] },
        { q: "Sivas Kongresi yılı?", a: "1919", choices: ["1919", "1920", "1918", "1923"] },
        { q: "TBMM'nin açılış yılı?", a: "1920", choices: ["1920", "1919", "1923", "1921"] },
        { q: "Saltanatın kaldırıldığı yıl?", a: "1922", choices: ["1922", "1923", "1924", "1921"] },
        { q: "Halifeliğin kaldırıldığı yıl?", a: "1924", choices: ["1924", "1923", "1922", "1928"] },
        { q: "Harf Devrimi yılı?", a: "1928", choices: ["1928", "1924", "1926", "1934"] },
        { q: "Soyadı Kanunu yılı?", a: "1934", choices: ["1934", "1928", "1926", "1938"] },
        { q: "Kadınlara milletvekili seçme/seçilme hakkı yılı?", a: "1934", choices: ["1934", "1930", "1926", "1946"] },
        { q: "Kadınlara belediye seçim hakkı yılı?", a: "1930", choices: ["1930", "1934", "1926", "1946"] },
        { q: "Türkiye'nin il sayısı?", a: "81", choices: ["81", "67", "79", "83"] },
        { q: "Coğrafi bölge sayısı?", a: "7", choices: ["7", "5", "9", "4"] },
        { q: "AYİM / Danıştay hangisi idari yargının başıdır?", a: "Danıştay", choices: ["Danıştay", "Yargıtay", "AYM", "Sayıştay"] },
        { q: "Adli yargının en üst mercii?", a: "Yargıtay", choices: ["Yargıtay", "Danıştay", "AYM", "HSK"] },
        { q: "Sayıştay'ın temel görevi?", a: "kamu mali denetim", choices: ["kamu mali denetim", "ceza yargılaması", "anayasa denetimi", "seçim kurulama"] },
        { q: "HSK üye sayısı?", a: "13", choices: ["13", "15", "11", "7"] },
        { q: "Anayasa'da değiştirilemeyecek maddeler kaçıncı maddeler? (kısa)", a: "ilk 3 madde", choices: ["ilk 3 madde", "sadece 1. madde", "tüm 2. kısım", "hiçbiri"] },
        { q: "TBMM üye tam sayısının salt çoğunluğu?", a: "301", choices: ["301", "300", "360", "400"] },
        { q: "Olağan kanun için TBMM toplantı yeter sayısı üye tam sayısının?", a: "en az 1/3", choices: ["en az 1/3", "salt çoğunluk", "2/3", "3/5"] },
        { q: "Karar yeter sayısı kural olarak?", a: "katılanların salt çoğunluğu", choices: ["katılanların salt çoğunluğu", "üye tam sayısının 2/3", "oybirliği", "1/4"] },
        { q: "Montrö Boğazlar Sözleşmesi yılı?", a: "1936", choices: ["1936", "1923", "1939", "1945"] },
        { q: "Hatay'ın anavatana katıldığı yıl?", a: "1939", choices: ["1939", "1936", "1923", "1945"] },
        { q: "NATO'ya giriş yılı?", a: "1952", choices: ["1952", "1945", "1949", "1960"] },
        { q: "AB adaylık Helsinki yılı (Türkiye)?", a: "1999", choices: ["1999", "2005", "1987", "2004"] },
        { q: "Anayasa Mahkemesi başkanını kim seçer?", a: "kendi üyeleri", choices: ["kendi üyeleri", "TBMM", "Cumhurbaşkanı tek başına", "HSK"] },
        { q: "Milletvekili dokunulmazlığı hangi organda görüşülür?", a: "TBMM", choices: ["TBMM", "AYM", "Yargıtay", "Cumhurbaşkanı"] }
    ];

    global.GamesBank = {
        REGION_FACTS: REGION_FACTS,
        SPECIAL: SPECIAL,
        TABU: TABU,
        PANIC: PANIC,
        TABU_SCORE: [5, 3, 2, 1]
    };
})(typeof window !== "undefined" ? window : globalThis);
