(function () {
    const { useEffect, useState } = React;

    function fmtDate(x) {
        if (!x) return "—";
        try {
            var d = new Date(x);
            if (isNaN(d.getTime())) return String(x).slice(0, 10);
            return d.toLocaleDateString("tr-TR");
        } catch (e) { return "—"; }
    }

    function AdminDashboard(props) {
        const student = props.student;
        const [tab, setTab] = useState("ozet");
        const [rows, setRows] = useState([]);
        const [kpi, setKpi] = useState(null);
        const [hard, setHard] = useState([]);
        const [announce, setAnnounce] = useState("");
        const [detail, setDetail] = useState(null);
        const [q, setQ] = useState("");
        const [filter, setFilter] = useState("all");
        const [msg, setMsg] = useState("");
        const [busy, setBusy] = useState(false);
        const [log, setLog] = useState([]);
        const [eduReqs, setEduReqs] = useState([]);
        const isAdmin = student.userProfile && student.userProfile.role === "admin";

        function eduLabel(id) {
            if (id === "onlisans") return "Ön lisans";
            if (id === "ortaogretim") return "Ortaöğretim";
            if (id === "lisans") return "Lisans";
            return id || "—";
        }

        function load() {
            var sb = window.SupabaseClient && window.SupabaseClient.get();
            if (!sb) { setMsg("Veritabanı bağlı değil."); return; }
            sb.rpc("admin_kpis").then(function (r) {
                if (r.error) setMsg("Özet: " + r.error.message);
                else setKpi(r.data);
            }).catch(function (e) { setMsg("Ağ hatası: " + (e && e.message)); });
            sb.rpc("admin_user_list").then(function (r) {
                if (!r.error && r.data) {
                    setRows(Array.isArray(r.data) ? r.data : []);
                    return;
                }
                return sb.from("admin_user_directory").select("*").limit(200).then(function (r2) {
                    if (r2.error) setMsg("Kullanıcı listesi: " + (r.error && r.error.message ? r.error.message + " · " : "") + r2.error.message);
                    else setRows(r2.data || []);
                });
            }).catch(function () {
                sb.from("admin_user_directory").select("*").limit(200).then(function (r2) {
                    if (r2.error) setMsg("Liste alınamadı. admin_user_list SQL fonksiyonunu çalıştır.");
                    else setRows(r2.data || []);
                });
            });
            sb.rpc("admin_hard_topics").then(function (r) {
                if (!r.error && r.data) setHard(Array.isArray(r.data) ? r.data : []);
            });
            sb.functions.invoke("admin-action", { body: { action: "list_edu_requests" } }).then(function (r) {
                if (r.error) return;
                var list = (r.data && r.data.data) || [];
                setEduReqs(Array.isArray(list) ? list : []);
            });
        }

        useEffect(function () {
            if (isAdmin) load();
        }, [isAdmin]);

        async function act(name, payload) {
            var sb = window.SupabaseClient && window.SupabaseClient.get();
            if (!sb) { setMsg("Supabase yok"); return; }
            setBusy(true);
            var res = await sb.functions.invoke("admin-action", { body: Object.assign({ action: name }, payload) });
            setBusy(false);
            if (res.error) setMsg(res.error.message);
            else {
                setMsg("İşlem uygulandı.");
                setLog(function (L) {
                    return [{ t: name, at: new Date().toLocaleTimeString("tr-TR") }].concat(L).slice(0, 10);
                });
                if (name === "inspect_user" && res.data) {
                    setDetail(res.data.data || res.data);
                }
                load();
            }
        }

        async function inspect(uid) {
            var sb = window.SupabaseClient && window.SupabaseClient.get();
            if (!sb) return;
            setBusy(true);
            var res = await sb.functions.invoke("admin-action", { body: { action: "inspect_user", user_id: uid } });
            setBusy(false);
            if (res.error) setMsg(res.error.message);
            else setDetail((res.data && res.data.data) || res.data);
        }

        if (!isAdmin) {
            return (
                <div className="min-h-screen flex items-center justify-center p-8">
                    <div className="text-center max-w-sm">
                        <h1 className="text-xl font-semibold mb-2">Yetki yok</h1>
                        <p className="text-sm text-zinc-500 mb-6">Bu hesap admin değil.</p>
                        <button onClick={props.onSignOut} className="px-4 py-2 rounded-xl border font-medium">Çıkış</button>
                    </div>
                </div>
            );
        }

        var shown = rows.filter(function (u) {
            var hay = ((u.nickname || "") + (u.email || "") + (u.target_type || "") + (u.education_level || "") + (u.user_id || "")).toLowerCase();
            if (q && hay.indexOf(q.toLowerCase()) < 0) return false;
            if (filter === "premium" && !u.premium) return false;
            if (filter === "lisans" && u.education_level !== "lisans") return false;
            if (filter === "idle7") {
                if (!u.last_study_at) return true;
                return (Date.now() - new Date(u.last_study_at).getTime()) > 7 * 86400000;
            }
            return true;
        });

        var nav = [
            { id: "ozet", t: "Özet" },
            { id: "talepler", t: "Talepler" + (eduReqs.length ? " (" + eduReqs.length + ")" : "") },
            { id: "kullanicilar", t: "Kullanıcılar" },
            { id: "analiz", t: "Analiz" },
            { id: "icerik", t: "Duyuru" }
        ];

        var email = (student.userProfile && student.userProfile.email) || "";

        return (
            <div className="min-h-screen bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-50 flex">
                <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-stone-800 bg-stone-900 text-stone-100">
                    <div className="px-5 py-6">
                        <p className="text-xs font-semibold tracking-widest text-zinc-400">KPSS</p>
                        <p className="text-lg font-semibold mt-1">Yönetim</p>
                        <p className="text-xs text-zinc-400 mt-2 truncate">{email}</p>
                    </div>
                    <nav className="px-3 space-y-1 flex-1">
                        {nav.map(function (n) {
                            return (
                                <button key={n.id} onClick={function () { setTab(n.id); }}
                                    className={"w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium " + (tab === n.id ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-900")}>
                                    {n.t}
                                </button>
                            );
                        })}
                    </nav>
                    <div className="p-4">
                        <button onClick={props.onSignOut} className="w-full py-2.5 rounded-lg border border-slate-700 text-sm font-medium">Çıkış</button>
                    </div>
                </aside>
                <div className="flex-1 min-w-0">
                    <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-zinc-200 bg-white">
                        <span className="font-semibold">Yönetim</span>
                        <button onClick={props.onSignOut} className="text-sm font-medium">Çıkış</button>
                    </header>
                    <div className="md:hidden flex gap-2 px-4 py-3">
                        {nav.map(function (n) {
                            return (
                                <button key={n.id} onClick={function () { setTab(n.id); }}
                                    className={"px-3 py-1.5 rounded-lg text-sm font-medium " + (tab === n.id ? "bg-zinc-900 text-white" : "bg-white border")}>{n.t}</button>
                            );
                        })}
                    </div>
                    <main className="p-4 md:p-8 max-w-6xl">
                        {msg ? <div className="mb-4 text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">{msg}</div> : null}

                        {tab === "ozet" ? (
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight mb-6">Özet</h1>
                                <div className="grid sm:grid-cols-3 gap-3">
                                    <div className="panel rounded-2xl p-5">
                                        <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Kayıtlı kullanıcı</p>
                                        <p className="text-3xl font-semibold mt-2">{kpi ? kpi.users : "—"}</p>
                                    </div>
                                    <div className="panel rounded-2xl p-5">
                                        <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Bugün çalışan</p>
                                        <p className="text-3xl font-semibold mt-2">{kpi ? kpi.dau : "—"}</p>
                                    </div>
                                    <div className="panel rounded-2xl p-5">
                                        <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Son 30 gün</p>
                                        <p className="text-3xl font-semibold mt-2">{kpi ? kpi.mau : "—"}</p>
                                    </div>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-3 mt-3">
                                    <div className="panel rounded-2xl p-5">
                                        <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Premium</p>
                                        <p className="text-3xl font-semibold mt-2">{rows.filter(function (u) { return u.premium; }).length}</p>
                                    </div>
                                    <div className="panel rounded-2xl p-5">
                                        <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Tahmini ciro (mock)</p>
                                        <p className="text-3xl font-semibold mt-2">{rows.filter(function (u) { return u.premium; }).length * 149} ₺</p>
                                        <p className="text-xs text-zinc-400 mt-1">149 ₺ / ay varsayımı · gerçek ödeme yok</p>
                                    </div>
                                </div>
                                <p className="text-sm text-zinc-500 mt-8">Öğrenci uygulaması bu hesapta açılmaz.</p>
                                {log.length ? (
                                    <div className="mt-6 text-xs text-zinc-400 space-y-1">
                                        <p className="uppercase tracking-wider">İşlem geçmişi (oturum)</p>
                                        {log.map(function (x, i) {
                                            return <div key={i}>{x.at} · {x.t}</div>;
                                        })}
                                    </div>
                                ) : null}
                            </div>
                        ) : null}

                        {tab === "talepler" ? (
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight mb-2">Eğitim değişiklik talepleri</h1>
                                <p className="text-sm text-zinc-500 mb-6">Öğrenci kayıtta seçtiği düzeyi kendi değiştiremez. Onaylarsan sınav tarihi de ÖSYM takvimine çekilir.</p>
                                {eduReqs.length === 0 ? (
                                    <div className="panel rounded-2xl p-8 text-sm text-zinc-400">Bekleyen talep yok.</div>
                                ) : (
                                    <div className="panel rounded-2xl overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="text-left text-xs text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
                                                    <th className="font-medium px-4 py-3">Kullanıcı</th>
                                                    <th className="font-medium px-4 py-3">Şu an</th>
                                                    <th className="font-medium px-4 py-3">İstenen</th>
                                                    <th className="font-medium px-4 py-3">Tarih</th>
                                                    <th className="font-medium px-4 py-3"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {eduReqs.map(function (r) {
                                                    return (
                                                        <tr key={r.user_id} className="border-b border-zinc-200 last:border-0">
                                                            <td className="px-4 py-3">
                                                                <div className="font-medium">{r.nickname || "—"}</div>
                                                                <div className="text-xs text-zinc-400">{(r.user_id || "").slice(0, 8)}</div>
                                                            </td>
                                                            <td className="px-4 py-3">{eduLabel(r.from)}</td>
                                                            <td className="px-4 py-3 font-medium">{eduLabel(r.to)}</td>
                                                            <td className="px-4 py-3 text-zinc-600">{fmtDate(r.at)}</td>
                                                            <td className="px-4 py-3">
                                                                <div className="flex gap-1 justify-end">
                                                                    <button disabled={busy} onClick={function () { act("approve_edu", { user_id: r.user_id, to: r.to }); }}
                                                                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-navy-600 text-white">Onayla</button>
                                                                    <button disabled={busy} onClick={function () { act("reject_edu", { user_id: r.user_id }); }}
                                                                        className="text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-200">Reddet</button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        ) : null}

                        {tab === "kullanicilar" ? (
                            <div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                                    <h1 className="text-2xl font-semibold tracking-tight">Kullanıcılar</h1>
                                    <span className="text-sm text-zinc-400">{shown.length} kayıt</span>
                                </div>
                                <input value={q} onChange={function (e) { setQ(e.target.value); }} placeholder="Ara: ad, kulvar, eğitim…"
                                    className="w-full mb-3 px-4 py-3 rounded-xl border border-zinc-200 bg-white dark:bg-zinc-900 dark:border-zinc-700" />
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {[
                                        { id: "all", t: "Tümü" },
                                        { id: "premium", t: "Premium" },
                                        { id: "lisans", t: "Lisans" },
                                        { id: "idle7", t: "7 gün pasif" }
                                    ].map(function (f) {
                                        return (
                                            <button key={f.id} onClick={function () { setFilter(f.id); }}
                                                className={"px-3 py-1.5 rounded-lg text-sm font-medium border " + (filter === f.id ? "bg-zinc-900 text-white border-zinc-900" : "bg-white border-zinc-200")}>{f.t}</button>
                                        );
                                    })}
                                </div>
                                <div className="panel rounded-2xl overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="text-left text-xs text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
                                                <th className="font-medium px-4 py-3">Kullanıcı</th>
                                                <th className="font-medium px-4 py-3">Kulvar</th>
                                                <th className="font-medium px-4 py-3">Soru</th>
                                                <th className="font-medium px-4 py-3">Son çalışma</th>
                                                <th className="font-medium px-4 py-3">Plan</th>
                                                <th className="font-medium px-4 py-3"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {shown.length === 0 ? (
                                                <tr><td colSpan={6} className="px-4 py-10 text-center text-zinc-400">Kayıt yok veya liste yetkisi eksik.</td></tr>
                                            ) : shown.map(function (u) {
                                                return (
                                                    <tr key={u.user_id || u.nickname} className={"border-b border-zinc-200 last:border-0 " + (function () {
                                                        if (!u.last_study_at) return "bg-coral-50";
                                                        return (Date.now() - new Date(u.last_study_at).getTime()) > 7 * 86400000 ? "bg-coral-50" : "";
                                                    }())}>
                                                        <td className="px-4 py-3">
                                                            <div className="font-medium">{u.nickname || "—"}</div>
                                                            <div className="text-xs text-zinc-400">{u.education_level || ""} · {(u.user_id || "").slice(0, 8)}</div>
                                                        </td>
                                                        <td className="px-4 py-3 text-zinc-600">{u.target_type || "—"}</td>
                                                        <td className="px-4 py-3">{u.questions_total || 0}</td>
                                                        <td className="px-4 py-3 text-zinc-600">{fmtDate(u.last_study_at)}</td>
                                                        <td className="px-4 py-3">{u.premium ? "Premium" : "Ücretsiz"}</td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex flex-wrap gap-1 justify-end">
                                                                <button disabled={busy} onClick={function () {
                                                                    if (!confirm("Bu kullanıcıya 30 gün Premium verilsin mi?")) return;
                                                                    act("grant_premium", { user_id: u.user_id, days: 30 });
                                                                }} className="text-xs font-medium px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800">+30g Premium</button>
                                                                <button disabled={busy} onClick={function () { inspect(u.user_id); }} className="text-xs font-medium px-2 py-1 rounded-lg bg-zinc-100">Detay</button>
                                                                <button disabled={busy} onClick={function () { act("block", { user_id: u.user_id }); }} className="text-xs font-medium px-2 py-1 rounded-lg text-rose-600">Engelle</button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                {detail ? (
                                    <div className="mt-4 panel rounded-2xl p-4 text-sm">
                                        <p className="font-medium mb-2">Kullanıcı özeti · {detail.nickname || "—"}</p>
                                        <p className="text-zinc-500">Soru {detail.questions_total || (detail.counters && detail.counters.questions) || 0} · yanlış defteri {detail.wrongCount || 0} · kulvar {detail.target_type} · platform {detail.platform || "web"}</p>
                                        <button onClick={function () { setDetail(null); }} className="mt-3 text-xs font-medium">Kapat</button>
                                    </div>
                                ) : null}
                            </div>
                        ) : null}

                        {tab === "analiz" ? (
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight mb-6">Zor konular</h1>
                                <p className="text-sm text-zinc-500 mb-4">Türkiye genelinde yanlış ağırlığı en yüksek 10 konu.</p>
                                {hard.length === 0 ? <p className="text-sm text-zinc-400">Henüz yeterli veri yok veya admin_hard_topics SQL’i çalıştırılmadı.</p> : (
                                    <div className="panel rounded-2xl divide-y divide-zinc-100 dark:divide-zinc-800">
                                        {hard.map(function (h, i) {
                                            return (
                                                <div key={i} className="px-4 py-3 flex justify-between text-sm">
                                                    <span>{h.ders} · {h.konu}</span>
                                                    <span className="text-zinc-400">{h.wrong_weight} yanlış · {h.users} hesap</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ) : null}

                        {tab === "icerik" ? (
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight mb-6">Duyuru</h1>
                                <textarea value={announce} onChange={function (e) { setAnnounce(e.target.value); }} rows={4}
                                    className="w-full mb-3 px-4 py-3 rounded-xl border border-zinc-200 bg-white dark:bg-zinc-900 text-sm" placeholder="Öğrencilerin Bugün ekranında görünür." />
                                <button disabled={busy || !announce.trim()} onClick={function () { act("announce", { text: announce }); setAnnounce(""); }}
                                    className="px-4 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-semibold disabled:opacity-40">Yayınla</button>
                            </div>
                        ) : null}
                    </main>
                </div>
            </div>
        );
    }
    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.AdminDashboard = AdminDashboard;
})();
