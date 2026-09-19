# -*- coding: utf-8 -*-
"""Build sorular/cografya-27.js — Coğrafya Genel Tekrar questions (1–26 kapsam)."""
from pathlib import Path
import json
import re


def Q(question, options, correct, explanation):
    assert 0 <= correct < 5, (question, correct)
    assert len(options) == 5, (question, len(options))
    for o in options:
        assert o and str(o).strip(), (question, "empty option")
    opts = []
    for i, o in enumerate(options):
        letter = "ABCDE"[i]
        if o.startswith(letter + ")") or o.startswith(letter + " )"):
            opts.append(o)
        else:
            opts.append(f"{letter}) {o}")
    return {
        "question": question,
        "options": opts,
        "correctAnswerIndex": correct,
        "explanation": explanation,
    }


qs = []

# =============================================================================
# 1 — Türkiye'nin Coğrafi Konumu (yoğun)
# =============================================================================
qs += [
Q("Türkiye’nin matematik konumu için hangisi doğrudur?",
  ["36°–42° K enlemleri ile 26°–45° D boylamları arasındadır",
   "20°–36° K enlemleri arasındadır",
   "Tamamı Güney Yarımküre’dedir",
   "Boylam aralığı 10°–20° D’dir",
   "Ekvator üzerinde yer alır"], 0,
  "Klasik KPSS bilgisi: 36–42 K / 26–45 D."),
Q("Aynı enlemdeki iki merkezde sıcaklıklar belirgin farklıysa temel neden genelde hangisidir?",
  ["Matematik konum", "Özel konum (yükselti, denizellik, bakı vb.)",
   "Boylam farkı", "Saat dilimi", "Jeoid şekli"], 1,
  "Aynı enlem → enlem etkisi aynıdır; fark özel konumdan gelir."),
Q("Kuzey–güney doğrultusunda sıcaklık farkı öncelikle hangi faktörle açıklanır?",
  ["Boylam", "Enlem", "Bakı", "Denizellik", "Kıtasal konum"], 1,
  "K–G kıyas = enlem."),
Q("Karadeniz Dağları’nda kışın kuzey yamaçların güney yamaçlardan daha ılık olması hangisiyle bağdaşır?",
  ["Klasik bakı kuralının bozulması (ters olay / nem–bulut)", "Enlemin artması",
   "Boylamın azalması", "Fiyort oluşumu", "Delta oluşumu"], 0,
  "Karadeniz’de bakı–sıcaklık ilişkisi klasik kurala uymayabilir (ters olay)."),
Q("İki merkez arasındaki yerel saat farkı nasıl bulunur?",
  ["Enlem farkı × 4 dakika", "Boylam farkı × 4 dakika",
   "Yükselti farkı × 4", "Uzaklık (km) ÷ 4", "Boylam farkı × 15 dakika"], 1,
  "Ardışık boylamlar ≈ 4 dk; fark = boylam farkı × 4."),
Q("Aynı enlemde İzmir’in Van’dan daha sıcak olmasının temel nedeni hangisidir?",
  ["Boylam", "Yükselti", "Enlem", "Fay hatları", "Karstik yapı"], 1,
  "Van daha yüksektir → özel konum (yükselti)."),
Q("Yazın Şanlıurfa’nın aynı enlemdeki Antalya’dan daha sıcak olması öncelikle neye bağlanır?",
  ["Enlem", "Karasallık", "Bakı", "Buzullaşma", "Ria kıyı"], 1,
  "Karasal iç kesim yazın daha çok ısınır."),
]

# =============================================================================
# 2 — İç Kuvvetler
# =============================================================================
qs += [
Q("Kırılma sonucu yüksekte kalan yerlere ne ad verilir?",
  ["Graben", "Horst", "Delta", "Morén", "Obruk"], 1,
  "Horst = yüksekte kalan; graben = çöküntü."),
Q("Horst–graben sistemi ülkemizde en yaygın olarak nerede görülür?",
  ["Doğu Karadeniz", "Batı Anadolu (Ege)", "İç Anadolu ovaları", "Trakya platosu", "GAP ovaları"], 1,
  "Ege kırıklı yapı / BAF."),
Q("Kuzey Anadolu Fayı (KAF) ile Doğu Anadolu Fayı (DAF) hangi merkez çevresinde birleşir?",
  ["İstanbul", "Bingöl–Karlıova", "Antalya", "İzmir", "Ankara"], 1,
  "KAF ve DAF Karlıova’da kesişir."),
]

