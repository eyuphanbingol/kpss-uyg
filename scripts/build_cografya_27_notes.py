# -*- coding: utf-8 -*-
"""Build notlar/cografya-27-not.js — KPSS Coğrafya Genel Tekrar (konu 1–26 özeti)."""
from pathlib import Path

def card(title, body, color="slate"):
    colors = {
        "slate": "bg-slate-800 text-white",
        "amber": "bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-100",
        "rose": "bg-rose-100 dark:bg-rose-900/40 text-rose-900 dark:text-rose-100",
        "teal": "bg-teal-100 dark:bg-teal-900/40 text-teal-900 dark:text-teal-100",
        "indigo": "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-900 dark:text-indigo-100",
        "emerald": "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-100",
        "violet": "bg-violet-100 dark:bg-violet-900/40 text-violet-900 dark:text-violet-100",
        "sky": "bg-sky-100 dark:bg-sky-900/40 text-sky-900 dark:text-sky-100",
        "orange": "bg-orange-100 dark:bg-orange-900/40 text-orange-900 dark:text-orange-100",
        "cyan": "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-900 dark:text-cyan-100",
        "lime": "bg-lime-100 dark:bg-lime-900/40 text-lime-900 dark:text-lime-100",
        "fuchsia": "bg-fuchsia-100 dark:bg-fuchsia-900/40 text-fuchsia-900 dark:text-fuchsia-100",
    }
    cls = colors.get(color, colors["slate"])
    return f"""    `
    <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl {cls} font-black text-sm uppercase tracking-wider">
            {title}
        </span>
    </div>
    {body}
    `"""

def trap(text):
    return f"""<div class="mt-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3">
        <p class="text-xs"><b>ÖSYM / çeldirici:</b> {text}</p>
    </div>"""

def ul(items):
    lis = "\n".join(f"        <li>{i}</li>" for i in items)
    return f'<ul class="list-disc list-inside space-y-1.5 text-sm w-full text-left">\n{lis}\n    </ul>'

def table(headers, rows):
    th = "".join(
        f'<th class="px-2 py-1.5 text-left font-bold border-b border-stone-200 dark:border-stone-600">{h}</th>'
        for h in headers
    )
    trs = []
    for r in rows:
        tds = "".join(
            f'<td class="px-2 py-1.5 border-b border-stone-100 dark:border-stone-700 align-top">{c}</td>'
            for c in r
        )
        trs.append(f"<tr>{tds}</tr>")
    return f"""<div class="overflow-x-auto text-sm w-full">
        <table class="w-full min-w-[280px]">
            <thead><tr>{th}</tr></thead>
            <tbody>
                {"".join(trs)}
            </tbody>
        </table>
    </div>"""

cards = []

# ── GİRİŞ ──────────────────────────────────────────────────────────────
cards.append(card(
    "📚 GENEL TEKRAR — NASIL KULLAN",
    ul([
        "Bu konu <b>Coğrafya’nın 1–26</b> bloklarını tek yerde toparlar.",
        "Önce tabloları ve 🚨 / çeldirici kutularını oku; sonra zayıf konuya dön.",
        "Amaç: ürün–bölge, şekil–yer, maden–şehir eşleşmelerini hızla kurmak.",
        "Sorular ayrı dosyada; burası yalnızca <b>not kartı</b>.",
    ]),
    "indigo",
))

# ── 1 KONUM ────────────────────────────────────────────────────────────
cards.append(card(
    "1.1 MUTLAK & ÖZEL KONUM",
    ul([
        "<b>Mutlak konum:</b> 36°–42° K enlem · 26°–45° D boylam (Kuzey Yarım Küre, Yengeç’in kuzeyi).",
        "<b>Orta iklim kuşağı ABCD:</b> Akdeniz iklimi · Batı rüzgarları · Cephe yağışları · Dört mevsim.",
        "<b>Özel konum:</b> üç kıta arası, boğazlar, üç deniz, Alp–Himalaya kuşağı, genç oluşum.",
        "<b>Uç noktalar:</b> Kuzey Sinop–İnceburun · Güney Hatay · Doğu Iğdır–Dilucu · Batı Gökçeada.",
    ]) + trap("Aynı enlemde sıcaklık farkı → yükselti / karasallık / bakı (özel konum). Enlem farkı → kuzey–güney kıyası."),
    "teal",
))

cards.append(card(
    "1.2 BAKİ, ENLEM, BÖLGE KARAKTERİ",
    ul([
        "Güney yamaçlar daha sıcak (bakı); Karadeniz’de kışın kuzey yamaç ılık olabilir → <b>bakı tersliği</b>.",
        "Güneş 90° gelmez; öğle gölgesi sıfır olmaz (Yengeç kuzeyi).",
        "<b>Marmara:</b> alçak–kalabalık · <b>Ege:</b> graben–horst · <b>Akdeniz:</b> karst · <b>İç Anadolu:</b> kapalı havza",
        "<b>Doğu Anadolu:</b> yüksek–volkanik · <b>GDA:</b> düz–kurak · <b>Karadeniz:</b> paralel dağ + bol yağış",
    ]) + trap("Ters bir olay (bakı tersliği vb.) sorulursa önce Karadeniz’i düşün."),
    "teal",
))

# ── 2 İÇ KUVVETLER ─────────────────────────────────────────────────────
cards.append(card(
    "2.1 OROJENEZ & EPİROJENEZ",
    ul([
        "<b>Orojenez:</b> dağ oluşumu → <b>kırık</b> (horst–graben) + <b>kıvrım</b> (antiklinal–senklinal).",
        "Kıvrım dağlar <b>Alp–Himalaya</b> sistemine bağlıdır (Kuzey Anadolu + Toroslar).",
        "<b>Epirojenez:</b> toptan yükselme/alçalma · platoların genişliği buna kanıt.",
        "İç kuvvetler: orojenez + epirojenez + volkanizma + deprem (seizma).",
        "Linyitin yaygınlığı → genç arazi; taşkömürü (Zonguldak) → yaşlı/eski arazi kalıntısı.",
    ]) + trap("Horst yüksekte kalan, graben çökendir — ters ezberleme klasik çeldirici."),
    "rose",
))

