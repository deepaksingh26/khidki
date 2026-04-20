import { notFound } from "next/navigation";
import { IssueForm } from "@/components/forms/issue-form";
import { IssueCard } from "@/components/issues/issue-card";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { getContacts, getIssueById } from "@/lib/data";

export default async function IssueDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [contacts, issue] = await Promise.all([getContacts(), getIssueById(id)]);

  if (!issue) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Issue detail"
        title={issue.title}
        description="Keep the next action clear enough that anyone on the team can pick it up."
      />
      <IssueCard issue={issue} contact={contacts.find((contact) => contact.id === issue.contactId) ?? null} />
      <Card>
        <IssueForm issue={issue} contacts={contacts} />
      </Card>
    </div>
  );
}

