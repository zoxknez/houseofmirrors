"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
    { href: "#gallery", label: "Galerija" },
    { href: "#amenities", label: "Pogodnosti" },
    { href: "#rules", label: "Pravila" },
    { href: "#location", label: "Lokacija" },
    { href: "#contact", label: "Kontakt" },
];

function getIdFromHref(href: string) {
    return href.startsWith("#") ? href.slice(1) : href;
}

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeId, setActiveId] = useState<string>("");

    const panelRef = useRef<HTMLDivElement | null>(null);

    // scrolled state
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // scroll lock when open
    useEffect(() => {
        if (!isOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [isOpen]);

    // close on Escape
    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [isOpen]);

    // close on outside click (mobile)
    useEffect(() => {
        if (!isOpen) return;
        const onDown = (e: MouseEvent | TouchEvent) => {
            const el = panelRef.current;
            if (!el) return;
            if (el.contains(e.target as Node)) return;
            setIsOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        document.addEventListener("touchstart", onDown, { passive: true });
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("touchstart", onDown);
        };
    }, [isOpen]);

    // Scrollspy (active section)
    useEffect(() => {
        const ids = navLinks.map((l) => getIdFromHref(l.href)).concat(["booking"]);
        const els = ids
            .map((id) => document.getElementById(id))
            .filter(Boolean) as HTMLElement[];

        if (!els.length) return;

        const obs = new IntersectionObserver(
            (entries) => {
                // uzmi najvidljiviji
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

                if (visible?.target?.id) setActiveId(visible.target.id);
            },
            {
                root: null,
                threshold: [0.1, 0.2, 0.35, 0.5],
                rootMargin: "-20% 0px -65% 0px", // fokus na "gornji deo"
            }
        );

        els.forEach((el) => obs.observe(el));
        return () => obs.disconnect();
    }, []);

    const isActive = (href: string) => activeId === getIdFromHref(href);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`navbar ${scrolled ? "scrolled" : ""}`}
        >
            <div className="max-w-[1400px] mx-auto px-6 md:px-10">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group relative" aria-label="Početna">
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
                                className={[
                                    "text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 relative group",
                                    isActive(link.href) ? "text-white" : "text-white/40 hover:text-white",
                                ].join(" ")}
                                aria-current={isActive(link.href) ? "true" : undefined}
                            >
                                {link.label}
                                <span
                                    className={[
                                        "absolute -bottom-2 left-0 h-[1px] bg-[var(--gold)] transition-all duration-500",
                                        isActive(link.href) ? "w-full" : "w-0 group-hover:w-full",
                                    ].join(" ")}
                                />
                            </a>
                        ))}

                        <a href="#booking" className="btn-primary !px-8 !py-3 !text-[9px] !tracking-[0.3em]">
                            Rezerviši
                        </a>
                    </div>

                    {/* Mobile Button */}
                    <button
                        type="button"
                        onClick={() => setIsOpen((v) => !v)}
                        className="md:hidden p-2 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
                        aria-label="Toggle menu"
                        aria-expanded={isOpen}
                        aria-controls="mobile-nav"
                    >
                        {isOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
                    </button>
                </div>
            </div>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="md:hidden fixed inset-0 z-[60]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* backdrop */}
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

                        {/* panel */}
                        <motion.div
                            id="mobile-nav"
                            ref={panelRef}
                            role="dialog"
                            aria-modal="true"
                            className="absolute top-[72px] left-0 right-0 bg-black/95 backdrop-blur-2xl border-b border-white/5 py-8"
                            initial={{ y: -12, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -12, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                        >
                            <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex flex-col gap-6 items-center text-center">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={[
                                            "text-xs font-black uppercase tracking-[0.3em] transition-colors",
                                            isActive(link.href) ? "text-white" : "text-white/40 hover:text-white",
                                        ].join(" ")}
                                        aria-current={isActive(link.href) ? "true" : undefined}
                                    >
                                        {link.label}
                                    </a>
                                ))}

                                <a href="#booking" onClick={() => setIsOpen(false)} className="btn-primary w-full max-w-[220px]">
                                    Rezerviši
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
