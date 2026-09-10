/* ============================================================
   gallery.js — lightbox for palace photographs
   Keyboard: ← → to move, Esc to close.
   ============================================================ */

(function () {
  "use strict";

  var triggers = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
  var lightbox = document.getElementById("lightbox");
  if (!triggers.length || !lightbox) return;

  var img = lightbox.querySelector("[data-lb-image]");
  var caption = lightbox.querySelector("[data-lb-caption]");
  var counter = lightbox.querySelector("[data-lb-count]");
  var index = 0;
  var opener = null;

  function paint() {
    var trigger = triggers[index];
    var source = trigger.querySelector("img");
    img.src = source.getAttribute("data-full") || source.src;
    img.alt = source.alt;
    caption.textContent = trigger.getAttribute("data-caption") || source.alt;
    counter.textContent = index + 1 + " / " + triggers.length;
  }

  function open(i) {
    index = i;
    opener = document.activeElement;
    paint();
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    lightbox.querySelector("[data-lb-close]").focus();
  }

  function close() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    if (opener && opener.focus) opener.focus();
  }

  function move(delta) {
    index = (index + delta + triggers.length) % triggers.length;
    paint();
  }

  triggers.forEach(function (trigger, i) {
    trigger.addEventListener("click", function () {
      open(i);
    });
  });

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) close();
    if (e.target.closest("[data-lb-close]")) close();
    if (e.target.closest("[data-lb-prev]")) move(-1);
    if (e.target.closest("[data-lb-next]")) move(1);
  });

  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") move(-1);
    if (e.key === "ArrowRight") move(1);
    if (e.key === "Tab") {
      // keep focus on the lightbox controls
      var items = lightbox.querySelectorAll("button");
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
  });
})();
