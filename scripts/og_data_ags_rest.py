# -*- coding: utf-8 -*-
"""AGS Tarih, Cografya, Egitim, Mevzuat (sozel-sayisal og_data_ags.py'de)."""


def _t(ders, prefix, title, slides, facts):
    return {"ders": ders, "prefix": prefix, "title": title, "slides": slides, "facts": facts}


def T(ders, prefix, title, a, b, c, facts):
    return _t(ders, prefix, title, [a, b, c], facts)


def sl(h, color, items, trap=None):
    return (h, color, items, trap)


TOPICS = []


def add(*args):
    TOPICS.append(T(*args))


add("AGS Tarih", "ags_tarih", "Osmanlı Öncesi Türk Tarihi",
    sl("SİYASİ ÇERÇEVE", "blue", [
        "**Asya Hun** ilk teşkilatlı Türk devletlerindendir; **Mete** onluk sistemi askerî-siyasi temele oturtur.",
        "**Göktürk** (552) Türk adını resmi devlet adı yapan ilk siyasi yapıdır; Orhun Yazıtları birinci el kaynaktır.",
        "**Uygur** yerleşik hayat, matbaa ve Maniheizm ile bozkır geleneğinden kısmen ayrılır.",
        "**Karahanlı** ilk Müslüman Türk devletlerindendir; Satuk Buğra Han İslamlaşmada kilit isimdir.",
        "**Büyük Selçuklu** Malazgirt (1071) ile Anadolu'nun kapısını açar; Nizamülmülk medrese-iktâ düzenini kurumlaştırır.",
    ], "İlk Müslüman Türk devleti tartışmasında Karahanlı öne çıkar; Gazneli de Müslüman Türk devletidir, 'ilk' iddiası soruda kılı kırk yarar."),
    sl("SOSYAL-EKONOMİK", "violet", [
        "Bozkırda **konar-göçer** hayat, hayvancılık ve **yağma/ganimet** ekonomisi iç içedir.",
        "**Ötüken** kutsal merkez algısı siyasi meşruiyeti coğrafyaya bağlar.",
        "**İkta** Selçuklu'da toprak geliri karşılığı asker-yönetim yükümlülüğüdür; Osmanlı tımarının öncülüdür.",
        "Uygurlarda **tarım ve ticaret** (İpek Yolu) yerleşik kent hayatını güçlendirir.",
        "**Kut** inancı hükümdarlığın Tengri kaynaklı meşruiyetidir; başarısızlık kutun çekilmesi sayılır.",
    ], None),
    sl("KÜLTÜR VE YAZI", "emerald", [
        "**Orhun (Köktürk) alfabesi** Bengü taşlarda kullanılır; Bilge Kağan, Kül Tigin, Tonyukuk metinleri siyasetnamedir.",
        "Uygur **alfabesi** ve basım tekniği Mani ve Budist çevrede gelişir.",
        "Karahanlı döneminde **Türkçe** İslamî dönemde resmi-edebi dil olarak güçlenir (Kutadgu Bilig, Divanü Lügati't-Türk).",
        "**Yusuf Has Hacib** Kutadgu Bilig'de dört temel erdemle devlet felsefesi kurar.",
        "**Kaşgarlı Mahmud** Divanü Lügati't-Türk'ü Araplara Türkçeyi öğretmek ve Türkçenin zenginliğini kanıtlamak için yazar.",
    ], None),
    [
        ("Türk adını resmi devlet adı yapan ilk siyasi yapı hangisidir?", "Göktürk Devleti", ["Asya Hun", "Avar", "Hazar", "Uygur"], "552 Göktürk, Türk adını devlet adında kullanır."),
        ("Onlu askerî teşkilatı sistemleştiren hükümdar kimdir?", "Mete Han", ["Bumin Kağan", "Bilge Kağan", "Satuk Buğra Han", "Tuğrul Bey"], "Hunlarda onluk düzen Mete ile anılır."),
        ("Orhun Yazıtları hangi devlet dönemine aittir?", "Göktürk", ["Uygur", "Karahanlı", "Selçuklu", "Osmanlı"], "VIII. yüzyıl Bengü taşları."),
        ("Yerleşik hayat ve matbaa ile öne çıkan Türk topluluğu hangisidir?", "Uygurlar", ["Kıpçaklar", "Peçenekler", "Oğuzların konar-göçer boyları", "Hunlar"], "Uygur kent ve tarım uygarlığı."),
        ("İlk Müslüman Türk devletleri arasında öne çıkan hangisidir?", "Karahanlılar", ["Göktürk", "Asya Hun", "Uygur (Maniheist dönem)", "Avar"], "Satuk Buğra Han ile İslamlaşma."),
        ("Malazgirt Savaşı'nın tarihi hangisidir?", "1071", ["1077", "1299", "1453", "1040"], "Alparslan-Romen Diyojen, Anadolu'nun kapısı."),
        ("Kutadgu Bilig'in yazarı kimdir?", "Yusuf Has Hacib", ["Kaşgarlı Mahmud", "Nizamülmülk", "Edip Ahmet", "Ahmet Yesevi"], "Karahanlı devlet felsefesi eseri."),
        ("Divanü Lügati't-Türk neden yazılmıştır?", "Türkçenin gücünü göstermek ve Araplara Türkçe öğretmek", ["Osmanlı kanunnamesi için", "Orhun alfabesini kaldırmak", "Hristiyan misyonu", "Yalnızca şiir derlemek"], "Kaşgarlı Mahmud'un amacı dil ve kimliktir."),
        ("Selçuklu ikta sistemi neyi ifade eder?", "Toprak gelirinin hizmet karşılığı tahsisi", ["Özel mülk satışı", "Vakıf yasağı", "Kapitülasyon", "Tımarın Osmanlı'da kaldırılması"], "İkta, tımarın öncül modellerindendir."),
        ("Kut inancı neyi temellendirir?", "Hükümdarlığın Tengri kaynaklı meşruiyetini", ["Feodal Avrupa verasetini", "Laik anayasayı", "Hilafetin kaldırılmasını", "Meşrutiyeti"], "Başarı kutun varlığıyla yorumlanır."),
        ("Nizamülmülk hangi kurumla anılır?", "Nizamiye medreseleri ve siyasetname geleneği", ["Yeniçeri Ocağı", "Divan-ı Hümayun", "Tanzimat Fermanı", "Halkevleri"], "Selçuklu idare ve eğitim."),
        ("Ötüken'in önemi nedir?", "Kutsal merkez ve siyasi meşruiyet coğrafyası", ["Osmanlı başkenti", "Abbasi başkenti", "Roma eyaleti", "Memlük merkezi"], "Bozkır kağanlık geleneği."),
    ])

