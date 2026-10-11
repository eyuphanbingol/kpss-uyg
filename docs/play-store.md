# Google Play'e yükleme rehberi (Atanly)

Uygulama: **Atanly** · paket adı `app.atanly.mobile` · Expo/EAS projesi `eyphns-team/eyphn`
Görseller bu klasörde: `docs/play-store/`

---

## 0. Bir kez yapılacak hazırlık

1. **Play Console hesabı**: https://play.google.com/console → 25 $ tek seferlik ücret.
   - Bireysel hesapta kimlik doğrulaması ve D-U-N-S gerekmez, ama Google, **yeni bireysel hesaplarda
     üretime çıkmadan önce 12 test kullanıcısıyla 14 gün kapalı test** ister (adım 6).
   - Kuruluş (şirket) hesabı açarsan bu test şartı yoktur, D-U-N-S numarası gerekir.
2. Hesapta **geliştirici iletişim e-postası** zorunlu ve mağazada herkese görünür
   → **atanly10@gmail.com** (sitede ve yasal sayfalarda da bu adres yazılı).

---

## 1. Uygulamayı oluştur

Play Console → **Uygulama oluştur**
- Uygulama adı: `Atanly: KPSS Hazırlık`
- Varsayılan dil: Türkçe (tr-TR)
- Uygulama / oyun: **Uygulama** · Ücretsiz / ücretli: **Ücretsiz**
- Beyanları işaretle → Oluştur

---

## 2. Sürüm dosyasını (AAB) üret

Kendi bilgisayarında, `mobile/` klasöründe:

```bash
npx eas-cli login                 # eyphns-team hesabıyla
npx eas-cli build -p android --profile production
```

- Derleme Expo sunucularında yapılır (~15 dk); bitince `.aab` indirme bağlantısı verir.
- İmza anahtarını EAS üretir ve saklar; **kaybolmaz**, sende ayrıca dosya tutman gerekmez.
- Sürüm numarası (versionCode) her derlemede kendiliğinden artar (`autoIncrement`).

---

## 3. İlk yükleme (elle)

Google, yeni bir uygulamanın **ilk** paketinin elle yüklenmesini ister.

Play Console → **Test ve yayınla → Test → Dahili test** → Yeni sürüm oluştur
1. "Play Uygulama İmzalama"yı kabul et (varsayılan).
2. İndirdiğin `.aab` dosyasını sürükle.
3. Sürüm notu: `İlk sürüm.`
4. Kaydet → İncele → Dahili teste yayınla. Test edenler listesine kendi Gmail adresini ekle.

### Sonraki sürümler (otomatik)
1. Google Cloud'da bir **hizmet hesabı** oluştur, Play Console → Kullanıcılar ve izinler'den
   ona "Sürüm yöneticisi" yetkisi ver, JSON anahtarını indir.
2. JSON'u **depoya koyma**: `npx eas-cli credentials` → Android → Google Service Account →
   dosyayı Expo'ya yükle (Expo'da şifreli saklanır).
3. Sonra her sürüm için:
   ```bash
   npx eas-cli build -p android --profile production --auto-submit
   ```
   Paket dahili test kanalına **taslak** olarak gider (`eas.json → submit`), sen Console'dan yayınlarsın.

---

## 4. Mağaza girişi (Büyüme → Mağazada varlık → Ana mağaza girişi)

**Uygulama adı (30):** `Atanly: KPSS Hazırlık`

**Kısa açıklama (80):**
```
KPSS GY-GK: konu notları, ÖSYM tarzı sorular, deneme raporu ve harita oyunları.
```

**Tam açıklama (4000):**
```
Atanly, KPSS Genel Yetenek – Genel Kültür'e hazırlanan lisans, ön lisans ve ortaöğretim adayları için hazırlanmış ücretsiz bir çalışma uygulamasıdır.

📅 HER GÜN NE ÇALIŞACAĞINI BİL
• Sınav tarihine göre geri sayım ve günlük hedef
• "Şimdi ne çalışayım?" kartı: sıradaki konu, notu ve testi tek dokunuşta
• Akıllı çalışma programı: boş saatlerine ve zayıf konularına göre plan

📚 KONU NOTLARI VE ÖSYM TARZI SORULAR
• Tarih, Coğrafya, Türkçe, Vatandaşlık, Güncel Bilgiler ve Geometri
• Konu konu notlar ve binlerce soru, anında çözüm
• Karışık test, deneme ve tam deneme modları

📝 DENEME VE AYRINTILI RAPOR
• Canlı denemelere katıl, optik formunu telefonla okut
• Ders netlerin, en çok kaçırdığın konular, çözüm süren ve gelişim grafiğin
• Seninle aynı seviyedeki adaylarla karşılaştırma

🎯 EKSİKLERİNİ KAPAT
• Yanlış defteri ve tekrar listesi
• Zayıf konuların otomatik olarak öne çıkar

🗺️ OYNAYARAK ÖĞREN
• Türkiye'yi Fethet: 81 ili harita üstünde bul
• Dağlar, faylar, platolar, enerji ve ulaşım hatları harita oyunu
• Tabu, boşluk doldurma ve 30 saniye oyunları

📈 İLERLEMENİ GÖR
• Isı haritası, haftalık özet, ders analizi
• Haftalık sıralama

Hesabın web (atanly.com) ve telefon arasında eşitlenir; kaldığın yerden devam edersin.
Reklam yok. Verilerin satılmaz ve paylaşılmaz.
```

