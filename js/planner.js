(function (global) {
    function flattenQuestions(kpssData) {
        var out = [];
        Object.keys(kpssData || {}).forEach(function (ders) {
            Object.keys(kpssData[ders] || {}).forEach(function (konu) {
                var sorular = ((kpssData[ders][konu] || {}).sorular) || [];
                sorular.forEach(function (q, idx) {
                    var id = q.id != null ? q.id : idx;
                    out.push({
                        ders: ders,
                        konu: konu,
                        q: q,
                        id: id,
                        qid: global.StudentStore.qid(ders, konu, id)
                    });
                });
            });
        });
        return out;
    }

    function catalogStats(kpssData) {
        var dersler = {};
        Object.keys(kpssData || {}).forEach(function (ders) {
            var konular = Object.keys(kpssData[ders] || {});
            var soru = 0;
            var not = 0;
            konular.forEach(function (k) {
                var kd = kpssData[ders][k] || {};
                soru += (kd.sorular || []).length;
                not += (kd.notlar || []).length;
            });
            dersler[ders] = { konuSayisi: konular.length, soruSayisi: soru, notSayisi: not };
        });
        return dersler;
    }

    function topicRows(kpssData, student) {
        var rows = [];
        Object.keys(kpssData || {}).forEach(function (ders) {
            Object.keys(kpssData[ders] || {}).forEach(function (konu) {
                var kd = kpssData[ders][konu] || {};
                var t = (student.topics[ders] && student.topics[ders][konu]) || {};
                rows.push({
                    ders: ders,
                    konu: konu,
                    soruSayisi: (kd.sorular || []).length,
                    notSayisi: (kd.notlar || []).length,
                    noteIndex: t.noteIndex || 0,
                    notesDone: !!t.notesDone,
                    lastPct: t.lastPct == null ? null : t.lastPct,
                    attempts: t.attempts || 0,
                    mastery: t.mastery || "yok",
                    masteryScore: t.masteryScore != null ? t.masteryScore : (global.StudentStore.topicMasteryScore ? global.StudentStore.topicMasteryScore(t) : 0),
                    wrongWeight: t.wrongWeight || 0
                });
            });
        });
        return rows;
    }

    function daysUntilExam(examDate) {
        if (!examDate) return null;
        var a = new Date(global.StudentStore.todayStr() + "T12:00:00");
        var b = new Date(examDate + "T12:00:00");
        return Math.ceil((b - a) / 86400000);
    }

    function weakestTopics(rows, n) {
        var scored = rows.filter(function (r) { return r.soruSayisi > 0; }).slice();
        scored.sort(function (a, b) {
            var sa = a.masteryScore != null ? a.masteryScore : (a.lastPct == null ? -1 : a.lastPct);
            var sb = b.masteryScore != null ? b.masteryScore : (b.lastPct == null ? -1 : b.lastPct);
            if (sa !== sb) return sa - sb;
            var pa = a.lastPct == null ? -1 : a.lastPct;
            var pb = b.lastPct == null ? -1 : b.lastPct;
            if (pa !== pb) return pa - pb;
            if (!!a.notesDone !== !!b.notesDone) return a.notesDone ? 1 : -1;
            return 0;
        });
        return scored.slice(0, n || 5);
    }

    function dueItems(kpssData, student) {
        var map = {};
        flattenQuestions(kpssData).forEach(function (item) { map[item.qid] = item; });
        var today = global.StudentStore.todayStr();
        var due = [];
        Object.keys(student.answers || {}).forEach(function (id) {
            var rec = student.answers[id];
            if (rec.dueAt && rec.dueAt <= today && map[id]) due.push(map[id]);
        });
        return due;
    }

    function wrongItems(kpssData, student) {
        var map = {};
        flattenQuestions(kpssData).forEach(function (item) { map[item.qid] = item; });
        return (student.wrongBook || []).map(function (id) { return map[id]; }).filter(Boolean);
    }

    function todaySession(student) {
        var t = global.StudentStore.todayStr();
        return student.sessions[t] || { questions: 0, correct: 0, minutes: 0 };
    }

    function buildPlan(kpssData, student) {
        var rows = topicRows(kpssData, student);
        var weak = weakestTopics(rows, 8);
        var due = dueItems(kpssData, student);
        var wrong = wrongItems(kpssData, student);
        var sess = todaySession(student);
        var tasks = [];

        var unread = rows.filter(function (r) { return r.notSayisi > 0 && !r.notesDone; });
        unread.sort(function (a, b) {
            var pa = a.lastPct == null ? -1 : a.lastPct;
            var pb = b.lastPct == null ? -1 : b.lastPct;
            return pa - pb;
        });
        if (unread[0]) {
            tasks.push({
                id: "notes",
                kind: "notes",
                title: "Konu notu",
                detail: unread[0].ders + " · " + unread[0].konu,
                ders: unread[0].ders,
                konu: unread[0].konu,
                why: "Notları bitirmeden soru çözmek ezberi güçlendirir, anlamayı değil."
            });
        }

        var testTarget = weak.find(function (r) { return r.soruSayisi > 0 && (r.lastPct == null || r.lastPct < 85); });
        if (testTarget) {
            tasks.push({
                id: "test",
                kind: "test",
                title: testTarget.lastPct == null ? "İlk test" : "Zayıf konu testi",
                detail: testTarget.ders + " · " + testTarget.konu + (testTarget.lastPct != null ? " (%" + testTarget.lastPct + ")" : ""),
                ders: testTarget.ders,
                konu: testTarget.konu,
                why: testTarget.lastPct == null ? "Bu konuda henüz deneme yok." : "Net %" + testTarget.lastPct + " — eşiğin altında."
            });
        }

        if (due.length) {
            tasks.push({
                id: "review",
                kind: "review",
                title: "Aralıklı tekrar",
                detail: due.length + " sorunun vadesi geldi",
                count: due.length,
                why: "Unutma eğrisine karşı bugün hatırlamak, yarın yeniden öğrenmekten ucuz."
            });
        }

        if (wrong.length) {
            tasks.push({
                id: "wrong",
                kind: "wrong",
                title: "Yanlış defteri",
                detail: wrong.length + " soru bekliyor",
                count: wrong.length,
                why: "KPSS’te aynı tuzak tekrar çıkar. Yanlışı kapatmadan yeni konu açma."
            });
        }

        var qGoal = student.profile.dailyQuestions || 25;
        var remaining = Math.max(0, qGoal - (sess.questions || 0));
        var coach;
        if (weak[0] && weak[0].lastPct != null && weak[0].lastPct < 60) {
            coach = weak[0].ders + " / " + weak[0].konu + " %" + weak[0].lastPct + ". Önce not, sonra 10 soru. Dağılma.";
        } else if (unread[0]) {
            coach = "Sıradaki konu: " + unread[0].konu + ". Notu bitir, aynı gün test çöz.";
        } else if (wrong.length) {
            coach = "Yanlış defterinde " + wrong.length + " soru var. Bugün onları temizle, yeni konu açma.";
        } else if (remaining > 0) {
            coach = "Tempo iyi. Hedefe " + remaining + " soru kaldı — karışık pratikle kapat.";
        } else {
            coach = "Günlük soru hedefi doldu. Kısa tekrar yeter; yarın zayıf konuya dön.";
        }

        var daysLeft = daysUntilExam(student.profile.examDate);
        var weekly = buildWeeklyCalendar(student, weak, daysLeft);
        return {
            rows: rows,
            weak: weak,
            due: due,
            wrong: wrong,
            session: sess,
            tasks: tasks,
            remaining: remaining,
            qGoal: qGoal,
            coach: coach,
            daysLeft: daysLeft,
            streak: student.streak.count || 0,
            weekly: weekly,
            targetType: (student.userProfile && student.userProfile.targetType) || "B"
        };
    }

    function buildWeeklyCalendar(student, weak, daysLeft) {
        var weeklyH = (student.userProfile && student.userProfile.weeklyHours) || 7;
        var hours = (student.userProfile && student.userProfile.dailyHours) || (weeklyH / 7) || ((student.profile.dailyMinutes || 45) / 60);
        var days = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
        var urgency = daysLeft != null && daysLeft < 30 ? 1.4 : daysLeft != null && daysLeft < 90 ? 1.15 : 1;
        return days.map(function (d, i) {
            var focus = weak[i % Math.max(1, weak.length)] || null;
            var mins = Math.round(hours * 60 * urgency * (i >= 5 ? 0.7 : 1));
            return {
                day: d,
                minutes: mins,
                focus: focus ? (focus.ders + " · " + focus.konu) : "GY-GK karışık",
                weight: focus ? Math.round(100 - (focus.masteryScore || 0)) : 40
            };
        });
    }

    function shuffle(arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = a[i];
            a[i] = a[j];
            a[j] = tmp;
        }
        return a;
    }

    function mixedQuiz(kpssData, dersler, n) {
        var all = flattenQuestions(kpssData);
        if (dersler && dersler.length) {
            var set = {};
            dersler.forEach(function (d) { set[d] = true; });
            all = all.filter(function (x) { return set[x.ders]; });
        }
        return shuffle(all).slice(0, n);
    }

    function breakdownByTopic(answeredItems) {
        var map = {};
        answeredItems.forEach(function (it) {
            var key = it.ders + " · " + it.konu;
            if (!map[key]) map[key] = { ders: it.ders, konu: it.konu, correct: 0, total: 0 };
            map[key].total += 1;
            if (it.ok) map[key].correct += 1;
        });
        return Object.keys(map).map(function (k) {
            var r = map[k];
            r.pct = Math.round((r.correct / r.total) * 100);
            return r;
        }).sort(function (a, b) { return a.pct - b.pct; });
    }

    global.StudyPlanner = {
        flattenQuestions: flattenQuestions,
        catalogStats: catalogStats,
        topicRows: topicRows,
        weakestTopics: weakestTopics,
        dueItems: dueItems,
        wrongItems: wrongItems,
        todaySession: todaySession,
        buildPlan: buildPlan,
        mixedQuiz: mixedQuiz,
        shuffle: shuffle,
        breakdownByTopic: breakdownByTopic,
        daysUntilExam: daysUntilExam,
        buildWeeklyCalendar: buildWeeklyCalendar
    };
})(window);
