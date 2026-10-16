const events = [
  {
    id: "designing-tomorrow",
    title: "India Design Futures",
    category: "Design",
    date: "2026-10-24T10:00:00+05:30",
    endDate: "2026-10-24T17:00:00+05:30",
    venue: "Bengaluru International Centre, Bengaluru",
    format: "In person",
    price: 799,
    image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=80",
    description: "A day for the people shaping what comes next. Join independent designers and creative leaders from across India for thoughtful talks, local perspectives, and hands-on ideas.",
    organizer: "India Design Collective",
    deadline: "23 October 2026",
    added: "2026-09-20",
    agenda: [["10:00 AM", "Doors open & filter coffee"], ["11:00 AM", "Designing for the in-between"], ["1:30 PM", "A workshop in better questions"], ["4:00 PM", "Closing conversations"]]
  },
  {
    id: "sound-and-space",
    title: "Indie After Hours",
    category: "Music",
    date: "2026-10-28T19:30:00+05:30",
    endDate: "2026-10-28T22:30:00+05:30",
    venue: "antiSOCIAL, Mumbai",
    format: "In person",
    price: 1299,
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
    description: "An intimate live music night spotlighting independent Indian artists. Come for fresh sounds, stay for the late-night conversations and Mumbai energy.",
    organizer: "Common Ground India",
    deadline: "27 October 2026",
    added: "2026-10-02",
    agenda: [["7:30 PM", "Doors & welcome"], ["8:15 PM", "New voices — live set"], ["9:30 PM", "The After Hours Ensemble"]]
  },
  {
    id: "future-of-things",
    title: "AI & India’s Next Chapter",
    category: "Technology",
    date: "2026-11-05T09:30:00+05:30",
    endDate: "2026-11-05T16:30:00+05:30",
    venue: "Online · streaming from India",
    format: "Online",
    price: 0,
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    description: "A clear-eyed, human-first look at how AI is changing work and life in India. Hear from builders, researchers, and people asking better questions.",
    organizer: "Tomorrow Lab India",
    deadline: "4 November 2026",
    added: "2026-10-10",
    agenda: [["9:30 AM", "Welcome & opening keynote"], ["11:00 AM", "Building with AI, thoughtfully"], ["1:00 PM", "Technology for a billion futures"], ["3:00 PM", "Open questions"]]
  },
  {
    id: "the-makers-table",
    title: "The Makers’ Baithak",
    category: "Workshops",
    date: "2026-11-08T11:00:00+05:30",
    endDate: "2026-11-08T15:00:00+05:30",
    venue: "Jawahar Kala Kendra, Jaipur",
    format: "In person",
    price: 599,
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80",
    description: "Bring an idea, leave with something you made. Spend an easy afternoon exploring block printing, colour, and craft with Jaipur-based makers.",
    organizer: "Made in Rajasthan",
    deadline: "7 November 2026",
    added: "2026-10-05",
    agenda: [["11:00 AM", "Meet the makers"], ["11:30 AM", "Choose your prints & colours"], ["12:00 PM", "Block-printing workshop"], ["2:30 PM", "Show & tell"]]
  },
  {
    id: "ideas-in-motion",
    title: "Founders, Unfiltered",
    category: "Business",
    date: "2026-11-12T18:00:00+05:30",
    endDate: "2026-11-12T20:30:00+05:30",
    venue: "T-Hub, Hyderabad",
    format: "In person",
    price: 0,
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
    description: "An evening of honest stories from founders building in India. No pitches, no panels—just hard-won lessons, practical ideas, and good company.",
    organizer: "Good Company India",
    deadline: "11 November 2026",
    added: "2026-10-06",
    agenda: [["6:00 PM", "Doors open"], ["6:30 PM", "Three founder stories"], ["7:30 PM", "Conversation & connections"]]
  },
  {
    id: "city-run-club",
    title: "Sunrise Run Club",
    category: "Sports",
    date: "2026-11-15T06:30:00+05:30",
    endDate: "2026-11-15T09:00:00+05:30",
    venue: "Marine Drive, Mumbai",
    format: "In person",
    price: 0,
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80",
    description: "All paces, all people. Meet by the sea for a relaxed 5K, a good stretch, and cutting chai together. Your first run club is on us.",
    organizer: "Miles Together Mumbai",
    deadline: "14 November 2026",
    added: "2026-10-08",
    agenda: [["6:30 AM", "Meet by the promenade"], ["6:45 AM", "Easy 5K run"], ["8:00 AM", "Chai & cool-down"]]
  },
  {
    id: "open-source-weekend",
    title: "Build for Bharat Hackathon",
    category: "Hackathons",
    date: "2026-11-21T09:00:00+05:30",
    endDate: "2026-11-22T18:00:00+05:30",
    venue: "Online · open to all of India",
    format: "Online",
    price: 0,
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
    description: "A welcoming weekend to build for real-world needs across India. Find a team, create something useful, and contribute—whether it’s your first hackathon or your fiftieth.",
    organizer: "Open Source India",
    deadline: "20 November 2026",
    added: "2026-10-11",
    agenda: [["9:00 AM", "Kickoff & team intros"], ["10:30 AM", "Build session one"], ["2:00 PM", "Mentor check-in"], ["Sunday, 4:00 PM", "Community demos"]]
  },
  {
    id: "stories-of-the-sea",
    title: "Rivers, Stories & Us",
    category: "Education",
    date: "2026-12-02T18:30:00+05:30",
    endDate: "2026-12-02T20:00:00+05:30",
    venue: "Science City, Kolkata",
    format: "In person",
    price: 349,
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=80",
    description: "Researchers and storytellers trace the rivers that shape our lives and cities. A lively, accessible evening about water, culture, and a changing climate.",
    organizer: "Jol Project",
    deadline: "1 December 2026",
    added: "2026-10-09",
    agenda: [["6:30 PM", "Doors open"], ["7:00 PM", "Stories from the field"], ["7:45 PM", "Audience questions"]]
  },
  {
    id: "winter-light-festival",
    title: "Bengaluru Lights & Live",
    category: "Music",
    date: "2026-12-12T17:00:00+05:30",
    endDate: "2026-12-12T22:00:00+05:30",
    venue: "Bangalore Palace Grounds, Bengaluru",
    format: "In person",
    price: 0,
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    description: "A free evening of light installations, local food, and live music under the Bengaluru sky. Come for a little while or stay until the last song.",
    organizer: "Bengaluru Arts Collective",
    deadline: "12 December 2026",
    added: "2026-10-12",
    agenda: [["5:00 PM", "Installations open"], ["6:30 PM", "Live music begins"], ["8:00 PM", "Festival light walk"]]
  }
];

