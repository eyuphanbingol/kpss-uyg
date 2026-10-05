// notlar/geometri-9-not.js - Paralelkenar ve Özel Dörtgenler
window.geometri_9_notlari = [

    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 font-black text-sm uppercase tracking-wider">
            ▱ PARALELKENAR
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3"><li>Karşı kenarlar paralel ve eşit; karşı açılar eşit, komşu açılar bütünler (180°).</li><li>Köşegenler birbirini ortalar: <b>e² + f² = 2(a² + b²)</b>.</li><li>Alan: <b>A = a·h = a·b·sin α</b>.</li></ul><svg viewBox="0 0 320 196" class="geo-fig w-full max-w-[380px] mx-auto my-3" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Paralelkenar">
        <rect x="1" y="1" width="318" height="194" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <polygon points="40,148 220,148 280,48 100,48" fill="#e0f2fe" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
        <line x1="40" y1="148" x2="280" y2="48" stroke="#7c3aed" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="5 4"/>
        <line x1="220" y1="148" x2="100" y2="48" stroke="#7c3aed" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="5 4"/>
        <line x1="100" y1="48" x2="100" y2="148" stroke="#047857" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M 100 140 L 108 140 L 108 148" fill="none" stroke="#047857" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>
        <path d="M 62 148 A 22 22 0 0 0 51.3 129.1" fill="none" stroke="#dc2626" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        <text x="69.6" y="135.9" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">α</text>
        <text x="28" y="158" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">A</text>
        <text x="230" y="161.4" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">B</text>
        <text x="292" y="48" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">C</text>
        <text x="90" y="44.7" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">D</text>
        <text x="160" y="168.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">a</text>
        <text x="58.9" y="96" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">b</text>
        <text x="91" y="114.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#047857">h</text>
        <text x="212.8" y="70.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#7c3aed">e</text>
        <text x="194.4" y="118.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#7c3aed">f</text>
        <text x="160" y="188.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#334155">e² + f² = 2(a² + b²),  A = a·h</text>
    </svg>
    `,

    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-100 dark:bg-violet-900/50 text-violet-800 dark:text-violet-200 font-black text-sm uppercase tracking-wider">
            ◆ EŞKENAR DÖRTGEN VE DELTOİD
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3"><li>Eşkenar dörtgen: tüm kenarlar eşit; köşegenler dik ve açıortaydır.</li><li>Eşkenar dörtgen: <b>e² + f² = 4a²</b>, <b>A = (e·f)/2</b>.</li><li>Deltoid: <b>|AB|=|AD|</b>, <b>|CB|=|CD|</b>; köşegenler dik.</li><li>Deltoid alanı: <b>A = (d₁·d₂)/2</b>.</li></ul><svg viewBox="0 0 320 226" class="geo-fig w-full max-w-[380px] mx-auto my-3" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Eşkenar dörtgen">
        <rect x="1" y="1" width="318" height="224" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <polygon points="48,100 160,28 272,100 160,172" fill="#fef3c7" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
        <line x1="48" y1="100" x2="272" y2="100" stroke="#dc2626" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="160" y1="28" x2="160" y2="172" stroke="#dc2626" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M 169 100 L 169 91 L 160 91" fill="none" stroke="#dc2626" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>
        <line x1="107.2" y1="69" x2="100.8" y2="59" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="212.8" y1="69" x2="219.2" y2="59" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="212.8" y1="131" x2="219.2" y2="141" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="107.2" y1="131" x2="100.8" y2="141" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
        <text x="35" y="105" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">A</text>
        <text x="160" y="20" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">B</text>
        <text x="285" y="105" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">C</text>
        <text x="160" y="190" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">D</text>
        <text x="96.4" y="56.9" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">a</text>
        <text x="216" y="94.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">e</text>
        <text x="170" y="68.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">f</text>
        <text x="160" y="218.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#334155">e² + f² = 4a²,  A = e·f / 2</text>
    </svg><svg viewBox="0 0 320 244" class="geo-fig w-full max-w-[380px] mx-auto my-3" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Deltoid">
        <rect x="1" y="1" width="318" height="242" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <polygon points="160,24 78,76 160,196 242,76" fill="#e0f2fe" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
        <line x1="160" y1="24" x2="160" y2="196" stroke="#047857" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="5 4"/>
        <line x1="78" y1="76" x2="242" y2="76" stroke="#047857" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="5 4"/>
        <path d="M 169 76 L 169 85 L 160 85" fill="none" stroke="#047857" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>
        <line x1="115.8" y1="44.9" x2="122.2" y2="55.1" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="197.8" y1="55.1" x2="204.2" y2="44.9" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="125.1" y1="134.3" x2="115.2" y2="141" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="122.8" y1="131" x2="112.9" y2="137.7" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="204.8" y1="141" x2="194.9" y2="134.3" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="207.1" y1="137.7" x2="197.2" y2="131" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
        <text x="160" y="16" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">A</text>
        <text x="65.3" y="78.4" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">B</text>
        <text x="160" y="214" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">C</text>
        <text x="254.7" y="78.4" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">D</text>
        <text x="201" y="70.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#047857">d₁</text>
        <text x="172" y="140.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#047857">d₂</text>
        <text x="160" y="236.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#334155">A = d₁·d₂ / 2</text>
    </svg>
    `,

    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 font-black text-sm uppercase tracking-wider">
            ▭ DİKDÖRTGEN VE KARE
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3"><li>Dikdörtgen: tüm açılar 90°; köşegenler eşit ve birbirini ortalar. <b>A = a·b</b>.</li><li>Kare: tüm kenarlar eşit, tüm açılar 90°. <b>A = a²</b>.</li><li>Kare köşegenleri eşit, dik, açıortay ve birbirini ortalar.</li></ul>
    `
];
