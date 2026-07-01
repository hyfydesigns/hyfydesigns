import { defineType, defineField } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      type: "text",
      rows: 3,
      validation: (r) => r.required().max(240),
    }),
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "role",
      type: "string",
      description: "e.g. Blacksmith Coffee, Houston",
    }),
    defineField({
      name: "initials",
      type: "string",
      validation: (r) => r.max(3),
    }),
    defineField({
      name: "rating",
      type: "number",
      validation: (r) => r.min(1).max(5),
      initialValue: 5,
    }),
    defineField({ name: "featured", type: "boolean", initialValue: false }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
  preview: {
    select: { title: "name", subtitle: "role" },
  },
});
