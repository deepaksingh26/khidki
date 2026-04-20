import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { privacyPrinciples } from "@/lib/public-content";

export default function PrivacyEthicsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Privacy and ethics"
        title="Field data carries trust. The product should treat it that way."
        description="Khidkee is designed to help grassroots teams act with clarity without turning communities into data targets."
      />
      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {privacyPrinciples.map((item) => (
          <Card key={item.title}>
            <h2 className="font-heading text-3xl font-semibold text-khidkee-earth">{item.title}</h2>
            <p className="mt-3 text-base leading-7 text-khidkee-earth/88">{item.body}</p>
          </Card>
        ))}
      </div>
      <Card className="mt-10">
        <h2 className="font-heading text-3xl font-semibold text-khidkee-earth">Human judgment still matters</h2>
        <p className="mt-4 text-base leading-8 text-khidkee-earth/88">
          Khidkee can surface reminders, patterns, and suggestions. It should not replace the local knowledge, consent, and care that strong field work depends on. The platform supports judgment. It does not pretend to be judgment.
        </p>
      </Card>
    </div>
  );
}
