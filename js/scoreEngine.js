(function (global) {
    var COEF = {
        lisans: { gy: 0.40, gk: 0.40 },
        onlisans: { gy: 0.50, gk: 0.50 },
        ortaogretim: { gy: 0.50, gk: 0.50 }
    };

    function netsFromState(student) {
        var tot = 0, cor = 0;
        Object.keys(student.sessions || {}).forEach(function (d) {
            tot += student.sessions[d].questions || 0;
            cor += student.sessions[d].correct || 0;
        });
        var pct = tot ? cor / tot : 0;
        var gyNet = Math.round(pct * 60 * 10) / 10;
        var gkNet = Math.round(pct * 60 * 10) / 10;
        return { gy: gyNet, gk: gkNet, sample: tot };
    }

    function estimate(student, override) {
        var level = (student.userProfile && student.userProfile.educationLevel) || "lisans";
        var c = COEF[level] || COEF.lisans;
        var n = Object.assign(netsFromState(student), override || {});
        var raw = 40 + (n.gy * c.gy) + (n.gk * c.gk);
        var score = Math.max(0, Math.min(100, Math.round(raw * 1000) / 1000));
        return {
            level: level,
            gyNet: n.gy,
            gkNet: n.gk,
            sample: n.sample,
            score: score,
            note: n.sample < 40 ? "Az örnek; puan kaba tahmindir." : "GY-GK katsayı tahmini (ÖSYM ham puan kopyası değildir)."
        };
    }

    function matchPlacement(score, rows) {
        rows = rows || [];
        return rows.filter(function (r) { return Number(r.taban) <= score; }).slice(0, 12);
    }

    global.ScoreEngine = {
        COEF: COEF,
        estimate: estimate,
        matchPlacement: matchPlacement
    };
})(window);
