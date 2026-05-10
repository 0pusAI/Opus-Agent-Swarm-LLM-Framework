/**
 * Engraved divider — a thin centred line with a small diamond ornament.
 * Used between major page sections.
 */

import clsx from "clsx";

interface DividerProps {
  className?: string;
  width?: string; // CSS length, e.g. "240px" or "12rem"
  color?: string;
  ornament?: boolean;
}

export function Divider({
  className,
  width = "240px",
  color = "var(--opus-dim)",
  ornament = true,
}: DividerProps) {
  return (
    <div
      className={clsx(
        "flex items-center justify-center gap-3 select-none",
        className,
      )}
      aria-hidden
    >
      <span
        className="block h-px"
        style={{ width, backgroundColor: color }}
      />
      {ornament && (
        <span
          className="inline-block h-1.5 w-1.5 rotate-45"
          style={{ backgroundColor: color }}
        />
      )}
      <span
        className="block h-px"
        style={{ width, backgroundColor: color }}
      />
    </div>
  );
}