const categories = ["All events", "Technology", "Workshops", "Hackathons", "Music", "Business", "Design", "Sports", "Education"];
const state = { category: "All events", view: "grid", selectedEvent: null, toastTimer: null };
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const dateOptions = { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" };
const shortDate = (value) => new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" });
const formatPrice = (price) => price === 0
  ? "Free"
  : new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);
const eventDate = (event) => new Date(event.date);
const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
})[character]);
const indiaDateKey = (date) => new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Kolkata",
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
}).format(date);
const imageMarkup = (event, alt = "") => `<img src="${event.image}" alt="${alt || event.title}" loading="lazy" />`;

function renderCategories() {
  $("#category-chips").innerHTML = categories.map((category) => `
    <button class="category-chip${state.category === category ? " active" : ""}" type="button" data-category="${category}" aria-pressed="${state.category === category}">${category}</button>
  `).join("");
}

function renderFeatured() {
  const featured = [events[0], events[1]];
  $("#featured-grid").innerHTML = featured.map((event) => `
    <article class="featured-card">
      ${imageMarkup(event)}
      <a class="featured-arrow" href="events.html" aria-label="Explore events">↗</a>
      <div class="featured-info">
        <p class="event-category">${event.category} · ${shortDate(event.date)}</p>
        <h3>${event.title}</h3>
        <div class="featured-meta"><span>${event.venue.split(",")[0]}</span><span>${event.price ? formatPrice(event.price) : "Free entry"}</span></div>
      </div>
    </article>
  `).join("");
}

function getFilteredEvents() {
  const query = $("#event-search").value.trim().toLowerCase();
  const dateFilter = $("#date-filter").value;
  const todayKey = indiaDateKey(new Date());
  const todayUTC = new Date(`${todayKey}T00:00:00Z`);
  const endOfWeek = new Date(todayUTC);
  endOfWeek.setUTCDate(todayUTC.getUTCDate() + (7 - (todayUTC.getUTCDay() || 7)));
  const endOfMonth = new Date(Date.UTC(todayUTC.getUTCFullYear(), todayUTC.getUTCMonth() + 1, 0));
  const endOfWeekKey = endOfWeek.toISOString().slice(0, 10);
  const endOfMonthKey = endOfMonth.toISOString().slice(0, 10);
  const from = $("#date-from").value || null;
  const to = $("#date-to").value || null;
  const online = $("#online-filter").checked;
  const inPerson = $("#inperson-filter").checked;
  const free = $("#free-filter").checked;
  const paid = $("#paid-filter").checked;

  const result = events.filter((event) => {
    const dateKey = indiaDateKey(eventDate(event));
    const text = `${event.title} ${event.category} ${event.venue} ${event.description} ${event.organizer}`.toLowerCase();
    if (query && !text.includes(query)) return false;
    if (state.category !== "All events" && event.category !== state.category) return false;
    if (dateKey < todayKey) return false;
    if (dateFilter === "today" && dateKey !== todayKey) return false;
    if (dateFilter === "week" && dateKey > endOfWeekKey) return false;
    if (dateFilter === "month" && dateKey > endOfMonthKey) return false;
    if (dateFilter === "custom" && ((from && dateKey < from) || (to && dateKey > to))) return false;
    if (online && event.format !== "Online") return false;
    if (inPerson && event.format !== "In person") return false;
    if (free && event.price !== 0) return false;
    if (paid && event.price === 0) return false;
    return true;
  });
  const sort = $("#sort-select").value;
  if (sort === "recent") result.sort((a, b) => new Date(b.added) - new Date(a.added));
  else if (sort === "name") result.sort((a, b) => a.title.localeCompare(b.title));
  else result.sort((a, b) => eventDate(a) - eventDate(b));
  return result;
}

