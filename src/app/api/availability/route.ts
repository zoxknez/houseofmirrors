import { NextResponse } from "next/server";

// In production, these would come from environment variables
const ICAL_SOURCES = {
    // These are placeholder URLs - user will replace with real iCal feeds
    booking: process.env.BOOKING_ICAL_URL || "",
    airbnb: process.env.AIRBNB_ICAL_URL || ""
};

// Simple in-memory cache
let cachedAvailability: {
    data: BookedDate[];
    timestamp: number;
} | null = null;

const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

interface BookedDate {
    start: string;
    end: string;
    source: string;
    summary?: string;
}

// Parse iCal data manually (simple implementation)
function parseICalData(icalString: string, source: string): BookedDate[] {
    const events: BookedDate[] = [];
    const lines = icalString.split(/\r?\n/);

    let currentEvent: Partial<BookedDate> | null = null;

    for (const line of lines) {
        if (line.startsWith("BEGIN:VEVENT")) {
            currentEvent = { source };
        } else if (line.startsWith("END:VEVENT") && currentEvent) {
            if (currentEvent.start && currentEvent.end) {
                events.push(currentEvent as BookedDate);
            }
            currentEvent = null;
        } else if (currentEvent) {
            if (line.startsWith("DTSTART")) {
                const value = line.split(":")[1];
                currentEvent.start = parseICalDate(value);
            } else if (line.startsWith("DTEND")) {
                const value = line.split(":")[1];
                currentEvent.end = parseICalDate(value);
            } else if (line.startsWith("SUMMARY:")) {
                currentEvent.summary = line.substring(8);
            }
        }
    }

    return events;
}

function parseICalDate(value: string): string {
    // Handle formats like 20260120 or 20260120T140000Z
    if (value.length >= 8) {
        const year = value.substring(0, 4);
        const month = value.substring(4, 6);
        const day = value.substring(6, 8);
        return `${year}-${month}-${day}`;
    }
    return value;
}

async function fetchICalFeed(url: string, source: string): Promise<BookedDate[]> {
    if (!url) return [];

    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "HouseOfMirrors Calendar Sync"
            },
            next: { revalidate: 900 } // Revalidate every 15 minutes
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

async function fetchAllAvailability(): Promise<BookedDate[]> {
    // Check cache
    if (cachedAvailability && Date.now() - cachedAvailability.timestamp < CACHE_TTL) {
        return cachedAvailability.data;
    }

    // Fetch from all sources
    const [bookingDates, airbnbDates] = await Promise.all([
        fetchICalFeed(ICAL_SOURCES.booking, "booking"),
        fetchICalFeed(ICAL_SOURCES.airbnb, "airbnb")
    ]);

    // Get local bookings (from our database/file)
    const localBookings = await getLocalBookings();

    const allDates = [...bookingDates, ...airbnbDates, ...localBookings];

    // Update cache
    cachedAvailability = {
        data: allDates,
        timestamp: Date.now()
    };

    return allDates;
}

// Get bookings from local storage/database
async function getLocalBookings(): Promise<BookedDate[]> {
    // In production, this would fetch from a database
    // For now, return from a JSON file or empty array
    try {
        const fs = await import("fs/promises");
        const path = await import("path");
        const filePath = path.join(process.cwd(), "data", "bookings.json");

        try {
            const data = await fs.readFile(filePath, "utf-8");
            const bookings = JSON.parse(data);
            return bookings.map((b: { checkIn: string; checkOut: string }) => ({
                start: b.checkIn,
                end: b.checkOut,
                source: "direct"
            }));
        } catch {
            // File doesn't exist yet
            return [];
        }
    } catch {
        return [];
    }
}

export async function GET() {
    try {
        const bookedDates = await fetchAllAvailability();

        return NextResponse.json({
            bookedDates,
            lastUpdated: new Date().toISOString()
        });
    } catch (error) {
        console.error("Availability API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch availability" },
            { status: 500 }
        );
    }
}