# =============================================================================
# 3 — Dış Kuvvetler
# =============================================================================
qs += [
Q("Türkiye’de en yaygın dış kuvvet hangisidir?",
  ["Buzul", "Rüzgâr", "Akarsu", "Dalga", "Karst"], 2,
  "Akarsular Türkiye’de en etkili dış kuvvettir."),
Q("Kimyasal çözünmenin en etkili olduğu yerler genelde hangisidir?",
  ["Kurak ve soğuk yüksek yaylalar", "Sıcak–nemli alanlar",
   "Buzul zirveleri", "Çöl çekirdekleri", "Kutuplar"], 1,
  "Sıcak + nem → kimyasal çözünme hızlanır."),
]

# =============================================================================
# 4 — Platolar
# =============================================================================
qs += [
Q("Türkiye’de platoların geniş yer kaplaması hangi sürecin kanıtı olarak gösterilir?",
  ["Yalnızca buzullaşma", "Kuvaterner’de toptan yükselme (epirojenez)",
   "Delta birikimi", "Lagün oluşumu", "Fiyort oluşumu"], 1,
  "Plato yaygınlığı = toptan yükselme kanıtı."),
Q("Türkiye’nin en yüksek platoları hangi kökene aittir?",
  ["Karstik (Taşeli)", "Volkanik (Erzurum–Kars çevresi)",
   "Aşınım (Çatalca–Kocaeli)", "Delta", "Dalga aşındırması"], 1,
  "Erzurum–Kars volkanik platoları en yüksektir."),
]

# =============================================================================
# 5 — Ovalar
# =============================================================================
qs += [
Q("Delta ovası oluşabilmesi için hangisi gerekli değildir?",
  ["Bol alüvyon", "Sakin deniz / gelgit azlığı",
   "Kıyıda dik falez", "Akarsuyun denize dökülmesi", "Biriktirme alanı"], 2,
  "Falez varsa delta oluşmaz; notlardaki klasik kural."),
Q("Tektonik (çöküntü) ovalarına örnek hangisidir?",
  ["Çarşamba Deltası", "Gediz / Büyük Menderes graben ovaları",
   "Bafra Deltası", "Dalga birikim seti", "Morén ovası"], 1,
  "Ege graben ovaları tektonik kökenlidir."),
]

# =============================================================================
# 6 — Akarsu Vadileri ve Şelaleler
# =============================================================================
qs += [
Q("Türkiye akarsularının genel özelliği hangisidir?",
  ["Rejimleri düzenlidir", "Engebenin fazla olması nedeniyle hidroelektrik potansiyelleri yüksektir",
   "Hepsi denize dökülür", "Hiçbiri baraj yapılamaz", "Tümü boyuna (kıyıya paralel) akar"], 1,
  "Eğim/engebe → HES potansiyeli."),
Q("Akarsu aşındırmasıyla oluşan “V” şekilli vadi için hangisi doğrudur?",
  ["Olgunluk döneminde yaygındır", "Gençlik döneminde dik yamaçlıdır",
   "Yalnızca buzul vadisidir", "U şeklindedir", "Karstiktir"], 1,
  "Genç vadi = V; buzul = U."),
]

# =============================================================================
# 7 — Rüzgâr Şekilleri
# =============================================================================
qs += [
Q("Türkiye’de rüzgâr aşındırma–biriktirme şekillerinin daha belirgin olduğu yerler hangisidir?",
  ["Doğu Karadeniz kıyısı", "Kurak–yarı kurak iç bölgeler",
   "Akdeniz’in her yeri", "Marmara’nın tamamı", "Buzul zirveleri"], 1,
  "Bitki örtüsü seyrek + kuraklık → rüzgâr etkili."),
Q("Barkan (hilal biçimli kumulu) için hangisi doğrudur?",
  ["Nemli ormanlarda oluşur", "Kurak alanlarda rüzgâr biriktirmesiyle oluşur",
   "Buzul aşındırmasıdır", "Dalga aşındırmasıdır", "Karstiktir"], 1,
  "Barkan = çöl/kurak kumulu."),
]

# =============================================================================
# 8 — Buzul Şekilleri
# =============================================================================
qs += [
Q("Türkiye’de deniz seviyesinde buzul şekillerinin görülmemesinin temel nedeni hangisidir?",
  ["Özel konum", "Orta Kuşak’ta (matematik konum) yer alması",
   "Fay hatları", "GAP", "Boylam"], 1,
  "Orta Kuşak → deniz seviyesinde buzul yok; yükseklerde özel konumla var."),
Q("Sirk gölü nasıl oluşur?",
  ["Delta birikimiyle", "Buzul aşındırmasıyla oluşan çukurun suyla dolmasıyla",
   "Lagün kapanmasıyla", "Obruk çökmesiyle", "Volkanik kraterle her zaman"], 1,
  "Sirk → buzul çukuru + su."),
]

