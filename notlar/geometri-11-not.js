// notlar/geometri-11-not.js - Çember ve Daire
window.geometri_11_notlari = [

    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 font-black text-sm uppercase tracking-wider">
            ⭕ ÇEMBERDE AÇILAR
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3"><li>Merkez açı = gördüğü yay; çevre açı = gördüğü yayın yarısı.</li><li>Çapı gören çevre açı <b>90°</b>dir.</li><li>İç açı: <b>α = (a+b)/2</b> · Dış açı: <b>α = |a−b|/2</b>.</li><li>Kirişler dörtgeninde karşı açılar bütünler: <b>α+θ=180°</b>.</li><li>Teğet yarıçapa dik; dış noktadan çizilen teğetler eşit.</li></ul><svg viewBox="0 0 320 214" class="geo-fig w-full max-w-[380px] mx-auto my-3" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Merkez açı">
        <rect x="1" y="1" width="318" height="212" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <circle cx="160" cy="104" r="80" fill="#e0f2fe" stroke="#0f172a" stroke-width="2"/>
        <path d="M 84.8 76.6 A 80 80 0 0 1 235.2 76.6" fill="none" stroke="#dc2626" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>
        <line x1="160" y1="104" x2="84.8" y2="76.6" stroke="#0f172a" stroke-width="2" stroke-linecap="round"/>
        <line x1="160" y1="104" x2="235.2" y2="76.6" stroke="#0f172a" stroke-width="2" stroke-linecap="round"/>
        <path d="M 139.3 96.5 A 22 22 0 0 1 180.7 96.5" fill="none" stroke="#dc2626" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        <text x="160" y="74.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">α</text>
        <circle cx="160" cy="104" r="3" fill="#0f172a"/>
        <circle cx="84.8" cy="76.6" r="3" fill="#0f172a"/>
        <circle cx="235.2" cy="76.6" r="3" fill="#0f172a"/>
        <text x="160" y="124.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">O</text>
        <text x="71.7" y="76.9" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">A</text>
        <text x="248.3" y="76.9" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">B</text>
        <text x="160" y="206.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">α = m(AB yayı)</text>
    </svg><svg viewBox="0 0 320 230" class="geo-fig w-full max-w-[380px] mx-auto my-3" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Çevre açı">
        <rect x="1" y="1" width="318" height="228" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <circle cx="160" cy="104" r="80" fill="#e0f2fe" stroke="#0f172a" stroke-width="2"/>
        <path d="M 87.5 70.2 A 80 80 0 0 1 232.5 70.2" fill="none" stroke="#dc2626" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>
        <line x1="146.1" y1="182.8" x2="87.5" y2="70.2" stroke="#0f172a" stroke-width="2" stroke-linecap="round"/>
        <line x1="146.1" y1="182.8" x2="232.5" y2="70.2" stroke="#0f172a" stroke-width="2" stroke-linecap="round"/>
        <path d="M 135 161.5 A 24 24 0 0 1 160.7 163.7" fill="none" stroke="#7c3aed" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        <text x="149.3" y="150.6" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#7c3aed">α</text>
        <circle cx="87.5" cy="70.2" r="3" fill="#0f172a"/>
        <circle cx="232.5" cy="70.2" r="3" fill="#0f172a"/>
        <circle cx="146.1" cy="182.8" r="3" fill="#0f172a"/>
        <circle cx="160" cy="104" r="2.4" fill="#64748b"/>
        <text x="74.8" y="69.3" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">A</text>
        <text x="245.2" y="69.3" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">B</text>
        <text x="143.7" y="201.6" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">C</text>
        <text x="160" y="220.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#7c3aed">α = m(AB yayı) / 2</text>
    </svg>
    `,

    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-100 dark:bg-violet-900/50 text-violet-800 dark:text-violet-200 font-black text-sm uppercase tracking-wider">
            📐 KUVVET VE ALAN
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3"><li>Noktanın çembere gücü: <b>PA·PB = PC·PD</b>, <b>PT² = PA·PB</b>.</li><li>Daire alanı <b>A = πr²</b>, çevresi <b>C = 2πr</b>.</li><li>Daire dilimi: <b>(πr²·α)/360</b> · Halka: <b>π(R²−r²)</b>.</li></ul><svg viewBox="0 0 320 214" class="geo-fig w-full max-w-[380px] mx-auto my-3" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Noktanın çembere göre kuvveti">
        <rect x="1" y="1" width="318" height="212" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <circle cx="206" cy="104" r="70" fill="#e0f2fe" stroke="#0f172a" stroke-width="2"/>
        <line x1="36" y1="104" x2="288" y2="86.4" stroke="#0f172a" stroke-width="1.8" stroke-linecap="round"/>
        <line x1="36" y1="104" x2="247.1" y2="172.6" stroke="#0f172a" stroke-width="1.8" stroke-linecap="round"/>
        <line x1="36" y1="104" x2="177.2" y2="40.2" stroke="#047857" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M 169.9 43.5 L 173.2 50.8 L 180.5 47.5" fill="none" stroke="#047857" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>
        <line x1="206" y1="104" x2="177.2" y2="40.2" stroke="#64748b" stroke-width="1.2" stroke-linecap="round" stroke-dasharray="4 3"/>
        <circle cx="36" cy="104" r="3" fill="#0f172a"/>
        <circle cx="136.4" cy="97" r="3" fill="#0f172a"/>
        <circle cx="274" cy="87.4" r="3" fill="#0f172a"/>
        <circle cx="145.8" cy="139.7" r="3" fill="#0f172a"/>
        <circle cx="233.8" cy="168.3" r="3" fill="#0f172a"/>
        <circle cx="177.2" cy="40.2" r="3" fill="#0f172a"/>
        <text x="24" y="108.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">P</text>
        <text x="127.4" y="115.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">A</text>
        <text x="284" y="81.7" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">B</text>
        <text x="143.8" y="158" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">C</text>
        <text x="241.8" y="184.6" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">D</text>
        <text x="173.2" y="31.5" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#047857">T</text>
        <text x="160" y="206.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#334155">|PA|·|PB| = |PC|·|PD| = |PT|²</text>
    </svg>
    `
];
