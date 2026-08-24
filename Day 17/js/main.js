/* Medicative — vanilla JS: nav, active links, reveal, counters, forms, accordion */
(function () {
  "use strict";

  /* ---- Mobile nav ---- */
  var burger = document.querySelector(".nav__burger");
  var links = document.querySelector(".nav__links");
  if (burger && links) {
    burger.addEventListener("click", function () {
      links.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", links.classList.contains("is-open") ? "true" : "false");
    });
  }

  /* ---- Active nav link ---- */
  var page = location.pathname.split("/").pop() || "index.html";
  Array.prototype.forEach.call(document.querySelectorAll(".nav__links a"), function (a) {
    var href = a.getAttribute("href");
    if (href === page) a.classList.add("is-active");
  });

  /* ---- Scroll reveal ---- */
  var revealables = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    Array.prototype.forEach.call(revealables, function (el) {
      io.observe(el);
    });
  } else {
    Array.prototype.forEach.call(revealables, function (el) {
      el.classList.add("is-in");
    });
  }

  /* ---- Animated counters ---- */
  function countUp(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var start = null;
    var dur = 1400;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    if ("IntersectionObserver" in window) {
      var co = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              countUp(e.target);
              co.unobserve(e.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      Array.prototype.forEach.call(counters, function (el) {
        co.observe(el);
      });
    } else {
      Array.prototype.forEach.call(counters, countUp);
    }
  }

  /* ---- Accordion ---- */
  Array.prototype.forEach.call(document.querySelectorAll(".acc__btn"), function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".acc__item");
      var open = item.classList.contains("is-open");
      Array.prototype.forEach.call(item.parentNode.children, function (sib) {
        sib.classList.remove("is-open");
      });
      if (!open) item.classList.add("is-open");
    });
  });

  /* ---- Form validation ---- */
  function fail(field, message) {
    field.classList.add("has-error");
    var err = field.querySelector(".field__error");
    if (err) err.textContent = message;
  }

  Array.prototype.forEach.call(document.querySelectorAll("form[data-validate]"), function (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var ok = true;
      var note = form.querySelector(".form-note");
      if (note) note.classList.remove("is-visible");

      Array.prototype.forEach.call(form.querySelectorAll(".field"), function (field) {
        field.classList.remove("has-error");
        var input = field.querySelector("input, select, textarea");
        if (!input || !input.hasAttribute("required")) return;
        var value = (input.value || "").trim();

        if (!value) {
          fail(field, "This field is required.");
          ok = false;
          return;
        }
        if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
          fail(field, "Enter a valid email address.");
          ok = false;
          return;
        }
        if (input.type === "tel" && value.replace(/[^0-9]/g, "").length < 7) {
          fail(field, "Enter a valid phone number.");
          ok = false;
        }
      });

      if (ok) {
        form.reset();
        if (note) {
          note.textContent =
            form.getAttribute("data-success") ||
            "Thank you! Your request has been received — our desk will call you shortly.";
          note.classList.add("is-visible");
          note.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    });

    Array.prototype.forEach.call(form.querySelectorAll("input, select, textarea"), function (input) {
      input.addEventListener("input", function () {
        var f = input.closest(".field");
        if (f) f.classList.remove("has-error");
      });
    });
  });

  /* ---- Current year ---- */
  Array.prototype.forEach.call(document.querySelectorAll("[data-year]"), function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