# =============================================================================
# 9 — Karstik Şekiller
# =============================================================================
qs += [
Q("Karstik şekillerin yaygın olduğu ana kaya hangisidir?",
  ["Granit", "Kalker (kireçtaşı)", "Bazalt", "Kumtaşı yalnız", "Kil"], 1,
  "Kalker çözünmesi → karst."),
Q("Pamukkale hangi karstik/kimyasal birikim şekliyle anılır?",
  ["Obruk", "Traverten", "Lapya", "Doline", "Polye"], 1,
  "Pamukkale = traverten."),
]

# =============================================================================
# 10 — Kıyı Şekilleri
# =============================================================================
qs += [
Q("Türkiye kıyılarında fiyort tipinin görülmemesinin nedeni hangisidir?",
  ["Ege kırıklıdır", "Buzul aşındırmasıyla oluşmuş derin körfezler (fiyort) Türkiye’de yoktur",
   "Karadeniz’de delta çoktur", "Akdeniz’de falez yoktur", "Marmara kapalıdır"], 1,
  "Fiyort = buzul kökenli; TR’de klasik fiyort yok."),
Q("Ege kıyılarının girintili–çıkıntılı ve limanlaşmaya elverişli olmasının temel nedeni hangisidir?",
  ["Dağların kıyıya paralel uzanması", "Horst–graben (kırıklı) yapı; dağların kıyıya dik/uzanım etkisi",
   "Buzullaşma", "Yalnızca rüzgâr", "Karstik obruklar"], 1,
  "Ege kırıklı kıyı / graben körfezleri."),
Q("Bir kıyıda delta ovası varsa hangisi kesin söylenemez?",
  ["Alüvyon birikmiştir", "Kıyı görece sığ/birikim alanıdır",
   "Aynı yerde dik falez de vardır", "Akarsu denize ulaşmıştır", "Biriktirme olmuştur"], 2,
  "Delta + falez bir arada olmaz."),
]

# =============================================================================
# 11 — Harita Bilgisi ve Engebe
# =============================================================================
qs += [
Q("İzohipsler birbirine yaklaştıkça ne artar?",
  ["Sıcaklık", "Eğim", "Yağış her zaman", "Nüfus", "Nem"], 1,
  "Sık izohips = dik/eğimli yer."),
Q("Haritada bir noktanın yükseltisi nasıl okunur?",
  ["Boylamdan", "İzohips değerinden", "Ölçekten yalnız", "Lejandan yalnız renk adından", "Kuzey okundan"], 1,
  "İzohips = eşit yükselti eğrisi."),
]

# =============================================================================
# 12 — İklim (yoğun)
# =============================================================================
qs += [
Q("Türkiye’de Ocak ayında en soğuk yerler genelde hangisidir?",
  ["Antalya–Mersin", "Erzurum–Kars (kuzeydoğu)", "İzmir–Aydın", "Adana–Hatay", "Zonguldak–Bartın"], 1,
  "Klasik: Ocak en soğuk Erzurum–Kars."),
Q("Gerçek sıcaklık ile indirgenmiş sıcaklık farkı neyi gösterir?",
  ["Yalnızca enlemi", "Yükseltinin sıcaklık üzerindeki etkisini (deniz seviyesine indirgeme)",
   "Boylamı", "Yağış rejimini", "Rüzgâr yönünü"], 1,
  "İndirgeme = yükselti etkisini ayıklamak."),
Q("Bağıl nemin en yüksek olduğu bölge genelde hangisidir?",
  ["İç Anadolu", "Karadeniz", "Güneydoğu Anadolu", "Doğu Anadolu’nun tamamı", "Trakya’nın içi"], 1,
  "Bağıl nem (yağış ihtimali) Karadeniz’de yüksektir."),
Q("Mutlak nemin deniz kıyılarında (özellikle Akdeniz) yüksek olmasının nedeni hangisidir?",
  ["Sıcak havanın daha fazla nem tutabilmesi", "Yükseltinin fazla olması",
   "Karasallık", "Buzul", "Fay"], 0,
  "Sıcak hava → mutlak nem kapasitesi yüksek."),
Q("Akdeniz ikliminin Karadeniz ikliminden ayırt edici özelliği hangisidir?",
  ["Her mevsim yağış", "Belirgin yaz kuraklığı", "Yazların serin ve yağışlı olması",
   "Yıllık sıcaklık farkının çok az olması", "Föhnün hiç görülmemesi"], 1,
  "Akdeniz = yaz kurak; Karadeniz’de yazlar da yağışlı."),
Q("Sert karasal (Erzurum–Kars) ikliminin görüldüğü iller notlara göre hangileridir?",
  ["İzmir–Manisa–Aydın", "Erzurum–Kars–Ardahan", "Antalya–Muğla–Mersin",
   "Edirne–Tekirdağ–Kırklareli", "Gaziantep–Kilis–Adıyaman"], 1,
  "Sadece Erzurum, Kars, Ardahan."),
Q("Yamaç yağışlarının belirgin olduğu bölgeler hangileridir?",
  ["Yalnızca İç Anadolu", "Dağların kıyıya paralel uzandığı Karadeniz ve Akdeniz",
   "Yalnızca GAP", "Yalnızca Trakya", "Çöller"], 1,
  "Kıyıya paralel dağlar → yamaç yağışı."),
Q("Aşağıdaki iklim–bitki/ürün bağlarından hangisi doğrudur?",
  ["Akdeniz’de çay", "Karadeniz’de muz (geniş alan)", "Akdeniz’de muz (mikro klima / Anamur)",
   "İç Anadolu’da çay", "Erzurum’da zeytin"], 2,
  "Muz Akdeniz mikro klimasında; çay Doğu Karadeniz."),
]

