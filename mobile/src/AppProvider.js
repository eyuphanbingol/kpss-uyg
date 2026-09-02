import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { StudentStore } from "./lib/store";
import { hydrateLocalStorage } from "./lib/storage";
import { supabase } from "./lib/supabase";
import { SyncEngine } from "./lib/syncEngine";
import { StudyPlanner } from "./lib/planner";
import { kpssData } from "./lib/catalog";

var Ctx = createContext(null);

export function AppProvider(props) {
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
    var signingOutRef = React.useRef(false);

    useEffect(function () {
        var unsub = StudentStore.subscribe(function (s) { setStudent(s); });
        var cancelled = false;
        (async function () {
            await hydrateLocalStorage();
            StudentStore.hydrateFromDisk();
            var r = await supabase.auth.getSession();
            var sess = r.data && r.data.session;
            if (cancelled) return;
            if (sess) {
                StudentStore.bindToUser(sess.user.id, sess.user.email);
                StudentStore.consumeSignupIfNeeded(sess.user);
                var st0 = StudentStore.getState();
                if (st0.profile && st0.profile.onboarded) setProfileHydrated(true);
                SyncEngine.ensureLocation && SyncEngine.ensureLocation();
                try { await SyncEngine.sync(); } catch (e) {}
                setProfileHydrated(true);
            }
            setSession(sess || null);
            setBootReady(true);
        })();
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
            if (st1.profile && st1.profile.onboarded) setProfileHydrated(true);
            SyncEngine.sync().then(function () { setProfileHydrated(true); }).catch(function () { setProfileHydrated(true); });
        });
        return function () {
            cancelled = true;
            unsub();
            if (sub && sub.data && sub.data.subscription) sub.data.subscription.unsubscribe();
        };
    }, []);

    function signOut() {
        signingOutRef.current = true;
        setSession(null);
        setProfileHydrated(false);
        supabase.auth.signOut().finally(function () {
            StudentStore.bindToUser(null);
        });
    }

    var plan = useMemo(function () {
        return StudyPlanner.buildPlan(kpssData, student);
    }, [student]);

    var value = {
        student: student,
        session: session,
        bootReady: bootReady,
        profileHydrated: profileHydrated,
        signingOut: signingOutRef.current,
        plan: plan,
        kpssData: kpssData,
        signOut: signOut,
        dark: !!(student.profile && student.profile.dark)
    };
    return React.createElement(Ctx.Provider, { value: value }, props.children);
}

export function useApp() {
    return useContext(Ctx);
}
