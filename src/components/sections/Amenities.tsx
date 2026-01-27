"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DividerHeading } from "@/components/ui/DividerHeading";
import { iconMap, groupByCategory, defaultCategoryOrder } from "@/lib/amenities";
import { useLanguage } from "@/context/LanguageContext";

function getIcon(key?: string) {
    if (!key) return Sparkles;
    return (iconMap as Record<string, any>)[key] ?? Sparkles;
}

export function Amenities() {
    const { dict } = useLanguage();

    const grouped = useMemo(
        () => groupByCategory(dict.amenities.items),
        [dict.amenities.items]
    );

    return (
        <section id="amenities" className="relative py-20 md:py-32 bg-black overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[var(--accent)]/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-[var(--gold)]/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-6 md:px-10 relative z-10">
                <SectionHeader
                    badge={dict.amenities.title}
                    title={<>{dict.amenities.title}</>}
                    subtitle={dict.amenities.subtitle}
                />

                <div className="space-y-10 md:space-y-14">
                    {defaultCategoryOrder.map((catKey, index) => {
                        const amenities = grouped[catKey];
                        if (!amenities?.length) return null;

                        return (
                            <motion.section
                                key={catKey}
                                aria-labelledby={`amenities-${catKey}`}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.08 }}
                            >
                                <div id={`amenities-${catKey}`}>
                                    <DividerHeading>
                                        {dict.amenities.categories[catKey] || catKey}
                                    </DividerHeading>
                                </div>

                                <ul
                                    role="list"
                                    className="flex flex-wrap gap-3 md:gap-4"
                                >
                                    {amenities.map((item) => {
                                        const Icon = getIcon(item.icon as string);

                                        return (
                                            <li
                                                key={`${catKey}-${item.name}-${item.icon ?? "noicon"}`}
                                                className="amenity-card group
                                                    focus-within:ring-1 focus-within:ring-[var(--gold)]/40
                                                    active:bg-white/10 active:border-[var(--gold)]/40"
                                            >
                                                <div
                                                    className="p-1.5 md:p-2 rounded-full bg-white/5 transition-colors
                                                        group-hover:bg-[var(--accent)]/20
                                                        group-focus-within:bg-[var(--accent)]/20"
                                                    aria-hidden="true"
                                                >
                                                    <Icon
                                                        className="w-4 h-4 md:w-5 md:h-5 text-[var(--gold)] transition-colors
                                                            group-hover:text-[var(--accent)]
                                                            group-focus-within:text-[var(--accent)]"
                                                    />
                                                </div>

                                                <span className="text-xs md:text-sm text-white/80 font-semibold tracking-tight transition-colors group-hover:text-white group-focus-within:text-white">
                                                    {item.name}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </motion.section>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
