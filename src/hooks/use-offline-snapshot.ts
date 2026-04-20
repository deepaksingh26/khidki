"use client";

import { useEffect, useState } from "react";
import { readOfflineSnapshot, writeOfflineSnapshot } from "@/lib/offline/cache";

export function useOfflineSnapshot<T>(key: "contacts" | "map", value: T) {
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    writeOfflineSnapshot(key, value);
    const snapshot = readOfflineSnapshot<T>(key);
    setSavedAt(snapshot?.savedAt ?? null);
  }, [key, value]);

  return savedAt;
}

