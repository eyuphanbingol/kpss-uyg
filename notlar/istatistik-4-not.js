// notlar/istatistik-4-not.js - Örnekleme Tahmin ve Hipotez
window.istatistik_4_notlari = [
    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200 font-black text-sm uppercase tracking-wider">
            ÖRNEKLEME
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3">
        <li><b>Basit tesadüfi</b>, <b>sistematik</b>, <b>tabakalı</b>, <b>küme</b> örneklemesi.</li>
<li>Tabakalı homojen tabakalarda varyansı düşürür; küme maliyeti düşürür, hata artabilir.</li>
<li>Örnekleme dağılımı: x̄'nin dağılımı, SE = σ/√n.</li>
<li>Sonlu anakütle düzeltmesi n/N büyükken.</li>
<li>Yanıtlamama yanlılığı tesadüfi olmayan hatadır.</li>

    </ul>
    <div class="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 mt-3"><p class="text-[11px] leading-relaxed text-amber-900 dark:text-amber-200">⚠️ <b>Sınav:</b> Tabakalı her tabakadan; küme kümeleri rastgele seçer tüm birimleri alır. ÖSYM çevirir.</p></div>
    `,
    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 font-black text-sm uppercase tracking-wider">
            TAHMİN
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3">
        <li><b>Nokta tahmini</b> tek değer; <b>aralık</b> güven aralığı.</li>
<li>Güven aralığı x̄ ± z (veya t) × SE; güven düzeyi 1−α.</li>
<li>σ bilinmiyorsa t, n−1 sd.</li>
<li>Oran tahmini p̂ ± z√(p̂q̂/n).</li>
<li>Yansızlık, etkinlik, tutarlılık tahminci özellikleri.</li>

    </ul>
    
    `,
    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 font-black text-sm uppercase tracking-wider">
            HİPOTEZ
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3">
        <li><b>H0</b> yokluk, <b>H1</b> karşıt.</li>
<li><b>Tip I</b> α: doğru H0'ı reddetme; <b>Tip II</b> β: yanlış H0'ı tutma.</li>
<li>Güç = 1−β; p-değeri.</li>
<li>z, t, ki-kare, F testleri.</li>
<li>Tek/çift kuyruk; eşleştirilmiş t, bağımsız t.</li>

    </ul>
    <div class="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 mt-3"><p class="text-[11px] leading-relaxed text-amber-900 dark:text-amber-200">⚠️ <b>Sınav:</b> Tip I α anlamlılık düzeyi; Tip II β güçle ters. H0'ı kabul etmek değil, reddedememek denir.</p></div>
    `
];
