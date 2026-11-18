// 単元：6年「拡大図と縮図」
(function(){
const S6=SANSU6,G=S6.G,el=S6.el,txt=S6.txt,E=S6.E;
const R3=Math.sqrt(3);

// ---------- 図形のもと（cm） ----------
const TRI=[[[0,0],[4,0],[0,3]],[[0,4],[6,4],[3,0]],[[0,0],[6,0],[2.25,-3.3072]]];
const QUAD=[[[0,0],[3,0],[3,2],[0,2]],[[0,0],[3,0],[6,4],[0,4]],[[0,0],[4,0],[5.5,1.5*R3],[1.5,1.5*R3]],[[0,0],[3,0],[3,3],[0,3]]];
const NB=n=>n===3?['A','B','C']:['A','B','C','D'],NT=n=>n===3?['D','E','F']:['E','F','G','H'];
const FN=(n,nm)=>(n===3?'三角形':'四角形')+nm.join('');
const kTxt=k=>k>1?`${G.fmt(k)}倍の拡大図`:`${G.frac(k)}の縮図`;
const minAng=p=>Math.min(...p.map((_,i)=>G.ang(p,i)));
const round2=x=>Math.round(x*1000)/1000;

// 2つの図形をならべてかく
function pair(svg,p,q,o){o=o||{};const W=o.w||300,H=o.h||290,sc=Math.min(G.fit([p,q],W,H),o.max||60);
  const s1=Math.min(o.max||60,Math.max(sc,.6*G.fit([p],W,H))),s2=Math.min(o.max||60,Math.max(sc,.6*G.fit([q],W,H)));
  G.draw(svg,p,Object.assign({s:s1,cx:o.cx1||220,cy:o.cy||240,fill:'#fff',side:1,angle:o.ab!==undefined?o.ab:1,names:o.nb||NB(p.length)},o.op||{}));
  G.draw(svg,q,Object.assign({s:s2,cx:o.cx2||640,cy:o.cy||240,side:o.sideT!==undefined?o.sideT:1,angle:o.at!==undefined?o.at:0,names:o.nt||NT(q.length)},o.oq||{}));
  if(o.cap!==false){txt(svg,o.cx1||220,470,FN(p.length,o.nb||NB(p.length)),19,'#8a7aa8');txt(svg,o.cx2||640,470,FN(q.length,o.nt||NT(q.length)),19,'#8a7aa8')}
  return sc}

// ---------- みわける ----------
function distractor(r,p){const n=p.length,k=r.pick([0.5,1.5,2]);let q;
  const t=r.int(3);
  if(t===0){const f=r.pick([1.5,2/3,2]);q=G.scaleXY(p,k,k*f)}
  else if(t===1&&n===4){const L=G.sides(p),a=L[0],b=L[1],isPara=Math.abs(G.ang(p,0)-90)>1;
    const th=isPara?Math.PI/2:Math.PI/3;q=[[0,0],[a,0],[a+b*Math.cos(th),b*Math.sin(th)],[b*Math.cos(th),b*Math.sin(th)]].map(([x,y])=>[x*k,y*k])}
  else{const i=r.int(n);q=p.map((v,j)=>j===i?[v[0]+(r.int(2)?1:-1),v[1]+(r.int(2)?0.5:-0.5)]:v).map(([x,y])=>[x*k,y*k])}
  return q}
function makeChoose(r,pool,ks,follow){for(let tries=0;tries<200;tries++){
  const base=r.pick(pool),nc=1+r.int(3),cands=[{p:base,base:1}],ok=[];
  const used=new Set();for(let i=0;i<nc;i++){let k,ro,fl,g=0;do{k=r.pick(ks);ro=r.int(4);fl=r.int(3)===0}while(used.has(k+'_'+ro+'_'+fl)&&g++<20);used.add(k+'_'+ro+'_'+fl);ok.push({p:G.tf(base,k,ro,fl),ok:1,k})}
  const bad=[];let guard=0;while(bad.length<5-nc&&guard++<60){const q=distractor(r,base);
    const qb=G.bbox(q);if(G.similar(base,q)||minAng(q)<28||Math.max(qb.w,qb.h)/Math.min(qb.w,qb.h)>2.4||Math.min(...G.sides(q))<0.4*Math.max(...G.sides(q)))continue;bad.push({p:G.tf(q,1,r.int(4),r.int(3)===0)})}
  if(bad.length<5-nc)continue;
  const all=r.shuffle(ok.concat(bad));cands.push(...all);
  const NM='あいうえおか',okIdx=cands.map((c,i)=>c.ok?i:-1).filter(i=>i>0),fi=okIdx[0],fk=cands[fi].k;
  const pool2=r.shuffle([0.5,1.5,2,2.5,3,1/3].filter(x=>Math.abs(x-fk)>1e-9)).slice(0,3).concat([fk]);const opts=r.shuffle(pool2);
  return{kind:'choose',q:'あ の 拡大図 や 縮図 を ぜんぶ えらぼう',say:'向き が ちがう図 や、うら返した図 も あるよ。',cands,
    hints:['まず 角の大きさ が、あ と ぜんぶ 同じか 見てみよう。','つぎに 辺の長さ。どの辺も 同じ 倍 に なっているかな？'],
    explain:`${okIdx.map(i=>NM[i]).join('・')} が 拡大図・縮図。角が 等しく、辺が どれも 同じ 倍 だよ。`,
    follow:follow?{q:`<span class="h">もう1問</span>${NM[fi]} は あ の<br>何倍 かな？`,opts:opts.map(kTxt),ans:opts.indexOf(fk)}:null}}}

// ---------- かく（方眼） ----------
const DTRI=[[[0,0],[0,3],[4,3]],[[1,0],[0,3],[4,3]],[[0,0],[0,4],[3,4]],[[2,0],[0,3],[3,3]],[[0,0],[4,1],[1,3]]];
const DQUAD=[[[0,0],[3,0],[3,2],[0,2]],[[1,0],[3,0],[4,3],[0,3]],[[1,0],[4,0],[3,2],[0,2]],[[0,0],[3,0],[4,2],[0,3]]];
const DHALF=[[[0,0],[0,6],[8,6]],[[2,0],[6,0],[8,4],[0,4]],[[0,0],[6,0],[6,4],[0,4]],[[4,0],[0,6],[8,6]],[[2,0],[0,6],[6,6]]];
function placeFree(org,k,mode){const b=G.bbox(org),ox=1-b.x,oy=Math.max(1,Math.floor((17-Math.max(b.h,b.h*k))/2))-b.y;
  const o=org.map(([x,y])=>[x+ox,y+oy]),bb=G.bbox(o),T=o.map(([x,y])=>[x*k,y*k]),tb=G.bbox(T);
  const tx=bb.x+bb.w+3,ty=Math.max(1,Math.floor((17-tb.h)/2));return{o,start:[tx-tb.x,ty-tb.y]}}
function drawHints(it){const o=it.org,n=it.names,dx=o[1][0]-o[0][0],dy=o[1][1]-o[0][1],k=it.k,kk=G.kname(k);
  const part=[];if(dx)part.push(`横に ${Math.abs(dx)}マス`);if(dy)part.push(`たてに ${Math.abs(dy)}マス`);
  const part2=[];if(dx)part2.push(`横 ${Math.abs(dx)*k}`);if(dy)part2.push(`たて ${Math.abs(dy)*k}`);
  return[`辺${n[0]}${n[1]} は ${part.join('・')}。${kk}倍 だと ${part2.join('・')} マス だね。`,'黄色い点 を じゅんに むすぶと できあがり だよ。']}
function makeDraw(r,type){const it={kind:'draw'};
  if(type==='tri2'||type==='quad'||type==='half'){
    const org=type==='tri2'?r.pick(DTRI):type==='quad'?r.pick(DQUAD):r.pick(DHALF);
    const k=type==='tri2'?2:type==='half'?0.5:(org===DQUAD[0]?r.pick([2,3]):2);const pf=placeFree(org,k);
    Object.assign(it,{org:pf.o,k,mode:'free',start:pf.start,names:NB(org.length)});
    it.q=`${FN(org.length,it.names)} の ${kTxt(k)} を かきましょう`;it.say='どこ に かいても いいよ。向き は もとの図 と 同じ に してね。'}
  else if(type==='anchor'){const org=r.pick(DTRI.concat(DQUAD)),k=2,pf=placeFree(org,k);
    Object.assign(it,{org:pf.o,k,mode:'anchor',v:0,names:NB(org.length)});it.at=[pf.o[0][0]*k+pf.start[0],pf.o[0][1]*k+pf.start[1]];it.atName=NT(org.length)[0];
    it.q=`頂点A に 対応する 頂点${it.atName} から、2倍の拡大図 を かこう`;it.say=`ピンク の 点 が 頂点${it.atName} だよ。`}
  else{// 1つの点を中心に
    const opt=r.pick([
      {org:[[2,11],[2,15],[5,15]],c:[2,15],k:2,cn:'頂点B'},
      {org:[[3,9],[3,15],[7,15]],c:[3,15],k:2,cn:'頂点B'},
      {org:[[4,10],[4,14],[9,14]],c:[2,16],k:2,cn:'点O'},
      {org:[[2,4],[2,16],[10,16]],c:[2,16],k:0.5,cn:'頂点B'},
      {org:[[9,4],[9,14],[15,14]],c:[1,16],k:0.5,cn:'点O'},
      {org:[[6,10],[9,10],[9,13],[6,13]],c:[3,16],k:2,cn:'点O'}]);
    Object.assign(it,{org:opt.org,k:opt.k,mode:'center',center:opt.c,names:NB(opt.org.length)});
    it.q=`点O を 中心に して、${kTxt(opt.k)} を かこう`;it.say=`点O は ${opt.cn==='頂点B'?'頂点B と 同じ 場所':'図の 外'} に あるよ。`;
    it.hints=[`O から 頂点 まで の 長さ を ${G.kname(opt.k)}倍 に しよう。ピンク の 線 を 見てね。`,'黄色い点 を じゅんに むすぶと できあがり だよ。'];return it}
  it.hints=drawHints(it);return it}

// ---------- もとめる ----------
function makeSide(r,mode){for(;;){const n=r.int(3)?3:4,base=n===3?r.pick(TRI):r.pick(QUAD),k=r.pick([2,3,1.5,0.5]);
  const q=G.tf(base,k,0,0),nb=NB(n),nt=NT(n),L=G.sides(base),i=r.int(n);
  if(mode==='ang'){const A=Math.round(G.ang(base,i));const hideA={};hideA[i]='□°';
    return{kind:'num',q:`${FN(n,nt)} は ${FN(n,nb)} の ${k>1?'拡大図':'縮図'}。角${nt[i]} は 何度？`,unit:'度',ans:A,
      fig:svg=>pair(svg,base,q,{at:[i],oq:{hideA}}),hints:[`角${nt[i]} に 対応する のは 角${nb[i]} だよ。`],explain:`角${nb[i]} と 同じ ${A}度 だよ。対応する角 は 等しいね。`}}
  const ans=round2(L[i]*k);if(String(ans).length>4)continue;const hideS={};hideS[i]='□cm';
  return{kind:'num',q:`${FN(n,nt)} は ${FN(n,nb)} の ${k>1?'拡大図':'縮図'}。辺${nt[i]}${nt[(i+1)%n]} は 何cm？`,unit:'cm',ans,
    fig:svg=>pair(svg,base,q,{oq:{hideS}}),hints:[`まず 何倍 か しらべよう。ほか の 辺 を くらべてね。`,`辺${nt[i]}${nt[(i+1)%n]} に 対応する のは 辺${nb[i]}${nb[(i+1)%n]}。`],
    explain:`辺${nb[i]}${nb[(i+1)%n]} は ${G.fmt(L[i])}cm。${G.kname(k)}倍 で ${G.fmt(ans)}cm だよ。`}}}
function makeBai(r){const n=r.int(2)?3:4,base=n===3?r.pick(TRI):r.pick(QUAD),k=r.pick([2,3,1.5,0.5,2.5]),q=G.tf(base,k,r.int(2)?0:2,0);
  const opts=r.shuffle(r.shuffle([0.5,1.5,2,2.5,3,1/3].filter(x=>Math.abs(x-k)>1e-9)).slice(0,3).concat([k]));
  return{kind:'pick',q:`${FN(n,NT(n))} は ${FN(n,NB(n))} の 何倍 の 図？`,opts:opts.map(kTxt),ans:opts.indexOf(k),
    fig:svg=>pair(svg,base,q,{}),hints:['対応する 辺 を 1組 えらんで、長さ を くらべよう。'],explain:`辺の長さ が どれも ${G.kname(k)}倍 だから ${kTxt(k)} だよ。`}}
function mapFig(a,scale,label){return svg=>{el('rect',{x:60,y:40,width:752,height:400,rx:24,fill:'#eaf7ee',stroke:'#bfe3cb','stroke-width':3},svg);
  el('path',{d:'M60 300 Q300 250 460 330 T812 290',fill:'none',stroke:'#bfe0ff','stroke-width':26},svg);
  el('path',{d:'M180 40 L230 440 M560 40 L520 440',fill:'none',stroke:'#fff','stroke-width':14},svg);
  const x1=436-a*30,x2=436+a*30,y=196;el('line',{x1,y1:y,x2,y2:y,stroke:'#e46f9f','stroke-width':4,'stroke-dasharray':'10 7'},svg);
  [[x1,'学校'],[x2,'駅']].forEach(([x,t])=>{el('circle',{cx:x,cy:y,r:12,fill:'#7a63d6',stroke:'#fff','stroke-width':3},svg);txt(svg,x,y-34,t,22,'#4d4270','middle',900)});
  txt(svg,436,y+34,label,22,'#e46f9f','middle',900);
  el('rect',{x:592,y:58,width:200,height:50,rx:14,fill:'#fff',stroke:'#c8bff0','stroke-width':2},svg);txt(svg,692,83,scale,22,'#4d4270','middle',900)}}
function makeScale(r,t){const N=r.pick([1000,2000,5000,10000]);
  if(t===0){const a=r.pick([2,3,4,5,6,8]),ans=a*N/100;return{kind:'num',q:`縮尺 1/${N} の 地図で ${a}cm。じっさい は 何m？`,unit:'m',ans,fig:mapFig(a,`縮尺 1/${N}`,a+'cm'),
    hints:[`地図の 長さ を ${N}倍 すると、じっさい の 長さ（cm）に なるよ。`,'100cm = 1m だよ。'],explain:`${a}×${N}=${a*N}cm。${ans}m だよ。`}}
  if(t===1){const N2=r.pick([25000,50000]),a=r.pick([2,4,6,8]),ans=round2(a*N2/100000);return{kind:'num',q:`縮尺 1/${N2} の 地図で ${a}cm。じっさい は 何km？`,unit:'km',ans,fig:mapFig(a,`縮尺 1/${N2}`,a+'cm'),
    hints:[`${a}×${N2} で cm に なるよ。`,'100000cm = 1km だよ。'],explain:`${a}×${N2}=${a*N2}cm = ${G.fmt(ans)}km だよ。`}}
  if(t===2){const c=r.pick([2,3,4,5,6]),X=c*N/100;return{kind:'num',q:`じっさい ${X}m は、縮尺 1/${N} の 地図で 何cm？`,unit:'cm',ans:c,fig:mapFig(c,`縮尺 1/${N}`,'□cm'),
    hints:[`${X}m を cm に なおすと ${X*100}cm。`,`それを ${N} で わろう。`],explain:`${X*100}÷${N}=${c}cm だよ。`}}
  if(t===3){const c=r.pick([2,4,5]),X=c*N/100;return{kind:'num',q:`じっさい ${X}m を、地図で ${c}cm に かいた。縮尺 は？`,unit:'',prefix:'1/',ans:N,fig:mapFig(c,'縮尺 1/□',c+'cm'),
    hints:[`${X}m = ${X*100}cm。`,`${X*100} は ${c} の 何倍 かな？`],explain:`${X*100}÷${c}=${N}。縮尺 は 1/${N} だよ。`}}
  const a=r.pick([3,4,5,6]),ans=a*N/100;return{kind:'num',q:`縮尺 1:${N} の 地図で ${a}cm。じっさい は 何m？`,unit:'m',ans,fig:mapFig(a,`縮尺 1:${N}`,a+'cm'),
    hints:[`1:${N} は 1/${N} と 同じ いみ だよ。`],explain:`${a}×${N}=${a*N}cm。${ans}m だよ。`}}
function treeFig(N,bc,eye,river){return svg=>{
  el('rect',{x:0,y:400,width:872,height:100,fill:'#e2f4e8'},svg);el('line',{x1:0,y1:400,x2:872,y2:400,stroke:'#8fcf9f','stroke-width':4},svg);
  if(river){el('rect',{x:300,y:330,width:340,height:70,fill:'#bfe0ff'},svg);
    el('polygon',{points:'250,330 690,330 690,150',fill:'none',stroke:'#e46f9f','stroke-width':3,'stroke-dasharray':'8 6'},svg);
    [[250,330,'A'],[690,330,'B'],[690,150,'C']].forEach(([x,y,t])=>{el('circle',{cx:x,cy:y,r:6,fill:'#4d4270'},svg);txt(svg,x+(t==='A'?-18:18),y-14,t,21,'#4d4270','middle',900)});
    txt(svg,470,360,'川',26,'#5d9fd8','middle',900);txt(svg,436,60,`縮図 1/${N} で AB が ${bc}cm`,24,'#4d4270','middle',900);return}
  el('rect',{x:640,y:250,width:30,height:150,fill:'#c99a6e'},svg);[[655,190,70],[610,230,48],[700,230,48]].forEach(([x,y,r])=>el('circle',{cx:x,cy:y,r,fill:'#8fdcc0',stroke:'#5fbf98','stroke-width':3},svg));
  el('circle',{cx:160,cy:318,r:16,fill:'#fff',stroke:'#4d4270','stroke-width':3},svg);el('path',{d:'M160 334 L160 370 M160 370 L144 400 M160 370 L176 400 M140 350 L180 350',stroke:'#4d4270','stroke-width':4,fill:'none'},svg);
  el('polygon',{points:'166,318 655,318 655,120',fill:'rgba(255,173,207,.18)',stroke:'#e46f9f','stroke-width':3,'stroke-dasharray':'8 6'},svg);
  [[166,318,'A',-22,-16],[655,318,'B',24,0],[655,120,'C',24,0]].forEach(([x,y,t,dx,dy])=>{el('circle',{cx:x,cy:y,r:6,fill:'#4d4270'},svg);txt(svg,x+dx,y+dy,t,21,'#4d4270','middle',900)});
  el('line',{x1:110,y1:318,x2:110,y2:400,stroke:'#7a63d6','stroke-width':3},svg);txt(svg,84,360,`${eye}m`,18,'#7a63d6');txt(svg,90,300,'目の高さ',16,'#7a63d6');
  txt(svg,436,60,`縮図 1/${N} で BC が ${bc}cm`,24,'#4d4270','middle',900)}}
function makeHeight(r,t){const N=r.pick([200,500]),bc=r.pick(N===200?[3,4,5,6,7]:[2,2.4,3,3.6,4]),real=round2(bc*N/100);
  if(t===1)return{kind:'num',q:`縮図 1/${N} で 川はば AB が ${bc}cm。じっさい は 何m？`,unit:'m',ans:real,fig:treeFig(N,bc,0,true),
    hints:[`${bc}×${N} で じっさい の cm に なるよ。`],explain:`${bc}×${N}=${round2(bc*N)}cm = ${G.fmt(real)}m だよ。`};
  const eye=r.pick([1.2,1.5]),ans=round2(real+eye);
  return{kind:'num',q:`縮図 1/${N} で BC が ${bc}cm。木の高さ は 何m？`,unit:'m',ans,fig:treeFig(N,bc,eye),
    hints:[`まず BC の じっさい の 長さ を 求めよう。${bc}×${N}cm だね。`,`さいご に 目の高さ ${eye}m を たすのを わすれずに。`],explain:`BC は ${G.fmt(real)}m。目の高さ ${eye}m を たして ${G.fmt(ans)}m だよ。`}}

// ---------- ことば ----------
const WORDS=[
 {q:'拡大図・縮図 で、対応する 角の大きさ は？',opts:['ぜんぶ 等しい','ぜんぶ 2倍','辺 と 同じ 倍','きまっていない'],ans:0,body:'対応する<br>角の大きさ は？'},
 {q:'拡大図・縮図 で、対応する 辺の長さ の 比 は？',opts:['どこも 等しい','辺ごと に ちがう','いつも 1:2','きまっていない'],ans:0,body:'対応する<br>辺の長さ の 比 は？'},
 {q:'合同な図形 は、何倍 の 拡大図 と いえる？',opts:['1倍','2倍','0倍','いえない'],ans:0,body:'合同な図形 は<br>何倍 の 拡大図？'},
 {q:'縮尺 1/1000 を 比 で 表す と？',opts:['1:1000','1000:1','1:100','10:1000'],ans:0,body:'1/1000<br>＝ □ ？'},
 {q:'形 を かえずに 小さく した 図 を 何 という？',opts:['縮図','拡大図','合同な図形','対称な図形'],ans:0,body:'形 を かえずに<br>小さく した 図'}];
const word=(r,i)=>{const w=WORDS[i==null?r.int(WORDS.length):i],o=r.shuffle(w.opts.map((t,j)=>j));return{kind:'pick',q:w.q,body:w.body,opts:o.map(j=>w.opts[j]),ans:o.indexOf(w.ans),explain:`こたえ は「${w.opts[w.ans]}」だよ。`}};
const shuf=(r,a)=>r.shuffle(a);

// ---------- しる（スライドの場面） ----------
const HOUSE=[[0,0],[2,-1.5],[4,0],[4,3],[0,3]];
const TB=[[0,0],[4,0],[0,3]]; // 直角三角形（角B 直角）
const TBN=[[0,3],[0,0],[4,0]]; // A,B,C の順（Bが直角）
function gridSvg(svg,cols,rows,c,ox,oy){for(let i=0;i<=cols;i++)el('line',{x1:ox+i*c,y1:oy,x2:ox+i*c,y2:oy+rows*c,stroke:'#e3e7f7'},svg);for(let j=0;j<=rows;j++)el('line',{x1:ox,y1:oy+j*c,x2:ox+cols*c,y2:oy+j*c,stroke:'#e3e7f7'},svg)}
const tri456=[[2.25,-3.3072],[0,0],[6,0]];// A,B,C（AB=4,BC=6,CA=5）

const LESSONS=[
 {id:'l1',title:'拡大図・縮図って なに？',sub:'形 が 同じ で 大きさ が ちがう',slides:[
  {t:'同じ形 は どれ？',say:'もとの図 と くらべて みよう。同じ形 は あ と い の どっち かな？',point:'<span class="h">ポイント</span>大きさ が ちがっても、<b>形 が 同じ</b> なら なかま だよ。',
   scene(c){const draw=show=>{c.clear();const sv=c.svg;G.draw(sv,HOUSE,{s:28,cx:140,cy:250,fill:'#fff',stroke:'#c8bff0',side:1});txt(sv,140,450,'もとの図',20,'#8a7aa8');
     G.draw(sv,G.tf(HOUSE,2),{s:28,cx:430,cy:250,side:1,fill:show?'#d6f5ea':'#ddf0ff',stroke:show?'#3fb88c':'#5d9fd8'});txt(sv,430,450,'あ',24,'#4d4270','middle',900);
     G.draw(sv,G.scaleXY(HOUSE,1,2),{s:28,cx:730,cy:250,side:1,fill:show?'#ffe3ee':'#ddf0ff',stroke:show?'#e46f9f':'#5d9fd8'});txt(sv,730,450,'い',24,'#4d4270','middle',900)};
     draw(false);c.btn({t:'こたえ を 見る',x:20,y:300,w:292,c:'sky',on:()=>{draw(true);c.say('あ は どの辺 も 2倍 で 同じ形。い は たて だけ のびて 形 が かわったね。','jump')}})}},
  {t:'大きく・小さく してみよう',say:'「おおきく」「ちいさく」を おして みよう。',point:'<span class="h">ポイント</span>形 を かえずに 大きく すると、辺の長さ は ぜんぶ 同じ 倍 に なる。',
   scene(c){const K=[0.5,1,1.5,2];let ki=1;const draw=()=>{c.clear();const sv=c.svg,k=K[ki];G.draw(sv,HOUSE,{s:30,cx:170,cy:250,fill:'#fff',stroke:'#c8bff0',side:1});txt(sv,170,450,'もとの図',20,'#8a7aa8');
     G.draw(sv,G.tf(HOUSE,k),{s:30,cx:590,cy:250,side:1});txt(sv,590,40,k===1?'もとの図 と 同じ':kTxt(k),24,'#e46f9f','middle',900)};
     draw();c.btn({t:'ちいさく',x:20,y:300,w:136,c:'sky',on:()=>{ki=Math.max(0,ki-1);draw();c.say(ki===0?'1/2 に 小さく なったね。これ が 縮図 だよ。':'もとの図 に ちかづいたよ。')}});
     c.btn({t:'おおきく',x:176,y:300,w:136,c:'sky',on:()=>{ki=Math.min(3,ki+1);draw();c.say('大きく なったね。形 は 同じ まま だよ。')}})}},
  {t:'ことば を おぼえよう',say:'大きく した 図 は 拡大図、小さく した 図 は 縮図 だよ。',point:'<span class="h">おぼえよう</span>形 を かえずに<br><b>大きく した 図</b> … 拡大図<br><b>小さく した 図</b> … 縮図',
   scene(c){const sv=c.svg;G.draw(sv,G.tf(HOUSE,0.5),{s:30,cx:120,cy:260,side:1,fill:'#ffe3ee',stroke:'#e46f9f'});txt(sv,120,450,'1/2の縮図',20,'#e46f9f','middle',900);
     G.draw(sv,HOUSE,{s:30,cx:330,cy:260,fill:'#fff',stroke:'#c8bff0',side:1});txt(sv,330,450,'もとの図',20,'#8a7aa8');
     G.draw(sv,G.tf(HOUSE,2),{s:30,cx:650,cy:250,side:1});txt(sv,650,450,'2倍の拡大図',20,'#5d9fd8','middle',900)}}],
  check:r=>[word(r,4),{kind:'pick',q:'もとの図 の 拡大図 は どれ？',opts:['あ','い'],ans:1,explain:'い は どの辺 も 2倍。あ は たて だけ のびて いるよ。',
   fig:sv=>{const B=[[0,0],[3,0],[3,2],[0,2]];G.draw(sv,B,{s:36,cx:140,cy:250,fill:'#fff',side:1});txt(sv,140,450,'もとの図',20,'#8a7aa8');
     G.draw(sv,G.scaleXY(B,1,2),{s:36,cx:420,cy:250,side:1});txt(sv,420,450,'あ',24,'#4d4270','middle',900);G.draw(sv,G.tf(B,2),{s:36,cx:700,cy:250,side:1});txt(sv,700,450,'い',24,'#4d4270','middle',900)}}]},
 {id:'l2',title:'対応する 頂点・辺・角',sub:'どこ と どこ が 対応 する？',slides:[
  {t:'対応する 頂点',say:'ボタン を おすと、対応する 頂点 が 光るよ。',point:'<span class="h">ポイント</span>拡大図 で、もとの図 の 頂点 と 重なる 頂点 を <b>対応する 頂点</b> という。',
   scene(c){const draw=v=>{c.clear();pair(c.svg,TBN,G.tf(TBN,2),{ab:0,sideT:0,op:{side:0,hl:{v:v==null?[]:[v]}},oq:{hl:{v:v==null?[]:[v]}}})};draw();
     ['A','B','C'].forEach((n,i)=>c.btn({t:`${n} と ${'DEF'[i]}`,x:20+i*100,y:300,w:92,z:'S',c:'sky',on:()=>{draw(i);c.say(`頂点${n} に 対応する のは 頂点${'DEF'[i]} だよ。`)}}))}},
  {t:'対応する 辺',say:'辺 の ボタン を おして みよう。',point:'<span class="h">ポイント</span>対応する 頂点 を むすんだ 辺 が <b>対応する 辺</b>。',
   scene(c){const draw=e=>{c.clear();pair(c.svg,TBN,G.tf(TBN,2),{ab:0,op:{hl:{e:e==null?[]:[e]}},oq:{hl:{e:e==null?[]:[e]}}})};draw();
     ['AB','BC','CA'].forEach((n,i)=>c.btn({t:'辺'+n,x:20+i*100,y:300,w:92,z:'S',c:'sky',on:()=>{draw(i);c.say(`辺${n} に 対応する のは 辺${['DE','EF','FD'][i]} だよ。`)}}))}},
  {t:'向き が ちがっても',say:'向き が ちがっても、対応する ところ は 見つけられるよ。',point:'<span class="h">ポイント</span>まわしたり うら返したり しても、対応する 頂点・辺・角 は かわらない。',
   scene(c){const q=G.tf(TBN,2,1,1);const draw=v=>{c.clear();pair(c.svg,TBN,q,{ab:0,sideT:1,op:{side:1,hl:{v:v==null?[]:[v]}},oq:{hl:{v:v==null?[]:[v]}}})};draw();
     ['A','B','C'].forEach((n,i)=>c.btn({t:`${n} と ${'DEF'[i]}`,x:20+i*100,y:300,w:92,z:'S',c:'sky',on:()=>{draw(i);c.say(`頂点${n} と 頂点${'DEF'[i]} が 対応 しているよ。`)}}))}}],
  check:r=>{const q=G.tf(TBN,2,r.int(4),1);return[{kind:'pick',q:'頂点B に 対応する 頂点 は どれ？',opts:['頂点D','頂点E','頂点F'],ans:1,fig:sv=>pair(sv,TBN,q,{ab:0}),explain:'直角 の 頂点 どうし。頂点B と 頂点E だよ。'},
   {kind:'pick',q:'辺CA に 対応する 辺 は どれ？',opts:['辺DE','辺EF','辺FD'],ans:2,fig:sv=>pair(sv,TBN,q,{ab:0}),explain:'いちばん 長い 辺 どうし。辺CA と 辺FD だよ。'}]}},
 {id:'l3',title:'辺の長さ と 角の大きさ',sub:'拡大図 の せいしつ',slides:[
  {t:'辺の長さ を くらべよう',say:'対応する 辺の長さ を くらべて みよう。',point:'<span class="h">ポイント</span>対応する <b>辺の長さ</b> は、どれも <b>2倍</b> に なっている。',
   scene(c){let on=false;const draw=()=>{c.clear();pair(c.svg,TBN,G.tf(TBN,2),{ab:0,cy:220});if(on)[['AB','DE',3],['BC','EF',4],['CA','FD',5]].forEach(([a,b,l],i)=>txt(c.svg,436+(i-1)*260,440,`${a} ${l}cm → ${b} ${l*2}cm`,19,'#e46f9f','middle',900))};
     draw();c.btn({t:'くらべる',x:20,y:300,w:292,c:'sky',on:()=>{on=true;draw();c.say('3cm→6cm、4cm→8cm、5cm→10cm。ぜんぶ 2倍 だね。','jump')}})}},
  {t:'角の大きさ を くらべよう',say:'こんど は 角の大きさ を くらべよう。',point:'<span class="h">ポイント</span>対応する <b>角の大きさ</b> は、<b>ぜんぶ 等しい</b>。',
   scene(c){pair(c.svg,TBN,G.tf(TBN,2),{ab:1,at:1,cap:true})}},
  {t:'まとめ',say:'この 2つ が そろって いれば、拡大図・縮図 だよ。',point:'<span class="h">まとめ</span>拡大図・縮図 では<br>・対応する 辺の長さ の 比 は どこも 同じ<br>・対応する 角 は 等しい',
   scene(c){const sv=c.svg;[['辺の長さ','どれも 同じ 倍','#5d9fd8',140],['角の大きさ','ぜんぶ 等しい','#e46f9f',300]].forEach(([a,b,col,y])=>{el('rect',{x:120,y,width:632,height:120,rx:24,fill:'#fff',stroke:col,'stroke-width':4},sv);txt(sv,280,y+60,a,30,col,'middle',900);txt(sv,560,y+60,b,32,'#4d4270','middle',900)})}}],
  check:r=>[makeSide(r,'side'),makeSide(r,'ang')]},
 {id:'l4',title:'合同 と 辺の比',sub:'1倍 と 比 の 考え',slides:[
  {t:'合同 は 1倍',say:'5年 で ならった 合同な図形 と くらべて みよう。',point:'<span class="h">ポイント</span>合同な図形 は、<b>1倍 の 拡大図</b> とも いえる。',
   scene(c){pair(c.svg,TBN,G.tf(TBN,1,2),{ab:1,at:1});txt(c.svg,436,40,'形 も 大きさ も 同じ ＝ 1倍',24,'#e46f9f','middle',900)}},
  {t:'辺の長さ の 比',say:'比 で 表す と、どこも 1:2 に なるね。',point:'<span class="h">ポイント</span>拡大図・縮図 は、対応する 辺の長さ の <b>比 が どこも 等しい</b>。',
   scene(c){pair(c.svg,TBN,G.tf(TBN,2),{ab:0,cy:200,h:250,cap:false});[['AB：DE','3：6'],['BC：EF','4：8'],['CA：FD','5：10']].forEach(([a,b],i)=>txt(c.svg,150+i*286,430,`${a} ＝ ${b} ＝ 1：2`,20,'#4d4270','middle',900))}}],
  check:r=>[word(r,2),{kind:'pick',q:'3cm の 辺 が 9cm に なった。何倍 の 拡大図？',opts:['2倍','3倍','6倍','9倍'],ans:1,body:'3cm → 9cm',explain:'9÷3=3。3倍 の 拡大図 だよ。'}]},
 {id:'l5',title:'方眼 を つかって かく',sub:'マス を 数えて かく',slides:[
  {t:'マス を 数えよう',say:'「つぎ の 点」を おして、2倍の拡大図 を かいて いこう。',point:'<span class="h">ポイント</span>横 と たて の <b>マスの数</b> を それぞれ 2倍 に して 点 を うつ。',
   scene(c){const org=[[1,4],[4,4],[5,7],[1,7]],T=org.map(([x,y])=>[x*2+3,y*2-6]),nm=['A','B','C','D'];let st=0;const C=26,OX=46,OY=24;
     const msg=['頂点A の 場所 を きめたよ。','B は A から 横に 3マス。2倍 で 6マス。','C は B から 横に 1・たてに 3マス。2倍 で 横 2・たて 6。','D は A から たてに 3マス。2倍 で 6マス。','点 を むすんで できあがり！'];
     const draw=()=>{c.clear();const sv=c.svg;gridSvg(sv,30,17,C,OX,OY);el('polygon',{points:org.map(p=>(OX+p[0]*C)+','+(OY+p[1]*C)).join(' '),fill:'#ddf0ff',stroke:'#5d9fd8','stroke-width':3},sv);
       org.forEach((p,i)=>txt(sv,OX+p[0]*C+(i===1||i===2?14:-14),OY+p[1]*C+(i<2?-12:14),nm[i],18,'#4d4270','middle',900));
       const n=Math.min(st,4);for(let i=0;i<n;i++){el('circle',{cx:OX+T[i][0]*C,cy:OY+T[i][1]*C,r:7,fill:'#e46f9f'},sv);txt(sv,OX+T[i][0]*C+(i===1||i===2?16:-16),OY+T[i][1]*C+(i<2?-12:14),'EFGH'[i],18,'#e46f9f','middle',900)}
       for(let i=1;i<n;i++)el('line',{x1:OX+T[i-1][0]*C,y1:OY+T[i-1][1]*C,x2:OX+T[i][0]*C,y2:OY+T[i][1]*C,stroke:'#7a63d6','stroke-width':4},sv);
       if(st>=5)el('line',{x1:OX+T[3][0]*C,y1:OY+T[3][1]*C,x2:OX+T[0][0]*C,y2:OY+T[0][1]*C,stroke:'#7a63d6','stroke-width':4},sv)};
     draw();c.btn({t:'つぎ の 点',x:20,y:300,w:136,c:'sky',on:()=>{if(st<5)st++;draw();c.say(msg[st-1],st===5?'jump':'')}});c.btn({t:'はじめから',x:176,y:300,w:136,c:'white',on:()=>{st=0;draw();c.say('もう一度 やって みよう。')}})}},
  {t:'縮図 も 同じ',say:'1/2の縮図 は、マスの数 を 半分 に するよ。',point:'<span class="h">ポイント</span>1/2の縮図 は、横 と たて の マスの数 を <b>半分</b> に する。',
   scene(c){const sv=c.svg,C=26,OX=46,OY=24,o=[[1,2],[9,2],[9,8],[1,8]],t=[[14,6],[18,6],[18,9],[14,9]];gridSvg(sv,30,17,C,OX,OY);
     [[o,'#ddf0ff','#5d9fd8'],[t,'#ffe3ee','#e46f9f']].forEach(([p,f,s])=>el('polygon',{points:p.map(q=>(OX+q[0]*C)+','+(OY+q[1]*C)).join(' '),fill:f,stroke:s,'stroke-width':3},sv));
     txt(sv,OX+5*C,OY+1.3*C,'横 8マス',18,'#5d9fd8','middle',900);txt(sv,OX+16*C,OY+5.3*C,'横 4マス',18,'#e46f9f','middle',900);
     txt(sv,OX+5*C,OY+10*C,'もとの図',20,'#8a7aa8');txt(sv,OX+16*C,OY+11*C,'1/2の縮図',20,'#e46f9f','middle',900)}}],
  check:r=>[{kind:'num',q:'横に 4マス の 辺 は、2倍の拡大図 で 何マス？',unit:'マス',ans:8,body:'横 4マス の 辺 → 2倍',explain:'4×2=8マス だよ。'},
   {kind:'num',q:'たてに 6マス の 辺 は、1/2の縮図 で 何マス？',unit:'マス',ans:3,body:'たて 6マス の 辺 → 1/2',explain:'6÷2=3マス だよ。'}]},
 {id:'l6',title:'三角形 の かき方',sub:'3つ の かき方',slides:[0,1,2].map(mi=>({t:['3つ の 辺 を つかう','2つ の 辺 と その間 の 角','1つ の 辺 と 両はし の 角'][mi],
   say:'「つぎ の 手じゅん」を おして、2倍の拡大図 を かいて みよう。',
   point:['<span class="h">かき方 1</span>3つ の 辺 を ぜんぶ 2倍 に する。<b>コンパス</b> で 長さ を うつす。','<span class="h">かき方 2</span>2つ の 辺 を 2倍 に して、その間 の 角 は <b>同じ</b> に する。','<span class="h">かき方 3</span>1つ の 辺 を 2倍 に して、両はし の 角 は <b>同じ</b> に する。'][mi],
   scene(c){let st=0;const steps=[['辺BC を 2倍 の 6cm ひく。','B から 半径 4cm の 円 を かく。','C から 半径 5cm の 円 を かく。','まじわった 点 が 頂点A。','むすんで できあがり！'],
     ['辺BC を 2倍 の 6cm ひく。','分度器 で 角B（56°）を はかる。','B から 2倍 の 4cm の 所 に 頂点A。','A と C を むすんで できあがり！'],
     ['辺BC を 2倍 の 6cm ひく。','角B（56°）を はかって 線 を ひく。','角C（41°）を はかって 線 を ひく。','まじわった 点 が 頂点A。できあがり！']][mi];
     const s=34,Bx=330,By=400,P=([x,y])=>[Bx+x*s*2,By+y*s*2],A=P(tri456[0]),B=P(tri456[1]),Cc=P(tri456[2]);
     const draw=()=>{c.clear();const sv=c.svg;G.draw(sv,tri456,{s:30,cx:140,cy:300,fill:'#fff',side:1,angle:[1,2],names:['A','B','C'],fs:15});txt(sv,140,450,'もとの図',20,'#8a7aa8');
       const L=(a,b,col,w,da)=>el('line',{x1:a[0],y1:a[1],x2:b[0],y2:b[1],stroke:col||'#7a63d6','stroke-width':w||4,'stroke-dasharray':da||'none','stroke-linecap':'round'},sv);
       const dot=(p,t)=>{el('circle',{cx:p[0],cy:p[1],r:6,fill:'#4d4270'},sv);if(t)txt(sv,p[0]+(t==='A'?0:t==='B'?-16:16),p[1]+(t==='A'?-20:18),t,20,'#4d4270','middle',900)};
       if(st>=1){L(B,Cc);dot(B,'B');dot(Cc,'C');txt(sv,(B[0]+Cc[0])/2,By+28,'6cm',18,'#4d4270')}
       const arc=(o,rad,a1,a2)=>{const p1=[o[0]+rad*Math.cos(a1),o[1]+rad*Math.sin(a1)],p2=[o[0]+rad*Math.cos(a2),o[1]+rad*Math.sin(a2)];el('path',{d:`M${p1[0]} ${p1[1]} A${rad} ${rad} 0 0 1 ${p2[0]} ${p2[1]}`,fill:'none',stroke:'#ff92bf','stroke-width':3},sv)};
       const angB=Math.atan2(A[1]-B[1],A[0]-B[0]),angC=Math.atan2(A[1]-Cc[1],A[0]-Cc[0]);
       if(mi===0){if(st>=2)arc(B,4*s,angB-0.25,angB+0.25);if(st>=3)arc(Cc,5*s,angC-0.2,angC+0.2);if(st>=4)dot(A,'A');if(st>=5){L(A,B);L(A,Cc)}}
       if(mi===1){if(st>=2){el('path',{d:`M${B[0]+60} ${B[1]} A60 60 0 0 0 ${B[0]-60} ${B[1]}`,fill:'rgba(159,211,255,.25)',stroke:'#5d9fd8','stroke-width':2},sv);L(B,[B[0]+Math.cos(angB)*200,B[1]+Math.sin(angB)*200],'#b9a6f2',3,'8 6');txt(sv,B[0]+34,B[1]-16,'56°',16,'#8270cf')}
         if(st>=3){L(B,A);dot(A,'A')}if(st>=4)L(A,Cc)}
       if(mi===2){if(st>=2){L(B,[B[0]+Math.cos(angB)*260,B[1]+Math.sin(angB)*260],'#b9a6f2',3,'8 6');txt(sv,B[0]+34,B[1]-16,'56°',16,'#8270cf')}
         if(st>=3){L(Cc,[Cc[0]+Math.cos(angC)*300,Cc[1]+Math.sin(angC)*300],'#b9a6f2',3,'8 6');txt(sv,Cc[0]-40,Cc[1]-14,'41°',16,'#8270cf')}if(st>=4){dot(A,'A');L(A,B);L(A,Cc)}}};
     draw();c.btn({t:'つぎ の 手じゅん',x:20,y:300,w:292,c:'sky',on:()=>{if(st<steps.length)st++;draw();c.say(steps[st-1],st===steps.length?'jump':'')}});
     c.btn({t:'はじめから',x:20,y:366,w:292,c:'white',z:'S',on:()=>{st=0;draw();c.say('はじめ から やって みよう。')}})}})),
  check:r=>[{kind:'pick',q:'「2つの辺 と その間の角」で かく とき、はかる 角 は？',opts:shuf(r,[0,1,2,3]).map(i=>['2つの辺 の 間の角','どの角 でも よい','3つ の 角','角 は はからない'][i]),ans:null,explain:'2つの辺 の 間 に ある 角 を はかるよ。',body:'2つの辺 と<br>その間 の 角'},
   {kind:'pick',q:'3つの辺 を つかって かく とき、コンパス で うつす のは？',opts:['辺の長さ','角の大きさ'],ans:0,explain:'コンパス で 辺の長さ を うつすよ。',body:'3つ の 辺 で かく'}].map(it=>{if(it.ans===null)it.ans=it.opts.indexOf('2つの辺 の 間の角');return it})},
 {id:'l7',title:'1つの点 を 中心 に かく',sub:'点 から の 長さ を のばす',slides:[
  {t:'頂点 を 中心 に',say:'倍 の ボタン を おして みよう。B から の 長さ が のびるよ。',point:'<span class="h">ポイント</span>頂点B から 各頂点 まで の 長さ を <b>2倍</b> に のばすと 2倍の拡大図。',
   scene(c){const o=[[0,-3],[0,0],[4,0]];let k=2;const draw=()=>{c.clear();const sv=c.svg,s=40,B=[200,420],P=([x,y],f)=>[B[0]+x*s*f,B[1]+y*s*f];
     o.forEach(v=>{const t=P(v,Math.max(k,1));el('line',{x1:B[0],y1:B[1],x2:t[0],y2:t[1],stroke:'#ffb3cf','stroke-width':2,'stroke-dasharray':'6 5'},sv)});
     el('polygon',{points:o.map(v=>P(v,k).join(',')).join(' '),fill:'rgba(255,173,207,.25)',stroke:'#e46f9f','stroke-width':3},sv);
     el('polygon',{points:o.map(v=>P(v,1).join(',')).join(' '),fill:'#ddf0ff',stroke:'#5d9fd8','stroke-width':3},sv);
     ['A','B','C'].forEach((n,i)=>{const p=P(o[i],1);txt(sv,p[0]+(i===2?0:-18),p[1]+(i===2?22:i===0?-6:16),n,19,'#4d4270','middle',900)});
     txt(sv,600,60,kTxt(k),26,'#e46f9f','middle',900);txt(sv,600,100,`BA × ${G.kname(k)}、BC × ${G.kname(k)}`,20,'#4d4270')};
     draw();[[2,'2倍'],[3,'3倍'],[0.5,'1/2']].forEach(([v,t],i)=>c.btn({t,x:20+i*100,y:300,w:92,z:'S',c:'sky',on:()=>{k=v;draw();c.say(`B から の 長さ を ${G.kname(v)}倍 に したよ。`)}}))}},
  {t:'中 の 点 を 中心 に',say:'図 の 中 に ある 点O を 中心 に しても かけるよ。',point:'<span class="h">ポイント</span>点O から 各頂点 まで の 長さ を 2倍 に のばして むすぶ。',
   scene(c){const o=[[-1.5,-1],[1.5,-1.2],[1.8,1],[-1.2,1.2]];let k=2;const draw=()=>{c.clear();const sv=c.svg,s=60,O=[436,250],P=(v,f)=>[O[0]+v[0]*s*f,O[1]+v[1]*s*f];
     o.forEach(v=>{const t=P(v,Math.max(k,1));el('line',{x1:O[0],y1:O[1],x2:t[0],y2:t[1],stroke:'#ffb3cf','stroke-width':2,'stroke-dasharray':'6 5'},sv)});
     el('polygon',{points:o.map(v=>P(v,k).join(',')).join(' '),fill:'rgba(255,173,207,.25)',stroke:'#e46f9f','stroke-width':3},sv);
     el('polygon',{points:o.map(v=>P(v,1).join(',')).join(' '),fill:'rgba(221,240,255,.8)',stroke:'#5d9fd8','stroke-width':3},sv);
     el('circle',{cx:O[0],cy:O[1],r:6,fill:'#4d4270'},sv);txt(sv,O[0]-14,O[1]+18,'O',19,'#4d4270','middle',900);txt(sv,140,40,kTxt(k),24,'#e46f9f','middle',900)};
     draw();[[2,'2倍'],[0.5,'1/2']].forEach(([v,t],i)=>c.btn({t,x:20+i*156,y:300,w:136,c:'sky',on:()=>{k=v;draw();c.say(v>1?'O から の 長さ が 2倍 に なったね。':'O から の 長さ を 半分 に すると 縮図 だよ。')}}))}}],
  check:r=>[{kind:'num',q:'点O を 中心 に 2倍の拡大図。OA が 3cm なら OA\' は 何cm？',unit:'cm',ans:6,body:'OA ＝ 3cm<br>2倍 に のばす',explain:'3×2=6cm だよ。'},
   {kind:'num',q:'点O を 中心 に 1/2の縮図。OB が 8cm なら OB\' は 何cm？',unit:'cm',ans:4,body:'OB ＝ 8cm<br>1/2 に ちぢめる',explain:'8÷2=4cm だよ。'}]},
 {id:'l8',title:'縮尺 と 縮図 の りよう',sub:'地図 や 高さ を 求める',slides:[
  {t:'縮尺 って なに？',say:'地図 は、じっさい の 長さ を 同じ わりあい で ちぢめた 縮図 だよ。',point:'<span class="h">ポイント</span>じっさい の 長さ を ちぢめた わりあい を <b>縮尺</b> という。',
   scene(c){mapFig(5,'縮尺 1/1000','5cm')(c.svg)}},
  {t:'3つ の 表し方',say:'縮尺 には 3つ の 表し方 が あるよ。',point:'<span class="h">おぼえよう</span>1/1000<br>1：1000<br>ものさし の 形',
   scene(c){const sv=c.svg;[['分数','1/1000',110],['比','1：1000',250]].forEach(([a,b,y])=>{el('rect',{x:150,y,width:572,height:110,rx:24,fill:'#fff',stroke:'#c8bff0','stroke-width':4},sv);txt(sv,280,y+55,a,26,'#8a7aa8','middle',900);txt(sv,520,y+55,b,34,'#4d4270','middle',900)});
     el('rect',{x:150,y:390,width:572,height:90,rx:24,fill:'#fff',stroke:'#c8bff0','stroke-width':4},sv);txt(sv,280,435,'ものさし',26,'#8a7aa8','middle',900);
     [0,1,2,3].forEach(i=>{el('rect',{x:400+i*70,y:420,width:70,height:14,fill:i%2?'#fff':'#4d4270',stroke:'#4d4270','stroke-width':2},sv);txt(sv,400+i*70,452,String(i*10),14,'#4d4270')});txt(sv,400+4*70+8,452,'30m',14,'#4d4270')}},
  {t:'じっさい の 長さ を 求めよう',say:'「つぎ の 手じゅん」で 計算 して みよう。',point:'<span class="h">ポイント</span>地図 の 長さ × 縮尺 の 分母 ＝ じっさい の 長さ',
   scene(c){let st=0;const lines=['縮尺 1/1000 の 地図で 5cm','5 × 1000 ＝ 5000 (cm)','5000cm ＝ 50m'];const draw=()=>{c.clear();mapFig(5,'縮尺 1/1000','5cm')(c.svg);
     for(let i=0;i<st;i++){el('rect',{x:120,y:250+i*60,width:632,height:50,rx:14,fill:'rgba(255,255,255,.95)',stroke:'#ffcf5c','stroke-width':3},c.svg);txt(c.svg,436,275+i*60,lines[i],24,'#4d4270','middle',900)}};
     draw();c.btn({t:'つぎ の 手じゅん',x:20,y:300,w:292,c:'sky',on:()=>{if(st<3)st++;draw();c.say(st===3?'じっさい は 50m だね！':'つぎ も 見て みよう。',st===3?'jump':'')}})}},
  {t:'高い 木 の 高さ',say:'はかれない 高さ も、縮図 を かけば 求められるよ。',point:'<span class="h">ポイント</span>縮図 で はかった 長さ を じっさい に もどして、目の高さ を たす。',
   scene(c){let st=0;const lines=['3 × 500 ＝ 1500 (cm) ＝ 15m','15m ＋ 目の高さ 1.5m ＝ 16.5m'];const draw=()=>{c.clear();treeFig(500,3,1.5)(c.svg);
     for(let i=0;i<st;i++){el('rect',{x:130,y:90+i*56,width:420,height:48,rx:14,fill:'rgba(255,255,255,.95)',stroke:'#ffcf5c','stroke-width':3},c.svg);txt(c.svg,340,114+i*56,lines[i],22,'#4d4270','middle',900)}};
     draw();c.btn({t:'つぎ の 手じゅん',x:20,y:300,w:292,c:'sky',on:()=>{if(st<2)st++;draw();c.say(st===2?'木の高さ は 16.5m だね！':'目の高さ も わすれずに。',st===2?'jump':'')}})}}],
  check:r=>[makeScale(r,0),makeHeight(r,0)]}];

// ---------- 単元の登録 ----------
const gen=(n,f)=>r=>Array.from({length:n},(_,i)=>f(r,i));
S6.addUnit({id:'kakudai',grade:6,title:'拡大図と縮図',intro:'まずは「しる」で しくみ を 知ろう。星 を あつめると クリア だよ。',menus:[
 {id:'shiru',name:'しる',desc:'しくみ を<br>知ろう',color:'#9fd3ff',icon:'shiru',say:'1話 ずつ 見て、さいご に たしかめ問題 を とこう。',stages:LESSONS},
 {id:'miwake',name:'みわける',desc:'拡大図・縮図<br>を さがそう',color:'#ffadcf',icon:'miwake',stages:[
   {id:'m1',title:'三角形',sub:'5問',gen:gen(5,r=>makeChoose(r,TRI,[0.5,1.5,2],true))},
   {id:'m2',title:'四角形',sub:'5問',gen:gen(5,r=>makeChoose(r,QUAD,[0.5,1.5,2],true))},
   {id:'m3',title:'いろいろ な 図形',sub:'5問・3倍 も 出るよ',gen:gen(5,r=>makeChoose(r,TRI.concat(QUAD),[0.5,1.5,2,2.5,3],true))}]},
 {id:'kaku',name:'かく',desc:'方眼 に<br>かいて みよう',color:'#8fdcc0',icon:'kaku',stages:[
   {id:'d1',title:'方眼 に 2倍 の 拡大図',sub:'三角形・3問',gen:gen(3,r=>makeDraw(r,'tri2'))},
   {id:'d2',title:'方眼 に 2倍・3倍',sub:'四角形・3問',gen:gen(3,r=>makeDraw(r,'quad'))},
   {id:'d3',title:'方眼 に 1/2 の 縮図',sub:'三角形・四角形・3問',gen:gen(3,r=>makeDraw(r,'half'))},
   {id:'d4',title:'頂点 から かく',sub:'場所 が きまっている・3問',gen:gen(3,r=>makeDraw(r,'anchor'))},
   {id:'d5',title:'1つの点 を 中心 に',sub:'2倍・1/2・3問',gen:gen(3,r=>makeDraw(r,'center'))}]},
 {id:'motome',name:'もとめる',desc:'長さ や 角 を<br>計算 しよう',color:'#ffc2a3',icon:'motome',stages:[
   {id:'c1',title:'対応する 辺 と 角',sub:'5問',gen:gen(5,(r,i)=>makeSide(r,i===2||i===4?'ang':'side'))},
   {id:'c2',title:'何倍 の 図？',sub:'5問',gen:gen(5,r=>makeBai(r))},
   {id:'c3',title:'縮尺 の 計算',sub:'5問',gen:r=>r.shuffle([0,1,2,3,4]).map(t=>makeScale(r,t))},
   {id:'c4',title:'縮図 で 高さ を 求める',sub:'4問',gen:gen(4,(r,i)=>makeHeight(r,i===3?1:0))}]},
 {id:'test',name:'テスト',desc:'10問 で<br>たしかめよう',color:'#ffcf5c',icon:'test',test:true,stages:[
   {id:'t1',title:'たしかめテスト',pass:8,gen:r=>[makeChoose(r,TRI,[0.5,1.5,2],false),makeChoose(r,QUAD,[0.5,2],false),makeSide(r,'side'),makeBai(r),
     makeDraw(r,r.pick(['tri2','quad'])),makeScale(r,r.int(5)),makeChoose(r,TRI.concat(QUAD),[1.5,2,3],false),makeHeight(r,0),makeDraw(r,r.pick(['half','center'])),word(r)]}]}]});
})();
