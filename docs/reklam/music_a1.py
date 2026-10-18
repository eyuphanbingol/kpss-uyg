# Reklam 1 müziği (telifsiz, burada sentezlenir): gerilim → geri sayım (tik + kalp atışı) → cevap zili → enerjik kapanış.
import numpy as np, wave
SR = 44100; DUR = 15.6; N = int(SR * DUR); out = np.zeros((N, 2))
rng = np.random.default_rng(7)
def hz(m): return 440 * 2 ** ((m - 69) / 12)
def tt(d): return np.arange(int(d * SR)) / SR
def env(n, a, r):
    e = np.ones(n); a = int(a * SR); r = int(r * SR)
    if a: e[:a] = np.linspace(0, 1, a)
    if r: e[-r:] *= np.linspace(1, 0, r)
    return e
def saw(f, t): return 2 * ((f * t) % 1) - 1
def lp(x, k=12): return np.convolve(x, np.ones(k) / k, mode='same')
def add(sig, start, pan=0.0, g=1.0):
    s = int(start * SR); e = min(N, s + len(sig))
    if s >= N or e <= 0: return
    l = np.sqrt((1 - pan) / 2); r = np.sqrt((1 + pan) / 2)
    out[s:e, 0] += sig[:e - s] * l * g * 1.4; out[s:e, 1] += sig[:e - s] * r * g * 1.4
def pad(notes, d, g):
    t = tt(d); return g * sum(lp(saw(hz(m), t) + saw(hz(m) * 1.005, t), 40) for m in notes) * env(len(t), .3, .5)
def kick(at, g=.42):
    kt = tt(.3); f = 45 + 120 * np.exp(-kt * 35); add(g * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-kt * 9), at)
def impact(at, g=.35):
    it = tt(.9); f = 40 + 60 * np.exp(-it * 8); add(g * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-it * 4) + .1 * lp(rng.standard_normal(len(it)) * np.exp(-it * 10), 4), at)
def riser(end, d=.6, g=.08):
    rt = tt(d); rs = rng.standard_normal(len(rt)); rs = rs - lp(rs, 20); add(g * rs * (rt / d) ** 2, end - d)
# 0–3: gerilim (Am pad + alçak drone), 3'te riser
add(pad([45, 57, 60, 64], 3.2, .05), 0, -.2)
dr = tt(3.0); add(.12 * np.sin(2 * np.pi * hz(33) * dr) * env(len(dr), .05, .3), 0)
for i, at in enumerate([0.25, 1.35]): impact(at, .25)
riser(3.0, 1.0, .07)
# 3–8: geri sayım: her saniye tik + kalp atışı; son 2 sn hızlanır
for k in range(5):
    at = 3.0 + k
    for j, step in enumerate([0, .5] if k < 3 else [0, .25, .5, .75]):
        tk = tt(.04); f = 2600 if j == 0 else 2000
        add(.16 * np.sin(2 * np.pi * f * tk) * np.exp(-tk * 110), at + step, .25)
    for off, g in [(0, .5), (.16, .32)]:
        ht = tt(.25); f = 55 + 40 * np.exp(-ht * 30); add(g * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-ht * 14), at + off)
add(pad([45, 52, 57, 60], 5.2, .035), 3.0, .2)
riser(8.0, 2.0, .06)
# 8.0: süre bitti darbe, 8.15: başarı zili (C majör arpej)
impact(8.0, .45)
for i, m in enumerate([72, 76, 79, 84]):
    bt = tt(1.2); bell = sum(a * np.sin(2 * np.pi * hz(m) * k * bt) for k, a in [(1, 1), (2, .4), (3, .15)]) * np.exp(-bt * 3.5)
    add(.11 * bell, 8.15 + i * .07, -.3 + i * .2)
# 8.6–15.6: enerjik ritim, C-G-Am-F, 124 BPM
B = 60 / 124; BAR = 4 * B; prog = [[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]]
st0 = 8.6
for bi in range(int((DUR - st0) / BAR) + 1):
    st = st0 + bi * BAR; ch = prog[bi % 4]
    add(pad(ch, BAR + .3, .04), st, -.2)
    for i in range(8):
        bt = tt(.22); f = hz(ch[0] - 24); add(.2 * (np.sin(2 * np.pi * f * bt) + .4 * lp(saw(f, bt), 8)) * np.exp(-bt * 7), st + i * B / 2)
    notes = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[1] + 24] * 4
    for i, m in enumerate(notes):
        at = tt(.18); add(.05 * (np.sin(2 * np.pi * hz(m) * at) + .25 * np.sin(4 * np.pi * hz(m) * at)) * np.exp(-at * 14), st + i * B / 4, .35 if i % 2 else -.35)
    for i in range(4):
        kick(st + i * B)
        if i % 2 == 1:
            c = rng.standard_normal(int(.15 * SR)) * np.exp(-tt(.15) * 28); add(.12 * (c - lp(c, 6)), st + i * B)
    for i in range(8):
        h = rng.standard_normal(int(.05 * SR)); h = h - lp(h, 3); add(.035 * h * np.exp(-tt(.05) * 60), st + i * B / 2 + B / 4, .3)
for c in [10.25, 12.9]: impact(c, .3); riser(c, .45, .07)
ft = tt(3.0); add(pad([60, 64, 67, 72], 3.0, .05), 12.9)
fade = np.ones(N); fo = int(1.2 * SR); fade[-fo:] = np.linspace(1, 0, fo); out *= fade[:, None]
out = out / np.max(np.abs(out)) * .85
w = wave.open('music_a1.wav', 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype(np.int16).tobytes()); w.close(); print("ok")
