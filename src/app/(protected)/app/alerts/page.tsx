import Link from "next/link";
import { AlertForm } from "@/components/forms/alert-form";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { buttonClassName } from "@/components/ui/button";
import { getContacts, getDashboardData, getNearbyContactsClientFallback } from "@/lib/data";
import { formatDistanceMeters } from "@/lib/format";

export default async function AlertsPage() {
  const [contacts, dashboard] = await Promise.all([getContacts(), getDashboardData()]);
  const recipients =
    dashboard.currentLocation
      ? await getNearbyContactsClientFallback(dashboard.currentLocation.latitude, dashboard.currentLocation.longitude, 2)
      : contacts.slice(0, 4).map((contact) => ({ ...contact, distanceMeters: null }));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Crisis alert"
        title="Move fast when the situation turns"
        description="Choose the crisis, confirm the place, set the radius, review the nearby ring, and log the alert trail."
        actions={
          <Link href="/app/alerts/history" className={buttonClassName("outline")}>
            Alert history
          </Link>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="border-khidkee-red/15">
          <AlertForm seedLocation={dashboard.currentLocation} />
        </Card>
        <Card>
          <h2 className="font-heading text-3xl font-semibold text-khidkee-earth">Recipient preview</h2>
          <p className="mt-3 text-sm leading-6 text-khidkee-earth/72">
            This ring shows who is likely to hear first when the alert is sent.
          </p>
          <div className="mt-5 space-y-4">
            {recipients.slice(0, 5).map((contact) => (
              <div key={contact.id} className="rounded-[1.25rem] border border-khidkee-earth/10 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-khidkee-earth">{contact.name}</p>
                    <p className="text-sm text-khidkee-earth/72">
                      {contact.village}, {contact.panchayat}
                    </p>
                  </div>
                  <p className="text-sm text-khidkee-earth/62">{formatDistanceMeters(contact.distanceMeters)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card>
        <h2 className="font-heading text-3xl font-semibold text-khidkee-earth">Workflow</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            "Tap SOS and name the crisis",
            "Confirm the map point and radius",
            "Preview nearby recipients",
            "Send the alert and watch response trail"
          ].map((step, index) => (
            <div key={step} className="rounded-[1.25rem] border border-khidkee-earth/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-khidkee-saffron">Step {index + 1}</p>
              <p className="mt-3 text-sm leading-7 text-khidkee-earth/72">{step}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

