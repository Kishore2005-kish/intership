
const navToggle = document.querySelector('.nav__toggle');
const navList = document.querySelector('.nav__list');

navToggle.addEventListener('click', () => {
  const isOpen = navList.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

navList.querySelectorAll('.nav__link').forEach((link) => {
  link.addEventListener('click', () => {
    navList.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});


const track = document.querySelector('.carousel__track');
const cards = Array.from(document.querySelectorAll('.property-card'));
const prevBtn = document.querySelector('.carousel__btn--prev');
const nextBtn = document.querySelector('.carousel__btn--next');

let activeIndex = cards.findIndex((c) => c.classList.contains('property-card--active'));
if (activeIndex === -1) activeIndex = 1;

function setActive(index) {
  activeIndex = ((index % cards.length) + cards.length) % cards.length;

  cards.forEach((card, i) => {
    card.classList.toggle('property-card--active', i === activeIndex);
  });

  updateTrackPosition();
}

function updateTrackPosition() {
  if (window.innerWidth <= 768) return;

  const wrapper = document.querySelector('.carousel__track-wrapper');
  const gap = 24;
  let offset = wrapper.offsetWidth / 2;

  for (let i = 0; i < activeIndex; i++) {
    const cardWidth = cards[i].offsetWidth;
    offset -= cardWidth + gap;
  }

  const activeCard = cards[activeIndex];
  offset -= activeCard.offsetWidth / 2;

  track.style.transform = `translateX(${offset}px)`;
}

prevBtn.addEventListener('click', () => setActive(activeIndex - 1));
nextBtn.addEventListener('click', () => setActive(activeIndex + 1));

cards.forEach((card, i) => {
  card.addEventListener('click', () => setActive(i));
});

window.addEventListener('resize', updateTrackPosition);
window.addEventListener('load', updateTrackPosition);