cards.append(card(
    "2.2 KIRIK DAĞLAR — ÖRNEKLER",
    ul([
        "Sert tabaka kırılır → <b>horst</b> (dağ) / <b>graben</b> (ova). En yaygın: <b>Ege (Batı Anadolu)</b>.",
        "<b>Kuzey→güney kod:</b> KAZ–MA–YUNT–BOZ–AYI–ME",
        "<b>Kaz Dağı</b> (Balıkesir–Çanakkale) · <b>Madra</b> · <b>Yunt</b> · <b>Bozdağlar</b> · <b>Aydın Dağları</b> · <b>Menteşe</b> (Muğla).",
        "Horst–graben ovaları: Bakırçay, Gediz, Küçük/Büyük Menderes (dağların arasını doldurur).",
        "<b>İstisna:</b> <b>Amanos (Nur) Dağları</b> Akdeniz’de olmasına rağmen kırık dağdır; önü <b>Amik Ovası</b> (graben).",
    ])
    + """<div class="mt-3 overflow-hidden rounded-xl border border-rose-200 dark:border-rose-700/50 bg-white dark:bg-slate-800 p-2">
        <img src="./src/img/kırık_dağlar.png?v=10" alt="Kırık dağlar" class="w-full h-auto rounded-lg object-contain" loading="lazy">
    </div>"""
    + trap("Amanos = kırık (horst); Torosların diğerleri çoğunlukla kıvrım. Karıştırma."),
    "rose",
))

cards.append(card(
    "2.3 KIVRIM DAĞLAR — ÖRNEKLER",
    ul([
        "Esnek tabaka sıkışır → kıvrım. İki ana kuşak: <b>Kuzey Anadolu Dağları</b> + <b>Toroslar</b>.",
        "<b>Kuzey:</b> Yıldız–Istranca (Trakya) · Küre (Kastamonu–Sinop) · Ilgaz · Köroğlu (Bolu) · Canik (Samsun) · <b>Kaçkarlar</b> (Rize–Artvin; en yüksek kıvrım hattı).",
        "<b>Toros / güney:</b> Bey Dağları (Antalya) · Geyik · Bolkarlar · <b>Aladağlar</b> · Sultan Dağları (Afyon–Konya–Isparta).",
        "<b>Doğu:</b> Mercan / Munzur (Tunceli–Erzincan) · <b>Cilo–Sat</b> (Hakkâri; buzul).",
        "Toroslar: Muğla’dan Van Gölü güneyine kadar uzanan güney kıvrım kuşağıdır.",
    ])
    + """<div class="mt-3 overflow-hidden rounded-xl border border-blue-200 dark:border-blue-700/50 bg-white dark:bg-slate-800 p-2">
        <img src="./src/img/kıvrım_dağlar.png?v=14" alt="Kıvrım dağlar" class="w-full h-auto rounded-lg object-contain" loading="lazy">
    </div>"""
    + trap("Kaçkar = kıvrım (Kuzey Anadolu). Ağrı = volkanik. İkisi de yüksek ama oluşum farklı."),
    "sky",
))

cards.append(card(
    "2.4 VOLKANİK DAĞLAR — ÖRNEKLER",
    ul([
        "Magma yüzeye çıkar → koni. Alan: İç Anadolu + Doğu Anadolu (+ Kula, Karacadağ).",
        "<b>İç Anadolu (Ke–Ke–M–E–Hasan):</b> Karacadağ (Konya) · Karadağ (Karaman) · Melendiz (Niğde) · <b>Erciyes</b> (Kayseri) · <b>Hasan Dağı</b> (Aksaray–Niğde).",
        "<b>Doğu (Ne–S–T–A):</b> <b>Nemrut</b> (Bitlis; krater gölü) · <b>Süphan</b> · <b>Tendürek</b> · <b>Ağrı</b> (Ağrı–Iğdır; en yüksek).",
        "<b>Kula</b> (Manisa): en genç volkanik saha · <b>Mardin–Karacadağ:</b> en yayvan / kalkan volkan.",
        "Derinlik volkanizması: <b>Uludağ</b> (Bursa) = batolit (granit) örneği — yüzey konisi değildir.",
    ])
    + """<div class="mt-3 overflow-hidden rounded-xl border border-red-200 dark:border-red-700/50 bg-white dark:bg-slate-800 p-2">
        <img src="./src/img/volkanik_dağlar.png?v=12" alt="Volkanik dağlar" class="w-full h-auto rounded-lg object-contain" loading="lazy">
    </div>"""
    + trap("İki Karacadağ var: Konya (İç Anadolu volkanı) ≠ Mardin–Karacadağ (GDA kalkan volkan)."),
    "rose",
))

cards.append(card(
    "2.5 DEPREM & FAYLAR",
    ul([
        "<b>Hiposantr</b> yerin içi merkez · <b>Episantır</b> yüzeye izdüşüm (en şiddetli sarsıntı).",
        "<b>KAF:</b> Karlıova → Kuzey Anadolu güneyi → Saros · <b>DAF:</b> Karlıova → Elazığ–Malatya–Maraş → Hatay.",
        "<b>BAF:</b> Ege horst–graben kırık sistemi (çok parçalı).",
        "Genç oluşum + aktif fay → deprem riski yüksek; yerleşim ve ulaşım planlaması kritik.",
    ]) + trap("Deprem kuşağı = yalnız KAF değildir; Ege grabenleri de sarsıntılıdır."),
    "rose",
))

