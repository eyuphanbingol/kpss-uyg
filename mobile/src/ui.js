import React from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    Modal,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "./lib/theme";

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

// ============================================================
// SCREEN
// ============================================================

export function Screen(props) {
    var insets = useSafeAreaInsets();
    var isDark = props.dark === true;

    return (
        <SafeAreaView
            style={[
                styles.safe,
                isDark && styles.safeDark,
                {
                    paddingTop: props.noTop ? 0 : insets.top,
                    paddingBottom: props.noBottom ? 0 : insets.bottom,
                },
                props.style,
            ]}
            edges={props.edges || ["top"]}
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
        <Screen dark={isDark} noTop={props.noTop}>
            <ScrollView
                contentContainerStyle={[
                    styles.pad,
                    isDark && styles.padDark,
                    props.contentStyle,
                ]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                bounces={true}
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
                    contentContainerStyle={[
                        styles.pad,
                        isDark && styles.padDark,
                        props.contentStyle,
                    ]}
                    keyboardShouldPersistTaps="handled"
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
        <Pressable
            onPress={props.onPress}
            disabled={isDisabled}
            style={[
                styles.primary,
                isDisabled && styles.primaryDisabled,
                props.style,
            ]}
            android_ripple={{ color: "rgba(255,255,255,0.2)" }}
        >
            {props.busy ? (
                <ActivityIndicator color="#fff" size="small" />
            ) : (
                <Text style={[styles.primaryTxt, props.textStyle]}>
                    {props.title || props.children}
                </Text>
            )}
        </Pressable>
    );
}

// ============================================================
// SECONDARY BUTTON
// ============================================================

export function SecondaryButton(props) {
    var isDisabled = props.disabled || props.busy;

    return (
        <Pressable
            onPress={props.onPress}
            disabled={isDisabled}
            style={[
                styles.secondary,
                isDisabled && styles.secondaryDisabled,
                props.style,
            ]}
            android_ripple={{ color: "rgba(0,0,0,0.05)" }}
        >
            {props.busy ? (
                <ActivityIndicator color={colors.text} size="small" />
            ) : (
                <Text style={[styles.secondaryTxt, props.textStyle]}>
                    {props.title || props.children}
                </Text>
            )}
        </Pressable>
    );
}

// ============================================================
// GHOST BUTTON
// ============================================================

export function GhostButton(props) {
    var isDisabled = props.disabled || props.busy;

    return (
        <Pressable
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
        </Pressable>
    );
}

// ============================================================
// DANGER BUTTON
// ============================================================

export function DangerButton(props) {
    var isDisabled = props.disabled || props.busy;

    return (
        <Pressable
            onPress={props.onPress}
            disabled={isDisabled}
            style={[
                styles.danger,
                isDisabled && styles.dangerDisabled,
                props.style,
            ]}
            android_ripple={{ color: "rgba(255,255,255,0.2)" }}
        >
            {props.busy ? (
                <ActivityIndicator color="#fff" size="small" />
            ) : (
                <Text style={[styles.dangerTxt, props.textStyle]}>
                    {props.title || props.children}
                </Text>
            )}
        </Pressable>
    );
}

// ============================================================
// FIELD (Input)
// ============================================================

export function Field(props) {
    var [focused, setFocused] = React.useState(false);
    var [secure, setSecure] = React.useState(props.secure || false);

    return (
        <View style={[{ marginBottom: 16 }, props.containerStyle]}>
            {props.label ? (
                <Text style={[styles.label, props.labelStyle]}>{props.label}</Text>
            ) : null}
            <View style={{ position: "relative" }}>
                <TextInput
                    value={props.value}
                    onChangeText={props.onChangeText}
                    placeholder={props.placeholder}
                    placeholderTextColor={colors.muted}
                    secureTextEntry={secure}
                    autoCapitalize={props.autoCapitalize || "none"}
                    keyboardType={props.keyboardType}
                    multiline={props.multiline}
                    numberOfLines={props.numberOfLines || 1}
                    onFocus={function () { setFocused(true); props.onFocus && props.onFocus(); }}
                    onBlur={function () { setFocused(false); props.onBlur && props.onBlur(); }}
                    style={[
                        styles.input,
                        focused && styles.inputFocused,
                        props.error && styles.inputError,
                        props.multiline && { minHeight: 80, textAlignVertical: "top" },
                        props.style,
                    ]}
                    editable={!props.disabled}
                    maxLength={props.maxLength}
                />
                {props.secure !== undefined && (
                    <TouchableOpacity
                        style={{
                            position: "absolute",
                            right: 14,
                            top: "50%",
                            transform: [{ translateY: -10 }],
                        }}
                        onPress={function () { setSecure(!secure); }}
                    >
                        <Text style={{ fontSize: 18 }}>
                            {secure ? "👁️" : "👁️‍🗨️"}
                        </Text>
                    </TouchableOpacity>
                )}
                {props.rightIcon && (
                    <View
                        style={{
                            position: "absolute",
                            right: 14,
                            top: "50%",
                            transform: [{ translateY: -10 }],
                        }}
                    >
                        {props.rightIcon}
                    </View>
                )}
            </View>
            {props.error ? (
                <Text style={[styles.errorText, props.errorStyle]}>{props.error}</Text>
            ) : null}
            {props.hint ? (
                <Text style={[styles.hint, props.hintStyle]}>{props.hint}</Text>
            ) : null}
        </View>
    );
}

// ============================================================
// CHIP
// ============================================================

export function Chip(props) {
    var isOn = props.on === true;

    return (
        <Pressable
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
                    isOn && { color: colors.indigo },
                    props.subStyle,
                ]}>
                    {props.sub}
                </Text>
            ) : null}
        </Pressable>
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

// ============================================================
// CARD
// ============================================================

export function Card(props) {
    var isDark = props.dark === true;
    var isPressable = props.onPress !== undefined;

    var CardComponent = isPressable ? TouchableOpacity : View;

    return (
        <CardComponent
            onPress={props.onPress}
            activeOpacity={0.8}
            style={[
                styles.card,
                isDark && styles.cardDark,
                props.elevated && styles.cardElevated,
                props.glass && styles.cardGlass,
                props.style,
            ]}
        >
            {props.children}
        </CardComponent>
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
        primary: { bg: colors.indigo, text: "#fff" },
        success: { bg: colors.emerald, text: "#fff" },
        warning: { bg: colors.amber, text: "#fff" },
        danger: { bg: colors.rose, text: "#fff" },
        muted: { bg: colors.muted, text: "#fff" },
        gold: { bg: colors.gold, text: "#fff" },
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
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 40,
    },
    padDark: {},

    // ---------- Primary Button ----------
    primary: {
        backgroundColor: colors.indigo,
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: colors.indigo,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 4,
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
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        backgroundColor: colors.white,
        color: colors.text,
        minHeight: 52,
    },
    inputFocused: {
        borderColor: colors.indigo,
        backgroundColor: colors.white,
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
        borderColor: colors.indigo,
        backgroundColor: "#EEF2FF",
    },
    chipTxt: {
        fontWeight: "700",
        fontSize: 13,
        color: colors.text,
        textAlign: "center",
    },
    chipTxtOn: {
        color: colors.indigo,
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
        backgroundColor: colors.white,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
        marginBottom: 12,
    },
    cardDark: {
        backgroundColor: colors.navyDeep,
        borderColor: colors.muted,
    },
    cardElevated: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
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
    Card,
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