import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { useCases } from "@/lib/public-content";

export default function UseCasesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Use cases"
        title="Where Khidkee becomes useful in the real day"
        description="The product is meant to support planning, follow-up, coverage review, and urgent response."
      />
      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {useCases.map((item) => (
          <Card key={item.title}>
            <h2 className="font-heading text-3xl font-semibold text-khidkee-earth">{item.title}</h2>
            <p className="mt-3 text-base leading-7 text-khidkee-earth/88">{item.body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
