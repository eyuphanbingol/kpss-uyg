export function go(navigation, name, params) {
    if (!navigation || typeof navigation.navigate !== "function") return;
    var n = navigation;
    var found = null;
    while (n) {
        var names = [];
        try {
            var state = n.getState && n.getState();
            names = (state && state.routeNames) || [];
        } catch (e) {
            names = [];
        }
        if (names.indexOf(name) >= 0) {
            found = n;
            break;
        }
        n = typeof n.getParent === "function" ? n.getParent() : null;
    }
    try {
        (found || navigation).navigate(name, params);
    } catch (e) {
        try { navigation.navigate(name, params); } catch (e2) {}
    }
}
