// sorular/oabt_mat-4.js - Lineer Cebir
window.oabt_mat_4_sorulari = [
{
    "question": "Rank-nullity teoremi nedir?",
    "options": ["A) rank(T)+dim ker T = dim tanım uzayı", "B) rank = nullity", "C) det = rank", "D) iz = nullity", "E) taban = ker"],
    "correctAnswerIndex": 0,
    "explanation": "A_{m×n} için rank+nullity=n."
},
{
    "question": "det A = 0 ne anlama gelir?",
    "options": ["A) A birim", "B) Tüm özdeğerler 1", "C) Rank tam", "D) A^{-1} vardır", "E) A tekil, 0 özdeğer, sütunlar bağımlı"],
    "correctAnswerIndex": 4,
    "explanation": "Hacim sıfır; sistem tek çözümle homojen değil."
},
{
    "question": "n bağımsız özvektör ne sağlar?",
    "options": ["A) det=0", "B) iz=0", "C) A köşegenleştirilebilir", "D) A tekildir", "E) Jordan bloğu zorunludur"],
    "correctAnswerIndex": 2,
    "explanation": "P^{-1}AP=D."
},
{
    "question": "Reel simetrik matris için hangisi doğrudur?",
    "options": ["A) Rank 1", "B) Jordan zorunlu", "C) Ortogonal köşegenleştirilebilir, özdeğerler reeldir", "D) Özdeğerler karmaşık olmak zorundadır", "E) Ters yoktur"],
    "correctAnswerIndex": 2,
    "explanation": "Spektral teorem."
},
{
    "question": "(AB)^{-1} formülü hangisidir?",
    "options": ["A) A^{-1} B^{-1}", "B) (BA)^{-1} değil bekle", "C) A B", "D) B A", "E) B^{-1} A^{-1}"],
    "correctAnswerIndex": 4,
    "explanation": "Ters sıra değişir."
},
{
    "question": "Ax=b tutarlılığının geometrik koşulu nedir?",
    "options": ["A) b'nin çekirdekte olması", "B) det A=0 zorunlu", "C) rank A=0", "D) A kare değilse imkânsız", "E) b'nin sütun uzayında olması"],
    "correctAnswerIndex": 4,
    "explanation": "Artırılmış matris rankı A ile eşit."
},
{
    "question": "Cauchy-Schwarz eşitsizliği nedir?",
    "options": ["A) |<u,v>| ≤ ||u|| ||v||", "B) ||u+v||=||u||+||v|| her zaman", "C) <u,v>=0 her çift", "D) Boyut toplamı", "E) Rank çarpımı"],
    "correctAnswerIndex": 0,
    "explanation": "Eşitlik lineer bağımlılıkta."
},
{
    "question": "SVD'nin bir uygulaması hangisidir?",
    "options": ["A) Grup homomorfizması", "B) En küçük kareler ve düşük rank yaklaşım", "C) Yalnızca özdeğer hesabı kare olmayan için imkânsızken özdeğer uydurmak", "D) Determinantı 1 yapmak", "E) Jordan zinciri"],
    "correctAnswerIndex": 1,
    "explanation": "A^+ = V Σ^+ U^T Moore-Penrose."
},
{
    "question": "İz benzerlik altında neden korunur?",
    "options": ["A) Özvektörler aynı kalır", "B) Nullity artar", "C) tr(P^{-1}AP)=tr(A) (döngüsel iz)", "D) Det benzerlikte korunmaz", "E) Rank korunmaz"],
    "correctAnswerIndex": 2,
    "explanation": "Özdeğerler benzerlikte ortaktır, iz onların toplamıdır."
},
{
    "question": "Aşağıdakilerden hangisi Vektör uzayı için doğru bir açıklamadır?",
    "options": ["A) Satır-sütun uzayı rank(A)=boyut sütun uzayı; rank-nullity: rank+nullity=n.", "B) İç çarpım Cauchy-Schwarz; ortonormal taban Gram-Schmidt.", "C) Vektör uzayı cisim üzerinde toplama ve skaler çarpma aksiyomları.", "D) Taban ve boyut lineer bağımsız üreteç; boyut iyi tanımlıdır.", "E) Alt uzay toplam ve skalerle kapalı; kesişim alt uzay, birleşim genelde değil."],
    "correctAnswerIndex": 2,
    "explanation": "Lineer Cebir notundaki temel bilgi."
},
{
    "question": "Taban ve boyut hakkında hangisi doğrudur?",
    "options": ["A) Alt uzay toplam ve skalerle kapalı; kesişim alt uzay, birleşim genelde değil.", "B) Satır-sütun uzayı rank(A)=boyut sütun uzayı; rank-nullity: rank+nullity=n.", "C) İç çarpım Cauchy-Schwarz; ortonormal taban Gram-Schmidt.", "D) Taban ve boyut lineer bağımsız üreteç; boyut iyi tanımlıdır.", "E) Vektör uzayı cisim üzerinde toplama ve skaler çarpma aksiyomları."],
    "correctAnswerIndex": 3,
    "explanation": "Lineer Cebir notundaki temel bilgi."
},
{
    "question": "Alt uzay hangisini ifade eder?",
    "options": ["A) Taban ve boyut lineer bağımsız üreteç; boyut iyi tanımlıdır.", "B) Satır-sütun uzayı rank(A)=boyut sütun uzayı; rank-nullity: rank+nullity=n.", "C) İç çarpım Cauchy-Schwarz; ortonormal taban Gram-Schmidt.", "D) Alt uzay toplam ve skalerle kapalı; kesişim alt uzay, birleşim genelde değil.", "E) Vektör uzayı cisim üzerinde toplama ve skaler çarpma aksiyomları."],
    "correctAnswerIndex": 3,
    "explanation": "Lineer Cebir notundaki temel bilgi."
},
{
    "question": "Satır-sütun uzayı ile ilgili aşağıdakilerden hangisi doğrudur?",
    "options": ["A) İç çarpım Cauchy-Schwarz; ortonormal taban Gram-Schmidt.", "B) Satır-sütun uzayı rank(A)=boyut sütun uzayı; rank-nullity: rank+nullity=n.", "C) Vektör uzayı cisim üzerinde toplama ve skaler çarpma aksiyomları.", "D) Taban ve boyut lineer bağımsız üreteç; boyut iyi tanımlıdır.", "E) Alt uzay toplam ve skalerle kapalı; kesişim alt uzay, birleşim genelde değil."],
    "correctAnswerIndex": 1,
    "explanation": "Lineer Cebir notundaki temel bilgi."
},
{
    "question": "Aşağıdakilerden hangisi İç çarpım için doğru bir açıklamadır?",
    "options": ["A) Satır-sütun uzayı rank(A)=boyut sütun uzayı; rank-nullity: rank+nullity=n.", "B) İç çarpım Cauchy-Schwarz; ortonormal taban Gram-Schmidt.", "C) Vektör uzayı cisim üzerinde toplama ve skaler çarpma aksiyomları.", "D) Taban ve boyut lineer bağımsız üreteç; boyut iyi tanımlıdır.", "E) Alt uzay toplam ve skalerle kapalı; kesişim alt uzay, birleşim genelde değil."],
    "correctAnswerIndex": 1,
    "explanation": "Lineer Cebir notundaki temel bilgi."
},
{
    "question": "Lineer dönüşüm hakkında hangisi doğrudur?",
    "options": ["A) Satır-sütun uzayı rank(A)=boyut sütun uzayı; rank-nullity: rank+nullity=n.", "B) Lineer dönüşüm T(u+v)=T(u)+T(v), T(cu)=cT(u); matris temsili tabana bağlıdır.", "C) Vektör uzayı cisim üzerinde toplama ve skaler çarpma aksiyomları.", "D) Taban ve boyut lineer bağımsız üreteç; boyut iyi tanımlıdır.", "E) Alt uzay toplam ve skalerle kapalı; kesişim alt uzay, birleşim genelde değil."],
    "correctAnswerIndex": 1,
    "explanation": "Lineer Cebir notundaki temel bilgi."
},
{
    "question": "Determinant hangisini ifade eder?",
    "options": ["A) Vektör uzayı cisim üzerinde toplama ve skaler çarpma aksiyomları.", "B) Taban ve boyut lineer bağımsız üreteç; boyut iyi tanımlıdır.", "C) Alt uzay toplam ve skalerle kapalı; kesişim alt uzay, birleşim genelde değil.", "D) Satır-sütun uzayı rank(A)=boyut sütun uzayı; rank-nullity: rank+nullity=n.", "E) Determinant hacim ölçeği; det=0 ⇔ tekil ⇔ 0 özdeğer."],
    "correctAnswerIndex": 4,
    "explanation": "Lineer Cebir notundaki temel bilgi."
},
{
    "question": "Özdeğer-özvektör ile ilgili aşağıdakilerden hangisi doğrudur?",
    "options": ["A) Satır-sütun uzayı rank(A)=boyut sütun uzayı; rank-nullity: rank+nullity=n.", "B) Özdeğer-özvektör Av=λv, v≠0; karakteristik polinom det(A-λI)=0.", "C) Vektör uzayı cisim üzerinde toplama ve skaler çarpma aksiyomları.", "D) Taban ve boyut lineer bağımsız üreteç; boyut iyi tanımlıdır.", "E) Alt uzay toplam ve skalerle kapalı; kesişim alt uzay, birleşim genelde değil."],
    "correctAnswerIndex": 1,
    "explanation": "Lineer Cebir notundaki temel bilgi."
},
{
    "question": "Aşağıdakilerden hangisi Köşegenleştirme için doğru bir açıklamadır?",
    "options": ["A) Vektör uzayı cisim üzerinde toplama ve skaler çarpma aksiyomları.", "B) Taban ve boyut lineer bağımsız üreteç; boyut iyi tanımlıdır.", "C) Alt uzay toplam ve skalerle kapalı; kesişim alt uzay, birleşim genelde değil.", "D) Satır-sütun uzayı rank(A)=boyut sütun uzayı; rank-nullity: rank+nullity=n.", "E) Köşegenleştirme n bağımsız özvektör; simetrik reel matris ortogonal köşegenleşir."],
    "correctAnswerIndex": 4,
    "explanation": "Lineer Cebir notundaki temel bilgi."
},
{
    "question": "Jordan hakkında hangisi doğrudur?",
    "options": ["A) Vektör uzayı cisim üzerinde toplama ve skaler çarpma aksiyomları.", "B) Taban ve boyut lineer bağımsız üreteç; boyut iyi tanımlıdır.", "C) Alt uzay toplam ve skalerle kapalı; kesişim alt uzay, birleşim genelde değil.", "D) Satır-sütun uzayı rank(A)=boyut sütun uzayı; rank-nullity: rank+nullity=n.", "E) Jordan formu özvektör yetmezse zincir; minimal polinom en küçük yok eden."],
    "correctAnswerIndex": 4,
    "explanation": "Lineer Cebir notundaki temel bilgi."
},
{
    "question": "Ax=b hangisini ifade eder?",
    "options": ["A) Alt uzay toplam ve skalerle kapalı; kesişim alt uzay, birleşim genelde değil.", "B) Satır-sütun uzayı rank(A)=boyut sütun uzayı; rank-nullity: rank+nullity=n.", "C) Ax=b tutarlı ⇔ b sütun uzayında; genel çözüm özel + homojen.", "D) Vektör uzayı cisim üzerinde toplama ve skaler çarpma aksiyomları.", "E) Taban ve boyut lineer bağımsız üreteç; boyut iyi tanımlıdır."],
    "correctAnswerIndex": 2,
    "explanation": "Lineer Cebir notundaki temel bilgi."
}
];
