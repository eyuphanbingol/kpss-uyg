import React from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    Modal,
} from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronLeft, Eye, EyeOff, Settings } from "lucide-react-native";
import { colors } from "./lib/theme";
import { StudentStore } from "./lib/store";

// ============================================================
// YARDIMCILAR
// ============================================================

var { width, height } = Dimensions.get("window");

export function isDarkMode(dark) {
    return dark === true;
}

export function getColor(dark, lightColor, darkColor) {
    return dark ? darkColor : lightColor;
}

export function hapticTap() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(function () {});
}

export function Tap(props) {
    var armed = React.useRef(false);
    var instant = props.pressOnIn !== false;
    return (
        <Pressable
            accessible={true}
            accessibilityRole="button"
            android_ripple={{ color: "rgba(0,0,0,0.05)" }}
            disabled={props.disabled}
            hitSlop={props.hitSlop}
            onPressIn={function () {
                if (props.disabled) return;
                if (!props.noHaptic) hapticTap();
                if (props.onPressIn) props.onPressIn();
                if (instant && props.onPress) {
                    armed.current = true;
                    props.onPress();
                }
            }}
            onPress={function () {
                if (instant) {
                    if (armed.current) {
                        armed.current = false;
                        return;
                    }
                }
                if (!props.disabled && props.onPress) props.onPress();
            }}
            style={props.style}
        >
            {props.children}
        </Pressable>
    );
}

// ============================================================
// SCREEN
// ============================================================

export function Screen(props) {
    var isDark = props.dark === true;
    var edges = props.edges;
    if (!edges) {
        if (props.noTop && props.noBottom) edges = [];
        else if (props.noTop) edges = ["bottom"];
        else if (props.noBottom) edges = ["top"];
        else edges = ["top", "bottom"];
    }

    return (
        <SafeAreaView
            style={[
                styles.safe,
                isDark && styles.safeDark,
                props.style,
            ]}
            edges={edges}
        >
            {props.children}
        </SafeAreaView>
    );
}

// ============================================================
// SCROLL SCREEN
// ============================================================

export function ScrollScreen(props) {
    var isDark = props.dark === true;

    return (
        <Screen dark={isDark} noTop={props.noTop} noBottom={props.noBottom}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={[
                    styles.pad,
                    isDark && styles.padDark,
                    props.contentStyle,
                ]}
                keyboardShouldPersistTaps="always"
                delaysContentTouches={false}
                canCancelContentTouches={false}
                nestedScrollEnabled={false}
                overScrollMode="never"
                bounces={false}
                showsVerticalScrollIndicator={false}
            >
                {props.children}
            </ScrollView>
        </Screen>
    );
}

// ============================================================
// KEYBOARD AVOID SCREEN
// ============================================================

export function KeyboardScreen(props) {
    var isDark = props.dark === true;

    return (
        <Screen dark={isDark}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
            >
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={[
                        styles.pad,
                        isDark && styles.padDark,
                        props.contentStyle,
                    ]}
                    keyboardShouldPersistTaps="always"
                    delaysContentTouches={false}
                    canCancelContentTouches={false}
                    overScrollMode="never"
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                >
                    {props.children}
                </ScrollView>
            </KeyboardAvoidingView>
        </Screen>
    );
}

// ============================================================
// PRIMARY BUTTON
// ============================================================

