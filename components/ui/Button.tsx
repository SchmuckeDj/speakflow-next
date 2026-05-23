import { forwardRef } from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "danger" | "link";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
          {
            // variants
            "bg-[var(--color-acc)] text-white hover:brightness-110 active:scale-95 rounded-[var(--radius-md)]":
              variant === "primary",
            "border border-[var(--color-border-2)] text-[var(--color-text)] hover:border-[var(--color-acc)] hover:text-[var(--color-acc)] rounded-[var(--radius-md)]":
              variant === "ghost",
            "bg-[var(--color-acc-3)] text-white hover:brightness-110 rounded-[var(--radius-md)]":
              variant === "danger",
            "text-[var(--color-acc)] hover:underline p-0": variant === "link",
            // sizes
            "px-3 py-1.5 text-sm": size === "sm",
            "px-4 py-2.5 text-sm": size === "md",
            "px-6 py-3 text-base": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
export default Button;
