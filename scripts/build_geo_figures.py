# -*- coding: utf-8 -*-
"""
Geometri konu notlarındaki şekilleri gerçek koordinatlarla üretir.

Her şekil hesaplanarak çizilir: dik açı gerçekten 90°, eşit işaretli kenarlar gerçekten eşit,
açıortay açıyı gerçekten ikiye böler. Etiketler köşelerden dışarıya, kenarlardan şeklin
dışına yerleştirilir. Şekiller beyaz zeminli kart içinde çizilir; koyu temada da okunur.

    python3 scripts/build_geo_figures.py           -> notlar/geometri-*-not.js içindeki <svg>'leri yeniler
    python3 scripts/build_geo_figures.py --check   -> güncel değilse hata verir
    python3 scripts/build_geo_figures.py --sheet out.html  -> tüm şekilleri tek sayfada önizler
"""
import math
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

INK = "#0f172a"
FILL = "#e0f2fe"
FILL2 = "#fef3c7"
RED = "#dc2626"
BLUE = "#0369a1"
GREEN = "#047857"
PURPLE = "#7c3aed"
GRAY = "#64748b"
FONT = "ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif"


def f(x):
    s = ("%.1f" % x).rstrip("0").rstrip(".")
    return "0" if s in ("-0", "") else s


def add(p, q):
    return (p[0] + q[0], p[1] + q[1])


def sub(p, q):
    return (p[0] - q[0], p[1] - q[1])


def mul(p, k):
    return (p[0] * k, p[1] * k)


def length(v):
    return math.hypot(v[0], v[1])


def unit(v):
    d = length(v) or 1.0
    return (v[0] / d, v[1] / d)


def lerp(p, q, t):
    return (p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t)


def mid(p, q):
    return lerp(p, q, 0.5)


def perp(v):
    return (-v[1], v[0])


def centroid(pts):
    return (sum(p[0] for p in pts) / len(pts), sum(p[1] for p in pts) / len(pts))


def dist(p, q):
    return length(sub(p, q))


def foot(p, a, b):
    """p'nin [ab] doğrusu üzerindeki dik izdüşümü."""
    ab = sub(b, a)
    t = ((p[0] - a[0]) * ab[0] + (p[1] - a[1]) * ab[1]) / (ab[0] ** 2 + ab[1] ** 2)
    return lerp(a, b, t)


def ang(v):
    return math.atan2(v[1], v[0])


class Fig:
    def __init__(self, w, h, title):
        self.w = w
        self.h = h
        self.title = title
        self.items = []

    # ---------- temel çizimler ----------
    def raw(self, s):
        self.items.append(s)

    def poly(self, pts, fill=FILL, stroke=INK, sw=2, dash=None, close=True):
        d = ' stroke-dasharray="%s"' % dash if dash else ""
        tag = "polygon" if close else "polyline"
        self.raw('<%s points="%s" fill="%s" stroke="%s" stroke-width="%s" stroke-linejoin="round"%s/>' % (
            tag, " ".join(f(p[0]) + "," + f(p[1]) for p in pts), fill if close else "none", stroke, sw, d))

    def line(self, p, q, stroke=INK, sw=2, dash=None, cap="round"):
        d = ' stroke-dasharray="%s"' % dash if dash else ""
        self.raw('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="%s" stroke-linecap="%s"%s/>' % (
            f(p[0]), f(p[1]), f(q[0]), f(q[1]), stroke, sw, cap, d))

    def circle(self, c, r, fill="none", stroke=INK, sw=2, dash=None):
        d = ' stroke-dasharray="%s"' % dash if dash else ""
        self.raw('<circle cx="%s" cy="%s" r="%s" fill="%s" stroke="%s" stroke-width="%s"%s/>' % (
            f(c[0]), f(c[1]), f(r), fill, stroke, sw, d))

    def ellipse(self, c, rx, ry, fill="none", stroke=INK, sw=2, dash=None):
        d = ' stroke-dasharray="%s"' % dash if dash else ""
        self.raw('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="%s" stroke="%s" stroke-width="%s"%s/>' % (
            f(c[0]), f(c[1]), f(rx), f(ry), fill, stroke, sw, d))

    def path(self, d, fill="none", stroke=INK, sw=2, dash=None):
        dd = ' stroke-dasharray="%s"' % dash if dash else ""
        self.raw('<path d="%s" fill="%s" stroke="%s" stroke-width="%s" stroke-linejoin="round" stroke-linecap="round"%s/>' % (
            d, fill, stroke, sw, dd))

    def dot(self, p, r=3, color=INK):
        self.raw('<circle cx="%s" cy="%s" r="%s" fill="%s"/>' % (f(p[0]), f(p[1]), r, color))

    def text(self, p, s, color=INK, size=13, anchor="middle", weight=700, italic=False):
        st = ' font-style="italic"' if italic else ""
        # dikey ortalama: yazı tabanını yaklaşık yarım yükseklik aşağı al
        self.raw('<text x="%s" y="%s" text-anchor="%s" font-size="%s" font-family="%s" font-weight="%s" fill="%s"%s>%s</text>' % (
            f(p[0]), f(p[1] + size * 0.36), anchor, size, FONT, weight, color, st, s))

    # ---------- geometri işaretleri ----------
    def vlabel(self, p, s, center, gap=14, color=INK, size=14):
        """Köşe etiketi: şeklin merkezinden dışarı doğru."""
        u = unit(sub(p, center))
        self.text(add(p, mul(u, gap)), s, color=color, size=size)

    def slabel(self, p, q, s, center, gap=13, color=BLUE, size=13):
        """Kenar etiketi: kenarın ortasından şeklin dışına."""
        m = mid(p, q)
        n = unit(perp(sub(q, p)))
        if (m[0] + n[0] - center[0]) ** 2 + (m[1] + n[1] - center[1]) ** 2 < (m[0] - center[0]) ** 2 + (m[1] - center[1]) ** 2:
            n = mul(n, -1)
        self.text(add(m, mul(n, gap)), s, color=color, size=size)

    def arc(self, v, p, q, r, color=RED, sw=1.8, label=None, lr=None, size=13, lcolor=None):
        """v köşesinde [vp ile [vq arasındaki (180°'den küçük) açının yayı."""
        a1 = ang(sub(p, v))
        a2 = ang(sub(q, v))
        d = (a2 - a1) % (2 * math.pi)
        sweep = 1
        if d > math.pi:
            d = 2 * math.pi - d
            sweep = 0
        s = add(v, (r * math.cos(a1), r * math.sin(a1)))
        e = add(v, (r * math.cos(a2), r * math.sin(a2)))
        self.path("M %s %s A %s %s 0 0 %d %s %s" % (f(s[0]), f(s[1]), f(r), f(r), sweep, f(e[0]), f(e[1])), stroke=color, sw=sw)
        if label:
            am = a1 + (d / 2 if sweep == 1 else -d / 2)
            rr = lr if lr else r + 11
            self.text(add(v, (rr * math.cos(am), rr * math.sin(am))), label, color=lcolor or color, size=size)

    def right(self, v, p, q, s=11, color=INK):
        """v köşesinde dik açı işareti (p ve q yönlerine)."""
        u1 = mul(unit(sub(p, v)), s)
        u2 = mul(unit(sub(q, v)), s)
        a = add(v, u1)
        b = add(add(v, u1), u2)
        c = add(v, u2)
        self.path("M %s %s L %s %s L %s %s" % (f(a[0]), f(a[1]), f(b[0]), f(b[1]), f(c[0]), f(c[1])), stroke=color, sw=1.6)

    def ticks(self, p, q, n=1, color=INK, size=6, gap=4):
        """Eşit kenar işareti: kenarın ortasında n kısa çizgi."""
        m = mid(p, q)
        u = unit(sub(q, p))
        nn = unit(perp(u))
        for i in range(n):
            o = (i - (n - 1) / 2.0) * gap
            c = add(m, mul(u, o))
            self.line(add(c, mul(nn, size)), sub(c, mul(nn, size)), stroke=color, sw=1.6)

    def caption(self, s, y=None, color="#334155", size=13):
        s = re.sub(r" {3,}", ",  ", s)
        self.text((self.w / 2, y if y is not None else self.h - 14), s, color=color, size=size)

    def svg(self):
        body = "\n        ".join(self.items)
        return ('<svg viewBox="0 0 %d %d" class="geo-fig w-full max-w-[380px] mx-auto my-3" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="%s">\n'
                '        <rect x="1" y="1" width="%d" height="%d" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>\n'
                '        %s\n    </svg>') % (self.w, self.h, self.title, self.w - 2, self.h - 2, body)


