import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemas";
import { apiVersion, dataset, projectId } from "./src/sanity/env";

export default defineConfig({
  name: "hyfy-designs",
  title: "HyFy Designs Studio",
  basePath: "/studio",
  projectId: projectId || "placeholder",
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Home hero")
              .child(S.document().schemaType("homeHero").documentId("homeHero")),
            S.divider(),
            S.documentTypeListItem("collection").title("Collections"),
            S.documentTypeListItem("lifestylePhoto").title("Lifestyle photos"),
            S.documentTypeListItem("portfolioProject").title("Portfolio projects"),
            S.documentTypeListItem("testimonial").title("Testimonials"),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: { types: schemaTypes },
});
