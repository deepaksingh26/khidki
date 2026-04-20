import { InviteTeamForm } from "@/components/forms/invite-team-form";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAuthState } from "@/lib/auth";
import { getTeamMembers } from "@/lib/data";
import { formatDate } from "@/lib/format";

export default async function TeamPage() {
  const [team, authState] = await Promise.all([getTeamMembers(), getAuthState()]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Team management"
        title="Who can see, update, and coordinate"
        description="This Phase 1 view keeps role shape clear while the full invite and activity trail are prepared."
      />
      {authState.role === "admin" ? (
        <Card>
          <InviteTeamForm />
        </Card>
      ) : (
        <Card>
          <h2 className="font-heading text-3xl font-semibold text-khidkee-earth">Invite flow is admin-managed</h2>
          <p className="mt-4 text-base leading-8 text-khidkee-earth/72">
            Your role can review team structure, but only admins can prepare new member onboarding in this Phase 1 release.
          </p>
        </Card>
      )}
      <div className="grid gap-5 xl:grid-cols-2">
        {team.map((member) => (
          <Card key={member.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-heading text-3xl font-semibold text-khidkee-earth">{member.displayName}</h2>
                <p className="mt-2 text-sm text-khidkee-earth/72">{member.phone || "Phone not saved yet"}</p>
              </div>
              <Badge variant={member.role === "admin" ? "saffron" : member.role === "view_only" ? "neutral" : "green"}>
                {member.role.replaceAll("_", " ")}
              </Badge>
            </div>
            <p className="mt-4 text-sm leading-6 text-khidkee-earth/72">Onboarded on {formatDate(member.createdAt)}.</p>
          </Card>
        ))}
      </div>
      <Card>
        <h2 className="font-heading text-3xl font-semibold text-khidkee-earth">Activity log skeleton</h2>
        <div className="mt-5 space-y-4 text-sm leading-7 text-khidkee-earth/72">
          <p>Rekha reviewed coverage for Basantpur and opened a flood-risk issue.</p>
          <p>Arif logged a visit in Sikandarpur and updated one medical support issue.</p>
          <p>Neelam opened the diary view to review panchayat recency.</p>
        </div>
      </Card>
    </div>
  );
}
