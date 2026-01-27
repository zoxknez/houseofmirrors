import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { LanguageProvider } from "@/context/LanguageContext";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap"
});

const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  variable: "--font-outfit",
  display: "swap"
});

export const metadata: Metadata = {
  title: "House of Mirrors | Luxury Apartment Belgrade",
  description:
    "Unique luxury apartment with mirrors in the heart of Belgrade. Professional massage chair, 5.1 Hi-Fi system, Netflix & HBO Max. Book directly for best rates.",
  keywords: [
    "apartment belgrade",
    "luxury accommodation belgrade",
    "short term rental",
    "house of mirrors",
    "vacation rental belgrade",
    "airbnb belgrade"
  ],
  authors: [{ name: "House of Mirrors" }],
  openGraph: {
    title: "House of Mirrors | Luxury Apartment Belgrade",
    description:
      "Unique luxury apartment with mirrors in the heart of Belgrade. Professional massage chair, 5.1 Hi-Fi system, Netflix & HBO Max. Book directly for best rates.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/786323726.jpg",
        width: 1024,
        height: 768,
        alt: "House of Mirrors - Living Room"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "House of Mirrors | Luxury Apartment Belgrade",
    description:
      "Unique luxury apartment with mirrors in the heart of Belgrade."
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050510"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} antialiased min-h-screen`}
      >
        <LanguageProvider>
          <Navbar />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
