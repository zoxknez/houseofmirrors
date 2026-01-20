import fs from "fs/promises";
import path from "path";
import type { Booking, BlockedDate, BookingStatus } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");
const BLOCKED_DATES_FILE = path.join(DATA_DIR, "blocked-dates.json");

// Ensure data directory exists
async function ensureDataDir() {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }
}

// ==================== BOOKINGS ====================

export async function getBookings(): Promise<Booking[]> {
    await ensureDataDir();
    try {
        const data = await fs.readFile(BOOKINGS_FILE, "utf-8");
        return JSON.parse(data);
    } catch {
        return [];
    }
}

export async function saveBookings(bookings: Booking[]): Promise<void> {
    await ensureDataDir();
    await fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
}

export async function getBookingById(id: string): Promise<Booking | null> {
    const bookings = await getBookings();
    return bookings.find((b) => b.id === id) || null;
}

export async function createBooking(booking: Booking): Promise<Booking> {
    const bookings = await getBookings();
    bookings.push(booking);
    await saveBookings(bookings);
    return booking;
}

export async function updateBooking(
    id: string,
    updates: Partial<Booking>
): Promise<Booking | null> {
    const bookings = await getBookings();
    const index = bookings.findIndex((b) => b.id === id);

    if (index === -1) return null;

    bookings[index] = {
        ...bookings[index],
        ...updates,
        updatedAt: new Date().toISOString(),
    };

    await saveBookings(bookings);
    return bookings[index];
}

export async function updateBookingStatus(
    id: string,
    status: BookingStatus,
    notes?: string
): Promise<Booking | null> {
    return updateBooking(id, { status, ...(notes ? { notes } : {}) });
}

export async function deleteBooking(id: string): Promise<boolean> {
    const bookings = await getBookings();
    const filtered = bookings.filter((b) => b.id !== id);

    if (filtered.length === bookings.length) return false;

    await saveBookings(filtered);
    return true;
}

// ==================== BLOCKED DATES ====================

export async function getBlockedDates(): Promise<BlockedDate[]> {
    await ensureDataDir();
    try {
        const data = await fs.readFile(BLOCKED_DATES_FILE, "utf-8");
        return JSON.parse(data);
    } catch {
        return [];
    }
}

export async function saveBlockedDates(dates: BlockedDate[]): Promise<void> {
    await ensureDataDir();
    await fs.writeFile(BLOCKED_DATES_FILE, JSON.stringify(dates, null, 2));
}

export async function addBlockedDate(blockedDate: BlockedDate): Promise<BlockedDate> {
    const dates = await getBlockedDates();
    dates.push(blockedDate);
    await saveBlockedDates(dates);
    return blockedDate;
}

export async function removeBlockedDate(id: string): Promise<boolean> {
    const dates = await getBlockedDates();
    const filtered = dates.filter((d) => d.id !== id);

    if (filtered.length === dates.length) return false;

    await saveBlockedDates(filtered);
    return true;
}

// ==================== AVAILABILITY CHECK ====================

export async function isDateRangeAvailable(
    checkIn: string,
    checkOut: string,
    excludeBookingId?: string
): Promise<boolean> {
    const bookings = await getBookings();
    const blockedDates = await getBlockedDates();

    const requestStart = new Date(checkIn);
    const requestEnd = new Date(checkOut);

    // Check against existing bookings
    for (const booking of bookings) {
        if (booking.status === "cancelled") continue;
        if (excludeBookingId && booking.id === excludeBookingId) continue;

        const bookingStart = new Date(booking.checkIn);
        const bookingEnd = new Date(booking.checkOut);

        // Check for overlap
        if (requestStart < bookingEnd && requestEnd > bookingStart) {
            return false;
        }
    }

    // Check against blocked dates
    for (const blocked of blockedDates) {
        const blockedStart = new Date(blocked.startDate);
        const blockedEnd = new Date(blocked.endDate);

        if (requestStart < blockedEnd && requestEnd > blockedStart) {
            return false;
        }
    }

    return true;
}

// ==================== STATISTICS ====================

export async function getBookingStats() {
    const bookings = await getBookings();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayStr = today.toISOString().split("T")[0];

    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    const stats = {
        totalBookings: bookings.length,
        pendingBookings: 0,
        confirmedBookings: 0,
        cancelledBookings: 0,
        completedBookings: 0,
        todayCheckIns: 0,
        todayCheckOuts: 0,
        thisMonthRevenue: 0,
        lastMonthRevenue: 0,
        upcomingBookings: 0,
    };

    for (const booking of bookings) {
        // Status counts
        switch (booking.status) {
            case "pending":
                stats.pendingBookings++;
                break;
            case "confirmed":
                stats.confirmedBookings++;
                break;
            case "cancelled":
                stats.cancelledBookings++;
                break;
            case "completed":
                stats.completedBookings++;
                break;
        }

        // Today's check-ins/outs
        if (booking.checkIn === todayStr && booking.status !== "cancelled") {
            stats.todayCheckIns++;
        }
        if (booking.checkOut === todayStr && booking.status !== "cancelled") {
            stats.todayCheckOuts++;
        }

        // Revenue calculations (only confirmed/completed)
        if (booking.status === "confirmed" || booking.status === "completed") {
            const checkInDate = new Date(booking.checkIn);

            if (checkInDate >= thisMonth) {
                stats.thisMonthRevenue += booking.totalPrice;
            } else if (checkInDate >= lastMonth && checkInDate <= lastMonthEnd) {
                stats.lastMonthRevenue += booking.totalPrice;
            }
        }

        // Upcoming bookings
        if (
            new Date(booking.checkIn) > today &&
            (booking.status === "pending" || booking.status === "confirmed")
        ) {
            stats.upcomingBookings++;
        }
    }

    return stats;
}

// ==================== UTILITY ====================

export function generateBookingId(): string {
    return `HOM-${Date.now().toString(36).toUpperCase()}-${Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase()}`;
}

export function generateBlockedDateId(): string {
    return `BLK-${Date.now().toString(36).toUpperCase()}-${Math.random()
        .toString(36)
        .substring(2, 4)
        .toUpperCase()}`;
}
