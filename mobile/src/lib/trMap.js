import { TR_SVG } from "./trSvgData";

// Harita uygulamaya gömülüdür (scripts/sync-map-data.js üretir): açılışta ağ beklenmez,
// çevrimdışıyken de oyun açılır.
export function loadTrSvg() {
    return Promise.resolve(TR_SVG);
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
    "html,body{margin:0;padding:0;background:#0c3d56;width:100%;height:100%;max-width:100%;max-height:100%;overflow:hidden;touch-action:none;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;}",
    ".wrap{position:relative;width:100%;height:100%;max-width:100%;max-height:100%;overflow:hidden;background:radial-gradient(ellipse 75% 65% at 50% 42%,rgba(70,150,190,.38),transparent 72%),linear-gradient(180deg,#11506d 0%,#0c3d56 55%,#082d42 100%);touch-action:none;}",
    ".wrap:before{content:'';position:absolute;inset:-10%;background:repeating-linear-gradient(172deg,rgba(255,255,255,.045) 0 1px,transparent 1px 11px);pointer-events:none;}",
    ".wrap:after{content:'';position:absolute;inset:0;z-index:2;pointer-events:none;background:radial-gradient(ellipse 90% 75% at 50% 45%,transparent 55%,rgba(4,14,22,.38) 100%);}",
    // will-change yalnız hareket sırasında: bırakınca harita yakınlaştırılmış hâlde net çizilir
    ".canvas{position:relative;z-index:1;width:100%;height:100%;transform-origin:center center;}",
    ".canvas.moving{will-change:transform;}",
    "svg{width:100%;height:100%;max-width:100%;max-height:100%;display:block;}",
    ".zoom-tools{position:absolute;right:8px;bottom:8px;z-index:6;display:flex;flex-direction:column;gap:6px;}",
    ".zoom-tools button{width:40px;height:40px;border-radius:12px;border:1px solid rgba(13,44,77,.12);background:rgba(255,255,255,.94);font-size:20px;font-weight:800;line-height:1;color:#0f172a;box-shadow:0 6px 16px rgba(4,28,36,.12);}",
    ".zoom-tools .zreset{width:auto;padding:0 10px;font-size:12px;letter-spacing:.04em;text-transform:uppercase;}",
    "path{fill:#f2e6c6!important;stroke:rgba(112,88,52,.55)!important;stroke-width:.8!important;stroke-linejoin:round;vector-effect:non-scaling-stroke;pointer-events:none;}",
    "path.map-hl{fill:#a7dcbc!important;stroke:#047857!important;stroke-width:1.2!important;}",
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
    ".place-well{fill:none;stroke:#f59e0b;stroke-width:2;vector-effect:non-scaling-stroke;pointer-events:none;}",
    ".place-well-core{fill:rgba(245,158,11,.22);stroke:none;pointer-events:none;}",
    ".place-dot{fill:#7c2d12;stroke:#fffaf0;stroke-width:1;pointer-events:none;}",
    ".place-dot.is-shown{fill:#f8fafc;stroke:none;}",
    ".place-locked .place-well{stroke:#047857;}",
    ".place-locked .place-well-core{fill:#10b981;}",
    ".place-shown .place-well{stroke:#64748b;}",
    ".place-shown .place-well-core{fill:#94a3b8;}",
    ".place-miss .place-well{stroke:#e11d48;}",
    ".place-miss .place-well-core{fill:rgba(225,29,72,.45);}",
    ".place-check{fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;pointer-events:none;}",
    ".place-leader{stroke:rgba(66,44,14,.8);stroke-width:1.1;vector-effect:non-scaling-stroke;pointer-events:none;}",
    ".place-anchor{fill:#7c2d12;stroke:#fffaf0;stroke-width:.8;pointer-events:none;}",
    ".place-locked .place-anchor{fill:#047857;}",
    ".map-pin{font-size:13px;font-weight:800;paint-order:stroke;stroke:#fffaf0;stroke-width:4px;fill:#0f2a1f;pointer-events:none;}",
    ".map-pin-ok{fill:#064e3b;}",
    ".map-pin-bad{fill:#9f1239;}",
    ".map-pin-done{fill:#44403c;}"
].join("");

