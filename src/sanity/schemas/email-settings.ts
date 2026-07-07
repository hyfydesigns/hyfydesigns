import { defineType, defineField } from "sanity";

export const emailSettings = defineType({
  name: "emailSettings",
  title: "Email templates",
  type: "document",
  fields: [
    defineField({
      name: "welcome",
      title: "Newsletter welcome",
      type: "emailTemplate",
      description: "Sent to subscribers immediately after they sign up.",
    }),
    defineField({
      name: "contactResponse",
      title: "Contact form auto-response",
      type: "emailTemplate",
      description:
        "Sent automatically to a customer who submits the Contact form. Confirms we got their message.",
    }),
    defineField({
      name: "quoteResponse",
      title: "Quote request auto-response",
      type: "emailTemplate",
      description:
        "Sent automatically to a customer who submits the Custom Orders quote form. Confirms we got their request.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Email templates" };
    },
  },
});
