/* Neighborhood Navigators — scroll-driven cinematic site
   GSAP + ScrollTrigger + Lenis. Every major sequence is scrubbed: it
   progresses on scroll down, holds when scrolling stops, reverses on scroll up. */

(function () {
  "use strict";

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var q = function (s, ctx) { return (ctx || document).querySelector(s); };
  var qa = function (s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); };

  /* ---------------- 1. Lenis smooth scroll ---------------- */
  function initLenis() {
    var L = window.Lenis || (window.lenis && window.lenis.default);
    if (!L || reduced) return null;
    var lenis = new L({ duration: 1.15, smoothWheel: true, touchMultiplier: 1.4 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    return lenis;
  }

  /* ---------------- 2. Hero intro (masked title + image settle) ---------------- */
  function initHeroScroll() {
    var lines = qa(".hero__title .line");
    if (reduced) { gsap.set(lines, { y: 0 }); gsap.set(".hero__img", { scale: 1 }); return; }
    gsap.set(lines, { yPercent: 115 });
    gsap.to(lines, { yPercent: 0, duration: 1.5, ease: "power3.out", stagger: 0.12, delay: 0.15 });
    gsap.to(".hero__img", { scale: 1, duration: 2.4, ease: "power2.out" });
  }

  /* ---------------- 3+4. Hero -> collage -> hero recompose (pinned, scrubbed) --- */
  function initCollageTransition() {
    if (reduced) return;
    var tall = q(".panel--tall"), wide = q(".panel--wide"), narrow = q(".panel--narrow");
    gsap.set([tall, wide, narrow], { opacity: 0, scale: 0.9, y: 60 });

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero-wrap",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        pin: ".hero",
        pinSpacing: false,
        anticipatePin: 1
      }
    });

    /* PHASE 1 — hero photograph washes toward ivory */
    tl.to(".hero__wash", { opacity: 1, ease: "none" }, 0)
      .to(".hero__img", { scale: 1.06, ease: "none" }, 0)
      /* PHASE 2 — title leaves */
      .to(".hero__title .line", { yPercent: -110, stagger: 0.06, ease: "power2.in" }, 0)
      .to(".hero__foot", { opacity: 0, ease: "none" }, 0)
      /* PHASE 3 — three editorial panels arrive, staggered */
      .to(tall,   { opacity: 1, scale: 1, y: 0, ease: "power2.out", duration: 0.55 }, 0.22)
      .to(wide,   { opacity: 1, scale: 1, y: 0, ease: "power2.out", duration: 0.55 }, 0.32)
      .to(narrow, { opacity: 1, scale: 1, y: 0, ease: "power2.out", duration: 0.55 }, 0.42)
      /* PHASE 4 — the composition expands, centre panel dominates, hero returns */
      .to([tall, narrow], { opacity: 0, scale: 1.45, ease: "power1.in", duration: 0.5 }, 1.05)
      .to(wide, { scale: 9, ease: "power2.in", duration: 0.75 }, 1.0)
      .to(wide, { opacity: 0, ease: "none", duration: 0.25 }, 1.55)
      .to(".hero__wash", { opacity: 0, ease: "none", duration: 0.5 }, 1.4)
      .to(".hero__img", { scale: 1, ease: "none", duration: 0.6 }, 1.4)
      /* title settles back in the lower-left */
      .fromTo(".hero__title .line",
        { yPercent: 115 },
        { yPercent: 0, stagger: 0.08, ease: "power3.out", duration: 0.5 }, 1.5)
      .to(".hero__foot", { opacity: 1, ease: "none", duration: 0.3 }, 1.7);
  }

  /* ---------------- 5+6. About section ---------------- */
  function initAboutScroll() {
    var lines = qa(".about__statement .line");
    if (reduced) return;
    gsap.set(lines, { yPercent: 110 });
    gsap.timeline({
      scrollTrigger: { trigger: ".about", start: "top 85%", end: "top 25%", scrub: 0.5 }
    })
      .from(".about__label", { opacity: 0, y: 24, ease: "none" }, 0)
      .to(lines, { yPercent: 0, ease: "power2.out", stagger: 0.15 }, 0.15);

    gsap.from(".about__rule", {
      scaleX: 0, ease: "none",
      scrollTrigger: { trigger: ".about__rule", start: "top 92%", end: "top 55%", scrub: 0.5 }
    });
  }

  /* ---------------- 7. Statistics (scroll-scrubbed count) ---------------- */
  function initStatsAnimation() {
    qa("[data-count]").forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var suffix = el.getAttribute("data-suffix") || "";
      if (reduced) { el.textContent = target + suffix; return; }
      var o = { v: 0 };
      gsap.to(o, {
        v: target, ease: "none",
        onUpdate: function () { el.textContent = Math.round(o.v) + suffix; },
        scrollTrigger: { trigger: ".stats", start: "top 88%", end: "top 45%", scrub: 0.6 }
      });
    });
    if (reduced) return;
    gsap.from(".stat", {
      y: 40, opacity: 0, ease: "none", stagger: 0.1,
      scrollTrigger: { trigger: ".stats", start: "top 92%", end: "top 50%", scrub: 0.6 }
    });
  }

  /* ---------------- 8. Large planning image ---------------- */
  function initPlanningImage() {
    if (reduced) { gsap.set(".planning__img", { scale: 1 }); return; }
    gsap.to(".planning__img", {
      scale: 1, ease: "none",
      scrollTrigger: { trigger: ".planning", start: "top 95%", end: "bottom top", scrub: 0.8 }
    });
    gsap.from(".planning__btn", {
      opacity: 0, y: 20, ease: "none",
      scrollTrigger: { trigger: ".planning", start: "top 70%", end: "top 40%", scrub: 0.5 }
    });
  }

  /* ---------------- 9+11. Property introduction ---------------- */
  function initPropertyIntroduction() {
    if (reduced) { gsap.set(".intro__shot", { clipPath: "inset(0 0 0 0)" }); return; }
    var lines = qa(".intro__title .line");
    gsap.set(lines, { yPercent: 110 });
    gsap.timeline({
      scrollTrigger: { trigger: ".intro", start: "top 80%", end: "top 30%", scrub: 0.5 }
    })
      .to(lines, { yPercent: 0, ease: "power2.out", stagger: 0.14 }, 0)
      .from(".intro__copy", { opacity: 0, y: 26, ease: "none" }, 0.3)
      .from(".intro__size", { opacity: 0, y: 34, ease: "none" }, 0.45);

    gsap.timeline({
      scrollTrigger: { trigger: ".intro__shot", start: "top 92%", end: "top 45%", scrub: 0.6 }
    })
      .fromTo(".intro__shot", { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", ease: "none" }, 0)
      .fromTo(".intro__shot img", { scale: 1.08 }, { scale: 1, ease: "none" }, 0);
  }

  /* ---------------- 10. Blueprint SVG line drawing ---------------- */
  function initBlueprintAnimation() {
    var paths = qa(".blueprint path");
    if (!paths.length) return;
    paths.forEach(function (p) {
      var len = p.getTotalLength();
      p.style.strokeDasharray = len;
      if (reduced) { p.style.strokeDashoffset = 0; return; }
      p.style.strokeDashoffset = len;
    });
    if (reduced) return;
    gsap.to(paths, {
      strokeDashoffset: 0, ease: "none", stagger: 0.05,
      scrollTrigger: { trigger: ".intro__right", start: "top 78%", end: "bottom 65%", scrub: 0.7 }
    });
  }

  /* ---------------- 12-14. Destinations + property state change ---------------- */
  function initDestinationSection() {
    var stateLabel = q("#destState");
    if (reduced) return;
    var lines = qa(".dest__title .line");
    gsap.set(lines, { yPercent: 110 });
    gsap.to(lines, {
      yPercent: 0, ease: "power2.out", stagger: 0.12,
      scrollTrigger: { trigger: ".dest", start: "top 80%", end: "top 35%", scrub: 0.5 }
    });

    gsap.from(".dest__grid .dstate--a .frame", {
      yPercent: 12, opacity: 0, ease: "none", stagger: 0.12,
      scrollTrigger: { trigger: ".dest__grid", start: "top 92%", end: "top 45%", scrub: 0.6 }
    });

    /* state A -> state B: sequential crossfade, heading holds its position */
    var mm = gsap.matchMedia();
    mm.add("(min-width: 761px)", function () {
      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".dest",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          pin: ".dest__stage",
          onUpdate: function (self) {
            if (stateLabel) stateLabel.textContent = self.progress > 0.55 ? "02" : "01";
          }
        }
      });
      tl.to(".dstate--a", { opacity: 0, xPercent: -4, scale: 0.985, ease: "none", duration: 0.18 }, 0.36)
        .fromTo(".dstate--b",
          { opacity: 0, xPercent: 5, scale: 1.03 },
          { opacity: 1, xPercent: 0, scale: 1, ease: "none", duration: 0.2 }, 0.56);
      return function () { gsap.set([".dstate--a", ".dstate--b"], { clearProps: "all" }); };
    });
    mm.add("(max-width: 760px)", function () {
      gsap.timeline({
        scrollTrigger: { trigger: ".dest__grid", start: "top 60%", end: "bottom 40%", scrub: 0.6 }
      })
        .to(".dstate--a", { opacity: 0, ease: "none", duration: 0.2 }, 0.4)
        .to(".dstate--b", { opacity: 1, ease: "none", duration: 0.2 }, 0.6);
    });
  }



  /* ---------------- 15+16. Services ---------------- */
  function initServices() {
    if (reduced) return;
    var lines = qa(".services__title .line");
    gsap.set(lines, { yPercent: 110 });
    gsap.timeline({
      scrollTrigger: { trigger: ".services", start: "top 82%", end: "top 20%", scrub: 0.5 }
    })
      .to(lines, { yPercent: 0, ease: "power2.out", stagger: 0.12 }, 0)
      .from(".service", { opacity: 0, y: 46, scale: 0.98, ease: "power1.out", stagger: 0.18 }, 0.35)
      .from(".service__icon", { opacity: 0, scale: 0.85, y: 12, ease: "power1.out", stagger: 0.18 }, 0.35);
  }

  /* ---------------- 17-24. Property navigator (arc wheel) ---------------- */
  var PROPERTIES = [
    { name: "Ocean View Manor", place: "Seaside City, CA 90265", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80" },
    { name: "Willowbrook Estates", place: "Woodland Heights, TX 77002", img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80" },
    { name: "Sunset Ridge Villas", place: "Sunset Hills, FL 33602", img: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1600&q=80" },
    { name: "Cedarwood Retreat", place: "Serenity Springs, AZ 85001", img: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1600&q=80" },
    { name: "Lakeside Haven", place: "Waterfront Bay, MN 55401", img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80" },
    { name: "Mountain View Acres", place: "Mountainville, CO 80303", img: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1600&q=80" },
    { name: "Oakridge Meadows", place: "Peaceful Grove, WA 98001", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80" },
    { name: "Riverbend Ranch", place: "Riverside Ranch, OR 97001", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80" },
    { name: "Prairie Pointe Residence", place: "Prairieville, IL 60601", img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80" },
    { name: "Sentinal Ridge", place: "Summit Park, UT 84098", img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80" }
  ];

  function initPropertyNavigator() {
    var shotsWrap = q("[data-shots]");
    var list = q("[data-wheel]");
    var nameEl = q(".navi__name");
    var placeEl = q(".navi__place");
    if (!shotsWrap || !list) return;

    var count = PROPERTIES.length;
    var STEP = 11;            /* degrees between neighbours */
    var VISIBLE = 4;          /* items each side of centre */
    var shots = [];
    var items = [];

    PROPERTIES.forEach(function (p, i) {
      var fig = document.createElement("figure");
      fig.className = "shot";
      fig.innerHTML = '<img loading="lazy" src="' + p.img + '" alt="' + p.name + ' — ' + p.place + '" />';
      shotsWrap.appendChild(fig);
      shots.push(fig);

      var li = document.createElement("li");
      li.className = "witem";
      li.setAttribute("role", "option");
      li.innerHTML = '<span class="witem__inner"><span class="witem__name">' + p.name +
        '</span><span class="witem__place">' + p.place + "</span></span>";
      li.addEventListener("click", function () { goTo(i); });
      list.appendChild(li);
      items.push(li);
    });

    /* shortest signed distance from current to i, wrapping around the list */
    function offsetOf(i, cur) {
      var d = i - cur;
      if (d > count / 2) d -= count;
      if (d < -count / 2) d += count;
      return d;
    }

    var current = 0;

    function layout(animated) {
      items.forEach(function (li, i) {
        var d = offsetOf(i, current);
        var far = Math.abs(d);
        var vars = {
          rotate: d * STEP,
          yPercent: -50,
          opacity: far > VISIBLE ? 0 : 1 - far * 0.2,
          scale: 1 - Math.min(far, VISIBLE) * 0.06,
          duration: animated ? 0.7 : 0,
          ease: "power3.out",
          overwrite: true
        };
        gsap.to(li, vars);
        li.classList.toggle("is-active", i === current);
        li.setAttribute("aria-selected", i === current ? "true" : "false");
      });

      shots.forEach(function (s, i) {
        if (i === current) {
          s.classList.add("is-active");
          if (animated) {
            gsap.fromTo(s, { opacity: 0, scale: 1.06, xPercent: 4 },
              { opacity: 1, scale: 1, xPercent: 0, duration: 0.9, ease: "power2.out", overwrite: true });
          } else {
            gsap.set(s, { opacity: 1, scale: 1, xPercent: 0 });
          }
        } else {
          s.classList.remove("is-active");
          gsap.to(s, { opacity: 0, duration: animated ? 0.6 : 0, ease: "power2.out", overwrite: true });
        }
      });

      var p = PROPERTIES[current];
      if (nameEl) {
        nameEl.textContent = p.name;
        if (animated) gsap.fromTo(nameEl, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
      }
      if (placeEl) placeEl.textContent = p.place;
    }

    function goTo(i) {
      var next = ((i % count) + count) % count;
      if (next === current) return;
      current = next;
      layout(true);
    }

    function step(dir) { goTo(current + dir); }

    layout(false);

    qa(".warrow").forEach(function (btn) {
      btn.addEventListener("click", function () { step(parseInt(btn.getAttribute("data-dir"), 10) || 1); });
    });

    /* keyboard */
    var section = q(".nav-wrap");
    section.setAttribute("tabindex", "-1");
    section.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); step(1); }
      if (e.key === "ArrowUp") { e.preventDefault(); step(-1); }
    });

    /* wheel over the arc steps the list; releases at the ends so the page can scroll */
    var wheelEl = q(".wheel");
    var locked = false;
    if (wheelEl) {
      wheelEl.addEventListener("wheel", function (e) {
        var dir = e.deltaY > 0 ? 1 : -1;
        var atEnd = (dir === 1 && current === count - 1) || (dir === -1 && current === 0);
        if (atEnd) return;
        e.preventDefault();
        if (locked) return;
        locked = true;
        setTimeout(function () { locked = false; }, 420);
        goTo(current + dir);
      }, { passive: false });
    }

    if (reduced) return;

    /* entry animation */
    gsap.from(".wheel__arc, .wheel__arrows, .wheel__dot", {
      opacity: 0, duration: 0.8, ease: "power2.out", stagger: 0.08,
      scrollTrigger: { trigger: ".navi", start: "top 70%" }
    });
    gsap.from(".wheel__list", {
      opacity: 0, duration: 0.9, ease: "power2.out",
      scrollTrigger: { trigger: ".navi", start: "top 70%" }
    });

  }


  /* ---------------- 25+26. Final CTA ---------------- */
  function initFinalCTA() {
    if (reduced) return;
    var lines = qa(".cta__title .line");
    gsap.set(lines, { yPercent: 110 });
    gsap.timeline({
      scrollTrigger: { trigger: ".cta", start: "top 85%", end: "top 30%", scrub: 0.5 }
    })
      .to(lines, { yPercent: 0, ease: "power2.out", stagger: 0.1 }, 0)
      .from(".cta__btn", { opacity: 0, y: 30, ease: "none" }, 0.55);

    gsap.from(".footer__title", {
      opacity: 0, y: 40, ease: "none",
      scrollTrigger: { trigger: ".footer", start: "top 90%", end: "top 50%", scrub: 0.5 }
    });
  }

  /* ---------------- back to top ---------------- */
  function initBackToTop(lenis) {
    var btn = q("#backToTop");
    if (!btn) return;
    btn.addEventListener("click", function () {
      if (lenis) lenis.scrollTo(0, { duration: 2 });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function boot() {
    var lenis = initLenis();
    initHeroScroll();
    initCollageTransition();
    initAboutScroll();
    initStatsAnimation();
    initPlanningImage();
    initPropertyIntroduction();
    initBlueprintAnimation();
    initDestinationSection();
    initServices();
    initPropertyNavigator();
    initFinalCTA();
    initBackToTop(lenis);

    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
    var t;
    window.addEventListener("resize", function () {
      clearTimeout(t);
      t = setTimeout(function () { ScrollTrigger.refresh(); }, 200);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
