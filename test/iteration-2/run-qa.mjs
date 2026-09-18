import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
const dir='test/iteration-2/evidence';
await fs.mkdir(dir,{recursive:true});
const base=process.env.QA_URL || 'http://localhost:3000';
const browser=await chromium.launch({channel:'msedge',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1050},acceptDownloads:true});
await context.tracing.start({screenshots:true,snapshots:true,sources:true});
const page=await context.newPage();
page.setDefaultTimeout(12000);
const logs=[]; const results=[];
page.on('console',m=>{if(m.type()==='error')logs.push({kind:'console',text:m.text(),url:page.url()});});
page.on('pageerror',e=>logs.push({kind:'pageerror',text:e.message,url:page.url()}));
const future=new Date(Date.now()+10*86400000).toISOString().slice(0,10);
const past=new Date(Date.now()-10*86400000).toISOString().slice(0,10);
const data={guest:'QA Iteration Two Guest',contact:'+639123456789',pax:2,date:future,total:3900};
class ProductFailure extends Error {}
function check(condition,message){if(!condition)throw new ProductFailure(message);}
async function shot(id){await page.screenshot({path:`${dir}/${id}.png`,fullPage:true});}
async function run(id,title,type,uc,steps,expected,fn){
 const start=Date.now();let status='Pass',actual='';
 try{actual=await fn();}catch(e){status=e instanceof ProductFailure?'Fail':'Blocked';actual=e.message;}
 await shot(id).catch(()=>{});
 const result={id,title,type,uc,steps,expected,status,actual,evidence:`${id}.png`,durationMs:Date.now()-start};
 results.push(result);console.log(id,status,actual);
 await fs.writeFile(`${dir}/results.partial.json`,JSON.stringify(results,null,2));
}
async function fillBooking(date=future){
 const f=page.locator('#booking-form');
 await f.locator('input[type=text]').fill(data.guest);
 await f.locator('input[type=number]').fill('2');
 await f.locator('input[type=date]').fill(date);
 await f.locator('input[type=tel]').fill(data.contact);
 await f.locator('input[type=checkbox]').nth(0).check();
 await f.locator('input[type=checkbox]').nth(1).check();
}
async function fillCard(values=['QA Guest','4242 4242 4242 4242','12/30','123']){
 const inputs=page.locator('form input[type=text]');
 for(let i=0;i<values.length;i++)await inputs.nth(i).fill(values[i]);
}
await run('TC-001','Browse tour packages','Regression','UC-001','Open home and inspect tour cards.','Tour A, Tour B and Tour C are visible.',async()=>{
 await page.goto(base);await page.getByText('Dev Status:',{exact:false}).waitFor();
 for(const name of ['Tour A','Tour B','Tour C'])check(await page.locator('article').filter({hasText:name}).count()>0,`${name} missing`);
 return 'Home page displayed three tour cards.';
});
await run('TC-002','Sign-in prompt before booking','Regression','UC-001','Click Tour A while logged out.','Authentication modal opens.',async()=>{
 await page.locator('article').filter({hasText:'Tour A'}).first().click();
 await page.getByRole('heading',{name:'Welcome back'}).waitFor();
 return 'Clicking Tour A opened the sign-in modal.';
});
await run('TC-003','Simulated account creation','Regression','UC-001','Switch to signup, enter QA name/email/password, submit.','Booking modal opens.',async()=>{
 await page.getByRole('button',{name:'Create an account',exact:true}).click();
 await page.locator('form input[type=text]').fill(data.guest);
 await page.locator('form input[type=email]').fill('qa.iteration2@example.com');
 await page.locator('form input[type=password]').fill('QaTestOnly123!');
 await page.getByRole('button',{name:'Sign Up & Book',exact:true}).click();
 await page.locator('#booking-form').waitFor();return 'Simulated signup opened the booking form.';
});
await run('TC-005','Calculate booking total','Regression','UC-001','Set two guests and enable both add-ons.','Total equals PHP 3,900.',async()=>{
 await fillBooking();check(await page.getByText('₱3,900',{exact:true}).count()>0,'Expected PHP 3,900 absent');
 return 'Two guests plus ETDF and lagoon add-ons displayed PHP 3,900.';
});
await run('TC-004','Submit selected booking','Regression','UC-001','Submit the future-dated booking.','Navigate to checkout.',async()=>{
 await page.getByRole('button',{name:'Confirm & Pay',exact:true}).click();await page.waitForURL('**/checkout');
 return `Booking for ${future} redirected to checkout.`;
});
await run('TC-010','Booking details reach checkout','New functional','UC-003','Compare checkout with the preceding two-guest booking.','Guest count, date and contact match entered data.',async()=>{
 const text=await page.locator('main').innerText();
 check(text.includes('2 Pax')&&text.includes(future)&&text.includes(data.contact),`Checkout shows 1 Pax and Pending Confirmation; entered 2 guests, ${future}, ${data.contact}. Contact is absent.`);
 return 'Checkout details match.';
});
await run('TC-011','Checkout total preserves add-ons','New functional','UC-003','Compare checkout total against PHP 3,900 booking.','Checkout total is PHP 3,900.',async()=>{
 const text=await page.locator('main').innerText();check(text.includes('3,900'),'Checkout and Pay button show PHP 1,350, while booked total was PHP 3,900.');return 'Total matches.';
});
await run('TC-006','Simulated checkout payment','Regression','UC-002','Fill normal-format card details and click Pay.','Processing and success notifications, then dashboard.',async()=>{
 await fillCard();await page.getByRole('button',{name:'Pay ₱1,350.00',exact:true}).click();
 await page.getByText('Processing payment securely via Paymongo...', {exact:true}).waitFor();
 await page.waitForURL('**/dashboard');return 'Simulated processing redirected to dashboard. No real payment was attempted.';
});
await run('TC-007','Display booking and invoice','Regression','UC-002','Inspect dashboard status and invoice.','Confirmed status, reference, guest details and itinerary appear.',async()=>{
 await page.getByText('CONFIRMED & PAID',{exact:true}).waitFor();
 check(await page.getByText('Invoice & Itinerary Details',{exact:true}).isVisible(),'Invoice details absent');
 return 'Dashboard displays confirmed status, reference and sample invoice details; this legacy case checks presence only.';
});
await run('TC-012','Dashboard matches actual booking','New functional','UC-003','Compare dashboard with entered booking.','Name, contact, guest count, date and total match.',async()=>{
 const text=await page.locator('main').innerText();check(text.includes(data.guest)&&text.includes('3,900')&&text.includes(future),'Dashboard shows Juan Dela Cruz, 1 Guest, Pending Confirmation and PHP 1,350 instead of the QA booking.');return 'Dashboard matches.';
});
let downloaded=false;
await run('TC-008R','Download and open invoice PDF','Retest','UC-002','Click Download PDF Invoice and wait for file.','A readable PDF downloads.',async()=>{
 const wait=page.waitForEvent('download',{timeout:10000}).catch(()=>null);
 await page.getByRole('button',{name:'Download PDF Invoice',exact:true}).click();
 const file=await wait;
 if(!file){const err=logs.filter(l=>l.text.includes('color function')).at(-1);throw new ProductFailure('No PDF downloaded. '+(err?.text||'See console log.'));}
 await file.saveAs(`${dir}/downloaded-invoice.pdf`);downloaded=true;
 return 'PDF downloaded; content inspection required.';
});
if(!downloaded)results.push({id:'TC-009',title:'PDF contents match displayed invoice',type:'New functional',uc:'UC-002',steps:'Open downloaded PDF and compare fields.',expected:'PDF contents match the on-screen invoice.',status:'Blocked',actual:'TC-008R produced no PDF, so content comparison could not execute.',evidence:'TC-008R.png'});
await run('TC-013','Reject empty card fields','Negative','UC-002','Open checkout and click Pay with all card fields empty.','Stay on checkout with required-field validation.',async()=>{
 await page.goto(base+'/checkout');await page.getByRole('button',{name:'Pay ₱1,350.00',exact:true}).click();
 await page.waitForTimeout(3000);
 const invalid=await page.locator('form input:invalid').count();check(page.url().endsWith('/checkout')&&invalid===4,'Empty form was not rejected.');
 return 'Browser rejected submission: four required fields invalid; stayed on checkout.';
});
await run('TC-014','Reject invalid card formats','Negative','UC-002','Separately test card=abc, expiry=99/99, and CVC=abc, with remaining fields valid.','Each malformed input is rejected.',async()=>{
 const variants=[['card number',['QA Guest','abc','12/30','123']],['expiry',['QA Guest','4242 4242 4242 4242','99/99','123']],['CVC',['QA Guest','4242 4242 4242 4242','12/30','abc']]];
 const accepted=[];
 for(const [label,values] of variants){await page.goto(base+'/checkout');await fillCard(values);await shot('TC-014-'+label.replaceAll(' ','-')+'-input');await page.getByRole('button',{name:'Pay ₱1,350.00',exact:true}).click();await page.waitForTimeout(3200);if(page.url().endsWith('/dashboard'))accepted.push(label);}
 check(accepted.length===0,`Simulated payment accepted malformed ${accepted.join(', ')} and navigated to dashboard.`);return 'All invalid variants rejected.';
});
await run('TC-015','Reject a past tour date','Negative','UC-001','Open booking with Dev Status logged in, enter date ten days ago, submit.','Past date is rejected.',async()=>{
 await page.goto(base);await page.getByRole('button',{name:'Dev Status: LOGGED OUT',exact:true}).click();
 await page.locator('article').filter({hasText:'Tour A'}).first().click();await fillBooking(past);await shot('TC-015-input');
 await page.getByRole('button',{name:'Confirm & Pay',exact:true}).click();await page.waitForTimeout(600);
 check(!page.url().endsWith('/checkout'),`Booking accepted past date ${past} and navigated to checkout.`);return 'Past date rejected.';
});
await run('TC-016','Admin route smoke tests','New functional','UC-004','Open admin overview, quotation, clients, products and invoices.','Each returns HTTP 200, has visible content and no page runtime error.',async()=>{
 const checks=[];
 for(const route of ['/admin','/admin/quotation','/admin/clients','/admin/products','/admin/invoices']){
 const before=logs.length;const response=await page.goto(base+route);await page.waitForTimeout(350);
 const text=await page.locator('body').innerText(); const runtimeErrors=logs.slice(before).filter(l=>l.kind==='pageerror');
 await shot('TC-016-'+route.split('/').at(-1));checks.push({route,status:response.status(),content:text.length>50,errors:runtimeErrors});}
 await fs.writeFile(`${dir}/admin-smoke.json`,JSON.stringify(checks,null,2));
 check(checks.every(c=>c.status===200&&c.content&&c.errors.length===0),'Admin smoke check found runtime errors. See admin-smoke.json for all five routes.');
 return 'All five admin routes returned HTTP 200 with content and no runtime errors.';
});
await run('TC-017','Submit admin quotation and display record','New functional','UC-004','Enter a unique client and look for quotation submission/record creation.','Quotation submission creates an identifiable record.',async()=>{
 await page.goto(base+'/admin/quotation');const fields=page.locator('input[type=text]');await fields.first().fill('QA New Quotation Client');await shot('TC-017-filled');
 const buttons=await page.getByRole('button').allTextContents();
 const submit=page.getByRole('button',{name:/save|submit|create quotation/i});
 check(await submit.count()>0,'No quotation submit/save control exists. Page provides a live preview, simulated PDF and send actions, but no record creation. Requirement inferred from original deck; confirm agreed scope.');
 return 'Submission available.';
});
results.push({id:'TC-018',title:'Clean Windows dependency installation',type:'Setup',uc:'Setup',steps:'From no node_modules, run npm ci --no-audit --no-fund.',expected:'Install succeeds without force or source changes.',status:'Fail',actual:'npm ci exited 1 with EBADPLATFORM for @tailwindcss/oxide-linux-x64-gnu@4.3.3. npm ci --force was required to continue QA.',evidence:'clean-install.log'});
await fs.writeFile(`${dir}/console.json`,JSON.stringify(logs,null,2));
await context.tracing.stop({path:`${dir}/browser-trace.zip`});
const meta={executedAt:new Date().toISOString(),commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),node:process.version,browser:browser.version(),browserChannel:'msedge (Chromium)',platform:process.platform,baseUrl:base,data,workaround:'npm ci --force --no-audit --no-fund; production build with network access for Google Fonts',results:results.sort((a,b)=>parseInt(a.id.slice(3))-parseInt(b.id.slice(3)))};
await fs.writeFile(`${dir}/results.json`,JSON.stringify(meta,null,2));
await browser.close();
console.log('SUMMARY',results.reduce((a,r)=>(a[r.status]=(a[r.status]||0)+1,a),{}));
