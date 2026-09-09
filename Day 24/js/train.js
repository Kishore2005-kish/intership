(function () {
  const sel = store.get(STORE_KEYS.train);
  if (!sel) { location.replace("index.html"); return; }
  const { train, search } = sel;
  let cls = sel.cls;

  document.getElementById("t-name").textContent = train.name;
  document.getElementById("t-no").textContent = `${train.number} · ${train.type} · Runs: ${train.days}`;
  document.title = `${train.name} (${train.number}) — Indian Railways prototype`;

  document.getElementById("t-timeline").innerHTML = `
    <div><p class="t mono">${train.dep}</p><p class="stn">${stationLabel(train.from)}</p><p class="small muted">${formatDateLong(search.date)}</p></div>
    <div class="mid"><span>${formatDuration(train.durationMins)}</span><div class="bar"></div><span>Direct</span></div>
    <div><p class="t mono">${train.arr}</p><p class="stn">${stationLabel(train.to)}</p><p class="small muted">${minutesOf(train.arr) <= minutesOf(train.dep) ? "Next day" : "Same day"}</p></div>`;

  function renderSide() {
    const c = train.classes.find((x) => x.code === cls);
    document.getElementById("t-side").innerHTML = `
      <dt>Journey</dt><dd>${shortStation(train.from)} → ${shortStation(train.to)}</dd>
      <dt>Date</dt><dd>${formatDateLong(search.date)}</dd>
      <dt>Train</dt><dd>${train.name} (${train.number})</dd>
      <dt>Departure</dt><dd class="mono">${train.dep}</dd>
      <dt>Arrival</dt><dd class="mono">${train.arr}</dd>
      <dt>Class</dt><dd>${CLASS_LABELS[c.code]}</dd>
      <dt>Quota</dt><dd>${search.quota}</dd>
      <dt>Availability</dt><dd class="st-${c.avail.kind === "err" ? "err" : c.avail.kind}">${c.avail.text}</dd>
      <dt>Fare per passenger</dt><dd class="mono">${rupees(c.fare)}</dd>`;
  }

  const grid = document.getElementById("t-classes");
  grid.innerHTML = train.classes.map((c) => `
    <button type="button" class="class-opt" data-cls="${c.code}" aria-pressed="${c.code === cls}">
      <span class="ct"><span>${c.code}</span><span class="mono">${rupees(c.fare)}</span></span>
      <span class="cs st-${c.avail.kind === "err" ? "err" : c.avail.kind}">${c.avail.text}</span>
      <span class="small muted">${CLASS_LABELS[c.code].replace(/\s*\(.*\)/, "")}</span>
    </button>`).join("");
  grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".class-opt");
    if (!btn) return;
    cls = btn.dataset.cls;
    grid.querySelectorAll(".class-opt").forEach((o) => o.setAttribute("aria-pressed", String(o.dataset.cls === cls)));
    renderSide();
  });

  document.getElementById("t-kv").innerHTML = `
    <dt>Service type</dt><dd>${train.type}</dd>
    <dt>Running days</dt><dd>${train.days}</dd>
    <dt>Route</dt><dd>${stationLabel(train.from)} → ${stationLabel(train.to)}</dd>
    <dt>Total duration</dt><dd>${formatDuration(train.durationMins)}</dd>
    <dt>Quota</dt><dd>${search.quota}</dd>
    <dt>Pantry</dt><dd>${["Rajdhani", "Vande Bharat", "Shatabdi", "Tejas", "Duronto"].includes(train.type) ? "Catering included" : "Pantry car available"}</dd>`;

  renderSide();

  document.getElementById("continue").addEventListener("click", () => {
    store.set(STORE_KEYS.train, { train, cls, search });
    location.href = "passenger.html";
  });
})();
