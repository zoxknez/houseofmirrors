"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize, Users, Bed, Bath } from "lucide-react";
import { propertyImages } from "@/data/images";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/context/LanguageContext";

const AUTOPLAY_MS = 4000;

export function Hero() {
    const { dict } = useLanguage();
    const images = propertyImages.hero;
    const count = images.length;
    const reduceMotion = useReducedMotion();

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const timerRef = useRef<number | null>(null);

    const clampIndex = (i: number) => (i + count) % count;

    const goTo = (i: number) => setCurrentSlide(clampIndex(i));
    const nextSlide = () => setCurrentSlide((p) => clampIndex(p + 1));
    const prevSlide = () => setCurrentSlide((p) => clampIndex(p - 1));

    const resetTimer = () => {
        if (timerRef.current) window.clearInterval(timerRef.current);
        timerRef.current = window.setInterval(() => {
            setCurrentSlide((p) => clampIndex(p + 1));
        }, AUTOPLAY_MS);
    };

    // Autoplay with pause on tab hidden
    useEffect(() => {
        const onVisibility = () => setIsPaused(document.hidden);

        document.addEventListener("visibilitychange", onVisibility);
        return () => document.removeEventListener("visibilitychange", onVisibility);
    }, []);

    useEffect(() => {
        if (!count) return;
        if (isPaused || reduceMotion) {
            if (timerRef.current) window.clearInterval(timerRef.current);
            timerRef.current = null;
            return;
        }
        resetTimer();
        return () => {
            if (timerRef.current) window.clearInterval(timerRef.current);
            timerRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [count, isPaused, reduceMotion]);

    // Keyboard arrows on desktop
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") {
                resetTimer();
                nextSlide();
            }
            if (e.key === "ArrowLeft") {
                resetTimer();
                prevSlide();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [count]);

    const stats = useMemo(
        () => [
            { label: dict.hero.stats.size, val: dict.property.details.size, icon: Maximize },
            { label: dict.hero.stats.guests, val: dict.property.details.maxGuests, icon: Users },
            { label: dict.hero.stats.bedrooms, val: dict.property.details.bedrooms, icon: Bed },
            { label: dict.hero.stats.bathrooms, val: dict.property.details.bathrooms, icon: Bath },
        ],
        [dict]
    );

    return (
        <section
            className="relative min-h-dvh flex flex-col overflow-hidden bg-black"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Background Slideshow */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: reduceMotion ? 0 : 0.7 }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={images[currentSlide].src}
                            alt={images[currentSlide].alt}
                            fill
                            // priority only for the first hero image (LCP)
                            priority={currentSlide === 0}
                            className="object-cover md:object-cover"
                            sizes="100vw"
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-black/80 z-10" />
            </div>

            {/* Swipe area (mobile-friendly) */}
            <motion.div
                className="absolute inset-0 z-10 md:hidden"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                    const threshold = 60;
                    if (info.offset.x > threshold) {
                        resetTimer();
                        prevSlide();
                    } else if (info.offset.x < -threshold) {
                        resetTimer();
                        nextSlide();
                    }
                }}
            />

            {/* Desktop Navigation Arrows */}
            <button
                type="button"
                onClick={() => {
                    resetTimer();
                    prevSlide();
                }}
                className="hidden md:inline-flex absolute left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
                type="button"
                onClick={() => {
                    resetTimer();
                    nextSlide();
                }}
                className="hidden md:inline-flex absolute right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all"
                aria-label="Next slide"
            >
                <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-10 md:bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                {images.map((_, index) => {
                    const active = index === currentSlide;
                    return (
                        <button
                            key={index}
                            type="button"
                            onClick={() => {
                                resetTimer();
                                goTo(index);
                            }}
                            className={`h-1 rounded-full transition-all duration-500 ${active
                                ? "w-12 bg-gold shadow-[0_0_10px_rgba(212,175,55,0.4)]"
                                : "w-2 bg-white/20 hover:bg-white/40"
                                }`}
                            aria-label={`Slide ${index + 1}`}
                            aria-current={active ? "true" : undefined}
                        />
                    );
                })}
            </div>

            {/* Main Content */}
            <div className="relative z-20 max-w-350 mx-auto px-6 md:px-10 py-8 md:py-12 text-center flex flex-col items-center justify-center grow">
                {/* Badge */}
                <div className="mb-8 md:mb-12 inline-flex items-center gap-4">
                    <div className="w-8 md:w-16 h-px bg-linear-to-r from-transparent to-gold/50" />
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-gold">
                        {dict.hero.experienceLuxury}
                    </span>
                    <div className="w-8 md:w-16 h-px bg-linear-to-l from-transparent to-gold/50" />
                </div>

                <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85] text-white mb-6 md:mb-10">
                    {dict.property.name}
                </h1>

                <p className="text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-white/40 mb-10 md:mb-14 max-w-md md:max-w-2xl mx-auto leading-relaxed">
                    {dict.property.tagline}
                </p>

                <div className="mb-8 md:mb-10 inline-flex items-center gap-3 px-4 sm:px-6 py-3 rounded-full border border-gold/40 bg-gold/15 shadow-[0_0_30px_rgba(212,175,55,0.25)] backdrop-blur">
                    <span className="px-3 py-1 rounded-full bg-gold text-black text-[11px] md:text-sm font-black uppercase tracking-[0.25em] shadow-[0_0_20px_rgba(212,175,55,0.35)]">
                        {dict.hero.officialRating}
                    </span>
                    <span className="text-white text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
                        {dict.hero.officialRatingDesc}
                    </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-5 md:gap-6 mb-12 md:mb-20 w-full sm:w-auto">
                    <a href="#booking" className="btn-primary w-full sm:w-auto px-10! py-4!">
                        {dict.hero.bookNow}
                    </a>
                    <a href="#gallery" className="btn-ghost w-full sm:w-auto px-10! py-4!">
                        {dict.hero.explore}
                    </a>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 w-full max-w-5xl mx-auto">
                    {stats.map((stat, i) => (
                        <GlassCard
                            key={i}
                            className="group p-5 md:p-7 hover:border-gold/20 transition-all duration-700 text-center flex flex-col items-center justify-center rounded-[28px] hover:bg-white/4 relative overflow-hidden border-white/5"
                        >
                            <div className="absolute inset-0 bg-linear-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-gold mx-auto mb-3 group-hover:scale-110 transition-transform duration-500" />
                            <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-2 group-hover:text-white/50 transition-colors">
                                {stat.label}
                            </p>
                            <p className="text-lg md:text-2xl lg:text-3xl font-black text-white tracking-tight relative z-10">
                                {stat.val}
                            </p>
                        </GlassCard>
                    ))}
                </div>
            </div>

            {/* Ambient Glows */}
            <div
                aria-hidden="true"
                className="absolute top-1/4 left-1/4 w-125 h-125 bg-gold/5 rounded-full blur-[120px] pointer-events-none"
            />
            <div
                aria-hidden="true"
                className="absolute bottom-1/4 right-1/4 w-125 h-125 bg-gold/3 rounded-full blur-[120px] pointer-events-none"
            />
        </section>
    );
}