add("AGS Tarih", "ags_tarih", "Osmanlı Tarihi",
    sl("SİYASİ XIII–XX BAŞI", "blue", [
        "Osmanlı **1299** civarı uç beyliğinden devlete dönüşür; **İstanbul'un fethi (1453)** cihan devletine geçiş simgesidir.",
        "**Yükselme** döneminde merkezî otorite, timarlı sipahi ve kapıkulu dengesi yürür.",
        "**Gerileme/duraklama** anlatısı sınavda mutlak çöküş değil, askerî-malî bunalım ve reform ihtiyacıdır.",
        "**Tanzimat (1839)** ve **Islahat (1856)** hukukta eşitlik ve merkezî modernleşmeyi hızlandırır.",
        "**Meşrutiyet** 1876 Kanun-ı Esasi ve 1908 ikinci açılış ile anayasal monarşi denemesidir.",
    ], "1453'ü yalnızca 'ortaçağın sonu' ezberiyle okumayın; asıl vurgu İstanbul'un başkent ve dünya ticaret-siyaset eksenine alınmasıdır."),
    sl("SOSYAL-EKONOMİK", "violet", [
        "**Tımar** sistemi sipahiye gelir, devlete asker ve düzen sağlar; mülkiyet tam özel değildir.",
        "**Devşirme** kapıkulu ve Enderun insan kaynağını besler.",
        "**Lonca** üretim ve fiyat-kalite denetimini meslekî cemaatle yürütür.",
        "**İltizam** nakit ihtiyacıyla timarın çözülmesine paralel malî pratiktir.",
        "**Kapitülasyonlar** erken dönemde teşvik, sonraki dönemde kapitülasyon-eşitsiz ticaret tartışmasıdır.",
    ], None),
    sl("KÜLTÜR VE KURUM", "emerald", [
        "**Millet sistemi** gayrimüslim cemaatlere dinî-hukukî özerklik tanır.",
        "**Medrese** klasik ulema yetiştirir; **Enderun** yönetici elit üretir.",
        "Klasik dönemde **divan**, kazasker, defterdar, nişancı merkez bürokrasisidir.",
        "**Lale Devri** erken Batı etkileri ve matbaa (Said Efendi-Müteferrika) ile anılır.",
        "**II. Mahmud** Vak'a-i Hayriye (1826) ile Yeniçeri Ocağını kaldırır; modern ordu-bürokrasi yolunu açar.",
    ], None),
    [
        ("İstanbul'un fethi hangi yıldır?", "1453", ["1071", "1299", "1517", "1683"], "II. Mehmet, Doğu Roma'nın sonu."),
        ("Tımar sisteminin temel işlevi nedir?", "Sipahiye gelir karşılığı atlı asker ve yerel düzen", ["Sanayi kapitalizmi", "İşçi sendikası", "Laik eğitim", "Çok partili hayat"], "Dirlik-askeri denge."),
        ("Kanun-ı Esasi hangi yılda ilan edilir?", "1876", ["1839", "1856", "1908", "1921"], "I. Meşrutiyet anayasası."),
        ("Tanzimat Fermanı'nın yılı hangisidir?", "1839", ["1856", "1876", "1826", "1838"], "Gülhane, can-mal-ırz güvencesi ve vergi-askere alma düzeni."),
        ("Islahat Fermanı hangi yıldadır?", "1856", ["1839", "1876", "1908", "1913"], "Gayrimüslim eşitliği vurgusu."),
        ("Vak'a-i Hayriye neyi ifade eder?", "Yeniçeri Ocağının 1826'da kaldırılması", ["Tanzimat", "Fatih Kanunnamesi", "Sened-i İttifak", "Halifeliğin kaldırılması"], "II. Mahmud modern ordu."),
        ("Devşirme sistemi ne işe yarar?", "Kapıkulu ve saray elitine insan kaynağı", ["Tımar satışı", "Kapitülasyon", "Lonca yasağı", "Meşrutiyet"], "Hristiyan tebaadan devşirme klasik modeldir."),
        ("Millet sistemi neyi düzenler?", "Gayrimüslim cemaatlerin dinî-hukukî özerkliğini", ["Tek millet-tek dil inkılabını", "Laikliği", "NATO'yu", "Köy enstitülerini"], "Cemaat başları aracılığıyla yönetim."),
        ("İltizam nedir?", "Vergi kaynağının pey akçesiyle mültezime verilmesi", ["Vakıf arazisi bağışı", "Tımarın güçlenmesi", "Lonca ustalık belgesi", "Kapıkulu maaşı"], "Nakit krizinde malî pratik."),
        ("1908'de ne olur?", "II. Meşrutiyet'in ilanı", ["Tanzimat", "Cumhuriyet", "Montrö", "Lozan"], "Kanun-ı Esasi yeniden yürürlük."),
        ("Klasik Osmanlı divanında defterdarın alanı nedir?", "Maliye", ["Kadılık", "Kaptan-ı deryalık zorunlu", "Şeyhülislamlık", "Yeniçeri ağalığı"], "Defterdar hazine."),
        ("Sened-i İttifak (1808) neyi belgeler?", "Ayan-merkez güç paylaşımı denemesi", ["Cumhuriyet ilanı", "Halifeliğin kaldırılması", "Kapitülasyonun kaldırılması", "Tekke kapatma"], "II. Mahmud öncesi ayan belgesi."),
    ])

