/* Static demo dataset: real Indian Railways stations & services.
   Fares, availability, PNRs and running status are demo values. */

const STATIONS = [
  { code: "SBC", name: "KSR Bengaluru City Junction", city: "Bengaluru" },
  { code: "YPR", name: "Yesvantpur Junction", city: "Bengaluru" },
  { code: "MYS", name: "Mysuru Junction", city: "Mysuru" },
  { code: "MAS", name: "MGR Chennai Central", city: "Chennai" },
  { code: "MS", name: "Chennai Egmore", city: "Chennai" },
  { code: "NDLS", name: "New Delhi", city: "Delhi" },
  { code: "DLI", name: "Delhi Junction", city: "Delhi" },
  { code: "NZM", name: "Hazrat Nizamuddin", city: "Delhi" },
  { code: "MMCT", name: "Mumbai Central", city: "Mumbai" },
  { code: "CSMT", name: "Chhatrapati Shivaji Maharaj Terminus", city: "Mumbai" },
  { code: "LTT", name: "Lokmanya Tilak Terminus", city: "Mumbai" },
  { code: "HYB", name: "Hyderabad Deccan (Nampally)", city: "Hyderabad" },
  { code: "SC", name: "Secunderabad Junction", city: "Hyderabad" },
  { code: "PUNE", name: "Pune Junction", city: "Pune" },
  { code: "ADI", name: "Ahmedabad Junction", city: "Ahmedabad" },
  { code: "JP", name: "Jaipur Junction", city: "Jaipur" },
  { code: "NJP", name: "New Jalpaiguri Junction", city: "Siliguri" },
  { code: "HWH", name: "Howrah Junction", city: "Kolkata" },
  { code: "SDAH", name: "Sealdah", city: "Kolkata" },
  { code: "ERS", name: "Ernakulam Junction", city: "Kochi" },
  { code: "TVC", name: "Thiruvananthapuram Central", city: "Thiruvananthapuram" },
  { code: "MAO", name: "Madgaon Junction", city: "Goa" },
  { code: "BBS", name: "Bhubaneswar", city: "Bhubaneswar" },
  { code: "PNBE", name: "Patna Junction", city: "Patna" },
  { code: "LKO", name: "Lucknow Charbagh", city: "Lucknow" },
  { code: "BPL", name: "Bhopal Junction", city: "Bhopal" },
  { code: "NGP", name: "Nagpur Junction", city: "Nagpur" },
  { code: "CBE", name: "Coimbatore Junction", city: "Coimbatore" },
  { code: "UBL", name: "Hubballi Junction", city: "Hubballi" },
  { code: "MAQ", name: "Mangaluru Central", city: "Mangaluru" },
  { code: "VSKP", name: "Visakhapatnam Junction", city: "Visakhapatnam" },
  { code: "ASR", name: "Amritsar Junction", city: "Amritsar" },
  { code: "CDG", name: "Chandigarh", city: "Chandigarh" },
  { code: "AGC", name: "Agra Cantt", city: "Agra" },
  { code: "GKP", name: "Gorakhpur Junction", city: "Gorakhpur" },
  { code: "TPTY", name: "Tirupati", city: "Tirupati" },
];

const CLASS_LABELS = {
  "1A": "AC First Class (1A)",
  "2A": "AC 2 Tier (2A)",
  "3A": "AC 3 Tier (3A)",
  "3E": "AC 3 Tier Economy (3E)",
  CC: "AC Chair Car (CC)",
  EC: "Executive Chair Car (EC)",
  SL: "Sleeper (SL)",
  "2S": "Second Sitting (2S)",
};

const QUOTAS = ["General", "Tatkal", "Ladies", "Senior Citizen", "Other"];

/* Train catalogue — real services on real corridors.
   time = 24h "HH:MM"; days = running days; type = service family. */
