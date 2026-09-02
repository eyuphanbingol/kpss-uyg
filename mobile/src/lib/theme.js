// src/content/lib/screens/ui.js
import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
    Platform,
    ScrollView,
    TextInput,
    SafeAreaView,
    Modal,
    FlatList,
    KeyboardAvoidingView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ============================================================
// RENKLER
// ============================================================

export var colors = {
    bg: "#FAFAF9",
    bgDark: "#211F1D",
    navy: "#0D2C4D",
    navyDeep: "#1E1B4B",
    teal: "#1D8A99",
    gold: "#C5A059",
    text: "#211F1D",
    muted: "#78716C",
    border: "#D3D0CB",
    white: "#FFFFFF",
    indigo: "#4F46E5",
    rose: "#E11D48",
    emerald: "#0F766E",
    amber: "#D97706",
    // Ek renkler
    purple: "#7C3AED",
    orange: "#F97316",
    stone: "#78716C",
    slate: "#0F172A",
};

// ============================================================
// DERS İKONLARI
// ============================================================

export var DERS_ICON = {
    "Tarih": "🏛️",
    "Coğrafya": "🗺️",
    "Türkçe": "✍️",
    "Vatandaşlık": "⚖️",
    "Güncel Bilgiler": "📰",
    "Matematik": "📐",
    "Fen": "🔬",
    "İngilizce": "🇬🇧",
};

// ============================================================
// YARDIMCI FONKSİYONLAR
// ============================================================

export function masteryLabel(m) {
    if (m === "iyi") return { text: "İyi", color: "#0F766E", emoji: "🌟" };
    if (m === "orta") return { text: "Orta", color: "#D97706", emoji: "📈" };
    if (m === "zayif") return { text: "Zayıf", color: "#E11D48", emoji: "📉" };
    return { text: "Yeni", color: "#78716C", emoji: "🆕" };
}

export function eduLabel(id) {
    if (id === "onlisans") return "Ön lisans";
    if (id === "ortaogretim") return "Ortaöğretim";
    return "Lisans";
}

export function examTrackName(level) {
    if (level === "onlisans") return "Ön lisans KPSS";
    if (level === "ortaogretim") return "Ortaöğretim KPSS";
    return "Lisans KPSS";
}

export function needsKulvar(level) {
    return !level || level === "lisans";
}

export function fmtExam(iso) {
    if (!iso) return "—";
    var p = String(iso).split("-");
    if (p.length === 3) return p[2] + "." + p[1] + "." + p[0];
    return iso;
}

