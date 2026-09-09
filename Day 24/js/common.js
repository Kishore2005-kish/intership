/* Shared helpers: storage, formatting, header behaviour, autocomplete, toasts. */

const STORE_KEYS = { search: "ir_search", train: "ir_train", pax: "ir_pax", booking: "ir_booking", bookings: "ir_bookings" };

const store = {
  get(key, fallback = null) {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
    catch (e) { return fallback; }
  },
  set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} },
  remove(key) { try { localStorage.removeItem(key); } catch (e) {} },
};

function stationByCode(code) { return STATIONS.find((s) => s.code === code) || null; }
function stationLabel(code) { const s = stationByCode(code); return s ? `${s.name} (${s.code})` : code; }
function shortStation(code) { const s = stationByCode(code); return s ? `${s.city} (${s.code})` : code; }

function rupees(n) { return "₹" + Math.round(n).toLocaleString("en-IN"); }

function pad(n) { return String(n).padStart(2, "0"); }
function toISO(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function parseISO(s) { const [y, m, d] = String(s).split("-").map(Number); return new Date(y, (m || 1) - 1, d || 1); }
function formatDateLong(iso) {
  const d = parseISO(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}
function formatDateShort(iso) {
  const d = parseISO(iso);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}
function weekday(iso) { return parseISO(iso).toLocaleDateString("en-IN", { weekday: "short" }); }
function addDays(iso, n) { const d = parseISO(iso); d.setDate(d.getDate() + n); return toISO(d); }
function todayISO() { return toISO(new Date()); }

function minutesOf(hhmm) { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; }
function durationBetween(dep, arr) {
  let mins = minutesOf(arr) - minutesOf(dep);
  if (mins <= 0) mins += 24 * 60;
  return mins;
}
function formatDuration(mins) { return `${Math.floor(mins / 60)}h ${pad(mins % 60)}m`; }

/* Deterministic pseudo-random so demo fares/availability stay stable per train+date. */
function seededRandom(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
  return function () { h += 0x6d2b79f5; let t = h; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/* --- Header behaviour (nav toggle + services menu) --- */
function initHeader() {
  if (window.__headerInit) return;
  window.__headerInit = true;
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }
  document.querySelectorAll("[data-menu-button]").forEach((btn) => {
    const panel = document.getElementById(btn.getAttribute("aria-controls"));
    if (!panel) return;
    const close = () => { panel.dataset.open = "false"; btn.setAttribute("aria-expanded", "false"); };
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = panel.dataset.open !== "true";
      panel.dataset.open = String(open);
      btn.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", (e) => { if (!panel.contains(e.target) && e.target !== btn) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  });

  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a[data-page]").forEach((a) => {
    if (a.getAttribute("data-page") === path) a.setAttribute("aria-current", "page");
  });
}

/* --- Toast --- */
function toast(message) {
  let region = document.querySelector(".toast-region");
  if (!region) {
    region = document.createElement("div");
    region.className = "toast-region";
    region.setAttribute("role", "status");
    region.setAttribute("aria-live", "polite");
    document.body.appendChild(region);
  }
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  region.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

/* --- Station autocomplete (keyboard accessible combobox) --- */
function initStationAutocomplete(input) {
  const listId = input.id + "-list";
  const list = document.createElement("ul");
  list.className = "ac-list hide";
  list.id = listId;
  list.setAttribute("role", "listbox");
  input.parentElement.appendChild(list);

  input.setAttribute("role", "combobox");
  input.setAttribute("aria-expanded", "false");
  input.setAttribute("aria-controls", listId);
  input.setAttribute("aria-autocomplete", "list");
  input.autocomplete = "off";

  let items = [];
  let active = -1;

  function close() { list.classList.add("hide"); input.setAttribute("aria-expanded", "false"); active = -1; }
  function pick(st) {
    input.value = `${st.name} (${st.code})`;
    input.dataset.code = st.code;
    close();
    input.dispatchEvent(new CustomEvent("station:change", { bubbles: true, detail: st }));
  }
  function render(q) {
    const term = q.trim().toLowerCase();
    items = STATIONS.filter((s) =>
      !term || s.code.toLowerCase().startsWith(term) || s.name.toLowerCase().includes(term) || s.city.toLowerCase().includes(term)
    ).slice(0, 8);
    list.innerHTML = "";
    if (!items.length) { close(); return; }
    items.forEach((s, i) => {
      const li = document.createElement("li");
      li.id = `${listId}-opt-${i}`;
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", "false");
      li.innerHTML = `<span>${s.name}<br><span class="small muted">${s.city}</span></span><span class="ac-code">${s.code}</span>`;
      li.addEventListener("mousedown", (e) => { e.preventDefault(); pick(s); });
      list.appendChild(li);
    });
    list.classList.remove("hide");
    input.setAttribute("aria-expanded", "true");
  }
  function highlight(idx) {
    active = idx;
    [...list.children].forEach((li, i) => li.setAttribute("aria-selected", String(i === idx)));
    input.setAttribute("aria-activedescendant", idx >= 0 ? `${listId}-opt-${idx}` : "");
    if (idx >= 0) list.children[idx].scrollIntoView({ block: "nearest" });
  }

  input.addEventListener("input", () => { input.dataset.code = ""; render(input.value); });
  input.addEventListener("focus", () => render(input.value));
  input.addEventListener("blur", () => setTimeout(close, 120));
  input.addEventListener("keydown", (e) => {
    if (list.classList.contains("hide") && (e.key === "ArrowDown")) { render(input.value); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); highlight(Math.min(active + 1, items.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); highlight(Math.max(active - 1, 0)); }
    else if (e.key === "Enter") { if (active >= 0) { e.preventDefault(); pick(items[active]); } }
    else if (e.key === "Escape") close();
  });
}

function setStationInput(input, code) {
  const st = stationByCode(code);
  if (!st) return;
  input.value = `${st.name} (${st.code})`;
  input.dataset.code = st.code;
}

/* --- Demo train search --- */
function distanceGuess(a, b) {
  // Demo distance table for realistic-looking fares.
  const key = [a, b].sort().join("-");
  const table = {
    "MYS-SBC": 139, "MAS-SBC": 362, "MYS-MAS": 497, "JP-NDLS": 308, "CSMT-PUNE": 192,
    "MAO-CSMT": 588, "MAO-MMCT": 600, "MMCT-NDLS": 1384, "NDLS-NZM": 8, "HWH-NDLS": 1451,
    "NDLS-SBC": 2444, "CSMT-HWH": 1968, "HWH-YPR": 1955, "NDLS-SDAH": 1458, "NZM-TVC": 2818,
    "NDLS-TVC": 3054, "ERS-MAS": 694, "HYB-NDLS": 1661, "HYB-MAS": 794, "ADI-MMCT": 493,
    "HWH-NJP": 561, "NJP-SDAH": 566, "JP-MMCT": 1157,
  };
  return table[key] || 420;
}

function classFare(cls, km, seedFn) {
  const base = 32 + km * 0.42 * (CLASS_FARE_FACTOR[cls] || 1);
  const jitter = 1 + (seedFn() - 0.5) * 0.08;
  return Math.round((base * jitter) / 5) * 5;
}

function availabilityFor(seedFn) {
  const r = seedFn();
  if (r > 0.62) return { kind: "ok", short: "Available", text: `Available — ${Math.ceil(seedFn() * 90) + 4} seats` };
  if (r > 0.34) return { kind: "warn", short: "Limited", text: `Limited — ${Math.ceil(seedFn() * 12) + 1} seats left` };
  if (r > 0.14) return { kind: "warn", short: "RAC", text: `RAC ${Math.ceil(seedFn() * 24) + 1}` };
  return { kind: "err", short: "Waitlist", text: `Waitlist — WL ${Math.ceil(seedFn() * 60) + 3}` };
}

/* Returns trains serving from->to (direct or via a documented leg). */
function searchTrains(from, to, date, cls) {
  const km = distanceGuess(from, to);
  const results = [];

  TRAINS.forEach((t) => {
    let dep = null, arr = null, match = false;
    const legKey = `${from}-${to}`;
    if (t.legs && t.legs[legKey]) { dep = t.legs[legKey].dep; arr = t.legs[legKey].arr; match = true; }
    else if (t.from === from && t.to === to) { dep = t.dep; arr = t.arr; match = true; }
    else if (t.via && t.via.includes(from) && t.to === to) {
      match = true;
      dep = t.legs && t.legs[legKey] ? t.legs[legKey].dep : t.dep;
      arr = t.arr;
    }
    if (!match) return;

    const number = t.label || t.no;
    const seed = seededRandom(number + from + to + date);
    const classes = t.classes
      .filter((c) => cls === "ALL" || c === cls)
      .map((c) => {
        const avail = availabilityFor(seed);
        return { code: c, label: CLASS_LABELS[c], fare: classFare(c, km, seed), avail };
      });
    if (!classes.length) return;

    results.push({
      number, name: t.name, type: t.type, days: t.days,
      from, to, dep, arr,
      durationMins: durationBetween(dep, arr),
      classes,
    });
  });

  return results.sort((a, b) => minutesOf(a.dep) - minutesOf(b.dep));
}

/* Cheapest fare + overall availability for a date (used by the date strip). */
function dateSummary(from, to, iso) {
  const trains = searchTrains(from, to, iso, "ALL");
  if (!trains.length) return null;
  let best = Infinity, kind = "err";
  const rank = { ok: 3, warn: 2, err: 1 };
  trains.forEach((t) => t.classes.forEach((c) => {
    if (c.fare < best) best = c.fare;
    if (rank[c.avail.kind] > rank[kind]) kind = c.avail.kind;
  }));
  const label = kind === "ok" ? "Available" : kind === "warn" ? "Limited" : "Waitlist";
  return { fare: best, kind, label };
}

function currentSearch() {
  const s = store.get(STORE_KEYS.search);
  if (s && s.from && s.to && s.date) return s;
  return null;
}

document.addEventListener("DOMContentLoaded", initHeader);
