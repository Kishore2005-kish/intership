/* ============ Registration: validation, totals, confirmation ============ */

const DRAFT_KEY = "summit.registrationDraft";
const BOOKING_FEE_RATE = 0.08;

function currentEvent() {
  return getEvent(document.getElementById("eventSelect").value);
}

function currentTicket() {
  const ev = currentEvent();
  if (!ev) return null;
  const type = document.getElementById("ticketSelect").value;
  return ev.tickets.find(function (t) { return t.type === type; }) || ev.tickets[0];
}

function populateEvents(preselect) {
  const select = document.getElementById("eventSelect");
  select.innerHTML =
    '<option value="">Select an event…</option>' +
    EVENTS.slice().sort(function (a, b) { return a.date.localeCompare(b.date); }).map(function (e) {
      const disabled = e.seatsLeft === 0 ? " disabled" : "";
      return '<option value="' + e.id + '"' + disabled + ">" + escapeHtml(e.title) + " — " + dateRange(e) +
        (e.seatsLeft === 0 ? " (sold out)" : "") + "</option>";
    }).join("");
  if (preselect && getEvent(preselect) && getEvent(preselect).seatsLeft !== 0) select.value = preselect;
}

function populateTickets(preselect) {
  const select = document.getElementById("ticketSelect");
  const ev = currentEvent();
  if (!ev) {
    select.innerHTML = '<option value="">Choose an event first</option>';
    return;
  }
  select.innerHTML = ev.tickets.map(function (t) {
    return '<option value="' + t.type + '">' + escapeHtml(t.name) + " — " + formatPrice(t.price) + "</option>";
  }).join("");
  if (preselect && ev.tickets.some(function (t) { return t.type === preselect; })) select.value = preselect;
}

function getQty() {
  const input = document.getElementById("attendees");
  let n = parseInt(input.value, 10);
  if (isNaN(n) || n < 1) n = 1;
  if (n > 10) n = 10;
  input.value = n;
  return n;
}

function updateSummary() {
  const ev = currentEvent();
  const ticket = currentTicket();
  const qty = getQty();
  const unit = ticket ? ticket.price : 0;
  const subtotal = unit * qty;
  const fee = Math.round(subtotal * BOOKING_FEE_RATE);
  const total = subtotal + fee;

  document.getElementById("sumEvent").textContent = ev ? ev.title : "—";
  document.getElementById("sumTicket").textContent = ticket ? ticket.name : "—";
  document.getElementById("sumUnit").textContent = formatPrice(unit);
  document.getElementById("sumQty").textContent = qty;
  document.getElementById("sumSubtotal").textContent = formatPrice(subtotal);
  document.getElementById("sumFee").textContent = subtotal === 0 ? "\u20B90" : formatPrice(fee);
  document.getElementById("sumTotal").textContent = subtotal === 0 ? "Free" : formatPrice(total);
  document.getElementById("sumPerks").textContent = ticket ? ticket.perks : "Select a ticket type to see what is included.";
  return { event: ev, ticket: ticket, qty: qty, total: subtotal === 0 ? 0 : total };
}

/* ---------- validation ---------- */
function setError(field, message) {
  const input = document.getElementById(field);
  const msg = document.querySelector('[data-error-for="' + field + '"]');
  if (input) input.classList.toggle("is-invalid", Boolean(message));
  if (msg) msg.textContent = message || "";
  return !message;
}

const validators = {
  fullName: function (v) {
    if (!v.trim()) return "Please enter your full name.";
    if (v.trim().length < 3) return "Name must be at least 3 characters.";
    if (!/^[a-zA-Z\s.'-]+$/.test(v.trim())) return "Name can only contain letters, spaces, apostrophes and hyphens.";
    return "";
  },
  email: function (v) {
    if (!v.trim()) return "Please enter your email address.";
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim())) return "Enter a valid email like name@company.com.";
    return "";
  },
  phone: function (v) {
    const digits = v.replace(/[^\d]/g, "");
    if (!v.trim()) return "Please enter a phone number.";
    if (digits.length < 10 || digits.length > 13) return "Phone number must be 10–13 digits.";
    return "";
  },
  eventSelect: function (v) { return v ? "" : "Please choose an event."; },
  ticketSelect: function (v) { return v ? "" : "Please choose a ticket type."; },
  attendees: function (v) {
    const n = parseInt(v, 10);
    if (isNaN(n) || n < 1) return "At least one attendee is required.";
    if (n > 10) return "For more than 10 attendees please contact our group desk.";
    return "";
  }
};

function validateField(id) {
  const el = document.getElementById(id);
  return setError(id, validators[id](el.value));
}

function validatePayment() {
  const chosen = document.querySelector('input[name="payment"]:checked');
  const msg = document.querySelector('[data-error-for="payment"]');
  msg.textContent = chosen ? "" : "Please pick a payment preference.";
  return Boolean(chosen);
}

