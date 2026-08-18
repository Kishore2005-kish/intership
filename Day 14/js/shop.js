import { PRODUCTS, CATEGORIES, ROOMS, MATERIALS, COLOURS } from "./data.js";
import { mountChrome, cardHTML, bindCardActions, money, observeReveals } from "./site.js";

mountChrome();

const params = new URLSearchParams(location.search);
const state = {
  category: (params.get("category") || "").split(",").filter(Boolean),
  room: (params.get("room") || "").split(",").filter(Boolean),
  material: (params.get("material") || "").split(",").filter(Boolean),
  colour: (params.get("colour") || "").split(",").filter(Boolean),
  max: Number(params.get("max")) || 3200,
  sale: params.get("sale") === "1",
  sort: params.get("sort") || "curated",
  view: params.get("view") || "grid",
};

const filters = document.getElementById("filters");
filters.innerHTML = `
  <div class="fgroup"><h4>Category</h4>${CATEGORIES.map((c) =>
    `<label><input type="checkbox" data-f="category" value="${c.id}"${state.category.includes(c.id) ? " checked" : ""}> ${c.name}</label>`).join("")}</div>
  <div class="fgroup"><h4>Room</h4>${ROOMS.map((r) =>
    `<label><input type="checkbox" data-f="room" value="${r.id}"${state.room.includes(r.id) ? " checked" : ""}> ${r.name}</label>`).join("")}</div>
  <div class="fgroup"><h4>Material</h4>${MATERIALS.map((m) =>
    `<label><input type="checkbox" data-f="material" value="${m}"${state.material.includes(m) ? " checked" : ""}> ${m}</label>`).join("")}</div>
  <div class="fgroup"><h4>Colour</h4><div class="swatches">${COLOURS.map((c) =>
    `<button class="swatch" data-colour="${c.id}" title="${c.name}" aria-label="${c.name}" aria-pressed="${state.colour.includes(c.id)}" style="background:${c.hex}"></button>`).join("")}</div></div>
  <div class="fgroup"><h4>Price · up to <span id="maxOut">${money(state.max)}</span></h4>
    <input type="range" id="maxRange" min="300" max="3200" step="50" value="${state.max}"></div>
  <div class="fgroup"><h4>Edit</h4><label><input type="checkbox" id="saleOnly"${state.sale ? " checked" : ""}> On sale only</label></div>
  <button class="btn btn-ghost" id="clearAll" style="margin-top:1rem">Clear all</button>`;

const sortSel = document.getElementById("sort");
sortSel.value = state.sort;
const results = document.getElementById("results");

function apply() {
  let list = PRODUCTS.filter((p) =>
    (!state.category.length || state.category.includes(p.category)) &&
    (!state.room.length || state.room.includes(p.room)) &&
    (!state.material.length || state.material.includes(p.material)) &&
    (!state.colour.length || state.colour.includes(p.colour)) &&
    p.price <= state.max &&
    (!state.sale || p.sale)
  );
  if (state.sort === "low") list.sort((a, b) => a.price - b.price);
  if (state.sort === "high") list.sort((a, b) => b.price - a.price);
  if (state.sort === "new") list.reverse();

  document.getElementById("count").textContent =
    `${list.length} piece${list.length === 1 ? "" : "s"}`;

  results.className = state.view === "list" ? "list-products grid-products" : "grid-products";
  results.style.gridTemplateColumns = state.view === "list" ? "1fr" : "";
  results.innerHTML = list.length
    ? list.map(cardHTML).join("")
    : `<div class="empty"><p class="h-md">Nothing in this corner of the archive.</p><p class="muted">Loosen a filter and try again.</p></div>`;
  bindCardActions(results);

  const chips = [
    ...state.category.map((c) => ["category", c, CATEGORIES.find((x) => x.id === c).name]),
    ...state.room.map((r) => ["room", r, ROOMS.find((x) => x.id === r).name]),
    ...state.material.map((m) => ["material", m, m]),
    ...state.colour.map((c) => ["colour", c, COLOURS.find((x) => x.id === c).name]),
    ...(state.sale ? [["sale", "1", "On sale"]] : []),
  ];
  document.getElementById("chips").innerHTML = chips.map(([k, v, label]) =>
    `<button class="chip" data-remove="${k}" data-value="${v}">${label} ×</button>`).join("");
  document.querySelectorAll("[data-remove]").forEach((b) =>
    b.addEventListener("click", () => {
      const k = b.dataset.remove;
      if (k === "sale") { state.sale = false; document.getElementById("saleOnly").checked = false; }
      else {
        state[k] = state[k].filter((x) => x !== b.dataset.value);
        const input = filters.querySelector(`[data-f="${k}"][value="${b.dataset.value}"]`);
        if (input) input.checked = false;
        const sw = filters.querySelector(`[data-colour="${b.dataset.value}"]`);
        if (k === "colour" && sw) sw.setAttribute("aria-pressed", "false");
      }
      sync();
    }));

  const url = new URLSearchParams();
  ["category", "room", "material", "colour"].forEach((k) => state[k].length && url.set(k, state[k].join(",")));
  if (state.max !== 3200) url.set("max", state.max);
  if (state.sale) url.set("sale", "1");
  if (state.sort !== "curated") url.set("sort", state.sort);
  if (state.view !== "grid") url.set("view", state.view);
  history.replaceState(null, "", url.toString() ? `?${url}` : location.pathname);
  observeReveals();
}
const sync = apply;

filters.querySelectorAll("[data-f]").forEach((input) =>
  input.addEventListener("change", () => {
    const k = input.dataset.f;
    state[k] = [...filters.querySelectorAll(`[data-f="${k}"]:checked`)].map((i) => i.value);
    apply();
  }));
filters.querySelectorAll("[data-colour]").forEach((b) =>
  b.addEventListener("click", () => {
    const on = b.getAttribute("aria-pressed") !== "true";
    b.setAttribute("aria-pressed", String(on));
    state.colour = on ? [...state.colour, b.dataset.colour] : state.colour.filter((c) => c !== b.dataset.colour);
    apply();
  }));
document.getElementById("maxRange").addEventListener("input", (e) => {
  state.max = Number(e.target.value);
  document.getElementById("maxOut").textContent = money(state.max);
  apply();
});
document.getElementById("saleOnly").addEventListener("change", (e) => { state.sale = e.target.checked; apply(); });
document.getElementById("clearAll").addEventListener("click", () => {
  Object.assign(state, { category: [], room: [], material: [], colour: [], max: 3200, sale: false });
  filters.querySelectorAll("input[type=checkbox]").forEach((i) => (i.checked = false));
  filters.querySelectorAll("[data-colour]").forEach((b) => b.setAttribute("aria-pressed", "false"));
  document.getElementById("maxRange").value = 3200;
  document.getElementById("maxOut").textContent = money(3200);
  apply();
});
sortSel.addEventListener("change", (e) => { state.sort = e.target.value; apply(); });
document.querySelectorAll("[data-view]").forEach((b) =>
  b.addEventListener("click", () => {
    state.view = b.dataset.view;
    document.querySelectorAll("[data-view]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    apply();
  }));
document.querySelectorAll("[data-view]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.view === state.view)));

apply();
