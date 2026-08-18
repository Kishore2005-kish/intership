/* Alder & Lane — catalogue data (invented sample collection) */

export const CATEGORIES = [
  { id: "chairs",    name: "Accent Chairs",        plate: "plate-chair.png"     },
  { id: "tables",    name: "Accent Tables",        plate: "plate-table.png"     },
  { id: "stools",    name: "Bar & Counter Stools", plate: "plate-stool.png"     },
  { id: "beds",      name: "Beds",                 plate: "plate-bed.png"       },
  { id: "bookcases", name: "Bookcases",            plate: "plate-bookcase.png"  },
  { id: "benches",   name: "Benches",              plate: "plate-bench.png"     },
  { id: "chaises",   name: "Chaises",              plate: "plate-chaise.png"    },
  { id: "lighting",  name: "Lighting",             plate: "plate-light.png"     },
  { id: "chests",    name: "Chests & Cabinets",    plate: "plate-chest.png"     },
  { id: "coffee",    name: "Coffee Tables",        plate: "plate-coffee.png"    },
  { id: "consoles",  name: "Consoles",             plate: "plate-console.png"   },
  { id: "mirrors",   name: "Mirrors",              plate: "plate-mirror.png"    },
];

export const ROOMS = [
  { id: "living",  name: "Living Room",  img: "room-living.jpg"  },
  { id: "bedroom", name: "Bedroom",      img: "room-bedroom.jpg" },
  { id: "dining",  name: "Dining Room",  img: "room-dining.jpg"  },
  { id: "office",  name: "Home Office",  img: "room-office.jpg"  },
];

export const MATERIALS = ["Oak", "Walnut", "Linen", "Velvet", "Rattan", "Marble", "Brass", "Lacquer", "Travertine", "Bone Inlay"];

export const COLOURS = [
  { id: "bone",    name: "Bone",    hex: "#efe7d8" },
  { id: "ochre",   name: "Ochre",   hex: "#c08b33" },
  { id: "ink",     name: "Ink",     hex: "#1f1d1a" },
  { id: "indigo",  name: "Indigo",  hex: "#2c3c5c" },
  { id: "oxblood", name: "Oxblood", hex: "#6e1f27" },
  { id: "sage",    name: "Sage",    hex: "#8b9578" },
  { id: "rose",    name: "Rose",    hex: "#d8a9a2" },
  { id: "walnut",  name: "Walnut",  hex: "#6a4227" },
];

export const DESIGNERS = [
  {
    id: "iris-halloran", name: "Iris Halloran", img: "designer-1.jpg",
    based: "Mumbai / Delhi",
    line: "Curves drawn from riverbank stones and church arches.",
    bio: "Iris trained as a sculptor before furniture found her. Her pieces begin as clay maquettes the size of a fist, which is why an Alder & Lane console by Iris reads more like an object than a table. She works in stone, plaster and pale oak, and refuses to sketch anything she cannot lift.",
  },
  {
    id: "tomas-belder", name: "Tomás Belder", img: "designer-2.jpg",
    based: "Jaipur",
    line: "Joinery you can read with your fingertips.",
    bio: "Third-generation cabinetmaker. Tomás cuts every prototype himself and marks the grain direction in pencil so the workshop can follow his hand. He is the reason our drawers close with a soft exhale rather than a knock.",
  },
];

