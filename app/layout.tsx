import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "generative-loaders/styles.css";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://generative-loaders.kkasturi2502.chatgpt.site"),
  title: "Generative Loaders — text, inline, and image loaders for React",
  description: "Animated React loaders for text, inline, and image generation states.",
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }], shortcut: "/favicon.svg" },
  openGraph: {
    title: "Generative Loaders",
    description: "Animated React loaders for text, inline, and image generation states.",
    images: [{ url: "/generative-loaders-og.png", width: 1536, height: 1024, alt: "Generative Loaders for React" }],
  },
  twitter: { card: "summary_large_image", title: "Generative Loaders", description: "Animated React loaders for text, inline, and image generation states.", images: ["/generative-loaders-og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}catch(e){}})()` }} /></head><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
