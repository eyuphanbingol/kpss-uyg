// notlar/istatistik-2-not.js - Merkezi Eğilim ve Dağılım
window.istatistik_2_notlari = [
    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 font-black text-sm uppercase tracking-wider">
            MERKEZ
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3">
        <li><b>Aritmetik ortalama</b> tüm gözlem; aykırıya duyarlı.</li>
<li><b>Medyan</b> orta değer, aykırıya dirençli; <b>mod</b> en sık.</li>
<li><b>Geometrik ortalama</b> oran/indeks; <b>harmonik</b> hız, fiyat/miktar.</li>
<li>Ağırlıklı ortalama; gruplu veride sınıf orta noktası.</li>
<li>Sağa çarpık: ortalama &gt; medyan &gt; mod (tipik).</li>

    </ul>
    <div class="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 mt-3"><p class="text-[11px] leading-relaxed text-amber-900 dark:text-amber-200">⚠️ <b>Sınav:</b> Sağa (pozitif) çarpıklıkta kuyruk sağda, ortalama medyanın sağındadır. Tersini çeldirirler.</p></div>
    `,
    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 font-black text-sm uppercase tracking-wider">
            DAĞILIM
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3">
        <li>Değişim aralığı max−min; <b>çeyrek sapma</b>.</li>
<li><b>Varyans</b> sapma kareleri ortalaması; <b>standart sapma</b> karekök.</li>
<li>Örneklem varyansında n−1 (payda).</li>
<li><b>Varyasyon katsayısı</b> CV = s/x̄ karşılaştırma.</li>
<li>Standart sapma birimli; CV birimsiz yüzde.</li>

    </ul>
    
    `,
    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-100 dark:bg-violet-900/50 text-violet-800 dark:text-violet-200 font-black text-sm uppercase tracking-wider">
            KONUM
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3">
        <li>Çeyrekler Q1 Q2 Q3; IQR = Q3−Q1 aykırı kuralı 1,5 IQR.</li>
<li>Yüzdelik, kartil, desil.</li>
<li>Standartlaştırma z = (x−μ)/σ.</li>
<li>Chebyshev eşitsizliği dağılımdan bağımsız alt sınır.</li>
<li>Ortalama mutlak sapma medyan etrafında da tanımlanır.</li>

    </ul>
    <div class="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 mt-3"><p class="text-[11px] leading-relaxed text-amber-900 dark:text-amber-200">⚠️ <b>Sınav:</b> Örneklem varyansı n−1 ile bölünür (yansız); anakütle N ile. Payda tuzağı.</p></div>
    `
];
