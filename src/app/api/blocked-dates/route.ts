import { NextRequest, NextResponse } from "next/server";
import {
    getBlockedDates,
    addBlockedDate,
    removeBlockedDate,
    generateBlockedDateId,
} from "@/lib/data";
import type { BlockedDate } from "@/types";

// Get all blocked dates
export async function GET() {
    try {
        const blockedDates = await getBlockedDates();
        return NextResponse.json({ blockedDates });
    } catch (error) {
        console.error("Blocked dates GET error:", error);
        return NextResponse.json(
            { error: "Greška pri dohvatanju blokiranih datuma" },
            { status: 500 }
        );
    }
}

// Add new blocked date range
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { startDate, endDate, reason } = body as {
            startDate?: string;
            endDate?: string;
            reason?: string;
        };

        // Validate
        if (!startDate || !endDate) {
            return NextResponse.json(
                { error: "Početni i krajnji datum su obavezni" },
                { status: 400 }
            );
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
            return NextResponse.json(
                { error: "Nevažeći format datuma (koristite YYYY-MM-DD)" },
                { status: 400 }
            );
        }

        if (new Date(endDate) < new Date(startDate)) {
            return NextResponse.json(
                { error: "Krajnji datum mora biti posle početnog" },
                { status: 400 }
            );
        }

        const blockedDate: BlockedDate = {
            id: generateBlockedDateId(),
            startDate,
            endDate,
            reason: reason || undefined,
            createdAt: new Date().toISOString(),
            createdBy: "admin",
        };

        await addBlockedDate(blockedDate);

        return NextResponse.json({
            success: true,
            blockedDate,
        });
    } catch (error) {
        console.error("Blocked dates POST error:", error);
        return NextResponse.json(
            { error: "Greška pri blokiranju datuma" },
            { status: 500 }
        );
    }
}

// Delete blocked date
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "ID je obavezan" },
                { status: 400 }
            );
        }

        const deleted = await removeBlockedDate(id);

        if (!deleted) {
            return NextResponse.json(
                { error: "Blokirani datum nije pronađen" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Blocked dates DELETE error:", error);
        return NextResponse.json(
            { error: "Greška pri uklanjanju blokade" },
            { status: 500 }
        );
    }
}
