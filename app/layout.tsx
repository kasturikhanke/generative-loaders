import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://progress-narrative.kkasturi2502.chatgpt.site"),
  title: "Progress Narrative — 12 animated thinking steps",
  description: "Twelve polished Framer Motion variations for showing clear operational progress in React agent interfaces.",
  openGraph: {
    title: "Progress Narrative",
    description: "Twelve polished Framer Motion variations for agent thinking steps.",
    images: [{ url: "/og-v4.png", width: 1536, height: 1024, alt: "Progress Narrative — 12 Framer Motion variations" }],
  },
  twitter: { card: "summary_large_image", title: "Progress Narrative", description: "12 Framer Motion variations for agent thinking steps.", images: ["/og-v4.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
