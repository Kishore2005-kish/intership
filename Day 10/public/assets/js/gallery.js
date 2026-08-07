/* =============================================================
   gallery.js — custom lightbox for the photo gallery
   Click / Enter to open, arrows or swipe to move, Esc to close.
   ============================================================= */
(function () {
  "use strict";

  var grid = document.querySelector("[data-gallery]");
  if (!grid) return;

  var items = [];
  var index = 0;

  /* Build the lightbox markup once */
  var lb = document.createElement("div");
  lb.className = "lightbox";
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-modal", "true");
  lb.setAttribute("aria-label", "Photo viewer");
  lb.innerHTML =
    '<span class="lb-counter" data-lb-counter></span>' +
    '<button type="button" class="lb-btn lb-close" aria-label="Close viewer"><i class="bi bi-x-lg"></i></button>' +
    '<button type="button" class="lb-btn lb-prev" aria-label="Previous photo"><i class="bi bi-chevron-left"></i></button>' +
    '<button type="button" class="lb-btn lb-next" aria-label="Next photo"><i class="bi bi-chevron-right"></i></button>' +
    '<figure><img alt="" data-lb-img><figcaption data-lb-caption></figcaption></figure>';
  document.body.appendChild(lb);

  var lbImg = lb.querySelector("[data-lb-img]");
  var lbCap = lb.querySelector("[data-lb-caption]");
  var lbCount = lb.querySelector("[data-lb-counter]");
  var lastFocused = null;

  function collect() {
    items = Array.prototype.filter.call(grid.querySelectorAll(".gallery-item"), function (el) {
      return !el.classList.contains("is-hidden");
    });
  }

  function render() {
    var el = items[index];
    if (!el) return;
    var img = el.querySelector("img");
    lbImg.src = img.getAttribute("data-full") || img.src;
    lbImg.alt = img.alt || "";
    lbCap.textContent = el.getAttribute("data-caption") || img.alt || "";
    lbCount.textContent = index + 1 + " / " + items.length;
  }

  function open(el) {
    collect();
    index = items.indexOf(el);
    if (index < 0) index = 0;
    lastFocused = document.activeElement;
    render();
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
    lb.querySelector(".lb-close").focus();
  }

  function close() {
    lb.classList.remove("open");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  function move(step) {
    if (!items.length) return;
    index = (index + step + items.length) % items.length;
    render();
  }

  grid.addEventListener("click", function (e) {
    var item = e.target.closest(".gallery-item");
    if (item) open(item);
  });

  lb.querySelector(".lb-close").addEventListener("click", close);
  lb.querySelector(".lb-prev").addEventListener("click", function () {
    move(-1);
  });
  lb.querySelector(".lb-next").addEventListener("click", function () {
    move(1);
  });
  lb.addEventListener("click", function (e) {
    if (e.target === lb) close();
  });

  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") move(-1);
    if (e.key === "ArrowRight") move(1);
  });

  /* touch swipe */
  var startX = null;
  lb.addEventListener(
    "touchstart",
    function (e) {
      startX = e.touches[0].clientX;
    },
    { passive: true }
  );
  lb.addEventListener(
    "touchend",
    function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) move(dx < 0 ? 1 : -1);
      startX = null;
    },
    { passive: true }
  );

  /* let the filter buttons in main.js resync the visible set */
  window.VISGallery = { refresh: collect };
  collect();
})();
