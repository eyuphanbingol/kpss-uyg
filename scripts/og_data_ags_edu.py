# -*- coding: utf-8 -*-
"""AGS Egitim Bilimleri + Mevzuat 2026."""


def _t(ders, prefix, title, slides, facts):
    return {"ders": ders, "prefix": prefix, "title": title, "slides": slides, "facts": facts}


C = ["blue", "violet", "emerald"]


def topic(ders, prefix, title, heads, traps, bullets3, facts):
    slides = []
    for i in range(3):
        trap = traps[i] if i < len(traps) else None
        slides.append((heads[i], C[i], bullets3[i], trap))
    return _t(ders, prefix, title, slides, facts)


D, P = "AGS Eğitim Bilimleri", "ags_egitim"
TOPICS = [
    topic(D, P, "Eğitim Tarihi",
          ["TÜRK-İSLAM VE OSMANLI", "CUMHURİYET", "KURUMSAL KIRILMALAR"],
          ["Medrese ile mektebi aynı saymayın; Tevhid-i Tedrisat 1924'te birleştirir."],
          [
              [
                  "**Uygur** manastır-okul ve basım; **Karahanlı-Selçuklu** medrese (Nizamiye) ulema yetiştirir.",
                  "Osmanlı **sıbyan mektebi**, **medrese**, **Enderun**, **lonca-ahi** çıraklığı çok kanallı eğitimdir.",
                  "**Tanzimat** rüştiye-idadi-sultani ve **Maarif-i Umumiye Nizamnamesi (1869)** modern şemayı kurar.",
                  "**Darülfünun** yükseköğretimin geç Osmanlı çekirdeğidir.",
                  "**Islah-ı Medaris** tartışması medreseyi modernleştirmeye çalışır, sistem ikiliği sürer.",
              ],
              [
                  "**Tevhid-i Tedrisat 3 Mart 1924** tüm okulları Maarif Vekaletine bağlar.",
                  "**Harf İnkılabı 1928** ve **Millet Mektepleri** yetişkin okuryazarlığıdır.",
                  "**Köy Enstitüleri (1940)** karma, iş içinde eğitim, kırsal öğretmen ve üretimi hedefler.",
                  "**1973 1739** Millî Eğitim Temel Kanunu Cumhuriyet eğitiminin çerçeve kanunudur.",
                  "Yükseköğretimde **1933 üniversite reformu** Darülfünun'u İstanbul Üniversitesi'ne dönüştürür.",
              ],
              [
                  "**İlköğretim zorunluluğu** 1924'ten itibaren kademeli uzar; 1997 8 yıl, 2012 4+4+4.",
                  "**Yükseköğretim Kurulu (1981/1982)** üniversiteleri merkezi çerçeveye alır.",
                  "**Mesleki-teknik** Cumhuriyet sanayileşme politikasının parçasıdır.",
                  "Eğitim tarihi sorusu **kurum + yıl + işlev** üçlüsü ister.",
                  "Köy Enstitüsü ile **eğitmen kursunu** karıştırmayın; eğitmenler kısa süreli köy okuryazarlığıdır.",
              ],
          ],
          [
              ("Tevhid-i Tedrisat Kanunu hangi tarihtedir?", "3 Mart 1924", ["29 Ekim 1923", "1 Kasım 1928", "1940", "1973"], "Öğretim birliği."),
              ("Köy Enstitüleri hangi yılda yasalaşır?", "1940", ["1924", "1928", "1933", "1954"], "İş içinde eğitim modeli."),
              ("1869 Maarif-i Umumiye Nizamnamesi neyi düzenler?", "Modern okul kademeleri ve maarif örgütünü", ["Köy enstitüsünü", "YÖK'ü", "4+4+4'ü", "TYMM'yi"], "Osmanlı eğitim teşkilatı."),
              ("1933 üniversite reformu ne yapar?", "Darülfünun kapatılıp İstanbul Üniversitesi kurulur", ["YÖK kurulur", "Köy enstitüsü açılır", "Harf değişir", "Halifelik kalkar aynı gün"], "Yükseköğretim yenilenmesi."),
              ("Enderun'un işlevi nedir?", "Yönetici elit yetiştirmek", ["Sıbyan mektebi", "Lonca ustası", "Nizamiye müderrisi zorunlu", "Köy eğitmeni"], "Saray okulu."),
              ("Millet Mekteplerinin amacı nedir?", "Yeni harflerle yetişkin okuryazarlığı", ["Medrese çoğaltmak", "YÖK kurmak", "NATO eğitimi", "DHBT"], "1928 sonrası seferberlik."),
              ("1739 sayılı kanun neyin çerçevesidir?", "Millî eğitimin amaç ve ilkeleri", ["Anayasa'nın tümü", "Borçlar Kanunu", "TCK", "İcra iflas"], "1973 METK."),
              ("1997'de zorunlu eğitim kaç yıla çıkar?", "8", ["5", "12", "4", "3"], "Kesintisiz ilköğretim."),
              ("2012 4+4+4 düzeni neyi getirir?", "12 yıllık kademeli zorunlu eğitimi", ["Medrese dönüşü", "Enderun", "Tımar", "Sıbyan"], "İlkokul-ortaokul-lise."),
              ("Nizamiye medreseleri hangi döneme aittir?", "Selçuklu", ["Cumhuriyet 1940", "YÖK 1981", "Tanzimat 1839", "AB süreci"], "Nizamülmülk."),
              ("Sıbyan mektebi ne düzeyidir?", "Mahalle düzeyinde temel dinî-okuma eğitimi", ["Üniversite", "YÖK", "Enstitü", "OSB"], "Osmanlı ilk basamak."),
              ("Eğitmen ile köy enstitüsü mezunu farkı nedir?", "Eğitmen kısa kurslu; enstitü uzun süreli iş-okul modelidir", ["İkisi aynıdır", "Eğitmen YÖK mezunudur", "Enstitü 1869'dadır", "Eğitmen 2012'dir"], "Süre ve program farkı."),
          ]),
    topic(D, P, "Eğitimin Felsefi Temelleri",
          ["KLASİK AKIMLAR", "EĞİTİM FELSEFELERİ", "TÜRKİYE YANSIMASI"],
          ["İdealizm 'fikir gerçek', realizm 'nesne gerçek'; ikisini ters ezberlemeyin."],
          [
              [
                  "**İdealizm** (Platon): gerçek idea aleminde; eğitim ahlak ve evrensel doğruya yönelir.",
                  "**Realizm** (Aristoteles): gerçek nesnede; eğitim akıl, bilim ve müfredat disiplinidir.",
                  "**Pragmatizm** (Dewey): gerçek işe yarayandır; okul yaşantı ve problem çözmedir.",
                  "**Varoluşçuluk**: birey seçer; eğitim özgürlük, sorumluluk ve özgünlüktür.",
                  "**Natüralizm** (Rousseau): çocuk doğası iyidir; olumsuz eğitim, yaşama göre kademe.",
              ],
              [
                  "**Daimicilik (perennialism)**: evrensel klasik eserler, değişmeyen gerçek.",
                  "**Esasicilik (essentialism)**: temel beceri ve kültür aktarımı, öğretmen merkezli.",
                  "**İlerlemecilik (progressivism)**: öğrenci, yaşantı, proje, demokratik sınıf.",
                  "**Yeniden kurmacılık (reconstructionism)**: toplumun sorunlarını okulda çözmek, sosyal değişme.",
                  "**İnşacılık** bilgiyi öğrenenin yapılandırmasıdır; felsefi kök pragmatizm-piaget-vygotsky hattındadır.",
              ],
              [
                  "Cumhuriyet eğitiminde **pozitivist-laik** damar esasicilik+ilerlemeci uygulamaları birlikte taşır.",
                  "**Köy Enstitüsü** iş içinde öğrenme ile ilerlemeci-yeniden kurmacı izler taşır.",
                  "**TYMM** yetkinlik, erdem-değer-eylem ile hem esas hem ilerlemeci ögeleri harmanlar.",
                  "Sınavda 'hangi felsefenin uygulaması' = **öğretmen rolü + program + değerlendirme**.",
                  "Daimicilikte program **büyük kitaplar**; ilerlemecilikte **ilgi ve ihtiyaç**.",
              ],
          ],
          [
              ("Dewey hangi akımla anılır?", "Pragmatizm / ilerlemecilik", ["Daimicilik", "Skolastik", "Fatalizm", "Pozitivizm karşıtı zorunlu mistisizm"], "Okul hayattır."),
              ("Esasiciliğin program anlayışı nedir?", "Temel bilgi ve becerilerin öğretmen merkezli aktarımı", ["Çocuğun tamamen serbest bırakılması", "Yalnızca toplumsal devrim", "Büyük kitaplar tek", "Varoluşçu kaygı"], "Core curriculum."),
              ("Daimicilik neyi merkeze alır?", "Zamansız klasik eserler ve evrensel gerçek", ["Günlük proje tek", "İş eğitim tek", "Test tekniği", "Oyun tek"], "Perennial classics."),
              ("Yeniden kurmacılığın amacı nedir?", "Toplumsal sorunları eğitimle dönüştürmek", ["Ezberi artırmak", "Okulu kapatmak", "Yalnızca Latin", "Tımarı öğretmek"], "Social reconstruction."),
              ("Rousseau'nun doğal eğitiminde çocuk nasıl görülür?", "Doğası iyi, olumsuz eğitimle korunmalı", ["Boş levha yalnızca Locke", "Kötü doğa Hobbes tek", "Idea Platon tek", "İşçi Marks tek"], "Emile."),
              ("Varoluşçu eğitimde vurgu nedir?", "Özgür seçim ve sorumluluk", ["Tek tip müfredat", "Kolektif ezber", "Devletçilik ilkesi", "Tımar"], "Özgün birey."),
              ("İdealizmde öğretmenin rolü nasıldır?", "Ahlaki model ve idea rehberi", ["Yalnızca kolaylaştırıcı Dewey", "Yok", "Teknikçi davranışçı tek", "Test puanı"], "Platonik eğitim."),
              ("Realist eğitimde bilgi nedir?", "Nesnel evrende keşfedilir", ["Yalnızca işe yararsa gerçek", "Yalnızca idea", "Yalnızca duygu", "Yalnızca oy"], "Aristotelesçi bilim."),
              ("İlerlemeci sınıfta değerlendirme nasıl olmalıdır?", "Süreç, ürün ve öz değerlendirme ağırlıklı", ["Tek çoktan seçmeli zorunlu", "Cezaya dayalı", "Yalnızca sıralama", "Kura"], "Formatif."),
              ("Yapılandırmacılıkta bilgi nasıl oluşur?", "Öğrenen önceki şemalarıyla anlamı inşa eder", ["Pasif depolama", "Yalnızca pekiştireç", "Kalıtım tek", "Kopyalama"], "Piaget-Vygotsky."),
              ("Köy Enstitüleri hangi felsefi izleğe yakındır?", "İlerlemeci ve iş içinde öğrenme", ["Daimici büyük kitap tek", "Skolastik", "Varoluşçu kaygı tek", "Natüralizm Rousseau birebir"], "İş-eğitim-üretim."),
              ("'Okul hayattır' sözü kimin yaklaşımını özetler?", "John Dewey", ["Platon", "Aristoteles", "Eflatun'un mağarası tek", "Kant'ın kategorik buyruğu tek"], "Pragmatist eğitim."),
          ]),
    topic(D, P, "Eğitimin Toplumsal Temelleri",
          ["İŞLEVLER", "TABAKA VE EŞİTLİK", "KÜLTÜR"],
          ["Gizli müfredat resmi programda yazılmaz; okulun örtük sosyalleştirme etkisidir."],
          [
              ["Eğitimin **açık işlevi** bilgi ve diploma; **gizli işlevi** itaat, zaman, rekabet alışkanlığıdır.",
               "**Sosyalleşme** kültürü yeni kuşağa aktarır; **sosyal hareketlilik** diploma ile tabaka değiştirebilir.",
               "**Seçme-yerleştirme** okulu toplumsal işbölümüne eleman ayırır.",
               "**Yenilik** (inovasyon) işlevi araştırma ve değişim üretir.",
               "Çatışmacı bakış okulu **eşitsizliği yeniden üreten** aygıt görür (Bourdieu kültürel sermaye)."],
              ["**Fırsat eşitliği** girişte aynı hak; **imkân eşitliği** süreçte kaynak; **sonuç eşitliği** çıktıda dengeleme tartışmasıdır.",
               "**Kapsayıcı eğitim** dezavantajı okulda tutar; dışlama gizli müfredatla da olur.",
               "**Toplumsal cinsiyet** kalıpları ders kitabı ve öğretmen beklentisinde ürer.",
               "**Aile sosyoekonomik düzeyi** başarı farkının güçlü yordayıcısıdır.",
               "Okul **toplumun hem aynası hem mayasıdır**: yansıtır ve değiştirebilir."],
              ["**Kültürleme** doğuştan kültürleşme; **kültürleşme** başka kültürle temas; **kültürel yayılma** ödünçlemedir.",
               "**Çokkültürlülük** farkı zenginlik sayar; asimilasyon eritir.",
               "**Değerler eğitimi** örtük ve açık programda yürür.",
               "Türk milli eğitiminde **Atatürkçülük ve milli kültür** 1739'un ilkelerindendir.",
               "Sınavda toplumsal temel = **işlev + eşitsizlik + kültür kavramı**."],
          ],
          [
              ("Gizli müfredat nedir?", "Resmi programda yazmayan örtük sosyalleşme mesajları", ["Haftalık ders çizelgesi", "MEB tebliği", "TYMM belgesi", "Kanun maddesi"], "Zaman, itaat, rekabet."),
              ("Kültürel sermaye kavramı kime bağlanır?", "Pierre Bourdieu", ["Dewey", "Pavlov", "Skinner", "Bloom yalnızca"], "Habitus ve okul başarısı."),
              ("Fırsat eşitliği neyi ifade eder?", "Girişte ayrımcılık yapılmaması", ["Herkesin aynı notu alması", "Okulun kapatılması", "Ezber", "Tımar"], "Hak eşitliği."),
              ("Eğitimin seçme işlevi nedir?", "Bireyleri toplumsal konum ve mesleklere ayırmak", ["Yalnızca oyun", "Yalnızca spor", "Yalnızca gezi", "Yalnızca yemek"], "Stratifikasyon."),
              ("Kapsayıcı eğitim neyi hedefler?", "Dezavantajlı öğrencinin genel okulda destekle bulunması", ["Ayrı okul zorunluluğu herkes için", "Dışlama", "Yalnızca yatılı elit", "Sınavı kaldırmak tek"], "Inclusion."),
              ("Kültürleme nedir?", "İçine doğulan kültürü edinme", ["Başka kültürü zorla silmek", "Yalnızca göç", "Yalnızca turizm", "Yalnızca diplomasi"], "Enculturation."),
              ("Kültürleşme nedir?", "Farklı kültürle etkileşim sonucu değişim", ["Doğuştan tek kültür", "Genetik aktarım", "Tımar", "Kapitülasyon"], "Acculturation."),
              ("Çatışmacı kuram okulu nasıl görür?", "Eşitsizliği yeniden üretebilen kurum", ["Tam tarafsız araç", "Yalnızca hayırseverlik", "Doğa olayı", "Tesadüf"], "Yeniden üretim."),
              ("Sosyal hareketlilikte diplomanın rolü nedir?", "Yukarı hareket için kanal olabilir", ["Hareketi imkânsız kılar her zaman", "Genetiği değiştirir", "İklimi değiştirir", "Fay üretir"], "Meritookrasi tartışması."),
              ("Toplumsal cinsiyet kalıbı okulda nasıl ürer?", "Kitap, dil, öğretmen beklentisi ve branş yönlendirmesi", ["Yalnızca genetik", "Yalnızca iklim", "Yalnızca fay", "Yalnızca nüfus yoğunluğu"], "Örtük program."),
              ("Açık işlev örneği hangisidir?", "Okuma-yazma ve meslek bilgisi kazandırmak", ["Sıraya girme alışkanlığı tek", "Sessizlik normu tek", "Not kaygısı tek", "Kıyafet baskısı tek"], "Resmi amaç."),
              ("1739 milli kültür ilkesinin toplumsal temeli nedir?", "Kültürel aktarım ve aidiyet", ["Kapitülasyon", "Tımar", "Devşirme", "Lonca yasağı"], "Toplumsal bütünleşme."),
          ]),
]
