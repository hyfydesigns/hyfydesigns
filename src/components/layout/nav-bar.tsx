import { sanityFetch } from "@/sanity/client";
import { FEATURED_COLLECTIONS_QUERY } from "@/sanity/queries";
import type { CollectionSummary } from "@/sanity/types";
import { NavBarClient } from "./nav-bar-client";

export async function NavBar() {
  const collections = await sanityFetch<CollectionSummary[]>(
    FEATURED_COLLECTIONS_QUERY,
    {},
    [],
  );
  return <NavBarClient collections={collections} />;
}
