import React, { useRef, useState } from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { OPTIK_HTML } from "../lib/optikHtml";

// Optik form ve soru kitapçığı PDF'i: web'deki optik/optik.html'in aynısı gizli bir WebView'da
// çalışır (canvas → JPEG → PDF). Bitince dosya paylaşım menüsüyle açılır (yazdır, kaydet, gönder).
var seq = 0;
function js(cmd) {
    // U+2028/2029 JS dizgesinde satır sonu sayılabilir; kaçışla gönder
    var LS = new RegExp(String.fromCharCode(0x2028), "g"), PS = new RegExp(String.fromCharCode(0x2029), "g");
    return "window.optikCmd(" + JSON.stringify(cmd).replace(LS, "\\u2028").replace(PS, "\\u2029") + "); true;";
}

export function useOptikPdf() {
    var [active, setActive] = useState(false);
    var web = useRef(null);
    var ready = useRef(false);
    var queue = useRef([]);
    var waiters = useRef({});

    function flush() {
        if (!ready.current || !web.current) return;
        while (queue.current.length) web.current.injectJavaScript(js(queue.current.shift()));
    }
    function run(cmd, onProgress) {
        return new Promise(function (resolve, reject) {
            var id = "m" + (++seq);
            waiters.current[id] = { resolve: resolve, reject: reject, onProgress: onProgress };
            queue.current.push(Object.assign({ id: id }, cmd));
            setActive(true);
            flush();
            setTimeout(function () {
                if (waiters.current[id]) { delete waiters.current[id]; reject(new Error("PDF hazırlanamadı (zaman aşımı).")); }
            }, 120000);
        });
    }
    function onMessage(e) {
        var m;
        try { m = JSON.parse(e.nativeEvent.data); } catch (x) { return; }
        if (m.type === "ready") { ready.current = true; flush(); return; }
        var w = m.id && waiters.current[m.id];
        if (!w) return;
        if (m.type === "progress") { if (w.onProgress) w.onProgress(m.p); return; }
        delete waiters.current[m.id];
        if (m.type === "pdf") w.resolve(m); else w.reject(new Error(m.message || "PDF hazırlanamadı."));
    }
    var host = active ? (
        <View style={{ position: "absolute", width: 2, height: 2, opacity: 0, left: -10, top: 0 }} pointerEvents="none">
            <WebView ref={web} originWhitelist={["*"]} source={{ html: OPTIK_HTML, baseUrl: "https://www.atanly.com/optik/" }}
                injectedJavaScriptBeforeContentLoaded={"window.OPTIK_MODE = 'worker'; true;"}
                onMessage={onMessage} javaScriptEnabled domStorageEnabled
                onContentProcessDidTerminate={function () { ready.current = false; if (web.current) web.current.reload(); }}
                onRenderProcessGone={function () { ready.current = false; return true; }} />
        </View>
    ) : null;
    return [host, run];
}

// PDF'i önbelleğe yazıp paylaşım menüsünü aç.
export function sharePdf(b64, name) {
    var uri = FileSystem.cacheDirectory + name;
    return FileSystem.writeAsStringAsync(uri, b64, { encoding: FileSystem.EncodingType.Base64 }).then(function () {
        return Sharing.isAvailableAsync();
    }).then(function (ok) {
        if (!ok) throw new Error("Bu cihazda paylaşım menüsü yok.");
        return Sharing.shareAsync(uri, { mimeType: "application/pdf", UTI: "com.adobe.pdf", dialogTitle: name });
    }).then(function () { return uri; });
}