# ============================================================
# 1. Üçgende açılar
# ============================================================

def g1_dis_aci():
    F = Fig(320, 214, "Dış açı teoremi: α = x + y")
    A, B, C = (130, 34), (40, 160), (222, 160)
    G = centroid([A, B, C])
    E = (300, 160)
    F.poly([A, B, C])
    F.line(C, E, stroke=RED)
    F.arc(B, C, A, 26, color=BLUE, label="x", lr=40)
    F.arc(A, B, C, 24, color=BLUE, label="y", lr=38)
    F.arc(C, E, A, 22, color=RED, label="α", lr=36)
    F.vlabel(A, "A", G)
    F.vlabel(B, "B", G)
    F.text((C[0] - 4, C[1] + 18), "C")
    F.caption("α = x + y", y=200, color=RED)
    return F


def g1_bumerang():
    F = Fig(320, 238, "Bumerang kuralı: α = x + y + z")
    A, D, C, B = (48, 40), (160, 104), (272, 40), (160, 196)
    F.poly([A, B, C, D], fill=FILL2)
    F.arc(A, B, D, 30, color=BLUE, label="x", lr=44)
    F.arc(C, D, B, 30, color=BLUE, label="y", lr=44)
    F.arc(B, A, C, 26, color=BLUE, label="z", lr=40)
    # göbek açısı: içbükey köşedeki, şeklin dışında kalan açı
    F.arc(D, A, C, 22, color=RED, label="α", lr=36)
    F.caption("α = x + y + z", y=224, color=RED)
    return F


def g1_yildiz():
    F = Fig(320, 250, "Beş köşeli yıldızda uç açılar toplamı 180°")
    c, R = (160, 118), 92
    tips = [add(c, (R * math.cos(math.radians(-90 + 72 * i)), R * math.sin(math.radians(-90 + 72 * i)))) for i in range(5)]
    order = [tips[(2 * i) % 5] for i in range(5)]
    # yıldızın iç köşeleri (iki komşu ucun kollarının kesişimi)
    r_in = R * math.cos(math.radians(72)) / math.cos(math.radians(36))
    inner = [add(c, (r_in * math.cos(math.radians(-90 + 36 + 72 * i)), r_in * math.sin(math.radians(-90 + 36 + 72 * i)))) for i in range(5)]
    outline = []
    for i in range(5):
        outline.append(tips[i])
        outline.append(inner[i])
    F.poly(outline)
    names = ["a", "b", "c", "d", "e"]
    for i in range(5):
        F.arc(tips[i], inner[i], inner[(i - 1) % 5], 18, color=RED)
        F.vlabel(tips[i], names[i], c, gap=14, color=RED, size=14)
    F.caption("a + b + c + d + e = 180°", y=236, color=RED)
    return F


def g1_yukseklik_aciortay():
    F = Fig(320, 226, "Yükseklik ile açıortay arasındaki açı")
    B, C = (34, 166), (290, 166)
    A = (86, 32)
    G = centroid([A, B, C])
    H = (A[0], B[1])
    b, c = dist(A, C), dist(A, B)
    D = lerp(B, C, c / (b + c))  # açıortay ayağı: |BD|/|DC| = c/b
    F.poly([A, B, C])
    F.line(A, H, stroke=GREEN, dash="5 4")
    F.right(H, A, C, s=10, color=GREEN)
    F.line(A, D, stroke=PURPLE)
    F.arc(A, H, D, 40, color=RED, label="x", lr=56)
    F.arc(B, C, A, 22, color=BLUE, label="B", lr=34, size=12)
    F.arc(C, B, A, 26, color=BLUE, label="C", lr=40, size=12)
    F.dot(H)
    F.dot(D)
    F.vlabel(A, "A", G)
    F.vlabel(B, "B", G)
    F.vlabel(C, "C", G)
    F.text((H[0], H[1] + 16), "H")
    F.text((D[0], D[1] + 16), "D")
    F.caption("x = |m(∠B) − m(∠C)| / 2", y=212, color=RED)
    return F


def g1_muhtesem_uclu():
    F = Fig(320, 214, "Muhteşem üçlü")
    A, B, C = (52, 166), (52, 40), (262, 166)
    G = centroid([A, B, C])
    D = mid(B, C)
    F.poly([A, B, C])
    F.right(A, B, C)
    F.line(A, D, stroke=PURPLE)
    F.dot(D)
    F.ticks(B, D, 1)
    F.ticks(D, C, 1)
    F.ticks(A, D, 1, color=PURPLE)
    F.vlabel(A, "A", G)
    F.vlabel(B, "B", G)
    F.vlabel(C, "C", G)
    F.text(add(D, (10, -12)), "D")
    F.caption("|AD| = |BD| = |DC| = |BC| / 2", y=198, color=PURPLE)
    return F


