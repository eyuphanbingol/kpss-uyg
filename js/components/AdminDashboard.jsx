(function () {
    const { useEffect, useState, useMemo, useCallback, useRef } = React;

    // ============================================================
    // Yönetim paneli. Veriler önce veritabanı fonksiyonlarından (supabase/patch-admin-panel.sql)
    // okunur; o yama henüz kurulmamışsa "admin-action" sunucu fonksiyonuna düşülür ve panelin
    // üstünde kurulum uyarısı çıkar. Hiçbir hata sessizce yutulmaz.
    // ============================================================

    var LEVELS = [
        { id: "lisans", t: "Lisans" },
        { id: "onlisans", t: "Ön lisans" },
        { id: "ortaogretim", t: "Ortaöğretim" }
    ];
    var ACTION_LABELS = {
        grant_premium: "Premium verildi", revoke_premium: "Premium kaldırıldı", block: "Engellendi", unblock: "Engel kaldırıldı",
        delete_user: "Kullanıcı silindi", approve_edu: "Eğitim talebi onaylandı", reject_edu: "Eğitim talebi reddedildi",
        announce: "Duyuru yayınlandı", delete_announce: "Duyuru silindi", submit_edu: "Eğitim talebi gönderildi",
        delete_my_account: "Hesabını sildi", inspect_user: "Kullanıcı incelendi", user_list: "Liste açıldı",
        list_edu_requests: "Talepler açıldı", list_announcements: "Duyurular açıldı"
    };

    function num(n) { return (Number(n) || 0).toLocaleString("tr-TR"); }
    function toDate(x) { if (!x) return null; var d = new Date(String(x).length === 10 ? x + "T12:00:00" : x); return isNaN(d.getTime()) ? null : d; }
    function fmtDate(x) { var d = toDate(x); return d ? d.toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" }) : "—"; }
    function fmtDateTime(x) {
        var d = toDate(x);
        return d ? d.toLocaleDateString("tr-TR", { day: "numeric", month: "short" }) + " " + d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) : "—";
    }
    function todayStr() { var d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
    function daysSince(x) {
        if (!x) return Infinity;
        var a = toDate(String(x).slice(0, 10)); if (!a) return Infinity;
        var b = toDate(todayStr());
        return Math.round((b - a) / 86400000);
    }
    function lastSeen(x) {
        var n = daysSince(x);
        if (n === Infinity) return { t: "Hiç çalışmadı", tone: "rose" };
        if (n <= 0) return { t: "Bugün", tone: "green" };
        if (n === 1) return { t: "Dün", tone: "green" };
        if (n < 7) return { t: n + " gün önce", tone: "gold" };
        return { t: n + " gün önce", tone: "rose" };
    }
    function eduLabel(id) { var l = LEVELS.filter(function (x) { return x.id === id; })[0]; return l ? l.t : (id || "—"); }
    function trackLabel(id) { return ({ B: "B grubu", A: "A grubu", ogretmen: "Öğretmenlik", dhbt: "DHBT" })[id] || id || "—"; }
    function platformLabel(id) { return ({ web: "Web", ios: "iOS", android: "Android" })[id] || id || "—"; }
    function cleanDetail(s) { return /^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(String(s || "")) ? "" : (s || ""); }
    function initial(s) { return String(s || "?").trim().charAt(0).toLocaleUpperCase("tr-TR") || "?"; }
    function futureExamDate(level) {
        var d = window.KpssConfig && window.KpssConfig.examDateByLevel && window.KpssConfig.examDateByLevel[level];
        return d && d > todayStr() ? d : null;
    }

    function parseAnnounceRow(row) {
        var raw = String((row && row.body) || "");
        var exp = row && row.expires_at;
        var m = raw.match(/^<!--kpss-exp:([^>]+)-->/);
        if (m) { exp = exp || m[1]; raw = raw.slice(m[0].length); }
        var ts = exp ? new Date(exp).getTime() : NaN;
        var published = !row || row.published !== false;
        return { id: row && row.id, text: raw.trim(), expiresAt: exp || null, createdAt: row && row.created_at, live: published && (!exp || (isFinite(ts) && ts > Date.now())) };
    }

    // ---------- hata metni ----------
    function errText(e, fallback) {
        if (!e) return fallback || "İşlem tamamlanamadı.";
        if (typeof e === "string") return e;
        if (e.hint && /[a-zçğıöşü]/i.test(e.hint) && /[çğıöşüÇĞİÖŞÜ]|\s/.test(e.hint) && !/^(perhaps|try|no function)/i.test(e.hint)) return e.hint;
        if (e.tr) return e.tr;
        if (/42703|42P01|column .* does not exist|relation .* does not exist/i.test(String(e.message || "") + " " + String(e.code || ""))) {
            return "Veritabanı yaması eski: supabase/patch-admin-panel.sql dosyasını SQL Editor'da yeniden çalıştır.";
        }
        return window.trError ? window.trError(e, fallback || "İşlem tamamlanamadı.") : (fallback || "İşlem tamamlanamadı.");
    }
    function isMissingFn(e) {
        var s = String((e && e.message) || "") + " " + String((e && e.code) || "");
        return /PGRST202|42883|could not find the function|function .* does not exist|schema cache/i.test(s);
    }

    // ---------- sunucu fonksiyonu (yedek yol) ----------
    async function edge(sb, action, body) {
        if (!sb.functions) throw { tr: "Sunucu fonksiyonu kullanılamıyor." };
        var r = await sb.functions.invoke("admin-action", { body: Object.assign({ action: action }, body || {}) });
        if (r.error) {
            var ctx = r.error.context, b = null;
            try { if (ctx && typeof ctx.json === "function") b = await ctx.json(); else if (ctx && ctx.body) b = ctx.body; } catch (e) { b = null; }
            var status = ctx && ctx.status;
            throw { tr: (b && b.error) || (status === 403 ? "Bu işlem için yetkin yok." : "Sunucu fonksiyonuna ulaşılamadı (admin-action)."), message: r.error.message };
        }
        var d = r.data;
        if (typeof d === "string") { try { d = JSON.parse(d); } catch (e) { d = null; } }
        if (d && d.ok === false) throw { tr: d.error || "İşlem başarısız." };
        return d && Object.prototype.hasOwnProperty.call(d, "data") ? d.data : d;
    }

    // Önce veritabanı fonksiyonu; yoksa yedek. legacy: true → yedek kullanıldı (kurulum uyarısı)
    async function call(sb, name, args, fallback) {
        var r = await sb.rpc(name, args || {});
        if (!r.error) return { data: r.data, legacy: false };
        if (isMissingFn(r.error) && fallback) return { data: await fallback(), legacy: true };
        throw r.error;
    }

    function overviewFromUsers(users, pendingEdu, annLive) {
        var d = todayStr(), st = users.filter(function (u) { return u.role !== "admin"; });
        var by = function (k) { var o = {}; st.forEach(function (u) { var v = u[k] || "bilinmiyor"; o[v] = (o[v] || 0) + 1; }); return o; };
        var act = [];
        for (var i = 13; i >= 0; i--) {
            var x = new Date(); x.setDate(x.getDate() - i);
            var day = x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0");
            act.push({ day: day, n: users.filter(function (u) { return String(u.last_study_at || "").slice(0, 10) === day; }).length });
        }
        return {
            users: st.length,
            dau: users.filter(function (u) { return String(u.last_study_at || "").slice(0, 10) === d; }).length,
            wau: users.filter(function (u) { return daysSince(u.last_study_at) <= 6; }).length,
            mau: users.filter(function (u) { return daysSince(u.last_study_at) <= 29; }).length,
            idle7: st.filter(function (u) { return daysSince(u.last_study_at) > 7; }).length,
            premium: users.filter(function (u) { return u.premium; }).length,
            blocked: users.filter(function (u) { return u.blocked; }).length,
            questions: users.reduce(function (s, u) { return s + (Number(u.questions_total) || 0); }, 0),
            pending_edu: pendingEdu, by_level: by("education_level"), by_platform: by("platform"), active_14: act, announcements: annLive
        };
    }

    // ---------- simgeler ----------
    var ICONS = {
        ozet: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z",
        talepler: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
        kullanicilar: "M17 20h5v-2a3 3 0 00-5.36-1.86M17 20H7m10 0v-2c0-.66-.13-1.28-.36-1.86M7 20H2v-2a3 3 0 015.36-1.86M7 20v-2c0-.66.13-1.28.36-1.86m0 0a5 5 0 019.28 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
        analiz: "M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z",
        duyuru: "M11 5.88V19.24a1.76 1.76 0 01-3.42.59l-2.15-6.15M18 13a3 3 0 100-6M5.44 13.68A4 4 0 017 6h1.83c4.1 0 7.63-1.23 9.17-3v14c-1.54-1.77-5.07-3-9.17-3H7a4 4 0 01-1.56-.32z",
        deneme: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
        gecmis: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.59a1 1 0 01.7.29l5.42 5.42a1 1 0 01.29.7V19a2 2 0 01-2 2z",
        refresh: "M4 4v5h.58m15.36 2A8 8 0 004.58 9m0 0H9m11 11v-5h-.58m0 0a8 8 0 01-15.36-2m15.36 2H15",
        out: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
        star: "M11.48 3.5a.56.56 0 011.04 0l2.13 5.11a.56.56 0 00.47.35l5.52.44c.5.04.7.66.32.99l-4.2 3.6a.56.56 0 00-.18.56l1.28 5.38a.56.56 0 01-.84.61l-4.72-2.88a.56.56 0 00-.59 0l-4.72 2.88a.56.56 0 01-.84-.61l1.28-5.38a.56.56 0 00-.18-.56l-4.2-3.6a.56.56 0 01.32-.99l5.52-.44a.56.56 0 00.47-.35l2.13-5.11z",
        ban: "M18.36 5.64a9 9 0 11-12.73 0M18.36 5.64A9 9 0 005.64 18.36M18.36 5.64L5.64 18.36",
        trash: "M19 7l-.87 12.14A2 2 0 0116.14 21H7.86a2 2 0 01-1.99-1.86L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
        check: "M5 13l4 4L19 7", x: "M6 18L18 6M6 6l12 12", search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
        q: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", bolt: "M13 10V3L4 14h7v7l9-11h-7z", arrow: "M13 7l5 5m0 0l-5 5m5-5H6",
        warn: "M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
    };
    function Ico(p) {
        return (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.w || 1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={p.className} style={p.style}>
                <path d={ICONS[p.n]} />
            </svg>
        );
    }

    // ============================================================
    // ORTAK PARÇALAR
    // ============================================================
    function Confirm(p) {
        const okRef = useRef(null);
        useEffect(function () {
            if (okRef.current) okRef.current.focus();
            function onKey(e) { if (e.key === "Escape") p.onClose(); }
            document.addEventListener("keydown", onKey);
            return function () { document.removeEventListener("keydown", onKey); };
        }, []);
        return (
            <div>
                <div className="adm-scrim" onClick={p.onClose}></div>
                <div className="adm-modal" role="dialog" aria-modal="true" aria-labelledby="adm-confirm-t">
                    <div className="flex items-start gap-3">
                        <span className={"adm-ico " + (p.tone === "danger" ? "adm-ico-rose" : p.tone === "ok" ? "adm-ico-green" : "adm-ico-gold")}><Ico n={p.icon || "warn"} /></span>
                        <div className="min-w-0">
                            <h2 id="adm-confirm-t" className="text-lg font-extrabold leading-snug">{p.title}</h2>
                            {p.body && <p className="text-sm adm-muted mt-1.5 leading-relaxed">{p.body}</p>}
                        </div>
                    </div>
                    {p.children}
                    <div className="flex gap-2 justify-end mt-5">
                        <button type="button" className="adm-btn adm-btn-ghost" onClick={p.onClose}>Vazgeç</button>
                        <button type="button" ref={okRef} className={"adm-btn " + (p.tone === "danger" ? "adm-btn-danger" : p.tone === "ok" ? "adm-btn-ok" : "adm-btn-primary")}
                            onClick={function () { p.onOk(); p.onClose(); }}>{p.okLabel || "Onayla"}</button>
                    </div>
                </div>
            </div>
        );
    }

    function Empty(p) {
        return (
            <div className="adm-card p-10 text-center">
                <span className="adm-ico adm-ico-teal mx-auto mb-3" style={{ width: 52, height: 52, borderRadius: 16 }}><Ico n={p.icon || "check"} /></span>
                <p className="font-bold">{p.title}</p>
                {p.text && <p className="text-sm adm-muted mt-1 max-w-md mx-auto">{p.text}</p>}
            </div>
        );
    }

    function Kpi(p) {
        return (
            <div className="adm-card adm-kpi">
                <div className="flex items-center justify-between gap-2">
                    <span className="adm-label">{p.label}</span>
                    <span className={"adm-ico adm-ico-" + (p.tone || "teal")}><Ico n={p.icon} /></span>
                </div>
                <div className="adm-kpi-n mt-2">{p.value}</div>
                {p.sub && <div className="text-xs adm-muted mt-1">{p.sub}</div>}
            </div>
        );
    }

    function Head(p) {
        return (
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
                <div>
                    <div className="adm-eyebrow">{p.eyebrow}</div>
                    <h1 className="adm-h1 mt-1">{p.title}</h1>
                    {p.sub && <p className="text-sm adm-muted mt-1.5 max-w-2xl">{p.sub}</p>}
                </div>
                {p.right}
            </div>
        );
    }

    function Dist(p) {
        var entries = Object.keys(p.data || {}).map(function (k) { return [k, p.data[k]]; }).sort(function (a, b) { return b[1] - a[1]; });
        var total = entries.reduce(function (s, e) { return s + e[1]; }, 0) || 1;
        if (!entries.length) return <p className="text-sm adm-muted">Veri yok.</p>;
        return (
            <ul className="space-y-3">
                {entries.map(function (e) {
                    var pct = Math.round((e[1] / total) * 100);
                    return (
                        <li key={e[0]}>
                            <div className="flex justify-between text-sm mb-1.5"><span className="font-semibold">{p.label(e[0])}</span><span className="adm-muted">{num(e[1])} · %{pct}</span></div>
                            <div className={"adm-meter " + (p.meter || "")}><span style={{ width: Math.max(2, pct) + "%" }}></span></div>
                        </li>
                    );
                })}
            </ul>
        );
    }

    // ============================================================
    // ANA BİLEŞEN
    // ============================================================
    function AdminDashboard(props) {
        const student = props.student;
        const up = student.userProfile || {};
        const isAdmin = up.role === "admin";
        const myId = up.authUserId || "";

        const [tab, setTab] = useState("ozet");
        const [loading, setLoading] = useState(true);
        const [loadedAt, setLoadedAt] = useState(null);
        const [users, setUsers] = useState([]);
        const [ov, setOv] = useState(null);
        const [edu, setEdu] = useState([]);
        const [ann, setAnn] = useState([]);
        const [hard, setHard] = useState([]);
        const [audit, setAudit] = useState(null);
        const [errors, setErrors] = useState({});
        const [legacy, setLegacy] = useState(false);
        const [toast, setToast] = useState(null);
        const [busy, setBusy] = useState("");
        const [confirm, setConfirm] = useState(null);
        const [sel, setSel] = useState(null);
        const [detail, setDetail] = useState(null);
        const [detailErr, setDetailErr] = useState("");
        const [q, setQ] = useState("");
        const [filter, setFilter] = useState("all");
        const [sort, setSort] = useState("recent");
        const [page, setPage] = useState(1);
        const [annText, setAnnText] = useState("");
        const [annHours, setAnnHours] = useState("24");
        const [grantDays, setGrantDays] = useState(30);
        const PAGE = 25;
        const toastTimer = useRef(null);

        const sbGet = function () { return window.SupabaseClient && window.SupabaseClient.get(); };
        const say = useCallback(function (ok, text) {
            setToast({ ok: ok, text: text });
            clearTimeout(toastTimer.current);
            toastTimer.current = setTimeout(function () { setToast(null); }, ok ? 3500 : 7000);
        }, []);

        // ---------- yükleme ----------
        const load = useCallback(async function () {
            var sb = sbGet();
            if (!sb) { setErrors({ genel: "Veritabanına bağlanılamadı." }); setLoading(false); return; }
            setLoading(true);
            var errs = {}, usedLegacy = false;
            function track(r) { if (r && r.legacy) usedLegacy = true; return r; }

            var pUsers = call(sb, "admin_users", {}, async function () {
                try { return await edge(sb, "user_list"); } catch (e) {
                    var r2 = await sb.rpc("admin_user_list");
                    if (r2.error) throw e;
                    return r2.data || [];
                }
            }).then(track).catch(function (e) { errs.kullanicilar = errText(e, "Kullanıcı listesi yüklenemedi."); return null; });
            var pEdu = call(sb, "admin_edu_requests", {}, function () { return edge(sb, "list_edu_requests"); })
                .then(track).catch(function (e) { errs.talepler = errText(e, "Eğitim talepleri yüklenemedi."); return null; });
            var pAnn = call(sb, "admin_announcements", {}, async function () {
                try { return await edge(sb, "list_announcements"); } catch (e) {
                    var rA = await sb.from("app_announcements").select("id,body,published,created_at,expires_at").order("created_at", { ascending: false }).limit(80);
                    if (rA.error) throw e;
                    return rA.data || [];
                }
            }).then(track).catch(function (e) { errs.duyuru = errText(e, "Duyurular yüklenemedi."); return null; });
            var pOv = call(sb, "admin_overview", {}, function () { return null; }).then(track).catch(function (e) { errs.ozet = errText(e, "Özet yüklenemedi."); return null; });
            var pHard = sb.rpc("admin_hard_topics").then(function (r) { if (r.error) { if (!isMissingFn(r.error)) errs.analiz = errText(r.error, "Zor konular yüklenemedi."); return []; } return r.data || []; });
            var pAudit = sb.rpc("admin_audit_log", { p_limit: 120 }).then(function (r) {
                if (r.error) { if (isMissingFn(r.error)) { usedLegacy = true; return null; } errs.gecmis = errText(r.error, "İşlem geçmişi yüklenemedi."); return null; }
                return r.data || [];
            });

            var res = await Promise.all([pUsers, pEdu, pAnn, pOv, pHard, pAudit].map(function (p) { return p.catch(function () { return null; }); }));
            var uList = res[0] ? (Array.isArray(res[0].data) ? res[0].data : []) : null;
            var eList = res[1] ? (Array.isArray(res[1].data) ? res[1].data : []) : null;
            var aList = res[2] ? (Array.isArray(res[2].data) ? res[2].data : []).map(parseAnnounceRow) : null;
            if (uList) setUsers(uList);
            if (eList) setEdu(eList);
            if (aList) setAnn(aList);
            var o = res[3] && res[3].data;
            if (!o && uList) o = overviewFromUsers(uList, (eList || []).length, (aList || []).filter(function (a) { return a.live; }).length);
            if (o) setOv(o);
            setHard(Array.isArray(res[4]) ? res[4] : []);
            setAudit(res[5]);
            setErrors(errs);
            setLegacy(usedLegacy);
            setLoadedAt(new Date());
            setLoading(false);
        }, []);

        useEffect(function () { if (isAdmin) load(); }, [isAdmin, load]);
        useEffect(function () { return function () { clearTimeout(toastTimer.current); }; }, []);

        // ---------- ayrıntı ----------
        const openDetail = useCallback(async function (uid) {
            setSel(uid); setDetail(null); setDetailErr(""); setGrantDays(30);
            var sb = sbGet(); if (!sb) return;
            try {
                var r = await call(sb, "admin_user_detail", { p_user: uid }, function () { return edge(sb, "inspect_user", { user_id: uid }); });
                var d = r.data || {};
                if (r.legacy) d = Object.assign({}, d, { wrong_count: d.wrongCount, edu_request: d.educationChangeRequest });
                setDetail(d);
            } catch (e) { setDetailErr(errText(e, "Kullanıcı ayrıntısı yüklenemedi.")); }
        }, []);
        const closeDetail = function () { setSel(null); setDetail(null); setDetailErr(""); };
        useEffect(function () {
            if (!sel) return;
            function onKey(e) { if (e.key === "Escape" && !confirm) closeDetail(); }
            document.addEventListener("keydown", onKey);
            return function () { document.removeEventListener("keydown", onKey); };
        }, [sel, confirm]);

        // ---------- işlemler ----------
        const run = useCallback(async function (key, fn, okText, after) {
            var sb = sbGet();
            if (!sb) { say(false, "Veritabanına bağlanılamadı."); return; }
            setBusy(key);
            try {
                await fn(sb);
                say(true, okText);
                if (after) after();
                await load();
            } catch (e) {
                say(false, errText(e, "İşlem tamamlanamadı."));
            } finally { setBusy(""); }
        }, [load, say]);

        function setPremium(u, days) {
            var on = days > 0;
            run("premium:" + u.user_id, function (sb) {
                return call(sb, "admin_set_premium", { p_user: u.user_id, p_days: on ? days : 0 }, function () {
                    return edge(sb, on ? "grant_premium" : "revoke_premium", on ? { user_id: u.user_id, days: days } : { user_id: u.user_id });
                });
            }, on ? (u.nickname || "Kullanıcı") + " için " + days + " gün Premium açıldı." : (u.nickname || "Kullanıcı") + " artık ücretsiz planda.", function () { if (sel === u.user_id) openDetail(u.user_id); });
        }
        function setBlocked(u, on) {
            run("block:" + u.user_id, function (sb) {
                return call(sb, "admin_set_blocked", { p_user: u.user_id, p_blocked: on }, function () { return edge(sb, on ? "block" : "unblock", { user_id: u.user_id }); });
            }, on ? (u.nickname || "Kullanıcı") + " engellendi." : (u.nickname || "Kullanıcı") + " için engel kaldırıldı.", function () { if (sel === u.user_id) openDetail(u.user_id); });
        }
        function deleteUser(u) {
            run("delete:" + u.user_id, function (sb) {
                return call(sb, "admin_delete_user", { p_user: u.user_id }, function () { return edge(sb, "delete_user", { user_id: u.user_id }); });
            }, (u.nickname || "Kullanıcı") + " kalıcı olarak silindi.", closeDetail);
        }
        function decideEdu(r, approve) {
            var exam = approve ? futureExamDate(r.to) : null;
            run("edu:" + r.user_id, function (sb) {
                return call(sb, "admin_edu_decide", { p_user: r.user_id, p_approve: approve, p_exam_date: exam }, function () {
                    return edge(sb, approve ? "approve_edu" : "reject_edu", approve ? { user_id: r.user_id, to: r.to, exam_date: exam } : { user_id: r.user_id });
                });
            }, approve ? (r.nickname || "Öğrenci") + " artık " + eduLabel(r.to) + " düzeyinde." : (r.nickname || "Öğrenci") + " talebi reddedildi.");
        }
        function publish() {
            var text = annText.trim();
            if (!text) return;
            var hours = Number(annHours) || 0;
            run("announce", function (sb) {
                return call(sb, "admin_announce", { p_text: text, p_hours: hours > 0 ? hours : null }, function () { return edge(sb, "announce", { text: text, hours: hours }); });
            }, "Duyuru yayınlandı. Öğrenciler Bugün ekranında görecek.", function () { setAnnText(""); });
        }
        function removeAnn(a) {
            run("ann:" + a.id, function (sb) {
                return call(sb, "admin_announce_delete", { p_id: a.id }, function () { return edge(sb, "delete_announce", { id: a.id }); });
            }, "Duyuru silindi.");
        }

        // ---------- liste ----------
        const counts = useMemo(function () {
            return {
                all: users.length,
                premium: users.filter(function (u) { return u.premium; }).length,
                blocked: users.filter(function (u) { return u.blocked; }).length,
                pending: users.filter(function (u) { return u.edu_request; }).length,
                active: users.filter(function (u) { return daysSince(u.last_study_at) <= 0; }).length,
                idle7: users.filter(function (u) { return u.role !== "admin" && daysSince(u.last_study_at) > 7; }).length
            };
        }, [users]);
        const filtered = useMemo(function () {
            var needle = q.trim().toLocaleLowerCase("tr-TR");
            var list = users.filter(function (u) {
                if (needle) {
                    var hay = [u.nickname, u.email, u.user_id, u.location, eduLabel(u.education_level), trackLabel(u.target_type), platformLabel(u.platform)].join(" ").toLocaleLowerCase("tr-TR");
                    if (hay.indexOf(needle) < 0) return false;
                }
                if (filter === "premium") return !!u.premium;
                if (filter === "blocked") return !!u.blocked;
                if (filter === "pending") return !!u.edu_request;
                if (filter === "active") return daysSince(u.last_study_at) <= 0;
                if (filter === "idle7") return u.role !== "admin" && daysSince(u.last_study_at) > 7;
                if (filter === "lisans" || filter === "onlisans" || filter === "ortaogretim") return u.education_level === filter;
                return true;
            });
            var key = {
                recent: function (u) { return -(toDate(u.last_study_at) || 0); },
                questions: function (u) { return -(Number(u.questions_total) || 0); },
                name: null,
                joined: function (u) { return -(toDate(u.created_at || u.updated_at) || 0); }
            }[sort];
            list = list.slice().sort(function (a, b) {
                if (!key) return String(a.nickname || "").localeCompare(String(b.nickname || ""), "tr");
                return key(a) - key(b);
            });
            return list;
        }, [users, q, filter, sort]);
        const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
        const curPage = Math.min(page, pages);
        const pageRows = filtered.slice((curPage - 1) * PAGE, curPage * PAGE);
        const selUser = sel ? (users.filter(function (u) { return u.user_id === sel; })[0] || { user_id: sel, nickname: detail && detail.nickname }) : null;

        // ---------- yetki ----------
        if (!isAdmin) {
            return (
                <div className="adm min-h-screen flex items-center justify-center p-6">
                    <div className="adm-card text-center max-w-sm p-8">
                        <span className="adm-ico adm-ico-rose mx-auto mb-3"><Ico n="ban" /></span>
                        <h1 className="text-xl font-extrabold mb-2">Yetki yok</h1>
                        <p className="text-sm adm-muted mb-6">Bu hesap yönetici yetkisine sahip değil.</p>
                        <button onClick={props.onSignOut} className="adm-btn adm-btn-primary w-full">Çıkış yap</button>
                    </div>
                </div>
            );
        }

        const nav = [
            { id: "ozet", t: "Özet", icon: "ozet" },
            { id: "talepler", t: "Eğitim talepleri", icon: "talepler", badge: edu.length },
            { id: "kullanicilar", t: "Kullanıcılar", icon: "kullanicilar" },
            { id: "analiz", t: "Analiz", icon: "analiz" },
            { id: "duyuru", t: "Duyurular", icon: "duyuru" },
            { id: "deneme", t: "Canlı deneme", icon: "deneme" },
            { id: "gecmis", t: "İşlem geçmişi", icon: "gecmis" }
        ];
        const go = function (id) { setTab(id); try { window.scrollTo(0, 0); } catch (e) {} };
        const errList = Object.keys(errors);
        const act14 = (ov && ov.active_14) || [];
        const maxAct = Math.max(1, Math.max.apply(null, act14.map(function (x) { return Number(x.n) || 0; }).concat([0])));
        const refreshBtn = (
            <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={load} disabled={loading} aria-label="Verileri yenile">
                {loading ? <span className="adm-spin" aria-hidden="true"></span> : <Ico n="refresh" />}
                <span>{loading ? "Yükleniyor" : "Yenile"}</span>
            </button>
        );

        // ============================================================
        return (
            <div className="adm flex">
                {/* ---------- yan menü (masaüstü) ---------- */}
                <aside className="adm-side hidden lg:flex flex-col w-72 shrink-0 sticky top-0 h-screen px-4 py-6" aria-label="Yönetim menüsü">
                    <div className="flex items-center gap-3 px-2 mb-8">
                        {window.AtanomLogo ? window.AtanomLogo("h-11 w-11 object-contain rounded-xl") : <img src="icons/atanom.png" alt="" className="h-11 w-11 object-contain rounded-xl" />}
                        <div className="min-w-0">
                            <div className="text-lg font-extrabold leading-tight">Atanly <span className="adm-gold">Yönetim</span></div>
                            <div className="text-xs text-white/70 truncate">{up.email || "Yönetici"}</div>
                        </div>
                    </div>
                    <nav className="flex-1 space-y-1">
                        {nav.map(function (n) {
                            return (
                                <button key={n.id} type="button" className="adm-nav" aria-current={tab === n.id ? "page" : undefined} onClick={function () { go(n.id); }}>
                                    <Ico n={n.icon} /><span className="flex-1">{n.t}</span>
                                    {n.badge > 0 && <span className="adm-count" aria-label={n.badge + " bekleyen"}>{n.badge}</span>}
                                </button>
                            );
                        })}
                    </nav>
                    <div className="rounded-2xl p-4 mb-3" style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)" }}>
                        <div className="text-xs text-white/70">Son güncelleme</div>
                        <div className="text-sm font-bold mt-0.5">{loadedAt ? loadedAt.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) : "—"}</div>
                    </div>
                    <button type="button" className="adm-btn adm-btn-glass w-full" onClick={props.onSignOut}><Ico n="out" />Çıkış</button>
                </aside>

                <div className="flex-1 min-w-0">
                    {/* ---------- üst çubuk (mobil / tablet) ---------- */}
                    <header className="adm-top lg:hidden sticky top-0 z-30" style={{ paddingTop: "env(safe-area-inset-top)" }}>
                        <div className="flex items-center justify-between gap-3 px-4 pt-3 pb-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                                {window.AtanomLogo ? window.AtanomLogo("h-9 w-9 object-contain rounded-lg") : <img src="icons/atanom.png" alt="" className="h-9 w-9 object-contain rounded-lg" />}
                                <div className="font-extrabold truncate">Atanly <span className="adm-gold">Yönetim</span></div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button type="button" className="adm-btn adm-btn-glass adm-btn-sm" onClick={load} disabled={loading} aria-label="Verileri yenile">
                                    {loading ? <span className="adm-spin" aria-hidden="true"></span> : <Ico n="refresh" />}
                                </button>
                                <button type="button" className="adm-btn adm-btn-glass adm-btn-sm" onClick={props.onSignOut}>Çıkış</button>
                            </div>
                        </div>
                        <nav className="flex gap-2 overflow-x-auto px-4 pb-3" aria-label="Yönetim bölümleri" style={{ scrollbarWidth: "none" }}>
                            {nav.map(function (n) {
                                return (
                                    <button key={n.id} type="button" className="adm-pill" aria-current={tab === n.id ? "page" : undefined} onClick={function () { go(n.id); }}>
                                        {n.t}{n.badge > 0 && <span className="adm-count" style={{ height: 20, minWidth: 20, fontSize: 10 }}>{n.badge}</span>}
                                    </button>
                                );
                            })}
                        </nav>
                    </header>

                    <main className="px-4 py-6 md:px-8 md:py-8 max-w-7xl mx-auto">
                        {legacy && (
                            <div className="adm-alert adm-alert-warn mb-4" role="status">
                                <Ico n="warn" className="w-5 h-5 shrink-0 mt-0.5" />
                                <div><b>Veritabanı yaması eksik.</b> Panel şimdilik yedek yoldan çalışıyor; bazı bölümler (işlem geçmişi, ayrıntılı özet) kapalı.
                                    Supabase → SQL Editor'da <code className="font-mono">supabase/patch-admin-panel.sql</code> dosyasını bir kez çalıştır.</div>
                            </div>
                        )}
                        {errList.length > 0 && (
                            <div className="adm-alert adm-alert-err mb-4" role="alert">
                                <Ico n="warn" className="w-5 h-5 shrink-0 mt-0.5" />
                                <div className="min-w-0">
                                    <b>Bazı veriler yüklenemedi.</b>
                                    <ul className="mt-1 space-y-0.5">{errList.map(function (k) { return <li key={k}>{errors[k]}</li>; })}</ul>
                                </div>
                                <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm ml-auto" onClick={load}>Tekrar dene</button>
                            </div>
                        )}

                        {/* ================= ÖZET ================= */}
                        {tab === "ozet" && (
                            <div className="space-y-5">
                                <section className="adm-hero p-6 md:p-8">
                                    <div className="adm-hero-grid"></div>
                                    <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6">
                                        <div>
                                            <div className="text-xs font-extrabold tracking-[.16em] uppercase text-white/70">Yönetim özeti</div>
                                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2">Hoş geldin, <span className="adm-gold">{(student.profile && student.profile.name) || up.nickname || "yönetici"}</span></h1>
                                            <p className="text-white/75 text-sm mt-2 max-w-xl">{fmtDate(new Date())} · {ov ? num(ov.dau) + " öğrenci bugün çalıştı" : "Veriler yükleniyor"}{edu.length ? " · " + edu.length + " eğitim talebi seni bekliyor" : ""}</p>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3 md:gap-5 text-center">
                                            {[["Bugün", ov && ov.dau], ["7 gün", ov && ov.wau], ["30 gün", ov && ov.mau]].map(function (x) {
                                                return (
                                                    <div key={x[0]} className="rounded-2xl px-4 py-3" style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)" }}>
                                                        <div className="text-2xl md:text-3xl font-extrabold">{ov ? num(x[1]) : "—"}</div>
                                                        <div className="text-[11px] font-bold uppercase tracking-wider text-white/70 mt-0.5">{x[0]}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </section>

                                {edu.length > 0 && (
                                    <button type="button" onClick={function () { go("talepler"); }} className="adm-card w-full text-left p-4 flex items-center gap-4" style={{ borderColor: "#E9D3A0" }}>
                                        <span className="adm-ico adm-ico-gold"><Ico n="talepler" /></span>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-extrabold">{edu.length} eğitim değişikliği talebi bekliyor</div>
                                            <div className="text-sm adm-muted truncate">{edu.slice(0, 3).map(function (r) { return (r.nickname || "Öğrenci") + " → " + eduLabel(r.to); }).join(" · ")}</div>
                                        </div>
                                        <span className="adm-btn adm-btn-gold adm-btn-sm">İncele<Ico n="arrow" /></span>
                                    </button>
                                )}

                                <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
                                    <Kpi label="Öğrenci" icon="kullanicilar" tone="navy" value={ov ? num(ov.users) : "—"} sub={ov ? num(ov.idle7) + " kişi 7+ gündür pasif" : ""} />
                                    <Kpi label="Premium" icon="star" tone="gold" value={ov ? num(ov.premium) : "—"} sub={ov && ov.users ? "%" + Math.round((ov.premium / ov.users) * 100) + " oran" : ""} />
                                    <Kpi label="Çözülen soru" icon="q" tone="green" value={ov ? num(ov.questions) : "—"} sub={ov && ov.users ? "Kişi başı " + num(Math.round(ov.questions / ov.users)) : ""} />
                                    <Kpi label="Engelli hesap" icon="ban" tone="rose" value={ov ? num(ov.blocked) : "—"} sub={ov ? num(ov.announcements) + " duyuru yayında" : ""} />
                                </div>

                                <div className="grid lg:grid-cols-3 gap-4">
                                    <section className="adm-card p-5 lg:col-span-2" aria-labelledby="adm-act-t">
                                        <div className="flex items-center justify-between mb-4">
                                            <div><h2 id="adm-act-t" className="font-extrabold">Günlük aktif öğrenci</h2><p className="text-xs adm-muted">Son 14 gün · o gün en son çalışan öğrenci sayısı</p></div>
                                            <span className="adm-chip adm-chip-teal">Bugün {ov ? num(ov.dau) : "—"}</span>
                                        </div>
                                        {loading && !ov ? <div className="adm-skel" style={{ height: 140 }}></div> : (
                                            <div>
                                                <div className="adm-bars" role="img" aria-label={"Son 14 günün aktif öğrenci sayıları: " + act14.map(function (x) { return fmtDate(x.day) + " " + x.n; }).join(", ")}>
                                                    {act14.map(function (x, i) {
                                                        return <div key={x.day} title={fmtDate(x.day) + ": " + x.n} className={"adm-bar" + (i === act14.length - 1 ? " adm-bar-today" : "")} style={{ height: Math.round(((Number(x.n) || 0) / maxAct) * 100) + "%" }}></div>;
                                                    })}
                                                </div>
                                                <div className="flex gap-1.5 mt-2 text-[10px] adm-muted">
                                                    {act14.map(function (x, i) { return <span key={x.day} className="flex-1 text-center">{i % 2 === act14.length % 2 ? String(x.day).slice(8, 10) : ""}</span>; })}
                                                </div>
                                            </div>
                                        )}
                                    </section>
                                    <section className="adm-card p-5" aria-labelledby="adm-lvl-t">
                                        <h2 id="adm-lvl-t" className="font-extrabold mb-4">Eğitim düzeyi</h2>
                                        <Dist data={ov && ov.by_level} label={eduLabel} />
                                        <h2 className="font-extrabold mt-6 mb-4">Platform</h2>
                                        <Dist data={ov && ov.by_platform} label={platformLabel} meter="adm-meter-gold" />
                                    </section>
                                </div>

                                <section className="adm-card p-5" aria-labelledby="adm-last-t">
                                    <div className="flex items-center justify-between mb-3">
                                        <h2 id="adm-last-t" className="font-extrabold">Son işlemler</h2>
                                        <button type="button" className="text-sm font-bold" style={{ color: "var(--a-teal)" }} onClick={function () { go("gecmis"); }}>Tümü</button>
                                    </div>
                                    {!audit || !audit.length ? <p className="text-sm adm-muted">{audit ? "Henüz işlem yok." : "İşlem geçmişi için veritabanı yaması gerekli."}</p> : (
                                        <ul className="divide-y" style={{ borderColor: "var(--a-line2)" }}>
                                            {audit.slice(0, 5).map(function (a, i) {
                                                return (
                                                    <li key={i} className="py-2.5 flex items-center gap-3 text-sm">
                                                        <span className={"adm-chip " + (a.ok === false ? "adm-chip-rose" : "adm-chip-teal")}>{ACTION_LABELS[a.action] || a.action}</span>
                                                        <span className="truncate flex-1">{a.target || cleanDetail(a.detail)}</span>
                                                        <span className="adm-muted text-xs shrink-0">{fmtDateTime(a.at)}</span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </section>
                            </div>
                        )}

                        {/* ================= EĞİTİM TALEPLERİ ================= */}
                        {tab === "talepler" && (
                            <div>
                                <Head eyebrow="Onay bekleyenler" title="Eğitim değişikliği talepleri" right={refreshBtn}
                                    sub="Soru çözmeye başlamış öğrenci düzeyini kendisi değiştiremez; talep buraya düşer. Onaylarsan düzeyi ve (geleceğe ait ise) sınav tarihi güncellenir." />
                                {loading && !edu.length ? <div className="adm-skel" style={{ height: 120 }}></div> : !edu.length ? (
                                    <Empty title="Bekleyen talep yok" text="Öğrenci Profil → Ayarlar'dan düzey değişikliği istediğinde burada görünür." />
                                ) : (
                                    <ul className="grid md:grid-cols-2 gap-4">
                                        {edu.map(function (r) {
                                            var exam = futureExamDate(r.to);
                                            var b = busy === "edu:" + r.user_id;
                                            return (
                                                <li key={r.user_id} className="adm-card p-5">
                                                    <div className="flex items-center gap-3">
                                                        <span className="adm-avatar">{initial(r.nickname)}</span>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="font-extrabold truncate">{r.nickname || "Öğrenci"}</div>
                                                            <div className="text-xs adm-muted">{fmtDateTime(r.at)}{r.questions_total != null ? " · " + num(r.questions_total) + " soru çözmüş" : ""}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-4">
                                                        <span className="adm-chip">{eduLabel(r.from)}</span>
                                                        <Ico n="arrow" className="w-4 h-4 adm-muted" />
                                                        <span className="adm-chip adm-chip-teal">{eduLabel(r.to)}</span>
                                                    </div>
                                                    <div className="flex gap-2 mt-5">
                                                        <button type="button" className="adm-btn adm-btn-ok flex-1" disabled={!!busy}
                                                            onClick={function () {
                                                                setConfirm({ tone: "ok", icon: "check", title: (r.nickname || "Öğrenci") + " " + eduLabel(r.to) + " düzeyine geçsin mi?", okLabel: "Onayla",
                                                                    body: exam ? "Sınav tarihi " + fmtDate(exam) + " olarak ayarlanır. Öğrenci uygulamayı açınca yeni düzeyi görür." : "Öğrenci uygulamayı açınca yeni düzeyi görür. Sınav tarihi değişmez (takvimdeki tarih geçmiş).",
                                                                    onOk: function () { decideEdu(r, true); } });
                                                            }}>{b ? <span className="adm-spin"></span> : <Ico n="check" />}Onayla</button>
                                                        <button type="button" className="adm-btn adm-btn-ghost flex-1" disabled={!!busy}
                                                            onClick={function () {
                                                                setConfirm({ tone: "danger", icon: "x", title: "Talep reddedilsin mi?", okLabel: "Reddet", body: "Öğrenci " + eduLabel(r.from) + " düzeyinde kalır ve talebinin reddedildiğini görür.", onOk: function () { decideEdu(r, false); } });
                                                            }}><Ico n="x" />Reddet</button>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                        )}

                        {/* ================= KULLANICILAR ================= */}
                        {tab === "kullanicilar" && (
                            <div>
                                <Head eyebrow="Hesaplar" title="Kullanıcılar" right={refreshBtn} sub={num(users.length) + " hesap · satıra dokunarak ayrıntı ve işlemleri aç."} />
                                <div className="adm-card p-4 mb-4">
                                    <div className="flex flex-col md:flex-row gap-3">
                                        <label className="relative flex-1">
                                            <span className="sr-only">Kullanıcı ara</span>
                                            <Ico n="search" className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 adm-muted" />
                                            <input type="search" value={q} onChange={function (e) { setQ(e.target.value); setPage(1); }} placeholder="Ad, e-posta, konum, düzey…" className="adm-input" style={{ paddingLeft: 44 }} />
                                        </label>
                                        <label className="flex items-center gap-2 shrink-0">
                                            <span className="adm-label">Sırala</span>
                                            <select value={sort} onChange={function (e) { setSort(e.target.value); }} className="adm-input" style={{ width: "auto" }}>
                                                <option value="recent">Son çalışma</option>
                                                <option value="questions">Soru sayısı</option>
                                                <option value="name">Ad (A–Z)</option>
                                                <option value="joined">Kayıt tarihi</option>
                                            </select>
                                        </label>
                                    </div>
                                    <div className="adm-seg mt-3" role="group" aria-label="Filtre">
                                        {[["all", "Tümü", counts.all], ["active", "Bugün aktif", counts.active], ["idle7", "7+ gün pasif", counts.idle7], ["premium", "Premium", counts.premium],
                                            ["pending", "Talep bekleyen", counts.pending], ["blocked", "Engelli", counts.blocked], ["lisans", "Lisans"], ["onlisans", "Ön lisans"], ["ortaogretim", "Ortaöğretim"]].map(function (f) {
                                            return <button key={f[0]} type="button" aria-pressed={filter === f[0]} onClick={function () { setFilter(f[0]); setPage(1); }}>{f[1]}{f[2] != null ? " · " + f[2] : ""}</button>;
                                        })}
                                    </div>
                                </div>

                                {loading && !users.length ? <div className="adm-skel" style={{ height: 260 }}></div> : !filtered.length ? (
                                    <Empty icon="search" title="Eşleşen kullanıcı yok" text={users.length ? "Aramayı ya da filtreyi değiştir." : "Liste boş."} />
                                ) : (
                                    <div>
                                        {/* masaüstü tablo */}
                                        <div className="adm-card overflow-hidden hidden md:block">
                                            <div className="overflow-x-auto">
                                                <table className="adm-table">
                                                    <thead><tr>
                                                        <th scope="col">Kullanıcı</th><th scope="col">Düzey</th><th scope="col">Son çalışma</th>
                                                        <th scope="col" style={{ textAlign: "right" }}>Soru</th><th scope="col">Durum</th><th scope="col"><span className="sr-only">Aç</span></th>
                                                    </tr></thead>
                                                    <tbody>
                                                        {pageRows.map(function (u) {
                                                            var ls = lastSeen(u.last_study_at);
                                                            return (
                                                                <tr key={u.user_id} className="adm-row" tabIndex={0} onClick={function () { openDetail(u.user_id); }}
                                                                    onKeyDown={function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openDetail(u.user_id); } }}
                                                                    aria-label={(u.nickname || "Kullanıcı") + " ayrıntısını aç"}>
                                                                    <td>
                                                                        <div className="flex items-center gap-3 min-w-0">
                                                                            <span className={"adm-avatar" + (u.premium ? " adm-avatar-gold" : "")}>{initial(u.nickname)}</span>
                                                                            <div className="min-w-0">
                                                                                <div className="font-bold truncate max-w-[220px]">{u.nickname || "—"}{u.role === "admin" && <span className="adm-chip adm-chip-navy ml-2">Yönetici</span>}</div>
                                                                                <div className="text-xs adm-muted truncate max-w-[260px]">{u.email || u.location || String(u.user_id || "").slice(0, 8)}</div>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td><span className="adm-chip">{eduLabel(u.education_level)}</span></td>
                                                                    <td><span className={"adm-chip adm-chip-" + ls.tone}>{ls.t}</span></td>
                                                                    <td style={{ textAlign: "right" }} className="font-bold">{num(u.questions_total)}</td>
                                                                    <td>
                                                                        <div className="flex flex-wrap gap-1.5">
                                                                            {u.premium && <span className="adm-chip adm-chip-gold">Premium</span>}
                                                                            {u.blocked && <span className="adm-chip adm-chip-rose">Engelli</span>}
                                                                            {u.edu_request && <span className="adm-chip adm-chip-teal">Talep</span>}
                                                                            {!u.premium && !u.blocked && !u.edu_request && <span className="adm-muted text-xs">Ücretsiz</span>}
                                                                        </div>
                                                                    </td>
                                                                    <td style={{ textAlign: "right" }}><Ico n="arrow" className="w-4 h-4 adm-muted inline" /></td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        {/* mobil kartlar */}
                                        <ul className="md:hidden space-y-2.5">
                                            {pageRows.map(function (u) {
                                                var ls = lastSeen(u.last_study_at);
                                                return (
                                                    <li key={u.user_id}>
                                                        <button type="button" className="adm-card adm-row w-full text-left p-4 flex items-center gap-3" onClick={function () { openDetail(u.user_id); }}>
                                                            <span className={"adm-avatar" + (u.premium ? " adm-avatar-gold" : "")}>{initial(u.nickname)}</span>
                                                            <span className="min-w-0 flex-1">
                                                                <span className="block font-bold truncate">{u.nickname || "—"}</span>
                                                                <span className="flex flex-wrap gap-1.5 mt-1.5">
                                                                    <span className="adm-chip">{eduLabel(u.education_level)}</span>
                                                                    <span className={"adm-chip adm-chip-" + ls.tone}>{ls.t}</span>
                                                                    {u.premium && <span className="adm-chip adm-chip-gold">Premium</span>}
                                                                    {u.blocked && <span className="adm-chip adm-chip-rose">Engelli</span>}
                                                                    {u.edu_request && <span className="adm-chip adm-chip-teal">Talep</span>}
                                                                </span>
                                                            </span>
                                                            <span className="text-right shrink-0"><span className="block font-extrabold">{num(u.questions_total)}</span><span className="text-[11px] adm-muted">soru</span></span>
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                        <div className="flex items-center justify-between gap-3 mt-4">
                                            <span className="text-sm adm-muted">{num((curPage - 1) * PAGE + 1)}–{num(Math.min(curPage * PAGE, filtered.length))} / {num(filtered.length)}</span>
                                            {pages > 1 && (
                                                <div className="flex items-center gap-2">
                                                    <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" disabled={curPage <= 1} onClick={function () { setPage(curPage - 1); }} aria-label="Önceki sayfa">‹ Önceki</button>
                                                    <span className="text-sm font-bold">{curPage} / {pages}</span>
                                                    <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" disabled={curPage >= pages} onClick={function () { setPage(curPage + 1); }} aria-label="Sonraki sayfa">Sonraki ›</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ================= ANALİZ ================= */}
                        {tab === "analiz" && (
                            <div>
                                <Head eyebrow="Öğrenme verisi" title="Analiz" right={refreshBtn} sub="Öğrencilerin en çok zorlandığı konular ve kitle dağılımı." />
                                <div className="grid lg:grid-cols-3 gap-4">
                                    <section className="adm-card p-5 lg:col-span-2" aria-labelledby="adm-hard-t">
                                        <h2 id="adm-hard-t" className="font-extrabold">En çok zorlanılan konular</h2>
                                        <p className="text-xs adm-muted mb-4">Yanlış ağırlığı toplamına göre ilk 10</p>
                                        {!hard.length ? <p className="text-sm adm-muted">Henüz yeterli veri yok.</p> : (
                                            <ol className="space-y-3.5">
                                                {hard.map(function (h, i) {
                                                    var top = Number(hard[0].wrong_weight) || 1;
                                                    return (
                                                        <li key={i} className="flex items-center gap-3">
                                                            <span className="w-6 text-sm font-extrabold adm-muted text-right">{i + 1}</span>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex justify-between gap-3 text-sm mb-1.5">
                                                                    <span className="font-bold truncate">{h.konu || "—"} <span className="adm-muted font-semibold">· {h.ders || ""}</span></span>
                                                                    <span className="adm-muted shrink-0">{num(h.users)} kişi</span>
                                                                </div>
                                                                <div className="adm-meter adm-meter-rose"><span style={{ width: Math.max(3, Math.round(((Number(h.wrong_weight) || 0) / top) * 100)) + "%" }}></span></div>
                                                            </div>
                                                        </li>
                                                    );
                                                })}
                                            </ol>
                                        )}
                                    </section>
                                    <section className="adm-card p-5" aria-labelledby="adm-dist-t">
                                        <h2 id="adm-dist-t" className="font-extrabold mb-4">Eğitim düzeyi</h2>
                                        <Dist data={ov && ov.by_level} label={eduLabel} />
                                        <h2 className="font-extrabold mt-6 mb-4">Platform</h2>
                                        <Dist data={ov && ov.by_platform} label={platformLabel} meter="adm-meter-gold" />
                                        <h2 className="font-extrabold mt-6 mb-3">Etkileşim</h2>
                                        <div className="grid grid-cols-2 gap-3 text-center">
                                            <div className="rounded-2xl p-3" style={{ background: "var(--a-soft)" }}><div className="text-xl font-extrabold">{ov && ov.mau ? "%" + Math.round((ov.dau / ov.mau) * 100) : "—"}</div><div className="text-xs adm-muted">Günlük / aylık</div></div>
                                            <div className="rounded-2xl p-3" style={{ background: "var(--a-soft)" }}><div className="text-xl font-extrabold">{ov && ov.users ? "%" + Math.round((ov.mau / ov.users) * 100) : "—"}</div><div className="text-xs adm-muted">30 günde aktif</div></div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        )}

                        {/* ================= DUYURULAR ================= */}
                        {tab === "duyuru" && (
                            <div>
                                <Head eyebrow="İletişim" title="Duyurular" right={refreshBtn} sub="Yayınladığın duyuru tüm öğrencilerin Bugün ekranının üstünde bant olarak görünür." />
                                <div className="grid lg:grid-cols-5 gap-4">
                                    <section className="adm-card p-5 lg:col-span-3" aria-labelledby="adm-new-t">
                                        <h2 id="adm-new-t" className="font-extrabold mb-3">Yeni duyuru</h2>
                                        <label className="block">
                                            <span className="sr-only">Duyuru metni</span>
                                            <textarea className="adm-input" maxLength={500} value={annText} onChange={function (e) { setAnnText(e.target.value); }}
                                                placeholder="Örn: Pazar 10.00'da canlı deneme var, kaydını unutma!" />
                                        </label>
                                        <div className="flex justify-between text-xs adm-muted mt-1.5"><span>Düz metin; bağlantı ve biçim eklenmez.</span><span>{annText.length}/500</span></div>
                                        <div className="mt-4">
                                            <div className="adm-label mb-2">Yayında kalma süresi</div>
                                            <div className="adm-seg" role="group" aria-label="Yayın süresi">
                                                {[["6", "6 saat"], ["24", "1 gün"], ["72", "3 gün"], ["168", "1 hafta"], ["0", "Süresiz"]].map(function (h) {
                                                    return <button key={h[0]} type="button" aria-pressed={annHours === h[0]} onClick={function () { setAnnHours(h[0]); }}>{h[1]}</button>;
                                                })}
                                            </div>
                                        </div>
                                        {annText.trim() && (
                                            <div className="mt-5">
                                                <div className="adm-label mb-2">Öğrencinin göreceği</div>
                                                <div className="adm-banner text-sm font-semibold leading-relaxed">📢 {annText.trim()}</div>
                                            </div>
                                        )}
                                        <div className="flex justify-end mt-5">
                                            <button type="button" className="adm-btn adm-btn-gold" disabled={!annText.trim() || !!busy}
                                                onClick={function () {
                                                    setConfirm({ tone: "ok", icon: "duyuru", title: "Duyuru yayınlansın mı?", okLabel: "Yayınla",
                                                        body: "Tüm öğrencilere " + (annHours === "0" ? "süresiz" : ({ "6": "6 saat", "24": "1 gün", "72": "3 gün", "168": "1 hafta" })[annHours] + " boyunca") + " gösterilir.", onOk: publish });
                                                }}>{busy === "announce" ? <span className="adm-spin"></span> : <Ico n="duyuru" />}Yayınla</button>
                                        </div>
                                    </section>
                                    <section className="lg:col-span-2" aria-labelledby="adm-ann-t">
                                        <h2 id="adm-ann-t" className="font-extrabold mb-3">Yayınlananlar <span className="adm-muted font-semibold">· {ann.length}</span></h2>
                                        {!ann.length ? <Empty icon="duyuru" title="Henüz duyuru yok" /> : (
                                            <ul className="space-y-3">
                                                {ann.map(function (a) {
                                                    return (
                                                        <li key={a.id || a.createdAt} className="adm-card p-4">
                                                            <div className="flex items-start gap-3">
                                                                <p className="text-sm font-semibold leading-relaxed flex-1 min-w-0 break-words">{a.text || "—"}</p>
                                                                <span className={"adm-chip " + (a.live ? "adm-chip-green" : "")}>{a.live ? "Yayında" : "Süresi doldu"}</span>
                                                            </div>
                                                            <div className="flex items-center justify-between gap-3 mt-3">
                                                                <span className="text-xs adm-muted">{fmtDateTime(a.createdAt)} · {a.expiresAt ? "bitiş " + fmtDateTime(a.expiresAt) : "süresiz"}</span>
                                                                <button type="button" className="adm-btn adm-btn-soft-danger adm-btn-sm" disabled={!a.id || !!busy} aria-label="Duyuruyu sil"
                                                                    onClick={function () { setConfirm({ tone: "danger", icon: "trash", title: "Duyuru silinsin mi?", body: "Öğrencilerin ekranındaki bant da kalkar.", okLabel: "Sil", onOk: function () { removeAnn(a); } }); }}>
                                                                    <Ico n="trash" />Sil
                                                                </button>
                                                            </div>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </section>
                                </div>
                            </div>
                        )}

                        {tab === "deneme" && <LiveAdminHost />}

                        {/* ================= İŞLEM GEÇMİŞİ ================= */}
                        {tab === "gecmis" && (
                            <div>
                                <Head eyebrow="Denetim" title="İşlem geçmişi" right={refreshBtn} sub="Yönetici işlemleri ve reddedilen yetkisiz denemeler (son 120 kayıt)." />
                                {audit === null ? (
                                    <Empty icon="gecmis" title="İşlem geçmişi kapalı" text="Supabase SQL Editor'da supabase/patch-admin-panel.sql dosyasını çalıştırınca açılır." />
                                ) : !audit.length ? <Empty icon="gecmis" title="Henüz kayıt yok" /> : (
                                    <div className="adm-card overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="adm-table">
                                                <thead><tr><th scope="col">Zaman</th><th scope="col">İşlem</th><th scope="col">Yapan</th><th scope="col">Hedef</th><th scope="col">Ayrıntı</th></tr></thead>
                                                <tbody>
                                                    {audit.map(function (a, i) {
                                                        return (
                                                            <tr key={i}>
                                                                <td className="whitespace-nowrap adm-muted text-xs">{fmtDateTime(a.at)}</td>
                                                                <td><span className={"adm-chip " + (a.ok === false ? "adm-chip-rose" : "adm-chip-teal")}>{a.ok === false ? "Reddedildi · " : ""}{ACTION_LABELS[a.action] || a.action}</span></td>
                                                                <td className="font-semibold">{a.actor || "—"}</td>
                                                                <td>{a.target || "—"}</td>
                                                                <td className="adm-muted text-xs max-w-[280px] truncate">{cleanDetail(a.detail)}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </main>
                </div>

                {/* ---------- kullanıcı ayrıntısı ---------- */}
                {sel && (
                    <div>
                        <div className="adm-scrim" onClick={closeDetail}></div>
                        <div className="adm-drawer" role="dialog" aria-modal="true" aria-labelledby="adm-user-t">
                            <div className="adm-drawer-head">
                                <div className="adm-hero-grid"></div>
                                <div className="relative flex items-start gap-3">
                                    <span className={"adm-avatar" + (selUser && selUser.premium ? " adm-avatar-gold" : "")} style={{ width: 52, height: 52, fontSize: 20, borderRadius: 16 }}>{initial((detail && detail.nickname) || (selUser && selUser.nickname))}</span>
                                    <div className="min-w-0 flex-1">
                                        <h2 id="adm-user-t" className="text-xl font-extrabold truncate">{(detail && detail.nickname) || (selUser && selUser.nickname) || "Kullanıcı"}</h2>
                                        <div className="text-sm text-white/75 truncate">{(detail && (detail.email || detail.name)) || (selUser && selUser.email) || ""}</div>
                                    </div>
                                    <button type="button" className="adm-btn adm-btn-glass adm-btn-sm" onClick={closeDetail} aria-label="Kapat"><Ico n="x" /></button>
                                </div>
                            </div>
                            <div className="p-5 space-y-4">
                                {detailErr && <div className="adm-alert adm-alert-err" role="alert"><Ico n="warn" className="w-5 h-5 shrink-0" /><span>{detailErr}</span></div>}
                                {!detail && !detailErr && <div className="space-y-3"><div className="adm-skel" style={{ height: 90 }}></div><div className="adm-skel" style={{ height: 140 }}></div></div>}
                                {detail && (
                                    <div className="space-y-4">
                                        <div className="flex flex-wrap gap-1.5">
                                            <span className="adm-chip adm-chip-navy">{eduLabel(detail.education_level)}</span>
                                            <span className="adm-chip">{trackLabel(detail.target_type)}</span>
                                            <span className="adm-chip">{platformLabel(detail.platform)}</span>
                                            {detail.location && <span className="adm-chip">{detail.location}</span>}
                                            {detail.premium && <span className="adm-chip adm-chip-gold">Premium{detail.premium_until ? " · " + fmtDate(detail.premium_until) + "'e kadar" : ""}</span>}
                                            {detail.blocked && <span className="adm-chip adm-chip-rose">Engelli</span>}
                                            {detail.role === "admin" && <span className="adm-chip adm-chip-navy">Yönetici</span>}
                                        </div>
                                        <div className="grid grid-cols-3 gap-2.5">
                                            {[["Soru", num(detail.questions_total || (detail.counters && detail.counters.questions))], ["Yanlış defteri", num(detail.wrong_count)],
                                                ["Seri", num(detail.streak && (detail.streak.current || detail.streak.count))]].map(function (x) {
                                                return <div key={x[0]} className="adm-card p-3 text-center"><div className="text-xl font-extrabold">{x[1]}</div><div className="text-[11px] adm-muted font-bold">{x[0]}</div></div>;
                                            })}
                                        </div>
                                        <div className="adm-card p-4 text-sm space-y-2">
                                            {[["Son çalışma", lastSeen(detail.last_study_at).t + (detail.last_study_at ? " · " + fmtDate(detail.last_study_at) : "")],
                                                ["Kayıt", fmtDate(detail.created_at)], ["Sınav tarihi", fmtDate(detail.exam_date)],
                                                ["Son eşitleme", fmtDateTime(detail.updated_at)], ["Kullanıcı kimliği", detail.user_id]].map(function (x) {
                                                return <div key={x[0]} className="flex justify-between gap-4"><span className="adm-muted shrink-0">{x[0]}</span><span className={"text-right break-all " + (x[0] === "Kullanıcı kimliği" ? "font-mono text-xs adm-muted" : "font-semibold")}>{x[1] || "—"}</span></div>;
                                            })}
                                        </div>
                                        {Array.isArray(detail.days) && detail.days.length > 0 && (
                                            <div className="adm-card p-4">
                                                <div className="font-extrabold text-sm mb-3">Son çalışma günleri</div>
                                                <ul className="space-y-2">
                                                    {detail.days.slice(0, 7).map(function (d) {
                                                        var pct = d.q ? Math.round((d.c / d.q) * 100) : 0;
                                                        return (
                                                            <li key={d.day} className="flex items-center gap-3 text-sm">
                                                                <span className="w-16 shrink-0 adm-muted">{fmtDate(d.day).replace(/ \d{4}$/, "")}</span>
                                                                <div className="adm-meter flex-1"><span style={{ width: pct + "%" }}></span></div>
                                                                <span className="w-28 text-right shrink-0 font-semibold text-xs whitespace-nowrap">{d.q} soru · %{pct}</span>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        )}
                                        {detail.edu_request && (
                                            <div className="adm-card p-4 text-sm flex items-center gap-3">
                                                <span className="adm-ico adm-ico-gold"><Ico n="talepler" /></span>
                                                <div className="flex-1">
                                                    <div className="font-bold">Eğitim talebi: {eduLabel(detail.edu_request.from)} → {eduLabel(detail.edu_request.to)}</div>
                                                    <div className="adm-muted text-xs">{({ pending: "Onay bekliyor", rejected: "Reddedildi", approved: "Onaylandı" })[detail.edu_request.status] || detail.edu_request.status} · {fmtDateTime(detail.edu_request.at)}</div>
                                                </div>
                                                {detail.edu_request.status === "pending" && <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={function () { closeDetail(); go("talepler"); }}>Talepler</button>}
                                            </div>
                                        )}

                                        {detail.role !== "admin" && (
                                            <div className="space-y-3">
                                                <div className="adm-card p-4">
                                                    <div className="flex items-center gap-2 font-extrabold text-sm mb-3"><Ico n="star" className="w-5 h-5" style={{ color: "var(--a-gold)" }} />Premium</div>
                                                    {detail.premium ? (
                                                        <button type="button" className="adm-btn adm-btn-ghost w-full" disabled={!!busy}
                                                            onClick={function () { setConfirm({ tone: "danger", icon: "star", title: "Premium kaldırılsın mı?", body: (detail.nickname || "Kullanıcı") + " ücretsiz plana döner.", okLabel: "Premium'u kaldır", onOk: function () { setPremium(selUser, 0); } }); }}>
                                                            {busy === "premium:" + detail.user_id ? <span className="adm-spin"></span> : null}Premium'u kaldır
                                                        </button>
                                                    ) : (
                                                        <div>
                                                            <div className="adm-seg mb-3" role="group" aria-label="Premium süresi">
                                                                {[7, 30, 90, 365].map(function (d) { return <button key={d} type="button" aria-pressed={grantDays === d} onClick={function () { setGrantDays(d); }}>{d === 365 ? "1 yıl" : d + " gün"}</button>; })}
                                                            </div>
                                                            <button type="button" className="adm-btn adm-btn-gold w-full" disabled={!!busy}
                                                                onClick={function () { var d = grantDays; setConfirm({ tone: "ok", icon: "star", title: d + " gün Premium verilsin mi?", body: (detail.nickname || "Kullanıcı") + " için Premium bugünden itibaren " + d + " gün açık kalır.", okLabel: "Premium ver", onOk: function () { setPremium(selUser, d); } }); }}>
                                                                {busy === "premium:" + detail.user_id ? <span className="adm-spin"></span> : <Ico n="star" />}Premium ver
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="adm-card p-4">
                                                    <div className="font-extrabold text-sm mb-3">Hesap</div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {detail.blocked ? (
                                                            <button type="button" className="adm-btn adm-btn-ok" disabled={!!busy}
                                                                onClick={function () { setConfirm({ tone: "ok", icon: "check", title: "Engel kaldırılsın mı?", body: (detail.nickname || "Kullanıcı") + " uygulamayı yeniden kullanabilir.", okLabel: "Engeli kaldır", onOk: function () { setBlocked(selUser, false); } }); }}>
                                                                <Ico n="check" />Engeli kaldır
                                                            </button>
                                                        ) : (
                                                            <button type="button" className="adm-btn adm-btn-soft-danger" disabled={!!busy}
                                                                onClick={function () { setConfirm({ tone: "danger", icon: "ban", title: "Kullanıcı engellensin mi?", body: (detail.nickname || "Kullanıcı") + " giriş yapınca \"Hesap kısıtlı\" ekranını görür. İstediğin zaman kaldırabilirsin.", okLabel: "Engelle", onOk: function () { setBlocked(selUser, true); } }); }}>
                                                                <Ico n="ban" />Engelle
                                                            </button>
                                                        )}
                                                        <button type="button" className="adm-btn adm-btn-danger" disabled={!!busy || detail.user_id === myId}
                                                            onClick={function () { setConfirm({ tone: "danger", icon: "trash", title: "Hesap kalıcı olarak silinsin mi?", body: (detail.nickname || "Kullanıcı") + " ve tüm çalışma verisi silinir, bir daha giriş yapamaz. Bu işlem geri alınamaz.", okLabel: "Kalıcı olarak sil", onOk: function () { deleteUser(selUser); } }); }}>
                                                            <Ico n="trash" />Sil
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {confirm && <Confirm {...confirm} onClose={function () { setConfirm(null); }} />}
                {toast && (
                    <div className={"adm-toast " + (toast.ok ? "adm-toast-ok" : "adm-toast-err")} role={toast.ok ? "status" : "alert"}>
                        <Ico n={toast.ok ? "check" : "warn"} className="w-5 h-5 shrink-0 mt-0.5" />
                        <span className="flex-1">{toast.text}</span>
                        <button type="button" onClick={function () { setToast(null); }} aria-label="Bildirimi kapat" className="shrink-0 opacity-80 hover:opacity-100"><Ico n="x" className="w-5 h-5" /></button>
                    </div>
                )}
            </div>
        );
    }

    // Canlı deneme yönetimi ayrı dosyada; sekme açılınca yüklenir.
    function LiveAdminHost() {
        const [Cmp, setCmp] = React.useState(function () { return (window.KpssComponents && window.KpssComponents.LiveExamAdmin) || null; });
        const [err, setErr] = React.useState("");
        React.useEffect(function () {
            if (Cmp || !window.JsxLoader) return;
            window.JsxLoader.load("LiveExamAdmin", "js/components/LiveExamAdmin.jsx").then(function (C) {
                if (C) setCmp(function () { return C; }); else setErr("Canlı deneme yönetimi yüklenemedi. Sayfayı yenile.");
            }).catch(function (e) { setErr("Canlı deneme yönetimi yüklenemedi: " + String(e && e.message || e)); });
        }, []);
        if (err) return <div className="adm-alert adm-alert-err" role="alert">{err}</div>;
        return Cmp ? <Cmp /> : <div className="adm-skel" style={{ height: 240 }}></div>;
    }

    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.AdminDashboard = AdminDashboard;
})();
