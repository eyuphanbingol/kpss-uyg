// notlar/cografya-22-not.js - TÜRKİYE'NİN EKONOMİK COĞRAFYASI (ENERJİ KAYNAKLARI)
(function () {
    function harita(src, alt) {
        return '<div class="mt-4 overflow-hidden rounded-xl border border-blue-200 dark:border-blue-700/50 bg-white dark:bg-slate-800 p-2">' +
            '<img src="./src/img/' + src + '?v=1" alt="' + alt + ' Haritası" class="w-full h-auto rounded-lg object-contain" loading="lazy">' +
            "</div>";
    }

    window.cografya_22_notlari = [
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-black text-sm uppercase tracking-wider">
            ⚡ ENERJİ KAYNAKLARI — YENİLENMEYEN
        </span>
    </div>
    <div class="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Yenilenmeyen (non-renewable) kaynaklar: taş kömürü, linyit, petrol, doğal gaz, asfaltit.</li>
            <li>Yenilenebilir (renewable) kaynaklar: hidroelektrik, rüzgâr, güneş, jeotermal, biyokütle; nükleer ayrı bir başlıkta işlenir.</li>
        </ul>
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 font-black text-sm uppercase tracking-wider">
            ⚡ TAŞ KÖMÜRÜ
        </span>
    </div>
    <div class="bg-stone-50 dark:bg-stone-900/30 p-4 rounded-xl border border-stone-200 dark:border-stone-700 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>I. Jeolojik (Karbonifer) dönemde oluşmuştur.</li>
            <li>Türkiye'deki rezervinin yaklaşık %100'ü <b>Batı Karadeniz</b>'den çıkarılır.</li>
            <li>Başlıca yerler: <b>Zonguldak</b> (Kozlu, Karadon), <b>Bartın</b> (Amasra).</li>
            <li>Başlıca kullanım alanı: elektrik üretimi. Rezervi azdır.</li>
        </ul>
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 font-black text-sm uppercase tracking-wider">
            ⚡ LİNYİT
        </span>
    </div>
    <div class="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Kalitesiz (alt kalorili) bir kömür türüdür; Türkiye'de yaygın bulunur.</li>
            <li>III. Jeolojik zamanda oluşmuştur.</li>
            <li>Başlıca kullanım alanı: elektrik üretimi.</li>
            <li>Türkiye'nin en büyük linyit santrali <b>Afşin-Elbistan</b> (Kahramanmaraş) Termik Santrali'dir.</li>
        </ul>
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black text-yellow-300 font-black text-sm uppercase tracking-wider">
            ⚡ PETROL
        </span>
    </div>
    <div class="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800/40 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Türkiye, petrol ihtiyacının yaklaşık <b>%90'ını ithal</b> eder.</li>
            <li>Ülkemizde ilk petrol <b>Batman</b>'da bulunmuştur.</li>
            <li><b>Başlıca rafineriler:</b> İzmit (SİPRAŞ / Tüpraş), İzmir (Aliağa), Batman.</li>
            <li><b>Petrol boru hatları:</b> Bakü-Tiflis-Ceyhan (BTC); Kerkük-Yumurtalık (Irak).</li>
        </ul>
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-100 dark:bg-sky-900/50 text-sky-800 dark:text-sky-200 font-black text-sm uppercase tracking-wider">
            ⚡ DOĞAL GAZ
        </span>
    </div>
    <div class="bg-sky-50 dark:bg-sky-900/20 p-4 rounded-xl border border-sky-100 dark:border-sky-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Türkiye, doğal gaz ihtiyacının yaklaşık <b>%99,98'ini ithal</b> eder (dışa bağımlılık çok yüksektir).</li>
            <li>Türkiye'de doğal gaz bulunan ilk sahanın adı <b>Tuna-1</b>'dir.</li>
            <li>Başlıca kullanım: elektrik üretimi. Bu amaçla kurulan ilk santrallerden biri <b>Bursa (Ovaakça)</b> Doğal Gaz Kombine Çevrim Santrali'dir.</li>
            <li><b>Batı Hattı:</b> Rusya · <b>Doğu Hattı:</b> İran</li>
            <li><b>Mavi Akım (Blue Stream):</b> Rusya; Karadeniz altından <b>Samsun</b>'a ulaşır.</li>
            <li><b>Türk Akımı (TurkStream):</b> Rusya; Avrupa'nın gaz ihtiyacı için Türkiye üzerinden geçer.</li>
            <li><b>Bakü-Tiflis-Erzurum (BTE):</b> Azerbaycan.</li>
            <li><b>TANAP:</b> Azerbaycan gazını Avrupa'ya taşımak üzere Türkiye'den geçen hattır (kaynak İran değildir).</li>
        </ul>
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 font-black text-sm uppercase tracking-wider">
            ⚡ ASFALTİT
        </span>
    </div>
    <div class="bg-neutral-50 dark:bg-neutral-800/40 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Katı petrol olarak da bilinir; yenilenmeyen kaynaktır.</li>
            <li>Türkiye'de <b>Şırnak (Silopi)</b> civarında bulunur.</li>
            <li>Başlıca kullanım alanı: elektrik üretimi.</li>
        </ul>
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 font-black text-sm uppercase tracking-wider">
            ⚡ HİDROELEKTRİK
        </span>
    </div>
    <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li><b>Potansiyelin en fazla olduğu bölge:</b> Doğu Anadolu.</li>
            <li><b>Üretimin en fazla olduğu bölge:</b> Güneydoğu Anadolu.</li>
            <li><b>Potansiyel ve üretimin en az olduğu bölge:</b> Marmara.</li>
            <li><b>Dicle:</b> Devegeçidi, Kralkızı, Ilısu</li>
            <li><b>Fırat:</b> Atatürk, Karakaya, Keban, Birecik</li>
            <li><b>Kızılırmak:</b> Altınkaya, Kesikköprü</li>
            <li><b>Çoruh:</b> Deriner, Yusufeli</li>
            <li><b>Yeşilırmak:</b> Hasan Uğurlu, Suat Uğurlu</li>
        </ul>
        ` + harita("enerji_hes.jpg", "Akarsular ve HES / barajlar") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-100 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-200 font-black text-sm uppercase tracking-wider">
            ⚡ RÜZGÂR ENERJİSİ
        </span>
    </div>
    <div class="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-xl border border-cyan-100 dark:border-cyan-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Türkiye'nin ilk rüzgâr santrali: <b>İzmir, Çeşme-Alaçatı</b>.</li>
            <li>Potansiyel ve üretim sıralaması: <b>Ege > Marmara > Akdeniz</b>.</li>
            <li>Üretim, rüzgâr hızı ve sürekliliğinden doğrudan etkilenir.</li>
            <li>Temiz kaynaktır; kuş göç yolları üzerine kurulanlar kuşlara zarar verebilir.</li>
        </ul>
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-yellow-100 dark:bg-yellow-900/40 text-yellow-900 dark:text-yellow-100 font-black text-sm uppercase tracking-wider">
            ⚡ GÜNEŞ ENERJİSİ
        </span>
    </div>
    <div class="bg-yellow-50 dark:bg-yellow-900/15 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800/40 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Türkiye'nin ilk güneş tarlası (GES): <b>Şanlıurfa (Birecik)</b>.</li>
            <li>Türkiye'nin en büyük GES: <b>Konya (Karapınar)</b>.</li>
            <li>İlk kule tipi güneş enerji santrali: <b>Mersin</b>.</li>
            <li>Potansiyelin en fazla olduğu bölge: <b>Güneydoğu Anadolu</b>; en az: <b>Doğu Karadeniz</b>.</li>
        </ul>
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-200 font-black text-sm uppercase tracking-wider">
            ⚡ JEOTERMAL ENERJİ
        </span>
    </div>
    <div class="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-xl border border-rose-100 dark:border-rose-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Potansiyelin en fazla olduğu bölge: <b>Ege</b> (kırıklı yer yapısı ve aktif fay hatları).</li>
            <li>Üretim iklim koşullarından etkilenmez; sürekli ve güvenilir kaynaktır.</li>
            <li>Başlıca santraller: <b>Aydın-Germencik</b>, <b>Denizli-Sarayköy</b>.</li>
        </ul>
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-lime-100 dark:bg-lime-900/50 text-lime-800 dark:text-lime-200 font-black text-sm uppercase tracking-wider">
            ⚡ BİYOKÜTLE ENERJİSİ
        </span>
    </div>
    <div class="bg-lime-50 dark:bg-lime-900/20 p-4 rounded-xl border border-lime-100 dark:border-lime-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Evsel, hayvansal ve bitkisel atıkların katı, sıvı veya gaz hâline dönüştürülerek enerji elde edilmesidir.</li>
            <li>Yenilenebilir enerji kaynakları arasında yer alır.</li>
        </ul>
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-100 dark:bg-violet-900/50 text-violet-800 dark:text-violet-200 font-black text-sm uppercase tracking-wider">
            ⚡ NÜKLEER ENERJİ
        </span>
    </div>
    <div class="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-xl border border-violet-100 dark:border-violet-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Uranyum ve toryum gibi radyoaktif elementlerden elde edilir.</li>
            <li>Türkiye'nin ilk NGS: <b>Mersin (Akkuyu)</b> — inşaatı devam etmektedir.</li>
            <li><b>Sinop:</b> inşaat çalışmaları devam etmektedir.</li>
            <li><b>Kırklareli (İğneada):</b> planlama aşamasındadır; işletmede değildir.</li>
        </ul>
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 font-black text-sm uppercase tracking-wider">
            ⚡ ELEKTRİK ÜRETİM SIRASI
        </span>
    </div>
    <div class="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30 text-sm w-full">
        <ol class="list-decimal list-inside space-y-1 text-xs font-semibold">
            <li>Kömür (linyit + taş kömürü)</li>
            <li>Hidrolik (su)</li>
            <li>Doğal gaz</li>
            <li>Rüzgâr</li>
            <li>Güneş</li>
            <li>Jeotermal</li>
            <li>Diğer (biyokütle, asfaltit vb.)</li>
        </ol>
        <p class="text-xs mt-3">Elektrik üretiminde hem yenilenebilir hem yenilenemeyen kaynaklardan yararlanılır.</p>
    </div>
    `
    ];
})();
