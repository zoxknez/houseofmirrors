"use client";

import { motion } from "framer-motion";
import {
    Clock,
    LogIn,
    LogOut,
    Moon,
    Ban,
    PawPrint,
    PartyPopper,
    Cigarette,
    Baby,
    AlertCircle
} from "lucide-react";
import { propertyData } from "@/data/property";

export function HouseRules() {
    const { rules } = propertyData;

    const ruleItems = [
        {
            icon: LogIn,
            label: "Check-in",
            value: `od ${rules.checkIn}`,
        },
        {
            icon: LogOut,
            label: "Check-out",
            value: `do ${rules.checkOut}`,
        },
        {
            icon: Moon,
            label: "Noćni mir",
            value: `${rules.quietHours.start} - ${rules.quietHours.end}`,
        },
        {
            icon: Cigarette,
            label: "Pušenje",
            value: rules.smoking ? "Dozvoljeno" : "Nije dozvoljeno",
            allowed: rules.smoking,
        },
        {
            icon: PawPrint,
            label: "Ljubimci",
            value: rules.pets ? "Dozvoljeni" : "Nisu dozvoljeni",
            allowed: rules.pets,
        },
        {
            icon: PartyPopper,
            label: "Žurke",
            value: rules.parties ? "Dozvoljene" : "Nisu dozvoljene",
            allowed: rules.parties,
        },
        {
            icon: Baby,
            label: "Deca",
            value: rules.children ? "Dobrodošla" : "Nije prilagođeno",
            allowed: rules.children,
        }
    ];

    return (
        <section id="rules" className="section bg-black relative overflow-hidden py-24 md:py-32">
            {/* Background Elements */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1/4 h-1/2 bg-[var(--gold)]/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="container relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20 md:mb-28"
                >
                    {/* Badge with lines */}
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="h-px flex-1 max-w-[80px] md:max-w-[120px] bg-gradient-to-r from-transparent to-[var(--gold)]/50" />
                        <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-[var(--gold)]">
                            Pravila
                        </span>
                        <div className="h-px flex-1 max-w-[80px] md:max-w-[120px] bg-gradient-to-l from-transparent to-[var(--gold)]/50" />
                    </div>

                    {/* Title */}
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-white mb-2">
                        Pravila
                    </h2>
                    <h3 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-[var(--gold)]">
                        Kuće
                    </h3>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-5xl mx-auto"
                >
                    {/* Main Times - Detached Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 md:mb-24">
                        {ruleItems.slice(0, 3).map((rule, index) => (
                            <div
                                key={index}
                                className="group relative px-8 py-16 md:py-20 bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-[32px] hover:bg-white/[0.04] hover:border-[var(--gold)]/30 transition-all duration-700 text-center flex flex-col items-center justify-center"
                            >
                                {/* Icon Circle */}
                                <div className="w-16 h-16 rounded-full bg-[var(--gold)]/5 border border-[var(--gold)]/20 flex items-center justify-center mb-10 group-hover:bg-[var(--gold)]/10 group-hover:border-[var(--gold)]/40 group-hover:scale-110 transition-all duration-500 shadow-[0_0_40px_rgba(212,175,55,0.05)]">
                                    <rule.icon className="w-7 h-7 text-[var(--gold)]" />
                                </div>

                                <h3 className="text-xl md:text-2xl font-black uppercase tracking-[0.1em] text-white mb-4">
                                    {rule.label}
                                </h3>
                                <p className="text-sm md:text-lg font-bold uppercase tracking-widest text-white/50">
                                    {rule.value}
                                </p>

                                {/* Hover Gold Line */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--gold)]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-b-[32px]" />
                            </div>
                        ))}
                    </div>

                    {/* Rules Grid - Centered & Airy */}
                    <div className="bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-[40px] p-8 md:p-16">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
                            {ruleItems.slice(3).map((rule, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center text-center group"
                                >
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 transition-colors duration-500 ${rule.allowed
                                            ? 'bg-green-500/10 group-hover:bg-green-500/20'
                                            : 'bg-red-500/10 group-hover:bg-red-500/20'
                                        }`}>
                                        <rule.icon className={`w-6 h-6 ${rule.allowed ? 'text-green-400' : 'text-red-400'
                                            }`} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg md:text-xl font-black uppercase tracking-tight text-white mb-2">{rule.label}</h4>
                                        <p className={`text-sm md:text-base font-bold uppercase tracking-wider ${rule.allowed ? 'text-green-400/80' : 'text-red-400/80'
                                            }`}>
                                            {rule.value}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Important Notice */}
                        <div className="mt-16 pt-16 border-t border-white/5 flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-[var(--gold)]/10 flex items-center justify-center mb-6">
                                <AlertCircle className="w-6 h-6 text-[var(--gold)]" />
                            </div>
                            <p className="text-sm md:text-base text-white/40 leading-relaxed max-w-2xl font-medium tracking-wide">
                                Gosti su odgovorni za eventualnu štetu na imovini ili opremi.
                                <span className="block mt-2 text-white/60">Molimo vas da se odnosite prema apartmanu kao prema svom domu.</span>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
