"use client";

import { useState } from "react";
import { Check } from "lucide-react";

const DEFAULT_SUBJECTS = [
  "General question",
  "Custom order",
  "Bulk / team order",
  "Wholesale",
  "Press",
];

export function ContactForm({ subjects }: { subjects?: string[] }) {
  const options =
    subjects && subjects.length > 0 ? subjects : DEFAULT_SUBJECTS;
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = new FormData(e.currentTarget);
    try {
      await fetch("/api/contact", { method: "POST", body: form });
      setStatus("done");
    } catch {
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div className="bg-blue-tint rounded-2xl p-8 text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-navy text-cream inline-flex items-center justify-center mb-4">
          <Check className="h-6 w-6" strokeWidth={2.5} />
        </div>
        <h3 className="text-2xl">Thanks — we got it.</h3>
        <p className="mt-2 text-ink-600 text-sm">
          We&apos;ll reply within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="block text-xs uppercase tracking-wider text-ink-400 mb-1.5">
            Your name <span className="text-red">*</span>
          </span>
          <input
            required
            name="name"
            className="w-full min-h-11 rounded-lg border border-hairline-strong bg-white px-3 text-sm focus:outline-none focus:border-navy"
          />
        </label>
        <label className="block">
          <span className="block text-xs uppercase tracking-wider text-ink-400 mb-1.5">
            Email <span className="text-red">*</span>
          </span>
          <input
            required
            type="email"
            name="email"
            className="w-full min-h-11 rounded-lg border border-hairline-strong bg-white px-3 text-sm focus:outline-none focus:border-navy"
          />
        </label>
      </div>
      <label className="block">
        <span className="block text-xs uppercase tracking-wider text-ink-400 mb-1.5">
          Subject
        </span>
        <select
          name="subject"
          defaultValue={options[0]}
          className="w-full min-h-11 rounded-lg border border-hairline-strong bg-white px-3 text-sm focus:outline-none focus:border-navy"
        >
          {options.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="block text-xs uppercase tracking-wider text-ink-400 mb-1.5">
          Message <span className="text-red">*</span>
        </span>
        <textarea
          required
          name="message"
          rows={5}
          className="w-full rounded-lg border border-hairline-strong bg-white p-3 text-sm focus:outline-none focus:border-navy"
        />
      </label>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full sm:w-auto min-h-12 px-8 rounded-lg bg-navy text-cream font-medium text-sm hover:bg-navy-deep disabled:opacity-50 tap"
      >
        {status === "submitting" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
