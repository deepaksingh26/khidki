import type { issuePriorities, issueStatuses, teamRoles } from "@/lib/constants";

export type GapLevel = "on_track" | "gentle_reminder" | "attention_needed" | "high_priority" | "critical";
export type IssuePriority = (typeof issuePriorities)[number];
export type IssueStatus = (typeof issueStatuses)[number];
export type TeamRole = (typeof teamRoles)[number];

export type LatLng = {
  latitude: number;
  longitude: number;
};

export type ContactLocation = {
  id: string;
  contactId: string;
  label: string;
  latitude: number;
  longitude: number;
  accuracyM: number | null;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Contact = {
  id: string;
  name: string;
  nameHi?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  village: string;
  panchayat: string;
  block: string;
  district: string;
  tags: string[];
  notes?: string | null;
  photoUrl?: string | null;
  lastVisitAt?: string | null;
  visitCount: number;
  addedBy?: string | null;
  archivedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  locations: ContactLocation[];
  gapLevel: GapLevel;
  daysSinceLastVisit: number | null;
  openIssueCount: number;
  criticalIssueCount: number;
};

export type Issue = {
  id: string;
  contactId?: string | null;
  title: string;
  type: string;
  priority: IssuePriority;
  status: IssueStatus;
  description?: string | null;
  actionTaken?: string | null;
  nextFollowupAt?: string | null;
  assignedTo?: string | null;
  resolvedAt?: string | null;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
};

export type Visit = {
  id: string;
  contactId?: string | null;
  visitedBy?: string | null;
  visitedAt: string;
  village: string;
  panchayat: string;
  durationMins?: number | null;
  outcome?: string | null;
  notes?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
};

export type AlertRecipient = {
  id: string;
  alertId: string;
  contactId: string;
  distanceM?: number | null;
  notifiedAt?: string | null;
  response?: string | null;
  respondedAt?: string | null;
  createdAt: string;
};

export type AlertRecord = {
  id: string;
  createdBy?: string | null;
  crisisType: string;
  latitude: number;
  longitude: number;
  radiusKm: number;
  status: "draft" | "triggered" | "closed";
  triggeredAt: string;
  createdAt: string;
  recipients: AlertRecipient[];
};

export type TeamMember = {
  id: string;
  userId: string;
  role: TeamRole;
  displayName: string;
  phone?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PanchayatSummary = {
  panchayat: string;
  totalContacts: number;
  contactsNeedingAttention: number;
  openIssues: number;
  visitCount: number;
  lastActivityAt?: string | null;
  center?: LatLng | null;
  score?: number;
};

export type SuggestedVisit = {
  panchayat: string;
  reason: string;
  score: number;
  distanceMeters: number | null;
  openIssues: number;
  contactsNeedingAttention: number;
  daysSinceLastActivity: number | null;
};

export type DashboardData = {
  greeting: string;
  summaryLine: string;
  contacts: Contact[];
  needsAttentionContacts: Contact[];
  overdueContacts: Contact[];
  issues: Issue[];
  openIssues: Issue[];
  recentVisits: Visit[];
  panchayatCoverage: PanchayatSummary[];
  suggestedVisit: SuggestedVisit | null;
  currentLocation: LatLng | null;
};

export type DiaryData = {
  monthlySummary: {
    label: string;
    visitCount: number;
    focusLine: string;
  }[];
  panchayatSummary: PanchayatSummary[];
  villagesNotVisited: {
    village: string;
    panchayat: string;
    daysSinceVisit: number | null;
    lastVisitAt?: string | null;
  }[];
  coveragePoints: {
    id: string;
    label: string;
    latitude: number;
    longitude: number;
    recencyBand: GapLevel;
  }[];
};

export type NearbyContact = Contact & {
  distanceMeters: number | null;
};

export type AuthState = {
  isAuthenticated: boolean;
  isDemoMode: boolean;
  userId: string | null;
  displayName: string;
  role: TeamRole;
};

