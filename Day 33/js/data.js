/* ============================================================
   SUMMIT.IO — shared content data (vanilla JS, no build step)
   ============================================================ */

const SPEAKERS = [
  {
    id: "sp-1",
    name: "Ananya Raghavan",
    role: "Chief Technology Officer",
    company: "Northwind Systems",
    track: "Engineering",
    photo: "images/speaker-1.jpg",
    bio: "Ananya leads a 400-person platform organisation and has spent the last decade scaling distributed systems for payments and logistics. She is a frequent contributor to open-source observability tooling and mentors engineering managers across Asia-Pacific.",
    talk: "Designing Platforms That Survive Their Own Success",
    social: { twitter: "https://twitter.com", linkedin: "https://www.linkedin.com", github: "https://github.com" }
  },
  {
    id: "sp-2",
    name: "Marcus Ellery",
    role: "Principal Software Architect",
    company: "Lumen Cloud",
    track: "Cloud",
    photo: "images/speaker-2.jpg",
    bio: "Marcus designs multi-region architectures for regulated industries. He has migrated more than 200 legacy workloads to containerised platforms and writes the widely-read newsletter 'Boring Infrastructure'.",
    talk: "Boring Infrastructure Wins: Multi-Region Without the Drama",
    social: { twitter: "https://twitter.com", linkedin: "https://www.linkedin.com", github: "https://github.com" }
  },
  {
    id: "sp-3",
    name: "Hana Watanabe",
    role: "Head of Product Design",
    company: "Studio Kaze",
    track: "Design",
    photo: "images/speaker-3.jpg",
    bio: "Hana builds design systems used by millions of people every day. Her work focuses on accessibility-first component libraries and on teaching product teams to prototype at the speed of conversation.",
    talk: "Design Systems as a Product, Not a Project",
    social: { twitter: "https://twitter.com", linkedin: "https://www.linkedin.com", github: "https://github.com" }
  },
  {
    id: "sp-4",
    name: "Daniel Brecht",
    role: "Director of Threat Intelligence",
    company: "Ironvault Security",
    track: "Security",
    photo: "images/speaker-4.jpg",
    bio: "Daniel has responded to incidents at national scale for 18 years. He now runs a red team practice that stress-tests critical infrastructure and advises regulators on disclosure frameworks.",
    talk: "Anatomy of a Supply-Chain Breach",
    social: { twitter: "https://twitter.com", linkedin: "https://www.linkedin.com", github: "https://github.com" }
  },
  {
    id: "sp-5",
    name: "Camila Ordoñez",
    role: "Founder & CEO",
    company: "Ruta Labs",
    track: "Business",
    photo: "images/speaker-5.jpg",
    bio: "Camila bootstrapped Ruta Labs to 40,000 customers across Latin America before raising a Series B. She speaks candidly about pricing, distribution, and building a company outside of traditional startup hubs.",
    talk: "Distribution Beats Product: Lessons From 40,000 Customers",
    social: { twitter: "https://twitter.com", linkedin: "https://www.linkedin.com", github: "https://github.com" }
  },
  {
    id: "sp-6",
    name: "Yusuf Al-Amin",
    role: "Lead Data Scientist",
    company: "Helix Research",
    track: "AI & Data",
    photo: "images/speaker-6.jpg",
    bio: "Yusuf works on evaluation methods for large language models in clinical settings. He publishes practical guidance on retrieval pipelines and is the maintainer of two popular evaluation libraries.",
    talk: "Evaluating LLMs When Mistakes Are Expensive",
    social: { twitter: "https://twitter.com", linkedin: "https://www.linkedin.com", github: "https://github.com" }
  }
];

const CATEGORIES = [
  { id: "conference", name: "Conference", icon: "🎤", blurb: "Multi-day flagship gatherings with keynote stages and expo halls." },
  { id: "workshop", name: "Workshop", icon: "🛠️", blurb: "Small hands-on rooms where you build something before you leave." },
  { id: "summit", name: "Summit", icon: "🌐", blurb: "Invite-friendly strategy sessions for senior practitioners." },
  { id: "meetup", name: "Meetup", icon: "🤝", blurb: "Evening sessions, lightning talks and unapologetic networking." }
];

