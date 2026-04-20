import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const buttonStyles = {
  base: "focus-ring tap-target inline-flex items-center justify-center rounded-full font-semibold transition disabled:cursor-not-allowed disabled:opacity-55",
  variants: {
    primary: "bg-khidkee-earth px-5 py-3 text-khidkee-cream hover:bg-khidkee-earth/92",
    secondary: "bg-khidkee-saffron px-5 py-3 text-white hover:bg-khidkee-saffron/92",
    soft: "bg-khidkee-mist px-5 py-3 text-khidkee-earth hover:bg-khidkee-mist/80",
    outline: "border border-khidkee-earth/12 bg-white px-5 py-3 text-khidkee-earth hover:border-khidkee-saffron hover:text-khidkee-saffron",
    danger: "bg-khidkee-red px-5 py-3 text-white hover:bg-khidkee-red/92",
    ghost: "px-4 py-2.5 text-khidkee-earth hover:bg-khidkee-earth/5"
  },
  sizes: {
    default: "text-sm",
    sm: "px-4 py-2 text-sm",
    lg: "px-6 py-3.5 text-base"
  }
} as const;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof buttonStyles.variants;
  size?: keyof typeof buttonStyles.sizes;
  icon?: ReactNode;
};

export function buttonClassName(
  variant: keyof typeof buttonStyles.variants = "primary",
  size: keyof typeof buttonStyles.sizes = "default",
  className?: string
) {
  return cn(buttonStyles.base, buttonStyles.variants[variant], buttonStyles.sizes[size], className);
}

export function Button({ className, variant = "primary", size = "default", icon, children, ...props }: ButtonProps) {
  return (
    <button className={buttonClassName(variant, size, className)} {...props}>
      {icon ? <span className="mr-2 shrink-0">{icon}</span> : null}
      {children}
    </button>
  );
}

