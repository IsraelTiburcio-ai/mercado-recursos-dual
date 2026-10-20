// Run with PLAYWRIGHT_MODULE pointing to an installed Playwright module.
import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true});
const sizes=[[375,812],[390,844],[820,1180],[1180,820],[1440,1000]];
await Promise.all(sizes.map(async([width,height],testIndex)=>{
 const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.BASE_URL||'http://localhost:4173');
 const check=async()=>{assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${width}`);for(const b of await page.locator('button:visible').all()){const box=await b.boundingBox();assert.ok(box.width>=44&&box.height>=44,`small button ${width}`)}};
 await check();await page.getByRole('button',{name:'Entrar al mercado'}).click();const started=Date.now();
 for(let i=0;i<6;i++){
  await check();
  const answer=await page.evaluate(()=>{
   const num=s=>parseFloat(s.replace(/[^\d.-]/g,''));const shadow=[...document.querySelectorAll('.resource small b')].map(x=>num(x.textContent));const tag=document.querySelector('#offer-tag').textContent;
   if(tag.includes('PROVEEDOR')){const r=document.querySelector('#question').textContent.includes(' A')?0:1;const vals=[...document.querySelectorAll('.trade strong')].map(x=>num(x.textContent));return vals[0]*shadow[r]>vals[1]?'✓ Comprar':'× Descartar'}
   if(tag.includes('NEGOCIACIÓN'))return document.querySelector('.trade strong').textContent;
   const buttons=[...document.querySelectorAll('.comparison button')];const nets=buttons.map((b,j)=>shadow[j]-num(b.querySelector('small').innerText.split('Costo:')[1]));return nets[0]>nets[1]?'Recurso A':'Recurso B';
  });
  await page.waitForTimeout(10000);
  await page.locator('#actions button').filter({hasText:answer}).click();await check();assert.ok((await page.locator('#feedback').innerText()).startsWith('✓'));
  await page.screenshot({path:`/var/folders/9m/nytmmft960lbhhc83zbd5v1w0000gn/T/opencode/mercado-${width}-${i}.png`});
  await page.locator('#next').click();
 }
 await check();assert.ok((await page.locator('#stats').innerText()).includes('6 / 6'));assert.deepEqual(errors,[]);console.log(`PASS ${width}×${height}: 6/6; duration ${((Date.now()-started)/1000).toFixed(1)}s; no overflow, touch targets ≥44px, no JS errors`);
 await page.getByRole('button',{name:'Volver a jugar'}).click();assert.ok(await page.locator('#game').isVisible());await page.close();
}));await browser.close();
