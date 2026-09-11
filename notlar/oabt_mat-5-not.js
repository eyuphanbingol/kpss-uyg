// notlar/oabt_mat-5-not.js - Diferansiyel Denklemler
window.oabt_mat_5_notlari = [
    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 font-black text-sm uppercase tracking-wider">
            BİRİNCİ MERTEBE
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3">
        <li><b>Sıradan DD</b> y'=f(x,y); varlık-teklik Lipschitz koşuluna bağlıdır.</li>
<li><b>Ayrılabilir</b> dy/g(y)=f(x)dx; <b>homojen</b> y=vx yerdeğiştirme.</li>
<li><b>Lineer</b> y'+P(x)y=Q(x); integre çarpan μ=e^{∫P dx}.</li>
<li><b>Tam diferansiyel</b> M dx+N dy=0, ∂M/∂y=∂N/∂x.</li>
<li><b>Bernoulli ve Riccati</b> yerdeğiştirme ile lineere indirgenebilir sınıflar.</li>

    </ul>
    <div class="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 mt-3"><p class="text-[11px] leading-relaxed text-amber-900 dark:text-amber-200">⚠️ <b>Sınav:</b> Varlık teklik: f ve ∂f/∂y sürekliyse yerel tek çözüm; Lipschitz yoksa teklik kaçabilir (y'=√|y|).</p></div>
    `,
    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 font-black text-sm uppercase tracking-wider">
            YÜKSEK MERTEBE SİSTEM
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3">
        <li><b>Sabit katsayılı lineer</b> karakteristik kök: gerçek, tekrar, karmaşık.</li>
<li><b>Belirsiz katsayılar ve parametre değişimi</b> homojen olmayan özel çözüm.</li>
<li><b>Wronskian</b> bağımsızlık; Abel formülü.</li>
<li><b>Sistem</b> x'=Ax; çözüm e^{At}v; özdeğer kararlılık (Reel kısım &lt;0).</li>
<li><b>Laplace dönüşümü</b> başlangıç değer problemlerini cebirle çözer.</li>

    </ul>
    
    `,
    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 font-black text-sm uppercase tracking-wider">
            KISMİ VE NİTEL
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3">
        <li><b>Isı, dalga, Laplace</b> denklemleri; ayrışım (değişkenlere ayırma).</li>
<li><b>Sınır-başlangıç</b> koşulları iyi konmuşluk (Hadamard).</li>
<li><b>Faz portresi</b> eyer, merkez, spiral; doğrusal olmayan için doğrusallaştırma.</li>
<li><b>Korunum</b> enerji yöntemleri; birinci integral.</li>
<li><b>Sayısal</b> Euler, RK4; kararlılık adım boyuna bağlıdır.</li>

    </ul>
    
    `
];
