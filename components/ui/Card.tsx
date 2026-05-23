import clsx from "clsx";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export default function Card({ glow, className, children, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5",
        glow && "shadow-[var(--shadow-glow)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
