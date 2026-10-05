# -*- coding: utf-8 -*-
"""
Geometri konularına ÖSYM/KPSS tarzı şekilli sorular üretir.

Her soru, şekli verilen ölçülerden hesaplanarak çizilir ve cevabı bu betikte yeniden
hesaplanıp doğrulanır (yanlış şık ya da tutarsız şekil varsa betik hata verir).
Şekiller ÖSYM kitapçığı gibi siyah-beyazdır ve cevabı ele vermez.

Çıktılar:
  img/geometri/soru-<konu>-<n>.png   (web ve mobil aynı dosyayı kullanır)
  sorular/geometri-<konu>.js         dosyasının sonuna, işaretli blok içinde sorular
                                     (mevcut soruların sırası değişmez; ilerleme kayıtları korunur)

    python3 scripts/build_geo_questions.py           -> yazar
    python3 scripts/build_geo_questions.py --check   -> güncel değilse hata verir
    python3 scripts/build_geo_questions.py --sheet out.html
"""
import json
import math
import os
import re
import subprocess
import sys

sys.dont_write_bytecode = True
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build_geo_figures as G  # noqa: E402

ROOT = G.ROOT
INK = "#111827"
SOFT = "#f8fafc"
PNG_VERSION = 1

MARK_START = "// >>> şekilli sorular: scripts/build_geo_questions.py üretir, elle düzenleme"
MARK_END = "// <<< şekilli sorular"


# ---------------------------------------------------------------
# yardımcılar: matematik koordinatı (y yukarı) -> ekran
# ---------------------------------------------------------------

def P(deg, r=1.0, o=(0.0, 0.0)):
    return (o[0] + r * math.cos(math.radians(deg)), o[1] + r * math.sin(math.radians(deg)))


def inter(p, d1, q, d2):
    """p + t*d1 ile q + s*d2 doğrularının kesişimi."""
    den = d1[0] * d2[1] - d1[1] * d2[0]
    t = ((q[0] - p[0]) * d2[1] - (q[1] - p[1]) * d2[0]) / den
    return (p[0] + t * d1[0], p[1] + t * d1[1])


def angle_at(v, p, q):
    a = math.atan2(p[1] - v[1], p[0] - v[0])
    b = math.atan2(q[1] - v[1], q[0] - v[0])
    d = abs(math.degrees(a - b)) % 360
    return 360 - d if d > 180 else d


def dist(p, q):
    return math.hypot(p[0] - q[0], p[1] - q[1])


def close(a, b, eps=1e-6):
    return abs(a - b) < eps


class Q:
    """Tek bir şekilli soru."""

    def __init__(self, w=320, h=210):
        self.F = G.Fig(w, h, "Soru şekli")
        self.F.items = []
        self.map = None

    # matematik noktalarını kutuya sığdır (oran korunur, y ters çevrilir)
    def fit(self, pts, pad=(34, 30, 34, 30)):
        xs = [p[0] for p in pts]
        ys = [p[1] for p in pts]
        x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
        left, top, right, bottom = pad
        W = self.F.w - left - right
        H = self.F.h - top - bottom
        k = min(W / ((x1 - x0) or 1), H / ((y1 - y0) or 1))
        ox = left + (W - (x1 - x0) * k) / 2
        oy = top + (H - (y1 - y0) * k) / 2
        self.map = lambda p: (ox + (p[0] - x0) * k, oy + (y1 - p[1]) * k)
        self.k = k
        return self.map

    def s(self, p):
        return self.map(p)


def mono(F):
    """Şekli ÖSYM kitapçığı gibi siyah-beyaz yap."""
    out = []
    for it in F.items:
        it = re.sub(r'(fill|stroke)="#(?:dc2626|0369a1|047857|7c3aed|64748b|334155|0f172a)"', r'\1="%s"' % INK, it)
        it = it.replace('fill="#e0f2fe"', 'fill="%s"' % SOFT).replace('fill="#fef3c7"', 'fill="%s"' % SOFT)
        it = it.replace('fill="#bae6fd"', 'fill="#eef2f6"').replace('fill="#c7e9fb"', 'fill="#e2e8f0"')
        out.append(it)
    F.items = out
    return F


# kısa çizim yardımcıları (ekran koordinatında)
def lab(F, p, s, dx=0, dy=0, size=14, italic=False):
    F.text((p[0] + dx, p[1] + dy), s, color=INK, size=size, italic=italic)


def vlabels(F, pts, names, center, gap=14):
    for p, n in zip(pts, names):
        F.vlabel(p, n, center, gap=gap, color=INK, size=14)


def ang(F, v, p, q, r, text=None, lr=None, size=12, italic=False):
    F.arc(v, p, q, r, color=INK, sw=1.4)
    if text:
        a1 = math.atan2(p[1] - v[1], p[0] - v[0])
        a2 = math.atan2(q[1] - v[1], q[0] - v[0])
        d = (a2 - a1) % (2 * math.pi)
        am = a1 + d / 2 if d <= math.pi else a1 - (2 * math.pi - d) / 2
        rr = lr or r + 12
        F.text((v[0] + rr * math.cos(am), v[1] + rr * math.sin(am)), text, color=INK, size=size, italic=italic)


def side(F, p, q, s, center, gap=12, size=13, italic=False):
    m = G.mid(p, q)
    n = G.unit(G.perp(G.sub(q, p)))
    if G.dist(G.add(m, n), center) < G.dist(m, center):
        n = G.mul(n, -1)
    F.text(G.add(m, G.mul(n, gap)), s, color=INK, size=size, italic=italic)


# ---------------------------------------------------------------
# sorular
# ---------------------------------------------------------------
QUESTIONS = {}


def q(konu):
    def deco(fn):
        QUESTIONS.setdefault(konu, []).append(fn)
        return fn
    return deco


def opts(values, correct, fmt=lambda v: str(v)):
    """Şıkları A) ... E) biçiminde döndürür; doğru şıkkın indeksini doğrular."""
    letters = "ABCDE"
    assert len(values) == 5 and len(set(map(str, values))) == 5, values
    idx = [i for i, v in enumerate(values) if v == correct]
    assert len(idx) == 1, (values, correct)
    return ["%s) %s" % (letters[i], fmt(v)) for i, v in enumerate(values)], idx[0]


# ======================= 1. Üçgende Açılar =======================

@q(1)
def q1_1():
    A_, B_ = 50, 60  # x = 30 -> A = x + 20, B = 2x, dış açı 110
    x = 30
    assert x + 20 == A_ and 2 * x == B_ and A_ + B_ == 110
    B = (0, 0)
    C = (1.0, 0)
    A = inter(B, P(B_), C, P(180 - (180 - A_ - B_)))
    D = (1.55, 0)
    Z = Q(320, 200)
    s = Z.fit([A, B, C, D])
    a, b, c, d = s(A), s(B), s(C), s(D)
    F = Z.F
    F.poly([a, b, c], fill=SOFT, stroke=INK)
    F.line(c, d, stroke=INK)
    ctr = G.centroid([a, b, c])
    vlabels(F, [a, b], ["A", "B"], ctr)
    lab(F, c, "C", 0, 17)
    lab(F, d, "D", 8, 15)
    ang(F, a, b, c, 22, "x + 20°", lr=62, size=11)
    ang(F, b, c, a, 22, "2x", lr=36, size=12)
    ang(F, c, d, a, 20, "110°", lr=40, size=11)
    o, i = opts([30, 35, 40, 45, 50], 30)
    return dict(F=F,
                question="Şekilde ABC bir üçgen, B, C ve D noktaları doğrusaldır.\nm(BAC) = x + 20°, m(ABC) = 2x ve m(ACD) = 110° olduğuna göre, x kaç derecedir?",
                options=[s_ + "°" for s_ in o], answer=i,
                explanation="Dış açı, kendisine komşu olmayan iki iç açının toplamıdır: (x + 20) + 2x = 110 → 3x = 90 → x = 30°.")


@q(1)
def q1_2():
    a_ang, c_ang, b_ang = 25, 30, 40
    B = (0, 0)
    A = P(110, 1.0)
    C = P(70, 1.0)
    D = inter(A, P(-70 + a_ang), C, P(250 - c_ang))
    x = angle_at(D, A, C)
    assert close(angle_at(A, B, D), a_ang) and close(angle_at(C, B, D), c_ang) and close(angle_at(B, A, C), b_ang)
    assert close(x, a_ang + b_ang + c_ang)
    Z = Q(320, 220)
    s = Z.fit([A, B, C, D], pad=(40, 34, 40, 34))
    a, b, c, d = s(A), s(B), s(C), s(D)
    F = Z.F
    F.poly([a, b, c, d], fill=SOFT, stroke=INK)
    lab(F, a, "A", -12, -8)
    lab(F, c, "C", 12, -8)
    lab(F, b, "B", 0, 17)
    lab(F, d, "D", 0, 20)
    ang(F, a, b, d, 30, "25°", lr=54, size=11)
    ang(F, c, d, b, 30, "30°", lr=54, size=11)
    ang(F, b, a, c, 26, "40°", lr=42, size=11)
    ang(F, d, a, c, 18, "x", lr=30, size=14, italic=True)
    o, i = opts([85, 90, 95, 100, 105], 95)
    return dict(F=F,
                question="Şekildeki ABCD içbükey dörtgeninde m(DAB) = 25°, m(ABC) = 40° ve m(BCD) = 30°'dir.\nBuna göre, m(ADC) = x kaç derecedir?",
                options=[s_ + "°" for s_ in o], answer=i,
                explanation="İçbükey dörtgende (bumerang) göbek açısı, uçlardaki üç açının toplamıdır: x = 25 + 40 + 30 = 95°.")


@q(1)
def q1_3():
    A_ = 64
    B_, C_ = 70, 46
    assert A_ + B_ + C_ == 180
    B, C = (0, 0), (1, 0)
    A = inter(B, P(B_), C, P(180 - C_))
    I = inter(B, P(B_ / 2), C, P(180 - C_ / 2))
    x = angle_at(I, B, C)
    assert close(x, 90 + A_ / 2)
    Z = Q(320, 210)
    s = Z.fit([A, B, C])
    a, b, c, i = s(A), s(B), s(C), s(I)
    F = Z.F
    F.poly([a, b, c], fill=SOFT, stroke=INK)
    F.line(b, i, stroke=INK, sw=1.6)
    F.line(c, i, stroke=INK, sw=1.6)
    F.dot(i, r=2.6, color=INK)
    ctr = G.centroid([a, b, c])
    vlabels(F, [a, b, c], ["A", "B", "C"], ctr)
    lab(F, i, "E", 0, -13)
    ang(F, a, b, c, 22, "64°", lr=38, size=11)
    ang(F, b, c, i, 34, None)
    ang(F, b, i, a, 38, None)
    ang(F, c, i, b, 34, None)
    ang(F, c, a, i, 38, None)
    ang(F, i, b, c, 14, "x", lr=26, size=14, italic=True)
    o, i_ = opts([112, 116, 118, 122, 126], 122)
    return dict(F=F,
                question="Şekilde ABC bir üçgen, [BE] ve [CE] sırasıyla B ve C açılarının açıortaylarıdır.\nm(BAC) = 64° olduğuna göre, m(BEC) = x kaç derecedir?",
                options=[s_ + "°" for s_ in o], answer=i_,
                explanation="İki iç açıortayın kesişiminde oluşan açı: x = 90° + m(A)/2 = 90 + 32 = 122°.")