# =============================================================================
# 13 — Su, Toprak, Bitki
# =============================================================================
qs += [
Q("Türkiye’de ormanların en yoğun olduğu bölge hangisidir?",
  ["İç Anadolu", "Güneydoğu Anadolu", "Karadeniz", "Doğu Anadolu’nun tamamı", "Trakya içi"], 2,
  "Nem + yağış → Karadeniz ormanları."),
Q("Türkiye akarsularında rejim düzensizliğinin temel nedeni hangisidir?",
  ["Yağışın mevsimsel düzensizliği ve kar erimesi etkisi", "Boylam",
   "Saat dilimi", "Harita ölçeği", "FIR hattı"], 0,
  "İklim + kar erimesi → düzensiz rejim."),
]

# =============================================================================
# 14 — Çevre ve Doğal Afetler
# =============================================================================
qs += [
Q("Türkiye’de can ve mal kaybı açısından en yıkıcı doğal afet genelde hangisidir?",
  ["Çığ", "Deprem", "Dolu", "Sis", "Kırç"], 1,
  "Deprem = en yıkıcı."),
Q("Heyelan riskinin yüksek olduğu bölge hangisidir?",
  ["İç Anadolu’nun kurak ovaları", "Doğu Karadeniz (eğim + yağış + kil)",
   "GAP’ın düz ovaları", "Çatalca Platosu", "Ergene"], 1,
  "Doğu Karadeniz heyelan klasiktir."),
]

# =============================================================================
# 15 — Beşeri Coğrafya (yoğun)
# =============================================================================
qs += [
Q("Cumhuriyet’in ilk nüfus sayımı hangi yıldadır?",
  ["1831", "1927", "1935", "1950", "1960"], 1,
  "1927; önceki sayım olmadığı için artış hızı hesaplanamaz."),
Q("Doğal nüfus artışının yüksek olduğu yerler genelde hangisidir?",
  ["Gelişmiş batı metropolleri", "Doğu ve Güneydoğu (doğum fazla)",
   "Yalnızca kıyı turizm alanları", "Yalnızca sanayi bölgeleri", "Yalnızca plato alanları"], 1,
  "3D = doğal artış → Doğu’da fazla."),
Q("Gerçek nüfus artışının yüksek olması genelde neyi gösterir?",
  ["Yalnızca doğum fazlalığı", "Göç alma (gelişmişlik / çekicilik)",
   "Yalnızca ölüm azlığı", "Yalnızca kır nüfusu", "Yalnızca yaşlı nüfus"], 1,
  "3G = gerçek artış → göç alır."),
Q("Türkiye’de nüfusun en yoğun olduğu kuşak hangisidir?",
  ["Doğu Anadolu’nun tamamı", "İstanbul–Bursa ve batı kıyı/sanayi kuşakları",
   "Yalnızca Erzurum–Kars", "Yalnızca İç Anadolu stepı", "Yalnızca Toroslar"], 1,
  "Sanayi–ticaret–ulaşım → batı yoğunluğu."),
Q("Yaş bağımlılık oranında paydada yer alan grup hangisidir?",
  ["0–14 + 65+", "15–64 (çalışma çağındaki nüfus)", "Yalnızca 65+", "Yalnızca 0–14", "Tüm nüfus"], 1,
  "Bağımlılık = (0–14+65+) / 15–64."),
Q("Ortanca yaşın yükselmesi ne anlama gelir?",
  ["Nüfus gençleşiyor", "Doğumlar azalıyor / yaşam süresi uzuyor; nüfus yaşlanıyor",
   "Göç duruyor", "Enlem değişiyor", "Yağış artıyor"], 1,
  "Ortanca yaş ↑ = yaşlanma eğilimi."),
Q("Kırdan kente göçün sonuçları arasında hangisi vardır?",
  ["Kırsalda nüfus artar", "Kentlerde gecekondu/altyapı baskısı artabilir",
   "Tarım işgücü artar", "Doğumlar her yerde artar", "Sanayi geriler"], 1,
  "Kentlere baskı + kırda işgücü azalması."),
]

