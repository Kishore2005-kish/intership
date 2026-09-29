/* ===== Packages page: search, category + duration + price filters, sort ===== */
document.addEventListener("DOMContentLoaded", function () {
  const qInput = qs("#q");
  const catSelect = qs("#category");
  const priceSelect = qs("#price");
  const sortSelect = qs("#sort");
  const chipRow = qs("#durationChips");
  const results = qs("#results");
  const empty = qs("#empty");
  const count = qs("#count");

  const DURATIONS = [
    { key: "any", label: "Any duration" },
    { key: "short", label: "Up to 5 days" },
    { key: "mid", label: "6–7 days" },
    { key: "long", label: "8 days +" },
  ];

  catSelect.innerHTML = CATEGORIES.map(function (c) {
    return '<option value="' + c + '">' + (c === "All" ? "All categories" : c) + "</option>";
  }).join("");

  const saved = Store.read("pkgFilters", {});
  let duration = saved.duration || "any";
  const destParam = getParam("destination");

  qInput.value = getParam("q") || saved.q || "";
  catSelect.value = getParam("category") || saved.category || "All";
  priceSelect.value = saved.price || "0";
  sortSelect.value = saved.sort || "popular";

  chipRow.innerHTML = DURATIONS.map(function (d) {
    return '<button type="button" class="chip' + (d.key === duration ? " active" : "") + '" data-key="' + d.key + '">' + d.label + "</button>";
  }).join("");

  chipRow.addEventListener("click", function (e) {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    duration = btn.dataset.key;
    qsa(".chip", chipRow).forEach(function (c) { c.classList.toggle("active", c === btn); });
    apply();
  });

  function matchDuration(p) {
    if (duration === "short") return p.days <= 5;
    if (duration === "mid") return p.days === 6 || p.days === 7;
    if (duration === "long") return p.days >= 8;
    return true;
  }

  function apply() {
    const q = qInput.value.trim().toLowerCase();
    const cat = catSelect.value;
    const maxPrice = Number(priceSelect.value);
    const sort = sortSelect.value;

    Store.write("pkgFilters", {
      q: q, category: cat, price: priceSelect.value, sort: sort, duration: duration,
    });

    let list = PACKAGES.filter(function (p) {
      const haystack = (p.title + " " + p.location + " " + p.summary + " " + p.category).toLowerCase();
      const matchQ = !q || haystack.indexOf(q) > -1;
      const matchCat = cat === "All" || p.category === cat;
      const matchPrice = !maxPrice || p.price <= maxPrice;
      const matchDest = !destParam || p.destinationId === destParam;
      return matchQ && matchCat && matchPrice && matchDest && matchDuration(p);
    });

    list.sort(function (a, b) {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "duration") return a.days - b.days;
      if (sort === "name") return a.title.localeCompare(b.title);
      return b.rating - a.rating;
    });

    results.innerHTML = list.map(packageCard).join("");
    empty.style.display = list.length ? "none" : "block";
    count.textContent = list.length + (list.length === 1 ? " package" : " packages") + " available";
  }

  [qInput, catSelect, priceSelect, sortSelect].forEach(function (el) {
    el.addEventListener("input", apply);
    el.addEventListener("change", apply);
  });

  qs("#reset").addEventListener("click", function () {
    qInput.value = "";
    catSelect.value = "All";
    priceSelect.value = "0";
    sortSelect.value = "popular";
    duration = "any";
    qsa(".chip", chipRow).forEach(function (c) { c.classList.toggle("active", c.dataset.key === "any"); });
    if (destParam) window.location.href = "packages.html";
    apply();
  });

  apply();
});
