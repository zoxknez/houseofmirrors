"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Star, Shield, MapPin, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { ModalShell } from "@/components/ui/ModalShell";

export function AboutBanner() {
    const { dict } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    // Prevent body scroll when modal is open (handled by ModalShell mostly, but good to ensure if we build custom)
    // Actually ModalShell probably handles it? Let's check BookingForm used ModalShell. 
    // Yes, ModalShell is good.

    return (
        <>
            {/* Banner Section */}
            <section className="relative py-16 bg-[#050505] overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

                <div className="max-w-350 mx-auto px-6 md:px-10">
                    <div className="relative rounded-4xl overflow-hidden bg-gold/5 border border-gold/10 p-8 md:p-12">
                        {/* Background accent */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center relative z-10">
                            <div className="space-y-6">
                                <motion.h2
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="text-2xl md:text-4xl font-black uppercase tracking-normal text-white"
                                    style={{ wordSpacing: "0.35em" }}
                                >
                                    {dict.about.title}
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 }}
                                    className="text-white/60 leading-relaxed text-sm md:text-base max-w-xl"
                                >
                                    {dict.property.description?.split('\n\n')[0] || dict.about.description}
                                </motion.p>

                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    onClick={() => setIsOpen(true)}
                                    className="inline-flex items-center gap-3 text-gold font-bold uppercase tracking-widest text-xs hover:text-white transition-colors group"
                                >
                                    {dict.about.readMore}
                                    <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold group-hover:text-black transition-all">
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </motion.button>
                            </div>

                            {/* Visual/Image side or just empty/pattern? 
                                The user screenshot shows just a banner area. 
                                I'll keep it simple text focused or add some icons.
                            */}
                            <div className="grid grid-cols-2 gap-3 md:gap-4">
                                <div className="bg-white/10 p-3 md:p-4 rounded-2xl border border-white/10 backdrop-blur-sm flex flex-col justify-between min-h-30">
                                    <Star className="w-5 h-5 md:w-6 md:h-6 text-gold mb-2 md:mb-3" />
                                    <div className="text-xl md:text-2xl font-black text-white">10</div>
                                    <div className="text-[9px] md:text-[10px] uppercase tracking-wider text-white/60">{dict.about.badges.rating}</div>
                                </div>
                                <div className="bg-white/10 p-3 md:p-4 rounded-2xl border border-white/10 backdrop-blur-sm flex flex-col justify-between min-h-30">
                                    <MapPin className="w-5 h-5 md:w-6 md:h-6 text-gold mb-2 md:mb-3" />
                                    <div className="text-lg md:text-xl font-black text-white">10 min</div>
                                    <div className="text-[9px] md:text-[10px] uppercase tracking-wider text-white/60">{dict.about.badges.toCenter}</div>
                                </div>
                                <div className="bg-white/10 p-3 md:p-4 rounded-2xl border border-white/10 backdrop-blur-sm flex flex-col justify-between min-h-30">
                                    <Shield className="w-5 h-5 md:w-6 md:h-6 text-gold mb-2 md:mb-3" />
                                    <div className="text-lg md:text-xl font-black text-white">Safe</div>
                                    <div className="text-[9px] md:text-[10px] uppercase tracking-wider text-white/60">{dict.about.badges.neighborhood}</div>
                                </div>
                                <div className="bg-white/10 p-3 md:p-4 rounded-2xl border border-white/10 backdrop-blur-sm flex flex-col justify-between min-h-30">
                                    <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-gold mb-2 md:mb-3" />
                                    <div className="text-lg md:text-xl font-black text-white">Luxury</div>
                                    <div className="text-[9px] md:text-[10px] uppercase tracking-wider text-white/60">{dict.about.badges.design}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <ModalShell open={isOpen} onClose={() => setIsOpen(false)}>
                        <div className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                            {/* Header */}
                            <div className="sticky top-0 z-10 flex items-center justify-between p-6 md:p-8 border-b border-white/5 bg-[#0a0a0a]/90 backdrop-blur-xl">
                                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white">
                                    {dict.about.title}
                                </h3>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar space-y-12">

                                {/* Intro */}
                                <div className="space-y-6">
                                    <p className="text-white/80 leading-relaxed text-lg">
                                        {dict.about.description}
                                    </p>

                                    {/* Features List (Generated from array) */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {dict.about.features.map((feature, i) => (
                                            <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2.5 shrink-0" />
                                                <p className="text-sm text-white/70 leading-relaxed">
                                                    {feature}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Sections */}
                                <div className="grid md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <h4 className="text-gold font-black uppercase tracking-widest text-xs">
                                            {dict.about.space.title}
                                        </h4>
                                        <p className="text-white/60 text-sm leading-relaxed">
                                            {dict.about.space.content}
                                        </p>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-gold font-black uppercase tracking-widest text-xs">
                                            {dict.about.access.title}
                                        </h4>
                                        <p className="text-white/60 text-sm leading-relaxed">
                                            {dict.about.access.content}
                                        </p>
                                    </div>
                                </div>

                                {/* Image Grid (Optional - maybe reuse highlights images?) */}
                                {/* For now just text as requested, but maybe a visual separator */}
                                <div className="w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

                                <div className="flex justify-center">
                                    <div className="text-center space-y-4">
                                        <div className="w-16 h-16 mx-auto rounded-full bg-gold/10 flex items-center justify-center text-gold">
                                            <Sparkles className="w-8 h-8" />
                                        </div>
                                        <p className="text-white/40 text-xs uppercase tracking-widest">
                                            House of Mirrors
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ModalShell>
                )}
            </AnimatePresence>
        </>
    );
}
