(function (global) {
    var timer = null;
    var syncing = false;

    function maxIso(a, b) {
        if (!a) return b;
        if (!b) return a;
        return a > b ? a : b;
    }

    function mergeCounters(localC, remoteC) {
        localC = localC || {};
        remoteC = remoteC || {};
        return {
            questions: Math.max(localC.questions || 0, remoteC.questions || 0),
            correct: Math.max(localC.correct || 0, remoteC.correct || 0),
            exams: Math.max(localC.exams || 0, remoteC.exams || 0),
            shareCards: Math.max(localC.shareCards || 0, remoteC.shareCards || 0)
        };
    }

    function mergeSessions(a, b) {
        var out = Object.assign({}, b || {}, a || {});
        Object.keys(out).forEach(function (day) {
            var L = (a && a[day]) || {};
            var R = (b && b[day]) || {};
            out[day] = {
                questions: Math.max(L.questions || 0, R.questions || 0),
                correct: Math.max(L.correct || 0, R.correct || 0),
                minutes: Math.max(L.minutes || 0, R.minutes || 0)
            };
        });
        return out;
    }

    function mergeAnswers(a, b) {
        var out = Object.assign({}, b || {});
        Object.keys(a || {}).forEach(function (id) {
            var L = a[id];
            var R = out[id];
            if (!R) { out[id] = L; return; }
            var newer = (L.updatedAt || "") >= (R.updatedAt || "") ? L : R;
            out[id] = Object.assign({}, newer, {
                correctCount: Math.max(L.correctCount || 0, R.correctCount || 0),
                wrongCount: Math.max(L.wrongCount || 0, R.wrongCount || 0)
            });
        });
        return out;
    }

    function mergeTopics(a, b) {
        var out = JSON.parse(JSON.stringify(b || {}));
        Object.keys(a || {}).forEach(function (ders) {
            if (!out[ders]) out[ders] = {};
            Object.keys(a[ders] || {}).forEach(function (konu) {
                var L = a[ders][konu];
                var R = out[ders][konu];
                if (!R) { out[ders][konu] = L; return; }
                var pick = (L.updatedAt || "") >= (R.updatedAt || "") ? L : R;
                pick.attempts = Math.max(L.attempts || 0, R.attempts || 0);
                out[ders][konu] = pick;
            });
        });
        return out;
    }

    function mergePayload(local, remote) {
        if (!remote) return local;
        var localNewer = (local.updatedAt || "") >= (remote.updatedAt || "");
        var settingsSrc = localNewer ? local : remote;
        return global.StudentStore.migrate({
            version: Math.max(local.version || 1, remote.version || 1),
            updatedAt: maxIso(local.updatedAt, remote.updatedAt),
            profile: Object.assign({}, remote.profile || {}, localNewer ? (local.profile || {}) : {}, localNewer ? local.profile : remote.profile),
            userProfile: Object.assign({}, remote.userProfile || {}, settingsSrc.userProfile || {}),
            streak: (local.streak && remote.streak)
                ? ((local.streak.count || 0) >= (remote.streak.count || 0) ? local.streak : remote.streak)
                : (local.streak || remote.streak),
            topics: mergeTopics(local.topics, remote.topics),
            answers: mergeAnswers(local.answers, remote.answers),
            wrongBook: (function () {
                var set = {};
                (local.wrongBook || []).concat(remote.wrongBook || []).forEach(function (id) { set[id] = true; });
                return Object.keys(set);
            })(),
            sessions: mergeSessions(local.sessions, remote.sessions),
            achievements: Object.assign({}, remote.achievements || {}, local.achievements || {}),
            examAttempts: (local.examAttempts || []).concat(remote.examAttempts || []).slice(-40),
            counters: mergeCounters(local.counters, remote.counters),
            billing: settingsSrc.billing || local.billing,
            consent: Object.assign({}, remote.consent || {}, local.consent || {})
        });
    }

    async function pullPush() {
        var sb = global.SupabaseClient && global.SupabaseClient.get();
        if (!sb || syncing) return { ok: false, reason: "offline-or-busy" };
        var sessionRes = await sb.auth.getSession();
        var session = sessionRes && sessionRes.data && sessionRes.data.session;
        if (!session) return { ok: false, reason: "anon" };
        syncing = true;
        try {
            var uid = session.user.id;
            var email = session.user.email || "";
            if (global.StudentStore.bindToUser) global.StudentStore.bindToUser(uid, email);
            var local = global.StudentStore.getState();
            if (local.userProfile && local.userProfile.authUserId && local.userProfile.authUserId !== uid) {
                local = global.StudentStore.migrate(null);
            }
            var remoteRow = await sb.from("student_states").select("*").eq("user_id", uid).maybeSingle();
            var remote = remoteRow.data && remoteRow.data.payload;
            var dbRole = remoteRow.data && remoteRow.data.role;
            var remoteOwner = remote && remote.userProfile && remote.userProfile.authUserId;
            if (remoteOwner && remoteOwner !== uid) remote = null;
            var createdAt = session.user.created_at ? new Date(session.user.created_at).getTime() : 0;
            var newAccount = createdAt && (Date.now() - createdAt) < 15 * 60 * 1000;
            var emptyLocal = global.StudentStore.isEmptyProgress(local);
            if (newAccount && emptyLocal && remote && !global.StudentStore.isEmptyProgress(remote)) {
                remote = null;
            }
            var merged;
            if (emptyLocal && remote) {
                merged = global.StudentStore.migrate(remote);
            } else if (!remote) {
                merged = local;
            } else {
                merged = mergePayload(local, remote);
            }
            merged.userProfile.authUserId = uid;
            merged.userProfile.email = session.user.email || merged.userProfile.email;
            if (dbRole === "admin" || merged.userProfile.role === "admin") {
                merged.userProfile.role = "admin";
            }
            merged.updatedAt = global.StudentStore.nowIso();
            global.StudentStore.replaceState(merged, { quiet: true });
            var nick = merged.userProfile.nickname || "ogrenci";
            var row = {
                user_id: uid,
                payload: merged,
                updated_at: merged.updatedAt,
                nickname: nick,
                education_level: merged.userProfile.educationLevel,
                target_type: merged.userProfile.targetType,
                platform: merged.userProfile.platform || "web",
                premium: !!merged.userProfile.premium,
                last_study_at: merged.streak.lastDay,
                questions_total: merged.counters.questions || 0
            };
            if (merged.userProfile.role === "admin") row.role = "admin";
            await sb.from("student_states").upsert(row);
            if (global.StudentStore.notify) global.StudentStore.notify();
            var today = global.StudentStore.todayStr();
            var sess = merged.sessions[today] || { questions: 0 };
            if (sess.questions) {
                await sb.from("leaderboard_weekly").upsert({
                    user_id: uid,
                    week_start: weekStart(),
                    nickname: nick,
                    questions: sess.questions,
                    updated_at: merged.updatedAt
                }, { onConflict: "user_id,week_start" });
            }
            return { ok: true };
        } catch (e) {
            return { ok: false, reason: String(e && e.message || e) };
        } finally {
            syncing = false;
        }
    }

    function weekStart() {
        var d = new Date();
        var day = d.getDay();
        var diff = d.getDate() - day + (day === 0 ? -6 : 1);
        var x = new Date(d.setDate(diff));
        return global.StudentStore.todayStr(x);
    }

    function schedule() {
        if (timer) clearTimeout(timer);
        timer = setTimeout(function () { pullPush(); }, 1200);
    }

    global.addEventListener("online", function () { pullPush(); });

    global.SyncEngine = {
        mergePayload: mergePayload,
        sync: pullPush,
        schedule: schedule,
        weekStart: weekStart
    };
})(window);
