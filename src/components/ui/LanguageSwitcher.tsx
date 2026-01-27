"use client";

import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
    const { language, setLanguage } = useLanguage();

    return (
        <div className={`flex items-center gap-1 ${className}`}>
            <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`text-[10px] font-black uppercase tracking-widest transition-colors ${language === "en" ? "text-[var(--gold)]" : "text-white/40 hover:text-white"
                    }`}
            >
                EN
            </button>
            <span className="text-white/20 text-[10px] select-none">/</span>
            <button
                type="button"
                onClick={() => setLanguage("sr")}
                className={`text-[10px] font-black uppercase tracking-widest transition-colors ${language === "sr" ? "text-[var(--gold)]" : "text-white/40 hover:text-white"
                    }`}
            >
                SR
            </button>
        </div>
    );
}
