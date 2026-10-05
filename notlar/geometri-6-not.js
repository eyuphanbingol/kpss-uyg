// notlar/geometri-6-not.js - Benzerlik
window.geometri_6_notlari = [

    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 font-black text-sm uppercase tracking-wider">
            📐 BENZERLİK TÜRLERİ
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3"><li><b>AAA (A.A.):</b> Üç açı eşit → üçgenler benzer.</li><li><b>SAS (K.A.K.):</b> İki kenar oranı eşit ve aralarındaki açı eşit.</li><li><b>SSS (K.K.K.):</b> Üç kenar oranı eşit.</li><li>Benzerlik oranı k ise alan oranı <b>k²</b>, çevre oranı <b>k</b>.</li></ul><svg viewBox="0 0 320 196" class="geo-fig w-full max-w-[380px] mx-auto my-3" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Benzer üçgenler">
        <rect x="1" y="1" width="318" height="194" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <polygon points="74,92 34,150 114,150" fill="#e0f2fe" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
        <polygon points="226,63 166,150 286,150" fill="#fef3c7" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
        <path d="M 66.1 103.5 A 14 14 0 0 0 81.9 103.5" fill="none" stroke="#dc2626" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        <path d="M 216.5 76.8 A 16.8 16.8 0 0 0 235.5 76.8" fill="none" stroke="#dc2626" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        <path d="M 50 150 A 16 16 0 0 0 43.1 136.8" fill="none" stroke="#0369a1" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        <path d="M 185.2 150 A 19.2 19.2 0 0 0 176.9 134.2" fill="none" stroke="#0369a1" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        <path d="M 106.1 138.5 A 14 14 0 0 0 100 150" fill="none" stroke="#047857" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        <path d="M 276.5 136.2 A 16.8 16.8 0 0 0 269.2 150" fill="none" stroke="#047857" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        <text x="74" y="84" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">A</text>
        <text x="22.3" y="160.7" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">B</text>
        <text x="125.7" y="160.7" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">C</text>
        <text x="226" y="55" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">D</text>
        <text x="154.3" y="160.7" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">E</text>
        <text x="297.7" y="160.7" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">F</text>
        <text x="160" y="186.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#334155">Benzerlik oranı k: çevre oranı k, alan oranı k²</text>
    </svg>
    `,

    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-100 dark:bg-violet-900/50 text-violet-800 dark:text-violet-200 font-black text-sm uppercase tracking-wider">
            📏 THALES · MENELAUS · CEVA
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3"><li>Thales: <b>a/b = c/d</b> (paralel doğrular ve kesenler).</li><li>Menelaus (bir doğru ABC üçgeninin BC uzantısını F’de, CA’yı D’de, AB’yi E’de keserse): <b>(FB/FC)·(CD/DA)·(AE/EB) = 1</b>.</li><li>Ceva (D ∈ AB, E ∈ BC, F ∈ CA ve [CD], [AE], [BF] bir noktada kesişirse): <b>(AD/DB)·(BE/EC)·(CF/FA) = 1</b>.</li></ul><svg viewBox="0 0 320 200" class="geo-fig w-full max-w-[380px] mx-auto my-3" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Thales teoremi">
        <rect x="1" y="1" width="318" height="198" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <line x1="24" y1="40" x2="296" y2="40" stroke="#0f172a" stroke-width="1.8" stroke-linecap="round"/>
        <line x1="24" y1="96" x2="296" y2="96" stroke="#0f172a" stroke-width="1.8" stroke-linecap="round"/>
        <line x1="24" y1="166" x2="296" y2="166" stroke="#0f172a" stroke-width="1.8" stroke-linecap="round"/>
        <line x1="52.5" y1="23.6" x2="125.5" y2="182.4" stroke="#7c3aed" stroke-width="2" stroke-linecap="round"/>
        <line x1="258.9" y1="24.4" x2="169.1" y2="181.6" stroke="#7c3aed" stroke-width="2" stroke-linecap="round"/>
        <circle cx="60" cy="40" r="3" fill="#0f172a"/>
        <circle cx="85.8" cy="96" r="3" fill="#0f172a"/>
        <circle cx="118" cy="166" r="3" fill="#0f172a"/>
        <circle cx="250" cy="40" r="3" fill="#0f172a"/>
        <circle cx="218" cy="96" r="3" fill="#0f172a"/>
        <circle cx="178" cy="166" r="3" fill="#0f172a"/>
        <text x="58.9" y="72.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">a</text>
        <text x="87.9" y="135.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">b</text>
        <text x="248" y="72.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">c</text>
        <text x="212" y="135.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">d</text>
        <text x="300" y="34" text-anchor="end" font-size="11" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#64748b">d₁</text>
        <text x="300" y="90" text-anchor="end" font-size="11" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#64748b">d₂</text>
        <text x="300" y="160" text-anchor="end" font-size="11" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#64748b">d₃</text>
        <text x="160" y="192.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#334155">d₁ ∥ d₂ ∥ d₃  ⇒  a/b = c/d</text>
    </svg>
    `
];
