"use client";

import { useEffect, useState } from "react";

type Pref = "system" | "light" | "dark";

function getInitialPref(): Pref {
  try {
    const s = localStorage.getItem("theme");
    if (s === "light" || s === "dark") return s;
  } catch {}
  return "system";
}

function applyTheme(pref: Pref) {
  const dark =
    pref === "dark" ||
    (pref === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  if (pref === "system") {
    localStorage.removeItem("theme");
  } else {
    localStorage.setItem("theme", pref);
  }
}

export default function ThemeToggle() {
  const [pref, setPref] = useState<Pref>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setPref(getInitialPref());
  }, []);

  // Live-follow system changes when in auto mode
  useEffect(() => {
    if (!mounted || pref !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) =>
      document.documentElement.setAttribute("data-theme", e.matches ? "dark" : "light");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mounted, pref]);

  function cycle() {
    const next: Pref =
      pref === "system" ? "light" : pref === "light" ? "dark" : "system";
    setPref(next);
    applyTheme(next);
  }

  // Render a stable placeholder during SSR / before mount to avoid hydration mismatch
  if (!mounted) {
    return <button className="btn btn-ghost btn-sm btn-square" aria-label="Theme" />;
  }

  const icons: Record<Pref, React.ReactNode> = {
    system: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
      </svg>
    ),
    light: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
      </svg>
    ),
    dark: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    ),
  };

  const labels: Record<Pref, string> = {
    system: "Auto",
    light: "Light",
    dark: "Dark",
  };

  return (
    <button
      onClick={cycle}
      className="btn btn-ghost btn-sm btn-square"
      title={`Theme: ${labels[pref]} — click to cycle`}
      aria-label={`Theme: ${labels[pref]}`}
    >
      {icons[pref]}
    </button>
  );
}
