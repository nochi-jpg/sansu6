// さんすうスペースラボ 共通部品（画面・セーブ・音・うさとろ・図形・テンキー）
(function(){
const S6=window.SANSU6={units:[],addUnit(u){this.units.push(u)}};
const NS='http://www.w3.org/2000/svg';

// ---------- 乱数（シードつき：とちゅうから再開しても同じ問題になる） ----------
S6.rng=function(seed){let s=(seed>>>0)||123456789;
  const r=()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return (s>>>0)/4294967296};
  r.int=n=>Math.floor(r()*n);r.pick=a=>a[r.int(a.length)];
  r.shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=r.int(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};return r};

// ---------- セーブ（オートセーブ） ----------
const KEY='sansu6';let SV=null;
try{SV=JSON.parse(localStorage.getItem(KEY))}catch(e){}
if(!SV||SV.v!==1)SV={v:1,se:1,u:{}};
S6.SV=()=>SV;
S6.save=()=>{try{localStorage.setItem(KEY,JSON.stringify(SV))}catch(e){}};
S6.U=id=>SV.u[id]||(SV.u[id]={st:{},test:{best:0,pass:0},resume:null});
S6.reset=()=>{SV={v:1,se:SV.se,u:{}};S6.save()};

// ---------- 効果音（過去作から流用 se.js） ----------
S6.se=n=>{const v=[0,.35,.8][SV.se];if(!v||!window.S6_SE||!S6_SE[n])return;try{const a=new Audio(S6_SE[n]);a.volume=v;a.play().catch(()=>{})}catch(e){}};

// ---------- DOM ----------
S6.h=function(tag,cls,par,html){const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;if(par)par.appendChild(e);return e};
S6.btn=function(par,o){const b=S6.h('button','btn '+(o.c||'white')+' '+(o.z||'M'),par,o.t);
  b.style.left=o.x+'px';b.style.top=o.y+'px';if(o.w)b.style.width=o.w+'px';
  b.onclick=e=>{if(b.classList.contains('dis'))return;S6.se(o.se||'tap');o.on&&o.on(e,b)};return b};
S6.svg=function(par,w,h,x,y){const s=document.createElementNS(NS,'svg');s.setAttribute('width',w);s.setAttribute('height',h);
  if(x!=null){s.style.position='absolute';s.style.left=x+'px';s.style.top=y+'px'}par.appendChild(s);return s};
S6.el=function(tag,at,par){const e=document.createElementNS(NS,tag);for(const k in at)e.setAttribute(k,at[k]);if(par)par.appendChild(e);return e};
S6.txt=function(par,x,y,s,size,col,anchor,weight){const t=S6.el('text',{x,y,'font-size':size||16,fill:col||'#4d4270','text-anchor':anchor||'middle','dominant-baseline':'central'},par);
  if(weight)t.setAttribute('font-weight',weight);t.textContent=s;return t};
S6.STAR=f=>`<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" fill="${f}" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg>`;
S6.STARC=v=>v>=2?'#ffcf5c':v>=1?'#aeb6d0':'#ece8f6';

// ---------- 画面の大きさ合わせ ----------
let stage,scr,bar,talk;
function fit(){const s=Math.min(innerWidth/1280,innerHeight/720);stage.style.transform=`scale(${s})`;stage.style.left=(innerWidth-1280*s)/2+'px';stage.style.top=(innerHeight-720*s)/2+'px'}
S6.init=function(){stage=document.getElementById('stage');scr=document.getElementById('scr');bar=document.getElementById('bar');talk=document.getElementById('talk');
  addEventListener('resize',fit);fit()};

// 画面を出す。o={title, back:fn, chip, talk:true/false, render(root)}
S6.show=function(o){scr.innerHTML='';scr.className='';void scr.offsetWidth;scr.className='on';
  bar.innerHTML='';bar.style.display=o.title?'':'none';
  if(o.title){if(o.back)S6.btn(bar,{t:'<span class="arw"></span>もどる',x:24,y:12,w:150,c:'white back',on:o.back,se:'tap'});
    S6.h('div','ttl',bar,o.title);S6.h('div','chip',bar,o.chip||'')}
  talk.style.display=o.talk===false?'none':'';hintFn=null;$('#hintb').style.display='none';$('#bal').classList.remove('hashint');
  o.render(scr)};
S6.chip=t=>{const c=bar.querySelector('.chip');if(c)c.innerHTML=t};
const $=s=>document.querySelector(s);

// ---------- うさとろ ----------
let hintFn=null;
S6.talk=function(q,s,mood){const b=$('#bal');b.querySelector('.q').innerHTML=q||'';b.querySelector('.s').innerHTML=s||'';b.classList.toggle('only',!q);S6.mood(mood)};
S6.say=function(s,mood){$('#bal .s').innerHTML=s||'';S6.mood(mood)};
S6.mood=function(m){const u=$('#usa');u.className='';if(m){void u.offsetWidth;u.className=m}};
S6.setHint=function(fn){hintFn=fn;$('#hintb').style.display=fn?'':'none';$('#bal').classList.toggle('hashint',!!fn)};
S6.hintClick=()=>{S6.se('tap');hintFn&&hintFn()};

// ---------- 図形 ----------
const G=S6.G={
 len:(a,b)=>Math.hypot(b[0]-a[0],b[1]-a[1]),
 area(p){let s=0;for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length];s+=a[0]*b[1]-b[0]*a[1]}return s/2},
 ang(p,i){const n=p.length,a=p[(i+n-1)%n],b=p[i],c=p[(i+1)%n];const u=[a[0]-b[0],a[1]-b[1]],v=[c[0]-b[0],c[1]-b[1]];
   return Math.acos(Math.max(-1,Math.min(1,(u[0]*v[0]+u[1]*v[1])/(Math.hypot(...u)*Math.hypot(...v)))))*180/Math.PI},
 sides:p=>p.map((q,i)=>G.len(q,p[(i+1)%p.length])),
 fmt(x){const r=Math.round(x*10)/10;return Number.isInteger(r)?String(r):r.toFixed(1)},
 kname(k){const f=G.frac(k);return f?f:G.fmt(k)},
 frac(k){for(const d of [2,3,4,5])if(Math.abs(k*d-1)<1e-9)return '1/'+d;return null},
 bbox(p){const xs=p.map(q=>q[0]),ys=p.map(q=>q[1]);return{x:Math.min(...xs),y:Math.min(...ys),w:Math.max(...xs)-Math.min(...xs),h:Math.max(...ys)-Math.min(...ys)}},
 // k倍・回転(90度×rot)・裏返し
 tf(p,k,rot,flip){return p.map(([x,y])=>{if(flip)x=-x;let X=x*k,Y=y*k;for(let r=0;r<(rot||0);r++)[X,Y]=[-Y,X];return[X,Y]})},
 scaleXY:(p,sx,sy)=>p.map(([x,y])=>[x*sx,y*sy]),
 // 2つの多角形が 拡大図・縮図の関係か（回転・裏返しOK）。関係なら倍率を返す
 similar(p,q){const n=p.length;if(q.length!==n)return 0;const L1=G.sides(p),L2=G.sides(q),A1=p.map((_,i)=>G.ang(p,i)),A2=q.map((_,i)=>G.ang(q,i));
   for(const dir of [1,-1])for(let s=0;s<n;s++){let k=null,ok=true;
     for(let i=0;i<n&&ok;i++){const j=((s+dir*i)%n+n)%n;const je=dir===1?j:((j-1)%n+n)%n;
       const r=L2[je]/L1[i];if(k===null)k=r;if(Math.abs(r-k)>1e-6*Math.max(1,k))ok=false;
       if(Math.abs(A1[i]-A2[j])>0.05)ok=false}
     if(ok)return k}
   return 0},
 // 多角形をかく  o:{s:1cmのpx, cx,cy, side, angle, names, hideS:{i:'□cm'}, hideA:{i:'□°'}, hl:{v:[],e:[]}, fill, stroke, fs, lw}
 draw(svg,p,o){const s=o.s,b=G.bbox(p),ox=o.cx-(b.x+b.w/2)*s,oy=o.cy-(b.y+b.h/2)*s,el=S6.el,txt=S6.txt;
  const P=p.map(([x,y])=>[ox+x*s,oy+y*s]),g=el('g',{},svg),cw=G.area(P)>0?1:-1,n=P.length,fs=o.fs||16;
  el('polygon',{points:P.map(q=>q.join(',')).join(' '),fill:o.fill||'#ddf0ff',stroke:o.stroke||'#5d9fd8','stroke-width':o.lw||3,'stroke-linejoin':'round'},g);
  if(o.hl&&o.hl.e)o.hl.e.forEach(i=>{const a=P[i],c=P[(i+1)%n];el('line',{x1:a[0],y1:a[1],x2:c[0],y2:c[1],stroke:'#ff5f9e','stroke-width':7,'stroke-linecap':'round'},g)});
  // 角（内側）：弧と数字
  if(o.angle)for(let i=0;i<n;i++){if(Array.isArray(o.angle)&&!o.angle.includes(i))continue;
    const a=P[(i+n-1)%n],c=P[(i+1)%n],v0=P[i];const u=[a[0]-v0[0],a[1]-v0[1]],v=[c[0]-v0[0],c[1]-v0[1]],lu=Math.hypot(...u),lv=Math.hypot(...v);
    const ux=u[0]/lu,uy=u[1]/lu,vx=v[0]/lv,vy=v[1]/lv;let bx=ux+vx,by=uy+vy;const bl=Math.hypot(bx,by)||1;bx/=bl;by/=bl;
    const A=G.ang(p,i),hid=o.hideA&&o.hideA[i],col=hid?'#e46f9f':'#8270cf',r=15;
    if(Math.abs(A-90)<0.5){const q=10;el('path',{d:`M${v0[0]+ux*q} ${v0[1]+uy*q} L${v0[0]+ux*q+vx*q} ${v0[1]+uy*q+vy*q} L${v0[0]+vx*q} ${v0[1]+vy*q}`,fill:'none',stroke:col,'stroke-width':2},g)}
    else{const sw=(ux*vy-uy*vx)>0?1:0;el('path',{d:`M${v0[0]+ux*r} ${v0[1]+uy*r} A${r} ${r} 0 0 ${sw} ${v0[0]+vx*r} ${v0[1]+vy*r}`,fill:'none',stroke:col,'stroke-width':2},g)}
    const d=Math.min(56,Math.max(26,16/Math.sin(A*Math.PI/360)));txt(g,v0[0]+bx*d,v0[1]+by*d,hid||Math.round(A)+'°',fs-1,col)}
  // 辺（外側）
  if(o.side)for(let i=0;i<n;i++){if(Array.isArray(o.side)&&!o.side.includes(i))continue;
    const a=P[i],c=P[(i+1)%n],m=[(a[0]+c[0])/2,(a[1]+c[1])/2],L=Math.hypot(c[0]-a[0],c[1]-a[1]);
    const nx=(c[1]-a[1])/L*cw,ny=-(c[0]-a[0])/L*cw,hid=o.hideS&&o.hideS[i],t=hid||G.fmt(G.len(p[i],p[(i+1)%n]))+'cm';
    const off=12+Math.abs(nx)*(t.length*fs*.29)+Math.abs(ny)*fs*.55;txt(g,m[0]+nx*off,m[1]+ny*off,t,fs,hid?'#e46f9f':'#4d4270')}
  if(o.names){o.names.forEach((nm,i)=>{if(!nm)return;const q=P[i],a=P[(i+n-1)%n],c=P[(i+1)%n];
      const ua=[a[0]-q[0],a[1]-q[1]],uc=[c[0]-q[0],c[1]-q[1]],la=Math.hypot(...ua),lc=Math.hypot(...uc);let bx=-(ua[0]/la+uc[0]/lc),by=-(ua[1]/la+uc[1]/lc);const bl=Math.hypot(bx,by)||1;bx/=bl;by/=bl;
      if(o.hl&&o.hl.v&&o.hl.v.includes(i))el('circle',{cx:q[0],cy:q[1],r:11,fill:'#ff5f9e',stroke:'#fff','stroke-width':3},g);
      txt(g,q[0]+bx*22,q[1]+by*22,nm,21,'#4d4270','middle',900)})}
  return{g,P}},
 // はみ出し・文字の重なりがない大きさを探してかく（大きい順にためす）
 drawSafe(svg,p,o,list){const W=+svg.getAttribute('width'),H=+svg.getAttribute('height');let last=null;
  for(const fs of [o.fs||16,(o.fs||16)-2])for(const s of list){if(last)last.g.remove();last=G.draw(svg,p,Object.assign({},o,{s,fs}));const ts=[...last.g.querySelectorAll('text')].map(x=>x.getBBox());
   const out=ts.some(b=>b.x<2||b.y<2||b.x+b.width>W-2||b.y+b.height>H-2);let ov=false;
   for(let i=0;i<ts.length&&!ov;i++)for(let j=i+1;j<ts.length;j++){const a=ts[i],b=ts[j];if(a.x+1<b.x+b.width&&b.x+1<a.x+a.width&&a.y+1<b.y+b.height&&b.y+1<a.y+a.height){ov=true;break}}
   if(!out&&!ov)return last}return last},
 // いくつかの図形を同じ縮尺で入れる大きさ
 fit(polys,w,h){let s=1e9;polys.forEach(p=>{const b=G.bbox(p);s=Math.min(s,w/(b.w||1e-9),h/(b.h||1e-9))});return s}
};

