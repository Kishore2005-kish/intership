/* Astera Realty — motion layer. Vanilla ES6, no dependencies. */

const q = (s, c = document) => c.querySelector(s);
const qa = (s, c = document) => [...c.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));


const ticks = [];
let scrollY = 0;
const onTick = (fn) => ticks.push(fn);

function loop() {
  scrollY = window.scrollY || 0;
  for (const fn of ticks) fn(scrollY);
  requestAnimationFrame(loop);
}

function bezier(p1x, p1y, p2x, p2y) {
  const cx = 3 * p1x, bx = 3 * (p2x - p1x) - cx, ax = 1 - cx - bx;
  const cy = 3 * p1y, by = 3 * (p2y - p1y) - cy, ay = 1 - cy - by;
  const fx = (t) => ((ax * t + bx) * t + cx) * t;
  const dx = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (x) => {
    let t = x;
    for (let i = 0; i < 6; i++) {
      const d = dx(t);
      if (Math.abs(d) < 1e-6) break;
      t -= (fx(t) - x) / d;
    }
    t = clamp(t, 0, 1);
    return ((ay * t + by) * t + cy) * t;
  };
}

const easeZoom = bezier(0.76, 0, 0.24, 1);
const easeOutQ = bezier(0.16, 1, 0.3, 1);
const track = (t, a, b) => clamp((t - a) / (b - a), 0, 1);

function initIntro() {
  const stage = q('#introStage');
  const intro = q('#intro');
  const panel = q('#introPanel');
  const type = q('#introType');
  const finish = () => document.body.classList.add('is-ready');

  if (!stage || reduced) {
    if (stage) stage.remove();
    return finish();
  }

  /* opening beats: text reveals, then the photo panel appears — the zoom is yours to scroll */
  setTimeout(() => intro.classList.add('is-type'), 220);
  setTimeout(() => intro.classList.add('is-photo'), 1150);

 
  const targetScale = () => {
    const s = parseFloat(getComputedStyle(panel).getPropertyValue('--s')) || 1;
    const r = panel.getBoundingClientRect();
    return Math.max(innerWidth / (r.width / s), innerHeight / (r.height / s)) * 1.001;
  };

  intro.style.setProperty('--s', '1.06');
  let S = targetScale();
  addEventListener('resize', () => (S = targetScale()));

  let ready = false;
  let sp = 0; /* smoothed progress — keeps the beat gliding between scroll events */
  onTick((y) => {
    const span = Math.max(1, stage.offsetHeight - innerHeight);
    const p = clamp(y / span, 0, 1);
    sp = Math.abs(p - sp) < 0.0002 ? p : lerp(sp, p, 0.085);

   
    const z = easeZoom(track(sp, 0.04, 0.55));
    intro.style.setProperty('--s', (1.06 + (S - 1.06) * z).toFixed(4));
    intro.style.setProperty('--r', (6 * (1 - Math.min(1, z * 1.35))).toFixed(2) + 'px');
    intro.style.setProperty('--grade', (0.34 - 0.28 * z).toFixed(3));

   
    const o = easeOutQ(track(sp, 0.03, 0.28));
    type.style.setProperty('--ty', (-90 * o).toFixed(2) + 'px');
    type.style.setProperty('--to', (1 - o).toFixed(3));
    intro.style.setProperty('--cue', (1 - clamp(sp / 0.1, 0, 1)).toFixed(3));

   
    const inA = easeOutQ(track(sp, 0.56, 0.80));   /* wordmark glides in */
    const inB = easeOutQ(track(sp, 0.60, 0.85));
    const outA = easeZoom(track(sp, 0.84, 0.95)); /* and eases back out */
    const outB = easeZoom(track(sp, 0.825, 0.94));
    const scrim = easeOutQ(track(sp, 0.545, 0.74)) * (1 - easeOutQ(track(sp, 0.85, 0.96)));
    const l1 = inA * (1 - outA);
    const l2 = inB * (1 - outB);
    intro.style.setProperty('--brand', scrim.toFixed(3));
    intro.style.setProperty('--b1', l1.toFixed(3));
    intro.style.setProperty('--b2', l2.toFixed(3));
    intro.style.setProperty('--by1', (26 * (1 - inA) - 14 * outA).toFixed(2));
    intro.style.setProperty('--by2', (120 * (1 - inB) - 60 * outB).toFixed(2));
    intro.style.setProperty('--bblur', (10 * (1 - inA) + 8 * outA).toFixed(2));
    intro.style.setProperty('--bs', (1.09 - 0.09 * inA + 0.05 * outA).toFixed(4));

   
    const mistIn = easeOutQ(track(sp, 0.80, 0.965));
    intro.style.setProperty('--mist', mistIn.toFixed(3));
    intro.style.setProperty('--mistCore', easeOutQ(track(sp, 0.88, 0.99)).toFixed(3));
    intro.style.setProperty('--mistS', (0.82 + 0.34 * mistIn).toFixed(3));

   
    const drift = easeOutQ(track(sp, 0.55, 1));
    intro.style.setProperty('--is', (1.14 - 0.14 * z + 0.06 * drift).toFixed(4));

    if (!ready && p > 0.93) {
      ready = true;
      finish();
    } else if (ready && p < 0.93) {
      ready = false;
    }
  });



}



