document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const header = document.getElementById('header');
    const handleScroll = () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const navItems = document.querySelectorAll('.nav-link, .nav-links .btn');

    if (mobileMenuBtn && navLinks) {
        const toggleMenu = () => {
            navLinks.classList.toggle('open');
            mobileMenuBtn.setAttribute('aria-expanded', navLinks.classList.contains('open'));
        };

        mobileMenuBtn.addEventListener('click', toggleMenu);
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                if (navLinks.classList.contains('open')) toggleMenu();
            });
        });
    }

    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        revealElements.forEach(el => observer.observe(el));
    }

    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            form.querySelectorAll('[required]').forEach(field => {
                if (!field.value.trim() || (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim()))) {
                    isValid = false;
                    field.style.borderColor = 'var(--error)';
                } else {
                    field.style.borderColor = '';
                }
            });

            if (!isValid) {
                status.className = 'form-status error';
                status.textContent = 'Please complete all required fields correctly.';
                return;
            }

            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'Submitting...';
            btn.disabled = true;

            setTimeout(() => {
                status.className = 'form-status success';
                status.textContent = 'Inquiry received. Our team will contact you within 24 hours.';
                form.reset();
                btn.textContent = originalText;
                btn.disabled = false;
                setTimeout(() => { status.className = 'form-status'; }, 5000);
            }, 1000);
        });

        form.addEventListener('input', (e) => {
            if (e.target.hasAttribute('required')) {
                e.target.style.borderColor = '';
                if (status.classList.contains('error')) status.className = 'form-status';
            }
        });
    }
});
