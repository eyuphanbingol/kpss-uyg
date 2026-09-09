function normalizeNoteHtml(raw) {
    var s = String(raw || "");
    s = s.replace(/<span([^>]*\binline-flex\b[^>]*)>([\s\S]*?)<\/span>/gi, function (_m, _attrs, inner) {
        return "<h3>" + inner + "</h3>";
    });
    s = s.replace(/<span[^>]*>\s*<\/span>/gi, "");
    s = s.replace(/\s(?:class|style)="[^"]*"/gi, "");
    s = s.replace(/\s(?:class|style)='[^']*'/gi, "");
    s = s.replace(/<(section|article|header|footer)(\s[^>]*)?>/gi, "<div>");
    s = s.replace(/<\/(section|article|header|footer)>/gi, "</div>");
    return s;
}

export { normalizeNoteHtml };
