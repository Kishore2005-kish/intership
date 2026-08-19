/* Fresh Kirana — plain JavaScript store logic */

const CAT_BY_SLUG = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c]));
const P_BY_ID = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));

const productImage = (p) => (CAT_BY_SLUG[p.category] || CATEGORIES[0]).image;
const categoryName = (slug) => (CAT_BY_SLUG[slug] ? CAT_BY_SLUG[slug].name : slug);
const formatINR = (n) =>
  "\u20B9" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

/* ---------- cart ---------- */

const CART_KEY = "fresh-kirana-cart";

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

/* ---------- chrome ---------- */

const navLink = (slug, label, cls) =>
  '<a href="shop.html?category=' + slug + '"' + (cls ? ' class="' + cls + '"' : "") + ">" + label + "</a>";

function renderChrome() {
  const header = document.querySelector("[data-header]");
  if (header) {
    header.innerHTML =
      '<div class="announce">Free delivery on orders above \u20B9499 \u00B7 Same-day slots in Mumbai, Bengaluru, Delhi &amp; Chennai</div>' +
      '<div class="topbar"><div class="wrap"><nav aria-label="Secondary">' +
      '<a href="about.html">About us</a><a href="contact.html">Stores</a>' +
      navLink("spices", "Spice journal") +
      "</nav><span>Delivering across India \u00B7 \u20B9 INR</span></div></div>" +
      '<div class="masthead"><div class="wrap">' +
      '<a href="index.html" class="wordmark">Fresh Kirana</a>' +
      '<nav class="mainnav" aria-label="Primary">' +
      navLink("fruits", "Fruits") +
      navLink("vegetables", "Vegetables") +
      navLink("dairy-eggs", "Dairy") +
      navLink("atta-rice", "Atta &amp; Rice") +
      navLink("spices", "Spices") +
      navLink("all", "All") +
      navLink("snacks", "Offers", "sale") +
      "</nav>" +
      '<div class="utility"><a href="about.html">Account</a>' +
      '<a href="cart.html" class="cart-pill" data-cart-pill>Cart (0)</a></div>' +
      "</div></div>";
  }

  const footer = document.querySelector("[data-footer]");
  if (footer) {
    const col = (title, links) =>
      "<div><h4>" +
      title +
      "</h4><ul>" +
      links.map((l) => "<li><a href=\"" + l[1] + "\">" + l[0] + "</a></li>").join("") +
      "</ul></div>";
    footer.innerHTML =
      '<div class="wrap"><div class="footer-grid">' +
      col("Shop", [
        ["Fruits", "shop.html?category=fruits"],
        ["Vegetables", "shop.html?category=vegetables"],
        ["Dals &amp; Pulses", "shop.html?category=dals-pulses"],
        ["Oils &amp; Ghee", "shop.html?category=oils-ghee"],
        ["Household", "shop.html?category=household"],
      ]) +
      col("Explore", [
        ["New arrivals", "shop.html?category=all"],
        ["Spice box", "shop.html?category=spices"],
        ["Chai &amp; coffee", "shop.html?category=beverages"],
        ["Fresh bakes", "shop.html?category=bakery"],
      ]) +
      col("About", [
        ["Our story", "about.html"],
        ["Farmer network", "about.html"],
        ["Stores", "contact.html"],
        ["Contact us", "contact.html"],
      ]) +
      col("Help", [
        ["Delivery slots", "contact.html"],
        ["Returns &amp; refunds", "contact.html"],
        ["Track order", "contact.html"],
        ["FAQs", "contact.html"],
      ]) +
      '<div><h4>Stay in the know</h4>' +
      '<p style="font-size:13px;margin:0;color:var(--muted)">Seasonal harvests, festive hampers and weekend offers.</p>' +
      '<form class="subscribe" data-subscribe><input type="email" required placeholder="Email address" aria-label="Email address"><button type="submit">Subscribe</button></form>' +
      '<p class="free-note" data-subscribed hidden>Thanks — you\'re on the list.</p></div>' +
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
}

function syncCartPill() {
  const pill = document.querySelector("[data-cart-pill]");
  if (pill) pill.textContent = "Cart (" + cartCount() + ")";
}

/* ---------- product card ---------- */

function cardHTML(p) {
  const off = p.mrp ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
  const href = "product.html?id=" + p.id;
  return (
    '<article class="card">' +
    '<div class="card-media">' +
    (off > 0 ? '<span class="card-tag">' + off + "% off</span>" : "") +
    '<button class="wish" data-on="false" aria-label="Add to wishlist">\u2661</button>' +
    '<a href="' + href + '"><img src="' + productImage(p) + '" alt="' + p.name + '" loading="lazy" width="600" height="600"></a>' +
    "</div>" +
    '<div class="card-body">' +
    '<a href="' + href + '" class="card-name">' + p.name + "</a>" +
    '<span class="card-unit">' + p.unit + "</span>" +
    '<span class="card-origin">' + p.origin + "</span>" +
    '<div class="price-row"><span class="price">' + formatINR(p.price) + "</span>" +
    (p.mrp ? '<span class="mrp">' + formatINR(p.mrp) + "</span>" : "") +
    "</div>" +
    '<button class="btn btn-block btn-solid" data-add="' + p.id + '">Add to basket</button>' +
    "</div></article>"
  );
}

function bindCards(root) {
  root.addEventListener("click", function (e) {
    const wish = e.target.closest(".wish");
    if (wish) {
      const on = wish.dataset.on === "true";
      wish.dataset.on = String(!on);
      wish.textContent = on ? "\u2661" : "\u2665";
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

const qs = (k) => new URLSearchParams(location.search).get(k);

document.addEventListener("DOMContentLoaded", renderChrome);