add("AGS Tarih", "ags_tarih", "Atatürk İlkeleri ve İnkılap Tarihi",
    sl("YIKILIŞ VE MİLLÎ MÜCADELE", "blue", [
        "XX. yüzyıl başında Osmanlı **Balkan ve I. Dünya Savaşı** ile toprak ve meşruiyet kaybeder.",
        "**Mondros (30 Ekim 1918)** fiilî işgallere zemin açar; **Misak-ı Millî** milli sınır siyasetini çizer.",
        "**19 Mayıs 1919** Samsun, **Amasya Genelgesi** milletin azim ve kararını, **Erzurum-Sivas** kongreleri temsiliyeti kurar.",
        "**23 Nisan 1920** TBMM açılır; meclis hükümeti ve **Teşkilat-ı Esasiye 1921** meşruiyeti taşır.",
        "**Sakarya** ve **Büyük Taarruz** askerî zafer; **Mudanya** ve **Lozan (24 Temmuz 1923)** diplomatik sonuçtur.",
    ], "1921 Teşkilat-ı Esasiye kısa ve yumuşak anayasadır; 1924 uzun ve kuvvetler birliğine yakındır. 1961 kuvvetler ayrılığıdır."),
    sl("İLKE VE İNKILAPLAR", "violet", [
        "**Cumhuriyetçilik** egemenliğin millete ait olduğu yönetim biçimidir; 29 Ekim 1923.",
        "**Milliyetçilik** anti-emperyalist siyasi millet tanımına dayanır; ırkçı değildir.",
        "**Halkçılık** imtiyazsız sınıfsız kitle; **Devletçilik** 1930'larda karma ekonomi ve KİT'ler.",
        "**Laiklik** din-devlet işlerinin ayrılması, eğitim ve hukukun dünyevileşmesi (1924 Tevhid-i Tedrisat, 1928 laiklik yolu, 1937 anayasa).",
        "**İnkılapçılık** devrimlerin korunması ve çağdaşlaşmanın sürekliliğidir.",
    ], None),
    sl("HUKUK-EĞİTİM-TOPLUM", "emerald", [
        "**3 Mart 1924**: halifeliğin kaldırılması, Tevhid-i Tedrisat, Erkan-ı Harbiye Vekaleti'nin kapatılması.",
        "**1926 Medeni Kanun** aile ve özel hukukta İsviçre modeli; kadın-erkek eşitliğine giden temel.",
        "**Harf İnkılabı 1928**, **Millet Mektepleri** okuryazarlık seferberliği.",
        "**Kadınlara** 1930 belediye, 1934 milletvekili seçme-seçilme hakkı.",
        "II. Dünya Savaşı'na kadar **altı ok** 1937'de anayasaya girer; savaşta Türkiye **savaş dışı** kalmaya çalışır.",
    ], None),
    [
        ("TBMM hangi tarihte açılır?", "23 Nisan 1920", ["19 Mayıs 1919", "29 Ekim 1923", "30 Ağustos 1922", "1 Kasım 1922"], "Ankara'da millet iradesi."),
        ("Lozan Barış Antlaşması'nın tarihi nedir?", "24 Temmuz 1923", ["11 Ekim 1922", "29 Ekim 1923", "24 Temmuz 1924", "3 Mart 1924"], "Yeni devletin uluslararası tanınması."),
        ("Tevhid-i Tedrisat neyi birleştirir?", "Eğitim-öğretim kurumlarını Milli Eğitim çatısında", ["Orduları", "Mahkemeleri 1961'de", "Belediyeleri", "Sendikaları"], "3 Mart 1924."),
        ("Cumhuriyet hangi gün ilan edilir?", "29 Ekim 1923", ["23 Nisan 1920", "30 Ağustos 1922", "1 Kasım 1922", "3 Mart 1924"], "Rejim değişikliği."),
        ("Harf İnkılabı yılı hangisidir?", "1928", ["1924", "1926", "1934", "1938"], "Latin alfabesi."),
        ("Medeni Kanun hangi yılda kabul edilir?", "1926", ["1924", "1928", "1930", "1934"], "Aile-miras-eşya hukuku."),
        ("Kadınlar milletvekili seçme-seçilme hakkını ne zaman alır?", "1934", ["1926", "1930", "1924", "1946"], "1930 belediye, 1934 genel."),
        ("Devletçilik ilkesi 1930'larda neyi ifade eder?", "Kamu iktisadi teşebbüsleri ve planlı karma ekonomi", ["Tam liberal laissez-faire", "Feodal tımar", "Kapitülasyon", " lonca"], "1933 Sümerbank vb."),
        ("Misak-ı Millî neyi belirler?", "Milli sınır ve bağımsızlık esaslarını", ["Hilafetin devamını", "Kapitülasyonun genişlemesini", "Manda kabulünü", "Sevr'i onaylar"], "Son Osmanlı Mebusan Meclisi."),
        ("Amasya Genelgesi'nin özü nedir?", "Milletin azim ve kararının hakemliğe yeter olduğu", ["Manda istemek", "Saltanatı güçlendirmek", "Sevr'i kabul", "Halifeyi kurtarmak tek madde"], "Milli Mücadele'nin siyasi programı."),
        ("Altı ok anayasaya hangi yılda girer?", "1937", ["1924", "1928", "1931", "1945"], "CHP ilkelerinin anayasallaşması."),
        ("Sakarya Savaşı'nın siyasi sonucu nedir?", "TBMM'nin askerî varoluşunu pekiştirmesi ve unvanlar", ["Lozan'ın imzası aynı gün", "Cumhuriyet ilanı", "Halifeliğin kaldırılması", "Çok partili hayat"], "Mareşallik ve Gazi unvanı."),
    ])

