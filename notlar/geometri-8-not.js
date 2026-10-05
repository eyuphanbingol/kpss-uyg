// notlar/geometri-8-not.js - Dörtgenler ve Yamuk
window.geometri_8_notlari = [

    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 font-black text-sm uppercase tracking-wider">
            ⬜ DÖRTGENLER
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3"><li>Her dörtgenin iç açıları toplamı <b>360°</b>, dış açıları toplamı <b>360°</b>dir.</li><li>Dik köşegenli dörtgende: <b>a² + c² = b² + d²</b> (karşı kenarlar).</li><li>Köşegenler dik ise alan: <b>A = (e·f)/2</b>.</li></ul><svg viewBox="0 0 320 236" class="geo-fig w-full max-w-[380px] mx-auto my-3" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Köşegenleri dik dörtgen">
        <rect x="1" y="1" width="318" height="234" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <polygon points="46,108 150,32 278,108 150,196" fill="#e0f2fe" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
        <line x1="46" y1="108" x2="278" y2="108" stroke="#7c3aed" stroke-width="2" stroke-linecap="round" stroke-dasharray="5 4"/>
        <line x1="150" y1="32" x2="150" y2="196" stroke="#7c3aed" stroke-width="2" stroke-linecap="round" stroke-dasharray="5 4"/>
        <path d="M 159 108 L 159 99 L 150 99" fill="none" stroke="#7c3aed" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>
        <text x="33" y="113" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">A</text>
        <text x="150" y="24" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">B</text>
        <text x="291" y="113" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">C</text>
        <text x="150" y="214" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">D</text>
        <text x="90.3" y="64.2" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">a</text>
        <text x="220.6" y="63.5" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">b</text>
        <text x="221.4" y="167.4" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">c</text>
        <text x="89.6" y="166.6" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">d</text>
        <text x="214" y="102.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#7c3aed">e</text>
        <text x="160" y="156.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#7c3aed">f</text>
        <text x="160" y="228.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#334155">a² + c² = b² + d²,  A = e·f / 2</text>
    </svg>
    `,

    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 font-black text-sm uppercase tracking-wider">
            🔷 YAMUK
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3"><li>Paralel kenarlar taban; orta taban (orta taban): <b>|EF| = (a + c)/2</b>.</li><li>Alan: <b>A = (a + c)·h / 2</b>.</li><li>İkizkenar yamukta taban açıları eşittir; köşegenler eşit uzunluktadır.</li><li>Dik yamukta birer dik açı vardır; köşegenler dik ise <b>h² = a·c</b> (özel durum).</li></ul><svg viewBox="0 0 320 214" class="geo-fig w-full max-w-[380px] mx-auto my-3" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Yamukta orta taban">
        <rect x="1" y="1" width="318" height="212" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <polygon points="40,166 280,166 210,54 102,54" fill="#e0f2fe" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
        <line x1="71" y1="110" x2="245" y2="110" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-dasharray="6 4"/>
        <circle cx="71" cy="110" r="3" fill="#dc2626"/>
        <circle cx="245" cy="110" r="3" fill="#dc2626"/>
        <line x1="102" y1="54" x2="102" y2="166" stroke="#047857" stroke-width="2" stroke-linecap="round" stroke-dasharray="4 4"/>
        <path d="M 102 157 L 111 157 L 111 166" fill="none" stroke="#047857" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>
        <line x1="60.7" y1="140.9" x2="50.3" y2="135.1" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="91.7" y1="84.9" x2="81.3" y2="79.1" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="268.6" y1="136.5" x2="258.5" y2="142.9" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="266.5" y1="133.1" x2="256.4" y2="139.5" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="233.6" y1="80.5" x2="223.5" y2="86.9" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="231.5" y1="77.1" x2="221.4" y2="83.5" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
        <text x="28.3" y="176.6" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">A</text>
        <text x="291.8" y="176.5" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">B</text>
        <text x="218.8" y="49.5" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">C</text>
        <text x="92.8" y="49.8" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">D</text>
        <text x="59" y="112.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">E</text>
        <text x="257" y="112.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">F</text>
        <text x="160" y="186.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">a</text>
        <text x="156" y="45.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">c</text>
        <text x="112" y="140.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#047857">h</text>
        <text x="160" y="206.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">|EF| = (a + c)/2,  A = (a + c)·h / 2</text>
    </svg><div class="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 mb-3 text-[12px] leading-relaxed">Paralel tabanlara komşu iç açılar toplamı 180°dir.</div>
    `
];
