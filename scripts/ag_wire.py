# -*- coding: utf-8 -*-
import json, os
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
man = json.load(open(os.path.join(root, "scripts", "ag_manifest.json"), encoding="utf-8"))
dp = os.path.join(root, "data.js")
txt = open(dp, encoding="utf-8").read()
block = []
for ders, info in man.items():
    pre = info["prefix"]
    inner = []
    for i, konu in enumerate(info["konular"], 1):
        inner.append(
            '            %s: {\n                notlar: window.%s_%s_notlari || [],\n                sorular: window.%s_%s_sorulari || []\n            }'
            % (json.dumps(konu, ensure_ascii=False), pre, i, pre, i)
        )
    block.append("        %s: {\n%s\n        }" % (json.dumps(ders, ensure_ascii=False), ",\n".join(inner)))
ins = ",\n" + ",\n".join(block) + "\n"
anchor = "window.geometri_12_sorulari || []\n            }\n        }\n\n    };\n};"
if anchor not in txt:
    raise SystemExit("data.js anchor missing")
txt = txt.replace(anchor, "window.geometri_12_sorulari || []\n            }\n        }" + ins + "\n    };\n};", 1)
open(dp, "w", encoding="utf-8", newline="\n").write(txt)
print("data.js ok")

ip = os.path.join(root, "index.html")
html = open(ip, encoding="utf-8").read()
notes, qs = [], []
for ders, info in man.items():
    pre = info["prefix"]
    for i in range(1, len(info["konular"]) + 1):
        notes.append('    <script src="notlar/%s-%s-not.js?v=1"></script>' % (pre, i))
        qs.append('    <script src="sorular/%s-%s.js?v=1"></script>' % (pre, i))
html = html.replace(
    '    <script src="notlar/geometri-12-not.js?v=1"></script>',
    '    <script src="notlar/geometri-12-not.js?v=1"></script>\n' + "\n".join(notes),
    1,
)
html = html.replace(
    '    <script src="sorular/geometri-12.js?v=1"></script>',
    '    <script src="sorular/geometri-12.js?v=1"></script>\n' + "\n".join(qs),
    1,
)
html = html.replace("data.js?v=23", "data.js?v=24")
html = html.replace("js/config.js?v=23", "js/config.js?v=24")
html = html.replace("js/clozeEngine.js?v=7", "js/clozeEngine.js?v=8")
html = html.replace("js/app.jsx?v=117", "js/app.jsx?v=118")
html = html.replace("js/jsxLoader.js?v=78", "js/jsxLoader.js?v=79")
if "js/alan.js" not in html:
    html = html.replace(
        '    <script src="js/clozeEngine.js?v=8"></script>',
        '    <script src="js/alan.js?v=1"></script>\n    <script src="js/clozeEngine.js?v=8"></script>',
        1,
    )
open(ip, "w", encoding="utf-8", newline="\n").write(html)
print("index notes", len(notes), "qs", len(qs))
