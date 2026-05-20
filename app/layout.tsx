import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "./ConvexClientProvider";

export const metadata: Metadata = {
  title: "Zoro Trip Planner",
  description: "Your AI-powered compass to the world. Craft personalized travel experiences in seconds.",
  icons: {
    icon: "/logo-v2.png",
  },
};

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={outfit.className} >
          <ConvexClientProvider>
            {children}
            <Analytics />
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
