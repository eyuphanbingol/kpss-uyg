# -*- coding: utf-8 -*-
"""Build notlar/vatandas-14-not.js — Vatandaşlık Genel Tekrar 1."""
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
    lis = "\n".join(f'        <li>{i}</li>' for i in items)
    return f'<ul class="list-disc list-inside space-y-1.5 text-sm w-full text-left">\n{lis}\n    </ul>'

def table(headers, rows):
    th = "".join(f'<th class="px-2 py-1.5 text-left font-bold border-b border-stone-200 dark:border-stone-600">{h}</th>' for h in headers)
    trs = []
    for r in rows:
        tds = "".join(f'<td class="px-2 py-1.5 border-b border-stone-100 dark:border-stone-700 align-top">{c}</td>' for c in r)
        trs.append(f"<tr>{tds}</tr>")
    return f"""<div class="overflow-x-auto text-sm w-full">
        <table class="w-full min-w-[280px]">
            <thead><tr>{th}</tr></thead>
            <tbody>
                {''.join(trs)}
            </tbody>
        </table>
    </div>"""

cards = []

# ── GİRİŞ ──
cards.append(card(
    "📚 GENEL TEKRAR 1 — NASIL KULLAN",
    ul([
        "Bu konu <b>hukukun temel kavramlarını</b> tek yerde toparlar: kural, yaptırım, dallar, kişi, borçlar, kaynaklar, boşluk.",
        "Önce tabloları ve 🚨 / ÖSYM kutularını ezberle; sonra sorularla pekiştir.",
        "Amaç: çeldiricilere karşı <b>tanım–örnek–istisna</b> üçlüsünü kurmak.",
    ]),
    "indigo",
))

# ── HUKUK KURALLARI ──
cards.append(card(
    "1.1 HUKUK KURALLARI — TANIM",
    ul([
        "Kişilerin <b>birbirleriyle</b> ve <b>devletle</b> ilişkilerini düzenleyen kurallardır.",
        "<b>Kamu gücü</b> tarafından desteklenir.",
        "Uyulması <b>zorunlu</b>dur.",
    ]) + trap("Hukuk = yalnızca ahlak/din değildir; maddi yaptırım ve kamu gücü şarttır."),
    "teal",
))

cards.append(card(
    "1.2 HUKUK KURALLARIYLA SAĞLANANLAR",
    ul([
        "<b>Toplumsal eşitlik</b> (mutlak eşitlik değildir)",
        "<b>Adalet</b>",
        "<b>Özgürlük</b>",
        "<b>Düzen ve barış</b>",
        "Kurallar: <b>genel, soyut, yaptırıma dayalı, sürekli</b>",
    ]) + trap("Eşitlik mutlak değildir — paylaştırıcı adalet fikriyle karıştırma."),
    "teal",
))

cards.append(card(
    "1.3 HUKUK KURALLARININ ÖZELLİKLERİ",
    ul([
        "Toplumsal yaşamı düzenler",
        "Kamu gücüne dayanır",
        "<b>Maddi yaptırım</b> içerir",
        "<b>Değişken</b>dir (zamanla değişebilir)",
        "<b>Sürekli</b>dir",
        "<b>Genel</b>dir (herkese yönelik)",
        "<b>Soyut</b>tur",
        "<b>Adalet</b> amacı güder",
    ]),
    "teal",
))

# ── YAPTIRIM ──
cards.append(card(
    "2.1 YAPTIRIM (MÜEYYİDE)",
    ul([
        "Yaptırım: kurala <b>uymamaya</b> gösterilen tepkidir.",
        "<b>Maddi yaptırım</b> yalnızca <b>hukuk</b>ta vardır.",
        "Din / ahlak / görgü / örf → <b>manevi</b> yaptırım.",
    ]) + trap("Maddi yaptırım = hukuk tekeli. Manevi yaptırımı hukuk yaptırımı sanma."),
    "rose",
))

