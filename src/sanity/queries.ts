import { groq } from "next-sanity";

export const HOME_HERO_QUERY = groq`
  *[_type == "homeHero"][0]{
    eyebrow, headline, sub, primaryCta, secondaryCta
  }
`;

export const LIFESTYLE_PHOTOS_QUERY = groq`
  *[_type == "lifestylePhoto"] | order(order asc){
    _id, location, caption, aspect,
    image{..., asset->}
  }
`;

export const PORTFOLIO_QUERY = groq`
  *[_type == "portfolioProject"] | order(order asc){
    _id, title, meta, category, tone,
    image{..., asset->}
  }
`;

export const TESTIMONIALS_QUERY = groq`
  *[_type == "testimonial" && featured == true] | order(order asc){
    _id, quote, name, role, initials, rating
  }
`;
