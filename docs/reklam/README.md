# Reklam videoları (kaynak)

Üç dikey (1080×1920) sosyal medya reklamı. Görüntü HTML/JS ile kare kare çizilir, müzik Python ile sentezlenir (telifsiz).

| Dosya | Reklam | Süre |
|---|---|---|
| `ad1.html` + `music_a1.py` | "5 saniyen var" (Göbeklitepe sorusu) | 15,6 sn |
| `ad2.html` + `music_a2.py` | "Sinop nerede?" / Türkiye'yi Fethet | 15,3 sn |
| `ad4.html` + `music_a4.py` | "POV: gece yarısı → Hazırsın." | 20 sn |

`base.js` ortak altyapı (renkler, yazı tipleri, sahne/kamera, kapanış ekranı). `trmap.js` il sınırları (`svg/tr.svg`, simplemaps).

## Üretim

```bash
cd docs/reklam
PW=<playwright modülü yolu> node render.js ad1.html preview 1,4,9      # önizleme kareleri → prev/
PW=<playwright modülü yolu> node render.js ad1.html video ad1-sessiz.mp4
python3 music_a1.py                                                    # → music_a1.wav
python3 mix.py ad1-sessiz.mp4 music_a1.wav cikti.mp4 [ses.wav@saniye ...]  # seslendirme isteğe bağlı
```

Seslendirme satırları ve zamanları `final_lines.tsv`, `split_lines.tsv` ve her HTML dosyasının ilk yorum satırında.
Mevcut seslendirme (Piper "fahrettin", sherpa-onnx) kalitesi yetersiz bulundu; daha doğal bir sesle yeniden okutulacak.
`takes.py` her satırı birkaç kez üretip Whisper ile en anlaşılır okumayı seçer, `chk.py` miksajdaki satırları kontrol eder.

## Sürüm 2 (doğal ses)

`ad1v.html`, `ad2v.html`, `ad4v.html` + `music_a1v.py`, `music_a2v.py`, `music_a4v.py`: aynı reklamlar, daha yavaş ve doğal
seslendirmeye göre zamanı esnetilmiş hâlleri (`WARP` tablosu; geri sayımlar gerçek zamanlı kalır). Süreler 22,3 / 18,6 / 21,1 sn.

Seslendirme: Chatterbox Multilingual (Resemble AI, MIT lisansı), Türkçe, hazır ses. Hazır satırlar `ses/*.wav`.
- `ses/gen.py` her satırı K kez üretir (`SEED` ortam değişkeni), `ses/selpost.py` her adayı `slow.py` (%10 yavaşlatma)
  ve `tail.py` (sondaki nefes/tıslama kırpma) sonrası Whisper ile puanlar, en net okumayı seçer.
- "KPSS" metinde `Ka Pe Se Se` diye yazılır; "...saniyen var" kalıbı "Sadece" ile başlayınca net okunur.
- Miksaj: `ECHO=0 MUSG=0.5 SCT=0.015 SCR=10 python3 mix.py video.mp4 muzik.wav cikti.mp4 ses/a1_1.wav@0.2 ...`
  (zamanlar her HTML'in WARP tablosuna göre; reklam 1 için MUSG=0.45 SCT=0.012 SCR=12).

| Reklam | Seslendirme zamanları (sn) |
|---|---|
| 1 | a1_1@0.2 · a1_2@3.2 · a1_3@10.4 · a1_4@14.1 · a1_5@19.2 |
| 2 | a2_1@0.05 · a2_2@5.8 · a2_3@7.1 · a2_4@10.65 · a2_6@13.6 |
| 3 | a4_1@0.4 · a4_2@4.85 · a4_3@9.3 · a4_4a@13.7 · a4_4c@15.85 · a4_5@17.0 |
