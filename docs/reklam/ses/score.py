# Kullanım: score.py <satırlar.tsv> <takes_klasörü> <seçilen_klasör> : Whisper ile en net okumayı seçer
import sys, os, re, glob, difflib, shutil, numpy as np, soundfile as sf, sherpa_onnx
D = os.path.dirname(os.path.abspath(__file__)); m = os.environ.get("WHISPER_DIR", f"{D}/models/sherpa-onnx-whisper-small")
asr = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=f"{m}/small-encoder.int8.onnx", decoder=f"{m}/small-decoder.int8.onnx", tokens=f"{m}/small-tokens.txt", language="tr", task="transcribe", num_threads=4)
NUM = {"üç": "3", "beş": "5", "seksen": "80"}
def norm(s):
    s = s.replace("I", "ı").replace("İ", "i").lower(); s = re.sub(r"[^\w\s]", " ", s)
    s = s.replace("ka pe se se", "kpss").replace("ke pe se se", "kpss").replace("kepeses", "kpss")
    return " ".join(NUM.get(x, x) for x in s.split())
lines, tk, outd = sys.argv[1:4]; os.makedirs(outd, exist_ok=True)
for ln in open(lines, encoding="utf-8"):
    if not ln.strip(): continue
    lid, txt = ln.rstrip("\n").split("\t")[0], ln.rstrip("\n").split("\t")[-1]
    best = None
    for p in sorted(glob.glob(f"{tk}/{lid}__*.wav")):
        a, sr = sf.read(p, dtype="float32")
        if a.ndim > 1: a = a.mean(axis=1)
        z = np.zeros(int(sr * .6), dtype="float32"); st = asr.create_stream(); st.accept_waveform(sr, np.concatenate([z, a, z])); asr.decode_stream(st)
        h = st.result.text.strip(); sc = difflib.SequenceMatcher(None, norm(txt), norm(h)).ratio()
        if best is None or sc > best[0]: best = (sc, p, h, len(a) / sr)
    if best:
        shutil.copy(best[1], f"{outd}/{lid}.wav"); print(f"{lid}\t{best[0]:.2f}\t{best[3]:.2f}s\t{best[2]}", flush=True)
