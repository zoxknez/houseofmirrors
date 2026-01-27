"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Dictionary, Language } from "@/dictionaries/types";
import { en } from "@/dictionaries/en";
import { sr } from "@/dictionaries/sr";

type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
    dict: Dictionary;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const dictionaries: Record<Language, Dictionary> = {
    en,
    sr,
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>("en"); // Default to English
    const [dict, setDict] = useState<Dictionary>(en);

    useEffect(() => {
        // Check cookie on mount
        const match = document.cookie.match(new RegExp("(^| )language=([^;]+)"));
        if (match) {
            const savedLang = match[2] as Language;
            if (dictionaries[savedLang]) {
                setLanguageState(savedLang);
                setDict(dictionaries[savedLang]);
            }
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        setDict(dictionaries[lang]);
        document.cookie = `language=${lang}; path=/; max-age=31536000`; // 1 year
        document.documentElement.lang = lang; // Update html tag
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, dict }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
