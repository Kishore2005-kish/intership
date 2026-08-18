import { byId } from "./data.js";
import { mountChrome, wishlist, cardHTML, bindCardActions, cart } from "./site.js";
mountChrome();

function render() {
  const items = wishlist.all().map(byId).filter(Boolean);
  const el = document.getElementById("wishGrid");
  document.getElementById("wishCount").textContent = `${items.length} saved piece${items.length === 1 ? "" : "s"}`;
  if (!items.length) {
    el.className = "";
    el.innerHTML = `<div class="empty"><p class="h-md">No pieces saved yet</p>
      <p class="muted">Tap the star on any plate to keep it here.</p>
      <a class="btn" href="shop.html" style="margin-top:1rem">Open the catalogue</a></div>`;
    return;
  }
  el.className = "grid-products";
  el.innerHTML = items.map(cardHTML).join("");
  bindCardActions(el);
  el.querySelectorAll("[data-add]").forEach((b) => b.addEventListener("click", () => wishlist.remove(b.dataset.add)));
}
render();
document.addEventListener("store:change", render);
