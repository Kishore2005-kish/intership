// Vriksha — plain JavaScript interactions
(function () {
  "use strict";

  // Mobile menu
  var toggle = document.querySelector(".menu-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      toggle.textContent = open ? "\u2715" : "\u2630";
    });
  }

  // Toast
  var toast = document.getElementById("toast");
  var toastTimer;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2200);
  }

  // Add to basket
  var basket = 0;
  document.addEventListener("click", function (event) {
    var button = event.target.closest("[data-add]");
    if (!button) return;
    basket += 1;
    showToast(button.getAttribute("data-add") + " added to basket (" + basket + ")");
  });

  // Shop filters
  var filters = Array.prototype.slice.call(document.querySelectorAll(".filter"));
  var products = Array.prototype.slice.call(document.querySelectorAll("[data-category]"));
  if (filters.length && products.length) {
    filters.forEach(function (filter) {
      filter.addEventListener("click", function () {
        var value = filter.getAttribute("data-filter");
        filters.forEach(function (item) {
          item.setAttribute("aria-pressed", item === filter ? "true" : "false");
        });
        products.forEach(function (product) {
          var match = value === "all" || product.getAttribute("data-category") === value;
          product.hidden = !match;
        });
      });
    });
  }
})();
