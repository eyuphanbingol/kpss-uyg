# -*- coding: utf-8 -*-
"""Öğretmenlik AGS + ÖABT not + soru üretici. python scripts/og_build.py"""
import json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ag_build import as_qs, write_topic

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def load_topics():
    from og_data import TOPICS
    return TOPICS

if __name__ == "__main__":
    TOPICS = load_topics()
    ders_bullets = {}
    for t in TOPICS:
        b = []
        for s in t["slides"]:
            b.extend(s[2])
        ders_bullets.setdefault(t["ders"], []).extend(b)
    manifest = {}
    for t in TOPICS:
        ders = t["ders"]
        prefix = t["prefix"]
        manifest.setdefault(ders, {"prefix": prefix, "konular": []})
        idx = len(manifest[ders]["konular"]) + 1
        bullets = []
        for s in t["slides"]:
            bullets.extend(s[2])
        qs = as_qs(t.get("facts") or [], bullets, t["title"], ders_bullets.get(ders) or [])
        write_topic(prefix, idx, t["title"], t["slides"], qs)
        manifest[ders]["konular"].append(t["title"])
        print(ders, idx, t["title"], "q", len(qs))
    manp = os.path.join(ROOT, "scripts", "og_manifest.json")
    with open(manp, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
    print("OK", len(TOPICS), "topics", manp)
