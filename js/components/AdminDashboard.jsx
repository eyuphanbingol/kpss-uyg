(function () {
    const { useEffect, useState } = React;
    function AdminDashboard(props) {
        const student = props.student;
        const [rows, setRows] = useState([]);
        const [kpi, setKpi] = useState(null);
        const [q, setQ] = useState("");
        const [filter, setFilter] = useState("all");
        const [msg, setMsg] = useState("");
        const isAdmin = student.userProfile && student.userProfile.role === "admin";

        useEffect(function () {
            if (!isAdmin) return;
            var sb = window.SupabaseClient && window.SupabaseClient.get();
            if (!sb) {
                setMsg("Veritabanı bağlı değil. Edge Function olmadan liste boş kalır — client service_role kullanmaz.");
                return;
            }
            sb.rpc("admin_kpis").then(function (r) {
                if (!r.error) setKpi(r.data);
            });
            sb.from("admin_user_directory").select("*").limit(100).then(function (r) {
                if (r.error) setMsg("Admin view/RLS: " + r.error.message);
                else setRows(r.data || []);
            });
        }, [isAdmin]);

        async function act(name, payload) {
            var sb = window.SupabaseClient && window.SupabaseClient.get();
            if (!sb) { setMsg("Supabase yok"); return; }
            var res = await sb.functions.invoke("admin-action", { body: Object.assign({ action: name }, payload) });
            if (res.error) setMsg(res.error.message);
            else setMsg("İşlendi (Edge Function).");
        }

        if (!isAdmin) {
            return (
                <div className="max-w-lg mx-auto p-8 text-center pb-28">
                    <h1 className="text-2xl font-black mb-2">403</h1>
                    <p className="text-slate-500 mb-4">Yönetim paneli yalnızca admin rolü içindir.</p>
                    <button onClick={props.onBack} className="font-bold">Ana sayfa</button>
                </div>
            );
        }

        var shown = rows.filter(function (u) {
            var hay = ((u.nickname || "") + (u.email || "") + (u.target_type || "")).toLowerCase();
            if (q && hay.indexOf(q.toLowerCase()) < 0) return false;
            if (filter === "premium" && !u.premium) return false;
            if (filter === "lisans" && u.education_level !== "lisans") return false;
            if (filter === "idle7") {
                if (!u.last_study_at) return true;
                return (Date.now() - new Date(u.last_study_at).getTime()) > 7 * 86400000;
            }
            return true;
        });

        return (
            <div className="max-w-3xl mx-auto px-4 py-6 pb-28">
                <div className="flex justify-between mb-4">
                    <h1 className="text-3xl font-black">Yönetim</h1>
                    <button onClick={props.onBack} className="font-bold text-sm">Kapat</button>
                </div>
                {msg ? <p className="text-xs text-amber-700 mb-3">{msg}</p> : null}
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border"><div className="text-xs">DAU/MAU</div><div className="font-black">{kpi ? (kpi.dau + "/" + kpi.mau) : "—"}</div></div>
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border"><div className="text-xs">Kullanıcı</div><div className="font-black">{kpi ? kpi.users : rows.length}</div></div>
                </div>
                <input value={q} onChange={function (e) { setQ(e.target.value); }} placeholder="ara" className="w-full mb-2 px-3 py-2 rounded-xl border" />
                <div className="flex gap-2 mb-3 text-xs font-bold">
                    {["all", "premium", "lisans", "idle7"].map(function (f) {
                        return <button key={f} onClick={function () { setFilter(f); }} className={"px-2 py-1 rounded-lg border " + (filter === f ? "bg-indigo-600 text-white" : "")}>{f}</button>;
                    })}
                </div>
                <div className="space-y-2">
                    {shown.map(function (u) {
                        return (
                            <div key={u.user_id || u.nickname} className="p-3 rounded-xl border bg-white dark:bg-slate-800">
                                <div className="font-bold">{u.nickname} · {u.platform || "web"}</div>
                                <div className="text-xs text-slate-500">{u.target_type} · {u.education_level} · {u.premium ? "Premium" : "Free"}</div>
                                <div className="flex gap-2 mt-2">
                                    <button onClick={function () { act("grant_premium", { user_id: u.user_id, days: 30 }); }} className="text-xs font-bold px-2 py-1 rounded bg-emerald-100">Premium 30g</button>
                                    <button onClick={function () { act("reset_password", { user_id: u.user_id }); }} className="text-xs font-bold px-2 py-1 rounded bg-slate-100">Şifre sıfırla</button>
                                    <button onClick={function () { act("block", { user_id: u.user_id }); }} className="text-xs font-bold px-2 py-1 rounded bg-rose-100">Engelle</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-6 p-4 rounded-2xl border">
                    <h2 className="font-black mb-2">Duyuru</h2>
                    <textarea className="w-full border rounded-xl p-2 text-sm" placeholder="Günün soru önerisi / duyuru" />
                    <button onClick={function () { act("announce", { text: "duyuru" }); }} className="mt-2 font-bold text-sm">Yayınla (Edge)</button>
                </div>
            </div>
        );
    }
    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.AdminDashboard = AdminDashboard;
})();
