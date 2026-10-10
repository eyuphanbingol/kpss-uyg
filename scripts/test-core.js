// Çekirdek modüllerin birim testleri (tarayıcı modülleri sahte window ile yüklenir):
//   node scripts/test-core.js
// store.js (öğrenci verisi, kayıt, ayrıcalık koruması, tekrar aralıkları, kullanıcı ayrımı),
// scoreEngine.js, gamesEngine.js, mapQuiz.js ve web ↔ mobil kopya eşitliği.
var assert = require("assert");
var fs = require("fs");
var path = require("path");
var vm = require("vm");

var root = path.join(__dirname, "..");
var n = 0;
function ok(cond, msg) { assert.ok(cond, msg); n++; }
function eq(a, b, msg) { assert.deepStrictEqual(a, b, msg); n++; }

function makeStorage() {
    var m = {};
    return {
        getItem: function (k) { return Object.prototype.hasOwnProperty.call(m, k) ? m[k] : null; },
        setItem: function (k, v) { m[k] = String(v); },
        removeItem: function (k) { delete m[k]; },
        key: function (i) { return Object.keys(m)[i] || null; },
        get length() { return Object.keys(m).length; },
        _dump: m
    };
}

function sandbox() {
    var win = { console: console, setTimeout: setTimeout, clearTimeout: clearTimeout, Date: Date, Math: Math, JSON: JSON };
    win.window = win;
    win.globalThis = win;
    win.localStorage = makeStorage();
    win.sessionStorage = makeStorage();
    win.navigator = { userAgent: "node", language: "tr-TR" };
    win.location = { href: "https://www.atanly.com/", origin: "https://www.atanly.com", search: "", hash: "" };
    win.addEventListener = function () {};
    win.document = { addEventListener: function () {}, createElement: function () { return { style: {} }; } };
    vm.createContext(win);
    ["js/config.js", "data.js", "js/store.js", "js/scoreEngine.js", "js/gamesBank.js", "js/gamesEngine.js"].forEach(function (f) {
        vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), win, { filename: f });
    });
    return win;
}

// ---------------------------------------------------------------- store
var w = sandbox();
var S = w.StudentStore;
ok(S && typeof S.getState === "function", "StudentStore yüklendi");

var U1 = "11111111-1111-4111-8111-111111111111";
var U2 = "22222222-2222-4222-8222-222222222222";
S.bindToUser(U1, "a@x.com");
var st = S.getState();
ok(st.profile && st.profile.onboarded === false, "yeni kullanıcı kurulumu görür");

// Kayıt bilgisi user_metadata'dan (e-posta başka cihazda onaylandı)
ok(S.consumeSignupMetadata({ user_metadata: { full_name: "Google Kullanıcı" } }) === false, "kulvarsız metadata (Google) kurulumu atlamaz");
ok(S.consumeSignupMetadata({ user_metadata: { full_name: "X", education_level: "doktora" } }) === false, "geçersiz kulvar reddedilir");
ok(S.consumeSignupMetadata({ user_metadata: { full_name: "Ayşe", education_level: "onlisans", target_type: "A" } }) === true, "geçerli metadata kurulumu tamamlar");
st = S.getState();
eq([st.profile.onboarded, st.profile.name, st.userProfile.educationLevel, st.userProfile.targetType], [true, "Ayşe", "onlisans", "B"], "önlisansta hedef grup B'ye zorlanır");
ok(S.consumeSignupMetadata({ user_metadata: { full_name: "Başka", education_level: "lisans" } }) === false, "kurulmuş profil metadata ile ezilmez");

// Ayrıcalık alanları istemciden değiştirilemez
S.updateUserProfile({ role: "admin", premium: true, premiumUntil: "2099-01-01", blocked: false, educationLevel: "lisans", authUserId: U2, nickname: "  Ay<b>şe  " });
st = S.getState();
ok(st.userProfile.role !== "admin" && st.userProfile.premium !== true, "rol/premium istemciden verilemez");
ok(st.userProfile.educationLevel === "onlisans" && st.userProfile.authUserId === U1, "kulvar ve kimlik istemciden değişmez");
ok(st.userProfile.nickname.length <= 40, "takma ad kırpılır");
S.applyServerFlags({ role: "superuser" });
ok(S.getState().userProfile.role === "student", "sunucu bayrağında bilinmeyen rol öğrenciye düşer");
ok(S.setEducationLevel("yuksek").ok === false, "geçersiz kulvar reddedilir");

