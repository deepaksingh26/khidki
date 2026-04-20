import { Download } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { buttonClassName } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Settings and export"
        title="Preferences, privacy controls, and clean handoff data"
        description="Phase 1 keeps the essentials visible while leaving room for fuller account and notification flows."
      />
      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <h2 className="font-heading text-3xl font-semibold text-khidkee-earth">Language and notifications</h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-khidkee-earth/72">
            <p>Language preference placeholder: English and Hindi-ready rendering are already supported in the UI.</p>
            <p>Notification preference placeholder: alert channel rules, reminder timing, and visit-gap nudges can sit here next.</p>
          </div>
        </Card>
        <Card>
          <h2 className="font-heading text-3xl font-semibold text-khidkee-earth">Account and privacy</h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-khidkee-earth/72">
            <p>Role-based access is enforced through Supabase row-level security.</p>
            <p>Soft delete is built into core records so data can be archived instead of erased.</p>
            <p>Location data stays inside the authenticated workspace. No public exposure is enabled.</p>
          </div>
        </Card>
      </div>
      <Card>
        <h2 className="font-heading text-3xl font-semibold text-khidkee-earth">Export data</h2>
        <p className="mt-3 text-sm leading-6 text-khidkee-earth/72">
          CSV export is ready now. Excel-friendly export can be added next without changing the data model.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href="/app/settings/export/contacts" className={buttonClassName("outline")}>
            <Download className="mr-2 h-4 w-4" />
            Export contacts CSV
          </a>
          <a href="/app/settings/export/issues" className={buttonClassName("outline")}>
            <Download className="mr-2 h-4 w-4" />
            Export issues CSV
          </a>
          <a href="/app/settings/export/visits" className={buttonClassName("outline")}>
            <Download className="mr-2 h-4 w-4" />
            Export visits CSV
          </a>
        </div>
      </Card>
    </div>
  );
}

