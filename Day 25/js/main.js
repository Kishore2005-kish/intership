/* ============================================================
   main.js — shared site behaviour
   • sticky header + style change on scroll
   • mobile navigation drawer
   • accessible modal helper (used by rooms / events)
   • scroll reveal animations
   • accordion
   • footer year
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Sticky header ---------- */
  var header = document.querySelector(".site-header");
  var hasHero = document.querySelector(".hero, .page-hero");

  function onScroll() {
    if (!header) return;
    var threshold = hasHero ? 90 : 10;
    header.classList.toggle("is-solid", window.scrollY > threshold);
  }

  if (!hasHero && header) header.classList.add("is-solid");
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  var burger = document.querySelector(".burger");
  var drawer = document.getElementById("mobileNav");
  var drawerClose = drawer && drawer.querySelector(".mobile-nav__close");

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add("is-open");
    document.body.classList.add("no-scroll");
    burger.setAttribute("aria-expanded", "true");
    if (drawerClose) drawerClose.focus();
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    burger.setAttribute("aria-expanded", "false");
    burger.focus();
  }

  if (burger && drawer) {
    burger.addEventListener("click", openDrawer);
    if (drawerClose) drawerClose.addEventListener("click", closeDrawer);
    drawer.addEventListener("click", function (e) {
      if (e.target.tagName === "A") closeDrawer();
    });
  }

  /* ---------- Modal helper (shared) ---------- */
  var FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  var lastFocused = null;

  function openModal(modal) {
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    var first = modal.querySelector(".modal__close") || modal.querySelector(FOCUSABLE);
    if (first) first.focus();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  /* keep tab focus inside an open modal */
  function trapFocus(e) {
    var modal = document.querySelector(".modal.is-open");
    if (!modal || e.key !== "Tab") return;
    var items = Array.prototype.filter.call(modal.querySelectorAll(FOCUSABLE), function (el) {
      return el.offsetParent !== null;
    });
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      var openM = document.querySelector(".modal.is-open");
      if (openM) closeModal(openM);
      if (drawer && drawer.classList.contains("is-open")) closeDrawer();
    }
    trapFocus(e);
  });

  document.addEventListener("click", function (e) {
    var modal = e.target.closest ? e.target.closest(".modal") : null;
    if (!modal) return;
    if (e.target === modal || (e.target.closest && e.target.closest("[data-close-modal]"))) {
      closeModal(modal);
    }
  });

  /* expose small shared API */
  window.LM = window.LM || {};
  window.LM.openModal = openModal;
  window.LM.closeModal = closeModal;

  /* ---------- Scroll reveal ---------- */
  var io = null;
  if ("IntersectionObserver" in window) {
    io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
  }

  function watchReveals(root) {
    var scope = root && root.querySelectorAll ? root : document;
    scope.querySelectorAll(".reveal:not(.is-visible)").forEach(function (el) {
      if (io) {
        io.observe(el);
        /* safety: if it is already in view or never observed, show it */
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add("is-visible");
        }
      } else {
        el.classList.add("is-visible");
      }
    });
  }

  window.LM.watchReveals = watchReveals;
  watchReveals(document);

  /* ---------- Accordion ---------- */
  document.querySelectorAll(".accordion__trigger").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      var panel = document.getElementById(trigger.getAttribute("aria-controls"));
      var open = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!open));
      if (panel) panel.hidden = open;
    });
  });

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
