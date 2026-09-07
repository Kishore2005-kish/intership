/* Kaapi & Co. — vanilla JS: nav, reveals, filters, lightbox, form validation */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    /* --- mobile nav --- */
    var burger = document.querySelector(".hamburger");
    var nav = document.querySelector(".nav");
    if (burger && nav) {
      burger.addEventListener("click", function () {
        var open = nav.classList.toggle("open");
        burger.classList.toggle("open", open);
        burger.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    /* --- scroll reveal --- */
    var items = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      var obs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              e.target.classList.add("visible");
              obs.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      items.forEach(function (el) { obs.observe(el); });
    } else {
      items.forEach(function (el) { el.classList.add("visible"); });
    }

    /* --- product filters --- */
    var filters = document.querySelectorAll(".filter");
    if (filters.length) {
      filters.forEach(function (btn) {
        btn.addEventListener("click", function () {
          filters.forEach(function (b) { b.classList.remove("active"); });
          btn.classList.add("active");
          var key = btn.getAttribute("data-filter");
          document.querySelectorAll("[data-category]").forEach(function (card) {
            var match = key === "all" || card.getAttribute("data-category") === key;
            card.style.display = match ? "" : "none";
          });
        });
      });
    }

    /* --- gallery lightbox --- */
    var box = document.querySelector(".lightbox");
    if (box) {
      var boxImg = box.querySelector("img");
      document.querySelectorAll(".masonry figure").forEach(function (fig) {
        fig.addEventListener("click", function () {
          var img = fig.querySelector("img");
          boxImg.src = img.getAttribute("data-full") || img.src;
          boxImg.alt = img.alt;
          box.classList.add("open");
          document.body.style.overflow = "hidden";
        });
      });
      function closeBox() {
        box.classList.remove("open");
        document.body.style.overflow = "";
      }
      box.addEventListener("click", function (e) {
        if (e.target === box || e.target.classList.contains("close")) closeBox();
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeBox();
      });
    }

    /* --- contact form validation --- */
    var form = document.querySelector("#contact-form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var ok = true;

        function check(id, test) {
          var input = form.querySelector("#" + id);
          var err = form.querySelector('[data-error-for="' + id + '"]');
          var valid = test(input.value.trim());
          if (err) err.classList.toggle("show", !valid);
          if (!valid) ok = false;
          return valid;
        }

        check("name", function (v) { return v.length >= 2; });
        check("email", function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); });
        check("phone", function (v) { return v === "" || /^(\+91[\s-]?)?[6-9]\d{9}$/.test(v.replace(/\s|-/g, "")); });
        check("message", function (v) { return v.length >= 10; });

        var note = form.querySelector(".form-note");
        if (ok) {
          form.reset();
          if (note) {
            note.textContent = "Nandri! Your message has reached our Bengaluru roastery. We reply within one working day.";
            note.classList.add("show");
          }
        } else if (note) {
          note.classList.remove("show");
        }
      });
    }

    /* --- footer year --- */
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  });
})();
