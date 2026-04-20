import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ContactCard } from "@/components/contacts/contact-card";
import { IssueCard } from "@/components/issues/issue-card";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { buttonClassName } from "@/components/ui/button";
import { getDashboardData } from "@/lib/data";
import { formatDistanceMeters, fromNow } from "@/lib/format";
import { quickActions } from "@/lib/constants";

export default async function DashboardPage() {
  const dashboard = await getDashboardData();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Dashboard"
        title={dashboard.greeting}
        description={dashboard.summaryLine}
        actions={
          <div className="flex flex-wrap gap-3">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href} className={buttonClassName(action.href === "/app/alerts" ? "danger" : "outline")}>
                {action.label}
              </Link>
            ))}
          </div>
        }
      />

      <Card className="border-khidkee-saffron/18 bg-white">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-khidkee-saffron">Khidkee suggests</p>
            <h2 className="mt-3 font-heading text-4xl font-semibold text-khidkee-earth">
              {dashboard.suggestedVisit
                ? `Begin in ${dashboard.suggestedVisit.panchayat} today.`
                : "The suggestion engine needs a little more field history."}
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-khidkee-earth/90">
              {dashboard.suggestedVisit
                ? `${dashboard.suggestedVisit.reason}. ${formatDistanceMeters(dashboard.suggestedVisit.distanceMeters)} from the current field center.`
                : "Once contacts, visits, and issues are flowing in, Khidkee will begin surfacing the strongest next stop."}
            </p>
          </div>
          <Link href="/app/map" className={buttonClassName("secondary", "lg")}>
            Open map and nearby
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Needs attention"
          value={dashboard.needsAttentionContacts.length}
          note="Contacts that should not wait much longer"
          tone="saffron"
        />
        <StatCard
          label="Critical gaps"
          value={dashboard.overdueContacts.length}
          note="People who may be slipping out of contact"
          tone="red"
        />
        <StatCard
          label="Open issues"
          value={dashboard.openIssues.length}
          note="Follow-up points still active in the field"
          tone="earth"
        />
        <StatCard
          label="Panchayats tracked"
          value={dashboard.panchayatCoverage.length}
          note="Current field picture across your active geography"
          tone="green"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <Card>
            <h2 className="font-heading text-3xl font-semibold text-khidkee-earth">Needs attention</h2>
            <p className="mt-2 text-sm leading-6 text-khidkee-earth/72">
              These people are telling you something through silence, unresolved issues, or long visit gaps.
            </p>
          </Card>
          <div className="grid gap-5">
            {dashboard.needsAttentionContacts.slice(0, 3).map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <Card>
            <h2 className="font-heading text-3xl font-semibold text-khidkee-earth">Open issues and coverage</h2>
            <p className="mt-2 text-sm leading-6 text-khidkee-earth/72">
              Field follow-up is easiest when people, issue load, and area recency sit in the same view.
            </p>
          </Card>
          <div className="grid gap-5">
            {dashboard.openIssues.slice(0, 3).map((issue) => (
              <IssueCard key={issue.id} issue={issue} contact={dashboard.contacts.find((contact) => contact.id === issue.contactId) ?? null} />
            ))}
          </div>
          <Card>
            <h3 className="font-heading text-3xl font-semibold text-khidkee-earth">Coverage snapshot</h3>
            <div className="mt-5 space-y-4">
              {dashboard.panchayatCoverage.map((item) => (
                <div key={item.panchayat} className="rounded-[1.25rem] border border-khidkee-earth/10 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-khidkee-earth">{item.panchayat}</p>
                      <p className="text-sm text-khidkee-earth/72">
                        {item.totalContacts} contacts, {item.openIssues} open issues
                      </p>
                    </div>
                    <p className="text-sm text-khidkee-earth/62">
                      {item.lastActivityAt ? `Last strong touch ${fromNow(item.lastActivityAt)}` : "No activity yet"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
