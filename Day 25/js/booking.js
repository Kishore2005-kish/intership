/* ============================================================
   booking.js — prototype booking flow
   Home widget  ->  booking.html (availability -> guest details ->
   summary -> demo confirmation).  Data is kept in localStorage.
   No live availability, no payments, no real reservation.
   ============================================================ */

(function () {
  "use strict";

  var STORE = "lm_booking";

  function today(offset) {
    var d = new Date();
    d.setDate(d.getDate() + (offset || 0));
    return d.toISOString().slice(0, 10);
  }

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORE)) || {};
    } catch (err) {
      return {};
    }
  }

  function save(data) {
    try {
      localStorage.setItem(STORE, JSON.stringify(data));
    } catch (err) {
      /* storage may be unavailable — the flow still works in-page */
    }
  }

  function nights(a, b) {
    var ms = new Date(b) - new Date(a);
    return Math.max(1, Math.round(ms / 86400000));
  }

  function prettyDate(value) {
    if (!value) return "—";
    var d = new Date(value);
    if (isNaN(d)) return value;
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  function fieldError(field, message) {
    var wrap = field.closest(".field");
    if (!wrap) return !message;
    var box = wrap.querySelector(".field__error");
    wrap.classList.toggle("has-error", Boolean(message));
    field.setAttribute("aria-invalid", message ? "true" : "false");
    if (box) box.textContent = message || "";
    return !message;
  }

  /* ============================================================
     1. Home / page booking widget
     ============================================================ */
  var widget = document.getElementById("stayForm");
  if (widget) {
    var ci = widget.elements.checkin;
    var co = widget.elements.checkout;
    ci.min = today();
    co.min = today(1);
    var saved = load();
    ci.value = saved.checkin || today(1);
    co.value = saved.checkout || today(3);
    if (saved.rooms) widget.elements.rooms.value = saved.rooms;
    if (saved.guests) widget.elements.guests.value = saved.guests;

    ci.addEventListener("change", function () {
      co.min = ci.value;
      if (co.value && co.value <= ci.value) {
        var next = new Date(ci.value);
        next.setDate(next.getDate() + 1);
        co.value = next.toISOString().slice(0, 10);
      }
    });

    widget.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      ok = fieldError(ci, ci.value ? "" : "Please choose a check-in date.") && ok;
      ok =
        fieldError(
          co,
          !co.value
            ? "Please choose a check-out date."
            : co.value <= ci.value
              ? "Check-out must be after check-in."
              : ""
        ) && ok;
      if (!ok) return;

      var data = load();
      data.checkin = ci.value;
      data.checkout = co.value;
      data.rooms = widget.elements.rooms.value;
      data.guests = widget.elements.guests.value;
      save(data);
      window.location.href = "booking.html";
    });
  }

  /* ============================================================
     2. Booking page flow
     ============================================================ */
  var page = document.getElementById("bookingFlow");
  if (!page) return;

  var rooms = window.LM_ROOMS || [];
  var data = load();
  var params = new URLSearchParams(window.location.search);

  if (!data.checkin) data.checkin = today(1);
  if (!data.checkout || data.checkout <= data.checkin) data.checkout = today(3);
  if (!data.rooms) data.rooms = "1";
  if (!data.guests) data.guests = "2";
  if (params.get("room")) data.roomId = params.get("room");
  save(data);

  var panels = {
    1: document.getElementById("step1"),
    2: document.getElementById("step2"),
    3: document.getElementById("step3"),
    4: document.getElementById("step4")
  };
  var stepItems = document.querySelectorAll(".steps li");

  function showStep(n) {
    Object.keys(panels).forEach(function (key) {
      if (panels[key]) panels[key].hidden = Number(key) !== n;
    });
    stepItems.forEach(function (li, i) {
      var num = i + 1;
      li.classList.toggle("is-done", num < n);
      if (num === n) li.setAttribute("aria-current", "step");
      else li.removeAttribute("aria-current");
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* --- stay summary --- */
  function paintSummaryStrip() {
    document.querySelectorAll("[data-stay-strip]").forEach(function (strip) {
      strip.innerHTML =
        "<div><span>Check-in</span><strong>" +
        prettyDate(data.checkin) +
        "</strong></div>" +
        "<div><span>Check-out</span><strong>" +
        prettyDate(data.checkout) +
        "</strong></div>" +
        "<div><span>Nights</span><strong>" +
        nights(data.checkin, data.checkout) +
        "</strong></div>" +
        "<div><span>Rooms &amp; guests</span><strong>" +
        data.rooms +
        " room, " +
        data.guests +
        " guests</strong></div>";
    });
  }

  /* --- step 1 : demo availability --- */
  var list = document.getElementById("availabilityList");

  function rateRow(room) {
    var n = nights(data.checkin, data.checkout);
    var tariff = room.tariff;
    return (
      '<article class="rate-row">' +
      '<img src="assets/images/' +
      room.images[0] +
      '" alt="' +
      room.name +
      '" loading="lazy">' +
      "<div><h3>" +
      room.name +
      "</h3>" +
      '<p class="card__meta"><span>' +
      room.area +
      "</span><span>" +
      room.located +
      "</span></p>" +
      '<p class="card__text">' +
      room.blurb +
      "</p></div>" +
      '<div class="rate-row__side">' +
      (tariff === null
        ? '<p class="price"><span>Tariff</span>On request</p>'
        : '<p class="price"><span>' +
          n +
          (n === 1 ? " night, taxes extra" : " nights, taxes extra") +
          "</span>INR " +
          (tariff * n).toLocaleString("en-IN") +
          "</p>") +
      '<button class="btn btn--primary btn--sm" type="button" data-select-room="' +
      room.id +
      '">Select room</button>' +
      '<button class="btn btn--outline btn--sm" type="button" data-room="' +
      room.id +
      '">View details</button>' +
      "</div></article>"
    );
  }

  function paintAvailability() {
    if (!list) return;
    list.innerHTML = rooms.map(rateRow).join("");
  }

  /* --- editable dates on the booking page --- */
  var editForm = document.getElementById("editStayForm");
  if (editForm) {
    editForm.elements.checkin.value = data.checkin;
    editForm.elements.checkout.value = data.checkout;
    editForm.elements.rooms.value = data.rooms;
    editForm.elements.guests.value = data.guests;
    editForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var a = editForm.elements.checkin;
      var b = editForm.elements.checkout;
      var ok = fieldError(a, a.value ? "" : "Please choose a check-in date.");
      ok =
        fieldError(
          b,
          !b.value
            ? "Please choose a check-out date."
            : b.value <= a.value
              ? "Check-out must be after check-in."
              : ""
        ) && ok;
      if (!ok) return;
      data.checkin = a.value;
      data.checkout = b.value;
      data.rooms = editForm.elements.rooms.value;
      data.guests = editForm.elements.guests.value;
      save(data);
      paintSummaryStrip();
      paintAvailability();
    });
  }

  /* --- step 2 : guest details --- */
  var guestForm = document.getElementById("guestForm");

  function selectedRoom() {
    return (
      rooms.filter(function (r) {
        return r.id === data.roomId;
      })[0] || null
    );
  }

  function paintChosenRoom() {
    var room = selectedRoom();
    document.querySelectorAll("[data-chosen-room]").forEach(function (el) {
      el.textContent = room ? room.name : "No room selected";
    });
  }

  document.addEventListener("click", function (e) {
    var pick = e.target.closest("[data-select-room]");
    if (pick) {
      data.roomId = pick.getAttribute("data-select-room");
      save(data);
      paintChosenRoom();
      showStep(2);
      return;
    }
    var back = e.target.closest("[data-goto-step]");
    if (back) showStep(Number(back.getAttribute("data-goto-step")));
  });

  if (guestForm) {
    guestForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = guestForm.elements;
      var ok = true;
      ok = fieldError(f.fullName, f.fullName.value.trim().length < 2 ? "Please enter the guest name." : "") && ok;
      ok =
        fieldError(
          f.email,
          /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.value.trim())
            ? ""
            : "Please enter a valid email address."
        ) && ok;
      ok =
        fieldError(
          f.phone,
          f.phone.value.replace(/[^\d]/g, "").length < 8 ? "Please enter a contact number." : ""
        ) && ok;
      if (!ok) {
        var bad = guestForm.querySelector(".has-error input");
        if (bad) bad.focus();
        return;
      }
      data.guest = {
        name: f.fullName.value.trim(),
        email: f.email.value.trim(),
        phone: f.phone.value.trim(),
        requests: f.requests.value.trim()
      };
      save(data);
      paintReview();
      showStep(3);
    });

    guestForm.addEventListener("input", function (e) {
      if (e.target.closest(".field.has-error")) fieldError(e.target, "");
    });
  }

  /* --- step 3 : summary --- */
  function paintReview() {
    var target = document.getElementById("reviewList");
    if (!target) return;
    var room = selectedRoom();
    var n = nights(data.checkin, data.checkout);
    var total =
      room && room.tariff !== null
        ? "INR " + (room.tariff * n).toLocaleString("en-IN") + " (taxes extra)"
        : "On request — the hotel confirms the tariff for this category";
    target.innerHTML =
      "<li><span>Accommodation</span><span>" +
      (room ? room.name + " · " + room.area : "—") +
      "</span></li>" +
      "<li><span>Check-in</span><span>" +
      prettyDate(data.checkin) +
      "</span></li>" +
      "<li><span>Check-out</span><span>" +
      prettyDate(data.checkout) +
      "</span></li>" +
      "<li><span>Nights</span><span>" +
      n +
      "</span></li>" +
      "<li><span>Rooms &amp; guests</span><span>" +
      data.rooms +
      " room, " +
      data.guests +
      " guests</span></li>" +
      "<li><span>Guest</span><span>" +
      (data.guest ? data.guest.name : "—") +
      "</span></li>" +
      "<li><span>Contact</span><span>" +
      (data.guest ? data.guest.email + " · " + data.guest.phone : "—") +
      "</span></li>" +
      "<li><span>Requests</span><span>" +
      (data.guest && data.guest.requests ? data.guest.requests : "None") +
      "</span></li>" +
      "<li><span>Indicative total</span><span>" +
      total +
      "</span></li>";
  }

  var confirmBtn = document.getElementById("confirmBooking");
  if (confirmBtn) {
    confirmBtn.addEventListener("click", function () {
      var ref = "LMP-" + String(Math.floor(1000 + Math.random() * 8999));
      data.ref = ref;
      save(data);
      var codeEl = document.getElementById("bookingRef");
      if (codeEl) codeEl.textContent = ref;
      var recap = document.getElementById("confirmRecap");
      if (recap) {
        var room = selectedRoom();
        recap.textContent =
          (room ? room.name : "Accommodation") +
          " · " +
          prettyDate(data.checkin) +
          " to " +
          prettyDate(data.checkout) +
          " · " +
          data.guests +
          " guests";
      }
      showStep(4);
    });
  }

  /* --- initial paint --- */
  paintSummaryStrip();
  paintAvailability();
  paintChosenRoom();
  showStep(data.roomId && params.get("room") ? 2 : 1);
})();
