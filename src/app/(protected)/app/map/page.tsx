import { NearbyScanner } from "@/components/map/nearby-scanner";
import { PageHeader } from "@/components/layout/page-header";
import { getContacts, getDashboardData } from "@/lib/data";

export default async function MapPage() {
  const [contacts, dashboard] = await Promise.all([getContacts(), getDashboardData()]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Map and nearby"
        title="Who is near enough to reach right now?"
        description="Use the current field position, scan a radius, filter by tags, and open the closest people fast."
      />
      <NearbyScanner contacts={contacts} seedLocation={dashboard.currentLocation} />
    </div>
  );
}

