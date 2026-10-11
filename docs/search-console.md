# Google Search Console ayarları (atanly.com)

Mülk: **atanly.com** (alan adı mülkü, doğrulanmış). "Veri işleniyor" yazısı yeni mülklerde
normaldir; ilk veriler 2–4 gün içinde gelir.

## Bir kez yapılacaklar

1. **Site haritası gönder** — sol menü *Site Haritaları* → "Yeni site haritası ekle" kutusuna:
   ```
   https://www.atanly.com/sitemap.xml
   ```
   → Gönder. Durum birkaç dakika–birkaç saat içinde "Başarılı" olmalı (8 sayfa).

2. **Ana sayfayı dizine ekletmeyi iste** — üstteki arama kutusuna `https://www.atanly.com/` yaz →
   sonuç gelince **Dizine eklenmeyi iste**. Aynısını `https://www.atanly.com/yasal/gizlilik` ve
   `https://www.atanly.com/yasal/hesap-silme` için yap (Google Play bu iki sayfaya bakıyor).

3. **Tek adres kullan (Vercel)** — Vercel → proje → *Settings → Domains*:
   - `www.atanly.com` → birincil (Production)
   - `atanly.com` → "Redirect to www.atanly.com" (308)
   Böylece Google aynı sayfayı iki adreste görmez. `kpss-uyg.vercel.app` adresi artık
   `X-Robots-Tag: noindex` başlığıyla gönderiliyor; arama sonuçlarına girmez.

4. (İsteğe bağlı) **Ayarlar → İlişkilendirmeler** → Google Play uygulaması yayına çıkınca
   `app.atanly.mobile` ile ilişkilendir.

## Sitede yapılmış olanlar
- `sitemap.xml`: uzantısız (temiz) adresler. Site `cleanUrls` kullandığı için `.html` adresleri
  yönlendirme döner; site haritası ve `canonical` etiketleri artık doğrudan son adresi gösteriyor
  (aksi hâlde Search Console "Yönlendirmeli sayfa" diye dizine eklemez).
- `robots.txt`: site haritası adresi yazılı; `/supabase/` ve `/mobile/` kapalı.
- Ana sayfada başlık, açıklama, canonical, Open Graph, yapılandırılmış veri (JSON-LD) ve
  JavaScript kapalıyken görünen içerik var.

## Birkaç gün sonra kontrol
- **Sayfa sayısı (Dizin oluşturma)**: "Dizine eklenmiş" sayısı 8'e yaklaşmalı.
  "Yönlendirmeli sayfa" listesinde `.html` adresleri ve `atanly.com` (www'siz) görmek normaldir;
  bunlar sorun değil, Google asıl adresi dizine ekler.
- **Önemli Web Verileri**: yeterli ziyaretçi olunca dolar.
- **Performans**: hangi aramalarla gelindiğini gösterir (KPSS, KPSS tarih notu vb.).
