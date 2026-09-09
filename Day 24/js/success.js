(function () {
  const b = store.get(STORE_KEYS.booking);
  if (!b) { location.replace("index.html"); return; }

  document.getElementById("pnr").textContent = b.pnr;
  document.getElementById("sent-to").textContent =
    `A demo ticket summary would be sent to ${b.contact.email} and ${b.contact.mobile}.`;
  document.getElementById("t-head").textContent = `${b.train.name} · ${b.train.number}`;

  document.getElementById("t-details").innerHTML = `
    <dt>Journey</dt><dd>${stationLabel(b.train.from)} → ${stationLabel(b.train.to)}</dd>
    <dt>Date of journey</dt><dd>${formatDateLong(b.search.date)}</dd>
    <dt>Departure</dt><dd class="mono">${b.train.dep}</dd>
    <dt>Arrival</dt><dd class="mono">${b.train.arr}</dd>
    <dt>Duration</dt><dd>${formatDuration(b.train.durationMins)}</dd>
    <dt>Class</dt><dd>${CLASS_LABELS[b.cls]}</dd>
    <dt>Quota</dt><dd>${b.search.quota}</dd>
    <dt>Boarding</dt><dd>${stationLabel(b.train.from)}</dd>`;

  document.getElementById("t-pax").innerHTML = b.passengers.map((p) =>
    `<tr><td>${p.name}</td><td>${p.age} / ${p.gender}</td><td class="mono">${p.coach}</td>
     <td class="mono">${p.seat} · ${p.allotted}</td><td><span class="badge badge-ok">Confirmed</span></td></tr>`).join("");

  document.getElementById("t-total").textContent = rupees(b.fare.total);

  document.getElementById("view").addEventListener("click", () => {
    document.getElementById("ticket").scrollIntoView({ behavior: "smooth", block: "start" });
    toast("Showing your demo ticket");
  });

  document.getElementById("download").addEventListener("click", () => {
    const lines = [
      "INDIAN RAILWAYS — DEMO ELECTRONIC RESERVATION SLIP (PROTOTYPE)",
      "This is not a valid travel document.",
      "",
      `PNR: ${b.pnr}`,
      `Train: ${b.train.name} (${b.train.number})`,
      `From: ${stationLabel(b.train.from)}  Dep: ${b.train.dep}`,
      `To:   ${stationLabel(b.train.to)}  Arr: ${b.train.arr}`,
      `Date: ${formatDateLong(b.search.date)}`,
      `Class: ${CLASS_LABELS[b.cls]}   Quota: ${b.search.quota}`,
      "",
      "Passengers:",
      ...b.passengers.map((p, i) => `${i + 1}. ${p.name} (${p.age}/${p.gender}) — ${p.coach} ${p.seat} ${p.allotted} — CNF`),
      "",
      `Total fare (demo): ${rupees(b.fare.total)}`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `demo-ticket-${b.pnr}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast("Demo ticket downloaded");
  });
})();
