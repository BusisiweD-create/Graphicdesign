const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const root=document.documentElement;
// theme
try{const t=localStorage.getItem('theme');if(t)root.dataset.theme=t}catch(e){}
function setTheme(t){root.dataset.theme=t;try{localStorage.setItem('theme',t)}catch(e){}}
$('.sun').onclick=()=>setTheme('light');$('.moon').onclick=()=>setTheme('dark');
// toast
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('show'),2600)}
// mobile nav
$('#burger').onclick=()=>$('#nav').classList.toggle('open');
$$('#nav a').forEach(a=>a.addEventListener('click',()=>$('#nav').classList.remove('open')));
// scroll spy
const links=$$('#nav a'),secs=['home','about','portfolio','skills','contact'];
const spy=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){links.forEach(l=>l.classList.toggle('on',l.getAttribute('href')==='#'+e.target.id))}}),{rootMargin:'-40% 0px -50% 0px'});
secs.forEach(id=>spy.observe(document.getElementById(id)));
// reveal
const rv=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');rv.unobserve(e.target)}}),{threshold:.15});
$$('.rev').forEach(el=>rv.observe(el));
// typewriter
const roles=['Graphic Designer','Brand Designer','Layout Artist','Logo Designer'];let ri=0,ci=roles[0].length,del=true;
const roleEl=$('#role');
(function tick(){const w=roles[ri];
 if(del){ci--;if(ci<=0){del=false;ri=(ri+1)%roles.length}}else{ci++;if(ci>=roles[ri].length){del=true;roleEl.textContent=roles[ri];return setTimeout(tick,1800)}}
 roleEl.textContent=roles[ri].slice(0,Math.max(ci,0));setTimeout(tick,del?40:80)})();
// mouse parallax + glow
const glow=$('#glow'),stage=$('#stage'),lap=$('#laptop');
addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'});
stage.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
 lap.style.transform=`rotateY(${x*14}deg) rotateX(${-y*10}deg)`;
 $$('.app',stage).forEach((a,i)=>a.style.translate=`${x*(24+i*10)}px ${y*(24+i*10)}px`)});
stage.addEventListener('pointerleave',()=>{lap.style.transform='';$$('.app',stage).forEach(a=>a.style.translate='')});
$$('.app').forEach(a=>a.addEventListener('click',()=>{a.animate([{transform:a.style.transform||'none'},{transform:'rotate(360deg) scale(1.2)'},{transform:a.style.transform||'none'}],{duration:700});toast(a.textContent+' is in my toolkit')}));
// heart
$('#heart').onclick=e=>{for(let i=0;i<8;i++){const s=document.createElement('span');s.textContent='♡';Object.assign(s.style,{position:'fixed',left:e.clientX+'px',top:e.clientY+'px',color:'var(--accent)',pointerEvents:'none',zIndex:60,fontSize:(14+Math.random()*16)+'px'});document.body.append(s);s.animate([{transform:'translate(0,0)',opacity:1},{transform:`translate(${(Math.random()-.5)*120}px,${-60-Math.random()*90}px)`,opacity:0}],{duration:900}).onfinish=()=>s.remove()}};
// about
$('#learn').onclick=function(){const m=$('#more');const o=m.classList.toggle('open');this.textContent=o?'Show Less ↑':'Learn More →'};
// skills
const bar=$('#bar'),st=$('#skillTxt');
function pick(b){$$('.sk').forEach(x=>x.setAttribute('aria-pressed',x===b));bar.style.width=b.dataset.l+'%';st.textContent=b.textContent+' · '+b.dataset.l+'% — '+b.dataset.t}
$$('.sk').forEach(b=>b.onclick=()=>pick(b));
setTimeout(()=>pick($('.sk')),400);
// works: joined jigsaw -> click breaks it -> categories -> designs
const WORKS=window.WORKS||[],SITE=window.SITE||{};
const dlg=$('#dlg');
function openWork(w){const t=$('#dtop');t.innerHTML='';const i=document.createElement('img');i.src=w.img;i.alt=w.title;t.append(i);t.scrollTop=0;$('#dt').textContent=w.title;$('#dd').textContent=w.desc+(w.category?' ('+w.category+')':'');dlg.showModal()}
function mkCard(w){const b=document.createElement('button');b.className='card';b.setAttribute('aria-label','Open '+w.title);
 const im=document.createElement('img');im.src=w.img;im.alt=w.title;im.loading='lazy';
 if(w.crop==='contain')im.style.objectFit='contain';else if(w.crop)im.style.objectPosition=w.crop;if(w.bg)b.style.background=w.bg;
 const cap=document.createElement('span');cap.className='cap';cap.textContent=w.title;b.append(im,cap);b.onclick=()=>openWork(w);return b}
