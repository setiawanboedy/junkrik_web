import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beranda",
  description: "Platform digital terdepan untuk pengelolaan sampah bisnis dengan sistem reward, laporan kepatuhan EPR, dan kredit plastik. Bergabunglah dengan bisnis yang peduli lingkungan.",
  keywords: [
    "pengelolaan sampah bisnis",
    "daur ulang",
    "EPR Indonesia",
    "kredit plastik",
    "sustainability B2B",
    "waste management Indonesia"
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Junkrik - Solusi Pengelolaan Sampah B2B Indonesia",
    description: "Platform digital terdepan untuk pengelolaan sampah bisnis dengan sistem reward dan kepatuhan EPR",
    url: "/",
    type: "website",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Junkrik - Solusi Pengelolaan Sampah B2B Indonesia",
      },
    ],
  },
};
