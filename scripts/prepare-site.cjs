const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const json=value=>JSON.stringify(value).replace(/</g,'\\u003c');

function metadata(config){
  let siteUrl='';
  if(config.siteUrl){
    const parsed=new URL(config.siteUrl);
    if(parsed.protocol!=='https:'||parsed.username||parsed.password||parsed.pathname!=='/'||parsed.search||parsed.hash)
      throw new Error('siteUrl deve ser uma origem HTTPS, sem caminho, parâmetros ou credenciais.');
    siteUrl=parsed.origin+'/';
  }
  if(config.indexable&&!siteUrl)throw new Error('Confirme o domínio antes de liberar a indexação.');
  const measurementId=config.analyticsMeasurementId||'';
  if(measurementId&&!/^G-[A-Z0-9]+$/.test(measurementId))throw new Error('ID GA4 inválido: use o ID de medição G-… do fluxo Web.');
  const title='Atacadão da Nuty | Açaí e sorvetes no DF';
  const description='Açaís, sorvetes e sobremesas em Vicente Pires e Ceilândia, DF. Varejo, atacarejo e atacado, com self-service na unidade Vicente Pires. Consulte as lojas.';
  const tags=[
    `<title>${title}</title>`,
    `<meta name="description" content="${description}">`,
    `<meta name="robots" content="${config.indexable?'index,follow,max-image-preview:large':'noindex,follow'}">`,
    '<meta property="og:type" content="website">',
    '<meta property="og:locale" content="pt_BR">',
    '<meta property="og:site_name" content="Atacadão da Nuty">',
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${description}">`,
    '<meta name="twitter:card" content="summary">',
    `<meta name="twitter:title" content="${title}">`,
    `<meta name="twitter:description" content="${description}">`
  ];
  if(siteUrl){
    tags.push(`<link rel="canonical" href="${escape(siteUrl)}">`,
      `<meta property="og:url" content="${escape(siteUrl)}">`,
      `<meta property="og:image" content="${escape(siteUrl)}assets/favicon-512.png">`,
      '<meta property="og:image:alt" content="Marca Nuty">',
      `<meta name="twitter:image" content="${escape(siteUrl)}assets/favicon-512.png">`,
      `<script type="application/ld+json">${json({'@context':'https://schema.org','@graph':[
        {'@type':'WebSite','@id':siteUrl+'#website',url:siteUrl,name:'Atacadão da Nuty',inLanguage:'pt-BR',publisher:{'@id':siteUrl+'#organization'}},
        {'@type':'Organization','@id':siteUrl+'#organization',name:'Atacadão da Nuty',url:siteUrl,logo:siteUrl+'assets/favicon-512.png',sameAs:['https://www.instagram.com/nuty.vicente/','https://www.instagram.com/nuty.df/']}
      ]})}</script>`);
  }
  if(config.searchConsoleVerification)tags.push(`<meta name="google-site-verification" content="${escape(config.searchConsoleVerification)}">`);
  tags.push(`<script id="site-settings" type="application/json">${json({siteUrl,analyticsMeasurementId:measurementId})}</script>`);
  return {head:tags.join('\n'),
    robots:'User-agent: *\nAllow: /\n'+(siteUrl&&config.indexable?`\nSitemap: ${siteUrl}sitemap.xml\n`:''),
    sitemap:siteUrl&&config.indexable?`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escape(siteUrl)}</loc></url></urlset>\n`:null};
}

function renderProduct(p,i){
  const category={acai:'AÇAÍS & CUPUAÇU',sorvete:'SORVETES',picole:'PICOLÉS & SORVETINHOS',sobremesa:'SOBREMESAS'}[p.cat];
  const art=p.placeholder?`<div class="placeholder-art">${p.placeholder}</div><span class="pending">FOTO OFICIAL A INSERIR</span>`:
    `<img src="assets/p${p.v[0][1]}.webp" alt="${escape(p.n+' — '+p.v[0][0])}" loading="lazy" decoding="async">`;
  return `<article class="product"><div class="product-image"><span class="tag">${category}</span>${art}</div><h3>${escape(p.n)}</h3><p>${escape(p.sub)}</p><select aria-label="Opção de ${escape(p.n)}" data-product="${i}">${p.v.map((v,j)=>`<option value="${j}">${escape(v[0])}</option>`).join('')}</select><button class="consult" data-consult="${i}">Consultar na loja <span><svg class="ico arw" aria-hidden="true"><use href="#i-arrow-ur"/></svg></span></button></article>`;
}

function prepare(){
  const config=JSON.parse(fs.readFileSync(path.join(root,'content/site.json'),'utf8'));
  // Preview deploys may be crawled to read noindex, but must not be indexed.
  if(process.env.VERCEL_ENV&&process.env.VERCEL_ENV!=='production')config.indexable=false;
  const products=JSON.parse(fs.readFileSync(path.join(root,'content/products.json'),'utf8'));
  const result=metadata(config);
  const file=path.join(root,'dist/index.html');
  let html=fs.readFileSync(file,'utf8');
  html=html.replace(/<!-- seo:start -->[\s\S]*?<!-- seo:end -->/,()=>`<!-- seo:start -->\n${result.head}\n<!-- seo:end -->`);
  html=html.replace(/<!-- catalog:start -->[\s\S]*?<!-- catalog:end -->/,()=>`<!-- catalog:start -->${products.map(renderProduct).join('')}<!-- catalog:end -->`);
  html=html.replace(/<script id="product-data" type="application\/json">[\s\S]*?<\/script>/,()=>`<script id="product-data" type="application/json">${json(products)}</script>`);
  fs.writeFileSync(file,html);
  fs.writeFileSync(path.join(root,'dist/robots.txt'),result.robots);
  const sitemap=path.join(root,'dist/sitemap.xml');
  if(result.sitemap)fs.writeFileSync(sitemap,result.sitemap);
  else if(fs.existsSync(sitemap))fs.unlinkSync(sitemap);
  console.log(`HTML e catálogo preparados. Indexação: ${config.indexable?'liberada':'aguardando domínio e revisão final'}. GA4: ${config.analyticsMeasurementId?'configurado, sujeito a consentimento e domínio':'inativo, ID pendente'}.`);
}
module.exports={metadata,prepare};
if(require.main===module)prepare();
