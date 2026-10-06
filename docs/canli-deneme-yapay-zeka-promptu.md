# Canlı deneme dosyasını yapay zekâya hazırlatma

Bu dosya `node scripts/make-live-exam-prompt.js` ile üretilir; konu adları data.js'ten birebir alınır.

## Nasıl kullanılır
1. Aşağıdaki **prompt'un tamamını** kopyalayıp yapay zekâya ver. Sonuna kendi sorularını (metin, PDF, fotoğraf) ekle ya da "bu dağılımla yeni sorular yaz" de.
2. Gelen JSON'u `deneme.json` olarak kaydet. Kontrol için: `node scripts/validate-live-exam.js deneme.json`
3. Görselleri hazırla (her görselli soruda `gorsel_tarifi` ne çizileceğini söyler): PNG ya da JPG, dosya adı JSON'daki `gorsel` ile **birebir aynı** (ör. `soru-37.png`; büyük/küçük harf önemli).
   Önerilen boyut: 800–1200 px genişlik, görsel başına en fazla ~300 KB, beyaz zemin. Görseller kitapçığa gömülür; çok büyük görsel kitapçığı ağırlaştırır.
4. Yönetici paneli → 🕒 Canlı Deneme → denemeyi aç → "Soru dosyası" alanına JSON'u, "Görseller" alanına tüm görselleri **birlikte** seç.
   Hata ya da eksik görsel varsa panel tek tek gösterir; "✓ Geçerli" görünce "Soruları ve kitapçığı yükle".

## Prompt

