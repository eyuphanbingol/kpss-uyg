(function () {
    const { useState, useEffect } = React;
    var L = window.LiveExam;
    var C = window.LiveClient;

    // ============================================================
    // Yönetim: canlı deneme oluşturma, soru yükleme, kayıtlar, canlı izleme, acil durum, istatistik
    // Sunucu: supabase/patch-live-exam.sql (live_admin_* fonksiyonları). Yayınlanmış deneme silinemez.
    // ============================================================

    var STATUS = { draft: "Taslak", scheduled: "Planlı", finished: "Bitti", cancelled: "İptal", archived: "Arşiv" };
    function dt(iso) { return iso ? L.fmtDay(L.ms(iso), true) + " " + L.fmtClock(L.ms(iso)) : "–"; }
    function nextSunday() {
        var t = Date.now() + 3 * 3600000; // İstanbul
        var d = new Date(t);
        var add = (7 - d.getUTCDay()) % 7 || 7;
        d = new Date(t + add * 86400000);
        return d.toISOString().slice(0, 10);
    }
    function readFile(f, asDataUrl) {
        return new Promise(function (resolve, reject) {
            var r = new FileReader();
            r.onload = function () { resolve(r.result); };
            r.onerror = function () { reject(r.error); };
            if (asDataUrl) r.readAsDataURL(f); else r.readAsText(f, "utf-8");
        });
    }
    function Box(props) {
        return <section className={"rounded-2xl glass p-5 " + (props.className || "")}><h2 className="font-bold mb-3">{props.title}</h2>{props.children}</section>;
    }
    function Btn(props) {
        return <button type="button" disabled={props.disabled} onClick={props.onClick}
            className={"px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-40 " + (props.danger ? "bg-rose-600 text-white" : props.primary ? "bg-indigo-600 text-white" : "border border-stone-300 dark:border-stone-600")}>{props.children}</button>;
    }

    function CreateForm(props) {
        const [title, setTitle] = useState("Atanly Canlı Deneme");
        const [day, setDay] = useState(nextSunday());
        const [cap, setCap] = useState("");
        const [track, setTrack] = useState(props.track || "lisans");
        const [busy, setBusy] = useState(false);
        const [err, setErr] = useState("");
        var notSunday = new Date(day + "T12:00:00Z").getUTCDay() !== 0;
        function save() {
            setBusy(true); setErr("");
            C.rpc("live_admin_save_exam", { p: { title: title, day: day, track: track, capacity: cap ? Number(cap) : "" } })
                .then(function (e) { setBusy(false); props.onCreated(e.id); })
                .catch(function (x) { setBusy(false); setErr(x.message); });
        }
        return (
            <Box title="Yeni canlı deneme">
                <div className="grid sm:grid-cols-4 gap-3">
                    <label className="text-sm">Kulvar<select className="mt-1 w-full px-3 py-2 rounded-xl border" value={track} onChange={function (e) { setTrack(e.target.value); }}>
                        {Object.keys(L.TRACKS).map(function (k) { return <option key={k} value={k}>{L.TRACKS[k]}</option>; })}
                    </select></label>
                    <label className="text-sm">Başlık<input className="mt-1 w-full px-3 py-2 rounded-xl border" value={title} onChange={function (e) { setTitle(e.target.value); }} /></label>
                    <label className="text-sm">Sınav günü<input type="date" className="mt-1 w-full px-3 py-2 rounded-xl border" value={day} onChange={function (e) { setDay(e.target.value); }} /></label>
                    <label className="text-sm">Kontenjan (boş = sınırsız)<input type="number" min="1" className="mt-1 w-full px-3 py-2 rounded-xl border" value={cap} onChange={function (e) { setCap(e.target.value); }} /></label>
                </div>
                <p className="text-xs text-stone-500 mt-2">Saatler (İstanbul): kayıt 10:00'da kapanır · 10:15 başlar · giriş 10:45'te kapanır · 12:25 biter · 12:27 geç senkron · 12:40 sıralama.</p>
                {notSunday ? <p className="text-xs text-amber-700 mt-1">Uyarı: seçtiğin gün pazar değil.</p> : null}
                {err ? <p className="text-sm text-rose-600 mt-2">{err}</p> : null}
                <div className="flex gap-2 mt-3"><Btn primary disabled={busy || !day} onClick={save}>Taslak oluştur</Btn><Btn onClick={props.onCancel}>Vazgeç</Btn></div>
            </Box>
        );
    }

    function Upload(props) {
        var exam = props.exam;
        const [doc, setDoc] = useState(null);
        const [files, setFiles] = useState({});
        const [check, setCheck] = useState(null);
        const [busy, setBusy] = useState("");
        const [err, setErr] = useState("");
        function validate(d, f) {
            if (!d) return;
            var imgs = {};
            Object.keys(f).forEach(function (k) { imgs[k] = true; });
            var v = L.validateUpload(d, window.getKpssData ? window.getKpssData() : {}, window.KONU_LABELS || {}, imgs);
            if (v.exam && v.exam.track !== exam.track) {
                v.ok = false;
                v.errors.unshift("Dosyanın kulvarı '" + (L.TRACKS[v.exam.track] || v.exam.track) + "', bu deneme ise " + L.TRACKS[exam.track] + " kulvarı için. Dosyadaki \"kulvar\" alanını düzelt ya da doğru denemeyi seç.");
            }
            setCheck(v);
        }
        function onJson(e) {
            var f = e.target.files && e.target.files[0];
            if (!f) return;
            readFile(f).then(function (txt) {
                var d;
                try { d = JSON.parse(txt); } catch (x) { setCheck({ ok: false, errors: ["JSON okunamadı: " + x.message], warnings: [] }); return; }
                setDoc(d); validate(d, files);
            });
        }
        function onImgs(e) {
            var map = Object.assign({}, files);
            Array.prototype.forEach.call(e.target.files || [], function (f) { map[f.name] = f; });
            setFiles(map); validate(doc, map);
        }
        function upload() {
            if (!check || !check.ok) return;
            setErr(""); setBusy("Sorular kaydediliyor…");
            var qs = check.questions;
            C.rpc("live_admin_set_questions", { p_exam: exam.id, p_questions: qs }).then(function (r) {
                if (r && r.ok === false) throw new Error((r.errors || []).join(" "));
                // dosyadaki başlık denemenin adı olur
                if (doc && doc.baslik && doc.baslik !== exam.title) {
                    return C.rpc("live_admin_save_exam", { p: { id: exam.id, title: doc.baslik } }).then(function () { exam = Object.assign({}, exam, { title: doc.baslik }); });
                }
            }).then(function () {
                setBusy("Görseller hazırlanıyor…");
                var names = Object.keys(files).filter(function (n) { return qs.some(function (q) { return q.image === n; }); });
                return Promise.all(names.map(function (n) { return readFile(files[n], true).then(function (u) { return [n, u]; }); }));
            }).then(function (pairs) {
                var imgs = {};
                pairs.forEach(function (p) { imgs[p[0]] = p[1]; });
                setBusy("Kitapçık şifreleniyor…");
                var enc = L.encryptBooklet(L.bookletText({ title: exam.title, track: exam.track }, qs, imgs));
                var path = "booklets/" + exam.id + ".bin";
                setBusy("Şifreli kitapçık yükleniyor (" + Math.round(enc.bytes.length / 1024) + " KB)…");
                return C.sb().storage.from("live-exam").upload(path, new Blob([enc.bytes], { type: "application/octet-stream" }), { upsert: true, contentType: "application/octet-stream" })
                    .then(function (r) {
                        if (r.error) throw new Error("Storage: " + r.error.message);
                        return C.rpc("live_admin_set_booklet", { p_exam: exam.id, p_path: path, p_key: enc.keyHex, p_sha: enc.sha });
                    });
            }).then(function () { setBusy(""); props.onDone(); })
                .catch(function (x) { setBusy(""); setErr(x.message); });
        }
        var nImg = Object.keys(files).length;
        return (
            <Box title="Soru dosyası ve görseller">
                <p className="text-xs text-stone-500 mb-3">Biçim: docs/canli-deneme-ornek.json · Görselleri dosyadaki "gorsel" adlarıyla seç. Kitapçık senin tarayıcında şifrelenir; anahtar yalnızca 10:15'te sınava girene verilir.</p>
                <div className="flex flex-wrap gap-4 text-sm">
                    <label>Soru dosyası (.json) <input type="file" accept="application/json,.json" onChange={onJson} className="block mt-1" /></label>
                    <label>Görseller ({nImg}) <input type="file" accept="image/*" multiple onChange={onImgs} className="block mt-1" /></label>
                </div>
                {check ? (
                    <div className="mt-3 text-sm">
                        {check.ok ? <p className="text-emerald-700 font-semibold">✓ Geçerli: 120 soru, KPSS dağılımına uygun, tüm konular data.js'te var.</p>
                            : <p className="text-rose-700 font-semibold">{check.errors.length} hata — yükleme reddedildi:</p>}
                        <ul className="mt-1 max-h-64 overflow-auto space-y-0.5">
                            {check.errors.map(function (x, i) { return <li key={"e" + i} className="text-rose-700">• {x}</li>; })}
                            {check.warnings.map(function (x, i) { return <li key={"w" + i} className="text-amber-700">• {x}</li>; })}
                        </ul>
                        {check.distribution ? (
                            <details className="mt-2" open={!check.ok}>
                                <summary className="font-semibold cursor-pointer">Soru dağılımı</summary>
                                <div className="grid sm:grid-cols-2 gap-4 mt-2 items-start">
                                    <table className="text-sm"><tbody>
                                        {check.distribution.tests.map(function (t) {
                                            var ok = t.count === t.n;
                                            return (
                                                <tr key={t.key}>
                                                    <td className="pr-3 py-0.5">{t.label}<span className="block text-[11px] text-stone-500">{t.from}–{t.to}. sorular{t.parts ? " · " + t.parts.map(function (p) { return p.ders + " " + p.count; }).join(" + ") : ""}</span></td>
                                                    <td className={"font-bold " + (ok ? "text-emerald-700" : "text-rose-700")}>{ok ? "✓ " : "✗ "}{t.count} / {t.n}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody></table>
                                    <table className="text-sm"><tbody>
                                        {check.distribution.groups.map(function (g) {
                                            return (
                                                <tr key={g.ders + g.ad}>
                                                    <td className="pr-3 py-0.5">{g.ders} · {g.ad}<span className="block text-[11px] text-stone-500">{"🔥".repeat(g.w)}</span></td>
                                                    <td className={"font-bold " + (g.count ? "" : g.w >= 4 ? "text-amber-700" : "text-stone-500")}>{g.count} soru</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody></table>
                                </div>
                            </details>
                        ) : null}
                    </div>
                ) : null}
                {err ? <p className="text-sm text-rose-600 mt-2">{err}</p> : null}
                {busy ? <p className="text-sm mt-2">{busy}</p> : null}
                <div className="mt-3"><Btn primary disabled={!check || !check.ok || !!busy} onClick={upload}>Soruları ve kitapçığı yükle</Btn></div>
            </Box>
        );
    }

    // Kâğıtta çözenler: optik okutma durumu, okuma sorunları ve kayıtlı elle giriş
    var EVENT = { device_switch: "cihaz değişti", locked: "KİLİTLENDİ", admin_extend: "süre uzatıldı", admin_cancel: "iptal edildi", admin_unlock: "kilit açıldı",
        finalize: "kesinleşti", optic_fail: "optik okunamadı", optic_wrong_form: "başkasının formu", optic_submit: "optik gönderildi", admin_paper: "yönetici elle girdi" };
    var SRC = { optic: "kamera", manual: "elle (öğrenci)", admin: "elle (yönetici)" };
    function PaperBox(props) {
        var rows = props.rows || [];
        const [editing, setEditing] = useState(null);
        const [text, setText] = useState("");
        const [note, setNote] = useState("");
        const [busy, setBusy] = useState(false);
        const [msg, setMsg] = useState("");
        var parsed = L.parseAnswerText(text, 120);
        function save(r) {
            if (!window.confirm(r.nickname + " için " + parsed.count + " cevap kaydedilsin mi?\n\nBu işlem denetim kaydına yazılır" +
                (props.finalized ? " ve sıralama yeniden hesaplanır" : "") + ". Kaydedilen kâğıt bir daha değiştirilemez.")) return;
            setBusy(true); setMsg("");
            C.rpc("live_admin_paper", { p_exam: props.examId, p_user: r.user_id, p_answers: L.answerText(parsed.answers), p_note: note })
                .then(function (x) { setBusy(false); setEditing(null); setText(""); setNote(""); setMsg(r.nickname + ": kaydedildi" + (x && x.reranked ? ", sıralama yeniden hesaplandı." : ".")); props.onDone(); })
                .catch(function (x) { setBusy(false); setMsg(x.message); });
        }
        var trouble = rows.filter(function (r) { return !r.submitted && r.fails; }).length;
        return (
            <Box title={"Kâğıtta çözenler (" + rows.length + ")" + (trouble ? " · " + trouble + " kişi okutmada sorun yaşıyor" : "")}>
                {msg ? <p className="text-sm mb-2" role="status">{msg}</p> : null}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead><tr className="text-left text-xs text-stone-500"><th className="py-1 pr-3">Öğrenci</th><th className="pr-3">Durum</th><th className="pr-3">Okuma hatası</th><th></th></tr></thead>
                        <tbody>
                            {rows.map(function (r) {
                                var st = r.submitted ? "✓ gönderdi · " + (SRC[r.source] || r.source || "") : r.close_reason === "no_optic" ? "okutmadı (süre doldu)" : "bekleniyor";
                                return (
                                    <tr key={r.user_id} className={"border-t border-stone-200 dark:border-stone-700 " + (!r.submitted && r.fails ? "bg-amber-50 dark:bg-amber-900/20" : "")}>
                                        <td className="py-1.5 pr-3 font-semibold">{r.nickname || r.user_id.slice(0, 8)}</td>
                                        <td className="pr-3">{st}</td>
                                        <td className="pr-3">{r.fails ? r.fails + " kez" + (r.last_fail && r.last_fail.code ? " (" + r.last_fail.code + ")" : "") : "–"}</td>
                                        <td className="text-right">{!r.submitted ? <Btn onClick={function () { setEditing(r.user_id); setText(""); setNote(""); }}>Elle gir</Btn> : null}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {editing ? (function () {
                    var r = rows.filter(function (x) { return x.user_id === editing; })[0];
                    if (!r) return null;
                    return (
                        <div className="mt-3 p-3 rounded-xl border border-stone-300 dark:border-stone-600">
                            <p className="text-sm font-semibold">{r.nickname} için cevaplar (1–120 sırayla, boş için -)</p>
                            <textarea rows={4} className="w-full mt-2 p-2 rounded-lg border font-mono text-sm uppercase tracking-widest" value={text}
                                onChange={function (e) { setText(e.target.value); }} aria-label="Cevaplar" spellCheck="false" />
                            <p className={"text-xs mt-1 " + (parsed.complete ? "text-emerald-700" : "text-rose-700")}>{parsed.count} / 120{parsed.bad.length ? " · geçersiz: " + parsed.bad.join(" ") : ""}{parsed.extra ? " · " + parsed.extra + " fazla" : ""}</p>
                            <input className="w-full mt-2 px-2 py-1.5 rounded-lg border text-sm" placeholder="Neden? (ör. kamera okumadı, öğrencinin gönderdiği fotoğraftan girildi)" value={note}
                                onChange={function (e) { setNote(e.target.value); }} aria-label="Düzeltme nedeni" />
                            <div className="flex gap-2 mt-2">
                                <Btn primary disabled={busy || !parsed.complete || note.trim().length < 3} onClick={function () { save(r); }}>Kaydet</Btn>
                                <Btn onClick={function () { setEditing(null); }}>Vazgeç</Btn>
                            </div>
                        </div>
                    );
                })() : null}
            </Box>
        );
    }

    function Detail(props) {
        var id = props.id;
        const [exam, setExam] = useState(null);
        const [regs, setRegs] = useState([]);
        const [mon, setMon] = useState(null);
        const [stats, setStats] = useState(null);
        const [err, setErr] = useState("");
        const [mins, setMins] = useState("10");

        function load() {
            return C.rpc("live_admin_list").then(function (list) {
                var e = (list || []).filter(function (x) { return x.id === id; })[0];
                setExam(e || null);
                if (!e) return;
                C.rpc("live_admin_registrations", { p_exam: id }).then(setRegs).catch(function () {});
                C.rpc("live_admin_monitor", { p_exam: id }).then(setMon).catch(function () {});
                if (e.finalized_at) C.rpc("live_admin_stats", { p_exam: id }).then(setStats).catch(function () {});
            }).catch(function (x) { setErr(x.message); });
        }
        useEffect(function () {
            load();
            var t = setInterval(load, 15000);
            return function () { clearInterval(t); };
        }, [id]);
        function run(name, args, confirmMsg) {
            if (confirmMsg && !window.confirm(confirmMsg)) return;
            setErr("");
            C.rpc(name, args).then(load).catch(function (x) { setErr(x.message); });
        }
        if (!exam) return <Box title="Deneme">{err || "Yükleniyor…"}</Box>;
        var live = exam.status === "scheduled" && Date.now() >= L.ms(exam.starts_at) - 3600000 && Date.now() < L.ms(exam.ends_at);
        var canEdit = (exam.status === "draft" || exam.status === "scheduled") && Date.now() < L.ms(exam.reg_closes_at);
        var lockedRegs = regs.filter(function (r) { return r.locked; });
        return (
            <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                    <Btn onClick={props.onBack}>← Liste</Btn>
                    <h1 className="text-2xl font-black">{exam.title}</h1>
                    <span className="text-xs px-2 py-1 rounded-full bg-stone-200 dark:bg-stone-700">{STATUS[exam.status]}</span>
                    <span className="text-xs px-2 py-1 rounded-full border border-stone-300 dark:border-stone-600">{L.TRACKS[exam.track]}</span>
                </div>
                {err ? <p className="text-sm text-rose-600">{err}</p> : null}
                <Box title="Takvim">
                    <ul className="text-sm space-y-0.5">
                        <li>Kayıt kapanış: {dt(exam.reg_closes_at)}</li>
                        <li>Başlangıç: {dt(exam.starts_at)} · bitiş: {dt(exam.ends_at)}{exam.extra_minutes ? " (+" + exam.extra_minutes + " dk uzatıldı)" : ""}</li>
                        <li>Sıralama: {dt(exam.ranking_at)}</li>
                        <li>Soru: {exam.questions}/120 · kitapçık: {exam.has_booklet ? "yüklendi" : "yok"} · kontenjan: {exam.capacity || "sınırsız"}</li>
                    </ul>
                    <div className="flex flex-wrap gap-2 mt-3">
                        {exam.status === "draft" ? <Btn primary disabled={exam.questions !== 120 || !exam.has_booklet} onClick={function () { run("live_admin_publish", { p_exam: id }, "Deneme yayınlansın ve kayda açılsın mı? Aynı kulvardaki bitmiş deneme arşive geçer."); }}>Yayınla (kayda aç)</Btn> : null}
                        {exam.status === "draft" ? <Btn onClick={function () { run("live_admin_discard_draft", { p_exam: id }, "Taslak kaldırılsın mı? (Yayınlanmış denemeler asla silinemez.)"); props.onBack(); }}>Taslağı kaldır</Btn> : null}
                    </div>
                </Box>
                {canEdit ? <Upload exam={exam} onDone={load} /> : null}
                {mon && mon.paper && mon.paper.length && (exam.status === "scheduled" || exam.status === "finished") ? (
                    <PaperBox rows={mon.paper} examId={id} finalized={!!exam.finalized_at} onDone={load} />
                ) : null}

                {exam.status === "scheduled" ? (
                    <Box title={live ? "● Canlı izleme" : "Durum"}>
                        {mon ? (
                            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 text-center text-sm">
                                {[["Kayıtlı", mon.registered], ["Yedek", mon.waitlist], ["Giren", mon.entered], ["Aktif", mon.active], ["Teslim", mon.submitted], ["Kilitli", mon.locked],
                          ["Kâğıtta", mon.paper_entered || 0], ["Optik gelen", mon.paper_submitted || 0]].map(function (x) {
                                    return <div key={x[0]} className="rounded-xl bg-white/70 dark:bg-stone-800 p-2"><div className="text-xl font-black">{x[1]}</div><div className="text-[11px] text-stone-500">{x[0]}</div></div>;
                                })}
                            </div>
                        ) : null}
                        {mon && mon.avg_answered != null ? <p className="text-xs text-stone-500 mt-2">Ortalama işaretlenen: {mon.avg_answered} / 120</p> : null}
                        {lockedRegs.length ? (
                            <div className="mt-3">
                                <p className="text-sm font-semibold text-rose-700">Kilitlenen öğrenciler (3. cihaz değişimi)</p>
                                {lockedRegs.map(function (r) {
                                    return <div key={r.user_id} className="flex items-center gap-2 text-sm mt-1">{r.nickname} · {r.switches} değişim <Btn onClick={function () { run("live_admin_unlock", { p_exam: id, p_user: r.user_id }, r.nickname + " için kilit açılsın mı?"); }}>Kilidi aç</Btn></div>;
                                })}
                            </div>
                        ) : null}
                        {mon && mon.events && mon.events.length ? (
                            <details className="mt-3"><summary className="text-sm font-semibold cursor-pointer">Olaylar ({mon.events.length})</summary>
                                <ul className="text-xs mt-2 space-y-0.5 max-h-56 overflow-auto">
                                    {mon.events.map(function (ev, i) { return <li key={i}>{L.fmtClock(L.ms(ev.at))} · {EVENT[ev.kind] || ev.kind} · {ev.nickname || ""} {ev.detail && ev.detail.switches ? "(" + ev.detail.switches + ")" : ""}{ev.detail && ev.detail.code ? " (" + ev.detail.code + ")" : ""}</li>; })}
                                </ul>
                            </details>
                        ) : null}
                        <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-700">
                            <p className="text-sm font-bold text-rose-700">Acil durum</p>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                <input type="number" min="1" max="120" value={mins} onChange={function (e) { setMins(e.target.value); }} className="w-20 px-2 py-1.5 rounded-lg border" aria-label="Uzatma dakikası" />
                                <Btn onClick={function () { run("live_admin_extend", { p_exam: id, p_minutes: Number(mins) }, "Sınav süresi herkes için " + mins + " dakika uzatılsın mı? Bitiş, geç senkron ve sıralama saatleri birlikte kayar."); }}>Süreyi uzat</Btn>
                                <Btn danger onClick={function () {
                                    var reason = window.prompt("İptal nedeni (öğrencilere gösterilir):");
                                    if (!reason) return;
                                    if (window.prompt("Onay için İPTAL yaz:") !== "İPTAL") return;
                                    run("live_admin_cancel", { p_exam: id, p_reason: reason });
                                }}>Denemeyi iptal et</Btn>
                            </div>
                        </div>
                    </Box>
                ) : null}

                <Box title={"Kayıtlar (" + regs.length + ")"}>
                    <div className="max-h-80 overflow-auto">
                        <table className="w-full text-sm">
                            <thead><tr className="text-left text-xs text-stone-500"><th>Takma ad</th><th>Durum</th><th>Biçim</th><th>Girdi</th><th>Cevap</th><th>Net</th><th></th></tr></thead>
                            <tbody>
                                {regs.map(function (r) {
                                    return (
                                        <tr key={r.user_id} className="border-t border-stone-200 dark:border-stone-700">
                                            <td className="py-1">{r.nickname}</td><td>{r.status}{r.locked ? " · kilitli" : ""}</td><td>{r.entered ? (r.mode === "paper" ? "kâğıt" : "cihaz") : ""}</td><td>{r.entered ? "✓" + (r.switches ? " (" + r.switches + " değişim)" : "") : ""}</td>
                                            <td>{r.answered || ""}</td><td>{r.net != null ? L.fmtNet(r.net) : ""}</td>
                                            <td className="text-right">{canEdit ? (r.status === "blocked"
                                                ? <button type="button" className="text-xs underline" onClick={function () { run("live_admin_set_registration", { p_exam: id, p_user: r.user_id, p_status: "registered" }); }}>engeli kaldır</button>
                                                : <button type="button" className="text-xs underline text-rose-700" onClick={function () { run("live_admin_set_registration", { p_exam: id, p_user: r.user_id, p_status: "blocked" }, r.nickname + " engellensin mi?"); }}>engelle</button>) : null}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Box>

                {stats ? (
                    <Box title="Soru istatistikleri">
                        {stats.cohort ? <p className="text-sm mb-3">{stats.cohort.participants} katılımcı · ortalama net {L.fmtNet(stats.cohort.avg_net)} (GY {L.fmtNet(stats.cohort.avg_gy)}, GK {L.fmtNet(stats.cohort.avg_gk)})</p> : null}
                        <div className="max-h-[32rem] overflow-auto">
                            <table className="w-full text-xs">
                                <thead><tr className="text-left text-stone-500"><th>No</th><th>Ders / konu</th><th>Doğru</th>{L.LETTERS.map(function (l) { return <th key={l}>{l}</th>; })}<th>Boş</th><th>Ort. sn</th></tr></thead>
                                <tbody>
                                    {stats.questions.map(function (q) {
                                        var tot = (q.correct || 0) + (q.wrong || 0) + (q.blank || 0);
                                        return (
                                            <tr key={q.no} className="border-t border-stone-200 dark:border-stone-700">
                                                <td className="py-1 font-bold">{q.no}</td><td>{q.ders} / {window.konuLabel ? window.konuLabel(q.konu) : q.konu}</td>
                                                <td>{tot ? Math.round(100 * q.correct / tot) + "%" : "–"}</td>
                                                {L.LETTERS.map(function (l) { var n = (q.choices || {})[l] || 0; return <td key={l} className={l === q.answer ? "font-bold text-emerald-700" : ""}>{n}</td>; })}
                                                <td>{q.blank || 0}</td><td>{q.avg_ms ? Math.round(q.avg_ms / 1000) : ""}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Box>
                ) : null}
            </div>
        );
    }

    // Kohort karşılaştırması: bir kulvarın kesinleşmiş denemeleri yan yana
    function Trends(props) {
        const [track, setTrack] = useState(props.track);
        const [rows, setRows] = useState(null);
        const [err, setErr] = useState("");
        useEffect(function () {
            setRows(null);
            C.rpc("live_admin_trends", { p_track: track }).then(setRows).catch(function (x) { setErr(x.message); });
        }, [track]);
        var dersler = [];
        (rows || []).forEach(function (r) { Object.keys(r.by_ders || {}).forEach(function (d) { if (dersler.indexOf(d) < 0) dersler.push(d); }); });
        dersler.sort(function (a, b) { var ia = L.DERS_ORDER.indexOf(a), ib = L.DERS_ORDER.indexOf(b); return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib); });
        function n(v) { return v == null ? "–" : L.fmtNet(v); }
        var dark = document.documentElement.classList.contains("dark");
        return (
            <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                    <Btn onClick={props.onBack}>← Liste</Btn>
                    <h1 className="text-2xl font-black">Denemeleri karşılaştır</h1>
                </div>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Kulvar filtresi">
                    {Object.keys(L.TRACKS).map(function (k) { return <Btn key={k} primary={track === k} onClick={function () { setTrack(k); }}>{L.TRACKS[k]}</Btn>; })}
                </div>
                {err ? <p className="text-sm text-rose-600">{err}</p> : null}
                <Box title={"Katılım ve net · " + L.TRACKS[track]}>
                    {!rows ? "Yükleniyor…" : !rows.length ? "Bu kulvarda kesinleşmiş deneme yok." : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead><tr className="text-left text-xs text-stone-500">
                                    <th className="py-1 pr-3">Deneme</th><th className="pr-3">Kayıt → katılım</th><th className="pr-3 min-w-[180px]">Ortalama net</th>
                                    <th className="pr-3">Medyan</th><th className="pr-3">İlk %10 sınırı</th><th className="pr-3">İlk %10 ort.</th><th className="pr-3">Cihaz / kâğıt ort.</th>
                                </tr></thead>
                                <tbody>{rows.map(function (r) {
                                    var a = r.analysis || {}, pc = a.pct || {}, m = a.by_mode || {};
                                    var w = Math.max(0, Math.min(100, (Number(r.avg_net) || 0) / 120 * 100));
                                    return (
                                        <tr key={r.id} className="border-t border-stone-200 dark:border-stone-700">
                                            <td className="py-1.5 pr-3"><b>{r.title}</b><span className="block text-xs text-stone-500">{L.fmtDate(L.ms(r.starts_at))}</span></td>
                                            <td className="pr-3">{r.registered} → {r.participants}</td>
                                            <td className="pr-3">
                                                <span className="inline-flex items-center gap-2 w-full">
                                                    <span className="h-2 rounded-full" style={{ width: w + "%", minWidth: 4, maxWidth: 120, background: dark ? "#3987e5" : "#2a78d6" }} aria-hidden="true" />
                                                    <b>{n(r.avg_net)}</b>
                                                </span>
                                            </td>
                                            <td className="pr-3">{n(pc.p50)}</td><td className="pr-3">{n(pc.p90)}</td><td className="pr-3">{n(a.top10_net)}</td>
                                            <td className="pr-3">{m.device ? n(m.device.avg_net) + " (" + m.device.n + ")" : "–"} / {m.paper ? n(m.paper.avg_net) + " (" + m.paper.n + ")" : "–"}</td>
                                        </tr>
                                    );
                                })}</tbody>
                            </table>
                        </div>
                    )}
                </Box>
                {rows && rows.length ? (
                    <Box title="Ders ortalamaları (katılan ortalaması · ilk %10)">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead><tr className="text-left text-xs text-stone-500"><th className="py-1 pr-3">Ders</th>{rows.map(function (r) { return <th key={r.id} className="pr-3">{L.fmtDay(L.ms(r.starts_at))}</th>; })}</tr></thead>
                                <tbody>{dersler.map(function (d) {
                                    return (
                                        <tr key={d} className="border-t border-stone-200 dark:border-stone-700">
                                            <td className="py-1.5 pr-3 font-semibold">{d}</td>
                                            {rows.map(function (r) {
                                                var a = r.by_ders && r.by_ders[d], t = r.analysis && r.analysis.top10 && r.analysis.top10[d];
                                                return <td key={r.id} className="pr-3">{a ? n(a.net) : "–"}<span className="text-xs text-stone-500">{t != null ? " · " + n(t) : ""}</span></td>;
                                            })}
                                        </tr>
                                    );
                                })}</tbody>
                            </table>
                        </div>
                        <p className="text-xs text-stone-500 mt-2">Bir dersin ortalaması haftadan haftaya belirgin düşüyorsa o derste sorular zorlaşmış ya da konu eksikleri birikmiş olabilir; soru istatistiklerinden kontrol et.</p>
                    </Box>
                ) : null}
            </div>
        );
    }

    function LiveExamAdmin() {
        const [list, setList] = useState(null);
        const [err, setErr] = useState("");
        const [mode, setMode] = useState("list");
        const [sel, setSel] = useState(null);
        const [track, setTrack] = useState("");
        function load() { C.rpc("live_admin_list").then(setList).catch(function (x) { setErr(x.message); }); }
        useEffect(load, []);
        if (mode === "detail" && sel) return <Detail id={sel} onBack={function () { setMode("list"); load(); }} />;
        if (mode === "trends") return <Trends track={track || "lisans"} onBack={function () { setMode("list"); }} />;
        var shown = (list || []).filter(function (e) { return !track || e.track === track; });
        return (
            <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h1 className="text-2xl md:text-3xl font-black gradient-text">🕒 Canlı Deneme</h1>
                    <div className="flex gap-2">
                        <Btn onClick={function () { setMode("trends"); }}>📊 Denemeleri karşılaştır</Btn>
                        <Btn primary onClick={function () { setMode("create"); }}>Yeni deneme</Btn>
                    </div>
                </div>
                {err ? <p className="text-sm text-rose-600">{err} (supabase/patch-live-exam.sql çalıştırıldı mı?)</p> : null}
                <div className="flex flex-wrap gap-2" role="group" aria-label="Kulvar filtresi">
                    {[["", "Tümü"]].concat(Object.keys(L.TRACKS).map(function (k) { return [k, L.TRACKS[k]]; })).map(function (t) {
                        return <Btn key={t[0]} primary={track === t[0]} onClick={function () { setTrack(t[0]); }}>{t[1]}</Btn>;
                    })}
                </div>
                {mode === "create" ? <CreateForm track={track || "lisans"} onCancel={function () { setMode("list"); }} onCreated={function (id) { setSel(id); setMode("detail"); }} /> : null}
                <Box title="Denemeler">
                    {!list ? "Yükleniyor…" : !shown.length ? "Henüz deneme yok." : (
                        <ul className="space-y-2">
                            {shown.map(function (e) {
                                return (
                                    <li key={e.id}>
                                        <button type="button" className="w-full text-left rounded-xl border border-stone-200 dark:border-stone-700 p-3 hover:bg-white/60 dark:hover:bg-stone-800/60" onClick={function () { setSel(e.id); setMode("detail"); }}>
                                            <span className="font-bold">{e.title}</span> <span className="text-xs px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-700 ml-1">{STATUS[e.status]}</span> <span className="text-xs px-2 py-0.5 rounded-full border border-stone-300 dark:border-stone-600 ml-1">{L.TRACKS[e.track]}</span>
                                            <span className="block text-xs text-stone-500 mt-0.5">{dt(e.starts_at)} · {e.registered} kayıtlı{e.waitlist ? " · " + e.waitlist + " yedek" : ""} · {e.questions}/120 soru{e.participants ? " · " + e.participants + " katılımcı · ort. net " + L.fmtNet(e.avg_net) : ""}</span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                    <p className="text-xs text-stone-500 mt-3">Yayınlanmış, bitmiş ve arşivdeki denemeler silinemez (veritabanı da silmeyi reddeder). Yalnızca taslak kaldırılabilir.</p>
                </Box>
            </div>
        );
    }

    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.LiveExamAdmin = LiveExamAdmin;
})();
