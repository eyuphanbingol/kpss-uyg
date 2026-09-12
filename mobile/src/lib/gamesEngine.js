import { MapQuiz } from "./mapQuiz";
import { GamesBank } from "./gamesBank";

(function (global) {
    global.MapQuiz = MapQuiz;
    if (GamesBank) global.GamesBank = GamesBank;

    function bank() {
        return GamesBank || global.GamesBank || { SPECIAL: {}, REGION_FACTS: {}, TABU: [], PANIC: [], KODLAMA: [], TABU_SCORE: [5, 3, 2, 1] };
    }

    function mq() {
        return MapQuiz || global.MapQuiz || {};
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

    function stripClueDates(s) {
        s = String(s || "");
        s = s.replace(/\b\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\b/g, " ");
        s = s.replace(/\b\d{1,2}\s*[-–]\s*\d{1,2}\s+(Ocak|Şubat|Mart|Nisan|Mayıs|Haziran|Temmuz|Ağustos|Eylül|Ekim|Kasım|Aralık)(\s+\d{4})?\b/gi, " ");
        s = s.replace(/\b\d{1,2}\s+(Ocak|Şubat|Mart|Nisan|Mayıs|Haziran|Temmuz|Ağustos|Eylül|Ekim|Kasım|Aralık)(\s+\d{4})?\b/gi, " ");
        s = s.replace(/\b(Ocak|Şubat|Mart|Nisan|Mayıs|Haziran|Temmuz|Ağustos|Eylül|Ekim|Kasım|Aralık)\s+\d{4}\b/gi, " ");
        s = s.replace(/\b(MÖ|MS)\s*\d{1,4}\b/gi, " ");
        s = s.replace(/\b(1[0-9]{3}|20[0-2]\d)\b/g, " ");
        s = s.replace(/\(\s*\)/g, " ");
        s = s.replace(/\b(yılında|yılı|senesinde|tarihinde)\b/gi, " ");
        s = s.replace(/\s+/g, " ").trim();
        s = s.replace(/^[-–—,;:.\s]+/, "").replace(/[-–—,;:\s]+$/, "");
        return s;
    }

    function shapeTabuClue(s, answer) {
        s = maskAnswer(stripHtml(s), answer);
        s = stripClueDates(s);
        s = s.replace(/\s*[-–—]\s*$/, "").replace(/^[-–—]\s*/, "");
        if (s.length > 92) s = s.slice(0, 89).replace(/\s+\S*$/, "").replace(/[,;:]$/, "") + "…";
        return s;
    }

    function isGoodTabuClue(s, answerFold, minLen) {
        minLen = minLen == null ? 8 : minLen;
        if (!s || s.length < minLen || s.length > 120) return false;
        if (/\b(1[0-9]{3}|20[0-2]\d)\b/.test(s)) return false;
        if (/^\d[\d\s./-]*$/.test(s)) return false;
        if (answerFold && fold(s).indexOf(answerFold) >= 0) return false;
        return true;
    }

    function collectTabuClues(rawList, answer, minLen) {
        var f = fold(answer);
        var seen = {};
        var out = [];
        (rawList || []).forEach(function (raw) {
            var s = shapeTabuClue(raw, answer);
            var k = fold(s);
            if (!isGoodTabuClue(s, f, minLen) || seen[k]) return;
            seen[k] = true;
            out.push(s);
        });
        out.sort(function (a, b) { return a.length - b.length; });
        return out.slice(0, 3);
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
            var clues = collectTabuClues(noteSnippets(html), title, 14);
            if (clues.length < 2) return;
            seen[f] = true;
            parsed.push({
                answer: title,
                clues: clues,
                topic: ders || "KPSS"
            });
        });
        var titles = parsed.map(function (p) { return p.answer; });
        parsed.forEach(function (p) {
            var dist = shuffle(titles.filter(function (t) { return fold(t) !== fold(p.answer); })).slice(0, 3);
            while (dist.length < 3) dist.push("—");
            p.choices = [p.answer].concat(dist);
            while (p.clues.length < 3) p.clues.push("Notlardaki tanıma göre kavramı bul");
        });
        return parsed;
    }

    function formatPanicStem(s) {
        s = String(s || "")
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<\/p>/gi, "\n")
            .replace(/<[^>]+>/g, " ")
            .replace(/&nbsp;/gi, " ")
            .replace(/[ \t]+/g, " ")
            .replace(/^Soru\s*\d+\s*:\s*/i, "")
            .trim();
        s = s.replace(/\s+((?:I|II|III|IV|V|VI)[\.\)])\s+/g, "\n$1 ");
        s = s.replace(/\s+(Aşağıdakilerden|Buna göre)/g, "\n\n$1");
        s = s.replace(/\n{3,}/g, "\n\n");
        return s;
    }

    function yearInStemLeak(q, a) {
        var ansYears = String(a || "").match(/\b(1[89]\d{2}|20[0-2]\d)\b/g) || [];
        if (!ansYears.length) return false;
        var stem = String(q || "");
        for (var i = 0; i < ansYears.length; i++) {
            if (stem.indexOf(ansYears[i]) >= 0) return true;
        }
        return false;
    }

    function panicFromItem(item) {
        if (!item) return null;
        var a = stripChoice(item.correct || item.a || "");
        var choices = (item.options || item.choices || []).map(stripChoice).filter(Boolean);
        if (!a || choices.length < 2) return null;
        var q = formatPanicStem(item.question || item.q || "");
        if (!q) return null;
        if (yearInStemLeak(q, a)) return null;
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

    function tabuDeck(n, kpssData, seen) {
        n = n || 12;
        seen = seen || {};
        var extra = (bank().TABU || []).map(function (card) {
            var clues = collectTabuClues(card.clues || [], card.answer, 6);
            if (clues.length < 2) clues = (card.clues || []).slice(0, 3);
            return {
                id: "t:" + fold((card.answer || "") + "|" + ((clues && clues[0]) || "")),
                answer: card.answer,
                clues: clues,
                choices: card.choices || [card.answer],
                topic: "KPSS"
            };
        }).filter(function (card) { return (card.clues || []).length >= 2 && card.answer; });
        var fromNotes = [];
        try {
            if (!extra.length) fromNotes = tabuFromNotes(kpssData);
        } catch (e) { fromNotes = []; }
        var pool = extra.concat(fromNotes).map(function (card) {
            if (card.id) return card;
            return Object.assign({}, card, { id: "t:" + fold((card.answer || "") + "|" + ((card.clues && card.clues[0]) || "") + "|" + (card.topic || "")) });
        }).filter(function (card) { return card.answer && !seen[card.id]; });
        if (!pool.length) return [];
        return shuffle(pool).slice(0, n).map(function (card, i) {
            var clues = (card.clues || []).slice(0, 3);
            while (clues.length < 3) clues.push("Notlardaki tanımına göre tahmin et");
            var choices = (card.choices || [card.answer]).slice();
            if (choices.indexOf(card.answer) < 0) choices.unshift(card.answer);
            return {
                id: card.id || ("t:" + i),
                answer: card.answer,
                clues: clues,
                topic: card.topic || "KPSS",
                choices: shuffle(choices).slice(0, 4)
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

    function kodlamaDeck(n, seen) {
        n = n || 10;
        seen = seen || {};
        var all = (bank().KODLAMA || []).map(function (row) {
            return Object.assign({}, row, { id: "k:" + fold(row.slogan || row.a || "") });
        }).filter(function (row) { return row.a && row.slogan; });
        var rows = all.filter(function (row) { return !seen[row.id]; });
        if (!rows.length) return [];
        return shuffle(rows).slice(0, n).map(function (row, i) {
            var cipher = i % 3 === 2;
            if (cipher) {
                var others = shuffle(all.filter(function (r) { return r.id !== row.id; }).map(function (r) { return r.slogan; })).slice(0, 3);
                while (others.length < 3) others.push("—");
                return {
                    id: row.id || ("k:" + i),
                    cat: row.cat || "Kodlama",
                    mode: "cipher",
                    q: "Bu kavramın kodlaması hangisi?",
                    prompt: row.a,
                    slogan: row.slogan,
                    a: row.slogan,
                    note: row.note || "",
                    choices: shuffle([row.slogan].concat(others))
                };
            }
            return {
                id: row.id || ("k:" + i),
                cat: row.cat || "Kodlama",
                mode: "decode",
                q: row.q || "Bu kodlama neyi hatırlatır?",
                prompt: row.slogan,
                slogan: row.slogan,
                a: row.a,
                note: row.note || "",
                choices: shuffle((row.choices || [row.a]).slice())
            };
        });
    }

    function kodlamaTickMs() { return 12000; }

    function kodlamaScore(leftMs, combo, cipher) {
        var sec = Math.max(0, Math.ceil((Number(leftMs) || 0) / 1000));
        return (cipher ? 140 : 100) + sec * 8 + Math.max(0, combo) * 20;
    }

    function kodlamaTitle(score, comboMax, lives) {
        score = Number(score) || 0;
        comboMax = Number(comboMax) || 0;
        if (score >= 1500 || comboMax >= 8) return "Kod ustası";
        if (score >= 1000) return "Atlas";
        if ((Number(lives) || 0) <= 0) return "Şifre kaçtı";
        if (score >= 500) return "Çırak";
        return "Isınma turu";
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
        kodlamaDeck: kodlamaDeck,
        kodlamaTickMs: kodlamaTickMs,
        kodlamaScore: kodlamaScore,
        kodlamaTitle: kodlamaTitle,
        allCodes: allCodes,
        regionTitle: regionTitle,
        nameOf: function (code) { return names()[code] || code; }
    };
})(typeof globalThis !== "undefined" ? globalThis : this);

export var GamesEngine = (typeof globalThis !== "undefined" && globalThis.GamesEngine) ? globalThis.GamesEngine : (typeof global !== "undefined" ? global.GamesEngine : null);
