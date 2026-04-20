import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "focus-ring min-h-32 w-full rounded-3xl border border-khidkee-earth/12 bg-white px-4 py-3 text-base text-khidkee-earth placeholder:text-khidkee-earth/36",
        className
      )}
      {...props}
    />
  );
}

