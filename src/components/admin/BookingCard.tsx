"use client";

import { motion } from "framer-motion";
import { format, parse, differenceInCalendarDays, startOfDay } from "date-fns";
import { sr } from "date-fns/locale";
import {
    CheckCircle,
    XCircle,
    Clock,
    User,
    Mail,
    Phone,
    Calendar,
    Users,
    Euro,
    MoreVertical,
    Loader2,
} from "lucide-react";
import type { Booking, BookingStatus } from "@/types";
import { useEffect, useMemo, useRef, useState } from "react";

interface BookingCardProps {
    booking: Booking;
    onStatusChange: (id: string, status: BookingStatus) => Promise<void>;
}

const statusConfig: Record<
    BookingStatus,
    { label: string; color: string; bgColor: string; ring: string; icon: typeof Clock }
> = {
    pending: {
        label: "Na čekanju",
        color: "text-[var(--gold)]",
        bgColor: "bg-[var(--gold)]/10",
        ring: "ring-1 ring-[var(--gold)]/15",
        icon: Clock,
    },
    confirmed: {
        label: "Potvrđeno",
        color: "text-emerald-300",
        bgColor: "bg-emerald-500/10",
        ring: "ring-1 ring-emerald-500/15",
        icon: CheckCircle,
    },
    cancelled: {
        label: "Otkazano",
        color: "text-red-300",
        bgColor: "bg-red-500/10",
        ring: "ring-1 ring-red-500/15",
        icon: XCircle,
    },
    completed: {
        label: "Završeno",
        color: "text-blue-300",
        bgColor: "bg-blue-500/10",
        ring: "ring-1 ring-blue-500/15",
        icon: CheckCircle,
    },
};

// Bezbedno za YYYY-MM-DD (i generalno stabilnije)
function safeParseDate(value: string) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return startOfDay(parse(value, "yyyy-MM-dd", new Date()));
    }
    const d = new Date(value);
    return startOfDay(d);
}

export function BookingCard({ booking, onStatusChange }: BookingCardProps) {
    const [showActions, setShowActions] = useState(false);
    const [loading, setLoading] = useState(false);

    const menuRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const status = statusConfig[booking.status];
    const StatusIcon = status.icon;

    const checkIn = useMemo(() => safeParseDate(booking.checkIn), [booking.checkIn]);
    const checkOut = useMemo(() => safeParseDate(booking.checkOut), [booking.checkOut]);

    const nights = useMemo(() => {
        const n = differenceInCalendarDays(checkOut, checkIn);
        return Math.max(0, n);
    }, [checkIn, checkOut]);

    const handleStatusChange = async (newStatus: BookingStatus) => {
        setLoading(true);
        setShowActions(false);
        try {
            await onStatusChange(booking.id, newStatus);
        } finally {
            setLoading(false);
        }
    };

    // Close on outside click / ESC
    useEffect(() => {
        if (!showActions) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setShowActions(false);
        };

        const onPointerDown = (e: PointerEvent) => {
            const target = e.target as Node;
            if (menuRef.current?.contains(target)) return;
            if (buttonRef.current?.contains(target)) return;
            setShowActions(false);
        };

        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("pointerdown", onPointerDown);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("pointerdown", onPointerDown);
        };
    }, [showActions]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.03] backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all"
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[var(--gold)] text-black font-black flex items-center justify-center shrink-0">
                        {(booking.firstName?.[0] || "U").toUpperCase()}
                        {(booking.lastName?.[0] || "S").toUpperCase()}
                    </div>

                    <div className="min-w-0">
                        <h3 className="font-bold text-white truncate">
                            {booking.firstName} {booking.lastName}
                        </h3>
                        <p className="text-xs text-white/30 truncate">#{booking.id}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <span
                        className={[
                            "px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1",
                            status.bgColor,
                            status.color,
                            status.ring,
                        ].join(" ")}
                    >
                        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <StatusIcon className="w-3 h-3" />}
                        {status.label}
                    </span>

                    <div className="relative">
                        <button
                            ref={buttonRef}
                            onClick={() => setShowActions((v) => !v)}
                            className="p-2 hover:bg-white/5 rounded-xl transition-colors border border-transparent hover:border-white/10"
                            aria-label="Akcije"
                            aria-haspopup="menu"
                            aria-expanded={showActions}
                        >
                            <MoreVertical className="w-4 h-4 text-white/50" />
                        </button>

                        {showActions && (
                            <motion.div
                                ref={menuRef}
                                initial={{ opacity: 0, scale: 0.97, y: -4 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className="absolute right-0 top-full mt-2 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-20 min-w-[180px]"
                                role="menu"
                            >
                                {booking.status !== "confirmed" && booking.status !== "completed" && (
                                    <button
                                        role="menuitem"
                                        onClick={() => handleStatusChange("confirmed")}
                                        className="w-full px-4 py-3 text-left text-xs font-black uppercase tracking-widest text-emerald-300 hover:bg-white/5 flex items-center gap-2"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Potvrdi
                                    </button>
                                )}

                                {booking.status !== "cancelled" && (
                                    <button
                                        role="menuitem"
                                        onClick={() => handleStatusChange("cancelled")}
                                        className="w-full px-4 py-3 text-left text-xs font-black uppercase tracking-widest text-red-300 hover:bg-white/5 flex items-center gap-2"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Otkaži
                                    </button>
                                )}

                                {booking.status === "confirmed" && (
                                    <button
                                        role="menuitem"
                                        onClick={() => handleStatusChange("completed")}
                                        className="w-full px-4 py-3 text-left text-xs font-black uppercase tracking-widest text-blue-300 hover:bg-white/5 flex items-center gap-2"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Završi
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-white/50">
                    <Calendar className="w-4 h-4" />
                    <span className="font-bold uppercase tracking-tight">
                        {format(checkIn, "dd. MMM", { locale: sr })} – {format(checkOut, "dd. MMM yyyy", { locale: sr })}
                    </span>
                </div>

                <div className="flex items-center gap-2 text-white/50">
                    <Clock className="w-4 h-4" />
                    <span className="font-bold uppercase tracking-tight">
                        {nights} noć{nights === 1 ? "" : "i"}
                    </span>
                </div>

                <div className="flex items-center gap-2 text-white/50">
                    <Users className="w-4 h-4" />
                    <span className="font-bold uppercase tracking-tight">
                        {booking.guests} gost{booking.guests === 1 ? "" : "a"}
                    </span>
                </div>

                <div className="flex items-center gap-2 text-[var(--gold)] font-black">
                    <Euro className="w-4 h-4" />
                    <span className="uppercase tracking-tight">{booking.totalPrice} EUR</span>
                </div>
            </div>

            {/* Contact */}
            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3 sm:gap-6 text-sm">
                <a
                    href={`mailto:${booking.email}`}
                    className="flex items-center gap-2 text-white/50 hover:text-white transition-colors min-w-0"
                >
                    <Mail className="w-4 h-4 shrink-0" />
                    <span className="truncate">{booking.email}</span>
                </a>

                <a
                    href={`tel:${booking.phone}`}
                    className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
                >
                    <Phone className="w-4 h-4 shrink-0" />
                    <span>{booking.phone}</span>
                </a>
            </div>

            {/* Message */}
            {booking.message ? (
                <div className="mt-3 p-4 bg-black/30 border border-white/10 rounded-xl text-sm text-white/60">
                    <User className="w-4 h-4 inline mr-2 text-[var(--gold)]" />
                    {booking.message}
                </div>
            ) : null}
        </motion.div>
    );
}
