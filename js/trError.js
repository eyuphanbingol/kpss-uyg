(function (global) {
    var RULES = [
        [/invalid login|invalid credentials|invalid email or password/i, "E-posta veya şifre hatalı."],
        [/email not confirmed|email_not_confirmed/i, "E-postanı henüz doğrulamadın. Gelen kutundaki linke tıkla."],
        [/already registered|user already|already been registered|user_already_exists/i, "Bu e-posta ile kayıtlı bir hesap var. Giriş yap veya şifreni sıfırla."],
        [/user not found|user_not_found/i, "Bu e-posta ile hesap bulunamadı."],
        [/password should be at least|password is known to be weak|weak_password|weak password/i, "Şifre en az 6 karakter olmalı."],
        [/new password should be different|same_password|same password/i, "Yeni şifre eskisiyle aynı olamaz."],
        [/unable to validate email|invalid email|email address is invalid/i, "Geçerli bir e-posta adresi gir."],
        [/signup requires a valid password/i, "Kayıt için geçerli bir şifre yaz."],
        [/for security purposes|over_email_send_rate|rate limit|too many requests|email rate limit|429/i, "Çok sık denendi. Birkaç dakika bekle, sonra tekrar dene."],
        [/token has expired|otp_expired|email link is invalid|expired|invalid token/i, "Bu bağlantının süresi dolmuş. Yeni bir mail iste."],
        [/session missing|auth session missing|refresh_token|invalid_grant|jwt expired/i, "Oturum yok veya süresi doldu. Aynı tarayıcıda yeni sıfırlama maili iste, linke bir kez tıkla."],
        [/signup is disabled|signups not allowed/i, "Yeni kayıt şu an kapalı."],
        [/provider is not enabled|unsupported provider/i, "Bu giriş yöntemi şu an kapalı."],
        [/access_denied|access denied|oauth error/i, "Google girişi iptal edildi veya tamamlanamadı."],
        [/failed to fetch|network request failed|load failed|networkerror|err_network|offline/i, "İnternet bağlantısı yok veya sunucuya ulaşılamadı. Bağlantını kontrol edip tekrar dene."],
        [/timeout|timed out|abort/i, "İstek zaman aşımına uğradı. Tekrar dene."],
        [/row-level security|permission denied|rls/i, "Bu işlem için yetkin yok."],
        [/duplicate key|already exists/i, "Bu kayıt zaten var."],
        [/not found|pgrst116/i, "Kayıt bulunamadı."],
        [/unauthorized|401/i, "Giriş gerekli veya oturumun doldu."],
        [/forbidden|403/i, "Bu işlem için yetkin yok."],
        [/invalid level/i, "Geçersiz eğitim düzeyi."],
        [/^same$/i, "Zaten bu düzeydesin."],
        [/missing user/i, "Kullanıcı seçilmedi."],
        [/missing id/i, "Kayıt kimliği eksik."],
        [/^empty$/i, "Metin boş olamaz."],
        [/internal server|500|database error|unexpected_failure/i, "Sunucu hatası. Biraz sonra tekrar dene."]
    ];

    function rawText(err) {
        if (err == null || err === "") return "";
        if (typeof err === "string") return err;
        var parts = [err.message, err.error, err.msg, err.reason, err.code, err.error_code, err.status];
        return parts.filter(Boolean).join(" ");
    }

    function hasEnglishCue(s) {
        return /\b(invalid|failed|unable|error|denied|missing|unauthorized|forbidden|network|timeout|expired|token|password|email|user|fetch|credentials|confirm|registered|request|please|success)\b/i.test(s);
    }

    function trError(err, fallback) {
        var s = rawText(err).replace(/^AuthApiError:\s*/i, "").replace(/^Error:\s*/i, "").trim();
        if (!s) return fallback || "Bir hata oluştu. Biraz sonra tekrar dene.";
        for (var i = 0; i < RULES.length; i++) {
            if (RULES[i][0].test(s)) return RULES[i][1];
        }
        if (hasEnglishCue(s)) return fallback || "İşlem tamamlanamadı. İnternetini kontrol edip tekrar dene.";
        return s;
    }

    global.trError = trError;
})(typeof window !== "undefined" ? window : globalThis);
