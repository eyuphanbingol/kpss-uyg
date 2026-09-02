export function go(navigation, name, params) {
    var n = navigation;
    var root = navigation;
    while (n && typeof n.getParent === "function") {
        var p = n.getParent();
        if (!p) break;
        root = p;
        n = p;
    }
    root.navigate(name, params);
}