const groups=[];WORKS.forEach(w=>{const c=w.category||'Other';let g=groups.find(x=>x.name===c);if(!g)groups.push(g={name:c,items:[]});g.items.push(w)});
const rnd=(a,b)=>a+Math.random()*(b-a);
const NS='http://www.w3.org/2000/svg',PW=1200,PH=900,COLS=8,ROWS=6;
const holder=$('#bigholder'),bigEl=$('#bigpz'),views=$('#views'),vbody=$('#vbody'),vtitle=$('#vtitle'),vback=$('#vback');
let pieces=[],svg=null,state='whole';
const loadImg=src=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.onerror=()=>r(null);i.src=src});
// the picture the puzzle is cut from: a collage of all my work (or my logo), drawn in SVG (no canvas, so it also works from a file on your computer)
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;');
function pictureSVG(){
 if(SITE.puzzle==='logo'&&SITE.logoImage)return '<rect width="'+PW+'" height="'+PH+'" fill="#E3D2E8"/><image href="'+esc(SITE.logoImage)+'" width="'+PW+'" height="'+PH+'" preserveAspectRatio="xMidYMid meet"/>';
 const n=WORKS.length,gc=Math.ceil(Math.sqrt(n*4/3)),gr=Math.ceil(n/gc),cw=PW/gc,ch=PH/gr;let o='<rect width="'+PW+'" height="'+PH+'" fill="#fff"/>';
 for(let i=0;i<gc*gr;i++){const w=WORKS[i%n],x=(i%gc)*cw,y=Math.floor(i/gc)*ch,par=w.crop==='contain'?'xMidYMid meet':(w.crop==='top'?'xMidYMin slice':'xMidYMid slice');
  o+='<clipPath id="pzcell'+i+'"><rect x="'+x+'" y="'+y+'" width="'+cw+'" height="'+ch+'"/></clipPath><g clip-path="url(#pzcell'+i+')">'+(w.crop==='contain'?'<rect x="'+x+'" y="'+y+'" width="'+cw+'" height="'+ch+'" fill="'+esc(w.bg||'#fff')+'"/>':'')+'<image href="'+esc(w.img)+'" x="'+x+'" y="'+y+'" width="'+cw+'" height="'+ch+'" preserveAspectRatio="'+par+'"/></g>'}
 return o}
// jigsaw edge with a tab (P = direction the tab pokes, null = flat border)
function edge(p0,p1,P){const e=n=>n.toFixed(1);if(!P)return 'L'+e(p1[0])+' '+e(p1[1]);
 const dx=p1[0]-p0[0],dy=p1[1]-p0[1],L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L;
 const f=(a,b)=>e(p0[0]+ux*a*L+P[0]*b*L)+' '+e(p0[1]+uy*a*L+P[1]*b*L);
 return 'L'+f(.36,0)+' C'+f(.36,0)+' '+f(.43,.04)+' '+f(.38,.09)+' C'+f(.33,.15)+' '+f(.40,.23)+' '+f(.50,.23)+' C'+f(.60,.23)+' '+f(.67,.15)+' '+f(.62,.09)+' C'+f(.57,.04)+' '+f(.64,0)+' '+f(.64,0)+' L'+e(p1[0])+' '+e(p1[1])}
