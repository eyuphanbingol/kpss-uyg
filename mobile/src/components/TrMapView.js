import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import { loadTrSvg, mapDocument } from "../lib/trMap";
import { colors } from "../lib/theme";

export function TrMapView(props) {
    var mode = props.mode || "play";
    var [html, setHtml] = useState("");
    var [fail, setFail] = useState(false);
    var [box, setBox] = useState({ w: 0, h: 0 });
    var ready = useRef(false);
    var webRef = useRef(null);

    useEffect(function () {
        var gone = false;
        loadTrSvg().then(function (txt) {
            if (gone) return;
            setHtml(mapDocument(txt, mode));
            setFail(false);
        }).catch(function () {
            if (!gone) setFail(true);
        });
        return function () { gone = true; ready.current = false; };
    }, [mode]);

    function inject() {
        var wv = webRef.current;
        if (!wv || !ready.current) return;
        var js;
        if (mode === "conquer") {
            js = "window.setConquer && window.setConquer(" + JSON.stringify({
                owned: props.owned || {},
                pick: props.pick || null,
                color: props.color || "#127880"
            }) + "); true;";
        } else {
            js = "window.setPlay && window.setPlay(" + JSON.stringify({
                pins: props.pins || [],
                glyph: props.glyph || "📍",
                picked: props.picked || null,
                targetId: props.targetId || null,
                cleared: props.cleared || {},
                labels: props.labels || []
            }) + "); true;";
        }
        wv.injectJavaScript(js);
    }

    useEffect(function () {
        inject();
    }, [mode, props.pins, props.glyph, props.picked, props.targetId, props.cleared, props.labels, props.owned, props.pick, props.color, html]);

    function onMessage(ev) {
        var data = {};
        try { data = JSON.parse(ev.nativeEvent.data || "{}"); } catch (e) { return; }
        if (data.type === "ready") {
            ready.current = true;
            inject();
            return;
        }
        if (data.type === "pin" && props.onPin && !props.locked) props.onPin(data.id);
        if (data.type === "province" && props.onProvince && !props.locked) props.onProvince(data.id);
    }

    var boxStyle = [
        styles.box,
        props.height ? { height: props.height } : { flex: 1 },
        props.style
    ];

    if (fail) {
        return (
            <View style={[boxStyle, styles.fail]}>
                <Text style={styles.failText}>Türkiye haritası yüklenemedi. İnterneti kontrol et.</Text>
            </View>
        );
    }
    if (!html) {
        return (
            <View style={[boxStyle, styles.fail]}>
                <ActivityIndicator color={colors.teal} />
            </View>
        );
    }

    var sized = box.w > 8 && box.h > 8;

    return (
        <View
            style={boxStyle}
            onLayout={function (e) {
                var n = e.nativeEvent.layout;
                if (Math.abs(n.width - box.w) < 1 && Math.abs(n.height - box.h) < 1) return;
                setBox({ w: Math.round(n.width), h: Math.round(n.height) });
            }}
        >
            {sized ? (
                <WebView
                    ref={webRef}
                    originWhitelist={["*"]}
                    source={{ html: html, baseUrl: "https://www.atanly.com/" }}
                    onMessage={onMessage}
                    style={{ width: box.w, height: box.h, backgroundColor: "#8fa89a" }}
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
        backgroundColor: "#8fa89a",
        borderRadius: 16,
        overflow: "hidden",
        marginTop: 4
    },
    fail: {
        alignItems: "center",
        justifyContent: "center",
        padding: 16
    },
    failText: {
        color: colors.muted,
        fontWeight: "600",
        textAlign: "center"
    }
});
