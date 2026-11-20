// app.json'u olduğu gibi kullanır; yalnız Android bildirimleri için Firebase dosyasını bağlar.
// google-services.json gizli değildir ama depoya konmaz: expo.dev → Environment variables'a
// GOOGLE_SERVICES_JSON adıyla "file" olarak yüklenir (EAS derlemede dosya yolunu verir).
// Yerelde mobile/google-services.json (git'e girmez) yalnız yerel derleme içindir. Dosya yoksa uygulama bildirimsiz derlenir.
const fs = require("fs");
const path = require("path");

module.exports = ({ config }) => {
    const local = path.join(__dirname, "google-services.json");
    const file = process.env.GOOGLE_SERVICES_JSON || (fs.existsSync(local) ? "./google-services.json" : null);
    if (file) config.android = { ...config.android, googleServicesFile: file };
    return config;
};
