(function () {
  const form = document.getElementById("booking-form");
  const fromEl = document.getElementById("from");
  const toEl = document.getElementById("to");
  const dateEl = document.getElementById("date");
  const clsEl = document.getElementById("cls");
  const quotaEl = document.getElementById("quota");

  initStationAutocomplete(fromEl);
  initStationAutocomplete(toEl);

  dateEl.min = todayISO();
  dateEl.max = addDays(todayISO(), 120);

  // Restore last search, else sensible defaults.
  const saved = currentSearch();
  setStationInput(fromEl, saved ? saved.from : "SBC");
  setStationInput(toEl, saved ? saved.to : "MYS");
  dateEl.value = saved && saved.date >= todayISO() ? saved.date : addDays(todayISO(), 1);
  if (saved) { clsEl.value = saved.cls; quotaEl.value = saved.quota; }

  document.getElementById("swap").addEventListener("click", () => {
    const a = { v: fromEl.value, c: fromEl.dataset.code };
    fromEl.value = toEl.value; fromEl.dataset.code = toEl.dataset.code || "";
    toEl.value = a.v; toEl.dataset.code = a.c || "";
    toast("Stations swapped");
    fromEl.focus();
  });

  // Popular journeys
  const routesEl = document.getElementById("routes");
  POPULAR_ROUTES.forEach((r) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "route-btn";
    const summary = dateSummary(r.from, r.to, dateEl.value);
    btn.innerHTML = `<span><b>${r.label}</b><span class="codes">${r.from} → ${r.to}</span></span>
      <span class="small ${summary ? "st-" + (summary.kind === "err" ? "err" : summary.kind) : "muted"}">${summary ? "from " + rupees(summary.fare) : "View trains"}</span>`;
    btn.addEventListener("click", () => {
      setStationInput(fromEl, r.from);
      setStationInput(toEl, r.to);
      document.getElementById("booking-form").scrollIntoView({ behavior: "smooth", block: "center" });
      toast(`${r.label} filled in — choose a date and search`);
      dateEl.focus({ preventScroll: true });
    });
    routesEl.appendChild(btn);
  });

  function setError(input, id, msg) {
    const p = document.getElementById(id);
    p.textContent = msg || "";
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const from = fromEl.dataset.code;
    const to = toEl.dataset.code;
    let ok = true;

    ok = setError(fromEl, "from-error", from ? "" : "Select an origin station from the list.") && ok;
    ok = setError(toEl, "to-error", to ? "" : "Select a destination station from the list.") && ok;
    if (from && to && from === to) ok = setError(toEl, "to-error", "Origin and destination must be different.") && ok;
    ok = setError(dateEl, "date-error", dateEl.value ? (dateEl.value < todayISO() ? "Choose today or a later date." : "") : "Choose a journey date.") && ok;

    if (!ok) {
      const firstBad = form.querySelector('[aria-invalid="true"]');
      if (firstBad) firstBad.focus();
      return;
    }

    store.set(STORE_KEYS.search, {
      from, to, date: dateEl.value, cls: clsEl.value, quota: quotaEl.value,
      flexi: document.getElementById("flexi").checked,
    });
    store.remove(STORE_KEYS.train);
    location.href = "results.html";
  });
})();
