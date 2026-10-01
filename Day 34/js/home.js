/* ============ Home page ============ */

function renderUpcoming() {
  const wrap = document.getElementById("upcomingGrid");
  if (!wrap) return;
  const list = EVENTS.slice().sort(function (a, b) { return a.date.localeCompare(b.date); }).slice(0, 3);
  wrap.innerHTML = list.map(eventCardHTML).join("");
}

function renderFeatured() {
  const wrap = document.getElementById("featuredWrap");
  if (!wrap) return;
  const list = EVENTS.filter(function (e) { return e.featured; });
  wrap.innerHTML = list.map(function (e) {
    return (
      '<div class="featured reveal">' +
        '<div class="featured__media"><img src="' + e.image + '" alt="' + escapeHtml(e.title) + '" loading="lazy" width="1024" height="640"></div>' +
        '<div class="featured__body">' +
          '<span class="tag">' + categoryName(e.category) + "</span>" +
          "<h3 style=\"font-size:2rem\">" + escapeHtml(e.title) + "</h3>" +
          '<p class="muted">' + escapeHtml(e.description.slice(0, 210)) + "…</p>" +
          '<div class="meta-list">' +
            "<span>📅 " + dateRange(e) + "</span>" +
            "<span>📍 " + escapeHtml(e.venue) + "</span>" +
            "<span>🎟️ From " + formatPrice(e.price) + "</span>" +
          "</div>" +
          '<div class="flex gap-sm wrap mt-2">' +
            '<a class="btn btn--primary" href="event-details.html?id=' + e.id + '">View Details</a>' +
            '<a class="btn btn--ghost" href="registration.html?event=' + e.id + '">Register</a>' +
          "</div>" +
        "</div>" +
      "</div>"
    );
  }).join('<div style="height:24px"></div>');
}

function renderCategories() {
  const wrap = document.getElementById("categoryGrid");
  if (!wrap) return;
  wrap.innerHTML = CATEGORIES.map(function (c) {
    const count = EVENTS.filter(function (e) { return e.category === c.id; }).length;
    return (
      '<a class="cat-tile reveal" href="events.html?category=' + c.id + '">' +
        '<div class="cat-tile__icon">' + c.icon + "</div>" +
        "<h3>" + c.name + "</h3>" +
        "<p>" + c.blurb + "</p>" +
        '<p class="mt-1 accent" style="font-size:.8rem;letter-spacing:.14em;text-transform:uppercase">' + count + " events →</p>" +
      "</a>"
    );
  }).join("");
}

function renderHomeSpeakers() {
  const wrap = document.getElementById("speakerStrip");
  if (!wrap) return;
  wrap.innerHTML = SPEAKERS.slice(0, 4).map(speakerCardHTML).join("");
}

function renderTestimonials() {
  const wrap = document.getElementById("testimonialGrid");
  if (!wrap) return;
  wrap.innerHTML = TESTIMONIALS.map(function (t) {
    return (
      '<figure class="quote reveal">' +
        '<div class="stars">★★★★★</div>' +
        "<p class=\"mt-1\">“" + escapeHtml(t.quote) + "”</p>" +
        '<figcaption class="quote__who">' +
          '<img src="' + t.photo + '" alt="' + escapeHtml(t.name) + '" loading="lazy" width="92" height="92">' +
          "<div><strong>" + escapeHtml(t.name) + "</strong><span>" + escapeHtml(t.role) + "</span></div>" +
        "</figcaption>" +
      "</figure>"
    );
  }).join("");
}

function initCountdown() {
  const box = document.getElementById("countdown");
  if (!box) return;
  const next = EVENTS.slice().sort(function (a, b) { return a.date.localeCompare(b.date); })[0];
  const label = document.getElementById("countdownLabel");
  if (label) label.textContent = next.title + " · " + dateRange(next);
  const target = new Date(next.date + "T09:00:00").getTime();

  const tick = function () {
    const diff = target - Date.now();
    const clamp = Math.max(diff, 0);
    const days = Math.floor(clamp / 86400000);
    const hours = Math.floor((clamp % 86400000) / 3600000);
    const mins = Math.floor((clamp % 3600000) / 60000);
    const secs = Math.floor((clamp % 60000) / 1000);
    const values = [days, hours, mins, secs];
    box.querySelectorAll("strong").forEach(function (el, i) {
      el.textContent = String(values[i]).padStart(2, "0");
    });
  };
  tick();
  setInterval(tick, 1000);
}

document.addEventListener("DOMContentLoaded", function () {
  renderUpcoming();
  renderFeatured();
  renderCategories();
  renderHomeSpeakers();
  renderTestimonials();
  initCountdown();
  observeReveals();
});
