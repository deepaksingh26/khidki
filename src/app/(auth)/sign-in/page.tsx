import Link from "next/link";
import { cookies } from "next/headers";
import { KhidkeeLogo } from "@/components/brand/khidkee-logo";
import { SignInForm } from "@/components/forms/sign-in-form";
import { Card } from "@/components/ui/card";
import { buttonClassName } from "@/components/ui/button";

export default async function SignInPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const nextPath = typeof params.next === "string" && params.next.startsWith("/") ? params.next : "/app";
  const cookieStore = await cookies();
  const isDemoSession = cookieStore.get("khidkee-demo-session")?.value === "active";

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-khidkee-earth/12 bg-white">
          <div className="rounded-[1.6rem] bg-khidkee-mist p-5 sm:p-6">
            <KhidkeeLogo surface="panel" />
            <h1 className="mt-8 font-heading text-5xl font-semibold text-khidkee-earth">Step into the field view.</h1>
            <p className="mt-4 text-base leading-8 text-khidkee-earth/92">
              Use email magic link for live auth. In demo mode, the same form opens the seeded workspace so you can review the platform quickly.
            </p>
            <div className="mt-8 rounded-[1.5rem] border border-khidkee-earth/10 bg-white p-4 text-sm leading-7 text-khidkee-earth/88">
              Phone OTP architecture is ready for Supabase setup. For local work and pilot review, email and demo access keep the flow simple.
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/" className={buttonClassName("outline")}>
                Back to home
              </Link>
              {isDemoSession ? (
                <Link href="/app" className={buttonClassName("secondary")}>
                  Open app
                </Link>
              ) : null}
            </div>
          </div>
        </Card>
        <Card>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-khidkee-saffron">Sign in</p>
          <h2 className="mt-3 font-heading text-4xl font-semibold text-khidkee-earth">Welcome back.</h2>
          <p className="mt-3 text-base leading-7 text-khidkee-earth/92">
            Enter your email and Khidkee will open the next safe step for you.
          </p>
          <div className="mt-8">
            <SignInForm nextPath={nextPath} />
          </div>
        </Card>
      </div>
    </main>
  );
}
