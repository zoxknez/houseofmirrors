// Booking System Types

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface Booking {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
    checkIn: string; // ISO date string YYYY-MM-DD
    checkOut: string; // ISO date string YYYY-MM-DD
    guests: number;
    totalPrice: number;
    status: BookingStatus;
    createdAt: string; // ISO datetime string
    updatedAt?: string; // ISO datetime string
    source: "direct" | "admin"; // How the booking was created
    notes?: string; // Admin notes
}

export interface BookingRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: number;
}

export interface BlockedDate {
    id: string;
    startDate: string; // ISO date string YYYY-MM-DD
    endDate: string; // ISO date string YYYY-MM-DD
    reason?: string;
    createdAt: string;
    createdBy: "admin" | "system";
}

export interface BookedDateInfo {
    start: string;
    end: string;
    source: "direct" | "booking" | "airbnb" | "blocked";
    summary?: string;
}

// Admin types
export interface AdminStats {
    totalBookings: number;
    pendingBookings: number;
    confirmedBookings: number;
    todayCheckIns: number;
    todayCheckOuts: number;
    thisMonthRevenue: number;
    lastMonthRevenue: number;
    occupancyRate: number; // percentage
    upcomingBookings: number;
}

export interface AdminSession {
    authenticated: boolean;
    expiresAt?: number;
}
