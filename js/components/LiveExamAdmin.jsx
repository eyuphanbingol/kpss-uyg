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
        return (
            <section className={"rounded-3xl glass p-5 sm:p-6 " + (props.className || "")}>
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div className="min-w-0">
                        <h2 className="font-bold text-lg leading-tight">{props.title}</h2>
                        {props.sub ? <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">{props.sub}</p> : null}
                    </div>
                    {props.actions ? <div className="flex flex-wrap items-center gap-2">{props.actions}</div> : null}
                </div>
                {props.children}
            </section>
        );
    }
    function Btn(props) {
        return <button type="button" disabled={props.disabled} onClick={props.onClick} title={props.title}
            className={"inline-flex items-center justify-center gap-1.5 rounded-xl font-semibold whitespace-nowrap transition disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-900 " +
                (props.small ? "px-3 py-1.5 text-xs " : "px-4 py-2 text-sm ") +
                (props.danger ? "bg-rose-600 text-white hover:bg-rose-700 shadow-sm"
                    : props.primary ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-600/20"
                    : props.dangerGhost ? "border border-rose-300 text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-950/40"
                    : "border border-stone-300 bg-white/70 hover:bg-white dark:bg-stone-900/40 dark:border-stone-600 dark:hover:bg-stone-800")}>{props.children}</button>;
    }

    // ---------- görünüm yardımcıları (liste ve detay) ----------
    var AY_KISA = ["OCA", "ŞUB", "MAR", "NİS", "MAY", "HAZ", "TEM", "AĞU", "EYL", "EKİ", "KAS", "ARA"];
    function trDate(t) { var d = new Date(Number(t) + 3 * 3600000); return { d: d.getUTCDate(), mo: d.getUTCMonth() }; }
    // Denemenin şu anki aşaması: etiket, ton ve geri sayım metni
    function phaseOf(e, now) {
        var rc = L.ms(e.reg_closes_at), st = L.ms(e.starts_at), en = L.ms(e.ends_at), rk = L.ms(e.ranking_at);
        if (e.status === "draft") return { key: "draft", label: "Taslak", tone: "stone", text: e.questions === 120 && e.has_booklet ? "Hazır · yayınlanmayı bekliyor" : "Hazırlanıyor · henüz yayında değil" };
        if (e.status === "cancelled") return { key: "cancelled", label: "İptal", tone: "rose", text: "Deneme iptal edildi" };
        if (e.status === "archived") return { key: "archived", label: "Arşiv", tone: "stone", text: e.participants ? e.participants + " katılımcı · ort. net " + L.fmtNet(e.avg_net) : "Arşivlendi" };
        if (e.status === "finished" || e.finalized_at) return { key: "finished", label: "Tamamlandı", tone: "emerald", text: e.participants ? e.participants + " katılımcı · ort. net " + L.fmtNet(e.avg_net) : "Sonuçlar kesinleşti" };
        if (now < rc) return { key: "open", label: "Kayıt açık", tone: "indigo", text: "Kayıt " + L.fmtLeft(rc - now) + " sonra kapanır" };
        if (now < st) return { key: "closed", label: "Başlamak üzere", tone: "amber", text: "Sınav " + L.fmtLeft(st - now) + " sonra başlar" };
        if (now < en) return { key: "live", label: "Canlı", tone: "rose", live: true, text: "Bitmesine " + L.fmtLeft(en - now) };
        if (now < rk) return { key: "ranking", label: "Sıralama bekleniyor", tone: "amber", text: "Sıralama " + L.fmtLeft(rk - now) + " sonra" };
        return { key: "ranking", label: "Sonuçlanıyor", tone: "amber", text: "Sıralama hesaplanıyor" };
    }
    var TONE = {
        stone: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-200",
        indigo: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-200",
        amber: "bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200",
        rose: "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-200",
        emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200"
    };
    var DOT = { stone: "bg-stone-400", indigo: "bg-indigo-500", amber: "bg-amber-500", rose: "bg-rose-500", emerald: "bg-emerald-500" };
    function Pill(props) {
        return (
            <span className={"inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full " + (TONE[props.tone] || TONE.stone)}>
                {props.dot ? <span className="relative flex w-2 h-2" aria-hidden="true">
                    {props.pulse ? <span className={"absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping " + DOT[props.tone]}></span> : null}
                    <span className={"relative inline-flex w-2 h-2 rounded-full " + DOT[props.tone]}></span>
                </span> : null}
                {props.children}
            </span>
        );
    }
    function TrackPill(props) {
        return <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border border-stone-300 text-stone-600 dark:border-stone-600 dark:text-stone-300">{L.TRACKS[props.track]}</span>;
    }
    function DateTile(props) {
        var p = trDate(L.ms(props.at)), big = props.big;
        return (
            <div className={"shrink-0 rounded-2xl text-center overflow-hidden border border-indigo-100 dark:border-indigo-900 bg-white dark:bg-stone-900 shadow-sm " + (big ? "w-20" : "w-16")} aria-hidden="true">
                <div className={"bg-indigo-600 text-white font-bold tracking-widest " + (big ? "text-xs py-1" : "text-[10px] py-0.5")}>{AY_KISA[p.mo]}</div>
                <div className={"font-black leading-none text-stone-900 dark:text-stone-50 " + (big ? "text-3xl pt-2" : "text-2xl pt-1.5")}>{p.d}</div>
                <div className={"text-stone-500 font-semibold " + (big ? "text-xs pb-2 pt-1" : "text-[11px] pb-1.5 pt-0.5")}>{L.fmtClock(L.ms(props.at))}</div>
            </div>
        );
    }
    function Meter(props) {
        var pct = props.max ? Math.max(0, Math.min(100, Math.round(100 * props.value / props.max))) : 0;
        return (
            <div className="h-1.5 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden" role="presentation">
                <div className={"h-full rounded-full " + (props.done ? "bg-emerald-500" : "bg-indigo-500")} style={{ width: pct + "%" }}></div>
            </div>
        );
    }
    function useNow(ms) {
        const [now, setNow] = useState(Date.now());
        useEffect(function () { var t = setInterval(function () { setNow(Date.now()); }, ms || 30000); return function () { clearInterval(t); }; }, []);
        return now;
    }
    function initials(name) {
        var parts = String(name || "?").trim().split(/\s+/);
        return L.trUpper((parts[0] || "?").charAt(0) + (parts.length > 1 ? parts[parts.length - 1].charAt(0) : ""));
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

    // Soruları kaydet ve kitapçığı (görseller gömülü) yeniden şifreleyip yükle. qs: doğrulanmış sorular,
    // imgs: { dosyaAdı: dataURL }. Kayıt kapanana (10:00) kadar çalışır; sunucu sonrasını reddeder.
    function saveQuestions(exam, qs, imgs, step) {
        step("Sorular kaydediliyor…");
        return C.rpc("live_admin_set_questions", { p_exam: exam.id, p_questions: qs }).then(function (r) {
            if (r && r.ok === false) throw new Error((r.errors || []).join(" "));
            step("Kitapçık şifreleniyor…");
            var used = {};
            qs.forEach(function (q) { if (q.image && imgs[q.image]) used[q.image] = imgs[q.image]; });
            var enc = L.encryptBooklet(L.bookletText({ title: exam.title, track: exam.track }, qs, used));
            var path = "booklets/" + exam.id + ".bin";
            step("Şifreli kitapçık yükleniyor (" + Math.round(enc.bytes.length / 1024) + " KB)…");
            return C.sb().storage.from("live-exam").upload(path, new Blob([enc.bytes], { type: "application/octet-stream" }), { upsert: true, contentType: "application/octet-stream" })
                .then(function (r2) {
                    if (r2.error) throw new Error("Storage: " + r2.error.message);
                    return C.rpc("live_admin_set_booklet", { p_exam: exam.id, p_path: path, p_key: enc.keyHex, p_sha: enc.sha });
                });
        });
    }

    function BareBox(props) {
        return <div><h3 className="font-bold">{props.title}</h3>{props.sub ? <p className="text-xs text-stone-500 mt-0.5 mb-3">{props.sub}</p> : null}{props.children}</div>;
    }
    function Upload(props) {
        var exam = props.exam;
        const [doc, setDoc] = useState(null);
        const [files, setFiles] = useState({});
        const [docName, setDocName] = useState("");
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
            setDocName(f.name);
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
            var title = doc && doc.baslik && doc.baslik !== exam.title ? doc.baslik : null;
            (title ? C.rpc("live_admin_save_exam", { p: { id: exam.id, title: title } }).then(function () { exam = Object.assign({}, exam, { title: title }); }) : Promise.resolve())
                .then(function () {
                    setBusy("Görseller hazırlanıyor…");
                    var names = Object.keys(files).filter(function (n) { return qs.some(function (q) { return q.image === n; }); });
                    return Promise.all(names.map(function (n) { return readFile(files[n], true).then(function (u) { return [n, u]; }); }));
                }).then(function (pairs) {
                    var imgs = {};
                    pairs.forEach(function (p) { imgs[p[0]] = p[1]; });
                    return saveQuestions(exam, qs, imgs, setBusy);
                }).then(function () { setBusy(""); props.onDone(); })
                .catch(function (x) { setBusy(""); setErr(x.message); });
        }
        var nImg = Object.keys(files).length;
        var Wrap = props.bare ? BareBox : Box;
        return (
            <Wrap title={props.replace ? "Tüm soruları yeni dosyayla değiştir" : "Soru dosyası ve görseller"}
                sub={"Biçim: docs/canli-deneme-ornek.json · görselleri dosyadaki \"gorsel\" adlarıyla seç. Kitapçık senin tarayıcında şifrelenir; anahtar yalnızca 10:15'te sınava girene verilir."}>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <label className={"cursor-pointer rounded-2xl border-2 border-dashed p-4 flex items-center gap-3 transition hover:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500 " + (docName ? "border-indigo-300 bg-indigo-50/50 dark:bg-indigo-950/20" : "border-stone-300 dark:border-stone-600")}>
                        <span className="text-2xl" aria-hidden="true">📄</span>
                        <span className="min-w-0"><span className="block font-semibold">Soru dosyası (.json)</span><span className="block text-xs text-stone-500 truncate">{docName || "Seçmek için tıkla"}</span></span>
                        <input type="file" accept="application/json,.json" onChange={onJson} className="sr-only" />
                    </label>
                    <label className={"cursor-pointer rounded-2xl border-2 border-dashed p-4 flex items-center gap-3 transition hover:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500 " + (nImg ? "border-indigo-300 bg-indigo-50/50 dark:bg-indigo-950/20" : "border-stone-300 dark:border-stone-600")}>
                        <span className="text-2xl" aria-hidden="true">🖼</span>
                        <span className="min-w-0"><span className="block font-semibold">Görseller ({nImg})</span><span className="block text-xs text-stone-500 truncate">{nImg ? Object.keys(files).join(", ") : "Birden çok seçebilirsin"}</span></span>
                        <input type="file" accept="image/*" multiple onChange={onImgs} className="sr-only" />
                    </label>
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
                <div className="mt-4 flex flex-wrap gap-2">
                    <Btn primary disabled={!check || !check.ok || !!busy} onClick={upload}>Soruları ve kitapçığı yükle</Btn>
                    {props.onCancel ? <Btn onClick={props.onCancel}>Vazgeç</Btn> : null}
                </div>
            </Wrap>
        );
    }

    // ============================================================
    // SORU DÜZENLEYİCİ: yüklenen soruları gör, düzelt, görseli değiştir (kayıt kapanana kadar)
    // Sol: 120 soruluk gezinme ızgarası · orta: düzenleme · sağ: öğrencinin göreceği önizleme.
    // Kaydedilmemiş değişiklikler bu tarayıcıda taslak olarak saklanır (kpss-live-edit-<deneme>).
    // ============================================================
    var GY_DERS = ["Türkçe", "Matematik", "Geometri"], GK_DERS = ["Tarih", "Coğrafya", "Vatandaşlık", "Güncel Bilgiler"];
    function catalog() { return window.getKpssData ? window.getKpssData() : {}; }
    function konuKeys(ders) { return Object.keys(catalog()[ders] || {}).filter(function (k) { return k !== "_"; }); }
    function kLabel(k) { return window.konuLabel ? window.konuLabel(k) : String(k).trim(); }
    function toDoc(q) {
        return { no: q.no, bolum: q.bolum, ders: q.ders, konu: q.konu, metin: q.stem, siklar: (q.options || []).slice(),
            dogru: q.answer, cozum: q.explanation || "", gorsel: q.image || undefined };
    }
    function downloadText(name, text, type) {
        var url = URL.createObjectURL(new Blob([text], { type: type || "application/json" }));
        var a = document.createElement("a");
        a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 30000);
    }
    function draftKey(id) { return "kpss-live-edit-" + id; }
    function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
    function short(s) { s = String(s || ""); return s.length > 60 ? s.slice(0, 57) + "…" : s || "(boş)"; }
    function testOf(no) { return L.EXAM_PLAN.filter(function (t) { return no >= t.from && no <= t.to; })[0] || L.EXAM_PLAN[0]; }
    // Kayıtlı (a) ile yeni (b) arasındaki farklar: kaydetme özetinde gösterilir
    function changes(a, b, imgA, imgB) {
        var out = [];
        if (a.ders !== b.ders) out.push({ label: "Ders", from: a.ders, to: b.ders });
        if (a.konu !== b.konu) out.push({ label: "Konu", from: kLabel(a.konu), to: kLabel(b.konu) });
        if (a.metin !== b.metin) out.push({ label: "Soru metni değişti" });
        L.LETTERS.forEach(function (l, i) { if ((a.siklar[i] || "") !== (b.siklar[i] || "")) out.push({ label: "Şık " + l, from: short(a.siklar[i]), to: short(b.siklar[i]) }); });
        if (a.dogru !== b.dogru) out.push({ label: "Doğru cevap", from: a.dogru, to: b.dogru, key: true });
        if (a.cozum !== b.cozum) out.push({ label: "Çözüm değişti" });
        if (!a.gorsel && b.gorsel) out.push({ label: "Görsel eklendi" });
        else if (a.gorsel && !b.gorsel) out.push({ label: "Görsel kaldırıldı" });
        else if (a.gorsel && (a.gorsel !== b.gorsel || imgA[a.gorsel] !== imgB[b.gorsel])) out.push({ label: "Görsel değişti" });
        return out;
    }
    function dataUrlKb(u) { return Math.round((u.length - u.indexOf(",") - 1) * 0.75 / 1024); }
    // Büyük fotoğrafı küçült (en uzun kenar 1400 px); sonuç 1 MB'ı geçemez
    function fitImage(file) {
        return readFile(file, true).then(function (url) {
            if (file.type === "image/svg+xml") {
                if (file.size > 1024 * 1024) throw new Error("SVG 1 MB'tan büyük.");
                return { url: url, note: "" };
            }
            return new Promise(function (resolve, reject) {
                var im = new Image();
                im.onload = function () {
                    var w = im.naturalWidth, h = im.naturalHeight;
                    if (file.size <= 600 * 1024 && Math.max(w, h) <= 1800) { resolve({ url: url, note: "" }); return; }
                    var k = Math.min(1, 1400 / Math.max(w, h)), c = document.createElement("canvas");
                    c.width = Math.round(w * k); c.height = Math.round(h * k);
                    var x = c.getContext("2d");
                    x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height); x.drawImage(im, 0, 0, c.width, c.height);
                    var out = c.toDataURL("image/png");
                    if (dataUrlKb(out) > 600) out = c.toDataURL("image/jpeg", 0.86);
                    if (dataUrlKb(out) > 1024) { reject(new Error("Görsel küçültülse de 1 MB'ı aşıyor.")); return; }
                    resolve({ url: out, note: "Görsel küçültüldü: " + Math.round(file.size / 1024) + " KB → " + dataUrlKb(out) + " KB (" + c.width + "×" + c.height + ")." });
                };
                im.onerror = function () { reject(new Error("Görsel açılamadı.")); };
                im.src = url;
            });
        });
    }
    function AutoText(props) {
        var ref = React.useRef(null);
        React.useLayoutEffect(function () {
            var el = ref.current;
            if (!el) return;
            el.style.height = "auto";
            el.style.height = Math.max(el.scrollHeight + 2, props.min || 72) + "px";
        }, [props.value]);
        // line: tek satırlık alan gibi davranır (Enter yeni satır açmaz) ama uzun metinde büyür
        return <textarea ref={function (el) { ref.current = el; if (props.tref) props.tref(el); }} rows={1} lang="tr" aria-label={props.label}
            className={(props.line ? "flex-1 min-w-0 px-3 py-2" : "mt-1 w-full p-3") + " rounded-xl border leading-relaxed resize-none disabled:opacity-80 " + (props.className || "")}
            disabled={props.disabled} value={props.value} onFocus={props.onFocus}
            onChange={function (e) { props.onChange(props.line ? e.target.value.replace(/\n/g, " ") : e.target.value); }}
            onKeyDown={function (e) {
                if (props.line && e.key === "Enter") { e.preventDefault(); return; }
                if (props.onFormatKey && (e.ctrlKey || e.metaKey) && !e.altKey) {
                    var k = String(e.key).toLowerCase();
                    if (k === "u") { e.preventDefault(); props.onFormatKey(e.shiftKey ? "mark" : "u", e.target); }
                    else if (k === "b") { e.preventDefault(); props.onFormatKey("b", e.target); }
                }
            }} />;
    }
    // ---------- biçim araç çubuğu: seçili sözü __altı çizili__, __numaralı__(II), **kalın** yap ----------
    var ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
    var MARK_RE = /(__(?![_\s])[^\n]*?[^_\s]__)\((?:I{1,3}|IV|VI{0,3}|IX|X)\)/g;
    // Numaralı sözleri metindeki sırasına göre I, II, III… diye yeniden numarala
    function renumber(text) { var i = 0; return String(text).replace(MARK_RE, function (all, w) { return w + "(" + ROMAN[Math.min(i++, 9)] + ")"; }); }
    function applyFormat(value, a, b, kind) {
        var before = value.slice(0, a), sel = value.slice(a, b), after = value.slice(b);
        if (kind === "clear") {
            var m1 = /(__|\*\*)$/.exec(before), m2 = /^(__(?:\((?:I{1,3}|IV|VI{0,3}|IX|X|\d{1,2})\))?|\*\*)/.exec(after);
            if (m1 && m2 && m1[1].charAt(0) === m2[1].charAt(0)) { before = before.slice(0, -m1[1].length); after = after.slice(m2[1].length); }
            var plain = L.richParse(sel).map(function (x) { return x.t; }).join("");
            var v0 = before + plain + after, r0 = renumber(v0), s0 = renumber(before).length;
            return { value: r0, sel: [s0, s0 + plain.length] };
        }
        // seçimin kenarındaki boşluklar biçimin dışında kalsın
        var lead = /^\s*/.exec(sel)[0], core = sel.slice(lead.length), trail = /\s*$/.exec(core)[0];
        core = core.slice(0, core.length - trail.length);
        if (!core) core = kind === "b" ? "kalın" : "söz";
        var open = kind === "b" ? "**" : "__", close = kind === "b" ? "**" : "__" + (kind === "mark" ? "(I)" : "");
        var pre = before + lead + open, v = pre + core + close + trail + after;
        if (kind === "mark") { v = renumber(v); pre = renumber(pre); }
        return { value: v, sel: [pre.length, pre.length + core.length] };
    }
    function FmtBar(props) {
        function B(p) {
            return <button type="button" title={p.title} aria-label={p.label} disabled={props.disabled}
                onMouseDown={function (e) { e.preventDefault(); }} onClick={function () { props.onFormat(p.kind); }}
                className="h-8 px-2.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-white/70 dark:bg-stone-900/40 text-xs font-semibold inline-flex items-center gap-1.5 hover:border-indigo-400 disabled:opacity-40">{p.children}</button>;
        }
        return (
            <div className="flex flex-wrap items-center gap-1.5" role="toolbar" aria-label="Metin biçimi">
                <B kind="u" label="Altını çiz" title="Altını çiz (Ctrl+U)"><span className="underline underline-offset-2 font-black">A</span>Altını çiz</B>
                <B kind="mark" label="Numaralı altı çizili" title="Altı çizili + numara (Ctrl+Shift+U)"><span className="live-mark font-black"><u>A</u><span className="live-num">I</span></span>Numaralı</B>
                <B kind="b" label="Kalın" title="Kalın (Ctrl+B)"><b className="font-black">B</b>Kalın</B>
                <B kind="clear" label="Biçimi kaldır" title="Seçili yerdeki biçimi kaldır">✕ Biçimi kaldır</B>
                <span className="text-[11px] text-stone-500">{props.hint}</span>
            </div>
        );
    }
    // Soru metni biçimi (L.richParse): __söz__ altı çizili, __söz__(II) altında numara, **söz** kalın
    function Rich(props) {
        return L.richParse(props.text).map(function (x, i) {
            if (x.b) return <b key={i}>{x.t}</b>;
            if (!x.u) return <React.Fragment key={i}>{x.t}</React.Fragment>;
            if (!x.m) return <u key={i} className="live-u">{x.t}</u>;
            return <span key={i} className="live-mark"><u className="live-u">{x.t}</u><span className="live-num">{x.m}</span></span>;
        });
    }
    // Öğrencinin sınav ekranında göreceği hâl (LiveExamScreen ile aynı sınıflar)
    function Preview(props) {
        var x = props.q;
        return (
            <div>
                <div className="q-stem p-4 sm:p-6 rounded-3xl relative overflow-hidden">
                    <div className="q-stem-bar absolute top-0 left-0 w-1.5 h-full"></div>
                    <p className="text-xs font-bold text-stone-500 mb-2 pl-2">Soru {x.no} / 120 · {L.BOLUM[x.bolum]} · {x.ders}</p>
                    <h3 className="text-base font-bold leading-relaxed whitespace-pre-line text-stone-900 pl-2">{x.metin ? <Rich text={x.metin} /> : "…"}</h3>
                    {props.img ? <img src={props.img} alt={"Soru " + x.no + " önizleme görseli"} className="live-img mt-4" /> : null}
                </div>
                <div className="space-y-2 mt-3">
                    {L.LETTERS.map(function (l, i) {
                        var ok = props.reveal && x.dogru === l;
                        return (
                            <div key={l} className={"p-3 rounded-2xl border-2 font-semibold flex items-center gap-3 text-sm " + (ok ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30" : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700")}>
                                <span className="live-letter shrink-0">{l}</span>
                                <span className="min-w-0">{x.siklar[i] ? <Rich text={x.siklar[i]} /> : <i className="text-rose-600">boş</i>}</span>
                                {ok ? <span className="ml-auto text-emerald-700 dark:text-emerald-300 text-xs shrink-0">✓ doğru</span> : null}
                            </div>
                        );
                    })}
                </div>
                {props.reveal && x.cozum ? <p className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 whitespace-pre-line text-sm"><b>Çözüm:</b> <Rich text={x.cozum} /></p> : null}
            </div>
        );
    }
    function Chip(props) {
        return <button type="button" aria-pressed={!!props.on} onClick={props.onClick}
            className={"px-2.5 py-1 rounded-full text-xs font-semibold border " + (props.on ? "bg-indigo-600 border-indigo-600 text-white" : "border-stone-300 dark:border-stone-600")}>{props.children}</button>;
    }

    function QuestionEditor(props) {
        var exam = props.exam, dkey = draftKey(exam.id);
        const [data, setData] = useState(null);
        const [base, setBase] = useState([]);
        const [baseImgs, setBaseImgs] = useState({});
        const [list, setList] = useState([]);
        const [imgs, setImgs] = useState({});
        const [cur, setCur] = useState(1);
        const [flag, setFlag] = useState("all");
        const [q, setQ] = useState("");
        const [reveal, setReveal] = useState(true);
        const [busy, setBusy] = useState("");
        const [msg, setMsg] = useState("");
        const [err, setErr] = useState("");
        const [imgNote, setImgNote] = useState("");
        const [draft, setDraft] = useState(null);
        const [ready, setReady] = useState(false);
        const [draftWarn, setDraftWarn] = useState("");
        const [confirm, setConfirm] = useState(false);
        const [drag, setDrag] = useState(false);
        const [navOpen, setNavOpen] = useState(false); // telefonda soru haritası
        var fileRef = React.useRef(null), paneRef = React.useRef(null);
        var fieldRef = React.useRef(null), metinEl = React.useRef(null); // biçim araç çubuğunun uygulanacağı alan
        // soru değişince düzenleme paneli başa dönsün; ızgarada seçili kutu görünür kalsın
        useEffect(function () {
            if (paneRef.current) paneRef.current.scrollTop = 0;
            var t = document.querySelector('[aria-label="Soru gezinme"] [aria-current="true"]');
            if (t && t.scrollIntoView) t.scrollIntoView({ block: "nearest" });
        }, [cur]);

        function load() {
            setErr(""); setReady(false);
            return C.rpc("live_admin_questions", { p_exam: exam.id }).then(function (d) {
                var docs = (d.questions || []).map(toDoc);
                setData(d); setBase(docs); setList(docs);
                var dr = C.getJson(dkey);
                if (d.editable && dr && dr.qs && dr.qs.length) setDraft(dr);
                else { setDraft(null); setReady(true); }
                if (!d.booklet) { setImgs({}); setBaseImgs({}); return; }
                setImgNote("Görseller kitapçıktan açılıyor…");
                return C.sb().storage.from("live-exam").download(d.booklet.path).then(function (r) {
                    if (r.error || !r.data) throw new Error("Kitapçık indirilemedi.");
                    return r.data.arrayBuffer();
                }).then(function (buf) {
                    return L.decryptBooklet(new Uint8Array(buf), d.booklet.key, d.booklet.sha);
                }).then(function (txt) {
                    var bk = JSON.parse(txt), byNo = {}, map = {};
                    (bk.questions || []).forEach(function (x) { if (x.image) byNo[x.no] = x.image; });
                    (d.questions || []).forEach(function (x) { if (x.image && byNo[x.no]) map[x.image] = byNo[x.no]; });
                    setBaseImgs(map);
                    // bu arada seçilen görseller öncelikli
                    setImgs(function (m) { return Object.assign({}, map, m); });
                    setImgNote("");
                }).catch(function (x) { setImgNote("Görseller açılamadı: " + x.message + " (görselli soruları kaydetmeden önce görseli yeniden seç)."); });
            }).catch(function (x) { setErr(x.message); });
        }
        useEffect(function () { setImgs({}); load(); }, [exam.id]);

        var editable = !!(data && data.editable);
        var byNo = React.useMemo(function () { var m = {}; list.forEach(function (x) { m[x.no] = x; }); return m; }, [list]);
        var baseBy = React.useMemo(function () { var m = {}; base.forEach(function (x) { m[x.no] = x; }); return m; }, [base]);
        var dirty = React.useMemo(function () {
            var m = {};
            list.forEach(function (x) {
                var b = baseBy[x.no];
                if (!b || !same(x, b) || (x.gorsel && imgs[x.gorsel] !== baseImgs[x.gorsel])) m[x.no] = true;
            });
            return m;
        }, [list, baseBy, imgs, baseImgs]);
        var check = React.useMemo(function () {
            if (!list.length) return null;
            var presence = {};
            Object.keys(imgs).forEach(function (k) { presence[k] = true; });
            return L.validateUpload({ kulvar: exam.track, baslik: exam.title, sorular: list }, catalog(), window.KONU_LABELS || {}, presence);
        }, [list, imgs]);
        var issues = React.useMemo(function () {
            var m = {}, general = [];
            function add(kind, s) {
                var r = /^Soru (\d+)\b/.exec(s);
                if (!r) { if (kind === "errors") general.push(s); return; }
                var e = m[r[1]] || (m[r[1]] = { errors: [], warnings: [] });
                e[kind].push(s.replace(/^Soru \d+\s*[:·-]?\s*/, ""));
            }
            if (check) { check.errors.forEach(function (s) { add("errors", s); }); check.warnings.forEach(function (s) { add("warnings", s); }); }
            return { by: m, general: general };
        }, [check]);
        var nDirty = Object.keys(dirty).length;
        var nErr = Object.keys(issues.by).filter(function (k) { return issues.by[k].errors.length; }).length;
        var nImg = list.filter(function (x) { return x.gorsel; }).length;
        var canSave = editable && nDirty > 0 && check && check.ok && !busy;

        // taslağı yaz (kısa gecikmeyle)
        useEffect(function () {
            if (!ready || !editable) return;
            var t = setTimeout(function () {
                var nos = Object.keys(dirty);
                try {
                    if (!nos.length) { localStorage.removeItem(dkey); setDraftWarn(""); return; }
                    var qs = list.filter(function (x) { return dirty[x.no]; }), im = {};
                    qs.forEach(function (x) { if (x.gorsel && imgs[x.gorsel] && imgs[x.gorsel] !== baseImgs[x.gorsel]) im[x.gorsel] = imgs[x.gorsel]; });
                    var rec = { at: Date.now(), sha: data.booklet && data.booklet.sha, qs: qs, imgs: im };
                    try { localStorage.setItem(dkey, JSON.stringify(rec)); setDraftWarn(""); }
                    catch (e) { rec.imgs = {}; localStorage.setItem(dkey, JSON.stringify(rec)); setDraftWarn("Yeni görseller tarayıcı taslağına sığmadı; sayfayı kapatmadan önce kaydet."); }
                } catch (e) {}
            }, 400);
            return function () { clearTimeout(t); };
        }, [list, imgs, ready]);

        // görüntülenen (filtreli) sorular
        var needle = q.trim().toLocaleLowerCase("tr");
        var match = {};
        list.forEach(function (x) {
            if (flag === "dirty" && !dirty[x.no]) return;
            if (flag === "error" && !(issues.by[x.no] && issues.by[x.no].errors.length)) return;
            if (flag === "image" && !x.gorsel) return;
            if (needle && !/^\d+$/.test(needle) && (x.metin + " " + kLabel(x.konu) + " " + x.siklar.join(" ") + " " + x.cozum).toLocaleLowerCase("tr").indexOf(needle) < 0) return;
            match[x.no] = true;
        });
        var shownNos = list.map(function (x) { return x.no; }).filter(function (n) { return match[n]; });
        var nMatch = shownNos.length;
        function step(d) {
            var pool = shownNos.length ? shownNos : list.map(function (x) { return x.no; });
            var i = pool.indexOf(cur);
            if (i < 0) { var next = pool.filter(function (n) { return d > 0 ? n > cur : n < cur; }); if (next.length) setCur(d > 0 ? next[0] : next[next.length - 1]); return; }
            var j = i + d;
            if (j >= 0 && j < pool.length) setCur(pool[j]);
        }

        function patch(no, f) {
            setList(function (cl) { return cl.map(function (x) { return x.no === no ? Object.assign({}, x, f) : x; }); });
            setMsg("");
        }
        function setOption(no, i, v) {
            var s2 = byNo[no].siklar.slice(); s2[i] = v;
            patch(no, { siklar: s2 });
        }
        // Biçim: son odaklanan alana (soru metni, şık ya da çözüm) uygula
        function focusField(field) { return function (e) { fieldRef.current = { el: e.target, field: field, no: cur }; }; }
        function format(kind, el0) {
            var f = fieldRef.current, el = el0 || (f && f.no === cur && f.el && document.body.contains(f.el) ? f.el : metinEl.current);
            if (!el || !editable) return;
            var field = el === metinEl.current ? "metin" : (f && f.el === el ? f.field : "metin");
            var r = applyFormat(el.value, el.selectionStart, el.selectionEnd, kind);
            if (r.value === el.value) return;
            if (field === "metin") patch(cur, { metin: r.value });
            else if (field === "cozum") patch(cur, { cozum: r.value });
            else setOption(cur, field, r.value);
            requestAnimationFrame(function () { try { el.focus(); el.setSelectionRange(r.sel[0], r.sel[1]); } catch (e) {} });
        }
        function setImage(no, file) {
            if (!editable || !file) return;
            if (!/^image\/(png|jpeg|webp|svg\+xml|gif)$/.test(file.type)) { setMsg("Yalnızca PNG, JPG, WEBP ya da SVG görsel eklenebilir."); return; }
            setMsg("Görsel hazırlanıyor…");
            fitImage(file).then(function (r) {
                var x = byNo[no], mime = /^data:image\/([a-z+]+)/.exec(r.url), ext = mime ? mime[1].replace("jpeg", "jpg").replace("svg+xml", "svg") : "png";
                var name = x.gorsel || ("soru-" + no + "." + ext);
                setImgs(function (m) { var n = Object.assign({}, m); n[name] = r.url; return n; });
                patch(no, { gorsel: name });
                setMsg(r.note || ("Soru " + no + ": görsel " + (x.gorsel ? "değiştirildi." : "eklendi.")));
            }).catch(function (x) { setMsg(x.message); });
        }
        function revertOne(no) {
            var b = baseBy[no];
            if (!b) return;
            setList(function (cl) { return cl.map(function (x) { return x.no === no ? b : x; }); });
            if (b.gorsel && baseImgs[b.gorsel]) setImgs(function (m) { var n = Object.assign({}, m); n[b.gorsel] = baseImgs[b.gorsel]; return n; });
            setMsg("Soru " + no + " kayıtlı hâline döndü.");
        }
        function revertAll() {
            if (!window.confirm(nDirty + " sorudaki kaydedilmemiş değişiklikler silinsin mi?")) return;
            setList(base); setImgs(baseImgs);
            try { localStorage.removeItem(dkey); } catch (e) {}
            setMsg("Tüm değişiklikler geri alındı.");
        }
        function restoreDraft() {
            var m = {};
            draft.qs.forEach(function (x) { m[x.no] = x; });
            setList(base.map(function (x) { return m[x.no] || x; }));
            setImgs(function (cur0) { return Object.assign({}, cur0, draft.imgs || {}); });
            setDraft(null); setReady(true);
            setMsg("Taslak geri yüklendi: " + draft.qs.length + " soru.");
            setCur(draft.qs[0].no);
        }
        function dropDraft() {
            try { localStorage.removeItem(dkey); } catch (e) {}
            setDraft(null); setReady(true);
        }
        function doSave() {
            setConfirm(false); setErr(""); setMsg("");
            saveQuestions(exam, check.questions, imgs, setBusy).then(function () {
                try { localStorage.removeItem(dkey); } catch (e) {}
                setBusy(""); setMsg("✓ Kaydedildi; kitapçık yeniden şifrelendi.");
                if (props.onSaved) props.onSaved();
                return load();
            }).catch(function (x) { setBusy(""); setErr(x.message); });
        }
        function exportJson() {
            downloadText("deneme-" + exam.id.slice(0, 8) + ".json", JSON.stringify({ kulvar: exam.track, baslik: exam.title, sorular: list }, null, 2));
        }

        // klavye: Ctrl+S kaydet · ←/→ (alanda Alt+↑/↓) gez · A–E doğru cevap · görsel yapıştır
        useEffect(function () {
            function onKey(e) {
                var t = e.target, inField = t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName);
                if ((e.ctrlKey || e.metaKey) && !e.altKey && (e.key === "s" || e.key === "S")) { e.preventDefault(); if (canSave) setConfirm(true); return; }
                if (confirm) { if (e.key === "Escape") setConfirm(false); return; }
                if (e.altKey && (e.key === "ArrowDown" || e.key === "ArrowUp")) { e.preventDefault(); step(e.key === "ArrowDown" ? 1 : -1); return; }
                if (inField || e.ctrlKey || e.metaKey || e.altKey) return;
                if (e.key === "ArrowRight") { e.preventDefault(); step(1); return; }
                if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); return; }
                var l = String(e.key || "").toUpperCase();
                if (editable && byNo[cur] && L.LETTERS.indexOf(l) >= 0) { e.preventDefault(); patch(cur, { dogru: l }); }
            }
            function onPaste(e) {
                if (!editable || confirm) return;
                var items = (e.clipboardData && e.clipboardData.items) || [];
                for (var i = 0; i < items.length; i++) {
                    if (items[i].kind === "file" && /^image\//.test(items[i].type)) { e.preventDefault(); setImage(cur, items[i].getAsFile()); return; }
                }
            }
            window.addEventListener("keydown", onKey);
            window.addEventListener("paste", onPaste);
            return function () { window.removeEventListener("keydown", onKey); window.removeEventListener("paste", onPaste); };
        });

        if (!data) return <Box title="Sorular">{err || "Yükleniyor…"}</Box>;
        var x = byNo[cur] || list[0];
        if (!x) return <Box title="Sorular">Bu denemede soru yok.</Box>;
        var tst = testOf(x.no), iss = issues.by[x.no] || { errors: [], warnings: [] };
        var img = x.gorsel ? imgs[x.gorsel] : null;
        var dup = [];
        x.siklar.forEach(function (s, i) {
            for (var j = 0; j < i; j++) if (s && s.trim() && s.trim() === String(x.siklar[j] || "").trim()) dup.push(L.LETTERS[j] + " ile " + L.LETTERS[i]);
        });
        var poolPos = shownNos.indexOf(x.no);
        var summary = confirm ? list.filter(function (s) { return dirty[s.no]; }).map(function (s) { return { q: s, ch: changes(baseBy[s.no] || s, s, baseImgs, imgs) }; }) : [];
        var keyChanges = summary.filter(function (s) { return s.ch.some(function (c) { return c.key; }); }).length;

        return (
            <div className="space-y-4 pb-20 lg:pb-0">
                <div className="rounded-2xl glass p-3 flex flex-wrap items-center gap-2 shadow-sm">
                    <Btn onClick={props.onBack}>← Deneme</Btn>
                    <div className="min-w-0">
                        <h1 className="text-lg font-black leading-tight truncate">Sorular · {exam.title}</h1>
                        <p className="text-xs text-stone-500">{L.TRACKS[exam.track]} · {editable ? "düzenleme " + dt(exam.reg_closes_at) + "'a kadar açık" : "🔒 kayıt kapandı, yalnızca görüntüleme"}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 ml-auto">
                        {nDirty ? <span className="text-xs font-bold px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200">{nDirty} değişiklik</span> : null}
                        {nErr ? <span className="text-xs font-bold px-2 py-1 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200">{nErr} hatalı soru</span> : null}
                        <Btn onClick={exportJson}>JSON indir</Btn>
                        {editable && nDirty ? <Btn disabled={!!busy} onClick={revertAll}>Tümünü geri al</Btn> : null}
                        {editable ? <Btn primary disabled={!canSave} onClick={function () { setConfirm(true); }}>{busy || ("Kaydet" + (nDirty ? " (" + nDirty + ")" : ""))}</Btn> : null}
                    </div>
                </div>

                {draft ? (
                    <div className="rounded-2xl border border-amber-300 bg-amber-50 dark:bg-amber-950/30 p-4 text-sm" role="status">
                        <p className="font-semibold">Bu tarayıcıda kaydedilmemiş bir taslak var: {draft.qs.length} soru ({L.fmtDay(draft.at, true)} {L.fmtClock(draft.at)}).</p>
                        {data.booklet && draft.sha && draft.sha !== data.booklet.sha ? <p className="mt-1 text-amber-800 dark:text-amber-200">Taslaktan sonra sorular yeniden kaydedilmiş; geri yüklersen bu sorulardaki yeni hâlin üzerine yazılır.</p> : null}
                        <div className="flex gap-2 mt-2"><Btn primary onClick={restoreDraft}>Taslağı geri yükle</Btn><Btn onClick={dropDraft}>Taslağı sil</Btn></div>
                    </div>
                ) : null}
                {msg ? <p className="text-sm" role="status">{msg}</p> : null}
                {err ? <p className="text-sm text-rose-600" role="alert">{err}</p> : null}
                {imgNote ? <p className="text-sm text-amber-700">{imgNote}</p> : null}
                {draftWarn ? <p className="text-sm text-amber-700">{draftWarn}</p> : null}
                {issues.general.length ? (
                    <ul className="text-sm text-rose-700">{issues.general.map(function (s, i) { return <li key={i}>• {s}</li>; })}</ul>
                ) : null}

                <div className="grid gap-4 items-start lg:grid-cols-[232px_minmax(0,1fr)] xl:grid-cols-[232px_minmax(0,1fr)_minmax(0,0.85fr)] xl:items-stretch xl:h-[calc(100vh-13rem)] xl:min-h-[560px]">
                    <aside className="rounded-2xl glass p-3 space-y-3 xl:h-full overflow-auto" aria-label="Soru gezinme">
                        <input className="w-full px-3 py-2 rounded-xl border text-sm" placeholder="Ara ya da no yaz + Enter" value={q} aria-label="Sorularda ara"
                            onChange={function (e) { setQ(e.target.value); }}
                            onKeyDown={function (e) {
                                if (e.key !== "Enter") return;
                                var n = parseInt(q, 10);
                                if (/^\d+$/.test(q.trim()) && byNo[n]) { setCur(n); setQ(""); }
                                else if (shownNos.length) setCur(shownNos[0]);
                            }} />
                        <div className="flex flex-wrap gap-1">
                            <Chip on={flag === "all"} onClick={function () { setFlag("all"); }}>Tümü</Chip>
                            <Chip on={flag === "dirty"} onClick={function () { setFlag("dirty"); }}>Değişen {nDirty}</Chip>
                            <Chip on={flag === "error"} onClick={function () { setFlag("error"); }}>Hatalı {nErr}</Chip>
                            <Chip on={flag === "image"} onClick={function () { setFlag("image"); }}>Görselli {nImg}</Chip>
                        </div>
                        {(needle && !/^\d+$/.test(needle)) || flag !== "all" ? <p className="text-xs text-stone-500" role="status">{nMatch} soru eşleşti · ←/→ yalnızca bunlarda gezer</p> : null}
                        <button type="button" className="lg:hidden w-full flex items-center justify-between rounded-xl border border-stone-300 dark:border-stone-600 px-3 py-2 text-sm font-semibold"
                            aria-expanded={navOpen} onClick={function () { setNavOpen(!navOpen); }}>
                            <span>Soru haritası · {cur}/120</span><span aria-hidden="true">{navOpen ? "▴" : "▾"}</span>
                        </button>
                        <div className={(navOpen ? "" : "hidden ") + "lg:block space-y-3"}>
                        {L.EXAM_PLAN.map(function (t) {
                            var nos = [];
                            for (var n = t.from; n <= t.to; n++) nos.push(n);
                            return (
                                <div key={t.key}>
                                    <p className="text-xs font-bold flex justify-between"><span>{t.key}</span><span className="text-stone-500 font-normal">{t.from}–{t.to}</span></p>
                                    <div className="grid grid-cols-6 gap-1 mt-1">
                                        {nos.map(function (n) {
                                            var s = byNo[n];
                                            if (!s) return <span key={n} className="h-8 rounded-lg border border-dashed border-stone-300 text-[10px] grid place-items-center text-stone-400">{n}</span>;
                                            var e = issues.by[n] && issues.by[n].errors.length, on = n === x.no;
                                            var label = "Soru " + n + (dirty[n] ? ", değişti" : "") + (e ? ", hatalı" : "") + (s.gorsel ? ", görselli" : "");
                                            return (
                                                <button key={n} type="button" onClick={function () { setCur(n); setNavOpen(false); }} aria-current={on ? "true" : undefined} aria-label={label} title={label}
                                                    className={"relative h-8 rounded-lg text-xs font-bold border " +
                                                        (on ? "bg-indigo-600 text-white border-indigo-600" : e ? "bg-rose-50 text-rose-800 border-rose-400 dark:bg-rose-950/40 dark:text-rose-200" : dirty[n] ? "bg-indigo-50 text-indigo-800 border-indigo-400 dark:bg-indigo-950/40 dark:text-indigo-200" : "border-stone-200 dark:border-stone-700") +
                                                        (match[n] || on ? "" : " opacity-25")}>
                                                    {n}{s.gorsel ? <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-sky-500" aria-hidden="true"></span> : null}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                        <p className="text-[11px] text-stone-500 leading-snug">
                            <span className="inline-block w-2 h-2 rounded-full bg-sky-500 mr-1"></span>görselli ·
                            <span className="inline-block w-2.5 h-2.5 rounded border border-indigo-400 bg-indigo-50 mx-1 align-middle"></span>değişti ·
                            <span className="inline-block w-2.5 h-2.5 rounded border border-rose-400 bg-rose-50 mx-1 align-middle"></span>hatalı
                        </p>
                        </div>
                        <p className="hidden lg:block text-[11px] text-stone-500 leading-snug"><kbd>←</kbd> <kbd>→</kbd> soru değiştir (yazarken <kbd>Alt</kbd>+<kbd>↑</kbd>/<kbd>↓</kbd>) · <kbd>A</kbd>–<kbd>E</kbd> doğru cevap · <kbd>Ctrl</kbd>+<kbd>S</kbd> kaydet · <kbd>Ctrl</kbd>+<kbd>V</kbd> görsel yapıştır</p>
                    </aside>

                    <section ref={paneRef} className="rounded-2xl glass p-4 sm:p-5 space-y-4 min-w-0 xl:h-full xl:overflow-auto" aria-label={"Soru " + x.no + " düzenleme"}>
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-2xl font-black">Soru {x.no}</h2>
                            <span className="text-sm text-stone-500">{tst.key} testi · {x.no - tst.from + 1}/{tst.n}</span>
                            {dirty[x.no] ? <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200">✎ değişti</span> : null}
                            <div className="ml-auto hidden lg:flex gap-2">
                                <Btn disabled={poolPos === 0 || (poolPos < 0 && !shownNos.some(function (n) { return n < x.no; }))} onClick={function () { step(-1); }}>← Önceki</Btn>
                                <Btn disabled={poolPos === shownNos.length - 1 || (poolPos < 0 && !shownNos.some(function (n) { return n > x.no; }))} onClick={function () { step(1); }}>Sonraki →</Btn>
                            </div>
                        </div>
                        {iss.errors.length || iss.warnings.length || dup.length ? (
                            <ul className="text-sm space-y-0.5 rounded-xl p-3 bg-stone-50 dark:bg-stone-800/50">
                                {iss.errors.map(function (s, i) { return <li key={"e" + i} className="text-rose-700 dark:text-rose-300">⚠ {s}</li>; })}
                                {iss.warnings.map(function (s, i) { return <li key={"w" + i} className="text-amber-700 dark:text-amber-300">• {s}</li>; })}
                                {dup.map(function (s, i) { return <li key={"d" + i} className="text-amber-700 dark:text-amber-300">• Şık {s} aynı.</li>; })}
                            </ul>
                        ) : null}
                        <div className="grid sm:grid-cols-2 gap-3 text-sm">
                            <label>Ders
                                <select className="mt-1 w-full px-3 py-2 rounded-xl border" disabled={!editable} value={x.ders}
                                    onChange={function (e) { var nd = e.target.value; patch(x.no, { ders: nd, konu: konuKeys(nd)[0] || "" }); }}>
                                    {(x.bolum === "GY" ? GY_DERS : GK_DERS).map(function (d) { return <option key={d} value={d}>{d}</option>; })}
                                </select>
                            </label>
                            <label>Konu
                                <select className="mt-1 w-full px-3 py-2 rounded-xl border" disabled={!editable} value={x.konu}
                                    onChange={function (e) { patch(x.no, { konu: e.target.value }); }}>
                                    {konuKeys(x.ders).indexOf(x.konu) < 0 ? <option value={x.konu}>{x.konu} (data.js'te yok)</option> : null}
                                    {konuKeys(x.ders).map(function (k) { return <option key={k} value={k}>{kLabel(k)}</option>; })}
                                </select>
                            </label>
                        </div>
                        {editable ? <FmtBar onFormat={function (k) { format(k); }} hint="Sözü seç, düğmeye bas · şık ve çözümde de çalışır" /> : null}
                        <label className="block text-sm">Soru metni <span className="text-xs text-stone-500">(öncüller için yeni satır)</span>
                            <AutoText min={110} disabled={!editable} value={x.metin} onChange={function (v) { patch(x.no, { metin: v }); }}
                                tref={function (el) { metinEl.current = el; }} onFocus={focusField("metin")} onFormatKey={format} />
                        </label>
                        <fieldset className="text-sm">
                            <legend className="mb-1">Şıklar{editable ? <span className="text-xs text-stone-500"> · harfe tıkla ya da A–E'ye bas: doğru cevap</span> : null}</legend>
                            {L.LETTERS.map(function (l, i) {
                                var on = x.dogru === l;
                                return (
                                    <div key={l} className="flex items-center gap-2 mt-1.5">
                                        <button type="button" disabled={!editable} aria-pressed={on} aria-label={l + " doğru cevap"} title={on ? "Doğru cevap" : "Doğru cevap yap"}
                                            onClick={function () { patch(x.no, { dogru: l }); }}
                                            className={"w-9 h-9 shrink-0 rounded-full border-2 font-black " + (on ? "bg-emerald-600 border-emerald-600 text-white" : "border-stone-300 dark:border-stone-600 hover:border-emerald-500")}>{l}</button>
                                        <AutoText line min={40} className={on ? "border-emerald-500" : ""} disabled={!editable} value={x.siklar[i] || ""}
                                            onChange={function (v) { setOption(x.no, i, v); }} label={"Şık " + l} onFocus={focusField(i)} onFormatKey={format} />
                                    </div>
                                );
                            })}
                        </fieldset>
                        <label className="block text-sm">Çözüm
                            <AutoText min={72} disabled={!editable} value={x.cozum} onChange={function (v) { patch(x.no, { cozum: v }); }} onFocus={focusField("cozum")} onFormatKey={format} />
                        </label>
                        <div className="text-sm">
                            <p className="mb-1">Görsel{x.gorsel ? <span className="text-stone-500"> · {x.gorsel}{img ? " · " + (dataUrlKb(img) || "<1") + " KB" : ""}</span> : null}</p>
                            <div className={"rounded-2xl border-2 border-dashed p-3 " + (drag ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30" : "border-stone-300 dark:border-stone-600")}
                                onDragOver={function (e) { if (!editable) return; e.preventDefault(); setDrag(true); }}
                                onDragLeave={function () { setDrag(false); }}
                                onDrop={function (e) { if (!editable) return; e.preventDefault(); setDrag(false); setImage(x.no, e.dataTransfer.files && e.dataTransfer.files[0]); }}>
                                {img ? <img src={img} alt={"Soru " + x.no + " görseli"} className="max-h-72 mx-auto rounded-xl border bg-white" /> : null}
                                {x.gorsel && !img ? <p className="text-amber-700">Bu görsel elde yok; kaydetmeden önce yeniden seç.</p> : null}
                                {!x.gorsel ? <p className="text-stone-500 text-center py-3">{editable ? "Görsel yok. Sürükleyip bırak, Ctrl+V ile yapıştır ya da seç." : "Görsel yok."}</p> : null}
                                <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                                    {editable ? <Btn onClick={function () { fileRef.current && fileRef.current.click(); }}>{x.gorsel ? "Görseli değiştir" : "Görsel seç"}</Btn> : null}
                                    {editable && x.gorsel ? <Btn onClick={function () { patch(x.no, { gorsel: undefined }); }}>Görseli kaldır</Btn> : null}
                                    {img ? <a className="underline text-sm" href={img} download={x.gorsel}>İndir</a> : null}
                                </div>
                                <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="sr-only" tabIndex={-1} aria-label="Görsel dosyası seç"
                                    onChange={function (e) { setImage(x.no, e.target.files && e.target.files[0]); e.target.value = ""; }} />
                            </div>
                            {editable ? <p className="text-xs text-stone-500 mt-1">Büyük fotoğraflar otomatik küçültülür (en çok 1 MB).</p> : null}
                        </div>
                        {editable && dirty[x.no] ? <div><Btn onClick={function () { revertOne(x.no); }}>Bu soruyu geri al</Btn></div> : null}
                    </section>

                    <aside className="rounded-2xl glass p-4 min-w-0 lg:col-start-2 xl:col-start-auto xl:h-full xl:overflow-auto" aria-label="Öğrenci görünümü">
                        <div className="flex items-center justify-between gap-2 mb-3">
                            <h2 className="font-bold">Öğrenci görünümü</h2>
                            <label className="text-xs flex items-center gap-1.5"><input type="checkbox" checked={reveal} onChange={function (e) { setReveal(e.target.checked); }} />Cevap ve çözüm</label>
                        </div>
                        <Preview q={x} img={img} reveal={reveal} />
                    </aside>
                </div>

                <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-stone-200 dark:border-stone-700 bg-white/95 dark:bg-stone-900/95 backdrop-blur px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex items-center gap-2">
                    <button type="button" className="w-11 h-11 rounded-xl border border-stone-300 dark:border-stone-600 text-lg disabled:opacity-30" aria-label="Önceki soru" disabled={poolPos === 0} onClick={function () { step(-1); }}>←</button>
                    <div className="flex-1 min-w-0 text-center text-sm">
                        <b>Soru {x.no}</b><span className="text-stone-500"> · doğru {x.dogru}</span>
                        {nDirty ? <span className="block text-[11px] text-indigo-700 dark:text-indigo-300">{nDirty} kaydedilmemiş değişiklik</span> : null}
                    </div>
                    <button type="button" className="w-11 h-11 rounded-xl border border-stone-300 dark:border-stone-600 text-lg disabled:opacity-30" aria-label="Sonraki soru" disabled={poolPos === shownNos.length - 1} onClick={function () { step(1); }}>→</button>
                    {editable ? <button type="button" className="h-11 px-4 rounded-xl bg-indigo-600 text-white text-sm font-semibold disabled:opacity-40" disabled={!canSave} onClick={function () { setConfirm(true); }}>{busy ? "…" : "Kaydet"}</button> : null}
                </div>

                {confirm ? (
                    <div className="fixed inset-0 z-[70] bg-black/45 flex items-end sm:items-center justify-center p-3" role="dialog" aria-modal="true" aria-labelledby="qe-save-title">
                        <div className="w-full max-w-2xl max-h-[85vh] flex flex-col bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 shadow-2xl">
                            <h2 id="qe-save-title" className="text-xl font-black">{nDirty} soru kaydedilsin mi?</h2>
                            <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">Sorular kaydedilir, kitapçık yeniden şifrelenip yüklenir. Kayıt {dt(exam.reg_closes_at)}'da kapanınca sorular kilitlenir.</p>
                            {keyChanges ? <p className="text-sm mt-2 p-2 rounded-xl bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">⚠ {keyChanges} sorunun doğru cevabı değişiyor; cevap anahtarını bir kez daha kontrol et.</p> : null}
                            <ul className="mt-3 overflow-auto space-y-2 text-sm pr-1">
                                {summary.map(function (s) {
                                    return (
                                        <li key={s.q.no} className="rounded-xl border border-stone-200 dark:border-stone-700 p-2.5">
                                            <button type="button" className="font-bold underline-offset-2 hover:underline" onClick={function () { setConfirm(false); setCur(s.q.no); }}>Soru {s.q.no}</button>
                                            <span className="text-stone-500"> · {s.q.ders}</span>
                                            <div className="flex flex-wrap gap-1.5 mt-1">
                                                {s.ch.map(function (c, i) {
                                                    return <span key={i} className={"px-2 py-0.5 rounded-full text-xs " + (c.key ? "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100 font-bold" : "bg-stone-100 dark:bg-stone-800")}>
                                                        {c.label}{c.from !== undefined ? ": " + c.from + " → " + c.to : ""}</span>;
                                                })}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                            <div className="flex justify-end gap-2 mt-4">
                                <Btn onClick={function () { setConfirm(false); }}>Vazgeç</Btn>
                                <button type="button" autoFocus onClick={doSave} className="px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white">Kaydet ve kitapçığı şifrele</button>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
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
                <div className="overflow-x-auto -mx-2">
                    <table className="w-full text-sm">
                        <thead><tr className="text-left text-[11px] uppercase tracking-wider text-stone-500"><th className="py-2 px-2 font-semibold">Öğrenci</th><th className="px-2 font-semibold">Durum</th><th className="px-2 font-semibold whitespace-nowrap">Okuma hatası</th><th className="px-2"><span className="sr-only">İşlem</span></th></tr></thead>
                        <tbody>
                            {rows.map(function (r) {
                                var st = r.submitted ? ["✓ Gönderdi · " + (SRC[r.source] || r.source || ""), "emerald"] : r.close_reason === "no_optic" ? ["Okutmadı (süre doldu)", "rose"] : ["Bekleniyor", "stone"];
                                return (
                                    <tr key={r.user_id} className={"border-t border-stone-100 dark:border-stone-800 " + (!r.submitted && r.fails ? "bg-amber-50/80 dark:bg-amber-900/20" : "")}>
                                        <td className="py-2 px-2 font-semibold">{r.nickname || r.user_id.slice(0, 8)}</td>
                                        <td className="px-2"><Pill tone={st[1]}>{st[0]}</Pill></td>
                                        <td className="px-2">{r.fails ? <span className="text-amber-800 dark:text-amber-300">{r.fails + " kez" + (r.last_fail && r.last_fail.code ? " (" + r.last_fail.code + ")" : "")}</span> : <span className="text-stone-300 dark:text-stone-600">–</span>}</td>
                                        <td className="px-2 text-right">{!r.submitted ? <Btn small onClick={function () { setEditing(r.user_id); setText(""); setNote(""); }}>Elle gir</Btn> : null}</td>
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

    var REG = { registered: ["Kayıtlı", "indigo"], waitlist: ["Yedek", "amber"], blocked: ["Engelli", "rose"], cancelled: ["Vazgeçti", "stone"] };
    function Stat(props) {
        var zero = !props.value;
        return (
            <div className={"rounded-2xl p-2.5 sm:p-3 border min-w-0 " + (props.alert && !zero ? "border-rose-300 bg-rose-50 dark:bg-rose-950/30 dark:border-rose-800" : "border-stone-200 dark:border-stone-700 bg-white/70 dark:bg-stone-900/40")}>
                <p className={"text-xl sm:text-2xl font-black tabular-nums " + (zero ? "text-stone-300 dark:text-stone-600" : props.alert ? "text-rose-700 dark:text-rose-300" : "")}>{props.alert && !zero ? "⚠ " : ""}{props.value || 0}</p>
                <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5 leading-tight">{props.label}</p>
            </div>
        );
    }
    function Fact(props) {
        return (
            <div className="rounded-2xl p-3 sm:p-4 border border-stone-200 dark:border-stone-700 bg-white/70 dark:bg-stone-900/40 min-w-0">
                <p className="text-[11px] uppercase tracking-wider font-semibold text-stone-500">{props.label}</p>
                <p className="text-base sm:text-lg font-black mt-0.5 leading-snug">{props.value}</p>
                {props.children}
            </div>
        );
    }
    function csvCell(v) { v = v == null ? "" : String(v); return /[";\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }

    function Detail(props) {
        var id = props.id;
        const [exam, setExam] = useState(null);
        const [regs, setRegs] = useState([]);
        const [mon, setMon] = useState(null);
        const [stats, setStats] = useState(null);
        const [err, setErr] = useState("");
        const [mins, setMins] = useState("10");
        const [editQs, setEditQs] = useState(false);
        const [replace, setReplace] = useState(false);
        const [find, setFind] = useState("");
        const [loadedAt, setLoadedAt] = useState(0);
        var now = useNow(15000);

        function load() {
            return C.rpc("live_admin_list").then(function (list) {
                var e = (list || []).filter(function (x) { return x.id === id; })[0];
                setExam(e || null); setLoadedAt(Date.now());
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
        if (editQs) return <QuestionEditor exam={exam} onBack={function () { setEditQs(false); load(); }} onSaved={load} />;
        var ph = phaseOf(exam, now);
        var live = ph.key === "live";
        var canEdit = (exam.status === "draft" || exam.status === "scheduled") && now < L.ms(exam.reg_closes_at);
        var lockedRegs = regs.filter(function (r) { return r.locked; });
        var hasDraft = canEdit && !!C.getJson("kpss-live-edit-" + exam.id);
        var mins0 = Math.round((L.ms(exam.ends_at) - L.ms(exam.starts_at)) / 60000);
        var needle = find.trim().toLocaleLowerCase("tr");
        var regRows = regs.filter(function (r) { return !needle || String(r.nickname || "").toLocaleLowerCase("tr").indexOf(needle) >= 0; });
        function exportCsv() {
            var rows = [["Takma ad", "Durum", "Biçim", "Girdi", "Cihaz değişimi", "Cevap", "Net"]].concat(regs.map(function (r) {
                return [r.nickname, (REG[r.status] || [r.status])[0], r.entered ? (r.mode === "paper" ? "Kâğıt" : "Cihaz") : "", r.entered ? "Evet" : "Hayır", r.switches || 0, r.answered || 0, r.net != null ? L.fmtNet(r.net) : ""];
            }));
            downloadText("kayitlar-" + exam.id.slice(0, 8) + ".csv", "﻿" + rows.map(function (r) { return r.map(csvCell).join(";"); }).join("\n"), "text/csv;charset=utf-8");
        }
        return (
            <div className="space-y-5">
                <button type="button" onClick={props.onBack} className="text-sm font-semibold text-stone-500 hover:text-stone-900 dark:hover:text-white">← Liste</button>
                <section className="rounded-3xl glass p-5 sm:p-7">
                    <div className="flex flex-wrap items-start gap-5">
                        <DateTile at={exam.starts_at} big />
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                                <Pill tone={ph.tone} dot pulse={ph.live}>{ph.label}</Pill>
                                <span className="text-xs px-2 py-1 rounded-full bg-stone-200 dark:bg-stone-700">{STATUS[exam.status]}</span>
                                <TrackPill track={exam.track} />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black mt-2 leading-tight">{exam.title}</h1>
                            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">{L.fmtDay(L.ms(exam.starts_at), true)} · {ph.text}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {exam.status === "draft" ? <Btn primary disabled={exam.questions !== 120 || !exam.has_booklet} title={exam.questions !== 120 || !exam.has_booklet ? "Önce 120 soruyu ve kitapçığı yükle" : ""} onClick={function () { run("live_admin_publish", { p_exam: id }, "Deneme yayınlansın ve kayda açılsın mı? Aynı kulvardaki bitmiş deneme arşive geçer."); }}>Yayınla (kayda aç)</Btn> : null}
                            {exam.status === "draft" ? <Btn dangerGhost onClick={function () { run("live_admin_discard_draft", { p_exam: id }, "Taslak kaldırılsın mı? (Yayınlanmış denemeler asla silinemez.)"); props.onBack(); }}>Taslağı kaldır</Btn> : null}
                        </div>
                    </div>
                    <Timeline exam={exam} now={now} />
                </section>
                {err ? <p className="text-sm text-rose-600" role="alert">{err}</p> : null}

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <Fact label="Sorular" value={<span>{exam.questions}<span className="text-stone-400 text-base">/120</span></span>}><div className="mt-2"><Meter value={exam.questions} max={120} done={exam.questions === 120} /></div></Fact>
                    <Fact label="Kitapçık" value={exam.has_booklet ? <span className="text-emerald-700 dark:text-emerald-300">Şifreli · yüklendi</span> : <span className="text-stone-400">Yüklenmedi</span>}>
                        <p className="text-xs text-stone-500 mt-1">Anahtar 10:15'te sınava girene verilir</p>
                    </Fact>
                    <Fact label="Kayıt" value={<span>{exam.registered}{exam.capacity ? <span className="text-stone-400 text-base">/{exam.capacity}</span> : null}</span>}>
                        {exam.capacity ? <div className="mt-2"><Meter value={exam.registered} max={exam.capacity} /></div> : <p className="text-xs text-stone-500 mt-1">Kontenjan sınırsız{exam.waitlist ? " · " + exam.waitlist + " yedek" : ""}</p>}
                    </Fact>
                    <Fact label="Süre" value={(mins0) + " dk"}><p className="text-xs text-stone-500 mt-1">{exam.extra_minutes ? exam.extra_minutes + " dk uzatıldı" : "Giriş 10:45'te kapanır"}</p></Fact>
                </div>

                {exam.questions ? (
                    <Box title={"Sorular (" + exam.questions + ")"}
                        sub={canEdit ? "Kayıt " + dt(exam.reg_closes_at) + "'da kapanana kadar soruları, cevap anahtarını ve görselleri düzenleyebilirsin." : "Kayıt kapandı; sorular yalnızca görüntülenebilir."}
                        actions={<Btn primary onClick={function () { setEditQs(true); }}>{canEdit ? "Soruları görüntüle / düzenle" : "Soruları görüntüle"}</Btn>}>
                        <div className="flex flex-wrap gap-2">
                            {L.EXAM_PLAN.map(function (t) {
                                return <span key={t.key} className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800"><b>{t.key}</b> <span className="text-stone-500">{t.from}–{t.to}</span></span>;
                            })}
                        </div>
                        {hasDraft ? <p className="text-sm text-amber-700 dark:text-amber-300 mt-3">● Bu tarayıcıda kaydedilmemiş soru düzenlemen var; editörü açınca geri yükleyebilirsin.</p> : null}
                        {canEdit ? (
                            <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-700">
                                {replace ? <Upload exam={exam} onDone={function () { setReplace(false); load(); }} onCancel={function () { setReplace(false); }} replace bare />
                                    : <button type="button" className="text-sm font-semibold text-stone-600 dark:text-stone-300 hover:text-indigo-700" onClick={function () { setReplace(true); }}>⇄ Tüm soruları yeni dosyayla değiştir…</button>}
                            </div>
                        ) : null}
                    </Box>
                ) : canEdit ? <Upload exam={exam} onDone={load} /> : null}

                {mon && mon.paper && mon.paper.length && (exam.status === "scheduled" || exam.status === "finished") ? (
                    <PaperBox rows={mon.paper} examId={id} finalized={!!exam.finalized_at} onDone={load} />
                ) : null}

                {exam.status === "scheduled" ? (
                    <Box title={live ? <span className="inline-flex items-center gap-2">Canlı izleme <Pill tone="rose" dot pulse>canlı</Pill></span> : "Durum"} sub={"15 sn'de bir yenilenir · son güncelleme " + (loadedAt ? L.fmtClock(loadedAt) : "–") + (live ? "" : " · sınav başlayınca giriş ve teslimler burada akar")}>
                        {mon ? (
                            <div className="grid grid-cols-2 gap-x-3 gap-y-4 lg:grid-cols-[2fr_4fr_2fr] lg:gap-4">
                                {[["Kayıt", [["Kayıtlı", mon.registered], ["Yedek", mon.waitlist]]],
                                  ["Sınav", [["Giren", mon.entered], ["Aktif", mon.active], ["Teslim", mon.submitted], ["Kilitli", mon.locked, true]]],
                                  ["Kâğıt", [["Kâğıtta", mon.paper_entered || 0], ["Optik gelen", mon.paper_submitted || 0]]]].map(function (g) {
                                    return (
                                        <div key={g[0]} className={g[1].length === 4 ? "col-span-2 order-last lg:order-none lg:col-span-1" : ""}>
                                            <p className="text-[11px] uppercase tracking-wider font-semibold text-stone-500 mb-2">{g[0]}</p>
                                            <div className={"grid gap-2 " + (g[1].length === 4 ? "grid-cols-4" : "grid-cols-2")}>
                                                {g[1].map(function (x) { return <Stat key={x[0]} label={x[0]} value={x[1]} alert={x[2]} />; })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : <p className="text-sm text-stone-500">Yükleniyor…</p>}
                        {mon && mon.registered ? (
                            <div className="mt-4 grid sm:grid-cols-2 gap-4 text-sm">
                                <div><p className="flex justify-between"><span>Katılım</span><b className="tabular-nums">{mon.entered || 0} / {mon.registered}</b></p><div className="mt-1.5"><Meter value={mon.entered || 0} max={mon.registered} /></div></div>
                                <div><p className="flex justify-between"><span>Teslim</span><b className="tabular-nums">{mon.submitted || 0} / {mon.entered || 0}</b></p><div className="mt-1.5"><Meter value={mon.submitted || 0} max={mon.entered || 0} done /></div></div>
                            </div>
                        ) : null}
                        {mon && mon.avg_answered != null ? <p className="text-xs text-stone-500 mt-3">Ortalama işaretlenen: {mon.avg_answered} / 120</p> : null}
                        {lockedRegs.length ? (
                            <div className="mt-4 rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50/70 dark:bg-rose-950/30 p-3">
                                <p className="text-sm font-semibold text-rose-700 dark:text-rose-300">Kilitlenen öğrenciler (3. cihaz değişimi)</p>
                                {lockedRegs.map(function (r) {
                                    return <div key={r.user_id} className="flex items-center gap-2 text-sm mt-2">{r.nickname} · {r.switches} değişim <Btn small onClick={function () { run("live_admin_unlock", { p_exam: id, p_user: r.user_id }, r.nickname + " için kilit açılsın mı?"); }}>Kilidi aç</Btn></div>;
                                })}
                            </div>
                        ) : null}
                        {mon && mon.events && mon.events.length ? (
                            <details className="mt-4"><summary className="text-sm font-semibold cursor-pointer">Olay akışı ({mon.events.length})</summary>
                                <ol className="mt-2 max-h-56 overflow-auto border-l-2 border-stone-200 dark:border-stone-700 ml-1.5 space-y-1.5">
                                    {mon.events.map(function (ev, i) {
                                        return <li key={i} className="text-xs pl-3 relative"><span className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-stone-400"></span><b className="tabular-nums">{L.fmtClock(L.ms(ev.at))}</b> · {EVENT[ev.kind] || ev.kind} · {ev.nickname || ""} {ev.detail && ev.detail.switches ? "(" + ev.detail.switches + ")" : ""}{ev.detail && ev.detail.code ? " (" + ev.detail.code + ")" : ""}</li>;
                                    })}
                                </ol>
                            </details>
                        ) : null}
                    </Box>
                ) : null}

                <Box title={"Kayıtlar (" + regs.length + ")"}
                    actions={regs.length ? [
                        <input key="f" className="px-3 py-1.5 rounded-xl border text-sm w-full sm:w-44 flex-1 sm:flex-none" placeholder="Öğrenci ara" aria-label="Kayıtlarda ara" value={find} onChange={function (e) { setFind(e.target.value); }} />,
                        <Btn key="c" small onClick={exportCsv}>CSV indir</Btn>] : null}>
                    {!regs.length ? <p className="text-sm text-stone-500">Henüz kayıt yok. Deneme yayınlanınca öğrenciler Bugün ekranındaki karttan kaydolur.</p> : (
                        <div>
                        <ul className="sm:hidden divide-y divide-stone-100 dark:divide-stone-800 -mx-1">
                            {regRows.map(function (r) {
                                var st = REG[r.status] || [r.status, "stone"];
                                return (
                                    <li key={r.user_id} className="py-3 px-1 flex items-center gap-3">
                                        <span className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200 grid place-items-center text-xs font-black shrink-0" aria-hidden="true">{initials(r.nickname)}</span>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold truncate">{r.nickname}</p>
                                            <p className="text-xs text-stone-500 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                                                <Pill tone={st[1]}>{st[0]}</Pill>{r.locked ? <Pill tone="rose">Kilitli</Pill> : null}
                                                {r.entered ? <span>{r.mode === "paper" ? "🖨 Kâğıt" : "📱 Cihaz"}{r.switches ? " · " + r.switches + " değişim" : ""}</span> : null}
                                                {r.answered ? <span>{r.answered} cevap</span> : null}
                                                {r.net != null ? <span className="font-semibold text-stone-700 dark:text-stone-200">{L.fmtNet(r.net)} net</span> : null}
                                            </p>
                                        </div>
                                        {canEdit ? (r.status === "blocked"
                                            ? <Btn small onClick={function () { run("live_admin_set_registration", { p_exam: id, p_user: r.user_id, p_status: "registered" }); }}>Engeli kaldır</Btn>
                                            : <Btn small dangerGhost onClick={function () { run("live_admin_set_registration", { p_exam: id, p_user: r.user_id, p_status: "blocked" }, r.nickname + " engellensin mi?"); }}>Engelle</Btn>) : null}
                                    </li>
                                );
                            })}
                            {!regRows.length ? <li className="py-4 text-sm text-stone-500">"{find}" ile eşleşen öğrenci yok.</li> : null}
                        </ul>
                        <div className="hidden sm:block max-h-[28rem] overflow-auto -mx-2">
                            <table className="w-full text-sm">
                                <thead className="sticky top-0 bg-white/95 dark:bg-stone-900/95 backdrop-blur">
                                    <tr className="text-left text-[11px] uppercase tracking-wider text-stone-500">
                                        <th className="py-2 px-2 font-semibold">Öğrenci</th><th className="px-2 font-semibold">Durum</th><th className="px-2 font-semibold">Biçim</th>
                                        <th className="px-2 font-semibold">Girdi</th><th className="px-2 font-semibold text-right">Cevap</th><th className="px-2 font-semibold text-right">Net</th><th className="px-2"><span className="sr-only">İşlem</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {regRows.map(function (r) {
                                        var st = REG[r.status] || [r.status, "stone"];
                                        return (
                                            <tr key={r.user_id} className="border-t border-stone-100 dark:border-stone-800 hover:bg-stone-50/80 dark:hover:bg-stone-800/40">
                                                <td className="py-2 px-2">
                                                    <span className="flex items-center gap-2.5">
                                                        <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200 grid place-items-center text-xs font-black shrink-0" aria-hidden="true">{initials(r.nickname)}</span>
                                                        <span className="font-semibold">{r.nickname}</span>
                                                    </span>
                                                </td>
                                                <td className="px-2"><Pill tone={st[1]}>{st[0]}</Pill>{r.locked ? <span className="ml-1"><Pill tone="rose">Kilitli</Pill></span> : null}</td>
                                                <td className="px-2 text-stone-600 dark:text-stone-300">{r.entered ? (r.mode === "paper" ? "🖨 Kâğıt" : "📱 Cihaz") : <span className="text-stone-300 dark:text-stone-600">–</span>}</td>
                                                <td className="px-2">{r.entered ? "✓" + (r.switches ? " · " + r.switches + " değişim" : "") : <span className="text-stone-300 dark:text-stone-600">–</span>}</td>
                                                <td className="px-2 text-right tabular-nums">{r.answered || <span className="text-stone-300 dark:text-stone-600">–</span>}</td>
                                                <td className="px-2 text-right tabular-nums font-semibold">{r.net != null ? L.fmtNet(r.net) : <span className="text-stone-300 dark:text-stone-600 font-normal">–</span>}</td>
                                                <td className="px-2 text-right">{canEdit ? (r.status === "blocked"
                                                    ? <Btn small onClick={function () { run("live_admin_set_registration", { p_exam: id, p_user: r.user_id, p_status: "registered" }); }}>Engeli kaldır</Btn>
                                                    : <Btn small dangerGhost onClick={function () { run("live_admin_set_registration", { p_exam: id, p_user: r.user_id, p_status: "blocked" }, r.nickname + " engellensin mi?"); }}>Engelle</Btn>) : null}</td>
                                            </tr>
                                        );
                                    })}
                                    {!regRows.length ? <tr><td colSpan={7} className="py-4 px-2 text-sm text-stone-500">"{find}" ile eşleşen öğrenci yok.</td></tr> : null}
                                </tbody>
                            </table>
                        </div>
                        </div>
                    )}
                </Box>

                {stats ? (
                    <Box title="Soru istatistikleri" sub={stats.cohort ? stats.cohort.participants + " katılımcı · ortalama net " + L.fmtNet(stats.cohort.avg_net) + " (GY " + L.fmtNet(stats.cohort.avg_gy) + ", GK " + L.fmtNet(stats.cohort.avg_gk) + ")" : null}>
                        <div className="max-h-[32rem] overflow-auto -mx-2">
                            <table className="w-full text-xs">
                                <thead className="sticky top-0 bg-white/95 dark:bg-stone-900/95">
                                    <tr className="text-left text-stone-500 uppercase tracking-wider"><th className="py-2 px-2">No</th><th className="px-2">Ders / konu</th><th className="px-2 w-36">Doğru</th>{L.LETTERS.map(function (l) { return <th key={l} className="px-1 text-right">{l}</th>; })}<th className="px-2 text-right">Boş</th><th className="px-2 text-right">Ort. sn</th></tr>
                                </thead>
                                <tbody>
                                    {stats.questions.map(function (q) {
                                        var tot = (q.correct || 0) + (q.wrong || 0) + (q.blank || 0), pct = tot ? Math.round(100 * q.correct / tot) : null;
                                        return (
                                            <tr key={q.no} className="border-t border-stone-100 dark:border-stone-800">
                                                <td className="py-1.5 px-2 font-bold">{q.no}</td><td className="px-2">{q.ders} / {window.konuLabel ? window.konuLabel(q.konu) : q.konu}</td>
                                                <td className="px-2">{pct == null ? "–" : <span className="flex items-center gap-2"><span className="flex-1"><Meter value={pct} max={100} /></span><span className="tabular-nums w-9 text-right">{pct}%</span></span>}</td>
                                                {L.LETTERS.map(function (l) { var n = (q.choices || {})[l] || 0; return <td key={l} className={"px-1 text-right tabular-nums " + (l === q.answer ? "font-bold text-emerald-700 dark:text-emerald-300" : "")}>{n}</td>; })}
                                                <td className="px-2 text-right tabular-nums">{q.blank || 0}</td><td className="px-2 text-right tabular-nums">{q.avg_ms ? Math.round(q.avg_ms / 1000) : ""}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Box>
                ) : null}

                {exam.status === "scheduled" ? (
                    <section className="rounded-3xl border-2 border-rose-200 dark:border-rose-900/70 bg-rose-50/40 dark:bg-rose-950/10 p-5 sm:p-6" aria-labelledby="danger-title">
                        <h2 id="danger-title" className="font-bold text-lg text-rose-700 dark:text-rose-300">Acil durum</h2>
                        <p className="text-sm text-stone-600 dark:text-stone-300 mt-0.5">Sadece sınav sırasında bir sorun çıkarsa kullan; iki işlem de tüm katılımcıları etkiler.</p>
                        <div className="mt-4 divide-y divide-rose-100 dark:divide-rose-900/50">
                            <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
                                <div className="min-w-0">
                                    <p className="font-semibold">Süreyi uzat</p>
                                    <p className="text-xs text-stone-500">Bitiş, geç senkron ve sıralama saatleri birlikte kayar.</p>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    {["5", "10", "15"].map(function (m) {
                                        return <button key={m} type="button" aria-pressed={mins === m} onClick={function () { setMins(m); }}
                                            className={"px-2.5 py-1.5 rounded-lg text-xs font-semibold border " + (mins === m ? "bg-stone-900 text-white border-stone-900 dark:bg-white dark:text-stone-900" : "border-stone-300 dark:border-stone-600")}>{m} dk</button>;
                                    })}
                                    <label className="flex items-center gap-1 text-sm">
                                        <input type="number" min="1" max="120" value={mins} onChange={function (e) { setMins(e.target.value); }} className="w-16 px-2 py-1.5 rounded-lg border text-center" aria-label="Uzatma dakikası" />dk
                                    </label>
                                    <Btn onClick={function () { run("live_admin_extend", { p_exam: id, p_minutes: Number(mins) }, "Sınav süresi herkes için " + mins + " dakika uzatılsın mı? Bitiş, geç senkron ve sıralama saatleri birlikte kayar."); }}>Süreyi uzat</Btn>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
                                <div className="min-w-0">
                                    <p className="font-semibold">Denemeyi iptal et</p>
                                    <p className="text-xs text-stone-500">Geri alınamaz; neden öğrencilere gösterilir, sonuç üretilmez.</p>
                                </div>
                                <Btn danger onClick={function () {
                                    var reason = window.prompt("İptal nedeni (öğrencilere gösterilir):");
                                    if (!reason) return;
                                    if (window.prompt("Onay için İPTAL yaz:") !== "İPTAL") return;
                                    run("live_admin_cancel", { p_exam: id, p_reason: reason });
                                }}>Denemeyi iptal et</Btn>
                            </div>
                        </div>
                    </section>
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

    // Sınav günü zaman çizelgesi: kayıt kapanışı → başlangıç → bitiş → sıralama
    function Timeline(props) {
        var e = props.exam, now = props.now;
        var steps = [["Kayıt kapanır", e.reg_closes_at], ["Sınav başlar", e.starts_at], ["Sınav biter", e.ends_at], ["Sıralama", e.ranking_at]];
        var off = e.status === "draft" || e.status === "cancelled";
        var cur = -1;
        steps.forEach(function (s, i) { if (now >= L.ms(s[1])) cur = i; });
        return (
            <ol className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 mt-6" aria-label="Sınav günü takvimi">
                {steps.map(function (s, i) {
                    var done = !off && i <= cur, next = !off && i === cur + 1;
                    return (
                        <li key={s[0]} className="relative pr-3" aria-current={next ? "step" : undefined}>
                            <div className="flex items-center">
                                <span className={"relative z-10 w-3.5 h-3.5 rounded-full border-2 shrink-0 " + (done ? "bg-indigo-600 border-indigo-600" : next ? "bg-white dark:bg-stone-900 border-indigo-600 ring-4 ring-indigo-100 dark:ring-indigo-950" : "bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-600")}></span>
                                {i < steps.length - 1 ? <span className={"hidden sm:block h-0.5 flex-1 ml-2 rounded " + (!off && i < cur ? "bg-indigo-600" : "bg-stone-200 dark:bg-stone-700")}></span> : null}
                            </div>
                            <p className={"text-xs mt-2 font-semibold " + (next ? "text-indigo-700 dark:text-indigo-300" : "text-stone-500")}>{s[0]}{done ? " ✓" : ""}</p>
                            <p className="text-sm font-bold tabular-nums">{L.fmtClock(L.ms(s[1]))}{i === 2 && e.extra_minutes ? <span className="text-xs font-semibold text-amber-700 dark:text-amber-300"> +{e.extra_minutes} dk</span> : null}</p>
                        </li>
                    );
                })}
            </ol>
        );
    }

    function ExamCard(props) {
        var e = props.exam, ph = phaseOf(e, props.now), ready = e.questions === 120 && e.has_booklet;
        return (
            <li>
                <button type="button" onClick={props.onOpen}
                    className="group w-full h-full text-left rounded-3xl border border-stone-200 dark:border-stone-700 bg-white/80 dark:bg-stone-900/60 p-4 sm:p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-indigo-300 dark:hover:border-indigo-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                    <div className="flex gap-4">
                        <DateTile at={e.starts_at} />
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                                <Pill tone={ph.tone} dot pulse={ph.live}>{ph.label}</Pill>
                                <TrackPill track={e.track} />
                            </div>
                            <h3 className="font-black text-lg leading-snug mt-1.5 truncate">{e.title}</h3>
                            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{ph.text}</p>
                        </div>
                        <span className="self-center text-stone-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition text-xl" aria-hidden="true">→</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-stone-100 dark:border-stone-800">
                        <div>
                            <p className="text-[11px] uppercase tracking-wide font-semibold text-stone-500">Soru</p>
                            <p className="font-black tabular-nums">{e.questions}<span className="text-stone-400 font-semibold">/120</span></p>
                            <div className="mt-1"><Meter value={e.questions} max={120} done={e.questions === 120} /></div>
                        </div>
                        <div>
                            <p className="text-[11px] uppercase tracking-wide font-semibold text-stone-500">Kayıt</p>
                            <p className="font-black tabular-nums">{e.registered}{e.capacity ? <span className="text-stone-400 font-semibold">/{e.capacity}</span> : null}</p>
                            {e.waitlist ? <p className="text-[11px] text-amber-700 dark:text-amber-300">+{e.waitlist} yedek</p> : null}
                        </div>
                        <div>
                            <p className="text-[11px] uppercase tracking-wide font-semibold text-stone-500">{e.participants ? "Ort. net" : "Kitapçık"}</p>
                            <p className="font-black">{e.participants ? L.fmtNet(e.avg_net) : e.has_booklet ? <span className="text-emerald-700 dark:text-emerald-300">Şifreli ✓</span> : <span className="text-stone-400">Yok</span>}</p>
                        </div>
                    </div>
                    {e.status === "draft" ? (
                        <p className="mt-3 text-xs flex flex-wrap gap-x-3 gap-y-1 text-stone-600 dark:text-stone-300">
                            <span>{e.questions === 120 ? "✓" : "○"} 120 soru</span>
                            <span>{e.has_booklet ? "✓" : "○"} Kitapçık</span>
                            <span className={ready ? "font-semibold text-indigo-700 dark:text-indigo-300" : ""}>{ready ? "→ Yayınlanabilir" : "○ Yayın"}</span>
                        </p>
                    ) : null}
                </button>
            </li>
        );
    }

    function LiveExamAdmin() {
        const [list, setList] = useState(null);
        const [err, setErr] = useState("");
        const [mode, setMode] = useState("list");
        const [sel, setSel] = useState(null);
        const [track, setTrack] = useState("");
        const [newTrack, setNewTrack] = useState("");
        var now = useNow(30000);
        function load() { C.rpc("live_admin_list").then(setList).catch(function (x) { setErr(x.message); }); }
        useEffect(load, []);
        if (mode === "detail" && sel) return <Detail id={sel} onBack={function () { setMode("list"); load(); }} />;
        if (mode === "trends") return <Trends track={track || "lisans"} onBack={function () { setMode("list"); }} />;
        var all = list || [];
        var shown = all.filter(function (e) { return !track || e.track === track; });
        var nLive = all.filter(function (e) { var p = phaseOf(e, now); return p.key === "live"; }).length;
        var upcoming = all.filter(function (e) { return e.status === "scheduled" && L.ms(e.ends_at) > now; })
            .sort(function (a, b) { return L.ms(a.starts_at) - L.ms(b.starts_at); })[0];
        function create(tk) { setNewTrack(tk); setMode("create"); }
        return (
            <div className="space-y-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black gradient-text">🕒 Canlı Deneme</h1>
                        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                            {list ? all.length + " deneme" + (nLive ? " · " + nLive + " tanesi şu an canlı" : upcoming ? " · sıradaki: " + L.fmtDay(L.ms(upcoming.starts_at), true) + " " + L.fmtClock(L.ms(upcoming.starts_at)) + " (" + L.TRACKS[upcoming.track] + ")" : "") : "Yükleniyor…"}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Btn onClick={function () { setMode("trends"); }}>📊 Denemeleri karşılaştır</Btn>
                        <Btn primary onClick={function () { create(track || "lisans"); }}>Yeni deneme</Btn>
                    </div>
                </div>
                {err ? <p className="text-sm text-rose-600" role="alert">{err} (supabase/patch-live-exam.sql çalıştırıldı mı?)</p> : null}
                <div className="inline-flex flex-wrap gap-1 p-1 rounded-2xl bg-stone-100 dark:bg-stone-800/70" role="group" aria-label="Kulvar filtresi">
                    {[["", "Tümü"]].concat(Object.keys(L.TRACKS).map(function (k) { return [k, L.TRACKS[k]]; })).map(function (t) {
                        var n = all.filter(function (e) { return !t[0] || e.track === t[0]; }).length, on = track === t[0];
                        return (
                            <button key={t[0]} type="button" aria-pressed={on} onClick={function () { setTrack(t[0]); }}
                                className={"px-4 py-2 rounded-xl text-sm font-semibold inline-flex items-center gap-2 transition " + (on ? "bg-white dark:bg-stone-900 shadow-sm text-indigo-700 dark:text-indigo-300" : "text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white")}>
                                {t[1]}<span aria-hidden="true" className={"text-[11px] px-1.5 py-0.5 rounded-md tabular-nums " + (on ? "bg-indigo-50 dark:bg-indigo-950" : "bg-stone-200/80 dark:bg-stone-700")}>{n}</span>
                            </button>
                        );
                    })}
                </div>
                {mode === "create" ? <CreateForm track={newTrack || track || "lisans"} onCancel={function () { setMode("list"); }} onCreated={function (id) { setSel(id); setMode("detail"); }} /> : null}
                {!list ? <p className="text-sm text-stone-500">Yükleniyor…</p> : (track ? [track] : Object.keys(L.TRACKS)).map(function (tk) {
                    var items = shown.filter(function (e) { return e.track === tk; });
                    return (
                        <section key={tk} aria-labelledby={"trk-" + tk}>
                            <div className="flex items-center gap-3 mb-3">
                                <h2 id={"trk-" + tk} className="text-sm font-black uppercase tracking-wider text-stone-500">{L.TRACKS[tk]} ({items.length})</h2>
                                <span className="h-px flex-1 bg-stone-200 dark:bg-stone-700"></span>
                            </div>
                            {items.length ? (
                                <ul className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                                    {items.map(function (e) {
                                        return <ExamCard key={e.id} exam={e} now={now} onOpen={function () { setSel(e.id); setMode("detail"); }} />;
                                    })}
                                </ul>
                            ) : (
                                <div className="rounded-3xl border-2 border-dashed border-stone-200 dark:border-stone-700 p-6 text-center">
                                    <p className="text-sm text-stone-500">{L.TRACKS[tk]} kulvarında henüz deneme yok.</p>
                                    <div className="mt-3"><Btn small onClick={function () { create(tk); }}>+ {L.TRACKS[tk]} denemesi oluştur</Btn></div>
                                </div>
                            )}
                        </section>
                    );
                })}
                <p className="text-xs text-stone-500">Yayınlanmış, bitmiş ve arşivdeki denemeler silinemez (veritabanı da silmeyi reddeder). Yalnızca taslak kaldırılabilir.</p>
            </div>
        );
    }

    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.LiveExamAdmin = LiveExamAdmin;
})();
