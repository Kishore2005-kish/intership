/* SPITI — vanilla JS: nav toggle, scroll reveal, count-up, lightbox, form validation */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    /* Mobile nav toggle */
    var toggle = document.querySelector(".navtoggle");
    var nav = document.getElementById("primary-nav");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    /* Scroll reveal */
    var revealables = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      revealables.forEach(function (el) { io.observe(el); });
    } else {
      revealables.forEach(function (el) { el.classList.add("in"); });
    }

    /* Animated count-up */
    var counters = document.querySelectorAll("[data-count]");
    function runCount(el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var suffix = el.getAttribute("data-suffix") || "";
      var start = performance.now();
      var dur = 1600;
      function frame(now) {
        var p = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = Math.round(target * eased);
        el.textContent = val.toLocaleString("en-IN") + suffix;
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }
    if (counters.length) {
      if ("IntersectionObserver" in window) {
        var co = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (e) {
              if (e.isIntersecting) {
                runCount(e.target);
                co.unobserve(e.target);
              }
            });
          },
          { threshold: 0.5 }
        );
        counters.forEach(function (el) { co.observe(el); });
      } else {
        counters.forEach(runCount);
      }
    }

    /* Lightbox */
    var gallery = document.querySelector(".gallery");
    if (gallery) {
      var box = document.createElement("div");
      box.className = "lightbox";
      box.setAttribute("role", "dialog");
      box.setAttribute("aria-label", "Image viewer");
      var big = document.createElement("img");
      big.alt = "";
      box.appendChild(big);
      document.body.appendChild(box);

      gallery.addEventListener("click", function (e) {
        var img = e.target.closest("img");
        if (!img) return;
        big.src = img.currentSrc || img.src;
        big.alt = img.alt;
        box.classList.add("open");
      });
      box.addEventListener("click", function () { box.classList.remove("open"); });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") box.classList.remove("open");
      });
    }

    /* Contact form validation */
    var form = document.getElementById("enquiry");
    if (form) {
      var out = document.getElementById("form-result");
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var ok = true;
        var fields = form.querySelectorAll("[data-validate]");
        fields.forEach(function (field) {
          var msg = form.querySelector('[data-error-for="' + field.id + '"]');
          var value = field.value.trim();
          var error = "";
          if (!value) {
            error = "This field is required.";
          } else if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
            error = "Enter a valid email address.";
          } else if (field.id === "message" && value.length < 12) {
            error = "Tell us a little more (12 characters minimum).";
          }
          if (msg) msg.textContent = error;
          if (error) ok = false;
        });
        if (out) {
          out.textContent = ok
            ? "Thank you. Your enquiry is noted — we reply within two days from Kaza."
            : "";
        }
        if (ok) form.reset();
      });
    }
  });
})();
