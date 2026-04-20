import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "focus-ring tap-target w-full rounded-2xl border border-khidkee-earth/12 bg-white px-4 py-3 text-base text-khidkee-earth placeholder:text-khidkee-earth/36",
        className
      )}
      {...props}
    />
  );
}

