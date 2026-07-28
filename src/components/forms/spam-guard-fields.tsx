"use client";

import { useState } from "react";

// Two invisible signals checked server-side by lib/spam-guard.ts:
// - "company": a text input real visitors never see or fill, but form-
//   filling bots often auto-populate every field they find.
// - "form_rendered_at": a timestamp captured the moment this component
//   mounts. Submissions faster than a human could plausibly type are
//   rejected.
// Neither field is announced to assistive tech and neither is reachable
// by keyboard tabbing.
export function SpamGuardFields() {
  const [renderedAt] = useState(() => Date.now());
  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          width: 0,
          height: 0,
          overflow: "hidden",
        }}
      >
        <label htmlFor="company">Leave this field blank</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <input type="hidden" name="form_rendered_at" value={renderedAt} />
    </>
  );
}