export function stripHtml(html) {
    return String(html || "")
        .replace(/<style[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/\s+/g, " ")
        .trim();
}

// ============================================================
// YARDIMCI: TARİH FORMATLAMA
// ============================================================

export function formatDate(iso) {
    if (!iso) return "—";
    try {
        var d = new Date(iso);
        if (isNaN(d.getTime())) return "—";
        return d.toLocaleDateString("tr-TR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    } catch (e) { return "—"; }
}

export function formatTime(iso) {
    if (!iso) return "—";
    try {
        var d = new Date(iso);
        if (isNaN(d.getTime())) return "—";
        return d.toLocaleTimeString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch (e) { return "—"; }
}

export function formatDateTime(iso) {
    if (!iso) return "—";
    try {
        var d = new Date(iso);
        if (isNaN(d.getTime())) return "—";
        return d.toLocaleDateString("tr-TR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch (e) { return "—"; }
}

export function timeAgo(iso) {
    if (!iso) return "—";
    try {
        var d = new Date(iso);
        if (isNaN(d.getTime())) return "—";
        var diff = Date.now() - d.getTime();
        var minutes = Math.floor(diff / 60000);
        if (minutes < 1) return "Az önce";
        if (minutes < 60) return minutes + " dk önce";
        var hours = Math.floor(minutes / 60);
        if (hours < 24) return hours + " sa önce";
        var days = Math.floor(hours / 24);
        if (days < 7) return days + " gün önce";
        return formatDate(iso);
    } catch (e) { return "—"; }
}

// ============================================================
// YARDIMCI: RENK FONKSİYONLARI
// ============================================================

export function getScoreColor(score) {
    if (score >= 80) return colors.emerald;
    if (score >= 60) return colors.indigo;
    if (score >= 40) return colors.amber;
    return colors.rose;
}

export function getScoreLabel(score) {
    if (score >= 80) return { text: "Mükemmel", emoji: "🌟", color: colors.emerald };
    if (score >= 60) return { text: "İyi", emoji: "✅", color: colors.indigo };
    if (score >= 40) return { text: "Orta", emoji: "📈", color: colors.amber };
    return { text: "Gelişmeli", emoji: "📉", color: colors.rose };
}

export function getStatusBadge(lastStudyAt) {
    if (!lastStudyAt) return { label: "Hiç çalışmamış", color: colors.muted };
    var diff = (Date.now() - new Date(lastStudyAt).getTime()) / (1000 * 60 * 60 * 24);
    if (diff < 1) return { label: "🟢 Bugün aktif", color: colors.emerald };
    if (diff < 3) return { label: "🟡 3 gün içinde", color: colors.amber };
    if (diff < 7) return { label: "🟠 7 gün içinde", color: colors.orange };
    return { label: "🔴 7+ gün pasif", color: colors.rose };
}

// ============================================================
// MOBİL BİLEŞENLER
// ============================================================

const { width, height } = Dimensions.get("window");

// ---------- Safe Area Container ----------
export function Container({ 
    children, 
    style, 
    edges = ["top", "bottom"],
    scrollable = false,
    keyboardAvoid = false,
    backgroundColor = colors.bg,
}) {
    const insets = useSafeAreaInsets();

    var paddingStyles = {
        paddingTop: edges.includes("top") ? insets.top : 0,
        paddingBottom: edges.includes("bottom") ? insets.bottom : 0,
    };

    var content = (
        <View style={[{ flex: 1, backgroundColor: backgroundColor }, paddingStyles, style]}>
            {children}
        </View>
    );

    if (scrollable) {
        content = (
            <ScrollView 
                style={[{ flex: 1, backgroundColor: backgroundColor }, paddingStyles]}
                contentContainerStyle={style}
                showsVerticalScrollIndicator={false}
                bounces={true}
            >
                {children}
            </ScrollView>
        );
    }

    if (keyboardAvoid) {
        content = (
            <KeyboardAvoidingView 
                style={[{ flex: 1, backgroundColor: backgroundColor }, paddingStyles]}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
            >
                {children}
            </KeyboardAvoidingView>
        );
    }

    return content;
}

// ---------- Card ----------
export function Card({ 
    children, 
    style, 
    onPress, 
    variant = "default",
    padding = true,
}) {
    var variantStyles = {
        default: {
            backgroundColor: colors.white,
            borderColor: colors.border,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.04,
            shadowRadius: 2,
            elevation: 1,
        },
        elevated: {
            backgroundColor: colors.white,
            borderColor: colors.border,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 2,
        },
        glass: {
            backgroundColor: "rgba(255,255,255,0.7)",
            borderColor: "rgba(255,255,255,0.3)",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 2,
        },
        gradient: {
            backgroundColor: colors.indigo,
            borderColor: "transparent",
            shadowColor: colors.indigo,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 4,
        },
    };

    var paddingStyle = padding ? { padding: 16 } : {};

    var CardComponent = onPress ? TouchableOpacity : View;

    return (
        <CardComponent
            style={[
                {
                    borderRadius: 16,
                    borderWidth: 1,
                    ...variantStyles[variant],
                    ...paddingStyle,
                },
                style,
                onPress && { activeOpacity: 0.8 },
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {children}
        </CardComponent>
    );
}

// ---------- Button ----------
export function Button({ 
    children, 
    onPress, 
    variant = "primary", 
    size = "medium",
    loading = false,
    disabled = false,
    style,
    textStyle,
    fullWidth = false,
    ...props 
}) {
    var variantStyles = {
        primary: {
            backgroundColor: colors.indigo,
            shadowColor: colors.indigo,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 4,
        },
        secondary: {
            backgroundColor: colors.bg,
            borderWidth: 1,
            borderColor: colors.border,
        },
        outline: {
            backgroundColor: "transparent",
            borderWidth: 2,
            borderColor: colors.indigo,
        },
        danger: {
            backgroundColor: colors.rose,
            shadowColor: colors.rose,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 4,
        },
        success: {
            backgroundColor: colors.emerald,
            shadowColor: colors.emerald,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 4,
        },
        ghost: {
            backgroundColor: "transparent",
        },
        gold: {
            backgroundColor: colors.gold,
            shadowColor: colors.gold,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 4,
        },
    };

    var sizeStyles = {
        small: {
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 10,
        },
        medium: {
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 12,
        },
        large: {
            paddingVertical: 16,
            paddingHorizontal: 32,
            borderRadius: 14,
        },
    };

    var textColors = {
        primary: colors.white,
        secondary: colors.text,
        outline: colors.indigo,
        danger: colors.white,
        success: colors.white,
        ghost: colors.indigo,
        gold: colors.white,
    };

    var textSizes = {
        small: 13,
        medium: 15,
        large: 17,
    };

    var isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            style={[
                {
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    gap: 8,
                    ...variantStyles[variant],
                    ...sizeStyles[size],
                    opacity: isDisabled ? 0.5 : 1,
                },
                fullWidth && { width: "100%" },
                style,
            ]}
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.7}
            {...props}
        >
            {loading ? (
                <ActivityIndicator size="small" color={textColors[variant] || colors.white} />
            ) : (
                <Text
                    style={[
                        {
                            color: textColors[variant] || colors.white,
                            fontSize: textSizes[size] || 15,
                            fontWeight: "600",
                            textAlign: "center",
                        },
                        textStyle,
                    ]}
                >
                    {children}
                </Text>
            )}
        </TouchableOpacity>
    );
}

// ---------- Input ----------
export function Input({ 
    label, 
    error, 
    style, 
    containerStyle, 
    labelStyle,
    errorStyle,
    secureTextEntry,
    ...props 
}) {
    var [secure, setSecure] = React.useState(secureTextEntry || false);
    var [focused, setFocused] = React.useState(false);

    return (
        <View style={[{ marginBottom: 12 }, containerStyle]}>
            {label && (
                <Text style={[{ fontSize: 14, fontWeight: "500", color: colors.text, marginBottom: 6 }, labelStyle]}>
                    {label}
                </Text>
            )}
            <View style={{ position: "relative" }}>
                <TextInput
                    style={[
                        {
                            height: 48,
                            borderWidth: 1,
                            borderColor: error ? colors.rose : focused ? colors.indigo : colors.border,
                            borderRadius: 12,
                            paddingHorizontal: 16,
                            fontSize: 16,
                            color: colors.text,
                            backgroundColor: colors.white,
                        },
                        style,
                    ]}
                    placeholderTextColor={colors.muted}
                    secureTextEntry={secure}
                    onFocus={function () { setFocused(true); }}
                    onBlur={function () { setFocused(false); }}
                    {...props}
                />
                {secureTextEntry && (
                    <TouchableOpacity
                        style={{
                            position: "absolute",
                            right: 12,
                            top: "50%",
                            transform: [{ translateY: -12 }],
                        }}
                        onPress={function () { setSecure(!secure); }}
                    >
                        <Text style={{ fontSize: 18 }}>{secure ? "👁️" : "👁️‍🗨️"}</Text>
                    </TouchableOpacity>
                )}
            </View>
            {error && (
                <Text style={[{ fontSize: 12, color: colors.rose, marginTop: 4 }, errorStyle]}>
                    {error}
                </Text>
            )}
        </View>
    );
}

// ---------- Header ----------
export function Header({ 
    title, 
    onBack, 
    rightAction, 
    style,
    titleStyle,
    showBack = true,
    icon,
}) {
    var insets = useSafeAreaInsets();

    return (
        <View
            style={[
                {
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 16,
                    paddingTop: insets.top + 12,
                    paddingBottom: 12,
                    backgroundColor: colors.white,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                },
                style,
            ]}
        >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1 }}>
                {showBack && onBack && (
                    <TouchableOpacity
                        onPress={onBack}
                        style={{ padding: 4 }}
                        activeOpacity={0.7}
                    >
                        <Text style={{ fontSize: 20 }}>←</Text>
                    </TouchableOpacity>
                )}
                {icon && <Text style={{ fontSize: 20 }}>{icon}</Text>}
                <Text
                    style={[
                        {
                            fontSize: 18,
                            fontWeight: "700",
                            color: colors.text,
                            flex: 1,
                        },
                        titleStyle,
                    ]}
                    numberOfLines={1}
                >
                    {title}
                </Text>
            </View>
            {rightAction && rightAction}
        </View>
    );
}

// ---------- Bottom Sheet ----------
export function BottomSheet({ 
    visible, 
    onClose, 
    children, 
    height = "auto",
    style,
}) {
    var insets = useSafeAreaInsets();

    if (!visible) return null;

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View
                style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.4)",
                    justifyContent: "flex-end",
                }}
            >
                <TouchableOpacity
                    style={{ flex: 1 }}
                    activeOpacity={1}
                    onPress={onClose}
                />
                <View
                    style={[
                        {
                            backgroundColor: colors.white,
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            paddingHorizontal: 16,
                            paddingBottom: insets.bottom + 16,
                            maxHeight: height === "auto" ? "80%" : height,
                            ...(height !== "auto" && { height: height }),
                        },
                        style,
                    ]}
                >
                    <View
                        style={{
                            alignSelf: "center",
                            width: 40,
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: colors.border,
                            marginTop: 8,
                            marginBottom: 16,
                        }}
                    />
                    {children}
                </View>
            </View>
        </Modal>
    );
}

