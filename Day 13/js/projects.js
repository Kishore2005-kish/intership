/* FORMA — project data + rendering + filtering */
(function () {
  "use strict";

  var projects = [
    { name: "Casa Norte", location: "Panjim, Goa", year: "2026", area: "3,200 sq ft", value: "\u20b9 2.4 Cr", category: "Residential", image: "images/project-01.jpg" },
    { name: "Ridgeline House", location: "Kasauli, Himachal Pradesh", year: "2025", area: "4,600 sq ft", value: "\u20b9 3.8 Cr", category: "Residential", image: "images/project-02.jpg" },
    { name: "Timber Works", location: "Whitefield, Bengaluru", year: "2025", area: "18,400 sq ft", value: "\u20b9 12.5 Cr", category: "Commercial", image: "images/project-03.jpg" },
    { name: "Brick & Glass", location: "Fort Kochi, Kerala", year: "2024", area: "2,150 sq ft", value: "\u20b9 85 Lakh", category: "Renovation", image: "images/project-04.jpg" },
    { name: "Linen Apartment", location: "Bandra West, Mumbai", year: "2026", area: "1,480 sq ft", value: "\u20b9 62 Lakh", category: "Interior", image: "images/project-05.jpg" },
    { name: "Field House", location: "Alibaug, Maharashtra", year: "2024", area: "5,100 sq ft", value: "\u20b9 4.6 Cr", category: "Residential", image: "images/architecture-02.jpg" },
    { name: "Atelier Nine", location: "Cyber City, Gurugram", year: "2025", area: "6,700 sq ft", value: "\u20b9 7.2 Cr", category: "Commercial", image: "images/project-03.jpg" },
    { name: "Quiet Rooms", location: "Jubilee Hills, Hyderabad", year: "2026", area: "1,900 sq ft", value: "\u20b9 74 Lakh", category: "Interior", image: "images/project-05.jpg" },
    { name: "Mill Street Revival", location: "Shahpur Jat, New Delhi", year: "2023", area: "3,050 sq ft", value: "\u20b9 1.1 Cr", category: "Renovation", image: "images/project-04.jpg" }
  ];

  window.FORMA = window.FORMA || {};
  window.FORMA.projects = projects;

  function cardMarkup(p) {
    return (
      '<a class="project-card reveal" href="project-detail.html">' +
      '<img src="' + p.image + '" alt="' + p.name + ', ' + p.category.toLowerCase() + ' project in ' + p.location + '" loading="lazy" width="1200" height="1400">' +
      '<div class="project-card__body">' +
      '<h3>' + p.name + '</h3>' +
      '<p class="project-card__meta">' + p.location + ' &middot; ' + p.year + ' &middot; ' + p.area + ' &middot; ' + p.value + ' &middot; ' + p.category + '</p>' +
      "</div></a>"
    );
  }

  function render(target, list) {
    target.innerHTML = list.map(cardMarkup).join("");
    if (window.FORMA.observeReveals) window.FORMA.observeReveals(target);
  }

  var featured = document.getElementById("featured-projects");
  if (featured) render(featured, projects.slice(0, 4));

  var grid = document.getElementById("project-grid");
  if (grid) {
    render(grid, projects);
    document.querySelectorAll(".filter").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll(".filter").forEach(function (b) {
          b.classList.remove("is-active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");
        var cat = btn.dataset.filter;
        render(grid, cat === "All" ? projects : projects.filter(function (p) { return p.category === cat; }));
      });
    });
  }
})();
