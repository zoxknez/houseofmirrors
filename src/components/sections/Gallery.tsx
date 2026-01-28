"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { propertyImages } from "@/data/images";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export function Gallery() {
    const { dict } = useLanguage();
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const hasImages = propertyImages.gallery.length > 0;

    const categories = useMemo(() => {
        return propertyImages.categories.map((cat) => ({
            ...cat,
            label: dict.gallery.categories[cat.id as keyof typeof dict.gallery.categories],
        }));
    }, [dict]);

    const imageNumberBySrc = useMemo(() => {
        const counters: Record<string, number> = {};
        const map = new Map<string, number>();

        propertyImages.gallery.forEach((img) => {
            const key = img.category;
            counters[key] = (counters[key] || 0) + 1;
            map.set(img.src, counters[key]);
        });

        return map;
    }, []);

    const getLocalizedAlt = (img: typeof propertyImages.gallery[number]) => {
        const label = dict.gallery.categories[img.category as keyof typeof dict.gallery.categories];
        const index = imageNumberBySrc.get(img.src);

        if (!label || !index) return img.alt;
        return `${label} ${index}`;
    };

    const filteredImages = useMemo(() => {
        return selectedCategory === "all"
            ? propertyImages.gallery
            : propertyImages.gallery.filter((img) => img.category === selectedCategory);
    }, [selectedCategory]);

    const selectedCategoryMeta = useMemo(() => {
        return categories.find((cat) => cat.id === selectedCategory) || categories[0];
    }, [selectedCategory, categories]);

    const displayImages = filteredImages.length ? filteredImages : propertyImages.gallery;
    const featuredImage = displayImages[0];

    const lightboxIndex = useMemo(() => {
        if (!lightboxSrc) return null;
        const idx = filteredImages.findIndex(img => img.src === lightboxSrc);
        return idx === -1 ? 0 : idx;
    }, [lightboxSrc, filteredImages]);

    const openLightbox = (src: string) => setLightboxSrc(src);
    const closeLightbox = () => setLightboxSrc(null);

    const nextImage = () => {
        if (lightboxIndex !== null) {
            const nextIdx = (lightboxIndex + 1) % filteredImages.length;
            setLightboxSrc(filteredImages[nextIdx].src);
        }
    };

    const prevImage = () => {
        if (lightboxIndex !== null) {
            const prevIdx = (lightboxIndex - 1 + filteredImages.length) % filteredImages.length;
            setLightboxSrc(filteredImages[prevIdx].src);
        }
    };

    useEffect(() => {
        if (lightboxSrc === null) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowRight") nextImage();
            if (e.key === "ArrowLeft") prevImage();
        };

        window.addEventListener("keydown", handleKeyDown);
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = originalOverflow;
        };
    }, [lightboxSrc, lightboxIndex]); // Re-bind keys when index changes for next/prev logic

    return (
        <section id="gallery" className="relative py-20 md:py-32">
            <div className="max-w-[1400px] mx-auto px-6 md:px-10">
                {/* Category Filters */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                                setSelectedCategory(cat.id);
                                closeLightbox();
                            }}
                            className={cn(
                                "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 border",
                                selectedCategory === cat.id
                                    ? "bg-[var(--gold)] text-black border-[var(--gold)] shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                                    : "bg-white/5 text-white/40 border-white/10 hover:border-white/20 hover:text-white"
                            )}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Hero Gallery Layout */}
                {hasImages && featuredImage ? (
                    <button
                        type="button"
                        aria-label={dict.gallery.viewGallery}
                        className="relative group cursor-pointer overflow-hidden rounded-3xl deluxe-card aspect-[21/9] w-full text-left"
                        onClick={() => openLightbox(featuredImage.src)}
                    >
                        <Image
                            src={featuredImage.src}
                            alt={featuredImage.alt}
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-105"
                            priority
                            sizes="100vw"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                        {/* Content */}
                        <div className="absolute bottom-10 left-10 text-left">
                            <p className="text-white/40 text-xs font-black uppercase tracking-[0.3em] mb-2">
                                {selectedCategory === "all" ? dict.gallery.title : selectedCategoryMeta.label}
                            </p>
                            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
                                {selectedCategoryMeta.label}
                            </h2>
                            <div className="flex items-center gap-4">
                                <span className="btn-primary !px-6 !py-3 !text-xs">
                                    {dict.gallery.viewGallery}
                                </span>
                                <span className="text-white/60 font-bold uppercase text-[10px] tracking-widest">
                                    {displayImages.length} {dict.gallery.photoCount}
                                </span>
                            </div>
                        </div>

                        {/* Image Previews Stack (Decorative) */}
                        <div className="absolute bottom-10 right-10 hidden md:flex items-center -space-x-4">
                            {displayImages.slice(1, 4).map((img, i) => (
                                <div
                                    key={i}
                                    className="w-16 h-16 rounded-xl border-2 border-black overflow-hidden relative shadow-2xl transition-transform hover:-translate-y-2"
                                >
                                    <Image
                                        src={img.src}
                                        alt={getLocalizedAlt(img)}
                                        fill
                                        className="object-cover"
                                        sizes="(min-width: 768px) 64px, 48px"
                                    />
                                </div>
                            ))}
                            <div className="w-16 h-16 rounded-xl border-2 border-black bg-[var(--accent)] flex items-center justify-center text-white text-xs font-black shadow-2xl transition-transform hover:-translate-y-2">
                                +{Math.max(displayImages.length - 4, 0)}
                            </div>
                        </div>
                    </button>
                ) : (
                    <div className="relative overflow-hidden rounded-3xl deluxe-card aspect-[21/9] w-full flex items-center justify-center text-center p-8">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent" />
                        <div className="relative z-10">
                            <p className="text-white/40 text-xs font-black uppercase tracking-[0.3em] mb-3">{dict.gallery.title}</p>
                            <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter mb-4">
                                Coming Soon
                            </h2>
                            <p className="text-white/50 text-xs md:text-sm font-bold uppercase tracking-[0.2em]">
                                Photos are being prepared
                            </p>
                        </div>
                    </div>
                )}

                {/* Sub-grid for categories */}
                {selectedCategory === "all" ? (
                    <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-6">
                        {categories.slice(1, 5).map((cat, i) => {
                            const firstImgOfCat = propertyImages.gallery.find((img) => img.category === cat.id);
                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    aria-label={`${dict.gallery.viewGallery}: ${cat.label}`}
                                    className="deluxe-card aspect-video relative group cursor-pointer overflow-hidden w-full text-left"
                                    onClick={() => {
                                        if (firstImgOfCat) openLightbox(firstImgOfCat.src);
                                    }}
                                    disabled={!hasImages || !firstImgOfCat}
                                >
                                    {hasImages && (firstImgOfCat || propertyImages.gallery[i + 1]) ? (
                                        <>
                                            <Image
                                                src={firstImgOfCat?.src || propertyImages.gallery[i + 1].src}
                                                alt={firstImgOfCat ? getLocalizedAlt(firstImgOfCat) : cat.label}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                sizes="(min-width: 768px) 33vw, 100vw"
                                            />
                                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                                        </>
                                    ) : (
                                        <div className="absolute inset-0 bg-white/[0.02]" />
                                    )}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-white font-black uppercase tracking-[0.2em] text-sm mb-1">{cat.label}</span>
                                        <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                                            {propertyImages.gallery.filter((img) => img.category === cat.id).length} {dict.gallery.photoCount}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {displayImages.slice(1, 9).map((img) => (
                            <button
                                key={img.src}
                                type="button"
                                aria-label={`${dict.gallery.viewGallery}: ${getLocalizedAlt(img)}`}
                                className="deluxe-card aspect-video relative group cursor-pointer overflow-hidden w-full text-left"
                                onClick={() => openLightbox(img.src)}
                                disabled={!hasImages}
                            >
                                <Image
                                    src={img.src}
                                    alt={getLocalizedAlt(img)}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    sizes="(min-width: 768px) 25vw, 50vw"
                                />
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxSrc !== null && lightboxIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center"
                        onClick={closeLightbox}
                        role="dialog"
                        aria-modal="true"
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeLightbox}
                            type="button"
                            className="absolute top-6 right-6 z-[110] p-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all"
                            aria-label="Close"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Desktop Navigation */}
                        <button
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            type="button"
                            className="hidden md:inline-flex absolute left-8 top-1/2 -translate-y-1/2 z-[110] p-5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all group"
                            aria-label="Previous"
                        >
                            <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            type="button"
                            className="hidden md:inline-flex absolute right-8 top-1/2 -translate-y-1/2 z-[110] p-5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all group"
                            aria-label="Next"
                        >
                            <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
                        </button>

                        {/* Mobile Navigation Bar */}
                        <div className="md:hidden fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] flex items-center gap-6">
                            <button
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                type="button"
                                className="p-4 rounded-full bg-white/5 border border-white/10 text-white active:scale-90 transition-all"
                                aria-label="Previous"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10">
                                <span className="text-white text-[10px] font-black uppercase tracking-widest">
                                    {lightboxIndex + 1} / {filteredImages.length}
                                </span>
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                type="button"
                                className="p-4 rounded-full bg-white/5 border border-white/10 text-white active:scale-90 transition-all"
                                aria-label="Next"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Image Container */}
                        <motion.div
                            key={filteredImages[lightboxIndex].src}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.2}
                            onDragEnd={(_, info) => {
                                if (info.offset.x > 100) prevImage();
                                else if (info.offset.x < -100) nextImage();
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full h-full flex items-center justify-center p-4 md:p-20"
                        >
                            <div className="relative w-full h-full max-w-6xl max-h-[70vh] md:max-h-[85vh]">
                                <Image
                                    src={filteredImages[lightboxIndex].src}
                                    alt={getLocalizedAlt(filteredImages[lightboxIndex])}
                                    fill
                                    className="object-contain"
                                    draggable={false}
                                    sizes="(min-width: 1024px) 80vw, 100vw"
                                />
                            </div>

                            {/* Info Label - Desktop */}
                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block">
                                <div className="px-6 py-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-center">
                                    <p className="text-white text-xs font-black uppercase tracking-[0.2em] mb-1">
                                        {getLocalizedAlt(filteredImages[lightboxIndex])}
                                    </p>
                                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                                        {lightboxIndex + 1} of {filteredImages.length}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