**Görseller** (`docs/play-store/`):
| Alan | Dosya |
|---|---|
| Uygulama simgesi (512×512) | `uygulama-simgesi-512.png` |
| Öne çıkan görsel (1024×500) | `one-cikan-gorsel-1024x500.png` |
| Telefon ekran görüntüleri (2–8 adet, 1080×1920) | `telefon-1-…` → `telefon-7-…` (sırayla) |

Tablet görselleri isteğe bağlı; boş bırakılabilir.

**Kategori:** Eğitim · **Etiketler:** Eğitim, Sınava hazırlık
**İletişim:** e-posta `atanly10@gmail.com` (zorunlu), web sitesi `https://www.atanly.com`

---

## 5. Uygulama içeriği (Politika → Uygulama içeriği) — cevaplar

| Bölüm | Cevap |
|---|---|
| **Gizlilik politikası** | `https://www.atanly.com/yasal/gizlilik` |
| **Uygulama erişimi** | "Bazı işlevler kısıtlı" → giriş bilgisi ver: inceleme için ayrı bir **test hesabı** aç (e-posta + şifre), buraya yaz. Kendi hesabını verme. |
| **Reklamlar** | Hayır, reklam içermiyor |
| **İçerik derecelendirmesi** | Anket → Kategori: *Eğitim / referans*. Şiddet, cinsellik, kumar, uyuşturucu: hayır. Kullanıcılar arası iletişim: **hayır** (sohbet yok; sıralamada yalnızca takma ad görünür). Konum paylaşımı: hayır. Dijital satın alma: hayır. → Sonuç **3+ / Herkes** |
| **Hedef kitle** | **18 yaş ve üstü** (ortaöğretim KPSS adayları da 18+'dır). "Çocuklara hitap ediyor mu": Hayır |
| **Haber uygulaması** | Hayır |
| **Devlet uygulaması** | Hayır (ÖSYM ile bağlantısı yok; açıklamada resmî kurum izlenimi verme) |
| **Finansal özellikler** | Yok |
| **Sağlık** | Yok |
| **Hesap silme** | Uygulama içinden: Evet (Ben → Hesabımı sil). Web bağlantısı: `https://www.atanly.com/yasal/hesap-silme` |

### Veri güvenliği formu

Genel sorular:
- Veri topluyor veya paylaşıyor mu? **Evet (topluyor)**
- Aktarılan tüm veriler şifreleniyor mu? **Evet** (HTTPS/TLS)
- Kullanıcı verilerinin silinmesini isteyebilir mi? **Evet** → bağlantı: `https://www.atanly.com/yasal/hesap-silme`
- Veriler üçüncü taraflarla **paylaşılıyor mu? Hayır** (Supabase yalnızca altyapı sağlayıcısı — "hizmet sağlayıcı" paylaşım sayılmaz)

Toplanan veri türleri (hepsi: **toplanıyor**, **paylaşılmıyor**, **zorunlu**, amaç: *Uygulama işlevselliği* + *Hesap yönetimi*):
| Kategori | Tür | Not |
|---|---|---|
| Kişisel bilgiler | **Ad** | Profil adı / takma ad |
| Kişisel bilgiler | **E-posta adresi** | Giriş için |
| Kişisel bilgiler | **Kullanıcı kimlikleri** | Hesap kimliği |
| Uygulama etkinliği | **Uygulama etkileşimleri** | Çözülen sorular, ilerleme, deneme sonuçları |
| Uygulama etkinliği | **Kullanıcı tarafından oluşturulan diğer içerikler** | Notlar, yanlış defteri |

Toplanmayanlar: konum, kişiler, fotoğraf/video (optik form fotoğrafı **yalnız cihazda işlenir, sunucuya gönderilmez**),
finansal bilgi, sağlık, mesajlar, cihaz kimliği, kilitlenme/analitik verisi.

---

## 6. Kapalı test → Üretim

Yeni **bireysel** hesaplarda zorunlu:
1. **Test → Kapalı test** → yeni kanal → AAB'yi (dahili testteki sürümü "yükselt") ekle.
2. En az **12 test kullanıcısı** (Gmail adresleri, bir Google Grubu da olur) ekle; katılım bağlantısını gönder.
3. 12 kişinin **14 gün boyunca** uygulamayı yüklü tutması gerekir.
4. 14 gün dolunca **Kontrol paneli → Üretim erişimine başvur** (birkaç soru: test nasıl geçti, ne düzelttin).
5. Onay gelince **Üretim → Yeni sürüm** → aynı sürümü yükselt → Ülkeler: Türkiye → İncelemeye gönder.
   İlk inceleme genelde 1–7 gün sürer.

---

## 7. Yayın sonrası

- Site ile uygulamayı bağla: mağaza bağlantısı belli olunca (`https://play.google.com/store/apps/details?id=app.atanly.mobile`)
  tanıtım sayfasına "Google Play'den indir" düğmesi eklenebilir.
- Her yeni sürümde: `mobile/app.json → expo.version` (örn. 1.0.13) artır → `eas build … --auto-submit`.

## Sık reddedilme nedenleri (kontrol listesi)
- [ ] Gizlilik ve hesap silme bağlantıları açılıyor mu (çıkış yapılmış bir tarayıcıda dene)
- [ ] İnceleme test hesabı çalışıyor mu, e-postası doğrulanmış mı
- [ ] Açıklamada "ÖSYM'nin resmî uygulaması" izlenimi yok (ÖSYM tarzı ifadesi sorun değil)
- [ ] Ekran görüntüleri gerçek uygulamayı gösteriyor (bu klasördekiler gerçek ekranlardan üretildi)
- [ ] Kamera izni açıklaması: yalnızca optik form okuma için
