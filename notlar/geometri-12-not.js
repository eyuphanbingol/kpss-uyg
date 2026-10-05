// notlar/geometri-12-not.js - Katı Cisimler
window.geometri_12_notlari = [

    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 font-black text-sm uppercase tracking-wider">
            📦 PRİZMALAR VE KÜP
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3"><li>Prizma: <b>V = taban alanı · h</b>, yanal alan = <b>taban çevresi · h</b>.</li><li>Dikdörtgenler prizması: <b>V = abc</b>, köşegen <b>√(a²+b²+c²)</b>.</li><li>Küp: yüz köşegeni <b>a√2</b>, cisim köşegeni <b>a√3</b>, <b>A = 6a²</b>, <b>V = a³</b>.</li></ul><svg viewBox="0 0 320 230" class="geo-fig w-full max-w-[380px] mx-auto my-3" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Dikdörtgenler prizması">
        <rect x="1" y="1" width="318" height="228" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <line x1="52" y1="178" x2="101" y2="143" stroke="#64748b" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="5 4"/>
        <line x1="101" y1="143" x2="251" y2="143" stroke="#64748b" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="5 4"/>
        <line x1="101" y1="143" x2="101" y2="47" stroke="#64748b" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="5 4"/>
        <polygon points="52,178 202,178 202,82 52,82" fill="#e0f2fe" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
        <polygon points="52,82 202,82 251,47 101,47" fill="#bae6fd" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
        <polygon points="202,178 251,143 251,47 202,82" fill="#c7e9fb" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
        <line x1="52" y1="178" x2="251" y2="47" stroke="#dc2626" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="6 4"/>
        <text x="127" y="198.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">a</text>
        <text x="236.5" y="171.2" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">b</text>
        <text x="40" y="134.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">c</text>
        <text x="160" y="220.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#334155">V = a·b·c,  köşegen = √(a² + b² + c²)</text>
    </svg>
    `,

    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-100 dark:bg-violet-900/50 text-violet-800 dark:text-violet-200 font-black text-sm uppercase tracking-wider">
            🛢 SİLİNDİR, KONİ, PİRAMİT
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3"><li>Silindir: yanal <b>2πrh</b>, toplam <b>2πr(h+r)</b>, <b>V = πr²h</b>.</li><li>Piramit: <b>V = (1/3)·taban·h</b>.</li><li>Koni: alan <b>πrℓ + πr²</b>, <b>V = (1/3)πr²h</b>.</li></ul><svg viewBox="0 0 320 220" class="geo-fig w-full max-w-[380px] mx-auto my-3" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Silindir ve koni">
        <rect x="1" y="1" width="318" height="218" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <path d="M 42 46 L 42 166 A 50 14 0 0 0 142 166 L 142 46" fill="#e0f2fe" stroke="#0f172a" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
        <path d="M 42 166 A 50 14 0 0 1 142 166" fill="none" stroke="#64748b" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="4 4"/>
        <ellipse cx="92" cy="46" rx="50" ry="14" fill="#bae6fd" stroke="#0f172a" stroke-width="2"/>
        <line x1="92" y1="46" x2="142" y2="46" stroke="#dc2626" stroke-width="1.6" stroke-linecap="round"/>
        <circle cx="92" cy="46" r="2.4" fill="#0f172a"/>
        <text x="117" y="58.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">r</text>
        <line x1="154" y1="46" x2="154" y2="166" stroke="#047857" stroke-width="1.4" stroke-linecap="round"/>
        <text x="164" y="110.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#047857">h</text>
        <text x="92" y="202.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#334155">V = πr²h</text>
        <path d="M 182 166 L 232 40 L 282 166 A 50 14 0 0 1 182 166 Z" fill="#fef3c7" stroke="#0f172a" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
        <path d="M 182 166 A 50 14 0 0 1 282 166" fill="none" stroke="#64748b" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="4 4"/>
        <line x1="232" y1="40" x2="232" y2="166" stroke="#047857" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="4 3"/>
        <line x1="232" y1="166" x2="282" y2="166" stroke="#dc2626" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M 232 159 L 239 159 L 239 166" fill="none" stroke="#047857" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>
        <text x="223" y="116.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#047857">h</text>
        <text x="257" y="162.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">r</text>
        <text x="266" y="100.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#7c3aed">ℓ</text>
        <text x="232" y="202.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#334155">V = πr²h / 3</text>
    </svg>
    `,

    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 font-black text-sm uppercase tracking-wider">
            🔺 DÖRTYÜZLÜ VE KÜRE
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3"><li>Düzgün dörtyüzlü: <b>h = a√6/3</b>, <b>A = a²√3</b>, <b>V = a³√2/12</b>.</li><li>Küre: <b>A = 4πr²</b>, <b>V = (4/3)πr³</b>.</li></ul><svg viewBox="0 0 320 214" class="geo-fig w-full max-w-[380px] mx-auto my-3" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Küre ve düzgün dörtyüzlü">
        <rect x="1" y="1" width="318" height="212" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <circle cx="92" cy="98" r="60" fill="#e0f2fe" stroke="#0f172a" stroke-width="2"/>
        <path d="M 32 98 A 60 16 0 0 0 152 98" fill="none" stroke="#0f172a" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"/>
        <path d="M 32 98 A 60 16 0 0 1 152 98" fill="none" stroke="#64748b" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="4 4"/>
        <line x1="92" y1="98" x2="152" y2="98" stroke="#dc2626" stroke-width="1.6" stroke-linecap="round"/>
        <circle cx="92" cy="98" r="2.6" fill="#0f172a"/>
        <text x="122" y="93.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">r</text>
        <text x="92" y="190.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#334155">A = 4πr²</text>
        <text x="92" y="206.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#334155">V = (4/3)πr³</text>
        <polygon points="182,150 284,150 232,34" fill="#fef3c7" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
        <line x1="182" y1="150" x2="246" y2="126" stroke="#64748b" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="4 4"/>
        <line x1="284" y1="150" x2="246" y2="126" stroke="#64748b" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="4 4"/>
        <line x1="232" y1="34" x2="246" y2="126" stroke="#64748b" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="4 4"/>
        <polygon points="182,150 284,150 232,34" fill="none" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
        <text x="233" y="170.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">a</text>
        <text x="232" y="190.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#334155">V = a³√2 / 12</text>
        <text x="232" y="206.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#334155">h = a√6 / 3</text>
    </svg>
    `
];