/* compact rows: id, name, categoryId, roomId, material, colourId, price, was, designerId, dims, note, plate override */
const ROWS = [
  ["ac-01","Marguerite Slipper Chair","chairs","living","Velvet","ochre",1480,null,"iris-halloran","W 74 × D 80 × H 88 cm","Sat in an ochre room it disappears; sat in a white one it performs."],
  ["ac-02","Wren Wing Chair","chairs","living","Linen","bone",1720,1990,"tomas-belder","W 80 × D 86 × H 104 cm","The wings are cut narrow — shelter without the throne."],
  ["ac-03","Hollis Reading Chair","chairs","office","Velvet","indigo",1290,null,"tomas-belder","W 70 × D 78 × H 84 cm","Low arms so a book can rest open on the elbow."],
  ["at-01","Ottavia Octagon Table","tables","living","Walnut","walnut",640,null,"tomas-belder","Ø 46 × H 56 cm","Eight sides means it never argues with a rug pattern."],
  ["at-02","Pell Drum Table","tables","bedroom","Oak","bone",520,610,"iris-halloran","Ø 42 × H 54 cm","Turned from a single block; the seam is deliberate."],
  ["at-03","Corbel Side Table","tables","living","Travertine","bone",880,null,"iris-halloran","W 40 × D 40 × H 52 cm","Heavy enough that guests stop moving it."],
  ["bs-01","Ash Counter Stool","stools","dining","Oak","bone",395,null,"tomas-belder","W 42 × D 46 × H 92 cm","The back rail sits exactly where a shoulder wants it."],
  ["bs-02","Tulle Bar Stool","stools","dining","Linen","sage",440,520,"tomas-belder","W 42 × D 46 × H 106 cm","Upholstered in a linen that takes a stain and keeps a secret."],
  ["bs-03","Quarry Perch Stool","stools","dining","Travertine","bone",690,null,"iris-halloran","W 36 × D 36 × H 68 cm","A stool that behaves like a small monument."],
  ["bd-01","Lowell Platform Bed","beds","bedroom","Linen","bone",2480,null,"iris-halloran","W 168 × L 214 × H 96 cm","Headboard kept low so morning light clears it."],
  ["bd-02","Halcyon Bed","beds","bedroom","Velvet","indigo",2790,3200,"tomas-belder","W 172 × L 216 × H 112 cm","Channelled back, brass feet, no ceremony."],
  ["bd-03","Fen Oak Bed","beds","bedroom","Oak","walnut",2190,null,"tomas-belder","W 168 × L 212 × H 100 cm","Pegged joints, visible on purpose."],
  ["bc-01","Arch Oak Bookcase","bookcases","office","Oak","bone",1650,null,"tomas-belder","W 110 × D 40 × H 200 cm","Arched to soften a room of straight lines."],
  ["bc-02","Compendium Shelf","bookcases","office","Walnut","walnut",1890,2150,"tomas-belder","W 130 × D 38 × H 210 cm","Adjustable shelves in 4 cm increments — for the collectors."],
  ["bc-03","Vestry Bookcase","bookcases","living","Oak","sage",1420,null,"iris-halloran","W 96 × D 36 × H 186 cm","Painted, then rubbed back at the edges."],
  ["bn-01","Quarry Bench","benches","living","Travertine","bone",1180,null,"iris-halloran","W 120 × D 38 × H 42 cm","One block, four faces, no fixings."],
  ["bn-02","Hallway Bench","benches","living","Oak","walnut",720,860,"tomas-belder","W 130 × D 36 × H 45 cm","Built for boots and hesitation."],
  ["bn-03","Linen Sill Bench","benches","bedroom","Linen","rose",640,null,"iris-halloran","W 110 × D 40 × H 46 cm","Sits at the end of a bed like punctuation."],
  ["ch-01","Coquille Chaise","chaises","living","Linen","bone",1980,null,"iris-halloran","W 160 × D 70 × H 78 cm","Rolled back, turned legs, an afternoon written into it."],
  ["ch-02","Solene Day Chaise","chaises","bedroom","Velvet","rose",2140,2450,"tomas-belder","W 165 × D 72 × H 80 cm","Velvet that changes colour when the sun moves."],
  ["ch-03","Atrium Chaise","chaises","living","Rattan","bone",1560,null,"tomas-belder","W 158 × D 68 × H 76 cm","Caned base keeps it visually weightless."],
  ["lt-01","Fringe Glass Chandelier","lighting","dining","Brass","ochre",1890,null,"iris-halloran","Ø 56 × H 62 cm","Three tiers of glass rod; sounds faintly of rain."],
  ["lt-02","Linen Shade Floor Lamp","lighting","living","Brass","ink",480,560,"tomas-belder","Ø 42 × H 158 cm","Pleated shade, weighted tray base for a glass."],
  ["lt-03","Belder Task Lamp","lighting","office","Brass","ochre",340,null,"tomas-belder","W 42 × H 46 cm","Counterweighted so one finger moves it."],
  ["cs-01","Lacquer Chinoiserie Chest","chests","bedroom","Lacquer","ink",2340,null,"iris-halloran","W 96 × D 46 × H 84 cm","Twelve coats of lacquer, gilt drawn by hand."],
  ["cs-02","Inlay Bar Cabinet","chests","living","Bone Inlay","ink",2680,3100,"iris-halloran","W 90 × D 42 × H 150 cm","Every tessera set by hand over eleven days.","plate-cabinet.png"],
  ["cs-03","Fen Three-Drawer Chest","chests","bedroom","Oak","walnut",1480,null,"tomas-belder","W 92 × D 44 × H 78 cm","Drawers that close with a soft exhale."],
  ["cf-01","Fretwork Rattan Coffee Table","coffee","living","Rattan","bone",980,null,"tomas-belder","Ø 96 × H 40 cm","Woven in a single continuous pattern."],
  ["cf-02","Plinth Coffee Table","coffee","living","Travertine","bone",1680,1890,"iris-halloran","W 120 × D 70 × H 34 cm","Two plinths, one slab, zero apology."],
  ["cf-03","Ledger Coffee Table","coffee","office","Walnut","walnut",1240,null,"tomas-belder","W 130 × D 66 × H 38 cm","A book ledge runs the full underside."],
  ["cn-01","Rosetta Marble Console","consoles","living","Marble","rose",2280,null,"iris-halloran","W 130 × D 38 × H 82 cm","Legs drawn from a riverbank stone she keeps on her desk."],
  ["cn-02","Vestibule Console","consoles","living","Oak","bone",1180,1390,"tomas-belder","W 140 × D 36 × H 80 cm","Narrow enough for a tight hallway."],
  ["cn-03","Belder Sideboard Console","consoles","dining","Walnut","walnut",1980,null,"tomas-belder","W 168 × D 42 × H 78 cm","Three doors, brass catches, felted interior."],
  ["mr-01","Arch Brass Mirror","mirrors","bedroom","Brass","ochre",890,null,"iris-halloran","W 80 × H 200 cm","Leans; never hangs."],
  ["mr-02","Halo Round Mirror","mirrors","living","Brass","ochre",560,660,"tomas-belder","Ø 90 cm","A slim frame that reads as a drawn line."],
  ["mr-03","Vestry Floor Mirror","mirrors","bedroom","Oak","walnut",740,null,"tomas-belder","W 76 × H 186 cm","Oak frame, waxed rather than varnished."],
];

