// GROQ Queries for QShala Sanity Schema

export const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  brandName,
  tagline,
  logo,
  logoDark,
  contactPhone,
  contactEmail,
  officeAddress,
  googleMapsUrl,
  qqlPaymentUrl,
  blogBannerLabel,
  blogHeading,
  blogSubheading,
  contactHeading,
  contactSubheading,
  servicesBannerLabel,
  servicesHeading,
  servicesSubheading,
  socialLinks,
  defaultSeo {
    metaTitle,
    metaDescription,
    ogImage,
    canonicalUrl,
    noIndex
  }
}`;

export const navigationQuery = `*[_type == "navigation"][0]{
  title,
  links[]{
    name,
    href,
    isExternal
  },
  ctaButton {
    label,
    url,
    variant
  }
}`;

export const footerQuery = `*[_type == "footer"][0]{
  bannerBadge,
  bannerHeading,
  bannerDescription,
  bannerCtaText,
  bannerCtaUrl,
  companyName,
  companyDescription,
  copyrightText,
  quickLinks,
  programLinks,
  resourcesLinks
}`;

export const homePageQuery = `*[_type == "homePage"][0]{
  heroBadge,
  heroTypewriterPrefix,
  heroTypewriterWords,
  heroIntro,
  heroCta {
    label,
    url,
    variant
  },
  eventsHeading,
  eventsSubtitle,
  effectBadge,
  effectHeading,
  effectLine,
  effectButtonText,
  gameBadge,
  gameHeading,
  gameSubtitle,
  storeBadge,
  storeHeading,
  storeSubtitle,
  newsletterHeading,
  newsletterLine,
  newsletterButtonLabel,
  impactBadge,
  impactHeading,
  impactButtonLabel,
  impactButtonUrl,
  faqBadge,
  faqHeading,
  faqButtonLabel,
  faqButtonUrl,
  seo {
    metaTitle,
    metaDescription,
    ogImage,
    canonicalUrl,
    noIndex
  }
}`;

export const aboutPageQuery = `*[_type == "aboutPage"][0]{
  heroBadge,
  heroHeading,
  heroIntro,
  stats[]{
    value,
    label,
    color
  },
  foundersHeading,
  foundersSubtitle,
  teamSectionLabel,
  teamSectionHeading,
  teamSectionSubheading,
  storyHeadline,
  storyContent,
  seo {
    metaTitle,
    metaDescription,
    ogImage,
    canonicalUrl,
    noIndex
  }
}`;

export const allServicePagesQuery = `*[_type == "servicePage"]{
  _id,
  title,
  "slug": slug.current,
  badge,
  headline,
  intro,
  mascotVariant,
  heroImage,
  offerings[]{
    title,
    tagline,
    desc,
    accent,
    bg
  },
  specialModules[]{
    title,
    tagline,
    desc
  },
  flagshipQuizzes[]{
    title,
    badge,
    desc,
    price
  },
  collaborations[]{
    title,
    desc
  },
  contactDirectLine {
    name,
    phone,
    role
  },
  seo
}`;

export const servicePageBySlugQuery = `*[_type == "servicePage" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  badge,
  headline,
  intro,
  mascotVariant,
  heroImage,
  offerings[]{
    title,
    tagline,
    desc,
    accent,
    bg
  },
  specialModules[]{
    title,
    tagline,
    desc
  },
  flagshipQuizzes[]{
    title,
    badge,
    desc,
    price
  },
  collaborations[]{
    title,
    desc
  },
  contactDirectLine {
    name,
    phone,
    role
  },
  seo
}`;

export const upcomingEventsQuery = `*[_type == "event" && isFeatured != false] | order(order asc, isoDate asc){
  _id,
  "id": _id,
  title,
  "slug": slug.current,
  category,
  date,
  isoDate,
  desc,
  venue,
  buttonType,
  buttonText,
  buttonUrl,
  heroImage
}`;

export const allCaseStudiesQuery = `*[_type == "caseStudy"] | order(order asc){
  _id,
  "id": _id,
  "slug": slug.current,
  clientName,
  clientType,
  title,
  summary,
  impactMetrics[]{
    value,
    label
  },
  quote {
    text,
    author,
    role
  },
  tags,
  image
}`;

export const coFoundersQuery = `*[_type == "teamMember" && isCoFounder == true] | order(order asc){
  _id,
  "id": _id,
  name,
  "slug": slug.current,
  role,
  category,
  bio,
  image,
  imageUrl,
  isCoFounder,
  coFounderBadge,
  mascotVariant,
  accentColor,
  linkedInUrl,
  instagramUrl
}`;

export const curiosityCrewQuery = `*[_type == "teamMember" && isCoFounder != true] | order(name asc){
  _id,
  "id": _id,
  name,
  "slug": slug.current,
  role,
  category,
  bio,
  image,
  imageUrl,
  isCoFounder,
  mascotVariant,
  accentColor,
  linkedInUrl,
  instagramUrl
}`;

export const allAdvisorsQuery = `*[_type == "advisor"] | order(order asc){
  _id,
  name,
  role,
  company,
  badge,
  color,
  logo,
  logoUrl
}`;

export const homeFaqsQuery = `*[_type == "faq" && showOnHome != false] | order(order asc){
  _id,
  question,
  answer,
  category
}`;

export const allFaqsQuery = `*[_type == "faq"] | order(order asc){
  _id,
  question,
  answer,
  category
}`;

export const allTestimonialsQuery = `*[_type == "testimonial"] | order(order asc){
  _id,
  author,
  role,
  organization,
  category,
  quote,
  avatar,
  avatarUrl,
  rating
}`;

export const allPostsQuery = `*[_type == "post"] | order(isoDate desc, _createdAt desc){
  _id,
  "slug": slug.current,
  title,
  category,
  readTime,
  date,
  isoDate,
  author,
  authorRole,
  summary,
  color,
  bg,
  mainImage,
  mainImageUrl,
  gallery[]{
    url,
    caption,
    image
  },
  seo
}`;

export const postBySlugQuery = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  "slug": slug.current,
  title,
  category,
  readTime,
  date,
  isoDate,
  author,
  authorRole,
  summary,
  color,
  bg,
  mainImage,
  mainImageUrl,
  body,
  rawHtmlContent,
  gallery[]{
    url,
    caption,
    image
  },
  seo
}`;

export const allProductsQuery = `*[_type == "product"] | order(order asc){
  _id,
  "id": _id,
  "slug": slug.current,
  title,
  category,
  price,
  rating,
  description,
  image,
  imageUrl,
  isPopular,
  buyUrl
}`;

export const allPartnersQuery = `*[_type == "partner"] | order(order asc){
  _id,
  name,
  category,
  logo,
  logoUrl,
  website
}`;
