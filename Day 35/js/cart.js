/* ==========================================================================
   MALNAD CREST - PRODUCTS & CART ENGINE (Vector & Modern Editorial)
   ========================================================================== */

const SVG_ICONS = {
  monsooned: `
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="12" width="32" height="44" rx="4" fill="#C88A35" fill-opacity="0.15" stroke="#C88A35" stroke-width="2"/>
      <path d="M16 22H48" stroke="#C88A35" stroke-width="2"/>
      <circle cx="32" cy="36" r="8" stroke="#C88A35" stroke-width="2"/>
      <path d="M30 36C30 34.8954 30.8954 34 32 34C33.1046 34 34 34.8954 34 36C34 37.1046 33.1046 38 32 38" stroke="#C88A35" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,
  singleOrigin: `
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 10C22 10 14 20 14 34C14 44 22 52 32 52C42 52 50 44 50 34C50 20 42 10 32 10Z" fill="#2A4535" fill-opacity="0.1" stroke="#2A4535" stroke-width="2"/>
      <path d="M32 10V52" stroke="#2A4535" stroke-width="2" stroke-dasharray="2 2"/>
      <circle cx="26" cy="30" r="5" fill="#C88A35"/>
      <circle cx="38" cy="38" r="5" fill="#C88A35"/>
    </svg>
  `,
  spiced: `
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 44C20 30 32 14 32 14C32 14 44 30 44 44C44 50.6274 38.6274 54 32 54C25.3726 54 20 50.6274 20 44Z" fill="#C88A35" fill-opacity="0.2" stroke="#C88A35" stroke-width="2"/>
      <path d="M32 14V54" stroke="#C88A35" stroke-width="2"/>
      <path d="M24 34H40" stroke="#C88A35" stroke-width="1.5"/>
    </svg>
  `,
  gear: `
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="18" y="10" width="28" height="20" rx="2" fill="#C88A35" fill-opacity="0.2" stroke="#C88A35" stroke-width="2"/>
      <path d="M14 30H50V36C50 42.6274 44.6274 48 38 48H26C19.3726 48 14 42.6274 14 36V30Z" fill="#C88A35" fill-opacity="0.1" stroke="#C88A35" stroke-width="2"/>
      <path d="M14 54H50" stroke="#C88A35" stroke-width="3" stroke-linecap="round"/>
    </svg>
  `
};

const PRODUCTS = [
  {
    id: 'p1',
    name: 'Monsooned Malabar AA',
    category: 'monsooned',
    price: 680,
    rating: 4.9,
    notes: 'Nutty, Dark Chocolate, Low Acidity',
    desc: 'Exposed to monsoon ocean winds along the Malabar Coast of India for 12 weeks. Expands green beans and builds low acidity with velvet body.',
    svgType: 'monsooned',
    tag: 'Bestseller'
  },
  {
    id: 'p2',
    name: 'Bababudan Reserve Micro-Lot',
    category: 'single-origin',
    price: 750,
    rating: 5.0,
    notes: 'Wild Berries, Cardamom, Cocoa',
    desc: 'Hand-harvested at 4,200ft elevation from the historic birthplace of Indian coffee in Chikmagalur, Karnataka.',
    svgType: 'singleOrigin',
    tag: 'Single Origin'
  },
  {
    id: 'p3',
    name: 'Coorg Traditional Filter Kaapi',
    category: 'spiced',
    price: 490,
    rating: 4.8,
    notes: 'Bittersweet, Heavy Body, Chicory Blend',
    desc: '80% Estate Arabica & Robusta blended with 20% Jamnagar chicory for authentic South Indian Filter Decoction.',
    svgType: 'spiced',
    tag: 'Heritage Blend'
  },
  {
    id: 'p4',
    name: 'Mysore Nugget Extra Bold',
    category: 'single-origin',
    price: 720,
    rating: 4.9,
    notes: 'Roasted Hazelnut, Caramel Crema',
    desc: 'The gold standard of Indian Arabica. Extra large AAA beans curated from high-canopy shade farms.',
    svgType: 'singleOrigin',
    tag: 'Premium AAA'
  },
  {
    id: 'p5',
    name: 'Cardamom & Clove Infused Roast',
    category: 'spiced',
    price: 640,
    rating: 4.7,
    notes: 'Green Cardamom, Clove, Brown Sugar',
    desc: 'Freshly roasted estate beans infused with organic Malnad cardamom and spice oils during cooling.',
    svgType: 'spiced',
    tag: 'Artisanal Spice'
  },
  {
    id: 'p6',
    name: 'Heritage Brass Filter & Dabarah Set',
    category: 'gear',
    price: 1490,
    rating: 5.0,
    notes: 'Pure Heavy Brass, South Indian Craft',
    desc: 'Handcrafted traditional brass coffee filter and dabarah tumbler set for authentic coffee ritual.',
    svgType: 'gear',
    tag: 'Handcrafted'
  }
];

let cart = JSON.parse(localStorage.getItem('malnad_cart') || '[]');

document.addEventListener('DOMContentLoaded', () => {
  renderProductCatalog();
  initFilterTabs();
  initCartDrawer();
  updateCartBadge();
});

/* Render Product Catalog Grid */
function renderProductCatalog(filterCategory = 'all', searchQuery = '') {
  const container = document.getElementById('productGrid');
  if (!container) return;

  let filtered = PRODUCTS;
  if (filterCategory !== 'all') {
    filtered = filtered.filter(p => p.category === filterCategory);
  }

  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.notes.toLowerCase().includes(q));
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
        <p style="font-size: 1.1rem; margin-bottom: 1rem;">No coffee or gear found matching your query.</p>
        <button class="btn btn-outline" onclick="resetFilters()">View All Collections</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(p => `
    <div class="product-card reveal visible">
      <div class="product-art-wrap">
        ${SVG_ICONS[p.svgType]}
        <span class="product-tag">${p.tag}</span>
      </div>
      <div class="product-details">
        <h3 class="product-title">${p.name}</h3>
        <div class="product-notes">${p.notes}</div>
        <p class="product-desc">${p.desc}</p>
        <div class="product-footer">
          <div class="product-price">₹${p.price}</div>
          <button class="btn btn-primary" onclick="openQuickView('${p.id}')" style="padding: 0.45rem 1rem; font-size: 0.85rem;">
            Quick View
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

/* Category Filter Tabs */
function initFilterTabs() {
  const tabs = document.querySelectorAll('.filter-tab');
  const searchInput = document.getElementById('productSearch');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.getAttribute('data-category') || 'all';
      renderProductCatalog(cat, searchInput ? searchInput.value : '');
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const activeTab = document.querySelector('.filter-tab.active');
      const cat = activeTab ? activeTab.getAttribute('data-category') : 'all';
      renderProductCatalog(cat, e.target.value);
    });
  }
}

