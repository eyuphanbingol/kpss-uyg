// notlar/geometri-3-not.js - İkizkenar ve Eşkenar
window.geometri_3_notlari = [

    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 font-black text-sm uppercase tracking-wider">
            📐 İKİZKENAR ÜÇGEN
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3"><li>İkizkenar üçgende taban açıları birbirine eşittir.</li><li>Tepe noktasından tabana indirilen yükseklik = kenarortay = açıortay (muhteşem dörtlü).</li><li>Tabana indirilen yükseklik x için: <b>x² = b² − m · n</b> (b eş kenar, m ve n taban parçaları).</li></ul><svg viewBox="0 0 320 200" class="geo-fig w-full max-w-[380px] mx-auto my-3" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="İkizkenar üçgen">
        <rect x="1" y="1" width="318" height="198" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <polygon points="160,30 72,160 248,160" fill="#e0f2fe" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
        <line x1="160" y1="30" x2="160" y2="160" stroke="#047857" stroke-width="2" stroke-linecap="round"/>
        <path d="M 160 150 L 170 150 L 170 160" fill="none" stroke="#047857" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>
        <path d="M 96 160 A 24 24 0 0 0 85.5 140.1" fill="none" stroke="#dc2626" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        <text x="105.6" y="146.9" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">α</text>
        <path d="M 234.5 140.1 A 24 24 0 0 0 224 160" fill="none" stroke="#dc2626" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        <text x="214.4" y="146.9" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">α</text>
        <line x1="111" y1="91.6" x2="121" y2="98.4" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="199" y1="98.4" x2="209" y2="91.6" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
        <circle cx="160" cy="160" r="3" fill="#0f172a"/>
        <text x="170" y="99.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#047857">h</text>
        <text x="160" y="21" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">A</text>
        <text x="59.4" y="171.2" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">B</text>
        <text x="260.6" y="171.2" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">C</text>
        <text x="160" y="180.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">H</text>
    </svg><svg viewBox="0 0 320 214" class="geo-fig w-full max-w-[380px] mx-auto my-3" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="İkizkenar üçgende tabana çizilen doğru parçası">
        <rect x="1" y="1" width="318" height="212" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <polygon points="160,30 64,158 256,158" fill="#e0f2fe" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
        <line x1="160" y1="30" x2="198.4" y2="158" stroke="#7c3aed" stroke-width="2" stroke-linecap="round"/>
        <circle cx="198.4" cy="158" r="3" fill="#0f172a"/>
        <line x1="107.2" y1="90.4" x2="116.8" y2="97.6" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="203.2" y1="97.6" x2="212.8" y2="90.4" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
        <text x="160" y="21" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">A</text>
        <text x="51.2" y="168.7" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">B</text>
        <text x="268.8" y="168.7" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">C</text>
        <text x="198.4" y="178.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">D</text>
        <text x="100" y="89.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">b</text>
        <text x="220" y="89.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">b</text>
        <text x="190.2" y="98.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#7c3aed">x</text>
        <text x="131.2" y="178.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">m</text>
        <text x="227.2" y="178.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">n</text>
        <text x="160" y="204.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#7c3aed">x² = b² − m·n</text>
    </svg>
    `,

    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-100 dark:bg-violet-900/50 text-violet-800 dark:text-violet-200 font-black text-sm uppercase tracking-wider">
            ⬡ EŞKENAR ÜÇGEN
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3"><li>Tüm açılar <b>60°</b>, tüm kenarlar <b>a</b>.</li><li>Alan: <b>A = a²√3 / 4</b>.</li><li>Yükseklik: <b>h = a√3 / 2</b>.</li></ul><svg viewBox="0 0 320 228" class="geo-fig w-full max-w-[380px] mx-auto my-3" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Eşkenar üçgen">
        <rect x="1" y="1" width="318" height="226" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <polygon points="160,32.8 75,180 245,180" fill="#e0f2fe" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
        <line x1="160" y1="32.8" x2="160" y2="180" stroke="#047857" stroke-width="2" stroke-linecap="round" stroke-dasharray="5 4"/>
        <path d="M 160 171 L 169 171 L 169 180" fill="none" stroke="#047857" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>
        <path d="M 150 50.1 A 20 20 0 0 0 170 50.1" fill="none" stroke="#dc2626" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        <path d="M 95 180 A 20 20 0 0 0 85 162.7" fill="none" stroke="#dc2626" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        <path d="M 235 162.7 A 20 20 0 0 0 225 180" fill="none" stroke="#dc2626" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        <text x="177" y="66.7" text-anchor="middle" font-size="11" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">60°</text>
        <text x="107" y="174" text-anchor="middle" font-size="11" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">60°</text>
        <text x="213" y="174" text-anchor="middle" font-size="11" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">60°</text>
        <line x1="112.3" y1="103.4" x2="122.7" y2="109.4" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="197.3" y1="109.4" x2="207.7" y2="103.4" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="160" y1="186" x2="160" y2="174" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
        <text x="104.5" y="103.6" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">a</text>
        <text x="215.5" y="103.6" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">a</text>
        <text x="170" y="119.1" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#047857">h</text>
        <text x="160" y="23.8" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">A</text>
        <text x="62.9" y="192" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">B</text>
        <text x="257.1" y="192" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">C</text>
        <text x="160" y="218.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#334155">h = a√3 / 2,  A = a²√3 / 4</text>
    </svg>
    `
];
