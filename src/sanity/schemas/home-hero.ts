import { defineType, defineField } from "sanity";

export const homeHero = defineType({
  name: "homeHero",
  title: "Home hero",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", type: "string", initialValue: "Printed in Houston since 2004" }),
    defineField({ name: "headline", type: "string", validation: (r) => r.required() }),
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
