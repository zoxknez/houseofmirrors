"use client";

import React from "react";
import { motion } from "framer-motion";
import { propertyData } from "@/data/property";
import {
    Wifi,
    Wind,
    Flame,
    WashingMachine,
    Lock,
    Key,
    Tv,
    Film,
    Music,
    Disc,
    Laptop,
    Armchair,
    Heart,
    Sparkles,
    Utensils,
    Refrigerator,
    CookingPot,
    Coffee,
    UtensilsCrossed,
    Droplets,
    Sparkle,
    Car,
    TreeDeciduous,
    Shield,
    Bell,
    Cross,
    AlertTriangle,
    LucideIcon
} from "lucide-react";

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
    Wifi,
    Wind,
    Flame,
    WashingMachine,
    Lock,
    Key,
    Tv,
    Film,
    Music,
    Disc,
    Laptop,
    Armchair,
    Heart,
    Sparkles,
    Utensils,
    Refrigerator,
    CookingPot,
    Coffee,
    UtensilsCrossed,
    Droplets,
    Sparkle,
    Car,
    TreeDeciduous,
    Shield,
    Bell,
    Cross,
    AlertTriangle
};

// Category display names
const categoryNames: Record<string, string> = {
    essentials: "Osnovno",
    entertainment: "Zabava & Tehnika",
    wellness: "Wellness & Spa",
    kitchen: "Kuhinja & Trpezarija",
    bathroom: "Kupatilo",
    outdoor: "Parking i Eksterijer",
    safety: "Sigurnost",
};

export function Amenities() {
    // Group amenities by category
    const groupedAmenities = propertyData.amenities.reduce((acc, amenity) => {
        const category = amenity.category || "ostalo";
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(amenity);
        return acc;
    }, {} as Record<string, typeof propertyData.amenities>);

    // Order of categories
    const categoryOrder = [
        "wellness",
        "entertainment",
        "kitchen",
        "bathroom",
        "essentials",
        "outdoor",
        "safety"
    ];

    return (
        <section id="amenities" className="section bg-black relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[var(--accent)]/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-[var(--gold)]/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16 md:mb-24"
                >
                    {/* Badge with lines */}
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="h-px flex-1 max-w-[80px] md:max-w-[120px] bg-gradient-to-r from-transparent to-[var(--gold)]/50" />
                        <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-[var(--gold)]">
                            Sadržaj
                        </span>
                        <div className="h-px flex-1 max-w-[80px] md:max-w-[120px] bg-gradient-to-l from-transparent to-[var(--gold)]/50" />
                    </div>

                    {/* Title */}
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white mb-6">
                        Šta nudimo
                    </h2>
                    <p className="text-sm md:text-base text-white/50 max-w-2xl mx-auto">
                        Pažljivo odabrana oprema i pogodnosti za vaš savršen boravak i potpuno opuštanje.
                    </p>
                </motion.div>

                <div className="space-y-12 md:space-y-20">
                    {categoryOrder.map((catKey, index) => {
                        const amenities = groupedAmenities[catKey];
                        if (!amenities) return null;

                        return (
                            <motion.div
                                key={catKey}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <div className="flex items-center justify-center gap-4 mb-8">
                                    <div className="h-px flex-1 max-w-[100px] md:max-w-[150px] bg-gradient-to-r from-transparent to-white/20" />
                                    <h3 className="text-sm md:text-base font-black uppercase tracking-[0.4em] text-white/50 text-center whitespace-nowrap">
                                        {categoryNames[catKey] || catKey}
                                    </h3>
                                    <div className="h-px flex-1 max-w-[100px] md:max-w-[150px] bg-gradient-to-l from-transparent to-white/20" />
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                    {amenities.map((item, i) => {
                                        const Icon = iconMap[item.icon as string] || Sparkles;
                                        return (
                                            <div
                                                key={i}
                                                className="amenity-card group"
                                            >
                                                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-[var(--accent)]/20 transition-colors">
                                                    <Icon className="w-5 h-5 text-[var(--gold)] group-hover:text-[var(--accent)] transition-colors" />
                                                </div>
                                                <span className="text-sm md:text-base text-white/80 font-medium group-hover:text-white transition-colors">
                                                    {item.name}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
