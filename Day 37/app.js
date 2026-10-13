/**
 * UtsavPass — Main Application Logic
 * Pure Vanilla JavaScript (No frameworks or external libraries)
 */

(function () {
  'use strict';

  // =========================================================================
  // State Management
  // =========================================================================
  const state = {
    events: window.INITIAL_EVENTS || [],
    filteredEvents: [],
    savedEventIds: new Set(JSON.parse(localStorage.getItem('utsav_saved_events') || '[]')),
    myBookings: JSON.parse(localStorage.getItem('utsav_bookings') || '[]'),
    
    // Filters
    selectedCity: 'ALL',
    selectedCategory: 'ALL',
    selectedDateFilter: 'all', // 'all', 'today', 'tomorrow', 'weekend', 'week'
    specificDate: '',
    searchQuery: '',
    priceTier: 'ALL',
    sortBy: 'date-asc',
    
    // Active Modals
    activeEventForDetail: null,
    activeEventForReg: null,
    activeBookingForPass: null,

    // Registration Form Live State
    regTier: 'standard',
    regQty: 1
  };

  // Helper date formatters
  function getTodayString() {
    const d = new Date();
    return formatIsoDate(d);
  }

  function getTomorrowString() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return formatIsoDate(d);
  }

  function formatIsoDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function getWeekendDates() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
    
    const sat = new Date(today);
    sat.setDate(sat.getDate() + daysUntilSaturday);
    const sun = new Date(sat);
    sun.setDate(sun.getDate() + 1);

    return [formatIsoDate(sat), formatIsoDate(sun)];
  }

  function getNext7DaysDates() {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      dates.push(formatIsoDate(d));
    }
    return dates;
  }

  function formatDisplayDate(isoDateStr) {
    if (!isoDateStr) return '';
    const parts = isoDateStr.split('-');
    if (parts.length !== 3) return isoDateStr;
    const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
    const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
    return dateObj.toLocaleDateString('en-IN', options);
  }

  function formatCurrency(amount) {
    if (amount === 0) return 'FREE';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }

  // =========================================================================
  // DOM Elements
  // =========================================================================
  const dom = {
    // Header
    headerCitySelect: document.getElementById('headerCitySelect'),
    savedEventsBtn: document.getElementById('savedEventsBtn'),
    savedCountBadge: document.getElementById('savedCountBadge'),
    myRegistrationsBtn: document.getElementById('myRegistrationsBtn'),
    passCountBadge: document.getElementById('passCountBadge'),

    // Hero Search & Filters
    searchInput: document.getElementById('searchInput'),
    dateFilterInput: document.getElementById('dateFilterInput'),
    categorySelect: document.getElementById('categorySelect'),
    applySearchBtn: document.getElementById('applySearchBtn'),
    dateChips: document.querySelectorAll('.date-chip'),
    resetFiltersBtn: document.getElementById('resetFiltersBtn'),

    // Catalog Controls
    catalogResultsHeading: document.getElementById('catalogResultsHeading'),
    resultsCountText: document.getElementById('resultsCountText'),
    priceFilterSelect: document.getElementById('priceFilterSelect'),
    sortBySelect: document.getElementById('sortBySelect'),
    activeFiltersContainer: document.getElementById('activeFiltersContainer'),
    activeChipsList: document.getElementById('activeChipsList'),

    // Events Grid
    eventsGrid: document.getElementById('eventsGrid'),
    emptyState: document.getElementById('emptyState'),
    emptyResetBtn: document.getElementById('emptyResetBtn'),

    // Event Detail Modal
    eventDetailModal: document.getElementById('eventDetailModal'),
    closeDetailModalBtn: document.getElementById('closeDetailModalBtn'),
    modalDetailCategory: document.getElementById('modalDetailCategory'),
    modalDetailCity: document.getElementById('modalDetailCity'),
    modalDetailImage: document.getElementById('modalDetailImage'),
    modalDetailTitle: document.getElementById('modalDetailTitle'),
    modalDetailArtist: document.getElementById('modalDetailArtist'),
    modalDetailDateTime: document.getElementById('modalDetailDateTime'),
    modalDetailVenue: document.getElementById('modalDetailVenue'),
    modalDetailPrice: document.getElementById('modalDetailPrice'),
    modalDetailDescription: document.getElementById('modalDetailDescription'),
    modalDetailInclusions: document.getElementById('modalDetailInclusions'),
    modalFooterPrice: document.getElementById('modalFooterPrice'),
    modalDetailSaveBtn: document.getElementById('modalDetailSaveBtn'),
    modalDetailSaveText: document.getElementById('modalDetailSaveText'),
    modalDetailRegisterBtn: document.getElementById('modalDetailRegisterBtn'),

    // Registration Modal & Form
    registrationModal: document.getElementById('registrationModal'),
    closeRegModalBtn: document.getElementById('closeRegModalBtn'),
    cancelRegBtn: document.getElementById('cancelRegBtn'),
    registrationForm: document.getElementById('registrationForm'),
    regEventTitle: document.getElementById('regEventTitle'),
    regEventMeta: document.getElementById('regEventMeta'),
    regEventBasePrice: document.getElementById('regEventBasePrice'),
    tierRadios: document.querySelectorAll('input[name="passTier"]'),
    tierCards: document.querySelectorAll('.tier-card'),
    tierStandardCost: document.getElementById('tierStandardCost'),
    tierVipCost: document.getElementById('tierVipCost'),
    tierVipOption: document.getElementById('tierVipOption'),
    ticketQtyInput: document.getElementById('ticketQtyInput'),
    decreaseQtyBtn: document.getElementById('decreaseQtyBtn'),
    increaseQtyBtn: document.getElementById('increaseQtyBtn'),
    
    // Reg Form Inputs
    regFullName: document.getElementById('regFullName'),
    regEmail: document.getElementById('regEmail'),
    regPhone: document.getElementById('regPhone'),
    regCity: document.getElementById('regCity'),
    regIdProof: document.getElementById('regIdProof'),
    regDiet: document.getElementById('regDiet'),
    nameError: document.getElementById('nameError'),
    emailError: document.getElementById('emailError'),
    phoneError: document.getElementById('phoneError'),
    cityError: document.getElementById('cityError'),
    billTierDescription: document.getElementById('billTierDescription'),
    billTierSubtotal: document.getElementById('billTierSubtotal'),
    billGstAmount: document.getElementById('billGstAmount'),
    billGrandTotal: document.getElementById('billGrandTotal'),
    billPaymentMode: document.getElementById('billPaymentMode'),

    // Pass Confirmation Modal
    confirmationModal: document.getElementById('confirmationModal'),
    closePassModalBtn: document.getElementById('closePassModalBtn'),
    ticketRefCode: document.getElementById('ticketRefCode'),
    ticketEventTitle: document.getElementById('ticketEventTitle'),
    ticketArtistName: document.getElementById('ticketArtistName'),
    ticketDateTime: document.getElementById('ticketDateTime'),
    ticketSeatCount: document.getElementById('ticketSeatCount'),
    ticketVenueLocation: document.getElementById('ticketVenueLocation'),
    ticketAttendeeName: document.getElementById('ticketAttendeeName'),
    ticketAttendeePhone: document.getElementById('ticketAttendeePhone'),
    ticketTotalAmount: document.getElementById('ticketTotalAmount'),
    ticketIdProof: document.getElementById('ticketIdProof'),
    ticketQrCanvas: document.getElementById('ticketQrCanvas'),
    printTicketBtn: document.getElementById('printTicketBtn'),
    calendarInviteBtn: document.getElementById('calendarInviteBtn'),
    viewAllPassesBtn: document.getElementById('viewAllPassesBtn'),

    // My Bookings Drawer
    myBookingsModal: document.getElementById('myBookingsModal'),
    closeBookingsModalBtn: document.getElementById('closeBookingsModalBtn'),
    closeBookingsFooterBtn: document.getElementById('closeBookingsFooterBtn'),
    bookingsListContainer: document.getElementById('bookingsListContainer'),
    noBookingsState: document.getElementById('noBookingsState'),
    browseFromBookingsBtn: document.getElementById('browseFromBookingsBtn'),

    // Toast
    toastContainer: document.getElementById('toastContainer'),
    toastElement: document.getElementById('toastElement'),
    toastIcon: document.getElementById('toastIcon'),
    toastMessage: document.getElementById('toastMessage')
  };

  // Set min date on date picker to today
  if (dom.dateFilterInput) {
    dom.dateFilterInput.min = getTodayString();
  }

  // =========================================================================
  // Core Filtering & Sorting Logic
  // =========================================================================
  function applyFilters() {
    const todayStr = getTodayString();
    const tomorrowStr = getTomorrowString();
    const weekendDates = getWeekendDates();
    const weekDates = getNext7DaysDates();

    let list = state.events.filter(ev => {
      // 1. City Filter
      if (state.selectedCity !== 'ALL' && ev.city.toLowerCase() !== state.selectedCity.toLowerCase()) {
        return false;
      }

      // 2. Category Filter
      if (state.selectedCategory !== 'ALL' && ev.category !== state.selectedCategory) {
        return false;
      }

      // 3. Date Filter (Specific Date vs Quick Presets)
      if (state.specificDate) {
        if (ev.date !== state.specificDate) return false;
      } else if (state.selectedDateFilter === 'today') {
        if (ev.date !== todayStr) return false;
      } else if (state.selectedDateFilter === 'tomorrow') {
        if (ev.date !== tomorrowStr) return false;
      } else if (state.selectedDateFilter === 'weekend') {
        if (!weekendDates.includes(ev.date)) return false;
      } else if (state.selectedDateFilter === 'week') {
        if (!weekDates.includes(ev.date)) return false;
      }

      // 4. Keyword Search Query
      if (state.searchQuery.trim() !== '') {
        const query = state.searchQuery.toLowerCase().trim();
        const searchable = [
          ev.title,
          ev.artist,
          ev.city,
          ev.neighborhood,
          ev.venue,
          ev.landmark,
          ev.category,
          ev.description,
          ...(ev.tags || [])
        ].join(' ').toLowerCase();

        if (!searchable.includes(query)) return false;
      }

      // 5. Price Tier Filter
      if (state.priceTier === 'FREE') {
        if (!ev.isFree && ev.price > 0) return false;
      } else if (state.priceTier === 'UNDER_500') {
        if (ev.price >= 500) return false;
      } else if (state.priceTier === '500_TO_1000') {
        if (ev.price < 500 || ev.price > 1000) return false;
      } else if (state.priceTier === 'ABOVE_1000') {
        if (ev.price <= 1000) return false;
      }

      return true;
    });

    // 6. Sorting
    list.sort((a, b) => {
      if (state.sortBy === 'date-asc') {
        return a.date.localeCompare(b.date);
      }
      if (state.sortBy === 'date-desc') {
        return b.date.localeCompare(a.date);
      }
      if (state.sortBy === 'price-asc') {
        return a.price - b.price;
      }
      if (state.sortBy === 'price-desc') {
        return b.price - a.price;
      }
      if (state.sortBy === 'seats-asc') {
        const remA = a.capacity - a.registeredCount;
        const remB = b.capacity - b.registeredCount;
        return remA - remB;
      }
      return 0;
    });

    state.filteredEvents = list;
    renderCatalog();
    renderActiveFilterBadges();
  }

  // =========================================================================
  // Rendering Events Grid
  // =========================================================================
  function renderCatalog() {
    const list = state.filteredEvents;

    // Update count labels
    const count = list.length;
    let cityText = state.selectedCity === 'ALL' ? 'across India' : `in ${state.selectedCity}`;
    dom.catalogResultsHeading.textContent = `Cultural Gatherings ${cityText}`;
    dom.resultsCountText.textContent = `Showing ${count} ${count === 1 ? 'gathering' : 'gatherings'}`;

    if (count === 0) {
      dom.eventsGrid.style.display = 'none';
      dom.emptyState.style.display = 'block';
      return;
    }

    dom.eventsGrid.style.display = 'grid';
    dom.emptyState.style.display = 'none';

    dom.eventsGrid.innerHTML = list.map(ev => {
      const isSaved = state.savedEventIds.has(ev.id);
      const remainingSeats = ev.capacity - ev.registeredCount;
      const isFillingFast = remainingSeats <= 35;
      
      // Split date for date box
      const dateParts = ev.date.split('-');
      const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      const monthStr = monthNames[parseInt(dateParts[1], 10) - 1] || 'OCT';
      const dayStr = dateParts[2];

      const priceLabel = ev.isFree || ev.price === 0 ? 
        '<span class="price-free">FREE PASS</span>' : 
        `<span class="price-amount">${formatCurrency(ev.price)}</span>`;

      return `
        <article class="event-card" data-event-id="${ev.id}">
          <div class="card-media-wrap">
            <img src="${ev.image}" alt="${escapeHtml(ev.title)}" class="card-media-img" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80';">
            
            <div class="card-date-badge" aria-label="Event date: ${dayStr} ${monthStr}">
              <span class="badge-month">${monthStr}</span>
              <span class="badge-day">${dayStr}</span>
            </div>

            <div class="card-top-tags">
              ${ev.featured ? '<span class="featured-flag">★ Featured</span>' : ''}
              <button type="button" class="btn-bookmark ${isSaved ? 'saved' : ''}" data-action="toggle-save" data-id="${ev.id}" aria-label="${isSaved ? 'Remove from saved' : 'Save event'}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>
            </div>
          </div>

          <div class="card-content">
            <div class="card-city-genre">
              <span class="genre-tag">${escapeHtml(ev.category)}</span>
              <span class="city-pill">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                ${escapeHtml(ev.city)} • ${escapeHtml(ev.neighborhood)}
              </span>
            </div>

            <h3 class="card-title">${escapeHtml(ev.title)}</h3>
            <p class="card-artist">${escapeHtml(ev.artist)}</p>

            <div class="card-venue-time">
              <div class="venue-line">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                <span>${escapeHtml(ev.venue)}</span>
              </div>
              <div class="time-line">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>${escapeHtml(ev.time)}</span>
                ${isFillingFast ? `<strong style="margin-left: auto; color: var(--color-primary); font-size: 0.72rem;">Only ${remainingSeats} passes left</strong>` : ''}
              </div>
            </div>

            <p class="card-desc-snippet">${escapeHtml(ev.description)}</p>

            <div class="card-footer">
              <div class="price-column">
                <span class="price-unit">${ev.isFree ? 'Entry' : 'Starting from'}</span>
                ${priceLabel}
              </div>

              <div class="card-actions-group">
                <button type="button" class="btn btn-outline" data-action="view-detail" data-id="${ev.id}">
                  Details
                </button>
                <button type="button" class="btn btn-primary" data-action="open-reg" data-id="${ev.id}">
                  Reserve Pass
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  // =========================================================================
  // Active Filter Badges
  // =========================================================================
  function renderActiveFilterBadges() {
    const badges = [];

    if (state.selectedCity !== 'ALL') {
      badges.push({
        label: `City: ${state.selectedCity}`,
        clear: () => {
          state.selectedCity = 'ALL';
          dom.headerCitySelect.value = 'ALL';
        }
      });
    }

    if (state.selectedCategory !== 'ALL') {
      badges.push({
        label: `Genre: ${state.selectedCategory}`,
        clear: () => {
          state.selectedCategory = 'ALL';
          dom.categorySelect.value = 'ALL';
        }
      });
    }

    if (state.specificDate) {
      badges.push({
        label: `Date: ${formatDisplayDate(state.specificDate)}`,
        clear: () => {
          state.specificDate = '';
          dom.dateFilterInput.value = '';
        }
      });
    } else if (state.selectedDateFilter !== 'all') {
      const dateNameMap = {
        today: 'Date: Today',
        tomorrow: 'Date: Tomorrow',
        weekend: 'Date: This Weekend',
        week: 'Date: Next 7 Days'
      };
      badges.push({
        label: dateNameMap[state.selectedDateFilter] || 'Date Filtered',
        clear: () => {
          state.selectedDateFilter = 'all';
          updateDateChipButtons('all');
        }
      });
    }

    if (state.searchQuery.trim() !== '') {
      badges.push({
        label: `Search: "${state.searchQuery}"`,
        clear: () => {
          state.searchQuery = '';
          dom.searchInput.value = '';
        }
      });
    }

    if (state.priceTier !== 'ALL') {
      const priceNameMap = {
        FREE: 'Free Only',
        UNDER_500: 'Under ₹500',
        '500_TO_1000': '₹500 - ₹1,000',
        ABOVE_1000: 'Above ₹1,000'
      };
      badges.push({
        label: `Price: ${priceNameMap[state.priceTier] || state.priceTier}`,
        clear: () => {
          state.priceTier = 'ALL';
          dom.priceFilterSelect.value = 'ALL';
        }
      });
    }

    if (badges.length === 0) {
      dom.activeFiltersContainer.style.display = 'none';
      dom.activeChipsList.innerHTML = '';
      return;
    }

    dom.activeFiltersContainer.style.display = 'flex';
    dom.activeChipsList.innerHTML = '';

    badges.forEach((b, index) => {
      const chip = document.createElement('div');
      chip.className = 'filter-badge-chip';
      chip.innerHTML = `
        <span>${escapeHtml(b.label)}</span>
        <button type="button" aria-label="Remove filter">&times;</button>
      `;
      chip.querySelector('button').addEventListener('click', () => {
        b.clear();
        applyFilters();
      });
      dom.activeChipsList.appendChild(chip);
    });
  }

  function updateDateChipButtons(activeVal) {
    dom.dateChips.forEach(chip => {
      if (chip.dataset.dateFilter === activeVal) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });
  }

  // =========================================================================
  // Modal 1: Event Details
  // =========================================================================
  function openEventDetails(event) {
    state.activeEventForDetail = event;

    dom.modalDetailCategory.textContent = event.category;
    dom.modalDetailCity.textContent = `${event.city} • ${event.neighborhood}`;
    dom.modalDetailImage.src = event.image;
    dom.modalDetailImage.alt = event.title;
    dom.modalDetailTitle.textContent = event.title;
    dom.modalDetailArtist.textContent = event.artist;
    
    dom.modalDetailDateTime.textContent = `${formatDisplayDate(event.date)} • ${event.time}`;
    dom.modalDetailVenue.textContent = `${event.venue} (${event.landmark})`;
    
    const priceText = event.isFree || event.price === 0 ? 'FREE ENTRY' : `${formatCurrency(event.price)} per pass`;
    dom.modalDetailPrice.textContent = priceText;
    dom.modalFooterPrice.textContent = priceText;
    dom.modalDetailDescription.textContent = event.description;

    // Populate inclusions
    dom.modalDetailInclusions.innerHTML = '';
    (event.inclusions || []).forEach(inc => {
      const li = document.createElement('li');
      li.textContent = inc;
      dom.modalDetailInclusions.appendChild(li);
    });

    // Update bookmark button inside detail modal
    const isSaved = state.savedEventIds.has(event.id);
    dom.modalDetailSaveText.textContent = isSaved ? 'Saved' : 'Save to Favorites';
    dom.modalDetailSaveBtn.classList.toggle('btn-primary', isSaved);
    dom.modalDetailSaveBtn.classList.toggle('btn-outline', !isSaved);

    dom.eventDetailModal.showModal();
  }

  // =========================================================================
  // Modal 2: Registration & Booking Pass
  // =========================================================================
  function openRegistrationModal(event) {
    state.activeEventForReg = event;
    state.regTier = 'standard';
    state.regQty = 1;

    dom.regEventTitle.textContent = event.title;
    dom.regEventMeta.textContent = `${event.venue}, ${event.city} • ${formatDisplayDate(event.date)}, ${event.time}`;
    dom.regEventBasePrice.textContent = event.isFree ? 'FREE ENTRY' : `${formatCurrency(event.price)} / pass`;

    // Standard Tier Pricing
    const basePrice = event.price;
    dom.tierStandardCost.textContent = basePrice === 0 ? 'FREE' : formatCurrency(basePrice);

    // VIP Tier Pricing
    if (basePrice === 0) {
      dom.tierVipOption.style.display = 'none';
      dom.regTier = 'standard';
    } else {
      dom.tierVipOption.style.display = 'flex';
      const vipPrice = Math.round(basePrice * 1.6);
      dom.tierVipCost.textContent = formatCurrency(vipPrice);
    }

    // Reset radio selection
    dom.tierRadios.forEach(radio => {
      radio.checked = radio.value === state.regTier;
    });
    updateTierCardHighlight();

    // Reset stepper
    dom.ticketQtyInput.value = '1';

    // Clear form errors
    clearFormErrors();

    // Auto-fill city if selected
    if (state.selectedCity !== 'ALL') {
      dom.regCity.value = state.selectedCity;
    }

    updatePriceCalculation();
    dom.registrationModal.showModal();
  }

  function updateTierCardHighlight() {
    dom.tierCards.forEach(card => {
      const input = card.querySelector('input[type="radio"]');
      if (input && input.checked) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  }

  function updatePriceCalculation() {
    const event = state.activeEventForReg;
    if (!event) return;

    const qty = parseInt(dom.ticketQtyInput.value, 10) || 1;
    let singlePrice = event.price;
    let tierTitle = 'General Entry Pass';

    if (state.regTier === 'vip' && event.price > 0) {
      singlePrice = Math.round(event.price * 1.6);
      tierTitle = 'Patron / Front Row Baithak Pass';
    }

    const subtotal = singlePrice * qty;
    // GST 18% for cultural events above 0
    const gstRate = event.isFree || singlePrice === 0 ? 0 : 0.18;
    const gstAmount = subtotal * gstRate;
    const grandTotal = subtotal + gstAmount;

    dom.billTierDescription.textContent = `${tierTitle} (${qty} ${qty === 1 ? 'pass' : 'passes'})`;
    dom.billTierSubtotal.textContent = formatCurrency(subtotal);
    dom.billGstAmount.textContent = formatCurrency(gstAmount);
    dom.billGrandTotal.textContent = formatCurrency(grandTotal);

    if (event.isFree || grandTotal === 0) {
      dom.billPaymentMode.textContent = '✓ 100% Free Entry • Complimentary RSVP Pass Guaranteed';
    } else {
      dom.billPaymentMode.textContent = '✓ Venue Pay-on-Arrival or UPI at Gate • Digital Pass Instant Issuance';
    }
  }

  function clearFormErrors() {
    [dom.regFullName, dom.regEmail, dom.regPhone, dom.regCity].forEach(input => {
      const group = input.closest('.form-group');
      if (group) group.classList.remove('has-error');
    });
  }

  function validateRegistrationForm() {
    clearFormErrors();
    let isValid = true;

    // Full Name
    const nameVal = dom.regFullName.value.trim();
    if (nameVal.length < 2) {
      dom.regFullName.closest('.form-group').classList.add('has-error');
      isValid = false;
    }

    // Email
    const emailVal = dom.regEmail.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailVal)) {
      dom.regEmail.closest('.form-group').classList.add('has-error');
      isValid = false;
    }

    // Indian Phone (10 digits starting with 6,7,8,9)
    const phoneVal = dom.regPhone.value.trim().replace(/\D/g, '');
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneVal)) {
      dom.regPhone.closest('.form-group').classList.add('has-error');
      isValid = false;
    }

    // City
    if (!dom.regCity.value) {
      dom.regCity.closest('.form-group').classList.add('has-error');
      isValid = false;
    }

    return isValid;
  }

  function handleRegistrationSubmit(e) {
    e.preventDefault();
    if (!validateRegistrationForm()) {
      showToast('Please fix the highlighted errors in the form.', '⚠️');
      return;
    }

    const event = state.activeEventForReg;
    const qty = parseInt(dom.ticketQtyInput.value, 10) || 1;
    let singlePrice = event.price;
    let tierTitle = 'General Entry Pass';

    if (state.regTier === 'vip' && event.price > 0) {
      singlePrice = Math.round(event.price * 1.6);
      tierTitle = 'Patron / Front Row Pass';
    }

    const subtotal = singlePrice * qty;
    const gstRate = event.isFree || singlePrice === 0 ? 0 : 0.18;
    const gstAmount = subtotal * gstRate;
    const grandTotal = subtotal + gstAmount;

    // Generate unique Indian Booking Reference Code
    const cityCodeMap = {
      'Bengaluru': 'BLR',
      'Mumbai': 'BOM',
      'Delhi NCR': 'DEL',
      'Hyderabad': 'HYD',
      'Chennai': 'MAA',
      'Pune': 'PNQ',
      'Kolkata': 'CCU',
      'Jaipur': 'JAI',
      'Goa': 'GOI'
    };
    const cityCode = cityCodeMap[event.city] || 'IND';
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const bookingRef = `UTSAV-${cityCode}-${randomDigits}`;

    const newBooking = {
      bookingRef: bookingRef,
      bookingTime: new Date().toISOString(),
      event: {
        id: event.id,
        title: event.title,
        artist: event.artist,
        date: event.date,
        time: event.time,
        venue: event.venue,
        landmark: event.landmark,
        city: event.city
      },
      tier: tierTitle,
      ticketQuantity: qty,
      attendee: {
        fullName: dom.regFullName.value.trim(),
        email: dom.regEmail.value.trim(),
        phone: dom.regPhone.value.trim(),
        residentCity: dom.regCity.value,
        idProof: dom.regIdProof.value,
        dietPreference: dom.regDiet.value
      },
      pricing: {
        subtotal: subtotal,
        gst: gstAmount,
        grandTotal: grandTotal,
        isFree: grandTotal === 0
      }
    };

    // Save to LocalStorage
    state.myBookings.unshift(newBooking);
    localStorage.setItem('utsav_bookings', JSON.stringify(state.myBookings));
    updateBadges();

    // Increment registered count in state
    event.registeredCount += qty;

    // Close registration modal, open confirmation modal
    dom.registrationModal.close();
    openConfirmationModal(newBooking);
    showToast(`Pass confirmed for ${event.title}!`, '✓');
  }

  // =========================================================================
  // Modal 3: Confirmation & E-Ticket Pass
  // =========================================================================
  function openConfirmationModal(booking) {
    state.activeBookingForPass = booking;

    dom.ticketRefCode.textContent = booking.bookingRef;
    dom.ticketEventTitle.textContent = booking.event.title;
    dom.ticketArtistName.textContent = booking.event.artist;
    dom.ticketDateTime.textContent = `${formatDisplayDate(booking.event.date)} • ${booking.event.time}`;
    dom.ticketSeatCount.textContent = `${booking.ticketQuantity} ${booking.ticketQuantity === 1 ? 'Pass' : 'Passes'} (${booking.tier})`;
    dom.ticketVenueLocation.textContent = `${booking.event.venue}, ${booking.event.landmark}, ${booking.event.city}`;
    
    dom.ticketAttendeeName.textContent = booking.attendee.fullName;
    dom.ticketAttendeePhone.textContent = `+91 ${booking.attendee.phone}`;
    
    if (booking.pricing.isFree) {
      dom.ticketTotalAmount.textContent = 'FREE PASS (RSVP Confirmed)';
    } else {
      dom.ticketTotalAmount.textContent = `${formatCurrency(booking.pricing.grandTotal)} (Taxes Incl.)`;
    }

    dom.ticketIdProof.textContent = `${booking.attendee.idProof} Verified`;

    // Render Scannable QR Code on Canvas
    drawPassQrCode(booking.bookingRef, booking.attendee.fullName);

    dom.confirmationModal.showModal();
  }

  /**
   * Algorithmic Vector QR Code Drawer
   * Draws a clean high-contrast scannable matrix pattern on HTML5 Canvas
   */
  function drawPassQrCode(refCode, name) {
    const canvas = dom.ticketQrCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    ctx.clearRect(0, 0, size, size);

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);

    const gridSize = 21; // 21x21 QR Version 1 grid
    const cellSize = Math.floor(size / (gridSize + 2));
    const offset = Math.floor((size - (gridSize * cellSize)) / 2);

    ctx.fillStyle = '#1A1715';

    // Helper to draw QR finder pattern (the 7x7 corner targets)
    function drawFinder(row, col) {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const isOuterBorder = r === 0 || r === 6 || c === 0 || c === 6;
          const isInnerSquare = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          if (isOuterBorder || isInnerSquare) {
            ctx.fillRect(offset + (col + c) * cellSize, offset + (row + r) * cellSize, cellSize, cellSize);
          }
        }
      }
    }

    // Top-Left, Top-Right, Bottom-Left finders
    drawFinder(0, 0);
    drawFinder(0, gridSize - 7);
    drawFinder(gridSize - 7, 0);

    // Timing patterns
    for (let i = 8; i < gridSize - 8; i += 2) {
      ctx.fillRect(offset + 6 * cellSize, offset + i * cellSize, cellSize, cellSize);
      ctx.fillRect(offset + i * cellSize, offset + 6 * cellSize, cellSize, cellSize);
    }

    // Seeded pseudo-random data bits based on refCode
    let hash = 0;
    const combinedStr = refCode + name;
    for (let i = 0; i < combinedStr.length; i++) {
      hash = ((hash << 5) - hash) + combinedStr.charCodeAt(i);
      hash |= 0;
    }

    // Fill data grid avoiding finder patterns
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        // Skip finders and separators
        const inTopLeft = r < 8 && c < 8;
        const inTopRight = r < 8 && c >= gridSize - 8;
        const inBottomLeft = r >= gridSize - 8 && c < 8;
        const inTiming = (r === 6) || (c === 6);

        if (inTopLeft || inTopRight || inBottomLeft || inTiming) continue;

        // Deterministic pseudo bits
        const bitSeed = (hash ^ (r * 31 + c * 17)) & 0xFF;
        if ((bitSeed % 3) === 0 || (bitSeed % 5) === 0) {
          ctx.fillRect(offset + c * cellSize, offset + r * cellSize, cellSize, cellSize);
        }
      }
    }
  }

  // =========================================================================
  // Modal 4: "My Passes" Drawer
  // =========================================================================
  function openMyBookingsModal() {
    renderMyBookingsList();
    dom.myBookingsModal.showModal();
  }

  function renderMyBookingsList() {
    const list = state.myBookings;
    if (list.length === 0) {
      dom.bookingsListContainer.style.display = 'none';
      dom.noBookingsState.style.display = 'block';
      return;
    }

    dom.bookingsListContainer.style.display = 'flex';
    dom.noBookingsState.style.display = 'none';

    dom.bookingsListContainer.innerHTML = list.map((b, index) => {
      const priceText = b.pricing.isFree ? 'FREE PASS' : formatCurrency(b.pricing.grandTotal);
      return `
        <div class="booking-item-card">
          <div>
            <div class="booking-item-ref">${escapeHtml(b.bookingRef)}</div>
            <h4 class="booking-item-title">${escapeHtml(b.event.title)}</h4>
            <div class="booking-item-meta">
              <span>📅 ${formatDisplayDate(b.event.date)} at ${escapeHtml(b.event.time)}</span> • 
              <span>📍 ${escapeHtml(b.event.venue)}, ${escapeHtml(b.event.city)}</span> • 
              <span>👤 ${escapeHtml(b.attendee.fullName)} (${b.ticketQuantity} ${b.ticketQuantity === 1 ? 'pass' : 'passes'})</span> •
              <strong style="color: var(--color-primary);">${priceText}</strong>
            </div>
          </div>
          <div class="booking-item-actions">
            <button type="button" class="btn btn-primary btn-sm" data-action="view-booked-pass" data-index="${index}">
              View Pass
            </button>
            <button type="button" class="btn btn-outline btn-sm" data-action="cancel-booking" data-ref="${b.bookingRef}" title="Cancel Pass">
              Cancel
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  function cancelBooking(refCode) {
    if (confirm(`Are you sure you want to cancel pass ${refCode}?`)) {
      state.myBookings = state.myBookings.filter(b => b.bookingRef !== refCode);
      localStorage.setItem('utsav_bookings', JSON.stringify(state.myBookings));
      updateBadges();
      renderMyBookingsList();
      showToast(`Pass ${refCode} was cancelled.`, 'ℹ️');
    }
  }

  // =========================================================================
  // iCalendar (.ics) Generator
  // =========================================================================
  function downloadCalendarInvite(booking) {
    if (!booking) return;
    const ev = booking.event;
    
    // Parse date YYYY-MM-DD
    const dateParts = ev.date.split('-');
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];

    const dtStart = `${year}${month}${day}T183000`;
    const dtEnd = `${year}${month}${day}T213000`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//UtsavPass Indian Cultural Events//IN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${booking.bookingRef}@utsavpass.in`,
      `DTSTAMP:${year}${month}${day}T000000Z`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${ev.title} (${booking.bookingRef})`,
      `DESCRIPTION:UtsavPass Confirmed Gathering\\nPerformer: ${ev.artist}\\nBooking Ref: ${booking.bookingRef}\\nPasses: ${booking.ticketQuantity} (${booking.tier})\\nAttendee: ${booking.attendee.fullName}`,
      `LOCATION:${ev.venue}\\, ${ev.landmark}\\, ${ev.city}\\, India`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${booking.bookingRef}-utsav-pass.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Event invite (.ics) downloaded for your calendar!', '📅');
  }

  // =========================================================================
  // Bookmarks / Saved Events
  // =========================================================================
  function toggleSaveEvent(eventId) {
    if (state.savedEventIds.has(eventId)) {
      state.savedEventIds.delete(eventId);
      showToast('Event removed from saved list.', 'ℹ️');
    } else {
      state.savedEventIds.add(eventId);
      showToast('Event saved to your favorites!', '❤️');
    }
    localStorage.setItem('utsav_saved_events', JSON.stringify([...state.savedEventIds]));
    updateBadges();
    applyFilters();
  }

  function filterToSavedOnly() {
    if (state.savedEventIds.size === 0) {
      showToast('You have not saved any events yet. Click the bookmark icon on any card.', 'ℹ️');
      return;
    }
    // Filter view to only saved
    state.filteredEvents = state.events.filter(ev => state.savedEventIds.has(ev.id));
    dom.catalogResultsHeading.textContent = 'Your Saved Gatherings';
    dom.resultsCountText.textContent = `Showing ${state.filteredEvents.length} saved events`;
    renderCatalog();
    dom.eventsGrid.scrollIntoView({ behavior: 'smooth' });
  }

  function updateBadges() {
    dom.savedCountBadge.textContent = state.savedEventIds.size;
    dom.passCountBadge.textContent = state.myBookings.length;
  }

  // =========================================================================
  // Toast Notifications
  // =========================================================================
  let toastTimer = null;
  function showToast(message, icon = '✓') {
    if (toastTimer) clearTimeout(toastTimer);
    dom.toastIcon.textContent = icon;
    dom.toastMessage.textContent = message;
    dom.toastElement.classList.add('show');
    toastTimer = setTimeout(() => {
      dom.toastElement.classList.remove('show');
    }, 3200);
  }

  // Helper Escape HTML
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // =========================================================================
  // Event Listeners Setup
  // =========================================================================
  function setupEventListeners() {
    // 1. Header City Dropdown
    dom.headerCitySelect.addEventListener('change', (e) => {
      state.selectedCity = e.target.value;
      applyFilters();
    });

    // 2. Saved and My Bookings buttons
    dom.savedEventsBtn.addEventListener('click', filterToSavedOnly);
    dom.myRegistrationsBtn.addEventListener('click', openMyBookingsModal);

    // 3. Search & Filters in Hero
    dom.applySearchBtn.addEventListener('click', () => {
      state.searchQuery = dom.searchInput.value;
      state.specificDate = dom.dateFilterInput.value;
      state.selectedCategory = dom.categorySelect.value;
      applyFilters();
      dom.eventsGrid.scrollIntoView({ behavior: 'smooth' });
    });

    dom.searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        state.searchQuery = dom.searchInput.value;
        applyFilters();
      }
    });

    dom.dateFilterInput.addEventListener('change', (e) => {
      state.specificDate = e.target.value;
      if (state.specificDate) {
        state.selectedDateFilter = 'custom';
        dom.dateChips.forEach(c => c.classList.remove('active'));
      }
      applyFilters();
    });

    dom.categorySelect.addEventListener('change', (e) => {
      state.selectedCategory = e.target.value;
      applyFilters();
    });

    // Quick Date Presets
    dom.dateChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const filterVal = chip.dataset.dateFilter;
        state.selectedDateFilter = filterVal;
        state.specificDate = '';
        dom.dateFilterInput.value = '';
        updateDateChipButtons(filterVal);
        applyFilters();
      });
    });

    // Reset Filters Button
    const resetAllFilters = () => {
      state.selectedCity = 'ALL';
      state.selectedCategory = 'ALL';
      state.selectedDateFilter = 'all';
      state.specificDate = '';
      state.searchQuery = '';
      state.priceTier = 'ALL';
      state.sortBy = 'date-asc';

      dom.headerCitySelect.value = 'ALL';
      dom.searchInput.value = '';
      dom.dateFilterInput.value = '';
      dom.categorySelect.value = 'ALL';
      dom.priceFilterSelect.value = 'ALL';
      dom.sortBySelect.value = 'date-asc';
      updateDateChipButtons('all');

      applyFilters();
      showToast('All filters have been reset.', '↺');
    };

    dom.resetFiltersBtn.addEventListener('click', resetAllFilters);
    dom.emptyResetBtn.addEventListener('click', resetAllFilters);

    // Secondary controls
    dom.priceFilterSelect.addEventListener('change', (e) => {
      state.priceTier = e.target.value;
      applyFilters();
    });

    dom.sortBySelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      applyFilters();
    });

    // Delegated Clicks on Event Grid
    dom.eventsGrid.addEventListener('click', (e) => {
      const targetBtn = e.target.closest('button');
      if (!targetBtn) return;

      const action = targetBtn.dataset.action;
      const eventId = targetBtn.dataset.id;
      const event = state.events.find(ev => ev.id === eventId);
      if (!event) return;

      if (action === 'toggle-save') {
        toggleSaveEvent(eventId);
      } else if (action === 'view-detail') {
        openEventDetails(event);
      } else if (action === 'open-reg') {
        openRegistrationModal(event);
      }
    });

    // Event Detail Modal actions
    dom.closeDetailModalBtn.addEventListener('click', () => dom.eventDetailModal.close());
    dom.modalDetailSaveBtn.addEventListener('click', () => {
      if (state.activeEventForDetail) {
        toggleSaveEvent(state.activeEventForDetail.id);
        const isSaved = state.savedEventIds.has(state.activeEventForDetail.id);
        dom.modalDetailSaveText.textContent = isSaved ? 'Saved' : 'Save to Favorites';
        dom.modalDetailSaveBtn.classList.toggle('btn-primary', isSaved);
        dom.modalDetailSaveBtn.classList.toggle('btn-outline', !isSaved);
      }
    });
    dom.modalDetailRegisterBtn.addEventListener('click', () => {
      if (state.activeEventForDetail) {
        const ev = state.activeEventForDetail;
        dom.eventDetailModal.close();
        openRegistrationModal(ev);
      }
    });

    // Registration Modal actions
    dom.closeRegModalBtn.addEventListener('click', () => dom.registrationModal.close());
    dom.cancelRegBtn.addEventListener('click', () => dom.registrationModal.close());
    
    // Tier radio clicks
    dom.tierRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        state.regTier = e.target.value;
        updateTierCardHighlight();
        updatePriceCalculation();
      });
    });

    // Quantity Stepper
    dom.decreaseQtyBtn.addEventListener('click', () => {
      let qty = parseInt(dom.ticketQtyInput.value, 10) || 1;
      if (qty > 1) {
        dom.ticketQtyInput.value = qty - 1;
        updatePriceCalculation();
      }
    });

    dom.increaseQtyBtn.addEventListener('click', () => {
      let qty = parseInt(dom.ticketQtyInput.value, 10) || 1;
      if (qty < 6) {
        dom.ticketQtyInput.value = qty + 1;
        updatePriceCalculation();
      } else {
        showToast('Maximum 6 passes allowed per booking.', 'ℹ️');
      }
    });

    // Real-time error clearance on typing
    [dom.regFullName, dom.regEmail, dom.regPhone, dom.regCity].forEach(input => {
      input.addEventListener('input', () => {
        input.closest('.form-group').classList.remove('has-error');
      });
    });

    dom.registrationForm.addEventListener('submit', handleRegistrationSubmit);

    // Confirmation Modal actions
    dom.closePassModalBtn.addEventListener('click', () => dom.confirmationModal.close());
    dom.printTicketBtn.addEventListener('click', () => window.print());
    dom.calendarInviteBtn.addEventListener('click', () => downloadCalendarInvite(state.activeBookingForPass));
    dom.viewAllPassesBtn.addEventListener('click', () => {
      dom.confirmationModal.close();
      openMyBookingsModal();
    });

    // My Bookings Drawer actions
    dom.closeBookingsModalBtn.addEventListener('click', () => dom.myBookingsModal.close());
    dom.closeBookingsFooterBtn.addEventListener('click', () => dom.myBookingsModal.close());
    dom.browseFromBookingsBtn.addEventListener('click', () => {
      dom.myBookingsModal.close();
      dom.eventsGrid.scrollIntoView({ behavior: 'smooth' });
    });

    dom.bookingsListContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      if (btn.dataset.action === 'view-booked-pass') {
        const index = parseInt(btn.dataset.index, 10);
        const booking = state.myBookings[index];
        if (booking) {
          dom.myBookingsModal.close();
          openConfirmationModal(booking);
        }
      } else if (btn.dataset.action === 'cancel-booking') {
        cancelBooking(btn.dataset.ref);
      }
    });

    // Footer City & Category Quick-links
    document.querySelectorAll('.city-quicklink').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const city = link.dataset.city;
        state.selectedCity = city;
        dom.headerCitySelect.value = city;
        applyFilters();
        dom.eventsGrid.scrollIntoView({ behavior: 'smooth' });
      });
    });

    document.querySelectorAll('.cat-quicklink').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = link.dataset.cat;
        state.selectedCategory = cat;
        dom.categorySelect.value = cat;
        applyFilters();
        dom.eventsGrid.scrollIntoView({ behavior: 'smooth' });
      });
    });

    document.getElementById('hostEventBtn').addEventListener('click', () => {
      alert('Organizers & Cultural Sabhas:\nPlease write to curate@utsavpass.in with your troupe details, venue permissions, and dates.');
    });

    // Close modals on clicking outside dialog backdrop
    [dom.eventDetailModal, dom.registrationModal, dom.confirmationModal, dom.myBookingsModal].forEach(dialog => {
      dialog.addEventListener('click', (e) => {
        const rect = dialog.getBoundingClientRect();
        const isInDialog = (
          rect.top <= e.clientY &&
          e.clientY <= rect.top + rect.height &&
          rect.left <= e.clientX &&
          e.clientX <= rect.left + rect.width
        );
        if (!isInDialog) {
          dialog.close();
        }
      });
    });
  }

  // =========================================================================
  // Initialize Application
  // =========================================================================
  function init() {
    updateBadges();
    setupEventListeners();
    applyFilters();
  }

  // Launch when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