add("AGS Tarih", "ags_tarih", "Çağdaş Türk ve Dünya Tarihi",
    sl("XX. YÜZYIL DÜNYA", "blue", [
        "**I. Dünya Savaşı** imparatorlukları yıkar; **Wilson ilkeleri** ve **Versailles** yeni düzeni dayatır.",
        "**1917 Bolşevik Devrimi** SSCB'yi doğurur; **1929 buhranı** faşizm ve Keynesyen devlete zemin açar.",
        "**II. Dünya Savaşı** (1939-1945) sonra **BM**, **iki kutup** ve **soğuk savaş** başlar.",
        "**NATO (1949)** ve **Varşova Paktı (1955)** askerî bloklaşmadır.",
        "**Sömürgesizleşme** Asya-Afrika'da yeni devletler üretir; **1960'lar** Afrika yılıdır.",
    ], "Soğuk savaş yalnızca silahlanma değil; ideoloji, uzay, kültür ve vekâlet savaşlarıdır."),
    sl("II. DS SONRASI TÜRKİYE", "violet", [
        "Türkiye **1939-1945** savaş dışıdır; 1945 sonrası **çok partili hayat (1946)** ve **1950 DP iktidarı**.",
        "**1945 BM**, **1952 NATO** üyelikleri Batı ittifakını kurumsallaştırır.",
        "**1960, 1971, 1980** müdahaleleri iç siyaset-anayasa kırılmalarıdır (1961 ve 1982 anayasaları).",
        "**Kıbrıs 1974** harekâtı ve **1974 sonrası** izolasyon-AB ilişkileri sınavda sık geçer.",
        "**1980 sonrası** ihracata dayalı büyüme, **24 Ocak** kararları, **Gümrük Birliği 1996**, **2000'ler** AB-reform gündemi.",
    ], None),
    sl("GÜNCEL ÇERÇEVE", "emerald", [
        "**SSCB'nin dağılması (1991)** tek kutup ve bölgesel krizler dönemini açar.",
        "**AB**, **IMF-WB**, **DTÖ** küresel ekonomi yönetişiminin aktörleridir.",
        "**11 Eylül 2001** uluslararası terör ve güvenlik gündemini değiştirir.",
        "Türkiye **Kafkasya-Ortadoğu-Balkan** jeopolitiğinde köprü ve enerji koridoru tartışmalarındadır.",
        "AGS'de çağdaş tarih **olay-yıl-sonuç** üçlüsüyle sorulur; ezber tarih değil neden-sonuç istenir.",
    ], None),
    [
        ("Türkiye NATO'ya hangi yıl üye olur?", "1952", ["1945", "1949", "1950", "1963"], "Kore Savaşı sonrası Batı ittifakı."),
        ("Çok partili hayata geçişte 1946'nın önemi nedir?", "Tek parti döneminden çok partili seçimlere geçiş", ["Cumhuriyet ilanı", "AB üyeliği", "NATO kuruluşu Türkiye'de", "Halifeliğin kaldırılması"], "DP 1946'da kurulur, 1950'de iktidar."),
        ("1929 Dünya Ekonomik Buhranı'nın siyasi etkisi nedir?", "Devlet müdahalesi ve otoriter rejimlere zemin", ["Osmanlı'nın kuruluşu", "Malazgirt", "Tanzimat", "Tımarın icadı"], "Türkiye'de devletçilik güçlenir."),
        ("BM hangi yıl kurulur?", "1945", ["1919", "1949", "1952", "1991"], "San Francisco."),
        ("Varşova Paktı hangi yılda kurulur?", "1955", ["1949", "1952", "1961", "1991"], "NATO'ya karşı Doğu bloğu."),
        ("SSCB'nin dağılma yılı hangisidir?", "1991", ["1989 yalnızca Berlin", "1980", "2001", "1975"], "Soğuk savaşın sonu."),
        ("24 Ocak kararları neyi hedefler?", "İhracata dayalı serbestleşme ve istikrar", ["Tımarı geri getirmek", "Kapitülasyon", "Halifelik", "Tekke açmak"], "1980 ekonomi programı."),
        ("Gümrük Birliği Türkiye-AB için hangi yıldır?", "1996", ["1963", "1987", "1999", "2005"], "1/95 sayılı karar uygulaması."),
        ("1974 Kıbrıs Barış Harekâtı'nın gerekçesi nedir?", "Ada Türklerinin güvenliği ve garantörlük", ["NATO'dan çıkmak", "AB üyeliği", "Varşova Paktı", "Sevr'i uygulamak"], "Garantörlük antlaşmaları çerçevesi."),
        ("1961 Anayasası'nın belirgin özelliği nedir?", "Kuvvetler ayrılığı ve sosyal hakların genişlemesi", ["Meclis hükümeti", "Yumuşak kısa anayasa", "Saltanat", "Hilafet"], "1960 sonrası kurucu meclis."),
        ("11 Eylül 2001 sonrası gündem neye kayar?", "Uluslararası terör ve güvenlik", ["Yalnızca tarım reformu", "Tımar", "Devşirme", "Lonca"], "Küresel güvenlik paradigması."),
        ("I. Dünya Savaşı'nı bitiren düzende Wilson ilkelerinin vaadi nedir?", "Ulusların kendi kaderini tayini söylemi", ["Osmanlı'yı büyütmek", "Tımarı yaymak", "Halifeliği evrensel kılmak", "Kapitülasyonu artırmak"], "Pratikte mandalar çelişir."),
    ])

