const { useState, useEffect, useMemo, useRef } = React;

const DERS_THEME = {
    "Tarih": { text: "text-stone-700", icon: "📜", darkText: "text-stone-300", accent: "#ea580c", pastel: "#ffedd5" },
    "Coğrafya": { text: "text-stone-700", icon: "🗺️", darkText: "text-stone-300", accent: "#059669", pastel: "#d1fae5" },
    "Türkçe": { text: "text-stone-700", icon: "✍️", darkText: "text-stone-300", accent: "#2563eb", pastel: "#dbeafe" },
    "Vatandaşlık": { text: "text-stone-700", icon: "⚖️", darkText: "text-stone-300", accent: "#7c3aed", pastel: "#ede9fe" },
    "Güncel Bilgiler": { text: "text-stone-700", icon: "📰", darkText: "text-stone-300", accent: "#db2777", pastel: "#fce7f3" },
    "Geometri": { text: "text-stone-700", icon: "📐", darkText: "text-stone-300", accent: "#0d9488", pastel: "#ccfbf1" },
    "Hukuk": { text: "text-stone-700", icon: "⚖️", darkText: "text-stone-300", accent: "#4f46e5", pastel: "#e0e7ff" },
    "İktisat": { text: "text-stone-700", icon: "📈", darkText: "text-stone-300", accent: "#0f766e", pastel: "#ccfbf1" },
    "Maliye": { text: "text-stone-700", icon: "🏦", darkText: "text-stone-300", accent: "#b45309", pastel: "#fef3c7" },
    "Muhasebe": { text: "text-stone-700", icon: "📒", darkText: "text-stone-300", accent: "#0369a1", pastel: "#e0f2fe" },
    "İşletme": { text: "text-stone-700", icon: "🏢", darkText: "text-stone-300", accent: "#be185d", pastel: "#fce7f3" },
    "İstatistik": { text: "text-stone-700", icon: "📊", darkText: "text-stone-300", accent: "#4338ca", pastel: "#e0e7ff" },
    "Kamu Yönetimi": { text: "text-stone-700", icon: "🏛️", darkText: "text-stone-300", accent: "#b91c1c", pastel: "#fee2e2" },
    "Uluslararası İlişkiler": { text: "text-stone-700", icon: "🌐", darkText: "text-stone-300", accent: "#1d4ed8", pastel: "#dbeafe" },
    "ÇEKO": { text: "text-stone-700", icon: "👷", darkText: "text-stone-300", accent: "#047857", pastel: "#d1fae5" },
    "AGS Sözel Yetenek": { text: "text-stone-700", icon: "🗣️", darkText: "text-stone-300", accent: "#1d4ed8", pastel: "#dbeafe" },
    "AGS Sayısal Yetenek": { text: "text-stone-700", icon: "🔢", darkText: "text-stone-300", accent: "#0f766e", pastel: "#ccfbf1" },
    "AGS Tarih": { text: "text-stone-700", icon: "📜", darkText: "text-stone-300", accent: "#b45309", pastel: "#fef3c7" },
    "AGS Türkiye Coğrafyası": { text: "text-stone-700", icon: "🗺️", darkText: "text-stone-300", accent: "#047857", pastel: "#d1fae5" },
    "AGS Eğitim Bilimleri": { text: "text-stone-700", icon: "🎓", darkText: "text-stone-300", accent: "#be185d", pastel: "#fce7f3" },
    "AGS Mevzuat": { text: "text-stone-700", icon: "⚖️", darkText: "text-stone-300", accent: "#4f46e5", pastel: "#e0e7ff" },
    "ÖABT Türkçe": { text: "text-stone-700", icon: "✍️", darkText: "text-stone-300", accent: "#2563eb", pastel: "#dbeafe" },
    "ÖABT İlköğretim Matematik": { text: "text-stone-700", icon: "➗", darkText: "text-stone-300", accent: "#0d9488", pastel: "#ccfbf1" },
    "ÖABT Matematik": { text: "text-stone-700", icon: "📐", darkText: "text-stone-300", accent: "#115e59", pastel: "#ccfbf1" },
    "ÖABT Fen Bilimleri": { text: "text-stone-700", icon: "🔬", darkText: "text-stone-300", accent: "#0369a1", pastel: "#e0f2fe" },
    "ÖABT Fizik": { text: "text-stone-700", icon: "⚛️", darkText: "text-stone-300", accent: "#4338ca", pastel: "#e0e7ff" },
    "ÖABT Kimya": { text: "text-stone-700", icon: "🧪", darkText: "text-stone-300", accent: "#b91c1c", pastel: "#fee2e2" },
    "ÖABT Biyoloji": { text: "text-stone-700", icon: "🧬", darkText: "text-stone-300", accent: "#15803d", pastel: "#dcfce7" },
    "ÖABT Sosyal Bilgiler": { text: "text-stone-700", icon: "🌍", darkText: "text-stone-300", accent: "#c2410c", pastel: "#ffedd5" },
    "ÖABT Türk Dili ve Edebiyatı": { text: "text-stone-700", icon: "📖", darkText: "text-stone-300", accent: "#7c3aed", pastel: "#ede9fe" },
    "ÖABT Tarih": { text: "text-stone-700", icon: "🏛️", darkText: "text-stone-300", accent: "#a16207", pastel: "#fef3c7" },
    "ÖABT Coğrafya": { text: "text-stone-700", icon: "🧭", darkText: "text-stone-300", accent: "#047857", pastel: "#d1fae5" },
    "ÖABT DKAB / İHL": { text: "text-stone-700", icon: "🕌", darkText: "text-stone-300", accent: "#0f766e", pastel: "#ccfbf1" },
    "ÖABT Rehberlik": { text: "text-stone-700", icon: "💚", darkText: "text-stone-300", accent: "#047857", pastel: "#d1fae5" },
    "ÖABT Beden Eğitimi": { text: "text-stone-700", icon: "🏃", darkText: "text-stone-300", accent: "#ea580c", pastel: "#ffedd5" },
    "ÖABT Sınıf Öğretmenliği": { text: "text-stone-700", icon: "🏫", darkText: "text-stone-300", accent: "#db2777", pastel: "#fce7f3" },
    "ÖABT Okul Öncesi": { text: "text-stone-700", icon: "🧸", darkText: "text-stone-300", accent: "#d97706", pastel: "#fef3c7" },
    "ÖABT Özel Eğitim": { text: "text-stone-700", icon: "🤝", darkText: "text-stone-300", accent: "#7c3aed", pastel: "#ede9fe" }
};

function stripChoicePrefix(opt) {
    return String(opt || "").replace(/^[A-Ea-e][\s\)\.:\-]+\s*/, "").trim();
}

// Konu adını ekranda yazım düzeltilmiş göster (anahtar değişmez; bkz. data.js KONU_LABELS).
function kLabel(k) {
    return (typeof window !== "undefined" && window.konuLabel) ? window.konuLabel(k) : k;
}

function SoruGorsel(soru) {
    if (!soru) return null;
    var list = soru.imgs || (soru.img ? (Array.isArray(soru.img) ? soru.img : [soru.img]) : []);
    if (!list.length) return null;
    return (
        <div>
            {list.map(function (src, i) {
                return (
                    <img key={src + i} src={src} alt={soru.imgAlt || "Soru görseli"} className="mt-4 w-full h-auto rounded-2xl object-contain bg-[#F6F1E4] border border-stone-200 dark:border-stone-700" />
                );
            })}
        </div>
    );
}

function themeFor(ders, isDark) {
    const t = DERS_THEME[ders] || { text: "text-stone-700", icon: "📚", darkText: "text-stone-300" };
    return isDark ? Object.assign({}, t, { text: t.darkText }) : t;
}

function masteryLabel(m) {
    if (m === "iyi") return { text: "İyi", cls: "bg-emerald-50 text-emerald-600" };
    if (m === "orta") return { text: "Orta", cls: "bg-amber-50 text-amber-600" };
    if (m === "zayif") return { text: "Zayıf", cls: "bg-coral-50 text-coral-600" };
    return { text: "Yeni", cls: "bg-stone-100 text-stone-500" };
}

// Tam ekran yükleme: logo animasyonu (img/loader). index.html'deki ilk ekranla aynı görünüm.
function BrandLoad(props) {
    const vid = useRef(null);
    useEffect(function () {
        var v = vid.current;
        if (!v) return;
        v.muted = true; // otomatik oynatma için sessiz olmalı
        var p = v.play && v.play();
        if (p && p.catch) p.catch(function () {});
    }, []);
    return (
        <div className="atn-loader" role="status" aria-live="polite">
            <div className="atn-loader-media" aria-hidden="true">
                <img src="img/loader/atanly-loader.jpg" alt="" width="400" height="400" />
                <video ref={vid} autoPlay muted loop playsInline preload="auto" poster="img/loader/atanly-loader.jpg">
                    <source src="img/loader/atanly-loader.webm" type="video/webm" />
                    <source src="img/loader/atanly-loader.mp4" type="video/mp4" />
                </video>
            </div>
            <p className="atn-loader-title">{props.children || "İşleminiz devam ediyor"}</p>
            <p className="atn-loader-sub">Lütfen bekleyin, yükleniyor…</p>
            <div className="atn-loader-bar" aria-hidden="true"></div>
        </div>
    );
}

function useStudent() {
    const [st, setSt] = useState(function () { return StudentStore.getState(); });
    useEffect(function () {
        return StudentStore.subscribe(function (s) { setSt(s); });
    }, []);
    return st;
}

function CookieBar() {
    var student = useStudent();
    var seen = student.consent && student.consent.bannerSeen;
    if (seen) return null;
    return (
        <div className="cookie-bar fixed left-3 right-3 z-[60] rounded-2xl bg-stone-900 text-stone-100 p-4 shadow-2xl text-sm" style={{ bottom: "calc(var(--app-tabbar-h) + 12px)" }}>
            <p className="text-xs leading-relaxed mb-3">
                Giriş ve ilerleme için zorunlu çerez / yerel depolama kullanılır. Reklam ağı yok.{" "}
                <a className="underline text-teal-300" href="yasal/cerez.html">Çerez politikası</a>
                {" · "}
                <a className="underline text-teal-300" href="yasal/aydinlatma.html">KVKK</a>
            </p>
            <button type="button" className="w-full py-2 rounded-xl bg-white text-stone-900 text-xs font-bold" onClick={function () {
                StudentStore.setConsent({ bannerSeen: true, marketing: false, analytics: false });
            }}>Tamam</button>
        </div>
    );
}

// Klavye kısayolları yazı yazılan alanda tetiklenmesin.
function isTypingTarget(el) {
    if (!el) return false;
    var tag = el.tagName || "";
    return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || !!el.isContentEditable;
}

// Mobil çizgi simgeleri (lucide-react-native ile aynı çizimler).
const LINE_ICONS = {
    pencil: '<path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/>',
    map: '<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    layers: '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>',
    timer: '<line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/>',
    book: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'
};
function LineIcon(props) {
    var sz = props.size || 20;
    return <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.sw || 2}
        strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={props.className}
        dangerouslySetInnerHTML={{ __html: LINE_ICONS[props.name] || "" }} />;
}

// Mobil AccentCard karşılığı: solda altın şerit, isteğe bağlı simge kutusu, sağda ok.
function AccentRow(props) {
    return (
        <button type="button" onClick={props.onClick} disabled={props.disabled} className={"m-row " + (props.className || "")}
            style={props.accent ? { "--m-accent": props.accent } : undefined}>
            {props.lead ? props.lead : props.icon ? <span className="m-ico"><LineIcon name={props.icon} /></span> : null}
            <span className="min-w-0 flex-1">
                <span className="m-row-title">{props.title}</span>
                {props.sub ? <span className="m-row-sub">{props.sub}</span> : null}
            </span>
            {props.aside || null}
            {props.disabled ? null : <LineIcon name="chevron" size={18} className="m-chev" />}
        </button>
    );
}

function Shell(props) {
    return (
        <div className="app-page pt-6 sm:pt-10 overflow-x-hidden">
            {props.children}
            {props.padBottom === false ? null : (
                <div aria-hidden="true" style={{ height: "calc(var(--app-tabbar-h) + 1.5rem)" }} />
            )}
        </div>
    );
}

function ThemeBtn(props) {
    return (
        <button onClick={props.onClick}
            className="p-2.5 rounded-2xl glass transition-all duration-200 hover:scale-105"
            aria-label="Tema">
            {props.isDark ? (
                <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
            ) : (
                <svg className="w-5 h-5 text-stone-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
            )}
        </button>
    );
}

function BackBtn(props) {
    var C = window.KpssBackBtn;
    if (!C) return null;
    return <C onClick={props.onClick} label={props.label} />;
}

function Confetti() {
    const [pieces, setPieces] = useState([]);
    useEffect(function () {
        const colors = ["#4f46e5", "#7c3aed", "#ec4899", "#f59e0b", "#10b981"];
        setPieces(Array.from({ length: 24 }, function (_, i) {
            return {
                id: i,
                left: Math.random() * 100 + "%",
                delay: Math.random() * 2 + "s",
                duration: (Math.random() * 2 + 2) + "s",
                color: colors[Math.floor(Math.random() * colors.length)],
                size: (Math.random() * 8 + 6) + "px"
            };
        }));
    }, []);
    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {pieces.map(function (p) {
                return (
                    <div key={p.id} className="confetti" style={{
                        left: p.left, animationDelay: p.delay, animationDuration: p.duration,
                        width: p.size, height: p.size, backgroundColor: p.color,
                        borderRadius: Math.random() > 0.5 ? "50%" : "2px"
                    }} />
                );
            })}
        </div>
    );
}

