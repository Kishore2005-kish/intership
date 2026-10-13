/**
 * UtsavPass — My Passes & Saved Gatherings Page Logic (my-passes.html)
 */

(function () {
  'use strict';

  let currentModalBooking = null;

  const dom = {
    tabBtnPasses: document.getElementById('tabBtnPasses'),
    tabBtnSaved: document.getElementById('tabBtnSaved'),
    panePasses: document.getElementById('panePasses'),
    paneSaved: document.getElementById('paneSaved'),
    tabPassesCount: document.getElementById('tabPassesCount'),
    tabSavedCount: document.getElementById('tabSavedCount'),

    passesListContainer: document.getElementById('passesListContainer'),
    noPassesEmptyState: document.getElementById('noPassesEmptyState'),

    savedGridContainer: document.getElementById('savedGridContainer'),
    noSavedEmptyState: document.getElementById('noSavedEmptyState'),

    // Modal
    viewTicketModal: document.getElementById('viewTicketModal'),
    closeTicketModalBtn: document.getElementById('closeTicketModalBtn'),
    closeTicketModalFooterBtn: document.getElementById('closeTicketModalFooterBtn'),
    modalDownloadIcsBtn: document.getElementById('modalDownloadIcsBtn'),

    modalRefCode: document.getElementById('modalRefCode'),
    modalEventTitle: document.getElementById('modalEventTitle'),
    modalArtistName: document.getElementById('modalArtistName'),
    modalDateTime: document.getElementById('modalDateTime'),
    modalSeatsTier: document.getElementById('modalSeatsTier'),
    modalVenue: document.getElementById('modalVenue'),
    modalAttendee: document.getElementById('modalAttendee'),
    modalPhone: document.getElementById('modalPhone'),
    modalAmount: document.getElementById('modalAmount'),
    modalIdProof: document.getElementById('modalIdProof'),
    modalTicketQrCanvas: document.getElementById('modalTicketQrCanvas')
  };

  function switchTab(target) {
    if (target === 'saved') {
      dom.tabBtnSaved.classList.add('active');
      dom.tabBtnPasses.classList.remove('active');
      dom.paneSaved.classList.add('active');
      dom.panePasses.classList.remove('active');
      dom.tabBtnSaved.setAttribute('aria-selected', 'true');
      dom.tabBtnPasses.setAttribute('aria-selected', 'false');
      window.location.hash = 'saved';
    } else {
      dom.tabBtnPasses.classList.add('active');
      dom.tabBtnSaved.classList.remove('active');
      dom.panePasses.classList.add('active');
      dom.paneSaved.classList.remove('active');
      dom.tabBtnPasses.setAttribute('aria-selected', 'true');
      dom.tabBtnSaved.setAttribute('aria-selected', 'false');
      window.location.hash = 'passes';
    }
  }

  function renderPasses() {
    const bookings = Utsav.getBookings();
    dom.tabPassesCount.textContent = bookings.length;

    if (bookings.length === 0) {
      dom.passesListContainer.innerHTML = '';
      dom.noPassesEmptyState.style.display = 'block';
      return;
    }

    dom.noPassesEmptyState.style.display = 'none';

    dom.passesListContainer.innerHTML = bookings.map((b, idx) => {
      const priceText = b.pricing.isFree ? 'FREE PASS' : Utsav.formatCurrency(b.pricing.grandTotal);
      return `
        <article class="my-pass-card">
          <div class="pass-meta-block">
            <span class="pass-code-tag">${Utsav.escapeHtml(b.bookingRef)}</span>
            <h3 class="pass-event-title">${Utsav.escapeHtml(b.event.title)}</h3>
            <div class="pass-details-line">
              <span>📅 ${Utsav.formatDisplayDate(b.event.date)} at ${Utsav.escapeHtml(b.event.time)}</span> • 
              <span>🏛 ${Utsav.escapeHtml(b.event.venue)}, ${Utsav.escapeHtml(b.event.city)}</span>
            </div>
            <div class="pass-details-line" style="margin-top: 0.2rem;">
              <span>👤 ${Utsav.escapeHtml(b.attendee.fullName)} (${b.ticketQuantity} ${b.ticketQuantity === 1 ? 'pass' : 'passes'} - ${Utsav.escapeHtml(b.tier)})</span> • 
              <strong style="color: var(--color-primary);">${priceText}</strong>
            </div>
          </div>

          <div class="pass-actions-block">
            <button type="button" class="btn btn-primary btn-sm" data-action="view-pass" data-index="${idx}">
              View Boarding Pass
            </button>
            <button type="button" class="btn btn-outline btn-sm" data-action="download-ics" data-index="${idx}" title="Download Calendar Invite">
              📅 Add to Calendar
            </button>
            <button type="button" class="btn btn-outline btn-sm" data-action="cancel-pass" data-ref="${b.bookingRef}" title="Cancel Pass">
              Cancel
            </button>
          </div>
        </article>
      `;
    }).join('');
  }

  function renderSaved() {
    const savedIds = Utsav.getSavedEventIds();
    dom.tabSavedCount.textContent = savedIds.size;

    const events = (window.INITIAL_EVENTS || []).filter(ev => savedIds.has(ev.id));

    if (events.length === 0) {
      dom.savedGridContainer.innerHTML = '';
      dom.noSavedEmptyState.style.display = 'block';
      return;
    }

    dom.noSavedEmptyState.style.display = 'none';

    dom.savedGridContainer.innerHTML = events.map(ev => {
      const dateParts = ev.date.split('-');
      const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      const monthStr = monthNames[parseInt(dateParts[1], 10) - 1] || 'OCT';
      const dayStr = dateParts[2];
      const priceText = ev.isFree || ev.price === 0 ? 'FREE ENTRY' : Utsav.formatCurrency(ev.price);

      return `
        <article class="event-card">
          <div class="card-media-wrap">
            <img src="${ev.image}" alt="${Utsav.escapeHtml(ev.title)}" class="card-media-img" loading="lazy">
            <div class="card-date-badge">
              <span class="badge-month">${monthStr}</span>
              <span class="badge-day">${dayStr}</span>
            </div>
            <div class="card-top-tags">
              <button type="button" class="btn-bookmark saved" data-action="remove-saved" data-id="${ev.id}" title="Remove from saved">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>
            </div>
          </div>

          <div class="card-content">
            <div class="card-city-genre">
              <span class="genre-tag">${Utsav.escapeHtml(ev.category)}</span>
              <span class="city-pill">📍 ${Utsav.escapeHtml(ev.city)}</span>
            </div>

            <h3 class="card-title">${Utsav.escapeHtml(ev.title)}</h3>
            <p class="card-artist">${Utsav.escapeHtml(ev.artist)}</p>

            <div class="card-venue-time">
              <div class="venue-line">🏛 <span>${Utsav.escapeHtml(ev.venue)}</span></div>
              <div class="time-line">⏰ <span>${Utsav.escapeHtml(ev.time)}</span></div>
            </div>

            <p class="card-desc-snippet">${Utsav.escapeHtml(ev.description)}</p>

            <div class="card-footer">
              <div class="price-column">
                <span class="price-unit">Price</span>
                <span class="price-amount">${priceText}</span>
              </div>
              <div class="card-actions-group">
                <a href="register.html?id=${ev.id}" class="btn btn-primary">
                  Book Pass Now
                </a>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  function openPassModal(booking) {
    currentModalBooking = booking;

    dom.modalRefCode.textContent = booking.bookingRef;
    dom.modalEventTitle.textContent = booking.event.title;
    dom.modalArtistName.textContent = booking.event.artist;
    dom.modalDateTime.textContent = `${Utsav.formatDisplayDate(booking.event.date)} • ${booking.event.time}`;
    dom.modalSeatsTier.textContent = `${booking.ticketQuantity} ${booking.ticketQuantity === 1 ? 'Pass' : 'Passes'} (${booking.tier})`;
    dom.modalVenue.textContent = `${booking.event.venue}, ${booking.event.landmark}, ${booking.event.city}`;
    dom.modalAttendee.textContent = booking.attendee.fullName;
    dom.modalPhone.textContent = `+91 ${booking.attendee.phone}`;
    
    if (booking.pricing.isFree) {
      dom.modalAmount.textContent = 'FREE PASS (RSVP Confirmed)';
    } else {
      dom.modalAmount.textContent = `${Utsav.formatCurrency(booking.pricing.grandTotal)} (Taxes Incl.)`;
    }

    dom.modalIdProof.textContent = `${booking.attendee.idProof} Verified`;

    Utsav.drawPassQrCode(dom.modalTicketQrCanvas, booking.bookingRef, booking.attendee.fullName);
    dom.viewTicketModal.showModal();
  }

  function cancelBooking(refCode) {
    if (confirm(`Are you sure you want to cancel pass ${refCode}?`)) {
      let bookings = Utsav.getBookings();
      bookings = bookings.filter(b => b.bookingRef !== refCode);
      Utsav.saveBookings(bookings);
      renderPasses();
      Utsav.showToast(`Pass ${refCode} has been cancelled.`, 'ℹ️');
    }
  }

  function setupListeners() {
    dom.tabBtnPasses.addEventListener('click', () => switchTab('passes'));
    dom.tabBtnSaved.addEventListener('click', () => switchTab('saved'));

    dom.passesListContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;

      const action = btn.dataset.action;
      if (action === 'view-pass') {
        const idx = parseInt(btn.dataset.index, 10);
        const booking = Utsav.getBookings()[idx];
        if (booking) openPassModal(booking);
      } else if (action === 'download-ics') {
        const idx = parseInt(btn.dataset.index, 10);
        const booking = Utsav.getBookings()[idx];
        if (booking) Utsav.downloadCalendarInvite(booking);
      } else if (action === 'cancel-pass') {
        cancelBooking(btn.dataset.ref);
      }
    });

    dom.savedGridContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      if (btn.dataset.action === 'remove-saved') {
        Utsav.toggleSavedEvent(btn.dataset.id);
        renderSaved();
      }
    });

    dom.closeTicketModalBtn.addEventListener('click', () => dom.viewTicketModal.close());
    dom.closeTicketModalFooterBtn.addEventListener('click', () => dom.viewTicketModal.close());
    dom.modalDownloadIcsBtn.addEventListener('click', () => {
      if (currentModalBooking) {
        Utsav.downloadCalendarInvite(currentModalBooking);
      }
    });

    dom.viewTicketModal.addEventListener('click', (e) => {
      const rect = dom.viewTicketModal.getBoundingClientRect();
      const inDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!inDialog) dom.viewTicketModal.close();
    });
  }

  function init() {
    renderPasses();
    renderSaved();
    setupListeners();

    if (window.location.hash === '#saved') {
      switchTab('saved');
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
