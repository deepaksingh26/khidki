import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = HTMLAttributes<HTMLDivElement> & {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  tone?: "default" | "inverse";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  tone = "default",
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)} {...props}>
      <div>
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-khidkee-saffron">{eyebrow}</p> : null}
        <h2 className={cn("mt-2 font-heading text-3xl font-semibold sm:text-4xl", tone === "inverse" ? "text-khidkee-cream" : "text-khidkee-earth")}>
          {title}
        </h2>
        {description ? (
          <p className={cn("mt-3 max-w-2xl text-base leading-7", tone === "inverse" ? "text-khidkee-cream" : "text-khidkee-earth/92")}>
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
