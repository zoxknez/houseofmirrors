"use client";

import Link from "next/link";
import { Heart, ExternalLink } from "lucide-react";
import { propertyData } from "@/data/property";

const footerLinks = {
    navigation: [
        { label: "Početna", href: "/" },
        { label: "Galerija", href: "#gallery" },
        { label: "Pogodnosti", href: "#amenities" },
        { label: "Lokacija", href: "#location" },
        { label: "Kontakt", href: "#contact" },
    ],
    external: [
        { label: "Booking.com", href: "https://www.booking.com/hotel/rs/house-of-mirrors-beograd.hr.html" },
        { label: "Airbnb", href: "https://www.airbnb.com/rooms/1562587044814690888" },
    ],
};

export function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-black border-t border-white/5 py-24">
            <div className="max-w-[1400px] mx-auto px-6 md:px-10">
                <div className="grid md:grid-cols-12 gap-16 md:gap-24">
                    {/* Brand */}
                    <div className="md:col-span-6">
                        <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-[0.3em] mb-10">
                            {propertyData.name}
                        </h3>

                        <p className="text-white/40 text-sm md:text-base mb-10 max-w-md leading-relaxed font-bold uppercase tracking-tight">
                            {propertyData.shortDescription}
                        </p>

                        <div className="space-y-2 mb-10">
                            <p className="text-[var(--gold)] text-[10px] font-black uppercase tracking-widest">Lokacija</p>
                            <p className="text-white font-black uppercase tracking-tight text-sm md:text-base">
                                {propertyData.location.address}
                                <br />
                                <span className="text-white/40">
                                    {propertyData.location.postalCode} {propertyData.location.city}
                                </span>
                            </p>
                        </div>

                        {/* small CTA */}
                        <div className="flex flex-wrap gap-4">
                            <a
                                href="#booking"
                                className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors"
                            >
                                Rezerviši
                            </a>
                            <span className="text-white/10">•</span>
                            <a
                                href="#contact"
                                className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors"
                            >
                                Postavi pitanje
                            </a>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="md:col-span-3">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--gold)] mb-10">Navigacija</h4>
                        <ul className="space-y-5">
                            {footerLinks.navigation.map((link) => (
                                <li key={link.href}>
                                    {link.href === "/" ? (
                                        <Link
                                            href="/"
                                            className="text-white/40 hover:text-white transition-all duration-300 text-sm font-black uppercase tracking-widest"
                                        >
                                            {link.label}
                                        </Link>
                                    ) : (
                                        <a
                                            href={link.href}
                                            className="text-white/40 hover:text-white transition-all duration-300 text-sm font-black uppercase tracking-widest"
                                        >
                                            {link.label}
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* External Links */}
                    <div className="md:col-span-3">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--gold)] mb-10">Pronađite nas</h4>
                        <ul className="space-y-5">
                            {footerLinks.external.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`${link.label} (otvara se u novom tabu)`}
                                        className="text-white/40 hover:text-white transition-all duration-300 text-sm font-black uppercase tracking-widest inline-flex items-center gap-2 group"
                                    >
                                        {link.label}
                                        <ExternalLink className="w-3 h-3 group-hover:text-[var(--gold)] transition-colors" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">
                        © {year} {propertyData.name}. Sva prava zadržana.
                    </p>

                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                        Napravljeno sa{" "}
                        <Heart className="w-4 h-4 text-[var(--gold)] fill-[var(--gold)] motion-reduce:animate-none animate-pulse" />{" "}
                        u Beogradu
                    </p>
                </div>
            </div>
        </footer>
    );
}