// Aralıklı tekrar: doğru → aralık büyür, yanlış → yanlış defterine
var rec = S.recordAnswer({ ders: "Tarih", konu: "İslamiyet Öncesi Türk Tarihi", id: "t1", correct: false });
st = S.getState();
ok(rec.wrongCount === 1 && rec.intervalIndex === 0, "yanlış cevap sayılır, aralık sıfırlanır");
ok(st.wrongBook.length === 1, "yanlış deftere düşer");
rec = S.recordAnswer({ ders: "Tarih", konu: "İslamiyet Öncesi Türk Tarihi", id: "t1", correct: true });
st = S.getState();
ok(rec.correctCount === 1 && rec.intervalIndex === 1 && st.wrongBook.length === 0, "doğru cevap defterden çıkarır, aralığı büyütür");
for (var i = 0; i < 10; i++) S.recordAnswer({ ders: "Tarih", konu: "İslamiyet Öncesi Türk Tarihi", id: "t1", correct: true });
ok(S.getState().answers[S.qid("Tarih", "İslamiyet Öncesi Türk Tarihi", "t1")].intervalIndex === S.INTERVALS.length - 1, "aralık en büyük değerde durur");
eq([S.masteryFromPct(null), S.masteryFromPct(40), S.masteryFromPct(70), S.masteryFromPct(95)].map(Boolean), [true, true, true, true], "hâkimiyet etiketleri tanımlı");
ok(S.masteryFromPct(40) === "zayif" && S.masteryFromPct(70) === "orta", "hâkimiyet eşikleri");

// Tabu: görülen kart bir kez işaretlenir
S.markGameSeen("tabu", "c1"); S.markGameSeen("tabu", "c1"); S.markGameSeen("tabu", "");
eq(Object.keys(S.getState().games.tabuSeen), ["c1"], "tabu görülenler tekrarsız, boş kimlik yok sayılır");

// Kullanıcı ayrımı: başka hesap ilk kullanıcının verisini görmez
S.bindToUser(U2, "b@x.com");
st = S.getState();
ok(st.profile.onboarded === false && Object.keys(st.answers || {}).length === 0, "ikinci hesap ilk hesabın verisini görmez");
S.bindToUser(U1, "a@x.com");
ok(S.getState().profile.name === "Ayşe", "ilk hesaba dönünce verisi yerinde");
S.bindToUser(null);
ok(S.getState().profile.onboarded === false, "çıkışta bellekte kullanıcı verisi kalmaz");

// Bekleyen kayıt profili (aynı sekmede onay)
var w2 = sandbox();
w2.sessionStorage.setItem("kpss-signup-profile", JSON.stringify({ name: "Mehmet", educationLevel: "lisans", targetType: "A", examDate: "2028-07-16" }));
w2.StudentStore.bindToUser(U1, "m@x.com");
w2.StudentStore.consumeSignupIfNeeded({ user_metadata: {} });
st = w2.StudentStore.getState();
eq([st.profile.onboarded, st.profile.name, st.userProfile.targetType, st.profile.examDate], [true, "Mehmet", "A", "2028-07-16"], "aynı sekmede onay: bekleyen profil uygulanır");
ok(w2.sessionStorage.getItem("kpss-signup-profile") === null, "bekleyen profil kullanıldıktan sonra silinir");

// Bozuk kayıtlı veri uygulamayı çökertmez
var w3 = sandbox();
w3.localStorage.setItem("kpss-student-v1:" + U1, "{bozuk json");
w3.StudentStore.bindToUser(U1, "a@x.com");
ok(w3.StudentStore.getState().profile, "bozuk yerel veri varsayılana döner");

// ---------------------------------------------------------------- puan
var SE = w.ScoreEngine;
var e1 = SE.estimate({ userProfile: { educationLevel: "lisans" }, sessions: {} });
ok(e1.score === 40 && e1.sample === 0, "boş veride taban puan 40");
var e2 = SE.estimate({ userProfile: { educationLevel: "lisans" }, sessions: { a: { questions: 100, correct: 100 } } });
ok(e2.score <= 100 && e2.score > 80, "tam doğru puanı 100'ü geçmez");
ok(SE.matchPlacement(70, [{ taban: 60 }, { taban: 80 }]).length === 1, "taban puan eşleştirme");

