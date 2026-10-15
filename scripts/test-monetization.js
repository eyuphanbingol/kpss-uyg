// İstemci kilit mantığı (js/monetization.js):  node scripts/test-monetization.js
var M = require("../js/monetization.js");
var n = 0;
function ok(c, m) { if (!c) { console.error("HATA: " + m); process.exit(1); } n++; }
var future = new Date(Date.now() + 864e5).toISOString();
var past = new Date(Date.now() - 864e5).toISOString();
function st(over) {
    return Object.assign({ settings: { enabled: true, live_paywall: true, free_count: 3, ad_unlock_hours: 24 },
        premium: false, premium_until: null, live: { free: true, credits: 0 }, ad_unlocks: {} }, over || {});
}

ok(!M.isLocked("map:x", 7), "durum yokken hiçbir şey kilitli değil");
ok(M.liveEntry().kind === "free" && !M.liveEntry().paywall, "durum yokken deneme serbest");
M.setStatus(st({ settings: { enabled: false, live_paywall: false } }));
ok(!M.isLocked("map:x", 9), "kilitler kapalıyken açık");
M.setStatus(st());
ok(!M.isLocked("map:a", 0) && !M.isLocked("map:a", 2), "ilk 3 açık");
ok(M.isLocked("map:a", 3), "4. öğe kilitli");
M.setStatus(st({ premium: true, premium_until: future }));
ok(!M.isLocked("map:a", 3), "premium açar");
M.setStatus(st({ premium: true, premium_until: past }));
ok(M.isLocked("map:a", 3), "süresi geçen premium açmaz");
M.setStatus(st({ premium: true, premium_until: null }));
ok(M.isPremium() && !M.isLocked("map:a", 5), "süresiz premium");
M.setStatus(st({ ad_unlocks: { "map:b": future } }));
ok(!M.isLocked("map:b", 5) && M.isLocked("map:c", 5), "sunucudaki reklam kilidi yalnız o öğeyi açar");
M.markAdReward("map:c");
ok(!M.isLocked("map:c", 5), "reklam ödülü hemen yerelde açar");
ok(M.unlockMinutesLeft("map:c") > 1430, "24 saat");
var saved = M.serialize();
M.reset();
ok(M.isLocked("map:c", 5) === false && M.status() === null, "sıfırlanınca durum yok (kilit yok)");
ok(M.restore(saved) && !M.isLocked("map:c", 5) && M.isLocked("map:d", 5), "kayıttan geri yükleme");
M.setStatus(st({ ad_unlocks: { "map:c": new Date(Date.now() + 25 * 3600e3).toISOString() } }));
ok(!M.isLocked("map:c", 5), "sunucu onayı gelince yerel kayıt temizlenir, kilit açık kalır");

M.setStatus(st({ live: { free: true, credits: 0 } }));
ok(M.liveEntry().kind === "free" && M.liveEntry().paywall, "ilk deneme ücretsiz");
M.setStatus(st({ live: { free: false, credits: 2 } }));
ok(M.liveEntry().kind === "credit" && M.liveEntry().credits === 2, "kredi varsa kredi");
M.setStatus(st({ live: { free: false, free_reason: "device", credits: 0 } }));
ok(M.liveEntry().kind === "pay" && M.liveEntry().reason === "device", "hak yoksa ödeme");

var k = M.keys.konu("Coğrafya", "Türkiye'nin Yer Şekilleri ve İç-Dış Kuvvetler Ünitesinin Çok Uzun Başlığı");
ok(/^[a-z0-9:_.\-]{1,120}$/.test(k) && k.length <= 120, "anahtar sunucu biçimine uyar: " + k);
ok(M.keys.konu("Coğrafya", "Akarsular") === "konu:cografya:akarsular", "Türkçe harfler sadeleşir");
ok(M.keys.map("gol-tektonik") === "map:gol-tektonik", "harita anahtarı");
ok(M.keys.konu("Tarih", "A B") !== M.keys.cloze("Tarih", "A B"), "konu ve boşluk anahtarı ayrı");
ok(!M.setStatus(null) && !M.setStatus({}), "bozuk durum yok sayılır");
console.log("Gelir modeli istemci testleri: " + n + " kontrol geçti.");
