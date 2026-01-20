import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

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
  title: "House of Mirrors | Luksuzni apartman u Beogradu",
  description:
    "Jedinstveni luksuzni apartman sa ogledalima u srcu Beograda. Profesionalna masažna fotelja, 5.1 Hi-Fi sistem, Netflix i HBO Max. Rezervišite direktno za najbolje cene.",
  keywords: [
    "apartman beograd",
    "luksuzni smestaj beograd",
    "kratkoročno iznajmljivanje",
    "house of mirrors",
    "stan na dan beograd",
    "airbnb beograd"
  ],
  authors: [{ name: "House of Mirrors" }],
  openGraph: {
    title: "House of Mirrors | Luksuzni apartman u Beogradu",
    description:
      "Jedinstveni luksuzni apartman sa ogledalima u srcu Beograda. Profesionalna masažna fotelja, 5.1 Hi-Fi sistem, Netflix i HBO Max.",
    type: "website",
    locale: "sr_RS",
    images: [
      {
        url: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/786323726.jpg",
        width: 1024,
        height: 768,
        alt: "House of Mirrors - Dnevna soba"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "House of Mirrors | Luksuzni apartman u Beogradu",
    description:
      "Jedinstveni luksuzni apartman sa ogledalima u srcu Beograda."
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
    <html lang="sr" className="scroll-smooth">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased min-h-screen`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
