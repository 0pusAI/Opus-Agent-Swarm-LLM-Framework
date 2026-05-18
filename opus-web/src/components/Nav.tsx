"use client";

/**
 * Nav — fixed top-left navigation.
 *
 * Three buttons (OpusAI · Whitepaper · Team) in the OPUS aesthetic:
 * mono uppercase labels, animated gold underline on hover, tiny
 * sphere brand mark on the left. Persists across all pages.
 *
 * The OpusAI link navigates to the homepage and smooth-scrolls to
 * the LiveSwarm demo. From other pages it navigates first; from the
 * homepage it scrolls in place.
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
  { label: "OpusAI",     href: "/#live-swarm", scrollTo: "live-swarm" },
  { label: "Whitepaper", href: "/whitepaper" },
  { label: "Build Log",  href: "/build-log" },
  { label: "Sigils",     href: "/sigils" },
  { label: "Team",       href: "/team" },
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
    if (item.href === "/sigils") return pathname === "/sigils";
    return false;
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
      className={clsx(
        "fixed top-0 left-0 z-50 px-6 md:px-8 py-5 md:py-6 transition-colors duration-500",
        scrolled
          ? "bg-opus-black/60 backdrop-blur-md"
          : "bg-transparent"
      )}
      aria-label="Primary"
    >
      <div className="flex items-center gap-5 md:gap-7">
        {/* Sphere brand mark */}
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

        {/* Nav items */}
        <ul className="flex items-center gap-4 md:gap-6">
          {ITEMS.map((item) => {
            const current = isCurrent(item);
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={(e) => handleClick(e, item)}
                  className={clsx(
                    "group relative inline-flex items-center gap-2 opus-mono uppercase tracking-widest text-[0.68rem] md:text-[0.72rem] py-1 transition-colors",
                    current
                      ? "text-opus-gold"
                      : "text-opus-silver hover:text-opus-bone"
                  )}
                >
                  {/* Tiny dot */}
                  <span
                    aria-hidden
                    className={clsx(
                      "inline-block h-1 w-1 rotate-45 transition-colors",
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
      </div>
    </motion.nav>
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
