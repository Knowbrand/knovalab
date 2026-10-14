(()=>{const app=document.getElementById('app'),slug=new URLSearchParams(location.search).get('p'),p=PRODUCTS.find(x=>x.slug===slug);
if(!p){app.innerHTML='<h1>Product not found</h1><p><a class="btn primary" href="../">Back to marketplace</a></p>';return}
document.title=p.name+' — Knovalab Marketplace';
const sizes=p.variants.map(x=>x.label).join(', '),TBC='<span class="todo">Confirm with Knovalab</span>';
app.innerHTML=`<div class="crumbs"><a href="../">Marketplace</a> / ${p.cat} / ${p.name}</div>
<div class="pd-top"><div><div class="gal-main"><img id="main" alt="${p.name}"></div><div class="thumbs" id="thumbs"></div></div>
<div><div class="eyebrow">${p.cat}</div><h1>${p.name}</h1><p>${p.desc}</p>
<label for="size">Size / configuration</label><select id="size">${p.variants.map(x=>`<option>${x.label}</option>`).join('')}</select>
<div class="price" id="price"></div><p style="font-size:.82rem">${PRICE_NOTE}</p>
<div class="acts"><button class="btn primary" id="add">Add to Cart</button><a class="btn secondary" id="buy" href="#">Buy Now / Request Inquiry</a></div></div></div>
<h2>Specifications</h2><table><tr><td>Category</td><td>${p.cat}</td></tr><tr><td>Supplier</td><td>${p.supplier}</td></tr><tr><td>Available sizes</td><td>${sizes}</td></tr>
<tr><td>Resolution, brightness, panel</td><td>${TBC}</td></tr><tr><td>Operating system &amp; motherboard</td><td>${TBC}</td></tr><tr><td>Connectivity &amp; power</td><td>${TBC}</td></tr><tr><td>Dimensions &amp; weight</td><td>${TBC}</td></tr><tr><td>Warranty &amp; package contents</td><td>${TBC}</td></tr></table>
<h2>Customer reviews</h2><div class="card reviews"><p>Be the first to review this product.</p></div>
<h2>Related products</h2><div class="rel" id="rel"></div>`;
const main=document.getElementById('main'),th=document.getElementById('thumbs'),size=document.getElementById('size');
p.images.forEach((s,i)=>{const b=document.createElement('button'),im=document.createElement('img');b.setAttribute('aria-label','Image '+(i+1));KV.img(im,s);b.append(im);b.onclick=()=>{KV.img(main,s);[...th.children].forEach(x=>x.classList.toggle('on',x===b))};th.append(b);if(!i)b.click()});
if(p.images.length<2)th.hidden=true;
const upd=()=>{document.getElementById('price').textContent=KV.money(KV.price(p,size.value))+' ref. USD';document.getElementById('buy').href='../inquiry/?buy='+p.id+'&size='+encodeURIComponent(size.value)};
size.onchange=upd;upd();
document.getElementById('add').onclick=()=>{KV.add(p.id,size.value);KV.toast('Added to cart')};
const rel=document.getElementById('rel');PRODUCTS.filter(x=>x.id!==p.id).sort((a,b)=>(b.cat===p.cat)-(a.cat===p.cat)).slice(0,3).forEach(x=>{const a=document.createElement('a');a.className='card';a.href='?p='+x.slug;a.innerHTML=`<small>${x.cat}</small><h3 style="margin:6px 0 0;font-size:1.05rem">${x.name}</h3>`;rel.append(a)})})();
