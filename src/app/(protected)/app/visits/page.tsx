import { VisitForm } from "@/components/forms/visit-form";
import { PageHeader } from "@/components/layout/page-header";
import { VisitCard } from "@/components/visits/visit-card";
import { Card } from "@/components/ui/card";
import { getContacts, getVisits } from "@/lib/data";

export default async function VisitsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const preselectedContact = typeof params.contact === "string" ? params.contact : undefined;
  const [contacts, visits] = await Promise.all([getContacts(), getVisits()]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Visit log"
        title="Keep the field diary moving in real time"
        description="A quick visit note now is better than a vague memory later."
      />
      <Card>
        <VisitForm contacts={contacts} contactId={preselectedContact} />
      </Card>
      <div className="grid gap-5 xl:grid-cols-2">
        {visits.map((visit) => (
          <VisitCard key={visit.id} visit={visit} contact={contacts.find((contact) => contact.id === visit.contactId) ?? null} />
        ))}
      </div>
    </div>
  );
}

