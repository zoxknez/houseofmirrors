"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation, Bus, TreeDeciduous, Building, ExternalLink, Landmark, Trees, Building2 } from "lucide-react";
import { propertyData } from "@/data/property";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/context/LanguageContext";

export function Location() {
    const { dict, language } = useLanguage();
    const { location } = propertyData;
    const { lat, lng } = location.coordinates;

    const embedSrc = `https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
    const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
    const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

    const attractions = [
        { name: dict.location.nearby.temple, distance: "1.4 km", time: "18 min", icon: Landmark },
        { name: dict.location.nearby.park, distance: "400 m", time: "5 min", icon: Trees },
        { name: dict.location.nearby.center, distance: "3.5 km", time: "10 min", icon: Building2 },
    ];

    const t = {
        mapTitle: language === "sr" ? "Mapa lokacije" : "Location Map",
        neighborhood: language === "sr" ? "Komšiluk" : "Neighborhood",
        nearby: language === "sr" ? "U blizini" : "Nearby",
        openMap: language === "sr" ? "Otvori mapu" : "Open Map",
        directions: language === "sr" ? "Uputstva" : "Directions",
        transport: language === "sr" ? "Prevoz" : "Transport",
        busStation: language === "sr" ? "Autobuska stanica" : "Bus Station",
        acrossStreet: language === "sr" ? "preko puta" : "across street",
        nature: language === "sr" ? "Priroda" : "Nature",
        parks: language === "sr" ? "Parkovi i zelenilo" : "Parks & Greenery",
        walkTime: language === "sr" ? "5 min hoda" : "5 min walk",
    };

    return (
        <section id="location" className="relative py-20 md:py-32 bg-black overflow-hidden">
            <div
                aria-hidden="true"
                className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-[var(--gold)]/5 rounded-full blur-[150px] pointer-events-none"
            />

            <div className="max-w-[1400px] mx-auto px-6 md:px-10 relative z-10">
                <SectionHeader
                    badge={dict.location.title}
                    title={
                        <>
                            {dict.location.title}
                        </>
                    }
                    subtitle={dict.location.subtitle}
                />

                <div className="grid lg:grid-cols-2 gap-10 md:gap-14 items-stretch">
                    {/* Map */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative group h-full"
                    >
                        <div className="absolute inset-0 bg-[var(--gold)]/10 blur-2xl rounded-[36px] opacity-0 group-hover:opacity-30 transition-opacity duration-700" />

                        <div className="relative w-full rounded-[32px] overflow-hidden border border-white/10 shadow-2xl bg-white/5 flex flex-col h-full min-h-[400px]">
                            {/* Map Container */}
                            <div className="relative flex-grow w-full h-full min-h-[300px]">
                                <iframe
                                    title={t.mapTitle}
                                    src={embedSrc}
                                    className="absolute inset-0 w-full h-full"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>

                            {/* Actions area */}
                            <div className="p-4 sm:p-6 bg-white/[0.02] border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 shrink-0">
                                <a
                                    href={mapsLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center gap-3 h-14 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-white font-black uppercase tracking-[0.2em] text-[11px] hover:bg-white/10 transition-all shadow-xl"
                                >
                                    {t.openMap} <ExternalLink className="w-4 h-4" />
                                </a>
                                <a
                                    href={directionsLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center gap-3 h-14 rounded-2xl bg-[var(--gold)] text-black font-black uppercase tracking-[0.2em] text-[11px] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_30px_rgba(212,175,55,0.15)]"
                                >
                                    {t.directions} <Navigation className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Location Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col justify-between space-y-6"
                    >
                        <div className="space-y-5">
                            {/* Address */}
                            <GlassCard className="group p-7 hover:bg-white/[0.04] hover:border-[var(--gold)]/30 transition-all duration-500 rounded-[28px]">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-[var(--gold)]/20">
                                        <MapPin className="w-5 h-5 text-[var(--gold)]" />
                                    </div>
                                    <div>
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--gold)] mb-1">
                                            {dict.location.title}
                                        </h3>
                                        <p className="text-base md:text-lg font-black uppercase tracking-tight text-white">
                                            {dict.location.address}
                                            <br />
                                            <span className="text-white/40 font-bold">
                                                {location.postalCode} {location.city}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </GlassCard>

                            {/* Neighborhood */}
                            <GlassCard className="group p-7 hover:bg-white/[0.04] hover:border-[var(--gold)]/30 transition-all duration-500 rounded-[28px]">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-[var(--gold)]/20">
                                        <Building className="w-5 h-5 text-[var(--gold)]" />
                                    </div>
                                    <div>
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--gold)] mb-1">
                                            {t.neighborhood}
                                        </h3>
                                        <p className="text-white mb-2 font-black uppercase tracking-tight text-sm md:text-base">
                                            {dict.location.neighborhood}
                                        </p>
                                    </div>
                                </div>
                            </GlassCard>

                            {/* Nearby */}
                            <GlassCard className="p-7 md:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <Navigation className="w-5 h-5 text-[var(--gold)]" />
                                    <h3 className="text-xs md:text-sm font-black uppercase tracking-[0.3em] text-white">{t.nearby}</h3>
                                </div>
                                <div className="space-y-3">
                                    {attractions.map((attraction, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                                        >
                                            <span className="text-white font-bold uppercase tracking-tight text-xs md:text-sm">
                                                {attraction.name}
                                            </span>
                                            <span className="text-[var(--gold)] text-xs md:text-sm font-black uppercase tracking-wide">
                                                {attraction.distance}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        </div>

                        {/* Transport */}
                        <div className="grid grid-cols-2 gap-4">
                            <GlassCard className="p-5 text-center group hover:bg-white/[0.04] transition-all duration-500 rounded-[28px]">
                                <Bus className="w-7 h-7 text-[var(--gold)] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--gold)] mb-1">{t.transport}</p>
                                <p className="text-[11px] md:text-sm text-white font-black uppercase">{t.busStation}</p>
                                <p className="text-[10px] text-white/40 font-bold uppercase mt-1">{t.acrossStreet}</p>
                            </GlassCard>

                            <GlassCard className="p-5 text-center group hover:bg-white/[0.04] transition-all duration-500 rounded-[28px]">
                                <TreeDeciduous className="w-7 h-7 text-[var(--gold)] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--gold)] mb-1">{t.nature}</p>
                                <p className="text-[11px] md:text-sm text-white font-black uppercase">{t.parks}</p>
                                <p className="text-[10px] text-white/40 font-bold uppercase mt-1">{t.walkTime}</p>
                            </GlassCard>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
