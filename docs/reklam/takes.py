# Her satırı K kez seslendirir, Whisper ile yazıya döker, hedef metne en yakın okumayı seçer.
import sys, re, difflib, numpy as np, soundfile as sf, sherpa_onnx
D = __import__("os").environ.get("TTS_DIR", "tts")
K = int(sys.argv[2]) if len(sys.argv) > 2 else 8
base = f"{D}/models/vits-piper-tr_TR-fahrettin-medium"
def mk(ls):
    return sherpa_onnx.OfflineTts(sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(
        vits=sherpa_onnx.OfflineTtsVitsModelConfig(model=f"{base}/tr_TR-fahrettin-medium.onnx", tokens=f"{base}/tokens.txt",
            data_dir=f"{base}/espeak-ng-data", length_scale=ls, noise_scale=0.667, noise_scale_w=0.8), num_threads=4)))
m = f"{D}/models/sherpa-onnx-whisper-small"
asr = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=f"{m}/small-encoder.int8.onnx", decoder=f"{m}/small-decoder.int8.onnx",
    tokens=f"{m}/small-tokens.txt", language="tr", task="transcribe", num_threads=4)
NUM = {"üç": "3", "beş": "5", "seksen": "80"}
def norm(s):
    s = s.replace("I", "ı").replace("İ", "i").lower()
    s = re.sub(r"[^\w\s]", " ", s)
    w = [NUM.get(x, x) for x in s.split()]
    return " ".join(w)
def hear(a, sr):
    z = np.zeros(int(sr * .6), dtype="float32"); st = asr.create_stream(); st.accept_waveform(sr, np.concatenate([z, a, z])); asr.decode_stream(st); return st.result.text.strip()
cache = {}
for line in open(sys.argv[1], encoding="utf-8"):
    lid, ls, txt = line.rstrip("\n").split("\t"); ls = float(ls)
    if ls not in cache: cache[ls] = mk(ls)
    best = None
    for k in range(K):
        g = cache[ls].generate(txt, sid=0, speed=1.0); a = np.array(g.samples, dtype="float32")
        h = hear(a, g.sample_rate); sc = difflib.SequenceMatcher(None, norm(txt), norm(h)).ratio()
        if best is None or sc > best[0]: best = (sc, a, g.sample_rate, h)
        if sc >= 0.99: break
    sf.write(f"{D}/vo/{lid}.wav", best[1], best[2])
    print(f"{lid}\t{best[0]:.2f}\t{len(best[1])/best[2]:.2f}s\t{best[3]}", flush=True)
