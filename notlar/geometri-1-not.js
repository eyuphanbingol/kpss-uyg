// notlar/geometri-1-not.js - Üçgende Açılar
window.geometri_1_notlari = [

    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 font-black text-sm uppercase tracking-wider">
            📐 İÇ VE DIŞ AÇILAR
        </span>
    </div>
    <div class="space-y-2 mb-3 text-[13px] leading-relaxed">
        <div class="rounded-xl border border-stone-200 dark:border-stone-700 bg-white/80 dark:bg-stone-900/40 px-3 py-2">Bir üçgenin iç açıları toplamı <b>180°</b>dir.</div>
        <div class="rounded-xl border border-stone-200 dark:border-stone-700 bg-white/80 dark:bg-stone-900/40 px-3 py-2">Bir üçgenin dış açıları toplamı <b>360°</b>dir.</div>
        <div class="rounded-xl border border-stone-200 dark:border-stone-700 bg-white/80 dark:bg-stone-900/40 px-3 py-2">Bir üçgenin bir dış açısının ölçüsü, kendisine <b>komşu olmayan</b> iki iç açının ölçüleri toplamına eşittir: <b>α = x + y</b>.</div>
        <div class="rounded-xl border border-stone-200 dark:border-stone-700 bg-white/80 dark:bg-stone-900/40 px-3 py-2">İçbükey (içe dönük) dörtgende uç açıların toplamı göbek açısına eşittir <b>(Bumerang Kuralı)</b>: <b>α = x + y + z</b>.</div>
        <div class="rounded-xl border border-stone-200 dark:border-stone-700 bg-white/80 dark:bg-stone-900/40 px-3 py-2">Beş köşeli yıldızda uç açıların toplamı: <b>a + b + c + d + e = 180°</b>.</div>
    </div>
    <svg viewBox="0 0 320 214" class="geo-fig w-full max-w-[380px] mx-auto my-3" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Dış açı teoremi: α = x + y">
        <rect x="1" y="1" width="318" height="212" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <polygon points="130,34 40,160 222,160" fill="#e0f2fe" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
        <line x1="222" y1="160" x2="300" y2="160" stroke="#dc2626" stroke-width="2" stroke-linecap="round"/>
        <path d="M 66 160 A 26 26 0 0 0 55.1 138.8" fill="none" stroke="#0369a1" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        <text x="75.6" y="146.4" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">x</text>
        <path d="M 116.1 53.5 A 24 24 0 0 0 144.2 53.4" fill="none" stroke="#0369a1" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        <text x="130.2" y="76.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">y</text>
        <path d="M 244 160 A 22 22 0 0 0 209 142.2" fill="none" stroke="#dc2626" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        <text x="238.3" y="132.6" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">α</text>
        <text x="129.9" y="25" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">A</text>
        <text x="27.3" y="170.9" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">B</text>
        <text x="218" y="182.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">C</text>
        <text x="160" y="204.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">α = x + y</text>
    </svg>
    <div class="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 mb-3 text-[12px] leading-relaxed">Dış Açı Teoremi: Bir dış açı (α), kendisine komşu olmayan iki iç açının (x + y) toplamına eşittir. C’deki dış açı, A ve B iç açılarının toplamıdır; C’deki iç açı α’nın komşusudur.</div>
    <div class="grid grid-cols-2 gap-3">
        <svg viewBox="0 0 320 238" class="geo-fig w-full max-w-[380px] mx-auto my-3" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bumerang kuralı: α = x + y + z">
        <rect x="1" y="1" width="318" height="236" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <polygon points="48,40 160,196 272,40 160,104" fill="#fef3c7" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
        <path d="M 65.5 64.4 A 30 30 0 0 0 74 54.9" fill="none" stroke="#0369a1" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        <text x="80.7" y="74.1" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">x</text>
        <path d="M 246 54.9 A 30 30 0 0 0 254.5 64.4" fill="none" stroke="#0369a1" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        <text x="239.3" y="74.1" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">y</text>
        <path d="M 144.8 174.9 A 26 26 0 0 1 175.2 174.9" fill="none" stroke="#0369a1" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        <text x="160" y="160.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">z</text>
        <path d="M 140.9 93.1 A 22 22 0 0 1 179.1 93.1" fill="none" stroke="#dc2626" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        <text x="160" y="72.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">α</text>
        <text x="160" y="228.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">α = x + y + z</text>
    </svg>
        <svg viewBox="0 0 320 250" class="geo-fig w-full max-w-[380px] mx-auto my-3" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Beş köşeli yıldızda uç açılar toplamı 180°">
        <rect x="1" y="1" width="318" height="248" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <polygon points="160,26 180.7,89.6 247.5,89.6 193.4,128.9 214.1,192.4 160,153.1 105.9,192.4 126.6,128.9 72.5,89.6 139.3,89.6" fill="#e0f2fe" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
        <path d="M 165.6 43.1 A 18 18 0 0 1 154.4 43.1" fill="none" stroke="#dc2626" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        <text x="160" y="17" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">a</text>
        <path d="M 232.9 100.2 A 18 18 0 0 1 229.5 89.6" fill="none" stroke="#dc2626" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        <text x="260.8" y="90.3" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">b</text>
        <path d="M 199.5 181.8 A 18 18 0 0 1 208.5 175.3" fill="none" stroke="#dc2626" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        <text x="222.3" y="208.8" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">c</text>
        <path d="M 111.5 175.3 A 18 18 0 0 1 120.5 181.8" fill="none" stroke="#dc2626" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        <text x="97.7" y="208.8" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">d</text>
        <path d="M 90.5 89.6 A 18 18 0 0 1 87.1 100.2" fill="none" stroke="#dc2626" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        <text x="59.2" y="90.3" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">e</text>
        <text x="160" y="240.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">a + b + c + d + e = 180°</text>
    </svg>
    </div>
    `,

    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-100 dark:bg-violet-900/50 text-violet-800 dark:text-violet-200 font-black text-sm uppercase tracking-wider">
            📏 YÜKSEKLİK VE AÇIORTAY
        </span>
    </div>
    <div class="space-y-2 mb-3 text-[13px] leading-relaxed">
        <div class="rounded-xl border border-stone-200 dark:border-stone-700 bg-white/80 dark:bg-stone-900/40 px-3 py-2">Bir üçgende aynı köşeden çıkan yükseklik [AH] ile açıortay [AD] arasındaki açı: <b>m(∠HAD) = |m(∠B) − m(∠C)| / 2</b>.</div>
        <div class="rounded-xl border border-stone-200 dark:border-stone-700 bg-white/80 dark:bg-stone-900/40 px-3 py-2">İç açıortay tabanı komşu kenarlar oranında böler: <b>|BD| / |DC| = c / b</b> (b = |AC|, c = |AB|).</div>
        <div class="rounded-xl border border-stone-200 dark:border-stone-700 bg-white/80 dark:bg-stone-900/40 px-3 py-2">İki iç açıortayın oluşturduğu açı (iç teğet çember merkezindeki açı): <b>x = 90° + m(∠A)/2</b>.</div>
        <div class="rounded-xl border border-stone-200 dark:border-stone-700 bg-white/80 dark:bg-stone-900/40 px-3 py-2">İki dış açıortayın kesişimiyle oluşan açı: <b>x = 90° − m(∠A)/2</b>.</div>
        <div class="rounded-xl border border-stone-200 dark:border-stone-700 bg-white/80 dark:bg-stone-900/40 px-3 py-2">Bir iç açıortay ile bir dış açıortayın kesişimiyle oluşan açı: <b>x = m(∠A)/2</b>.</div>
    </div>
    <svg viewBox="0 0 320 226" class="geo-fig w-full max-w-[380px] mx-auto my-3" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Yükseklik ile açıortay arasındaki açı">
        <rect x="1" y="1" width="318" height="224" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <polygon points="86,32 34,166 290,166" fill="#e0f2fe" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
        <line x1="86" y1="32" x2="86" y2="166" stroke="#047857" stroke-width="2" stroke-linecap="round" stroke-dasharray="5 4"/>
        <path d="M 86 156 L 96 156 L 96 166" fill="none" stroke="#047857" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>
        <line x1="86" y1="32" x2="128.9" y2="166" stroke="#7c3aed" stroke-width="2" stroke-linecap="round"/>
        <path d="M 86 72 A 40 40 0 0 0 98.2 70.1" fill="none" stroke="#dc2626" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        <text x="94.6" y="92" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">x</text>
        <path d="M 56 166 A 22 22 0 0 0 42 145.5" fill="none" stroke="#0369a1" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        <text x="62.1" y="151.1" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">B</text>
        <path d="M 264 166 A 26 26 0 0 1 268.3 151.7" fill="none" stroke="#0369a1" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        <text x="251.7" y="158.9" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0369a1">C</text>
        <circle cx="86" cy="166" r="3" fill="#0f172a"/>
        <circle cx="128.9" cy="166" r="3" fill="#0f172a"/>
        <text x="79.1" y="24.9" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">A</text>
        <text x="21.2" y="176.6" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">B</text>
        <text x="303.4" y="175" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">C</text>
        <text x="86" y="186.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">H</text>
        <text x="128.9" y="186.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">D</text>
        <text x="160" y="216.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#dc2626">x = |m(∠B) − m(∠C)| / 2</text>
    </svg>
    <div class="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 mb-3 text-[12px] leading-relaxed">Açıortay–yükseklik bağıntısı: aynı tepeden inen yükseklik ile açıortay arasındaki açı, diğer iki taban açısının farkının yarısına eşittir. Aynı tepeden inen açıortayın ayağı D, her zaman yüksekliğin ayağı H ile kenarortayın ayağı arasında kalır.</div>
    `,

    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 font-black text-sm uppercase tracking-wider">
            ⭐ MUHTEŞEM ÜÇLÜ VE YAKİ
        </span>
    </div>
    <div class="space-y-2 mb-3 text-[13px] leading-relaxed">
        <div class="rounded-xl border border-stone-200 dark:border-stone-700 bg-white/80 dark:bg-stone-900/40 px-3 py-2"><b>Muhteşem Üçlü:</b> Bir dik üçgende hipotenüse ait kenarortayın uzunluğu, hipotenüs uzunluğunun yarısına eşittir: <b>|AD| = |BD| = |DC| = |BC| / 2</b>.</div>
        <div class="rounded-xl border border-stone-200 dark:border-stone-700 bg-white/80 dark:bg-stone-900/40 px-3 py-2"><b>İkizkenar Üçgen Kuralı (YAKİ):</b> İkizkenar bir üçgende tepe noktasından tabana indirilen yükseklik; hem açıortay, hem kenarortay, hem de simetri eksenidir.</div>
    </div>
    <svg viewBox="0 0 320 214" class="geo-fig w-full max-w-[380px] mx-auto my-3" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Muhteşem üçlü">
        <rect x="1" y="1" width="318" height="212" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <polygon points="52,166 52,40 262,166" fill="#e0f2fe" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
        <path d="M 52 155 L 63 155 L 63 166" fill="none" stroke="#0f172a" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>
        <line x1="52" y1="166" x2="157" y2="103" stroke="#7c3aed" stroke-width="2" stroke-linecap="round"/>
        <circle cx="157" cy="103" r="3" fill="#0f172a"/>
        <line x1="101.4" y1="76.6" x2="107.6" y2="66.4" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="206.4" y1="139.6" x2="212.6" y2="129.4" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="107.6" y1="139.6" x2="101.4" y2="129.4" stroke="#7c3aed" stroke-width="1.6" stroke-linecap="round"/>
        <text x="40" y="178.2" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">A</text>
        <text x="43" y="34.3" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">B</text>
        <text x="275.4" y="175.1" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">C</text>
        <text x="167" y="95.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">D</text>
        <text x="160" y="202.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#7c3aed">|AD| = |BD| = |DC| = |BC| / 2</text>
    </svg>
    <svg viewBox="0 0 320 214" class="geo-fig w-full max-w-[380px] mx-auto my-3" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="İkizkenar üçgende tepeden inen yükseklik">
        <rect x="1" y="1" width="318" height="212" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <polygon points="160,30 64,168 256,168" fill="#e0f2fe" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
        <line x1="160" y1="30" x2="160" y2="168" stroke="#047857" stroke-width="2" stroke-linecap="round"/>
        <path d="M 160 158 L 170 158 L 170 168" fill="none" stroke="#0f172a" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>
        <path d="M 144 53 A 28 28 0 0 0 160 58" fill="none" stroke="#7c3aed" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        <path d="M 160 63 A 33 33 0 0 0 178.8 57.1" fill="none" stroke="#7c3aed" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        <path d="M 86 168 A 22 22 0 0 0 76.6 149.9" fill="none" stroke="#0369a1" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        <path d="M 243.4 149.9 A 22 22 0 0 0 234 168" fill="none" stroke="#0369a1" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        <line x1="107.1" y1="95.6" x2="116.9" y2="102.4" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="203.1" y1="102.4" x2="212.9" y2="95.6" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="110" y1="174" x2="110" y2="162" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="114" y1="174" x2="114" y2="162" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="206" y1="174" x2="206" y2="162" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="210" y1="174" x2="210" y2="162" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
        <circle cx="160" cy="168" r="3" fill="#0f172a"/>
        <text x="160" y="21" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">A</text>
        <text x="51.4" y="179.1" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">B</text>
        <text x="268.6" y="179.1" text-anchor="middle" font-size="14" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">C</text>
        <text x="160" y="188.7" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#0f172a">H</text>
        <text x="160" y="204.3" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" fill="#047857">[AH]: yükseklik = açıortay = kenarortay</text>
    </svg>
    `
];
