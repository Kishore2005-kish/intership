/* Renders the shared header and footer for inner pages. */
(function () {
  const here = location.pathname.split("/").pop() || "index.html";

  const header = `
  <div class="wrap header-inner">
    <a class="brand" href="index.html">
      <span class="brand-mark" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="3" width="14" height="13" rx="3"/><path d="M5 10h14M8 20l-2 2M16 20l2 2"/><circle cx="9" cy="13.5" r="1"/><circle cx="15" cy="13.5" r="1"/></svg>
      </span>
      <span class="brand-text"><strong>Indian Railways</strong><span>e-Ticketing · redesign prototype</span></span>
    </a>
    <button class="btn btn-secondary nav-toggle" data-nav-toggle aria-expanded="false" aria-controls="primary-nav">Menu</button>
    <nav class="nav" id="primary-nav" data-nav aria-label="Primary">
      <a href="index.html" data-page="index.html">Book</a>
      <a href="trips.html" data-page="trips.html">My Trips</a>
      <span class="has-menu">
        <button class="navlink" data-menu-button aria-expanded="false" aria-controls="services-menu">Services ▾</button>
        <div class="menu-panel" id="services-menu" data-open="false">
          <a href="pnr.html">PNR Status<small>Check your booking status</small></a>
          <a href="live.html">Live Train Status<small>Track a running train</small></a>
          <a href="schedule.html">Train Schedule<small>Timings and route</small></a>
          <a href="trips.html">Cancel Ticket<small>Manage eligible cancellations</small></a>
          <a href="trips.html">Refund Status<small>Track refunds</small></a>
          <a href="services.html">Food on Track<small>Order meals to your seat</small></a>
          <a href="services.html">Hotels &amp; Retiring Rooms<small>Stay near the station</small></a>
          <a href="services.html">Tourism<small>Rail tour packages</small></a>
          <a href="services.html">Station Information<small>Facilities and platforms</small></a>
        </div>
      </span>
      <a href="help.html" data-page="help.html">Help</a>
      <span class="mobile-auth">
        <a class="btn btn-secondary btn-sm" href="help.html">Login</a>
        <a class="btn btn-primary btn-sm" href="help.html">Register</a>
      </span>
    </nav>
    <div class="header-actions">
      <a class="btn btn-quiet" href="help.html">Login</a>
      <a class="btn btn-secondary" href="help.html">Register</a>
    </div>
  </div>`;

  const footer = `
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <h3>Indian Railways e-Ticketing</h3>
        <p>A passenger-first redesign concept for the railway booking experience. Built as an internship UI/UX project.</p>
        <p style="margin-top:10px"><a href="case-study.html">Read the UX case study →</a></p>
      </div>
      <div><h3>Book</h3><ul><li><a href="index.html">Search trains</a></li><li><a href="trips.html">My trips</a></li><li><a href="schedule.html">Train schedule</a></li></ul></div>
      <div><h3>Services</h3><ul><li><a href="pnr.html">PNR status</a></li><li><a href="live.html">Live train status</a></li><li><a href="services.html">Food, hotels, tourism</a></li></ul></div>
      <div><h3>Support</h3><ul><li><a href="help.html">Help centre</a></li><li><a href="help.html">Accessibility</a></li><li><a href="case-study.html">About this prototype</a></li></ul></div>
    </div>
    <div class="footer-bottom">Prototype only — not affiliated with IRCTC or the Ministry of Railways. Demo data throughout.</div>
  </div>`;

  const h = document.querySelector("[data-site-header]");
  if (h) { h.className = "site-header"; h.innerHTML = header; }
  const f = document.querySelector("[data-site-footer]");
  if (f) { f.className = "site-footer"; f.innerHTML = footer; }

  const link = document.querySelector(`.nav a[data-page="${here}"]`);
  if (link) link.setAttribute("aria-current", "page");

  initHeader();
})();