cards.append(card(
    "2.1b MANEVİ YAPTIRIM",
    ul([
        "<b>Din:</b> günah / uhrevî tepki",
        "<b>Ahlak:</b> vicdan / toplumsal kınama",
        "<b>Görgü:</b> nezaket dışı davranışın tepkisi",
        "<b>Örf:</b> geleneksel tepki",
        "Bunlar <b>maddi yaptırım değildir</b>; kamu gücüyle zorlanmaz.",
    ]),
    "rose",
))

cards.append(card(
    "2.2 YAPTIRIM ÇEŞİTLERİ",
    ul([
        "<b>Ceza</b>",
        "<b>Cebr-i icra</b> (zorla yerine getirme)",
        "<b>Tazminat</b>",
        "<b>İptal</b> (idari işlemlerde)",
        "<b>Hükümsüzlük</b>",
    ]),
    "rose",
))
cards.append(card(
    "2.3 TÜRKİYE’DE CEZALAR",
    ul([
        "TR’de cezalar: <b>hapis</b> + <b>para</b> cezası.",
        "<b>Disiplin cezası TCK’da yoktur</b>; <b>657</b> sayılı Kanun’da vardır.",
        "Türkiye’de <b>yoktur:</b> idam, genel müsadere, kıssas, sürgün.",
    ]) + trap("Disiplin cezası = 657; TCK’da arama. İdam/kıssas/sürgün/genel müsadere yok."),
    "rose",
))

cards.append(card(
    "2.4 HÜKÜMSÜZLÜK — GENEL",
    ul([
        "Hükümsüzlük türleri: <b>Yokluk</b>, <b>Butlan</b> (mutlak / nispi), <b>Tek taraflı bağlamazlık</b>.",
        "Kurucu unsur eksikliği → yokluk.",
        "Emredici kurala aykırılık → mutlak butlan.",
        "İrade sakatlığı → nispi butlan.",
    ]),
    "rose",
))

cards.append(card(
    "2.5 YOKLUK",
    ul([
        "<b>Kurucu unsur</b> yoksa işlem yok hükmündedir.",
        "Örnek: Evlilik <b>memur önünde</b> yapılmalıdır; memur yoksa evlilik <b>yok</b>tur.",
    ]) + trap("Yokluk ≠ butlan. Yoklukta işlem hiç doğmamıştır."),
    "rose",
))

cards.append(card(
    "2.6 BUTLAN — MUTLAK / NİSPİ",
    table(
        ["Tür", "Sebep", "Örnek"],
        [
            ["<b>Mutlak butlan</b>", "Emredici kurala aykırı", "Öz dayı ile evlilik"],
            ["<b>Nispi butlan</b>", "İrade sakatlığı", "Sarhoşken yapılan sözleşme"],
        ],
    ) + trap("Mutlak = emredici aykırı; nispi = irade sakatlığı."),
    "rose",
))

cards.append(card(
    "2.7 TEK TARAFLI BAĞLAMAZLIK",
    ul([
        "Örnek: <b>Küçük + reşit</b> arasında sözleşme.",
        "Küçük için bağlayıcı değildir; <b>veli icazeti</b> ile bağlar.",
        "Reşit taraf için kural farklı değerlendirilir.",
    ]),
    "rose",
))

# ── HUKUK TÜRLERİ ──
cards.append(card(
    "3. HUKUK TÜRLERİ",
    table(
        ["Tür", "Anlam"],
        [
            ["<b>Pozitif (müspet)</b>", "Yürürlükteki tüm hukuk (yazılı + yazısız)"],
            ["<b>Mevzu hukuk</b>", "Yazılı yürürlükteki hukuk"],
            ["<b>Tabii / ideal / doğal</b>", "Olması gereken hukuk"],
            ["<b>Tarihi hukuk</b>", "Kalkmış / yürürlükten kalkmış hukuk"],
        ],
    ) + trap("Pozitif = yazılı + yazısız. Mevzu = yalnızca yazılı."),
    "violet",
))

