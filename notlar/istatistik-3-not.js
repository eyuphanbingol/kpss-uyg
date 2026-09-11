// notlar/istatistik-3-not.js - Olasılık ve Dağılımlar
window.istatistik_3_notlari = [
    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 font-black text-sm uppercase tracking-wider">
            OLASILIK
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3">
        <li>Klasik, göreli frekans, öznel olasılık; 0≤P≤1.</li>
<li>Toplama: P(A∪B)=P(A)+P(B)−P(A∩B); bağımsızda çarpma P(A)P(B).</li>
<li><b>Koşullu</b> P(A|B)=P(A∩B)/P(B); <b>Bayes</b> teoremi.</li>
<li>Ayrık olaylarda P(A∪B)=P(A)+P(B).</li>
<li>Tümleyen P(A')=1−P(A).</li>

    </ul>
    
    `,
    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200 font-black text-sm uppercase tracking-wider">
            KESİKLİ DAĞILIM
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3">
        <li><b>Binom</b>: n bağımsız Bernoulli, p sabit; E=np, V=npq.</li>
<li><b>Poisson</b>: nadir olay, λ; Poisson binoma yaklaşır (n büyük p küçük).</li>
<li><b>Hipergeometrik</b>: sonlu anakütle, iadesiz.</li>
<li>Üstel: Poisson süreç bekleme süresi (sürekli).</li>
<li>Bernoulli n=1 binom.</li>

    </ul>
    <div class="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 mt-3"><p class="text-[11px] leading-relaxed text-amber-900 dark:text-amber-200">⚠️ <b>Sınav:</b> Binom iadeli/bağımsız; hipergeometrik iadesiz. Poisson sayım, üstel süre. Karıştırılmasın.</p></div>
    `,
    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 font-black text-sm uppercase tracking-wider">
            NORMAL
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3">
        <li><b>Normal</b> çan, simetrik, μ ve σ; <b>standart normal</b> z, μ=0 σ=1.</li>
<li>68-95-99,7 kuralı.</li>
<li>Merkezi limit teoremi: n büyükken x̄ yaklaşık normal.</li>
<li>Binom normal yaklaşımı np ve nq ≥ 5 (kural of thumb).</li>
<li>Standartlaştırma z=(x−μ)/σ.</li>

    </ul>
    <div class="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 mt-3"><p class="text-[11px] leading-relaxed text-amber-900 dark:text-amber-200">⚠️ <b>Sınav:</b> Standart normalde alan 1, P(Z&gt;0)=0,5. μ değişince eğri kayar, σ artınca yayılır.</p></div>
    `
];
