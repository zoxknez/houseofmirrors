"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
    LogIn,
    LogOut,
    Moon,
    PawPrint,
    PartyPopper,
    Cigarette,
    Baby,
    AlertCircle,
    type LucideIcon,
} from "lucide-react";
import { propertyData } from "@/data/property";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlassCard } from "@/components/ui/GlassCard";

type TimeRule = {
    id: "checkin" | "checkout" | "quiet";
    kind: "time";
    icon: LucideIcon;
    label: string;
    value: string;
};

type PolicyRule = {
    id: "smoking" | "pets" | "parties" | "children";
    kind: "policy";
    icon: LucideIcon;
    label: string;
    allowed: boolean;
    allowedText: string;
    deniedText: string;
};

type RuleItem = TimeRule | PolicyRule;

function TimeCard({ rule }: { rule: TimeRule }) {
    const Icon = rule.icon;
    return (
        <GlassCard className="group relative px-6 py-10 md:py-12 hover:bg-white/[0.04] hover:border-[var(--gold)]/25 transition-all duration-500 text-center flex flex-col items-center justify-center rounded-[28px] overflow-hidden">
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-br from-[var(--gold)]/6 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            />
            <div className="relative w-12 h-12 rounded-full bg-[var(--gold)]/5 border border-[var(--gold)]/20 flex items-center justify-center mb-6 group-hover:bg-[var(--gold)]/10 group-hover:border-[var(--gold)]/40 transition-all duration-500 shadow-[0_0_30px_rgba(212,175,55,0.08)]">
                <Icon className="w-5 h-5 text-[var(--gold)]" />
            </div>

            <h3 className="relative text-sm md:text-base font-black uppercase tracking-[0.18em] text-white mb-2">
                {rule.label}
            </h3>
            <p className="relative text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-white/60">
                {rule.value}
            </p>

            <div
                aria-hidden="true"
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--gold)]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-b-[32px]"
            />
        </GlassCard>
    );
}

function PolicyItem({ rule }: { rule: PolicyRule }) {
    const Icon = rule.icon;
    const ok = rule.allowed;

    return (
        <li className="flex flex-col items-center text-center group">
            <div
                className={[
                    "w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-all duration-500",
                    ok ? "bg-green-500/10 group-hover:bg-green-500/20" : "bg-red-500/10 group-hover:bg-red-500/20",
                ].join(" ")}
                aria-hidden="true"
            >
                <Icon className={["w-5 h-5", ok ? "text-green-400" : "text-red-400"].join(" ")} />
            </div>

            <h4 className="text-sm md:text-base font-black uppercase tracking-[0.15em] text-white mb-1">
                {rule.label}
            </h4>

            <p
                className={[
                    "text-xs md:text-sm font-bold uppercase tracking-[0.2em]",
                    ok ? "text-green-400/80" : "text-red-400/80",
                ].join(" ")}
            >
                {ok ? rule.allowedText : rule.deniedText}
            </p>
        </li>
    );
}

export function HouseRules() {
    const { rules } = propertyData;

    const items = useMemo<RuleItem[]>(() => {
        return [
            {
                id: "checkin",
                kind: "time",
                icon: LogIn,
                label: "Check-in",
                value: `od ${rules.checkIn}`,
            },
            {
                id: "checkout",
                kind: "time",
                icon: LogOut,
                label: "Check-out",
                value: `do ${rules.checkOut}`,
            },
            {
                id: "quiet",
                kind: "time",
                icon: Moon,
                label: "Noćni mir",
                value: `${rules.quietHours.start} – ${rules.quietHours.end}`,
            },
            {
                id: "smoking",
                kind: "policy",
                icon: Cigarette,
                label: "Pušenje",
                allowed: !!rules.smoking,
                allowedText: "Dozvoljeno",
                deniedText: "Nije dozvoljeno",
            },
            {
                id: "pets",
                kind: "policy",
                icon: PawPrint,
                label: "Ljubimci",
                allowed: !!rules.pets,
                allowedText: "Dozvoljeni",
                deniedText: "Nisu dozvoljeni",
            },
            {
                id: "parties",
                kind: "policy",
                icon: PartyPopper,
                label: "Žurke",
                allowed: !!rules.parties,
                allowedText: "Dozvoljene",
                deniedText: "Nisu dozvoljene",
            },
            {
                id: "children",
                kind: "policy",
                icon: Baby,
                label: "Deca",
                allowed: !!rules.children,
                allowedText: "Dobrodošla",
                deniedText: "Nije prilagođeno",
            },
        ];
    }, [rules]);

    const timeRules = items.filter((x): x is TimeRule => x.kind === "time");
    const policyRules = items.filter((x): x is PolicyRule => x.kind === "policy");

    return (
        <section id="rules" className="relative py-20 md:py-32 bg-black overflow-hidden">
            <div
                aria-hidden="true"
                className="absolute top-1/2 left-0 -translate-y-1/2 w-1/4 h-1/2 bg-[var(--gold)]/5 rounded-full blur-[150px] pointer-events-none"
            />

            <div className="max-w-[1400px] mx-auto px-6 md:px-10 relative z-10">
                <SectionHeader
                    badge="Pravila"
                    title={
                        <>
                            Pravila <span className="text-[var(--gold)]">Kuće</span>
                        </>
                    }
                    subtitle="Molimo vas da poštujete pravila kako bi boravak bio prijatan za sve."
                />

                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6 }}
                    className="max-w-5xl mx-auto"
                >
                    {/* Time cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10 md:mb-16">
                        {timeRules.map((rule) => (
                            <TimeCard key={rule.id} rule={rule} />
                        ))}
                    </div>

                    {/* Policies */}
                    <GlassCard className="p-8 md:p-12 rounded-[32px]">
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                            {policyRules.map((rule) => (
                                <PolicyItem key={rule.id} rule={rule} />
                            ))}
                        </ul>

                        {/* Notice */}
                        <div className="mt-10 md:mt-12 pt-10 md:pt-12 border-t border-white/5 flex flex-col items-center text-center">
                            <div aria-hidden="true" className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                                <AlertCircle className="w-6 h-6 text-red-500" />
                            </div>

                            <p className="text-xs md:text-sm text-white/80 leading-relaxed max-w-2xl font-bold tracking-wide">
                                Gosti su odgovorni za eventualnu štetu na imovini ili opremi.
                                <span className="block mt-2 text-white font-black uppercase tracking-tight">
                                    Molimo vas da se odnosite prema apartmanu kao prema svom domu.
                                </span>
                            </p>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        </section>
    );
}
