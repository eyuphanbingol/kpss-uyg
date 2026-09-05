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

    function catalogHits(code, kpssData) {
        var name = names()[code] || "";
        if (!name || !kpssData) return [];
        var needle = name.toLocaleLowerCase("tr-TR");
        var out = [];
        Object.keys(kpssData).forEach(function (ders) {
            Object.keys(kpssData[ders] || {}).forEach(function (konu) {
                ((kpssData[ders][konu] && kpssData[ders][konu].sorular) || []).forEach(function (q) {
                    var blob = stripHtml((q.question || "") + " " + (q.explanation || "") + " " + ((q.options || []).join(" ")));
                    if (blob.toLocaleLowerCase("tr-TR").indexOf(needle) < 0) return;
                    var opts = (q.options || []).map(stripHtml).filter(Boolean);
                    var idx = typeof q.correctAnswerIndex === "number" ? q.correctAnswerIndex : -1;
                    var correct = stripHtml(q.answer || q.correct || (idx >= 0 ? opts[idx] : "") || "");
                    if (opts.length < 2 || !correct) return;
                    out.push(mcq(stripHtml(q.question), opts, correct));
                });
            });
        });
        return shuffle(out);
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
        uniquePush(list, regionQ(code));
        uniquePush(list, sameRegionQ(code));
        ((b.SPECIAL && b.SPECIAL[code]) || []).forEach(function (row) {
            uniquePush(list, fromTriple(row));
        });
        catalogHits(code, kpssData).slice(0, 4).forEach(function (q) { uniquePush(list, q); });
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

    function tabuDeck(n) {
        return shuffle(bank().TABU || []).slice(0, n || 12).map(function (card, i) {
            return {
                id: i,
                answer: card.answer,
                clues: (card.clues || []).slice(0, 3),
                choices: shuffle(card.choices || [card.answer])
            };
        });
    }

    function tabuPoints(cluesUsed) {
        var table = bank().TABU_SCORE || [5, 3, 2, 1];
        var i = Math.max(0, Math.min(3, cluesUsed | 0));
        return table[i] || 1;
    }

    function panicDeck() {
        return shuffle(bank().PANIC || []).map(function (item) {
            return {
                q: item.q,
                a: item.a,
                choices: shuffle(item.choices || [item.a])
            };
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
