const page = document.body.dataset.page;
const nav = document.querySelector('.links');
document.querySelector('.menu')?.addEventListener('click', () => nav.classList.toggle('open'));
document.querySelectorAll('.links a').forEach(a => { if (a.dataset.page === page) a.classList.add('active') });
let count = Number(sessionStorage.getItem('cartCount') || 0); const badge = document.querySelector('.cart-count');
function updateCart() { if (badge) badge.textContent = count; sessionStorage.setItem('cartCount', String(count)) }
function toast(text) { const el = document.querySelector('.toast'); if (!el) return; el.textContent = text; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 1800) }
document.querySelectorAll('.mini-add').forEach(btn => btn.addEventListener('click', () => { count++; updateCart(); toast(`${btn.dataset.name} added to your basket`) })); updateCart();
document.querySelectorAll('.filter').forEach(btn => btn.addEventListener('click', () => { document.querySelectorAll('.filter').forEach(b => b.classList.remove('active')); btn.classList.add('active'); document.querySelectorAll('.catalogue .plant-card').forEach(card => card.classList.toggle('hidden', btn.dataset.filter !== 'all' && card.dataset.category !== btn.dataset.filter)) }));
document.querySelector('.subscribe')?.addEventListener('submit', e => { e.preventDefault(); toast('Welcome to the Potme community'); e.target.reset() });
document.querySelector('.contact-form')?.addEventListener('submit', e => { e.preventDefault(); const status = e.target.querySelector('.form-status'); status.textContent = 'Thank you — your message is ready for our plant team.'; e.target.reset() });
const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('visible')), { threshold: .08 }); document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
