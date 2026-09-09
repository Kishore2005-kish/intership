(function () {
  const pick = document.getElementById("train-pick");
  const out = document.getElementById("status");

  pick.innerHTML = LIVE_TRAINS.map((t, i) => `<option value="${i}">${t.no} — ${t.name}</option>`).join("");

  function render(i) {
    const t = LIVE_TRAINS[i];
    const idx = t.stops.findIndex((s) => s.state === "current");
    const prev = t.stops[idx - 1], cur = t.stops[idx], next = t.stops[idx + 1];
    const delayBadge = t.delay === 0
      ? '<span class="badge badge-ok">On time</span>'
      : `<span class="badge ${t.delay > 30 ? "badge-err" : "badge-warn"}">Running late — ${t.delay} min</span>`;

    out.innerHTML = `<div class="card card-pad">
      <div class="spread" style="flex-wrap:wrap">
        <div><h2>${t.name} <span class="mono muted">· ${t.no}</span></h2>
        <p class="small muted">Status updated ${t.updated}</p></div>
        ${delayBadge}
      </div>

      <dl class="kv" style="margin-top:16px">
        <dt>Current station</dt><dd>${cur.name} (${cur.code})</dd>
        <dt>Previous station</dt><dd>${prev ? `${prev.name} (${prev.code})` : "Journey origin"}</dd>
        <dt>Next station</dt><dd>${next ? `${next.name} (${next.code})` : "Destination reached"}</dd>
        <dt>Expected arrival</dt><dd class="mono">${next ? next.act : cur.act} <span class="muted small">(scheduled ${next ? next.sch : cur.sch})</span></dd>
        <dt>Expected departure</dt><dd class="mono">${cur.act}</dd>
        <dt>Delay</dt><dd>${t.delay === 0 ? "On time" : t.delay + " minutes late"}</dd>
      </dl>

      <h3 style="margin-top:22px">Schedule and running status</h3>
      <table class="data" style="margin-top:8px">
        <thead><tr><th>Station</th><th>Scheduled</th><th>Expected / actual</th><th>Status</th></tr></thead>
        <tbody>${t.stops.map((s) => `<tr>
          <td>${s.name} <span class="mono muted">${s.code}</span></td>
          <td class="mono">${s.sch}</td>
          <td class="mono">${s.act}</td>
          <td>${s.state === "departed" ? '<span class="badge badge-neutral">Departed</span>'
            : s.state === "current" ? '<span class="badge badge-ok">At station</span>'
            : '<span class="badge badge-warn">Upcoming</span>'}</td></tr>`).join("")}
        </tbody>
      </table>
      <p class="demo-tag" style="margin-top:14px">Demo live-status data — shown for prototype purposes only.</p>
    </div>`;
  }

  pick.addEventListener("change", () => render(Number(pick.value)));
  render(0);
})();
