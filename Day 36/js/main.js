document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const header = document.getElementById('header');
  const menuButton = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('navLinks');
  const navItems = document.querySelectorAll('.nav-link, .nav-links .btn');

  // Header glass treatment and a subtle scroll progress indicator.
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);
  const updateScroll = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 16);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  };
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  const closeMenu = () => {
    if (!menuButton || !nav) return;
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };
  if (menuButton && nav) {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);
    });
    navItems.forEach(item => item.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 680) closeMenu();
    });
  }

  // Mark the current page in the navigation.
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const target = link.getAttribute('href');
    if (target === currentPage) link.setAttribute('aria-current', 'page');
  });

  // Scroll reveals with staggered timing. Reduced-motion users see content immediately.
  const revealElements = document.querySelectorAll('.reveal');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const siblings = entry.target.parentElement
          ? [...entry.target.parentElement.querySelectorAll(':scope > .reveal')]
          : [];
        const index = Math.max(0, siblings.indexOf(entry.target));
        entry.target.style.setProperty('--reveal-delay', `${Math.min(index * 90, 360)}ms`);
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('active'));
  }

  // Pointer-driven 3D tilt for the hero workspace. It is deliberately CSS-only,
  // so the page keeps its current HTML/CSS/vanilla-JS stack and loads quickly.
  const heroVisual = document.querySelector('.hero-visual');
  const dashboard = document.querySelector('.dashboard-window');
  if (heroVisual && dashboard && !reduceMotion) {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (finePointer) {
      heroVisual.addEventListener('pointermove', event => {
        const rect = heroVisual.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        const rotateY = (px - 0.5) * 10;
        const rotateX = (0.5 - py) * 7;
        dashboard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        dashboard.style.boxShadow = `${-rotateY * 1.5}px 38px 90px rgba(43,45,108,.19), 0 4px 12px rgba(49,53,112,.04)`;
        heroVisual.style.setProperty('--scene-x', `${px * 100}%`);
        heroVisual.style.setProperty('--scene-y', `${py * 100}%`);
      });
      heroVisual.addEventListener('pointerleave', () => {
        dashboard.style.transform = '';
        dashboard.style.boxShadow = '';
      });
    }
  }

  // Add restrained perspective tilt to interactive cards on desktop pointers.
  if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.testimonial-card, .feature-item').forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        card.style.transform = `perspective(900px) rotateX(${(0.5-y)*3}deg) rotateY(${(x-0.5)*3}deg) translateY(-4px) translateZ(5px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  // Make any cards feel responsive without adding a heavy animation dependency.
  document.querySelectorAll('.testimonial-card, .feature-item').forEach(card => {
    card.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse' || reduceMotion) return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      card.style.setProperty('--pointer-x', `${x * 100}%`);
      card.style.setProperty('--pointer-y', `${y * 100}%`);
    });
  });

  // Accessible front-end validation. No false claim of delivery: a backend is needed to send inquiries.
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (form && status) {
    form.querySelectorAll('[required]').forEach(field => {
      field.addEventListener('input', () => {
        field.removeAttribute('aria-invalid');
        if (status.classList.contains('error')) {
          status.className = 'form-status';
          status.textContent = '';
        }
      });
      field.addEventListener('change', () => field.removeAttribute('aria-invalid'));
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      let firstInvalid = null;
      form.querySelectorAll('[required]').forEach(field => {
        const valid = field.checkValidity() && field.value.trim().length > 0;
        field.setAttribute('aria-invalid', String(!valid));
        if (!valid && !firstInvalid) firstInvalid = field;
      });
      if (firstInvalid) {
        status.className = 'form-status error';
        status.textContent = 'Please check the highlighted fields and enter valid information.';
        firstInvalid.focus();
        return;
      }
      const data = new FormData(form);
      const subject = encodeURIComponent(`Website inquiry from ${data.get('name')}`);
      const body = encodeURIComponent(
        `Name: ${data.get('name')}\nEmail: ${data.get('email')}\nInterest: ${data.get('service')}\n\nProject details:\n${data.get('message')}`
      );
      status.className = 'form-status success';
      status.textContent = 'Your details are ready. Your email app will open so you can send this inquiry; this static demo does not submit data to a server.';
      window.location.href = `mailto:info@teczosoftwares.com?subject=${subject}&body=${body}`;
    });
  }
});
