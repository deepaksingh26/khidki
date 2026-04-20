import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDemoAuthState } from "@/lib/demo-data";
import { isDemoModeEnabled } from "@/lib/env";
import { getServerSupabaseClient } from "@/lib/supabase/server";
import type { AuthState } from "@/types/domain";

export async function getAuthState(): Promise<AuthState> {
  const cookieStore = await cookies();

  if (isDemoModeEnabled()) {
    if (cookieStore.get("khidkee-demo-session")?.value === "active") {
      return getDemoAuthState();
    }

    return {
      isAuthenticated: false,
      isDemoMode: true,
      userId: null,
      displayName: "Guest",
      role: "view_only"
    };
  }

  const supabase = await getServerSupabaseClient();

  if (!supabase) {
    return {
      isAuthenticated: false,
      isDemoMode: false,
      userId: null,
      displayName: "Guest",
      role: "view_only"
    };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      isAuthenticated: false,
      isDemoMode: false,
      userId: null,
      displayName: "Guest",
      role: "view_only"
    };
  }

  const { data: member } = await supabase
    .from("team_members")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return {
    isAuthenticated: true,
    isDemoMode: false,
    userId: user.id,
    displayName:
      member?.display_name ??
      user.user_metadata?.full_name ??
      user.email?.split("@")[0] ??
      user.phone ??
      "Field worker",
    role: member?.role ?? "field_worker"
  };
}

export async function requireAppSession() {
  const authState = await getAuthState();
  if (!authState.isAuthenticated) {
    redirect("/sign-in");
  }
  return authState;
}

