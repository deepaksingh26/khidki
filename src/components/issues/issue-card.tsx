import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { Contact, Issue } from "@/types/domain";
import { Card } from "@/components/ui/card";
import { IssuePriorityBadge, IssueStatusBadge } from "@/components/ui/status-badge";

type IssueCardProps = {
  issue: Issue;
  contact?: Contact | null;
};

export function IssueCard({ issue, contact }: IssueCardProps) {
  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href={`/app/issues/${issue.id}`} className="font-heading text-2xl font-semibold text-khidkee-earth">
            {issue.title}
          </Link>
          <p className="mt-2 text-sm leading-6 text-khidkee-earth/76">{issue.description || "This issue needs a short field note."}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <IssuePriorityBadge priority={issue.priority} />
          <IssueStatusBadge status={issue.status} />
        </div>
      </div>
      <div className="grid gap-3 text-sm text-khidkee-earth/72 sm:grid-cols-3">
        <div>
          <p className="font-semibold text-khidkee-earth">Linked contact</p>
          <p>{contact ? contact.name : "No contact linked yet"}</p>
        </div>
        <div>
          <p className="font-semibold text-khidkee-earth">Next follow-up</p>
          <p>{formatDate(issue.nextFollowupAt)}</p>
        </div>
        <div>
          <p className="font-semibold text-khidkee-earth">Action taken</p>
          <p>{issue.actionTaken || "No action has been logged yet."}</p>
        </div>
      </div>
    </Card>
  );
}

