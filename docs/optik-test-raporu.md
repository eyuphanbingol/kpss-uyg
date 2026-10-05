# Optik okuma — sentetik test raporu

`node scripts/test-omr-synthetic.js` ile üretildi (2026-10-05). Her senaryoda 8 form; her formda 120 soru, rastgele cevaplar (%12 boş). Form, uygulamanın gerçek çizim koduyla çizilip kurşun kalem
izleriyle doldurulur, sonra telefon fotoğrafı gibi bozulur ve okuma hattından geçirilir.

- **Doğrudan doğru:** okunan cevap gerçek cevapla aynı ve uyarısız.
- **Onaya düştü:** okuyucu satırı "kararsız" ya da "çift işaret" diye işaretledi; kullanıcı onay ekranında görüp düzeltir.
- **Sessiz hata:** okuyucu uyarı vermeden yanlış okudu. Asıl risk budur; hedef 0.

| Senaryo | Okunan form | Doğrudan doğru | Onaya düştü | Sessiz hata | Karekod | Süre |
|---|---|---|---|---|---|---|
| Düz, iyi ışık | 8/8 | %100.00 | %0.00 | 0 | 8/8 | 254 ms |
| Eğik (±15°) ve hafif perspektif | 8/8 | %100.00 | %0.00 | 0 | 8/8 | 234 ms |
| Güçlü perspektif (yandan çekim) | 8/8 | %100.00 | %0.00 | 0 | 8/8 | 285 ms |
| Ters çekilmiş (180°) | 8/8 | %100.00 | %0.00 | 0 | 8/8 | 240 ms |
| Sayfanın yarısında gölge | 8/8 | %95.00 | %5.00 | 0 | 8/8 | 242 ms |
| Loş ışık ve gürültü | 8/8 | %100.00 | %0.00 | 0 | 8/8 | 249 ms |
| Bulanık (odak kayması) | 8/8 | %100.00 | %0.00 | 0 | 8/8 | 270 ms |
| Silik (açık) kurşun kalem | 8/8 | %100.00 | %0.00 | 0 | 8/8 | 284 ms |
| Silinmiş izler ve çift işaret | 8/8 | %95.42 | %4.58 | 0 | 8/8 | 229 ms |
| Lens bükülmesi, dağınık zemin | 8/8 | %100.00 | %0.00 | 0 | 8/8 | 248 ms |
| Düşük çözünürlük (1000×1333) | 8/8 | %100.00 | %0.00 | 0 | 8/8 | 218 ms |
| Kötü silinmiş izler | 8/8 | %85.63 | %14.38 | 0 | 8/8 | 260 ms |
| Yarım doldurulmuş baloncuklar | 8/8 | %100.00 | %0.00 | 0 | 8/8 | 235 ms |
| Soluk yazıcı baskısı | 8/8 | %100.00 | %0.00 | 0 | 8/8 | 249 ms |
| Kıvrık kâğıt (ortada ~7 mm kabarma) | 8/8 | %99.27 | %0.73 | 0 | 8/8 | 268 ms |
| Çok düşük çözünürlük (800×1067) | 8/8 | %100.00 | %0.00 | 0 | 8/8 | 185 ms |
| Karma zor koşul | 8/8 | %99.90 | %0.10 | 0 | 8/8 | 238 ms |
| **Toplam** | **136/136** | **%98.54** | **%1.46** | **0** | **136/136** | |

## Güvenlik ve sınır senaryoları

Bu fotoğraflarda okuyucunun iki doğru davranışı var: doğru okumak ya da "yeniden çek" diye reddetmek. Uyarısız yanlış okuma kabul edilmez.

| Senaryo | Reddedildi | Doğru okundu | Uyarısız yanlış |
|---|---|---|---|
| Köşe kadraj dışında | 8/8 | 0/8 | 0 |
| Sınır: çok bulanık | 8/8 | 0/8 | 0 |
| Sınır: çok karanlık | 8/8 | 0/8 | 0 |
| Sınır: ortada ~13 mm kabarma | 8/8 | 0/8 | 0 |
| Sınır: çok yandan çekim | 2/8 | 6/8 | 0 |

## Sınırlamalar

- Görseller sentetiktir. Gerçek kâğıt, yazıcı ve telefon kameralarıyla birkaç formluk bir deneme yapılmadan yayına alınmamalı.
- Süreler masaüstü Chromium'da ölçüldü; telefonda 3–5 kat uzun sürebilir (yaklaşık 1–2 saniye).
- Okuma her zaman onay ekranından geçer: kararsız ve çift işaretli satırlar renkle gösterilir, kullanıcı onaylamadan hiçbir şey gönderilmez.

Örnek bozulmuş görseller: `docs/optik-ornekler/<senaryo>.jpg`.
