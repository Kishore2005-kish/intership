(function () {
  const form = document.getElementById("pnr-form");
  const input = document.getElementById("pnr");
  const err = document.getElementById("pnr-error");
  const out = document.getElementById("result");

  function localBooking(pnr) {
    const list = store.get(STORE_KEYS.bookings, []);
    const b = list.find((x) => x.pnr === pnr);
    if (!b) return null;
    return {
      trainNo: b.train.number, trainName: b.train.name, date: formatDateLong(b.search.date),
      from: stationLabel(b.train.from), to: stationLabel(b.train.to), boarding: b.train.from,
      cls: b.cls, quota: b.search.quota, chart: "Chart not prepared",
      passengers: b.passengers.map((p) => ({ name: p.name, booking: `CNF/${p.coach}/${p.seat}/${p.allotted}`, current: `CNF/${p.coach}/${p.seat}/${p.allotted}`, status: "ok" })),
    };
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = input.value.trim();
    if (!/^\d{10}$/.test(val)) {
      err.textContent = "Enter a 10-digit PNR number (digits only).";
      input.setAttribute("aria-invalid", "true");
      input.focus();
      out.innerHTML = "";
      return;
    }
    err.textContent = "";
    input.setAttribute("aria-invalid", "false");

    const data = DEMO_PNRS[val] || localBooking(val);
    if (!data) {
      out.innerHTML = `<div class="card card-pad">
        <span class="badge badge-err">Not found</span>
        <h2 style="margin-top:10px">No demo booking for PNR ${val}</h2>
        <p class="small muted" style="margin-top:6px">This prototype only recognises the sample PNRs listed above and bookings you complete in this browser.</p>
      </div>`;
      return;
    }

    out.innerHTML = `<div class="card card-pad">
      <div class="spread" style="flex-wrap:wrap">
        <div>
          <h2>${data.trainName} <span class="mono muted">· ${data.trainNo}</span></h2>
          <p class="small muted">${data.from} → ${data.to}</p>
        </div>
        <span class="badge ${data.chart === "Chart prepared" ? "badge-ok" : "badge-neutral"}">${data.chart}</span>
      </div>
      <dl class="kv" style="margin-top:16px">
        <dt>PNR</dt><dd class="mono">${val}</dd>
        <dt>Journey date</dt><dd>${data.date}</dd>
        <dt>Boarding station</dt><dd>${data.boarding}</dd>
        <dt>Destination</dt><dd>${data.to}</dd>
        <dt>Class</dt><dd>${CLASS_LABELS[data.cls] || data.cls}</dd>
        <dt>Quota</dt><dd>${data.quota}</dd>
      </dl>
      <h3 style="margin-top:20px">Passenger status</h3>
      <table class="data" style="margin-top:8px">
        <thead><tr><th>Passenger</th><th>Booking status</th><th>Current status</th></tr></thead>
        <tbody>${data.passengers.map((p) => `<tr>
          <td>${p.name}</td><td class="mono">${p.booking}</td>
          <td><span class="badge ${p.status === "ok" ? "badge-ok" : "badge-warn"}">${p.current}</span></td></tr>`).join("")}
        </tbody>
      </table>
      <p class="demo-tag" style="margin-top:14px">Demo data — this status is generated for prototype purposes and is not live railway information.</p>
    </div>`;
    toast("Demo PNR status loaded");
  });
})();
