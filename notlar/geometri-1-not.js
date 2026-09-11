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
    <svg viewBox="0 0 280 178" class="w-full max-w-[340px] mx-auto my-3" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <polygon points="128,22 42,148 214,148" fill="#e0f2fe" stroke="#0f172a" stroke-width="1.8" stroke-linejoin="round"/>
        <line x1="214" y1="148" x2="262" y2="148" stroke="#dc2626" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M 238,148 A 24 24 0 0 0 204,132" fill="none" stroke="#dc2626" stroke-width="1.7"/>
        <text x="248" y="132" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#dc2626">α</text>
        <text x="128" y="12" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#0f172a">A</text>
        <text x="28" y="162" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#0f172a">B</text>
        <text x="198" y="138" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#0f172a">C</text>
        <text x="128" y="52" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#0369a1">y</text>
        <text x="68" y="132" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#0369a1">x</text>
    </svg>
    <div class="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 mb-3 text-[12px] leading-relaxed">Dış Açı Teoremi: Bir dış açı (α), kendisine komşu olmayan iki iç açının (x + y) toplamına eşittir. C’deki dış açı, A ve B iç açılarının toplamıdır; C’deki iç açı α’nın komşusudur.</div>
    <div class="grid grid-cols-2 gap-3">
        <svg viewBox="0 0 200 140" class="w-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <polygon points="20,28 100,62 180,28 100,122" fill="#fef3c7" stroke="#0f172a" stroke-width="1.6" stroke-linejoin="round"/>
            <text x="20" y="22" font-size="12" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#0369a1">x</text>
            <text x="180" y="22" text-anchor="end" font-size="12" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#0369a1">y</text>
            <text x="100" y="136" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#0369a1">z</text>
            <text x="100" y="86" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#dc2626">α</text>
            <text x="100" y="18" text-anchor="middle" font-size="9" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#78716c">Bumerang</text>
        </svg>
        <svg viewBox="0 0 200 140" class="w-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <polygon points="100,10 112,48 154,48 120,72 132,112 100,88 68,112 80,72 46,48 88,48" fill="#e0f2fe" stroke="#0f172a" stroke-width="1.4" stroke-linejoin="round"/>
            <text x="100" y="8" text-anchor="middle" font-size="11" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#0369a1">a</text>
            <text x="162" y="50" font-size="11" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#0369a1">b</text>
            <text x="140" y="126" font-size="11" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#0369a1">c</text>
            <text x="52" y="126" font-size="11" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#0369a1">d</text>
            <text x="30" y="50" font-size="11" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#0369a1">e</text>
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
        <div class="rounded-xl border border-stone-200 dark:border-stone-700 bg-white/80 dark:bg-stone-900/40 px-3 py-2">AH yükseklik ve AD açıortay ise tabanda oluşan parça: <b>|HD| = |b − c| / 2</b> (b = |AC|, c = |AB|).</div>
        <div class="rounded-xl border border-stone-200 dark:border-stone-700 bg-white/80 dark:bg-stone-900/40 px-3 py-2">İki iç açıortayın oluşturduğu açı (iç teğet çember merkezindeki açı): <b>x = 90° + m(∠A)/2</b>.</div>
        <div class="rounded-xl border border-stone-200 dark:border-stone-700 bg-white/80 dark:bg-stone-900/40 px-3 py-2">İki dış açıortayın kesişimiyle oluşan açı: <b>x = 90° − m(∠A)/2</b>.</div>
        <div class="rounded-xl border border-stone-200 dark:border-stone-700 bg-white/80 dark:bg-stone-900/40 px-3 py-2">Bir iç açıortay ile bir dış açıortayın kesişimiyle oluşan açı: <b>x = m(∠A)/2</b>.</div>
    </div>
    <svg viewBox="0 0 280 188" class="w-full max-w-[340px] mx-auto my-3" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <polygon points="110,22 36,148 234,148" fill="#e0f2fe" stroke="#0f172a" stroke-width="1.8" stroke-linejoin="round"/>
        <line x1="110" y1="22" x2="110" y2="148" stroke="#059669" stroke-width="1.6" stroke-dasharray="5 3" stroke-linecap="round"/>
        <line x1="110" y1="22" x2="176" y2="148" stroke="#7c3aed" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M 110,48 A 26 26 0 0 1 128,52" fill="none" stroke="#dc2626" stroke-width="1.7"/>
        <text x="126" y="68" text-anchor="middle" font-size="13" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#dc2626">x</text>
        <path d="M 52,148 A 16 16 0 0 1 48,134" fill="none" stroke="#0369a1" stroke-width="1.4"/>
        <text x="62" y="132" font-size="11" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#0369a1">B̂</text>
        <path d="M 218,148 A 16 16 0 0 0 222,134" fill="none" stroke="#0369a1" stroke-width="1.4"/>
        <text x="200" y="132" font-size="11" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#0369a1">Ĉ</text>
        <circle cx="110" cy="148" r="2.5" fill="#0f172a"/>
        <circle cx="176" cy="148" r="2.5" fill="#0f172a"/>
        <text x="110" y="12" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#0f172a">A</text>
        <text x="24" y="162" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#0f172a">B</text>
        <text x="248" y="162" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#0f172a">C</text>
        <text x="98" y="88" text-anchor="middle" font-size="11" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#059669">AH</text>
        <text x="168" y="88" text-anchor="middle" font-size="11" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#7c3aed">AD</text>
        <text x="110" y="164" text-anchor="middle" font-size="11" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#0f172a">H</text>
        <text x="176" y="164" text-anchor="middle" font-size="11" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#0f172a">D</text>
        <path d="M 110,170 L 110,176 L 176,176 L 176,170" fill="none" stroke="#0f172a" stroke-width="1.3"/>
        <text x="143" y="186" text-anchor="middle" font-size="11" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#0f172a">|HD|</text>
    </svg>
    <div class="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 mb-3 text-[12px] leading-relaxed">Açıortay–yükseklik bağıntısı: aynı tepeden inen yükseklik ile açıortay arasındaki açı, diğer iki taban açısının farkının yarısına eşittir. Tabandaki |HD| ise kenar farkının yarısıdır; derece ile karıştırılmaz.</div>
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
    <svg viewBox="0 0 260 170" class="w-full max-w-[320px] mx-auto my-3" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <polygon points="50,150 50,30 210,150" fill="#e0f2fe" stroke="#0f172a" stroke-width="1.8" stroke-linejoin="round"/>
        <line x1="50" y1="150" x2="130" y2="90" stroke="#7c3aed" stroke-width="1.8"/>
        <line x1="50" y1="138" x2="62" y2="138" stroke="#0f172a" stroke-width="1.6"/>
        <line x1="62" y1="138" x2="62" y2="150" stroke="#0f172a" stroke-width="1.6"/>
        <line x1="86" y1="116" x2="94" y2="124" stroke="#7c3aed" stroke-width="1.5"/>
        <line x1="90" y1="114" x2="98" y2="122" stroke="#7c3aed" stroke-width="1.5"/>
        <line x1="86" y1="64" x2="94" y2="56" stroke="#0f172a" stroke-width="1.5"/>
        <line x1="90" y1="66" x2="98" y2="58" stroke="#0f172a" stroke-width="1.5"/>
        <line x1="166" y1="116" x2="174" y2="124" stroke="#0f172a" stroke-width="1.5"/>
        <line x1="170" y1="114" x2="178" y2="122" stroke="#0f172a" stroke-width="1.5"/>
        <circle cx="130" cy="90" r="2.6" fill="#0f172a"/>
        <text x="36" y="164" font-size="12" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#0f172a">A</text>
        <text x="36" y="22" font-size="12" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#0f172a">B</text>
        <text x="218" y="164" font-size="12" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#0f172a">C</text>
        <text x="142" y="86" font-size="12" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#0f172a">D</text>
        <text x="130" y="168" text-anchor="middle" font-size="10" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#57534e">|AD|=|BD|=|DC|</text>
    </svg>
    <svg viewBox="0 0 260 178" class="w-full max-w-[320px] mx-auto my-3" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <polygon points="130,18 52,152 208,152" fill="#e0f2fe" stroke="#0f172a" stroke-width="1.8" stroke-linejoin="round"/>
        <line x1="130" y1="18" x2="130" y2="152" stroke="#059669" stroke-width="1.8"/>
        <rect x="122" y="144" width="8" height="8" fill="none" stroke="#0f172a" stroke-width="1.5"/>
        <line x1="86" y1="80" x2="96" y2="88" stroke="#0f172a" stroke-width="1.5"/>
        <line x1="164" y1="80" x2="174" y2="88" stroke="#0f172a" stroke-width="1.5"/>
        <line x1="86" y1="152" x2="86" y2="146" stroke="#0f172a" stroke-width="1.6"/>
        <line x1="174" y1="152" x2="174" y2="146" stroke="#0f172a" stroke-width="1.6"/>
        <path d="M 118,36 A 16 16 0 0 0 142,36" fill="none" stroke="#7c3aed" stroke-width="1.5"/>
        <circle cx="124" cy="34" r="1.6" fill="#7c3aed"/>
        <circle cx="136" cy="34" r="1.6" fill="#7c3aed"/>
        <circle cx="130" cy="152" r="2.5" fill="#0f172a"/>
        <text x="130" y="12" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#0f172a">A</text>
        <text x="38" y="166" font-size="12" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#0f172a">B</text>
        <text x="214" y="166" font-size="12" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#0f172a">C</text>
        <text x="140" y="166" font-size="12" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#0f172a">H</text>
        <text x="90" y="168" font-size="10" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#57534e">|BH|=|HC|</text>
        <text x="118" y="88" font-size="10" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#059669">YAKİ</text>
    </svg>
    `
];
