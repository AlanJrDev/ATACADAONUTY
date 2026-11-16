const data=[
{n:'Açaí Nuty',cat:'acai',sub:'O clássico que combina com tudo.',v:[['1 L',15],['3,6 L',14],['5 L',17],['10 L',11]]},
{n:'Açaí Boozy',cat:'acai',sub:'Mais sabor para compartilhar.',v:[['5 L',19],['10 L',18]]},
{n:'Creme de cupuaçu',cat:'acai',sub:'Seu toque tropical favorito.',v:[['1 L',16],['5 L',20]]},
{n:'Açaí com paçoca',cat:'acai',sub:'Uma combinação irresistível.',v:[['1 L',12]]},
{n:'DUO açaí & cupuaçu',cat:'acai',sub:'Dois sabores, uma boa escolha.',v:[['Volume a confirmar',13]]},
{n:'Sorvete Boozy',cat:'sorvete',sub:'Potes de 1 litro. Escolha seu sabor.',v:[['Morango · 1 L',3],['Chocolate · 1 L',5],['Creme · 1 L',4],['Flocos · 1 L',8],['Napolitano · 1 L',7]]},
{n:'Pudim Boozy',cat:'sobremesa',sub:'Um final doce para qualquer momento.',v:[['Consulte a embalagem',2]]},
{n:'Petit gâteau',cat:'sobremesa',sub:'Sua pausa merece uma sobremesa.',v:[['120 g',6]]},
{n:'Sorvetinho Boozy',cat:'picole',sub:'A cremosidade do sorvete no seu dindim.',v:[['Coco',21],['Morango',23],['Leite condensado',22],['Chiclete',24],['Maracujá',25]]},
{n:'Sorvete trufado',cat:'sorvete',sub:'Linha prevista · sabores a confirmar.',v:[['1,8 L',null]],placeholder:'SORVETE<br>TRUFADO'},
{n:'Picolé de fruta',cat:'picole',sub:'À base de água · sabores a confirmar.',v:[['Consulte sabores',null]],placeholder:'PICOLÉS<br>DE FRUTA'},
{n:'Picolé à base de leite',cat:'picole',sub:'Linha prevista · sabores a confirmar.',v:[['Consulte sabores',null]],placeholder:'PICOLÉS<br>DE LEITE'}];
const products=document.querySelector('#products');function render(filter='all'){products.innerHTML=data.map((p,i)=>({p,i})).filter(({p})=>filter==='all'||p.cat===filter).map(({p,i})=>`<article class="product"><div class="product-image"><span class="tag">${p.cat==='acai'?'AÇAÍS & CUPUAÇU':p.cat==='sorvete'?'SORVETES':p.cat==='picole'?'PICOLÉS & SORVETINHOS':'SOBREMESAS'}</span>${p.placeholder?`<div class="placeholder-art">${p.placeholder}</div><span class="pending">FOTO OFICIAL A INSERIR</span>`:`<img src="assets/p${p.v[0][1]}.webp" alt="${p.n}" loading="lazy">`}</div><h3>${p.n}</h3><p>${p.sub}</p><select aria-label="Opção de ${p.n}" data-product="${i}">${p.v.map((v,j)=>`<option value="${j}">${v[0]}</option>`).join('')}</select><button class="consult" data-consult="${i}">Consultar na loja <span>↗</span></button></article>`).join('')};render();
document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',x===b)});render(b.dataset.filter)});products.addEventListener('change',e=>{if(!e.target.matches('select'))return;let p=data[e.target.dataset.product],img=e.target.closest('article').querySelector('img');if(img)img.src=`assets/p${p.v[e.target.value][1]}.webp`});
const shop=document.querySelector('#shop'),interest=document.querySelector('#interest'),status=document.querySelector('#contact-status');function openShop(text='Escolha a unidade para consultar produtos e condições.'){interest.textContent=text;status.textContent='';if(!shop.open)shop.showModal()}
document.querySelectorAll('[data-shop]').forEach(b=>b.onclick=()=>openShop(b.dataset.interest));products.addEventListener('click',e=>{let b=e.target.closest('[data-consult]');if(!b)return;let p=data[b.dataset.consult],v=b.closest('article').querySelector('select').value;openShop(`Tenho interesse em ${p.n} — ${p.v[v][0]}.`)});
document.querySelectorAll('[data-unit]').forEach(b=>b.onclick=()=>{if(!shop.open)openShop();const unit=b.dataset.unit,ig=unit==='Vicente Pires'?'nuty.vicente':'nuty.df';status.innerHTML=`<strong>${unit}</strong><br>O WhatsApp desta unidade ainda será cadastrado. Você pode acessar o perfil informado da loja:<br><a href="https://www.instagram.com/${ig}/" target="_blank" rel="noopener">@${ig} ↗</a>`});
document.querySelectorAll('dialog').forEach(d=>{d.querySelector('.close').onclick=()=>d.close();d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}})});document.querySelector('#review').onclick=()=>document.querySelector('#review-modal').showModal();document.querySelector('#motion').onclick=function(){const paused=document.body.classList.toggle('paused');this.setAttribute('aria-pressed',paused);this.setAttribute('aria-label',paused?'Retomar animação':'Pausar animação');this.innerHTML=paused?'▷ <span>Retomar movimento</span>':'Ⅱ <span>Pausar movimento</span>'};document.querySelector('#menu').onclick=function(){let open=document.querySelector('nav').classList.toggle('open');this.setAttribute('aria-expanded',open);this.textContent=open?'×':'☰'};document.querySelectorAll('nav a').forEach(a=>a.onclick=()=>{document.querySelector('nav').classList.remove('open');document.querySelector('#menu').setAttribute('aria-expanded','false');document.querySelector('#menu').textContent='☰'});

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