function buildSvg(url){
 const cw=PW/COLS,ch=PH/ROWS,hT=[],vT=[];
 for(let r=0;r<=ROWS;r++){hT[r]=[];for(let c=0;c<COLS;c++)hT[r][c]=(r===0||r===ROWS)?0:(Math.random()<.5?1:-1)}
 for(let r=0;r<ROWS;r++){vT[r]=[];for(let c=0;c<=COLS;c++)vT[r][c]=(c===0||c===COLS)?0:(Math.random()<.5?1:-1)}
 svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 '+PW+' '+PH);svg.setAttribute('class','pzsvg');svg.setAttribute('role','img');svg.setAttribute('aria-label','Jigsaw puzzle made from my work');
 svg.innerHTML='<defs><g id="pzpic">'+pictureSVG()+'</g></defs>';
 for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){
  const x0=c*cw,y0=r*ch,x1=x0+cw,y1=y0+ch,t=hT[r][c],rt=vT[r][c+1],b=hT[r+1][c],l=vT[r][c];
  const d='M'+x0+' '+y0+' '+edge([x0,y0],[x1,y0],t?[0,t]:null)+' '+edge([x1,y0],[x1,y1],rt?[rt,0]:null)+' '+edge([x1,y1],[x0,y1],b?[0,b]:null)+' '+edge([x0,y1],[x0,y0],l?[l,0]:null)+' Z';
  const g=document.createElementNS(NS,'g'),id='pzc'+r+'_'+c;g.setAttribute('class','pc');
  g.innerHTML='<clipPath id="'+id+'"><path d="'+d+'"/></clipPath><g clip-path="url(#'+id+')"><use href="#pzpic"/></g><path class="pcl" d="'+d+'"/>';
  const cx=x0+cw/2,cy=y0+ch/2;g.style.transformOrigin=cx+'px '+cy+'px';svg.append(g);pieces.push({el:g,cx,cy})}
 holder.append(svg);scatter(PW/2,PH/2,true)}
// pieces fly away from (px,py), or snap back when assembling
function scatter(px,py,instant){pieces.forEach(p=>{const dx=p.cx-px,dy=p.cy-py,d=Math.hypot(dx,dy)||1,k=rnd(.8,1.8);
 p.el.style.transition=instant?'none':'transform '+rnd(.9,1.3).toFixed(2)+'s cubic-bezier(.3,.1,.5,1) '+(d/1300*.3).toFixed(2)+'s,opacity .7s ease-in '+(.55+d/1300*.3).toFixed(2)+'s';
 p.el.style.transform='translate('+(dx/d*rnd(250,700)*k+rnd(-80,80)).toFixed(0)+'px,'+(dy/d*rnd(250,700)*k+rnd(150,600)).toFixed(0)+'px) rotate('+rnd(-220,220).toFixed(0)+'deg)';p.el.style.opacity=0})}
function assemble(){state='joining';scatter(PW/2,PH/2,true);void svg.getBoundingClientRect();
 pieces.forEach(p=>{p.el.style.transition='transform 1s cubic-bezier(.2,.9,.3,1.15) '+(Math.random()*.7).toFixed(2)+'s,opacity .4s ease-out '+(Math.random()*.5).toFixed(2)+'s';p.el.style.transform='none';p.el.style.opacity=1});
 setTimeout(()=>{state='whole';pieces.forEach(p=>p.el.style.transition='transform .25s ease')},2000)}
// click: cracks appear, the puzzle shakes, then breaks apart
function breakPuzzle(ev){if(state!=='whole'||!svg)return;state='breaking';
 const r=svg.getBoundingClientRect(),px=ev&&ev.clientX?(ev.clientX-r.left)/r.width*PW:PW/2,py=ev&&ev.clientX?(ev.clientY-r.top)/r.height*PH:PH/2;
 pieces.forEach(p=>p.el.style.transform='none');
 const cr=document.createElementNS(NS,'g');cr.setAttribute('class','cracks');
 for(let k=0;k<7;k++){let x=px,y=py,a=rnd(0,6.28),d='M'+x.toFixed(0)+' '+y.toFixed(0);for(let s=0;s<6;s++){a+=rnd(-.6,.6);const l=rnd(40,110);x+=Math.cos(a)*l;y+=Math.sin(a)*l;d+=' L'+x.toFixed(0)+' '+y.toFixed(0)}
  const p=document.createElementNS(NS,'path');p.setAttribute('d',d);cr.append(p)}
 svg.append(cr);bigEl.classList.add('shake');
 setTimeout(()=>{bigEl.classList.remove('shake');cr.remove();scatter(px,py)},450);
 setTimeout(()=>{state='broken';bigEl.hidden=true;views.hidden=false;showCats();views.scrollIntoView({behavior:'smooth',block:'start'})},1900)}
