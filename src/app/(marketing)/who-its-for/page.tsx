import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { audienceCards } from "@/lib/public-content";

export default function WhoItsForPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Who it’s for"
        title="People and teams working close to the ground"
        description="Khidkee is designed for roles where relationship continuity, geography, and timely follow-up matter every day."
      />
      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {audienceCards.map((item) => (
          <Card key={item.title}>
            <h2 className="font-heading text-3xl font-semibold text-khidkee-earth">{item.title}</h2>
            <p className="mt-3 text-base leading-7 text-khidkee-earth/88">{item.body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
