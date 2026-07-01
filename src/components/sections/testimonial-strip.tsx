import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import {
  TestimonialCard,
  type Testimonial,
} from "@/components/ui/testimonial-card";
import { ButtonLink } from "@/components/ui/button";
import { sanityFetch } from "@/sanity/client";
import { TESTIMONIALS_QUERY } from "@/sanity/queries";
import type { TestimonialDoc } from "@/sanity/types";

const fallback: Testimonial = {
  quote:
    "They printed 80 shirts for our Heights coffee shop in a week — colors popped, staff still wear theirs a year later.",
  name: "Maya R.",
  role: "Blacksmith Coffee, Houston",
  initials: "MR",
};

export async function TestimonialStrip() {
  const docs = await sanityFetch<TestimonialDoc[]>(TESTIMONIALS_QUERY, {}, []);
  const testimonial: Testimonial = docs[0]
    ? {
        quote: docs[0].quote,
        name: docs[0].name,
        role: docs[0].role ?? "",
        initials: docs[0].initials ?? docs[0].name.slice(0, 2).toUpperCase(),
        rating: docs[0].rating,
      }
    : fallback;

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="grid gap-4 sm:gap-5 lg:grid-cols-[1.4fr_1fr]">
          <TestimonialCard testimonial={testimonial} />
          <div className="bg-cream border border-hairline rounded-2xl p-6 sm:p-7 flex flex-col justify-center">
            <h3 className="text-lg sm:text-xl">Need something custom?</h3>
            <p className="mt-1.5 text-sm text-ink-600 leading-relaxed">
              Upload your art. We&apos;ll quote within 24 hours.
            </p>
            <ButtonLink
              href="/custom-orders"
              size="md"
              className="mt-4 w-full sm:w-fit"
            >
              Start a project
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
