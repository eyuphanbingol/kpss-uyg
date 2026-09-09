import React, { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronRight } from "lucide-react-native";

export var P = {
    bg: "#F8FAFC",
    navy: "#0F172A",
    gold: "#D97706",
    body: "#334155",
    muted: "#64748B",
    line: "#E2E8F0",
    card: "#FFFFFF",
    goldSoft: "#FEF3C7",
    goldInk: "#92400E",
};

export function Hit(props) {
    return (
        <Pressable
            accessibilityRole="button"
            android_ripple={{ color: "rgba(0,0,0,0.05)" }}
            disabled={props.disabled}
            onPress={props.onPress}
            style={props.style}
        >
            {props.children}
        </Pressable>
    );
}

export var AccentCard = memo(function AccentCard(props) {
    return (
        <Hit
            onPress={props.onPress}
            disabled={props.disabled}
            style={[
                styles.card,
                props.dark && styles.cardDark,
                props.disabled && { opacity: 0.42 },
                props.style,
            ]}
        >
            <View style={[styles.accent, { backgroundColor: props.accent || P.gold }]} />
            <View style={styles.inner}>{props.children}</View>
            {props.chevron ? <ChevronRight size={18} color={P.muted} /> : null}
        </Hit>
    );
});

export var PctBadge = memo(function PctBadge(props) {
    return (
        <View style={styles.pct}>
            <Text style={styles.pctTxt}>{props.label}</Text>
        </View>
    );
});

var styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: P.card,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: P.line,
        overflow: "hidden",
        marginBottom: 10,
        minHeight: 64,
    },
    cardDark: {
        backgroundColor: "#1E293B",
        borderColor: "#334155",
    },
    accent: {
        width: 3,
        alignSelf: "stretch",
        backgroundColor: P.gold,
    },
    inner: {
        flex: 1,
        minWidth: 0,
        paddingVertical: 14,
        paddingHorizontal: 12,
    },
    pct: {
        backgroundColor: P.goldSoft,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginRight: 8,
    },
    pctTxt: {
        color: P.goldInk,
        fontWeight: "800",
        fontSize: 12,
    },
});
