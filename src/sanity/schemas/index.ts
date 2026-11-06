// Object Schemas
import seo from './objects/seo';
import blockContent from './objects/blockContent';
import callToAction from './objects/callToAction';
import metric from './objects/metric';
import quote from './objects/quote';
import galleryImage from './objects/galleryImage';
import serviceOffering from './objects/serviceOffering';
import flagshipQuiz from './objects/flagshipQuiz';

// Document Schemas (Singletons & Collections)
import siteSettings from './documents/siteSettings';
import navigation from './documents/navigation';
import footer from './documents/footer';
import homePage from './documents/homePage';
import aboutPage from './documents/aboutPage';
import servicePage from './documents/servicePage';
import event from './documents/event';
import caseStudy from './documents/caseStudy';
import career from './documents/career';
import teamMember from './documents/teamMember';
import advisor from './documents/advisor';
import faq from './documents/faq';
import testimonial from './documents/testimonial';
import post from './documents/post';
import product from './documents/product';
import partner from './documents/partner';

export const schemaTypes = [
  // Objects
  seo,
  blockContent,
  callToAction,
  metric,
  quote,
  galleryImage,
  serviceOffering,
  flagshipQuiz,

  // Documents
  siteSettings,
  navigation,
  footer,
  homePage,
  aboutPage,
  servicePage,
  event,
  caseStudy,
  career,
  teamMember,
  advisor,
  faq,
  testimonial,
  post,
  product,
  partner,
];
