/* Bharat Nirman Constructions — vanilla JS interactions */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    /* ---- Mobile nav ---- */
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".nav");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(open));
      });
    }

    /* ---- Transparent header over hero ---- */
    var header = document.querySelector(".site-header");
    var overlayHero = document.querySelector(".hero");
    if (header && overlayHero) {
      var syncHeader = function () {
        if (window.scrollY < 60 && !nav.classList.contains("open")) {
          header.classList.add("is-over");
        } else {
          header.classList.remove("is-over");
        }
      };
      syncHeader();
      window.addEventListener("scroll", syncHeader, { passive: true });
    }

    /* ---- Active nav link ---- */
    var page = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav a").forEach(function (link) {
      if (link.getAttribute("href") === page) link.classList.add("active");
    });

    /* ---- Sector tabs ---- */
    var tabs = document.querySelectorAll(".tab");
    if (tabs.length) {
      var ghost = document.querySelector(".ghost-word");
      tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
          var key = tab.dataset.tab;
          tabs.forEach(function (t) { t.classList.toggle("active", t === tab); });
          document.querySelectorAll(".tab-panel").forEach(function (p) {
            p.classList.toggle("active", p.dataset.panel === key);
          });
          if (ghost) ghost.textContent = tab.textContent.trim();
        });
      });
    }

    /* ---- Project filters ---- */
    var filters = document.querySelectorAll(".filter");
    if (filters.length) {
      filters.forEach(function (btn) {
        btn.addEventListener("click", function () {
          var cat = btn.dataset.filter;
          filters.forEach(function (f) { f.classList.toggle("active", f === btn); });
          document.querySelectorAll(".project").forEach(function (card) {
            var match = cat === "all" || card.dataset.category === cat;
            card.classList.toggle("hide", !match);
          });
        });
      });
    }

    /* ---- Testimonial slider ---- */
    var slides = Array.prototype.slice.call(document.querySelectorAll(".testimonial"));
    if (slides.length > 1) {
      var index = 0;
      var dotsWrap = document.querySelector(".dots");
      var show = function (i) {
        index = (i + slides.length) % slides.length;
        slides.forEach(function (s, n) { s.style.display = n === index ? "block" : "none"; });
        if (dotsWrap) {
          dotsWrap.querySelectorAll(".dot").forEach(function (d, n) {
            d.classList.toggle("active", n === index);
          });
        }
      };
      if (dotsWrap) {
        slides.forEach(function (_, n) {
          var d = document.createElement("button");
          d.className = "dot";
          d.type = "button";
          d.setAttribute("aria-label", "Show testimonial " + (n + 1));
          d.addEventListener("click", function () { show(n); });
          dotsWrap.appendChild(d);
        });
      }
      var prev = document.querySelector("[data-slide='prev']");
      var next = document.querySelector("[data-slide='next']");
      if (prev) prev.addEventListener("click", function () { show(index - 1); });
      if (next) next.addEventListener("click", function () { show(index + 1); });
      show(0);
      setInterval(function () { show(index + 1); }, 7000);
    }

    /* ---- Accordions ---- */
    document.querySelectorAll(".acc-head").forEach(function (head) {
      head.addEventListener("click", function () {
        var acc = head.closest(".acc");
        var open = acc.classList.toggle("open");
        head.setAttribute("aria-expanded", String(open));
      });
    });

    /* ---- Scroll reveal + counters ---- */
    var revealItems = document.querySelectorAll(".reveal");
    var countItems = document.querySelectorAll("[data-count]");

    var runCount = function (el) {
      var target = parseFloat(el.dataset.count);
      var suffix = el.dataset.suffix || "";
      var start = performance.now();
      var dur = 1400;
      var step = function (now) {
        var p = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var value = target * eased;
        el.textContent = (target % 1 ? value.toFixed(1) : Math.round(value)) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          if (entry.target.hasAttribute("data-count")) runCount(entry.target);
          io.unobserve(entry.target);
        });
      }, { threshold: 0.18 });
      revealItems.forEach(function (el) { io.observe(el); });
      countItems.forEach(function (el) { io.observe(el); });
    } else {
      revealItems.forEach(function (el) { el.classList.add("visible"); });
      countItems.forEach(runCount);
    }

    /* ---- Contact form validation ---- */
    var form = document.querySelector(".form");
    if (form) {
      var setError = function (field, message) {
        var box = field.closest(".field");
        var err = box.querySelector(".error");
        if (message) {
          box.classList.add("invalid");
          if (err) err.textContent = message;
        } else {
          box.classList.remove("invalid");
        }
        return !message;
      };

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var ok = true;
        var name = form.querySelector("#name");
        var email = form.querySelector("#email");
        var phone = form.querySelector("#phone");
        var message = form.querySelector("#message");

        ok = setError(name, name.value.trim().length < 2 ? "Please enter your full name." : "") && ok;
        ok = setError(email, /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim()) ? "" : "Enter a valid email address.") && ok;
        ok = setError(phone, /^(\+91[\-\s]?)?[6-9]\d{9}$/.test(phone.value.replace(/\s|-/g, "")) ? "" : "Enter a valid 10-digit Indian mobile number.") && ok;
        ok = setError(message, message.value.trim().length < 10 ? "Tell us a little about your project (10+ characters)." : "") && ok;

        var note = document.querySelector(".form-note");
        if (ok) {
          form.reset();
          if (note) {
            note.classList.add("show");
            note.textContent = "Thank you! Our project team will call you back within one working day.";
          }
        } else if (note) {
          note.classList.remove("show");
        }
      });
    }

    /* ---- Footer year ---- */
    var year = document.querySelector("[data-year]");
    if (year) year.textContent = new Date().getFullYear();
  });
})();
