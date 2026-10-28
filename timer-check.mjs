import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const b=await chromium.launch();
for (const [now, expected] of [
 ['2026-10-23T00:00:00+05:00','9 дней, 0 часов, 0 минут'],
 ['2026-10-31T23:59:00+05:00','0 дней, 0 часов, 1 минут'],
 ['2026-11-01T00:00:00+05:00','0 дней, 0 часов, 0 минут'],
 ['2026-11-02T00:00:00+05:00','0 дней, 0 часов, 0 минут']
]) {
 const p=await b.newPage();await p.clock.install({time:new Date(now)}); await p.clock.pauseAt(new Date(now));
 await p.goto('http://localhost:5173/',{waitUntil:'networkidle'});
 const text=await p.locator('.count').textContent(); assert.ok(text.includes(expected),text); console.log(now,text); await p.close();
}
await b.close();
