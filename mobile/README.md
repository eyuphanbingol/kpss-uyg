# Atanom mobil (React Native / Expo)

Web ile **aynı Supabase hesap ve ilerleme**. Klasör: `mobile/` (statik PWA kökünü bozmaz).

## Çalıştır

```bash
cd mobile
npm install
npx expo start
```

Expo Go ile QR oku (aynı Wi‑Fi).

İçerik güncellenince kökten:

```bash
node scripts/export-catalog.js
```

## Google / şifre sıfırlama

Supabase Auth URL listesine ekle:

- `atanom://auth/callback`
- `atanom://reset`

Google Cloud OAuth iOS/Android client ID’leri Expo’da ayrıca gerekir; e-posta girişi anahtarsız çalışır.