@q(1)
def q1_4():
    B_, C_ = 72, 36
    B, C = (0, 0), (1, 0)
    A = inter(B, P(B_), C, P(180 - C_))
    H = (A[0], 0)
    bisector_dir = P(-90 - 0 + 0)  # yalnız yer tutucu
    # açıortay ayağı: |BD|/|DC| = |AB|/|AC|
    c, b = dist(A, B), dist(A, C)
    D = (c / (b + c), 0)
    x = angle_at(A, H, D)
    assert close(x, (B_ - C_) / 2)
    Z = Q(320, 210)
    s = Z.fit([A, B, C])
    a, b_, c_, h, d = s(A), s(B), s(C), s(H), s(D)
    F = Z.F
    F.poly([a, b_, c_], fill=SOFT, stroke=INK)
    F.line(a, h, stroke=INK, sw=1.6)
    F.line(a, d, stroke=INK, sw=1.6)
    F.right(h, a, c_, s=9, color=INK)
    ctr = G.centroid([a, b_, c_])
    vlabels(F, [a, b_, c_], ["A", "B", "C"], ctr)
    lab(F, h, "H", 0, 16)
    lab(F, d, "D", 0, 16)
    ang(F, b_, c_, a, 22, "72°", lr=38, size=11)
    ang(F, c_, a, b_, 26, "36°", lr=44, size=11)
    ang(F, a, h, d, 46, "x", lr=60, size=14, italic=True)
    o, i = opts([10, 12, 14, 16, 18], 18)
    del bisector_dir
    return dict(F=F,
                question="Şekilde ABC bir üçgen, [AH] ⊥ [BC] ve [AD], A açısının açıortayıdır.\nm(ABC) = 72° ve m(ACB) = 36° olduğuna göre, m(HAD) = x kaç derecedir?",
                options=[s_ + "°" for s_ in o], answer=i,
                explanation="m(A) = 180 − 72 − 36 = 72°, m(DAC) = 36°. AHC dik üçgeninde m(HAC) = 90 − 36 = 54°. x = 54 − 36 = 18°. (Kısa yol: x = (72 − 36)/2 = 18°.)")


# ======================= 2. Açı-Kenar ve Dik Üçgen =======================

@q(2)
def q2_1():
    AD, BD, DC = 13, 5, 11
    AB = math.sqrt(AD ** 2 - BD ** 2)
    AC = math.sqrt(AB ** 2 + (BD + DC) ** 2)
    assert close(AB, 12) and close(AC, 20)
    B, A = (0, 0), (0, AB)
    D, C = (BD, 0), (BD + DC, 0)
    Z = Q(320, 210)
    s = Z.fit([A, B, C])
    a, b, c, d = s(A), s(B), s(C), s(D)
    F = Z.F
    F.poly([a, b, c], fill=SOFT, stroke=INK)
    F.line(a, d, stroke=INK, sw=1.6)
    F.right(b, a, c, s=10, color=INK)
    ctr = G.centroid([a, b, c])
    vlabels(F, [a, b, c], ["A", "B", "C"], ctr)
    lab(F, d, "D", 0, 16)
    side(F, a, d, "13", ctr, gap=-12)
    lab(F, G.mid(b, d), "5", 0, 15)
    lab(F, G.mid(d, c), "11", 0, 15)
    side(F, a, c, "x", ctr, gap=13, size=14, italic=True)
    o, i = opts([14, 16, 17, 18, 20], 20)
    return dict(F=F,
                question="Şekilde ABC bir dik üçgen, [AB] ⊥ [BC], D ∈ [BC]'dir.\n|AD| = 13 birim, |BD| = 5 birim ve |DC| = 11 birim olduğuna göre, |AC| = x kaç birimdir?",
                options=o, answer=i,
                explanation="ABD üçgeninde |AB|² = 13² − 5² = 144 → |AB| = 12. |BC| = 16. ABC'de x² = 12² + 16² = 400 → x = 20.")


@q(2)
def q2_2():
    AC = 14
    B = (0, 0)
    BC = AC * math.cos(math.radians(30))
    A, C = (0, AC / 2), (BC, 0)
    assert close(dist(A, C), 14) and close(angle_at(C, A, B), 30)
    Z = Q(320, 200)
    s = Z.fit([A, B, C])
    a, b, c = s(A), s(B), s(C)
    F = Z.F
    F.poly([a, b, c], fill=SOFT, stroke=INK)
    F.right(b, a, c, s=10, color=INK)
    ctr = G.centroid([a, b, c])
    vlabels(F, [a, b, c], ["A", "B", "C"], ctr)
    ang(F, c, a, b, 30, "30°", lr=52, size=11)
    side(F, a, c, "14", ctr)
    side(F, b, c, "x", ctr, size=14, italic=True)
    vals = ["7√2", "7√3", "14", "7√6", "14√3"]
    o, i = opts(vals, "7√3")
    return dict(F=F,
                question="Şekildeki ABC dik üçgeninde [AB] ⊥ [BC], m(ACB) = 30° ve |AC| = 14 birimdir.\nBuna göre, |BC| = x kaç birimdir?",
                options=o, answer=i,
                explanation="30°-60°-90° üçgeninde 30°'nin karşısı hipotenüsün yarısıdır: |AB| = 7. 60°'nin karşısı |AB|·√3 = 7√3.")


@q(2)
def q2_3():
    BH, HC = 4, 9
    AH = math.sqrt(BH * HC)
    assert close(AH, 6)
    B, C, H = (0, 0), (BH + HC, 0), (BH, 0)
    A = (BH, AH)
    assert close(angle_at(A, B, C), 90)
    Z = Q(320, 200)
    s = Z.fit([A, B, C])
    a, b, c, h = s(A), s(B), s(C), s(H)
    F = Z.F
    F.poly([a, b, c], fill=SOFT, stroke=INK)
    F.line(a, h, stroke=INK, sw=1.6)
    F.right(a, b, c, s=10, color=INK)
    F.right(h, a, c, s=9, color=INK)
    ctr = G.centroid([a, b, c])
    vlabels(F, [a, b, c], ["A", "B", "C"], ctr)
    lab(F, h, "H", 0, 16)
    lab(F, G.mid(b, h), "4", 0, 15)
    lab(F, G.mid(h, c), "9", 0, 15)
    lab(F, G.mid(a, h), "x", 10, 0, size=14, italic=True)
    o, i = opts([3, 4, 5, 6, 8], 6)
    return dict(F=F,
                question="Şekildeki ABC dik üçgeninde [AB] ⊥ [AC], [AH] ⊥ [BC]'dir.\n|BH| = 4 birim ve |HC| = 9 birim olduğuna göre, |AH| = x kaç birimdir?",
                options=o, answer=i,
                explanation="Öklid bağıntısı: x² = |BH|·|HC| = 4·9 = 36 → x = 6.")


@q(2)
def q2_4():
    AH = 6
    H = (0, 0)
    A = (0, AH)
    B = (-AH, 0)                       # m(B) = 45°
    C = (AH * math.sqrt(3), 0)         # m(C) = 30°
    assert close(angle_at(B, A, C), 45) and close(angle_at(C, A, B), 30)
    Z = Q(320, 200)
    s = Z.fit([A, B, C])
    a, b, c, h = s(A), s(B), s(C), s(H)
    F = Z.F
    F.poly([a, b, c], fill=SOFT, stroke=INK)
    F.line(a, h, stroke=INK, sw=1.6)
    F.right(h, a, c, s=9, color=INK)
    ctr = G.centroid([a, b, c])
    vlabels(F, [a, b, c], ["A", "B", "C"], ctr)
    lab(F, h, "H", 0, 16)
    ang(F, b, c, a, 24, "45°", lr=42, size=11)
    ang(F, c, a, b, 30, "30°", lr=52, size=11)
    lab(F, G.mid(a, h), "6", 9, 0)
    vals = ["6 + 6√3", "6 + 6√2", "12", "12 + 6√3", "6√6"]
    o, i = opts(vals, "6 + 6√3")
    return dict(F=F,
                question="Şekilde ABC bir üçgen, [AH] ⊥ [BC], m(ABC) = 45°, m(ACB) = 30° ve |AH| = 6 birimdir.\nBuna göre, |BC| kaç birimdir?",
                options=o, answer=i,
                explanation="ABH ikizkenar dik üçgen: |BH| = 6. AHC 30°-60°-90° üçgeni: |HC| = 6√3. |BC| = 6 + 6√3.")


# ======================= 3. İkizkenar ve Eşkenar =======================

@q(3)
def q3_1():
    A_ = 36
    base = (180 - A_) / 2  # 72
    B, C = (0, 0), (1, 0)
    A = inter(B, P(base), C, P(180 - base))
    # D ∈ [AC], |BD| = |BC| -> m(BDC) = 72 -> m(DBC) = 36
    D = inter(B, P(base - 36), C, P(180 - base))
    assert close(dist(B, D), dist(B, C))
    x = angle_at(B, A, D)
    assert close(x, 36)
    Z = Q(320, 220)
    s = Z.fit([A, B, C])
    a, b, c, d = s(A), s(B), s(C), s(D)
    F = Z.F
    F.poly([a, b, c], fill=SOFT, stroke=INK)
    F.line(b, d, stroke=INK, sw=1.6)
    F.ticks(a, b, 1, color=INK)
    F.ticks(a, c, 1, color=INK)
    F.ticks(b, d, 2, color=INK)
    F.ticks(b, c, 2, color=INK)
    ctr = G.centroid([a, b, c])
    vlabels(F, [a, b, c], ["A", "B", "C"], ctr)
    lab(F, d, "D", 12, -2)
    ang(F, a, b, c, 26, "36°", lr=42, size=11)
    ang(F, b, d, a, 30, "x", lr=44, size=14, italic=True)
    o, i = opts([24, 30, 36, 42, 48], 36)
    return dict(F=F,
                question="Şekilde ABC bir üçgen, D ∈ [AC], |AB| = |AC| ve |BD| = |BC|'dir.\nm(BAC) = 36° olduğuna göre, m(ABD) = x kaç derecedir?",
                options=[s_ + "°" for s_ in o], answer=i,
                explanation="|AB| = |AC| → m(B) = m(C) = 72°. |BD| = |BC| → m(BDC) = 72° → m(DBC) = 36°. x = 72 − 36 = 36°.")


@q(3)
def q3_2():
    a_ = 8
    B, C = (0, 0), (a_, 0)
    A = (a_ / 2, a_ * math.sqrt(3) / 2)
    area = a_ * a_ * math.sqrt(3) / 4
    assert close(area, 16 * math.sqrt(3))
    Z = Q(320, 210)
    s = Z.fit([A, B, C])
    a, b, c = s(A), s(B), s(C)
    F = Z.F
    F.poly([a, b, c], fill=SOFT, stroke=INK)
    for p, q_ in ((a, b), (b, c), (c, a)):
        F.ticks(p, q_, 1, color=INK)
    ctr = G.centroid([a, b, c])
    vlabels(F, [a, b, c], ["A", "B", "C"], ctr)
    lab(F, G.lerp(b, c, 0.32), "8", 0, 16)
    vals = ["16√3", "24√3", "32√3", "48√3", "64"]
    o, i = opts(vals, "16√3")
    return dict(F=F,
                question="Şekildeki ABC eşkenar üçgeninin bir kenarı 8 birimdir.\nBuna göre, ABC üçgeninin alanı kaç birimkaredir?",
                options=o, answer=i,
                explanation="Eşkenar üçgenin alanı a²√3/4 = 64√3/4 = 16√3 birimkaredir.")


