// notlar/oabt_mat-7-not.js - İstatistik
window.oabt_mat_7_notlari = [
    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 font-black text-sm uppercase tracking-wider">
            TAHMİN
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3">
        <li><b>Nokta tahmini</b> yansızlık E[θ̂]=θ; tutarlılık olasılıkta yakınsama.</li>
<li><b>MSE</b> = Var + yan^2; yanlı ama düşük MSE olabilir (ridge sezgisi).</li>
<li><b>Olabilirlik</b> L(θ|x); MLE L'yi (veya log L) en büyükler.</li>
<li><b>Yeterlilik</b> Fisher-Neyman çarpan; Rao-Blackwell varyansı düşürür.</li>
<li><b>Güven aralığı</b> tesadüfi aralık; %95 'parametre %95 olasılıkla içindedir' değil, yöntemin uzun vadeli kapsamasıdır.</li>

    </ul>
    <div class="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 mt-3"><p class="text-[11px] leading-relaxed text-amber-900 dark:text-amber-200">⚠️ <b>Sınav:</b> Güven aralığı parametreyi rastgele yapmaz; rastgele olan aralıktır. Klasik tuzak.</p></div>
    `,
    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 font-black text-sm uppercase tracking-wider">
            TEST
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3">
        <li><b>H0-H1</b>; I. tip α, II. tip β, güç=1-β.</li>
<li><b>p-değeri</b> H0 altında gözlenen kadar uç veri olasılığı; P(H0|veri) değildir.</li>
<li><b>Neyman-Pearson</b> basit H0-H1'de olabilirlik oranı en güçlü test.</li>
<li><b>t, z, ki-kare, F</b> varsayımları: normallik, bağımsızlık, varyans eşitliği.</li>
<li><b>Çoklu karşılaştırma</b> hata şişmesi; Bonferroni düzeltmesi.</li>

    </ul>
    
    `,
    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 font-black text-sm uppercase tracking-wider">
            MODEL VE REGRESYON
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3">
        <li><b>Doğrusal regresyon</b> Y=Xβ+ε; EKK, Gauss-Markov: BLUE (varsayımlarla).</li>
<li><b>R^2</b> açıklanan varyans; ek girdi R^2'yi düşürmez, düzeltilmiş R^2 cezalandırır.</li>
<li><b>Artık analizi</b> varsayım ihlali; heteroskedastisite.</li>
<li><b>ANOVA</b> grup ortalamaları; toplam kareler ayrışımı.</li>
<li><b>Bayesyen</b> prior-posterior; MLE asymptotic normal (düzenlilik).</li>

    </ul>
    
    `
];
