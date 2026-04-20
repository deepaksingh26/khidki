import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { featureSystem } from "@/lib/public-content";

export default function FeaturesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Feature system"
        title="What the platform holds together"
        description="Each feature is designed to support real outreach work, not just record data after the fact."
      />
      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {featureSystem.map((item) => (
          <Card key={item.title}>
            <h2 className="font-heading text-3xl font-semibold text-khidkee-earth">{item.title}</h2>
            <p className="mt-3 text-base leading-7 text-khidkee-earth/88">{item.body}</p>
          </Card>
        ))}
        <Card>
          <h2 className="font-heading text-3xl font-semibold text-khidkee-earth">Coverage map and field diary</h2>
          <p className="mt-3 text-base leading-7 text-khidkee-earth/88">
            Khidkee helps teams see which villages and panchayats have not seen a recent visit, and where the field rhythm is starting to slip.
          </p>
        </Card>
        <Card>
          <h2 className="font-heading text-3xl font-semibold text-khidkee-earth">Team roles and exports</h2>
          <p className="mt-3 text-base leading-7 text-khidkee-earth/88">
            Admin, field worker, and view-only roles help teams share a workspace responsibly. CSV exports keep the system open and practical.
          </p>
        </Card>
      </div>
    </div>
  );
}
