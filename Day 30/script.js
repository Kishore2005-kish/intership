document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('has-js');
  const button = document.querySelector('.menu-button');
  const nav = document.querySelector('.site-nav');
  button?.addEventListener('click', () => {
    const open = nav?.classList.toggle('is-open') ?? false;
    button.setAttribute('aria-expanded', String(open));
  });

  const filterButtons = document.querySelectorAll('[data-filter]');
  const products = document.querySelectorAll('[data-category]');
  filterButtons.forEach((filterButton) => filterButton.addEventListener('click', () => {
    const filter = filterButton.getAttribute('data-filter');
    filterButtons.forEach((item) => item.classList.remove('selected'));
    filterButton.classList.add('selected');
    products.forEach((product) => {
      const matches = filter === 'All' || product.getAttribute('data-category') === filter;
      product.hidden = !matches;
      if (matches) {
        product.classList.remove('filter-enter');
        requestAnimationFrame(() => product.classList.add('filter-enter'));
      }
    });
  }));

  const revealTargets = document.querySelectorAll('[data-reveal], .product-card, .statement > *, .quote-band > *, .process article, .values article');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reducedMotion) {
    revealTargets.forEach((target, index) => {
      target.classList.add('reveal-ready');
      target.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 70}ms`);
    });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });
    revealTargets.forEach((target) => observer.observe(target));
  }
});
