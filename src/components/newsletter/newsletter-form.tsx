"use client";

import { useState } from "react";
import { Check, AlertCircle } from "lucide-react";
import { trackEvent } from "@/components/analytics/posthog-provider";
import { cn } from "@/lib/cn";

type Status = "idle" | "submitting" | "success" | "error";

type Tone = "light" | "dark";

const styles: Record<
  Tone,
  { input: string; button: string; success: string; error: string }
> = {
  light: {
    input:
      "flex-1 min-h-11 rounded-lg bg-white border border-hairline-strong text-navy placeholder:text-ink-400 px-4 text-sm focus:outline-none focus:border-navy",
    button:
      "min-h-11 px-6 rounded-lg bg-navy text-cream text-sm font-medium hover:bg-navy-deep tap disabled:opacity-50",
    success: "text-navy",
    error: "text-red-deep",
  },
  dark: {
    input:
      "flex-1 min-h-11 rounded-lg bg-cream/10 border border-cream/20 text-cream placeholder:text-cream/50 px-4 text-sm focus:outline-none focus:border-red",
    button:
      "min-h-11 px-6 rounded-lg bg-red text-cream text-sm font-medium hover:bg-red-deep tap disabled:opacity-50",
    success: "text-cream",
    error: "text-red",
  },
};

export function NewsletterForm({
  tone = "dark",
  ctaLabel = "Join",
  placeholder = "you@studio.com",
  className,
}: {
  tone?: Tone;
  ctaLabel?: string;
  placeholder?: string;
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const s = styles[tone];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg(null);
    try {
      const formData = new FormData();
      formData.append("email", email);
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `HTTP ${res.status}`);
      }
      trackEvent("newsletter_subscribed", { email_domain: email.split("@")[1] });
      setStatus("success");
      setEmail("");
    } catch (err) {
      setErrorMsg((err as Error).message);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        className={cn(
          "flex items-center gap-2 text-sm",
          s.success,
          className,
        )}
        role="status"
      >
        <Check className="h-4 w-4 flex-shrink-0" strokeWidth={2.5} />
        <span>You&rsquo;re on the list. Check your inbox for a welcome note.</span>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("space-y-2", className)}>
      <div className="flex flex-col sm:flex-row gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          disabled={status === "submitting"}
          className={s.input}
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className={s.button}
        >
          {status === "submitting" ? "Sending…" : ctaLabel}
        </button>
      </div>
      {status === "error" && errorMsg && (
        <div
          className={cn(
            "flex items-start gap-1.5 text-xs",
            s.error,
          )}
          role="alert"
        >
          <AlertCircle
            className="h-3.5 w-3.5 mt-0.5 flex-shrink-0"
            strokeWidth={2}
          />
          <span>Couldn&rsquo;t subscribe. {errorMsg}</span>
        </div>
      )}
    </form>
  );
}