// ---------------------------------------------------------------- oyun motoru
var G = w.GamesEngine;
var cat = JSON.parse(fs.readFileSync(path.join(root, "catalog.json"), "utf8"));
var data = cat.data || cat.kpssData || cat;
var deck = G.tabuDeck(12, data, {});
ok(deck.length === 12, "tabu destesi 12 kart");
ok(deck.every(function (c) { return c.answer && Array.isArray(c.clues) && c.clues.length >= 2; }), "her kartta cevap ve en az 2 ipucu");
ok(new Set(deck.map(function (c) { return c.id; })).size === 12, "destede tekrar yok");
ok(deck.every(function (c) { return c.clues.every(function (x) { return String(x).toLocaleLowerCase("tr").indexOf(String(c.answer).toLocaleLowerCase("tr")) < 0; }); }), "ipucunda cevabın kendisi geçmez");
var seen = {}; deck.forEach(function (c) { seen[c.id] = true; });
ok(G.tabuDeck(12, data, seen).every(function (c) { return !seen[c.id]; }), "görülen kartlar tekrar gelmez");
ok(G.tabuPoints(0) >= G.tabuPoints(3) && G.tabuPoints(99) >= 1 && G.tabuPoints(-5) === G.tabuPoints(0), "tabu puanı ipucu arttıkça düşer, sınırlar güvenli");
var panic = G.panicDeck(data);
ok(panic.length > 50, "son 30 saniye destesi dolu (" + panic.length + ")");
var badPanic = panic.filter(function (p) { return !p.choices || p.choices.indexOf(p.a) < 0 || new Set(p.choices).size !== p.choices.length; });
ok(badPanic.length === 0, "son 30 saniye: doğru cevap şıklarda, şıklar tekrarsız (" + badPanic.length + " sorunlu)");
var q34 = G.quizForProvince("TR34", data);
ok(Array.isArray(q34), "il sorusu üretimi çalışır");
ok(G.shuffle([1, 2, 3, 4]).sort().join() === "1,2,3,4", "karıştırma eleman kaybetmez");

// ---------------------------------------------------------------- soru bankası bütünlüğü
var qn = 0, bad = [];
Object.keys(data).forEach(function (ders) {
    Object.keys(data[ders] || {}).forEach(function (konu) {
        ((data[ders][konu] || {}).sorular || []).forEach(function (q, i) {
            qn++;
            var opts = q.options || q.siklar || [];
            var ci = q.correctAnswerIndex != null ? q.correctAnswerIndex : q.dogru;
            if (!q.question && !q.soru) bad.push(ders + "/" + konu + "#" + i + " soru metni yok");
            else if (opts.length < 2) bad.push(ders + "/" + konu + "#" + i + " şık yok");
            else if (typeof ci === "number" && (ci < 0 || ci >= opts.length)) bad.push(ders + "/" + konu + "#" + i + " doğru cevap aralık dışı");
            else if (new Set(opts.map(function (o) { return String(o).replace(/^[A-E]\)\s*/, "").trim(); })).size !== opts.length) bad.push(ders + "/" + konu + "#" + i + " tekrarlanan şık");
        });
    });
});
ok(qn > 5000, "soru bankası dolu (" + qn + ")");
ok(bad.length === 0, "soru bankası bütünlüğü: " + bad.slice(0, 5).join(" | "));

// ---------------------------------------------------------------- web ↔ mobil eşitliği
function body(f) { return fs.readFileSync(path.join(root, f), "utf8"); }
var mobileStore = body("mobile/src/lib/store.js");
["consumeSignupMetadata", "TABU_REPAIR_AT", "updateUserProfile: function", "delete p.role", "delete p.premium"].forEach(function (k) {
    ok(mobileStore.indexOf(k) >= 0 && body("js/store.js").indexOf(k) >= 0, "store.js web ve mobilde: " + k);
});
ok(JSON.stringify(cat) === body("mobile/src/content/catalog.json").trim() || JSON.parse(body("mobile/src/content/catalog.json")) && true, "mobil katalog okunabilir");

console.log("Çekirdek birim testleri: " + n + " kontrol geçti.");
