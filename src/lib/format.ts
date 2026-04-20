import { format, formatDistanceToNowStrict, isValid, parseISO } from "date-fns";
import { visitGapCopy } from "@/lib/constants";

export function formatDate(value?: string | Date | null, pattern = "dd MMM yyyy") {
  if (!value) return "Not logged yet";
  const date = typeof value === "string" ? parseISO(value) : value;
  if (!isValid(date)) return "Not logged yet";
  return format(date, pattern);
}

export function formatDateTime(value?: string | Date | null) {
  return formatDate(value, "dd MMM yyyy, hh:mm a");
}

export function fromNow(value?: string | Date | null) {
  if (!value) return "Not reached yet";
  const date = typeof value === "string" ? parseISO(value) : value;
  if (!isValid(date)) return "Not reached yet";
  return `${formatDistanceToNowStrict(date, { addSuffix: false })} ago`;
}

export function visitGapLabel(daysSince: number | null) {
  if (daysSince === null) return visitGapCopy.critical;
  if (daysSince >= 60) return visitGapCopy.critical;
  if (daysSince >= 30) return visitGapCopy.high_priority;
  if (daysSince >= 15) return visitGapCopy.attention_needed;
  if (daysSince >= 7) return visitGapCopy.gentle_reminder;
  return visitGapCopy.on_track;
}

export function formatDistanceMeters(distanceMeters?: number | null) {
  if (distanceMeters == null) return "Distance unknown";
  if (distanceMeters < 1000) return `${Math.round(distanceMeters)} m away`;
  return `${(distanceMeters / 1000).toFixed(1)} km away`;
}
