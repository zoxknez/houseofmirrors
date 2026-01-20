"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { srLatn } from "date-fns/locale";
import {
    X,
    User,
    Mail,
    Phone,
    MessageSquare,
    Calendar,
    Users,
    CreditCard,
    Loader2,
    CheckCircle,
    AlertCircle,
} from "lucide-react";
import { ModalShell } from "@/components/ui/ModalShell";
import { FormField } from "@/components/ui/FormField";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

interface BookingFormProps {
    checkIn: Date;
    checkOut: Date;
    guests: number;
    totalPrice: number;
    onClose: () => void;
    onSuccess: () => void;
}

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
}

function makeRefCode() {
    return `HOM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export function BookingForm({
    checkIn,
    checkOut,
    guests,
    totalPrice,
    onClose,
    onSuccess,
}: BookingFormProps) {
    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const abortRef = useRef<AbortController | null>(null);
    const timeoutRef = useRef<number | null>(null);

    // generate once per modal open
    const refCode = useMemo(() => makeRefCode(), []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
        if (loading) return;

        setLoading(true);
        setError(null);

        // abort previous if any
        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        try {
            const payload = {
                ...formData,
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim(),
                phone: formData.phone.replace(/\s+/g, "").trim(),
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

            let data: any = null;
            try {
                data = await res.json();
            } catch {
                // ignore if response has no json
            }

            if (!res.ok) {
                throw new Error(data?.error || "Došlo je do greške");
            }

            setSuccess(true);

            timeoutRef.current = window.setTimeout(() => {
                onSuccess();
            }, 2500);
        } catch (err) {
            if ((err as any)?.name === "AbortError") return;
            setError(err instanceof Error ? err.message : "Došlo je do greške");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalShell open={true} onClose={() => { cleanup(); onClose(); }}>
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-8 md:p-10 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--gold)] mb-1">
                        Rezervacija
                    </h3>
                    <h4 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">
                        POTVRDA
                    </h4>
                </div>

                <button
                    onClick={() => { cleanup(); onClose(); }}
                    className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all duration-300 group"
                    aria-label="Zatvori"
                    disabled={loading}
                >
                    <X className="w-6 h-6 text-white/40 group-hover:text-white transition-colors" />
                </button>
            </div>

            {success ? (
                <div className="p-12 text-center">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="w-24 h-24 mx-auto mb-8 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex items-center justify-center"
                    >
                        <CheckCircle className="w-12 h-12 text-[var(--gold)]" />
                    </motion.div>

                    <h4 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter mb-4">
                        Zahtev poslat
                    </h4>

                    <p className="text-white/40 mb-10 leading-relaxed font-medium">
                        Primili smo vaš zahtev. Kontaktiraćemo vas uskoro na{" "}
                        <span className="text-white">{formData.email}</span> radi potvrde.
                    </p>

                    <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[24px] max-w-sm mx-auto">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">
                            Referentni broj
                        </div>
                        <div className="text-xl font-black text-[var(--gold)] tracking-widest uppercase">
                            {refCode}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Summary */}
                    <div className="p-8 md:p-10 border-b border-white/5 bg-white/[0.02]">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-[var(--gold)]" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Dolazak</p>
                                    <p className="text-white font-black uppercase tracking-tight">
                                        {format(checkIn, "d. MMM yyyy", { locale: srLatn })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-[var(--gold)]" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Odlazak</p>
                                    <p className="text-white font-black uppercase tracking-tight">
                                        {format(checkOut, "d. MMM yyyy", { locale: srLatn })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
                                    <Users className="w-5 h-5 text-[var(--gold)]" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Gosti</p>
                                    <p className="text-white font-black uppercase tracking-tight">
                                        {guests} {guests === 1 ? "Gost" : "Gosta"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-end">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Za uplatu</span>
                            <span className="text-3xl font-black text-[var(--gold)] tracking-tighter">€{totalPrice}</span>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
                        {error && (
                            <div className="p-5 rounded-[20px] bg-red-500/10 border border-red-500/20 flex items-center gap-4">
                                <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                                <p className="text-red-400 font-bold text-sm">{error}</p>
                            </div>
                        )}

                        <div className="grid sm:grid-cols-2 gap-6">
                            <FormField
                                label="Ime"
                                required
                                icon={User}
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Petar"
                                autoComplete="given-name"
                            />
                            <FormField
                                label="Prezime"
                                required
                                icon={User}
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Petrović"
                                autoComplete="family-name"
                            />
                        </div>

                        <FormField
                            label="Email adresa"
                            required
                            icon={Mail}
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="petar@email.com"
                            autoComplete="email"
                            inputMode="email"
                        />

                        <FormField
                            label="Telefon"
                            required
                            icon={Phone}
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+381601234567"
                            autoComplete="tel"
                            inputMode="tel"
                        />

                        <FormField
                            as="textarea"
                            label="Posebni zahtevi (opciono)"
                            icon={MessageSquare}
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Npr. kasni dolazak, bebi krevetac..."
                        />

                        <div className="pt-4">
                            <PrimaryButton type="submit" disabled={loading} className="flex items-center justify-center gap-3">
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Šaljem zahtev...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="w-5 h-5" />
                                        Potvrdi rezervaciju
                                    </>
                                )}
                            </PrimaryButton>
                        </div>

                        <p className="text-center text-[10px] font-black uppercase tracking-widest text-white/20">
                            Primićete email potvrdu sa detaljima za uplatu.
                            <span className="block mt-1">Rezervacija je finalna nakon potvrde uplate.</span>
                        </p>
                    </form>
                </>
            )}
        </ModalShell>
    );
}
