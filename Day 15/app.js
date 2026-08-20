/* Fresh Kirana — plain JavaScript store logic */

const CAT_BY_SLUG = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c]));
const P_BY_ID = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));

const productImage = (p) => (CAT_BY_SLUG[p.category] || CATEGORIES[0]).image;
const categoryName = (slug) => (CAT_BY_SLUG[slug] ? CAT_BY_SLUG[slug].name : slug);
const formatINR = (n) =>
  "\u20B9" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

/* deterministic pseudo-values so cards look like a live marketplace */
function seed(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 9973;
  return h;
}
const ratingOf = (p) => 4 + (seed(p.id) % 10) / 10;
const availableOf = (p) => 20 + (seed(p.id) % 180);
const soldOf = (p) => 12 + (seed(p.id + "s") % 90);

/* ---------- cart ---------- */

const CART_KEY = "fresh-kirana-cart";
const WISH_KEY = "fresh-kirana-wishlist";

function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function writeCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  document.dispatchEvent(new CustomEvent("cart:change"));
}

function addToCart(id, qty) {
  const items = readCart();
  const line = items.find((l) => l.id === id);
  if (line) line.qty += qty || 1;
  else items.push({ id: id, qty: qty || 1 });
  writeCart(items);
}

function setQty(id, qty) {
  let items = readCart();
  if (qty <= 0) items = items.filter((l) => l.id !== id);
  else items = items.map((l) => (l.id === id ? { id: id, qty: qty } : l));
  writeCart(items);
}

const cartCount = () => readCart().reduce((n, l) => n + l.qty, 0);
const cartLines = () =>
  readCart()
    .map((l) => ({ product: P_BY_ID[l.id], qty: l.qty }))
    .filter((l) => l.product);
const cartSubtotal = () =>
  cartLines().reduce((n, l) => n + l.product.price * l.qty, 0);

/* ---------- wishlist ---------- */

