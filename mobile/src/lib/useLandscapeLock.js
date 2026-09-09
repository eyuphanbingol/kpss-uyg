import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";

function isLandscape(o) {
    return o === ScreenOrientation.Orientation.LANDSCAPE_LEFT
        || o === ScreenOrientation.Orientation.LANDSCAPE_RIGHT;
}

var holds = 0;

function applyCurrent() {
    if (holds > 0) {
        return ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    }
    return ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
}

export function resumeScreenOrientation() {
    return applyCurrent().catch(function () {});
}

export function useLandscapeLock() {
    var [ready, setReady] = useState(false);
    var alive = useRef(true);

    useEffect(function () {
        alive.current = true;
        holds += 1;

        function apply() {
            applyCurrent()
                .then(function () { return ScreenOrientation.getOrientationAsync(); })
                .then(function (o) {
                    if (alive.current) setReady(isLandscape(o));
                })
                .catch(function () {});
        }

        apply();
        var t = setTimeout(function () {
            if (alive.current) setReady(true);
        }, 800);

        var orientSub = ScreenOrientation.addOrientationChangeListener(function (ev) {
            if (!alive.current) return;
            var o = ev.orientationInfo && ev.orientationInfo.orientation;
            var land = isLandscape(o);
            if (land) setReady(true);
            if (holds > 0 && !land) apply();
        });

        var appSub = AppState.addEventListener("change", function (next) {
            if (next === "active") apply();
        });

        return function () {
            alive.current = false;
            holds = Math.max(0, holds - 1);
            if (orientSub && orientSub.remove) orientSub.remove();
            appSub.remove();
            clearTimeout(t);
            applyCurrent().catch(function () {});
        };
    }, []);

    return ready;
}
