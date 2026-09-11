// notlar/istatistik-5-not.js - Regresyon ve Zaman Serileri
window.istatistik_5_notlari = [
    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-100 dark:bg-violet-900/50 text-violet-800 dark:text-violet-200 font-black text-sm uppercase tracking-wider">
            KORELASYON VE REGRESYON
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3">
        <li><b>Korelasyon</b> r ∈ [−1,1] doğrusal ilişki yön ve şiddet; nedensellik değildir.</li>
<li><b>Basit doğrusal regresyon</b> Y = β0 + β1X + ε; <b>en küçük kareler</b>.</li>
<li>β1 = Cov(X,Y)/Var(X); r ile işaret aynı.</li>
<li><b>R²</b> açıklanan varyans oranı; çoklu regresyonda düzeltilmiş R².</li>
<li>Varsayımlar: doğrusallık, bağımsızlık, homoskedastisite, normal hata.</li>

    </ul>
    <div class="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 mt-3"><p class="text-[11px] leading-relaxed text-amber-900 dark:text-amber-200">⚠️ <b>Sınav:</b> Yüksek r nedensellik değildir. Sahte korelasyon zaman serisinde trendden doğar.</p></div>
    `,
    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200 font-black text-sm uppercase tracking-wider">
            ÇOKLU VE SAPMA
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3">
        <li>Çoklu doğrusal bağlantı (VIF); değişken seçimi.</li>
<li>Artık analizi, Durbin-Watson otokorelasyon.</li>
<li>Tahmin aralığı vs güven aralığı (ortalama yanıt).</li>
<li>Kukla değişken nitel X.</li>
<li>Log-doğrusal esneklik yorumu.</li>

    </ul>
    
    `,
    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-900/50 text-stone-800 dark:text-stone-200 font-black text-sm uppercase tracking-wider">
            ZAMAN SERİSİ
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3">
        <li>Bileşenler: <b>trend, mevsim, konjonktür, düzensiz</b>.</li>
<li>Hareketli ortalama mevsimsel düzeltme.</li>
<li>Toplamsal vs çarpımsal model.</li>
<li>Mevsim indeksi, konjonktür çevrimi.</li>
<li>Naif tahmin, üssel düzgünleştirme kavramı.</li>

    </ul>
    <div class="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 mt-3"><p class="text-[11px] leading-relaxed text-amber-900 dark:text-amber-200">⚠️ <b>Sınav:</b> Mevsim düzenli yıl içi; konjonktür çok yıllık çevrim. Trend uzun dönem yön.</p></div>
    `
];
