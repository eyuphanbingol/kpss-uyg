import { MapQuiz } from "./mapQuiz";
import { GamesBank } from "./gamesBank";

globalThis.MapQuiz = MapQuiz;
globalThis.GamesBank = GamesBank;

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

    function sameRegionQ(code) {
        var rid = regionIdOf(code);
        var mates = codesOfRegion(rid).filter(function (c) { return c !== code; });
        var mate = mates[Math.floor(Math.random() * mates.length)];
        var others = shuffle(allCodes().filter(function (c) { return regionIdOf(c) !== rid; })).slice(0, 3);
        if (!mate) return regionQ(code);
        return mcq(
            names()[code] + " aşağıdaki illerden hangisiyle aynı coğrafi bölgededir?",
            [names()[mate]].concat(others.map(function (c) { return names()[c]; })),
            names()[mate]
        );
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

    function needlesFor(code) {
        var name = names()[code] || "";
        var raw = [name, code];
        if (name === "Afyonkarahisar") raw.push("Afyon");
        if (name === "Kahramanmaraş") raw.push("Maraş", "K.Maraş");
        if (name === "Şanlıurfa") raw.push("Urfa");
        (mq().ITEMS || []).forEach(function (it) {
            if ((it.codes || []).indexOf(code) < 0) return;
            raw.push(it.name, it.places);
        });
        var out = [];
        raw.forEach(function (s) {
            String(s || "").split(/[-–,\/]| ve /i).forEach(function (part) {
                var t = String(part || "").replace(/^[^:]+:\s*/, "").trim();
                var f = fold(t);
                if (f.length < 5) return;
                if (out.indexOf(f) < 0) out.push(f);
            });
        });
        return out;
    }

    function blobHits(blobFold, needles) {
        for (var i = 0; i < needles.length; i++) {
            if (blobFold.indexOf(needles[i]) >= 0) return true;
        }
        return false;
    }

    function catalogHits(code, kpssData) {
        var needles = needlesFor(code);
        if (!needles.length || !kpssData) return [];
        var recent = [];
        var rest = [];
        walkQs(kpssData, function (ders, konu, q) {
            var blob = fold(stripHtml((q.question || "") + " " + (q.explanation || "")));
            if (!blobHits(blob, needles)) return;
            var item = qToMcq(q);
            if (!item) return;
            if (isRecentKonu(konu)) recent.push(item);
            else rest.push(item);
        });
        return shuffle(recent).concat(shuffle(rest));
    }

    function mapTopicHits(code) {
        var name = names()[code];
        if (!name) return [];
        var out = [];
        (mq().ITEMS || []).forEach(function (it) {
            if ((it.codes || []).indexOf(code) < 0) return;
            var t = String(it.topic || "");
            if (t !== "tarim" && t !== "hayvan" && t !== "maden" && t !== "sanayi") return;
            var others = shuffle(allCodes().filter(function (c) { return c !== code; })).slice(0, 3)
                .map(function (c) { return names()[c]; });
            uniquePush(out, mcq((it.name || "Bu üretim") + " hangi ilde / hangi il kuşağındadır?", [name].concat(others), name));
            if (it.follow && it.follow.q && it.follow.answer) {
                uniquePush(out, mcq(it.follow.q, it.follow.choices || [it.follow.answer], it.follow.answer));
            }
        });
        return shuffle(out);
    }

    function tabuFromItem(item, konu) {
        var ans = stripChoice(item.correct || item.answer || "");
        if (ans.length < 3 || ans.length > 28) return null;
        if (/[—–→]/.test(ans)) return null;
        var f = fold(ans);
        if (/^(i ve |ii ve |i, |ii, |iii|yalniz|hepsi)/.test(f)) return null;
        if (/^[ivx\s,ve]+$/.test(f)) return null;
        var label = String(konu || "").replace(/^.*\(/, "").replace(/\)\s*$/, "") || "KPSS";
        var stem = String(item.question || "");
        var clues = [label, stem.length > 48 ? stem.slice(0, 46) + "…" : stem];
        var distract = (item.options || item.choices || []).filter(function (o) { return stripChoice(o) !== ans; });
        if (distract[0]) clues.push(stripChoice(distract[0]).slice(0, 40));
        var choices = [ans].concat(distract.map(stripChoice)).filter(Boolean);
        while (choices.length < 4) choices.push("—");
        return { answer: ans, clues: clues.slice(0, 3), choices: choices.slice(0, 4) };
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
        var key = item.question;
        for (var i = 0; i < list.length; i++) {
            if (list[i].question === key) return;
        }
        list.push(item);
    }

    function quizForProvince(code, kpssData) {
        code = String(code || "").toUpperCase();
        var b = bank();
        var list = [];
        catalogHits(code, kpssData).slice(0, 4).forEach(function (q) { uniquePush(list, q); });
        mapTopicHits(code).slice(0, 3).forEach(function (q) { uniquePush(list, q); });
        ((b.SPECIAL && b.SPECIAL[code]) || []).forEach(function (row) {
            uniquePush(list, fromTriple(row));
        });
        uniquePush(list, regionQ(code));
        uniquePush(list, sameRegionQ(code));
        var facts = (b.REGION_FACTS && b.REGION_FACTS[regionIdOf(code)]) || [];
        shuffle(facts).forEach(function (row) { uniquePush(list, fromTriple(row)); });
        var picked = list.slice(0, 3);
        while (picked.length < 3) uniquePush(picked, regionQ(code));
        return picked.slice(0, 3);
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
        var extra = [];
        walkQs(kpssData, function (ders, konu, q) {
            if (!isRecentKonu(konu)) return;
            var item = qToMcq(q);
            var card = item && tabuFromItem(item, konu);
            if (card) extra.push(card);
        });
        var fromCat = shuffle(extra).slice(0, Math.ceil(n / 2));
        var fromBank = shuffle(bank().TABU || []).slice(0, Math.max(0, n - fromCat.length));
        return shuffle(fromCat.concat(fromBank)).slice(0, n).map(function (card, i) {
            return {
                id: i,
                answer: card.answer,
                clues: (card.clues || []).slice(0, 3),
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

export var GamesEngine = globalThis.GamesEngine;
