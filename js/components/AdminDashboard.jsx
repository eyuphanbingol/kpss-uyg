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
        const [q, setQ] = useState("");
        const [filter, setFilter] = useState("all");
        const [msg, setMsg] = useState("");
        const [busy, setBusy] = useState(false);
        const isAdmin = student.userProfile && student.userProfile.role === "admin";

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
                load();
            }
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
            { id: "kullanicilar", t: "Kullanıcılar" }
        ];

        var email = (student.userProfile && student.userProfile.email) || "";

        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex">
                <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                    <div className="px-5 py-6">
                        <p className="text-xs font-semibold tracking-widest text-zinc-400">KPSS</p>
                        <p className="text-lg font-semibold mt-1">Yönetim</p>
                        <p className="text-xs text-zinc-400 mt-2 truncate">{email}</p>
                    </div>
                    <nav className="px-3 space-y-1 flex-1">
                        {nav.map(function (n) {
                            return (
                                <button key={n.id} onClick={function () { setTab(n.id); }}
                                    className={"w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium " + (tab === n.id ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800")}>
                                    {n.t}
                                </button>
                            );
                        })}
                    </nav>
                    <div className="p-4">
                        <button onClick={props.onSignOut} className="w-full py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-medium">Çıkış</button>
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
                                <p className="text-sm text-zinc-500 mt-8">Öğrenci uygulaması bu hesapta açılmaz. Kullanıcılar sekmesinden hesapları yönetirsin.</p>
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
                                                    <tr key={u.user_id || u.nickname} className="border-b border-zinc-100 dark:border-zinc-800 last:border-0">
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
                                                                <button disabled={busy} onClick={function () { act("grant_premium", { user_id: u.user_id, days: 30 }); }} className="text-xs font-medium px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800">+30g Premium</button>
                                                                <button disabled={busy} onClick={function () { act("block", { user_id: u.user_id }); }} className="text-xs font-medium px-2 py-1 rounded-lg text-rose-600">Engelle</button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
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
