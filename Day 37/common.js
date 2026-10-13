/**
 * UtsavPass — Shared Utilities & Storage
 * Handles localStorage persistence, date formatters, badges, and QR code rendering.
 */

(function () {
  'use strict';

  window.Utsav = window.Utsav || {};

  // =========================================================================
  // Date Helpers
  // =========================================================================
  function formatIsoDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function getTodayString() {
    return formatIsoDate(new Date());
  }

  function getTomorrowString() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return formatIsoDate(d);
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
  // LocalStorage Helpers
  // =========================================================================
  function getBookings() {
    try {
      return JSON.parse(localStorage.getItem('utsav_bookings') || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveBookings(bookings) {
    localStorage.setItem('utsav_bookings', JSON.stringify(bookings));
    updateHeaderBadges();
  }

  function getSavedEventIds() {
    try {
      return new Set(JSON.parse(localStorage.getItem('utsav_saved_events') || '[]'));
    } catch (e) {
      return new Set();
    }
  }

  function toggleSavedEvent(eventId) {
    const saved = getSavedEventIds();
    let isNowSaved = false;
    if (saved.has(eventId)) {
      saved.delete(eventId);
      isNowSaved = false;
      showToast('Event removed from your saved list.', 'ℹ️');
    } else {
      saved.add(eventId);
      isNowSaved = true;
      showToast('Event saved to your favorites!', '❤️');
    }
    localStorage.setItem('utsav_saved_events', JSON.stringify([...saved]));
    updateHeaderBadges();
    return isNowSaved;
  }

  function updateHeaderBadges() {
    const savedBadge = document.getElementById('savedCountBadge');
    const passBadge = document.getElementById('passCountBadge');
    
    if (savedBadge) {
      savedBadge.textContent = getSavedEventIds().size;
    }
    if (passBadge) {
      passBadge.textContent = getBookings().length;
    }
  }

  // =========================================================================
  // Toast Notifications
  // =========================================================================
  let toastTimer = null;
  function showToast(message, icon = '✓') {
    const toastContainer = document.getElementById('toastContainer');
    const toastElement = document.getElementById('toastElement');
    const toastIcon = document.getElementById('toastIcon');
    const toastMessage = document.getElementById('toastMessage');

    if (!toastElement || !toastMessage) return;

    if (toastTimer) clearTimeout(toastTimer);
    if (toastIcon) toastIcon.textContent = icon;
    toastMessage.textContent = message;
    toastElement.classList.add('show');
    toastTimer = setTimeout(() => {
      toastElement.classList.remove('show');
    }, 3200);
  }

  // =========================================================================
  // Canvas QR Code Generator
  // =========================================================================
  function drawPassQrCode(canvas, refCode, name) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    ctx.clearRect(0, 0, size, size);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);

    const gridSize = 21;
    const cellSize = Math.floor(size / (gridSize + 2));
    const offset = Math.floor((size - (gridSize * cellSize)) / 2);

    ctx.fillStyle = '#1A1715';

    function drawFinder(row, col) {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const isOuter = r === 0 || r === 6 || c === 0 || c === 6;
          const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          if (isOuter || isInner) {
            ctx.fillRect(offset + (col + c) * cellSize, offset + (row + r) * cellSize, cellSize, cellSize);
          }
        }
      }
    }

    drawFinder(0, 0);
    drawFinder(0, gridSize - 7);
    drawFinder(gridSize - 7, 0);

    for (let i = 8; i < gridSize - 8; i += 2) {
      ctx.fillRect(offset + 6 * cellSize, offset + i * cellSize, cellSize, cellSize);
      ctx.fillRect(offset + i * cellSize, offset + 6 * cellSize, cellSize, cellSize);
    }

    let hash = 0;
    const combinedStr = refCode + name;
    for (let i = 0; i < combinedStr.length; i++) {
      hash = ((hash << 5) - hash) + combinedStr.charCodeAt(i);
      hash |= 0;
    }

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const inTopLeft = r < 8 && c < 8;
        const inTopRight = r < 8 && c >= gridSize - 8;
        const inBottomLeft = r >= gridSize - 8 && c < 8;
        const inTiming = (r === 6) || (c === 6);

        if (inTopLeft || inTopRight || inBottomLeft || inTiming) continue;

        const bitSeed = (hash ^ (r * 31 + c * 17)) & 0xFF;
        if ((bitSeed % 3) === 0 || (bitSeed % 5) === 0) {
          ctx.fillRect(offset + c * cellSize, offset + r * cellSize, cellSize, cellSize);
        }
      }
    }
  }

  // =========================================================================
  // iCalendar (.ics) Download
  // =========================================================================
  function downloadCalendarInvite(booking) {
    if (!booking) return;
    const ev = booking.event;
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

  // Export public API
  window.Utsav = {
    formatIsoDate,
    getTodayString,
    getTomorrowString,
    getWeekendDates,
    getNext7DaysDates,
    formatDisplayDate,
    formatCurrency,
    escapeHtml,
    getBookings,
    saveBookings,
    getSavedEventIds,
    toggleSavedEvent,
    updateHeaderBadges,
    showToast,
    drawPassQrCode,
    downloadCalendarInvite
  };

  // Run initial badge update on load
  document.addEventListener('DOMContentLoaded', updateHeaderBadges);
})();
