import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="About Khidkee"
        title="A window into community reality"
        description="Khidkee means window. This platform is meant to help a field worker see the community with more clarity, continuity, and care."
      />
      <div className="mt-10 grid gap-5">
        <Card>
          <h2 className="font-heading text-3xl font-semibold text-khidkee-earth">Why it exists</h2>
          <p className="mt-4 text-base leading-8 text-khidkee-earth/88">
            Field teams often hold crucial information in fragments: a notebook, a memory, a phone call, a village map, a WhatsApp thread, a half-finished spreadsheet. Khidkee brings those fragments together into a practical operating view so teams can move with better judgment.
          </p>
        </Card>
        <Card>
          <h2 className="font-heading text-3xl font-semibold text-khidkee-earth">What it is not</h2>
          <p className="mt-4 text-base leading-8 text-khidkee-earth/88">
            Khidkee is not a generic CRM, not a government portal, and not a messaging clone. It is a field intelligence layer for grassroots operations where visit history, geography, issue follow-up, and crisis readiness all matter together.
          </p>
        </Card>
        <Card>
          <h2 className="font-heading text-3xl font-semibold text-khidkee-earth">How we think about product</h2>
          <p className="mt-4 text-base leading-8 text-khidkee-earth/88">
            Good field software should not feel like office software squeezed onto a phone. It should respect harsh light, weak internet, Hindi input, large tap targets, and the fact that many decisions are made while standing in the field, not sitting at a desk.
          </p>
        </Card>
      </div>
    </div>
  );
}
