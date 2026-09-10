import { registerRootComponent } from "expo";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import * as NativeSplash from "expo-splash-screen";

function showErr(e) {
    return String((e && (e.stack || e.message)) || e);
}

class Guard extends React.Component {
    constructor(props) {
        super(props);
        this.state = { err: null };
    }
    static getDerivedStateFromError(err) {
        return { err: err };
    }
    render() {
        if (!this.state.err) return this.props.children;
        return (
            <ScrollView style={{ flex: 1, backgroundColor: "#1c1917", padding: 22, paddingTop: 56 }}>
                <Text style={{ color: "#fecaca", fontWeight: "800", fontSize: 20 }}>Atanly çöktü</Text>
                <Text selectable style={{ color: "#fff", marginTop: 12, fontSize: 13, lineHeight: 20 }}>
                    {showErr(this.state.err)}
                </Text>
                <Text style={{ color: "#a8a29e", marginTop: 16 }}>Bu yazının ekranını at.</Text>
            </ScrollView>
        );
    }
}

function Boot() {
    var _a = useState(null);
    var App = _a[0];
    var setApp = _a[1];
    var _e = useState("");
    var err = _e[0];
    var setErr = _e[1];

    useEffect(function () {
        NativeSplash.hideAsync().catch(function () {});
        var EU = global.ErrorUtils;
        if (EU && EU.setGlobalHandler) {
            EU.setGlobalHandler(function (error) {
                setErr(showErr(error));
            });
        }
        try {
            var mod = require("./App");
            setApp(function () { return mod.default; });
        } catch (e) {
            setErr(showErr(e));
        }
    }, []);

    if (err) {
        return (
            <ScrollView style={{ flex: 1, backgroundColor: "#1c1917", padding: 22, paddingTop: 56 }}>
                <Text style={{ color: "#fecaca", fontWeight: "800", fontSize: 20 }}>Açılış hatası</Text>
                <Text selectable style={{ color: "#fff", marginTop: 12, fontSize: 13, lineHeight: 20 }}>{err}</Text>
                <Text style={{ color: "#a8a29e", marginTop: 16 }}>Bu yazının ekranını at, düzeltelim.</Text>
            </ScrollView>
        );
    }
    if (!App) {
        return (
            <View style={{ flex: 1, backgroundColor: "#041C24", justifyContent: "center", alignItems: "center", padding: 24 }}>
                <Text style={{ color: "#F5EBC7", fontSize: 22, fontWeight: "800" }}>Atanly</Text>
                <Text style={{ color: "rgba(255,255,255,0.7)", marginTop: 8 }}>Açılıyor…</Text>
            </View>
        );
    }
    return (
        <Guard>
            <App />
        </Guard>
    );
}

registerRootComponent(Boot);
