import nodemailer from "nodemailer";
import type { Booking, BookingStatus } from "@/types";
import { propertyData } from "@/data/property";

const SMTP_CONFIG = {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
};

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";
const FROM_EMAIL = process.env.SMTP_USER || "noreply@houseofmirrors.rs";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://houseofmirrors.rs";

function createTransporter() {
    if (!SMTP_CONFIG.auth.user || !SMTP_CONFIG.auth.pass) {
        console.warn("⚠️ SMTP credentials not configured. Email sending disabled.");
        return null;
    }
    return nodemailer.createTransport(SMTP_CONFIG);
}

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("sr-RS", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function formatPrice(amount: number): string {
    return `${amount.toFixed(2)} EUR`;
}

// ==================== EMAIL TEMPLATES ====================

function getGuestConfirmationHtml(booking: Booking): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #c9a227 0%, #d4af37 100%); color: #000; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .booking-details { background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .booking-details h3 { color: #c9a227; margin-top: 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .detail-row:last-child { border-bottom: none; }
        .label { color: #666; }
        .value { font-weight: 600; }
        .total { font-size: 1.2em; color: #c9a227; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .status-pending { color: #f59e0b; font-weight: bold; }
        .status-confirmed { color: #10b981; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✨ ${propertyData.name}</h1>
            <p>Potvrda rezervacije</p>
        </div>
        <div class="content">
            <p>Poštovani/a <strong>${booking.firstName}</strong>,</p>
            <p>Hvala Vam na rezervaciji! Vaš zahtev za rezervaciju je primljen.</p>
            
            <div class="booking-details">
                <h3>Detalji rezervacije</h3>
                <div class="detail-row">
                    <span class="label">Broj rezervacije:</span>
                    <span class="value">${booking.id}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Status:</span>
                    <span class="value ${booking.status === "confirmed" ? "status-confirmed" : "status-pending"}">
                        ${booking.status === "confirmed" ? "✅ Potvrđeno" : "⏳ Čeka potvrdu"}
                    </span>
                </div>
                <div class="detail-row">
                    <span class="label">Check-in:</span>
                    <span class="value">${formatDate(booking.checkIn)} (od 14:00)</span>
                </div>
                <div class="detail-row">
                    <span class="label">Check-out:</span>
                    <span class="value">${formatDate(booking.checkOut)} (do 11:00)</span>
                </div>
                <div class="detail-row">
                    <span class="label">Broj gostiju:</span>
                    <span class="value">${booking.guests}</span>
                </div>
                <div class="detail-row">
                    <span class="label total">Ukupno:</span>
                    <span class="value total">${formatPrice(booking.totalPrice)}</span>
                </div>
            </div>
            
            <p><strong>Adresa:</strong><br>${propertyData.location.address}, ${propertyData.location.city}</p>
            
            <p>Kontaktiraćemo Vas uskoro sa dodatnim informacijama.</p>
            
            <p>Srdačan pozdrav,<br><strong>${propertyData.host.name}</strong></p>
        </div>
        <div class="footer">
            <p>${propertyData.name} | ${propertyData.location.city}, ${propertyData.location.country}</p>
        </div>
    </div>
</body>
</html>
    `;
}

function getAdminNotificationHtml(booking: Booking): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a1a2e; color: #c9a227; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f5f5f5; padding: 30px; }
        .guest-info { background: #fff; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .booking-info { background: #fff; padding: 20px; border-radius: 8px; }
        h3 { color: #1a1a2e; margin-top: 0; }
        .detail-row { padding: 8px 0; border-bottom: 1px solid #eee; }
        .btn { display: inline-block; padding: 12px 24px; background: #c9a227; color: #000; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔔 Nova rezervacija!</h1>
        </div>
        <div class="content">
            <div class="guest-info">
                <h3>👤 Podaci gosta</h3>
                <div class="detail-row"><strong>Ime:</strong> ${booking.firstName} ${booking.lastName}</div>
                <div class="detail-row"><strong>Email:</strong> ${booking.email}</div>
                <div class="detail-row"><strong>Telefon:</strong> ${booking.phone}</div>
                ${booking.message ? `<div class="detail-row"><strong>Poruka:</strong> ${booking.message}</div>` : ""}
            </div>
            
            <div class="booking-info">
                <h3>📅 Detalji rezervacije</h3>
                <div class="detail-row"><strong>ID:</strong> ${booking.id}</div>
                <div class="detail-row"><strong>Check-in:</strong> ${formatDate(booking.checkIn)}</div>
                <div class="detail-row"><strong>Check-out:</strong> ${formatDate(booking.checkOut)}</div>
                <div class="detail-row"><strong>Gosti:</strong> ${booking.guests}</div>
                <div class="detail-row"><strong>Ukupno:</strong> ${formatPrice(booking.totalPrice)}</div>
            </div>
            
            <center>
                <a href="${APP_URL}/admin" class="btn">Otvori Admin Panel</a>
            </center>
        </div>
    </div>
</body>
</html>
    `;
}

function getStatusChangeHtml(booking: Booking, newStatus: BookingStatus): string {
    const statusMessages: Record<BookingStatus, { title: string; message: string; color: string }> = {
        confirmed: {
            title: "✅ Rezervacija potvrđena!",
            message: "Vaša rezervacija je potvrđena. Radujemo se Vašem dolasku!",
            color: "#10b981",
        },
        cancelled: {
            title: "❌ Rezervacija otkazana",
            message: "Vaša rezervacija je otkazana. Ako imate pitanja, kontaktirajte nas.",
            color: "#ef4444",
        },
        completed: {
            title: "🏠 Hvala na poseti!",
            message: "Nadamo se da ste uživali u boravku. Bilo bi nam drago da nas ponovo posetite!",
            color: "#6366f1",
        },
        pending: {
            title: "⏳ Rezervacija na čekanju",
            message: "Vaša rezervacija čeka potvrdu. Kontaktiraćemo Vas uskoro.",
            color: "#f59e0b",
        },
    };

    const status = statusMessages[newStatus];

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: ${status.color}; color: #fff; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .booking-id { background: #fff; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${status.title}</h1>
        </div>
        <div class="content">
            <p>Poštovani/a <strong>${booking.firstName}</strong>,</p>
            <p>${status.message}</p>
            
            <div class="booking-id">
                <strong>Broj rezervacije:</strong> ${booking.id}<br>
                <strong>Datumi:</strong> ${formatDate(booking.checkIn)} - ${formatDate(booking.checkOut)}
            </div>
            
            <p>Srdačan pozdrav,<br><strong>${propertyData.host.name}</strong><br>${propertyData.name}</p>
        </div>
    </div>
</body>
</html>
    `;
}

// ==================== SEND FUNCTIONS ====================

export async function sendBookingConfirmation(booking: Booking): Promise<boolean> {
    const transporter = createTransporter();
    if (!transporter) {
        console.log("📧 [MOCK] Would send confirmation to:", booking.email);
        return true;
    }

    try {
        await transporter.sendMail({
            from: `"${propertyData.name}" <${FROM_EMAIL}>`,
            to: booking.email,
            subject: `Potvrda rezervacije - ${propertyData.name} (#${booking.id})`,
            html: getGuestConfirmationHtml(booking),
        });
        console.log("📧 Confirmation email sent to:", booking.email);
        return true;
    } catch (error) {
        console.error("Failed to send confirmation email:", error);
        return false;
    }
}

export async function sendNewBookingNotification(booking: Booking): Promise<boolean> {
    const transporter = createTransporter();
    if (!transporter || !ADMIN_EMAIL) {
        console.log("📧 [MOCK] Would send admin notification for booking:", booking.id);
        return true;
    }

    try {
        await transporter.sendMail({
            from: `"${propertyData.name}" <${FROM_EMAIL}>`,
            to: ADMIN_EMAIL,
            subject: `🔔 Nova rezervacija: ${booking.firstName} ${booking.lastName} (${booking.checkIn})`,
            html: getAdminNotificationHtml(booking),
        });
        console.log("📧 Admin notification sent for booking:", booking.id);
        return true;
    } catch (error) {
        console.error("Failed to send admin notification:", error);
        return false;
    }
}

export async function sendStatusChangeEmail(
    booking: Booking,
    newStatus: BookingStatus
): Promise<boolean> {
    const transporter = createTransporter();
    if (!transporter) {
        console.log("📧 [MOCK] Would send status change email to:", booking.email);
        return true;
    }

    const subjects: Record<BookingStatus, string> = {
        confirmed: `✅ Rezervacija potvrđena - ${propertyData.name}`,
        cancelled: `Rezervacija otkazana - ${propertyData.name}`,
        completed: `Hvala na poseti! - ${propertyData.name}`,
        pending: `Rezervacija na čekanju - ${propertyData.name}`,
    };

    try {
        await transporter.sendMail({
            from: `"${propertyData.name}" <${FROM_EMAIL}>`,
            to: booking.email,
            subject: subjects[newStatus],
            html: getStatusChangeHtml(booking, newStatus),
        });
        console.log("📧 Status change email sent to:", booking.email);
        return true;
    } catch (error) {
        console.error("Failed to send status change email:", error);
        return false;
    }
}
