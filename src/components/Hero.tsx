"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize, Users, Bed, Bath } from "lucide-react";
import { propertyData } from "@/data/property";
import { propertyImages } from "@/data/images";

export function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const images = propertyImages.hero;

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [images.length]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % images.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);

    return (
        <section className="relative min-h-[100dvh] flex flex-col overflow-hidden bg-black">
            {/* Background Slideshow */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.7 }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={images[currentSlide].src}
                            alt={images[currentSlide].alt}
                            fill
                            priority={images[currentSlide].priority}
                            className="object-cover"
                            sizes="100vw"
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Elegant Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 z-10" />
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all"
                aria-label="Prethodna slika"
            >
                <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all"
                aria-label="Sledeća slika"
            >
                <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-1 rounded-full transition-all duration-500 ${index === currentSlide
                            ? "w-12 bg-[var(--gold)] shadow-[0_0_10px_rgba(212,175,55,0.4)]"
                            : "w-2 bg-white/20 hover:bg-white/40"
                            }`}
                        aria-label={`Slika ${index + 1}`}
                    />
                ))}
            </div>

            {/* Main Content - Simple Centered Layout */}
            <div className="relative z-20 container mx-auto px-4 md:px-6 py-10 md:py-16 text-center flex flex-col items-center justify-center flex-grow">

                {/* Badge */}
                <div className="mb-10 md:mb-16 inline-flex items-center gap-4">
                    <div className="w-8 md:w-16 h-px bg-gradient-to-r from-transparent to-[var(--gold)]/50" />
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-[var(--gold)]">
                        Experience Luxury
                    </span>
                    <div className="w-8 md:w-16 h-px bg-gradient-to-l from-transparent to-[var(--gold)]/50" />
                </div>

                {/* Title */}
                <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85] text-white mb-6 md:mb-10">
                    {propertyData.name}
                </h1>

                {/* Subtitle */}
                <p className="text-[11px] sm:text-xs md:text-base font-bold uppercase tracking-[0.2em] text-white/40 mb-12 md:mb-20 max-w-md md:max-w-2xl mx-auto leading-relaxed">
                    {propertyData.tagline}
                </p>

                {/* Buttons Row */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8 mb-16 md:mb-32 w-full sm:w-auto">
                    <a
                        href="#booking"
                        className="btn-primary w-full sm:w-auto !px-12 !py-5"
                    >
                        Rezerviši sada
                    </a>
                    <a
                        href="#gallery"
                        className="btn-ghost w-full sm:w-auto !px-12 !py-5"
                    >
                        Istraži prostor
                    </a>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-5xl mx-auto">
                    {[
                        { label: "Kvadratura", val: propertyData.details.size, icon: Maximize },
                        { label: "Gostiju", val: propertyData.details.maxGuests, icon: Users },
                        { label: "Spavaće", val: propertyData.details.bedrooms, icon: Bed },
                        { label: "Kupatila", val: propertyData.details.bathrooms, icon: Bath }
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="group p-6 md:p-10 bg-white/[0.02] backdrop-blur-xl border border-white/5 hover:border-[var(--gold)]/20 transition-all duration-700 text-center flex flex-col items-center justify-center rounded-[32px] hover:bg-white/[0.04] relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-[var(--gold)] mx-auto mb-4 group-hover:scale-110 transition-transform duration-500" />
                            <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-2 group-hover:text-white/50 transition-colors">
                                {stat.label}
                            </p>
                            <p className="text-xl md:text-3xl lg:text-4xl font-black text-white tracking-tight relative z-10">
                                {stat.val}
                            </p>
                        </div>
                    ))}
                </div>

            </div>

            {/* Ambient Glows */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[var(--gold)]/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[var(--gold)]/3 rounded-full blur-[120px] pointer-events-none" />
        </section>
    );
}
