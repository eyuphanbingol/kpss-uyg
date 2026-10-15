import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";

function isLandscape(o) {
    return o === ScreenOrientation.Orientation.LANDSCAPE_LEFT
        || o === ScreenOrientation.Orientation.LANDSCAPE_RIGHT;
}

function isPortrait(o) {
    return o === ScreenOrientation.Orientation.PORTRAIT_UP
        || o === ScreenOrientation.Orientation.PORTRAIT_DOWN;
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

// Dikeye dön ve dönüş bitene kadar (en çok ~900 ms) bekle.
function settlePortrait() {
    return new Promise(function (resolve) {
        var done = false;
        var sub = null;
        function finish() {
            if (done) return;
            done = true;
            if (sub && sub.remove) sub.remove();
            clearTimeout(t);
            resolve();
        }
        var t = setTimeout(finish, 900);
        try {
            sub = ScreenOrientation.addOrientationChangeListener(function (ev) {
                if (isPortrait(ev.orientationInfo && ev.orientationInfo.orientation)) setTimeout(finish, 60);
            });
        } catch (e) { sub = null; }
        applyCurrent()
            .then(function () { return ScreenOrientation.getOrientationAsync(); })
            // Bazı cihazlar dönüş bitmeden "dikey" bildiriyor; dönüş olayı gelmezse kısa bir süre sonra devam et.
            .then(function (o) { if (isPortrait(o)) setTimeout(finish, 300); })
            .catch(finish);
    });
}

// Ekranı yataya kilitler; ekrandan çıkarken önce dikeye döner, sonra geri gider.
// Eskiden sayfa kapanıp ardından dönülüyordu: iOS'ta alttaki sayfa yatay ölçülerle kalıyordu.
// Hazır bilgisi bir kez true olunca geri false olmaz: bazı Android cihazlar yönü geç ya da
// "bilinmiyor" bildiriyor ve oyun "yataya alınıyor" ekranında takılı kalıyordu.
export function useLandscapeLock(navigation) {
    var [ready, setReady] = useState(false);
    var alive = useRef(true);
    var released = useRef(false);

    useEffect(function () {
        alive.current = true;
        released.current = false;
        holds += 1;

        function markReady() {
            if (alive.current) setReady(true);
        }

        function apply() {
            if (released.current) return;
            applyCurrent()
                .then(function () { return ScreenOrientation.getOrientationAsync(); })
                .then(function (o) { if (isLandscape(o)) markReady(); })
                .catch(function () {});
        }

        apply();
        var t = setTimeout(markReady, 800);

        var orientSub = ScreenOrientation.addOrientationChangeListener(function (ev) {
            if (!alive.current || released.current) return;
            var land = isLandscape(ev.orientationInfo && ev.orientationInfo.orientation);
            if (land) markReady();
            else if (holds > 0) apply();
        });

        var appSub = AppState.addEventListener("change", function (next) {
            if (next === "active") apply();
        });

        function release() {
            if (released.current) return;
            released.current = true;
            holds = Math.max(0, holds - 1);
        }

        // iOS'ta kaydırarak geri dönüş, dönüşü beklemeden sayfayı kapatır; bu ekranlarda kapalı.
        try { if (navigation) navigation.setOptions({ gestureEnabled: false }); } catch (e) {}
        var leaving = false;
        var navSub = navigation && navigation.addListener("beforeRemove", function (e) {
            if (leaving) return;
            release();
            if (holds > 0) return;
            leaving = true;
            e.preventDefault();
            settlePortrait().then(function () { navigation.dispatch(e.data.action); });
        });

        return function () {
            alive.current = false;
            release();
            if (orientSub && orientSub.remove) orientSub.remove();
            appSub.remove();
            if (typeof navSub === "function") navSub();
            clearTimeout(t);
            applyCurrent().catch(function () {});
        };
    }, [navigation]);

    return ready;
}