# ── KURAL TÜRLERİ ──
cards.append(card(
    "4. HUKUK KURALLARININ TÜRLERİ",
    ul([
        "<b>Emredici / amir</b> kurallar — aksi kararlaştırılamaz",
        "<b>Tamamlayıcı</b> kurallar — boşluğu doldurur",
        "<b>Yorumlayıcı</b> kurallar — örn. ayın başı = <b>1</b>",
        "<b>Tanımlayıcı</b> kurallar",
        "<b>Yetki verici</b> kurallar — örn. <b>miras reddi</b>",
    ]) + trap("Yorumlayıcı örnek: ayın başı = ayın 1’i. Yetki verici: miras reddi."),
    "violet",
))

# ── HUKUK DALLARI ──
cards.append(card(
    "5.0 HUKUK DALLARI — ÜÇLÜ AYIRIM",
    ul([
        "<b>Kamu hukuku:</b> devlet–kişi / devlet organları ilişkisi",
        "<b>Özel hukuk:</b> eşitler arası ilişkiler",
        "<b>Karma:</b> hem kamu hem özel nitelik taşıyan dallar",
    ]) + trap("İş / FSEK / bankacılık / toprak / çevre → karma; “salt özel” veya “salt kamu” deme."),
    "sky",
))

cards.append(card(
    "5.1 KAMU HUKUKU DALLARI",
    ul([
        "Anayasa Hukuku",
        "İdare Hukuku",
        "Devletler Genel Hukuku",
        "Yargılama Hukuku",
        "İcra–İflas Hukuku",
        "Ceza Hukuku",
        "Vergi Hukuku",
    ]),
    "sky",
))
cards.append(card(
    "5.2 ÖZEL HUKUK DALLARI",
    ul([
        "Ticaret Hukuku",
        "Devletler Özel Hukuku",
        "<b>Medeni Hukuk:</b> Şahıs · Eşya · Miras · Aile",
        "Borçlar Hukuku",
    ]),
    "sky",
))

cards.append(card(
    "5.3 KARMA HUKUK DALLARI",
    ul([
        "İş Hukuku",
        "FSEK (Fikir ve Sanat Eserleri)",
        "Bankacılık Hukuku",
        "Toprak Hukuku",
        "Çevre Hukuku",
    ]) + trap("İş / FSEK / bankacılık / toprak / çevre = karma; tamamen kamu veya özel sanma."),
    "sky",
))

# ── CEZA EHLİYETİ ──
cards.append(card(
    "6.1 CEZA EHLİYETİ — YAŞ",
    table(
        ["Yaş", "Durum"],
        [
            ["<b>0–12</b>", "Ceza ehliyeti <b>yok</b>"],
            ["<b>13–15</b>", "İndirimli sorumluluk <b>veya</b> yok"],
            ["<b>16–18</b>", "<b>Sınırlı indirimli</b> sorumluluk"],
            ["<b>18+</b>", "<b>Tam</b> ceza ehliyeti"],
        ],
    ),
    "orange",
))

cards.append(card(
    "6.2 SAĞIR–DİLSİZ",
    ul([
        "Sağır–dilsizlerde yaş sınırlarına <b>+3 yaş</b> eklenir.",
        "ÖSYM sıkça +3’ü unutturur veya yanlış yaşa uygular.",
    ]) + trap("Sağır–dilsiz = ilgili yaş bandına +3."),
    "orange",
))

# ── VERGİ ──
cards.append(card(
    "7. VERGİ İLKELERİ",
    ul([
        "<b>Genellik</b>",
        "<b>Adalet</b>",
        "<b>Kanunilik</b> — vergi <b>kanunla</b> konulur / kaldırılır",
        "Alt–üst limitleri belirleme: <b>Cumhurbaşkanı (CB)</b>",
        "<b>Paylaştırıcı adalet:</b> yüksek gelire yüksek vergi",
    ]) + trap("Kanunilik ≠ CB’nin vergiyi sıfırdan koyması. Limit CB; koyma/kaldırma kanun."),
    "amber",
))

