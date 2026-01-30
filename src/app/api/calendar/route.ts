import { NextRequest, NextResponse } from "next/server";
import ical, { ICalEventStatus, ICalEventBusyStatus, ICalCalendarMethod } from "ical-generator";
import { addDays, parseISO, isBefore, startOfDay } from "date-fns";
import { getBookings, getBlockedDates } from "@/lib/data";

const PROPERTY_NAME = "House of Mirrors Belgrade";
const TIMEZONE = "Europe/Belgrade";
const CALENDAR_TTL_HOURS = 1; // How often clients should refresh

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

        const today = startOfDay(new Date());

        // 3. Create calendar
        const cal = ical({
            name: `${PROPERTY_NAME} - Availability`,
            timezone: TIMEZONE,
            method: ICalCalendarMethod.PUBLISH,
            ttl: CALENDAR_TTL_HOURS * 60 * 60, // seconds
            prodId: {
                company: "House of Mirrors",
                product: "Booking Calendar",
                language: "EN"
            }
        });

        // 4. Add bookings (exclude cancelled and old completed)
        for (const b of bookings) {
            if (b.status === "cancelled") continue;
            
            const checkOutDate = parseISO(b.checkOut);
            
            // Skip completed bookings that are in the past (cleanup)
            if (b.status === "completed" && isBefore(checkOutDate, today)) continue;

            // In iCal, DTEND is exclusive.
            // checkOut day is when guest leaves, but room is occupied until checkout time.
            // To block the full checkout day in most calendar apps, we add +1 day.
            const endDateExclusive = addDays(checkOutDate, 1);

            // Determine summary based on status
            let summary = "Reserved";
            if (b.status === "pending") summary = "Reserved (Pending)";
            else if (b.status === "completed") summary = "Completed Stay";

            cal.createEvent({
                id: `booking-${b.id}@houseofmirrors.rs`,
                start: parseISO(b.checkIn),
                end: endDateExclusive,
                allDay: true,
                summary,
                description: `Booking ID: ${b.id}`,
                busystatus: ICalEventBusyStatus.BUSY,
                status: b.status === "pending" ? ICalEventStatus.TENTATIVE : ICalEventStatus.CONFIRMED
            });
        }

        // 5. Add blocked dates (exclude past blocks)
        for (const blk of blockedDates) {
            const endDateInclusive = parseISO(blk.endDate);
            
            // Skip past blocked dates (cleanup)
            if (isBefore(endDateInclusive, today)) continue;

            // Manual blocks are stored as inclusive [start, end].
            // To make the last day busy in iCal, we must set DTEND to end + 1.
            const startDate = parseISO(blk.startDate);
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
                "X-Refresh-Interval": `${CALENDAR_TTL_HOURS * 3600}`,
            },
        });
    } catch (error) {
        console.error("Calendar API error:", error);
        return new NextResponse("Failed to generate calendar", { status: 500 });
    }
}