# ── 3 DIŞ KUVVETLER ────────────────────────────────────────────────────
cards.append(card(
    "3.1 DIŞ KUVVETLER — GENEL TABLO",
    table(
        ["Kuvvet", "Nerede baskın?", "Örnek şekil / yer"],
        [
            ["Akarsu", "Yağışlı / eğimli", "Vadi, seki · Çukurova, Bafra delta"],
            ["Rüzgar", "İç / GDA kurak", "Mantar kaya · Karapınar, Develi, Iğdır"],
            ["Buzul", "Yüksek dağlar", "Sirk, U · Ağrı, Cilo, Kaçkar, Uludağ"],
            ["Dalga", "Kıyılar", "Falez (Antalya) · lagün (Terkos)"],
            ["Karst", "Akdeniz / GB", "Obruk, polye · Teke–Taşeli, Pamukkale"],
        ],
    ) + trap("Aynı bölgede birden fazla kuvvet etkili olabilir; ‘en baskın’a bak."),
    "orange",
))

cards.append(card(
    "3.2 DIŞ KUVVET — HIZ & ETKİ",
    ul([
        "Etkiyi artıran: litoloji (yumuşak kaya), eğim, iklim (yağış/kuraklık), bitki örtüsü azlığı, zaman.",
        "Akarsu debisi + eğim ↑ → aşındırma ↑ · taban seviyesine yaklaşınca biriktirme artar.",
        "Kuraklık + çıplak yüzey → rüzgar · yüksek nem + kalker → karst.",
        "Kıyıda dağ uzanışı (paralel/dik) dalga etkisini ve liman/delta potansiyelini belirler.",
    ]),
    "orange",
))

# ── 4 PLATOLAR ─────────────────────────────────────────────────────────
cards.append(card(
    "4.1 PLATO TİPLERİ",
    ul([
        "<b>Karstik:</b> Teke / Taşeli (Akdeniz) · su yer altına sızar · tarım/nüfus zayıf · kıl keçisi.",
        "<b>Volkanik (lav):</b> Doğu + İç Anadolu · Erzurum–Kars en yüksek · Kapadokya tüf.",
        "<b>Aşınım:</b> Çatalca–Kocaeli, Perşembe · uzun süre aşınma ile alçalmış düzlük.",
        "Plato genişliği → Kuvaterner’de <b>epirojenez</b>le toptan yükselmenin kanıtı.",
    ]) + trap("Çatalca–Kocaeli = en alçak + en gelişmiş; Erzurum–Kars = en yüksek."),
    "violet",
))

cards.append(card(
    "4.2 ÖNEMLİ PLATOLAR (EŞLEŞTİRME)",
    ul([
        "<b>Erzurum–Kars–Ardahan:</b> en yüksek · yaz yağışı · çayır · büyükbaş (et–süt).",
        "<b>Kapadokya:</b> peri bacası–turizm · <b>Kırşehir:</b> tarıma uygun volkanik düzlük.",
        "<b>Çatalca–Kocaeli:</b> en alçak + en gelişmiş · sanayi/nüfus · tarım az.",
        "<b>Perşembe</b> (Ordu): aşınım · yeşil · tarım aktif (Çatalca’nın tersi).",
        "<b>Teke / Taşeli:</b> karstik · su yer altı · nüfus seyrek · kıl keçisi.",
        "<b>İç Anadolu:</b> Bozok (Yozgat) · Haymana (Ankara) · Cihanbeyli · Obruk (Konya) · Uzunyayla (Sivas–Kayseri).",
        "<b>Gaziantep Platosu:</b> GDA · Antep fıstığı / tarım.",
    ]),
    "violet",
))

# ── 5 OVALAR ───────────────────────────────────────────────────────────
cards.append(card(
    "5.1 OVA TİPLERİ",
    ul([
        "<b>Delta:</b> alüvyon + sığ kıyı + zayıf gelgit · verimli.",
        "<b>Tektonik:</b> Türkiye’de en yaygın (graben / çöküntü) · Ege, Ergene, Amik, Suluova…",
        "<b>Taban / kıyı ovaları:</b> akarsu birikimi · <b>Karstik (polye):</b> tabanı verimsiz karst malzemesi.",
        "Karstik ovalar kodu: <b>TAKKEM</b> (Tefenni, Acıpayam, Korkuteli, Kestel, Elmalı, Muğla…).",
    ]) + trap("Delta varsa falez olmaz (sığ kıyı ↔ dik kıyı)."),
    "emerald",
))

cards.append(card(
    "5.2 ÖNEMLİ OVALAR",
    ul([
        "<b>Bafra</b> ← Kızılırmak · <b>Çarşamba</b> ← Yeşilırmak · <b>Çukurova</b> ← Seyhan–Ceyhan (en büyük delta).",
        "Ege graben ovaları: Bakırçay, Gediz, Küçük/Büyük Menderes.",
        "En büyük iç ova klasik: <b>Konya Ovası</b> · GDA’da Harran sulamayla öne çıkar.",
        "Marmara: Ergene · Akdeniz: Amik · Karadeniz: delta ovaları nüfus/tarım yoğun.",
    ]),
    "emerald",
))

# ── 6 AKARSU VADİ / ŞELALE ─────────────────────────────────────────────
cards.append(card(
    "6. AKARSU VADİLERİ & ŞELALELER",
    ul([
        "<b>Yatağa gömülme:</b> epirojenezle yükselen arazide akarsuyun yatağını derinleştirmesi.",
        "<b>Sekiler (taraçalar):</b> eski taban seviyesi basamakları · tektonik yükselme göstergesi.",
        "<b>Boğaz vadisi:</b> kıyıya paralel dağları aşan akarsular (Kızılırmak, Yeşilırmak, Seyhan–Ceyhan).",
        "<b>Şelale + dev kazanı:</b> eğim kırığı; örnekler: Tortum, Manavgat, Düden, Kurşunlu, Muradiye.",
    ]) + trap("Boğaz ≠ fiyort. Fiyort buzul kökenlidir; Türkiye’de fiyort kıyısı yoktur."),
    "sky",
))