# =============================================================================
# 16 — Yerleşim
# =============================================================================
qs += [
Q("Türkiye’de kırsal yerleşme tipinin dağınık olduğu yerler genelde hangisidir?",
  ["İç Anadolu düzlükleri", "Doğu Karadeniz (eğim, yağış, arazi parçalılığı)",
   "GAP ovalarının tamamı", "Ergene Ovası", "Konya Ovası"], 1,
  "Doğu Karadeniz = dağınık yerleşme."),
Q("Toplu (küme) kırsal yerleşme hangi koşullarda yaygındır?",
  ["Su kaynaklarının sınırlı olduğu düz/az engebeli alanlarda", "Her zaman dağlık ormanlarda",
   "Yalnızca falez kıyılarında", "Yalnızca buzul vadilerinde", "Yalnızca fiyortlarda"], 0,
  "Su + düz arazi → toplu yerleşme."),
]

# =============================================================================
# 17 — Ekonomi Politikaları
# =============================================================================
qs += [
Q("1923 İzmir İktisat Kongresi’nin ruhu hangisine yakındır?",
  ["Tam devletçilik", "Özel girişim ve millî ekonomi hedefleri",
   "Yalnızca tarım kapanması", "Yalnızca petrol ithali", "Yalnızca turizm"], 1,
  "Erken dönem: millî burjuvazi / özel teşebbüs vurgusu."),
Q("1930’larda uygulanan ekonomi politikası hangisidir?",
  ["Liberalizm yalnız", "Devletçilik", "Tam serbest piyasa", "Yalnızca ithalat", "Yalnızca hayvancılık"], 1,
  "Dünya buhranı sonrası devletçilik."),
]

# =============================================================================
# 18–19 — Tarım (yoğun)
# =============================================================================
qs += [
Q("Ekstansif tarımın temel özelliği hangisidir?",
  ["Birim alandan yüksek verim + yoğun girdi", "Geniş alan, düşük girdi/verim; nadas yaygın olabilir",
   "Yalnızca sera", "Yalnızca organik", "Yalnızca çay"], 1,
  "Ekstansif = geniş alan / düşük yoğunluk."),
Q("Nadasın azalmasına katkı sağlayan projeler notlara göre hangileridir?",
  ["Yalnızca turizm", "GAP ve KOP (sulama)", "Yalnızca HES", "Yalnızca maden", "Yalnızca liman"], 1,
  "Sulama → nadas azalır."),
Q("Çay üretiminin yoğunlaştığı yer hangisidir?",
  ["İç Anadolu", "Doğu Karadeniz kıyı kuşağı", "GAP’ın tamamı", "Ege grabenleri", "Ergene"], 1,
  "Çay = Doğu Karadeniz (Rize vb.)."),
Q("Fındık üretiminde öne çıkan bölge hangisidir?",
  ["Akdeniz", "Karadeniz (özellikle Orta–Doğu)", "Güneydoğu", "İç Anadolu", "Doğu Anadolu yüksek yayla"], 1,
  "Fındık = Karadeniz."),
Q("Pamuk üretiminin yoğun olduğu alanlara örnek hangisidir?",
  ["Erzurum–Kars", "Çukurova, Ege grabenleri, GAP sulama alanları",
   "Doğu Karadeniz", "Kaçkar etekleri", "Buzul vadileri"], 1,
  "Pamuk sıcak + sulama ister."),
Q("Zeytin için hangisi doğrudur?",
  ["Donlu karasal yaylalarda yaygındır", "Akdeniz iklimi etkisi altındaki kıyılarda (özellikle Ege–Akdeniz–Güney Marmara) yetişir",
   "Yalnızca Doğu Anadolu’da", "Yalnızca İç Anadolu’da", "Yalnızca GAP’ın en doğusunda"], 1,
  "Zeytin = Akdeniz iklim kuşağı."),
Q("Kayısı ile özdeşleşen il hangisidir?",
  ["Rize", "Malatya", "Zonguldak", "Trabzon", "Antalya"], 1,
  "Malatya kayısı."),
Q("Antep fıstığı üretiminde öne çıkan bölge hangisidir?",
  ["Doğu Karadeniz", "Güneydoğu Anadolu (Gaziantep–Şanlıurfa çevresi)",
   "Marmara’nın tamamı", "Trakya", "Karadeniz yaylaları"], 1,
  "Antep fıstığı = Güneydoğu."),
Q("Aşağıdaki ürün–bölge eşleştirmelerinden hangisi yanlıştır?",
  ["Çay – Doğu Karadeniz", "Muz – Anamur (Akdeniz)", "Fındık – Karadeniz",
   "Pamuk – Erzurum–Kars", "Zeytin – Ege"], 3,
  "Erzurum–Kars pamuk için uygun değildir."),
Q("I. Sulama artarsa nadas azalır\nII. GAP yalnızca enerji projesidir\nIII. Çukurova’da pamuk ve turunçgil önemlidir\nYargılarından hangileri doğrudur?",
  ["Yalnız I", "I ve III", "II ve III", "Yalnız II", "I, II ve III"], 1,
  "GAP çok sektörlüdür (tarım–enerji–ulaşım…); II yanlış."),
]

