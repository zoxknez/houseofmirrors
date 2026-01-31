"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const hideChrome = pathname.startsWith("/admin");

    return (
        <>
            {!hideChrome && <Navbar />}
            {children}
            {!hideChrome && <Footer />}
        </>
    );
}