const TRAINS = [
  // Bengaluru – Mysuru
  { no: "20607", name: "Mysuru Vande Bharat Express", type: "Vande Bharat", from: "MAS", to: "MYS", dep: "05:50", arr: "12:30", via: ["SBC"], legs: { "SBC-MYS": { dep: "10:25", arr: "12:30" }, "MAS-SBC": { dep: "05:50", arr: "10:15" } }, classes: ["CC", "EC"], days: "Wed off" },
  { no: "20608", name: "Chennai Vande Bharat Express", type: "Vande Bharat", from: "MYS", to: "MAS", dep: "13:05", arr: "19:50", via: ["SBC"], legs: { "MYS-SBC": { dep: "13:05", arr: "15:20" } }, classes: ["CC", "EC"], days: "Wed off" },
  { no: "12007", name: "Mysuru Shatabdi Express", type: "Shatabdi", from: "MAS", to: "MYS", dep: "06:00", arr: "12:30", via: ["SBC"], legs: { "SBC-MYS": { dep: "10:30", arr: "12:30" } }, classes: ["CC", "EC"], days: "Tue off" },
  { no: "16022", name: "Kaveri Express", type: "Express", from: "MYS", to: "MAS", dep: "21:15", arr: "05:30", via: ["SBC"], legs: { "MYS-SBC": { dep: "21:15", arr: "23:45" } }, classes: ["SL", "3A", "2A"], days: "Daily" },
  { no: "16216", name: "Chamundi Express", type: "Express", from: "SBC", to: "MYS", dep: "18:15", arr: "20:45", classes: ["2S", "CC", "SL"], days: "Daily" },
  { no: "16536", name: "Gol Gumbaz Express", type: "Express", from: "SBC", to: "MYS", dep: "07:00", arr: "09:45", classes: ["2S", "SL", "3A"], days: "Daily" },
  { no: "12614", name: "Tippu Express", type: "Intercity", from: "SBC", to: "MYS", dep: "15:00", arr: "17:20", classes: ["2S", "CC"], days: "Daily" },

  // Chennai – Bengaluru
  { no: "12609", name: "Chennai–Bengaluru Express", type: "Express", from: "MAS", to: "SBC", dep: "13:35", arr: "19:05", classes: ["SL", "3A", "2A"], days: "Daily" },
  { no: "12027", name: "Bengaluru Shatabdi Express", type: "Shatabdi", from: "MAS", to: "SBC", dep: "17:30", arr: "22:00", classes: ["CC", "EC"], days: "Daily" },
  { no: "12658", name: "Bengaluru Mail", type: "Mail/Express", from: "MAS", to: "SBC", dep: "23:30", arr: "05:30", classes: ["SL", "3A", "2A", "1A"], days: "Daily" },
  { no: "22625", name: "Chennai–Bengaluru Double Decker Express", type: "Double Decker", from: "MAS", to: "SBC", dep: "07:20", arr: "12:35", classes: ["CC"], days: "Daily" },
  { no: "12007R", label: "12008", name: "Chennai Shatabdi Express", type: "Shatabdi", from: "SBC", to: "MAS", dep: "16:20", arr: "21:00", classes: ["CC", "EC"], days: "Tue off" },
  { no: "12610", name: "Bengaluru–Chennai Express", type: "Express", from: "SBC", to: "MAS", dep: "06:50", arr: "12:20", classes: ["SL", "3A", "2A"], days: "Daily" },
  { no: "22626", name: "Bengaluru–Chennai Double Decker Express", type: "Double Decker", from: "SBC", to: "MAS", dep: "14:15", arr: "19:30", classes: ["CC"], days: "Daily" },
  { no: "12640", name: "Brindavan Express", type: "Intercity", from: "SBC", to: "MAS", dep: "07:15", arr: "13:00", classes: ["2S", "CC"], days: "Daily" },

  // Delhi – Jaipur
  { no: "20977", name: "Ajmer Vande Bharat Express", type: "Vande Bharat", from: "NDLS", to: "JP", dep: "06:10", arr: "10:15", classes: ["CC", "EC"], days: "Wed off" },
  { no: "12015", name: "Ajmer Shatabdi Express", type: "Shatabdi", from: "NDLS", to: "JP", dep: "06:05", arr: "10:35", classes: ["CC", "EC"], days: "Daily" },
  { no: "12958", name: "Swarna Jayanti Rajdhani Express", type: "Rajdhani", from: "NDLS", to: "JP", dep: "19:55", arr: "00:05", classes: ["3A", "2A", "1A"], days: "Daily" },
  { no: "12956", name: "Jaipur–Mumbai Superfast Express", type: "Superfast", from: "JP", to: "MMCT", dep: "14:10", arr: "05:40", classes: ["SL", "3A", "2A", "1A"], days: "Daily" },
  { no: "12986", name: "Double Decker Express", type: "Double Decker", from: "NDLS", to: "JP", dep: "17:35", arr: "22:10", classes: ["CC"], days: "Daily" },
  { no: "12414", name: "Jaipur–Delhi Intercity Express", type: "Intercity", from: "JP", to: "NDLS", dep: "16:35", arr: "21:20", classes: ["2S", "CC", "SL"], days: "Daily" },

  // Mumbai – Pune
  { no: "22105", name: "Indrayani Express", type: "Express", from: "CSMT", to: "PUNE", dep: "05:25", arr: "09:00", classes: ["2S", "CC"], days: "Daily" },
  { no: "12123", name: "Deccan Queen", type: "Express", from: "CSMT", to: "PUNE", dep: "17:10", arr: "20:25", classes: ["2S", "CC"], days: "Daily" },
  { no: "11007", name: "Deccan Express", type: "Express", from: "CSMT", to: "PUNE", dep: "07:00", arr: "10:50", classes: ["2S", "SL", "CC"], days: "Daily" },
  { no: "12127", name: "Intercity Express", type: "Intercity", from: "CSMT", to: "PUNE", dep: "16:25", arr: "19:50", classes: ["2S", "CC"], days: "Daily" },
  { no: "22943", name: "Pune–Indore Express", type: "Express", from: "PUNE", to: "CSMT", dep: "06:05", arr: "09:40", classes: ["SL", "3A", "2A"], days: "Daily" },
  { no: "12124", name: "Deccan Queen", type: "Express", from: "PUNE", to: "CSMT", dep: "07:15", arr: "10:25", classes: ["2S", "CC"], days: "Daily" },

  // Mumbai – Goa
  { no: "10103", name: "Mandovi Express", type: "Express", from: "CSMT", to: "MAO", dep: "07:10", arr: "19:30", classes: ["2S", "SL", "3A", "2A"], days: "Daily" },
  { no: "10111", name: "Konkan Kanya Express", type: "Express", from: "CSMT", to: "MAO", dep: "23:05", arr: "10:30", classes: ["SL", "3A", "2A"], days: "Daily" },
  { no: "22119", name: "Tejas Express", type: "Tejas", from: "CSMT", to: "MAO", dep: "05:50", arr: "13:30", classes: ["CC", "EC"], days: "Tue off" },
  { no: "12051", name: "Jan Shatabdi Express", type: "Jan Shatabdi", from: "MMCT", to: "MAO", dep: "05:25", arr: "13:50", classes: ["2S", "CC"], days: "Daily" },

  // Delhi – Mumbai / long distance
  { no: "12951", name: "Mumbai Rajdhani Express", type: "Rajdhani", from: "MMCT", to: "NDLS", dep: "17:00", arr: "08:32", classes: ["3A", "2A", "1A"], days: "Daily" },
  { no: "12952", name: "New Delhi Rajdhani Express", type: "Rajdhani", from: "NDLS", to: "MMCT", dep: "16:55", arr: "08:35", classes: ["3A", "2A", "1A"], days: "Daily" },
  { no: "12954", name: "August Kranti Rajdhani Express", type: "Rajdhani", from: "NZM", to: "MMCT", dep: "16:55", arr: "09:45", classes: ["3A", "2A", "1A"], days: "Daily" },
  { no: "12261", name: "Mumbai CSMT–Howrah Duronto Express", type: "Duronto", from: "CSMT", to: "HWH", dep: "20:15", arr: "18:05", classes: ["3A", "2A", "1A"], days: "Tue, Fri" },
  { no: "12246", name: "Howrah–Yesvantpur Duronto Express", type: "Duronto", from: "HWH", to: "YPR", dep: "11:45", arr: "18:20", classes: ["3A", "2A", "1A"], days: "Wed, Sat" },
  { no: "12628", name: "Karnataka Express", type: "Express", from: "SBC", to: "NDLS", dep: "19:20", arr: "10:45", classes: ["SL", "3A", "2A", "1A"], days: "Daily" },
  { no: "12627", name: "Karnataka Express", type: "Express", from: "NDLS", to: "SBC", dep: "20:45", arr: "12:10", classes: ["SL", "3A", "2A", "1A"], days: "Daily" },
  { no: "12301", name: "Howrah Rajdhani Express", type: "Rajdhani", from: "HWH", to: "NDLS", dep: "16:50", arr: "10:00", classes: ["3A", "2A", "1A"], days: "Daily" },
  { no: "12302", name: "Howrah Rajdhani Express", type: "Rajdhani", from: "NDLS", to: "HWH", dep: "16:55", arr: "09:55", classes: ["3A", "2A", "1A"], days: "Daily" },
  { no: "12259", name: "Sealdah–New Delhi Duronto Express", type: "Duronto", from: "SDAH", to: "NDLS", dep: "20:05", arr: "12:00", classes: ["3A", "2A", "1A"], days: "Daily" },
  { no: "12643", name: "Nizamuddin Superfast Express", type: "Superfast", from: "TVC", to: "NZM", dep: "13:45", arr: "05:30", classes: ["SL", "3A", "2A"], days: "Sun" },
  { no: "12626", name: "Kerala Express", type: "Express", from: "TVC", to: "NDLS", dep: "11:15", arr: "05:10", classes: ["SL", "3A", "2A", "1A"], days: "Daily" },
  { no: "22637", name: "West Coast Express", type: "Express", from: "MAS", to: "ERS", dep: "11:30", arr: "22:35", classes: ["SL", "3A", "2A"], days: "Daily" },
  { no: "12626E", label: "12625", name: "Kerala Express", type: "Express", from: "NDLS", to: "TVC", dep: "11:25", arr: "05:15", classes: ["SL", "3A", "2A", "1A"], days: "Daily" },
  { no: "12723", name: "Telangana Express", type: "Superfast", from: "HYB", to: "NDLS", dep: "06:25", arr: "07:20", classes: ["SL", "3A", "2A", "1A"], days: "Daily" },
  { no: "12759", name: "Charminar Express", type: "Express", from: "HYB", to: "MAS", dep: "18:30", arr: "07:30", classes: ["SL", "3A", "2A"], days: "Daily" },
  { no: "12009", name: "Ahmedabad Shatabdi Express", type: "Shatabdi", from: "MMCT", to: "ADI", dep: "06:25", arr: "13:00", classes: ["CC", "EC"], days: "Daily" },
  { no: "22962", name: "Mumbai–Ahmedabad Superfast Express", type: "Superfast", from: "MMCT", to: "ADI", dep: "22:15", arr: "05:40", classes: ["SL", "3A", "2A"], days: "Daily" },
  { no: "20901", name: "Mumbai–Gandhinagar Vande Bharat Express", type: "Vande Bharat", from: "MMCT", to: "ADI", dep: "06:10", arr: "12:20", classes: ["CC", "EC"], days: "Sun off" },
  { no: "12041", name: "New Jalpaiguri Shatabdi Express", type: "Shatabdi", from: "HWH", to: "NJP", dep: "14:05", arr: "22:00", classes: ["CC", "EC"], days: "Sun off" },
  { no: "12343", name: "Darjeeling Mail", type: "Mail/Express", from: "SDAH", to: "NJP", dep: "22:05", arr: "08:00", classes: ["SL", "3A", "2A", "1A"], days: "Daily" },
];

