/* ===== Shared helpers: nav, footer, storage, toast, formatting ===== */

function money(value) {
  return "₹" + Number(value).toLocaleString("en-IN");
}

function qs(selector, scope) {
  return (scope || document).querySelector(selector);
}

function qsa(selector, scope) {
  return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
}

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

/* ---- LocalStorage helpers ---- */
const Store = {
  read: function (key, fallback) {
    try {
      const raw = localStorage.getItem("wayfare_" + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  },
  write: function (key, value) {
    try {
      localStorage.setItem("wayfare_" + key, JSON.stringify(value));
    } catch (e) {
      /* storage unavailable — ignore */
    }
  },
};

/* ---- Toast ---- */
function toast(message) {
  let el = qs(".toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(el._timer);
  el._timer = setTimeout(function () {
    el.classList.remove("show");
  }, 3200);
}

/* ---- Header & footer injection ---- */
const NAV_ITEMS = [
  { href: "index.html", label: "Home" },
  { href: "destinations.html", label: "Destinations" },
  { href: "packages.html", label: "Packages" },
  { href: "about.html", label: "About Us" },
  { href: "contact.html", label: "Contact" },
];

function currentPage() {
  const path = window.location.pathname.split("/").pop();
  return path && path.length ? path : "index.html";
}

function renderChrome() {
  const page = currentPage();

  const header = qs("[data-header]");
  if (header) {
    header.innerHTML =
      '<div class="container nav">' +
      '<a class="logo" href="index.html">Way<span>fare</span></a>' +
      '<nav><ul class="nav-links" id="navLinks">' +
      NAV_ITEMS.map(function (item) {
        const active = item.href === page ? " class=\"active\"" : "";
        return "<li><a href=\"" + item.href + "\"" + active + ">" + item.label + "</a></li>";
      }).join("") +
      "</ul></nav>" +
      '<div class="nav-actions">' +
      '<a class="btn btn-primary" href="booking.html">Book a trip</a>' +
      '<button class="nav-toggle" id="navToggle" aria-label="Toggle menu" aria-expanded="false"><span></span></button>' +
      "</div></div>";

    const toggle = qs("#navToggle");
    const links = qs("#navLinks");
    toggle.addEventListener("click", function () {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    qsa("#navLinks a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const footer = qs("[data-footer]");
  if (footer) {
    footer.innerHTML =
      '<div class="container">' +
      '<div class="footer-grid">' +
      '<div><h4>Wayfare Travel</h4><p style="font-size:.92rem">Small-group and tailor-made journeys since 2011. Licensed tour operator, IATA accredited, 24/7 on-trip support.</p></div>' +
      "<div><h4>Explore</h4><ul>" +
      NAV_ITEMS.map(function (i) { return '<li><a href="' + i.href + '">' + i.label + "</a></li>"; }).join("") +
      "</ul></div>" +
      '<div><h4>Support</h4><ul>' +
      '<li><a href="contact.html">Help centre</a></li>' +
      '<li><a href="booking.html">Make a booking</a></li>' +
      '<li><a href="about.html">Our promise</a></li>' +
      '<li><a href="contact.html">Cancellation policy</a></li>' +
      "</ul></div>" +
      '<div><h4>Trip inspiration, monthly</h4><p style="font-size:.92rem">Route ideas and seasonal offers. No spam.</p>' +
      '<form class="newsletter" id="newsletterForm" novalidate>' +
      '<input type="email" placeholder="you@example.com" aria-label="Email address" required>' +
      '<button class="btn btn-accent" type="submit">Join</button></form>' +
      '<p class="error" id="newsletterMsg"></p></div>' +
      "</div>" +
      '<div class="footer-bottom"><span>© 2026 Wayfare Travel Pvt. Ltd.</span><span>Bengaluru · Lisbon · Singapore</span></div>' +
      "</div>";

    const form = qs("#newsletterForm");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const input = qs("input", form);
      const msg = qs("#newsletterMsg");
      if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(input.value.trim())) {
        msg.textContent = "Please enter a valid email address.";
        return;
      }
      msg.textContent = "";
      const list = Store.read("newsletter", []);
      list.push({ email: input.value.trim(), at: new Date().toISOString() });
      Store.write("newsletter", list);
      input.value = "";
      toast("You're subscribed. Welcome aboard!");
    });
  }
}

/* ---- Reusable card renderers ---- */
function destinationCard(d) {
  return (
    '<article class="card">' +
    '<div class="card-media"><img src="' + d.image + '" alt="' + d.name + '" loading="lazy">' +
    '<span class="tag tag-float">' + d.category + "</span></div>" +
    '<div class="card-body">' +
    "<h3>" + d.name + "</h3>" +
    '<p class="muted" style="font-size:.92rem">' + d.description + "</p>" +
    '<div class="meta"><span>★ ' + d.rating + "</span><span>" + d.days + " days suggested</span></div>" +
    '<div class="row"><span class="price">' + money(d.price) + '<span style="font-size:.78rem;font-weight:500;color:var(--ink-soft)"> / person</span></span></div>' +
    '<div class="card-foot">' +
    '<a class="btn btn-ghost btn-block" href="packages.html?destination=' + d.id + '">View packages</a>' +
    "</div></div></article>"
  );
}

function packageCard(p) {
  return (
    '<article class="card">' +
    '<div class="card-media"><img src="' + p.image + '" alt="' + p.title + '" loading="lazy">' +
    '<span class="tag tag-float">' + p.category + "</span></div>" +
    '<div class="card-body">' +
    "<h3>" + p.title + "</h3>" +
    '<p class="muted" style="font-size:.88rem">' + p.location + "</p>" +
    '<div class="meta"><span>' + p.days + "D / " + p.nights + "N</span><span>★ " + p.rating + " (" + p.reviews + ")</span><span>" + p.groupSize + "</span></div>" +
    '<div class="row"><span class="price">' + money(p.price) +
    ' <s style="font-size:.82rem;font-weight:400;color:var(--ink-soft)">' + money(p.oldPrice) + "</s></span></div>" +
    '<div class="card-foot">' +
    '<a class="btn btn-ghost" href="package-details.html?id=' + p.id + '">Details</a>' +
    '<a class="btn btn-primary" style="flex:1" href="booking.html?package=' + p.id + '">Book Now</a>' +
    "</div></div></article>"
  );
}

/* ---- Gentle scroll entrances for static and dynamically filtered content ---- */
function initMotion() {
  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("motion-visible");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px 48px 0px", threshold: 0.06 });

  const selector = [
    ".hero .eyebrow", ".hero h1", ".hero .lead", ".hero-actions", ".search-bar",
    ".page-banner .container", ".section-head", ".stats .stat", ".card",
    ".offer", ".quote", ".team-card", ".detail-hero", ".panel",
    ".itinerary-item", ".info-item", ".form-card", ".summary-box"
  ].join(", ");

  function observeNew(scope) {
    const candidates = [];
    if (scope.nodeType !== 1) return;
    if (scope.matches(selector)) candidates.push(scope);
    qsa(selector, scope).forEach(function (element) { candidates.push(element); });
    candidates.forEach(function (element) {
      if (element.classList.contains("motion-pending")) return;
      const siblings = element.parentElement
        ? qsa(":scope > " + element.tagName.toLowerCase(), element.parentElement)
        : [];
      const position = siblings.indexOf(element);
      element.classList.add("motion-pending", "motion-delay-" + Math.min(Math.max(position, 0) % 6, 5));
      observer.observe(element);
    });
  }

  observeNew(document.body);
  const changes = new MutationObserver(function (records) {
    records.forEach(function (record) {
      record.addedNodes.forEach(observeNew);
    });
  });
  changes.observe(document.body, { childList: true, subtree: true });
}

/* ---- One-time home statistics ---- */
function initStats() {
  const figures = qsa(".stats .stat strong");
  if (!figures.length || !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      const figure = entry.target;
      const original = figure.textContent.trim();
      const match = original.match(/^([\d,.]+)(.*)$/);
      if (!match) return;
      const target = Number(match[1].replace(/,/g, ""));
      const decimals = (match[1].split(".")[1] || "").length;
      const suffix = match[2];
      if (!Number.isFinite(target)) return;
      figure.setAttribute("aria-label", original);
      const duration = 1200;
      let started;

      function frame(now) {
        if (started === undefined) started = now;
        const progress = Math.min((now - started) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        figure.textContent = (target * eased).toLocaleString("en-IN", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        }) + suffix;
        if (progress < 1) requestAnimationFrame(frame);
        else figure.textContent = original;
      }
      requestAnimationFrame(frame);
    });
  }, { threshold: 0.35 });

  figures.forEach(function (figure) { observer.observe(figure); });
}

/* ---- Reading progress on every page ---- */
function initReadingProgress() {
  const progress = document.createElement("div");
  progress.className = "reading-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);
  let scheduled = false;

  function update() {
    scheduled = false;
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    const amount = distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0;
    progress.style.transform = "scaleX(" + amount + ")";
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(update);
  }

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  window.addEventListener("load", schedule);
  schedule();
}

document.addEventListener("DOMContentLoaded", function () {
  renderChrome();
  queueMicrotask(initMotion);
  initStats();
  initReadingProgress();
});
