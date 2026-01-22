"use client";

import React from "react";
import { motion } from "framer-motion";
import { propertyData } from "@/data/property";
import { Sparkles, Heart, Music, Car, type LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlassCard } from "@/components/ui/GlassCard";

const iconMap = {
    Sparkles,
    Heart,
    Music,
    Car,
} satisfies Record<string, LucideIcon>;

export function Highlights() {
    return (
        <section id="highlights" className="relative py-20 md:py-32 bg-black overflow-hidden">
            {/* Background Glow */}
            <div
                aria-hidden="true"
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[var(--accent)]/5 rounded-full blur-[150px] pointer-events-none"
            />

            <div className="max-w-[1400px] mx-auto px-6 md:px-10 relative z-10">
                <SectionHeader
                    badge="Ekskluzivno"
                    title={
                        <>
                            Premium <span className="text-[var(--gold)]">Oprema</span>
                        </>
                    }
                    subtitle="Istaknute pogodnosti koje prave razliku tokom boravka."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 max-w-6xl mx-auto auto-rows-fr">
                    {propertyData.highlights.map((highlight, index) => {
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
                                <GlassCard className="group relative p-5 md:p-6 rounded-2xl flex items-start gap-4 hover:bg-white/[0.04] hover:border-[var(--gold)]/25 transition-all duration-500 overflow-hidden h-full">
                                    {/* Hover sheen */}
                                    <div
                                        aria-hidden="true"
                                        className="absolute inset-0 bg-gradient-to-br from-[var(--gold)]/6 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                                    />

                                    {/* Icon Circle */}
                                    <div className="relative w-11 h-11 md:w-12 md:h-12 rounded-full bg-[var(--gold)]/5 border border-[var(--gold)]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--gold)]/10 group-hover:border-[var(--gold)]/40 transition-all duration-500 shadow-[0_0_24px_rgba(212,175,55,0.08)]">
                                        <Icon className="w-5 h-5 md:w-6 md:h-6 text-[var(--gold)]" />
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
                                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--gold)]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
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
