(function (global) {
    function permissionState() {
        if (!("Notification" in global)) return "unsupported";
        return Notification.permission;
    }

    async function requestPush() {
        if (!("Notification" in global)) return { ok: false, reason: "unsupported" };
        var perm = await Notification.requestPermission();
        return { ok: perm === "granted", perm: perm };
    }

    function streakNudge(student) {
        var today = global.StudentStore.todayStr();
        if (student.streak.lastDay === today) return null;
        if (!student.streak.count) return "Bugün 10 soru: seri başlasın.";
        return "Serin " + student.streak.count + " gün. Bugün kırılırsa başa dönersin.";
    }

    function showLocal(title, body) {
        if (permissionState() !== "granted") return;
        try { new Notification(title, { body: body, icon: "icons/icon-192.png" }); } catch (e) {}
    }

    global.NotificationEngine = {
        permissionState: permissionState,
        requestPush: requestPush,
        streakNudge: streakNudge,
        showLocal: showLocal
    };
})(window);
