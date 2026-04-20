"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSiteUrl, isDemoModeEnabled } from "@/lib/env";
import { getServerSupabaseClient } from "@/lib/supabase/server";
import {
  alertFormSchema,
  contactFormSchema,
  contactMessageSchema,
  inviteTeamSchema,
  issueFormSchema,
  requestAccessSchema,
  signInSchema,
  visitFormSchema
} from "@/lib/validators";

type ActionResult = {
  success: boolean;
  message: string;
  redirectTo?: string;
};

function normalizeNullable(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function parseNumber(value?: string | null) {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseTags(input?: string | null) {
  return (input ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export async function requestAccessAction(values: unknown): Promise<ActionResult> {
  const parsed = requestAccessSchema.parse(values);

  if (!isDemoModeEnabled()) {
    const supabase = await getServerSupabaseClient();
    if (supabase) {
      await supabase.from("access_requests").insert({
        name: parsed.name,
        organization: normalizeNullable(parsed.organization),
        phone: normalizeNullable(parsed.phone),
        email: normalizeNullable(parsed.email),
        district: normalizeNullable(parsed.district),
        notes: normalizeNullable(parsed.notes)
      });
    }
  }

  return {
    success: true,
    message: `${parsed.name}, your request is in the Khidkee queue. We will reach out with the next step.`
  };
}

export async function contactMessageAction(values: unknown): Promise<ActionResult> {
  const parsed = contactMessageSchema.parse(values);

  if (!isDemoModeEnabled()) {
    const supabase = await getServerSupabaseClient();
    if (supabase) {
      await supabase.from("contact_messages").insert({
        name: parsed.name,
        email: normalizeNullable(parsed.email),
        phone: normalizeNullable(parsed.phone),
        message: parsed.message
      });
    }
  }

  return {
    success: true,
    message: `Your note is with us, ${parsed.name}. We will reply with care, not with a canned message.`
  };
}

export async function startSignInAction(values: unknown): Promise<ActionResult> {
  const parsed = signInSchema.parse(values);
  const nextPath = parsed.nextPath && parsed.nextPath.startsWith("/") ? parsed.nextPath : "/app";

  if (isDemoModeEnabled()) {
    const cookieStore = await cookies();
    cookieStore.set("khidkee-demo-session", "active", {
      httpOnly: true,
      sameSite: "lax",
      path: "/"
    });

    return {
      success: true,
      message: "Demo access is open. Let’s step into the field view.",
      redirectTo: nextPath
    };
  }

  const supabase = await getServerSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      message: "Supabase is not ready yet. Add your env keys or switch demo mode on."
    };
  }

  const callbackUrl = new URL("/auth/callback", getSiteUrl());
  callbackUrl.searchParams.set("next", nextPath);

  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.email,
    options: {
      emailRedirectTo: callbackUrl.toString()
    }
  });

  if (error) {
    return {
      success: false,
      message: error.message
    };
  }

  return {
    success: true,
    message: `A sign-in link is on its way to ${parsed.email}.`
  };
}

export async function signOutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("khidkee-demo-session");

  const supabase = await getServerSupabaseClient();
  if (supabase) {
    await supabase.auth.signOut();
  }

  redirect("/sign-in");
}

export async function saveContactAction(values: unknown): Promise<ActionResult> {
  const parsed = contactFormSchema.parse(values);
  const contactId = parsed.id || randomUUID();

  if (isDemoModeEnabled()) {
    return {
      success: true,
      message: `${parsed.name} is now in your Khidkee network.`,
      redirectTo: `/app/contacts/${contactId}`
    };
  }

  const supabase = await getServerSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      message: "Supabase is not connected yet."
    };
  }

  const payload = {
    id: contactId,
    name: parsed.name,
    name_hi: normalizeNullable(parsed.nameHi),
    phone: normalizeNullable(parsed.phone),
    whatsapp: normalizeNullable(parsed.whatsapp),
    village: parsed.village,
    panchayat: parsed.panchayat,
    block: parsed.block,
    district: parsed.district,
    tags: parseTags(parsed.tagsInput),
    notes: normalizeNullable(parsed.notes),
    last_visit_at: normalizeNullable(parsed.lastVisitAt)
  };

  if (parsed.id) {
    await supabase.from("contacts").update(payload).eq("id", contactId);
  } else {
    await supabase.from("contacts").insert(payload);
  }

  const latitude = parseNumber(parsed.latitude);
  const longitude = parseNumber(parsed.longitude);

  if (latitude !== null && longitude !== null) {
    const { data: existingLocation } = await supabase
      .from("contact_locations")
      .select("id")
      .eq("contact_id", contactId)
      .eq("is_primary", true)
      .maybeSingle();

    await supabase.from("contact_locations").upsert({
      id: existingLocation?.id ?? randomUUID(),
      contact_id: contactId,
      label: normalizeNullable(parsed.locationLabel) ?? "Primary",
      latitude,
      longitude,
      is_primary: true
    });
  }

  revalidatePath("/app");
  revalidatePath("/app/contacts");
  revalidatePath(`/app/contacts/${contactId}`);

  return {
    success: true,
    message: `${parsed.name} is now in your Khidkee network.`,
    redirectTo: `/app/contacts/${contactId}`
  };
}

