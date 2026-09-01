(function (global) {
    global.InstructorDashboard = {
        emptyGroup: function () {
            return { id: null, name: "Sınıfım", students: [], ready: false, badge: "Yakında" };
        },
        fetchGroup: async function () {
            var sb = global.SupabaseClient && global.SupabaseClient.get();
            if (!sb) return this.emptyGroup();
            try {
                var res = await sb.from("instructor_groups").select("id,name,members:instructor_group_members(user_id,nickname,last_study_at,questions_total)").limit(1);
                if (res.error || !res.data || !res.data[0]) return this.emptyGroup();
                return Object.assign({ ready: true, badge: null }, res.data[0]);
            } catch (e) {
                return this.emptyGroup();
            }
        }
    };
})(window);
