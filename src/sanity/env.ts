export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = "2024-10-01";
export const readToken = process.env.SANITY_API_READ_TOKEN;

export const hasSanity = Boolean(projectId);
