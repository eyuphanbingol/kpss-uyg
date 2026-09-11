# -*- coding: utf-8 -*-
"""B Grubu disindaki A / AGS / OABT katalog ve script etiketlerini kes."""
import os, re, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PREFIXES = (
    "hukuk", "iktisat", "maliye", "muhasebe", "isletme", "istatistik",
    "kamu", "ui", "ceko", "ags_", "oabt_",
)

def is_extra(name):
    base = os.path.basename(name)
    for p in PREFIXES:
        if base.startswith(p):
            return True
    return False

def strip_data():
    p = os.path.join(ROOT, "data.js")
    txt = open(p, encoding="utf-8").read()
    i = txt.find('        "Hukuk": {')
    j = txt.find("// Eski kodlar")
    if i < 0 or j < 0:
        raise SystemExit("data.js markers missing")
    head = txt[:i].rstrip().rstrip(",")
    new = head + "\n\n    };\n};\n\n" + txt[j:]
    open(p, "w", encoding="utf-8", newline="\n").write(new)
    print("data.js trimmed", i, "->", len(new))

def strip_index():
    p = os.path.join(ROOT, "index.html")
    lines = open(p, encoding="utf-8").read().splitlines(True)
    rx = re.compile(
        r'<script src="(?:notlar|sorular)/(?:hukuk|iktisat|maliye|muhasebe|isletme|istatistik|kamu|ui|ceko|ags_|oabt_)[^"]+"></script>'
    )
    kept, n = [], 0
    for ln in lines:
        if rx.search(ln):
            n += 1
            continue
        kept.append(ln)
    txt = "".join(kept)
    repls = [
        ("data.js?v=25", "data.js?v=26"),
        ("js/config.js?v=25", "js/config.js?v=26"),
        ("js/store.js?v=40", "js/store.js?v=41"),
        ("js/alan.js?v=4", "js/alan.js?v=5"),
        ("js/jsxLoader.js?v=82", "js/jsxLoader.js?v=83"),
        ("js/app.jsx?v=121", "js/app.jsx?v=122"),
    ]
    for a, b in repls:
        txt = txt.replace(a, b)
    open(p, "w", encoding="utf-8", newline="\n").write(txt)
    print("index.html dropped scripts", n)

def delete_files():
    n = 0
    for folder in ("notlar", "sorular"):
        for path in glob.glob(os.path.join(ROOT, folder, "*")):
            if is_extra(path) and os.path.isfile(path):
                os.remove(path)
                n += 1
    print("deleted content files", n)

if __name__ == "__main__":
    strip_data()
    strip_index()
    delete_files()
