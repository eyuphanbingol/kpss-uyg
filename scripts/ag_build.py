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

def clip(s, n=150):
    s = re.sub(r"\*\*", "", str(s or ""))
    s = re.sub(r"\s+", " ", s).strip()
    if len(s) <= n:
        return s
    cut = s[:n].rsplit(" ", 1)[0]
    return cut.rstrip(".,;:") + "..."

def extract_concept(raw, title):
    m = re.search(r"\*\*(.+?)\*\*", str(raw or ""))
    if m:
        c = re.sub(r"\s+", " ", m.group(1)).strip()
        if 2 <= len(c) <= 56:
            return c
    plain = clip(raw, 80)
    if ":" in plain[:48]:
        return clip(plain.split(":")[0], 56)
    words = re.sub(r"[()]", " ", plain).split()
    if len(words) >= 3:
        return " ".join(words[:4]).rstrip(".,;:")
    return title

def opt_key(q):
    opts = q.get("options") or []
    i = q.get("i")
    if i is None:
        i = q.get("correctAnswerIndex", 0)
    if 0 <= i < len(opts):
        return re.sub(r"^[A-E]\)\s*", "", opts[i])[:48]
    return (q.get("question") or "")[:48]

def stem_for(concept, title, n):
    variants = [
        "%s ile ilgili aşağıdakilerden hangisi doğrudur?" % concept,
        "Aşağıdakilerden hangisi %s için doğru bir açıklamadır?" % concept,
        "%s hakkında hangisi doğrudur?" % concept,
        "%s hangisini ifade eder?" % concept,
    ]
    return variants[n % len(variants)]

def collect_wrongs(text, concept, pool, ders_pool):
    others = []
    cl = (concept or "").lower()
    for o in list(pool) + list(ders_pool):
        ot = clip(o, 160)
        if not ot or len(ot) < 20 or ot[:28] == text[:28]:
            continue
        if cl and len(cl) >= 4 and cl in ot.lower() and o in pool:
            continue
        if ot not in others:
            others.append(ot)
    return others

def fill20(facts, bullets, title, distract):
    out = list(facts)
    used = set(opt_key(q) for q in out)
    pool = list(bullets or [])
    ders_pool = [x for x in (distract or []) if x not in pool]
    if not pool:
        return out[:20]
    n = 0
    for strict in (True, False):
        bi = 0
        while len(out) < 20 and bi < 120:
            raw = pool[bi % len(pool)]
            bi += 1
            n += 1
            text = clip(raw, 160)
            if len(text) < 18:
                continue
            if strict and any(text[:36] in u or u[:36] in text for u in used):
                continue
            if not strict and text[:48] in used:
                continue
            concept = extract_concept(raw, title)
            others = collect_wrongs(text, concept, pool, ders_pool)
            if len(others) < 4:
                others = collect_wrongs(text, "", pool, ders_pool)
            if len(others) < 4:
                continue
            q = mkq(
                stem_for(concept, title, n),
                text,
                others[:4],
                "%s notundaki temel bilgi." % title,
            )
            out.append(q)
            used.add(opt_key(q))
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
    qp = write_questions(prefix, idx, title, qs)
    return np, qp

def write_questions(prefix, idx, title, qs):
    qp = os.path.join(ROOT, "sorular", "%s-%s.js" % (prefix, idx))
    with open(qp, "w", encoding="utf-8", newline="\n") as f:
        f.write("// sorular/%s-%s.js - %s\n" % (prefix, idx, title))
        f.write("window.%s_%s_sorulari = %s;\n" % (prefix, idx, q_js(qs)))
    return qp

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
