import { PRODUCTS, byId } from "./data.js";

export const money = (n) =>
  "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 0 });

/* ---------------- storage ---------------- */
const read = (k, fb) => { try { return JSON.parse(localStorage.getItem(k)) ?? fb; } catch { return fb; } };
const write = (k, v) => { localStorage.setItem(k, JSON.stringify(v)); document.dispatchEvent(new CustomEvent("store:change", { detail: k })); };

export const cart = {
  all: () => read("al_cart", []),
  count: () => cart.all().reduce((n, l) => n + l.qty, 0),
  add(id, qty = 1) {
    const lines = cart.all();
    const found = lines.find((l) => l.id === id);
    if (found) found.qty += qty; else lines.push({ id, qty });
    write("al_cart", lines);
    toast("Added to bag");
  },
  setQty(id, qty) {
    let lines = cart.all().map((l) => (l.id === id ? { ...l, qty } : l)).filter((l) => l.qty > 0);
    write("al_cart", lines);
  },
  remove(id) { write("al_cart", cart.all().filter((l) => l.id !== id)); toast("Removed"); },
  clear() { write("al_cart", []); },
  detailed() { return cart.all().map((l) => ({ ...byId(l.id), qty: l.qty })).filter((l) => l.id); },
  subtotal() { return cart.detailed().reduce((s, l) => s + l.price * l.qty, 0); },
};

export const wishlist = {
  all: () => read("al_wish", []),
  has: (id) => wishlist.all().includes(id),
  toggle(id) {
    const list = wishlist.all();
    const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
    write("al_wish", next);
    toast(next.includes(id) ? "Saved to wishlist" : "Removed from wishlist");
    return next.includes(id);
  },
  remove(id) { write("al_wish", wishlist.all().filter((x) => x !== id)); },
};

/* ---------------- toast ---------------- */
let toastEl;
export function toast(msg) {
  if (!toastEl) {
    toastEl = document.createElement("div");
    toastEl.className = "toast";
    document.body.appendChild(toastEl);
  }
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastEl._t);
  toastEl._t = setTimeout(() => toastEl.classList.remove("show"), 2200);
}

/* ---------------- chrome ---------------- */
const NAV = [
  ["shop.html", "Shop"],
  ["rooms.html", "Rooms"],
  ["designers.html", "Designers"],
  ["story.html", "Our Story"],
];

function headerHTML(current) {
  return `
  <div class="ticker">Complimentary white-glove delivery over ₹50,000 · Made to order in 6–9 weeks</div>
  <header class="site-head">
    <div class="wrap head-top">
      <a class="brand" href="index.html">Alder &amp; Lane<small>Curated Interiors · Est. 1974</small></a>
      <nav class="head-nav" id="navList" aria-label="Main">
        ${NAV.map(([h, l]) => `<a href="${h}"${current === h ? ' aria-current="page"' : ""}>${l}</a>`).join("")}
      </nav>
      <div class="head-tools">
        <button class="icon-btn nav-toggle" id="navToggle" aria-expanded="false">Menu</button>
        <button class="icon-btn" id="searchToggle" aria-expanded="false">Search</button>
        <a class="icon-btn" href="wishlist.html">Saved <span class="badge" data-wish-count></span></a>
        <a class="icon-btn" href="cart.html">Bag <span class="badge" data-cart-count></span></a>
      </div>
    </div>
    <div class="searchbar" id="searchbar">
      <div class="wrap">
        <label class="sr-only" for="searchInput">Search the collection</label>
        <input id="searchInput" type="search" placeholder="Search pieces, materials, rooms…" autocomplete="off">
        <div class="search-results" id="searchResults"></div>
      </div>
    </div>
  </header>`;
}

function footerHTML() {
  return `
  <footer class="site-foot">
    <div class="wrap">
      <div class="foot-cols">
        <div><h4>Shop</h4><ul>
          <li><a href="shop.html?room=living">Living Room</a></li>
          <li><a href="shop.html?room=bedroom">Bedroom</a></li>
          <li><a href="shop.html?room=dining">Dining Room</a></li>
          <li><a href="shop.html?room=office">Home Office</a></li>
          <li><a href="shop.html?sale=1">Sale</a></li>
        </ul></div>
        <div><h4>Explore</h4><ul>
          <li><a href="rooms.html">Room Inspiration</a></li>
          <li><a href="designers.html">Designers</a></li>
          <li><a href="story.html">Our Story</a></li>
          <li><a href="shop.html?sort=new">New Arrivals</a></li>
        </ul></div>
        <div><h4>Help</h4><ul>
          <li><a href="story.html#care">Care Guide</a></li>
          <li><a href="story.html#delivery">Shipping &amp; Delivery</a></li>
          <li><a href="story.html#delivery">Returns</a></li>
          <li><a href="cart.html">Your Bag</a></li>
        </ul></div>
        <div><h4>Studio</h4><ul>
          <li>45 Innovation Drive, Bangalore</li>
          <li>hello@alderandlane.co</li>
          <li>+91 80 1234 5678</li>
          <li>Tue–Sat, 10–6</li>
        </ul></div>
        <div>
          <h4>Stay in the Know</h4>
          <p class="muted" style="font-size:.85rem">Seasonal drops, plates from the workshop, and the occasional long lunch.</p>
          <form class="news-mini" data-news>
            <div class="field" style="margin:0">
              <input type="email" required placeholder="Email address" aria-label="Email address">
            </div>
            <button class="btn btn-ghost" style="margin-top:.6rem">Subscribe</button>
          </form>
        </div>
      </div>
      <div class="foot-bottom meta">
        <span>© ${new Date().getFullYear()} Alder &amp; Lane</span>
        <span>Plates photographed in Bangalore &amp; Jaipur</span>
      </div>
    </div>
  </footer>`;
}

