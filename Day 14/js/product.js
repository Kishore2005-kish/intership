import { byId, PRODUCTS } from "./data.js";
import { mountChrome, money, cart, wishlist, cardHTML, bindCardActions, toast } from "./site.js";

mountChrome();

const id = new URLSearchParams(location.search).get("id");
const p = byId(id) || PRODUCTS[0];
document.title = `${p.name} — Alder & Lane`;

const shots = [
  { src: p.studio, contain: true, alt: `${p.name}, studio plate` },
  { src: p.scene, contain: false, alt: `${p.name} in a ${p.roomName.toLowerCase()}` },
  { src: "img/workshop-1.jpg", contain: false, alt: "Making the piece in the workshop" },
  { src: "img/workshop-2.jpg", contain: false, alt: "Fabric and finishes" },
];
let qty = 1;

document.getElementById("pdp").innerHTML = `
  <div>
    <div class="pdp-main"><img id="mainShot" class="contain" src="${shots[0].src}" alt="${shots[0].alt}"></div>
    <div class="thumbs">${shots.map((s, i) =>
      `<button data-shot="${i}" aria-pressed="${i === 0}" aria-label="${s.alt}"><img src="${s.src}" alt=""></button>`).join("")}</div>
  </div>
  <div>
    <p class="meta meta-brass">No. ${p.index} · ${p.categoryName}</p>
    <h1 class="h-lg" style="margin-top:.4rem">${p.name}<span class="script">${p.designerName}</span></h1>
    <p class="price" style="font-family:var(--font-mono);margin-top:.8rem">
      ${p.was ? `<span class="strike">${money(p.was)}</span>` : ""}${money(p.price)}</p>
    <p class="pull" style="margin:1.4rem 0">“${p.note}”</p>
    <div style="display:flex;gap:.8rem;align-items:center;flex-wrap:wrap">
      <span class="qty"><button data-q="-1" aria-label="Decrease">−</button><span id="qtyOut">1</span><button data-q="1" aria-label="Increase">+</button></span>
      <button class="btn" id="addBtn">Add to bag</button>
      <button class="btn btn-ghost" id="favBtn" aria-pressed="${wishlist.has(p.id)}">${wishlist.has(p.id) ? "Saved" : "Save"}</button>
    </div>
    <table class="spec">
      <tr><th>Dimensions</th><td>${p.dims}</td></tr>
      <tr><th>Material</th><td>${p.material}</td></tr>
      <tr><th>Colourway</th><td>${p.colourName}</td></tr>
      <tr><th>Designed for</th><td>${p.roomName}</td></tr>
      <tr><th>Lead time</th><td>Made to order, 6–9 weeks</td></tr>
      <tr><th>Care</th><td>Dust with a dry cloth; keep out of direct afternoon sun. Upholstery is professionally cleanable.</td></tr>
    </table>
  </div>`;

document.querySelectorAll("[data-shot]").forEach((b) =>
  b.addEventListener("click", () => {
    const s = shots[Number(b.dataset.shot)];
    const img = document.getElementById("mainShot");
    img.src = s.src; img.alt = s.alt;
    img.classList.toggle("contain", s.contain);
    document.querySelectorAll("[data-shot]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
  }));
document.querySelectorAll("[data-q]").forEach((b) =>
  b.addEventListener("click", () => {
    qty = Math.max(1, qty + Number(b.dataset.q));
    document.getElementById("qtyOut").textContent = qty;
  }));
document.getElementById("addBtn").addEventListener("click", () => cart.add(p.id, qty));
document.getElementById("favBtn").addEventListener("click", (e) => {
  const on = wishlist.toggle(p.id);
  e.currentTarget.textContent = on ? "Saved" : "Save";
  e.currentTarget.setAttribute("aria-pressed", String(on));
});

const pairs = PRODUCTS.filter((x) => x.room === p.room && x.id !== p.id).slice(0, 4);
const pairEl = document.getElementById("pairs");
pairEl.innerHTML = pairs.map(cardHTML).join("");
bindCardActions(pairEl);
