import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isSupabaseConfigured } from "@/lib/env";

type SessionUpdateResult = {
  response: NextResponse;
  user: { id: string } | null;
  demoSession: boolean;
};

export async function updateSession(request: NextRequest): Promise<SessionUpdateResult> {
  let response = NextResponse.next({
    request
  });

  const demoSession = request.cookies.get("khidkee-demo-session")?.value === "active";

  if (!isSupabaseConfigured()) {
    return {
      response,
      user: null,
      demoSession
    };
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request
          });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        }
      }
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return {
    response,
    user: user ? { id: user.id } : null,
    demoSession
  };
}

