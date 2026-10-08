/*jsx:babel-7.29.9-react-classic:57068:fueigp*/
(function () {
  const {
    useState,
    useEffect
  } = React;
  var L = window.LiveExam;
  var C = window.LiveClient;

  // ============================================================
  // Yönetim: canlı deneme oluşturma, soru yükleme, kayıtlar, canlı izleme, acil durum, istatistik
  // Sunucu: supabase/patch-live-exam.sql (live_admin_* fonksiyonları). Yayınlanmış deneme silinemez.
  // ============================================================

  var STATUS = {
    draft: "Taslak",
    scheduled: "Planlı",
    finished: "Bitti",
    cancelled: "İptal",
    archived: "Arşiv"
  };
  function dt(iso) {
    return iso ? L.fmtDay(L.ms(iso), true) + " " + L.fmtClock(L.ms(iso)) : "–";
  }
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
      r.onload = function () {
        resolve(r.result);
      };
      r.onerror = function () {
        reject(r.error);
      };
      if (asDataUrl) r.readAsDataURL(f);else r.readAsText(f, "utf-8");
    });
  }
  function Box(props) {
    return /*#__PURE__*/React.createElement("section", {
      className: "rounded-2xl glass p-5 " + (props.className || "")
    }, /*#__PURE__*/React.createElement("h2", {
      className: "font-bold mb-3"
    }, props.title), props.children);
  }
  function Btn(props) {
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      disabled: props.disabled,
      onClick: props.onClick,
      className: "px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-40 " + (props.danger ? "bg-rose-600 text-white" : props.primary ? "bg-indigo-600 text-white" : "border border-stone-300 dark:border-stone-600")
    }, props.children);
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
      setBusy(true);
      setErr("");
      C.rpc("live_admin_save_exam", {
        p: {
          title: title,
          day: day,
          track: track,
          capacity: cap ? Number(cap) : ""
        }
      }).then(function (e) {
        setBusy(false);
        props.onCreated(e.id);
      }).catch(function (x) {
        setBusy(false);
        setErr(x.message);
      });
    }
    return /*#__PURE__*/React.createElement(Box, {
      title: "Yeni canl\u0131 deneme"
    }, /*#__PURE__*/React.createElement("div", {
      className: "grid sm:grid-cols-4 gap-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "text-sm"
    }, "Kulvar", /*#__PURE__*/React.createElement("select", {
      className: "mt-1 w-full px-3 py-2 rounded-xl border",
      value: track,
      onChange: function (e) {
        setTrack(e.target.value);
      }
    }, Object.keys(L.TRACKS).map(function (k) {
      return /*#__PURE__*/React.createElement("option", {
        key: k,
        value: k
      }, L.TRACKS[k]);
    }))), /*#__PURE__*/React.createElement("label", {
      className: "text-sm"
    }, "Ba\u015Fl\u0131k", /*#__PURE__*/React.createElement("input", {
      className: "mt-1 w-full px-3 py-2 rounded-xl border",
      value: title,
      onChange: function (e) {
        setTitle(e.target.value);
      }
    })), /*#__PURE__*/React.createElement("label", {
      className: "text-sm"
    }, "S\u0131nav g\xFCn\xFC", /*#__PURE__*/React.createElement("input", {
      type: "date",
      className: "mt-1 w-full px-3 py-2 rounded-xl border",
      value: day,
      onChange: function (e) {
        setDay(e.target.value);
      }
    })), /*#__PURE__*/React.createElement("label", {
      className: "text-sm"
    }, "Kontenjan (bo\u015F = s\u0131n\u0131rs\u0131z)", /*#__PURE__*/React.createElement("input", {
      type: "number",
      min: "1",
      className: "mt-1 w-full px-3 py-2 rounded-xl border",
      value: cap,
      onChange: function (e) {
        setCap(e.target.value);
      }
    }))), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-stone-500 mt-2"
    }, "Saatler (\u0130stanbul): kay\u0131t 10:00'da kapan\u0131r \xB7 10:15 ba\u015Flar \xB7 giri\u015F 10:45'te kapan\u0131r \xB7 12:25 biter \xB7 12:27 ge\xE7 senkron \xB7 12:40 s\u0131ralama."), notSunday ? /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-amber-700 mt-1"
    }, "Uyar\u0131: se\xE7ti\u011Fin g\xFCn pazar de\u011Fil.") : null, err ? /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-rose-600 mt-2"
    }, err) : null, /*#__PURE__*/React.createElement("div", {
      className: "flex gap-2 mt-3"
    }, /*#__PURE__*/React.createElement(Btn, {
      primary: true,
      disabled: busy || !day,
      onClick: save
    }, "Taslak olu\u015Ftur"), /*#__PURE__*/React.createElement(Btn, {
      onClick: props.onCancel
    }, "Vazge\xE7")));
  }

  // Soruları kaydet ve kitapçığı (görseller gömülü) yeniden şifreleyip yükle. qs: doğrulanmış sorular,
  // imgs: { dosyaAdı: dataURL }. Kayıt kapanana (10:00) kadar çalışır; sunucu sonrasını reddeder.
  function saveQuestions(exam, qs, imgs, step) {
    step("Sorular kaydediliyor…");
    return C.rpc("live_admin_set_questions", {
      p_exam: exam.id,
      p_questions: qs
    }).then(function (r) {
      if (r && r.ok === false) throw new Error((r.errors || []).join(" "));
      step("Kitapçık şifreleniyor…");
      var used = {};
      qs.forEach(function (q) {
        if (q.image && imgs[q.image]) used[q.image] = imgs[q.image];
      });
      var enc = L.encryptBooklet(L.bookletText({
        title: exam.title,
        track: exam.track
      }, qs, used));
      var path = "booklets/" + exam.id + ".bin";
      step("Şifreli kitapçık yükleniyor (" + Math.round(enc.bytes.length / 1024) + " KB)…");
      return C.sb().storage.from("live-exam").upload(path, new Blob([enc.bytes], {
        type: "application/octet-stream"
      }), {
        upsert: true,
        contentType: "application/octet-stream"
      }).then(function (r2) {
        if (r2.error) throw new Error("Storage: " + r2.error.message);
        return C.rpc("live_admin_set_booklet", {
          p_exam: exam.id,
          p_path: path,
          p_key: enc.keyHex,
          p_sha: enc.sha
        });
      });
    });
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
      Object.keys(f).forEach(function (k) {
        imgs[k] = true;
      });
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
        try {
          d = JSON.parse(txt);
        } catch (x) {
          setCheck({
            ok: false,
            errors: ["JSON okunamadı: " + x.message],
            warnings: []
          });
          return;
        }
        setDoc(d);
        validate(d, files);
      });
    }
    function onImgs(e) {
      var map = Object.assign({}, files);
      Array.prototype.forEach.call(e.target.files || [], function (f) {
        map[f.name] = f;
      });
      setFiles(map);
      validate(doc, map);
    }
    function upload() {
      if (!check || !check.ok) return;
      setErr("");
      setBusy("Sorular kaydediliyor…");
      var qs = check.questions;
      var title = doc && doc.baslik && doc.baslik !== exam.title ? doc.baslik : null;
      (title ? C.rpc("live_admin_save_exam", {
        p: {
          id: exam.id,
          title: title
        }
      }).then(function () {
        exam = Object.assign({}, exam, {
          title: title
        });
      }) : Promise.resolve()).then(function () {
        setBusy("Görseller hazırlanıyor…");
        var names = Object.keys(files).filter(function (n) {
          return qs.some(function (q) {
            return q.image === n;
          });
        });
        return Promise.all(names.map(function (n) {
          return readFile(files[n], true).then(function (u) {
            return [n, u];
          });
        }));
      }).then(function (pairs) {
        var imgs = {};
        pairs.forEach(function (p) {
          imgs[p[0]] = p[1];
        });
        return saveQuestions(exam, qs, imgs, setBusy);
      }).then(function () {
        setBusy("");
        props.onDone();
      }).catch(function (x) {
        setBusy("");
        setErr(x.message);
      });
    }
    var nImg = Object.keys(files).length;
    return /*#__PURE__*/React.createElement(Box, {
      title: props.replace ? "Tüm soruları yeni dosyayla değiştir" : "Soru dosyası ve görseller"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-stone-500 mb-3"
    }, "Bi\xE7im: docs/canli-deneme-ornek.json \xB7 G\xF6rselleri dosyadaki \"gorsel\" adlar\u0131yla se\xE7. Kitap\xE7\u0131k senin taray\u0131c\u0131nda \u015Fifrelenir; anahtar yaln\u0131zca 10:15'te s\u0131nava girene verilir."), /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap gap-4 text-sm"
    }, /*#__PURE__*/React.createElement("label", null, "Soru dosyas\u0131 (.json) ", /*#__PURE__*/React.createElement("input", {
      type: "file",
      accept: "application/json,.json",
      onChange: onJson,
      className: "block mt-1"
    })), /*#__PURE__*/React.createElement("label", null, "G\xF6rseller (", nImg, ") ", /*#__PURE__*/React.createElement("input", {
      type: "file",
      accept: "image/*",
      multiple: true,
      onChange: onImgs,
      className: "block mt-1"
    }))), check ? /*#__PURE__*/React.createElement("div", {
      className: "mt-3 text-sm"
    }, check.ok ? /*#__PURE__*/React.createElement("p", {
      className: "text-emerald-700 font-semibold"
    }, "\u2713 Ge\xE7erli: 120 soru, KPSS da\u011F\u0131l\u0131m\u0131na uygun, t\xFCm konular data.js'te var.") : /*#__PURE__*/React.createElement("p", {
      className: "text-rose-700 font-semibold"
    }, check.errors.length, " hata \u2014 y\xFCkleme reddedildi:"), /*#__PURE__*/React.createElement("ul", {
      className: "mt-1 max-h-64 overflow-auto space-y-0.5"
    }, check.errors.map(function (x, i) {
      return /*#__PURE__*/React.createElement("li", {
        key: "e" + i,
        className: "text-rose-700"
      }, "\u2022 ", x);
    }), check.warnings.map(function (x, i) {
      return /*#__PURE__*/React.createElement("li", {
        key: "w" + i,
        className: "text-amber-700"
      }, "\u2022 ", x);
    })), check.distribution ? /*#__PURE__*/React.createElement("details", {
      className: "mt-2",
      open: !check.ok
    }, /*#__PURE__*/React.createElement("summary", {
      className: "font-semibold cursor-pointer"
    }, "Soru da\u011F\u0131l\u0131m\u0131"), /*#__PURE__*/React.createElement("div", {
      className: "grid sm:grid-cols-2 gap-4 mt-2 items-start"
    }, /*#__PURE__*/React.createElement("table", {
      className: "text-sm"
    }, /*#__PURE__*/React.createElement("tbody", null, check.distribution.tests.map(function (t) {
      var ok = t.count === t.n;
      return /*#__PURE__*/React.createElement("tr", {
        key: t.key
      }, /*#__PURE__*/React.createElement("td", {
        className: "pr-3 py-0.5"
      }, t.label, /*#__PURE__*/React.createElement("span", {
        className: "block text-[11px] text-stone-500"
      }, t.from, "\u2013", t.to, ". sorular", t.parts ? " · " + t.parts.map(function (p) {
        return p.ders + " " + p.count;
      }).join(" + ") : "")), /*#__PURE__*/React.createElement("td", {
        className: "font-bold " + (ok ? "text-emerald-700" : "text-rose-700")
      }, ok ? "✓ " : "✗ ", t.count, " / ", t.n));
    }))), /*#__PURE__*/React.createElement("table", {
      className: "text-sm"
    }, /*#__PURE__*/React.createElement("tbody", null, check.distribution.groups.map(function (g) {
      return /*#__PURE__*/React.createElement("tr", {
        key: g.ders + g.ad
      }, /*#__PURE__*/React.createElement("td", {
        className: "pr-3 py-0.5"
      }, g.ders, " \xB7 ", g.ad, /*#__PURE__*/React.createElement("span", {
        className: "block text-[11px] text-stone-500"
      }, "🔥".repeat(g.w))), /*#__PURE__*/React.createElement("td", {
        className: "font-bold " + (g.count ? "" : g.w >= 4 ? "text-amber-700" : "text-stone-500")
      }, g.count, " soru"));
    }))))) : null) : null, err ? /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-rose-600 mt-2"
    }, err) : null, busy ? /*#__PURE__*/React.createElement("p", {
      className: "text-sm mt-2"
    }, busy) : null, /*#__PURE__*/React.createElement("div", {
      className: "mt-3"
    }, /*#__PURE__*/React.createElement(Btn, {
      primary: true,
      disabled: !check || !check.ok || !!busy,
      onClick: upload
    }, "Sorular\u0131 ve kitap\xE7\u0131\u011F\u0131 y\xFCkle")));
  }

  // ============================================================
  // SORU DÜZENLEYİCİ: yüklenen soruları gör, düzelt, görseli değiştir (kayıt kapanana kadar)
  // ============================================================
  var GY_DERS = ["Türkçe", "Matematik", "Geometri"],
    GK_DERS = ["Tarih", "Coğrafya", "Vatandaşlık", "Güncel Bilgiler"];
  function catalog() {
    return window.getKpssData ? window.getKpssData() : {};
  }
  function konuKeys(ders) {
    return Object.keys(catalog()[ders] || {}).filter(function (k) {
      return k !== "_";
    });
  }
  function kLabel(k) {
    return window.konuLabel ? window.konuLabel(k) : String(k).trim();
  }
  function toDoc(q) {
    return {
      no: q.no,
      bolum: q.bolum,
      ders: q.ders,
      konu: q.konu,
      metin: q.stem,
      siklar: (q.options || []).slice(),
      dogru: q.answer,
      cozum: q.explanation || "",
      gorsel: q.image || undefined
    };
  }
  function downloadText(name, text, type) {
    var url = URL.createObjectURL(new Blob([text], {
      type: type || "application/json"
    }));
    var a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 30000);
  }
  function QuestionEditor(props) {
    var exam = props.exam;
    const [data, setData] = useState(null);
    const [list, setList] = useState([]);
    const [imgs, setImgs] = useState({});
    const [dirty, setDirty] = useState({});
    const [open, setOpen] = useState(null);
    const [ders, setDers] = useState("");
    const [q, setQ] = useState("");
    const [busy, setBusy] = useState("");
    const [msg, setMsg] = useState("");
    const [err, setErr] = useState("");
    const [imgNote, setImgNote] = useState("");
    function load() {
      setErr("");
      return C.rpc("live_admin_questions", {
        p_exam: exam.id
      }).then(function (d) {
        setData(d);
        setList((d.questions || []).map(toDoc));
        setDirty({});
        if (!d.booklet) {
          setImgs({});
          return;
        }
        setImgNote("Görseller kitapçıktan açılıyor…");
        return C.sb().storage.from("live-exam").download(d.booklet.path).then(function (r) {
          if (r.error || !r.data) throw new Error("Kitapçık indirilemedi.");
          return r.data.arrayBuffer();
        }).then(function (buf) {
          return L.decryptBooklet(new Uint8Array(buf), d.booklet.key, d.booklet.sha);
        }).then(function (txt) {
          var bk = JSON.parse(txt),
            byNo = {},
            map = {};
          (bk.questions || []).forEach(function (x) {
            if (x.image) byNo[x.no] = x.image;
          });
          (d.questions || []).forEach(function (x) {
            if (x.image && byNo[x.no]) map[x.image] = byNo[x.no];
          });
          setImgs(map);
          setImgNote("");
        }).catch(function (x) {
          setImgNote("Görseller açılamadı: " + x.message + " (görselli soruları kaydetmeden önce görseli yeniden seç).");
        });
      }).catch(function (x) {
        setErr(x.message);
      });
    }
    useEffect(function () {
      load();
    }, [exam.id]);
    if (!data) return /*#__PURE__*/React.createElement(Box, {
      title: "Sorular"
    }, err || "Yükleniyor…");
    var editable = data.editable;
    var presence = {};
    Object.keys(imgs).forEach(function (k) {
      presence[k] = true;
    });
    var check = list.length ? L.validateUpload({
      kulvar: exam.track,
      baslik: exam.title,
      sorular: list
    }, catalog(), window.KONU_LABELS || {}, presence) : null;
    var nDirty = Object.keys(dirty).length;
    function patch(no, f) {
      setList(function (cur) {
        return cur.map(function (x) {
          return x.no === no ? Object.assign({}, x, f) : x;
        });
      });
      setDirty(function (d) {
        var e = Object.assign({}, d);
        e[no] = true;
        return e;
      });
      setMsg("");
    }
    function setOption(no, i, v) {
      var cur = list.filter(function (x) {
        return x.no === no;
      })[0];
      var s2 = cur.siklar.slice();
      s2[i] = v;
      patch(no, {
        siklar: s2
      });
    }
    function pickImage(no, file) {
      if (!file) return;
      if (file.size > 1024 * 1024) {
        setMsg("Görsel 1 MB'tan büyük; küçültüp yeniden seç (önerilen ~300 KB).");
        return;
      }
      var cur = list.filter(function (x) {
        return x.no === no;
      })[0];
      var ext = file.type === "image/jpeg" ? "jpg" : file.type === "image/webp" ? "webp" : file.type === "image/svg+xml" ? "svg" : "png";
      var name = cur.gorsel || "soru-" + no + "." + ext;
      readFile(file, true).then(function (url) {
        setImgs(function (m) {
          var n = Object.assign({}, m);
          n[name] = url;
          return n;
        });
        patch(no, {
          gorsel: name
        });
      });
    }
    function save() {
      if (!check || !check.ok) return;
      if (!window.confirm(nDirty + " soru değişti. Sorular kaydedilsin ve kitapçık yeniden şifrelensin mi?\n\nKayıt pazar " + L.fmtClock(L.ms(exam.reg_closes_at)) + "'da kapanınca sorular kilitlenir.")) return;
      setErr("");
      setMsg("");
      saveQuestions(exam, check.questions, imgs, setBusy).then(function () {
        setBusy("");
        setMsg("✓ Kaydedildi; kitapçık yeniden şifrelendi.");
        props.onSaved && props.onSaved();
        return load();
      }).catch(function (x) {
        setBusy("");
        setErr(x.message);
      });
    }
    function exportJson() {
      downloadText("deneme-" + exam.id.slice(0, 8) + ".json", JSON.stringify({
        kulvar: exam.track,
        baslik: exam.title,
        sorular: list
      }, null, 2));
    }
    var needle = q.trim().toLocaleLowerCase("tr");
    var shown = list.filter(function (x) {
      if (ders && x.ders !== ders) return false;
      if (!needle) return true;
      if (/^\d+$/.test(needle)) return String(x.no) === needle;
      return (x.metin + " " + x.konu + " " + x.siklar.join(" ")).toLocaleLowerCase("tr").indexOf(needle) >= 0;
    });
    var errNos = {};
    if (check) check.errors.forEach(function (e) {
      var m = /^Soru (\d+)/.exec(e);
      if (m) errNos[m[1]] = true;
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "space-y-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap items-center gap-3"
    }, /*#__PURE__*/React.createElement(Btn, {
      onClick: props.onBack
    }, "\u2190 Deneme"), /*#__PURE__*/React.createElement("h1", {
      className: "text-2xl font-black"
    }, "Sorular \xB7 ", exam.title), /*#__PURE__*/React.createElement("span", {
      className: "text-xs px-2 py-1 rounded-full border border-stone-300 dark:border-stone-600"
    }, L.TRACKS[exam.track])), /*#__PURE__*/React.createElement(Box, {
      title: editable ? "Düzenleme açık" : "Yalnızca görüntüleme"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-600 dark:text-stone-300"
    }, editable ? "Kayıt " + dt(exam.reg_closes_at) + "'da kapanana kadar soruları, şıkları, doğru cevabı, çözümü, konuyu ve görselleri değiştirebilirsin. Kaydedince kitapçık yeniden şifrelenir." : "Kayıt kapandığı için sorular kilitli (öğrencilerin kitapçığı indirildi). Görüntüleyebilir ve JSON olarak indirebilirsin."), /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap gap-2 mt-3"
    }, editable ? /*#__PURE__*/React.createElement(Btn, {
      primary: true,
      disabled: !nDirty || !check || !check.ok || !!busy,
      onClick: save
    }, busy || "Değişiklikleri kaydet" + (nDirty ? " (" + nDirty + ")" : "")) : null, editable && nDirty ? /*#__PURE__*/React.createElement(Btn, {
      disabled: !!busy,
      onClick: function () {
        if (window.confirm("Kaydedilmemiş değişiklikler silinsin mi?")) load();
      }
    }, "De\u011Fi\u015Fiklikleri geri al") : null, /*#__PURE__*/React.createElement(Btn, {
      onClick: exportJson
    }, "JSON indir")), msg ? /*#__PURE__*/React.createElement("p", {
      className: "text-sm mt-2",
      role: "status"
    }, msg) : null, err ? /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-rose-600 mt-2",
      role: "alert"
    }, err) : null, imgNote ? /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-amber-700 mt-2"
    }, imgNote) : null, check && !check.ok ? /*#__PURE__*/React.createElement("ul", {
      className: "mt-2 text-sm max-h-40 overflow-auto"
    }, check.errors.map(function (e, i) {
      return /*#__PURE__*/React.createElement("li", {
        key: i,
        className: "text-rose-700"
      }, "\u2022 ", e);
    })) : null), /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap items-center gap-2"
    }, [""].concat(GY_DERS, GK_DERS).map(function (d) {
      var n = d ? list.filter(function (x) {
        return x.ders === d;
      }).length : list.length;
      return /*#__PURE__*/React.createElement(Btn, {
        key: d || "all",
        primary: ders === d,
        onClick: function () {
          setDers(d);
        }
      }, (d || "Tümü") + " (" + n + ")");
    }), /*#__PURE__*/React.createElement("input", {
      className: "px-3 py-2 rounded-xl border text-sm min-w-[220px]",
      placeholder: "Soru no ya da metinde ara",
      value: q,
      onChange: function (e) {
        setQ(e.target.value);
      },
      "aria-label": "Sorularda ara"
    })), /*#__PURE__*/React.createElement("ul", {
      className: "space-y-2"
    }, shown.map(function (x) {
      var isOpen = open === x.no,
        img = x.gorsel ? imgs[x.gorsel] : null;
      return /*#__PURE__*/React.createElement("li", {
        key: x.no,
        className: "rounded-2xl border " + (errNos[x.no] ? "border-rose-400" : dirty[x.no] ? "border-indigo-400" : "border-stone-200 dark:border-stone-700") + " bg-white/70 dark:bg-stone-900/50"
      }, /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "w-full text-left p-3 flex items-start gap-3",
        "aria-expanded": isOpen,
        onClick: function () {
          setOpen(isOpen ? null : x.no);
        }
      }, /*#__PURE__*/React.createElement("span", {
        className: "font-black w-9 shrink-0"
      }, x.no), /*#__PURE__*/React.createElement("span", {
        className: "min-w-0 flex-1 text-sm"
      }, /*#__PURE__*/React.createElement("b", null, x.ders), " / ", kLabel(x.konu), x.gorsel ? " · 🖼" : "", dirty[x.no] ? " · ✎ değişti" : "", errNos[x.no] ? " · ⚠ hata" : "", /*#__PURE__*/React.createElement("span", {
        className: "block text-stone-600 dark:text-stone-300 truncate"
      }, x.metin)), /*#__PURE__*/React.createElement("span", {
        className: "text-xs font-bold shrink-0"
      }, "Do\u011Fru: ", x.dogru)), isOpen ? /*#__PURE__*/React.createElement("div", {
        className: "px-3 pb-4 space-y-3 text-sm"
      }, /*#__PURE__*/React.createElement("div", {
        className: "grid sm:grid-cols-2 gap-3"
      }, /*#__PURE__*/React.createElement("label", null, "Ders", /*#__PURE__*/React.createElement("select", {
        className: "mt-1 w-full px-3 py-2 rounded-xl border",
        disabled: !editable,
        value: x.ders,
        onChange: function (e) {
          var nd = e.target.value;
          patch(x.no, {
            ders: nd,
            konu: konuKeys(nd)[0] || ""
          });
        }
      }, (x.bolum === "GY" ? GY_DERS : GK_DERS).map(function (d) {
        return /*#__PURE__*/React.createElement("option", {
          key: d,
          value: d
        }, d);
      }))), /*#__PURE__*/React.createElement("label", null, "Konu", /*#__PURE__*/React.createElement("select", {
        className: "mt-1 w-full px-3 py-2 rounded-xl border",
        disabled: !editable,
        value: x.konu,
        onChange: function (e) {
          patch(x.no, {
            konu: e.target.value
          });
        }
      }, konuKeys(x.ders).indexOf(x.konu) < 0 ? /*#__PURE__*/React.createElement("option", {
        value: x.konu
      }, x.konu, " (data.js'te yok)") : null, konuKeys(x.ders).map(function (k) {
        return /*#__PURE__*/React.createElement("option", {
          key: k,
          value: k
        }, kLabel(k));
      })))), /*#__PURE__*/React.createElement("label", {
        className: "block"
      }, "Soru metni ", /*#__PURE__*/React.createElement("span", {
        className: "text-xs text-stone-500"
      }, "(\xF6nc\xFCller i\xE7in yeni sat\u0131r)"), /*#__PURE__*/React.createElement("textarea", {
        rows: 5,
        className: "mt-1 w-full p-2 rounded-xl border",
        disabled: !editable,
        value: x.metin,
        onChange: function (e) {
          patch(x.no, {
            metin: e.target.value
          });
        }
      })), /*#__PURE__*/React.createElement("fieldset", null, /*#__PURE__*/React.createElement("legend", {
        className: "mb-1"
      }, editable ? "Şıklar · doğru cevabı seç" : "Şıklar"), L.LETTERS.map(function (l, i) {
        return /*#__PURE__*/React.createElement("div", {
          key: l,
          className: "flex items-center gap-2 mt-1"
        }, /*#__PURE__*/React.createElement("label", {
          className: "flex items-center gap-1 font-bold w-12"
        }, /*#__PURE__*/React.createElement("input", {
          type: "radio",
          name: "dogru-" + x.no,
          disabled: !editable,
          checked: x.dogru === l,
          onChange: function () {
            patch(x.no, {
              dogru: l
            });
          },
          "aria-label": l + " doğru cevap"
        }), l), /*#__PURE__*/React.createElement("input", {
          className: "flex-1 px-3 py-1.5 rounded-lg border",
          disabled: !editable,
          value: x.siklar[i] || "",
          onChange: function (e) {
            setOption(x.no, i, e.target.value);
          },
          "aria-label": "Şık " + l
        }));
      })), /*#__PURE__*/React.createElement("label", {
        className: "block"
      }, "\xC7\xF6z\xFCm", /*#__PURE__*/React.createElement("textarea", {
        rows: 3,
        className: "mt-1 w-full p-2 rounded-xl border",
        disabled: !editable,
        value: x.cozum,
        onChange: function (e) {
          patch(x.no, {
            cozum: e.target.value
          });
        }
      })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, "G\xF6rsel", x.gorsel ? ": " + x.gorsel : " yok"), img ? /*#__PURE__*/React.createElement("img", {
        src: img,
        alt: "Soru " + x.no + " görseli",
        className: "mt-1 max-h-72 rounded-xl border bg-white"
      }) : null, x.gorsel && !img ? /*#__PURE__*/React.createElement("p", {
        className: "text-amber-700"
      }, "Bu g\xF6rsel elde yok; kaydetmeden \xF6nce yeniden se\xE7.") : null, editable ? /*#__PURE__*/React.createElement("div", {
        className: "flex flex-wrap items-center gap-2 mt-2"
      }, /*#__PURE__*/React.createElement("label", {
        className: "px-4 py-2 rounded-xl text-sm font-semibold border border-stone-300 dark:border-stone-600 cursor-pointer"
      }, x.gorsel ? "Görseli değiştir" : "Görsel ekle", /*#__PURE__*/React.createElement("input", {
        type: "file",
        accept: "image/png,image/jpeg,image/webp,image/svg+xml",
        className: "sr-only",
        onChange: function (e) {
          pickImage(x.no, e.target.files && e.target.files[0]);
          e.target.value = "";
        }
      })), x.gorsel ? /*#__PURE__*/React.createElement(Btn, {
        onClick: function () {
          patch(x.no, {
            gorsel: undefined
          });
        }
      }, "G\xF6rseli kald\u0131r") : null, img ? /*#__PURE__*/React.createElement("a", {
        className: "underline",
        href: img,
        download: x.gorsel
      }, "\u0130ndir") : null) : null)) : null);
    })));
  }

  // Kâğıtta çözenler: optik okutma durumu, okuma sorunları ve kayıtlı elle giriş
  var EVENT = {
    device_switch: "cihaz değişti",
    locked: "KİLİTLENDİ",
    admin_extend: "süre uzatıldı",
    admin_cancel: "iptal edildi",
    admin_unlock: "kilit açıldı",
    finalize: "kesinleşti",
    optic_fail: "optik okunamadı",
    optic_wrong_form: "başkasının formu",
    optic_submit: "optik gönderildi",
    admin_paper: "yönetici elle girdi"
  };
  var SRC = {
    optic: "kamera",
    manual: "elle (öğrenci)",
    admin: "elle (yönetici)"
  };
  function PaperBox(props) {
    var rows = props.rows || [];
    const [editing, setEditing] = useState(null);
    const [text, setText] = useState("");
    const [note, setNote] = useState("");
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState("");
    var parsed = L.parseAnswerText(text, 120);
    function save(r) {
      if (!window.confirm(r.nickname + " için " + parsed.count + " cevap kaydedilsin mi?\n\nBu işlem denetim kaydına yazılır" + (props.finalized ? " ve sıralama yeniden hesaplanır" : "") + ". Kaydedilen kâğıt bir daha değiştirilemez.")) return;
      setBusy(true);
      setMsg("");
      C.rpc("live_admin_paper", {
        p_exam: props.examId,
        p_user: r.user_id,
        p_answers: L.answerText(parsed.answers),
        p_note: note
      }).then(function (x) {
        setBusy(false);
        setEditing(null);
        setText("");
        setNote("");
        setMsg(r.nickname + ": kaydedildi" + (x && x.reranked ? ", sıralama yeniden hesaplandı." : "."));
        props.onDone();
      }).catch(function (x) {
        setBusy(false);
        setMsg(x.message);
      });
    }
    var trouble = rows.filter(function (r) {
      return !r.submitted && r.fails;
    }).length;
    return /*#__PURE__*/React.createElement(Box, {
      title: "Kâğıtta çözenler (" + rows.length + ")" + (trouble ? " · " + trouble + " kişi okutmada sorun yaşıyor" : "")
    }, msg ? /*#__PURE__*/React.createElement("p", {
      className: "text-sm mb-2",
      role: "status"
    }, msg) : null, /*#__PURE__*/React.createElement("div", {
      className: "overflow-x-auto"
    }, /*#__PURE__*/React.createElement("table", {
      className: "w-full text-sm"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
      className: "text-left text-xs text-stone-500"
    }, /*#__PURE__*/React.createElement("th", {
      className: "py-1 pr-3"
    }, "\xD6\u011Frenci"), /*#__PURE__*/React.createElement("th", {
      className: "pr-3"
    }, "Durum"), /*#__PURE__*/React.createElement("th", {
      className: "pr-3"
    }, "Okuma hatas\u0131"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, rows.map(function (r) {
      var st = r.submitted ? "✓ gönderdi · " + (SRC[r.source] || r.source || "") : r.close_reason === "no_optic" ? "okutmadı (süre doldu)" : "bekleniyor";
      return /*#__PURE__*/React.createElement("tr", {
        key: r.user_id,
        className: "border-t border-stone-200 dark:border-stone-700 " + (!r.submitted && r.fails ? "bg-amber-50 dark:bg-amber-900/20" : "")
      }, /*#__PURE__*/React.createElement("td", {
        className: "py-1.5 pr-3 font-semibold"
      }, r.nickname || r.user_id.slice(0, 8)), /*#__PURE__*/React.createElement("td", {
        className: "pr-3"
      }, st), /*#__PURE__*/React.createElement("td", {
        className: "pr-3"
      }, r.fails ? r.fails + " kez" + (r.last_fail && r.last_fail.code ? " (" + r.last_fail.code + ")" : "") : "–"), /*#__PURE__*/React.createElement("td", {
        className: "text-right"
      }, !r.submitted ? /*#__PURE__*/React.createElement(Btn, {
        onClick: function () {
          setEditing(r.user_id);
          setText("");
          setNote("");
        }
      }, "Elle gir") : null));
    })))), editing ? function () {
      var r = rows.filter(function (x) {
        return x.user_id === editing;
      })[0];
      if (!r) return null;
      return /*#__PURE__*/React.createElement("div", {
        className: "mt-3 p-3 rounded-xl border border-stone-300 dark:border-stone-600"
      }, /*#__PURE__*/React.createElement("p", {
        className: "text-sm font-semibold"
      }, r.nickname, " i\xE7in cevaplar (1\u2013120 s\u0131rayla, bo\u015F i\xE7in -)"), /*#__PURE__*/React.createElement("textarea", {
        rows: 4,
        className: "w-full mt-2 p-2 rounded-lg border font-mono text-sm uppercase tracking-widest",
        value: text,
        onChange: function (e) {
          setText(e.target.value);
        },
        "aria-label": "Cevaplar",
        spellCheck: "false"
      }), /*#__PURE__*/React.createElement("p", {
        className: "text-xs mt-1 " + (parsed.complete ? "text-emerald-700" : "text-rose-700")
      }, parsed.count, " / 120", parsed.bad.length ? " · geçersiz: " + parsed.bad.join(" ") : "", parsed.extra ? " · " + parsed.extra + " fazla" : ""), /*#__PURE__*/React.createElement("input", {
        className: "w-full mt-2 px-2 py-1.5 rounded-lg border text-sm",
        placeholder: "Neden? (\xF6r. kamera okumad\u0131, \xF6\u011Frencinin g\xF6nderdi\u011Fi foto\u011Fraftan girildi)",
        value: note,
        onChange: function (e) {
          setNote(e.target.value);
        },
        "aria-label": "D\xFCzeltme nedeni"
      }), /*#__PURE__*/React.createElement("div", {
        className: "flex gap-2 mt-2"
      }, /*#__PURE__*/React.createElement(Btn, {
        primary: true,
        disabled: busy || !parsed.complete || note.trim().length < 3,
        onClick: function () {
          save(r);
        }
      }, "Kaydet"), /*#__PURE__*/React.createElement(Btn, {
        onClick: function () {
          setEditing(null);
        }
      }, "Vazge\xE7")));
    }() : null);
  }
  function Detail(props) {
    var id = props.id;
    const [exam, setExam] = useState(null);
    const [regs, setRegs] = useState([]);
    const [mon, setMon] = useState(null);
    const [stats, setStats] = useState(null);
    const [err, setErr] = useState("");
    const [mins, setMins] = useState("10");
    const [editQs, setEditQs] = useState(false);
    function load() {
      return C.rpc("live_admin_list").then(function (list) {
        var e = (list || []).filter(function (x) {
          return x.id === id;
        })[0];
        setExam(e || null);
        if (!e) return;
        C.rpc("live_admin_registrations", {
          p_exam: id
        }).then(setRegs).catch(function () {});
        C.rpc("live_admin_monitor", {
          p_exam: id
        }).then(setMon).catch(function () {});
        if (e.finalized_at) C.rpc("live_admin_stats", {
          p_exam: id
        }).then(setStats).catch(function () {});
      }).catch(function (x) {
        setErr(x.message);
      });
    }
    useEffect(function () {
      load();
      var t = setInterval(load, 15000);
      return function () {
        clearInterval(t);
      };
    }, [id]);
    function run(name, args, confirmMsg) {
      if (confirmMsg && !window.confirm(confirmMsg)) return;
      setErr("");
      C.rpc(name, args).then(load).catch(function (x) {
        setErr(x.message);
      });
    }
    if (!exam) return /*#__PURE__*/React.createElement(Box, {
      title: "Deneme"
    }, err || "Yükleniyor…");
    if (editQs) return /*#__PURE__*/React.createElement(QuestionEditor, {
      exam: exam,
      onBack: function () {
        setEditQs(false);
        load();
      },
      onSaved: load
    });
    var live = exam.status === "scheduled" && Date.now() >= L.ms(exam.starts_at) - 3600000 && Date.now() < L.ms(exam.ends_at);
    var canEdit = (exam.status === "draft" || exam.status === "scheduled") && Date.now() < L.ms(exam.reg_closes_at);
    var lockedRegs = regs.filter(function (r) {
      return r.locked;
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "space-y-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap items-center gap-3"
    }, /*#__PURE__*/React.createElement(Btn, {
      onClick: props.onBack
    }, "\u2190 Liste"), /*#__PURE__*/React.createElement("h1", {
      className: "text-2xl font-black"
    }, exam.title), /*#__PURE__*/React.createElement("span", {
      className: "text-xs px-2 py-1 rounded-full bg-stone-200 dark:bg-stone-700"
    }, STATUS[exam.status]), /*#__PURE__*/React.createElement("span", {
      className: "text-xs px-2 py-1 rounded-full border border-stone-300 dark:border-stone-600"
    }, L.TRACKS[exam.track])), err ? /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-rose-600"
    }, err) : null, /*#__PURE__*/React.createElement(Box, {
      title: "Takvim"
    }, /*#__PURE__*/React.createElement("ul", {
      className: "text-sm space-y-0.5"
    }, /*#__PURE__*/React.createElement("li", null, "Kay\u0131t kapan\u0131\u015F: ", dt(exam.reg_closes_at)), /*#__PURE__*/React.createElement("li", null, "Ba\u015Flang\u0131\xE7: ", dt(exam.starts_at), " \xB7 biti\u015F: ", dt(exam.ends_at), exam.extra_minutes ? " (+" + exam.extra_minutes + " dk uzatıldı)" : ""), /*#__PURE__*/React.createElement("li", null, "S\u0131ralama: ", dt(exam.ranking_at)), /*#__PURE__*/React.createElement("li", null, "Soru: ", exam.questions, "/120 \xB7 kitap\xE7\u0131k: ", exam.has_booklet ? "yüklendi" : "yok", " \xB7 kontenjan: ", exam.capacity || "sınırsız")), /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap gap-2 mt-3"
    }, exam.status === "draft" ? /*#__PURE__*/React.createElement(Btn, {
      primary: true,
      disabled: exam.questions !== 120 || !exam.has_booklet,
      onClick: function () {
        run("live_admin_publish", {
          p_exam: id
        }, "Deneme yayınlansın ve kayda açılsın mı? Aynı kulvardaki bitmiş deneme arşive geçer.");
      }
    }, "Yay\u0131nla (kayda a\xE7)") : null, exam.status === "draft" ? /*#__PURE__*/React.createElement(Btn, {
      onClick: function () {
        run("live_admin_discard_draft", {
          p_exam: id
        }, "Taslak kaldırılsın mı? (Yayınlanmış denemeler asla silinemez.)");
        props.onBack();
      }
    }, "Tasla\u011F\u0131 kald\u0131r") : null)), exam.questions ? /*#__PURE__*/React.createElement(Box, {
      title: "Sorular (" + exam.questions + ")"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-600 dark:text-stone-300"
    }, canEdit ? "Yüklediğin soruları tek tek görüp düzeltebilir, görselleri değiştirebilirsin." : "Kayıt kapandı; sorular yalnızca görüntülenebilir."), /*#__PURE__*/React.createElement("div", {
      className: "mt-3"
    }, /*#__PURE__*/React.createElement(Btn, {
      primary: true,
      onClick: function () {
        setEditQs(true);
      }
    }, canEdit ? "Soruları görüntüle / düzenle" : "Soruları görüntüle"))) : null, canEdit ? /*#__PURE__*/React.createElement(Upload, {
      exam: exam,
      onDone: load,
      replace: !!exam.questions
    }) : null, mon && mon.paper && mon.paper.length && (exam.status === "scheduled" || exam.status === "finished") ? /*#__PURE__*/React.createElement(PaperBox, {
      rows: mon.paper,
      examId: id,
      finalized: !!exam.finalized_at,
      onDone: load
    }) : null, exam.status === "scheduled" ? /*#__PURE__*/React.createElement(Box, {
      title: live ? "● Canlı izleme" : "Durum"
    }, mon ? /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-4 sm:grid-cols-8 gap-2 text-center text-sm"
    }, [["Kayıtlı", mon.registered], ["Yedek", mon.waitlist], ["Giren", mon.entered], ["Aktif", mon.active], ["Teslim", mon.submitted], ["Kilitli", mon.locked], ["Kâğıtta", mon.paper_entered || 0], ["Optik gelen", mon.paper_submitted || 0]].map(function (x) {
      return /*#__PURE__*/React.createElement("div", {
        key: x[0],
        className: "rounded-xl bg-white/70 dark:bg-stone-800 p-2"
      }, /*#__PURE__*/React.createElement("div", {
        className: "text-xl font-black"
      }, x[1]), /*#__PURE__*/React.createElement("div", {
        className: "text-[11px] text-stone-500"
      }, x[0]));
    })) : null, mon && mon.avg_answered != null ? /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-stone-500 mt-2"
    }, "Ortalama i\u015Faretlenen: ", mon.avg_answered, " / 120") : null, lockedRegs.length ? /*#__PURE__*/React.createElement("div", {
      className: "mt-3"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-sm font-semibold text-rose-700"
    }, "Kilitlenen \xF6\u011Frenciler (3. cihaz de\u011Fi\u015Fimi)"), lockedRegs.map(function (r) {
      return /*#__PURE__*/React.createElement("div", {
        key: r.user_id,
        className: "flex items-center gap-2 text-sm mt-1"
      }, r.nickname, " \xB7 ", r.switches, " de\u011Fi\u015Fim ", /*#__PURE__*/React.createElement(Btn, {
        onClick: function () {
          run("live_admin_unlock", {
            p_exam: id,
            p_user: r.user_id
          }, r.nickname + " için kilit açılsın mı?");
        }
      }, "Kilidi a\xE7"));
    })) : null, mon && mon.events && mon.events.length ? /*#__PURE__*/React.createElement("details", {
      className: "mt-3"
    }, /*#__PURE__*/React.createElement("summary", {
      className: "text-sm font-semibold cursor-pointer"
    }, "Olaylar (", mon.events.length, ")"), /*#__PURE__*/React.createElement("ul", {
      className: "text-xs mt-2 space-y-0.5 max-h-56 overflow-auto"
    }, mon.events.map(function (ev, i) {
      return /*#__PURE__*/React.createElement("li", {
        key: i
      }, L.fmtClock(L.ms(ev.at)), " \xB7 ", EVENT[ev.kind] || ev.kind, " \xB7 ", ev.nickname || "", " ", ev.detail && ev.detail.switches ? "(" + ev.detail.switches + ")" : "", ev.detail && ev.detail.code ? " (" + ev.detail.code + ")" : "");
    }))) : null, /*#__PURE__*/React.createElement("div", {
      className: "mt-4 pt-3 border-t border-stone-200 dark:border-stone-700"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-sm font-bold text-rose-700"
    }, "Acil durum"), /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap items-center gap-2 mt-2"
    }, /*#__PURE__*/React.createElement("input", {
      type: "number",
      min: "1",
      max: "120",
      value: mins,
      onChange: function (e) {
        setMins(e.target.value);
      },
      className: "w-20 px-2 py-1.5 rounded-lg border",
      "aria-label": "Uzatma dakikas\u0131"
    }), /*#__PURE__*/React.createElement(Btn, {
      onClick: function () {
        run("live_admin_extend", {
          p_exam: id,
          p_minutes: Number(mins)
        }, "Sınav süresi herkes için " + mins + " dakika uzatılsın mı? Bitiş, geç senkron ve sıralama saatleri birlikte kayar.");
      }
    }, "S\xFCreyi uzat"), /*#__PURE__*/React.createElement(Btn, {
      danger: true,
      onClick: function () {
        var reason = window.prompt("İptal nedeni (öğrencilere gösterilir):");
        if (!reason) return;
        if (window.prompt("Onay için İPTAL yaz:") !== "İPTAL") return;
        run("live_admin_cancel", {
          p_exam: id,
          p_reason: reason
        });
      }
    }, "Denemeyi iptal et")))) : null, /*#__PURE__*/React.createElement(Box, {
      title: "Kayıtlar (" + regs.length + ")"
    }, /*#__PURE__*/React.createElement("div", {
      className: "max-h-80 overflow-auto"
    }, /*#__PURE__*/React.createElement("table", {
      className: "w-full text-sm"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
      className: "text-left text-xs text-stone-500"
    }, /*#__PURE__*/React.createElement("th", null, "Takma ad"), /*#__PURE__*/React.createElement("th", null, "Durum"), /*#__PURE__*/React.createElement("th", null, "Bi\xE7im"), /*#__PURE__*/React.createElement("th", null, "Girdi"), /*#__PURE__*/React.createElement("th", null, "Cevap"), /*#__PURE__*/React.createElement("th", null, "Net"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, regs.map(function (r) {
      return /*#__PURE__*/React.createElement("tr", {
        key: r.user_id,
        className: "border-t border-stone-200 dark:border-stone-700"
      }, /*#__PURE__*/React.createElement("td", {
        className: "py-1"
      }, r.nickname), /*#__PURE__*/React.createElement("td", null, r.status, r.locked ? " · kilitli" : ""), /*#__PURE__*/React.createElement("td", null, r.entered ? r.mode === "paper" ? "kâğıt" : "cihaz" : ""), /*#__PURE__*/React.createElement("td", null, r.entered ? "✓" + (r.switches ? " (" + r.switches + " değişim)" : "") : ""), /*#__PURE__*/React.createElement("td", null, r.answered || ""), /*#__PURE__*/React.createElement("td", null, r.net != null ? L.fmtNet(r.net) : ""), /*#__PURE__*/React.createElement("td", {
        className: "text-right"
      }, canEdit ? r.status === "blocked" ? /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "text-xs underline",
        onClick: function () {
          run("live_admin_set_registration", {
            p_exam: id,
            p_user: r.user_id,
            p_status: "registered"
          });
        }
      }, "engeli kald\u0131r") : /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "text-xs underline text-rose-700",
        onClick: function () {
          run("live_admin_set_registration", {
            p_exam: id,
            p_user: r.user_id,
            p_status: "blocked"
          }, r.nickname + " engellensin mi?");
        }
      }, "engelle") : null));
    }))))), stats ? /*#__PURE__*/React.createElement(Box, {
      title: "Soru istatistikleri"
    }, stats.cohort ? /*#__PURE__*/React.createElement("p", {
      className: "text-sm mb-3"
    }, stats.cohort.participants, " kat\u0131l\u0131mc\u0131 \xB7 ortalama net ", L.fmtNet(stats.cohort.avg_net), " (GY ", L.fmtNet(stats.cohort.avg_gy), ", GK ", L.fmtNet(stats.cohort.avg_gk), ")") : null, /*#__PURE__*/React.createElement("div", {
      className: "max-h-[32rem] overflow-auto"
    }, /*#__PURE__*/React.createElement("table", {
      className: "w-full text-xs"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
      className: "text-left text-stone-500"
    }, /*#__PURE__*/React.createElement("th", null, "No"), /*#__PURE__*/React.createElement("th", null, "Ders / konu"), /*#__PURE__*/React.createElement("th", null, "Do\u011Fru"), L.LETTERS.map(function (l) {
      return /*#__PURE__*/React.createElement("th", {
        key: l
      }, l);
    }), /*#__PURE__*/React.createElement("th", null, "Bo\u015F"), /*#__PURE__*/React.createElement("th", null, "Ort. sn"))), /*#__PURE__*/React.createElement("tbody", null, stats.questions.map(function (q) {
      var tot = (q.correct || 0) + (q.wrong || 0) + (q.blank || 0);
      return /*#__PURE__*/React.createElement("tr", {
        key: q.no,
        className: "border-t border-stone-200 dark:border-stone-700"
      }, /*#__PURE__*/React.createElement("td", {
        className: "py-1 font-bold"
      }, q.no), /*#__PURE__*/React.createElement("td", null, q.ders, " / ", window.konuLabel ? window.konuLabel(q.konu) : q.konu), /*#__PURE__*/React.createElement("td", null, tot ? Math.round(100 * q.correct / tot) + "%" : "–"), L.LETTERS.map(function (l) {
        var n = (q.choices || {})[l] || 0;
        return /*#__PURE__*/React.createElement("td", {
          key: l,
          className: l === q.answer ? "font-bold text-emerald-700" : ""
        }, n);
      }), /*#__PURE__*/React.createElement("td", null, q.blank || 0), /*#__PURE__*/React.createElement("td", null, q.avg_ms ? Math.round(q.avg_ms / 1000) : ""));
    }))))) : null);
  }

  // Kohort karşılaştırması: bir kulvarın kesinleşmiş denemeleri yan yana
  function Trends(props) {
    const [track, setTrack] = useState(props.track);
    const [rows, setRows] = useState(null);
    const [err, setErr] = useState("");
    useEffect(function () {
      setRows(null);
      C.rpc("live_admin_trends", {
        p_track: track
      }).then(setRows).catch(function (x) {
        setErr(x.message);
      });
    }, [track]);
    var dersler = [];
    (rows || []).forEach(function (r) {
      Object.keys(r.by_ders || {}).forEach(function (d) {
        if (dersler.indexOf(d) < 0) dersler.push(d);
      });
    });
    dersler.sort(function (a, b) {
      var ia = L.DERS_ORDER.indexOf(a),
        ib = L.DERS_ORDER.indexOf(b);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });
    function n(v) {
      return v == null ? "–" : L.fmtNet(v);
    }
    var dark = document.documentElement.classList.contains("dark");
    return /*#__PURE__*/React.createElement("div", {
      className: "space-y-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap items-center gap-3"
    }, /*#__PURE__*/React.createElement(Btn, {
      onClick: props.onBack
    }, "\u2190 Liste"), /*#__PURE__*/React.createElement("h1", {
      className: "text-2xl font-black"
    }, "Denemeleri kar\u015F\u0131la\u015Ft\u0131r")), /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap gap-2",
      role: "group",
      "aria-label": "Kulvar filtresi"
    }, Object.keys(L.TRACKS).map(function (k) {
      return /*#__PURE__*/React.createElement(Btn, {
        key: k,
        primary: track === k,
        onClick: function () {
          setTrack(k);
        }
      }, L.TRACKS[k]);
    })), err ? /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-rose-600"
    }, err) : null, /*#__PURE__*/React.createElement(Box, {
      title: "Katılım ve net · " + L.TRACKS[track]
    }, !rows ? "Yükleniyor…" : !rows.length ? "Bu kulvarda kesinleşmiş deneme yok." : /*#__PURE__*/React.createElement("div", {
      className: "overflow-x-auto"
    }, /*#__PURE__*/React.createElement("table", {
      className: "w-full text-sm"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
      className: "text-left text-xs text-stone-500"
    }, /*#__PURE__*/React.createElement("th", {
      className: "py-1 pr-3"
    }, "Deneme"), /*#__PURE__*/React.createElement("th", {
      className: "pr-3"
    }, "Kay\u0131t \u2192 kat\u0131l\u0131m"), /*#__PURE__*/React.createElement("th", {
      className: "pr-3 min-w-[180px]"
    }, "Ortalama net"), /*#__PURE__*/React.createElement("th", {
      className: "pr-3"
    }, "Medyan"), /*#__PURE__*/React.createElement("th", {
      className: "pr-3"
    }, "\u0130lk %10 s\u0131n\u0131r\u0131"), /*#__PURE__*/React.createElement("th", {
      className: "pr-3"
    }, "\u0130lk %10 ort."), /*#__PURE__*/React.createElement("th", {
      className: "pr-3"
    }, "Cihaz / k\xE2\u011F\u0131t ort."))), /*#__PURE__*/React.createElement("tbody", null, rows.map(function (r) {
      var a = r.analysis || {},
        pc = a.pct || {},
        m = a.by_mode || {};
      var w = Math.max(0, Math.min(100, (Number(r.avg_net) || 0) / 120 * 100));
      return /*#__PURE__*/React.createElement("tr", {
        key: r.id,
        className: "border-t border-stone-200 dark:border-stone-700"
      }, /*#__PURE__*/React.createElement("td", {
        className: "py-1.5 pr-3"
      }, /*#__PURE__*/React.createElement("b", null, r.title), /*#__PURE__*/React.createElement("span", {
        className: "block text-xs text-stone-500"
      }, L.fmtDate(L.ms(r.starts_at)))), /*#__PURE__*/React.createElement("td", {
        className: "pr-3"
      }, r.registered, " \u2192 ", r.participants), /*#__PURE__*/React.createElement("td", {
        className: "pr-3"
      }, /*#__PURE__*/React.createElement("span", {
        className: "inline-flex items-center gap-2 w-full"
      }, /*#__PURE__*/React.createElement("span", {
        className: "h-2 rounded-full",
        style: {
          width: w + "%",
          minWidth: 4,
          maxWidth: 120,
          background: dark ? "#3987e5" : "#2a78d6"
        },
        "aria-hidden": "true"
      }), /*#__PURE__*/React.createElement("b", null, n(r.avg_net)))), /*#__PURE__*/React.createElement("td", {
        className: "pr-3"
      }, n(pc.p50)), /*#__PURE__*/React.createElement("td", {
        className: "pr-3"
      }, n(pc.p90)), /*#__PURE__*/React.createElement("td", {
        className: "pr-3"
      }, n(a.top10_net)), /*#__PURE__*/React.createElement("td", {
        className: "pr-3"
      }, m.device ? n(m.device.avg_net) + " (" + m.device.n + ")" : "–", " / ", m.paper ? n(m.paper.avg_net) + " (" + m.paper.n + ")" : "–"));
    }))))), rows && rows.length ? /*#__PURE__*/React.createElement(Box, {
      title: "Ders ortalamalar\u0131 (kat\u0131lan ortalamas\u0131 \xB7 ilk %10)"
    }, /*#__PURE__*/React.createElement("div", {
      className: "overflow-x-auto"
    }, /*#__PURE__*/React.createElement("table", {
      className: "w-full text-sm"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
      className: "text-left text-xs text-stone-500"
    }, /*#__PURE__*/React.createElement("th", {
      className: "py-1 pr-3"
    }, "Ders"), rows.map(function (r) {
      return /*#__PURE__*/React.createElement("th", {
        key: r.id,
        className: "pr-3"
      }, L.fmtDay(L.ms(r.starts_at)));
    }))), /*#__PURE__*/React.createElement("tbody", null, dersler.map(function (d) {
      return /*#__PURE__*/React.createElement("tr", {
        key: d,
        className: "border-t border-stone-200 dark:border-stone-700"
      }, /*#__PURE__*/React.createElement("td", {
        className: "py-1.5 pr-3 font-semibold"
      }, d), rows.map(function (r) {
        var a = r.by_ders && r.by_ders[d],
          t = r.analysis && r.analysis.top10 && r.analysis.top10[d];
        return /*#__PURE__*/React.createElement("td", {
          key: r.id,
          className: "pr-3"
        }, a ? n(a.net) : "–", /*#__PURE__*/React.createElement("span", {
          className: "text-xs text-stone-500"
        }, t != null ? " · " + n(t) : ""));
      }));
    })))), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-stone-500 mt-2"
    }, "Bir dersin ortalamas\u0131 haftadan haftaya belirgin d\xFC\u015F\xFCyorsa o derste sorular zorla\u015Fm\u0131\u015F ya da konu eksikleri birikmi\u015F olabilir; soru istatistiklerinden kontrol et.")) : null);
  }
  function LiveExamAdmin() {
    const [list, setList] = useState(null);
    const [err, setErr] = useState("");
    const [mode, setMode] = useState("list");
    const [sel, setSel] = useState(null);
    const [track, setTrack] = useState("");
    function load() {
      C.rpc("live_admin_list").then(setList).catch(function (x) {
        setErr(x.message);
      });
    }
    useEffect(load, []);
    if (mode === "detail" && sel) return /*#__PURE__*/React.createElement(Detail, {
      id: sel,
      onBack: function () {
        setMode("list");
        load();
      }
    });
    if (mode === "trends") return /*#__PURE__*/React.createElement(Trends, {
      track: track || "lisans",
      onBack: function () {
        setMode("list");
      }
    });
    var shown = (list || []).filter(function (e) {
      return !track || e.track === track;
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "space-y-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap items-center justify-between gap-3"
    }, /*#__PURE__*/React.createElement("h1", {
      className: "text-2xl md:text-3xl font-black gradient-text"
    }, "\uD83D\uDD52 Canl\u0131 Deneme"), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-2"
    }, /*#__PURE__*/React.createElement(Btn, {
      onClick: function () {
        setMode("trends");
      }
    }, "\uD83D\uDCCA Denemeleri kar\u015F\u0131la\u015Ft\u0131r"), /*#__PURE__*/React.createElement(Btn, {
      primary: true,
      onClick: function () {
        setMode("create");
      }
    }, "Yeni deneme"))), err ? /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-rose-600"
    }, err, " (supabase/patch-live-exam.sql \xE7al\u0131\u015Ft\u0131r\u0131ld\u0131 m\u0131?)") : null, /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap gap-2",
      role: "group",
      "aria-label": "Kulvar filtresi"
    }, [["", "Tümü"]].concat(Object.keys(L.TRACKS).map(function (k) {
      return [k, L.TRACKS[k]];
    })).map(function (t) {
      return /*#__PURE__*/React.createElement(Btn, {
        key: t[0],
        primary: track === t[0],
        onClick: function () {
          setTrack(t[0]);
        }
      }, t[1]);
    })), mode === "create" ? /*#__PURE__*/React.createElement(CreateForm, {
      track: track || "lisans",
      onCancel: function () {
        setMode("list");
      },
      onCreated: function (id) {
        setSel(id);
        setMode("detail");
      }
    }) : null, /*#__PURE__*/React.createElement(Box, {
      title: "Denemeler"
    }, !list ? "Yükleniyor…" : !shown.length ? "Henüz deneme yok." : (track ? [track] : Object.keys(L.TRACKS)).map(function (tk) {
      var items = shown.filter(function (e) {
        return e.track === tk;
      });
      if (!items.length) return null;
      return /*#__PURE__*/React.createElement("div", {
        key: tk,
        className: "mb-4"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "text-sm font-black uppercase tracking-wide text-stone-500 mb-2"
      }, L.TRACKS[tk], " (", items.length, ")"), /*#__PURE__*/React.createElement("ul", {
        className: "space-y-2"
      }, items.map(function (e) {
        return /*#__PURE__*/React.createElement("li", {
          key: e.id
        }, /*#__PURE__*/React.createElement("button", {
          type: "button",
          className: "w-full text-left rounded-xl border border-stone-200 dark:border-stone-700 p-3 hover:bg-white/60 dark:hover:bg-stone-800/60",
          onClick: function () {
            setSel(e.id);
            setMode("detail");
          }
        }, /*#__PURE__*/React.createElement("span", {
          className: "font-bold"
        }, e.title), " ", /*#__PURE__*/React.createElement("span", {
          className: "text-xs px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-700 ml-1"
        }, STATUS[e.status]), " ", /*#__PURE__*/React.createElement("span", {
          className: "text-xs px-2 py-0.5 rounded-full border border-stone-300 dark:border-stone-600 ml-1"
        }, L.TRACKS[e.track]), /*#__PURE__*/React.createElement("span", {
          className: "block text-xs text-stone-500 mt-0.5"
        }, dt(e.starts_at), " \xB7 ", e.registered, " kay\u0131tl\u0131", e.waitlist ? " · " + e.waitlist + " yedek" : "", " \xB7 ", e.questions, "/120 soru", e.participants ? " · " + e.participants + " katılımcı · ort. net " + L.fmtNet(e.avg_net) : "")));
      })));
    }), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-stone-500 mt-3"
    }, "Yay\u0131nlanm\u0131\u015F, bitmi\u015F ve ar\u015Fivdeki denemeler silinemez (veritaban\u0131 da silmeyi reddeder). Yaln\u0131zca taslak kald\u0131r\u0131labilir.")));
  }
  window.KpssComponents = window.KpssComponents || {};
  window.KpssComponents.LiveExamAdmin = LiveExamAdmin;
})();