function initNav() {
  const nav = q('#nav');
  const burger = q('#burger');
  const menu = q('#menu');
  let last = 0;

  onTick((y) => {
    nav.classList.toggle('is-stuck', y > 60);
    nav.classList.toggle('is-hidden', y > last && y > 420 && !menu.classList.contains('is-open'));
    last = y;
  });

  const toggle = (open) => {
    burger.classList.toggle('is-on', open);
    menu.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('is-locked', open);
  };
  burger.addEventListener('click', () => toggle(!menu.classList.contains('is-open')));

  qa('[data-scroll]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = q(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      toggle(false);
      target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    });
  });

  const links = qa('#navLinks a');
  const sections = links.map((l) => q(l.getAttribute('href'))).filter(Boolean);
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id));
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  sections.forEach((s) => spy.observe(s));
}


function splitWords() {
  qa('.split').forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    words.forEach((w, i) => {
      const span = document.createElement('span');
      span.className = 'w';
      const inner = document.createElement('i');
      inner.textContent = w;
      inner.style.transitionDelay = i * 55 + 'ms';
      span.appendChild(inner);
      el.appendChild(span);
      el.appendChild(document.createTextNode(' '));
    });
  });
}

function initReveals() {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    },
    { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
  );
  qa('.slide-x, .reveal-up, .split, .timeline, .bars, .trend__line, #acc').forEach((el) => io.observe(el));

  qa('.reveal-up[data-delay]').forEach((el) => (el.style.transitionDelay = el.dataset.delay + 'ms'));

  const groups = new Map();
  qa('[data-stagger]').forEach((el) => {
    const key = el.parentElement;
    const arr = groups.get(key) || [];
    el.style.transitionDelay = arr.length * 90 + 'ms';
    arr.push(el);
    groups.set(key, arr);
    io.observe(el);
  });
}


function initParallax() {
  const items = qa('[data-parallax]').map((el) => ({ el, k: parseFloat(el.dataset.parallax), y: 0 }));
  if (!items.length || reduced) return;
  onTick(() => {
    for (const it of items) {
      const rect = it.el.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > innerHeight + 200) continue;
      const target = (rect.top - innerHeight / 2) * -it.k;
      it.y = lerp(it.y, target, 0.09);
      it.el.style.transform = `translate3d(0, ${it.y.toFixed(2)}px, 0)`;
    }
  });
}


function initMarquee(el, speed) {
  if (!el || reduced) return;
  el.innerHTML += el.innerHTML;
  const width = () => el.scrollWidth / 2;
  let x = speed > 0 ? 0 : -width();
  onTick(() => {
    x -= speed;
    const w = width();
    if (x <= -w) x += w;
    if (x >= 0) x -= w;
    el.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
  });
}


function initHighlight() {
  qa('[data-highlight]').forEach(setupHighlight);
}

function setupHighlight(el) {
  const words = el.textContent.trim().split(/\s+/);
  el.textContent = '';
  words.forEach((w) => {
    const s = document.createElement('span');
    s.className = 'hw';
    s.textContent = w + ' ';
    el.appendChild(s);
  });
  const spans = qa('.hw', el);
  onTick(() => {
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    const p = clamp((innerHeight * 0.78 - r.top) / (r.height + innerHeight * 0.28), 0, 1);
    const lit = Math.round(p * spans.length);
    spans.forEach((s, i) => s.classList.toggle('is-lit', i < lit));
  });
}


function initCounters() {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        io.unobserve(el);
        const end = parseFloat(el.dataset.count);
        const pre = el.dataset.prefix || '';
        const suf = el.dataset.suffix || '';
        const dur = 1500;
        const t0 = performance.now();
        const run = (t) => {
          const p = clamp((t - t0) / dur, 0, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = pre + Math.round(end * eased).toLocaleString('en-IN') + suf;
          if (p < 1) requestAnimationFrame(run);
        };
        requestAnimationFrame(run);
      });
    },
    { threshold: 0.6 }
  );
  qa('[data-count]').forEach((el) => io.observe(el));
}


function initTilt() {
  if (reduced || !matchMedia('(hover:hover)').matches) return;
  qa('[data-tilt]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-6px)`;
    });
    el.addEventListener('pointerleave', () => (el.style.transform = ''));
  });
}


