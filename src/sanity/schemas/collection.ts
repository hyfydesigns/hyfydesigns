import { defineType, defineField } from "sanity";
import { ProductPicker } from "../components/product-picker";

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
      description:
        "Show in the Shop dropdown in the main nav and in the collections strip on the Shop page.",
    }),
    defineField({
      name: "highlightImage",
      title: "Highlight image",
      type: "image",
      options: { hotspot: true },
      description:
        "Shown on the Shop page collections strip. Leave blank to automatically use the first product's mockup instead.",
    }),
    defineField({
      name: "order",
      type: "number",
      initialValue: 0,
      description: "Lower numbers appear first in the nav dropdown.",
    }),
    defineField({
      name: "productSlugs",
      title: "Products",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Check the products to include. Use the arrows in the selected list above to reorder.",
      components: { input: ProductPicker },
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