// ---------- Badge ----------
export function Badge({ 
    text, 
    color = colors.indigo, 
    variant = "filled",
    style,
}) {
    var variantStyles = {
        filled: {
            backgroundColor: color,
            color: colors.white,
        },
        outline: {
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: color,
            color: color,
        },
        muted: {
            backgroundColor: colors.bg,
            color: colors.muted,
        },
    };

    return (
        <View
            style={[
                {
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 12,
                    alignSelf: "flex-start",
                    ...variantStyles[variant],
                },
                style,
            ]}
        >
            <Text
                style={{
                    fontSize: 10,
                    fontWeight: "600",
                    color: variantStyles[variant].color || colors.white,
                }}
            >
                {text}
            </Text>
        </View>
    );
}

// ---------- Loading Spinner ----------
export function Spinner({ size = "large", color = colors.indigo, style }) {
    return (
        <View style={[{ flex: 1, justifyContent: "center", alignItems: "center" }, style]}>
            <ActivityIndicator size={size} color={color} />
        </View>
    );
}

// ---------- Empty State ----------
export function EmptyState({ 
    icon = "📭", 
    title = "Henüz veri yok", 
    description = "Çalışmaya başlayınca burada görünecek",
    actionText,
    onAction,
}) {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 32,
            }}
        >
            <Text style={{ fontSize: 48, marginBottom: 16 }}>{icon}</Text>
            <Text
                style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: colors.text,
                    textAlign: "center",
                    marginBottom: 8,
                }}
            >
                {title}
            </Text>
            <Text
                style={{
                    fontSize: 14,
                    color: colors.muted,
                    textAlign: "center",
                    marginBottom: actionText ? 16 : 0,
                }}
            >
                {description}
            </Text>
            {actionText && onAction && (
                <Button variant="primary" size="small" onPress={onAction}>
                    {actionText}
                </Button>
            )}
        </View>
    );
}

