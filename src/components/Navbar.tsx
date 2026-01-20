"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
                        <div className="w-10 h-10 flex items-center justify-center border border-white/10 group-hover:border-[var(--gold)]/50 transition-all duration-700">
                            <div className="w-2 h-2 bg-[var(--gold)] shadow-[0_0_15px_rgba(212,175,55,0.4)]" />
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-12">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-all duration-500 relative group"
                            >
                                {link.label}
                                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-[var(--gold)] transition-all duration-500 group-hover:w-full" />
                            </a>
                        ))}
                        <a
                            href="#booking"
                            className="btn-primary !px-8 !py-3 !text-[9px] !tracking-[0.3em]"
                        >
                            Rezerviši
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
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
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0, y: -20, height: 0 }}
                            className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-2xl border-b border-white/5 py-8 overflow-hidden"
                        >
                            <div className="container flex flex-col gap-6 items-center text-center">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="text-white/40 hover:text-white text-xs font-black uppercase tracking-[0.3em] transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                                <a
                                    href="#booking"
                                    onClick={() => setIsOpen(false)}
                                    className="btn-primary w-full max-w-[200px]"
                                >
                                    Rezerviši
                                </a>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
}
