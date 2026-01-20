"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X, Calendar } from "lucide-react";
import { propertyData } from "@/data/property";

const navLinks = [
    { href: "#gallery", label: "Galerija" },
    { href: "#amenities", label: "Pogodnosti" },
    { href: "#rules", label: "Pravila" },
    { href: "#location", label: "Lokacija" },
    { href: "#contact", label: "Kontakt" }
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`navbar ${scrolled ? "scrolled" : ""}`}
        >
            <div className="container">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group relative">
                        <span className="text-xl font-black text-white tracking-[0.4em] uppercase group-hover:text-[var(--accent)] transition-all duration-500">
                            {propertyData.name}
                        </span>
                        <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--accent)] transition-all duration-500 group-hover:w-full opacity-0 group-hover:opacity-100" />
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-12">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-[var(--accent)] transition-all duration-500 relative group"
                            >
                                {link.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[var(--accent)] transition-all duration-500 group-hover:w-full" />
                            </a>
                        ))}
                        <a
                            href="#booking"
                            className="btn-primary !px-5 !py-3 !text-[10px] !tracking-[0.2em]"
                        >
                            Rezerviši
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? (
                            <X className="w-6 h-6 text-white" />
                        ) : (
                            <Menu className="w-6 h-6 text-white" />
                        )}
                    </button>
                </div>

                {/* Mobile Nav */}
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:hidden absolute top-full left-0 right-0 bg-[var(--primary)]/95 backdrop-blur-xl border-t border-white/10 py-4"
                    >
                        <div className="container flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    {link.label}
                                </a>
                            ))}
                            <a
                                href="#booking"
                                onClick={() => setIsOpen(false)}
                                className="mx-4 mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[var(--accent)] text-white font-medium"
                            >
                                <Calendar className="w-4 h-4" />
                                Rezerviši
                            </a>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.nav>
    );
}
