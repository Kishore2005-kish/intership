const CATEGORIES = [
  { slug: "fruits", name: "Fruits", image: "images/cat-fruits.jpg" },
  { slug: "vegetables", name: "Vegetables", image: "images/cat-vegetables.jpg" },
  { slug: "dairy-eggs", name: "Dairy & Eggs", image: "images/cat-dairy.jpg" },
  { slug: "atta-rice", name: "Atta & Rice", image: "images/cat-grains.jpg" },
  { slug: "dals-pulses", name: "Dals & Pulses", image: "images/cat-dals.jpg" },
  { slug: "spices", name: "Spices", image: "images/cat-spices.jpg" },
  { slug: "oils-ghee", name: "Oils & Ghee", image: "images/cat-oils.jpg" },
  { slug: "snacks", name: "Snacks", image: "images/cat-snacks.jpg" },
  { slug: "beverages", name: "Beverages", image: "images/cat-beverages.jpg" },
  { slug: "bakery", name: "Bakery", image: "images/cat-bakery.jpg" },
  { slug: "personal-care", name: "Personal Care", image: "images/cat-personal.jpg" },
  { slug: "household", name: "Household", image: "images/cat-household.jpg" },
];

const PRODUCTS = [
  // Fruits
  { id: "alphonso-mango", name: "Alphonso Mangoes", unit: "1 kg", price: 399, mrp: 460, category: "fruits", origin: "Ratnagiri, Maharashtra", bestseller: true, description: "Hand-picked Devgad-belt Alphonso, naturally ripened in hay. Sweet, fibreless and fragrant." },
  { id: "banana-robusta", name: "Robusta Bananas", unit: "6 pcs", price: 48, mrp: 60, category: "fruits", origin: "Thrissur, Kerala", description: "Everyday breakfast bananas, firm and evenly ripened." },
  { id: "pomegranate", name: "Bhagwa Pomegranate", unit: "1 kg", price: 189, category: "fruits", origin: "Solapur, Maharashtra", description: "Deep-red arils with a thin rind and high juice content." },
  { id: "nagpur-orange", name: "Nagpur Oranges", unit: "1 kg", price: 129, mrp: 149, category: "fruits", origin: "Nagpur, Maharashtra", description: "Loose-skinned santra with a bright sweet-tart balance." },
  { id: "tender-coconut", name: "Tender Coconut", unit: "1 pc", price: 45, category: "fruits", origin: "Tiptur, Karnataka", description: "Fresh-cut elaneer with sweet water and soft malai." },
  { id: "shimla-apple", name: "Shimla Apples", unit: "1 kg", price: 219, category: "fruits", origin: "Kotgarh, Himachal Pradesh", description: "Crisp Royal Delicious apples from Himachal orchards." },

  // Vegetables
  { id: "tomato", name: "Country Tomatoes", unit: "1 kg", price: 42, mrp: 55, category: "vegetables", origin: "Kolar, Karnataka", bestseller: true, description: "Firm, tangy nati tomatoes ideal for everyday sabzi and rasam." },
  { id: "onion", name: "Nashik Onions", unit: "2 kg", price: 78, category: "vegetables", origin: "Nashik, Maharashtra", description: "Medium-sized red onions with a sharp bite and long shelf life." },
  { id: "potato", name: "Jyoti Potatoes", unit: "2 kg", price: 66, category: "vegetables", origin: "Hooghly, West Bengal", description: "All-purpose potatoes for curries, parathas and fries." },
  { id: "bhindi", name: "Tender Bhindi", unit: "500 g", price: 38, category: "vegetables", origin: "Hosur, Tamil Nadu", description: "Young okra, snapped fresh, no wooden tips." },
  { id: "coriander", name: "Coriander Bunch", unit: "100 g", price: 15, category: "vegetables", origin: "Pune, Maharashtra", description: "Farm-cut kothmir with roots intact for longer freshness." },
  { id: "green-chilli", name: "Green Chillies", unit: "250 g", price: 22, category: "vegetables", origin: "Guntur, Andhra Pradesh", description: "Medium-hot chillies for tadka and chutneys." },
  { id: "brinjal", name: "Purple Brinjal", unit: "500 g", price: 34, category: "vegetables", origin: "Kolar, Karnataka", description: "Glossy, seed-light brinjal for bharta and bharli vangi." },

  // Dairy & Eggs
  { id: "amul-butter", name: "Amul Butter", unit: "500 g", price: 275, category: "dairy-eggs", origin: "Anand, Gujarat", bestseller: true, description: "Classic salted table butter, the Indian kitchen staple." },
  { id: "toned-milk", name: "Toned Milk Pouch", unit: "1 litre", price: 56, category: "dairy-eggs", origin: "Anand, Gujarat", description: "Pasteurised toned milk delivered in the morning slot." },
  { id: "paneer", name: "Fresh Malai Paneer", unit: "400 g", price: 165, mrp: 185, category: "dairy-eggs", origin: "Karnal, Haryana", description: "Soft, unfrozen paneer set the same morning." },
  { id: "dahi", name: "Set Curd", unit: "400 g", price: 45, category: "dairy-eggs", origin: "Bengaluru, Karnataka", description: "Thick set dahi with a mild, non-sour finish." },
  { id: "brown-eggs", name: "Farm Brown Eggs", unit: "6 pcs", price: 72, category: "dairy-eggs", origin: "Namakkal, Tamil Nadu", description: "Cage-free brown eggs, candled and hand-packed." },

  // Atta & Rice
  { id: "aashirvaad-atta", name: "Aashirvaad Whole Wheat Atta", unit: "5 kg", price: 255, mrp: 295, category: "atta-rice", origin: "Ludhiana, Punjab", bestseller: true, description: "Chakki-fresh atta that gives soft, puffed rotis." },
  { id: "basmati-rice", name: "Aged Basmati Rice", unit: "5 kg", price: 649, category: "atta-rice", origin: "Karnal, Haryana", description: "Two-year aged long grain basmati for biryani and pulao." },
  { id: "sona-masoori", name: "Sona Masoori Rice", unit: "5 kg", price: 429, category: "atta-rice", origin: "Raichur, Karnataka", description: "Light, everyday rice for South Indian meals." },
  { id: "rava", name: "Bombay Rava", unit: "1 kg", price: 62, category: "atta-rice", origin: "Indore, Madhya Pradesh", description: "Fine semolina for upma, halwa and rava dosa." },
  { id: "poha", name: "Thick Poha", unit: "1 kg", price: 68, category: "atta-rice", origin: "Indore, Madhya Pradesh", description: "Thick flattened rice that stays fluffy, never mushy." },

  // Dals & Pulses
  { id: "toor-dal", name: "Toor Dal", unit: "1 kg", price: 165, mrp: 185, category: "dals-pulses", origin: "Kalaburagi, Karnataka", bestseller: true, description: "Unpolished arhar dal that cooks fast and thickens well." },
  { id: "moong-dal", name: "Moong Dal", unit: "1 kg", price: 142, category: "dals-pulses", origin: "Jalna, Maharashtra", description: "Split yellow moong for khichdi and everyday dal." },
  { id: "chana-dal", name: "Chana Dal", unit: "1 kg", price: 118, category: "dals-pulses", origin: "Vidisha, Madhya Pradesh", description: "Bold-grain chana dal for sambar and chutneys." },
  { id: "rajma", name: "Chitra Rajma", unit: "1 kg", price: 178, category: "dals-pulses", origin: "Chamba, Himachal Pradesh", description: "Small-grain hill rajma with a creamy centre." },
  { id: "kabuli-chana", name: "Kabuli Chana", unit: "1 kg", price: 135, category: "dals-pulses", origin: "Sehore, Madhya Pradesh", description: "Plump chickpeas for chole and salads." },

  // Spices
  { id: "kashmiri-chilli", name: "Kashmiri Chilli Powder", unit: "200 g", price: 120, category: "spices", origin: "Byadgi, Karnataka", bestseller: true, description: "Deep colour, gentle heat. Stone-ground in small batches." },
  { id: "turmeric", name: "Turmeric Powder", unit: "200 g", price: 78, category: "spices", origin: "Erode, Tamil Nadu", description: "High-curcumin Erode haldi with a warm aroma." },
  { id: "cumin-seeds", name: "Cumin Seeds", unit: "200 g", price: 96, category: "spices", origin: "Unjha, Gujarat", description: "Clean-sorted jeera for tadka and masalas." },
  { id: "garam-masala", name: "Garam Masala", unit: "100 g", price: 110, category: "spices", origin: "Delhi", description: "House blend of eleven spices, roasted then ground." },
  { id: "cardamom", name: "Green Cardamom", unit: "50 g", price: 240, mrp: 275, category: "spices", origin: "Idukki, Kerala", description: "Bold 8mm elaichi pods from the Cardamom Hills." },

  // Oils & Ghee
  { id: "cow-ghee", name: "Desi Cow Ghee", unit: "1 litre", price: 749, mrp: 820, category: "oils-ghee", origin: "Anand, Gujarat", bestseller: true, description: "Bilona-method ghee with a grainy texture and nutty aroma." },
  { id: "mustard-oil", name: "Kachi Ghani Mustard Oil", unit: "1 litre", price: 189, category: "oils-ghee", origin: "Bharatpur, Rajasthan", description: "Cold-pressed, pungent mustard oil for Bengali and Bihari cooking." },
  { id: "groundnut-oil", name: "Groundnut Oil", unit: "1 litre", price: 215, category: "oils-ghee", origin: "Junagadh, Gujarat", description: "Wood-pressed filtered groundnut oil for everyday frying." },
  { id: "coconut-oil", name: "Virgin Coconut Oil", unit: "500 ml", price: 320, category: "oils-ghee", origin: "Kozhikode, Kerala", description: "Cold-pressed from fresh copra, unrefined and fragrant." },

  // Snacks
  { id: "bhujia", name: "Bikaneri Bhujia", unit: "400 g", price: 145, category: "snacks", origin: "Bikaner, Rajasthan", description: "Crisp moth-dal bhujia with a peppery finish." },
  { id: "banana-chips", name: "Kerala Banana Chips", unit: "250 g", price: 135, category: "snacks", origin: "Kozhikode, Kerala", bestseller: true, description: "Fried in coconut oil, salted while hot." },
  { id: "marie-biscuits", name: "Marie Biscuits", unit: "300 g", price: 45, category: "snacks", origin: "Mumbai, Maharashtra", description: "Light tea-time biscuits, the chai companion." },
  { id: "murukku", name: "Butter Murukku", unit: "250 g", price: 110, category: "snacks", origin: "Chennai, Tamil Nadu", description: "Hand-twisted rice murukku, crunchy and mildly spiced." },

  // Beverages
  { id: "assam-tea", name: "Assam CTC Tea", unit: "500 g", price: 285, mrp: 320, category: "beverages", origin: "Dibrugarh, Assam", bestseller: true, description: "Strong malty CTC that stands up to milk and masala." },
  { id: "filter-coffee", name: "Filter Coffee Powder", unit: "500 g", price: 395, category: "beverages", origin: "Chikmagalur, Karnataka", description: "80:20 coffee-chicory blend, roasted and ground to order." },
  { id: "nimbu-sharbat", name: "Nimbu Sharbat Concentrate", unit: "750 ml", price: 175, category: "beverages", origin: "Jaipur, Rajasthan", description: "Lemon-mint concentrate for instant summer coolers." },

  // Bakery
  { id: "pav", name: "Ladi Pav", unit: "6 pcs", price: 35, category: "bakery", origin: "Mumbai, Maharashtra", description: "Soft baked pav, delivered fresh each morning." },
  { id: "brown-bread", name: "Whole Wheat Bread", unit: "400 g", price: 55, category: "bakery", origin: "Pune, Maharashtra", description: "No-maida loaf baked with whole wheat and jaggery." },
  { id: "rusk", name: "Elaichi Rusk", unit: "300 g", price: 62, category: "bakery", origin: "Kanpur, Uttar Pradesh", description: "Twice-baked cardamom rusk, made for dunking." },

  // Personal Care
  { id: "neem-soap", name: "Neem Ayurvedic Soap", unit: "3 x 100 g", price: 132, category: "personal-care", origin: "Coimbatore, Tamil Nadu", description: "Cold-processed neem and tulsi bathing bar." },
  { id: "coconut-hair-oil", name: "Coconut Hair Oil", unit: "300 ml", price: 168, category: "personal-care", origin: "Kollam, Kerala", description: "Pure coconut oil with amla and curry leaf infusion." },
  { id: "toothpaste", name: "Herbal Toothpaste", unit: "200 g", price: 118, category: "personal-care", origin: "Haridwar, Uttarakhand", description: "Clove and neem toothpaste, fluoride free." },

  // Household
  { id: "detergent", name: "Detergent Powder", unit: "2 kg", price: 245, mrp: 289, category: "household", origin: "Mumbai, Maharashtra", description: "Front-load safe powder with a light citrus scent." },
  { id: "dishwash-bar", name: "Dishwash Bar", unit: "4 x 200 g", price: 96, category: "household", origin: "Chennai, Tamil Nadu", description: "Cuts through masala grease without drying hands." },
  { id: "floor-cleaner", name: "Phenyl Floor Cleaner", unit: "1 litre", price: 155, category: "household", origin: "Hyderabad, Telangana", description: "Pine-scented disinfectant concentrate for daily mopping." },
];

