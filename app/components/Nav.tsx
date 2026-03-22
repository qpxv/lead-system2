"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { runDailyAutomation } from "@/app/actions";
import { useTransition } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Nav() {
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  function handleRunAutomation() {
    startTransition(async () => {
      const result = await runDailyAutomation();
      alert(`Automation done\n• Deleted: ${result.deleted}\n• Promoted: ${result.converted}`);
    });
  }

  return (
    <div className="navbar glass-nav sticky top-0 z-50 min-h-12 px-4">
      {/* Brand */}
      <div className="navbar-start gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]" />
          <span className="font-semibold text-sm tracking-tight">Outreach</span>
        </div>

        <div className="flex gap-0.5">
          <Link
            href="/"
            className={`btn btn-ghost btn-xs ${pathname === "/" ? "btn-active" : ""}`}
          >
            Pipeline
          </Link>
          <Link
            href="/conversations"
            className={`btn btn-ghost btn-xs ${pathname === "/conversations" ? "btn-active" : ""}`}
          >
            Conversations
          </Link>
        </div>
      </div>

      {/* Right side */}
      <div className="navbar-end gap-1.5">
        <button
          onClick={handleRunAutomation}
          disabled={pending}
          className="btn btn-ghost btn-xs hidden sm:flex"
          title="Run daily automation (Day 6 leads)"
        >
          {pending ? <span className="loading loading-spinner loading-xs" /> : "⚡"}
          {pending ? "Running…" : "Run Daily"}
        </button>

        <ThemeToggle />
      </div>
    </div>
  );
}
