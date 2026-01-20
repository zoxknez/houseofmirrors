import { NextResponse } from "next/server";
import { getBookingStats } from "@/lib/data";

export async function GET() {
    try {
        const stats = await getBookingStats();
        return NextResponse.json(stats);
    } catch (error) {
        console.error("Stats API error:", error);
        return NextResponse.json(
            { error: "Greška pri dohvatanju statistike" },
            { status: 500 }
        );
    }
}
