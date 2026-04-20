import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = {
  neutral: "bg-khidkee-mist text-khidkee-earth",
  saffron: "bg-khidkee-saffron/12 text-khidkee-saffron",
  green: "bg-khidkee-green/12 text-khidkee-green",
  red: "bg-khidkee-red/12 text-khidkee-red",
  blue: "bg-khidkee-blue/12 text-khidkee-blue"
} as const;

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: keyof typeof badgeVariants;
};

export function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-[0.02em]",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}

