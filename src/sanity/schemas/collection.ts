import { defineType, defineField } from "sanity";

export const collection = defineType({
  name: "collection",
  title: "Collection",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 60 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
      description: "Optional intro shown at the top of the collection page.",
    }),
    defineField({
      name: "featured",
      type: "boolean",
      initialValue: true,
      description: "Show in the Shop dropdown in the main nav.",
    }),
    defineField({
      name: "order",
      type: "number",
      initialValue: 0,
      description: "Lower numbers appear first in the nav dropdown.",
    }),
    defineField({
      name: "productSlugs",
      title: "Product slugs",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Copy each product's slug from its /shop/... URL (e.g. corgi-hiking-club-t-shirt). Order here controls order on the collection page.",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "productSlugs" },
    prepare({ title, subtitle }) {
      const count = Array.isArray(subtitle) ? subtitle.length : 0;
      return {
        title,
        subtitle: `${count} product${count === 1 ? "" : "s"}`,
      };
    },
  },
});
