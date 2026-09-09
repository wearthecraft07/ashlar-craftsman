import type { Metadata } from "next";
import { Outfit, Syne } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import "./globals.css";

const display = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700"],
  display: "swap",
});

const body = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "the ASHLAR CRAFTSMAN — Craft Your Journey",
    template: "%s · the ASHLAR CRAFTSMAN",
  },
  description:
    "Masonic-inspired apparel for Brothers who carry the Craft beyond the Lodge. Build your Craftsman. Wear the mark.",
  icons: {
    icon: "/logo-mark.png",
    apple: "/logo-mark.png",
  },
  openGraph: {
    title: "the ASHLAR CRAFTSMAN",
    description:
      "Craft your character. Masonic-inspired apparel and Avatar Studio for Brothers of the Craft.",
    type: "website",
    locale: "en_US",
    images: [{ url: "/logo-mark.png", width: 1024, height: 1024 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "the ASHLAR CRAFTSMAN",
    description: "Craft Your Journey.",
    images: ["/logo-mark.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} antialiased`}>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
