import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactCard } from "@/components/contacts/contact-card";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonClassName } from "@/components/ui/button";
import { getContactById, getIssues, getVisits } from "@/lib/data";
import { formatDate, fromNow } from "@/lib/format";

export default async function ContactProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [contact, issues, visits] = await Promise.all([getContactById(id), getIssues(), getVisits()]);

  if (!contact) notFound();

  const contactIssues = issues.filter((issue) => issue.contactId === contact.id);
  const contactVisits = visits.filter((visit) => visit.contactId === contact.id).slice(0, 5);
  const primaryLocation = contact.locations.find((location) => location.isPrimary) ?? contact.locations[0];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Contact profile"
        title={contact.name}
        description={`${contact.village}, ${contact.panchayat}, ${contact.block}, ${contact.district}`}
        actions={
          <div className="flex flex-wrap gap-3">
            <Link href={`/app/contacts/${contact.id}/edit`} className={buttonClassName("outline")}>
              Edit
            </Link>
            <Link href={`/app/visits?contact=${contact.id}`} className={buttonClassName("soft")}>
              Log visit
            </Link>
            <Link href={`/app/issues?contact=${contact.id}`} className={buttonClassName("soft")}>
              Create issue
            </Link>
            <Link href="/app/alerts" className={buttonClassName("danger")}>
              Open SOS
            </Link>
          </div>
        }
      />
      <ContactCard contact={contact} />
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <h2 className="font-heading text-3xl font-semibold text-khidkee-earth">Field notes</h2>
          <p className="mt-3 text-base leading-7 text-khidkee-earth/72">{contact.notes || "A field note here helps the next worker arrive with context."}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-khidkee-earth">Last visit</p>
              <p className="mt-1 text-sm text-khidkee-earth/72">
                {contact.lastVisitAt ? `${formatDate(contact.lastVisitAt)} • ${fromNow(contact.lastVisitAt)}` : "No visit has been logged yet"}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-khidkee-earth">Saved locations</p>
              <p className="mt-1 text-sm text-khidkee-earth/72">{contact.locations.length} places pinned for this contact</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {contact.tags.map((tag) => (
              <Badge key={tag} variant="blue">
                {tag}
              </Badge>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="font-heading text-3xl font-semibold text-khidkee-earth">Location record</h2>
          {primaryLocation ? (
            <div className="mt-4 space-y-4">
              {contact.locations.map((location) => (
                <div key={location.id} className="rounded-[1.25rem] border border-khidkee-earth/10 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-khidkee-earth">{location.label}</p>
                      <p className="text-sm text-khidkee-earth/72">
                        {location.latitude}, {location.longitude}
                      </p>
                    </div>
                    {location.isPrimary ? <Badge variant="green">Primary</Badge> : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-khidkee-earth/72">No location has been pinned yet. Add one when the team is next in the field.</p>
          )}
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <h2 className="font-heading text-3xl font-semibold text-khidkee-earth">Active issues</h2>
          <div className="mt-5 space-y-4">
            {contactIssues.length ? (
              contactIssues.map((issue) => (
                <Link key={issue.id} href={`/app/issues/${issue.id}`} className="block rounded-[1.25rem] border border-khidkee-earth/10 p-4 transition hover:border-khidkee-saffron">
                  <p className="font-semibold text-khidkee-earth">{issue.title}</p>
                  <p className="mt-2 text-sm leading-6 text-khidkee-earth/72">{issue.description || "Needs a fuller field note."}</p>
                </Link>
              ))
            ) : (
              <p className="text-sm leading-6 text-khidkee-earth/72">No active issues are linked yet. If something needs follow-up, log it here before it gets lost.</p>
            )}
          </div>
        </Card>
        <Card>
          <h2 className="font-heading text-3xl font-semibold text-khidkee-earth">Recent visits</h2>
          <div className="mt-5 space-y-4">
            {contactVisits.length ? (
              contactVisits.map((visit) => (
                <div key={visit.id} className="rounded-[1.25rem] border border-khidkee-earth/10 p-4">
                  <p className="font-semibold text-khidkee-earth">{formatDate(visit.visitedAt)}</p>
                  <p className="mt-2 text-sm leading-6 text-khidkee-earth/72">{visit.outcome || "Visit logged without outcome detail."}</p>
                </div>
              ))
            ) : (
              <p className="text-sm leading-6 text-khidkee-earth/72">No visits have been logged for this person yet.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

