import { defineType, defineField } from "sanity";

export const lifestylePhoto = defineType({
  name: "lifestylePhoto",
  title: "Lifestyle photo",
  type: "document",
  fields: [
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "location",
      type: "string",
      description: "Buffalo Bayou, Montrose, Heights, etc.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "caption", type: "string" }),
    defineField({
      name: "aspect",
      type: "string",
      options: {
        list: [
          { title: "Tall (4:5)", value: "aspect-[4/5]" },
          { title: "Wide (4:3)", value: "aspect-[4/3]" },
          { title: "Square (1:1)", value: "aspect-square" },
        ],
      },
      initialValue: "aspect-[4/3]",
    }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
  preview: {
    select: { title: "location", subtitle: "caption", media: "image" },
  },
});
