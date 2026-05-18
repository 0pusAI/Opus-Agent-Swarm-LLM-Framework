import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "OPUS — Ars Magna",
  description:
    "A bio-inspired multi-agent swarm architecture for collective reasoning. Built and broadcast in public.",
  metadataBase: new URL("https://www.tryopusai.com"),
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
        <Nav />
        {children}
      </body>
    </html>
  );
}