function initCities() {
  const cities = qa('.city');
  const media = qa('.cities__media img');
  const set = (name) => {
    cities.forEach((c) => c.classList.toggle('is-on', c.dataset.city === name));
    media.forEach((m) => m.classList.toggle('is-on', m.dataset.city === name));
  };
  cities.forEach((c) => {
    c.addEventListener('pointerenter', () => set(c.dataset.city));
    c.addEventListener('focus', () => set(c.dataset.city));
  });
}


function initSlider() {
  const quotes = qa('.quote');
  const bar = q('#sliderBar');
  if (!quotes.length) return;
  const span = 6000;
  let i = 0,
    t0 = performance.now(),
    paused = false;
  const wrap = q('#slider');
  wrap.addEventListener('pointerenter', () => (paused = true));
  wrap.addEventListener('pointerleave', () => {
    paused = false;
    t0 = performance.now() - span * 0.02;
  });
  const run = (t) => {
    if (!paused) {
      const p = (t - t0) / span;
      bar.style.width = clamp(p, 0, 1) * 100 + '%';
      if (p >= 1) {
        t0 = t;
        quotes[i].classList.remove('is-on');
        i = (i + 1) % quotes.length;
        quotes[i].classList.add('is-on');
      }
    } else {
      t0 = t - clamp(parseFloat(bar.style.width) / 100, 0, 1) * span;
    }
    requestAnimationFrame(run);
  };
  requestAnimationFrame(run);
}


function initTrend() {
  const line = q('#trendLine');
  if (!line) return;
  const len = line.getTotalLength();
  line.style.strokeDasharray = len;
  line.style.strokeDashoffset = len;
  new IntersectionObserver(
    (entries, o) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        line.style.strokeDashoffset = '0';
        o.disconnect();
      });
    },
    { threshold: 0.4 }
  ).observe(line.closest('.trend'));
}


function initAccordion() {
  qa('.acc__item').forEach((item) => {
    const btn = q('.acc__q', item);
    const panel = q('.acc__a', item);
    btn.addEventListener('click', () => {
      const open = item.classList.contains('is-open');
      qa('.acc__item.is-open').forEach((other) => {
        other.classList.remove('is-open');
        q('.acc__q', other).setAttribute('aria-expanded', 'false');
        q('.acc__a', other).style.height = '0px';
      });
      if (open) return;
      item.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      panel.style.height = panel.scrollHeight + 'px';
    });
  });
  addEventListener('resize', () => {
    const open = q('.acc__item.is-open .acc__a');
    if (open) open.style.height = open.scrollHeight + 'px';
  });
}


function initForms() {
  const form = q('#form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) return form.reportValidity();
    q('#formOk').classList.add('is-on');
    form.reset();
  });
  q('#news').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = q('#news button');
    btn.style.transform = 'scale(.86)';
    setTimeout(() => (btn.style.transform = ''), 260);
    e.target.reset();
  });
}


function init() {
  splitWords();
  initIntro();
  initNav();
  initReveals();
  initParallax();
  initHighlight();
  initCounters();
  initTilt();
  initCities();
  initSlider();
  initTrend();
  initAccordion();
  initForms();
  initChevrons();
  initMarquee(q('#marqueeTrack'), 0.45);
  initMarquee(q('.band__track'), -0.8);
  requestAnimationFrame(loop);
}

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', init);


function initChevrons() {
  const sec = q('#chevrons');
  if (!sec) return;
  const pin = q('.chevrons__pin', sec);
  const title = q('.chevrons__title', sec);
  const sub = q('.chevrons__sub', sec);
  const items = qa('.chev', sec).map((el) => {
    const path = q('.chev__line path', el);
    const len = path.getTotalLength();
    path.style.setProperty('--len', len.toFixed(1));
    return el;
  });

  let sp = 0;
  onTick(() => {
    const r = sec.getBoundingClientRect();
    if (r.bottom < -100 || r.top > innerHeight + 100) return;
    const span = Math.max(1, sec.offsetHeight - innerHeight);
    const p = clamp(-r.top / span, 0, 1);
    sp = Math.abs(p - sp) < 0.0002 ? p : lerp(sp, p, 0.1);

    title.style.setProperty('--t', easeOutQ(track(sp, 0.02, 0.18)).toFixed(3));
    sub.style.setProperty('--s', easeOutQ(track(sp, 0.62, 0.82)).toFixed(3));

    items.forEach((el, i) => {
      const o = i * 0.055;
      el.style.setProperty('--a', easeOutQ(track(sp, 0.1 + o, 0.34 + o)).toFixed(3));
      el.style.setProperty('--b', easeOutQ(track(sp, 0.38 + o, 0.72 + o)).toFixed(3));
    });
    pin.style.setProperty('--p', sp.toFixed(3));
  });
}
