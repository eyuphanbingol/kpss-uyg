// notlar/cografya-15-not.js
window.cografya_15_notlari = [
  // ============================================================
  // 1. TÜRKİYE NÜFUSU - GENEL BAKIŞ
  // ============================================================
  `
    <div class="mb-4">
      <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-black text-sm uppercase tracking-wider">
        👥 TÜRKİYE NÜFUSU - GENEL
      </span>
    </div>
    <div class="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30 text-sm w-full">
      <p class="font-semibold text-indigo-700 dark:text-indigo-300">Nüfus Sayımı Sonucunda Elde Edilenler:</p>
      <ul class="list-disc list-inside space-y-1 mt-2 text-xs">
        <li>Nüfusun toplam miktarı</li>
        <li>Doğumlar ve ölümler</li>
        <li>Eğitim - Sağlık durumu</li>
        <li>Nüfus artış hızı</li>
        <li>Nüfusun yaş gruplarına göre dağılımı</li>
        <li>Nüfusun cinsiyet dağılımı</li>
        <li>Nüfusun cinsiyet durumu</li>
      </ul>
      </div>
    <!-- 🗺️ HARİTA / RESİM ALANI -->
            <div class="mt-4 overflow-hidden rounded-xl border border-blue-200 dark:border-blue-700/50 bg-white dark:bg-slate-800 p-2">
                <img src="./src/img/nüfus_prmt.png?v=6" alt="21 Aralık Haritası" class="w-full h-auto rounded-lg object-contain" loading="lazy">
            </div>
    </div>
  `,

  // ============================================================
  // 2. NÜFUS SAYIMLARI - TARİHSEL SÜREÇ
  // ============================================================
  `
    <div class="mb-4">
      <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 font-black text-sm uppercase tracking-wider">
        📅 NÜFUS SAYIMLARI TARİHÇESİ
      </span>
    </div>
    <div class="space-y-3 text-left w-full text-sm">
      <div class="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800/30">
        <ul class="list-disc list-inside space-y-2 text-xs">
          <li><b class="text-rose-600 dark:text-rose-400">1831</b> → Osmanlı'da ilk nüfus sayımı (II. Mahmut)</li>
          <li><b class="text-rose-600 dark:text-rose-400">1844</b> → Osmanlı'da ikinci sayım (Sultan Abdülmecit)</li>
          <li><b class="text-rose-600 dark:text-rose-400">1927</b> → Cumhuriyet'in ilk nüfus sayımı <span class="text-amber-600 dark:text-amber-400 text-xs">(nüfus artış hızı bulunamadı - önceki sayım yok)</span></li>
          <li><b class="text-rose-600 dark:text-rose-400">2000</b> → Sokağa çıkma yasağı ile yapılan <b>son</b> geleneksel sayım</li>
          <li><b class="text-rose-600 dark:text-rose-400">2007</b> → <b>Adrese Dayalı Nüfus Kayıt Sistemi</b>'ne geçildi, her yıl sayım yapılıyor</li>
        </ul>
        <div class="mt-3 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800/30 text-xs">
          💡 <b>3D = Doğal nüfus artışı</b> fazlaysa doğum fazladır → Doğu'da fazla<br>
          💡 <b>3G = Gerçek nüfus artışı</b> fazlaysa gelişmiş yerdir → Göç alır
        </div>
      </div>
          <!-- 🗺️ HARİTA / RESİM ALANI -->
            <div class="mt-4 overflow-hidden rounded-xl border border-blue-200 dark:border-blue-700/50 bg-white dark:bg-slate-800 p-2">
                <img src="./src/img/nüfus_prmt.png?v=6" alt="21 Aralık Haritası" class="w-full h-auto rounded-lg object-contain" loading="lazy">
            </div>
    </div>
    </div>
  `,

  // ============================================================
  // 3. NÜFUS ARTIŞININ SONUÇLARI
  // ============================================================
  `
    <div class="mb-4">
      <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 font-black text-sm uppercase tracking-wider">
        ⚖️ NÜFUS ARTIŞININ SONUÇLARI
      </span>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left w-full text-sm">
      <div class="bg-rose-50 dark:bg-rose-900/20 p-3 rounded-xl border border-rose-100 dark:border-rose-800/30">
        <p class="font-semibold text-rose-600 dark:text-rose-400 text-xs">❌ Olumsuz Sonuçlar</p>
        <ul class="list-disc list-inside space-y-1 text-xs mt-1">
          <li>Doğal kaynaklar tükenir</li>
          <li>İşsizlik artar</li>
          <li>Kentlerde sorunlar çıkar</li>
          <li>Kalkınma hızı düşer</li>
          <li>Çevre sorunları artar</li>
          <li>Kırdan kente göç olur</li>
          <li>Dışa bağımlılık artar</li>
          <li>Demografik yatırım artar <span class="text-rose-600 dark:text-rose-400 text-[10px]">(insana yatırım: sağlık, eğitim)</span></li>
        </ul>
      </div>
      <div class="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-100 dark:border-green-800/30">
        <p class="font-semibold text-green-600 dark:text-green-400 text-xs">✅ Olumlu Sonuçlar</p>
        <ul class="list-disc list-inside space-y-1 text-xs mt-1">
          <li>Vergi gelirleri artar</li>
          <li>Mal ve hizmetlere talep artar</li>
          <li>Askeri güç artar</li>
          <li>İş gücü ucuzlar</li>
          <li>Yeni sektörler çıkar</li>
        </ul>
    </div>
  `,

  // ============================================================
  // 4. NÜFUS POLİTİKALARI - 1923-1965 (ARTIRICI)
  // ============================================================
  `
    <div class="mb-4">
      <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-black text-sm uppercase tracking-wider">
        📈 1923-1965: NÜFUS ARTIRICI POLİTİKALAR
      </span>
    </div>
    <div class="space-y-3 text-left w-full text-sm">
      <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30">
        <p class="font-semibold text-blue-700 dark:text-blue-300 text-xs">Dayanaklar:</p>
        <ul class="list-disc list-inside space-y-1 text-xs mt-1">
          <li>Tarımda yeterince makineleşme olmaması → iş gücü ihtiyacı</li>
          <li>Savaşlardaki genç nüfus kaybını telafi etme</li>
          <li>Ülke savunması için genç nüfus ihtiyacı</li>
          <li>Üretim artışı için tüketici nüfus gerekliliği</li>
        </ul>
        <p class="font-semibold text-blue-700 dark:text-blue-300 text-xs mt-3">Teşvik Yöntemleri:</p>
        <ul class="list-disc list-inside space-y-1 text-xs mt-1">
          <li>Çok çocuklu aileler yol ve gümrük vergisinden muaf</li>
          <li>Toprak ve para yardımı</li>
          <li>Doğum kontrol ve kürtaj <b class="text-rose-600 dark:text-rose-400">yasak</b></li>
          <li>Evlilik yaşı düşürüldü</li>
          <li>Çok çocuklu aileler madalya ile ödüllendirildi</li>
        </ul>
      </div>
          <!-- 🗺️ HARİTA / RESİM ALANI -->
            <div class="mt-4 overflow-hidden rounded-xl border border-blue-200 dark:border-blue-700/50 bg-white dark:bg-slate-800 p-2">
                <img src="./src/img/nüfus_prmt.png?v=6" alt="21 Aralık Haritası" class="w-full h-auto rounded-lg object-contain" loading="lazy">
            </div>
    </div>
    </div>
  `,

  // ============================================================
  // 5. NÜFUS POLİTİKALARI - 1965-1980 (AZALTICI)
  // ============================================================
  `
    <div class="mb-4">
      <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 font-black text-sm uppercase tracking-wider">
        📉 1965-1980: NÜFUS AZALTICI POLİTİKALAR
      </span>
    </div>
    <div class="space-y-3 text-left w-full text-sm">
      <div class="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800/30">
        <p class="font-semibold text-red-700 dark:text-red-300 text-xs">Gerekçeler:</p>
        <ul class="list-disc list-inside space-y-1 text-xs mt-1">
          <li>1960'ta nüfus artış hızı en yüksek seviyeye ulaştı</li>
          <li>Tarım/ulaşım/sanayide makineleşme → işgücü ihtiyacı azaldı</li>
          <li>Dünya savaşları bitti → askeri ihtiyaç azaldı</li>
          <li>Aşırı nüfus artışı kalkınmayı engeller düşüncesi</li>
        </ul>
        <p class="font-semibold text-red-700 dark:text-red-300 text-xs mt-3">Uygulamalar:</p>
        <ul class="list-disc list-inside space-y-1 text-xs mt-1">
          <li>DPT 1. Beş Yıllık Kalkınma Planı yayınlandı</li>
          <li><b class="text-rose-600 dark:text-rose-400">1965 Nüfus Planlaması Kanunu</b> → isteyen istediği sayıda çocuk</li>
          <li>Artırma teşvikleri kaldırıldı</li>
          <li>Yurt dışına göçler teşvik edildi</li>
        </ul>
      </div>
          <!-- 🗺️ HARİTA / RESİM ALANI -->
            <div class="mt-4 overflow-hidden rounded-xl border border-blue-200 dark:border-blue-700/50 bg-white dark:bg-slate-800 p-2">
                <img src="./src/img/nüfus_prmt.png?v=6" alt="21 Aralık Haritası" class="w-full h-auto rounded-lg object-contain" loading="lazy">
            </div>
    </div>
    </div>
  `,

  // ============================================================
  // 6. NÜFUS POLİTİKALARI - 1980-2005 (İYİLEŞTİRME)
  // ============================================================
  `
    <div class="mb-4">
      <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 font-black text-sm uppercase tracking-wider">
        🔧 1980-2005: İYİLEŞTİRİCİ POLİTİKALAR
      </span>
    </div>
    <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800/30 text-sm w-full">
      <ul class="list-disc list-inside space-y-2 text-xs">
        <li>Nüfus <b>niteliğinin</b> iyileştirilmesi hedeflendi</li>
        <li>Eğitim, beslenme, barınma, sağlık koşullarına odaklanıldı</li>
        <li>Kadının iş hayatına katılımı arttı → nüfus artış hızı düşmeye başladı</li>
        <li>Kentleşme, barınma ve iş imkânları artırılmaya çalışıldı</li>
      </ul>
    </div>
  `,

  // ============================================================
  // 7. NÜFUS POLİTİKALARI - 2005 SONRASI (ARTIRMA)
  // ============================================================
  `
    <div class="mb-4">
      <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-black text-sm uppercase tracking-wider">
        📈 2005 SONRASI: TEKRAR ARTIRICI POLİTİKALAR
      </span>
    </div>
    <div class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800/30 text-sm w-full">
      <ul class="list-disc list-inside space-y-2 text-xs">
        <li>Nüfus artış hızı düşüşünün ileride yaratacağı sorunlara karşı tedbir</li>
        <li><b class="text-rose-600 dark:text-rose-400">2014</b> sonrası: Doğum yapan annelere çocuk sayısına göre maddi destek</li>
        <li>Çalışan anneler için çalışma süreleri kısaltıldı</li>
        <li>Doğum izinleri artırıldı, bakıcı yardımı yapıldı</li>
      </ul>
    </div>
  `,

  // ============================================================
  // 8. TÜRKİYE NÜFUSUNUN COĞRAFİ DAĞILIŞI - SIK NÜFUSLU
  // ============================================================
  `
    <div class="mb-4">
      <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-black text-sm uppercase tracking-wider">
        🟢 SIK NÜFUSLU YERLER
      </span>
    </div>
    <div class="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/30 text-sm w-full">
      <ul class="list-disc list-inside space-y-1 text-xs">
        <li><b>İstanbul - Bursa</b> arası</li>
        <li><b>İzmir, Aydın, Manisa</b></li>
        <li><b>Mersin, Adana, Hatay</b></li>
        <li><b>Ankara, Eskişehir, Konya, Kayseri, Samsun</b></li>
        <li><b>Gaziantep, Şanlıurfa</b> <span class="text-emerald-600 dark:text-emerald-400 text-[10px]">→ sanayi, ticaret, ulaşım</span></li>
        <li><b>Antalya</b> merkez <span class="text-emerald-600 dark:text-emerald-400 text-[10px]">→ turizm</span></li>
        <li><b>Zonguldak</b> çevresi, <b>Batman, Malatya, Elazığ</b> <span class="text-emerald-600 dark:text-emerald-400 text-[10px]">→ madencilik</span></li>
        <li><b>Doğu Karadeniz</b> kıyıları <span class="text-emerald-600 dark:text-emerald-400 text-[10px]">→ iklim, doğal faktör</span></li>
      </ul>
    </div>
  `,

  // ============================================================
  // 9. TÜRKİYE NÜFUSUNUN COĞRAFİ DAĞILIŞI - SEYREK NÜFUSLU
  // ============================================================
  `
    <div class="mb-4">
      <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 font-black text-sm uppercase tracking-wider">
        🔴 SEYREK NÜFUSLU YERLER
      </span>
    </div>
    <div class="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800/30 text-sm w-full">
      <ul class="list-disc list-inside space-y-1 text-xs">
        <li><b>Sinop, Menteşe, Yıldız, Teke, Gelibolu-Biga, Taşeli</b> <span class="text-red-600 dark:text-red-400 text-[10px]">→ engebeli arazi</span></li>
        <li><b>Tuz Gölü</b> ve çevresi, <b>Iğdır Ovası</b> <span class="text-red-600 dark:text-red-400 text-[10px]">→ kuraklık</span></li>
        <li><b>Güneydoğu Anadolu</b>'nun güneyi</li>
        <li><b>Sivas</b> çevresi, <b>Gümüşhane-Bayburt, Tunceli, Hakkari</b> <span class="text-red-600 dark:text-red-400 text-[10px]">→ soğuk iklim + engebe</span></li>
        <li><b>Erzurum-Kars</b> <span class="text-red-600 dark:text-red-400 text-[10px]">→ yüksek ve soğuk</span></li>
      </ul>
    </div>
  `,

  // ============================================================
  // 10. FİZYOLOJİK NÜFUS YOĞUNLUĞU
  // ============================================================
  `
    <div class="mb-4">
      <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 font-black text-sm uppercase tracking-wider">
        📊 FİZYOLOJİK NÜFUS YOĞUNLUĞU
      </span>
    </div>
    <div class="space-y-3 text-left w-full text-sm">
      <div class="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-xl border border-cyan-100 dark:border-cyan-800/30">
        <ul class="list-disc list-inside space-y-2 text-xs">
          <li>Engebeli veya sık nüfuslu yerde <b class="text-rose-600 dark:text-rose-400">fazladır</b></li>
          <li><b>Karadeniz, Doğu Anadolu ve Akdeniz</b>'de fazla → <span class="text-cyan-600 dark:text-cyan-400">engebe</span></li>
          <li><b>Ege, İç Anadolu ve Marmara</b>'da fazla → <span class="text-cyan-600 dark:text-cyan-400">nüfus az</span></li>
        </ul>
      </div>
    </div>
  `,

  // ============================================================
  // 11. TARIMSAL NÜFUS YOĞUNLUĞU
  // ============================================================
  `
    <div class="mb-4">
      <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-lime-100 dark:bg-lime-900/50 text-lime-700 dark:text-lime-300 font-black text-sm uppercase tracking-wider">
        🌾 TARIMSAL NÜFUS YOĞUNLUĞU
      </span>
    </div>
    <div class="bg-lime-50 dark:bg-lime-900/20 p-4 rounded-xl border border-lime-100 dark:border-lime-800/30 text-sm w-full">
      <ul class="list-disc list-inside space-y-2 text-xs">
        <li>Engebeli ve geri kalmış yerde <b class="text-rose-600 dark:text-rose-400">fazladır</b></li>
        <li><b>Karadeniz ve Doğu Anadolu</b>'da fazla → <span class="text-lime-600 dark:text-lime-400">engebe</span></li>
        <li><b>İç Anadolu, Güneydoğu Anadolu ve Marmara</b>'da en az</li>
      </ul>
    </div>
  `,

  // ============================================================
  // 12. DOĞURGANLIK
  // ============================================================
  `
    <div class="mb-4">
      <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 font-black text-sm uppercase tracking-wider">
        👶 DOĞURGANLIK
      </span>
    </div>
    <div class="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-xl border border-pink-100 dark:border-pink-800/30 text-sm w-full">
      <ul class="list-disc list-inside space-y-2 text-xs">
        <li>Doğurganlık <b class="text-rose-600 dark:text-rose-400">azalmaktadır</b> <span class="text-pink-600 dark:text-pink-400 text-[10px]">(kadının iş hayatı, eğitim, evlilik yaşı yükselmesi)</span></li>
        <li>Kırsal kesimde kentlere göre <b>daha yüksek</b></li>
        <li>En yüksek doğurganlık: <b>Güneydoğu Anadolu ve Doğu Anadolu</b></li>
        <li>Doğurganlık oranı en yüksek il: <b class="text-rose-600 dark:text-rose-400">Şanlıurfa</b> 🏆</li>
      </ul>
    </div>
  `,

  // ============================================================
  // 13. YAŞ GRUPLARI
  // ============================================================
  `
    <div class="mb-4">
      <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 font-black text-sm uppercase tracking-wider">
        🧑‍🤝‍🧑 YAŞ GRUPLARI
      </span>
    </div>
    <div class="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-800/30 text-sm w-full">
      <ul class="list-disc list-inside space-y-2 text-xs">
        <li><b class="text-rose-600 dark:text-rose-400">0-14 yaş</b> → Çocuk nüfus</li>
        <li><b class="text-rose-600 dark:text-rose-400">15-24 yaş</b> → Genç nüfus</li>
        <li><b class="text-rose-600 dark:text-rose-400">15-64 yaş</b> → Çalışma çağı</li>
        <li><b class="text-rose-600 dark:text-rose-400">65+ yaş</b> → Yaşlı nüfus <span class="text-orange-600 dark:text-orange-400 text-[10px]">(oranı artıyor)</span></li>
      </ul>
    </div>
  `,

  // ============================================================
  // 14. ORTANCA YAŞ
  // ============================================================
  `
    <div class="mb-4">
      <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-black text-sm uppercase tracking-wider">
        📊 ORTANCA YAŞ
      </span>
    </div>
    <div class="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-xl border border-teal-100 dark:border-teal-800/30 text-sm w-full">
      <ul class="list-disc list-inside space-y-2 text-xs">
        <li>Ortanca yaş <b class="text-rose-600 dark:text-rose-400">yükselmektedir</b> <span class="text-teal-600 dark:text-teal-400 text-[10px]">(doğumlar azalıyor, yaşam süresi uzuyor)</span></li>
        <li>Ortanca yaş en yüksek il: <b class="text-rose-600 dark:text-rose-400">Sinop</b> 🏆</li>
        <li>Ortanca yaş en düşük il: <b class="text-rose-600 dark:text-rose-400">Şanlıurfa</b> ⬇️</li>
      </ul>
    </div>
  `,

  // ============================================================
  // 15. YAŞ BAĞIMLILIK
  // ============================================================
  `
    <div class="mb-4">
      <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 font-black text-sm uppercase tracking-wider">
        ⚖️ YAŞ BAĞIMLILIK ORANI
      </span>
    </div>
    <div class="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-xl border border-violet-100 dark:border-violet-800/30 text-sm w-full">
      <ul class="list-disc list-inside space-y-2 text-xs">
        <li>Çalışan nüfusun baktığı <b>0-14 + 65+</b> yaş grubu toplamı</li>
        <li>Yaş bağımlılık oranı <b class="text-rose-600 dark:text-rose-400">yükselmektedir</b></li>
        <li>En yüksek yaş bağımlılık oranı: <b class="text-rose-600 dark:text-rose-400">Şanlıurfa</b> 🏆</li>
      </ul>
    </div>
  `,

  // ============================================================
  // 16. NÜFUSUN CİNSİYET DAĞILIMI
  // ============================================================
  `
    <div class="mb-4">
      <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-fuchsia-100 dark:bg-fuchsia-900/50 text-fuchsia-700 dark:text-fuchsia-300 font-black text-sm uppercase tracking-wider">
        👫 CİNSİYET DAĞILIMI
      </span>
    </div>
    <div class="bg-fuchsia-50 dark:bg-fuchsia-900/20 p-4 rounded-xl border border-fuchsia-100 dark:border-fuchsia-800/30 text-sm w-full">
      <ul class="list-disc list-inside space-y-2 text-xs">
        <li>Türkiye nüfusu: <b class="text-rose-600 dark:text-rose-400">%50,1 erkek</b> - <b class="text-rose-600 dark:text-rose-400">%49,9 kadın</b></li>
        <li><b class="text-rose-600 dark:text-rose-400">1940</b>'a kadar kadın oranı daha fazlaydı <span class="text-fuchsia-600 dark:text-fuchsia-400 text-[10px]">(savaşlar)</span></li>
        <li>Göç alan illerde <b>erkek oranı</b> yüksek</li>
        <li>Göç veren illerde <b>kadın oranı</b> yüksek</li>
      </ul>
    </div>
  `,

  // ============================================================
  // 17. NÜFUSUN OKURYAZARLIK DURUMU
  // ============================================================
  `
    <div class="mb-4">
      <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 font-black text-sm uppercase tracking-wider">
        📚 OKURYAZARLIK DURUMU
      </span>
    </div>
    <div class="bg-sky-50 dark:bg-sky-900/20 p-4 rounded-xl border border-sky-100 dark:border-sky-800/30 text-sm w-full">
      <ul class="list-disc list-inside space-y-2 text-xs">
        <li>6 yaş üzeri okuryazar oranı: <b class="text-rose-600 dark:text-rose-400">%97,4</b></li>
        <li>Cumhuriyet'in ilk yıllarına göre <b>çok yüksek</b></li>
        <li>Erkek okuryazar oranı kadınlardan <b>yüksek</b></li>
        <li>Batı'daki okuryazarlık Doğu'dan <b>yüksek</b></li>
        <li>Okuryazar oranı en yüksek il: <b class="text-rose-600 dark:text-rose-400">Antalya</b> 🏆</li>
      </ul>
    </div>
  `,

  // ============================================================
  // 18. EKONOMİK SEKTÖRLER - 1, 2, 3
  // ============================================================
  `
    <div class="mb-4">
      <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-black text-sm uppercase tracking-wider">
        🏭 EKONOMİK SEKTÖRLER (1.-2.-3.)
      </span>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left w-full text-sm">
      <div class="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-100 dark:border-green-800/30">
        <p class="font-semibold text-green-600 dark:text-green-400 text-xs">🌱 1. SEKTÖR</p>
        <ul class="list-disc list-inside space-y-0.5 text-[10px] mt-1">
          <li>Toplayıcılık</li>
          <li>Madencilik</li>
          <li>Avcılık</li>
          <li>Hayvancılık</li>
          <li>Balıkçılık</li>
          <li>Ziraat</li>
          <li>Ormancılık</li>
        </ul>
      </div>
      <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-800/30">
        <p class="font-semibold text-blue-600 dark:text-blue-400 text-xs">🏗️ 2. SEKTÖR</p>
        <ul class="list-disc list-inside space-y-0.5 text-[10px] mt-1">
          <li>İmalat</li>
          <li>Sanayi</li>
        </ul>
      </div>
      <div class="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-xl border border-amber-100 dark:border-amber-800/30">
        <p class="font-semibold text-amber-600 dark:text-amber-400 text-xs">🛒 3. SEKTÖR</p>
        <ul class="list-disc list-inside space-y-0.5 text-[10px] mt-1">
          <li>Turizm</li>
          <li>Bankacılık</li>
          <li>Ulaşım</li>
          <li>Eğitim</li>
          <li>Reklam</li>
          <li>Sağlık</li>
          <li>Satış</li>
          <li>Pazarlama</li>
        </ul>
      </div>
    </div>
  `,

  // ============================================================
  // 19. EKONOMİK SEKTÖRLER - 4 ve 5
  // ============================================================
  `
    <div class="mb-4">
      <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-black text-sm uppercase tracking-wider">
        💻 EKONOMİK SEKTÖRLER (4.-5.)
      </span>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left w-full text-sm">
      <div class="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-xl border border-purple-100 dark:border-purple-800/30">
        <p class="font-semibold text-purple-600 dark:text-purple-400 text-xs">📱 4. SEKTÖR</p>
        <ul class="list-disc list-inside space-y-0.5 text-[10px] mt-1">
          <li>Yazılım</li>
          <li>Bilgi İşlemleri</li>
        </ul>
      </div>
      <div class="bg-rose-100 dark:bg-rose-900/50 p-3 rounded-xl border border-rose-200 dark:border-rose-800/30">
        <p class="font-semibold text-rose-600 dark:text-rose-400 text-xs">👔 5. SEKTÖR</p>
        <ul class="list-disc list-inside space-y-0.5 text-[10px] mt-1">
          <li>CEO</li>
          <li>Üst Düzey Yöneticiler</li>
        </ul>
      </div>
    </div>
  `,

  // ============================================================
  // 20. BONUS - ÖZET KUTU (KRİTİK BİLGİLER)
  // ============================================================
  `
    <div class="mb-4">
      <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 font-black text-sm uppercase tracking-wider">
        ⭐ ÖZET - KRİTİK BİLGİLER
      </span>
    </div>
    <div class="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border-2 border-amber-200 dark:border-amber-800/30 text-sm w-full">
      <ul class="list-disc list-inside space-y-1.5 text-xs font-medium">
        <li>📅 <b>1927</b> → Cumhuriyet'in ilk nüfus sayımı</li>
        <li>📅 <b>2007</b> → Adrese Dayalı Nüfus Kayıt Sistemi</li>
        <li>🏆 En yüksek doğurganlık: <b>Şanlıurfa</b></li>
        <li>🏆 En yüksek ortanca yaş: <b>Sinop</b> / En düşük: <b>Şanlıurfa</b></li>
        <li>🏆 En yüksek okuryazar oranı: <b>Antalya</b></li>
        <li>📈 <b>1923-1965</b> → Nüfus <b>artırıcı</b> politikalar</li>
        <li>📉 <b>1965-1980</b> → Nüfus <b>azaltıcı</b> politikalar</li>
        <li>🔧 <b>1980-2005</b> → <b>İyileştirici</b> politikalar</li>
        <li>📈 <b>2005 sonrası</b> → Tekrar <b>artırıcı</b> politikalar</li>
      </ul>
    </div>
  `
];