(function (global) {
    function stripHtml(html) {
        return String(html || "")
            .replace(/<br\s*\/?>/gi, " ")
            .replace(/<\/(p|li|div|h[1-6]|tr|td)>/gi, " ")
            .replace(/<[^>]+>/g, " ")
            .replace(/&nbsp;/gi, " ")
            .replace(/&amp;/g, "&")
            .replace(/&#39;|&apos;/g, "'")
            .replace(/&quot;/g, '"')
            .replace(/\s+/g, " ")
            .trim();
    }

    function norm(s) {
        return String(s || "").toLocaleLowerCase("tr-TR").replace(/[''`´]/g, "").replace(/\s+/g, " ").trim();
    }

    function okTerm(t) {
        if (!t || t.length < 2 || t.length > 72) return false;
        var n = norm(t);
        if (["ve", "ile", "bir", "bu", "şu", "en", "ilk", "de", "da", "için", "gibi"].indexOf(n) >= 0) return false;
        return /[A-Za-zÇĞİÖŞÜçğıöşü0-9]/.test(t);
    }

    function extractBolds(html) {
        var tags = [];
        var re = /<(b|strong)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/gi;
        var m;
        while ((m = re.exec(html))) {
            var t = stripHtml(m[2]).replace(/[:：]\s*$/, "").trim();
            if (okTerm(t)) tags.push(t);
        }
        return tags;
    }

    function blankIn(text, term) {
        var hay = String(text || "");
        var needle = String(term || "");
        var i = hay.toLocaleLowerCase("tr-TR").indexOf(needle.toLocaleLowerCase("tr-TR"));
        if (i < 0) return hay + " → ______";
        return hay.slice(0, i) + "______" + hay.slice(i + needle.length);
    }

    function tidyPlain(s) {
        return String(s || "").replace(/\s+/g, " ").trim();
    }

    function clipAround(prompt, maxLen) {
        maxLen = maxLen || 180;
        var p = tidyPlain(prompt);
        var mark = "______";
        var i = p.indexOf(mark);
        if (i < 0) return p.length > maxLen ? p.slice(0, maxLen) + "…" : p;
        if (p.length <= maxLen) return p;
        var pad = Math.floor((maxLen - mark.length) / 2);
        var start = Math.max(0, i - pad);
        var end = Math.min(p.length, i + mark.length + pad);
        if (start > 0) {
            var sp = p.indexOf(" ", start);
            if (sp > start && sp < i) start = sp + 1;
        }
        if (end < p.length) {
            var ep = p.lastIndexOf(" ", end);
            if (ep > i + mark.length) end = ep;
        }
        var out = p.slice(start, end).trim();
        if (start > 0) out = "…" + out;
        if (end < p.length) out += "…";
        return out;
    }

    function sectionHint(html) {
        var m = String(html || "").match(/tracking-wider[^>]*>([\s\S]*?)<\/span>/i);
        if (!m) return "";
        return tidyPlain(stripHtml(m[1])).slice(0, 72);
    }

    function splitChunks(html) {
        var h = String(html || "");
        var lis = h.match(/<li\b[\s\S]*?<\/li>/gi);
        if (lis && lis.length) return lis;
        var ps = h.match(/<p\b[\s\S]*?<\/p>/gi);
        if (ps && ps.length) return ps;
        return [h];
    }

    function fromNotes(notlar) {
        var items = [];
        (notlar || []).forEach(function (html, ni) {
            var hint = sectionHint(html);
            splitChunks(html).forEach(function (chunk, ci) {
                var terms = extractBolds(chunk);
                var plain = tidyPlain(stripHtml(chunk));
                if (plain.length < 12) return;
                var seen = {};
                terms.forEach(function (term, ti) {
                    var k = norm(term);
                    if (seen[k]) return;
                    seen[k] = 1;
                    var prompt = clipAround(blankIn(plain, term), 180);
                    if (tidyPlain(prompt.replace(/_/g, "")).length < 10) {
                        if (!hint) return;
                        prompt = hint + " · doğru ifade: ______";
                    }
                    items.push({
                        id: "n-" + ni + "-" + ci + "-" + ti,
                        prompt: prompt,
                        answer: term,
                        hint: hint
                    });
                });
            });
        });
        return items;
    }

    function optionText(opt) {
        return String(opt || "").replace(/^[A-Ea-e][\)\.:]\s*/, "").trim();
    }

    function fromQuestions(sorular) {
        var items = [];
        (sorular || []).forEach(function (q, qi) {
            var opts = q.options || [];
            var idx = q.correctAnswerIndex;
            if (idx == null || !opts[idx]) return;
            var ans = optionText(opts[idx]);
            if (!okTerm(ans)) return;
            var expl = stripHtml(q.explanation || "");
            var prompt;
            if (expl && expl.toLocaleLowerCase("tr-TR").indexOf(ans.toLocaleLowerCase("tr-TR")) >= 0) {
                prompt = clipAround(blankIn(expl, ans), 180);
            } else if (expl) {
                prompt = clipAround(expl.replace(/[.!?]?$/, "") + " Boşluk: ______", 180);
            } else {
                var stem = stripHtml(q.question || "");
                prompt = clipAround((stem.length > 160 ? stem.slice(0, 160) + "…" : stem) + " → ______", 180);
            }
            items.push({ id: "q-" + qi, prompt: prompt, answer: ans });
        });
        return items;
    }

    function shuffle(arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = a[i];
            a[i] = a[j];
            a[j] = t;
        }
        return a;
    }

    function collect(kd) {
        var all = fromNotes(kd && kd.notlar).concat(fromQuestions(kd && kd.sorular));
        var uniq = [];
        var seen = {};
        all.forEach(function (it) {
            var k = norm(it.answer) + "|" + norm(it.prompt).slice(0, 90);
            if (seen[k]) return;
            seen[k] = 1;
            uniq.push(it);
        });
        return uniq;
    }

    function withChoices(items, nChoices) {
        nChoices = nChoices || 4;
        var pool = [];
        var seen = {};
        items.forEach(function (it) {
            var k = norm(it.answer);
            if (!seen[k]) {
                seen[k] = 1;
                pool.push(it.answer);
            }
        });
        return items.map(function (it) {
            var others = shuffle(pool.filter(function (x) { return norm(x) !== norm(it.answer); }));
            var choices = [it.answer].concat(others.slice(0, Math.max(0, nChoices - 1)));
            return Object.assign({}, it, { choices: shuffle(choices) });
        });
    }

    function buildForKonu(kd, limit) {
        var uniq = collect(kd);
        var picked = shuffle(uniq).slice(0, limit || 12);
        return withChoices(picked);
    }

    function countForKonu(kd) {
        return collect(kd).length;
    }

    var api = { buildForKonu: buildForKonu, countForKonu: countForKonu, stripHtml: stripHtml };
    global.ClozeEngine = api;
    if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