/* Base fare (₹) per km-band, per class — demo values */
const CLASS_FARE_FACTOR = { "2S": 0.35, SL: 0.55, CC: 1.35, "3E": 1.5, "3A": 1.7, EC: 2.6, "2A": 2.4, "1A": 3.9 };

const POPULAR_ROUTES = [
  { from: "SBC", to: "MYS", label: "Bengaluru → Mysuru" },
  { from: "MAS", to: "SBC", label: "Chennai → Bengaluru" },
  { from: "NDLS", to: "JP", label: "Delhi → Jaipur" },
  { from: "CSMT", to: "PUNE", label: "Mumbai → Pune" },
  { from: "SBC", to: "MAS", label: "Bengaluru → Chennai" },
  { from: "CSMT", to: "MAO", label: "Mumbai → Goa" },
];

/* Demo PNRs for the PNR status tool */
const DEMO_PNRS = {
  "4517829063": {
    trainNo: "20607", trainName: "Mysuru Vande Bharat Express", date: "23 Sep 2026",
    from: "KSR Bengaluru City Junction (SBC)", to: "Mysuru Junction (MYS)",
    boarding: "SBC", cls: "CC", quota: "General", chart: "Chart prepared",
    passengers: [
      { name: "Passenger 1", booking: "CNF/C4/24/Window", current: "CNF/C4/24/Window", status: "ok" },
      { name: "Passenger 2", booking: "CNF/C4/25/Aisle", current: "CNF/C4/25/Aisle", status: "ok" },
    ],
  },
  "8823410597": {
    trainNo: "12628", trainName: "Karnataka Express", date: "27 Sep 2026",
    from: "KSR Bengaluru City Junction (SBC)", to: "New Delhi (NDLS)",
    boarding: "SBC", cls: "3A", quota: "General", chart: "Chart not prepared",
    passengers: [
      { name: "Passenger 1", booking: "RAC 12", current: "CNF/B2/41/Lower", status: "ok" },
      { name: "Passenger 2", booking: "WL 34", current: "WL 18", status: "warn" },
    ],
  },
  "6390174528": {
    trainNo: "12951", trainName: "Mumbai Rajdhani Express", date: "01 Oct 2026",
    from: "Mumbai Central (MMCT)", to: "New Delhi (NDLS)",
    boarding: "MMCT", cls: "2A", quota: "Tatkal", chart: "Chart not prepared",
    passengers: [{ name: "Passenger 1", booking: "CNF/A1/08/Upper", current: "CNF/A1/08/Upper", status: "ok" }],
  },
};

