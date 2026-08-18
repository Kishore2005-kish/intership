import { DESIGNERS, PRODUCTS } from "./data.js";
import { mountChrome, money, observeReveals } from "./site.js";
mountChrome();

document.getElementById("designers").innerHTML = DESIGNERS.map((d) => {
  const pieces = PRODUCTS.filter((p) => p.designer === d.id);
  return `
  <article class="designer-card reveal">
    <img src="img/${d.img}" alt="Portrait of ${d.name}" loading="lazy">
    <div>
      <p class="meta meta-brass">${d.based} · ${pieces.length} pieces</p>
      <h2 class="h-lg" style="margin-top:.3rem">${d.name}<span class="script">in their words</span></h2>
      <p class="pull" style="margin:.8rem 0">“${d.line}”</p>
      <p class="muted">${d.bio}</p>
      <div class="mini-row">${pieces.slice(0, 8).map((p) => `
        <a class="mini" href="product.html?id=${p.id}">
          <img src="${p.studio}" alt="${p.name}" loading="lazy">
          <span>${p.name}</span>
          <span class="meta">${money(p.price)}</span>
        </a>`).join("")}</div>
      <a class="btn btn-ghost" style="margin-top:1.2rem" href="shop.html">See the full archive</a>
    </div>
  </article>`;
}).join("");
observeReveals();
