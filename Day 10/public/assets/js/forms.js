/* =============================================================
   forms.js — client-side validation for the admission enquiry
   and contact forms. No backend: a success message is shown.
   ============================================================= */
(function () {
  "use strict";

  var NAME_RE = /^[A-Za-z][A-Za-z .'-]{1,59}$/;
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
  var PHONE_RE = /^[6-9]\d{9}$/;

  function setError(field, message) {
    var wrap = field.closest(".form-field") || field.parentElement;
    wrap.classList.add("has-error");
    var box = wrap.querySelector(".field-error");
    if (box) box.textContent = message;
    field.setAttribute("aria-invalid", "true");
  }

  function clearError(field) {
    var wrap = field.closest(".form-field") || field.parentElement;
    wrap.classList.remove("has-error");
    field.removeAttribute("aria-invalid");
  }

  function validateField(field) {
    var value = (field.value || "").trim();
    var rule = field.getAttribute("data-rule") || "";
    var label = field.getAttribute("data-label") || "This field";

    if (field.hasAttribute("required") && !value) {
      setError(field, label + " is required.");
      return false;
    }
    if (!value) {
      clearError(field);
      return true;
    }

    switch (rule) {
      case "name":
        if (!NAME_RE.test(value)) {
          setError(field, "Enter a valid name (letters, 2-60 characters).");
          return false;
        }
        break;
      case "email":
        if (!EMAIL_RE.test(value)) {
          setError(field, "Enter a valid email address, e.g. name@example.com.");
          return false;
        }
        break;
      case "phone":
        if (!PHONE_RE.test(value.replace(/[\s-]/g, ""))) {
          setError(field, "Enter a valid 10-digit Indian mobile number.");
          return false;
        }
        break;
      case "message":
        if (value.length < 15) {
          setError(field, "Please write at least 15 characters.");
          return false;
        }
        if (value.length > 1000) {
          setError(field, "Please keep it under 1000 characters.");
          return false;
        }
        break;
      case "select":
        if (!value) {
          setError(field, "Please choose an option.");
          return false;
        }
        break;
      case "year":
        var year = parseInt(value, 10);
        var now = new Date().getFullYear();
        if (isNaN(year) || year < now - 20 || year > now) {
          setError(field, "Enter a birth year between " + (now - 20) + " and " + now + ".");
          return false;
        }
        break;
      default:
        break;
    }
    clearError(field);
    return true;
  }

  document.querySelectorAll("[data-validate]").forEach(function (form) {
    var fields = form.querySelectorAll("input[data-label], select[data-label], textarea[data-label]");
    var alertBox = form.querySelector(".form-alert");

    fields.forEach(function (field) {
      field.addEventListener("blur", function () {
        validateField(field);
      });
      field.addEventListener("input", function () {
        if ((field.closest(".form-field") || field.parentElement).classList.contains("has-error")) {
          validateField(field);
        }
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      var firstBad = null;
      fields.forEach(function (field) {
        if (!validateField(field)) {
          valid = false;
          if (!firstBad) firstBad = field;
        }
      });

      var consent = form.querySelector("[data-consent]");
      if (consent && !consent.checked) {
        valid = false;
        if (!firstBad) firstBad = consent;
        setError(consent, "Please accept the declaration to continue.");
      } else if (consent) {
        clearError(consent);
      }

      if (!valid) {
        if (alertBox) {
          alertBox.className = "form-alert error show";
          alertBox.textContent = "Please correct the highlighted fields and submit again.";
        }
        if (firstBad) firstBad.focus();
        return;
      }

      var name = (form.querySelector('[data-rule="name"]') || {}).value || "there";
      if (alertBox) {
        alertBox.className = "form-alert success show";
        alertBox.innerHTML =
          "<strong>Thank you, " +
          name.trim().split(" ")[0] +
          "!</strong> Your enquiry has been recorded. Our admissions team will contact you within 2 working days.";
        alertBox.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      form.reset();
      fields.forEach(clearError);
    });
  });
})();
