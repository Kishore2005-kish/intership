import { CATEGORIES, PRODUCTS, JOURNAL } from "./data.js";
import { mountChrome, cardHTML, bindCardActions, observeReveals } from "./site.js";

mountChrome();

document.getElementById("plates").innerHTML = CATEGORIES.map((c, i) => `
  <a class="plate" href="shop.html?category=${c.id}">
    <img src="img/${c.plate}" alt="${c.name}" loading="lazy">
    <span>${c.name}</span>
    <i>Plate ${String(i + 1).padStart(2, "0")}</i>
  </a>`).join("");

const featured = ["cs-01", "cn-01", "ch-01", "lt-01"].map((id) => PRODUCTS.find((p) => p.id === id));
const grid = document.getElementById("featured");
grid.innerHTML = featured.map(cardHTML).join("");
bindCardActions(grid);

document.getElementById("journal").innerHTML = JOURNAL.map((j, i) => `
  <article class="reveal">
    <img src="img/${j.img}" alt="${j.title}" loading="lazy" style="aspect-ratio:4/3;object-fit:cover;width:100%">
    <p class="meta meta-brass" style="margin-top:.9rem">${j.kicker}</p>
    <h3 class="h-md" style="margin-top:.3rem">${j.title}</h3>
    <p class="muted" style="font-size:.9rem">${j.body}</p>
  </article>`).join("");

observeReveals();

/* gentle parallax on hero imagery */
const heroImgs = [...document.querySelectorAll(".hero-panel img")];
addEventListener("scroll", () => {
  const y = Math.min(scrollY, 700);
  heroImgs.forEach((img, i) => { img.style.transform = `translateY(${y * (i % 2 ? 0.05 : 0.08)}px) scale(1.02)`; });
}, { passive: true });
