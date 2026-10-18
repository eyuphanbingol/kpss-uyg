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
