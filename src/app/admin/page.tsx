"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    CalendarDays,
    Settings,
    LogOut,
    Menu,
    X,
    RefreshCw,
    Calendar,
    Users,
    Euro,
    Search,
    Clock,
    CheckCircle,
    TrendingUp,
    Link as LinkIcon,
    Copy,
    Check,
} from "lucide-react";
import { LoginForm } from "@/components/admin/LoginForm";
import { StatCard } from "@/components/admin/StatCard";
import { BookingCard } from "@/components/admin/BookingCard";
import { AdminCalendar } from "@/components/admin/AdminCalendar";
import { LOGO_URL } from "@/data/images";
import type { Booking, BlockedDate, BookingStatus } from "@/types";

type Tab = "dashboard" | "calendar" | "settings";

interface Stats {
    totalBookings: number;
    pendingBookings: number;
    confirmedBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    todayCheckIns: number;
    todayCheckOuts: number;
    thisMonthRevenue: number;
    lastMonthRevenue: number;
    upcomingBookings: number;
}

export default function AdminPage() {
    const [authenticated, setAuthenticated] = useState<boolean | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [stats, setStats] = useState<Stats | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
    const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [copied, setCopied] = useState(false);
    const [calendarUrl, setCalendarUrl] = useState("");

    const requestIdRef = useRef(0);

    // SSR-safe Calendar URL
    useEffect(() => {
        if (typeof window !== "undefined") {
            const baseUrl = `${window.location.origin}/api/calendar`;
            setCalendarUrl(baseUrl);
        }
    }, []);

    const fetchData = useCallback(async () => {
        const reqId = ++requestIdRef.current;
        setLoading(true);

        try {
            const [statsRes, bookingsRes, blockedRes] = await Promise.all([
                fetch("/api/admin/stats"),
                fetch("/api/booking"),
                fetch("/api/blocked-dates"),
            ]);

            if (reqId !== requestIdRef.current) return;

            const [statsData, bookingsData, blockedData] = await Promise.all([
                statsRes.json(),
                bookingsRes.json(),
                blockedRes.json(),
            ]);

            if (reqId !== requestIdRef.current) return;

            setStats(statsData);
            
            // Auto-complete bookings where checkout date has passed
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const processedBookings = (bookingsData.bookings || []).map((b: Booking) => {
                if (b.status === "confirmed") {
                    const checkOutDate = new Date(b.checkOut);
                    checkOutDate.setHours(0, 0, 0, 0);
                    if (checkOutDate < today) {
                        // Auto-mark as completed (fire-and-forget server update)
                        fetch(`/api/booking/${b.id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ status: "completed" }),
                        }).catch(console.error);
                        return { ...b, status: "completed" as const };
                    }
                }
                return b;
            });
            
            setBookings(processedBookings);
            setBlockedDates(blockedData.blockedDates || []);
        } catch (err) {
            console.error("Failed to fetch data:", err);
        } finally {
            if (reqId === requestIdRef.current) setLoading(false);
        }
    }, []);

    const checkAuth = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/auth");
            const data = await res.json();
            setAuthenticated(!!data.authenticated);
            if (data.authenticated) {
                if (data.icalToken) {
                    setCalendarUrl(prev => `${prev}?token=${data.icalToken}`);
                }
                await fetchData();
            }
        } catch {
            setAuthenticated(false);
        }
    }, [fetchData]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Mobile Sidebar UX: Scroll Lock + ESC
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSidebarOpen(false);
        };

        if (sidebarOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", onKeyDown);
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [sidebarOpen]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    const handleStatusChange = async (id: string, status: BookingStatus) => {
        const reqId = requestIdRef.current;
        try {
            const res = await fetch(`/api/booking/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });

            if (res.ok) {
                setBookings((prev) =>
                    prev.map((b) => (b.id === id ? { ...b, status } : b))
                );
                // Refresh stats
                const statsRes = await fetch("/api/admin/stats");
                if (statsRes.ok && reqId === requestIdRef.current) {
                    setStats(await statsRes.json());
                }
            }
        } catch (err) {
            console.error("Failed to update status:", err);
        }
    };

    const handleAddBlock = async (startDate: string, endDate: string, reason?: string) => {
        try {
            const res = await fetch("/api/blocked-dates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ startDate, endDate, reason }),
            });

            if (res.ok) {
                const data = await res.json();
                setBlockedDates((prev) => [...prev, data.blockedDate]);
            }
        } catch (err) {
            console.error("Failed to add block:", err);
        }
    };

    const handleRemoveBlock = async (id: string) => {
        try {
            const res = await fetch(`/api/blocked-dates?id=${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setBlockedDates((prev) => prev.filter((b) => b.id !== id));
            }
        } catch (err) {
            console.error("Failed to remove block:", err);
        }
    };

    const handleLogout = async () => {
        await fetch("/api/admin/auth", { method: "DELETE" });
        setAuthenticated(false);
        setStats(null);
        setBookings([]);
        setBlockedDates([]);
        setActiveTab("dashboard");
        setSidebarOpen(false);
    };

    const copyCalendarUrl = async () => {
        if (!calendarUrl) return;

        try {
            await navigator.clipboard.writeText(calendarUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers or non-secure contexts
            const el = document.createElement("textarea");
            el.value = calendarUrl;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);

            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const filteredBookings = useMemo(() => {
        let result = statusFilter === "all"
            ? bookings
            : bookings.filter((b) => b.status === statusFilter);
        
        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter((b) =>
                b.firstName.toLowerCase().includes(query) ||
                b.lastName.toLowerCase().includes(query) ||
                b.email.toLowerCase().includes(query) ||
                b.phone.includes(query) ||
                b.id.toLowerCase().includes(query)
            );
        }
        
        return result;
    }, [bookings, statusFilter, searchQuery]);

    const sortedBookings = useMemo(() => {
        const statusPriority: Record<BookingStatus, number> = {
            pending: 0,
            confirmed: 1,
            completed: 2,
            cancelled: 3,
        };
        return [...filteredBookings].sort((a, b) => {
            // If showing all, prioritize pending first
            if (statusFilter === "all") {
                const priorityDiff = statusPriority[a.status] - statusPriority[b.status];
                if (priorityDiff !== 0) return priorityDiff;
            }
            // Then sort by check-in date (newest first)
            return new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime();
        });
    }, [filteredBookings, statusFilter]);

    if (authenticated === null) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold" />
            </div>
        );
    }

    if (!authenticated) {
        return <LoginForm onSuccess={() => { setAuthenticated(true); fetchData(); }} />;
    }

    const tabs = [
        { id: "dashboard" as Tab, label: "Dashboard", icon: LayoutDashboard },
        { id: "calendar" as Tab, label: "Kalendar", icon: CalendarDays },
        { id: "settings" as Tab, label: "Podešavanja", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 z-40 flex items-center justify-between px-4">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    aria-label="Open menu"
                >
                    <Menu className="w-6 h-6 text-white" />
                </button>
                <h1 className="text-lg font-bold text-white tracking-tight uppercase">Admin Panel</h1>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                    <RefreshCw className={`w-5 h-5 text-gray-400 ${refreshing ? "animate-spin" : ""}`} />
                </button>
            </div>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-800 z-50 transform transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Image
                                src={LOGO_URL}
                                alt="House of Mirrors"
                                width={40}
                                height={40}
                                className="w-10 h-10 object-contain rounded-lg"
                            />
                            <div className="min-w-0">
                                <h1 className="font-bold text-white truncate text-sm">House of Mirrors</h1>
                                <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Admin Panel</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                </div>

                <nav className="px-4 space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setSidebarOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                                ? "bg-gold/10 text-gold"
                                : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            <span className="font-bold text-sm uppercase tracking-wide">{tab.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="absolute bottom-4 left-0 right-0 px-4">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all group"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-bold text-sm uppercase tracking-wide">Odjavi se</span>
                    </button>
                </div>
            </aside>

            {/* Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
                <div className="p-6 lg:p-8 max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="hidden lg:flex items-center justify-between mb-10">
                        <div>
                            <h1 className="text-2xl font-black text-white uppercase tracking-tight">
                                {tabs.find((t) => t.id === activeTab)?.label}
                            </h1>
                            <p className="text-white/40 text-sm mt-1 font-bold">
                                Upravljajte rezervacijama i kalendarem
                            </p>
                        </div>
                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all font-bold text-sm uppercase tracking-wide"
                        >
                            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                            <span>Osveži</span>
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold" />
                        </div>
                    ) : (
                        <>
                            {/* Dashboard Tab */}
                            {activeTab === "dashboard" && stats && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-10"
                                >
                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                                        <StatCard
                                            title="Ukupno"
                                            value={stats.totalBookings}
                                            icon={Calendar}
                                            color="blue"
                                        />
                                        <StatCard
                                            title="Na čekanju"
                                            value={stats.pendingBookings}
                                            icon={Clock}
                                            color="purple"
                                        />
                                        <StatCard
                                            title="Potvrđeno"
                                            value={stats.confirmedBookings}
                                            icon={CheckCircle}
                                            color="green"
                                        />
                                        <StatCard
                                            title="Završeno"
                                            value={stats.completedBookings}
                                            icon={CheckCircle}
                                            color="blue"
                                        />
                                        <StatCard
                                            title="Prihod meseca"
                                            value={`€${stats.thisMonthRevenue}`}
                                            icon={Euro}
                                            color="gold"
                                            trend={
                                                stats.lastMonthRevenue > 0
                                                    ? {
                                                        value: Math.round(
                                                            ((stats.thisMonthRevenue -
                                                                stats.lastMonthRevenue) /
                                                                stats.lastMonthRevenue) *
                                                            100
                                                        ),
                                                        isPositive:
                                                            stats.thisMonthRevenue >=
                                                            stats.lastMonthRevenue,
                                                    }
                                                    : undefined
                                            }
                                        />
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="bg-white/3 backdrop-blur-sm rounded-2xl p-5 border border-white/5">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/10">
                                                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Danas check-in</p>
                                                    <p className="text-2xl font-black text-white mt-0.5">{stats.todayCheckIns}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white/3 backdrop-blur-sm rounded-2xl p-5 border border-white/5">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/10">
                                                    <LogOut className="w-5 h-5 text-red-400" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Danas check-out</p>
                                                    <p className="text-2xl font-black text-white mt-0.5">{stats.todayCheckOuts}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white/3 backdrop-blur-sm rounded-2xl p-5 border border-white/5">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/10">
                                                    <Users className="w-5 h-5 text-blue-400" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Nadolazeće</p>
                                                    <p className="text-2xl font-black text-white mt-0.5">{stats.upcomingBookings}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bookings Section */}
                                    <div className="space-y-6">
                                        <div className="flex flex-col gap-4">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                <h2 className="text-xl font-black text-white uppercase tracking-tight">Rezervacije</h2>
                                                
                                                {/* Search Input */}
                                                <div className="relative w-full sm:w-64">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                                    <input
                                                        type="text"
                                                        placeholder="Pretraži..."
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/30 transition-all"
                                                    />
                                                    {searchQuery && (
                                                        <button
                                                            onClick={() => setSearchQuery("")}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {/* Status Filters */}
                                            <div className="flex flex-wrap gap-1.5 p-1 bg-white/5 rounded-xl border border-white/5 w-fit">
                                                {(["all", "pending", "confirmed", "completed", "cancelled"] as const).map((status) => {
                                                    const count = status === "all" 
                                                        ? bookings.length 
                                                        : bookings.filter(b => b.status === status).length;
                                                    const labels: Record<string, string> = {
                                                        all: "Sve",
                                                        pending: "Na čekanju",
                                                        confirmed: "Potvrđeno",
                                                        completed: "Završeno",
                                                        cancelled: "Otkazano",
                                                    };
                                                    return (
                                                        <button
                                                            key={status}
                                                            onClick={() => setStatusFilter(status)}
                                                            className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-1.5 ${statusFilter === status
                                                                ? "bg-gold/20 text-gold"
                                                                : "text-white/40 hover:text-white"
                                                                }`}
                                                        >
                                                            {labels[status]}
                                                            {count > 0 && (
                                                                <span className={`min-w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] ${
                                                                    statusFilter === status 
                                                                        ? "bg-gold/30 text-gold" 
                                                                        : "bg-white/10 text-white/50"
                                                                }`}>
                                                                    {count}
                                                                </span>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {sortedBookings.length === 0 ? (
                                            <div className="bg-white/2 rounded-3xl p-12 text-center border border-white/5">
                                                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                    {searchQuery ? (
                                                        <Search className="w-8 h-8 text-white/20" />
                                                    ) : (
                                                        <Calendar className="w-8 h-8 text-white/20" />
                                                    )}
                                                </div>
                                                <p className="text-white/30 font-bold uppercase tracking-widest text-xs">
                                                    {searchQuery ? "Nema rezultata pretrage" : "Nema rezervacija"}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="grid gap-4">
                                                {sortedBookings.map((booking) => (
                                                    <BookingCard
                                                        key={booking.id}
                                                        booking={booking}
                                                        onStatusChange={handleStatusChange}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* Calendar Tab */}
                            {activeTab === "calendar" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <AdminCalendar
                                        bookings={bookings}
                                        blockedDates={blockedDates}
                                        onAddBlock={handleAddBlock}
                                        onRemoveBlock={handleRemoveBlock}
                                    />
                                </motion.div>
                            )}

                            {/* Settings Tab */}
                            {activeTab === "settings" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-6"
                                >
                                    {/* iCal Export */}
                                    <div className="bg-white/3 backdrop-blur-sm rounded-3xl p-8 border border-white/5">
                                        <div className="flex flex-col md:flex-row items-start gap-6">
                                            <div className="p-4 bg-gold/10 rounded-2xl border border-gold/10">
                                                <LinkIcon className="w-8 h-8 text-gold" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">
                                                    iCal Calendar URL
                                                </h3>
                                                <p className="text-white/40 text-sm mb-6 font-bold">
                                                    Kopirajte ovaj URL i uvezite ga u Booking.com i Airbnb
                                                    da biste sinhronizovali kalendar.
                                                </p>

                                                <div className="flex flex-col sm:flex-row gap-3">
                                                    <input
                                                        type="text"
                                                        readOnly
                                                        value={calendarUrl}
                                                        className="flex-1 px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm font-mono focus:outline-none"
                                                    />
                                                    <button
                                                        onClick={copyCalendarUrl}
                                                        className="px-6 py-3 bg-gold hover:brightness-110 text-gray-900 rounded-xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest transition-all"
                                                    >
                                                        {copied ? (
                                                            <>
                                                                <Check className="w-4 h-4" />
                                                                Kopirano!
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Copy className="w-4 h-4" />
                                                                Kopiraj
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Instructions */}
                                    <div className="bg-white/3 backdrop-blur-sm rounded-3xl p-8 border border-white/5">
                                        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6">
                                            Kako sinhronizovati kalendar
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="flex gap-4 p-5 bg-white/2 rounded-2xl border border-white/5">
                                                <span className="shrink-0 w-10 h-10 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center font-black text-lg">
                                                    1
                                                </span>
                                                <div>
                                                    <h4 className="font-black text-white uppercase text-xs tracking-widest mb-1">Booking.com</h4>
                                                    <p className="text-white/40 text-xs font-bold leading-relaxed">
                                                        Property → Calendar → Sync → Import Calendar → Paste URL
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4 p-5 bg-white/2 rounded-2xl border border-white/5">
                                                <span className="shrink-0 w-10 h-10 bg-pink-500/10 text-pink-400 rounded-xl flex items-center justify-center font-black text-lg">
                                                    2
                                                </span>
                                                <div>
                                                    <h4 className="font-black text-white uppercase text-xs tracking-widest mb-1">Airbnb</h4>
                                                    <p className="text-white/40 text-xs font-bold leading-relaxed">
                                                        Hosting → Calendar → Availability Settings → Import Calendar
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 p-5 bg-gold/5 border border-gold/10 rounded-2xl">
                                            <p className="text-gold/80 text-xs font-bold leading-relaxed">
                                                <strong>Napomena:</strong> Booking.com i Airbnb osvežavaju
                                                kalendar svakih 3-12 sati. Za trenutnu sinhronizaciju
                                                bi bio potreban direktan API pristup.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Blocked Dates */}
                                    <div className="bg-white/3 backdrop-blur-sm rounded-3xl p-8 border border-white/5">
                                        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6">
                                            Blokirani datumi
                                        </h3>

                                        {blockedDates.length === 0 ? (
                                            <p className="text-white/30 text-xs font-bold uppercase tracking-widest">
                                                Nema blokiranih datuma. Koristite kalendar da blokirate datume.
                                            </p>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {blockedDates.map((block) => (
                                                    <div
                                                        key={block.id}
                                                        className="flex items-center justify-between p-4 bg-white/2 rounded-2xl border border-white/5"
                                                    >
                                                        <div>
                                                            <p className="text-white font-black text-xs uppercase tracking-widest">
                                                                {block.startDate} → {block.endDate}
                                                            </p>
                                                            {block.reason && (
                                                                <p className="text-white/40 text-[10px] font-bold mt-1 uppercase">
                                                                    {block.reason}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() => handleRemoveBlock(block.id)}
                                                            className="p-2 hover:bg-red-500/10 text-red-400/50 hover:text-red-400 rounded-xl transition-all"
                                                        >
                                                            <X className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
