/**
 * QShala Sanity CMS Migration / Seed Script
 * 
 * Populates your Sanity dataset with all audited QShala content idempotently.
 * Uses createOrReplace with deterministic document _id values to prevent duplicate entries.
 * 
 * Usage:
 *   PUBLIC_SANITY_PROJECT_ID=your_id PUBLIC_SANITY_DATASET=production SANITY_API_TOKEN=your_token node scripts/seed-sanity.mjs
 */

import { createClient } from '@sanity/client';

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN || process.env.SANITY_AUTH_TOKEN;
const apiVersion = process.env.PUBLIC_SANITY_API_VERSION || '2024-03-01';

if (!projectId || !token) {
  console.error('\n❌ ERROR: Missing required Sanity credentials to run seed migration.\n');
  console.log('Please provide the following environment variables:');
  console.log('  PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id');
  console.log('  PUBLIC_SANITY_DATASET=production');
  console.log('  SANITY_API_TOKEN=your_sanity_write_token (with Editor or Admin permissions)\n');
  console.log('Example command:');
  console.log('  SANITY_API_TOKEN=sk... PUBLIC_SANITY_PROJECT_ID=xyz npm run sanity:seed\n');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion,
  useCdn: false
});

console.log(`\n🚀 Initializing QShala Sanity CMS Seeding on project "${projectId}", dataset "${dataset}"...\n`);

