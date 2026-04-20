import { Badge } from "@/components/ui/badge";

export function DemoBanner() {
  return (
    <div className="rounded-[1.5rem] border border-khidkee-saffron/18 bg-khidkee-saffron/10 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="saffron">Demo mode</Badge>
            <span className="text-sm font-semibold text-khidkee-earth">The UI is live with seeded field data.</span>
          </div>
          <p className="mt-2 text-sm leading-6 text-khidkee-earth/88">
            Add your Supabase keys when you want real auth, database writes, and PostGIS queries to take over.
          </p>
        </div>
      </div>
    </div>
  );
}
