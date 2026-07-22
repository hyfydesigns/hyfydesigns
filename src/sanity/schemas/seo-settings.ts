import { defineType, defineField } from "sanity";

export const seoSettings = defineType({
  name: "seoSettings",
  title: "Site & sharing",
  type: "document",
  fields: [
    defineField({
      name: "siteTitle",
      title: "Site title",
      type: "string",
      description:
        "Shown in the browser tab and as the headline when the homepage is shared on social/messaging apps.",
      initialValue: "HyFy Designs — Custom apparel and merch in Houston",
    }),
    defineField({
      name: "siteDescription",
      title: "Site description",
      type: "text",
      rows: 3,
      description:
        "Shown under the title in search results and share previews. Keep to about 155 characters for search, though share cards can show more.",
      initialValue:
        "Houston's custom apparel studio since 2004. T-shirts, mugs, stickers, engravings, and print-on-demand merch. No minimums, quality guaranteed.",
    }),
    defineField({
      name: "ogImage",
      title: "Share image",
      type: "image",
      options: { hotspot: true },
      description:
        "Shown as the preview image when the site is shared on iMessage, Slack, Facebook, etc. Ideal size 1200×630. Leave blank to use the logo.",
    }),
  ],
  preview: {
    select: { title: "siteTitle" },
    prepare({ title }) {
      return { title: title || "Site & sharing" };
    },
  },
});
