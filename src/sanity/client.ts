import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, hasSanity } from "./env";

export const sanityClient = hasSanity
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: "published",
    })
  : null;

export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  fallback: T,
): Promise<T> {
  if (!sanityClient) return fallback;
  try {
    const data = await sanityClient.fetch<T>(query, params, {
      next: { revalidate: 60 },
    });
    return data ?? fallback;
  } catch {
    return fallback;
  }
}
