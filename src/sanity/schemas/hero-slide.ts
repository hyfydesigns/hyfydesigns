import { defineType, defineField } from "sanity";

export const heroSlide = defineType({
  name: "heroSlide",
  title: "Hero slide",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      description:
        "Internal label so you can tell slides apart in the list. Not shown on the site.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
      description:
        "Square-ish image works best. Focus point set with the hotspot tool.",
    }),
    defineField({
      name: "alt",
      type: "string",
      description: "Screen reader description of the image.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "badgeLabel",
      type: "string",
      description:
        "Small label shown in the top-right corner (e.g. 'New drop', 'Bestseller', 'Limited edition'). Leave empty to hide.",
    }),
    defineField({
      name: "linkHref",
      type: "string",
      description:
        "Optional. If set, clicking the slide navigates here (e.g. /shop/some-product, /shop/collection/christmas).",
    }),
    defineField({
      name: "order",
      type: "number",
      initialValue: 0,
      description: "Lower numbers appear first in the rotation.",
    }),
    defineField({
      name: "active",
      type: "boolean",
      initialValue: true,
      description: "Turn off to hide a slide without deleting it.",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "badgeLabel", media: "image" },
  },
});
