export var TR_MAP_URLS = [
    "https://www.atanly.com/svg/tr.svg?v=3",
    "https://kpss-uyg.vercel.app/svg/tr.svg?v=3"
];

var svgCache = "";

export function loadTrSvg() {
    if (svgCache) return Promise.resolve(svgCache);
    function tryUrl(i) {
        if (i >= TR_MAP_URLS.length) return Promise.reject(new Error("svg"));
        return fetch(TR_MAP_URLS[i]).then(function (r) {
            if (!r.ok) throw new Error("http");
            return r.text();
        }).then(function (txt) {
            if (!txt || txt.indexOf("<svg") < 0) throw new Error("empty");
            svgCache = txt;
            return txt;
        }).catch(function () {
            return tryUrl(i + 1);
        });
    }
    return tryUrl(0);
}

function prepSvg(raw) {
    var txt = String(raw || "").replace(/<\?xml[^>]*>/i, "").trim();
    txt = txt.replace(/<svg\b([^>]*)>/i, function (_m, attrs) {
        var a = String(attrs || "")
            .replace(/\s(width|height)=("[^"]*"|'[^']*')/gi, "")
            .replace(/\sclass=("[^"]*"|'[^']*')/gi, "")
            .replace(/\sstroke=("[^"]*"|'[^']*')/gi, "")
            .replace(/\sstroke-width=("[^"]*"|'[^']*')/gi, "")
            .replace(/\sfill=("[^"]*"|'[^']*')/gi, "");
        if (!/viewBox=/i.test(a) && !/viewbox=/i.test(a)) a += ' viewBox="0 0 1000 422"';
        return "<svg" + a + ' class="tr-map" preserveAspectRatio="xMidYMid meet">';
    });
    return txt;
}

var CSS = [
    "html,body{margin:0;padding:0;background:#0c3d56;width:100%;height:100%;max-width:100%;max-height:100%;overflow:hidden;touch-action:none;-webkit-user-select:none;user-select:none;}",
    ".wrap{position:relative;width:100%;height:100%;max-width:100%;max-height:100%;overflow:hidden;background:radial-gradient(ellipse 75% 65% at 50% 42%,rgba(70,150,190,.38),transparent 72%),linear-gradient(180deg,#11506d 0%,#0c3d56 55%,#082d42 100%);touch-action:none;}",
    ".wrap:before{content:'';position:absolute;inset:-10%;background:repeating-linear-gradient(172deg,rgba(255,255,255,.045) 0 1px,transparent 1px 11px);pointer-events:none;}",
    ".wrap:after{content:'';position:absolute;inset:0;z-index:2;pointer-events:none;background:radial-gradient(ellipse 90% 75% at 50% 45%,transparent 55%,rgba(4,14,22,.38) 100%);}",
    ".canvas{position:relative;z-index:1;width:100%;height:100%;transform-origin:center center;will-change:transform;}",
    "svg{width:100%;height:100%;max-width:100%;max-height:100%;display:block;}",
    ".zoom-tools{position:absolute;right:8px;bottom:8px;z-index:6;display:flex;flex-direction:column;gap:6px;}",
    ".zoom-tools button{width:40px;height:40px;border-radius:12px;border:1px solid rgba(13,44,77,.12);background:rgba(255,255,255,.94);font-size:20px;font-weight:800;line-height:1;color:#0f172a;box-shadow:0 6px 16px rgba(4,28,36,.12);}",
    ".zoom-tools .zreset{width:auto;padding:0 10px;font-size:12px;letter-spacing:.04em;text-transform:uppercase;}",
    "path{fill:#f2e6c6!important;stroke:rgba(112,88,52,.55)!important;stroke-width:.8!important;stroke-linejoin:round;vector-effect:non-scaling-stroke;pointer-events:none;}",
    ".mode-conquer:before{display:none;}",
    ".mode-conquer{background:#8fa89a;}",
    ".mode-conquer path{fill:#dce8e1!important;stroke:#1f3d32!important;stroke-width:1.35!important;pointer-events:auto;cursor:pointer;}",
    ".mode-conquer path.conquer-owned{fill:var(--c,#127880)!important;stroke:#0b3d42!important;}",
    ".mode-conquer path.conquer-pick{fill:#d97706!important;stroke:#7c2d12!important;}",
    ".topic-hit{fill:transparent;pointer-events:auto;cursor:pointer;stroke:none!important;}",
    ".topic-ico{font-size:28px;pointer-events:none;}",
    ".topic-mark-done{opacity:.42;}",
    ".topic-mark-ok .topic-hit{fill:rgba(5,150,105,.28);}",
    ".topic-mark-bad .topic-hit{fill:rgba(225,29,72,.28);}",
    ".place-well{fill:none;stroke:#f59e0b;stroke-width:2.4;pointer-events:none;}",
    ".place-well-core{fill:rgba(245,158,11,.22);stroke:none;pointer-events:none;}",
    ".place-locked .place-well{stroke:#059669;stroke-dasharray:none;}",
    ".place-locked .place-well-core{fill:rgba(16,185,129,.55);}",
    ".place-shown .place-well{stroke:#94a3b8;}",
    ".place-shown .place-well-core{fill:rgba(148,163,184,.45);}",
    ".place-miss .place-well{stroke:#e11d48;}",
    ".place-miss .place-well-core{fill:rgba(225,29,72,.45);}",
    ".map-pin{font-size:14px;font-weight:800;paint-order:stroke;stroke:#fffaf0;stroke-width:4.5px;fill:#0f2a1f;}",
    ".map-pin-ok{fill:#064e3b;}",
    ".map-pin-bad{fill:#9f1239;}",
    ".map-pin-done{fill:#44403c;}"
].join("");

export function mapDocument(svgText, mode) {
    var svg = prepSvg(svgText);
    return "<!DOCTYPE html><html><head><meta charset=\"utf-8\"/>"
        + "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no\"/>"
        + "<style>" + CSS + "</style></head>"
        + "<body><div class=\"wrap mode-" + (mode === "conquer" ? "conquer" : "play") + "\" id=\"wrap\">"
        + "<div class=\"canvas\" id=\"canvas\">" + svg + "</div>"
        + "<div class=\"zoom-tools\" id=\"ztools\">"
        + "<button type=\"button\" id=\"zplus\">+</button>"
        + "<button type=\"button\" id=\"zminus\">−</button>"
        + "<button type=\"button\" id=\"zreset\" class=\"zreset\">Tam</button>"
        + "</div></div><script>"
        + "function post(o){if(window.ReactNativeWebView)window.ReactNativeWebView.postMessage(JSON.stringify(o));}"
        + "var svg=document.querySelector('svg');"
        + "if(svg){svg.removeAttribute('width');svg.removeAttribute('height');"
        + "svg.setAttribute('viewBox',svg.getAttribute('viewBox')||svg.getAttribute('viewbox')||'0 0 1000 422');}"
        + "window.setPlay=function(st){"
        + "var s=document.querySelector('svg');if(!s)return;"
        + "var old=s.querySelector('g.topic-dots');if(old)old.remove();"
        + "var labs=s.querySelector('g.map-float-labels');if(labs)labs.remove();"
        + "var g=document.createElementNS('http://www.w3.org/2000/svg','g');g.setAttribute('class','topic-dots');"
        + "var lg=document.createElementNS('http://www.w3.org/2000/svg','g');lg.setAttribute('class','map-float-labels');"
        + "var placed=[];"
        + "(st.pins||[]).forEach(function(p){"
        + "var x=Number(p.x)||0,y=Number(p.y)||0;"
        + "if(p.hasOff&&p.code){var path=s.querySelector(\"[id='\"+String(p.code)+\"']\");"
        + "if(path&&path.getBBox){try{var b=path.getBBox();if(b.width>1&&b.height>1){"
        + "var cx=b.x+b.width/2,cy=b.y+b.height/2;"
        + "x=cx+(Number(p.ox)||0)*b.width;y=cy+(Number(p.oy)||0)*b.height;"
        + "}}catch(e){}}}"
        + "else if(!(x>0&&y>0)&&p.code){var path2=s.querySelector(\"[id='\"+String(p.code)+\"']\");"
        + "if(path2&&path2.getBBox){try{var b2=path2.getBBox();if(b2.width>1&&b2.height>1){x=b2.x+b2.width/2;y=b2.y+b2.height/2;}}catch(e2){}}}"
        + "placed.push({p:p,x:x,y:y});"
        + "});"
        + "var minD=Number(st.separate)||36;"
        + "var n,i,j;"
        + "for(n=0;n<18;n++){for(i=0;i<placed.length;i++){for(j=i+1;j<placed.length;j++){"
        + "var dx=placed[j].x-placed[i].x,dy=placed[j].y-placed[i].y,d=Math.sqrt(dx*dx+dy*dy);"
        // Üst üste binen (aynı koordinatlı) iki pin sabit bir açıyla ayrılır.
        + "if(d<0.001){var ang=i*2.399963+j*0.7;dx=Math.cos(ang);dy=Math.sin(ang);d=1;}"
        + "if(d<minD){var push=(minD-d)/2+0.8;placed[i].x-=(dx/d)*push;placed[i].y-=(dy/d)*push;placed[j].x+=(dx/d)*push;placed[j].y+=(dy/d)*push;}"
        + "}}}"
        + "placed.forEach(function(row){"
        + "row.x=Math.max(18,Math.min(982,row.x));row.y=Math.max(18,Math.min(404,row.y));"
        + "var p=row.p,x=row.x,y=row.y;"
        + "var wrap=document.createElementNS('http://www.w3.org/2000/svg','g');"
        + "wrap.setAttribute('data-pin',p.id);"
        + "wrap.setAttribute('data-x',String(x));wrap.setAttribute('data-y',String(y));"
        + "var locked=!!(st.placed&&st.placed[p.id]);"
        + "var cls=st.place?'topic-mark place-mark':'topic-mark';"
        + "if(st.place){if(locked)cls+=' place-locked';if(st.shown&&st.shown[p.id])cls+=' place-shown';if(st.flash===p.id)cls+=' place-miss';}"
        + "else{if(st.cleared&&st.cleared[p.id])cls+=' topic-mark-done';"
        + "if(st.picked&&p.id===st.targetId)cls+=' topic-mark-ok';"
        + "else if(st.picked&&p.id===st.picked)cls+=' topic-mark-bad';}"
        + "wrap.setAttribute('class',cls);"
        + "if(st.place){var glow=document.createElementNS('http://www.w3.org/2000/svg','circle');"
        + "glow.setAttribute('cx',String(x));glow.setAttribute('cy',String(y));glow.setAttribute('r',locked?'16':'20');glow.setAttribute('class',locked?'place-well-core is-locked':'place-well-core');"
        + "var ring=document.createElementNS('http://www.w3.org/2000/svg','circle');"
        + "ring.setAttribute('cx',String(x));ring.setAttribute('cy',String(y));ring.setAttribute('r','15');ring.setAttribute('class','place-well');"
        + "wrap.appendChild(glow);wrap.appendChild(ring);}"
        + "var hit=document.createElementNS('http://www.w3.org/2000/svg','circle');"
        + "hit.setAttribute('cx',String(x));hit.setAttribute('cy',String(y));hit.setAttribute('r','26');hit.setAttribute('class','topic-hit');"
        + "wrap.appendChild(hit);"
        + "if(!st.place||locked){var ico=document.createElementNS('http://www.w3.org/2000/svg','text');"
        + "ico.setAttribute('x',String(x));ico.setAttribute('y',String(y));"
        + "ico.setAttribute('class','topic-ico');ico.setAttribute('text-anchor','middle');"
        + "ico.setAttribute('dominant-baseline','central');ico.textContent=p.glyph||st.glyph||'📍';"
        + "wrap.appendChild(ico);}"
        + "g.appendChild(wrap);"
        + "if(st.place&&locked&&(!st.lastId||st.lastId===p.id)){var t=document.createElementNS('http://www.w3.org/2000/svg','text');"
        + "t.setAttribute('x',String(x));t.setAttribute('y',String(y-24));"
        + "t.setAttribute('class','map-pin map-pin-ok');t.textContent=p.name||'';lg.appendChild(t);}"
        + "});"
        + "(st.labels||[]).forEach(function(row){"
        + "var x=row.x,y=row.y;"
        + "if(row.id){var mark=s.querySelector(\"[data-pin='\"+row.id+\"']\");if(mark){x=mark.getAttribute('data-x');y=mark.getAttribute('data-y');}}"
        + "var t=document.createElementNS('http://www.w3.org/2000/svg','text');"
        + "t.setAttribute('x',String(x));t.setAttribute('y',String(Number(y)-22));"
        + "t.setAttribute('class','map-pin map-pin-'+(row.kind||'done'));t.textContent=row.text||'';"
        + "lg.appendChild(t);"
        + "});"
        + "if(st.place&&placed.length){var fk=placed.map(function(r){return r.p.id;}).sort().join(',');"
        + "if(window.__fitKey!==fk&&wrap){window.__fitKey=fk;var W=wrap.clientWidth,H=wrap.clientHeight;"
        + "if(W>0&&H>0){var k=Math.min(W/1000,H/422),pad=55;"
        + "var xs=placed.map(function(r){return r.x;}),ys=placed.map(function(r){return r.y;});"
        + "var mnx=Math.min.apply(null,xs)-pad,mxx=Math.max.apply(null,xs)+pad,mny=Math.min.apply(null,ys)-pad,mxy=Math.max.apply(null,ys)+pad;"
        + "var sf=Math.min(W/((mxx-mnx)*k),H/((mxy-mny)*k)),sm=Math.max(1,17/(15*k)),sc=Math.max(1,Math.min(sf,sm,4.5));"
        + "if(sc>1.15){var bx=(W-1000*k)/2+k*(mnx+mxx)/2,by=(H-422*k)/2+k*(mny+mxy)/2;applyZ(sc,-sc*(bx-W/2),-sc*(by-H/2));}}}}"
        + "s.appendChild(g);s.appendChild(lg);"
        + "};"
        + "window.setConquer=function(st){"
        + "document.getElementById('wrap').style.setProperty('--c',st.color||'#127880');"
        + "var nodes=document.querySelectorAll(\"path[id^='TR']\");"
        + "for(var i=0;i<nodes.length;i++){"
        + "var p=nodes[i];var id=p.getAttribute('id');"
        + "p.classList.toggle('conquer-owned',!!(st.owned&&st.owned[id]));"
        + "p.classList.toggle('conquer-pick',st.pick===id);"
        + "}"
        + "};"
        + "var wrap=document.getElementById('wrap');"
        + "var canvas=document.getElementById('canvas');"
        + "var z={s:1,x:0,y:0};"
        + "var gest={mode:'',x:0,y:0,dist:0,s0:1,x0:0,y0:0,moved:false};"
        + "function applyZ(s,x,y){s=Math.max(1,Math.min(4.5,s));if(s<=1.02){s=1;x=0;y=0;}z={s:s,x:x,y:y};"
        + "if(canvas)canvas.style.transform='translate('+x+'px,'+y+'px) scale('+s+')';}"
        + "function pinchDist(t){var a=t[0],b=t[1],dx=a.clientX-b.clientX,dy=a.clientY-b.clientY;return Math.sqrt(dx*dx+dy*dy)||1;}"
        + "function bumpZ(dir){applyZ(dir===0?1:z.s*(dir>0?1.35:0.74),dir===0?0:z.x,dir===0?0:z.y);}"
        + "if(wrap&&canvas){"
        + "wrap.addEventListener('touchstart',function(e){"
        + "if(e.touches.length===2){gest.mode='pinch';gest.dist=pinchDist(e.touches);gest.s0=z.s;gest.x0=z.x;gest.y0=z.y;gest.moved=true;}"
        + "else if(e.touches.length===1&&z.s>1){gest.mode='pan';gest.x=e.touches[0].clientX;gest.y=e.touches[0].clientY;gest.x0=z.x;gest.y0=z.y;gest.moved=false;}"
        + "else gest.mode='';"
        + "},{passive:true});"
        + "wrap.addEventListener('touchmove',function(e){"
        + "if(gest.mode==='pinch'&&e.touches.length===2){e.preventDefault();applyZ(gest.s0*(pinchDist(e.touches)/gest.dist),gest.x0,gest.y0);}"
        + "else if(gest.mode==='pan'&&e.touches.length===1){var dx=e.touches[0].clientX-gest.x,dy=e.touches[0].clientY-gest.y;"
        + "if(Math.abs(dx)+Math.abs(dy)>8)gest.moved=true;if(gest.moved){e.preventDefault();applyZ(z.s,gest.x0+dx,gest.y0+dy);}}"
        + "},{passive:false});"
        + "wrap.addEventListener('touchend',function(){if(gest.moved)wrap.setAttribute('data-skip-click','1');gest.mode='';});"
        + "}"
        + "var zp=document.getElementById('zplus'),zm=document.getElementById('zminus'),zr=document.getElementById('zreset');"
        + "if(zp)zp.onclick=function(e){e.stopPropagation();bumpZ(1);};"
        + "if(zm)zm.onclick=function(e){e.stopPropagation();bumpZ(-1);};"
        + "if(zr)zr.onclick=function(e){e.stopPropagation();bumpZ(0);};"
        + "document.addEventListener('click',function(ev){"
        + "if(wrap&&wrap.getAttribute('data-skip-click')){wrap.removeAttribute('data-skip-click');return;}"
        + "if(ev.target&&ev.target.closest&&ev.target.closest('.zoom-tools'))return;"
        + "var best=null,bestD=1e9;"
        + "var marks=document.querySelectorAll('[data-pin]');"
        + "for(var mi=0;mi<marks.length;mi++){var mr=marks[mi].getBoundingClientRect();"
        + "var mcx=mr.left+mr.width/2,mcy=mr.top+mr.height/2;"
        + "var md=Math.sqrt((mcx-ev.clientX)*(mcx-ev.clientX)+(mcy-ev.clientY)*(mcy-ev.clientY));"
        + "var reach=Math.max(28,mr.width*0.62);"
        + "if(md<=reach&&md<bestD){bestD=md;best=marks[mi];}}"
        + "var mark=best||(ev.target.closest?ev.target.closest('[data-pin]'):null);"
        + "if(mark){post({type:'pin',id:mark.getAttribute('data-pin')});return;}"
        + "var path=ev.target.closest?ev.target.closest('path'):null;"
        + "var id=path&&path.getAttribute('id');"
        + "if(id&&/^TR\\d{2}$/.test(id))post({type:'province',id:id});"
        + "});"
        + "post({type:'ready'});"
        + "</script></body></html>";
}
