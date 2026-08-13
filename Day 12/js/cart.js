/* Cart state in localStorage */
(function () {
  var KEY = "vanveda_cart";
  var ORDER_KEY = "vanveda_last_order";

  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function write(items) {
    localStorage.setItem(KEY, JSON.stringify(items));
    document.dispatchEvent(new CustomEvent("cart:change", { detail: items }));
  }

  function product(id) {
    return (window.VANVEDA_PRODUCTS || []).filter(function (p) {
      return p.id === id;
    })[0];
  }

  var Cart = {
    items: read,
    count: function () {
      return read().reduce(function (n, i) {
        return n + i.qty;
      }, 0);
    },
    detailed: function () {
      return read()
        .map(function (i) {
          var p = product(i.id);
          return p ? { product: p, qty: i.qty } : null;
        })
        .filter(Boolean);
    },
    add: function (id, qty) {
      qty = qty || 1;
      var items = read();
      var found = items.filter(function (i) {
        return i.id === id;
      })[0];
      if (found) found.qty += qty;
      else items.push({ id: id, qty: qty });
      write(items);
      var p = product(id);
      if (window.VanvedaUI) window.VanvedaUI.toast((p ? p.name : "Item") + " added to bag");
    },
    setQty: function (id, qty) {
      var items = read()
        .map(function (i) {
          return i.id === id ? { id: id, qty: Math.max(0, qty) } : i;
        })
        .filter(function (i) {
          return i.qty > 0;
        });
      write(items);
    },
    remove: function (id) {
      write(
        read().filter(function (i) {
          return i.id !== id;
        })
      );
    },
    clear: function () {
      write([]);
    },
    totals: function () {
      var subtotal = Cart.detailed().reduce(function (s, l) {
        return s + l.product.price * l.qty;
      }, 0);
      var shipping = subtotal === 0 || subtotal >= 999 ? 0 : 79;
      return { subtotal: subtotal, shipping: shipping, total: subtotal + shipping };
    },
    saveOrder: function (order) {
      localStorage.setItem(ORDER_KEY, JSON.stringify(order));
    },
    lastOrder: function () {
      try {
        return JSON.parse(localStorage.getItem(ORDER_KEY));
      } catch (e) {
        return null;
      }
    },
  };

  window.Cart = Cart;
  window.formatINR = function (n) {
    return "₹" + Number(n).toLocaleString("en-IN");
  };
})();
