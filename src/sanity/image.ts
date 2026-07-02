import imageUrlBuilder from "@sanity/image-url";
import { dataset, projectId, hasSanity } from "./env";

const builder = hasSanity ? imageUrlBuilder({ projectId, dataset }) : null;

type ChainableBuilder = {
  width: (n: number) => ChainableBuilder;
  height: (n: number) => ChainableBuilder;
  auto: (v: string) => ChainableBuilder;
  format: (v: string) => ChainableBuilder;
  quality: (n: number) => ChainableBuilder;
  fit: (v: string) => ChainableBuilder;
  url: () => string;
};

// Stub used when Sanity isn't configured. Returns itself for every chained
// call so downstream code can call .width().height().url() unconditionally.
function stub(): ChainableBuilder {
  const s: ChainableBuilder = {
    width: () => s,
    height: () => s,
    auto: () => s,
    format: () => s,
    quality: () => s,
    fit: () => s,
    url: () => "",
  };
  return s;
}

export function urlFor(source: unknown): ChainableBuilder {
  if (!builder) return stub();
  return builder.image(
    source as Parameters<typeof builder.image>[0],
  ) as unknown as ChainableBuilder;
}