// ---------- Divider ----------
export function Divider({ style, color = colors.border, thickness = 1 }) {
    return (
        <View
            style={[
                {
                    height: thickness,
                    backgroundColor: color,
                    marginVertical: 8,
                },
                style,
            ]}
        />
    );
}

// ---------- Progress Bar ----------
export function ProgressBar({ 
    progress, 
    color = colors.indigo, 
    height = 4, 
    style,
    showLabel = false,
    label,
}) {
    var clamped = Math.min(100, Math.max(0, progress));

    return (
        <View style={[{ width: "100%" }, style]}>
            <View
                style={{
                    height: height,
                    borderRadius: height / 2,
                    backgroundColor: colors.border,
                    overflow: "hidden",
                }}
            >
                <View
                    style={{
                        height: "100%",
                        width: clamped + "%",
                        borderRadius: height / 2,
                        backgroundColor: color,
                    }}
                />
            </View>
            {showLabel && (
                <Text
                    style={{
                        fontSize: 12,
                        color: colors.muted,
                        marginTop: 4,
                        textAlign: "right",
                    }}
                >
                    {label || clamped + "%"}
                </Text>
            )}
        </View>
    );
}

// ---------- Select ----------
export function Select({ 
    value, 
    options, 
    onChange, 
    placeholder = "Seçiniz",
    style,
    label,
}) {
    var [open, setOpen] = React.useState(false);

    var selected = options.find(function (opt) { return opt.value === value; });

    return (
        <View style={{ marginBottom: 12 }}>
            {label && (
                <Text style={{ fontSize: 14, fontWeight: "500", color: colors.text, marginBottom: 6 }}>
                    {label}
                </Text>
            )}
            <TouchableOpacity
                style={[
                    {
                        height: 48,
                        borderWidth: 1,
                        borderColor: colors.border,
                        borderRadius: 12,
                        paddingHorizontal: 16,
                        justifyContent: "center",
                        backgroundColor: colors.white,
                    },
                    style,
                ]}
                onPress={function () { setOpen(true); }}
                activeOpacity={0.7}
            >
                <Text style={{ color: selected ? colors.text : colors.muted }}>
                    {selected ? selected.label : placeholder}
                </Text>
            </TouchableOpacity>

            <BottomSheet visible={open} onClose={function () { setOpen(false); }}>
                <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text, marginBottom: 12 }}>
                    {label || "Seçiniz"}
                </Text>
                {options.map(function (opt) {
                    var isSelected = opt.value === value;
                    return (
                        <TouchableOpacity
                            key={opt.value}
                            style={{
                                paddingVertical: 12,
                                paddingHorizontal: 8,
                                borderBottomWidth: 1,
                                borderBottomColor: colors.border,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                            onPress={function () {
                                onChange(opt.value);
                                setOpen(false);
                            }}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={{
                                    fontSize: 15,
                                    color: isSelected ? colors.indigo : colors.text,
                                    fontWeight: isSelected ? "600" : "400",
                                }}
                            >
                                {opt.label}
                            </Text>
                            {isSelected && (
                                <Text style={{ color: colors.indigo, fontSize: 16 }}>✓</Text>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </BottomSheet>
        </View>
    );
}

// ---------- Toggle ----------
export function Toggle({ 
    value, 
    onToggle, 
    disabled = false,
    style,
}) {
    return (
        <TouchableOpacity
            style={[
                {
                    width: 44,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: value ? colors.indigo : colors.border,
                    justifyContent: "center",
                    padding: 2,
                    opacity: disabled ? 0.5 : 1,
                },
                style,
            ]}
            onPress={function () { if (!disabled) onToggle(!value); }}
            activeOpacity={0.8}
            disabled={disabled}
        >
            <View
                style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: colors.white,
                    transform: [{ translateX: value ? 20 : 0 }],
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.15,
                    shadowRadius: 2,
                    elevation: 2,
                }}
            />
        </TouchableOpacity>
    );
}

// ---------- Section ----------
export function Section({ 
    title, 
    children, 
    style, 
    titleStyle,
    rightAction,
    onRightAction,
}) {
    return (
        <View style={[{ marginBottom: 16 }, style]}>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 8,
                }}
            >
                <Text
                    style={[
                        {
                            fontSize: 16,
                            fontWeight: "700",
                            color: colors.text,
                        },
                        titleStyle,
                    ]}
                >
                    {title}
                </Text>
                {rightAction && (
                    <TouchableOpacity onPress={onRightAction} activeOpacity={0.7}>
                        <Text style={{ fontSize: 13, color: colors.indigo, fontWeight: "500" }}>
                            {rightAction}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
            {children}
        </View>
    );
}

// ---------- List Item ----------
export function ListItem({ 
    title, 
    subtitle, 
    leftIcon, 
    rightIcon, 
    onPress,
    style,
    titleStyle,
    subtitleStyle,
    disabled = false,
}) {
    return (
        <TouchableOpacity
            style={[
                {
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 12,
                    paddingHorizontal: 8,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                    opacity: disabled ? 0.5 : 1,
                },
                style,
            ]}
            onPress={onPress}
            disabled={disabled || !onPress}
            activeOpacity={0.7}
        >
            {leftIcon && <View style={{ marginRight: 12 }}>{leftIcon}</View>}
            <View style={{ flex: 1 }}>
                <Text
                    style={[
                        {
                            fontSize: 15,
                            fontWeight: "500",
                            color: colors.text,
                        },
                        titleStyle,
                    ]}
                    numberOfLines={1}
                >
                    {title}
                </Text>
                {subtitle && (
                    <Text
                        style={[
                            {
                                fontSize: 13,
                                color: colors.muted,
                                marginTop: 2,
                            },
                            subtitleStyle,
                        ]}
                        numberOfLines={1}
                    >
                        {subtitle}
                    </Text>
                )}
            </View>
            {rightIcon && <View style={{ marginLeft: 8 }}>{rightIcon}</View>}
        </TouchableOpacity>
    );
}

// ---------- Chip ----------
export function Chip({ 
    label, 
    selected = false, 
    onPress, 
    style,
    textStyle,
    color = colors.indigo,
}) {
    return (
        <TouchableOpacity
            style={[
                {
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: selected ? color : colors.border,
                    backgroundColor: selected ? color : "transparent",
                    alignSelf: "flex-start",
                },
                style,
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text
                style={[
                    {
                        fontSize: 13,
                        fontWeight: selected ? "600" : "400",
                        color: selected ? colors.white : colors.text,
                    },
                    textStyle,
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
}

// ---------- Toast ----------
export function Toast({ 
    visible, 
    message, 
    type = "info", 
    onClose, 
    duration = 3000,
}) {
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

    React.useEffect(function () {
        if (visible && duration > 0) {
            var timer = setTimeout(function () {
                if (onClose) onClose();
            }, duration);
            return function () { clearTimeout(timer); };
        }
    }, [visible, duration]);

    if (!visible) return null;

    return (
        <View
            style={{
                position: "absolute",
                bottom: 20,
                left: 16,
                right: 16,
                zIndex: 1000,
                backgroundColor: typeColors[type] || colors.indigo,
                borderRadius: 12,
                padding: 16,
                flexDirection: "row",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 4,
            }}
        >
            <Text style={{ fontSize: 18, marginRight: 8 }}>{typeIcons[type] || "ℹ️"}</Text>
            <Text style={{ flex: 1, color: colors.white, fontSize: 14, fontWeight: "500" }}>
                {message}
            </Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                <Text style={{ color: colors.white, fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
        </View>
    );
}

// ============================================================
// EXPORT DEFAULT
// ============================================================

export default {
    colors,
    DERS_ICON,
    masteryLabel,
    eduLabel,
    examTrackName,
    needsKulvar,
    fmtExam,
    stripHtml,
    formatDate,
    formatTime,
    formatDateTime,
    timeAgo,
    getScoreColor,
    getScoreLabel,
    getStatusBadge,
    Container,
    Card,
    Button,
    Input,
    Header,
    BottomSheet,
    Badge,
    Spinner,
    EmptyState,
    Divider,
    ProgressBar,
    Select,
    Toggle,
    Section,
    ListItem,
    Chip,
    Toast,
};