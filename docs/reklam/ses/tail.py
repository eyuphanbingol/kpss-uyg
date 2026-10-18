# Kullanım: tail.py <wav>... : sondaki kısık (en yüksek seviyenin %20'si altı) parçaları atar, 120 ms sönümle keser (yerinde)
import sys, numpy as np, soundfile as sf
for p in sys.argv[1:]:
    a, sr = sf.read(p, dtype="float32"); w = int(sr * .02)
    e = np.array([np.sqrt(np.mean(a[i:i + w] ** 2)) for i in range(0, len(a) - w, w)]); on = e > e.max() * .05
    segs = []; i = 0
    while i < len(on):
        if on[i]:
            j = i
            while j < len(on) and on[j]: j += 1
            segs.append((i, j, e[i:j].max() / e.max())); i = j
        else: i += 1
    end = max(j for i, j, pk in segs if pk >= .2) * w + int(sr * .12); end = min(end, len(a))
    b = a[:end].copy(); f = int(sr * .12); b[-f:] *= np.linspace(1, 0, f)
    sf.write(p, b, sr); print(p.split("/")[-1][:-4], round(len(a) / sr, 2), "→", round(len(b) / sr, 2))
