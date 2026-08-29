"use client";

import { useScriptToggle } from "@/components/ScriptToggleContext";

export default function ScriptToggleButton() {
  const { showDevanagari, toggle } = useScriptToggle();

  return (
    <button
      onClick={toggle}
      aria-pressed={showDevanagari}
      className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
        showDevanagari
          ? "border-accent-ink text-accent-ink"
          : "border-hairline text-ink-2 hover:border-hairline-hi hover:text-ink"
      }`}
    >
      <span className="font-devanagari text-sm leading-none">अ</span>
      {showDevanagari ? "Sanskrit on" : "Show Sanskrit"}
    </button>
  );
}
