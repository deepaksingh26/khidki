import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function unique<T>(values: T[]) {
  return Array.from(new Set(values));
}

export function formatPhone(phone?: string | null) {
  if (!phone) return "No phone saved yet";
  return phone;
}

export function formatNullable(value?: string | null, fallback = "Not added yet") {
  return value?.trim() || fallback;
}

