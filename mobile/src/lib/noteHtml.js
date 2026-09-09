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

function imgSrc(tag) {
    var m = /src\s*=\s*["']([^"']+)["']/i.exec(tag || "");
    return m ? m[1] : "";
}

function pullImgs(html, blocks) {
    var rest = String(html || "").replace(/<img\b[^>]*>/gi, function (tag) {
        var src = imgSrc(tag);
        if (src) blocks.push({ type: "img", src: src });
        return "";
    });
    return rest;
}

function hasText(html) {
    return String(html || "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").trim().length > 0;
}

function parseNoteBlocks(raw) {
    var s = normalizeNoteHtml(raw);
    s = s.replace(/<\/?div[^>]*>/gi, "\n");
    var blocks = [];
    var re = /<(h[3-5]|p|ul|ol|table)(\s[^>]*)?>([\s\S]*?)<\/\1>|<img\b[^>]*>/gi;
    var m;
    while ((m = re.exec(s))) {
        if (m[0].slice(0, 4).toLowerCase() === "<img") {
            var src0 = imgSrc(m[0]);
            if (src0) blocks.push({ type: "img", src: src0 });
            continue;
        }
        var tag = (m[1] || "").toLowerCase();
        var inner = m[3] || "";
        if (tag === "h3") {
            inner = pullImgs(inner, blocks);
            if (hasText(inner)) blocks.push({ type: "badge", html: inner });
        } else if (tag === "h4" || tag === "h5") {
            inner = pullImgs(inner, blocks);
            if (hasText(inner)) blocks.push({ type: "heading", html: inner });
        } else if (tag === "p") {
            inner = pullImgs(inner, blocks);
            if (hasText(inner)) blocks.push({ type: "item", html: inner });
        } else if (tag === "ul" || tag === "ol") {
            var liRe = /<li[^>]*>([\s\S]*?)<\/li>/gi;
            var li;
            while ((li = liRe.exec(inner))) {
                var piece = pullImgs(li[1], blocks);
                if (hasText(piece)) blocks.push({ type: "item", html: piece });
            }
        } else if (tag === "table") {
            blocks.push({ type: "table", html: m[0] });
        }
    }
    if (!blocks.length) {
        var leftover = pullImgs(s, blocks);
        if (hasText(leftover)) blocks.push({ type: "item", html: leftover });
    }
    return blocks;
}

export { normalizeNoteHtml, parseNoteBlocks };
