/* FORMA — contact form validation + front-end success state */
(function () {
  "use strict";

  var form = document.getElementById("inquiry-form");
  if (!form) return;
  var success = document.getElementById("form-success");

  var rules = {
    name: function (v) { return v.trim().length >= 2 || "Please enter your full name."; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Please enter a valid email address."; },
    phone: function (v) { return v.trim() === "" || /^[\d\s+()-]{7,20}$/.test(v.trim()) || "Please enter a valid phone number."; },
    projectType: function (v) { return v !== "" || "Please choose a project type."; },
    location: function (v) { return v.trim().length >= 2 || "Please tell us the project location."; },
    budget: function (v) { return v !== "" || "Please select an estimated budget."; },
    message: function (v) { return v.trim().length >= 20 || "Please describe your project in at least 20 characters."; }
  };

  function validateField(el) {
    var rule = rules[el.name];
    if (!rule) return true;
    var result = rule(el.value);
    var field = el.closest(".field");
    var error = field.querySelector(".error");
    if (result === true) {
      field.classList.remove("has-error");
      error.textContent = "";
      el.removeAttribute("aria-invalid");
      return true;
    }
    field.classList.add("has-error");
    error.textContent = result;
    el.setAttribute("aria-invalid", "true");
    return false;
  }

  form.querySelectorAll("input, select, textarea").forEach(function (el) {
    el.addEventListener("blur", function () { validateField(el); });
    el.addEventListener("input", function () {
      if (el.closest(".field").classList.contains("has-error")) validateField(el);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    var first = null;
    form.querySelectorAll("input, select, textarea").forEach(function (el) {
      if (!validateField(el)) {
        ok = false;
        if (!first) first = el;
      }
    });
    if (!ok) {
      if (first) first.focus();
      return;
    }
    form.style.display = "none";
    success.classList.add("is-visible");
    success.setAttribute("tabindex", "-1");
    success.focus();
    success.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  var reset = document.getElementById("form-reset");
  if (reset) {
    reset.addEventListener("click", function () {
      form.reset();
      form.style.display = "";
      success.classList.remove("is-visible");
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
})();
