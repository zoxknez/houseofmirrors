"use client";

import { useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { srLatn, enUS } from "date-fns/locale";
import { motion } from "framer-motion";
import { Calendar, Users, CreditCard, Loader2 } from "lucide-react";
import "react-day-picker/style.css";

import { propertyData } from "@/data/property";
import { BookingForm } from "./BookingForm";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Counter } from "@/components/ui/Counter";
import { useAvailability } from "@/hooks/useAvailability";
import { calcNights, calcTotals, makeDisabledDays } from "@/lib/booking";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useLanguage } from "@/context/LanguageContext";

const dayPickerClassNames = {
    root: "w-full",
    months: "w-full flex flex-col lg:flex-row gap-8 lg:gap-10 justify-center items-start",
    month: "w-full max-w-[360px] lg:max-w-[420px] space-y-6 lg:space-y-8",
    month_caption: "relative flex items-center justify-center mb-4 lg:mb-6 px-2",
    caption_label: "text-base lg:text-xl font-black uppercase tracking-widest text-white",
    nav: "absolute inset-x-0 flex items-center justify-between z-10",
    button_previous:
        "inline-flex items-center justify-center h-10 w-10 rounded-full bg-[var(--gold)] !text-black hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)]",
    button_next:
        "inline-flex items-center justify-center h-10 w-10 rounded-full bg-[var(--gold)] !text-black hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)]",

    month_grid: "w-full border-collapse",
    weekdays: "flex justify-between mb-2 lg:mb-4",
    weekday: "text-white/20 font-bold text-[10px] uppercase tracking-[0.2em] w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center",
    week: "flex w-full mt-1 lg:mt-2 justify-between",
    day: "relative p-0",

    day_button:
        "h-10 w-10 lg:h-12 lg:w-12 flex items-center justify-center text-xs lg:text-sm font-black " +
        "text-white/70 hover:bg-[var(--gold)] hover:text-black rounded-xl transition-all duration-300 touch-manipulation",

    outside: "text-white/20 opacity-30",
    selected: "!bg-[var(--gold)] !text-black !opacity-100",
    range_middle: "!bg-[var(--gold)]/10 !text-[var(--gold)] !rounded-none",
    range_start: "!bg-[var(--gold)] !text-black rounded-l-xl rounded-r-none",
    range_end: "!bg-[var(--gold)] !text-black rounded-r-xl rounded-l-none",
    disabled: "text-white/5 cursor-not-allowed opacity-20",
    today:
        "after:content-[''] after:absolute after:bottom-2 after:w-1 after:h-1 after:bg-[var(--gold)] after:rounded-full",
};

