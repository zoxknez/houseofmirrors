import { NextRequest, NextResponse } from "next/server";
import {
    getBookingById,
    updateBookingStatus,
    deleteBooking,
} from "@/lib/data";
import { sendStatusChangeEmail } from "@/lib/email";
import type { BookingStatus } from "@/types";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// Get single booking
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const booking = await getBookingById(id);

        if (!booking) {
            return NextResponse.json(
                { error: "Rezervacija nije pronađena" },
                { status: 404 }
            );
        }

        return NextResponse.json({ booking });
    } catch (error) {
        console.error("Booking GET error:", error);
        return NextResponse.json(
            { error: "Greška pri dohvatanju rezervacije" },
            { status: 500 }
        );
    }
}

// Update booking status
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await request.json();

        const { status, notes } = body as { status?: BookingStatus; notes?: string };

        if (!status || !["pending", "confirmed", "cancelled", "completed"].includes(status)) {
            return NextResponse.json(
                { error: "Nevažeći status" },
                { status: 400 }
            );
        }

        const booking = await getBookingById(id);
        if (!booking) {
            return NextResponse.json(
                { error: "Rezervacija nije pronađena" },
                { status: 404 }
            );
        }

        const previousStatus = booking.status;
        const updatedBooking = await updateBookingStatus(id, status, notes);

        if (!updatedBooking) {
            return NextResponse.json(
                { error: "Greška pri ažuriranju" },
                { status: 500 }
            );
        }

        // Send status change email if status actually changed
        if (previousStatus !== status) {
            sendStatusChangeEmail(updatedBooking, status).catch(console.error);
        }

        return NextResponse.json({
            success: true,
            booking: updatedBooking,
        });
    } catch (error) {
        console.error("Booking PATCH error:", error);
        return NextResponse.json(
            { error: "Greška pri ažuriranju rezervacije" },
            { status: 500 }
        );
    }
}

// Delete booking
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const deleted = await deleteBooking(id);

        if (!deleted) {
            return NextResponse.json(
                { error: "Rezervacija nije pronađena" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Booking DELETE error:", error);
        return NextResponse.json(
            { error: "Greška pri brisanju rezervacije" },
            { status: 500 }
        );
    }
}
