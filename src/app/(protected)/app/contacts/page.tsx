import Link from "next/link";
import { ContactCard } from "@/components/contacts/contact-card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { buttonClassName } from "@/components/ui/button";
import { getContacts } from "@/lib/data";

export default async function ContactsPage() {
  const contacts = await getContacts();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Contact management"
        title="People in your Khidkee network"
        description="Profiles, villages, tags, visit rhythm, and action shortcuts live together here."
        actions={
          <Link href="/app/contacts/new" className={buttonClassName("secondary")}>
            Add contact
          </Link>
        }
      />
      {contacts.length === 0 ? (
        <EmptyState
          eyebrow="No contacts yet"
          title="The network is still empty."
          body="Start with the first person you want the field team to remember, reach, and locate easily."
          actionHref="/app/contacts/new"
          actionLabel="Add first contact"
        />
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {contacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      )}
    </div>
  );
}

