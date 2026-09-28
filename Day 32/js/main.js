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

document.addEventListener("DOMContentLoaded", renderChrome);