// WebView içinde çalışan kod. String.raw: içindeki \d gibi kaçışlar olduğu gibi kalsın.
var SCRIPT = String.raw`
function post(o){if(window.ReactNativeWebView)window.ReactNativeWebView.postMessage(JSON.stringify(o));}
var NS='http://www.w3.org/2000/svg';
var svg=document.querySelector('svg');
if(svg){svg.removeAttribute('width');svg.removeAttribute('height');
svg.setAttribute('viewBox',svg.getAttribute('viewBox')||svg.getAttribute('viewbox')||'0 0 1000 422');}
var wrap=document.getElementById('wrap');
var canvas=document.getElementById('canvas');
var z={s:1,x:0,y:0};
var lastPlay=null;
function mk(tag,attrs){var n=document.createElementNS(NS,tag);for(var k in attrs){n.setAttribute(k,String(attrs[k]));}return n;}
function applyZ(s,x,y){s=Math.max(1,Math.min(6,s));if(s<=1.02){s=1;x=0;y=0;}z={s:s,x:x,y:y};
if(canvas)canvas.style.transform='translate('+x+'px,'+y+'px) scale('+s+')';}
function centerOf(path){try{var b=path.getBBox();if(b.width>1&&b.height>1)return{x:b.x+b.width/2,y:b.y+b.height/2};}catch(e){}return null;}
// Eski sürüm (tek konumlu) pinler için: birbirine binenleri iterek ayırır.
function separate(placed,minD){var n,i,j;for(n=0;n<18;n++){for(i=0;i<placed.length;i++){for(j=i+1;j<placed.length;j++){
var dx=placed[j].x-placed[i].x,dy=placed[j].y-placed[i].y,d=Math.sqrt(dx*dx+dy*dy);
if(d<0.001){var ang=i*2.399963+j*0.7;dx=Math.cos(ang);dy=Math.sin(ang);d=1;}
if(d<minD){var push=(minD-d)/2+0.8;placed[i].x-=(dx/d)*push;placed[i].y-=(dy/d)*push;placed[j].x+=(dx/d)*push;placed[j].y+=(dy/d)*push;}}}}}
function fitTo(placed,force){
var fk=placed.map(function(r){return r.p.id;}).sort().join(',');
if(!force&&window.__fitKey===fk)return;
var W=wrap.clientWidth,H=wrap.clientHeight;if(!(W>0&&H>0))return;
window.__fitKey=fk;
var k=Math.min(W/1000,H/422),pad=40;
var xs=[],ys=[];placed.forEach(function(r){xs.push(r.x,r.ax);ys.push(r.y,r.ay);});
var mnx=Math.min.apply(null,xs)-pad,mxx=Math.max.apply(null,xs)+pad,mny=Math.min.apply(null,ys)-pad,mxy=Math.max.apply(null,ys)+pad;
var sf=Math.min(W/((mxx-mnx)*k),H/((mxy-mny)*k)),sm=Math.max(1,17/(11*k)),sc=Math.max(1,Math.min(sf,sm,4.5));
if(sc>1.15){var bx=(W-1000*k)/2+k*(mnx+mxx)/2,by=(H-422*k)/2+k*(mny+mxy)/2;applyZ(sc,-sc*(bx-W/2),-sc*(by-H/2));}
else applyZ(1,0,0);}
window.setPlay=function(st){
var s=document.querySelector('svg');if(!s)return;
lastPlay=st;
var old=s.querySelector('g.topic-dots');if(old)old.remove();
var labs=s.querySelector('g.map-float-labels');if(labs)labs.remove();
var hl={};(st.hl||[]).forEach(function(c){hl[c]=true;});
var paths=s.querySelectorAll("path[id^='TR']");
for(var pi=0;pi<paths.length;pi++){paths[pi].classList.toggle('map-hl',!!hl[paths[pi].getAttribute('id')]);}
var g=mk('g',{'class':'topic-dots'});
var lg=mk('g',{'class':'map-float-labels'});
var placed=[],legacy=false;
(st.pins||[]).forEach(function(p){
var x=Number(p.x)||0,y=Number(p.y)||0;
if(!(x>0&&y>0)&&p.code){var c=centerOf(s.querySelector("[id='"+String(p.code)+"']"));if(c){x=c.x;y=c.y;}}
var hasA=p.ax!=null&&p.ay!=null;if(!hasA)legacy=true;
placed.push({p:p,x:x,y:y,ax:hasA?Number(p.ax):x,ay:hasA?Number(p.ay):y,off:!!p.off});
});
if(legacy){separate(placed,Number(st.separate)||36);placed.forEach(function(r){r.ax=r.x;r.ay=r.y;r.off=false;});}
placed.forEach(function(row){
row.x=Math.max(12,Math.min(988,row.x));row.y=Math.max(12,Math.min(410,row.y));
var p=row.p,x=row.x,y=row.y;
var locked=!!(st.placed&&st.placed[p.id]);
var shown=!!(st.shown&&st.shown[p.id]);
var cls=st.place?'topic-mark place-mark':'topic-mark';
if(st.place){if(locked)cls+=' place-locked';if(shown)cls+=' place-shown';if(st.flash===p.id)cls+=' place-miss';}
else{if(st.cleared&&st.cleared[p.id])cls+=' topic-mark-done';
if(st.picked&&p.id===st.targetId)cls+=' topic-mark-ok';
else if(st.picked&&p.id===st.picked)cls+=' topic-mark-bad';}
var w=mk('g',{'data-pin':p.id,'data-x':x,'data-y':y,'class':cls});
if(st.place){
if(row.off){w.appendChild(mk('line',{x1:row.ax,y1:row.ay,x2:x,y2:y,'class':'place-leader'}));
w.appendChild(mk('circle',{cx:row.ax,cy:row.ay,r:2.2,'class':'place-anchor'}));}
w.appendChild(mk('circle',{cx:x,cy:y,r:locked?10:13,'class':'place-well-core'}));
w.appendChild(mk('circle',{cx:x,cy:y,r:9,'class':'place-well'}));
if(locked&&!shown)w.appendChild(mk('path',{d:'M'+(x-4)+' '+(y+0.2)+' l2.8 2.9 l5.4 -6','class':'place-check'}));
else w.appendChild(mk('circle',{cx:x,cy:y,r:2.6,'class':shown?'place-dot is-shown':'place-dot'}));
}else{
var ico=mk('text',{x:x,y:y,'class':'topic-ico','text-anchor':'middle','dominant-baseline':'central'});
ico.textContent=p.glyph||st.glyph||'📍';w.appendChild(ico);}
w.appendChild(mk('circle',{cx:x,cy:y,r:20,'class':'topic-hit'}));
g.appendChild(w);
if(st.place&&locked&&st.lastId===p.id){var t=mk('text',{x:x,y:y-16,'class':'map-pin map-pin-ok','text-anchor':'middle'});t.textContent=p.name||'';lg.appendChild(t);}
});
(st.labels||[]).forEach(function(row){
var x=row.x,y=row.y;
if(row.id){var mark=s.querySelector("[data-pin='"+row.id+"']");if(mark){x=mark.getAttribute('data-x');y=mark.getAttribute('data-y');}}
var t=mk('text',{x:x,y:Number(y)-18,'class':'map-pin map-pin-'+(row.kind||'done'),'text-anchor':'middle'});
t.textContent=row.text||'';lg.appendChild(t);
});
if(st.place&&placed.length)fitTo(placed,false);
s.appendChild(g);s.appendChild(lg);
};
// Kap boyutu değişince (döndürme, bölünmüş ekran) haritayı yeniden sığdır; WebView yeniden kurulmaz.
window.relayout=function(){window.__fitKey=null;if(lastPlay)window.setPlay(lastPlay);else applyZ(z.s,z.x,z.y);};
window.setConquer=function(st){
wrap.style.setProperty('--c',st.color||'#127880');
var nodes=document.querySelectorAll("path[id^='TR']");
for(var i=0;i<nodes.length;i++){var p=nodes[i];var id=p.getAttribute('id');
p.classList.toggle('conquer-owned',!!(st.owned&&st.owned[id]));
p.classList.toggle('conquer-pick',st.pick===id);}
};
var gest={mode:'',x:0,y:0,dist:0,s0:1,x0:0,y0:0,moved:false};
function pinchDist(t){var a=t[0],b=t[1],dx=a.clientX-b.clientX,dy=a.clientY-b.clientY;return Math.sqrt(dx*dx+dy*dy)||1;}
function bumpZ(dir){applyZ(dir===0?1:z.s*(dir>0?1.4:0.72),dir===0?0:z.x,dir===0?0:z.y);}
if(wrap&&canvas){
wrap.addEventListener('touchstart',function(e){
canvas.classList.add('moving');
if(e.touches.length===2){gest.mode='pinch';gest.dist=pinchDist(e.touches);gest.s0=z.s;gest.x0=z.x;gest.y0=z.y;gest.moved=true;}
else if(e.touches.length===1&&z.s>1){gest.mode='pan';gest.x=e.touches[0].clientX;gest.y=e.touches[0].clientY;gest.x0=z.x;gest.y0=z.y;gest.moved=false;}
else gest.mode='';
},{passive:true});
wrap.addEventListener('touchmove',function(e){
if(gest.mode==='pinch'&&e.touches.length===2){e.preventDefault();applyZ(gest.s0*(pinchDist(e.touches)/gest.dist),gest.x0,gest.y0);}
else if(gest.mode==='pan'&&e.touches.length===1){var dx=e.touches[0].clientX-gest.x,dy=e.touches[0].clientY-gest.y;
if(Math.abs(dx)+Math.abs(dy)>8)gest.moved=true;if(gest.moved){e.preventDefault();applyZ(z.s,gest.x0+dx,gest.y0+dy);}}
},{passive:false});
function endGest(e){if(gest.moved)wrap.setAttribute('data-skip-click','1');if(!e||!e.touches||!e.touches.length){gest.mode='';canvas.classList.remove('moving');}}
wrap.addEventListener('touchend',endGest);
wrap.addEventListener('touchcancel',endGest);
}
var zp=document.getElementById('zplus'),zm=document.getElementById('zminus'),zr=document.getElementById('zreset');
if(zp)zp.onclick=function(e){e.stopPropagation();bumpZ(1);};
if(zm)zm.onclick=function(e){e.stopPropagation();bumpZ(-1);};
if(zr)zr.onclick=function(e){e.stopPropagation();bumpZ(0);};
document.addEventListener('click',function(ev){
if(wrap&&wrap.getAttribute('data-skip-click')){wrap.removeAttribute('data-skip-click');return;}
if(ev.target&&ev.target.closest&&ev.target.closest('.zoom-tools'))return;
var best=null,bestD=1e9;
var marks=document.querySelectorAll('[data-pin]');
for(var mi=0;mi<marks.length;mi++){
var well=marks[mi].querySelector('.place-well')||marks[mi].querySelector('.topic-hit')||marks[mi];
var mr=well.getBoundingClientRect();
var mcx=mr.left+mr.width/2,mcy=mr.top+mr.height/2;
var md=Math.sqrt((mcx-ev.clientX)*(mcx-ev.clientX)+(mcy-ev.clientY)*(mcy-ev.clientY));
var reach=Math.max(26,mr.width*1.1);
if(md<=reach&&md<bestD){bestD=md;best=marks[mi];}}
var mark=best||(ev.target.closest?ev.target.closest('[data-pin]'):null);
if(mark){post({type:'pin',id:mark.getAttribute('data-pin')});return;}
var path=ev.target.closest?ev.target.closest('path'):null;
var id=path&&path.getAttribute('id');
if(id&&/^TR\d{2}$/.test(id))post({type:'province',id:id});
});
post({type:'ready'});
`;

var docCache = {};

export function mapDocument(svgText, mode) {
    var m = mode === "conquer" ? "conquer" : "play";
    var key = m + ":" + String(svgText || "").length;
    if (docCache[key]) return docCache[key];
    var svg = prepSvg(svgText);
    docCache[key] = "<!DOCTYPE html><html><head><meta charset=\"utf-8\"/>"
        + "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no\"/>"
        + "<style>" + CSS + "</style></head>"
        + "<body><div class=\"wrap mode-" + m + "\" id=\"wrap\">"
        + "<div class=\"canvas\" id=\"canvas\">" + svg + "</div>"
        + "<div class=\"zoom-tools\" id=\"ztools\">"
        + "<button type=\"button\" id=\"zplus\" aria-label=\"Yakınlaştır\">+</button>"
        + "<button type=\"button\" id=\"zminus\" aria-label=\"Uzaklaştır\">−</button>"
        + "<button type=\"button\" id=\"zreset\" class=\"zreset\">Tam</button>"
        + "</div></div><script>" + SCRIPT + "</script></body></html>";
    return docCache[key];
}