# ── 7 RÜZGAR ───────────────────────────────────────────────────────────
cards.append(card(
    "7. RÜZGAR ŞEKİLLERİ (TR)",
    ul([
        "En etkili: <b>İç Anadolu</b> + <b>GDA</b> (Konya–Karapınar, Kayseri–Develi, Iğdır mikroklima).",
        "<b>Aşındırma:</b> mantar kaya (şeytan masası) · şahit kaya · tafoni · yardang.",
        "<b>Biriktirme:</b> lös · kıyı / kara kumulları · hilal biçimli <b>barkan</b> tipi kumullar.",
        "Rüzgar höyükleri / kum tepeleri kurak düzlüklerde; peri bacası asıl olarak volkanik tüf + yağmur/rüzgar.",
    ]) + trap("Peri bacası = yalnız rüzgar değildir; Kapadokya’da volkanik tüf + dış kuvvetler."),
    "amber",
))

# ── 8 BUZUL ────────────────────────────────────────────────────────────
cards.append(card(
    "8. BUZUL ŞEKİLLERİ & DAĞILIŞ",
    ul([
        "<b>Aşındırma:</b> sirk (buzul gölleri) · U vadi · hörgüç kaya · cilalı yüzey.",
        "<b>Biriktirme:</b> moren (ön/yan/orta) · sandur ovaları.",
        "<b>Doğu:</b> Ağrı · Süphan · Cilo–Sat (Hakkâri) · Kaçkar (Rize–Artvin).",
        "<b>İç / Batı:</b> Erciyes · Hasan Dağı · Uludağ (Bursa; Kilimli, Kara, Aynalı göller).",
        "<b>Toros:</b> Bolkarlar · Aladağlar (yüksek sirk/buzul kalıntısı).",
        "Günümüz buzulları sınırlı; çoğu şekil eski buzullaşma kalıntısıdır.",
    ]) + trap("U vadi = buzul · V vadi = akarsu. Karıştırma."),
    "cyan",
))

# ── 9 KARST ────────────────────────────────────────────────────────────
cards.append(card(
    "9. KARSTİK ŞEKİLLER",
    ul([
        "<b>Aşındırma:</b> lapya · dolin · uvala · <b>polye</b> (en büyük) · <b>obruk</b> · düden · mağara · kanyon.",
        "<b>Polye örnekleri (TAKKEM):</b> Tefenni, Acıpayam, Korkuteli, Kestel, Elmalı, Muğla…",
        "<b>Biriktirme:</b> sarkıt–dikit · <b>traverten</b> — Pamukkale (Denizli), Antalya traverten platosu.",
        "<b>Mağara:</b> Karain, Damlataş, Dim, İnsuyu, Cennet–Cehennem (Mersin) klasik eşleşmeler.",
        "Yoğun alan: <b>Batı–Orta Toroslar</b> (Teke–Taşeli); obruk gölleri burada sık.",
        "Yüzey suyu az → tarım/nüfus sınırlı; kıl keçisi ve maki ile ilişkilendir.",
    ]) + trap("Obruk ≠ volkanik krater. Obruk karstik çökmedir."),
    "lime",
))

# ── 10 KIYI ────────────────────────────────────────────────────────────
cards.append(card(
    "10. KIYI ŞEKİLLERİ",
    ul([
        "<b>Falez:</b> Doğu/Batı Karadeniz, Antalya, Istranca · delta ile aynı kıyıda olmaz.",
        "<b>Lagün:</b> Terkos, Büyük/Küçükçekmece, Ölüdeniz · <b>Tombolo:</b> Kapıdağ, Sinop İnceburun.",
        "<b>Dalmaçya:</b> Teke güneyi (Finike–Kaş) · <b>Ria:</b> İstanbul/Çanakkale boğazları, Haliç, Gökova.",
        "<b>Kalanlı:</b> Mersin–Silifke · <b>Fiyort:</b> Türkiye’de yok.",
        "Delta kıyıları: Bafra, Çarşamba, Çukurova (sığ + geniş kıta sahanlığı).",
    ]) + trap("Dalmaçya = dağlara paralel · Ria = eski akarsu vadisi (dik). Fiyort çeldiricisine dikkat."),
    "sky",
))

# ── 11 HARİTA ──────────────────────────────────────────────────────────
cards.append(card(
    "11.1 ÖLÇEK & İZOHİPS",
    ul([
        "<b>Ölçek:</b> büyük ölçek → ayrıntı çok, alan küçük · küçük ölçek → alan büyük, ayrıntı az.",
        "Payda küçüldükçe ölçek büyür (1/25.000 > 1/500.000).",
        "<b>İzohips:</b> sık = dik · seyrek = yatay · kapalı + yükselti artışı = tepe · azalış = çukur.",
        "Aynı renk/kot farkı: eş yükselti eğrileri arası yükselti aralığı sabittir.",
    ]) + trap("‘Büyük ölçek’ deyince paydası küçük haritayı seç."),
    "slate",
))

cards.append(card(
    "11.2 BAKİ / EĞİM OKUMA",
    ul([
        "Güneye bakan yamaçlar genelde daha sıcak (bakı); profilde eğim = yükselti/yatay mesafe.",
        "Akarsu yönü: izohipste ‘V’ nin sivri ucu yukarı (kaynak) yönü gösterir.",
        "Boyuna/enine kıyı, dağ uzanışı haritadan okunur → yağış ve liman potansiyeli.",
        "Engebe arttıkça tarım/ulaşım/nüfus azalır (istisna: kıyı metropolleri).",
    ]),
    "slate",
))

