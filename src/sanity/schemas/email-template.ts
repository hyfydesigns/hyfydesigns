import { defineType, defineField } from "sanity";

// Reusable object type used inside the emailSettings singleton for each
// of the three customer-facing templates.
export const emailTemplate = defineType({
  name: "emailTemplate",
  title: "Email template",
  type: "object",
  fields: [
    defineField({
      name: "subject",
      type: "string",
      description:
        "Subject line. Supports {{name}} — replaced with the customer's name at send time.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "heading",
      type: "string",
      description:
        "Large heading at the top of the email. Supports {{name}}. Leave blank to skip.",
    }),
    defineField({
      name: "body",
      type: "text",
      rows: 8,
      description:
        "Body of the email. Blank lines create paragraph breaks. Supports {{name}} and {{email}}.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "signoff",
      type: "text",
      rows: 3,
      description:
        "Small text after the body — usually a signature and studio contact. Blank lines create paragraph breaks.",
    }),
  ],
  preview: {
    select: { title: "subject" },
    prepare({ title }) {
      return { title: title || "(no subject set)" };
    },
  },
});
