import { groq } from "next-sanity";

export const HOME_HERO_QUERY = groq`
  *[_type == "homeHero"][0]{
    eyebrow, headline, sub, primaryCta, secondaryCta
  }
`;

export const HERO_SLIDES_QUERY = groq`
  *[_type == "heroSlide" && active == true] | order(order asc){
    _id, alt, badgeLabel, linkHref, image
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

export const FEATURED_COLLECTIONS_QUERY = groq`
  *[_type == "collection" && featured == true] | order(order asc, title asc){
    _id, title, "slug": slug.current
  }
`;

export const COLLECTION_QUERY = groq`
  *[_type == "collection" && slug.current == $slug][0]{
    _id, title, description, "slug": slug.current, productSlugs
  }
`;

export const ALL_COLLECTION_SLUGS_QUERY = groq`
  *[_type == "collection" && defined(slug.current)]{ "slug": slug.current }
`;

export const PRODUCT_CONTENT_QUERY = groq`
  *[_type == "productContent" && slug == $slug][0]{
    slug, htmlDescription, description, featuredColor, sizingNote, careNote
  }
`;

export const ALL_FEATURED_COLORS_QUERY = groq`
  *[_type == "productContent" && defined(featuredColor) && featuredColor != ""]{
    slug, featuredColor
  }
`;
