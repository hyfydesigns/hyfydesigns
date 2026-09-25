import { defineType, defineField } from "sanity";

export const heroBackground = defineType({
  name: "heroBackground",
  title: "Hero background photo",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      description:
        "Internal label so you can tell photos apart in the list. Not shown on the site.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
      description:
        "Wide, moody photos work best — it renders behind the homepage headline with a dark overlay on top for legibility. One is picked at random each time the homepage loads.",
    }),
    defineField({
      name: "order",
      type: "number",
      initialValue: 0,
      description: "Not shown in a fixed order (one is picked at random), only used to sort this list.",
    }),
    defineField({
      name: "active",
      type: "boolean",
      initialValue: true,
      description: "Turn off to remove a photo from rotation without deleting it.",
    }),
  ],
  preview: {
    select: { title: "title", media: "image" },
  },
});
