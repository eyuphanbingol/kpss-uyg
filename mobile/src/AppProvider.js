import React, { createContext, useContext, useEffect, useMemo, useState, useRef } from "react";
import { StudentStore } from "./lib/store";
import { hydrateLocalStorage } from "./lib/storage";
import { supabase } from "./lib/supabase";
import { SyncEngine } from "./lib/syncEngine";
import { StudyPlanner } from "./lib/planner";
import { filterCatalog } from "./lib/alan";
import { AppState, Platform } from "react-native";
import * as Linking from "expo-linking";
import { isRecoveryUrl } from "./lib/authLinks";

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
var START_CATALOG = { Tarih: { _: {} }, "Coğrafya": { _: {} } };

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

    function pullCatalog() {
        fetchRemoteCatalog().then(function (data) {
            if (data) setKpssData(data);
        }).catch(function () {});
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
                var cached = readCachedCatalog();
                if (cached) setKpssData(cached);

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

    useEffect(function () {
        function handleUrl(url) {
            if (!url) return;
            if (isRecoveryUrl(url)) beginRecovery();
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

    var plan = useMemo(function () {
        try {
            return StudyPlanner.buildPlan(visibleData, student);
        } catch (e) {
            return { rows: [], due: [], wrong: [], streak: 0 };
        }
    }, [student, visibleData]);

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