import { Dictionary } from "./types";

export const sr: Dictionary = {
    hero: {
        experienceLuxury: "Doživite Luksuz",
        officialRating: "4 zvezdice",
        officialRatingDesc: "Zvanična kategorizacija (maksimalna ocena po rešenju Ministarstva turizma)",
        bookNow: "Rezerviši sada",
        explore: "Istraži prostor",
        stats: {
            size: "Kvadratura",
            guests: "Gostiju",
            bedrooms: "Spavaće",
            bathrooms: "Kupatila"
        }
    },
    gallery: {
        title: "Galerija",
        viewGallery: "Pogledaj galeriju",
        photoCount: "fotografija",
        categories: {
            all: "Sve",
            living: "Dnevna soba",
            bedroom: "Spavaća soba",
            kitchen: "Kuhinja",
            bathroom: "Kupatilo",
        },
    },
    highlights: {
        title: "Izdvajamo",
        items: [
            {
                icon: "Sparkles",
                title: "Jedinstveni Mirror dizajn",
                description: "Spavaća soba sa ogledalima na zidovima i plafonu",
            },
            {
                icon: "Heart",
                title: "Wellness oprema",
                description: "Profesionalna masažna fotelja i sto za masažu",
            },
            {
                icon: "Music",
                title: "Premium slika i zvuk",
                description: '65" TV • 5.1 Hi-Fi sistem za savršen audio doživljaj',
            },
            {
                icon: "Car",
                title: "Besplatan parking",
                description: "Siguran privatni parking uključen u cenu",
            },
        ],
    },
    amenities: {
        title: "Sadržaj",
        subtitle: "Sve što vam je potrebno za savršen boravak",
        categories: {
            essentials: "Osnovno",
            entertainment: "Zabava",
            wellness: "Wellness",
            kitchen: "Kuhinja",
            bathroom: "Kupatilo",
            outdoor: "Dvorište i Parking",
            safety: "Sigurnost",
        },
        items: [
            { icon: "Wifi", name: "Brzi WiFi", category: "essentials" },
            { icon: "Wind", name: "Klima uređaj", category: "essentials" },
            { icon: "Flame", name: "Grejanje", category: "essentials" },
            { icon: "WashingMachine", name: "Veš mašina", category: "essentials" },
            { icon: "Lock", name: "Sef", category: "essentials" },
            { icon: "Key", name: "Ulaz PIN kodom", category: "essentials" },
            { icon: "Tv", name: '65" Smart TV', category: "entertainment" },
            { icon: "Film", name: "Netflix & HBO Max", category: "entertainment" },
            { icon: "Music", name: "5.1 Hi-Fi sistem", category: "entertainment" },
            { icon: "Armchair", name: "Profesionalna masažna fotelja", category: "wellness" },
            { icon: "Heart", name: "Profesionalni sto za masažu", category: "wellness" },
            { icon: "Sparkles", name: "2 prečišćivača vazduha", category: "wellness" },
            { icon: "Utensils", name: "Potpuno opremljena kuhinja", category: "kitchen" },
            { icon: "Refrigerator", name: "Frižider", category: "kitchen" },
            { icon: "CookingPot", name: "Šporet i Air Fryer", category: "kitchen" },
            { icon: "UtensilsCrossed", name: "Mašina za sudove", category: "kitchen" },
            { icon: "Droplets", name: "Tuš kabina", category: "bathroom" },
            { icon: "Wind", name: "Fen za kosu", category: "bathroom" },
            { icon: "Sparkle", name: "Besplatni toaletni pribor", category: "bathroom" },
            { icon: "Car", name: "Besplatan privatni parking", category: "outdoor" },
            { icon: "TreeDeciduous", name: "Pogled na baštu", category: "outdoor" },
            { icon: "Shield", name: "Detektor dima", category: "safety" },
            { icon: "Bell", name: "Detektor ugljen-monoksida", category: "safety" },
            { icon: "Cross", name: "Prva pomoć", category: "safety" },
            { icon: "AlertTriangle", name: "Aparat za gašenje požara", category: "safety" },
        ],
    },
    location: {
        title: "Lokacija",
        subtitle: "Mirna oaza u blizini centra",
        address: "Ustanička 10, Apt 15",
        neighborhood: "Neimar",
        nearby: {
            temple: "Hram Svetog Save",
            park: "Park Karađorđev",
            center: "Centar grada",
        },
        directions: "Uputstva",
    },
    houseRules: {
        title: "Pravila Kuće",
        subtitle: "Molimo vas da poštujete pravila kako bi boravak bio prijatan za sve.",
        rules: {
            checkIn: "14:00",
            checkOut: "11:00",
            quietHoursStart: "22:00",
            quietHoursEnd: "08:00",
            smoking: false,
            pets: false,
            parties: false,
            children: true,
        },
    },
    booking: {
        title: "Rezervacija",
        subtitle: "Izaberite datume svog boravka",
        pricePerNight: "noć",
        total: "Ukupno",
        nights: "noći",
        cleaningFee: "Naknada za čišćenje",
        bookButton: "Pošalji zahtev",
        selectDates: "Izaberite datume",
    },
    about: {
        title: "O ovom prostoru",
        description: "House of Mirrors je luksuzan, potpuno renoviran apartman namenjen udobnom boravku i opuštanju. Nalazi se u mirnom i bezbednom kraju, na svega 10 minuta od centra grada, što ga čini idealnim izborom za goste koji žele privatnost, ali i dobru povezanost sa gradom.",
        readMore: "O ovom prostoru",
        badges: {
            rating: "Ocena",
            toCenter: "Do centra",
            neighborhood: "Komšiluk",
            design: "Dizajn"
        },
        space: {
            title: "Prostor",
            content: "Ovaj moderno uređen apartman pažljivo je osmišljen kako za kraće, tako i za duže boravke. Svaki detalj - od luksuznog nameštaja do savremene opreme - izabran je sa ciljem da pruži maksimalnu udobnost i opuštanje. Kuhinja je u potpunosti opremljena svim neophodnim aparatima i posuđem, kako biste se osećali kao kod kuće."
        },
        access: {
            title: "Pristup gostima",
            content: "Gosti imaju potpuni i isključivi pristup celom apartmanu."
        },
        features: [
            "Apartman se sastoji od dnevne sobe, spavaće sobe, potpuno opremljene kuhinje i modernog kupatila. Televizor od 65” sa premium 5.1 Hi-Fi audio sistemom, uz besplatan Netflix i HBO Max, pruža pravi bioskopski doživljaj.",
            "Spavaća soba poseduje udoban bračni krevet sa saten posteljinom, kao i ogledalne površine na zidu i plafonu, koje prostoru daju dodatnu svetlost, osećaj prostranosti i sofisticiranu, elegantnu atmosferu.",
            "Za potpuni užitak tokom boravka, gostima je na raspolaganju profesionalna masažna fotelja, a po potrebi i masažni sto. Dva prečišćivača vazduha obezbeđuju čist i svež vazduh u celom apartmanu.",
            "Obezbeđen je i privatan, siguran parking."
        ],
        close: "Zatvori"
    },
    contact: {
        title: "Kontakt",
        subtitle: "Imate pitanja?",
        name: "Ime",
        email: "Email",
        phone: "Telefon",
        message: "Poruka",
        send: "Pošalji",
        sending: "Slanje...",
        success: "Poruka uspešno poslata!",
        error: "Došlo je do greške. Molimo pokušajte ponovo.",
    },
    footer: {
        rights: "Sva prava zadržana",
        privacy: "Politika privatnosti",
        terms: "Uslovi korišćenja",
    },
    property: {
        name: "House of Mirrors",
        tagline: "Luksuzni apartman u srcu Beograda",
        description: `Dobrodošli u House of Mirrors - jedinstven luksuzni apartman dizajniran za nezaboravan odmor.
    
Ovaj moderni apartman od 40m² nudi savršenu kombinaciju opuštanja i high-tech udobnosti. Spavaća soba sa satenskom posteljinom i upečatljivim ogledalima na zidovima i plafonu stvara magičnu atmosferu.

Uživajte u profesionalnoj masažnoj fotelji, vrhunskom 5.1 Hi-Fi sistemu i 65" TV-u sa Netflix i HBO Max pristupom. Za dodatnu relaksaciju, na raspolaganju vam je i profesionalni sto za masažu.

Apartman se nalazi u mirnom i bezbednom kraju Neimar, samo 10 minuta od centra grada i 18 minuta hoda od Hrama Svetog Save.`,
        shortDescription:
            "Luksuzno renoviran apartman sa jedinstvenim dizajnom ogledala, profesionalnom masažnom foteljom i premium Hi-Fi sistemom.",
        details: {
            size: "40 m²",
            maxGuests: 4,
            bedrooms: 1,
            beds: 2,
            bathrooms: 1,
            bedConfiguration: "1 bračni krevet + 1 kauč na razvlačenje",
        },
        pricing: {
            basePrice: 55,
            currency: "EUR",
            cleaningFee: 20,
            minNights: 2,
        },
        rules: {
            checkIn: "14:00",
            checkOut: "11:00",
            quietHours: { start: "23:00", end: "07:00" },
            smoking: false,
            pets: false,
            parties: false,
            children: true,
        },
        host: {
            name: "Ljubo",
            responseRate: "100%",
            responseTime: "u roku od sat vremena",
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
        },
    },
};
