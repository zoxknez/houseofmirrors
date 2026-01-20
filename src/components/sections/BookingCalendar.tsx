"use client";

import { useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { srLatn } from "date-fns/locale";
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

const dayPickerClassNames = {
    months: "flex flex-col xl:flex-row gap-12 xl:gap-24 justify-center",
    month: "space-y-8",
    month_caption: "flex justify-center relative items-center mb-8",
    caption_label: "text-xl font-black uppercase tracking-widest text-white",
    nav: "flex items-center gap-4",
    button_previous:
        "absolute left-0 inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/10 text-white hover:bg-[var(--gold)] hover:text-black transition-all",
    button_next:
        "absolute right-0 inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/10 text-white hover:bg-[var(--gold)] hover:text-black transition-all",
    month_grid: "w-full border-collapse",
    weekdays: "flex justify-between mb-4",
    weekday: "text-white/20 font-bold text-[10px] uppercase tracking-[0.2em] w-12 text-center",
    week: "flex w-full mt-2 justify-between",
    day: "relative p-0",
    day_button:
        "h-12 w-12 flex items-center justify-center text-sm font-black text-white/70 hover:bg-[var(--gold)] hover:text-black rounded-xl transition-all duration-300",
    selected: "!bg-[var(--gold)] !text-black !opacity-100",
    range_middle: "!bg-[var(--gold)]/10 !text-[var(--gold)] !rounded-none",
    range_start: "!bg-[var(--gold)] !text-black rounded-l-xl rounded-r-none",
    range_end: "!bg-[var(--gold)] !text-black rounded-r-xl rounded-l-none",
    disabled: "text-white/5 cursor-not-allowed opacity-20",
    today:
        "after:content-[''] after:absolute after:bottom-2 after:w-1 after:h-1 after:bg-[var(--gold)] after:rounded-full",
};

export function BookingCalendar() {
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [showForm, setShowForm] = useState(false);
    const [guests, setGuests] = useState(2);

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

    return (
        <section id="booking" className="relative py-24 md:py-40 bg-black overflow-hidden">
            <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-[var(--gold)]/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-6 md:px-10 relative z-10">
                <SectionHeader
                    badge="Rezervacija"
                    title={
                        <>
                            Osigurajte Vaš <span className="text-[var(--gold)]">Boravak</span>
                        </>
                    }
                    subtitle="Izaberite datume i broj gostiju za vaš nezaboravan odmor"
                />

                <div className="grid lg:grid-cols-3 gap-12 max-w-7xl mx-auto items-start">
                    {/* Calendar */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-2"
                    >
                        <GlassCard className="p-6 md:p-12 min-h-[600px]">
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
                                        classNames={dayPickerClassNames}
                                    />
                                </div>
                            )}
                        </GlassCard>
                    </motion.div>

                    {/* Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <GlassCard className="p-8 md:p-10 sticky top-32">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
                                    <CreditCard className="w-6 h-6 text-[var(--gold)]" />
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black text-white">€{pricing.basePrice}</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                                        / noć
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-5 rounded-[24px] bg-white/[0.03] border border-white/10">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--gold)] mb-2">Dolazak</p>
                                        <p className="text-white font-black uppercase tracking-tight">
                                            {dateRange?.from ? format(dateRange.from, "d. MMM", { locale: srLatn }) : "Izaberite"}
                                        </p>
                                    </div>
                                    <div className="p-5 rounded-[24px] bg-white/[0.03] border border-white/10">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--gold)] mb-2">Odlazak</p>
                                        <p className="text-white font-black uppercase tracking-tight">
                                            {dateRange?.to ? format(dateRange.to, "d. MMM", { locale: srLatn }) : "Izaberite"}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-5 rounded-[24px] bg-white/[0.03] border border-white/10">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--gold)] mb-4">Broj gostiju</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-white font-black uppercase tracking-tight">
                                            <Users className="w-5 h-5 text-[var(--gold)]" />
                                            <span>{guests} {guests === 1 ? "Gost" : "Gosta"}</span>
                                        </div>
                                        <Counter value={guests} min={1} max={details.maxGuests} onChange={setGuests} />
                                    </div>
                                </div>
                            </div>

                            {nights > 0 ? (
                                <div className="space-y-4 py-6 border-y border-white/5 mb-8">
                                    <div className="flex justify-between text-sm font-bold text-white/40 uppercase tracking-tight">
                                        <span>€{pricing.basePrice} x {nights} noći</span>
                                        <span className="text-white">€{totals.subtotal}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-bold text-white/40 uppercase tracking-tight">
                                        <span>Čišćenje</span>
                                        <span className="text-white">€{totals.cleaningFee}</span>
                                    </div>
                                    <div className="flex justify-between items-end pt-2">
                                        <span className="text-xs font-black uppercase tracking-[0.2em] text-white">UKUPNO</span>
                                        <span className="text-3xl font-black text-[var(--gold)] tracking-tighter">€{totals.total}</span>
                                    </div>
                                </div>
                            ) : null}

                            <PrimaryButton
                                onClick={() => setShowForm(true)}
                                disabled={!canBook}
                            >
                                {!dateRange?.from || !dateRange?.to
                                    ? "Izaberite datume"
                                    : nights < pricing.minNights
                                        ? `Min. ${pricing.minNights} noći`
                                        : "Rezerviši"}
                            </PrimaryButton>

                            <p className="text-center text-[10px] font-black uppercase tracking-widest text-white/20 mt-6">
                                Minimalan boravak: {pricing.minNights} noći
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
