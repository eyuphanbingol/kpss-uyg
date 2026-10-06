#!/usr/bin/env node
/**
 * Canlı deneme dosyasını bir yapay zekâya hazırlatmak için prompt üretir:
 *   node scripts/make-live-exam-prompt.js   ->  docs/canli-deneme-yapay-zeka-promptu.md
 * Konu adları catalog.json'dan (data.js anahtarları) birebir alınır; anahtarlar değişince yeniden çalıştır.
 */
var fs = require("fs");
var path = require("path");
var root = path.join(__dirname, "..");
var cat = require(path.join(root, "catalog.json"));
var L = require(path.join(root, "js", "liveExam.js"));

var DERSLER = ["Türkçe", "Matematik", "Geometri", "Tarih", "Coğrafya", "Vatandaşlık", "Güncel Bilgiler"];
var konular = {};
DERSLER.forEach(function (d) { konular[d] = Object.keys(cat[d] || {}).filter(function (k) { return k !== "_"; }); });
var plan = L.EXAM_PLAN.map(function (t) { return "- " + t.from + "–" + t.to + ": " + t.label + " (" + t.n + " soru" + (t.dersler.length > 1 ? "; ders alanı \"Matematik\" ya da \"Geometri\"" : "") + ")"; }).join("\n");
var groups = L.KONU_GROUPS.filter(function (g) { return g.w >= 4; }).map(function (g) {
    return "- " + g.ders + " · " + g.ad + ": " + g.konular.map(function (k) { return JSON.stringify(k); }).join(", ");
}).join("\n");

var prompt = [
    "Sen bir KPSS deneme sınavı hazırlayıcısısın. Sana vereceğim soruları (ya da benim için yazacağın soruları) aşağıdaki",
    "kurallara HARFİYEN uyan tek bir JSON dosyasına dönüştür. Çıktı yalnızca geçerli JSON olsun; açıklama, yorum, ``` işareti yok.",
    "",
    "## Dosya biçimi",
    "{",
    "  \"kulvar\": \"lisans\",            // lisans | onlisans | ortaogretim",
    "  \"baslik\": \"Atanly Canlı Deneme 1\",",
    "  \"sorular\": [",
    "    {",
    "      \"no\": 1,                      // 1–120, her numara bir kez",
    "      \"bolum\": \"GY\",                // 1–60 GY (Genel Yetenek), 61–120 GK (Genel Kültür)",
    "      \"ders\": \"Türkçe\",",
    "      \"konu\": \"Sözcükte Anlam\",      // AŞAĞIDAKİ LİSTEDEN BİREBİR (harf, boşluk, noktalama dahil)",
    "      \"metin\": \"Soru kökü…\",        // öncüller için satır sonu: \"\\n\" (ör. \"I. …\\nII. …\\nIII. …\")",
    "      \"siklar\": [\"…\", \"…\", \"…\", \"…\", \"…\"],  // tam 5 şık, başında A) B) yazma",
    "      \"dogru\": \"C\",                 // A–E",
    "      \"cozum\": \"Kısa, öğretici çözüm…\",",
    "      \"gorsel\": \"soru-37.png\",       // YALNIZCA şekli/tablosu/grafiği olan sorularda; yoksa bu alanı hiç yazma",
    "      \"gorsel_tarifi\": \"…\"         // görselli sorularda: görselde ne olacağı (aşağıya bak)",
    "    }",
    "  ]",
    "}",
    "",
    "## Dağılım ve sıra (zorunlu, toplam 120)",
    plan,
    "",
    "## Görselli sorular",
    "- Şekil, grafik, tablo ya da harita gerektiren soruda \"gorsel\" alanına dosya adını yaz: \"soru-<no>.png\" (ör. 37. soru → \"soru-37.png\").",
    "- Aynı soruya \"gorsel_tarifi\" alanı ekle: görselde tam olarak ne olacağını, çizecek kişinin hiçbir şey sormadan çizebileceği",
    "  ayrıntıda yaz (ör. \"ABC dik üçgeni, A açısı 90°, |AB| = 6 cm, |AC| = 8 cm, H noktası BC üzerinde ve AH ⟂ BC; uzunluklar kenar",
    "  üzerinde yazılı, x ile gösterilen açı ABC açısı\"). Grafik ve tablolarda tüm sayıları ve eksen adlarını yaz.",
    "- Metin şekle \"Şekilde…\", \"Yukarıdaki grafiğe göre…\" diye atıf yapabilir; şıklar yine metin olmalı.",
    "- Basit tablolar görsel yerine metne de yazılabilir (satırları \"\\n\" ile ayır).",
    "",
    "## Konu adları (ders → kullanabileceğin konu değerleri; başka değer KULLANMA)",
    "Not: Bazı adlarda yazım hatası ya da sonda boşluk var (ör. \"20.YY Başlarında Osmanlı Devleti \"); onları da AYNEN kopyala.",
    "Türkçe'de sözel mantık ve paragrafta yapı/anlatım teknikleri soruları \"Paragraf\" konusuna yazılır.",
    "```json",
    JSON.stringify(konular, null, 1),
    "```",
    "",
    "## Konu ağırlıkları (her birinden en az bir soru olsun)",
    groups,
    "",
    "## Kalite kuralları",
    "- Her sorunun tek ve tartışmasız doğru cevabı olsun; matematik sorularında cevabı adım adım kontrol et.",
    "- Doğru cevaplar A–E arasında dengeli dağılsın (aynı harf üst üste 3'ten fazla gelmesin).",
    "- Şıklar benzer uzunlukta olsun; \"Hepsi\", \"Hiçbiri\" gibi şıkları az kullan.",
    "- Güncel Bilgiler soruları sınav tarihinden eski bilgiye dayanmasın; emin olmadığın güncel bilgiyi sorma.",
    "- \"cozum\" alanı 1–3 cümlede neden o şıkkın doğru olduğunu açıklasın.",
    "",
    "## Teslimden önce kendi kendini denetle",
    "1. Tam 120 soru, no 1–120, mükerrer yok.",
    "2. 1–60 \"GY\", 61–120 \"GK\"; yukarıdaki dağılım ve sıra tutuyor.",
    "3. Her \"konu\", o dersin listesinde birebir var.",
    "4. Her soruda 5 şık ve A–E doğru cevap var.",
    "5. \"gorsel\" yalnızca görselli sorularda var, adı \"soru-<no>.png\" biçiminde ve yanında \"gorsel_tarifi\" var.",
    "6. Çıktı yalnızca JSON; başında ya da sonunda tek bir kelime bile yok."
].join("\n");