export function BookingCalendar() {
    const { dict, language } = useLanguage();
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [showForm, setShowForm] = useState(false);
    const [guests, setGuests] = useState(2);
    const isDesktop = useMediaQuery("(min-width: 1024px)");

    const { pricing, details } = propertyData;
    const { bookedDates, loading, refresh } = useAvailability();

    const nights = useMemo(() => calcNights(dateRange), [dateRange]);
    const totals = useMemo(
        () => calcTotals(nights, pricing.basePrice, pricing.cleaningFee),
        [nights, pricing.basePrice, pricing.cleaningFee]
    );

    const disabledDays = useMemo(() => makeDisabledDays(bookedDates), [bookedDates]);

    const canBook =
        !!dateRange?.from && !!dateRange?.to && nights >= pricing.minNights;

    // Helper for simple labels I didn't verify in dictionary yet.
    // Ideally I should update dictionary but using map here is safer for now.
    const t = {
        book: dict.booking.title,
        secure: language === "sr" ? "Osigurajte Vaš" : "Secure Your",
        stay: language === "sr" ? "Boravak" : "Stay",
        selectDates: dict.booking.selectDates,
        pricePerNight: dict.booking.pricePerNight,
        arrival: language === "sr" ? "Dolazak" : "Check-in",
        departure: language === "sr" ? "Odlazak" : "Check-out",
        guests: language === "sr" ? "Broj gostiju" : "Guests",
        guest: language === "sr" ? "Gost" : "Guest",
        guestsPlural: language === "sr" ? "Gosta" : "Guests", // "Gosta" is paucal, "Gostiju" genitive pl. "Guests" is fine.
        total: dict.booking.total,
        cleaning: dict.booking.cleaningFee,
        minStay: (n: number) => language === "sr" ? `Min. ${n} noći` : `Min. ${n} nights`,
        minStayLabel: language === "sr" ? "Minimalan boravak" : "Minimum stay",
        nights: language === "sr" ? "noći" : "nights",
    };

    const dateLocale = language === "sr" ? srLatn : enUS;

    return (
        <section id="booking" className="relative py-20 md:py-32 bg-black overflow-hidden content-visible">
            <div
                aria-hidden="true"
                className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-[var(--gold)]/5 rounded-full blur-[150px] pointer-events-none"
            />

            <div className="max-w-[1400px] mx-auto px-6 md:px-10 relative z-10">
                <SectionHeader
                    badge={t.book}
                    title={
                        <>
                            {t.secure} <span className="text-[var(--gold)]">{t.stay}</span>
                        </>
                    }
                    subtitle={dict.booking.subtitle}
                />

                <div className="grid lg:grid-cols-3 gap-10 max-w-7xl mx-auto items-start">
                    {/* Calendar */}
                    <motion.div
                        initial={{ opacity: 0, x: isDesktop ? -30 : 0 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-2"
                    >
                        <GlassCard className="p-6 lg:p-10 min-h-[460px] lg:min-h-[520px]">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-11 h-11 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-[var(--gold)]" />
                                </div>
                                <h3 className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-white">
                                    {t.selectDates}
                                </h3>
                            </div>

                            {loading ? (
                                <div className="flex items-center justify-center py-20">
                                    <Loader2 className="w-8 h-8 text-[var(--gold)] animate-spin" />
                                </div>
                            ) : (
                                <div className="w-full overflow-hidden">
                                    <div className="flex justify-center">
                                        <DayPicker
                                            mode="range"
                                            selected={dateRange}
                                            onSelect={setDateRange}
                                            disabled={disabledDays}
                                            locale={dateLocale}
                                            numberOfMonths={isDesktop ? 2 : 1}
                                            showOutsideDays
                                            pagedNavigation
                                            fixedWeeks
                                            classNames={dayPickerClassNames}
                                        />
                                    </div>
                                </div>
                            )}
                        </GlassCard>
                    </motion.div>

                    {/* Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: isDesktop ? 30 : 0 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <GlassCard className="p-7 md:p-8 lg:sticky lg:top-32">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-11 h-11 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
                                    <CreditCard className="w-5 h-5 text-[var(--gold)]" />
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl md:text-4xl font-black text-white">€{pricing.basePrice}</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                                        {t.pricePerNight}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-[20px] bg-white/[0.03] border border-white/10">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--gold)] mb-2">{t.arrival}</p>
                                        <p className="text-white font-black uppercase tracking-tight">
                                            {dateRange?.from ? format(dateRange.from, "d. MMM", { locale: dateLocale }) : "-"}
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-[20px] bg-white/[0.03] border border-white/10">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--gold)] mb-2">{t.departure}</p>
                                        <p className="text-white font-black uppercase tracking-tight">
                                            {dateRange?.to ? format(dateRange.to, "d. MMM", { locale: dateLocale }) : "-"}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 rounded-[20px] bg-white/[0.03] border border-white/10">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--gold)] mb-4">{t.guests}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-white font-black uppercase tracking-tight">
                                            <Users className="w-5 h-5 text-[var(--gold)]" />
                                            <span>{guests} {guests === 1 ? t.guest : t.guestsPlural}</span>
                                        </div>
                                        <Counter value={guests} min={1} max={details.maxGuests} onChange={setGuests} />
                                    </div>
                                </div>
                            </div>

                            {nights > 0 ? (
                                <div className="space-y-4 py-5 border-y border-white/5 mb-6">
                                    <div className="flex justify-between text-sm font-bold text-white/40 uppercase tracking-tight">
                                        <span>€{pricing.basePrice} x {nights} {t.nights}</span>
                                        <span className="text-white">€{totals.subtotal}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-bold text-white/40 uppercase tracking-tight">
                                        <span>{t.cleaning}</span>
                                        <span className="text-white">€{totals.cleaningFee}</span>
                                    </div>
                                    <div className="flex justify-between items-end pt-2">
                                        <span className="text-xs font-black uppercase tracking-[0.2em] text-white">{t.total}</span>
                                        <span className="text-2xl md:text-3xl font-black text-[var(--gold)] tracking-tighter">€{totals.total}</span>
                                    </div>
                                </div>
                            ) : null}

                            <PrimaryButton
                                type="button"
                                onClick={() => setShowForm(true)}
                                disabled={!canBook}
                            >
                                {!dateRange?.from || !dateRange?.to
                                    ? t.selectDates
                                    : nights < pricing.minNights
                                        ? t.minStay(pricing.minNights)
                                        : dict.booking.bookButton}
                            </PrimaryButton>

                            <p className="text-center text-[10px] font-black uppercase tracking-widest text-white/20 mt-6">
                                {t.minStayLabel}: {pricing.minNights} {t.nights}
                            </p>
                        </GlassCard>
                    </motion.div>
                </div>
            </div>

            {showForm && dateRange?.from && dateRange?.to ? (
                <BookingForm
                    checkIn={dateRange.from}
                    checkOut={dateRange.to}
                    guests={guests}
                    totalPrice={totals.total}
                    onClose={() => setShowForm(false)}
                    onSuccess={async () => {
                        setShowForm(false);
                        setDateRange(undefined);
                        await refresh();
                    }}
                />
            ) : null}
        </section>
    );
}
