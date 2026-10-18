# Reklam 2 müziği (telifsiz, burada sentezlenir): merak → 3 sn geri sayım → bulundu → oyun ritmi + il "bip"leri → zafer → kapanış.
import numpy as np, wave
SR = 44100; DUR = 15.3; N = int(SR * DUR); out = np.zeros((N, 2))
rng = np.random.default_rng(11)
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
def kick(at, g=.4):
    kt = tt(.3); f = 45 + 120 * np.exp(-kt * 35); add(g * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-kt * 9), at)
def impact(at, g=.32):
    it = tt(.9); f = 40 + 60 * np.exp(-it * 8); add(g * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-it * 4) + .1 * lp(rng.standard_normal(len(it)) * np.exp(-it * 10), 4), at)
def riser(end, d=.6, g=.07):
    rt = tt(d); rs = rng.standard_normal(len(rt)); rs = rs - lp(rs, 20); add(g * rs * (rt / d) ** 2, end - d)
def pluck(m, at, g=.06, pan=0):
    bt = tt(.25); add(g * (np.sin(2 * np.pi * hz(m) * bt) + .3 * np.sin(4 * np.pi * hz(m) * bt)) * np.exp(-bt * 16), at, pan)
def bell(m, at, g=.1, pan=0):
    bt = tt(1.2); add(g * sum(a * np.sin(2 * np.pi * hz(m) * k * bt) for k, a in [(1, 1), (2, .4), (3, .15)]) * np.exp(-bt * 3.5), at, pan)
# 0–2.1: merak (pentatonik plucklar + yumuşak pad)
add(pad([50, 57, 62, 66], 2.4, .04), 0, -.2)
for i, m in enumerate([74, 76, 79, 81, 79, 76, 74, 71]): pluck(m, .15 + i * .22, .03, -.4 + i * .1)
impact(0, .18)
# 2.1–5.1: geri sayım: 3 tik + kalp atışı; nişangâh "tarama" sesi
for k in range(3):
    at = 2.1 + k
    for j, step in enumerate([0, .5]):
        tk = tt(.04); add(.15 * np.sin(2 * np.pi * (2600 if j == 0 else 2000) * tk) * np.exp(-tk * 110), at + step, .25)
    for off, g in [(0, .45), (.16, .3)]:
        ht = tt(.25); f = 55 + 40 * np.exp(-ht * 30); add(g * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-ht * 14), at + off)
sw = tt(3.0); add(.025 * np.sin(2 * np.pi * (600 + 250 * np.sin(sw * 5)) * sw) * env(len(sw), .2, .3), 2.0, .3)
riser(5.1, 1.2, .06)
# 5.1: bulundu! darbe + raptiye düşüş "pop" + zil
impact(5.1, .4)
pt = tt(.2); add(.25 * np.sin(2 * np.pi * np.cumsum(900 * np.exp(-pt * 12) + 200) / SR) * np.exp(-pt * 20), 5.25)
for i, m in enumerate([74, 78, 81, 86]): bell(m, 5.15 + i * .07, .09, -.3 + i * .2)
# 6.2–11.4: oyun ritmi D-A-Bm-G, 128 BPM + il bipleri (yükselen pentatonik)
B = 60 / 128; BAR = 4 * B; prog = [[62, 66, 69], [57, 61, 64], [59, 62, 66], [55, 59, 62]]
st0 = 6.2
for bi in range(int((DUR - st0) / BAR) + 1):
    st = st0 + bi * BAR; ch = prog[bi % 4]
    add(pad(ch, BAR + .3, .035), st, -.2)
    for i in range(8):
        bt = tt(.2); f = hz(ch[0] - 24); add(.18 * (np.sin(2 * np.pi * f * bt) + .4 * lp(saw(f, bt), 8)) * np.exp(-bt * 8), st + i * B / 2)
    for i in range(4):
        kick(st + i * B)
        if i % 2 == 1:
            c = rng.standard_normal(int(.15 * SR)) * np.exp(-tt(.15) * 28); add(.11 * (c - lp(c, 6)), st + i * B)
    for i in range(8):
        h = rng.standard_normal(int(.05 * SR)); h = h - lp(h, 3); add(.03 * h * np.exp(-tt(.05) * 60), st + i * B / 2 + B / 4, .3)
PENT = [62, 64, 66, 69, 71]
for i in range(80):
    at = 6.2 + (i / 80) * 4.8; m = PENT[i % 5] + 12 * (1 + (i * 2) // 80)
    pluck(m, at, .016 + .008 * (i / 80), .5 if i % 2 else -.5)
for at, m in [(6.9, 81), (7.9, 83), (8.9, 86)]: bell(m, at, .07)
riser(11.0, 1.4, .07)
# 11.0: zafer fanfarı
impact(11.0, .42)
for i, m in enumerate([62, 66, 69, 74, 78, 81]): bell(m, 11.0 + i * .05, .08, -.4 + i * .16)
add(pad([62, 66, 69, 74], 4.3, .05), 11.0)
impact(11.4, .25)
fade = np.ones(N); fo = int(1.2 * SR); fade[-fo:] = np.linspace(1, 0, fo); out *= fade[:, None]
out = out / np.max(np.abs(out)) * .85
w = wave.open('music_a2.wav', 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype(np.int16).tobytes()); w.close(); print("ok")
