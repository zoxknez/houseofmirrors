import type { LucideIcon } from "lucide-react";
import {
    Wifi, Wind, Flame, WashingMachine, Lock, Key, Tv, Film, Music, Disc,
    Laptop, Armchair, Heart, Sparkles, Utensils, Refrigerator, CookingPot,
    Coffee, UtensilsCrossed, Droplets, Sparkle, Car, TreeDeciduous, Shield,
    Bell, Cross, AlertTriangle
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
    Wifi, Wind, Flame, WashingMachine, Lock, Key, Tv, Film, Music, Disc,
    Laptop, Armchair, Heart, Sparkles, Utensils, Refrigerator, CookingPot,
    Coffee, UtensilsCrossed, Droplets, Sparkle, Car, TreeDeciduous, Shield,
    Bell, Cross, AlertTriangle
};

export const categoryNames: Record<string, string> = {
    essentials: "Osnovno",
    entertainment: "Zabava & Tehnika",
    wellness: "Wellness & Spa",
    kitchen: "Kuhinja & Trpezarija",
    bathroom: "Kupatilo",
    outdoor: "Parking i Eksterijer",
    safety: "Sigurnost",
};

export function groupByCategory<T extends { category?: string }>(items: T[]) {
    return items.reduce<Record<string, T[]>>((acc, item) => {
        const key = item.category || "ostalo";
        (acc[key] ||= []).push(item);
        return acc;
    }, {});
}

export const defaultCategoryOrder = [
    "wellness",
    "entertainment",
    "kitchen",
    "bathroom",
    "essentials",
    "outdoor",
    "safety",
] as const;
