import { mountChrome, cart, money } from "./site.js";
mountChrome();

function render() {
  const lines = cart.detailed();
  const body = document.getElementById("lines");
  if (!lines.length) {
    document.getElementById("cartGrid").innerHTML =
      `<div class="empty" style="grid-column:1/-1"><p class="h-md">Your bag is empty</p>
       <p class="muted">The archive is 36 pieces deep.</p>
       <a class="btn" href="shop.html" style="margin-top:1rem">Browse the collection</a></div>`;
    return;
  }
  body.innerHTML = lines.map((l) => `
    <div class="line">
      <div class="line-fig"><img src="${l.studio}" alt="${l.name}" loading="lazy"></div>
      <div>
        <p class="meta meta-brass">No. ${l.index} · ${l.categoryName}</p>
        <h3 class="h-md" style="font-size:1.35rem"><a href="product.html?id=${l.id}">${l.name}</a></h3>
        <p class="meta">${l.material} · ${l.colourName} · ${l.dims}</p>
        <span class="qty" style="margin-top:.6rem">
          <button data-dec="${l.id}" aria-label="Decrease">−</button><span>${l.qty}</span><button data-inc="${l.id}" aria-label="Increase">+</button>
        </span>
        <button class="icon-btn" data-del="${l.id}" style="margin-left:1rem">Remove</button>
      </div>
      <p style="font-family:var(--font-mono)">${money(l.price * l.qty)}</p>
    </div>`).join("");

  const sub = cart.subtotal();
  const ship = sub >= 750 || sub === 0 ? 0 : 45;
  document.getElementById("summary").innerHTML = `
    <p class="meta">Order summary</p>
    <dl>
      <dt>Subtotal</dt><dd>${money(sub)}</dd>
      <dt>White-glove delivery</dt><dd>${ship ? money(ship) : "Complimentary"}</dd>
      <dt>Estimated VAT included</dt><dd>${money(Math.round(sub * 0.2))}</dd>
    </dl>
    <div class="summary total">${money(sub + ship)}</div>
    <a class="btn btn-brass" href="checkout.html" style="width:100%;justify-content:center;margin-top:1.2rem">Proceed to checkout</a>
    <a class="link-u meta" href="shop.html" style="display:inline-block;margin-top:1rem">Continue browsing</a>`;

  document.querySelectorAll("[data-inc]").forEach((b) => b.onclick = () => cart.setQty(b.dataset.inc, cart.all().find((l) => l.id === b.dataset.inc).qty + 1));
  document.querySelectorAll("[data-dec]").forEach((b) => b.onclick = () => cart.setQty(b.dataset.dec, cart.all().find((l) => l.id === b.dataset.dec).qty - 1));
  document.querySelectorAll("[data-del]").forEach((b) => b.onclick = () => cart.remove(b.dataset.del));
}
render();
document.addEventListener("store:change", render);
