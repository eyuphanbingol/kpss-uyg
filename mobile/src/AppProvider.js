import React, { createContext, useContext, useEffect, useMemo, useState, useRef } from "react";
import { StudentStore } from "./lib/store";
import { hydrateLocalStorage } from "./lib/storage";
import { supabase } from "./lib/supabase";
import { SyncEngine } from "./lib/syncEngine";
import { StudyPlanner } from "./lib/planner";
import { kpssData } from "./lib/catalog";
import { AppState, Platform } from "react-native";

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
    var appStateRef = useRef(AppState.currentState);

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
            if (appStateRef.current.match(/inactive|background/) && nextAppState === "active") {
                // Uygulama ön plana geldi, sync yap
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

                // 2. Session kontrolü
                var r = await supabase.auth.getSession();
                var sess = r.data && r.data.session;

                if (cancelled) return;

                if (sess) {
                    // 3. Kullanıcıyı bağla
                    StudentStore.bindToUser(sess.user.id, sess.user.email);
                    StudentStore.consumeSignupIfNeeded(sess.user);

                    var st0 = StudentStore.getState();
                    if (st0.profile && st0.profile.onboarded) {
                        setProfileHydrated(true);
                    }

                    // 4. Konum kontrolü
                    if (SyncEngine.ensureLocation) {
                        SyncEngine.ensureLocation();
                    }

                    // 5. Sync işlemi
                    try {
                        await SyncEngine.sync();
                    } catch (e) {
                        // Sync hatası - sessizce devam
                        console.warn("Sync hatası:", e);
                    }

                    setProfileHydrated(true);
                }

                setSession(sess || null);
                setBootReady(true);
            } catch (e) {
                console.warn("Boot hatası:", e);
                setBootReady(true);
            }
        })();

        // ---------- Auth State Change ----------
        var sub = supabase.auth.onAuthStateChange(function (event, sess) {
            if (event === "SIGNED_OUT") {
                signingOutRef.current = true;
                setSession(null);
                setProfileHydrated(false);
                StudentStore.bindToUser(null);
                return;
            }

            if (!sess) return;

            signingOutRef.current = false;
            StudentStore.bindToUser(sess.user.id, sess.user.email);
            StudentStore.consumeSignupIfNeeded(sess.user);
            setSession(sess);

            var st1 = StudentStore.getState();
            if (st1.profile && st1.profile.onboarded) {
                setProfileHydrated(true);
            }

            SyncEngine.sync()
                .then(function () { setProfileHydrated(true); })
                .catch(function () { setProfileHydrated(true); });
        });

        return function () {
            cancelled = true;
            unsub();
            if (sub && sub.data && sub.data.subscription) {
                sub.data.subscription.unsubscribe();
            }
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
    var plan = useMemo(function () {
        try {
            return StudyPlanner.buildPlan(kpssData, student);
        } catch (e) {
            return { rows: [], due: [], wrong: [], streak: 0 };
        }
    }, [student]);

    // ---------- Context Value ----------
    var value = {
        student: student,
        session: session,
        bootReady: bootReady,
        profileHydrated: profileHydrated,
        signingOut: signingOutRef.current,
        plan: plan,
        kpssData: kpssData,
        signOut: signOut,
        dark: !!(student.profile && student.profile.dark),
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