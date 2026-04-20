import { Clock3 } from "lucide-react";
import { formatDateTime } from "@/lib/format";
import type { Contact, Visit } from "@/types/domain";
import { Card } from "@/components/ui/card";

type VisitCardProps = {
  visit: Visit;
  contact?: Contact | null;
};

export function VisitCard({ visit, contact }: VisitCardProps) {
  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-heading text-2xl font-semibold text-khidkee-earth">
            {visit.village}, {visit.panchayat}
          </h3>
          <p className="mt-2 text-sm leading-6 text-khidkee-earth/76">
            {visit.outcome || "The team reached the village. The outcome note can be made sharper here."}
          </p>
        </div>
        <div className="rounded-full bg-khidkee-mist px-3 py-1 text-xs font-semibold text-khidkee-earth">
          {contact?.name || "Area visit"}
        </div>
      </div>
      <div className="flex flex-wrap gap-4 text-sm text-khidkee-earth/72">
        <span className="inline-flex items-center gap-2">
          <Clock3 className="h-4 w-4" />
          {formatDateTime(visit.visitedAt)}
        </span>
        <span>{visit.durationMins ? `${visit.durationMins} minutes in the field` : "Duration not captured yet"}</span>
      </div>
      {visit.notes ? <p className="text-sm leading-6 text-khidkee-earth/76">{visit.notes}</p> : null}
    </Card>
  );
}

