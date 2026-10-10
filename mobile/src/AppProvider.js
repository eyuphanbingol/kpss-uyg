import React, { createContext, useContext, useDeferredValue, useEffect, useMemo, useState, useRef } from "react";
import { StudentStore } from "./lib/store";
import { hydrateLocalStorage } from "./lib/storage";
import { supabase } from "./lib/supabase";
import { SyncEngine } from "./lib/syncEngine";
import { StudyPlanner } from "./lib/planner";
import { filterCatalog } from "./lib/alan";
import { AppState, Platform } from "react-native";
import * as Linking from "expo-linking";
import { parseAuthUrl } from "./lib/authLinks";
import { fetchRemoteCatalog, readCachedCatalog, looksCatalog } from "./lib/catalog";
import BUNDLED_CATALOG from "./content/catalog.json";

// ============================================================
// PLATFORM KONTROLLÜ NETWORK IMPORT
// ============================================================

let Network = null;
try {
    Network = require("expo-network");
} catch (e) {
    console.warn("⚠️ expo-network yüklü değil, network kontrolü devre dışı");
}

// ============================================================
// KONTEXT
// ============================================================

var Ctx = createContext(null);
// Uygulamayla gelen katalog: internet olmasa da sorular/notlar açılır.
// (Önceden fetchRemoteCatalog/readCachedCatalog import edilmediği için katalog hiç yüklenmiyordu.)
var START_CATALOG = looksCatalog(BUNDLED_CATALOG) ? BUNDLED_CATALOG : { Tarih: { _: {} }, "Coğrafya": { _: {} } };

// ============================================================
// APP PROVIDER
// ============================================================

