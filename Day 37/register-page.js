/**
 * UtsavPass — Dedicated Registration & Pass Reservation Page Logic (register.html)
 */

(function () {
  'use strict';

  let selectedEvent = null;
  let activeTier = 'standard';
  let latestBooking = null;

  const dom = {
    form: document.getElementById('dedicatedRegistrationForm'),
    issuedTicketSection: document.getElementById('issuedTicketSection'),
    eventSelectDropdown: document.getElementById('eventSelectDropdown'),
    
    // Preview Card
    eventPreviewImg: document.getElementById('eventPreviewImg'),
    eventPreviewCategory: document.getElementById('eventPreviewCategory'),
    eventPreviewTitle: document.getElementById('eventPreviewTitle'),
    eventPreviewArtist: document.getElementById('eventPreviewArtist'),
    eventPreviewVenue: document.getElementById('eventPreviewVenue'),
    eventPreviewDateTime: document.getElementById('eventPreviewDateTime'),

    // Tiers & Stepper
    tierCards: document.querySelectorAll('.tier-card'),
    tierRadios: document.querySelectorAll('input[name="pagePassTier"]'),
    standardTierCard: document.getElementById('standardTierCard'),
    vipTierCard: document.getElementById('vipTierCard'),
    standardTierCostDisplay: document.getElementById('standardTierCostDisplay'),
    vipTierCostDisplay: document.getElementById('vipTierCostDisplay'),
    pageTicketQty: document.getElementById('pageTicketQty'),
    qtyMinusBtn: document.getElementById('qtyMinusBtn'),
    qtyPlusBtn: document.getElementById('qtyPlusBtn'),

    // Attendee Inputs
    attendeeName: document.getElementById('attendeeName'),
    attendeeEmail: document.getElementById('attendeeEmail'),
    attendeePhone: document.getElementById('attendeePhone'),
    attendeeCity: document.getElementById('attendeeCity'),
    attendeeIdProof: document.getElementById('attendeeIdProof'),
    attendeeDiet: document.getElementById('attendeeDiet'),
    nameErrorMsg: document.getElementById('nameErrorMsg'),
    emailErrorMsg: document.getElementById('emailErrorMsg'),
    phoneErrorMsg: document.getElementById('phoneErrorMsg'),
    cityErrorMsg: document.getElementById('cityErrorMsg'),

    // Billing Summary
    summaryTierLabel: document.getElementById('summaryTierLabel'),
    summarySubtotalAmount: document.getElementById('summarySubtotalAmount'),
    summaryGstAmount: document.getElementById('summaryGstAmount'),
    summaryGrandTotal: document.getElementById('summaryGrandTotal'),
    summaryPaymentNote: document.getElementById('summaryPaymentNote'),

    // Issued Pass Elements
    passRefCode: document.getElementById('passRefCode'),
    passEventTitle: document.getElementById('passEventTitle'),
    passArtistName: document.getElementById('passArtistName'),
    passDateTime: document.getElementById('passDateTime'),
    passSeatsTier: document.getElementById('passSeatsTier'),
    passVenue: document.getElementById('passVenue'),
    passAttendee: document.getElementById('passAttendee'),
    passPhone: document.getElementById('passPhone'),
    passAmount: document.getElementById('passAmount'),
    passIdProof: document.getElementById('passIdProof'),
    pageTicketQrCanvas: document.getElementById('pageTicketQrCanvas'),
    downloadIcsBtn: document.getElementById('downloadIcsBtn'),
    bookAnotherBtn: document.getElementById('bookAnotherBtn')
  };

  function initEventSelector() {
    const events = window.INITIAL_EVENTS || [];
    dom.eventSelectDropdown.innerHTML = events.map(ev => {
      const priceText = ev.isFree || ev.price === 0 ? 'Free Entry' : `₹${ev.price}`;
      return `<option value="${ev.id}">${ev.title} — ${ev.city} (${priceText})</option>`;
    }).join('');

    // Check URL params for ?id=
    const params = new URLSearchParams(window.location.search);
    const requestedId = params.get('id');
    const matchedEvent = events.find(e => e.id === requestedId);

    if (matchedEvent) {
      dom.eventSelectDropdown.value = matchedEvent.id;
      setEvent(matchedEvent);
    } else if (events.length > 0) {
      setEvent(events[0]);
    }

    dom.eventSelectDropdown.addEventListener('change', (e) => {
      const ev = events.find(item => item.id === e.target.value);
      if (ev) setEvent(ev);
    });
  }

  function setEvent(ev) {
    selectedEvent = ev;

    // Update preview banner
    dom.eventPreviewImg.src = ev.image;
    dom.eventPreviewImg.alt = ev.title;
    dom.eventPreviewCategory.textContent = ev.category;
    dom.eventPreviewTitle.textContent = ev.title;
    dom.eventPreviewArtist.textContent = ev.artist;
    dom.eventPreviewVenue.textContent = `🏛 ${ev.venue}, ${ev.city}`;
    dom.eventPreviewDateTime.textContent = `📅 ${Utsav.formatDisplayDate(ev.date)} • ${ev.time}`;

    // Standard Pass
    dom.standardTierCostDisplay.textContent = ev.isFree || ev.price === 0 ? 'FREE' : Utsav.formatCurrency(ev.price);

    // VIP Pass
    if (ev.isFree || ev.price === 0) {
      dom.vipTierCard.style.display = 'none';
      activeTier = 'standard';
    } else {
      dom.vipTierCard.style.display = 'flex';
      const vipPrice = Math.round(ev.price * 1.6);
      dom.vipTierCostDisplay.textContent = Utsav.formatCurrency(vipPrice);
    }

    // Reset radio selection
    dom.tierRadios.forEach(r => {
      r.checked = r.value === activeTier;
    });
    updateTierHighlight();

    // Auto-select city if matching
    if (ev.city && ['Bengaluru', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Jaipur', 'Goa'].includes(ev.city)) {
      dom.attendeeCity.value = ev.city;
    }

    recalculateBilling();
  }

  function updateTierHighlight() {
    dom.tierCards.forEach(card => {
      const radio = card.querySelector('input[type="radio"]');
      card.classList.toggle('active', radio && radio.checked);
    });
  }

  function recalculateBilling() {
    if (!selectedEvent) return;

    const qty = parseInt(dom.pageTicketQty.value, 10) || 1;
    let singlePrice = selectedEvent.price;
    let tierTitle = 'General Entry Pass';

    if (activeTier === 'vip' && selectedEvent.price > 0) {
      singlePrice = Math.round(selectedEvent.price * 1.6);
      tierTitle = 'Patron / Front Row Baithak Pass';
    }

    const subtotal = singlePrice * qty;
    const gstRate = selectedEvent.isFree || singlePrice === 0 ? 0 : 0.18;
    const gstAmount = subtotal * gstRate;
    const grandTotal = subtotal + gstAmount;

    dom.summaryTierLabel.textContent = `${tierTitle} (${qty} ${qty === 1 ? 'pass' : 'passes'})`;
    dom.summarySubtotalAmount.textContent = Utsav.formatCurrency(subtotal);
    dom.summaryGstAmount.textContent = Utsav.formatCurrency(gstAmount);
    dom.summaryGrandTotal.textContent = Utsav.formatCurrency(grandTotal);

    if (selectedEvent.isFree || grandTotal === 0) {
      dom.summaryPaymentNote.textContent = '✓ 100% Free Entry • Complimentary RSVP Pass Guaranteed';
    } else {
      dom.summaryPaymentNote.textContent = '✓ Venue Pay-on-Arrival or Instant Gate Verification • Official GST Compliant';
    }
  }

  function clearErrors() {
    [dom.attendeeName, dom.attendeeEmail, dom.attendeePhone, dom.attendeeCity].forEach(input => {
      const grp = input.closest('.form-group');
      if (grp) grp.classList.remove('has-error');
    });
  }

  function validateForm() {
    clearErrors();
    let valid = true;

    if (dom.attendeeName.value.trim().length < 2) {
      dom.attendeeName.closest('.form-group').classList.add('has-error');
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(dom.attendeeEmail.value.trim())) {
      dom.attendeeEmail.closest('.form-group').classList.add('has-error');
      valid = false;
    }

    const phoneDigits = dom.attendeePhone.value.trim().replace(/\D/g, '');
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneDigits)) {
      dom.attendeePhone.closest('.form-group').classList.add('has-error');
      valid = false;
    }

    if (!dom.attendeeCity.value) {
      dom.attendeeCity.closest('.form-group').classList.add('has-error');
      valid = false;
    }

    return valid;
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    if (!validateForm()) {
      Utsav.showToast('Please fix the highlighted errors in the form.', '⚠️');
      return;
    }

    const qty = parseInt(dom.pageTicketQty.value, 10) || 1;
    let singlePrice = selectedEvent.price;
    let tierTitle = 'General Entry Pass';

    if (activeTier === 'vip' && selectedEvent.price > 0) {
      singlePrice = Math.round(selectedEvent.price * 1.6);
      tierTitle = 'Patron / Front Row Pass';
    }

    const subtotal = singlePrice * qty;
    const gstRate = selectedEvent.isFree || singlePrice === 0 ? 0 : 0.18;
    const gstAmount = subtotal * gstRate;
    const grandTotal = subtotal + gstAmount;

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
    const cityCode = cityCodeMap[selectedEvent.city] || 'IND';
    const rand = Math.floor(1000 + Math.random() * 9000);
    const bookingRef = `UTSAV-${cityCode}-${rand}`;

    const newBooking = {
      bookingRef: bookingRef,
      bookingTime: new Date().toISOString(),
      event: {
        id: selectedEvent.id,
        title: selectedEvent.title,
        artist: selectedEvent.artist,
        date: selectedEvent.date,
        time: selectedEvent.time,
        venue: selectedEvent.venue,
        landmark: selectedEvent.landmark,
        city: selectedEvent.city
      },
      tier: tierTitle,
      ticketQuantity: qty,
      attendee: {
        fullName: dom.attendeeName.value.trim(),
        email: dom.attendeeEmail.value.trim(),
        phone: dom.attendeePhone.value.trim(),
        residentCity: dom.attendeeCity.value,
        idProof: dom.attendeeIdProof.value,
        dietPreference: dom.attendeeDiet.value
      },
      pricing: {
        subtotal: subtotal,
        gst: gstAmount,
        grandTotal: grandTotal,
        isFree: grandTotal === 0
      }
    };

    latestBooking = newBooking;

    // Save to LocalStorage
    const bookings = Utsav.getBookings();
    bookings.unshift(newBooking);
    Utsav.saveBookings(bookings);

    // Increment registered count
    selectedEvent.registeredCount += qty;

    // Display Boarding Pass
    renderBoardingPass(newBooking);
    Utsav.showToast(`Pass confirmed for ${selectedEvent.title}!`, '✓');
  }

  function renderBoardingPass(booking) {
    dom.passRefCode.textContent = booking.bookingRef;
    dom.passEventTitle.textContent = booking.event.title;
    dom.passArtistName.textContent = booking.event.artist;
    dom.passDateTime.textContent = `${Utsav.formatDisplayDate(booking.event.date)} • ${booking.event.time}`;
    dom.passSeatsTier.textContent = `${booking.ticketQuantity} ${booking.ticketQuantity === 1 ? 'Pass' : 'Passes'} (${booking.tier})`;
    dom.passVenue.textContent = `${booking.event.venue}, ${booking.event.landmark}, ${booking.event.city}`;
    dom.passAttendee.textContent = booking.attendee.fullName;
    dom.passPhone.textContent = `+91 ${booking.attendee.phone}`;
    
    if (booking.pricing.isFree) {
      dom.passAmount.textContent = 'FREE PASS (RSVP Confirmed)';
    } else {
      dom.passAmount.textContent = `${Utsav.formatCurrency(booking.pricing.grandTotal)} (Taxes Incl.)`;
    }

    dom.passIdProof.textContent = `${booking.attendee.idProof} Verified`;

    // Draw Vector Canvas QR Code
    Utsav.drawPassQrCode(dom.pageTicketQrCanvas, booking.bookingRef, booking.attendee.fullName);

    // Switch view
    dom.form.style.display = 'none';
    dom.issuedTicketSection.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function setupListeners() {
    dom.tierRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        activeTier = e.target.value;
        updateTierHighlight();
        recalculateBilling();
      });
    });

    dom.qtyMinusBtn.addEventListener('click', () => {
      let q = parseInt(dom.pageTicketQty.value, 10) || 1;
      if (q > 1) {
        dom.pageTicketQty.value = q - 1;
        recalculateBilling();
      }
    });

    dom.qtyPlusBtn.addEventListener('click', () => {
      let q = parseInt(dom.pageTicketQty.value, 10) || 1;
      if (q < 6) {
        dom.pageTicketQty.value = q + 1;
        recalculateBilling();
      } else {
        Utsav.showToast('Maximum 6 passes per booking.', 'ℹ️');
      }
    });

    [dom.attendeeName, dom.attendeeEmail, dom.attendeePhone, dom.attendeeCity].forEach(input => {
      input.addEventListener('input', () => {
        input.closest('.form-group').classList.remove('has-error');
      });
    });

    dom.form.addEventListener('submit', handleFormSubmit);

    dom.downloadIcsBtn.addEventListener('click', () => {
      if (latestBooking) {
        Utsav.downloadCalendarInvite(latestBooking);
      }
    });

    dom.bookAnotherBtn.addEventListener('click', () => {
      dom.issuedTicketSection.style.display = 'none';
      dom.form.style.display = 'grid';
      dom.form.reset();
      dom.pageTicketQty.value = '1';
      activeTier = 'standard';
      recalculateBilling();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initEventSelector();
    setupListeners();
  });

})();