function saveDraft() {
  STORE.write(DRAFT_KEY, {
    fullName: document.getElementById("fullName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    company: document.getElementById("company").value,
    eventId: document.getElementById("eventSelect").value,
    ticket: document.getElementById("ticketSelect").value,
    attendees: document.getElementById("attendees").value,
    notes: document.getElementById("notes").value
  });
}

function restoreDraft() {
  const draft = STORE.read(DRAFT_KEY, null);
  if (!draft) return null;
  ["fullName", "email", "phone", "company", "notes"].forEach(function (k) {
    if (draft[k]) document.getElementById(k).value = draft[k];
  });
  if (draft.attendees) document.getElementById("attendees").value = draft.attendees;
  return draft;
}

function showConfirmation(data) {
  const ref = "SMT-" + Math.random().toString(36).slice(2, 7).toUpperCase();
  const form = document.getElementById("registrationForm");
  const box = document.getElementById("confirmation");
  form.classList.add("hidden");
  box.classList.remove("hidden");
  box.innerHTML =
    '<div class="notice notice--success">' +
      "<h2>Registration confirmed 🎉</h2>" +
      '<p class="mt-1">Thanks ' + escapeHtml(data.name) + ", your seat is booked. A confirmation email is on its way to <strong>" + escapeHtml(data.email) + "</strong>.</p>" +
      '<div class="mt-2">' +
        '<div class="info-row"><span>Reference</span><span>' + ref + "</span></div>" +
        '<div class="info-row"><span>Event</span><span>' + escapeHtml(data.eventTitle) + "</span></div>" +
        '<div class="info-row"><span>Ticket</span><span>' + escapeHtml(data.ticketName) + "</span></div>" +
        '<div class="info-row"><span>Attendees</span><span>' + data.qty + "</span></div>" +
        '<div class="info-row"><span>Payment</span><span>' + escapeHtml(data.payment) + "</span></div>" +
        '<div class="info-row"><span>Amount due</span><span>' + (data.total === 0 ? "Free" : formatPrice(data.total)) + "</span></div>" +
      "</div>" +
      '<div class="flex gap-sm wrap mt-3">' +
        '<a class="btn btn--primary" href="events.html">Browse more events</a>' +
        '<button class="btn btn--ghost" type="button" id="newRegistration">Register someone else</button>' +
      "</div>" +
    "</div>";
  box.scrollIntoView({ behavior: "smooth", block: "center" });

  document.getElementById("newRegistration").addEventListener("click", function () {
    box.classList.add("hidden");
    form.classList.remove("hidden");
    form.reset();
    populateTickets();
    updateSummary();
    window.scrollTo({ top: form.offsetTop - 100, behavior: "smooth" });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registrationForm");
  if (!form) return;

  populateEvents(getQueryParam("event") || STORE.read(DRAFT_KEY, {}).eventId);
  populateTickets(getQueryParam("ticket") || STORE.read(DRAFT_KEY, {}).ticket);
  restoreDraft();
  updateSummary();

  document.getElementById("eventSelect").addEventListener("change", function () {
    populateTickets();
    updateSummary();
    validateField("eventSelect");
    saveDraft();
  });
  document.getElementById("ticketSelect").addEventListener("change", function () {
    updateSummary(); saveDraft();
  });
  document.getElementById("attendees").addEventListener("input", function () {
    updateSummary(); saveDraft();
  });
  document.querySelector('[data-qty="minus"]').addEventListener("click", function () {
    const input = document.getElementById("attendees");
    input.value = Math.max(1, (parseInt(input.value, 10) || 1) - 1);
    updateSummary(); saveDraft();
  });
  document.querySelector('[data-qty="plus"]').addEventListener("click", function () {
    const input = document.getElementById("attendees");
    input.value = Math.min(10, (parseInt(input.value, 10) || 1) + 1);
    updateSummary(); saveDraft();
  });

  ["fullName", "email", "phone"].forEach(function (id) {
    const el = document.getElementById(id);
    el.addEventListener("blur", function () { validateField(id); });
    el.addEventListener("input", function () {
      if (el.classList.contains("is-invalid")) validateField(id);
      saveDraft();
    });
  });
  form.querySelectorAll('input[name="payment"]').forEach(function (r) {
    r.addEventListener("change", validatePayment);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const checks = ["fullName", "email", "phone", "eventSelect", "ticketSelect", "attendees"]
      .map(validateField);
    checks.push(validatePayment());
    if (checks.indexOf(false) !== -1) {
      showToast("Please fix the highlighted fields");
      form.querySelector(".is-invalid")?.focus();
      return;
    }
    const summary = updateSummary();
    const payment = document.querySelector('input[name="payment"]:checked').value;
    const record = {
      name: document.getElementById("fullName").value.trim(),
      email: document.getElementById("email").value.trim(),
      eventTitle: summary.event.title,
      ticketName: summary.ticket.name,
      qty: summary.qty,
      payment: payment,
      total: summary.total,
      at: new Date().toISOString()
    };
    const history = STORE.read("summit.registrations", []);
    history.push(record);
    STORE.write("summit.registrations", history);
    STORE.remove(DRAFT_KEY);
    showToast("Registration confirmed");
    showConfirmation(record);
  });
});
