(function () {
  const wrap = document.getElementById("trips");
  const modal = document.getElementById("cancel-modal");
  let pending = null, lastFocus = null;

  function bookings() { return store.get(STORE_KEYS.bookings, []); }

  function render() {
    const list = bookings();
    if (!list.length) {
      wrap.innerHTML = `<div class="card empty">
        <h2>No bookings yet</h2>
        <p class="small" style="margin-top:8px">Complete a demo booking to see it here, along with cancellation and refund status.</p>
        <p style="margin-top:16px"><a class="btn btn-primary" href="index.html">Search trains</a></p></div>`;
      return;
    }
    wrap.innerHTML = list.map((b) => `
      <article class="card card-pad" style="margin-bottom:16px">
        <div class="spread" style="flex-wrap:wrap;align-items:flex-start">
          <div>
            <h2 style="font-size:1.05rem">${b.train.name} <span class="mono muted">· ${b.train.number}</span></h2>
            <p class="small muted">${shortStation(b.train.from)} → ${shortStation(b.train.to)} · ${formatDateLong(b.search.date)}</p>
          </div>
          <span class="badge ${b.cancelled ? "badge-err" : "badge-ok"}">${b.cancelled ? "Cancelled" : "Confirmed"}</span>
        </div>
        <dl class="kv" style="margin-top:14px">
          <dt>PNR</dt><dd class="mono">${b.pnr}</dd>
          <dt>Departure</dt><dd class="mono">${b.train.dep} · ${b.train.from}</dd>
          <dt>Class</dt><dd>${CLASS_LABELS[b.cls]}</dd>
          <dt>Passengers</dt><dd>${b.passengers.map((p) => `${p.name} (${p.coach} ${p.seat})`).join(", ")}</dd>
          <dt>Total paid (demo)</dt><dd class="mono">${rupees(b.fare.total)}</dd>
          ${b.cancelled ? `<dt>Refund status</dt><dd class="st-warn">Refund of ${rupees(b.refund)} initiated — expected in 3–5 working days (demo)</dd>` : ""}
        </dl>
        <div class="row" style="margin-top:16px;flex-wrap:wrap">
          <a class="btn btn-secondary btn-sm" href="pnr.html">Check PNR status</a>
          <a class="btn btn-secondary btn-sm" href="live.html">Live status</a>
          ${b.cancelled ? "" : `<button class="btn btn-danger btn-sm" data-cancel="${b.pnr}">Cancel ticket</button>`}
        </div>
      </article>`).join("");
  }

  function closeModal() {
    modal.dataset.open = "false";
    pending = null;
    if (lastFocus) lastFocus.focus();
  }

  wrap.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-cancel]");
    if (!btn) return;
    pending = btn.dataset.cancel;
    lastFocus = btn;
    const b = bookings().find((x) => x.pnr === pending);
    document.getElementById("cancel-body").textContent =
      `PNR ${pending} · ${b.train.name}. A cancellation charge of ${rupees(Math.round(b.fare.total * 0.25))} would apply under Indian Railways rules. This is a demo action — no real ticket is cancelled.`;
    modal.dataset.open = "true";
    document.getElementById("cancel-no").focus();
  });

  document.getElementById("cancel-no").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.dataset.open === "true") closeModal(); });

  document.getElementById("cancel-yes").addEventListener("click", () => {
    const list = bookings();
    const b = list.find((x) => x.pnr === pending);
    if (b) { b.cancelled = true; b.refund = Math.round(b.fare.total * 0.75); }
    store.set(STORE_KEYS.bookings, list);
    closeModal();
    render();
    toast("Demo ticket cancelled — refund status updated");
  });

  render();
})();