const CAT_PLATE = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.plate]));
const CAT_NAME = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.name]));
const ROOM_NAME = Object.fromEntries(ROOMS.map((r) => [r.id, r.name]));
const ROOM_IMG = Object.fromEntries(ROOMS.map((r) => [r.id, r.img]));

export const PRODUCTS = ROWS.map((r, i) => {
  const [id, name, category, room, material, colour, price, was, designer, dims, note, plate] = r;
  return {
    id, name, category, room, material, colour, price, was, designer, dims, note,
    index: String(i + 1).padStart(3, "0"),
    categoryName: CAT_NAME[category],
    roomName: ROOM_NAME[room],
    colourName: (COLOURS.find((c) => c.id === colour) || {}).name || colour,
    designerName: (DESIGNERS.find((d) => d.id === designer) || {}).name || designer,
    studio: "img/" + (plate || CAT_PLATE[category]),
    scene: "img/" + ROOM_IMG[room],
    sale: Boolean(was),
  };
});

export const byId = (id) => PRODUCTS.find((p) => p.id === id);

export const JOURNAL = [
  { title: "The Case for One Loud Chair", kicker: "Plate 01 — Colour", body: "A room can hold exactly one argument. Make it upholstery.", img: "hero-chairs.jpg" },
  { title: "Setting a Table for People You Like", kicker: "Plate 02 — Ritual", body: "Two vases, mismatched. Candles lit before anyone arrives.", img: "hero-table.jpg" },
  { title: "Where the Oak Comes From", kicker: "Plate 03 — Material", body: "Four estates in Galicia, felled on a fourteen-year rotation.", img: "workshop-1.jpg" },
];

/* hotspot coordinates are % of the scene image */
export const SCENES = [
  { room: "living", title: "The Blue Room", sub: "collected", img: "room-living.jpg",
    note: "Pattern on pattern, held together by one deep wall colour.",
    spots: [ { id: "ac-01", x: 22, y: 62 }, { id: "cf-03", x: 40, y: 82 }, { id: "lt-02", x: 88, y: 40 }, { id: "at-01", x: 88, y: 72 } ] },
  { room: "bedroom", title: "The Pink Ceiling", sub: "restful", img: "room-bedroom.jpg",
    note: "One extravagant light; everything beneath it kept quiet.",
    spots: [ { id: "lt-01", x: 41, y: 14 }, { id: "cs-01", x: 68, y: 76 }, { id: "bd-01", x: 20, y: 84 }, { id: "mr-01", x: 88, y: 55 } ] },
  { room: "dining", title: "The Long Lunch", sub: "gathered", img: "room-dining.jpg",
    note: "Cane, oak and a pendant hung two inches lower than advised.",
    spots: [ { id: "bs-01", x: 16, y: 74 }, { id: "cn-03", x: 79, y: 62 }, { id: "lt-01", x: 34, y: 22 } ] },
  { room: "office", title: "The Back Study", sub: "considered", img: "room-office.jpg",
    note: "A desk facing the window, and a wall that holds everything else.",
    spots: [ { id: "bc-01", x: 18, y: 32 }, { id: "lt-03", x: 68, y: 47 }, { id: "cf-03", x: 45, y: 82 } ] },
];
