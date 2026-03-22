"use client";

import { useState, useTransition, useRef } from "react";
import { updateNotes, deleteLead, moveToPipeline } from "@/app/actions";

interface Conversation {
  id: string;
  name: string;
  profileUrl: string;
  notes: string;
  createdAt: Date;
}

export default function ConversationItem({ conversation }: { conversation: Conversation }) {
  const [notes, setNotes] = useState(conversation.notes);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(conversation.notes);
  const [pending, startTransition] = useTransition();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleEditStart() {
    setDraft(notes);
    setEditing(true);
    setTimeout(() => textareaRef.current?.focus(), 0);
  }

  function handleSave() {
    const trimmed = draft.trim();
    startTransition(async () => {
      await updateNotes(conversation.id, trimmed);
      setNotes(trimmed);
      setEditing(false);
    });
  }

  function handleCancel() {
    setDraft(notes);
    setEditing(false);
  }

  function handleDelete() {
    if (!confirm(`Remove "${conversation.name}" from conversations?`)) return;
    startTransition(() => deleteLead(conversation.id));
  }

  function handleMoveToPipeline() {
    if (!confirm(`Move "${conversation.name}" back to the pipeline?`)) return;
    startTransition(() => moveToPipeline(conversation.id));
  }

  const dateStr = new Date(conversation.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  return (
    <li className="card bg-base-200 shadow-sm border border-base-300/60">
      <div className="card-body p-4 gap-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <span className="font-semibold tracking-tight">{conversation.name}</span>
            <a
              href={conversation.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link link-primary text-xs no-underline hover:underline"
            >
              View Profile ↗
            </a>
            <span className="text-xs text-base-content/40 mt-0.5">Added {dateStr}</span>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            {!editing && (
              <button onClick={handleEditStart} className="btn btn-ghost btn-xs">
                {notes ? "Edit Notes" : "+ Notes"}
              </button>
            )}
            <button
              onClick={handleMoveToPipeline}
              disabled={pending}
              className="btn btn-ghost btn-xs"
              title="Move back to pipeline"
            >
              ↩
            </button>
            <button
              onClick={handleDelete}
              disabled={pending}
              className="btn btn-ghost btn-xs text-error hover:bg-error/10"
              title="Delete"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Notes */}
        {editing ? (
          <div className="flex flex-col gap-2">
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="textarea textarea-bordered textarea-sm w-full bg-base-100 resize-y min-h-16"
              placeholder="Add conversation notes…"
              rows={3}
            />
            <div className="flex gap-1.5 justify-end">
              <button onClick={handleSave} disabled={pending} className="btn btn-primary btn-xs">
                {pending ? <span className="loading loading-spinner loading-xs" /> : "Save"}
              </button>
              <button onClick={handleCancel} className="btn btn-ghost btn-xs">Cancel</button>
            </div>
          </div>
        ) : notes ? (
          <p
            className="text-sm text-base-content/70 leading-relaxed whitespace-pre-wrap cursor-pointer rounded-lg bg-base-100 px-3 py-2 border border-base-300/60 hover:border-base-300"
            onClick={handleEditStart}
            title="Click to edit"
          >
            {notes}
          </p>
        ) : null}
      </div>
    </li>
  );
}
