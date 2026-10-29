/**
 * QShala Sanity CMS Migration / Seed Script
 * 
 * Populates your Sanity dataset with all audited QShala content idempotently.
 * Uses createOrReplace with deterministic document _id values to prevent duplicate entries.
 * 
 * Usage:
 *   1. Set credentials in .env or run directly:
 *      PUBLIC_SANITY_PROJECT_ID=your_id PUBLIC_SANITY_DATASET=production SANITY_API_TOKEN=your_token npm run sanity:seed
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
  DEFAULT_SERVICE_PAGES,
  DEFAULT_FAQS,
  DEFAULT_TESTIMONIALS,
} from '../src/lib/sanity/api.ts';
import { CASE_STUDIES_DATA, PRODUCTS_DATA } from '../src/data/index.ts';

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN || process.env.SANITY_AUTH_TOKEN;
const apiVersion = process.env.PUBLIC_SANITY_API_VERSION || '2024-03-01';

if (!projectId || !token) {
  console.error('\n❌ ERROR: Missing required Sanity credentials to run seed migration.\n');
  console.log('Please provide the following environment variables (in .env or command line):');
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
    ...DEFAULT_SITE_SETTINGS,
  },

  // 2. NAVIGATION SINGLETON
  {
    _id: 'navigation',
    _type: 'navigation',
    ...DEFAULT_NAVIGATION,
  },

  // 3. FOOTER SINGLETON
  {
    _id: 'footer',
    _type: 'footer',
    ...DEFAULT_FOOTER,
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
  },

  // 6. CO-FOUNDERS
  ...DEFAULT_CO_FOUNDERS.map((founder, idx) => ({
    _id: `teamMember-${founder.id}`,
    _type: 'teamMember',
    ...founder,
    order: idx + 1,
  })),

  // 7. CURIOSITY CREW (ALPHABETICAL ORDER)
  ...DEFAULT_CURIOSITY_CREW.map((member, idx) => ({
    _id: `teamMember-${member.id}`,
    _type: 'teamMember',
    ...member,
    order: idx + 10,
  })),

  // 8. SERVICE PAGES
  ...Object.values(DEFAULT_SERVICE_PAGES).map((service) => ({
    _id: `servicePage-${service.slug}`,
    _type: 'servicePage',
    ...service,
  })),

  // 9. FAQS (ALL 14 QUESTIONS)
  ...DEFAULT_FAQS.map((faq, idx) => ({
    _id: `faq-${idx + 1}`,
    _type: 'faq',
    ...faq,
    order: idx + 1,
  })),

  // 10. CASE STUDIES
  ...CASE_STUDIES_DATA.map((cs, idx) => ({
    _id: `caseStudy-${cs.slug}`,
    _type: 'caseStudy',
    title: cs.title,
    slug: { current: cs.slug },
    clientName: cs.client,
    clientType: cs.audience,
    summary: cs.summary,
    impactMetrics: cs.metrics.map((m) => ({ value: m.value, label: m.label })),
    order: idx + 1,
    isFeatured: true,
  })),

  // 11. PRODUCTS
  ...PRODUCTS_DATA.map((p, idx) => ({
    _id: `product-${p.id}`,
    _type: 'product',
    title: p.title,
    slug: { current: p.slug },
    category: p.category,
    price: Number(p.price.replace(/[^0-9.]/g, '')) || 299,
    rating: p.rating,
    description: p.description,
    isPopular: p.isPopular,
    order: idx + 1,
  })),

  // 12. TESTIMONIALS
  ...DEFAULT_TESTIMONIALS.map((t, idx) => ({
    _id: `testimonial-${idx + 1}`,
    _type: 'testimonial',
    ...t,
    order: idx + 1,
  })),
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
  console.log('You can now open Sanity Studio (npm run sanity:dev or sanity.studio) to view and edit all documents.');
}

seed().catch(err => {
  console.error('\n❌ Fatal seeding failure:', err);
  process.exit(1);
});
