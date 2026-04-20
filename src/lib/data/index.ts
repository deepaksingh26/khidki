import { differenceInCalendarDays, format, parseISO, startOfMonth, subDays } from "date-fns";
import {
  getDemoAlerts,
  getDemoContactById,
  getDemoContacts,
  getDemoDashboardData,
  getDemoDiaryData,
  getDemoIssueById,
  getDemoIssues,
  getDemoNearbyContacts,
  getDemoTeamMembers,
  getDemoVisits
} from "@/lib/demo-data";
import { averageCoordinates, haversineDistanceMeters } from "@/lib/geo";
import { chooseSuggestedVisit } from "@/lib/suggestion-engine";
import { getServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type {
  AlertRecord,
  Contact,
  ContactLocation,
  DiaryData,
  DashboardData,
  GapLevel,
  Issue,
  NearbyContact,
  PanchayatSummary,
  TeamMember,
  Visit
} from "@/types/domain";

type ContactRow = Database["public"]["Tables"]["contacts"]["Row"];
type ContactLocationRow = Database["public"]["Tables"]["contact_locations"]["Row"];
type IssueRow = Database["public"]["Tables"]["issues"]["Row"];
type VisitRow = Database["public"]["Tables"]["visits"]["Row"];
type TeamMemberRow = Database["public"]["Tables"]["team_members"]["Row"];
type AlertRow = Database["public"]["Tables"]["alerts"]["Row"];
type AlertRecipientRow = Database["public"]["Tables"]["alert_recipients"]["Row"];

function deriveGapLevel(lastVisitAt?: string | null): GapLevel {
  if (!lastVisitAt) return "critical";
  const daysSince = differenceInCalendarDays(new Date(), parseISO(lastVisitAt));
  if (daysSince >= 60) return "critical";
  if (daysSince >= 30) return "high_priority";
  if (daysSince >= 15) return "attention_needed";
  if (daysSince >= 7) return "gentle_reminder";
  return "on_track";
}

function mapLocation(row: ContactLocationRow): ContactLocation {
  return {
    id: row.id,
    contactId: row.contact_id,
    label: row.label,
    latitude: row.latitude,
    longitude: row.longitude,
    accuracyM: row.accuracy_m,
    isPrimary: row.is_primary,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapIssue(row: IssueRow): Issue {
  return {
    id: row.id,
    contactId: row.contact_id,
    title: row.title,
    type: row.type,
    priority: row.priority,
    status: row.status,
    description: row.description,
    actionTaken: row.action_taken,
    nextFollowupAt: row.next_followup_at,
    assignedTo: row.assigned_to,
    resolvedAt: row.resolved_at,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    archivedAt: row.archived_at
  };
}

function mapVisit(row: VisitRow): Visit {
  return {
    id: row.id,
    contactId: row.contact_id,
    visitedBy: row.visited_by,
    visitedAt: row.visited_at,
    village: row.village,
    panchayat: row.panchayat,
    durationMins: row.duration_mins,
    outcome: row.outcome,
    notes: row.notes,
    latitude: row.latitude,
    longitude: row.longitude,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    archivedAt: row.archived_at
  };
}

function mapTeamMember(row: TeamMemberRow): TeamMember {
  return {
    id: row.id,
    userId: row.user_id,
    role: row.role,
    displayName: row.display_name,
    phone: row.phone,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapContact(
  row: ContactRow,
  locationMap: Map<string, ContactLocation[]>,
  issueMap: Map<string, Issue[]>
): Contact {
  const openIssues = issueMap.get(row.id) ?? [];
  const lastVisitAt = row.last_visit_at;

  return {
    id: row.id,
    name: row.name,
    nameHi: row.name_hi,
    phone: row.phone,
    whatsapp: row.whatsapp,
    village: row.village,
    panchayat: row.panchayat,
    block: row.block,
    district: row.district,
    tags: row.tags,
    notes: row.notes,
    photoUrl: row.photo_url,
    lastVisitAt,
    visitCount: row.visit_count,
    addedBy: row.added_by,
    archivedAt: row.archived_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    locations: locationMap.get(row.id) ?? [],
    gapLevel: deriveGapLevel(lastVisitAt),
    daysSinceLastVisit: lastVisitAt ? differenceInCalendarDays(new Date(), parseISO(lastVisitAt)) : null,
    openIssueCount: openIssues.length,
    criticalIssueCount: openIssues.filter((issue) => issue.priority === "critical").length
  };
}

async function getLiveContacts() {
  const supabase = await getServerSupabaseClient();
  if (!supabase) return null;

  const [{ data: contactRows, error: contactError }, { data: locationRows, error: locationError }, { data: issueRows, error: issueError }] =
    await Promise.all([
      supabase.from("contacts").select("*").is("archived_at", null).order("updated_at", { ascending: false }),
      supabase.from("contact_locations").select("*").order("is_primary", { ascending: false }),
      supabase.from("issues").select("*").is("archived_at", null).neq("status", "resolved")
    ]);

  if (contactError || locationError || issueError) {
    return null;
  }

  const locationsByContact = new Map<string, ContactLocation[]>();
  (locationRows ?? []).forEach((row) => {
    const current = locationsByContact.get(row.contact_id) ?? [];
    current.push(mapLocation(row));
    locationsByContact.set(row.contact_id, current);
  });

  const issuesByContact = new Map<string, Issue[]>();
  (issueRows ?? []).forEach((row) => {
    if (!row.contact_id) return;
    const current = issuesByContact.get(row.contact_id) ?? [];
    current.push(mapIssue(row));
    issuesByContact.set(row.contact_id, current);
  });

  return (contactRows ?? []).map((row) => mapContact(row, locationsByContact, issuesByContact));
}

async function getLiveIssues() {
  const supabase = await getServerSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("issues")
    .select("*")
    .is("archived_at", null)
    .order("created_at", { ascending: false });

  if (error) return null;
  return (data ?? []).map(mapIssue);
}

async function getLiveVisits() {
  const supabase = await getServerSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("visits")
    .select("*")
    .is("archived_at", null)
    .order("visited_at", { ascending: false });

  if (error) return null;
  return (data ?? []).map(mapVisit);
}

async function getLiveTeamMembers() {
  const supabase = await getServerSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase.from("team_members").select("*").order("role");
  if (error) return null;
  return (data ?? []).map(mapTeamMember);
}

async function getLiveAlerts() {
  const supabase = await getServerSupabaseClient();
  if (!supabase) return null;

  const [{ data: alertsRows, error: alertsError }, { data: recipientRows, error: recipientsError }] = await Promise.all([
    supabase.from("alerts").select("*").order("triggered_at", { ascending: false }),
    supabase.from("alert_recipients").select("*").order("created_at", { ascending: false })
  ]);

  if (alertsError || recipientsError) return null;

  const recipientsByAlert = new Map<string, AlertRecipientRow[]>();
  (recipientRows ?? []).forEach((row) => {
    const current = recipientsByAlert.get(row.alert_id) ?? [];
    current.push(row);
    recipientsByAlert.set(row.alert_id, current);
  });

  return (alertsRows ?? []).map<AlertRecord>((row: AlertRow) => ({
    id: row.id,
    createdBy: row.created_by,
    crisisType: row.crisis_type,
    latitude: row.latitude,
    longitude: row.longitude,
    radiusKm: row.radius_km,
    status: row.status,
    triggeredAt: row.triggered_at,
    createdAt: row.created_at,
    recipients: (recipientsByAlert.get(row.id) ?? []).map((recipient) => ({
      id: recipient.id,
      alertId: recipient.alert_id,
      contactId: recipient.contact_id,
      distanceM: recipient.distance_m,
      notifiedAt: recipient.notified_at,
      response: recipient.response,
      respondedAt: recipient.responded_at,
      createdAt: recipient.created_at
    }))
  }));
}

function buildPanchayatSummary(contacts: Contact[], visits: Visit[]): PanchayatSummary[] {
  const map = new Map<string, PanchayatSummary>();

  contacts.forEach((contact) => {
    const existing = map.get(contact.panchayat) ?? {
      panchayat: contact.panchayat,
      totalContacts: 0,
      contactsNeedingAttention: 0,
      openIssues: 0,
      visitCount: 0,
      lastActivityAt: null,
      center: null
    };

    existing.totalContacts += 1;
    existing.openIssues += contact.openIssueCount;

    if (["attention_needed", "high_priority", "critical"].includes(contact.gapLevel)) {
      existing.contactsNeedingAttention += 1;
    }

    const panchayatLocations = contacts
      .filter((entry) => entry.panchayat === contact.panchayat)
      .flatMap((entry) => entry.locations.filter((location) => location.isPrimary))
      .map((location) => ({ latitude: location.latitude, longitude: location.longitude }));

    existing.center = averageCoordinates(panchayatLocations);

    const panchayatVisits = visits.filter((visit) => visit.panchayat === contact.panchayat);
    existing.visitCount = panchayatVisits.length;
    existing.lastActivityAt = panchayatVisits[0]?.visitedAt ?? contact.lastVisitAt ?? null;

    map.set(contact.panchayat, existing);
  });

  return Array.from(map.values()).sort(
    (left, right) => right.contactsNeedingAttention + right.openIssues - (left.contactsNeedingAttention + left.openIssues)
  );
}

function buildDiaryData(contacts: Contact[], visits: Visit[]): DiaryData {
  const monthlySummary = [0, 1, 2].map((offset) => {
    const monthStart = startOfMonth(subDays(new Date(), offset * 30));
    const key = format(monthStart, "yyyy-MM");
    const monthVisits = visits.filter((visit) => format(parseISO(visit.visitedAt), "yyyy-MM") === key);

    return {
      label: format(monthStart, "MMMM"),
      visitCount: monthVisits.length,
      focusLine:
        monthVisits.length >= 4
          ? "The month held a strong village rhythm."
          : "The month needs a steadier round of follow-up."
    };
  });

  return {
    monthlySummary,
    panchayatSummary: buildPanchayatSummary(contacts, visits),
    villagesNotVisited: contacts
      .filter((contact) => (contact.daysSinceLastVisit ?? 999) >= 21)
      .map((contact) => ({
        village: contact.village,
        panchayat: contact.panchayat,
        daysSinceVisit: contact.daysSinceLastVisit,
        lastVisitAt: contact.lastVisitAt
      }))
      .sort((left, right) => (right.daysSinceVisit ?? 0) - (left.daysSinceVisit ?? 0)),
    coveragePoints: contacts.flatMap((contact) =>
      contact.locations
        .filter((location) => location.isPrimary)
        .map((location) => ({
          id: location.id,
          label: `${contact.village}, ${contact.panchayat}`,
          latitude: location.latitude,
          longitude: location.longitude,
          recencyBand: contact.gapLevel
        }))
    )
  };
}

export async function getContacts() {
  return (await getLiveContacts()) ?? getDemoContacts();
}

export async function getContactById(id: string) {
  const contacts = await getContacts();
  return contacts.find((contact) => contact.id === id) ?? getDemoContactById(id);
}

export async function getIssues() {
  return (await getLiveIssues()) ?? getDemoIssues();
}

export async function getIssueById(id: string) {
  const issues = await getIssues();
  return issues.find((issue) => issue.id === id) ?? getDemoIssueById(id);
}

export async function getVisits() {
  return (await getLiveVisits()) ?? getDemoVisits();
}

export async function getAlerts() {
  return (await getLiveAlerts()) ?? getDemoAlerts();
}

export async function getTeamMembers() {
  return (await getLiveTeamMembers()) ?? getDemoTeamMembers();
}

export async function getPanchayatSummary() {
  const contacts = await getContacts();
  const visits = await getVisits();
  return buildPanchayatSummary(contacts, visits);
}

export async function getDashboardData(currentLocation?: { latitude: number; longitude: number } | null): Promise<DashboardData> {
  const liveContacts = await getLiveContacts();
  if (!liveContacts) {
    return getDemoDashboardData(currentLocation ?? undefined);
  }

  const [issues, visits] = await Promise.all([getIssues(), getVisits()]);
  const panchayatCoverage = buildPanchayatSummary(liveContacts, visits);
  const suggestedVisit = chooseSuggestedVisit(panchayatCoverage, currentLocation ?? null);

  return {
    greeting: "Welcome back.",
    summaryLine: "The field picture is ready for today.",
    contacts: liveContacts,
    needsAttentionContacts: liveContacts.filter((contact) =>
      ["attention_needed", "high_priority", "critical"].includes(contact.gapLevel)
    ),
    overdueContacts: liveContacts.filter((contact) => ["high_priority", "critical"].includes(contact.gapLevel)),
    issues,
    openIssues: issues.filter((issue) => issue.status !== "resolved"),
    recentVisits: visits.slice(0, 6),
    panchayatCoverage,
    suggestedVisit,
    currentLocation: currentLocation ?? null
  };
}

export async function getDiaryData() {
  const liveContacts = await getLiveContacts();
  const liveVisits = await getLiveVisits();

  if (!liveContacts || !liveVisits) {
    return getDemoDiaryData();
  }

  return buildDiaryData(liveContacts, liveVisits);
}

export async function getNearbyContacts(
  latitude: number,
  longitude: number,
  radiusKm: number,
  tag?: string | null
): Promise<NearbyContact[]> {
  const supabase = await getServerSupabaseClient();
  if (!supabase) {
    return getDemoNearbyContacts(latitude, longitude, radiusKm, tag);
  }

  const { data, error } = await supabase.rpc("find_nearby_contacts", {
    input_lat: latitude,
    input_lng: longitude,
    input_radius_km: radiusKm,
    input_tag: tag ?? null
  });

  if (error || !data) {
    return getDemoNearbyContacts(latitude, longitude, radiusKm, tag);
  }

  const contacts = await getContacts();
  const distanceMap = new Map(
    data.map((row) => [
      row.contact_id,
      {
        distanceMeters: row.distance_m,
        latitude: row.latitude,
        longitude: row.longitude
      }
    ])
  );

  return contacts
    .filter((contact) => distanceMap.has(contact.id))
    .map((contact) => ({
      ...contact,
      distanceMeters: distanceMap.get(contact.id)?.distanceMeters ?? null
    }))
    .sort((left, right) => (left.distanceMeters ?? Number.POSITIVE_INFINITY) - (right.distanceMeters ?? Number.POSITIVE_INFINITY));
}

export async function getNearbyContactsClientFallback(
  latitude: number,
  longitude: number,
  radiusKm: number,
  tag?: string | null
) {
  const contacts = await getContacts();
  return contacts
    .filter((contact) => (tag ? contact.tags.includes(tag) : true))
    .map((contact) => {
      const primaryLocation = contact.locations.find((location) => location.isPrimary) ?? contact.locations[0];
      return {
        ...contact,
        distanceMeters: primaryLocation
          ? haversineDistanceMeters(
              { latitude, longitude },
              { latitude: primaryLocation.latitude, longitude: primaryLocation.longitude }
            )
          : null
      };
    })
    .filter((contact) => (contact.distanceMeters ?? Number.POSITIVE_INFINITY) <= radiusKm * 1000)
    .sort((left, right) => (left.distanceMeters ?? Number.POSITIVE_INFINITY) - (right.distanceMeters ?? Number.POSITIVE_INFINITY));
}
