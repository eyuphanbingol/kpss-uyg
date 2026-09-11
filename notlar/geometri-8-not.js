// notlar/geometri-8-not.js - Dörtgenler ve Yamuk
window.geometri_8_notlari = [

    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 font-black text-sm uppercase tracking-wider">
            ⬜ DÖRTGENLER
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3"><li>Her dörtgenin iç açıları toplamı <b>360°</b>, dış açıları toplamı <b>360°</b>dir.</li><li>Dik köşegenli dörtgende: <b>a² + c² = b² + d²</b> (karşı kenarlar).</li><li>Köşegenler dik ise alan: <b>A = (e·f)/2</b>.</li></ul><svg viewBox="0 0 260 170" class="w-full max-w-[300px] mx-auto my-3" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="100%" height="100%" fill="transparent"/><polygon points="60,140 200,130 220,50 80,60" fill="#fef3c7" stroke="#0f172a" stroke-width="1.8" stroke-linejoin="round"/><text x="130" y="165" text-anchor="middle" font-size="9" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#0f172a">İç açılar toplamı 360°</text></svg>
    `,

    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 font-black text-sm uppercase tracking-wider">
            🔷 YAMUK
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3"><li>Paralel kenarlar taban; orta taban (orta taban): <b>|EF| = (a + c)/2</b>.</li><li>Alan: <b>A = (a + c)·h / 2</b>.</li><li>İkizkenar yamukta taban açıları eşittir; köşegenler eşit uzunluktadır.</li><li>Dik yamukta birer dik açı vardır; köşegenler dik ise <b>h² = a·c</b> (özel durum).</li></ul><svg viewBox="0 0 260 170" class="w-full max-w-[300px] mx-auto my-3" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="100%" height="100%" fill="transparent"/><polygon points="50,145 210,145 175,55 85,55" fill="#e0f2fe" stroke="#0f172a" stroke-width="1.8" stroke-linejoin="round"/><line x1="85" y1="100" x2="175" y2="100" stroke="#dc2626" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="4 3"/><text x="130" y="158" text-anchor="middle" font-size="11" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#0369a1">a</text><text x="130" y="48" text-anchor="middle" font-size="11" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#0369a1">c</text><text x="38" y="100" text-anchor="end" font-size="11" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#059669">h</text><line x1="50" y1="145" x2="50" y2="55" stroke="#059669" stroke-width="1.4" stroke-linecap="round"/><text x="130" y="104" text-anchor="middle" font-size="9" font-family="ui-sans-serif,system-ui" font-weight="700" fill="#dc2626">EF = (a+c)/2</text></svg><div class="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 mb-3 text-[12px] leading-relaxed">Paralel tabanlara komşu iç açılar toplamı 180°dir.</div>
    `
];
