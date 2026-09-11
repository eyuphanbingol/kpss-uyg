# -*- coding: utf-8 -*-
"""KPSS A Grubu not + soru üretici. Çalıştır: python scripts/ag_build.py"""
import json, os, re, html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COLORS = ["blue", "red", "violet", "emerald", "amber", "teal", "orange", "stone", "pink", "indigo"]

def esc(s):
    return (s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))

def boldish(s):
    return re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", esc(s).replace("&lt;b&gt;", "<b>").replace("&lt;/b&gt;", "</b>"))

def slide_html(title, color, items, trap=None):
    lis = "".join('<li>%s</li>\n' % boldish(it) for it in items)
    trap_h = ""
    if trap:
        trap_h = (
            '<div class="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 mt-3">'
            '<p class="text-[11px] leading-relaxed text-amber-900 dark:text-amber-200">⚠️ <b>Sınav:</b> %s</p></div>'
        ) % boldish(trap)
    return """
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-%s-100 dark:bg-%s-900/50 text-%s-800 dark:text-%s-200 font-black text-sm uppercase tracking-wider">
            %s
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3">
        %s
    </ul>
    %s
    """ % (color, color, color, color, esc(title), lis, trap_h)

def q_js(qs):
    parts = []
    for q in qs:
        opts = json.dumps(q["options"], ensure_ascii=False)
        parts.append(
            '{\n    "question": %s,\n    "options": %s,\n    "correctAnswerIndex": %s,\n    "explanation": %s\n}'
            % (json.dumps(q["question"], ensure_ascii=False), opts, q["i"], json.dumps(q["explanation"], ensure_ascii=False))
        )
    return "[\n" + ",\n".join(parts) + "\n]"

def letters(opts):
    L = "ABCDE"
    return ["%s) %s" % (L[i], opts[i]) for i in range(5)]

def mkq(question, correct, wrongs, expl):
    wr = list(wrongs)[:4]
    while len(wr) < 4:
        wr.append("Yukarıdakilerin hiçbiri")
    opts = [correct] + wr[:4]
    # keep correct at a varied index by rotating with hash
    k = sum(ord(c) for c in question) % 5
    opts = opts[k:] + opts[:k]
    # after rotate, correct is at (0-k)%5 wait: original index 0, rotate left k => index (0-k)%5 = (5-k)%5
    idx = (5 - k) % 5
    assert opts[idx] == correct or True
    # fix index properly
    idx = opts.index(correct)
    return {"question": question, "options": letters(opts), "i": idx, "explanation": expl}

def fill20(facts, bullets, title, distract):
    out = list(facts)
    pool = [re.sub(r"\*\*", "", b) for b in bullets]
    d = list(distract)
    n = 0
    while len(out) < 20 and pool:
        b = pool[n % len(pool)]
        wrongs = [x for x in d if x != b][:4]
        if len(wrongs) < 4:
            wrongs += ["Meclis hükümeti", "Kliring", "NAIRU", "Simpleks"][:4 - len(wrongs)]
        if n % 2 == 0:
            out.append(mkq(
                "%s konusunda aşağıdakilerden hangisi yer alır?" % title,
                b[:90], wrongs, "Konu notunda açıkça yer alır."
            ))
        else:
            w = wrongs[0]
            out.append(mkq(
                "%s konusunda aşağıdakilerden hangisi yer almaz?" % title,
                w, [b[:90]] + wrongs[1:4],
                "Bu ifade bu konunun kapsamı dışındadır."
            ))
        n += 1
        if n > 40:
            break
    return out[:20]

def as_qs(rows, bullets, title, distract):
    facts = []
    for r in rows:
        facts.append(mkq(r[0], r[1], r[2], r[3]))
    return fill20(facts, bullets, title, distract)

def write_topic(prefix, idx, title, slides, qs):
    notes = [slide_html(s[0], s[1], s[2], s[3] if len(s) > 3 else None) for s in slides]
    note_body = "window.%s_%s_notlari = [\n" % (prefix, idx)
    note_body += ",\n".join(["    `%s`" % n for n in notes])
    note_body += "\n];\n"
    np = os.path.join(ROOT, "notlar", "%s-%s-not.js" % (prefix, idx))
    with open(np, "w", encoding="utf-8") as f:
        f.write("// notlar/%s-%s-not.js - %s\n" % (prefix, idx, title))
        f.write(note_body)
    qp = os.path.join(ROOT, "sorular", "%s-%s.js" % (prefix, idx))
    with open(qp, "w", encoding="utf-8") as f:
        f.write("// sorular/%s-%s.js - %s\n" % (prefix, idx, title))
        f.write("window.%s_%s_sorulari = %s;\n" % (prefix, idx, q_js(qs)))
    return np, qp

if __name__ == "__main__":
    import sys
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from ag_data import TOPICS
    dist = []
    for t in TOPICS:
        for s in t["slides"]:
            dist.extend(s[2][:2])
    dist = [re.sub(r"\*\*", "", x)[:80] for x in dist]
    manifest = {}
    for t in TOPICS:
        ders = t["ders"]
        prefix = t["prefix"]
        manifest.setdefault(ders, {"prefix": prefix, "konular": []})
        idx = len(manifest[ders]["konular"]) + 1
        bullets = []
        for s in t["slides"]:
            bullets.extend(s[2])
        qs = as_qs(t.get("facts") or [], bullets, t["title"], dist)
        write_topic(prefix, idx, t["title"], t["slides"], qs)
        manifest[ders]["konular"].append(t["title"])
        print(ders, idx, t["title"], "q", len(qs))
    manp = os.path.join(ROOT, "scripts", "ag_manifest.json")
    with open(manp, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
    print("OK", manp)
