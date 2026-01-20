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
            color: "text-green-400"
        },
        {
            icon: LogOut,
            label: "Check-out",
            value: `do ${rules.checkOut}`,
            color: "text-blue-400"
        },
        {
            icon: Moon,
            label: "Noćni mir",
            value: `${rules.quietHours.start} - ${rules.quietHours.end}`,
            color: "text-purple-400"
        },
        {
            icon: Cigarette,
            label: "Pušenje",
            value: rules.smoking ? "Dozvoljeno" : "Nije dozvoljeno",
            allowed: rules.smoking,
            color: rules.smoking ? "text-green-400" : "text-red-400"
        },
        {
            icon: PawPrint,
            label: "Ljubimci",
            value: rules.pets ? "Dozvoljeni" : "Nisu dozvoljeni",
            allowed: rules.pets,
            color: rules.pets ? "text-green-400" : "text-red-400"
        },
        {
            icon: PartyPopper,
            label: "Žurke",
            value: rules.parties ? "Dozvoljene" : "Nisu dozvoljene",
            allowed: rules.parties,
            color: rules.parties ? "text-green-400" : "text-red-400"
        },
        {
            icon: Baby,
            label: "Deca",
            value: rules.children ? "Dobrodošla" : "Nije prilagođeno",
            allowed: rules.children,
            color: rules.children ? "text-green-400" : "text-yellow-400"
        }
    ];

    return (
        <section id="rules" className="section bg-[var(--primary)]/50">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                    className="text-center mb-16"
                >
                    <p className="text-[var(--accent)] text-xs font-black uppercase tracking-[0.4em] mb-4">Pravila</p>
                    <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">
                        Pravila <span className="opacity-40">Kuće</span>
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Main Times */}
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        {ruleItems.slice(0, 3).map((rule, index) => (
                            <div
                                key={index}
                                className="deluxe-card p-8 text-center group hover:bg-[var(--accent)] transition-colors duration-500"
                            >
                                <rule.icon className={`w-12 h-12 text-white/40 group-hover:text-white mx-auto mb-6 transition-colors`} />
                                <h3 className="text-white font-black text-xl mb-2 tracking-tighter uppercase">{rule.label}</h3>
                                <p className="text-white/30 group-hover:text-white/60 font-black uppercase text-[10px] tracking-widest leading-none">{rule.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Rules Grid */}
                    <div className="glass-card p-8">
                        <div className="grid sm:grid-cols-2 gap-6">
                            {ruleItems.slice(3).map((rule, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5"
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${rule.allowed ? 'bg-green-400/20' : 'bg-red-400/20'
                                        }`}>
                                        {rule.allowed ? (
                                            <rule.icon className={`w-6 h-6 ${rule.color}`} />
                                        ) : (
                                            <div className="relative">
                                                <rule.icon className="w-6 h-6 text-white/50" />
                                                <Ban className="w-8 h-8 text-red-400 absolute -top-1 -left-1" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium">{rule.label}</h4>
                                        <p className={`text-sm ${rule.color}`}>{rule.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Important Notice */}
                        <div className="mt-8 p-4 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex gap-3">
                            <AlertCircle className="w-6 h-6 text-[var(--accent)] flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-white/80 text-sm">
                                    Gosti su odgovorni za eventualnu štetu na imovini ili opremi.
                                    Molimo vas da se odnosite prema apartmanu kao prema svom domu.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
