import type { SchemaTypeDefinition } from "sanity";
import { homeHero } from "./home-hero";
import { heroSlide } from "./hero-slide";
import { contactPage } from "./contact-page";
import { seoSettings } from "./seo-settings";
import { emailTemplate } from "./email-template";
import { emailSettings } from "./email-settings";
import { lifestylePhoto } from "./lifestyle-photo";
import { portfolioProject } from "./portfolio-project";
import { testimonial } from "./testimonial";
import { collection } from "./collection";
import { productContent } from "./product-content";

export const schemaTypes: SchemaTypeDefinition[] = [
  homeHero,
  heroSlide,
  contactPage,
  seoSettings,
  emailSettings,
  emailTemplate,
  collection,
  productContent,
  lifestylePhoto,
  portfolioProject,
  testimonial,
];
