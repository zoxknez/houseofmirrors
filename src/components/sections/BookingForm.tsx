"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { srLatn, enUS } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Users, CreditCard, Loader2, CheckCircle, AlertCircle, User, Mail, Phone, MessageSquare } from "lucide-react";
import { ModalShell } from "@/components/ui/ModalShell";
import { FormField } from "@/components/ui/FormField";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useLanguage } from "@/context/LanguageContext";

interface BookingFormProps {
    checkIn: Date;
    checkOut: Date;
    guests: number;
    totalPrice: number;
    onClose: () => void;
    onSuccess: () => void;
}

interface FormData {
    name: string;
    email: string;
    phone: string;
    message: string;
}

function makeRefCode() {
    return `HOM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export function BookingForm({ checkIn, checkOut, guests, totalPrice, onClose, onSuccess }: BookingFormProps) {
    const { dict, language } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Form state
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    const abortRef = useRef<AbortController | null>(null);
    const timeoutRef = useRef<number | null>(null);

    const refCode = useMemo(() => makeRefCode(), []);
    const dateLocale = language === "sr" ? srLatn : enUS;

    // Localized strings
    const t = {
        title: language === "sr" ? "Rezervacija" : "Reservation",
        subtitle: language === "sr" ? "Potvrda" : "Confirmation",
        checkIn: language === "sr" ? "Dolazak" : "Check-in",
        checkOut: language === "sr" ? "Odlazak" : "Check-out",
        guests: language === "sr" ? "Gosti" : "Guests",
        guestsLabel: language === "sr" ? "Gost" : "Guest",
        guestsPlural: language === "sr" ? "Gosta" : "Guests",
        total: dict.booking.total,
        name: dict.contact.name,
        email: dict.contact.email,
        phone: dict.contact.phone,
        notes: language === "sr" ? "Posebni zahtevi" : "Special requests",
        phoneNote:
            language === "sr"
                ? "Rezervacija je validna tek nakon telefonskog razgovora sa domaćinom."
                : "Reservation is valid only after a phone call with the host.",
        send: language === "sr" ? "Potvrdi rezervaciju" : "Confirm reservation",
        sending: dict.contact.sending,
        successTitle: language === "sr" ? "Zahtev poslat" : "Request sent",
        successMessage: language === "sr" ? "Primili smo vaš zahtev. Kontaktiraćemo vas uskoro na" : "We received your request. We will contact you soon at",
        refCode: language === "sr" ? "Referentni broj" : "Reference number",
        error: dict.contact.error,
        requiredError: language === "sr" ? "Molimo popunite sva polja." : "Please fill in all fields.",
        close: language === "sr" ? "Zatvori" : "Close",
        payment: language === "sr" ? "Za uplatu" : "Total due",
        confirmationNote: language === "sr" ? "Primićete email potvrdu sa detaljima za uplatu. Rezervacija je finalna nakon potvrde uplate." : "You will receive an email confirmation with payment details. Reservation is final after payment confirmation."
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const cleanup = () => {
        if (abortRef.current) abortRef.current.abort();
        abortRef.current = null;
        if (typeof window !== "undefined" && timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = null;
    };

    useEffect(() => cleanup, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.message.trim()) {
            setError(t.requiredError);
            setLoading(false);
            return;
        }

        // abort previous if any
        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        try {
            const payload = {
                ...formData,
                firstName: formData.name.split(" ")[0] || formData.name, // quick hack if backend expects separate fields, otherwise send full name
                lastName: formData.name.split(" ").slice(1).join(" ") || "",
                name: formData.name.trim(), // Send as name as well if API supports it
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                message: formData.message.trim(),
                checkIn: format(checkIn, 'yyyy-MM-dd'),
                checkOut: format(checkOut, 'yyyy-MM-dd'),
                guests,
                totalPrice,
                reference: refCode,
            };

            const res = await fetch("/api/booking", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                signal: controller.signal,
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || t.error);
            }

            setSuccess(true);
            timeoutRef.current = window.setTimeout(() => {
                onSuccess();
            }, 3000);
        } catch (err: any) {
            if (err?.name === "AbortError") return;
            setError(err.message || t.error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalShell open={true} onClose={() => { cleanup(); onClose(); }}>
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 md:p-8 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--gold)] mb-1">
                        {t.title}
                    </h3>
                    <h4 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">
                        {t.subtitle}
                    </h4>
                </div>

                <button
                    type="button"
                    onClick={() => { cleanup(); onClose(); }}
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all duration-300 group"
                    aria-label={t.close}
                    disabled={loading}
                >
                    <X className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                </button>
            </div>

            {success ? (
                <div className="p-10 text-center">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex items-center justify-center"
                    >
                        <CheckCircle className="w-10 h-10 text-[var(--gold)]" />
                    </motion.div>

                    <h4 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter mb-3">
                        {t.successTitle}
                    </h4>

                    <p className="text-white/40 mb-8 leading-relaxed font-medium text-sm">
                        {t.successMessage}{" "}
                        <span className="text-white">{formData.email}</span>.
                    </p>

                    <div className="bg-white/[0.03] border border-white/5 p-5 rounded-[20px] max-w-sm mx-auto">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">
                            {t.refCode}
                        </div>
                        <div className="text-xl font-black text-[var(--gold)] tracking-widest uppercase">
                            {refCode}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Summary */}
                    <div className="p-6 md:p-8 border-b border-white/5 bg-white/[0.02]">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-9 h-9 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
                                    <Calendar className="w-4 h-4 text-[var(--gold)]" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{t.checkIn}</p>
                                    <p className="text-white font-black uppercase tracking-tight">
                                        {format(checkIn, "d. MMM yyyy", { locale: dateLocale })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-9 h-9 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
                                    <Calendar className="w-4 h-4 text-[var(--gold)]" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{t.checkOut}</p>
                                    <p className="text-white font-black uppercase tracking-tight">
                                        {format(checkOut, "d. MMM yyyy", { locale: dateLocale })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-9 h-9 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
                                    <Users className="w-4 h-4 text-[var(--gold)]" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{t.guests}</p>
                                    <p className="text-white font-black uppercase tracking-tight">
                                        {guests} {guests === 1 ? t.guestsLabel : t.guestsPlural}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-end">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{t.payment}</span>
                            <span className="text-2xl md:text-3xl font-black text-[var(--gold)] tracking-tighter">€{totalPrice}</span>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-7" aria-busy={loading}>
                        {error && (
                            <div
                                className="p-5 rounded-[20px] bg-red-500/10 border border-red-500/20 flex items-center gap-4"
                                role="alert"
                                aria-live="polite"
                            >
                                <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                                <p className="text-red-400 font-bold text-sm">{error}</p>
                            </div>
                        )}

                        <div className="grid sm:grid-cols-2 gap-5">
                            <FormField
                                label={t.name}
                                required
                                icon={User}
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Petar Petrović"
                                autoComplete="name"
                            />
                            <div className="space-y-2">
                                <FormField
                                    label={t.phone}
                                    required
                                    icon={Phone}
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+381..."
                                    autoComplete="tel"
                                    inputMode="tel"
                                />
                                <p className="text-white/50 text-[11px] leading-relaxed">
                                    {t.phoneNote}
                                </p>
                            </div>
                        </div>

                        <FormField
                            label={t.email}
                            required
                            icon={Mail}
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="email@example.com"
                            autoComplete="email"
                            inputMode="email"
                        />

                        <FormField
                            as="textarea"
                            label={t.notes}
                            required
                            icon={MessageSquare}
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={3}
                            placeholder="..."
                        />

                        <div className="pt-3">
                            <PrimaryButton type="submit" disabled={loading} className="flex items-center justify-center gap-3">
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        {t.sending}
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="w-5 h-5" />
                                        {t.send}
                                    </>
                                )}
                            </PrimaryButton>
                        </div>

                        <p className="text-center text-[10px] font-black uppercase tracking-widest text-white/20">
                            {t.confirmationNote}
                        </p>
                    </form>
                </>
            )}
        </ModalShell>
    );
}
