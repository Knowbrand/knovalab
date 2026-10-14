(()=>{const app=document.getElementById('app');
function render(){const items=KV.get().filter(i=>KV.prod(i.id));
if(!items.length){app.innerHTML='<div class="card emptyc"><p>Your cart is empty.</p><a class="btn primary" href="../">Browse products</a></div>';return}
app.innerHTML='<div class="ct-wrap"><div id="list"></div><aside class="card sum" id="sum"></aside></div>';const list=document.getElementById('list');let sub=0,qty=0;
items.forEach(i=>{const p=KV.prod(i.id),pr=KV.price(p,i.size)||0;sub+=pr*i.qty;qty+=i.qty;const r=document.createElement('div');r.className='card row';
r.innerHTML=`<img alt="${p.name}"><div><h3><a href="../product/?p=${p.slug}">${p.name}</a></h3><small>${i.size} · ${KV.money(pr)} ref. USD each</small><div class="qty"><button aria-label="Decrease">−</button><b>${i.qty}</b><button aria-label="Increase">+</button></div></div><button class="rm">Remove</button>`;
KV.img(r.querySelector('img'),p.images[0]);const [m,pl]=r.querySelectorAll('.qty button');
m.onclick=()=>{KV.set(i.id,i.size,i.qty-1);render()};pl.onclick=()=>{KV.set(i.id,i.size,i.qty+1);render()};r.querySelector('.rm').onclick=()=>{KV.rm(i.id,i.size);render()};list.append(r)});
document.getElementById('sum').innerHTML=`<h3>Summary</h3><div><span>Distinct products</span><b>${items.length}</b></div><div><span>Total quantity</span><b>${qty}</b></div><div><span>Reference subtotal (indicative USD)</span><b>${KV.money(sub)}</b></div><a class="btn primary" href="../inquiry/">Submit Bulk Inquiry</a><a class="btn secondary" style="width:100%;margin-top:10px" href="../">Continue shopping</a><p>${PRICE_NOTE} Final prices, shipping, taxes, configuration and availability require confirmation.</p>`}
render()})();
