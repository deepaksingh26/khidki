import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-khidkee-cream px-6">
      <div className="max-w-md rounded-[2rem] border border-khidkee-earth/10 bg-white p-8 shadow-[0_24px_80px_rgba(28,15,0,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-khidkee-saffron">Window Closed</p>
        <h1 className="mt-4 font-heading text-4xl font-semibold text-khidkee-earth">
          This page is not in sight right now.
        </h1>
        <p className="mt-4 text-base leading-7 text-khidkee-earth/72">
          The path may have moved, or this route has not been opened yet. Let&apos;s take you back to a place that
          helps.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-full bg-khidkee-earth px-5 py-3 text-sm font-semibold text-khidkee-cream transition hover:bg-khidkee-earth/90"
          >
            Go to home
          </Link>
          <Link
            href="/app"
            className="rounded-full border border-khidkee-earth/15 px-5 py-3 text-sm font-semibold text-khidkee-earth transition hover:border-khidkee-saffron hover:text-khidkee-saffron"
          >
            Open the app
          </Link>
        </div>
      </div>
    </main>
  );
}

