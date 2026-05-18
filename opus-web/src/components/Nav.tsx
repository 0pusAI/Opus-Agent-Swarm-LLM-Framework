"use client";

/**
 * Nav — fixed top navigation.
 *
 * Six buttons (OpusAI · Whitepaper · API · Build Log · Autogenesis · Team)
 * in the OPUS aesthetic: mono uppercase labels, animated gold underline on
 * hover, tiny sphere brand mark on the left. Persists across all pages.
 *
 * Mobile: the brand mark + divider stay anchored on the left; the six nav
 * items live in a horizontally scrollable row to their right. A subtle
 * right-edge fade hints at more items off-screen. Native touch swiping
 * works out of the box via `overflow-x-auto` + `overscroll-x-contain`.
 *
 * Desktop: the row is wide enough that nothing scrolls. Behaviour identical
 * to the original.
 */

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import clsx from "clsx";

interface NavItem {
  label: string;
  href: string;
  scrollTo?: string; // element id to scroll to on the homepage
}

const ITEMS: NavItem[] = [
  { label: "OpusAI",       href: "/live-swarm" },
  { label: "Whitepaper",   href: "/whitepaper" },
  { label: "API",          href: "/api" },
  { label: "Build Log",    href: "/build-log" },
  { label: "Autogenesis",  href: "/autogenesis" },
  { label: "Team",         href: "/team" },
];

export function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  // Slight backdrop appears once user scrolls — keeps hero clean
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
      // Smooth-scroll if we're already on the homepage and target is here
      if (item.scrollTo && pathname === "/") {
        e.preventDefault();
        const el = document.getElementById(item.scrollTo);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (item.scrollTo && pathname !== "/") {
        // Navigate to homepage then scroll after navigation
        e.preventDefault();
        router.push(item.href);
        // Defer scroll to allow page mount
        setTimeout(() => {
          const el = document.getElementById(item.scrollTo!);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
      }
    },
    [pathname, router]
  );

  const isCurrent = (item: NavItem): boolean => {
    if (item.href === "/whitepaper") return pathname === "/whitepaper";
    if (item.href === "/team") return pathname === "/team";
    if (item.href === "/build-log") return pathname === "/build-log";
    if (item.href === "/autogenesis") return pathname === "/autogenesis";
    if (item.href === "/live-swarm") return pathname === "/live-swarm";
    if (item.href === "/api") return pathname === "/api";
    return false;
  };

  return (
    <>
      {/* ─── Always-on top atmosphere ────────────────────────────────
          Subtle vertical fade behind the nav — dark at the very top,
          dissolving to transparent ~130px down. Gives the nav letters
          their own legibility pocket against any background (cinematic
          hero, sphere wireframe, scrolling content) without showing as
          a hard bar. Full viewport width on both mobile and desktop
          regardless of the nav's own (variable) width. */}
      <div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 right-0 z-40 h-32 bg-gradient-to-b from-opus-black/90 via-opus-black/55 to-transparent"
      />

      <motion.nav
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
        className={clsx(
          // Full-width on mobile so the scrollable row has room; on desktop
          // it collapses back to its natural width on the left.
          "fixed top-0 left-0 right-0 md:right-auto z-50 transition-colors duration-500",
          scrolled
            // Once the user starts scrolling, layer a soft blurred backdrop
            // on top of the gradient so passing content gets nicely diffused.
            ? "bg-opus-black/30 backdrop-blur-md"
            : ""
        )}
        aria-label="Primary"
      >
      <div className="flex items-stretch">
        {/* ─── Left: brand mark + divider — anchored, never scrolls ─── */}
        <div className="flex items-center gap-5 md:gap-7 pl-6 md:pl-8 py-5 md:py-6 shrink-0">
          <Link
            href="/"
            aria-label="OPUS — return home"
            className="group flex items-center"
          >
            <SphereIcon className="h-7 w-7 md:h-8 md:w-8 text-opus-bone transition-transform duration-500 group-hover:rotate-180" />
          </Link>

          {/* Vertical hairline divider */}
          <span
            aria-hidden
            className="h-5 w-px bg-opus-dim/60"
          />
        </div>

        {/* ─── Right: nav items — horizontally scrollable on mobile ─── */}
        <div className="relative flex-1 min-w-0">
          <ul
            // overflow-x-auto + native touch swipe; scrollbar hidden across
            // webkit / Firefox / legacy Edge; overscroll-contain so a
            // horizontal swipe doesn't chain into the page's vertical scroll.
            className="flex items-center gap-5 md:gap-6 overflow-x-auto overscroll-x-contain py-5 md:py-6 pl-5 md:pl-7 pr-10 md:pr-8 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {ITEMS.map((item) => {
              const current = isCurrent(item);
              return (
                <li key={item.label} className="shrink-0">
                  <Link
                    href={item.href}
                    onClick={(e) => handleClick(e, item)}
                    className={clsx(
                      "group relative inline-flex items-center gap-2 opus-mono uppercase tracking-widest text-[0.68rem] md:text-[0.72rem] py-1 transition-colors whitespace-nowrap",
                      current
                        ? "text-opus-gold"
                        : "text-opus-silver hover:text-opus-bone"
                    )}
                  >
                    {/* Tiny diamond */}
                    <span
                      aria-hidden
                      className={clsx(
                        "inline-block h-1 w-1 rotate-45 transition-colors shrink-0",
                        current ? "bg-opus-gold" : "bg-opus-dim group-hover:bg-opus-gold"
                      )}
                    />
                    {item.label}
                    {/* Animated underline */}
                    <span
                      aria-hidden
                      className={clsx(
                        "absolute left-3 right-0 -bottom-0.5 h-px origin-left bg-opus-gold transition-transform duration-500",
                        current ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right-edge fade — mobile only, hints at more items off-screen */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 right-0 bottom-0 w-10 md:hidden bg-gradient-to-l from-opus-black via-opus-black/80 to-transparent"
          />
        </div>
      </div>
      </motion.nav>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────
// Tiny sphere icon — matches the public/opus-sphere.svg brand mark
// ──────────────────────────────────────────────────────────────────

function SphereIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden
    >
      <circle cx="32" cy="32" r="22" />
      <ellipse cx="32" cy="32" rx="22" ry="7" strokeWidth="0.6" />
      <ellipse cx="32" cy="32" rx="7" ry="22" strokeWidth="0.6" />
      <line x1="32" y1="10" x2="32" y2="54" strokeWidth="0.6" />
      <line x1="10" y1="32" x2="54" y2="32" strokeWidth="0.6" />
      <circle cx="32" cy="32" r="5" strokeWidth="0.6" />
      <circle cx="32" cy="32" r="2.2" fill="#D4AF7A" stroke="none" />
      <line x1="32" y1="4" x2="32" y2="10" strokeWidth="0.8" />
      <circle cx="32" cy="3" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
