/* Basic consent mode: no Google library or requests before explicit permission.
   IDs and canonical origin are generated from content/site.json. */
(function(){
  const settings=JSON.parse(document.querySelector('#site-settings').textContent);
  const id=settings.analyticsMeasurementId;
  const dialog=document.querySelector('#privacy-dialog');
  const banner=document.querySelector('#analytics-consent');
  const key='nuty.analytics-consent.v1';
  const lifetime=180*24*60*60*1000;
  let enabled=false,started=false,choice=null;
  try{enabled=/^G-[A-Z0-9]+$/.test(id)&&new URL(settings.siteUrl).origin===location.origin}catch{}
  try{
    const saved=JSON.parse(localStorage.getItem(key));
    if(saved&&saved.expires>Date.now()&&['granted','denied'].includes(saved.value))choice=saved.value;
  }catch{}

  function describe(){
    document.querySelector('#analytics-status').textContent=!enabled?
      'A medição de audiência está desativada neste endereço.':
      choice==='granted'?'Você permitiu a medição de audiência. Pode revogar a qualquer momento.':
      choice==='denied'?'Você recusou a medição de audiência.':'A medição de audiência só começa se você permitir.';
    dialog.querySelector('.consent-actions').hidden=!enabled;
    banner.hidden=!enabled||choice!==null;
  }
  function clearAnalyticsCookies(){
    const domains=location.hostname.split('.');
    const names=document.cookie.split(';').map(c=>c.split('=')[0].trim()).filter(n=>/^_ga(?:_|$)/.test(n));
    for(const name of names){
      document.cookie=`${name}=; Max-Age=0; Path=/; SameSite=Lax`;
      for(let i=0;i<domains.length-1;i++)document.cookie=`${name}=; Max-Age=0; Path=/; Domain=.${domains.slice(i).join('.')}; SameSite=Lax`;
    }
  }
  function startAnalytics(){
    if(!enabled||choice!=='granted'||started)return;
    started=true;
    window['ga-disable-'+id]=false;
    window.dataLayer=window.dataLayer||[];
    window.gtag=function(){window.dataLayer.push(arguments)};
    gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    gtag('consent','update',{analytics_storage:'granted'});
    gtag('js',new Date());
    let referrer='';
    try{referrer=new URL(document.referrer).origin+'/'}catch{}
    gtag('config',id,{send_page_view:false,allow_google_signals:false,
      allow_ad_personalization_signals:false,cookie_expires:lifetime/1000,cookie_update:false,
      page_location:location.origin+location.pathname,page_referrer:referrer});
    gtag('event','page_view',{page_location:location.origin+location.pathname,page_referrer:referrer});
    const script=document.createElement('script');
    script.async=true;
    script.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(id);
    document.head.append(script);
  }
  function choose(value){
    choice=value;
    try{localStorage.setItem(key,JSON.stringify({value,expires:Date.now()+lifetime}))}catch{}
    describe();
    if(dialog.open)dialog.close();
    if(value==='granted')startAnalytics();
    else{
      window['ga-disable-'+id]=true;
      clearAnalyticsCookies();
      // Unload a previously permitted Google library, including its timers.
      if(started)location.reload();
    }
  }
  document.querySelectorAll('[data-consent]').forEach(button=>button.addEventListener('click',()=>choose(button.dataset.consent)));
  document.querySelectorAll('[data-open-privacy],#privacy-settings').forEach(button=>button.addEventListener('click',()=>{
    if(!dialog.open)dialog.showModal();
  }));
  window.addEventListener('storage',event=>{
    if(event.key===key)location.reload();
  });
  document.addEventListener('click',event=>{
    if(!enabled||choice!=='granted'||!started)return;
    const target=event.target.closest('button,a');
    if(!target)return;
    const filter=target.dataset.filter,product=target.dataset.consult,unit=target.dataset.unit;
    if(['all','acai','sorvete','picole','sobremesa'].includes(filter))gtag('event','product_filter',{category:filter});
    else if(product!==undefined&&/^\d+$/.test(product)&&Number(product)<12)gtag('event','product_interest',{product_index:Number(product)});
    else if(['Vicente Pires','Ceilândia'].includes(unit))gtag('event','store_select',{store_name:unit});
    else if(target.matches('a[href^="https://www.instagram.com/"]')){
      const destination=new URL(target.href);
      if(['/nuty.vicente/','/nuty.df/'].includes(destination.pathname))gtag('event','contact_click',{channel:'instagram',store_name:destination.pathname==='/nuty.df/'?'Ceilândia':'Vicente Pires'});
    }
  });
  describe();
  startAnalytics();
})();