const EVENTS = [
  {
    id: "devcon-2026",
    title: "DevCon Global 2026",
    category: "conference",
    date: "2026-11-12",
    endDate: "2026-11-14",
    time: "09:00 – 18:30",
    city: "Bengaluru, India",
    venue: "Aurora Convention Centre, Whitefield",
    price: 28999,
    image: "images/event-1.jpg",
    featured: true,
    seatsLeft: 320,
    summary: "Three days of deep engineering talks across platform, performance and developer experience, with 60+ sessions and a full expo floor.",
    description:
      "DevCon Global returns for its ninth edition with a single question: how do we keep shipping when our systems, teams and expectations all triple in size? Expect uncompromising technical content — no vendor pitches on the keynote stage — plus hallway tracks, office hours with maintainers, and a 40-booth expo hall covering observability, build tooling and developer platforms.",
    speakers: ["sp-1", "sp-2", "sp-6"],
    tickets: [
      { type: "standard", name: "Standard Pass", price: 28999, perks: "All keynotes, breakout tracks and expo access" },
      { type: "vip", name: "VIP Pass", price: 57999, perks: "Front-row seating, speaker dinner and recorded sessions" },
      { type: "student", name: "Student Pass", price: 7999, perks: "Valid student ID required at check-in" }
    ],
    schedule: [
      {
        day: "Day 1 — Nov 12",
        items: [
          { time: "09:00", title: "Registration & Breakfast", desc: "Badge pickup in the Aurora foyer.", who: "" },
          { time: "10:00", title: "Opening Keynote: Platforms That Survive Success", desc: "Scaling a platform org past 400 engineers.", who: "Ananya Raghavan" },
          { time: "11:30", title: "Boring Infrastructure Wins", desc: "Multi-region architecture without heroics.", who: "Marcus Ellery" },
          { time: "14:00", title: "Track Sessions: Build & Release", desc: "Six parallel talks on CI, caching and monorepos.", who: "" },
          { time: "17:30", title: "Welcome Reception", desc: "Expo hall opens with food stalls and live music.", who: "" }
        ]
      },
      {
        day: "Day 2 — Nov 13",
        items: [
          { time: "09:30", title: "Evaluating LLMs When Mistakes Are Expensive", desc: "Practical evaluation harnesses for production models.", who: "Yusuf Al-Amin" },
          { time: "11:00", title: "Workshop: Profiling Real Workloads", desc: "Bring a laptop; we profile your own service.", who: "" },
          { time: "13:30", title: "Panel: The Cost of Complexity", desc: "Four architects argue about microservices. Again.", who: "" },
          { time: "16:00", title: "Lightning Talks", desc: "Twelve speakers, five minutes each, no slides allowed.", who: "" }
        ]
      },
      {
        day: "Day 3 — Nov 14",
        items: [
          { time: "10:00", title: "Open Source Office Hours", desc: "Maintainer tables across the expo hall.", who: "" },
          { time: "12:00", title: "Community Awards", desc: "Recognising contributors of the year.", who: "" },
          { time: "15:00", title: "Closing Keynote & Roadmap", desc: "What the next twelve months look like.", who: "Ananya Raghavan" }
        ]
      }
    ],
    gallery: ["images/event-1.jpg", "images/hero.jpg", "images/event-6.jpg", "images/event-5.jpg"]
  },
  {
    id: "ai-builders-lab",
    title: "AI Builders Lab",
    category: "workshop",
    date: "2026-10-24",
    endDate: "2026-10-24",
    time: "10:00 – 17:00",
    city: "Hyderabad, India",
    venue: "Forge Studio, HITEC City",
    price: 10999,
    image: "images/event-2.jpg",
    featured: false,
    seatsLeft: 48,
    summary: "A one-day hands-on lab where every attendee ships a working retrieval pipeline and an evaluation suite by the end of the day.",
    description:
      "No slide marathons. AI Builders Lab is a workshop with 48 seats, three instructors and one goal: you leave with a retrieval-augmented application you actually understand. We cover chunking strategies, embedding choices, evaluation harnesses and the unglamorous work of measuring quality over time.",
    speakers: ["sp-6", "sp-1"],
    tickets: [
      { type: "standard", name: "Standard Seat", price: 10999, perks: "Workshop seat, lunch and starter repository" },
      { type: "vip", name: "Mentor Seat", price: 23999, perks: "Everything plus a 45-minute 1:1 architecture review" },
      { type: "student", name: "Student Seat", price: 3999, perks: "Limited to 10 seats per cohort" }
    ],
    schedule: [
      {
        day: "Morning",
        items: [
          { time: "10:00", title: "Environment Setup", desc: "Clone the starter repo and verify your keys.", who: "" },
          { time: "10:45", title: "Chunking & Embeddings", desc: "Why your retrieval quality is probably a chunking problem.", who: "Yusuf Al-Amin" },
          { time: "12:15", title: "Build Block 1", desc: "Implement the ingest pipeline.", who: "" }
        ]
      },
      {
        day: "Afternoon",
        items: [
          { time: "14:00", title: "Evaluation Harnesses", desc: "Golden sets, regression runs and drift alerts.", who: "Yusuf Al-Amin" },
          { time: "15:30", title: "Build Block 2", desc: "Wire evaluation into CI.", who: "" },
          { time: "16:40", title: "Demos & Debrief", desc: "Show what you shipped.", who: "" }
        ]
      }
    ],
    gallery: ["images/event-2.jpg", "images/event-1.jpg", "images/event-6.jpg"]
  },
  {
    id: "founders-pitch-night",
    title: "Founders Pitch Night",
    category: "meetup",
    date: "2026-10-08",
    endDate: "2026-10-08",
    time: "18:30 – 22:00",
    city: "Mumbai, India",
    venue: "The Loft, Lower Parel",
    price: 0,
    image: "images/event-3.jpg",
    featured: false,
    seatsLeft: 90,
    summary: "Ten early-stage founders pitch to a room of operators and investors. Free entry, honest feedback, generous networking.",
    description:
      "Every second Thursday we hand the stage to ten founders for six minutes each. No pitch decks longer than eight slides, no buzzword bingo. A rotating panel of operators gives feedback in public, and the room stays open for two hours of networking afterwards.",
    speakers: ["sp-5"],
    tickets: [
      { type: "standard", name: "General Entry", price: 0, perks: "Free entry, first come first served" },
      { type: "vip", name: "Founder Table", price: 6499, perks: "Reserved table, pitch slot consideration and intro list" },
      { type: "student", name: "Student Entry", price: 0, perks: "Free with a valid student ID" }
    ],
    schedule: [
      {
        day: "Evening",
        items: [
          { time: "18:30", title: "Doors & Networking", desc: "Grab a badge and a drink.", who: "" },
          { time: "19:15", title: "Pitch Round 1", desc: "Five founders, six minutes each.", who: "" },
          { time: "20:15", title: "Fireside: Distribution Beats Product", desc: "Building outside the usual startup hubs.", who: "Camila Ordoñez" },
          { time: "21:00", title: "Pitch Round 2 & Open Floor", desc: "Five more founders and audience Q&A.", who: "" }
        ]
      }
    ],
    gallery: ["images/event-3.jpg", "images/event-4.jpg"]
  },
  {
    id: "design-systems-summit",
    title: "Design Systems Summit",
    category: "summit",
    date: "2026-12-03",
    endDate: "2026-12-04",
    time: "09:30 – 18:00",
    city: "Pune, India",
    venue: "Vantage Hall, Kharadi",
    price: 22999,
    image: "images/event-4.jpg",
    featured: true,
    seatsLeft: 140,
    summary: "Two days on the craft and politics of design systems — tokens, governance, accessibility and the handoff that never quite works.",
    description:
      "Design Systems Summit brings together the people who maintain the components everyone else uses. Sessions are split between craft (tokens, theming, motion, accessibility audits) and organisation (funding a system, measuring adoption, surviving a rebrand). Expect blunt case studies and very few perfect stories.",
    speakers: ["sp-3", "sp-5"],
    tickets: [
      { type: "standard", name: "Standard Pass", price: 22999, perks: "Both days, all sessions and recordings" },
      { type: "vip", name: "VIP Pass", price: 45499, perks: "Adds portfolio reviews and the maintainers' dinner" },
      { type: "student", name: "Student Pass", price: 7499, perks: "Valid student ID required at check-in" }
    ],
    schedule: [
      {
        day: "Day 1 — Dec 3",
        items: [
          { time: "09:30", title: "Design Systems as a Product", desc: "Roadmaps, support tiers and deprecation policy.", who: "Hana Watanabe" },
          { time: "11:15", title: "Token Architecture in Practice", desc: "Semantic layers that survive a rebrand.", who: "" },
          { time: "14:00", title: "Accessibility Audit Clinic", desc: "Bring a component, leave with findings.", who: "" }
        ]
      },
      {
        day: "Day 2 — Dec 4",
        items: [
          { time: "09:45", title: "Measuring Adoption Honestly", desc: "What to count and what to ignore.", who: "" },
          { time: "11:30", title: "Funding the System", desc: "Making the business case year after year.", who: "Camila Ordoñez" },
          { time: "15:00", title: "Closing Panel", desc: "Maintainers answer the hard questions.", who: "" }
        ]
      }
    ],
    gallery: ["images/event-4.jpg", "images/hero.jpg", "images/event-3.jpg"]
  },
  {
    id: "cyber-defense-expo",
    title: "Cyber Defense Expo",
    category: "conference",
    date: "2027-01-21",
    endDate: "2027-01-22",
    time: "09:00 – 19:00",
    city: "Delhi NCR, India",
    venue: "Meridian Expo Centre, Aerocity",
    price: 37999,
    image: "images/event-5.jpg",
    featured: false,
    seatsLeft: 510,
    summary: "The region's largest security gathering: threat intelligence briefings, a live attack range and 80 exhibiting vendors.",
    description:
      "Cyber Defense Expo pairs a serious briefing track with a live attack range where blue teams defend a simulated environment in front of an audience. Content covers supply-chain risk, identity, detection engineering and the regulatory landscape that keeps shifting underneath all of it.",
    speakers: ["sp-4", "sp-2"],
    tickets: [
      { type: "standard", name: "Delegate Pass", price: 37999, perks: "Both days, briefings and expo floor" },
      { type: "vip", name: "Executive Pass", price: 74499, perks: "Closed-door briefings and the CISO roundtable" },
      { type: "student", name: "Student Pass", price: 9899, perks: "Expo floor plus selected briefings" }
    ],
    schedule: [
      {
        day: "Day 1 — Jan 21",
        items: [
          { time: "09:00", title: "Anatomy of a Supply-Chain Breach", desc: "A full timeline, from first commit to disclosure.", who: "Daniel Brecht" },
          { time: "11:00", title: "Live Attack Range Opens", desc: "Blue teams defend in real time.", who: "" },
          { time: "14:30", title: "Identity Is the New Perimeter", desc: "Practical rollout of phishing-resistant auth.", who: "Marcus Ellery" }
        ]
      },
      {
        day: "Day 2 — Jan 22",
        items: [
          { time: "09:30", title: "Detection Engineering Workshop", desc: "Write rules against real telemetry.", who: "" },
          { time: "13:00", title: "CISO Roundtable", desc: "Executive pass holders only.", who: "Daniel Brecht" },
          { time: "16:30", title: "Range Finals & Awards", desc: "Scores, replays and lessons learned.", who: "" }
        ]
      }
    ],
    gallery: ["images/event-5.jpg", "images/event-1.jpg", "images/hero.jpg"]
  },
  {
    id: "cloud-scale-forum",
    title: "Cloud Scale Forum",
    category: "summit",
    date: "2026-09-26",
    endDate: "2026-09-26",
    time: "10:00 – 16:30",
    city: "Chennai, India",
    venue: "Harbour Pavilion, Guindy",
    price: 15699,
    image: "images/event-6.jpg",
    featured: false,
    seatsLeft: 0,
    summary: "A single-track day on cost, reliability and the operational reality of running large cloud estates.",
    description:
      "One stage, one track, no parallel FOMO. Cloud Scale Forum is built for the people who carry the pager: capacity planning, cost attribution that finance actually accepts, incident review culture and the trade-offs of multi-cloud. Sessions are 25 minutes with 15 minutes of questions, because the questions are the point.",
    speakers: ["sp-2", "sp-1"],
    tickets: [
      { type: "standard", name: "Standard Pass", price: 15699, perks: "Full day, lunch and session recordings" },
      { type: "vip", name: "Roundtable Pass", price: 31499, perks: "Adds the afternoon practitioner roundtable" },
      { type: "student", name: "Student Pass", price: 4899, perks: "Valid student ID required at check-in" }
    ],
    schedule: [
      {
        day: "Single Track",
        items: [
          { time: "10:00", title: "Capacity Planning Without Crystal Balls", desc: "Forecasting that tolerates being wrong.", who: "Marcus Ellery" },
          { time: "11:30", title: "Cost Attribution Finance Will Accept", desc: "Tags, showback and hard conversations.", who: "" },
          { time: "14:00", title: "Incident Reviews That Change Behaviour", desc: "Beyond the blameless template.", who: "Ananya Raghavan" },
          { time: "15:30", title: "Practitioner Roundtable", desc: "Roundtable pass holders only.", who: "" }
        ]
      }
    ],
    gallery: ["images/event-6.jpg", "images/event-2.jpg"]
  }
];

const TESTIMONIALS = [
  {
    quote: "The only conference where I left with three concrete changes to make on Monday morning. The hallway track alone paid for the ticket.",
    name: "Priya Menon",
    role: "Engineering Manager, Trellis Pay",
    photo: "images/speaker-1.jpg"
  },
  {
    quote: "Registration took two minutes, the schedule app actually worked, and every session started on time. Operationally the best run event I have attended.",
    name: "Rohan Desai",
    role: "Head of Platform, Kite Logistics",
    photo: "images/speaker-2.jpg"
  },
  {
    quote: "We hired two engineers from the expo floor and signed our first enterprise pilot at the founders night. Worth every rupee.",
    name: "Sofia Martins",
    role: "Co-founder, Arcwell",
    photo: "images/speaker-5.jpg"
  }
];

const TEAM = [
  { name: "Ananya Raghavan", role: "Programme Director", photo: "images/speaker-1.jpg" },
  { name: "Marcus Ellery", role: "Head of Partnerships", photo: "images/speaker-2.jpg" },
  { name: "Hana Watanabe", role: "Experience & Design Lead", photo: "images/speaker-3.jpg" },
  { name: "Camila Ordoñez", role: "Community Director", photo: "images/speaker-5.jpg" }
];
