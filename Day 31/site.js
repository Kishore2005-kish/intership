document.documentElement.classList.add('motion-ready');

const products=[
{id:0,name:'Eternal Band Ring',detail:'18KT gold · natural diamonds',price:48900,category:'Rings'},
{id:1,name:'Astra Chain Necklace',detail:'18KT yellow gold',price:125000,category:'Necklaces'},
{id:2,name:'Gul Diamond Pendant',detail:'18KT gold · natural diamonds',price:168000,category:'Necklaces'},
{id:3,name:'Pearl Halo Pendant',detail:'18KT gold · freshwater pearl',price:72500,category:'Necklaces'},
{id:4,name:'Sona Open Ring',detail:'18KT yellow gold',price:41900,category:'Rings'},
{id:5,name:'Surya Hoop Earrings',detail:'18KT yellow gold',price:68900,category:'Earrings'},
{id:6,name:'Boond Diamond Necklace',detail:'18KT gold · natural diamonds',price:96000,category:'Necklaces'},
{id:7,name:'Ornate Twist Ring',detail:'18KT gold · natural diamonds',price:58400,category:'Rings'}
];
const currency=value=>'₹'+value.toLocaleString('en-IN');
const getBag=()=>{try{return JSON.parse(localStorage.getItem('aaroh-bag')||'{}')}catch{return {}}};
const saveBag=bag=>{localStorage.setItem('aaroh-bag',JSON.stringify(bag));updateBagCount()};
const updateBagCount=()=>document.querySelectorAll('[data-bag-count]').forEach(el=>el.textContent=Object.values(getBag()).reduce((a,b)=>a+b,0));
let motionObserver;
function prepareReveals(scope=document){
  if(!motionObserver)return;
  const selectors=['.category-image','.section-heading','.product-card','.home-story h2','.home-story .top-copy','.home-story .bottom-copy','.home-story img','.page-head > *','.shop-bar','.story-lead > *','.story-photo','.story-closing > *','.bag-row','.summary','.bag-empty','.empty-state','.footer > *'];
  scope.querySelectorAll(selectors.join(',')).forEach((element,index)=>{
    if(element.classList.contains('reveal-ready')||element.closest('.hero'))return;
    element.classList.add('reveal-ready');
    element.style.setProperty('--reveal-delay',`${Math.min(index%4,3)*90}ms`);
    motionObserver.observe(element);
  });
}
function setupMotion(){
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced){document.documentElement.classList.add('motion-reduced');return}
  const hero=document.querySelector('.hero');
  if(hero)requestAnimationFrame(()=>hero.classList.add('hero-entered'));
  motionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('is-visible');motionObserver.unobserve(entry.target)}
  }),{threshold:.12,rootMargin:'0px 0px -7%'});
  prepareReveals();
}
const addToBag=id=>{const bag=getBag();bag[id]=(bag[id]||0)+1;saveBag(bag);const btn=document.querySelector(`[data-add="${id}"]`);if(btn){const old=btn.textContent;btn.textContent='✓';setTimeout(()=>btn.textContent=old,1300)}};
const card=p=>`<article class="product-card"><button class="product-photo photo-${p.id}" data-product="${p.id}" aria-label="View ${p.name}"></button><div class="product-info"><button class="product-name" data-product="${p.id}">${p.name}</button><p>${p.detail}</p><div class="product-bottom"><strong>${currency(p.price)}</strong><button class="quick-add" data-add="${p.id}" aria-label="Add ${p.name} to bag">+</button></div></div></article>`;
function openProduct(id){const p=products.find(item=>item.id===id);if(!p)return;const backdrop=document.getElementById('product-modal');if(!backdrop)return;backdrop.innerHTML=`<div class="modal" role="dialog" aria-modal="true" aria-label="${p.name}"><button class="modal-close" data-close aria-label="Close product details">×</button><div class="product-photo photo-${p.id}"></div><div class="modal-copy"><span class="eyebrow">AAROH · ${p.category.toUpperCase()}</span><h2>${p.name}</h2><p>${p.detail}</p><strong>${currency(p.price)}</strong><p>Thoughtfully crafted in India for moments worth keeping.</p><button class="button" data-add="${p.id}">ADD TO BAG <span>→</span></button></div></div>`;backdrop.classList.add('open');document.body.style.overflow='hidden'}
function closeProduct(){const modal=document.getElementById('product-modal');if(modal)modal.classList.remove('open');document.body.style.overflow=''}
function renderShop(){const grid=document.getElementById('shop-products');if(!grid)return;const allowed=['All','Rings','Earrings','Necklaces','Bracelets'];let category=new URLSearchParams(location.search).get('category')||'All';if(!allowed.includes(category))category='All';const results=category==='All'?products:products.filter(p=>p.category===category);document.querySelectorAll('[data-filter]').forEach(button=>{const active=button.dataset.filter===category;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active))});grid.innerHTML=results.length?results.map(card).join(''):`<div class="empty-state"><h2>Something beautiful is on its way.</h2><p>Our bracelets collection is coming soon.</p><a class="button outline" href="/shop.html">EXPLORE ALL PIECES →</a></div>`;grid.classList.toggle('product-grid',results.length>0);const count=document.getElementById('shop-count');if(count)count.textContent=`${results.length} ${results.length===1?'PIECE':'PIECES'}`;prepareReveals(grid)}
function renderBag(){const list=document.getElementById('bag-items');if(!list)return;const bag=getBag();const selected=products.filter(p=>bag[p.id]>0);const summary=document.getElementById('bag-summary');if(!selected.length){list.innerHTML='<div class="bag-empty"><h2>Your bag is empty</h2><p>Beautiful things are waiting to be discovered.</p><a class="button" href="/shop.html">EXPLORE JEWELLERY →</a></div>';summary.hidden=true;prepareReveals(list);return}summary.hidden=false;list.innerHTML=selected.map(p=>`<div class="bag-row"><button class="product-photo photo-${p.id}" data-product="${p.id}" aria-label="View ${p.name}"></button><div><h2>${p.name}</h2><p>${p.detail}</p><div class="quantity"><button data-quantity="${p.id}" data-change="-1" aria-label="Remove one ${p.name}">−</button><span>${bag[p.id]}</span><button data-quantity="${p.id}" data-change="1" aria-label="Add one ${p.name}">+</button></div></div><strong>${currency(p.price*bag[p.id])}</strong></div>`).join('');document.getElementById('bag-total').textContent=currency(selected.reduce((sum,p)=>sum+p.price*bag[p.id],0));prepareReveals(list)}
function makeMenu(){const menu=document.createElement('div');menu.className='mobile-menu';menu.id='mobile-menu';menu.innerHTML='<div class="mobile-menu-inner"><div class="mobile-menu-header"><span class="brand">AAROH<i>✦</i></span><button data-close-menu aria-label="Close menu">×</button></div><nav><a href="/index.html">Home <span>↗</span></a><a href="/shop.html">Shop all <span>↗</span></a><a href="/shop.html?category=Rings">Rings <span>↗</span></a><a href="/shop.html?category=Earrings">Earrings <span>↗</span></a><a href="/shop.html?category=Necklaces">Necklaces <span>↗</span></a><a href="/shop.html?category=Bracelets">Bracelets <span>↗</span></a><a href="/story.html">Our story <span>↗</span></a><a href="/bag.html">Bag <span>↗</span></a></nav><p class="mobile-menu-bottom">Crafted in India, cherished everywhere.</p></div>';document.body.append(menu)}
document.addEventListener('click',event=>{const target=event.target.closest('button,a');if(!target)return;if(target.dataset.product!==undefined)openProduct(Number(target.dataset.product));if(target.dataset.add!==undefined){addToBag(Number(target.dataset.add));if(target.closest('.modal')){closeProduct()}}if(target.dataset.close!==undefined)closeProduct();if(target.dataset.filter!==undefined){const category=target.dataset.filter;history.replaceState(null,'',category==='All'?'/shop.html':'/shop.html?category='+encodeURIComponent(category));renderShop()}if(target.dataset.quantity!==undefined){const id=Number(target.dataset.quantity);const bag=getBag();bag[id]=(bag[id]||0)+Number(target.dataset.change);if(bag[id]<=0)delete bag[id];saveBag(bag);renderBag()}if(target.dataset.openMenu!==undefined){document.getElementById('mobile-menu').classList.add('open');document.body.style.overflow='hidden'}if(target.dataset.closeMenu!==undefined){document.getElementById('mobile-menu').classList.remove('open');document.body.style.overflow=''}});
document.addEventListener('click',event=>{if(event.target.id==='product-modal')closeProduct();if(event.target.id==='mobile-menu'){event.target.classList.remove('open');document.body.style.overflow=''}});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeProduct();document.getElementById('mobile-menu').classList.remove('open');document.body.style.overflow=''}});
document.addEventListener('DOMContentLoaded',()=>{makeMenu();updateBagCount();const featured=document.getElementById('featured-products');if(featured)featured.innerHTML=products.map(card).join('');renderShop();renderBag();setupMotion();const copy=document.getElementById('copy-selection');if(copy)copy.addEventListener('click',async()=>{const bag=getBag();const selected=products.filter(p=>bag[p.id]>0);const text=`Aaroh jewellery selection\n\n${selected.map(p=>`${p.name} × ${bag[p.id]} — ${currency(p.price*bag[p.id])}`).join('\n')}\n\nTotal: ${currency(selected.reduce((sum,p)=>sum+p.price*bag[p.id],0))}`;try{await navigator.clipboard.writeText(text);copy.textContent='COPIED ✓';setTimeout(()=>copy.textContent='COPY SELECTION →',2000)}catch{copy.textContent='COPY FAILED — TRY AGAIN'}})});
