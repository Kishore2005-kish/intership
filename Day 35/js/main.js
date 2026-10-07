/* ==========================================================================
   MALNAD CREST - MAIN JS ENGINE (Flavor Visualizer & UI/UX Engine)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('js-loaded');
  initNavbar();
  initScrollObserver();
  initCounterAnimation();
  initFlavorVisualizer();
});

/* Sticky Navbar & Mobile Menu */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  if (mobileToggle && navLinks) {
    mobileToggle.setAttribute('aria-expanded', 'false');

    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('nav-open', isOpen);
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        navLinks.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      }
    });
  }
}

/* Scroll Reveal Observer */
function initScrollObserver() {
  const reveals = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('visible'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.05
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(el => observer.observe(el));

  setTimeout(() => {
    reveals.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('visible');
      }
    });
  }, 100);
}

/* Number Counter Animation for Stats */
function initCounterAnimation() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target') || '0', 10);
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        let count = 0;
        const speed = target / 40;

        const updateCount = () => {
          count += speed;
          if (count < target) {
            el.innerText = `${prefix}${Math.ceil(count)}${suffix}`;
            setTimeout(updateCount, 25);
          } else {
            el.innerText = `${prefix}${target}${suffix}`;
          }
        };

        updateCount();
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  statNumbers.forEach(stat => counterObserver.observe(stat));
}

/* Flavor Profile Interactive Selector */
function initFlavorVisualizer() {
  const flavorSelect = document.getElementById('flavorSelect');
  if (!flavorSelect) return;

  const FLAVOR_PROFILES = {
    monsooned: { intensity: 85, acidity: 20, body: 95, aroma: 90, notes: 'Nutty, Cocoa, Molasses' },
    bababudan: { intensity: 90, acidity: 65, body: 80, aroma: 95, notes: 'Wild Berries, Cardamom, Citrus' },
    coorg: { intensity: 95, acidity: 35, body: 98, aroma: 88, notes: 'Bittersweet Crema, Heavy Body' },
    mysore: { intensity: 80, acidity: 40, body: 85, aroma: 92, notes: 'Roasted Hazelnut, Caramel' }
  };

  const updateProfile = () => {
    const val = flavorSelect.value;
    const profile = FLAVOR_PROFILES[val] || FLAVOR_PROFILES.monsooned;

    document.getElementById('barIntensity').style.width = `${profile.intensity}%`;
    document.getElementById('valIntensity').innerText = `${profile.intensity}%`;

    document.getElementById('barAcidity').style.width = `${profile.acidity}%`;
    document.getElementById('valAcidity').innerText = `${profile.acidity}%`;

    document.getElementById('barBody').style.width = `${profile.body}%`;
    document.getElementById('valBody').innerText = `${profile.body}%`;

    document.getElementById('barAroma').style.width = `${profile.aroma}%`;
    document.getElementById('valAroma').innerText = `${profile.aroma}%`;

    document.getElementById('flavorNotesSummary').innerText = profile.notes;
  };

  flavorSelect.addEventListener('change', updateProfile);
  updateProfile();
}

/* Global Toast Notifications */
window.showToast = function(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span style="color: var(--accent-amber); font-size: 1.1rem;">☕</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
};
