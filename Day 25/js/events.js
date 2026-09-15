/* ============================================================
   events.js — event enquiry form validation + demo confirmation.
   Nothing is submitted anywhere; this is a prototype.
   ============================================================ */

(function () {
  "use strict";

  var form = document.getElementById("eventForm");
  if (!form) return;

  var status = document.getElementById("eventStatus");

  function setError(field, message) {
    var wrap = field.closest(".field");
    var box = wrap.querySelector(".field__error");
    wrap.classList.toggle("has-error", Boolean(message));
    field.setAttribute("aria-invalid", message ? "true" : "false");
    if (box) box.textContent = message || "";
    return !message;
  }

  function validate() {
    var ok = true;
    var name = form.elements.name;
    var email = form.elements.email;
    var phone = form.elements.phone;
    var type = form.elements.eventType;
    var date = form.elements.eventDate;
    var guests = form.elements.guests;

    ok = setError(name, name.value.trim().length < 2 ? "Please enter your name." : "") && ok;
    ok =
      setError(
        email,
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())
          ? ""
          : "Please enter a valid email address."
      ) && ok;
    ok =
      setError(
        phone,
        phone.value.replace(/[^\d]/g, "").length < 8 ? "Please enter a contact number." : ""
      ) && ok;
    ok = setError(type, type.value ? "" : "Please choose an event type.") && ok;
    ok = setError(date, date.value ? "" : "Please choose a date for the event.") && ok;
    ok =
      setError(
        guests,
        Number(guests.value) > 0 ? "" : "Please enter the expected number of guests."
      ) && ok;

    return ok;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate()) {
      var firstBad = form.querySelector(".has-error input, .has-error select");
      if (firstBad) firstBad.focus();
      if (status) status.hidden = true;
      return;
    }

    var type = form.elements.eventType.options[form.elements.eventType.selectedIndex].text;
    if (status) {
      status.hidden = false;
      status.querySelector("[data-status-title]").textContent =
        "Thank you, " + form.elements.name.value.trim() + " — enquiry received";
      status.querySelector("[data-status-text]").textContent =
        type +
        " for " +
        form.elements.guests.value +
        " guests on " +
        form.elements.eventDate.value +
        ". Demo enquiry — no information is submitted to the hotel. To plan an event, call +91-80-40554055 or write to info@junglelodges.com.";
      status.focus();
      status.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    form.reset();
  });

  /* clear an error as soon as the guest corrects the field */
  form.addEventListener("input", function (e) {
    if (e.target.closest(".field.has-error")) setError(e.target, "");
  });

  /* deep link: events.html#enquiry?type=wedding style presets */
  var preset = new URLSearchParams(window.location.search).get("type");
  if (preset && form.elements.eventType) {
    form.elements.eventType.value = preset;
  }

  document.querySelectorAll("[data-event-type]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      form.elements.eventType.value = btn.getAttribute("data-event-type");
      document.getElementById("enquiry").scrollIntoView({ behavior: "smooth" });
      form.elements.name.focus();
    });
  });
})();
