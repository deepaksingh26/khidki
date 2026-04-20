import Link from "next/link";
import { ArrowRight, MapPinned, ShieldAlert, UsersRound } from "lucide-react";
import { KhidkeeLogo } from "@/components/brand/khidkee-logo";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { buttonClassName } from "@/components/ui/button";
import { audienceCards, featureSystem, homeHighlights, privacyPrinciples, useCases } from "@/lib/public-content";

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8 lg:pt-16">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-khidkee-saffron">Community field intelligence platform</p>
            <h1 className="mt-4 max-w-4xl font-heading text-5xl font-semibold leading-[1.02] text-khidkee-earth sm:text-6xl">
              See your community clearly.
              <span className="block text-khidkee-blue">Know who is nearby, who needs attention, and where to go next.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-khidkee-earth/90">
              Khidkee is a grounded web platform for field workers, organizers, coordinators, and volunteers working across rural India. It helps teams move with context, not guesswork.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/request-access" className={buttonClassName("secondary", "lg")}>
                Request pilot access
              </Link>
              <Link href="/sign-in" className={buttonClassName("outline", "lg")}>
                Sign in
              </Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <Card className="border-khidkee-saffron/18 bg-white">
                <UsersRound className="h-6 w-6 text-khidkee-saffron" />
                <p className="mt-4 font-heading text-3xl font-semibold text-khidkee-earth">Contacts</p>
                <p className="mt-2 text-sm leading-6 text-khidkee-earth/92">People, villages, panchayats, and relationships in one field view.</p>
              </Card>
              <Card className="border-khidkee-blue/12 bg-white">
                <MapPinned className="h-6 w-6 text-khidkee-blue" />
                <p className="mt-4 font-heading text-3xl font-semibold text-khidkee-earth">Map</p>
                <p className="mt-2 text-sm leading-6 text-khidkee-earth/92">Pinned locations, nearby radius scan, and route-ready movement.</p>
              </Card>
              <Card className="border-khidkee-red/12 bg-white">
                <ShieldAlert className="h-6 w-6 text-khidkee-red" />
                <p className="mt-4 font-heading text-3xl font-semibold text-khidkee-earth">SOS</p>
                <p className="mt-2 text-sm leading-6 text-khidkee-earth/92">Faster crisis response with location, radius, and alert history.</p>
              </Card>
            </div>
          </div>
          <div className="overflow-hidden rounded-[1.75rem] border border-khidkee-earth/10 bg-khidkee-earth p-5 text-khidkee-cream shadow-[0_24px_70px_rgba(28,15,0,0.07)] sm:p-6">
            <div className="rounded-[1.5rem] bg-[#2c1707] p-6">
              <KhidkeeLogo surface="panel" />
              <div className="mt-6 grid gap-4">
                {homeHighlights.map((item, index) => (
                  <div key={item.title} className="rounded-[1.5rem] border border-khidkee-sand/30 bg-khidkee-cream p-4 text-khidkee-earth">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-khidkee-saffron">0{index + 1}</p>
                    <h2 className="mt-2 font-heading text-2xl font-semibold text-khidkee-earth">{item.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-khidkee-earth/90">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="What Khidkee does"
          title="Built for field rhythm, not office paperwork"
          description="The product is shaped around real movement in the field: weak network, low-end Android browsers, bright light, Hindi input, urgent follow-up, and grounded crisis response."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {featureSystem.map((item) => (
            <Card key={item.title}>
              <h3 className="font-heading text-3xl font-semibold text-khidkee-earth">{item.title}</h3>
              <p className="mt-3 text-base leading-7 text-khidkee-earth/92">{item.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-khidkee-earth py-20 text-khidkee-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Who it is for"
            title="A window for people who work close to the ground"
            description="Khidkee is for the teams who hold together last-mile trust and field accountability."
            tone="inverse"
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
            {audienceCards.map((item) => (
              <Card key={item.title} className="border-khidkee-sand/30 bg-khidkee-cream text-khidkee-earth shadow-none">
                <h3 className="font-heading text-2xl font-semibold text-khidkee-earth">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-khidkee-earth/90">{item.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Use cases"
          title="From daily planning to crisis response"
          description="Khidkee helps teams act on what they know, and notice what they have missed."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {useCases.map((item) => (
            <Card key={item.title}>
              <h3 className="font-heading text-3xl font-semibold text-khidkee-earth">{item.title}</h3>
              <p className="mt-3 text-base leading-7 text-khidkee-earth/92">{item.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Trust and care"
          title="Privacy matters because field trust matters"
          description="Community information is sensitive. Khidkee is designed to protect it."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {privacyPrinciples.map((item) => (
            <Card key={item.title}>
              <h3 className="font-heading text-3xl font-semibold text-khidkee-earth">{item.title}</h3>
              <p className="mt-3 text-base leading-7 text-khidkee-earth/92">{item.body}</p>
            </Card>
          ))}
        </div>
        <div className="mt-10 rounded-[1.75rem] border border-transparent bg-khidkee-saffron p-5 text-white shadow-[0_28px_80px_rgba(255,107,0,0.22)] sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Ready to pilot</p>
              <h2 className="mt-3 font-heading text-4xl font-semibold text-white">Bring Khidkee into your field workflow.</h2>
              <p className="mt-3 max-w-3xl text-base leading-7 text-white">
                If you are working with village networks, outreach teams, issue follow-up, or crisis response, let’s explore whether Khidkee fits your ground reality.
              </p>
            </div>
            <Link href="/request-access" className={buttonClassName("primary", "lg", "bg-white text-khidkee-earth hover:bg-khidkee-cream")}>
              Request access
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
