import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

interface BookingRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message?: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: number;
}

interface Booking extends BookingRequest {
    id: string;
    createdAt: string;
    status: "pending" | "confirmed" | "cancelled";
}

const DATA_DIR = path.join(process.cwd(), "data");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");

async function ensureDataDir() {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }
}

async function getBookings(): Promise<Booking[]> {
    await ensureDataDir();
    try {
        const data = await fs.readFile(BOOKINGS_FILE, "utf-8");
        return JSON.parse(data);
    } catch {
        return [];
    }
}

async function saveBookings(bookings: Booking[]) {
    await ensureDataDir();
    await fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
}

function generateId(): string {
    return `HOM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

function validateBookingRequest(body: unknown): body is BookingRequest {
    const b = body as BookingRequest;
    return (
        typeof b.firstName === "string" &&
        typeof b.lastName === "string" &&
        typeof b.email === "string" &&
        typeof b.phone === "string" &&
        typeof b.checkIn === "string" &&
        typeof b.checkOut === "string" &&
        typeof b.guests === "number" &&
        typeof b.totalPrice === "number"
    );
}

async function sendConfirmationEmail(booking: Booking) {
    // In production, use Nodemailer or Resend
    // For now, just log
    console.log("📧 Would send confirmation email to:", booking.email);
    console.log("Booking details:", {
        id: booking.id,
        name: `${booking.firstName} ${booking.lastName}`,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
        total: booking.totalPrice
    });

    // TODO: Implement actual email sending
    // const nodemailer = await import("nodemailer");
    // const transporter = nodemailer.createTransport({...});
    // await transporter.sendMail({...});
}

async function checkAvailability(checkIn: string, checkOut: string): Promise<boolean> {
    const bookings = await getBookings();

    const requestStart = new Date(checkIn);
    const requestEnd = new Date(checkOut);

    for (const booking of bookings) {
        if (booking.status === "cancelled") continue;

        const bookingStart = new Date(booking.checkIn);
        const bookingEnd = new Date(booking.checkOut);

        // Check for overlap
        if (requestStart < bookingEnd && requestEnd > bookingStart) {
            return false;
        }
    }

    return true;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (!validateBookingRequest(body)) {
            return NextResponse.json(
                { error: "Invalid booking data" },
                { status: 400 }
            );
        }

        // Check if dates are available
        const isAvailable = await checkAvailability(body.checkIn, body.checkOut);
        if (!isAvailable) {
            return NextResponse.json(
                { error: "Izabrani datumi nisu više dostupni" },
                { status: 409 }
            );
        }

        // Create booking
        const booking: Booking = {
            ...body,
            id: generateId(),
            createdAt: new Date().toISOString(),
            status: "pending"
        };

        // Save to database
        const bookings = await getBookings();
        bookings.push(booking);
        await saveBookings(bookings);

        // Send confirmation email
        await sendConfirmationEmail(booking);

        return NextResponse.json({
            success: true,
            booking: {
                id: booking.id,
                status: booking.status
            }
        });
    } catch (error) {
        console.error("Booking API error:", error);
        return NextResponse.json(
            { error: "Failed to create booking" },
            { status: 500 }
        );
    }
}

export async function GET() {
    // For admin use - list all bookings
    try {
        const bookings = await getBookings();
        return NextResponse.json({ bookings });
    } catch (error) {
        console.error("Booking API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch bookings" },
            { status: 500 }
        );
    }
}
