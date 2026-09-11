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
    "question": "Aşağıdakilerden hangisi Olasılık uzayı için doğru bir açıklamadır?",
    "options": ["A) Kesikli PMF, sürekli PDF; karışım dağılımları.", "B) Beklenen değer E[g(X)]=∫ g dP; varyans E[X^2]-(E X)^2.", "C) Bağımsızlık sigma cebirlerinin çarpımı; Cov=0 bağımsızlık gerektirmez.", "D) Olasılık uzayı (Ω,F,P); P(Ω)=1, sayılabilir katkısızlık.", "E) Rassal değişken ölçülebilir fonksiyon; dağılım fonksiyonu F sağdan sürekli, monoton."],
    "correctAnswerIndex": 3,
    "explanation": "Olasılık notundaki temel bilgi."
},
{
    "question": "Rassal değişken hakkında hangisi doğrudur?",
    "options": ["A) Beklenen değer E[g(X)]=∫ g dP; varyans E[X^2]-(E X)^2.", "B) Bağımsızlık sigma cebirlerinin çarpımı; Cov=0 bağımsızlık gerektirmez.", "C) Rassal değişken ölçülebilir fonksiyon; dağılım fonksiyonu F sağdan sürekli, monoton.", "D) Olasılık uzayı (Ω,F,P); P(Ω)=1, sayılabilir katkısızlık.", "E) Kesikli PMF, sürekli PDF; karışım dağılımları."],
    "correctAnswerIndex": 2,
    "explanation": "Olasılık notundaki temel bilgi."
},
{
    "question": "Kesikli hangisini ifade eder?",
    "options": ["A) Kesikli PMF, sürekli PDF; karışım dağılımları.", "B) Olasılık uzayı (Ω,F,P); P(Ω)=1, sayılabilir katkısızlık.", "C) Rassal değişken ölçülebilir fonksiyon; dağılım fonksiyonu F sağdan sürekli, monoton.", "D) Beklenen değer E[g(X)]=∫ g dP; varyans E[X^2]-(E X)^2.", "E) Bağımsızlık sigma cebirlerinin çarpımı; Cov=0 bağımsızlık gerektirmez."],
    "correctAnswerIndex": 0,
    "explanation": "Olasılık notundaki temel bilgi."
},
{
    "question": "Beklenen değer ile ilgili aşağıdakilerden hangisi doğrudur?",
    "options": ["A) Bağımsızlık sigma cebirlerinin çarpımı; Cov=0 bağımsızlık gerektirmez.", "B) Beklenen değer E[g(X)]=∫ g dP; varyans E[X^2]-(E X)^2.", "C) Olasılık uzayı (Ω,F,P); P(Ω)=1, sayılabilir katkısızlık.", "D) Rassal değişken ölçülebilir fonksiyon; dağılım fonksiyonu F sağdan sürekli, monoton.", "E) Kesikli PMF, sürekli PDF; karışım dağılımları."],
    "correctAnswerIndex": 1,
    "explanation": "Olasılık notundaki temel bilgi."
},
{
    "question": "Aşağıdakilerden hangisi Bağımsızlık için doğru bir açıklamadır?",
    "options": ["A) Bağımsızlık sigma cebirlerinin çarpımı; Cov=0 bağımsızlık gerektirmez.", "B) Olasılık uzayı (Ω,F,P); P(Ω)=1, sayılabilir katkısızlık.", "C) Rassal değişken ölçülebilir fonksiyon; dağılım fonksiyonu F sağdan sürekli, monoton.", "D) Kesikli PMF, sürekli PDF; karışım dağılımları.", "E) Beklenen değer E[g(X)]=∫ g dP; varyans E[X^2]-(E X)^2."],
    "correctAnswerIndex": 0,
    "explanation": "Olasılık notundaki temel bilgi."
},
{
    "question": "Bayes hakkında hangisi doğrudur?",
    "options": ["A) Bayes P(H|D)=P(D|H)P(H)/P(D); toplam olasılık payda.", "B) Olasılık uzayı (Ω,F,P); P(Ω)=1, sayılabilir katkısızlık.", "C) Rassal değişken ölçülebilir fonksiyon; dağılım fonksiyonu F sağdan sürekli, monoton.", "D) Kesikli PMF, sürekli PDF; karışım dağılımları.", "E) Beklenen değer E[g(X)]=∫ g dP; varyans E[X^2]-(E X)^2."],
    "correctAnswerIndex": 0,
    "explanation": "Olasılık notundaki temel bilgi."
},
{
    "question": "Koşullu beklenen hangisini ifade eder?",
    "options": ["A) Beklenen değer E[g(X)]=∫ g dP; varyans E[X^2]-(E X)^2.", "B) Koşullu beklenen E[X|G] projeksiyon (L2).", "C) Olasılık uzayı (Ω,F,P); P(Ω)=1, sayılabilir katkısızlık.", "D) Rassal değişken ölçülebilir fonksiyon; dağılım fonksiyonu F sağdan sürekli, monoton.", "E) Kesikli PMF, sürekli PDF; karışım dağılımları."],
    "correctAnswerIndex": 1,
    "explanation": "Olasılık notundaki temel bilgi."
},
{
    "question": "KKT ile ilgili aşağıdakilerden hangisi doğrudur?",
    "options": ["A) Beklenen değer E[g(X)]=∫ g dP; varyans E[X^2]-(E X)^2.", "B) KKT (Chebyshev) kuyruk; Chernoff üstel moment.", "C) Olasılık uzayı (Ω,F,P); P(Ω)=1, sayılabilir katkısızlık.", "D) Rassal değişken ölçülebilir fonksiyon; dağılım fonksiyonu F sağdan sürekli, monoton.", "E) Kesikli PMF, sürekli PDF; karışım dağılımları."],
    "correctAnswerIndex": 1,
    "explanation": "Olasılık notundaki temel bilgi."
},
{
    "question": "Aşağıdakilerden hangisi Büyük sayılar için doğru bir açıklamadır?",
    "options": ["A) Olasılık uzayı (Ω,F,P); P(Ω)=1, sayılabilir katkısızlık.", "B) Rassal değişken ölçülebilir fonksiyon; dağılım fonksiyonu F sağdan sürekli, monoton.", "C) Kesikli PMF, sürekli PDF; karışım dağılımları.", "D) Beklenen değer E[g(X)]=∫ g dP; varyans E[X^2]-(E X)^2.", "E) Büyük sayılar zayıf/güçlü: örneklem ortalaması μ'ye."],
    "correctAnswerIndex": 4,
    "explanation": "Olasılık notundaki temel bilgi."
},
{
    "question": "Merkezi limit hakkında hangisi doğrudur?",
    "options": ["A) Rassal değişken ölçülebilir fonksiyon; dağılım fonksiyonu F sağdan sürekli, monoton.", "B) Kesikli PMF, sürekli PDF; karışım dağılımları.", "C) Beklenen değer E[g(X)]=∫ g dP; varyans E[X^2]-(E X)^2.", "D) Merkezi limit (CLT) normalize toplam → N(0,1) (Lindeberg koşulları).", "E) Olasılık uzayı (Ω,F,P); P(Ω)=1, sayılabilir katkısızlık."],
    "correctAnswerIndex": 3,
    "explanation": "Olasılık notundaki temel bilgi."
},
{
    "question": "Bernoulli-Binom-Poisson hangisini ifade eder?",
    "options": ["A) Rassal değişken ölçülebilir fonksiyon; dağılım fonksiyonu F sağdan sürekli, monoton.", "B) Kesikli PMF, sürekli PDF; karışım dağılımları.", "C) Beklenen değer E[g(X)]=∫ g dP; varyans E[X^2]-(E X)^2.", "D) Bernoulli-Binom-Poisson limit ilişkisi; Poisson nadir olay.", "E) Olasılık uzayı (Ω,F,P); P(Ω)=1, sayılabilir katkısızlık."],
    "correctAnswerIndex": 3,
    "explanation": "Olasılık notundaki temel bilgi."
}
];
