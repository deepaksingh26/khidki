import { PageHeader } from "@/components/layout/page-header";
import { FieldMap } from "@/components/map/field-map";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { getDiaryData } from "@/lib/data";
import { formatDate } from "@/lib/format";

export default async function DiaryPage() {
  const diary = await getDiaryData();
  const mapCenter = diary.coveragePoints[0]
    ? { latitude: diary.coveragePoints[0].latitude, longitude: diary.coveragePoints[0].longitude }
    : { latitude: 25.7207, longitude: 85.4047 };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Field diary"
        title="How the field has been covered over time"
        description="This view is less about activity for activity’s sake, and more about whether the team is truly reaching across geography."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {diary.monthlySummary.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.visitCount} note={item.focusLine} tone="earth" />
        ))}
      </div>
      <FieldMap
        center={mapCenter}
        points={diary.coveragePoints.map((point) => ({
          id: point.id,
          label: point.label,
          latitude: point.latitude,
          longitude: point.longitude,
          tone:
            point.recencyBand === "critical"
              ? "red"
              : point.recencyBand === "high_priority"
                ? "saffron"
                : point.recencyBand === "attention_needed"
                  ? "blue"
                  : "green"
        }))}
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <h2 className="font-heading text-3xl font-semibold text-khidkee-earth">Panchayat recency</h2>
          <div className="mt-5 space-y-4">
            {diary.panchayatSummary.map((item) => (
              <div key={item.panchayat} className="rounded-[1.25rem] border border-khidkee-earth/10 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-khidkee-earth">{item.panchayat}</p>
                    <p className="text-sm text-khidkee-earth/72">
                      {item.totalContacts} contacts, {item.contactsNeedingAttention} needing attention, {item.openIssues} open issues
                    </p>
                  </div>
                  <p className="text-sm text-khidkee-earth/62">{formatDate(item.lastActivityAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="font-heading text-3xl font-semibold text-khidkee-earth">Villages not seen recently</h2>
          <div className="mt-5 space-y-4">
            {diary.villagesNotVisited.map((item) => (
              <div key={`${item.village}-${item.panchayat}`} className="rounded-[1.25rem] border border-khidkee-earth/10 p-4">
                <p className="font-semibold text-khidkee-earth">
                  {item.village}, {item.panchayat}
                </p>
                <p className="mt-2 text-sm text-khidkee-earth/72">
                  {item.daysSinceVisit === null
                    ? "No visit logged yet."
                    : `No visit in ${item.daysSinceVisit} days. Last touch was ${formatDate(item.lastVisitAt)}.`}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

