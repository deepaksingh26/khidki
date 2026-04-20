import { differenceInCalendarDays, parseISO } from "date-fns";
import type { LatLng, PanchayatSummary, SuggestedVisit } from "@/types/domain";
import { haversineDistanceMeters } from "@/lib/geo";

export function scorePanchayat(summary: PanchayatSummary, currentLocation?: LatLng | null) {
  const daysSinceActivity = summary.lastActivityAt
    ? differenceInCalendarDays(new Date(), parseISO(summary.lastActivityAt))
    : null;

  const activityWeight = daysSinceActivity === null ? 50 : Math.min(daysSinceActivity, 90) * 0.45;
  const issueWeight = summary.openIssues * 4.5;
  const gapWeight = summary.contactsNeedingAttention * 3.5;

  let distanceMeters: number | null = null;
  let distanceAdjustment = 0;

  if (currentLocation && summary.center) {
    distanceMeters = haversineDistanceMeters(currentLocation, summary.center);
    distanceAdjustment = Math.max(0, 12 - distanceMeters / 1000);
  }

  const score = Number((activityWeight + issueWeight + gapWeight + distanceAdjustment).toFixed(2));

  return {
    ...summary,
    score,
    distanceMeters,
    daysSinceActivity
  };
}

export function chooseSuggestedVisit(
  summaries: PanchayatSummary[],
  currentLocation?: LatLng | null
): SuggestedVisit | null {
  if (summaries.length === 0) return null;

  const ranked = summaries
    .map((summary) => scorePanchayat(summary, currentLocation))
    .sort((left, right) => right.score - left.score);

  const top = ranked[0];
  const parts = [];

  if (top.contactsNeedingAttention > 0) {
    parts.push(`${top.contactsNeedingAttention} people may need a check-in`);
  }

  if (top.openIssues > 0) {
    parts.push(`${top.openIssues} open issues are waiting`);
  }

  if (top.daysSinceActivity !== null) {
    parts.push(`last strong touch was ${top.daysSinceActivity} days ago`);
  }

  return {
    panchayat: top.panchayat,
    reason: parts.join(". "),
    score: top.score ?? 0,
    distanceMeters: top.distanceMeters ?? null,
    openIssues: top.openIssues,
    contactsNeedingAttention: top.contactsNeedingAttention,
    daysSinceLastActivity: top.daysSinceActivity ?? null
  };
}

