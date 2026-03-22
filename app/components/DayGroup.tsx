"use client";

import { useState } from "react";
import LeadItem from "./LeadItem";
import { DAY_LABELS } from "@/lib/dayUtils";

interface Lead {
  id: string;
  name: string;
  profileUrl: string;
  hasReplied: boolean;
}

export default function DayGroup({ day, leads }: { day: number; leads: Lead[] }) {
  const [open, setOpen] = useState(true);

  const label = DAY_LABELS[day] ?? `Day ${day}`;

  function handleOpenAll() {
    leads.forEach((lead, i) => {
      setTimeout(() => {
        window.open(lead.profileUrl, "_blank", "noopener,noreferrer");
      }, i * 120);
    });
  }

  return (
    <div
      className="card bg-base-200 shadow-sm overflow-hidden day-card"
      style={{ "--dc": `var(--day${day})`, "--da": `var(--day${day}-a)` } as React.CSSProperties}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2.5 cursor-pointer select-none day-head-bg min-h-[44px]"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs text-base-content/40 w-3">{open ? "▾" : "▸"}</span>
          <span
            className="w-[22px] h-[22px] rounded-[6px] flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
            style={{ background: `var(--day${day})` }}
          >
            {day}
          </span>
          <span className="text-sm font-semibold tracking-tight">{label}</span>
          <span className="badge badge-neutral badge-sm font-semibold tabular-nums">
            {leads.length}
          </span>
        </div>

        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {leads.length > 0 && (
            <button onClick={handleOpenAll} className="open-all-btn">
              Open All ↗
            </button>
          )}
        </div>
      </div>

      {/* Lead list */}
      {open && (
        <ul className="px-2 pb-2 pt-1 flex flex-col gap-0.5">
          {leads.length === 0 ? (
            <li className="text-center text-sm text-base-content/40 py-4">No leads today</li>
          ) : (
            leads.map((lead) => <LeadItem key={lead.id} lead={lead} />)
          )}
        </ul>
      )}
    </div>
  );
}
