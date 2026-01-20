"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { propertyData } from "@/data/property";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DividerHeading } from "@/components/ui/DividerHeading";
import { iconMap, categoryNames, groupByCategory, defaultCategoryOrder } from "@/lib/amenities";

export function Amenities() {
    const grouped = useMemo(
        () => groupByCategory(propertyData.amenities),
        []
    );

    return (
        <section id="amenities" className="relative py-24 md:py-40 bg-black overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[var(--accent)]/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-[var(--gold)]/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-6 md:px-10 relative z-10">
                <SectionHeader
                    badge="Sadržaj"
                    title={<>Šta nudimo</>}
                    subtitle="Pažljivo odabrana oprema i pogodnosti za vaš savršen boravak i potpuno opuštanje."
                />

                <div className="space-y-12 md:space-y-20">
                    {defaultCategoryOrder.map((catKey, index) => {
                        const amenities = grouped[catKey];
                        if (!amenities?.length) return null;

                        return (
                            <motion.div
                                key={catKey}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <DividerHeading>{categoryNames[catKey] || catKey}</DividerHeading>

                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                    {amenities.map((item, i) => {
                                        const Icon = iconMap[item.icon as string] || Sparkles;
                                        return (
                                            <div key={i} className="amenity-card group">
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