export function AppProvider(props) {
    // ---------- State ----------
    var _st = useState(function () { return StudentStore.getState(); });
    var student = _st[0];
    var setStudent = _st[1];

    var _ready = useState(false);
    var bootReady = _ready[0];
    var setBootReady = _ready[1];

    var _sess = useState(null);
    var session = _sess[0];
    var setSession = _sess[1];

    var _hydrated = useState(false);
    var profileHydrated = _hydrated[0];
    var setProfileHydrated = _hydrated[1];

    var _isConnected = useState(true);
    var isConnected = _isConnected[0];
    var setIsConnected = _isConnected[1];

    var signingOutRef = useRef(false);
    var hydrateTimerRef = useRef(null);
    var appStateRef = useRef(AppState.currentState);
    var recoveringRef = useRef(false);
    var _recovering = useState(false);
    var recovering = _recovering[0];
    var setRecovering = _recovering[1];

    function beginRecovery() {
        recoveringRef.current = true;
        setRecovering(true);
    }

    function finishRecovery() {
        recoveringRef.current = false;
        setRecovering(false);
        hydrateAfterAuth(true);
    }

    function cancelRecovery() {
        recoveringRef.current = false;
        setRecovering(false);
        signingOutRef.current = true;
        setSession(null);
        setProfileHydrated(false);
        supabase.auth.signOut().finally(function () {
            StudentStore.bindToUser(null);
        });
    }

    function hydrateAfterAuth(allowWait) {
        var st = StudentStore.getState();
        if (st.profile && st.profile.onboarded) {
            setProfileHydrated(true);
            SyncEngine.sync().catch(function () {});
            return;
        }
        if (hydrateTimerRef.current) clearTimeout(hydrateTimerRef.current);
        var done = function () {
            if (hydrateTimerRef.current) {
                clearTimeout(hydrateTimerRef.current);
                hydrateTimerRef.current = null;
            }
            setProfileHydrated(true);
        };
        if (allowWait) {
            hydrateTimerRef.current = setTimeout(done, 2500);
        }
        SyncEngine.sync().then(done).catch(done);
        if (!allowWait) done();
    }
    var _kd = useState(START_CATALOG);
    var kpssData = _kd[0];
    var setKpssData = _kd[1];

    var remoteCatalogRef = useRef(false);
    function pullCatalog() {
        try {
            fetchRemoteCatalog().then(function (data) {
                if (data) { remoteCatalogRef.current = true; setKpssData(data); }
            }).catch(function () {});
        } catch (e) {}
    }

    // ---------- Network Kontrol ----------
    useEffect(function () {
        async function checkNetwork() {
            try {
                if (Network) {
                    var state = await Network.getNetworkStateAsync();
                    setIsConnected(state.isConnected || state.isInternetReachable || false);
                } else {
                    setIsConnected(true);
                }
            } catch (e) {
                setIsConnected(true);
            }
        }
        checkNetwork();

        var interval = setInterval(checkNetwork, 30000);
        return function () { clearInterval(interval); };
    }, []);

    // ---------- App State Kontrol ----------
    useEffect(function () {
        var subscription = AppState.addEventListener("change", function (nextAppState) {
            if (appStateRef.current && appStateRef.current.match && appStateRef.current.match(/inactive|background/) && nextAppState === "active") {
                pullCatalog();
                if (session) {
                    SyncEngine.sync().catch(function () {});
                }
            }
            appStateRef.current = nextAppState;
        });

        return function () {
            subscription.remove();
        };
    }, [session]);

    // ---------- Boot ----------
    useEffect(function () {
        var unsub = StudentStore.subscribe(function (s) { setStudent(s); });
        var cancelled = false;

        (async function () {
            try {
                // 1. Local storage'ı hydrate et
                await hydrateLocalStorage();
                StudentStore.hydrateFromDisk();
                // Cihazdaki güncel katalog (dosya); ilk açılışı bekletmesin diye arka planda
                readCachedCatalog().then(function (cached) { if (cached && !cancelled && !remoteCatalogRef.current) setKpssData(cached); }).catch(function () {});

                var r = await supabase.auth.getSession();
                var sess = r.data && r.data.session;

                if (cancelled) return;

                if (sess) {
                    StudentStore.bindToUser(sess.user.id, sess.user.email);
                    StudentStore.consumeSignupIfNeeded(sess.user);
                    hydrateAfterAuth(true);
                    if (SyncEngine.ensureLocation) SyncEngine.ensureLocation();
                }

                setSession(sess || null);
                setBootReady(true);
                pullCatalog();
            } catch (e) {
                console.warn("Boot hatası:", e);
                setBootReady(true);
                pullCatalog();
            }
        })();

        // ---------- Auth State Change ----------
        var sub = supabase.auth.onAuthStateChange(function (event, sess) {
            if (event === "PASSWORD_RECOVERY") {
                beginRecovery();
                if (sess) setSession(sess);
                return;
            }

            if (event === "SIGNED_OUT") {
                signingOutRef.current = true;
                if (hydrateTimerRef.current) {
                    clearTimeout(hydrateTimerRef.current);
                    hydrateTimerRef.current = null;
                }
                setSession(null);
                setProfileHydrated(false);
                StudentStore.bindToUser(null);
                return;
            }

            if (!sess) return;
            if (event === "TOKEN_REFRESHED") {
                setSession(sess);
                return;
            }

            signingOutRef.current = false;
            StudentStore.bindToUser(sess.user.id, sess.user.email);
            StudentStore.consumeSignupIfNeeded(sess.user);
            setSession(sess);
            if (recoveringRef.current) return;
            hydrateAfterAuth(true);
        });

        return function () {
            cancelled = true;
            if (hydrateTimerRef.current) clearTimeout(hydrateTimerRef.current);
            unsub();
            if (sub && sub.data && sub.data.subscription) {
                sub.data.subscription.unsubscribe();
            }
        };
    }, []);

    // Maildeki bağlantılar: atanly://reset?token_hash=…&type=recovery ve
    // atanly://auth/callback?token_hash=…&type=email (supabase/email-templates). Bağlantı burada bir kez
    // doğrulanır; oturum onAuthStateChange ile gelir. Hata olursa giriş ekranı authLinkError'u gösterir.
    var seenTokensRef = useRef({});
    var _linkErr = useState("");
    var authLinkError = _linkErr[0];
    var setAuthLinkError = _linkErr[1];

    useEffect(function () {
        function handleUrl(url) {
            if (!url) return;
            var p = parseAuthUrl(url);
            if (p.isRecovery) beginRecovery();
            var th = p.params.token_hash;
            if (!th || seenTokensRef.current[th]) return;
            seenTokensRef.current[th] = true;
            var type = p.isRecovery ? "recovery" : (!p.type || p.type === "signup" ? "email" : p.type);
            supabase.auth.verifyOtp({ token_hash: th, type: type }).then(function (r) {
                if (r && r.error) setAuthLinkError("Bu bağlantı geçersiz ya da süresi dolmuş. Giriş yapmayı dene; olmazsa yeni bağlantı iste.");
            }, function () {
                setAuthLinkError("Bağlantı doğrulanamadı. İnternet bağlantını kontrol edip tekrar dene.");
            });
        }
        Linking.getInitialURL().then(handleUrl).catch(function () {});
        var sub = Linking.addEventListener("url", function (ev) {
            handleUrl(ev && ev.url);
        });
        return function () {
            if (sub && sub.remove) sub.remove();
        };
    }, []);

    // ---------- Sign Out ----------
    function signOut() {
        signingOutRef.current = true;
        setSession(null);
        setProfileHydrated(false);
        supabase.auth.signOut()
            .finally(function () {
                StudentStore.bindToUser(null);
            });
    }

    // ---------- Plan ----------
    var visibleData = useMemo(function () {
        return filterCatalog(kpssData, student);
    }, [kpssData, student]);

    // Plan hesabı (tüm katalog) düşük öncelikli: dokunuşlara cevap bunu beklemez
    var planStudent = useDeferredValue(student);
    var planData = useDeferredValue(visibleData);
    var plan = useMemo(function () {
        try {
            return StudyPlanner.buildPlan(planData, planStudent);
        } catch (e) {
            return { rows: [], due: [], wrong: [], streak: 0 };
        }
    }, [planStudent, planData]);

    // ---------- Context Value ----------
    var value = {
        student: student,
        session: session,
        bootReady: bootReady,
        profileHydrated: profileHydrated,
        signingOut: signingOutRef.current,
        plan: plan,
        kpssData: visibleData,
        recovering: recovering,
        beginRecovery: beginRecovery,
        finishRecovery: finishRecovery,
        cancelRecovery: cancelRecovery,
        signOut: signOut,
        authLinkError: authLinkError,
        clearAuthLinkError: function () { setAuthLinkError(""); },
        dark: !!(student.profile && student.profile.dark),
        isDark: !!(student.profile && student.profile.dark),
        isConnected: isConnected,
        platform: Platform.OS,
    };

    return React.createElement(Ctx.Provider, { value: value }, props.children);
}

// ============================================================
// HOOK
// ============================================================

export function useApp() {
    var context = useContext(Ctx);
    if (!context) {
        throw new Error("useApp must be used within an AppProvider");
    }
    return context;
}

// ============================================================
// EXPORT DEFAULT
// ============================================================

export default AppProvider;