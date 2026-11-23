// Run with Node and Playwright installed, or set PLAYWRIGHT_MODULE to its path.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const path = require('node:path');

(async () => {
  const browser = await chromium.launch({headless:true});
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(pathToFileURL(path.resolve(__dirname, '../dist/index.html')).href);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('.brand-strip textPath').count(), 1, 'words must follow a curve');
    for (const width of [1440, 768, 390, 320, 1920]) {
      await page.setViewportSize({width,height:1000});
      await page.waitForTimeout(120);
      const geometry = await page.evaluate(() => {
        const strip = document.querySelector('.brand-strip');
        const curve = strip.querySelector('#brand-curve');
        const wave = document.querySelector('.wave');
        const source = strip.querySelector('.brand-edge-source');
        const sr = strip.getBoundingClientRect(), wr = wave.getBoundingClientRect();
        const matrix = wave.getScreenCTM();
        let maxError = 0;
        const length = source.getTotalLength();
        const curveLength = curve.getTotalLength();
        const rendered = Array.from({length:2501},(_,i)=>curve.getPointAtLength(curveLength*i/2500));
        for(let i=0; i<=20; i++) {
          const distance = length*i/20;
          const point = source.getPointAtLength(distance);
          const before = source.getPointAtLength(Math.max(0,distance-.1));
          const after = source.getPointAtLength(Math.min(length,distance+.1));
          const dx = (after.x-before.x)*matrix.a, dy=(after.y-before.y)*matrix.d;
          const norm = Math.hypot(dx,dy);
          const expected = {x:point.x*matrix.a+wr.left-sr.left-dy/norm*22,
            y:point.y*matrix.d+wr.top-sr.top+dx/norm*22};
          // Find the nearest point on the rendered, fixed baseline.
          let best=Infinity;
          for(const p of rendered) {
            best=Math.min(best,Math.hypot(p.x-expected.x,p.y-expected.y));
          }
          maxError=Math.max(maxError,best);
        }
        return {maxError,overflow:sr.width>innerWidth||sr.right>innerWidth,
          textLength:strip.querySelector('text').getComputedTextLength(),
          pathLength:curve.getTotalLength()};
      });
      assert.ok(geometry.maxError<1, `constant normal offset at ${width}px: ${geometry.maxError}`);
      assert.equal(geometry.overflow,false,`marquee stays inside viewport at ${width}px`);
      assert.ok(geometry.textLength>geometry.pathLength*2, 'enough repeated text for seamless wrap');
      console.log(`PASS geometry and coverage: ${width}px`);
    }
    await page.locator('.brand-strip').scrollIntoViewIfNeeded();
    await page.mouse.move(0,0);
    const sample = () => page.evaluate(() => ({
      d:document.querySelector('#brand-curve').getAttribute('d'),
      offset:document.querySelector('.brand-strip textPath').getAttribute('startOffset')
    }));
    const a=await sample(); await page.waitForTimeout(300); const b=await sample();
    assert.equal(a.d,b.d,'trajectory must stay fixed over time');
    assert.notEqual(a.offset,b.offset,'text must travel along the fixed trajectory');
    await page.locator('#motion').click();
    const c=await sample(); await page.waitForTimeout(200);
    assert.deepEqual(await sample(),c,'pause control freezes motion');
    await page.locator('#motion').click();
    await page.emulateMedia({reducedMotion:'reduce'});
    const d=await sample(); await page.waitForTimeout(200);
    assert.deepEqual(await sample(),d,'reduced motion freezes curved text');
    await page.emulateMedia({reducedMotion:'no-preference'});
    await page.locator('.brand-strip').scrollIntoViewIfNeeded();
    const e=await sample(); await page.waitForTimeout(200);
    assert.notEqual((await sample()).offset,e.offset,'motion resumes after preference change');
    await page.locator('.brand-curve').hover();
    const hovered=await sample(); await page.waitForTimeout(150);
    assert.deepEqual(await sample(),hovered,'desktop hover pauses text');
    await page.mouse.move(0,0);
    await page.locator('#lojas').scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);
    const offscreen=await sample(); await page.waitForTimeout(150);
    assert.deepEqual(await sample(),offscreen,'offscreen marquee stops');
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.reload();
    await page.evaluate(() => document.fonts.ready);
    await page.locator('.brand-strip').scrollIntoViewIfNeeded();
    const initialReduced=await sample(); await page.waitForTimeout(150);
    assert.deepEqual(await sample(),initialReduced,'initial reduced-motion preference stays static');
    assert.deepEqual(errors,[],'no runtime errors');
    console.log('PASS fixed trajectory, movement, pause, hover, offscreen, reduced-motion and runtime checks');
  } finally { await browser.close(); }
})().catch(error => {console.error(error);process.exitCode=1;});
