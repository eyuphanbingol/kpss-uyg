import React, { useEffect, useState } from "react";
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { X } from "lucide-react-native";
import { hapticTap } from "../ui";

export function ZoomableImage(props) {
    var uri = props.uri;
    var dark = props.dark === true;
    var _open = useState(false);
    var open = _open[0];
    var setOpen = _open[1];
    var win = useWindowDimensions();
    var insets = useSafeAreaInsets();
    var _h = useState(props.previewHeight || 200);
    var previewH = _h[0];
    var setPreviewH = _h[1];

    useEffect(function () {
        if (!open) return;
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE).catch(function () {});
        return function () {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(function () {});
        };
    }, [open]);

    if (!uri) return null;

    function close() {
        hapticTap();
        setOpen(false);
    }

    return (
        <View style={styles.wrap}>
            <Pressable
                accessibilityRole="button"
                accessibilityLabel="Haritayı büyüt"
                android_ripple={{ color: "rgba(0,0,0,0.05)" }}
                onPress={function () {
                    hapticTap();
                    setOpen(true);
                }}
                style={[styles.preview, dark && styles.previewDark]}
            >
                <Image
                    source={{ uri: uri }}
                    resizeMode="contain"
                    onLoad={function (e) {
                        var iw = e.nativeEvent.source && e.nativeEvent.source.width;
                        var ih = e.nativeEvent.source && e.nativeEvent.source.height;
                        if (iw && ih) {
                            var box = Math.min(win.width - 64, 360);
                            setPreviewH(Math.min(240, Math.max(160, Math.round(box * ih / iw))));
                        }
                    }}
                    style={[styles.previewImg, { height: previewH }]}
                />
                <Text style={[styles.hint, dark && styles.hintDark]}>Büyütmek için dokun</Text>
            </Pressable>

            <Modal visible={open} animationType="fade" supportedOrientations={["landscape", "landscape-left", "landscape-right", "portrait"]} onRequestClose={close}>
                <View style={styles.viewer}>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Kapat"
                        onPress={close}
                        android_ripple={{ color: "rgba(255,255,255,0.12)" }}
                        style={[styles.close, { top: Math.max(insets.top, 12), right: Math.max(insets.right, 12) }]}
                    >
                        <X size={22} color="#F8FAFC" />
                    </Pressable>
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={styles.zoomBox}
                        maximumZoomScale={4}
                        minimumZoomScale={1}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        centerContent
                        bounces={false}
                    >
                        <Image
                            source={{ uri: uri }}
                            resizeMode="contain"
                            style={{ width: win.width, height: win.height }}
                        />
                    </ScrollView>
                    <Text style={[styles.viewerHint, { bottom: Math.max(insets.bottom, 10) }]}>Pinch ile yakınlaştır · kapatmak için X</Text>
                </View>
            </Modal>
        </View>
    );
}

var styles = StyleSheet.create({
    wrap: {
        width: "100%",
        alignItems: "center",
    },
    preview: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        paddingVertical: 10,
        paddingHorizontal: 8,
    },
    previewDark: {
        backgroundColor: "#1E293B",
        borderColor: "#334155",
    },
    previewImg: {
        width: "100%",
        alignSelf: "center",
        backgroundColor: "transparent",
    },
    hint: {
        marginTop: 8,
        fontSize: 12,
        fontWeight: "600",
        color: "#64748B",
    },
    hintDark: {
        color: "#94A3B8",
    },
    viewer: {
        flex: 1,
        backgroundColor: "#041C24",
    },
    zoomBox: {
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    close: {
        position: "absolute",
        zIndex: 4,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(15,23,42,0.72)",
        borderWidth: 1,
        borderColor: "rgba(226,232,240,0.25)",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    viewerHint: {
        position: "absolute",
        alignSelf: "center",
        color: "rgba(248,250,252,0.7)",
        fontSize: 12,
        fontWeight: "600",
    },
});
