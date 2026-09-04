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
    if (!q(".hero-wrap")) return;
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
    if (!q(".about")) return;
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
        scrollTrigger: { trigger: el, start: "top 92%", end: "top 50%", scrub: 0.6 }
      });
    });
    if (reduced) return;
    var grp = q(".stats");
    if (!grp) return;
    gsap.from(grp.querySelectorAll(".stat"), {
      y: 40, opacity: 0, ease: "none", stagger: 0.1,
      scrollTrigger: { trigger: grp, start: "top 92%", end: "top 50%", scrub: 0.6 }
    });
  }

  /* ---------------- 8. Large planning image ---------------- */
  function initPlanningImage() {
    if (!q(".planning")) return;
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
    if (!q(".intro")) return;
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
    if (!q(".dest")) return;
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
    if (!q(".services")) return;
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
  var PROPERTIES = (window.NN && window.NN.properties) ? window.NN.properties.map(function (p) {
    return { name: p.name, place: p.place, img: p.hero };
  }) : [];

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
    if (!q(".cta")) return;
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

  /* ============= MULTI-PAGE CHROME ============= */

  /* mark the current page link active in the topbar + footer */
  function initActiveNav() {
    var here = location.pathname.split("/").pop() || "index.html";
    qa('a[data-nav="' + here + '"]').forEach(function (a) { a.classList.add("is-active"); });
  }

  /* transparent over hero, solid hairline bar once scrolled */
  function initTopbarScroll() {
    var bar = q(".topbar");
    if (!bar) return;
    var onScroll = function () {
      bar.classList.toggle("is-solid", (window.scrollY || window.pageYOffset) > window.innerHeight * 0.7);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* sub-page hero: masked title + image settle */
  function initSubhero() {
    var img = q(".subhero__img");
    var lines = qa(".subhero__title .line");
    if (reduced) { gsap.set(lines, { y: 0 }); gsap.set(img, { scale: 1 }); return; }
    gsap.set(lines, { yPercent: 115 });
    gsap.to(lines, { yPercent: 0, duration: 1.4, ease: "power3.out", stagger: 0.1, delay: 0.15 });
    if (img) gsap.to(img, { scale: 1, duration: 2.6, ease: "power2.out" });
    gsap.from(".subhero__label, .subhero__sub", {
      opacity: 0, y: 22, ease: "power2.out", stagger: 0.12, delay: 0.4, duration: 1
    });
  }

  /* generic masked-line reveal for any [data-reveal] block */
  function initReveals() {
    qa("[data-reveal]").forEach(function (el) {
      var lines = qa(".line", el);
      if (!lines.length) return;
      if (reduced) { gsap.set(lines, { y: 0 }); return; }
      gsap.set(lines, { yPercent: 115 });
      gsap.to(lines, {
        yPercent: 0, ease: "power2.out", stagger: 0.1,
        scrollTrigger: { trigger: el, start: "top 85%", end: "top 30%", scrub: 0.5 }
      });
    });
  }

  /* fade-up for [data-rise] elements */
  function initRise() {
    if (reduced) return;
    qa("[data-rise]").forEach(function (el) {
      gsap.from(el, {
        opacity: 0, y: 44, ease: "power2.out", duration: 0.8,
        scrollTrigger: { trigger: el, start: "top 90%" }
      });
    });
  }

  /* clip-in images: container [data-clip] reveals its inner img */
  function initClipImages() {
    qa("[data-clip]").forEach(function (el) {
      var img = el.querySelector("img");
      if (reduced) { gsap.set(el, { clipPath: "inset(0 0 0 0)" }); gsap.set(img, { scale: 1 }); return; }
      gsap.set(el, { clipPath: "inset(100% 0 0 0)" });
      gsap.timeline({ scrollTrigger: { trigger: el, start: "top 90%", end: "top 45%", scrub: 0.6 } })
        .to(el, { clipPath: "inset(0 0 0 0)", ease: "none" }, 0)
        .fromTo(img, { scale: 1.12 }, { scale: 1, ease: "none" }, 0);
    });
  }

  /* animated horizontal rule 0 -> 100% */
  function initRules() {
    if (reduced) return;
    qa("[data-rule]").forEach(function (el) {
      gsap.from(el, {
        scaleX: 0, ease: "none", transformOrigin: "left center",
        scrollTrigger: { trigger: el, start: "top 92%", end: "top 60%", scrub: 0.5 }
      });
    });
  }

  /* ---------- listings gallery ---------- */
  function initPropertyGallery() {
    var grid = q("[data-gallery]");
    if (!grid) return;
    var data = (window.NN && window.NN.properties) || [];
    var active = { region: "all", type: "all", status: "all" };
    var countEl = q("[data-count-label]");

    function card(p) {
      return '<a class="pcard" href="property.html?id=' + p.slug + '">' +
        '<figure class="pcard__media" data-clip><img loading="lazy" src="' + p.hero + '" alt="' + p.name + '" />' +
        '<span class="pcard__badge">' + p.status + '</span></figure>' +
        '<div class="pcard__body"><span class="label">' + p.region + ' &middot; ' + p.type + '</span>' +
        '<h3 class="pcard__name">' + p.name + '</h3>' +
        '<p class="pcard__place">' + p.place + '</p>' +
        '<div class="pcard__meta"><span>' + p.sqm + 'm&sup2;</span><span>' + p.beds + ' beds</span><span>' + p.priceBand + '</span></div>' +
        '</div></a>';
    }

    function render() {
      var list = data.filter(function (p) {
        return (active.region === "all" || p.region === active.region) &&
               (active.type === "all" || p.type === active.type) &&
               (active.status === "all" || p.status === active.status);
      });
      grid.innerHTML = list.map(card).join("");
      if (countEl) countEl.textContent = list.length;
      initClipImages();
      if (!reduced) {
        gsap.from(grid.querySelectorAll(".pcard"), {
          opacity: 0, y: 40, stagger: 0.06, duration: 0.6, ease: "power2.out",
          scrollTrigger: { trigger: grid, start: "top 92%" }
        });
      }
    }

    qa("[data-filter]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var group = btn.getAttribute("data-group");
        active[group] = btn.getAttribute("data-filter");
        qa("[data-group=\"" + group + "\"]").forEach(function (b) { b.classList.remove("is-on"); });
        btn.classList.add("is-on");
        render();
      });
    });

    render();
  }

  /* ---------- property detail ---------- */
  function initPropertyDetail() {
    var root = q("[data-detail]");
    if (!root) return;
    var data = (window.NN && window.NN.properties) || [];
    var id = new URLSearchParams(location.search).get("id");
    var p = null;
    for (var i = 0; i < data.length; i++) { if (data[i].slug === id) { p = data[i]; break; } }

    if (!p) {
      var nf = q("[data-notfound]");
      if (nf) { nf.style.display = "grid"; document.title = "Property not found — Dhome"; }
      return;
    }

    document.title = p.name + " — Dhome Estates";
    var set = function (sel, val, attr) {
      var el = q(sel, root);
      if (!el) return;
      if (attr) el.setAttribute(attr, val); else el.innerHTML = val;
    };
    var titleLines = qa(".subhero__title .line", root);
    if (titleLines.length && p.name) {
      var parts = p.name.split(" ");
      titleLines[0].textContent = parts.slice(0, Math.ceil(parts.length / 2)).join(" ");
      if (titleLines[1]) titleLines[1].textContent = parts.slice(Math.ceil(parts.length / 2)).join(" ");
    }
    set(".subhero__img", p.hero, "src");
    set(".subhero__img", p.name + " — " + p.place, "alt");
    set(".subhero__label", p.region + " · " + p.type + " · " + p.status);
    set(".detail__lede", p.summary);
    set(".detail__price", p.price);

    var specs = q("[data-spec]", root);
    if (specs) {
      specs.innerHTML = [
        ["Bedrooms", p.beds], ["Bathrooms", p.baths], ["Interior", p.sqm + "m²"],
        ["Lot", p.lot], ["Year", p.year], ["Region", p.region]
      ].map(function (r) {
        return '<div class="spec"><span class="spec__k">' + r[0] + '</span><span class="spec__v">' + r[1] + '</span></div>';
      }).join("");
    }

    var mat = q("[data-materials]", root);
    if (mat) {
      mat.innerHTML = p.materials.map(function (m) {
        return '<div class="swatch" data-rise><span class="swatch__chip" style="background:' + m.color + '"></span><span class="swatch__name">' + m.name + '</span></div>';
      }).join("");
    }

    var shots = qa("[data-detail-shot]", root);
    if (shots.length && p.gallery) {
      shots.forEach(function (s, i) { var g = p.gallery[i % p.gallery.length]; s.querySelector("img").src = g; });
    }

    var light = q("[data-light] img", root);
    if (light) { light.src = p.light; }
    var map = q("[data-map] img", root);
    if (map) { map.src = p.map; }
    var mapPlace = q("[data-map-place]", root);
    if (mapPlace) { mapPlace.innerHTML = p.place; }

    var enq = q("[data-enquire]", root);
    if (enq) enq.setAttribute("href", "contact.html?id=" + p.slug);

    var idx = data.indexOf(p);
    var prev = data[(idx - 1 + data.length) % data.length];
    var next = data[(idx + 1) % data.length];
    var prevEl = q("[data-prev]", root);
    if (prevEl) { prevEl.setAttribute("href", "property.html?id=" + prev.slug); var pn = prevEl.querySelector(".pn__name"); if (pn) pn.textContent = prev.name; }
    var nextEl = q("[data-next]", root);
    if (nextEl) { nextEl.setAttribute("href", "property.html?id=" + next.slug); var nn2 = nextEl.querySelector(".pn__name"); if (nn2) nn2.textContent = next.name; }

    initBlueprintAnimation();
  }

  /* ---------- journal index + article reader ---------- */
  function initJournal() {
    var grid = q("[data-jgrid]");
    var feat = q("[data-jfeatured]");
    var data = (window.NN && window.NN.articles) || [];
    if (!data.length) return;

    if (feat) {
      var f = data[0];
      feat.setAttribute("href", "article.html?id=" + f.slug);
      q(".jfeatured__media img", feat).src = f.cover;
      q(".jfeatured__cat", feat).textContent = f.category;
      q(".jfeatured__title", feat).textContent = f.title;
      q(".jfeatured__excerpt", feat).textContent = f.excerpt;
      q(".jfeatured__meta", feat).textContent = f.author + " · " + f.date + " · " + f.read;
    }

    if (grid) {
      var rest = feat ? data.slice(1) : data;
      grid.innerHTML = rest.map(function (a) {
        return '<a class="jcard" href="article.html?id=' + a.slug + '">' +
          '<figure class="jcard__media" data-clip><img loading="lazy" src="' + a.cover + '" alt="' + a.title + '" /></figure>' +
          '<span class="jcard__cat">' + a.category + '</span>' +
          '<h3 class="jcard__title">' + a.title + '</h3>' +
          '<p class="jcard__excerpt">' + a.excerpt + '</p>' +
          '<p class="jcard__meta">' + a.author + ' · ' + a.date + ' · ' + a.read + '</p></a>';
      }).join("");
      initClipImages();
    }

    /* category filter */
    qa("[data-jfilter]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var cat = btn.getAttribute("data-jfilter");
        qa("[data-jfilter]").forEach(function (b) { b.classList.remove("is-on"); });
        btn.classList.add("is-on");
        if (!grid) return;
        qa(".jcard", grid).forEach(function (c) {
          c.style.display = (cat === "all" || c.querySelector(".jcard__cat").textContent === cat) ? "" : "none";
        });
      });
    });
  }

  function initArticle() {
    var root = q("[data-article]");
    if (!root) return;
    var data = (window.NN && window.NN.articles) || [];
    var id = new URLSearchParams(location.search).get("id");
    var a = null;
    for (var i = 0; i < data.length; i++) { if (data[i].slug === id) { a = data[i]; break; } }
    if (!a) {
      var nf = q("[data-notfound]");
      if (nf) { nf.style.display = "grid"; document.title = "Article not found — Dhome"; }
      return;
    }
    document.title = a.title + " — Dhome Journal";
    q(".article__cat", root).textContent = a.category;
    q(".article__title", root).innerHTML = a.title;
    q(".article__meta", root).innerHTML = "<span>" + a.author + "</span><span>" + a.date + "</span><span>" + a.read + " read</span>";
    q(".article__cover img", root).src = a.cover;
    q(".article__body", root).innerHTML = a.body;
  }

  /* ---------- contact form ---------- */
  function initContact() {
    var form = q("[data-contact-form]");
    if (!form) return;
    var id = new URLSearchParams(location.search).get("id");
    if (id) {
      var prop = ((window.NN && window.NN.properties) || []).find(function (x) { return x.slug === id; });
      var sel = q("[data-property-select]", form);
      if (prop && sel) sel.value = prop.name;
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      form.classList.add("is-sent");
      form.reset();
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
    initActiveNav();
    initTopbarScroll();
    initSubhero();
    initReveals();
    initRise();
    initClipImages();
    initRules();
    initPropertyGallery();
    initPropertyDetail();
    initJournal();
    initArticle();
    initContact();
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
