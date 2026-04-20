import Link from "next/link";
import { publicNav } from "@/lib/constants";
import { buttonClassName } from "@/components/ui/button";
import { KhidkeeLogo } from "@/components/brand/khidkee-logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-khidkee-earth/12 bg-[#f8f1e4] backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Khidkee home" className="shrink-0">
          <KhidkeeLogo />
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {publicNav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-khidkee-earth transition hover:text-khidkee-saffron">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 sm:flex">
          <Link href="/sign-in" className={buttonClassName("outline")}>
            Sign in
          </Link>
          <Link href="/request-access" className={buttonClassName("secondary")}>
            Request access
          </Link>
        </div>
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 pb-4 sm:hidden">
        {publicNav.slice(0, 4).map((item) => (
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
  );
}
