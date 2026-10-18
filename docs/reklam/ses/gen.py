# Kullanım: gen.py <satırlar.tsv> <K> <ref.wav|default> <çıktı_klasörü> [exaggeration] [cfg]
# satırlar.tsv: id<TAB>metin. Her satır için K okuma üretir: <klasör>/<id>__<k>.wav
import sys, os, torch, torchaudio as ta
from chatterbox.mtl_tts import ChatterboxMultilingualTTS
torch.set_num_threads(os.cpu_count() or 4)
lines, K, ref, outd = sys.argv[1], int(sys.argv[2]), sys.argv[3], sys.argv[4]
ex = float(sys.argv[5]) if len(sys.argv) > 5 else 0.5
cfg = float(sys.argv[6]) if len(sys.argv) > 6 else 0.5
os.makedirs(outd, exist_ok=True)
m = ChatterboxMultilingualTTS.from_pretrained(device="cpu")
for ln in open(lines, encoding="utf-8"):
    if not ln.strip(): continue
    lid, txt = ln.rstrip("\n").split("\t")[0], ln.rstrip("\n").split("\t")[-1]
    for k in range(K):
        torch.manual_seed(int(os.environ.get("SEED", "1000")) + k)
        kw = dict(language_id="tr", exaggeration=ex, cfg_weight=cfg)
        if ref != "default": kw["audio_prompt_path"] = ref
        w = m.generate(txt, **kw)
        ta.save(f"{outd}/{lid}__{os.environ.get('SEED', '1000')}_{k}.wav", w, m.sr)
        print(lid, k, round(w.shape[-1] / m.sr, 2), flush=True)