# ── MEDENİ — KİŞİ ──
cards.append(card(
    "8.1 GERÇEK KİŞİLİK",
    ul([
        "Gerçek kişilik: <b>tam</b> ve <b>sağ</b> doğumla başlar.",
        "Doğum <b>nüfus kütüğüne</b> yazılır.",
        "Ölüm: <b>10 gün</b> içinde bildirim.",
    ]),
    "emerald",
))

cards.append(card(
    "8.2 ÖLÜM KARİNESİ",
    ul([
        "Ölüm karinesi: <b>mülki amir</b> kararıyla.",
        "Birden fazla kişinin ölümünde <b>ölüm karinesi = aynı anda</b> ölmüş sayılır.",
        "(Miras sıralaması için önemli.)",
    ]) + trap("Birden fazla ölüm karinesi → aynı anda; birbirinin mirasçısı olmaz varsayımı."),
    "emerald",
))

cards.append(card(
    "8.3 GAİPLİK",
    table(
        ["Durum", "Başvuru süresi", "Miras için"],
        [
            ["Ölüm tehlikesi", "<b>1 yıl</b>", "<b>5 yıl</b>"],
            ["Haber alınamama", "<b>5 yıl</b>", "<b>15 yıl</b>"],
        ],
    ) + ul([
        "Mahkeme: <b>Sulh Hukuk Mahkemesi</b>.",
    ]) + trap("Gaiplik (Gaplik değil!). Ölüm tehlikesi 1/5; haber alınamama 5/15. Sulh Hukuk."),
    "emerald",
))

cards.append(card(
    "8.4 TÜZEL KİŞİLER",
    ul([
        "<b>Dernek:</b> ≥ <b>7</b> kişi; kazanç paylaşma yok",
        "<b>Vakıf:</b> mal topluluğu",
        "Şirket",
        "<b>TRT</b>",
        "<b>Kamu tüzel:</b> devlet, il özel idare",
    ]),
    "emerald",
))

cards.append(card(
    "8.5 HAK EHLİYETİ / FİİL EHLİYETİ",
    ul([
        "<b>Hak ehliyeti:</b> ana rahmine düşmeyle başlar; ancak <b>sağ ve tam doğum</b> şarttır.",
        "<b>Fiil ehliyeti</b> için: <b>reşit</b> + <b>ayırt etme gücü</b> + <b>kısıtlı olmamak</b>.",
        "Tüzel kişide hak ehliyeti <b>kuruluşla</b>; fiil ehliyeti <b>zorunlu organlarla</b>.",
    ]) + trap("Hak ehliyeti ≠ fiil ehliyeti. Ana rahmi + sağ tam doğum şartı."),
    "emerald",
))

cards.append(card(
    "8.6 ERGİNLİK",
    ul([
        "Normal erginlik: <b>18</b>",
        "Evlilikle: <b>17</b> / olağanüstü hâllerde <b>16</b>",
        "<b>Kaza-i rüşt:</b> <b>15+</b> istek + izin + menfaat",
    ]),
    "emerald",
))

cards.append(card(
    "8.7 FİİL EHLİYETİ SINIFLARI",
    table(
        ["Sınıf", "Kim / özellik"],
        [
            ["<b>Tam ehliyetli</b>", "Reşit + ayırt etme + kısıtsız"],
            ["<b>Sınırlı ehliyetli</b>", "Yasal danışman; eş rızası gereken işlemler"],
            ["<b>Sınırlı ehliyetsiz</b>", "12–18; kefalet / bağış / vakıf yasak"],
            ["<b>Tam ehliyetsiz</b>", "0–12 veya ayırt etme yok"],
        ],
    ) + trap("Sınırlı ehliyetsiz: 12–18 — kefalet, bağış, vakıf kurma yasak."),
    "emerald",
))

