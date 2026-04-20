import { AppShell } from "@/components/layout/app-shell";
import { requireAppSession } from "@/lib/auth";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const authState = await requireAppSession();

  return <AppShell authState={authState}>{children}</AppShell>;
}