# ── 12 İKLİM ───────────────────────────────────────────────────────────
cards.append(card(
    "12.1 SICAKLIK & BASINÇ",
    ul([
        "<b>Gerçek sıcaklık</b> istasyon yüksekliğindeki · <b>indirgenmiş</b> deniz seviyesine çekilmiş.",
        "Her <b>200 m ≈ 1°C</b> (yaklaşık). İzoterm haritası genelde indirgenmiş → yükselti etkisi silinir.",
        "<b>Ocak:</b> en soğuk Doğu Anadolu · <b>Temmuz:</b> en sıcak GDA / güney içleri.",
        "Yazın termik alçak (İç/GDA) · kışın termik yüksek (soğuk karalar) klasik baskı dağılımı.",
    ]) + trap("İndirgenmiş haritada ‘yükselti yüzünden soğuk’ deme; yükselti zaten temizlenmiştir."),
    "rose",
))

cards.append(card(
    "12.2 RÜZGARLAR (YEREL)",
    table(
        ["Rüzgar", "Yön / özellik", "Not"],
        [
            ["Poyraz", "KD → serin/soğuk", "Kışın karayel ile birlikte soğutur"],
            ["Lodos", "GB → ılık nemli", "Kış yağışı; Karadeniz’de fırtına"],
            ["Etezyen", "Ege’de K→G serin", "Yaz mevsimi"],
            ["Meltem / İmbat", "Günlük deniz–kara", "Ege’de imbat"],
            ["Samyeli", "Güneyden sıcak kuru", "GDA / yaz"],
        ],
    ) + trap("TANAP gaz hattı ≠ Samyeli. Rüzgar adlarını yönle ezberle (KayıpSaKaL)."),
    "orange",
))

cards.append(card(
    "12.3 YAĞIŞ & İKLİM TİPLERİ",
    ul([
        "<b>Yamaç (orografik):</b> Karadeniz–Akdeniz (dağlar kıyıya paralel).",
        "<b>Konveksiyon:</b> İç Anadolu kırkikindi · Erzurum–Kars yaz yağışları.",
        "<b>Cephe:</b> kışın batıdan gelen depresyonlar (Akdeniz/Marmara/Ege).",
        "<b>Karadeniz iklimi:</b> her mevsim yağış · <b>Akdeniz:</b> kış yağışlı yaz kurak · <b>Karasal:</b> az yağış, büyük sıcaklık farkı · <b>Marmara geçiş</b>.",
    ]) + trap("Bağıl nem en yüksek genelde Karadeniz; mutlak nem kıyılarda (özellikle sıcak Akdeniz) yüksek olabilir."),
    "rose",
))

# ── 13 SU TOPRAK BİTKİ ─────────────────────────────────────────────────
cards.append(card(
    "13.1 AKARSULAR & GÖLLER",
    ul([
        "Rejim: Karadeniz düzenli · Akdeniz kış yüksek · Doğu Anadolu kar erimesi (ilkbahar).",
        "<b>Uzun akarsular:</b> Kızılırmak (en uzun) · Fırat · Sakarya · Yeşilırmak · Seyhan–Ceyhan · Dicle.",
        "Kapalı havza: Van, Tuz, Burdur, Akşehir, Eber… · açık havza denize dökülür.",
        "<b>Van:</b> en büyük (sodalı) · <b>Tuz:</b> en sığ/tuz · <b>Beyşehir:</b> en büyük tatlı (doğal).",
        "<b>Volkanik göl:</b> Nemrut (Bitlis), Meke (Konya), Acıgöl · <b>Buzul göl:</b> Uludağ (Kilimli…).",
        "Yeraltı / artezyen: çöküntü ovaları ve karstik alanlarda kritik.",
    ]) + trap("En büyük göl = Van (alan). En derin doğal göl sorularında da Van öne çıkar."),
    "cyan",
))

cards.append(card(
    "13.2 TOPRAK & BİTKİ",
    ul([
        "<b>Terra rossa:</b> Akdeniz kalker · <b>podzol:</b> iğne yapraklı orman · <b>çernozyom:</b> çayır (Erzurum–Kars).",
        "<b>Kahverengi step:</b> İç Anadolu · <b>alüvyal:</b> ovalar (en verimli).",
        "Formasyon: orman (K.deniz) · maki (Akdeniz) · bozkır (İç/GDA) · alp çayırı (yüksek dağ).",
        "İrtifa basamakları: maki → kızılçam → karaçam/göknar → alp çayırı (Toros örneği).",
    ]),
    "emerald",
))

# ── 14 AFETLER ─────────────────────────────────────────────────────────
cards.append(card(
    "14. ÇEVRE & DOĞAL AFETLER",
    ul([
        "<b>Deprem:</b> fay kuşakları · en sık/can kaybı riski yüksek afet.",
        "<b>Heyelan:</b> Doğu Karadeniz (eğim + yağış + killi zemin + yol/yapı).",
        "<b>Sel–taşkın:</b> ani sağanak, dar vadiler, kıyı ovaları · <b>çığ:</b> Doğu Anadolu / yüksek dağ.",
        "<b>Erozyon:</b> eğim + yağış rejimi + bitki tahribi; İç Anadolu’da rüzgar erozyonu da önemli.",
    ]) + trap("Heyelan ≠ deprem; tetikleyici olabilir ama asıl süreç kütle hareketidir."),
    "rose",
))