cards.append(card(
    "8.7b SINIRLI EHLİYETLİ vs EHLİYETSİZ",
    ul([
        "<b>Sınırlı ehliyetli:</b> kural olarak ehliyetli; bazı işlemlerde <b>yasal danışman</b> veya <b>eş rızası</b> gerekir",
        "<b>Sınırlı ehliyetsiz (12–18):</b> ayırt etme varsa bazı işlemleri yapabilir; <b>kefalet, bağış, vakıf</b> yasak",
        "<b>Tam ehliyetsiz:</b> ayırt etme yok veya 0–12 — kural olarak yasal temsilci işlem yapar",
    ]),
    "emerald",
))
cards.append(card(
    "8.8 HISIMLIK",
    ul([
        "Türler: <b>kan</b> hısımlığı, <b>kayın</b> hısımlığı, <b>yapay</b> hısımlık",
        "Dereceler: üst soy · alt soy · yan soy",
        "Koruma kurumları: <b>velayet</b>, <b>vesayet</b>, <b>kayyum</b>",
    ]),
    "emerald",
))

cards.append(card(
    "8.9 AİLE — KISA",
    ul([
        "Aile hukuku: evlilik, nişan, boşanma, velayet ilişkilerini düzenler.",
        "Evliliğin kurucu unsuru: yetkili <b>memur önünde</b> (yokluk bağlantısı).",
    ]),
    "emerald",
))

cards.append(card(
    "8.10 MİRAS — KISA",
    ul([
        "<b>Muris:</b> miras bırakan",
        "<b>Varis:</b> mirasçı",
        "<b>Tereke:</b> miras bırakanın malvarlığı (aktif–pasif)",
        "Miras reddi → <b>yetki verici</b> kural örneği",
    ]),
    "emerald",
))

cards.append(card(
    "8.11 EŞYA — KISA",
    ul([
        "Eşya hukuku: mülkiyet, sınırlı ayni haklar, zilyetlik.",
        "Ayni haklar genelde <b>mutlak</b> hak (herkese karşı ileri sürülebilir).",
    ]),
    "emerald",
))

# ── BORÇLAR ──
cards.append(card(
    "9.1 BORÇLAR HUKUKU İLKELERİ (1)",
    ul([
        "<b>İrade özerkliği</b> — taraflar sözleşmenin içeriğini belirler",
        "<b>Eşitlik</b> — taraflar hukuken eşittir",
        "<b>Nisbilik</b> — borç ilişkisi kural olarak tarafları bağlar",
        "<b>Dürüstlük</b> — <b>TMK m. 2</b>; ana / temel ilkedir",
    ]) + trap("Dürüstlük ilkesi TMK 2 — borçlar/özel hukukun ana ilkesi olarak sık sorulur."),
    "indigo",
))

cards.append(card(
    "9.2 BORÇLAR HUKUKU İLKELERİ (2)",
    ul([
        "<b>Kusurlu sorumluluk</b> (kural; istisnalar ayrı)",
        "<b>İvazlık</b> — karşılık beklentisi",
        "Ödeme yeri: kural olarak <b>borçlunun ikametgâhı</b> (para ve parça borçları hariç)",
        "<b>Üçüncü kişi aleyhine borç kurulamaz</b>",
    ]),
    "indigo",
))

cards.append(card(
    "9.2b İLKELER — KISA ÖRNEKLER",
    ul([
        "<b>İrade özerkliği:</b> taraflar sözleşmenin konusunu/şartlarını belirler (emredici sınırlar saklı)",
        "<b>Eşitlik:</b> alacaklı–borçlu hukuken eşit konumda",
        "<b>Nisbilik:</b> A–B sözleşmesi C’yi kural olarak bağlamaz",
        "<b>İvazlık:</b> satışta mal ↔ bedel",
        "<b>Ödeme yeri:</b> para borcu kural olarak alacaklı yerinde; genel kural borçlu ikametgâhı (para/parça hariç)",
    ]),
    "indigo",
))
cards.append(card(
    "9.3 EDİM VE BORÇ KAYNAKLARI",
    ul([
        "<b>Edim:</b> borç ilişkisinin konusu olan davranış (verme / yapma / yapmama)",
        "Borç doğuran sebepler:",
        "1) <b>Hukuki işlem</b> (sözleşme vb.)",
        "2) <b>Haksız fiil</b>",
        "3) <b>Sebepsiz zenginleşme</b>",
    ]),
    "indigo",
))

