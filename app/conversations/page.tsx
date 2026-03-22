import { prisma } from "@/lib/prisma";
import ConversationItem from "@/app/components/ConversationItem";

export const dynamic = "force-dynamic";

export default async function ConversationsPage() {
  const conversations = await prisma.lead.findMany({
    where: { status: "conversation" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="max-w-[740px] mx-auto w-full px-4 py-6 pb-24 flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Active Conversations</h1>
        <p className="text-sm text-base-content/50 mt-0.5">
          {conversations.length} {conversations.length === 1 ? "conversation" : "conversations"}
        </p>
      </div>

      {conversations.length === 0 ? (
        <div className="card bg-base-200 border border-dashed border-base-300">
          <div className="card-body items-center py-14 gap-1">
            <p className="font-semibold text-base-content/50">No conversations yet</p>
            <p className="text-sm text-base-content/35 text-center max-w-xs">
              Mark a lead as replied in the pipeline — they'll appear here instantly.
            </p>
          </div>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {conversations.map((c: { id: string; name: string; profileUrl: string; notes: string; createdAt: Date }) => (
            <ConversationItem key={c.id} conversation={c} />
          ))}
        </ul>
      )}
    </main>
  );
}
