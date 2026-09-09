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
    return String(html || "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/\s+/g, " ").trim().length > 0;
}

function cleanGap(html) {
    return String(html || "")
        .replace(/<\/?(?:div|span)[^>]*>/gi, " ")
        .replace(/<br\s*\/?>/gi, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function flushGap(gap, blocks) {
    var rest = pullImgs(gap, blocks);
    String(rest || "").split(/\n+/).forEach(function (line) {
        var chunk = cleanGap(line);
        if (chunk) blocks.push({ type: "item", html: chunk });
    });
}

function parseNoteBlocks(raw) {
    var s = normalizeNoteHtml(raw);
    s = s.replace(/<\/?div[^>]*>/gi, "\n");
    var blocks = [];
    var re = /<(h[1-6]|p|ul|ol|table|blockquote)(\s[^>]*)?>([\s\S]*?)<\/\1>|<img\b[^>]*>/gi;
    var last = 0;
    var m;
    while ((m = re.exec(s))) {
        flushGap(s.slice(last, m.index), blocks);
        last = m.index + m[0].length;
        if (m[0].slice(0, 4).toLowerCase() === "<img") {
            var src0 = imgSrc(m[0]);
            if (src0) blocks.push({ type: "img", src: src0 });
            continue;
        }
        var tag = (m[1] || "").toLowerCase();
        var inner = m[3] || "";
        if (tag === "h3" || tag === "h1" || tag === "h2") {
            inner = pullImgs(inner, blocks);
            if (hasText(inner)) blocks.push({ type: "badge", html: inner });
        } else if (tag === "h4" || tag === "h5" || tag === "h6") {
            inner = pullImgs(inner, blocks);
            if (hasText(inner)) blocks.push({ type: "heading", html: inner });
        } else if (tag === "p" || tag === "blockquote") {
            inner = pullImgs(inner, blocks);
            if (hasText(inner)) blocks.push({ type: "item", html: inner });
        } else if (tag === "ul" || tag === "ol") {
            var liRe = /<li[^>]*>([\s\S]*?)<\/li>/gi;
            var li;
            var found = false;
            while ((li = liRe.exec(inner))) {
                var piece = pullImgs(li[1], blocks);
                if (hasText(piece)) {
                    found = true;
                    blocks.push({ type: "item", html: piece });
                }
            }
            if (!found) {
                inner = pullImgs(inner, blocks);
                if (hasText(inner)) blocks.push({ type: "item", html: inner });
            }
        } else if (tag === "table") {
            blocks.push({ type: "table", html: m[0] });
        }
    }
    flushGap(s.slice(last), blocks);
    return blocks;
}

export { normalizeNoteHtml, parseNoteBlocks };
