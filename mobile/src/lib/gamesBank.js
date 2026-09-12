(function (global) {
    var REGION_FACTS = {
        marmara: [
            ["Marmara Bölgesi'nin en kalabalık ili hangisidir?", ["İstanbul", "Bursa", "Kocaeli", "Tekirdağ"], "İstanbul"],
            ["Marmara'da sanayi yoğunluğu en fazla hangi ilde görülür?", ["Kocaeli", "Edirne", "Kırklareli", "Yalova"], "Kocaeli"],
            ["Türkiye'de sanayinin en gelişmiş bölgesi hangisidir?", ["Marmara", "Doğu Anadolu", "Doğu Karadeniz", "Güneydoğu"], "Marmara"]
        ],
        ege: [
            ["Ege Bölgesi'nin karakteristik tarım ürünü hangisidir?", ["Zeytin", "Çay", "Fındık", "Pamuk (Güneydoğu)"], "Zeytin"],
            ["Ege'de horst-graben sistemiyle oluşan ovalar hangi denize açılır?", ["Ege Denizi", "Karadeniz", "Marmara", "Akdeniz"], "Ege Denizi"],
            ["Jeotermal potansiyelin en yüksek olduğu bölge hangisidir?", ["Ege", "Doğu Karadeniz", "Marmara", "Güneydoğu"], "Ege"]
        ],
        akdeniz: [
            ["Akdeniz ikliminde yazlar nasıl geçer?", ["Sıcak ve kurak", "Serin ve yağışlı", "Soğuk ve kurak", "Ilıman ve sisli"], "Sıcak ve kurak"],
            ["Akdeniz Bölgesi'nde seracılık en gelişmiş illerden hangisidir?", ["Antalya", "Rize", "Kars", "Zonguldak"], "Antalya"]
        ],
        ic: [
            ["İç Anadolu'da tarımda öne çıkan ürün hangisidir?", ["Buğday", "Çay", "Muz", "Fındık"], "Buğday"],
            ["İç Anadolu'nun iklim tipi hangisine yakındır?", ["Karasal", "Ekvatoral", "Muson", "Okyanusal"], "Karasal"],
            ["Şeker fabrikaları en fazla hangi bölgededir?", ["Orta Anadolu", "Doğu Karadeniz", "Güneydoğu", "Marmara kıyısı"], "Orta Anadolu"]
        ],
        karadeniz: [
            ["Doğu Karadeniz'de en çok yetiştirilen tarım ürünü hangisidir?", ["Çay", "Antep fıstığı", "Pamuk", "Zeytin"], "Çay"],
            ["Karadeniz kıyısında yağışın fazla olmasının temel nedeni nedir?", ["Dağların kıyıya paralel uzanması", "Çöl etkisi", "Muson rüzgârları", "Gulf Stream"], "Dağların kıyıya paralel uzanması"],
            ["Taş kömürü rezervinin neredeyse tamamı hangi bölgededir?", ["Batı Karadeniz", "Ege", "Güneydoğu", "Marmara"], "Batı Karadeniz"],
            ["Doğu Karadeniz'e demir yolu neden gitmez?", ["Engebeli / dağlık yapı", "Sermaye fazlalığı", "Düz ova", "Liman yokluğu"], "Engebeli / dağlık yapı"]
        ],
        dogu: [
            ["Doğu Anadolu'da kışların sert geçmesinin başlıca nedeni nedir?", ["Yükselti", "Denizellik", "Muson", "Sera etkisi"], "Yükselti"],
            ["Doğu Anadolu'da otluk-mera büyükbaşın başlıca illeri hangileridir?", ["Erzurum, Kars, Ağrı", "Manisa, Balıkesir", "Mersin, Antalya", "Samsun, Ordu"], "Erzurum, Kars, Ağrı"],
            ["Doğu Anadolu'da sanayiyi destekleyen faktörlerden biri hangisidir?", ["Maden çeşitliliği", "En yüksek Ar-Ge", "En büyük pazar", "Sermaye fazlalığı"], "Maden çeşitliliği"]
        ],
        guneydogu: [
            ["Güneydoğu Anadolu Projesi (GAP) hangi iki ırmağa dayanır?", ["Fırat ve Dicle", "Kızılırmak ve Yeşilırmak", "Sakarya ve Gediz", "Çoruh ve Aras"], "Fırat ve Dicle"],
            ["Güneydoğu'da yaz kuraklığına rağmen tarımı büyüten etken hangisidir?", ["Sulama", "Muson yağışı", "Buzul", "Tundra"], "Sulama"],
            ["Atatürk HES hangi nehir üzerindedir?", ["Fırat", "Dicle", "Kızılırmak", "Çoruh"], "Fırat"]
        ]
    };

    var SPECIAL = {
        TR01: [
            ["Adana ve çevresinin verimli ovası hangisidir?", ["Çukurova", "Harran", "Ergene", "Çarşamba"], "Çukurova"],
            ["Çukurova'da öne çıkan sanayi bitkisi hangisidir?", ["Pamuk", "Çay", "Fındık", "Keten"], "Pamuk"],
            ["Mısırözü yağı sanayisi hangi ildedir?", ["Adana", "Edirne", "Rize", "Kars"], "Adana"]
        ],
        TR06: [
            ["Türkiye Cumhuriyeti'nin başkenti hangi ildir?", ["Ankara", "İstanbul", "İzmir", "Bursa"], "Ankara"],
            ["Ankara keçisi hangi ürünüyle ünlüdür?", ["Tiftik", "İpek", "Pamuk", "Keten"], "Tiftik"],
            ["Uçak ve savunma sanayisinin merkezlerinden biri hangisidir?", ["Ankara", "Rize", "Batman", "Artvin"], "Ankara"]
        ],
        TR07: [
            ["Antalya ekonomisinde öne çıkan sektör hangisidir?", ["Turizm", "Taşkömürü", "Çay", "Demir-çelik"], "Turizm"],
            ["Antalya hangi coğrafi bölgededir?", ["Akdeniz", "Ege", "Marmara", "İç Anadolu"], "Akdeniz"]
        ],
        TR16: [
            ["Bursa tarihsel olarak hangi üretimle anılır?", ["İpek / otomotiv", "Çay", "Taşkömürü", "Antep fıstığı"], "İpek / otomotiv"],
            ["Bursa hangi bölgededir?", ["Marmara", "Ege", "Karadeniz", "Akdeniz"], "Marmara"],
            ["Ovaakça kombine çevrim santrali hangi ildedir?", ["Bursa", "İzmir", "Zonguldak", "Mersin"], "Bursa"]
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
            ["Edirne hangi bölgededir?", ["Marmara", "Ege", "Akdeniz", "İç Anadolu"], "Marmara"],
            ["Kapıkule sınır kapısı hangi ildedir?", ["Edirne", "Şırnak", "Ağrı", "Artvin"], "Edirne"],
            ["Yunanistan demiryolu kapısı hangisidir?", ["Uzunköprü", "Kapıköy", "Akyaka", "Canbaz"], "Uzunköprü"]
        ],
        TR25: [
            ["Erzurum Kongresi hangi yılda toplanmıştır?", ["1919", "1920", "1921", "1923"], "1919"],
            ["Erzurum-Kars Platosu hangi ekonomik faaliyet için elverişlidir?", ["Hayvancılık", "Muz", "Çay", "Zeytin"], "Hayvancılık"],
            ["Et kombinalarının bulunduğu illerden biri hangisidir?", ["Erzurum", "Rize", "Tekirdağ", "Giresun"], "Erzurum"]
        ],
        TR27: [
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
            ["Taşeli Platosu hangi ile yakındır?", ["Mersin", "Rize", "Kars", "Edirne"], "Mersin"],
            ["Akkuyu nükleer santrali hangi ildedir?", ["Mersin", "Sinop", "Kırklareli", "İzmir"], "Mersin"]
        ],
        TR34: [
            ["Türkiye'de nüfusu en fazla olan il hangisidir?", ["İstanbul", "Ankara", "İzmir", "Bursa"], "İstanbul"],
            ["İstanbul Boğazı hangi iki denizi birleştirir?", ["Karadeniz-Marmara", "Ege-Akdeniz", "Marmara-Ege", "Van-Tuz"], "Karadeniz-Marmara"],
            ["Tuzla–Haliç–Pendik hangi sanayi koluyla anılır?", ["Gemi yapımı", "Çay", "Şeker", "Seramik"], "Gemi yapımı"],
            ["Türkiye'nin en büyük havalimanı hangisidir?", ["İstanbul Havalimanı", "GAP Havalimanı", "Esenboğa", "Adnan Menderes"], "İstanbul Havalimanı"]
        ],
        TR35: [
            ["İzmir Limanı hangi denize açılır?", ["Ege Denizi", "Karadeniz", "Marmara", "Akdeniz"], "Ege Denizi"],
            ["Gediz Nehri hangi ile yaklaşır?", ["İzmir", "Trabzon", "Van", "Şanlıurfa"], "İzmir"],
            ["Türkiye'nin ilk rüzgâr santrali nerededir?", ["Çeşme-Alaçatı", "Karapınar", "Akkuyu", "Silopi"], "Çeşme-Alaçatı"],
            ["Hinterlandı geniş limanlardan biri hangisidir?", ["İzmir", "Sinop", "Hopa", "Cide"], "İzmir"]
        ],
        TR36: [
            ["Kars Antlaşması hangi yıl imzalanmıştır?", ["1921", "1918", "1923", "1939"], "1921"],
            ["Kars-Erzurum yöresinde öne çıkan faaliyet hangisidir?", ["Mera hayvancılığı", "Çay", "Turunçgil", "Zeytin"], "Mera hayvancılığı"],
            ["Ermenistan demiryolu kapısı (siyasi nedenle kapalı) hangisidir?", ["Akyaka", "Kapıkule", "Kapıköy", "Canbaz"], "Akyaka"]
        ],
        TR38: [
            ["Erciyes Dağı hangi ildedir?", ["Kayseri", "Niğde", "Nevşehir", "Aksaray"], "Kayseri"],
            ["Kayseri sanayisinde öne çıkan dallardan biri hangisidir?", ["Mobilya / pastırma", "Çay", "Taşkömürü", "Fındık"], "Mobilya / pastırma"],
            ["Mobilya sanayisinin merkezlerinden biri hangisidir?", ["Kayseri", "Rize", "Batman", "Artvin"], "Kayseri"]
        ],
        TR41: [
            ["Türkiye'nin ağır sanayi koridorunda öne çıkan il hangisidir?", ["Kocaeli", "Rize", "Iğdır", "Burdur"], "Kocaeli"],
            ["Kocaeli hangi bölgededir?", ["Marmara", "Karadeniz", "Ege", "Akdeniz"], "Marmara"],
            ["Hereke halı-kilim sanayisi hangi ile bağlıdır?", ["Kocaeli", "Rize", "Kars", "Şırnak"], "Kocaeli"]
        ],
        TR42: [
            ["Konya Ovası hangi ürünle anılır?", ["Buğday", "Çay", "Muz", "Fındık"], "Buğday"],
            ["Tuz Gölü'ne komşu illerden biri hangisidir?", ["Konya", "Rize", "Hakkâri", "Edirne"], "Konya"],
            ["Türkiye'nin en büyük GES'i nerededir?", ["Karapınar", "Birecik", "Alaçatı", "Germencik"], "Karapınar"]
        ],
        TR44: [
            ["Kayısı üretiminde öne çıkan iller hangileridir?", ["Malatya ve Mersin", "Rize ve Trabzon", "Kars ve Ağrı", "Edirne ve Tekirdağ"], "Malatya ve Mersin"],
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
            ["Trabzon hangi bölgededir?", ["Karadeniz", "Marmara", "Ege", "Akdeniz"], "Karadeniz"],
            ["İran transit yükü hangi limandan Karadeniz'e çıkar?", ["Trabzon", "İzmir", "Mersin", "İskenderun"], "Trabzon"]
        ],
        TR63: [
            ["Harran Ovası hangi ildedir?", ["Şanlıurfa", "Gaziantep", "Mardin", "Diyarbakır"], "Şanlıurfa"],
            ["Antep fıstığı üretiminde notlara göre öne çıkan il hangisidir?", ["Şanlıurfa", "Rize", "Konya", "Trabzon"], "Şanlıurfa"],
            ["Milli Mücadele'de Urfa'ya verilen unvan hangisidir?", ["Şanlı", "Kahraman", "Gazi", "Ulu"], "Şanlı"],
            ["Türkiye'nin ilk güneş tarlası nerededir?", ["Şanlıurfa-Birecik", "Konya-Karapınar", "Mersin", "Aydın"], "Şanlıurfa-Birecik"],
            ["En büyük kargo havalimanı hangisidir?", ["Şanlıurfa (GAP)", "Sinop", "Hopa", "Cide"], "Şanlıurfa (GAP)"]
        ],
        TR65: [
            ["Türkiye'nin en büyük gölü hangisidir?", ["Van Gölü", "Tuz Gölü", "Beyşehir", "İznik"], "Van Gölü"],
            ["İnci kefali hangi gölle anılır?", ["Van Gölü", "Tuz Gölü", "Eğirdir", "Sapanca"], "Van Gölü"],
            ["İran demiryolu kapısı hangisidir?", ["Kapıköy", "Kapıkule", "Akyaka", "Uzunköprü"], "Kapıköy"]
        ],
        TR67: [
            ["Zonguldak hangi yeraltı kaynağıyla ünlüdür?", ["Taşkömürü", "Petrol", "Bor", "Tuz"], "Taşkömürü"],
            ["Zonguldak hangi bölgededir?", ["Karadeniz", "Marmara", "Ege", "Akdeniz"], "Karadeniz"],
            ["Kozlu ve Karadon hangi enerji kaynağıyla anılır?", ["Taşkömürü", "Jeotermal", "Nükleer", "Güneş"], "Taşkömürü"]
        ],
        TR09: [
            ["Aydın ve çevresinde öne çıkan tarım ürünü hangisidir?", ["İncir", "Çay", "Fındık", "Keten"], "İncir"],
            ["Büyük Menderes Grabeni hangi bölgededir?", ["Ege", "Karadeniz", "Doğu Anadolu", "Marmara"], "Ege"],
            ["Germencik hangi enerji kaynağıyla anılır?", ["Jeotermal", "Nükleer", "Taşkömürü", "Asfaltit"], "Jeotermal"]
        ],
        TR48: [
            ["Muğla ekonomisinde öne çıkan sektör hangisidir?", ["Turizm", "Taşkömürü", "Çay", "Petrol"], "Turizm"],
            ["Muğla hangi bölgededir?", ["Ege", "Akdeniz", "Marmara", "Karadeniz"], "Ege"]
        ],
        TR80: [
            ["Osmaniye hangi ovalık alanın doğu ucuna yakındır?", ["Çukurova", "Ergene", "Çarşamba", "Harran"], "Çukurova"],
            ["Osmaniye hangi bölgededir?", ["Akdeniz", "Güneydoğu", "Ege", "Marmara"], "Akdeniz"]
        ],
        TR72: [
            ["Türkiye'de petrol ilk kez hangi ilde bulunmuştur?", ["Batman", "Zonguldak", "İzmir", "Konya"], "Batman"],
            ["Hammaddeye bağlı tek petro-kimya tesisi nerededir?", ["Batman", "İstanbul", "Rize", "Kayseri"], "Batman"]
        ],
        TR46: [
            ["Türkiye'nin en büyük linyit santrali nerededir?", ["Afşin-Elbistan", "Alaçatı", "Akkuyu", "Silopi"], "Afşin-Elbistan"]
        ],
        TR73: [
            ["Asfaltit (katı petrol) Türkiye'de nerede bulunur?", ["Şırnak-Silopi", "Zonguldak", "Bartın", "Konya"], "Şırnak-Silopi"],
            ["Habur sınır kapısı hangi ildedir?", ["Şırnak", "Edirne", "Ağrı", "Artvin"], "Şırnak"]
        ],
        TR20: [
            ["Denizli-Sarayköy hangi enerji kaynağıyla ilişkilidir?", ["Jeotermal", "Nükleer", "Taşkömürü", "Petrol"], "Jeotermal"],
            ["Pamuklu dokuma merkezlerinden biri hangisidir?", ["Denizli", "Rize", "Kars", "Kastamonu"], "Denizli"]
        ],
        TR08: [
            ["Deriner ve Yusufeli HES hangi ildedir?", ["Artvin", "Samsun", "Elazığ", "Mardin"], "Artvin"],
            ["Çay fabrikalarının bulunduğu illerden biri hangisidir?", ["Artvin", "Konya", "Batman", "Kütahya"], "Artvin"]
        ],
        TR04: [
            ["Gürbulak sınır kapısı hangi ildedir?", ["Ağrı", "Edirne", "Şırnak", "Hatay"], "Ağrı"]
        ],
        TR57: [
            ["Doğal liman olduğu halde hinterlandı dar olduğu için gelişemeyen liman hangisidir?", ["Sinop", "İzmir", "Mersin", "İstanbul"], "Sinop"]
        ],
        TR26: [
            ["Türkiye'nin ilk YHT hattı hangi ili Ankara'ya bağlar?", ["Eskişehir", "Erzurum", "Antalya", "Rize"], "Eskişehir"]
        ]
    };

    var TABU = [
        { answer: "Moskova Antlaşması", clues: ["TBMM ile Sovyet Rusya", "Doğu sınırını çizer", "Bolşevik Rusya ile imzalanır"], choices: ["Moskova Antlaşması", "Kars Antlaşması", "Gümrü Antlaşması", "Lozan Antlaşması"] },
        { answer: "Kars Antlaşması", clues: ["Ermenistan, Gürcistan, Azerbaycan", "Doğu sınırını pekiştirir", "Moskova'yı teyit eder"], choices: ["Kars Antlaşması", "Moskova Antlaşması", "Sevr", "Mondros"] },
        { answer: "Gümrü Antlaşması", clues: ["TBMM'nin ilk siyasi antlaşması", "Ermenistan ile", "Doğu cephesi sonrası"], choices: ["Gümrü Antlaşması", "Lozan", "Mudanya", "Ankara Antlaşması"] },
        { answer: "Lozan Antlaşması", clues: ["Kapitülasyonlar kalkar", "Yeni Türk devletinin tapusu", "Egemenliğin tescili"], choices: ["Lozan Antlaşması", "Sevr", "Mondros", "Mudanya"] },
        { answer: "Mudanya Ateşkes", clues: ["Doğu Trakya savaşsız alınır", "İtilaf ile TBMM masası", "Ateşkes, henüz barış değil"], choices: ["Mudanya Ateşkes", "Mondros", "Lozan", "Ankara"] },
        { answer: "Mondros Ateşkes", clues: ["Limni adasında imzalanır", "İşgallere kapı açtı", "Birinci Dünya Savaşı'nı bitirir"], choices: ["Mondros Ateşkes", "Mudanya", "Sevr", "Lozan"] },
        { answer: "Sevr Antlaşması", clues: ["Osmanlı'yı parçalar", "TBMM tanımaz", "İtilaf'ın dayatması"], choices: ["Sevr Antlaşması", "Lozan", "Mondros", "Gümrü"] },
        { answer: "Misak-ı Millî", clues: ["Son Osmanlı Mebusan Meclisi", "Ulusal sınır belgesi", "Ahd-i millî"], choices: ["Misak-ı Millî", "Teşkilat-ı Esasiye", "Kanun-ı Esasi", "Tanzimat"] },
        { answer: "Erzurum Kongresi", clues: ["Mustafa Kemal başkan seçilir", "Doğu vilayetleri", "Manda ve himaye reddedilir"], choices: ["Erzurum Kongresi", "Sivas Kongresi", "Amasya Genelgesi", "Havza"] },
        { answer: "Sivas Kongresi", clues: ["Cemiyetler tek çatıda", "Temsil Heyeti tüm yurdu temsil", "Heyet-i Temsiliye"], choices: ["Sivas Kongresi", "Erzurum Kongresi", "Balıkesir", "Alaşehir"] },
        { answer: "Amasya Genelgesi", clues: ["Milletin istiklali tehlikededir", "Tarihin dönüm noktası denir", "Sivas'a çağrı yapılır"], choices: ["Amasya Genelgesi", "Havza Genelgesi", "Misak-ı Millî", "Nutuk"] },
        { answer: "TBMM'nin açılışı", clues: ["Ankara'da yeni meclis", "Egemenlik kayıtsız şartsız milletindir", "Kurucu meclis"], choices: ["TBMM'nin açılışı", "Cumhuriyet", "Saltanatın kaldırılması", "Halifeliğin kaldırılması"] },
        { answer: "Saltanatın kaldırılması", clues: ["Osmanlı hanedanının siyasi yetkisi biter", "Lozan öncesi hamle", "Saltanat kalkar, hilafet kalır"], choices: ["Saltanatın kaldırılması", "Halifeliğin kaldırılması", "Cumhuriyet", "Çok partili hayat"] },
        { answer: "Halifeliğin kaldırılması", clues: ["Laiklik yönünde adım", "Tevhid-i Tedrisat aynı gün", "Hilafet sona erer"], choices: ["Halifeliğin kaldırılması", "Saltanatın kaldırılması", "Medeni Kanun", "Harf Devrimi"] },
        { answer: "Cumhuriyetin ilanı", clues: ["Devletin şekli belirlenir", "Gazi Mustafa Kemal ilk cumhurbaşkanı", "Cumhuriyet idaresi"], choices: ["Cumhuriyetin ilanı", "TBMM açılışı", "Lozan", "İzmir İktisat"] },
        { answer: "Sakarya Meydan Muharebesi", clues: ["Hattı müdafaa yoktur sathı müdafaa vardır", "Mareşallik ve gazilik", "Yunan ilerleyişi durur"], choices: ["Sakarya Meydan Muharebesi", "Başkomutanlık Meydan Muharebesi", "I. İnönü", "Kütahya-Eskişehir"] },
        { answer: "Başkomutanlık Meydan Muharebesi", clues: ["Dumlupınar", "Büyük Taarruz", "Başkomutanlık yetkisiyle"], choices: ["Başkomutanlık Meydan Muharebesi", "Sakarya", "II. İnönü", "Aslıhanlar"] },
        { answer: "I. İnönü Muharebesi", clues: ["İsmet Paşa komutası", "Londra Konferansı'na giden yol", "İlk düzenli ordu zaferi"], choices: ["I. İnönü Muharebesi", "II. İnönü", "Sakarya", "Kütahya"] },
        { answer: "Teşkilat-ı Esasiye", clues: ["TBMM'nin ilk anayasası", "Egemenlik millete aittir", "Meclis hükümeti sistemi"], choices: ["Teşkilat-ı Esasiye", "1924 Anayasası", "1961 Anayasası", "1982 Anayasası"] },
        { answer: "Anayasa Mahkemesi", clues: ["15 üye", "Norm denetimi", "Yüce Divan da bakabilir"], choices: ["Anayasa Mahkemesi", "Danıştay", "Yargıtay", "Sayıştay"] },
        { answer: "TBMM", clues: ["Yasama", "Bütçe", "Seçim dönemi 5 yıl"], choices: ["TBMM", "Cumhurbaşkanlığı", "AYM", "Danıştay"] },
        { answer: "Kuvvetler ayrılığı", clues: ["Yasama", "Yürütme", "Yargı"], choices: ["Kuvvetler ayrılığı", "Kuvvetler birliği", "Üniter devlet", "Federasyon"] },
        { answer: "Laiklik", clues: ["Din ve devlet işleri", "Vicdan özgürlüğü", "Anayasal nitelik"], choices: ["Laiklik", "Milliyetçilik", "Sosyal devlet", "Hukuk devleti"] },
        { answer: "Hukuk devleti", clues: ["İdarenin yargı denetimi", "Kanunilik", "Temel haklar güvence"], choices: ["Hukuk devleti", "Polis devleti", "Teokrasi", "Oligarşi"] },
        { answer: "Sosyal devlet", clues: ["Asgari ücret", "Sosyal güvenlik", "Fırsat eşitliği"], choices: ["Sosyal devlet", "Liberal gece bekçisi", "Merkantilizm", "Feodalite"] },
        { answer: "Üniter devlet", clues: ["Tek yasama", "Tek yürütme", "İl sistemi"], choices: ["Üniter devlet", "Federasyon", "Konfederasyon", "Özerk cumhuriyetler"] },
        { answer: "Kapitülasyonlar", clues: ["Yabancılara imtiyaz", "Lozan'da kalktı", "Ekonomik bağımlılık"], choices: ["Kapitülasyonlar", "Düyun-ı Umumiye", "Reji", "Tımar"] },
        { answer: "Düyun-ı Umumiye", clues: ["Osmanlı borç idaresi", "Gelirlerin denetimi", "Muharrem Kararnamesi sonrası"], choices: ["Düyun-ı Umumiye", "Kapitülasyon", "İltizam", "Mukataa"] },
        { answer: "İzmir İktisat Kongresi", clues: ["Karma ekonomi tercihi", "Misak-ı İktisadi", "Milli iktisat ilkeleri"], choices: ["İzmir İktisat Kongresi", "Lozan", "Birinci Beş Yıllık", "Devletçilik 1930"] },
        { answer: "Nutuk", clues: ["CHF kurultayında okunur", "Milli mücadele anlatısı", "Söylev"], choices: ["Nutuk", "Medeni Bilgiler", "Söylev ve Demeçler", "Arıburnu"] },
        { answer: "Takrir-i Sükûn", clues: ["Şeyh Sait isyanı sonrası", "Olağanüstü yetki", "Basına sıkı denetim"], choices: ["Takrir-i Sükûn", "Tesanüt", "Teşvik-i Sanayi", "Umumî Müfettişlik"] },
        { answer: "Harf Devrimi", clues: ["Latin alfabesine geçiş", "Okuma yazma seferberliği", "Millet mektepleri"], choices: ["Harf Devrimi", "Kılık kıyafet", "Soyadı", "Takvim"] },
        { answer: "Medeni Kanun", clues: ["İsviçre örneği", "Kadın-erkek eşitliği adımı", "Medeni nikâh"], choices: ["Medeni Kanun", "Ceza Kanunu", "Borçlar", "İcra İflas"] },
        { answer: "Montrö Boğazlar Sözleşmesi", clues: ["Boğazlarda tam egemenlik", "Karadeniz'e kıyıdaş düzeni", "Boğazlar rejimi yenilenir"], choices: ["Montrö Boğazlar Sözleşmesi", "Lozan Boğazlar", "Sevr", "Londra"] },
        { answer: "Hatay'ın katılışı", clues: ["Sancak meselesi", "Fransa / Suriye hattı", "Anavatana katılım"], choices: ["Hatay'ın katılışı", "Kars", "Boğazlar", "Musul"] },
        { answer: "Musul sorunu", clues: ["Lozan'da çözülemedi", "Petrol ve Irak", "Ankara'da ayrıca görüşüldü"], choices: ["Musul sorunu", "Hatay", "Boğazlar", "Ege adaları"] },
        { answer: "Fırat", clues: ["Doğu Anadolu kaynak", "GAP", "Suriye'ye çıkar"], choices: ["Fırat", "Kızılırmak", "Sakarya", "Gediz"] },
        { answer: "Kızılırmak", clues: ["Sınırlar içi en uzun", "Bafra deltası", "İç Anadolu yayı"], choices: ["Kızılırmak", "Fırat", "Dicle", "Yeşilırmak"] },
        { answer: "Toroslar", clues: ["Kıvrım dağları", "Akdeniz", "Gülek Boğazı"], choices: ["Toroslar", "Karadeniz Dağları", "Yıldız Dağları", "Kaz Dağı"] },
        { answer: "GAP", clues: ["Fırat-Dicle", "Sulama + enerji", "Güneydoğu"], choices: ["GAP", "DAP", "DOKAP", "KOP"] },
        { answer: "Bor", clues: ["Dünya rezervinin ~%72'si", "Kırka ve Bandırma", "Balıkesir–Eskişehir–Kütahya–Bursa"], choices: ["Bor", "Krom", "Fosfat", "Trona"] },
        { answer: "Krom", clues: ["Paslanmazlık", "Guleman / Köyceğiz", "İhraç edilir"], choices: ["Krom", "Bor", "Boksit", "Manganez"] },
        { answer: "Boksit", clues: ["Alüminyum cevheri", "Akseki", "Seydişehir'de işlenir"], choices: ["Boksit", "Barit", "Fosfat", "Trona"] },
        { answer: "Trona", clues: ["Soda külü", "Cam sanayisi", "Beypazarı–Kazan"], choices: ["Trona", "Bor", "Tuz", "Feldspat"] },
        { answer: "Lüle taşı", clues: ["Eskişehir", "Pipo", "Süs eşyası"], choices: ["Lüle taşı", "Oltu taşı", "Zımpara", "Pomza"] },
        { answer: "Oltu taşı", clues: ["Erzurum", "Takı", "Süs eşyası"], choices: ["Oltu taşı", "Lüle taşı", "Mermer", "Perlit"] },
        { answer: "Yukarı Fırat", clues: ["Maden çeşitliliği en fazla", "Elazığ çevresi", "Volkanizma"], choices: ["Yukarı Fırat", "Yukarı Kızılırmak", "Çukurova", "Ergene"] },
        { answer: "Divriği", clues: ["Sivas", "Demir çıkarımı", "Hekimhan ile anılır"], choices: ["Divriği", "Küre", "Guleman", "Mazıdağı"] },
        { answer: "Ankara keçisi", clues: ["Tiftik", "İç Anadolu", "Ankara çevresi"], choices: ["Ankara keçisi", "Kıl keçisi", "Tiftik dışı koyun", "Manda"] },
        { answer: "Kıl keçisi", clues: ["Akdeniz / Toros", "Maki", "Engebeli yamaç"], choices: ["Kıl keçisi", "Ankara keçisi", "Merinos", "Kıvırcık"] },
        { answer: "Mera hayvancılığı", clues: ["Doğu Anadolu", "Yaz yayla", "İklim etkisi fazla"], choices: ["Mera hayvancılığı", "Ahır-besi", "Kümes", "Arıcılık"] },
        { answer: "Çay", clues: ["Doğu Karadeniz", "Rize", "Yağış + eğim"], choices: ["Çay", "Fındık", "Zeytin", "Pamuk"] },
        { answer: "Fındık", clues: ["1. Karadeniz, 2. Marmara", "Dünya 1.", "Devirli ürün"], choices: ["Fındık", "Çay", "Antepfıstığı", "İncir"] },
        { answer: "Pamuk", clues: ["Şanlıurfa 1.", "Adana ve Aydın", "Sulama + yaz kuraklığı"], choices: ["Pamuk", "Çay", "Fındık", "Keten"] },
        { answer: "Antep fıstığı", clues: ["Şanlıurfa çevresi", "Devirli ürün", "Dünya 3. (İran'dan sonra)"], choices: ["Antep fıstığı", "Fındık", "İncir", "Çay"] },
        { answer: "İncir", clues: ["Aydın monokültür", "Dünya 1.", "Kış ılıklığı"], choices: ["İncir", "Çay", "Fındık", "Pamuk"] },
        { answer: "Afşin-Elbistan", clues: ["En büyük linyit santrali", "Kahramanmaraş", "Termik"], choices: ["Afşin-Elbistan", "Alaçatı", "Akkuyu", "Silopi"] },
        { answer: "Akkuyu", clues: ["İlk nükleer santral", "Mersin", "İnşaatı devam"], choices: ["Akkuyu", "Sinop", "İğneada", "Karapınar"] },
        { answer: "TANAP", clues: ["Azerbaycan gazı", "Trans Anadolu", "Avrupa'ya gider"], choices: ["TANAP", "Mavi Akım", "BTC", "Kerkük-Yumurtalık"] },
        { answer: "Bakü-Tiflis-Ceyhan", clues: ["Azerbaycan petrolü", "Akdeniz", "Ceyhan"], choices: ["Bakü-Tiflis-Ceyhan", "TANAP", "Mavi Akım", "BTE"] },
        { answer: "Mavi Akım", clues: ["Rusya gazı", "Karadeniz altı", "Samsun"], choices: ["Mavi Akım", "Türk Akımı", "TANAP", "Doğu Hattı"] },
        { answer: "Linyit", clues: ["Alt kalorili", "III. jeolojik zaman", "Türkiye'de yaygın"], choices: ["Linyit", "Taş kömürü", "Asfaltit", "Uranyum"] },
        { answer: "Taş kömürü", clues: ["Karbonifer", "Zonguldak-Bartın", "Rezervi az"], choices: ["Taş kömürü", "Linyit", "Asfaltit", "Jeotermal"] },
        { answer: "Otomotiv", clues: ["Sanayinin lokomotifi", "En büyük kol", "İhracatta sanayi"], choices: ["Otomotiv", "Çay", "Şeker", "Seramik"] },
        { answer: "Batman Rafinerisi", clues: ["Petro-kimya", "Hammaddeye bağlı", "Petrol"], choices: ["Batman Rafinerisi", "Tuzla tersanesi", "Aksu kâğıt", "Hereke halı"] },
        { answer: "Habur–Kapıkule", clues: ["En uzun transit", "Irak–Avrupa", "Şırnak–Edirne"], choices: ["Habur–Kapıkule", "Gürbulak–Trabzon", "Sarp–Samsun", "Cilvegözü–Mersin"] },
        { answer: "Gürbulak–Trabzon", clues: ["İran", "Karadeniz", "En kısa lojistik"], choices: ["Gürbulak–Trabzon", "Habur–Kapıkule", "Kapıkule–Sarp", "Habur–İzmir"] },
        { answer: "İzmir–Aydın", clues: ["İlk demir yolu", "Osmanlı dönemi", "Ege"], choices: ["İzmir–Aydın", "Ankara–Yerköy", "Ankara–Eskişehir", "Sivas–Erzurum"] },
        { answer: "Ankara–Eskişehir", clues: ["İlk YHT", "Yüksek hızlı tren", "Başkent ile Odunpazarı hattı"], choices: ["Ankara–Eskişehir", "Ankara–Erzurum", "İzmir–Aydın", "Konya–Karaman"] },
        { answer: "Ro-Ro", clues: ["TIR gemiye biner", "Tekerlekli araç", "Deniz"], choices: ["Ro-Ro", "Boru hattı", "YHT", "Kontrplak"] },
        { answer: "Hinterland", clues: ["Ard bölge", "Liman gelişmesi", "Etki alanı"], choices: ["Hinterland", "Rıhtım", "Falez", "Delta"] }
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
        { q: "Yürürlükteki Anayasa hangi yılda kabul edildi?", a: "1982", choices: ["1982", "1961", "1924", "1921"] },
        { q: "Teşkilat-ı Esasiye Kanunu hangi yılda kabul edildi?", a: "1921", choices: ["1921", "1924", "1961", "1982"] },
        { q: "Cumhuriyet'in ikinci anayasası hangi yılda kabul edildi?", a: "1924", choices: ["1924", "1921", "1961", "1982"] },
        { q: "27 Mayıs darbesinden sonra kabul edilen anayasa hangi yılda?", a: "1961", choices: ["1961", "1982", "1924", "1921"] },
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
        { q: "Milletvekili dokunulmazlığı hangi organda görüşülür?", a: "TBMM", choices: ["TBMM", "AYM", "Yargıtay", "Cumhurbaşkanı"] },
        { q: "Türkiye'de maden çeşidi / miktar ilişkisi?", a: "çeşit fazla, miktar az", choices: ["çeşit fazla, miktar az", "çeşit az, miktar fazla", "ikisi de dünya lideri", "yalnızca kıyılarda"] },
        { q: "Maden çeşitliliği en fazla hangi saha?", a: "Yukarı Fırat", choices: ["Yukarı Fırat", "Yukarı Sakarya", "Ergene", "Çukurova"] },
        { q: "Dünya bor rezervinin yaklaşık payı (TR)?", a: "%72", choices: ["%72", "%25", "%40", "%12"] },
        { q: "Demir çıkarımı: Divriği hangi il?", a: "Sivas", choices: ["Sivas", "Kastamonu", "Mardin", "Antalya"] },
        { q: "Bakır en çok hangi bölgede çıkarılır?", a: "Karadeniz", choices: ["Karadeniz", "Ege", "Akdeniz", "İç Anadolu"] },
        { q: "Boksit nerede işlenir?", a: "Seydişehir", choices: ["Seydişehir", "Samsun", "Karabük", "Bandırma"] },
        { q: "Fosfat hem çıkarılıp hem işlendiği yer?", a: "Mazıdağı", choices: ["Mazıdağı", "Kırka", "Küre", "Keçiborlu"] },
        { q: "Lüle taşı ili?", a: "Eskişehir", choices: ["Eskişehir", "Erzurum", "Bursa", "Mardin"] },
        { q: "Oltu taşı ili?", a: "Erzurum", choices: ["Erzurum", "Eskişehir", "Yozgat", "Isparta"] },
        { q: "Karabük–Ereğli demir-çelik nedeni?", a: "taşkömürüne yakınlık", choices: ["taşkömürüne yakınlık", "turizm", "pamuk tarımı", "buzul"] },
        { q: "Ankara keçisinin ürünü?", a: "tiftik", choices: ["tiftik", "ipek", "pamuk", "keten"] },
        { q: "Doğu Karadeniz'in simge tarımı?", a: "çay", choices: ["çay", "pamuk", "zeytin", "muz"] },
        { q: "Zeytin üretiminde en fazla öne çıkan iller?", a: "Manisa ve İzmir", choices: ["Manisa ve İzmir", "Rize ve Artvin", "Kars ve Ağrı", "Van ve Muş"] },
        { q: "Pamuk üretiminde birinci il?", a: "Şanlıurfa", choices: ["Şanlıurfa", "Rize", "Kars", "Zonguldak"] },
        { q: "Antep fıstığı en çok nerede yetişir?", a: "Şanlıurfa", choices: ["Şanlıurfa", "Rize", "Konya", "Trabzon"] },
        { q: "Kıl keçisinde il birincisi?", a: "Mersin", choices: ["Mersin", "Ankara", "Van", "Samsun"] },
        { q: "Tiftik keçisinde il birincisi?", a: "Ankara", choices: ["Ankara", "Mersin", "Van", "Ordu"] },
        { q: "Koyun sayısında birinci il?", a: "Van", choices: ["Van", "Rize", "Yalova", "Mersin"] },
        { q: "Kümes hayvancılığı en çok hangi illerde?", a: "Manisa ve Balıkesir", choices: ["Manisa ve Balıkesir", "Rize ve Artvin", "Hakkâri ve Şırnak", "Sinop ve Bartın"] },
        { q: "Bakır çıkarımı notlara göre nerede yoğun?", a: "Karadeniz (Küre, Murgul, Çayeli)", choices: ["Karadeniz (Küre, Murgul, Çayeli)", "Tuz Gölü", "Ergene", "Taşeli"] },
        { q: "Krom çıkarım yerleri?", a: "Guleman ve Köyceğiz", choices: ["Guleman ve Köyceğiz", "Divriği ve Hekimhan", "Mazıdağı", "Keçiborlu"] },
        { q: "Taş kömürü rezervi nerededir?", a: "Batı Karadeniz", choices: ["Batı Karadeniz", "Ege", "Güneydoğu", "Marmara"] },
        { q: "En büyük linyit santrali?", a: "Afşin-Elbistan", choices: ["Afşin-Elbistan", "Soma", "Yatağan", "Alaçatı"] },
        { q: "Petrol ihtiyacının yaklaşık ithalat payı?", a: "%90", choices: ["%90", "%10", "%50", "%0"] },
        { q: "İlk petrol nerede bulundu?", a: "Batman", choices: ["Batman", "İzmit", "Zonguldak", "Konya"] },
        { q: "Doğal gaz ithalat payı yaklaşık?", a: "%99,98", choices: ["%99,98", "%50", "%10", "%0"] },
        { q: "İlk doğal gaz sahası?", a: "Tuna-1", choices: ["Tuna-1", "Germencik", "Silopi", "Karapınar"] },
        { q: "Mavi Akım karaya nerede çıkar?", a: "Samsun", choices: ["Samsun", "İzmir", "Mersin", "Hatay"] },
        { q: "Asfaltit nerede bulunur?", a: "Silopi", choices: ["Silopi", "Kozlu", "Alaçatı", "Karapınar"] },
        { q: "HES potansiyeli en fazla bölge?", a: "Doğu Anadolu", choices: ["Doğu Anadolu", "Güneydoğu", "Marmara", "Ege"] },
        { q: "HES üretimi en fazla bölge?", a: "Güneydoğu Anadolu", choices: ["Güneydoğu Anadolu", "Doğu Anadolu", "Marmara", "Ege"] },
        { q: "İlk rüzgâr santrali?", a: "Çeşme-Alaçatı", choices: ["Çeşme-Alaçatı", "Karapınar", "Akkuyu", "Germencik"] },
        { q: "En büyük GES?", a: "Karapınar", choices: ["Karapınar", "Birecik", "Mersin", "Aydın"] },
        { q: "İlk NGS?", a: "Akkuyu", choices: ["Akkuyu", "Sinop", "İğneada", "Ovaakça"] },
        { q: "Elektrik üretiminde 1. kaynak?", a: "kömür", choices: ["kömür", "hidrolik", "doğal gaz", "güneş"] },
        { q: "En gelişmiş sanayi bölgesi?", a: "Marmara", choices: ["Marmara", "Doğu Anadolu", "Doğu Karadeniz", "Güneydoğu"] },
        { q: "Sanayinin lokomotifi sektör?", a: "otomotiv", choices: ["otomotiv", "çay", "şeker", "tuğla"] },
        { q: "İhracatta sanayi payı yaklaşık?", a: "%94", choices: ["%94", "%4", "%2", "%50"] },
        { q: "İhracatta 1. ülke?", a: "Almanya", choices: ["Almanya", "Çin", "Rusya", "İtalya"] },
        { q: "İthalatta 1. ülke?", a: "Çin", choices: ["Çin", "Almanya", "İngiltere", "İtalya"] },
        { q: "Hammaddeye bağlı petro-kimya?", a: "Batman", choices: ["Batman", "Rize", "Kayseri", "Uşak"] },
        { q: "Şeker fabrikası neden tarıma yakın?", a: "pancar çabuk bozulur", choices: ["pancar çabuk bozulur", "liman zorunlu", "yalnızca kıyı", "çay hammaddesi"] },
        { q: "İran'ın Karadeniz transit hattı?", a: "Gürbulak–Trabzon", choices: ["Gürbulak–Trabzon", "Habur–Kapıkule", "Sarp–İzmir", "Cilvegözü–Samsun"] },
        { q: "En uzun transit koridor?", a: "Habur–Kapıkule", choices: ["Habur–Kapıkule", "Gürbulak–Trabzon", "Sarp–Trabzon", "Kapıkule–Mersin"] },
        { q: "İlk demir yolu hattı?", a: "İzmir–Aydın", choices: ["İzmir–Aydın", "Ankara–Yerköy", "Ankara–Eskişehir", "Sivas–Kars"] },
        { q: "Cumhuriyet'in ilk demir yolu?", a: "Ankara–Yerköy", choices: ["Ankara–Yerköy", "İzmir–Aydın", "Ankara–Eskişehir", "Haydarpaşa"] },
        { q: "İlk YHT hattı ve yılı?", a: "Ankara–Eskişehir / 2009", choices: ["Ankara–Eskişehir / 2009", "Ankara–Konya / 2003", "İstanbul–Sivas / 1999", "Konya–Karaman / 2011"] },
        { q: "İç ticarette en çok kullanılan?", a: "kara yolu", choices: ["kara yolu", "deniz yolu", "hava yolu", "boru hattı"] },
        { q: "Dış ticarette en çok kullanılan?", a: "deniz yolu", choices: ["deniz yolu", "kara yolu", "hava yolu", "demir yolu"] },
        { q: "En pahalı ulaşım türü?", a: "hava yolu", choices: ["hava yolu", "deniz yolu", "demir yolu", "kara yolu"] },
        { q: "En büyük kargo havalimanı?", a: "Şanlıurfa GAP", choices: ["Şanlıurfa GAP", "Sinop", "Hopa", "Cide"] },
        { q: "Tekerlekli aracın gemiyle taşınması?", a: "Ro-Ro", choices: ["Ro-Ro", "YHT", "boru hattı", "fayton"] }
    ];

    var KODLAMA = [
        { cat: "Jeoloji", slogan: "Pire + Kambriyen. Pirelerin olduğu ilkel zaman.", a: "Prekambriyen", choices: ["Prekambriyen", "Senozoyik", "Tersiyer", "Kuvaterner"], note: "İlkel zaman; yaşlı / masif arazinin belirdiği dönem." },
        { cat: "Jeoloji", slogan: "PANGEA–TAMGEA. Eski masalar yaşlı, sert ve daha düzdür.", a: "Masif (Pangea)", choices: ["Masif (Pangea)", "Horst", "Graben", "Obruk"], note: "Yaşlı, sert, aşınmış düzlükler." },
        { cat: "Jeoloji", slogan: "Meeesozoyik = meteorların düştüğü zaman.", a: "Mesozoyik", choices: ["Mesozoyik", "Prekambriyen", "Kuvaterner", "Holosen"], note: "2. jeolojik zaman; dinozorların yok oluşu." },
        { cat: "Jeoloji", slogan: "İlk dinozor tetris oynuyor; bu dönemde Tethys denizi var.", a: "Tetis (Tethys)", choices: ["Tetis (Tethys)", "Hazar", "Van Gölü", "Marmara"], note: "2. zamanda Tetis Denizi." },
        { cat: "Jeoloji", slogan: "SENİN ortaya çıktığın zaman. SEN = 3 harf = 3. zaman.", a: "Senozoyik", choices: ["Senozoyik", "Paleozoik", "Prekambriyen", "Arkeen"], note: "3. zaman: Tersiyer + Kuvaterner." },
        { cat: "Jeoloji", slogan: "TTTTersiyer = TTTTürkiye'nin yüzeye çıktığı zaman.", a: "Tersiyer", choices: ["Tersiyer", "Kuvaterner", "Kambriyen", "Jura"], note: "Türkiye karalarının yükselmesi; linyit, bor, tuz, petrol." },
        { cat: "Jeoloji", slogan: "Guatrlı erler. Guatr boğazda olur.", a: "Kuvaterner", choices: ["Kuvaterner", "Tersiyer", "Kretase", "Permiyen"], note: "İnsan ortaya çıkar; İstanbul ve Çanakkale boğazları." },
        { cat: "Jeoloji", slogan: "Yükselmek için KONmak lazım.", a: "Konveksiyonel yağış", choices: ["Konveksiyonel yağış", "Yamaç yağışı", "Cephe yağışı", "Orografik sis"], note: "Isınan havanın yükselmesiyle konveksiyonel yağış." },
        { cat: "Jeoloji", slogan: "ORRRRojenez ORRRRDAĞĞĞ — bir dağ var uzakta.", a: "Orojenez", choices: ["Orojenez", "Epirojenez", "Heyelan", "Delta"], note: "Dağ oluşumu." },
        { cat: "Jeoloji", slogan: "ANtiklinal: AN nemiz üsttedir. SENklinal: SEN alttasın.", a: "Antiklinal / senklinal", choices: ["Antiklinal / senklinal", "Horst / graben", "Sarkıt / dikit", "Transgresyon / regresyon"], note: "Kıvrımda antiklinal yukarı, senklinal aşağı." },
        { cat: "Jeoloji", slogan: "Horst yüksekte. Graben = gariban = alçakta.", a: "Horst / graben", choices: ["Horst / graben", "Antiklinal / senklinal", "Falez / tombolo", "Barkan / löss"], note: "Kırık sisteminde horst yüksek blok, graben çukur." },
        { cat: "Jeoloji", slogan: "Seke seke basamak inmek.", a: "Seki (taraça)", choices: ["Seki (taraça)", "Delta", "Falez", "Menderes"], note: "Akarsu basamakları / taraçalar." },
        { cat: "Jeoloji", slogan: "Transit: deniz ileri gider. Geri vites: deniz geri gider.", a: "Transgresyon / regresyon", choices: ["Transgresyon / regresyon", "Orojenez / epirojenez", "Aşınım / birikim", "Horst / graben"], note: "Denizin karaya ilerlemesi transgresyon, çekilmesi regresyon." },
        { cat: "Volkan", slogan: "Volkan bacalarından TÜF TÜF TÜF küller çıkar.", a: "Tüf", choices: ["Tüf", "Granit", "Kalker", "Jips"], note: "Volkanik külün çökelmesiyle tüf." },
        { cat: "Volkan", slogan: "Balık krakerler KRATER'den çıkar.", a: "Krater", choices: ["Krater", "Kaldera", "Obruk", "Maar"], note: "Volkan ağzı." },
        { cat: "Volkan", slogan: "KALDERyA gitme, sana balık kraker vereyim.", a: "Kaldera", choices: ["Kaldera", "Krater", "Horst", "Barkan"], note: "Kraterin çökmesiyle oluşan büyük çanak." },
        { cat: "Deprem", slogan: "TEKTON bırakırsan yere sallanır.", a: "Tektonik deprem", choices: ["Tektonik deprem", "Volkanik deprem", "Çökme depremi", "Heyelan"], note: "Levha / fay hareketiyle tektonik deprem." },
        { cat: "Akarsu", slogan: "mendereSSSSS — düz arazide SSS şeklinde kıvrılan akarsu.", a: "Menderes", choices: ["Menderes", "Çağlayan", "Kanyon", "Delta"], note: "Eğimin azaldığı yerde kıvrılan yatak." },
        { cat: "Rüzgar", slogan: "BARKANNN TARKANN — Tarkan'ın hilal bıyıkları.", a: "Barkan", choices: ["Barkan", "Löss", "Morena", "Tombolo"], note: "Hilal biçimli kumul." },
        { cat: "Rüzgar", slogan: "GÖSSSlük takmazsan gözüne TÖSSSS kaçar.", a: "Löss", choices: ["Löss", "Tüf", "Laterit", "Halomorfik"], note: "Rüzgarın taşıdığı ince verimli toprak." },
        { cat: "Rüzgar", slogan: "TAFFFFoni — TAF TAF TAF diye ateş edince delikli kayalar.", a: "Tafoni", choices: ["Tafoni", "Falez", "Obruk", "Yardang"], note: "Rüzgar aşındırmasıyla petek / delikli kaya." },
        { cat: "Rüzgar", slogan: "Rüzgar aşındırmasıyla YARRRılmış DAĞĞĞlar.", a: "Yardang", choices: ["Yardang", "Barkan", "Morena", "Seki"], note: "Rüzgarın uzattığı aşınım sırtları." },
        { cat: "Rüzgar", slogan: "Kumlara basarsan HAM! diye yakar.", a: "Hamada", choices: ["Hamada", "Barkan", "Löss", "Delta"], note: "Taşlı çöl yüzeyi." },
        { cat: "Buzul", slogan: "MORARAN YERE KOYARIZ.", a: "Morena", choices: ["Morena", "Löss", "Tüf", "Alüvyon"], note: "Buzul birikintisi." },
        { cat: "Karst", slogan: "KALKERRRR — uyanan erin yüzü kireç.", a: "Kalker", choices: ["Kalker", "Granit", "Bazalt", "Tüf"], note: "Kireçtaşı; karstın ana kayası." },
        { cat: "Karst", slogan: "Arkadaşına cips vermezsen başına bu alçılar gelir.", a: "Jips (alçıtaşı)", choices: ["Jips (alçıtaşı)", "Kalker", "Kuvarsit", "Andezit"], note: "Alçıtaşı; karstik çözünme." },
        { cat: "Karst", slogan: "Tavandan sarkan, tabandan dikilen; birleşince sütun.", a: "Sarkıt / dikit / sütun", choices: ["Sarkıt / dikit / sütun", "Horst / graben", "Falez / tombolo", "Delta / haliç"], note: "Mağara damlataşları." },
        { cat: "Karst", slogan: "OOOOOBRUK — Cennet obruğu.", a: "Obruk", choices: ["Obruk", "Krater", "Kaldera", "Graben"], note: "Karstik çökme çukuru." },
        { cat: "Kıyı", slogan: "FALEZ — falları uçurumdan aşağı at.", a: "Falez", choices: ["Falez", "Tombolo", "Lagün", "Delta"], note: "Dalga aşındırmasıyla kıyı uçurumu." },
        { cat: "Kıyı", slogan: "Kara ile ada kumullarla birleşince TOMBALA.", a: "Tombolo", choices: ["Tombolo", "Falez", "Haliç", "Atol"], note: "Kumul köprüyle adanın karaya bağlanması." },
        { cat: "Kıyı", slogan: "Dalmaçya köpeğinin benekleri gibi adacıklar.", a: "Dalmaçya kıyısı", choices: ["Dalmaçya kıyısı", "Ria kıyısı", "Fiyort kıyısı", "Lagün kıyısı"], note: "Dağlara paralel, adacıklı kıyı tipi." },
        { cat: "Dağlar", slogan: "ERCİYESLİ KARA HASAN MEEEEELEDİ.", a: "Erciyes, Karadağ, Hasan, Melendiz", choices: ["Erciyes, Karadağ, Hasan, Melendiz", "Nemrut, Süphan, Tendürek, Ağrı", "Kaz, Madra, Yunt, Bozdağ", "Kaçkar, Canik, Ilgaz, Küre"], note: "İç Anadolu volkanları." },
        { cat: "Dağlar", slogan: "NEM'li olur: Nemrut, Süphan, Tendürek, Ağrı.", a: "Van çevresi volkanları", choices: ["Van çevresi volkanları", "İç Anadolu volkanları", "Ege horstları", "Karadeniz kıvrımları"], note: "Doğu Anadolu volkan zinciri." },
        { cat: "Dağlar", slogan: "KAZ KAZ KAZ MADRA YUNT BOZ AYDIN. Aman hocam sus.", a: "Ege dağları (horstlar)", choices: ["Ege dağları (horstlar)", "Toroslar", "Yıldız Dağları", "Cilo-Sat"], note: "Kaz, Madra, Yunt, Bozdağ, Aydın, Menteşe; Amanos ayrı hat." },
        { cat: "Plato", slogan: "Pilotlar önce yükselir, sonra düz gider.", a: "Plato", choices: ["Plato", "Ova", "Delta", "Graben"], note: "Yüksek düzlük." },
        { cat: "Plato", slogan: "Obur (Obruk) Cihan (Cihanbeyli) manavda (Haymana) midesini bozmuş (Bozok).", a: "İç Anadolu platoları", choices: ["İç Anadolu platoları", "Güneydoğu platoları", "Teke-Taşeli", "Erzurum-Kars"], note: "Obruk, Cihanbeyli, Haymana, Bozok." },
        { cat: "Ova", slogan: "Nicki Merzifon olan taş taşıyan eşek Suluova'da su içerken tokatlandı.", a: "Taşova, Merzifon, Suluova, Tokat", choices: ["Taşova, Merzifon, Suluova, Tokat", "Bafra, Çarşamba, Çukurova", "Harran, Amik, Ergene", "Menderes, Gediz, Bakırçay"], note: "Orta Karadeniz iç ovaları." },
        { cat: "Ova", slogan: "Asi, Seyhan ve Ceyhan adlı iki kız…", a: "Çukurova", choices: ["Çukurova", "Harran", "Ergene", "Bafra"], note: "Seyhan–Ceyhan (Asi Hatay hattı) Çukurova." },
        { cat: "Akarsu", slogan: "Kara (Karasu) Murat zıplayan (Zap) Dicle'ye taş fırlattı (Fırat).", a: "Fırat–Dicle kolları", choices: ["Fırat–Dicle kolları", "Kızılırmak–Yeşilırmak", "Gediz–Menderes", "Çoruh–Aras"], note: "Karasu, Murat → Fırat; Zap → Dicle." },
        { cat: "Göl", slogan: "Aş (Timraş) yapmak isteyen karslı kız (Kızören) Salda'da avlanırken (Avlan) elma (Elmalı) yerine elini kesti (Kestel).", a: "Karstik göller", choices: ["Karstik göller", "Tektonik göller", "Volkanik göller", "Baraj gölleri"], note: "Timraş, Kızören, Salda, Avlan, Elmalı, Kestel." },
        { cat: "Göl", slogan: "Bey (Beyşehir) eğri (Eğirdir) bir kova (Kovada) ile suluyor (Suğla).", a: "Karstik-tektonik göller", choices: ["Karstik-tektonik göller", "Heyelan-set gölleri", "Lav-set gölleri", "Lagünler"], note: "Beyşehir, Eğirdir, Kovada, Suğla." },
        { cat: "Göl", slogan: "Bora bey (Borabay) hortumla (Tortum) sarayı (Sera) 7 defa (Yedigöller) sulayınca Abant / sülük.", a: "Heyelan-set gölleri", choices: ["Heyelan-set gölleri", "Karstik göller", "Krater gölleri", "Tektonik göller"], note: "Borabay, Tortum, Sera, Yedigöller, Sülüklü, Abant." },
        { cat: "Göl", slogan: "Haçlı nazik balık lavları görünce gerçekten (Erçek) çıldırmış (Çıldır).", a: "Lav-set gölleri", choices: ["Lav-set gölleri", "Heyelan-set gölleri", "Lagünler", "Obruk gölleri"], note: "Haçlı, Nazik, Balık, Erçek, Çıldır." },
        { cat: "Göl", slogan: "Yumurta (Yumurtalık) gibi ter kokan (Terkos) Dursun (Durusu) Büyükçekmece'den deodorant aldı.", a: "Kıyı-set (lagün) gölleri", choices: ["Kıyı-set (lagün) gölleri", "Karstik göller", "Volkanik göller", "Buzul gölleri"], note: "Yumurtalık, Terkos/Durusu, Büyükçekmece, Küçükçekmece." },
        { cat: "Kıyı", slogan: "Sarı (Saros) Erdem'in (Edremit) şanı (Çandarlı) üzerindeki kuşu (Kuşadası)… Güllük, Gökova.", a: "Ege körfezleri", choices: ["Ege körfezleri", "Akdeniz körfezleri", "Marmara körfezleri", "Karadeniz limanları"], note: "Saros, Edremit, Çandarlı, Kuşadası, Güllük, Gökova." },
        { cat: "Toprak", slogan: "Terleyen Rossa Akdeniz'de.", a: "Terra rossa", choices: ["Terra rossa", "Laterit", "Podzol", "Çernozyom"], note: "Akdeniz'in kırmızı kireçli toprağı." },
        { cat: "Toprak", slogan: "Taş veren / taş doğuran toprak.", a: "Vertisol", choices: ["Vertisol", "Halomorfik", "Löss", "Tundra"], note: "Şişen-çekilen killi toprak." },
        { cat: "Toprak", slogan: "Halılar en iyi tuzla yıkanır.", a: "Halomorfik toprak", choices: ["Halomorfik toprak", "Terra rossa", "Podzol", "Alüvyal"], note: "Tuzlu toprak." },
        { cat: "Bitki", slogan: "Defne ve Funda kocaman (kocayemiş) sandalda sakız çiğneyip zeytin yiyerek Mersin'e keçiboynuzu / zakkum.", a: "Maki", choices: ["Maki", "Tayga", "Step", "Mangrov"], note: "Akdeniz maki elemanları." },
        { cat: "Maden", slogan: "Ergani'den kalkan deli Bekir (bakır) Küre'nin içine Çayeli ve maden suyu döküp mor gül (Murgul).", a: "Bakır yatakları", choices: ["Bakır yatakları", "Bor yatakları", "Krom yatakları", "Linyit sahaları"], note: "Ergani, Küre, Çayeli, Murgul." },
        { cat: "Maden", slogan: "Bol (bor) hırka (Kırka) giyen gazi (Seyitgazi) et (Emet) keserken (Kestelek) Mustafa Kemal Paşa su biraz iç (Bigadiç).", a: "Bor yatakları", choices: ["Bor yatakları", "Bakır yatakları", "Demir yatakları", "Kömür havzası"], note: "Kırka, Seyitgazi, Emet, Kestelek, Bigadiç." },
        { cat: "Hayvancılık", slogan: "Manda yuva yapmış Samsun şehrine, Diyarbakır kopmuş gelmiş peşine, İstanbul durur mu…", a: "Manda yetiştiriciliği", choices: ["Manda yetiştiriciliği", "Tiftik keçisi", "İpek böceği", "Kümes"], note: "Samsun, Diyarbakır, İstanbul hattı." },
        { cat: "Dağlar", slogan: "Giresun'dan KAÇtı, YILDIZ ayağa DİK bakmış; KÜRE'de gaz, CANİ yandı; MESCİT'te YALNIZ ALLAHUEKBER.", a: "Kuzey Anadolu dağları", choices: ["Kuzey Anadolu dağları", "Toroslar", "İç Batı Anadolu eşiği", "Amanoslar"], note: "Giresun, Kaçkar, Yıldız, Dikmen, Küre, Canik, Mescit, Yalnızçam, Allahuekber." }
    ];

    global.GamesBank = {
        REGION_FACTS: REGION_FACTS,
        SPECIAL: SPECIAL,
        TABU: TABU,
        PANIC: PANIC,
        KODLAMA: KODLAMA,
        TABU_SCORE: [5, 5, 3, 1]
    };
})(typeof globalThis !== "undefined" ? globalThis : this);
export var GamesBank = globalThis.GamesBank;
