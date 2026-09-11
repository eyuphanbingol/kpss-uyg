// sorular/oabt_mat-7.js - İstatistik
window.oabt_mat_7_sorulari = [
{
    "question": "Yansız tahmin edici ne demektir?",
    "options": ["A) Tutarlı değildir", "B) E[θ̂] = θ her θ için", "C) Var(θ̂)=0", "D) θ̂=θ her örneklemde", "E) MSE=0"],
    "correctAnswerIndex": 1,
    "explanation": "Ortalamada hedefi tutturmak; tek örneklemde sapma olabilir."
},
{
    "question": "Güven aralığının sıkça yanlış yorumu hangisidir?",
    "options": ["A) Aralık rastgeledir", "B) θ sabittir klasik yorumda", "C) Kapsama uzun vadeli orandır", "D) Parametre %95 olasılıkla bu sabit aralıktadır", "E) Yöntem tekrarda yaklaşık %95 kapsar"],
    "correctAnswerIndex": 3,
    "explanation": "Klasik CI: rastgele olan aralık, θ sabit."
},
{
    "question": "p-değeri nedir?",
    "options": ["A) H0 doğruysa mevcut kadar uç veri görme olasılığı", "B) P(H0|veri)", "C) I. tip hata olmayan kesin kanıt", "D) Etki büyüklüğü", "E) Güç"],
    "correctAnswerIndex": 0,
    "explanation": "Küçük p, H0 ile verinin uyumsuzluğudur; etki boyutu değildir."
},
{
    "question": "I. tip hata nedir?",
    "options": ["A) H0 doğruken reddetmek (α)", "B) H0 yanlışken kabul (β)", "C) Güç", "D) MSE", "E) Yansızlık"],
    "correctAnswerIndex": 0,
    "explanation": "II. tip: yanlış H0'ı tutmak."
},
{
    "question": "MLE'nin sezgisel tanımı nedir?",
    "options": ["A) Prior'un kipi", "B) En küçük varyanslı her n'de", "C) Güven aralığının orta noktası zorunlu", "D) Gözlenen veriyi en olası kılan parametre", "E) Her zaman yansız ortalama"],
    "correctAnswerIndex": 3,
    "explanation": "argmax L(θ|x)."
},
{
    "question": "Gauss-Markov teoremi neyi söyler?",
    "options": ["A) Normallik zorunlu", "B) R^2=1", "C) Artıklar bağımlı olmalıdır", "D) Klasik varsayımlarda EKK en iyi lineer yansız tahminedicidir", "E) EKK her zaman en küçük MSE"],
    "correctAnswerIndex": 3,
    "explanation": "BLUE: Best Linear Unbiased Estimator."
},
{
    "question": "R^2'nin sınırlılığı nedir?",
    "options": ["A) Gücü ölçer", "B) Gereksiz değişken eklemek R^2'yi azaltmaz; nedensellik göstermez", "C) Her zaman 0'dır", "D) Yalnızca doğrusal olmayan modellerde tanımlıdır", "E) p-değeridir"],
    "correctAnswerIndex": 1,
    "explanation": "Adjusted R^2 parametre cezası."
},
{
    "question": "Ki-kare uyum iyiliği ne varsayar?",
    "options": ["A) Zaman serisi otokorelasyon", "B) Beklenen hücre sıklıklarının yeterince büyük olması ve bağımsız gözlem", "C) Küçük n ve bağımlı satırlar", "D) Normallik zorunlu her hücrede sürekli", "E) Bayes prior"],
    "correctAnswerIndex": 1,
    "explanation": "Kategorik veri."
},
{
    "question": "Bonferroni düzeltmesi neyi kontrol eder?",
    "options": ["A) CLT'yi", "B) Çoklu testte aile tipi I. hata şişmesini", "C) II. tipi otomatik sıfırlar", "D) Yan'ı", "E) R^2'yi"],
    "correctAnswerIndex": 1,
    "explanation": "α/m her test; tutucu olabilir."
},
{
    "question": "İstatistik konusunda aşağıdakilerden hangisi yer alır?",
    "options": ["A) Mecaz anlam, sözcüğün gerçek anlamından uzaklaşıp benzerlik veya ilgilenme yoluy", "B) Eş anlamlı (anlamdaş) sözcükler aynı veya çok yakın kavramı karşılar: deniz-dery", "C) Zıt (karşıt) anlamlı sözcükler birbirini olumsuzlar: açık-kapalı, somut-soyut.", "D) Nokta tahmini yansızlık E[θ̂]=θ; tutarlılık olasılıkta yakınsama.", "E) Gerçek anlam, sözcüğün dilde ilk ve temel karşılığıdır; bağlam değişmeden bu anl"],
    "correctAnswerIndex": 3,
    "explanation": "Konu notunda açıkça yer alır."
},
{
    "question": "İstatistik konusunda aşağıdakilerden hangisi yer almaz?",
    "options": ["A) MSE = Var + yan^2; yanlı ama düşük MSE olabilir (ridge sezgisi).", "B) Mecaz anlam, sözcüğün gerçek anlamından uzaklaşıp benzerlik veya ilgilenme yoluy", "C) Eş anlamlı (anlamdaş) sözcükler aynı veya çok yakın kavramı karşılar: deniz-dery", "D) Zıt (karşıt) anlamlı sözcükler birbirini olumsuzlar: açık-kapalı, somut-soyut.", "E) Gerçek anlam, sözcüğün dilde ilk ve temel karşılığıdır; bağlam değişmeden bu anl"],
    "correctAnswerIndex": 4,
    "explanation": "Bu ifade bu konunun kapsamı dışındadır."
},
{
    "question": "İstatistik konusunda aşağıdakilerden hangisi yer alır?",
    "options": ["A) Mecaz anlam, sözcüğün gerçek anlamından uzaklaşıp benzerlik veya ilgilenme yoluy", "B) Eş anlamlı (anlamdaş) sözcükler aynı veya çok yakın kavramı karşılar: deniz-dery", "C) Zıt (karşıt) anlamlı sözcükler birbirini olumsuzlar: açık-kapalı, somut-soyut.", "D) Olabilirlik L(θ|x); MLE L'yi (veya log L) en büyükler.", "E) Gerçek anlam, sözcüğün dilde ilk ve temel karşılığıdır; bağlam değişmeden bu anl"],
    "correctAnswerIndex": 3,
    "explanation": "Konu notunda açıkça yer alır."
},
{
    "question": "İstatistik konusunda aşağıdakilerden hangisi yer almaz?",
    "options": ["A) Yeterlilik Fisher-Neyman çarpan; Rao-Blackwell varyansı düşürür.", "B) Mecaz anlam, sözcüğün gerçek anlamından uzaklaşıp benzerlik veya ilgilenme yoluy", "C) Eş anlamlı (anlamdaş) sözcükler aynı veya çok yakın kavramı karşılar: deniz-dery", "D) Zıt (karşıt) anlamlı sözcükler birbirini olumsuzlar: açık-kapalı, somut-soyut.", "E) Gerçek anlam, sözcüğün dilde ilk ve temel karşılığıdır; bağlam değişmeden bu anl"],
    "correctAnswerIndex": 4,
    "explanation": "Bu ifade bu konunun kapsamı dışındadır."
},
{
    "question": "İstatistik konusunda aşağıdakilerden hangisi yer alır?",
    "options": ["A) Mecaz anlam, sözcüğün gerçek anlamından uzaklaşıp benzerlik veya ilgilenme yoluy", "B) Eş anlamlı (anlamdaş) sözcükler aynı veya çok yakın kavramı karşılar: deniz-dery", "C) Zıt (karşıt) anlamlı sözcükler birbirini olumsuzlar: açık-kapalı, somut-soyut.", "D) Güven aralığı tesadüfi aralık; %95 'parametre %95 olasılıkla içindedir' değil, yöntemin uz", "E) Gerçek anlam, sözcüğün dilde ilk ve temel karşılığıdır; bağlam değişmeden bu anl"],
    "correctAnswerIndex": 3,
    "explanation": "Konu notunda açıkça yer alır."
},
{
    "question": "İstatistik konusunda aşağıdakilerden hangisi yer almaz?",
    "options": ["A) H0-H1; I. tip α, II. tip β, güç=1-β.", "B) Mecaz anlam, sözcüğün gerçek anlamından uzaklaşıp benzerlik veya ilgilenme yoluy", "C) Eş anlamlı (anlamdaş) sözcükler aynı veya çok yakın kavramı karşılar: deniz-dery", "D) Zıt (karşıt) anlamlı sözcükler birbirini olumsuzlar: açık-kapalı, somut-soyut.", "E) Gerçek anlam, sözcüğün dilde ilk ve temel karşılığıdır; bağlam değişmeden bu anl"],
    "correctAnswerIndex": 4,
    "explanation": "Bu ifade bu konunun kapsamı dışındadır."
},
{
    "question": "İstatistik konusunda aşağıdakilerden hangisi yer alır?",
    "options": ["A) Mecaz anlam, sözcüğün gerçek anlamından uzaklaşıp benzerlik veya ilgilenme yoluy", "B) Eş anlamlı (anlamdaş) sözcükler aynı veya çok yakın kavramı karşılar: deniz-dery", "C) Zıt (karşıt) anlamlı sözcükler birbirini olumsuzlar: açık-kapalı, somut-soyut.", "D) p-değeri H0 altında gözlenen kadar uç veri olasılığı; P(H0|veri) değildir.", "E) Gerçek anlam, sözcüğün dilde ilk ve temel karşılığıdır; bağlam değişmeden bu anl"],
    "correctAnswerIndex": 3,
    "explanation": "Konu notunda açıkça yer alır."
},
{
    "question": "İstatistik konusunda aşağıdakilerden hangisi yer almaz?",
    "options": ["A) Neyman-Pearson basit H0-H1'de olabilirlik oranı en güçlü test.", "B) Mecaz anlam, sözcüğün gerçek anlamından uzaklaşıp benzerlik veya ilgilenme yoluy", "C) Eş anlamlı (anlamdaş) sözcükler aynı veya çok yakın kavramı karşılar: deniz-dery", "D) Zıt (karşıt) anlamlı sözcükler birbirini olumsuzlar: açık-kapalı, somut-soyut.", "E) Gerçek anlam, sözcüğün dilde ilk ve temel karşılığıdır; bağlam değişmeden bu anl"],
    "correctAnswerIndex": 4,
    "explanation": "Bu ifade bu konunun kapsamı dışındadır."
},
{
    "question": "İstatistik konusunda aşağıdakilerden hangisi yer alır?",
    "options": ["A) Mecaz anlam, sözcüğün gerçek anlamından uzaklaşıp benzerlik veya ilgilenme yoluy", "B) Eş anlamlı (anlamdaş) sözcükler aynı veya çok yakın kavramı karşılar: deniz-dery", "C) Zıt (karşıt) anlamlı sözcükler birbirini olumsuzlar: açık-kapalı, somut-soyut.", "D) t, z, ki-kare, F varsayımları: normallik, bağımsızlık, varyans eşitliği.", "E) Gerçek anlam, sözcüğün dilde ilk ve temel karşılığıdır; bağlam değişmeden bu anl"],
    "correctAnswerIndex": 3,
    "explanation": "Konu notunda açıkça yer alır."
},
{
    "question": "İstatistik konusunda aşağıdakilerden hangisi yer almaz?",
    "options": ["A) Çoklu karşılaştırma hata şişmesi; Bonferroni düzeltmesi.", "B) Mecaz anlam, sözcüğün gerçek anlamından uzaklaşıp benzerlik veya ilgilenme yoluy", "C) Eş anlamlı (anlamdaş) sözcükler aynı veya çok yakın kavramı karşılar: deniz-dery", "D) Zıt (karşıt) anlamlı sözcükler birbirini olumsuzlar: açık-kapalı, somut-soyut.", "E) Gerçek anlam, sözcüğün dilde ilk ve temel karşılığıdır; bağlam değişmeden bu anl"],
    "correctAnswerIndex": 4,
    "explanation": "Bu ifade bu konunun kapsamı dışındadır."
},
{
    "question": "İstatistik konusunda aşağıdakilerden hangisi yer alır?",
    "options": ["A) Mecaz anlam, sözcüğün gerçek anlamından uzaklaşıp benzerlik veya ilgilenme yoluy", "B) Eş anlamlı (anlamdaş) sözcükler aynı veya çok yakın kavramı karşılar: deniz-dery", "C) Zıt (karşıt) anlamlı sözcükler birbirini olumsuzlar: açık-kapalı, somut-soyut.", "D) Doğrusal regresyon Y=Xβ+ε; EKK, Gauss-Markov: BLUE (varsayımlarla).", "E) Gerçek anlam, sözcüğün dilde ilk ve temel karşılığıdır; bağlam değişmeden bu anl"],
    "correctAnswerIndex": 3,
    "explanation": "Konu notunda açıkça yer alır."
}
];