@q(3)
def q3_3():
    b_, m, n = 10, 3, 12
    x = math.sqrt(b_ * b_ - m * n)
    assert close(x, 8)
    B, C = (0, 0), (m + n, 0)
    h = math.sqrt(b_ ** 2 - ((m + n) / 2) ** 2)
    A = ((m + n) / 2, h)
    D = (m, 0)
    assert close(dist(A, D), 8) and close(dist(A, B), 10)
    Z = Q(320, 210)
    s = Z.fit([A, B, C])
    a, b, c, d = s(A), s(B), s(C), s(D)
    F = Z.F
    F.poly([a, b, c], fill=SOFT, stroke=INK)
    F.line(a, d, stroke=INK, sw=1.6)
    ctr = G.centroid([a, b, c])
    vlabels(F, [a, b, c], ["A", "B", "C"], ctr)
    lab(F, d, "D", 0, 16)
    side(F, a, b, "10", ctr)
    side(F, a, c, "10", ctr)
    lab(F, G.mid(b, d), "3", 0, 15)
    lab(F, G.mid(d, c), "12", 0, 15)
    lab(F, G.mid(a, d), "x", 9, 2, size=14, italic=True)
    o, i = opts([4, 5, 6, 7, 8], 8)
    return dict(F=F,
                question="Şekilde ABC bir üçgen, D ∈ [BC], |AB| = |AC| = 10 birim, |BD| = 3 birim ve |DC| = 12 birimdir.\nBuna göre, |AD| = x kaç birimdir?",
                options=o, answer=i,
                explanation="İkizkenar üçgende tabana çizilen doğru parçası için x² = b² − m·n = 100 − 36 = 64 → x = 8.")


@q(3)
def q3_4():
    c_ = 37  # m(C)
    A_ = 180 - 2 * c_
    B, C = (0, 0), (1, 0)
    A = inter(B, P(c_), C, P(180 - c_))
    # |AD| = |DC|, D ∈ [BC]: m(DAC) = c
    # |AD| = |DC| -> D, [AC]'nin orta dikmesi ile BC'nin kesişimi
    M = G.mid(A, C)
    D = inter(M, G.perp(G.sub(C, A)), B, (1, 0))
    assert close(dist(A, D), dist(D, C))
    bad = angle_at(A, B, D)
    assert close(bad, 69) and close(A_ - c_, 69)
    Z = Q(320, 200)
    s = Z.fit([A, B, C])
    a, b, c, d = s(A), s(B), s(C), s(D)
    F = Z.F
    F.poly([a, b, c], fill=SOFT, stroke=INK)
    F.line(a, d, stroke=INK, sw=1.6)
    F.ticks(a, b, 1, color=INK)
    F.ticks(a, c, 1, color=INK)
    F.ticks(G.lerp(a, d, 0.62), G.lerp(a, d, 0.82), 2, color=INK)
    F.ticks(d, c, 2, color=INK)
    ctr = G.centroid([a, b, c])
    vlabels(F, [a, b, c], ["A", "B", "C"], ctr)
    lab(F, d, "D", 0, 16)
    ang(F, a, b, d, 20, "69°", lr=34, size=11)
    ang(F, b, c, a, 24, "x", lr=38, size=14, italic=True)
    o, i = opts([35, 37, 39, 41, 43], 37)
    return dict(F=F,
                question="Şekilde ABC bir üçgen, D ∈ [BC], |AB| = |AC| ve |AD| = |DC|'dir.\nm(BAD) = 69° olduğuna göre, m(ABC) = x kaç derecedir?",
                options=[s_ + "°" for s_ in o], answer=i,
                explanation="m(B) = m(C) = x ve |AD| = |DC| → m(DAC) = x. m(A) = 180 − 2x = 69 + x → 3x = 111 → x = 37°.")


# ======================= 4. Açıortay ve Kenarortay =======================

def tri_sss(a, b, c):
    """|BC| = a, |CA| = b, |AB| = c; B = (0,0), C = (a,0)."""
    xa = (c * c - b * b + a * a) / (2 * a)
    ya = math.sqrt(max(0.0, c * c - xa * xa))
    return (xa, ya), (0.0, 0.0), (a, 0.0)


@q(4)
def q4_1():
    a, b, c = 10, 9, 6
    A, B, C = tri_sss(a, b, c)
    BD = a * c / (b + c)
    assert close(BD, 4)
    D = (BD, 0)
    assert close(angle_at(A, B, D), angle_at(A, D, C))
    Z = Q(320, 210)
    s = Z.fit([A, B, C])
    pa, pb, pc, pd = s(A), s(B), s(C), s(D)
    F = Z.F
    F.poly([pa, pb, pc], fill=SOFT, stroke=INK)
    F.line(pa, pd, stroke=INK, sw=1.6)
    ang(F, pa, pb, pd, 24)
    ang(F, pa, pd, pc, 29)
    ctr = G.centroid([pa, pb, pc])
    vlabels(F, [pa, pb, pc], ["A", "B", "C"], ctr)
    lab(F, pd, "D", 0, 16)
    side(F, pa, pb, "6", ctr)
    side(F, pa, pc, "9", ctr)
    lab(F, G.mid(pb, pd), "x", 0, 15, size=14, italic=True)
    vals = ["2", "2,5", "3", "3,5", "4"]
    o, i = opts(vals, "4")
    return dict(F=F,
                question="Şekilde ABC bir üçgen, [AD] A açısının açıortayı, |AB| = 6 birim, |AC| = 9 birim ve |BC| = 10 birimdir.\nBuna göre, |BD| = x kaç birimdir?",
                options=o, answer=i,
                explanation="İç açıortay teoremi: |BD|/|DC| = |AB|/|AC| = 6/9 = 2/3. |BC| = 10 → |BD| = 10·2/5 = 4.")


@q(4)
def q4_2():
    a, b, c = 10, 9, 6
    A, B, C = tri_sss(a, b, c)
    D = (4.0, 0)
    AD2 = b * c - 4 * 6
    assert close(dist(A, D) ** 2, AD2) and close(AD2, 30)
    Z = Q(320, 210)
    s = Z.fit([A, B, C])
    pa, pb, pc, pd = s(A), s(B), s(C), s(D)
    F = Z.F
    F.poly([pa, pb, pc], fill=SOFT, stroke=INK)
    F.line(pa, pd, stroke=INK, sw=1.6)
    ang(F, pa, pb, pd, 24)
    ang(F, pa, pd, pc, 29)
    ctr = G.centroid([pa, pb, pc])
    vlabels(F, [pa, pb, pc], ["A", "B", "C"], ctr)
    lab(F, pd, "D", 0, 16)
    side(F, pa, pb, "6", ctr)
    side(F, pa, pc, "9", ctr)
    lab(F, G.mid(pb, pd), "4", 0, 15)
    lab(F, G.mid(pd, pc), "6", 0, 15)
    lab(F, G.mid(pa, pd), "x", 10, 0, size=14, italic=True)
    vals = ["2√6", "√26", "2√7", "√30", "4√2"]
    o, i = opts(vals, "√30")
    return dict(F=F,
                question="Şekilde ABC bir üçgen, [AD] A açısının açıortayı, |AB| = 6 birim, |AC| = 9 birim, |BD| = 4 birim ve |DC| = 6 birimdir.\nBuna göre, |AD| = x kaç birimdir?",
                options=o, answer=i,
                explanation="Açıortay uzunluğu: x² = |AB|·|AC| − |BD|·|DC| = 54 − 24 = 30 → x = √30.")


