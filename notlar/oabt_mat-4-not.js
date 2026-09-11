// notlar/oabt_mat-4-not.js - Lineer Cebir
window.oabt_mat_4_notlari = [
    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 font-black text-sm uppercase tracking-wider">
            VEKTÖR UZAYI
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3">
        <li><b>Vektör uzayı</b> cisim üzerinde toplama ve skaler çarpma aksiyomları.</li>
<li><b>Taban ve boyut</b> lineer bağımsız üreteç; boyut iyi tanımlıdır.</li>
<li><b>Alt uzay</b> toplam ve skalerle kapalı; kesişim alt uzay, birleşim genelde değil.</li>
<li><b>Satır-sütun uzayı</b> rank(A)=boyut sütun uzayı; rank-nullity: rank+nullity=n.</li>
<li><b>İç çarpım</b> Cauchy-Schwarz; ortonormal taban Gram-Schmidt.</li>

    </ul>
    <div class="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 mt-3"><p class="text-[11px] leading-relaxed text-amber-900 dark:text-amber-200">⚠️ <b>Sınav:</b> Satır sayısı kadar bağımsız sütun olmak zorunda değildir; rank min(m,n) ile sınırlıdır.</p></div>
    `,
    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-100 dark:bg-violet-900/50 text-violet-800 dark:text-violet-200 font-black text-sm uppercase tracking-wider">
            MATRİS DİYAGONAL
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3">
        <li><b>Lineer dönüşüm</b> T(u+v)=T(u)+T(v), T(cu)=cT(u); matris temsili tabana bağlıdır.</li>
<li><b>Determinant</b> hacim ölçeği; det=0 ⇔ tekil ⇔ 0 özdeğer.</li>
<li><b>Özdeğer-özvektör</b> Av=λv, v≠0; karakteristik polinom det(A-λI)=0.</li>
<li><b>Köşegenleştirme</b> n bağımsız özvektör; simetrik reel matris ortogonal köşegenleşir.</li>
<li><b>Jordan</b> formu özvektör yetmezse zincir; minimal polinom en küçük yok eden.</li>

    </ul>
    
    `,
    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 font-black text-sm uppercase tracking-wider">
            SİSTEM VE BİÇİM
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3">
        <li><b>Ax=b</b> tutarlı ⇔ b sütun uzayında; genel çözüm özel + homojen.</li>
<li><b>Ters matris</b> A A^{-1}=I; (AB)^{-1}=B^{-1}A^{-1}.</li>
<li><b>İz</b> (trace) benzerlikte korunur; iz=özdeğerler toplamı.</li>
<li><b>Pozitif tanımlı</b> x^T A x&gt;0 (x≠0); simetrik ve özdeğerler pozitif.</li>
<li><b>SVD</b> A=UΣV^T; rank, en küçük kareler ve koşul sayısı.</li>

    </ul>
    
    `
];
