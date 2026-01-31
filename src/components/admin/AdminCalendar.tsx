"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    addDays,
    parse,
    startOfDay,
    subDays,
    isWithinInterval,
} from "date-fns";
import { sr } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus, X, Loader2, Trash2, Calendar as CalendarIcon } from "lucide-react";
import type { Booking, BlockedDate, BookingStatus } from "@/types";

interface AdminCalendarProps {
    bookings: Booking[];
    blockedDates: BlockedDate[];
    onAddBlock: (startDate: string, endDate: string, reason?: string) => Promise<void>;
    onRemoveBlock: (id: string) => Promise<void>;
}

type DayStatus =
    | { type: BookingStatus; booking: Booking }
    | { type: "blocked"; blocked: BlockedDate };

const weekDays = ["Pon", "Uto", "Sre", "Čet", "Pet", "Sub", "Ned"];

function dayKey(d: Date) {
    return format(d, "yyyy-MM-dd");
}

function parseYMD(dateStr: string) {
    return startOfDay(parse(dateStr, "yyyy-MM-dd", new Date()));
}

export function AdminCalendar({
    bookings,
    blockedDates,
    onAddBlock,
    onRemoveBlock,
}: AdminCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const [selectedRange, setSelectedRange] = useState<{
        start: Date | null;
        end: Date | null;
    }>({
        start: null,
        end: null,
    });

    const [showBlockModal, setShowBlockModal] = useState(false);
    const [blockReason, setBlockReason] = useState("");
    const [loading, setLoading] = useState(false);

    // Quick remove (ako klikneš blokiran dan)
    const [selectedBlocked, setSelectedBlocked] = useState<BlockedDate | null>(null);

    // Grid: uvek pun (pon–ned), sa outside month danima
    const gridDays = useMemo(() => {
        const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
        const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
        return eachDayOfInterval({ start, end });
    }, [currentMonth]);

    // Status mapa: O(ukupno_dana_u_bookingovima + ukupno_dana_u_blokadama)
    const statusByDay = useMemo(() => {
        const map = new Map<string, DayStatus>();

        // Bookings: checkOut dan se tipično NE računa kao zauzet (checkout je slobodan)
        for (const b of bookings) {
            if (b.status === "cancelled") continue;

            const start = parseYMD(b.checkIn);
            const endExclusive = parseYMD(b.checkOut);
            const lastOccupied = subDays(endExclusive, 1);

            if (lastOccupied < start) continue;

            for (let d = start; d <= lastOccupied; d = addDays(d, 1)) {
                map.set(dayKey(d), { type: b.status, booking: b });
            }
        }

        // Blocked: inclusivno
        for (const blk of blockedDates) {
            const start = parseYMD(blk.startDate);
            const end = parseYMD(blk.endDate);

            for (let d = start; d <= end; d = addDays(d, 1)) {
                const k = dayKey(d);
                if (!map.has(k)) {
                    map.set(k, { type: "blocked", blocked: blk });
                }
            }
        }

        return map;
    }, [bookings, blockedDates]);

    const isInSelectedRange = (date: Date) => {
        if (!selectedRange.start) return false;
        if (!selectedRange.end) return isSameDay(date, selectedRange.start);
        return isWithinInterval(date, {
            start: selectedRange.start,
            end: selectedRange.end,
        });
    };

    const isRangeFree = (start: Date, end: Date) => {
        for (let d = start; d <= end; d = addDays(d, 1)) {
            if (statusByDay.has(dayKey(d))) return false;
        }
        return true;
    };

    const handleDayClick = (date: Date) => {
        const k = dayKey(date);
        const status = statusByDay.get(k);

        // Ako klikneš na blocked dan -> ponudi remove
        if (status?.type === "blocked") {
            setSelectedBlocked(status.blocked);
            return;
        }

        // Ako je booking dan, ne dozvoli selekciju
        if (status && (status.type === "pending" || status.type === "confirmed" || status.type === "completed")) {
            return;
        }

        // Range selection
        if (!selectedRange.start || selectedRange.end) {
            setSelectedBlocked(null);
            setSelectedRange({ start: date, end: null });
            return;
        }

        const start = date < selectedRange.start ? date : selectedRange.start;
        const end = date < selectedRange.start ? selectedRange.start : date;

        // Ne dozvoli range preko zauzetih dana
        if (!isRangeFree(start, end)) {
            // samo resetuj na novu start tačku
            setSelectedRange({ start: date, end: null });
            return;
        }

        setSelectedRange({ start, end });
        setSelectedBlocked(null);
        setShowBlockModal(true);
    };

    const handleBlockSubmit = async () => {
        if (!selectedRange.start || !selectedRange.end) return;

        setLoading(true);
        try {
            await onAddBlock(
                format(selectedRange.start, "yyyy-MM-dd"),
                format(selectedRange.end, "yyyy-MM-dd"),
                blockReason || undefined
            );

            setSelectedRange({ start: null, end: null });
            setBlockReason("");
            setShowBlockModal(false);
        } catch (err) {
            console.error("Failed to add block:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveSelectedBlock = async () => {
        if (!selectedBlocked) return;
        setLoading(true);
        try {
            await onRemoveBlock(selectedBlocked.id);
            setSelectedBlocked(null);
        } catch (err) {
            console.error("Failed to remove block:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#0A0A0A]/50 backdrop-blur-xl rounded-2xl p-6 lg:p-8 xl:p-10 border border-white/5 shadow-2xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-tight">
                        {format(currentMonth, "LLLL yyyy", { locale: sr })}
                    </h2>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-1">
                        Upravljanje dostupnošću
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                        className="p-2.5 hover:bg-white/5 rounded-xl border border-white/5 transition-all group"
                        aria-label="Prethodni mesec"
                    >
                        <ChevronLeft className="w-5 h-5 text-white/40 group-hover:text-white" />
                    </button>

                    <button
                        onClick={() => setCurrentMonth(new Date())}
                        className="px-4 py-2 text-xs font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                    >
                        Danas
                    </button>

                    <button
                        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                        className="p-2.5 hover:bg-white/5 rounded-xl border border-white/5 transition-all group"
                        aria-label="Sledeći mesec"
                    >
                        <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white" />
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto -mx-4 px-4 pb-2">
                <div className="min-w-[680px] lg:min-w-full">
                    {/* Week days */}
                    <div className="grid grid-cols-7 gap-1 md:gap-2 mb-4">
                        {weekDays.map((d) => (
                            <div key={d} className="text-center text-[10px] md:text-xs font-black text-white/30 uppercase tracking-widest py-2">
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-1.5 md:gap-2">
                        {gridDays.map((day) => {
                            const k = dayKey(day);
                            const status = statusByDay.get(k);
                            const outside = !isSameMonth(day, currentMonth);
                            const isSelected = isInSelectedRange(day);
                            const isToday = isSameDay(day, new Date());

                            const disabled =
                                !!status && status.type !== "blocked"; // bookings disabled for range selection
                            const blocked = status?.type === "blocked";

                            let bgClass = "bg-white/[0.02] hover:bg-white/[0.05]";
                            let textClass = outside ? "text-white/20" : "text-white/60";
                            let borderClass = "border-white/5";

                            if (status) {
                                borderClass = "border-transparent";
                                if (status.type === "pending") {
                                    bgClass = "bg-[var(--gold)]/10";
                                    textClass = "text-[var(--gold)] font-bold";
                                }
                                if (status.type === "confirmed") {
                                    bgClass = "bg-emerald-500/10";
                                    textClass = "text-emerald-400 font-bold";
                                }
                                if (status.type === "completed") {
                                    bgClass = "bg-blue-500/10";
                                    textClass = "text-blue-400 font-bold";
                                }
                                if (status.type === "blocked") {
                                    bgClass = "bg-red-500/10";
                                    textClass = "text-red-400 font-bold";
                                }
                            }

                            if (isSelected) {
                                bgClass = "bg-[var(--gold)]/20";
                                borderClass = "border-[var(--gold)]/30";
                                textClass = "text-[var(--gold)] font-black";
                            }

                            if (isToday && !isSelected && !status) {
                                borderClass = "border-[var(--gold)]/50";
                                textClass = "text-[var(--gold)] font-black";
                            }

                            return (
                                <button
                                    key={k}
                                    onClick={() => handleDayClick(day)}
                                    disabled={disabled}
                                    className={[
                                        "aspect-square rounded-xl md:rounded-2xl relative group transition-all border flex flex-col items-center justify-center gap-1",
                                        bgClass,
                                        textClass,
                                        borderClass,
                                        disabled ? "opacity-40 cursor-not-allowed" : "",
                                    ].join(" ")}
                                    aria-label={`Dan ${format(day, "d. MMM", { locale: sr })}`}
                                >
                                    <span className="text-sm md:text-base tracking-tighter">{format(day, "d")}</span>

                                    {isToday && (
                                        <div className="w-1 h-1 bg-[var(--gold)] rounded-full shadow-[0_0_8px_var(--gold)]" />
                                    )}

                                    {/* Tooltip (desktop hover) */}
                                    {status && (
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-[#1A1A1A] border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-20 shadow-2xl">
                                            {status.type === "blocked"
                                                ? `Blokirano: ${status.blocked.reason || "Nije dostupno"}`
                                                : `${status.booking.firstName} ${status.booking.lastName}`}
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#1A1A1A]" />
                                        </div>
                                    )}

                                    {/* tiny badge hint */}
                                    {blocked && <div className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-red-400 animate-pulse" />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 pt-8 border-t border-white/5">
                {[
                    { label: "Na čekanju", color: "bg-[var(--gold)]/40" },
                    { label: "Potvrđeno", color: "bg-emerald-500/40" },
                    { label: "Završeno", color: "bg-blue-500/40" },
                    { label: "Blokirano", color: "bg-red-500/40" },
                ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{item.label}</span>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {/* Quick Remove Block Modal */}
                {selectedBlocked && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4"
                        onClick={() => setSelectedBlocked(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0A0A0A] rounded-[32px] p-8 max-w-md w-full border border-white/10 shadow-3xl"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Ukloni blokadu</h3>
                                    <p className="text-[10px] font-black text-[var(--gold)] uppercase tracking-[0.2em] mt-1">
                                        Oslobađanje termina
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedBlocked(null)}
                                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all text-white/40 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 mb-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                                            <CalendarIcon className="w-5 h-5 text-red-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Period</p>
                                            <p className="text-white font-black uppercase tracking-tight">
                                                {format(parseYMD(selectedBlocked.startDate), "d. MMM", { locale: sr })} - {format(parseYMD(selectedBlocked.endDate), "d. MMM yyyy", { locale: sr })}
                                            </p>
                                        </div>
                                    </div>
                                    {selectedBlocked.reason && (
                                        <div className="pt-4 border-t border-white/5">
                                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Razlog</p>
                                            <p className="text-white/60 font-medium">{selectedBlocked.reason}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={handleRemoveSelectedBlock}
                                disabled={loading}
                                className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                                Potvrdi uklanjanje
                            </button>
                        </motion.div>
                    </motion.div>
                )}

                {/* Block Modal */}
                {showBlockModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4"
                        onClick={() => setShowBlockModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0A0A0A] rounded-[32px] p-8 max-w-md w-full border border-white/10 shadow-3xl"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Blokiraj datume</h3>
                                    <p className="text-[10px] font-black text-[var(--gold)] uppercase tracking-[0.2em] mt-1">
                                        Onemogućavanje rezervacija
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowBlockModal(false)}
                                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all text-white/40 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
                                            <CalendarIcon className="w-5 h-5 text-[var(--gold)]" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Izabrani period</p>
                                            <p className="text-white font-black uppercase tracking-tight">
                                                {selectedRange.start && format(selectedRange.start, "d. MMM", { locale: sr })} -{" "}
                                                {selectedRange.end && format(selectedRange.end, "d. MMM yyyy", { locale: sr })}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3 ml-1">
                                        Razlog (opciono)
                                    </label>
                                    <input
                                        type="text"
                                        value={blockReason}
                                        onChange={(e) => setBlockReason(e.target.value)}
                                        placeholder="npr. Održavanje, Privatna upotreba..."
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/50 transition-all font-medium"
                                    />
                                </div>

                                <button
                                    onClick={handleBlockSubmit}
                                    disabled={loading}
                                    className="w-full py-4 bg-[var(--gold)] hover:bg-[var(--gold)]/90 text-black font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                                    Blokiraj termine
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
