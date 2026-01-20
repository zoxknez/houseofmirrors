"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation, Bus, TreeDeciduous, Building } from "lucide-react";
import { propertyData } from "@/data/property";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlassCard } from "@/components/ui/GlassCard";

export function Location() {
    const { location } = propertyData;

    return (
        <section id="location" className="relative py-24 md:py-40 bg-black overflow-hidden">
            <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-[var(--gold)]/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-6 md:px-10 relative z-10">
                <SectionHeader
                    badge="Lokacija"
                    title={
                        <>
                            Gde se <span className="text-[var(--gold)]">nalazimo</span>
                        </>
                    }
                    subtitle="Smešten u mirnom kvartu Neimar, sa odličnom povezanošću sa centrom grada"
                />

                <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-stretch">
                    {/* Map */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative group h-full min-h-[400px]"
                    >
                        <div className="absolute inset-0 bg-[var(--gold)]/10 blur-2xl rounded-[40px] opacity-0 group-hover:opacity-30 transition-opacity duration-700" />
                        <div className="relative h-full w-full rounded-[40px] overflow-hidden border border-white/10 shadow-2xl">
                            <iframe
                                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2831.0!2d${location.coordinates.lng}!3d${location.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDTCsDQ3JzExLjgiTiAyMMKwMjYnNTYuMCJF!5e0!3m2!1sen!2srs!4v1234567890`}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </motion.div>

                    {/* Location Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col justify-between space-y-8"
                    >
                        <div className="space-y-6">
                            {/* Address Card */}
                            <GlassCard className="p-8 hover:bg-white/[0.04] hover:border-[var(--gold)]/30 transition-all duration-500 rounded-[32px]">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-[var(--gold)]/20">
                                        <MapPin className="w-6 h-6 text-[var(--gold)]" />
                                    </div>
                                    <div>
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--gold)] mb-1">Adresa</h3>
                                        <p className="text-lg md:text-xl font-black uppercase tracking-tight text-white">
                                            {location.address}<br />
                                            <span className="text-white/40 font-bold">{location.postalCode} {location.city}</span>
                                        </p>
                                    </div>
                                </div>
                            </GlassCard>

                            {/* Neighborhood */}
                            <GlassCard className="p-8 hover:bg-white/[0.04] hover:border-[var(--gold)]/30 transition-all duration-500 rounded-[32px]">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-[var(--gold)]/20">
                                        <Building className="w-6 h-6 text-[var(--gold)]" />
                                    </div>
                                    <div>
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--gold)] mb-1">Kvart</h3>
                                        <p className="text-white mb-2 font-black uppercase tracking-tight">{location.neighborhood}</p>
                                        <p className="text-sm text-white/40 leading-relaxed max-w-sm">
                                            Miran i bezbedan deo grada sa dosta zelenila, parkova i restorana u blizini.
                                        </p>
                                    </div>
                                </div>
                            </GlassCard>

                            {/* Nearby Attractions */}
                            <GlassCard className="p-8 md:p-10">
                                <div className="flex items-center gap-3 mb-8">
                                    <Navigation className="w-5 h-5 text-[var(--gold)]" />
                                    <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white">U blizini</h3>
                                </div>
                                <div className="space-y-4">
                                    {location.nearbyAttractions.map((attraction, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                                        >
                                            <span className="text-white font-bold uppercase tracking-tight text-sm md:text-base">{attraction.name}</span>
                                            <span className="text-[var(--gold)] text-sm font-black uppercase tracking-wide">
                                                {attraction.distance}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        </div>

                        {/* Transport Info */}
                        <div className="grid grid-cols-2 gap-6">
                            <GlassCard className="p-6 text-center group hover:bg-white/[0.04] transition-all duration-500 rounded-[32px]">
                                <Bus className="w-8 h-8 text-[var(--gold)] mx-auto mb-4 group-hover:scale-110 transition-transform" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--gold)] mb-1">Prevoz</p>
                                <p className="text-xs md:text-sm text-white font-black uppercase">Autobuska stanica</p>
                                <p className="text-[10px] text-white/40 font-bold uppercase mt-1">preko puta</p>
                            </GlassCard>
                            <GlassCard className="p-6 text-center group hover:bg-white/[0.04] transition-all duration-500 rounded-[32px]">
                                <TreeDeciduous className="w-8 h-8 text-[var(--gold)] mx-auto mb-4 group-hover:scale-110 transition-transform" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--gold)] mb-1">Priroda</p>
                                <p className="text-xs md:text-sm text-white font-black uppercase">Parkovi i zelenilo</p>
                                <p className="text-[10px] text-white/40 font-bold uppercase mt-1">5 min pešice</p>
                            </GlassCard>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
