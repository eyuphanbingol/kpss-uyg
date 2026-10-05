// notlar/geometri-7-not.js - Analitik Doğru
window.geometri_7_notlari = [

    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 font-black text-sm uppercase tracking-wider">
            📊 KOORDİNAT DÜZLEMİ
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3"><li>I. bölge: <b>(+, +)</b> · II. bölge: <b>(−, +)</b></li><li>III. bölge: <b>(−, −)</b> · IV. bölge: <b>(+, −)</b></li><li>İki nokta arası uzaklık: <b>|AB| = √[(x₁−x₂)² + (y₁−y₂)²]</b></li><li>Orta nokta: <b>((x₁+x₂)/2 , (y₁+y₂)/2)</b></li></ul><svg viewBox="0 0 320 200" class="geo-fig w-full max-w-[380px] mx-auto my-3" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Koordinat düzleminde bölgeler">
        <rect x="1" y="1" width="318" height="198" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <line x1="24" y1="100" x2="296" y2="100" stroke="#64748b" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="160" y1="184" x2="160" y2="16" stroke="#64748b" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M 288 95 L 296 100 L 288 105" fill="none" stroke="#64748b" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>
        <path d="M 155 24 L 160 16 L 165 24" fill="none" stroke="#64748b" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>
        <text x="292" y="118.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#64748b">x</text>
        <text x="172" y="24.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#64748b">y</text>
        <text x="150" y="117.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#64748b">O</text>
        <text x="232" y="60.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">I. bölge (+, +)</text>
        <text x="88" y="60.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">II. bölge (−, +)</text>
        <text x="88" y="152.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">III. bölge (−, −)</text>
        <text x="232" y="152.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">IV. bölge (+, −)</text>
    </svg><svg viewBox="0 0 320 206" class="geo-fig w-full max-w-[380px] mx-auto my-3" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="İki nokta arası uzaklık ve orta nokta">
        <rect x="1" y="1" width="318" height="204" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <line x1="22" y1="176" x2="300" y2="176" stroke="#64748b" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="40" y1="190" x2="40" y2="16" stroke="#64748b" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M 292 171 L 300 176 L 292 181" fill="none" stroke="#64748b" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>
        <path d="M 35 24 L 40 16 L 45 24" fill="none" stroke="#64748b" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>
        <text x="296" y="194.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#64748b">x</text>
        <text x="52" y="24.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#64748b">y</text>
        <line x1="100" y1="144" x2="236" y2="144" stroke="#64748b" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="5 4"/>
        <line x1="236" y1="144" x2="236" y2="64" stroke="#64748b" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="5 4"/>
        <path d="M 227 144 L 227 135 L 236 135" fill="none" stroke="#64748b" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>
        <line x1="100" y1="144" x2="236" y2="64" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round"/>
        <circle cx="100" cy="144" r="3" fill="#0f172a"/>
        <circle cx="236" cy="64" r="3" fill="#0f172a"/>
        <circle cx="168" cy="104" r="3" fill="#dc2626"/>
        <text x="86" y="164.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">A(x₁, y₁)</text>
        <text x="196" y="62.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">B(x₂, y₂)</text>
        <text x="158" y="94.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">M</text>
        <text x="168" y="163.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">|x₂ − x₁|</text>
        <text x="240" y="108.3" text-anchor="start" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">|y₂ − y₁|</text>
    </svg>
    `,

    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-100 dark:bg-violet-900/50 text-violet-800 dark:text-violet-200 font-black text-sm uppercase tracking-wider">
            📐 EĞİM VE DOĞRU DENKLEMLERİ
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3"><li>Eğim: <b>m = (y₂−y₁)/(x₂−x₁) = tan α</b></li><li>Bir noktası ve eğimi bilinen doğru: <b>y − y₁ = m(x − x₁)</b></li><li>Eksenleri kesen form: <b>x/a + y/b = 1</b> (a: x-keseni, b: y-keseni)</li><li>Paralel doğrular: <b>m₁ = m₂</b> · Dik doğrular: <b>m₁·m₂ = −1</b></li></ul><svg viewBox="0 0 320 206" class="geo-fig w-full max-w-[380px] mx-auto my-3" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Eğim: m = tan α">
        <rect x="1" y="1" width="318" height="204" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <line x1="20" y1="168" x2="300" y2="168" stroke="#64748b" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="70" y1="190" x2="70" y2="16" stroke="#64748b" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M 292 163 L 300 168 L 292 173" fill="none" stroke="#64748b" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>
        <path d="M 65 24 L 70 16 L 75 24" fill="none" stroke="#64748b" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>
        <text x="296" y="186.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#64748b">x</text>
        <text x="82" y="24.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#64748b">y</text>
        <line x1="78.5" y1="196" x2="285.8" y2="56.2" stroke="#7c3aed" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M 150 168 A 30 30 0 0 0 144.9 151.2" fill="none" stroke="#dc2626" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        <text x="162.1" y="159.8" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">α</text>
        <line x1="178" y1="128.9" x2="240.2" y2="128.9" stroke="#64748b" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="5 4"/>
        <line x1="240.2" y1="128.9" x2="240.2" y2="86.9" stroke="#64748b" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="5 4"/>
        <path d="M 232.2 128.9 L 232.2 120.9 L 240.2 120.9" fill="none" stroke="#64748b" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>
        <circle cx="178" cy="128.9" r="3" fill="#0f172a"/>
        <circle cx="240.2" cy="86.9" r="3" fill="#0f172a"/>
        <text x="209.1" y="148.2" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">x₂ − x₁</text>
        <text x="246.2" y="112.2" text-anchor="start" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">y₂ − y₁</text>
        <text x="96" y="38.3" text-anchor="start" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#334155">m = (y₂ − y₁)/(x₂ − x₁)</text>
    </svg>
    `,

    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 font-black text-sm uppercase tracking-wider">
            📏 UZAKLIK VE AÇI
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3"><li>Noktanın doğruya uzaklığı (ax+by+c=0): <b>h = |ax₀+by₀+c| / √(a²+b²)</b></li><li>Paralel iki doğru arası uzaklık: <b>h = |c₁−c₂| / √(a²+b²)</b></li><li>İki doğru arasındaki açının tanjantı: <b>tan α = |(m₁−m₂)/(1+m₁m₂)|</b></li></ul>
    `
];
