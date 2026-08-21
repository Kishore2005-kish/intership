/* Catalogue data — plain JS, no modules. */
window.PRODUCTS = [
  {
    id: "plaid-jeans",
    name: "Wide Leg Denim Jeans",
    price: 22000,
    category: "Bottoms",
    tag: "Best Sellers",
    collection: "essentials",
    sizes: ["24", "26", "28", "30", "32"],
    img: "img/p-jeans.jpg",
    alt: "Wide leg faded blue denim jeans",
    fabric: "100% Japanese selvedge cotton, 13.5oz, rinse washed.",
    desc: "A relaxed, floor-skimming leg cut from rigid Japanese denim that softens with every wear."
  },
  {
    id: "machete-jacket",
    name: "Machete Leather Jacket",
    price: 80000,
    category: "Outerwear",
    tag: "Best Sellers",
    collection: "outerwear",
    sizes: ["XS", "S", "M", "L", "XL"],
    img: "img/p-jacket.jpg",
    alt: "Black leather biker jacket",
    fabric: "Vegetable-tanned lambskin, cupro lining, antique nickel hardware.",
    desc: "A cropped biker silhouette with a clean asymmetric zip — built to mould to the body over years."
  },
  {
    id: "jacquard-cardigan",
    name: "Jacquard Hooded Cardigan",
    price: 20000,
    category: "Knitwear",
    tag: "Best Sellers",
    collection: "essentials",
    sizes: ["S", "M", "L"],
    img: "img/p-cardigan.jpg",
    alt: "Grey knitted short sleeve hooded cardigan",
    fabric: "72% merino wool, 28% cotton. Fully fashioned panels.",
    desc: "Short-sleeved and hooded, knitted in a dense jacquard rib with deep patch pockets."
  },
  {
    id: "portrait-tee",
    name: "Blurred Portrait Tee",
    price: 12000,
    category: "Tops",
    tag: "Limited Edition",
    collection: "limited",
    sizes: ["XS", "S", "M", "L", "XL"],
    img: "img/p-tee.jpg",
    alt: "Black t-shirt with white line portrait print",
    fabric: "220gsm organic combed cotton, water-based screen print.",
    desc: "A single-line portrait printed by hand in small runs. Numbered on the inner hem."
  },
  {
    id: "leather-sneakers",
    name: "Sculpted Leather Sneakers",
    price: 59000,
    category: "Footwear",
    tag: "New Arrivals",
    collection: "essentials",
    sizes: ["39", "40", "41", "42", "43", "44"],
    img: "img/p-sneakers.jpg",
    alt: "Black low profile leather sneakers",
    fabric: "Full-grain calf leather upper, moulded rubber sole.",
    desc: "A low, quiet trainer with a sculpted toe and no visible branding."
  },
  {
    id: "pleated-trousers",
    name: "Premium Pleated Casual Pants",
    price: 32000,
    category: "Bottoms",
    tag: "New Arrivals",
    collection: "essentials",
    sizes: ["S", "M", "L", "XL"],
    img: "img/p-trousers.jpg",
    alt: "Grey pleated wide leg trousers",
    fabric: "Wool-blend suiting with a soft drape, elasticated back waist.",
    desc: "Double-pleated and generously cut, finished with a clean pressed crease."
  },
  {
    id: "woven-mini-bag",
    name: "Leather Shoulder Mini Bag",
    price: 40000,
    category: "Accessories",
    tag: "New Arrivals",
    collection: "essentials",
    sizes: ["One size"],
    img: "img/p-bag.jpg",
    alt: "Small black leather shoulder bag",
    fabric: "Smooth calf leather, suede lining, detachable strap.",
    desc: "A compact everyday shoulder bag with a soft slouched top line."
  },
  {
    id: "textured-overshirt",
    name: "Textured Cropped Overshirt",
    price: 26000,
    category: "Tops",
    tag: "Everyday Essentials",
    collection: "essentials",
    sizes: ["XS", "S", "M", "L"],
    img: "img/p-overshirt.jpg",
    alt: "Black cropped textured overshirt",
    fabric: "Ottoman-ribbed cotton blend, unlined.",
    desc: "Boxy, cropped and slightly structured — a layer that holds its shape."
  },
  {
    id: "mockneck-top",
    name: "Merino Mock Long Sleeve Top",
    price: 18000,
    category: "Knitwear",
    tag: "Everyday Essentials",
    collection: "essentials",
    sizes: ["XS", "S", "M", "L"],
    img: "img/p-mockneck.jpg",
    alt: "Model wearing a black merino mock neck top",
    fabric: "18.5 micron extra-fine merino wool.",
    desc: "The base layer of the wardrobe: fine merino, mock neck, second-skin fit."
  },
  {
    id: "wool-overcoat",
    name: "Long Wool Overcoat",
    price: 94000,
    category: "Outerwear",
    tag: "Limited Edition",
    collection: "outerwear",
    sizes: ["S", "M", "L", "XL"],
    img: "img/p-coat.jpg",
    alt: "Long grey wool overcoat",
    fabric: "Italian double-faced wool, horn buttons, viscose lining.",
    desc: "A single-breasted overcoat cut past the knee with roomy shoulders."
  },
  {
    id: "atelier-scarf",
    name: "Oversized Wool Scarf",
    price: 15000,
    category: "Accessories",
    tag: "Everyday Essentials",
    collection: "autumn",
    sizes: ["One size"],
    img: "img/hero-1.jpg",
    alt: "Model wrapped in an oversized wool scarf",
    fabric: "Brushed lambswool, hand-knotted fringe.",
    desc: "Blanket-scale and brushed soft, meant to be wrapped twice."
  },
  {
    id: "studio-coat",
    name: "Studio Motion Coat",
    price: 72000,
    category: "Outerwear",
    tag: "Limited Edition",
    collection: "autumn",
    sizes: ["S", "M", "L"],
    img: "img/edit-1.jpg",
    alt: "Model walking in an oversized wool coat",
    fabric: "Melton wool, raglan sleeve, storm cuff.",
    desc: "Built for movement — the coat from the Autumn campaign, made in fifty pieces."
  }
];

