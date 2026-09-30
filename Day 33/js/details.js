/* ============ Event details: dynamic content, tabs, gallery ============ */

let galleryImages = [];
let galleryIndex = 0;

function renderNotFound(root) {
  root.innerHTML =
    '<div class="container section"><div class="empty-state">' +
      "<h2>Event not found</h2>" +
      '<p class="mt-1">That event may have ended or the link is incorrect.</p>' +
      '<p class="mt-2"><a class="btn btn--primary" href="events.html">Browse all events</a></p>' +
    "</div></div>";
}

function renderDetails() {
  const root = document.getElementById("detailRoot");
  if (!root) return;
  const event = getEvent(getQueryParam("id") || "");
  if (!event) { renderNotFound(root); return; }

  document.title = event.title + " — Summit.io";
  const speakers = event.speakers.map(getSpeaker).filter(Boolean);
  galleryImages = event.gallery;

  root.innerHTML =
    '<section class="detail-hero">' +
      '<img src="' + event.image + '" alt="' + escapeHtml(event.title) + '" width="1024" height="640">' +
      '<div class="detail-hero__inner"><div class="container">' +
        '<span class="tag">' + categoryName(event.category) + "</span>" +
        "<h1 class=\"mt-1\">" + escapeHtml(event.title) + "</h1>" +
        '<p class="muted mt-1">📅 ' + dateRange(event) + " · " + event.time + " &nbsp; 📍 " + escapeHtml(event.venue) + ", " + escapeHtml(event.city) + "</p>" +
        '<p class="breadcrumb"><a href="index.html">Home</a> / <a href="events.html">Events</a> / ' + escapeHtml(event.title) + "</p>" +
      "</div></div>" +
    "</section>" +

    '<section class="section"><div class="container detail-layout">' +
      "<div>" +
        '<div class="panel">' +
          "<h2>Event Overview</h2>" +
          '<p class="muted mt-2">' + escapeHtml(event.description) + "</p>" +
          '<div class="grid grid-3 mt-3">' +
            '<div class="stat"><strong>' + event.schedule.reduce(function (n, d) { return n + d.items.length; }, 0) + "</strong><span>Sessions</span></div>" +
            '<div class="stat"><strong>' + speakers.length + "</strong><span>Speakers</span></div>" +
            '<div class="stat"><strong>' + (event.seatsLeft || 0) + "</strong><span>Seats left</span></div>" +
          "</div>" +
        "</div>" +

        '<div class="panel">' +
          "<h2>Schedule</h2>" +
          '<div class="tabs mt-2" id="scheduleTabs">' +
            event.schedule.map(function (d, i) {
              return '<button class="tab' + (i === 0 ? " is-active" : "") + '" type="button" data-tab="' + i + '">' + escapeHtml(d.day) + "</button>";
            }).join("") +
          "</div>" +
          event.schedule.map(function (d, i) {
            return '<div class="tab-panel' + (i === 0 ? " is-active" : "") + '" data-panel="' + i + '">' +
              d.items.map(function (it) {
                return '<div class="schedule-item">' +
                  '<div class="schedule-item__time">' + it.time + "</div>" +
                  "<div><h4>" + escapeHtml(it.title) + "</h4><p>" + escapeHtml(it.desc) +
                  (it.who ? ' <span class="accent">· ' + escapeHtml(it.who) + "</span>" : "") + "</p></div>" +
                "</div>";
              }).join("") +
            "</div>";
          }).join("") +
        "</div>" +

        '<div class="panel">' +
          "<h2>Speakers</h2>" +
          '<div class="grid grid-3 mt-2">' + speakers.map(speakerCardHTML).join("") + "</div>" +
        "</div>" +

        '<div class="panel">' +
          "<h2>Gallery</h2>" +
          '<div class="gallery mt-2" id="detailGallery">' +
            event.gallery.map(function (src, i) {
              return '<img src="' + src + '" alt="' + escapeHtml(event.title) + ' photo ' + (i + 1) + '" loading="lazy" data-index="' + i + '" width="1024" height="640">';
            }).join("") +
          "</div>" +
        "</div>" +
      "</div>" +

      '<aside class="sticky-side">' +
        '<div class="panel">' +
          "<h3>Event Info</h3>" +
          '<div class="mt-2">' +
            '<div class="info-row"><span>Date</span><span>' + dateRange(event) + "</span></div>" +
            '<div class="info-row"><span>Time</span><span>' + event.time + "</span></div>" +
            '<div class="info-row"><span>Venue</span><span>' + escapeHtml(event.venue) + "</span></div>" +
            '<div class="info-row"><span>City</span><span>' + escapeHtml(event.city) + "</span></div>" +
            '<div class="info-row"><span>Category</span><span>' + categoryName(event.category) + "</span></div>" +
          "</div>" +
          '<h3 class="mt-3">Ticket Pricing</h3>' +
          '<div class="mt-2">' +
            event.tickets.map(function (t, i) {
              return '<label class="ticket-option">' +
                '<input type="radio" name="ticketPick" value="' + t.type + '"' + (i === 0 ? " checked" : "") + ">" +
                "<span><strong>" + escapeHtml(t.name) + " — " + formatPrice(t.price) + "</strong><small>" + escapeHtml(t.perks) + "</small></span>" +
              "</label>";
            }).join("") +
          "</div>" +
          '<a class="btn btn--primary btn--block mt-2" id="registerCta" href="registration.html?event=' + event.id + '">Register Now</a>' +
          '<button class="btn btn--ghost btn--block mt-1" type="button" data-save="' + event.id + '">★ Save this event</button>' +
        "</div>" +
      "</aside>" +
    "</div></section>";

  /* tabs */
  const tabs = document.getElementById("scheduleTabs");
  tabs.addEventListener("click", function (e) {
    const btn = e.target.closest(".tab");
    if (!btn) return;
    const idx = btn.getAttribute("data-tab");
    tabs.querySelectorAll(".tab").forEach(function (t) { t.classList.remove("is-active"); });
    btn.classList.add("is-active");
    document.querySelectorAll(".tab-panel").forEach(function (p) {
      p.classList.toggle("is-active", p.getAttribute("data-panel") === idx);
    });
  });

  /* ticket selection carried to registration */
  root.querySelectorAll('input[name="ticketPick"]').forEach(function (input) {
    input.addEventListener("change", function () {
      document.getElementById("registerCta").href =
        "registration.html?event=" + event.id + "&ticket=" + input.value;
    });
  });

  /* gallery lightbox */
  document.getElementById("detailGallery").addEventListener("click", function (e) {
    const img = e.target.closest("img");
    if (!img) return;
    openLightbox(parseInt(img.getAttribute("data-index"), 10));
  });

  STORE.write("summit.lastViewedEvent", event.id);
  observeReveals();
}

