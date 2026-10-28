import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch();const page=await browser.newPage(); const errors=[];page.on('pageerror',e=>errors.push(e.message));
for(const width of [1920,1440,1024,768,390,320,280]) {
 await page.setViewportSize({width,height:1000}); await page.goto('http://localhost:5173/',{waitUntil:'networkidle'});
 await page.evaluate(()=>document.fonts.ready);
 const bounds=await page.evaluate(()=>({doc:document.documentElement.scrollWidth,w:innerWidth,blocks:[...document.querySelectorAll('.header,.black,.footer')].map(e=>{const r=e.getBoundingClientRect();return [e.className,r.left,r.right];})}));
 assert.equal(bounds.doc,width);for(const [name,left,right] of bounds.blocks){assert.equal(left,0,name);assert.equal(right,width,name);}
 assert.ok(await page.locator('.brand-logo').evaluate(e=>e.complete&&e.naturalWidth>0));
 if ([1440,390].includes(width)) await page.screenshot({path:`/home/user/checks/updated-${width}.png`,fullPage:true});
 console.log(width,'full bleed + logo + no overflow: OK');
}
await page.setViewportSize({width:1440,height:1000});await page.goto('http://localhost:5173/',{waitUntil:'networkidle'});
const d=page.locator('.dd').first(), summary=d.locator('summary');
const initial=await d.evaluate(e=>e.getBoundingClientRect().height);
await summary.click();await page.waitForTimeout(80);const middle=await d.evaluate(e=>e.getBoundingClientRect().height);
await page.waitForTimeout(400);const end=await d.evaluate(e=>e.getBoundingClientRect().height);
assert.ok(initial<middle && middle<end); console.log('opening animation',initial,middle,end);
await summary.click();await page.waitForTimeout(80);const closing=await d.evaluate(e=>e.getBoundingClientRect().height);assert.ok(closing>initial&&closing<end);
await page.waitForTimeout(400);assert.equal(await d.getAttribute('open'),null);assert.equal(await summary.getAttribute('aria-expanded'),'false');console.log('closing animation OK');
// Быстрое повторное переключение не оставляет фиксированную высоту.
await summary.click();await summary.click();await summary.click();await page.waitForTimeout(500);assert.equal(await summary.getAttribute('aria-expanded'),'true');assert.equal(await d.evaluate(e=>e.style.height),'');
await page.locator('.q summary').first().click();await page.waitForTimeout(400);assert.notEqual(await page.locator('.q').first().getAttribute('open'),null);
await page.setViewportSize({width:390,height:900});await page.getByRole('button',{name:'Открыть меню'}).click();await page.waitForTimeout(400);assert.ok(await page.locator('.nav').evaluate(e=>e.getBoundingClientRect().height>100));
await page.getByRole('button',{name:'Закрыть меню'}).click();await page.waitForTimeout(400);assert.equal(await page.locator('.nav').evaluate(e=>e.getBoundingClientRect().height),0);
await page.emulateMedia({reducedMotion:'reduce'});await summary.click();assert.equal(await d.getAttribute('data-animating'),null);console.log('FAQ, rapid clicks, mobile menu, reduced motion: OK');
assert.deepEqual(errors,[]);console.log('JS errors: none');await browser.close();
