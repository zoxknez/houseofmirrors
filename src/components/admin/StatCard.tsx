"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    trend?: {
        value: number; // npr 12.4
        isPositive: boolean;
        label?: string; // default: "vs prošli mesec"
    };
    color?: "gold" | "green" | "blue" | "purple" | "red";
}

const colorClasses: Record<NonNullable<StatCardProps["color"]>, string> = {
    gold: "from-[var(--gold)]/12 to-white/[0.02] border-[var(--gold)]/20",
    green: "from-emerald-500/15 to-white/[0.02] border-emerald-500/20",
    blue: "from-blue-500/15 to-white/[0.02] border-blue-500/20",
    purple: "from-purple-500/15 to-white/[0.02] border-purple-500/20",
    red: "from-red-500/15 to-white/[0.02] border-red-500/20",
};

const iconWrapClasses: Record<NonNullable<StatCardProps["color"]>, string> = {
    gold: "text-[var(--gold)] bg-[var(--gold)]/10 border-[var(--gold)]/15",
    green: "text-emerald-300 bg-emerald-500/10 border-emerald-500/15",
    blue: "text-blue-300 bg-blue-500/10 border-blue-500/15",
    purple: "text-purple-300 bg-purple-500/10 border-purple-500/15",
    red: "text-red-300 bg-red-500/10 border-red-500/15",
};

export function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    color = "gold",
}: StatCardProps) {
    const reduceMotion = useReducedMotion();

    const trendLabel = trend?.label ?? "vs prošli mesec";
    const trendValue = trend ? Math.abs(trend.value) : 0;

    const trendText =
        trend && Number.isFinite(trend.value)
            ? `${trend.isPositive ? "+" : "-"}${trendValue.toFixed(trendValue % 1 === 0 ? 0 : 1)}%`
            : null;

    return (
        <motion.article
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className={`bg-linear-to-br ${colorClasses[color]} backdrop-blur-sm rounded-2xl p-6 border hover:border-white/20 transition-all`}
        >
            <div className="flex items-start justify-between gap-6">
                <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                        {title}
                    </p>

                    <p className="text-3xl md:text-4xl font-black text-white mt-3 tracking-tight">
                        {value}
                    </p>

                    {subtitle ? (
                        <p className="text-xs md:text-sm text-white/30 font-bold mt-2 uppercase tracking-tight">
                            {subtitle}
                        </p>
                    ) : null}

                    {trend && trendText ? (
                        <div
                            className={`flex flex-wrap items-center gap-2 mt-3 text-xs font-black uppercase tracking-widest ${trend.isPositive ? "text-emerald-300" : "text-red-300"
                                }`}
                        >
                            <span className="inline-flex items-center gap-1">
                                <span aria-hidden>{trend.isPositive ? "↑" : "↓"}</span>
                                <span>{trendText}</span>
                            </span>
                            <span className="text-white/25 font-black">{trendLabel}</span>
                        </div>
                    ) : null}
                </div>

                <div
                    className={`p-3 rounded-2xl border ${iconWrapClasses[color]} shrink-0`}
                    aria-hidden
                >
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </motion.article>
    );
}
