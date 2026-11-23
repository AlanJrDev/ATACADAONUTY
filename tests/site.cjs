const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { metadata } = require('../scripts/prepare-site.cjs');
const root = path.resolve(__dirname, '../dist');

(async()=>{
  const pending=metadata({siteUrl:'',indexable:false,analyticsMeasurementId:'',searchConsoleVerification:''});
  assert.match(pending.head,/noindex/);
  assert.ok(!pending.head.includes('rel="canonical"'));
  assert.ok(!pending.head.includes('google-site-verification'));
  const ready=metadata({siteUrl:'https://nuty.example',indexable:true,analyticsMeasurementId:'G-TEST12345',searchConsoleVerification:'test-verification'});
  assert.match(ready.head,/href="https:\/\/nuty.example\/"/);
  assert.match(ready.sitemap,/<loc>https:\/\/nuty.example\/<\/loc>/);
  assert.match(ready.robots,/Sitemap: https:\/\/nuty.example\/sitemap.xml/);
  assert.throws(()=>metadata({siteUrl:'',indexable:true}),/domínio/i);
  assert.throws(()=>metadata({siteUrl:'https://nuty.example/?private=1'}),/origem/i);
  const url='https://nuty.test';
  const serve=page=>page.route(url+'/**',route=>{
    const name=new URL(route.request().url()).pathname;
    const file=path.join(root,name==='/'?'index.html':name);
    if(!file.startsWith(root)||!fs.existsSync(file))return route.fulfill({status:404,body:'Not found'});
    const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.ttf':'font/ttf'};
    return route.fulfill({contentType:mime[path.extname(file)]||'application/octet-stream',body:fs.readFileSync(file)});
  });
  const browser=await chromium.launch();
  try{
    const nojs=await browser.newPage({javaScriptEnabled:false});
    await serve(nojs);
    await nojs.goto(url);
    assert.equal(await nojs.locator('#products article').count(),12,'catalog must exist without JavaScript');
    assert.equal(await nojs.locator('h1').count(),1);
    assert.ok((await nojs.title()).includes('Açaí'));
    await nojs.close();
    const page=await browser.newPage({viewport:{width:320,height:900}});
    await serve(page);
    const errors=[],google=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('request',r=>{if(/google-analytics|googletagmanager/.test(r.url()))google.push(r.url())});
    await page.goto(url);
    for(const reducedMotion of ['no-preference','reduce']){
      await page.emulateMedia({reducedMotion});
      await page.reload();
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      assert.equal(await page.evaluate(()=>document.activeElement.id),'conteudo',`skip link moves focus: ${reducedMotion}`);
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(()=>document.activeElement.matches('.hero .actions a')),true,'next Tab bypasses the header');
    }
    await page.emulateMedia({reducedMotion:'no-preference'});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'320px layout fits');
    await page.locator('#menu').click();
    assert.equal(await page.locator('#menu').getAttribute('aria-expanded'),'true');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#menu').getAttribute('aria-expanded'),'false');
    assert.equal(await page.locator('dialog:not([aria-labelledby])').count(),0,'dialogs have accessible names');
    assert.equal(await page.locator('#analytics-consent').isVisible(),false,'no consent prompt for inactive analytics');
    for(const href of await page.locator('a[href^="#"]').evaluateAll(links=>links.map(a=>a.getAttribute('href')))){
      assert.equal(await page.locator(href).count(),1,`unique target for ${href}`);
    }
    for(const select of await page.locator('#products select').all()){
      const options=await select.locator('option').count();
      for(let i=0;i<options;i++){
        await select.selectOption(String(i));
        const image=select.locator('..').locator('img');
        if(await image.count()){
          await image.scrollIntoViewIfNeeded();
          await image.evaluate(img=>img.decode());
          assert.ok(await image.evaluate(img=>img.naturalWidth>0),'every catalog variant image exists');
        }
      }
    }
    if(process.env.ARTIFACT_DIR){
      await page.setViewportSize({width:1440,height:1000});
      await page.evaluate(()=>scrollTo(0,0));
      await page.screenshot({path:path.join(process.env.ARTIFACT_DIR,'delivery-desktop.png')});
      await page.setViewportSize({width:320,height:900});
      await page.screenshot({path:path.join(process.env.ARTIFACT_DIR,'delivery-mobile.png')});
    }
    await page.locator('[data-filter="acai"]').click();
    assert.equal(await page.locator('#products article').count(),5);
    await page.locator('[data-product="0"]').selectOption('1');
    assert.match(await page.locator('#products article img').first().getAttribute('alt'),/3,6 L/);
    await page.locator('[data-consult="0"]').click();
    assert.match(await page.locator('#interest').textContent(),/3,6 L/);
    await page.locator('#shop [data-unit="Ceilândia"]').click();
    assert.match(await page.locator('#contact-status a').getAttribute('href'),/instagram.com\/nuty.df/);
    await page.locator('#shop .close').click();
    assert.equal(google.length,0,'no Google requests without configured analytics');
    // Mock only a test configuration and the Google library; no data leaves the test.
    await page.route(/\/index\.html(?:\?.*)?$/,async route=>{
      let body=fs.readFileSync(path.join(root,'index.html'),'utf8');
      body=body.replace(/<script id="site-settings" type="application\/json">[\s\S]*?<\/script>/,
        `<script id="site-settings" type="application/json">${JSON.stringify({siteUrl:url,analyticsMeasurementId:'G-TEST12345'})}</script>`);
      await route.fulfill({contentType:'text/html',body});
    });
    await page.route('https://www.googletagmanager.com/**',route=>route.fulfill({contentType:'text/javascript',body:'/* Google library mocked for consent tests. */'}));
    await page.goto(url+'/index.html?email=private@example.com');
    assert.equal(await page.locator('#analytics-consent').isVisible(),true);
    assert.equal(google.length,0,'Google tag blocked before consent');
    await page.locator('[data-consent="denied"]').first().click();
    await page.reload();
    assert.equal(google.length,0,'denial persists and blocks Google tag');
    await page.locator('#privacy-settings').click();
    await page.locator('[data-consent="granted"]:visible').first().click();
    assert.equal(google.length,1,'one tag loaded only after consent');
    const commands=await page.evaluate(()=>window.dataLayer.map(command=>Array.from(command)));
    assert.ok(commands.some(c=>c[0]==='event'&&c[1]==='page_view'));
    assert.equal(commands.find(c=>c[0]==='consent'&&c[1]==='default')[2].ad_storage,'denied');
    assert.ok(!JSON.stringify(commands).includes('private@example.com'),'query data excluded from analytics');
    await page.locator('[data-filter="sorvete"]').click();
    assert.ok(await page.evaluate(()=>window.dataLayer.some(c=>c[0]==='event'&&c[1]==='product_filter')));
    await page.locator('#privacy-settings').click();
    await page.context().addCookies([{name:'_ga',value:'test-cookie',url},{name:'_ga_TEST12345',value:'test-session',url}]);
    await page.locator('[data-consent="denied"]:visible').first().click();
    await page.waitForLoadState();
    const count=google.length;
    await page.reload();
    assert.equal(google.length,count,'revocation stops subsequent Google loading');
    assert.equal(await page.evaluate(()=>document.cookie.includes('_ga')),false);
    assert.deepEqual(errors,[]);
    console.log('PASS SEO configuration, static catalog, 320px, filters, variants, contact flow, consent, revocation, event privacy and runtime checks');
  }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
