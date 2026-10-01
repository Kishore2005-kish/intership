/* ============ Contact form validation ============ */

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const rules = {
    cName: function (v) {
      if (!v.trim()) return "Please enter your name.";
      if (v.trim().length < 3) return "Name must be at least 3 characters.";
      return "";
    },
    cEmail: function (v) {
      if (!v.trim()) return "Please enter your email address.";
      if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim())) return "Enter a valid email like name@company.com.";
      return "";
    },
    cPhone: function (v) {
      if (!v.trim()) return "";
      const digits = v.replace(/[^\d]/g, "");
      if (digits.length < 10 || digits.length > 13) return "Phone number must be 10–13 digits.";
      return "";
    },
    cSubject: function (v) { return v ? "" : "Please choose a subject."; },
    cMessage: function (v) {
      if (!v.trim()) return "Please write a message.";
      if (v.trim().length < 20) return "Tell us a little more (at least 20 characters).";
      if (v.trim().length > 1000) return "Please keep it under 1000 characters.";
      return "";
    }
  };

  function check(id) {
    const el = document.getElementById(id);
    const message = rules[id](el.value);
    el.classList.toggle("is-invalid", Boolean(message));
    const slot = document.querySelector('[data-error-for="' + id + '"]');
    if (slot) slot.textContent = message;
    return !message;
  }

  Object.keys(rules).forEach(function (id) {
    const el = document.getElementById(id);
    el.addEventListener("blur", function () { check(id); });
    el.addEventListener("input", function () { if (el.classList.contains("is-invalid")) check(id); });
  });

  const counter = document.getElementById("charCount");
  document.getElementById("cMessage").addEventListener("input", function (e) {
    counter.textContent = e.target.value.length + " / 1000";
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const ok = Object.keys(rules).map(check).indexOf(false) === -1;
    if (!ok) { showToast("Please fix the highlighted fields"); form.querySelector(".is-invalid")?.focus(); return; }

    STORE.write("summit.lastContactMessage", {
      name: document.getElementById("cName").value.trim(),
      email: document.getElementById("cEmail").value.trim(),
      subject: document.getElementById("cSubject").value,
      at: new Date().toISOString()
    });

    document.getElementById("contactSuccess").classList.remove("hidden");
    document.getElementById("contactSuccess").textContent =
      "Thanks " + document.getElementById("cName").value.trim() +
      "! Your message is with our team — we reply within one business day.";
    form.reset();
    counter.textContent = "0 / 1000";
    showToast("Message sent");
  });
});
