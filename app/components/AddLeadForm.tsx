"use client";

import { useRef, useTransition } from "react";
import { createLead } from "@/app/actions";

export default function AddLeadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();

  // React 19 form action — receives FormData directly
  function clientAction(formData: FormData) {
    startTransition(async () => {
      await createLead(formData);
      formRef.current?.reset();
    });
  }

  return (
    <form
      ref={formRef}
      action={clientAction}
      className="card bg-base-200 shadow-sm border border-base-300/60"
    >
      <div className="card-body p-3 flex-row flex-wrap gap-2">
        <input
          name="name"
          type="text"
          placeholder="Name"
          required
          autoComplete="off"
          className="input input-bordered input-sm flex-1 min-w-32 bg-base-100"
        />
        <input
          name="profileUrl"
          type="url"
          placeholder="Profile URL"
          required
          autoComplete="off"
          className="input input-bordered input-sm flex-[2] min-w-48 bg-base-100"
        />
        <button
          type="submit"
          disabled={pending}
          className="btn btn-primary btn-sm"
        >
          {pending ? <span className="loading loading-spinner loading-xs" /> : null}
          {pending ? "Adding…" : "+ Add Lead"}
        </button>
      </div>
    </form>
  );
}
