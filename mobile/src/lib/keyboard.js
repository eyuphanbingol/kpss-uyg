import { useEffect, useRef, useState } from "react";
import { Keyboard, Platform, TextInput } from "react-native";

// Android 15+ / Expo SDK 57'de uygulama kenardan kenara çizilir: klavye açılınca pencere artık
// küçülmez (softwareKeyboardLayoutMode "resize" etkisiz), ScrollView'ın
// automaticallyAdjustKeyboardInsets'i de yalnız iOS'ta çalışır. Sonuç: klavye alanların üstüne
// biner, sayfa kaydırılamaz. Burada klavye yüksekliği izlenir; kaydırılabilir sayfalar alta o kadar
// boşluk ekler ve odaklanan alan klavyenin üstüne kaydırılır.

var kb = { h: 0, top: 0 };
var listeners = [];
var scrollers = [];

function emit() { listeners.slice().forEach(function (f) { f(kb.h); }); }

// Odaktaki alan klavyenin altında kaldıysa en üstteki kayıtlı kaydırıcıyı o kadar kaydırır.
export function revealFocusedInput() {
    if (!kb.h) return;
    var input = TextInput.State && TextInput.State.currentlyFocusedInput ? TextInput.State.currentlyFocusedInput() : null;
    var sc = scrollers[scrollers.length - 1];
    if (!input || !sc || !sc.ref.current || !input.measureInWindow) return;
    input.measureInWindow(function (x, y, w, h) {
        var over = y + h + 28 - kb.top;
        if (over > 0) sc.ref.current.scrollTo({ y: Math.max(0, sc.y + over), animated: true });
    });
}

var showEvt = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
var hideEvt = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
Keyboard.addListener(showEvt, function (e) {
    var end = (e && e.endCoordinates) || {};
    kb = { h: end.height || 0, top: end.screenY || 0 };
    emit();
    setTimeout(revealFocusedInput, Platform.OS === "ios" ? 250 : 60);
});
Keyboard.addListener(hideEvt, function () {
    kb = { h: 0, top: 0 };
    emit();
});

// Açık klavyenin yüksekliği (kapalıyken 0)
export function useKeyboardHeight() {
    var [h, setH] = useState(kb.h);
    useEffect(function () {
        listeners.push(setH);
        setH(kb.h);
        return function () { listeners = listeners.filter(function (f) { return f !== setH; }); };
    }, []);
    return h;
}

// Bir ScrollView'ı "klavye açılınca odaktaki alanı göster" için kaydeder. Dönen onScroll ScrollView'a verilir.
export function useKeyboardScroller(ref) {
    var entry = useRef(null);
    if (!entry.current) entry.current = { ref: ref, y: 0 };
    useEffect(function () {
        scrollers.push(entry.current);
        return function () { scrollers = scrollers.filter(function (s) { return s !== entry.current; }); };
    }, []);
    return function (e) { entry.current.y = e.nativeEvent.contentOffset.y; };
}
