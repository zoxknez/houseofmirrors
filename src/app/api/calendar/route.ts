import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Generate iCal format for our bookings
// This URL can be imported into Booking.com and Airbnb

const PROPERTY_NAME = "House of Mirrors Belgrade";

interface Booking {
    id: string;
    checkIn: string;
    checkOut: string;
    firstName: string;
    lastName: string;
    status: string;
}

function formatICalDate(date: Date): string {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function formatICalDateOnly(dateStr: string): string {
    // Convert 2026-01-20 to 20260120
    return dateStr.replace(/-/g, "");
}

function generateICalEvent(booking: Booking): string {
    const uid = `${booking.id}@houseofmirrors.rs`;
    const dtstamp = formatICalDate(new Date());
    const dtstart = formatICalDateOnly(booking.checkIn);
    const dtend = formatICalDateOnly(booking.checkOut);
    const summary = `Reserved - ${booking.firstName} ${booking.lastName}`;

    return [
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${dtstamp}`,
        `DTSTART;VALUE=DATE:${dtstart}`,
        `DTEND;VALUE=DATE:${dtend}`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:Booking ID: ${booking.id}`,
        "STATUS:CONFIRMED",
        "TRANSP:OPAQUE",
        "END:VEVENT"
    ].join("\r\n");
}

function generateICalFeed(bookings: Booking[]): string {
    const now = formatICalDate(new Date());

    const header = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//House of Mirrors//Booking Calendar//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        `X-WR-CALNAME:${PROPERTY_NAME}`,
        `X-WR-TIMEZONE:Europe/Belgrade`
    ].join("\r\n");

    const events = bookings
        .filter((b) => b.status !== "cancelled")
        .map(generateICalEvent)
        .join("\r\n");

    const footer = "END:VCALENDAR";

    return `${header}\r\n${events}\r\n${footer}`;
}

async function getBookings(): Promise<Booking[]> {
    try {
        const filePath = path.join(process.cwd(), "data", "bookings.json");
        const data = await fs.readFile(filePath, "utf-8");
        return JSON.parse(data);
    } catch {
        return [];
    }
}

export async function GET() {
    try {
        const bookings = await getBookings();
        const icalData = generateICalFeed(bookings);

        return new NextResponse(icalData, {
            headers: {
                "Content-Type": "text/calendar; charset=utf-8",
                "Content-Disposition": 'attachment; filename="house-of-mirrors.ics"',
                "Cache-Control": "no-cache, no-store, must-revalidate"
            }
        });
    } catch (error) {
        console.error("Calendar API error:", error);
        return NextResponse.json(
            { error: "Failed to generate calendar" },
            { status: 500 }
        );
    }
}
