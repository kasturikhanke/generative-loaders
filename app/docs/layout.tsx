import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation — Generative Loaders",
  description: "Install and use accessible text, inline, and image generation loaders in React.",
  alternates: { canonical: "/docs" },
};

export default function DocsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
