import { NextResponse } from "next/server";
import { getBookings, getBlockedDates } from "@/lib/data";
import type { BookedDateInfo } from "@/types";

// iCal source URLs from environment
const ICAL_SOURCES = {
    booking: process.env.BOOKING_ICAL_URL || "",
    airbnb: process.env.AIRBNB_ICAL_URL || "",
};

// Cache
let cachedAvailability: {
    data: BookedDateInfo[];
    timestamp: number;
} | null = null;

const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

// Parse iCal data
function parseICalData(icalString: string, source: "booking" | "airbnb"): BookedDateInfo[] {
    const events: BookedDateInfo[] = [];
    const lines = icalString.split(/\r?\n/);

    let currentEvent: Partial<BookedDateInfo> | null = null;

    for (const line of lines) {
        if (line.startsWith("BEGIN:VEVENT")) {
            currentEvent = { source };
        } else if (line.startsWith("END:VEVENT") && currentEvent) {
            if (currentEvent.start && currentEvent.end) {
                events.push(currentEvent as BookedDateInfo);
            }
            currentEvent = null;
        } else if (currentEvent) {
            // iCal standard: DTEND is exclusive for DATE values.
            // Booking.com and Airbnb follow this (DTEND = checkout day).
            if (line.startsWith("DTSTART")) {
                const match = line.match(/:(.*)$/);
                if (match) currentEvent.start = parseICalDate(match[1]);
            } else if (line.startsWith("DTEND")) {
                const match = line.match(/:(.*)$/);
                if (match) currentEvent.end = parseICalDate(match[1]);
            } else if (line.startsWith("SUMMARY:")) {
                currentEvent.summary = line.substring(8).trim();
            }
        }
    }

    return events;
}

function parseICalDate(value: string): string {
    // Input could be 20260110 or 20260110T120000Z
    if (value && value.length >= 8) {
        const year = value.substring(0, 4);
        const month = value.substring(4, 6);
        const day = value.substring(6, 8);
        return `${year}-${month}-${day}`;
    }
    return value;
}

async function fetchICalFeed(url: string, source: "booking" | "airbnb"): Promise<BookedDateInfo[]> {
    if (!url) return [];

    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "HouseOfMirrors Calendar Sync",
            },
            next: { revalidate: 900 },
        });

        if (!response.ok) {
            console.error(`Failed to fetch iCal from ${source}: ${response.status}`);
            return [];
        }

        const icalData = await response.text();
        return parseICalData(icalData, source);
    } catch (error) {
        console.error(`Error fetching iCal from ${source}:`, error);
        return [];
    }
}

async function fetchAllAvailability(): Promise<BookedDateInfo[]> {
    // Check cache
    if (cachedAvailability && Date.now() - cachedAvailability.timestamp < CACHE_TTL) {
        return cachedAvailability.data;
    }

    // Fetch from all sources in parallel
    const [bookingDates, airbnbDates, localBookings, blockedDates] = await Promise.all([
        fetchICalFeed(ICAL_SOURCES.booking, "booking"),
        fetchICalFeed(ICAL_SOURCES.airbnb, "airbnb"),
        getLocalBookings(),
        getBlockedDatesForAvailability(),
    ]);

    const allDates = [...bookingDates, ...airbnbDates, ...localBookings, ...blockedDates];

    // Update cache
    cachedAvailability = {
        data: allDates,
        timestamp: Date.now(),
    };

    return allDates;
}

async function getLocalBookings(): Promise<BookedDateInfo[]> {
    try {
        const bookings = await getBookings();
        return bookings
            .filter((b) => b.status !== "cancelled")
            .map((b) => ({
                start: b.checkIn,
                end: b.checkOut,
                source: "direct" as const,
                summary: `${b.firstName} ${b.lastName}`,
            }));
    } catch {
        return [];
    }
}

async function getBlockedDatesForAvailability(): Promise<BookedDateInfo[]> {
    try {
        const blocked = await getBlockedDates();
        return blocked.map((b) => ({
            start: b.startDate,
            end: b.endDate,
            source: "blocked" as const,
            summary: b.reason || "Blocked",
        }));
    } catch {
        return [];
    }
}

export async function GET() {
    try {
        const bookedDates = await fetchAllAvailability();

        return NextResponse.json({
            bookedDates,
            lastUpdated: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Availability API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch availability" },
            { status: 500 }
        );
    }
}

// Force cache refresh
export async function POST() {
    cachedAvailability = null;
    return GET();
}