@q(4)
def q4_3():
    BC = 18
    A = (0, 0)
    B = (0, 10.0)
    C = (math.sqrt(BC ** 2 - 100), 0)
    D = G.mid(B, C)
    Gc = ((A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3)
    assert close(dist(A, D), 9) and close(dist(A, Gc), 6)
    Z = Q(320, 210)
    s = Z.fit([A, B, C])
    pa, pb, pc, pd, pg = s(A), s(B), s(C), s(D), s(Gc)
    F = Z.F
    F.poly([pa, pb, pc], fill=SOFT, stroke=INK)
    F.line(pa, pd, stroke=INK, sw=1.6)
    F.right(pa, pb, pc, s=10, color=INK)
    F.dot(pg, r=2.6, color=INK)
    F.dot(pd, r=2.6, color=INK)
    F.ticks(pb, pd, 1, color=INK)
    F.ticks(pd, pc, 1, color=INK)
    ctr = G.centroid([pa, pb, pc])
    vlabels(F, [pa, pb, pc], ["A", "B", "C"], ctr)
    lab(F, pd, "D", 10, -10)
    lab(F, pg, "G", -4, -12)
    o, i = opts([3, 6, 8, 9, 12], 6)
    return dict(F=F,
                question="Şekildeki ABC dik üçgeninde [AB] ⊥ [AC], [AD] kenarortay ve G noktası ABC üçgeninin ağırlık merkezidir.\n|BC| = 18 birim olduğuna göre, |AG| kaç birimdir?",
                options=o, answer=i,
                explanation="Dik üçgende hipotenüse ait kenarortay hipotenüsün yarısıdır: |AD| = 9. Ağırlık merkezi kenarortayı 2:1 böler: |AG| = 9·2/3 = 6.")


@q(4)
def q4_4():
    a, b, c = 8, 7, 5
    A, B, C = tri_sss(a, b, c)
    D = (a / 2, 0)
    va2 = (2 * b * b + 2 * c * c - a * a) / 4
    assert close(dist(A, D) ** 2, va2) and close(va2, 21)
    Z = Q(320, 210)
    s = Z.fit([A, B, C])
    pa, pb, pc, pd = s(A), s(B), s(C), s(D)
    F = Z.F
    F.poly([pa, pb, pc], fill=SOFT, stroke=INK)
    F.line(pa, pd, stroke=INK, sw=1.6)
    F.ticks(pb, pd, 1, color=INK)
    F.ticks(pd, pc, 1, color=INK)
    ctr = G.centroid([pa, pb, pc])
    vlabels(F, [pa, pb, pc], ["A", "B", "C"], ctr)
    lab(F, pd, "D", 0, 16)
    side(F, pa, pb, "5", ctr)
    side(F, pa, pc, "7", ctr)
    lab(F, G.mid(pa, pd), "x", 10, 4, size=14, italic=True)
    vals = ["√21", "√23", "5", "√26", "3√3"]
    o, i = opts(vals, "√21")
    return dict(F=F,
                question="Şekilde ABC bir üçgen, [AD] kenarortay, |AB| = 5 birim, |AC| = 7 birim ve |BC| = 8 birimdir.\nBuna göre, |AD| = x kaç birimdir?",
                options=o, answer=i,
                explanation="Kenarortay bağıntısı: 4x² = 2·7² + 2·5² − 8² = 98 + 50 − 64 = 84 → x² = 21 → x = √21.")


# ======================= 5. Üçgende Alan =======================

@q(5)
def q5_1():
    BD, DC, AH = 4, 8, 7
    B, C = (0, 0), (BD + DC, 0)
    A = (2.6, AH)
    D, H = (BD, 0), (A[0], 0)
    area_adc = DC * AH / 2
    assert close(area_adc, 28)
    Z = Q(320, 210)
    s = Z.fit([A, B, C])
    pa, pb, pc, pd, ph = s(A), s(B), s(C), s(D), s(H)
    F = Z.F
    F.poly([pa, pb, pc], fill=SOFT, stroke=INK)
    F.line(pa, pd, stroke=INK, sw=1.6)
    F.line(pa, ph, stroke=INK, sw=1.4, dash="5 4")
    F.right(ph, pa, pc, s=8, color=INK)
    ctr = G.centroid([pa, pb, pc])
    vlabels(F, [pa, pb, pc], ["A", "B", "C"], ctr)
    lab(F, pd, "D", 0, 16)
    lab(F, ph, "H", 0, 16)
    lab(F, G.mid(pa, ph), "7", -9, 0)
    lab(F, G.mid(pd, pc), "8", 0, 15)
    o, i = opts([24, 28, 32, 36, 42], 28)
    return dict(F=F,
                question="Şekilde ABC bir üçgen, D ∈ [BC], [AH] ⊥ [BC], |AH| = 7 birim ve |DC| = 8 birimdir.\nBuna göre, ADC üçgeninin alanı kaç birimkaredir?",
                options=o, answer=i,
                explanation="ADC üçgeninin [DC] tabanına ait yüksekliği |AH| = 7'dir. Alan = 8·7/2 = 28 birimkare.")


@q(5)
def q5_2():
    AB, AC, A_ = 8, 10, 30
    A = (0, 0)
    B = P(0, AB)
    C = P(A_, AC)
    area = AB * AC * math.sin(math.radians(A_)) / 2
    assert close(area, 20)
    Z = Q(320, 190)
    s = Z.fit([A, B, C])
    pa, pb, pc = s(A), s(B), s(C)
    F = Z.F
    F.poly([pa, pb, pc], fill=SOFT, stroke=INK)
    ctr = G.centroid([pa, pb, pc])
    vlabels(F, [pa, pb, pc], ["A", "B", "C"], ctr)
    side(F, pa, pb, "8", ctr)
    side(F, pa, pc, "10", ctr)
    ang(F, pa, pb, pc, 34, "30°", lr=54, size=11)
    o, i = opts([12, 14, 16, 18, 20], 20)
    return dict(F=F,
                question="Şekilde ABC bir üçgen, |AB| = 8 birim, |AC| = 10 birim ve m(BAC) = 30°'dir.\nBuna göre, ABC üçgeninin alanı kaç birimkaredir?",
                options=o, answer=i,
                explanation="Alan = (1/2)·|AB|·|AC|·sin A = (1/2)·8·10·(1/2) = 20 birimkare.")


@q(5)
def q5_3():
    a, b, c = 14, 15, 13
    A, B, C = tri_sss(a, b, c)
    u = (a + b + c) / 2
    area = math.sqrt(u * (u - a) * (u - b) * (u - c))
    assert close(area, 84)
    Z = Q(320, 210)
    s = Z.fit([A, B, C])
    pa, pb, pc = s(A), s(B), s(C)
    F = Z.F
    F.poly([pa, pb, pc], fill=SOFT, stroke=INK)
    ctr = G.centroid([pa, pb, pc])
    vlabels(F, [pa, pb, pc], ["A", "B", "C"], ctr)
    side(F, pa, pb, "13", ctr)
    side(F, pa, pc, "15", ctr)
    side(F, pb, pc, "14", ctr)
    o, i = opts([72, 76, 80, 84, 88], 84)
    return dict(F=F,
                question="Şekildeki ABC üçgeninde |AB| = 13 birim, |BC| = 14 birim ve |AC| = 15 birimdir.\nBuna göre, ABC üçgeninin alanı kaç birimkaredir?",
                options=o, answer=i,
                explanation="u = (13 + 14 + 15)/2 = 21. Heron: Alan = √(21·8·7·6) = √7056 = 84 birimkare.")


@q(5)
def q5_4():
    AB, AC = 6, 8
    A, B, C = (0, 0), (0, AB), (AC, 0)
    BC = 10
    r = (AB + AC - BC) / 2
    area = AB * AC / 2
    u = (AB + AC + BC) / 2
    assert close(r, 2) and close(area / u, r)
    I = (r, r)
    Z = Q(320, 210)
    s = Z.fit([A, B, C])
    pa, pb, pc, pi = s(A), s(B), s(C), s(I)
    F = Z.F
    F.poly([pa, pb, pc], fill=SOFT, stroke=INK)
    F.circle(pi, r * Z.k, fill="none", stroke=INK, sw=1.6)
    F.right(pa, pb, pc, s=10, color=INK)
    F.dot(pi, r=2.4, color=INK)
    ctr = G.centroid([pa, pb, pc])
    vlabels(F, [pa, pb, pc], ["A", "B", "C"], ctr)
    side(F, pa, pb, "6", ctr)
    side(F, pa, pc, "8", ctr)
    lab(F, pi, "O", 0, -12)
    vals = ["2", "2,5", "3", "3,5", "4"]
    o, i = opts(vals, "2")
    return dict(F=F,
                question="Şekildeki ABC dik üçgeninde [AB] ⊥ [AC], |AB| = 6 birim ve |AC| = 8 birimdir. O merkezli çember üçgenin kenarlarına içten teğettir.\nBuna göre, çemberin yarıçapı kaç birimdir?",
                options=o, answer=i,
                explanation="|BC| = 10. Alan = 24, u = 12. r = Alan/u = 24/12 = 2 birim. (Dik üçgende r = (6 + 8 − 10)/2 = 2.)")


# ======================= 6. Benzerlik =======================

@q(6)
def q6_1():
    AD, DB, DE = 4, 6, 6
    BC = DE * (AD + DB) / AD
    assert close(BC, 15)
    B, C = (0, 0), (15, 0)
    A = (5.5, 8.5)
    k = AD / (AD + DB)
    D = G.lerp(A, B, k)
    E = G.lerp(A, C, k)
    Z = Q(320, 210)
    s = Z.fit([A, B, C])
    pa, pb, pc, pd, pe = s(A), s(B), s(C), s(D), s(E)
    F = Z.F
    F.poly([pa, pb, pc], fill=SOFT, stroke=INK)
    F.line(pd, pe, stroke=INK, sw=1.6)
    ctr = G.centroid([pa, pb, pc])
    vlabels(F, [pa, pb, pc], ["A", "B", "C"], ctr)
    lab(F, pd, "D", -12, -2)
    lab(F, pe, "E", 12, -2)
    side(F, pa, pd, "4", ctr)
    side(F, pd, pb, "6", ctr)
    lab(F, G.mid(pd, pe), "6", 0, -10)
    lab(F, G.mid(pb, pc), "x", 0, 15, size=14, italic=True)
    vals = ["12", "13,5", "15", "16", "18"]
    o, i = opts(vals, "15")
    return dict(F=F,
                question="Şekilde ABC bir üçgen, [DE] ∥ [BC], |AD| = 4 birim, |DB| = 6 birim ve |DE| = 6 birimdir.\nBuna göre, |BC| = x kaç birimdir?",
                options=o, answer=i,
                explanation="ADE ∼ ABC: |AD|/|AB| = |DE|/|BC| → 4/10 = 6/x → x = 15.")


@q(6)
def q6_2():
    k = 1 / 3
    small = 5
    whole = small / (k * k)
    trap = whole - small
    assert close(trap, 40)
    B, C = (0, 0), (12, 0)
    A = (4.5, 8)
    D = G.lerp(A, B, k)
    E = G.lerp(A, C, k)
    Z = Q(320, 210)
    s = Z.fit([A, B, C])
    pa, pb, pc, pd, pe = s(A), s(B), s(C), s(D), s(E)
    F = Z.F
    F.poly([pa, pb, pc], fill=SOFT, stroke=INK)
    F.line(pd, pe, stroke=INK, sw=1.6)
    ctr = G.centroid([pa, pb, pc])
    vlabels(F, [pa, pb, pc], ["A", "B", "C"], ctr)
    lab(F, pd, "D", -12, -2)
    lab(F, pe, "E", 12, -2)
    side(F, pa, pd, "2", ctr)
    side(F, pd, pb, "4", ctr)
    lab(F, G.centroid([pa, pd, pe]), "5", 0, 4, size=12)
    o, i = opts([36, 40, 44, 45, 48], 40)
    return dict(F=F,
                question="Şekilde ABC bir üçgen, [DE] ∥ [BC], |AD| = 2 birim ve |DB| = 4 birimdir. ADE üçgeninin alanı 5 birimkaredir.\nBuna göre, DBCE dörtgeninin alanı kaç birimkaredir?",
                options=o, answer=i,
                explanation="Benzerlik oranı |AD|/|AB| = 2/6 = 1/3, alanlar oranı 1/9. A(ABC) = 45. A(DBCE) = 45 − 5 = 40 birimkare.")


@q(6)
def q6_3():
    a, b, c = 4, 6, 6
    d = b * c / a
    assert close(d, 9)
    ys = [10.0, 6.0, 0.0]
    P1 = [(1.0, 10.0), None, None]
    P1[2] = (3.4, 0.0)
    P1[1] = G.lerp(P1[0], P1[2], 0.4)
    P2 = [(10.5, 10.0), None, (6.0, 0.0)]
    P2[1] = G.lerp(P2[0], P2[2], 0.4)
    assert close(dist(P1[0], P1[1]) / dist(P1[1], P1[2]), a / b)
    Z = Q(320, 210)
    s = Z.fit([(0, 10.6), (12, -0.6)] + [P1[0], P1[2], P2[0], P2[2]], pad=(30, 22, 30, 22))
    F = Z.F
    for y, nm in zip(ys, ["d₁", "d₂", "d₃"]):
        F.line(s((0, y)), s((12, y)), stroke=INK, sw=1.6)
        lab(F, s((12, y)), nm, 2, -10, size=11)
    for pts in (P1, P2):
        e1 = G.lerp(pts[0], pts[2], -0.08)
        e2 = G.lerp(pts[0], pts[2], 1.08)
        F.line(s(e1), s(e2), stroke=INK, sw=1.6)
        for p in pts:
            F.dot(s(p), r=2.6, color=INK)
    lab(F, G.mid(s(P1[0]), s(P1[1])), "4", -12, 0)
    lab(F, G.mid(s(P1[1]), s(P1[2])), "6", -12, 0)
    lab(F, G.mid(s(P2[0]), s(P2[1])), "6", 12, 0)
    lab(F, G.mid(s(P2[1]), s(P2[2])), "x", 12, 0, size=14, italic=True)
    o, i = opts([9, 10, 12, 14, 15], 9)
    return dict(F=F,
                question="Şekilde d₁ ∥ d₂ ∥ d₃ doğruları iki kesenle kesilmiştir. Kesenlerden biri üzerinde ayrılan parçalar 4 ve 6 birim, diğeri üzerinde 6 ve x birimdir.\nBuna göre, x kaçtır?",
                options=o, answer=i,
                explanation="Thales teoremi: 4/6 = 6/x → x = 9.")


@q(6)
def q6_4():
    AB, CD, AE = 6, 9, 4
    EC = AE * CD / AB
    assert close(EC, 6)
    A, B = (0, 6.0), (6.0, 6.0)
    E = (4.4, 3.6)
    k = CD / AB
    C = G.add(E, G.mul(G.sub(E, A), k))
    D = G.add(E, G.mul(G.sub(E, B), k))
    # ölçek: |AB| = 6 iken |CD| = 9 olacak şekilde
    assert close(dist(C, D) / dist(A, B), 1.5)
    Z = Q(320, 210)
    s = Z.fit([A, B, C, D])
    pa, pb, pc, pd, pe = s(A), s(B), s(C), s(D), s(E)
    F = Z.F
    F.line(pa, pb, stroke=INK)
    F.line(pc, pd, stroke=INK)
    F.line(pa, pc, stroke=INK, sw=1.6)
    F.line(pb, pd, stroke=INK, sw=1.6)
    ctr = G.centroid([pa, pb, pc, pd])
    for p, nm in ((pa, "A"), (pb, "B"), (pc, "C"), (pd, "D")):
        F.vlabel(p, nm, pe, gap=13, color=INK, size=14)
    lab(F, pe, "E", 13, 2)
    lab(F, G.mid(pa, pb), "6", 0, -11)
    lab(F, G.mid(pc, pd), "9", 0, 14)
    lab(F, G.mid(pa, pe), "4", 4, -11)
    lab(F, G.mid(pe, pc), "x", -10, -2, size=14, italic=True)
    del ctr
    o, i = opts([2, 3, 4, 5, 6], 6)
    return dict(F=F,
                question="Şekilde [AB] ∥ [DC], [AC] ile [BD] doğru parçaları E noktasında kesişmektedir.\n|AB| = 6 birim, |DC| = 9 birim ve |AE| = 4 birim olduğuna göre, |EC| = x kaç birimdir?",
                options=o, answer=i,
                explanation="ABE ∼ CDE (kelebek benzerliği): |AE|/|EC| = |AB|/|DC| → 4/x = 6/9 → x = 6.")


# ======================= 7. Analitik Doğru =======================

def grid_axes(Z, xr, yr):
    s = Z.map
    F = Z.F
    for gx in range(xr[0], xr[1] + 1):
        F.line(s((gx, yr[0])), s((gx, yr[1])), stroke="#e5e7eb", sw=1)
    for gy in range(yr[0], yr[1] + 1):
        F.line(s((xr[0], gy)), s((xr[1], gy)), stroke="#e5e7eb", sw=1)
    F.line(s((xr[0], 0)), s((xr[1] + 0.5, 0)), stroke=INK, sw=1.5)
    F.line(s((0, yr[0])), s((0, yr[1] + 0.5)), stroke=INK, sw=1.5)
    ex, ey = s((xr[1] + 0.5, 0)), s((0, yr[1] + 0.5))
    F.path("M %s %s L %s %s L %s %s" % (G.f(ex[0] - 7), G.f(ex[1] - 4), G.f(ex[0]), G.f(ex[1]), G.f(ex[0] - 7), G.f(ex[1] + 4)), stroke=INK, sw=1.5)
    F.path("M %s %s L %s %s L %s %s" % (G.f(ey[0] - 4), G.f(ey[1] + 7), G.f(ey[0]), G.f(ey[1]), G.f(ey[0] + 4), G.f(ey[1] + 7)), stroke=INK, sw=1.5)
    lab(F, ex, "x", -2, 13, size=12, italic=True)
    lab(F, ey, "y", 11, 2, size=12, italic=True)
    o = s((0, 0))
    lab(F, o, "O", -9, 11, size=11)


@q(7)
def q7_1():
    A, B = (1, 2), (7, 10)
    d = dist(A, B)
    assert close(d, 10)
    Z = Q(320, 230)
    Z.fit([(-1, -1), (8.5, 11.5)], pad=(26, 16, 26, 16))
    grid_axes(Z, (-1, 8), (-1, 11))
    s = Z.map
    F = Z.F
    F.line(s(A), s(B), stroke=INK, sw=2)
    F.dot(s(A), r=3, color=INK)
    F.dot(s(B), r=3, color=INK)
    lab(F, s(A), "A(1, 2)", 26, 10, size=12)
    lab(F, s(B), "B(7, 10)", -34, -4, size=12)
    o, i = opts([10, 11, 12, 13, 14], 10)
    return dict(F=F,
                question="Şekildeki dik koordinat düzleminde A(1, 2) ve B(7, 10) noktaları verilmiştir.\nBuna göre, |AB| kaç birimdir?",
                options=o, answer=i,
                explanation="|AB| = √[(7 − 1)² + (10 − 2)²] = √(36 + 64) = √100 = 10 birim.")


@q(7)
def q7_2():
    a, b = 4, 3
    Z = Q(320, 220)
    Z.fit([(-2, -2), (6.5, 5.5)], pad=(26, 16, 26, 16))
    grid_axes(Z, (-2, 6), (-2, 5))
    s = Z.map
    F = Z.F
    p1, p2 = (-1.2, 3 + 0.9), (5.6, 3 - 3 * 5.6 / 4)
    F.line(s(p1), s(p2), stroke=INK, sw=2)
    F.dot(s((4, 0)), r=3, color=INK)
    F.dot(s((0, 3)), r=3, color=INK)
    lab(F, s((4, 0)), "4", 4, 14, size=12)
    lab(F, s((0, 3)), "3", -11, 11, size=12)
    lab(F, s(p2), "d", 10, 0, size=14, italic=True)
    # doğru denklemi: x/4 + y/3 = 1 -> 3x + 4y = 12
    for xv, yv in ((4, 0), (0, 3)):
        assert close(3 * xv + 4 * yv, 12)
    vals = ["4x + 3y = 12", "3x − 4y = 12", "3x + 4y = 12", "4x − 3y = 12", "3x + 4y = 7"]
    o, i = opts(vals, "3x + 4y = 12")
    return dict(F=F,
                question="Şekildeki d doğrusu x eksenini 4 noktasında, y eksenini 3 noktasında kesmektedir.\nBuna göre, d doğrusunun denklemi aşağıdakilerden hangisidir?",
                options=o, answer=i,
                explanation="Eksenleri kesen form: x/4 + y/3 = 1. Her iki taraf 12 ile çarpılırsa 3x + 4y = 12.")


@q(7)
def q7_3():
    # 2x + 3y = 12 -> eksen kesenleri 6 ve 4, alan 12
    area = 6 * 4 / 2
    assert close(area, 12)
    Z = Q(320, 220)
    Z.fit([(-1, -1), (7.5, 5.5)], pad=(26, 16, 26, 16))
    grid_axes(Z, (-1, 7), (-1, 5))
    s = Z.map
    F = Z.F
    F.poly([s((0, 0)), s((6, 0)), s((0, 4))], fill="#eef2f6", stroke="none", sw=0)
    F.line(s((-0.6, 4.4)), s((7.0, -0.667)), stroke=INK, sw=2)
    lab(F, s((7.0, -0.667)), "2x + 3y = 12", -40, 14, size=12)
    o, i = opts([6, 8, 10, 12, 24], 12)
    return dict(F=F,
                question="Şekilde 2x + 3y = 12 doğrusu ile koordinat eksenleri arasında kalan bölge taranmıştır.\nBuna göre, taralı bölgenin alanı kaç birimkaredir?",
                options=o, answer=i,
                explanation="x = 0 → y = 4; y = 0 → x = 6. Taralı bölge dik kenarları 6 ve 4 olan dik üçgendir: Alan = 6·4/2 = 12 birimkare.")


@q(7)
def q7_4():
    A, B = (-2, 5), (6, -1)
    M = ((A[0] + B[0]) / 2, (A[1] + B[1]) / 2)
    assert M == (2, 2)
    Z = Q(320, 230)
    Z.fit([(-3, -2), (7.5, 6.5)], pad=(26, 16, 26, 16))
    grid_axes(Z, (-3, 7), (-2, 6))
    s = Z.map
    F = Z.F
    F.line(s(A), s(B), stroke=INK, sw=2)
    for p in (A, B):
        F.dot(s(p), r=3, color=INK)
    F.dot(s(M), r=3, color=INK)
    lab(F, s(A), "A(−2, 5)", 8, -14, size=12)
    lab(F, s(B), "B(6, −1)", -6, 14, size=12)
    lab(F, s(M), "M", 9, -11, size=12)
    vals = ["(1, 2)", "(2, 2)", "(2, 3)", "(4, 2)", "(4, 3)"]
    o, i = opts(vals, "(2, 2)")
    return dict(F=F,
                question="Şekildeki dik koordinat düzleminde M noktası [AB] doğru parçasının orta noktasıdır.\nA(−2, 5) ve B(6, −1) olduğuna göre, M noktasının koordinatları aşağıdakilerden hangisidir?",
                options=o, answer=i,
                explanation="Orta nokta: ((−2 + 6)/2, (5 + (−1))/2) = (2, 2).")


# ======================= 8. Dörtgenler ve Yamuk =======================

def trapezoid(bottom, top, h, shift):
    A, B = (0, 0), (bottom, 0)
    D, C = (shift, h), (shift + top, h)
    return A, B, C, D


@q(8)
def q8_1():
    a, c = 14, 8
    A, B, C, D = trapezoid(a, c, 5.5, 2.4)
    E, Fm = G.mid(A, D), G.mid(B, C)
    assert close(dist(E, Fm), (a + c) / 2)
    Z = Q(320, 200)
    s = Z.fit([A, B, C, D])
    pa, pb, pc, pd, pe, pf = [s(p) for p in (A, B, C, D, E, Fm)]
    F = Z.F
    F.poly([pa, pb, pc, pd], fill=SOFT, stroke=INK)
    F.line(pe, pf, stroke=INK, sw=1.6, dash="6 4")
    F.ticks(pa, pe, 1, color=INK)
    F.ticks(pe, pd, 1, color=INK)
    F.ticks(pb, pf, 2, color=INK)
    F.ticks(pf, pc, 2, color=INK)
    ctr = G.centroid([pa, pb, pc, pd])
    vlabels(F, [pa, pb, pc, pd], ["A", "B", "C", "D"], ctr)
    lab(F, pe, "E", -12, 0)
    lab(F, pf, "F", 12, 0)
    lab(F, G.mid(pa, pb), "14", 0, 15)
    lab(F, G.mid(pd, pc), "8", 0, -11)
    lab(F, G.mid(pe, pf), "x", 0, -9, size=14, italic=True)
    o, i = opts([7, 8, 9, 10, 11], 11)
    return dict(F=F,
                question="Şekildeki ABCD yamuğunda [AB] ∥ [DC], E ve F bulundukları kenarların orta noktalarıdır.\n|AB| = 14 birim ve |DC| = 8 birim olduğuna göre, |EF| = x kaç birimdir?",
                options=o, answer=i,
                explanation="Yamukta orta taban, tabanların aritmetik ortalamasıdır: x = (14 + 8)/2 = 11.")


@q(8)
def q8_2():
    a, c, h = 12, 6, 5
    A, B, C, D = trapezoid(a, c, h, 2.0)
    area = (a + c) * h / 2
    assert close(area, 45)
    H = (D[0], 0)
    Z = Q(320, 200)
    s = Z.fit([A, B, C, D])
    pa, pb, pc, pd, ph = [s(p) for p in (A, B, C, D, H)]
    F = Z.F
    F.poly([pa, pb, pc, pd], fill=SOFT, stroke=INK)
    F.line(pd, ph, stroke=INK, sw=1.4, dash="5 4")
    F.right(ph, pd, pb, s=8, color=INK)
    ctr = G.centroid([pa, pb, pc, pd])
    vlabels(F, [pa, pb, pc, pd], ["A", "B", "C", "D"], ctr)
    lab(F, ph, "H", 0, 16)
    lab(F, G.mid(pa, pb), "12", 18, 15)
    lab(F, G.mid(pd, pc), "6", 0, -11)
    lab(F, G.mid(pd, ph), "5", 9, 0)
    o, i = opts([45, 48, 54, 60, 90], 45)
    return dict(F=F,
                question="Şekildeki ABCD yamuğunda [AB] ∥ [DC], [DH] ⊥ [AB], |AB| = 12 birim, |DC| = 6 birim ve |DH| = 5 birimdir.\nBuna göre, ABCD yamuğunun alanı kaç birimkaredir?",
                options=o, answer=i,
                explanation="Yamuğun alanı = (taban toplamı)·yükseklik/2 = (12 + 6)·5/2 = 45 birimkare.")


@q(8)
def q8_3():
    p, q_, r, s_ = 3, 4, 8, 6   # köşegenlerin kesişim noktasına uzaklıklar
    O = (0, 0)
    A, B, C, D = (-p, 0), (0, q_), (r, 0), (0, -s_)
    AB, BC, CD, DA = dist(A, B), dist(B, C), dist(C, D), dist(D, A)
    assert close(AB, 5) and close(CD, 10) and close(BC, 4 * math.sqrt(5)) and close(DA, 3 * math.sqrt(5))
    assert close(AB ** 2 + CD ** 2, BC ** 2 + DA ** 2)
    Z = Q(320, 220)
    s = Z.fit([A, B, C, D])
    pa, pb, pc, pd, po = [s(x) for x in (A, B, C, D, O)]
    F = Z.F
    F.poly([pa, pb, pc, pd], fill=SOFT, stroke=INK)
    F.line(pa, pc, stroke=INK, sw=1.4, dash="5 4")
    F.line(pb, pd, stroke=INK, sw=1.4, dash="5 4")
    F.right(po, pc, pb, s=8, color=INK)
    ctr = po
    vlabels(F, [pa, pb, pc, pd], ["A", "B", "C", "D"], ctr)
    side(F, pa, pb, "5", ctr)
    side(F, pb, pc, "4√5", ctr, gap=15)
    side(F, pc, pd, "10", ctr)
    side(F, pd, pa, "x", ctr, size=14, italic=True)
    vals = ["√30", "3√5", "4√3", "7", "2√13"]
    o, i = opts(vals, "3√5")
    return dict(F=F,
                question="Şekildeki ABCD dörtgeninde köşegenler birbirine diktir.\n|AB| = 5 birim, |BC| = 4√5 birim ve |CD| = 10 birim olduğuna göre, |AD| = x kaç birimdir?",
                options=o, answer=i,
                explanation="Köşegenleri dik dörtgende karşılıklı kenarların kareleri toplamı eşittir: 5² + 10² = (4√5)² + x² → 125 = 80 + x² → x = √45 = 3√5.")


def poly_from_angles(angles, ab, bc):
    """İç açıları sırasıyla A, B, C, D olan dışbükey dörtgen (|AB|, |BC| verilir)."""
    A = (0.0, 0.0)
    B = (ab, 0.0)
    h = 0.0                       # AB doğrultusu
    h += 180 - angles[1]          # B'de dönüş
    C = G.add(B, P(h, bc))
    h += 180 - angles[2]          # C'de dönüş -> CD doğrultusu
    dir_cd = P(h)
    dir_ad = P(angles[0])         # A'dan D'ye
    D = inter(C, dir_cd, A, dir_ad)
    return A, B, C, D


@q(8)
def q8_4():
    x = 50
    angs = [x + 20, 2 * x, 100, 90]
    assert sum(angs) == 360
    A, B, C, D = poly_from_angles(angs, 10.0, 6.0)
    for v, p, q_, want in ((A, D, B, angs[0]), (B, A, C, angs[1]), (C, B, D, angs[2]), (D, C, A, angs[3])):
        assert close(angle_at(v, p, q_), want, 1e-6), (want, angle_at(v, p, q_))
    Z = Q(320, 210)
    s = Z.fit([A, B, C, D])
    pa, pb, pc, pd = [s(p) for p in (A, B, C, D)]
    F = Z.F
    F.poly([pa, pb, pc, pd], fill=SOFT, stroke=INK)
    ctr = G.centroid([pa, pb, pc, pd])
    vlabels(F, [pa, pb, pc, pd], ["A", "B", "C", "D"], ctr)
    ang(F, pa, pb, pd, 24, "x + 20°", lr=50, size=11)
    ang(F, pb, pc, pa, 22, "2x", lr=40, size=12)
    ang(F, pc, pd, pb, 22, "100°", lr=44, size=11)
    F.right(pd, pc, pa, s=10, color=INK)
    o, i = opts([35, 40, 45, 50, 55], 50)
    return dict(F=F,
                question="Şekildeki ABCD dörtgeninde m(DAB) = x + 20°, m(ABC) = 2x, m(BCD) = 100° ve [DA] ⊥ [DC]'dir.\nBuna göre, x kaç derecedir?",
                options=[s_ + "°" for s_ in o], answer=i,
                explanation="Dörtgenin iç açıları toplamı 360°: (x + 20) + 2x + 100 + 90 = 360 → 3x = 150 → x = 50°.")


# ======================= 9. Paralelkenar ve Özel Dörtgenler =======================

@q(9)
def q9_1():
    AD, DC = 7, 12
    A_ = 64
    A = (0, 0)
    B = (DC, 0)
    D = P(A_, AD)
    C = G.add(B, D)
    # AE açıortay, E ∈ [DC]: |DE| = |AD| = 7
    E = inter(A, P(A_ / 2), D, (1, 0))
    assert close(dist(D, E), 7) and close(dist(E, C), 5)
    Z = Q(320, 190)
    s = Z.fit([A, B, C, D])
    pa, pb, pc, pd, pe = [s(p) for p in (A, B, C, D, E)]
    F = Z.F
    F.poly([pa, pb, pc, pd], fill=SOFT, stroke=INK)
    F.line(pa, pe, stroke=INK, sw=1.6)
    ang(F, pa, pb, pe, 24)
    ang(F, pa, pe, pd, 29)
    ctr = G.centroid([pa, pb, pc, pd])
    vlabels(F, [pa, pb, pc, pd], ["A", "B", "C", "D"], ctr)
    lab(F, pe, "E", 0, -12)
    side(F, pa, pd, "7", ctr)
    lab(F, G.mid(pa, pb), "12", 0, 15)
    lab(F, G.mid(pe, pc), "x", 0, -11, size=14, italic=True)
    o, i = opts([5, 6, 7, 8, 9], 5)
    return dict(F=F,
                question="Şekildeki ABCD paralelkenarında [AE], A açısının açıortayı ve E ∈ [DC]'dir.\n|AD| = 7 birim ve |AB| = 12 birim olduğuna göre, |EC| = x kaç birimdir?",
                options=o, answer=i,
                explanation="[AB] ∥ [DC] olduğundan m(DEA) = m(EAB) = m(DAE). ADE ikizkenar: |DE| = |AD| = 7. |DC| = 12 → x = 12 − 7 = 5.")


@q(9)
def q9_2():
    e, f = 16, 12
    a = math.sqrt((e / 2) ** 2 + (f / 2) ** 2)
    assert close(a, 10)
    A, C = (-e / 2, 0), (e / 2, 0)
    B, D = (0, f / 2), (0, -f / 2)
    Z = Q(320, 210)
    s = Z.fit([A, B, C, D])
    pa, pb, pc, pd, po = [s(p) for p in (A, B, C, D, (0, 0))]
    F = Z.F
    F.poly([pa, pb, pc, pd], fill=SOFT, stroke=INK)
    F.line(pa, pc, stroke=INK, sw=1.4, dash="5 4")
    F.line(pb, pd, stroke=INK, sw=1.4, dash="5 4")
    vlabels(F, [pa, pb, pc, pd], ["A", "B", "C", "D"], po)
    o, i = opts([24, 28, 32, 36, 40], 40)
    return dict(F=F,
                question="Şekildeki ABCD eşkenar dörtgeninde köşegen uzunlukları |AC| = 16 birim ve |BD| = 12 birimdir.\nBuna göre, ABCD eşkenar dörtgeninin çevresi kaç birimdir?",
                options=o, answer=i,
                explanation="Eşkenar dörtgende köşegenler birbirini dik ortalar: kenar = √(8² + 6²) = 10. Çevre = 4·10 = 40 birim.")


@q(9)
def q9_3():
    AB, BC = 15, 8
    AC = math.hypot(AB, BC)
    assert close(AC, 17)
    A, B, C, D = (0, 0), (AB, 0), (AB, BC), (0, BC)
    Z = Q(320, 200)
    s = Z.fit([A, B, C, D])
    pa, pb, pc, pd = [s(p) for p in (A, B, C, D)]
    F = Z.F
    F.poly([pa, pb, pc, pd], fill=SOFT, stroke=INK)
    F.line(pa, pc, stroke=INK, sw=1.6)
    for v, p, q_ in ((pa, pb, pd), (pb, pc, pa), (pc, pd, pb), (pd, pa, pc)):
        F.right(v, p, q_, s=9, color=INK)
    ctr = G.centroid([pa, pb, pc, pd])
    vlabels(F, [pa, pb, pc, pd], ["A", "B", "C", "D"], ctr)
    lab(F, G.mid(pa, pb), "15", 0, 15)
    lab(F, G.mid(pb, pc), "8", 12, 0)
    lab(F, G.mid(pa, pc), "x", -4, -11, size=14, italic=True)
    o, i = opts([15, 16, 17, 18, 19], 17)
    return dict(F=F,
                question="Şekildeki ABCD dikdörtgeninde |AB| = 15 birim ve |BC| = 8 birimdir.\nBuna göre, |AC| = x kaç birimdir?",
                options=o, answer=i,
                explanation="ABC dik üçgeninde x² = 15² + 8² = 289 → x = 17.")


@q(9)
def q9_4():
    AO, BO, OC = 3, 4, 8
    A, C = (0, AO), (0, -OC)
    B, D = (-BO, 0), (BO, 0)
    assert close(dist(A, B), 5) and close(dist(C, B), 4 * math.sqrt(5))
    area = (AO + OC) * (2 * BO) / 2
    assert close(area, 44)
    Z = Q(320, 220)
    s = Z.fit([A, B, C, D])
    pa, pb, pc, pd, po = [s(p) for p in (A, B, C, D, (0, 0))]
    F = Z.F
    F.poly([pa, pb, pc, pd], fill=SOFT, stroke=INK)
    F.line(pa, pc, stroke=INK, sw=1.4, dash="5 4")
    F.line(pb, pd, stroke=INK, sw=1.4, dash="5 4")
    F.right(po, pd, pc, s=8, color=INK)
    ctr = G.centroid([pa, pb, pc, pd])
    vlabels(F, [pa, pb, pc, pd], ["A", "B", "C", "D"], ctr)
    side(F, pa, pb, "5", ctr)
    side(F, pa, pd, "5", ctr)
    side(F, pc, pb, "4√5", ctr, gap=15)
    side(F, pc, pd, "4√5", ctr, gap=15)
    o, i = opts([36, 38, 40, 44, 48], 44)
    return dict(F=F,
                question="Şekildeki ABCD deltoidinde |AB| = |AD| = 5 birim, |CB| = |CD| = 4√5 birim ve |BD| = 8 birimdir.\nBuna göre, ABCD deltoidinin alanı kaç birimkaredir?",
                options=o, answer=i,
                explanation="Köşegenler diktir ve [AC], [BD]'yi ortalar: |BO| = 4. |AO| = √(25 − 16) = 3, |OC| = √(80 − 16) = 8. |AC| = 11. Alan = 11·8/2 = 44 birimkare.")


# ======================= 10. Çokgenler =======================

def regular(n, R=1.0, start=90):
    return [P(start + 360.0 * i / n, R) for i in range(n)]


@q(10)
def q10_1():
    a = 4
    pts = regular(6, a, 0)
    area = 3 * math.sqrt(3) / 2 * a * a
    assert close(dist(pts[0], pts[1]), 4) and close(area, 24 * math.sqrt(3))
    Z = Q(320, 210)
    s = Z.fit(pts)
    sp = [s(p) for p in pts]
    F = Z.F
    F.poly(sp, fill=SOFT, stroke=INK)
    c = s((0, 0))
    names = ["A", "B", "C", "D", "E", "F"]
    for p, nm in zip(sp, names):
        F.vlabel(p, nm, c, gap=13, color=INK, size=14)
    side(F, sp[0], sp[1], "4", c)
    vals = ["6√3", "8√3", "12√3", "16√3", "24√3"]
    o, i = opts(vals, "24√3")
    return dict(F=F,
                question="Şekildeki ABCDEF düzgün altıgeninin bir kenarı 4 birimdir.\nBuna göre, altıgenin alanı kaç birimkaredir?",
                options=o, answer=i,
                explanation="Düzgün altıgen 6 eşkenar üçgenden oluşur: 6·(4²√3/4) = 6·4√3 = 24√3 birimkare.")


@q(10)
def q10_2():
    pts = regular(5, 1.0, 90)
    A, B, C = pts[0], pts[1], pts[2]
    x = angle_at(A, B, C)
    assert close(x, 36)
    Z = Q(320, 210)
    s = Z.fit(pts)
    sp = [s(p) for p in pts]
    F = Z.F
    F.poly(sp, fill=SOFT, stroke=INK)
    F.line(sp[0], sp[2], stroke=INK, sw=1.6)
    c = s((0, 0))
    for p, nm in zip(sp, ["A", "B", "C", "D", "E"]):
        F.vlabel(p, nm, c, gap=13, color=INK, size=14)
    ang(F, sp[0], sp[1], sp[2], 30, "x", lr=44, size=14, italic=True)
    o, i = opts([30, 36, 42, 54, 72], 36)
    return dict(F=F,
                question="Şekildeki ABCDE düzgün beşgeninde [AC] köşegeni çizilmiştir.\nBuna göre, m(BAC) = x kaç derecedir?",
                options=[s_ + "°" for s_ in o], answer=i,
                explanation="Düzgün beşgenin bir iç açısı (5 − 2)·180/5 = 108°. ABC ikizkenar üçgen: x = (180 − 108)/2 = 36°.")


@q(10)
def q10_3():
    pts = regular(8, 1.0, 112.5)
    A, B, C = pts[0], pts[1], pts[2]
    x = angle_at(C, B, A)
    assert close(x, 22.5)
    Z = Q(320, 220)
    s = Z.fit(pts)
    sp = [s(p) for p in pts]
    F = Z.F
    F.poly(sp, fill=SOFT, stroke=INK)
    F.line(sp[0], sp[2], stroke=INK, sw=1.6)
    c = s((0, 0))
    for p, nm in zip(sp, ["A", "B", "C", "D", "E", "F", "G", "H"]):
        F.vlabel(p, nm, c, gap=13, color=INK, size=14)
    ang(F, sp[2], sp[1], sp[0], 30, "x", lr=44, size=14, italic=True)
    vals = ["15", "18", "20", "22,5", "30"]
    o, i = opts(vals, "22,5")
    return dict(F=F,
                question="Şekildeki ABCDEFGH düzgün sekizgeninde [AC] köşegeni çizilmiştir.\nBuna göre, m(ACB) = x kaç derecedir?",
                options=[s_ + "°" for s_ in o], answer=i,
                explanation="Düzgün sekizgenin bir iç açısı (8 − 2)·180/8 = 135°. ABC ikizkenar üçgen: x = (180 − 135)/2 = 22,5°.")


@q(10)
def q10_4():
    a = 6
    pts = regular(6, a, 180)
    A, C = pts[0], pts[2]
    AC = dist(A, C)
    assert close(dist(pts[0], pts[1]), 6) and close(AC, 6 * math.sqrt(3))
    Z = Q(320, 210)
    s = Z.fit(pts)
    sp = [s(p) for p in pts]
    F = Z.F
    F.poly(sp, fill=SOFT, stroke=INK)
    F.line(sp[0], sp[2], stroke=INK, sw=1.6)
    c = s((0, 0))
    for p, nm in zip(sp, ["A", "B", "C", "D", "E", "F"]):
        F.vlabel(p, nm, c, gap=13, color=INK, size=14)
    side(F, sp[0], sp[1], "6", c)
    lab(F, G.lerp(sp[0], sp[2], 0.55), "x", 6, 12, size=14, italic=True)
    vals = ["6", "6√2", "9", "10", "6√3"]
    o, i = opts(vals, "6√3")
    return dict(F=F,
                question="Şekildeki ABCDEF düzgün altıgeninin bir kenarı 6 birimdir.\nBuna göre, |AC| = x kaç birimdir?",
                options=o, answer=i,
                explanation="m(ABC) = 120°, |AB| = |BC| = 6. Kosinüs teoremi ya da 30°-60°-90° üçgeni ile |AC| = 6√3.")


# ======================= 11. Çember ve Daire =======================

@q(11)
def q11_1():
    O = (0, 0)
    R = 1.0
    A, B, C = P(215, R), P(325, R), P(95, R)
    central = angle_at(O, A, B)
    x = angle_at(C, A, B)
    assert close(central, 110) and close(x, 55)
    Z = Q(320, 220)
    s = Z.fit([(-1, -1), (1, 1)], pad=(40, 26, 40, 26))
    pa, pb, pc, po = s(A), s(B), s(C), s(O)
    F = Z.F
    F.circle(po, R * Z.k, fill=SOFT, stroke=INK)
    F.line(po, pa, stroke=INK, sw=1.6)
    F.line(po, pb, stroke=INK, sw=1.6)
    F.line(pc, pa, stroke=INK, sw=1.6)
    F.line(pc, pb, stroke=INK, sw=1.6)
    for p in (pa, pb, pc, po):
        F.dot(p, r=2.6, color=INK)
    for p, nm in ((pa, "A"), (pb, "B"), (pc, "C")):
        F.vlabel(p, nm, po, gap=13, color=INK, size=14)
    lab(F, po, "O", 0, -12)
    ang(F, po, pa, pb, 18, "110°", lr=34, size=11)
    ang(F, pc, pa, pb, 26, "x", lr=40, size=14, italic=True)
    o, i = opts([55, 60, 65, 70, 75], 55)
    return dict(F=F,
                question="Şekilde O merkezli çemberde A, B ve C noktaları çember üzerindedir.\nm(AOB) = 110° olduğuna göre, m(ACB) = x kaç derecedir?",
                options=[s_ + "°" for s_ in o], answer=i,
                explanation="Aynı yayı gören çevre açı, merkez açının yarısıdır: x = 110/2 = 55°.")


@q(11)
def q11_2():
    O = (0, 0)
    A, B = (-1.0, 0), (1.0, 0)
    C = P(2 * 32, 1.0)  # merkez açı BOC = 64° -> çevre açı CAB = 32°
    assert close(angle_at(A, C, B), 32) and close(angle_at(C, A, B), 90)
    x = angle_at(B, A, C)
    assert close(x, 58)
    Z = Q(320, 210)
    s = Z.fit([(-1, -1), (1, 1)], pad=(40, 22, 40, 22))
    pa, pb, pc, po = s(A), s(B), s(C), s(O)
    F = Z.F
    F.circle(po, Z.k, fill=SOFT, stroke=INK)
    F.line(pa, pb, stroke=INK, sw=1.6)
    F.line(pa, pc, stroke=INK, sw=1.6)
    F.line(pc, pb, stroke=INK, sw=1.6)
    for p in (pa, pb, pc, po):
        F.dot(p, r=2.6, color=INK)
    for p, nm in ((pa, "A"), (pb, "B"), (pc, "C")):
        F.vlabel(p, nm, po, gap=13, color=INK, size=14)
    lab(F, po, "O", 0, 13)
    ang(F, pa, pc, pb, 30, "32°", lr=50, size=11)
    ang(F, pb, pa, pc, 22, "x", lr=36, size=14, italic=True)
    o, i = opts([48, 52, 56, 58, 64], 58)
    return dict(F=F,
                question="Şekilde [AB], O merkezli çemberin çapı ve C noktası çember üzerindedir.\nm(CAB) = 32° olduğuna göre, m(ABC) = x kaç derecedir?",
                options=[s_ + "°" for s_ in o], answer=i,
                explanation="Çapı gören çevre açı 90°'dir: m(ACB) = 90°. x = 180 − 90 − 32 = 58°.")


@q(11)
def q11_3():
    PA, AB, PC = 4, 5, 3
    PB = PA + AB
    PD = PA * PB / PC
    CD = PD - PC
    assert close(PD, 12) and close(CD, 9)
    # gerçek konumlar: P dışarıda, iki kesen
    P0 = (0.0, 0.0)
    # çember merkezi ve yarıçapı, iki kesen doğrultusundan bulunur
    t1, t2 = math.radians(8), math.radians(-24)
    A_, B_ = P(8, PA), P(8, PB)
    C_, D_ = P(-24, PC), P(-24, PD)
    # A, B, C, D çember üzerinde olmalı: üç noktadan çember, dördüncüyü kontrol et
    def circ(p, q_, r_):
        ax, ay = p
        bx, by = q_
        cx, cy = r_
        d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by))
        ux = ((ax * ax + ay * ay) * (by - cy) + (bx * bx + by * by) * (cy - ay) + (cx * cx + cy * cy) * (ay - by)) / d
        uy = ((ax * ax + ay * ay) * (cx - bx) + (bx * bx + by * by) * (ax - cx) + (cx * cx + cy * cy) * (bx - ax)) / d
        return (ux, uy), math.hypot(ax - ux, ay - uy)
    Oc, R = circ(A_, B_, C_)
    assert close(dist(Oc, D_), R, 1e-6)
    del t1, t2
    Z = Q(320, 220)
    s = Z.fit([P0, (Oc[0] - R, Oc[1] - R), (Oc[0] + R, Oc[1] + R)], pad=(30, 18, 30, 18))
    pp, pa, pb, pc, pd, po = [s(x) for x in (P0, A_, B_, C_, D_, Oc)]
    F = Z.F
    F.circle(po, R * Z.k, fill=SOFT, stroke=INK)
    F.line(pp, G.lerp(pp, pb, 1.06), stroke=INK, sw=1.6)
    F.line(pp, G.lerp(pp, pd, 1.04), stroke=INK, sw=1.6)
    for x_ in (pp, pa, pb, pc, pd):
        F.dot(x_, r=2.6, color=INK)
    lab(F, pp, "P", -12, 0)
    lab(F, pa, "A", -2, -13)
    lab(F, pb, "B", 6, -13)
    lab(F, pc, "C", 12, -4)
    lab(F, pd, "D", 6, 14)
    lab(F, G.mid(pp, pa), "4", 0, -11)
    lab(F, G.mid(pa, pb), "5", 0, 13)
    lab(F, G.mid(pp, pc), "3", -4, 14)
    lab(F, G.mid(pc, pd), "x", 4, 14, size=14, italic=True)
    o, i = opts([7, 8, 9, 10, 12], 9)
    return dict(F=F,
                question="Şekilde P noktasından çizilen iki kesen çemberi A, B ve C, D noktalarında kesmektedir.\n|PA| = 4 birim, |AB| = 5 birim ve |PC| = 3 birim olduğuna göre, |CD| = x kaç birimdir?",
                options=o, answer=i,
                explanation="Noktanın çembere göre kuvveti: |PA|·|PB| = |PC|·|PD| → 4·9 = 3·(3 + x) → 3 + x = 12 → x = 9.")


