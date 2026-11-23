const data=JSON.parse(document.querySelector('#product-data').textContent);
const products=document.querySelector('#products');function render(filter='all'){products.innerHTML=data.map((p,i)=>({p,i})).filter(({p})=>filter==='all'||p.cat===filter).map(({p,i})=>`<article class="product"><div class="product-image"><span class="tag">${p.cat==='acai'?'AÇAÍS & CUPUAÇU':p.cat==='sorvete'?'SORVETES':p.cat==='picole'?'PICOLÉS & SORVETINHOS':'SOBREMESAS'}</span>${p.placeholder?`<div class="placeholder-art">${p.placeholder}</div><span class="pending">FOTO OFICIAL A INSERIR</span>`:`<img src="assets/p${p.v[0][1]}.webp" alt="${p.n} — ${p.v[0][0]}" loading="lazy" decoding="async">`}</div><h3>${p.n}</h3><p>${p.sub}</p><select aria-label="Opção de ${p.n}" data-product="${i}">${p.v.map((v,j)=>`<option value="${j}">${v[0]}</option>`).join('')}</select><button class="consult" data-consult="${i}">Consultar na loja <span><svg class="ico arw" aria-hidden="true"><use href="#i-arrow-ur"/></svg></span></button></article>`).join('')};
document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',x===b)});render(b.dataset.filter)});products.addEventListener('change',e=>{if(!e.target.matches('select'))return;let p=data[e.target.dataset.product],img=e.target.closest('article').querySelector('img');if(img){img.src=`assets/p${p.v[e.target.value][1]}.webp`;img.alt=`${p.n} — ${p.v[e.target.value][0]}`}});
const shop=document.querySelector('#shop'),interest=document.querySelector('#interest'),status=document.querySelector('#contact-status');function openShop(text='Escolha a unidade para consultar produtos e condições.'){interest.textContent=text;status.textContent='';if(!shop.open)shop.showModal()}
document.querySelectorAll('[data-shop]').forEach(b=>b.onclick=()=>openShop(b.dataset.interest));products.addEventListener('click',e=>{let b=e.target.closest('[data-consult]');if(!b)return;let p=data[b.dataset.consult],v=b.closest('article').querySelector('select').value;openShop(`Tenho interesse em ${p.n} — ${p.v[v][0]}.`)});
document.querySelectorAll('[data-unit]').forEach(b=>b.onclick=()=>{if(!shop.open)openShop();const unit=b.dataset.unit,ig=unit==='Vicente Pires'?'nuty.vicente':'nuty.df';status.innerHTML=`<strong>${unit}</strong><br>O WhatsApp desta unidade ainda será cadastrado. Você pode acessar o perfil informado da loja:<br><a href="https://www.instagram.com/${ig}/" target="_blank" rel="noopener">@${ig} <svg class="ico arw" aria-hidden="true"><use href="#i-arrow-ur"/></svg></a>`});
document.querySelectorAll('dialog').forEach(d=>{d.querySelector('.close').onclick=()=>d.close();d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}})});document.querySelector('#review').onclick=()=>document.querySelector('#review-modal').showModal();document.querySelector('#motion').onclick=function(){const paused=document.body.classList.toggle('paused');this.setAttribute('aria-pressed',paused);this.setAttribute('aria-label',paused?'Retomar animação':'Pausar animação');this.querySelector('use').setAttribute('href',paused?'#i-play':'#i-pause');this.querySelector('span').textContent=paused?'Retomar movimento':'Pausar movimento'};const menuBtn=document.querySelector('#menu');function setMenu(open){document.querySelector('nav').classList.toggle('open',open);menuBtn.setAttribute('aria-expanded',open);menuBtn.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');menuBtn.querySelector('use').setAttribute('href',open?'#i-close':'#i-menu')}menuBtn.onclick=()=>setMenu(!document.querySelector('nav').classList.contains('open'));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.querySelector('nav').classList.contains('open')){setMenu(false);menuBtn.focus()}});document.querySelectorAll('nav a').forEach(a=>a.onclick=()=>setMenu(false));

document.querySelector('.skip-link').addEventListener('click',()=>document.querySelector('#conteudo').focus({preventScroll:true}));

/* ── Rolagem suave (Lenis) ────────────────────────────────────────────────
   Só ativa com movimento permitido; respeita prefers-reduced-motion e pausa
   enquanto um <dialog> modal está aberto. Âncoras usam o mesmo respiro do
   scroll-padding-top (95px). */
(function(){
  if(window.Lenis===undefined)return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;

  const lenis=new Lenis({lerp:.09,smoothWheel:true,wheelMultiplier:1,autoRaf:false});
  function raf(t){lenis.raf(t);requestAnimationFrame(raf)}
  requestAnimationFrame(raf);
  window.lenis=lenis;

  document.addEventListener('click',e=>{
    const a=e.target.closest('a[href^="#"]');
    if(!a)return;
    const id=a.getAttribute('href');
    if(!id||id.length<2)return;
    const el=document.querySelector(id);
    if(!el)return;
    e.preventDefault();
    lenis.scrollTo(el,{offset:-95});
  });

  const showModal=HTMLDialogElement.prototype.showModal;
  HTMLDialogElement.prototype.showModal=function(){showModal.call(this);lenis.stop()};
  const closeModal=HTMLDialogElement.prototype.close;
  HTMLDialogElement.prototype.close=function(){
    closeModal.call(this);
    if(!document.querySelector('dialog[open]'))lenis.start();
  };

  document.querySelector('#motion').addEventListener('click',()=>{
    document.body.classList.contains('paused')?lenis.stop():lenis.start();
  });
})();

/* Curved marquee: rebuild the baseline only on resize/font changes. Its
   geometry comes from the Hero's actual white edge in screen pixels, so
   responsive SVG scaling cannot change the normal distance to that edge. */
(function(){
  const strip=document.querySelector('.brand-strip');
  const svg=strip.querySelector('.brand-curve');
  const source=strip.querySelector('.brand-edge-source');
  const curve=strip.querySelector('#brand-curve');
  const text=strip.querySelector('text');
  const textPath=strip.querySelector('textPath');
  const wave=document.querySelector('.hero .wave');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer=matchMedia('(hover: hover) and (pointer: fine)');
  const phrase='AÇAÍ DE VERDADE  ✦  SABOR PARA COMPARTILHAR  ✦  DO VAREJO AO ATACADO  ✦  MANDA NUTY!  ✦  ';
  let period=1, offset=0, frame=0, previous=0, visible=false, hovered=false;

  function layout(){
    const rect=strip.getBoundingClientRect();
    const matrix=wave.getScreenCTM();
    if(!matrix||!rect.width)return;
    svg.setAttribute('viewBox',`0 0 ${rect.width} ${rect.height}`);
    // The closing vertical/horizontal segments belong to the fill, not the edge.
    source.setAttribute('d',wave.querySelector('path:last-child').getAttribute('d').replace(/V.*$/i,''));
    const length=source.getTotalLength();
    const points=[];
    const screenPoint=distance=>{
      const point=source.getPointAtLength(distance);
      return new DOMPoint(point.x,point.y).matrixTransform(matrix);
    };
    const samples=Math.max(360,Math.ceil(rect.width/2));
    for(let i=0;i<=samples;i++){
      const distance=length*i/samples;
      const point=screenPoint(distance);
      const before=screenPoint(Math.max(0,distance-.1));
      const after=screenPoint(Math.min(length,distance+.1));
      const dx=after.x-before.x,dy=after.y-before.y;
      const norm=Math.hypot(dx,dy);
      points.push({x:point.x-rect.left-dy/norm*22,y:point.y-rect.top+dx/norm*22});
    }
    // Extend beyond both masks so entering/leaving glyphs never pop at an edge.
    function extend(a,b){
      const dx=a.x-b.x,dy=a.y-b.y,norm=Math.hypot(dx,dy);
      return {x:a.x+dx/norm*100,y:a.y+dy/norm*100};
    }
    points.unshift(extend(points[0],points[1]));
    points.push(extend(points.at(-1),points.at(-2)));
    curve.setAttribute('d',points.map((p,i)=>`${i?'L':'M'}${p.x.toFixed(3)} ${p.y.toFixed(3)}`).join(' '));
    textPath.textContent=phrase;
    period=text.getComputedTextLength();
    if(!period)return;
    textPath.textContent=phrase.repeat(Math.ceil(curve.getTotalLength()*2/period)+2);
    offset%=period;
    textPath.setAttribute('startOffset',-offset);
    sync();
  }

  function tick(time){
    if(previous)offset=(offset+Math.min(time-previous,64)*.028)%period;
    previous=time;
    textPath.setAttribute('startOffset',-offset);
    frame=requestAnimationFrame(tick);
  }
  function sync(){
    const running=visible&&!document.hidden&&!reduced.matches&&!hovered&&
      !document.body.classList.contains('paused');
    if(running&&!frame){previous=0;frame=requestAnimationFrame(tick)}
    else if(!running&&frame){cancelAnimationFrame(frame);frame=0;previous=0}
  }
  new ResizeObserver(layout).observe(wave);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()}).observe(strip);
  new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});
  strip.addEventListener('mouseenter',()=>{hovered=finePointer.matches;sync()});
  strip.addEventListener('mouseleave',()=>{hovered=false;sync()});
  finePointer.addEventListener('change',()=>{hovered=false;sync()});
  reduced.addEventListener('change',sync);
  document.addEventListener('visibilitychange',sync);
  document.fonts.ready.then(layout);
  layout();
})();
