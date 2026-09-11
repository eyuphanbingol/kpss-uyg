// notlar/muhasebe-7-not.js - Mali Tablolar Analizi
window.muhasebe_7_notlari = [
    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 font-black text-sm uppercase tracking-wider">
            TEKNİKLER
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3">
        <li>Karşılaştırmalı tablolar, <b>yatay analiz</b> (yıllar % değişim), <b>dikey analiz</b> (yüzde yöntem, kalem/toplam), <b>trend</b>.</li>
<li>Oran grupları: likidite, faaliyet (devir), mali yapı, kârlılık.</li>
<li>Nakit akış tablosu analizle tamamlanır.</li>
<li>Sektör karşılaştırması olmadan oran yanıltır.</li>
<li>Enflasyon ve sezonluk sapmalar dikey-yatayı bozar.</li>

    </ul>
    
    `,
    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 font-black text-sm uppercase tracking-wider">
            LİKİDİTE VE FAALİYET
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3">
        <li><b>Cari oran</b> = dönen varlık / KVYK; kural of thumb ≈ 1,5-2 (sektöre göre).</li>
<li><b>Asit test (likidite oranı)</b> = (dönen − stoklar) / KVYK veya (hazır değer + menkul + alacak) / KVYK.</li>
<li><b>Nakit oranı</b> = (hazır değer + menkul) / KVYK.</li>
<li>Stok, alacak, borç, aktif <b>devir hızları</b>; devir süresi 365/devir.</li>
<li>Alacak tahsil süresi + stok süresi − borç ödeme = nakit döngüsü.</li>

    </ul>
    <div class="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 mt-3"><p class="text-[11px] leading-relaxed text-amber-900 dark:text-amber-200">⚠️ <b>Sınav:</b> Cari oran stokları içerir; asit test stokları (ve çoğu kez peşin giderleri) çıkarır. 2 ile 1 kuralı ezber ama sektör şart.</p></div>
    `,
    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200 font-black text-sm uppercase tracking-wider">
            YAPI VE KÂRLILIK
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3">
        <li>Kaldıraç = yabancı kaynak / aktif; özkaynak oranı = ÖK / aktif.</li>
<li>Finansal kaldıraç ÖK kârlılığını faiz yoluyla büyütür/riskler.</li>
<li>Net kâr marjı, aktif kârlılığı (ROA), özkaynak kârlılığı (ROE), DuPont.</li>
<li>Faiz karşılama = FAVÖK veya faaliyet kârı / faiz.</li>
<li>Yatay analizde baz yıl 100.</li>

    </ul>
    <div class="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 mt-3"><p class="text-[11px] leading-relaxed text-amber-900 dark:text-amber-200">⚠️ <b>Sınav:</b> ROA = net kâr/aktif; ROE = net kâr/özkaynak. Kaldıraç ROE'yi ROA'dan ayırır.</p></div>
    `
];