````text
Sen bir KPSS deneme sınavı hazırlayıcısısın. Sana vereceğim soruları (ya da benim için yazacağın soruları) aşağıdaki
kurallara HARFİYEN uyan tek bir JSON dosyasına dönüştür. Çıktı yalnızca geçerli JSON olsun; açıklama, yorum, ``` işareti yok.

## Dosya biçimi
{
  "kulvar": "lisans",            // lisans | onlisans | ortaogretim
  "baslik": "Atanly Canlı Deneme 1",
  "sorular": [
    {
      "no": 1,                      // 1–120, her numara bir kez
      "bolum": "GY",                // 1–60 GY (Genel Yetenek), 61–120 GK (Genel Kültür)
      "ders": "Türkçe",
      "konu": "Sözcükte Anlam",      // AŞAĞIDAKİ LİSTEDEN BİREBİR (harf, boşluk, noktalama dahil)
      "metin": "Soru kökü…",        // öncüller için satır sonu: "\n" (ör. "I. …\nII. …\nIII. …")
      "siklar": ["…", "…", "…", "…", "…"],  // tam 5 şık, başında A) B) yazma
      "dogru": "C",                 // A–E
      "cozum": "Kısa, öğretici çözüm…",
      "gorsel": "soru-37.png",       // YALNIZCA şekli/tablosu/grafiği olan sorularda; yoksa bu alanı hiç yazma
      "gorsel_tarifi": "…"         // görselli sorularda: görselde ne olacağı (aşağıya bak)
    }
  ]
}

## Dağılım ve sıra (zorunlu, toplam 120)
- 1–30: Türkçe (30 soru)
- 31–60: Matematik (geometri dahil) (30 soru; ders alanı "Matematik" ya da "Geometri")
- 61–87: Tarih (27 soru)
- 88–105: Coğrafya (18 soru)
- 106–114: Vatandaşlık (9 soru)
- 115–120: Güncel Bilgiler (6 soru)

## Görselli sorular
- Şekil, grafik, tablo ya da harita gerektiren soruda "gorsel" alanına dosya adını yaz: "soru-<no>.png" (ör. 37. soru → "soru-37.png").
- Aynı soruya "gorsel_tarifi" alanı ekle: görselde tam olarak ne olacağını, çizecek kişinin hiçbir şey sormadan çizebileceği
  ayrıntıda yaz (ör. "ABC dik üçgeni, A açısı 90°, |AB| = 6 cm, |AC| = 8 cm, H noktası BC üzerinde ve AH ⟂ BC; uzunluklar kenar
  üzerinde yazılı, x ile gösterilen açı ABC açısı"). Grafik ve tablolarda tüm sayıları ve eksen adlarını yaz.
- Metin şekle "Şekilde…", "Yukarıdaki grafiğe göre…" diye atıf yapabilir; şıklar yine metin olmalı.
- Basit tablolar görsel yerine metne de yazılabilir (satırları "\n" ile ayır).

## Konu adları (ders → kullanabileceğin konu değerleri; başka değer KULLANMA)
Not: Bazı adlarda yazım hatası ya da sonda boşluk var (ör. "20.YY Başlarında Osmanlı Devleti "); onları da AYNEN kopyala.
Türkçe'de sözel mantık ve paragrafta yapı/anlatım teknikleri soruları "Paragraf" konusuna yazılır.
```json
{
 "Türkçe": [
  "Sözcükte Anlam",
  "Cümlede Anlam",
  "Paragraf",
  "İsim – Zamir",
  "Sıfat",
  "Tamlamalar",
  "Zarf",
  "Edat – Bağlaç – Ünlem",
  "Fiil",
  "Eylemsi",
  "Ekler",
  "Sözcükte Yapı",
  "Cümlenin Ögeleri",
  "Fiilde Çatı",
  "Cümle Türleri",
  "Ses Bilgisi",
  "Yazım Kuralları",
  "Sıkça Yapılan Yazım Yanlışları",
  "Noktalama İşaretleri",
  "Anlatım Bozuklukları"
 ],
 "Matematik": [
  "Temel Kavramlar",
  "Sayı Basamakları",
  "Bölme ve Bölünebilme",
  "Asal Çarpanlar, EBOB ve EKOK",
  "Rasyonel Sayılar",
  "Ondalık Sayılar",
  "Basit Eşitsizlikler",
  "Mutlak Değer",
  "Üslü Sayılar",
  "Köklü Sayılar",
  "Çarpanlara Ayırma",
  "Oran ve Orantı",
  "Denklem Çözme",
  "Sayı ve Kesir Problemleri",
  "Yaş Problemleri",
  "Yüzde, Kâr ve Zarar Problemleri",
  "Karışım Problemleri",
  "Hareket Problemleri",
  "İşçi ve Havuz Problemleri",
  "Kümeler",
  "Fonksiyonlar",
  "İşlem ve Modüler Aritmetik",
  "Permütasyon, Kombinasyon ve Olasılık",
  "Tablo ve Grafik Yorumlama",
  "Sayısal Mantık"
 ],
 "Geometri": [
  "Üçgende Açılar",
  "Açı-Kenar ve Dik Üçgen",
  "İkizkenar ve Eşkenar Üçgen",
  "Açıortay ve Kenarortay",
  "Üçgende Alan",
  "Üçgenlerde Benzerlik",
  "Analitik Geometri (Doğru)",
  "Dörtgenler ve Yamuk",
  "Paralelkenar ve Özel Dörtgenler",
  "Çokgenler",
  "Çember ve Daire",
  "Katı Cisimler"
 ],
 "Tarih": [
  "İslamiyet Öncesi Türk Tarihi",
  "İlk Türk-İslam Devletleri",
  "Anadolu Selçuklu Devleti",
  "Osmanlı Kültür ve Medeniyeti",
  "Osmanlı Devleti Kuruluş Dönemi",
  "Osmanlı Devleti Yükselme Dönemi",
  "Osmanlı Devleti Duraksama Dönemi",
  "Osmanlı Devleti Gerileme Dönemi",
  "19.YY Osmanlı Devleti Dağılma Dönemi",
  "19.YY Osmanlı Devleti Islahatları",
  "20.YY Başlarında Osmanlı Devleti ",
  "Mondros Ateşkes Antlaşması ve Cemiyetler",
  "Milli Mücadeler Hazırlık Dönemi",
  "I. TBMM Dönemi ve Gelişmeleri",
  "Milli Mücadeele Muharabeler Dönemi:",
  "Milli Mücadele Diplomatik Dönem",
  "Atatürk'ün Hayatı",
  "Atatürk Dönemi İç Politikalar ve Gelişmeler",
  "Atatürk İlkeleri",
  "Atatürk İnkılapları",
  "Atatürk Dönemi Türk Dış Politikası",
  "Cumhuriyet Dönemi Kültür ve Medeniyeti",
  "XX. Yüzyıl Başlarında Dünya",
  "II. Dünya Savaşı",
  "II. Dünya Savaşı'nda Türkiye",
  "Soğuk Savaş Dönemi",
  "Yumuşama Dönemi",
  "Küreselleşen Dünya",
  "Genel Tekrar"
 ],
 "Coğrafya": [
  "Türkiye'nin Coğrafi Konumu",
  "İç Kuvvetler",
  "Dış Kuvvetler",
  "Türkiyenin Platoları",
  "Türkiyenin Ovaları",
  "Akarsu Vadileri ve Şelaleler",
  "Rüzgar Şekilleri",
  "Buzul Şekilleri",
  "Karstik Şekiller",
  "Kıyı Şekilleri",
  "Harita Bilgisi ve Engebe",
  "Türkiyenin İklimi",
  "Türkiyenin Su Toprak ve Bitki Varlığı",
  "Türkiyede Çevre ve Doğal Afetler",
  "Türkiyenin Beşeri Coğrafyası",
  "Türkiyede Yerleşim",
  "Türkiyenini Ekonomik Coğrafyası (Ekonomi Politikaları)",
  "Türkiyenini Ekonomik Coğrafyası (TARIM-1)",
  "Türkiyenini Ekonomik Coğrafyası (TARIM-2)",
  "Türkiyenini Ekonomik Coğrafyası (HAYVANCILIK)",
  "Türkiyenini Ekonomik Coğrafyası (MADENLER)",
  "Türkiyenini Ekonomik Coğrafyası (ENERJİ KAYNAKLARI)",
  "Türkiyenini Ekonomik Coğrafyası (SANAYİ)",
  "Türkiyenini Ekonomik Coğrafyası (ULAŞIM)",
  "Türkiye'de Turizm",
  "Türkiye'nin Jeopolitik Konumu ve Bölgesel Projeler",
  "Genel Tekrar"
 ],
 "Vatandaşlık": [
  "Toplumsal Düzen ve Hukuk Kavramları",
  "Borçlar, Ticaret ve Devletler Özel Hukuku",
  "Hak Kavramı",
  "Türk Anayasa Tarihi",
  "Siyasi Hak ve Ödevler",
  "1982 Anayasası - Yasama",
  "1982 Anayasası - Yürütme",
  "İdare Hukuku",
  "Devlet Memurları (657)",
  "Türkiye'nin İdari Yapısı",
  "İnsan Hakları",
  "Genel Kültür - Ulusal Gelişmeler",
  "Önemli Düşünür ve Bilim İnsanları",
  "Genel Tekrar 1",
  "Genel Tekrar 2",
  "Genel Tekrar 3",
  "Genel Tekrar 4",
  "Genel Tekrar 5"
 ],
 "Güncel Bilgiler": [
  "Türkiye Gündemi, Ekonomi ve Nüfus",
  "Savunma, Bilim ve Uzay",
  "Nobel, Oscar ve UNESCO",
  "Spor, Kuruluşlar ve Zirveler",
  "Türk Edebiyatı",
  "İlkler, Düşünce, Resim ve Müzik",
  "Dünya Edebiyatı",
  "Coğrafya, Millî Parklar ve Vefatlar"
 ]
}
```

## Konu ağırlıkları (her birinden en az bir soru olsun)
- Tarih · Millî Mücadele: "Milli Mücadeler Hazırlık Dönemi", "I. TBMM Dönemi ve Gelişmeleri", "Milli Mücadeele Muharabeler Dönemi:", "Milli Mücadele Diplomatik Dönem", "Mondros Ateşkes Antlaşması ve Cemiyetler"
- Tarih · Atatürk İlke ve İnkılapları: "Atatürk İlkeleri", "Atatürk İnkılapları", "Atatürk Dönemi İç Politikalar ve Gelişmeler"
- Tarih · Osmanlı Devleti: "Osmanlı Devleti Kuruluş Dönemi", "Osmanlı Devleti Yükselme Dönemi", "Osmanlı Devleti Duraksama Dönemi", "Osmanlı Devleti Gerileme Dönemi", "19.YY Osmanlı Devleti Dağılma Dönemi", "19.YY Osmanlı Devleti Islahatları", "Osmanlı Kültür ve Medeniyeti"
- Tarih · XX. Yüzyılda Osmanlı: "20.YY Başlarında Osmanlı Devleti "
- Geometri · Üçgenler: "Üçgende Açılar", "Açı-Kenar ve Dik Üçgen", "İkizkenar ve Eşkenar Üçgen", "Açıortay ve Kenarortay", "Üçgende Alan", "Üçgenlerde Benzerlik"
- Geometri · Dörtgenler: "Dörtgenler ve Yamuk", "Paralelkenar ve Özel Dörtgenler"
- Geometri · Çember ve Daire: "Çember ve Daire"

## Kalite kuralları
- Her sorunun tek ve tartışmasız doğru cevabı olsun; matematik sorularında cevabı adım adım kontrol et.
- Doğru cevaplar A–E arasında dengeli dağılsın (aynı harf üst üste 3'ten fazla gelmesin).
- Şıklar benzer uzunlukta olsun; "Hepsi", "Hiçbiri" gibi şıkları az kullan.
- Güncel Bilgiler soruları sınav tarihinden eski bilgiye dayanmasın; emin olmadığın güncel bilgiyi sorma.
- "cozum" alanı 1–3 cümlede neden o şıkkın doğru olduğunu açıklasın.

## Teslimden önce kendi kendini denetle
1. Tam 120 soru, no 1–120, mükerrer yok.
2. 1–60 "GY", 61–120 "GK"; yukarıdaki dağılım ve sıra tutuyor.
3. Her "konu", o dersin listesinde birebir var.
4. Her soruda 5 şık ve A–E doğru cevap var.
5. "gorsel" yalnızca görselli sorularda var, adı "soru-<no>.png" biçiminde ve yanında "gorsel_tarifi" var.
6. Çıktı yalnızca JSON; başında ya da sonunda tek bir kelime bile yok.
````
