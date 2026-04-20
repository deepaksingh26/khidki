import { Badge } from "@/components/ui/badge";
import type { GapLevel, IssuePriority, IssueStatus } from "@/types/domain";

export function GapBadge({ gapLevel }: { gapLevel: GapLevel }) {
  const variant =
    gapLevel === "critical"
      ? "red"
      : gapLevel === "high_priority"
        ? "saffron"
        : gapLevel === "attention_needed"
          ? "blue"
          : gapLevel === "gentle_reminder"
            ? "neutral"
            : "green";

  const label =
    gapLevel === "critical"
      ? "Critical follow-up"
      : gapLevel === "high_priority"
        ? "High priority"
        : gapLevel === "attention_needed"
          ? "Attention needed"
          : gapLevel === "gentle_reminder"
            ? "Gentle reminder"
            : "Recently reached";

  return <Badge variant={variant}>{label}</Badge>;
}

export function IssuePriorityBadge({ priority }: { priority: IssuePriority }) {
  const variant = priority === "critical" ? "red" : priority === "high" ? "saffron" : priority === "medium" ? "blue" : "neutral";
  return <Badge variant={variant}>{priority.replaceAll("_", " ")}</Badge>;
}

export function IssueStatusBadge({ status }: { status: IssueStatus }) {
  const variant = status === "resolved" ? "green" : status === "blocked" ? "red" : status === "in_progress" ? "blue" : "neutral";
  return <Badge variant={variant}>{status.replaceAll("_", " ")}</Badge>;
}

