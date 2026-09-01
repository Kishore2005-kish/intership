/* Nestora India — vanilla JS behaviour */
(function () {
  "use strict";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Header: mobile nav + scrolled state ---------- */
  function initHeader() {
    var header = $(".site-header");
    var toggle = $(".nav-toggle");
    var links = $(".nav-links");
    if (toggle && links) {
      toggle.addEventListener("click", function () {
        links.classList.toggle("open");
        toggle.setAttribute("aria-expanded", links.classList.contains("open"));
      });
    }
    if (header) {
      var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 8); };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
    var path = location.pathname.split("/").pop() || "index.html";
    $$(".nav-links a").forEach(function (a) {
      if (a.getAttribute("href") === path) a.classList.add("active");
    });
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var els = $$(".reveal");
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (e) { e.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- Property cards ---------- */
  function propertyCard(p) {
    var specs = p.beds
      ? '<span class="chip">' + p.beds + ' Bedroom</span><span class="chip">' + p.baths + ' Bathroom</span>'
      : '<span class="chip">Residential plot</span>';
    return (
      '<article class="card reveal">' +
      '<a class="prop-media" href="property.html?id=' + p.id + '">' +
      '<img loading="lazy" src="' + p.img + '" alt="' + p.title + ' in ' + p.locality + '">' +
      '<span class="prop-tag">' + p.tag + "</span></a>" +
      '<div class="prop-body">' +
      '<p class="prop-loc">' + p.locality + "</p>" +
      '<h3 class="prop-title">' + p.title + "</h3>" +
      '<p class="prop-desc">' + p.desc + "</p>" +
      '<div class="prop-specs">' + specs + '<span class="chip">' + p.area + "</span>" +
      '<span class="chip">' + p.type + "</span></div>" +
      '<div class="prop-foot"><div><p class="price-l">Price</p><p class="price">' + p.priceLabel + "</p></div>" +
      '<a class="btn btn-primary" href="property.html?id=' + p.id + '">View Details</a></div>' +
      "</div></article>"
    );
  }

  function initFeatured() {
    var el = $("#featured-properties");
    if (!el || !window.NESTORA_PROPERTIES) return;
    el.innerHTML = window.NESTORA_PROPERTIES.slice(0, 3).map(propertyCard).join("");
  }

  /* ---------- Properties listing + filters ---------- */
  function initListing() {
    var grid = $("#property-grid");
    if (!grid || !window.NESTORA_PROPERTIES) return;
    var q = $("#f-search"), city = $("#f-city"), type = $("#f-type"),
        budget = $("#f-budget"), beds = $("#f-beds"), count = $("#result-count");

    function render() {
      var term = (q.value || "").trim().toLowerCase();
      var list = window.NESTORA_PROPERTIES.filter(function (p) {
        if (term && (p.title + " " + p.locality + " " + p.city + " " + p.type).toLowerCase().indexOf(term) === -1) return false;
        if (city.value && p.city !== city.value) return false;
        if (type.value && p.type !== type.value) return false;
        if (beds.value && p.beds < Number(beds.value)) return false;
        if (budget.value) {
          var r = budget.value.split("-").map(Number);
          if (p.price < r[0] || p.price > r[1]) return false;
        }
        return true;
      });
      count.textContent = list.length + (list.length === 1 ? " property" : " properties") + " available";
      grid.innerHTML = list.length
        ? list.map(propertyCard).join("")
        : '<p class="muted">No properties match these filters. Try widening your budget or location.</p>';
      initReveal();
    }

    [q, city, type, budget, beds].forEach(function (el) {
      if (!el) return;
      el.addEventListener("input", render);
      el.addEventListener("change", render);
    });
    var reset = $("#f-reset");
    if (reset) reset.addEventListener("click", function () {
      [q, city, type, budget, beds].forEach(function (e) { e.value = ""; });
      render();
    });
    render();
  }

  /* ---------- Testimonial slider ---------- */
  function initTestimonials() {
    var track = $("#testimonial-track");
    if (!track || !window.NESTORA_TESTIMONIALS) return;
    var dotsEl = $("#testimonial-dots");
    var data = window.NESTORA_TESTIMONIALS;
    var perPage = window.innerWidth < 700 ? 1 : 3;
    var pages = Math.ceil(data.length / perPage);
    var page = 0;

    function render() {
      var items = data.slice(page * perPage, page * perPage + perPage);
      track.innerHTML = items.map(function (t) {
        return (
          '<div class="card card-pad">' +
          '<p class="stars">★★★★★</p>' +
          '<h3 style="margin:10px 0 8px">' + t.name.split(" ")[0] + "’s experience</h3>" +
          '<p class="muted" style="font-size:13.5px">' + t.text + "</p>" +
          '<div class="person"><div><strong>' + t.name + "</strong><span>" + t.place + "</span></div></div>" +
          "</div>"
        );
      }).join("");
      if (dotsEl) {
        dotsEl.innerHTML = "";
        for (var i = 0; i < pages; i++) {
          var b = document.createElement("button");
          b.className = "dot" + (i === page ? " active" : "");
          b.type = "button";
          b.setAttribute("aria-label", "Show testimonials page " + (i + 1));
          b.dataset.i = i;
          b.addEventListener("click", function () { page = Number(this.dataset.i); render(); });
          dotsEl.appendChild(b);
        }
      }
    }
    render();
    setInterval(function () { page = (page + 1) % pages; render(); }, 7000);
  }

  /* ---------- Agents ---------- */
  function initAgents() {
    var el = $("#agent-grid");
    if (!el || !window.NESTORA_AGENTS) return;
    el.innerHTML = window.NESTORA_AGENTS.map(function (a) {
      return (
        '<article class="card reveal"><div class="agent-media">' +
        '<img loading="lazy" src="' + a.img + '" alt="' + a.name + ', ' + a.role + '"></div>' +
        '<div class="card-pad" style="padding:16px"><h3>' + a.name + "</h3>" +
        '<p class="muted" style="font-size:13px">' + a.role + "</p></div>" +
        '<div class="agent-foot"><span>' + a.years + " experience</span><span>" + a.deals + "</span></div></article>"
      );
    }).join("");
  }

  /* ---------- Property detail page ---------- */
  function initDetail() {
    var root = $("#detail-root");
    if (!root || !window.NESTORA_PROPERTIES) return;
    var id = new URLSearchParams(location.search).get("id");
    var p = window.NESTORA_PROPERTIES.filter(function (x) { return x.id === id; })[0] || window.NESTORA_PROPERTIES[0];
    document.title = p.title + " — Nestora India";

    $("#d-title").textContent = p.title;
    $("#d-loc").textContent = p.locality;
    $("#d-price").textContent = p.priceLabel;
    $("#d-desc").textContent = p.desc + " Every Nestora listing is title-verified and registered under RERA " + p.rera + ".";
    $("#d-main-img").src = p.img;
    $("#d-main-img").alt = p.title;
    $("#d-specs").innerHTML = [
      ["Configuration", p.beds ? p.beds + " BHK" : "Plot"],
      ["Bathrooms", p.baths || "—"],
      ["Built-up area", p.area],
      ["Property type", p.type],
      ["Status", p.tag],
      ["RERA ID", p.rera],
    ].map(function (r) {
      return '<div class="card card-pad" style="padding:16px"><p class="price-l">' + r[0] + '</p><p style="font-weight:600">' + r[1] + "</p></div>";
    }).join("");

    var others = window.NESTORA_PROPERTIES.filter(function (x) { return x.id !== p.id; }).slice(0, 3);
    $("#d-similar").innerHTML = others.map(propertyCard).join("");

    // EMI calculator
    var amount = $("#emi-amount"), rate = $("#emi-rate"), years = $("#emi-years"), out = $("#emi-out");
    amount.value = Math.round(p.price * 0.8);
    function emi() {
      var P = Number(amount.value) || 0, r = (Number(rate.value) || 0) / 12 / 100, n = (Number(years.value) || 1) * 12;
      var m = r ? (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : P / n;
      out.textContent = "₹" + Math.round(m).toLocaleString("en-IN") + " / month";
    }
    [amount, rate, years].forEach(function (e) { e.addEventListener("input", emi); });
    emi();
    initReveal();
  }

  /* ---------- Forms ---------- */
  function initForms() {
    $$("form[data-validate]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var ok = true;
        $$("[required]", form).forEach(function (input) {
          var err = input.parentElement.querySelector(".err");
          var v = (input.value || "").trim();
          var msg = "";
          if (!v) msg = "This field is required.";
          else if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = "Enter a valid email address.";
          else if (input.type === "tel" && !/^(\+91[\s-]?)?[6-9]\d{9}$/.test(v.replace(/\s/g, ""))) msg = "Enter a valid Indian mobile number.";
          if (msg) ok = false;
          if (err) err.textContent = msg;
          input.style.borderColor = msg ? "#ff6b6b" : "";
        });
        if (!ok) return;
        form.classList.add("hidden");
        var s = form.parentElement.querySelector(".form-success");
        if (s) s.classList.remove("hidden");
      });
    });

    $$("form[data-newsletter]").forEach(function (f) {
      f.addEventListener("submit", function (e) {
        e.preventDefault();
        var i = f.querySelector("input");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i.value.trim())) { i.style.borderColor = "#ff6b6b"; return; }
        f.innerHTML = '<span style="font-size:13px;color:var(--accent);padding:6px 0">Subscribed — thank you!</span>';
      });
    });
  }

  /* ---------- Accordion ---------- */
  function initAccordion() {
    $$(".acc-q").forEach(function (b) {
      b.addEventListener("click", function () {
        var item = b.parentElement;
        var open = item.classList.contains("open");
        $$(".acc-item").forEach(function (i) { i.classList.remove("open"); });
        if (!open) item.classList.add("open");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initHeader();
    initFeatured();
    initListing();
    initTestimonials();
    initAgents();
    initDetail();
    initForms();
    initAccordion();
    initReveal();
  });
})();
