"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
                className="bg-[#050505] border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[40px] shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-8 md:p-10 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--gold)] mb-1">Rezervacija</h3>
                        <h4 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">POTVRDA</h4>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all duration-300 group"
                        aria-label="Zatvori"
                    >
                        <X className="w-6 h-6 text-white/40 group-hover:text-white transition-colors" />
                    </button>
                </div>

                {success ? (
                    /* Success Message */
                    <div className="p-12 text-center">
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="w-24 h-24 mx-auto mb-8 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex items-center justify-center"
                        >
                            <CheckCircle className="w-12 h-12 text-[var(--gold)]" />
                        </motion.div>
                        <h4 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter mb-4">
                            Zahtev Poslat
                        </h4>
                        <p className="text-white/40 mb-10 leading-relaxed font-medium">
                            Primili smo vaš zahtev. Kontaktiraćemo vas uskoro
                            na <span className="text-white">{formData.email}</span> radi potvrde.
                        </p>
                        <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[24px] max-w-sm mx-auto">
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">Referentni broj</div>
                            <div className="text-xl font-black text-[var(--gold)] tracking-widest uppercase">
                                HOM-{Date.now().toString(36).toUpperCase()}
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Booking Summary */}
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
                                        <p className="text-white font-black uppercase tracking-tight">{guests} {guests === 1 ? 'Gost' : 'Gosta'}</p>
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
                                {/* First Name */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-3 ml-1">
                                        Ime *
                                    </label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-[var(--gold)] transition-colors" />
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-12 pr-4 py-4 rounded-[18px] bg-white/[0.03] border border-white/10 text-white font-bold placeholder:text-white/10 focus:outline-none focus:border-[var(--gold)] focus:bg-white/[0.05] transition-all"
                                            placeholder="Petar"
                                        />
                                    </div>
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-3 ml-1">
                                        Prezime *
                                    </label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-[var(--gold)] transition-colors" />
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-12 pr-4 py-4 rounded-[18px] bg-white/[0.03] border border-white/10 text-white font-bold placeholder:text-white/10 focus:outline-none focus:border-[var(--gold)] focus:bg-white/[0.05] transition-all"
                                            placeholder="Petrović"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-3 ml-1">
                                    Email adresa *
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-[var(--gold)] transition-colors" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-12 pr-4 py-4 rounded-[18px] bg-white/[0.03] border border-white/10 text-white font-bold placeholder:text-white/10 focus:outline-none focus:border-[var(--gold)] focus:bg-white/[0.05] transition-all"
                                        placeholder="petar@email.com"
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-3 ml-1">
                                    Telefon *
                                </label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-[var(--gold)] transition-colors" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-12 pr-4 py-4 rounded-[18px] bg-white/[0.03] border border-white/10 text-white font-bold placeholder:text-white/10 focus:outline-none focus:border-[var(--gold)] focus:bg-white/[0.05] transition-all"
                                        placeholder="+381 60 123 4567"
                                    />
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-3 ml-1">
                                    Posebni zahtevi (opciono)
                                </label>
                                <div className="relative group">
                                    <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-white/20 group-focus-within:text-[var(--gold)] transition-colors" />
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full pl-12 pr-4 py-4 rounded-[20px] bg-white/[0.03] border border-white/10 text-white font-bold placeholder:text-white/10 focus:outline-none focus:border-[var(--gold)] focus:bg-white/[0.05] transition-all resize-none"
                                        placeholder="Npr. kasni dolazak, bebi krevetac..."
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-16 rounded-full bg-[var(--gold)] text-black font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:hover:scale-100 transition-all duration-300 shadow-[0_0_30px_rgba(212,175,55,0.2)] flex items-center justify-center gap-3"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Šaljem zahtev...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="w-5 h-5" />
                                            Potvrdi Rezervaciju
                                        </>
                                    )}
                                </button>
                            </div>

                            <p className="text-center text-[10px] font-black uppercase tracking-widest text-white/20">
                                Primićete email potvrdu sa detaljima za uplatu.
                                <span className="block mt-1">Rezervacija je finalna nakon potvrde uplate.</span>
                            </p>
                        </form>
                    </>
                )}
            </motion.div>
        </motion.div>
    );
}
