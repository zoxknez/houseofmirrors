import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const SESSION_COOKIE_NAME = "hom_admin_session";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

function generateSessionToken(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

// Login
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { password } = body as { password?: string };

        if (!password) {
            return NextResponse.json(
                { error: "Lozinka je obavezna" },
                { status: 400 }
            );
        }

        if (password !== ADMIN_PASSWORD) {
            return NextResponse.json(
                { error: "Pogrešna lozinka" },
                { status: 401 }
            );
        }

        const token = generateSessionToken();
        const expiresAt = Date.now() + SESSION_DURATION;

        const cookieStore = await cookies();
        cookieStore.set(SESSION_COOKIE_NAME, `${token}:${expiresAt}`, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: SESSION_DURATION / 1000,
            path: "/",
        });

        return NextResponse.json({
            success: true,
            expiresAt,
        });
    } catch (error) {
        console.error("Auth POST error:", error);
        return NextResponse.json(
            { error: "Greška pri prijavi" },
            { status: 500 }
        );
    }
}

// Check session
export async function GET() {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

        if (!sessionCookie?.value) {
            return NextResponse.json({ authenticated: false });
        }

        const [, expiresAt] = sessionCookie.value.split(":");
        const expiry = parseInt(expiresAt, 10);

        if (isNaN(expiry) || Date.now() > expiry) {
            return NextResponse.json({ authenticated: false });
        }

        return NextResponse.json({
            authenticated: true,
            expiresAt: expiry,
        });
    } catch (error) {
        console.error("Auth GET error:", error);
        return NextResponse.json({ authenticated: false });
    }
}

// Logout
export async function DELETE() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete(SESSION_COOKIE_NAME);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Auth DELETE error:", error);
        return NextResponse.json(
            { error: "Greška pri odjavi" },
            { status: 500 }
        );
    }
}
