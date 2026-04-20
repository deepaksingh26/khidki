import type { Route } from "next";
import Link from "next/link";
import { buttonClassName } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type EmptyStateProps = {
  eyebrow: string;
  title: string;
  body: string;
  actionHref?: Route;
  actionLabel?: string;
};

export function EmptyState({ eyebrow, title, body, actionHref, actionLabel }: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-khidkee-saffron">{eyebrow}</p>
      <h3 className="mt-3 font-heading text-3xl font-semibold text-khidkee-earth">{title}</h3>
      <p className="mt-3 max-w-xl text-sm leading-7 text-khidkee-earth/88">{body}</p>
      {actionHref && actionLabel ? (
        <Link href={actionHref} className={buttonClassName("outline", "default", "mt-5")}>
          {actionLabel}
        </Link>
      ) : null}
    </Card>
  );
}
