/* =============================================================
   main.js — shared site behaviour
   Sticky/shrinking navbar, active link, smooth scroll,
   scroll-reveal animations, stat counters, back-to-top.
   Vanilla JavaScript, no dependencies.
   ============================================================= */
(function () {
  "use strict";

  /* ---------- 1. Shrinking sticky navbar ---------- */
  var navbar = document.querySelector(".vis-navbar");
  function onScrollNav() {
    if (!navbar) return;
    if (window.scrollY > 40) navbar.classList.add("shrink");
    else navbar.classList.remove("shrink");
  }

  /* ---------- 2. Highlight the current page in the nav ---------- */
  (function markActiveLink() {
    var path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".vis-navbar .nav-link").forEach(function (link) {
      var href = (link.getAttribute("href") || "").split("/").pop();
      if (href === path) link.classList.add("active");
    });
  })();

  /* ---------- 3. Smooth scrolling for in-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var id = anchor.getAttribute("href");
      if (!id || id === "#" || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var offset = navbar ? navbar.offsetHeight + 10 : 0;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: "smooth",
      });
      // close the mobile menu after navigating
      var collapse = document.querySelector(".navbar-collapse.show");
      if (collapse && window.bootstrap) {
        window.bootstrap.Collapse.getOrCreateInstance(collapse).hide();
      }
    });
  });

  /* ---------- 4. Scroll reveal animations ---------- */
  var revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealItems.length) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealItems.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 90 + "ms";
      revealObserver.observe(el);
    });
  } else {
    revealItems.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  /* ---------- 5. Animated statistic counters ---------- */
  function countUp(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1400;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString("en-IN") + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    var countObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            countUp(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) {
      countObserver.observe(el);
    });
  }

  /* ---------- 6. Back-to-top button ---------- */
  var toTop = document.querySelector(".back-to-top");
  function onScrollTop() {
    if (!toTop) return;
    if (window.scrollY > 320) toTop.classList.add("show");
    else toTop.classList.remove("show");
  }
  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  window.addEventListener(
    "scroll",
    function () {
      onScrollNav();
      onScrollTop();
    },
    { passive: true }
  );
  onScrollNav();
  onScrollTop();

  /* ---------- 7. Current year in footer ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- 8. Generic card/grid filtering (faculty, gallery) ---------- */
  document.querySelectorAll("[data-filter-group]").forEach(function (bar) {
    var groupName = bar.getAttribute("data-filter-group");
    var items = document.querySelectorAll('[data-filter-target="' + groupName + '"] [data-category]');
    bar.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter-btn");
      if (!btn) return;
      bar.querySelectorAll(".filter-btn").forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");
      var value = btn.getAttribute("data-filter");
      items.forEach(function (item) {
        var match = value === "all" || item.getAttribute("data-category") === value;
        item.classList.toggle("is-hidden", !match);
        if (match) {
          item.style.animation = "fade-up .45s ease";
        }
      });
      if (window.VISGallery) window.VISGallery.refresh();
    });
  });
})();