# ── 15 BEŞERİ ──────────────────────────────────────────────────────────
cards.append(card(
    "15.1 NÜFUS DAĞILIŞI & YOĞUNLUK",
    ul([
        "Yoğun: Marmara, kıyı Ege–Akdeniz, Çukurova · Seyrek: Doğu Anadolu yüksekleri, karstik içler.",
        "Etkileyen: iklim, yer şekli, sanayi, tarım, ulaşım, tarihî yollar.",
        "<b>3D</b> (doğal artış) yüksek → doğum fazla (genelde Doğu) · <b>3G</b> (gerçek artış) yüksek → göç alır.",
        "1927 ilk Cumhuriyet sayımı · 2007’den itibaren ADNKS (yıllık).",
    ]) + trap("En kalabalık il ≠ en yoğun il. Yoğunluk = kişi/km²."),
    "violet",
))

cards.append(card(
    "15.2 GÖÇ, PİRAMİT, GÖSTERGELER",
    ul([
        "<b>Göç:</b> kır→kent · doğu→batı · mevsimlik tarım · beyin göçü.",
        "Piramit: geniş taban = genç nüfus · daralan taban = yaşlanma eğilimi.",
        "Göstergeler: doğum–ölüm, doğal artış, ortalama yaşam, kentleşme, bağımlılık oranı.",
        "İşsizlik / istihdam sektör payı (hizmet–sanayi–tarım) beşeri sorularla bağlanır.",
    ]),
    "violet",
))

# ── 16 YERLEŞİM ────────────────────────────────────────────────────────
cards.append(card(
    "16. YERLEŞİM (KIR–KENT)",
    ul([
        "<b>Kır:</b> köy, mezra, kom, yayla · tarım/hayvancılık fonksiyonu baskın.",
        "<b>Kent:</b> nüfus + fonksiyon çeşitliliği (sanayi, ticaret, yönetim, turizm, eğitim).",
        "Site / kasaba: geçiş yerleşmeleri · fonksiyon ve nüfus eşiğiyle ayrılır.",
        "Kıyı–ulaşım–sanayi ekseninde metropolleşme (İstanbul–Kocaeli–İzmir–Ankara–Adana…).",
    ]),
    "indigo",
))

# ── 17 EKONOMİ POLİTİKALARI ────────────────────────────────────────────
cards.append(card(
    "17. EKONOMİ POLİTİKALARI (KPSS)",
    ul([
        "Cumhuriyet erken dönem: devletçilik, karma ekonomi temelleri.",
        "<b>1960–1980 planlı dönem:</b> DPT · beş yıllık kalkınma planları · ithal ikame · dışa görece kapalı.",
        "<b>24 Ocak 1980:</b> açık ekonomi · ihracat teşviki · döviz serbestliği · ithalatın artması.",
        "1990’lar sonrası: özelleştirme, krizler (1994, 2001) · güncel GSYH’de hizmet > sanayi > tarım.",
    ]) + trap("İthal ikame = yerli üretimi koruyarak ithalatı azaltma (planlı dönem). 1980 = ihracata dayalı açılma."),
    "fuchsia",
))

# ── 18–19 TARIM ────────────────────────────────────────────────────────
cards.append(card(
    "18. TARIM KOŞULLARI & YÖNTEMLER",
    ul([
        "Sınırlayan: sıcaklık, yağış, yükselti, toprak, sulama, makineleşme, pazar.",
        "Nadas: yarı kurak İç Anadolu klasik · sulama artınca nadas azalır (<b>GAP, KOP</b>).",
        "Monokültür örnekleri: çay (Rize), incir (Aydın), fındık (Doğu Karadeniz).",
        "Örtüaltı (sera): Antalya–Mersin · erken sebze/meyve · ihracat potansiyeli.",
    ]) + trap("Nadas = toprağı bir yıl boş bırakma; ‘nadas yok = her yer sulu’ değildir."),
    "emerald",
))

cards.append(card(
    "19.1 TAHIL & ENDÜSTRİ BİTKİLERİ",
    table(
        ["Ürün", "Öne çıkan yer", "Not"],
        [
            ["Buğday", "İç Anadolu (Konya vb.)", "En geniş ekim"],
            ["Arpa", "İç / Doğu", "Hayvan yemi"],
            ["Mısır", "Karadeniz kıyı + GAP ovaları", "Yağlık: Çukurova, Konya, Ş.Urfa"],
            ["Pamuk", "Çukurova, Ege, GDA", "Sulama ile artar"],
            ["Tütün", "Ege", "Toprak seçici"],
            ["Şeker pancarı", "İç Anadolu çevresi", "Fabrika yakınlığı"],
            ["Çay", "Doğu Karadeniz (Rize)", "Yılda birden çok hasat"],
            ["Haşhaş", "Afyon / Batı Anadolu", "Devlet kontrollü"],
        ],
    ),
    "emerald",
))

cards.append(card(
    "19.2 MEYVE & YAĞ BİTKİLERİ",
    ul([
        "<b>Fındık:</b> Ordu–Giresun · <b>Zeytin:</b> Manisa–İzmir (Ege + Akdeniz + GDA batısı).",
        "<b>Üzüm:</b> Manisa · <b>İncir:</b> Aydın · <b>Antep fıstığı:</b> GDA · <b>Kayısı:</b> Malatya.",
        "<b>Turunçgil / muz:</b> Akdeniz kıyı (Alanya–Anamur muz) · <b>Gül:</b> Isparta.",
        "<b>Ayçiçeği:</b> Trakya (Ergene) klasik · soya / yer fıstığı Çukurova çevresi.",
    ]) + trap("Çay yalnız Doğu Karadeniz kıyı kuşağında (yüksek nem + ılık kış)."),
    "lime",
))

