"use client";

import React from "react";
import { motion } from "framer-motion";
import { propertyData } from "@/data/property";
import { Sparkles, Heart, Music, Car, LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
    Sparkles,
    Heart,
    Music,
    Car
};

export function Highlights() {
    return (
        <section className="section bg-black relative overflow-hidden py-20 md:py-32">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[var(--accent)]/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="container relative z-10">
                {/* Section Header */}
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
                            Ekskluzivno
                        </span>
                        <div className="h-px flex-1 max-w-[80px] md:max-w-[120px] bg-gradient-to-l from-transparent to-[var(--gold)]/50" />
                    </div>

                    {/* Title */}
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-white mb-2">
                        Premium
                    </h2>
                    <h3 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-[var(--gold)]">
                        Oprema
                    </h3>
                </motion.div>

                {/* Highlights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
                    {propertyData.highlights.map((highlight, index) => {
                        const Icon = iconMap[highlight.icon] || Sparkles;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="group relative p-10 md:p-14 bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-3xl hover:bg-white/[0.04] hover:border-[var(--gold)]/30 transition-all duration-700 text-center flex flex-col items-center"
                            >
                                {/* Icon Circle */}
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[var(--gold)]/5 border border-[var(--gold)]/20 flex items-center justify-center mb-10 group-hover:bg-[var(--gold)]/10 group-hover:border-[var(--gold)]/40 group-hover:scale-110 transition-all duration-500 shadow-[0_0_30px_rgba(212,175,55,0.05)] group-hover:shadow-[0_0_40px_rgba(212,175,55,0.15)]">
                                    <Icon className="w-7 h-7 md:w-9 md:h-9 text-[var(--gold)]" />
                                </div>

                                {/* Content */}
                                <h4 className="text-xl md:text-2xl font-black uppercase tracking-[0.1em] text-white mb-5">
                                    {highlight.title}
                                </h4>
                                <p className="text-sm md:text-base text-white/40 leading-relaxed max-w-[280px] md:max-w-xs">
                                    {highlight.description}
                                </p>

                                {/* Hover Gold Line */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--gold)]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-2xl" />
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