window.COLLECTIONS = [
  {
    slug: "autumn",
    name: "Autumn Collection",
    img: "img/edit-1.jpg",
    alt: "Model walking in an oversized wool coat",
    copy: "Heavy wools, long lines and quiet movement. Shot on the edge of the city in early October."
  },
  {
    slug: "essentials",
    name: "Everyday Essentials",
    img: "img/p-mockneck.jpg",
    alt: "Model in a black merino mock neck top",
    copy: "The permanent library: merino bases, pleated trousers, denim and clean leather."
  },
  {
    slug: "outerwear",
    name: "Outerwear Study",
    img: "img/hero-3.jpg",
    alt: "Profile portrait of a man in a leather jacket",
    copy: "Leather and melton wool, cut close to the body. Made in limited runs each season."
  },
  {
    slug: "limited",
    name: "Limited Edition",
    img: "img/edit-2.jpg",
    alt: "Man dancing in a leather jacket",
    copy: "Numbered pieces and hand-printed graphics. Once they're gone, they don't return."
  }
];

window.STORIES = [
  {
    title: "On Wearing The Same Coat For Ten Years",
    kind: "Journal",
    date: "Oct 2026",
    img: "img/edit-1.jpg",
    alt: "Model walking in an oversized wool coat",
    excerpt: "Why the pieces that last are rarely the loudest ones in the wardrobe."
  },
  {
    title: "Inside The Atelier: Cutting Room Notes",
    kind: "Craft",
    date: "Sep 2026",
    img: "img/edit-3.jpg",
    alt: "Tailoring atelier with fabric rolls and sewing tables",
    excerpt: "Our pattern cutter on shoulder lines, seam allowance and the discipline of restraint."
  },
  {
    title: "Movement Study — Autumn Campaign",
    kind: "Lookbook",
    date: "Sep 2026",
    img: "img/edit-2.jpg",
    alt: "Man dancing in a leather jacket",
    excerpt: "Three days, one studio, no styling assistants. The campaign in frames."
  },
  {
    title: "A Case For Black And White",
    kind: "Journal",
    date: "Aug 2026",
    img: "img/hero-2.jpg",
    alt: "Two models in white shirts and dark jackets",
    excerpt: "Colour is a season. Contrast is a wardrobe."
  }
];
