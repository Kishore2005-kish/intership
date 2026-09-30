/* ============ Events listing: search, filters, sorting ============ */

const filters = {
  search: "",
  category: "all",
  ticket: "all",
  price: "all",
  from: "",
  to: "",
  sort: "date-asc",
  savedOnly: false
};

function matchesPrice(event) {
  if (filters.price === "all") return true;
  if (filters.price === "free") return event.price === 0;
  if (filters.price === "0-15000") return event.price > 0 && event.price <= 15000;
  if (filters.price === "15000-30000") return event.price > 15000 && event.price <= 30000;
  if (filters.price === "30000+") return event.price > 30000;
  return true;
}

function matchesTicket(event) {
  if (filters.ticket === "all") return true;
  return event.tickets.some(function (t) { return t.type === filters.ticket; });
}

function matchesSearch(event) {
  if (!filters.search) return true;
  const q = filters.search.toLowerCase();
  const speakerNames = event.speakers.map(function (id) {
    const sp = getSpeaker(id);
    return sp ? sp.name : "";
  }).join(" ");
  return (
    event.title + " " + event.city + " " + event.venue + " " + event.summary + " " + categoryName(event.category) + " " + speakerNames
  ).toLowerCase().indexOf(q) !== -1;
}

function matchesDate(event) {
  if (filters.from && event.endDate < filters.from) return false;
  if (filters.to && event.date > filters.to) return false;
  return true;
}

function applyFilters() {
  let list = EVENTS.filter(function (e) {
    return matchesSearch(e) && (filters.category === "all" || e.category === filters.category) &&
      matchesPrice(e) && matchesTicket(e) && matchesDate(e) &&
      (!filters.savedOnly || isSaved(e.id));
  });

  const sorters = {
    "date-asc": function (a, b) { return a.date.localeCompare(b.date); },
    "date-desc": function (a, b) { return b.date.localeCompare(a.date); },
    "price-asc": function (a, b) { return a.price - b.price; },
    "price-desc": function (a, b) { return b.price - a.price; },
    "name-asc": function (a, b) { return a.title.localeCompare(b.title); }
  };
  list.sort(sorters[filters.sort] || sorters["date-asc"]);
  return list;
}

function renderEvents() {
  const grid = document.getElementById("eventsGrid");
  const count = document.getElementById("resultCount");
  if (!grid) return;
  const list = applyFilters();
  count.textContent = list.length + (list.length === 1 ? " event found" : " events found");
  grid.innerHTML = list.length
    ? list.map(eventCardHTML).join("")
    : '<div class="empty-state" style="grid-column:1/-1"><h3>No events match those filters</h3><p class="mt-1">Try clearing the search box or widening the date range.</p></div>';
  observeReveals();
}

function initEventsPage() {
  const grid = document.getElementById("eventsGrid");
  if (!grid) return;

  const preset = getQueryParam("category");
  if (preset) filters.category = preset;
  const presetSearch = getQueryParam("q");
  if (presetSearch) filters.search = presetSearch;

  /* category chips */
  const chipRow = document.getElementById("categoryChips");
  chipRow.innerHTML =
    '<button class="chip" type="button" data-cat="all">All</button>' +
    CATEGORIES.map(function (c) {
      return '<button class="chip" type="button" data-cat="' + c.id + '">' + c.name + "</button>";
    }).join("");
  const syncChips = function () {
    chipRow.querySelectorAll(".chip").forEach(function (chip) {
      chip.classList.toggle("is-active", chip.getAttribute("data-cat") === filters.category);
    });
  };
  chipRow.addEventListener("click", function (e) {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    filters.category = chip.getAttribute("data-cat");
    syncChips();
    renderEvents();
  });
  syncChips();

  const searchInput = document.getElementById("searchInput");
  searchInput.value = filters.search;
  searchInput.addEventListener("input", debounce(function (e) {
    filters.search = e.target.value.trim();
    renderEvents();
  }, 250));

  document.getElementById("priceFilter").addEventListener("change", function (e) {
    filters.price = e.target.value; renderEvents();
  });
  document.getElementById("ticketFilter").addEventListener("change", function (e) {
    filters.ticket = e.target.value; renderEvents();
  });
  document.getElementById("sortSelect").addEventListener("change", function (e) {
    filters.sort = e.target.value; renderEvents();
  });
  document.getElementById("fromDate").addEventListener("change", function (e) {
    filters.from = e.target.value; renderEvents();
  });
  document.getElementById("toDate").addEventListener("change", function (e) {
    filters.to = e.target.value; renderEvents();
  });
  document.getElementById("savedOnly").addEventListener("click", function (e) {
    filters.savedOnly = !filters.savedOnly;
    e.currentTarget.classList.toggle("is-active", filters.savedOnly);
    renderEvents();
  });
  document.getElementById("resetFilters").addEventListener("click", function () {
    filters.search = ""; filters.category = "all"; filters.price = "all";
    filters.ticket = "all"; filters.from = ""; filters.to = "";
    filters.sort = "date-asc"; filters.savedOnly = false;
    searchInput.value = "";
    document.getElementById("priceFilter").value = "all";
    document.getElementById("ticketFilter").value = "all";
    document.getElementById("sortSelect").value = "date-asc";
    document.getElementById("fromDate").value = "";
    document.getElementById("toDate").value = "";
    document.getElementById("savedOnly").classList.remove("is-active");
    syncChips();
    renderEvents();
  });

  renderEvents();
}

document.addEventListener("DOMContentLoaded", initEventsPage);
