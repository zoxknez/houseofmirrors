"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Heart, Music, Car, type LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/context/LanguageContext";

const iconMap = {
    Sparkles,
    Heart,
    Music,
    Car,
} satisfies Record<string, LucideIcon>;

export function Highlights() {
    const { dict } = useLanguage();

    return (
        <section id="highlights" className="relative py-20 md:py-32 bg-black overflow-hidden">
            {/* Background Glow */}
            <div
                aria-hidden="true"
                className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-100 bg-accent/5 rounded-full blur-[150px] pointer-events-none"
            />

            <div className="max-w-350 mx-auto px-6 md:px-10 relative z-10">
                <SectionHeader
                    badge={dict.hero.experienceLuxury}
                    title={
                        <>
                            {dict.highlights.title}
                        </>
                    }
                    subtitle={dict.amenities.subtitle}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 max-w-6xl mx-auto auto-rows-fr">
                    {dict.highlights.items.map((highlight, index) => {
                        const Icon = iconMap[highlight.icon as keyof typeof iconMap] || Sparkles;

                        return (
                            <motion.article
                                key={highlight.title}
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-80px" }}
                                transition={{ duration: 0.6, delay: index * 0.08 }}
                                className="h-full"
                            >
                                <GlassCard className="group relative p-5 md:p-6 rounded-2xl flex items-start gap-4 hover:bg-white/4 hover:border-gold/25 transition-all duration-500 overflow-hidden h-full">
                                    {/* Hover sheen */}
                                    <div
                                        aria-hidden="true"
                                        className="absolute inset-0 bg-linear-to-br from-gold/6 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                                    />

                                    {/* Icon Circle */}
                                    <div className="relative w-11 h-11 md:w-12 md:h-12 rounded-full bg-gold/5 border border-gold/20 flex items-center justify-center shrink-0 group-hover:bg-gold/10 group-hover:border-gold/40 transition-all duration-500 shadow-[0_0_24px_rgba(212,175,55,0.08)]">
                                        <Icon className="w-5 h-5 md:w-6 md:h-6 text-gold" />
                                    </div>

                                    {/* Content */}
                                    <div className="relative">
                                        <h3 className="text-sm md:text-base font-black uppercase tracking-[0.18em] text-white mb-2">
                                            {highlight.title}
                                        </h3>
                                        <p className="text-xs md:text-sm text-white/50 leading-relaxed">
                                            {highlight.description}
                                        </p>
                                    </div>

                                    {/* Hover Gold Line */}
                                    <div
                                        aria-hidden="true"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    />
                                </GlassCard>
                            </motion.article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
