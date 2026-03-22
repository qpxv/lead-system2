"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getDayNumber } from "@/lib/dayUtils";

// ─── Create Lead ─────────────────────────────────────────────────────────────

export async function createLead(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const profileUrl = (formData.get("profileUrl") as string)?.trim();
  if (!name || !profileUrl) return { error: "Name and profile URL required" };
  await prisma.lead.create({ data: { name, profileUrl } });
  revalidatePath("/");
}

// ─── Toggle Replied ───────────────────────────────────────────────────────────
// Marking as replied instantly promotes the lead to Active Conversations.
// Un-marking sends them back to the pipeline.

export async function toggleReplied(id: string, hasReplied: boolean) {
  await prisma.lead.update({
    where: { id },
    data: {
      hasReplied,
      status: hasReplied ? "conversation" : "active",
    },
  });
  revalidatePath("/");
  revalidatePath("/conversations");
}

// ─── Update Lead ──────────────────────────────────────────────────────────────

export async function updateLead(
  id: string,
  data: Partial<{ name: string; profileUrl: string; notes: string; status: string }>
) {
  await prisma.lead.update({ where: { id }, data });
  revalidatePath("/");
  revalidatePath("/conversations");
}

// ─── Move back to pipeline ────────────────────────────────────────────────────

export async function moveToPipeline(id: string) {
  await prisma.lead.update({
    where: { id },
    data: { hasReplied: false, status: "active" },
  });
  revalidatePath("/");
  revalidatePath("/conversations");
}

// ─── Update Notes ─────────────────────────────────────────────────────────────

export async function updateNotes(id: string, notes: string) {
  await prisma.lead.update({ where: { id }, data: { notes } });
  revalidatePath("/conversations");
}

// ─── Delete Lead ──────────────────────────────────────────────────────────────

export async function deleteLead(id: string) {
  await prisma.lead.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/conversations");
}

// ─── Daily Automation ─────────────────────────────────────────────────────────
// Since replied leads already auto-move to conversations on checkbox,
// this only handles un-replied Day 6+ leads (delete them).

export async function runDailyAutomation(): Promise<{
  deleted: number;
  converted: number;
}> {
  const staleLeads = await prisma.lead.findMany({
    where: { status: "active", hasReplied: false },
  });

  const toDelete = staleLeads
    .filter((l: { createdAt: Date; id: string }) => getDayNumber(l.createdAt) >= 6)
    .map((l: { id: string }) => l.id);

  if (toDelete.length > 0) {
    await prisma.lead.deleteMany({ where: { id: { in: toDelete } } });
  }

  revalidatePath("/");
  revalidatePath("/conversations");

  return { deleted: toDelete.length, converted: 0 };
}
