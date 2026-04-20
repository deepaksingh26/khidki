import Link from "next/link";
import { appNav } from "@/lib/constants";
import type { AuthState } from "@/types/domain";
import { KhidkeeLogo } from "@/components/brand/khidkee-logo";
import { buttonClassName } from "@/components/ui/button";
import { DemoBanner } from "@/components/layout/demo-banner";
import { signOutAction } from "@/lib/actions";

type AppShellProps = {
  authState: AuthState;
  children: React.ReactNode;
};

export function AppShell({ authState, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-khidkee-cream">
      <header className="sticky top-0 z-40 border-b border-khidkee-earth/8 bg-khidkee-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/app">
            <KhidkeeLogo />
          </Link>
          <div className="hidden items-center gap-3 lg:flex">
            {appNav.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-full px-4 py-2 text-sm font-medium text-khidkee-earth/88 transition hover:bg-white hover:text-khidkee-saffron">
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-khidkee-earth">{authState.displayName}</p>
              <p className="text-xs uppercase tracking-[0.18em] text-khidkee-earth/72">{authState.role.replaceAll("_", " ")}</p>
            </div>
            <form action={signOutAction}>
              <button className={buttonClassName("outline", "sm")}>Sign out</button>
            </form>
          </div>
        </div>
        <div className="flex gap-3 overflow-x-auto px-4 pb-4 lg:hidden">
          {appNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-full border border-khidkee-earth/10 bg-white px-4 py-2 text-sm font-medium text-khidkee-earth"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {authState.isDemoMode ? <div className="mb-6"><DemoBanner /></div> : null}
        {children}
      </main>
    </div>
  );
}
