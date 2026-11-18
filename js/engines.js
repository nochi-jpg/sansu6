// さんすうスペースラボ 画面と問題の型（どの単元でも使う）
(function(){
const S6=SANSU6,h=S6.h,btn=S6.btn,G=S6.G;
const E=S6.E={},K=E.K={};
const pos=(e,x,y,w,hh)=>{e.style.left=x+'px';e.style.top=y+'px';if(w)e.style.width=w+'px';if(hh)e.style.height=hh+'px';return e};
const usaSrc=()=>document.querySelector('#usa img').src;
const PRAISE=['せいかい！ すごいね。','そのとおり！','ばっちり！ よく わかっているね。','せいかい！ その ちょうし！','やったね！ せいかい だよ。'];
let pi=0;const praise=()=>PRAISE[(pi++)%PRAISE.length];

const ICON={
 shiru:'<svg width="110" height="110" viewBox="0 0 110 110"><polygon points="20,85 50,85 20,60" fill="#fff" stroke="#4d4270" stroke-width="4"/><polygon points="45,90 95,90 45,48" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="7 6"/><circle cx="78" cy="30" r="14" fill="none" stroke="#fff" stroke-width="5"/><line x1="88" y1="40" x2="100" y2="52" stroke="#fff" stroke-width="6" stroke-linecap="round"/></svg>',
 miwake:'<svg width="110" height="110" viewBox="0 0 110 110"><polygon points="15,50 45,50 15,25" fill="#fff"/><polygon points="55,95 100,95 55,57" fill="#fff"/><path d="M62 30l8 8 16-18" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 kaku:'<svg width="110" height="110" viewBox="0 0 110 110"><g stroke="rgba(255,255,255,.55)" stroke-width="2"><path d="M15 15v80M35 15v80M55 15v80M75 15v80M95 15v80M15 15h80M15 35h80M15 55h80M15 75h80M15 95h80"/></g><polyline points="15,95 75,95 15,35 15,95" fill="none" stroke="#fff" stroke-width="6" stroke-linejoin="round"/><circle cx="75" cy="95" r="7" fill="#fff"/></svg>',
 motome:'<svg width="110" height="110" viewBox="0 0 110 110"><rect x="18" y="18" width="74" height="74" rx="14" fill="none" stroke="#fff" stroke-width="6"/><path d="M38 42h34M55 25v34M38 74h34M38 84h34" stroke="#fff" stroke-width="6" stroke-linecap="round"/></svg>',
 test:'<svg width="110" height="110" viewBox="0 0 110 110"><circle cx="55" cy="62" r="32" fill="#fff"/><path d="M38 12l17 22 17-22" fill="none" stroke="#fff" stroke-width="8" stroke-linejoin="round"/><path d="M55 46l5 10 11 1.5-8 7.5 2 11-10-5.5-10 5.5 2-11-8-7.5 11-1.5z" fill="#ffcf5c"/></svg>'};
const MEDAL='<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="14" r="8" fill="#ffcf5c" stroke="#fff" stroke-width="1.5"/><path d="M8 2l4 5 4-5" fill="none" stroke="#e46f9f" stroke-width="2.4"/><path d="M12 10l1.2 2.4 2.6.4-1.9 1.8.5 2.6-2.4-1.3-2.4 1.3.5-2.6-1.9-1.8 2.6-.4z" fill="#fff"/></svg>';

function pager(r,pg,np,fn,y){
  btn(r,{t:'まえ',x:380,y,w:160,c:'white'+(pg>0?'':' dis'),on:()=>fn(pg-1)});
  pos(h('div','pnum',r,`${pg+1} / ${np}`),560,y);
  btn(r,{t:'つぎ',x:740,y,w:160,c:'white'+(pg<np-1?'':' dis'),on:()=>fn(pg+1)})}
const key=(m,st)=>m.id+'/'+st.id;
E.progress=function(u){const US=S6.U(u.id);let t=0,d=0;u.menus.forEach(m=>m.stages.forEach(st=>{t++;if((US.st[key(m,st)]||0)>=1)d++}));return{total:t,done:d}};

// ---------- タイトル ----------
E.title=function(){S6.show({talk:false,render(r){
  pos(h('div','planet',r),-80,470,360,360).style.background='radial-gradient(circle at 35% 30%,#ffd9e8,#ff92bf 60%,#c96ea0)';
  pos(h('div','planet',r),1040,60,180,180).style.background='radial-gradient(circle at 35% 30%,#d6f5ea,#6fd0ad 60%,#3f9f80)';
  h('div','logo',r,'<div class="s">しょうがっこう の さんすう</div><div class="m">さんすうスペースラボ</div>');
  const im=h('img','tusa',r);im.src=usaSrc();
  btn(r,{t:'はじめる',x:490,y:600,w:300,c:'mint',z:'L',se:'decide',on:()=>E.units(0)});
  btn(r,{t:'せってい',x:1066,y:640,w:190,c:'white',on:E.settings})}})};

// ---------- せってい ----------
E.settings=function(){let step=0;S6.show({title:'せってい',back:E.title,render(r){
  S6.talk('','おとの 大きさ を えらべるよ。');
  const p=pos(h('div','panel',r),240,196,800,508);
  pos(h('div','setrow',p,'こうかおん'),60,60);
  const SV=S6.SV(),bs=['なし','小','大'].map((t,i)=>btn(p,{t,x:280+i*150,y:60,w:130,c:SV.se===i?'sel':'white',on:()=>{SV.se=i;S6.save();bs.forEach((b,j)=>b.className='btn M '+(j===i?'sel':'white'));S6.se('ok')}}));
  pos(h('div','setrow',p,'データ'),60,180);
  const del=btn(p,{t:'データを けす',x:280,y:180,w:430,c:'peach',on:()=>{step++;
    if(step===1){del.innerHTML='ほんとうに けす？ もう一度 おしてね';S6.say('ぜんぶの 星 と テストの点 が きえるよ。','sad')}
    else{S6.reset();del.innerHTML='けしました';del.classList.add('dis');S6.say('データを けしたよ。')}}})}})};

// ---------- 単元えらび ----------
E.units=function(pg){const U=S6.units,per=6,np=Math.max(1,Math.ceil(U.length/per));pg=pg||0;
  S6.show({title:'たんげん を えらぼう',back:E.title,render(r){
  S6.talk('','どの たんげん を べんきょう する？');
  for(let i=0;i<per;i++){const u=U[pg*per+i],x=64+(i%3)*396,y=204+Math.floor(i/3)*204;
    if(!u){pos(h('div','card empty',r,'これから ふえるよ'),x,y,360,188);continue}
    const c=pos(h('div','card ucard',r),x,y,360,188),pr=E.progress(u);
    c.innerHTML=`<div class="g">${u.grade}年</div><div class="t">${u.title}</div><div class="n">ステージ ${pr.done} / ${pr.total}</div><div class="gauge"><i style="width:${pr.total?pr.done/pr.total*100:0}%"></i></div>`;
    c.onclick=()=>{S6.se('decide');E.unit(u)}}
  pager(r,pg,np,E.units,616)}})};

// ---------- 単元ホーム ----------
E.unit=function(u){S6.show({title:`${u.grade}年　${u.title}`,back:()=>E.units(Math.floor(S6.units.indexOf(u)/6)),render(r){
  S6.talk('',u.intro||'メニュー を えらんでね。');
  const ms=u.menus,w=232,n=ms.length,step=250,x0=24+(1232-(w+step*(n-1)))/2,US=S6.U(u.id);
  ms.forEach((m,i)=>{const c=pos(h('div','card mcard',r),x0+i*step);
    let p;if(m.test){p=(US.test.pass?`<i>${MEDAL}</i>`:'')+`さいこう ${US.test.best}点`}
    else{const d=m.stages.filter(st=>(US.st[key(m,st)]||0)>=1).length;p=`<i>${S6.STAR('#ffcf5c')}</i>${d} / ${m.stages.length}`}
    c.innerHTML=`<div class="ic" style="background:${m.color}">${ICON[m.icon]||''}</div><div class="t">${m.name}</div><div class="d">${m.desc}</div><div class="p">${p}</div>`;
    c.onclick=()=>{S6.se('decide');m.test?E.open(u,m,m.stages[0]):E.stages(u,m,0)}})}})};

// ---------- ステージえらび ----------
E.stages=function(u,m,pg){const per=8,np=Math.max(1,Math.ceil(m.stages.length/per)),US=S6.U(u.id);pg=pg||0;
  S6.show({title:`${m.name}　ステージ を えらぼう`,back:()=>E.unit(u),render(r){
  S6.talk('',m.say||'金の星 は ミスなし・ヒントなし で クリア した しるし だよ。');
  for(let i=0;i<per;i++){const st=m.stages[pg*per+i];if(!st)break;const v=US.st[key(m,st)]||0;
    const c=pos(h('div','card scard',r),64+(i%4)*296,204+Math.floor(i/4)*216);
    c.innerHTML=`<div class="no">${pg*per+i+1}</div><div class="st">${S6.STAR(S6.STARC(v))}</div><div class="t">${st.title}</div><div class="d">${st.sub||''}</div>`;
    c.onclick=()=>{S6.se('decide');E.open(u,m,st)}}
  if(np>1)pager(r,pg,np,p=>E.stages(u,m,p),636)}})};
E.open=(u,m,st)=>st.slides?E.lesson(u,m,st):E.run(u,m,st);
const stTitle=(m,st)=>m.test?st.title:`${m.name} ${m.stages.indexOf(st)+1}　${st.title}`;
const backTo=(u,m,st)=>()=>m.test?E.unit(u):E.stages(u,m,Math.floor(m.stages.indexOf(st)/8));

// ---------- しる（説明スライド） ----------
E.lesson=function(u,m,st){let si=0;const sl=st.slides;
  function slide(){S6.show({title:stTitle(m,st),back:backTo(u,m,st),chip:`${si+1} / ${sl.length}`,render(r){
    const s=sl[si],main=h('div','panel main',r),side=h('div','panel side',r);
    S6.talk(s.t,s.say);h('div','pt',side,s.point||'');
    const svg=S6.svg(main,872,500);
    s.scene&&s.scene({svg,side,main,say:S6.say,btn:o=>btn(side,o),clear:()=>{svg.innerHTML=''}});
    btn(side,{t:'まえ',x:20,y:432,w:136,c:'white'+(si>0?'':' dis'),on:()=>{si--;slide()}});
    btn(side,{t:si<sl.length-1?'つぎ':'たしかめ',x:176,y:432,w:136,c:si<sl.length-1?'mint':'pink',se:si<sl.length-1?'tap':'decide',on:()=>{if(si<sl.length-1){si++;slide()}else checks()}})}})}
  function checks(){E.run(u,m,st,{items:st.check(S6.rng((Math.random()*1e9)|0)),check:true})}
  slide()};

// ---------- 問題を順に出す（練習・たしかめ・テスト共通） ----------
E.run=function(u,m,st,opt){opt=opt||{};const US=S6.U(u.id),k=key(m,st),test=!!m.test,keep=!opt.items;let R;
  if(keep){const rs=US.resume;R=rs&&rs.key===k?Object.assign({},rs):{key:k,seed:(Math.random()*1e9)>>>0,i:0,miss:0,hint:0,ok:0};R.items=st.gen(S6.rng(R.seed))}
  else R={items:opt.items,i:0,miss:0,hint:0,ok:0};
  const persist=()=>{if(!keep)return;US.resume={key:k,seed:R.seed,i:R.i,miss:R.miss,hint:R.hint,ok:R.ok};S6.save()};
  persist();
  function next(){R.i++;if(R.i>=R.items.length){if(keep)US.resume=null;E.result(u,m,st,R)}else{persist();item()}}
  function item(){const it=R.items[R.i];let im=0,hi=0,done=false;
    S6.show({title:(opt.check?'たしかめ　':'')+stTitle(m,st),back:backTo(u,m,st),chip:`${R.i+1} / ${R.items.length} もん`,render(r){
      const main=h('div','panel main',r),side=h('div','panel side',r);
      S6.talk(it.q,it.say||'');
      if(!test&&it.hints&&it.hints.length)S6.setHint(()=>{if(done)return;if(!hi){R.hint++;persist()}S6.say(it.hints[Math.min(hi,it.hints.length-1)]);ctx.onHint&&ctx.onHint(hi);hi++});
      const ctx={test,main,side,
        right(){if(done)return;done=true;if(!test||im===0)R.ok++;persist();S6.se('ok');S6.stamp(main);S6.say(it.good||praise(),'jump');S6.setHint(null);ctx.next()},
        wrong(){if(done)return;S6.se('ng');if(test){done=true;S6.say('ざんねん。'+(it.explain||''),'sad');S6.setHint(null);ctx.next();return}
          im++;R.miss++;persist();S6.say(im>=2&&it.explain?it.explain:(it.hints&&it.hints[0])||it.explain||'もう一度 考えてみよう。','sad')},
        misses:()=>im,
        next(){ctx.side.querySelectorAll('.act').forEach(b=>b.remove());const b=btn(side,{t:R.i<R.items.length-1?'つぎへ':'けっか を 見る',x:20,y:432,w:292,c:'mint',se:'decide',on:next});b.classList.add('act')},
        act(t,on){const b=btn(side,{t,x:20,y:432,w:292,c:'mint',on});b.classList.add('act');return b}};
      K[it.kind](it,ctx)}})}
  item()};

// ---------- けっか ----------
E.result=function(u,m,st,R){const US=S6.U(u.id),k=key(m,st),n=R.items.length;let big,ic,info,se='good';
  if(m.test){const pass=R.ok>=(st.pass||Math.ceil(n*.8));US.test.best=Math.max(US.test.best,R.ok);if(pass){US.test.pass=1;US.st[k]=2}
    big=pass?'ごうかく！':'もう ひといき！';ic=pass?MEDAL:S6.STAR('#ece8f6');info=`${n}問中 ${R.ok}問 せいかい<br>さいこう ${US.test.best}点（${st.pass||Math.ceil(n*.8)}問 以上で ごうかく）`;se=pass?'cheer':'tap';
    S6.talk('',pass?'ごうかく おめでとう！ もう 拡大図・縮図 はかせ だね。':'まちがえた ところ を「しる」で 見なおして みよう。',pass?'jump':'')}
  else{const v=R.miss===0&&R.hint===0?2:1;US.st[k]=Math.max(US.st[k]||0,v);
    big='ステージ クリア！';ic=S6.STAR(S6.STARC(v));info=`ミス ${R.miss}回　ヒント ${R.hint}回<br>${v===2?'金の星 ゲット！':'ミスなし・ヒントなし なら 金の星 だよ'}`;
    S6.talk('',v===2?'金の星 だよ！ かんぺき だね。':'クリア おめでとう！ つぎは 金の星 を めざそう。','jump')}
  S6.save();S6.se(se);
  S6.show({title:stTitle(m,st),back:backTo(u,m,st),talk:true,render(r){
    const p=h('div','panel res',r);h('div','big',p,big);h('div','star',p,ic);h('div','info',p,info);
    btn(p,{t:'もういちど',x:110,y:404,w:270,c:'white',on:()=>E.open(u,m,st)});
    btn(p,{t:m.test?'メニュー へ':'ステージえらび へ',x:420,y:404,w:270,c:'mint',on:backTo(u,m,st)})}})};

// ---------- 型：図と えらぶ（ボタン） ----------
function figArea(it,main){const svg=S6.svg(main,872,500);if(it.fig)it.fig(svg);
  else if(it.body){const d=h('div','',main,it.body);Object.assign(d.style,{position:'absolute',left:'40px',right:'40px',top:'0',bottom:'0',display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',fontSize:'32px',lineHeight:'1.7',fontWeight:'900'})}
  return svg}
function pickButtons(side,opts,ans,ctx,y0,onRight){const bs=[];let locked=false;
  opts.forEach((t,i)=>bs.push(btn(side,{t,x:20,y:y0+i*66,w:292,c:'white',z:t.length>9?'S':'M',on:(e,b)=>{if(locked)return;
    if(i===ans){b.className=b.className.replace('white','okb');locked=true;bs.forEach(x=>x!==b&&x.classList.add('dis'));(onRight||ctx.right)()}
    else{b.className=b.className.replace('white','ngb');b.classList.add('shake');
      if(ctx.test){locked=true;bs[ans].className=bs[ans].className.replace('white','okb');ctx.wrong()}else{b.classList.add('dis');ctx.wrong()}}}})));
  bs.forEach(b=>{if(b.classList.contains('S'))b.style.top=(parseFloat(b.style.top)+4)+'px'});return bs}
K.pick=function(it,ctx){figArea(it,ctx.main);pickButtons(ctx.side,it.opts,it.ans,ctx,20)};

// ---------- 型：数を答える（テンキー） ----------
K.num=function(it,ctx){figArea(it,ctx.main);const np=S6.numpad(ctx.side,{unit:it.unit,prefix:it.prefix});
  const ok=ctx.act('けってい',()=>{const v=np.num();if(isNaN(v)){S6.say('テンキー で こたえ を 入れてね。');return}
    if(Math.abs(v-it.ans)<1e-6){np.mark('ok');np.lock(true);ctx.right()}
    else{np.mark('ng');if(ctx.test){np.lock(true);ctx.wrong()}else ctx.wrong()}})};

// ---------- 型：みわける（図の一覧からえらぶ） ----------
// it.cands=[{p, base, ok, k}] 1つ目が「あ」。it.follow={q,opts,ans}
K.choose=function(it,ctx){const NM='あいうえおか',main=ctx.main,side=ctx.side,cs=it.cands;
  const A0=Math.abs(G.area(cs[0].p));cs.forEach(c=>{const kk=Math.sqrt(Math.abs(G.area(c.p))/A0);c.f=Math.pow(kk,0.25)/kk});
  let cc=1e9;cs.forEach(c=>{const b=G.bbox(c.p);cc=Math.min(cc,180/(b.w*c.f),150/(b.h*c.f))});
  const sel=new Set(),cells=[];let locked=false;
  cs.forEach((c,i)=>{const d=pos(h('div','cell'+(c.base?' base':''),main),i%3*294,Math.floor(i/3)*255);d.innerHTML=`<div class="nm">${NM[i]}</div>`;
    const b=G.bbox(c.p),own=Math.min(180/b.w,150/b.h),mn=Math.min(b.w,b.h);const sv=S6.svg(d,276,237),s0=Math.min(own*1.1,Math.max(cc*c.f,95/mn));G.drawSafe(sv,c.p,{cx:142,cy:126,side:1,angle:1,fs:15,fill:c.base?'#fff':'#ddf0ff'},[1.15,1.08,1,.92,.85,.78].map(f=>Math.min(own*1.15,s0*f)));cells.push(d);
    if(!c.base)d.onclick=()=>{if(locked)return;S6.se('tap');sel.has(i)?sel.delete(i):sel.add(i);d.classList.toggle('on')}});
  const pt=h('div','pt',side,'あ と くらべて、<br>拡大図・縮図 を<br>ぜんぶ えらんだら、<br>こたえあわせ を<br>おしてね。');
  const right=cs.map((c,i)=>c.ok?i:-1).filter(i=>i>0);
  ctx.act('こたえあわせ',()=>{if(locked)return;if(!sel.size){S6.say('図 を クリック して えらんでね。');return}
    const ok=right.length===sel.size&&right.every(i=>sel.has(i));
    if(ctx.test||ok||ctx.misses()>=1){locked=true;cells.forEach((d,i)=>{if(!i)return;d.classList.remove('on');if(cs[i].ok)d.classList.add('ok');else if(sel.has(i))d.classList.add('ng')});
      if(!ok){ctx.wrong();if(ctx.test)return;S6.say(it.explain,'sad')}
      if(it.follow&&!ctx.test){side.querySelectorAll('.act').forEach(b=>b.remove());const f=it.follow;pt.innerHTML=f.q;
        if(ok)S6.say('せいかい！ では、つぎ の しつもん だよ。','jump'),S6.se('ok');
        pickButtons(side,f.opts,f.ans,ctx,150)}else if(ok)ctx.right()}
    else{const bad=[...sel].filter(i=>!cs[i].ok);bad.forEach(i=>{sel.delete(i);cells[i].classList.remove('on');cells[i].classList.add('ng');setTimeout(()=>cells[i].classList.remove('ng'),900)});
      ctx.wrong();S6.say(bad.length?`${bad.map(i=>NM[i]).join('・')} は ちがうよ。角の大きさ と 辺の長さ の 倍 を くらべよう。`:'まだ ほかにも あるよ。向き が ちがう図 も 見てみよう。','sad')}})};

// ---------- 型：方眼にかく（直線ツール） ----------
// it={org, names, k, mode:'free'|'anchor'|'center', at:[x,y], v:0, center:[x,y], start(推奨位置)}
const C=28,OX=16,OY=12,COLS=30,ROWS=17,X=i=>OX+i*C,Y=j=>OY+j*C;
function pieces(a,b){const dx=b[0]-a[0],dy=b[1]-a[1],g=(function f(m,n){return n?f(n,m%n):m})(Math.abs(dx),Math.abs(dy)),sx=dx/g,sy=dy/g,out=[];
  for(let i=0;i<g;i++){const p=[a[0]+sx*i,a[1]+sy*i],q=[p[0]+sx,p[1]+sy];out.push(p[0]<q[0]||(p[0]===q[0]&&p[1]<q[1])?p+'|'+q:q+'|'+p)}return out}
E.drawTarget=function(it){const o=it.org,k=it.k;
  if(it.mode==='center')return o.map(([x,y])=>[it.center[0]+(x-it.center[0])*k,it.center[1]+(y-it.center[1])*k]);
  if(it.mode==='anchor'){const v=o[it.v||0];return o.map(([x,y])=>[it.at[0]+(x-v[0])*k,it.at[1]+(y-v[1])*k])}
  return o.map(([x,y])=>[x*k,y*k])};
E.judgeDraw=function(it,segs){const T=E.drawTarget(it),mine=new Set();segs.forEach(s=>pieces(...s).forEach(q=>mine.add(q)));
  const tset=t=>{const s=new Set();T.forEach((v,i)=>{const w=T[(i+1)%T.length];pieces([v[0]+t[0],v[1]+t[1]],[w[0]+t[0],w[1]+t[1]]).forEach(q=>s.add(q))});return s};
  const cand=it.mode==='free'?[]:[[0,0]];if(it.mode==='free')segs.flat().forEach(p=>T.forEach(v=>cand.push([p[0]-v[0],p[1]-v[1]])));
  let best=null;cand.forEach(t=>{const tp=tset(t);let sc=0;tp.forEach(q=>{if(!mine.has(q))sc++});mine.forEach(q=>{if(!tp.has(q))sc+=1});if(!best||sc<best.sc)best={sc,tp}});
  const bad=new Set();segs.forEach((s,i)=>{if(!best||pieces(...s).some(q=>!best.tp.has(q)))bad.add(i)});
  return{ok:!!best&&best.sc===0&&segs.length>0,bad}};
K.draw=function(it,ctx){const main=ctx.main,side=ctx.side,el=S6.el,txt=S6.txt;let segs=[],start=null,hover=null,bad=null,locked=false,showHint=0;
  const svg=S6.svg(main,872,500);
  function gp(e){const r=svg.getBoundingClientRect(),sc=r.width/872;return[Math.max(0,Math.min(COLS,Math.round(((e.clientX-r.left)/sc-OX)/C))),Math.max(0,Math.min(ROWS,Math.round(((e.clientY-r.top)/sc-OY)/C)))]}
  function paint(){svg.innerHTML='';el('rect',{x:0,y:0,width:872,height:500,fill:'#fff'},svg);
    for(let i=0;i<=COLS;i++)el('line',{x1:X(i),y1:Y(0),x2:X(i),y2:Y(ROWS),stroke:i%5?'#e3e7f7':'#c9cfe9','stroke-width':i%5?1:1.5},svg);
    for(let j=0;j<=ROWS;j++)el('line',{x1:X(0),y1:Y(j),x2:X(COLS),y2:Y(j),stroke:j%5?'#e3e7f7':'#c9cfe9','stroke-width':j%5?1:1.5},svg);
    const o=it.org;el('polygon',{points:o.map(p=>X(p[0])+','+Y(p[1])).join(' '),fill:'#ddf0ff',stroke:'#5d9fd8','stroke-width':3,'stroke-linejoin':'round'},svg);
    const cx=o.reduce((s,p)=>s+p[0],0)/o.length,cy=o.reduce((s,p)=>s+p[1],0)/o.length;
    (it.names||[]).forEach((n,i)=>{if(it.mode==='center'&&o[i][0]===it.center[0]&&o[i][1]===it.center[1])n=n+'＝O';const dx=o[i][0]-cx,dy=o[i][1]-cy,dl=Math.hypot(dx,dy)||1;txt(svg,X(o[i][0])+dx/dl*20,Y(o[i][1])+dy/dl*20,n,19,'#4d4270','middle',900)});
    if(it.mode==='center'){const c=it.center;if(showHint)o.forEach(p=>{const t=[c[0]+(p[0]-c[0])*Math.max(it.k,1.0001),c[1]+(p[1]-c[1])*Math.max(it.k,1)];el('line',{x1:X(c[0]),y1:Y(c[1]),x2:X(t[0]),y2:Y(t[1]),stroke:'#ffb3cf','stroke-width':2,'stroke-dasharray':'6 5'},svg)});
      el('circle',{cx:X(c[0]),cy:Y(c[1]),r:6,fill:'#4d4270'},svg);if(!o.some(p=>p[0]===c[0]&&p[1]===c[1]))txt(svg,X(c[0])-16,Y(c[1])+16,'O',19,'#4d4270','middle',900)}
    if(it.mode==='anchor'){el('circle',{cx:X(it.at[0]),cy:Y(it.at[1]),r:7,fill:'#e46f9f',stroke:'#fff','stroke-width':2},svg);txt(svg,X(it.at[0])-18,Y(it.at[1])-16,it.atName||'D',19,'#e46f9f','middle',900)}
    if(showHint>=2){const T=E.drawTarget(it),sh=it.mode==='free'?it.start:[0,0];T.forEach(p=>el('circle',{cx:X(p[0]+sh[0]),cy:Y(p[1]+sh[1]),r:6,fill:'#ffcf5c',stroke:'#fff','stroke-width':2},svg))}
    segs.forEach((g,i)=>el('line',{x1:X(g[0][0]),y1:Y(g[0][1]),x2:X(g[1][0]),y2:Y(g[1][1]),stroke:bad?(bad.has(i)?'#ff5f9e':'#3fb88c'):'#7a63d6','stroke-width':5,'stroke-linecap':'round'},svg));
    if(start&&hover&&!locked)el('line',{x1:X(start[0]),y1:Y(start[1]),x2:X(hover[0]),y2:Y(hover[1]),stroke:'#b9a6f2','stroke-width':4,'stroke-dasharray':'8 6','stroke-linecap':'round'},svg);
    if(hover&&!locked)el('circle',{cx:X(hover[0]),cy:Y(hover[1]),r:7,fill:'none',stroke:'#7a63d6','stroke-width':3},svg);
    if(start&&!locked)el('circle',{cx:X(start[0]),cy:Y(start[1]),r:8,fill:'#ff92bf',stroke:'#fff','stroke-width':3},svg)}
  svg.style.cursor='crosshair';
  svg.addEventListener('pointermove',e=>{const p=gp(e);if(!hover||p[0]!==hover[0]||p[1]!==hover[1]){hover=p;paint()}});
  svg.addEventListener('pointerleave',()=>{hover=null;paint()});
  svg.addEventListener('click',e=>{if(locked)return;const p=gp(e);bad=null;
    if(!start)start=p;else if(p[0]===start[0]&&p[1]===start[1])start=null;else{segs.push([start,p]);S6.se('tap');start=p}paint()});
  h('div','pt',side,'<span class="h">つかいかた</span>点 を クリック → つぎの点 を クリック で 線 が ひけるよ。');
  btn(side,{t:'1本 けす',x:20,y:180,w:292,c:'white',on:()=>{if(locked)return;segs.pop();start=segs.length?segs[segs.length-1][1]:null;bad=null;paint()}});
  btn(side,{t:'ぜんぶ けす',x:20,y:248,w:292,c:'white',on:()=>{if(locked)return;segs=[];start=null;bad=null;paint()}});
  btn(side,{t:'線 を とめる',x:20,y:316,w:292,c:'white',on:()=>{start=null;paint()}});
  ctx.onHint=n=>{showHint=Math.min(2,n+1);paint()};
  ctx.act('こたえあわせ',()=>{if(locked)return;start=null;const r=E.judgeDraw(it,segs);bad=r.bad;
    if(!segs.length){S6.say('まだ 線 が ないよ。点 を クリック してみよう。');bad=null;paint();return}
    if(r.ok){locked=true;bad=new Set();ctx.right()}else{if(ctx.test){locked=true;showHint=2}ctx.wrong()}paint()});
  paint()};
})();
