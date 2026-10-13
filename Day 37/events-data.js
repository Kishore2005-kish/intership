/**
 * UtsavPass - Curated Indian Events Dataset
 * Generates events relative to the current date so that "Today", "Tomorrow",
 * "This Weekend", and date picker filters always yield active, exciting events.
 */

(function () {
  const today = new Date();

  function formatDate(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function addDays(baseDate, days) {
    const copy = new Date(baseDate);
    copy.setDate(copy.getDate() + days);
    return copy;
  }

  // Calculate upcoming weekend
  const currentDayOfWeek = today.getDay(); // 0 is Sunday, 6 is Saturday
  const daysUntilSaturday = (6 - currentDayOfWeek + 7) % 7 || 7;
  const thisSaturday = addDays(today, daysUntilSaturday);
  const thisSunday = addDays(thisSaturday, 1);

  window.INITIAL_EVENTS = [
    {
      id: "ev-blr-01",
      title: "Spic Macay Baithak: Santoor & Tabla Jugalbandi",
      category: "Classical Music",
      city: "Bengaluru",
      neighborhood: "Malleshwaram",
      venue: "Chowdiah Memorial Hall, Vyalikaval",
      landmark: "Near Sankey Tank East Gate",
      date: formatDate(today), // Today!
      time: "06:30 PM - 09:30 PM",
      price: 499,
      isFree: false,
      capacity: 350,
      registeredCount: 312,
      artist: "Pt. Tarun Bhattacharya & Ustad Akram Khan",
      description: "An intimate evening of classical Hindustani ragas. Experience the serene acoustic resonance of the violin-shaped Chowdiah Hall under soft lamp-lit baithak seating.",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
      inclusions: ["Seated Baithak Seating", "Traditional Filter Coffee & Kesari Bath at Intermission", "Souvenir Programme Booklet"],
      tags: ["Baithak", "Classical Music", "Malleshwaram", "Acoustic"],
      featured: true
    },
    {
      id: "ev-del-02",
      title: "Old Delhi Twilight Culinary & Heritage Walk",
      category: "Food & Heritage",
      city: "Delhi NCR",
      neighborhood: "Chandni Chowk",
      venue: "Assembly at Jama Masjid Gate 3",
      landmark: "Opposite Karim's Gali, Old Delhi",
      date: formatDate(addDays(today, 1)), // Tomorrow
      time: "05:00 PM - 08:30 PM",
      price: 850,
      isFree: false,
      capacity: 25,
      registeredCount: 21,
      artist: "Curated by Dilli Karwan & Chef Aslam",
      description: "Walk the historic Shahjahanabad alleys tasting khari baoli chai, melting seekh kebabs, authentic bedmi poori, and slow-churned Daulat ki Chaat with a heritage storyteller.",
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
      inclusions: ["Guided Walk with Audio Receiver", "Tastings at 7 Legendary Eateries", "Culinary Heritage Booklet", "Bottled Mineral Water"],
      tags: ["Food Walk", "Old Delhi", "Heritage", "Kebabs", "Stories"],
      featured: true
    },
    {
      id: "ev-mum-03",
      title: "Prithvi Theatre Festival: Dastan-e-Amir Khusrau",
      category: "Theatre & Arts",
      city: "Mumbai",
      neighborhood: "Juhu",
      venue: "Prithvi Theatre, Janki Kutir",
      landmark: "Next to Prithvi Cafe, Church Road, Juhu",
      date: formatDate(thisSaturday), // This Weekend Saturday
      time: "07:00 PM - 09:15 PM",
      price: 600,
      isFree: false,
      capacity: 200,
      registeredCount: 188,
      artist: "The Dastangoi Collective & Naseeruddin Shah",
      description: "The medieval art of Urdu storytelling reimagined with Khusrau's soulful qawwalis, ghazals, and timeless riddles under the intimate proscenium of Prithvi Theatre.",
      image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80",
      inclusions: ["Guaranteed Theatre Entry", "Q&A with the Cast", "Irish Coffee Voucher at Prithvi Cafe"],
      tags: ["Dastangoi", "Prithvi Theatre", "Mumbai Culture", "Literature"],
      featured: true
    },
    {
      id: "ev-blr-04",
      title: "Namma Tech Chai: AI Engineers & Indie Builders Mixer",
      category: "Tech & Startups",
      city: "Bengaluru",
      neighborhood: "Indiranagar",
      venue: "The Bohemian House, 100ft Road",
      landmark: "Above Corner House Ice Cream",
      date: formatDate(thisSunday), // This Weekend Sunday
      time: "10:30 AM - 01:30 PM",
      price: 0, // Free!
      isFree: true,
      capacity: 120,
      registeredCount: 110,
      artist: "Hosted by Bengaluru Builders Forum",
      description: "No PowerPoint slides or sales pitches. Just filter coffee, hot dosas, and candid demos by grassroots developers building on modern AI models and open-source infrastructure.",
      image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
      inclusions: ["Unlimited South Indian Filter Kaapi", "Mini Ghee Podi Idli Snack Box", "Exclusive Builders Discord Invite"],
      tags: ["Startups", "AI", "Indiranagar", "Networking", "Free Entry"],
      featured: false
    },
    {
      id: "ev-hyd-05",
      title: "Deccan Sufi & Qawwali Night at Chowmahalla",
      category: "Classical Music",
      city: "Hyderabad",
      neighborhood: "Old City",
      venue: "Courtyard of Chowmahalla Palace",
      landmark: "Near Khilwat Grounds, Charminar",
      date: formatDate(addDays(today, 3)),
      time: "07:30 PM - 10:30 PM",
      price: 750,
      isFree: false,
      capacity: 400,
      registeredCount: 340,
      artist: "Warsi Brothers (Qawwal Bachche of Dargah Hazrat Inayat Khan)",
      description: "Lose yourself in ecstatic Sufiana kalam under the chandeliers of the Nizam’s historic durbar. Experience authentic Hyderabadi ghazals and fast-tempo qawwali jugalbandi.",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
      inclusions: ["Palace Grounds Admission", "Traditional Cushion Seating", "Osmania Biscuits & Irani Chai Service"],
      tags: ["Qawwali", "Sufi", "Chowmahalla", "Hyderabad Heritage"],
      featured: true
    },
    {
      id: "ev-chn-06",
      title: "Margazhi Season: Morning Kutcheri & Tiffin",
      category: "Classical Music",
      city: "Chennai",
      neighborhood: "Mylapore",
      venue: "The Music Academy (Mini Hall)",
      landmark: "TTK Road, Royapettah / Mylapore border",
      date: formatDate(addDays(today, 5)),
      time: "08:30 AM - 11:30 AM",
      price: 350,
      isFree: false,
      capacity: 250,
      registeredCount: 195,
      artist: "Sanjay Subrahmanyan (Vocal) & S. Varadarajan (Violin)",
      description: "Celebrate the revered December-January Margazhi season music tradition. Divine renditions of Tyagaraja and Dikshitar kritis followed by traditional canteen tiffin.",
      image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80",
      inclusions: ["Sabha Kutcheri Pass", "Authentic Ghee Pongal & Medu Vada Canteen Token"],
      tags: ["Carnatic", "Margazhi", "Mylapore", "Music Academy"],
      featured: false
    },
    {
      id: "ev-pun-07",
      title: "Sinhagad Monsoon Ridge Trek & Pithla Bhakri Trail",
      category: "Outdoors & Adventure",
      city: "Pune",
      neighborhood: "Sinhagad Base",
      venue: "Atkarwadi Base Village",
      landmark: "Toll Naka Sinhagad Road, Haveli",
      date: formatDate(thisSaturday),
      time: "05:30 AM - 11:30 AM",
      price: 550,
      isFree: false,
      capacity: 40,
      registeredCount: 38,
      artist: "Western Ghats Trekkers Association",
      description: "Ascend the legendary lion fort through mist-clad cliff trails. Relish steaming hot Pithla Bhakri with spicy Thecha and matka dahi at Tanaji Malusare samadhi.",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      inclusions: ["Certified Trek Leaders & First Aid", "Authentic Maharashtrian Chulivarchi Bhakri Meal", "Forest Entry Permits"],
      tags: ["Trek", "Sahyadri", "Sinhagad", "Pune Treks", "Outdoors"],
      featured: false
    },
    {
      id: "ev-mum-08",
      title: "Kala Ghoda Heritage Art & Ceramic Studio Workshop",
      category: "Workshops & Crafts",
      city: "Mumbai",
      neighborhood: "Fort / Kala Ghoda",
      venue: "The Vintage Clay Studio, Ropewalk Lane",
      landmark: "Behind Jehangir Art Gallery",
      date: formatDate(addDays(today, 4)),
      time: "02:00 PM - 05:30 PM",
      price: 1200,
      isFree: false,
      capacity: 18,
      registeredCount: 16,
      artist: "Master Potter Vinita Mhatre",
      description: "Hands-on pottery on the traditional potter's wheel. Learn centering, shaping terracotta chai kulhads, and surface carving inspired by Bombay Gothic architecture.",
      image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
      inclusions: ["All Natural Clay & Tools", "Glazing and Kiln Firing of 2 Pieces", "Courier Delivery of Cured Pots"],
      tags: ["Pottery", "Workshop", "Kala Ghoda", "Crafts"],
      featured: false
    },
    {
      id: "ev-jpr-09",
      title: "Jaipur Dastkar Craft Mela & Indigo Block-Printing",
      category: "Workshops & Crafts",
      city: "Jaipur",
      neighborhood: "Jawahar Kala Kendra",
      venue: "Shilpgram, Jawahar Kala Kendra",
      landmark: "JLN Marg, Opposite Commerce College",
      date: formatDate(addDays(today, 2)),
      time: "11:00 AM - 06:00 PM",
      price: 250,
      isFree: false,
      capacity: 150,
      registeredCount: 114,
      artist: "Bagru Master Craftsmen (Chhipa Community)",
      description: "Direct interaction with National Awardee artisans from Bagru and Sanganer. Print your own pure cotton stole using natural vegetable dyes, kashish, and carved teakwood blocks.",
      image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
      inclusions: ["Shilpgram Fair Admission", "Take-Home 2-Meter Handprinted Cotton Stole", "Organic Herbal Chai"],
      tags: ["Block Print", "Bagru", "Jaipur", "Handloom"],
      featured: false
    },
    {
      id: "ev-kol-10",
      title: "College Street Boi Para & Heritage Tramway Adda",
      category: "Food & Heritage",
      city: "Kolkata",
      neighborhood: "College Street",
      venue: "Indian Coffee House (Upper Balcony)",
      landmark: "Opposite Presidency University",
      date: formatDate(addDays(today, 6)),
      time: "03:30 PM - 07:00 PM",
      price: 400,
      isFree: false,
      capacity: 30,
      registeredCount: 26,
      artist: "Dr. Anirban Roy (Calcutta Tram Lovers Club)",
      description: "Explore the world's largest second-hand book market, ride the historic wooden electric tramcar through Esplanade, and engage in high-octane Adda over mutton cutlets and infusion coffee.",
      image: "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80",
      inclusions: ["Heritage Tramway Token", "Coffee House Mutton Cutlet & Coffee", "Vintage Kolkata Map Replica"],
      tags: ["Kolkata", "Tram", "Coffee House", "Books", "Heritage"],
      featured: false
    },
    {
      id: "ev-blr-11",
      title: "Hinglish Stand-up Special: 'South Bangalore Problems'",
      category: "Standup Comedy",
      city: "Bengaluru",
      neighborhood: "Koramangala",
      venue: "Koramangala Social (The Attic)",
      landmark: "7th Block, Near Forum Mall",
      date: formatDate(today), // Today!
      time: "08:00 PM - 09:30 PM",
      price: 499,
      isFree: false,
      capacity: 140,
      registeredCount: 132,
      artist: "Karthik Kumar & Shraddha Jain",
      description: "A hilarious raw take on Silk Board traffic, house-hunting landlord interviews, startup equity promises, and why filter coffee beats cold brew every single day.",
      image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=800&q=80",
      inclusions: ["Club Entry & Seating", "Complimentary Social House Mocktail/Brew"],
      tags: ["Standup", "Comedy", "Koramangala", "Bengaluru"],
      featured: false
    },
    {
      id: "ev-goa-12",
      title: "Fontainhas Latin Quarter Jazz & Fado Twilight Soiree",
      category: "Live Music",
      city: "Goa",
      neighborhood: "Panaji",
      venue: "Casa da Moeda Courtyard",
      landmark: "Near St. Sebastian Chapel, Fontainhas",
      date: formatDate(addDays(today, 7)),
      time: "06:30 PM - 10:00 PM",
      price: 650,
      isFree: false,
      capacity: 110,
      registeredCount: 85,
      artist: "Sonia Shirsat & The Portuguese Guitar Trio",
      description: "Portuguese Fado meets Goan Konkani Mandó along pastel yellow cobblestone streets. Sip kokum spritzers under tiled verandas with live acoustic guitar and violin.",
      image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80",
      inclusions: ["Courtyard Pass", "Goan Tapas Box (Prawn Balchão tartlets / Paneer Cafreal skewers)", "Welcome Drink"],
      tags: ["Jazz", "Fado", "Goa", "Panaji", "Heritage"],
      featured: true
    }
  ];
})();