@q(11)
def q11_4():
    PA, PB = 4, 16
    PT = math.sqrt(PA * PB)
    assert close(PT, 8)
    # P(0,0), kesen x ekseni üzerinde; çember A ve B'den geçer, PT teğet
    A_, B_ = (PA, 0.0), (PB, 0.0)
    cx = (PA + PB) / 2
    cy = 4.5
    R = math.hypot(cx - PA, cy)
    O = (cx, cy)
    d = math.hypot(cx, cy)
    tl = math.sqrt(d * d - R * R)
    assert close(tl, PT, 1e-9)
    th = math.atan2(cy, cx) + math.asin(R / d)
    T = (tl * math.cos(th), tl * math.sin(th))
    Z = Q(320, 220)
    s = Z.fit([(0, 0), (cx - R, cy - R), (cx + R, cy + R)], pad=(30, 18, 30, 18))
    pp, pa, pb, pt, po = [s(x) for x in ((0, 0), A_, B_, T, O)]
    F = Z.F
    F.circle(po, R * Z.k, fill=SOFT, stroke=INK)
    F.line(pp, G.lerp(pp, pb, 1.05), stroke=INK, sw=1.6)
    F.line(pp, G.lerp(pp, pt, 1.12), stroke=INK, sw=1.6)
    for x_ in (pp, pa, pb, pt):
        F.dot(x_, r=2.6, color=INK)
    lab(F, pp, "P", -12, 0)
    lab(F, pa, "A", -2, 14)
    lab(F, pb, "B", 4, 14)
    lab(F, pt, "T", -4, -13)
    lab(F, G.mid(pp, pa), "4", 0, 13)
    lab(F, G.mid(pa, pb), "12", 0, 13)
    lab(F, G.mid(pp, pt), "x", -6, -10, size=14, italic=True)
    o, i = opts([4, 5, 6, 7, 8], 8)
    return dict(F=F,
                question="Şekilde [PT, çembere T noktasında teğettir. P, A ve B noktaları doğrusaldır.\n|PA| = 4 birim ve |AB| = 12 birim olduğuna göre, |PT| = x kaç birimdir?",
                options=o, answer=i,
                explanation="Teğet-kesen bağıntısı: x² = |PA|·|PB| = 4·16 = 64 → x = 8.")


