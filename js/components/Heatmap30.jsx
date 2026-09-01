(function () {
    function Heatmap30(props) {
        const sessions = (props.student && props.student.sessions) || {};
        const days = [];
        const today = new Date();
        for (var i = 29; i >= 0; i--) {
            var d = new Date(today);
            d.setDate(d.getDate() - i);
            var iso = StudentStore.todayStr(d);
            days.push({ iso: iso, q: (sessions[iso] && sessions[iso].questions) || 0 });
        }
        return (
            <div>
                <div className="grid grid-cols-10 gap-1">
                    {days.map(function (x) {
                        var bg = x.q === 0 ? "bg-slate-200 dark:bg-slate-700" : x.q < 10 ? "bg-emerald-200" : x.q < 25 ? "bg-emerald-400" : "bg-emerald-600";
                        return <div key={x.iso} title={x.iso + " · " + x.q} className={"h-3 rounded-sm " + bg} />;
                    })}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Son 30 gün</p>
            </div>
        );
    }
    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.Heatmap30 = Heatmap30;
})();