def g1_yaki():
    F = Fig(320, 214, "İkizkenar üçgende tepeden inen yükseklik")
    A, B, C = (160, 30), (64, 168), (256, 168)
    G = centroid([A, B, C])
    H = mid(B, C)
    F.poly([A, B, C])
    F.line(A, H, stroke=GREEN)
    F.right(H, A, C, s=10)
    F.arc(A, B, H, 28, color=PURPLE)
    F.arc(A, H, C, 33, color=PURPLE)
    F.arc(B, C, A, 22, color=BLUE)
    F.arc(C, A, B, 22, color=BLUE)
    F.ticks(A, B, 1)
    F.ticks(A, C, 1)
    F.ticks(B, H, 2)
    F.ticks(H, C, 2)
    F.dot(H)
    F.vlabel(A, "A", G)
    F.vlabel(B, "B", G)
    F.vlabel(C, "C", G)
    F.text((H[0], H[1] + 16), "H")
    F.caption("[AH]: yükseklik = açıortay = kenarortay", y=200, color=GREEN, size=12)
    return F


# ============================================================
# 2. Dik üçgen
# ============================================================

def g2_pisagor():
    F = Fig(320, 212, "Pisagor bağıntısı")
    A, B, C = (64, 158), (64, 40), (264, 158)
    G = centroid([A, B, C])
    F.poly([A, B, C])
    F.right(A, B, C)
    F.vlabel(A, "A", G)
    F.vlabel(B, "B", G)
    F.vlabel(C, "C", G)
    F.slabel(B, C, "a", G, color=RED)
    F.slabel(A, C, "b", G)
    F.slabel(A, B, "c", G)
    F.caption("a² = b² + c²", y=198, color=RED)
    return F


def g2_30_60_90():
    F = Fig(320, 200, "30°-60°-90° üçgeni")
    x = 90.0
    B = (60, 156)
    A = (B[0], B[1] - x)
    C = (B[0] + x * math.sqrt(3), B[1])
    G = centroid([A, B, C])
    F.poly([A, B, C])
    F.right(B, A, C)
    F.arc(C, A, B, 30, color=RED, label="30°", lr=52, size=12)
    F.arc(A, B, C, 18, color=RED, label="60°", lr=32, size=12)
    F.vlabel(A, "A", G)
    F.vlabel(B, "B", G)
    F.vlabel(C, "C", G)
    F.slabel(A, B, "x", G)
    F.slabel(B, C, "x√3", G, gap=15)
    F.slabel(A, C, "2x", G, color=RED)
    return F


def g2_oklid():
    F = Fig(320, 214, "Öklid bağıntıları")
    A = (70, 170)
    B = (70, 48)
    C = (70 + 122 * 1.75, 170)
    G = centroid([A, B, C])
    H = foot(A, B, C)
    F.poly([A, B, C])
    F.line(A, H, stroke=GREEN)
    F.right(A, B, C)
    F.right(H, A, C, s=9, color=GREEN)
    F.dot(H)
    F.vlabel(A, "A", G)
    F.vlabel(B, "B", G)
    F.vlabel(C, "C", G)
    F.text(add(H, mul(unit(perp(sub(C, B))), -14)), "H")
    F.slabel(A, B, "c", G)
    F.slabel(A, C, "b", G)
    F.text(add(mid(A, H), (10, 6)), "h", color=GREEN)
    # hipotenüs parçaları dışarıda
    n = unit(perp(sub(C, B)))
    if n[1] > 0:
        n = mul(n, -1)
    F.text(add(mid(B, H), mul(n, 13)), "p", color=RED)
    F.text(add(mid(H, C), mul(n, 13)), "k", color=RED)
    F.caption("h² = p·k   b² = k·a   c² = p·a", y=200, color="#334155", size=12)
    return F


# ============================================================
# 3. İkizkenar ve eşkenar üçgen
# ============================================================

def g3_ikizkenar():
    F = Fig(320, 200, "İkizkenar üçgen")
    A, B, C = (160, 30), (72, 160), (248, 160)
    G = centroid([A, B, C])
    H = mid(B, C)
    F.poly([A, B, C])
    F.line(A, H, stroke=GREEN)
    F.right(H, A, C, s=10, color=GREEN)
    F.arc(B, C, A, 24, color=RED, label="α", lr=38)
    F.arc(C, A, B, 24, color=RED, label="α", lr=38)
    F.ticks(A, B, 1)
    F.ticks(A, C, 1)
    F.dot(H)
    F.text(add(mid(A, H), (10, 0)), "h", color=GREEN)
    F.vlabel(A, "A", G)
    F.vlabel(B, "B", G)
    F.vlabel(C, "C", G)
    F.text((H[0], H[1] + 16), "H")
    return F


def g3_stewart():
    F = Fig(320, 214, "İkizkenar üçgende tabana çizilen doğru parçası")
    A, B, C = (160, 30), (64, 158), (256, 158)
    G = centroid([A, B, C])
    D = lerp(B, C, 0.7)
    F.poly([A, B, C])
    F.line(A, D, stroke=PURPLE)
    F.dot(D)
    F.ticks(A, B, 1)
    F.ticks(A, C, 1)
    F.vlabel(A, "A", G)
    F.vlabel(B, "B", G)
    F.vlabel(C, "C", G)
    F.text((D[0], D[1] + 16), "D")
    F.slabel(A, B, "b", G, gap=15)
    F.slabel(A, C, "b", G, gap=15)
    F.text(add(mid(A, D), (11, 0)), "x", color=PURPLE)
    F.text((mid(B, D)[0], B[1] + 16), "m", color=BLUE)
    F.text((mid(D, C)[0], B[1] + 16), "n", color=BLUE)
    F.caption("x² = b² − m·n", y=200, color=PURPLE)
    return F


def g3_eskenar():
    F = Fig(320, 228, "Eşkenar üçgen")
    a = 170.0
    B = (75, 180)
    C = (B[0] + a, B[1])
    A = (B[0] + a / 2, B[1] - a * math.sqrt(3) / 2)
    G = centroid([A, B, C])
    H = mid(B, C)
    F.poly([A, B, C])
    F.line(A, H, stroke=GREEN, dash="5 4")
    F.right(H, A, C, s=9, color=GREEN)
    for v, p, q in ((A, B, C), (B, C, A), (C, A, B)):
        F.arc(v, p, q, 20, color=RED)
    F.text(add(A, (17, 30)), "60°", color=RED, size=11)
    F.text(add(B, (32, -10)), "60°", color=RED, size=11)
    F.text(add(C, (-32, -10)), "60°", color=RED, size=11)
    F.ticks(A, B, 1)
    F.ticks(A, C, 1)
    F.ticks(B, C, 1)
    F.slabel(A, B, "a", G, gap=15)
    F.slabel(A, C, "a", G, gap=15)
    F.text(add(mid(A, H), (10, 8)), "h", color=GREEN)
    F.vlabel(A, "A", G)
    F.vlabel(B, "B", G)
    F.vlabel(C, "C", G)
    F.caption("h = a√3 / 2     A = a²√3 / 4", y=214, color="#334155", size=12)
    return F


