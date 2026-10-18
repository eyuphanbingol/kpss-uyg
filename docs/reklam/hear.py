# Kullanım: hear.py <wav>... : Whisper-small (tr) ile yazıya döker
import sys, sherpa_onnx, soundfile as sf, numpy as np
m = __import__("os").environ.get("TTS_DIR", "tts") + "/models/sherpa-onnx-whisper-small"
r = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=f"{m}/small-encoder.int8.onnx", decoder=f"{m}/small-decoder.int8.onnx",
    tokens=f"{m}/small-tokens.txt", language="tr", task="transcribe", num_threads=4)
for p in sys.argv[1:]:
    a, sr = sf.read(p, dtype="float32")
    if a.ndim > 1: a = a.mean(axis=1)
    s = r.create_stream(); s.accept_waveform(sr, a); r.decode_stream(s)
    print(p.split("/")[-1], "→", s.result.text.strip())
