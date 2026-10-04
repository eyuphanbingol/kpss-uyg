import React, { useEffect, useMemo, useRef, useState } from "react";
import { AppState, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import { mapDocument } from "../lib/trMap";
import { TR_SVG } from "../lib/trSvgData";

// Türkiye haritası tek bir WebView'da çizilir. WebView yalnız bir kez kurulur:
// boyut değişince ya da uygulama arka plandan dönünce yeniden yüklenmez, durum yeniden
// gönderilir. Sistem WebView sürecini kapatırsa (bellek baskısı) kendiliğinden yeniden açılır.
export function TrMapView(props) {
    var mode = props.mode || "play";
    var html = useMemo(function () { return mapDocument(TR_SVG, mode); }, [mode]);
    var [sized, setSized] = useState(false);
    var [reloadKey, setReloadKey] = useState(0);
    var ready = useRef(false);
    var webRef = useRef(null);
    var boxRef = useRef({ w: 0, h: 0 });
    var propsRef = useRef(props);
    propsRef.current = props;

    function stateScript() {
        var p = propsRef.current;
        if (mode === "conquer") {
            return "window.setConquer && window.setConquer(" + JSON.stringify({
                owned: p.owned || {},
                pick: p.pick || null,
                color: p.color || "#127880"
            }) + "); true;";
        }
        return "window.setPlay && window.setPlay(" + JSON.stringify({
            pins: p.pins || [],
            glyph: p.glyph || "📍",
            picked: p.picked || null,
            targetId: p.targetId || null,
            cleared: p.cleared || {},
            labels: p.labels || [],
            separate: p.separate || 36,
            place: !!p.place,
            placed: p.placed || {},
            shown: p.shown || {},
            lastId: p.lastId || null,
            flash: p.flash || null,
            hl: p.hl || []
        }) + "); true;";
    }

    function run(js) {
        var wv = webRef.current;
        if (!wv || !ready.current) return;
        wv.injectJavaScript(js);
    }

    useEffect(function () {
        run(stateScript());
    }, [mode, props.pins, props.glyph, props.picked, props.targetId, props.cleared, props.labels, props.separate, props.owned, props.pick, props.color, props.place, props.placed, props.shown, props.lastId, props.flash, props.hl]);

    useEffect(function () {
        var sub = AppState.addEventListener("change", function (next) {
            if (next === "active") run(stateScript() + " window.relayout && window.relayout(); true;");
        });
        return function () { sub.remove(); };
    }, [mode]);

    function onMessage(ev) {
        var data = {};
        try { data = JSON.parse(ev.nativeEvent.data || "{}"); } catch (e) { return; }
        if (data.type === "ready") {
            ready.current = true;
            run(stateScript());
            return;
        }
        var p = propsRef.current;
        if (data.type === "pin" && p.onPin && !p.locked) p.onPin(data.id);
        if (data.type === "province" && p.onProvince && !p.locked) p.onProvince(data.id);
    }

    function restart() {
        ready.current = false;
        setReloadKey(function (k) { return k + 1; });
    }

    var boxStyle = [
        styles.box,
        props.height ? { height: props.height } : { flex: 1 },
        props.style
    ];

    return (
        <View
            style={boxStyle}
            onLayout={function (e) {
                var n = e.nativeEvent.layout;
                var w = Math.round(n.width);
                var h = Math.round(n.height);
                var cur = boxRef.current;
                if (Math.abs(w - cur.w) < 2 && Math.abs(h - cur.h) < 2) return;
                boxRef.current = { w: w, h: h };
                if (w > 8 && h > 8) {
                    if (!sized) setSized(true);
                    else run("window.relayout && window.relayout(); true;");
                }
            }}
        >
            {sized ? (
                <WebView
                    key={"map-" + mode + "-" + reloadKey}
                    ref={webRef}
                    originWhitelist={["*"]}
                    source={{ html: html, baseUrl: "https://www.atanly.com/" }}
                    onMessage={onMessage}
                    onContentProcessDidTerminate={restart}
                    onRenderProcessGone={restart}
                    style={styles.web}
                    scrollEnabled={false}
                    nestedScrollEnabled={false}
                    automaticallyAdjustContentInsets={false}
                    contentInsetAdjustmentBehavior="never"
                    scalesPageToFit={false}
                    bounces={false}
                    overScrollMode="never"
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    javaScriptEnabled={true}
                    setSupportMultipleWindows={false}
                    androidLayerType="hardware"
                />
            ) : null}
        </View>
    );
}

var styles = StyleSheet.create({
    box: {
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        minHeight: 0,
        backgroundColor: "#0c3d56",
        borderRadius: 16,
        overflow: "hidden",
        marginTop: 4
    },
    web: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#0c3d56"
    }
});
