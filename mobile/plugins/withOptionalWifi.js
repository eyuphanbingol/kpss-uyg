// expo-network, ACCESS_WIFI_STATE izni ister; Android bu izinden "Wi-Fi donanımı zorunlu" sonucunu çıkarır
// ve Play, Wi-Fi'siz cihazlarda yüklemeyi engeller. Uygulama Wi-Fi'ye muhtaç değil: özelliği isteğe bağlı yap.
const { withAndroidManifest } = require("expo/config-plugins");

module.exports = function withOptionalWifi(config) {
    return withAndroidManifest(config, (cfg) => {
        const manifest = cfg.modResults.manifest;
        const list = manifest["uses-feature"] || (manifest["uses-feature"] = []);
        const wifi = list.find((f) => f.$ && f.$["android:name"] === "android.hardware.wifi");
        if (wifi) wifi.$["android:required"] = "false";
        else list.push({ $: { "android:name": "android.hardware.wifi", "android:required": "false" } });
        return cfg;
    });
};
