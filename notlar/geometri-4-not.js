// notlar/geometri-4-not.js - Açıortay ve Kenarortay
window.geometri_4_notlari = [

    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 font-black text-sm uppercase tracking-wider">
            📐 AÇIORTAY
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3"><li>İç açıortay teoremi: <b>b/n = c/m</b> (b,c komşu kenarlar; m,n taban parçaları).</li><li>Açıortay uzunluğu: <b>x² = b · c − m · n</b>.</li></ul><svg viewBox="0 0 320 220" class="geo-fig w-full max-w-[380px] mx-auto my-3" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="İç açıortay teoremi">
        <rect x="1" y="1" width="318" height="218" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <polygon points="120,30 36,160 290,160" fill="#e0f2fe" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
        <line x1="120" y1="30" x2="142.6" y2="160" stroke="#7c3aed" stroke-width="2" stroke-linecap="round"/>
        <circle cx="142.6" cy="160" r="3" fill="#0f172a"/>
        <path d="M 105.9 51.8 A 26 26 0 0 0 124.5 55.6" fill="none" stroke="#dc2626" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        <path d="M 125.3 60.5 A 31 31 0 0 0 144.6 48.8" fill="none" stroke="#dc2626" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        <text x="115.6" y="21.7" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">A</text>
        <text x="22.9" y="170.1" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">B</text>
        <text x="303.4" y="169.1" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">C</text>
        <text x="142.6" y="180.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">D</text>
        <text x="67.1" y="92.6" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">c</text>
        <text x="212.9" y="89.4" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">b</text>
        <text x="141.3" y="101.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#7c3aed">x</text>
        <text x="89.3" y="180.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">m</text>
        <text x="216.3" y="180.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">n</text>
        <text x="160" y="210.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#7c3aed">c/m = b/n,  x² = b·c − m·n</text>
    </svg>
    `,

    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-100 dark:bg-violet-900/50 text-violet-800 dark:text-violet-200 font-black text-sm uppercase tracking-wider">
            📏 KENARORTAY
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3"><li>Kenarortay uzunluğu: <b>2V_a² = b² + c² − a²/2</b>.</li><li>Dik üçgende: <b>5V_a² = V_b² + V_c²</b> (a hipotenüse karşı kenarortay).</li><li>Ağırlık merkezi G, kenarortayları 2:1 oranında böler.</li></ul><svg viewBox="0 0 320 220" class="geo-fig w-full max-w-[380px] mx-auto my-3" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Kenarortay ve ağırlık merkezi">
        <rect x="1" y="1" width="318" height="218" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <polygon points="126,30 40,160 282,160" fill="#e0f2fe" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
        <line x1="40" y1="160" x2="204" y2="95" stroke="#64748b" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="4 4"/>
        <line x1="282" y1="160" x2="83" y2="95" stroke="#64748b" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="4 4"/>
        <line x1="126" y1="30" x2="161" y2="160" stroke="#047857" stroke-width="2" stroke-linecap="round"/>
        <circle cx="161" cy="160" r="3" fill="#0f172a"/>
        <circle cx="149.3" cy="116.7" r="3" fill="#dc2626"/>
        <line x1="100.5" y1="166" x2="100.5" y2="154" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="221.5" y1="166" x2="221.5" y2="154" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
        <text x="122.4" y="21.5" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">A</text>
        <text x="27" y="170.2" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">B</text>
        <text x="295.3" y="169.4" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">C</text>
        <text x="161" y="180.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">D</text>
        <text x="161.3" y="115.3" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">G</text>
        <text x="123.2" y="76.3" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#047857">Vₐ</text>
        <text x="100.5" y="180.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">a/2</text>
        <text x="221.5" y="180.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">a/2</text>
        <text x="160" y="210.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">|AG| : |GD| = 2 : 1</text>
    </svg>
    `
];
