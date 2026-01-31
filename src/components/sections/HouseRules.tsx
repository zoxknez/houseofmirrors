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
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/context/LanguageContext";

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
    const { dict, language } = useLanguage();
    const rules = dict.houseRules.rules;

    // Helper for simple translations
    // In a real app, these should be in dict. Using conditionals for now to save tool calls.
    const t = {
        allowed: language === "sr" ? "Dozvoljeno" : "Allowed",
        notAllowed: language === "sr" ? "Zabranjeno" : "Not Allowed",
        petsNotAllowed: language === "sr" ? "Zabranjeni" : "Not Allowed",
        partiesNotAllowed: language === "sr" ? "Zabranjene" : "Not Allowed",
        from: language === "sr" ? "od" : "from",
        to: language === "sr" ? "do" : "till",
        title: language === "sr" ? "Pravila" : "House",
        titleSuffix: language === "sr" ? "Kuće" : "Rules",
        checkIn: "Check-in",
        checkOut: "Check-out",
        quiet: language === "sr" ? "Noćni mir" : "Quiet Hours",
        smoking: language === "sr" ? "Pušenje" : "Smoking",
        pets: language === "sr" ? "Ljubimci" : "Pets",
        parties: language === "sr" ? "Žurke" : "Parties",
        children: language === "sr" ? "Deca" : "Children",
        childrenOk: language === "sr" ? "Dobrodošla" : "Welcome",
        childrenNo: language === "sr" ? "Nije prilagođeno" : "Not Suitable",
        damage: language === "sr" ? "Gosti su odgovorni za eventualnu štetu na imovini ili opremi." : "Guests are responsible for any damage to property or equipment.",
        respect: language === "sr" ? "Molimo vas da se odnosite prema apartmanu kao prema svom domu." : "Please treat the apartment as your own home."
    };

    const items = useMemo<RuleItem[]>(() => {
        return [
            {
                id: "checkin",
                kind: "time",
                icon: LogIn,
                label: t.checkIn,
                value: `${t.from} ${rules.checkIn}`,
            },
            {
                id: "checkout",
                kind: "time",
                icon: LogOut,
                label: t.checkOut,
                value: `${t.to} ${rules.checkOut}`,
            },
            {
                id: "quiet",
                kind: "time",
                icon: Moon,
                label: t.quiet,
                value: `${rules.quietHoursStart} – ${rules.quietHoursEnd}`,
            },
            {
                id: "smoking",
                kind: "policy",
                icon: Cigarette,
                label: t.smoking,
                allowed: !!rules.smoking,
                allowedText: t.allowed,
                deniedText: t.notAllowed,
            },
            {
                id: "pets",
                kind: "policy",
                icon: PawPrint,
                label: t.pets,
                allowed: !!rules.pets,
                allowedText: t.allowed,
                deniedText: t.petsNotAllowed,
            },
            {
                id: "parties",
                kind: "policy",
                icon: PartyPopper,
                label: t.parties,
                allowed: !!rules.parties,
                allowedText: t.allowed,
                deniedText: t.partiesNotAllowed,
            },
            {
                id: "children",
                kind: "policy",
                icon: Baby,
                label: t.children,
                allowed: !!rules.children,
                allowedText: t.childrenOk,
                deniedText: t.childrenNo,
            },
        ];
    }, [rules, t]);

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
                    badge={dict.houseRules.title}
                    title={
                        <>
                            {t.title} <span className="text-[var(--gold)]">{t.titleSuffix}</span>
                        </>
                    }
                    subtitle={dict.houseRules.subtitle}
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
                                {t.damage}
                                <span className="block mt-2 text-white font-black uppercase tracking-tight">
                                    {t.respect}
                                </span>
                            </p>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        </section>
    );
}
