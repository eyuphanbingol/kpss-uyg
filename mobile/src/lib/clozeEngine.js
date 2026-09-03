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
        var t = stripHtml(m[2]);
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

function fromNotes(notlar) {
    var items = [];
    (notlar || []).forEach(function (html, ni) {
        var terms = extractBolds(html);
        var plain = stripHtml(html);
        var seen = {};
        terms.forEach(function (term, ti) {
            var k = norm(term);
            if (seen[k]) return;
            seen[k] = 1;
            if (plain.length < 16) return;
            items.push({ id: "n-" + ni + "-" + ti, prompt: blankIn(plain, term), answer: term });
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
            prompt = blankIn(expl, ans);
        } else if (expl) {
            prompt = expl.replace(/[.!?]?$/, "") + " Boşluk: ______";
        } else {
            var stem = stripHtml(q.question || "");
            prompt = (stem.length > 200 ? stem.slice(0, 200) + "…" : stem) + " → ______";
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

export const ClozeEngine = {
    buildForKonu: function (kd, limit) {
        return withChoices(shuffle(collect(kd)).slice(0, limit || 12));
    },
    countForKonu: function (kd) {
        return collect(kd).length;
    }
};
