// notlar/cografya-11-not.js
window.cografya_11_notlari = [
    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-black text-sm uppercase tracking-wider">
            🗺️ ARAZİ RENKLENDİRME YÖNTEMİ
        </span>
    </div>
    <div class="bg-stone-50 dark:bg-stone-900/20 p-4 rounded-xl border border-stone-200 dark:border-stone-700 text-sm w-full">
        <p>Fiziki haritalarda yer şekillerinin daha net anlaşılması için kullanılan renklendirme yönteminde, renkler kesinlikle bitki örtüsünü veya idari sınırları değil; sadece <b class="text-rose-600 dark:text-rose-400">aynı yükseltiye sahip alanları</b> gösterir.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
            <div class="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg text-center">
                <span class="text-green-700 dark:text-green-300 font-bold text-xs">🟢 Yeşil</span>
                <p class="text-xs text-slate-600 dark:text-slate-400">Alçak yerler<br>(deniz seviyesine yakın)</p>
            </div>
            <div class="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg text-center">
                <span class="text-amber-700 dark:text-amber-300 font-bold text-xs">🟤 Kahverengi</span>
                <p class="text-xs text-slate-600 dark:text-slate-400">Yüksek yerler</p>
            </div>
        </div>
    </div>
    `,

    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 font-black text-sm uppercase tracking-wider">
            📈 EĞİM VE İZOHİPS İLİŞKİSİ
        </span>
    </div>
    <div class="space-y-3 text-left w-full text-sm">
        <div class="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800/30">
            <div class="bg-white dark:bg-slate-800/50 p-3 rounded-lg border-l-4 border-red-500 mb-2">
                <p class="text-amber-800 dark:text-amber-200">📌 <b>NOT:</b> Haritada izohips (eş yükselti) eğrileri <u>çok sıklaşıyorsa</u> orada <b class="text-rose-600 dark:text-rose-400">eğim fazla</b> demektir. Eğimin fazla olduğu bu yerlerde akarsuların akış hızı yüksek, falez oluşumu yaygındır.</p>
            </div>
            <div class="bg-white dark:bg-slate-800/50 p-3 rounded-lg border-l-4 border-green-500">
                <p class="text-amber-800 dark:text-amber-200">📌 <b>NOT:</b> Haritada izohips çizgilerinin <u>seyrek geçtiği (uzaklaştığı)</u> yerlerde ise <b class="text-rose-600 dark:text-rose-400">eğim az</b> (arazi düz veya düze yakın) demektir. Ulaşım ve tarım daha kolaydır.</p>
            </div>
        </div>
    </div>
    `,

    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-black text-sm uppercase tracking-wider">
            🏔️ ENGEBE VE DÜZLÜK DURUMU
        </span>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left w-full text-sm">
        <div class="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30 text-center">
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">En Engebeli Bölge</p>
            <b class="text-rose-600 dark:text-rose-400 text-lg block mb-1">Karadeniz Bölgesi</b>
            <p class="text-xs text-slate-600 dark:text-slate-400">Özellikle Doğu ve Batı Karadeniz bölümleri dağlık ve dik yamaçlıdır.</p>
        </div>
        <div class="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/30 text-center">
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">En Düz Bölge</p>
            <b class="text-rose-600 dark:text-rose-400 text-lg block mb-1">Güneydoğu Anadolu</b>
            <p class="text-xs text-slate-600 dark:text-slate-400">Geniş düzlükler ve platolar hakimdir.</p>
        </div>
    </div>
    `,

    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 font-black text-sm uppercase tracking-wider">
            📍 EN DÜZ BÖLÜMLER VE ALANLAR
        </span>
    </div>
    <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800/30 text-sm w-full">
        <p class="text-xs text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide font-bold">Türkiye'nin En Düz Yerleri</p>
        <div class="space-y-2">
            <div class="bg-white dark:bg-slate-800/50 p-2 rounded-lg border border-green-200 dark:border-green-800/30 flex items-center gap-2">
                <span class="bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 w-6 h-6 flex items-center justify-center rounded-full text-xs font-black shrink-0">1</span>
                <span><b class="text-rose-600 dark:text-rose-400">Ergene Bölümü</b> <span class="text-xs text-slate-500">(Edirne ve çevresi - Marmara)</span></span>
            </div>
            <div class="bg-white dark:bg-slate-800/50 p-2 rounded-lg border border-green-200 dark:border-green-800/30 flex items-center gap-2">
                <span class="bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 w-6 h-6 flex items-center justify-center rounded-full text-xs font-black shrink-0">2</span>
                <span><b class="text-rose-600 dark:text-rose-400">Konya Çevresi</b> <span class="text-xs text-slate-500">(İç Anadolu)</span></span>
            </div>
            <div class="bg-white dark:bg-slate-800/50 p-2 rounded-lg border border-green-200 dark:border-green-800/30 flex items-center gap-2">
                <span class="bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 w-6 h-6 flex items-center justify-center rounded-full text-xs font-black shrink-0">3</span>
                <span><b class="text-rose-600 dark:text-rose-400">Orta Fırat Bölümü</b> <span class="text-xs text-slate-500">(Güneydoğu Anadolu)</span></span>
            </div>
            <div class="bg-white dark:bg-slate-800/50 p-2 rounded-lg border border-green-200 dark:border-green-800/30 flex items-center gap-2">
                <span class="bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 w-6 h-6 flex items-center justify-center rounded-full text-xs font-black shrink-0">4</span>
                <span><b class="text-rose-600 dark:text-rose-400">Erzurum - Kars Platosu</b> <span class="text-xs text-slate-500">(Yüksek ama üzeri düz bir aşınım düzlüğüdür)</span></span>
            </div>
        </div>
    </div>
    `,

    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-sm uppercase tracking-wider">
            📊 YÜKSELTİ BASAMAKLARINA GÖRE UÇ BÖLGELER
        </span>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left w-full text-sm">
        <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800/30 text-center">
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">En Alçak Bölge</p>
            <b class="text-rose-600 dark:text-rose-400 text-lg block mb-1">Marmara Bölgesi</b>
            <p class="text-xs text-slate-600 dark:text-slate-400">Fiziki haritada yeşil tonlarının en yoğun olduğu, ortalama yükseltisi en az olan bölgedir.</p>
        </div>
        <div class="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800/30 text-center">
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">En Yüksek Bölge</p>
            <b class="text-rose-600 dark:text-rose-400 text-lg block mb-1">Doğu Anadolu</b>
            <p class="text-xs text-slate-600 dark:text-slate-400">Fiziki haritada kahverengi ve koyu kahverengi tonlarının en hakim olduğu, ortalama yükseltisi en fazla olan bölgedir.</p>
        </div>
    </div>
    `
];