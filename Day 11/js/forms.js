/* ============================================
   Taj Heritage Kitchen — Form Validation
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const reservationForm = document.getElementById('reservationForm');
  const contactForm = document.getElementById('contactForm');

  if (reservationForm) initReservationForm(reservationForm);
  if (contactForm) initContactForm(contactForm);
});

function initReservationForm(form) {
  const dateField = form.querySelector('[name="date"]');
  if (dateField) {
    dateField.min = new Date().toISOString().split('T')[0];
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateReservationForm(form)) return;

    showSuccess(form, 'Your table has been reserved! We look forward to welcoming you.');
    form.reset();
    clearErrors(form);
  });

  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) validateField(field);
    });
  });
}

function initContactForm(form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateContactForm(form)) return;

    showSuccess(form, 'Thank you for reaching out! We will respond within 24 hours.');
    form.reset();
    clearErrors(form);
  });

  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) validateField(field);
    });
  });
}

function validateReservationForm(form) {
  let valid = true;

  const rules = {
    name: { required: true, minLength: 2, message: 'Please enter your full name' },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address' },
    phone: { required: true, pattern: /^[\d\s+\-()]{10,15}$/, message: 'Please enter a valid phone number' },
    date: { required: true, futureDate: true, message: 'Please select a future date' },
    time: { required: true, message: 'Please select a time' },
    guests: { required: true, message: 'Please select number of guests' }
  };

  Object.entries(rules).forEach(([name, rule]) => {
    const field = form.querySelector(`[name="${name}"]`);
    if (field && !validateField(field, rule)) valid = false;
  });

  return valid;
}

function validateContactForm(form) {
  let valid = true;

  const rules = {
    name: { required: true, minLength: 2, message: 'Please enter your name' },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address' },
    subject: { required: true, minLength: 3, message: 'Please enter a subject' },
    message: { required: true, minLength: 10, message: 'Message must be at least 10 characters' }
  };

  Object.entries(rules).forEach(([name, rule]) => {
    const field = form.querySelector(`[name="${name}"]`);
    if (field && !validateField(field, rule)) valid = false;
  });

  return valid;
}

function validateField(field, customRule) {
  const value = field.value.trim();
  const rule = customRule || getRuleForField(field);
  const errorEl = field.parentElement.querySelector('.error-message');

  let error = '';

  if (rule.required && !value) {
    error = rule.message || 'This field is required';
  } else if (value && rule.minLength && value.length < rule.minLength) {
    error = rule.message || `Minimum ${rule.minLength} characters required`;
  } else if (value && rule.pattern && !rule.pattern.test(value)) {
    error = rule.message || 'Invalid format';
  } else if (value && rule.futureDate) {
    const selected = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected < today) {
      error = 'Please select a future date';
    }
  }

  field.classList.toggle('error', !!error);
  if (errorEl) {
    errorEl.textContent = error;
    errorEl.classList.toggle('visible', !!error);
  }

  return !error;
}

function getRuleForField(field) {
  const name = field.name;
  const defaults = {
    name: { required: true, minLength: 2 },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    phone: { required: true, pattern: /^[\d\s+\-()]{10,15}$/ },
    date: { required: true, futureDate: true },
    time: { required: true },
    guests: { required: true },
    subject: { required: true, minLength: 3 },
    message: { required: true, minLength: 10 }
  };
  return defaults[name] || { required: field.hasAttribute('required') };
}

function clearErrors(form) {
  form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  form.querySelectorAll('.error-message').forEach(el => el.classList.remove('visible'));
}

function showSuccess(form, message) {
  let successEl = form.querySelector('.form-success');
  if (!successEl) {
    successEl = document.createElement('div');
    successEl.className = 'form-success';
    form.appendChild(successEl);
  }
  successEl.textContent = message;
  successEl.classList.add('visible');

  setTimeout(() => successEl.classList.remove('visible'), 6000);
}
