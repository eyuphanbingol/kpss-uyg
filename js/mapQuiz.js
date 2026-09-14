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
        "Abant Gölü": [31.28, 40.6],
        "Acıpayam Ovası": [29.35, 37.42],
        "Adıyaman Platosu": [38.28, 37.76],
        "Afşin-Elbistan (linyit)": [37, 38.25],
        "Ağrı Dağı": [44.3, 39.7],
        "Akkuyu NGS": [33.54, 36.14],
        "Akşehir Gölü": [31.4, 38.48],
        "Akyaka (Ermenistan, kapalı)": [43.4, 40.75],
        "Alaçatı RES": [26.38, 38.28],
        "Aladağlar (Demirkazık)": [35.2, 37.8],
        "Altın: Cerattepe": [41.7, 41.2],
        "Altın: Ovacık": [26.7, 39.3],
        "Altınkaya HES": [35.85, 41.35],
        "Alüminyum: Seydişehir": [31.85, 37.42],
        "Alüvyal (Bafra)": [35.9, 41.5],
        "Alüvyal (delta)": [35.9, 41.5],
        "Amik Ovası": [36.35, 36.35],
        "Anamur-Alanya masifi": [32.6, 36.4],
        "Anamur–Gazipaşa (muz)": [32.5, 36.15],
        "Antalya (demiryolu yok)": [30.71, 36.9],
        "Antep fıstığı": [38.79, 37.17],
        "Aras": [44.1, 39.95],
        "Ardahan Platosu": [42.7, 41.11],
        "Arıcılık": [37.88, 40.98],
        "Asbest: Eskişehir": [30.52, 39.78],
        "Asfaltit: Silopi": [42.47, 37.25],
        "Asi": [36.2, 36.25],
        "Atatürk HES": [38.32, 37.58],
        "Ayçiçeği": [27.51, 40.98],
        "Ayçiçek yağı": [27, 41.2],
        "Aydın Dağları": [27.95, 37.95],
        "BAF (Batı Anadolu / Ege grabenleri)": [27.8, 38.2],
        "Bafa Gölü": [27.45, 37.5],
        "Bafra Deltası": [35.9, 41.57],
        "Bafra Ovası": [35.9, 41.5],
        "Bakır işleme: Samsun": [36.33, 41.29],
        "Bakır: Çayeli": [40.73, 41.09],
        "Bakır: Küre": [33.72, 41.8],
        "Bakır: Murgul": [41.55, 41.27],
        "Bakırçay": [27.05, 39.05],
        "Bakırçay Ovası": [27.1, 39.05],
        "Barit: Alanya": [32, 36.54],
        "Batı Toroslar karstı": [30.5, 36.9],
        "Belen Geçidi": [36.22, 36.48],
        "Beydağları": [30.12, 36.7],
        "Beyşehir Gölü": [31.5, 37.7],
        "Biga–Gelibolu": [26.7, 40.2],
        "Binboğa Dağları": [36.7, 38.15],
        "Birecik HES": [37.98, 37.03],
        "Bitlis Masifi": [42.11, 38.4],
        "Boksit işleme: Seydişehir": [31.85, 37.42],
        "Boksit: Akseki": [31.79, 37.05],
        "Bolkar Dağları": [34.35, 37.4],
        "Bolu Dağı Geçidi": [31.45, 40.7],
        "Bolu Ovası": [31.61, 40.73],
        "Bor: Balıkesir–Eskişehir–Kütahya–Bursa": [29.5, 39.5],
        "Boyuna kıyı (Akdeniz)": [30.71, 36.8],
        "Boyuna kıyı (Karadeniz)": [40.5, 41.05],
        "Bozdağlar": [28.05, 38.32],
        "Bozok Platosu": [35.2, 39.7],
        "BTC (Bakü–Tiflis–Ceyhan)": [35.8, 36.85],
        "BTE (Bakü–Tiflis–Erzurum)": [41.27, 39.91],
        "Buğday": [32.49, 37.87],
        "Burdur Gölü": [30.2, 37.73],
        "Bursa Ovası": [29.06, 40.19],
        "Büyük Menderes": [27.3, 37.55],
        "Büyük Menderes Ovası": [27.85, 37.8],
        "Büyükçekmece": [28.55, 41.02],
        "Canbaz (BTK / Gürcistan)": [42.85, 41.2],
        "Canik Dağları": [36.8, 40.85],
        "Cankurtaran Geçidi": [41.45, 41.25],
        "Ceyhan": [35.82, 36.85],
        "Ceylanpınar Ovası": [40.05, 36.85],
        "Cıva: Karaburun": [26.53, 38.64],
        "Cide Limanı (dar hinterland)": [33, 41.89],
        "Cihanbeyli Platosu": [32.8, 38.65],
        "Cilo / Buzul Dağları": [44, 37.5],
        "Çaldıran Ovası": [43.99, 39.14],
        "Çanakkale (demiryolu yok)": [26.41, 40.16],
        "Çarşamba Deltası": [36.72, 41.2],
        "Çarşamba Ovası": [36.72, 41.15],
        "Çatalca Ovası": [28.46, 41.14],
        "Çatalca-Kocaeli Platosu": [29.2, 41],
        "Çatalca–Kocaeli": [29.4, 40.9],
        "Çay": [40.6, 41],
        "Çay fabrikası": [40.52, 41.02],
        "Çeltik": [26.56, 41.68],
        "Çernozyum": [42.2, 40.4],
        "Çıldır Gölü": [43.23, 41.05],
        "Çoruh": [41.5, 41.45],
        "Çoruh Vadisi (zeytin)": [41.7, 41.1],
        "Çubuk Geçidi": [30.55, 37.15],
        "Çukurova": [35.4, 36.85],
        "Çukurova Deltası": [35.4, 36.78],
        "DAF (Doğu Anadolu Fayı)": [38.5, 38.2],
        "Dalmaçya kıyı (Kaş–Finike)": [29.6, 36.3],
        "Datça hurması": [27.69, 36.73],
        "Demir-çelik: Ereğli": [31.45, 41.28],
        "Demir-çelik: İskenderun": [36.17, 36.59],
        "Demir-çelik: Karabük": [32.63, 41.2],
        "Demir: Divriği": [38.11, 39.37],
        "Demir: Hekimhan": [37.98, 38.82],
        "Deriner HES": [41.7, 41.2],
        "Develi Ovası": [35.49, 38.39],
        "Dicle": [40.55, 37.9],
        "Dikili Deltası": [26.9, 39.08],
        "Doğu Karadeniz kıyısı": [40.2, 41.05],
        "Doğu Karadeniz ormanı": [40.8, 40.9],
        "Dörtyol Ovası": [36.15, 36.84],
        "Düzce Ovası": [31.16, 40.84],
        "Eber Gölü": [31.15, 38.65],
        "Ecevit Geçidi": [33.78, 41.7],
        "Eğirdir Gölü": [30.85, 37.85],
        "Elma": [30.55, 37.76],
        "Elmalı Ovası": [29.92, 36.74],
        "En az yağış: GD'nin güneyi": [39.5, 36.9],
        "En az yağış: Iğdır Havzası": [44.04, 39.92],
        "En az yağış: Tuz Gölü çevresi": [33.4, 38.75],
        "En çok yağış: Hakkâri": [43.74, 37.57],
        "En çok yağış: Menteşe": [28.2, 37.15],
        "En çok yağış: Rize–Hopa": [41.2, 41.25],
        "En çok yağış: Yıldız Dağları": [27.5, 41.75],
        "Endemik yoğunluğu (Teke–Taşeli)": [31.5, 36.6],
        "Enine kıyı (Ege)": [27.2, 38.2],
        "Erbaa Ovası": [36.57, 40.67],
        "Erciyes Dağı": [35.45, 38.53],
        "Erçek Gölü": [43.55, 38.67],
        "Ergene Havzası": [26.9, 41.2],
        "Ergene Ovası": [26.9, 41.15],
        "Erzincan Ovası": [39.49, 39.75],
        "Erzurum-Kars çayırı": [42.2, 40.4],
        "Erzurum-Kars Platosu": [41.8, 40.4],
        "Fındık": [37.88, 40.98],
        "Fırat": [38.25, 37],
        "Fosfat: Mazıdağı": [40.48, 37.48],
        "GAP kargo havalimanı": [38.9, 37.1],
        "Gaziantep Platosu": [37.38, 37.2],
        "Gaziantep ve çevresi": [37.38, 37.07],
        "Gediz": [27.1, 38.6],
        "Gediz Ovası": [27.55, 38.7],
        "Gemi: Tuzla / Pendik": [29.3, 40.82],
        "Germencik JES": [27.6, 37.87],
        "GES: Karapınar": [33.55, 37.72],
        "Geyik Dağları": [32.2, 36.85],
        "Geyve Boğazı": [30.29, 40.51],
        "Giresun (demiryolu yok)": [38.39, 40.91],
        "Giresun Dağları": [38.4, 40.55],
        "Göksu": [33.93, 36.38],
        "Gölcük (Isparta)": [30.48, 37.72],
        "Göller Yöresi": [30.55, 37.76],
        "Göllüdağ": [34.55, 38.26],
        "Gül": [30.55, 37.76],
        "Gülek Boğazı": [34.8, 37.28],
        "Gürbulak Sınır Kapısı": [44.3, 39.42],
        "Gürlek Geçidi": [36.8, 37.7],
        "Habur Sınır Kapısı": [42.45, 37.25],
        "Hakkâri (demiryolu yok)": [43.74, 37.57],
        "Hakkâri Bölümü": [43.74, 37.57],
        "Halı-kilim: Hereke": [29.62, 40.78],
        "Halomorfik (tuzlu)": [34.03, 38.37],
        "Harran Ovası": [39.05, 36.86],
        "Hasan Dağı": [34.17, 38.13],
        "Hasan Uğurlu HES": [36.4, 41.05],
        "Haşhaş": [30.53, 38.76],
        "Haymana Platosu": [32.5, 39.43],
        "Hazar Gölü": [39.42, 38.48],
        "Hopa Limanı (dar hinterland)": [41.4, 41.39],
        "Iğdır Havzası": [44.04, 39.92],
        "Iğdır mikroklima (pamuk)": [44.04, 39.92],
        "Ilgaz Dağları": [33.65, 41.05],
        "Ilgaz Geçidi": [33.65, 41],
        "Ilısu HES": [41.85, 37.53],
        "Istranca / Yıldız masifi": [27.5, 41.75],
        "İç Anadolu bozkırı": [32.8, 38.8],
        "İlaç": [28.98, 41.01],
        "İlk YHT: Ankara–Eskişehir": [31.7, 39.85],
        "İncir": [27.84, 37.84],
        "İpek böcekçiliği": [40.23, 37.91],
        "İskenderun Limanı": [36.17, 36.59],
        "İstanbul Limanı (geniş hinterland)": [28.98, 41.01],
        "İzmir Limanı (geniş hinterland)": [27.14, 38.42],
        "İznik Gölü": [29.52, 40.43],
        "Jeotermal: Germencik": [27.6, 37.87],
        "Kaçkar Dağları": [41.2, 40.85],
        "KAF (Kuzey Anadolu Fayı)": [36.5, 40.7],
        "Kâğıt: Aksu": [38.5, 40.8],
        "Kâğıt: Taşköprü": [34.21, 41.51],
        "Kahverengi orman toprağı": [32.5, 41.4],
        "Kalanklı (karstik) kıyı": [34.2, 36.4],
        "Kanola": [27.51, 40.98],
        "Kapadokya": [34.83, 38.67],
        "Kapıköy (İran)": [44.25, 38.2],
        "Kapıkule (demiryolu / BG)": [26.48, 41.71],
        "Kapıkule Sınır Kapısı": [26.48, 41.71],
        "Karacadağ": [39.83, 37.75],
        "Karacadağ (Konya)": [33.77, 37.73],
        "Karadağ": [33.18, 37.4],
        "Karakaya HES": [39, 38.4],
        "Karapınar GES": [33.55, 37.72],
        "Kasnak meşesi": [30.8, 37.85],
        "Kastamonu (demiryolu yok)": [33.78, 41.38],
        "Kastamonu-Daday masifi": [33.45, 41.48],
        "Kayısı": [38.31, 38.35],
        "Kayseri Ovası": [35.49, 38.73],
        "Kaz Dağı": [26.85, 39.7],
        "Kazdağı göknarı": [26.85, 39.7],
        "Keban HES": [38.75, 38.8],
        "Kenevir": [33.78, 41.38],
        "Kerkük–Yumurtalık (Adana)": [35.8, 36.85],
        "Kestane / bozkır toprağı": [32.8, 38.8],
        "Kestel Ovası": [30.25, 37.55],
        "Kıl keçisi": [33.5, 36.6],
        "Kırmızı mercimek": [39.5, 37.4],
        "Kırşehir Masifi": [34.16, 39.15],
        "Kıyı Ege": [27.2, 38.2],
        "Kızılırmak": [36.1, 41.55],
        "Kızılırmak → Bafra": [35.9, 41.57],
        "Kocaeli Limanı (geniş hinterland)": [29.92, 40.77],
        "Konya Ovası": [32.49, 37.87],
        "Kop Geçidi": [40.2, 40.05],
        "Korkuteli Ovası": [30.2, 37.07],
        "Koyun": [43.41, 38.5],
        "Kozlu (taşkömürü)": [31.75, 41.43],
        "Köroğlu Dağları": [31.8, 40.55],
        "Köyceğiz Gölü": [28.65, 36.9],
        "Kralkızı HES": [40.55, 38.35],
        "Krom: Guleman": [39.9, 38.45],
        "Krom: Köyceğiz": [28.69, 36.97],
        "Kula volkanları": [28.65, 38.55],
        "Kura": [43, 41.2],
        "Kuşadası (kruvaziyer)": [27.26, 37.86],
        "Küçük Menderes": [27.35, 37.95],
        "Küçükçekmece": [28.75, 41],
        "Kükürt: Keçiborlu": [30.25, 37.95],
        "Kümes hayvancılığı": [27.8, 39],
        "Küre Dağları": [33.2, 41.55],
        "Lastik: Adapazarı": [30.4, 40.76],
        "Limani kıyı (Çekmece)": [28.65, 41.01],
        "Linyit: Afşin-Elbistan": [37, 38.25],
        "Lüle taşı": [30.52, 39.78],
        "Madra Dağları": [27.2, 39.35],
        "Maki alanı": [30.71, 36.9],
        "Malatya Ovası": [38.31, 38.35],
        "Manda": [36.33, 41.29],
        "Manganez: Ereğli": [31.45, 41.28],
        "Manyas (Kuş) Gölü": [28, 40.18],
        "Mardin Eşik Masifi": [40.9, 37.35],
        "Mardin-Midyat Eşiği": [41.05, 37.45],
        "Mavi Akım (Samsun)": [36.33, 41.29],
        "Meke Gölü": [33.64, 37.68],
        "Melendiz Dağı": [34.63, 38.37],
        "Menemen Deltası": [27.07, 38.58],
        "Menteşe Dağları": [28.2, 37.15],
        "Menteşe Yöresi": [28.2, 37.15],
        "Meriç": [26.5, 41],
        "Meriç Deltası": [26.35, 40.75],
        "Mersin Limanı (geniş hinterland)": [34.63, 36.81],
        "Mısır": [35.32, 37],
        "Mısırözü yağı": [35.32, 37],
        "Mobilya": [35.49, 38.73],
        "Muğla (demiryolu yok)": [28.37, 37.22],
        "Muğla Ovaları": [28.37, 37.22],
        "Muş Ovası": [41.49, 38.74],
        "Muz": [32.5, 36.15],
        "Nemrut Dağı (volkan)": [42.02, 38.62],
        "Nemrut Krater Gölü": [42.02, 38.62],
        "Nevşehir (demiryolu yok)": [34.71, 38.62],
        "NGS: Akkuyu": [33.54, 36.14],
        "Niksar Ovası": [36.9, 40.53],
        "Nur (Amanos) Dağları": [36.25, 36.75],
        "Nusaybin (Suriye demiryolu)": [41.22, 37.07],
        "Obruk Platosu": [33.2, 38.2],
        "Oltu taşı": [41.98, 40.55],
        "Ordu (demiryolu yok)": [37.88, 40.98],
        "Otluk-mera (büyükbaş)": [41.5, 40],
        "Ovaakça DGKÇS": [29.15, 40.25],
        "Ovit Geçidi": [40.8, 40.62],
        "Pamuk": [38.79, 37.17],
        "Pamuklu dokuma": [30.5, 37.5],
        "Pasinler Ovası": [41.68, 39.98],
        "Patates": [34.68, 37.97],
        "Petro-kimya (hammadde)": [41.14, 37.88],
        "Petrol: Batman": [41.14, 37.88],
        "Podzol": [32, 41.5],
        "Regosol (Kapadokya)": [34.83, 38.67],
        "Ria kıyı (Boğazlar)": [29.1, 40.95],
        "Ria kıyı (Gökova / Menteşe)": [28.2, 37],
        "Rize (demiryolu yok)": [40.52, 41.02],
        "Rize mikroklima (turunçgil)": [40.52, 41.02],
        "Rüzgâr: Alaçatı": [26.38, 38.28],
        "Safranbolu Ovası": [32.69, 41.25],
        "Sakarya": [30.4, 41.12],
        "Salda Gölü": [29.68, 37.55],
        "Samsun Limanı (geniş hinterland)": [36.33, 41.29],
        "Sapanca Gölü": [30.26, 40.72],
        "Sarayköy JES": [28.93, 37.92],
        "Saruhan-Menteşe masifi": [27.8, 38.2],
        "Savunma": [33.51, 39.85],
        "Selçuk Deltası": [27.37, 37.95],
        "Seramik": [29.98, 39.42],
        "Sertavul Geçidi": [33.3, 36.9],
        "Seyhan": [35.33, 36.78],
        "Sığla (günlük) ağacı": [28.65, 36.9],
        "Silifke Deltası": [33.93, 36.38],
        "Silifke karstik kıyı": [33.93, 36.38],
        "Silopi (asfaltit)": [42.47, 37.25],
        "Sinop (demiryolu yok)": [35.15, 42.03],
        "Sinop çevresi": [35.15, 42.03],
        "Sinop Limanı (dar hinterland)": [35.15, 42.03],
        "Sivas ve çevresi": [37.02, 39.75],
        "Söke / Balat Deltası": [27.4, 37.48],
        "Suruç Ovası": [38.42, 36.98],
        "Süphan Dağı": [42.83, 38.93],
        "Şanlıurfa Platosu": [38.79, 37.3],
        "Şeker (pancar)": [32.49, 37.87],
        "Şeker pancarı": [32.49, 37.87],
        "Şırnak (demiryolu yok)": [42.45, 37.52],
        "Tahtalı Dağları": [36.3, 38.2],
        "TANAP güzergâhı": [35, 39.5],
        "Taşeli karstik alanları": [33.2, 36.55],
        "Taşeli Platosu": [33.2, 36.55],
        "Taşkömürü: Kozlu": [31.75, 41.43],
        "Tefenni Ovası": [29.78, 37.32],
        "Teke Platosu": [29.9, 36.85],
        "Teke Yarımadası": [29.9, 36.5],
        "Teke–Taşeli": [31.5, 36.6],
        "Tendürek Dağı": [43.87, 39.35],
        "Terkos (Durusu)": [28.55, 41.32],
        "Terra Rossa": [30.71, 36.9],
        "Tiftik keçisi (Ankara keçisi)": [32.85, 39.93],
        "Tortum Gölü": [41.55, 40.65],
        "Toryum: Sivrihisar": [31.53, 39.45],
        "Trabzon (demiryolu yok)": [39.72, 41],
        "Trabzon Limanı (İran transiti)": [39.72, 41],
        "Trabzon Limanı (transit)": [39.72, 41],
        "Trona: Beypazarı–Kazan": [31.92, 40.17],
        "Turunçgil": [34.8, 36.8],
        "Tuz Gölü": [33.4, 38.75],
        "Tuz Gölü çevresi (kuraklık)": [33.4, 38.75],
        "Tuz Gölü güneyi (Konya-Karaman)": [33.2, 37.8],
        "Tuz Gölü kapalı havzası": [33.4, 38.75],
        "TürkAkım (Kıyıköy / Trakya)": [28.1, 41.65],
        "Tütün": [27.43, 38.61],
        "Uçak": [32.85, 39.93],
        "Uranyum: Sorgun": [35.18, 39.81],
        "Uzunköprü (demiryolu / GR)": [26.69, 41.27],
        "Uzunyayla": [37, 38.8],
        "Üzüm": [27.43, 38.61],
        "Van Gölü": [43, 38.63],
        "Van Gölü havzası": [43, 38.63],
        "Vertisol (Ergene)": [26.9, 41.2],
        "Volfram: Uludağ": [29.15, 40.07],
        "Yazılıkaya Platosu": [30.7, 39.2],
        "Yer fıstığı": [36.25, 37.07],
        "Yeşilırmak": [36.65, 41.22],
        "Yeşilırmak → Çarşamba": [36.72, 41.2],
        "YHT: Karaman": [33.22, 37.18],
        "YHT: Konya": [32.49, 37.87],
        "YHT: Sivas": [37.02, 39.75],
        "Yıldız Dağları": [27.5, 41.75],
        "Yıldız Dağları (seyrek)": [27.5, 41.75],
        "Yunt Dağları": [27.2, 38.9],
        "Yusufeli HES": [41.55, 40.82],
        "Yüksekova": [44.28, 37.57],
        "Zeytin": [27.4, 38.5],
        "Zeytinyağı": [27.5, 38],
        "Zımpara: Aydın–Alanya": [28.5, 37.5],
        "Zigana Geçidi": [39.4, 40.65],
        "Zonguldak masifi": [31.79, 41.46]
    };

    var TREE = [
        {
            id: "yer", title: "Yer şekilleri · jeoloji", icon: "🗻",
            kids: [
                { id: "volkanik", title: "Volkanik dağlar", icon: "🌋", hoverImg: "img/map/volkan-hover.png" },
                { id: "volkanik-arazi", title: "Volkanik araziler", icon: "🌋", hoverImg: "img/map/volkan-hover.png" },
                { id: "kirik", title: "Kırık dağlar (horst–graben)", icon: "⛰️", hoverImg: "img/map/kirik-kivrim.png" },
                { id: "kivrim", title: "Kıvrım dağları", icon: "🏔️", hoverImg: "img/map/kirik-kivrim.png" },
                { id: "masif", title: "Masif araziler", icon: "🪨", hoverImg: "img/map/masif.png" },
                { id: "fay", title: "Fay hatları (KAF·DAF·BAF)", icon: "⚡", hoverImg: "img/map/fay.png" },
                { id: "deprem-az", title: "Deprem riski az alanlar", icon: "🟢", hoverImg: "img/map/deprem-az.png" }
            ]
        },
        {
            id: "plato", title: "Platolar", icon: "🏜️",
            kids: [
                { id: "plato-karst", title: "Karstik platolar", icon: "🪨", hoverImg: "img/map/plato-karst.png" },
                { id: "plato-volkan", title: "Volkanik / lav platoları", icon: "🌋", hoverImg: "img/map/volkan-hover.png" },
                { id: "plato-asinim", title: "Aşınım düzlüğü platoları", icon: "🟩", hoverImg: "img/map/plato-asinim.png" },
                { id: "plato-tabaka", title: "Tabaka düzlüğü platoları", icon: "🏜️", hoverImg: "img/map/plato-tabaka.png" }
            ]
        },
        {
            id: "ova", title: "Ovalar", icon: "🌾",
            kids: [
                { id: "delta", title: "Delta ovaları", icon: "🌊", hoverImg: "img/map/delta.png" },
                { id: "ova-karst", title: "Karstik ovalar (TAKKEM)", icon: "🪨" },
                { id: "ova-tektonik", title: "Tektonik ovalar", icon: "🌾" },
                { id: "ova-volkan", title: "Volkanik ovalar", icon: "🌋", hoverImg: "img/map/volkan-hover.png" },
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
                { id: "boru", title: "Enerji boru hatları", icon: "🛢️" },
                { id: "hes", title: "HES, santral ve enerji", icon: "⚡" },
                { id: "transit", title: "Transit ticaret yolları", icon: "🚛" },
                { id: "yht", title: "YHT ve demiryolu kapıları", icon: "🚄" }
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
        ["Tendürek Dağı", "Ağrı", null],
        ["Süphan Dağı", "Bitlis-Ağrı", { follow: { q: "Süphan hangi bölgededir?", choices: ["Ege", "İç Anadolu", "Doğu Anadolu", "Akdeniz"], answer: "Doğu Anadolu" } }],
        ["Nemrut Dağı (volkan)", "Bitlis", { prompt: "Bitlis Nemrut'u bul (volkan + krater gölü). Adıyaman Nemrut volkan değildir.", follow: { q: "Van Gölü'nün oluşumunda etkili volkan hangisidir?", choices: ["Erciyes", "Nemrut (Bitlis)", "Adıyaman Nemrut", "Hasan Dağı"], answer: "Nemrut (Bitlis)" } }],
        ["Erciyes Dağı", "Kayseri", { follow: { q: "Erciyes'in oluşum tipi nedir?", choices: ["Kıvrım", "Kırık", "Volkanik", "Karstik"], answer: "Volkanik" } }],
        ["Hasan Dağı", "Aksaray-Niğde", null],
        ["Melendiz Dağı", "Niğde", null],
        ["Karadağ", "Karaman", { prompt: "Karaman'daki volkanik Karadağ'ı bul. (Karacadağ Urfa–Diyarbakır'dadır.)" }],
        ["Karacadağ", "Diyarbakır-Şanlıurfa", { follow: { q: "Türkiye'nin tek kalkan tipi volkanı hangisidir?", choices: ["Erciyes", "Ağrı", "Karacadağ", "Kula"], answer: "Karacadağ" } }],
        ["Karacadağ (Konya)", "Konya", { prompt: "Konya Karacadağ'ı bul. (Şanlıurfa–Diyarbakır'daki Karacadağ başka dağdır.)" }],
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
        ["Belen Geçidi", "Hatay", { prompt: "Amanoslar üzerindeki Belen Geçidi'ni bul." }],
        ["Gürlek Geçidi", "Kahramanmaraş", { prompt: "Akdeniz geçitlerinden Gürlek'i (ÇSGB) bul." }],
        ["Geyve Boğazı", "Sakarya", { prompt: "Marmara'daki Geyve Boğazı'nı bul." }],
        ["Bolu Dağı Geçidi", "Bolu", { prompt: "Marmara–Batı Karadeniz Bolu Dağı Geçidi'ni bul." }]
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
        ["Çay", "Rize-Trabzon-Artvin-Giresun", { prompt: "Çayın tamamı Doğu Karadeniz'dedir; Rize kuşağını bul." }],
        ["Fındık", "Ordu-Samsun-Düzce-Giresun-Sakarya", { prompt: "Fındıkta 1. Karadeniz, 2. Marmara. Kuşağı bul." }],
        ["Zeytin", "Manisa-İzmir", { follow: { q: "Zeytin üretiminde en fazla öne çıkan iller?", choices: ["Manisa ve İzmir", "Rize ve Trabzon", "Kars ve Ağrı", "Van ve Hakkâri"], answer: "Manisa ve İzmir" } }],
        ["Turunçgil", "Antalya-Mersin-Adana-Hatay", null],
        ["Muz", "Mersin-Antalya-Adana-Hatay", { prompt: "Muz mikrokliması: Antalya, Mersin, Adana, Hatay." }],
        ["İncir", "Aydın", { prompt: "Aydın incirini bul (monokültür; dünya 1.)." }],
        ["Kayısı", "Malatya-Mersin", { prompt: "Kayısıda Malatya ve Mersin öne çıkar." }],
        ["Pamuk", "Şanlıurfa-Adana-Aydın", { follow: { q: "Pamuk üretiminde birinci il?", choices: ["Rize", "Şanlıurfa", "Kars", "Zonguldak"], answer: "Şanlıurfa" } }],
        ["Mısır", "Adana-Konya-Şanlıurfa", { prompt: "Yağlık mısır: Çukurova, Konya Ovası, Şanlıurfa." }],
        ["Şeker pancarı", "Konya-Eskişehir-Kayseri", { prompt: "Şeker pancarı (fabrika yanı): Konya, Eskişehir, Kayseri." }],
        ["Çeltik", "Edirne-Samsun-Balıkesir", { follow: { q: "Çeltikte en fazla üretim nerededir?", choices: ["Meriç (Edirne) boyları", "Rize yaylaları", "Van Gölü", "Tuz Gölü"], answer: "Meriç (Edirne) boyları" } }],
        ["Haşhaş", "Afyonkarahisar-Denizli", { prompt: "Kontrollü haşhaş; fabrika Bolvadin (Afyon)." }],
        ["Tütün", "Manisa-Samsun", { prompt: "Tütün üretimi en fazla Ege'dedir." }],
        ["Üzüm", "Manisa", { prompt: "Üzümde en fazla üretim Ege'de Manisa." }],
        ["Elma", "Isparta-Antalya-Karaman-Niğde", { prompt: "Elma: başta Isparta; Antalya, Karaman, Niğde." }],
        ["Ayçiçeği", "Tekirdağ-Konya-Adana", { prompt: "Ayçiçeği merkezi Ergene (Trakya); Konya ve Adana da ekilir." }],
        ["Buğday", "Konya", null],
        ["Antep fıstığı", "Şanlıurfa", { follow: { q: "Antep fıstığı üretiminde notlara göre öne çıkan yer?", choices: ["Şanlıurfa çevresi", "Rize", "Konya Ovası", "Ergene"], answer: "Şanlıurfa çevresi" } }],
        ["Yer fıstığı", "Osmaniye-Adana", { prompt: "Yer fıstığı: Çukurova ve Osmaniye." }],
        ["Gül", "Isparta", { prompt: "Gül: Göller Yöresi / Isparta." }],
        ["Patates", "Niğde-Kayseri", { prompt: "Patates: Niğde, ardından Kayseri." }],
        ["Kırmızı mercimek", "Şanlıurfa-Diyarbakır-Mardin", { prompt: "Kırmızı mercimekte Güneydoğu birinci sıradadır." }],
        ["Kenevir", "Kastamonu-Amasya-Samsun", { prompt: "Kenevir devlet kontrollüdür; izin en çok Karadeniz." }],
        ["Kanola", "Tekirdağ-Konya", { prompt: "Kanola: Trakya'nın Sarı Kızı." }]
    ].forEach(function (r) { ITEMS.push(F("tarim", r[0], r[1], r[2] || {})); });

    [
        ["Otluk-mera (büyükbaş)", "Erzurum-Kars-Ağrı", { follow: { q: "Otluk-mera büyükbaşın başlıca illeri?", choices: ["Erzurum, Kars, Ağrı", "Manisa, Balıkesir", "Mersin, Antalya", "Samsun, Ordu"], answer: "Erzurum, Kars, Ağrı" } }],
        ["Kıl keçisi", "Mersin-Antalya", { follow: { q: "Kıl keçisinde il birincisi?", choices: ["Mersin", "Ankara", "Van", "Samsun"], answer: "Mersin" } }],
        ["Tiftik keçisi (Ankara keçisi)", "Ankara", { prompt: "Tiftik keçisinde il birincisi Ankara." }],
        ["Koyun", "Van", { follow: { q: "Koyun sayısında birinci il?", choices: ["Van", "Rize", "Yalova", "Mersin"], answer: "Van" } }],
        ["Manda", "Samsun", { prompt: "En çok manda Samsun çevresindedir (sulak/bataklık)." }],
        ["İpek böcekçiliği", "Diyarbakır", { prompt: "İpek böcekçiliğinin başlıca merkezi Diyarbakır." }],
        ["Arıcılık", "Ordu-Adana", { prompt: "Arıcılıkta il birincisi Ordu (Doğu Karadeniz); Adana da önemli." }],
        ["Kümes hayvancılığı", "Manisa-Balıkesir", { prompt: "Kümes en çok Manisa ve Balıkesir'dedir." }]
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
        ["Kuşadası (kruvaziyer)", "Aydın"],
        ["Kocaeli Limanı (geniş hinterland)", "Kocaeli"],
        ["Hopa Limanı (dar hinterland)", "Artvin", { prompt: "Dar hinterlandlı Hopa limanını bul." }],
        ["Cide Limanı (dar hinterland)", "Kastamonu"]
    ].forEach(function (r) { ITEMS.push(F("liman", r[0], r[1], r[2] || {})); });

    [
        ["Demir: Divriği", "Sivas", { follow: { q: "Divriği demiri başlıca nerede işlenir?", choices: ["Rize", "Ereğli / Karabük / İskenderun", "Van", "Muğla"], answer: "Ereğli / Karabük / İskenderun" } }],
        ["Demir: Hekimhan", "Malatya", { prompt: "Hekimhan–Hasançelebi demirini bul." }],
        ["Bakır: Murgul", "Artvin"], ["Bakır: Küre", "Kastamonu"], ["Bakır: Çayeli", "Rize"],
        ["Bakır işleme: Samsun", "Samsun", { follow: { q: "Bakırın işlendiği liman kenti?", choices: ["Antalya", "Samsun", "Van", "Konya"], answer: "Samsun" } }],
        ["Boksit: Akseki", "Antalya"], ["Boksit işleme: Seydişehir", "Konya"],
        ["Krom: Guleman", "Elazığ"], ["Krom: Köyceğiz", "Muğla"],
        ["Bor: Balıkesir–Eskişehir–Kütahya–Bursa", "Balıkesir-Eskişehir-Kütahya-Bursa", { prompt: "Bor kuşağının bir ilini bul (Marmara güneyi / İçbatı Anadolu)." }],
        ["Barit: Alanya", "Antalya"],
        ["Fosfat: Mazıdağı", "Mardin"],
        ["Asbest: Eskişehir", "Eskişehir"],
        ["Trona: Beypazarı–Kazan", "Ankara"],
        ["Altın: Ovacık", "İzmir"],
        ["Altın: Cerattepe", "Artvin"],
        ["Uranyum: Sorgun", "Yozgat"],
        ["Toryum: Sivrihisar", "Eskişehir"],
        ["Cıva: Karaburun", "İzmir"],
        ["Kükürt: Keçiborlu", "Isparta"],
        ["Manganez: Ereğli", "Zonguldak"],
        ["Oltu taşı", "Erzurum"],
        ["Lüle taşı", "Eskişehir"],
        ["Volfram: Uludağ", "Bursa"],
        ["Zımpara: Aydın–Alanya", "Aydın-Antalya"]
    ].forEach(function (r) { ITEMS.push(F("maden", r[0], r[1], r[2] || {})); });

    [
        ["Demir-çelik: Ereğli", "Zonguldak", { follow: { q: "Ereğli–Karabük tesisinin temel kuruluş nedeni?", choices: ["Turizm", "Enerji / taşkömürü yakınlığı", "Pamuk tarımı", "Kruvaziyer"], answer: "Enerji / taşkömürü yakınlığı" } }],
        ["Demir-çelik: Karabük", "Karabük"],
        ["Demir-çelik: İskenderun", "Hatay", { follow: { q: "İskenderun demir-çeliğinin avantajı?", choices: ["Buzul vadisi", "Liman / ulaşım", "Podzol toprak", "Fiyort"], answer: "Liman / ulaşım" } }],
        ["Alüminyum: Seydişehir", "Konya", { prompt: "Boksitin işlendiği Seydişehir'i bul." }],
        ["Linyit: Afşin-Elbistan", "Kahramanmaraş", { follow: { q: "Türkiye'nin en büyük linyit santrali nerededir?", choices: ["Zonguldak", "Afşin-Elbistan", "Alaçatı", "Akkuyu"], answer: "Afşin-Elbistan" } }],
        ["Taşkömürü: Kozlu", "Zonguldak"],
        ["Petrol: Batman", "Batman"],
        ["Asfaltit: Silopi", "Şırnak"],
        ["GES: Karapınar", "Konya"],
        ["Rüzgâr: Alaçatı", "İzmir"],
        ["Jeotermal: Germencik", "Aydın"],
        ["NGS: Akkuyu", "Mersin"],
        ["Çay fabrikası", "Rize", { follow: { q: "Çay fabrikaları neden Doğu Karadeniz'dedir?", choices: ["Çay tarımı burada", "Ar-Ge en yüksek", "Maden çeşidi", "Şeker pancarı"], answer: "Çay tarımı burada" } }],
        ["Ayçiçek yağı", "Tekirdağ-Edirne", { prompt: "Trakya ayçiçek yağı sanayisinin bir ilini bul." }],
        ["Zeytinyağı", "Aydın-İzmir-Balıkesir-Bursa"],
        ["Mısırözü yağı", "Adana"],
        ["Kâğıt: Aksu", "Giresun"],
        ["Kâğıt: Taşköprü", "Kastamonu"],
        ["Seramik", "Kütahya"],
        ["Pamuklu dokuma", "Adana-İzmir-Denizli"],
        ["Petro-kimya (hammadde)", "Batman", { follow: { q: "Hammaddeye bağlı tek petro-kimya tesisi nerededir?", choices: ["İstanbul", "Batman", "Rize", "Kayseri"], answer: "Batman" } }],
        ["Şeker (pancar)", "Konya", { prompt: "Şeker fabrikalarının yoğun olduğu Orta Anadolu ilini bul." }],
        ["Mobilya", "Kayseri"],
        ["İlaç", "İstanbul-Tekirdağ"],
        ["Uçak", "Ankara-Eskişehir"],
        ["Halı-kilim: Hereke", "Kocaeli"],
        ["Lastik: Adapazarı", "Sakarya"],
        ["Savunma", "Kırıkkale"],
        ["Gemi: Tuzla / Pendik", "İstanbul"]
    ].forEach(function (r) { ITEMS.push(F("sanayi", r[0], r[1], r[2] || {})); });

    [
        ["BTC (Bakü–Tiflis–Ceyhan)", "Adana-Hatay", { prompt: "BTC'nin deniz terminali Ceyhan/İskenderun yöresini bul." }],
        ["TANAP güzergâhı", "Ardahan-Kars-Erzincan-Ankara-Eskişehir-Çanakkale", { prompt: "TANAP'ın geçtiği bir ili bul." }],
        ["Mavi Akım (Samsun)", "Samsun", { prompt: "Mavi Akım'ın karaya çıktığı Samsun'u bul." }],
        ["TürkAkım (Kıyıköy / Trakya)", "Kırklareli-Tekirdağ", { prompt: "TürkAkım'ın Trakya girişini bul." }],
        ["Kerkük–Yumurtalık (Adana)", "Adana", { prompt: "Irak petrolünün Akdeniz çıkışını (Yumurtalık/Ceyhan yöresi) bul." }],
        ["BTE (Bakü–Tiflis–Erzurum)", "Erzurum", { prompt: "Azerbaycan gazının Erzurum hattını bul." }]
    ].forEach(function (r) { ITEMS.push(F("boru", r[0], r[1], r[2])); });

    [
        ["Keban HES", "Elazığ", { follow: { q: "Keban hangi nehir üzerindedir?", choices: ["Dicle", "Fırat", "Kızılırmak", "Çoruh"], answer: "Fırat" } }],
        ["Karakaya HES", "Diyarbakır-Malatya", { prompt: "Fırat üzerindeki Karakaya HES yöresini bul." }],
        ["Atatürk HES", "Adıyaman-Şanlıurfa", { follow: { q: "Atatürk Barajı hangi nehir üzerindedir?", choices: ["Dicle", "Fırat", "Yeşilırmak", "Çoruh"], answer: "Fırat" } }],
        ["Birecik HES", "Şanlıurfa"],
        ["Ilısu HES", "Mardin", { follow: { q: "Ilısu hangi nehir üzerindedir?", choices: ["Fırat", "Dicle", "Kızılırmak", "Çoruh"], answer: "Dicle" } }],
        ["Kralkızı HES", "Diyarbakır"],
        ["Deriner HES", "Artvin", { follow: { q: "Deriner hangi nehir üzerindedir?", choices: ["Fırat", "Dicle", "Çoruh", "Yeşilırmak"], answer: "Çoruh" } }],
        ["Yusufeli HES", "Artvin"],
        ["Altınkaya HES", "Samsun", { follow: { q: "Altınkaya hangi nehir üzerindedir?", choices: ["Yeşilırmak", "Kızılırmak", "Fırat", "Çoruh"], answer: "Kızılırmak" } }],
        ["Hasan Uğurlu HES", "Samsun", { follow: { q: "Hasan Uğurlu hangi nehir üzerindedir?", choices: ["Kızılırmak", "Yeşilırmak", "Fırat", "Dicle"], answer: "Yeşilırmak" } }],
        ["Afşin-Elbistan (linyit)", "Kahramanmaraş"],
        ["Akkuyu NGS", "Mersin"],
        ["Karapınar GES", "Konya"],
        ["Alaçatı RES", "İzmir"],
        ["Germencik JES", "Aydın"],
        ["Sarayköy JES", "Denizli"],
        ["Silopi (asfaltit)", "Şırnak"],
        ["Kozlu (taşkömürü)", "Zonguldak"],
        ["Ovaakça DGKÇS", "Bursa"]
    ].forEach(function (r) { ITEMS.push(F("hes", r[0], r[1], r[2] || {})); });

    [
        ["Gürbulak Sınır Kapısı", "Ağrı", { follow: { q: "Gürbulak–Trabzon kimin Karadeniz çıkışıdır?", choices: ["İran", "Irak", "Bulgaristan", "Yunanistan"], answer: "İran" } }],
        ["Trabzon Limanı (İran transiti)", "Trabzon", { prompt: "İran yükünün Karadeniz'e çıktığı Trabzon limanını bul." }],
        ["Habur Sınır Kapısı", "Şırnak", { follow: { q: "Habur–Kapıkule hangi ticaretin ana damarıdır?", choices: ["Irak/Orta Doğu–Avrupa", "İran–Karadeniz", "Gürcistan–Ege", "Rusya–Akdeniz"], answer: "Irak/Orta Doğu–Avrupa" } }],
        ["Kapıkule Sınır Kapısı", "Edirne", { prompt: "Avrupa çıkışlı Kapıkule'yi (Edirne) bul." }]
    ].forEach(function (r) { ITEMS.push(F("transit", r[0], r[1], r[2] || {})); });

    [
        ["İlk YHT: Ankara–Eskişehir", "Ankara-Eskişehir", { follow: { q: "İlk YHT hattı hangisidir?", choices: ["Ankara–Erzurum", "Ankara–Eskişehir", "İzmir–Aydın", "Konya–Karaman"], answer: "Ankara–Eskişehir" } }],
        ["YHT: Konya", "Konya"],
        ["YHT: Sivas", "Sivas"],
        ["YHT: Karaman", "Karaman"],
        ["Kapıkule (demiryolu / BG)", "Edirne", { follow: { q: "Bulgaristan demiryolu kapısı?", choices: ["Kapıköy", "Kapıkule", "Akyaka", "Canbaz"], answer: "Kapıkule" } }],
        ["Uzunköprü (demiryolu / GR)", "Edirne"],
        ["Canbaz (BTK / Gürcistan)", "Ardahan-Kars"],
        ["Kapıköy (İran)", "Van"],
        ["Akyaka (Ermenistan, kapalı)", "Kars"],
        ["Nusaybin (Suriye demiryolu)", "Mardin"],
        ["GAP kargo havalimanı", "Şanlıurfa"]
    ].forEach(function (r) { ITEMS.push(F("yht", r[0], r[1], r[2] || {})); });

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

    function pickPlaceRound(topicId, n) {
        var list = itemsForTopic(topicId).filter(function (it) {
            return it && !it.mcq && it.id && it.name;
        });
        var want = n == null ? 7 : n;
        if (want < 6) want = 6;
        if (want > 8) want = 8;
        var take = Math.min(want, list.length);
        var items = shuffle(list).slice(0, take);
        var chips = shuffle(items.map(function (it) {
            return { id: it.id, name: it.name };
        }));
        return { items: items, chips: chips };
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
        if (t === "hes") return "⚡";
        if (t === "transit") return "🚛";
        if (t === "yht") return "🚄";
        if (t === "demiryolu") return "🚫";
        if (t === "nufus-seyrek") return "🏕️";
        if (t === "nufus-yogun") return "🏙️";
        if (t.indexOf("milli") === 0) return "🏞️";
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
        var list = itemsForTopic(topicId);
        var pins = list.map(function (it) {
            return {
                id: it.id,
                name: it.name,
                x: it.x,
                y: it.y,
                glyph: it.glyph || itemGlyph(it)
            };
        });
        if (topicId !== "volkanik") separatePins(pins, 36);
        else separatePins(pins, 18);
        return { pins: pins, viewBox: "0 0 1000 422", glyph: topicGlyph(topicId) };
    }

    function topicPinsForPlay(topicId) {
        return itemsForTopic(topicId).map(function (it) {
            return {
                id: it.id,
                name: it.name,
                glyph: it.glyph || itemGlyph(it),
                x: it.x,
                y: it.y,
                code: (it.codes && it.codes[0]) || null,
                ox: 0,
                oy: 0,
                hasOff: false,
                fanI: 0,
                fanN: 1
            };
        });
    }

    var api = {
        REGION_LABEL: REGION_LABEL,
        PROVINCE_REGION: PROVINCE_REGION,
        NAMES: NAMES,
        TREE: TREE,
        ITEMS: ITEMS,
        pickRound: pickRound,
        pickPlaceRound: pickPlaceRound,
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
        topicPinsForPlay: topicPinsForPlay,
        topicGlyph: topicGlyph,
        itemGlyph: itemGlyph
    };
    global.MapQuiz = api;
    if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
