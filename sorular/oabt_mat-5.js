// sorular/oabt_mat-5.js - Diferansiyel Denklemler
window.oabt_mat_5_sorulari = [
{
    "question": "Birinci mertebe lineer DD'nin integre çarpanı nedir?",
    "options": ["A) μ=Wronskian", "B) μ = exp(∫ P(x) dx)  (y'+Py=Q için)", "C) μ=P'", "D) μ=Q/P", "E) μ=y^2"],
    "correctAnswerIndex": 1,
    "explanation": "(μy)'=μQ."
},
{
    "question": "Picard-Lindelöf (Lipschitz) neyi garantiler?",
    "options": ["A) Sayısal kararlılık", "B) Yerel varlık ve teklik", "C) Küresel çözüm her zaman", "D) Periyodik çözüm", "E) Laplace denklemi"],
    "correctAnswerIndex": 1,
    "explanation": "y'=√y, y(0)=0 tekil örnekler üretir."
},
{
    "question": "Karakteristik denklemde karmaşık kök α±βi ne üretir?",
    "options": ["A) Sabit çözüm zorunlu", "B) e^{αx}(c1 cos βx + c2 sin βx)", "C) Yalnızca üstel e^{βx}", "D) Polinom x^k", "E) ln|x|"],
    "correctAnswerIndex": 1,
    "explanation": "Euler formülü."
},
{
    "question": "Wronskian sıfır ise iki çözüm için ne söylenebilir?",
    "options": ["A) Mutlaka bağımsızdır", "B) Denklem lineer değildir", "C) Laplace alınamaz", "D) Mertebe düşer", "E) O aralıkta lineer bağımlı olabilir (eşdeğer koşul lineer DD'de)"],
    "correctAnswerIndex": 4,
    "explanation": "Lineer homojen teoride W≠0 bağımsızlık."
},
{
    "question": "x'=Ax sisteminde asimptotik kararlılık için özdeğerler nasıl olmalıdır?",
    "options": ["A) En az bir pozitif reel kısım", "B) Saf sanal zorunlu", "C) 0 özdeğer zorunlu", "D) Jordan yok", "E) Tüm özdeğerlerin reel kısımları negatif"],
    "correctAnswerIndex": 4,
    "explanation": "Hurwitz/Routh sezgisi."
},
{
    "question": "Laplace dönüşümünün avantajı nedir?",
    "options": ["A) Fourier'nin tersi olmaması", "B) Başlangıç koşullarını cebirsel denkleme gömmesi", "C) Kısmi türevi kaldırması her zaman", "D) Doğrusal olmayanı otomatik çözmesi", "E) Sınır koşulunu yok etmesi"],
    "correctAnswerIndex": 1,
    "explanation": "L{y'}=sY-y(0)."
},
{
    "question": "Değişkenlere ayırma yöntemi hangi KDD sınıfında tipiktir?",
    "options": ["A) Grup teorisi", "B) Isı ve dalga gibi sabit katsayılı çizgisel KDD'ler", "C) Tüm doğrusal olmayan KDD'ler", "D) Yalnızca stokastik denklemler", "E) Yalnızca integral denklemler"],
    "correctAnswerIndex": 1,
    "explanation": "X(x)T(t) çarpım çözüm + özfonksiyon."
},
{
    "question": "Euler sayısal yöntemi yerel hatası mertebesi nedir?",
    "options": ["A) Spektral sonsuz", "B) O(h^2) yerel, O(h) küresel (ileri Euler)", "C) O(h^5)", "D) Hatsız", "E) O(e^h)"],
    "correctAnswerIndex": 1,
    "explanation": "RK4 küresel O(h^4)."
},
{
    "question": "Tam diferansiyel koşulu nedir?",
    "options": ["A) P=Q", "B) ∂M/∂y = ∂N/∂x", "C) M=N", "D) M+N=0", "E) Wronskian 1"],
    "correctAnswerIndex": 1,
    "explanation": "Kapalı form F(x,y)=c."
},
{
    "question": "Aşağıdakilerden hangisi Sıradan DD için doğru bir açıklamadır?",
    "options": ["A) Tam diferansiyel M dx+N dy=0, ∂M/∂y=∂N/∂x.", "B) Bernoulli ve Riccati yerdeğiştirme ile lineere indirgenebilir sınıflar.", "C) Sıradan DD y'=f(x,y); varlık-teklik Lipschitz koşuluna bağlıdır.", "D) Ayrılabilir dy/g(y)=f(x)dx; homojen y=vx yerdeğiştirme.", "E) Lineer y'+P(x)y=Q(x); integre çarpan μ=e^{∫P dx}."],
    "correctAnswerIndex": 2,
    "explanation": "Diferansiyel Denklemler notundaki temel bilgi."
},
{
    "question": "Ayrılabilir hakkında hangisi doğrudur?",
    "options": ["A) Ayrılabilir dy/g(y)=f(x)dx; homojen y=vx yerdeğiştirme.", "B) Sıradan DD y'=f(x,y); varlık-teklik Lipschitz koşuluna bağlıdır.", "C) Lineer y'+P(x)y=Q(x); integre çarpan μ=e^{∫P dx}.", "D) Tam diferansiyel M dx+N dy=0, ∂M/∂y=∂N/∂x.", "E) Bernoulli ve Riccati yerdeğiştirme ile lineere indirgenebilir sınıflar."],
    "correctAnswerIndex": 0,
    "explanation": "Diferansiyel Denklemler notundaki temel bilgi."
},
{
    "question": "Lineer hangisini ifade eder?",
    "options": ["A) Sıradan DD y'=f(x,y); varlık-teklik Lipschitz koşuluna bağlıdır.", "B) Ayrılabilir dy/g(y)=f(x)dx; homojen y=vx yerdeğiştirme.", "C) Tam diferansiyel M dx+N dy=0, ∂M/∂y=∂N/∂x.", "D) Belirsiz katsayılar ve parametre değişimi homojen olmayan özel çözüm.", "E) Lineer y'+P(x)y=Q(x); integre çarpan μ=e^{∫P dx}."],
    "correctAnswerIndex": 4,
    "explanation": "Diferansiyel Denklemler notundaki temel bilgi."
},
{
    "question": "Tam diferansiyel ile ilgili aşağıdakilerden hangisi doğrudur?",
    "options": ["A) Sıradan DD y'=f(x,y); varlık-teklik Lipschitz koşuluna bağlıdır.", "B) Ayrılabilir dy/g(y)=f(x)dx; homojen y=vx yerdeğiştirme.", "C) Lineer y'+P(x)y=Q(x); integre çarpan μ=e^{∫P dx}.", "D) Bernoulli ve Riccati yerdeğiştirme ile lineere indirgenebilir sınıflar.", "E) Tam diferansiyel M dx+N dy=0, ∂M/∂y=∂N/∂x."],
    "correctAnswerIndex": 4,
    "explanation": "Diferansiyel Denklemler notundaki temel bilgi."
},
{
    "question": "Aşağıdakilerden hangisi Bernoulli ve Riccati için doğru bir açıklamadır?",
    "options": ["A) Bernoulli ve Riccati yerdeğiştirme ile lineere indirgenebilir sınıflar.", "B) Sıradan DD y'=f(x,y); varlık-teklik Lipschitz koşuluna bağlıdır.", "C) Ayrılabilir dy/g(y)=f(x)dx; homojen y=vx yerdeğiştirme.", "D) Lineer y'+P(x)y=Q(x); integre çarpan μ=e^{∫P dx}.", "E) Tam diferansiyel M dx+N dy=0, ∂M/∂y=∂N/∂x."],
    "correctAnswerIndex": 0,
    "explanation": "Diferansiyel Denklemler notundaki temel bilgi."
},
{
    "question": "Sabit katsayılı lineer hakkında hangisi doğrudur?",
    "options": ["A) Lineer y'+P(x)y=Q(x); integre çarpan μ=e^{∫P dx}.", "B) Tam diferansiyel M dx+N dy=0, ∂M/∂y=∂N/∂x.", "C) Sabit katsayılı lineer karakteristik kök: gerçek, tekrar, karmaşık.", "D) Sıradan DD y'=f(x,y); varlık-teklik Lipschitz koşuluna bağlıdır.", "E) Ayrılabilir dy/g(y)=f(x)dx; homojen y=vx yerdeğiştirme."],
    "correctAnswerIndex": 2,
    "explanation": "Diferansiyel Denklemler notundaki temel bilgi."
},
{
    "question": "Belirsiz katsayılar ve parametre değişimi hangisini ifade eder?",
    "options": ["A) Lineer y'+P(x)y=Q(x); integre çarpan μ=e^{∫P dx}.", "B) Tam diferansiyel M dx+N dy=0, ∂M/∂y=∂N/∂x.", "C) Belirsiz katsayılar ve parametre değişimi homojen olmayan özel çözüm.", "D) Sıradan DD y'=f(x,y); varlık-teklik Lipschitz koşuluna bağlıdır.", "E) Ayrılabilir dy/g(y)=f(x)dx; homojen y=vx yerdeğiştirme."],
    "correctAnswerIndex": 2,
    "explanation": "Diferansiyel Denklemler notundaki temel bilgi."
},
{
    "question": "Wronskian ile ilgili aşağıdakilerden hangisi doğrudur?",
    "options": ["A) Sıradan DD y'=f(x,y); varlık-teklik Lipschitz koşuluna bağlıdır.", "B) Ayrılabilir dy/g(y)=f(x)dx; homojen y=vx yerdeğiştirme.", "C) Lineer y'+P(x)y=Q(x); integre çarpan μ=e^{∫P dx}.", "D) Tam diferansiyel M dx+N dy=0, ∂M/∂y=∂N/∂x.", "E) Wronskian bağımsızlık; Abel formülü."],
    "correctAnswerIndex": 4,
    "explanation": "Diferansiyel Denklemler notundaki temel bilgi."
},
{
    "question": "Aşağıdakilerden hangisi Sistem için doğru bir açıklamadır?",
    "options": ["A) Lineer y'+P(x)y=Q(x); integre çarpan μ=e^{∫P dx}.", "B) Tam diferansiyel M dx+N dy=0, ∂M/∂y=∂N/∂x.", "C) Sistem x'=Ax; çözüm e^{At}v; özdeğer kararlılık (Reel kısım <0).", "D) Sıradan DD y'=f(x,y); varlık-teklik Lipschitz koşuluna bağlıdır.", "E) Ayrılabilir dy/g(y)=f(x)dx; homojen y=vx yerdeğiştirme."],
    "correctAnswerIndex": 2,
    "explanation": "Diferansiyel Denklemler notundaki temel bilgi."
},
{
    "question": "Laplace dönüşümü hakkında hangisi doğrudur?",
    "options": ["A) Tam diferansiyel M dx+N dy=0, ∂M/∂y=∂N/∂x.", "B) Laplace dönüşümü başlangıç değer problemlerini cebirle çözer.", "C) Sıradan DD y'=f(x,y); varlık-teklik Lipschitz koşuluna bağlıdır.", "D) Ayrılabilir dy/g(y)=f(x)dx; homojen y=vx yerdeğiştirme.", "E) Lineer y'+P(x)y=Q(x); integre çarpan μ=e^{∫P dx}."],
    "correctAnswerIndex": 1,
    "explanation": "Diferansiyel Denklemler notundaki temel bilgi."
},
{
    "question": "Isı, dalga, Laplace hangisini ifade eder?",
    "options": ["A) Tam diferansiyel M dx+N dy=0, ∂M/∂y=∂N/∂x.", "B) Isı, dalga, Laplace denklemleri; ayrışım (değişkenlere ayırma).", "C) Sıradan DD y'=f(x,y); varlık-teklik Lipschitz koşuluna bağlıdır.", "D) Ayrılabilir dy/g(y)=f(x)dx; homojen y=vx yerdeğiştirme.", "E) Lineer y'+P(x)y=Q(x); integre çarpan μ=e^{∫P dx}."],
    "correctAnswerIndex": 1,
    "explanation": "Diferansiyel Denklemler notundaki temel bilgi."
}
];
