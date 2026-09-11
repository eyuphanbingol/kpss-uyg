# -*- coding: utf-8 -*-
"""AGS + ÖABT soru dosyalarındaki 'yer alır/almaz' kalıbını gerçek çeldiricilerle doldur."""
import json, os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ag_build import fill20, write_questions
from og_data import TOPICS

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILLER_Q = re.compile(r"konusunda aşağıdakilerden hangisi yer alır|konusunda aşağıdakilerden hangisi yer almaz")
FILLER_E = (
    "Konu notunda açıkça yer alır.",
    "Bu ifade bu konunun kapsamı dışındadır.",
)

def is_filler(q):
    qq = q.get("question") or ""
    ee = q.get("explanation") or ""
    if FILLER_Q.search(qq):
        return True
    if ee in FILLER_E:
        return True
    if ee.endswith("notundaki temel bilgi."):
        return True
    if qq.startswith("Bu konuyla ilgili hangisi doğrudur?"):
        return True
    if " bakımından hangisi doğrudur?" in qq:
        return True
    return False

def load_qs(path):
    txt = open(path, encoding="utf-8").read()
    i = txt.find("[")
    j = txt.rfind("]")
    if i < 0 or j < i:
        raise ValueError("no array in %s" % path)
    return json.loads(txt[i:j + 1])

def to_fact(q):
    return {
        "question": q["question"],
        "options": q["options"],
        "i": q["correctAnswerIndex"],
        "explanation": q["explanation"],
    }

def main():
    manp = os.path.join(ROOT, "scripts", "og_manifest.json")
    man = json.load(open(manp, encoding="utf-8"))
    by = {(t["ders"], t["title"]): t for t in TOPICS}
    ders_bullets = {}
    for t in TOPICS:
        b = []
        for s in t["slides"]:
            b.extend(s[2])
        ders_bullets.setdefault(t["ders"], []).extend(b)

    dropped = 0
    files = 0
    short = []
    for ders, info in man.items():
        pre = info["prefix"]
        for idx, title in enumerate(info["konular"], 1):
            t = by.get((ders, title))
            if not t:
                short.append("missing topic %s / %s" % (ders, title))
                continue
            qp = os.path.join(ROOT, "sorular", "%s-%s.js" % (pre, idx))
            old = load_qs(qp)
            kept = [to_fact(q) for q in old if not is_filler(q)]
            dropped += len(old) - len(kept)
            bullets = []
            for s in t["slides"]:
                bullets.extend(s[2])
            qs = fill20(kept, bullets, title, ders_bullets.get(ders) or [])
            write_questions(pre, idx, title, qs)
            files += 1
            if len(qs) < 20:
                short.append("%s-%s %s n=%s" % (pre, idx, title, len(qs)))
    print("files", files, "dropped_filler", dropped, "short", len(short))
    for s in short[:20]:
        print(" ", s)

if __name__ == "__main__":
    main()
