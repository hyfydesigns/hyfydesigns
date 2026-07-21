export type SanityImage = {
  _type?: "image";
  asset?: { _ref?: string; _type?: string; url?: string };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
};

export type HomeHeroDoc = {
  eyebrow?: string;
  headline?: string;
  sub?: string;
  primaryCta?: { label?: string; href?: string };
  secondaryCta?: { label?: string; href?: string };
};

export type HeroSlideDoc = {
  _id: string;
  alt: string;
  badgeLabel?: string;
  linkHref?: string;
  image: SanityImage;
};

export type ContactPageDoc = {
  eyebrow?: string;
  headline?: string;
  intro?: string;
  formHeading?: string;
  studioAddress?: string;
  studioHours?: string;
  studioPhone?: string;
  studioEmail?: string;
  mapEmbedSrc?: string;
  subjects?: string[];
};

export type EmailTemplate = {
  subject?: string;
  heading?: string;
  body?: string;
  signoff?: string;
};

export type EmailSettingsDoc = {
  welcome?: EmailTemplate;
  contactResponse?: EmailTemplate;
  quoteResponse?: EmailTemplate;
};

export type LifestylePhotoDoc = {
  _id: string;
  location: string;
  caption?: string;
  aspect: string;
  image: SanityImage;
};

export type PortfolioProjectDoc = {
  _id: string;
  title: string;
  meta?: string;
  category?: string;
  tone: string;
  image?: SanityImage;
};

export type TestimonialDoc = {
  _id: string;
  quote: string;
  name: string;
  role?: string;
  initials?: string;
  rating?: number;
};

export type CollectionSummary = {
  _id: string;
  title: string;
  slug: string;
};

export type CollectionDoc = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  productSlugs?: string[];
};

export type CollectionStripItem = {
  _id: string;
  title: string;
  slug: string;
  highlightImage?: SanityImage;
  firstProductSlug?: string;
};

// PortableTextBlock — kept loose to avoid pulling the @portabletext/react
// types into this shared module; the renderer casts as needed.
export type ProductContentDoc = {
  slug: string;
  htmlDescription?: string;
  description?: unknown[];
  featuredColor?: string;
  sizingNote?: string;
  careNote?: string;
};
