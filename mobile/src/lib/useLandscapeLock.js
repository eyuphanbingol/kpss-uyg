import { useEffect } from "react";
import * as ScreenOrientation from "expo-screen-orientation";

export function useLandscapeLock() {
    useEffect(function () {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE).catch(function () {});
        return function () {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(function () {});
        };
    }, []);
}
