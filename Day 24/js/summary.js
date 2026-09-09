(function () {
  const sel = store.get(STORE_KEYS.train);
  const pax = store.get(STORE_KEYS.pax);
  if (!sel || !pax) { location.replace("index.html"); return; }
  const { train, cls, search } = sel;
  const fare = train.classes.find((c) => c.code === cls);

  document.getElementById("journey").innerHTML = `
    <dt>Route</dt><dd>${stationLabel(train.from)} → ${stationLabel(train.to)}</dd>
    <dt>Date</dt><dd>${formatDateLong(search.date)}</dd>
    <dt>Train</dt><dd>${train.name}</dd>
    <dt>Train number</dt><dd class="mono">${train.number}</dd>
    <dt>Departure</dt><dd class="mono">${train.dep} · ${train.from}</dd>
    <dt>Arrival</dt><dd class="mono">${train.arr} · ${train.to}</dd>
    <dt>Duration</dt><dd>${formatDuration(train.durationMins)}</dd>
    <dt>Class</dt><dd>${CLASS_LABELS[cls]}</dd>
    <dt>Quota</dt><dd>${search.quota}</dd>
    <dt>Availability</dt><dd class="st-${fare.avail.kind === "err" ? "err" : fare.avail.kind}">${fare.avail.text}</dd>`;

  document.getElementById("pax-rows").innerHTML = pax.passengers.map((p) =>
    `<tr><td>${p.name}</td><td class="mono">${p.age}</td><td>${p.gender}</td><td>${p.berth || "No Preference"}</td></tr>`).join("");

  document.getElementById("contact").innerHTML = `
    <dt>Mobile</dt><dd class="mono">${pax.mobile}</dd>
    <dt>Email</dt><dd>${pax.email}</dd>`;

  const n = pax.passengers.length;
  const base = fare.fare * n;
  const res = 20 * n;
  const gst = ["1A", "2A", "3A", "3E", "CC", "EC"].includes(cls) ? Math.round(base * 0.05) : 0;
  const conv = 10 * n;
  const total = base + res + gst + conv;

  document.getElementById("fare").innerHTML = `
    <div class="fare-line"><span>Base fare (${rupees(fare.fare)} × ${n})</span><span class="mono">${rupees(base)}</span></div>
    <div class="fare-line"><span>Reservation / service charges</span><span class="mono">${rupees(res)}</span></div>
    ${gst ? `<div class="fare-line"><span>GST (5%)</span><span class="mono">${rupees(gst)}</span></div>` : ""}
    <div class="fare-line"><span>Convenience fee</span><span class="mono">${rupees(conv)}</span></div>
    <div class="fare-total"><span>Total</span><span class="mono">${rupees(total)}</span></div>`;

  document.getElementById("confirm").addEventListener("click", () => {
    const pnr = String(Math.floor(1000000000 + Math.random() * 8999999999));
    const coachLetter = ["1A", "2A"].includes(cls) ? "A" : cls === "3A" ? "B" : ["CC", "EC"].includes(cls) ? "C" : "S";
    const coach = `${coachLetter}${Math.ceil(Math.random() * 4)}`;
    const startSeat = Math.ceil(Math.random() * 50);
    const berths = ["Lower", "Middle", "Upper", "Side Lower", "Side Upper"];

    const booking = {
      pnr, train, cls, search,
      passengers: pax.passengers.map((p, i) => ({
        ...p, coach,
        seat: `${startSeat + i}`,
        allotted: ["CC", "EC", "2S"].includes(cls) ? (p.berth && p.berth !== "No Preference" ? p.berth : "Window") : (p.berth && p.berth !== "No Preference" ? p.berth : berths[i % berths.length]),
        status: "CNF",
      })),
      contact: { mobile: pax.mobile, email: pax.email },
      fare: { base, res, gst, conv, total },
      bookedAt: new Date().toISOString(),
    };

    store.set(STORE_KEYS.booking, booking);
    const all = store.get(STORE_KEYS.bookings, []);
    all.unshift(booking);
    store.set(STORE_KEYS.bookings, all.slice(0, 20));
    location.href = "success.html";
  });
})();
