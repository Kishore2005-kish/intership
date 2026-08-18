import { mountChrome, cart, money, toast } from "./site.js";
mountChrome();

const STEPS = ["Contact", "Shipping", "Payment", "Review"];
let step = 0;
const data = {};

const stepsEl = document.getElementById("steps");
const formEl = document.getElementById("stepBody");
const sumEl = document.getElementById("summary");

function renderSteps() {
  stepsEl.innerHTML = STEPS.map((s, i) =>
    `<li${i === step ? ' aria-current="step"' : ""} class="${i < step ? "done" : ""}">${String(i + 1).padStart(2, "0")} — ${s}</li>`).join("");
}

function renderSummary() {
  const lines = cart.detailed();
  const sub = cart.subtotal();
  const ship = sub >= 750 || sub === 0 ? 0 : 45;
  sumEl.innerHTML = `
    <p class="meta">Your order · ${lines.length} line${lines.length === 1 ? "" : "s"}</p>
    ${lines.map((l) => `<div style="display:flex;justify-content:space-between;gap:1rem;padding:.4rem 0;font-size:.86rem">
      <span>${l.qty} × ${l.name}</span><span style="font-family:var(--font-mono)">${money(l.price * l.qty)}</span></div>`).join("")}
    <dl><dt>Subtotal</dt><dd>${money(sub)}</dd><dt>Delivery</dt><dd>${ship ? money(ship) : "Complimentary"}</dd></dl>
    <div class="summary total">${money(sub + ship)}</div>`;
}

const FIELDS = {
  0: [["fullName", "Full name", "text"], ["email", "Email", "email"], ["phone", "Phone", "tel"]],
  1: [["address1", "Address", "text"], ["city", "City", "text"], ["postcode", "Postcode", "text"], ["country", "Country", "select"]],
  2: [["cardName", "Name on card", "text"], ["cardNumber", "Card number", "text"], ["expiry", "Expiry (MM/YY)", "text"], ["cvc", "CVC", "text"]],
};

function renderStep() {
  renderSteps();
  if (step === 3) {
    formEl.innerHTML = `
      <h2 class="h-md">Review &amp; place order</h2>
      <div class="review-block"><p class="meta">Contact</p>${data.fullName} · ${data.email} · ${data.phone}</div>
      <div class="review-block"><p class="meta">Deliver to</p>${data.address1}, ${data.city} ${data.postcode}, ${data.country}</div>
      <div class="review-block"><p class="meta">Payment</p>Card ending ${(data.cardNumber || "").slice(-4)} · ${data.cardName}</div>
      <p class="muted" style="font-size:.85rem">This is a demonstration checkout — no payment is taken and no card details leave your browser.</p>
      <div style="display:flex;gap:.6rem;margin-top:1.2rem">
        <button class="btn btn-ghost" id="back">Back</button>
        <button class="btn btn-brass" id="place">Place order</button>
      </div>`;
  } else {
    const fields = FIELDS[step];
    formEl.innerHTML = `
      <h2 class="h-md">${STEPS[step]} details</h2>
      <form id="stepForm" novalidate style="margin-top:1.2rem">
        <div class="${step === 2 ? "grid-2" : ""}">
        ${fields.map(([n, label, type]) => `
          <div class="field" data-field="${n}">
            <label for="${n}">${label}</label>
            ${type === "select"
              ? `<select id="${n}" name="${n}"><option value="">Choose…</option>${["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"].map((c) => `<option${data.country === c ? " selected" : ""}>${c}</option>`).join("")}</select>`
              : `<input id="${n}" name="${n}" type="${type}" value="${data[n] || ""}" autocomplete="on">`}
            <p class="err">Please complete this field correctly.</p>
          </div>`).join("")}
        </div>
        <div style="display:flex;gap:.6rem;margin-top:.6rem">
          ${step ? '<button type="button" class="btn btn-ghost" id="back">Back</button>' : '<a class="btn btn-ghost" href="cart.html">Back to bag</a>'}
          <button class="btn" type="submit">Continue</button>
        </div>
      </form>`;
  }

  document.getElementById("back")?.addEventListener("click", () => { step--; renderStep(); });
  document.getElementById("place")?.addEventListener("click", placeOrder);
  document.getElementById("stepForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    FIELDS[step].forEach(([n, , type]) => {
      const input = document.getElementById(n);
      const wrap = document.querySelector(`[data-field="${n}"]`);
      const v = input.value.trim();
      let valid = v.length > 1;
      if (type === "email") valid = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v);
      if (n === "cardNumber") valid = v.replace(/\s/g, "").length >= 13;
      if (n === "expiry") valid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(v);
      if (n === "cvc") valid = /^\d{3,4}$/.test(v);
      if (n === "phone") valid = v.replace(/\D/g, "").length >= 7;
      wrap.classList.toggle("invalid", !valid);
      if (valid) data[n] = v; else ok = false;
    });
    if (!ok) { toast("Check the highlighted fields"); return; }
    step++; renderStep(); scrollTo({ top: 0, behavior: "smooth" });
  });
}

function placeOrder() {
  const ref = "AL-" + Math.random().toString(36).slice(2, 7).toUpperCase();
  const total = cart.subtotal() + (cart.subtotal() >= 750 ? 0 : 45);
  cart.clear();
  document.getElementById("checkoutGrid").innerHTML = `
    <div class="confirm">
      <p class="meta meta-brass">Order ${ref}</p>
      <h1 class="h-lg" style="margin-top:.5rem">Thank you, ${data.fullName.split(" ")[0]}<span class="script">it's in the workshop</span></h1>
      <p class="muted">We've sent a confirmation to ${data.email}. Your pieces enter production this week, and a delivery window follows within ten days.</p>
      <p style="font-family:var(--font-mono);margin-top:1rem">Total ${money(total)}</p>
      <div style="display:flex;gap:.6rem;justify-content:center;margin-top:1.6rem">
        <a class="btn" href="shop.html">Keep browsing</a>
        <a class="btn btn-ghost" href="rooms.html">See the rooms</a>
      </div>
    </div>`;
}

if (!cart.all().length) {
  document.getElementById("checkoutGrid").innerHTML =
    `<div class="empty" style="grid-column:1/-1"><p class="h-md">Nothing to check out</p>
     <p class="muted">Add a piece to your bag first.</p>
     <a class="btn" href="shop.html" style="margin-top:1rem">Open the catalogue</a></div>`;
} else {
  renderStep();
  renderSummary();
}
