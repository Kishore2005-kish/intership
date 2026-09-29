/* ===== Package details: dynamic content, gallery, lightbox, recently viewed ===== */
document.addEventListener("DOMContentLoaded", function () {
  const id = getParam("id");
  const pkg = PACKAGES.filter(function (p) { return p.id === id; })[0];
  const root = qs("#detailRoot");

  if (!pkg) {
    qs("#title").textContent = "Package not found";
    qs("#subtitle").textContent = "That trip may have been renamed or retired.";
    root.innerHTML =
      '<div class="empty"><h3>We couldn\'t find that package</h3>' +
      '<p class="muted" style="margin-top:8px">Browse the full collection instead.</p>' +
      '<a class="btn btn-primary" style="margin-top:16px" href="packages.html">All packages</a></div>';
    return;
  }

  document.title = pkg.title + " — Wayfare Travel";
  qs("#crumb").textContent = pkg.title;
  qs("#title").textContent = pkg.title;
  qs("#subtitle").textContent = pkg.location + " · " + pkg.days + " days / " + pkg.nights + " nights";

  /* Track recently viewed in localStorage */
  const viewed = Store.read("recentlyViewed", []).filter(function (v) { return v !== pkg.id; });
  viewed.unshift(pkg.id);
  Store.write("recentlyViewed", viewed.slice(0, 5));

  const related = PACKAGES.filter(function (p) {
    return p.category === pkg.category && p.id !== pkg.id;
  }).slice(0, 3);

  root.innerHTML =
    '<div class="detail-hero">' +
      '<div class="main-img"><img id="mainImg" src="' + pkg.gallery[0] + '" alt="' + pkg.title + '"></div>' +
      '<div class="thumbs" id="thumbs">' +
        pkg.gallery.slice(1, 4).map(function (src, i) {
          return '<img src="' + src + '" alt="' + pkg.title + " photo " + (i + 2) + '" data-src="' + src + '" loading="lazy">';
        }).join("") +
      "</div>" +
    "</div>" +

    '<div class="detail-layout">' +
      "<div>" +
        '<div class="panel">' +
          '<span class="tag">' + pkg.category + "</span>" +
          '<h2 style="margin:12px 0 10px">Overview</h2>' +
          "<p>" + pkg.summary + "</p>" +
          '<div class="meta" style="margin-top:16px">' +
            "<span>★ " + pkg.rating + " (" + pkg.reviews + " reviews)</span>" +
            "<span>" + pkg.days + "D / " + pkg.nights + "N</span>" +
            "<span>" + pkg.groupSize + "</span>" +
            "<span>" + pkg.location + "</span>" +
          "</div>" +
        "</div>" +

        '<div class="panel"><h2 style="margin-bottom:18px">Day-by-day itinerary</h2>' +
          pkg.itinerary.map(function (it) {
            return '<div class="itinerary-item"><h4>' + it.day + " · " + it.title + "</h4>" +
              '<p class="muted" style="font-size:.93rem">' + it.text + "</p></div>";
          }).join("") +
        "</div>" +

        '<div class="panel"><h2 style="margin-bottom:16px">What\'s included</h2>' +
          '<div class="grid grid-2">' +
            '<ul class="check-list">' + pkg.includes.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul>" +
            '<ul class="check-list x-list">' + pkg.excludes.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul>" +
          "</div>" +
        "</div>" +

        '<div class="panel"><h2 style="margin-bottom:16px">Gallery</h2>' +
          '<div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px" id="gallery">' +
            pkg.gallery.map(function (src, i) {
              return '<img src="' + src + '" alt="' + pkg.title + " gallery " + (i + 1) +
                '" data-src="' + src + '" loading="lazy" style="aspect-ratio:1;object-fit:cover;border-radius:12px;cursor:zoom-in">';
            }).join("") +
          "</div></div>" +
      "</div>" +

      '<aside><div class="summary-box">' +
        '<div class="muted" style="font-size:.85rem">From</div>' +
        '<div><span class="price" style="font-size:1.9rem">' + money(pkg.price) + "</span> " +
          '<s class="muted" style="font-size:.9rem">' + money(pkg.oldPrice) + "</s>" +
          '<div class="muted" style="font-size:.85rem">per person, twin sharing</div></div>' +
        '<div class="line"><span>Duration</span><strong>' + pkg.days + " days</strong></div>" +
        '<div class="line"><span>Group size</span><strong>' + pkg.groupSize + "</strong></div>" +
        '<div class="line"><span>Deposit today</span><strong>' + money(Math.round(pkg.price * 0.2)) + "</strong></div>" +
        '<div class="line total"><span>You save</span><span>' + money(pkg.oldPrice - pkg.price) + "</span></div>" +
        '<a class="btn btn-primary btn-block" href="booking.html?package=' + pkg.id + '">Book Now</a>' +
        '<a class="btn btn-ghost btn-block" href="contact.html">Ask a question</a>' +
        '<button class="btn btn-ghost btn-block" type="button" id="saveBtn">Save to wishlist</button>' +
      "</div></aside>" +
    "</div>" +

    (related.length
      ? '<div style="margin-top:56px"><h2 style="margin-bottom:22px">Similar ' + pkg.category + " trips</h2>" +
        '<div class="grid grid-3">' + related.map(packageCard).join("") + "</div></div>"
      : "");

  /* Thumbnail swap */
  const mainImg = qs("#mainImg");
  const galleryFrame = mainImg.parentElement;
  let swapping = false;
  qs("#thumbs").addEventListener("click", function (e) {
    if (e.target.tagName !== "IMG" || swapping) return;
    const next = e.target.dataset.src;
    if (!next || next === mainImg.src) return;
    swapping = true;
    const thumb = e.target;
    const previous = mainImg.src;
    const incoming = new Image();
    incoming.className = "gallery-incoming";
    incoming.alt = "";
    incoming.setAttribute("aria-hidden", "true");

    function finish() {
      mainImg.src = next;
      thumb.dataset.src = previous;
      thumb.src = previous;
      incoming.remove();
      swapping = false;
    }

    incoming.onload = function () {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        finish();
        return;
      }
      galleryFrame.appendChild(incoming);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { incoming.classList.add("is-visible"); });
      });
      incoming.addEventListener("transitionend", finish, { once: true });
    };
    incoming.onerror = function () { swapping = false; };
    incoming.src = next;
  });

  /* Lightbox */
  const lightbox = qs("#lightbox");
  const lightboxImg = qs("#lightboxImg");
  function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add("open");
  }
  function closeLightbox() {
    lightbox.classList.remove("open");
  }
  qs("#gallery").addEventListener("click", function (e) {
    if (e.target.tagName === "IMG") openLightbox(e.target.dataset.src);
  });
  mainImg.addEventListener("click", function () { openLightbox(mainImg.src); });
  qs("#lightboxClose").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeLightbox(); });

  /* Wishlist in localStorage */
  const saveBtn = qs("#saveBtn");
  function refreshSaveBtn() {
    const saved = Store.read("wishlist", []);
    saveBtn.textContent = saved.indexOf(pkg.id) > -1 ? "★ Saved to wishlist" : "Save to wishlist";
  }
  saveBtn.addEventListener("click", function () {
    let saved = Store.read("wishlist", []);
    if (saved.indexOf(pkg.id) > -1) {
      saved = saved.filter(function (s) { return s !== pkg.id; });
      toast("Removed from your wishlist.");
    } else {
      saved.push(pkg.id);
      toast("Saved to your wishlist.");
    }
    Store.write("wishlist", saved);
    refreshSaveBtn();
  });
  refreshSaveBtn();
});
