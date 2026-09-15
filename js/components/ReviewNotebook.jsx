(function () {
    const { useState, useMemo, useRef } = React;
    var BackBtn = window.KpssBackBtn;

    var NOTE_COLORS = [
        { id: "", label: "Yok", bg: "transparent", border: "#d6d3d1", card: "" },
        { id: "rose", label: "Pembe", bg: "#fecdd3", border: "#fb7185", card: "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/50" },
        { id: "amber", label: "Sarı", bg: "#fde68a", border: "#f59e0b", card: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/50" },
        { id: "emerald", label: "Yeşil", bg: "#a7f3d0", border: "#10b981", card: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/50" },
        { id: "sky", label: "Mavi", bg: "#bae6fd", border: "#0ea5e9", card: "bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/50" },
        { id: "violet", label: "Mor", bg: "#ddd6fe", border: "#8b5cf6", card: "bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800/50" },
        { id: "slate", label: "Gri", bg: "#e2e8f0", border: "#64748b", card: "bg-slate-100 dark:bg-slate-900/50 border-slate-300 dark:border-slate-600" }
    ];

    function colorMeta(id) {
        for (var i = 0; i < NOTE_COLORS.length; i++) if (NOTE_COLORS[i].id === id) return NOTE_COLORS[i];
        return NOTE_COLORS[0];
    }

    function fmtWhen(iso) {
        if (!iso) return "";
        var d = new Date(iso);
        if (isNaN(d.getTime())) return "";
        var dd = String(d.getDate()).padStart(2, "0");
        var mm = String(d.getMonth() + 1).padStart(2, "0");
        var hh = String(d.getHours()).padStart(2, "0");
        var mi = String(d.getMinutes()).padStart(2, "0");
        return dd + "." + mm + " " + hh + ":" + mi;
    }

    function applyBold(val, start, end) {
        val = String(val || "");
        start = Math.max(0, start || 0);
        end = Math.max(start, end || 0);
        if (start === end) {
            var a = val.lastIndexOf("\n", start - 1) + 1;
            var b = val.indexOf("\n", start);
            if (b < 0) b = val.length;
            start = a;
            end = b;
            if (start === end) {
                return { val: val.slice(0, start) + "****" + val.slice(end), start: start + 2, end: start + 2 };
            }
        }
        var sel = val.slice(start, end);
        if (sel.length > 4 && sel.slice(0, 2) === "**" && sel.slice(-2) === "**") {
            var inner = sel.slice(2, -2);
            return { val: val.slice(0, start) + inner + val.slice(end), start: start, end: start + inner.length };
        }
        if (start >= 2 && val.slice(start - 2, start) === "**" && val.slice(end, end + 2) === "**") {
            return { val: val.slice(0, start - 2) + sel + val.slice(end + 2), start: start - 2, end: end - 2 };
        }
        return { val: val.slice(0, start) + "**" + sel + "**" + val.slice(end), start: start, end: end + 4 };
    }

    function RichText(props) {
        var text = String(props.text || "");
        var nodes = [];
        var re = /\*\*([^*]+)\*\*/g;
        var last = 0;
        var m;
        var i = 0;
        while ((m = re.exec(text))) {
            if (m.index > last) nodes.push(text.slice(last, m.index));
            nodes.push(<b key={"b" + (i++)} className="font-black">{m[1]}</b>);
            last = m.index + m[0].length;
        }
        if (last < text.length) nodes.push(text.slice(last));
        if (!nodes.length) nodes.push(text);
        return <span className={props.className || ""}>{nodes}</span>;
    }

    function dersLabel(d) {
        if (!d) return "Genel";
        if (window.AlanCatalog && window.AlanCatalog.dersLabel) return window.AlanCatalog.dersLabel(d);
        return d;
    }

    function ReviewNotebook(props) {
        const student = props.student || {};
        const kpssData = props.kpssData || {};
        const notes = useMemo(function () {
            return (window.StudentStore && window.StudentStore.listReviewNotes)
                ? window.StudentStore.listReviewNotes()
                : ((student.reviewNotebook || []).filter(function (n) { return n && !n.deleted; }));
        }, [student]);
        const dersOptions = useMemo(function () {
            var keys = Object.keys(kpssData || {}).filter(function (k) { return k && k !== "_"; });
            keys.sort(function (a, b) { return dersLabel(a).localeCompare(dersLabel(b), "tr"); });
            return keys;
        }, [kpssData]);

        const [title, setTitle] = useState("");
        const [body, setBody] = useState("");
        const [ders, setDers] = useState("");
        const [color, setColor] = useState("");
        const [filterDers, setFilterDers] = useState("all");
        const [editId, setEditId] = useState("");
        const titleRef = useRef(null);
        const bodyRef = useRef(null);
        const lastField = useRef("body");

        function resetForm() {
            setTitle("");
            setBody("");
            setDers("");
            setColor("");
            setEditId("");
        }

        function save() {
            if (!window.StudentStore || !window.StudentStore.upsertReviewNote) return;
            var t = title.trim();
            var b = body.trim();
            if (!t && !b) return;
            window.StudentStore.upsertReviewNote({
                id: editId || undefined,
                title: t,
                body: b,
                ders: ders,
                color: color
            });
            resetForm();
        }

        function startEdit(n) {
            setEditId(n.id);
            setTitle(n.title || "");
            setBody(n.body || "");
            setDers(n.ders || "");
            setColor(n.color || "");
        }

        function remove(id) {
            if (!confirm("Bu notu silmek istiyor musun?")) return;
            if (window.StudentStore && window.StudentStore.deleteReviewNote) window.StudentStore.deleteReviewNote(id);
            if (editId === id) resetForm();
        }

        function moveNote(id, dir) {
            if (!window.StudentStore || !window.StudentStore.moveReviewNote) return;
            window.StudentStore.moveReviewNote(id, dir);
        }

        function makeBold() {
            var which = lastField.current === "title" ? "title" : "body";
            var el = which === "title" ? titleRef.current : bodyRef.current;
            var val = which === "title" ? title : body;
            var set = which === "title" ? setTitle : setBody;
            var start = el && typeof el.selectionStart === "number" ? el.selectionStart : val.length;
            var end = el && typeof el.selectionEnd === "number" ? el.selectionEnd : val.length;
            var next = applyBold(val, start, end);
            set(next.val);
            requestAnimationFrame(function () {
                var node = which === "title" ? titleRef.current : bodyRef.current;
                if (!node || !node.setSelectionRange) return;
                node.focus();
                node.setSelectionRange(next.start, next.end);
            });
        }

        var filtered = useMemo(function () {
            if (filterDers === "all") return notes;
            if (filterDers === "genel") return notes.filter(function (n) { return !n.ders; });
            return notes.filter(function (n) { return n.ders === filterDers; });
        }, [notes, filterDers]);

        var grouped = useMemo(function () {
            var map = {};
            var order = [];
            filtered.forEach(function (n) {
                var key = n.ders || "";
                if (!map[key]) {
                    map[key] = [];
                    order.push(key);
                }
                map[key].push(n);
            });
            order.sort(function (a, b) {
                if (!a) return 1;
                if (!b) return -1;
                return dersLabel(a).localeCompare(dersLabel(b), "tr");
            });
            return order.map(function (k) { return { ders: k, items: map[k] }; });
        }, [filtered]);

        var field = "w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 outline-none";

        return (
            <div className="mx-auto max-w-2xl px-3 sm:px-5 pt-6 pb-10">
                <div className="flex justify-between items-start mb-6 gap-3">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-display font-black tracking-tight gradient-text">Tekrar defteri</h1>
                        <p className="text-sm text-stone-400 mt-1">Ders ders ayır, renklendir. Karakter sınırı yok. Yalnızca sen görürsün.</p>
                    </div>
                    {props.onBack ? (
                        <BackBtn onClick={props.onBack} label="Geri" />
                    ) : null}
                </div>

                <div className="rounded-3xl glass p-5 mb-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">{editId ? "Notu düzenle" : "Yeni not"}</p>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">Ders</label>
                    <select value={ders} onChange={function (e) { setDers(e.target.value); }} className={field + " mb-3"}>
                        <option value="">Genel</option>
                        {dersOptions.map(function (d) {
                            return <option key={d} value={d}>{dersLabel(d)}</option>;
                        })}
                    </select>
                    <input ref={titleRef} value={title} onChange={function (e) { setTitle(e.target.value); }}
                        onFocus={function () { lastField.current = "title"; }}
                        placeholder="Başlık (isteğe bağlı)" className={field + " font-bold"} />
                    <div className="flex flex-wrap gap-2 mt-2 mb-2 items-center">
                        <button type="button" onMouseDown={function (e) { e.preventDefault(); }} onClick={makeBold}
                            className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-600 text-sm font-black bg-white dark:bg-stone-900 hover:border-teal-600 hover:text-teal-700"
                            title="Seçili metni kalın yap">
                            K Kalın
                        </button>
                        <span className="text-[11px] text-stone-400">Renk:</span>
                        {NOTE_COLORS.map(function (c) {
                            var on = color === c.id;
                            return (
                                <button key={c.id || "none"} type="button" title={c.label}
                                    onClick={function () { setColor(c.id); }}
                                    className={"w-7 h-7 rounded-full border-2 " + (on ? "ring-2 ring-offset-1 ring-teal-600 scale-110" : "")}
                                    style={{ background: c.id ? c.bg : "#fff", borderColor: c.border }} />
                            );
                        })}
                    </div>
                    <textarea ref={bodyRef} value={body} onChange={function (e) { setBody(e.target.value); }}
                        onFocus={function () { lastField.current = "body"; }}
                        placeholder="Tekrar etmek istediğin şeyi yaz…"
                        rows={8}
                        className={field + " resize-y min-h-[160px]"} />
                    <div className="flex gap-2 pt-3">
                        <button type="button" onClick={save} className="flex-1 py-3 rounded-xl btn-primary text-white text-sm font-semibold">Kaydet</button>
                        {editId ? (
                            <button type="button" onClick={resetForm} className="px-4 py-3 rounded-xl border-2 border-stone-200 text-sm font-medium">Vazgeç</button>
                        ) : null}
                    </div>
                </div>

                {notes.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mb-4">
                        <button type="button" onClick={function () { setFilterDers("all"); }}
                            className={"px-3 py-1.5 rounded-full text-xs font-bold border " + (filterDers === "all" ? "bg-teal-600 text-white border-teal-600" : "border-stone-200 dark:border-stone-600")}>Tümü</button>
                        <button type="button" onClick={function () { setFilterDers("genel"); }}
                            className={"px-3 py-1.5 rounded-full text-xs font-bold border " + (filterDers === "genel" ? "bg-teal-600 text-white border-teal-600" : "border-stone-200 dark:border-stone-600")}>Genel</button>
                        {dersOptions.map(function (d) {
                            var count = notes.filter(function (n) { return n.ders === d; }).length;
                            if (!count) return null;
                            return (
                                <button key={d} type="button" onClick={function () { setFilterDers(d); }}
                                    className={"px-3 py-1.5 rounded-full text-xs font-bold border " + (filterDers === d ? "bg-teal-600 text-white border-teal-600" : "border-stone-200 dark:border-stone-600")}>
                                    {dersLabel(d)} · {count}
                                </button>
                            );
                        })}
                    </div>
                ) : null}

                {filtered.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-stone-200 dark:border-stone-700 p-6 text-center">
                        <p className="text-sm text-stone-500">{notes.length ? "Bu derste not yok." : "Henüz not yok. Yukarıya yazıp kaydet."}</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {grouped.map(function (g) {
                            return (
                                <div key={g.ders || "genel"}>
                                    <h2 className="text-xs font-black uppercase tracking-widest text-stone-400 mb-2">{dersLabel(g.ders)}</h2>
                                    <div className="space-y-3">
                                        {g.items.map(function (n, ni) {
                                            var cm = colorMeta(n.color);
                                            return (
                                                <div key={n.id} className={"rounded-2xl border p-4 " + (cm.card || "glass") + " " + (editId === n.id ? "ring-2 ring-teal-600/30" : "")}>
                                                    <div className="flex justify-between items-start gap-2">
                                                        <div className="min-w-0">
                                                            {n.title ? <p className="font-semibold text-sm"><RichText text={n.title} /></p> : null}
                                                            <p className="text-[11px] text-stone-400 mt-0.5">{fmtWhen(n.updatedAt)}</p>
                                                        </div>
                                                        <div className="flex gap-1 shrink-0 items-center">
                                                            <button type="button" disabled={ni === 0} onClick={function () { moveNote(n.id, -1); }}
                                                                className="px-2 py-1 rounded-lg text-xs font-black border border-stone-200 dark:border-stone-600 disabled:opacity-30" title="Yukarı">↑</button>
                                                            <button type="button" disabled={ni === g.items.length - 1} onClick={function () { moveNote(n.id, 1); }}
                                                                className="px-2 py-1 rounded-lg text-xs font-black border border-stone-200 dark:border-stone-600 disabled:opacity-30" title="Aşağı">↓</button>
                                                            <button type="button" onClick={function () { startEdit(n); }}
                                                                className="px-2.5 py-1 rounded-lg text-xs font-medium text-teal-700 dark:text-teal-300">Düzenle</button>
                                                            <button type="button" onClick={function () { remove(n.id); }}
                                                                className="px-2.5 py-1 rounded-lg text-xs font-medium text-rose-600">Sil</button>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm whitespace-pre-wrap mt-2 text-stone-700 dark:text-stone-200"><RichText text={n.body} /></p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.ReviewNotebook = ReviewNotebook;
})();
