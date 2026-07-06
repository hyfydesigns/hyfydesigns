import { defineType, defineField } from "sanity";
import { ProductPickerSingle } from "../components/product-picker-single";
import { FeaturedColorPicker } from "../components/featured-color-picker";

export const productContent = defineType({
  name: "productContent",
  title: "Product content",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      title: "Product",
      type: "string",
      validation: (r) => r.required(),
      components: { input: ProductPickerSingle },
    }),
    defineField({
      name: "htmlDescription",
      title: "Description (HTML paste-friendly)",
      type: "text",
      rows: 12,
      description:
        "Paste description HTML directly (e.g. from Printful). Supports <p>, <br>, <b>/<strong>, <i>/<em>, <ul>/<ol>/<li>, <a>. Everything else is stripped for safety. Prefer this field if you're copying formatted content.",
    }),
    defineField({
      name: "description",
      title: "Description (rich text editor)",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading", value: "h3" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [{ name: "href", type: "url", title: "URL" }],
              },
            ],
          },
        },
      ],
      description:
        "Only used if the HTML field above is empty. Structured editor with bullets, links, formatting.",
    }),
    defineField({
      name: "featuredColor",
      title: "Featured mockup color",
      type: "string",
      description:
        "Pick which color variant's mockup appears first on the shop grid and product page. Leave blank to use Printful's default.",
      components: { input: FeaturedColorPicker },
    }),
    defineField({
      name: "sizingNote",
      title: "Sizing note",
      type: "text",
      rows: 3,
      description:
        "Overrides the default sizing text on the product page. Leave blank for default.",
    }),
    defineField({
      name: "careNote",
      title: "Care and shipping",
      type: "text",
      rows: 3,
      description:
        "Overrides the default care/shipping text. Leave blank for default.",
    }),
  ],
  preview: {
    select: { title: "slug" },
    prepare({ title }) {
      return { title: title || "(no product selected)" };
    },
  },
});
