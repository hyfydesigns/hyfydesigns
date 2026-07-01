import type { SchemaTypeDefinition } from "sanity";
import { homeHero } from "./home-hero";
import { lifestylePhoto } from "./lifestyle-photo";
import { portfolioProject } from "./portfolio-project";
import { testimonial } from "./testimonial";

export const schemaTypes: SchemaTypeDefinition[] = [
  homeHero,
  lifestylePhoto,
  portfolioProject,
  testimonial,
];
