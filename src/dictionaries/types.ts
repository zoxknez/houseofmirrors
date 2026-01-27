import { LucideIcon } from "lucide-react";

export type Language = "en" | "sr";

export interface PropertyDetails {
    size: string;
    maxGuests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
    bedConfiguration: string;
}

export interface Pricing {
    basePrice: number;
    currency: string;
    cleaningFee: number;
    minNights: number;
}

export interface Rules {
    checkIn: string;
    checkOut: string;
    quietHours: { start: string; end: string };
    smoking: boolean;
    pets: boolean;
    parties: boolean;
    children: boolean;
}

export interface Amenity {
    icon: string; // We store string name of icon to dynamically render or map
    name: string;
    category: "essentials" | "entertainment" | "wellness" | "kitchen" | "bathroom" | "outdoor" | "safety";
}

export interface Highlight {
    icon: string;
    title: string;
    description: string;
}

export interface Host {
    name: string;
    responseRate: string;
    responseTime: string;
}

export interface ReviewData {
    rating: number;
    totalReviews: number;
    platform: string;
    highlights: string[];
}

export interface Dictionary {
    hero: {
        experienceLuxury: string;
        officialRating: string;
        officialRatingDesc: string;
        bookNow: string;
        explore: string;
        stats: {
            size: string;
            guests: string;
            bedrooms: string;
            bathrooms: string;
        };
    };
    gallery: {
        title: string;
        viewGallery: string;
        photoCount: string;
        categories: {
            all: string;
            living: string;
            bedroom: string;
            kitchen: string;
            bathroom: string;
        };
    };
    highlights: {
        title: string;
        items: Highlight[];
    };
    amenities: {
        title: string;
        subtitle: string;
        categories: {
            essentials: string;
            entertainment: string;
            wellness: string;
            kitchen: string;
            bathroom: string;
            outdoor: string;
            safety: string;
        };
        items: Amenity[];
    };
    location: {
        title: string;
        subtitle: string;
        address: string;
        neighborhood: string;
        nearby: {
            temple: string;
            park: string;
            center: string;
        };
        directions: string;
    };
    houseRules: {
        title: string;
        subtitle: string;
        rules: {
            checkIn: string;
            checkOut: string;
            quietHoursStart: string;
            quietHoursEnd: string;
            smoking: boolean;
            pets: boolean;
            parties: boolean;
            children: boolean;
        };
    };
    booking: {
        title: string;
        subtitle: string;
        pricePerNight: string;
        total: string;
        nights: string;
        cleaningFee: string;
        bookButton: string;
        selectDates: string;
    },
    about: {
        title: string;
        description: string;
        readMore: string;
        space: {
            title: string;
            content: string;
        };
        access: {
            title: string;
            content: string;
        };
        features: string[];
        close: string;
    },
    contact: {
        title: string;
        subtitle: string;
        name: string;
        email: string;
        phone: string;
        message: string;
        send: string;
        sending: string;
        success: string;
        error: string;
    };
    footer: {
        rights: string;
        privacy: string;
        terms: string;
    };
    property: {
        name: string;
        tagline: string;
        description: string;
        shortDescription: string;
        details: PropertyDetails;
        pricing: Pricing;
        rules: Rules;
        host: Host;
        reviews: ReviewData;
    };
}
