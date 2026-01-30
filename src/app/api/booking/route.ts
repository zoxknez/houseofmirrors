import { NextRequest, NextResponse } from "next/server";
import {
    getBookings,
    createBooking,
    isDateRangeAvailable,
    generateBookingId,
} from "@/lib/data";
import {
    sendBookingConfirmation,
    sendNewBookingNotification,
} from "@/lib/email";
import type { Booking, BookingRequest } from "@/types";

// Simple in-memory lock to prevent race conditions on concurrent bookings
// In production with multiple instances, use Redis or database-level locking
const bookingLock = {
    locked: false,
    queue: [] as (() => void)[],
    
    async acquire(): Promise<void> {
        if (!this.locked) {
            this.locked = true;
            return;
        }
        return new Promise((resolve) => {
            this.queue.push(resolve);
        });
    },
    
    release(): void {
        if (this.queue.length > 0) {
            const next = this.queue.shift();
            next?.();
        } else {
            this.locked = false;
        }
    }
};

function validateBookingRequest(body: unknown): body is BookingRequest {
    const b = body as BookingRequest;
    return (
        typeof b.firstName === "string" &&
        b.firstName.trim().length > 0 &&
        typeof b.lastName === "string" &&
        b.lastName.trim().length > 0 &&
        typeof b.email === "string" &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email) &&
        typeof b.phone === "string" &&
        b.phone.trim().length > 0 &&
        typeof b.checkIn === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(b.checkIn) &&
        typeof b.checkOut === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(b.checkOut) &&
        typeof b.guests === "number" &&
        b.guests >= 1 &&
        b.guests <= 4 &&
        typeof b.totalPrice === "number" &&
        b.totalPrice > 0
    );
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (!validateBookingRequest(body)) {
            return NextResponse.json(
                { error: "Nevažeći podaci za rezervaciju" },
                { status: 400 }
            );
        }

        // Validate dates
        const checkIn = new Date(body.checkIn);
        const checkOut = new Date(body.checkOut);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkIn < today) {
            return NextResponse.json(
                { error: "Datum prijave ne može biti u prošlosti" },
                { status: 400 }
            );
        }

        if (checkOut <= checkIn) {
            return NextResponse.json(
                { error: "Datum odjave mora biti posle datuma prijave" },
                { status: 400 }
            );
        }

        // Acquire lock to prevent race conditions
        await bookingLock.acquire();
        
        try {
            // Check availability (inside lock to prevent race conditions)
            const isAvailable = await isDateRangeAvailable(body.checkIn, body.checkOut);
            if (!isAvailable) {
                return NextResponse.json(
                    { error: "Izabrani datumi nisu više dostupni" },
                    { status: 409 }
                );
            }

            // Create booking
            const booking: Booking = {
                ...body,
                id: generateBookingId(),
                createdAt: new Date().toISOString(),
                status: "pending",
                source: "direct",
            };

            await createBooking(booking);

            // Release lock after successful creation
            bookingLock.release();

            // Send emails (don't wait, fire and forget)
            Promise.all([
                sendBookingConfirmation(booking),
                sendNewBookingNotification(booking),
            ]).catch(console.error);

            return NextResponse.json({
                success: true,
                booking: {
                    id: booking.id,
                    status: booking.status,
                },
            });
        } catch (innerError) {
            // Release lock on error
            bookingLock.release();
            throw innerError;
        }
    } catch (error) {
        console.error("Booking API error:", error);
        return NextResponse.json(
            { error: "Greška pri kreiranju rezervacije" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const bookings = await getBookings();
        return NextResponse.json({ bookings });
    } catch (error) {
        console.error("Booking API error:", error);
        return NextResponse.json(
            { error: "Greška pri dohvatanju rezervacija" },
            { status: 500 }
        );
    }
}