add("AGS Türkiye Coğrafyası", "ags_cografya", "Fiziki Coğrafya",
    sl("YER ŞEKİLLERİ", "blue", [
        "Türkiye **Alp-Himalaya** kuşağında genç ve **deprem** riski yüksek bir arazidir.",
        "**Kuzey Anadolu** ve **Doğu Anadolu** fayları başlıca tektonik hatlardır.",
        "**Toroslar** ve **Kuzey Anadolu Dağları** kıyı ile iç kesimi ayırır; kıyıya paralel dağlar nemi içeride keser.",
        "**İç Anadolu** plato ve ovaları karasal; **Doğu Anadolu** ortalama yükseltisi en fazladır.",
        "**Çöküntü ovaları** (Gediz, Büyük Menderes, Adana) tarım ve yerleşme yoğunluğunu çeker.",
    ], "Dağlar kıyıya paralel ise boyuna kıyı, dik ise enine kıyı tipi oluşur."),
    sl("İKLİM SU TOPRAK BİTKİ", "violet", [
        "**Akdeniz** kışı ılık yağışlı, yazı sıcak kurak; **Karadeniz** her mevsim yağışlıdır.",
        "**Karasal** iç ve doğuda kış sert, yağış azdır.",
        "**Akarsular** rejimleri iklime bağlıdır; Karadeniz düzenli, Akdeniz düzensizdir.",
        "**Kahverengi orman, kırmızı Akdeniz, çernezyom, tuzlu** topraklar iklimle eşleşir.",
        "**Bitki örtüsü**: Karadeniz orman, Akdeniz maki, İç Anadolu bozkır, yükseklerde alpin çayır.",
    ], None),
    sl("DOĞAL AFETLER", "emerald", [
        "**Deprem** birincil risktir; **heyelan** Karadeniz'de eğim+yağış+killi zeminle sıktır.",
        "**Sel-taşkın** düzensiz rejim ve çarpık yerleşme ile artar.",
        "**Çığ** Doğu ve Karadeniz dağlık kesiminde; **orman yangını** Akdeniz-Ege yaz kuraklığında.",
        "**Erozyon** İç Anadolu'da bozkır ve yanlış sürümle yoğundur.",
        "**Volkanizma** Erciyes, Ağrı, Nemrut jeotermal kaynak üretir.",
    ], None),
    [
        ("Türkiye'nin ortalama yükseltisi en fazla olan bölgesi hangisidir?", "Doğu Anadolu", ["Marmara", "Ege", "Karadeniz kıyısı", "Çukurova"], "Doğu Anadolu çatıdır."),
        ("Kıyıya paralel dağların etkisi nedir?", "Nemli hava iç kesime zor geçer, kıyı bol yağış alır", ["Depremi sıfırlar", "Çöl iklimi zorunlu", "Fayları durdurur", "Volkan yaratır"], "Karadeniz ve Akdeniz boyuna kıyı."),
        ("Karadeniz ikliminin ayırt edici özelliği nedir?", "Her mevsim yağışlı olması", ["Yazın mutlak kuraklık", "Günlük elli derece", "Muson", "Çöl"], "Düzenli akarsu rejimi buna bağlıdır."),
        ("Heyelan Türkiye'de en çok nerede beklenir?", "Doğu ve Batı Karadeniz yamaçları", ["Tuz Gölü ovası", "Ceylanpınar ovası", "İç Anadolu düzlüğü", "Çukurova tabanı"], "Eğim, yağış, kil."),
        ("Maki hangi iklimin karakteristiğidir?", "Akdeniz", ["Tundra", "Muson zorunlu", "Ekvatoral", "Çöl"], "Kısa boylu çalı formasyonu."),
        ("Kuzey Anadolu Fayı neyi açıklar?", "Marmara'dan doğuya uzanan deprem kuşağını", ["Muson yağışını", "Okyanus akıntısını", "Kutup rüzgârını", "Mercan resifini"], "Sağ yanal atımlı fay."),
        ("Akdeniz akarsu rejimi nasıldır?", "Kışın yüksek, yazın düşük ve düzensiz", ["Yıl boyu eşit", "Yalnızca kar erimesi", "Hiç akmaz", "Tersine akar"], "Yaz kuraklığı."),
        ("İç Anadolu'nun doğal bitki örtüsü nedir?", "Bozkır", ["Ekvatoral orman", "Mangrov", "Tayga", "Maki zorunlu tümü"], "Yarı kurak step."),
        ("Çöküntü ovalarının tarımdaki rolü nedir?", "Alüvyal verim ve sulama imkânı", ["Çölleşme zorunluluğu", "Sıfır nüfus", "Volkanik kış", "Tundra"], "Ege-Akdeniz graben ovaları."),
        ("Erozyon İç Anadolu'da neden yoğundur?", "Bozkır, eğim ve yanlış tarım pratikleri", ["Yağmur ormanı", "Buzul örtüsü", "Gelgit", "Mercan"], "Rüzgar ve su erozyonu."),
        ("Orman yangını riski hangi bölgede yazın belirgindir?", "Akdeniz ve Ege", ["Kutup", "Tundra", "Buzul", "Muson ormanı"], "Yaz kuraklığı ve rüzgar."),
        ("Alp-Himalaya kuşağı Türkiye için ne anlama gelir?", "Genç oluşum, yükselti ve depremsellik", ["Eski kalkan kıta", "Buzul çağı başkenti", "Okyanusal rift", "Depremsizlik"], "Sıkışma tektoniği."),
    ])

