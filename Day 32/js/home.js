/* ===== Home page: category chips, search, featured content ===== */
document.addEventListener("DOMContentLoaded", function () {
  const chipRow = qs("#homeChips");
  const grid = qs("#homeDestinations");
  let active = Store.read("homeCategory", "All");
  if (CATEGORIES.indexOf(active) === -1) active = "All";

  function renderDestinations() {
    const list = DESTINATIONS.filter(function (d) {
      return active === "All" || d.category === active;
    }).slice(0, 6);
    grid.innerHTML = list.map(destinationCard).join("");
  }

  chipRow.innerHTML = CATEGORIES.map(function (c) {
    return '<button type="button" class="chip' + (c === active ? " active" : "") + '" data-cat="' + c + '">' + c + "</button>";
  }).join("");

  chipRow.addEventListener("click", function (e) {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    active = btn.dataset.cat;
    Store.write("homeCategory", active);
    qsa(".chip", chipRow).forEach(function (c) { c.classList.toggle("active", c === btn); });
    renderDestinations();
  });

  renderDestinations();

  /* Featured packages: best rated first */
  qs("#homePackages").innerHTML = PACKAGES.slice()
    .sort(function (a, b) { return b.rating - a.rating; })
    .slice(0, 6)
    .map(packageCard)
    .join("");

  /* Testimonials */
  qs("#homeTestimonials").innerHTML = TESTIMONIALS.map(function (t) {
    return (
      '<div class="quote"><div class="stars">★★★★★</div>' +
      "<p>“" + t.text + "”</p>" +
      '<div class="who"><img src="' + t.avatar + '" alt="' + t.name + '" loading="lazy">' +
      "<div><strong>" + t.name + '</strong><div class="muted" style="font-size:.85rem">' + t.trip + "</div></div></div></div>"
    );
  }).join("");

  /* Hero search */
  const catSelect = qs("#heroCategory");
  catSelect.innerHTML = CATEGORIES.map(function (c) {
    return '<option value="' + c + '">' + (c === "All" ? "All categories" : c) + "</option>";
  }).join("");

  qs("#heroSearch").addEventListener("submit", function (e) {
    e.preventDefault();
    const q = qs("#heroQuery").value.trim();
    const cat = catSelect.value;
    Store.write("lastSearch", { q: q, cat: cat });
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (cat && cat !== "All") params.set("category", cat);
    window.location.href = "packages.html" + (params.toString() ? "?" + params.toString() : "");
  });

  const last = Store.read("lastSearch", null);
  if (last) {
    qs("#heroQuery").value = last.q || "";
    if (CATEGORIES.indexOf(last.cat) > -1) catSelect.value = last.cat;
  }
});
