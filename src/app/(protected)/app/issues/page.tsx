import { IssueForm } from "@/components/forms/issue-form";
import { IssueCard } from "@/components/issues/issue-card";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { getContacts, getIssues } from "@/lib/data";

export default async function IssuesPage() {
  const [contacts, issues] = await Promise.all([getContacts(), getIssues()]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Issue tracker"
        title="What still needs action"
        description="Capture issue type, priority, follow-up date, and the latest action so nothing slips through."
      />
      <Card>
        <IssueForm contacts={contacts} />
      </Card>
      <div className="grid gap-5 xl:grid-cols-2">
        {issues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} contact={contacts.find((contact) => contact.id === issue.contactId) ?? null} />
        ))}
      </div>
    </div>
  );
}

