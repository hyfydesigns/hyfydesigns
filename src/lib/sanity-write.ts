// Server-only Sanity client with write access.
// Do NOT import this from a client component — it references the write token.
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

const writeToken = process.env.SANITY_API_WRITE_TOKEN;

export const sanityWriteClient =
  projectId && writeToken
    ? createClient({
        projectId,
        dataset,
        apiVersion,
        token: writeToken,
        useCdn: false,
      })
    : null;

export const hasSanityWrite = Boolean(sanityWriteClient);
