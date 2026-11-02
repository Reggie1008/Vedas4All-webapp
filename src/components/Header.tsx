import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-[rgb(var(--scrim)/0.72)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
          aria-label="Vedas4All — home"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo.png" alt="" className="h-9 w-auto" />
          <span className="script-accent hidden sm:block">Learn to Chant</span>
        </Link>

        <div className="flex items-center gap-2">
          <a
            href="https://vedas4all.org"
            className="rounded-full border border-hairline px-3.5 py-1.5 text-xs font-medium text-ink-2 transition hover:border-hairline-hi hover:text-ink sm:text-sm"
          >
            ← vedas4all.org
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