// ---------- テンキー ----------
S6.numpad=function(par,o){const h=S6.h,d=h('div','disp',par);let v='';
  const pre=h('span','pre',d,o.prefix||''),val=h('span','',d,'&nbsp;');h('span','u',d,o.unit||'');
  const KEYS=['7','8','9','4','5','6','1','2','3','0','.','けす'],bs=[];
  KEYS.forEach((k,i)=>bs.push(S6.btn(par,{t:k,x:20+(i%3)*104,y:110+Math.floor(i/3)*68,w:84,c:k==='けす'?'peach':'white',
    on:()=>{if(lock)return;d.className='disp';if(k==='けす')v=v.slice(0,-1);else if(v.length<6&&!(k==='.'&&v.includes('.')))v+=k;val.innerHTML=v||'&nbsp;'}})));
  let lock=false;
  return{get:()=>v,num:()=>v===''||v==='.'?NaN:parseFloat(v),mark:c=>{d.className='disp '+c},clear:()=>{v='';val.innerHTML='&nbsp;';d.className='disp'},
    lock:f=>{lock=f;bs.forEach(b=>b.classList.toggle('dis',f))}}};

// せいかいスタンプ
S6.stamp=function(par){const s=S6.h('div','stamp',par,`<svg viewBox="0 0 220 220" width="220" height="220"><circle cx="110" cy="110" r="88" fill="rgba(255,255,255,.85)" stroke="#5fc9a3" stroke-width="16"/><text x="110" y="112" text-anchor="middle" dominant-baseline="central" font-size="38" font-weight="900" fill="#3fa982">せいかい</text></svg>`);setTimeout(()=>s.remove(),950)};
})();
