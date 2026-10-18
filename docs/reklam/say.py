# Kullanım: say.py <ses> <hız(length_scale)> <çıktı.wav> "<metin>"
import sys, sherpa_onnx, soundfile as sf
voice, ls, out, text = sys.argv[1], float(sys.argv[2]), sys.argv[3], sys.argv[4]
d = sys.argv[5] if len(sys.argv) > 5 else __import__("os").environ.get("TTS_DIR", "tts") + "/models"
base = f"{d}/vits-piper-tr_TR-{voice}-medium"
cfg = sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(
    vits=sherpa_onnx.OfflineTtsVitsModelConfig(model=f"{base}/tr_TR-{voice}-medium.onnx", tokens=f"{base}/tokens.txt",
        data_dir=f"{base}/espeak-ng-data", length_scale=ls, noise_scale=float(__import__("os").environ.get("NS","0.667")), noise_scale_w=float(__import__("os").environ.get("NW","0.8"))), num_threads=4))
tts = sherpa_onnx.OfflineTts(cfg)
a = tts.generate(text, sid=0, speed=1.0)
sf.write(out, a.samples, a.sample_rate)
print(out, round(len(a.samples) / a.sample_rate, 2), "sn")
