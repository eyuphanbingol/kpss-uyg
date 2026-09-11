// sorular/oabt_mat-6.js - Olasılık
window.oabt_mat_6_sorulari = [
{
    "question": "Olasılık ölçüsünün sayılabilir katkısızlığı nedir?",
    "options": ["A) P(Ω)=0", "B) Bağımsızlık tanımı", "C) Ayrık olayların sayılabilir birleşiminin olasılığı toplamdır", "D) Sonlu toplamsallık yeter ve zorunlu sonsuzda yanlış değildir her uzayda tartışmasız", "E) P negatif olabilir"],
    "correctAnswerIndex": 2,
    "explanation": "Kolmogorov aksiyomları."
},
{
    "question": "Var(X) formülü hangisidir?",
    "options": ["A) P(X=0)", "B) E[X^2] - (E[X])^2", "C) (E X)^2 - E[X^2]", "D) E|X|", "E) F(x)"],
    "correctAnswerIndex": 1,
    "explanation": "Kaydırma: E[(X-μ)^2]."
},
{
    "question": "Cov(X,Y)=0 iken X,Y bağımsız mıdır?",
    "options": ["A) Yalnızca negatifken", "B) P=1 iken hayır", "C) Genelde hayır; yalnızca doğrusal ilişkisizlik", "D) Evet her zaman", "E) Yalnızca kesiklide evet"],
    "correctAnswerIndex": 2,
    "explanation": "Ortak normalde Cov=0 ⇒ bağımsızlık."
},
{
    "question": "Bayes formülünde payda nasıl yazılır?",
    "options": ["A) MGF", "B) Toplam olasılık ile P(D)=Σ P(D|H_i)P(H_i)", "C) Yalnızca P(H)", "D) P(D|H) tek", "E) Varyans"],
    "correctAnswerIndex": 1,
    "explanation": "Normalize sabiti kanıttır."
},
{
    "question": "Zayıf büyük sayılar yasası neye yakınsar?",
    "options": ["A) Medyanın 0'a", "B) Örneklem ortalamasının olasılıkta μ'ye", "C) Hemen hemen her yerde zorunlu olarak aynı ifadeyle sınırlı kalmadan güçlüyü iddia", "D) Dağılımda normale CLT'siz", "E) Varyansın sonsuza"],
    "correctAnswerIndex": 1,
    "explanation": "Güçlü yasa a.s. yakınsama."
},
{
    "question": "CLT'nin sezgisel sonucu nedir?",
    "options": ["A) Bayes geçersizdir", "B) Bağımsız toplamların standardize hali normale yaklaşır", "C) Her dağılım normaldir", "D) Ortalama varyansa eşittir", "E) Poisson binoma gitmez"],
    "correctAnswerIndex": 1,
    "explanation": "n büyük, sonlu varyans."
},
{
    "question": "Üstel dağılımın belleksizlik özelliği nedir?",
    "options": ["A) MGF yoktur", "B) P(X>s+t | X>s)=P(X>t)", "C) P(X=s)=P(X=t)", "D) Varyans=ortalama^3", "E) CLT uygulanamaz"],
    "correctAnswerIndex": 1,
    "explanation": "Poisson süreç bekleme zamanı."
},
{
    "question": "Chebyshev eşitsizliği neyi bağlar?",
    "options": ["A) Tam dağılımı", "B) Bağımsızlığı", "C) MGF'nin yokluğunu", "D) Medyanı ortalama yapmayı", "E) Kuyruk olasılığını varyans ile: P(|X-μ|≥kσ)≤1/k^2"],
    "correctAnswerIndex": 4,
    "explanation": "Dağılım bilinmeden kaba sınır."
},
{
    "question": "Poisson yaklaşımı ne zaman uygundur?",
    "options": ["A) Sürekli uniform", "B) Cauchy kuyruk", "C) n büyük, p küçük, np=λ orta", "D) n küçük p=0,5", "E) Normal varyans 0"],
    "correctAnswerIndex": 2,
    "explanation": "Nadir olaylar."
},
{
    "question": "Olasılık konusunda aşağıdakilerden hangisi yer alır?",
    "options": ["A) Olasılık uzayı (Ω,F,P); P(Ω)=1, sayılabilir katkısızlık.", "B) Gerçek anlam, sözcüğün dilde ilk ve temel karşılığıdır; bağlam değişmeden bu anl", "C) Mecaz anlam, sözcüğün gerçek anlamından uzaklaşıp benzerlik veya ilgilenme yoluy", "D) Eş anlamlı (anlamdaş) sözcükler aynı veya çok yakın kavramı karşılar: deniz-dery", "E) Zıt (karşıt) anlamlı sözcükler birbirini olumsuzlar: açık-kapalı, somut-soyut."],
    "correctAnswerIndex": 0,
    "explanation": "Konu notunda açıkça yer alır."
},
{
    "question": "Olasılık konusunda aşağıdakilerden hangisi yer almaz?",
    "options": ["A) Zıt (karşıt) anlamlı sözcükler birbirini olumsuzlar: açık-kapalı, somut-soyut.", "B) Gerçek anlam, sözcüğün dilde ilk ve temel karşılığıdır; bağlam değişmeden bu anl", "C) Rassal değişken ölçülebilir fonksiyon; dağılım fonksiyonu F sağdan sürekli, monoton.", "D) Mecaz anlam, sözcüğün gerçek anlamından uzaklaşıp benzerlik veya ilgilenme yoluy", "E) Eş anlamlı (anlamdaş) sözcükler aynı veya çok yakın kavramı karşılar: deniz-dery"],
    "correctAnswerIndex": 1,
    "explanation": "Bu ifade bu konunun kapsamı dışındadır."
},
{
    "question": "Olasılık konusunda aşağıdakilerden hangisi yer alır?",
    "options": ["A) Kesikli PMF, sürekli PDF; karışım dağılımları.", "B) Gerçek anlam, sözcüğün dilde ilk ve temel karşılığıdır; bağlam değişmeden bu anl", "C) Mecaz anlam, sözcüğün gerçek anlamından uzaklaşıp benzerlik veya ilgilenme yoluy", "D) Eş anlamlı (anlamdaş) sözcükler aynı veya çok yakın kavramı karşılar: deniz-dery", "E) Zıt (karşıt) anlamlı sözcükler birbirini olumsuzlar: açık-kapalı, somut-soyut."],
    "correctAnswerIndex": 0,
    "explanation": "Konu notunda açıkça yer alır."
},
{
    "question": "Olasılık konusunda aşağıdakilerden hangisi yer almaz?",
    "options": ["A) Zıt (karşıt) anlamlı sözcükler birbirini olumsuzlar: açık-kapalı, somut-soyut.", "B) Gerçek anlam, sözcüğün dilde ilk ve temel karşılığıdır; bağlam değişmeden bu anl", "C) Beklenen değer E[g(X)]=∫ g dP; varyans E[X^2]-(E X)^2.", "D) Mecaz anlam, sözcüğün gerçek anlamından uzaklaşıp benzerlik veya ilgilenme yoluy", "E) Eş anlamlı (anlamdaş) sözcükler aynı veya çok yakın kavramı karşılar: deniz-dery"],
    "correctAnswerIndex": 1,
    "explanation": "Bu ifade bu konunun kapsamı dışındadır."
},
{
    "question": "Olasılık konusunda aşağıdakilerden hangisi yer alır?",
    "options": ["A) Bağımsızlık sigma cebirlerinin çarpımı; Cov=0 bağımsızlık gerektirmez.", "B) Gerçek anlam, sözcüğün dilde ilk ve temel karşılığıdır; bağlam değişmeden bu anl", "C) Mecaz anlam, sözcüğün gerçek anlamından uzaklaşıp benzerlik veya ilgilenme yoluy", "D) Eş anlamlı (anlamdaş) sözcükler aynı veya çok yakın kavramı karşılar: deniz-dery", "E) Zıt (karşıt) anlamlı sözcükler birbirini olumsuzlar: açık-kapalı, somut-soyut."],
    "correctAnswerIndex": 0,
    "explanation": "Konu notunda açıkça yer alır."
},
{
    "question": "Olasılık konusunda aşağıdakilerden hangisi yer almaz?",
    "options": ["A) Zıt (karşıt) anlamlı sözcükler birbirini olumsuzlar: açık-kapalı, somut-soyut.", "B) Gerçek anlam, sözcüğün dilde ilk ve temel karşılığıdır; bağlam değişmeden bu anl", "C) Bayes P(H|D)=P(D|H)P(H)/P(D); toplam olasılık payda.", "D) Mecaz anlam, sözcüğün gerçek anlamından uzaklaşıp benzerlik veya ilgilenme yoluy", "E) Eş anlamlı (anlamdaş) sözcükler aynı veya çok yakın kavramı karşılar: deniz-dery"],
    "correctAnswerIndex": 1,
    "explanation": "Bu ifade bu konunun kapsamı dışındadır."
},
{
    "question": "Olasılık konusunda aşağıdakilerden hangisi yer alır?",
    "options": ["A) Koşullu beklenen E[X|G] projeksiyon (L2).", "B) Gerçek anlam, sözcüğün dilde ilk ve temel karşılığıdır; bağlam değişmeden bu anl", "C) Mecaz anlam, sözcüğün gerçek anlamından uzaklaşıp benzerlik veya ilgilenme yoluy", "D) Eş anlamlı (anlamdaş) sözcükler aynı veya çok yakın kavramı karşılar: deniz-dery", "E) Zıt (karşıt) anlamlı sözcükler birbirini olumsuzlar: açık-kapalı, somut-soyut."],
    "correctAnswerIndex": 0,
    "explanation": "Konu notunda açıkça yer alır."
},
{
    "question": "Olasılık konusunda aşağıdakilerden hangisi yer almaz?",
    "options": ["A) Zıt (karşıt) anlamlı sözcükler birbirini olumsuzlar: açık-kapalı, somut-soyut.", "B) Gerçek anlam, sözcüğün dilde ilk ve temel karşılığıdır; bağlam değişmeden bu anl", "C) KKT (Chebyshev) kuyruk; Chernoff üstel moment.", "D) Mecaz anlam, sözcüğün gerçek anlamından uzaklaşıp benzerlik veya ilgilenme yoluy", "E) Eş anlamlı (anlamdaş) sözcükler aynı veya çok yakın kavramı karşılar: deniz-dery"],
    "correctAnswerIndex": 1,
    "explanation": "Bu ifade bu konunun kapsamı dışındadır."
},
{
    "question": "Olasılık konusunda aşağıdakilerden hangisi yer alır?",
    "options": ["A) Büyük sayılar zayıf/güçlü: örneklem ortalaması μ'ye.", "B) Gerçek anlam, sözcüğün dilde ilk ve temel karşılığıdır; bağlam değişmeden bu anl", "C) Mecaz anlam, sözcüğün gerçek anlamından uzaklaşıp benzerlik veya ilgilenme yoluy", "D) Eş anlamlı (anlamdaş) sözcükler aynı veya çok yakın kavramı karşılar: deniz-dery", "E) Zıt (karşıt) anlamlı sözcükler birbirini olumsuzlar: açık-kapalı, somut-soyut."],
    "correctAnswerIndex": 0,
    "explanation": "Konu notunda açıkça yer alır."
},
{
    "question": "Olasılık konusunda aşağıdakilerden hangisi yer almaz?",
    "options": ["A) Zıt (karşıt) anlamlı sözcükler birbirini olumsuzlar: açık-kapalı, somut-soyut.", "B) Gerçek anlam, sözcüğün dilde ilk ve temel karşılığıdır; bağlam değişmeden bu anl", "C) Merkezi limit (CLT) normalize toplam → N(0,1) (Lindeberg koşulları).", "D) Mecaz anlam, sözcüğün gerçek anlamından uzaklaşıp benzerlik veya ilgilenme yoluy", "E) Eş anlamlı (anlamdaş) sözcükler aynı veya çok yakın kavramı karşılar: deniz-dery"],
    "correctAnswerIndex": 1,
    "explanation": "Bu ifade bu konunun kapsamı dışındadır."
},
{
    "question": "Olasılık konusunda aşağıdakilerden hangisi yer alır?",
    "options": ["A) Bernoulli-Binom-Poisson limit ilişkisi; Poisson nadir olay.", "B) Gerçek anlam, sözcüğün dilde ilk ve temel karşılığıdır; bağlam değişmeden bu anl", "C) Mecaz anlam, sözcüğün gerçek anlamından uzaklaşıp benzerlik veya ilgilenme yoluy", "D) Eş anlamlı (anlamdaş) sözcükler aynı veya çok yakın kavramı karşılar: deniz-dery", "E) Zıt (karşıt) anlamlı sözcükler birbirini olumsuzlar: açık-kapalı, somut-soyut."],
    "correctAnswerIndex": 0,
    "explanation": "Konu notunda açıkça yer alır."
}
];
