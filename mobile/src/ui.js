import React from "react";
import {
    ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "./lib/theme";

export function Screen(props) {
    return (
        <SafeAreaView style={[styles.safe, props.dark && styles.safeDark, props.style]} edges={["top"]}>
            {props.children}
        </SafeAreaView>
    );
}

export function ScrollScreen(props) {
    return (
        <Screen dark={props.dark}>
            <ScrollView contentContainerStyle={[styles.pad, props.contentStyle]} keyboardShouldPersistTaps="handled">
                {props.children}
            </ScrollView>
        </Screen>
    );
}

export function PrimaryButton(props) {
    return (
        <Pressable
            onPress={props.onPress}
            disabled={props.disabled}
            style={[styles.primary, props.disabled && { opacity: 0.4 }, props.style]}
        >
            {props.busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryTxt}>{props.title}</Text>}
        </Pressable>
    );
}

export function GhostButton(props) {
    return (
        <Pressable onPress={props.onPress} style={[styles.ghost, props.style]}>
            <Text style={styles.ghostTxt}>{props.title}</Text>
        </Pressable>
    );
}

export function Field(props) {
    return (
        <View style={{ marginBottom: 12 }}>
            {props.label ? <Text style={styles.label}>{props.label}</Text> : null}
            <TextInput
                value={props.value}
                onChangeText={props.onChangeText}
                placeholder={props.placeholder}
                placeholderTextColor="#A8A29E"
                secureTextEntry={props.secure}
                autoCapitalize={props.autoCapitalize || "none"}
                keyboardType={props.keyboardType}
                style={styles.input}
            />
            {props.hint ? <Text style={styles.hint}>{props.hint}</Text> : null}
        </View>
    );
}

export function Chip(props) {
    return (
        <Pressable onPress={props.onPress} style={[styles.chip, props.on && styles.chipOn]}>
            <Text style={[styles.chipTxt, props.on && styles.chipTxtOn]}>{props.title}</Text>
            {props.sub ? <Text style={[styles.chipSub, props.on && { color: "#EEF2FF" }]}>{props.sub}</Text> : null}
        </Pressable>
    );
}

export function Card(props) {
    return <View style={[styles.card, props.style]}>{props.children}</View>;
}

export function confirmQuit(onYes) {
    Alert.alert("Çıkış", "Testten çıkmak istediğinize emin misiniz? Cevapladıkların kayıtlı kalır.", [
        { text: "Vazgeç", style: "cancel" },
        { text: "Çık", style: "destructive", onPress: onYes }
    ]);
}

var styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    safeDark: { backgroundColor: colors.bgDark },
    pad: { padding: 20, paddingBottom: 40 },
    primary: {
        backgroundColor: colors.teal,
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: "center"
    },
    primaryTxt: { color: "#fff", fontWeight: "700", fontSize: 16 },
    ghost: {
        borderWidth: 2,
        borderColor: colors.border,
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: "center"
    },
    ghostTxt: { fontWeight: "600", color: colors.text },
    label: { fontSize: 12, fontWeight: "700", color: colors.muted, marginBottom: 6 },
    hint: { fontSize: 12, color: colors.muted, marginTop: 6 },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        backgroundColor: "#fff",
        color: colors.text
    },
    chip: {
        flex: 1,
        borderWidth: 2,
        borderColor: colors.border,
        borderRadius: 14,
        padding: 10,
        alignItems: "center"
    },
    chipOn: { borderColor: colors.indigo, backgroundColor: "#EEF2FF" },
    chipTxt: { fontWeight: "700", fontSize: 13, color: colors.text, textAlign: "center" },
    chipTxtOn: { color: colors.indigo },
    chipSub: { fontSize: 10, color: colors.muted, marginTop: 4, textAlign: "center" },
    card: {
        backgroundColor: "#fff",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
        marginBottom: 12
    }
});
