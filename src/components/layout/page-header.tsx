import type { ReactNode } from "react";
import { SectionHeading } from "@/components/ui/section-heading";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return <SectionHeading eyebrow={eyebrow} title={title} description={description} action={actions} />;
}