function readWish() {
  try {
    const raw = localStorage.getItem(WISH_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function toggleWish(id) {
  const list = readWish();
  const next = list.includes(id) ? list.filter((x) => x !== id) : list.concat(id);
  localStorage.setItem(WISH_KEY, JSON.stringify(next));
  document.dispatchEvent(new CustomEvent("wish:change"));
  return next.includes(id);
}

/* ---------- chrome ---------- */

const catHref = (slug) => "shop.html?category=" + slug;
const navLink = (slug, label, cls) =>
  '<a href="' + catHref(slug) + '"' + (cls ? ' class="' + cls + '"' : "") + ">" + label + "</a>";

function renderChrome() {
  const header = document.querySelector("[data-header]");
  if (header) {
    header.innerHTML =
      '<div class="announce"><div class="wrap">' +
      "<span>Monsoon Sale: 20% off \u00B7 Free delivery above \u20B9499</span>" +
      '<nav aria-label="Secondary">' +
      '<a href="about.html">About us</a>' +
      '<a href="contact.html">Contact us</a>' +
      '<a href="blog.html">Blog</a>' +
      '<a href="store-locator.html">Store locator</a>' +
      '<a href="track-order.html">Track order</a>' +
      '<a href="faq.html">Support 24/7</a>' +
      "</nav></div></div>" +
      '<div class="masthead"><div class="wrap">' +
      '<a href="index.html" class="wordmark">Fresh<em>Kirana</em></a>' +
      '<form class="searchbar" data-search action="shop.html">' +
      '<select name="category" aria-label="Category"><option value="all">All categories</option>' +
      CATEGORIES.map((c) => '<option value="' + c.slug + '">' + c.name + "</option>").join("") +
      "</select>" +
      '<input name="q" type="search" placeholder="Search for atta, mangoes, ghee\u2026" aria-label="Search products">' +
      '<button type="submit">Search</button></form>' +
      '<div class="utility">' +
      '<a href="account.html">Sign in</a>' +
      '<a href="wishlist.html" data-wish-link>Wishlist (0)</a>' +
      '<a href="cart.html" class="cart-pill" data-cart-pill>Cart (0)</a>' +
      "</div></div></div>" +
      '<div class="catbar"><div class="wrap"><nav class="mainnav" aria-label="Primary">' +
      navLink("all", "All products") +
      navLink("fruits", "Fruits") +
      navLink("vegetables", "Vegetables") +
      navLink("dairy-eggs", "Dairy &amp; Eggs") +
      navLink("atta-rice", "Atta &amp; Rice") +
      navLink("spices", "Spices") +
      '<a href="deals.html" class="sale">Deals</a>' +
      '<a href="offers.html">Coupons</a>' +
      '<a href="recipes.html">Recipes</a>' +
      '<a href="blog.html">Blog</a>' +
      "</nav>" +
      '<span class="helpline">Need help? Call us <strong>+91 98200 45678</strong></span>' +
      "</div></div>";
  }

  const footer = document.querySelector("[data-footer]");
  if (footer) {
    const col = (title, links) =>
      "<div><h4>" +
      title +
      "</h4><ul>" +
      links.map((l) => '<li><a href="' + l[1] + '">' + l[0] + "</a></li>").join("") +
      "</ul></div>";
    footer.innerHTML =
      '<div class="wrap"><div class="footer-grid">' +
      col("Shop", [
        ["Fruits", catHref("fruits")],
        ["Vegetables", catHref("vegetables")],
        ["Dals &amp; Pulses", catHref("dals-pulses")],
        ["Oils &amp; Ghee", catHref("oils-ghee")],
        ["Household", catHref("household")],
      ]) +
      col("Explore", [
        ["Today's deals", "deals.html"],
        ["Spice box", catHref("spices")],
        ["Chai &amp; coffee", catHref("beverages")],
        ["Recipes", "recipes.html"],
        ["Offers &amp; coupons", "offers.html"],
        ["Blog", "blog.html"],
      ]) +
      col("About", [
        ["Our story", "about.html"],
        ["Store locator", "store-locator.html"],
        ["Contact us", "contact.html"],
        ["My account", "account.html"],
      ]) +
      col("Help", [
        ["FAQs", "faq.html"],
        ["Delivery slots", "faq.html"],
        ["Track your order", "track-order.html"],
        ["Returns &amp; refunds", "faq.html"],
        ["Wishlist", "wishlist.html"],
      ]) +
      "<div><h4>Stay in the know</h4>" +
      '<p style="font-size:13px;margin:0">Seasonal harvests, festive hampers and weekend offers.</p>' +
      '<form class="subscribe" data-subscribe><input type="email" required placeholder="Email address" aria-label="Email address"><button type="submit">Subscribe</button></form>' +
      '<p class="free-note" data-subscribed hidden>Thanks \u2014 you\'re on the list.</p></div>' +
      "</div>" +
      '<div class="footer-note"><span>\u00A9 ' +
      new Date().getFullYear() +
      " Fresh Kirana Retail Pvt Ltd \u00B7 GSTIN 27AABCF1234K1Z9</span><span>Prices in \u20B9 INR, inclusive of applicable GST</span></div></div>";

    const form = footer.querySelector("[data-subscribe]");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      footer.querySelector("[data-subscribed]").hidden = false;
      form.reset();
    });
  }

  syncCartPill();
  document.addEventListener("cart:change", syncCartPill);
  document.addEventListener("wish:change", syncCartPill);
}

function syncCartPill() {
  const pill = document.querySelector("[data-cart-pill]");
  if (pill) pill.textContent = "Cart (" + cartCount() + ")";
  const wl = document.querySelector("[data-wish-link]");
  if (wl) wl.textContent = "Wishlist (" + readWish().length + ")";
}

/* ---------- product card ---------- */

function starsHTML(r) {
  const full = Math.round(r);
  return '<span class="stars" aria-label="' + r.toFixed(1) + ' out of 5">' +
    "\u2605".repeat(full) + "\u2606".repeat(5 - full) + "</span>";
}

function cardHTML(p) {
  const off = p.mrp ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
  const href = "product.html?id=" + p.id;
  const wished = readWish().includes(p.id);
  const avail = availableOf(p);
  const sold = soldOf(p);
  const pct = Math.round((sold / (sold + avail)) * 100);
  return (
    '<article class="card">' +
    '<div class="card-media">' +
    (off > 0 ? '<span class="card-tag">-' + off + "%</span>" : "") +
    '<button class="wish" data-wish="' + p.id + '" data-on="' + wished + '" aria-label="Add to wishlist">' +
    (wished ? "\u2665" : "\u2661") +
    "</button>" +
    '<a href="' + href + '"><img src="' + productImage(p) + '" alt="' + p.name + '" loading="lazy" width="600" height="600"></a>' +
    "</div>" +
    '<div class="card-body">' +
    '<span class="card-origin">' + categoryName(p.category) + "</span>" +
    '<a href="' + href + '" class="card-name">' + p.name + "</a>" +
    starsHTML(ratingOf(p)) +
    '<span class="card-unit">' + p.unit + "</span>" +
    '<div class="price-row">' +
    (p.mrp ? '<span class="mrp">' + formatINR(p.mrp) + "</span>" : "") +
    '<span class="price">' + formatINR(p.price) + "</span>" +
    "</div>" +
    '<div class="stock-row"><span>Available: ' + avail + "</span><span>Sold: " + sold + "</span></div>" +
    '<div class="stock-bar"><i style="width:' + pct + '%"></i></div>' +
    '<button class="btn btn-solid btn-block" data-add="' + p.id + '">Add to basket</button>' +
    "</div></article>"
  );
}

function bindCards(root) {
  root.addEventListener("click", function (e) {
    const wish = e.target.closest("[data-wish]");
    if (wish) {
      const on = toggleWish(wish.dataset.wish);
      wish.dataset.on = String(on);
      wish.textContent = on ? "\u2665" : "\u2661";
      return;
    }
    const add = e.target.closest("[data-add]");
    if (add) {
      addToCart(add.dataset.add, 1);
      add.textContent = "Added \u2713";
      setTimeout(function () {
        add.textContent = "Add to basket";
      }, 1200);
    }
  });
}

/* ---------- countdown ---------- */

function startCountdown(el) {
  const end = new Date();
  end.setDate(end.getDate() + 3);
  end.setHours(23, 59, 59, 0);
  function tick() {
    const ms = Math.max(0, end - new Date());
    const d = Math.floor(ms / 86400000);
    const h = Math.floor(ms / 3600000) % 24;
    const m = Math.floor(ms / 60000) % 60;
    const s = Math.floor(ms / 1000) % 60;
    const cell = (v, l) => "<div><b>" + String(v).padStart(2, "0") + "</b><span>" + l + "</span></div>";
    el.innerHTML = cell(d, "Days") + cell(h, "Hours") + cell(m, "Mins") + cell(s, "Secs");
  }
  tick();
  setInterval(tick, 1000);
}

/* ---------- carousel ---------- */

function initCarousel(wrap) {
  if (!wrap) return;
  const rail = wrap.querySelector("[data-deals], .deal-rail");
  const scope = wrap.closest("section") || document;
  const prev = scope.querySelector("[data-car-prev]");
  const next = scope.querySelector("[data-car-next]");
  if (!rail || !prev || !next) return;
  const step = () => {
    const first = rail.firstElementChild;
    return first ? first.getBoundingClientRect().width + 18 : rail.clientWidth * 0.8;
  };
  const sync = () => {
    prev.disabled = rail.scrollLeft <= 4;
    next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4;
  };
  prev.addEventListener("click", () => { rail.scrollLeft -= step(); });
  next.addEventListener("click", () => { rail.scrollLeft += step(); });
  rail.addEventListener("scroll", sync);
  window.addEventListener("resize", sync);
  sync();
}

const qs = (k) => new URLSearchParams(location.search).get(k);

document.addEventListener("DOMContentLoaded", renderChrome);
