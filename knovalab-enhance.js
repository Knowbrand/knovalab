/* Knovalab site enhancer — add ONE line before </body> on every page:  <script src="/knovalab-enhance.js"></script>
   1) ROUTES: edit page URLs here once.  2) IMAGES: paste real image URLs (null = generated placeholder).
   3) On the quote page it adds Signage / Menu / Hardware services with their extra questions. */
(()=>{
const ROUTES={home:'/',signage:'/OnPrem/',menus:'/menusystem/',web:'/websites/',portfolio:'/portfolio/',about:'/about/',blog:'/blogs/',services:'/services/',quote:'/quote/',market:'/marketplace/',mail:'mailto:business@knovalab.in'};
const IMAGES={projects:[null,null,null,null],cases:[null,null,null,null,null,null],posts:[null,null,null,null,null,null,null],team:[null,null,null]};
const R=ROUTES,P=location.pathname.toLowerCase(),PS=/onprem/.test(P)?'signage':/menusystem/.test(P)?'menus':/websites/.test(P)?'web':'';
const Q=s=>R.quote+(s?'?service='+s:'');
/* ---------- 1. LINKS ---------- */
const M=[[/^(explore (our )?solutions|view our solutions|solutions)$/i,'/#solutions'],
[/^(digital signage|on-prem signage|local media networks|explore digital signage)$/i,R.signage],
[/^(digital menus|smart menu boards|explore digital menus)$/i,R.menus],
[/^(web services|web presence|custom web development|explore web services)$/i,R.web],
[/^(portfolio.*|see our work|view our work|live preview|view project|view case study|partners)$/i,R.portfolio],
[/^about us$/i,R.about],[/^(insights|documentation|api reference|hardware guide)$/i,R.blog],[/^design engineering$/i,R.services],[/^hardware sourcing$/i,R.market],
[/^request a demo$/i,Q('signage')],
[/^(get started|start a project|start your project|schedule( a)? call|schedule an architecture review|discuss your requirement|talk to us|sales hotline|office location|request a quote|contact)$/i,Q(PS)]];
document.querySelectorAll('a').forEach(a=>{
 const raw=a.getAttribute('href')||'';
 if(a.closest('.post,.hero-card')||/^blog\//.test(raw)||/^see how it works$/i.test(a.textContent.trim()))return;
 const t=a.textContent.replace(/[→\s]+$/,'').replace(/\s+/g,' ').trim();let h=null;
 if(a.matches('.brand,.logo'))h=R.home;
 else if(/^learn more/i.test(t)){const x=a.closest('article,.card')?.textContent||'';h=/menu/i.test(x)?R.menus:/website/i.test(x)?R.web:R.signage}
 else if(/wa\.me/.test(raw)||/^tel:/.test(raw)){h=R.mail;a.textContent='Email Knovalab'}
 else if(/^contact$/i.test(t)&&document.getElementById('contact'))h='#contact';
 else for(const[re,u]of M)if(re.test(t)){h=u;break}
 if(!h&&/^mailto:/.test(raw)){h=R.mail;a.textContent=a.textContent.replace(/hello@knovalab\.com/g,'business@knovalab.in')}
 if(!h)return;
 a.setAttribute('href',h.split('?')[0]===location.pathname&&!h.includes('?')?'#top':h);
});
/* ---------- 2. IMAGES ---------- */
const svg=(g,t)=>'url("data:image/svg+xml,'+encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#241408'/><stop offset='1' stop-color='#0a0a0a'/></linearGradient></defs><rect width='800' height='500' fill='url(#g)'/><rect x='170' y='80' width='460' height='270' rx='12' fill='#050505' stroke='#2b2b2b' stroke-width='10'/><rect x='200' y='110' width='170' height='210' rx='6' fill='#ff6a00' opacity='.22'/><g fill='#555'><rect x='395' y='115' width='200' height='12' rx='6'/><rect x='395' y='145' width='150' height='10' rx='5'/><rect x='395' y='175' width='190' height='10' rx='5'/><rect x='395' y='205' width='120' height='10' rx='5'/></g><text x='285' y='240' font-size='84' text-anchor='middle'>${g}</text><rect x='350' y='360' width='100' height='16' fill='#222'/><text x='400' y='440' fill='#888' font-family='Arial' font-size='28' text-anchor='middle'>${t}</text></svg>`)+'")';
const bg=(el,url,g,t,over='')=>{el.style.background=over+(url?`url("${url}")`:svg(g,t))+' center/cover no-repeat'};
const each=(sel,list,set,fn)=>document.querySelectorAll(sel).forEach((el,i)=>list[i]&&fn(el,set[i],list[i]));
each('.project-art',[['💈','Tattoo Studio'],['🍽️','Restaurant'],['🎨','Creative Studio'],['📱','Menu Web App']],IMAGES.projects,(el,u,[g,t])=>{el.textContent='';bg(el,u,g,t)});
each('.projects .project',[['🍔','Harbor Restaurant'],['🎓','Vertex Academy'],['💪','Peak Fitness'],['🦷','Metropolitan Dental'],['🥐','Artisan Bakery'],['🏨','Greenfield Hotels']],IMAGES.cases,(el,u,[g,t])=>bg(el,u,g,t,'linear-gradient(to top,#121214 30%,rgba(18,18,20,.5)),'));
const POSTS=[['📺','Local Signage'],['🌐','Website'],['🔳','QR Codes'],['💸','Software Cost'],['🍽️','Digital Menus'],['📈','Conversions'],['🛰️','Network']];
each('.post .art',POSTS,IMAGES.posts,(el,u,[g,t])=>bg(el,u,g,t));
const st=document.createElement('style');st.textContent='.hero-card:before{background:var(--img) center/cover!important}';document.head.append(st);
each('.hero-card',POSTS.slice(0,6),IMAGES.posts,(el,u,[g,t])=>el.style.setProperty('--img',u?`url("${u}")`:svg(g,t)));
each('.avatar',[['🏗️','Architecture'],['💻','Development'],['🤝','Support']],IMAGES.team,(el,u,[g,t])=>bg(el,u,g,t));
/* ---------- 3. QUOTE PAGE ---------- */
const f=document.getElementById('quote-form');if(!f)return;
const B=['Under ₹50,000','₹50,000 – ₹1,50,000','₹1,50,000 – ₹3,00,000','₹3,00,000+','Need guidance'];
const sel=(n,l,o)=>`<div class="field"><label>${l}</label><select name="${n}"><option value="">Select</option>${o.map(x=>`<option>${x}</option>`).join('')}</select></div>`;
const chk=(n,l,o)=>`<div class="field" style="grid-column:1/-1"><label>${l}</label><input type="hidden" name="${n}"><div class="choice-grid compact-grid">${o.map(x=>`<label class="choice-card"><input type="checkbox" data-agg="${n}" value="${x}"><span class="choice-check" aria-hidden="true">✓</span><span>${x}</span></label>`).join('')}</div></div>`;
const TYPES=['Samsung Tizen','Android / Android TV','LG webOS','Other / Not sure'];
const SV=[
['On-Prem Digital Signage (CMS + Players)','signage',sel('signageScreenCount','How many screens will the CMS manage?',['1','2–5','6–10','11–25','25+'])+chk('signageScreenTypes','Screen / player type',TYPES)+sel('signageLocations','Number of locations',['Single location','2–5 locations','6+ locations'])+sel('signageScreensOwned','Do you already own the screens?',['Yes, all','Some','No, need hardware'])+sel('signageBudget','Budget for signage',B)],
['Digital Menu System','menus',sel('menuScreens','How many menu screens?',['1','2–3','4–6','7+'])+sel('menuTables','How many tables?',['No table service','1–10','11–25','26–50','50+'])+sel('menuServiceType','Service type',['Dine-in','Takeaway / counter','Both','Food court / multi-outlet'])+sel('menuItems','Approx. menu items',['Under 30','30–100','100+'])+chk('menuScreenTypes','Screen / player type',TYPES)+sel('menuBudget','Budget for menu system',B)],
['Display Hardware and Kiosk Sourcing','hardware',chk('hardwareTypes','Hardware needed',['Wall-mounted display','Elevator display','Floor-standing display','Touch kiosk','Shelf-order kiosk','LCD video wall'])+sel('hardwareQty','Quantity',['1','2–5','6–10','10+'])+sel('hardwareSize','Preferred screen size',['Under 32"','32"–43"','46"–55"','55"+'])+sel('hardwareBudget','Budget for hardware',B)]];
const grid=document.getElementById('serviceGrid'),last=grid.lastElementChild,anchor=document.getElementById('maintenanceFields');
SV.forEach(([name,key,html])=>{
 last.insertAdjacentHTML('beforebegin',`<label class="choice-card"><input type="checkbox" name="services" value="${name}"><span class="choice-check" aria-hidden="true">✓</span><span>${name}</span></label>`);
 anchor.insertAdjacentHTML('afterend',`<div class="conditional conditional-grid" data-svc="${name}"><p class="reassurance" style="grid-column:1/-1">${name} — a few quick questions</p>${html}</div>`)});
const sync=()=>{const on=[...f.querySelectorAll('input[name="services"]:checked')].map(i=>i.value);
 f.querySelectorAll('[data-svc]').forEach(p=>{const v=on.includes(p.dataset.svc);p.classList.toggle('is-visible',v);p.querySelectorAll('input,select').forEach(i=>i.disabled=!v)});
 f.querySelectorAll('input[type=hidden][name$="Types"],input[type=hidden][name$="ScreenTypes"]').forEach(h=>{h.value=[...f.querySelectorAll(`[data-agg="${h.name}"]:checked`)].map(i=>i.value).join(', ')})};
f.addEventListener('change',sync);sync();
const want=new URLSearchParams(location.search).get('service'),map={signage:SV[0][0],menus:SV[1][0],hardware:SV[2][0],web:'Business Website'}[want];
if(map){const c=[...f.querySelectorAll('input[name="services"]')].find(i=>i.value===map);if(c){c.checked=true;c.dispatchEvent(new Event('change',{bubbles:true}))}}
})();
