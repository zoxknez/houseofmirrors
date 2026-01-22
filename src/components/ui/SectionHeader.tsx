"use client";

import { motion } from "framer-motion";

type SectionHeaderProps = {
    badge: string;
    title: React.ReactNode;
    subtitle?: string;
};

export function SectionHeader({ badge, title, subtitle }: SectionHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 md:mb-16"
        >
            <div className="flex items-center justify-center gap-4 mb-5">
                <div className="h-px flex-1 max-w-[80px] md:max-w-[120px] bg-gradient-to-r from-transparent to-[var(--gold)]/50" />
                <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-[var(--gold)]">
                    {badge}
                </span>
                <div className="h-px flex-1 max-w-[80px] md:max-w-[120px] bg-gradient-to-l from-transparent to-[var(--gold)]/50" />
            </div>

            <div className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white mb-4">
                {title}
            </div>

            {subtitle ? (
                <p className="text-xs md:text-sm text-white/50 max-w-2xl mx-auto">
                    {subtitle}
                </p>
            ) : null}
        </motion.div>
    );
}
