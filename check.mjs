import { chromium } from '@playwright/test';
const browser = await chromium.launch({headless:true});
const page = await browser.newPage();
const errors=[]; page.on('pageerror',e=>errors.push(e.message));
for (const width of [1440,1024,900,768,600,390,375,320,280]) {
 await page.setViewportSize({width,height:950});
 await page.goto('http://localhost:5173/',{waitUntil:'networkidle'}); await page.evaluate(()=>document.fonts.ready);
 await page.locator('.footer').scrollIntoViewIfNeeded(); await page.evaluate(()=>window.scrollTo(0,0));
 const state=await page.evaluate(()=>({width:innerWidth, doc:document.documentElement.scrollWidth, broken:[...document.images].filter(i=>!i.complete || !i.naturalWidth).map(i=>i.src),overflow:[...document.querySelectorAll('*')].filter(e=>e.getBoundingClientRect().right>innerWidth+1).map(e=>e.className)}));
 console.log(width,JSON.stringify(state));
 if ([1440,768,390,320].includes(width)) await page.screenshot({path:`/home/user/checks/${width}.png`,fullPage:true});
}
await page.setViewportSize({width:390,height:850}); await page.goto('http://localhost:5173/',{waitUntil:'networkidle'});
await page.getByRole('button',{name:'Открыть меню'}).click();
await page.getByRole('button',{name:'Часто задаваемые вопросы',exact:true}).click();
console.log('menu closed',await page.locator('.menu-toggle').getAttribute('aria-expanded'));
await page.locator('.q summary').first().click(); console.log('FAQ opens',await page.locator('.q').first().getAttribute('open'));
await page.locator('#contact-name').fill('Иван'); await page.locator('#contact-phone').fill('+7 900 000 00 00'); await page.getByRole('button',{name:'Отправить заявку'}).click();console.log('form',await page.locator('.form-status').textContent());
await page.goto('http://localhost:5173/news'); await page.locator('.news-item .btn').first().click();console.log('news URL',page.url());
await page.getByRole('button',{name:'Открыть меню'}).click(); await page.getByRole('button',{name:'Направления олимпиады',exact:true}).click(); await page.waitForURL('**/#directions'); console.log('cross page nav',page.url());
console.log('errors',errors);
await browser.close();
