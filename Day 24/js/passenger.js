(function () {
  const sel = store.get(STORE_KEYS.train);
  if (!sel) { location.replace("index.html"); return; }
  const { train, cls, search } = sel;
  const fare = train.classes.find((c) => c.code === cls);

  const listEl = document.getElementById("pax-list");
  const form = document.getElementById("pax-form");
  const MAX = 6;
  const isSitting = ["CC", "EC", "2S"].includes(cls);

  document.getElementById("side").innerHTML = `
    <dt>Route</dt><dd>${shortStation(train.from)} → ${shortStation(train.to)}</dd>
    <dt>Date</dt><dd>${formatDateLong(search.date)}</dd>
    <dt>Train</dt><dd>${train.name} (${train.number})</dd>
    <dt>Departure</dt><dd class="mono">${train.dep} · ${train.from}</dd>
    <dt>Arrival</dt><dd class="mono">${train.arr} · ${train.to}</dd>
    <dt>Class</dt><dd>${CLASS_LABELS[cls]}</dd>
    <dt>Quota</dt><dd>${search.quota}</dd>`;

  function berthOptions() {
    if (isSitting) return ["No Preference", "Window", "Aisle"];
    return ["No Preference", "Lower", "Middle", "Upper", "Side Lower", "Side Upper"];
  }

  function rowTemplate(i, data) {
    data = data || {};
    return `
    <fieldset class="pax" data-index="${i}">
      <div class="pax-head">
        <legend><h2 style="font-size:1rem">Passenger ${i + 1}</h2></legend>
        ${i > 0 ? `<button type="button" class="btn btn-danger btn-sm" data-remove="${i}">Remove passenger ${i + 1}</button>` : ""}
      </div>
      <div class="pax-grid">
        <div class="field">
          <label for="name-${i}">Full name</label>
          <input type="text" id="name-${i}" data-f="name" value="${data.name || ""}" placeholder="As per ID proof" aria-describedby="name-${i}-error" />
          <p class="error-text" id="name-${i}-error" role="alert"></p>
        </div>
        <div class="field">
          <label for="age-${i}">Age</label>
          <input type="number" id="age-${i}" data-f="age" min="1" max="120" value="${data.age || ""}" aria-describedby="age-${i}-error" />
          <p class="error-text" id="age-${i}-error" role="alert"></p>
        </div>
        <div class="field">
          <label for="gender-${i}">Gender</label>
          <select id="gender-${i}" data-f="gender">
            <option value="">Select</option>
            ${["Male", "Female", "Other"].map((g) => `<option ${data.gender === g ? "selected" : ""}>${g}</option>`).join("")}
          </select>
          <p class="error-text" id="gender-${i}-error" role="alert"></p>
        </div>
        <div class="field">
          <label for="berth-${i}">${isSitting ? "Seat preference" : "Berth preference"}</label>
          <select id="berth-${i}" data-f="berth">
            ${berthOptions().map((b) => `<option ${data.berth === b ? "selected" : ""}>${b}</option>`).join("")}
          </select>
        </div>
      </div>
    </fieldset>`;
  }

  let saved = store.get(STORE_KEYS.pax);
  let rows = (saved && saved.passengers && saved.passengers.length ? saved.passengers : [{}]).slice(0, MAX);

  function render() {
    listEl.innerHTML = rows.map((p, i) => rowTemplate(i, p)).join("");
    document.getElementById("add-pax").disabled = rows.length >= MAX;
    updateFare();
  }

  function collect() {
    return [...listEl.querySelectorAll(".pax")].map((fs) => {
      const o = {};
      fs.querySelectorAll("[data-f]").forEach((el) => { o[el.dataset.f] = el.value.trim(); });
      return o;
    });
  }

  function updateFare() {
    const n = listEl.querySelectorAll(".pax").length;
    const base = fare.fare * n;
    const res = 20 * n;
    const gst = ["1A", "2A", "3A", "3E", "CC", "EC"].includes(cls) ? Math.round(base * 0.05) : 0;
    document.getElementById("fare-preview").innerHTML = `
      <h3>Fare estimate</h3>
      <div class="fare-line"><span>Base fare × ${n}</span><span class="mono">${rupees(base)}</span></div>
      <div class="fare-line"><span>Reservation / service charge</span><span class="mono">${rupees(res)}</span></div>
      ${gst ? `<div class="fare-line"><span>GST</span><span class="mono">${rupees(gst)}</span></div>` : ""}
      <div class="fare-total"><span>Total</span><span class="mono">${rupees(base + res + gst)}</span></div>`;
  }

  listEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-remove]");
    if (!btn) return;
    rows = collect();
    rows.splice(Number(btn.dataset.remove), 1);
    render();
    toast("Passenger removed");
  });
  listEl.addEventListener("input", updateFare);

  document.getElementById("add-pax").addEventListener("click", () => {
    rows = collect();
    if (rows.length >= MAX) return;
    rows.push({});
    render();
    const next = document.getElementById(`name-${rows.length - 1}`);
    if (next) next.focus();
    toast(`Passenger ${rows.length} added`);
  });

  function setErr(el, id, msg) {
    const p = document.getElementById(id);
    if (p) p.textContent = msg || "";
    el.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;

    [...listEl.querySelectorAll(".pax")].forEach((fs, i) => {
      const name = fs.querySelector('[data-f="name"]');
      const age = fs.querySelector('[data-f="age"]');
      const gender = fs.querySelector('[data-f="gender"]');
      const nameOk = /^[A-Za-z][A-Za-z .'-]{1,49}$/.test(name.value.trim());
      ok = setErr(name, `name-${i}-error`, nameOk ? "" : "Enter the full name as printed on the ID (letters only, at least 2 characters).") && ok;
      const a = Number(age.value);
      ok = setErr(age, `age-${i}-error`, age.value && a >= 1 && a <= 120 ? "" : "Enter an age between 1 and 120.") && ok;
      ok = setErr(gender, `gender-${i}-error`, gender.value ? "" : "Select a gender.") && ok;
    });

    const mobile = document.getElementById("mobile");
    const email = document.getElementById("email");
    ok = setErr(mobile, "mobile-error", /^[6-9]\d{9}$/.test(mobile.value.trim()) ? "" : "Enter a valid 10-digit Indian mobile number.") && ok;
    ok = setErr(email, "email-error", /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email.value.trim()) ? "" : "Enter a valid email address.") && ok;

    const summary = document.getElementById("form-error");
    if (!ok) {
      summary.textContent = "Please correct the highlighted fields before continuing.";
      const bad = form.querySelector('[aria-invalid="true"]');
      if (bad) bad.focus();
      return;
    }
    summary.textContent = "";

    store.set(STORE_KEYS.pax, { passengers: collect(), mobile: mobile.value.trim(), email: email.value.trim() });
    location.href = "summary.html";
  });

  if (saved) {
    document.getElementById("mobile").value = saved.mobile || "";
    document.getElementById("email").value = saved.email || "";
  }
  render();
})();
