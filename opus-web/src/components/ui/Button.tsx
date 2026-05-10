import clsx from "clsx";
import Link from "next/link";

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "gold";
  className?: string;
  external?: boolean;
}

export function Button({
  href,
  onClick,
  children,
  variant = "primary",
  className,
  external = false,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center px-6 py-3 opus-mono text-xs uppercase tracking-widest transition-all duration-300 border";

  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
      "border-opus-bone text-opus-bone hover:bg-opus-bone hover:text-opus-black",
    ghost:
      "border-opus-dim text-opus-silver hover:border-opus-bone hover:text-opus-bone",
    gold:
      "border-opus-gold text-opus-gold hover:bg-opus-gold hover:text-opus-black",
  };

  const classes = clsx(base, variants[variant], className);

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
