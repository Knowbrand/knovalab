(()=>{const grid=document.getElementById('grid'),chips=document.getElementById('chips'),q=document.getElementById('q'),sort=document.getElementById('sort');let cat='All Products';
const min=p=>Math.min(...p.variants.map(x=>x.price));
['All Products',...CATEGORIES].forEach(c=>{const b=document.createElement('button');b.className='chip'+(c===cat?' on':'');b.textContent=c;b.onclick=()=>{cat=c;[...chips.children].forEach(x=>x.classList.toggle('on',x===b));render()};chips.append(b)});
function render(){const t=q.value.trim().toLowerCase();
let list=PRODUCTS.filter(p=>(cat==='All Products'||p.cat===cat)&&(!t||[p.name,p.cat,p.supplier,p.slug,...p.variants.map(x=>x.label)].join(' ').toLowerCase().includes(t)));
if(sort.value)list=[...list].sort((a,b)=>sort.value==='asc'?min(a)-min(b):min(b)-min(a));
grid.innerHTML='';if(!list.length){grid.innerHTML='<div class="empty">No products match your search.</div>';return}
list.forEach(p=>{const c=document.createElement('article'),href='product/?p='+p.slug;c.className='card pcard';
c.innerHTML=`<a class="pimg" href="${href}"><img alt="${p.name}" loading="lazy"></a><div class="pbody"><small>${p.cat}</small><h3><a href="${href}">${p.name}</a></h3><div class="pmeta">${p.variants.length>1?p.variants.length+' sizes · '+p.variants[0].label+' – '+p.variants.at(-1).label:'Size '+p.variants[0].label}</div><p>${p.desc}</p><div class="pprice">From ${KV.money(min(p))} <small style="color:#777;font-weight:400">ref. USD</small></div><select aria-label="Size for ${p.name}">${p.variants.map(x=>`<option>${x.label}</option>`).join('')}</select><div class="pbtns"><a class="btn secondary" href="${href}">View Details</a><button class="btn primary">Add to Cart</button></div></div>`;
KV.img(c.querySelector('img'),p.images[0]);
c.querySelector('button').onclick=()=>{KV.add(p.id,c.querySelector('select').value);KV.toast('Added to cart')};grid.append(c)})}
q.oninput=render;sort.onchange=render;render()})();
