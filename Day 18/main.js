/* Alowishus Coffee — vanilla JS, shared by all pages */
(function () {
  "use strict";

  /* ---------- sticky header ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  var burger = document.querySelector(".burger");
  var links = document.querySelector(".nav-links");
  if (burger && links) {
    burger.addEventListener("click", function () {
      links.classList.toggle("open");
    });
  }

  /* ---------- active nav link ---------- */
  var here = location.pathname.split("/").pop() || "index.html";
  Array.prototype.forEach.call(document.querySelectorAll(".nav-links a"), function (a) {
    var target = a.getAttribute("href");
    if (target === here) a.classList.add("active");
  });

  /* ---------- toast ---------- */
  var toast = document.createElement("div");
  toast.className = "toast";
  document.body.appendChild(toast);
  var toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 2200);
  }

  /* ---------- cart (persisted across pages) ---------- */
  function readCart() {
    var n = parseInt(localStorage.getItem("alowishus_cart") || "0", 10);
    return isNaN(n) ? 0 : n;
  }
  function paintCart() {
    var el = document.querySelector(".cart-count");
    if (el) el.textContent = String(readCart());
  }
  paintCart();

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-add]");
    if (!btn) return;
    e.preventDefault();
    localStorage.setItem("alowishus_cart", String(readCart() + 1));
    paintCart();
    showToast((btn.getAttribute("data-add") || "Item") + " added to your order");
  });

  /* ---------- scroll reveal ---------- */
  var revealables = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
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
      el.classList.add("in");
    });
  }

  /* ---------- menu category filter ---------- */
  var chips = document.querySelectorAll(".chip[data-filter]");
  if (chips.length) {
    Array.prototype.forEach.call(chips, function (chip) {
      chip.addEventListener("click", function () {
        var f = chip.getAttribute("data-filter");
        Array.prototype.forEach.call(chips, function (c) {
          c.classList.toggle("active", c === chip);
        });
        Array.prototype.forEach.call(document.querySelectorAll(".menu-item"), function (item) {
          var cat = item.getAttribute("data-cat");
          item.style.display = f === "all" || cat === f ? "" : "none";
        });
      });
    });
  }

  /* ---------- contact form validation ---------- */
  var form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      Array.prototype.forEach.call(form.querySelectorAll(".field"), function (field) {
        var input = field.querySelector("input, textarea");
        if (!input || !input.required) return;
        var value = (input.value || "").trim();
        var bad = value === "";
        if (!bad && input.type === "email") bad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        if (!bad && input.name === "phone") bad = !/^(\+91[\s-]?)?[6-9]\d{9}$/.test(value.replace(/\s/g, ""));
        field.classList.toggle("invalid", bad);
        if (bad) ok = false;
      });
      var note = form.querySelector(".form-note");
      if (ok) {
        form.reset();
        if (note) note.classList.add("show");
        showToast("Thanks! We will call you back shortly.");
      } else if (note) {
        note.classList.remove("show");
      }
    });
  }

  /* ---------- newsletter ---------- */
  var news = document.querySelector(".news");
  if (news) {
    news.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = news.querySelector("input");
      var value = (input && input.value.trim()) || "";
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        news.reset();
        showToast("Subscribed. Fresh brews coming your way.");
      } else {
        showToast("Please enter a valid email address.");
      }
    });
  }
})();