// hovering lifts the pieces near the cursor
bigEl.addEventListener('pointermove',e=>{if(state!=='whole'||!svg)return;const r=svg.getBoundingClientRect(),px=(e.clientX-r.left)/r.width*PW,py=(e.clientY-r.top)/r.height*PH;
 pieces.forEach(p=>{const dx=p.cx-px,dy=p.cy-py,d=Math.hypot(dx,dy);p.el.style.transform=d<190?'translate('+((dx/d*8)||0).toFixed(1)+'px,'+((dy/d*8)||0).toFixed(1)+'px) scale('+(1+(1-d/190)*.07).toFixed(3)+')':'none'})});
bigEl.addEventListener('pointerleave',()=>{if(state==='whole')pieces.forEach(p=>p.el.style.transform='none')});
bigEl.onclick=breakPuzzle;
// categories, then designs
function showCats(){vtitle.textContent='Pick a category';vback.hidden=true;vbody.innerHTML='';
 const wrap=document.createElement('div');wrap.className='cats';
 groups.forEach((g,i)=>{const n=g.items.length,b=document.createElement('button');b.className='cat';b.style.setProperty('--i',i);b.style.setProperty('--r',rnd(-25,25).toFixed(0)+'deg');b.setAttribute('aria-label','Open '+g.name);
  const th=document.createElement('div');th.className='cthumb';
  for(let k=0;k<4;k++){const w=g.items[k%n],d=document.createElement('div');d.style.backgroundImage='url("'+w.img+'")';if(w.crop==='contain'){d.style.backgroundSize='contain';d.style.backgroundColor=w.bg||'#fff'}else if(w.crop==='top')d.style.backgroundPosition='top';th.append(d)}
  const info=document.createElement('div');info.className='catinfo';info.innerHTML='<b></b><span></span>';
  info.firstChild.textContent=g.name;info.lastChild.textContent=n+(n===1?' design':' designs')+' · View ▸';b.append(th,info);b.onclick=()=>showCat(g);wrap.append(b)});
 vbody.append(wrap)}
function showCat(g){vtitle.textContent=g.name;vback.hidden=false;vbody.innerHTML='';
 const gr=document.createElement('div');gr.className='ggrid';g.items.forEach((w,i)=>{const c=mkCard(w);c.style.setProperty('--i',i);gr.append(c)});vbody.append(gr)}
vback.onclick=showCats;
$('#rebuild').onclick=()=>{views.hidden=true;bigEl.hidden=false;assemble();bigEl.scrollIntoView({behavior:'smooth',block:'center'})};
$('#close').onclick=()=>dlg.close();$('#dgo').onclick=()=>dlg.close();
dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
(function(){
 if(!WORKS.length){bigEl.hidden=true;$('#portfolio').insertAdjacentHTML('beforeend','<p class="empty">New work is coming soon.</p>');return}
 let started=false;const go=()=>{if(!started){started=true;assemble()}};
 try{buildSvg();new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){o.disconnect();go()}},{threshold:.2}).observe(holder);setTimeout(go,6000)}
 catch(e){bigEl.hidden=true;views.hidden=false;showCats()}})();
// form
async function sendForm(){
 const n=$('#n').value.trim(),m=$('#m').value.trim(),em=$('#e').value.trim(),okE=/^\S+@\S+\.\S+$/.test(em);
 $('#en').textContent=n?'':'Enter your name.';$('#ee').textContent=okE?'':'Enter a valid email address.';$('#em').textContent=m.length>9?'':'Write at least 10 characters.';
 if(!n||!okE||m.length<10)return;
 if(SITE.formEndpoint){try{const r=await fetch(SITE.formEndpoint,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({name:n,email:em,message:m})});if(r.ok){$$('#form input,#form textarea').forEach(i=>i.value='');return toast('Thank you '+n+'! Your message has been sent.')}}catch(x){}}
 if(SITE.email){location.href='mailto:'+SITE.email+'?subject='+encodeURIComponent('Project enquiry from '+n)+'&body='+encodeURIComponent(m+'\n\nFrom: '+n+' ('+em+')');return toast('Opening your email app...')}
 toast('The contact form is not connected yet.')}
$('#send').onclick=sendForm;
$$('#form input').forEach(i=>i.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();sendForm()}}));
