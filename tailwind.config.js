// Web stilleri önceden derlenir (npm run build:css → css/tailwind.css). Eskiden tarayıcıda
// cdn.tailwindcss.com ile canlı üretiliyordu: Tailwind'e göre üretim için değil; sayfadaki her
// değişiklikte sınıfları yeniden tarar (telefonda test ve haritada sürekli işlemci yükü).
// content: sınıf adı geçen her yer. Ders notları ve sorular katalogdan gelir; onlar da taranır.
module.exports = Object.assign({
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        navy: {
                            50:  "#EEEDF7",
                            100: "#D6D3EC",
                            400: "#5F599F",
                            600: "#1E1B4B",
                            700: "#141232",
                            900: "#0A0919"
                        },
                        emerald: {
                            50:  "#E7F5F3",
                            100: "#C3E6E1",
                            500: "#0F766E",
                            600: "#0B5850"
                        },
                        amber: {
                            50:  "#FEF3E2",
                            100: "#FBE0B8",
                            500: "#D97706",
                            600: "#B45F04"
                        },
                        coral: {
                            50:  "#FCE8ED",
                            100: "#F8C4D1",
                            500: "#E11D48",
                            600: "#B0123A"
                        },
                        gold: {
                            100: "#F5EBC7",
                            400: "#DBC060",
                            500: "#C9A227",
                            700: "#8A6F1A"
                        },
                        stone: {
                            50:  "#FAFAF9",
                            100: "#F1F0EE",
                            300: "#D3D0CB",
                            500: "#78716C",
                            700: "#4A4642",
                            900: "#211F1D"
                        }
                    },
                    fontFamily: {
                        display: ["Manrope", "Inter", "sans-serif"],
                        sans: ["Inter", "sans-serif"],
                        stat: ["Space Grotesk", "Inter", "sans-serif"]
                    }
                }
            }
        }, {
    content: [
        "./index.html",
        "./js/**/*.{js,jsx}",
        "./notlar/**/*.js",
        "./sorular/**/*.js",
        "./data.js",
        "./catalog.json"
    ]
});
