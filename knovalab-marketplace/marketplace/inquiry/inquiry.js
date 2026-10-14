/* Set INQUIRY_ENDPOINT to your backend URL (POST JSON). Until then, submission is refused — no fake success. */
const INQUIRY_ENDPOINT='';
(()=>{const app=document.getElementById('app'),P=new URLSearchParams(location.search),buy=P.get('buy');
let items=buy&&KV.prod(buy)?[{id:buy,size:P.get('size')||KV.prod(buy).variants[0].label,qty:1}]:KV.get().filter(i=>KV.prod(i.id));
const F=[['name','Full name*','text'],['company','Business / company name*','text'],['email','Work email*','email'],['phone','Phone with country code*','tel'],['location','City and state*','text'],['contact','Preferred contact method','text'],['timeline','Expected purchase timeline','text'],['application','Intended application','text']];
function draw(){if(!items.length){app.innerHTML='<div class="card ok"><p>No products selected.</p><a class="btn primary" href="../">Browse products</a></div>';return}
app.innerHTML=`<div class="iq-wrap"><form class="card" id="f" novalidate>${F.map(([n,l,t])=>`<div><label for="${n}">${l}</label><input id="${n}" name="${n}" type="${t}"><span class="err" data-e="${n}"></span></div>`).join('')}
<div class="full"><label for="install">Installation requirements</label><input id="install"></div><div class="full"><label for="msg">Additional questions or configuration requirements</label><textarea id="msg" rows="4"></textarea></div>
<div class="full chk"><input type="checkbox" id="consent"><label for="consent">I agree to Knovalab contacting me about this inquiry and storing my details for that purpose.*</label></div><span class="err full" data-e="consent"></span>
<span class="err full" id="top" role="alert"></span><button class="btn primary full" id="go">Submit Inquiry</button></form>
<aside class="card iq-items"><h3>Selected products</h3><div id="il"></div><p style="font-size:.8rem;margin-top:12px">${PRICE_NOTE}</p></aside></div>`;
const il=document.getElementById('il');items.forEach((i,n)=>{const p=KV.prod(i.id),r=document.createElement('div');r.className='irow';r.innerHTML=`<span>${p.name}<br><small style="color:#888">${i.size}</small></span><span><input type="number" min="1" value="${i.qty}" aria-label="Quantity"> <button type="button">Remove</button></span>`;
r.querySelector('input').onchange=e=>{i.qty=Math.max(1,parseInt(e.target.value)||1)};r.querySelector('button').onclick=()=>{items.splice(n,1);draw()};il.append(r)});
document.getElementById('f').onsubmit=submit}
let busy=false;
async function submit(e){e.preventDefault();if(busy)return;const g=id=>document.getElementById(id).value.trim(),errs={};
['name','company','email','phone','location'].forEach(k=>{if(!g(k))errs[k]='Required'});
if(g('email')&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(g('email')))errs.email='Enter a valid email';
if(g('phone')&&!/^\+\d[\d\s-]{7,}$/.test(g('phone')))errs.phone='Include country code, e.g. +91 98xxxxxx';
if(!document.getElementById('consent').checked)errs.consent='Consent is required';
document.querySelectorAll('[data-e]').forEach(s=>s.textContent=errs[s.dataset.e]||'');if(Object.keys(errs).length)return;
const ref='KVI-'+Date.now().toString(36).toUpperCase(),top=document.getElementById('top'),btn=document.getElementById('go');
const body={ref,submittedAt:new Date().toISOString(),customer:Object.fromEntries(F.map(([n])=>[n,g(n)])),installation:g('install'),message:g('msg'),
products:items.map(i=>({productId:i.id,name:KV.prod(i.id).name,size:i.size,quantity:i.qty}))};
if(!INQUIRY_ENDPOINT){top.textContent='Inquiry delivery is not connected yet. Your inquiry was NOT sent. Please email hello@knovalab.com or ask the site owner to set up the backend.';return}
busy=true;btn.disabled=true;btn.textContent='Sending…';top.textContent='';
try{const r=await fetch(INQUIRY_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok)throw 0;
if(!buy)KV.clear();
app.innerHTML=`<div class="card ok"><h2>Thank you for your inquiry.</h2><p>Our team will review your requirements and respond within 2 business hours during working hours. Requests received outside working hours will be handled as soon as possible.</p><p>Reference: <span class="ref">${ref}</span></p>${body.products.map(p=>`<div class="irow"><span>${p.name} — ${p.size}</span><b>× ${p.quantity}</b></div>`).join('')}<a class="btn primary" style="margin-top:20px" href="../">Back to marketplace</a></div>`}
catch(x){busy=false;btn.disabled=false;btn.textContent='Submit Inquiry';top.textContent='We could not send your inquiry. Please try again or email hello@knovalab.com.'}}
draw()})();
