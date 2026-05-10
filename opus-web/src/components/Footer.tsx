import { Divider } from "./ui/Divider";

export function Footer() {
  return (
    <footer className="relative w-full bg-opus-black px-6 pt-16 pb-12">
      <div className="mx-auto max-w-4xl text-center">
        <Divider width="80px" className="mb-8" />

        {/* Tiny sphere icon */}
        <div className="flex justify-center mb-4">
          <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden>
            <circle cx="17" cy="17" r="14" fill="none" stroke="var(--opus-bone)" strokeWidth="1" />
            <ellipse cx="17" cy="17" rx="14" ry="5" fill="none" stroke="var(--opus-bone)" strokeWidth="0.6" />
            <line x1="17" y1="3" x2="17" y2="31" stroke="var(--opus-bone)" strokeWidth="0.6" />
            <circle cx="17" cy="17" r="2" fill="var(--opus-gold)" />
          </svg>
        </div>

        <p className="opus-display text-opus-bone text-lg tracking-widest mb-2">
          OPUS — ARS&nbsp;MAGNA
        </p>
        <p className="opus-mono text-opus-dim text-xs uppercase tracking-widest">
          Magnum&nbsp;Opus · MMXXVI
        </p>
      </div>
    </footer>
  );
}
