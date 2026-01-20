"use client";

import { motion } from "framer-motion";
import { propertyData } from "@/data/property";
import {
    Sparkles, Heart, Music, Car, Wifi,
    Wind, Flame, WashingMachine, Lock, Key,
    Tv, Film, Disc, Laptop, Armchair,
    Refrigerator, CookingPot, Coffee,
    UtensilsCrossed, Droplets, Sparkle,
    TreeDeciduous, Shield, Bell, Activity,
    Plus, AlertTriangle, Home, ChefHat, Bath, Circle,
    LucideIcon
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
    Sparkles, Heart, Music, Car, Wifi,
    Wind, Flame, WashingMachine, Lock, Key,
    Tv, Film, Disc, Laptop, Armchair,
    Refrigerator, CookingPot, Coffee,
    UtensilsCrossed, Droplets, Sparkle,
    TreeDeciduous, Shield, Bell, Activity,
    Plus, AlertTriangle, Home, ChefHat, Bath
};

function getIcon(iconName: string): LucideIcon {
    return ICON_MAP[iconName] || Circle;
}

export function Amenities() {
    const categories = [
        { id: "essentials", label: "Osnovne pogodnosti", icon: "Home" },
        { id: "entertainment", label: "Zabava", icon: "Tv" },
        { id: "wellness", label: "Wellness", icon: "Heart" },
        { id: "kitchen", label: "Kuhinja", icon: "ChefHat" },
        { id: "bathroom", label: "Kupatilo", icon: "Bath" },
        { id: "outdoor", label: "Parking i dvorište", icon: "Car" },
        { id: "safety", label: "Bezbednost", icon: "Shield" }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <section id="amenities" className="section bg-[var(--primary)]/50">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                    className="text-center mb-16"
                >
                    <p className="text-[var(--accent)] text-xs font-black uppercase tracking-[0.4em] mb-4">Ekskluzivno</p>
                    <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">
                        Premium <span className="opacity-40">Oprema</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
                    {propertyData.highlights.map((highlight, index) => {
                        const IconComponent = getIcon(highlight.icon);
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="p-8 deluxe-card group"
                            >
                                <div className="w-12 h-12 mb-6 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center border border-[var(--accent)]/20">
                                    <IconComponent className="w-6 h-6 text-[var(--accent)]" />
                                </div>
                                <h3 className="text-xl font-black text-white mb-2 tracking-tight uppercase">
                                    {highlight.title}
                                </h3>
                                <p className="text-[var(--text-muted)] text-sm leading-snug font-medium">
                                    {highlight.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* All Amenities by Category */}
                <div className="space-y-10">
                    {categories.map((category) => {
                        const categoryAmenities = propertyData.amenities.filter(
                            (a) => a.category === category.id
                        );
                        if (categoryAmenities.length === 0) return null;

                        const CategoryIcon = getIcon(category.icon);

                        return (
                            <motion.div
                                key={category.id}
                                variants={containerVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <CategoryIcon className="w-5 h-5 text-[var(--gold)]" />
                                    <h3 className="text-xl font-semibold text-white">
                                        {category.label}
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {categoryAmenities.map((amenity, index) => {
                                        const AmenityIcon = getIcon(amenity.icon);
                                        return (
                                            <motion.div
                                                key={index}
                                                variants={itemVariants}
                                                className="flex items-center gap-4 group"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[var(--accent)]/10 transition-colors">
                                                    <AmenityIcon className="w-4 h-4 text-white/40 group-hover:text-[var(--accent)] transition-colors" />
                                                </div>
                                                <span className="text-white/60 group-hover:text-white transition-colors text-xs font-bold uppercase tracking-widest leading-none">
                                                    {amenity.name}
                                                </span>
                                            </motion.div>
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
