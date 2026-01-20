"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation, Bus, TreeDeciduous, Building } from "lucide-react";
import { propertyData } from "@/data/property";

export function Location() {
    const { location } = propertyData;

    return (
        <section id="location" className="section">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="section-title">
                        <span className="gold-text">Lokacija</span>
                    </h2>
                    <p className="section-subtitle">
                        Smešten u mirnom kvartu Neimar, sa odličnom povezanošću sa centrom grada
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-10 items-center">
                    {/* Map */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="glass-card overflow-hidden aspect-[4/3] relative"
                    >
                        <iframe
                            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2831.0!2d${location.coordinates.lng}!3d${location.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDTCsDQ3JzExLjgiTiAyMMKwMjYnNTYuMCJF!5e0!3m2!1sen!2srs!4v1234567890`}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="absolute inset-0"
                        />
                    </motion.div>

                    {/* Location Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        {/* Address Card */}
                        <div className="glass-card p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/20 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-6 h-6 text-[var(--accent)]" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-1">Adresa</h3>
                                    <p className="text-white/70">
                                        {location.address}<br />
                                        {location.postalCode} {location.city}, {location.country}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Neighborhood */}
                        <div className="glass-card p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-[var(--gold)]/20 flex items-center justify-center flex-shrink-0">
                                    <Building className="w-6 h-6 text-[var(--gold)]" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-1">Kvart</h3>
                                    <p className="text-white/70">
                                        {location.neighborhood} - miran i bezbedan deo grada sa dosta zelenila,
                                        parkova i restorana u blizini.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Nearby Attractions */}
                        <div className="glass-card p-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Navigation className="w-5 h-5 text-[var(--accent)]" />
                                U blizini
                            </h3>
                            <div className="space-y-3">
                                {location.nearbyAttractions.map((attraction, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between py-2 border-b border-white/10 last:border-0"
                                    >
                                        <span className="text-white/80">{attraction.name}</span>
                                        <span className="text-[var(--accent)] text-sm font-medium">
                                            {attraction.distance}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Transport Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="glass-card p-4 text-center">
                                <Bus className="w-8 h-8 text-[var(--accent)] mx-auto mb-2" />
                                <p className="text-white/80 text-sm">
                                    Autobuska stanica<br />
                                    <span className="text-white font-medium">preko puta</span>
                                </p>
                            </div>
                            <div className="glass-card p-4 text-center">
                                <TreeDeciduous className="w-8 h-8 text-green-400 mx-auto mb-2" />
                                <p className="text-white/80 text-sm">
                                    Parkovi i zelenilo<br />
                                    <span className="text-white font-medium">5 min pešice</span>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