# ── 20 HAYVANCILIK ─────────────────────────────────────────────────────
cards.append(card(
    "20.1 BÜYÜKBAŞ & KÜÇÜKBAŞ",
    ul([
        "<b>Mera büyükbaş:</b> Erzurum–Kars–Ağrı (çayır) · ahır-besi: yem + pazar (Konya, İzmir…).",
        "<b>Koyun:</b> bozkır düzlük · sayıca en fazla · Van öne çıkar.",
        "<b>Kıl keçisi:</b> Toroslar / maki · Akdeniz; il: Mersin · <b>Tiftik:</b> Ankara.",
        "Manda: sulak · Samsun · kümes: Manisa–Balıkesir.",
    ]) + trap("Kıl keçisi orman tahribatı çeldiricisiyle birlikte sorulur; Toros–maki eşleştir."),
    "amber",
))

cards.append(card(
    "20.2 ARI, İPEK, BALIK",
    ul([
        "<b>Arıcılık:</b> Ordu (Doğu Karadeniz) önde · Adana da önemli · bitki çeşitliliği şart.",
        "<b>İpek böceği:</b> dut · kış ılıklığı · Diyarbakır.",
        "<b>Balıkçılık:</b> Karadeniz avcılık baskın · kültür: alabalık vb. iç sularda.",
        "Geri kalma: kirlilik, usulsüz av, tüketim kültürü, işleme sanayisi yetersizliği.",
    ]),
    "amber",
))

# ── 21 MADENLER ────────────────────────────────────────────────────────
cards.append(card(
    "21. MADENLER — KLASİK EŞLEŞME",
    table(
        ["Maden", "Çıkarım", "İşleme / not"],
        [
            ["Demir", "Divriği (Sivas), Hekimhan", "Karabük–Ereğli (taşkömürü); İskenderun (ithal kömür)"],
            ["Bakır", "Küre, Murgul, Çayeli", "İşleme: Samsun"],
            ["Krom", "Guleman (Elazığ), Fethiye", "İşleme: Elazığ / Antalya"],
            ["Bor", "Eskişehir, Kütahya, Balıkesir, Bursa", "Kırka, Bandırma · dünya rezervinde TR çok yüksek"],
            ["Taşkömürü", "Zonguldak–Bartın", "Enerji + demir-çelik"],
            ["Linyit", "Afşin–Elbistan vb. yaygın", "Termik santral"],
            ["Boksit", "Akseki, Seydişehir", "İşleme: Seydişehir"],
        ],
    ) + trap("Bor ≠ petrol. Bor İç Batı Anadolu’da; petrol GDA’da sınırlıdır."),
    "orange",
))

# ── 22 ENERJİ ──────────────────────────────────────────────────────────
cards.append(card(
    "22. ENERJİ KAYNAKLARI",
    ul([
        "<b>Linyit:</b> termik (Afşin–Elbistan en büyük) · <b>taşkömürü:</b> Zonguldak.",
        "<b>Hidroelektrik:</b> Fırat–Dicle (Keban, Karakaya, Atatürk…) · Doğu Karadeniz potansiyeli.",
        "<b>Doğal gaz:</b> büyük ölçüde ithal · <b>TANAP</b> Azerbaycan→TR→Avrupa · Tuna-1 keşfi.",
        "<b>Rüzgar:</b> Çanakkale, İzmir, Balıkesir, Hatay… · <b>Güneş:</b> GDA / İç güney (Birecik GES).",
        "<b>Nükleer:</b> Mersin <b>Akkuyu</b> (ilk NGS).",
    ]) + trap("TANAP kaynağı Azerbaycan’dır; İran gazı çeldiricisine düşme."),
    "rose",
))

# ── 23 SANAYİ ──────────────────────────────────────────────────────────
cards.append(card(
    "23.1 SANAYİ KUŞAKLARI",
    ul([
        "<b>İstanbul–Kocaeli–Bursa:</b> en yoğun kuşak (otomotiv, kimya, tekstil, gemi…).",
        "<b>İzmir:</b> liman + tarıma dayalı · <b>Adana:</b> pamuklu dokuma / yağ · <b>Gaziantep:</b> GDA ihracat sanayisi.",
        "Ankara: savunma/makine · Denizli: tekstil · Kayseri: mobilya/metal.",
        "Kuruluş yeri: ham madde · enerji · işgücü · ulaşım · pazar · su.",
    ]) + trap("Ham maddeye yakınlık (Karabük) ≠ liman avantajı (İskenderun)."),
    "violet",
))

cards.append(card(
    "23.2 DEMİR–ÇELİK, TEKSTİL, OTOMOTİV",
    ul([
        "<b>Demir–çelik:</b> Karabük, Ereğli (taşkömürü) · İskenderun (ithal kömür + liman).",
        "<b>Otomotiv:</b> Bursa, Kocaeli, Ankara çevresi · ihracat motoru.",
        "<b>Tekstil:</b> İstanbul, Adana, İzmir, Denizli · pamuklu dokuma klasik.",
        "İhracat yapısı: sanayi ürünleri baskın (otomotiv, tekstil, demir–çelik, beyaz eşya).",
    ]),
    "violet",
))

# ── 24 ULAŞIM ──────────────────────────────────────────────────────────
cards.append(card(
    "24.1 KARA, DEMİR, TÜNEL–KÖPRÜ",
    ul([
        "Otoyol–devlet yolları; boğaz köprüleri · Osmangazi · Avrasya Tüneli.",
        "Dağ tünelleri: Zigana, Ovit vb. → kış ulaşımını kolaylaştırır.",
        "Demiryolu: Ankara hub · YHT hatları · sınır demiryolu kapıları.",
        "Ulaşım geliştikçe sanayi ve turizm yayılır; hinterland genişler.",
    ]),
    "sky",
))

