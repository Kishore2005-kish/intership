/* ============================================================
   rooms.js — room data, room cards, filtering, detail modal
   with image gallery (prev / next / thumbnails).

   All factual values come from the hotel's official website.
   Where a value is not published, "Contact hotel for details"
   is shown instead of an invented figure.
   ============================================================ */

var LM_IMG = "assets/images/";

var LM_ROOMS = [
  {
    id: "deluxe",
    name: "Deluxe Room",
    group: "rooms",
    tag: "Room",
    area: "Contact hotel for details",
    located: "Contact hotel for details",
    occupancy: "Contact hotel for details",
    tariff: null,
    blurb:
      "Palace accommodation with high ceilings, period furniture and the calm proportions of the 1931 building.",
    features: ["Period furniture", "Heritage interiors", "In-room dining available"],
    images: ["room-deluxe.jpg", "heritage-interior.jpg", "gardens.jpg"]
  },
  {
    id: "turret",
    name: "Turret Rooms",
    group: "rooms",
    tag: "Room",
    area: "Contact hotel for details",
    located: "Contact hotel for details",
    occupancy: "Contact hotel for details",
    tariff: null,
    blurb:
      "Rooms set within the palace turrets, with curved walls and windows that follow the architecture.",
    features: ["Curved turret walls", "Windows on multiple sides", "Heritage interiors"],
    images: ["room-turret.jpg", "detail-columns.jpg", "heritage-interior.jpg"]
  },
  {
    id: "heritage-suite",
    name: "Heritage Suite",
    group: "suites",
    tag: "Suite",
    area: "Contact hotel for details",
    located: "Contact hotel for details",
    occupancy: "Contact hotel for details",
    tariff: null,
    blurb:
      "A suite in the heritage character of the palace, with a separate sitting area and ornate interiors.",
    features: ["Separate sitting area", "Ornate interiors", "Period furniture"],
    images: ["room-heritage-suite.jpg", "heritage-interior.jpg", "room-deluxe.jpg"]
  },
  {
    id: "heritage-classic",
    name: "Heritage Classic Suite",
    group: "suites",
    tag: "Suite",
    area: "600 sq ft",
    located: "Main palace building",
    occupancy: "Contact hotel for details",
    tariff: null,
    blurb:
      "A 600 sq ft suite located in the main palace building, surrounded by the original marble and woodwork.",
    features: ["600 sq ft", "Main palace building", "Marble interiors"],
    images: ["room-heritage-suite.jpg", "detail-columns.jpg", "gardens.jpg"]
  },
  {
    id: "duplex",
    name: "Duplex Suite",
    group: "suites",
    tag: "Suite",
    area: "1000 sq ft",
    located: "Main palace building",
    occupancy: "Contact hotel for details",
    tariff: 30000,
    blurb:
      "A 1000 sq ft suite across two levels in the main palace building, connected by its own staircase.",
    features: ["1000 sq ft", "Two levels", "Main palace building"],
    images: ["room-duplex.jpg", "heritage-interior.jpg", "room-heritage-suite.jpg"]
  },
  {
    id: "viceroy",
    name: "Viceroy Suite",
    group: "suites",
    tag: "Signature suite",
    area: "2000 sq ft",
    located: "Main palace building",
    occupancy: "Contact hotel for details",
    tariff: 40000,
    blurb:
      "The largest suite in the palace at 2000 sq ft, in the main building where the palace received its most important guests.",
    features: ["2000 sq ft", "Main palace building", "Royal portraits and period furniture"],
    images: ["room-viceroy.jpg", "heritage-interior.jpg", "detail-columns.jpg"]
  }
];

window.LM_ROOMS = LM_ROOMS;

