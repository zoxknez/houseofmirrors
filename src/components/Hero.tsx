"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Users, Bed, Bath, Maximize } from "lucide-react";
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
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Slideshow */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, scale: 1.1 }}
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
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-[rgba(5,5,16,0.3)] via-[rgba(5,5,16,0.2)] to-[rgba(5,5,16,0.8)]" />
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 md:left-8 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all"
                aria-label="Prethodna slika"
            >
                <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 md:right-8 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all"
                aria-label="Sledeća slika"
            >
                <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all ${index === currentSlide
                            ? "w-8 bg-[var(--accent)]"
                            : "bg-white/40 hover:bg-white/60"
                            }`}
                        aria-label={`Slika ${index + 1}`}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 container text-center px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
                    className="max-w-5xl mx-auto"
                >
                    {/* Featured Label */}
                    <div className="flex justify-center mb-8">
                        <div className="px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Experience Luxury</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-7xl md:text-[10rem] font-black mb-6 tracking-[-0.06em] leading-[0.8] uppercase text-white shadow-2xl">
                        {propertyData.name}
                    </h1>

                    {/* Tagline */}
                    <p className="text-lg md:text-2xl font-bold text-white/40 uppercase tracking-[0.2em] mb-12 max-w-3xl mx-auto leading-relaxed">
                        {propertyData.tagline}
                    </p>

                    {/* CTA Section */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-20">
                        <a href="#booking" className="btn-primary">
                            <span>Rezerviši sada</span>
                            <Star className="w-5 h-5 fill-white" />
                        </a>
                        <a href="#gallery" className="btn-secondary">
                            Istraži prostor
                        </a>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        {[
                            { label: "Kvadratura", val: propertyData.details.size, icon: "Maximize" },
                            { label: "Gostiju", val: propertyData.details.maxGuests, icon: "Users" },
                            { label: "Spavaće", val: propertyData.details.bedrooms, icon: "Bed" },
                            { label: "Kupatila", val: propertyData.details.bathrooms, icon: "Bath" }
                        ].map((stat, i) => (
                            <div key={i} className="p-6 deluxe-card text-center group hover:bg-[var(--accent)] transition-colors duration-500">
                                <p className="text-white/30 group-hover:text-white/60 text-[8px] font-black uppercase tracking-[0.3em] mb-2">{stat.label}</p>
                                <p className="text-2xl font-black text-white">{stat.val}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-[var(--accent)]/10 blur-3xl" />
            <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-[var(--gold)]/10 blur-3xl" />
        </section>
    );
}
