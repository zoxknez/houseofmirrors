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
        <section id="highlights" className="relative py-24 md:py-40 bg-black overflow-hidden">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
                    {propertyData.highlights.map((highlight, index) => {
                        const Icon = iconMap[highlight.icon as keyof typeof iconMap] || Sparkles;

                        return (
                            <motion.article
                                key={highlight.title}
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-80px" }}
                                transition={{ duration: 0.6, delay: index * 0.08 }}
                            >
                                <GlassCard className="group relative p-10 md:p-14 rounded-3xl text-center flex flex-col items-center hover:bg-white/[0.04] hover:border-[var(--gold)]/30 transition-all duration-700 overflow-hidden">
                                    {/* Hover sheen */}
                                    <div
                                        aria-hidden="true"
                                        className="absolute inset-0 bg-gradient-to-br from-[var(--gold)]/6 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                                    />

                                    {/* Icon Circle */}
                                    <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-[var(--gold)]/5 border border-[var(--gold)]/20 flex items-center justify-center mb-10 group-hover:bg-[var(--gold)]/10 group-hover:border-[var(--gold)]/40 group-hover:scale-110 transition-all duration-500 shadow-[0_0_30px_rgba(212,175,55,0.05)] group-hover:shadow-[0_0_40px_rgba(212,175,55,0.15)]">
                                        <Icon className="w-7 h-7 md:w-9 md:h-9 text-[var(--gold)]" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="relative text-xl md:text-2xl font-black uppercase tracking-[0.1em] text-white mb-5">
                                        {highlight.title}
                                    </h3>
                                    <p className="relative text-sm md:text-base text-white/40 leading-relaxed max-w-[320px]">
                                        {highlight.description}
                                    </p>

                                    {/* Hover Gold Line */}
                                    <div
                                        aria-hidden="true"
                                        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--gold)]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
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
