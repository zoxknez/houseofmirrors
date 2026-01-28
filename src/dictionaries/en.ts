import { Dictionary } from "./types";

export const en: Dictionary = {
    hero: {
        experienceLuxury: "Experience Luxury",
        officialRating: "4 Stars",
        officialRatingDesc: "Official categorization (maximum rating by Ministry of Tourism)",
        bookNow: "Book Now",
        explore: "Explore",
        stats: {
            size: "Size",
            guests: "Guests",
            bedrooms: "Bedrooms",
            bathrooms: "Bathrooms"
        }
    },
    gallery: {
        title: "Gallery",
        viewGallery: "View Gallery",
        photoCount: "photos",
        categories: {
            all: "All",
            living: "Living Room",
            bedroom: "Bedroom",
            kitchen: "Kitchen",
            bathroom: "Bathroom",
        },
    },
    highlights: {
        title: "Highlights",
        items: [
            {
                icon: "Sparkles",
                title: "Unique Mirror Design",
                description: "Bedroom with mirrors on walls and ceiling",
            },
            {
                icon: "Heart",
                title: "Wellness Equipment",
                description: "Professional massage chair and massage table",
            },
            {
                icon: "Music",
                title: "Premium Audio & Video",
                description: '65" TV • 5.1 Hi-Fi system for perfect audio experience',
            },
            {
                icon: "Car",
                title: "Free Parking",
                description: "Secure private parking included in price",
            },
        ],
    },
    amenities: {
        title: "Amenities",
        subtitle: "Everything you need for a perfect stay",
        categories: {
            essentials: "Essentials",
            entertainment: "Entertainment",
            wellness: "Wellness",
            kitchen: "Kitchen",
            bathroom: "Bathroom",
            outdoor: "Outdoor & Parking",
            safety: "Safety",
        },
        items: [
            { icon: "Wifi", name: "High-speed WiFi", category: "essentials" },
            { icon: "Wind", name: "Air Conditioning", category: "essentials" },
            { icon: "Flame", name: "Heating", category: "essentials" },
            { icon: "WashingMachine", name: "Washing Machine", category: "essentials" },
            { icon: "Lock", name: "Safe", category: "essentials" },
            { icon: "Key", name: "Keyless PIN Entry", category: "essentials" },
            { icon: "Tv", name: '65" Smart TV', category: "entertainment" },
            { icon: "Film", name: "Netflix & HBO Max", category: "entertainment" },
            { icon: "Music", name: "5.1 Hi-Fi System", category: "entertainment" },
            { icon: "Armchair", name: "Professional Massage Chair", category: "wellness" },
            { icon: "Heart", name: "Professional Massage Table", category: "wellness" },
            { icon: "Sparkles", name: "2 Air Purifiers", category: "wellness" },
            { icon: "Utensils", name: "Fully Equipped Kitchen", category: "kitchen" },
            { icon: "Refrigerator", name: "Refrigerator", category: "kitchen" },
            { icon: "CookingPot", name: "Stove & Air Fryer", category: "kitchen" },
            { icon: "UtensilsCrossed", name: "Dishwasher", category: "kitchen" },
            { icon: "Droplets", name: "Walk-in Shower", category: "bathroom" },
            { icon: "Wind", name: "Hairdryer", category: "bathroom" },
            { icon: "Sparkle", name: "Free Toiletries", category: "bathroom" },
            { icon: "Car", name: "Free Private Parking", category: "outdoor" },
            { icon: "TreeDeciduous", name: "Garden View", category: "outdoor" },
            { icon: "Shield", name: "Smoke Detector", category: "safety" },
            { icon: "Bell", name: "Monoxide Detector", category: "safety" },
            { icon: "Cross", name: "First Aid Kit", category: "safety" },
            { icon: "AlertTriangle", name: "Fire Extinguisher", category: "safety" },
        ],
    },
    location: {
        title: "Location",
        subtitle: "A quiet oasis near the center",
        address: "Ustanička 10, Apt 15",
        neighborhood: "Neimar",
        nearby: {
            temple: "Saint Sava Temple",
            park: "Karađorđev Park",
            center: "City Center",
        },
        directions: "Get Directions",
    },
    houseRules: {
        title: "House Rules",
        subtitle: "Please respect the rules to ensure a pleasant stay for everyone.",
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
        title: "Booking",
        subtitle: "Select dates for your stay",
        pricePerNight: "night",
        total: "Total",
        nights: "nights",
        cleaningFee: "Cleaning Fee",
        bookButton: "Request Booking",
        selectDates: "Select Dates",
    },
    about: {
        title: "About this space",
        description: "House of Mirrors is a luxury, fully renovated apartment designed for comfort and relaxation. Situated in a quiet, safe neighborhood just 10 minutes from the city center, it offers the perfect blend of privacy and connectivity.",
        readMore: "About this space",
        space: {
            title: "The Space",
            content: "This modern apartment is thoughtfully designed for both short and extended stays. Every detail—from luxury furniture to state-of-the-art equipment—has been selected to provide maximum comfort. The kitchen is fully equipped with all necessary appliances and kitchenware to make you feel right at home."
        },
        access: {
            title: "Guest Access",
            content: "Guests have full and exclusive access to the entire apartment."
        },
        features: [
            "The apartment consists of a living room, bedroom, fully equipped kitchen, and modern bathroom. A 65” TV with a premium 5.1 Hi-Fi audio system, plus free Netflix and HBO Max, delivers a true cinematic experience.",
            "The bedroom features a comfortable double bed with satin bedding, as well as mirrored surfaces on walls and ceilings that enhance the light, spaciousness, and create a sophisticated, elegant atmosphere.",
            "For complete relaxation, a professional massage chair is available, along with a massage table upon request. Two air purifiers ensure clean, fresh air throughout the apartment.",
            "Private, secure parking is provided."
        ],
        close: "Close"
    },
    contact: {
        title: "Contact",
        subtitle: "Have questions?",
        name: "Name",
        email: "Email",
        phone: "Phone",
        message: "Message",
        send: "Send",
        sending: "Sending...",
        success: "Message sent successfully!",
        error: "An error occurred. Please try again.",
    },
    footer: {
        rights: "All rights reserved",
        privacy: "Privacy Policy",
        terms: "Terms of Use",
    },
    property: {
        name: "House of Mirrors",
        tagline: "Luxury apartment in the heart of Belgrade",
        description: `Welcome to House of Mirrors - a unique luxury apartment designed for an unforgettable stay.

This modern 40m² apartment offers the perfect blend of relaxation and high-tech comfort. The bedroom features satin bedding and striking mirrors on the walls and ceiling, creating a magical atmosphere.

Enjoy the professional massage chair, premium 5.1 Hi-Fi system, and 65" TV with Netflix and HBO Max. For added relaxation, a professional massage table is also at your disposal.

The apartment is located in the quiet and safe Neimar neighborhood, just 10 minutes from the city center and an 18-minute walk from the Temple of Saint Sava.`,
        shortDescription:
            "Luxuriously renovated apartment with unique mirror design, professional massage chair, and premium Hi-Fi system.",
        details: {
            size: "40 m²",
            maxGuests: 4,
            bedrooms: 1,
            beds: 2,
            bathrooms: 1,
            bedConfiguration: "1 Queen Bed + 1 Sofa Bed",
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
            responseTime: "within an hour",
        },
        reviews: {
            rating: 10,
            totalReviews: 2,
            platform: "Booking.com",
            highlights: [
                "Exceptional comfort",
                "Perfect cleanliness",
                "Fantastic host"
            ]
        },
    },
};
