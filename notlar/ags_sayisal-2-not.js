// notlar/ags_sayisal-2-not.js - Grafik ve Tablo Yorumlama
window.ags_sayisal_2_notlari = [
    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 font-black text-sm uppercase tracking-wider">
            GRAFİK TÜRLERİ
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3">
        <li><b>Sütun grafik</b> kategorik karşılaştırmada yükseklik niceliği gösterir.</li>
<li><b>Çizgi grafik</b> zamana bağlı değişim ve eğilimi (artış-azalış) izletir.</li>
<li><b>Daire (pasta) grafik</b> bir bütünün yüzde paylarını merkez açı veya alanla verir.</li>
<li><b>Tablo</b>, satır-sütun kesişiminde ham veya özet veri sunar; toplam ve yüzde türetilir.</li>
<li><b>Histogram</b> sürekli veriyi aralıklara böler; sütun grafikten farkı aralık (sınıf) kullanmasıdır.</li>

    </ul>
    <div class="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 mt-3"><p class="text-[11px] leading-relaxed text-amber-900 dark:text-amber-200">⚠️ <b>Sınav:</b> Pasta dilimleri toplamı yüzde 100 olmalıdır. Payları toplayıp 100 etmeyen şekil hatalı veya yuvarlatılmıştır.</p></div>
    `,
    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200 font-black text-sm uppercase tracking-wider">
            OKUMA VE HESAP
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3">
        <li><b>Mutlak değişim</b> son eksi ilk; <b>bağıl (yüzde) değişim</b> (son-ilk)/ilk x 100.</li>
<li><b>Ortalama</b>, toplamın adede bölümü; <b>medyan</b> sıralı dizinin ortası, uç değerden az etkilenir.</li>
<li><b>Pay karşılaştırması</b> aynı bütünden; farklı bütünlerin yüzdeleri doğrudan kıyaslanamaz.</li>
<li><b>Eksen ölçeği</b> sıfırdan başlamıyorsa görsel fark abartılır; okuma yanıltıcı olabilir.</li>
<li><b>Çift eksen</b> iki niceliği birlikte gösterir; birimleri karıştırılmamalıdır.</li>

    </ul>
    
    `,
    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-900/50 text-stone-800 dark:text-stone-200 font-black text-sm uppercase tracking-wider">
            YORUM TUZAKLARI
        </span>
    </div>
    <ul class="list-disc list-inside space-y-1.5 text-xs mb-3">
        <li><b>Korelasyon nedensellik değildir</b>; birlikte değişim neden-sonuç kanıtı sayılmaz.</li>
<li><b>Eksik kategori</b> veya yığılmış diğer dilimi, küçük payları gizleyebilir.</li>
<li><b>Yuvarlama</b> yüzde toplamını 99 veya 101 yapabilir; kaba hata ile karıştırılmamalıdır.</li>
<li><b>Baz yıl</b> endekste 100 kabul edilen yıldır; sonraki değerler buna göredir.</li>
<li>Soru hangisi kesin olarak söylenebilir derse, grafikte görünmeyen neden yorumlanmaz.</li>

    </ul>
    
    `
];