# =============================================================================
# 20 — Hayvancılık
# =============================================================================
qs += [
Q("Küçükbaş hayvancılığın (kırkım/otlak) daha yaygın olduğu yerler hangisidir?",
  ["Doğu Karadeniz orman içi", "İç Anadolu ve Doğu Anadolu’nun step/yayla alanları",
   "Yalnızca Marmara sanayi kuşağı", "Yalnızca Çukurova", "Yalnızca Zonguldak"], 1,
  "Step + yayla → koyun/keçi."),
Q("Büyükbaş (süt) hayvancılığının modern işletmelerle öne çıktığı bölgeler genelde hangisidir?",
  ["Yalnızca çöller", "Marmara, Ege ve İç Anadolu’nun gelişmiş tarım alanları",
   "Yalnızca falez kıyıları", "Yalnızca obruklar", "Yalnızca buzul sirkleri"], 1,
  "Pazar + yem + tesis → batı/gelişmiş alanlar."),
]

# =============================================================================
# 21 — Madenler (yoğun)
# =============================================================================
qs += [
Q("Türkiye’de maden çeşitliliğinin en fazla olduğu yer notlara göre hangisidir?",
  ["Çatalca Platosu", "Yukarı Fırat (Elazığ çevresi)", "Ergene Ovası", "Bafra Deltası", "İstanbul Boğazı"], 1,
  "Yukarı Fırat / Elazığ — volkanizma etkisi."),
Q("Bor madeninin başlıca çıkarım/işleme alanları hangileridir?",
  ["Zonguldak–Bartın", "Eskişehir–Kütahya–Balıkesir (Kırka, Bandırma)",
   "Rize–Artvin", "Antalya–Mersin", "Erzurum–Kars"], 1,
  "Bor = Eskişehir vb.; Kırka–Bandırma."),
Q("Krom çıkarımında öne çıkan yerler hangileridir?",
  ["Zonguldak", "Elazığ (Guleman) ve Fethiye (Köyceğiz)",
   "Batman", "Sinop", "Edirne"], 1,
  "Krom: Guleman–Köyceğiz; işleme Elazığ/Antalya."),
Q("Bakır çıkarım yerlerine örnek hangisidir?",
  ["Kastamonu (Küre), Artvin (Murgul), Rize (Çayeli)", "Antalya muz alanları",
   "Konya Ovası", "Ergene", "Bafra"], 0,
  "Küre–Murgul–Çayeli."),
Q("Taş kömürü çıkarımıyla özdeşleşen il hangisidir?",
  ["Batman", "Zonguldak (Ereğli)", "Antalya", "Muğla", "Şanlıurfa"], 1,
  "Zonguldak taş kömürü."),
Q("Aşağıdaki maden–yer eşleştirmelerinden hangisi yanlıştır?",
  ["Bor – Eskişehir", "Krom – Elazığ", "Taş kömürü – Zonguldak",
   "Bor – Zonguldak", "Bakır – Murgul"], 3,
  "Zonguldak taş kömürü; bor değil."),
]

# =============================================================================
# 22 — Enerji (yoğun)
# =============================================================================
qs += [
Q("Türkiye’de taş kömürünün başlıca bulunduğu yerler hangileridir?",
  ["Batman–Siirt", "Zonguldak–Bartın (Kozlu, Karadon, Amasra)",
   "Antalya–Mersin", "Konya–Karaman", "Edirne–Kırklareli"], 1,
  "Taş kömürü = Zonguldak havzası."),
Q("Türkiye’nin en büyük linyit santrali notlara göre hangisidir?",
  ["Soma yalnız", "Afşin–Elbistan (Kahramanmaraş)", "Çatalağzı yalnız", "Aliağa", "Akkuyu"], 1,
  "Afşin–Elbistan."),
Q("Türkiye’de ilk petrolün bulunduğu yer hangisidir?",
  ["Zonguldak", "Batman", "İstanbul", "İzmir", "Ankara"], 1,
  "İlk petrol Batman."),
Q("Türkiye’nin petrol ihtiyacının büyük bölümü için hangisi doğrudur?",
  ["Tamamen yerli üretim yeter", "Yaklaşık %90’ı ithal edilir",
   "İhracat fazladır", "Hiç petrol kullanılmaz", "Yalnızca linyitten üretilir"], 1,
  "Yüksek ithalat bağımlılığı."),
Q("Doğal gazda dışa bağımlılık için notlara göre hangisi doğrudur?",
  ["Tamamen yerli", "İhtiyacın çok büyük bölümü ithal edilir",
   "İhracatçıdır", "Yalnızca kömürden üretilir", "Yalnızca jeotermaldir"], 1,
  "Doğal gazda bağımlılık çok yüksektir."),
Q("Türkiye’nin ilk nükleer güç santrali projesi nerededir?",
  ["Zonguldak", "Mersin (Akkuyu)", "Erzurum", "Van", "Sinop işletmede"], 1,
  "Akkuyu – Mersin (inşaat süreci)."),
Q("Yenilenebilir enerji kaynaklarına örnek hangisidir?",
  ["Linyit", "Taş kömürü", "Hidroelektrik / rüzgâr / güneş / jeotermal",
   "Petrol", "Asfaltit"], 2,
  "HES–rüzgâr–güneş–jeotermal yenilenebilir."),
]

