(function () {
    const { useState, useMemo, useRef } = React;
    var BackBtn = window.KpssBackBtn;

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

    function ReviewNotebook(props) {
        const student = props.student || {};
        const notes = useMemo(function () {
            return (window.StudentStore && window.StudentStore.listReviewNotes)
                ? window.StudentStore.listReviewNotes()
                : ((student.reviewNotebook || []).filter(function (n) { return n && !n.deleted; }));
        }, [student]);
        const [title, setTitle] = useState("");
        const [body, setBody] = useState("");
        const [editId, setEditId] = useState("");
        const titleRef = useRef(null);
        const bodyRef = useRef(null);
        const lastField = useRef("body");

        function resetForm() {
            setTitle("");
            setBody("");
            setEditId("");
        }

        function save() {
            if (!window.StudentStore || !window.StudentStore.upsertReviewNote) return;
            var t = title.trim();
            var b = body.trim();
            if (!t && !b) return;
            window.StudentStore.upsertReviewNote({ id: editId || undefined, title: t, body: b });
            resetForm();
        }

        function startEdit(n) {
            setEditId(n.id);
            setTitle(n.title || "");
            setBody(n.body || "");
        }

        function remove(id) {
            if (!confirm("Bu notu silmek istiyor musun?")) return;
            if (window.StudentStore && window.StudentStore.deleteReviewNote) window.StudentStore.deleteReviewNote(id);
            if (editId === id) resetForm();
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

        var field = "w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 outline-none";

        return (
            <div className="mx-auto max-w-2xl px-3 sm:px-5 pt-6 pb-10">
                <div className="flex justify-between items-start mb-6 gap-3">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-display font-black tracking-tight gradient-text">Tekrar defteri</h1>
                        <p className="text-sm text-stone-400 mt-1">Tekrar etmek istediğin kural, tarih, formül… buraya yaz. Yalnızca sen görürsün.</p>
                    </div>
                    {props.onBack ? (
                        <BackBtn onClick={props.onBack} label="Geri" />
                    ) : null}
                </div>

                <div className="rounded-3xl glass p-5 mb-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">{editId ? "Notu düzenle" : "Yeni not"}</p>
                    <input ref={titleRef} value={title} onChange={function (e) { setTitle(e.target.value); }}
                        onFocus={function () { lastField.current = "title"; }}
                        placeholder="Başlık (isteğe bağlı)" maxLength={80} className={field + " font-bold"} />
                    <div className="flex gap-2 mt-2 mb-1">
                        <button type="button" onMouseDown={function (e) { e.preventDefault(); }} onClick={makeBold}
                            className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-600 text-sm font-black bg-white dark:bg-stone-900 hover:border-teal-600 hover:text-teal-700"
                            title="Seçili metni kalın yap">
                            K Kalın
                        </button>
                        <p className="text-[11px] text-stone-400 self-center">Metni seç, Kalın’a bas. Satırın tamamı için imleci o satıra koy.</p>
                    </div>
                    <textarea ref={bodyRef} value={body} onChange={function (e) { setBody(e.target.value); }}
                        onFocus={function () { lastField.current = "body"; }}
                        placeholder="Tekrar etmek istediğin şeyi yaz…"
                        rows={5} maxLength={4000}
                        className={field + " resize-none"} />
                    <div className="flex gap-2 pt-3">
                        <button type="button" onClick={save} className="flex-1 py-3 rounded-xl btn-primary text-white text-sm font-semibold">Kaydet</button>
                        {editId ? (
                            <button type="button" onClick={resetForm} className="px-4 py-3 rounded-xl border-2 border-stone-200 text-sm font-medium">Vazgeç</button>
                        ) : null}
                    </div>
                </div>

                {notes.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-stone-200 dark:border-stone-700 p-6 text-center">
                        <p className="text-sm text-stone-500">Henüz not yok. Yukarıya yazıp kaydet.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notes.map(function (n) {
                            return (
                                <div key={n.id} className={"rounded-2xl glass p-4 " + (editId === n.id ? "ring-2 ring-teal-600/30" : "")}>
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="min-w-0">
                                            {n.title ? <p className="font-semibold text-sm"><RichText text={n.title} /></p> : null}
                                            <p className="text-[11px] text-stone-400 mt-0.5">{fmtWhen(n.updatedAt)}</p>
                                        </div>
                                        <div className="flex gap-1 shrink-0">
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
                )}
            </div>
        );
    }

    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.ReviewNotebook = ReviewNotebook;
})();
