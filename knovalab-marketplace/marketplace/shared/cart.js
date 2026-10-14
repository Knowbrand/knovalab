/* Shared: cart state (localStorage), navbar/footer, helpers */
const KV={k:'kv_cart',
get(){try{return JSON.parse(localStorage.getItem(this.k))||[]}catch(e){return[]}},
save(a){try{localStorage.setItem(this.k,JSON.stringify(a))}catch(e){}this.badge()},
add(id,size,q=1){const a=this.get(),i=a.find(x=>x.id===id&&x.size===size);i?i.qty+=q:a.push({id,size,qty:q});this.save(a)},
set(id,size,q){let a=this.get().map(x=>x.id===id&&x.size===size?{...x,qty:q}:x).filter(x=>x.qty>0);this.save(a)},
rm(id,size){this.save(this.get().filter(x=>!(x.id===id&&x.size===size)))},
clear(){this.save([])},
count(){return this.get().reduce((s,x)=>s+x.qty,0)},
badge(){document.querySelectorAll('[data-cart]').forEach(e=>e.textContent=this.count())},
prod(id){return PRODUCTS.find(p=>p.id===id)},
price(p,size){const x=p.variants.find(y=>y.label===size);return x?x.price:null},
money(n){return '$'+n.toLocaleString('en-US')},
img(el,src){el.src=src;el.onerror=()=>{el.onerror=null;el.src=FALLBACK_IMAGE}},
toast(m){let t=document.getElementById('toast');if(!t){t=document.createElement('div');t.id='toast';t.setAttribute('role','status');document.body.append(t)}t.textContent=m;t.className='show';clearTimeout(this.tt);this.tt=setTimeout(()=>t.className='',2200)},
chrome(){const b=document.body.dataset.base||'';
document.body.insertAdjacentHTML('afterbegin',`<header class="nav"><div class="container"><a class="logo" href="${b}../index.html">Knovalab</a><nav><a href="${b}../index.html#solutions">Solutions</a><a href="${b}./">Marketplace</a><a href="${b}../index.html#contact">Contact</a></nav><a class="cart-link" href="${b}cart/" aria-label="Cart">Cart <b data-cart>0</b></a></div></header>`);
document.body.insertAdjacentHTML('beforeend',`<footer class="footer"><div class="container"><span>© 2026 Knovalab Technologies</span><a href="mailto:hello@knovalab.com">hello@knovalab.com</a></div></footer>`);this.badge()}};
document.addEventListener('DOMContentLoaded',()=>KV.chrome());
