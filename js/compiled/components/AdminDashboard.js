/*jsx:babel-7.29.9-react-classic:87304:5k5urn*/
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
(function () {
  const {
    useEffect,
    useState,
    useMemo,
    useCallback,
    useRef
  } = React;

  // ============================================================
  // Yönetim paneli. Veriler önce veritabanı fonksiyonlarından (supabase/patch-admin-panel.sql)
  // okunur; o yama henüz kurulmamışsa "admin-action" sunucu fonksiyonuna düşülür ve panelin
  // üstünde kurulum uyarısı çıkar. Hiçbir hata sessizce yutulmaz.
  // ============================================================

  var LEVELS = [{
    id: "lisans",
    t: "Lisans"
  }, {
    id: "onlisans",
    t: "Ön lisans"
  }, {
    id: "ortaogretim",
    t: "Ortaöğretim"
  }];
  var ACTION_LABELS = {
    grant_premium: "Premium verildi",
    revoke_premium: "Premium kaldırıldı",
    block: "Engellendi",
    unblock: "Engel kaldırıldı",
    delete_user: "Kullanıcı silindi",
    approve_edu: "Eğitim talebi onaylandı",
    reject_edu: "Eğitim talebi reddedildi",
    announce: "Duyuru yayınlandı",
    delete_announce: "Duyuru silindi",
    submit_edu: "Eğitim talebi gönderildi",
    delete_my_account: "Hesabını sildi",
    inspect_user: "Kullanıcı incelendi",
    user_list: "Liste açıldı",
    list_edu_requests: "Talepler açıldı",
    list_announcements: "Duyurular açıldı"
  };
  function num(n) {
    return (Number(n) || 0).toLocaleString("tr-TR");
  }
  function toDate(x) {
    if (!x) return null;
    var d = new Date(String(x).length === 10 ? x + "T12:00:00" : x);
    return isNaN(d.getTime()) ? null : d;
  }
  function fmtDate(x) {
    var d = toDate(x);
    return d ? d.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      year: "numeric"
    }) : "—";
  }
  function fmtDateTime(x) {
    var d = toDate(x);
    return d ? d.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short"
    }) + " " + d.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit"
    }) : "—";
  }
  function todayStr() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function daysSince(x) {
    if (!x) return Infinity;
    var a = toDate(String(x).slice(0, 10));
    if (!a) return Infinity;
    var b = toDate(todayStr());
    return Math.round((b - a) / 86400000);
  }
  function lastSeen(x) {
    var n = daysSince(x);
    if (n === Infinity) return {
      t: "Hiç çalışmadı",
      tone: "rose"
    };
    if (n <= 0) return {
      t: "Bugün",
      tone: "green"
    };
    if (n === 1) return {
      t: "Dün",
      tone: "green"
    };
    if (n < 7) return {
      t: n + " gün önce",
      tone: "gold"
    };
    return {
      t: n + " gün önce",
      tone: "rose"
    };
  }
  function eduLabel(id) {
    var l = LEVELS.filter(function (x) {
      return x.id === id;
    })[0];
    return l ? l.t : id || "—";
  }
  function trackLabel(id) {
    return {
      B: "B grubu",
      A: "A grubu",
      ogretmen: "Öğretmenlik",
      dhbt: "DHBT"
    }[id] || id || "—";
  }
  function platformLabel(id) {
    return {
      web: "Web",
      ios: "iOS",
      android: "Android"
    }[id] || id || "—";
  }
  function cleanDetail(s) {
    return /^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(String(s || "")) ? "" : s || "";
  }
  function initial(s) {
    return String(s || "?").trim().charAt(0).toLocaleUpperCase("tr-TR") || "?";
  }
  function futureExamDate(level) {
    var d = window.KpssConfig && window.KpssConfig.examDateByLevel && window.KpssConfig.examDateByLevel[level];
    return d && d > todayStr() ? d : null;
  }
  function parseAnnounceRow(row) {
    var raw = String(row && row.body || "");
    var exp = row && row.expires_at;
    var m = raw.match(/^<!--kpss-exp:([^>]+)-->/);
    if (m) {
      exp = exp || m[1];
      raw = raw.slice(m[0].length);
    }
    var ts = exp ? new Date(exp).getTime() : NaN;
    var published = !row || row.published !== false;
    return {
      id: row && row.id,
      text: raw.trim(),
      expiresAt: exp || null,
      createdAt: row && row.created_at,
      live: published && (!exp || isFinite(ts) && ts > Date.now())
    };
  }

  // ---------- hata metni ----------
  function errText(e, fallback) {
    if (!e) return fallback || "İşlem tamamlanamadı.";
    if (typeof e === "string") return e;
    if (e.hint && /[a-zçğıöşü]/i.test(e.hint) && /[çğıöşüÇĞİÖŞÜ]|\s/.test(e.hint) && !/^(perhaps|try|no function)/i.test(e.hint)) return e.hint;
    if (e.tr) return e.tr;
    return window.trError ? window.trError(e, fallback || "İşlem tamamlanamadı.") : fallback || "İşlem tamamlanamadı.";
  }
  function isMissingFn(e) {
    var s = String(e && e.message || "") + " " + String(e && e.code || "");
    return /PGRST202|42883|could not find the function|function .* does not exist|schema cache/i.test(s);
  }

  // ---------- sunucu fonksiyonu (yedek yol) ----------
  async function edge(sb, action, body) {
    if (!sb.functions) throw {
      tr: "Sunucu fonksiyonu kullanılamıyor."
    };
    var r = await sb.functions.invoke("admin-action", {
      body: Object.assign({
        action: action
      }, body || {})
    });
    if (r.error) {
      var ctx = r.error.context,
        b = null;
      try {
        if (ctx && typeof ctx.json === "function") b = await ctx.json();else if (ctx && ctx.body) b = ctx.body;
      } catch (e) {
        b = null;
      }
      var status = ctx && ctx.status;
      throw {
        tr: b && b.error || (status === 403 ? "Bu işlem için yetkin yok." : "Sunucu fonksiyonuna ulaşılamadı (admin-action)."),
        message: r.error.message
      };
    }
    var d = r.data;
    if (typeof d === "string") {
      try {
        d = JSON.parse(d);
      } catch (e) {
        d = null;
      }
    }
    if (d && d.ok === false) throw {
      tr: d.error || "İşlem başarısız."
    };
    return d && Object.prototype.hasOwnProperty.call(d, "data") ? d.data : d;
  }

  // Önce veritabanı fonksiyonu; yoksa yedek. legacy: true → yedek kullanıldı (kurulum uyarısı)
  async function call(sb, name, args, fallback) {
    var r = await sb.rpc(name, args || {});
    if (!r.error) return {
      data: r.data,
      legacy: false
    };
    if (isMissingFn(r.error) && fallback) return {
      data: await fallback(),
      legacy: true
    };
    throw r.error;
  }
  function overviewFromUsers(users, pendingEdu, annLive) {
    var d = todayStr(),
      st = users.filter(function (u) {
        return u.role !== "admin";
      });
    var by = function (k) {
      var o = {};
      st.forEach(function (u) {
        var v = u[k] || "bilinmiyor";
        o[v] = (o[v] || 0) + 1;
      });
      return o;
    };
    var act = [];
    for (var i = 13; i >= 0; i--) {
      var x = new Date();
      x.setDate(x.getDate() - i);
      var day = x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0");
      act.push({
        day: day,
        n: users.filter(function (u) {
          return String(u.last_study_at || "").slice(0, 10) === day;
        }).length
      });
    }
    return {
      users: st.length,
      dau: users.filter(function (u) {
        return String(u.last_study_at || "").slice(0, 10) === d;
      }).length,
      wau: users.filter(function (u) {
        return daysSince(u.last_study_at) <= 6;
      }).length,
      mau: users.filter(function (u) {
        return daysSince(u.last_study_at) <= 29;
      }).length,
      idle7: st.filter(function (u) {
        return daysSince(u.last_study_at) > 7;
      }).length,
      premium: users.filter(function (u) {
        return u.premium;
      }).length,
      blocked: users.filter(function (u) {
        return u.blocked;
      }).length,
      questions: users.reduce(function (s, u) {
        return s + (Number(u.questions_total) || 0);
      }, 0),
      pending_edu: pendingEdu,
      by_level: by("education_level"),
      by_platform: by("platform"),
      active_14: act,
      announcements: annLive
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
    check: "M5 13l4 4L19 7",
    x: "M6 18L18 6M6 6l12 12",
    search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    q: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    bolt: "M13 10V3L4 14h7v7l9-11h-7z",
    arrow: "M13 7l5 5m0 0l-5 5m5-5H6",
    warn: "M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
  };
  function Ico(p) {
    return /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: p.w || 1.8,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      className: p.className,
      style: p.style
    }, /*#__PURE__*/React.createElement("path", {
      d: ICONS[p.n]
    }));
  }

  // ============================================================
  // ORTAK PARÇALAR
  // ============================================================
  function Confirm(p) {
    const okRef = useRef(null);
    useEffect(function () {
      if (okRef.current) okRef.current.focus();
      function onKey(e) {
        if (e.key === "Escape") p.onClose();
      }
      document.addEventListener("keydown", onKey);
      return function () {
        document.removeEventListener("keydown", onKey);
      };
    }, []);
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "adm-scrim",
      onClick: p.onClose
    }), /*#__PURE__*/React.createElement("div", {
      className: "adm-modal",
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "adm-confirm-t"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-start gap-3"
    }, /*#__PURE__*/React.createElement("span", {
      className: "adm-ico " + (p.tone === "danger" ? "adm-ico-rose" : p.tone === "ok" ? "adm-ico-green" : "adm-ico-gold")
    }, /*#__PURE__*/React.createElement(Ico, {
      n: p.icon || "warn"
    })), /*#__PURE__*/React.createElement("div", {
      className: "min-w-0"
    }, /*#__PURE__*/React.createElement("h2", {
      id: "adm-confirm-t",
      className: "text-lg font-extrabold leading-snug"
    }, p.title), p.body && /*#__PURE__*/React.createElement("p", {
      className: "text-sm adm-muted mt-1.5 leading-relaxed"
    }, p.body))), p.children, /*#__PURE__*/React.createElement("div", {
      className: "flex gap-2 justify-end mt-5"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "adm-btn adm-btn-ghost",
      onClick: p.onClose
    }, "Vazge\xE7"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      ref: okRef,
      className: "adm-btn " + (p.tone === "danger" ? "adm-btn-danger" : p.tone === "ok" ? "adm-btn-ok" : "adm-btn-primary"),
      onClick: function () {
        p.onOk();
        p.onClose();
      }
    }, p.okLabel || "Onayla"))));
  }
  function Empty(p) {
    return /*#__PURE__*/React.createElement("div", {
      className: "adm-card p-10 text-center"
    }, /*#__PURE__*/React.createElement("span", {
      className: "adm-ico adm-ico-teal mx-auto mb-3",
      style: {
        width: 52,
        height: 52,
        borderRadius: 16
      }
    }, /*#__PURE__*/React.createElement(Ico, {
      n: p.icon || "check"
    })), /*#__PURE__*/React.createElement("p", {
      className: "font-bold"
    }, p.title), p.text && /*#__PURE__*/React.createElement("p", {
      className: "text-sm adm-muted mt-1 max-w-md mx-auto"
    }, p.text));
  }
  function Kpi(p) {
    return /*#__PURE__*/React.createElement("div", {
      className: "adm-card adm-kpi"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between gap-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "adm-label"
    }, p.label), /*#__PURE__*/React.createElement("span", {
      className: "adm-ico adm-ico-" + (p.tone || "teal")
    }, /*#__PURE__*/React.createElement(Ico, {
      n: p.icon
    }))), /*#__PURE__*/React.createElement("div", {
      className: "adm-kpi-n mt-2"
    }, p.value), p.sub && /*#__PURE__*/React.createElement("div", {
      className: "text-xs adm-muted mt-1"
    }, p.sub));
  }
  function Head(p) {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "adm-eyebrow"
    }, p.eyebrow), /*#__PURE__*/React.createElement("h1", {
      className: "adm-h1 mt-1"
    }, p.title), p.sub && /*#__PURE__*/React.createElement("p", {
      className: "text-sm adm-muted mt-1.5 max-w-2xl"
    }, p.sub)), p.right);
  }
  function Dist(p) {
    var entries = Object.keys(p.data || {}).map(function (k) {
      return [k, p.data[k]];
    }).sort(function (a, b) {
      return b[1] - a[1];
    });
    var total = entries.reduce(function (s, e) {
      return s + e[1];
    }, 0) || 1;
    if (!entries.length) return /*#__PURE__*/React.createElement("p", {
      className: "text-sm adm-muted"
    }, "Veri yok.");
    return /*#__PURE__*/React.createElement("ul", {
      className: "space-y-3"
    }, entries.map(function (e) {
      var pct = Math.round(e[1] / total * 100);
      return /*#__PURE__*/React.createElement("li", {
        key: e[0]
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex justify-between text-sm mb-1.5"
      }, /*#__PURE__*/React.createElement("span", {
        className: "font-semibold"
      }, p.label(e[0])), /*#__PURE__*/React.createElement("span", {
        className: "adm-muted"
      }, num(e[1]), " \xB7 %", pct)), /*#__PURE__*/React.createElement("div", {
        className: "adm-meter " + (p.meter || "")
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          width: Math.max(2, pct) + "%"
        }
      })));
    }));
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
    const sbGet = function () {
      return window.SupabaseClient && window.SupabaseClient.get();
    };
    const say = useCallback(function (ok, text) {
      setToast({
        ok: ok,
        text: text
      });
      clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(function () {
        setToast(null);
      }, ok ? 3500 : 7000);
    }, []);

    // ---------- yükleme ----------
    const load = useCallback(async function () {
      var sb = sbGet();
      if (!sb) {
        setErrors({
          genel: "Veritabanına bağlanılamadı."
        });
        setLoading(false);
        return;
      }
      setLoading(true);
      var errs = {},
        usedLegacy = false;
      function track(r) {
        if (r && r.legacy) usedLegacy = true;
        return r;
      }
      var pUsers = call(sb, "admin_users", {}, async function () {
        try {
          return await edge(sb, "user_list");
        } catch (e) {
          var r2 = await sb.rpc("admin_user_list");
          if (r2.error) throw e;
          return r2.data || [];
        }
      }).then(track).catch(function (e) {
        errs.kullanicilar = errText(e, "Kullanıcı listesi yüklenemedi.");
        return null;
      });
      var pEdu = call(sb, "admin_edu_requests", {}, function () {
        return edge(sb, "list_edu_requests");
      }).then(track).catch(function (e) {
        errs.talepler = errText(e, "Eğitim talepleri yüklenemedi.");
        return null;
      });
      var pAnn = call(sb, "admin_announcements", {}, async function () {
        try {
          return await edge(sb, "list_announcements");
        } catch (e) {
          var rA = await sb.from("app_announcements").select("id,body,published,created_at,expires_at").order("created_at", {
            ascending: false
          }).limit(80);
          if (rA.error) throw e;
          return rA.data || [];
        }
      }).then(track).catch(function (e) {
        errs.duyuru = errText(e, "Duyurular yüklenemedi.");
        return null;
      });
      var pOv = call(sb, "admin_overview", {}, function () {
        return null;
      }).then(track).catch(function (e) {
        errs.ozet = errText(e, "Özet yüklenemedi.");
        return null;
      });
      var pHard = sb.rpc("admin_hard_topics").then(function (r) {
        if (r.error) {
          if (!isMissingFn(r.error)) errs.analiz = errText(r.error, "Zor konular yüklenemedi.");
          return [];
        }
        return r.data || [];
      });
      var pAudit = sb.rpc("admin_audit_log", {
        p_limit: 120
      }).then(function (r) {
        if (r.error) {
          if (isMissingFn(r.error)) {
            usedLegacy = true;
            return null;
          }
          errs.gecmis = errText(r.error, "İşlem geçmişi yüklenemedi.");
          return null;
        }
        return r.data || [];
      });
      var res = await Promise.all([pUsers, pEdu, pAnn, pOv, pHard, pAudit].map(function (p) {
        return p.catch(function () {
          return null;
        });
      }));
      var uList = res[0] ? Array.isArray(res[0].data) ? res[0].data : [] : null;
      var eList = res[1] ? Array.isArray(res[1].data) ? res[1].data : [] : null;
      var aList = res[2] ? (Array.isArray(res[2].data) ? res[2].data : []).map(parseAnnounceRow) : null;
      if (uList) setUsers(uList);
      if (eList) setEdu(eList);
      if (aList) setAnn(aList);
      var o = res[3] && res[3].data;
      if (!o && uList) o = overviewFromUsers(uList, (eList || []).length, (aList || []).filter(function (a) {
        return a.live;
      }).length);
      if (o) setOv(o);
      setHard(Array.isArray(res[4]) ? res[4] : []);
      setAudit(res[5]);
      setErrors(errs);
      setLegacy(usedLegacy);
      setLoadedAt(new Date());
      setLoading(false);
    }, []);
    useEffect(function () {
      if (isAdmin) load();
    }, [isAdmin, load]);
    useEffect(function () {
      return function () {
        clearTimeout(toastTimer.current);
      };
    }, []);

    // ---------- ayrıntı ----------
    const openDetail = useCallback(async function (uid) {
      setSel(uid);
      setDetail(null);
      setDetailErr("");
      setGrantDays(30);
      var sb = sbGet();
      if (!sb) return;
      try {
        var r = await call(sb, "admin_user_detail", {
          p_user: uid
        }, function () {
          return edge(sb, "inspect_user", {
            user_id: uid
          });
        });
        var d = r.data || {};
        if (r.legacy) d = Object.assign({}, d, {
          wrong_count: d.wrongCount,
          edu_request: d.educationChangeRequest
        });
        setDetail(d);
      } catch (e) {
        setDetailErr(errText(e, "Kullanıcı ayrıntısı yüklenemedi."));
      }
    }, []);
    const closeDetail = function () {
      setSel(null);
      setDetail(null);
      setDetailErr("");
    };
    useEffect(function () {
      if (!sel) return;
      function onKey(e) {
        if (e.key === "Escape" && !confirm) closeDetail();
      }
      document.addEventListener("keydown", onKey);
      return function () {
        document.removeEventListener("keydown", onKey);
      };
    }, [sel, confirm]);

    // ---------- işlemler ----------
    const run = useCallback(async function (key, fn, okText, after) {
      var sb = sbGet();
      if (!sb) {
        say(false, "Veritabanına bağlanılamadı.");
        return;
      }
      setBusy(key);
      try {
        await fn(sb);
        say(true, okText);
        if (after) after();
        await load();
      } catch (e) {
        say(false, errText(e, "İşlem tamamlanamadı."));
      } finally {
        setBusy("");
      }
    }, [load, say]);
    function setPremium(u, days) {
      var on = days > 0;
      run("premium:" + u.user_id, function (sb) {
        return call(sb, "admin_set_premium", {
          p_user: u.user_id,
          p_days: on ? days : 0
        }, function () {
          return edge(sb, on ? "grant_premium" : "revoke_premium", on ? {
            user_id: u.user_id,
            days: days
          } : {
            user_id: u.user_id
          });
        });
      }, on ? (u.nickname || "Kullanıcı") + " için " + days + " gün Premium açıldı." : (u.nickname || "Kullanıcı") + " artık ücretsiz planda.", function () {
        if (sel === u.user_id) openDetail(u.user_id);
      });
    }
    function setBlocked(u, on) {
      run("block:" + u.user_id, function (sb) {
        return call(sb, "admin_set_blocked", {
          p_user: u.user_id,
          p_blocked: on
        }, function () {
          return edge(sb, on ? "block" : "unblock", {
            user_id: u.user_id
          });
        });
      }, on ? (u.nickname || "Kullanıcı") + " engellendi." : (u.nickname || "Kullanıcı") + " için engel kaldırıldı.", function () {
        if (sel === u.user_id) openDetail(u.user_id);
      });
    }
    function deleteUser(u) {
      run("delete:" + u.user_id, function (sb) {
        return call(sb, "admin_delete_user", {
          p_user: u.user_id
        }, function () {
          return edge(sb, "delete_user", {
            user_id: u.user_id
          });
        });
      }, (u.nickname || "Kullanıcı") + " kalıcı olarak silindi.", closeDetail);
    }
    function decideEdu(r, approve) {
      var exam = approve ? futureExamDate(r.to) : null;
      run("edu:" + r.user_id, function (sb) {
        return call(sb, "admin_edu_decide", {
          p_user: r.user_id,
          p_approve: approve,
          p_exam_date: exam
        }, function () {
          return edge(sb, approve ? "approve_edu" : "reject_edu", approve ? {
            user_id: r.user_id,
            to: r.to,
            exam_date: exam
          } : {
            user_id: r.user_id
          });
        });
      }, approve ? (r.nickname || "Öğrenci") + " artık " + eduLabel(r.to) + " düzeyinde." : (r.nickname || "Öğrenci") + " talebi reddedildi.");
    }
    function publish() {
      var text = annText.trim();
      if (!text) return;
      var hours = Number(annHours) || 0;
      run("announce", function (sb) {
        return call(sb, "admin_announce", {
          p_text: text,
          p_hours: hours > 0 ? hours : null
        }, function () {
          return edge(sb, "announce", {
            text: text,
            hours: hours
          });
        });
      }, "Duyuru yayınlandı. Öğrenciler Bugün ekranında görecek.", function () {
        setAnnText("");
      });
    }
    function removeAnn(a) {
      run("ann:" + a.id, function (sb) {
        return call(sb, "admin_announce_delete", {
          p_id: a.id
        }, function () {
          return edge(sb, "delete_announce", {
            id: a.id
          });
        });
      }, "Duyuru silindi.");
    }

    // ---------- liste ----------
    const counts = useMemo(function () {
      return {
        all: users.length,
        premium: users.filter(function (u) {
          return u.premium;
        }).length,
        blocked: users.filter(function (u) {
          return u.blocked;
        }).length,
        pending: users.filter(function (u) {
          return u.edu_request;
        }).length,
        active: users.filter(function (u) {
          return daysSince(u.last_study_at) <= 0;
        }).length,
        idle7: users.filter(function (u) {
          return u.role !== "admin" && daysSince(u.last_study_at) > 7;
        }).length
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
        recent: function (u) {
          return -(toDate(u.last_study_at) || 0);
        },
        questions: function (u) {
          return -(Number(u.questions_total) || 0);
        },
        name: null,
        joined: function (u) {
          return -(toDate(u.created_at || u.updated_at) || 0);
        }
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
    const selUser = sel ? users.filter(function (u) {
      return u.user_id === sel;
    })[0] || {
      user_id: sel,
      nickname: detail && detail.nickname
    } : null;

    // ---------- yetki ----------
    if (!isAdmin) {
      return /*#__PURE__*/React.createElement("div", {
        className: "adm min-h-screen flex items-center justify-center p-6"
      }, /*#__PURE__*/React.createElement("div", {
        className: "adm-card text-center max-w-sm p-8"
      }, /*#__PURE__*/React.createElement("span", {
        className: "adm-ico adm-ico-rose mx-auto mb-3"
      }, /*#__PURE__*/React.createElement(Ico, {
        n: "ban"
      })), /*#__PURE__*/React.createElement("h1", {
        className: "text-xl font-extrabold mb-2"
      }, "Yetki yok"), /*#__PURE__*/React.createElement("p", {
        className: "text-sm adm-muted mb-6"
      }, "Bu hesap y\xF6netici yetkisine sahip de\u011Fil."), /*#__PURE__*/React.createElement("button", {
        onClick: props.onSignOut,
        className: "adm-btn adm-btn-primary w-full"
      }, "\xC7\u0131k\u0131\u015F yap")));
    }
    const nav = [{
      id: "ozet",
      t: "Özet",
      icon: "ozet"
    }, {
      id: "talepler",
      t: "Eğitim talepleri",
      icon: "talepler",
      badge: edu.length
    }, {
      id: "kullanicilar",
      t: "Kullanıcılar",
      icon: "kullanicilar"
    }, {
      id: "analiz",
      t: "Analiz",
      icon: "analiz"
    }, {
      id: "duyuru",
      t: "Duyurular",
      icon: "duyuru"
    }, {
      id: "deneme",
      t: "Canlı deneme",
      icon: "deneme"
    }, {
      id: "gecmis",
      t: "İşlem geçmişi",
      icon: "gecmis"
    }];
    const go = function (id) {
      setTab(id);
      try {
        window.scrollTo(0, 0);
      } catch (e) {}
    };
    const errList = Object.keys(errors);
    const act14 = ov && ov.active_14 || [];
    const maxAct = Math.max(1, Math.max.apply(null, act14.map(function (x) {
      return Number(x.n) || 0;
    }).concat([0])));
    const refreshBtn = /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "adm-btn adm-btn-ghost adm-btn-sm",
      onClick: load,
      disabled: loading,
      "aria-label": "Verileri yenile"
    }, loading ? /*#__PURE__*/React.createElement("span", {
      className: "adm-spin",
      "aria-hidden": "true"
    }) : /*#__PURE__*/React.createElement(Ico, {
      n: "refresh"
    }), /*#__PURE__*/React.createElement("span", null, loading ? "Yükleniyor" : "Yenile"));

    // ============================================================
    return /*#__PURE__*/React.createElement("div", {
      className: "adm flex"
    }, /*#__PURE__*/React.createElement("aside", {
      className: "adm-side hidden lg:flex flex-col w-72 shrink-0 sticky top-0 h-screen px-4 py-6",
      "aria-label": "Y\xF6netim men\xFCs\xFC"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3 px-2 mb-8"
    }, window.AtanomLogo ? window.AtanomLogo("h-11 w-11 object-contain rounded-xl") : /*#__PURE__*/React.createElement("img", {
      src: "icons/atanom.png",
      alt: "",
      className: "h-11 w-11 object-contain rounded-xl"
    }), /*#__PURE__*/React.createElement("div", {
      className: "min-w-0"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-lg font-extrabold leading-tight"
    }, "Atanly ", /*#__PURE__*/React.createElement("span", {
      className: "adm-gold"
    }, "Y\xF6netim")), /*#__PURE__*/React.createElement("div", {
      className: "text-xs text-white/70 truncate"
    }, up.email || "Yönetici"))), /*#__PURE__*/React.createElement("nav", {
      className: "flex-1 space-y-1"
    }, nav.map(function (n) {
      return /*#__PURE__*/React.createElement("button", {
        key: n.id,
        type: "button",
        className: "adm-nav",
        "aria-current": tab === n.id ? "page" : undefined,
        onClick: function () {
          go(n.id);
        }
      }, /*#__PURE__*/React.createElement(Ico, {
        n: n.icon
      }), /*#__PURE__*/React.createElement("span", {
        className: "flex-1"
      }, n.t), n.badge > 0 && /*#__PURE__*/React.createElement("span", {
        className: "adm-count",
        "aria-label": n.badge + " bekleyen"
      }, n.badge));
    })), /*#__PURE__*/React.createElement("div", {
      className: "rounded-2xl p-4 mb-3",
      style: {
        background: "rgba(255,255,255,.06)",
        border: "1px solid rgba(255,255,255,.1)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-xs text-white/70"
    }, "Son g\xFCncelleme"), /*#__PURE__*/React.createElement("div", {
      className: "text-sm font-bold mt-0.5"
    }, loadedAt ? loadedAt.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit"
    }) : "—")), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "adm-btn adm-btn-glass w-full",
      onClick: props.onSignOut
    }, /*#__PURE__*/React.createElement(Ico, {
      n: "out"
    }), "\xC7\u0131k\u0131\u015F")), /*#__PURE__*/React.createElement("div", {
      className: "flex-1 min-w-0"
    }, /*#__PURE__*/React.createElement("header", {
      className: "adm-top lg:hidden sticky top-0 z-30",
      style: {
        paddingTop: "env(safe-area-inset-top)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between gap-3 px-4 pt-3 pb-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2.5 min-w-0"
    }, window.AtanomLogo ? window.AtanomLogo("h-9 w-9 object-contain rounded-lg") : /*#__PURE__*/React.createElement("img", {
      src: "icons/atanom.png",
      alt: "",
      className: "h-9 w-9 object-contain rounded-lg"
    }), /*#__PURE__*/React.createElement("div", {
      className: "font-extrabold truncate"
    }, "Atanly ", /*#__PURE__*/React.createElement("span", {
      className: "adm-gold"
    }, "Y\xF6netim"))), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "adm-btn adm-btn-glass adm-btn-sm",
      onClick: load,
      disabled: loading,
      "aria-label": "Verileri yenile"
    }, loading ? /*#__PURE__*/React.createElement("span", {
      className: "adm-spin",
      "aria-hidden": "true"
    }) : /*#__PURE__*/React.createElement(Ico, {
      n: "refresh"
    })), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "adm-btn adm-btn-glass adm-btn-sm",
      onClick: props.onSignOut
    }, "\xC7\u0131k\u0131\u015F"))), /*#__PURE__*/React.createElement("nav", {
      className: "flex gap-2 overflow-x-auto px-4 pb-3",
      "aria-label": "Y\xF6netim b\xF6l\xFCmleri",
      style: {
        scrollbarWidth: "none"
      }
    }, nav.map(function (n) {
      return /*#__PURE__*/React.createElement("button", {
        key: n.id,
        type: "button",
        className: "adm-pill",
        "aria-current": tab === n.id ? "page" : undefined,
        onClick: function () {
          go(n.id);
        }
      }, n.t, n.badge > 0 && /*#__PURE__*/React.createElement("span", {
        className: "adm-count",
        style: {
          height: 20,
          minWidth: 20,
          fontSize: 10
        }
      }, n.badge));
    }))), /*#__PURE__*/React.createElement("main", {
      className: "px-4 py-6 md:px-8 md:py-8 max-w-7xl mx-auto"
    }, legacy && /*#__PURE__*/React.createElement("div", {
      className: "adm-alert adm-alert-warn mb-4",
      role: "status"
    }, /*#__PURE__*/React.createElement(Ico, {
      n: "warn",
      className: "w-5 h-5 shrink-0 mt-0.5"
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Veritaban\u0131 yamas\u0131 eksik."), " Panel \u015Fimdilik yedek yoldan \xE7al\u0131\u015F\u0131yor; baz\u0131 b\xF6l\xFCmler (i\u015Flem ge\xE7mi\u015Fi, ayr\u0131nt\u0131l\u0131 \xF6zet) kapal\u0131. Supabase \u2192 SQL Editor'da ", /*#__PURE__*/React.createElement("code", {
      className: "font-mono"
    }, "supabase/patch-admin-panel.sql"), " dosyas\u0131n\u0131 bir kez \xE7al\u0131\u015Ft\u0131r.")), errList.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "adm-alert adm-alert-err mb-4",
      role: "alert"
    }, /*#__PURE__*/React.createElement(Ico, {
      n: "warn",
      className: "w-5 h-5 shrink-0 mt-0.5"
    }), /*#__PURE__*/React.createElement("div", {
      className: "min-w-0"
    }, /*#__PURE__*/React.createElement("b", null, "Baz\u0131 veriler y\xFCklenemedi."), /*#__PURE__*/React.createElement("ul", {
      className: "mt-1 space-y-0.5"
    }, errList.map(function (k) {
      return /*#__PURE__*/React.createElement("li", {
        key: k
      }, errors[k]);
    }))), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "adm-btn adm-btn-ghost adm-btn-sm ml-auto",
      onClick: load
    }, "Tekrar dene")), tab === "ozet" && /*#__PURE__*/React.createElement("div", {
      className: "space-y-5"
    }, /*#__PURE__*/React.createElement("section", {
      className: "adm-hero p-6 md:p-8"
    }, /*#__PURE__*/React.createElement("div", {
      className: "adm-hero-grid"
    }), /*#__PURE__*/React.createElement("div", {
      className: "relative flex flex-col md:flex-row md:items-end justify-between gap-6"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "text-xs font-extrabold tracking-[.16em] uppercase text-white/70"
    }, "Y\xF6netim \xF6zeti"), /*#__PURE__*/React.createElement("h1", {
      className: "text-3xl md:text-4xl font-extrabold tracking-tight mt-2"
    }, "Ho\u015F geldin, ", /*#__PURE__*/React.createElement("span", {
      className: "adm-gold"
    }, student.profile && student.profile.name || up.nickname || "yönetici")), /*#__PURE__*/React.createElement("p", {
      className: "text-white/75 text-sm mt-2 max-w-xl"
    }, fmtDate(new Date()), " \xB7 ", ov ? num(ov.dau) + " öğrenci bugün çalıştı" : "Veriler yükleniyor", edu.length ? " · " + edu.length + " eğitim talebi seni bekliyor" : "")), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-3 gap-3 md:gap-5 text-center"
    }, [["Bugün", ov && ov.dau], ["7 gün", ov && ov.wau], ["30 gün", ov && ov.mau]].map(function (x) {
      return /*#__PURE__*/React.createElement("div", {
        key: x[0],
        className: "rounded-2xl px-4 py-3",
        style: {
          background: "rgba(255,255,255,.08)",
          border: "1px solid rgba(255,255,255,.12)"
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "text-2xl md:text-3xl font-extrabold"
      }, ov ? num(x[1]) : "—"), /*#__PURE__*/React.createElement("div", {
        className: "text-[11px] font-bold uppercase tracking-wider text-white/70 mt-0.5"
      }, x[0]));
    })))), edu.length > 0 && /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function () {
        go("talepler");
      },
      className: "adm-card w-full text-left p-4 flex items-center gap-4",
      style: {
        borderColor: "#E9D3A0"
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "adm-ico adm-ico-gold"
    }, /*#__PURE__*/React.createElement(Ico, {
      n: "talepler"
    })), /*#__PURE__*/React.createElement("div", {
      className: "flex-1 min-w-0"
    }, /*#__PURE__*/React.createElement("div", {
      className: "font-extrabold"
    }, edu.length, " e\u011Fitim de\u011Fi\u015Fikli\u011Fi talebi bekliyor"), /*#__PURE__*/React.createElement("div", {
      className: "text-sm adm-muted truncate"
    }, edu.slice(0, 3).map(function (r) {
      return (r.nickname || "Öğrenci") + " → " + eduLabel(r.to);
    }).join(" · "))), /*#__PURE__*/React.createElement("span", {
      className: "adm-btn adm-btn-gold adm-btn-sm"
    }, "\u0130ncele", /*#__PURE__*/React.createElement(Ico, {
      n: "arrow"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4"
    }, /*#__PURE__*/React.createElement(Kpi, {
      label: "\xD6\u011Frenci",
      icon: "kullanicilar",
      tone: "navy",
      value: ov ? num(ov.users) : "—",
      sub: ov ? num(ov.idle7) + " kişi 7+ gündür pasif" : ""
    }), /*#__PURE__*/React.createElement(Kpi, {
      label: "Premium",
      icon: "star",
      tone: "gold",
      value: ov ? num(ov.premium) : "—",
      sub: ov && ov.users ? "%" + Math.round(ov.premium / ov.users * 100) + " oran" : ""
    }), /*#__PURE__*/React.createElement(Kpi, {
      label: "\xC7\xF6z\xFClen soru",
      icon: "q",
      tone: "green",
      value: ov ? num(ov.questions) : "—",
      sub: ov && ov.users ? "Kişi başı " + num(Math.round(ov.questions / ov.users)) : ""
    }), /*#__PURE__*/React.createElement(Kpi, {
      label: "Engelli hesap",
      icon: "ban",
      tone: "rose",
      value: ov ? num(ov.blocked) : "—",
      sub: ov ? num(ov.announcements) + " duyuru yayında" : ""
    })), /*#__PURE__*/React.createElement("div", {
      className: "grid lg:grid-cols-3 gap-4"
    }, /*#__PURE__*/React.createElement("section", {
      className: "adm-card p-5 lg:col-span-2",
      "aria-labelledby": "adm-act-t"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between mb-4"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
      id: "adm-act-t",
      className: "font-extrabold"
    }, "G\xFCnl\xFCk aktif \xF6\u011Frenci"), /*#__PURE__*/React.createElement("p", {
      className: "text-xs adm-muted"
    }, "Son 14 g\xFCn \xB7 o g\xFCn en son \xE7al\u0131\u015Fan \xF6\u011Frenci say\u0131s\u0131")), /*#__PURE__*/React.createElement("span", {
      className: "adm-chip adm-chip-teal"
    }, "Bug\xFCn ", ov ? num(ov.dau) : "—")), loading && !ov ? /*#__PURE__*/React.createElement("div", {
      className: "adm-skel",
      style: {
        height: 140
      }
    }) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "adm-bars",
      role: "img",
      "aria-label": "Son 14 günün aktif öğrenci sayıları: " + act14.map(function (x) {
        return fmtDate(x.day) + " " + x.n;
      }).join(", ")
    }, act14.map(function (x, i) {
      return /*#__PURE__*/React.createElement("div", {
        key: x.day,
        title: fmtDate(x.day) + ": " + x.n,
        className: "adm-bar" + (i === act14.length - 1 ? " adm-bar-today" : ""),
        style: {
          height: Math.round((Number(x.n) || 0) / maxAct * 100) + "%"
        }
      });
    })), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-1.5 mt-2 text-[10px] adm-muted"
    }, act14.map(function (x, i) {
      return /*#__PURE__*/React.createElement("span", {
        key: x.day,
        className: "flex-1 text-center"
      }, i % 2 === act14.length % 2 ? String(x.day).slice(8, 10) : "");
    })))), /*#__PURE__*/React.createElement("section", {
      className: "adm-card p-5",
      "aria-labelledby": "adm-lvl-t"
    }, /*#__PURE__*/React.createElement("h2", {
      id: "adm-lvl-t",
      className: "font-extrabold mb-4"
    }, "E\u011Fitim d\xFCzeyi"), /*#__PURE__*/React.createElement(Dist, {
      data: ov && ov.by_level,
      label: eduLabel
    }), /*#__PURE__*/React.createElement("h2", {
      className: "font-extrabold mt-6 mb-4"
    }, "Platform"), /*#__PURE__*/React.createElement(Dist, {
      data: ov && ov.by_platform,
      label: platformLabel,
      meter: "adm-meter-gold"
    }))), /*#__PURE__*/React.createElement("section", {
      className: "adm-card p-5",
      "aria-labelledby": "adm-last-t"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between mb-3"
    }, /*#__PURE__*/React.createElement("h2", {
      id: "adm-last-t",
      className: "font-extrabold"
    }, "Son i\u015Flemler"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "text-sm font-bold",
      style: {
        color: "var(--a-teal)"
      },
      onClick: function () {
        go("gecmis");
      }
    }, "T\xFCm\xFC")), !audit || !audit.length ? /*#__PURE__*/React.createElement("p", {
      className: "text-sm adm-muted"
    }, audit ? "Henüz işlem yok." : "İşlem geçmişi için veritabanı yaması gerekli.") : /*#__PURE__*/React.createElement("ul", {
      className: "divide-y",
      style: {
        borderColor: "var(--a-line2)"
      }
    }, audit.slice(0, 5).map(function (a, i) {
      return /*#__PURE__*/React.createElement("li", {
        key: i,
        className: "py-2.5 flex items-center gap-3 text-sm"
      }, /*#__PURE__*/React.createElement("span", {
        className: "adm-chip " + (a.ok === false ? "adm-chip-rose" : "adm-chip-teal")
      }, ACTION_LABELS[a.action] || a.action), /*#__PURE__*/React.createElement("span", {
        className: "truncate flex-1"
      }, a.target || cleanDetail(a.detail)), /*#__PURE__*/React.createElement("span", {
        className: "adm-muted text-xs shrink-0"
      }, fmtDateTime(a.at)));
    })))), tab === "talepler" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Head, {
      eyebrow: "Onay bekleyenler",
      title: "E\u011Fitim de\u011Fi\u015Fikli\u011Fi talepleri",
      right: refreshBtn,
      sub: "Soru \xE7\xF6zmeye ba\u015Flam\u0131\u015F \xF6\u011Frenci d\xFCzeyini kendisi de\u011Fi\u015Ftiremez; talep buraya d\xFC\u015Fer. Onaylarsan d\xFCzeyi ve (gelece\u011Fe ait ise) s\u0131nav tarihi g\xFCncellenir."
    }), loading && !edu.length ? /*#__PURE__*/React.createElement("div", {
      className: "adm-skel",
      style: {
        height: 120
      }
    }) : !edu.length ? /*#__PURE__*/React.createElement(Empty, {
      title: "Bekleyen talep yok",
      text: "\xD6\u011Frenci Profil \u2192 Ayarlar'dan d\xFCzey de\u011Fi\u015Fikli\u011Fi istedi\u011Finde burada g\xF6r\xFCn\xFCr."
    }) : /*#__PURE__*/React.createElement("ul", {
      className: "grid md:grid-cols-2 gap-4"
    }, edu.map(function (r) {
      var exam = futureExamDate(r.to);
      var b = busy === "edu:" + r.user_id;
      return /*#__PURE__*/React.createElement("li", {
        key: r.user_id,
        className: "adm-card p-5"
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-3"
      }, /*#__PURE__*/React.createElement("span", {
        className: "adm-avatar"
      }, initial(r.nickname)), /*#__PURE__*/React.createElement("div", {
        className: "min-w-0 flex-1"
      }, /*#__PURE__*/React.createElement("div", {
        className: "font-extrabold truncate"
      }, r.nickname || "Öğrenci"), /*#__PURE__*/React.createElement("div", {
        className: "text-xs adm-muted"
      }, fmtDateTime(r.at), r.questions_total != null ? " · " + num(r.questions_total) + " soru çözmüş" : ""))), /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-2 mt-4"
      }, /*#__PURE__*/React.createElement("span", {
        className: "adm-chip"
      }, eduLabel(r.from)), /*#__PURE__*/React.createElement(Ico, {
        n: "arrow",
        className: "w-4 h-4 adm-muted"
      }), /*#__PURE__*/React.createElement("span", {
        className: "adm-chip adm-chip-teal"
      }, eduLabel(r.to))), /*#__PURE__*/React.createElement("div", {
        className: "flex gap-2 mt-5"
      }, /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "adm-btn adm-btn-ok flex-1",
        disabled: !!busy,
        onClick: function () {
          setConfirm({
            tone: "ok",
            icon: "check",
            title: (r.nickname || "Öğrenci") + " " + eduLabel(r.to) + " düzeyine geçsin mi?",
            okLabel: "Onayla",
            body: exam ? "Sınav tarihi " + fmtDate(exam) + " olarak ayarlanır. Öğrenci uygulamayı açınca yeni düzeyi görür." : "Öğrenci uygulamayı açınca yeni düzeyi görür. Sınav tarihi değişmez (takvimdeki tarih geçmiş).",
            onOk: function () {
              decideEdu(r, true);
            }
          });
        }
      }, b ? /*#__PURE__*/React.createElement("span", {
        className: "adm-spin"
      }) : /*#__PURE__*/React.createElement(Ico, {
        n: "check"
      }), "Onayla"), /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "adm-btn adm-btn-ghost flex-1",
        disabled: !!busy,
        onClick: function () {
          setConfirm({
            tone: "danger",
            icon: "x",
            title: "Talep reddedilsin mi?",
            okLabel: "Reddet",
            body: "Öğrenci " + eduLabel(r.from) + " düzeyinde kalır ve talebinin reddedildiğini görür.",
            onOk: function () {
              decideEdu(r, false);
            }
          });
        }
      }, /*#__PURE__*/React.createElement(Ico, {
        n: "x"
      }), "Reddet")));
    }))), tab === "kullanicilar" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Head, {
      eyebrow: "Hesaplar",
      title: "Kullan\u0131c\u0131lar",
      right: refreshBtn,
      sub: num(users.length) + " hesap · satıra dokunarak ayrıntı ve işlemleri aç."
    }), /*#__PURE__*/React.createElement("div", {
      className: "adm-card p-4 mb-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex flex-col md:flex-row gap-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "relative flex-1"
    }, /*#__PURE__*/React.createElement("span", {
      className: "sr-only"
    }, "Kullan\u0131c\u0131 ara"), /*#__PURE__*/React.createElement(Ico, {
      n: "search",
      className: "w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 adm-muted"
    }), /*#__PURE__*/React.createElement("input", {
      type: "search",
      value: q,
      onChange: function (e) {
        setQ(e.target.value);
        setPage(1);
      },
      placeholder: "Ad, e-posta, konum, d\xFCzey\u2026",
      className: "adm-input",
      style: {
        paddingLeft: 44
      }
    })), /*#__PURE__*/React.createElement("label", {
      className: "flex items-center gap-2 shrink-0"
    }, /*#__PURE__*/React.createElement("span", {
      className: "adm-label"
    }, "S\u0131rala"), /*#__PURE__*/React.createElement("select", {
      value: sort,
      onChange: function (e) {
        setSort(e.target.value);
      },
      className: "adm-input",
      style: {
        width: "auto"
      }
    }, /*#__PURE__*/React.createElement("option", {
      value: "recent"
    }, "Son \xE7al\u0131\u015Fma"), /*#__PURE__*/React.createElement("option", {
      value: "questions"
    }, "Soru say\u0131s\u0131"), /*#__PURE__*/React.createElement("option", {
      value: "name"
    }, "Ad (A\u2013Z)"), /*#__PURE__*/React.createElement("option", {
      value: "joined"
    }, "Kay\u0131t tarihi")))), /*#__PURE__*/React.createElement("div", {
      className: "adm-seg mt-3",
      role: "group",
      "aria-label": "Filtre"
    }, [["all", "Tümü", counts.all], ["active", "Bugün aktif", counts.active], ["idle7", "7+ gün pasif", counts.idle7], ["premium", "Premium", counts.premium], ["pending", "Talep bekleyen", counts.pending], ["blocked", "Engelli", counts.blocked], ["lisans", "Lisans"], ["onlisans", "Ön lisans"], ["ortaogretim", "Ortaöğretim"]].map(function (f) {
      return /*#__PURE__*/React.createElement("button", {
        key: f[0],
        type: "button",
        "aria-pressed": filter === f[0],
        onClick: function () {
          setFilter(f[0]);
          setPage(1);
        }
      }, f[1], f[2] != null ? " · " + f[2] : "");
    }))), loading && !users.length ? /*#__PURE__*/React.createElement("div", {
      className: "adm-skel",
      style: {
        height: 260
      }
    }) : !filtered.length ? /*#__PURE__*/React.createElement(Empty, {
      icon: "search",
      title: "E\u015Fle\u015Fen kullan\u0131c\u0131 yok",
      text: users.length ? "Aramayı ya da filtreyi değiştir." : "Liste boş."
    }) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "adm-card overflow-hidden hidden md:block"
    }, /*#__PURE__*/React.createElement("div", {
      className: "overflow-x-auto"
    }, /*#__PURE__*/React.createElement("table", {
      className: "adm-table"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
      scope: "col"
    }, "Kullan\u0131c\u0131"), /*#__PURE__*/React.createElement("th", {
      scope: "col"
    }, "D\xFCzey"), /*#__PURE__*/React.createElement("th", {
      scope: "col"
    }, "Son \xE7al\u0131\u015Fma"), /*#__PURE__*/React.createElement("th", {
      scope: "col",
      style: {
        textAlign: "right"
      }
    }, "Soru"), /*#__PURE__*/React.createElement("th", {
      scope: "col"
    }, "Durum"), /*#__PURE__*/React.createElement("th", {
      scope: "col"
    }, /*#__PURE__*/React.createElement("span", {
      className: "sr-only"
    }, "A\xE7")))), /*#__PURE__*/React.createElement("tbody", null, pageRows.map(function (u) {
      var ls = lastSeen(u.last_study_at);
      return /*#__PURE__*/React.createElement("tr", {
        key: u.user_id,
        className: "adm-row",
        tabIndex: 0,
        onClick: function () {
          openDetail(u.user_id);
        },
        onKeyDown: function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openDetail(u.user_id);
          }
        },
        "aria-label": (u.nickname || "Kullanıcı") + " ayrıntısını aç"
      }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-3 min-w-0"
      }, /*#__PURE__*/React.createElement("span", {
        className: "adm-avatar" + (u.premium ? " adm-avatar-gold" : "")
      }, initial(u.nickname)), /*#__PURE__*/React.createElement("div", {
        className: "min-w-0"
      }, /*#__PURE__*/React.createElement("div", {
        className: "font-bold truncate max-w-[220px]"
      }, u.nickname || "—", u.role === "admin" && /*#__PURE__*/React.createElement("span", {
        className: "adm-chip adm-chip-navy ml-2"
      }, "Y\xF6netici")), /*#__PURE__*/React.createElement("div", {
        className: "text-xs adm-muted truncate max-w-[260px]"
      }, u.email || u.location || String(u.user_id || "").slice(0, 8))))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
        className: "adm-chip"
      }, eduLabel(u.education_level))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
        className: "adm-chip adm-chip-" + ls.tone
      }, ls.t)), /*#__PURE__*/React.createElement("td", {
        style: {
          textAlign: "right"
        },
        className: "font-bold"
      }, num(u.questions_total)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
        className: "flex flex-wrap gap-1.5"
      }, u.premium && /*#__PURE__*/React.createElement("span", {
        className: "adm-chip adm-chip-gold"
      }, "Premium"), u.blocked && /*#__PURE__*/React.createElement("span", {
        className: "adm-chip adm-chip-rose"
      }, "Engelli"), u.edu_request && /*#__PURE__*/React.createElement("span", {
        className: "adm-chip adm-chip-teal"
      }, "Talep"), !u.premium && !u.blocked && !u.edu_request && /*#__PURE__*/React.createElement("span", {
        className: "adm-muted text-xs"
      }, "\xDCcretsiz"))), /*#__PURE__*/React.createElement("td", {
        style: {
          textAlign: "right"
        }
      }, /*#__PURE__*/React.createElement(Ico, {
        n: "arrow",
        className: "w-4 h-4 adm-muted inline"
      })));
    }))))), /*#__PURE__*/React.createElement("ul", {
      className: "md:hidden space-y-2.5"
    }, pageRows.map(function (u) {
      var ls = lastSeen(u.last_study_at);
      return /*#__PURE__*/React.createElement("li", {
        key: u.user_id
      }, /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "adm-card adm-row w-full text-left p-4 flex items-center gap-3",
        onClick: function () {
          openDetail(u.user_id);
        }
      }, /*#__PURE__*/React.createElement("span", {
        className: "adm-avatar" + (u.premium ? " adm-avatar-gold" : "")
      }, initial(u.nickname)), /*#__PURE__*/React.createElement("span", {
        className: "min-w-0 flex-1"
      }, /*#__PURE__*/React.createElement("span", {
        className: "block font-bold truncate"
      }, u.nickname || "—"), /*#__PURE__*/React.createElement("span", {
        className: "flex flex-wrap gap-1.5 mt-1.5"
      }, /*#__PURE__*/React.createElement("span", {
        className: "adm-chip"
      }, eduLabel(u.education_level)), /*#__PURE__*/React.createElement("span", {
        className: "adm-chip adm-chip-" + ls.tone
      }, ls.t), u.premium && /*#__PURE__*/React.createElement("span", {
        className: "adm-chip adm-chip-gold"
      }, "Premium"), u.blocked && /*#__PURE__*/React.createElement("span", {
        className: "adm-chip adm-chip-rose"
      }, "Engelli"), u.edu_request && /*#__PURE__*/React.createElement("span", {
        className: "adm-chip adm-chip-teal"
      }, "Talep"))), /*#__PURE__*/React.createElement("span", {
        className: "text-right shrink-0"
      }, /*#__PURE__*/React.createElement("span", {
        className: "block font-extrabold"
      }, num(u.questions_total)), /*#__PURE__*/React.createElement("span", {
        className: "text-[11px] adm-muted"
      }, "soru"))));
    })), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between gap-3 mt-4"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-sm adm-muted"
    }, num((curPage - 1) * PAGE + 1), "\u2013", num(Math.min(curPage * PAGE, filtered.length)), " / ", num(filtered.length)), pages > 1 && /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "adm-btn adm-btn-ghost adm-btn-sm",
      disabled: curPage <= 1,
      onClick: function () {
        setPage(curPage - 1);
      },
      "aria-label": "\xD6nceki sayfa"
    }, "\u2039 \xD6nceki"), /*#__PURE__*/React.createElement("span", {
      className: "text-sm font-bold"
    }, curPage, " / ", pages), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "adm-btn adm-btn-ghost adm-btn-sm",
      disabled: curPage >= pages,
      onClick: function () {
        setPage(curPage + 1);
      },
      "aria-label": "Sonraki sayfa"
    }, "Sonraki \u203A"))))), tab === "analiz" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Head, {
      eyebrow: "\xD6\u011Frenme verisi",
      title: "Analiz",
      right: refreshBtn,
      sub: "\xD6\u011Frencilerin en \xE7ok zorland\u0131\u011F\u0131 konular ve kitle da\u011F\u0131l\u0131m\u0131."
    }), /*#__PURE__*/React.createElement("div", {
      className: "grid lg:grid-cols-3 gap-4"
    }, /*#__PURE__*/React.createElement("section", {
      className: "adm-card p-5 lg:col-span-2",
      "aria-labelledby": "adm-hard-t"
    }, /*#__PURE__*/React.createElement("h2", {
      id: "adm-hard-t",
      className: "font-extrabold"
    }, "En \xE7ok zorlan\u0131lan konular"), /*#__PURE__*/React.createElement("p", {
      className: "text-xs adm-muted mb-4"
    }, "Yanl\u0131\u015F a\u011F\u0131rl\u0131\u011F\u0131 toplam\u0131na g\xF6re ilk 10"), !hard.length ? /*#__PURE__*/React.createElement("p", {
      className: "text-sm adm-muted"
    }, "Hen\xFCz yeterli veri yok.") : /*#__PURE__*/React.createElement("ol", {
      className: "space-y-3.5"
    }, hard.map(function (h, i) {
      var top = Number(hard[0].wrong_weight) || 1;
      return /*#__PURE__*/React.createElement("li", {
        key: i,
        className: "flex items-center gap-3"
      }, /*#__PURE__*/React.createElement("span", {
        className: "w-6 text-sm font-extrabold adm-muted text-right"
      }, i + 1), /*#__PURE__*/React.createElement("div", {
        className: "flex-1 min-w-0"
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex justify-between gap-3 text-sm mb-1.5"
      }, /*#__PURE__*/React.createElement("span", {
        className: "font-bold truncate"
      }, h.konu || "—", " ", /*#__PURE__*/React.createElement("span", {
        className: "adm-muted font-semibold"
      }, "\xB7 ", h.ders || "")), /*#__PURE__*/React.createElement("span", {
        className: "adm-muted shrink-0"
      }, num(h.users), " ki\u015Fi")), /*#__PURE__*/React.createElement("div", {
        className: "adm-meter adm-meter-rose"
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          width: Math.max(3, Math.round((Number(h.wrong_weight) || 0) / top * 100)) + "%"
        }
      }))));
    }))), /*#__PURE__*/React.createElement("section", {
      className: "adm-card p-5",
      "aria-labelledby": "adm-dist-t"
    }, /*#__PURE__*/React.createElement("h2", {
      id: "adm-dist-t",
      className: "font-extrabold mb-4"
    }, "E\u011Fitim d\xFCzeyi"), /*#__PURE__*/React.createElement(Dist, {
      data: ov && ov.by_level,
      label: eduLabel
    }), /*#__PURE__*/React.createElement("h2", {
      className: "font-extrabold mt-6 mb-4"
    }, "Platform"), /*#__PURE__*/React.createElement(Dist, {
      data: ov && ov.by_platform,
      label: platformLabel,
      meter: "adm-meter-gold"
    }), /*#__PURE__*/React.createElement("h2", {
      className: "font-extrabold mt-6 mb-3"
    }, "Etkile\u015Fim"), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 gap-3 text-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "rounded-2xl p-3",
      style: {
        background: "var(--a-soft)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-xl font-extrabold"
    }, ov && ov.mau ? "%" + Math.round(ov.dau / ov.mau * 100) : "—"), /*#__PURE__*/React.createElement("div", {
      className: "text-xs adm-muted"
    }, "G\xFCnl\xFCk / ayl\u0131k")), /*#__PURE__*/React.createElement("div", {
      className: "rounded-2xl p-3",
      style: {
        background: "var(--a-soft)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-xl font-extrabold"
    }, ov && ov.users ? "%" + Math.round(ov.mau / ov.users * 100) : "—"), /*#__PURE__*/React.createElement("div", {
      className: "text-xs adm-muted"
    }, "30 g\xFCnde aktif")))))), tab === "duyuru" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Head, {
      eyebrow: "\u0130leti\u015Fim",
      title: "Duyurular",
      right: refreshBtn,
      sub: "Yay\u0131nlad\u0131\u011F\u0131n duyuru t\xFCm \xF6\u011Frencilerin Bug\xFCn ekran\u0131n\u0131n \xFCst\xFCnde bant olarak g\xF6r\xFCn\xFCr."
    }), /*#__PURE__*/React.createElement("div", {
      className: "grid lg:grid-cols-5 gap-4"
    }, /*#__PURE__*/React.createElement("section", {
      className: "adm-card p-5 lg:col-span-3",
      "aria-labelledby": "adm-new-t"
    }, /*#__PURE__*/React.createElement("h2", {
      id: "adm-new-t",
      className: "font-extrabold mb-3"
    }, "Yeni duyuru"), /*#__PURE__*/React.createElement("label", {
      className: "block"
    }, /*#__PURE__*/React.createElement("span", {
      className: "sr-only"
    }, "Duyuru metni"), /*#__PURE__*/React.createElement("textarea", {
      className: "adm-input",
      maxLength: 500,
      value: annText,
      onChange: function (e) {
        setAnnText(e.target.value);
      },
      placeholder: "\xD6rn: Pazar 10.00'da canl\u0131 deneme var, kayd\u0131n\u0131 unutma!"
    })), /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between text-xs adm-muted mt-1.5"
    }, /*#__PURE__*/React.createElement("span", null, "D\xFCz metin; ba\u011Flant\u0131 ve bi\xE7im eklenmez."), /*#__PURE__*/React.createElement("span", null, annText.length, "/500")), /*#__PURE__*/React.createElement("div", {
      className: "mt-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "adm-label mb-2"
    }, "Yay\u0131nda kalma s\xFCresi"), /*#__PURE__*/React.createElement("div", {
      className: "adm-seg",
      role: "group",
      "aria-label": "Yay\u0131n s\xFCresi"
    }, [["6", "6 saat"], ["24", "1 gün"], ["72", "3 gün"], ["168", "1 hafta"], ["0", "Süresiz"]].map(function (h) {
      return /*#__PURE__*/React.createElement("button", {
        key: h[0],
        type: "button",
        "aria-pressed": annHours === h[0],
        onClick: function () {
          setAnnHours(h[0]);
        }
      }, h[1]);
    }))), annText.trim() && /*#__PURE__*/React.createElement("div", {
      className: "mt-5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "adm-label mb-2"
    }, "\xD6\u011Frencinin g\xF6rece\u011Fi"), /*#__PURE__*/React.createElement("div", {
      className: "adm-banner text-sm font-semibold leading-relaxed"
    }, "\uD83D\uDCE2 ", annText.trim())), /*#__PURE__*/React.createElement("div", {
      className: "flex justify-end mt-5"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "adm-btn adm-btn-gold",
      disabled: !annText.trim() || !!busy,
      onClick: function () {
        setConfirm({
          tone: "ok",
          icon: "duyuru",
          title: "Duyuru yayınlansın mı?",
          okLabel: "Yayınla",
          body: "Tüm öğrencilere " + (annHours === "0" ? "süresiz" : {
            "6": "6 saat",
            "24": "1 gün",
            "72": "3 gün",
            "168": "1 hafta"
          }[annHours] + " boyunca") + " gösterilir.",
          onOk: publish
        });
      }
    }, busy === "announce" ? /*#__PURE__*/React.createElement("span", {
      className: "adm-spin"
    }) : /*#__PURE__*/React.createElement(Ico, {
      n: "duyuru"
    }), "Yay\u0131nla"))), /*#__PURE__*/React.createElement("section", {
      className: "lg:col-span-2",
      "aria-labelledby": "adm-ann-t"
    }, /*#__PURE__*/React.createElement("h2", {
      id: "adm-ann-t",
      className: "font-extrabold mb-3"
    }, "Yay\u0131nlananlar ", /*#__PURE__*/React.createElement("span", {
      className: "adm-muted font-semibold"
    }, "\xB7 ", ann.length)), !ann.length ? /*#__PURE__*/React.createElement(Empty, {
      icon: "duyuru",
      title: "Hen\xFCz duyuru yok"
    }) : /*#__PURE__*/React.createElement("ul", {
      className: "space-y-3"
    }, ann.map(function (a) {
      return /*#__PURE__*/React.createElement("li", {
        key: a.id || a.createdAt,
        className: "adm-card p-4"
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex items-start gap-3"
      }, /*#__PURE__*/React.createElement("p", {
        className: "text-sm font-semibold leading-relaxed flex-1 min-w-0 break-words"
      }, a.text || "—"), /*#__PURE__*/React.createElement("span", {
        className: "adm-chip " + (a.live ? "adm-chip-green" : "")
      }, a.live ? "Yayında" : "Süresi doldu")), /*#__PURE__*/React.createElement("div", {
        className: "flex items-center justify-between gap-3 mt-3"
      }, /*#__PURE__*/React.createElement("span", {
        className: "text-xs adm-muted"
      }, fmtDateTime(a.createdAt), " \xB7 ", a.expiresAt ? "bitiş " + fmtDateTime(a.expiresAt) : "süresiz"), /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "adm-btn adm-btn-soft-danger adm-btn-sm",
        disabled: !a.id || !!busy,
        "aria-label": "Duyuruyu sil",
        onClick: function () {
          setConfirm({
            tone: "danger",
            icon: "trash",
            title: "Duyuru silinsin mi?",
            body: "Öğrencilerin ekranındaki bant da kalkar.",
            okLabel: "Sil",
            onOk: function () {
              removeAnn(a);
            }
          });
        }
      }, /*#__PURE__*/React.createElement(Ico, {
        n: "trash"
      }), "Sil")));
    }))))), tab === "deneme" && /*#__PURE__*/React.createElement(LiveAdminHost, null), tab === "gecmis" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Head, {
      eyebrow: "Denetim",
      title: "\u0130\u015Flem ge\xE7mi\u015Fi",
      right: refreshBtn,
      sub: "Y\xF6netici i\u015Flemleri ve reddedilen yetkisiz denemeler (son 120 kay\u0131t)."
    }), audit === null ? /*#__PURE__*/React.createElement(Empty, {
      icon: "gecmis",
      title: "\u0130\u015Flem ge\xE7mi\u015Fi kapal\u0131",
      text: "Supabase SQL Editor'da supabase/patch-admin-panel.sql dosyas\u0131n\u0131 \xE7al\u0131\u015Ft\u0131r\u0131nca a\xE7\u0131l\u0131r."
    }) : !audit.length ? /*#__PURE__*/React.createElement(Empty, {
      icon: "gecmis",
      title: "Hen\xFCz kay\u0131t yok"
    }) : /*#__PURE__*/React.createElement("div", {
      className: "adm-card overflow-hidden"
    }, /*#__PURE__*/React.createElement("div", {
      className: "overflow-x-auto"
    }, /*#__PURE__*/React.createElement("table", {
      className: "adm-table"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
      scope: "col"
    }, "Zaman"), /*#__PURE__*/React.createElement("th", {
      scope: "col"
    }, "\u0130\u015Flem"), /*#__PURE__*/React.createElement("th", {
      scope: "col"
    }, "Yapan"), /*#__PURE__*/React.createElement("th", {
      scope: "col"
    }, "Hedef"), /*#__PURE__*/React.createElement("th", {
      scope: "col"
    }, "Ayr\u0131nt\u0131"))), /*#__PURE__*/React.createElement("tbody", null, audit.map(function (a, i) {
      return /*#__PURE__*/React.createElement("tr", {
        key: i
      }, /*#__PURE__*/React.createElement("td", {
        className: "whitespace-nowrap adm-muted text-xs"
      }, fmtDateTime(a.at)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
        className: "adm-chip " + (a.ok === false ? "adm-chip-rose" : "adm-chip-teal")
      }, a.ok === false ? "Reddedildi · " : "", ACTION_LABELS[a.action] || a.action)), /*#__PURE__*/React.createElement("td", {
        className: "font-semibold"
      }, a.actor || "—"), /*#__PURE__*/React.createElement("td", null, a.target || "—"), /*#__PURE__*/React.createElement("td", {
        className: "adm-muted text-xs max-w-[280px] truncate"
      }, cleanDetail(a.detail)));
    })))))))), sel && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "adm-scrim",
      onClick: closeDetail
    }), /*#__PURE__*/React.createElement("div", {
      className: "adm-drawer",
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "adm-user-t"
    }, /*#__PURE__*/React.createElement("div", {
      className: "adm-drawer-head"
    }, /*#__PURE__*/React.createElement("div", {
      className: "adm-hero-grid"
    }), /*#__PURE__*/React.createElement("div", {
      className: "relative flex items-start gap-3"
    }, /*#__PURE__*/React.createElement("span", {
      className: "adm-avatar" + (selUser && selUser.premium ? " adm-avatar-gold" : ""),
      style: {
        width: 52,
        height: 52,
        fontSize: 20,
        borderRadius: 16
      }
    }, initial(detail && detail.nickname || selUser && selUser.nickname)), /*#__PURE__*/React.createElement("div", {
      className: "min-w-0 flex-1"
    }, /*#__PURE__*/React.createElement("h2", {
      id: "adm-user-t",
      className: "text-xl font-extrabold truncate"
    }, detail && detail.nickname || selUser && selUser.nickname || "Kullanıcı"), /*#__PURE__*/React.createElement("div", {
      className: "text-sm text-white/75 truncate"
    }, detail && (detail.email || detail.name) || selUser && selUser.email || "")), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "adm-btn adm-btn-glass adm-btn-sm",
      onClick: closeDetail,
      "aria-label": "Kapat"
    }, /*#__PURE__*/React.createElement(Ico, {
      n: "x"
    })))), /*#__PURE__*/React.createElement("div", {
      className: "p-5 space-y-4"
    }, detailErr && /*#__PURE__*/React.createElement("div", {
      className: "adm-alert adm-alert-err",
      role: "alert"
    }, /*#__PURE__*/React.createElement(Ico, {
      n: "warn",
      className: "w-5 h-5 shrink-0"
    }), /*#__PURE__*/React.createElement("span", null, detailErr)), !detail && !detailErr && /*#__PURE__*/React.createElement("div", {
      className: "space-y-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "adm-skel",
      style: {
        height: 90
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "adm-skel",
      style: {
        height: 140
      }
    })), detail && /*#__PURE__*/React.createElement("div", {
      className: "space-y-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap gap-1.5"
    }, /*#__PURE__*/React.createElement("span", {
      className: "adm-chip adm-chip-navy"
    }, eduLabel(detail.education_level)), /*#__PURE__*/React.createElement("span", {
      className: "adm-chip"
    }, trackLabel(detail.target_type)), /*#__PURE__*/React.createElement("span", {
      className: "adm-chip"
    }, platformLabel(detail.platform)), detail.location && /*#__PURE__*/React.createElement("span", {
      className: "adm-chip"
    }, detail.location), detail.premium && /*#__PURE__*/React.createElement("span", {
      className: "adm-chip adm-chip-gold"
    }, "Premium", detail.premium_until ? " · " + fmtDate(detail.premium_until) + "'e kadar" : ""), detail.blocked && /*#__PURE__*/React.createElement("span", {
      className: "adm-chip adm-chip-rose"
    }, "Engelli"), detail.role === "admin" && /*#__PURE__*/React.createElement("span", {
      className: "adm-chip adm-chip-navy"
    }, "Y\xF6netici")), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-3 gap-2.5"
    }, [["Soru", num(detail.questions_total || detail.counters && detail.counters.questions)], ["Yanlış defteri", num(detail.wrong_count)], ["Seri", num(detail.streak && (detail.streak.current || detail.streak.count))]].map(function (x) {
      return /*#__PURE__*/React.createElement("div", {
        key: x[0],
        className: "adm-card p-3 text-center"
      }, /*#__PURE__*/React.createElement("div", {
        className: "text-xl font-extrabold"
      }, x[1]), /*#__PURE__*/React.createElement("div", {
        className: "text-[11px] adm-muted font-bold"
      }, x[0]));
    })), /*#__PURE__*/React.createElement("div", {
      className: "adm-card p-4 text-sm space-y-2"
    }, [["Son çalışma", lastSeen(detail.last_study_at).t + (detail.last_study_at ? " · " + fmtDate(detail.last_study_at) : "")], ["Kayıt", fmtDate(detail.created_at)], ["Sınav tarihi", fmtDate(detail.exam_date)], ["Son eşitleme", fmtDateTime(detail.updated_at)], ["Kullanıcı kimliği", detail.user_id]].map(function (x) {
      return /*#__PURE__*/React.createElement("div", {
        key: x[0],
        className: "flex justify-between gap-4"
      }, /*#__PURE__*/React.createElement("span", {
        className: "adm-muted shrink-0"
      }, x[0]), /*#__PURE__*/React.createElement("span", {
        className: "text-right break-all " + (x[0] === "Kullanıcı kimliği" ? "font-mono text-xs adm-muted" : "font-semibold")
      }, x[1] || "—"));
    })), Array.isArray(detail.days) && detail.days.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "adm-card p-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "font-extrabold text-sm mb-3"
    }, "Son \xE7al\u0131\u015Fma g\xFCnleri"), /*#__PURE__*/React.createElement("ul", {
      className: "space-y-2"
    }, detail.days.slice(0, 7).map(function (d) {
      var pct = d.q ? Math.round(d.c / d.q * 100) : 0;
      return /*#__PURE__*/React.createElement("li", {
        key: d.day,
        className: "flex items-center gap-3 text-sm"
      }, /*#__PURE__*/React.createElement("span", {
        className: "w-16 shrink-0 adm-muted"
      }, fmtDate(d.day).replace(/ \d{4}$/, "")), /*#__PURE__*/React.createElement("div", {
        className: "adm-meter flex-1"
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          width: pct + "%"
        }
      })), /*#__PURE__*/React.createElement("span", {
        className: "w-28 text-right shrink-0 font-semibold text-xs whitespace-nowrap"
      }, d.q, " soru \xB7 %", pct));
    }))), detail.edu_request && /*#__PURE__*/React.createElement("div", {
      className: "adm-card p-4 text-sm flex items-center gap-3"
    }, /*#__PURE__*/React.createElement("span", {
      className: "adm-ico adm-ico-gold"
    }, /*#__PURE__*/React.createElement(Ico, {
      n: "talepler"
    })), /*#__PURE__*/React.createElement("div", {
      className: "flex-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "font-bold"
    }, "E\u011Fitim talebi: ", eduLabel(detail.edu_request.from), " \u2192 ", eduLabel(detail.edu_request.to)), /*#__PURE__*/React.createElement("div", {
      className: "adm-muted text-xs"
    }, {
      pending: "Onay bekliyor",
      rejected: "Reddedildi",
      approved: "Onaylandı"
    }[detail.edu_request.status] || detail.edu_request.status, " \xB7 ", fmtDateTime(detail.edu_request.at))), detail.edu_request.status === "pending" && /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "adm-btn adm-btn-ghost adm-btn-sm",
      onClick: function () {
        closeDetail();
        go("talepler");
      }
    }, "Talepler")), detail.role !== "admin" && /*#__PURE__*/React.createElement("div", {
      className: "space-y-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "adm-card p-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2 font-extrabold text-sm mb-3"
    }, /*#__PURE__*/React.createElement(Ico, {
      n: "star",
      className: "w-5 h-5",
      style: {
        color: "var(--a-gold)"
      }
    }), "Premium"), detail.premium ? /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "adm-btn adm-btn-ghost w-full",
      disabled: !!busy,
      onClick: function () {
        setConfirm({
          tone: "danger",
          icon: "star",
          title: "Premium kaldırılsın mı?",
          body: (detail.nickname || "Kullanıcı") + " ücretsiz plana döner.",
          okLabel: "Premium'u kaldır",
          onOk: function () {
            setPremium(selUser, 0);
          }
        });
      }
    }, busy === "premium:" + detail.user_id ? /*#__PURE__*/React.createElement("span", {
      className: "adm-spin"
    }) : null, "Premium'u kald\u0131r") : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "adm-seg mb-3",
      role: "group",
      "aria-label": "Premium s\xFCresi"
    }, [7, 30, 90, 365].map(function (d) {
      return /*#__PURE__*/React.createElement("button", {
        key: d,
        type: "button",
        "aria-pressed": grantDays === d,
        onClick: function () {
          setGrantDays(d);
        }
      }, d === 365 ? "1 yıl" : d + " gün");
    })), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "adm-btn adm-btn-gold w-full",
      disabled: !!busy,
      onClick: function () {
        var d = grantDays;
        setConfirm({
          tone: "ok",
          icon: "star",
          title: d + " gün Premium verilsin mi?",
          body: (detail.nickname || "Kullanıcı") + " için Premium bugünden itibaren " + d + " gün açık kalır.",
          okLabel: "Premium ver",
          onOk: function () {
            setPremium(selUser, d);
          }
        });
      }
    }, busy === "premium:" + detail.user_id ? /*#__PURE__*/React.createElement("span", {
      className: "adm-spin"
    }) : /*#__PURE__*/React.createElement(Ico, {
      n: "star"
    }), "Premium ver"))), /*#__PURE__*/React.createElement("div", {
      className: "adm-card p-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "font-extrabold text-sm mb-3"
    }, "Hesap"), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 gap-2"
    }, detail.blocked ? /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "adm-btn adm-btn-ok",
      disabled: !!busy,
      onClick: function () {
        setConfirm({
          tone: "ok",
          icon: "check",
          title: "Engel kaldırılsın mı?",
          body: (detail.nickname || "Kullanıcı") + " uygulamayı yeniden kullanabilir.",
          okLabel: "Engeli kaldır",
          onOk: function () {
            setBlocked(selUser, false);
          }
        });
      }
    }, /*#__PURE__*/React.createElement(Ico, {
      n: "check"
    }), "Engeli kald\u0131r") : /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "adm-btn adm-btn-soft-danger",
      disabled: !!busy,
      onClick: function () {
        setConfirm({
          tone: "danger",
          icon: "ban",
          title: "Kullanıcı engellensin mi?",
          body: (detail.nickname || "Kullanıcı") + " giriş yapınca \"Hesap kısıtlı\" ekranını görür. İstediğin zaman kaldırabilirsin.",
          okLabel: "Engelle",
          onOk: function () {
            setBlocked(selUser, true);
          }
        });
      }
    }, /*#__PURE__*/React.createElement(Ico, {
      n: "ban"
    }), "Engelle"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "adm-btn adm-btn-danger",
      disabled: !!busy || detail.user_id === myId,
      onClick: function () {
        setConfirm({
          tone: "danger",
          icon: "trash",
          title: "Hesap kalıcı olarak silinsin mi?",
          body: (detail.nickname || "Kullanıcı") + " ve tüm çalışma verisi silinir, bir daha giriş yapamaz. Bu işlem geri alınamaz.",
          okLabel: "Kalıcı olarak sil",
          onOk: function () {
            deleteUser(selUser);
          }
        });
      }
    }, /*#__PURE__*/React.createElement(Ico, {
      n: "trash"
    }), "Sil")))))))), confirm && /*#__PURE__*/React.createElement(Confirm, _extends({}, confirm, {
      onClose: function () {
        setConfirm(null);
      }
    })), toast && /*#__PURE__*/React.createElement("div", {
      className: "adm-toast " + (toast.ok ? "adm-toast-ok" : "adm-toast-err"),
      role: toast.ok ? "status" : "alert"
    }, /*#__PURE__*/React.createElement(Ico, {
      n: toast.ok ? "check" : "warn",
      className: "w-5 h-5 shrink-0 mt-0.5"
    }), /*#__PURE__*/React.createElement("span", {
      className: "flex-1"
    }, toast.text), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function () {
        setToast(null);
      },
      "aria-label": "Bildirimi kapat",
      className: "shrink-0 opacity-80 hover:opacity-100"
    }, /*#__PURE__*/React.createElement(Ico, {
      n: "x",
      className: "w-5 h-5"
    }))));
  }

  // Canlı deneme yönetimi ayrı dosyada; sekme açılınca yüklenir.
  function LiveAdminHost() {
    const [Cmp, setCmp] = React.useState(function () {
      return window.KpssComponents && window.KpssComponents.LiveExamAdmin || null;
    });
    const [err, setErr] = React.useState("");
    React.useEffect(function () {
      if (Cmp || !window.JsxLoader) return;
      window.JsxLoader.load("LiveExamAdmin", "js/components/LiveExamAdmin.jsx").then(function (C) {
        if (C) setCmp(function () {
          return C;
        });else setErr("Canlı deneme yönetimi yüklenemedi. Sayfayı yenile.");
      }).catch(function (e) {
        setErr("Canlı deneme yönetimi yüklenemedi: " + String(e && e.message || e));
      });
    }, []);
    if (err) return /*#__PURE__*/React.createElement("div", {
      className: "adm-alert adm-alert-err",
      role: "alert"
    }, err);
    return Cmp ? /*#__PURE__*/React.createElement(Cmp, null) : /*#__PURE__*/React.createElement("div", {
      className: "adm-skel",
      style: {
        height: 240
      }
    });
  }
  window.KpssComponents = window.KpssComponents || {};
  window.KpssComponents.AdminDashboard = AdminDashboard;
})();