/* Demo live running status */
const LIVE_TRAINS = [
  {
    no: "20607", name: "Mysuru Vande Bharat Express", delay: 6, updated: "2 minutes ago",
    stops: [
      { code: "MAS", name: "MGR Chennai Central", sch: "05:50", act: "05:50", state: "departed" },
      { code: "KPD", name: "Katpadi Junction", sch: "07:05", act: "07:09", state: "departed" },
      { code: "JTJ", name: "Jolarpettai Junction", sch: "07:58", act: "08:05", state: "departed" },
      { code: "BWT", name: "Bangarapet", sch: "09:12", act: "09:18", state: "current" },
      { code: "SBC", name: "KSR Bengaluru City Junction", sch: "10:15", act: "10:21", state: "upcoming" },
      { code: "MYA", name: "Mandya", sch: "11:48", act: "11:54", state: "upcoming" },
      { code: "MYS", name: "Mysuru Junction", sch: "12:30", act: "12:36", state: "upcoming" },
    ],
  },
  {
    no: "12951", name: "Mumbai Rajdhani Express", delay: 0, updated: "5 minutes ago",
    stops: [
      { code: "MMCT", name: "Mumbai Central", sch: "17:00", act: "17:00", state: "departed" },
      { code: "BRC", name: "Vadodara Junction", sch: "21:23", act: "21:23", state: "departed" },
      { code: "RTM", name: "Ratlam Junction", sch: "23:55", act: "23:55", state: "current" },
      { code: "KOTA", name: "Kota Junction", sch: "03:00", act: "03:00", state: "upcoming" },
      { code: "NDLS", name: "New Delhi", sch: "08:32", act: "08:32", state: "upcoming" },
    ],
  },
  {
    no: "12628", name: "Karnataka Express", delay: 42, updated: "just now",
    stops: [
      { code: "SBC", name: "KSR Bengaluru City Junction", sch: "19:20", act: "19:20", state: "departed" },
      { code: "DMM", name: "Dharmavaram Junction", sch: "23:30", act: "23:58", state: "departed" },
      { code: "SC", name: "Secunderabad Junction", sch: "06:00", act: "06:42", state: "current" },
      { code: "NGP", name: "Nagpur Junction", sch: "13:30", act: "14:12", state: "upcoming" },
      { code: "BPL", name: "Bhopal Junction", sch: "19:05", act: "19:47", state: "upcoming" },
      { code: "NDLS", name: "New Delhi", sch: "10:45", act: "11:27", state: "upcoming" },
    ],
  },
  {
    no: "22105", name: "Indrayani Express", delay: 11, updated: "1 minute ago",
    stops: [
      { code: "CSMT", name: "Mumbai CSMT", sch: "05:25", act: "05:25", state: "departed" },
      { code: "DR", name: "Dadar", sch: "05:33", act: "05:36", state: "departed" },
      { code: "KYN", name: "Kalyan Junction", sch: "06:05", act: "06:13", state: "current" },
      { code: "LNL", name: "Lonavala", sch: "07:38", act: "07:49", state: "upcoming" },
      { code: "PUNE", name: "Pune Junction", sch: "09:00", act: "09:11", state: "upcoming" },
    ],
  },
];
