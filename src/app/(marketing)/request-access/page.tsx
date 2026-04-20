import { RequestAccessForm } from "@/components/forms/request-access-form";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

export default function RequestAccessPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <SectionHeading
            eyebrow="Request access"
            title="Tell us where your field team is working"
            description="We are prioritizing grounded pilots where Khidkee can support active outreach, issue tracking, and crisis response."
          />
          <Card className="mt-8">
            <RequestAccessForm />
          </Card>
        </div>
        <div className="space-y-5">
          <Card>
            <h2 className="font-heading text-3xl font-semibold text-khidkee-earth">Good pilot fit</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-khidkee-earth/88">
              <li>Teams already doing regular village or household follow-up</li>
              <li>Need for better visibility into gaps, visits, and issue follow-up</li>
              <li>Readiness to test a mobile-first browser workflow</li>
              <li>Comfort working with location-aware outreach records</li>
            </ul>
          </Card>
          <Card>
            <h2 className="font-heading text-3xl font-semibold text-khidkee-earth">What happens next</h2>
            <p className="mt-4 text-base leading-8 text-khidkee-earth/88">
              We review pilot requests for geography, team shape, and immediacy of need. If there is a strong fit, we will reach out to understand your field flow and prepare the first workspace carefully.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
