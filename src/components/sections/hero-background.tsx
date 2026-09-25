"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// Renders one photo behind the hero, picked at random from whatever's been
// uploaded in Sanity Studio (falls back to a single bundled photo if
// nothing's been uploaded yet — see hero.tsx). The random pick has to
// happen client-side, after mount: Math.random() during server rendering
// would produce a different value than the client's hydration pass and
// trigger a hydration mismatch, so this always renders images[0] on the
// first paint (server and client agree on that) and swaps to a random
// index a moment later once it's safe to diverge. That swap is what makes
// the photo change on every reload, not just every deploy.
export function HeroBackground({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    // Intentional: this is the one legitimate case for setState-in-effect
    // — a value (Math.random()) that must not be computed during SSR or
    // the hydration render, only after. There's no external store to
    // subscribe to here, just a one-time value that has to be deferred.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIndex(Math.floor(Math.random() * images.length));
  }, [images.length]);

  const src = images[index] ?? images[0];
  if (!src) return null;

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Image
        src={src}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-cream/60" />
    </div>
  );
}
