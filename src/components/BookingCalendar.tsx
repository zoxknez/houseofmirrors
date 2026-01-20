"use client";

import { useState, useEffect } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { format, differenceInDays, addDays, isBefore, isAfter } from "date-fns";
import { sr } from "date-fns/locale";
import { motion } from "framer-motion";
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
        <section id="booking" className="section">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="section-title">
                        <span className="gold-text">Rezervacija</span>
                    </h2>
                    <p className="section-subtitle">
                        Izaberite datume i broj gostiju za vaš boravak
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Calendar */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-2"
                    >
                        <div className="glass-card p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Calendar className="w-6 h-6 text-[var(--accent)]" />
                                <h3 className="text-xl font-semibold text-white">
                                    Izaberite datume
                                </h3>
                            </div>

                            {loading ? (
                                <div className="flex items-center justify-center py-20">
                                    <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin" />
                                </div>
                            ) : (
                                <div className="flex justify-center">
                                    <DayPicker
                                        mode="range"
                                        selected={dateRange}
                                        onSelect={setDateRange}
                                        disabled={disabledDays}
                                        locale={sr}
                                        numberOfMonths={2}
                                        showOutsideDays={false}
                                        classNames={{
                                            root: "text-white",
                                            month: "mx-2",
                                            caption_label: "text-lg font-semibold text-white",
                                            nav_button: "text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-lg",
                                            head_cell: "text-white/50 font-normal text-sm w-10",
                                            cell: "text-center p-0",
                                            day: "w-10 h-10 text-white hover:bg-white/10 rounded-lg transition-colors",
                                            day_selected: "bg-[var(--accent)] text-white hover:bg-[var(--accent)]",
                                            day_range_middle: "bg-[var(--accent)]/20 rounded-none",
                                            day_range_start: "bg-[var(--accent)] rounded-l-lg rounded-r-none",
                                            day_range_end: "bg-[var(--accent)] rounded-r-lg rounded-l-none",
                                            day_disabled: "text-white/20 cursor-not-allowed line-through",
                                            day_today: "border border-[var(--gold)]"
                                        }}
                                        footer={
                                            <div className="mt-6 pt-4 border-t border-white/10">
                                                <div className="flex flex-wrap gap-4 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-4 h-4 rounded bg-[var(--accent)]"></div>
                                                        <span className="text-white/60">Izabrano</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-4 h-4 rounded bg-white/10 line-through"></div>
                                                        <span className="text-white/60">Zauzeto</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-4 h-4 rounded border border-[var(--gold)]"></div>
                                                        <span className="text-white/60">Danas</span>
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
                        transition={{ duration: 0.6 }}
                    >
                        <div className="glass-card p-6 sticky top-24">
                            {/* Price Header */}
                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="text-3xl font-bold text-white">
                                    €{pricing.basePrice}
                                </span>
                                <span className="text-white/60">/ noć</span>
                            </div>

                            {/* Selected Dates */}
                            <div className="space-y-4 mb-6">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                                        <p className="text-xs text-white/50 mb-1">CHECK-IN</p>
                                        <p className="text-white font-medium">
                                            {dateRange?.from
                                                ? format(dateRange.from, "d. MMM yyyy", { locale: sr })
                                                : "Izaberite"}
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                                        <p className="text-xs text-white/50 mb-1">CHECK-OUT</p>
                                        <p className="text-white font-medium">
                                            {dateRange?.to
                                                ? format(dateRange.to, "d. MMM yyyy", { locale: sr })
                                                : "Izaberite"}
                                        </p>
                                    </div>
                                </div>

                                {/* Guests */}
                                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                                    <p className="text-xs text-white/50 mb-2">GOSTI</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-5 h-5 text-white/60" />
                                            <span className="text-white">{guests} gosta</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setGuests(Math.max(1, guests - 1))}
                                                className="w-8 h-8 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                                            >
                                                -
                                            </button>
                                            <button
                                                onClick={() => setGuests(Math.min(details.maxGuests, guests + 1))}
                                                className="w-8 h-8 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            {nights > 0 && (
                                <div className="space-y-3 py-4 border-y border-white/10 mb-6">
                                    <div className="flex justify-between text-white/70">
                                        <span>€{pricing.basePrice} x {nights} noći</span>
                                        <span>€{subtotal}</span>
                                    </div>
                                    <div className="flex justify-between text-white/70">
                                        <span>Čišćenje</span>
                                        <span>€{cleaningFee}</span>
                                    </div>
                                    <div className="flex justify-between text-white font-semibold text-lg pt-2">
                                        <span>Ukupno</span>
                                        <span className="gold-text">€{total}</span>
                                    </div>
                                </div>
                            )}

                            {/* Book Button */}
                            <button
                                onClick={() => setShowForm(true)}
                                disabled={!dateRange?.from || !dateRange?.to || nights < pricing.minNights}
                                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {nights < pricing.minNights && nights > 0
                                    ? `Minimum ${pricing.minNights} noći`
                                    : "Rezerviši"}
                            </button>

                            {/* Min nights notice */}
                            <p className="text-center text-white/50 text-sm mt-4">
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
