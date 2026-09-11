// notlar/muhasebe-3-not.js - Duran Varlıklar
window.muhasebe_3_notlari = [
    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-900/50 text-stone-800 dark:text-stone-200 font-black text-sm uppercase tracking-wider">
            GRUPLAR
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3">
        <li>Maddi: arazi, bina, tesis-makine, taşıt, demirbaş, yapılmakta olan yatırımlar.</li>
<li>Maddi olmayan: haklar, şerefiye, özel maliyet, araştırma-geliştirme (koşullu aktifleştirme).</li>
<li>Mali duran: iştirak, bağlı ortaklık, uzun vadeli menkul.</li>
<li>Arazi kural olarak amortismana tabi değildir; bina tabidir.</li>
<li>Özel maliyet kiralayanın yaptığı duran varlık niteliği, kira süresinde itfa.</li>

    </ul>
    
    `,
    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 font-black text-sm uppercase tracking-wider">
            AMORTİSMAN
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3">
        <li><b>Normal (doğrusal)</b>: (maliyet − hurda) / ömür.</li>
<li><b>Azalan bakiyeler</b>: yüksek oran, kalan değer üzerinden; VUK'ta normalin iki katı, hurda yok varsayımı.</li>
<li><b>Kıst amortisman</b> taşıtlarda alış/satış yılı gün esası (VUK özel).</li>
<li>Kayıt: 257 birikmiş amortisman (düzenleyici) / 730 veya 770/632 gider.</li>
<li>Yeniden değerleme VUK enflasyon dönemlerinde; TFRS yeniden değerleme modeli ayrı.</li>

    </ul>
    <div class="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 mt-3"><p class="text-[11px] leading-relaxed text-amber-900 dark:text-amber-200">⚠️ <b>Sınav:</b> Arazi amortisman ayrılmaz; taşıtta kıst, demirbaşta kıst kuralı VUK'ta taşıt içindir. ÖSYM kıstı her kıymete yayarak çeldirir.</p></div>
    `,
    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 font-black text-sm uppercase tracking-wider">
            ELİNDEN ÇIKARMA
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3">
        <li>Satışta birikmiş amortisman kapatılır, net defter değeri ile satış bedeli farkı gelir/gider.</li>
<li>Değer artış fonu özkaynakta (yeniden değerleme).</li>
<li>Şerefiye iktisapta ödenen fazla; itfa TFRS'de test, VUK'ta süre.</li>
<li>Yapılmakta olan yatırımlar tamamlanınca ilgili maddi hesaba.</li>
<li>Finansal kiralama hakkı maddi duran gibi (TFRS 16 / VUK farkı).</li>

    </ul>
    <div class="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 mt-3"><p class="text-[11px] leading-relaxed text-amber-900 dark:text-amber-200">⚠️ <b>Sınav:</b> Birikmiş amortisman pasif düzenleyici değil aktif düzenleyicidir (alacaklı bakiyeli kontra varlık).</p></div>
    `
];
