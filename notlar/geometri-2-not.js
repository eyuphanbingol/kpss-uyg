// notlar/geometri-2-not.js - Açı-Kenar ve Dik Üçgen
window.geometri_2_notlari = [

    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 font-black text-sm uppercase tracking-wider">
            📐 AÇI-KENAR BAĞINTILARI
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3"><li>Kenarlar a &gt; b &gt; c ise açılar m(A) &gt; m(B) &gt; m(C).</li><li>Üçgen eşitsizliği: <b>|b − c| &lt; a &lt; b + c</b>.</li><li>İç nokta P için: <b>a &lt; x + y + z &lt; b + c</b> (a karşı kenar).</li><li>A köşesinden: <b>h_a ≤ n_a ≤ V_a</b> (yükseklik ≤ açıortay ≤ kenarortay).</li><li>Dar açı: a² &lt; b² + c² · Geniş açı: a² &gt; b² + c² (a en büyük kenara karşı).</li></ul>
    `,

    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-100 dark:bg-violet-900/50 text-violet-800 dark:text-violet-200 font-black text-sm uppercase tracking-wider">
            📏 PİSAGOR VE ÖZEL ÜÇGENLER
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3"><li>Dik üçgende (a hipotenüs): <b>a² = b² + c²</b>.</li><li>Ünlü üçlüler: 3-4-5, 5-12-13, 8-15-17, 7-24-25.</li><li>30°-60°-90°: karşı 30° = x, karşı 60° = x√3, hipotenüs = 2x.</li><li>45°-45°-90°: bacaklar a, a; hipotenüs = a√2.</li><li>15°-75°-90°: hipotenüs 4k ise karşı 15° = k(√6−√2), karşı 75° = k(√6+√2).</li></ul><svg viewBox="0 0 320 212" class="geo-fig w-full max-w-[380px] mx-auto my-3" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pisagor bağıntısı">
        <rect x="1" y="1" width="318" height="210" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <polygon points="64,158 64,40 264,158" fill="#e0f2fe" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
        <path d="M 64 147 L 75 147 L 75 158" fill="none" stroke="#0f172a" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>
        <text x="51.9" y="170.2" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">A</text>
        <text x="54.9" y="34.4" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">B</text>
        <text x="277.4" y="167" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">C</text>
        <text x="170.6" y="92.5" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">a</text>
        <text x="164" y="175.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">b</text>
        <text x="51" y="103.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">c</text>
        <text x="160" y="202.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">a² = b² + c²</text>
    </svg><svg viewBox="0 0 320 200" class="geo-fig w-full max-w-[380px] mx-auto my-3" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="30°-60°-90° üçgeni">
        <rect x="1" y="1" width="318" height="198" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <polygon points="60,66 60,156 215.9,156" fill="#e0f2fe" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
        <path d="M 60 145 L 71 145 L 71 156" fill="none" stroke="#0f172a" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>
        <path d="M 189.9 141 A 30 30 0 0 0 185.9 156" fill="none" stroke="#dc2626" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        <text x="165.7" y="146.9" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">30°</text>
        <path d="M 60 84 A 18 18 0 0 0 75.6 75" fill="none" stroke="#dc2626" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        <text x="76" y="98" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">60°</text>
        <text x="50.8" y="60.5" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">A</text>
        <text x="47.9" y="168" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">B</text>
        <text x="229.3" y="164.9" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">C</text>
        <text x="47" y="115.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">x</text>
        <text x="137.9" y="175.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">x√3</text>
        <text x="144.4" y="104.4" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">2x</text>
    </svg>
    `,

    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 font-black text-sm uppercase tracking-wider">
            ⭐ ÖKLİD BAĞINTILARI
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3"><li>h² = p · k</li><li>a · h = b · c</li><li>b² = k · a</li><li>c² = p · a</li><li>(a hipotenüs, dik köşeden hipotenüse inen yükseklik h; p ve k hipotenüs parçaları — her bacak karesi, komşu parça × hipotenüs)</li></ul><svg viewBox="0 0 320 214" class="geo-fig w-full max-w-[380px] mx-auto my-3" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Öklid bağıntıları">
        <rect x="1" y="1" width="318" height="212" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <polygon points="70,170 70,48 283.5,170" fill="#e0f2fe" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
        <line x1="70" y1="170" x2="122.6" y2="78" stroke="#047857" stroke-width="2" stroke-linecap="round"/>
        <path d="M 70 159 L 81 159 L 81 170" fill="none" stroke="#0f172a" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>
        <path d="M 118.1 85.8 L 125.9 90.3 L 130.4 82.5" fill="none" stroke="#047857" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>
        <circle cx="122.6" cy="78" r="3" fill="#0f172a"/>
        <text x="57.8" y="182" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">A</text>
        <text x="60.8" y="42.5" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">B</text>
        <text x="297" y="178.9" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">C</text>
        <text x="129.5" y="70.6" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">H</text>
        <text x="57" y="113.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">c</text>
        <text x="176.8" y="187.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">b</text>
        <text x="106.3" y="134.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#047857">h</text>
        <text x="102.7" y="56.4" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">p</text>
        <text x="209.5" y="117.4" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">k</text>
        <text x="160" y="204.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#334155">h² = p·k,  b² = k·a,  c² = p·a</text>
    </svg>
    `
];
