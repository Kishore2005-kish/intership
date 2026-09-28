/* ===== Destinations page: search, filter, sort ===== */
document.addEventListener("DOMContentLoaded", function () {
  const qInput = qs("#q");
  const catSelect = qs("#category");
  const priceSelect = qs("#price");
  const sortSelect = qs("#sort");
  const results = qs("#results");
  const empty = qs("#empty");
  const count = qs("#count");

  catSelect.innerHTML = CATEGORIES.map(function (c) {
    return '<option value="' + c + '">' + (c === "All" ? "All categories" : c) + "</option>";
  }).join("");

  const saved = Store.read("destFilters", {});
  qInput.value = getParam("q") || saved.q || "";
  catSelect.value = getParam("category") || saved.category || "All";
  priceSelect.value = saved.price || "0";
  sortSelect.value = saved.sort || "popular";

  function apply() {
    const q = qInput.value.trim().toLowerCase();
    const cat = catSelect.value;
    const maxPrice = Number(priceSelect.value);
    const sort = sortSelect.value;

    Store.write("destFilters", { q: q, category: cat, price: priceSelect.value, sort: sort });

    let list = DESTINATIONS.filter(function (d) {
      const matchQ = !q || (d.name + " " + d.description + " " + d.category).toLowerCase().indexOf(q) > -1;
      const matchCat = cat === "All" || d.category === cat;
      const matchPrice = !maxPrice || d.price <= maxPrice;
      return matchQ && matchCat && matchPrice;
    });

    list.sort(function (a, b) {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "days") return a.days - b.days;
      return b.rating - a.rating;
    });

    results.innerHTML = list.map(destinationCard).join("");
    empty.style.display = list.length ? "none" : "block";
    count.textContent = list.length + (list.length === 1 ? " destination" : " destinations") + " found";
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
    apply();
  });

  apply();
});
