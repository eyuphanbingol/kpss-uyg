# Atanly — Kabul Testi (UAT) Rehberi

Yayından önce **5–10 gerçek KPSS adayı** uygulamayı **1 hafta** kendi telefonunda/bilgisayarında kullanır.
Amaç: "Çalışıyor mu?" değil, **"Gerçek bir aday işini görebiliyor mu, nerede takılıyor?"** sorusunu cevaplamak.

## Katılımcı ve cihaz dağılımı

En az bir kişi her satırdan:

| Cihaz | Örnek | Neden |
|---|---|---|
| Yeni iPhone (iOS 17+) | iPhone 13–16 | Ana kitle |
| Eski iPhone (iOS 15–16) | iPhone 8, SE 2 | Eski Safari, küçük ekran |
| Orta/alt segment Android | Samsung A serisi, Redmi | En yaygın; yavaş işlemci |
| Eski Android (Android 9–11) | 3–4 yıllık telefon | Eski WebView |
| Bilgisayar — Chrome | Windows | Web |
| Bilgisayar — Safari | Mac | Web, farklı motor |

En az bir kişi **mobil veriyle (4G)** ve bir kişi **zayıf bağlantıda** denesin. Kulvar dağılımı: lisans, önlisans, ortaöğretim.

## Görevler (her katılımcı sırayla yapar)

Her görevde not alınır: **Yapabildi mi? (Evet / Zorlandı / Yapamadı)**, **süre**, **ne düşündü**.

| # | Görev | Beklenen |
|---|---|---|
| 1 | Uygulamayı ilk kez aç, tanıtım sayfalarını geç | Tanıtım anlaşılır, "Hemen başla" giriş ekranına götürür |
| 2 | E-postayla hesap aç (ad, kulvar seç), maili **başka bir cihazda** onayla | Uygulamaya dönünce ad ve kulvar **tekrar sorulmaz** |
| 3 | Google ile çıkış yapıp tekrar gir | Kulvar ekranı bir kez sorulur, sonra hatırlanır |
| 4 | Bugün ekranından sıradaki konunun notunu oku, testini çöz | Not okunur, test sonucunda doğru/yanlış ve açıklama görünür |
| 5 | Yanlış yaptığın bir soruyu Eksikler'de bul ve tekrar çöz | Yanlış defterinde görünür, doğru çözünce defterden çıkar |
| 6 | Program sihirbazıyla kendi çalışma planını kur | Plan sınav tarihine göre oluşur, gün gün görünür |
| 7 | Harita oyununda bir konu oyna (ör. YHT, boru hatları) | Dokunma doğru algılanır, doğru cevaptan sonra il adı görünür |
| 8 | Tabu ve Son 30 saniye oyunlarını birer tur oyna | Oyun takılmaz, puan doğru sayılır |
| 9 | Pazar denemesine kayıt ol, deneme günü çöz (veya örnek deneme) | Süre, cevap kaydı ve gönderim sorunsuz; sonuç raporu açılır |
| 10 | Deneme raporunda net, sıralama, ders analizi ve yanlış soruların çözümüne bak | Rapor anlaşılır; "ne çalışmalıyım" sorusuna cevap verir |
| 11 | Koyu temaya geç, uygulamayı kapat-aç | Tema korunur, yazılar okunur |
| 12 | İkinci cihazdan aynı hesapla gir | İlerleme diğer cihazda da görünür |
| 13 | Şifremi unuttum ile şifre sıfırla | Mail gelir, yeni şifre ile giriş yapılır |
| 14 | Ayarlardan adını değiştir, sonra çıkış yap | Değişiklik kaydedilir; çıkışta giriş ekranına döner |

## Hafta sonunda katılımcıya sorulacaklar

1. 1–10 arası: Atanly'yi bir arkadaşına önerir misin?
2. En çok işine yarayan özellik hangisiydi?
3. Seni en çok yoran/sinirlendiren an neydi?
4. Kafa karıştıran bir ekran ya da kelime oldu mu?
5. Hatalı/eksik bulduğun soru veya not oldu mu? (konu + soru numarası)
6. Uygulama hiç yavaşladı, dondu ya da kapandı mı? (cihaz + ne yapıyordun)
7. Para verip kullanır mısın? Hangi özellik için?

## Hata bildirimi formatı

Her hata için: **cihaz + işletim sistemi sürümü**, **ne yaptın** (adım adım), **ne bekliyordun**, **ne oldu**, **ekran görüntüsü/video**.

## Kabul kriteri (yayına çıkış için)

- Görev 1, 2, 4, 9, 10, 12'de **katılımcıların tamamı** "Evet" (bunlar ana akış).
- Diğer görevlerde en az **%80 "Evet"**.
- Çökme / veri kaybı bildirimi **sıfır**.
- Ortalama tavsiye puanı **≥ 8**.
- Bildirilen her hatalı soru düzeltilmiş.

---

## Otomatik testler (geliştirici tarafı, her değişiklikten sonra)

```
npm test          # çekirdek birim testleri, harita doğrulama, canlı deneme motoru, optik okuma
npm run test:sql  # veritabanı senaryoları (yerel PostgreSQL gerekir)
```

Tarayıcı uçtan uca testleri, ekran turu, erişilebilirlik (axe-core), Core Web Vitals ve yük testleri
yayın öncesi kontrollerde çalıştırıldı; sonuçlar sürüm notlarında.
