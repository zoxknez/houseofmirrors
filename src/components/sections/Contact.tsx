"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
    Send,
    Loader2,
    CheckCircle,
    Phone,
    Mail,
    MapPin,
    User,
    MessageSquare,
    AlertCircle,
} from "lucide-react";
import { propertyData } from "@/data/property";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { FormField } from "@/components/ui/FormField";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useLanguage } from "@/context/LanguageContext";

type ContactFormData = {
    name: string;
    email: string;
    subject: string;
    message: string;
};

export function Contact() {
    const { dict, language } = useLanguage();
    const isDesktop = useMediaQuery("(min-width: 1024px)");
    const [formData, setFormData] = useState<ContactFormData>({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const abortRef = useRef<AbortController | null>(null);
    const timeoutRef = useRef<number | null>(null);

    const cleanup = () => {
        if (abortRef.current) abortRef.current.abort();
        abortRef.current = null;

        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
    };

    useEffect(() => cleanup, []);

    // Simple translations
    const t = {
        details: language === "sr" ? "Detalji" : "Details",
        location: dict.location.title,
        call: language === "sr" ? "Pozovite nas" : "Call us",
        email: "Email",
        host: "Premium Host",
        responds: (time: string, rate: string) => language === "sr" ? `Odgovaramo ${time} sa ${rate} preciznosti.` : `Responds in ${time} with ${rate} precision.`,
        sendMessage: language === "sr" ? "Pošaljite poruku" : "Send a message",
        subject: language === "sr" ? "Tema" : "Subject",
        contactTitle: language === "sr" ? "Budimo u" : "Get in",
        contactSuffix: language === "sr" ? "kontaktu" : "Contact",
        namePlaceholder: "Petar Petrović",
        emailPlaceholder: "petar@email.com",
        subjectPlaceholder: language === "sr" ? "Upit za rezervaciju" : "Reservation inquiry",
        messagePlaceholder: language === "sr" ? "Napišite vašu poruku..." : "Write your message...",
        messageError: language === "sr" ? "Molimo popunite sva obavezna polja." : "Please fill in all required fields."
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));

        // UX: čim user krene da kuca ponovo, skloni success i error
        if (success) setSuccess(false);
        if (error) setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);
        setError(null);

        // abort previous request if any
        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        try {
            const payload = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                subject: formData.subject.trim(),
                message: formData.message.trim(),
            };

            // Basic sanity (HTML required already exists, this is just extra)
            if (!payload.name || !payload.email || !payload.subject || !payload.message) {
                throw new Error(t.messageError);
            }

            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                signal: controller.signal,
            });

            let data: any = null;
            try {
                data = await res.json();
            } catch {
                // ignore
            }

            if (!res.ok) {
                throw new Error(data?.error || dict.contact.error);
            }

            setSuccess(true);
            setFormData({ name: "", email: "", subject: "", message: "" });

            // auto-hide success, with cleanup
            timeoutRef.current = window.setTimeout(() => setSuccess(false), 5000);
        } catch (err) {
            if ((err as any)?.name === "AbortError") return;
            setError(err instanceof Error ? err.message : dict.contact.error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="contact" className="relative py-20 md:py-32 bg-black overflow-hidden">
            <div
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 bg-[var(--gold)]/5 rounded-full blur-[150px] pointer-events-none"
            />

            <div className="max-w-[1400px] mx-auto px-6 md:px-10 relative z-10">
                <SectionHeader
                    badge={dict.contact.title}
                    title={
                        <>
                            {t.contactTitle} <span className="text-[var(--gold)]">{t.contactSuffix}</span>
                        </>
                    }
                    subtitle={dict.contact.subtitle}
                />

                <div className="grid lg:grid-cols-5 gap-12 md:gap-16 max-w-7xl mx-auto items-start">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: isDesktop ? -30 : 0 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-2 space-y-8"
                    >
                        <GlassCard className="p-8 md:p-10 space-y-8 group hover:border-[var(--gold)]/20 transition-all duration-500">
                            <h3 className="text-sm md:text-base font-black uppercase tracking-[0.3em] text-white/40 mb-2">
                                {t.details}
                            </h3>

                            <div className="space-y-8">
                                <div className="flex items-start gap-8 group/item">
                                    <div className="w-14 h-14 rounded-full bg-[var(--gold)]/10 flex items-center justify-center flex-shrink-0 border border-[var(--gold)]/20 group-hover/item:scale-110 group-hover/item:bg-[var(--gold)]/20 transition-all duration-500">
                                        <MapPin className="w-6 h-6 text-[var(--gold)]" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--gold)] mb-2">
                                            {t.location}
                                        </p>
                                        <p className="text-base md:text-lg font-black uppercase tracking-tight text-white leading-tight">
                                            {propertyData.location.address}
                                            <br />
                                            <span className="text-white/40">{propertyData.location.city}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-8 group/item">
                                    <div className="w-14 h-14 rounded-full bg-[var(--gold)]/10 flex items-center justify-center flex-shrink-0 border border-[var(--gold)]/20 group-hover/item:scale-110 group-hover/item:bg-[var(--gold)]/20 transition-all duration-500">
                                        <Phone className="w-6 h-6 text-[var(--gold)]" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--gold)] mb-2">
                                            {t.call}
                                        </p>
                                        <a
                                            href="tel:+38160777777"
                                            className="text-base md:text-lg font-black uppercase tracking-tight text-white hover:text-[var(--gold)] transition-colors"
                                        >
                                            +381 60 777 777
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-8 group/item">
                                    <div className="w-14 h-14 rounded-full bg-[var(--gold)]/10 flex items-center justify-center flex-shrink-0 border border-[var(--gold)]/20 group-hover/item:scale-110 group-hover/item:bg-[var(--gold)]/20 transition-all duration-500">
                                        <Mail className="w-6 h-6 text-[var(--gold)]" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--gold)] mb-2">
                                            {t.email}
                                        </p>
                                        <a
                                            href="mailto:hello@houseofmirrors.rs"
                                            className="text-base md:text-lg font-black uppercase tracking-tight text-white hover:text-[var(--gold)] transition-colors break-all"
                                        >
                                            hello@houseofmirrors.rs
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>

                        {/* Host Info */}
                        <div className="bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-[32px] p-8 md:p-10 hover:border-[var(--gold)]/20 transition-all duration-500">
                            <div className="flex items-center gap-5 mb-8">
                                <div className="relative">
                                    <div className="w-20 h-20 rounded-[24px] bg-gradient-to-br from-[var(--gold)] to-[var(--gold)]/40 flex items-center justify-center text-black text-3xl font-black shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                                        {propertyData.host.name[0]}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 border-4 border-black rounded-full shadow-lg" />
                                </div>
                                <div>
                                    <p className="text-white text-2xl font-black uppercase tracking-tighter mb-1">
                                        {propertyData.host.name}
                                    </p>
                                    <p className="text-[var(--gold)] text-xs font-black uppercase tracking-[0.3em]">
                                        {t.host}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-[var(--gold)]/5 border border-[var(--gold)]/10 p-5 rounded-[20px]">
                                <p className="text-white/60 text-xs md:text-sm font-bold leading-relaxed italic text-center">
                                    "{t.responds(propertyData.host.responseTime, propertyData.host.responseRate)}"
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, x: isDesktop ? 30 : 0 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-3"
                    >
                        <GlassCard className="p-8 md:p-12">
                            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-white/40 mb-12">
                                {t.sendMessage}
                            </h3>

                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mb-10 p-6 rounded-[24px] bg-green-500/10 border border-green-500/20 flex items-center gap-4"
                                    role="status"
                                    aria-live="polite"
                                >
                                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                                    <p className="text-green-400 font-bold">{dict.contact.success}</p>
                                </motion.div>
                            )}

                            {error && (
                                <div
                                    className="mb-10 p-6 rounded-[24px] bg-red-500/10 border border-red-500/20 flex items-center gap-4"
                                    role="alert"
                                    aria-live="polite"
                                >
                                    <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                                    <p className="text-red-400 font-bold">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-7" aria-busy={loading}>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <FormField
                                        label={dict.contact.name}
                                        required
                                        icon={User}
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder={t.namePlaceholder}
                                        autoComplete="name"
                                    />

                                    <FormField
                                        label={dict.contact.email}
                                        required
                                        icon={Mail}
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder={t.emailPlaceholder}
                                        autoComplete="email"
                                        inputMode="email"
                                    />
                                </div>

                                <FormField
                                    label={t.subject}
                                    required
                                    icon={MessageSquare}
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder={t.subjectPlaceholder}
                                    autoComplete="off"
                                />

                                <FormField
                                    as="textarea"
                                    label={dict.contact.message}
                                    required
                                    rows={6}
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder={t.messagePlaceholder}
                                />

                                <div className="pt-4">
                                    <PrimaryButton type="submit" disabled={loading} className="flex items-center justify-center gap-3">
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                {dict.contact.sending}
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                {dict.contact.send}
                                            </>
                                        )}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </GlassCard>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
