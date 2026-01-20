"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, CheckCircle, Phone, Mail, MapPin, Clock } from "lucide-react";
import { propertyData } from "@/data/property";

export function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate sending
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setLoading(false);

        setTimeout(() => setSuccess(false), 5000);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <section id="contact" className="section bg-black relative overflow-hidden py-24 md:py-32">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 bg-[var(--gold)]/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="container relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20 md:mb-32"
                >
                    {/* Badge with lines */}
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="h-px flex-1 max-w-[80px] md:max-w-[120px] bg-gradient-to-r from-transparent to-[var(--gold)]/50" />
                        <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-[var(--gold)]">
                            Kontakt
                        </span>
                        <div className="h-px flex-1 max-w-[80px] md:max-w-[120px] bg-gradient-to-l from-transparent to-[var(--gold)]/50" />
                    </div>

                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-white mb-6">
                        Budimo u <span className="text-[var(--gold)]">kontaktu</span>
                    </h2>
                    <p className="text-sm md:text-base text-white/50 max-w-2xl mx-auto">
                        Tu smo da odgovorimo na sva vaša pitanja i zahteve
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-5 gap-16 md:gap-24 max-w-7xl mx-auto items-start">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-2 space-y-10"
                    >
                        <div className="bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-[40px] p-10 md:p-12 space-y-10 group hover:border-[var(--gold)]/20 transition-all duration-500">
                            <h3 className="text-sm md:text-base font-black uppercase tracking-[0.3em] text-white/40 mb-2">
                                Detalji
                            </h3>

                            <div className="space-y-10">
                                <div className="flex items-start gap-8 group/item">
                                    <div className="w-16 h-16 rounded-full bg-[var(--gold)]/10 flex items-center justify-center flex-shrink-0 border border-[var(--gold)]/20 group-hover/item:scale-110 group-hover/item:bg-[var(--gold)]/20 transition-all duration-500">
                                        <MapPin className="w-6 h-6 text-[var(--gold)]" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--gold)] mb-2">Lokacija</p>
                                        <p className="text-lg md:text-xl font-black uppercase tracking-tight text-white leading-tight">
                                            {propertyData.location.address}<br />
                                            <span className="text-white/40">{propertyData.location.city}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-8 group/item">
                                    <div className="w-16 h-16 rounded-full bg-[var(--gold)]/10 flex items-center justify-center flex-shrink-0 border border-[var(--gold)]/20 group-hover/item:scale-110 group-hover/item:bg-[var(--gold)]/20 transition-all duration-500">
                                        <Phone className="w-6 h-6 text-[var(--gold)]" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--gold)] mb-2">Pozovite nas</p>
                                        <a href="tel:+38160777777" className="text-lg md:text-xl font-black uppercase tracking-tight text-white hover:text-[var(--gold)] transition-colors">
                                            +381 60 777 777
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-8 group/item">
                                    <div className="w-16 h-16 rounded-full bg-[var(--gold)]/10 flex items-center justify-center flex-shrink-0 border border-[var(--gold)]/20 group-hover/item:scale-110 group-hover/item:bg-[var(--gold)]/20 transition-all duration-500">
                                        <Mail className="w-6 h-6 text-[var(--gold)]" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--gold)] mb-2">Email</p>
                                        <a href="mailto:hello@houseofmirrors.rs" className="text-lg md:text-xl font-black uppercase tracking-tight text-white hover:text-[var(--gold)] transition-colors break-all">
                                            hello@houseofmirrors.rs
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Host Info */}
                        <div className="bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-[40px] p-10 md:p-12 hover:border-[var(--gold)]/20 transition-all duration-500">
                            <div className="flex items-center gap-6 mb-10">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-[var(--gold)] to-[var(--gold)]/40 flex items-center justify-center text-black text-4xl font-black shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                                        {propertyData.host.name[0]}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 border-4 border-black rounded-full shadow-lg" />
                                </div>
                                <div>
                                    <p className="text-white text-3xl font-black uppercase tracking-tighter mb-1">{propertyData.host.name}</p>
                                    <p className="text-[var(--gold)] text-xs font-black uppercase tracking-[0.3em]">Premium Host</p>
                                </div>
                            </div>
                            <div className="bg-[var(--gold)]/5 border border-[var(--gold)]/10 p-6 rounded-[24px]">
                                <p className="text-white/60 text-sm font-bold leading-relaxed italic text-center">
                                    "Odgovaramo {propertyData.host.responseTime} sa {propertyData.host.responseRate} preciznosti."
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-3"
                    >
                        <div className="bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-[40px] p-8 md:p-16">
                            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-white/40 mb-12">
                                Pošaljite poruku
                            </h3>

                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mb-10 p-6 rounded-[24px] bg-green-500/10 border border-green-500/20 flex items-center gap-4"
                                >
                                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                                    <p className="text-green-400 font-bold">Poruka je uspešno poslata! Javićemo vam se uskoro.</p>
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid sm:grid-cols-2 gap-8">
                                    <div className="group">
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-4 ml-1">
                                            Ime i prezime
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-6 py-4 rounded-[20px] bg-white/[0.03] border border-white/10 text-white font-bold placeholder:text-white/10 focus:outline-none focus:border-[var(--gold)] focus:bg-white/[0.05] transition-all duration-300"
                                            placeholder="Petar Petrović"
                                        />
                                    </div>
                                    <div className="group">
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-4 ml-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-6 py-4 rounded-[20px] bg-white/[0.03] border border-white/10 text-white font-bold placeholder:text-white/10 focus:outline-none focus:border-[var(--gold)] focus:bg-white/[0.05] transition-all duration-300"
                                            placeholder="petar@email.com"
                                        />
                                    </div>
                                </div>

                                <div className="group">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-4 ml-1">
                                        Tema
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-6 py-4 rounded-[20px] bg-white/[0.03] border border-white/10 text-white font-bold placeholder:text-white/10 focus:outline-none focus:border-[var(--gold)] focus:bg-white/[0.05] transition-all duration-300"
                                        placeholder="Upit za rezervaciju"
                                    />
                                </div>

                                <div className="group">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-4 ml-1">
                                        Poruka
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        className="w-full px-6 py-4 rounded-[30px] bg-white/[0.03] border border-white/10 text-white font-bold placeholder:text-white/10 focus:outline-none focus:border-[var(--gold)] focus:bg-white/[0.05] transition-all duration-300 resize-none"
                                        placeholder="Napišite vašu poruku..."
                                    />
                                </div>

                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-18 py-5 rounded-full bg-[var(--gold)] text-black font-black uppercase tracking-[0.3em] text-sm hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:hover:scale-100 transition-all duration-300 shadow-[0_0_30px_rgba(212,175,55,0.2)] flex items-center justify-center gap-3"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Šaljem...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                Pošalji poruku
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
