import imageUrlBuilder from "@sanity/image-url";
import { dataset, projectId, hasSanity } from "./env";

const builder = hasSanity ? imageUrlBuilder({ projectId, dataset }) : null;

export function urlFor(source: unknown) {
  if (!builder) return { url: () => "" };
  return builder.image(source as Parameters<typeof builder.image>[0]);
}
