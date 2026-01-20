import { NextResponse } from "next/server";
import { getBookings, getBlockedDates } from "@/lib/data";
import type { Booking, BlockedDate } from "@/types";

const PROPERTY_NAME = "House of Mirrors Belgrade";
const TIMEZONE = "Europe/Belgrade";

function formatICalDate(date: Date): string {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function formatICalDateOnly(dateStr: string): string {
    return dateStr.replace(/-/g, "");
}

function generateBookingEvent(booking: Booking): string {
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
        "END:VEVENT",
    ].join("\r\n");
}

function generateBlockedEvent(blocked: BlockedDate): string {
    const uid = `${blocked.id}@houseofmirrors.rs`;
    const dtstamp = formatICalDate(new Date());
    const dtstart = formatICalDateOnly(blocked.startDate);
    const dtend = formatICalDateOnly(blocked.endDate);
    const summary = blocked.reason || "Not available";

    return [
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${dtstamp}`,
        `DTSTART;VALUE=DATE:${dtstart}`,
        `DTEND;VALUE=DATE:${dtend}`,
        `SUMMARY:${summary}`,
        "STATUS:CONFIRMED",
        "TRANSP:OPAQUE",
        "END:VEVENT",
    ].join("\r\n");
}

function generateICalFeed(bookings: Booking[], blockedDates: BlockedDate[]): string {
    const header = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//House of Mirrors//Booking Calendar//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        `X-WR-CALNAME:${PROPERTY_NAME}`,
        `X-WR-TIMEZONE:${TIMEZONE}`,
    ].join("\r\n");

    const bookingEvents = bookings
        .filter((b) => b.status !== "cancelled")
        .map(generateBookingEvent)
        .join("\r\n");

    const blockedEvents = blockedDates.map(generateBlockedEvent).join("\r\n");

    const allEvents = [bookingEvents, blockedEvents].filter(Boolean).join("\r\n");

    const footer = "END:VCALENDAR";

    return `${header}\r\n${allEvents}\r\n${footer}`;
}

export async function GET() {
    try {
        const [bookings, blockedDates] = await Promise.all([
            getBookings(),
            getBlockedDates(),
        ]);

        const icalData = generateICalFeed(bookings, blockedDates);

        return new NextResponse(icalData, {
            headers: {
                "Content-Type": "text/calendar; charset=utf-8",
                "Content-Disposition": 'attachment; filename="house-of-mirrors.ics"',
                "Cache-Control": "no-cache, no-store, must-revalidate",
            },
        });
    } catch (error) {
        console.error("Calendar API error:", error);
        return NextResponse.json(
            { error: "Failed to generate calendar" },
            { status: 500 }
        );
    }
}
