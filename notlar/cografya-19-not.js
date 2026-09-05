// notlar/cografya-19-not.js - TÜRKİYE'DE TARIM (BÖLGELERE GÖRE TARIM ÜRÜNLERİ)
(function () {
    function harita(src, alt) {
        return '<div class="mt-4 overflow-hidden rounded-xl border border-blue-200 dark:border-blue-700/50 bg-white dark:bg-slate-800 p-2">' +
            '<img src="./src/img/' + src + '?v=5" alt="' + alt + ' Haritası" class="w-full h-auto rounded-lg object-contain" loading="lazy">' +
            "</div>";
    }

    window.cografya_19_notlari = [
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 font-black text-sm uppercase tracking-wider">
            🌿 EGE BÖLGESİ TARIM ÜRÜNLERİ - ZEYTİN
        </span>
    </div>
    <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Akdeniz ikliminin göstergesi olan önemli bir tarım ürünüdür.</li>
            <li>Güneydoğu Anadolu'nun batısından itibaren Akdeniz, Ege ve Marmara bölgelerinde yetişir.</li>
            <li>En fazla <b>Manisa ve İzmir</b> çevresinde üretilir.</li>
        </ul>
        ` + harita("zeytin.png", "ZEYTİN") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-black text-sm uppercase tracking-wider">
            🍇 EGE BÖLGESİ TARIM ÜRÜNLERİ - ÜZÜM
        </span>
    </div>
    <div class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Düşük kış sıcaklıklarına dayanıklı olup iklim seçiciliği azdır.</li>
            <li>Kuru ve yaş olarak tüketilmektedir.</li>
            <li>En fazla üretim, <b>Ege'de Manisa</b> çevresinde yapılmaktadır.</li>
            <li>Volkanik arazileri sever.</li>
        </ul>
        ` + harita("üzüm.png", "ÜZÜM") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 font-black text-sm uppercase tracking-wider">
            🌸 EGE BÖLGESİ TARIM ÜRÜNLERİ - HAŞHAŞ
        </span>
    </div>
    <div class="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Devlet kontrolünde yetiştirilir.</li>
            <li>Üretimi en çok <b>Batı Anadolu'da</b> yapılmaktadır.</li>
            <li>Doğu Karadeniz kıyı kuşağı dışındaki her yerde yetişebilir; ancak uyuşturucu madde içerdiğinden ekimine izin verilmemektedir.</li>
            <li>Fabrikası <b>Afyonkarahisar'ın Bolvadin</b> ilçesinde bulunur.</li>
        </ul>
        ` + harita("hashas.png", "HAŞHAŞ") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 font-black text-sm uppercase tracking-wider">
            🚬 EGE BÖLGESİ TARIM ÜRÜNLERİ - TÜTÜN
        </span>
    </div>
    <div class="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Önemli bir sanayi bitkisidir.</li>
            <li>İklim seçiciliğinden ziyade toprak seçiciliği vardır.</li>
            <li>En fazla üretimi <b>Ege Bölgesi'nde</b> gerçekleşmektedir.</li>
            <li>Üretimi suya ihtiyaç duymamaktadır.</li>
        </ul>
        ` + harita("tütün.png", "TÜTÜN") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 font-black text-sm uppercase tracking-wider">
            🍐 EGE BÖLGESİ TARIM ÜRÜNLERİ - İNCİR
        </span>
    </div>
    <div class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-100 dark:border-yellow-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Kış ılıklığı isteyen bir tarım ürünüdür.</li>
            <li><b>Aydın</b> çevresinin monokültür bitkisidir.</li>
            <li>Üretiminde Türkiye dünya birincisidir.</li>
        </ul>
        ` + harita("incir.png", "İNCİR") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-black text-sm uppercase tracking-wider">
            🌾 EGE BÖLGESİ TARIM ÜRÜNLERİ - SUSAM
        </span>
    </div>
    <div class="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-xl border border-teal-100 dark:border-teal-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Pastacılıkta ve yağ üretiminde kullanılır.</li>
            <li>Ege başta olmak üzere Akdeniz'de ve Çukurova çevresinde yoğun olarak üretilir.</li>
        </ul>
        ` + harita("susam.png", "SUSAM") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 font-black text-sm uppercase tracking-wider">
            🌹 AKDENİZ BÖLGESİ TARIM ÜRÜNLERİ - GÜL
        </span>
    </div>
    <div class="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-xl border border-pink-100 dark:border-pink-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>En fazla Akdeniz'de <b>Isparta</b> çevresinde (Göller Yöresi) yetiştirilir.</li>
            <li>Önemli bir sanayi ürünüdür (gülyağı, kozmetik vb.).</li>
        </ul>
        ` + harita("gül.png", "GÜL") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 font-black text-sm uppercase tracking-wider">
            🍌 AKDENİZ BÖLGESİ TARIM ÜRÜNLERİ - MUZ
        </span>
    </div>
    <div class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-100 dark:border-yellow-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Akdeniz'de mikroklima alanlarında üretilmeye başlanan tropikal bir bitkidir.</li>
            <li><b>Antalya, Mersin, Adana ve Hatay</b> illerinde üretilmektedir.</li>
            <li>İthalatı da yapılmaktadır (yerli üretim talebi karşılamamaktadır).</li>
        </ul>
        ` + harita("muz.png", "MUZ") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 font-black text-sm uppercase tracking-wider">
            🥜 AKDENİZ BÖLGESİ TARIM ÜRÜNLERİ - YER FISTIĞI
        </span>
    </div>
    <div class="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Önemli bir yağlık bitkidir.</li>
            <li>Genellikle Akdeniz'de ikinci ürün olarak yaz sezonunda ekilir.</li>
            <li>Üretiminin büyük bölümü <b>Çukurova ve Osmaniye</b>'de gerçekleştirilir.</li>
        </ul>
        ` + harita("yer_fıstık.png", "YER FISTIĞI") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 font-black text-sm uppercase tracking-wider">
            🍎 AKDENİZ BÖLGESİ TARIM ÜRÜNLERİ - ELMA
        </span>
    </div>
    <div class="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>İklim seçiciliği az olduğundan her bölgede yetişebilen bir tarım ürünüdür.</li>
            <li>Başta <b>Isparta</b> olmak üzere <b>Antalya, Karaman ve Niğde</b> illerinde yoğun olarak üretilir.</li>
            <li>Önemli bir ihraç ürünüdür.</li>
        </ul>
        ` + harita("elma.png", "ELMA") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 font-black text-sm uppercase tracking-wider">
            🌿 AKDENİZ BÖLGESİ TARIM ÜRÜNLERİ - ANASON
        </span>
    </div>
    <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Tıpta ve alkollü içecekler sanayisinde kullanılan bir bitkidir.</li>
            <li>Üretimi <b>Konya, Göller Yöresi, İç Ege ve Antalya</b> bölümünde yoğun olarak yapılır.</li>
            <li><b>Burdur</b>'da da üretilir.</li>
        </ul>
        ` + harita("anason.png", "ANASON") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 font-black text-sm uppercase tracking-wider">
            🍊 AKDENİZ BÖLGESİ TARIM ÜRÜNLERİ - TURUNÇGİLLER (Narenciye)
        </span>
    </div>
    <div class="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Kış ılıklığı isteyen <b>limon, mandalina, greyfurt ve portakal</b>'ın genel adıdır.</li>
            <li>Mikroklima alanlarında <b>Rize</b> ve çevresinde de yetişir (Karadeniz'de).</li>
            <li>Önemli bir ihraç ürünüdür.</li>
        </ul>
        ` + harita("turunc.png", "TURUNÇGİL") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-black text-sm uppercase tracking-wider">
            🥬 AKDENİZ BÖLGESİ TARIM ÜRÜNLERİ - SEBZECİLİK
        </span>
    </div>
    <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Yaz aylarında taze sebze tüketilmesi amacıyla sulama ile yapılan tarım etkinliğidir.</li>
            <li><b>Akdeniz, Ege ve Güney Marmara</b>'da gelişmiştir.</li>
            <li>Konserve sanayisine ham madde sağlamaktadır.</li>
        </ul>
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 font-black text-sm uppercase tracking-wider">
            🌱 AKDENİZ BÖLGESİ TARIM ÜRÜNLERİ - SERACILIK (Örtü Altı Üretim)
        </span>
    </div>
    <div class="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-xl border border-cyan-100 dark:border-cyan-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Kış aylarında taze sebze tüketmek amacıyla yapılan tarım etkinliğidir.</li>
            <li>Güneşlenme ister.</li>
            <li>Kış ılıklığının en fazla yaşandığı <b>Akdeniz Bölgesi</b>'nde en gelişmiş durumdadır.</li>
            <li>Jeotermal enerji ile <b>Kırşehir, Konya ve Afyon</b> çevresinde de seracılık yapılmaktadır.</li>
        </ul>
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 font-black text-sm uppercase tracking-wider">
            🌾 GÜNEYDOĞU ANADOLU BÖLGESİ TARIM ÜRÜNLERİ - KIRMIZI MERCİMEK
        </span>
    </div>
    <div class="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Güneydoğu Anadolu Bölgesi'nin kurak ikliminde yetiştirilen tarım ürünüdür.</li>
            <li>Üretiminde <b>Güneydoğu Anadolu</b> birinci sıradadır.</li>
        </ul>
        ` + harita("kırmızı_mercimek.png", "KIRMIZI MERCİMEK") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 font-black text-sm uppercase tracking-wider">
            🌰 GÜNEYDOĞU ANADOLU BÖLGESİ TARIM ÜRÜNLERİ - ANTEP FISTIĞI
        </span>
    </div>
    <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Fındık ve zeytin ile birlikte iki yılda bir iyi ürün veren devirli (periyodik) tarım ürünleri grubunda yer alır.</li>
            <li>Üretiminde Türkiye, İran'dan sonra dünyada üçüncü sıradadır.</li>
            <li>Bölgenin endemik türüdür (en çok <b>Şanlıurfa</b> çevresinde).</li>
        </ul>
        ` + harita("antep_fıstık.png", "ANTEP FISTIĞI") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-black text-sm uppercase tracking-wider">
            🌿 GÜNEYDOĞU ANADOLU BÖLGESİ TARIM ÜRÜNLERİ - PAMUK
        </span>
    </div>
    <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Dünya üzerinde sulamanın geliştiği yerlerde üretimi yapılan, uzun yaz kuraklığı isteyen kısa yetişme dönemine sahip bir tarım ürünüdür.</li>
            <li>Üretimde <b>Şanlıurfa</b> birinci sıradadır; <b>Adana ve Aydın</b> da önemli üretim merkezleridir.</li>
        </ul>
        ` + harita("pamuk.png", "PAMUK") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 font-black text-sm uppercase tracking-wider">
            🍑 GÜNEYDOĞU ANADOLU BÖLGESİ TARIM ÜRÜNLERİ - KAYISI
        </span>
    </div>
    <div class="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>İklim seçiciliği azdır, her bölgede yetişir.</li>
            <li>En çok <b>Malatya ve Mersin</b> çevresinde üretilir.</li>
            <li>Önemli bir ihraç ürünüdür.</li>
        </ul>
        ` + harita("kayısı.png", "KAYISI") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 font-black text-sm uppercase tracking-wider">
            🌾 İÇ ANADOLU BÖLGESİ TARIM ÜRÜNLERİ - BUĞDAY
        </span>
    </div>
    <div class="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Türkiye'nin en fazla ekilen tarım ürünüdür.</li>
            <li>En fazla <b>Konya</b> ve çevresinde ekilir.</li>
            <li>Başta un ve makarna olmak üzere birçok sanayi kolunun ham maddesidir.</li>
        </ul>
        ` + harita("bugday.png", "BUĞDAY") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 font-black text-sm uppercase tracking-wider">
            🌾 İÇ ANADOLU BÖLGESİ TARIM ÜRÜNLERİ - ARPA
        </span>
    </div>
    <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Düşük kış sıcaklıklarına dayanıklıdır.</li>
            <li>Alkol (bira) ve hayvan yemi için ekilir.</li>
        </ul>
        ` + harita("arpa.png", "ARPA") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 font-black text-sm uppercase tracking-wider">
            🌱 İÇ ANADOLU BÖLGESİ TARIM ÜRÜNLERİ - ŞEKER PANCARI
        </span>
    </div>
    <div class="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Sulama ister.</li>
            <li>Üretim tesisi yanında olmak zorundadır; çünkü kısa sürede bozulan bir tarım ürünüdür.</li>
            <li>Güneydoğu Anadolu'da kuraklık nedeniyle üretimi sınırlıdır.</li>
            <li>Başlıca üretim alanları: <b>Konya, Eskişehir, Kayseri</b>.</li>
        </ul>
        ` + harita("seker_pancar.png", "ŞEKER PANCARI") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-black text-sm uppercase tracking-wider">
            🌿 İÇ ANADOLU BÖLGESİ TARIM ÜRÜNLERİ - ASPİR
        </span>
    </div>
    <div class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Yağ elde edilen, kısa dönemde yetişebilen, kuraklığa dayanıklı bir tarım ürünüdür.</li>
            <li>İç Anadolu Bölgesi'nde <b>Ankara</b> başta olmak üzere (<b>Kayseri</b>'de de) ekilir.</li>
        </ul>
        ` + harita("aspir.png", "ASPİR") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 font-black text-sm uppercase tracking-wider">
            🥔 İÇ ANADOLU BÖLGESİ TARIM ÜRÜNLERİ - PATATES
        </span>
    </div>
    <div class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-100 dark:border-yellow-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Volkanik arazilerde daha iyi yetişir.</li>
            <li>Sanayide ham madde olarak kullanılır.</li>
            <li>En önemli üretim alanı <b>Niğde</b>; ardından <b>Kayseri</b> gelir.</li>
        </ul>
        ` + harita("patates.png", "PATATES") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-black text-sm uppercase tracking-wider">
            🌱 İÇ ANADOLU BÖLGESİ TARIM ÜRÜNLERİ - BAKLAGİLLER (Nohut, Yeşil Mercimek, Fasulye)
        </span>
    </div>
    <div class="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-xl border border-teal-100 dark:border-teal-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Bu üçüne verilen ortak isimdir.</li>
            <li><b>Yeşil Mercimek:</b> Kuraklık seven tarım ürünüdür. En çok <b>Yozgat</b> çevresinde üretilir.</li>
            <li><b>Fasulye:</b> Sulama ile yetişen bir üründür. Üretimde <b>Konya</b> başta gelir.</li>
            <li><b>Nohut:</b> Kuraklık seven bir tarım ürünüdür. Üretimde <b>Ankara</b> başta gelir.</li>
        </ul>
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 font-black text-sm uppercase tracking-wider">
            🌽 İÇ ANADOLU BÖLGESİ TARIM ÜRÜNLERİ - MISIR
        </span>
    </div>
    <div class="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>GAP ve KOP projeleri ile üretimi artmıştır.</li>
            <li>Ticarî yağlık mısır üretimi en fazla <b>Çukurova, Konya Ovası ve Şanlıurfa</b> çevresinde yapılmaktadır.</li>
        </ul>
        ` + harita("mısır.png", "MISIR") + `
    </div>
    `
    ];
})();
