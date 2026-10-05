// Bu dosya scripts/sync-map-data.js ile js/smartPlan.js'ten üretilir. Elle düzenleme.
    // Akıllı KPSS programı: sınav tarihine, günlük boş saatlere ve zayıf derslere göre
    // konu düzeyinde, dönemlere ayrılmış bir takvim üretir.
    // Takvim saklanmaz; ayarlar ve tamamlananlar saklanır, takvim her seferinde bugünden
    // itibaren yeniden hesaplanır. Böylece kaçırılan iş kendiliğinden ileriye dağılır.
    // Web: window.SmartPlan, mobil: scripts/sync-map-data.js ile üretilen kopya.

    // ÖSYM GY-GK soru dağılımı (lisans, önlisans ve ortaöğretimde aynı): Türkçe 30,
    // Matematik 30, Tarih 27, Coğrafya 18, Vatandaşlık 9, Güncel Bilgiler 6.
    // Geometri matematiğin bir parçası olduğu için yaklaşık pay verilir.
    var WEIGHTS = { "Türkçe": 30, "Tarih": 27, "Coğrafya": 18, "Vatandaşlık": 9, "Güncel Bilgiler": 6, "Geometri": 8 };
    var NOTE_MIN = 3;          // not kartı başına dakika
    var Q_MIN = 1.1;           // soru başına dakika (çözüm okuma dahil)
    var Q_CAP = 90;            // bir konunun ilk turunda en fazla bu kadar soru
    var MIN_CHUNK = 20;        // bundan kısa parça planlanmaz
    var MAX_ITEM = 60;         // bir konu görevi günde en fazla bu kadar; uzunlar günlere bölünür
    var REVIEW_MIN = 20;       // aralıklı tekrar görevi
    var REVIEW_GAPS = [3, 10, 30];
    var DENEME_MIN = 120;
    var PHASES = {
        ogrenme: { label: "Öğrenme", color: "#0f766e" },
        pekistirme: { label: "Pekiştirme", color: "#4f46e5" },
        son: { label: "Deneme ve son tekrar", color: "#c2410c" }
    };
    var DAY_SHORT = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
    var DAY_FULL = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
    var MONTHS = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];

    // ---------- tarih yardımcıları (yerel saat, YYYY-AA-GG) ----------
    function pad(n) { return String(n).padStart(2, "0"); }
    function isoOf(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
    function parse(iso) { return new Date(iso + "T12:00:00"); }
    function addDays(iso, n) { var d = parse(iso); d.setDate(d.getDate() + n); return isoOf(d); }
    function diffDays(a, b) { return Math.round((parse(b) - parse(a)) / 86400000); }
    function weekday(iso) { return (parse(iso).getDay() + 6) % 7; } // 0 = Pazartesi
    function todayIso() { return isoOf(new Date()); }
    function fmtDate(iso, withDay) {
        var d = parse(iso);
        return d.getDate() + " " + MONTHS[d.getMonth()] + (withDay ? " " + DAY_SHORT[weekday(iso)] : "");
    }
    function fmtMin(m) {
        m = Math.round(m);
        if (m < 60) return m + " dk";
        var h = Math.floor(m / 60), r = m % 60;
        return h + " sa" + (r ? " " + r + " dk" : "");
    }

    function realKeys(obj) {
        return Object.keys(obj || {}).filter(function (k) { return k && k !== "_"; });
    }
    function weightOf(ders, weak) {
        var w = WEIGHTS[ders] || 6;
        return (weak || []).indexOf(ders) >= 0 ? w * 1.5 : w;
    }

    function defaultSettings(student) {
        var ex = student && student.profile && student.profile.examDate;
        return {
            v: 1,
            examDate: ex && ex > todayIso() ? ex : "",
            hours: [2, 2, 2, 2, 2, 3, 0],
            weak: [],
            createdAt: null,
            done: {},
            prog: {}
        };
    }

    function normSettings(s) {
        s = s || {};
        var hours = Array.isArray(s.hours) && s.hours.length === 7 ? s.hours.map(function (h) {
            h = Number(h) || 0;
            return Math.max(0, Math.min(12, Math.round(h * 2) / 2));
        }) : [2, 2, 2, 2, 2, 3, 0];
        return {
            v: 1,
            examDate: typeof s.examDate === "string" ? s.examDate : "",
            hours: hours,
            weak: Array.isArray(s.weak) ? s.weak.filter(function (x) { return typeof x === "string"; }) : [],
            createdAt: s.createdAt || null,
            done: s.done && typeof s.done === "object" ? s.done : {},
            prog: s.prog && typeof s.prog === "object" ? s.prog : {},
            seen: s.seen && typeof s.seen === "object" ? s.seen : null
        };
    }

    // ---------- görev havuzu ----------
    function taskId(kind, ders, konu, extra) { return kind + "|" + ders + "|" + konu + (extra ? "|" + extra : ""); }

    function learnTasks(kpssData, student, set) {
        var out = {};
        var learned = []; // { ders, konu, date } — tekrar planı için
        realKeys(kpssData).forEach(function (ders) {
            var list = [];
            realKeys(kpssData[ders]).forEach(function (konu) {
                var kd = kpssData[ders][konu] || {};
                var t = (student.topics && student.topics[ders] && student.topics[ders][konu]) || {};
                var nN = (kd.notlar || []).length;
                var nQ = (kd.sorular || []).length;
                var nid = taskId("not", ders, konu), tid = taskId("test", ders, konu);
                var notesDone = !!(t.notesDone || set.done[nid]);
                var testDone = !!((t.attempts || 0) > 0 || (t.completedPacks && t.completedPacks.length) || set.done[tid]);
                if (nN && !notesDone) {
                    var nm = Math.max(MIN_CHUNK, Math.round(nN * NOTE_MIN));
                    list.push({ id: nid, kind: "not", ders: ders, konu: konu, minutes: Math.max(10, nm - (set.prog[nid] || 0)), total: nm });
                }
                if (nQ && !testDone) {
                    var tm = Math.max(MIN_CHUNK, Math.round(Math.min(nQ, Q_CAP) * Q_MIN));
                    list.push({ id: tid, kind: "test", ders: ders, konu: konu, minutes: Math.max(10, tm - (set.prog[tid] || 0)), total: tm });
                }
                if ((!nN || notesDone) && (!nQ || testDone)) {
                    var dd = (set.done[tid] && set.done[tid].d) || (set.done[nid] && set.done[nid].d) || (t.updatedAt ? String(t.updatedAt).slice(0, 10) : null);
                    if (dd) learned.push({ ders: ders, konu: konu, date: dd });
                }
            });
            if (list.length) out[ders] = list;
        });
        return { queues: out, learned: learned };
    }

    // ---------- takvim üretimi ----------
    function generate(kpssData, student, rawSettings, fromIso, noNeed) {
        var set = normSettings(rawSettings);
        var today = fromIso || todayIso();
        var exam = set.examDate;
        if (!exam || exam <= today) return { ok: false, reason: "Sınav tarihi bugünden sonra olmalı." };
        var total = diffDays(today, exam); // sınav gününden önceki gün sayısı
        var weekMin = set.hours.reduce(function (a, h) { return a + h * 60; }, 0);
        if (weekMin <= 0) return { ok: false, reason: "Haftada en az bir gün çalışma saati seç." };

        var finalDays = Math.max(7, Math.min(42, Math.round(total * 0.15)));
        if (finalDays > total * 0.5) finalDays = Math.max(1, Math.floor(total * 0.5));
        var finalStart = addDays(exam, -finalDays);

        var pool = learnTasks(kpssData, student, set);
        var queues = pool.queues;
        var dersler = Object.keys(queues);
        var learnTotal = 0;
        dersler.forEach(function (d) { queues[d].forEach(function (t) { learnTotal += t.minutes; }); });

        // tekrar takvimi: daha önce öğrenilmiş konular
        var reviews = [];
        function addReviews(ders, konu, learnedIso) {
            REVIEW_GAPS.forEach(function (gap, i) {
                var rid = taskId("tekrar", ders, konu, String(i + 1));
                if (set.done[rid]) return;
                var due = addDays(learnedIso, gap);
                if (due >= exam) return;
                reviews.push({ id: rid, kind: "tekrar", ders: ders, konu: konu, minutes: REVIEW_MIN, due: due < today ? today : due, step: i + 1 });
            });
        }
        pool.learned.forEach(function (x) { addReviews(x.ders, x.konu, x.date); });

        var used = {}; // ders -> planlanan dakika (ağırlıklı dağıtım için)
        dersler.forEach(function (d) { used[d] = 0; });
        function pickDers(avoid, skip) {
            var best = null, bestScore = -1;
            dersler.forEach(function (d) {
                if (!queues[d].length || (skip && skip.indexOf(d) >= 0)) return;
                var sc = weightOf(d, set.weak) / (1 + used[d] / 60);
                if (avoid && avoid.indexOf(d) >= 0) sc *= 0.35;
                if (sc > bestScore) { bestScore = sc; best = d; }
            });
            return best;
        }
        function learnLeft() {
            var n = 0;
            dersler.forEach(function (d) { n += queues[d].length; });
            return n;
        }

        var doneTodayMin = 0;
        Object.keys(set.done).forEach(function (k) {
            var rec = set.done[k];
            if (rec && rec.d === today) doneTodayMin += rec.m || 0;
        });
        var days = [];
        var learnDoneOn = null;
        var finalIdx = 0;
        var weakRows = [];
        realKeys(kpssData).forEach(function (ders) {
            realKeys(kpssData[ders]).forEach(function (konu) {
                var t = (student.topics && student.topics[ders] && student.topics[ders][konu]) || {};
                if (t.lastPct != null && t.lastPct < 75) weakRows.push({ ders: ders, konu: konu, pct: t.lastPct });
            });
        });
        weakRows.sort(function (a, b) { return a.pct - b.pct; });
        var weakLast = {}; // konu -> en son planlandığı gün (aynı zayıf konu haftada en fazla bir kez)
        var allDers = realKeys(kpssData);
        var genUsed = {};
        allDers.forEach(function (d) { genUsed[d] = 0; });
        function pickWeak(iso) {
            for (var k = 0; k < weakRows.length; k++) {
                var key = weakRows[k].ders + "|" + weakRows[k].konu;
                if (!weakLast[key] || diffDays(weakLast[key], iso) >= 7) { weakLast[key] = iso; return weakRows[k]; }
            }
            return null;
        }
        function pickGenel(avoid) {
            var best = null, bestScore = -1;
            allDers.forEach(function (d) {
                var sc = weightOf(d, set.weak) / (1 + genUsed[d] / 60);
                if (avoid.indexOf(d) >= 0) sc *= 0.3;
                if (sc > bestScore) { bestScore = sc; best = d; }
            });
            return best;
        }

        for (var i = 0; i < total; i++) {
            var iso = addDays(today, i);
            var cap = set.hours[weekday(iso)] * 60;
            if (i === 0) cap = Math.max(0, cap - doneTodayMin); // bugün yapılanlar günün süresinden düşer
            var phase = iso >= finalStart ? "son" : (learnLeft() ? "ogrenme" : "pekistirme");
            var items = [];
            var left = cap;
            if (cap > 0) {
                // 1) zamanı gelen tekrarlar (günün en fazla %40'ı)
                var revCap = Math.round(cap * 0.4);
                reviews.sort(function (a, b) { return a.due < b.due ? -1 : 1; });
                for (var r = 0; r < reviews.length && revCap >= REVIEW_MIN && left >= REVIEW_MIN; r++) {
                    if (reviews[r].due > iso || reviews[r].placed) continue;
                    reviews[r].placed = true;
                    items.push(Object.assign({}, reviews[r]));
                    revCap -= REVIEW_MIN; left -= REVIEW_MIN;
                }
                if (phase === "son") {
                    // 2a) son dönem: her üç günden biri deneme, diğerleri genel tekrar
                    if (finalIdx % 3 === 0 && left >= 60) {
                        var dm = Math.min(DENEME_MIN, left);
                        items.push({ id: taskId("deneme", "", iso), kind: "deneme", ders: "", konu: "", minutes: dm });
                        left -= dm;
                    }
                    finalIdx++;
                }
                // 2b) öğrenme (son dönemde yetişmeyen konular da buraya düşer)
                var dayDers = [];
                var skipDers = [];
                while (left >= MIN_CHUNK && learnLeft() && items.length < Math.max(5, Math.ceil(cap / 40))) {
                    var d = pickDers(dayDers.length >= 2 ? dayDers : dayDers.slice(-1), skipDers);
                    if (!d) break;
                    var t = queues[d][0];
                    var take = Math.min(t.minutes, left, MAX_ITEM);
                    // geriye 10 dakikadan kısa kırıntı bırakma: ya hepsini al ya da kırıntıyı büyüt
                    var rem = t.minutes - take;
                    if (rem > 0 && rem < 10) {
                        if (t.minutes <= left) take = t.minutes;
                        else if (t.minutes - 10 >= MIN_CHUNK) take = t.minutes - 10;
                        else { skipDers.push(d); continue; } // bu ders bugün sığmıyor; başka derse bak
                    }
                    if (take < t.minutes && take < MIN_CHUNK) { skipDers.push(d); continue; }
                    var part = take < t.minutes;
                    items.push({ id: t.id, kind: t.kind, ders: d, konu: t.konu, minutes: take, part: part || t.minutes < t.total, total: t.total });
                    used[d] += take;
                    left -= take;
                    if (dayDers.indexOf(d) < 0) dayDers.push(d);
                    if (part) { t.minutes -= take; break; }
                    queues[d].shift();
                    if (t.kind === "test") addReviews(d, t.konu, iso);
                    if (!learnLeft()) learnDoneOn = iso;
                }
                // 3) boş kalan zaman: zayıf konu testi ya da ders bazlı genel tekrar
                var guard = 0;
                var fillDers = [];
                while (left >= MIN_CHUNK && guard++ < 4 && !learnLeft()) {
                    var fill = Math.min(left, 45);
                    var w = phase !== "son" ? pickWeak(iso) : null;
                    if (w) {
                        items.push({ id: taskId("zayif", w.ders, w.konu, iso), kind: "zayif", ders: w.ders, konu: w.konu, minutes: fill, pct: w.pct });
                    } else {
                        var rd = pickGenel(fillDers);
                        if (!rd) break;
                        genUsed[rd] += fill;
                        fillDers.push(rd);
                        items.push({ id: taskId("genel", rd, "", iso), kind: "genel", ders: rd, konu: "", minutes: fill });
                    }
                    left -= fill;
                }
            }
            days.push({ date: iso, weekday: weekday(iso), phase: phase, capacity: cap, items: items, minutes: cap - left });
        }

        var learnRemaining = 0;
        dersler.forEach(function (d) { queues[d].forEach(function (t) { learnRemaining += t.minutes; }); });
        var learnCapacity = 0;
        days.forEach(function (dd) { if (dd.date < finalStart) learnCapacity += dd.capacity; });
        // yetişmiyorsa: öğrenmenin son dönemden önce bitmesi için gereken haftalık süre
        var learnWeeks = Math.max(1, diffDays(today, finalStart) / 7);
        var lateLearn = 0; // son döneme taşan konu çalışması
        days.forEach(function (dd) {
            if (dd.date < finalStart) return;
            dd.items.forEach(function (x) { if (x.kind === "not" || x.kind === "test") lateLearn += x.minutes; });
        });
        var needWeekMin = Math.ceil((learnTotal / 0.8) / learnWeeks / 30) * 30;
        if (learnRemaining + lateLearn > 0 && !noNeed) {
            // tekrarlar da yer kapladığı için kaba tahmin yetmez: saatleri büyüterek yetişen ilk tempoyu bul
            var freeDays = set.hours.filter(function (h) { return h > 0; }).length || 7;
            for (var step = 1; step <= 24; step++) {
                var tryWeek = weekMin + step * 60;
                var per = Math.min(12, Math.ceil(tryWeek / freeDays / 30) / 2);
                var tryHours = set.hours.map(function (h) { return h > 0 || freeDays === 7 ? per : 0; });
                var trial = generate(kpssData, student, Object.assign({}, set, { hours: tryHours }), today, true);
                if (trial.ok && trial.fits) { needWeekMin = trial.weekMin; break; }
                if (per >= 12) break;
            }
            if (needWeekMin <= weekMin) needWeekMin = null; // saat artırmak yetmiyor: gün eklemek gerek
        }
        return {
            ok: true,
            settings: set,
            today: today,
            exam: exam,
            daysLeft: total,
            finalStart: finalStart,
            learnTotal: learnTotal,
            learnCapacity: learnCapacity,
            learnDoneOn: learnDoneOn,
            behindMin: learnRemaining + lateLearn,
            fits: learnRemaining + lateLearn === 0,
            weekMin: weekMin,
            needWeekMin: needWeekMin,
            days: days
        };
    }

    // ---------- tamamlama ----------
    function markDone(rawSettings, item, iso) {
        var set = normSettings(rawSettings);
        var done = Object.assign({}, set.done);
        var prog = Object.assign({}, set.prog);
        iso = iso || todayIso();
        if (item.part && (item.kind === "not" || item.kind === "test")) {
            prog[item.id] = (prog[item.id] || 0) + item.minutes;
            if (prog[item.id] >= (item.total || 0) - 5) {
                done[item.id] = { d: iso, k: item.kind, ders: item.ders, konu: item.konu, m: item.minutes };
                delete prog[item.id];
            } else {
                // yarım kalan parçayı bugünün işaretli listesinde göstermek için
                done[item.id + "#" + iso] = { d: iso, k: item.kind, ders: item.ders, konu: item.konu, m: item.minutes, part: true };
            }
        } else {
            done[item.id] = { d: iso, k: item.kind, ders: item.ders, konu: item.konu, m: item.minutes };
        }
        return Object.assign({}, set, { done: pruneDone(done, iso), prog: prog });
    }

    function unmarkDone(rawSettings, item, iso) {
        var set = normSettings(rawSettings);
        var done = Object.assign({}, set.done);
        var prog = Object.assign({}, set.prog);
        var key = done[item.id] ? item.id : item.id + "#" + (iso || todayIso());
        var rec = done[key];
        if (!rec) return set;
        delete done[key];
        if (rec.part) prog[item.id] = Math.max(0, (prog[item.id] || 0) - (rec.m || 0));
        return Object.assign({}, set, { done: done, prog: prog });
    }

    // Zamanı geçmiş günlük kayıtları (zayıf/genel/deneme ve yarım parçalar) temizle; liste şişmesin.
    function pruneDone(done, iso) {
        var limit = addDays(iso, -60);
        Object.keys(done).forEach(function (k) {
            var rec = done[k];
            var daily = /^(zayif|genel|deneme)\|/.test(k) || k.indexOf("#") > 0;
            if (daily && rec && rec.d && rec.d < limit) delete done[k];
        });
        return done;
    }

    function doneOn(rawSettings, iso) {
        var set = normSettings(rawSettings);
        var out = [];
        Object.keys(set.done).forEach(function (k) {
            var rec = set.done[k];
            if (rec && rec.d === iso) out.push({ id: k.split("#")[0], kind: rec.k, ders: rec.ders || "", konu: rec.konu || "", minutes: rec.m || 0, part: !!rec.part, done: true });
        });
        return out;
    }

    // Bugünün listesi: bugün tamamlananlar + planda kalanlar.
    function todayList(plan, rawSettings) {
        if (!plan || !plan.ok) return [];
        var doneToday = doneOn(rawSettings, plan.today);
        var ids = {};
        doneToday.forEach(function (x) { ids[x.id] = true; });
        var rest = (plan.days[0] && plan.days[0].date === plan.today ? plan.days[0].items : []).filter(function (x) { return !ids[x.id] || x.part; });
        return doneToday.concat(rest);
    }

    // Dün planlanıp yapılmayan görev sayısı (bir kez gösterilir). Yeni "seen" kaydını da döndürür.
    function missedSince(rawSettings, plan) {
        var set = normSettings(rawSettings);
        if (!plan || !plan.ok) return { missed: 0, seen: set.seen };
        var todayIds = ((plan.days[0] && plan.days[0].items) || []).map(function (x) { return x.id; });
        var seen = set.seen;
        var missed = 0;
        if (seen && seen.date && seen.date < plan.today && Array.isArray(seen.ids)) {
            seen.ids.forEach(function (id) { if (!set.done[id]) missed++; });
        }
        var next = { date: plan.today, ids: todayIds };
        return { missed: missed, seen: next, changed: !seen || seen.date !== plan.today };
    }

    function taskTitle(x) {
        switch (x.kind) {
            case "not": return "Konu notu";
            case "test": return "Konu testi";
            case "tekrar": return x.step ? "Tekrar " + x.step + "/3" : "Tekrar";
            case "zayif": return "Zayıf konu testi";
            case "genel": return "Genel tekrar";
            case "deneme": return "Deneme sınavı";
            default: return "Görev";
        }
    }

    // Eski haftalık ders programı alanını (istatistikler için) günlük saatlerle doldur.
    function legacyStudyPlan(set) {
        var ids = ["pzt", "sal", "car", "per", "cum", "cmt", "paz"];
        var days = {};
        ids.forEach(function (id, i) {
            var h = set.hours[i] || 0;
            days[id] = { on: h > 0, slots: h > 0 ? [{ ders: "KPSS", hours: h }] : [] };
        });
        return { ready: true, days: days, savedAt: new Date().toISOString() };
    }

    function shareText(plan, name) {
        if (!plan || !plan.ok) return "";
        var lines = [];
        lines.push((name ? name + " · " : "") + "KPSS programım (Atanly)");
        lines.push("Sınava " + plan.daysLeft + " gün · haftada " + fmtMin(plan.weekMin));
        lines.push("");
        plan.days.slice(0, 7).forEach(function (d) {
            var head = DAY_FULL[d.weekday] + " " + fmtDate(d.date);
            if (!d.items.length) { lines.push(head + ": dinlenme"); return; }
            lines.push(head + ":");
            d.items.forEach(function (x) {
                lines.push("  • " + taskTitle(x) + (x.ders ? " · " + x.ders : "") + (x.konu ? " / " + x.konu : "") + " (" + fmtMin(x.minutes) + ")");
            });
        });
        lines.push("");
        lines.push("Kendi programını oluştur: https://www.atanly.com");
        return lines.join("\n");
    }

    var api = {
        WEIGHTS: WEIGHTS,
        PHASES: PHASES,
        DAY_SHORT: DAY_SHORT,
        DAY_FULL: DAY_FULL,
        defaultSettings: defaultSettings,
        normSettings: normSettings,
        generate: generate,
        markDone: markDone,
        unmarkDone: unmarkDone,
        doneOn: doneOn,
        todayList: todayList,
        missedSince: missedSince,
        taskTitle: taskTitle,
        legacyStudyPlan: legacyStudyPlan,
        shareText: shareText,
        fmtMin: fmtMin,
        fmtDate: fmtDate,
        addDays: addDays,
        diffDays: diffDays,
        todayIso: todayIso
    };
export const SmartPlan = api;
