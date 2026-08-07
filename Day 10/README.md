# Vidyanjali International School — Website

A modern, fully responsive school website built **strictly with HTML5, CSS3, vanilla
JavaScript and Bootstrap 5** (loaded from CDN). No build step, no frameworks, no backend.

Branding is fictional: *Vidyanjali International School*, a CBSE co-educational school in
Pune, Maharashtra. Motto — **Vidya Dadati Vinayam** (knowledge grants humility).

---

## Pages

| File | Page | Highlights |
| --- | --- | --- |
| `public/index.html` | Home | Hero image slider, notice board, features, animated stats, testimonials, CTA |
| `public/about.html` | About School | History, vision & mission, values, principal's message, infrastructure, affiliations |
| `public/admissions.html` | Admissions | Process timeline, age criteria, fee table, documents, **enquiry form with validation** |
| `public/academics.html` | Academics | Curriculum by stage, senior secondary streams accordion, assessment table, calendar |
| `public/faculty.html` | Faculty | Leadership team + department-filtered teaching faculty grid |
| `public/gallery.html` | Gallery | Category filters and a custom **lightbox** (keyboard + swipe) |
| `public/news.html` | News & Events | Featured story, news grid, upcoming events, achievements |
| `public/contact.html` | Contact Us | Contact cards, validated form, **Google Maps embed**, social links |

## Features

- Responsive layouts for mobile, tablet and desktop (Bootstrap grid + custom media queries)
- Sticky navigation bar that shrinks on scroll, with automatic active-link highlighting
- Bootstrap carousel image slider on the home page
- Auto-scrolling notice board (pauses on hover, respects `prefers-reduced-motion`)
- Gallery lightbox: click to open, arrow keys / swipe to navigate, `Esc` to close
- Admission and contact forms with client-side validation: required fields, name pattern,
  email regex, 10-digit Indian mobile number, birth year range, message length, consent
  checkbox, inline error messages and a success confirmation
- Google Maps embed (plain `<iframe>`, no API key needed)
- Social media links in the top strip, footer and contact page
- Back-to-top button that appears after scrolling
- Smooth scrolling for in-page anchors and scroll-reveal animations via `IntersectionObserver`
- Animated statistic counters

## Folder structure

```text
public/
├── index.html
├── about.html
├── admissions.html
├── academics.html
├── faculty.html
├── gallery.html
├── news.html
├── contact.html
└── assets/
    ├── css/style.css        # all custom styling & design tokens
    ├── js/main.js           # navbar, smooth scroll, reveal, counters, filters, back-to-top
    ├── js/gallery.js        # lightbox
    ├── js/forms.js          # form validation
    └── img/                 # campus, classroom, sports, cultural, portrait images + logo
```

## Setup / how to run

The site is static — no installation or compilation required.

**Option 1 — open directly**

Open `public/index.html` in any modern browser. (Links use root-relative paths such as
`/about.html`, so a local server is recommended; see option 2.)

**Option 2 — any static server**

```bash
cd public
python3 -m http.server 8000
# then visit http://localhost:8000
```

**Option 3 — this project's dev server**

`bun run dev` serves the `public/` folder at `http://localhost:8080`. Opening `/`
forwards to `/index.html`.

## Technologies

- HTML5 (semantic sections, `<figure>`, breadcrumbs, ARIA labels)
- CSS3 (custom properties, grid, flexbox, `aspect-ratio`, keyframe animations)
- JavaScript (ES5-compatible, no dependencies)
- Bootstrap 5.3 + Bootstrap Icons (CDN)
- Google Fonts: Playfair Display + Inter

## Customisation

- **Colours / fonts** — edit the `:root` variables at the top of `assets/css/style.css`.
- **School details** — name, address, phone and email appear in the top strip, footer and
  contact page of each HTML file.
- **Notices** — edit the `<ul>` inside `.notice-scroll` in `index.html`. The list is
  duplicated once so the marquee loops seamlessly; keep both copies in sync.
- **Gallery** — add a `<figure class="gallery-item" data-category="..." data-caption="...">`
  block; the lightbox and filters pick it up automatically.
- **Forms** — validation rules are driven by `data-rule` attributes (`name`, `email`,
  `phone`, `year`, `select`, `message`) read by `assets/js/forms.js`. There is no backend,
  so submissions show a success message only.

## Notes

Photographs are AI-generated placeholders. Contact details, fees and dates are fictional
sample content for demonstration.
