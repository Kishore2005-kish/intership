/* ==========================================================================
   MALNAD CREST - PRODUCTS & CART ENGINE (Free Shipping Bar & UI/UX)
   ========================================================================== */

const PRODUCTS = [
  {
    id: 'p1',
    name: 'Monsooned Malabar AA',
    category: 'monsooned',
    price: 680,
    rating: 4.9,
    notes: 'Nutty, Dark Chocolate, Low Acidity',
    desc: 'Exposed to monsoon ocean winds along the Malabar Coast of India for 12 weeks. Expands green beans and builds low acidity with velvet body.',
    image: 'images/package_monsooned.jpg',
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
    image: 'images/roasted_coffee_beans.jpg',
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
    image: 'images/filter_kaapi_pour.jpg',
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
    image: 'images/hero_plantation.jpg',
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
    image: 'images/roasted_coffee_beans.jpg',
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
    image: 'images/filter_kaapi_pour.jpg',
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
      <div class="product-image-wrap">
        <img src="${p.image}" alt="${p.name}" class="product-image" loading="lazy">
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
      <div style="border-radius: var(--radius-sm); overflow: hidden; height: 200px;">
        <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
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

/* Shopping Cart Drawer & Shipping Progress Bar */
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
      image: product.image,
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
  const shippingMsg = document.getElementById('shippingMsg');
  const shippingBar = document.getElementById('shippingBarFill');
  if (!body) return;

  let total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Free shipping logic (Threshold: ₹1000)
  const freeShippingThreshold = 1000;
  if (shippingMsg && shippingBar) {
    if (total >= freeShippingThreshold) {
      shippingMsg.innerHTML = '🎉 You unlocked <strong>FREE Estate Shipping</strong>!';
      shippingBar.style.width = '100%';
    } else {
      const remaining = freeShippingThreshold - total;
      const pct = Math.min((total / freeShippingThreshold) * 100, 100);
      shippingMsg.innerHTML = `Add <strong>₹${remaining}</strong> more for Free Estate Shipping!`;
      shippingBar.style.width = `${pct}%`;
    }
  }

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

  body.innerHTML = cart.map((item, index) => {
    return `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
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
