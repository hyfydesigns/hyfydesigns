"use client";

import { useRef, useState } from "react";
import { UploadCloud, Check, FileText, X } from "lucide-react";
import { cn } from "@/lib/cn";

const projectTypes = [
  "Team merch",
  "Event / one-off",
  "Small business",
  "Personal",
  "Engraving",
  "Other",
];

const quantities = ["1–11", "12–24", "25–49", "50–99", "100+"];

export function QuoteForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function onFiles(list: FileList | null) {
    if (!list) return;
    setFiles((prev) => [...prev, ...Array.from(list)].slice(0, 5));
  }

  function removeFile(idx: number) {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = new FormData(e.currentTarget);
    files.forEach((f) => form.append("files", f));
    try {
      await fetch("/api/quote", { method: "POST", body: form });
      setStatus("done");
    } catch {
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div className="bg-blue-tint rounded-2xl p-8 sm:p-12 text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-navy text-cream inline-flex items-center justify-center mb-4">
          <Check className="h-6 w-6" strokeWidth={2.5} />
        </div>
        <h3 className="text-2xl">Quote request received.</h3>
        <p className="mt-2 text-ink-600 text-sm sm:text-base max-w-sm mx-auto">
          We&apos;ll get back to you within 24 hours with a detailed quote and
          next steps.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" required>
          <input
            required
            name="name"
            className="w-full min-h-11 rounded-lg border border-hairline-strong bg-white px-3 text-sm focus:outline-none focus:border-navy"
          />
        </Field>
        <Field label="Email" required>
          <input
            required
            type="email"
            name="email"
            className="w-full min-h-11 rounded-lg border border-hairline-strong bg-white px-3 text-sm focus:outline-none focus:border-navy"
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Project type" required>
          <select
            required
            name="type"
            defaultValue=""
            className="w-full min-h-11 rounded-lg border border-hairline-strong bg-white px-3 text-sm focus:outline-none focus:border-navy"
          >
            <option value="" disabled>
              Choose one
            </option>
            {projectTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Quantity">
          <select
            name="quantity"
            defaultValue={quantities[0]}
            className="w-full min-h-11 rounded-lg border border-hairline-strong bg-white px-3 text-sm focus:outline-none focus:border-navy"
          >
            {quantities.map((q) => (
              <option key={q} value={q}>
                {q} pieces
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Deadline (optional)">
        <input
          type="date"
          name="deadline"
          className="w-full min-h-11 rounded-lg border border-hairline-strong bg-white px-3 text-sm focus:outline-none focus:border-navy"
        />
      </Field>

      <Field label="Tell us about the project" required>
        <textarea
          required
          name="description"
          rows={4}
          placeholder="Colors, sizes, references, inspiration — the more you share, the tighter the quote."
          className="w-full rounded-lg border border-hairline-strong bg-white p-3 text-sm focus:outline-none focus:border-navy"
        />
      </Field>

      <Field label="Upload artwork (optional)">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            onFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "rounded-xl border-2 border-dashed p-6 sm:p-8 text-center cursor-pointer transition-colors tap",
            dragging
              ? "border-navy bg-blue-tint"
              : "border-hairline-strong bg-white hover:border-navy",
          )}
        >
          <UploadCloud
            className="h-8 w-8 mx-auto text-navy"
            strokeWidth={1.5}
          />
          <p className="mt-2 text-sm text-navy font-medium">
            Drop files or tap to browse
          </p>
          <p className="mt-1 text-xs text-ink-400">
            .ai, .pdf, .png, .psd · up to 50MB · 5 files max
          </p>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".ai,.pdf,.png,.jpg,.jpeg,.psd,.svg"
            onChange={(e) => onFiles(e.target.files)}
            className="hidden"
          />
        </div>
        {files.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {files.map((f, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-sm bg-white border border-hairline rounded-lg px-3 py-2"
              >
                <FileText className="h-4 w-4 text-navy" strokeWidth={2} />
                <span className="flex-1 truncate text-navy">{f.name}</span>
                <span className="text-xs text-ink-400">
                  {(f.size / 1024).toFixed(0)}KB
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  aria-label={`Remove ${f.name}`}
                  className="h-8 w-8 inline-flex items-center justify-center text-red hover:bg-red-tint rounded-md tap"
                >
                  <X className="h-4 w-4" strokeWidth={2} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Field>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full sm:w-auto min-h-12 px-8 rounded-lg bg-navy text-cream font-medium text-sm hover:bg-navy-deep disabled:opacity-50 tap"
      >
        {status === "submitting" ? "Sending..." : "Send quote request"}
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wider text-ink-400 mb-1.5">
        {label}
        {required && <span className="text-red ml-0.5">*</span>}
      </span>
      {children}
    </label>
  );
}
