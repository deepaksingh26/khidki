import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAlerts, getContacts } from "@/lib/data";
import { formatDateTime } from "@/lib/format";

export default async function AlertsHistoryPage() {
  const [alerts, contacts] = await Promise.all([getAlerts(), getContacts()]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Alert history"
        title="What was sent, who was reached, and how people responded"
        description="Even in a fast-moving crisis, the response trail should stay visible."
      />
      <div className="grid gap-5">
        {alerts.map((alert) => (
          <Card key={alert.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-heading text-3xl font-semibold text-khidkee-earth">{alert.crisisType}</h2>
                  <Badge variant={alert.status === "closed" ? "green" : "red"}>{alert.status}</Badge>
                </div>
                <p className="mt-2 text-sm text-khidkee-earth/72">{formatDateTime(alert.triggeredAt)}</p>
              </div>
              <p className="text-sm text-khidkee-earth/62">{alert.recipients.length} recipients logged</p>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {alert.recipients.map((recipient) => {
                const contact = contacts.find((item) => item.id === recipient.contactId);
                return (
                  <div key={recipient.id} className="rounded-[1.25rem] border border-khidkee-earth/10 p-4">
                    <p className="font-semibold text-khidkee-earth">{contact?.name || "Contact"}</p>
                    <p className="mt-2 text-sm leading-6 text-khidkee-earth/72">{recipient.response || "No response logged yet."}</p>
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

