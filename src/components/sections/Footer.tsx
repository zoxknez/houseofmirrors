"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, ArrowUp } from "lucide-react";
import { propertyData } from "@/data/property";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
    const { dict, language } = useLanguage();
    const currentYear = new Date().getFullYear();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const t = {
        navigation: language === "sr" ? "Navigacija" : "Navigation",
        home: language === "sr" ? "Početna" : "Home",
        gallery: dict.gallery.title,
        location: dict.location.title,
        rules: dict.houseRules.title,
        contact: dict.contact.title,
        design: language === "sr" ? "Dizajn i razvoj" : "Design & Development",
        rights: dict.footer.rights,
        privacy: dict.footer.privacy,
        terms: dict.footer.terms,
    };

    const navLinks = [
        { label: t.home, href: "#hero" },
        { label: t.gallery, href: "#gallery" },
        { label: t.location, href: "#location" },
        { label: t.rules, href: "#rules" },
        { label: t.contact, href: "#contact" },
    ];

    return (
        <footer className="relative bg-[#050505] pt-20 pb-10 overflow-hidden border-t border-white/5">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--gold)]/20 to-transparent" />

            <div className="max-w-[1400px] mx-auto px-6 md:px-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20 mb-16">
                    {/* Brand */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="flex flex-col gap-4"
                        >
                            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">
                                House of <span className="text-[var(--gold)]">Mirrors</span>
                            </h2>
                            <p className="text-white/60 text-sm leading-relaxed">
                                {dict.property.shortDescription}
                            </p>
                        </motion.div>

                        
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-white mb-6">
                            {t.navigation}
                        </h3>
                        <ul className="space-y-4">
                            {navLinks.map((link, i) => (
                                <li key={i}>
                                    <a
                                        href={link.href}
                                        className="text-sm text-white/60 hover:text-[var(--gold)] transition-colors uppercase tracking-wider font-medium"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-white mb-6">
                            {dict.contact.title}
                        </h3>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <MapPin className="w-5 h-5 text-[var(--gold)] shrink-0 mt-0.5" />
                                <span className="text-sm text-white/60 leading-relaxed">
                                    {propertyData.location.address},<br />
                                    {propertyData.location.city}
                                </span>
                            </li>
                            <li className="flex items-center gap-4">
                                <Phone className="w-5 h-5 text-[var(--gold)] shrink-0" />
                                <a href={`tel:${propertyData.host.phone}`} className="text-sm text-white/60 hover:text-[var(--gold)] transition-colors">
                                    {propertyData.host.phone}
                                </a>
                            </li>
                            <li className="flex items-center gap-4">
                                <Mail className="w-5 h-5 text-[var(--gold)] shrink-0" />
                                <a href={`mailto:${propertyData.host.email}`} className="text-sm text-white/60 hover:text-[var(--gold)] transition-colors break-all">
                                    {propertyData.host.email}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* CTA */}
                    <div className="flex flex-col justify-between">
                        <div className="bg-[var(--gold)]/10 p-6 rounded-[24px] border border-[var(--gold)]/20 text-center">
                            <h3 className="text-white font-black uppercase tracking-widest mb-4 text-sm">
                                {dict.hero.bookNow}
                            </h3>
                            <p className="text-[var(--gold)] text-xs mb-6 uppercase tracking-wide opacity-80">
                                {dict.booking.subtitle}
                            </p>
                            <a
                                href="#booking"
                                className="inline-flex items-center justify-center w-full h-12 bg-[var(--gold)] text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-white transition-colors"
                            >
                                {dict.hero.bookNow}
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs text-white/40 font-medium uppercase tracking-wider text-center md:text-left">
                        © {currentYear} House of Mirrors. {t.rights}
                    </p>

                    <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                        <a href="#" className="text-xs text-white/40 hover:text-white transition-colors uppercase tracking-wider">
                            {t.privacy}
                        </a>
                        <a href="#" className="text-xs text-white/40 hover:text-white transition-colors uppercase tracking-wider">
                            {t.terms}
                        </a>
                    </div>

                    <button
                        onClick={scrollToTop}
                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-[var(--gold)] hover:text-black transition-all"
                    >
                        <ArrowUp className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </footer>
    );
}
