const requiredSupabaseEnv = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"] as const;

export function getEnvValue(key: keyof NodeJS.ProcessEnv) {
  return process.env[key]?.trim();
}

export function isSupabaseConfigured() {
  return requiredSupabaseEnv.every((key) => Boolean(getEnvValue(key)));
}

export function isDemoModeEnabled() {
  if (process.env.KHIDKEE_DEMO_MODE === "false") {
    return false;
  }

  return !isSupabaseConfigured() || process.env.KHIDKEE_DEMO_MODE === "true";
}

export function getSiteUrl() {
  const explicitUrl = getEnvValue("NEXT_PUBLIC_SITE_URL");
  if (explicitUrl) {
    return explicitUrl;
  }

  const vercelUrl = getEnvValue("VERCEL_PROJECT_PRODUCTION_URL") ?? getEnvValue("VERCEL_URL");
  if (vercelUrl) {
    return vercelUrl.startsWith("http") ? vercelUrl : `https://${vercelUrl}`;
  }

  return "http://localhost:3000";
}
