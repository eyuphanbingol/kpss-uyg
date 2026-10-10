# Atanly e-posta şablonları (Supabase Auth)

Kayıt onayı, şifre sıfırlama gibi mailler varsayılan olarak `Supabase Auth <noreply@mail.app.supabase.io>`
adresinden İngilizce gider. Atanly'den gidiyormuş gibi görünmesi için iki şey gerekir:

1. **Gönderen adresi**: kendi SMTP servisini bağla (aşağıda 1. adım). Bu olmadan gönderen hep Supabase kalır.
2. **İçerik**: bu klasördeki Türkçe, Atanly tasarımlı şablonlar (2. adım).

Şablonlar `node scripts/build-email-templates.js` ile üretilir; tasarımı değiştirmek için betiği düzenle
ve yeniden çalıştır, dosyaları elle düzenleme.

## 1. Gönderen adresini `Atanly <noreply@atanly.com>` yap

Örnek servis: **Resend** (resend.com; ücretsiz planı ayda 3.000, günde 100 mail). Brevo, Postmark,
Amazon SES gibi başka bir SMTP servisi de aynı şekilde çalışır.

1. resend.com'da hesap aç → **Domains → Add domain** → `atanly.com`.
2. Resend'in verdiği DNS kayıtlarını (SPF için TXT/MX, DKIM için TXT) alan adını yönettiğin yere ekle
   (Vercel DNS ya da alan adını aldığın firma). "Verified" olmasını bekle; bu kayıtlar mailin spam'e
   düşmemesini sağlar.
3. İsteğe bağlı ama önerilir: DMARC kaydı ekle →
   TXT `_dmarc.atanly.com` = `v=DMARC1; p=none; rua=mailto:destek@atanly.com`
4. Resend → **API Keys → Create** (Sending access) → anahtarı kopyala.
5. Supabase paneli → **Authentication → Emails → SMTP Settings** → *Enable custom SMTP*:

   | Alan | Değer |
   |---|---|
   | Sender email | `noreply@atanly.com` |
   | Sender name | `Atanly` |
   | Host | `smtp.resend.com` |
   | Port | `465` |
   | Username | `resend` |
   | Password | Resend API anahtarı |

   Anahtarı bu repoya ya da herhangi bir dosyaya yazma; yalnız Supabase paneline gir.
6. Özel SMTP açılınca Supabase saatlik mail sınırını düşük başlatır.
   **Authentication → Rate Limits** bölümünden "emails per hour" değerini ihtiyaca göre artır.

## 2. Şablonları yapıştır

Supabase paneli → **Authentication → Emails → Templates**. Her şablon için konuyu yaz, dosyanın
tamamını "Message body" alanına yapıştır, kaydet.

| Paneldeki şablon | Konu (Subject) | Dosya |
|---|---|---|
| Confirm signup | Atanly hesabını onayla | `confirm-signup.html` |
| Reset password | Atanly şifre sıfırlama | `reset-password.html` |
| Magic link | Atanly giriş bağlantın | `magic-link.html` |
| Change email address | Atanly e-posta değişikliğini onayla | `change-email.html` |
| Invite user | Atanly'ye davet edildin | `invite.html` |
| Reauthentication | Atanly doğrulama kodun | `reauthentication.html` |

Şablonlar kayıtta gönderilen adı (`{{ .Data.full_name }}`) kullanır: "Merhaba Eyüphan," gibi.
Ad yoksa "Merhaba," yazar.

## 3. Bağlantıların doğru yere gitmesi

**Authentication → URL Configuration**:

- Site URL: `https://www.atanly.com`
- Redirect URLs: `https://www.atanly.com/auth/callback`, `https://www.atanly.com/auth/reset`,
  `https://www.atanly.com/**`, `atanly://auth/callback`, `atanly://reset`

## Bağlantılar neden atanly.com'a gidiyor

Kayıt onayı ve şifre sıfırlama maillerindeki düğme `https://www.atanly.com/auth/callback?token_hash=…`
ve `https://www.atanly.com/auth/reset?token_hash=…` adresine gider (Supabase adresine değil):

- Gönderen alan adı ile bağlantı alan adı aynı olur; Outlook/Gmail farklı alan adına giden
  bağlantıyı oltalama şüphesi sayıp maili gereksiz klasörüne atabilir.
- Bağlantı başka cihazda da çalışır (sıfırlamayı telefonda isteyip maili bilgisayarda açmak gibi).

Telefonda sayfa önce uygulamayı açar; uygulama yoksa siteye geçer. Doğrulama web'de
`js/supabaseClient.js`, mobilde `mobile/src/AppProvider.js` içinde `verifyOtp` ile yapılır.

## Gereksiz (spam) klasörüne düşerse

- Yeni alan adlarının itibarı sıfırdan başlar; ilk günlerde Outlook/Hotmail bazı mailleri gereksiz
  klasörüne atabilir. Gelen maili "Gereksiz değil" olarak işaretlemek ve gönderen adresini kişilere
  eklemek itibarı hızlandırır.
- Resend → Domains → atanly.com: DKIM ve SPF kayıtlarının yeşil (Verified) olduğunu kontrol et.
- DMARC kaydı (`_dmarc` TXT `v=DMARC1; p=none;`) ekli olsun.
- Gereksiz klasöründeki maillerde Outlook resimleri (logo) güvenlik için gösterilmez; mail gelen
  kutusuna geçince logo görünür.

## 4. Dene

Uygulamada "Şifremi unuttum" ile kendine mail gönder. Gönderen `Atanly <noreply@atanly.com>`, içerik
Türkçe ve logolu olmalı. Mail spam'e düşerse 1. adımdaki DNS kayıtlarının "Verified" olduğunu kontrol et.