# ============================================================
# 4. Açıortay ve kenarortay
# ============================================================

def g4_aciortay():
    F = Fig(320, 220, "İç açıortay teoremi")
    A, B, C = (120, 30), (36, 160), (290, 160)
    G = centroid([A, B, C])
    b, c = dist(A, C), dist(A, B)
    D = lerp(B, C, c / (b + c))
    F.poly([A, B, C])
    F.line(A, D, stroke=PURPLE)
    F.dot(D)
    F.arc(A, B, D, 26, color=RED)
    F.arc(A, D, C, 31, color=RED)
    F.vlabel(A, "A", G)
    F.vlabel(B, "B", G)
    F.vlabel(C, "C", G)
    F.text((D[0], D[1] + 16), "D")
    F.slabel(A, B, "c", G)
    F.slabel(A, C, "b", G)
    F.text(add(mid(A, D), (10, 2)), "x", color=PURPLE)
    F.text((mid(B, D)[0], B[1] + 16), "m", color=BLUE)
    F.text((mid(D, C)[0], B[1] + 16), "n", color=BLUE)
    F.caption("c/m = b/n     x² = b·c − m·n", y=206, color=PURPLE, size=12)
    return F


def g4_kenarortay():
    F = Fig(320, 220, "Kenarortay ve ağırlık merkezi")
    A, B, C = (126, 30), (40, 160), (282, 160)
    G0 = centroid([A, B, C])
    D = mid(B, C)
    E = mid(A, C)
    K = mid(A, B)
    F.poly([A, B, C])
    F.line(B, E, stroke=GRAY, sw=1.4, dash="4 4")
    F.line(C, K, stroke=GRAY, sw=1.4, dash="4 4")
    F.line(A, D, stroke=GREEN)
    F.dot(D)
    F.dot(G0, color=RED)
    F.ticks(B, D, 1)
    F.ticks(D, C, 1)
    F.vlabel(A, "A", G0)
    F.vlabel(B, "B", G0)
    F.vlabel(C, "C", G0)
    F.text((D[0], D[1] + 16), "D")
    F.text(add(G0, (12, -6)), "G", color=RED)
    F.text(add(lerp(A, D, 0.32), (-14, 0)), "Vₐ", color=GREEN)
    F.text((mid(B, D)[0], B[1] + 16), "a/2", color=BLUE, size=12)
    F.text((mid(D, C)[0], B[1] + 16), "a/2", color=BLUE, size=12)
    F.caption("|AG| : |GD| = 2 : 1", y=206, color=RED, size=12)
    return F


# ============================================================
# 5. Alan
# ============================================================

def g5_alan():
    F = Fig(320, 210, "Üçgende alan: taban × yükseklik / 2")
    A, B, C = (120, 30), (40, 156), (280, 156)
    G = centroid([A, B, C])
    H = (A[0], B[1])
    F.poly([A, B, C])
    F.line(A, H, stroke=GREEN, dash="5 4")
    F.right(H, A, C, s=10, color=GREEN)
    F.dot(H)
    F.vlabel(A, "A", G)
    F.vlabel(B, "B", G)
    F.vlabel(C, "C", G)
    F.text(add(mid(A, H), (12, 0)), "hₐ", color=GREEN)
    F.text((mid(H, C)[0], B[1] + 16), "a", color=BLUE)
    F.caption("A = a · hₐ / 2", y=198, color=GREEN)
    return F


