import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "focus-ring tap-target w-full rounded-2xl border border-khidkee-earth/12 bg-white px-4 py-3 text-base text-khidkee-earth",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

