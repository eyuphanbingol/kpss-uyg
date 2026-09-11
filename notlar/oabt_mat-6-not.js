// notlar/oabt_mat-6-not.js - Olasılık
window.oabt_mat_6_notlari = [
    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 font-black text-sm uppercase tracking-wider">
            UZAY VE OLÇÜ
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3">
        <li><b>Olasılık uzayı</b> (Ω,F,P); P(Ω)=1, sayılabilir katkısızlık.</li>
<li><b>Rassal değişken</b> ölçülebilir fonksiyon; dağılım fonksiyonu F sağdan sürekli, monoton.</li>
<li><b>Kesikli</b> PMF, <b>sürekli</b> PDF; karışım dağılımları.</li>
<li><b>Beklenen değer</b> E[g(X)]=∫ g dP; varyans E[X^2]-(E X)^2.</li>
<li><b>Bağımsızlık</b> sigma cebirlerinin çarpımı; Cov=0 bağımsızlık gerektirmez.</li>

    </ul>
    <div class="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 mt-3"><p class="text-[11px] leading-relaxed text-amber-900 dark:text-amber-200">⚠️ <b>Sınav:</b> Korelasyonsuzluk bağımsızlık değildir; ortak Gauss ise ikisi denkleşir.</p></div>
    `,
    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-100 dark:bg-violet-900/50 text-violet-800 dark:text-violet-200 font-black text-sm uppercase tracking-wider">
            KOŞUL VE LİMİT
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3">
        <li><b>Bayes</b> P(H|D)=P(D|H)P(H)/P(D); toplam olasılık payda.</li>
<li><b>Koşullu beklenen</b> E[X|G] projeksiyon (L2).</li>
<li><b>KKT</b> (Chebyshev) kuyruk; <b>Chernoff</b> üstel moment.</li>
<li><b>Büyük sayılar</b> zayıf/güçlü: örneklem ortalaması μ'ye.</li>
<li><b>Merkezi limit</b> (CLT) normalize toplam → N(0,1) (Lindeberg koşulları).</li>

    </ul>
    
    `,
    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 font-black text-sm uppercase tracking-wider">
            SÜREÇ VE AİLE
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3">
        <li><b>Bernoulli-Binom-Poisson</b> limit ilişkisi; Poisson nadir olay.</li>
<li><b>Üstel</b> belleksiz; Poisson süreç ara zamanı.</li>
<li><b>Normal</b> toplamların limiti; standartlaştırma z=(x-μ)/σ.</li>
<li><b>Moment üreten</b> M(t)=E[e^{tX}] dağılımı (varsa) karakterize eder.</li>
<li><b>Markov eşitsizliği</b> P(X≥a)≤E X/a (X≥0).</li>

    </ul>
    
    `
];
