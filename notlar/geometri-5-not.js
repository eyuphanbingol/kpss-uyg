// notlar/geometri-5-not.js - Üçgende Alan
window.geometri_5_notlari = [

    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 font-black text-sm uppercase tracking-wider">
            📐 ALAN FORMÜLLERİ
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3"><li><b>A = a · h_a / 2</b> (herhangi bir kenar ve o kenara ait yükseklik).</li><li><b>A = (1/2) · b · c · sin α</b> (iki kenar ve aralarındaki açı).</li><li>Dik üçgende: <b>A = b · c / 2</b>.</li></ul><svg viewBox="0 0 320 210" class="geo-fig w-full max-w-[380px] mx-auto my-3" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Üçgende alan: taban × yükseklik / 2">
        <rect x="1" y="1" width="318" height="208" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <polygon points="120,30 40,156 280,156" fill="#e0f2fe" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
        <line x1="120" y1="30" x2="120" y2="156" stroke="#047857" stroke-width="2" stroke-linecap="round" stroke-dasharray="5 4"/>
        <path d="M 120 146 L 130 146 L 130 156" fill="none" stroke="#047857" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>
        <circle cx="120" cy="156" r="3" fill="#0f172a"/>
        <text x="115.8" y="21.7" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">A</text>
        <text x="27" y="166.2" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">B</text>
        <text x="293.4" y="165.2" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">C</text>
        <text x="132" y="97.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#047857">hₐ</text>
        <text x="200" y="176.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">a</text>
        <text x="160" y="202.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#047857">A = a · hₐ / 2</text>
    </svg>
    `,

    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-100 dark:bg-violet-900/50 text-violet-800 dark:text-violet-200 font-black text-sm uppercase tracking-wider">
            📏 HERON VE ÇEMBER
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3"><li>Heron: u = (a+b+c)/2, <b>A = √[u(u−a)(u−b)(u−c)]</b>.</li><li>İç teğet çember: <b>A = u · r</b> (r iç yarıçap).</li><li>Çevrel çember: <b>A = abc / (4R)</b> (R çevrel yarıçap). Dik üçgende R = hipotenüs/2.</li><li>Dış teğet yarıçap: <b>r_a = A / (u − a)</b>.</li></ul><svg viewBox="0 0 320 228" class="geo-fig w-full max-w-[380px] mx-auto my-3" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="İç teğet ve çevrel çember">
        <rect x="1" y="1" width="318" height="226" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <circle cx="160" cy="112" r="86" fill="none" stroke="#64748b" stroke-width="1.5" stroke-dasharray="5 4"/>
        <polygon points="139.2,28.6 84.1,152.4 235.9,152.4" fill="#e0f2fe" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
        <circle cx="149.2" cy="110.1" r="42.3" fill="none" stroke="#dc2626" stroke-width="1.8"/>
        <line x1="149.2" y1="110.1" x2="149.2" y2="152.4" stroke="#dc2626" stroke-width="1.6" stroke-linecap="round"/>
        <circle cx="149.2" cy="110.1" r="3" fill="#dc2626"/>
        <text x="157.2" y="135.9" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">r</text>
        <line x1="160" y1="112" x2="235.9" y2="152.4" stroke="#64748b" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="160" cy="112" r="3" fill="#64748b"/>
        <text x="200" y="126.9" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#64748b">R</text>
        <text x="137.2" y="21.8" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">A</text>
        <text x="73.8" y="163.6" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">B</text>
        <text x="246.7" y="162.8" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">C</text>
        <text x="160" y="218.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#334155">A = u · r,  A = a·b·c / (4R)</text>
    </svg>
    `
];