# ======================= 12. Katı Cisimler =======================

def box(F, o, a, b, c, dx, dy):
    """Dikdörtgenler prizması (ekran): genişlik a, derinlik b, yükseklik c."""
    A = o
    B = (o[0] + a, o[1])
    C = (B[0], B[1] - c)
    D = (A[0], A[1] - c)
    A2, B2, C2, D2 = [(p[0] + dx * b, p[1] + dy * b) for p in (A, B, C, D)]
    F.line(A, A2, stroke=INK, sw=1.3, dash="5 4")
    F.line(A2, B2, stroke=INK, sw=1.3, dash="5 4")
    F.line(A2, D2, stroke=INK, sw=1.3, dash="5 4")
    F.poly([A, B, C, D], fill=SOFT, stroke=INK)
    F.poly([D, C, C2, D2], fill="#eef2f6", stroke=INK)
    F.poly([B, B2, C2, C], fill="#e2e8f0", stroke=INK)
    return A, B, C, D, A2, B2, C2, D2


@q(12)
def q12_1():
    a, b, c = 12, 4, 3
    diag = math.sqrt(a * a + b * b + c * c)
    assert close(diag, 13)
    Z = Q(320, 210)
    F = Z.F
    k = 15.0
    A, B, C, D, A2, B2, C2, D2 = box(F, (56, 176), a * k, b * k, c * k * 2.2, 0.72, -0.62)
    F.line(A, C2, stroke=INK, sw=1.6)
    lab(F, G.mid(A, B), "12", 0, 15)
    lab(F, G.mid(B, B2), "4", 12, 6)
    lab(F, G.mid(A, D), "3", -11, 0)
    lab(F, A, "A", -10, 10)
    lab(F, C2, "K", 10, -8)
    o, i = opts([12, 13, 14, 15, 16], 13)
    return dict(F=F,
                question="Şekildeki dikdörtgenler prizmasının ayrıt uzunlukları 12, 4 ve 3 birimdir.\nBuna göre, prizmanın [AK] cisim köşegeninin uzunluğu kaç birimdir?",
                options=o, answer=i,
                explanation="Cisim köşegeni = √(12² + 4² + 3²) = √(144 + 16 + 9) = √169 = 13 birim.")


