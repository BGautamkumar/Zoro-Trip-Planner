import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "./ConvexClientProvider";

const APP_URL = "https://zoro-trip-planner.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "Zoro Trip Planner — AI-Powered Travel Itineraries",
    template: "%s | Zoro Trip Planner",
  },
  description:
    "Plan your perfect trip in seconds with AI. Get personalized day-by-day itineraries, real budget estimates, hotel suggestions, and weather forecasts — all for free.",
  keywords: [
    "AI trip planner",
    "travel itinerary generator",
    "trip planning AI",
    "travel budget calculator",
    "day-by-day travel plan",
    "free trip planner",
    "Zoro trip planner",
  ],
  authors: [{ name: "Zoro Trip Planner" }],
  creator: "Zoro Trip Planner",
  publisher: "Zoro Trip Planner",
  metadataBase: new URL(APP_URL),
  icons: {
    icon: "/logo-v2.png",
    apple: "/logo-v2.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: "Zoro Trip Planner",
    title: "Zoro Trip Planner — AI-Powered Travel Itineraries",
    description:
      "Craft personalized travel experiences in seconds. Day-by-day plans, real budgets, weather forecasts, and hotel suggestions — powered by AI.",
    images: [
      {
        url: `${APP_URL}/logo-v2.png`,
        width: 512,
        height: 512,
        alt: "Zoro Trip Planner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zoro Trip Planner — AI-Powered Travel Itineraries",
    description:
      "Plan your perfect trip in seconds with AI. Personalized itineraries, budget estimates, and more.",
    images: [`${APP_URL}/logo-v2.png`],
    creator: "@ZoroTripPlanner",
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
  alternates: {
    canonical: APP_URL,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1D3A" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

// JSON-LD structured data for the homepage
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Zoro Trip Planner",
  url: APP_URL,
  description:
    "AI-powered travel planning. Craft personalized trip itineraries with day-by-day plans, budget estimates, and hotel suggestions.",
  applicationCategory: "TravelApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
  },
  creator: {
    "@type": "Organization",
    name: "Zoro Trip Planner",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/logo-v2.png" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </head>
        <body className={outfit.className}>
          <ConvexClientProvider>
            {children}
          </ConvexClientProvider>
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
