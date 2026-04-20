import Link from "next/link";
import { KhidkeeLogo } from "@/components/brand/khidkee-logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-khidkee-earth/8 bg-khidkee-earth text-khidkee-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
        <div>
          <KhidkeeLogo surface="panel" />
          <p className="mt-4 max-w-md text-sm leading-7 text-khidkee-cream/92">
            A grounded field platform for teams who need to see people, places, gaps, and crises clearly.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-khidkee-cream/92">Platform</p>
          <div className="mt-4 space-y-3 text-sm">
            <Link href="/features" className="block text-khidkee-cream/92 transition hover:text-white">
              Features
            </Link>
            <Link href="/use-cases" className="block text-khidkee-cream/92 transition hover:text-white">
              Use Cases
            </Link>
            <Link href="/privacy-ethics" className="block text-khidkee-cream/92 transition hover:text-white">
              Privacy and Ethics
            </Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-khidkee-cream/92">Get in touch</p>
          <div className="mt-4 space-y-3 text-sm text-khidkee-cream/92">
            <p>Built for grounded pilot work across rural India.</p>
            <p>contact@khidkee.in</p>
            <Link href="/request-access" className="block text-white underline decoration-khidkee-saffron underline-offset-4">
              Request pilot access
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