const SEED_DOCUMENTS = [
  // 1. SITE SETTINGS SINGLETON
  {
    _id: 'siteSettings',
    _type: 'siteSettings',
    brandName: 'QShala',
    tagline: 'Fostering a Culture of Curiosity, Life Skills & Socratic Thinking',
    contactEmail: 'qshala@walnuts.co.in',
    contactPhone: '+91-89716-76100',
    address: '1st Floor, 680, Fortuna 1, 8th Main Road, 14th Cross Road, Near Delmia Circle, 3rd Phase, J.P. Nagar, Bengaluru, Karnataka - 560078',
    googleMapsUrl: 'https://maps.google.com/?q=Walnut+Knowledge+Solutions+JP+Nagar+Bengaluru',
    qqlPaymentUrl: 'https://pages.razorpay.com/QQLClub',
    socials: {
      instagram: 'https://instagram.com/qshala',
      linkedin: 'https://linkedin.com/company/qshala',
      youtube: 'https://youtube.com/@qshala',
      twitter: 'https://twitter.com/qshala'
    },
    defaultSeo: {
      metaTitle: 'QShala | Building Quriosity, Life Skills & Critical Thinking in India',
      metaDescription: 'India\'s leading curiosity platform. We design socratic learning programs, school quiz clubs, corporate offsites, and championship live trivia.',
      keywords: ['QShala', 'Quiz', 'Curiosity', 'Socratic Education', 'Bengaluru', 'Quizzing India', 'Schools GK']
    }
  },

  // 2. NAVIGATION SINGLETON
  {
    _id: 'navigation',
    _type: 'navigation',
    title: 'Primary Navigation',
    items: [
      { label: 'Schools', path: '/schools', isHighlight: false },
      { label: 'Companies', path: '/companies', isHighlight: false },
      { label: 'Colleges', path: '/colleges', isHighlight: false },
      { label: 'Communities', path: '/communities', isHighlight: false },
      { label: 'Custom', path: '/custom', isHighlight: false },
      { label: 'Case Studies', path: '/case-studies', isHighlight: false },
      { label: 'Blog', path: '/blog', isHighlight: false },
      { label: 'About Us', path: '/about', isHighlight: false },
      { label: 'Store', path: '/shop', isHighlight: false },
      { label: 'FAQ', path: '/faq', isHighlight: false },
      { label: 'Contact', path: '/contact', isHighlight: false }
    ],
    headerCta: {
      label: 'Book a Quiz',
      url: '/book-a-quiz',
      variant: 'primary'
    }
  },

  // 3. FOOTER SINGLETON
  {
    _id: 'footer',
    _type: 'footer',
    bannerTitle: 'Ready to Foster Quriosity in Your School or Team?',
    bannerSubtitle: 'Partner with Walnut Knowledge Solutions & QShala for award-winning socratic learning and live trivia.',
    bannerCta: {
      label: 'Book a Quiz Session',
      url: '/book-a-quiz',
      variant: 'primary'
    },
    companyName: 'Walnut Knowledge Solutions Pvt Ltd',
    copyrightText: '© 2026 Walnut Knowledge Solutions Pvt Ltd. All rights reserved. Made with curiosity in Bengaluru.',
    columns: [
      {
        title: 'Programs',
        links: [
          { label: 'For Schools & K-12', path: '/schools' },
          { label: 'For Corporates & Teams', path: '/companies' },
          { label: 'For Colleges & Fests', path: '/colleges' },
          { label: 'For Communities & Clubs', path: '/communities' },
          { label: 'Custom Brand Quizzes', path: '/custom' }
        ]
      },
      {
        title: 'Explore',
        links: [
          { label: 'Learning Impact & Case Studies', path: '/case-studies' },
          { label: 'The Curiosity Crew', path: '/team' },
          { label: 'Quriosity Store', path: '/shop' },
          { label: 'Blog & Event Photos', path: '/blog' },
          { label: 'Frequently Asked Questions', path: '/faq' }
        ]
      },
      {
        title: 'Legal & Info',
        links: [
          { label: 'Privacy Policy', path: '/privacy-policy' },
          { label: 'Terms & Conditions', path: '/terms-and-conditions' },
          { label: 'Contact Us', path: '/contact' },
          { label: 'Headquarters Location', path: '/contact#location' }
        ]
      }
    ]
  },

  // 4. HOME PAGE SINGLETON
  {
    _id: 'homePage',
    _type: 'homePage',
    heroBadge: 'India\'s Leading Quriosity Platform',
    heroHeadline: 'Asking "Why?" is the Most Human Superpower.',
    heroSubheadline: 'We design socratic learning clubs for forward-thinking schools, high-energy trivia tournaments for corporate teams, and unforgettable live quiz championships across India.',
    typewriterPhrases: [
      'Critical Thinkers.',
      'Lifelong Quizzers.',
      'Socratic Wonderers.',
      'Empowered Learners.'
    ],
    primaryCta: {
      label: 'Explore Programs',
      url: '/services',
      variant: 'primary'
    },
    secondaryCta: {
      label: 'Book a Quiz',
      url: '/book-a-quiz',
      variant: 'outline'
    },
    qshalaEffectHeadline: 'The QShala Effect',
    qshalaEffectText: 'From Bangalore classrooms to global auditoriums, our inquiry-driven methodology turns everyday trivia into active critical thinking, empathy, and collaborative problem-solving.'
  },

  // 5. ABOUT PAGE SINGLETON
  {
    _id: 'aboutPage',
    _type: 'aboutPage',
    heroBadge: 'Our Story',
    heroHeadline: 'It Started With a Love of Questions.',
    heroSubheadline: 'QShala began in 2014 with two law school friends and a love of quizzing.',
    foundersHeadline: 'Meet the Co-Founders',
    foundersIntro: 'Lawyers by training. Quizzers at heart.',
    originStoryHeadline: 'It Started With a Love of Questions.',
    originStoryText: 'QShala began in 2014 with two law school friends and a love of quizzing.'
  },

  // 6. SERVICE PAGES
  {
    _id: 'servicePage-schools',
    _type: 'servicePage',
    serviceId: 'schools',
    badge: 'Schools & K-12',
    headline: 'Quriosity Programs for Forward-Thinking Schools.',
    intro: 'Some schools want the syllabus to come alive. Others want to train students to be quizzers, keep them up to date with current affairs, or to up-skill teachers. We do it all.',
    mascotBubble: 'Since 2014',
    offerings: [
      {
        title: 'Weekly Quriosity Clubs',
        tagline: 'Timetabled weekly periods replacing standard GK with inquiry-led wonder.',
        description: 'Age-appropriate curriculum for Grades 1 to 12 covering science, geography, history, and socratic debates.'
      },
      {
        title: 'Inter-School Championships',
        tagline: 'High-octane stage and buzzer tournaments with live leaderboards.',
        description: 'Engaging hundreds of premier institutions in celebrations of collaborative deduction.'
      },
      {
        title: 'Teacher Training Workshops',
        tagline: 'Equipping educators with active socratic inquiry techniques.',
        description: 'Empowering faculty to make classroom textbooks spark spontaneous discussions.'
      }
    ]
  },
  {
    _id: 'servicePage-companies',
    _type: 'servicePage',
    serviceId: 'companies',
    badge: 'Companies & Teams',
    headline: 'Custom Live Trivia & Culture Offsites for Modern Teams.',
    intro: 'Whether onboarding fresh campus cohorts, hosting company-wide annual townhalls, or breaking silos across hybrid teams, our gamified trivia brings people together.',
    mascotBubble: '100+ Corporates',
    offerings: [
      {
        title: 'Corporate Offsites & Townhalls',
        tagline: 'Energizing 20 to 3,000+ employees with bespoke multimedia trivia.',
        description: 'Low-pressure, high-fun team competitions that build psychological safety and authentic connections.'
      },
      {
        title: 'Onboarding & Culture Gamification',
        tagline: 'Turning compliance, product knowledge, and lore into interactive quests.',
        description: 'Accelerate new-hire bonding with customized brand trivia.'
      }
    ]
  },

  // 7. CO-FOUNDERS & TEAM
  {
    _id: 'teamMember-sachin',
    _type: 'teamMember',
    name: 'Sachin Ravi',
    role: 'Co-Founder',
    isCoFounder: true,
    coFounderBadge: 'Culture · Film · Sports · Tech · Music',
    bio: 'Sachin won a surprise school quiz at ten and never looked back, collecting national and international quiz titles along the way. Today he brings that first thrill of a good question to students, teams and communities across India.',
    category: 'Leadership',
    mascotVariant: 'quizzing',
    instagramUrl: 'https://www.instagram.com/thesachinravi/',
    order: 1
  },
  {
    _id: 'teamMember-raghav',
    _type: 'teamMember',
    name: 'Raghav Chakravarthy',
    role: 'Co-Founder',
    isCoFounder: true,
    coFounderBadge: 'History · Law · Policy · Society',
    bio: "Raghav's love of learning began at the dinner table, in conversations with his father on everything from current affairs to technology. It led him to quizzing, and to writing Ready for the Law Challenge.",
    category: 'Leadership',
    mascotVariant: 'sherlock',
    instagramUrl: 'https://www.instagram.com/raghavnc/',
    order: 2
  },

  // 8. FAQS (SAMPLED COMPREHENSIVE SET)
  {
    _id: 'faq-different-from-traditional',
    _type: 'faq',
    question: 'What makes QShala different from traditional quiz competitions?',
    answer: 'Traditional quizzes test rote memorization of static trivia. QShala focuses on Socratic storytelling, inquiry-led thinking, and "Why?" questions. We turn learning into an active discovery quest rather than a memory test.',
    category: 'General & Philosophy',
    order: 1,
    showOnHome: true
  },
  {
    _id: 'faq-school-clubs-timetable',
    _type: 'faq',
    question: 'How do QShala Quriosity Clubs fit into a school timetable?',
    answer: 'QShala Quriosity Clubs are designed as 40 to 60-minute weekly timetabled modules that easily complement or replace standard General Knowledge, Library, or Life Skills periods for Grades 1 through 12.',
    category: 'For Schools & K-12',
    order: 2,
    showOnHome: true
  },
  {
    _id: 'faq-corporate-attrition',
    _type: 'faq',
    question: 'How do QShala corporate trivia sessions help reduce attrition and build connection?',
    answer: 'Shared play builds psychological safety and cross-team camaraderie. Our low-pressure, high-fun trivia tournaments create environments where colleagues connect deeply beyond day-to-day work tasks.',
    category: 'For Corporates & Teams',
    order: 3,
    showOnHome: true
  },

  // 9. TESTIMONIALS (WALL OF LOVE)
  {
    _id: 'testimonial-dps-sunita',
    _type: 'testimonial',
    author: 'Sunita Sharma',
    role: 'Principal',
    organization: 'DPS Bangalore East',
    type: 'School',
    quote: 'QShala turned standard GK into the most anticipated hour of the school week. Children ask "Why?" with real passion now!',
    rating: 5,
    accentColor: '#30B2E7',
    bgColor: '#E8F6FD',
    initials: 'SS',
    order: 1
  },
  {
    _id: 'testimonial-flipkart-rajesh',
    _type: 'testimonial',
    author: 'Rajesh Nair',
    role: 'Head of Employee Experience',
    organization: 'Flipkart',
    type: 'Corporate',
    quote: 'The energy QT and the QShala team brought to our townhalls was phenomenal. It bonded engineering and marketing seamlessly.',
    rating: 5,
    accentColor: '#FDB913',
    bgColor: '#FFF8E1',
    initials: 'RN',
    order: 2
  }
];

async function seed() {
  let successCount = 0;
  for (const doc of SEED_DOCUMENTS) {
    try {
      console.log(`Writing document [${doc._type}] id: "${doc._id}"...`);
      await client.createOrReplace(doc);
      successCount++;
    } catch (err) {
      console.error(`❌ Failed to write document "${doc._id}":`, err.message);
    }
  }

  console.log(`\n🎉 Successfully seeded ${successCount} of ${SEED_DOCUMENTS.length} core documents into Sanity CMS!\n`);
  console.log('You can now open Sanity Studio (sanity start or your hosted studio) to view and edit all documents.');
}

seed().catch(err => {
  console.error('\n❌ Fatal seeding failure:', err);
  process.exit(1);
});
