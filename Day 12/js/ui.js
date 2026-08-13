/* Shared UI: header, footer, menu, toast, reveal, product cards, carousels, FAQ */
(function () {
  var NAV = [
    { href: "index.html", label: "Home" },
    { href: "products.html", label: "Shop" },
    { href: "our-story.html", label: "Our Story" },
    { href: "journal.html", label: "Journal" },
    { href: "contact.html", label: "Contact" },
  ];

  function here(href) {
    var path = location.pathname.split("/").pop() || "index.html";
    return path === href;
  }

  function headerHTML() {
    return (
      '<header class="site-header"><div class="wrap nav">' +
      '<a class="brand" href="index.html">Vanveda<span>.</span></a>' +
      '<nav aria-label="Main"><ul class="nav-links">' +
      NAV
        .map(function (n) {
          return '<li><a class="' + (here(n.href) ? "active" : "") + '" href="' + n.href + '">' + n.label + "</a></li>";
        })
        .join("") +
      "</ul></nav>" +
      '<div class="nav-actions">' +
      '<a class="icon-btn" href="products.html" aria-label="Search products"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><path d="M16.5 16.5 21 21"/></svg></a>' +
      '<a class="icon-btn" href="cart.html" aria-label="Cart"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg><span class="cart-count" data-cart-count>0</span></a>' +
      '<button class="icon-btn menu-btn" data-menu-open aria-label="Open menu"><svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>' +
      "</div></div></header>" +
      '<div class="overlay" data-overlay></div>' +
      '<aside class="drawer" data-drawer aria-label="Menu"><div class="drawer-top">' +
      '<span class="brand">Vanveda<span>.</span></span>' +
      '<button class="icon-btn" data-menu-close aria-label="Close menu" style="border-color:rgba(246,242,233,.4)">✕</button>' +
      "</div><ul>" +
      NAV.concat([{ href: "cart.html", label: "Cart" }, { href: "checkout.html", label: "Checkout" }])
        .map(function (n) {
          return '<li><a href="' + n.href + '">' + n.label + "</a></li>";
        })
        .join("") +
      '</ul><p class="muted" style="margin-top:auto;font-size:.8rem;color:rgba(246,242,233,.6)">Made in India · Free shipping over ₹999</p></aside>'
    );
  }

  function footerHTML() {
    return (
      '<footer class="site-footer"><div class="wrap">' +
      '<div class="footer-grid">' +
      '<div><span class="brand">Vanveda<span>.</span></span>' +
      '<p class="muted" style="color:rgba(246,242,233,.7);max-width:32ch;margin-top:.8rem">Ayurvedic skincare and colour, formulated in Bengaluru and made with farm-traced Indian botanicals.</p></div>' +
      '<div><h4>Shop</h4><ul>' +
      '<li><a href="products.html">All products</a></li><li><a href="products.html">Skincare</a></li>' +
      '<li><a href="products.html">Makeup</a></li><li><a href="products.html">Gift sets</a></li></ul></div>' +
      '<div><h4>Company</h4><ul>' +
      '<li><a href="our-story.html">Our story</a></li><li><a href="journal.html">Journal</a></li>' +
      '<li><a href="contact.html">Contact</a></li><li><a href="cart.html">Your cart</a></li></ul></div>' +
      '<div><h4>Join the ritual</h4><p class="muted" style="color:rgba(246,242,233,.7)">Skin notes and early access, twice a month.</p>' +
      '<form class="news-form" data-newsletter novalidate><input type="email" placeholder="you@email.com" aria-label="Email address" required>' +
      '<button class="btn btn-light" type="submit">Subscribe</button></form></div>' +
      "</div>" +
      '<div class="footer-bottom"><span>© 2026 Vanveda Naturals Pvt. Ltd. · GSTIN 29ABCDE1234F1Z5</span>' +
      "<span>Bengaluru, Karnataka · hello@vanveda.in · +91 80 4567 8900</span></div>" +
      "</div></footer>"
    );
  }

  function toast(msg) {
    var el = document.querySelector(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    requestAnimationFrame(function () {
      el.classList.add("show");
    });
    clearTimeout(el._t);
    el._t = setTimeout(function () {
      el.classList.remove("show");
    }, 2400);
  }

  function syncCount() {
    var n = window.Cart ? window.Cart.count() : 0;
    document.querySelectorAll("[data-cart-count]").forEach(function (el) {
      el.textContent = n;
      el.style.display = n ? "grid" : "none";
    });
  }

  function productCard(p) {
    var price =
      '<div class="price">' +
      window.formatINR(p.price) +
      (p.mrp ? '<span class="strike">' + window.formatINR(p.mrp) + "</span>" : "") +
      "</div>";
    return (
      '<article class="card reveal">' +
      '<a class="card-media" href="product.html?id=' +
      p.id +
      '" aria-label="' +
      p.name +
      '">' +
      '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy">' +
      (p.tag ? '<span class="tag">' + p.tag + "</span>" : "") +
      "</a>" +
      '<div class="card-body"><div>' +
      '<span class="card-cat">' + p.category + " · " + p.size + "</span>" +
      '<h3 class="card-title"><a href="product.html?id=' + p.id + '">' + p.name + "</a></h3>" +
      "</div>" + price + "</div>" +
      '<button class="add" data-add="' + p.id + '">Add to bag</button>' +
      "</article>"
    );
  }

  function articleCard(a, dark) {
    return (
      '<article class="card reveal">' +
      '<div class="article-media"><img src="' + a.img + '" alt="' + a.title + '" loading="lazy"></div>' +
      '<h3 style="margin-top:1rem;font-size:1.15rem">' + a.title + "</h3>" +
      '<p style="color:' + (dark ? "rgba(246,242,233,.72)" : "var(--muted)") + ';font-size:.92rem">' + a.excerpt + "</p>" +
      '<div class="article-meta"><span>' + a.date + "</span><span>" + a.read + " read</span></div>" +
      "</article>"
    );
  }

  function initReveal() {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    document.querySelectorAll(".reveal:not(.in)").forEach(function (el) {
      io.observe(el);
    });
  }

  function initMenu() {
    var drawer = document.querySelector("[data-drawer]");
    var overlay = document.querySelector("[data-overlay]");
    function set(open) {
      if (!drawer) return;
      drawer.classList.toggle("open", open);
      overlay.classList.toggle("open", open);
      document.body.style.overflow = open ? "hidden" : "";
    }
    document.querySelectorAll("[data-menu-open]").forEach(function (b) {
      b.addEventListener("click", function () { set(true); });
    });
    document.querySelectorAll("[data-menu-close]").forEach(function (b) {
      b.addEventListener("click", function () { set(false); });
    });
    if (overlay) overlay.addEventListener("click", function () { set(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") set(false);
    });
  }

  function initFaq() {
    document.querySelectorAll(".faq-q").forEach(function (q) {
      q.addEventListener("click", function () {
        q.parentElement.classList.toggle("open");
      });
    });
  }

  function initRails() {
    document.querySelectorAll("[data-rail]").forEach(function (rail) {
      var group = rail.closest("section") || document;
      var prev = group.querySelector("[data-rail-prev]");
      var next = group.querySelector("[data-rail-next]");
      function step(dir) {
        rail.scrollBy({ left: dir * Math.max(260, rail.clientWidth * 0.6), behavior: "smooth" });
      }
      if (prev) prev.addEventListener("click", function () { step(-1); });
      if (next) next.addEventListener("click", function () { step(1); });
    });
  }

  function initAddButtons() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-add]");
      if (!btn) return;
      e.preventDefault();
      window.Cart.add(btn.getAttribute("data-add"), Number(btn.getAttribute("data-qty") || 1));
    });
  }

  function initNewsletter() {
    document.querySelectorAll("[data-newsletter]").forEach(function (f) {
      f.addEventListener("submit", function (e) {
        e.preventDefault();
        var input = f.querySelector("input");
        if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(input.value.trim())) {
          toast("Please enter a valid email address");
          return;
        }
        input.value = "";
        toast("You're on the list — welcome to Vanveda");
      });
    });
  }

  function mount() {
    var h = document.querySelector("[data-header]");
    if (h) h.innerHTML = headerHTML();
    var f = document.querySelector("[data-footer]");
    if (f) f.innerHTML = footerHTML();
    initMenu();
    initNewsletter();
    syncCount();
  }

  window.VanvedaUI = {
    toast: toast,
    productCard: productCard,
    articleCard: articleCard,
    initReveal: initReveal,
    initFaq: initFaq,
    initRails: initRails,
    syncCount: syncCount,
  };

  document.addEventListener("cart:change", syncCount);
  document.addEventListener("DOMContentLoaded", function () {
    mount();
    initAddButtons();
    initFaq();
    initRails();
    initReveal();
  });
})();
