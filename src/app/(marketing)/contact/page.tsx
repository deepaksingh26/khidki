import { ContactMessageForm } from "@/components/forms/contact-message-form";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <SectionHeading
            eyebrow="Contact"
            title="Start a serious conversation"
            description="If you want to discuss pilots, product fit, data handling, or deployment planning, send a note here."
          />
          <Card className="mt-8">
            <ContactMessageForm />
          </Card>
        </div>
        <div className="space-y-5">
          <Card>
            <h2 className="font-heading text-3xl font-semibold text-khidkee-earth">What to include</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-khidkee-earth/88">
              <li>Which geography your team works in</li>
              <li>How you currently track people, visits, and issues</li>
              <li>Whether crisis response is part of your day-to-day work</li>
              <li>What is breaking in the current workflow</li>
            </ul>
          </Card>
          <Card>
            <h2 className="font-heading text-3xl font-semibold text-khidkee-earth">Working style</h2>
            <p className="mt-4 text-base leading-8 text-khidkee-earth/88">
              Khidkee is being shaped with field reality in mind. That means fewer slogans, more honest product work, and a strong bias toward what actually helps teams move.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