(function () {
  "use strict";

  function formatTariff(room) {
    if (room.tariff === null) {
      return '<p class="price"><span>Tariff</span>On request</p>';
    }
    return (
      '<p class="price"><span>From, per night</span>INR ' +
      room.tariff.toLocaleString("en-IN") +
      "</p>"
    );
  }

  function cardMarkup(room) {
    return (
      '<article class="card reveal" data-group="' +
      room.group +
      '">' +
      '<div class="card__media"><span class="card__tag">' +
      room.tag +
      "</span>" +
      '<img src="' +
      LM_IMG +
      room.images[0] +
      '" alt="' +
      room.name +
      ' at Lalitha Mahal Palace Hotel" loading="lazy" width="1400" height="1000"></div>' +
      '<div class="card__body">' +
      "<h3>" +
      room.name +
      "</h3>" +
      '<p class="card__meta"><span>' +
      room.area +
      "</span><span>" +
      room.located +
      "</span></p>" +
      '<p class="card__text">' +
      room.blurb +
      "</p>" +
      '<div class="card__foot">' +
      formatTariff(room) +
      '<div class="card__actions">' +
      '<button class="btn btn--outline btn--sm" type="button" data-room="' +
      room.id +
      '">View room</button>' +
      '<a class="btn btn--primary btn--sm" href="booking.html?room=' +
      room.id +
      '">Book</a>' +
      "</div></div></div></article>"
    );
  }

  /* ---------- render grids ---------- */
  var featured = document.getElementById("featuredRooms");
  if (featured) {
    var picks = ["heritage-classic", "duplex", "viceroy", "turret"];
    featured.innerHTML = LM_ROOMS.filter(function (r) {
      return picks.indexOf(r.id) > -1;
    })
      .map(cardMarkup)
      .join("");
  }

  var grid = document.getElementById("roomGrid");
  if (grid) {
    grid.innerHTML = LM_ROOMS.map(cardMarkup).join("");
  }

  if (window.LM && window.LM.watchReveals) {
    window.LM.watchReveals(document);
  }

  /* ---------- filtering ---------- */
  var filterBar = document.getElementById("roomFilters");
  var resultCount = document.getElementById("roomCount");

  function applyFilter(value) {
    if (!grid) return;
    var shown = 0;
    Array.prototype.forEach.call(grid.children, function (card) {
      var match = value === "all" || card.getAttribute("data-group") === value;
      card.hidden = !match;
      if (match) shown++;
    });
    if (resultCount) {
      resultCount.textContent =
        shown + (shown === 1 ? " accommodation shown" : " accommodations shown");
    }
  }

  if (filterBar) {
    filterBar.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter-btn");
      if (!btn) return;
      filterBar.querySelectorAll(".filter-btn").forEach(function (b) {
        b.setAttribute("aria-pressed", String(b === btn));
      });
      applyFilter(btn.getAttribute("data-filter"));
    });
    applyFilter("all");
  }

  /* ---------- detail modal + gallery ---------- */
  var modal = document.getElementById("roomModal");
  if (!modal) return;

  var body = modal.querySelector("[data-room-body]");
  var galleryIndex = 0;
  var galleryImages = [];

  function paintGallery() {
    var stage = modal.querySelector("[data-stage]");
    var count = modal.querySelector("[data-count]");
    if (!stage) return;
    stage.src = LM_IMG + galleryImages[galleryIndex];
    stage.alt = "Palace photograph " + (galleryIndex + 1) + " of " + galleryImages.length;
    if (count) count.textContent = galleryIndex + 1 + " / " + galleryImages.length;
    modal.querySelectorAll("[data-thumb]").forEach(function (t, i) {
      t.setAttribute("aria-current", String(i === galleryIndex));
    });
  }

  function step(delta) {
    galleryIndex = (galleryIndex + delta + galleryImages.length) % galleryImages.length;
    paintGallery();
  }

  function detailMarkup(room) {
    return (
      '<div class="room-detail">' +
      '<div class="gallery">' +
      '<div class="gallery__stage">' +
      '<img data-stage src="" alt="">' +
      '<button class="gallery__nav gallery__nav--prev" type="button" data-prev aria-label="Previous photograph">&#8592;</button>' +
      '<button class="gallery__nav gallery__nav--next" type="button" data-next aria-label="Next photograph">&#8594;</button>' +
      '<p class="gallery__count" data-count></p>' +
      "</div>" +
      '<div class="gallery__thumbs" role="group" aria-label="Room photographs">' +
      room.images
        .map(function (src, i) {
          return (
            '<button type="button" data-thumb data-index="' +
            i +
            '" aria-label="Show photograph ' +
            (i + 1) +
            '"><img src="' +
            LM_IMG +
            src +
            '" alt="" loading="lazy"></button>'
          );
        })
        .join("") +
      "</div></div>" +
      "<div>" +
      '<p class="eyebrow">' +
      room.tag +
      "</p>" +
      "<h2 id=\"roomModalTitle\">" +
      room.name +
      "</h2>" +
      "<p>" +
      room.blurb +
      "</p>" +
      '<ul class="spec-list">' +
      "<li><span>Area</span><span>" +
      room.area +
      "</span></li>" +
      "<li><span>Location in palace</span><span>" +
      room.located +
      "</span></li>" +
      "<li><span>Occupancy</span><span>" +
      room.occupancy +
      "</span></li>" +
      "<li><span>Character</span><span>" +
      room.features.join(", ") +
      "</span></li>" +
      "<li><span>Indicative tariff</span><span>" +
      (room.tariff === null
        ? "Contact hotel for details"
        : "INR " + room.tariff.toLocaleString("en-IN") + " per night, taxes extra") +
      "</span></li>" +
      "</ul>" +
      '<p class="note">Indicative/demo tariff. Verify current rates during booking. Taxes are separate where stated.</p>' +
      '<div class="card__actions" style="margin-top:18px">' +
      '<a class="btn btn--primary" href="booking.html?room=' +
      room.id +
      '">Book this room</a>' +
      '<a class="btn btn--outline" href="tel:+918040554055">Call reservations</a>' +
      "</div></div></div>"
    );
  }

  function openRoom(id) {
    var room = LM_ROOMS.filter(function (r) {
      return r.id === id;
    })[0];
    if (!room || !body) return;
    body.innerHTML = detailMarkup(room);
    galleryImages = room.images;
    galleryIndex = 0;
    paintGallery();
    window.LM.openModal(modal);
  }

  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-room]");
    if (trigger) {
      e.preventDefault();
      openRoom(trigger.getAttribute("data-room"));
      return;
    }
    if (e.target.closest("[data-prev]")) step(-1);
    if (e.target.closest("[data-next]")) step(1);
    var thumb = e.target.closest("[data-thumb]");
    if (thumb) {
      galleryIndex = Number(thumb.getAttribute("data-index"));
      paintGallery();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (!modal.classList.contains("is-open") || !galleryImages.length) return;
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });
})();
