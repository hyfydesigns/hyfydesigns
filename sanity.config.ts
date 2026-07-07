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
            S.documentTypeListItem("heroSlide").title("Hero slides"),
            S.listItem()
              .title("Contact page")
              .child(
                S.document()
                  .schemaType("contactPage")
                  .documentId("contactPage"),
              ),
            S.listItem()
              .title("Email templates")
              .child(
                S.document()
                  .schemaType("emailSettings")
                  .documentId("emailSettings"),
              ),
            S.divider(),
            S.documentTypeListItem("collection").title("Collections"),
            S.documentTypeListItem("productContent").title("Product content"),
            S.documentTypeListItem("lifestylePhoto").title("Lifestyle photos"),
            S.documentTypeListItem("portfolioProject").title("Portfolio projects"),
            S.documentTypeListItem("testimonial").title("Testimonials"),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: { types: schemaTypes },
});
