# Reklam 3 (POV) müziği (telifsiz, burada sentezlenir): gece piyanosu → yükselen ritim → "Hazırsın" doruğu → sıcak kapanış.
import numpy as np, wave
SR = 44100; DUR = 21.1; N = int(SR * DUR); out = np.zeros((N, 2))
rng = np.random.default_rng(5)
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
def piano(m, at, g=.08, d=2.2, pan=0):
    t = tt(d); f = hz(m)
    s = sum(a * np.sin(2 * np.pi * f * k * t * (1 + .0004 * k)) * np.exp(-t * (1.6 + k * .9)) for k, a in [(1, 1), (2, .45), (3, .22), (4, .1), (5, .05)])
    s *= env(len(t), .004, .3); add(g * s, at, pan)
def pad(notes, d, g, a=.6):
    t = tt(d); return g * sum(lp(saw(hz(m), t) + saw(hz(m) * 1.004, t), 60) for m in notes) * env(len(t), a, .8)
def kick(at, g=.3):
    kt = tt(.3); f = 45 + 110 * np.exp(-kt * 35); add(g * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-kt * 9), at)
def impact(at, g=.3):
    it = tt(1.2); f = 38 + 50 * np.exp(-it * 7); add(g * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-it * 3.2) + .08 * lp(rng.standard_normal(len(it)) * np.exp(-it * 6), 5), at)
def swell(end, d=1.5, g=.06):
    rt = tt(d); rs = rng.standard_normal(len(rt)); rs = rs - lp(rs, 6); add(g * rs * (rt / d) ** 3, end - d)
# 0–8.6: gece: Am–F–C–G piyano arpejleri, 76 BPM, yumuşak pad + saat tıkırtısı
B = 60 / 76; prog = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]
for bi in range(3):
    st = .2 + bi * 4 * B * 0.75; ch = prog[bi % 4]
    piano(ch[0] - 12, st, .09, 3.0)
    for i, m in enumerate([ch[0], ch[1], ch[2], ch[1] + 12, ch[2], ch[1]]):
        piano(m + 12, st + i * B * .5, .05, 1.8, -.3 + .12 * i)
add(pad([45, 57, 60, 64], 4.6, .022, 1.0), 0, -.2)
for k in range(4):
    tk = tt(.03); add(.05 * np.sin(2 * np.pi * 3000 * tk) * np.exp(-tk * 140), .3 + k)
# 4.2: telefon bildirimi (iki nota) + 7.1 dokunuş
for i, m in enumerate([84, 88]):
    t = tt(.6); add(.07 * np.sin(2 * np.pi * hz(m) * t) * np.exp(-t * 6), 5.0 + i * .11, .2)
pt = tt(.08); add(.12 * np.sin(2 * np.pi * 1400 * pt) * np.exp(-pt * 60), 7.6)
for bi in range(2):
    st = 4.85 + bi * 2.1; ch = prog[(bi + 2) % 4]
    piano(ch[0] - 12, st, .08, 2.6)
    for i, m in enumerate([ch[0], ch[1], ch[2], ch[1] + 12]):
        piano(m + 12, st + i * .4, .045, 1.6, -.2 + .15 * i)
add(pad([48, 55, 60, 64], 4.6, .025, .8), 4.65, .2)
# 8.55–12.7: yükseliş: C–G–Am–F, 96 BPM, hafif davul + nabız
B2 = 60 / 96; BAR = 4 * B2; prog2 = [[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]]
for bi in range(2):
    st = 9.1 + bi * BAR; ch = prog2[bi % 4]
    add(pad(ch, BAR + .4, .03, .3), st, -.15)
    piano(ch[0] - 12, st, .08, 2.5)
    for i in range(8):
        piano(ch[i % 3] + 12 + (12 if i == 7 else 0), st + i * B2 / 2, .04, 1.2, .3 if i % 2 else -.3)
    for i in range(4):
        kick(st + i * B2, .22 + .04 * bi)
        if i % 2 == 1:
            c = rng.standard_normal(int(.12 * SR)) * np.exp(-tt(.12) * 30); add(.06 * (c - lp(c, 6)), st + i * B2)
swell(13.5, 2.0, .05)
# 12.7–15.7: sınav sabahı: geniş akor, 14.75 "Hazırsın" doruğu
impact(13.35, .1)
add(pad([48, 55, 60, 64, 67], 3.3, .035, 1.2), 13.5)
swell(15.75, 1.0, .03)
impact(15.65, .26)
for i, m in enumerate([60, 64, 67, 72, 76, 79]):
    piano(m + 12, 15.78 + i * .06, .06, 2.4, -.4 + .16 * i)
add(pad([48, 60, 64, 67, 72], 5.4, .045, .2), 15.75)
# 15.6–20: sıcak kapanış (F–G–C), hafif ritim
for bi, ch in enumerate([[53, 57, 60], [55, 59, 62], [48, 52, 55]]):
    st = 16.8 + bi * 1.4
    piano(ch[0] - 12, st, .08, 2.6)
    for i, m in enumerate([ch[0], ch[1], ch[2], ch[1] + 12]):
        piano(m + 12, st + i * .35, .045, 1.6, -.2 + .15 * i)
    kick(st, .2); kick(st + .7, .16)
fade = np.ones(N); fo = int(1.6 * SR); fade[-fo:] = np.linspace(1, 0, fo); out *= fade[:, None]
out = out / np.max(np.abs(out)) * .85
w = wave.open('music_a4v.wav', 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype(np.int16).tobytes()); w.close(); print("ok")
