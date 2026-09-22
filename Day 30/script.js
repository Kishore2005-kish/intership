document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('.menu-button');
  const nav = document.querySelector('.site-nav');
  button?.addEventListener('click', () => {
    const open = nav?.classList.toggle('is-open') ?? false;
    button.setAttribute('aria-expanded', String(open));
  });

  const filterButtons = document.querySelectorAll('[data-filter]');
  const products = document.querySelectorAll('[data-category]');
  filterButtons.forEach((button) => button.addEventListener('click', () => {
    const filter = button.getAttribute('data-filter');
    filterButtons.forEach((item) => item.classList.remove('selected'));
    button.classList.add('selected');
    products.forEach((product) => {
      product.hidden = filter !== 'All' && product.getAttribute('data-category') !== filter;
    });
  }));
});
