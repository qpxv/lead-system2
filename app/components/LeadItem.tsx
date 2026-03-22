"use client";

import { useOptimistic, useTransition, useState, useRef } from "react";
import { toggleReplied, deleteLead, updateLead } from "@/app/actions";

interface Lead {
  id: string;
  name: string;
  profileUrl: string;
  hasReplied: boolean;
}

export default function LeadItem({ lead }: { lead: Lead }) {
  const [optimisticReplied, setOptimisticReplied] = useOptimistic(lead.hasReplied);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(lead.name);
  const [editUrl, setEditUrl] = useState(lead.profileUrl);
  const [pending, startTransition] = useTransition();
  const nameRef = useRef<HTMLInputElement>(null);

  function handleToggle() {
    const next = !optimisticReplied;
    startTransition(async () => {
      setOptimisticReplied(next);
      await toggleReplied(lead.id, next);
    });
  }

  function handleDelete() {
    if (!confirm(`Delete "${lead.name}"?`)) return;
    startTransition(() => deleteLead(lead.id));
  }

  function handleEditStart() {
    setIsEditing(true);
    setTimeout(() => nameRef.current?.focus(), 0);
  }

  function handleEditSave() {
    const name = editName.trim();
    const profileUrl = editUrl.trim();
    if (!name || !profileUrl) return;
    startTransition(async () => {
      await updateLead(lead.id, { name, profileUrl });
      setIsEditing(false);
    });
  }

  function handleEditCancel() {
    setEditName(lead.name);
    setEditUrl(lead.profileUrl);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <li className="flex flex-col gap-2 p-2.5 rounded-lg bg-base-100 border border-base-300">
        <input
          ref={nameRef}
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          className="input input-bordered input-sm w-full bg-base-200"
          placeholder="Name"
        />
        <input
          value={editUrl}
          onChange={(e) => setEditUrl(e.target.value)}
          className="input input-bordered input-sm w-full bg-base-200"
          placeholder="Profile URL"
          type="url"
        />
        <div className="flex gap-1.5 justify-end">
          <button onClick={handleEditSave} disabled={pending} className="btn btn-primary btn-xs">
            {pending ? <span className="loading loading-spinner loading-xs" /> : "Save"}
          </button>
          <button onClick={handleEditCancel} className="btn btn-ghost btn-xs">Cancel</button>
        </div>
      </li>
    );
  }

  return (
    <li className={`lead-row flex items-center gap-2.5 px-2.5 py-2 ${optimisticReplied ? "opacity-50" : ""}`}>
      {/* Replied checkbox */}
      <input
        type="checkbox"
        className="checkbox checkbox-success checkbox-sm flex-shrink-0 cursor-pointer"
        checked={optimisticReplied}
        onChange={handleToggle}
        title={optimisticReplied ? "Mark as not replied" : "Mark as replied → moves to Conversations"}
      />

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col gap-0">
        <span className={`text-sm font-medium truncate ${optimisticReplied ? "line-through text-base-content/40" : ""}`}>
          {lead.name}
        </span>
        <a
          href={lead.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="link link-primary text-xs no-underline hover:underline"
        >
          View Profile ↗
        </a>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-0.5 flex-shrink-0">
        <button onClick={handleEditStart} className="btn btn-ghost btn-xs">Edit</button>
        <button
          onClick={handleDelete}
          disabled={pending}
          className="btn btn-ghost btn-xs text-error hover:bg-error/10"
        >
          ✕
        </button>
      </div>
    </li>
  );
}
