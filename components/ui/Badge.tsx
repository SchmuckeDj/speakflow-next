import clsx from "clsx";

type BadgeVariant = "default" | "success" | "warning" | "error" | "level";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const LEVEL_COLORS: Record<string, string> = {
  A1: "bg-emerald-500/20 text-emerald-400",
  A2: "bg-green-500/20 text-green-400",
  B1: "bg-blue-500/20 text-blue-400",
  B2: "bg-violet-500/20 text-violet-400",
  C1: "bg-orange-500/20 text-orange-400",
  C2: "bg-red-500/20 text-red-400",
};

export default function Badge({ variant = "default", children, className }: BadgeProps) {
  const level = typeof children === "string" ? LEVEL_COLORS[children] : undefined;
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "default" && "bg-[var(--color-surface-2)] text-[var(--color-text-2)]",
        variant === "success" && "bg-emerald-500/20 text-emerald-400",
        variant === "warning" && "bg-amber-500/20 text-amber-400",
        variant === "error" && "bg-red-500/20 text-red-400",
        variant === "level" && (level ?? "bg-[var(--color-surface-2)] text-[var(--color-text-2)]"),
        className
      )}
    >
      {children}
    </span>
  );
}