cards.append(card(
    "9.4 BORCUN SONA ERMESİ",
    ul([
        "<b>İfa</b> — edimin yerine getirilmesi",
        "<b>İbra</b> — alacaklının vazgeçmesi",
        "<b>Tecdit</b> — yenileme",
        "<b>Birleşme</b> — alacaklı ve borçlu sıfatının birleşmesi",
        "<b>Kusursuz imkânsızlık</b>",
        "<b>Takas</b>",
        "<b>Zamanaşımı</b> — dikkat: özel ÖSYM tuzağı!",
    ]),
    "indigo",
))

cards.append(card(
    "9.4b SONA ERME — KISA ÖRNEKLER",
    ul([
        "<b>İfa:</b> satılan malın teslimi / bedelin ödenmesi",
        "<b>İbra:</b> alacaklı “alacağımdan vazgeçtim”",
        "<b>Tecdit:</b> eski borç yerine yeni borç ilişkisi",
        "<b>Birleşme:</b> miras vb. ile alacaklı–borçlu sıfatı bir kişide toplanır",
        "<b>Takas:</b> karşılıklı borçların mahsubu",
        "<b>Kusursuz imkânsızlık:</b> edim objektif olarak imkânsızlaşır, kusur yok",
    ]),
    "indigo",
))
cards.append(card(
    "9.5 ZAMANAŞIMI — EKSİK BORÇ",
    ul([
        "Zamanaşımı borcu <b>sona erdirmez</b>.",
        "Borç <b>eksik borç</b> hâline gelir.",
        "Borçlu <b>def’i</b> ileri sürebilir (ödemeyi reddedebilir).",
        "İfa edilirse geri istenemez (kural).",
    ]) + trap("ÖSYM: Zamanaşımı = borç bitti ❌. Doğru: eksik borç + def’i."),
    "indigo",
))

# ── ÖZEL HAKLAR ──
cards.append(card(
    "10.1 ÖZEL HAKLAR — MUTLAK / NİSPİ",
    ul([
        "<b>Mutlak hak:</b> herkese karşı ileri sürülebilir (örn. ayni hak, kişilik hakları)",
        "<b>Nispi hak:</b> yalnızca belirli kişiye karşı (örn. alacak hakkı)",
    ]),
    "violet",
))

cards.append(card(
    "10.2 ÖZEL HAKLAR — DİĞER AYRIMLAR",
    ul([
        "<b>Mal varlığı hakları</b> / <b>Kişilik hakları</b>",
        "<b>Devredilebilir</b> / <b>Devredilemez</b>",
        "<b>Yenilik doğuran haklar</b> vs <b>alelade haklar</b>",
        "Yenilik doğuran: <b>kurucu</b> · <b>değiştirici</b> · <b>bozucu</b>",
        "Alelade örnek bağlamı: <b>velayet</b> (sürekli/statü)",
    ]),
    "violet",
))

# ── KAZANMA / KAYBETME ──
cards.append(card(
    "11.1 HUKUKİ OLAY – FİİL – İŞLEM",
    ul([
        "<b>Hukuki olay:</b> irade dışı da olsa hukuki sonuç doğuran olay (örn. doğum, ölüm, zamanaşımı)",
        "<b>Hukuki fiil:</b> iradi davranış; hukuki sonuç doğurur (izin verilen / yasaklanan)",
        "<b>Hukuki işlem:</b> hukuki sonuç doğurma iradesiyle yapılan işlem (sözleşme, tek taraflı işlem)",
    ]),
    "sky",
))

