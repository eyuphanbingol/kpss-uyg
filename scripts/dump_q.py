# -*- coding: utf-8 -*-
import json, os
ROOT = os.path.join(os.path.dirname(__file__), "..")
ANS = "ABCD"

def dump_q(rel, var, title, rows):
    assert all(len(r[1]) == 4 for r in rows), (title, [len(r[1]) for r in rows])
    lines = ["// %s - %s" % (rel, title), "window.%s = [" % var]
    for i, (q, opts, ans, exp) in enumerate(rows):
        options = [("%s) %s" % (ANS[j], opts[j])) for j in range(4)]
        obj = {
            "question": q,
            "options": options,
            "correctAnswerIndex": ANS.index(ans),
            "explanation": exp,
        }
        lines.append(json.dumps(obj, ensure_ascii=False, indent=4) + ("," if i < len(rows) - 1 else ""))
    lines.append("];\n")
    p = os.path.join(ROOT, rel.replace("/", os.sep))
    with open(p, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(rel, len(rows))
