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
        <section id="contact" className="section bg-[var(--primary)]/50">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                    className="text-center mb-16"
                >
                    <p className="text-[var(--accent)] text-xs font-black uppercase tracking-[0.4em] mb-4">Kontakt</p>
                    <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">
                        Budimo u <span className="opacity-40">kontaktu</span>
                    </h2>
                </motion.div>

                <div className="grid lg:grid-cols-5 gap-10 max-w-6xl mx-auto">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        <div className="deluxe-card p-10 space-y-8">
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
                                Detalji
                            </h3>

                            <div className="space-y-8">
                                <div className="flex items-start gap-6 group">
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--accent)]/10 transition-colors border border-white/10 group-hover:border-[var(--accent)]/30">
                                        <MapPin className="w-6 h-6 text-white group-hover:text-[var(--accent)] transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Lokacija</p>
                                        <p className="text-white font-bold leading-tight">
                                            {propertyData.location.address}<br />
                                            {propertyData.location.city}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 group">
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--accent)]/10 transition-colors border border-white/10 group-hover:border-[var(--accent)]/30">
                                        <Phone className="w-6 h-6 text-white group-hover:text-[var(--accent)] transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Pozovite nas</p>
                                        <a href="tel:+381600000000" className="text-white font-bold hover:text-[var(--accent)] transition-colors">
                                            +381 60 777 777
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 group">
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--accent)]/10 transition-colors border border-white/10 group-hover:border-[var(--accent)]/30">
                                        <Mail className="w-6 h-6 text-white group-hover:text-[var(--accent)] transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Email</p>
                                        <a href="mailto:info@houseofmirrors.rs" className="text-white font-bold hover:text-[var(--accent)] transition-colors">
                                            hello@houseofmirrors.rs
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Host Info */}
                        <div className="deluxe-card p-10">
                            <div className="flex items-center gap-6 mb-8">
                                <div className="relative">
                                    <div className="w-20 h-20 rounded-[24px] bg-gradient-to-br from-[var(--accent)] to-[#ff004c] flex items-center justify-center text-white text-3xl font-black">
                                        {propertyData.host.name[0]}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-black rounded-full" />
                                </div>
                                <div>
                                    <p className="text-white text-2xl font-black tracking-tight">{propertyData.host.name}</p>
                                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Premium Host</p>
                                </div>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                <p className="text-white/70 text-sm font-bold leading-relaxed italic">
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
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-3"
                    >
                        <div className="glass-card p-6 md:p-8">
                            <h3 className="text-xl font-semibold text-white mb-6">
                                Pošaljite poruku
                            </h3>

                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 p-4 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center gap-3"
                                >
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <p className="text-green-300">Poruka je uspešno poslata!</p>
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-white/70 mb-2">
                                            Ime i prezime
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--accent)] transition-colors"
                                            placeholder="Vaše ime"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/70 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--accent)] transition-colors"
                                            placeholder="vas@email.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-white/70 mb-2">
                                        Tema
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--accent)] transition-colors"
                                        placeholder="O čemu se radi?"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-white/70 mb-2">
                                        Poruka
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--accent)] transition-colors resize-none"
                                        placeholder="Napišite vašu poruku..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
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
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
