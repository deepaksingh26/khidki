const CONTACT_CACHE_KEY = "khidkee.contacts.snapshot";
const MAP_CACHE_KEY = "khidkee.map.snapshot";

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function writeOfflineSnapshot(key: "contacts" | "map", payload: unknown) {
  if (!canUseStorage()) return;
  const storageKey = key === "contacts" ? CONTACT_CACHE_KEY : MAP_CACHE_KEY;
  window.localStorage.setItem(storageKey, JSON.stringify({ savedAt: new Date().toISOString(), payload }));
}

export function readOfflineSnapshot<T>(key: "contacts" | "map"): { savedAt: string; payload: T } | null {
  if (!canUseStorage()) return null;
  const storageKey = key === "contacts" ? CONTACT_CACHE_KEY : MAP_CACHE_KEY;
  const raw = window.localStorage.getItem(storageKey);

  if (!raw) return null;

  try {
    return JSON.parse(raw) as { savedAt: string; payload: T };
  } catch {
    return null;
  }
}

