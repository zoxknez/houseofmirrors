import { NextRequest, NextResponse } from "next/server";
import ical, { ICalEventStatus, ICalEventBusyStatus } from "ical-generator";
import { addDays, parseISO } from "date-fns";
import { getBookings, getBlockedDates } from "@/lib/data";

const PROPERTY_NAME = "House of Mirrors Belgrade";
const TIMEZONE = "Europe/Belgrade";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get("token");

        // 1. Security check
        if (!process.env.ICAL_TOKEN || token !== process.env.ICAL_TOKEN) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // 2. Fetch data
        const [bookings, blockedDates] = await Promise.all([
            getBookings(),
            getBlockedDates(),
        ]);

        // 3. Create calendar
        const cal = ical({
            name: `${PROPERTY_NAME} - Availability`,
            timezone: TIMEZONE,
            prodId: {
                company: "House of Mirrors",
                product: "Booking Calendar",
                language: "EN"
            }
        });

        // 4. Add bookings
        for (const b of bookings) {
            if (b.status === "cancelled") continue;

            // In iCal, DTEND is exclusive. 
            // Our booking.checkOut is already the checkout day (exclusive for staying).
            cal.createEvent({
                id: `booking-${b.id}@houseofmirrors.rs`,
                start: parseISO(b.checkIn),
                end: parseISO(b.checkOut),
                allDay: true,
                summary: b.status === "pending" ? "Reserved (Pending)" : "Reserved",
                description: `Booking ID: ${b.id}`,
                busystatus: ICalEventBusyStatus.BUSY,
                status: b.status === "confirmed" ? ICalEventStatus.CONFIRMED : ICalEventStatus.TENTATIVE
            });
        }

        // 5. Add blocked dates
        for (const blk of blockedDates) {
            // Manual blocks are stored as inclusive [start, end].
            // To make the last day busy in iCal, we must set DTEND to end + 1.
            const startDate = parseISO(blk.startDate);
            const endDateInclusive = parseISO(blk.endDate);
            const endDateExclusive = addDays(endDateInclusive, 1);

            cal.createEvent({
                id: `block-${blk.id}@houseofmirrors.rs`,
                start: startDate,
                end: endDateExclusive,
                allDay: true,
                summary: blk.reason || "Not Available",
                description: blk.reason ? `Reason: ${blk.reason}` : undefined,
                busystatus: ICalEventBusyStatus.BUSY,
                status: ICalEventStatus.CONFIRMED
            });
        }

        return new NextResponse(cal.toString(), {
            headers: {
                "Content-Type": "text/calendar; charset=utf-8",
                "Content-Disposition": 'attachment; filename="house-of-mirrors.ics"',
                "Cache-Control": "no-cache, no-store, must-revalidate",
            },
        });
    } catch (error) {
        console.error("Calendar API error:", error);
        return new NextResponse("Failed to generate calendar", { status: 500 });
    }
}
