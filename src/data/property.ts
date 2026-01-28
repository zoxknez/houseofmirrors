export const propertyData = {
  name: "House of Mirrors",
  tagline: "Luksuzni apartman u srcu Beograda",
  description: `Dobrodošli u House of Mirrors - jedinstven luksuzni apartman dizajniran za nezaboravan odmor. 
  
Ovaj moderni apartman od 40m² nudi savršenu kombinaciju opuštanja i high-tech udobnosti. Spavaća soba sa satenskom posteljinom i upečatljivim ogledalima na zidovima i plafonu stvara magičnu atmosferu.

Uživajte u profesionalnoj masažnoj fotelji, vrhunskom 5.1 Hi-Fi sistemu i 65" TV-u sa Netflix i HBO Max pristupom. Za dodatnu relaksaciju, na raspolaganju vam je i profesionalni sto za masažu.

Apartman se nalazi u mirnom i bezbednom kraju Neimar, samo 10 minuta od centra grada i 18 minuta hoda od Hrama Svetog Save.`,

  shortDescription: "Luksuzno renoviran apartman sa jedinstvenim dizajnom ogledala, profesionalnom masažnom foteljom i premium Hi-Fi sistemom.",

  location: {
    address: "Ustanička 10, Apt 15",
    city: "Beograd",
    postalCode: "11010",
    country: "Srbija",
    neighborhood: "Neimar",
    coordinates: {
      lat: 44.78914412726245,
      lng: 20.472486606257085
    },
    nearbyAttractions: [
      { name: "Hram Svetog Save", distance: "18 min pešice" },
      { name: "Park Karađorđev", distance: "5 min pešice" },
      { name: "Centar grada", distance: "10 min autobusom" }
    ]
  },

  details: {
    size: "40 m²",
    maxGuests: 4,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    bedConfiguration: "1 bračni krevet + 1 kauč na razvlačenje"
  },

  pricing: {
    basePrice: 55,
    currency: "EUR",
    cleaningFee: 20,
    minNights: 2
  },

  rules: {
    checkIn: "14:00",
    checkOut: "11:00",
    quietHours: { start: "23:00", end: "07:00" },
    smoking: false,
    pets: false,
    parties: false,
    children: true
  },

  amenities: [
    // Essentials
    { icon: "Wifi", name: "Brzi WiFi", category: "essentials" },
    { icon: "Wind", name: "Klima uređaj", category: "essentials" },
    { icon: "Flame", name: "Grejanje", category: "essentials" },
    { icon: "WashingMachine", name: "Veš mašina", category: "essentials" },
    { icon: "Lock", name: "Sef", category: "essentials" },
    { icon: "Key", name: "Ulaz PIN kodom", category: "essentials" },

    // Entertainment
    { icon: "Tv", name: "65\" Smart TV", category: "entertainment" },
    { icon: "Film", name: "Netflix & HBO Max", category: "entertainment" },
    { icon: "Music", name: "5.1 Hi-Fi sistem", category: "entertainment" },

    // Wellness
    { icon: "Armchair", name: "Profesionalna masažna fotelja", category: "wellness" },
    { icon: "Heart", name: "Profesionalni sto za masažu", category: "wellness" },
    { icon: "Sparkles", name: "2 prečišćivača vazduha", category: "wellness" },

    // Kitchen
    { icon: "Utensils", name: "Potpuno opremljena kuhinja", category: "kitchen" },
    { icon: "Refrigerator", name: "Frižider", category: "kitchen" },
    { icon: "CookingPot", name: "Šporet i Air Fryer", category: "kitchen" },
    { icon: "UtensilsCrossed", name: "Mašina za sudove", category: "kitchen" },

    // Bathroom
    { icon: "Droplets", name: "Tuš kabina", category: "bathroom" },
    { icon: "Wind", name: "Fen za kosu", category: "bathroom" },
    { icon: "Sparkle", name: "Besplatni toaletni pribor", category: "bathroom" },

    // Parking & Outdoor
    { icon: "Car", name: "Besplatan privatni parking", category: "outdoor" },
    { icon: "TreeDeciduous", name: "Pogled na baštu", category: "outdoor" },

    // Safety
    { icon: "Shield", name: "Detektor dima", category: "safety" },
    { icon: "Bell", name: "Detektor ugljen-monoksida", category: "safety" },
    { icon: "Cross", name: "Prva pomoć", category: "safety" },
    { icon: "AlertTriangle", name: "Aparat za gašenje požara", category: "safety" }
  ],

  highlights: [
    {
      icon: "Sparkles",
      title: "Jedinstveni Mirror dizajn",
      description: "Spavaća soba sa ogledalima na zidovima i plafonu"
    },
    {
      icon: "Heart",
      title: "Wellness oprema",
      description: "Profesionalna masažna fotelja i sto za masažu"
    },
    {
      icon: "Music",
      title: "Premium slika i zvuk",
      description: "65\" TV • 5.1 Hi-Fi sistem za savršen audio doživljaj"
    },
    {
      icon: "Car",
      title: "Besplatan parking",
      description: "Siguran privatni parking uključen u cenu"
    }
  ],

  host: {
    name: "Ljubo",
    phone: "+381 64 175 2332",
    email: "house.of.mirrors.belgrade@gmail.com",
    responseRate: "100%",
    responseTime: "u roku od sat vremena"
  },

  reviews: {
    rating: 10,
    totalReviews: 2,
    platform: "Booking.com",
    highlights: [
      "Izuzetan komfor",
      "Savršena čistoća",
      "Fantastičan domaćin"
    ]
  }
};

export type PropertyData = typeof propertyData;