export function mountChrome() {
  const current = location.pathname.split("/").pop() || "index.html";
  const h = document.getElementById("site-header");
  const f = document.getElementById("site-footer");
  if (h) h.innerHTML = headerHTML(current);
  if (f) f.innerHTML = footerHTML();

  const nt = document.getElementById("navToggle");
  nt?.addEventListener("click", () => {
    const list = document.getElementById("navList");
    const open = list.classList.toggle("open");
    nt.setAttribute("aria-expanded", String(open));
  });

  const st = document.getElementById("searchToggle");
  const bar = document.getElementById("searchbar");
  st?.addEventListener("click", () => {
    const open = bar.classList.toggle("open");
    st.setAttribute("aria-expanded", String(open));
    if (open) document.getElementById("searchInput").focus();
  });
  document.getElementById("searchInput")?.addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    const out = document.getElementById("searchResults");
    if (q.length < 2) { out.innerHTML = ""; return; }
    const hits = PRODUCTS.filter((p) =>
      [p.name, p.categoryName, p.roomName, p.material, p.colourName, p.designerName].join(" ").toLowerCase().includes(q)
    ).slice(0, 7);
    out.innerHTML = hits.length
      ? hits.map((p) => `<a href="product.html?id=${p.id}"><span>${p.name}</span><span class="meta">${p.categoryName} · ${money(p.price)}</span></a>`).join("")
      : `<p class="meta">No pieces match “${q}”</p>`;
  });

  document.querySelectorAll("[data-news]").forEach((form) =>
    form.addEventListener("submit", (e) => { e.preventDefault(); form.reset(); toast("Welcome to the list"); })
  );

  syncBadges();
  document.addEventListener("store:change", syncBadges);
  observeReveals();
}

function syncBadges() {
  const c = cart.count(), w = wishlist.all().length;
  document.querySelectorAll("[data-cart-count]").forEach((el) => (el.textContent = c ? `(${c})` : ""));
  document.querySelectorAll("[data-wish-count]").forEach((el) => (el.textContent = w ? `(${w})` : ""));
}

export function observeReveals() {
  const els = document.querySelectorAll(".reveal:not(.in)");
  if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { rootMargin: "-40px" });
  els.forEach((el) => io.observe(el));
}

/* ---------------- product card ---------------- */
export function cardHTML(p) {
  return `
  <article class="card">
    ${p.sale ? '<span class="flag">Sale</span>' : ""}
    <div class="card-fig">
      <span class="card-idx">No. ${p.index}</span>
      <button class="card-fav" data-fav="${p.id}" aria-pressed="${wishlist.has(p.id)}" aria-label="Save ${p.name}">${wishlist.has(p.id) ? "&#10022;" : "&#9734;"}</button>
      <img class="studio" src="${p.studio}" alt="${p.name}" loading="lazy">
      <img class="scene" src="${p.scene}" alt="${p.name} in a ${p.roomName.toLowerCase()} setting" loading="lazy">
    </div>
    <div class="card-body">
      <a href="product.html?id=${p.id}"><h3>${p.name}</h3></a>
      <span class="designer">${p.designerName}</span>
      <p class="meta">${p.material} · ${p.colourName} · ${p.roomName}</p>
      <p class="price">${p.was ? `<span class="strike">${money(p.was)}</span>` : ""}${money(p.price)}</p>
      <p class="note" style="margin:.7rem 0 1rem;font-size:.84rem">${p.note}</p>
      <button class="btn btn-ghost" data-add="${p.id}">Add to bag</button>
    </div>
  </article>`;
}

export function bindCardActions(root = document) {
  root.querySelectorAll("[data-add]").forEach((b) =>
    b.addEventListener("click", () => cart.add(b.dataset.add))
  );
  root.querySelectorAll("[data-fav]").forEach((b) =>
    b.addEventListener("click", () => {
      const on = wishlist.toggle(b.dataset.fav);
      b.setAttribute("aria-pressed", String(on));
      b.innerHTML = on ? "&#10022;" : "&#9734;";
    })
  );
}
