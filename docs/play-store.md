# Google Play'e yükleme rehberi (Atanly)

Uygulama: **Atanly** · paket adı `app.atanly.mobile` · Expo/EAS projesi `eyuphan.bingol/atanly`
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
npx eas-cli login                 # eyuphan.bingol hesabıyla
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
> Resmî bilgi geçen uygulamalarda Google, açıklamada **resmî kaynak bağlantısı** ve **en üstte görünür bir
> "devlet kurumu değiliz" beyanı** ister (Yanıltıcı İddialar Politikası; 18 Eki 2026'da bu yüzden ret geldi).
> Bu iki bölümü açıklamadan çıkarma. Uygulama içinde aynı bilgiler: Ben › Kaynaklar ve https://www.atanly.com/yasal/kaynaklar
```
ℹ️ Atanly bağımsız bir eğitim uygulamasıdır. ÖSYM'yi ya da herhangi bir kamu kurumunu temsil etmez; bu kurumlarla bağlantısı yoktur. Resmî bilgi için: https://www.osym.gov.tr

Atanly, KPSS Genel Yetenek – Genel Kültür'e hazırlanan lisans, ön lisans ve ortaöğretim adayları için hazırlanmış bir çalışma uygulamasıdır.

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
• Dağlar, faylar, platolar, göller, enerji ve ulaşım hatları harita oyunları
• Tabu, boşluk doldurma ve 30 saniye oyunları

📈 İLERLEMENİ GÖR
• Isı haritası, haftalık özet, ders analizi
• Haftalık sıralama

Hesabın web (atanly.com) ve telefon arasında eşitlenir; kaldığın yerden devam edersin. Verilerin satılmaz.

ÜCRETSİZ VE PREMIUM
Atanly'yi ücretsiz indirip kullanabilirsin. Her bölümün ilk konuları ve oyunları ücretsizdir; diğerlerini kısa bir reklam izleyerek 24 saat açabilir ya da Premium üyelikle (aylık veya yıllık) hepsini reklamsız açabilirsin. İlk canlı deneme kaydın ücretsizdir; sonraki denemeler uygulama içi satın alma ile alınır.

📌 KAYNAKLAR
Uygulamadaki sınav tarihleri ve resmî bilgilerin kaynakları aşağıdadır. Resmî ve güncel bilgi için bu kaynakları esas al:
• ÖSYM (KPSS sınav takvimi, kılavuzlar, tercih ve yerleştirme): https://www.osym.gov.tr
• Mevzuat Bilgi Sistemi (Anayasa ve kanunlar): https://www.mevzuat.gov.tr
• Resmî Gazete (resmî düzenlemeler): https://www.resmigazete.gov.tr
• TÜİK (nüfus ve istatistikler): https://www.tuik.gov.tr
• MEB (öğretim programları): https://www.meb.gov.tr
• TDK (yazım ve dil bilgisi): https://www.tdk.gov.tr
Tüm kaynak listesi: https://www.atanly.com/yasal/kaynaklar

Sorular ÖSYM tarzını örnek alan özgün çalışma sorularıdır; resmî ÖSYM sorusu değildir. Puan tahmini ve taban puanlar yaklaşık değerlerdir; resmî tercih danışmanlığı değildir.

⚠️ SORUMLULUK REDDİ: Atanly bir devlet uygulaması değildir. ÖSYM, MEB veya herhangi bir kamu kurumuyla bağlantısı, ortaklığı ya da onayı yoktur; sınav başvurusu, sonuç ya da tercih gibi resmî işlemler yapmaz.
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
| **Reklamlar** | İlk sürüm: **Hayır**. Ödüllü reklam eklenen sürümü yüklemeden önce **Evet** yapılacak (bkz. 8.5) |
| **İçerik derecelendirmesi** | Anket → Kategori: *Eğitim / referans*. Şiddet, cinsellik, kumar, uyuşturucu: hayır. Kullanıcılar arası iletişim: **hayır** (sohbet yok; sıralamada adın yalnız ilk iki harfi görünür). Konum paylaşımı: hayır. Dijital satın alma: **evet** (Premium ve deneme kaydı). → Sonuç **3+ / Herkes** |
| **Hedef kitle** | **18 yaş ve üstü** (ortaöğretim KPSS adayları da 18+'dır). "Çocuklara hitap ediyor mu": Hayır |
| **Haber uygulaması** | Hayır |
| **Devlet uygulaması** | Hayır (ÖSYM ile bağlantısı yok; açıklamada resmî kurum izlenimi verme, kaynak bağlantılarını ve sorumluluk reddini koru) |
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

## 8. Para kazanma: abonelik ve uygulama içi ürünler

Ödemelerin hepsi Google Play üzerinden alınır; kendi ödeme altyapımız yoktur. Satın almaları RevenueCat
doğrular ve Supabase'e yazar; böylece telefonda alınan Premium web'de de geçerli olur.

Ürünler ancak **ödeme izni (BILLING) olan bir paket yüklendikten sonra** oluşturulabilir. 1.0.13 sürümünden
itibaren paket bu izni içerir: önce adım 2–3 ile bu sürümü dahili teste yükle, sonra aşağıdakileri yap.

### 8.1 Ödeme profili (bir kez)
Play Console → **Ayarlar → Ödeme profili** (Payments profile) → profili oluştur.
- Hesap türü bireysel ise ad-soyad ve adres; ödemelerin yatacağı **banka hesabı (IBAN, TRY)**.
- Vergi bilgileri formunu doldur. Google, Türkiye'deki satışlar için KDV'yi kendisi tahsil edip öder.
- Profil onaylanana kadar ürünleri "etkin" yapamazsın (taslak oluşturabilirsin).

### 8.2 Abonelik: Premium
Para kazanma → **Ürünler → Abonelikler** → Abonelik oluştur
- Ürün kimliği: `atanly_premium` (sonradan değiştirilemez)
- Ad: `Atanly Premium`
- Avantajlar: `Tüm konu ve oyunlar açık` · `Reklamsız`
- **Temel plan 1:** kimlik `aylik` · Otomatik yenilenen · Faturalandırma dönemi **1 ay** · Fiyat **200 TL** (Türkiye) ·
  Ek süre (grace period) 3 gün · Etkinleştir
- **Temel plan 2:** kimlik `yillik` · Otomatik yenilenen · **1 yıl** · Fiyat **1000 TL** · Etkinleştir
- Diğer ülkeler için fiyatı Google'ın döviz çevirisine bırakabilir ya da yalnız Türkiye'de satabilirsin.
- Ücretsiz deneme süresi şimdilik ekleme (istersen sonra "teklif" olarak eklenir).

### 8.3 Uygulama içi ürün: canlı deneme kaydı
Para kazanma → **Ürünler → Uygulama içi ürünler** → Ürün oluştur
- Ürün kimliği: `deneme_kaydi` · Ad: `Canlı deneme kaydı` · Açıklama: `Bir canlı denemeye kayıt hakkı`
- Fiyat: **50 TL** · Etkinleştir. (Tekrar tekrar alınabilir: uygulama her kayıtta "tüketir".)
- Her hesabın ilk denemesi ücretsizdir; bunu sunucu kontrol eder, mağazada ayrıca ayar gerekmez.

### 8.4 Test satın alımları (para çekilmez)
Play Console (ana sayfa) → **Ayarlar → Lisans testi** → kendi Gmail adresini ve test edenleri ekle →
Lisans yanıtı: `RESPOND_NORMALLY`. Bu hesaplarla dahili test sürümünde yapılan satın alımlar ücretsizdir;
test aboneliklerinde 1 ay ≈ 5 dakika sürer.

### 8.5 RevenueCat bağlantısı
1. https://app.revenuecat.com → hesap aç → Proje: `Atanly` → **Google Play** uygulaması ekle, paket adı `app.atanly.mobile`.
2. Google Cloud'da bir **hizmet hesabı** oluştur (adım 3'teki EAS hizmet hesabından **ayrı** olsun), JSON anahtarını
   indir, Play Console → **Kullanıcılar ve izinler** → hizmet hesabını davet et → izinler: *Uygulama bilgilerini görüntüle*,
   *Finansal verileri görüntüle*, *Siparişleri ve abonelikleri yönet*. JSON'u **yalnız RevenueCat'e** yükle
   (depoya, sohbete, e-postaya koyma).
3. RevenueCat'te **Gerçek zamanlı geliştirici bildirimleri** (RTDN) için verdiği Pub/Sub konusunu kopyala →
   Play Console → Para kazanma kurulumu → Google Play Faturalandırma → **Konu adı**na yapıştır → Test bildirimi gönder.
4. RevenueCat → **Products**: `atanly_premium:aylik`, `atanly_premium:yillik`, `deneme_kaydi` ürünlerini içe aktar.
   **Entitlements**: `premium` (iki abonelik planı buna bağlı). **Offerings**: `default` (aylık + yıllık paketler).
5. RevenueCat → API keys → **Google Play public SDK key** (`goog_` ile başlar) uygulamaya girer; bu anahtar gizli değildir.
   Gizli anahtarlar (secret key, webhook şifresi) yalnız Supabase sunucu sırlarına girer.

### 8.6 Ödüllü reklam (AdMob) — ayrı sürümde
1. https://admob.google.com → uygulama ekle (Android, Play'de yayımlanmış/yayımlanacak `app.atanly.mobile`).
2. **Reklam birimi → Ödüllü** → ad: `kilit_ac_24s`. Uygulama kimliği (`ca-app-pub-…~…`) ve birim kimliği (`ca-app-pub-…/…`) gerekir.
3. Reklam içeren sürümü yüklemeden **önce**: Uygulama içeriği → Reklamlar: **Evet**; Veri güvenliği formuna
   "Cihaz veya diğer kimlikler (reklam kimliği) — reklam amaçlı, üçüncü tarafla paylaşılır (Google)" eklenir;
   `yasal/gizlilik` sayfasına AdMob bölümü eklenir (kod tarafında yapılacak).

### 8.6.1 Reklam kimliği beyanı (1.0.13'ten itibaren zorunlu)
Uygulama AdMob paketini içerdiği için Android paketi `AD_ID` iznini taşır. Play Console → **Politika → Uygulama içeriği →
Reklam kimliği**: "Uygulamanız reklam kimliği kullanıyor mu?" → **Evet** → amaç: **Reklam veya pazarlama**.
(Reklamlar sunucudaki anahtar açılana kadar gösterilmez; beyan yine de pakete göre istenir.)

### 8.7 Veri güvenliği formuna eklenecekler (satın alma ile)
| Kategori | Tür | Toplanıyor | Paylaşılıyor | Amaç |
|---|---|---|---|---|
| Finansal bilgiler | **Satın alma geçmişi** | Evet | Hayır (RevenueCat hizmet sağlayıcıdır) | Uygulama işlevselliği |
| Cihaz veya diğer kimlikler | **Cihaz kimliği** | Evet | Hayır | Dolandırıcılığı önleme (ücretsiz denemenin kötüye kullanımı) |

| Cihaz veya diğer kimlikler | **Reklam kimliği** (AdMob) | Evet | **Evet** (Google AdMob) | Reklam |

Kart bilgisi uygulamaya hiç gelmez; ödeme ekranı Google'ındır.

### 8.8 Altyapıyı açma (kod tarafı hazır; anahtarlar kapalı başlar)
Hepsi bir kez yapılır; hiçbirinde şifre ya da gizli anahtar depoya yazılmaz.

1. **Veritabanı:** Supabase → SQL Editor → `supabase/patch-monetization.sql` dosyasını çalıştır (tekrar çalıştırmak güvenli).
   Hiçbir şeyi açmaz; sonunda `enabled = false, live_paywall = false` satırı görünmeli.
2. **Sunucu fonksiyonları** (kendi bilgisayarında, depo kökünde):
   ```bash
   npx supabase login
   npx supabase functions deploy store-sync
   npx supabase functions deploy store-webhook --no-verify-jwt
   npx supabase functions deploy admob-ssv --no-verify-jwt
   ```
3. **Sırlar** (Supabase → Edge Functions → Secrets; değerleri kimseyle paylaşma):
   - `REVENUECAT_SECRET_KEY` → RevenueCat → API keys → **Secret** key (`sk_…`)
   - `REVENUECAT_WEBHOOK_AUTH` → kendin uydur (uzun rastgele bir metin); aynı değeri RevenueCat → Integrations →
     Webhooks → "Authorization header value" alanına yaz. Webhook URL: `https://<proje>.supabase.co/functions/v1/store-webhook`
   - `ADMOB_REWARDED_UNIT_IDS` (isteğe bağlı) → ödüllü reklam biriminin numarası (`ca-app-pub-…/` sonrasındaki sayı)
4. **AdMob sunucu doğrulaması:** AdMob → Uygulamalar → Ödüllü birim → Sunucu tarafı doğrulama → URL:
   `https://<proje>.supabase.co/functions/v1/admob-ssv` → "URL'yi doğrula".
5. **Uygulamadaki kimlikler** (gizli değildir, depoya yazılabilir) — bana gönder, ben girerim:
   - RevenueCat **public** Google Play anahtarı (`goog_…`) → `mobile/src/lib/config.js → monetization.revenueCat.androidKey`
   - AdMob uygulama kimliği (`ca-app-pub-…~…`) → `mobile/app.json` (şu an Google test kimliği yazılı)
   - AdMob ödüllü birim kimliği (`ca-app-pub-…/…`) → `config.js → monetization.admob.rewardedAndroid`
   Bunlar değişince yeni paket (AAB) gerekir.
6. **Açma** (Supabase SQL Editor; yönetici hesabıyla uygulamadan da açılabilir):
   ```sql
   update public.monet_settings set enabled = true;        -- kilitler + Premium
   update public.monet_settings set live_paywall = true;   -- canlı deneme: ilki ücretsiz, sonrası 50 TL
   ```
   Kapatmak için aynı satırları `false` ile çalıştır; kimsenin verisi silinmez.
7. **Test:** Lisans test hesabınla (8.4) dahili test sürümünde Premium al → uygulamada ve web'de kilitlerin açıldığını gör;
   mağazadan iptal et → süre bitince kilitlerin döndüğünü gör. Ödüllü reklamı izle → bölüm 24 saat açık, web'de de açık.

---

## Sık reddedilme nedenleri (kontrol listesi)
- [ ] Gizlilik ve hesap silme bağlantıları açılıyor mu (çıkış yapılmış bir tarayıcıda dene)
- [ ] İnceleme test hesabı çalışıyor mu, e-postası doğrulanmış mı
- [ ] Açıklamada "ÖSYM'nin resmî uygulaması" izlenimi yok (ÖSYM tarzı ifadesi sorun değil)
- [ ] Ekran görüntüleri gerçek uygulamayı gösteriyor (bu klasördekiler gerçek ekranlardan üretildi)
- [ ] Kamera izni açıklaması: yalnızca optik form okuma için