window.resetFilters = function() {
  const tabs = document.querySelectorAll('.filter-tab');
  tabs.forEach(t => t.classList.remove('active'));
  if (tabs[0]) tabs[0].classList.add('active');
  const searchInput = document.getElementById('productSearch');
  if (searchInput) searchInput.value = '';
  renderProductCatalog('all', '');
};

/* Quick View Modal */
window.openQuickView = function(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const modalOverlay = document.getElementById('quickViewModal');
  if (!modalOverlay) return;

  const content = document.getElementById('quickViewContent');
  content.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem;">
      <div style="background: var(--bg-muted); border-radius: var(--radius-sm); padding: 2rem; display: flex; align-items: center; justify-content: center;">
        ${SVG_ICONS[product.svgType]}
      </div>
      <div>
        <span class="sub-title">${product.tag}</span>
        <h2 style="font-size: 1.6rem; margin-bottom: 0.4rem;">${product.name}</h2>
        <div style="color: var(--accent-amber); margin-bottom: 1rem; font-weight: 600;">${product.notes}</div>
        <p style="color: var(--text-secondary); font-size: 0.92rem; margin-bottom: 1.5rem; line-height: 1.6;">${product.desc}</p>
        
        <div class="form-group">
          <label class="form-label">Grind Type</label>
          <select id="grindSelect" class="form-control">
            <option value="South Indian Filter Grind">South Indian Filter Grind (Fine-Medium)</option>
            <option value="Whole Bean">Whole Beans (Fresh Roast)</option>
            <option value="Espresso Grind">Espresso Grind (Fine)</option>
            <option value="French Press">French Press (Coarse)</option>
          </select>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem;">
          <div style="font-family: var(--font-heading); font-size: 1.5rem; color: var(--text-primary); font-weight: 700;">₹${product.price}</div>
          <button class="btn btn-primary" onclick="addToCart('${product.id}')">
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  `;

  modalOverlay.classList.add('open');
};

window.closeQuickView = function() {
  const modalOverlay = document.getElementById('quickViewModal');
  if (modalOverlay) modalOverlay.classList.remove('open');
};

/* Shopping Cart Drawer Management */
function initCartDrawer() {
  const cartBtn = document.getElementById('cartToggle');
  const drawerOverlay = document.getElementById('cartDrawerOverlay');
  const drawer = document.getElementById('cartDrawer');
  const closeBtn = document.getElementById('closeCartDrawer');

  if (cartBtn && drawer && drawerOverlay) {
    cartBtn.addEventListener('click', () => {
      drawerOverlay.classList.add('open');
      drawer.classList.add('open');
      renderCartItems();
    });

    const closeCart = () => {
      drawerOverlay.classList.remove('open');
      drawer.classList.remove('open');
    };

    closeBtn?.addEventListener('click', closeCart);
    drawerOverlay?.addEventListener('click', closeCart);
  }
}

window.addToCart = function(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const grindSelect = document.getElementById('grindSelect');
  const grind = grindSelect ? grindSelect.value : 'South Indian Filter Grind';

  const existingIndex = cart.findIndex(item => item.id === productId && item.grind === grind);

  if (existingIndex > -1) {
    cart[existingIndex].qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      svgType: product.svgType,
      grind: grind,
      qty: 1
    });
  }

  saveCart();
  updateCartBadge();
  closeQuickView();
  
  window.showToast(`Added <strong>${product.name}</strong> to cart!`);

  const drawerOverlay = document.getElementById('cartDrawerOverlay');
  const drawer = document.getElementById('cartDrawer');
  if (drawerOverlay && drawer) {
    drawerOverlay.classList.add('open');
    drawer.classList.add('open');
    renderCartItems();
  }
};

function renderCartItems() {
  const body = document.getElementById('cartItemsBody');
  const totalEl = document.getElementById('cartTotalVal');
  if (!body) return;

  if (cart.length === 0) {
    body.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
        <p>Your coffee cart is empty.</p>
        <button class="btn btn-outline" onclick="closeCartDrawerDirect()" style="margin-top: 1rem; padding: 0.4rem 1rem; font-size: 0.85rem;">Browse Coffees</button>
      </div>
    `;
    if (totalEl) totalEl.innerText = '₹0';
    return;
  }

  let total = 0;
  body.innerHTML = cart.map((item, index) => {
    total += item.price * item.qty;
    return `
      <div class="cart-item">
        <div class="cart-item-img-svg">
          ${SVG_ICONS[item.svgType || 'monsooned']}
        </div>
        <div class="cart-item-details">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-grind">${item.grind}</div>
          <div class="cart-item-price">₹${item.price}</div>
          <div style="display: flex; align-items: center; gap: 8px; margin-top: 6px;">
            <button class="qty-btn" onclick="updateQty(${index}, -1)">-</button>
            <span style="font-weight: 700; font-size: 0.9rem;">${item.qty}</span>
            <button class="qty-btn" onclick="updateQty(${index}, 1)">+</button>
          </div>
        </div>
        <button onclick="removeFromCart(${index})" style="background: none; border: none; color: var(--text-muted); cursor: pointer;">✕</button>
      </div>
    `;
  }).join('');

  if (totalEl) totalEl.innerText = `₹${total}`;
}

window.closeCartDrawerDirect = function() {
  const drawerOverlay = document.getElementById('cartDrawerOverlay');
  const drawer = document.getElementById('cartDrawer');
  if (drawerOverlay && drawer) {
    drawerOverlay.classList.remove('open');
    drawer.classList.remove('open');
  }
};

window.updateQty = function(index, change) {
  if (cart[index]) {
    cart[index].qty += change;
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }
    saveCart();
    updateCartBadge();
    renderCartItems();
  }
};

window.removeFromCart = function(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartBadge();
  renderCartItems();
};

function saveCart() {
  localStorage.setItem('malnad_cart', JSON.stringify(cart));
}

function updateCartBadge() {
  const badges = document.querySelectorAll('.cart-badge');
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  badges.forEach(b => b.innerText = totalCount);
}

window.checkoutCart = function() {
  if (cart.length === 0) {
    window.showToast('Your cart is empty!', 'error');
    return;
  }
  closeCartDrawerDirect();
  window.showToast('🎉 Order placed successfully! Dispatching from Malnad Crest Estate.');
  cart = [];
  saveCart();
  updateCartBadge();
};
