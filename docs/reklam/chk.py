# Kullanım: chk.py <mix.wav> <başlangıç:süre> ... : miksajdaki her seslendirme parçasını ayrı yazıya döker
import sys, numpy as np, soundfile as sf, sherpa_onnx
m = __import__("os").environ.get("TTS_DIR", "tts") + "/models/sherpa-onnx-whisper-small"
r = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=f"{m}/small-encoder.int8.onnx", decoder=f"{m}/small-decoder.int8.onnx", tokens=f"{m}/small-tokens.txt", language="tr", task="transcribe", num_threads=4)
a, sr = sf.read(sys.argv[1], dtype="float32")
for spec in sys.argv[2:]:
    s, d = map(float, spec.split(":")); x = a[int((s - .15) * sr):int((s + d + .25) * sr)]
    z = np.zeros(int(sr * .5), dtype="float32"); st = r.create_stream(); st.accept_waveform(sr, np.concatenate([z, x, z])); r.decode_stream(st)
    print(f"{s:5.2f}s →", st.result.text.strip())
