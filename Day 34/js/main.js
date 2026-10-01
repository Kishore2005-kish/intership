/* ============================================================
   Shared utilities, navigation, reveal, saved events, renderers
   ============================================================ */

/* ---------- formatting helpers ---------- */
function formatPrice(value) {
  return value === 0 ? "Free" : "\u20B9" + value.toLocaleString("en-IN");
}

function formatDate(iso, opts) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", opts || { day: "numeric", month: "short", year: "numeric" });
}

function dateParts(iso) {
  const d = new Date(iso + "T00:00:00");
  return {
    day: d.toLocaleDateString("en-US", { day: "2-digit" }),
    month: d.toLocaleDateString("en-US", { month: "short" })
  };
}

function dateRange(event) {
  if (!event.endDate || event.endDate === event.date) return formatDate(event.date);
  return formatDate(event.date, { day: "numeric", month: "short" }) + " – " + formatDate(event.endDate);
}

function categoryName(id) {
  const found = CATEGORIES.find(function (c) { return c.id === id; });
  return found ? found.name : id;
}

function getEvent(id) {
  return EVENTS.find(function (e) { return e.id === id; }) || null;
}

function getSpeaker(id) {
  return SPEAKERS.find(function (s) { return s.id === id; }) || null;
}

function getQueryParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

function debounce(fn, wait) {
  let t;
  return function () {
    const args = arguments;
    clearTimeout(t);
    t = setTimeout(function () { fn.apply(null, args); }, wait || 250);
  };
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

/* ---------- localStorage helpers ---------- */
const STORE = {
  read: function (key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      return fallback;
    }
  },
  write: function (key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (err) { /* storage unavailable */ }
  },
  remove: function (key) {
    try { localStorage.removeItem(key); } catch (err) { /* noop */ }
  }
};

const SAVED_KEY = "summit.savedEvents";
function getSavedEvents() { return STORE.read(SAVED_KEY, []); }
function isSaved(id) { return getSavedEvents().indexOf(id) !== -1; }
function toggleSaved(id) {
  const saved = getSavedEvents();
  const i = saved.indexOf(id);
  if (i === -1) { saved.push(id); } else { saved.splice(i, 1); }
  STORE.write(SAVED_KEY, saved);
  updateSavedCount();
  return i === -1;
}
function updateSavedCount() {
  const count = getSavedEvents().length;
  document.querySelectorAll("[data-saved-count]").forEach(function (el) {
    el.textContent = count;
    el.closest("[data-saved-wrap]")?.classList.toggle("hidden", count === 0);
  });
}

/* ---------- toast ---------- */
let toastTimer;
function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  requestAnimationFrame(function () { toast.classList.add("is-visible"); });
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { toast.classList.remove("is-visible"); }, 2600);
}

/* ---------- reusable renderers ---------- */
function eventCardHTML(event) {
  const dp = dateParts(event.date);
  const saved = isSaved(event.id);
  const soldOut = event.seatsLeft === 0;
  return (
    '<article class="card event-card reveal">' +
      '<div class="event-card__media">' +
        '<img src="' + event.image + '" alt="' + escapeHtml(event.title) + '" loading="lazy" width="1024" height="640">' +
        '<div class="event-card__date"><strong>' + dp.day + "</strong><span>" + dp.month + "</span></div>" +
        '<span class="tag tag--cyan event-card__cat">' + categoryName(event.category) + "</span>" +
        '<button class="event-card__save' + (saved ? " is-saved" : "") + '" type="button" data-save="' + event.id +
          '" aria-label="Save ' + escapeHtml(event.title) + '" title="Save this event">★</button>' +
      "</div>" +
      '<div class="event-card__body">' +
        "<h3><a href=\"event-details.html?id=" + event.id + '">' + escapeHtml(event.title) + "</a></h3>" +
        '<div class="meta-list">' +
          "<span>📅 " + dateRange(event) + " · " + event.time + "</span>" +
          "<span>📍 " + escapeHtml(event.venue) + ", " + escapeHtml(event.city) + "</span>" +
          "<span>" + (soldOut ? "🚫 Sold out" : "🎟️ " + event.seatsLeft + " seats left") + "</span>" +
        "</div>" +
        '<p class="muted" style="font-size:.88rem">' + escapeHtml(event.summary) + "</p>" +
        '<div class="event-card__foot">' +
          '<div class="price">' + formatPrice(event.price) + (event.price ? " <small>onwards</small>" : "") + "</div>" +
          '<a class="btn btn--primary btn--sm" href="event-details.html?id=' + event.id + '">View Details</a>' +
        "</div>" +
      "</div>" +
    "</article>"
  );
}

function speakerCardHTML(speaker) {
  return (
    '<article class="card speaker-card reveal" data-speaker="' + speaker.id + '" tabindex="0" role="button" aria-label="View profile of ' + escapeHtml(speaker.name) + '">' +
      '<div class="speaker-card__media"><img src="' + speaker.photo + '" alt="' + escapeHtml(speaker.name) + '" loading="lazy" width="700" height="700"></div>' +
      '<div class="speaker-card__body">' +
        "<h3>" + escapeHtml(speaker.name) + "</h3>" +
        '<p class="speaker-card__role">' + escapeHtml(speaker.role) + "</p>" +
        '<p class="speaker-card__company">' + escapeHtml(speaker.company) + "</p>" +
        '<p class="mt-1"><span class="tag">' + escapeHtml(speaker.track) + "</span></p>" +
      "</div>" +
    "</article>"
  );
}