add("AGS Türkiye Coğrafyası", "ags_cografya", "Beşerî ve Ekonomik Coğrafya",
    sl("NÜFUS YERLEŞME GÖÇ", "blue", [
        "Türkiye nüfusu **genç yetişkin** ağırlıklıdır; **doğurganlık** bölgesel fark gösterir (doğu-güneydoğu görece yüksek).",
        "**Kırdan kente göç** 1950 sonrası sanayi, hizmet ve eğitim çekimiyle hızlanır.",
        "Yerleşme: **kıyı ve graben ovaları** yoğun, **Doğu Anadolu yaylaları** seyrek.",
        "**Gecekondu/çarpık kentleşme** metropollerde hizmet ve afet riskini artırır.",
        "**Mevsimlik tarım ve inşaat göçü** geçici hareketliliktir; **dış göç** 1960'lar Avrupa işçiliği ile anılır.",
    ], "Nüfus yoğunluğu = kişi/km2; aritmetik yoğunluk fiziki taşıma kapasitesini tek başına göstermez."),
    sl("TARIM HAYVANCILIK MADEN ENERJİ", "violet", [
        "**Tahıllar** İç Anadolu; **pamuk** Ege-Çukurova-Güneydoğu; **çay-fındık** Doğu Karadeniz.",
        "**Zeytin-incir-üzüm** Ege-Akdeniz; **sera** kıyı Akdeniz'de.",
        "**Küçükbaş** İç-Doğu Anadolu; **büyükbaş** Karadeniz-Marmara nemli çayırlar.",
        "**Bor** rezervinde dünya önderliği; **kömür** Zonguldak taşkömürü, linyit termik santraller.",
        "**Hidroelektrik** Fırat-Dicle-Çoruh; **rüzgar-güneş** Ege-Marmara-Güneydoğu potansiyeli.",
    ], None),
    sl("SANAYİ ULAŞIM TİCARET TURİZM BÖLGE", "emerald", [
        "Sanayi **Marmara-Ege-Çukurova** üçgeninde yığılır; **OSB** mekânsal politikadır.",
        "Ulaşım: **İstanbul Boğazı, Çanakkale, İzmir** lojistik düğüm; **demiryolu** iç hatlarda sınırlı pay.",
        "Dış ticarette **İhracat** sanayi ürünü ağırlıklıdır; **enerji ithalatı** açığı belirler.",
        "Turizm **kıyı, kültür, inanç, kaplıca, kış** çeşitlenir; **İstanbul-Antalya-Kapadokya** marka.",
        "Bölgeler: **Marmara** sanayi-nüfus; **Karadeniz** dağınık kırsal; **Güneydoğu** GAP sulama-tarım.",
    ], None),
    [
        ("Türkiye'de nüfusun en yoğun bölgeleri genel olarak hangileridir?", "Marmara ve kıyı ovaları", ["Yalnızca Hakkari yaylaları", "Yalnızca Tuz Gölü çevresi zorunlu", "Kutup", "Çöl"], "Sanayi ve hizmet çekimi."),
        ("1950 sonrası kırdan kente göçün temel itici-çekici çifti nedir?", "Tarımda makineleşme ve kentte sanayi-hizmet", ["Tımar sistemi", "Devşirme", "Kapitülasyon", "Lonca yasağı"], "İtme-çekme modeli."),
        ("Çay ve fındığın karakter bölgesi hangisidir?", "Doğu Karadeniz", ["İç Anadolu", "Güneydoğu çölü", "Trakya bozkırı", "Van çanağı zorunlu"], "Yüksek nem ve yamaç."),
        ("Pamuk tarımı nerede yoğundur?", "Çukurova, Ege ve Harran ovası", ["Rize yaylası", "Kars yaylası", "Doğu Karadeniz kıyısı çaylık", "Kaçkar zirvesi"], "Yaz sıcaklığı ve sulama."),
        ("Bor madeninde Türkiye'nin konumu nedir?", "Dünya rezerv ve üretiminde önde gelen ülkelerdendir", ["Hiç yoku", "Yalnızca ithalatçı", "Kutup üreticisi", "Mercan madeni"], "Eskişehir-Kütahya-Balıkesir hattı."),
        ("Taşkömürü havzası klasik olarak nerededir?", "Zonguldak ve çevresi", ["Antalya kumu", "Rize çayı", "Konya ovası", "Van Gölü adası"], "Termik-demir-çelik tarihi."),
        ("GAP'ın coğrafi hedefi nedir?", "Fırat-Dicle havzasında sulama ve enerji", ["Karadeniz balıkçılığı", "Trakya linyiti", "Ege zeytini tek madde", "İstanbul metro"], "Bölgesel kalkınma projesi."),
        ("Sanayi yığılmasının asıl bölgesi hangisidir?", "Marmara", ["Hakkari", "Ardahan", "Şırnak kırsalı", "Artvin yaylası zorunlu"], "Pazar, liman, işgücü."),
        ("Enerji ithalatı Türkiye ekonomisinde neden kritiktir?", "Fosil yakıt açığı cari dengeyi etkiler", ["Hiç petrol kullanılmaz", "Nükleer tek kaynak 1950'den beri", "Rüzgar yasağı", "Hidro yok"], "Doğalgaz-petrol ithalatı."),
        ("Kıyı turizminin başlıca bölgesi hangisidir?", "Akdeniz ve Ege", ["Doğu Anadolu kışı tek", "İç Anadolu bozkırı zorunlu", "Karadeniz dağının kuzeyi tek", "Tuz Gölü"], "Deniz-kum-güneş."),
        ("Aritmetik nüfus yoğunluğu nasıl hesaplanır?", "Toplam nüfusun yüzölçümüne bölümü", ["Doğurganlık hızı", "Göçmen stoku", "GSYH", "İhracat"], "Kişi/km2."),
        ("OSB'lerin coğrafi işlevi nedir?", "Sanayiyi planlı mekânda toplamak", ["Tarımdan vazgeçmek zorunlu", "Turizmi yasaklamak", "Fay üretmek", "İklimi değiştirmek"], "Altyapı ve çevre denetimi."),
    ])
