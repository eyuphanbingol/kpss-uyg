// notlar/geometri-10-not.js - Çokgenler
window.geometri_10_notlari = [

    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 font-black text-sm uppercase tracking-wider">
            ⬡ ÇOKGEN ÖZELLİKLERİ
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3"><li>n kenarlı konveks çokgende iç açılar toplamı: <b>(n−2)·180°</b>.</li><li>Dış açılar toplamı her zaman <b>360°</b>.</li><li>Köşegen sayısı: <b>n(n−3)/2</b>.</li><li>Bir köşeden en çok <b>(n−3)</b> köşegen çizilir.</li></ul>
    `,

    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-100 dark:bg-violet-900/50 text-violet-800 dark:text-violet-200 font-black text-sm uppercase tracking-wider">
            ⬢ DÜZGÜN ÇOKGEN
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3"><li>Düzgün n-gen: her iç açı <b>((n−2)·180)/n</b>, her dış açı <b>360/n</b>.</li><li>Düzgün altıgen alanı: <b>(3√3/2)a² = 6·(a²√3/4)</b>; iç açı 120°, uzun köşegen 2a.</li><li>Düzgün altıgen 6 eşkenar üçgene ayrılır; kenar sayısı çift ise karşı kenarlar paraleldir.</li><li>Düzgün sekizgen: iç açı 135°, dış açı 45°; karşı kenarlar paralel, köşegenler açıortaydır.</li></ul><svg viewBox="0 0 320 220" class="geo-fig w-full max-w-[380px] mx-auto my-3" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Düzgün altıgen">
        <rect x="1" y="1" width="318" height="218" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <polygon points="242,104 201,175 119,175 78,104 119,33 201,33" fill="#e0f2fe" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
        <line x1="160" y1="104" x2="242" y2="104" stroke="#64748b" stroke-width="1.3" stroke-linecap="round" stroke-dasharray="4 4"/>
        <line x1="160" y1="104" x2="201" y2="175" stroke="#64748b" stroke-width="1.3" stroke-linecap="round" stroke-dasharray="4 4"/>
        <line x1="160" y1="104" x2="119" y2="175" stroke="#64748b" stroke-width="1.3" stroke-linecap="round" stroke-dasharray="4 4"/>
        <line x1="160" y1="104" x2="78" y2="104" stroke="#64748b" stroke-width="1.3" stroke-linecap="round" stroke-dasharray="4 4"/>
        <line x1="160" y1="104" x2="119" y2="33" stroke="#64748b" stroke-width="1.3" stroke-linecap="round" stroke-dasharray="4 4"/>
        <line x1="160" y1="104" x2="201" y2="33" stroke="#64748b" stroke-width="1.3" stroke-linecap="round" stroke-dasharray="4 4"/>
        <circle cx="160" cy="104" r="3" fill="#64748b"/>
        <line x1="216.3" y1="136.5" x2="226.7" y2="142.5" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="160" y1="169" x2="160" y2="181" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="103.7" y1="136.5" x2="93.3" y2="142.5" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="103.7" y1="71.5" x2="93.3" y2="65.5" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="160" y1="39" x2="160" y2="27" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="216.3" y1="71.5" x2="226.7" y2="65.5" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
        <text x="160" y="193.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">a</text>
        <text x="201" y="99.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#64748b">a</text>
        <path d="M 87 88.4 A 18 18 0 0 1 87 119.6" fill="none" stroke="#dc2626" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        <text x="114" y="90" text-anchor="middle" font-size="11" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">120°</text>
        <text x="160" y="212.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">A = 6 · a²√3/4 = (3√3/2)·a²</text>
    </svg>
    `
];
