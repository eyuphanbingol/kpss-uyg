(function (global) {
    var KEY = "kpss-student-v1";
    var ACTIVE_KEY = "kpss-student-active";
    var INTERVALS = [1, 3, 7, 14, 30];
    var listeners = [];
    var SCHEMA_VERSION = 2;

    function nowIso() {
        return new Date().toISOString();
    }

    function cleanText(s, max) {
        return String(s == null ? "" : s)
            .replace(/<[^>]*>/g, "")
            .replace(/[\u0000-\u001f\u007f]/g, "")
            .trim()
            .slice(0, max || 80);
    }

    function todayStr(d) {
        var x = d ? new Date(d) : new Date();
        var y = x.getFullYear();
        var m = String(x.getMonth() + 1).padStart(2, "0");
        var day = String(x.getDate()).padStart(2, "0");
        return y + "-" + m + "-" + day;
    }

    function addDays(iso, n) {
        var d = new Date(iso + "T12:00:00");
        d.setDate(d.getDate() + n);
        return todayStr(d);
    }

    function defaultUserProfile() {
        return {
            educationLevel: "lisans",
            targetType: "B",
            nickname: "",
            role: "student",
            platform: (global.KpssConfig && global.KpssConfig.platform) || "web",
            kvkkConsent: false,
            kvkkAt: null,
            premium: false,
            premiumUntil: null,
            referralCode: "",
            referredBy: "",
            experiments: {},
            weeklyHours: 7,
            dailyHours: 0.75,
            studyPlan: null,
            planChecks: null,
            blocked: false,
            authUserId: null,
            email: "",
            deletionRequestedAt: null,
            location: null
        };
    }

    var WEEK_DAYS = [
        { id: "pzt", short: "Pzt", full: "Pazartesi" },
        { id: "sal", short: "Sal", full: "Salı" },
        { id: "car", short: "Çar", full: "Çarşamba" },
        { id: "per", short: "Per", full: "Perşembe" },
        { id: "cum", short: "Cum", full: "Cuma" },
        { id: "cmt", short: "Cmt", full: "Cumartesi" },
        { id: "paz", short: "Paz", full: "Pazar" }
    ];

    function defaultStudyPlan() {
        return {
            ready: false,
            days: {
                pzt: { on: true, slots: [] },
                sal: { on: true, slots: [] },
                car: { on: true, slots: [] },
                per: { on: true, slots: [] },
                cum: { on: true, slots: [] },
                cmt: { on: false, slots: [] },
                paz: { on: false, slots: [] }
            }
        };
    }

    function planDayId(d) {
        return ["paz", "pzt", "sal", "car", "per", "cum", "cmt"][(d || new Date()).getDay()];
    }

    function normalizeSlots(src, fallbackDersler) {
        if (Array.isArray(src.slots)) {
            return src.slots.map(function (s) {
                return {
                    ders: String((s && s.ders) || ""),
                    hours: Number(s && s.hours) > 0 ? Number(s.hours) : 1
                };
            }).filter(function (s) { return s.ders; });
        }
        var hours = Number(src.hours);
        var list = Array.isArray(fallbackDersler) ? fallbackDersler : [];
        if (src.on && list.length && hours > 0) {
            var each = Math.round((hours / list.length) * 2) / 2;
            if (!(each > 0)) each = 0.5;
            return list.map(function (ders) { return { ders: ders, hours: each }; });
        }
        return [];
    }

    function daySlotHours(day) {
        var sum = 0;
        ((day && day.slots) || []).forEach(function (s) { sum += Number(s.hours) || 0; });
        return Math.round(sum * 10) / 10;
    }

    function cloneStudyPlan(p) {
        var base = defaultStudyPlan();
        if (!p || typeof p !== "object") return base;
        var days = {};
        var oldDers = Array.isArray(p.dersler) ? p.dersler : [];
        WEEK_DAYS.forEach(function (w) {
            var src = (p.days && p.days[w.id]) || base.days[w.id];
            days[w.id] = {
                on: !!src.on,
                slots: normalizeSlots(src, oldDers)
            };
        });
        return { ready: !!p.ready, days: days, savedAt: p.savedAt || null };
    }

    function studyPlanWeekHours(plan) {
        var sum = 0;
        WEEK_DAYS.forEach(function (w) {
            var d = plan.days[w.id];
            if (d && d.on) sum += daySlotHours(d);
        });
        return Math.round(sum * 10) / 10;
    }

    function preferredDers(keys) {
        var prefer = ["Tarih", "Coğrafya", "Vatandaşlık", "Türkçe", "Güncel Bilgiler"];
        var out = [];
        prefer.forEach(function (n) { if ((keys || []).indexOf(n) >= 0) out.push(n); });
        (keys || []).forEach(function (k) { if (out.indexOf(k) < 0) out.push(k); });
        return out;
    }

    function slot(ders, hours) {
        return { ders: ders, hours: hours };
    }

    function applyPlanPreset(kind, dersKeys) {
        var d = preferredDers(dersKeys);
        var t = d[0] || "Tarih";
        var c = d[1] || d[0] || "Coğrafya";
        var v = d[2] || d[0] || "Vatandaşlık";
        var tr = d[3] || d[0] || "Türkçe";
        var g = d[4] || d[2] || d[0] || "Güncel Bilgiler";
        var plan = defaultStudyPlan();
        if (kind === "hafif") {
            plan.days = {
                pzt: { on: true, slots: [slot(t, 1.5)] },
                sal: { on: true, slots: [slot(c, 1.5)] },
                car: { on: true, slots: [slot(tr, 1)] },
                per: { on: true, slots: [slot(t, 1)] },
                cum: { on: true, slots: [slot(c, 1)] },
                cmt: { on: false, slots: [] },
                paz: { on: false, slots: [] }
            };
        } else if (kind === "haftasonu") {
            plan.days = {
                pzt: { on: false, slots: [] },
                sal: { on: false, slots: [] },
                car: { on: false, slots: [] },
                per: { on: false, slots: [] },
                cum: { on: false, slots: [] },
                cmt: { on: true, slots: [slot(t, 2), slot(c, 2)] },
                paz: { on: true, slots: [slot(v, 1), slot(tr, 1), slot(g, 1)] }
            };
        } else {
            plan.days = {
                pzt: { on: true, slots: [slot(t, 2), slot(c, 2)] },
                sal: { on: true, slots: [slot(v, 0.5), slot(g, 0.5), slot(t, 1.5), slot(c, 1.5)] },
                car: { on: true, slots: [slot(tr, 1), slot(v, 1), slot(g, 1)] },
                per: { on: true, slots: [slot(t, 1), slot(c, 1)] },
                cum: { on: true, slots: [slot(v, 0.5), slot(c, 1), slot(t, 1), slot(tr, 1), slot(g, 0.5)] },
                cmt: { on: true, slots: [slot(t, 2), slot(c, 1)] },
                paz: { on: false, slots: [] }
            };
        }
        return cloneStudyPlan(plan);
    }

    function planChecksToday() {
        var pc = state.userProfile && state.userProfile.planChecks;
        var d = todayStr();
        if (!pc || pc.date !== d || !isObj(pc.done)) return {};
        return pc.done;
    }

    function togglePlanSlot(ders) {
        if (!ders) return;
        var d = todayStr();
        var prev = planChecksToday();
        var next = Object.assign({}, prev);
        next[ders] = !next[ders];
        state.userProfile.planChecks = { date: d, done: next };
        emit();
    }

    function defaultState() {
        return {
            version: SCHEMA_VERSION,
            updatedAt: nowIso(),
            profile: {
                onboarded: false,
                name: "",
                examDate: "2026-09-06",
                dailyMinutes: 45,
                dailyQuestions: 25,
                dark: false,
                tabLeaveWarn: true
            },
            userProfile: defaultUserProfile(),
            streak: { lastDay: null, count: 0 },
            topics: {},
            answers: {},
            wrongBook: [],
            reviewBook: [],
            reviewNotebook: [],
            sessions: {},
            achievements: {},
            examAttempts: [],
            counters: {
                questions: 0,
                correct: 0,
                exams: 0,
                shareCards: 0
            },
            billing: { plan: "free", mockCustomerId: null },
            consent: { analytics: false, marketing: false, bannerSeen: false },
            usage: { day: null, mixed: 0 },
            games: defaultGames()
        };
    }

    function defaultGames() {
        return {
            conquer: {},
            conquerColor: "#127880",
            conquerAt: "",
            badges: {},
            panicBest: 0,
            tabuBest: 0,
            kodlamaBest: 0,
            tabuSeen: {},
            kodlamaSeen: {},
            tabuSeenResetAt: "",
            kodlamaSeenResetAt: ""
        };
    }

    function seenMap(x) {
        var out = {};
        if (!isObj(x)) return out;
        Object.keys(x).forEach(function (k) {
            if (x[k]) out[String(k)] = true;
        });
        return out;
    }

    function migrateGames(g) {
        var base = defaultGames();
        if (!isObj(g)) return base;
        var conquer = {};
        if (isObj(g.conquer)) {
            Object.keys(g.conquer).forEach(function (k) {
                if (g.conquer[k]) conquer[String(k).toUpperCase()] = true;
            });
        }
        return {
            conquer: conquer,
            conquerColor: typeof g.conquerColor === "string" && g.conquerColor ? g.conquerColor : base.conquerColor,
            conquerAt: typeof g.conquerAt === "string" ? g.conquerAt : "",
            badges: isObj(g.badges) ? g.badges : {},
            panicBest: Math.max(0, Number(g.panicBest) || 0),
            tabuBest: Math.max(0, Number(g.tabuBest) || 0),
            kodlamaBest: Math.max(0, Number(g.kodlamaBest) || 0),
            tabuSeen: seenMap(g.tabuSeen),
            kodlamaSeen: seenMap(g.kodlamaSeen),
            tabuSeenResetAt: typeof g.tabuSeenResetAt === "string" ? g.tabuSeenResetAt : "",
            kodlamaSeenResetAt: typeof g.kodlamaSeenResetAt === "string" ? g.kodlamaSeenResetAt : ""
        };
    }

    function notebookId() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    }

    function migrateNotebook(list) {
        if (!Array.isArray(list)) return [];
        var out = [];
        list.forEach(function (n) {
            if (!n || typeof n !== "object") return;
            var id = String(n.id || "").trim();
            if (!id) return;
            var title = String(n.title || "").trim().slice(0, 80);
            var body = String(n.body || "").trim().slice(0, 4000);
            if (!n.deleted && !body && !title) return;
            out.push({
                id: id,
                title: title,
                body: body,
                deleted: !!n.deleted,
                createdAt: n.createdAt || n.updatedAt || nowIso(),
                updatedAt: n.updatedAt || n.createdAt || nowIso()
            });
        });
        if (out.length > 80) {
            out.sort(function (a, b) { return String(b.updatedAt).localeCompare(String(a.updatedAt)); });
            out = out.slice(0, 80);
        }
        return out;
    }

    function clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    function isObj(x) {
        return x && typeof x === "object" && !Array.isArray(x);
    }

    function migrate(parsed) {
        var base = defaultState();
        if (!parsed || typeof parsed !== "object") return base;
        var profile = Object.assign({}, base.profile, parsed.profile || {});
        var userProfile = Object.assign({}, base.userProfile, parsed.userProfile || {});
        if (!userProfile.nickname && profile.name) {
            userProfile.nickname = String(profile.name).replace(/\s+/g, "").slice(0, 18) || "ogrenci";
        }
        if (!userProfile.role) userProfile.role = "student";
        if (!userProfile.platform) userProfile.platform = "web";
        if (!userProfile.educationLevel) userProfile.educationLevel = "lisans";
        userProfile.targetType = "B";
        if (!userProfile.experiments) userProfile.experiments = {};
        if (!userProfile.referralCode) userProfile.referralCode = "";
        if (userProfile.studyPlan && typeof userProfile.studyPlan !== "object") userProfile.studyPlan = null;
        var officialDates = (global.KpssConfig && global.KpssConfig.examDateByLevel) || {
            lisans: "2026-09-06", onlisans: "2026-10-04", ortaogretim: "2026-10-25"
        };
        var lv = userProfile.educationLevel || "lisans";
        var stale = { onlisans: "2026-09-20", ortaogretim: "2026-09-27" };
        if (officialDates[lv] && (profile.examDate === stale.onlisans || profile.examDate === stale.ortaogretim || !profile.examDate)) {
            profile.examDate = officialDates[lv];
        }
        var eduReq = userProfile.educationChangeRequest || parsed.educationChangeRequest;
        if (eduReq && typeof eduReq === "object") {
            if (eduReq.status === "approved" || (eduReq.status === "pending" && eduReq.to && eduReq.to === userProfile.educationLevel)) {
                delete userProfile.educationChangeRequest;
            } else {
                userProfile.educationChangeRequest = eduReq;
            }
        }
        var counters = Object.assign({}, base.counters, parsed.counters || {});
        if (!counters.questions) {
            Object.keys(parsed.sessions || {}).forEach(function (d) {
                counters.questions += (parsed.sessions[d].questions || 0);
                counters.correct += (parsed.sessions[d].correct || 0);
            });
        }
        var answers = isObj(parsed.answers) ? parsed.answers : {};
        var wrongBook = Array.isArray(parsed.wrongBook) ? parsed.wrongBook.filter(function (id) {
            var rec = answers[id];
            return !(rec && rec.lastCorrect);
        }) : [];
        return {
            version: SCHEMA_VERSION,
            updatedAt: parsed.updatedAt || nowIso(),
            profile: profile,
            userProfile: userProfile,
            streak: Object.assign({}, base.streak, parsed.streak || {}),
            topics: migrateTopicPacks(isObj(parsed.topics) ? parsed.topics : {}),
            answers: answers,
            wrongBook: wrongBook,
            reviewBook: Array.isArray(parsed.reviewBook) ? parsed.reviewBook.filter(Boolean) : [],
            reviewNotebook: migrateNotebook(parsed.reviewNotebook),
            sessions: isObj(parsed.sessions) ? parsed.sessions : {},
            achievements: isObj(parsed.achievements) ? parsed.achievements : {},
            examAttempts: Array.isArray(parsed.examAttempts) ? parsed.examAttempts : [],
            counters: counters,
            billing: Object.assign({}, base.billing, parsed.billing || {}),
            consent: Object.assign({}, base.consent, parsed.consent || {}),
            usage: Object.assign({}, base.usage, parsed.usage || {}),
            games: migrateGames(parsed.games)
        };
    }

    var state = defaultState();

    function storageKey(uid) {
        return KEY + ":" + uid;
    }

    function isEmptyProgress(s) {
        if (!s) return true;
        var q = s.counters && s.counters.questions;
        var topics = s.topics && Object.keys(s.topics).length;
        var sessions = s.sessions && Object.keys(s.sessions).length;
        var named = s.profile && s.profile.name;
        var onboarded = s.profile && s.profile.onboarded;
        var notes = s.reviewNotebook && s.reviewNotebook.length;
        var books = (s.wrongBook && s.wrongBook.length) || (s.reviewBook && s.reviewBook.length);
        return !q && !topics && !sessions && !named && !onboarded && !notes && !books;
    }

    function readKey(key) {
        try {
            var raw = localStorage.getItem(key);
            if (!raw) return null;
            return migrate(JSON.parse(raw));
        } catch (e) {
            return null;
        }
    }

    function adoptLegacy(uid, email) {
        var parsed = readKey(KEY);
        if (!parsed) return null;
        var owner = parsed.userProfile && parsed.userProfile.authUserId;
        var ownerEmail = (parsed.userProfile && parsed.userProfile.email) || "";
        if (owner && owner !== uid) return null;
        if (ownerEmail && email && ownerEmail.toLowerCase() !== String(email).toLowerCase()) return null;
        if (!owner && !ownerEmail) return null;
        if (owner === uid || (ownerEmail && email && ownerEmail.toLowerCase() === String(email).toLowerCase())) {
            return parsed;
        }
        return null;
    }

    function load() {
        try {
            var active = localStorage.getItem(ACTIVE_KEY);
            if (active) {
                var scoped = readKey(storageKey(active));
                if (scoped) {
                    state = scoped;
                    return state;
                }
            }
            state = defaultState();
        } catch (e) {
            state = defaultState();
        }
        return state;
    }

    function persistQuiet() {
        state.updatedAt = nowIso();
        var uid = state.userProfile && state.userProfile.authUserId;
        if (!uid) return;
        localStorage.setItem(storageKey(uid), JSON.stringify(state));
        localStorage.setItem(ACTIVE_KEY, uid);
    }

    function persist() {
        persistQuiet();
        listeners.forEach(function (fn) { fn(clone(state)); });
        if (global.SyncEngine && typeof global.SyncEngine.schedule === "function") {
            global.SyncEngine.schedule();
        }
    }

    function emit() {
        persist();
    }

    function qid(ders, konu, id) {
        return ders + "|" + konu + "|" + String(id);
    }

    function parseQid(id) {
        var p = String(id).split("|");
        return { ders: p[0], konu: p[1], id: p.slice(2).join("|") };
    }

    function masteryFromPct(pct) {
        if (pct == null || isNaN(pct)) return "yok";
        if (pct < 60) return "zayif";
        if (pct < 85) return "orta";
        return "iyi";
    }

    function topicMasteryScore(t) {
        t = t || {};
        var pct = t.lastPct == null ? 0 : t.lastPct;
        var notes = t.notesDone ? 18 : Math.min(12, (t.noteIndex || 0) * 2);
        var att = Math.min(12, (t.attempts || 0) * 3);
        var wrongBias = Math.max(-20, -((t.wrongWeight || 0) * 4));
        return Math.max(0, Math.min(100, Math.round(pct * 0.7 + notes + att + wrongBias)));
    }

    function ensureTopic(ders, konu) {
        if (!state.topics[ders]) state.topics[ders] = {};
        if (!state.topics[ders][konu]) {
            state.topics[ders][konu] = {
                noteIndex: 0,
                notesDone: false,
                lastPct: null,
                lastCorrect: 0,
                lastTotal: 0,
                attempts: 0,
                completedPacks: [],
                legacyAllPacks: false,
                mastery: "yok",
                masteryScore: 0,
                wrongWeight: 0,
                solvedCloze: [],
                updatedAt: nowIso()
            };
        }
        return state.topics[ders][konu];
    }

    function getTopic(ders, konu) {
        return (state.topics[ders] && state.topics[ders][konu]) || {
            noteIndex: 0,
            notesDone: false,
            lastPct: null,
            lastCorrect: 0,
            lastTotal: 0,
            attempts: 0,
            completedPacks: [],
            legacyAllPacks: false,
            mastery: "yok",
            masteryScore: 0,
            wrongWeight: 0,
            solvedCloze: []
        };
    }

    function solvedClozeOf(t) {
        var p = (t && t.solvedCloze) || [];
        if (!Array.isArray(p)) return [];
        var out = [];
        var seen = {};
        p.forEach(function (id) {
            id = String(id || "").slice(0, 160);
            if (!id || seen[id]) return;
            seen[id] = 1;
            out.push(id);
        });
        return out;
    }

    function completedPacksOf(t) {
        var p = (t && t.completedPacks) || [];
        if (!Array.isArray(p)) return [];
        return p.map(Number).filter(function (n) { return n > 0; });
    }

    function isPackComplete(t, no) {
        if (t && t.legacyAllPacks) return true;
        return completedPacksOf(t).indexOf(Number(no)) >= 0;
    }

    function isPackOpen(t, no) {
        no = Number(no) || 1;
        if (no <= 1) return true;
        return isPackComplete(t, no - 1);
    }

    function firstOpenPackIndex(t, packCount) {
        var i;
        var n = packCount || 0;
        for (i = 1; i <= n; i++) {
            if (!isPackComplete(t, i)) return i - 1;
        }
        return 0;
    }

    function migrateTopicPacks(topics) {
        Object.keys(topics || {}).forEach(function (ders) {
            Object.keys(topics[ders] || {}).forEach(function (konu) {
                var t = topics[ders][konu];
                if (!t || typeof t !== "object") return;
                if (!Array.isArray(t.completedPacks)) t.completedPacks = [];
                else t.completedPacks = completedPacksOf(t);
                if ((t.attempts || 0) > 0 && !t.completedPacks.length) t.legacyAllPacks = true;
                t.solvedCloze = solvedClozeOf(t);
            });
        });
        return topics;
    }

    function bumpStreak() {
        var t = todayStr();
        if (state.streak.lastDay === t) return;
        if (state.streak.lastDay && addDays(state.streak.lastDay, 1) === t) {
            state.streak.count = (state.streak.count || 0) + 1;
        } else {
            state.streak.count = 1;
        }
        state.streak.lastDay = t;
        checkAchievements();
    }

    function addSessionStats(patch) {
        var t = todayStr();
        if (!state.sessions[t]) state.sessions[t] = { questions: 0, correct: 0, minutes: 0 };
        var s = state.sessions[t];
        if (!s.byHour) s.byHour = {};
        if (!s.byDers) s.byDers = {};
        s.questions += patch.questions || 0;
        s.correct += patch.correct || 0;
        s.minutes += patch.minutes || 0;
        var mins = patch.minutes || 0;
        if (mins > 0) {
            var hour = patch.hour;
            if (hour == null || hour < 0 || hour > 23) hour = new Date().getHours();
            s.byHour[String(hour)] = (s.byHour[String(hour)] || 0) + mins;
            if (patch.ders) s.byDers[patch.ders] = (s.byDers[patch.ders] || 0) + mins;
        }
        if (patch.seans) {
            s.seansCount = (s.seansCount || 0) + 1;
            s.seansMinutes = (s.seansMinutes || 0) + mins;
        }
        state.counters.questions += patch.questions || 0;
        state.counters.correct += patch.correct || 0;
        bumpStreak();
        checkAchievements();
    }

    function recordAnswer(meta) {
        var id = qid(meta.ders, meta.konu, meta.id);
        if (!state.answers[id]) {
            state.answers[id] = {
                correctCount: 0,
                wrongCount: 0,
                lastCorrect: false,
                dueAt: todayStr(),
                intervalIndex: 0,
                updatedAt: nowIso()
            };
        }
        var rec = state.answers[id];
        var topic = ensureTopic(meta.ders, meta.konu);
        if (meta.correct) {
            rec.correctCount += 1;
            rec.lastCorrect = true;
            rec.intervalIndex = Math.min((rec.intervalIndex || 0) + 1, INTERVALS.length - 1);
            rec.dueAt = addDays(todayStr(), INTERVALS[rec.intervalIndex]);
            state.wrongBook = state.wrongBook.filter(function (x) { return x !== id; });
            topic.wrongWeight = Math.max(0, (topic.wrongWeight || 0) - 1);
        } else {
            rec.wrongCount += 1;
            rec.lastCorrect = false;
            rec.intervalIndex = 0;
            rec.dueAt = addDays(todayStr(), INTERVALS[0]);
            if (meta.fromWrongBook) {
                state.wrongBook = state.wrongBook.filter(function (x) { return x !== id; });
                topic.wrongWeight = Math.max(0, (topic.wrongWeight || 0) - 1);
            } else {
                if (state.wrongBook.indexOf(id) === -1) state.wrongBook.push(id);
                topic.wrongWeight = (topic.wrongWeight || 0) + 1;
            }
        }
        if (meta.fromReview && meta.correct) {
            state.reviewBook = (state.reviewBook || []).filter(function (x) { return x !== id; });
        }
        rec.updatedAt = nowIso();
        topic.masteryScore = topicMasteryScore(topic);
        topic.updatedAt = nowIso();
        return rec;
    }

    function recordTestResult(ders, konu, result) {
        var t = ensureTopic(ders, konu);
        var total = result.total || 0;
        var correct = result.correct || 0;
        var pct = total ? Math.round((correct / total) * 100) : 0;
        t.lastPct = pct;
        t.lastCorrect = correct;
        t.lastTotal = total;
        t.attempts = (t.attempts || 0) + 1;
        if (result.testNo) {
            var no = Number(result.testNo);
            t.completedPacks = completedPacksOf(t);
            if (no > 0 && t.completedPacks.indexOf(no) < 0) t.completedPacks.push(no);
            t.completedPacks.sort(function (a, b) { return a - b; });
        }
        t.mastery = masteryFromPct(pct);
        t.masteryScore = topicMasteryScore(t);
        t.updatedAt = nowIso();
        if (result.minutes) addSessionStats({ minutes: result.minutes, ders: ders, seans: true });
        emit();
        return t;
    }

    function checkAchievements() {
        var unlock = function (id, title) {
            if (state.achievements[id]) return;
            state.achievements[id] = { title: title, at: nowIso() };
        };
        if ((state.streak.count || 0) >= 7) unlock("streak7", "7 gün kesintisiz");
        if ((state.counters.questions || 0) >= 1000) unlock("q1000", "1000 soru");
        if ((state.counters.exams || 0) >= 1) unlock("firstExam", "İlk tam deneme");
        if ((state.streak.count || 0) >= 1) unlock("firstDay", "İlk çalışma günü");
    }

    function premiumOfferEnabled() {
        return !!(global.KpssConfig && global.KpssConfig.premiumEnabled);
    }

    function isPremium() {
        if (!premiumOfferEnabled()) return true;
        if (state.userProfile.role === "admin") return true;
        if (!state.userProfile.premium) return false;
        if (!state.userProfile.premiumUntil) return true;
        return new Date(state.userProfile.premiumUntil) > new Date();
    }

    function flagOn(key) {
        return !!(state.userProfile.experiments && state.userProfile.experiments[key]);
    }

    function ensureReferralCode() {
        if (state.userProfile.referralCode) return state.userProfile.referralCode;
        var uid = state.userProfile.authUserId || "";
        var nick = (state.userProfile.nickname || state.profile.name || "KPSS").replace(/[^a-zA-Z0-9]/g, "").slice(0, 6).toUpperCase() || "KPSS";
        var code = ("K" + nick + uid.replace(/-/g, "").slice(0, 4)).toUpperCase();
        state.userProfile.referralCode = code.slice(0, 16);
        return state.userProfile.referralCode;
    }

    function todayUsage() {
        var t = todayStr();
        if (!state.usage || state.usage.day !== t) state.usage = { day: t, mixed: 0 };
        return state.usage;
    }

    function canStartMixed() {
        if (isPremium()) return { ok: true };
        var cap = (global.KpssConfig && global.KpssConfig.freeDailyMixed) || 3;
        var u = todayUsage();
        if (u.mixed >= cap) return { ok: false, reason: "Ücretsiz günlük karışık deneme doldu (" + cap + "). Premium ile sınırsız." };
        return { ok: true };
    }

    function consumeMixed() {
        var gate = canStartMixed();
        if (!gate.ok) return gate;
        if (!isPremium()) {
            todayUsage().mixed += 1;
            persistQuiet();
        }
        return { ok: true };
    }

    load();

    global.StudentStore = {
        KEY: KEY,
        INTERVALS: INTERVALS,
        SCHEMA_VERSION: SCHEMA_VERSION,
        todayStr: todayStr,
        addDays: addDays,
        nowIso: nowIso,
        qid: qid,
        parseQid: parseQid,
        masteryFromPct: masteryFromPct,
        topicMasteryScore: topicMasteryScore,
        migrate: migrate,
        isPremium: isPremium,
        premiumOfferEnabled: premiumOfferEnabled,
        flagOn: flagOn,
        ensureReferralCode: ensureReferralCode,
        canStartMixed: canStartMixed,
        consumeMixed: consumeMixed,
        setConsent: function (patch) {
            state.consent = Object.assign({}, state.consent || {}, patch || {});
            persist();
        },
        grantMockPremium: function () {
            return false;
        },
        listReviewNotes: function () {
            return (state.reviewNotebook || []).filter(function (n) { return n && !n.deleted; })
                .sort(function (a, b) { return String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")); })
                .map(function (n) { return clone(n); });
        },
        upsertReviewNote: function (payload) {
            payload = payload || {};
            var title = String(payload.title || "").trim().slice(0, 80);
            var body = String(payload.body || "").trim().slice(0, 4000);
            if (!title && !body) return null;
            var id = String(payload.id || "").trim() || notebookId();
            var list = state.reviewNotebook || [];
            var found = false;
            var stamp = nowIso();
            list = list.map(function (n) {
                if (!n || n.id !== id) return n;
                found = true;
                return {
                    id: id,
                    title: title,
                    body: body,
                    deleted: false,
                    createdAt: n.createdAt || stamp,
                    updatedAt: stamp
                };
            });
            if (!found) {
                list.unshift({
                    id: id,
                    title: title,
                    body: body,
                    deleted: false,
                    createdAt: stamp,
                    updatedAt: stamp
                });
            }
            state.reviewNotebook = migrateNotebook(list);
            emit();
            return id;
        },
        deleteReviewNote: function (id) {
            id = String(id || "").trim();
            if (!id) return;
            var stamp = nowIso();
            var hit = false;
            state.reviewNotebook = (state.reviewNotebook || []).map(function (n) {
                if (!n || n.id !== id) return n;
                hit = true;
                return Object.assign({}, n, { deleted: true, updatedAt: stamp });
            });
            if (hit) emit();
        },
        getState: function () { return clone(state); },
        subscribe: function (fn) {
            listeners.push(fn);
            return function () {
                listeners = listeners.filter(function (x) { return x !== fn; });
            };
        },
        replaceState: function (next, opts) {
            state = migrate(next);
            if (opts && opts.quiet) persistQuiet();
            else emit();
        },
        isEmptyProgress: isEmptyProgress,
        topicTestPacks: function (items) {
            var size = 25;
            var list = items || [];
            var out = [];
            var i;
            for (i = 0; i < list.length; i += size) {
                out.push({ no: out.length + 1, items: list.slice(i, i + size) });
            }
            return out;
        },
        isPackComplete: isPackComplete,
        isPackOpen: isPackOpen,
        firstOpenPackIndex: firstOpenPackIndex,
        topicComplete: function (t, kd) {
            t = t || {};
            kd = kd || {};
            var qs = (kd.sorular || []).length;
            var ns = (kd.notlar || []).length;
            if (qs) {
                var packs = global.StudentStore.topicTestPacks(kd.sorular);
                if (!packs.length) return (t.attempts || 0) > 0;
                if (t.legacyAllPacks) return true;
                return packs.every(function (p) { return isPackComplete(t, p.no); });
            }
            if (ns) return !!t.notesDone;
            return !!t.notesDone || (t.attempts || 0) > 0;
        },
        isKonuOpen: function (ders, konular, idx, kpssData) {
            return true;
        },
        consumeSignupIfNeeded: function (user) {
            if (state.profile.onboarded) return;
            var pending = null;
            try {
                pending = JSON.parse(sessionStorage.getItem("kpss-signup-profile") || "null");
                sessionStorage.removeItem("kpss-signup-profile");
            } catch (e) { pending = null; }
            var m = (user && user.user_metadata) || {};
            var name = (pending && pending.name) ? String(pending.name).trim() : "";
            if (pending) {
                var dates = (global.KpssConfig && global.KpssConfig.examDateByLevel) || {};
                var level = pending.educationLevel || m.education_level || "lisans";
                global.StudentStore.completeOnboarding({
                    name: name,
                    nickname: name,
                    examDate: pending.examDate || m.exam_date || dates[level] || state.profile.examDate,
                    dailyMinutes: 45,
                    dailyQuestions: 25,
                    educationLevel: level,
                    targetType: pending.targetType || m.target_type || "B",
                    kvkkConsent: true,
                    weeklyHours: 7,
                    referredBy: pending.referredBy || ""
                });
                return;
            }
            if (name && !state.profile.name) {
                state.profile.name = String(name).trim();
                persistQuiet();
            }
        },
        bindToUser: function (uid, email) {
            var prev = state.userProfile && state.userProfile.authUserId;
            if (prev && prev === uid) {
                state.userProfile.email = email || state.userProfile.email || "";
                ensureReferralCode();
                persistQuiet();
                return state;
            }
            if (prev && prev !== uid) persistQuiet();
            if (!uid) {
                state = defaultState();
                try { localStorage.removeItem(ACTIVE_KEY); } catch (e) {}
                listeners.forEach(function (fn) { fn(clone(state)); });
                return state;
            }
            var scoped = readKey(storageKey(uid));
            if (!scoped) scoped = adoptLegacy(uid, email);
            if (scoped && scoped.userProfile && scoped.userProfile.authUserId && scoped.userProfile.authUserId !== uid) {
                scoped = null;
            }
            state = scoped ? scoped : defaultState();
            state.userProfile.authUserId = uid;
            state.userProfile.email = email || "";
            ensureReferralCode();
            persistQuiet();
            listeners.forEach(function (fn) { fn(clone(state)); });
            return state;
        },
        notify: function () {
            listeners.forEach(function (fn) { fn(clone(state)); });
        },
        completeOnboarding: function (p) {
            state.profile.onboarded = true;
            state.profile.name = cleanText(p.name, 60);
            state.profile.examDate = p.examDate || state.profile.examDate;
            state.profile.dailyMinutes = Number(p.dailyMinutes) || 45;
            state.profile.dailyQuestions = Number(p.dailyQuestions) || 25;
            Object.assign(state.userProfile, {
                educationLevel: p.educationLevel || state.userProfile.educationLevel,
                targetType: p.targetType || state.userProfile.targetType,
                nickname: cleanText(p.nickname || state.userProfile.nickname || state.profile.name || "ogrenci", 40),
                kvkkConsent: !!p.kvkkConsent,
                kvkkAt: p.kvkkConsent ? nowIso() : state.userProfile.kvkkAt,
                weeklyHours: Number(p.weeklyHours) || state.userProfile.weeklyHours,
                dailyHours: (Number(p.dailyMinutes) || state.profile.dailyMinutes) / 60,
                referredBy: p.referredBy || state.userProfile.referredBy || ""
            });
            ensureReferralCode();
            emit();
        },
        updateProfile: function (patch) {
            var p = Object.assign({}, patch || {});
            if (p.name != null) p.name = cleanText(p.name, 60);
            Object.assign(state.profile, p);
            emit();
        },
        updateUserProfile: function (patch) {
            var p = Object.assign({}, patch || {});
            delete p.educationLevel;
            delete p.role;
            delete p.premium;
            delete p.premiumUntil;
            delete p.blocked;
            delete p.authUserId;
            delete p.billing;
            if (p.nickname) p.nickname = cleanText(p.nickname, 40);
            if (p.referredBy) p.referredBy = cleanText(p.referredBy, 16);
            Object.assign(state.userProfile, p);
            emit();
        },
        applyServerFlags: function (flags) {
            flags = flags || {};
            state.userProfile.role = flags.role === "admin" ? "admin" : "student";
            if (typeof flags.premium === "boolean") state.userProfile.premium = flags.premium;
            if (typeof flags.blocked === "boolean") state.userProfile.blocked = flags.blocked;
            emit();
        },
        setEducationLevel: function (level) {
            var allowed = { lisans: 1, onlisans: 1, ortaogretim: 1 };
            if (!allowed[level]) return { ok: false };
            var dates = (global.KpssConfig && global.KpssConfig.examDateByLevel) || {
                lisans: "2026-09-06", onlisans: "2026-10-04", ortaogretim: "2026-10-25"
            };
            state.userProfile.educationLevel = level;
            if (dates[level]) state.profile.examDate = dates[level];
            emit();
            return { ok: true };
        },
        requestEducationChange: function (to) {
            var allowed = { lisans: 1, onlisans: 1, ortaogretim: 1 };
            if (!allowed[to]) return { ok: false };
            var cur = state.userProfile.educationLevel || "lisans";
            if (to === cur) return { ok: false, reason: "same" };
            state.userProfile.educationChangeRequest = {
                from: cur,
                to: to,
                at: nowIso(),
                status: "pending"
            };
            emit();
            return { ok: true };
        },
        WEEK_DAYS: WEEK_DAYS,
        defaultStudyPlan: defaultStudyPlan,
        cloneStudyPlan: cloneStudyPlan,
        planDayId: planDayId,
        studyPlanWeekHours: studyPlanWeekHours,
        daySlotHours: daySlotHours,
        applyPlanPreset: applyPlanPreset,
        planChecksToday: planChecksToday,
        togglePlanSlot: togglePlanSlot,
        saveStudyPlan: function (plan) {
            var next = cloneStudyPlan(plan);
            next.ready = true;
            next.savedAt = nowIso();
            state.userProfile.studyPlan = next;
            state.userProfile.weeklyHours = studyPlanWeekHours(next);
            var today = next.days[planDayId()];
            if (today && today.on) state.userProfile.dailyHours = daySlotHours(today);
            emit();
        },
        setDark: function (isDark) {
            state.profile.dark = !!isDark;
            emit();
        },
        getTopic: getTopic,
        solvedClozeIds: function (ders, konu) {
            return solvedClozeOf(getTopic(ders, konu));
        },
        markClozeSolved: function (ders, konu, id) {
            id = String(id || "").slice(0, 160);
            if (!ders || !konu || !id) return;
            var t = ensureTopic(ders, konu);
            t.solvedCloze = solvedClozeOf(t);
            if (t.solvedCloze.indexOf(id) >= 0) return;
            t.solvedCloze.push(id);
            t.updatedAt = nowIso();
            emit();
        },
        resetCloze: function (ders, konu) {
            if (!ders || !konu) return;
            var t = ensureTopic(ders, konu);
            t.solvedCloze = [];
            t.updatedAt = nowIso();
            emit();
        },
        setNoteIndex: function (ders, konu, index, total) {
            var t = ensureTopic(ders, konu);
            t.noteIndex = index;
            if (total > 0 && index >= total - 1) t.notesDone = true;
            t.masteryScore = topicMasteryScore(t);
            t.updatedAt = nowIso();
            emit();
        },
        markNotesComplete: function (ders, konu) {
            var t = ensureTopic(ders, konu);
            t.notesDone = true;
            t.masteryScore = topicMasteryScore(t);
            t.updatedAt = nowIso();
            emit();
        },
        recordAnswer: function (meta) {
            var rec = recordAnswer(meta);
            emit();
            return rec;
        },
        inReviewBook: function (ders, konu, id) {
            return (state.reviewBook || []).indexOf(qid(ders, konu, id)) >= 0;
        },
        toggleReviewBook: function (ders, konu, id) {
            var key = qid(ders, konu, id);
            if (!state.reviewBook) state.reviewBook = [];
            var i = state.reviewBook.indexOf(key);
            if (i >= 0) state.reviewBook.splice(i, 1);
            else state.reviewBook.push(key);
            emit();
            return i < 0;
        },
        recordTestResult: recordTestResult,
        recordExamAttempt: function (attempt) {
            state.examAttempts.push(Object.assign({ at: nowIso() }, attempt));
            state.counters.exams += 1;
            checkAchievements();
            emit();
        },
        bumpStreak: function () {
            bumpStreak();
            emit();
        },
        addSessionStats: function (patch) {
            addSessionStats(patch);
            emit();
        },
        grantAchievement: function (id, title) {
            if (!state.achievements[id]) {
                state.achievements[id] = { title: title, at: nowIso() };
                emit();
            }
        },
        setConquerColor: function (color) {
            if (!state.games) state.games = defaultGames();
            state.games.conquerColor = String(color || "#127880");
            emit();
        },
        resetConquer: function () {
            if (!state.games) state.games = defaultGames();
            state.games.conquer = {};
            state.games.badges = {};
            state.games.conquerAt = nowIso();
            emit();
        },
        conquerProvince: function (code) {
            if (!state.games) state.games = defaultGames();
            code = String(code || "").toUpperCase();
            if (!code) return [];
            state.games.conquer[code] = true;
            state.games.conquerAt = nowIso();
            var fresh = [];
            if (global.GamesEngine && global.GamesEngine.freshBadges) {
                fresh = global.GamesEngine.freshBadges(state.games.conquer, state.games.badges);
                fresh.forEach(function (b) {
                    state.games.badges[b.id] = nowIso();
                    if (!state.achievements["fetih-" + b.id]) {
                        state.achievements["fetih-" + b.id] = { title: b.title, at: nowIso() };
                    }
                });
            }
            emit();
            return fresh;
        },
        noteTabuBest: function (n) {
            if (!state.games) state.games = defaultGames();
            n = Math.max(0, Number(n) || 0);
            if (n > state.games.tabuBest) {
                state.games.tabuBest = n;
                emit();
            }
        },
        notePanicBest: function (n) {
            if (!state.games) state.games = defaultGames();
            n = Math.max(0, Number(n) || 0);
            if (n > state.games.panicBest) {
                state.games.panicBest = n;
                emit();
            }
        },
        noteKodlamaBest: function (n) {
            if (!state.games) state.games = defaultGames();
            n = Math.max(0, Number(n) || 0);
            var cur = Number(state.games.kodlamaBest) || 0;
            if (cur >= 80) cur = 0;
            if (n > cur) {
                state.games.kodlamaBest = n;
                emit();
            }
        },
        markGameSeen: function (kind, id) {
            if (!state.games) state.games = defaultGames();
            var key = kind === "kodlama" ? "kodlamaSeen" : "tabuSeen";
            if (!isObj(state.games[key])) state.games[key] = {};
            id = String(id || "");
            if (!id || state.games[key][id]) return;
            state.games[key][id] = true;
            emit();
        },
        resetGameSeen: function (kind) {
            if (!state.games) state.games = defaultGames();
            var key = kind === "kodlama" ? "kodlamaSeen" : "tabuSeen";
            var atKey = kind === "kodlama" ? "kodlamaSeenResetAt" : "tabuSeenResetAt";
            state.games[key] = {};
            state.games[atKey] = nowIso();
            emit();
        },
        bumpShare: function () {
            state.counters.shareCards += 1;
            emit();
        },
        reset: function () {
            state = defaultState();
            emit();
        },
        requestDeletion: function () {
            state.userProfile.deletionRequestedAt = nowIso();
            emit();
            return state.userProfile.deletionRequestedAt;
        }
    };
})(window);