/* ---------- recipes ---------- */
const RECIPES = [
  {
    id: "paneer-butter-masala",
    name: "Paneer Butter Masala",
    kicker: "North Indian · Dinner",
    time: "35 mins",
    serves: 4,
    image: "images/cat-dairy.jpg",
    blurb: "Silky tomato-cashew gravy finished with butter and cubes of fresh malai paneer. Best with hot pav or rice.",
    items: ["paneer", "tomato", "amul-butter", "garam-masala", "kashmiri-chilli", "coriander"],
  },
  {
    id: "kanda-poha",
    name: "Kanda Poha",
    kicker: "Maharashtrian · Breakfast",
    time: "15 mins",
    serves: 3,
    image: "images/cat-grains.jpg",
    blurb: "Fluffed flattened rice tempered with mustard, onion and green chilli, brightened with lemon and coriander.",
    items: ["poha", "onion", "green-chilli", "turmeric", "groundnut-oil", "coriander"],
  },
  {
    id: "rajma-chawal",
    name: "Rajma Chawal",
    kicker: "Punjabi · Lunch",
    time: "1 hr 10 mins",
    serves: 4,
    image: "images/cat-dals.jpg",
    blurb: "Slow-simmered kidney beans in an onion-tomato masala, ladled over long-grain basmati.",
    items: ["rajma", "basmati-rice", "onion", "tomato", "garam-masala", "cumin-seeds"],
  },
  {
    id: "dal-tadka",
    name: "Dal Tadka",
    kicker: "Everyday · Lunch",
    time: "30 mins",
    serves: 4,
    image: "images/cat-spices.jpg",
    blurb: "Comforting toor dal with a sizzling ghee tempering of cumin, garlic and Kashmiri chilli.",
    items: ["toor-dal", "cow-ghee", "cumin-seeds", "turmeric", "kashmiri-chilli", "tomato"],
  },
  {
    id: "masala-chai",
    name: "Kadak Masala Chai",
    kicker: "Anytime · Beverage",
    time: "10 mins",
    serves: 2,
    image: "images/cat-beverages.jpg",
    blurb: "Strong Assam leaf boiled with milk, cardamom and ginger — the four o'clock ritual.",
    items: ["assam-tea", "toned-milk", "cardamom"],
  },
  {
    id: "aloo-paratha",
    name: "Aloo Paratha",
    kicker: "North Indian · Breakfast",
    time: "45 mins",
    serves: 4,
    image: "images/cat-oils.jpg",
    blurb: "Whole-wheat flatbreads stuffed with spiced potato, griddled in ghee and served with set curd.",
    items: ["aashirvaad-atta", "potato", "cow-ghee", "green-chilli", "dahi", "garam-masala"],
  },
  {
    id: "upma",
    name: "Rava Upma",
    kicker: "South Indian · Breakfast",
    time: "20 mins",
    serves: 3,
    image: "images/cat-bakery.jpg",
    blurb: "Roasted semolina cooked soft with curry leaves, green chilli and a spoon of ghee.",
    items: ["rava", "onion", "green-chilli", "cow-ghee", "coriander"],
  },
  {
    id: "bhindi-fry",
    name: "Kurkuri Bhindi Fry",
    kicker: "Everyday · Side",
    time: "25 mins",
    serves: 3,
    image: "images/cat-vegetables.jpg",
    blurb: "Thin-sliced okra tossed in turmeric and chilli, shallow fried till crisp at the edges.",
    items: ["bhindi", "turmeric", "kashmiri-chilli", "mustard-oil", "onion"],
  },
];