/* ---------- speaker modal (shared by home + speakers page) ---------- */
function ensureSpeakerModal() {
  let modal = document.getElementById("speakerModal");
  if (modal) return modal;
  modal = document.createElement("div");
  modal.className = "modal";
  modal.id = "speakerModal";
  modal.innerHTML =
    '<div class="modal__box" role="dialog" aria-modal="true" aria-labelledby="speakerModalName">' +
      '<button class="modal__close" type="button" aria-label="Close profile">✕</button>' +
      '<div class="modal__body"></div>' +
    "</div>";
  document.body.appendChild(modal);
  modal.addEventListener("click", function (e) {
    if (e.target === modal || e.target.classList.contains("modal__close")) closeSpeakerModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeSpeakerModal();
  });
  return modal;
}

function openSpeakerModal(id) {
  const sp = getSpeaker(id);
  if (!sp) return;
  const modal = ensureSpeakerModal();
  const sessions = EVENTS.filter(function (e) { return e.speakers.indexOf(sp.id) !== -1; });
  modal.querySelector(".modal__body").innerHTML =
    '<div class="modal__head">' +
      '<img src="' + sp.photo + '" alt="' + escapeHtml(sp.name) + '">' +
      "<div>" +
        '<h2 id="speakerModalName" style="font-size:1.8rem">' + escapeHtml(sp.name) + "</h2>" +
        '<p class="speaker-card__role">' + escapeHtml(sp.role) + " · " + escapeHtml(sp.company) + "</p>" +
        '<p class="mt-1"><span class="tag">' + escapeHtml(sp.track) + "</span></p>" +
      "</div>" +
    "</div>" +
    '<p class="muted mt-2">' + escapeHtml(sp.bio) + "</p>" +
    '<p class="mt-2"><strong class="accent">Featured talk:</strong> ' + escapeHtml(sp.talk) + "</p>" +
    (sessions.length
      ? '<div class="mt-2"><h3 style="font-size:1.05rem">Speaking at</h3><ul class="meta-list mt-1">' +
        sessions.map(function (e) {
          return '<li><a href="event-details.html?id=' + e.id + '" class="accent">🎤 ' + escapeHtml(e.title) + "</a> — " + dateRange(e) + "</li>";
        }).join("") + "</ul></div>"
      : "") +
    '<div class="socials mt-2">' +
      '<a href="' + sp.social.twitter + '" target="_blank" rel="noopener" aria-label="Twitter profile">TW</a>' +
      '<a href="' + sp.social.linkedin + '" target="_blank" rel="noopener" aria-label="LinkedIn profile">IN</a>' +
      '<a href="' + sp.social.github + '" target="_blank" rel="noopener" aria-label="GitHub profile">GH</a>' +
    "</div>";
  modal.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function closeSpeakerModal() {
  const modal = document.getElementById("speakerModal");
  if (!modal) return;
  modal.classList.remove("is-open");
  document.body.style.overflow = "";
}

/* ---------- global delegated interactions ---------- */
document.addEventListener("click", function (e) {
  const saveBtn = e.target.closest("[data-save]");
  if (saveBtn) {
    e.preventDefault();
    const added = toggleSaved(saveBtn.getAttribute("data-save"));
    saveBtn.classList.toggle("is-saved", added);
    showToast(added ? "Event saved to your list" : "Removed from your list");
    return;
  }
  const speakerCard = e.target.closest("[data-speaker]");
  if (speakerCard) openSpeakerModal(speakerCard.getAttribute("data-speaker"));
});

document.addEventListener("keydown", function (e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const card = e.target.closest && e.target.closest("[data-speaker]");
  if (card) { e.preventDefault(); openSpeakerModal(card.getAttribute("data-speaker")); }
});

/* ---------- scroll reveal ---------- */
let revealObserver;
function observeReveals() {
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
  }
  document.querySelectorAll(".reveal:not(.is-visible)").forEach(function (el) { revealObserver.observe(el); });
}

/* ---------- navigation ---------- */
function initNav() {
  const toggle = document.querySelector(".nav__toggle");
  const links = document.querySelector(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      const open = links.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const header = document.querySelector(".site-header");
  if (header) {
    window.addEventListener("scroll", function () {
      header.classList.toggle("is-scrolled", window.scrollY > 20);
    }, { passive: true });
  }

  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav__links a").forEach(function (a) {
    const href = a.getAttribute("href");
    if (href === page || (page === "" && href === "index.html")) a.classList.add("is-active");
    if (page === "event-details.html" && href === "events.html") a.classList.add("is-active");
  });
}

/* ---------- animated counters ---------- */
function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;
  const run = function (el) {
    const target = parseFloat(el.getAttribute("data-count"));
    const suffix = el.getAttribute("data-suffix") || "";
    let current = 0;
    const step = target / 45;
    const tick = function () {
      current += step;
      if (current >= target) { el.textContent = target + suffix; return; }
      el.textContent = Math.floor(current) + suffix;
      requestAnimationFrame(tick);
    };
    tick();
  };
  if (!("IntersectionObserver" in window)) { counters.forEach(run); return; }
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) { run(entry.target); io.unobserve(entry.target); }
    });
  }, { threshold: 0.4 });
  counters.forEach(function (el) { io.observe(el); });
}

/* ---------- newsletter (footer / home) ---------- */
function initNewsletter() {
  document.querySelectorAll("[data-newsletter]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const input = form.querySelector("input[type=email]");
      const valid = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(input.value.trim());
      input.classList.toggle("is-invalid", !valid);
      if (!valid) { showToast("Please enter a valid email address"); return; }
      STORE.write("summit.newsletter", input.value.trim());
      form.reset();
      showToast("You're on the list. See you at the next one!");
    });
  });
}

/* ---------- boot ---------- */
document.addEventListener("DOMContentLoaded", function () {
  initNav();
  observeReveals();
  initCounters();
  initNewsletter();
  updateSavedCount();
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
});