def g5_cember():
    F = Fig(320, 228, "İç teğet ve çevrel çember")
    O0, R0 = (160, 112), 86
    A, B, C = on_circle(O0, R0, -104), on_circle(O0, R0, 152), on_circle(O0, R0, 28)
    G = centroid([A, B, C])
    a, b, c = dist(B, C), dist(A, C), dist(A, B)
    I = ((a * A[0] + b * B[0] + c * C[0]) / (a + b + c), (a * A[1] + b * B[1] + c * C[1]) / (a + b + c))
    s = (a + b + c) / 2
    area = abs((B[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (B[1] - A[1])) / 2
    r = area / s
    # çevrel çember merkezi
    d = 2 * (A[0] * (B[1] - C[1]) + B[0] * (C[1] - A[1]) + C[0] * (A[1] - B[1]))
    ux = ((A[0] ** 2 + A[1] ** 2) * (B[1] - C[1]) + (B[0] ** 2 + B[1] ** 2) * (C[1] - A[1]) + (C[0] ** 2 + C[1] ** 2) * (A[1] - B[1])) / d
    uy = ((A[0] ** 2 + A[1] ** 2) * (C[0] - B[0]) + (B[0] ** 2 + B[1] ** 2) * (A[0] - C[0]) + (C[0] ** 2 + C[1] ** 2) * (B[0] - A[0])) / d
    O = (ux, uy)
    R = dist(O, A)
    F.circle(O, R, stroke=GRAY, sw=1.5, dash="5 4")
    F.poly([A, B, C])
    F.circle(I, r, stroke=RED, sw=1.8)
    T = foot(I, B, C)
    F.line(I, T, stroke=RED, sw=1.6)
    F.dot(I, color=RED)
    F.text(add(mid(I, T), (8, 0)), "r", color=RED)
    F.line(O, C, stroke=GRAY, sw=1.5)
    F.dot(O, color=GRAY)
    F.text(add(mid(O, C), (2, -10)), "R", color=GRAY)
    F.vlabel(A, "A", G, gap=12)
    F.vlabel(B, "B", G, gap=12)
    F.vlabel(C, "C", G, gap=12)
    F.caption("A = u · r     A = a·b·c / (4R)", y=214, color="#334155", size=12)
    return F


# ============================================================
# 6. Benzerlik, Thales
# ============================================================

def g6_benzerlik():
    F = Fig(320, 196, "Benzer üçgenler")
    k = 1.5
    A, B, C = (74, 92), (34, 150), (114, 150)
    D0 = (166, 150)
    base = [sub(A, B), (0, 0), sub(C, B)]
    D = add(D0, mul(base[0], k))
    E = D0
    Fp = add(D0, mul(base[2], k))
    G1, G2 = centroid([A, B, C]), centroid([D, E, Fp])
    F.poly([A, B, C])
    F.poly([D, E, Fp], fill=FILL2)
    F.arc(A, B, C, 14, color=RED)
    F.arc(D, E, Fp, 14 * 1.2, color=RED)
    F.arc(B, C, A, 16, color=BLUE)
    F.arc(E, Fp, D, 16 * 1.2, color=BLUE)
    F.arc(C, A, B, 14, color=GREEN)
    F.arc(Fp, D, E, 14 * 1.2, color=GREEN)
    for p, s, g in ((A, "A", G1), (B, "B", G1), (C, "C", G1), (D, "D", G2), (E, "E", G2), (Fp, "F", G2)):
        F.vlabel(p, s, g, gap=13)
    F.caption("Benzerlik oranı k: çevre oranı k, alan oranı k²", y=182, color="#334155", size=12)
    return F


def g6_thales():
    F = Fig(320, 200, "Thales teoremi")
    ys = [40, 96, 166]
    for y in ys:
        F.line((24, y), (296, y), stroke=INK, sw=1.8)
    # iki kesen
    P1 = [(60, ys[0]), None, (118, ys[2])]
    P2 = [(250, ys[0]), None, (178, ys[2])]
    t = (ys[1] - ys[0]) / float(ys[2] - ys[0])
    P1[1] = lerp(P1[0], P1[2], t)
    P2[1] = lerp(P2[0], P2[2], t)
    F.line(add(P1[0], mul(unit(sub(P1[0], P1[2])), 18)), add(P1[2], mul(unit(sub(P1[2], P1[0])), 18)), stroke=PURPLE)
    F.line(add(P2[0], mul(unit(sub(P2[0], P2[2])), 18)), add(P2[2], mul(unit(sub(P2[2], P2[0])), 18)), stroke=PURPLE)
    for p in P1 + P2:
        F.dot(p)
    F.text(add(mid(P1[0], P1[1]), (-14, 0)), "a", color=BLUE)
    F.text(add(mid(P1[1], P1[2]), (-14, 0)), "b", color=BLUE)
    F.text(add(mid(P2[0], P2[1]), (14, 0)), "c", color=RED)
    F.text(add(mid(P2[1], P2[2]), (14, 0)), "d", color=RED)
    F.text((300, ys[0] - 10), "d₁", color=GRAY, size=11, anchor="end")
    F.text((300, ys[1] - 10), "d₂", color=GRAY, size=11, anchor="end")
    F.text((300, ys[2] - 10), "d₃", color=GRAY, size=11, anchor="end")
    F.caption("d₁ ∥ d₂ ∥ d₃  ⇒  a/b = c/d", y=188, color="#334155", size=12)
    return F


# ============================================================
# 7. Analitik geometri
# ============================================================

def axes(F, O, x0, x1, y0, y1):
    F.line((x0, O[1]), (x1, O[1]), stroke=GRAY, sw=1.6)
    F.line((O[0], y1), (O[0], y0), stroke=GRAY, sw=1.6)
    F.path("M %s %s L %s %s L %s %s" % (f(x1 - 8), f(O[1] - 5), f(x1), f(O[1]), f(x1 - 8), f(O[1] + 5)), stroke=GRAY, sw=1.6)
    F.path("M %s %s L %s %s L %s %s" % (f(O[0] - 5), f(y0 + 8), f(O[0]), f(y0), f(O[0] + 5), f(y0 + 8)), stroke=GRAY, sw=1.6)
    F.text((x1 - 4, O[1] + 14), "x", color=GRAY, size=12)
    F.text((O[0] + 12, y0 + 4), "y", color=GRAY, size=12)


def g7_bolgeler():
    F = Fig(320, 200, "Koordinat düzleminde bölgeler")
    O = (160, 100)
    axes(F, O, 24, 296, 16, 184)
    F.text((O[0] - 10, O[1] + 13), "O", color=GRAY, size=12)
    F.text((232, 56), "I. bölge (+, +)", color=BLUE, size=12)
    F.text((88, 56), "II. bölge (−, +)", color=BLUE, size=12)
    F.text((88, 148), "III. bölge (−, −)", color=BLUE, size=12)
    F.text((232, 148), "IV. bölge (+, −)", color=BLUE, size=12)
    return F


def g7_uzaklik():
    F = Fig(320, 206, "İki nokta arası uzaklık ve orta nokta")
    O = (40, 176)
    axes(F, O, 22, 300, 16, 190)
    A, B = (100, 144), (236, 64)
    K = (B[0], A[1])
    F.line(A, K, stroke=GRAY, sw=1.5, dash="5 4")
    F.line(K, B, stroke=GRAY, sw=1.5, dash="5 4")
    F.right(K, A, B, s=9, color=GRAY)
    F.line(A, B, stroke=INK, sw=2.2)
    M = mid(A, B)
    F.dot(A)
    F.dot(B)
    F.dot(M, color=RED)
    F.text(add(A, (-14, 16)), "A(x₁, y₁)", size=12)
    F.text(add(B, (-40, -6)), "B(x₂, y₂)", size=12)
    F.text(add(M, (-10, -14)), "M", color=RED, size=12)
    F.text((mid(A, K)[0], A[1] + 15), "|x₂ − x₁|", color=BLUE, size=12)
    F.text((K[0] + 4, mid(K, B)[1]), "|y₂ − y₁|", color=BLUE, size=12, anchor="start")
    return F


def g7_egim():
    F = Fig(320, 206, "Eğim: m = tan α")
    O = (70, 168)
    axes(F, O, 20, 300, 16, 190)
    # doğru x eksenini P'de keser
    P = (120, 168)
    alpha = math.radians(34)
    u = (math.cos(alpha), -math.sin(alpha))
    Q1 = add(P, mul(u, -50))
    Q2 = add(P, mul(u, 200))
    F.line(Q1, Q2, stroke=PURPLE, sw=2.2)
    F.arc(P, (300, 168), Q2, 30, color=RED, label="α", lr=44)
    A = add(P, mul(u, 70))
    B = add(P, mul(u, 145))
    K = (B[0], A[1])
    F.line(A, K, stroke=GRAY, sw=1.5, dash="5 4")
    F.line(K, B, stroke=GRAY, sw=1.5, dash="5 4")
    F.right(K, A, B, s=8, color=GRAY)
    F.dot(A)
    F.dot(B)
    F.text((mid(A, K)[0], A[1] + 15), "x₂ − x₁", color=BLUE, size=12)
    F.text((K[0] + 6, mid(K, B)[1]), "y₂ − y₁", color=BLUE, size=12, anchor="start")
    F.text((96, 34), "m = (y₂ − y₁)/(x₂ − x₁)", color="#334155", size=12, anchor="start")
    return F


# ============================================================
# 8-10. Dörtgenler, çokgenler
# ============================================================

def g8_dortgen():
    F = Fig(320, 236, "Köşegenleri dik dörtgen")
    X = (150, 108)
    A = (X[0] - 104, X[1])
    C = (X[0] + 128, X[1])
    B = (X[0], X[1] - 76)
    D = (X[0], X[1] + 88)
    G = X
    F.poly([A, B, C, D])
    F.line(A, C, stroke=PURPLE, dash="5 4")
    F.line(B, D, stroke=PURPLE, dash="5 4")
    F.right(X, C, B, s=9, color=PURPLE)
    for p, s in ((A, "A"), (B, "B"), (C, "C"), (D, "D")):
        F.vlabel(p, s, G, gap=13)
    F.slabel(A, B, "a", G)
    F.slabel(B, C, "b", G)
    F.slabel(C, D, "c", G)
    F.slabel(D, A, "d", G)
    F.text(add(mid(X, C), (0, -10)), "e", color=PURPLE)
    F.text(add(mid(X, D), (10, 0)), "f", color=PURPLE)
    F.caption("a² + c² = b² + d²     A = e·f / 2", y=224, color="#334155", size=12)
    return F


def g8_yamuk():
    F = Fig(320, 214, "Yamukta orta taban")
    A, B = (40, 166), (280, 166)
    D, C = (102, 54), (210, 54)
    G = centroid([A, B, C, D])
    E, Fm = mid(A, D), mid(B, C)
    F.poly([A, B, C, D])
    F.line(E, Fm, stroke=RED, sw=2, dash="6 4")
    F.dot(E, color=RED)
    F.dot(Fm, color=RED)
    H = (D[0], A[1])
    F.line(D, H, stroke=GREEN, dash="4 4")
    F.right(H, D, B, s=9, color=GREEN)
    F.ticks(A, E, 1)
    F.ticks(E, D, 1)
    F.ticks(B, Fm, 2)
    F.ticks(Fm, C, 2)
    for p, s in ((A, "A"), (B, "B"), (C, "C"), (D, "D")):
        F.vlabel(p, s, G, gap=13)
    F.text(add(E, (-12, -2)), "E", color=RED)
    F.text(add(Fm, (12, -2)), "F", color=RED)
    F.text((mid(A, B)[0], A[1] + 16), "a", color=BLUE)
    F.text((mid(D, C)[0], D[1] - 13), "c", color=BLUE)
    F.text((D[0] + 10, 136), "h", color=GREEN)
    F.caption("|EF| = (a + c)/2     A = (a + c)·h / 2", y=202, color=RED, size=12)
    return F


def g9_paralelkenar():
    F = Fig(320, 196, "Paralelkenar")
    A, B = (40, 148), (220, 148)
    D = (100, 48)
    C = add(B, sub(D, A))
    G = centroid([A, B, C, D])
    F.poly([A, B, C, D])
    F.line(A, C, stroke=PURPLE, sw=1.6, dash="5 4")
    F.line(B, D, stroke=PURPLE, sw=1.6, dash="5 4")
    H = (D[0], A[1])
    F.line(D, H, stroke=GREEN, sw=1.6)
    F.right(H, D, B, s=8, color=GREEN)
    F.arc(A, B, D, 22, color=RED, label="α", lr=34)
    for p, s in ((A, "A"), (B, "B"), (C, "C"), (D, "D")):
        F.vlabel(p, s, G, gap=13)
    F.text((mid(A, B)[0] + 30, A[1] + 16), "a", color=BLUE)
    F.slabel(A, D, "b", G)
    F.text((D[0] - 9, 110), "h", color=GREEN)
    F.text(add(lerp(A, C, 0.72), (0, -10)), "e", color=PURPLE)
    F.text(add(lerp(B, D, 0.28), (8, -6)), "f", color=PURPLE)
    F.caption("e² + f² = 2(a² + b²)     A = a·h", y=184, color="#334155", size=12)
    return F


def g9_eskenar_dortgen():
    F = Fig(320, 226, "Eşkenar dörtgen")
    X = (160, 100)
    A, C = (X[0] - 112, X[1]), (X[0] + 112, X[1])
    B, D = (X[0], X[1] - 72), (X[0], X[1] + 72)
    G = X
    F.poly([A, B, C, D], fill=FILL2)
    F.line(A, C, stroke=RED, sw=1.6)
    F.line(B, D, stroke=RED, sw=1.6)
    F.right(X, C, B, s=9, color=RED)
    for p, q in ((A, B), (B, C), (C, D), (D, A)):
        F.ticks(p, q, 1)
    for p, s in ((A, "A"), (B, "B"), (C, "C"), (D, "D")):
        F.vlabel(p, s, G, gap=13)
    F.slabel(A, B, "a", G, gap=14)
    F.text(add(mid(X, C), (0, -10)), "e", color=RED)
    F.text(add(mid(X, B), (10, 0)), "f", color=RED)
    F.caption("e² + f² = 4a²     A = e·f / 2", y=214, color="#334155", size=12)
    return F


def g9_deltoid():
    F = Fig(320, 244, "Deltoid")
    X = (160, 76)
    A, C = (X[0], X[1] - 52), (X[0], X[1] + 120)
    B, D = (X[0] - 82, X[1]), (X[0] + 82, X[1])
    G = centroid([A, B, C, D])
    F.poly([A, B, C, D])
    F.line(A, C, stroke=GREEN, sw=1.6, dash="5 4")
    F.line(B, D, stroke=GREEN, sw=1.6, dash="5 4")
    F.right(X, D, C, s=9, color=GREEN)
    F.ticks(A, B, 1)
    F.ticks(A, D, 1)
    F.ticks(C, B, 2)
    F.ticks(C, D, 2)
    for p, s in ((A, "A"), (B, "B"), (C, "C"), (D, "D")):
        F.vlabel(p, s, G, gap=13)
    F.text(add(mid(X, D), (0, -10)), "d₁", color=GREEN, size=12)
    F.text(add(mid(X, C), (12, 0)), "d₂", color=GREEN, size=12)
    F.caption("A = d₁·d₂ / 2", y=232, color="#334155", size=12)
    return F


def g10_altigen():
    F = Fig(320, 220, "Düzgün altıgen")
    c, a = (160, 104), 82.0
    P = [add(c, (a * math.cos(math.radians(60 * i)), a * math.sin(math.radians(60 * i)))) for i in range(6)]
    F.poly(P)
    for p in P:
        F.line(c, p, stroke=GRAY, sw=1.3, dash="4 4")
    F.dot(c, color=GRAY)
    for i in range(6):
        F.ticks(P[i], P[(i + 1) % 6], 1)
    F.slabel(P[1], P[2], "a", c, gap=14)
    F.text(add(mid(c, P[0]), (0, -9)), "a", color=GRAY, size=12)
    F.arc(P[3], P[4], P[2], 18, color=RED)
    F.text(add(P[3], (36, -18)), "120°", color=RED, size=11)
    F.caption("A = 6 · a²√3/4 = (3√3/2)·a²", y=208, color=RED, size=12)
    return F


# ============================================================
# 11. Çember
# ============================================================

def arc_path(c, r, a1, a2):
    """a1'den a2'ye (derece, saat yönü ekranda) yay."""
    s = add(c, (r * math.cos(math.radians(a1)), r * math.sin(math.radians(a1))))
    e = add(c, (r * math.cos(math.radians(a2)), r * math.sin(math.radians(a2))))
    large = 1 if (a2 - a1) % 360 > 180 else 0
    return "M %s %s A %s %s 0 %d 1 %s %s" % (f(s[0]), f(s[1]), f(r), f(r), large, f(e[0]), f(e[1]))


def on_circle(c, r, deg):
    return add(c, (r * math.cos(math.radians(deg)), r * math.sin(math.radians(deg))))


def g11_merkez():
    F = Fig(320, 214, "Merkez açı")
    c, r = (160, 104), 80
    A, B = on_circle(c, r, 200), on_circle(c, r, 340)
    F.circle(c, r, fill=FILL)
    F.path(arc_path(c, r, 200, 340), stroke=RED, sw=4)
    F.line(c, A)
    F.line(c, B)
    F.arc(c, A, B, 22, color=RED, label="α", lr=34)
    F.dot(c)
    F.dot(A)
    F.dot(B)
    F.text(add(c, (0, 16)), "O")
    F.vlabel(A, "A", c, gap=14)
    F.vlabel(B, "B", c, gap=14)
    F.caption("α = m(AB yayı)", y=202, color=RED)
    return F


def g11_cevre():
    F = Fig(320, 230, "Çevre açı")
    c, r = (160, 104), 80
    A, B, C = on_circle(c, r, 205), on_circle(c, r, 335), on_circle(c, r, 100)
    F.circle(c, r, fill=FILL)
    F.path(arc_path(c, r, 205, 335), stroke=RED, sw=4)
    F.line(C, A)
    F.line(C, B)
    F.arc(C, A, B, 24, color=PURPLE, label="α", lr=37)
    F.dot(A)
    F.dot(B)
    F.dot(C)
    F.dot(c, r=2.4, color=GRAY)
    F.vlabel(A, "A", c, gap=14)
    F.vlabel(B, "B", c, gap=14)
    F.vlabel(C, "C", c, gap=14)
    F.caption("α = m(AB yayı) / 2", y=216, color=PURPLE)
    return F


def g11_kuvvet():
    F = Fig(320, 214, "Noktanın çembere göre kuvveti")
    c, r = (206, 104), 70
    P = (36, 104)
    # iki kesen ve bir teğet
    def secant(deg):
        u = (math.cos(math.radians(deg)), math.sin(math.radians(deg)))
        w = sub(P, c)
        bq = 2 * (u[0] * w[0] + u[1] * w[1])
        cq = w[0] ** 2 + w[1] ** 2 - r * r
        disc = math.sqrt(bq * bq - 4 * cq)
        t1, t2 = (-bq - disc) / 2, (-bq + disc) / 2
        return add(P, mul(u, t1)), add(P, mul(u, t2))
    A, B = secant(-4)
    C, D = secant(18)
    d = dist(P, c)
    tl = math.sqrt(d * d - r * r)
    th = math.degrees(math.asin(r / d))
    T = add(P, mul((math.cos(math.radians(-th)), math.sin(math.radians(-th))), tl))
    F.circle(c, r, fill=FILL)
    F.line(P, add(B, mul(unit(sub(B, P)), 14)), stroke=INK, sw=1.8)
    F.line(P, add(D, mul(unit(sub(D, P)), 14)), stroke=INK, sw=1.8)
    F.line(P, T, stroke=GREEN, sw=1.8)
    F.right(T, P, c, s=8, color=GREEN)
    F.line(c, T, stroke=GRAY, sw=1.2, dash="4 3")
    for p in (P, A, B, C, D, T):
        F.dot(p)
    F.text(add(P, (-12, 0)), "P")
    F.text(add(A, (-9, 14)), "A", size=12)
    F.text(add(B, (10, -10)), "B", size=12)
    F.text(add(C, (-2, 14)), "C", size=12)
    F.text(add(D, (8, 12)), "D", size=12)
    F.text(add(T, (-4, -13)), "T", color=GREEN, size=12)
    F.caption("|PA|·|PB| = |PC|·|PD| = |PT|²", y=202, color="#334155", size=12)
    return F


# ============================================================
# 12. Katı cisimler
# ============================================================

def g12_prizma():
    F = Fig(320, 230, "Dikdörtgenler prizması")
    a, b, c = 150.0, 70.0, 96.0  # en, derinlik, yükseklik
    dx, dy = b * 0.7, -b * 0.5
    A = (52, 178)
    B = (A[0] + a, A[1])
    C = (B[0], B[1] - c)
    D = (A[0], A[1] - c)
    A2, B2, C2, D2 = [add(p, (dx, dy)) for p in (A, B, C, D)]
    # görünmeyen kenarlar
    F.line(A, A2, stroke=GRAY, sw=1.4, dash="5 4")
    F.line(A2, B2, stroke=GRAY, sw=1.4, dash="5 4")
    F.line(A2, D2, stroke=GRAY, sw=1.4, dash="5 4")
    F.poly([A, B, C, D])
    F.poly([D, C, C2, D2], fill="#bae6fd")
    F.poly([B, B2, C2, C], fill="#c7e9fb")
    F.line(A, C2, stroke=RED, sw=1.8, dash="6 4")
    F.text((mid(A, B)[0], A[1] + 16), "a", color=BLUE)
    F.text(add(mid(B, B2), (10, 6)), "b", color=BLUE)
    F.text((A[0] - 12, mid(A, D)[1]), "c", color=BLUE)
    F.caption("V = a·b·c     köşegen = √(a² + b² + c²)", y=216, color="#334155", size=12)
    return F


def g12_silindir_koni():
    F = Fig(320, 220, "Silindir ve koni")
    # silindir
    cx, r, ry, top, bot = 92, 50, 14, 46, 166
    F.path("M %s %s L %s %s A %s %s 0 0 0 %s %s L %s %s" % (
        f(cx - r), f(top), f(cx - r), f(bot), f(r), f(ry), f(cx + r), f(bot), f(cx + r), f(top)), fill=FILL)
    F.path("M %s %s A %s %s 0 0 1 %s %s" % (f(cx - r), f(bot), f(r), f(ry), f(cx + r), f(bot)), stroke=GRAY, sw=1.4, dash="4 4")
    F.ellipse((cx, top), r, ry, fill="#bae6fd")
    F.line((cx, top), (cx + r, top), stroke=RED, sw=1.6)
    F.dot((cx, top), r=2.4)
    F.text((cx + r / 2, top + 8), "r", color=RED, size=12)
    F.line((cx + r + 12, top), (cx + r + 12, bot), stroke=GREEN, sw=1.4)
    F.text((cx + r + 22, (top + bot) / 2), "h", color=GREEN, size=12)
    F.text((cx, 198), "V = πr²h", color="#334155", size=12)
    # koni
    kx, kr, kry, apex, kb = 232, 50, 14, 40, 166
    F.path("M %s %s L %s %s L %s %s A %s %s 0 0 1 %s %s Z" % (
        f(kx - kr), f(kb), f(kx), f(apex), f(kx + kr), f(kb), f(kr), f(kry), f(kx - kr), f(kb)), fill=FILL2)
    F.path("M %s %s A %s %s 0 0 1 %s %s" % (f(kx - kr), f(kb), f(kr), f(kry), f(kx + kr), f(kb)), stroke=GRAY, sw=1.4, dash="4 4")
    F.line((kx, apex), (kx, kb), stroke=GREEN, sw=1.4, dash="4 3")
    F.line((kx, kb), (kx + kr, kb), stroke=RED, sw=1.6)
    F.right((kx, kb), (kx, apex), (kx + kr, kb), s=7, color=GREEN)
    F.text((kx - 9, 112), "h", color=GREEN, size=12)
    F.text((kx + kr / 2, kb - 8), "r", color=RED, size=12)
    F.text((kx + 34, 96), "ℓ", color=PURPLE, size=13)
    F.text((kx, 198), "V = πr²h / 3", color="#334155", size=12)
    return F


def g12_kure():
    F = Fig(320, 214, "Küre ve düzgün dörtyüzlü")
    c, r = (92, 98), 60
    F.circle(c, r, fill=FILL)
    F.path("M %s %s A %s %s 0 0 0 %s %s" % (f(c[0] - r), f(c[1]), f(r), f(16), f(c[0] + r), f(c[1])), stroke=INK, sw=1.4)
    F.path("M %s %s A %s %s 0 0 1 %s %s" % (f(c[0] - r), f(c[1]), f(r), f(16), f(c[0] + r), f(c[1])), stroke=GRAY, sw=1.3, dash="4 4")
    F.line(c, (c[0] + r, c[1]), stroke=RED, sw=1.6)
    F.dot(c, r=2.6)
    F.text((c[0] + r / 2, c[1] - 9), "r", color=RED, size=12)
    F.text((c[0], 186), "A = 4πr²", color="#334155", size=12)
    F.text((c[0], 202), "V = (4/3)πr³", color="#334155", size=12)
    # düzgün dörtyüzlü (eğik izdüşüm)
    P = (232, 34)
    L, R, K = (182, 150), (284, 150), (246, 126)
    F.poly([L, R, P], fill=FILL2)
    F.line(L, K, stroke=GRAY, sw=1.4, dash="4 4")
    F.line(R, K, stroke=GRAY, sw=1.4, dash="4 4")
    F.line(P, K, stroke=GRAY, sw=1.4, dash="4 4")
    F.poly([L, R, P], fill="none")
    F.text((mid(L, R)[0], 166), "a", color=BLUE, size=12)
    F.text((232, 186), "V = a³√2 / 12", color="#334155", size=12)
    F.text((232, 202), "h = a√6 / 3", color="#334155", size=12)
    return F


FIGURES = {
    1: [g1_dis_aci, g1_bumerang, g1_yildiz, g1_yukseklik_aciortay, g1_muhtesem_uclu, g1_yaki],
    2: [g2_pisagor, g2_30_60_90, g2_oklid],
    3: [g3_ikizkenar, g3_stewart, g3_eskenar],
    4: [g4_aciortay, g4_kenarortay],
    5: [g5_alan, g5_cember],
    6: [g6_benzerlik, g6_thales],
    7: [g7_bolgeler, g7_uzaklik, g7_egim],
    8: [g8_dortgen, g8_yamuk],
    9: [g9_paralelkenar, g9_eskenar_dortgen, g9_deltoid],
    10: [g10_altigen],
    11: [g11_merkez, g11_cevre, g11_kuvvet],
    12: [g12_prizma, g12_silindir_koni, g12_kure],
}

SVG_RE = re.compile(r"<svg\b[\s\S]*?</svg>")


def render_file(i):
    p = os.path.join(ROOT, "notlar", "geometri-%d-not.js" % i)
    src = open(p, encoding="utf-8").read()
    figs = FIGURES[i]
    found = SVG_RE.findall(src)
    if len(found) != len(figs):
        raise SystemExit("%s: %d şekil bekleniyordu, %d bulundu" % (p, len(figs), len(found)))
    it = iter(figs)
    out = SVG_RE.sub(lambda _m: next(it)().svg(), src)
    return p, src, out


def main():
    args = sys.argv[1:]
    if "--sheet" in args:
        dst = args[args.index("--sheet") + 1]
        html = ['<!doctype html><meta charset="utf-8"><body style="font-family:sans-serif;background:#f1f5f9;margin:12px">']
        for i in sorted(FIGURES):
            for fn in FIGURES[i]:
                html.append('<div style="display:inline-block;width:400px;margin:6px;vertical-align:top"><b>%d · %s</b>%s</div>' % (i, fn.__name__, fn().svg()))
        open(dst, "w", encoding="utf-8").write("".join(html))
        print("önizleme:", dst)
        return
    stale = []
    for i in sorted(FIGURES):
        p, src, out = render_file(i)
        if src != out:
            stale.append(p)
            if "--check" not in args:
                open(p, "w", encoding="utf-8").write(out)
    if "--check" in args:
        if stale:
            raise SystemExit("güncel değil: " + ", ".join(os.path.relpath(s, ROOT) for s in stale))
        print("geometri şekilleri güncel.")
    else:
        print("%d dosya güncellendi." % len(stale))


if __name__ == "__main__":
    main()