cards.append(card(
    "24.2 DENİZ, HAVA, BORU",
    ul([
        "Limanlar: Ambarlı, Mersin, İzmir, İskenderun, Samsun… · Sinop doğal ama hinterlandı dar.",
        "Hava: İstanbul Havalimanı · kargo: Şanlıurfa (GAP).",
        "Petrol: Kerkük–Yumurtalık, BTC · Gaz: TANAP, Mavi Akım vb.",
        "<b>Hinterland:</b> limanın gelişmesini sağlayan ekonomik ard bölge.",
    ]),
    "sky",
))

# ── 25 TURİZM ──────────────────────────────────────────────────────────
cards.append(card(
    "25.1 DENİZ, KÜLTÜR, TERMAL",
    ul([
        "<b>Deniz:</b> Antalya (Kemer, Side, Alanya…), Muğla, İzmir kıyı turizmi.",
        "<b>Kültür:</b> İstanbul, Kapadokya (Nevşehir), Efes, Pamukkale–Hierapolis.",
        "<b>Termal:</b> Afyon, Ankara, Denizli, Bursa, Balıkesir çevresi.",
        "UNESCO / ören yerleri sık eşleştirilir (Göreme, Hierapolis, Xanthos…).",
    ]),
    "teal",
))

cards.append(card(
    "25.2 KIŞ & İNANÇ TURİZMİ",
    ul([
        "<b>Kış:</b> Uludağ (Bursa), Palandöken, Kartalkaya, Erciyes, Saklıkent…",
        "<b>İnanç:</b> Demre–St. Nicholas · Efes · İstanbul · Şanlıurfa–Antep hattı.",
        "Kongre / golf / botanik: Antalya–İstanbul–İzmir tamamlayıcı turizm.",
        "Turizm geliri hizmetler sektörünü güçlendirir; mevsimsellik riski vardır.",
    ]),
    "teal",
))

# ── 26 JEOPOLİTİK ──────────────────────────────────────────────────────
cards.append(card(
    "26.1 BOĞAZLAR & JEOPOLİTİK",
    ul([
        "İstanbul ve Çanakkale boğazları: Montrö (1936) çerçevesinde uluslararası geçiş rejimi.",
        "Üç kıta / enerji ve ticaret koridoru; Karadeniz–Akdeniz bağlantısı.",
        "Ege sorunları: kıta sahanlığı, karasuları, FIR, SAR, adalar.",
        "Sınır: en uzun Suriye · en kısa Nahçıvan · en işlek kapı Kapıkule.",
    ]),
    "rose",
))

cards.append(card(
    "26.2 ENERJİ KORİDORLARI & PROJELER",
    ul([
        "<b>TANAP / TAP:</b> Hazar (Azerbaycan) gazının Türkiye üzerinden Avrupa’ya iletimi.",
        "<b>BTC</b> ve diğer petrol hatları: Doğu–Batı enerji koridoru.",
        "<b>Orta Koridor:</b> Asya–Avrupa kara/demiryolu–lojistik güzergâhı (İpek Yolu alternatifi).",
        "<b>GAP:</b> Fırat–Dicle havzası · tarım + HES + sulama · göçü azaltma hedefi.",
        "Diğer: DAP, KOP, DOKAP, ZBK (Zonguldak–Bartın–Karabük — madene dayalı).",
    ]) + trap("GAP yalnız ‘baraj’ değildir; entegre bölgesel kalkınma projesidir."),
    "indigo",
))

# ── KAPANIŞ / ÖZET ─────────────────────────────────────────────────────
cards.append(card(
    "🔥 ÖSYM SIK EŞLEŞTİRME — 24 SATIR",
    ul([
        "1) 36–42K / 26–45D · 2) ABCD orta kuşak · 3) Bakı tersliği→Karadeniz",
        "4) Epirojenez→platolar · 5) Çukurova en büyük delta · 6) Falez↔delta zıt",
        "7) Fiyort TR’de yok · 8) Dalmaçya→Teke güneyi · 9) 200 m≈1°C",
        "10) İzoterm≈indirgenmiş · 11) Etezyen Ege yaz · 12) Lodos GB",
        "13) Bor→Eskişehir/Kütahya · 14) Krom→Guleman · 15) Taşkömürü→Zonguldak",
        "16) Akkuyu→Mersin · 17) TANAP→Azerbaycan · 18) Çay→Rize",
        "19) Fındık→Ordu–Giresun · 20) GAP→sulama+enerji+tarım",
        "21) Kırık dağ kodu: Kaz–Madra–Yunt–Boz–Aydın–Menteşe",
        "22) Amanos=kırık (horst) + Amik=graben · 23) İç volkan: Erciyes–Hasan–Melendiz…",
        "24) Doğu volkan: Nemrut–Süphan–Tendürek–Ağrı · Kula=en genç · Mardin Karacadağ=kalkan",
    ]),
    "amber",
))

cards.append(card(
    "📌 ÇALIŞMA SIRASI",
    ul([
        "1️⃣ Konum + iklim + harita (sık soru temeli)",
        "2️⃣ Yer şekilleri (iç–dış kuvvet, plato/ova/kıyı/karst)",
        "3️⃣ Su–toprak–bitki + afetler",
        "4️⃣ Beşeri + yerleşim",
        "5️⃣ Ekonomi: tarım–hayvan–maden–enerji–sanayi–ulaşım–turizm",
        "6️⃣ Jeopolitik & bölgesel projeler",
    ]) + trap("Ezber listesini ‘neden orada?’ sorusuyla bağla; aksi halde çeldirici yer değiştirir."),
    "indigo",
))

assert 45 <= len(cards) <= 60, len(cards)

out = Path(__file__).resolve().parents[1] / "notlar" / "cografya-27-not.js"
parts = ",\n\n".join(cards)
text = f"""// notlar/cografya-27-not.js — KPSS COĞRAFYA GENEL TEKRAR (konu 1–26)
window.cografya_27_notlari = [
{parts}
];
"""
out.write_text(text, encoding="utf-8")
print("wrote", out, "cards", len(cards))