var md = [
    "# Canlı deneme dosyasını yapay zekâya hazırlatma",
    "",
    "Bu dosya `node scripts/make-live-exam-prompt.js` ile üretilir; konu adları data.js'ten birebir alınır.",
    "",
    "## Nasıl kullanılır",
    "1. Aşağıdaki **prompt'un tamamını** kopyalayıp yapay zekâya ver. Sonuna kendi sorularını (metin, PDF, fotoğraf) ekle ya da \"bu dağılımla yeni sorular yaz\" de.",
    "2. Gelen JSON'u `deneme.json` olarak kaydet. Kontrol için: `node scripts/validate-live-exam.js deneme.json`",
    "3. Görselleri hazırla (her görselli soruda `gorsel_tarifi` ne çizileceğini söyler): PNG ya da JPG, dosya adı JSON'daki `gorsel` ile **birebir aynı** (ör. `soru-37.png`; büyük/küçük harf önemli).",
    "   Önerilen boyut: 800–1200 px genişlik, görsel başına en fazla ~300 KB, beyaz zemin. Görseller kitapçığa gömülür; çok büyük görsel kitapçığı ağırlaştırır.",
    "4. Yönetici paneli → 🕒 Canlı Deneme → denemeyi aç → \"Soru dosyası\" alanına JSON'u, \"Görseller\" alanına tüm görselleri **birlikte** seç.",
    "   Hata ya da eksik görsel varsa panel tek tek gösterir; \"✓ Geçerli\" görünce \"Soruları ve kitapçığı yükle\".",
    "",
    "## Prompt",
    "",
    "````text",
    prompt,
    "````",
    ""
].join("\n");
fs.writeFileSync(path.join(root, "docs", "canli-deneme-yapay-zeka-promptu.md"), md);
console.log("docs/canli-deneme-yapay-zeka-promptu.md yazıldı (" + prompt.length + " karakterlik prompt).");
