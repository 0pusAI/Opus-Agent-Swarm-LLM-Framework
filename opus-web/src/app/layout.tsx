import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "OPUS — Ars Magna",
  description:
    "A bio-inspired multi-agent swarm architecture for collective reasoning. Built and broadcast in public.",
  metadataBase: new URL("https://opus.local"),
  openGraph: {
    title: "OPUS — Ars Magna",
    description: "A bio-inspired multi-agent swarm architecture for collective reasoning.",
    type: "website",
    locale: "en_US",
    siteName: "OPUS",
  },
  twitter: {
    card: "summary_large_image",
    title: "OPUS — Ars Magna",
    description: "A bio-inspired multi-agent swarm architecture for collective reasoning.",
  },
  icons: {
    icon: "/opus-sphere.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="opus-grain min-h-screen bg-opus-black text-opus-bone antialiased">
        {children}
      </body>
    </html>
  );
}