export function PrimaryButton(props) {
    var isDisabled = props.disabled || props.busy;

    return (
        <Tap
            onPress={props.onPress}
            disabled={isDisabled}
            activeOpacity={0.82}
            style={[
                styles.primaryWrap,
                isDisabled && styles.primaryDisabled,
                props.style,
            ]}
        >
            <LinearGradient
                colors={["#0D2C4D", "#14607a", "#1D8A99"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.primary}
            >
                {props.busy ? (
                    <ActivityIndicator color="#fff" size="small" />
                ) : (
                    <Text style={[styles.primaryTxt, props.textStyle]}>
                        {props.title || props.children}
                    </Text>
                )}
            </LinearGradient>
        </Tap>
    );
}

// ============================================================
// SECONDARY BUTTON
// ============================================================

export function SecondaryButton(props) {
    var isDisabled = props.disabled || props.busy;

    return (
        <Tap
            onPress={props.onPress}
            disabled={isDisabled}
            style={[
                styles.secondary,
                isDisabled && styles.secondaryDisabled,
                props.style,
            ]}
        >
            {props.busy ? (
                <ActivityIndicator color={colors.text} size="small" />
            ) : (
                <Text style={[styles.secondaryTxt, props.textStyle]}>
                    {props.title || props.children}
                </Text>
            )}
        </Tap>
    );
}

// ============================================================
// GHOST BUTTON
// ============================================================

export function GhostButton(props) {
    var isDisabled = props.disabled || props.busy;

    return (
        <Tap
            onPress={props.onPress}
            disabled={isDisabled}
            style={[
                styles.ghost,
                isDisabled && styles.ghostDisabled,
                props.style,
            ]}
        >
            {props.busy ? (
                <ActivityIndicator color={colors.indigo} size="small" />
            ) : (
                <Text style={[styles.ghostTxt, props.textStyle]}>
                    {props.title || props.children}
                </Text>
            )}
        </Tap>
    );
}

// ============================================================
// DANGER BUTTON
// ============================================================

export function DangerButton(props) {
    var isDisabled = props.disabled || props.busy;

    return (
        <Tap
            onPress={props.onPress}
            disabled={isDisabled}
            style={[
                styles.danger,
                isDisabled && styles.dangerDisabled,
                props.style,
            ]}
        >
            {props.busy ? (
                <ActivityIndicator color="#fff" size="small" />
            ) : (
                <Text style={[styles.dangerTxt, props.textStyle]}>
                    {props.title || props.children}
                </Text>
            )}
        </Tap>
    );
}

// ============================================================
// FIELD (Input)
// ============================================================

export var Field = React.forwardRef(function Field(props, ref) {
    var [focused, setFocused] = React.useState(false);
    var [secure, setSecure] = React.useState(!!props.secure);

    return (
        <View style={[{ marginBottom: 16 }, props.containerStyle]}>
            {props.label ? (
                <Text style={[styles.label, props.labelStyle]}>{props.label}</Text>
            ) : null}
            <View style={styles.inputWrap}>
                <TextInput
                    ref={ref}
                    value={props.value}
                    onChangeText={props.onChangeText}
                    placeholder={props.placeholder}
                    placeholderTextColor={colors.muted}
                    secureTextEntry={!!props.secure && secure}
                    autoCapitalize={props.autoCapitalize || "none"}
                    keyboardType={props.keyboardType}
                    autoCorrect={false}
                    multiline={props.multiline}
                    numberOfLines={props.numberOfLines || 1}
                    onSubmitEditing={props.onSubmitEditing}
                    returnKeyType={props.returnKeyType}
                    onFocus={function () { setFocused(true); props.onFocus && props.onFocus(); }}
                    onBlur={function () { setFocused(false); props.onBlur && props.onBlur(); }}
                    style={[
                        styles.input,
                        props.secure && styles.inputWithEye,
                        focused && styles.inputFocused,
                        props.error && styles.inputError,
                        props.multiline && { minHeight: 80, textAlignVertical: "top" },
                        props.style,
                    ]}
                    editable={!props.disabled}
                    maxLength={props.maxLength}
                />
                {props.secure ? (
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={secure ? "Şifreyi göster" : "Şifreyi gizle"}
                        android_ripple={{ color: "rgba(0,0,0,0.05)" }}
                        onPress={function () { setSecure(!secure); }}
                        style={styles.eyeBtn}
                        hitSlop={6}
                    >
                        {secure ? <EyeOff size={18} color="#64748B" /> : <Eye size={18} color="#0F172A" />}
                    </Pressable>
                ) : null}
            </View>
            {props.error ? (
                <Text style={[styles.errorText, props.errorStyle]}>{props.error}</Text>
            ) : null}
            {props.hint ? (
                <Text style={[styles.hint, props.hintStyle]}>{props.hint}</Text>
            ) : null}
        </View>
    );
});

// ============================================================
// CHIP
// ============================================================

export function ThemeToggle(props) {
    var isDark = props.dark === true;
    return (
        <Pressable
            android_ripple={{ color: "rgba(0,0,0,0.05)" }}
            onPress={function () { StudentStore.setDark(!isDark); }}
            style={[styles.themeBtn, isDark && styles.themeBtnDark]}
        >
            <Settings size={18} color={isDark ? "#E2E8F0" : "#0F172A"} />
        </Pressable>
    );
}

export function PageHeader(props) {
    var isDark = props.dark === true;
    return (
        <View style={[styles.pageHeader, props.style]}>
            {props.onBack ? (
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Geri"
                    hitSlop={8}
                    android_ripple={{ color: "rgba(0,0,0,0.05)" }}
                    onPress={props.onBack}
                    style={[styles.headerBack, isDark && styles.headerBackDark]}
                >
                    <ChevronLeft size={20} color={isDark ? "#E2E8F0" : "#0F172A"} />
                </Pressable>
            ) : null}
            <View style={{ flex: 1, minWidth: 0 }}>
                {props.kicker || null}
                <Text style={[styles.pageTitle, isDark && styles.pageTitleDark]}>{props.title}</Text>
                {props.subtitle ? (
                    <Text style={[styles.pageSub, isDark && { color: "#94A3B8" }]}>{props.subtitle}</Text>
                ) : null}
            </View>
            {props.right !== undefined ? props.right : <ThemeToggle dark={isDark} />}
        </View>
    );
}

export function DersIconBox(props) {
    return (
        <View style={[styles.dersIconBox, props.style]}>
            <Text style={{ fontSize: props.size || 24 }}>{props.icon}</Text>
        </View>
    );
}

export function Chip(props) {
    var isOn = props.on === true;

    return (
        <Tap
            onPress={props.onPress}
            disabled={props.disabled}
            style={[
                styles.chip,
                isOn && styles.chipOn,
                props.disabled && { opacity: 0.5 },
                props.style,
            ]}
        >
            <Text style={[
                styles.chipTxt,
                isOn && styles.chipTxtOn,
                props.textStyle,
            ]}>
                {props.title}
            </Text>
            {props.sub ? (
                <Text style={[
                    styles.chipSub,
                    isOn && { color: "#92400E" },
                    props.subStyle,
                ]}>
                    {props.sub}
                </Text>
            ) : null}
        </Tap>
    );
}

// ============================================================
// CHIP GROUP
// ============================================================

export function ChipGroup(props) {
    return (
        <View style={[styles.chipGroup, props.style]}>
            {React.Children.map(props.children, function (child, index) {
                return React.cloneElement(child, {
                    style: [
                        child.props.style,
                        index < React.Children.count(props.children) - 1 && { marginRight: 8 },
                    ],
                });
            })}
        </View>
    );
}

export function BackChip(props) {
    var dark = props.dark === true;
    return (
        <Pressable
            hitSlop={8}
            android_ripple={{ color: "rgba(0,0,0,0.05)" }}
            onPress={props.onPress}
            style={[styles.backChip, dark && styles.backChipDark, props.style]}
        >
            <ChevronLeft size={18} color={dark ? "#E2E8F0" : "#0F172A"} />
            <Text style={[styles.backChipLabel, dark && styles.backChipTextDark]}>{props.label || "Geri"}</Text>
        </Pressable>
    );
}

// ============================================================
// CARD
// ============================================================

export function Card(props) {
    var isDark = props.dark === true;
    var cardStyle = [
        styles.card,
        isDark && styles.cardDark,
        styles.cardElevated,
        props.glass && styles.cardGlass,
        props.style,
    ];

    if (props.onPress) {
        return (
            <Tap disabled={props.disabled} onPress={props.onPress} style={cardStyle} activeOpacity={0.7}>
                {props.children}
            </Tap>
        );
    }

    return (
        <View style={cardStyle}>
            {props.children}
        </View>
    );
}

// ============================================================
// SECTION
// ============================================================

export function Section(props) {
    return (
        <View style={[styles.section, props.style]}>
            {props.title ? (
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, props.titleStyle]}>
                        {props.title}
                    </Text>
                    {props.rightAction && (
                        <TouchableOpacity onPress={props.onRightAction} activeOpacity={0.7}>
                            <Text style={styles.sectionAction}>{props.rightAction}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            ) : null}
            {props.children}
        </View>
    );
}

// ============================================================
// BADGE
// ============================================================

export function Badge(props) {
    var colors_map = {
        primary: { bg: "#FEF3C7", text: "#92400E" },
        success: { bg: "#ECFDF5", text: "#065F46" },
        warning: { bg: "#FEF3C7", text: "#92400E" },
        danger: { bg: "#FFE4E6", text: "#9F1239" },
        muted: { bg: "#F1F5F9", text: "#64748B" },
        gold: { bg: "#FEF3C7", text: "#92400E" },
    };

    var style_map = colors_map[props.type] || colors_map.primary;

    return (
        <View
            style={[
                styles.badge,
                { backgroundColor: style_map.bg },
                props.outline && { backgroundColor: "transparent", borderWidth: 1, borderColor: style_map.bg },
                props.style,
            ]}
        >
            <Text
                style={[
                    styles.badgeText,
                    { color: props.outline ? style_map.bg : style_map.text },
                    props.textStyle,
                ]}
            >
                {props.title || props.children}
            </Text>
        </View>
    );
}

// ============================================================
// DIVIDER
// ============================================================

export function Divider(props) {
    return (
        <View
            style={[
                styles.divider,
                { backgroundColor: props.color || colors.border },
                props.style,
            ]}
        />
    );
}

// ============================================================
// LOADING
// ============================================================

export function Loading(props) {
    return (
        <View style={[styles.loading, props.style]}>
            <ActivityIndicator size={props.size || "large"} color={props.color || colors.indigo} />
            {props.text && (
                <Text style={[styles.loadingText, props.textStyle]}>{props.text}</Text>
            )}
        </View>
    );
}

// ============================================================
// EMPTY STATE
// ============================================================

export function EmptyState(props) {
    return (
        <View style={[styles.emptyState, props.style]}>
            <Text style={[styles.emptyIcon, props.iconStyle]}>{props.icon || "📭"}</Text>
            <Text style={[styles.emptyTitle, props.titleStyle]}>
                {props.title || "Henüz veri yok"}
            </Text>
            <Text style={[styles.emptyDesc, props.descStyle]}>
                {props.description || "Çalışmaya başlayınca burada görünecek"}
            </Text>
            {props.actionText && props.onAction && (
                <PrimaryButton
                    title={props.actionText}
                    onPress={props.onAction}
                    style={{ marginTop: 16, paddingHorizontal: 24 }}
                />
            )}
        </View>
    );
}

// ============================================================
// BOTTOM SHEET
// ============================================================

export function BottomSheet(props) {
    var insets = useSafeAreaInsets();

    if (!props.visible) return null;

    return (
        <Modal
            transparent={true}
            visible={props.visible}
            animationType="slide"
            onRequestClose={props.onClose}
        >
            <Pressable
                style={styles.bottomSheetOverlay}
                onPress={props.onClose}
            >
                <Pressable
                    style={[
                        styles.bottomSheetContent,
                        { paddingBottom: insets.bottom + 16 },
                        props.style,
                    ]}
                    onPress={function (e) { e.stopPropagation(); }}
                >
                    <View style={styles.bottomSheetHandle} />
                    {props.children}
                </Pressable>
            </Pressable>
        </Modal>
    );
}

// ============================================================
// TOAST
// ============================================================

export function Toast(props) {
    var [visible, setVisible] = React.useState(true);

    React.useEffect(function () {
        if (props.duration && props.duration > 0) {
            var timer = setTimeout(function () {
                setVisible(false);
                if (props.onClose) props.onClose();
            }, props.duration);
            return function () { clearTimeout(timer); };
        }
    }, []);

    if (!visible) return null;

    var typeColors = {
        success: colors.emerald,
        error: colors.rose,
        warning: colors.amber,
        info: colors.indigo,
    };

    var typeIcons = {
        success: "✅",
        error: "❌",
        warning: "⚠️",
        info: "ℹ️",
    };

    var bgColor = typeColors[props.type] || colors.indigo;

    return (
        <View
            style={[
                styles.toast,
                { backgroundColor: bgColor },
                props.style,
            ]}
        >
            <Text style={styles.toastIcon}>{typeIcons[props.type] || "ℹ️"}</Text>
            <Text style={styles.toastText}>{props.message}</Text>
            <TouchableOpacity onPress={function () { setVisible(false); if (props.onClose) props.onClose(); }}>
                <Text style={styles.toastClose}>✕</Text>
            </TouchableOpacity>
        </View>
    );
}

// ============================================================
// CONFIRM
// ============================================================

export function confirmQuit(onYes, message) {
    Alert.alert(
        "Çıkış",
        message || "Testten çıkmak istediğinize emin misiniz? Cevapladıkların kayıtlı kalır.",
        [
            { text: "Vazgeç", style: "cancel" },
            { text: "Çık", style: "destructive", onPress: onYes }
        ]
    );
}

// ============================================================
// STILLER
// ============================================================

var styles = StyleSheet.create({
    // ---------- Screen ----------
    safe: {
        flex: 1,
        backgroundColor: colors.bg,
    },
    safeDark: {
        backgroundColor: colors.bgDark,
    },
    pad: {
        paddingHorizontal: 12,
        paddingTop: 20,
        paddingBottom: 28,
    },
    padDark: {},

    pageHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 16,
        gap: 12,
    },
    headerBack: {
        width: 40,
        height: 40,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        marginTop: 2,
    },
    headerBackDark: {
        backgroundColor: "#1E293B",
        borderColor: "#334155",
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: "700",
        color: "#0F172A",
        letterSpacing: -0.4,
    },
    pageTitleDark: {
        color: "#FAFAF9",
    },
    pageSub: {
        color: colors.muted,
        fontSize: 13,
        marginTop: 4,
        fontWeight: "500",
    },
    themeBtn: {
        width: 42,
        height: 42,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.35)",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255,255,255,0.72)",
    },
    themeBtnDark: {
        backgroundColor: "rgba(15, 23, 42, 0.75)",
        borderColor: "rgba(255,255,255,0.08)",
    },
    dersIconBox: {
        width: 56,
        height: 56,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(79, 70, 229, 0.08)",
        borderWidth: 1,
        borderColor: "rgba(79, 70, 229, 0.1)",
        marginRight: 12,
    },

    // ---------- Primary Button ----------
    primaryWrap: {
        borderRadius: 16,
        overflow: "hidden",
        shadowColor: "#0D2C4D",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.28,
        shadowRadius: 12,
        elevation: 4,
    },
    primary: {
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 56,
    },
    primaryDisabled: {
        opacity: 0.4,
    },
    primaryTxt: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
        textAlign: "center",
    },

    // ---------- Secondary Button ----------
    secondary: {
        backgroundColor: colors.bg,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 56,
    },
    secondaryDisabled: {
        opacity: 0.4,
    },
    secondaryTxt: {
        color: colors.text,
        fontWeight: "600",
        fontSize: 16,
        textAlign: "center",
    },

    // ---------- Ghost Button ----------
    ghost: {
        borderWidth: 2,
        borderColor: colors.indigo,
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 52,
    },
    ghostDisabled: {
        opacity: 0.4,
    },
    ghostTxt: {
        fontWeight: "600",
        color: colors.indigo,
        fontSize: 16,
        textAlign: "center",
    },

    // ---------- Danger Button ----------
    danger: {
        backgroundColor: colors.rose,
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: colors.rose,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 4,
        minHeight: 56,
    },
    dangerDisabled: {
        opacity: 0.4,
    },
    dangerTxt: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
        textAlign: "center",
    },

    // ---------- Field ----------
    label: {
        fontSize: 12,
        fontWeight: "700",
        color: colors.muted,
        marginBottom: 6,
        letterSpacing: 0.5,
    },
    hint: {
        fontSize: 12,
        color: colors.muted,
        marginTop: 6,
    },
    errorText: {
        fontSize: 12,
        color: colors.rose,
        marginTop: 4,
    },
    inputWrap: {
        position: "relative",
        justifyContent: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        backgroundColor: "#F8FAFC",
        color: "#0F172A",
        minHeight: 52,
    },
    inputWithEye: {
        paddingRight: 48,
    },
    eyeBtn: {
        position: "absolute",
        right: 4,
        top: 0,
        bottom: 0,
        width: 44,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        borderRadius: 12,
    },
    inputFocused: {
        borderColor: "#D97706",
        backgroundColor: "#fff",
    },
    inputError: {
        borderColor: colors.rose,
    },

    // ---------- Chip ----------
    chip: {
        flex: 1,
        borderWidth: 2,
        borderColor: colors.border,
        borderRadius: 14,
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 56,
    },
    chipOn: {
        borderColor: "#D97706",
        backgroundColor: "#FEF3C7",
    },
    chipTxt: {
        fontWeight: "700",
        fontSize: 13,
        color: colors.text,
        textAlign: "center",
    },
    chipTxtOn: {
        color: "#92400E",
    },
    chipSub: {
        fontSize: 10,
        color: colors.muted,
        marginTop: 4,
        textAlign: "center",
    },
    chipGroup: {
        flexDirection: "row",
        flexWrap: "wrap",
    },

    // ---------- Card ----------
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        padding: 16,
        marginBottom: 12,
        overflow: "hidden",
    },
    cardDark: {
        backgroundColor: "#1E293B",
        borderColor: "#334155",
    },
    cardElevated: {},
    cardGlass: {
        backgroundColor: "rgba(255,255,255,0.7)",
        borderColor: "rgba(255,255,255,0.3)",
    },

    // ---------- Section ----------
    section: {
        marginBottom: 16,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.text,
    },
    sectionAction: {
        fontSize: 13,
        fontWeight: "500",
        color: colors.indigo,
    },

    // ---------- Badge ----------
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 12,
        alignSelf: "flex-start",
    },
    badgeText: {
        fontSize: 10,
        fontWeight: "700",
        letterSpacing: 0.3,
    },

    // ---------- Divider ----------
    divider: {
        height: 1,
        marginVertical: 12,
    },

    // ---------- Loading ----------
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: colors.muted,
    },

    // ---------- Empty State ----------
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 32,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.text,
        textAlign: "center",
        marginBottom: 8,
    },
    emptyDesc: {
        fontSize: 14,
        color: colors.muted,
        textAlign: "center",
    },

    // ---------- Bottom Sheet ----------
    bottomSheetOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
    },
    bottomSheetContent: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 8,
        maxHeight: "80%",
    },
    bottomSheetHandle: {
        alignSelf: "center",
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.border,
        marginBottom: 12,
    },

    // ---------- Toast ----------
    toast: {
        position: "absolute",
        bottom: 20,
        left: 16,
        right: 16,
        zIndex: 1000,
        borderRadius: 14,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    toastIcon: {
        fontSize: 18,
        marginRight: 10,
    },
    toastText: {
        flex: 1,
        color: "#fff",
        fontSize: 14,
        fontWeight: "500",
    },
    toastClose: {
        color: "#fff",
        fontSize: 16,
        paddingLeft: 8,
        opacity: 0.7,
    },
    backChip: {
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingLeft: 10,
        paddingRight: 14,
        borderRadius: 999,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "rgba(13, 44, 77, 0.12)",
        marginBottom: 10,
        gap: 4,
    },
    backChipDark: {
        backgroundColor: "#2A2724",
        borderColor: "rgba(255,255,255,0.12)",
    },
    backChipMark: {
        color: "#0D2C4D",
        fontSize: 18,
        fontWeight: "600",
        marginTop: -1,
    },
    backChipLabel: {
        color: "#0D2C4D",
        fontSize: 13,
        fontWeight: "600",
    },
    backChipTextDark: {
        color: "#F5EBC7",
    },
});

// ============================================================
// EXPORT DEFAULT
// ============================================================

export default {
    Screen,
    ScrollScreen,
    KeyboardScreen,
    PrimaryButton,
    SecondaryButton,
    GhostButton,
    DangerButton,
    Field,
    Chip,
    ChipGroup,
    PageHeader,
    ThemeToggle,
    DersIconBox,
    Card,
    BackChip,
    Section,
    Badge,
    Divider,
    Loading,
    EmptyState,
    BottomSheet,
    Toast,
    confirmQuit,
    isDarkMode,
    getColor,
};