/* ---------- coupons ---------- */
const COUPONS = [
  { code: "FRESH10", kind: "Store-wide", value: "10% off", cap: "Up to ₹150 off", min: "Min. cart ₹599", until: "31 Dec 2026", terms: "Applies to all categories except dairy staples. One use per account.", featured: true },
  { code: "UPI5", kind: "Payment offer", value: "Extra 5% off", cap: "Up to ₹100 off", min: "Min. cart ₹399", until: "Ongoing", terms: "Pay via any UPI app at checkout. Not valid on cash on delivery." },
  { code: "FIRSTKIRANA", kind: "New customer", value: "₹125 off", cap: "Flat discount", min: "Min. cart ₹499", until: "31 Mar 2027", terms: "Valid only on your first Fresh Kirana order." },
  { code: "HDFC12", kind: "Bank offer", value: "12% instant discount", cap: "Up to ₹250 off", min: "Min. cart ₹1,499", until: "30 Sep 2026", terms: "HDFC Bank credit and debit cards. Twice per card per month." },
  { code: "MASALA20", kind: "Category deal", value: "20% off spices", cap: "Up to ₹200 off", min: "Min. spice value ₹350", until: "15 Oct 2026", terms: "Valid on the Spices category only." },
  { code: "FESTIVE499", kind: "Hamper offer", value: "₹499 off hampers", cap: "Flat discount", min: "Min. cart ₹2,499", until: "20 Nov 2026", terms: "Applicable on festive hampers and gifting bundles." },
  { code: "SLOTFREE", kind: "Delivery", value: "Free express slot", cap: "Saves ₹39", min: "Min. cart ₹299", until: "Ongoing", terms: "Same-day slots in Mumbai, Delhi NCR, Bengaluru and Hyderabad." },
  { code: "WEEKEND8", kind: "Weekend deal", value: "8% off fresh produce", cap: "Up to ₹120 off", min: "Min. cart ₹449", until: "Every Sat–Sun", terms: "Valid on Fruits and Vegetables ordered Saturday or Sunday." },
];
