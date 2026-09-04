/* Neighborhood Navigators — shared editorial dataset.
   Loaded before main.js on every page. Powers the property navigator,
   the listings gallery, the property detail page, the journal and the
   article reader. */
(function () {
  "use strict";
  var NN = (window.NN = window.NN || {});

  /* ---------- properties ---------- */
  NN.properties = [
    {
      slug: "ocean-view-manor",
      name: "Ocean View Manor",
      place: "Seaside City, CA 90265",
      region: "Coastal",
      type: "Villa",
      status: "Available",
      price: "$12,400,000",
      priceBand: "$10M–15M",
      beds: 6, baths: 7, sqm: 612, lot: "1.8 acres", year: 2021,
      summary: "A glass-walled pavilion set into the bluff above the Pacific, organised around a single oak promenade that runs from gatehouse to infinity edge.",
      hero: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80"
      ],
      materials: [
        { name: "Bluff Limestone", color: "#d8cfc1" },
        { name: "Smoked Oak", color: "#6b5a47" },
        { name: "Bronze Frame", color: "#7c6a4f" },
        { name: "Sea Glass", color: "#9fb6b8" }
      ],
      light: "https://images.unsplash.com/photo-1505693416388-ac5ce0680697?auto=format&fit=crop&w=1800&q=80",
      map: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=80"
    },
    {
      slug: "willowbrook-estates",
      name: "Willowbrook Estates",
      place: "Woodland Heights, TX 77002",
      region: "Urban",
      type: "Estate",
      status: "Available",
      price: "$8,950,000",
      priceBand: "$5M–10M",
      beds: 5, baths: 6, sqm: 540, lot: "2.1 acres", year: 2019,
      summary: "A low-slung brick pavilion threaded by a reflecting court, its canopy of live oaks preserved as the organising principle of the plan.",
      hero: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2000&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80"
      ],
      materials: [
        { name: "Handmade Brick", color: "#8a4b3a" },
        { name: "Live Oak", color: "#5a5247" },
        { name: "Black Steel", color: "#2b2b2b" },
        { name: "Reed White", color: "#ece7dd" }
      ],
      light: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=80",
      map: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1800&q=80"
    },
    {
      slug: "sunset-ridge-villas",
      name: "Sunset Ridge Villas",
      place: "Sunset Hills, FL 33602",
      region: "Coastal",
      type: "Villa",
      status: "Under Offer",
      price: "$6,200,000",
      priceBand: "$5M–10M",
      beds: 4, baths: 5, sqm: 410, lot: "0.9 acres", year: 2022,
      summary: "Three interlocking concrete volumes stepping down the ridge, each framed to a single band of western light.",
      hero: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=2000&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1564013799919-ab6000b0a1ee?auto=format&fit=crop&w=1600&q=80"
      ],
      materials: [
        { name: "Board-Form Concrete", color: "#b9b2a6" },
        { name: "Teak Joinery", color: "#9a6b43" },
        { name: "Brass Trim", color: "#b08a4f" },
        { name: "Sky Plaster", color: "#e6e4df" }
      ],
      light: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1800&q=80",
      map: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&w=1800&q=80"
    },
    {
      slug: "cedarwood-retreat",
      name: "Cedarwood Retreat",
      place: "Serenity Springs, AZ 85001",
      region: "Highland",
      type: "Retreat",
      status: "Available",
      price: "$4,750,000",
      priceBand: "$2M–5M",
      beds: 4, baths: 4, sqm: 358, lot: "6.4 acres", year: 2020,
      summary: "A cedar-clad longhouse folded into the desert draw, harvesting morning light along a single clerestory.",
      hero: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=2000&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80"
      ],
      materials: [
        { name: "Charred Cedar", color: "#3b332b" },
        { name: "Rammed Earth", color: "#9c6b4a" },
        { name: "Blackened Steel", color: "#262422" },
        { name: "Desert Sand", color: "#d8c9ad" }
      ],
      light: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1800&q=80",
      map: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=1800&q=80"
    },
    {
      slug: "lakeside-haven",
      name: "Lakeside Haven",
      place: "Waterfront Bay, MN 55401",
      region: "Highland",
      type: "Estate",
      status: "Available",
      price: "$7,300,000",
      priceBand: "$5M–10M",
      beds: 5, baths: 5, sqm: 488, lot: "3.2 acres", year: 2018,
      summary: "A horizontal timber bar hovering over the lake, lifted on a stone plinth that becomes the boathouse below.",
      hero: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=2000&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&w=1600&q=80"
      ],
      materials: [
        { name: "Lake Stone", color: "#7d8a86" },
        { name: "White Pine", color: "#cdb89a" },
        { name: "Slate Roof", color: "#41474a" },
        { name: "Reed Green", color: "#7b8466" }
      ],
      light: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1800&q=80",
      map: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?auto=format&fit=crop&w=1800&q=80"
    },
    {
      slug: "mountain-view-acres",
      name: "Mountain View Acres",
      place: "Mountainville, CO 80303",
      region: "Highland",
      type: "Estate",
      status: "Sold",
      price: "$9,800,000",
      priceBand: "$5M–10M",
      beds: 6, baths: 7, sqm: 590, lot: "12.0 acres", year: 2017,
      summary: "A granite ranch compound clustered around a wind-protected court, with a glass spine opening to the divide.",
      hero: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=2000&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80"
      ],
      materials: [
        { name: "Quarry Granite", color: "#7a736b" },
        { name: "Douglas Fir", color: "#9a6b3c" },
        { name: "Cor-Ten Steel", color: "#8a4b34" },
        { name: "Snow White", color: "#e9e6df" }
      ],
      light: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=80",
      map: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1800&q=80"
    },
    {
      slug: "oakridge-meadows",
      name: "Oakridge Meadows",
      place: "Peaceful Grove, WA 98001",
      region: "Urban",
      type: "House",
      status: "Available",
      price: "$3,650,000",
      priceBand: "$2M–5M",
      beds: 4, baths: 4, sqm: 312, lot: "1.4 acres", year: 2023,
      summary: "A gabled meadow house wrapped in a continuous veranda, its rooms strung along a north-south spine of oak.",
      hero: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1564013799919-ab6000b0a1ee?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=1600&q=80"
      ],
      materials: [
        { name: "White Oak", color: "#b89a6a" },
        { name: "Lime Render", color: "#ece7dd" },
        { name: "Zinc Roof", color: "#8b9094" },
        { name: "Meadow Green", color: "#8a9a6b" }
      ],
      light: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=80",
      map: "https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&w=1800&q=80"
    },
    {
      slug: "riverbend-ranch",
      name: "Riverbend Ranch",
      place: "Riverside Ranch, OR 97001",
      region: "Highland",
      type: "Retreat",
      status: "Under Offer",
      price: "$5,900,000",
      priceBand: "$5M–10M",
      beds: 5, baths: 5, sqm: 462, lot: "8.7 acres", year: 2019,
      summary: "A working ranch reimagined as a low concrete bar hugging the river bend, with hay-barn volumes for guest wings.",
      hero: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80"
      ],
      materials: [
        { name: "River Cobble", color: "#9a9389" },
        { name: "Barn Red", color: "#7c3b2e" },
        { name: "Wheat Straw", color: "#c9b178" },
        { name: "Washed Oak", color: "#a98a5e" }
      ],
      light: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1800&q=80",
      map: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=1800&q=80"
    },
    {
      slug: "prairie-pointe-residence",
      name: "Prairie Pointe Residence",
      place: "Prairieville, IL 60601",
      region: "Urban",
      type: "House",
      status: "Available",
      price: "$2,950,000",
      priceBand: "$2M–5M",
      beds: 4, baths: 3, sqm: 290, lot: "2.3 acres", year: 2021,
      summary: "A prairie-long house stretched along the horizon, its low eaves casting a single band of shade across the lawn.",
      hero: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=2000&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
      ],
      materials: [
        { name: "Prairie Brick", color: "#9a5a3a" },
        { name: "Cherokee Red", color: "#7c3b2e" },
        { name: "Cream Render", color: "#e7e0d3" },
        { name: "Slate", color: "#5a5f63" }
      ],
      light: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=80",
      map: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=80"
    },
    {
      slug: "sentinel-ridge",
      name: "Sentinel Ridge",
      place: "Summit Park, UT 84098",
      region: "Highland",
      type: "Villa",
      status: "Available",
      price: "$11,200,000",
      priceBand: "$10M–15M",
      beds: 5, baths: 6, sqm: 540, lot: "4.6 acres", year: 2020,
      summary: "A sentinel of board-formed concrete and glass set against the ridge, its prow aimed at the cirque above.",
      hero: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=2000&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80"
      ],
      materials: [
        { name: "Board Concrete", color: "#b9b2a6" },
        { name: "Blackened Oak", color: "#2f2a24" },
        { name: "Hot-Rolled Steel", color: "#5a4a3a" },
        { name: "Glacier Glass", color: "#aab6bd" }
      ],
      light: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=80",
      map: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1800&q=80"
    }
  ];

  /* ---------- services ---------- */
  NN.services = [
    {
      id: "brokerage", name: "Real Estate Brokerage",
      intro: "Private representation for buyers and sellers of architecturally significant homes, from first viewing to final signature.",
      steps: [
        { t: "Discovery", d: "We map your brief, your districts and your non-negotiables before a single viewing is arranged." },
        { t: "Sourcing", d: "Off-market access to residences that never reach the public portals, drawn from our twenty-five-year register." },
        { t: "Representation", d: "A single advisor accompanies every viewing, offer and counter-offer, holding your position quietly." },
        { t: "Closing", d: "Title, survey and transfer handled in-house so the handover is the quietest part of the journey." }
      ],
      related: "sentinel-ridge"
    },
    {
      id: "management", name: "Property Management",
      intro: "Quiet, continuous stewardship — maintenance schedules, tenancy, groundskeeping and reporting handled by one desk.",
      steps: [
        { t: "Onboarding", d: "We survey the residence, photograph its condition and schedule its first maintenance cycle." },
        { t: "Stewardship", d: "A dedicated desk handles vendors, tenancy, grounds and the seasonal calendar of works." },
        { t: "Reporting", d: "Quarterly statements of condition, occupancy and spend, written in plain language." },
        { t: "Guardianship", d: "Between tenancies the house is aired, checked and held to a curated standard of readiness." }
      ],
      related: "ocean-view-manor"
    },
    {
      id: "investment", name: "Investment Services",
      intro: "Yield modelling, district research and long-horizon acquisition strategy for portfolios that must outlive a cycle.",
      steps: [
        { t: "Research", d: "District studies, planning risk and infrastructure horizon, compiled into a single position paper." },
        { t: "Modelling", d: "Cash-flow, yield and exit models stress-tested across three cycles before any recommendation." },
        { t: "Acquisition", d: "We negotiate, acquire and onboard the asset into your portfolio with a clean paper trail." },
        { t: "Strategy", d: "Annual review of hold, refinance or divest, against your stated long-horizon objectives." }
      ],
      related: "willowbrook-estates"
    }
  ];

  /* ---------- team ---------- */
  NN.team = [
    { name: "Mara Lindqvist", role: "Founding Partner", photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80", bio: "Twenty-five years advising on architectural estates across three continents." },
    { name: "Idris Otieno", role: "Head of Brokerage", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80", bio: "Off-market specialist; closes more listed residences than any desk on the coast." },
    { name: "Yuki Tanabe", role: "Head of Studio", photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=900&q=80", bio: "Leads the drawing office — plan, light study and material palette for every listing." },
    { name: "Sofia Marchetti", role: "Head of Management", photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=900&q=80", bio: "Runs the stewardship desk that keeps estates held to a single standard year-round." }
  ];

  /* ---------- journal ---------- */
  NN.articles = [
    {
      slug: "the-quiet-listing",
      category: "Markets",
      title: "The Quiet Listing",
      excerpt: "Why the most significant residences change hands without ever reaching a portal — and how the register behind them is built.",
      author: "Mara Lindqvist", date: "12 Aug 2026", read: "7 min",
      cover: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80",
      body: "<p class=\"lead\">For every residence that reaches a public portal, perhaps three more change hands in private. The architecture is the same; only the audience differs.</p><p>The register behind a quiet listing is not a vault of secrets. It is a long ledger of relationships — owners, architects, the advisors who first walked the site — kept current over decades. A house enters the register years before it is ever for sale.</p><blockquote>The most considered sales are the ones no one sees happen.</blockquote><p>When a residence is ready to move, the advisor knows which of perhaps a dozen households would receive it well, and the conversation begins there. There is no open house, no photographer's day, no race to closing.</p><figure><img loading=\"lazy\" src=\"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80\" alt=\"Editorial interior detail\" /><figcaption>Fig. 01 — A residence held off-market for eighteen months before transfer.</figcaption></figure><p>The discipline is patience: the right match, not the fastest offer. Measured in seasons rather than weeks, the quiet listing tends to settle closer to the value both parties believe the architecture deserves.</p>"
    },
    {
      slug: "drawing-the-plan",
      category: "Architecture",
      title: "Drawing The Plan",
      excerpt: "Before a residence is listed, it is measured, drawn and re-drawn. A note on why the studio still draws by hand first.",
      author: "Yuki Tanabe", date: "28 Jul 2026", read: "6 min",
      cover: "https://images.unsplash.com/photo-1503387762-1592fe7ba672?auto=format&fit=crop&w=2000&q=80",
      body: "<p class=\"lead\">The isometric drawing on every listing page is the studio's first act of interpretation — not decoration, but analysis.</p><p>We begin in pencil. The residence is walked, measured and sketched in three dimensions before any photograph is taken. The drawing reveals what the camera flattens: how the volumes step, where the light is gathered, how the plan resolves to its single promenade.</p><blockquote>A drawing tells you what the house wants to be; a photograph only tells you what it is today.</blockquote><p>Only when the drawing is settled does the survey follow, and the material palette alongside it. By the time a listing appears, the studio knows the house as an architect would — from the inside out.</p><figure><img loading=\"lazy\" src=\"https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80\" alt=\"Architectural drawing desk\" /><figcaption>Fig. 02 — First-pass isometric, pencil on trace.</figcaption></figure><p>The plan published alongside each residence is the same drawing the advisor carries into every viewing. It is the house, reduced to its argument.</p>"
    },
    {
      slug: "the-holding-period",
      category: "Markets",
      title: "The Holding Period",
      excerpt: "A long-horizon view of how architectural residences perform across cycles, and why time is the asset's quiet ally.",
      author: "Idris Otieno", date: "09 Jul 2026", read: "8 min",
      cover: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80",
      body: "<p class=\"lead\">Architectural residences do not behave like commodities. Their value accrues against the architect's reputation, the rarity of the site, and the patience of the holder.</p><p>Across the cycles we have tracked, residences held beyond a single full cycle — call it a decade — have settled at a premium to those traded quickly. The house has had time to be photographed, written about, and entered into the register of a region.</p><blockquote>Time is the part of the asset that cannot be bought, only waited for.</blockquote><p>This is not advice to hold indefinitely. It is advice to read the house as a long instrument: acquired deliberately, held through at least one cycle, and released when the story of the place has been written.</p><figure><img loading=\"lazy\" src=\"https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80\" alt=\"Editorial data desk\" /><figcaption>Fig. 03 — Hold-return study, coastal districts, 1998–2026.</figcaption></figure>"
    },
    {
      slug: "material-as-memory",
      category: "Living",
      title: "Material As Memory",
      excerpt: "Why the studio publishes a material palette for every listing, and how a swatch outlives a trend.",
      author: "Yuki Tanabe", date: "21 Jun 2026", read: "5 min",
      cover: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=2000&q=80",
      body: "<p class=\"lead\">A material palette is the most honest portrait of a residence. It outlives the furniture, the season, and often the occupant.</p><p>Stone, timber, metal and render — the four families the studio records for every listing — tell you how the house will age. Board-formed concrete deepens; oak mellows; bronze greens quietly into itself.</p><blockquote>Trends are seasonal; materials are geological.</blockquote><p>When we publish a palette, we are publishing the house's future. The buyer who reads it that way is rarely surprised by the residence a decade on.</p><figure><img loading=\"lazy\" src=\"https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1600&q=80\" alt=\"Material swatches\" /><figcaption>Fig. 04 — Four-family palette, Cedarwood Retreat.</figcaption></figure>"
    },
    {
      slug: "the-studio-notebook",
      category: "Studio",
      title: "The Studio Notebook",
      excerpt: "A note from the founding partner on twenty-five years of measuring, drawing and stewarding architectural estates.",
      author: "Mara Lindqvist", date: "03 Jun 2026", read: "6 min",
      cover: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=2000&q=80",
      body: "<p class=\"lead\">We did not set out to be a brokerage. We set out to be a studio that happened to sell the houses it understood best.</p><p>Twenty-five years on, the principle holds: every residence is measured, drawn and re-drawn before it is listed. The advisor who walks you through it has walked it as an architect would, from the promenade inward.</p><blockquote>Sell the house the way you would build it — from the plan out.</blockquote><p>The studio now numbers fifty — architects, advisors and a stewardship desk — across three continents. The notebook that began as a single ledger has become the register that quietly moves our most significant residences.</p><figure><img loading=\"lazy\" src=\"https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80\" alt=\"Studio desk\" /><figcaption>Fig. 05 — The founding ledger, 1998.</figcaption></figure>"
    },
    {
      slug: "light-as-program",
      category: "Architecture",
      title: "Light As Program",
      excerpt: "How a light study — not a floor plan — first organises the brief for a residence the studio takes on.",
      author: "Yuki Tanabe", date: "14 May 2026", read: "7 min",
      cover: "https://images.unsplash.com/photo-1503387762-1592fe7ba672?auto=format&fit=crop&w=2000&q=80",
      body: "<p class=\"lead\">Before rooms are arranged, light is arranged. The studio's first drawing for any residence is a study of where the day lands.</p><p>A residence lives or dies by its light. The light study maps the sun's path across the site across the seasons, and from it the plan resolves almost without argument — living where morning falls, sleeping where it does not.</p><blockquote>Plan the day before you plan the rooms.</blockquote><p>When we publish a listing, the light study sits beside the plan. It is the reason the house feels the way it does — the part no photograph quite captures.</p><figure><img loading=\"lazy\" src=\"https://images.unsplash.com/photo-1505693416388-ac5ce0680697?auto=format&fit=crop&w=1600&q=80\" alt=\"Interior light study\" /><figcaption>Fig. 06 — Western light study, Sunset Ridge.</figcaption></figure>"
    }
  ];
})();
