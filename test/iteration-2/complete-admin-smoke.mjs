import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const dir='test/iteration-2/evidence';
const b=await chromium.launch({channel:'msedge',headless:true});
const p=await b.newPage({viewport:{width:1440,height:1050}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
const checks=[];
for(const route of ['/admin','/admin/quotation','/admin/clients','/admin/products','/admin/invoices']){
 const before=errors.length;const r=await p.goto('http://localhost:3000'+route);await p.waitForTimeout(700);
 const content=(await p.locator('body').innerText()).length>50;
 await p.screenshot({path:`${dir}/TC-016-${route.split('/').at(-1)}.png`,fullPage:true});
 checks.push({route,status:r.status(),content,errors:errors.slice(before)});
}
await fs.writeFile(`${dir}/admin-smoke.json`,JSON.stringify(checks,null,2));
const meta=JSON.parse(await fs.readFile(`${dir}/results.json`,'utf8'));
const row=meta.results.find(r=>r.id==='TC-016');
row.status=checks.every(c=>c.status===200&&c.content&&c.errors.length===0)?'Pass':'Fail';
row.actual='All five admin routes returned HTTP 200 and rendered content. /admin/quotation raised React #418 hydration error. Other four routes produced no page runtime error.';
row.evidence='admin-smoke.json; TC-016-quotation.png';
meta.adminCompletedAt=new Date().toISOString();
await fs.writeFile(`${dir}/results.json`,JSON.stringify(meta,null,2));
await b.close();console.log(JSON.stringify(checks));
