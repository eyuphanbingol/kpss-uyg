// Konu görünen adları (web: data.js KONU_LABELS ile aynı). Anahtarlar ilerleme kimliğidir, değişmez.
export var KONU_LABELS = {
    "19.YY Osmanlı Devleti Dağılma Dönemi": "19. Yüzyıl Osmanlı Devleti Dağılma Dönemi",
    "19.YY Osmanlı Devleti Islahatları": "19. Yüzyıl Osmanlı Devleti Islahatları",
    "20.YY Başlarında Osmanlı Devleti ": "20. Yüzyıl Başlarında Osmanlı Devleti",
    "Milli Mücadeler Hazırlık Dönemi": "Millî Mücadele Hazırlık Dönemi",
    "Milli Mücadeele Muharabeler Dönemi:": "Millî Mücadele Muharebeler Dönemi",
    "Milli Mücadele Diplomatik Dönem": "Millî Mücadele Diplomatik Dönem",
    "Türkiyenin Platoları": "Türkiye'nin Platoları",
    "Türkiyenin Ovaları": "Türkiye'nin Ovaları",
    "Rüzgar Şekilleri": "Rüzgâr Şekilleri",
    "Türkiyenin İklimi": "Türkiye'nin İklimi",
    "Türkiyenin Su Toprak ve Bitki Varlığı": "Türkiye'nin Su, Toprak ve Bitki Varlığı",
    "Türkiyede Çevre ve Doğal Afetler": "Türkiye'de Çevre ve Doğal Afetler",
    "Türkiyenin Beşeri Coğrafyası": "Türkiye'nin Beşerî Coğrafyası",
    "Türkiyede Yerleşim": "Türkiye'de Yerleşme",
    "Türkiyenini Ekonomik Coğrafyası (Ekonomi Politikaları)": "Ekonomik Coğrafya: Ekonomi Politikaları",
    "Türkiyenini Ekonomik Coğrafyası (TARIM-1)": "Ekonomik Coğrafya: Tarım 1",
    "Türkiyenini Ekonomik Coğrafyası (TARIM-2)": "Ekonomik Coğrafya: Tarım 2",
    "Türkiyenini Ekonomik Coğrafyası (HAYVANCILIK)": "Ekonomik Coğrafya: Hayvancılık",
    "Türkiyenini Ekonomik Coğrafyası (MADENLER)": "Ekonomik Coğrafya: Madenler",
    "Türkiyenini Ekonomik Coğrafyası (ENERJİ KAYNAKLARI)": "Ekonomik Coğrafya: Enerji Kaynakları",
    "Türkiyenini Ekonomik Coğrafyası (SANAYİ)": "Ekonomik Coğrafya: Sanayi",
    "Türkiyenini Ekonomik Coğrafyası (ULAŞIM)": "Ekonomik Coğrafya: Ulaşım"
};

export function konuLabel(konu) {
    var k = String(konu == null ? "" : konu);
    return KONU_LABELS[k] || k.trim();
}
