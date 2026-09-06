(function (global) {
    function bank() {
        return global.GamesBank || { SPECIAL: {}, REGION_FACTS: {}, TABU: [], PANIC: [], TABU_SCORE: [5, 3, 2, 1] };
    }

    function mq() {
        return global.MapQuiz || {};
    }

    function shuffle(arr) {
        var a = (arr || []).slice();
        var i, j, t;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            t = a[i];
            a[i] = a[j];
            a[j] = t;
        }
        return a;
    }

    function stripHtml(html) {
        return String(html || "")
            .replace(/<br\s*\/?>/gi, " ")
            .replace(/<[^>]+>/g, " ")
            .replace(/&nbsp;/gi, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function mcq(question, options, correct) {
        var opts = shuffle((options || []).filter(Boolean));
        if (opts.indexOf(correct) < 0 && correct) opts = [correct].concat(opts).slice(0, 4);
        while (opts.length < 2) opts.push("—");
        return { question: question, options: opts.slice(0, 4), correct: correct };
    }

    function fromTriple(row) {
        if (!row || !row.length) return null;
        return mcq(row[0], row[1], row[2]);
    }

    function names() {
        return mq().NAMES || {};
    }

    function regions() {
        return mq().PROVINCE_REGION || {};
    }

    function regionLabels() {
        return mq().REGION_LABEL || {};
    }

    function codesOfRegion(rid) {
        var pr = regions();
        return Object.keys(pr).filter(function (c) { return pr[c] === rid; });
    }

    function regionIdOf(code) {
        return regions()[code] || "";
    }

    function regionTitle(code) {
        return regionLabels()[regionIdOf(code)] || "";
    }

    function allCodes() {
        return Object.keys(names());
    }

    function regionQ(code) {
        var title = regionTitle(code);
        var labs = Object.keys(regionLabels()).map(function (k) { return regionLabels()[k]; });
        var distract = shuffle(labs.filter(function (x) { return x !== title; })).slice(0, 3);
        return mcq(names()[code] + " hangi coğrafi bölgededir?", [title].concat(distract), title);
    }

    function fold(s) {
        return String(s || "").toLocaleLowerCase("tr-TR")
            .replace(/â/g, "a").replace(/î/g, "i").replace(/û/g, "u")
            .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u")
            .replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c");
    }

    function stripChoice(s) {
        return stripHtml(s).replace(/^\s*[A-Ea-e][\.\)\-]\s*/, "").trim();
    }

    function isRecentKonu(konu) {
        var k = fold(konu);
        return k.indexOf("tarim") >= 0 || k.indexOf("hayvancilik") >= 0 || k.indexOf("maden") >= 0;
    }

    function qToMcq(q) {
        if (!q) return null;
        var opts = (q.options || []).map(stripChoice).filter(Boolean);
        var idx = typeof q.correctAnswerIndex === "number" ? q.correctAnswerIndex : -1;
        var correct = stripChoice(q.answer || q.correct || (idx >= 0 ? opts[idx] : "") || "");
        if (opts.length < 2 || !correct) return null;
        var stem = stripHtml(q.question).replace(/^Soru\s*\d+\s*:\s*/i, "");
        if (!stem) return null;
        return mcq(stem, opts, correct);
    }

    function walkQs(kpssData, fn) {
        Object.keys(kpssData || {}).forEach(function (ders) {
            Object.keys(kpssData[ders] || {}).forEach(function (konu) {
                ((kpssData[ders][konu] && kpssData[ders][konu].sorular) || []).forEach(function (q) {
                    fn(ders, konu, q);
                });
            });
        });
    }

    function nameNeedles(code) {
        var name = names()[code] || "";
        var raw = [name];
        if (name === "Afyonkarahisar") raw.push("Afyon", "Afyonkarahisar");
        if (name === "Kahramanmaraş") raw.push("Maraş", "K.Maraş");
        if (name === "Şanlıurfa") raw.push("Urfa");
        if (name === "Hatay") raw.push("Antakya");
        var out = [];
        raw.forEach(function (s) {
            var f = fold(s);
            if (f.length >= 3 && out.indexOf(f) < 0) out.push(f);
        });
        return out;
    }

    function blobHits(blobFold, needles) {
        for (var i = 0; i < needles.length; i++) {
            var n = needles[i];
            if (!n) continue;
            if (n.length <= 4) {
                if (new RegExp("(^|[^a-z0-9])" + n + "([^a-z0-9]|$)", "i").test(blobFold)) return true;
            } else if (blobFold.indexOf(n) >= 0) return true;
        }
        return false;
    }

    function answersOtherProvince(correct, code) {
        var cf = fold(correct);
        var mine = fold(names()[code] || "");
        if (mine && cf.indexOf(mine) >= 0) return false;
        var codes = allCodes();
        var i, n;
        for (i = 0; i < codes.length; i++) {
            if (codes[i] === code) continue;
            n = fold(names()[codes[i]] || "");
            if (n.length >= 4 && (cf === n || cf.indexOf(n) >= 0)) return true;
        }
        return false;
    }

    function catalogHits(code, kpssData) {
        var needles = nameNeedles(code);
        if (!needles.length || !kpssData) return [];
        var out = [];
        walkQs(kpssData, function (ders, konu, q) {
            var stem = fold(stripHtml(q.question || ""));
            var extra = fold(stripHtml(q.explanation || ""));
            if (!blobHits(stem, needles) && !blobHits(extra, needles)) return;
            var item = qToMcq(q);
            if (!item) return;
            if (answersOtherProvince(item.correct, code)) return;
            out.push(item);
        });
        return shuffle(out);
    }

    function walkNotes(kpssData, fn) {
        Object.keys(kpssData || {}).forEach(function (ders) {
            Object.keys(kpssData[ders] || {}).forEach(function (konu) {
                ((kpssData[ders][konu] && kpssData[ders][konu].notlar) || []).forEach(function (html) {
                    fn(ders, konu, html);
                });
            });
        });
    }

    function noteSnippets(html) {
        return stripHtml(String(html || "").replace(/<\/(li|p|div|h[1-6]|tr)>/gi, "\n").replace(/<br\s*\/?>/gi, "\n"))
            .split(/\n+/)
            .map(function (s) {
                return s.replace(/^[\s•\-\d\.]+/, "").replace(/\s+/g, " ").trim();
            })
            .filter(function (s) {
                if (s.length < 28 || s.length > 180) return false;
                if (/haritas[ıi]|loading=lazy|atanly/i.test(s)) return false;
                return true;
            });
    }

    function noteHits(code, kpssData) {
        var needles = nameNeedles(code);
        var name = names()[code];
        if (!needles.length || !name || !kpssData) return [];
        var mine = [];
        var other = [];
        walkNotes(kpssData, function (ders, konu, html) {
            noteSnippets(html).forEach(function (s) {
                if (blobHits(fold(s), needles)) {
                    if (mine.indexOf(s) < 0) mine.push(s);
                } else if (other.indexOf(s) < 0) {
                    other.push(s);
                }
            });
        });
        return mine.map(function (fact) {
            var dist = shuffle(other.filter(function (x) { return x !== fact; })).slice(0, 3);
            while (dist.length < 3) dist.push("—");
            return mcq(name + " notlarından hangisi bu il ile ilgilidir?", [fact].concat(dist), fact);
        });
    }

    function localFeatureQs(code) {
        var name = names()[code];
        if (!name) return [];
        var mine = [];
        var pool = [];
        (mq().ITEMS || []).forEach(function (it) {
            var label = String(it.name || "").replace(/\s*\(.*\)\s*$/, "").trim();
            if (!label || label.length < 3) return;
            if ((it.codes || []).indexOf(code) >= 0) {
                if (mine.indexOf(label) < 0) mine.push(label);
            } else if (pool.indexOf(label) < 0) {
                pool.push(label);
            }
        });
        return mine.map(function (prod) {
            var dist = shuffle(pool.filter(function (p) { return p !== prod; })).slice(0, 3);
            while (dist.length < 3) dist.push("—");
            return mcq(name + " ilinde / çevresinde hangisi yer alır?", [prod].concat(dist), prod);
        });
    }

    function parseNoteTitle(html) {
        var m = String(html || "").match(/tracking-wider">([\s\S]*?)<\/span>/i);
        var raw = stripHtml(m && m[1] || "").replace(/^\s*[^\sA-Za-zÇĞİÖŞÜçğıöşü0-9]+\s*/, "").replace(/\s+/g, " ").trim();
        if (!raw) return "";
        var bits = raw.split(/\s*[-–—]\s*/).map(function (s) { return s.trim(); }).filter(Boolean);
        if (bits.length >= 2) {
            var last = bits[bits.length - 1];
            var first = bits[0];
            if (/bolge|yore|donem|genel bilgi/i.test(fold(last))) return first;
            return last;
        }
        return raw;
    }

    function maskAnswer(text, answer) {
        var t = String(text || "");
        String(answer || "").split(/[\s\/,]+/).forEach(function (w) {
            w = w.trim();
            if (fold(w).length < 4) return;
            var esc = w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            t = t.replace(new RegExp(esc, "gi"), "…");
        });
        return t.replace(/\s+/g, " ").trim();
    }

    function tabuFromNotes(kpssData) {
        var parsed = [];
        var seen = {};
        walkNotes(kpssData, function (ders, konu, html) {
            var title = parseNoteTitle(html);
            var f = fold(title);
            if (!title || title.length < 3 || title.length > 42) return;
            if (/genel bilgi|gelistirme yol|geride kalma|alinmasi gereken|baslica tarim urunleri/i.test(f)) return;
            if (seen[f]) return;
            var clues = noteSnippets(html).map(function (s) { return maskAnswer(s, title); }).filter(function (s) {
                return s.length >= 20 && s.length <= 140 && fold(s).indexOf(f) < 0;
            });
            if (clues.length < 2) return;
            seen[f] = true;
            parsed.push({
                answer: title,
                clues: clues.slice(0, 3),
                topic: ders || "KPSS"
            });
        });
        var titles = parsed.map(function (p) { return p.answer; });
        parsed.forEach(function (p) {
            var dist = shuffle(titles.filter(function (t) { return fold(t) !== fold(p.answer); })).slice(0, 3);
            while (dist.length < 3) dist.push("—");
            p.choices = [p.answer].concat(dist);
            while (p.clues.length < 3) p.clues.push(p.topic + " notlarından ezber kavram");
        });
        return parsed;
    }

    function panicFromItem(item) {
        if (!item) return null;
        var a = stripChoice(item.correct || item.a || "");
        var choices = (item.options || item.choices || []).map(stripChoice).filter(Boolean);
        if (!a || choices.length < 2) return null;
        var q = String(item.question || item.q || "");
        if (q.length > 160) q = q.slice(0, 157) + "…";
        return { q: q, a: a, choices: choices.slice(0, 4) };
    }

    function uniquePush(list, item) {
        if (!item || !item.question) return;
        var key = item.question + "\n" + String(item.correct || "");
        for (var i = 0; i < list.length; i++) {
            if ((list[i].question + "\n" + String(list[i].correct || "")) === key) return;
        }
        list.push(item);
    }

    function quizForProvince(code, kpssData) {
        code = String(code || "").toUpperCase();
        var b = bank();
        var list = [];
        catalogHits(code, kpssData).forEach(function (q) { uniquePush(list, q); });
        noteHits(code, kpssData).forEach(function (q) { uniquePush(list, q); });
        ((b.SPECIAL && b.SPECIAL[code]) || []).forEach(function (row) {
            uniquePush(list, fromTriple(row));
        });
        localFeatureQs(code).forEach(function (q) { uniquePush(list, q); });
        uniquePush(list, regionQ(code));
        var picked = shuffle(list);
        if (!picked.length) uniquePush(picked, regionQ(code));
        return picked;
    }

    function regionProgress(conquered) {
        var labs = regionLabels();
        var out = [];
        Object.keys(labs).forEach(function (rid) {
            var codes = codesOfRegion(rid);
            var have = 0;
            codes.forEach(function (c) { if (conquered && conquered[c]) have += 1; });
            out.push({
                id: rid,
                title: labs[rid],
                have: have,
                total: codes.length,
                done: codes.length > 0 && have >= codes.length
            });
        });
        return out;
    }

    function conqueredCount(conquered) {
        var n = 0;
        allCodes().forEach(function (c) { if (conquered && conquered[c]) n += 1; });
        return n;
    }

    function freshBadges(conquered, already) {
        already = already || {};
        var fresh = [];
        regionProgress(conquered).forEach(function (r) {
            if (r.done && !already[r.id]) fresh.push({ id: r.id, title: r.title + " fethi" });
        });
        if (conqueredCount(conquered) >= allCodes().length && !already.turkiye) {
            fresh.push({ id: "turkiye", title: "Türkiye'yi Fethet" });
        }
        return fresh;
    }

    function tabuDeck(n, kpssData) {
        n = n || 12;
        var fromNotes = tabuFromNotes(kpssData);
        var extra = (bank().TABU || []).map(function (card) {
            return {
                answer: card.answer,
                clues: (card.clues || []).slice(0, 3),
                choices: card.choices || [card.answer],
                topic: "KPSS"
            };
        });
        var pool = fromNotes.length >= 8 ? fromNotes : fromNotes.concat(extra);
        return shuffle(pool).slice(0, n).map(function (card, i) {
            var clues = (card.clues || []).slice(0, 3);
            while (clues.length < 3) clues.push("Notlardaki tanımına göre tahmin et");
            return {
                id: i,
                answer: card.answer,
                clues: clues,
                topic: card.topic || "KPSS",
                choices: shuffle(card.choices || [card.answer])
            };
        });
    }

    function tabuPoints(cluesUsed) {
        var table = bank().TABU_SCORE || [5, 5, 3, 1];
        var i = Math.max(0, Math.min(3, cluesUsed | 0));
        return table[i] || 1;
    }

    function panicDeck(kpssData) {
        var out = [];
        (bank().PANIC || []).forEach(function (item) {
            var row = panicFromItem({ question: item.q, correct: item.a, options: item.choices, q: item.q, a: item.a, choices: item.choices });
            if (row) out.push(row);
        });
        walkQs(kpssData, function (ders, konu, q) {
            if (!isRecentKonu(konu)) return;
            var row = panicFromItem(qToMcq(q));
            if (row) out.push(row);
        });
        return shuffle(out).map(function (item) {
            return { q: item.q, a: item.a, choices: shuffle(item.choices || [item.a]) };
        });
    }

    global.GamesEngine = {
        shuffle: shuffle,
        quizForProvince: quizForProvince,
        regionProgress: regionProgress,
        conqueredCount: conqueredCount,
        freshBadges: freshBadges,
        tabuDeck: tabuDeck,
        tabuPoints: tabuPoints,
        panicDeck: panicDeck,
        allCodes: allCodes,
        regionTitle: regionTitle,
        nameOf: function (code) { return names()[code] || code; }
    };
})(typeof window !== "undefined" ? window : globalThis);
