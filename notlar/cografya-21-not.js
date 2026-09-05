// notlar/cografya-21-not.js - TÜRKİYE'DE MADENLER
(function () {
    function harita(src, alt) {
        return '<div class="mt-4 overflow-hidden rounded-xl border border-blue-200 dark:border-blue-700/50 bg-white dark:bg-slate-800 p-2">' +
            '<img src="./src/img/' + src + '?v=8" alt="' + alt + ' Haritası" class="w-full h-auto rounded-lg object-contain" loading="lazy">' +
            "</div>";
    }

    window.cografya_21_notlari = [
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-black text-sm uppercase tracking-wider">
            ⛏️ TÜRKİYE'DE MADENLER - GENEL BİLGİLER
        </span>
    </div>
    <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Türkiye'de maden çeşidi <b>fazla</b>, miktarı ise <b>azdır</b>.</li>
            <li>Maden çeşitliliğinin en fazla olduğu yer <b>Yukarı Fırat</b> bölgesidir (Elazığ çevresi — volkanizma etkisiyle).</li>
        </ul>
        ` + harita("maden_etiket.png", "Türkiye maden yatakları") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 font-black text-sm uppercase tracking-wider">
            ⛏️ DEMİR
        </span>
    </div>
    <div class="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li><b>Çıkarıldığı yerler:</b> Sivas (Divriği), Malatya (Hekimhan, Hasançelebi)</li>
            <li><b>Karabük ve Ereğli:</b> taşkömürüne yakınlık nedeniyle işlenir.</li>
            <li><b>İskenderun:</b> ulaşım avantajı; ithal kömür; su kenarında kuruludur.</li>
        </ul>
        ` + harita("maden_demir.png", "Demir") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 font-black text-sm uppercase tracking-wider">
            ⛏️ BAKIR
        </span>
    </div>
    <div class="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li><b>Çıkarım:</b> Kastamonu (Küre), Artvin (Murgul), Rize (Çayeli)</li>
            <li>En çok <b>Karadeniz Bölgesi</b>'nde çıkarılır.</li>
            <li><b>İşleme:</b> Samsun (ulaşım avantajı)</li>
        </ul>
        ` + harita("maden_bakir.png", "Bakır") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 font-black text-sm uppercase tracking-wider">
            ⛏️ BOKSİT (Alüminyum Cevheri)
        </span>
    </div>
    <div class="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li><b>Çıkarım:</b> Antalya (Akseki), Konya (Seydişehir)</li>
            <li><b>İşleme:</b> Seydişehir</li>
        </ul>
        ` + harita("maden_boksit.png", "Boksit") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 font-black text-sm uppercase tracking-wider">
            ⛏️ KROM
        </span>
    </div>
    <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Paslanmazlık ve aşınmazlık özelliği vardır. Rezervi fazladır, ihraç edilir.</li>
            <li><b>Çıkarım:</b> Elazığ (Guleman), Fethiye (Köyceğiz)</li>
            <li><b>İşleme:</b> Elazığ (ham maddeye yakınlık), Antalya (ulaşım)</li>
        </ul>
        ` + harita("maden_krom.png", "Krom") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-black text-sm uppercase tracking-wider">
            ⛏️ BARİT
        </span>
    </div>
    <div class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Petrol kuyularında basıncı artırır.</li>
            <li><b>Çıkarım:</b> Antalya – Alanya. Rezervi fazladır, ihraç edilir.</li>
        </ul>
        ` + harita("maden_barit.png", "Barit") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-black text-sm uppercase tracking-wider">
            ⛏️ BOR
        </span>
    </div>
    <div class="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-xl border border-teal-100 dark:border-teal-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Dünya rezervinin yaklaşık <b>%72'si</b> Türkiye'dedir. İhraç edilir.</li>
            <li><b>Çıkarım:</b> Balıkesir, Eskişehir, Kütahya, Bursa</li>
            <li><b>İşleme:</b> Kırka (Eskişehir), Bandırma</li>
        </ul>
        ` + harita("maden_bor.png", "Bor") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 font-black text-sm uppercase tracking-wider">
            ⛏️ MERMER
        </span>
    </div>
    <div class="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-xl border border-pink-100 dark:border-pink-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Kireç taşının başkalaşımı (metamorfoz) sonucu oluşur.</li>
            <li>En çok <b>Afyon</b> ve <b>Marmara Adası</b>'ndan çıkarılır. Rezervi çok fazladır.</li>
        </ul>
        ` + harita("maden_mermer.png", "Mermer") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 font-black text-sm uppercase tracking-wider">
            ⛏️ FOSFAT
        </span>
    </div>
    <div class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-100 dark:border-yellow-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Gübre yapımında kullanılır. Rezervi Türkiye'de çok azdır.</li>
            <li><b>Mazıdağı (Mardin):</b> hem çıkarılır hem işlenir.</li>
        </ul>
        ` + harita("maden_fosfat.png", "Fosfat") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 font-black text-sm uppercase tracking-wider">
            ⛏️ ASBEST (Amyant)
        </span>
    </div>
    <div class="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Yanmazlık özelliği vardır.</li>
            <li>Kanser yapıcı etkisi nedeniyle <b>yasaklı maden</b> statüsündedir.</li>
            <li><b>Çıkarım:</b> Eskişehir, Sivas</li>
        </ul>
        ` + harita("maden_asbest.png", "Asbest") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 font-black text-sm uppercase tracking-wider">
            ⛏️ TRONA (Soda Külü)
        </span>
    </div>
    <div class="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-xl border border-cyan-100 dark:border-cyan-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Cam sanayisinde (Şişecam) kullanılır.</li>
            <li><b>Çıkarım:</b> Sincan, Kazan, Beypazarı (Ankara). <b>İşleme:</b> Kazan</li>
        </ul>
        ` + harita("maden_trona.png", "Trona") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 font-black text-sm uppercase tracking-wider">
            ⛏️ ALTIN
        </span>
    </div>
    <div class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-100 dark:border-yellow-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>İlk olarak <b>İzmir – Bergama – Ovacık</b>'ta bulunmuştur.</li>
            <li>Diğer yataklar: <b>Kaz Dağları</b>, <b>Gümüşhane</b> (Mostra Dağı), <b>Artvin</b> (Cerattepe)</li>
        </ul>
        ` + harita("maden_altin.png", "Altın") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 font-black text-sm uppercase tracking-wider">
            ⛏️ URANYUM
        </span>
    </div>
    <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Nükleer santrallerde enerji kaynağı olarak kullanılır.</li>
            <li><b>Çıkarım:</b> Yozgat (Sorgun)</li>
        </ul>
        ` + harita("maden_uranyum.png", "Uranyum") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-black text-sm uppercase tracking-wider">
            ⛏️ TORYUM
        </span>
    </div>
    <div class="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Nükleer enerji kaynağıdır (uranyum gibi).</li>
            <li>Türkiye'de <b>çıkarımı yoktur</b> (henüz işletilmemektedir).</li>
            <li><b>Bulunduğu yer:</b> Eskişehir (Sivrihisar)</li>
        </ul>
        ` + harita("maden_toryum.png", "Toryum") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 font-black text-sm uppercase tracking-wider">
            ⛏️ CIVA
        </span>
    </div>
    <div class="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Oda sıcaklığında sıvı halde bulunan <b>tek madendir</b>.</li>
            <li>Hassas alet yapımında kullanılır (termometre, barometre).</li>
            <li><b>Çıkarım:</b> İzmir (Karaburun), Konya (Sarayönü)</li>
        </ul>
        ` + harita("maden_civa.png", "Cıva") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-black text-sm uppercase tracking-wider">
            ⛏️ TUZ
        </span>
    </div>
    <div class="bg-slate-50 dark:bg-slate-800/20 p-4 rounded-xl border border-slate-100 dark:border-slate-700/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li><b>Kaya tuzu:</b> Çankırı, Iğdır, Kars</li>
            <li><b>Göl tuzu:</b> Tuz Gölü (Aksaray, Konya, Ankara)</li>
            <li><b>Deniz tuzu:</b> İzmir (Çamaltı Tuzlası)</li>
        </ul>
        ` + harita("maden_tuz.png", "Tuz") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 font-black text-sm uppercase tracking-wider">
            ⛏️ PERLİT (İnci Taşı)
        </span>
    </div>
    <div class="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Volkanik kökenli, camsı bir madendir; görünümü nedeniyle inci taşı da denir.</li>
            <li>Gıda, inşaat, boya, deterjan sektörlerinde kullanılır.</li>
            <li><b>Çıkarım:</b> İzmir, Ankara, Bayburt, Erzurum</li>
        </ul>
        ` + harita("maden_perlit.png", "Perlit") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 font-black text-sm uppercase tracking-wider">
            ⛏️ POMZA TAŞI
        </span>
    </div>
    <div class="bg-gray-50 dark:bg-gray-800/20 p-4 rounded-xl border border-gray-100 dark:border-gray-700/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Tarım ve inşaat sektöründe kullanılır.</li>
            <li><b>Çıkarım:</b> Nevşehir, Kayseri</li>
        </ul>
        ` + harita("maden_pomza.png", "Pomza") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 font-black text-sm uppercase tracking-wider">
            ⛏️ KÜKÜRT
        </span>
    </div>
    <div class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-100 dark:border-yellow-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Bağcılık ve kayısıcılıkta hastalık önleyici olarak kullanılır.</li>
            <li><b>En önemli yatak:</b> Isparta (Keçiborlu)</li>
        </ul>
        ` + harita("maden_kukurt.png", "Kükürt") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-black text-sm uppercase tracking-wider">
            ⛏️ MANGANEZ
        </span>
    </div>
    <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Çeliğe sertlik verir.</li>
            <li><b>Çıkarım:</b> Zonguldak (Ereğli)</li>
        </ul>
        ` + harita("maden_manganez.png", "Manganez") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-black text-sm uppercase tracking-wider">
            ⛏️ KURŞUN ve ÇİNKO
        </span>
    </div>
    <div class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Birlikte çıkarılan madenlerdir.</li>
            <li><b>Çıkarım:</b> Yozgat, Elazığ</li>
        </ul>
        ` + harita("maden_kursun.png", "Kurşun ve çinko") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 font-black text-sm uppercase tracking-wider">
            ⛏️ OLTU TAŞI
        </span>
    </div>
    <div class="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-xl border border-pink-100 dark:border-pink-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Süs eşyası ve takı yapımında kullanılır.</li>
            <li><b>Çıkarım:</b> Erzurum (Oltu)</li>
        </ul>
        ` + harita("maden_oltu.png", "Oltu taşı") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 font-black text-sm uppercase tracking-wider">
            ⛏️ LÜLE TAŞI
        </span>
    </div>
    <div class="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Pipo ve süs eşyası yapımında kullanılır.</li>
            <li><b>Çıkarım:</b> Eskişehir</li>
        </ul>
        ` + harita("maden_lule.png", "Lüle taşı") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-black text-sm uppercase tracking-wider">
            ⛏️ VOLFRAM (Tungsten)
        </span>
    </div>
    <div class="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-xl border border-teal-100 dark:border-teal-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Sert ve dayanıklı metal üretiminde alaşım olarak kullanılır.</li>
            <li><b>Çıkarım:</b> Bursa (Uludağ)</li>
        </ul>
        ` + harita("maden_volfram.png", "Volfram") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 font-black text-sm uppercase tracking-wider">
            ⛏️ FELDSPAT
        </span>
    </div>
    <div class="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-xl border border-cyan-100 dark:border-cyan-800/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Cam, seramik, boya ve plastik sanayisinde kullanılır.</li>
            <li><b>Çıkarım:</b> Aydın, Kütahya, Yozgat</li>
        </ul>
        ` + harita("maden_feldspat.png", "Feldspat") + `
    </div>
    `,
        `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800/50 text-stone-700 dark:text-stone-300 font-black text-sm uppercase tracking-wider">
            ⛏️ ZIMPARA TAŞI
        </span>
    </div>
    <div class="bg-stone-50 dark:bg-stone-800/20 p-4 rounded-xl border border-stone-100 dark:border-stone-700/30 text-sm w-full">
        <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Zımparalama ve parlatma işlemlerinde kullanılır. <b>İhraç edilir.</b></li>
            <li><b>Çıkarım:</b> Aydın, Alanya</li>
        </ul>
        ` + harita("maden_zimpara.png", "Zımpara taşı") + `
    </div>
    `
    ];
})();
