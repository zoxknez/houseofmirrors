"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { sr } from "date-fns/locale";
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
    AlertCircle
} from "lucide-react";
import { propertyData } from "@/data/property";

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

export function BookingForm({
    checkIn,
    checkOut,
    guests,
    totalPrice,
    onClose,
    onSuccess
}: BookingFormProps) {
    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: ""
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/booking", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    checkIn: checkIn.toISOString(),
                    checkOut: checkOut.toISOString(),
                    guests,
                    totalPrice
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Došlo je do greške");
            }

            setSuccess(true);
            setTimeout(() => {
                onSuccess();
            }, 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Došlo je do greške");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="deluxe-card w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-8 border-b border-white/10 bg-black">
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter">POTVRDA</h3>
                    <button
                        onClick={onClose}
                        className="p-3 rounded-full hover:bg-white/10 transition-colors border border-white/10"
                        aria-label="Zatvori"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>
                </div>

                {success ? (
                    /* Success Message */
                    <div className="p-8 text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
                        >
                            <CheckCircle className="w-10 h-10 text-green-400" />
                        </motion.div>
                        <h4 className="text-2xl font-bold text-white mb-2">
                            Rezervacija poslata!
                        </h4>
                        <p className="text-white/70 mb-6">
                            Primili smo vaš zahtev za rezervaciju. Kontaktiraćemo vas uskoro
                            na email {formData.email} radi potvrde.
                        </p>
                        <div className="glass-card p-4 max-w-sm mx-auto">
                            <div className="text-sm text-white/60">Referentni broj</div>
                            <div className="text-lg font-mono text-[var(--gold)]">
                                HOM-{Date.now().toString(36).toUpperCase()}
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Booking Summary */}
                        <div className="p-6 border-b border-white/10 bg-white/5">
                            <div className="grid sm:grid-cols-3 gap-4">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-[var(--accent)]" />
                                    <div>
                                        <p className="text-xs text-white/50">Check-in</p>
                                        <p className="text-white font-medium">
                                            {format(checkIn, "d. MMM yyyy", { locale: sr })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-[var(--accent)]" />
                                    <div>
                                        <p className="text-xs text-white/50">Check-out</p>
                                        <p className="text-white font-medium">
                                            {format(checkOut, "d. MMM yyyy", { locale: sr })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Users className="w-5 h-5 text-[var(--accent)]" />
                                    <div>
                                        <p className="text-xs text-white/50">Gosti</p>
                                        <p className="text-white font-medium">{guests}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                                <span className="text-white/70">Ukupno za uplatu</span>
                                <span className="text-2xl font-bold gold-text">€{totalPrice}</span>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {error && (
                                <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-400" />
                                    <p className="text-red-300">{error}</p>
                                </div>
                            )}

                            <div className="grid sm:grid-cols-2 gap-4">
                                {/* First Name */}
                                <div>
                                    <label className="block text-sm text-white/70 mb-2">
                                        Ime *
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--accent)] transition-colors"
                                            placeholder="Vaše ime"
                                        />
                                    </div>
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label className="block text-sm text-white/70 mb-2">
                                        Prezime *
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--accent)] transition-colors"
                                            placeholder="Vaše prezime"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm text-white/70 mb-2">
                                    Email adresa *
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--accent)] transition-colors"
                                        placeholder="vas@email.com"
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm text-white/70 mb-2">
                                    Telefon *
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--accent)] transition-colors"
                                        placeholder="+381 xx xxx xxxx"
                                    />
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-sm text-white/70 mb-2">
                                    Posebni zahtevi (opciono)
                                </label>
                                <div className="relative">
                                    <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-white/40" />
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--accent)] transition-colors resize-none"
                                        placeholder="Npr. kasni dolazak, posebni zahtevi..."
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Šaljem zahtev...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="w-5 h-5" />
                                        Pošalji zahtev za rezervaciju
                                    </>
                                )}
                            </button>

                            <p className="text-center text-white/50 text-sm">
                                Primićete email potvrdu sa detaljima za uplatu.
                                Rezervacija je potvrđena nakon uplate.
                            </p>
                        </form>
                    </>
                )}
            </motion.div>
        </motion.div>
    );
}