# =============================================================================
# 23 — Sanayi
# =============================================================================
qs += [
Q("Türkiye’de sanayinin en yoğun olduğu bölge hangisidir?",
  ["Doğu Anadolu", "Marmara", "Güneydoğu’nun tamamı", "Karadeniz yaylaları", "İç Anadolu stepı yalnız"], 1,
  "Marmara = sanayi kalbi."),
Q("Ham maddeye bağlı sanayi yerleşimine örnek hangisidir?",
  ["İstanbul tekstili yalnız", "Şeker fabrikalarının pancar alanlarına yakınlığı",
   "Yalnızca yazılım", "Yalnızca turizm", "Yalnızca liman gümrüğü"], 1,
  "Şeker = ham maddeye yakın."),
]

# =============================================================================
# 24 — Ulaşım
# =============================================================================
qs += [
Q("Türkiye’de en çok kullanılan yük/yolcu taşıma sistemi hangisidir?",
  ["Denizyolu yalnız", "Karayolu", "Boru hattı yalnız", "Hava yalnız", "Nehir"], 1,
  "Karayolu baskındır."),
Q("Boğaz köprüleri ve geçitler hangi coğrafi engeli aşmaya yöneliktir?",
  ["Çöl", "Su engeli / boğaz geçişi", "Enlem", "Boylam", "İzohips"], 1,
  "İstanbul/Çanakkale boğaz geçişleri."),
]

# =============================================================================
# 25 — Turizm
# =============================================================================
qs += [
Q("Deniz–kum–güneş turizminin yoğun olduğu bölgeler hangileridir?",
  ["Doğu Anadolu yüksek yaylaları", "Akdeniz ve Ege kıyıları",
   "Erzurum–Kars kış turizmi yalnız", "Zonguldak maden sahaları", "İç Anadolu stepı"], 1,
  "Akdeniz–Ege kıyı turizmi."),
Q("Kış turizmi (kayak) merkezlerine örnek hangisidir?",
  ["Anamur muz alanları", "Uludağ, Palandöken, Kartalkaya, Erciyes",
   "Çukurova", "Bafra Deltası", "Ergene"], 1,
  "Kayak = yüksek dağ merkezleri."),
]

# =============================================================================
# 26 — Jeopolitik / Projeler
# =============================================================================
qs += [
Q("Ege’de Türkiye–Yunanistan sorunları arasında hangisi yer almaz?",
  ["Kıta sahanlığı", "Karasuları", "FIR hattı", "SAR bölgesi", "Fırat’ın kullanımı"], 4,
  "Fırat = Suriye/Irak su sorunu; Ege değil."),
Q("Türkiye’nin Avrupa’ya giden en işlek sınır kapısı hangisidir?",
  ["Habur", "Kapıkule", "Sarp", "Gürbulak", "Dilucu"], 1,
  "Kapıkule."),
Q("Habur sınır kapısı hangi ülkeyledir?",
  ["İran", "Irak", "Gürcistan", "Bulgaristan", "Yunanistan"], 1,
  "Habur = Irak; İran = Gürbulak."),
Q("GAP’ın kapsamı için hangisi doğrudur?",
  ["Yalnızca turizm", "Tarım, enerji, ulaşım, sanayi gibi çok sektörlü kalkınma",
   "Yalnızca maden", "Yalnızca balıkçılık", "Yalnızca orman"], 1,
  "GAP çok amaçlıdır."),
]

