import { defineType, defineField } from "sanity";

export const homeHero = defineType({
  name: "homeHero",
  title: "Home hero",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", type: "string", initialValue: "Printed in Houston since 2004" }),
    defineField({
      name: "headline",
      type: "text",
      rows: 3,
      validation: (r) => r.required(),
      description:
        "Wrap words in *asterisks* to give them the red highlight (e.g. *Custom merch*). Wrap words in _underscores_ to color them blue (e.g. _city_). New lines in this field become line breaks on the page.",
    }),
    defineField({ name: "sub", type: "text", rows: 3 }),
    defineField({
      name: "primaryCta",
      type: "object",
      fields: [
        { name: "label", type: "string" },
        { name: "href", type: "string" },
      ],
    }),
    defineField({
      name: "secondaryCta",
      type: "object",
      fields: [
        { name: "label", type: "string" },
        { name: "href", type: "string" },
      ],
    }),
  ],
  preview: {
    select: { title: "headline" },
  },
});
