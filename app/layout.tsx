import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Progress Narrative — Readable progress for React agents",
  description: "Turn structured agent events into calm, animated operational updates with accessible history.",
  openGraph: {
    title: "Progress Narrative",
    description: "Show the work. Skip the spinner.",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "Progress Narrative — Show the work. Skip the spinner." }],
  },
  twitter: { card: "summary_large_image", title: "Progress Narrative", description: "Show the work. Skip the spinner.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