cards.append(card(
    "11.2 MEŞRU MÜDAFAA / ZARURET / KUVVET",
    ul([
        "<b>Meşru müdafaa:</b> saldırıya karşı orantılı savunma",
        "<b>Zaruret (zorunluluk) hâli:</b> daha ağır zararı önlemek için başka çare yokluğu",
        "<b>Kuvvet kullanma:</b> hukuken izin verilen zor kullanma (yetkili makamlar vb.)",
    ]),
    "sky",
))

# ── KAYNAKLAR ──
cards.append(card(
    "12.1 HUKUKUN KAYNAKLARI — ASLİ / TALİ",
    ul([
        "<b>Asli yazılı</b> kaynaklar: Anayasa, kanun, CBK, yönetmelik…",
        "<b>Asli yazısız:</b> örf–adet hukuku",
        "<b>Tali kaynaklar:</b> doktrin, içtihat — <b>bağlayıcı değildir</b> (İBK hariç!)",
    ]) + trap("İçtihat genel olarak bağlayıcı değil; İBK bağlayıcı yazılı asli kaynaktır."),
    "amber",
))

cards.append(card(
    "12.2 NORM HİYERARŞİSİ (ÖZET)",
    ul([
        "<b>Anayasa</b>",
        "<b>Kanun</b>",
        "<b>Uluslararası antlaşmalar</b> — temel hak ve özgürlüklerde kanunla çakışırsa <b>antlaşma</b> uygulanır",
        "<b>CBK</b> — olağan CBK: sosyal–ekonomik alanda",
        "<b>Meclis İçtüzüğü</b>",
        "<b>İBK</b> — İçtihadı Birleştirme Kararı",
        "<b>Yönetmelik</b>",
        "<b>Genelge</b>",
    ]),
    "amber",
))

cards.append(card(
    "12.2b NORM — ÖSYM NOTLARI",
    ul([
        "Ususlararası antlaşma vs kanun: <b>temel hak</b> alanında çakışmada <b>antlaşma</b>",
        "Olağan <b>CBK</b>: sosyal–ekonomik düzenlemeler",
        "<b>Meclis İçtüzüğü</b>: TBMM’nin çalışma usulü",
        "<b>Yönetmelik:</b> kanun/CBK’nın uygulanması",
        "<b>Genelge:</b> idarenin iç düzenleyici / yol gösterici metni (hiyerarşide alt)",
    ]),
    "amber",
))
cards.append(card(
    "12.3 İBK — BAĞLAYICI!",
    ul([
        "İçtihadı Birleştirme Kararı (<b>İBK</b>) <b>bağlayıcıdır</b>.",
        "Yazılı <b>asli</b> kaynak sayılır.",
        "Sıradan Yargıtay/Danıştay kararıyla karıştırma.",
    ]) + trap("ÖSYM: İBK bağlayıcıdır; doktrin/içtihat genel olarak değildir."),
    "amber",
))

cards.append(card(
    "12.4 KIYAS",
    ul([
        "Kıyas = <b>kaynak değildir</b>; bir <b>yorum / uygulama</b> yöntemidir.",
        "<b>Ceza hukukunda kıyas yasaktır</b> (kanunilik ilkesi).",
    ]) + trap("Kıyas kaynağı sanma. Ceza + kıyas = yasak."),
    "amber",
))

# ── BOŞLUK ──
cards.append(card(
    "13.1 HUKUK BOŞLUĞU",
    ul([
        "Hukuk boşluğu varsa <b>hâkim hukuk yaratır</b>.",
        "Yaratılan kural <b>yalnızca o olay</b> için geçerlidir (genel kanun koyma değildir).",
    ]) + trap("Hâkim = o uyuşmazlık için kural yaratır; yasama organı gibi genel norm koymaz."),
    "rose",
))

cards.append(card(
    "13.2 KANUN BOŞLUĞU",
    ul([
        "Kanun boşluğu → önce <b>örf–adet</b>e bakılır.",
        "Örf–adet yoksa → <b>hukuk boşluğu</b> yolu (hâkim hukuk yaratır).",
    ]),
    "rose",
))