/* ---------- lightbox ---------- */
function ensureLightbox() {
  let lb = document.getElementById("lightbox");
  if (lb) return lb;
  lb = document.createElement("div");
  lb.className = "lightbox";
  lb.id = "lightbox";
  lb.innerHTML =
    '<button class="lightbox__btn lightbox__close" type="button" aria-label="Close gallery">✕</button>' +
    '<button class="lightbox__btn lightbox__prev" type="button" aria-label="Previous image">‹</button>' +
    '<img src="" alt="Event gallery image">' +
    '<button class="lightbox__btn lightbox__next" type="button" aria-label="Next image">›</button>';
  document.body.appendChild(lb);
  lb.addEventListener("click", function (e) {
    if (e.target === lb || e.target.classList.contains("lightbox__close")) closeLightbox();
    if (e.target.classList.contains("lightbox__prev")) stepLightbox(-1);
    if (e.target.classList.contains("lightbox__next")) stepLightbox(1);
  });
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });
  return lb;
}

function openLightbox(index) {
  const lb = ensureLightbox();
  galleryIndex = index;
  lb.querySelector("img").src = galleryImages[galleryIndex];
  lb.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function stepLightbox(dir) {
  const lb = ensureLightbox();
  galleryIndex = (galleryIndex + dir + galleryImages.length) % galleryImages.length;
  lb.querySelector("img").src = galleryImages[galleryIndex];
}

function closeLightbox() {
  const lb = document.getElementById("lightbox");
  if (!lb) return;
  lb.classList.remove("is-open");
  document.body.style.overflow = "";
}

document.addEventListener("DOMContentLoaded", renderDetails);