def cylinder(F, cx, top, bot, r, ry):
    F.path("M %s %s L %s %s A %s %s 0 0 0 %s %s L %s %s" % (
        G.f(cx - r), G.f(top), G.f(cx - r), G.f(bot), G.f(r), G.f(ry), G.f(cx + r), G.f(bot), G.f(cx + r), G.f(top)), fill=SOFT, stroke=INK)
    F.path("M %s %s A %s %s 0 0 1 %s %s" % (G.f(cx - r), G.f(bot), G.f(r), G.f(ry), G.f(cx + r), G.f(bot)), stroke=INK, sw=1.2, dash="4 4")
    F.ellipse((cx, top), r, ry, fill="#eef2f6", stroke=INK)


@q(12)
def q12_2():
    r, h = 3, 8
    V = math.pi * r * r * h
    assert close(V / math.pi, 72)
    Z = Q(320, 220)
    F = Z.F
    k = 19.0
    cx, top = 160, 40
    bot = top + h * k
    cylinder(F, cx, top, bot, r * k, 14)
    F.line((cx, top), (cx + r * k, top), stroke=INK, sw=1.6)
    F.dot((cx, top), r=2.4, color=INK)
    lab(F, (cx + r * k / 2, top), "3", 0, -5, size=12)
    F.line((cx + r * k + 14, top), (cx + r * k + 14, bot), stroke=INK, sw=1.2)
    lab(F, (cx + r * k + 24, (top + bot) / 2), "8", 0, 0)
    vals = ["48π", "60π", "72π", "96π", "144π"]
    o, i = opts(vals, "72π")
    return dict(F=F,
                question="Şekildeki dik dairesel silindirin taban yarıçapı 3 birim, yüksekliği 8 birimdir.\nBuna göre, silindirin hacmi kaç birimküptür?",
                options=o, answer=i,
                explanation="Silindirin hacmi = πr²h = π·9·8 = 72π birimküp.")


