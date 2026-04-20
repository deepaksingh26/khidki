export const siteName = "Khidkee";
export const bilingualSiteName = "Khidkee | खिड़की";

export const publicNav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/features", label: "Features" },
  { href: "/who-its-for", label: "Who It’s For" },
  { href: "/use-cases", label: "Use Cases" },
  { href: "/privacy-ethics", label: "Privacy and Ethics" },
  { href: "/request-access", label: "Request Access" },
  { href: "/contact", label: "Contact" }
] as const;

export const appNav = [
  { href: "/app", label: "Dashboard" },
  { href: "/app/contacts", label: "Contacts" },
  { href: "/app/map", label: "Map and Nearby" },
  { href: "/app/issues", label: "Issues" },
  { href: "/app/visits", label: "Visit Log" },
  { href: "/app/diary", label: "Field Diary" },
  { href: "/app/alerts", label: "Crisis Alert" },
  { href: "/app/team", label: "Team" },
  { href: "/app/settings", label: "Settings" }
] as const;

export const crisisTypes = [
  "Fire",
  "Flood",
  "Medical Emergency",
  "Security Threat",
  "Missing Person",
  "Infrastructure Failure",
  "Other"
] as const;

export const issuePriorities = ["low", "medium", "high", "critical"] as const;
export const issueStatuses = ["open", "in_progress", "blocked", "resolved"] as const;
export const teamRoles = ["admin", "field_worker", "view_only"] as const;

export const visitGapCopy = {
  on_track: "Recently reached",
  gentle_reminder: "Gentle reminder",
  attention_needed: "Attention needed",
  high_priority: "High priority",
  critical: "Critical follow-up"
} as const;

export const quickActions = [
  { href: "/app/contacts/new", label: "Add a contact" },
  { href: "/app/map", label: "Scan nearby" },
  { href: "/app/visits", label: "Log a visit" },
  { href: "/app/alerts", label: "Open SOS" }
] as const;