cards.append(card(
    "13.3 KURAL İÇİ / KURAL DIŞI / ÖRTÜLÜ BOŞLUK",
    ul([
        "<b>Kural içi (bilinçli) boşluk:</b> kanun bilerek takdir alanı bırakmış → hâkim <b>takdir</b> yetkisi kullanır",
        "<b>Kural dışı (bilinçsiz) boşluk:</b> kanun boşluğu yolu izlenir",
        "<b>Örtülü boşluk:</b> kuralı <b>daraltma</b> / <b>istisna</b> tanıma gerekir",
    ]),
    "rose",
))

cards.append(card(
    "13.4 HÂKİM NE YAPAR? — ÖZET TABLO",
    table(
        ["Boşluk", "Hâkimin yolu"],
        [
            ["Hukuk boşluğu", "Hukuk yaratır (o olay)"],
            ["Kanun boşluğu", "Örf–adet → yoksa hukuk yaratır"],
            ["Kural içi (bilinçli)", "Takdir yetkisi"],
            ["Kural dışı (bilinçsiz)", "Kanun boşluğu yolu"],
            ["Örtülü", "Kuralı daralt / istisna"],
        ],
    ),
    "rose",
))

# ── ÖZET KARTLARI ──
cards.append(card(
    "14.1 SIK SORULAN 12 ÇELDİRİCİ",
    ul([
        "1) Maddi yaptırım yalnız hukukta",
        "2) Disiplin cezası TCK’da yok, 657’de var",
        "3) İdam / kıssas / sürgün / genel müsadere yok",
        "4) Pozitif ≠ mevzu (yazısız dahil)",
        "5) Ayın başı = 1 (yorumlayıcı)",
        "6) Gaiplik: 1–5 / 5–15 + Sulh Hukuk",
        "7) Zamanaşımı = eksik borç + def’i",
        "8) İBK bağlayıcı yazılı asli",
        "9) Kıyas kaynak değil; cezada yasak",
        "10) Hâkim hukuk yaratır → yalnız o olay",
        "11) Vergi kanunla; limit CB",
        "12) Sağır–dilsiz +3 yaş",
    ]),
    "amber",
))

cards.append(card(
    "14.2 HIZLI EŞLEŞTİRME",
    table(
        ["Kavram", "Anahtar"],
        [
            ["Yokluk", "Kurucu unsur yok (memursuz evlilik)"],
            ["Mutlak butlan", "Emredici aykırı (öz dayı)"],
            ["Nispi butlan", "İrade sakatlığı (sarhoş)"],
            ["Dürüstlük", "TMK 2"],
            ["Dernek", "≥7, kazanç paylaşmaz"],
            ["Vakıf", "Mal topluluğu"],
            ["Kaza-i rüşt", "15+ istek+izin+menfaat"],
        ],
    ),
    "indigo",
))

cards.append(card(
    "14.3 ÇALIŞMA SIRASI",
    ul([
        "1️⃣ Hukuk kuralı + yaptırım + hükümsüzlük",
        "2️⃣ Hukuk türleri / kural türleri / dallar",
        "3️⃣ Ceza ehliyeti + vergi ilkeleri",
        "4️⃣ Kişi · gaiplik · fiil ehliyeti · hısımlık",
        "5️⃣ Borçlar ilkeleri + sona erme (zamanaşımı!)",
        "6️⃣ Özel haklar + hukuki olay/fiil/işlem",
        "7️⃣ Kaynaklar (İBK) + boşluk + kıyas",
    ]),
    "indigo",
))

out = Path(__file__).resolve().parents[1] / "notlar" / "vatandas-14-not.js"
parts = ",\n\n".join(cards)
text = f"""// notlar/vatandas-14-not.js — KPSS VATANDAŞLIK GENEL TEKRAR 1
window.vatandas_14_notlari = [
{parts}
];
"""
out.write_text(text, encoding="utf-8")
print("wrote", out, "cards", len(cards))