@q(12)
def q12_3():
    r, h = 6, 8
    l = math.hypot(r, h)
    lateral = math.pi * r * l
    assert close(l, 10) and close(lateral / math.pi, 60)
    Z = Q(320, 220)
    F = Z.F
    k = 18.0
    cx, apex = 160, 26
    base = apex + h * k
    R = r * k
    ry = 16
    F.path("M %s %s L %s %s L %s %s A %s %s 0 0 1 %s %s Z" % (
        G.f(cx - R), G.f(base), G.f(cx), G.f(apex), G.f(cx + R), G.f(base), G.f(R), G.f(ry), G.f(cx - R), G.f(base)), fill=SOFT, stroke=INK)
    F.path("M %s %s A %s %s 0 0 1 %s %s" % (G.f(cx - R), G.f(base), G.f(R), G.f(ry), G.f(cx + R), G.f(base)), stroke=INK, sw=1.2, dash="4 4")
    F.line((cx, apex), (cx, base), stroke=INK, sw=1.3, dash="5 4")
    F.line((cx, base), (cx + R, base), stroke=INK, sw=1.4)
    F.right((cx, base), (cx, apex), (cx + R, base), s=8, color=INK)
    F.dot((cx, base), r=2.4, color=INK)
    lab(F, (cx, (apex + base) / 2), "8", -10, 0)
    lab(F, (cx + R / 2, base), "6", 0, -5, size=12)
    vals = ["60π", "64π", "80π", "96π", "100π"]
    o, i = opts(vals, "60π")
    return dict(F=F,
                question="Şekildeki dik dairesel koninin yüksekliği 8 birim, taban yarıçapı 6 birimdir.\nBuna göre, koninin yanal alanı kaç birimkaredir?",
                options=o, answer=i,
                explanation="Ana doğru ℓ = √(6² + 8²) = 10. Yanal alan = π·r·ℓ = π·6·10 = 60π birimkare.")


@q(12)
def q12_4():
    a = 6
    r = a / 2
    V = 4 / 3 * math.pi * r ** 3
    assert close(V / math.pi, 36)
    Z = Q(320, 220)
    F = Z.F
    k = 20.0
    o = (96, 192)
    dx, dy = 0.55, -0.42
    side_ = a * k
    A, B, C, D, A2, B2, C2, D2 = box(F, o, side_, side_ * 0.62, side_, dx / 0.62 * 0.62, dy)
    ctr = G.centroid([A, B, C, D, A2, B2, C2, D2])
    R = side_ / 2
    F.circle(ctr, R, fill="#ffffff", stroke=INK, sw=1.6)
    F.path("M %s %s A %s %s 0 0 0 %s %s" % (G.f(ctr[0] - R), G.f(ctr[1]), G.f(R), G.f(R * 0.25), G.f(ctr[0] + R), G.f(ctr[1])), stroke=INK, sw=1.2)
    F.path("M %s %s A %s %s 0 0 1 %s %s" % (G.f(ctr[0] - R), G.f(ctr[1]), G.f(R), G.f(R * 0.25), G.f(ctr[0] + R), G.f(ctr[1])), stroke=INK, sw=1.0, dash="4 4")
    lab(F, G.mid(A, B), "6", 0, 15)
    vals = ["27π", "32π", "36π", "48π", "72π"]
    o_, i = opts(vals, "36π")
    return dict(F=F,
                question="Şekilde bir ayrıtı 6 birim olan küpün içine, küpün tüm yüzlerine teğet olan bir küre yerleştirilmiştir.\nBuna göre, kürenin hacmi kaç birimküptür?",
                options=o_, answer=i,
                explanation="Kürenin çapı küpün ayrıtına eşittir: r = 3. Hacim = (4/3)πr³ = (4/3)·π·27 = 36π birimküp.")


# ---------------------------------------------------------------
# çıktı
# ---------------------------------------------------------------

def build():
    out = {}
    for konu in sorted(QUESTIONS):
        items = []
        for n, fn in enumerate(QUESTIONS[konu], 1):
            d = fn()
            F = mono(d["F"])
            svg = F.svg().replace(' class="geo-fig w-full max-w-[380px] mx-auto my-3"', "")
            svg = svg.replace('stroke="#e2e8f0" stroke-width="1.5"/>', 'stroke="#d6d3d1" stroke-width="1.5"/>', 1)
            name = "soru-%d-%d" % (konu, n)
            items.append(dict(name=name, svg=svg, question=d["question"], options=d["options"],
                              answer=d["answer"], explanation=d["explanation"]))
        out[konu] = items
    return out


def js_block(items):
    lines = [MARK_START]
    for it in items:
        obj = {
            "question": it["question"],
            "options": it["options"],
            "correctAnswerIndex": it["answer"],
            "explanation": it["explanation"],
            "img": "img/geometri/%s.png?v=%d" % (it["name"], PNG_VERSION),
            "imgAlt": "Soru şekli",
            "sekilli": True,
        }
        lines.append("%s.push(%s);" % ("{VAR}", json.dumps(obj, ensure_ascii=False, indent=4)))
    lines.append(MARK_END)
    return "\n".join(lines) + "\n"


def render_pngs(items, outdir):
    os.makedirs(outdir, exist_ok=True)
    payload = [{"svg": it["svg"], "out": os.path.join(outdir, it["name"] + ".png")} for it in items]
    js = r"""
var R = require("@resvg/resvg-js").Resvg, fs = require("fs");
var list = JSON.parse(fs.readFileSync(0, "utf8"));
list.forEach(function (x) {
  var png = new R(x.svg, { fitTo: { mode: "width", value: 800 }, background: "#ffffff",
    font: { loadSystemFonts: true, defaultFontFamily: "DejaVu Sans", sansSerifFamily: "DejaVu Sans" } }).render().asPng();
  fs.writeFileSync(x.out, png);
});
"""
    subprocess.run(["node", "-e", js], input=json.dumps(payload).encode("utf-8"), check=True, cwd=ROOT)


def main():
    args = sys.argv[1:]
    data = build()
    if "--sheet" in args:
        dst = args[args.index("--sheet") + 1]
        html = ['<!doctype html><meta charset="utf-8"><body style="font-family:sans-serif;background:#f1f5f9;margin:12px">']
        for konu, items in data.items():
            for it in items:
                html.append('<div style="display:inline-block;width:340px;margin:6px;vertical-align:top;background:#fff;padding:8px;border-radius:10px;font-size:12px"><b>%s</b><div style="width:320px">%s</div><p>%s</p><p>%s</p><p><b>%s</b></p></div>' % (
                    it["name"], it["svg"], it["question"].replace("\n", "<br>"), " · ".join(it["options"]), it["options"][it["answer"]]))
        open(dst, "w", encoding="utf-8").write("".join(html))
        print("önizleme:", dst, sum(len(v) for v in data.values()), "soru")
        return
    stale = []
    for konu, items in data.items():
        p = os.path.join(ROOT, "sorular", "geometri-%d.js" % konu)
        src = open(p, encoding="utf-8").read()
        var = re.search(r"window\.(\w+)\s*=", src).group(1)
        base = re.sub(re.escape(MARK_START) + r"[\s\S]*?" + re.escape(MARK_END) + r"\n?", "", src).rstrip() + "\n"
        new = base + js_block(items).replace("{VAR}", "window." + var)
        if new != src:
            stale.append(p)
            if "--check" not in args:
                open(p, "w", encoding="utf-8").write(new)
    pngdir = os.path.join(ROOT, "img", "geometri")
    missing = [it["name"] for items in data.values() for it in items if not os.path.exists(os.path.join(pngdir, it["name"] + ".png"))]
    if "--check" in args:
        if stale or missing:
            raise SystemExit("güncel değil: %s %s" % (", ".join(os.path.relpath(s, ROOT) for s in stale), " ".join(missing)))
        print("şekilli geometri soruları güncel (%d soru)." % sum(len(v) for v in data.values()))
        return
    render_pngs([it for items in data.values() for it in items], pngdir)
    print("%d soru, %d dosya güncellendi." % (sum(len(v) for v in data.values()), len(stale)))


if __name__ == "__main__":
    main()