function renderEvents() {
  const filtered = getFilteredEvents();
  $("#results-count").innerHTML = `<strong>${filtered.length}</strong> ${filtered.length === 1 ? "experience" : "experiences"} to discover`;
  $("#event-grid").classList.toggle("list-view", state.view === "list");
  $("#event-grid").innerHTML = filtered.map((event) => {
    const date = eventDate(event);
    const price = formatPrice(event.price);
    return `
      <article class="event-card">
        <div class="event-image">
          ${imageMarkup(event)}
          <div class="event-date"><span>${date.toLocaleDateString("en-IN", { month: "short", timeZone: "Asia/Kolkata" })}</span><strong>${date.toLocaleDateString("en-IN", { day: "numeric", timeZone: "Asia/Kolkata" })}</strong></div>
        </div>
        <div class="card-content">
          <div class="card-topline"><span class="card-category">${event.category}</span><span>${event.format}</span></div>
          <h3>${event.title}</h3>
          <p class="card-description">${event.description}</p>
          <div class="card-meta"><span class="card-venue">${event.venue}</span><span class="card-price">${price}</span></div>
          <div class="card-footer"><span class="status">Registration open</span><button class="details-link" type="button" data-details="${event.id}">Details <span>↗</span></button></div>
          <button class="card-add-button" type="button" data-add-cart="${event.id}">Add to cart</button>
        </div>
      </article>
    `;
  }).join("");
  $("#empty-state").hidden = filtered.length !== 0;
  $("#event-grid").hidden = filtered.length === 0;
  $("#clear-filters").disabled = state.category === "All events"
    && !$("#event-search").value
    && $("#date-filter").value === "any"
    && !$("#online-filter").checked && !$("#inperson-filter").checked
    && !$("#free-filter").checked && !$("#paid-filter").checked;
}

function renderTrending() {
  $("#trending-track").innerHTML = [events[8], events[2], events[3]].map((event) => `
    <article class="trending-card">
      ${imageMarkup(event)}
      <span class="trending-date">${shortDate(event.date)}</span>
      <div class="trending-details">
        <p class="event-category">${event.category} · ${event.format}</p>
        <h3>${event.title}</h3>
        <p>${event.venue} <span aria-hidden="true">·</span> ${formatPrice(event.price)}</p>
      </div>
      <button class="featured-arrow" type="button" data-details="${event.id}" aria-label="Explore ${event.title}">↗</button>
    </article>
  `).join("");
}

const cartKey = "discover-cart-v1";
const historyKey = "discover-history-v1";

function readStoredList(key) {
  const stored = localStorage.getItem(key);
  if (!stored) return [];
  const value = JSON.parse(stored);
  if (!Array.isArray(value)) throw new TypeError(`Saved data for ${key} is not a list.`);
  return value;
}

