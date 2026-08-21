/* Lou Leisure — vanilla JS. Shared chrome, storage, rendering, interactions. */
(function () {
  "use strict";

  var PRODUCTS = window.PRODUCTS || [];
  var CART_KEY = "ll_cart";
  var WISH_KEY = "ll_wishlist";

  /* ---------- helpers ---------- */

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }
  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }
  function money(n) {
    return "₹" + Number(n).toLocaleString("en-IN");
  }
  function read(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch (e) {
      return [];
    }
  }
  function write(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {}
  }
  function byId(id) {
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (PRODUCTS[i].id === id) return PRODUCTS[i];
    }
    return null;
  }
  function param(name) {
    var m = new RegExp("[?&]" + name + "=([^&]*)").exec(window.location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : "";
  }

  /* ---------- toast ---------- */

  var toastEl;
  var toastTimer;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("is-on");
    }, 2200);
  }

  /* ---------- cart / wishlist ---------- */

  function cartCount() {
    return read(CART_KEY).reduce(function (a, l) {
      return a + l.qty;
    }, 0);
  }

  function addToCart(id, size, qty) {
    var cart = read(CART_KEY);
    var found = null;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === id && cart[i].size === size) found = cart[i];
    }
    if (found) found.qty += qty || 1;
    else cart.push({ id: id, size: size || "One size", qty: qty || 1 });
    write(CART_KEY, cart);
    syncBadges();
    toast("Added to bag");
  }

  function toggleWish(id) {
    var w = read(WISH_KEY);
    var i = w.indexOf(id);
    if (i > -1) w.splice(i, 1);
    else w.push(id);
    write(WISH_KEY, w);
    syncBadges();
    paintHearts();
    return i === -1;
  }

  function syncBadges() {
    $$("[data-cart-count]").forEach(function (el) {
      el.textContent = "(" + cartCount() + ")";
    });
    $$("[data-wish-count]").forEach(function (el) {
      el.textContent = "(" + read(WISH_KEY).length + ")";
    });
  }

  function paintHearts() {
    var w = read(WISH_KEY);
    $$(".heart[data-wish]").forEach(function (btn) {
      var on = w.indexOf(btn.getAttribute("data-wish")) > -1;
      btn.classList.toggle("is-on", on);
      btn.textContent = on ? "\u2665" : "\u2661";
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  /* ---------- chrome ---------- */

  var NAV = [
    { href: "collections.html", label: "Collections" },
    { href: "shop.html", label: "Shop" },
    { href: "stories.html", label: "Stories" },
    { href: "about.html", label: "About" }
  ];

  function currentPage() {
    var f = window.location.pathname.split("/").pop();
    return f || "index.html";
  }

  function buildHeader() {
    var host = $("[data-header]");
    if (!host) return;
    var page = currentPage();
    var links = NAV.map(function (n) {
      return (
        '<a href="' +
        n.href +
        '"' +
        (page === n.href ? ' class="is-active"' : "") +
        ">" +
        n.label +
        "</a>"
      );
    }).join("");

    host.outerHTML =
      '<header class="site-header' +
      (host.hasAttribute("data-header-light") ? " is-light" : "") +
      '" id="siteHeader">' +
      '<a class="brand" href="index.html">Lou Leisure</a>' +
      '<nav class="nav">' +
      links +
      "</nav>" +
      '<div class="header-actions">' +
      '<button type="button" data-search-open>Search</button>' +
      '<a class="hide-sm" href="shop.html">Wishlist <span data-wish-count class="count">(0)</span></a>' +
      '<a href="cart.html">Bag <span data-cart-count class="count">(0)</span></a>' +
      '<button class="burger" type="button" data-drawer-open aria-label="Open menu"><span></span><span></span></button>' +
      "</div></header>";

    var drawer = document.createElement("div");
    drawer.className = "drawer";
    drawer.id = "drawer";
    drawer.innerHTML =
      '<div class="drawer-top"><span class="brand">Lou Leisure</span>' +
      '<button type="button" data-drawer-close class="label label--ink">Close</button></div>' +
      "<nav>" +
      NAV.map(function (n) {
        return '<a href="' + n.href + '">' + n.label + "</a>";
      }).join("") +
      '<a href="cart.html">Bag</a></nav>';
    document.body.appendChild(drawer);

    var search = document.createElement("div");
    search.className = "search-overlay";
    search.id = "searchOverlay";
    search.innerHTML =
      '<div class="drawer-top"><span class="brand">Lou Leisure</span>' +
      '<button type="button" data-search-close class="label label--ink">Close</button></div>' +
      '<form onsubmit="return false"><input type="search" id="searchInput" placeholder="Search pieces, collections" aria-label="Search" autocomplete="off"></form>' +
      '<div class="search-results" id="searchResults"></div>';
    document.body.appendChild(search);
  }

  function buildFooter() {
    var host = $("[data-footer]");
    if (!host) return;
    host.outerHTML =
      '<footer class="site-footer">' +
      "<div><span class=\"brand\">Lou Leisure</span>" +
      '<p class="muted" style="margin-top:12px;max-width:24em;font-size:12px">Modern essentials crafted with premium fabrics, clean silhouettes and lasting quality.</p></div>' +
      "<div><h5>Shop</h5><ul>" +
      '<li><a href="shop.html">All pieces</a></li>' +
      '<li><a href="shop.html?category=Outerwear">Outerwear</a></li>' +
      '<li><a href="shop.html?category=Knitwear">Knitwear</a></li>' +
      '<li><a href="shop.html?category=Accessories">Accessories</a></li></ul></div>' +
      "<div><h5>House</h5><ul>" +
      '<li><a href="collections.html">Collections</a></li>' +
      '<li><a href="stories.html">Stories</a></li>' +
      '<li><a href="about.html">About</a></li>' +
      '<li><a href="about.html#contact">Contact</a></li></ul></div>' +
      "<div><h5>Newsletter</h5>" +
      '<form class="field" data-newsletter style="gap:10px">' +
      '<input type="email" placeholder="Email address" aria-label="Email address" required>' +
      '<span class="err">Enter a valid email address.</span>' +
      '<button class="btn btn--ghost" type="submit"><span>Subscribe</span></button></form></div>' +
      '<div class="footer-bottom"><span>&copy; 2026 Lou Leisure</span><span>Shipping &amp; Returns</span><span>Privacy</span></div>' +
      "</footer>";
  }

  /* ---------- product card ---------- */

  function cardHTML(p) {
    return (
      '<article class="card reveal">' +
      '<a href="product.html?id=' +
      p.id +
      '" class="card-media"><img src="' +
      p.img +
      '" alt="' +
      p.alt +
      '" loading="lazy"></a>' +
      '<div class="card-meta"><div>' +
      '<span class="card-tag">| ' +
      p.tag +
      " |</span>" +
      '<a href="product.html?id=' +
      p.id +
      '"><div class="card-name">' +
      p.name +
      "</div></a>" +
      '<div class="card-price">' +
      money(p.price) +
      "</div></div>" +
      '<button class="heart" type="button" data-wish="' +
      p.id +
      '" aria-label="Save ' +
      p.name +
      '">\u2661</button>' +
      "</div></article>"
    );
  }

  function renderGrid(host, list) {
    if (!host) return;
    host.innerHTML = list.length
      ? list.map(cardHTML).join("")
      : '<p class="empty" style="grid-column:1/-1">No pieces match these filters.</p>';
    paintHearts();
    observeReveals();
  }

  /* ---------- reveal ---------- */

  var io;
  function observeReveals() {
    var items = $$(".reveal:not(.is-in)");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("is-in");
      });
      return;
    }
    if (!io) {
      io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              e.target.classList.add("is-in");
              io.unobserve(e.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px" }
      );
    }
    items.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ---------- pages ---------- */

  function initHome() {
    var grid = $("#homeGrid");
    if (!grid) return;

    function apply(tag) {
      renderGrid(
        grid,
        PRODUCTS.filter(function (p) {
          return p.tag === tag;
        })
      );
    }
    $$("#homeTabs .tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        $$("#homeTabs .tab").forEach(function (t) {
          t.classList.remove("is-active");
        });
        tab.classList.add("is-active");
        apply(tab.getAttribute("data-tag"));
      });
    });
    apply("Best Sellers");

    // hero thumbnail rail swaps the tall hero image
    var main = $("#heroMain");
    $$("#heroRail button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        $$("#heroRail button").forEach(function (b) {
          b.classList.remove("is-active");
        });
        btn.classList.add("is-active");
        if (main) {
          main.style.opacity = "0";
          setTimeout(function () {
            main.src = btn.getAttribute("data-src");
            main.style.opacity = "1";
          }, 180);
        }
      });
    });

    // header turns solid once past the hero
    var header = $("#siteHeader");
    var hero = $("#hero");
    if (header && hero) {
      var onScroll = function () {
        header.classList.toggle("is-solid", window.scrollY > hero.offsetHeight - 80);
      };
      window.addEventListener("scroll", onScroll);
      onScroll();
    }
  }

  function initShop() {
    var grid = $("#shopGrid");
    if (!grid) return;

    var state = {
      categories: [],
      sizes: [],
      max: 100000,
      sort: "featured",
      shown: 8
    };

    var preset = param("category");
    if (preset) state.categories = [preset];

    // build category checkboxes
    var cats = [];
    PRODUCTS.forEach(function (p) {
      if (cats.indexOf(p.category) < 0) cats.push(p.category);
    });
    $("#catFilters").innerHTML = cats
      .map(function (c) {
        return (
          '<label><input type="checkbox" value="' +
          c +
          '"' +
          (state.categories.indexOf(c) > -1 ? " checked" : "") +
          "> " +
          c +
          "</label>"
        );
      })
      .join("");

    var sizes = [];
    PRODUCTS.forEach(function (p) {
      p.sizes.forEach(function (s) {
        if (sizes.indexOf(s) < 0) sizes.push(s);
      });
    });
    $("#sizeFilters").innerHTML = sizes
      .map(function (s) {
        return '<button class="chip" type="button" data-size="' + s + '">' + s + "</button>";
      })
      .join("");

    function filtered() {
      var list = PRODUCTS.filter(function (p) {
        if (state.categories.length && state.categories.indexOf(p.category) < 0) return false;
        if (state.sizes.length) {
          var hit = p.sizes.some(function (s) {
            return state.sizes.indexOf(s) > -1;
          });
          if (!hit) return false;
        }
        return p.price <= state.max;
      });
      if (state.sort === "low") list.sort(function (a, b) { return a.price - b.price; });
      if (state.sort === "high") list.sort(function (a, b) { return b.price - a.price; });
      if (state.sort === "name") list.sort(function (a, b) { return a.name.localeCompare(b.name); });
      return list;
    }

    function paint() {
      var list = filtered();
      renderGrid(grid, list.slice(0, state.shown));
      $("#shopCount").textContent = list.length + " products";
      $("#loadMore").style.display = list.length > state.shown ? "inline-flex" : "none";
    }

    $("#catFilters").addEventListener("change", function (e) {
      var v = e.target.value;
      if (e.target.checked) state.categories.push(v);
      else state.categories.splice(state.categories.indexOf(v), 1);
      state.shown = 8;
      paint();
    });

    $("#sizeFilters").addEventListener("click", function (e) {
      var btn = e.target.closest("[data-size]");
      if (!btn) return;
      var v = btn.getAttribute("data-size");
      var i = state.sizes.indexOf(v);
      if (i > -1) state.sizes.splice(i, 1);
      else state.sizes.push(v);
      btn.classList.toggle("is-on", i < 0);
      state.shown = 8;
      paint();
    });

    var price = $("#priceRange");
    price.addEventListener("input", function () {
      state.max = Number(price.value);
      $("#priceOut").textContent = "Up to " + money(state.max);
      state.shown = 8;
      paint();
    });

    $("#sortBy").addEventListener("change", function (e) {
      state.sort = e.target.value;
      paint();
    });

    $("#loadMore").addEventListener("click", function () {
      state.shown += 8;
      paint();
    });

    $("#clearFilters").addEventListener("click", function () {
      state.categories = [];
      state.sizes = [];
      state.max = 100000;
      state.shown = 8;
      price.value = 100000;
      $("#priceOut").textContent = "Up to " + money(100000);
      $$("#catFilters input").forEach(function (i) { i.checked = false; });
      $$("#sizeFilters .chip").forEach(function (c) { c.classList.remove("is-on"); });
      paint();
    });

    paint();
  }

  function initProduct() {
    var root = $("#pdp");
    if (!root) return;
    var p = byId(param("id")) || PRODUCTS[0];
    document.title = p.name + " — Lou Leisure";

    var gallery = [p.img, "img/edit-2.jpg", "img/edit-1.jpg"];
    var selectedSize = p.sizes[0];
    var qty = 1;

    $("#pdpMain").src = p.img;
    $("#pdpMain").alt = p.alt;
    $("#pdpThumbs").innerHTML = gallery
      .map(function (src, i) {
        return (
          '<button type="button" class="' +
          (i === 0 ? "is-active" : "") +
          '" data-src="' +
          src +
          '"><img src="' +
          src +
          '" alt="View ' +
          (i + 1) +
          ' of ' +
          p.name +
          '"></button>'
        );
      })
      .join("");
    $("#pdpThumbs").addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      $$("#pdpThumbs button").forEach(function (x) { x.classList.remove("is-active"); });
      b.classList.add("is-active");
      $("#pdpMain").src = b.getAttribute("data-src");
    });

    $("#pdpTag").textContent = "| " + p.tag + " | " + p.category;
    $("#pdpName").textContent = p.name;
    $("#pdpPrice").textContent = money(p.price);
    $("#pdpDesc").textContent = p.desc;
    $("#pdpFabric").textContent = p.fabric;
    $("#pdpSizes").innerHTML = p.sizes
      .map(function (s, i) {
        return '<button class="size' + (i === 0 ? " is-on" : "") + '" type="button" data-size="' + s + '">' + s + "</button>";
      })
      .join("");
    $("#pdpSizes").addEventListener("click", function (e) {
      var b = e.target.closest("[data-size]");
      if (!b) return;
      $$("#pdpSizes .size").forEach(function (x) { x.classList.remove("is-on"); });
      b.classList.add("is-on");
      selectedSize = b.getAttribute("data-size");
    });

    $("#qtyOut").textContent = qty;
    $("#qtyMinus").addEventListener("click", function () {
      qty = Math.max(1, qty - 1);
      $("#qtyOut").textContent = qty;
    });
    $("#qtyPlus").addEventListener("click", function () {
      qty = Math.min(10, qty + 1);
      $("#qtyOut").textContent = qty;
    });

    $("#addToCart").addEventListener("click", function () {
      addToCart(p.id, selectedSize, qty);
    });
    $("#pdpWish").setAttribute("data-wish", p.id);
    $("#pdpWish").setAttribute("aria-label", "Save " + p.name);

    var related = PRODUCTS.filter(function (x) {
      return x.id !== p.id;
    }).slice(0, 4);
    renderGrid($("#pdpRelated"), related);
    paintHearts();
  }

  function initCart() {
    var host = $("#cartLines");
    if (!host) return;

    function paint() {
      var cart = read(CART_KEY);
      if (!cart.length) {
        host.innerHTML =
          '<p class="empty">Your bag is empty. <a class="link-underline" href="shop.html">Browse the shop</a></p>';
      } else {
        host.innerHTML = cart
          .map(function (line, idx) {
            var p = byId(line.id);
            if (!p) return "";
            return (
              '<div class="cart-line">' +
              '<a href="product.html?id=' + p.id + '"><img src="' + p.img + '" alt="' + p.alt + '"></a>' +
              "<div><span class=\"card-tag\">| " + p.category + " |</span>" +
              '<div class="card-name" style="font-size:14px">' + p.name + "</div>" +
              '<div class="muted" style="font-size:12px;margin-top:4px">Size ' + line.size + "</div>" +
              '<div class="qty" style="margin-top:12px">' +
              '<button type="button" data-dec="' + idx + '" aria-label="Decrease quantity">&minus;</button>' +
              "<span>" + line.qty + "</span>" +
              '<button type="button" data-inc="' + idx + '" aria-label="Increase quantity">+</button></div></div>' +
              '<div style="text-align:right"><div>' + money(p.price * line.qty) + "</div>" +
              '<button class="label label--ink" style="margin-top:14px;text-decoration:underline" type="button" data-remove="' + idx + '">Remove</button></div>' +
              "</div>"
            );
          })
          .join("");
      }

      var sub = cart.reduce(function (a, l) {
        var p = byId(l.id);
        return a + (p ? p.price * l.qty : 0);
      }, 0);
      var ship = sub === 0 || sub > 40000 ? 0 : 2000;
      $("#sumSub").textContent = money(sub);
      $("#sumShip").textContent = ship ? money(ship) : "Complimentary";
      $("#sumTotal").textContent = money(sub + ship);
      $("#checkout").disabled = cart.length === 0;
      $("#checkout").style.opacity = cart.length ? "1" : "0.4";
      syncBadges();
    }

    host.addEventListener("click", function (e) {
      var cart = read(CART_KEY);
      var inc = e.target.closest("[data-inc]");
      var dec = e.target.closest("[data-dec]");
      var rem = e.target.closest("[data-remove]");
      if (inc) cart[Number(inc.getAttribute("data-inc"))].qty++;
      else if (dec) {
        var i = Number(dec.getAttribute("data-dec"));
        cart[i].qty = Math.max(1, cart[i].qty - 1);
      } else if (rem) cart.splice(Number(rem.getAttribute("data-remove")), 1);
      else return;
      write(CART_KEY, cart);
      paint();
    });

    $("#checkout").addEventListener("click", function () {
      toast("Checkout opens soon");
    });

    paint();
  }

  function initCollections() {
    var host = $("#collectionGrid");
    if (!host) return;
    host.innerHTML = (window.COLLECTIONS || [])
      .map(function (c) {
        return (
          '<a class="collection reveal" href="shop.html">' +
          '<img src="' + c.img + '" alt="' + c.alt + '" loading="lazy">' +
          '<div class="collection-body"><span class="label" style="color:rgba(255,255,255,.7)">| ' + c.name + " |</span>" +
          '<h3 class="title" style="margin-top:8px">' + c.name + "</h3>" +
          '<p style="font-size:12px;margin-top:8px;max-width:28em;opacity:.85">' + c.copy + "</p></div></a>"
        );
      })
      .join("");
    observeReveals();
  }

  function initStories() {
    var host = $("#storyGrid");
    if (!host) return;
    host.innerHTML = (window.STORIES || [])
      .map(function (s) {
        return (
          '<article class="story reveal">' +
          '<img src="' + s.img + '" alt="' + s.alt + '" loading="lazy">' +
          '<div class="story-body"><span class="label">| ' + s.kind + " | " + s.date + " |</span>" +
          '<h3 class="title" style="font-size:20px;margin-top:8px">' + s.title + "</h3>" +
          '<p class="muted" style="font-size:13px;margin-top:8px;max-width:34em">' + s.excerpt + "</p>" +
          '<span class="link-underline" style="display:inline-block;margin-top:14px">Read</span></div></article>'
        );
      })
      .join("");
    observeReveals();
  }

  /* ---------- global interactions ---------- */

  function initChromeBehaviour() {
    var drawer = $("#drawer");
    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-drawer-open]")) drawer.classList.add("is-open");
      if (e.target.closest("[data-drawer-close]")) drawer.classList.remove("is-open");
      if (e.target.closest("[data-search-open]")) {
        $("#searchOverlay").classList.add("is-open");
        $("#searchInput").focus();
      }
      if (e.target.closest("[data-search-close]")) $("#searchOverlay").classList.remove("is-open");

      var heart = e.target.closest(".heart[data-wish]");
      if (heart) {
        var added = toggleWish(heart.getAttribute("data-wish"));
        toast(added ? "Saved to wishlist" : "Removed from wishlist");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        $("#searchOverlay").classList.remove("is-open");
        drawer.classList.remove("is-open");
      }
    });

    var input = $("#searchInput");
    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      var out = $("#searchResults");
      if (!q) {
        out.innerHTML = "";
        return;
      }
      var hits = PRODUCTS.filter(function (p) {
        return (p.name + " " + p.category + " " + p.tag).toLowerCase().indexOf(q) > -1;
      }).slice(0, 8);
      out.innerHTML = hits.length
        ? hits
            .map(function (p) {
              return (
                '<a href="product.html?id=' + p.id + '"><span>' + p.name + '</span><span class="muted">' + money(p.price) + "</span></a>"
              );
            })
            .join("")
        : '<p class="muted" style="font-size:13px">Nothing found.</p>';
    });

    // header solid state on non-hero pages
    var header = $("#siteHeader");
    if (header && !$("#hero")) header.classList.add("is-light");

    // newsletter + contact validation
    document.addEventListener("submit", function (e) {
      var form = e.target;
      if (!form.matches("[data-newsletter], [data-contact]")) return;
      e.preventDefault();
      var ok = true;
      $$("input, textarea", form).forEach(function (f) {
        var field = f.closest(".field") || form;
        var val = f.value.trim();
        var bad = !val || (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(val));
        field.classList.toggle("has-error", bad);
        if (bad) ok = false;
      });
      if (!ok) return;
      form.reset();
      toast(form.hasAttribute("data-contact") ? "Message sent" : "Subscribed");
    });

    // accordions
    document.addEventListener("click", function (e) {
      var head = e.target.closest(".acc-head");
      if (!head) return;
      head.parentNode.classList.toggle("is-open");
    });
  }

  /* ---------- boot ---------- */

  document.addEventListener("DOMContentLoaded", function () {
    buildHeader();
    buildFooter();
    initChromeBehaviour();
    syncBadges();
    initHome();
    initShop();
    initProduct();
    initCart();
    initCollections();
    initStories();
    paintHearts();
    observeReveals();
  });
})();
