"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { propertyImages } from "@/data/images";

export function Gallery() {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const filteredImages =
        selectedCategory === "all"
            ? propertyImages.gallery
            : propertyImages.gallery.filter((img) => img.category === selectedCategory);

    const openLightbox = (index: number) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(null);

    const nextImage = () => {
        if (lightboxIndex !== null) {
            setLightboxIndex((lightboxIndex + 1) % filteredImages.length);
        }
    };

    const prevImage = () => {
        if (lightboxIndex !== null) {
            setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length);
        }
    };

    return (
        <section id="gallery" className="relative py-24 md:py-40">
            <div className="max-w-[1400px] mx-auto px-6 md:px-10">
                {/* Hero Gallery Layout */}
                <div
                    className="relative group cursor-pointer overflow-hidden rounded-3xl deluxe-card aspect-[21/9]"
                    onClick={() => openLightbox(0)}
                >
                    <Image
                        src={propertyImages.gallery[0].src}
                        alt={propertyImages.gallery[0].alt}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        priority
                        sizes="100vw"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                    {/* Content */}
                    <div className="absolute bottom-10 left-10 text-left">
                        <p className="text-white/40 text-xs font-black uppercase tracking-[0.3em] mb-2">Featured Image</p>
                        <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
                            Dnevni Boravak
                        </h2>
                        <div className="flex items-center gap-4">
                            <button className="btn-primary !px-6 !py-3 !text-xs">
                                Pogledaj galeriju
                            </button>
                            <span className="text-white/60 font-bold uppercase text-[10px] tracking-widest">
                                {propertyImages.gallery.length} fotografija
                            </span>
                        </div>
                    </div>

                    {/* Image Previews Stack (Decorative) */}
                    <div className="absolute bottom-10 right-10 hidden md:flex items-center -space-x-4">
                        {propertyImages.gallery.slice(1, 4).map((img, i) => (
                            <div
                                key={i}
                                className="w-16 h-16 rounded-xl border-2 border-black overflow-hidden relative shadow-2xl transition-transform hover:-translate-y-2"
                            >
                                <Image src={img.src} alt="preview" fill className="object-cover" />
                            </div>
                        ))}
                        <div className="w-16 h-16 rounded-xl border-2 border-black bg-[var(--accent)] flex items-center justify-center text-white text-xs font-black shadow-2xl transition-transform hover:-translate-y-2">
                            +{propertyImages.gallery.length - 4}
                        </div>
                    </div>
                </div>

                {/* Sub-grid for categories */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {propertyImages.categories.slice(1, 4).map((cat, i) => {
                        const firstImgOfCat = propertyImages.gallery.find(img => img.category === cat.id);
                        return (
                            <div
                                key={cat.id}
                                className="deluxe-card aspect-video relative group cursor-pointer overflow-hidden"
                                onClick={() => {
                                    const idx = propertyImages.gallery.findIndex(img => img.category === cat.id);
                                    if (idx !== -1) openLightbox(idx);
                                }}
                            >
                                <Image
                                    src={firstImgOfCat?.src || propertyImages.gallery[i + 1].src}
                                    alt={cat.label}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-white font-black uppercase tracking-[0.2em] text-sm mb-1">{cat.label}</span>
                                    <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                                        {propertyImages.gallery.filter(img => img.category === cat.id).length} slika
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="lightbox-overlay"
                        onClick={closeLightbox}
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                            aria-label="Zatvori"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>

                        {/* Navigation */}
                        <button
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            className="absolute left-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                            aria-label="Prethodna slika"
                        >
                            <ChevronLeft className="w-8 h-8 text-white" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            className="absolute right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                            aria-label="Sledeća slika"
                        >
                            <ChevronRight className="w-8 h-8 text-white" />
                        </button>

                        {/* Image */}
                        <motion.div
                            key={lightboxIndex}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative max-w-[90vw] max-h-[90vh]"
                        >
                            <Image
                                src={filteredImages[lightboxIndex].src}
                                alt={filteredImages[lightboxIndex].alt}
                                width={1200}
                                height={800}
                                className="lightbox-image"
                                priority
                            />
                            <p className="text-center text-white/80 mt-4">
                                {filteredImages[lightboxIndex].alt} ({lightboxIndex + 1}/{filteredImages.length})
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
