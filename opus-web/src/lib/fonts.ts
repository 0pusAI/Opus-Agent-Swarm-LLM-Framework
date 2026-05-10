/**
 * Self-hosted fonts via next/font/google.
 * Returns CSS variables that tailwind.config.ts wires into font-family stacks.
 */

import { Cormorant_Garamond, Cinzel, Inter, JetBrains_Mono } from "next/font/google";

export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-cinzel",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const fontVariables = [
  cormorant.variable,
  cinzel.variable,
  inter.variable,
  jetbrains.variable,
].join(" ");