# =============================================================================
# Karışık tuzak / eşleştirme / I-II-III (ÖSYM favorileri)
# =============================================================================
qs += [
Q("Aşağıdaki eşleştirmelerden hangisi yanlıştır?",
  ["Bakı – yamaç yönü etkisi", "Enlem – K–G sıcaklık",
   "İndirgenmiş sıcaklık – yükselti etkisini ayıklama",
   "Fiyort – Türkiye’nin Ege kıyılarında yaygındır",
   "Horst – kırılma ile yüksekte kalan kütle"], 3,
  "Fiyort TR’de yok; Ege kırıklı/ria karakterlidir."),
Q("I. Karadeniz’de yazlar da yağışlıdır\nII. Akdeniz’de yaz kuraklığı belirgindir\nIII. Erzurum–Kars’ta Ocak en soğuk merkezlerdendir\nHangileri doğrudur?",
  ["Yalnız I", "I ve II", "II ve III", "I ve III", "I, II ve III"], 4,
  "Üçü de doğru."),
Q("Aşağıdakilerden hangisi “bakı = her zaman güney yamaç daha sıcaktır” yargısını çürütür?",
  ["Ege’de zeytin", "Karadeniz’de kışın kuzey yamaçların daha ılık olabilmesi",
   "Akdeniz’de muz", "İç Anadolu’da step", "GAP’ta pamuk"], 1,
  "Karadeniz ters olay / bakı çeldiricisi."),
Q("Bölge–ürün–şekil bağlarından hangisi doğrudur?",
  ["Doğu Karadeniz – çay – dağınık yerleşme", "İç Anadolu – çay – fiyort",
   "Ege – bor – buzul sirk", "Zonguldak – pamuk – delta", "Erzurum – zeytin – falez"], 0,
  "Çay + dağınık yerleşme = Doğu Karadeniz."),
Q("Aşağıdaki yargılardan hangisi yanlıştır?",
  ["Ege’de horst–graben yaygındır", "KAF ve DAF Karlıova’da kesişir",
   "Delta olan yerde falez olmaz", "Türkiye’de fiyort kıyıları geniştir",
   "Bor Eskişehir çevresinde yoğundur"], 3,
  "Fiyort TR’de yoktur."),
Q("I. Afşin–Elbistan linyit santralidir\nII. Akkuyu nükleer santral projesidir\nIII. Batman ilk petrol sahasıdır\nHangileri doğrudur?",
  ["Yalnız I", "I ve II", "II ve III", "I ve III", "I, II ve III"], 4,
  "Hepsi doğru."),
Q("Aşağıdaki neden–sonuç ilişkilerinden hangisi yanlıştır?",
  ["Yükselti artar → sıcaklık düşer", "Sulama artar → nadas azalır",
   "Dağlar kıyıya paralel → iç kesimlere nemli hava zor girer",
   "Enlem artar (kuzeye) → genelde sıcaklık artar",
   "Göç alır → gerçek nüfus artışı yükselir"], 3,
  "Kuzeye gidildikçe (enlem ↑) sıcaklık genelde düşer."),
Q("Maden–enerji tuzaklarından hangisi doğrudur?",
  ["Bor Zonguldak’tadır", "Taş kömürü Eskişehir’dedir",
   "Krom Elazığ–Fethiye’dedir", "Petrol ilk kez Rize’de bulunmuştur",
   "Doğal gaz tamamen yerlidir"], 2,
  "Krom Guleman–Köyceğiz."),
Q("Aşağıdakilerden hangisi GAP illeri arasında gösterilemez?",
  ["Şanlıurfa", "Diyarbakır", "Gaziantep", "Trabzon", "Mardin"], 3,
  "Trabzon Karadeniz’dir; GAP’ta değildir."),
]


def validate(questions):
    assert 90 <= len(questions) <= 110, len(questions)
    for i, q in enumerate(questions):
        assert len(q["options"]) == 5, i
        assert 0 <= q["correctAnswerIndex"] < 5, i
        for j, o in enumerate(q["options"]):
            assert o and o.strip(), (i, j)
            # must start with letter)
            assert re.match(r"^[ABCDE]\) ", o), (i, j, o)
        assert q["question"] and q["explanation"]
    # duplicate stem check (soft)
    stems = [q["question"] for q in questions]
    assert len(stems) == len(set(stems)), "duplicate questions"


validate(qs)

out = Path(__file__).resolve().parents[1] / "sorular" / "cografya-27.js"
lines = [
    "// sorular/cografya-27.js — COĞRAFYA GENEL TEKRAR (1–26 kapsamlı)",
    "window.cografya_27_sorulari = [",
]
for i, q in enumerate(qs):
    block = json.dumps(q, ensure_ascii=False, indent=4)
    indented = "\n".join(("    " + ln if ln else ln) for ln in block.split("\n"))
    comma = "," if i < len(qs) - 1 else ""
    lines.append(indented + comma)
lines.append("];")
lines.append("")
out.write_text("\n".join(lines), encoding="utf-8")
print("wrote", out, "questions", len(qs))