export async function saveIssueAction(values: unknown): Promise<ActionResult> {
  const parsed = issueFormSchema.parse(values);
  const issueId = parsed.id || randomUUID();

  if (isDemoModeEnabled()) {
    return {
      success: true,
      message: `Issue "${parsed.title}" has been added to the follow-up list.`,
      redirectTo: `/app/issues/${issueId}`
    };
  }

  const supabase = await getServerSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      message: "Supabase is not connected yet."
    };
  }

  const payload = {
    id: issueId,
    contact_id: normalizeNullable(parsed.contactId),
    title: parsed.title,
    type: parsed.type,
    priority: parsed.priority,
    status: parsed.status,
    description: normalizeNullable(parsed.description),
    action_taken: normalizeNullable(parsed.actionTaken),
    next_followup_at: normalizeNullable(parsed.nextFollowupAt),
    assigned_to: normalizeNullable(parsed.assignedTo),
    resolved_at: parsed.status === "resolved" ? new Date().toISOString() : null
  };

  if (parsed.id) {
    await supabase.from("issues").update(payload).eq("id", issueId);
  } else {
    await supabase.from("issues").insert(payload);
  }

  revalidatePath("/app");
  revalidatePath("/app/issues");
  revalidatePath(`/app/issues/${issueId}`);

  return {
    success: true,
    message: `Issue "${parsed.title}" has been added to the follow-up list.`,
    redirectTo: `/app/issues/${issueId}`
  };
}

export async function saveVisitAction(values: unknown): Promise<ActionResult> {
  const parsed = visitFormSchema.parse(values);

  if (isDemoModeEnabled()) {
    return {
      success: true,
      message: `Visit to ${parsed.village} logged.`,
      redirectTo: "/app/visits"
    };
  }

  const supabase = await getServerSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      message: "Supabase is not connected yet."
    };
  }

  const visitId = parsed.id || randomUUID();
  const visitedAt = new Date(parsed.visitedAt).toISOString();
  const contactId = normalizeNullable(parsed.contactId);

  await supabase.from("visits").upsert({
    id: visitId,
    contact_id: contactId,
    visited_at: visitedAt,
    village: parsed.village,
    panchayat: parsed.panchayat,
    duration_mins: parseNumber(parsed.durationMins),
    outcome: normalizeNullable(parsed.outcome),
    notes: normalizeNullable(parsed.notes),
    latitude: parseNumber(parsed.latitude),
    longitude: parseNumber(parsed.longitude)
  });

  if (contactId) {
    const { data: existingContact } = await supabase.from("contacts").select("visit_count").eq("id", contactId).maybeSingle();

    await supabase
      .from("contacts")
      .update({
        last_visit_at: visitedAt,
        visit_count: (existingContact?.visit_count ?? 0) + 1
      })
      .eq("id", contactId);
  }

  revalidatePath("/app");
  revalidatePath("/app/visits");
  revalidatePath("/app/diary");

  return {
    success: true,
    message: `Visit to ${parsed.village} logged.`,
    redirectTo: "/app/visits"
  };
}

export async function createAlertAction(values: unknown): Promise<ActionResult> {
  const parsed = alertFormSchema.parse(values);
  const alertId = randomUUID();

  if (isDemoModeEnabled()) {
    return {
      success: true,
      message: `${parsed.crisisType} alert sent to the nearby ring.`,
      redirectTo: "/app/alerts/history"
    };
  }

  const supabase = await getServerSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      message: "Supabase is not connected yet."
    };
  }

  const latitude = Number(parsed.latitude);
  const longitude = Number(parsed.longitude);
  const radiusKm = Number(parsed.radiusKm);

  await supabase.from("alerts").insert({
    id: alertId,
    crisis_type: parsed.crisisType,
    latitude,
    longitude,
    radius_km: radiusKm,
    status: "triggered"
  });

  const { data: recipients } = await supabase.rpc("find_nearby_contacts", {
    input_lat: latitude,
    input_lng: longitude,
    input_radius_km: radiusKm,
    input_tag: null
  });

  if (recipients?.length) {
    await supabase.from("alert_recipients").insert(
      recipients.map((recipient) => ({
        id: randomUUID(),
        alert_id: alertId,
        contact_id: recipient.contact_id,
        distance_m: recipient.distance_m,
        notified_at: new Date().toISOString()
      }))
    );
  }

  revalidatePath("/app");
  revalidatePath("/app/alerts");
  revalidatePath("/app/alerts/history");

  return {
    success: true,
    message: `${parsed.crisisType} alert sent to the nearby ring.`,
    redirectTo: "/app/alerts/history"
  };
}

export async function inviteTeamMemberAction(values: unknown): Promise<ActionResult> {
  const parsed = inviteTeamSchema.parse(values);

  return {
    success: true,
    message: `${parsed.displayName} is ready for onboarding once the live invite flow is switched on.`
  };
}
