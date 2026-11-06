/**
 * QShala Sanity CMS Migration / Seed Script
 * 
 * Populates your Sanity dataset with all audited QShala content idempotently.
 * Uses createOrReplace with deterministic document _id values to prevent duplicate entries.
 * Adds valid _key properties to all array objects and ensures type-strict schema compliance.
 * 
 * Usage:
 *   npm run sanity:seed
 */

import fs from 'fs';
import { createClient } from '@sanity/client';

// Load .env automatically if present
if (fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf8');
  for (const line of envContent.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    if (key && rest.length > 0) {
      const val = rest.join('=').trim().replace(/^["']|["']$/g, '');
      if (!process.env[key.trim()]) process.env[key.trim()] = val;
    }
  }
}

import {
  DEFAULT_SITE_SETTINGS,
  DEFAULT_NAVIGATION,
  DEFAULT_FOOTER,
  DEFAULT_HOME_PAGE,
  DEFAULT_ABOUT_PAGE,
  DEFAULT_CO_FOUNDERS,
  DEFAULT_CURIOSITY_CREW,
  DEFAULT_ADVISORS,
  DEFAULT_SERVICE_PAGES,
  DEFAULT_FAQS,
  DEFAULT_TESTIMONIALS,
  DEFAULT_CAREERS,
} from '../src/lib/sanity/api.ts';
import { CASE_STUDIES_DATA, PRODUCTS_DATA } from '../src/lib/data.ts';
import { DEFAULT_EVENTS } from '../src/lib/eventsStore.ts';

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || '7fw1qn07';
const dataset = process.env.PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN || process.env.SANITY_AUTH_TOKEN;
const apiVersion = process.env.PUBLIC_SANITY_API_VERSION || '2024-03-01';

if (!projectId || !token) {
  console.error('\n❌ ERROR: Missing required Sanity credentials to run seed migration.\n');
  console.log('Please provide the following environment variables (in .env or command line):');
  console.log('  PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id');
  console.log('  PUBLIC_SANITY_DATASET=production');
  console.log('  SANITY_API_TOKEN=your_sanity_write_token (with Editor or Admin permissions)\n');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion,
  useCdn: false
});

/**
 * Ensures all objects in an array have a unique, deterministic _key string
 */
function withKeys(arr, prefix = 'item') {
  if (!Array.isArray(arr)) return [];
  return arr.map((item, index) => {
    if (typeof item !== 'object' || item === null) return item;
    const identifier = item.platform || item.id || item.slug || item.name || item.title || item.label || item.value || `k${index + 1}`;
    const cleanId = String(identifier).toLowerCase().replace(/[^a-z0-9_-]/g, '_').substring(0, 32);
    const key = item._key || `${prefix}_${index + 1}_${cleanId}`;
    return {
      ...item,
      _key: key,
    };
  });
}

function toSlug(val) {
  if (!val) return { _type: 'slug', current: '' };
  if (typeof val === 'object' && val.current) {
    return { _type: 'slug', current: val.current };
  }
  return { _type: 'slug', current: String(val).trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-') };
}

// -------------------------------------------------------------
// POSTS (Blog, Event Reports, Case Studies & Careers)
// -------------------------------------------------------------
const SEED_POSTS = [
  {
    slug: 'bangalore-inter-school-quriosity-cup-2026',
    title: 'Bangalore Inter-School Quriosity Cup 2026',
    category: 'Events',
    readTime: 'Photo Gallery',
    date: 'July 2026',
    isoDate: '2026-07-20T10:00:00+05:30',
    author: 'Sachin Ravi',
    authorRole: 'Co-Founder, National Quizmaster',
    summary: "Over 1,200 student quizzers representing 64 schools competed across 4 adrenaline-pumping buzzer rounds at St. John's Auditorium.",
    color: '#FDB913',
    gallery: [
      { url: '/assets/media/schools/qe1.webp', caption: 'Packed classroom of young quizzers holding QShala curriculum kits' },
      { url: '/assets/media/crowd/dsc07829.webp', caption: 'Auditorium buzzing with students eagerly raising hands to answer' },
      { url: '/assets/media/schools/2.webp', caption: 'Students proudly displaying their participation certificates' },
      { url: '/assets/media/schools/3.webp', caption: 'Inquiry-driven socratic storytelling session in progress' },
      { url: '/assets/media/colleges/c1.webp', caption: 'Campus delegates cheering during the visual buzzer heats' },
      { url: '/assets/media/banners/nlq_final.webp', caption: 'Grand finale stage clash with the QShala mascot on big screen' },
      { url: '/assets/media/schools/7.webp', caption: 'Inter-school championship participants conferring on lateral thinking clues' },
      { url: '/assets/media/schools/8.webp', caption: 'Hands shooting up across the middle-school tier' },
      { url: '/assets/media/crowd/dsc07629.webp', caption: 'Audience questions and spot trivia giveaways' },
      { url: '/assets/media/banners/team_photo.webp', caption: 'The QShala team, educators, and finalists gathering for the closing photo' }
    ]
  },
  {
    slug: 'national-corporate-trivia-summit',
    title: 'National Corporate Trivia League Finals',
    category: 'Events',
    readTime: 'Photo Gallery',
    date: 'June 2026',
    isoDate: '2026-06-25T10:00:00+05:30',
    author: 'Raghav Chakravarthy',
    authorRole: 'Co-Founder, Chief Quizmaster',
    summary: '48 corporate teams from Flipkart, Google, Wipro, TCS, and Amazon competed in high-octane live buzzer trivia at JW Marriott, Bengaluru.',
    color: '#FDB913',
    gallery: [
      { url: '/assets/media/corporate/qe3.webp', caption: 'Cross-functional corporate team laughing and giving thumbs up during live trivia' },
      { url: '/assets/media/corporate/photo-2026-10-09-16-30-40.webp', caption: 'Corporate tournament teams standing with official QShala challenge banner' },
      { url: '/assets/media/corporate/corp_hertie.webp', caption: 'Leadership workshop engaging on culture and strategic trivia' },
      { url: '/assets/media/corporate/hertie2.webp', caption: 'Teams collaborating on rapid-fire business lore' },
      { url: '/assets/media/corporate/qe5.webp', caption: 'Audience participation and live leaderboard reactions' },
      { url: '/assets/media/colleges/c2.webp', caption: 'Stage finalists competing for the corporate championship trophy' },
      { url: '/assets/media/banners/nlq_final.webp', caption: 'Grand finale stage with over 300 spectators' },
      { url: '/assets/media/crowd/dsc07629.webp', caption: 'Audience high-fives and networking after the buzzer round' },
      { url: '/assets/media/banners/teams-3_1.webp', caption: 'Corporate learning and culture building showcase' },
      { url: '/assets/media/banners/team_photo.webp', caption: 'All corporate participants gathering for commemorative group snapshot' }
    ]
  },
  {
    slug: 'dps-bangalore-quriosity-league',
    title: 'How DPS Transformed General Knowledge into an Active Weekly Sport for 4,000+ Students',
    category: 'Case Study',
    readTime: 'Case Study & Photos',
    date: 'August 2026',
    isoDate: '2026-08-10T10:00:00+05:30',
    author: 'Sachin Ravi',
    authorRole: 'Co-Founder, National Quizmaster',
    summary: 'Replacing static encyclopedic learning with QShala interactive storytelling and weekly quriosity modules increased student participation by 340%.',
    color: '#75B543'
  },
  {
    slug: 'flipkart-corporate-trivia-league',
    title: 'Driving Hybrid Team Connection Across 12 Cities with Custom QShala Live Trivia',
    category: 'Case Study',
    readTime: 'Case Study & Photos',
    date: 'July 2026',
    isoDate: '2026-07-15T10:00:00+05:30',
    author: 'Raghav Chakravarthy',
    authorRole: 'Co-Founder, Chief Quizmaster',
    summary: 'A 6-week gamified cross-functional championship that boosted inter-departmental engagement during company-wide hybrid work initiatives.',
    color: '#FDB913'
  },
  {
    slug: 'wipro-onboarding-gamification',
    title: 'Gamifying Onboarding & Corporate Culture for 5,000+ Global New Hires',
    category: 'Case Study',
    readTime: 'Case Study & Photos',
    date: 'June 2026',
    isoDate: '2026-06-18T10:00:00+05:30',
    author: 'Sachin Ravi',
    authorRole: 'Co-Founder, National Quizmaster',
    summary: 'Replaced traditional slide presentations with interactive brand quests and company history trivia tournaments.',
    color: '#FDB913'
  },
  {
    slug: 'nps-socratic-science-storytelling',
    title: 'Pioneering Socratic Science & Civics Storytelling for Middle Schoolers',
    category: 'Case Study',
    readTime: 'Case Study & Photos',
    date: 'May 2026',
    isoDate: '2026-05-20T10:00:00+05:30',
    author: 'Sachin Ravi',
    authorRole: 'Co-Founder, National Quizmaster',
    summary: 'Integrated weekly real-world discovery modules to connect textbook science with current affairs and everyday phenomena.',
    color: '#75B543'
  },
  {
    slug: 'inventure-academy-critical-thinking',
    title: 'Building 21st-Century Critical Thinking & Public Debate Leagues',
    category: 'Case Study',
    readTime: 'Case Study & Photos',
    date: 'April 2026',
    isoDate: '2026-04-12T10:00:00+05:30',
    author: 'Sachin Ravi',
    authorRole: 'Co-Founder, National Quizmaster',
    summary: 'A multi-tier quriosity league where students analyze global news stories, logical fallacies, and ethical dilemmas.',
    color: '#75B543'
  },
  {
    slug: 'tcs-cross-hub-workplace-engagement',
    title: 'Cross-Functional Workplace Engagement Across 8 Regional Tech Hubs',
    category: 'Case Study',
    readTime: 'Case Study & Photos',
    date: 'March 2026',
    isoDate: '2026-03-15T10:00:00+05:30',
    author: 'Raghav Chakravarthy',
    authorRole: 'Co-Founder, Chief Quizmaster',
    summary: 'Quarterly inter-hub quiz championships with live digital buzzers and real-time leaderboards.',
    color: '#FDB913'
  },
  {
    slug: 'iit-bombay-techfest-championship',
    title: "Hosting India's Largest Inter-Collegiate Quriosity Quiz Championship",
    category: 'Events',
    readTime: 'Case Study & Photos',
    date: 'February 2026',
    isoDate: '2026-02-14T10:00:00+05:30',
    author: 'Sachin Ravi',
    authorRole: 'Co-Founder, National Quizmaster',
    summary: 'Packed auditoriums with 6,000+ delegates competing in high-stakes science, tech, and general awareness rounds.',
    color: '#30B2E7'
  },
  {
    slug: 'iim-bangalore-business-simulations',
    title: 'Real-World Business Case Study Simulations & Strategy Quests for MBAs',
    category: 'Case Study',
    readTime: 'Case Study & Photos',
    date: 'January 2026',
    isoDate: '2026-01-22T10:00:00+05:30',
    author: 'Sachin Ravi',
    authorRole: 'Co-Founder, National Quizmaster',
    summary: 'Interactive business trivia and market analysis strategy quests designed for future corporate leaders.',
    color: '#30B2E7'
  },
  {
    slug: 'careers-marketing-manager',
    title: 'Careers at QShala: Marketing Manager',
    category: 'Careers',
    readTime: 'Full Job Description',
    date: 'Open Position',
    isoDate: '2026-10-01T10:00:00+05:30',
    author: 'QShala People Team',
    authorRole: 'Talent & Culture',
    summary: "Lead brand campaigns, school outreach, and digital quriosity stories across India's premier inquiry learning platform.",
    color: '#75B543'
  },
  {
    slug: 'careers-operations-associate',
    title: 'Careers at QShala: Operations Associate',
    category: 'Careers',
    readTime: 'Full Job Description',
    date: 'Open Position',
    isoDate: '2026-10-01T10:00:00+05:30',
    author: 'QShala People Team',
    authorRole: 'Talent & Culture',
    summary: 'Manage live quiz event logistics, buzzer setups, school tournament coordination, and on-ground execution.',
    color: '#FDB913'
  },
  {
    slug: 'careers-engagement-associate',
    title: 'Careers at QShala: Engagement Associate & Quizmaster',
    category: 'Careers',
    readTime: 'Full Job Description',
    date: 'Open Position',
    isoDate: '2026-10-01T10:00:00+05:30',
    author: 'QShala People Team',
    authorRole: 'Talent & Culture',
    summary: 'Facilitate socratic sessions, host interactive live trivia, and inspire thousands of young quizzers in classrooms and stages.',
    color: '#30B2E7'
  },
  {
    slug: 'careers-video-editor',
    title: 'Careers at QShala: Video Editor & Visual Storyteller',
    category: 'Careers',
    readTime: 'Full Job Description',
    date: 'Open Position',
    isoDate: '2026-10-01T10:00:00+05:30',
    author: 'QShala People Team',
    authorRole: 'Talent & Culture',
    summary: 'Craft exciting video highlight reels, QShots clips, motion graphics, and animated brand stories.',
    color: '#75B543'
  }
];

// -------------------------------------------------------------
// PARTNERS (Clients, Corporates & Premier Schools)
// -------------------------------------------------------------
const SEED_PARTNERS = [
  { name: 'Google', category: 'Corporate', logoUrl: '/assets/logos/google.svg' },
  { name: 'HDFC Bank', category: 'Corporate', logoUrl: '/assets/logos/hdfcbank.svg' },
  { name: 'Wipro', category: 'Corporate', logoUrl: '/assets/logos/wipro.svg' },
  { name: 'Microsoft', category: 'Corporate', logoUrl: '/assets/logos/microsoft.svg' },
  { name: 'Tata Group', category: 'Corporate', logoUrl: '/assets/logos/tatagroup.svg' },
  { name: 'Amazon', category: 'Corporate', logoUrl: '/assets/logos/amazon.svg' },
  { name: 'Infosys', category: 'Corporate', logoUrl: '/assets/logos/infosys.svg' },
  { name: 'Netflix', category: 'Corporate', logoUrl: '/assets/logos/netflix.svg' },
  { name: 'Apple', category: 'Corporate', logoUrl: '/assets/logos/apple.svg' },
  { name: "Byju's", category: 'Corporate', logoUrl: '/assets/logos/byjus.svg' },
  { name: 'Facebook', category: 'Corporate', logoUrl: '/assets/logos/facebook.svg' },
  { name: 'Intel', category: 'Corporate', logoUrl: '/assets/logos/intel.svg' },
  { name: 'Zerodha', category: 'Corporate', logoUrl: '/assets/logos/zerodha.svg' },
  { name: 'Mindtree', category: 'Corporate', logoUrl: '/assets/logos/mindtree.svg' },
  { name: 'Delhi Public School', category: 'School', logoUrl: '/assets/logos/QShala Logo 1.svg' },
  { name: 'National Public School', category: 'School', logoUrl: '/assets/logos/QShala Logo 2.svg' },
  { name: 'Inventure Academy', category: 'School', logoUrl: '/assets/logos/QShala Logo 3.svg' },
  { name: 'The Valley School', category: 'School', logoUrl: '/assets/logos/QShala Logo 1.svg' },
  { name: 'Vidyashilp Academy', category: 'School', logoUrl: '/assets/logos/QShala Logo 2.svg' },
];

console.log(`\n🚀 Initializing QShala Sanity CMS Seeding on project "${projectId}", dataset "${dataset}"...\n`);

const SEED_DOCUMENTS = [
  // 1. SITE SETTINGS SINGLETON
  {
    _id: 'siteSettings',
    _type: 'siteSettings',
    ...DEFAULT_SITE_SETTINGS,
    socialLinks: withKeys(DEFAULT_SITE_SETTINGS.socialLinks, 'social'),
  },

  // 2. NAVIGATION SINGLETON
  {
    _id: 'navigation',
    _type: 'navigation',
    ...DEFAULT_NAVIGATION,
    links: withKeys(DEFAULT_NAVIGATION.links, 'nav'),
  },

  // 3. FOOTER SINGLETON
  {
    _id: 'footer',
    _type: 'footer',
    ...DEFAULT_FOOTER,
    quickLinks: withKeys(DEFAULT_FOOTER.quickLinks, 'ql'),
    programLinks: withKeys(DEFAULT_FOOTER.programLinks, 'pl'),
    resourcesLinks: withKeys(DEFAULT_FOOTER.resourcesLinks, 'rl'),
  },

  // 4. HOME PAGE SINGLETON
  {
    _id: 'homePage',
    _type: 'homePage',
    ...DEFAULT_HOME_PAGE,
  },

  // 5. ABOUT PAGE SINGLETON
  {
    _id: 'aboutPage',
    _type: 'aboutPage',
    ...DEFAULT_ABOUT_PAGE,
    stats: withKeys(DEFAULT_ABOUT_PAGE.stats, 'stat'),
  },

  // 6. CO-FOUNDERS
  ...DEFAULT_CO_FOUNDERS.map((founder, idx) => ({
    _id: `teamMember-${founder.id}`,
    _type: 'teamMember',
    ...founder,
    slug: toSlug(founder.id),
    order: idx + 1,
  })),

  // 7. CURIOSITY CREW (ALPHABETICAL ORDER)
  ...DEFAULT_CURIOSITY_CREW.map((member, idx) => ({
    _id: `teamMember-${member.id}`,
    _type: 'teamMember',
    ...member,
    slug: toSlug(member.id),
    order: idx + 10,
  })),

  // 8. SERVICE PAGES (AUDIENCES)
  ...Object.values(DEFAULT_SERVICE_PAGES).map((service) => ({
    _id: `servicePage-${service.slug}`,
    _type: 'servicePage',
    ...service,
    slug: toSlug(service.slug),
    offerings: withKeys(service.offerings, 'offering'),
    specialModules: withKeys(service.specialModules, 'module'),
    flagshipQuizzes: withKeys(service.flagshipQuizzes, 'quiz'),
    collaborations: withKeys(service.collaborations, 'collab'),
  })),

  // 9. INVESTORS & ADVISORS
  ...DEFAULT_ADVISORS.map((adv, idx) => ({
    _id: `advisor-${adv.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    _type: 'advisor',
    name: adv.name,
    role: adv.role,
    company: adv.company,
    badge: adv.badge || 'Angel Backer',
    color: adv.color || '#387ED1',
    logoUrl: adv.logoUrl,
    avatarUrl: adv.avatarUrl,
    order: idx + 1,
  })),

  // 10. EVENTS & QUESTS
  ...DEFAULT_EVENTS.map((ev, idx) => ({
    _id: `event-${ev.id}`,
    _type: 'event',
    title: ev.title,
    slug: toSlug(ev.id),
    category: ev.category,
    date: ev.date,
    desc: ev.desc,
    venue: 'Bengaluru / Online',
    buttonType: ev.buttonType || 'register',
    buttonText: ev.buttonText || 'Register Now',
    buttonUrl: ev.buttonUrl || '/book-a-quiz',
    order: idx + 1,
  })),

  // 11. FAQS (ALL 14 QUESTIONS)
  ...DEFAULT_FAQS.map((faq, idx) => ({
    _id: `faq-${idx + 1}`,
    _type: 'faq',
    ...faq,
    order: idx + 1,
  })),

  // 12. CASE STUDIES
  ...CASE_STUDIES_DATA.map((cs, idx) => ({
    _id: `caseStudy-${cs.slug}`,
    _type: 'caseStudy',
    title: cs.title,
    slug: toSlug(cs.slug),
    clientName: cs.clientName || cs.client || '',
    clientType: cs.clientType || cs.audience || 'School',
    summary: cs.summary,
    impactMetrics: withKeys(
      (cs.impactMetrics || cs.metrics || []).map((m) => ({ value: m.value, label: m.label })),
      'metric'
    ),
    order: idx + 1,
    isFeatured: true,
    quote: cs.quote ? { text: cs.quote.text, author: cs.quote.author, role: cs.quote.role } : undefined,
  })),

  // 13. STORE PRODUCTS
  ...PRODUCTS_DATA.map((p, idx) => ({
    _id: `product-${p.id}`,
    _type: 'product',
    title: p.title,
    slug: toSlug(p.slug),
    category: p.category,
    price: typeof p.price === 'string' && p.price.startsWith('₹') ? p.price : `₹${p.price}`,
    rating: p.rating,
    description: p.description,
    isPopular: p.isPopular || false,
    order: idx + 1,
  })),

  // 14. TESTIMONIALS
  ...DEFAULT_TESTIMONIALS.map((t, idx) => ({
    _id: `testimonial-${idx + 1}`,
    _type: 'testimonial',
    ...t,
    order: idx + 1,
  })),

  // 15. BLOG & STORIES
  ...SEED_POSTS.map((post, idx) => ({
    _id: `post-${post.slug}`,
    _type: 'post',
    title: post.title,
    slug: toSlug(post.slug),
    category: post.category,
    readTime: post.readTime,
    date: post.date,
    isoDate: post.isoDate,
    author: post.author,
    authorRole: post.authorRole,
    summary: post.summary,
    color: post.color || '#FDB913',
    gallery: post.gallery ? withKeys(post.gallery, 'gallery') : undefined,
    order: idx + 1,
  })),

  // 16. CLIENT & SCHOOL PARTNERS
  ...SEED_PARTNERS.map((partner, idx) => ({
    _id: `partner-${partner.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    _type: 'partner',
    name: partner.name,
    category: partner.category,
    logoUrl: partner.logoUrl,
    order: idx + 1,
  })),

  // 17. CAREERS & JOB OPENINGS
  ...DEFAULT_CAREERS.map((career, idx) => ({
    _id: `career-${career.slug.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    _type: 'career',
    title: career.title,
    slug: toSlug(career.slug),
    department: career.department,
    location: career.location,
    employmentType: career.employmentType || 'Full-time',
    shortSummary: career.shortSummary,
    color: career.color || '#EDF7E5',
    imageSrc: career.imageSrc,
    applyEmail: career.applyEmail || 'mailto:work@walnuts.co.in',
    isActive: true,
    order: idx + 1,
  })),

];

async function seed() {
  console.log(`\n📦 Committing all ${SEED_DOCUMENTS.length} documents in a single atomic transaction...`);
  console.log('This prevents flooding Vercel with 100+ separate webhook deployment triggers.\n');
  
  const transaction = client.transaction();
  for (const doc of SEED_DOCUMENTS) {
    transaction.createOrReplace(doc);
  }
  
  try {
    const res = await transaction.commit();
    console.log(`🎉 Successfully seeded ${SEED_DOCUMENTS.length} core documents into Sanity CMS in 1 atomic commit!`);
    console.log(`Transaction ID: ${res.transactionId}\n`);
    console.log('You can now open Sanity Studio (https://qshala.sanity.studio) to view and edit all documents without schema errors.');
  } catch (err) {
    console.error(`❌ Atomic transaction commit failed:`, err.message);
    process.exit(1);
  }
}

seed().catch(err => {
  console.error('\n❌ Fatal seeding failure:', err);
  process.exit(1);
});
