# Kullanım: slow.py <giriş.wav> <çıkış.wav> [tempo=0.9] : baş/son sessizliği kırpar, perdeyi koruyarak yavaşlatır
import sys, subprocess, numpy as np, soundfile as sf
src, dst = sys.argv[1], sys.argv[2]; tempo = float(sys.argv[3]) if len(sys.argv) > 3 else 0.9
a, sr = sf.read(src, dtype="float32")
if a.ndim > 1: a = a.mean(axis=1)
w = int(sr * .01); e = np.array([np.sqrt(np.mean(a[i:i + w] ** 2)) for i in range(0, len(a) - w, w)])
idx = np.where(e > max(e.max() * .03, 1e-4))[0]
a = a[max(0, idx[0] * w - int(sr * .03)):min(len(a), (idx[-1] + 1) * w + int(sr * .1))]
tmp = dst + ".raw.wav"; sf.write(tmp, a, sr)
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", tmp, "-af", f"atempo={tempo}", dst], check=True)
print(f"{dst.split('/')[-1][:-4]}\t{len(a) / sr / tempo:.2f}")
