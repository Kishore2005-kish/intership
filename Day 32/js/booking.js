/* ===== Booking page: dependent selects, live summary, validation, confirmation ===== */
document.addEventListener("DOMContentLoaded", function () {
  const form = qs("#bookingForm");
  const destSelect = qs("#destination");
  const pkgSelect = qs("#package");
  const dateInput = qs("#date");
  const travellers = qs("#travellers");
  const rooms = qs("#rooms");
  const confirmation = qs("#confirmation");

  /* Minimum travel date = tomorrow */
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];
  dateInput.min = minDate;

  destSelect.innerHTML =
    '<option value="">Select a destination</option>' +
    DESTINATIONS.map(function (d) { return '<option value="' + d.id + '">' + d.name + "</option>"; }).join("");

  function fillPackages(destId, preselect) {
    const list = PACKAGES.filter(function (p) { return !destId || p.destinationId === destId; });
    pkgSelect.innerHTML =
      '<option value="">Select a package</option>' +
      list.map(function (p) {
        return '<option value="' + p.id + '">' + p.title + " — " + p.days + "D · " + money(p.price) + "</option>";
      }).join("");
    if (preselect) pkgSelect.value = preselect;
  }

  function selectedPackage() {
    return PACKAGES.filter(function (p) { return p.id === pkgSelect.value; })[0] || null;
  }

  function updateSummary() {
    const pkg = selectedPackage();
    const people = Math.max(1, Number(travellers.value) || 1);
    qs("#sumTravellers").textContent = people;
    qs("#sumDate").textContent = dateInput.value || "—";

    if (!pkg) {
      qs("#sumPackage").textContent = "—";
      qs("#sumDuration").textContent = "—";
      qs("#sumUnit").textContent = "—";
      qs("#sumRoom").textContent = "₹0";
      qs("#sumTotal").textContent = "—";
      qs("#sumDeposit").textContent = "—";
      return;
    }

    const supplementRate = rooms.value.indexOf("Single") === 0 ? 0.15 : 0;
    const base = pkg.price * people;
    const supplement = Math.round(base * supplementRate);
    const total = base + supplement;

    qs("#sumPackage").textContent = pkg.title;
    qs("#sumDuration").textContent = pkg.days + "D / " + pkg.nights + "N";
    qs("#sumUnit").textContent = money(pkg.price);
    qs("#sumRoom").textContent = money(supplement);
    qs("#sumTotal").textContent = money(total);
    qs("#sumDeposit").textContent = money(Math.round(total * 0.2));
    return total;
  }

  function totalPrice() {
    const pkg = selectedPackage();
    if (!pkg) return 0;
    const people = Math.max(1, Number(travellers.value) || 1);
    const base = pkg.price * people;
    return base + (rooms.value.indexOf("Single") === 0 ? Math.round(base * 0.15) : 0);
  }

  /* Prefill from URL or saved draft */
  const pkgParam = getParam("package");
  const draft = Store.read("bookingDraft", {});
  const initialPkg = PACKAGES.filter(function (p) { return p.id === (pkgParam || draft.package); })[0];

  if (initialPkg) {
    destSelect.value = initialPkg.destinationId;
    fillPackages(initialPkg.destinationId, initialPkg.id);
  } else {
    fillPackages("");
  }

  ["name", "email", "phone", "notes"].forEach(function (key) {
    if (draft[key]) qs("#" + key).value = draft[key];
  });
  if (draft.travellers) travellers.value = draft.travellers;
  if (draft.rooms) rooms.value = draft.rooms;
  if (draft.date && draft.date >= minDate) dateInput.value = draft.date;

  destSelect.addEventListener("change", function () {
    fillPackages(destSelect.value);
    updateSummary();
  });

  pkgSelect.addEventListener("change", function () {
    const pkg = selectedPackage();
    if (pkg) destSelect.value = pkg.destinationId;
    updateSummary();
  });

  [travellers, rooms, dateInput].forEach(function (el) {
    el.addEventListener("input", updateSummary);
    el.addEventListener("change", updateSummary);
  });

  /* Save draft as the user types */
  form.addEventListener("input", function () {
    Store.write("bookingDraft", {
      name: qs("#name").value,
      email: qs("#email").value,
      phone: qs("#phone").value,
      destination: destSelect.value,
      package: pkgSelect.value,
      date: dateInput.value,
      travellers: travellers.value,
      rooms: rooms.value,
      notes: qs("#notes").value,
    });
  });

  /* ---- Validation ---- */
  function setError(field, message) {
    const msg = qs('[data-error="' + field + '"]');
    const input = qs("#" + field);
    if (msg) msg.textContent = message || "";
    if (input && input.closest(".field")) input.closest(".field").classList.toggle("invalid", Boolean(message));
  }

  function validate() {
    const errors = {};
    const name = qs("#name").value.trim();
    const email = qs("#email").value.trim();
    const phone = qs("#phone").value.trim();
    const people = Number(travellers.value);

    if (name.length < 3) errors.name = "Please enter your full name (at least 3 characters).";
    else if (name.length > 80) errors.name = "Name must be under 80 characters.";

    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) errors.email = "Enter a valid email address.";

    if (!/^[+]?[\d\s()-]{8,18}$/.test(phone)) errors.phone = "Enter a valid phone number (8–18 digits).";

    if (!destSelect.value) errors.destination = "Choose a destination.";
    if (!pkgSelect.value) errors.package = "Choose a package.";

    if (!dateInput.value) errors.date = "Pick your travel date.";
    else if (dateInput.value < minDate) errors.date = "Travel date must be in the future.";

    if (!people || people < 1 || people > 12) errors.travellers = "Enter between 1 and 12 travellers.";

    if (qs("#notes").value.length > 500) errors.notes = "Please keep requests under 500 characters.";

    if (!qs("#terms").checked) errors.terms = "You must accept the booking terms.";

    ["name", "email", "phone", "destination", "package", "date", "travellers", "notes", "terms"].forEach(function (f) {
      setError(f, errors[f]);
    });

    return Object.keys(errors);
  }

  ["name", "email", "phone", "date", "travellers"].forEach(function (f) {
    qs("#" + f).addEventListener("blur", validate);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const invalid = validate();
    if (invalid.length) {
      const first = qs("#" + invalid[0]);
      if (first) first.focus();
      toast("Please fix " + invalid.length + " field" + (invalid.length > 1 ? "s" : "") + " before confirming.");
      return;
    }

    const pkg = selectedPackage();
    const total = totalPrice();
    const ref = "WF-" + Date.now().toString().slice(-6);

    const booking = {
      ref: ref,
      name: qs("#name").value.trim(),
      email: qs("#email").value.trim(),
      phone: qs("#phone").value.trim(),
      package: pkg.title,
      destination: pkg.location,
      date: dateInput.value,
      travellers: Number(travellers.value),
      rooms: rooms.value,
      total: total,
      createdAt: new Date().toISOString(),
    };

    const all = Store.read("bookings", []);
    all.unshift(booking);
    Store.write("bookings", all);
    Store.write("bookingDraft", {});

    confirmation.classList.remove("hidden");
    confirmation.innerHTML =
      "<h3>Booking confirmed — reference " + ref + "</h3>" +
      "<p style=\"margin-top:8px\">Thank you, " + booking.name + ". Your <strong>" + booking.package +
      "</strong> for " + booking.travellers + " traveller" + (booking.travellers > 1 ? "s" : "") +
      " on <strong>" + booking.date + "</strong> is reserved. Total " + money(total) +
      ", deposit " + money(Math.round(total * 0.2)) + ". A confirmation has been sent to " + booking.email + ".</p>";
    confirmation.scrollIntoView({ behavior: "smooth", block: "center" });

    form.reset();
    fillPackages("");
    updateSummary();
    toast("Booking " + ref + " confirmed!");
  });

  updateSummary();
});
