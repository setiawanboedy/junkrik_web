import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/components/ui/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Junkrik",
    default: "Junkrik - Solusi Pengelolaan Sampah B2B",
  },
  description: "Platform digital untuk mengelola sampah bisnis dengan sistem reward, laporan kepatuhan EPR, dan kredit plastik. Mendukung bisnis menuju keberlanjutan lingkungan.",
  keywords: ["pengelolaan sampah", "B2B", "daur ulang", "EPR", "kredit plastik", "sustainability", "waste management", "Indonesia"],
  authors: [{ name: "Junkrik Team" }],
  creator: "Junkrik",
  publisher: "Junkrik",
  metadataBase: new URL('https://junkrik.com'),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Junkrik - Solusi Pengelolaan Sampah B2B",
    description: "Platform digital untuk mengelola sampah bisnis dengan sistem reward dan kepatuhan EPR",
    url: "https://junkrik.com",
    siteName: "Junkrik",
    type: "website",
    locale: "id_ID",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Junkrik - Solusi Pengelolaan Sampah B2B",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Junkrik - Solusi Pengelolaan Sampah B2B",
    description: "Platform digital untuk mengelola sampah bisnis dengan sistem reward dan kepatuhan EPR",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
