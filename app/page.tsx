import { prisma } from "@/lib/prisma";
import { getDayNumber } from "@/lib/dayUtils";
import AddLeadForm from "@/app/components/AddLeadForm";
import DayGroup from "@/app/components/DayGroup";

export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  const leads = await prisma.lead.findMany({
    where: { status: "active" },
    orderBy: { createdAt: "asc" },
  });

  const groups: Record<number, typeof leads> = { 1: [], 2: [], 3: [], 4: [], 5: [] };

  for (const lead of leads) {
    const day = getDayNumber(lead.createdAt);
    if (day >= 1 && day <= 5) {
      if (day === 5 && lead.hasReplied) continue; // Day 5: non-replied only
      groups[day].push(lead);
    }
  }

  const total = Object.values(groups).reduce((n, g) => n + g.length, 0);

  return (
    <main className="max-w-[740px] mx-auto w-full px-4 py-6 pb-24 flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Pipeline</h1>
        <p className="text-sm text-base-content/50 mt-0.5">
          {total} active {total === 1 ? "lead" : "leads"}
        </p>
      </div>

      <AddLeadForm />

      <div className="flex flex-col gap-2">
        {[1, 2, 3, 4, 5].map((day) => (
          <DayGroup key={day} day={day} leads={groups[day]} />
        ))}
      </div>
    </main>
  );
}
