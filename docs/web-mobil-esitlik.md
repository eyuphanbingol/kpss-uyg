# Web ↔ mobil eşitlik denetimi

Amaç: web'de olan her özellik mobilde, mobilde olan her özellik web'de olsun; ikisi aynı tasarım dilini
(mobilin renk ve bileşenleri) kullansın. Bu belge farkları ve durumlarını izler.

Durum: ✅ kapandı · 🔄 yapılıyor · ⏳ sırada · ➖ bilinçli olarak tek tarafta

## Tasarım dili (kaynak: mobil `mobile/src/lib/theme.js`, `mobile/src/ui.js`, `mobile/src/kit.js`)

| Öğe | Mobil | Web (önce) — şimdi ✅ mobil değerleri |
|---|---|---|
| Zemin | `#F8FAFC`, koyu `#211F1D` | açık gri + renkli arka plan |
| Başlık | düz `#0F172A`, 28px kalın | renk geçişli (gradient) başlık |
| Kart | beyaz, 1px `#E2E8F0` çerçeve, 18px köşe, hafif gölge | çerçevesiz, büyük gölgeli "glass" |
| Liste kartı | solda altın şerit (`#D97706`), sağda ok | büyük kart, pastel emoji kutusu |
| Simge kutusu | `#FEF3C7` krem, çizgi simge | pastel renkli emoji |
| Öne çıkan kart | koyu lacivert `#0D2C4D` | teal geçişli |
| Birincil düğme | lacivert→teal geçiş (`#0D2C4D → #14607a → #1D8A99`), 16px köşe | lacivert / indigo karışık |
| Küçük başlık | teal `#127880`, büyük harf | teal / stone |
| Sekme çubuğu | beyaz, seçili `#4F46E5` | benzer |

Web'de `index.html` içindeki "MOBİL TASARIM DİLİ" bölümü bu değerleri `--m-*` değişkenleriyle tanımlar;
`js/app.jsx` içindeki `AccentRow` ve `LineIcon` mobil `AccentCard` ve lucide simgelerinin karşılığıdır.
Eksikler ekranı mobildeki gibi ilerleme çubuğu, ders başına sayaç ve tıklanabilir konu satırları gösterir.

## Özellik farkları

### Yalnız web'de → mobile eklenecek
| Özellik | Yer | Durum |
|---|---|---|
| Deneme ekranı (ders seçimi, soru sayısı, süre; tam deneme 40 soru · 40 dk, haftalık kota) | Bugün → "Deneme" | ✅ iki tarafta da ekran yazılıydı ama açılmıyordu; ikisi de Bugün'e bağlandı, web tam denemesi mobildeki gibi kaydedilir |
| Net kartını indir/paylaş (test sonucu görseli) | Test sonucu | ✅ mobilde paylaşım menüsüyle; çizim ortak (`js/shareCard.js` → gizli WebView) |
| Program görseli paylaş | Akıllı program | ✅ aynı çizim (`SmartPlan.imageModel` + `ShareCard.drawPlan`); web'de ayrıca tarayıcıdan yazdır/PDF |
| Isı haritası ayrıntıları (çalışma saati, gün ayrıntısı, haftalık özet, ders analizi sekmesi) | Isı haritası | ✅ mobil `screens/HeatScreen.js` web `Heatmap30.jsx` ile aynı hesap |
| Akıllı tercih (puana göre kurum eşleşmesi, arama) | Seviye/puan ekranı | ⏳ |
| Yapay zekâ: "neden yanlış yaptım" notu, rastgele soru | Yapay zekâ | ⏳ |
| Hatırlatma izni (bildirim) | Ben | ➖ mobilde yerel bildirim paketi yok (yeni native bağımlılık gerekir) |
| Yönetim paneli | Ben → Yönetim | ➖ web'de (telefon tarayıcısında da çalışır) |

### Yalnız mobilde → web'e eklenecek
| Özellik | Yer | Durum |
|---|---|---|
| Profilde 3 sayaç (Soru · Net · Seri) | Ben | ✅ |
| Eksikler sekmesinde "Canlı denemeden eksikler" | Eksikler | ✅ |
| Program takviminde sonraki haftaları açma | Program | ✅ iki tarafta da vardı |
| Konu sayfasında "boşlukları sıfırla" | Konu | ✅ web'de de vardı (denetimde yanlış işaretlenmişti) |
| "7 günlük deneme aç" | Paywall | ➖ mobilde ödeme test modu için konmuş sahte düğme (`grantMockPremium`); web'e taşınmaz, mobilde gerçek ödeme gelince kaldırılmalı |

### Giriş, kayıt, çıkış
| Öğe | Durum |
|---|---|
| Web: iki bölmeli premium giriş (marka paneli + form), çizgi simgeler, Caps Lock uyarısı, e-posta yazım önerisi, şifre gücü, erişilebilir hata mesajları, açık KVKK onay kutusu | ✅ |
| Mobil: aynı dil, alan simgeleri, şifre gücü, e-posta önerisi, klavye akışı, koyu mod alanları | ✅ |
| Çıkış: onaylı, açıklamalı pencere; çıkmadan önce ilerleme buluta yazılır (web + mobil) | ✅ |
