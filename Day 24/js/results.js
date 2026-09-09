(function () {
  const search = currentSearch();
  if (!search) { location.replace("index.html"); return; }

  const listEl = document.getElementById("train-list");
  const countEl = document.getElementById("result-count");
  const filters = document.getElementById("filters");
  let sort = "dep";

  document.getElementById("journey-title").textContent =
    `${shortStation(search.from)} → ${shortStation(search.to)}`;
  document.getElementById("journey-meta").textContent =
    `${formatDateLong(search.date)} · ${search.cls === "ALL" ? "All classes" : CLASS_LABELS[search.cls]} · ${search.quota} quota`;
  document.title = `${search.from} to ${search.to} trains — Indian Railways prototype`;

  let all = searchTrains(search.from, search.to, search.date, search.cls);

  /* --- dynamic filter options --- */
  function checkboxes(container, name, values) {
    container.innerHTML = values.map((v) =>
      `<label class="check"><input type="checkbox" name="${name}" value="${v.value}" /> ${v.label}</label>`).join("");
  }
  const types = [...new Set(all.map((t) => t.type))];
  checkboxes(document.getElementById("type-filters"), "type", types.map((t) => ({ value: t, label: t })));
  const classes = [...new Set(all.flatMap((t) => t.classes.map((c) => c.code)))];
  checkboxes(document.getElementById("class-filters"), "cls", classes.map((c) => ({ value: c, label: `${c} — ${CLASS_LABELS[c].replace(/\s*\(.*\)/, "")}` })));

  /* --- date strip --- */
  const strip = document.getElementById("date-strip");
  for (let i = -2; i <= 4; i++) {
    const iso = addDays(search.date, i);
    if (iso < todayISO()) continue;
    const sum = dateSummary(search.from, search.to, iso);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "date-chip";
    btn.setAttribute("aria-pressed", String(iso === search.date));
    btn.innerHTML = `<b>${formatDateShort(iso)} · ${weekday(iso)}</b>
      <span class="fare small">${sum ? rupees(sum.fare) : "—"}</span>
      <span class="st st-${sum ? (sum.kind === "err" ? "err" : sum.kind) : "muted"}">${sum ? sum.label : "No direct trains"}</span>`;
    btn.addEventListener("click", () => {
      search.date = iso;
      store.set(STORE_KEYS.search, search);
      location.reload();
    });
    strip.appendChild(btn);
  }

  /* --- filtering --- */
  function checked(name) {
    return [...filters.querySelectorAll(`input[name="${name}"]:checked`)].map((i) => i.value);
  }
  function inBand(hhmm, bands) {
    if (!bands.length) return true;
    const h = minutesOf(hhmm) / 60;
    return bands.some((b) => { const [a, z] = b.split("-").map(Number); return h >= a && h < z; });
  }

  function visibleTrains() {
    const depB = checked("dep"), arrB = checked("arr"), typeF = checked("type"), clsF = checked("cls"), availF = checked("avail");
    const maxDur = Number(document.getElementById("dur").value);
    return all.filter((t) => {
      if (!inBand(t.dep, depB) || !inBand(t.arr, arrB)) return false;
      if (typeF.length && !typeF.includes(t.type)) return false;
      if (t.durationMins > maxDur) return false;
      let cls = t.classes;
      if (clsF.length) cls = cls.filter((c) => clsF.includes(c.code));
      if (availF.length) cls = cls.filter((c) => availF.includes(c.avail.kind));
      if (!cls.length) return false;
      t._shown = cls;
      return true;
    });
  }

  function cheapest(t) { return Math.min(...(t._shown || t.classes).map((c) => c.fare)); }

  function sorted(list) {
    const copy = [...list];
    if (sort === "dep") copy.sort((a, b) => minutesOf(a.dep) - minutesOf(b.dep));
    if (sort === "arr") copy.sort((a, b) => minutesOf(a.arr) - minutesOf(b.arr));
    if (sort === "dur") copy.sort((a, b) => a.durationMins - b.durationMins);
    if (sort === "price") copy.sort((a, b) => cheapest(a) - cheapest(b));
    return copy;
  }

  function badgeClass(kind) { return kind === "ok" ? "badge-ok" : kind === "warn" ? "badge-warn" : "badge-err"; }

  function render() {
    const list = sorted(visibleTrains());
    countEl.textContent = `${list.length} train${list.length === 1 ? "" : "s"} found for ${formatDateShort(search.date)}`;
    listEl.innerHTML = "";

    if (!list.length) {
      listEl.innerHTML = `<div class="card empty"><h2>No trains match your filters</h2>
        <p class="small">Try clearing filters, choosing a nearby date, or searching a different pair of stations.</p></div>`;
      return;
    }

    list.forEach((t) => {
      const card = document.createElement("article");
      card.className = "card train-card";
      const cls = t._shown || t.classes;
      card.innerHTML = `
        <div class="train-top">
          <div>
            <h3 class="train-name">${t.name}</h3>
            <p class="train-no mono">${t.number} · ${t.type}</p>
          </div>
          <p class="train-days small muted">Runs: ${t.days}</p>
        </div>
        <div class="timeline">
          <div><p class="t mono">${t.dep}</p><p class="stn">${t.from} · ${stationByCode(t.from) ? stationByCode(t.from).city : ""}</p></div>
          <div class="mid"><span>${formatDuration(t.durationMins)}</span><div class="bar"></div><span>${t.durationMins > 24 * 60 ? "" : "Direct"}</span></div>
          <div><p class="t mono">${t.arr}</p><p class="stn">${t.to} · ${stationByCode(t.to) ? stationByCode(t.to).city : ""}</p></div>
        </div>
        <div class="class-grid">
          ${cls.map((c) => `
            <button type="button" class="class-opt" data-cls="${c.code}" aria-pressed="false">
              <span class="ct"><span>${c.code}</span><span class="mono">${rupees(c.fare)}</span></span>
              <span class="cs st-${c.avail.kind === "err" ? "err" : c.avail.kind}">${c.avail.text}</span>
            </button>`).join("")}
        </div>
        <div class="train-actions"><button type="button" class="btn btn-primary" data-select>Select Train</button></div>`;

      let picked = cls[0].code;
      const opts = card.querySelectorAll(".class-opt");
      const mark = () => opts.forEach((o) => o.setAttribute("aria-pressed", String(o.dataset.cls === picked)));
      mark();
      opts.forEach((o) => o.addEventListener("click", () => { picked = o.dataset.cls; mark(); }));

      card.querySelector("[data-select]").addEventListener("click", () => {
        store.set(STORE_KEYS.train, { train: { ...t, _shown: undefined }, cls: picked, search });
        location.href = "train.html";
      });

      listEl.appendChild(card);
    });
  }

  filters.addEventListener("change", render);
  document.getElementById("dur").addEventListener("input", (e) => {
    document.getElementById("dur-out").textContent = formatDuration(Number(e.target.value));
    render();
  });
  document.getElementById("filter-clear").addEventListener("click", () => {
    filters.reset();
    document.getElementById("dur").value = 1800;
    document.getElementById("dur-out").textContent = "24h";
    render();
    toast("Filters cleared");
  });

  const openBtn = document.getElementById("filter-open");
  openBtn.addEventListener("click", () => {
    const open = filters.dataset.open !== "true";
    filters.dataset.open = String(open);
    openBtn.setAttribute("aria-expanded", String(open));
  });
  document.getElementById("filter-done").addEventListener("click", () => {
    filters.dataset.open = "false";
    openBtn.setAttribute("aria-expanded", "false");
    openBtn.focus();
  });

  document.querySelectorAll("[data-sort]").forEach((b) => {
    b.addEventListener("click", () => {
      sort = b.dataset.sort;
      document.querySelectorAll("[data-sort]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      render();
    });
  });

  render();
})();
