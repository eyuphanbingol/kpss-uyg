# Kullanım: selpost.py <id> "<metin>" <çıktı.wav> <aday.wav>... : her adayı yavaşlatıp kırpar, Whisper ile en neti seçer
import sys, os, re, subprocess, tempfile, difflib, shutil, numpy as np, soundfile as sf, sherpa_onnx
D = os.path.dirname(os.path.abspath(__file__)); CB = D; m = os.environ.get("WHISPER_DIR", f"{D}/models/sherpa-onnx-whisper-small")
asr = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=f"{m}/small-encoder.int8.onnx", decoder=f"{m}/small-decoder.int8.onnx", tokens=f"{m}/small-tokens.txt", language="tr", task="transcribe", num_threads=4)
NUM = {"üç": "3", "beş": "5", "seksen": "80"}
def norm(s):
    s = s.replace("I", "ı").replace("İ", "i").lower(); s = re.sub(r"[^\w\s]", " ", s)
    s = s.replace("ka pe se se", "kpss").replace("ke pe se se", "kpss")
    return " ".join(NUM.get(x, x) for x in s.split())
lid, txt, outp, cands = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4:]
best = None
for i, c in enumerate(cands):
    tmp = os.path.join(tempfile.gettempdir(), f"sel_{lid}_{i}.wav")
    subprocess.run([sys.executable, os.path.join(CB, "slow.py"), c, tmp, "0.9"], check=True, capture_output=True)
    subprocess.run([sys.executable, os.path.join(CB, "tail.py"), tmp], check=True, capture_output=True)
    a, sr = sf.read(tmp, dtype="float32"); z = np.zeros(int(sr * .6), dtype="float32")
    st = asr.create_stream(); st.accept_waveform(sr, np.concatenate([z, a, z])); asr.decode_stream(st); h = st.result.text.strip()
    sc = difflib.SequenceMatcher(None, norm(txt), norm(h)).ratio()
    if best is None or sc > best[0]: best = (sc, tmp, h, len(a) / sr)
shutil.copy(best[1], outp); print(f"{lid}\t{best[0]:.2f}\t{best[3]:.2f}s\t{best[2]}  ({len(cands)} aday)")
