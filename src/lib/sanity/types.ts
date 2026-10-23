export interface SanityImageReference {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
  caption?: string;
}

export interface SanitySeo {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: SanityImageReference;
  canonicalUrl?: string;
  noIndex?: boolean;
}

export interface SanityCallToAction {
  label: string;
  url: string;
  variant?: 'yellow' | 'blue' | 'green' | 'dark' | 'outline';
}

export interface SanityMetric {
  value: string;
  label: string;
}

export interface SanityQuote {
  text: string;
  author: string;
  role?: string;
}

export interface SanityGalleryItem {
  url?: string;
  image?: SanityImageReference;
  asset?: any;
  caption: string;
}

export interface SanitySiteSettings {
  brandName: string;
  tagline?: string;
  logo?: SanityImageReference;
  logoDark?: SanityImageReference;
  contactPhone: string;
  contactEmail: string;
  officeAddress: string;
  address?: string;
  googleMapsUrl?: string;
  socialLinks?: Array<{ platform: string; url: string }>;
  defaultSeo?: SanitySeo;
}

export interface SanityNavigation {
  title: string;
  links: Array<{ name: string; href: string; isExternal?: boolean }>;
  ctaButton?: SanityCallToAction;
}

export interface SanityFooter {
  bannerBadge?: string;
  bannerHeading?: string;
  bannerDescription?: string;
  bannerCtaText?: string;
  bannerCtaUrl?: string;
  companyName?: string;
  companyDescription?: string;
  copyrightText?: string;
  quickLinks?: Array<{ name: string; href: string }>;
  programLinks?: Array<{ name: string; href: string }>;
  resourcesLinks?: Array<{ name: string; href: string }>;
}

export interface SanityHomePage {
  heroBadge?: string;
  heroTypewriterPrefix?: string;
  heroTypewriterWords?: string[];
  heroIntro?: string;
  heroCta?: SanityCallToAction;
  eventsHeading?: string;
  eventsSubtitle?: string;
  gameBadge?: string;
  gameHeading?: string;
  gameSubtitle?: string;
  storeBadge?: string;
  storeHeading?: string;
  storeSubtitle?: string;
  seo?: SanitySeo;
}

export interface SanityAboutPage {
  heroBadge?: string;
  heroHeading?: string;
  heroIntro?: string;
  stats?: Array<{ value: string; label: string; color?: string }>;
  foundersHeading?: string;
  foundersSubtitle?: string;
  storyHeadline?: string;
  storyContent?: any;
  seo?: SanitySeo;
}

export interface SanityEvent {
  _id?: string;
  id?: string;
  title: string;
  slug?: { current: string };
  category: 'School' | 'Corporate' | 'College' | 'Community';
  date: string;
  isoDate?: string;
  desc: string;
  venue?: string;
  buttonType: 'register' | 'learn_more' | 'none';
  buttonText?: string;
  buttonUrl?: string;
  heroImage?: SanityImageReference;
  isFeatured?: boolean;
}

export interface SanityCaseStudy {
  _id?: string;
  id?: string;
  slug: string | { current: string };
  clientName: string;
  clientType: 'School' | 'Corporate' | 'College' | 'Community';
  title: string;
  summary: string;
  impactMetrics: SanityMetric[];
  quote: SanityQuote;
  tags: string[];
  image?: SanityImageReference;
  imageUrl?: string;
  coverImage?: SanityImageReference;
}

export interface SanityTeamMember {
  _id?: string;
  id?: string;
  name: string;
  slug?: { current: string };
  role: string;
  category: string;
  bio: string;
  image?: SanityImageReference;
  imageUrl?: string;
  isCoFounder?: boolean;
  coFounderBadge?: string;
  mascotVariant?: string;
  accentColor?: string;
  linkedInUrl?: string;
  instagramUrl?: string;
}

export interface SanityAdvisor {
  _id?: string;
  name: string;
  role: string;
  company: string;
  badge: string;
  color: string;
  logo?: SanityImageReference;
  logoUrl?: string;
}

export interface SanityFAQ {
  _id?: string;
  question: string;
  answer: string;
  category: string;
  showOnHome?: boolean;
}

export interface SanityTestimonial {
  _id?: string;
  author: string;
  role: string;
  organization: string;
  type?: 'School' | 'Corporate' | 'College' | 'Community' | 'Parent';
  category?: 'School' | 'Corporate' | 'College' | 'Community' | 'Parent';
  quote: string;
  avatar?: SanityImageReference;
  avatarUrl?: string;
  rating?: number;
  initials?: string;
  accentColor?: string;
  bgColor?: string;
}

export interface SanityPost {
  _id?: string;
  slug: string | { current: string };
  title: string;
  category: string;
  readTime: string;
  date?: string;
  isoDate?: string;
  publishedAt?: string;
  author: string;
  authorRole?: string;
  summary: string;
  content?: string;
  color?: string;
  bg?: string;
  mainImage?: SanityImageReference;
  mainImageUrl?: string;
  body?: any;
  rawHtmlContent?: string;
  gallery?: SanityGalleryItem[];
  seo?: SanitySeo;
}

export interface SanityServicePage {
  _id?: string;
  title: string;
  slug: string | { current: string };
  badge: string;
  headline: string;
  intro: string;
  mascotVariant: string;
  heroImage?: SanityImageReference;
  offerings?: Array<{
    title: string;
    tagline?: string;
    desc: string;
    accent?: string;
    bg?: string;
  }>;
  specialModules?: Array<{
    title: string;
    tagline?: string;
    desc: string;
  }>;
  flagshipQuizzes?: Array<{
    title: string;
    badge?: string;
    desc: string;
    price?: string;
  }>;
  collaborations?: Array<{
    title: string;
    desc: string;
  }>;
  contactDirectLine?: {
    name: string;
    phone: string;
    role: string;
  };
  seo?: SanitySeo;
}

export interface SanityProduct {
  _id?: string;
  id?: string;
  slug: string | { current: string };
  title: string;
  subtitle?: string;
  category: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  cardColor?: string;
  mascotVariant?: string;
  rating?: number;
  description: string;
  image?: SanityImageReference;
  imageUrl?: string;
  isPopular?: boolean;
  buyUrl?: string;
}

export interface SanityPartner {
  _id?: string;
  name: string;
  category?: string;
  logo?: SanityImageReference;
  logoUrl?: string;
  website?: string;
  order?: number;
}
