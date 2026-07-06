import { defineType, defineField } from "sanity";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact page",
  type: "document",
  fields: [
    defineField({
      name: "eyebrow",
      type: "string",
      initialValue: "Contact",
      description: "Small label above the headline.",
    }),
    defineField({
      name: "headline",
      type: "string",
      validation: (r) => r.required(),
      initialValue: "Let's talk shop.",
    }),
    defineField({
      name: "intro",
      type: "text",
      rows: 3,
      description:
        "Introductory paragraph shown under the headline.",
    }),
    defineField({
      name: "formHeading",
      type: "string",
      initialValue: "Send us a message.",
      description: "Heading above the contact form.",
    }),

    defineField({
      name: "studioAddress",
      type: "text",
      rows: 2,
      description:
        "Studio address shown on this page. Leave blank to use the site default (Houston, TX).",
    }),
    defineField({
      name: "studioHours",
      type: "string",
      description:
        "e.g. Mon–Fri · 9am–6pm. Leave blank to use the site default.",
    }),
    defineField({
      name: "studioPhone",
      type: "string",
      description: "Leave blank to use the site default.",
    }),
    defineField({
      name: "studioEmail",
      type: "string",
      description: "Leave blank to use the site default.",
    }),

    defineField({
      name: "mapEmbedSrc",
      type: "url",
      description:
        "The 'src' URL from a Google Maps embed iframe. In Google Maps: Share → Embed a map → copy the src attribute from the <iframe> tag it gives you. Leave blank to hide the map.",
    }),

    defineField({
      name: "subjects",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Options for the subject dropdown in the contact form. Leave empty to use the built-in defaults (General question, Custom order, Bulk / team order, Wholesale, Press).",
    }),
  ],
  preview: {
    select: { title: "headline" },
    prepare({ title }) {
      return { title: title || "Contact page" };
    },
  },
});
