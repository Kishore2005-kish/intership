import { SCENES, byId } from "./data.js";
import { mountChrome, money, cart, observeReveals } from "./site.js";
mountChrome();

document.getElementById("scenes").innerHTML = SCENES.map((s, si) => `
  <section class="scene reveal">
    <img src="img/${s.img}" alt="${s.title} — a styled ${s.room} scene" loading="${si ? "lazy" : "eager"}">
    <div class="scene-label"><h2 class="h-lg" style="color:var(--white)">${s.title}<span class="script">${s.sub}</span></h2>
      <p class="meta" style="color:#e9dfd0">${s.note}</p></div>
    ${s.spots.map((sp, i) => {
      const p = byId(sp.id);
      return `<button class="hotspot" style="left:${sp.x}%;top:${sp.y}%" data-spot="${si}-${i}" aria-expanded="false"
        aria-label="Reveal ${p.name}">${i + 1}</button>
      <div class="hotcard" id="card-${si}-${i}" style="left:clamp(1rem,${sp.x}%,calc(100% - 240px));top:calc(${sp.y}% + 38px)">
        <img src="${p.studio}" alt="${p.name}">
        <p class="meta meta-brass">No. ${p.index}</p>
        <h3 style="font-size:1.1rem">${p.name}</h3>
        <p class="meta">${money(p.price)}</p>
        <div style="display:flex;gap:.4rem;margin-top:.6rem">
          <a class="btn btn-ghost" style="padding:.5rem .8rem" href="product.html?id=${p.id}">View</a>
          <button class="btn" style="padding:.5rem .8rem" data-add="${p.id}">Add</button>
        </div>
      </div>`;
    }).join("")}
  </section>`).join("");

document.querySelectorAll("[data-spot]").forEach((b) =>
  b.addEventListener("click", () => {
    const card = document.getElementById(`card-${b.dataset.spot}`);
    const open = !card.classList.contains("open");
    document.querySelectorAll(".hotcard").forEach((c) => c.classList.remove("open"));
    document.querySelectorAll("[data-spot]").forEach((x) => x.setAttribute("aria-expanded", "false"));
    card.classList.toggle("open", open);
    b.setAttribute("aria-expanded", String(open));
  }));
document.querySelectorAll("#scenes [data-add]").forEach((b) =>
  b.addEventListener("click", () => cart.add(b.dataset.add)));
observeReveals();
