"use client";

import { useState, useEffect } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { format, differenceInDays, addDays, isBefore, isAfter } from "date-fns";
import { srLatn } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Users, CreditCard, Loader2 } from "lucide-react";
import "react-day-picker/style.css";

import { propertyData } from "@/data/property";
import { BookingForm } from "./BookingForm";

interface BookedDate {
    start: Date;
    end: Date;
    source: string;
}

export function BookingCalendar() {
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [bookedDates, setBookedDates] = useState<BookedDate[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [guests, setGuests] = useState(2);

    const { pricing, details, rules } = propertyData;

    // Fetch availability
    useEffect(() => {
        async function fetchAvailability() {
            try {
                const res = await fetch("/api/availability");
                if (res.ok) {
                    const data = await res.json();
                    setBookedDates(data.bookedDates || []);
                }
            } catch (error) {
                console.error("Failed to fetch availability:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchAvailability();
    }, []);

    // Check if a date is booked
    const isDateBooked = (date: Date) => {
        return bookedDates.some(
            (booking) =>
                !isBefore(date, new Date(booking.start)) &&
                !isAfter(date, new Date(booking.end))
        );
    };

    // Calculate nights and total price
    const nights =
        dateRange?.from && dateRange?.to
            ? differenceInDays(dateRange.to, dateRange.from)
            : 0;

    const subtotal = nights * pricing.basePrice;
    const cleaningFee = nights > 0 ? pricing.cleaningFee : 0;
    const total = subtotal + cleaningFee;

    // Disable past dates and booked dates
    const disabledDays = [
        { before: new Date() },
        ...bookedDates.map((booking) => ({
            from: new Date(booking.start),
            to: new Date(booking.end)
        }))
    ];

    const handleBookingSuccess = () => {
        setShowForm(false);
        setDateRange(undefined);
        // Refresh availability
        fetch("/api/availability")
            .then((res) => res.json())
            .then((data) => setBookedDates(data.bookedDates || []));
    };

    return (
        <section id="booking" className="section bg-black relative overflow-hidden py-24 md:py-32">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-[var(--gold)]/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="container relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16 md:mb-24"
                >
                    {/* Badge with lines */}
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="h-px flex-1 max-w-[80px] md:max-w-[120px] bg-gradient-to-r from-transparent to-[var(--gold)]/50" />
                        <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-[var(--gold)]">
                            Rezervacija
                        </span>
                        <div className="h-px flex-1 max-w-[80px] md:max-w-[120px] bg-gradient-to-l from-transparent to-[var(--gold)]/50" />
                    </div>

                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-white mb-6">
                        Osigurajte Vaš <span className="text-[var(--gold)]">Boravak</span>
                    </h2>
                    <p className="text-sm md:text-base text-white/50 max-w-2xl mx-auto">
                        Izaberite datume i broj gostiju za vaš nezaboravan odmor
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-12 max-w-7xl mx-auto items-start">
                    {/* Calendar */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-[40px] p-6 md:p-12 min-h-[600px]">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-[var(--gold)]" />
                                </div>
                                <h3 className="text-sm md:text-base font-black uppercase tracking-[0.2em] text-white">
                                    Izaberite datume
                                </h3>
                            </div>

                            {loading ? (
                                <div className="flex items-center justify-center py-20">
                                    <Loader2 className="w-8 h-8 text-[var(--gold)] animate-spin" />
                                </div>
                            ) : (
                                <div className="flex justify-center flex-col items-center">
                                    <DayPicker
                                        mode="range"
                                        selected={dateRange}
                                        onSelect={setDateRange}
                                        disabled={disabledDays}
                                        locale={srLatn}
                                        numberOfMonths={2}
                                        pagedNavigation
                                        classNames={{
                                            months: "flex flex-col xl:flex-row gap-12 xl:gap-24 justify-center",
                                            month: "space-y-8",
                                            month_caption: "flex justify-center relative items-center mb-8",
                                            caption_label: "text-xl font-black uppercase tracking-widest text-white",
                                            nav: "flex items-center gap-4",
                                            button_previous: "absolute left-0 inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/10 text-white hover:bg-[var(--gold)] hover:text-black transition-all",
                                            button_next: "absolute right-0 inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/10 text-white hover:bg-[var(--gold)] hover:text-black transition-all",
                                            month_grid: "w-full border-collapse",
                                            weekdays: "flex justify-between mb-4",
                                            weekday: "text-white/20 font-bold text-[10px] uppercase tracking-[0.2em] w-12 text-center",
                                            week: "flex w-full mt-2 justify-between",
                                            day: "relative p-0",
                                            day_button: "h-12 w-12 flex items-center justify-center text-sm font-black text-white/70 hover:bg-[var(--gold)] hover:text-black rounded-xl transition-all duration-300",
                                            selected: "!bg-[var(--gold)] !text-black !opacity-100",
                                            range_middle: "!bg-[var(--gold)]/10 !text-[var(--gold)] !rounded-none",
                                            range_start: "!bg-[var(--gold)] !text-black rounded-l-xl rounded-r-none",
                                            range_end: "!bg-[var(--gold)] !text-black rounded-r-xl rounded-l-none",
                                            disabled: "text-white/5 cursor-not-allowed opacity-20",
                                            today: "after:content-[''] after:absolute after:bottom-2 after:w-1 after:h-1 after:bg-[var(--gold)] after:rounded-full"
                                        }}
                                        footer={
                                            <div className="mt-10 pt-8 border-t border-white/5 w-full">
                                                <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-widest">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-4 h-4 rounded-md bg-[var(--gold)]"></div>
                                                        <span className="text-white">Izabrano</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-4 h-4 rounded-md bg-white/5 border border-white/10 relative overflow-hidden">
                                                            <div className="absolute inset-0 bg-white/10 -rotate-45 scale-150 transform origin-center" />
                                                        </div>
                                                        <span className="text-white/30">Zauzeto</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-4 h-4 rounded-full bg-[var(--gold)] h-1 w-1"></div>
                                                        <span className="text-[var(--gold)]">Danas</span>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    />
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Booking Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-[40px] p-8 md:p-10 sticky top-32">
                            {/* Price Header */}
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
                                    <CreditCard className="w-6 h-6 text-[var(--gold)]" />
                                </div>
                                <div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-black text-white">€{pricing.basePrice}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">/ noć</span>
                                    </div>
                                </div>
                            </div>

                            {/* Selected Dates */}
                            <div className="space-y-4 mb-8">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-5 rounded-[24px] bg-white/[0.03] border border-white/10 group hover:border-[var(--gold)]/30 transition-all duration-300">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--gold)] mb-2">Dolazak</p>
                                        <p className="text-white font-black uppercase tracking-tight">
                                            {dateRange?.from
                                                ? format(dateRange.from, "d. MMM", { locale: srLatn })
                                                : "Izaberite"}
                                        </p>
                                    </div>
                                    <div className="p-5 rounded-[24px] bg-white/[0.03] border border-white/10 group hover:border-[var(--gold)]/30 transition-all duration-300">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--gold)] mb-2">Odlazak</p>
                                        <p className="text-white font-black uppercase tracking-tight">
                                            {dateRange?.to
                                                ? format(dateRange.to, "d. MMM", { locale: srLatn })
                                                : "Izaberite"}
                                        </p>
                                    </div>
                                </div>

                                {/* Guests */}
                                <div className="p-5 rounded-[24px] bg-white/[0.03] border border-white/10">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--gold)] mb-4">Broj gostiju</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-white font-black uppercase tracking-tight">
                                            <Users className="w-5 h-5 text-[var(--gold)]" />
                                            <span>{guests} {guests === 1 ? 'Gost' : 'Gosta'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setGuests(Math.max(1, guests - 1))}
                                                className="w-10 h-10 rounded-full border border-white/10 text-white hover:bg-[var(--gold)] hover:text-black hover:border-[var(--gold)] transition-all duration-300 font-bold"
                                            >
                                                -
                                            </button>
                                            <button
                                                onClick={() => setGuests(Math.min(details.maxGuests, guests + 1))}
                                                className="w-10 h-10 rounded-full border border-white/10 text-white hover:bg-[var(--gold)] hover:text-black hover:border-[var(--gold)] transition-all duration-300 font-bold"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            {nights > 0 && (
                                <div className="space-y-4 py-6 border-y border-white/5 mb-8">
                                    <div className="flex justify-between text-sm font-bold text-white/40 uppercase tracking-tight">
                                        <span>€{pricing.basePrice} x {nights} noći</span>
                                        <span className="text-white">€{subtotal}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-bold text-white/40 uppercase tracking-tight">
                                        <span>Čišćenje</span>
                                        <span className="text-white">€{cleaningFee}</span>
                                    </div>
                                    <div className="flex justify-between items-end pt-2">
                                        <span className="text-xs font-black uppercase tracking-[0.2em] text-white">UKUPNO</span>
                                        <span className="text-3xl font-black text-[var(--gold)] tracking-tighter">€{total}</span>
                                    </div>
                                </div>
                            )}

                            {/* Book Button */}
                            <button
                                onClick={() => setShowForm(true)}
                                disabled={!dateRange?.from || !dateRange?.to || nights < pricing.minNights}
                                className="w-full h-16 rounded-full bg-[var(--gold)] text-black font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:hover:scale-100 transition-all duration-300 shadow-[0_0_30px_rgba(212,175,55,0.2)]"
                            >
                                {nights < pricing.minNights && nights > 0
                                    ? `Min. ${pricing.minNights} noći`
                                    : "Rezerviši"}
                            </button>

                            {/* Min nights notice */}
                            <p className="text-center text-[10px] font-black uppercase tracking-widest text-white/20 mt-6">
                                Minimalan boravak: {pricing.minNights} noći
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Booking Form Modal */}
            {showForm && dateRange?.from && dateRange?.to && (
                <BookingForm
                    checkIn={dateRange.from}
                    checkOut={dateRange.to}
                    guests={guests}
                    totalPrice={total}
                    onClose={() => setShowForm(false)}
                    onSuccess={handleBookingSuccess}
                />
            )}
        </section>
    );
}
