/**
 * UtsavPass — Events Directory Page Logic (events.html)
 */

(function () {
  'use strict';

  const state = {
    events: window.INITIAL_EVENTS || [],
    filteredEvents: [],
    selectedCity: 'ALL',
    selectedCategory: 'ALL',
    selectedDateFilter: 'all',
    specificDate: '',
    searchQuery: '',
    priceTier: 'ALL',
    sortBy: 'date-asc',
    activeDetailEvent: null
  };

  const dom = {
    searchInput: document.getElementById('searchInput'),
    dateFilterInput: document.getElementById('dateFilterInput'),
    citySelect: document.getElementById('citySelect'),
    categorySelect: document.getElementById('categorySelect'),
    dateChips: document.querySelectorAll('.date-chip'),
    resetFiltersBtn: document.getElementById('resetFiltersBtn'),
    
    catalogResultsHeading: document.getElementById('catalogResultsHeading'),
    resultsCountText: document.getElementById('resultsCountText'),
    priceFilterSelect: document.getElementById('priceFilterSelect'),
    sortBySelect: document.getElementById('sortBySelect'),
    activeFiltersContainer: document.getElementById('activeFiltersContainer'),
    activeChipsList: document.getElementById('activeChipsList'),

    eventsGrid: document.getElementById('eventsGrid'),
    emptyState: document.getElementById('emptyState'),
    emptyResetBtn: document.getElementById('emptyResetBtn'),

    // Modal
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
    modalDetailProceedRegLink: document.getElementById('modalDetailProceedRegLink')
  };

  function parseQueryParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('q')) {
      state.searchQuery = params.get('q');
      dom.searchInput.value = state.searchQuery;
    }
    if (params.has('date')) {
      state.specificDate = params.get('date');
      dom.dateFilterInput.value = state.specificDate;
      state.selectedDateFilter = 'custom';
    }
    if (params.has('dateFilter')) {
      state.selectedDateFilter = params.get('dateFilter');
    }
    if (params.has('city')) {
      state.selectedCity = params.get('city');
      dom.citySelect.value = state.selectedCity;
    }
    if (params.has('category')) {
      state.selectedCategory = params.get('category');
      dom.categorySelect.value = state.selectedCategory;
    }

    updateDateChipButtons(state.selectedDateFilter);
  }

  function applyFilters() {
    const todayStr = Utsav.getTodayString();
    const tomorrowStr = Utsav.getTomorrowString();
    const weekendDates = Utsav.getWeekendDates();
    const weekDates = Utsav.getNext7DaysDates();

    let list = state.events.filter(ev => {
      // 1. City Filter
      if (state.selectedCity !== 'ALL' && ev.city.toLowerCase() !== state.selectedCity.toLowerCase()) {
        return false;
      }

      // 2. Category Filter
      if (state.selectedCategory !== 'ALL' && ev.category !== state.selectedCategory) {
        return false;
      }

      // 3. Date Filter
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

      // 4. Keyword Search
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

      // 5. Price Tier
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
      if (state.sortBy === 'date-asc') return a.date.localeCompare(b.date);
      if (state.sortBy === 'date-desc') return b.date.localeCompare(a.date);
      if (state.sortBy === 'price-asc') return a.price - b.price;
      if (state.sortBy === 'price-desc') return b.price - a.price;
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

  function renderCatalog() {
    const list = state.filteredEvents;
    const count = list.length;
    let cityText = state.selectedCity === 'ALL' ? 'Across India' : `in ${state.selectedCity}`;
    dom.catalogResultsHeading.textContent = `Cultural Gatherings ${cityText}`;
    dom.resultsCountText.textContent = `Showing ${count} ${count === 1 ? 'gathering' : 'gatherings'}`;

    if (count === 0) {
      dom.eventsGrid.style.display = 'none';
      dom.emptyState.style.display = 'block';
      return;
    }

    dom.eventsGrid.style.display = 'grid';
    dom.emptyState.style.display = 'none';

    const savedIds = Utsav.getSavedEventIds();

    dom.eventsGrid.innerHTML = list.map(ev => {
      const isSaved = savedIds.has(ev.id);
      const remainingSeats = ev.capacity - ev.registeredCount;
      const isFillingFast = remainingSeats <= 35;
      
      const dateParts = ev.date.split('-');
      const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      const monthStr = monthNames[parseInt(dateParts[1], 10) - 1] || 'OCT';
      const dayStr = dateParts[2];

      const priceLabel = ev.isFree || ev.price === 0 ? 
        '<span class="price-free">FREE PASS</span>' : 
        `<span class="price-amount">${Utsav.formatCurrency(ev.price)}</span>`;

      return `
        <article class="event-card" data-event-id="${ev.id}">
          <div class="card-media-wrap">
            <img src="${ev.image}" alt="${Utsav.escapeHtml(ev.title)}" class="card-media-img" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80';">
            
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
              <span class="genre-tag">${Utsav.escapeHtml(ev.category)}</span>
              <span class="city-pill">
                📍 ${Utsav.escapeHtml(ev.city)} • ${Utsav.escapeHtml(ev.neighborhood)}
              </span>
            </div>

            <h2 class="card-title">${Utsav.escapeHtml(ev.title)}</h2>
            <p class="card-artist">${Utsav.escapeHtml(ev.artist)}</p>

            <div class="card-venue-time">
              <div class="venue-line">
                🏛 <span>${Utsav.escapeHtml(ev.venue)}</span>
              </div>
              <div class="time-line">
                ⏰ <span>${Utsav.escapeHtml(ev.time)}</span>
                ${isFillingFast ? `<strong style="margin-left: auto; color: var(--color-primary); font-size: 0.72rem;">Only ${remainingSeats} seats left</strong>` : ''}
              </div>
            </div>

            <p class="card-desc-snippet">${Utsav.escapeHtml(ev.description)}</p>

            <div class="card-footer">
              <div class="price-column">
                <span class="price-unit">${ev.isFree ? 'Entry' : 'Starting from'}</span>
                ${priceLabel}
              </div>

              <div class="card-actions-group">
                <button type="button" class="btn btn-outline" data-action="view-detail" data-id="${ev.id}">
                  Details
                </button>
                <a href="register.html?id=${ev.id}" class="btn btn-primary">
                  Reserve Pass
                </a>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  function renderActiveFilterBadges() {
    const badges = [];

    if (state.selectedCity !== 'ALL') {
      badges.push({
        label: `City: ${state.selectedCity}`,
        clear: () => {
          state.selectedCity = 'ALL';
          dom.citySelect.value = 'ALL';
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
        label: `Date: ${Utsav.formatDisplayDate(state.specificDate)}`,
        clear: () => {
          state.specificDate = '';
          dom.dateFilterInput.value = '';
        }
      });
    } else if (state.selectedDateFilter !== 'all') {
      const map = {
        today: 'Date: Today',
        tomorrow: 'Date: Tomorrow',
        weekend: 'Date: This Weekend',
        week: 'Date: Next 7 Days'
      };
      badges.push({
        label: map[state.selectedDateFilter] || 'Date Filter',
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
      const pmap = {
        FREE: 'Free Passes Only',
        UNDER_500: 'Under ₹500',
        '500_TO_1000': '₹500 - ₹1,000',
        ABOVE_1000: 'Above ₹1,000'
      };
      badges.push({
        label: `Price: ${pmap[state.priceTier] || state.priceTier}`,
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

    badges.forEach(b => {
      const chip = document.createElement('div');
      chip.className = 'filter-badge-chip';
      chip.innerHTML = `
        <span>${Utsav.escapeHtml(b.label)}</span>
        <button type="button" aria-label="Remove filter">&times;</button>
      `;
      chip.querySelector('button').addEventListener('click', () => {
        b.clear();
        applyFilters();
      });
      dom.activeChipsList.appendChild(chip);
    });
  }

  function updateDateChipButtons(val) {
    dom.dateChips.forEach(chip => {
      chip.classList.toggle('active', chip.dataset.dateFilter === val);
    });
  }

  function openEventDetails(event) {
    state.activeDetailEvent = event;

    dom.modalDetailCategory.textContent = event.category;
    dom.modalDetailCity.textContent = `${event.city} • ${event.neighborhood}`;
    dom.modalDetailImage.src = event.image;
    dom.modalDetailImage.alt = event.title;
    dom.modalDetailTitle.textContent = event.title;
    dom.modalDetailArtist.textContent = event.artist;
    
    dom.modalDetailDateTime.textContent = `${Utsav.formatDisplayDate(event.date)} • ${event.time}`;
    dom.modalDetailVenue.textContent = `${event.venue} (${event.landmark})`;
    
    const priceText = event.isFree || event.price === 0 ? 'FREE ENTRY' : `${Utsav.formatCurrency(event.price)} per person`;
    dom.modalDetailPrice.textContent = priceText;
    dom.modalFooterPrice.textContent = priceText;
    dom.modalDetailDescription.textContent = event.description;

    dom.modalDetailInclusions.innerHTML = '';
    (event.inclusions || []).forEach(inc => {
      const li = document.createElement('li');
      li.textContent = inc;
      dom.modalDetailInclusions.appendChild(li);
    });

    const isSaved = Utsav.getSavedEventIds().has(event.id);
    dom.modalDetailSaveText.textContent = isSaved ? 'Saved' : 'Save to Favorites';
    dom.modalDetailSaveBtn.classList.toggle('btn-primary', isSaved);
    dom.modalDetailSaveBtn.classList.toggle('btn-outline', !isSaved);

    dom.modalDetailProceedRegLink.href = `register.html?id=${event.id}`;

    dom.eventDetailModal.showModal();
  }

  function setupEventListeners() {
    dom.searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      applyFilters();
    });

    dom.dateFilterInput.addEventListener('change', (e) => {
      state.specificDate = e.target.value;
      if (state.specificDate) {
        state.selectedDateFilter = 'custom';
        dom.dateChips.forEach(c => c.classList.remove('active'));
      }
      applyFilters();
    });

    dom.citySelect.addEventListener('change', (e) => {
      state.selectedCity = e.target.value;
      applyFilters();
    });

    dom.categorySelect.addEventListener('change', (e) => {
      state.selectedCategory = e.target.value;
      applyFilters();
    });

    dom.priceFilterSelect.addEventListener('change', (e) => {
      state.priceTier = e.target.value;
      applyFilters();
    });

    dom.sortBySelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      applyFilters();
    });

    dom.dateChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const val = chip.dataset.dateFilter;
        state.selectedDateFilter = val;
        state.specificDate = '';
        dom.dateFilterInput.value = '';
        updateDateChipButtons(val);
        applyFilters();
      });
    });

    const resetHandler = () => {
      state.selectedCity = 'ALL';
      state.selectedCategory = 'ALL';
      state.selectedDateFilter = 'all';
      state.specificDate = '';
      state.searchQuery = '';
      state.priceTier = 'ALL';
      state.sortBy = 'date-asc';

      dom.citySelect.value = 'ALL';
      dom.categorySelect.value = 'ALL';
      dom.searchInput.value = '';
      dom.dateFilterInput.value = '';
      dom.priceFilterSelect.value = 'ALL';
      dom.sortBySelect.value = 'date-asc';
      updateDateChipButtons('all');

      applyFilters();
      Utsav.showToast('All filters have been reset.', '↺');
    };

    dom.resetFiltersBtn.addEventListener('click', resetHandler);
    dom.emptyResetBtn.addEventListener('click', resetHandler);

    dom.eventsGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;

      const action = btn.dataset.action;
      const id = btn.dataset.id;
      const event = state.events.find(ev => ev.id === id);
      if (!event) return;

      if (action === 'toggle-save') {
        const isSaved = Utsav.toggleSavedEvent(id);
        btn.classList.toggle('saved', isSaved);
        const svg = btn.querySelector('svg');
        if (svg) svg.setAttribute('fill', isSaved ? 'currentColor' : 'none');
      } else if (action === 'view-detail') {
        openEventDetails(event);
      }
    });

    dom.closeDetailModalBtn.addEventListener('click', () => dom.eventDetailModal.close());
    dom.modalDetailSaveBtn.addEventListener('click', () => {
      if (state.activeDetailEvent) {
        const isSaved = Utsav.toggleSavedEvent(state.activeDetailEvent.id);
        dom.modalDetailSaveText.textContent = isSaved ? 'Saved' : 'Save to Favorites';
        dom.modalDetailSaveBtn.classList.toggle('btn-primary', isSaved);
        dom.modalDetailSaveBtn.classList.toggle('btn-outline', !isSaved);
        applyFilters();
      }
    });

    dom.eventDetailModal.addEventListener('click', (e) => {
      const rect = dom.eventDetailModal.getBoundingClientRect();
      const inDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!inDialog) dom.eventDetailModal.close();
    });
  }

  function init() {
    if (dom.dateFilterInput) {
      dom.dateFilterInput.min = Utsav.getTodayString();
    }
    parseQueryParams();
    setupEventListeners();
    applyFilters();

    // Check highlight param to auto-open detail
    const params = new URLSearchParams(window.location.search);
    if (params.has('highlight')) {
      const hlId = params.get('highlight');
      const ev = state.events.find(e => e.id === hlId);
      if (ev) openEventDetails(ev);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
