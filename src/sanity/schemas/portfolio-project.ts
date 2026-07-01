import { defineType, defineField } from "sanity";

export const portfolioProject = defineType({
  name: "portfolioProject",
  title: "Portfolio project",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "meta", type: "string", description: "e.g. 80 shirts · Heights, TX" }),
    defineField({
      name: "category",
      type: "string",
      options: {
        list: ["Team merch", "Event", "Small business", "Personal", "Engraving"],
      },
    }),
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "tone",
      type: "string",
      description: "Background tone when photo is absent",
      options: {
        list: [
          { title: "Red tint", value: "bg-red-tint text-red-deep" },
          { title: "Blue", value: "bg-blue text-cream" },
          { title: "Blue tint", value: "bg-blue-tint text-blue" },
          { title: "Navy", value: "bg-navy text-cream" },
          { title: "Cream warm", value: "bg-cream-warm text-navy" },
          { title: "Red", value: "bg-red text-cream" },
        ],
      },
      initialValue: "bg-blue text-cream",
    }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
  preview: {
    select: { title: "title", subtitle: "meta", media: "image" },
  },
});
