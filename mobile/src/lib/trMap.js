export var TR_MAP_URLS = [
    "https://www.atanly.com/svg/tr.svg?v=2",
    "https://kpss-uyg.vercel.app/svg/tr.svg?v=2"
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
    "html,body{margin:0;padding:0;background:#8fa89a;width:100%;height:100%;max-width:100%;max-height:100%;overflow:hidden;touch-action:none;-webkit-user-select:none;user-select:none;}",
    ".wrap{position:relative;width:100%;height:100%;max-width:100%;max-height:100%;overflow:hidden;background:#8fa89a;touch-action:none;}",
    ".canvas{width:100%;height:100%;transform-origin:center center;will-change:transform;}",
    "svg{width:100%;height:100%;max-width:100%;max-height:100%;display:block;}",
    ".zoom-tools{position:absolute;right:8px;bottom:8px;z-index:6;display:flex;flex-direction:column;gap:6px;}",
    ".zoom-tools button{width:40px;height:40px;border-radius:12px;border:1px solid rgba(13,44,77,.12);background:rgba(255,255,255,.94);font-size:20px;font-weight:800;line-height:1;color:#0f172a;box-shadow:0 6px 16px rgba(4,28,36,.12);}",
    ".zoom-tools .zreset{width:auto;padding:0 10px;font-size:12px;letter-spacing:.04em;text-transform:uppercase;}",
    "path{fill:#eef6f1!important;stroke:#1f3d32!important;stroke-width:1.35!important;stroke-linejoin:round;vector-effect:non-scaling-stroke;pointer-events:none;}",
    ".mode-conquer path{fill:#dce8e1!important;pointer-events:auto;cursor:pointer;}",
    ".mode-conquer path.conquer-owned{fill:var(--c,#127880)!important;stroke:#0b3d42!important;}",
    ".mode-conquer path.conquer-pick{fill:#d97706!important;stroke:#7c2d12!important;}",
    ".topic-hit{fill:transparent;pointer-events:auto;cursor:pointer;stroke:none!important;}",
    ".topic-ico{font-size:28px;pointer-events:none;}",
    ".topic-mark-done{opacity:.42;}",
    ".topic-mark-ok .topic-hit{fill:rgba(5,150,105,.28);}",
    ".topic-mark-bad .topic-hit{fill:rgba(225,29,72,.28);}",
    ".map-pin{font-size:14px;font-weight:800;paint-order:stroke;stroke:#fff;stroke-width:4px;}",
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
        + "if(p.code){var path=s.querySelector(\"[id='\"+String(p.code)+\"']\");"
        + "if(path&&path.getBBox){try{var b=path.getBBox();if(b.width>1&&b.height>1){"
        + "var cx=b.x+b.width/2,cy=b.y+b.height/2;"
        + "if(p.hasOff){x=cx+(Number(p.ox)||0)*b.width;y=cy+(Number(p.oy)||0)*b.height;}"
        + "else if((p.fanN||0)>1){var a=(p.fanI/p.fanN)*Math.PI*2-Math.PI/2;var r=Math.max(22,Math.min(b.width,b.height)*0.38);x=cx+Math.cos(a)*r;y=cy+Math.sin(a)*r;}"
        + "else{x=cx;y=cy;}"
        + "}}catch(e){}}}"
        + "placed.push({p:p,x:x,y:y});"
        + "});"
        + "var minD=Number(st.separate)||36;"
        + "var n,i,j;"
        + "for(n=0;n<18;n++){for(i=0;i<placed.length;i++){for(j=i+1;j<placed.length;j++){"
        + "var dx=placed[j].x-placed[i].x,dy=placed[j].y-placed[i].y,d=Math.sqrt(dx*dx+dy*dy)||0.01;"
        + "if(d<minD){var push=(minD-d)/2+0.8;placed[i].x-=(dx/d)*push;placed[i].y-=(dy/d)*push;placed[j].x+=(dx/d)*push;placed[j].y+=(dy/d)*push;}"
        + "}}}"
        + "placed.forEach(function(row){"
        + "row.x=Math.max(18,Math.min(982,row.x));row.y=Math.max(18,Math.min(404,row.y));"
        + "var p=row.p,x=row.x,y=row.y;"
        + "var wrap=document.createElementNS('http://www.w3.org/2000/svg','g');"
        + "wrap.setAttribute('data-pin',p.id);"
        + "wrap.setAttribute('data-x',String(x));wrap.setAttribute('data-y',String(y));"
        + "var cls='topic-mark';"
        + "if(st.cleared&&st.cleared[p.id])cls+=' topic-mark-done';"
        + "if(st.picked&&p.id===st.targetId)cls+=' topic-mark-ok';"
        + "else if(st.picked&&p.id===st.picked)cls+=' topic-mark-bad';"
        + "wrap.setAttribute('class',cls);"
        + "var hit=document.createElementNS('http://www.w3.org/2000/svg','circle');"
        + "hit.setAttribute('cx',String(x));hit.setAttribute('cy',String(y));hit.setAttribute('r','26');hit.setAttribute('class','topic-hit');"
        + "var ico=document.createElementNS('http://www.w3.org/2000/svg','text');"
        + "ico.setAttribute('x',String(x));ico.setAttribute('y',String(y));"
        + "ico.setAttribute('class','topic-ico');ico.setAttribute('text-anchor','middle');"
        + "ico.setAttribute('dominant-baseline','central');ico.textContent=p.glyph||st.glyph||'📍';"
        + "wrap.appendChild(hit);wrap.appendChild(ico);g.appendChild(wrap);"
        + "});"
        + "(st.labels||[]).forEach(function(row){"
        + "var x=row.x,y=row.y;"
        + "if(row.id){var mark=s.querySelector(\"[data-pin='\"+row.id+\"']\");if(mark){x=mark.getAttribute('data-x');y=mark.getAttribute('data-y');}}"
        + "var t=document.createElementNS('http://www.w3.org/2000/svg','text');"
        + "t.setAttribute('x',String(x));t.setAttribute('y',String(Number(y)-22));"
        + "t.setAttribute('class','map-pin map-pin-'+(row.kind||'done'));t.textContent=row.text||'';"
        + "lg.appendChild(t);"
        + "});"
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
        + "var mark=ev.target.closest?ev.target.closest('[data-pin]'):null;"
        + "if(mark){post({type:'pin',id:mark.getAttribute('data-pin')});return;}"
        + "var path=ev.target.closest?ev.target.closest('path'):null;"
        + "var id=path&&path.getAttribute('id');"
        + "if(id&&/^TR\\d{2}$/.test(id))post({type:'province',id:id});"
        + "});"
        + "post({type:'ready'});"
        + "</script></body></html>";
}
