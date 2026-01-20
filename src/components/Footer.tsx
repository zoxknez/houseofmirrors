import Link from "next/link";
import { Heart, ExternalLink } from "lucide-react";
import { propertyData } from "@/data/property";

const footerLinks = {
    navigation: [
        { label: "Početna", href: "/" },
        { label: "Galerija", href: "#gallery" },
        { label: "Pogodnosti", href: "#amenities" },
        { label: "Lokacija", href: "#location" },
        { label: "Kontakt", href: "#contact" }
    ],
    external: [
        { label: "Booking.com", href: "https://www.booking.com/hotel/rs/house-of-mirrors-beograd.hr.html" },
        { label: "Airbnb", href: "https://www.airbnb.com/rooms/1562587044814690888" }
    ]
};

export function Footer() {
    return (
        <footer className="bg-[var(--primary)] border-t border-white/10">
            <div className="container py-12">
                <div className="grid md:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <h3 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-6">
                            {propertyData.name}
                        </h3>
                        <p className="text-white/60 mb-4 max-w-md">
                            {propertyData.shortDescription}
                        </p>
                        <p className="text-white/40 text-sm">
                            {propertyData.location.address}<br />
                            {propertyData.location.postalCode} {propertyData.location.city}
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Navigacija</h4>
                        <ul className="space-y-2">
                            {footerLinks.navigation.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        className="text-white/60 hover:text-white transition-colors text-sm"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* External Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Takođe nas pronađite</h4>
                        <ul className="space-y-2">
                            {footerLinks.external.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white/60 hover:text-white transition-colors text-sm inline-flex items-center gap-1"
                                    >
                                        {link.label}
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-10 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-white/40 text-sm">
                        © {new Date().getFullYear()} {propertyData.name}. Sva prava zadržana.
                    </p>
                    <p className="text-white/40 text-sm flex items-center gap-1">
                        Napravljeno sa <Heart className="w-4 h-4 text-[var(--accent)] fill-[var(--accent)]" /> u Beogradu
                    </p>
                </div>
            </div>
        </footer>
    );
}