function writeStoredList(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function updateCartCount() {
  try {
    const count = readStoredList(cartKey).reduce((total, item) => total + Math.max(0, Number(item.quantity) || 0), 0);
    $$("[data-cart-count]").forEach((element) => { element.textContent = count; });
  } catch (error) {
    console.error("Unable to read the saved cart.", error);
    $$("[data-cart-count]").forEach((element) => { element.textContent = "!"; });
  }
}

function addEventToCart(eventId) {
  const item = events.find((event) => event.id === eventId);
  if (!item) {
    showToast("That event could not be found.");
    return;
  }
  try {
    const cart = readStoredList(cartKey);
    if (cart.some((entry) => entry.eventId === eventId)) {
      showToast("This event is already in your cart. Adjust the quantity there.");
      return;
    }
    cart.push({ eventId, quantity: 1 });
    writeStoredList(cartKey, cart);
    updateCartCount();
    showToast(`${item.title} added to your cart.`);
  } catch (error) {
    console.error("Unable to save this event to the cart.", error);
    showToast("Could not save this event. Check browser storage and try again.");
  }
}

function renderCart() {
  const container = $("#cart-content");
  let cart;
  try {
    cart = readStoredList(cartKey);
  } catch (error) {
    console.error("Unable to read saved cart.", error);
    container.innerHTML = `<div class="storage-error"><h2>Your cart couldn’t be loaded.</h2><p>Saved cart data is invalid or unavailable. Clear this site’s stored data to continue.</p></div>`;
    return;
  }
  const validCart = cart.filter((entry) => events.some((item) => item.id === entry.eventId) && Number.isSafeInteger(Number(entry.quantity)) && Number(entry.quantity) > 0);
  if (validCart.length !== cart.length) {
    try {
      writeStoredList(cartKey, validCart);
    } catch (error) {
      console.error("Unable to repair saved cart.", error);
    }
    cart = validCart;
  }
  updateCartCount();
  if (cart.length === 0) {
    container.innerHTML = `<div class="commerce-empty"><span class="empty-mark">⌑</span><h2>Your cart is waiting for a good plan.</h2><p>Explore upcoming events and add the ones you’d love to experience.</p><a class="button button-dark" href="events.html">Explore events <span>↗</span></a></div>`;
    return;
  }
  const total = cart.reduce((sum, entry) => sum + events.find((item) => item.id === entry.eventId).price * entry.quantity, 0);
  container.innerHTML = `
    <div class="cart-layout">
      <div class="cart-items">${cart.map((entry) => {
        const item = events.find((event) => event.id === entry.eventId);
        return `<article class="cart-item">
          <a class="cart-item-image" href="events.html" aria-label="Browse events">${imageMarkup(item)}</a>
          <div class="cart-item-info"><p class="event-category">${item.category} · ${item.format}</p><h2>${item.title}</h2><p>${shortDate(item.date)} · ${item.venue}</p><strong>${formatPrice(item.price)} <span>per attendee</span></strong>
            <div class="cart-item-actions"><div class="quantity-control" aria-label="Attendee quantity"><button type="button" data-cart-action="decrease" data-event-id="${item.id}" aria-label="Remove one attendee">−</button><output>${entry.quantity}</output><button type="button" data-cart-action="increase" data-event-id="${item.id}" aria-label="Add one attendee">+</button></div><button class="remove-item" type="button" data-cart-action="remove" data-event-id="${item.id}">Remove</button></div>
          </div><strong class="cart-line-total">${formatPrice(item.price * entry.quantity)}</strong>
        </article>`;
      }).join("")}</div>
      <aside class="order-summary"><p class="eyebrow">ORDER SUMMARY</p><h2>Your plans.</h2><div class="summary-line"><span>${cart.reduce((sum, entry) => sum + entry.quantity, 0)} attendee(s)</span><strong>${formatPrice(total)}</strong></div><div class="summary-line"><span>Fees</span><strong>₹0</strong></div><div class="summary-total"><span>Total</span><strong>${formatPrice(total)}</strong></div><p class="demo-note">Demo checkout only. No payment is collected.</p><a class="button button-dark checkout-button" href="payments.html">Continue to checkout <span>↗</span></a></aside>
    </div>`;
}

function updateCart(eventId, action) {
  try {
    let cart = readStoredList(cartKey);
    const entry = cart.find((item) => item.eventId === eventId);
    if (action === "remove") cart = cart.filter((item) => item.eventId !== eventId);
    else if (entry && action === "increase") entry.quantity += 1;
    else if (entry && action === "decrease") entry.quantity -= 1;
    cart = cart.filter((item) => item.quantity > 0);
    writeStoredList(cartKey, cart);
    renderCart();
  } catch (error) {
    console.error("Unable to update the saved cart.", error);
    showToast("Could not update your cart. Check browser storage and try again.");
  }
}

function renderCheckout() {
  const container = $("#checkout-content");
  let cart;
  try {
    cart = readStoredList(cartKey).filter((entry) => events.some((item) => item.id === entry.eventId) && Number.isSafeInteger(Number(entry.quantity)) && Number(entry.quantity) > 0);
  } catch (error) {
    console.error("Unable to read saved cart for checkout.", error);
    container.innerHTML = `<div class="storage-error"><h2>Checkout couldn’t be loaded.</h2><p>Your saved cart is invalid or unavailable.</p><a class="text-link" href="cart.html">Return to cart</a></div>`;
    return;
  }
  if (!cart.length) {
    container.innerHTML = `<div class="commerce-empty"><h2>Nothing to check out yet.</h2><p>Add an event to your cart before checking out.</p><a class="button button-dark" href="events.html">Explore events <span>↗</span></a></div>`;
    return;
  }
  const total = cart.reduce((sum, entry) => sum + events.find((item) => item.id === entry.eventId).price * entry.quantity, 0);
  container.innerHTML = `
    <div class="checkout-layout">
      <form class="checkout-form" id="checkout-form" novalidate>
        <p class="eyebrow">YOUR DETAILS</p><h2>Who’s coming?</h2>
        <label class="form-field">Full name<input name="name" autocomplete="name" required maxlength="100" placeholder="Your name" /></label>
        <label class="form-field">Email address<input name="email" type="email" autocomplete="email" required maxlength="254" placeholder="you@example.com" /></label>
        <label class="form-field">Phone number <span class="optional-label">(optional)</span><input name="phone" type="tel" autocomplete="tel" maxlength="30" placeholder="+91 00000 00000" /></label>
        <p class="eyebrow payment-method-label">DEMO PAYMENT METHOD</p>
        <label class="form-field">Choose a demo method<select name="method"><option value="UPI (demo)">UPI (demo)</option><option value="Card (demo)">Card (demo)</option><option value="Pay at venue (demo)">Pay at venue (demo)</option></select></label>
        <p class="demo-note">This is a frontend demonstration. No real payment details are requested or processed.</p>
        <p class="form-error" id="checkout-error" role="alert" hidden></p>
        <button class="button button-dark" type="submit">Confirm demo booking <span>↗</span></button>
      </form>
      <aside class="order-summary"><p class="eyebrow">YOUR ORDER</p><h2>Event summary.</h2><div class="checkout-items">${cart.map((entry) => {
        const item = events.find((event) => event.id === entry.eventId);
        return `<div class="checkout-item"><span><strong>${item.title}</strong><small>${entry.quantity} attendee(s) · ${shortDate(item.date)}</small></span><strong>${formatPrice(item.price * entry.quantity)}</strong></div>`;
      }).join("")}</div><div class="summary-line"><span>Fees</span><strong>₹0</strong></div><div class="summary-total"><span>Total</span><strong>${formatPrice(total)}</strong></div><a class="text-link" href="cart.html">← Edit cart</a></aside>
    </div>`;
}

function submitCheckout(form) {
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim().toLowerCase();
  const errorMessage = $("#checkout-error");
  if (name.length < 2) {
    errorMessage.textContent = "Please enter your full name.";
    errorMessage.hidden = false;
    form.elements.name.focus();
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errorMessage.textContent = "Enter a valid email address.";
    errorMessage.hidden = false;
    form.elements.email.focus();
    return;
  }
  let cart;
  let previousHistory;
  try {
    cart = readStoredList(cartKey).filter((entry) => events.some((item) => item.id === entry.eventId) && Number.isSafeInteger(Number(entry.quantity)) && Number(entry.quantity) > 0);
    previousHistory = readStoredList(historyKey);
  } catch (error) {
    console.error("Unable to load checkout data.", error);
    errorMessage.textContent = "Your saved order could not be loaded. Return to the cart and try again.";
    errorMessage.hidden = false;
    return;
  }
  if (!cart.length) {
    errorMessage.textContent = "Your cart is empty. Add an event before checking out.";
    errorMessage.hidden = false;
    return;
  }
  const reference = `DISC-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const order = {
    reference,
    name,
    email,
    method: data.get("method"),
    createdAt: new Date().toISOString(),
    items: cart.map((entry) => ({ eventId: entry.eventId, quantity: entry.quantity }))
  };
  try {
    writeStoredList(historyKey, [order, ...previousHistory]);
    writeStoredList(cartKey, []);
  } catch (error) {
    console.error("Unable to save demo checkout.", error);
    try {
      writeStoredList(historyKey, previousHistory);
    } catch (rollbackError) {
      console.error("Unable to roll back an incomplete demo checkout.", rollbackError);
    }
    errorMessage.textContent = "We couldn’t save the demo booking. Nothing was charged; please try again.";
    errorMessage.hidden = false;
    return;
  }
  window.location.href = "history.html?confirmed=1";
}

function renderHistory() {
  const container = $("#history-content");
  let history;
  try {
    history = readStoredList(historyKey);
    if (history.some((order) => !order || typeof order.reference !== "string" || typeof order.name !== "string"
      || typeof order.email !== "string" || typeof order.method !== "string"
      || !Number.isFinite(Date.parse(order.createdAt)) || !Array.isArray(order.items)
      || order.items.some((item) => !events.some((event) => event.id === item.eventId)
        || !Number.isSafeInteger(Number(item.quantity)) || Number(item.quantity) < 1))) {
      throw new TypeError("Saved booking history contains invalid records.");
    }
  } catch (error) {
    console.error("Unable to read saved booking history.", error);
    container.innerHTML = `<div class="storage-error"><h2>Your history couldn’t be loaded.</h2><p>Saved booking data is invalid or unavailable.</p></div>`;
    return;
  }
  updateCartCount();
  if (!history.length) {
    container.innerHTML = `<div class="commerce-empty"><span class="empty-mark">◷</span><h2>Your story starts with an event.</h2><p>Once you complete a demo checkout, your booking reference and event details will appear here.</p><a class="button button-dark" href="events.html">Explore events <span>↗</span></a></div>`;
    return;
  }
  const confirmed = new URLSearchParams(window.location.search).has("confirmed");
  container.innerHTML = `${confirmed ? `<div class="history-confirmation"><span aria-hidden="true">✓</span><div><strong>You’re on the list.</strong><p>Your demo booking is saved in this browser. No payment was processed.</p></div></div>` : ""}
    <div class="history-list">${history.map((order) => `<article class="history-order">
      <div class="history-order-heading"><div><p class="eyebrow">DEMO BOOKING · ${new Date(order.createdAt).toLocaleDateString("en-IN", dateOptions)}</p><h2>Reference ${escapeHTML(order.reference)}</h2></div><span class="history-status">Saved in this browser</span></div>
      <p class="history-customer">${escapeHTML(order.name)} · ${escapeHTML(order.email)} · ${escapeHTML(order.method)}</p>
      <div class="history-event-list">${order.items.map((entry) => {
        const item = events.find((event) => event.id === entry.eventId);
        if (!item) return "";
        return `<div class="history-event">${imageMarkup(item)}<div><strong>${item.title}</strong><span>${shortDate(item.date)} · ${item.venue}</span></div><span>${entry.quantity} attendee(s)</span></div>`;
      }).join("")}</div>
    </article>`).join("")}</div>`;
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => toast.classList.remove("visible"), 2800);
}

function openModal(eventId) {
  const event = events.find((item) => item.id === eventId);
  if (!event) {
    showToast("That event could not be found.");
    return;
  }
  state.selectedEvent = event;
  $("#modal-content").innerHTML = `
    <div class="modal-image-wrap">${imageMarkup(event)}</div>
    <div class="modal-content-inner">
      <p class="event-category">${event.category} · ${event.format}</p>
      <h2 id="modal-title">${event.title}</h2>
      <p class="modal-description">${event.description}</p>
      <div class="modal-meta-grid">
        <div class="modal-meta-item"><span>Date & time (IST)</span><strong>${eventDate(event).toLocaleDateString("en-IN", dateOptions)} · ${eventDate(event).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" })}</strong></div>
        <div class="modal-meta-item"><span>Location</span><strong>${event.venue}</strong></div>
        <div class="modal-meta-item"><span>Hosted by</span><strong>${event.organizer}</strong></div>
        <div class="modal-meta-item"><span>Admission</span><strong>${event.price ? `${formatPrice(event.price)} per person` : "Free entry"}</strong></div>
        <div class="modal-meta-item"><span>Registration deadline</span><strong>${event.deadline}</strong></div>
        <div class="modal-meta-item"><span>Availability</span><strong>Registration open</strong></div>
      </div>
      <h3 class="modal-subhead">A little about it</h3>
      <p class="modal-description">${event.description}</p>
      <h3 class="modal-subhead">The plan</h3>
      <ul class="agenda-list">${event.agenda.map(([time, item]) => `<li><time>${time}</time><span>${item}</span></li>`).join("")}</ul>
      <div class="registration-panel">
        <div><p>Make a little room in your calendar</p><strong>${event.price ? `${formatPrice(event.price)} · ` : "Free · "}${shortDate(event.date)} · ${event.format}</strong></div>
        <button class="button button-dark" id="add-event-to-cart" type="button">Add to cart <span>↗</span></button>
      </div>
    </div>
  `;
  $("#event-modal").hidden = false;
  document.body.classList.add("modal-open");
  $("#event-modal .modal-close").focus();
}

function openRegistration() {
  const event = state.selectedEvent;
  if (!event) return;
  $("#modal-content").innerHTML = `
    <div class="modal-content-inner">
      <button class="text-link back-to-details" id="back-to-details" type="button">← Back to event</button>
      <p class="eyebrow" style="margin-top:24px">SAVE YOUR SPOT</p>
      <h2 id="modal-title">You’re almost there.</h2>
      <p class="form-intro">Registering for <strong>${event.title}</strong> · ${shortDate(event.date)} · ${event.venue}</p>
      <form class="registration-form" id="registration-form" novalidate>
        <label class="form-field">Full name <input name="name" autocomplete="name" required maxlength="100" placeholder="Your name" /></label>
        <label class="form-field">Email address <input name="email" type="email" autocomplete="email" required maxlength="254" placeholder="you@example.com" /></label>
        <label class="form-field">Phone number <span class="optional-label">(optional)</span><input name="phone" type="tel" autocomplete="tel" maxlength="30" placeholder="+1 (555) 000-0000" /></label>
        <label class="form-field">College or organization <span class="optional-label">(optional)</span><input name="organization" autocomplete="organization" maxlength="120" placeholder="Where you’re from" /></label>
        <label class="form-field form-full">Anything else? <span class="optional-label">(optional)</span><textarea name="note" maxlength="500" placeholder="Let the organizer know (optional)"></textarea></label>
        <p class="form-error" id="form-error" role="alert" hidden></p>
        <div class="form-actions"><span class="form-intro">Demo registration · saved in this browser only</span><button class="button button-dark" type="submit">Confirm registration <span>↗</span></button></div>
      </form>
    </div>
  `;
  $("#modal-content").scrollTop = 0;
  $("[name=name]", $("#registration-form")).focus();
}

function registrationKey() {
  return "discover-registrations-v1";
}

function submitRegistration(form) {
  const formData = new FormData(form);
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const error = $("#form-error");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (name.length < 2) {
    error.textContent = "Please enter your full name.";
    error.hidden = false;
    $("[name=name]", form).focus();
    return;
  }
  if (!emailPattern.test(email)) {
    error.textContent = "Enter a valid email address to continue.";
    error.hidden = false;
    $("[name=email]", form).focus();
    return;
  }

  let registrations;
  try {
    registrations = JSON.parse(localStorage.getItem(registrationKey()) || "[]");
  } catch (storageError) {
    console.error("Unable to read saved registrations.", storageError);
    error.textContent = "Your browser could not access saved registrations. Please check browser storage and try again.";
    error.hidden = false;
    return;
  }
  if (!Array.isArray(registrations)) {
    console.error("Saved registrations are not in the expected format.");
    error.textContent = "Saved registration data is unavailable. Please clear this site’s stored data and try again.";
    error.hidden = false;
    return;
  }
  if (registrations.some((registration) => registration.eventId === state.selectedEvent.id && registration.email === email)) {
    error.textContent = "This email is already registered for this event.";
    error.hidden = false;
    $("[name=email]", form).focus();
    return;
  }

  const button = $('button[type="submit"]', form);
  button.disabled = true;
  button.innerHTML = "Saving your spot…";
  const reference = `DISC-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const registration = {
    reference,
    eventId: state.selectedEvent.id,
    eventName: state.selectedEvent.title,
    email,
    name,
    createdAt: new Date().toISOString()
  };
  registrations.push(registration);
  try {
    localStorage.setItem(registrationKey(), JSON.stringify(registrations));
  } catch (storageError) {
    console.error("Unable to save registration.", storageError);
    button.disabled = false;
    button.innerHTML = "Confirm registration <span>↗</span>";
    error.textContent = "We couldn’t save your registration in this browser. Check available storage and try again.";
    error.hidden = false;
    return;
  }

  $("#modal-content").innerHTML = `
    <div class="registration-success">
      <div class="success-icon" aria-hidden="true">✓</div>
      <p class="eyebrow">ALL SET</p>
      <h2 id="modal-title">You’re on the list.</h2>
      <p>Your registration for <strong>${state.selectedEvent.title}</strong> is confirmed. We can’t wait to see you there.</p>
      <div class="reference-box"><span>Your reference</span><strong>${reference}</strong></div>
      <div class="modal-meta-grid" style="text-align:left">
        <div class="modal-meta-item"><span>Date & time (IST)</span><strong>${eventDate(state.selectedEvent).toLocaleDateString("en-IN", dateOptions)} · ${eventDate(state.selectedEvent).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" })}</strong></div>
        <div class="modal-meta-item"><span>Location</span><strong>${state.selectedEvent.venue}</strong></div>
      </div>
      <button class="button button-dark" id="success-close" type="button">Back to events <span>↗</span></button>
    </div>
  `;
  $("#modal-content").scrollTop = 0;
}

function clearFilters() {
  state.category = "All events";
  $("#event-search").value = "";
  $("#clear-search").hidden = true;
  $("#date-filter").value = "any";
  $("#date-from").value = "";
  $("#date-to").value = "";
  ["online-filter", "inperson-filter", "free-filter", "paid-filter"].forEach((id) => { $(`#${id}`).checked = false; });
  $("#date-range").hidden = true;
  renderCategories();
  renderEvents();
}

document.addEventListener("click", (event) => {
  const detailsButton = event.target.closest("[data-details]");
  if (detailsButton) {
    openModal(detailsButton.dataset.details);
    return;
  }
  if (event.target.closest("#add-event-to-cart")) {
    if (state.selectedEvent) addEventToCart(state.selectedEvent.id);
    $("#event-modal").hidden = true;
    document.body.classList.remove("modal-open");
    state.selectedEvent = null;
    return;
  }
  const addCartButton = event.target.closest("[data-add-cart]");
  if (addCartButton) {
    addEventToCart(addCartButton.dataset.addCart);
    return;
  }
  const cartAction = event.target.closest("[data-cart-action]");
  if (cartAction) {
    updateCart(cartAction.dataset.eventId, cartAction.dataset.cartAction);
    return;
  }
  if (event.target.closest("#back-to-details")) {
    if (state.selectedEvent) openModal(state.selectedEvent.id);
    return;
  }
  if (event.target.closest("#success-close, #event-modal .modal-close") || event.target === $("#event-modal")) {
    $("#event-modal").hidden = true;
    document.body.classList.remove("modal-open");
    state.selectedEvent = null;
    return;
  }
  if (event.target.closest("#clear-filters, #empty-clear")) {
    clearFilters();
    return;
  }
  if (event.target.closest("#clear-search")) {
    $("#event-search").value = "";
    $("#clear-search").hidden = true;
    $("#event-search").focus();
    renderEvents();
    return;
  }
  const categoryButton = event.target.closest("[data-category]");
  if (categoryButton) {
    state.category = categoryButton.dataset.category;
    renderCategories();
    renderEvents();
    return;
  }
  const viewButton = event.target.closest("[data-view]");
  if (viewButton) {
    state.view = viewButton.dataset.view;
    $$(".view-button").forEach((button) => {
      const active = button.dataset.view === state.view;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    renderEvents();
  }
});

document.addEventListener("input", (event) => {
  if (event.target.id === "event-search") {
    $("#clear-search").hidden = !event.target.value;
    renderEvents();
  }
  if (event.target.matches("#date-from, #date-to")) renderEvents();
});

document.addEventListener("change", (event) => {
  if (event.target.matches("#sort-select, #online-filter, #inperson-filter, #free-filter, #paid-filter")) renderEvents();
  if (event.target.id === "date-filter") {
    $("#date-range").hidden = event.target.value !== "custom";
    renderEvents();
  }
});

document.addEventListener("submit", (event) => {
  if (event.target.id === "registration-form") {
    event.preventDefault();
    submitRegistration(event.target);
  }
  if (event.target.id === "checkout-form") {
    event.preventDefault();
    submitCheckout(event.target);
  }
});

$(".theme-toggle")?.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-theme");
  $(".theme-toggle").setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  try {
    localStorage.setItem("discover-theme", isDark ? "dark" : "light");
  } catch (error) {
    console.warn("Theme preference could not be saved.", error);
  }
});

$(".mobile-menu-button")?.addEventListener("click", () => {
  const button = $(".mobile-menu-button");
  const expanded = button.getAttribute("aria-expanded") === "true";
  button.setAttribute("aria-expanded", String(!expanded));
  button.setAttribute("aria-label", expanded ? "Open navigation" : "Close navigation");
  $("#main-nav").classList.toggle("open", !expanded);
});

$("#main-nav")?.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    $("#main-nav").classList.remove("open");
    $(".mobile-menu-button").setAttribute("aria-expanded", "false");
    $(".mobile-menu-button").setAttribute("aria-label", "Open navigation");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && $("#event-modal") && !$("#event-modal").hidden) {
    $("#event-modal").hidden = true;
    document.body.classList.remove("modal-open");
    state.selectedEvent = null;
  }
});

const hero = $(".hero");
if (hero) {
  const headerObserver = new IntersectionObserver(([entry]) => {
    $(".site-header").classList.toggle("scrolled", !entry.isIntersecting);
  }, { threshold: 0.05 });
  headerObserver.observe(hero);
}

try {
  if (localStorage.getItem("discover-theme") === "dark") {
    document.body.classList.add("dark-theme");
    $(".theme-toggle")?.setAttribute("aria-label", "Switch to light mode");
  }
} catch (error) {
  console.warn("Theme preference could not be loaded.", error);
}

updateCartCount();
if (document.body.dataset.page === "home") renderFeatured();
if (document.body.dataset.page === "events") {
  renderCategories();
  renderTrending();
  renderEvents();
}
if (document.body.dataset.page === "cart") renderCart();
if (document.body.dataset.page === "payments") renderCheckout();
if (document.body.dataset.page === "history") renderHistory();