function BottomNav(props) {
    const tabs = [
        { id: "bugun", label: "Bugün", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
        { id: "dersler", label: "Dersler", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
        { id: "alistirmalar", label: "Alıştırmalar", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
        { id: "eksikler", label: "Eksikler", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
        { id: "ben", label: "Ben", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }
    ];
    return (
        <nav className="app-tabbar fixed bottom-0 inset-x-0 z-40 nav-glass" aria-label="Ana menü" style={{ paddingBottom: "max(8px, env(safe-area-inset-bottom))" }}>
            <div className="tabbar-brand" aria-hidden="true">
                {window.AtanomLogo ? window.AtanomLogo("h-9 w-9 object-contain") : null}
                <span>Atanly</span>
            </div>
            <div className="tabbar-list app-page grid grid-cols-5 pt-1 min-w-0">
                {tabs.map(function (tab) {
                    const on = props.nav === tab.id;
                    return (
                        <button key={tab.id} type="button" onClick={function () { props.onChange(tab.id); }}
                            aria-current={on ? "page" : undefined}
                            className={"relative flex flex-col items-center gap-0.5 py-2 rounded-2xl text-[10px] leading-tight font-medium transition-all duration-200 " +
                                (on ? "text-indigo-600 bg-indigo-50/60 dark:bg-indigo-900/20" : "text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200")}>
                            <span className="relative">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={on ? 2.2 : 1.7}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                                </svg>
                                {tab.id === "bugun" && props.streak > 0 ? (
                                    <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                                    </span>
                                ) : null}
                            </span>
                            <span className="label">{tab.label}</span>
                        </button>
                    );
                })}
            </div>
            {props.onSignOut ? (
                <div className="tabbar-account">
                    <span className="acc-av" aria-hidden="true">{((props.name || props.email || "?").trim().charAt(0) || "?").toLocaleUpperCase("tr-TR")}</span>
                    <span className="acc-txt">
                        <span className="acc-name">{props.name || "Hesabım"}</span>
                        {props.email ? <span className="acc-mail" title={props.email}>{props.email}</span> : null}
                    </span>
                    <button type="button" className="acc-out" onClick={props.onSignOut} aria-label="Çıkış yap" title="Çıkış yap">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                    </button>
                </div>
            ) : null}
            <div className="tabbar-keys kbd-hint" aria-hidden="true">
                <span><kbd>A</kbd>–<kbd>E</kbd> şık seç</span>
                <span><kbd>Enter</kbd> sonraki soru</span>
                <span><kbd>←</kbd><kbd>→</kbd> not çevir</span>
            </div>
        </nav>
    );
}

function Onboarding(props) {
    var profile = (props.student && props.student.profile) || {};
    var up = (props.student && props.student.userProfile) || {};
    var dates = (window.KpssConfig && window.KpssConfig.examDateByLevel) || {};
    const [name, setName] = useState(profile.name || "");
    const [level, setLevel] = useState(up.educationLevel || "lisans");
    const [target, setTarget] = useState(up.targetType || "B");
    const [examDate, setExamDate] = useState(profile.examDate || dates[up.educationLevel || "lisans"] || "2026-09-06");
    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-2xl fade-in">
                {window.AtanomLogo
                    ? window.AtanomLogo("h-16 w-16 mx-auto mb-3 object-contain")
                    : <img src="icons/atanom.png?v=18" alt="Atanly" className="h-16 w-16 mx-auto mb-3 object-contain" />}
                <h2 className="text-2xl font-black text-stone-900 dark:text-white mb-1 text-center">Atanly</h2>
                <p className="text-sm text-stone-500 mb-5 text-center">Google ile giriş yaptın. Adın ve eğitim düzeyin uygulamayı açmak için gerekli.</p>
                <label className="block text-xs font-bold text-stone-500 mb-1">Adın</label>
                <input value={name} onChange={function (e) { setName(e.target.value); }} placeholder="Adını yaz"
                    className="w-full mb-4 px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-medium" />
                <p className="text-xs font-bold text-stone-500 mb-2">Eğitim düzeyi</p>
                <div className="grid grid-cols-3 gap-2 mb-4">
                    {[{ id: "lisans", t: "Lisans" }, { id: "onlisans", t: "Ön lisans" }, { id: "ortaogretim", t: "Ortaöğretim" }].map(function (x) {
                        var on = level === x.id;
                        return (
                            <button key={x.id} type="button" onClick={function () {
                                setLevel(x.id);
                                if (dates[x.id]) setExamDate(dates[x.id]);
                            }} className={"px-2 py-2 rounded-xl border-2 text-xs font-semibold " + (on ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-stone-200")}>{x.t}</button>
                        );
                    })}
                </div>
                {level === "lisans" ? (
                    <div>
                        <p className="text-xs font-bold text-stone-500 mb-2">Kulvar</p>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {[{ id: "B", t: "B Grubu" }, { id: "A", t: "A Grubu" }, { id: "ogretmen", t: "Öğretmenlik" }, { id: "dhbt", t: "DHBT" }].map(function (x) {
                                var on = target === x.id;
                                return (
                                    <button key={x.id} type="button" onClick={function () { setTarget(x.id); }}
                                        className={"px-3 py-2 rounded-xl border-2 text-xs font-semibold " + (on ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-stone-200")}>{x.t}</button>
                                );
                            })}
                        </div>
                    </div>
                ) : null}
                <label className="block text-xs font-bold text-stone-500 mb-1">Sınav tarihi</label>
                <input type="date" value={examDate} onChange={function (e) { setExamDate(e.target.value); }}
                    className="w-full mb-4 px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-medium" />
                <p className="text-[11px] text-stone-500 leading-relaxed mb-5">
                    Başla diyerek <a className="underline font-semibold" href="yasal/kullanim.html" target="_blank" rel="noopener">Kullanım Koşulları</a> ve <a className="underline font-semibold" href="yasal/uyelik.html" target="_blank" rel="noopener">Üyelik Sözleşmesi</a>{"'ni kabul etmiş olursunuz. "}<a className="underline" href="yasal/aydinlatma.html" target="_blank" rel="noopener">KVKK Aydınlatma</a>
                </p>
                <button disabled={!name.trim()} onClick={function () {
                    StudentStore.completeOnboarding({
                        name: name.trim(),
                        nickname: name.trim(),
                        examDate: examDate,
                        dailyMinutes: 45,
                        dailyQuestions: 25,
                        educationLevel: level,
                        targetType: level === "lisans" ? target : "B",
                        kvkkConsent: true,
                        weeklyHours: 7
                    });
                    if (window.SyncEngine) window.SyncEngine.sync();
                }} className="w-full btn-primary text-white font-bold py-4 rounded-2xl disabled:opacity-40">
                    Başla
                </button>
            </div>
        </div>
    );
}

function examTrackName(level) {
    if (level === "onlisans") return "Ön lisans KPSS";
    if (level === "ortaogretim") return "Ortaöğretim KPSS";
    return "Lisans KPSS";
}

function hourOptions() {
    return [0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6];
}

function formatHours(n) {
    var x = Number(n) || 0;
    if (x === 1) return "1 saat";
    if (x === 0.5) return "30 dk";
    if (x % 1 === 0.5) return Math.floor(x) + ",5 saat";
    return x + " saat";
}

function formatSlotLine(slots, catalog) {
    var parts = [];
    (slots || []).forEach(function (s) {
        if (catalog && !catalog[s.ders]) return;
        parts.push(formatHours(s.hours) + " " + s.ders);
    });
    return parts.join(" · ");
}

function dersAccent(ders) {
    var t = DERS_THEME[ders];
    return t || { icon: "📚", accent: "#127880", pastel: "#e7f6f4" };
}

function restDayCopy() {
    var msgs = [
        "Bugün dinlenme günü ☕ Zihnini şarj et, yarın maratona devam!",
        "Mola da programın parçası. Bugün toparlan, yarın daha keskin olursun.",
        "Serbest gün. Kısa yürüyüş, su, erken uyku — yarın bloklara tam güç."
    ];
    var i = new Date().getDate() % msgs.length;
    return msgs[i];
}

// ---------- Akıllı KPSS programı (motor: js/smartPlan.js) ----------

var PLAN_ICON = { not: "📖", test: "🎯", tekrar: "🔁", zayif: "🩹", genel: "🧭", deneme: "📝" };

function planSettingsOf(student) {
    return (student.userProfile && student.userProfile.smartPlan) || null;
}

function savePlanSettings(next) {
    StudentStore.updateUserProfile({ smartPlan: next });
}

function planTaskLabel(x) {
    var SP = window.SmartPlan;
    var t = SP.taskTitle(x);
    if (x.kind === "deneme") return t;
    return t + " · " + x.ders + (x.konu ? " / " + kLabel(x.konu) : "");
}

// Görevi başlat: ilgili not / konu / deneme ekranını aç.
function runPlanTask(x, props) {
    if (x.kind === "not") props.onKonu(x.ders, x.konu, "notes");
    else if (x.kind === "test" || x.kind === "tekrar" || x.kind === "zayif") props.onKonu(x.ders, x.konu, "hub");
    else if (x.kind === "genel") props.onDers(x.ders);
    else if (x.kind === "deneme" && props.onExam) props.onExam();
}

function PlanTaskRow(props) {
    var x = props.item;
    var SP = window.SmartPlan;
    return (
        <li className={"plan-row" + (x.done ? " is-done" : "")}>
            <button type="button" className="plan-check" aria-pressed={!!x.done}
                aria-label={(x.done ? "Tamamlandı işaretini kaldır: " : "Tamamlandı olarak işaretle: ") + planTaskLabel(x)}
                onClick={function () { props.onToggle(x); }}>
                {x.done ? "✓" : ""}
            </button>
            <span className="plan-row-ico" aria-hidden="true">{PLAN_ICON[x.kind] || "•"}</span>
            <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold leading-snug">{planTaskLabel(x)}</span>
                <span className="block text-xs text-stone-500">{SP.fmtMin(x.minutes)}{x.part ? " · parça" : ""}{x.kind === "zayif" && x.pct != null ? " · son net %" + x.pct : ""}</span>
            </span>
            {!x.done && props.onStart ? (
                <button type="button" className="plan-start" onClick={function () { props.onStart(x); }}>Başla</button>
            ) : null}
        </li>
    );
}

function PlanPhaseBar(props) {
    var plan = props.plan;
    var SP = window.SmartPlan;
    var total = plan.days.length || 1;
    var seg = { ogrenme: 0, pekistirme: 0, son: 0 };
    plan.days.forEach(function (d) { seg[d.phase] += 1; });
    var startOf = {};
    plan.days.forEach(function (d) { if (!startOf[d.phase]) startOf[d.phase] = d.date; });
    return (
        <div>
            <div className="plan-phases" role="img" aria-label="Dönemler">
                {["ogrenme", "pekistirme", "son"].map(function (k) {
                    if (!seg[k]) return null;
                    return <span key={k} style={{ width: (seg[k] / total * 100) + "%", background: SP.PHASES[k].color }} />;
                })}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-stone-500">
                {["ogrenme", "pekistirme", "son"].map(function (k) {
                    if (!seg[k]) return null;
                    return (
                        <span key={k} className="inline-flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full" style={{ background: SP.PHASES[k].color }} />
                            {SP.PHASES[k].label} · {SP.fmtDate(startOf[k])}’ten {seg[k]} gün
                        </span>
                    );
                })}
            </div>
        </div>
    );
}

function SmartPlanCard(props) {
    var SP = window.SmartPlan;
    var settings = planSettingsOf(props.student);
    var plan = useMemo(function () {
        if (!SP || !settings) return null;
        return SP.generate(props.kpssData, props.student, settings);
    }, [props.kpssData, props.student, settings]);
    const [missed, setMissed] = useState(0);

    // dün planlanıp yapılmayanlar: bir kez göster, sonra bugünün listesini "görüldü" olarak kaydet
    useEffect(function () {
        if (!SP || !plan || !plan.ok) return;
        var m = SP.missedSince(settings, plan);
        if (m.changed) {
            if (m.missed) setMissed(m.missed);
            savePlanSettings(Object.assign({}, settings, { seen: m.seen }));
        }
    }, [plan && plan.today, plan && plan.ok]);

    if (!SP) return null;
    if (!settings) {
        return (
            <section className="plan-hero rounded-3xl p-6 mb-4 slide-up">
                <p className="text-xs font-bold uppercase tracking-wider opacity-80">Akıllı KPSS programı</p>
                <h2 className="text-xl sm:text-2xl font-black mt-1 leading-snug">Sınavına kadar her gün hangi konuyu çalışacağını 1 dakikada çıkar.</h2>
                <p className="text-sm opacity-85 mt-2 max-w-2xl">Sınav tarihin, boş saatlerin ve zayıf derslerine göre konu konu takvim. Bir gün kaçırırsan program kendini yeniden dağıtır.</p>
                <button type="button" onClick={props.onWizard} className="plan-hero-btn mt-4">Programımı oluştur</button>
            </section>
        );
    }
    if (!plan || !plan.ok) {
        return (
            <section className="rounded-3xl glass p-5 mb-4">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Akıllı KPSS programı</p>
                <p className="font-semibold mt-1">{plan ? plan.reason : "Program hesaplanamadı."}</p>
                <button type="button" className="quick-chip is-primary mt-3" onClick={props.onWizard}>Programı güncelle</button>
            </section>
        );
    }
    var list = SP.todayList(plan, settings);
    var doneMin = 0, allMin = 0;
    list.forEach(function (x) { allMin += x.minutes; if (x.done) doneMin += x.minutes; });
    var phase = plan.days[0] ? plan.days[0].phase : "ogrenme";
    function toggle(x) {
        var cur = planSettingsOf(StudentStore.getState()) || settings;
        savePlanSettings(x.done ? SP.unmarkDone(cur, x) : SP.markDone(cur, x));
    }
    return (
        <section className="rounded-3xl glass p-5 sm:p-6 mb-4 slide-up" aria-labelledby="plan-title">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: SP.PHASES[phase].color }}>
                        {SP.PHASES[phase].label} dönemi · sınava {plan.daysLeft} gün
                    </p>
                    <h2 id="plan-title" className="text-lg font-bold mt-0.5">Bugünkü programın</h2>
                </div>
                <div className="flex gap-2">
                    <button type="button" className="quick-chip" onClick={props.onCalendar}>📅 Takvim</button>
                    <button type="button" className="quick-chip" onClick={props.onWizard}>Düzenle</button>
                </div>
            </div>
            {missed ? (
                <p className="plan-note mt-3" role="status">Dünden kalan {missed} görev programa yeniden dağıtıldı. Sıkıntı yok, devam.</p>
            ) : null}
            {!plan.fits ? (
                <p className="plan-warn mt-3">Bu tempoyla konular sınavdan önce bitmiyor ({SP.fmtMin(plan.behindMin)} eksik). {plan.needWeekMin ? "Haftada " + SP.fmtMin(plan.needWeekMin) + " ayırabilirsen yetişir." : "Haftaya çalışma günü eklemen gerekiyor."}</p>
            ) : null}
            {list.length ? (
                <>
                    <div className="flex items-center justify-between text-xs text-stone-500 mt-4 mb-1.5">
                        <span>{SP.fmtMin(doneMin)} / {SP.fmtMin(allMin)} tamam</span>
                        <span>{list.filter(function (x) { return x.done; }).length}/{list.length} görev</span>
                    </div>
                    <div className="h-2 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500" style={{ width: (allMin ? doneMin / allMin * 100 : 0) + "%", transition: "width .3s" }} />
                    </div>
                    <ul className="mt-3 space-y-2">
                        {list.map(function (x, i) {
                            return <PlanTaskRow key={x.id + (x.done ? "-d" : "") + i} item={x} onToggle={toggle} onStart={function (t) { runPlanTask(t, props); }} />;
                        })}
                    </ul>
                </>
            ) : (
                <p className="text-sm text-stone-500 mt-3">Bugün programda dinlenme günü. Yarın {plan.days[1] && plan.days[1].items.length ? plan.days[1].items.length + " görev" : "da boş"}.</p>
            )}
        </section>
    );
}

function PlanWizard(props) {
    var SP = window.SmartPlan;
    var dersler = Object.keys(props.kpssData || {});
    var cur = planSettingsOf(props.student);
    const [step, setStep] = useState(0);
    const [s, setS] = useState(function () {
        var base = cur ? SP.normSettings(cur) : SP.defaultSettings(props.student);
        // eski haftalık programdan saatleri al
        var old = props.student.userProfile && props.student.userProfile.studyPlan;
        if (!cur && old && old.ready && old.days) {
            var ids = ["pzt", "sal", "car", "per", "cum", "cmt", "paz"];
            base.hours = ids.map(function (id) {
                var d = old.days[id];
                return d && d.on ? (StudentStore.daySlotHours ? StudentStore.daySlotHours(d) : 0) : 0;
            });
        }
        return base;
    });
    var preview = useMemo(function () {
        return step === 3 ? SP.generate(props.kpssData, props.student, s) : null;
    }, [step, s]);
    var weekH = s.hours.reduce(function (a, h) { return a + h; }, 0);
    function setHour(i, v) {
        var h = s.hours.slice();
        h[i] = Math.max(0, Math.min(12, Math.round(v * 2) / 2));
        setS(Object.assign({}, s, { hours: h }));
    }
    function preset(arr) { setS(Object.assign({}, s, { hours: arr })); }
    function toggleWeak(d) {
        var w = s.weak.indexOf(d) >= 0 ? s.weak.filter(function (x) { return x !== d; }) : s.weak.concat([d]);
        setS(Object.assign({}, s, { weak: w }));
    }
    function save() {
        var next = Object.assign({}, s, { createdAt: (cur && cur.createdAt) || new Date().toISOString(), seen: null });
        StudentStore.updateUserProfile({ smartPlan: next, studyPlan: SP.legacyStudyPlan(next) });
        if (s.examDate) StudentStore.updateProfile({ examDate: s.examDate });
        props.onDone();
    }
    var canNext = step === 0 ? (s.examDate && s.examDate > SP.todayIso()) : step === 1 ? weekH > 0 : true;
    var steps = ["Sınav tarihi", "Boş saatler", "Zayıf dersler", "Önizleme"];
    return (
        <div className="fixed inset-0 z-[70] bg-black/45 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="wiz-title">
            <div className="w-full max-w-xl max-h-[92vh] overflow-y-auto bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-7 shadow-2xl fade-in">
                <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">Adım {step + 1} / 4 · {steps[step]}</p>
                    <button type="button" className="text-sm text-stone-500 px-2 py-1" onClick={props.onClose} aria-label="Kapat">✕</button>
                </div>
                <div className="flex gap-1.5 mt-2 mb-5" aria-hidden="true">
                    {steps.map(function (_t, i) { return <span key={i} className={"h-1.5 flex-1 rounded-full " + (i <= step ? "bg-teal-600" : "bg-stone-200 dark:bg-stone-700")} />; })}
                </div>

                {step === 0 ? (
                    <div>
                        <h2 id="wiz-title" className="text-xl font-black">Sınavın ne zaman?</h2>
                        <p className="text-sm text-stone-500 mt-1">ÖSYM takvimindeki sınav gününü seç. Program bu güne kadar gün gün hazırlanır.</p>
                        <input type="date" value={s.examDate} min={SP.addDays(SP.todayIso(), 7)}
                            onChange={function (e) { setS(Object.assign({}, s, { examDate: e.target.value })); }}
                            className="w-full mt-4 px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-base" />
                        {s.examDate && s.examDate > SP.todayIso() ? (
                            <p className="text-sm font-semibold text-teal-700 dark:text-teal-300 mt-3">Sınava {SP.diffDays(SP.todayIso(), s.examDate)} gün var.</p>
                        ) : <p className="text-xs text-stone-500 mt-3">Tarih henüz açıklanmadıysa tahmini bir tarih seç; sonra değiştirebilirsin.</p>}
                    </div>
                ) : null}

                {step === 1 ? (
                    <div>
                        <h2 id="wiz-title" className="text-xl font-black">Hangi gün kaç saat çalışabilirsin?</h2>
                        <p className="text-sm text-stone-500 mt-1">Gerçekçi ol: program sürdürülebilir olursa işe yarar. Haftalık toplam: <b>{weekH} saat</b></p>
                        <div className="flex flex-wrap gap-2 mt-3">
                            <button type="button" className="quick-chip" onClick={function () { preset([1, 1, 1, 1, 1, 2, 0]); }}>Hafif (7 sa)</button>
                            <button type="button" className="quick-chip" onClick={function () { preset([2, 2, 2, 2, 2, 4, 0]); }}>Dengeli (14 sa)</button>
                            <button type="button" className="quick-chip" onClick={function () { preset([3, 3, 3, 3, 3, 5, 3]); }}>Yoğun (23 sa)</button>
                            <button type="button" className="quick-chip" onClick={function () { preset([0, 0, 0, 0, 0, 5, 5]); }}>Hafta sonu (10 sa)</button>
                        </div>
                        <ul className="mt-4 space-y-2">
                            {SP.DAY_FULL.map(function (d, i) {
                                return (
                                    <li key={d} className="flex items-center gap-3">
                                        <span className="w-24 text-sm font-semibold">{d}</span>
                                        <button type="button" className="step-btn" aria-label={d + " yarım saat azalt"} onClick={function () { setHour(i, s.hours[i] - 0.5); }}>−</button>
                                        <span className="w-16 text-center font-stat font-bold" aria-live="polite">{s.hours[i] ? s.hours[i] + " sa" : "boş"}</span>
                                        <button type="button" className="step-btn" aria-label={d + " yarım saat artır"} onClick={function () { setHour(i, s.hours[i] + 0.5); }}>+</button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ) : null}

                {step === 2 ? (
                    <div>
                        <h2 id="wiz-title" className="text-xl font-black">Hangi derslerde zorlanıyorsun?</h2>
                        <p className="text-sm text-stone-500 mt-1">Seçtiğin derslere daha çok zaman ayrılır. Hiçbirini seçmeden de geçebilirsin; dağılım ÖSYM soru sayılarına göre yapılır.</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {dersler.map(function (d) {
                                var on = s.weak.indexOf(d) >= 0;
                                return <button key={d} type="button" aria-pressed={on} className={"quick-chip" + (on ? " is-primary" : "")} onClick={function () { toggleWeak(d); }}>{on ? "✓ " : ""}{d}</button>;
                            })}
                        </div>
                    </div>
                ) : null}

                {step === 3 && preview ? (
                    <div>
                        <h2 id="wiz-title" className="text-xl font-black">Programın hazır</h2>
                        {preview.ok ? (
                            <>
                                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                                    <div className="rounded-2xl bg-stone-100 dark:bg-stone-800 p-3"><div className="font-stat text-xl font-bold">{preview.daysLeft}</div><div className="text-[11px] text-stone-500">gün</div></div>
                                    <div className="rounded-2xl bg-stone-100 dark:bg-stone-800 p-3"><div className="font-stat text-xl font-bold">{SP.fmtMin(preview.weekMin)}</div><div className="text-[11px] text-stone-500">haftada</div></div>
                                    <div className="rounded-2xl bg-stone-100 dark:bg-stone-800 p-3"><div className="font-stat text-xl font-bold">{SP.fmtMin(preview.learnTotal)}</div><div className="text-[11px] text-stone-500">konu çalışması</div></div>
                                </div>
                                <div className="mt-4"><PlanPhaseBar plan={preview} /></div>
                                {preview.fits ? (
                                    <p className="plan-ok mt-4">Yetişiyor: konular {SP.fmtDate(preview.learnDoneOn || preview.finalStart)} civarı biter, sonrası tekrar ve deneme.</p>
                                ) : (
                                    <p className="plan-warn mt-4">Bu saatlerle konular son döneme kadar bitmiyor ({SP.fmtMin(preview.behindMin)} eksik). {preview.needWeekMin ? "Haftada en az " + SP.fmtMin(preview.needWeekMin) + " öneririz" : "Haftaya çalışma günü eklemeni öneririz"}; yine de kaydedebilirsin.</p>
                                )}
                                <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mt-5 mb-2">İlk gün</p>
                                <ul className="space-y-1.5">
                                    {(preview.days.find(function (d) { return d.items.length; }) || { items: [] }).items.map(function (x, i) {
                                        return <li key={i} className="text-sm flex gap-2"><span aria-hidden="true">{PLAN_ICON[x.kind]}</span><span className="min-w-0">{planTaskLabel(x)} <span className="text-stone-500">· {SP.fmtMin(x.minutes)}</span></span></li>;
                                    })}
                                </ul>
                            </>
                        ) : <p className="plan-warn mt-4">{preview.reason}</p>}
                    </div>
                ) : null}

                <div className="flex justify-between gap-3 mt-7">
                    <button type="button" className="quick-chip" onClick={function () { if (step) setStep(step - 1); else props.onClose(); }}>{step ? "← Geri" : "Vazgeç"}</button>
                    {step < 3 ? (
                        <button type="button" className="quick-chip is-primary" disabled={!canNext} onClick={function () { setStep(step + 1); }}>Devam →</button>
                    ) : (
                        <button type="button" className="quick-chip is-primary" disabled={!preview || !preview.ok} onClick={save}>Programı kaydet</button>
                    )}
                </div>
            </div>
        </div>
    );
}

var DASH_COLORS = ["#4f46e5", "#7c3aed", "#ec4899", "#f59e0b", "#10b981", "#6366f1"];

// Paylaşım görseli (1080x1350): bu haftanın programı ve dönemler.
// Program görseli: çizim js/shareCard.js'te (mobil de aynı kodu kullanır).
function drawPlanImage(plan, name) {
    return window.ShareCard.drawPlan(window.SmartPlan.imageModel(plan, name));
}

function PlanCalendar(props) {
    var SP = window.SmartPlan;
    var settings = planSettingsOf(props.student);
    var plan = useMemo(function () { return settings ? SP.generate(props.kpssData, props.student, settings) : null; }, [props.kpssData, props.student, settings]);
    const [weeks, setWeeks] = useState(4);
    const [msg, setMsg] = useState("");
    if (!plan || !plan.ok) {
        return (
            <Shell>
                <BackBtn onClick={props.onBack} label="Bugün" />
                <p className="mt-8 text-stone-500">{plan ? plan.reason : "Önce programını oluştur."}</p>
            </Shell>
        );
    }
    // günleri haftalara böl (Pazartesi başlangıçlı)
    var groups = [];
    plan.days.forEach(function (d) {
        if (!groups.length || d.weekday === 0) groups.push([]);
        groups[groups.length - 1].push(d);
    });
    var shown = groups.slice(0, weeks);
    var doneIds = {};
    SP.doneOn(settings, plan.today).forEach(function (x) { doneIds[x.id] = true; });

    function print() {
        setWeeks(groups.length);
        setTimeout(function () { window.print(); }, 350);
    }
    function shareImage() {
        var c = drawPlanImage(plan, props.student.profile && props.student.profile.name);
        c.toBlob(function (blob) {
            if (!blob) return;
            var file = typeof File !== "undefined" ? new File([blob], "kpss-programim.png", { type: "image/png" }) : null;
            if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
                navigator.share({ files: [file], title: "KPSS programım", text: "Kendi programını oluştur: https://www.atanly.com" }).catch(function () {});
                return;
            }
            var a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "kpss-programim.png";
            document.body.appendChild(a); a.click(); a.remove();
            setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
            setMsg("Görsel indirildi: kpss-programim.png");
        }, "image/png");
    }
    return (
        <Shell>
            <div className="flex justify-between items-center mb-4 gap-3 no-print">
                <BackBtn onClick={props.onBack} label="Bugün" />
                <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
            </div>
            <header className="mb-5">
                <h1 className="m-title">KPSS programım</h1>
                <p className="text-sm text-stone-500 mt-1">
                    {(props.student.profile && props.student.profile.name) ? props.student.profile.name + " · " : ""}
                    Sınav {SP.fmtDate(plan.exam)} · {plan.daysLeft} gün · haftada {SP.fmtMin(plan.weekMin)}
                </p>
                <div className="mt-4"><PlanPhaseBar plan={plan} /></div>
                {!plan.fits ? <p className="plan-warn mt-3">Bu tempoyla {SP.fmtMin(plan.behindMin)} konu çalışması son döneme yetişmiyor. {plan.needWeekMin ? "Haftada " + SP.fmtMin(plan.needWeekMin) + " önerilir." : "Haftaya çalışma günü eklemen önerilir."}</p> : null}
                <div className="flex flex-wrap gap-2 mt-4 no-print">
                    <button type="button" className="quick-chip is-primary" onClick={print}>🖨 Yazdır / PDF</button>
                    <button type="button" className="quick-chip" onClick={shareImage}>📤 Paylaşım görseli</button>
                    <button type="button" className="quick-chip" onClick={props.onWizard}>Düzenle</button>
                </div>
                {msg ? <p className="text-xs text-emerald-700 mt-2 no-print" role="status">{msg}</p> : null}
            </header>
            <div className="space-y-6">
                {shown.map(function (g, gi) {
                    var mins = g.reduce(function (a, d) { return a + d.minutes; }, 0);
                    return (
                        <section key={gi} className="plan-week">
                            <h2 className="text-sm font-bold text-stone-500 mb-2">
                                {SP.fmtDate(g[0].date)} – {SP.fmtDate(g[g.length - 1].date)} · {SP.fmtMin(mins)}
                            </h2>
                            <div className="plan-week-grid">
                                {g.map(function (d) {
                                    var isToday = d.date === plan.today;
                                    return (
                                        <article key={d.date} className={"plan-day" + (isToday ? " is-today" : "")} style={{ borderTopColor: SP.PHASES[d.phase].color }}>
                                            <p className="plan-day-head">
                                                <b>{SP.DAY_SHORT[d.weekday]} {SP.fmtDate(d.date)}</b>
                                                {isToday ? <span className="plan-today-pill">bugün</span> : null}
                                            </p>
                                            {d.items.length ? (
                                                <ul className="space-y-1.5">
                                                    {d.items.map(function (x, i) {
                                                        return (
                                                            <li key={i} className={"plan-day-item" + (isToday && doneIds[x.id] ? " is-done" : "")}>
                                                                <span aria-hidden="true">{PLAN_ICON[x.kind]}</span>
                                                                <span className="min-w-0">
                                                                    <span className="block font-semibold">{SP.taskTitle(x)}</span>
                                                                    <span className="block text-stone-500">{x.ders ? x.ders + (x.konu ? " / " + kLabel(x.konu) : "") + " · " : ""}{SP.fmtMin(x.minutes)}</span>
                                                                </span>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            ) : <p className="text-xs text-stone-400">Dinlenme</p>}
                                        </article>
                                    );
                                })}
                            </div>
                        </section>
                    );
                })}
            </div>
            {weeks < groups.length ? (
                <div className="text-center mt-6 no-print">
                    <button type="button" className="quick-chip" onClick={function () { setWeeks(weeks + 8); }}>Sonraki 8 haftayı göster ({groups.length - weeks} hafta kaldı)</button>
                </div>
            ) : null}
        </Shell>
    );
}

function StudyDash(props) {
    const d = StudyPlanner.studyDashboard ? StudyPlanner.studyDashboard(props.student) : null;
    const [pickDay, setPickDay] = useState(null);
    const [hoverWeek, setHoverWeek] = useState(null);
    if (!d) return (
        <div className="rounded-2xl glass p-6 text-center text-stone-400 text-sm slide-up">
            Çalışmaya başlayınca istatistikler burada görünecek.
        </div>
    );

    var weekMax = 1;
    d.weekMin.forEach(function (v) { if (v > weekMax) weekMax = v; });
    var trendMax = 1;
    d.weeks.forEach(function (w) { if (w.minutes > trendMax) trendMax = w.minutes; });
    var pts = d.weeks.map(function (w, i) {
        var x = 8 + (i / Math.max(1, d.weeks.length - 1)) * 220;
        var y = 78 - (w.minutes / trendMax) * 64;
        return x + "," + y;
    }).join(" ");
    var area = "8,78 " + pts + " 228,78";
    var weekGoalPct = d.plannedWeek ? Math.min(100, Math.round((d.actualWeekH / d.plannedWeek) * 100)) : (d.actualWeekH ? 100 : 0);
    var todayGoal = d.todayPlanH;
    var todayH = Math.round((d.todayMin / 60) * 10) / 10;
    var todayPct = todayGoal ? Math.min(100, Math.round((todayH / todayGoal) * 100)) : (todayH ? 100 : 0);
    var rec = d.longest.minutes ? (Math.round((d.longest.minutes / 60) * 10) / 10 + " saat") : "—";
    var dayNames = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
    var dayFull = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
    // bu haftanın günleri (Pzt başlangıçlı) ve her günün soru / doğru sayısı
    var todayIso = StudentStore.todayStr();
    var todayIdx = (new Date(todayIso + "T12:00:00").getDay() + 6) % 7;
    var weekIso = dayNames.map(function (_n, i) { return StudentStore.addDays(todayIso, i - todayIdx); });
    var weekQ = weekIso.map(function (iso) { var x = (props.student.sessions || {})[iso] || {}; return { q: x.questions || 0, c: x.correct || 0 }; });
    var selDay = pickDay == null ? todayIdx : pickDay;
    var lastW = d.weeks[d.weeks.length - 1] || { minutes: 0 };
    var prevW = d.weeks[d.weeks.length - 2] || { minutes: 0 };
    var wDelta = prevW.minutes ? Math.round(((lastW.minutes - prevW.minutes) / prevW.minutes) * 100) : null;
    var circ = 2 * Math.PI * 28;
    var donutEls = [];
    var donutOff = 0;
    d.dersList.forEach(function (x, i) {
        var dash = circ * (x.v / d.dersSum);
        donutEls.push({ ders: x.ders, dash: dash, off: donutOff, color: DASH_COLORS[i % DASH_COLORS.length] });
        donutOff += dash;
    });

    return (
        <div className="space-y-4 slide-up">
            <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">📊 İstatistikler</span>
                <span className="h-px flex-1 bg-stone-200 dark:bg-stone-700"></span>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl glass p-4 text-center card-hover">
                    <div className="font-stat text-2xl font-bold text-indigo-600">{d.streak}</div>
                    <div className="text-[11px] text-stone-500 mt-0.5">🔥 seri gün</div>
                </div>
                <div className="rounded-2xl glass p-4 text-center card-hover">
                    <div className="font-stat text-2xl font-bold text-amber-600">{d.avgSeansMin || "—"}</div>
                    <div className="text-[11px] text-stone-500 mt-0.5">⏱ dk / oturum</div>
                </div>
                <div className="rounded-2xl glass p-4 text-center card-hover">
                    <div className="font-stat text-2xl font-bold text-emerald-600">{rec}</div>
                    <div className="text-[11px] text-stone-500 mt-0.5">🏆 rekor gün</div>
                </div>
            </div>

            <div className="rounded-2xl glass p-5 card-hover">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold">Toplam {d.totalHours} saat</span>
                    <span className="text-xs text-stone-400">Bu hafta {d.actualWeekH}/{d.plannedWeek || 0} sa</span>
                </div>
                <div className="h-2.5 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: weekGoalPct + "%" }} />
                </div>
                <div className="flex justify-between items-center mt-3">
                    <span className="text-sm font-medium">Bugün {todayH} / {todayGoal || 0} saat</span>
                    <span className="text-xs font-bold text-indigo-600">{todayPct}%</span>
                </div>
                <div className="h-2 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500" style={{ width: todayPct + "%" }} />
                </div>
            </div>

            <div className="rounded-2xl glass p-5 card-hover">
                <div className="flex items-baseline justify-between gap-2 mb-3">
                    <p className="text-sm font-semibold">📈 Haftalık trend</p>
                    <span className="text-xs text-stone-500">
                        {hoverWeek != null
                            ? (d.weeks[hoverWeek].label + " haftası: " + d.weeks[hoverWeek].minutes + " dk")
                            : (wDelta == null ? ("Bu hafta " + lastW.minutes + " dk") : ("Bu hafta " + lastW.minutes + " dk · geçen haftaya göre " + (wDelta >= 0 ? "+" : "") + wDelta + "%"))}
                    </span>
                </div>
                <svg viewBox="0 0 236 86" className="w-full h-24" onMouseLeave={function () { setHoverWeek(null); }}>
                    <polyline fill="rgba(79,70,229,0.12)" points={area} />
                    <polyline fill="none" stroke="#4f46e5" strokeWidth="2.5" points={pts} strokeLinecap="round" strokeLinejoin="round" />
                    {d.weeks.map(function (w, i) {
                        var x = 8 + (i / Math.max(1, d.weeks.length - 1)) * 220;
                        var y = 78 - (w.minutes / trendMax) * 64;
                        var on = hoverWeek === i;
                        return (
                            <g key={i} onMouseEnter={function () { setHoverWeek(i); }} onClick={function () { setHoverWeek(i); }} style={{ cursor: "pointer" }}>
                                <rect x={x - 13} y="0" width="26" height="86" fill="transparent" />
                                <circle cx={x} cy={y} r={on ? 4.5 : 2.6} fill={on ? "#4f46e5" : "#fff"} stroke="#4f46e5" strokeWidth="1.6" />
                                <title>{w.label + " haftası: " + w.minutes + " dk"}</title>
                            </g>
                        );
                    })}
                </svg>
                <div className="flex justify-between text-[10px] text-stone-400 -mt-1">
                    <span>8 hafta önce</span>
                    <span>bu hafta</span>
                </div>
            </div>

            <div className="rounded-2xl glass p-5 card-hover">
                <p className="text-sm font-semibold mb-3">📅 Bu hafta</p>
                <div className="flex items-end gap-1.5 h-28" role="group" aria-label="Bu haftanın günleri">
                    {d.weekMin.map(function (m, i) {
                        var h = Math.max(6, Math.round((m / weekMax) * 92));
                        var on = i === selDay;
                        var future = i > todayIdx;
                        return (
                            <button key={i} type="button" onClick={function () { setPickDay(i); }} aria-pressed={on}
                                aria-label={dayFull[i] + ": " + m + " dakika, " + weekQ[i].q + " soru"}
                                className="week-bar flex-1 flex flex-col items-center justify-end h-full">
                                <span className="block w-full rounded-t-lg transition-all duration-300"
                                    style={{ height: h + "%", background: on ? "#4f46e5" : (future ? "#e7e5e4" : "#a5b4fc") }} />
                                <span className={"text-[10px] mt-1.5 " + (i === todayIdx ? "font-black text-indigo-600" : "font-medium text-stone-400")}>{dayNames[i]}</span>
                            </button>
                        );
                    })}
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-3" aria-live="polite">
                    <b>{dayFull[selDay]}{selDay === todayIdx ? " (bugün)" : ""}:</b>{" "}
                    {d.weekMin[selDay]} dk · {weekQ[selDay].q} soru
                    {weekQ[selDay].q ? (" · %" + Math.round((weekQ[selDay].c / weekQ[selDay].q) * 100) + " doğru") : ""}
                </p>
            </div>

            <div className="rounded-2xl glass p-5 card-hover">
                <p className="text-sm font-semibold mb-3">📚 Ders dağılımı</p>
                {d.dersSum ? (
                    <div className="flex items-center gap-6 flex-wrap">
                        <svg width="100" height="100" viewBox="0 0 88 88" className="shrink-0">
                            <circle cx="44" cy="44" r="28" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                            {donutEls.map(function (x) {
                                return (
                                    <circle key={x.ders} cx="44" cy="44" r="28" fill="none" stroke={x.color} strokeWidth="12"
                                        strokeDasharray={x.dash + " " + (circ - x.dash)} strokeDashoffset={-x.off} transform="rotate(-90 44 44)"
                                        className="transition-all duration-500" />
                                );
                            })}
                        </svg>
                        <div className="min-w-0 space-y-1.5 flex-1">
                            {d.dersList.slice(0, 5).map(function (x, i) {
                                var pct = Math.round((x.v / d.dersSum) * 100);
                                return (
                                    <button key={x.ders} type="button" title={x.ders + " sayfasını aç"}
                                        onClick={function () { if (props.onDers) props.onDers(x.ders); }}
                                        className="ders-row w-full text-left flex items-center gap-2 rounded-lg px-1.5 py-1">
                                        <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: DASH_COLORS[i % DASH_COLORS.length] }} />
                                        <span className="text-xs truncate flex-1">{x.ders}</span>
                                        <span className="text-xs font-bold text-stone-400">{pct}%</span>
                                        <span className="w-12 h-1.5 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                                            <span className="block h-full rounded-full" style={{ width: pct + "%", background: DASH_COLORS[i % DASH_COLORS.length] }} />
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-stone-400">Ders saati birikince pasta dolacak.</p>
                )}
            </div>
        </div>
    );
}

// ---------- Bugün: etkileşimli çalışma araçları ----------

var TASK_ICON = { notes: "📖", test: "🎯", review: "🔁", wrong: "🩹" };

function NextSteps(props) {
    var plan = props.plan;
    var tasks = plan.tasks || [];
    function run(t) {
        if (t.kind === "notes") props.onKonu(t.ders, t.konu, "notes");
        else if (t.kind === "test") props.onKonu(t.ders, t.konu, "hub");
        else if (t.kind === "review") props.onReview();
        else if (t.kind === "wrong") props.onWrong();
    }
    return (
        <section className="rounded-3xl glass p-5 sm:p-6 mb-4 slide-up" aria-labelledby="next-steps-title">
            <div className="flex items-start justify-between gap-3 mb-1">
                <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">Şimdi ne çalışayım?</p>
                    <h2 id="next-steps-title" className="text-lg font-bold text-stone-900 dark:text-stone-100 mt-0.5 leading-snug">{plan.coach}</h2>
                </div>
            </div>
            {tasks.length ? (
                <ol className="mt-4 space-y-2">
                    {tasks.map(function (t, i) {
                        return (
                            <li key={t.id}>
                                <button type="button" onClick={function () { run(t); }}
                                    className={"next-step w-full text-left rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 transition-all " + (i === 0 ? "is-first" : "")}>
                                    <span className="next-step-ico shrink-0" aria-hidden="true">{TASK_ICON[t.kind] || "•"}</span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block font-semibold text-[15px] leading-snug">{t.title}<span className="font-normal opacity-70"> · {t.detail}</span></span>
                                        <span className="block text-xs mt-0.5 opacity-70 leading-snug">{t.why}</span>
                                    </span>
                                    <span className="next-step-go shrink-0" aria-hidden="true">{i === 0 ? "Başla" : "→"}</span>
                                </button>
                            </li>
                        );
                    })}
                </ol>
            ) : (
                <p className="text-sm text-stone-500 mt-3">Bekleyen görev yok. Karışık soruyla tempoyu koru.</p>
            )}
            <div className="flex flex-wrap gap-2 mt-4">
                <button type="button" onClick={props.onMixed} className="quick-chip">🎲 Karışık 10 soru</button>
                {props.onDeneme ? <button type="button" onClick={props.onDeneme} className="quick-chip">📝 Deneme</button> : null}
                <button type="button" onClick={props.onReview} disabled={!plan.due.length} className="quick-chip">🔁 Tekrar ({plan.due.length})</button>
                <button type="button" onClick={props.onWrong} disabled={!plan.wrong.length} className="quick-chip">🩹 Yanlışlar ({plan.wrong.length})</button>
            </div>
        </section>
    );
}

function DailyGoal(props) {
    var student = props.student;
    var sess = (student.sessions || {})[StudentStore.todayStr()] || {};
    var goal = Number(student.profile && student.profile.dailyQuestions) || 25;
    var done = sess.questions || 0;
    var correct = sess.correct || 0;
    var minutes = sess.minutes || 0;
    var pct = Math.min(1, done / goal);
    var R = 42;
    var C = 2 * Math.PI * R;
    function setGoal(v) {
        v = Math.max(5, Math.min(300, v));
        if (v !== goal) StudentStore.updateProfile({ dailyQuestions: v });
    }
    var left = Math.max(0, goal - done);
    return (
        <section className="rounded-3xl glass p-5 flex items-center gap-5" aria-label="Günlük soru hedefi">
            <div className="relative shrink-0" style={{ width: 104, height: 104 }}>
                <svg viewBox="0 0 104 104" width="104" height="104" role="img" aria-label={done + " / " + goal + " soru"}>
                    <circle cx="52" cy="52" r={R} fill="none" stroke="currentColor" strokeWidth="10" className="text-stone-200 dark:text-stone-700" />
                    <circle cx="52" cy="52" r={R} fill="none" stroke={pct >= 1 ? "#059669" : "#4f46e5"} strokeWidth="10" strokeLinecap="round"
                        strokeDasharray={(C * pct) + " " + C} transform="rotate(-90 52 52)" style={{ transition: "stroke-dasharray .5s ease" }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-stat text-2xl font-bold leading-none">{done}</span>
                    <span className="text-[11px] text-stone-400 mt-0.5">/ {goal} soru</span>
                </div>
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Günlük hedef</p>
                <p className="font-semibold mt-0.5">{left ? ("Hedefe " + left + " soru kaldı") : "Bugünkü hedef tamam 🎉"}</p>
                <p className="text-xs text-stone-500 mt-1">{correct} doğru{done ? " (%" + Math.round((correct / done) * 100) + ")" : ""} · {minutes} dk çalışma</p>
                <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs text-stone-500">Hedef</span>
                    <button type="button" className="step-btn" aria-label="Hedefi 5 azalt" onClick={function () { setGoal(goal - 5); }}>−</button>
                    <span className="font-stat font-bold w-8 text-center" aria-live="polite">{goal}</span>
                    <button type="button" className="step-btn" aria-label="Hedefi 5 artır" onClick={function () { setGoal(goal + 5); }}>+</button>
                </div>
            </div>
        </section>
    );
}

var FOCUS_KEY = "kpss-focus-timer";
function readFocus() {
    try { return JSON.parse(localStorage.getItem(FOCUS_KEY) || "null"); } catch (e) { return null; }
}
function writeFocus(v) {
    try { if (v) localStorage.setItem(FOCUS_KEY, JSON.stringify(v)); else localStorage.removeItem(FOCUS_KEY); } catch (e) {}
}
function focusElapsed(f, now) {
    if (!f) return 0;
    return (f.acc || 0) + (f.runningSince ? Math.max(0, now - f.runningSince) : 0);
}
function chime() {
    try {
        var Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        var ctx = new Ctx();
        [0, 0.22, 0.44].forEach(function (t, i) {
            var o = ctx.createOscillator(), g = ctx.createGain();
            o.frequency.value = [660, 880, 990][i];
            g.gain.setValueAtTime(0.0001, ctx.currentTime + t);
            g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + t + 0.02);
            g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.35);
            o.connect(g); g.connect(ctx.destination);
            o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + 0.4);
        });
    } catch (e) {}
}

// Pomodoro: süre bitince ya da erken bitirince dakikalar istatistiğe "oturum" olarak yazılır.
// Durum localStorage'da tutulur; başka sayfaya geçip dönünce sayaç kaldığı yerden sürer.
function FocusTimer(props) {
    const [f, setF] = useState(readFocus);
    const [now, setNow] = useState(Date.now());
    const [ders, setDers] = useState((readFocus() || {}).ders || "");
    const [msg, setMsg] = useState("");
    var dersler = Object.keys(props.kpssData || {});
    var durMs = f ? f.minutes * 60000 : 0;
    var el = focusElapsed(f, now);
    var leftMs = f ? Math.max(0, durMs - el) : 0;

    function record(ms, auto) {
        var mins = Math.round(ms / 60000);
        if (mins >= 1) {
            StudentStore.addSessionStats({ minutes: mins, seans: true, ders: (f && f.ders) || null });
            setMsg((auto ? "Süre doldu! " : "") + mins + " dk çalışma kaydedildi.");
        } else {
            setMsg("1 dakikadan kısa oturum kaydedilmedi.");
        }
        writeFocus(null);
        setF(null);
    }

    useEffect(function () {
        if (!f || !f.runningSince) return;
        var id = setInterval(function () { setNow(Date.now()); }, 1000);
        return function () { clearInterval(id); };
    }, [f]);

    useEffect(function () {
        if (f && f.runningSince && leftMs <= 0) {
            chime();
            if (window.NotificationEngine && window.NotificationEngine.showLocal) {
                try { window.NotificationEngine.showLocal("Atanly", "Odak süresi bitti. Kısa bir mola ver."); } catch (e) {}
            }
            record(durMs, true);
        }
    }, [leftMs, f]);

    // sekme başlığında kalan süre
    useEffect(function () {
        var base = document.title.replace(/^\(\d+:\d\d\) /, "");
        if (f && f.runningSince) {
            var m = Math.floor(leftMs / 60000), s = Math.floor((leftMs % 60000) / 1000);
            document.title = "(" + m + ":" + String(s).padStart(2, "0") + ") " + base;
        } else document.title = base;
        return function () { document.title = document.title.replace(/^\(\d+:\d\d\) /, ""); };
    }, [leftMs, f]);

    function start(minutes) {
        var next = { minutes: minutes, acc: 0, runningSince: Date.now(), ders: ders || null };
        writeFocus(next); setF(next); setNow(Date.now()); setMsg("");
    }
    function pause() {
        var t = Date.now();
        var next = Object.assign({}, f, { acc: focusElapsed(f, t), runningSince: null });
        writeFocus(next); setF(next); setNow(t);
    }
    function resume() {
        var next = Object.assign({}, f, { runningSince: Date.now() });
        writeFocus(next); setF(next); setNow(Date.now());
    }

    var mm = Math.floor(leftMs / 60000), ss = Math.floor((leftMs % 60000) / 1000);
    var pct = f ? Math.min(1, el / durMs) : 0;
    return (
        <section className="rounded-3xl glass p-5" aria-label="Odak sayacı">
            <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-400">⏱ Odak sayacı</p>
                {f ? <span className="text-xs text-stone-500">{f.ders ? f.ders + " · " : ""}{f.minutes} dk</span> : null}
            </div>
            {f ? (
                <div className="mt-3">
                    <div className="font-stat text-4xl font-bold tracking-tight" aria-live="off">{mm}:{String(ss).padStart(2, "0")}</div>
                    <div className="h-2 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden mt-3">
                        <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500" style={{ width: (pct * 100) + "%", transition: "width 1s linear" }} />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {f.runningSince
                            ? <button type="button" className="quick-chip" onClick={pause}>⏸ Duraklat</button>
                            : <button type="button" className="quick-chip is-primary" onClick={resume}>▶ Devam et</button>}
                        <button type="button" className="quick-chip" onClick={function () { record(focusElapsed(f, Date.now()), false); }}>✓ Bitir ve kaydet</button>
                        <button type="button" className="quick-chip" onClick={function () { writeFocus(null); setF(null); setMsg("Oturum iptal edildi."); }}>Vazgeç</button>
                    </div>
                </div>
            ) : (
                <div className="mt-3">
                    <label className="text-xs text-stone-500 block mb-1" htmlFor="focus-ders">Ders (isteğe bağlı)</label>
                    <select id="focus-ders" value={ders} onChange={function (e) { setDers(e.target.value); }}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-sm">
                        <option value="">Ders seçmeden</option>
                        {dersler.map(function (d) { return <option key={d} value={d}>{d}</option>; })}
                    </select>
                    <div className="flex flex-wrap gap-2 mt-3">
                        {[25, 45, 60].map(function (m) {
                            return <button key={m} type="button" className={"quick-chip" + (m === 25 ? " is-primary" : "")} onClick={function () { start(m); }}>▶ {m} dk</button>;
                        })}
                    </div>
                    <p className="text-xs text-stone-500 mt-3">Süre dolunca çalışma dakikan ve oturumun istatistiklere eklenir.</p>
                </div>
            )}
            {msg ? <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-3" role="status">{msg}</p> : null}
        </section>
    );
}

function WeakTopics(props) {
    // Önce net düşük (%85 altı) test edilmiş konular; hiç test yoksa sıradaki başlanmamış konular.
    var rows = (props.plan.rows || []).filter(function (r) { return r.soruSayisi > 0; });
    var tested = rows.filter(function (r) { return r.lastPct != null && r.lastPct < 85; })
        .sort(function (a, b) { return a.lastPct - b.lastPct; });
    var list = tested.length ? tested.slice(0, 5) : rows.filter(function (r) { return r.lastPct == null; }).slice(0, 3);
    if (!list.length) return null;
    return (
        <section className="rounded-3xl glass p-5" aria-labelledby="weak-title">
            <p id="weak-title" className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">{tested.length ? "🎯 Önce bunları güçlendir" : "🎯 Sıradaki konular"}</p>
            <ul className="space-y-2">
                {list.map(function (r) {
                    var pct = r.lastPct;
                    var col = pct == null ? "#a8a29e" : pct < 50 ? "#e11d48" : pct < 75 ? "#d97706" : "#059669";
                    return (
                        <li key={r.ders + "|" + r.konu}>
                            <button type="button" onClick={function () { props.onKonu(r.ders, r.konu, "hub"); }}
                                className="weak-row w-full text-left rounded-2xl p-3 flex items-center gap-3">
                                <span className="min-w-0 flex-1">
                                    <span className="block text-sm font-semibold truncate">{kLabel(r.konu)}</span>
                                    <span className="block text-xs text-stone-500">{r.ders} · {pct == null ? "henüz test yok" : "son net %" + pct}</span>
                                    <span className="block h-1.5 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden mt-1.5">
                                        <span className="block h-full rounded-full" style={{ width: (pct == null ? 4 : Math.max(4, pct)) + "%", background: col }} />
                                    </span>
                                </span>
                                <span className="text-xs font-bold text-teal-700 dark:text-teal-300 shrink-0">Çalış →</span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

// ---------- Canlı deneme kartı (Bugün ve Canlı deneme ekranı) ----------
// Aşamalar sunucu saatine göre: js/liveExam.js phase(); kurallar supabase/patch-live-exam.sql
function liveKonuHasContent(kpssData, ders, konu) {
    var kd = kpssData && kpssData[ders] && kpssData[ders][konu];
    return !!(kd && (((kd.notlar || []).length) || ((kd.sorular || []).length)));
}

function LiveExamCard(props) {
    var L = window.LiveExam, C = window.LiveClient;
    var track = C ? C.trackOf(props.student) : "lisans";
    const [dash, setDash] = useState(null);
    const [err, setErr] = useState(null);
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState("");
    const [booklet, setBooklet] = useState("");
    const [, setTick] = useState(0);
    var clockRef = useRef(null);
    var lastPhase = useRef("");
    var fetchedResult = useRef({});

    function load() {
        if (!C) return Promise.resolve();
        return C.rpc("live_dashboard", { p_track: track }).then(function (d) {
            clockRef.current = L.createClock(d.now);
            setDash(d);
            setErr(null);
        }).catch(function (e) { setErr(e); });
    }
    useEffect(function () {
        if (!C || !L) return;
        load();
        var t = setInterval(load, 60000);
        var s = setInterval(function () { setTick(function (x) { return x + 1; }); }, 1000);
        return function () { clearInterval(t); clearInterval(s); };
    }, [track]);

    var now = clockRef.current ? clockRef.current.now() : Date.now();
    var ph = dash ? L.phase(dash, now) : "loading";
    var e = dash && dash.exam;
    var last = dash && dash.last_result;

    // aşama değişince (10:00, 10:15, 12:25 …) panoyu yenile
    useEffect(function () {
        if (lastPhase.current && lastPhase.current !== ph && ph !== "loading") load();
        lastPhase.current = ph;
    }, [ph]);

    // 10:00'dan itibaren kitapçığı önceden indir (şifreli; 10:15'te açılır)
    useEffect(function () {
        if (!e || !C) return;
        if (["about_to_start", "can_enter", "in_progress", "paper_solving"].indexOf(ph) < 0) return;
        if (C.hasBooklet(e.id)) { setBooklet("ok"); return; }
        setBooklet("loading");
        C.fetchBooklet(e.id, e.booklet_sha ? { sha: e.booklet_sha } : null).then(function () { setBooklet("ok"); }, function () { setBooklet("fail"); });
    }, [ph, e && e.id]);

    // sınav bitti: bekleyen cevapları gönder, sonucu hesaplat
    useEffect(function () {
        if (!e || !C || !dash.attempt) return;
        if (ph !== "ended" && ph !== "ranking") return;
        if (last && last.exam_id === e.id) return;
        if (fetchedResult.current[e.id]) return;
        fetchedResult.current[e.id] = true;
        C.flushPending(e.id).then(function () { return C.rpc("live_result", { p_exam: e.id }); })
            .then(load, function () { fetchedResult.current[e.id] = false; });
    }, [ph, e && e.id]);

    // yanlış/boş konular Eksikler'e
    useEffect(function () {
        if (last && last.by_konu && window.StudentStore && StudentStore.applyLiveExamGaps) {
            StudentStore.applyLiveExamGaps(last.exam_id, { title: last.title, at: last.starts_at }, L.gaps(last));
        }
    }, [last && last.exam_id]);

    if (!L || !C) return null;
    if (!dash) {
        if (err) return null;
        return <section className="rounded-3xl glass p-5 mb-4 live-card" aria-busy="true"><p className="text-sm text-stone-500">Canlı deneme yükleniyor…</p></section>;
    }

    function act(name, args, done) {
        setBusy(true); setMsg("");
        C.rpc(name, args).then(function (r) { setBusy(false); if (done) done(r); load(); })
            .catch(function (x) { setBusy(false); setMsg(x.message); });
    }
    function register() { act("live_register", { p_exam: e.id }, function (r) { setMsg(r && r.status === "waitlist" ? "Kontenjan dolu; yedek listesine alındın." : "Kaydın alındı."); }); }
    function unregister() { if (window.confirm("Kaydını silmek istiyor musun?")) act("live_unregister", { p_exam: e.id }); }
    function enter() { props.onOpen && props.onOpen("exam", e.id); }
    // kâğıtta çözme: optik form ve filigranlı kitapçık PDF'i, optik okutma
    function pdfJob(label, job, done) {
        setBusy(true); setMsg(label);
        job(function (p) { setMsg(label.replace("…", "") + " %" + Math.round(p * 100) + "…"); }).then(function () {
            setBusy(false); setMsg(done); load();
        }).catch(function (x) { setBusy(false); setMsg(x.message || "PDF hazırlanamadı."); load(); });
    }
    function printForm() {
        pdfJob("Optik formun hazırlanıyor…", function () { return C.formPdf(props.student, e); },
            "Optik formun indirildi. Yazdırırken ‘Sayfaya sığdır’ı kapat, ölçek %100 olsun.");
    }
    function getBooklet() {
        pdfJob("Soru kitapçığın hazırlanıyor…", function (pr) { return C.bookletPdf(props.student, e, pr); },
            "Kitapçığın indirildi. İşaretlemeyi optik forma yap; bitince \"Optiğimi okut\".");
    }
    // Kâğıt seti: tek PDF (1. sayfa kişiye özel optik form + soru kitapçığı); kayıt olunca açılır
    function getKit() {
        pdfJob("Kitapçığın ve optik formun hazırlanıyor…", function (pr) { return C.kitPdf(props.student, e, pr); },
            "İndirildi: 1. sayfa optik formun, sonrası soru kitapçığı. Yazdırırken ‘Sayfaya sığdır’ı kapat, ölçek %100 olsun.");
    }
    function choosePaper() {
        if (!window.confirm("Kâğıtta çözmeyi seçersen bu sınavı cihazda çözemezsin.\n\nKitapçığı yazdırıp cevaplarını optik forma işaretleyeceksin; sonra formun fotoğrafını çekip okutacaksın (en geç " +
            L.fmtClock(L.ms(e.optic_until || e.ranking_at)) + "). Devam edilsin mi?")) return;
        setBusy(true); setMsg("Kâğıt modunda giriş yapılıyor…");
        C.enterPaper(e.id).then(function () {
            setBusy(false);
            // kitapçığın güncel hâli zaten indirildiyse yeniden indirme
            if (C.kitFresh(e)) { setMsg("Kâğıt modundasın. Kitapçığın ve optik formun zaten sende; bitince \"Optiğimi okut\"."); load(); }
            else getKit();
        })
            .catch(function (x) { setBusy(false); setMsg(x.message); load(); });
    }
    function openOptic() { props.onOpen && props.onOpen("optic", e.id); }
    var opticUntil = e ? L.ms(e.optic_until || e.ranking_at) : 0;
    // kâğıt seti açık mı (kayıt olunca indirilebilir) ve daha önce indirilen güncel mi
    var kitOpen = !!(e && e.has_booklet && (e.early_kit !== false || now >= L.ms(e.reg_closes_at)));
    var kitState = e && C.kitInfo(e.id) ? (C.kitFresh(e) ? "fresh" : "stale") : "none";

    var startT = e ? L.ms(e.starts_at) : 0;
    var title = e ? e.title : "Canlı deneme";
    var when = e ? L.fmtDay(startT, true) + " " + L.fmtClock(startT) : "";

    function ResultBlock(p) {
        var r = p.r;
        var weak = L.weakest(r, 3);
        return (
            <div>
                <p className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">Son deneme sonucun · {L.fmtDay(L.ms(r.starts_at))}</p>
                <h2 className="text-lg font-bold mt-0.5">{r.title}</h2>
                <div className="flex flex-wrap items-end gap-x-6 gap-y-2 mt-3">
                    <div><span className="font-stat text-4xl font-black">{L.fmtNet(r.net)}</span> <span className="text-sm text-stone-500">net</span></div>
                    <div className="text-sm text-stone-600 dark:text-stone-300">{r.correct} doğru · {r.wrong} yanlış · {r.blank} boş</div>
                    <div className="text-sm font-semibold">
                        {r.finalized && r.rank ? r.rank + ". / " + r.participants + " kişi · ilk %" + String(r.top_pct).replace(".", ",")
                            : "Sıralama " + L.fmtClock(L.ms(r.ranking_at)) + "'ta açıklanır"}
                    </div>
                </div>
                {weak.length ? (
                    <div className="mt-3">
                        <p className="text-xs text-stone-500 mb-1">En zayıf 3 konun (Eksikler'e eklendi):</p>
                        <ul className="space-y-1">
                            {weak.map(function (w) {
                                var can = liveKonuHasContent(props.kpssData, w.ders, w.konu) && props.onKonu;
                                return (
                                    <li key={w.key} className="text-sm flex flex-wrap justify-between gap-2">
                                        {can ? <button type="button" className="font-semibold text-teal-700 dark:text-teal-300 hover:underline text-left" onClick={function () { props.onKonu(w.ders, w.konu); }}>{w.ders} / {kLabel(w.konu)} →</button>
                                            : <span className="font-semibold">{w.ders} / {kLabel(w.konu)}</span>}
                                        <span className="text-stone-500">{w.c}/{w.n}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ) : null}
                <div className="flex flex-wrap gap-2 mt-4">
                    <button type="button" className="quick-chip is-primary" onClick={function () { props.onOpen && props.onOpen("result", r.exam_id); }}>Tüm raporu gör</button>
                    <button type="button" className="quick-chip" onClick={function () { props.onOpen && props.onOpen("archive"); }}>Denemelerim</button>
                </div>
            </div>
        );
    }

    var body = null;
    var showResult = last && ["ended", "ranking", "none", "reg_open", "registered", "waitlist", "reg_closed", "over_unregistered", "missed_live"].indexOf(ph) >= 0;
    var missedNewer = dash.missed && (!last || L.ms(dash.missed.starts_at) > L.ms(last.starts_at));

    if (ph === "loading") body = null;
    else if (ph === "about_to_start") {
        body = (
            <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">Sınav başlamak üzere</p>
                <h2 className="text-lg font-bold mt-0.5">{title}</h2>
                <p className="mt-2 font-stat text-3xl font-black" role="timer">{L.fmtLeft(startT - now)}</p>
                <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">
                    {booklet === "ok" ? "✓ Soru kitapçığı şifreli olarak cihazına indi; 10:15'te açılacak." : booklet === "fail" ? "Kitapçık indirilemedi; internetini kontrol et, tekrar denenecek." : "Soru kitapçığı cihazına iniyor…"}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                    <button type="button" className="quick-chip is-primary" disabled>Sınava gir (10:15'te açılır)</button>
                    {e.has_booklet ? <button type="button" className="quick-chip" disabled={busy} onClick={getKit}>📄 Kitapçık + optik form (PDF)</button>
                        : <button type="button" className="quick-chip" disabled={busy} onClick={printForm}>🖨 Optik formunu indir</button>}
                </div>
            </div>
        );
    } else if (ph === "can_enter" || ph === "in_progress") {
        body = (
            <div>
                <p className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">● Sınav devam ediyor</p>
                <h2 className="text-lg font-bold mt-0.5">{title}</h2>
                <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">
                    Bitişe {L.fmtLeft(L.ms(e.ends_at) - now)} kaldı{ph === "can_enter" ? " · giriş " + L.fmtClock(L.ms(e.entry_closes_at)) + "'te kapanır" : ""}.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                    <button type="button" className="quick-chip is-primary" onClick={enter}>{ph === "in_progress" ? "Kaldığın yerden devam et" : "Cihazda çöz"}</button>
                    {ph === "can_enter" ? <button type="button" className="quick-chip" disabled={busy} onClick={choosePaper}>🖨 Kâğıtta çöz</button> : null}
                </div>
                {ph === "can_enter" ? <p className="text-xs text-stone-500 mt-2">Kâğıtta çözersen kitapçık PDF olarak iner; cevaplarını optik forma işaretleyip sonra fotoğrafını okutursun.</p> : null}
            </div>
        );
    } else if (ph === "paper_solving") {
        body = (
            <div>
                <p className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">● Sınav devam ediyor · kâğıtta çözüyorsun</p>
                <h2 className="text-lg font-bold mt-0.5">{title}</h2>
                <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">
                    Bitişe {L.fmtLeft(L.ms(e.ends_at) - now)} kaldı. Bitirince optik formunun fotoğrafını çekip okut; okutma {L.fmtClock(opticUntil)}'ta kapanır.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                    <button type="button" className="quick-chip is-primary" onClick={openOptic}>📷 Optiğimi okut</button>
                    <button type="button" className="quick-chip" disabled={busy} onClick={getBooklet}>Kitapçığı indir</button>
                    <button type="button" className="quick-chip" disabled={busy} onClick={printForm}>Optik formu indir</button>
                </div>
            </div>
        );
    } else if (ph === "paper_submitted") {
        body = <div><p className="font-bold">Optik formun gönderildi.</p><p className="text-sm text-stone-500 mt-1">Cevapların artık değişmez. Sonucun ve çözümler {L.fmtClock(L.ms(e.ends_at))}'te açılır.</p></div>;
    } else if (ph === "optic_window") {
        body = (
            <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">Sınav bitti · optiğini okut</p>
                <h2 className="text-lg font-bold mt-0.5">{title}</h2>
                <p className="mt-2 font-stat text-3xl font-black" role="timer">{L.fmtLeft(opticUntil - now)}</p>
                <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">Optik okutma {L.fmtClock(opticUntil)}'ta kapanır. Okutmazsan bu denemede sonucun olmaz.</p>
                <div className="flex flex-wrap gap-2 mt-3">
                    <button type="button" className="quick-chip is-primary" onClick={openOptic}>📷 Optiğimi okut</button>
                </div>
            </div>
        );
    } else if (ph === "optic_missed") {
        body = <div><p className="font-bold">Optik formun gelmedi.</p><p className="text-sm text-stone-500 mt-1">Okutma süresi {L.fmtClock(opticUntil)}'ta doldu; bu denemede sonucun yok. Sorun yaşadıysan yönetici ile iletişime geç.</p></div>;
    } else if (ph === "entry_closed") {
        body = <div><p className="font-bold">Sınava giriş {L.fmtClock(L.ms(e.entry_closes_at))}'te kapandı.</p><p className="text-sm text-stone-500 mt-1">Sonraki denemeye kayıt hafta içi açılacak.</p></div>;
    } else if (ph === "submitted") {
        body = <div><p className="font-bold">Kâğıdını teslim ettin.</p><p className="text-sm text-stone-500 mt-1">Sonucun ve çözümler {L.fmtClock(L.ms(e.ends_at))}'te açılır.</p></div>;
    } else if (ph === "locked") {
        body = <div><p className="font-bold text-rose-700">Sınavın kilitlendi.</p><p className="text-sm text-stone-500 mt-1">Cihaz değişim sınırı aşıldı. Yönetici ile iletişime geç.</p></div>;
    } else if ((ph === "ended" || ph === "ranking") && !(last && last.exam_id === e.id)) {
        body = <div><p className="font-bold">Sınav bitti.</p><p className="text-sm text-stone-500 mt-1">Sonucun hesaplanıyor…</p></div>;
    } else if (showResult) {
        body = <ResultBlock r={last} />;
    } else if (missedNewer && dash.missed_no_optic) {
        body = <div><p className="font-bold">Optik formun gelmediği için bu denemede sonucun yok.</p><p className="text-sm text-stone-500 mt-1">Bir sonrakinde okutma süresini kaçırma: sınav bitişinden sonra 15 dakika.</p></div>;
    } else if (missedNewer || ph === "missed_live" || ph === "over_unregistered") {
        body = <div><p className="font-bold">Bu haftaki denemeye katılmadın.</p><p className="text-sm text-stone-500 mt-1">Genel sonuçlar açıklandığında burada görünür; bir sonrakine kayıt ol.</p></div>;
    }

    // kayıt bölümü (sonuç kartının altında da görünür)
    var regBlock = null;
    if (ph === "reg_open") {
        regBlock = (
            <div className={body ? "mt-4 pt-4 border-t border-stone-200/70 dark:border-stone-700" : ""}>
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">Canlı deneme · {L.TRACKS[e.track]}</p>
                <h2 className="text-lg font-bold mt-0.5">{when}'te canlı deneme</h2>
                <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">120 soru · 130 dakika · herkes aynı anda · başlamaya {L.fmtLeft(startT - now)}{dash.registered_count ? " · " + dash.registered_count + " kayıtlı" : ""}{e.capacity ? " / " + e.capacity : ""}</p>
                <button type="button" className="quick-chip is-primary mt-3" disabled={busy} onClick={register}>Kayıt ol</button>
            </div>
        );
    } else if (ph === "registered" || ph === "waitlist") {
        regBlock = (
            <div className={body ? "mt-4 pt-4 border-t border-stone-200/70 dark:border-stone-700" : ""}>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">{ph === "waitlist" ? "Yedek listesindesin" : "✓ Kayıtlısın"}</p>
                <h2 className="text-lg font-bold mt-0.5">{when} · {title}</h2>
                <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">
                    {ph === "waitlist" ? "Sıran: " + ((dash.registration && dash.registration.waitlist_pos) || "?") + ". Yer açılırsa otomatik kaydedilirsin. " : ""}
                    Başlamaya {L.fmtLeft(startT - now)}.
                </p>
                {ph === "registered" ? (
                    <ul className="text-xs text-stone-500 mt-2 space-y-0.5 list-disc pl-4">
                        <li>Cihazda çözeceksen: kitapçık pazar {L.fmtClock(L.ms(e.reg_closes_at))}'da cihazına iner, sınav {L.fmtClock(startT)}'te açılır.</li>
                        {kitOpen ? <li>Kâğıtta çözeceksen: soru kitapçığını ve optik formunu <b>şimdi</b> tek PDF olarak indirip yazdırabilirsin (1. sayfa optik form; ‘Sayfaya sığdır’ kapalı, %100 ölçek).</li>
                            : <li>Kâğıtta çözeceksen optik formunu şimdiden yazdır (‘Sayfaya sığdır’ kapalı, %100 ölçek){e.early_kit !== false ? "; kitapçık hazırlanınca buradan indirebileceksin." : "."}</li>}
                        <li>Sınav günü {L.fmtClock(startT)}–{L.fmtClock(L.ms(e.entry_closes_at))} arası "Kâğıtta çöz"e basıp, bitince optiğini {L.fmtClock(opticUntil)}'a kadar okut.</li>
                        <li>130 dakikalık sessiz bir zaman ayır; müsvedde kâğıt ve kalem hazırla.</li>
                    </ul>
                ) : null}
                {ph === "registered" && kitState === "stale" ? <p className="plan-warn mt-2">Soru kitapçığı güncellendi; yazdırdığın eski olabilir. Yeniden indir.</p> : null}
                {ph === "registered" && kitState === "fresh" ? <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-2">✓ Kitapçığın ve optik formun indirildi ({L.fmtDay(C.kitInfo(e.id).at)} {L.fmtClock(C.kitInfo(e.id).at)}).</p> : null}
                <div className="flex flex-wrap gap-2 mt-3">
                    {ph === "registered" && kitOpen ? <button type="button" className={"quick-chip" + (kitState === "fresh" ? "" : " is-primary")} disabled={busy} onClick={getKit}>📄 {kitState === "stale" ? "Güncel kitapçığı indir" : kitState === "fresh" ? "Yeniden indir" : "Kitapçık + optik form (PDF)"}</button> : null}
                    {ph === "registered" && !kitOpen ? <button type="button" className="quick-chip" disabled={busy} onClick={printForm}>🖨 Optik formunu indir</button> : null}
                    <button type="button" className="quick-chip" disabled={busy} onClick={unregister}>Kaydımı sil</button>
                </div>
            </div>
        );
    } else if (ph === "reg_closed") {
        regBlock = body ? null : <div><p className="font-bold">Bu haftanın kaydı kapandı.</p><p className="text-sm text-stone-500 mt-1">Sınav {when}'te başlıyor; sonraki denemeye kayıt hafta içi açılır.</p></div>;
    } else if (ph === "none" && !body) {
        regBlock = <div><p className="text-xs font-bold uppercase tracking-wider text-stone-500">Canlı deneme</p><p className="font-bold mt-1">Sıradaki canlı deneme yakında duyurulacak.</p><p className="text-sm text-stone-500 mt-1">Her pazar 10:15'te herkes aynı anda çözer, ortak sıralama çıkar.</p></div>;
    }

    return (
        <section className="rounded-3xl glass p-5 sm:p-6 mb-4 slide-up live-card" aria-label="Canlı deneme">
            {dash.cancelled ? <p className="plan-warn mb-3">{dash.cancelled.title} iptal edildi{dash.cancelled.cancel_reason ? ": " + dash.cancelled.cancel_reason : "."}</p> : null}
            {body}
            {regBlock}
            {msg ? <p className="text-sm mt-2 text-stone-600 dark:text-stone-300" role="status">{msg}</p> : null}
            {!props.full ? (
                <button type="button" className="text-xs font-semibold text-stone-500 hover:underline mt-3" onClick={function () { props.onOpen && props.onOpen("home"); }}>Canlı deneme sayfası →</button>
            ) : null}
        </section>
    );
}
window.KpssLiveCard = LiveExamCard;

// Eksikler: son canlı denemeden gelen konular
function LiveGaps(props) {
    var g = props.student && props.student.userProfile && props.student.userProfile.liveGaps;
    if (!g || !g.items || !g.items.length) return null;
    return (
        <section className="rounded-3xl glass p-5 mb-6" aria-label="Canlı denemeden eksikler">
            <p className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">Canlı denemeden · {g.title}</p>
            <h2 className="text-lg font-bold mt-0.5">Yanlış ve boş bıraktığın konular</h2>
            <ul className="mt-3 space-y-1.5">
                {g.items.slice(0, 12).map(function (it) {
                    var can = liveKonuHasContent(props.kpssData, it.ders, it.konu);
                    return (
                        <li key={it.ders + "|" + it.konu} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                            {can ? <button type="button" className="font-semibold text-left text-teal-700 dark:text-teal-300 hover:underline" onClick={function () { props.onKonu(it.ders, it.konu); }}>{it.ders} / {kLabel(it.konu)} →</button>
                                : <span className="font-semibold">{it.ders} / {kLabel(it.konu)} <span className="text-[11px] font-normal text-stone-400">(konu anlatımı yakında)</span></span>}
                            <span className="text-stone-500">{it.w} yanlış · {it.b} boş</span>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

function Bugun(props) {
    const plan = props.plan;
    const [wizard, setWizard] = useState(false);
    const [calendar, setCalendar] = useState(false);
    if (calendar) {
        return (
            <>
                <PlanCalendar student={props.student} kpssData={props.kpssData} isDark={props.isDark} toggleDark={props.toggleDark}
                    onBack={function () { setCalendar(false); }} onWizard={function () { setWizard(true); }} />
                {wizard ? <PlanWizard student={props.student} kpssData={props.kpssData} onClose={function () { setWizard(false); }} onDone={function () { setWizard(false); }} /> : null}
            </>
        );
    }
    const name = props.student.profile.name;
    const level = (props.student.userProfile && props.student.userProfile.educationLevel) || "lisans";
    const track = examTrackName(level);
    var examLine, examSub = "";
    if (plan.daysLeft == null) { examLine = track + " · sınav tarihi yok"; examSub = "Ben › Ayarlar’dan sınav tarihini seç, plan ona göre kurulsun."; }
    else if (plan.daysLeft < 0) { examLine = track + " geride kaldı"; examSub = "Yeni hedefin için Ben › Ayarlar’dan sınav tarihini güncelle."; }
    else if (plan.daysLeft === 0) { examLine = track + " bugün"; examSub = "Başarılar! Sakin kal, bildiğin soruya önce git."; }
    else { examLine = track + "’ye " + plan.daysLeft + " gün kaldı"; examSub = plan.daysLeft <= 30 ? "Son düzlük: tekrar ve deneme ağırlıklı çalış." : "Her gün not + test; yanlışlar tekrara düşer."; }
    return (
        <Shell>
            <div className="flex justify-between items-start mb-8">
                <div className="slide-up">
                    <p className="text-sm font-medium text-stone-400 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block"></span>
                        Hoş geldin{name ? ", " + name : ""}
                    </p>
                    <h1 className="m-title mt-1">Bugün</h1>
                    <p className="m-sub max-w-sm">Hedefine doğru her gün bir adım.</p>
                </div>
                <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
            </div>

            <div className="exam-hero rounded-3xl text-white p-5 mb-6 slide-up">
                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wider exam-hero-kicker">Sınav takvimi</p>
                        <p className="text-xl font-bold mt-0.5 leading-snug">{examLine}</p>
                        {examSub ? <p className="text-[13px] mt-1 opacity-80 leading-snug">{examSub}</p> : null}
                    </div>
                    {plan.daysLeft != null && plan.daysLeft > 0 ? (
                        <div className={"exam-hero-count shrink-0" + (plan.daysLeft <= 30 ? " is-soon" : "")}>
                            <span className="font-stat">{plan.daysLeft}</span>
                            <small>gün</small>
                        </div>
                    ) : null}
                </div>
            </div>

            <div className="dash-split">
                <div className="min-w-0">
                    <LiveExamCard student={props.student} kpssData={props.kpssData} onKonu={function (d, k) { props.onKonu(d, k, "hub"); }} onOpen={props.onLive} />
                    <SmartPlanCard student={props.student} kpssData={props.kpssData} onKonu={props.onKonu} onDers={props.onDers} onExam={props.onExam}
                        onWizard={function () { setWizard(true); }} onCalendar={function () { setCalendar(true); }} />
                    <NextSteps plan={plan} onKonu={props.onKonu} onReview={props.onReview} onWrong={props.onWrong} onMixed={props.onMixed} onDeneme={props.onDeneme} />
                </div>
                <div className="min-w-0 space-y-4">
                    <div className="tool-pair">
                        <DailyGoal student={props.student} />
                        <FocusTimer kpssData={props.kpssData} />
                    </div>
                    <WeakTopics plan={plan} onKonu={props.onKonu} />
                    <StudyDash student={props.student} onDers={props.onDers} />
                </div>
            </div>
            {wizard ? <PlanWizard student={props.student} kpssData={props.kpssData} onClose={function () { setWizard(false); }} onDone={function () { setWizard(false); }} /> : null}
        </Shell>
    );
}

function AlistirmalarHome(props) {
    var items = [
        ["cloze", "pencil", "Boşluk doldurma", "Nottaki boşluğu şıklardan tamamla."],
        ["map", "map", "Harita oyunu", "Konuyu seç, turdaki isimleri haritaya yerleştir."],
        ["conquer", "shield", "Türkiye'yi Fethet", "İli seç, soruları bitir; ili boya, bölge rozeti kap."],
        ["tabu", "layers", "Tabu", "İpuçlarından kavrama ulaş. Az ipucu, çok puan."],
        ["panic", "timer", "Son 30 saniye", "Doğru +2 sn, yanlış −3 sn. Hızlı net bilgi."]
    ];
    return (
        <Shell>
            <div className="flex justify-between items-start mb-6">
                <div className="slide-up">
                    <h1 className="m-title">Alıştırmalar</h1>
                    <p className="m-sub">Boşluk, harita ve oyunlar.</p>
                </div>
                <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2">
                {items.map(function (it) {
                    return <AccentRow key={it[0]} icon={it[1]} title={it[2]} sub={it[3]} onClick={function () { props.onKind(it[0]); }} />;
                })}
            </div>
        </Shell>
    );
}

function AlistirmaDersList(props) {
    const kpssData = props.kpssData;
    return (
        <Shell>
            <div className="flex justify-between mb-4">
                <BackBtn onClick={props.onBack} label="Alıştırmalar" />
                <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
            </div>
            <h1 className="m-title">Boşluk doldurma</h1>
            <p className="m-sub mb-6">Ders seç, sonra konu.</p>
            <div className="space-y-2.5">
                {Object.keys(kpssData).map(function (ders) {
                    if (window.ClozeEngine && !window.ClozeEngine.dersEnabled(ders)) return null;
                    const t = themeFor(ders, props.isDark);
                    const konular = Object.keys(kpssData[ders] || {}).filter(function (k) { return k !== "_"; });
                    if (!konular.length) return null;
                    return (
                        <AccentRow key={ders} title={ders} sub={konular.length + " konu"} onClick={function () { props.onDers(ders); }} />
                    );
                })}
            </div>
        </Shell>
    );
}

function AlistirmaKonuList(props) {
    const ders = props.ders;
    const t = themeFor(ders, props.isDark);
    const konular = Object.keys(props.kpssData[ders] || {}).filter(function (k) { return k !== "_"; });
    const engine = window.ClozeEngine;
    const topics = (props.student && props.student.topics && props.student.topics[ders]) || {};
    const [stats, setStats] = useState(null);
    useEffect(function () {
        var id = requestAnimationFrame(function () {
            var next = {};
            konular.forEach(function (konu, idx) {
                var kd = props.kpssData[ders][konu] || {};
                var tp = topics[konu] || {};
                var n = engine ? engine.countForKonu(kd) : 0;
                next[konu] = {
                    n: n,
                    left: n && engine ? engine.remainingCount(kd, tp.solvedCloze) : 0,
                    open: StudentStore.isKonuOpen(ders, konular, idx, props.kpssData),
                    done: StudentStore.topicComplete(tp, kd)
                };
            });
            setStats(next);
        });
        return function () { cancelAnimationFrame(id); };
    }, [ders, props.student]);
    return (
        <Shell>
            <div className="flex justify-between mb-4">
                <BackBtn onClick={props.onBack} label="Dersler" />
                <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
            </div>
            <div className="flex items-center gap-4 mb-6">
                <div className="h-14 w-14 rounded-2xl ders-icon flex items-center justify-center text-2xl">{t.icon}</div>
                <div>
                    <h1 className="text-3xl font-black">{ders}</h1>
                    <p className="text-zinc-500 text-sm">Derslerle aynı sıra. Konu bitince burası da açılır.</p>
                </div>
            </div>
            <div className="space-y-3">
                {konular.map(function (konu, idx) {
                    const st = (stats && stats[konu]) || { n: 0, left: 0, open: true, done: false };
                    const open = st.open !== false;
                    return (
                        <button key={konu} disabled={!open} onClick={function () { if (open) props.onKonu(konu); }}
                            className={"w-full text-left p-5 panel rounded-3xl " + (open ? "" : "opacity-45")}>
                            <div className="flex justify-between items-start gap-3">
                                <div className="flex gap-3 min-w-0">
                                    <div className={"h-10 w-10 rounded-xl flex items-center justify-center font-stat text-sm shrink-0 " + (st.done ? "bg-emerald-50 text-emerald-600" : (open ? "bg-teal-50 text-teal-800" : "bg-stone-100 text-stone-400"))}>{st.done ? "✓" : (open ? idx + 1 : "🔒")}</div>
                                    <div className="min-w-0">
                                        <div className="font-bold text-slate-800 dark:text-slate-100">{kLabel(konu)}</div>
                                        <p className="text-xs text-slate-400 mt-1">{open ? (st.n ? (st.left + " / " + st.n + " boşluk") : (stats ? "Henüz alıştırma yok" : "\u00a0")) : "Önce önceki konunun testlerini bitir"}</p>
                                    </div>
                                </div>
                                {open ? <span className="text-stone-300 text-lg shrink-0">→</span> : null}
                            </div>
                        </button>
                    );
                })}
            </div>
        </Shell>
    );
}

function tidyClozePrompt(text) {
    return String(text || "")
        .replace(/\s*Boşluk:\s*/g, " ")
        .replace(/\s*→\s*/g, " ")
        .replace(/\s{2,}/g, " ")
        .trim();
}

function clozePromptNodes(text, fill, fillOk) {
    var raw = tidyClozePrompt(text);
    var parts = raw.split("______");
    if (parts.length === 1 && !fill) {
        return <span>{raw}</span>;
    }
    var nodes = [];
    parts.forEach(function (p, i) {
        if (p) nodes.push(<span key={"t" + i}>{p}</span>);
        if (i < parts.length - 1 || (parts.length === 1 && fill)) {
            nodes.push(
                <span key={"b" + i} className={"cloze-blank" + (fill ? (fillOk ? " is-ok" : " is-bad") : "")}>
                    {fill || "\u00a0"}
                </span>
            );
        }
    });
    return nodes;
}

function clozeChoiceLabel(c) {
    var t = String(c == null ? "" : c).trim();
    return t ? t.charAt(0).toLocaleUpperCase("tr-TR") + t.slice(1) : t;
}

// Cevaptan sonra "Sonraki" düğmesi alt menünün arkasında kalmasın.
function revealSoon(ref) {
    setTimeout(function () {
        var el = ref && ref.current;
        if (el && el.scrollIntoView) {
            try { el.scrollIntoView({ block: "nearest", behavior: "smooth" }); } catch (e) { el.scrollIntoView(false); }
        }
    }, 60);
}

function ClozePlay(props) {
    const [items, setItems] = useState(null);
    const [idx, setIdx] = useState(0);
    const [picked, setPicked] = useState(null);
    const [score, setScore] = useState(0);
    const [done, setDone] = useState(false);
    const footRef = useRef(null);
    useEffect(function () { if (picked) revealSoon(footRef); }, [picked]);

    useEffect(function () {
        setIdx(0); setPicked(null); setScore(0); setDone(false); setItems(null);
        var id = requestAnimationFrame(function () {
            if (!window.ClozeEngine) { setItems([]); return; }
            setItems(window.ClozeEngine.buildForKonu(props.konuData, 12, StudentStore.solvedClozeIds(props.ders, props.konu)) || []);
        });
        return function () { cancelAnimationFrame(id); };
    }, [props.ders, props.konu, props.seed]);

    var totalCloze = window.ClozeEngine ? window.ClozeEngine.countForKonu(props.konuData) : 0;
    var leftCloze = window.ClozeEngine ? window.ClozeEngine.remainingCount(props.konuData, StudentStore.solvedClozeIds(props.ders, props.konu)) : 0;

    if (items == null) {
        return (
            <Shell>
                <div className="flex justify-between mb-4">
                    <BackBtn onClick={props.onBack} label="Konular" />
                    <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
                </div>
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">{props.ders}</p>
                <h1 className="text-2xl font-black mb-4">{kLabel(props.konu)}</h1>
            </Shell>
        );
    }

    if (!items.length) {
        var allSolved = totalCloze > 0 && leftCloze === 0;
        return (
            <Shell>
                <div className="flex justify-between mb-4">
                    <BackBtn onClick={props.onBack} label="Konular" />
                    <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
                </div>
                <div className="text-center py-16 rounded-3xl glass">
                    <p className="font-bold">{allSolved ? "Bu konudaki boşlukları çözdün." : "Bu konuda henüz boşluk yok."}</p>
                    <p className="text-sm text-stone-400 mt-2">{allSolved ? "Konuyu sıfırlarsan tekrar gelir." : "Not veya soru eklenince alıştırmalar burada açılır."}</p>
                    {allSolved ? (
                        <button type="button" onClick={function () {
                            StudentStore.resetCloze(props.ders, props.konu);
                            if (props.onAgain) props.onAgain();
                        }} className="btn-primary text-white px-5 py-2.5 rounded-full font-semibold mt-6">Sıfırla</button>
                    ) : null}
                </div>
            </Shell>
        );
    }

    if (done) {
        return (
            <Shell>
                <div className="flex justify-between mb-4">
                    <BackBtn onClick={props.onBack} label="Konular" />
                    <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
                </div>
                <article className="study-card fade-in">
                    <header className="study-card-head">
                        <div>
                            <p className="study-card-kicker">{props.ders}</p>
                            <h2 className="study-card-title">{kLabel(props.konu)} · Bitti</h2>
                        </div>
                        <div className="note-progress">{score}/{items.length}</div>
                    </header>
                    <div className="study-card-body text-center py-8">
                        <p className="text-4xl font-black mb-2">{Math.round((score / items.length) * 100)}%</p>
                        <p className="text-stone-500">{score} doğru · {items.length - score} yanlış</p>
                        <p className="text-sm text-stone-400 mt-3">{leftCloze ? (leftCloze + " boşluk kaldı") : "Doğru çözülenler bir daha gelmez. Konuyu sıfırlarsan tekrar gelir."}</p>
                    </div>
                    <footer className="study-card-foot">
                        <BackBtn onClick={props.onBack} label="Konular" />
                        {leftCloze ? (
                            <button onClick={props.onAgain} className="btn-primary text-white px-5 py-2.5 rounded-full font-semibold">Devam et</button>
                        ) : (
                            <button type="button" onClick={function () {
                                StudentStore.resetCloze(props.ders, props.konu);
                                if (props.onAgain) props.onAgain();
                            }} className="btn-primary text-white px-5 py-2.5 rounded-full font-semibold">Sıfırla</button>
                        )}
                    </footer>
                </article>
            </Shell>
        );
    }

    const it = items[idx];
    const ok = picked && picked.toLocaleLowerCase("tr-TR") === String(it.answer).toLocaleLowerCase("tr-TR");
    return (
        <Shell>
            <div className="flex justify-between mb-4">
                <BackBtn onClick={props.onBack} label="Konular" />
                <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
            </div>
            <article className="study-card fade-in">
                <header className="study-card-head">
                    <div>
                        <p className="study-card-kicker">{props.ders}</p>
                        <h2 className="study-card-title">{kLabel(props.konu)} · Boşluk</h2>
                    </div>
                    <div className="note-progress">{idx + 1}/{items.length}</div>
                </header>
                <div className="study-card-body">
                    <div className="cloze-stem">
                        <div className="cloze-stem-bar" aria-hidden="true"></div>
                        {it.hint ? <p className="cloze-hint">{it.hint}</p> : null}
                        <p className="cloze-stem-text">{clozePromptNodes(it.prompt, picked ? it.answer : "", ok)}</p>
                    </div>
                    <div className="grid gap-2.5 mt-5">
                        {(it.choices || []).map(function (c, ci) {
                            var isP = picked === c;
                            var isA = String(c).toLocaleLowerCase("tr-TR") === String(it.answer).toLocaleLowerCase("tr-TR");
                            var cls = "option-btn w-full text-left px-4 py-3 rounded-2xl border font-medium ";
                            if (!picked) cls += "bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-600";
                            else if (isA) cls += "bg-emerald-50 border-emerald-400 text-emerald-900";
                            else if (isP) cls += "bg-rose-50 border-rose-400 text-rose-900";
                            else cls += "bg-stone-50 border-stone-200 opacity-55";
                            return (
                                <button key={ci + "-" + c} disabled={!!picked} onClick={function () {
                                    if (picked) return;
                                    setPicked(c);
                                    if (String(c).toLocaleLowerCase("tr-TR") === String(it.answer).toLocaleLowerCase("tr-TR")) {
                                        setScore(score + 1);
                                        StudentStore.markClozeSolved(props.ders, props.konu, it.id);
                                    }
                                }} className={cls}>{clozeChoiceLabel(c)}</button>
                            );
                        })}
                    </div>
                    {picked ? (
                        <p className={"cloze-verdict " + (ok ? "is-ok" : "is-bad")}>
                            {ok ? "Doğru." : "Doğrusu: " + it.answer}
                        </p>
                    ) : null}
                </div>
                <footer className="study-card-foot" ref={footRef} style={{ scrollMarginBottom: "calc(var(--app-tabbar-h) + 16px)" }}>
                    <span className="text-xs text-stone-400">{score} doğru</span>
                    <button disabled={!picked} onClick={function () {
                        if (idx + 1 >= items.length) setDone(true);
                        else { setIdx(idx + 1); setPicked(null); }
                    }} className={"btn-primary text-white px-5 py-2.5 rounded-full font-semibold " + (!picked ? "opacity-40 pointer-events-none" : "")}>
                        {idx + 1 >= items.length ? "Bitir" : "Sonraki"}
                    </button>
                </footer>
            </article>
        </Shell>
    );
}

function MapTopics(props) {
    const quiz = window.MapQuiz;
    const tree = (quiz && quiz.TREE) || [];
    return (
        <Shell wide>
            <div className="flex justify-between mb-4">
                <BackBtn onClick={props.onBack} label="Alıştırmalar" />
                <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
            </div>
            <h1 className="text-3xl font-black tracking-tight gradient-text">Harita oyunu</h1>
            <p className="text-sm text-stone-400 mt-1 mb-6">KPSS fiziki · iklim · nüfus · maden · ulaşım. Konuyu seç, 6–8 ismi haritadaki pinlere bırak.</p>
            {tree.map(function (g) {
                return (
                    <div key={g.id} className="mb-6">
                        <h2 className="text-sm font-black uppercase tracking-widest text-stone-400 mb-2">{g.icon} {g.title}</h2>
                        <div className="wide-grid is-tight">
                            {g.kids.map(function (k) {
                                var n = quiz ? quiz.countFor(k.id) : 0;
                                var hoverImg = k.hoverImg;
                                return (
                                    <button key={k.id} type="button" onClick={function () { props.onTopic(k.id); }}
                                        className={"text-left p-4 rounded-2xl glass card-hover" + (hoverImg ? " map-topic-card--photo" : "")}>
                                        {hoverImg ? <span className="map-topic-card-photo" aria-hidden="true" style={{ backgroundImage: "url(" + hoverImg + ")" }} /> : null}
                                        <div className="map-topic-card-fg relative z-10 font-bold">{hoverImg ? k.title : (k.icon + " " + k.title)}</div>
                                        <div className="map-topic-card-meta relative z-10 text-xs text-stone-400 mt-1">{n} hedef</div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </Shell>
    );
}

function MapPlay(props) {
    const quiz = window.MapQuiz;
    const meta = quiz ? quiz.topicMeta(props.topicId) : null;
    // Konunun tüm hedefleri tek oyunda, karışık sırayla sorulur.
    const round = useMemo(function () {
        if (!quiz || !quiz.pickPlaceRound) return { items: [], chips: [] };
        return quiz.pickPlaceRound(props.topicId);
    }, [props.seed, props.topicId]);
    const total = round.items.length;

    const [idx, setIdx] = useState(0);
    const [solved, setSolved] = useState({});      // pinId -> "ok" | "shown"
    const [misses, setMisses] = useState(0);
    const [flash, setFlash] = useState(null);
    const [hit, setHit] = useState(null);
    const [done, setDone] = useState(false);
    const [svgHtml, setSvgHtml] = useState("");
    const [mapFail, setMapFail] = useState(false);

    const hostRef = useRef(null);
    const stageRef = useRef(null);
    const zoomRef = useRef({ s: 1, x: 0, y: 0 });
    const solvedRef = useRef({});
    const targetRef = useRef(null);
    const flashTimer = useRef(null);
    const fitKeyRef = useRef("");
    const lastRef = useRef(null);
    const target = round.items[idx] || null;
    targetRef.current = target;

    useEffect(function () {
        setIdx(0);
        setSolved({});
        solvedRef.current = {};
        setMisses(0);
        setFlash(null);
        setHit(null);
        setDone(false);
        zoomRef.current = { s: 1, x: 0, y: 0 };
        fitKeyRef.current = "";
        if (hostRef.current) hostRef.current.style.transform = "translate(0px, 0px) scale(1)";
    }, [props.seed, props.topicId]);

    useEffect(function () {
        var gone = false;
        fetch("svg/tr.svg?v=4").then(function (r) { return r.ok ? r.text() : Promise.reject(); })
            .then(function (txt) {
                if (gone) return;
                var doc = new DOMParser().parseFromString(txt, "image/svg+xml");
                var svg = doc.querySelector("svg");
                if (!svg) throw new Error("svg");
                svg.removeAttribute("width");
                svg.removeAttribute("height");
                svg.setAttribute("viewBox", svg.getAttribute("viewBox") || svg.getAttribute("viewbox") || "0 0 1000 422");
                svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
                svg.setAttribute("class", "tr-map");
                svg.setAttribute("aria-label", "Türkiye haritası");
                setSvgHtml(svg.outerHTML);
            })
            .catch(function () { if (!gone) setMapFail(true); });
        return function () { gone = true; };
    }, []);

    // ---- yakınlaştır / kaydır ----
    useEffect(function () {
        var stage = stageRef.current;
        var canvas = hostRef.current;
        if (!stage || !canvas || mapFail || done) return;
        var gest = { mode: "", x: 0, y: 0, dist: 0, s0: 1, x0: 0, y0: 0, moved: false };

        function apply(s, x, y) {
            s = Math.max(1, Math.min(5, s));
            if (s <= 1.02) { s = 1; x = 0; y = 0; }
            zoomRef.current = { s: s, x: x, y: y };
            canvas.style.transform = "translate(" + x + "px, " + y + "px) scale(" + s + ")";
        }
        function pinchDist(touches) {
            var a = touches[0], b = touches[1];
            var dx = a.clientX - b.clientX, dy = a.clientY - b.clientY;
            return Math.sqrt(dx * dx + dy * dy) || 1;
        }
        function onTouchStart(e) {
            // Parmağın gerçek noktası: tarayıcı dokunuşu komşu öğeye kaydırabiliyor (touch adjustment)
            if (e.touches.length === 1) stage.__lastTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() };
            if (e.touches.length === 2) {
                gest.mode = "pinch";
                gest.dist = pinchDist(e.touches);
                gest.s0 = zoomRef.current.s;
                gest.x0 = zoomRef.current.x;
                gest.y0 = zoomRef.current.y;
                gest.moved = true;
            } else if (e.touches.length === 1) {
                gest.mode = "pan";
                gest.x = e.touches[0].clientX;
                gest.y = e.touches[0].clientY;
                gest.x0 = zoomRef.current.x;
                gest.y0 = zoomRef.current.y;
                gest.moved = false;
            } else gest.mode = "";
        }
        function onTouchMove(e) {
            if (gest.mode === "pinch" && e.touches.length === 2) {
                e.preventDefault();
                apply(gest.s0 * (pinchDist(e.touches) / gest.dist), gest.x0, gest.y0);
            } else if (gest.mode === "pan" && e.touches.length === 1 && zoomRef.current.s > 1) {
                var dx = e.touches[0].clientX - gest.x;
                var dy = e.touches[0].clientY - gest.y;
                if (Math.abs(dx) + Math.abs(dy) > 10) gest.moved = true;
                if (gest.moved) {
                    e.preventDefault();
                    apply(zoomRef.current.s, gest.x0 + dx, gest.y0 + dy);
                }
            }
        }
        function onTouchEnd() {
            // Kaydırmanın hemen ardından gelebilecek tıklama yok sayılır; kalıcı işaret sonraki gerçek dokunuşu yutuyordu
            if (gest.moved) stage.__skipClickUntil = Date.now() + 150;
            gest.mode = "";
        }
        function onWheel(e) {
            e.preventDefault();
            var z = zoomRef.current;
            apply(z.s * (e.deltaY > 0 ? 0.88 : 1.14), z.x, z.y);
        }
        stage.addEventListener("touchstart", onTouchStart, { passive: true });
        stage.addEventListener("touchmove", onTouchMove, { passive: false });
        stage.addEventListener("touchend", onTouchEnd);
        stage.addEventListener("wheel", onWheel, { passive: false });
        apply(zoomRef.current.s, zoomRef.current.x, zoomRef.current.y);
        return function () {
            stage.removeEventListener("touchstart", onTouchStart);
            stage.removeEventListener("touchmove", onTouchMove);
            stage.removeEventListener("touchend", onTouchEnd);
            stage.removeEventListener("wheel", onWheel);
        };
    }, [svgHtml, mapFail, done]);

    function bumpZoom(dir) {
        var z = zoomRef.current;
        var s = dir === 0 ? 1 : z.s * (dir > 0 ? 1.4 : 0.72);
        var x = dir === 0 ? 0 : z.x;
        var y = dir === 0 ? 0 : z.y;
        if (s <= 1.02) { s = 1; x = 0; y = 0; }
        s = Math.max(1, Math.min(5, s));
        zoomRef.current = { s: s, x: x, y: y };
        if (hostRef.current) hostRef.current.style.transform = "translate(" + x + "px, " + y + "px) scale(" + s + ")";
    }

    function advance(nextSolved) {
        var i = idx + 1;
        while (i < total && nextSolved[round.items[i].id]) i++;
        if (i >= total) setTimeout(function () { setDone(true); }, 420);
        setIdx(i);
    }

    // Dokunulan noktaya en yakın pini seç: üst üste binen hedeflerde yanlış pine gitmesin.
    function nearestPin(x, y) {
        var host = hostRef.current;
        if (!host) return null;
        var best = null, bestD = Infinity;
        Array.prototype.forEach.call(host.querySelectorAll("[data-pin]"), function (n) {
            var ring = n.querySelector(".place-well") || n;
            var r = ring.getBoundingClientRect();
            var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
            var d = Math.sqrt((cx - x) * (cx - x) + (cy - y) * (cy - y));
            var reach = Math.max(24, r.width * 1.1);
            if (d <= reach && d < bestD) { bestD = d; best = n.getAttribute("data-pin"); }
        });
        return best;
    }

    function answer(pinId) {
        var t = targetRef.current;
        if (!t || done) return;
        if (solvedRef.current[pinId]) return;
        if (pinId === t.id) {
            var next = Object.assign({}, solvedRef.current);
            next[pinId] = "ok";
            solvedRef.current = next;
            lastRef.current = pinId;
            setSolved(next);
            setHit(pinId);
            setTimeout(function () { setHit(null); }, 500);
            advance(next);
            return;
        }
        setMisses(function (m) { return m + 1; });
        setFlash(pinId);
        if (flashTimer.current) clearTimeout(flashTimer.current);
        flashTimer.current = setTimeout(function () { setFlash(null); }, 620);
    }

    function reveal() {
        var t = targetRef.current;
        if (!t || done) return;
        var next = Object.assign({}, solvedRef.current);
        next[t.id] = "shown";
        solvedRef.current = next;
        lastRef.current = t.id;
        setSolved(next);
        setMisses(function (m) { return m + 1; });
        advance(next);
    }

    // ---- pinleri çiz ----
    useEffect(function () {
        var el = hostRef.current;
        if (!el || !svgHtml || done) return;
        var svg = el.querySelector("svg");
        if (!svg) return;
        svg.setAttribute("viewBox", "0 0 1000 422");
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        var built = (quiz && quiz.topicLayerFromSvg) ? quiz.topicLayerFromSvg(svg, props.topicId) : { pins: [] };
        var want = {};
        round.items.forEach(function (it) { want[it.id] = true; });
        var pins = (built.pins || []).filter(function (p) { return want[p.id]; });
        var old = svg.querySelector("g.topic-dots");
        if (old) old.remove();
        var oldLabs = svg.querySelector("g.map-float-labels");
        if (oldLabs) oldLabs.remove();

        // Son işaretlenen yerin illeri haritada vurgulanır: cevabın gerçek alanı görülsün.
        var lastPin = null;
        pins.forEach(function (p) { if (p.id === lastRef.current && solved[p.id]) lastPin = p; });
        var hl = {};
        (lastPin && lastPin.codes || []).forEach(function (c) { hl[c] = true; });
        Array.prototype.forEach.call(el.querySelectorAll("path[id]"), function (pth) {
            pth.setAttribute("class", hl[pth.getAttribute("id")] ? "map-stage map-hl" : "map-stage");
        });

        var NS = "http://www.w3.org/2000/svg";
        function mk(tag, attrs) {
            var n = document.createElementNS(NS, tag);
            Object.keys(attrs).forEach(function (k) { n.setAttribute(k, String(attrs[k])); });
            return n;
        }
        var dots = mk("g", { "class": "topic-dots" });
        pins.forEach(function (pin) {
            var state = solved[pin.id];
            var wrap = mk("g", {
                "data-pin": pin.id,
                "class": "topic-mark place-mark"
                    + (state === "ok" ? " place-ok" : "")
                    + (state === "shown" ? " place-shown" : "")
                    + (flash === pin.id ? " place-miss" : "")
                    + (hit === pin.id ? " place-hit" : "")
            });
            // işaret yana alındıysa gerçek noktaya bağla
            if (pin.off) {
                wrap.appendChild(mk("line", { x1: pin.ax, y1: pin.ay, x2: pin.x, y2: pin.y, "class": "place-leader" }));
                wrap.appendChild(mk("circle", { cx: pin.ax, cy: pin.ay, r: 2.2, "class": "place-anchor" }));
            }
            wrap.appendChild(mk("circle", { cx: pin.x, cy: pin.y, r: state ? 10 : 13, "class": "place-well-core" + (state ? " is-locked" : "") }));
            wrap.appendChild(mk("circle", { cx: pin.x, cy: pin.y, r: 9, "class": "place-well" }));
            if (state === "ok") {
                wrap.appendChild(mk("path", { d: "M" + (pin.x - 4) + " " + (pin.y + 0.2) + " l2.8 2.9 l5.4 -6", "class": "place-check" }));
            } else if (state === "shown") {
                wrap.appendChild(mk("circle", { cx: pin.x, cy: pin.y, r: 2.6, "class": "place-dot is-shown" }));
            } else {
                wrap.appendChild(mk("circle", { cx: pin.x, cy: pin.y, r: 2.6, "class": "place-dot" }));
            }
            wrap.appendChild(mk("circle", { cx: pin.x, cy: pin.y, r: 20, "class": "topic-hit" }));
            dots.appendChild(wrap);
        });
        svg.appendChild(dots);

        // ilk açılışta tüm hedeflere yakınlaş (küçük ekranda pinler görünür olsun)
        var fitKey = props.seed + "|" + props.topicId;
        var stageEl = stageRef.current;
        if (fitKeyRef.current !== fitKey && stageEl && pins.length) {
            fitKeyRef.current = fitKey;
            var W = stageEl.clientWidth, H = stageEl.clientHeight;
            if (W > 0 && H > 0) {
                var k = Math.min(W / 1000, H / 422);
                var pad = 50;
                var xs = pins.map(function (p) { return p.x; }).concat(pins.map(function (p) { return p.ax; }));
                var ys = pins.map(function (p) { return p.y; }).concat(pins.map(function (p) { return p.ay; }));
                var mnx = Math.min.apply(null, xs) - pad, mxx = Math.max.apply(null, xs) + pad;
                var mny = Math.min.apply(null, ys) - pad, mxy = Math.max.apply(null, ys) + pad;
                var sFit = Math.min(W / ((mxx - mnx) * k), H / ((mxy - mny) * k));
                var sMax = Math.max(1, 16 / (14 * k));
                var s = Math.max(1, Math.min(sFit, sMax, 3.2));
                if (s > 1.15) {
                    var bx = (W - 1000 * k) / 2 + k * (mnx + mxx) / 2;
                    var by = (H - 422 * k) / 2 + k * (mny + mxy) / 2;
                    var tx = -s * (bx - W / 2), ty = -s * (by - H / 2);
                    zoomRef.current = { s: s, x: tx, y: ty };
                    el.style.transform = "translate(" + tx + "px, " + ty + "px) scale(" + s + ")";
                }
            }
        }

        var labels = document.createElementNS("http://www.w3.org/2000/svg", "g");
        labels.setAttribute("class", "map-float-labels");
        pins.forEach(function (pin) {
            var state = solved[pin.id];
            // Ad etiketi yalnız son işaretlenen pinde; hepsi birden yazınca harita okunmuyor.
            if (!state || pin.id !== lastRef.current) return;
            var t = document.createElementNS("http://www.w3.org/2000/svg", "text");
            t.setAttribute("x", String(pin.x));
            t.setAttribute("y", String(pin.y - 16));
            t.setAttribute("class", "map-pin " + (state === "ok" ? "map-pin-ok" : "map-pin-done"));
            t.setAttribute("font-size", "14");
            t.textContent = pin.name;
            labels.appendChild(t);
        });
        svg.appendChild(labels);

        function onClick(ev) {
            var st = stageRef.current;
            if (st && Date.now() < (st.__skipClickUntil || 0)) { st.__skipClickUntil = 0; return; }
            var px = ev.clientX, py = ev.clientY, lt = st && st.__lastTouch;
            if (lt && Date.now() - lt.t < 1000) { px = lt.x; py = lt.y; }
            if (st) st.__lastTouch = null;
            var near = nearestPin(px, py);
            if (near) { answer(near); return; }
            var n = ev.target.closest ? ev.target.closest("[data-pin]") : null;
            if (!n) return;
            answer(n.getAttribute("data-pin"));
        }
        el.addEventListener("click", onClick);
        return function () { el.removeEventListener("click", onClick); };
    }, [svgHtml, solved, flash, hit, round, done, idx, props.topicId]);

    useEffect(function () {
        return function () { if (flashTimer.current) clearTimeout(flashTimer.current); };
    }, []);

    if (!quiz || !total) {
        return (
            <Shell wide>
                <BackBtn onClick={props.onBack} label="Konular" />
                <p className="mt-8 text-center text-stone-400">Bu konuda hedef yok.</p>
            </Shell>
        );
    }

    if (done) {
        var okN = Object.keys(solved).filter(function (id) { return solved[id] === "ok"; }).length;
        var pct = total ? Math.round((okN / total) * 100) : 0;
        return (
            <Shell wide>
                <div className="flex justify-between mb-4">
                    <BackBtn onClick={props.onBack} label="Konular" />
                    <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
                </div>
                <article className="study-card fade-in">
                    <header className="study-card-head">
                        <div>
                            <p className="study-card-kicker">Harita bitti</p>
                            <h2 className="study-card-title">{meta ? meta.title : "Harita"}</h2>
                        </div>
                        <div className="note-progress">{okN}/{total}</div>
                    </header>
                    <div className="study-card-body py-6">
                        <p className="text-4xl font-black mb-1 text-center">%{pct}</p>
                        <p className="text-stone-500 text-center">{okN} doğru · {total - okN} kaçtı</p>
                        <p className="text-sm text-stone-400 mt-2 text-center">{misses ? (misses + " yanlış deneme") : "Tek hata yok, tam isabet."}</p>
                        <ul className="map-result-list">
                            {round.items.map(function (it) {
                                var ok = solved[it.id] === "ok";
                                return (
                                    <li key={it.id} className={ok ? "is-ok" : "is-miss"}>
                                        <span aria-hidden="true">{ok ? "✓" : "•"}</span>{it.name}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <footer className="study-card-foot">
                        <BackBtn onClick={props.onBack} label="Konular" />
                        <button onClick={props.onAgain} className="btn-primary text-white px-5 py-2.5 rounded-full font-semibold">Tekrar oyna</button>
                    </footer>
                </article>
            </Shell>
        );
    }

    var okCount = Object.keys(solved).filter(function (id) { return solved[id] === "ok"; }).length;
    var pctBar = total ? Math.round((Object.keys(solved).length / total) * 100) : 0;
    return (
        <div className="map-play-root map-place">
            <header className="map-play-top">
                <div className="map-play-bar">
                    <BackBtn onClick={props.onBack} label="Konular" />
                    <div className="note-progress shrink-0">{okCount}/{total}</div>
                    <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
                </div>
                <p className="map-play-kicker">{meta ? ((meta.hoverImg ? "" : (meta.icon + " ")) + meta.title) : "Harita"}</p>
                <div className="map-progress" aria-hidden="true"><span style={{ width: pctBar + "%" }} /></div>
            </header>
            {!mapFail ? (
                <div className="map-play-stage tr-map-wrap" ref={stageRef}>
                    <div className="map-relief" aria-hidden="true" />
                    <div className="map-play-canvas" ref={hostRef} dangerouslySetInnerHTML={{ __html: svgHtml }} />
                    <div className="map-zoom-tools" aria-label="Haritayı yakınlaştır">
                        <button type="button" onClick={function () { bumpZoom(1); }} aria-label="Yakınlaştır">+</button>
                        <button type="button" onClick={function () { bumpZoom(-1); }} aria-label="Uzaklaştır">−</button>
                        <button type="button" className="map-zoom-reset" onClick={function () { bumpZoom(0); }}>Tam</button>
                    </div>
                </div>
            ) : (
                <div className="map-play-stage p-4 overflow-auto">
                    <p className="text-center text-stone-300 py-10">Harita yüklenemedi. Bağlantını kontrol edip tekrar dene.</p>
                </div>
            )}
            <footer className="map-play-foot map-ask">
                <p className="map-ask-kicker">Haritada bul ve dokun</p>
                <p className="map-ask-name">{target ? target.name : ""}</p>
                {target && target.prompt ? <p className="map-ask-hint">{target.prompt}</p> : null}
                <div className="map-ask-actions">
                    <button type="button" className="map-ask-skip" onClick={reveal}>Bilmiyorum, göster</button>
                    <span className="map-ask-meta">{misses ? (misses + " yanlış") : "Hatasız"}</span>
                </div>
            </footer>
        </div>
    );
}

function DersHome(props) {
    const kpssData = props.kpssData;
    const stats = StudyPlanner.catalogStats(kpssData);
    var groups = (window.AlanCatalog && window.AlanCatalog.groupCatalogDersler)
        ? window.AlanCatalog.groupCatalogDersler(kpssData)
        : [{ id: "all", title: "", dersler: Object.keys(kpssData) }];
    var labelOf = (window.AlanCatalog && window.AlanCatalog.dersLabel) ? window.AlanCatalog.dersLabel : function (d) { return d; };
    return (
        <Shell>
            <div className="flex justify-between items-start mb-6">
                <div className="slide-up">
                    <h1 className="m-title">Dersler</h1>
                    <p className="m-sub">Not oku, test çöz. Tüm konular açık.</p>
                </div>
                <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
            </div>
            <div className="space-y-8">
                {groups.map(function (g) {
                    var cards = g.dersler.map(function (ders) {
                        const t = themeFor(ders, props.isDark);
                        const s = stats[ders] || { konuSayisi: 0, soruSayisi: 0 };
                        if (!s.konuSayisi && !s.soruSayisi) return null;
                        return (
                            <AccentRow key={ders} title={labelOf(ders)} sub={s.konuSayisi + " konu · " + s.soruSayisi + " soru"} onClick={function () { props.onDers(ders); }} />
                        );
                    }).filter(Boolean);
                    if (!cards.length) return null;
                    return (
                        <section key={g.id}>
                            {g.title ? (
                                <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">{g.title}</p>
                            ) : null}
                            <div className="wide-grid">{cards}</div>
                        </section>
                    );
                })}
            </div>
            {function () {
                var edu = props.student && props.student.userProfile && props.student.userProfile.educationLevel;
                if (edu && edu !== "lisans") return null;
                var cfg = window.KpssConfig || {};
                var tt = (props.student && props.student.userProfile && props.student.userProfile.targetType) || "B";
                var ids = (cfg.targetModules && cfg.targetModules[tt]) || ["gygk"];
                var mods = (cfg.modules || []).filter(function (m) { return ids.indexOf(m.id) >= 0 && m.id !== "gygk" && !m.ready; });
                if (!mods.length) return null;
                return (
                    <div className="mt-10">
                        <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-4 flex items-center gap-2">
                            <span>🚀</span> Kulvarın diğer modülleri
                        </p>
                        <div className="wide-grid">
                            {mods.map(function (m) {
                                return (
                                    <div key={m.id} className="p-5 rounded-3xl glass card-hover flex items-center justify-between">
                                        <div>
                                            <p className="font-bold">{m.title}</p>
                                            <p className="text-xs text-stone-400 mt-0.5">{(m.lessons || []).slice(0, 3).join(" · ") || "İçerik bekleniyor"}</p>
                                        </div>
                                        <span className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">Yakında</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            }()}
        </Shell>
    );
}

function KonuList(props) {
    const ders = props.ders;
    const t = themeFor(ders, props.isDark);
    const konular = Object.keys(props.kpssData[ders] || {}).filter(function (k) { return k !== "_"; });
    const topics = (props.student && props.student.topics && props.student.topics[ders]) || {};
    var dersTitle = (window.AlanCatalog && window.AlanCatalog.dersLabel) ? window.AlanCatalog.dersLabel(ders) : ders;
    return (
        <Shell>
            <div className="flex justify-between mb-4">
                <BackBtn onClick={props.onBack} label="Dersler" />
                <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
            </div>
            <div className="flex items-center gap-4 mb-6">
                <div className="h-14 w-14 rounded-2xl ders-icon flex items-center justify-center text-2xl">{t.icon}</div>
                <div>
                    <h1 className="text-3xl font-black">{dersTitle}</h1>
                    <p className="text-zinc-500 text-sm">Sırayla ilerle. Konunun tüm testleri bitince sonraki açılır.</p>
                </div>
            </div>
            <div className="wide-grid">
                {konular.map(function (konu, idx) {
                    const kd = props.kpssData[ders][konu] || {};
                    const stored = topics[konu];
                    const tp = stored || { noteIndex: 0, notesDone: false, lastPct: null, attempts: 0, mastery: "yok" };
                    const m = masteryLabel(tp.mastery);
                    const nLen = (kd.notlar || []).length;
                    const notePct = !nLen ? 0 : (tp.notesDone ? 100 : (!stored ? 0 : Math.round(((tp.noteIndex + 1) / nLen) * 100)));
                    const heat = tp.mastery === "zayif" ? "heat-zayif" : tp.mastery === "orta" ? "heat-orta" : tp.mastery === "iyi" ? "heat-iyi" : "";
                    const open = StudentStore.isKonuOpen(ders, konular, idx, props.kpssData);
                    const done = StudentStore.topicComplete(tp, kd);
                    return (
                        <button key={konu} disabled={!open} onClick={function () { if (open) props.onKonu(konu); }}
                            className={"w-full text-left p-5 panel rounded-3xl " + (open ? heat : "opacity-45")}>
                            <div className="flex justify-between items-start gap-3">
                                <div className="flex gap-3 min-w-0">
                                    <div className={"h-10 w-10 rounded-xl flex items-center justify-center font-stat text-sm shrink-0 " + (done ? "bg-emerald-50 text-emerald-600" : (open ? "bg-stone-100 text-stone-700" : "bg-stone-100 text-stone-400"))}>{done ? "✓" : (open ? idx + 1 : "🔒")}</div>
                                    <div className="min-w-0">
                                        <div className="font-bold text-slate-800 dark:text-slate-100">{kLabel(konu)}</div>
                                        <p className="text-xs text-slate-400 mt-1">{open ? (function () {
                                            var packs = StudentStore.topicTestPacks(kd.sorular || []);
                                            var nLen = (kd.notlar || []).length;
                                            if (!packs.length) return nLen + " not · " + (kd.sorular || []).length + " soru";
                                            var doneN = packs.filter(function (p) { return StudentStore.isPackComplete(tp, p.no); }).length;
                                            return nLen + " not · " + doneN + "/" + packs.length + " test";
                                        })() : "Önce önceki konunun testlerini bitir"}</p>
                                    </div>
                                </div>
                                {open ? (
                                    <div className="text-right shrink-0">
                                        <div className="font-black text-sm">{tp.lastPct == null ? "—" : "%" + tp.lastPct}</div>
                                        <span className={"text-[10px] font-bold px-2 py-0.5 rounded-full " + m.cls}>{m.text}</span>
                                    </div>
                                ) : null}
                            </div>
                        </button>
                    );
                })}
            </div>
        </Shell>
    );
}

function KonuHub(props) {
    const kd = props.konuData;
    const notlar = kd.notlar || [];
    const sorular = kd.sorular || [];
    const packs = StudentStore.topicTestPacks(sorular);
    const tp = StudentStore.getTopic(props.ders, props.konu);
    const m = masteryLabel(tp.mastery);
    return (
        <Shell>
            <div className="flex justify-between mb-4">
                <BackBtn onClick={props.onBack} label="Konular" />
                <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
            </div>
            <h2 className="text-3xl font-black mb-2">{kLabel(props.konu)}</h2>
            <p className="text-slate-500 mb-2">{props.ders}</p>
            <div className="flex gap-2 mb-8">
                <span className={"text-xs font-bold px-3 py-1 rounded-full " + m.cls}>{m.text}</span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700">Son net {tp.lastPct == null ? "yok" : "%" + tp.lastPct}</span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700">{tp.attempts} deneme</span>
            </div>
            <button onClick={props.onNotes} className="group w-full text-left p-7 mb-5 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 border border-amber-200 rounded-3xl shadow-lg card-hover">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-2xl mb-4">📖</div>
                <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-2">Konu özeti</h3>
                <p className="text-sm text-amber-700">{notlar.length} hap not · {tp.notesDone ? "tamamlandı" : "kaldığın yerden"}</p>
            </button>
            {(window.ClozeEngine && window.ClozeEngine.dersEnabled(props.ders) && tp.solvedCloze && tp.solvedCloze.length) ? (
                <button type="button" onClick={function () {
                    if (!window.confirm("Bu konudaki çözülen boşluklar baştan gelsin mi?")) return;
                    StudentStore.resetCloze(props.ders, props.konu);
                }} className="w-full mb-5 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 text-sm font-semibold text-stone-600 dark:text-stone-300">
                    Boşlukları sıfırla
                </button>
            ) : null}
            {packs.length ? (
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">{sorular.length} soru · 25’lik testler · sırayla bitir</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {packs.map(function (p, pi) {
                            var packDone = StudentStore.isPackComplete(tp, p.no);
                            var packOpen = StudentStore.isPackOpen(tp, p.no);
                            return (
                                <button key={p.no} disabled={!packOpen} onClick={function () { if (packOpen) props.onTest(pi); }}
                                    className={"group text-left p-6 border rounded-3xl " + (packDone ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200" : (packOpen ? "bg-stone-50 dark:bg-stone-900 border-stone-300 card-hover" : "bg-stone-50 dark:bg-stone-900 border-stone-200 opacity-45"))}>
                                    <div className={"h-12 w-12 rounded-2xl flex items-center justify-center text-white font-black mb-3 " + (packDone ? "bg-emerald-500" : "bg-gradient-to-br from-indigo-600 to-purple-600")}>{packDone ? "✓" : p.no}</div>
                                    <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50 mb-1">Test {p.no}{p.sekilli ? " · Şekilli sorular" : ""}</h3>
                                    <p className="text-sm text-stone-500">{packDone ? "Çözüldü" : (packOpen ? (p.items.length + " soru") : ("Önce Test " + (p.no - 1) + "’i bitir"))}</p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <p className="text-sm text-stone-400">Bu konuya ait henüz soru yok.</p>
            )}
        </Shell>
    );
}

function looksHeadingText(text) {
    var t = String(text || "").replace(/\s+/g, " ").trim();
    if (!t || t.length > 80) return false;
    if (/[:：]\s+\S{8,}/.test(t)) return false;
    return true;
}

function hasBlockChild(html) {
    return /<(ul|ol|table|img|p|h[1-6])\b/i.test(String(html || ""));
}

function promoteNoteHeadings(root) {
    Array.prototype.slice.call(root.querySelectorAll("span.inline-flex")).forEach(function (sp) {
        var h = document.createElement("h3");
        h.className = "note-title";
        h.innerHTML = sp.innerHTML;
        sp.parentNode.replaceChild(h, sp);
    });
    Array.prototype.slice.call(root.querySelectorAll("p, div")).forEach(function (el) {
        if (el.querySelector("ul,ol,table,img,p,h3,h4,h5")) return;
        var cls = String(el.getAttribute("class") || "");
        var text = (el.textContent || "").replace(/\s+/g, " ").trim();
        var boldish = /font-bold|font-black|tracking-wider/.test(cls);
        var onlyLabel = el.children.length <= 1 && el.querySelector("b,strong") && text.length <= 80 && !/[:：]\s+\S{8,}/.test(text);
        if (!(boldish || onlyLabel) || !looksHeadingText(text)) return;
        var h = document.createElement("h4");
        h.className = "note-sub";
        h.innerHTML = el.innerHTML;
        el.parentNode.replaceChild(h, el);
    });
}

function shapeNoteHtml(html) {
    if (typeof document === "undefined") return html;
    var root = document.createElement("div");
    root.innerHTML = String(html || "");
    promoteNoteHeadings(root);
    Array.prototype.slice.call(root.children).forEach(function (el) {
        var tag = el.tagName;
        if (tag === "H3" || tag === "H4" || tag === "H5" || tag === "H6") return;
        if (el.querySelector && el.querySelector("span.inline-flex, h3.note-title")) return;
        if (tag === "UL" || tag === "OL" || tag === "P" || tag === "TABLE") {
            var pack = document.createElement("div");
            pack.className = "note-pack";
            el.parentNode.insertBefore(pack, el);
            pack.appendChild(el);
        }
    });
    root.querySelectorAll("li").forEach(function (li) { li.classList.add("note-chip"); });
    root.querySelectorAll(".flex-wrap > span, [class*='flex-wrap'] > span").forEach(function (sp) {
        if (sp.classList.contains("inline-flex")) return;
        if (sp.closest && sp.closest("h3,h4,.note-title,.note-sub")) return;
        sp.classList.add("note-chip");
    });
    return root.innerHTML;
}

function NotesView(props) {
    const notlar = props.notlar || [];
    const idx = props.index;
    // ← / → ile sayfa çevir (yazı alanındayken devre dışı)
    useEffect(function () {
        function onKey(e) {
            if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || isTypingTarget(e.target)) return;
            if (e.key === "ArrowLeft" && idx > 0) { e.preventDefault(); props.onIndex(idx - 1); }
            else if (e.key === "ArrowRight" && idx < notlar.length - 1) { e.preventDefault(); props.onIndex(idx + 1); }
        }
        document.addEventListener("keydown", onKey);
        return function () { document.removeEventListener("keydown", onKey); };
    }, [idx, notlar.length, props.onIndex]);
    return (
        <Shell wide={true}>
            <div className="flex justify-between items-center mb-4 gap-3">
                <BackBtn onClick={props.onBack} label="Geri" />
                <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
            </div>
            {notlar.length ? (
                <article className="study-card fade-in">
                    <header className="study-card-head">
                        <div className="min-w-0">
                            {props.ders ? <p className="study-card-kicker">{props.ders}</p> : null}
                            <h2 className="study-card-title">{kLabel(props.konu)} · Özet</h2>
                        </div>
                        <div className="note-progress">{idx + 1}/{notlar.length}</div>
                    </header>
                    <div key={idx} className={"study-card-body note-html text-[16px] leading-relaxed" + (props.ders === "Geometri" ? " note-math" : "")} dangerouslySetInnerHTML={{ __html: shapeNoteHtml(notlar[idx]) }} />
                    <footer className="study-card-foot">
                        <button disabled={idx === 0} onClick={function () { props.onIndex(idx - 1); }}
                            className={"back-btn " + (idx === 0 ? "opacity-30 pointer-events-none" : "")}>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>Önceki</span>
                        </button>
                        {idx === notlar.length - 1 ? (
                            <button onClick={function () {
                                if (props.ders && props.konu) StudentStore.markNotesComplete(props.ders, props.konu);
                                if (props.hasTest) props.onTest();
                                else props.onBack();
                            }} className="btn-primary text-white px-5 py-2.5 rounded-full font-semibold">{props.hasTest ? "Teste geç" : "Konuyu bitir"}</button>
                        ) : (
                            <button onClick={function () { props.onIndex(idx + 1); }}
                                className="btn-primary text-white px-5 py-2.5 rounded-full font-semibold inline-flex items-center gap-1">
                                <span>Sonraki</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        )}
                    </footer>
                    <p className="kbd-hint study-card-keys" aria-hidden="true"><span><kbd>←</kbd> önceki</span><span><kbd>→</kbd> sonraki</span></p>
                </article>
            ) : (
                <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-dashed">Bu konu için henüz not yok.</div>
            )}
        </Shell>
    );
}

function TestView(props) {
    const items = props.session.items;
    const qIndex = props.qIndex;
    const item = items[qIndex] || { q: { question: "", options: [], correctAnswerIndex: 0, explanation: "" } };
    const soru = item.q;
    const progress = ((qIndex + 1) / (items.length || 1)) * 100;
    const timed = props.session.secondsLeft != null;
    const mm = timed ? Math.floor(props.session.secondsLeft / 60) : 0;
    const ss = timed ? String(props.session.secondsLeft % 60).padStart(2, "0") : "";
    const tLeft = props.session.secondsLeft;
    const tCls = !timed ? "" : (tLeft <= 60 ? "text-coral-500" : tLeft <= 300 ? "text-amber-500" : "text-navy-600");
    const nextRef = useRef(null);
    useEffect(function () { if (props.answered) revealSoon(nextRef); }, [props.answered, qIndex]);
    // Klavye: A–E ya da 1–5 şık seçer; cevaptan sonra Enter / → sonraki soru.
    useEffect(function () {
        function onKey(e) {
            if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || isTypingTarget(e.target)) return;
            var n = (soru.options || []).length;
            if (!props.answered) {
                var k = String(e.key || "").toLocaleLowerCase("tr-TR");
                var i = "abcde".indexOf(k);
                if (i < 0) i = "12345".indexOf(k);
                if (k && i >= 0 && i < n) { e.preventDefault(); props.onAnswer(i); }
                return;
            }
            // odaktaki düğmede Enter zaten tıklama üretir; iki kez ilerlemesin
            if (e.key === "ArrowRight" || (e.key === "Enter" && !(e.target && e.target.tagName === "BUTTON"))) {
                e.preventDefault();
                props.onNext();
            }
        }
        document.addEventListener("keydown", onKey);
        return function () { document.removeEventListener("keydown", onKey); };
    }, [props.answered, props.onAnswer, props.onNext, qIndex, soru]);
    return (
        <Shell>
            <div className="flex justify-between items-center text-sm font-bold text-slate-500 mb-4 gap-2">
                <button onClick={props.onQuit} className="hover:text-rose-500 bg-white dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 shrink-0">Bitir</button>
                <span className="bg-white dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 min-w-0 text-right">
                    {props.session.testNo ? ("Test " + props.session.testNo + " · ") : ""}{qIndex + 1}/{items.length} · Doğru {props.score}
                    {timed ? <span className={"ml-2 font-stat " + tCls}>{mm}:{ss}</span> : null}
                </span>
            </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full mb-4 overflow-hidden">
                <div className="h-2.5 rounded-full" style={{ width: progress + "%", background: "linear-gradient(90deg, #0D2C4D, #1D8A99, #C5A059)" }} />
            </div>
            {item.ders ? <p className="text-xs font-bold text-slate-400 mb-3">{item.ders} · {kLabel(item.konu)}</p> : null}
            <div className="test-split">
            <div className="test-split-q">
            <div className="q-stem p-4 sm:p-8 rounded-3xl mb-6 relative overflow-hidden fade-in">
                <div className="q-stem-bar absolute top-0 left-0 w-1.5 h-full"></div>
                <h3 className="text-lg font-bold leading-relaxed whitespace-pre-line text-stone-900 pl-2">{soru.question}</h3>
                {SoruGorsel(soru)}
            </div>
            <p className="kbd-hint" aria-hidden="true">
                {props.answered
                    ? <span><kbd>Enter</kbd> ya da <kbd>→</kbd> sonraki soru</span>
                    : <span><kbd>A</kbd>–<kbd>{String.fromCharCode(64 + Math.max(1, (soru.options || []).length))}</kbd> ya da <kbd>1</kbd>–<kbd>{Math.max(1, (soru.options || []).length)}</kbd> ile şık seç</span>}
            </p>
            </div>
            <div className="test-split-a">
            <div className="space-y-3">
                {(soru.options || []).map(function (opt, i) {
                    let cls = "w-full text-left p-4 sm:p-5 rounded-2xl border-2 font-semibold transition-all flex items-center gap-3 sm:gap-4 option-btn ";
                    let icon = null;
                    if (props.answered) {
                        if (i === soru.correctAnswerIndex) {
                            cls += "bg-emerald-500 border-emerald-500 text-white";
                            icon = <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>;
                        } else if (i === props.picked) {
                            cls += "bg-rose-500 border-rose-500 text-white";
                            icon = <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>;
                        } else cls += "bg-slate-50 dark:bg-slate-800/50 border-slate-200 text-slate-400 opacity-60";
                    } else {
                        cls += "bg-white dark:bg-slate-800 border-slate-200 text-stone-800";
                        icon = <span className="choice-letter flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold">{String.fromCharCode(65 + i)}</span>;
                    }
                    return (
                        <button key={i} onClick={function () { props.onAnswer(i); }} disabled={props.answered} className={cls}>
                            {icon}<span className="text-[15px] min-w-0">{stripChoicePrefix(opt)}</span>
                        </button>
                    );
                })}
            </div>
            {props.answered ? (
                <div className="mt-8 space-y-4 fade-in pb-10">
                    <div className="bg-indigo-50 dark:bg-slate-900 border border-indigo-100 border-l-4 border-l-indigo-600 p-6 rounded-2xl">
                        <h4 className="font-semibold text-indigo-600 dark:text-indigo-400 text-sm mb-2">Çözüm notu</h4>
                        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{soru.explanation}</p>
                    </div>
                    {item.ders ? (
                        <button type="button" onClick={function () { StudentStore.toggleReviewBook(item.ders, item.konu, item.id); }}
                            className={"w-full p-4 rounded-2xl font-semibold border-2 " + (StudentStore.inReviewBook(item.ders, item.konu, item.id)
                                ? "border-teal-600 bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-200"
                                : "border-stone-200 bg-white dark:bg-slate-800 text-stone-800")}>
                            {StudentStore.inReviewBook(item.ders, item.konu, item.id) ? "Tekrardan çıkar" : "Tekrara at"}
                        </button>
                    ) : null}
                    <button ref={nextRef} style={{ scrollMarginBottom: "24px" }} onClick={props.onNext} className="w-full btn-primary text-white p-5 rounded-2xl font-semibold">
                        {qIndex + 1 === items.length ? "Sonuçları gör" : "Sonraki soru"}
                    </button>
                </div>
            ) : <div className="h-8" />}
            </div>
            </div>
        </Shell>
    );
}

function ResultView(props) {
    const total = props.session.items.length;
    const score = props.score;
    const oran = total ? Math.round((score / total) * 100) : 0;
    const yorum = oran >= 85 ? "Mükemmel. Bu konuyu kilitle, zayıf olana geç." : oran >= 60 ? "İyi gidiyorsun. Yanlışları deftere aldık." : oran >= 40 ? "Eşik altı. Notu aç, aynı gün 10 soru daha." : "Önce not. Soru yağmuru şimdi işe yaramaz.";
    const renk = oran >= 85 ? "#10b981" : oran >= 60 ? "#4f46e5" : oran >= 40 ? "#f59e0b" : "#ef4444";
    return (
        <Shell>
            {oran >= 85 && <Confetti />}
            <div className="panel p-8 rounded-3xl text-center fade-in">
                <h2 className="text-2xl font-display font-bold mb-2">{props.session && props.session.testNo ? ("Test " + props.session.testNo + " bitti") : "Tur bitti"}</h2>
                <p className="text-zinc-500 mb-6 text-sm">{yorum}</p>
                <div className="relative mx-auto w-36 h-36 mb-6">
                    <svg viewBox="0 0 36 36" className="w-full h-full">
                        <path d="M18 2a16 16 0 1 1 0 32 16 16 0 0 1 0-32" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                        <path d="M18 2a16 16 0 1 1 0 32 16 16 0 0 1 0-32" fill="none" stroke={renk} strokeWidth="3" strokeDasharray={oran + ", 100"} strokeLinecap="round" className="progress-ring" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="font-stat text-3xl text-indigo-600">%{oran}</span>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="p-3 rounded-2xl bg-slate-50"><div className="font-black text-xl">{total}</div><div className="text-xs text-slate-400">Soru</div></div>
                    <div className="p-3 rounded-2xl bg-emerald-50"><div className="font-black text-xl text-emerald-600">{score}</div><div className="text-xs text-emerald-500">Doğru</div></div>
                    <div className="p-3 rounded-2xl bg-rose-50"><div className="font-black text-xl text-rose-500">{total - score}</div><div className="text-xs text-rose-400">Yanlış</div></div>
                </div>
                {props.breakdown && props.breakdown.length > 1 ? (
                    <div className="text-left mb-6">
                        <h3 className="text-sm font-black text-slate-500 mb-2">Konu kırılımı — çalışılacaklar üstte</h3>
                        {props.breakdown.slice(0, 5).map(function (b) {
                            return (
                                <div key={b.ders + b.konu} className="flex justify-between text-sm py-2 border-b border-slate-100 dark:border-slate-700">
                                    <span className="pr-2">{kLabel(b.konu)}</span>
                                    <span className="font-black">%{b.pct}</span>
                                </div>
                            );
                        })}
                    </div>
                ) : null}
                {props.wrongList.length > 0 ? (
                    <details className="text-left mb-6">
                        <summary className="cursor-pointer text-sm font-bold p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">Yanlış {props.wrongList.length} soru</summary>
                        <div className="mt-3 space-y-3">
                            {props.wrongList.map(function (w, i) {
                                return (
                                    <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 border text-left">
                                        <p className="text-sm font-semibold whitespace-pre-line">{w.question}</p>
                                        {SoruGorsel(w)}
                                        <p className="text-xs mt-2 text-emerald-600 font-bold">Doğru: {w.dogru}</p>
                                        {w.ders ? (
                                            <button type="button" onClick={function () { StudentStore.toggleReviewBook(w.ders, w.konu, w.id); }}
                                                className="mt-3 text-xs font-bold px-3 py-1.5 rounded-lg border border-teal-600 text-teal-700">
                                                {StudentStore.inReviewBook(w.ders, w.konu, w.id) ? "Tekrardan çıkar" : "Tekrara at"}
                                            </button>
                                        ) : null}
                                    </div>
                                );
                            })}
                        </div>
                    </details>
                ) : null}
                <button onClick={function () {
                    if (!window.ShareCard) return;
                    const nick = (props.student && props.student.userProfile && props.student.userProfile.nickname) || "öğrenci";
                    const url = window.ShareCard.draw({
                        nickname: nick, pct: oran, correct: score, total: total,
                        streak: (props.student && props.student.streak && props.student.streak.count) || 0,
                        caption: "Net kartı · Atanly"
                    });
                    window.ShareCard.download(url, "atanly-net-karti.png");
                }} className="w-full mb-3 p-4 rounded-2xl btn-primary text-white font-semibold">Net kartını indir</button>
                <div className="flex gap-3">
                    <button onClick={props.onRetry} className="flex-1 btn-primary text-white p-4 rounded-2xl font-semibold">Tekrar</button>
                    <button onClick={props.onHome} className="flex-1 panel p-4 rounded-2xl font-medium">Kapat</button>
                </div>
            </div>
        </Shell>
    );
}

function Eksikler(props) {
    const plan = props.plan;
    const byDers = {};
    plan.rows.forEach(function (r) {
        if (!byDers[r.ders]) byDers[r.ders] = [];
        byDers[r.ders].push(r);
    });
    function rowDone(r) {
        return StudentStore.topicComplete(StudentStore.getTopic(r.ders, r.konu), {
            sorular: new Array(r.soruSayisi || 0),
            notlar: new Array(r.notSayisi || 0)
        });
    }
    var doneAll = plan.rows.filter(rowDone).length;
    var pctAll = plan.rows.length ? Math.round(doneAll / plan.rows.length * 100) : 0;
    return (
        <Shell>
            <div className="flex justify-between items-start mb-6">
                <div className="slide-up">
                    <h1 className="m-title">Eksikler</h1>
                    <p className="m-sub">Konu durumu. Not ve soru yalnızca Dersler’den.</p>
                </div>
                <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
            </div>
            <div className="glass rounded-2xl p-4 mb-3">
                <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-sm font-semibold" style={{ color: "var(--m-ink)" }}>{doneAll} / {plan.rows.length} konu tamamlandı</span>
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-full" style={{ background: "var(--m-gold-soft)", color: "var(--m-gold-ink)" }}>%{pctAll}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--m-line)" }} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pctAll} aria-label="Konu ilerlemesi">
                    <div className="h-full rounded-full" style={{ width: pctAll + "%", background: "linear-gradient(90deg,#0D2C4D,#1D8A99)" }} />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5 mb-3">
                <button onClick={function () { props.onReview(); }} disabled={!plan.due.length}
                    className="p-4 rounded-2xl text-white text-left disabled:opacity-50 disabled:cursor-not-allowed transition hover:brightness-110"
                    style={{ background: "linear-gradient(135deg,#0D2C4D,#14607A 60%,#1D8A99)" }}>
                    <span className="font-semibold block">Bugün tekrar · {plan.due.length}</span>
                    <span className="text-xs font-normal opacity-80 mt-1 block">Soru yanında Tekrara at dediklerin. Çözünce listeden düşer.</span>
                </button>
                <button onClick={function () { props.onWrong(); }} disabled={!plan.wrong.length}
                    className="p-4 rounded-2xl border-[1.5px] border-rose-400 text-left disabled:opacity-50 disabled:cursor-not-allowed transition hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    style={{ background: "var(--m-card)" }}>
                    <span className="font-semibold block text-rose-600 dark:text-rose-400">Yanlış defteri · {plan.wrong.length}</span>
                    <span className="text-xs font-normal mt-1 block" style={{ color: "var(--m-muted)" }}>Çözdüğün soru defterden düşer. Konu kilidini açmaz.</span>
                </button>
            </div>
            <LiveGaps student={props.student} kpssData={props.kpssData} onKonu={props.onKonu} />
            <AccentRow className="mb-6" accent="#127880" title="Tekrar defteri" sub="Tekrar etmek istediğin notları kendine yaz. Yalnızca sen görürsün."
                onClick={function () { props.onNotebook && props.onNotebook(); }} />
            {Object.keys(byDers).map(function (ders) {
                var rows = byDers[ders];
                var konular = Object.keys(props.kpssData[ders] || {}).filter(function (k) { return k !== "_"; });
                var doneN = rows.filter(function (r) { return rowDone(r); }).length;
                return (
                    <section key={ders} className="mb-6">
                        <div className="flex items-center justify-between mb-2.5">
                            <h2 className="text-lg font-bold" style={{ color: "var(--m-ink)" }}>{ders}</h2>
                            <span className="text-xs font-extrabold px-2.5 py-1 rounded-full" style={{ background: "var(--m-gold-soft)", color: "var(--m-gold-ink)" }}>{doneN}/{rows.length}</span>
                        </div>
                        <div className="wide-grid is-tight">
                            {rows.map(function (r) {
                                var done = rowDone(r);
                                var idx = konular.indexOf(r.konu);
                                var open = idx < 0 || StudentStore.isKonuOpen(ders, konular, idx, props.kpssData);
                                return (
                                    <AccentRow key={r.konu} accent={done ? "#D97706" : "#CBD5E1"} title={kLabel(r.konu)} disabled={!open}
                                        sub={open ? null : "Önce önceki konuyu bitir"}
                                        aside={<span className={"text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 " + (done ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300" : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300")}>{done ? "Bitti" : "Bekliyor"}</span>}
                                        onClick={function () { props.onKonu && props.onKonu(r.ders, r.konu); }} />
                                );
                            })}
                        </div>
                    </section>
                );
            })}
            {plan.rows.length ? <p className="text-center text-xs mt-2" style={{ color: "var(--m-muted)" }}>{plan.rows.length} konu takip ediliyor</p> : null}
        </Shell>
    );
}

function DenemeSetup(props) {
    const dersler = Object.keys(props.kpssData);
    const stats = StudyPlanner.catalogStats(props.kpssData);
    const [sel, setSel] = useState(function () {
        const o = {};
        dersler.forEach(function (d) { o[d] = true; });
        return o;
    });
    const [n, setN] = useState(20);
    const [mins, setMins] = useState(0);
    function toggle(d) {
        const next = Object.assign({}, sel);
        next[d] = !next[d];
        setSel(next);
    }
    const chosen = dersler.filter(function (d) { return sel[d]; });
    var pool = 0;
    chosen.forEach(function (d) { pool += (stats[d] && stats[d].soruSayisi) || 0; });
    const nOpts = [10, 20, 30, 40];
    const tOpts = [
        { v: 0, t: "Süre yok" },
        { v: 15, t: "15 dk" },
        { v: 20, t: "20 dk" },
        { v: 40, t: "40 dk" }
    ];
    return (
        <Shell>
            {props.onBack ? <div className="mb-4"><BackBtn onClick={props.onBack} label="Bugün" /></div> : null}
            <div className="flex justify-between items-start mb-6">
                <div className="slide-up">
                    <h1 className="m-title">Deneme</h1>
                    <p className="m-sub">Karışık pratik veya tam kitapçık. Konu kilidini atlatmaz; rastgele soru çeker.</p>
                </div>
                <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
            </div>

            <div className="rounded-3xl glass p-5 mb-4 card-hover">
                <div className="flex justify-between items-baseline mb-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Dersler</p>
                    <p className="text-xs text-stone-400">{chosen.length}/{dersler.length} seçili · {pool} soru</p>
                </div>
                <div className="divide-y" style={{ borderColor: "var(--m-line)" }}>
                    {dersler.map(function (d) {
                        var t = themeFor(d, props.isDark);
                        var on = !!sel[d];
                        var sc = stats[d] || { soruSayisi: 0, konuSayisi: 0 };
                        return (
                            <button type="button" key={d} onClick={function () { toggle(d); }} role="checkbox" aria-checked={on}
                                className="w-full flex items-center gap-3 py-3 text-left" style={{ borderColor: "var(--m-line)" }}>
                                <span className="text-xl w-8 text-center shrink-0" aria-hidden="true">{t.icon}</span>
                                <span className="min-w-0 flex-1">
                                    <span className="font-semibold block" style={{ color: "var(--m-ink)" }}>{d}</span>
                                    <span className="text-xs block mt-0.5" style={{ color: "var(--m-muted)" }}>{sc.konuSayisi} konu · {sc.soruSayisi} soru</span>
                                </span>
                                <span className={"h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 transition " + (on ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-300 dark:border-slate-600 text-transparent")}>
                                    <LineIcon name="check" size={14} sw={3} />
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="rounded-3xl glass p-5 mb-4 card-hover">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Soru sayısı</p>
                <p className="text-sm font-semibold mb-3">{n} soru</p>
                <div className="flex gap-2 mb-2">
                    {nOpts.map(function (x) {
                        return (
                            <button type="button" key={x} onClick={function () { setN(x); }}
                                className={"flex-1 py-2 rounded-xl text-sm font-medium border-2 " + (n === x ? "bg-indigo-600 text-white border-indigo-600" : "border-stone-200 dark:border-stone-700")}>{x}</button>
                        );
                    })}
                </div>
                <input type="range" min="5" max="50" step="5" value={n} onChange={function (e) { setN(Number(e.target.value)); }} className="w-full accent-indigo-600" />
            </div>

            <div className="rounded-3xl glass p-5 mb-5 card-hover">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Süre</p>
                <p className="text-sm font-semibold mb-3">{mins === 0 ? "Sınır yok — kendi hızında" : mins + " dakikada bitir"}</p>
                <div className="grid grid-cols-4 gap-2">
                    {tOpts.map(function (x) {
                        return (
                            <button type="button" key={x.v} onClick={function () { setMins(x.v); }}
                                className={"py-2 rounded-xl text-xs font-medium border-2 " + (mins === x.v ? "bg-indigo-600 text-white border-indigo-600" : "border-stone-200 dark:border-stone-700")}>{x.t}</button>
                        );
                    })}
                </div>
            </div>

            <button type="button" onClick={function () {
                const items = StudyPlanner.mixedQuiz(props.kpssData, chosen, n);
                if (!items.length) { alert("Seçilen derslerde soru yok."); return; }
                props.onStart(items, mins * 60);
            }} className="w-full btn-primary text-white p-4 rounded-2xl text-left">
                <span className="font-semibold block">Karışık testi başlat</span>
                <span className="text-xs font-normal text-white/75 mt-0.5 block">{chosen.length} ders · {n} soru · {mins ? mins + " dk" : "süre yok"}</span>
            </button>
            {props.onFullExam ? (
                <button type="button" onClick={props.onFullExam} className="mt-3 w-full p-4 rounded-2xl glass text-left card-hover">
                    <span className="font-semibold block">Tam deneme</span>
                    <span className="text-xs text-zinc-400 font-normal mt-0.5 block">40 soru · 40 dakika · Sınav temposu</span>
                </button>
            ) : null}
        </Shell>
    );
}

function eduLabel(id) {
    if (id === "onlisans") return "Ön lisans";
    if (id === "ortaogretim") return "Ortaöğretim";
    return "Lisans";
}

function needsKulvar(level) {
    return false;
}

function trackLabel(id) {
    var list = (window.KpssConfig && window.KpssConfig.targetTypes) || [];
    var hit = list.filter(function (x) { return x.id === id; })[0];
    return (hit && hit.t) || id || "—";
}

function fmtExam(iso) {
    if (!iso) return "—";
    var p = String(iso).split("-");
    if (p.length === 3) return p[2] + "." + p[1] + "." + p[0];
    return iso;
}

function ResetProfileModal(props) {
    const [typed, setTyped] = useState("");
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState("");
    const ok = typed.trim().toLocaleUpperCase("tr-TR") === "SIFIRLA";
    function run() {
        if (!ok || busy) return;
        if (!window.SyncEngine || !window.SyncEngine.resetProgress) {
            setErr("Sıfırlama şu an kullanılamıyor. Verilerin silinmedi.");
            return;
        }
        setBusy(true);
        setErr("");
        window.SyncEngine.resetProgress().then(function (r) {
            if (r && r.ok) {
                if (props.onClose) props.onClose();
                return;
            }
            setBusy(false);
            setErr(r && (r.reason === "offline" || r.reason === "anon")
                ? "İnternet bağlantısı ya da oturum yok. Verilerin silinmedi, tekrar dene."
                : "Sıfırlama tamamlanamadı, verilerin silinmedi. Biraz sonra tekrar dene.");
        });
    }
    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" onClick={function () { if (!busy && props.onClose) props.onClose(); }}>
            <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl fade-in" onClick={function (e) { e.stopPropagation(); }}>
                <h2 className="text-xl font-black text-stone-900 dark:text-white mb-1">Profili sıfırla</h2>
                <p className="text-sm font-bold text-rose-600 mb-4">Bunu geri alamazsın.</p>
                <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Silinecek</p>
                <p className="text-sm text-stone-600 dark:text-stone-300 mb-3 leading-relaxed">Çözdüğün sorular, netler ve deneme geçmişi, konu ilerlemesi, eksikler ve tekrar listesi, seri, rozetler, oyun rekorları, haftalık program ve Türkiye sıralamasındaki yerin.</p>
                <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Kalacak</p>
                <p className="text-sm text-stone-600 dark:text-stone-300 mb-4 leading-relaxed">Hesabın ve e-postan, adın, eğitim düzeyin, premium üyeliğin, davet kodun, Notlarım ve görünüm ayarların.</p>
                <p className="text-sm text-stone-500 mb-2">Sonra yeni sınav tarihini seçip sıfırdan başlarsın. Onaylamak için <b>SIFIRLA</b> yaz:</p>
                <input value={typed} onChange={function (e) { setTyped(e.target.value); }} placeholder="SIFIRLA" autoCapitalize="characters" autoComplete="off" disabled={busy}
                    className="w-full mb-3 px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold tracking-wider" />
                {err ? <p className="text-sm text-rose-600 mb-3">{err}</p> : null}
                <div className="flex gap-2">
                    <button type="button" disabled={!ok || busy} onClick={run} className="flex-1 py-3 rounded-xl bg-rose-600 text-white text-sm font-bold disabled:opacity-40">
                        {busy ? "Sıfırlanıyor…" : "Profili sıfırla"}
                    </button>
                    <button type="button" disabled={busy} onClick={function () { if (props.onClose) props.onClose(); }} className="px-4 py-3 rounded-xl border-2 border-stone-200 dark:border-stone-700 text-sm font-medium">Vazgeç</button>
                </div>
            </div>
        </div>
    );
}

// Çıkış onayı: önce bekleyen ilerleme buluta yazılır (en çok 4 sn), sonra oturum kapanır.
// Mobil karşılığı: mobile/src/screens/BenScreen.js içindeki çıkış sayfası.
function SignOutDialog(props) {
    const [busy, setBusy] = useState(false);
    const okRef = useRef(null);
    useEffect(function () {
        if (okRef.current) okRef.current.focus();
        function onKey(e) { if (e.key === "Escape" && !busy) props.onClose(); }
        window.addEventListener("keydown", onKey);
        return function () { window.removeEventListener("keydown", onKey); };
    }, [busy]);
    function go() {
        if (busy) return;
        setBusy(true);
        var done = false;
        var finish = function () { if (done) return; done = true; props.onConfirm(); };
        setTimeout(finish, 4000);
        try {
            if (window.SyncEngine && window.SyncEngine.sync) window.SyncEngine.sync().then(finish, finish);
            else finish();
        } catch (_e) { finish(); }
    }
    return (
        <div className="fixed inset-0 z-[80] bg-slate-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 sm:p-6"
            role="dialog" aria-modal="true" aria-labelledby="out-title" aria-describedby="out-desc"
            onClick={function (e) { if (e.target === e.currentTarget && !busy) props.onClose(); }}>
            <div className="atn-in w-full max-w-sm bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-stone-700">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                </div>
                <h2 id="out-title" className="mt-4 text-xl font-bold text-slate-900 dark:text-stone-100">Çıkış yapılsın mı?</h2>
                <p id="out-desc" className="mt-1.5 text-sm text-slate-500 dark:text-stone-400 leading-relaxed">
                    İlerlemen hesabına kaydedilir; {props.email ? <b className="font-semibold text-slate-700 dark:text-stone-200">{props.email}</b> : "aynı hesapla"} {props.email ? "ile " : ""}yeniden giriş yaptığında kaldığın yerden devam edersin.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-2.5">
                    <button type="button" onClick={props.onClose} disabled={busy} className="atn-btn-ghost">Vazgeç</button>
                    <button type="button" ref={okRef} onClick={go} disabled={busy} aria-busy={busy} className="atn-btn">
                        <span className="inline-flex items-center justify-center gap-2">{busy ? <span className="atn-spin" aria-hidden="true" /> : null}{busy ? "Kaydediliyor" : "Çıkış yap"}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

// Hesabı kalıcı olarak sil (supabase/patch-account-delete.sql → delete_my_account).
// Yanlışlıkla silinmesin diye "SİL" yazdırılır. Mobil karşılığı: mobile/src/screens/BenScreen.js.
function DeleteAccountDialog(props) {
    const [word, setWord] = useState("");
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState("");
    const inputRef = useRef(null);
    const ok = word.trim().toLocaleUpperCase("tr-TR") === "SİL";
    useEffect(function () {
        if (inputRef.current) inputRef.current.focus();
        function onKey(e) { if (e.key === "Escape" && !busy) props.onClose(); }
        window.addEventListener("keydown", onKey);
        return function () { window.removeEventListener("keydown", onKey); };
    }, [busy]);
    async function go() {
        if (!ok || busy) return;
        var sb = window.SupabaseClient && window.SupabaseClient.get && window.SupabaseClient.get();
        if (!sb) { setErr("Sunucuya bağlanılamadı. İnternetini kontrol edip tekrar dene."); return; }
        setBusy(true); setErr("");
        try {
            var r = await sb.rpc("delete_my_account");
            if (r.error) {
                var m = String(r.error.message || "") + " " + String(r.error.code || "");
                setErr(/admin_account/.test(m) ? "Yönetici hesabı uygulamadan silinemez."
                    : /PGRST202|Could not find the function/i.test(m) ? "Hesap silme şu an kullanılamıyor. Biraz sonra tekrar dene."
                    : (window.trError ? window.trError(r.error, "Hesap silinemedi.") : "Hesap silinemedi."));
                setBusy(false);
                return;
            }
            props.onDeleted();
        } catch (e) {
            setErr(window.trError ? window.trError(e, "Hesap silinemedi.") : "Hesap silinemedi.");
            setBusy(false);
        }
    }
    return (
        <div className="fixed inset-0 z-[80] bg-slate-900/55 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 sm:p-6"
            role="dialog" aria-modal="true" aria-labelledby="del-title" aria-describedby="del-desc"
            onClick={function (e) { if (e.target === e.currentTarget && !busy) props.onClose(); }}>
            <div className="atn-in w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-stone-700">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 flex items-center justify-center" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /></svg>
                </div>
                <h2 id="del-title" className="mt-4 text-xl font-bold text-slate-900 dark:text-stone-100">Hesabın kalıcı olarak silinsin mi?</h2>
                <div id="del-desc" className="mt-2 text-sm text-slate-600 dark:text-stone-300 leading-relaxed">
                    {props.email ? <p><b className="text-slate-800 dark:text-stone-100 break-all">{props.email}</b> hesabı ve şunlar silinir:</p> : <p>Hesabın ve şunlar silinir:</p>}
                    <ul className="mt-2 space-y-1 list-disc pl-5">
                        <li>Çalışma geçmişin, notların, yanlış ve tekrar defterin</li>
                        <li>Programın, rozetlerin ve sıralama kayıtların</li>
                        <li>Canlı deneme kayıtların ve sonuçların</li>
                    </ul>
                    <p className="mt-2 font-semibold text-rose-700 dark:text-rose-300">Bu işlem geri alınamaz.</p>
                </div>
                <label htmlFor="del-word" className="block mt-5 text-[13px] font-semibold text-slate-700 dark:text-stone-200">Onaylamak için <b>SİL</b> yaz</label>
                <input id="del-word" ref={inputRef} value={word} onChange={function (e) { setWord(e.target.value); setErr(""); }}
                    onKeyDown={function (e) { if (e.key === "Enter") go(); }} autoComplete="off" autoCapitalize="characters" spellCheck={false}
                    className="atn-field mt-1.5 !pl-4" placeholder="SİL" aria-invalid={err ? true : undefined} disabled={busy} />
                {err ? <p role="alert" className="mt-2 text-[13px] font-semibold text-rose-600 dark:text-rose-400">{err}</p> : null}
                <div className="mt-6 grid grid-cols-2 gap-2.5">
                    <button type="button" onClick={props.onClose} disabled={busy} className="atn-btn-ghost">Vazgeç</button>
                    <button type="button" onClick={go} disabled={!ok || busy} aria-busy={busy}
                        className="min-h-[52px] rounded-2xl font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed transition inline-flex items-center justify-center gap-2">
                        {busy ? <span className="atn-spin" aria-hidden="true" /> : null}{busy ? "Siliniyor" : "Hesabımı sil"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function Ben(props) {
    const st = props.student;
    let totQ = 0, totC = 0;
    Object.keys(st.sessions).forEach(function (d) {
        totQ += st.sessions[d].questions || 0;
        totC += st.sessions[d].correct || 0;
    });
    const overall = totQ ? Math.round((totC / totQ) * 100) : 0;
    const up = st.userProfile || {};
    const field = "w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900";
    const isAdmin = up.role === "admin";
    const [editing, setEditing] = useState(false);
    const [draftName, setDraftName] = useState("");
    const [draftTrack, setDraftTrack] = useState("B");
    const [draftEdu, setDraftEdu] = useState("");
    const [resetOpen, setResetOpen] = useState(false);
    const [outOpen, setOutOpen] = useState(false);
    const [delOpen, setDelOpen] = useState(false);
    const examPassed = !!(st.profile.examDate && st.profile.examDate < StudentStore.todayStr());
    const eduReq = up.educationChangeRequest;
    const showKulvar = needsKulvar(totQ === 0 && editing && draftEdu ? draftEdu : up.educationLevel);

    function startSettingsEdit() {
        setDraftName(st.profile.name || "");
        setDraftTrack(up.targetType || "B");
        setDraftEdu(totQ === 0 ? (up.educationLevel || "lisans") : "");
        setEditing(true);
    }

    function sendSettings() {
        var nextEdu = (totQ === 0 && draftEdu) ? draftEdu : up.educationLevel;
        StudentStore.updateProfile({ name: draftName });
        var patch = { nickname: draftName };
        if (needsKulvar(nextEdu)) patch.targetType = draftTrack;
        else patch.targetType = "B";
        StudentStore.updateUserProfile(patch);
        var wantEdu = draftEdu && draftEdu !== up.educationLevel && (!eduReq || eduReq.status !== "pending") ? draftEdu : "";
        if (wantEdu) {
            if (totQ === 0 && StudentStore.setEducationLevel) {
                StudentStore.setEducationLevel(wantEdu);
                wantEdu = "";
            } else {
                StudentStore.requestEducationChange(wantEdu);
            }
        }
        setEditing(false);
        var sb = window.SupabaseClient && window.SupabaseClient.get();
        var done = function () { if (window.SyncEngine) window.SyncEngine.sync(); };
        if (wantEdu && sb && sb.functions) {
            sb.functions.invoke("admin-action", { body: { action: "submit_edu", to: wantEdu } }).then(function () { done(); }).catch(done);
        } else {
            done();
        }
    }
    return (
        <Shell>
            <div className="flex justify-between items-start mb-6">
                <div className="slide-up">
                    <h1 className="m-title">Profil</h1>
                    <p className="m-sub">{up.email || "Hesap bağlı"}</p>
                    <p className="text-xs text-stone-400 mt-1">Ayarlar, araçlar ve plan burada.</p>
                </div>
                <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
            </div>
            <div className="ben-cols">
            <div className="grid grid-cols-3 gap-2 mb-6">
                <div className="py-4 px-2 rounded-2xl glass text-center"><div className="text-2xl font-extrabold" style={{ color: "var(--m-ink)" }}>{totQ}</div><div className="text-xs mt-1" style={{ color: "var(--m-muted)" }}>Soru</div></div>
                <div className="py-4 px-2 rounded-2xl glass text-center"><div className="text-2xl font-extrabold" style={{ color: "var(--m-ink)" }}>%{overall}</div><div className="text-xs mt-1" style={{ color: "var(--m-muted)" }}>Net</div></div>
                <div className="py-4 px-2 rounded-2xl glass text-center"><div className="text-2xl font-extrabold" style={{ color: "#D97706" }}>{(st.streak && st.streak.count) || 0}</div><div className="text-xs mt-1" style={{ color: "var(--m-muted)" }}>Seri</div></div>
            </div>
            <div className="rounded-3xl glass p-5 mb-4 card-hover">
                <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Ayarlar</p>
                    {!editing ? (
                        <button type="button" onClick={startSettingsEdit} className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Düzenle</button>
                    ) : null}
                </div>
                {eduReq && eduReq.status === "pending" && eduReq.to !== up.educationLevel ? (
                    <p className="text-sm text-amber-800 bg-amber-50 rounded-xl px-3 py-2 mt-3">Eğitim değişikliği onay bekliyor: {eduLabel(eduReq.to)}</p>
                ) : null}
                {eduReq && eduReq.status === "rejected" && editing ? (
                    <p className="text-sm text-coral-600 mt-3">Son eğitim talebi reddedildi. Yeniden seçebilirsin.</p>
                ) : null}
                {!editing ? (
                    <dl className="mt-3 divide-y divide-stone-100 dark:divide-stone-800">
                        {[
                            { k: "Ad", v: st.profile.name || "—" },
                            { k: "Eğitim", v: eduLabel(up.educationLevel) },
                            { k: "Sınav tarihi", v: fmtExam(st.profile.examDate) }
                        ].concat(needsKulvar(up.educationLevel) ? [{ k: "Kulvar", v: trackLabel(up.targetType || "B") }] : []).map(function (row) {
                            return (
                                <div key={row.k} className="py-3 flex justify-between gap-4">
                                    <dt className="text-sm text-stone-400">{row.k}</dt>
                                    <dd className="text-sm font-medium text-right">{row.v}</dd>
                                </div>
                            );
                        })}
                    </dl>
                ) : (
                    <div className="mt-3 space-y-3">
                        <label className="text-sm text-stone-500">Ad</label>
                        <input value={draftName} onChange={function (e) { setDraftName(e.target.value); }} className={field} />
                        <label className="text-sm text-stone-500">Eğitim</label>
                        {totQ === 0 ? (
                            <div>
                                <select value={draftEdu || up.educationLevel || "lisans"} onChange={function (e) { setDraftEdu(e.target.value); }} className={field + " mt-1"}>
                                    <option value="lisans">Lisans</option>
                                    <option value="onlisans">Ön lisans</option>
                                    <option value="ortaogretim">Ortaöğretim</option>
                                </select>
                                <p className="text-xs text-stone-400 mt-1">Soru çözmeden önce düzeyi burada düzeltebilirsin. Sınav tarihi ÖSYM takvimine bağlanır.</p>
                            </div>
                        ) : (
                            <div>
                                <p className="text-sm font-medium">{eduLabel(up.educationLevel)}</p>
                                <p className="text-xs text-stone-400">Düzey değişimi admin onayı ister. Sınav tarihi ÖSYM takvimine bağlanır.</p>
                                {(!eduReq || eduReq.status !== "pending") ? (
                                    <div>
                                        <label className="text-sm text-stone-500">Yeni eğitim düzeyi</label>
                                        <select value={draftEdu} onChange={function (e) { setDraftEdu(e.target.value); }} className={field + " mt-1"}>
                                            <option value="">Değiştirme</option>
                                            {up.educationLevel !== "lisans" ? <option value="lisans">Lisans</option> : null}
                                            {up.educationLevel !== "onlisans" ? <option value="onlisans">Ön lisans</option> : null}
                                            {up.educationLevel !== "ortaogretim" ? <option value="ortaogretim">Ortaöğretim</option> : null}
                                        </select>
                                    </div>
                                ) : null}
                            </div>
                        )}
                        <label className="text-sm text-stone-500">Sınav tarihi</label>
                        <p className="text-sm font-medium">{fmtExam(st.profile.examDate)}</p>
                        {showKulvar ? (
                            <div>
                                <label className="text-sm text-stone-500">Kulvar</label>
                                <select value={draftTrack} onChange={function (e) { setDraftTrack(e.target.value); }} className={field}>
                                    {((window.KpssConfig && window.KpssConfig.targetTypes) || [
                                        { id: "B", t: "B Grubu" }, { id: "A", t: "A Grubu" }, { id: "ogretmen", t: "Öğretmenlik" }, { id: "dhbt", t: "DHBT" }
                                    ]).map(function (x) {
                                        return <option key={x.id} value={x.id}>{x.t}</option>;
                                    })}
                                </select>
                            </div>
                        ) : null}
                        <div className="flex gap-2 pt-1">
                            <button type="button" onClick={sendSettings} className="flex-1 py-3 rounded-xl btn-primary text-white text-sm font-semibold">Gönder</button>
                            <button type="button" onClick={function () { setEditing(false); }} className="px-4 py-3 rounded-xl border-2 border-stone-200 text-sm font-medium">Vazgeç</button>
                        </div>
                    </div>
                )}
            </div>
            <button type="button" onClick={function () { props.onOpen && props.onOpen("leaderboard"); }}
                className="w-full mb-4 p-3.5 rounded-2xl glass text-left card-hover">
                <span className="font-medium block">Türkiye sıralaması</span>
                <span className="text-xs text-stone-400 font-normal mt-0.5 block">Haftalık soru sıralaması</span>
            </button>
            <div className="rounded-3xl glass p-5 mb-4 card-hover">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Davet</p>
                <p className="text-xs text-stone-400 mt-1">Davet kodun: <b>{StudentStore.ensureReferralCode ? StudentStore.ensureReferralCode() : (up.referralCode || "—")}</b></p>
                <label className="text-xs text-stone-400 mt-2 block">Arkadaş kodu</label>
                <input defaultValue={up.referredBy || ""} onBlur={function (e) {
                    if (window.PaymentClient) window.PaymentClient.applyReferral(e.target.value);
                }} className={field + " mt-1"} />
            </div>
            <div className="rounded-3xl glass p-5 mb-4 card-hover">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Rozetler</p>
                <p className="text-xs text-stone-400 mb-2">Seri, soru ve ilk deneme hedefleri.</p>
                <div className="flex flex-wrap gap-2">
                    {[
                        { id: "firstDay", title: "İlk çalışma günü" },
                        { id: "streak7", title: "7 gün kesintisiz" },
                        { id: "q1000", title: "1000 soru" },
                        { id: "firstExam", title: "İlk tam deneme" }
                    ].map(function (b) {
                        var on = st.achievements && st.achievements[b.id];
                        return (
                            <span key={b.id} className={"text-xs font-medium px-2 py-1 rounded-full inline-flex items-center gap-1 " + (on ? "bg-emerald-50 text-emerald-600 pop-in" : "bg-stone-100 dark:bg-slate-800 text-stone-400")}>
                                {on ? null : (window.KpssIcon ? window.KpssIcon("lock", "w-3 h-3") : null)}
                                {b.title}
                            </span>
                        );
                    })}
                </div>
            </div>
            <button onClick={function () {
                if (window.NotificationEngine) window.NotificationEngine.requestPush().then(function (r) {
                    if (r.ok) {
                        var n = window.NotificationEngine.streakNudge(st);
                        if (n) window.NotificationEngine.showLocal("Atanly", n);
                    }
                });
            }} className="w-full mb-3 p-3.5 rounded-2xl glass text-left card-hover">
                <span className="font-medium block">Hatırlatma izni</span>
                <span className="text-xs text-stone-400 font-normal mt-0.5 block">Tarayıcı bildirimi: seri bozulmasın diye "bugün çalış" uyarısı. İstersen kapatırsın.</span>
            </button>
            {isAdmin ? (
                <button onClick={function () { props.onAdmin && props.onAdmin(); }} className="w-full mb-3 p-3.5 rounded-2xl glass text-left card-hover font-medium">Yönetim</button>
            ) : null}
            {examPassed ? (
                <button type="button" onClick={function () { setResetOpen(true); }} className="w-full mb-3 p-3.5 rounded-2xl glass text-left card-hover">
                    <span className="font-medium block">Sınavın bitti mi? Yeni döneme başla</span>
                    <span className="text-xs text-stone-400 font-normal mt-0.5 block">Çalışma geçmişini sıfırla, hesabın ve notların kalsın.</span>
                </button>
            ) : (
                <button type="button" onClick={function () { setResetOpen(true); }} className="w-full mb-1 p-3.5 rounded-2xl text-sm text-stone-400">Profili sıfırla</button>
            )}
            {resetOpen ? <ResetProfileModal onClose={function () { setResetOpen(false); }} /> : null}
            <button type="button" onClick={function () { setDelOpen(true); }} className="w-full mb-3 p-3.5 rounded-2xl text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30">Hesabımı sil</button>
            {delOpen ? <DeleteAccountDialog email={(props.authSession && props.authSession.user && props.authSession.user.email) || ""}
                onClose={function () { setDelOpen(false); }}
                onDeleted={function () { setDelOpen(false); props.onAccountDeleted && props.onAccountDeleted(); }} /> : null}
            <div className="text-[11px] text-stone-400 text-center leading-relaxed mb-3 space-x-1">
                <a className="underline" href="yasal/aydinlatma.html">KVKK Aydınlatma</a>
                <span>·</span>
                <a className="underline" href="yasal/kullanim.html">Kullanım</a>
                <span>·</span>
                <a className="underline" href="yasal/uyelik.html">Üyelik</a>
                <span>·</span>
                <a className="underline" href="yasal/gizlilik.html">Gizlilik</a>
                <span>·</span>
                <a className="underline" href="yasal/cerez.html">Çerez</a>
                <span>·</span>
                <a className="underline" href="yasal/basvuru.html">KVKK başvuru</a>
            </div>
            <button onClick={function () { setOutOpen(true); }} className="w-full p-3.5 rounded-2xl border-2 border-stone-200 dark:border-stone-700 font-medium">Çıkış</button>
            </div>
            {outOpen ? <SignOutDialog email={(props.authSession && props.authSession.user && props.authSession.user.email) || ""}
                onClose={function () { setOutOpen(false); }}
                onConfirm={function () { props.onSignOut && props.onSignOut(); }} /> : null}
        </Shell>
    );
}

function toItemsFromKonu(kpssData, ders, konu) {
    const sorular = ((kpssData[ders] || {})[konu] || {}).sorular || [];
    return sorular.map(function (q, idx) {
        const id = q.id != null ? q.id : idx;
        return { ders: ders, konu: konu, q: q, id: id, qid: StudentStore.qid(ders, konu, id) };
    });
}

function packFromKonu(kpssData, ders, konu, packIdx) {
    var packs = StudentStore.topicTestPacks(toItemsFromKonu(kpssData, ders, konu));
    if (!packs.length) return null;
    var i = packIdx == null ? 0 : packIdx;
    if (i < 0 || i >= packs.length) i = 0;
    return packs[i];
}

// Not/soru görsellerine dokununca tam ekran büyütme (haritalar telefonda okunabilsin).
function ImageZoom() {
    const [src, setSrc] = useState(null);
    const [zoom, setZoom] = useState(1);
    const dragRef = useRef(null);
    const imgRef = useRef(null);
    const posRef = useRef({ x: 0, y: 0 });

    useEffect(function () {
        function onClick(e) {
            var img = e.target && e.target.tagName === "IMG" ? e.target : null;
            if (!img) return;
            if (!img.closest(".note-html, .q-stem, .study-card-body, .zoomable")) return;
            if (img.closest("a, button")) return;
            e.preventDefault();
            posRef.current = { x: 0, y: 0 };
            setZoom(1);
            setSrc(img.currentSrc || img.src);
        }
        document.addEventListener("click", onClick);
        return function () { document.removeEventListener("click", onClick); };
    }, []);

    useEffect(function () {
        function onKey(e) { if (e.key === "Escape") setSrc(null); }
        if (src) document.addEventListener("keydown", onKey);
        return function () { document.removeEventListener("keydown", onKey); };
    }, [src]);

    function applyTransform(z, x, y) {
        posRef.current = { x: x, y: y };
        if (imgRef.current) imgRef.current.style.transform = "translate(" + x + "px," + y + "px) scale(" + z + ")";
    }

    function toggleZoom(e) {
        var next = zoom > 1 ? 1 : 2.4;
        setZoom(next);
        applyTransform(next, 0, 0);
        if (e) e.stopPropagation();
    }

    function onPointerDown(e) {
        if (zoom <= 1) return;
        dragRef.current = { x: e.clientX, y: e.clientY, ox: posRef.current.x, oy: posRef.current.y };
        if (e.currentTarget.setPointerCapture) e.currentTarget.setPointerCapture(e.pointerId);
    }
    function onPointerMove(e) {
        var d = dragRef.current;
        if (!d) return;
        applyTransform(zoom, d.ox + (e.clientX - d.x), d.oy + (e.clientY - d.y));
    }
    function onPointerUp() { dragRef.current = null; }

    if (!src) return null;
    return (
        <div className="img-zoom" onClick={function () { setSrc(null); }}>
            <img ref={imgRef} src={src} alt="" className="img-zoom-pic"
                style={{ transform: "translate(" + posRef.current.x + "px," + posRef.current.y + "px) scale(" + zoom + ")", cursor: zoom > 1 ? "grab" : "zoom-in" }}
                onClick={toggleZoom}
                onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} />
            <div className="img-zoom-bar">
                <button type="button" onClick={toggleZoom}>{zoom > 1 ? "Küçült" : "Büyüt"}</button>
                <button type="button" onClick={function (e) { e.stopPropagation(); setSrc(null); }}>Kapat</button>
            </div>
        </div>
    );
}

function App() {
    const student = useStudent();
    const isDark = !!(student.profile && student.profile.dark);
    // window.kpssData her okunuşta yeni nesne üretir; bir kez al ki plan/filtre her render'da baştan hesaplanmasın.
    const rawData = useMemo(function () {
        return (typeof window !== "undefined" && window.kpssData) ? window.kpssData : {};
    }, []);
    const kpssData = useMemo(function () {
        var ac = window.AlanCatalog;
        return (ac && ac.filterCatalog) ? ac.filterCatalog(rawData, student) : rawData;
    }, [rawData, student]);
    const plan = useMemo(function () {
        return StudyPlanner.buildPlan(kpssData, student);
    }, [kpssData, student]);

    const [extra, setExtra] = useState(null);
    const [liveView, setLiveView] = useState({ view: "home" });
    const [LazyCmp, setLazyCmp] = useState(null);
    const [authReady, setAuthReady] = useState(false);
    const [authSession, setAuthSession] = useState(null);
    const [GateAuth, setGateAuth] = useState(null);
    const [AdminCmp, setAdminCmp] = useState(null);
    const [lazyErr, setLazyErr] = useState("");
    const [roleChecked, setRoleChecked] = useState(false);
    const [announce, setAnnounce] = useState("");
    const [pwRecovery, setPwRecovery] = useState(function () {
        return !!(window.SupabaseClient && window.SupabaseClient.recoveryPending && window.SupabaseClient.recoveryPending());
    });
    const [OnboardCmp, setOnboardCmp] = useState(null);
    const [profileHydrated, setProfileHydrated] = useState(false);
    const signingOutRef = useRef(false);

    function doSignOut() {
        signingOutRef.current = true;
        setAuthSession(null);
        setPwRecovery(false);
        setProfileHydrated(false);
        setRoleChecked(false);
        var sb = window.SupabaseClient && window.SupabaseClient.get && window.SupabaseClient.get();
        var finish = function () {
            if (window.StudentStore && window.StudentStore.bindToUser) window.StudentStore.bindToUser(null);
        };
        if (sb && sb.auth && sb.auth.signOut) sb.auth.signOut().then(finish).catch(finish);
        else finish();
    }

    const LAZY = {
        onboarding: ["OnboardingScreen", "js/components/OnboardingScreen.jsx"],
        auth: ["AuthScreen", "js/components/AuthScreen.jsx"],
        leaderboard: ["LeaderboardScreen", "js/components/LeaderboardScreen.jsx"],
        exam: ["ExamSimulator", "js/components/ExamSimulator.jsx"],
        admin: ["AdminDashboard", "js/components/AdminDashboard.jsx"],
        placement: ["PlacementScreen", "js/components/PlacementScreen.jsx"],
        ai: ["AiAssistant", "js/components/AiAssistant.jsx"],
        live: ["LiveExamScreen", "js/components/LiveExamScreen.jsx"],
        heat: ["Heatmap30", "js/components/Heatmap30.jsx"],
        instructor: ["InstructorScreen", "js/components/InstructorScreen.jsx"],
        paywall: ["PaywallScreen", "js/components/PaywallScreen.jsx"],
        notebook: ["ReviewNotebook", "js/components/ReviewNotebook.jsx"]
    };

    useEffect(function () {
        if ((student.profile && student.profile.onboarded) || !window.JsxLoader) return;
        window.JsxLoader.load("OnboardingScreen", "js/components/OnboardingScreen.jsx").then(function (C) {
            if (C) setOnboardCmp(function () { return C; });
        }).catch(function () {});
    }, [student.profile && student.profile.onboarded]);

    useEffect(function () {
        if (!extra || extra === "onboarding") return;
        if (extra === "instructor" || extra === "admin" || extra === "exam") {
            setExtra(null);
            return;
        }
        if (extra === "paywall" && !(window.KpssConfig && window.KpssConfig.premiumEnabled)) {
            setExtra(null);
            return;
        }
        var spec = LAZY[extra];
        if (!spec || !window.JsxLoader) {
            setLazyErr("Bu araç bulunamadı.");
            return;
        }
        setLazyCmp(null);
        setLazyErr("");
        window.JsxLoader.load(spec[0], spec[1]).then(function (C) {
            if (C) setLazyCmp(function () { return C; });
            else setLazyErr("Araç yüklenemedi.");
        }).catch(function (e) {
            setLazyErr((window.trError && window.trError(e, "Araç yüklenemedi.")) || "Araç yüklenemedi.");
        });
    }, [extra]);

    useEffect(function () {
        var sb = window.SupabaseClient && window.SupabaseClient.get && window.SupabaseClient.get();
        if (!sb) { setAuthReady(true); return; }
        sb.auth.getSession().then(function (r) {
            var sess = r.data && r.data.session;
            var recovering = !!(window.SupabaseClient && window.SupabaseClient.recoveryPending && window.SupabaseClient.recoveryPending());
            if (recovering) {
                if (window.SupabaseClient.markRecovery) window.SupabaseClient.markRecovery();
                setPwRecovery(true);
            }
            setAuthSession(sess || null);
            setAuthReady(true);
            if (sess && !recovering) {
                if (window.StudentStore && window.StudentStore.bindToUser) {
                    window.StudentStore.bindToUser(sess.user.id, sess.user.email);
                }
                if (window.StudentStore && window.StudentStore.consumeSignupIfNeeded) {
                    window.StudentStore.consumeSignupIfNeeded(sess.user);
                }
                var st0 = window.StudentStore && window.StudentStore.getState && window.StudentStore.getState();
                if (st0 && st0.profile && st0.profile.onboarded) setProfileHydrated(true);
                var done0 = function () { setProfileHydrated(true); };
                if (window.SyncEngine && window.SyncEngine.ensureLocation) window.SyncEngine.ensureLocation();
                if (window.SyncEngine && window.SyncEngine.sync) window.SyncEngine.sync().then(done0).catch(done0);
                else done0();
            }
        }).catch(function () { setAuthReady(true); });
        var sub = sb.auth.onAuthStateChange(function (event, sess) {
            setAuthReady(true);
            if (event === "PASSWORD_RECOVERY") {
                if (window.SupabaseClient && window.SupabaseClient.markRecovery) window.SupabaseClient.markRecovery();
                setPwRecovery(true);
                if (sess) setAuthSession(sess);
                return;
            }
            if (event === "SIGNED_OUT") {
                signingOutRef.current = true;
                setAuthSession(null);
                setPwRecovery(false);
                setProfileHydrated(false);
                setRoleChecked(false);
                if (window.StudentStore && window.StudentStore.bindToUser) window.StudentStore.bindToUser(null);
                return;
            }
            if (!sess) return;
            signingOutRef.current = false;
            if (window.SupabaseClient && window.SupabaseClient.recoveryPending && window.SupabaseClient.recoveryPending()) {
                if (window.SupabaseClient.markRecovery) window.SupabaseClient.markRecovery();
                setPwRecovery(true);
                setAuthSession(sess);
                return;
            }
            setAuthSession(sess);
            if (window.StudentStore && window.StudentStore.bindToUser) {
                window.StudentStore.bindToUser(sess.user.id, sess.user.email);
            }
            if (window.StudentStore && window.StudentStore.consumeSignupIfNeeded) {
                window.StudentStore.consumeSignupIfNeeded(sess.user);
            }
            var st1 = window.StudentStore && window.StudentStore.getState && window.StudentStore.getState();
            if (st1 && st1.profile && st1.profile.onboarded) setProfileHydrated(true);
            var done1 = function () { setProfileHydrated(true); };
            if (window.SyncEngine && window.SyncEngine.ensureLocation) window.SyncEngine.ensureLocation();
            if (window.SyncEngine && window.SyncEngine.sync) window.SyncEngine.sync().then(done1).catch(done1);
            else done1();
        });
        return function () {
            if (sub && sub.data && sub.data.subscription) sub.data.subscription.unsubscribe();
        };
    }, []);

    useEffect(function () {
        if (!authSession) signingOutRef.current = false;
    }, [authSession]);

    useEffect(function () {
        if (authReady && (!authSession || pwRecovery) && window.JsxLoader) {
            window.JsxLoader.load("AuthScreen", "js/components/AuthScreen.jsx").then(function (C) {
                if (C) setGateAuth(function () { return C; });
            });
        }
    }, [authReady, authSession, pwRecovery]);

    useEffect(function () {
        if (!authSession) {
            setRoleChecked(false);
            setAdminCmp(null);
            return;
        }
        setRoleChecked(false);
        var uid = authSession.user.id;
        var sb = window.SupabaseClient && window.SupabaseClient.get && window.SupabaseClient.get();
        var settled = false;
        function finish(isAdm, flags) {
            if (settled) return;
            settled = true;
            if (StudentStore.applyServerFlags) {
                StudentStore.applyServerFlags(Object.assign({
                    role: isAdm ? "admin" : "student"
                }, flags || {}));
            }
            if (isAdm && window.JsxLoader) {
                window.JsxLoader.load("AdminDashboard", "js/components/AdminDashboard.jsx").then(function (C) {
                    if (C) setAdminCmp(function () { return C; });
                    setRoleChecked(true);
                }).catch(function (e) {
                    console.warn(e);
                    setRoleChecked(true);
                });
            } else {
                setRoleChecked(true);
            }
        }
        if (!sb) { finish(false); return; }
        var timed = setTimeout(function () { finish(false); }, 8000);
        function fromRow(r) {
            clearTimeout(timed);
            var row = (r && r.data) || {};
            var blocked = !!(row.blocked || (row.payload && row.payload.userProfile && row.payload.userProfile.blocked));
            finish(row.role === "admin", { premium: !!row.premium, blocked: blocked });
        }
        sb.from("student_states").select("role,premium,blocked,payload").eq("user_id", uid).maybeSingle().then(function (r) {
            if (r && r.error) {
                return sb.from("student_states").select("role,premium,payload").eq("user_id", uid).maybeSingle();
            }
            return r;
        }).then(fromRow).catch(function () {
            clearTimeout(timed);
            finish(false);
        });
        return function () { clearTimeout(timed); };
    }, [authSession]);

    useEffect(function () {
        if (!authSession) { setAnnounce(""); return; }
        function pickBanner(rows) {
            var now = Date.now();
            var i;
            for (i = 0; i < (rows || []).length; i++) {
                var raw = String((rows[i] && rows[i].body) || "");
                var exp = rows[i] && rows[i].expires_at;
                var m = raw.match(/^<!--kpss-exp:([^>]+)-->/);
                if (m) {
                    exp = m[1];
                    raw = raw.slice(m[0].length);
                }
                if (exp) {
                    var ts = new Date(exp).getTime();
                    if (!isFinite(ts) || ts <= now) continue;
                }
                if (raw.trim()) return raw.trim();
            }
            return "";
        }
        function loadBanner() {
            var sb = window.SupabaseClient && window.SupabaseClient.get && window.SupabaseClient.get();
            if (!sb) return;
            function apply(r) {
                if (r.error) return;
                setAnnounce(pickBanner(r.data));
            }
            sb.from("app_announcements").select("body,created_at,expires_at").eq("published", true).order("created_at", { ascending: false }).limit(20)
                .then(function (r) {
                    if (r.error && /expires_at/i.test(r.error.message || "")) {
                        return sb.from("app_announcements").select("body,created_at").eq("published", true).order("created_at", { ascending: false }).limit(20).then(apply);
                    }
                    apply(r);
                });
        }
        loadBanner();
        var t = setInterval(loadBanner, 60000);
        return function () { clearInterval(t); };
    }, [authSession]);

    const [nav, setNav] = useState("bugun");
    const [selectedDers, setSelectedDers] = useState(null);
    const [denemeOpen, setDenemeOpen] = useState(false);
    const [navOutOpen, setNavOutOpen] = useState(false);
    const [selectedKonu, setSelectedKonu] = useState(null);
    const [drillKind, setDrillKind] = useState(null);
    const [drillMapTopic, setDrillMapTopic] = useState(null);
    const [drillDers, setDrillDers] = useState(null);
    const [drillKonu, setDrillKonu] = useState(null);
    const [drillSeed, setDrillSeed] = useState(0);
    const [drillGameCmp, setDrillGameCmp] = useState(null);
    const [drillGameErr, setDrillGameErr] = useState("");
    const [viewMode, setViewMode] = useState("hub");
    const [noteIndex, setNoteIndex] = useState(0);
    const [session, setSession] = useState(null);
    const [qIndex, setQIndex] = useState(0);
    const [picked, setPicked] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [wrongList, setWrongList] = useState([]);
    const [finished, setFinished] = useState(false);
    const [answerLog, setAnswerLog] = useState([]);
    const startedAt = useRef(null);
    const scoreRef = useRef(0);
    const finishedRef = useRef(false);
    const sessionRef = useRef(null);

    useEffect(function () {
        if (isDark) document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
    }, [isDark]);

    useEffect(function () {
        sessionRef.current = session;
    }, [session]);

    useEffect(function () {
        var names = { conquer: "ConquerPlay", tabu: "TabuPlay", panic: "PanicPlay" };
        var name = names[drillKind];
        if (!name || !window.JsxLoader) {
            setDrillGameCmp(null);
            setDrillGameErr("");
            return;
        }
        setDrillGameErr("");
        window.JsxLoader.load(name, "js/components/DrillGames.jsx").then(function (C) {
            if (C) setDrillGameCmp(function () { return C; });
            else setDrillGameErr("Oyun yüklenemedi.");
        }).catch(function (e) {
            setDrillGameErr((window.trError && window.trError(e, "Oyun yüklenemedi.")) || "Oyun yüklenemedi.");
        });
    }, [drillKind]);

    useEffect(function () {
        if (!session || finished || session.secondsLeft == null) return;
        if (session.secondsLeft <= 0) {
            finishSession();
            return;
        }
        const t = setTimeout(function () {
            setSession(function (cur) {
                if (!cur || cur.secondsLeft == null) return cur;
                return Object.assign({}, cur, { secondsLeft: cur.secondsLeft - 1 });
            });
        }, 1000);
        return function () { clearTimeout(t); };
    }, [session, finished]);

    function toggleDark() { StudentStore.setDark(!isDark); }

    function resetTestUi() {
        scoreRef.current = 0;
        finishedRef.current = false;
        setQIndex(0); setPicked(null); setAnswered(false); setScore(0); setWrongList([]); setFinished(false); setAnswerLog([]);
    }

    function startSession(items, opts) {
        opts = opts || {};
        if (!items.length) { alert("Soru yok."); return; }
        if (opts.mode === "mixed") {
            var gate = StudentStore.consumeMixed ? StudentStore.consumeMixed() : { ok: true };
            if (!gate.ok) { alert(gate.reason); return; }
        }
        resetTestUi();
        startedAt.current = Date.now();
        const next = {
            items: items,
            mode: opts.mode || "topic",
            secondsLeft: opts.seconds || null,
            ders: opts.ders || null,
            konu: opts.konu || null,
            testNo: opts.testNo || null
        };
        sessionRef.current = next;
        setSession(next);
    }

    // Tam deneme: 5 ders, 40 soru, 40 dakika. Ücretsizde haftalık kota (mobil: components/SmartPlan.js startPlanExam).
    function startFullExam() {
        var cfg = window.KpssConfig || {};
        if (!(StudentStore.isPremium && StudentStore.isPremium())) {
            var ws = window.SyncEngine && window.SyncEngine.weekStart ? window.SyncEngine.weekStart() : "";
            var weekExams = (student.examAttempts || []).filter(function (a) { return a.at && a.at.slice(0, 10) >= ws; }).length;
            if (weekExams >= (cfg.freeWeeklyExams || 2)) {
                if (cfg.premiumEnabled && confirm("Ücretsiz haftalık tam deneme kotan doldu. Premium'u incelemek ister misin?")) setExtra("paywall");
                else if (!cfg.premiumEnabled) alert("Ücretsiz haftalık tam deneme kotan doldu. Bugün karışık test çözebilirsin.");
                return;
            }
        }
        var items = StudyPlanner.mixedQuiz(kpssData, ["Tarih", "Coğrafya", "Türkçe", "Vatandaşlık", "Güncel Bilgiler"], 40);
        startSession(items, { mode: "exam", seconds: 40 * 60 });
    }

    function finishSession() {
        if (finishedRef.current) return;
        finishedRef.current = true;
        const sess = sessionRef.current;
        if (!sess) {
            setFinished(true);
            return;
        }
        const elapsedMin = Math.max(0, Math.round((Date.now() - (startedAt.current || Date.now())) / 60000));
        if (sess.mode === "topic" && sess.ders && sess.konu) {
            StudentStore.recordTestResult(sess.ders, sess.konu, { correct: scoreRef.current, total: sess.items.length, minutes: elapsedMin, testNo: sess.testNo });
        } else if (elapsedMin) {
            StudentStore.addSessionStats({ minutes: elapsedMin, seans: true, ders: sess.ders || null });
        }
        if (sess.mode === "exam" && StudentStore.recordExamAttempt) {
            var usedSec = Math.round((Date.now() - (startedAt.current || Date.now())) / 1000);
            StudentStore.recordExamAttempt({ total: sess.items.length, correct: scoreRef.current, secondsUsed: Math.min(usedSec, 40 * 60) });
        }
        setFinished(true);
    }

    function handleAnswer(i) {
        if (answered || !session) return;
        const item = session.items[qIndex];
        const ok = i === item.q.correctAnswerIndex;
        setPicked(i); setAnswered(true);
        StudentStore.recordAnswer({ ders: item.ders, konu: item.konu, id: item.id, correct: ok, fromWrongBook: session.mode === "wrong", fromReview: session.mode === "review" });
        StudentStore.addSessionStats({ questions: 1, correct: ok ? 1 : 0 });
        setAnswerLog(function (l) { return l.concat([{ ders: item.ders, konu: item.konu, ok: ok }]); });
        if (ok) {
            scoreRef.current += 1;
            setScore(scoreRef.current);
        }
            else setWrongList(function (w) {
            return w.concat([{ question: item.q.question, img: item.q.img, imgs: item.q.imgs, imgAlt: item.q.imgAlt, dogru: stripChoicePrefix(item.q.options[item.q.correctAnswerIndex]), ders: item.ders, konu: item.konu, id: item.id }]);
        });
    }

    function nextQ() {
        if (qIndex + 1 < session.items.length) {
            setQIndex(qIndex + 1); setPicked(null); setAnswered(false);
        } else finishSession();
    }

    function closeStudy() {
        setSession(null); setFinished(false); resetTestUi();
        setViewMode("hub");
    }

    function openLive(view, examId) {
        setLiveView({ view: view || "home", examId: examId || null });
        setLazyCmp(null); setLazyErr("");
        setExtra("live");
    }

    function openKonu(ders, konu) {
        setNav("dersler");
        setSelectedDers(ders);
        setSelectedKonu(konu);
        setViewMode("hub");
        setSession(null);
        setFinished(false);
        const tp = StudentStore.getTopic(ders, konu);
        setNoteIndex(tp.noteIndex || 0);
    }

    function onTask(task) {
        if (task.kind === "notes") {
            openKonu(task.ders, task.konu);
            const nLen = (((kpssData[task.ders] || {})[task.konu] || {}).notlar || []).length;
            const tp = StudentStore.getTopic(task.ders, task.konu);
            StudentStore.setNoteIndex(task.ders, task.konu, tp.noteIndex || 0, nLen);
            setViewMode("notlar");
        } else if (task.kind === "test") {
            var packs = StudentStore.topicTestPacks(toItemsFromKonu(kpssData, task.ders, task.konu));
            var pi = StudentStore.firstOpenPackIndex(StudentStore.getTopic(task.ders, task.konu), packs.length);
            var pack = packs[pi];
            setNav("dersler"); setSelectedDers(task.ders); setSelectedKonu(task.konu); setViewMode("hub");
            if (pack) startSession(pack.items, { mode: "topic", ders: task.ders, konu: task.konu, testNo: pack.no });
        } else if (task.kind === "review") {
            startSession(plan.due.slice(0, 25), { mode: "review" });
        } else if (task.kind === "wrong") {
            startSession(plan.wrong.slice(0, 25), { mode: "wrong" });
        }
    }

    if (!kpssData || !Object.keys(kpssData).length) {
        return (
            <div className="brand-backdrop flex flex-col items-center justify-center min-h-screen gap-4">
                <p className="font-medium text-lg" style={{ color: "rgba(245,235,199,0.9)" }}>Veriler yüklenemedi. Sayfayı yenileyin.</p>
            </div>
        );
    }

    const inTest = !!session;
    const inMapPlay = nav === "alistirmalar" && drillKind === "map" && !!drillMapTopic;
    const inDrillGame = nav === "alistirmalar" && (drillKind === "conquer" || drillKind === "tabu" || drillKind === "panic");
    const konuData = (selectedDers && selectedKonu && kpssData[selectedDers]) ? (kpssData[selectedDers][selectedKonu] || {}) : {};

    let body = null;
    if (inTest && finished) {
        body = (
            <ResultView
                session={session} score={score} wrongList={wrongList} student={student}
                breakdown={StudyPlanner.breakdownByTopic(answerLog)}
                onRetry={function () {
                    if (session.mode === "wrong") startSession(plan.wrong.slice(0, 30), { mode: "wrong" });
                    else if (session.mode === "exam") startFullExam();
                    else startSession(session.items, { mode: session.mode, ders: session.ders, konu: session.konu, seconds: null, testNo: session.testNo });
                }}
                onHome={closeStudy}
            />
        );
    } else if (inTest) {
        body = (
            <TestView session={session} qIndex={qIndex} picked={picked} answered={answered} score={score}
                onAnswer={handleAnswer} onNext={nextQ}
                onQuit={function () { if (confirm("Testten çıkmak istediğinize emin misiniz? Cevapladıkların kayıtlı kalır.")) { closeStudy(); } }} />
        );
    } else if (nav === "bugun") {
        body = <Bugun student={student} plan={plan} kpssData={kpssData} isDark={isDark} toggleDark={toggleDark}
            onDers={function (d) { setNav("dersler"); setSelectedDers(d); setSelectedKonu(null); }}
            onKonu={function (d, k, mode) {
                setNav("dersler"); setSelectedDers(d); setSelectedKonu(k);
                setViewMode(mode === "notes" ? "notlar" : "hub");
                setNoteIndex(StudentStore.getTopic(d, k).noteIndex || 0);
            }}
            onReview={function () { startSession(plan.due.slice(0, 30), { mode: "review" }); }}
            onWrong={function () { startSession(plan.wrong.slice(0, 30), { mode: "wrong" }); }}
            onMixed={function () { startSession(StudyPlanner.mixedQuiz(kpssData, null, 10), { mode: "mixed" }); }}
            onExam={startFullExam}
            onDeneme={function () { setDenemeOpen(true); }}
            onLive={openLive} />;
        if (denemeOpen) {
            body = <DenemeSetup kpssData={kpssData} isDark={isDark} toggleDark={toggleDark}
                onBack={function () { setDenemeOpen(false); }}
                onStart={function (items, seconds) { startSession(items, { mode: "mixed", seconds: seconds || null }); }}
                onFullExam={startFullExam} />;
        }
    } else if (nav === "eksikler") {
        body = <Eksikler plan={plan} isDark={isDark} toggleDark={toggleDark} student={student} kpssData={kpssData} onKonu={openKonu}
            onReview={function () { startSession(plan.due.slice(0, 30), { mode: "review" }); }}
            onWrong={function () { startSession(plan.wrong.slice(0, 30), { mode: "wrong" }); }}
            onNotebook={function () { setExtra("notebook"); }} />;
    } else if (nav === "ben") {
        body = <Ben student={student} isDark={isDark} toggleDark={toggleDark} authSession={authSession}
            onOpen={function (id) { setExtra(id); }}
            onAdmin={function () { setExtra("admin"); }}
            onSignOut={doSignOut}
            onAccountDeleted={function () {
                var uid = authSession && authSession.user && authSession.user.id;
                if (StudentStore.forgetUser) StudentStore.forgetUser(uid);
                doSignOut();
                setTimeout(function () { alert("Hesabın ve verilerin silindi. Atanly'yi kullandığın için teşekkürler."); }, 300);
            }} />;
    } else if (nav === "alistirmalar") {
        var drillData = (drillDers && drillKonu && kpssData[drillDers]) ? (kpssData[drillDers][drillKonu] || {}) : {};
        if (!drillKind) {
            body = <AlistirmalarHome isDark={isDark} toggleDark={toggleDark}
                onKind={function (k) { setDrillKind(k); setDrillDers(null); setDrillKonu(null); setDrillSeed(Date.now()); }} />;
        } else if (drillKind === "map") {
            if (!drillMapTopic) {
                body = <MapTopics isDark={isDark} toggleDark={toggleDark}
                    onBack={function () { setDrillKind(null); }}
                    onTopic={function (id) { setDrillMapTopic(id); setDrillSeed(Date.now()); }} />;
            } else {
                body = <MapPlay topicId={drillMapTopic} seed={drillSeed} isDark={isDark} toggleDark={toggleDark}
                    onBack={function () { setDrillMapTopic(null); }}
                    onAgain={function () { setDrillSeed(Date.now()); }} />;
            }
        } else if (drillKind === "conquer" || drillKind === "tabu" || drillKind === "panic") {
            if (drillGameErr) {
                body = (
                    <Shell>
                        <BackBtn onClick={function () { setDrillKind(null); }} label="Alıştırmalar" />
                        <p className="text-coral-600 mt-6">{drillGameErr}</p>
                    </Shell>
                );
            } else if (!drillGameCmp) {
                body = <div className="p-10 text-center text-zinc-500 text-sm">Oyun yükleniyor…</div>;
            } else {
                body = React.createElement(drillGameCmp, {
                    key: drillSeed,
                    student: student,
                    kpssData: kpssData,
                    seed: drillSeed,
                    isDark: isDark,
                    toggleDark: toggleDark,
                    onBack: function () { setDrillKind(null); },
                    onAgain: function () { setDrillSeed(Date.now()); }
                });
            }
        } else if (!drillDers) {
            body = <AlistirmaDersList kpssData={kpssData} isDark={isDark} toggleDark={toggleDark}
                onBack={function () { setDrillKind(null); }}
                onDers={function (d) { setDrillDers(d); setDrillKonu(null); }} />;
        } else {
            var clozeKeys = Object.keys(kpssData[drillDers] || {}).filter(function (k) { return k !== "_"; });
            var clozeOn = !window.ClozeEngine || window.ClozeEngine.dersEnabled(drillDers);
            var canPlayCloze = clozeOn && drillKonu && StudentStore.isKonuOpen(drillDers, clozeKeys, clozeKeys.indexOf(drillKonu), kpssData);
            if (!clozeOn) {
                body = <AlistirmaDersList kpssData={kpssData} isDark={isDark} toggleDark={toggleDark}
                    onBack={function () { setDrillKind(null); }}
                    onDers={function (d) { setDrillDers(d); setDrillKonu(null); }} />;
            } else if (!canPlayCloze) {
                body = <AlistirmaKonuList kpssData={kpssData} student={student} ders={drillDers} isDark={isDark} toggleDark={toggleDark}
                    onBack={function () { setDrillDers(null); }}
                    onKonu={function (k) {
                        if (!StudentStore.isKonuOpen(drillDers, clozeKeys, clozeKeys.indexOf(k), kpssData)) return;
                        setDrillKonu(k); setDrillSeed(Date.now());
                    }} />;
            } else {
                body = <ClozePlay ders={drillDers} konu={drillKonu} konuData={drillData} seed={drillSeed}
                    isDark={isDark} toggleDark={toggleDark}
                    onBack={function () { setDrillKonu(null); }}
                    onAgain={function () { setDrillSeed(Date.now()); }} />;
            }
        }
    } else if (!selectedDers) {
        body = <DersHome kpssData={kpssData} student={student} plan={plan} isDark={isDark} toggleDark={toggleDark} onDers={function (d) { setSelectedDers(d); setSelectedKonu(null); }} />;
    } else if (!selectedKonu) {
        body = <KonuList kpssData={kpssData} student={student} ders={selectedDers} isDark={isDark} toggleDark={toggleDark}
            onBack={function () { setSelectedDers(null); }} onKonu={function (k) {
                setSelectedKonu(k); setViewMode("hub");
                const tp = StudentStore.getTopic(selectedDers, k);
                setNoteIndex(tp.noteIndex || 0);
            }} />;
    } else if (viewMode === "notlar") {
        body = (
            <NotesView notlar={konuData.notlar || []} index={noteIndex} ders={selectedDers} konu={selectedKonu} isDark={isDark} toggleDark={toggleDark}
                hasTest={(konuData.sorular || []).length > 0}
                onBack={function () { setViewMode("hub"); }}
                onIndex={function (i) {
                    setNoteIndex(i);
                    StudentStore.setNoteIndex(selectedDers, selectedKonu, i, (konuData.notlar || []).length);
                }}
                onTest={function () {
                    StudentStore.markNotesComplete(selectedDers, selectedKonu);
                    var packs = StudentStore.topicTestPacks(toItemsFromKonu(kpssData, selectedDers, selectedKonu));
                    var pi = StudentStore.firstOpenPackIndex(StudentStore.getTopic(selectedDers, selectedKonu), packs.length);
                    var pack = packs[pi];
                    if (pack) startSession(pack.items, { mode: "topic", ders: selectedDers, konu: selectedKonu, testNo: pack.no });
                }} />
        );
    } else {
        body = (
            <KonuHub ders={selectedDers} konu={selectedKonu} konuData={konuData} isDark={isDark} toggleDark={toggleDark}
                onBack={function () { setSelectedKonu(null); }}
                onNotes={function () {
                    const nLen = (konuData.notlar || []).length;
                    StudentStore.setNoteIndex(selectedDers, selectedKonu, noteIndex, nLen);
                    setViewMode("notlar");
                }}
                onTest={function (packIdx) {
                    var pack = packFromKonu(kpssData, selectedDers, selectedKonu, packIdx);
                    if (!pack) { alert("Bu konuya ait henüz soru yüklenmedi!"); return; }
                    var tp = StudentStore.getTopic(selectedDers, selectedKonu);
                    if (!StudentStore.isPackOpen(tp, pack.no)) return;
                    startSession(pack.items, { mode: "topic", ders: selectedDers, konu: selectedKonu, testNo: pack.no });
                }} />
        );
    }

    if (!authReady) {
        return <BrandLoad />;
    }
    var AuthCmp = GateAuth || (window.KpssComponents && window.KpssComponents.AuthScreen);
    if (!authSession || pwRecovery || signingOutRef.current) {
        return AuthCmp
            ? React.createElement(AuthCmp, {
                gate: true,
                recovery: pwRecovery,
                isDark: isDark,
                toggleDark: toggleDark,
                onPasswordUpdated: function () {
                    if (window.SupabaseClient && window.SupabaseClient.clearRecovery) window.SupabaseClient.clearRecovery();
                    setPwRecovery(false);
                    if (window.SyncEngine) window.SyncEngine.sync();
                },
                onRecoveryFailed: function () {
                    if (window.SupabaseClient && window.SupabaseClient.clearRecovery) window.SupabaseClient.clearRecovery();
                    setPwRecovery(false);
                },
                onDone: function () { if (window.SyncEngine) window.SyncEngine.sync(); }
            })
            : <BrandLoad />;
    }
    if (!roleChecked) {
        return <BrandLoad />;
    }
    var isAdminUser = student.userProfile && student.userProfile.role === "admin";
    if (student.userProfile && student.userProfile.blocked) {
        return (
            <div className="brand-backdrop min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
                <div className="relative z-10 text-center max-w-sm bg-white/95 rounded-[28px] p-6 shadow-xl">
                    <h1 className="text-xl font-semibold mb-2 text-stone-900">Hesap kısıtlı</h1>
                    <p className="text-sm text-zinc-500 mb-6">Bu hesap yönetici tarafından durduruldu.</p>
                    <button onClick={doSignOut} className="px-4 py-2 rounded-xl border font-medium">Çıkış</button>
                </div>
            </div>
        );
    }
    if (isAdminUser) {
        var Adm = AdminCmp || (window.KpssComponents && window.KpssComponents.AdminDashboard);
        return Adm
            ? React.createElement(Adm, { student: student, onSignOut: doSignOut })
            : (
                <div className="brand-backdrop min-h-screen flex items-center justify-center p-8">
                    <div className="text-center max-w-sm bg-white/95 rounded-[28px] p-6 shadow-xl">
                        <p className="text-sm text-zinc-500 mb-4">Yönetim paneli yüklenemedi. Sayfayı yenile.</p>
                        <button onClick={function () { window.location.reload(); }} className="px-4 py-2 rounded-xl border font-medium">Yenile</button>
                        <button onClick={doSignOut} className="mt-3 block w-full px-4 py-2 rounded-xl font-medium">Çıkış</button>
                    </div>
                </div>
            );
    }

    if (!profileHydrated) {
        return <BrandLoad />;
    }
    var sessUid = authSession.user && authSession.user.id;
    var boundUid = student.userProfile && student.userProfile.authUserId;
    if (sessUid && boundUid && sessUid !== boundUid) {
        return <BrandLoad />;
    }
    if (!boundUid) {
        return <BrandLoad />;
    }
    if (!student.profile || !student.profile.onboarded) {
        var Ob = OnboardCmp || (window.KpssComponents && window.KpssComponents.OnboardingScreen) || Onboarding;
        return React.createElement(Ob, { student: student, isDark: isDark, toggleDark: function () { StudentStore.setDark(!isDark); } });
    }

    function closeTool() {
        setExtra(null);
        setLazyCmp(null);
        setLazyErr("");
    }

    var toolProps = {
        student: student,
        plan: plan,
        kpssData: kpssData,
        onBack: closeTool,
        onClose: closeTool,
        onDone: function () { closeTool(); if (window.SyncEngine) window.SyncEngine.sync(); },
        onOpen: function (id) { setLazyCmp(null); setLazyErr(""); setExtra(id); },
        onStartExam: function () { setLazyCmp(null); setLazyErr(""); setExtra("exam"); },
        liveView: liveView,
        onKonu: function (d, k) { closeTool(); openKonu(d, k); }
    };

    if (extra && extra !== "onboarding" && extra !== "auth") {
        return (
            <div className="min-h-screen app-shell">
                <div className="app-page pt-5" style={{ paddingBottom: "2rem" }}>
                    <div className="mb-3"><BackBtn onClick={closeTool} label="Geri" /></div>
                    {lazyErr ? (
                        <div className="p-4 rounded-2xl panel text-sm">
                            <p className="text-coral-600 mb-3">{lazyErr}</p>
                            <button type="button" onClick={function () {
                                var spec = LAZY[extra];
                                setLazyErr("");
                                if (spec && window.JsxLoader) {
                                    window.JsxLoader.load(spec[0], spec[1]).then(function (C) {
                                        if (C) setLazyCmp(function () { return C; });
                                    }).catch(function (e) { setLazyErr((window.trError && window.trError(e, "Yüklenemedi")) || "Yüklenemedi"); });
                                }
                            }} className="px-4 py-2 rounded-xl btn-primary text-white text-sm">Tekrar dene</button>
                        </div>
                    ) : (LazyCmp ? React.createElement(LazyCmp, toolProps) : (
                        <BrandLoad />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={"app-shell" + (!inTest ? " has-nav" : "")}>
            {announce && !inTest && !inMapPlay && !inDrillGame ? (
                <div className="sticky top-0 z-50 duyuru-bar text-white shadow-lg" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
                    <div className="app-page py-2.5 flex items-start gap-3">
                        <span className="duyuru-badge shrink-0 mt-0.5 text-[10px] font-black uppercase tracking-widest bg-white text-indigo-700 px-2 py-1 rounded-md">Duyuru</span>
                        <p className="text-sm font-semibold leading-snug flex-1">{announce}</p>
                    </div>
                </div>
            ) : null}
            {body}
            <ImageZoom />
            {!inTest ? <CookieBar /> : null}
            {!inTest ? (
                <>
                {navOutOpen ? <SignOutDialog email={(authSession && authSession.user && authSession.user.email) || ""}
                    onClose={function () { setNavOutOpen(false); }}
                    onConfirm={function () { setNavOutOpen(false); doSignOut(); }} /> : null}
                <BottomNav nav={nav} streak={plan.streak || 0}
                    name={(student.profile && student.profile.name) || ""}
                    email={(authSession && authSession.user && authSession.user.email) || ""}
                    onSignOut={authSession ? function () { setNavOutOpen(true); } : null}
                    onChange={function (id) {
                    setNav(id);
                    setDenemeOpen(false);
                    if (id !== "dersler") { setSelectedDers(null); setSelectedKonu(null); setViewMode("hub"); }
                    if (id === "dersler") { setSelectedDers(null); setSelectedKonu(null); }
                    if (id !== "alistirmalar") { setDrillKind(null); setDrillMapTopic(null); setDrillDers(null); setDrillKonu(null); }
                    if (id === "alistirmalar") { setDrillKind(null); setDrillMapTopic(null); setDrillDers(null); setDrillKonu(null); }
                }} />
                </>
            ) : null}
        </div>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);