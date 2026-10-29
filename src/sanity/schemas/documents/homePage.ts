import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'homePage',
  title: 'Homepage Content',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero Section' },
    { name: 'events', title: 'Upcoming Events' },
    { name: 'effect', title: 'The QShala Effect' },
    { name: 'game', title: 'Daily Game' },
    { name: 'store', title: 'Curated Store' },
    { name: 'newsletter', title: 'QQL Club Newsletter' },
    { name: 'impact', title: 'Real Impact Stories' },
    { name: 'faqs', title: 'FAQ Section' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      initialValue: 'Home Page',
      readOnly: true,
    }),
    // HERO
    defineField({
      name: 'heroBadge',
      title: 'Hero Badge Text',
      type: 'string',
      initialValue: 'India\'s Quriosity Platform',
      group: 'hero',
    }),
    defineField({
      name: 'heroTypewriterPrefix',
      title: 'Typewriter Static Prefix',
      type: 'string',
      initialValue: 'Igniting',
      group: 'hero',
    }),
    defineField({
      name: 'heroTypewriterWords',
      title: 'Typewriter Animated Words',
      type: 'array',
      of: [{ type: 'string' }],
      initialValue: ['Quriosity.', 'Critical Thinking.', 'Wonder.', 'Confidence.', 'Lifelong Joy.'],
      group: 'hero',
    }),
    defineField({
      name: 'heroIntro',
      title: 'Hero Intro Paragraph',
      type: 'text',
      rows: 3,
      initialValue: 'QShala is India\'s premier quizzing company. We run quiz competitions, learning programs and team events for schools, colleges, companies and communities.',
      group: 'hero',
    }),
    defineField({
      name: 'heroCta',
      title: 'Hero Primary CTA Button',
      type: 'callToAction',
      initialValue: {
        label: 'What we can do for you',
        url: '/services',
        variant: 'yellow',
      },
      group: 'hero',
    }),

    // UPCOMING EVENTS SECTION
    defineField({
      name: 'eventsHeading',
      title: 'Upcoming Events Heading',
      type: 'string',
      initialValue: 'Upcoming Events',
      group: 'events',
    }),
    defineField({
      name: 'eventsSubtitle',
      title: 'Upcoming Events Subtitle',
      type: 'string',
      initialValue: 'Join us for live quizzes, offline tournaments, and community events.',
      group: 'events',
    }),

    // THE QSHALA EFFECT (LIVE MOMENTS)
    defineField({
      name: 'effectBadge',
      title: 'Effect Badge Label',
      type: 'string',
      initialValue: 'Live Moments',
      group: 'effect',
    }),
    defineField({
      name: 'effectHeading',
      title: 'Effect Heading',
      type: 'string',
      initialValue: 'The QShala Effect',
      group: 'effect',
    }),
    defineField({
      name: 'effectLine',
      title: 'Effect Tagline',
      type: 'string',
      initialValue: 'Bringing Joy to Every Room.',
      group: 'effect',
    }),
    defineField({
      name: 'effectButtonText',
      title: 'Effect Button Label',
      type: 'string',
      initialValue: 'See It Yourself',
      group: 'effect',
    }),

    // DAILY GAME
    defineField({
      name: 'gameBadge',
      title: 'Daily Game Badge',
      type: 'string',
      initialValue: 'Daily Game',
      group: 'game',
    }),
    defineField({
      name: 'gameHeading',
      title: 'Daily Game Heading',
      type: 'string',
      initialValue: 'Test Your Quriosity',
      group: 'game',
    }),
    defineField({
      name: 'gameSubtitle',
      title: 'Daily Game Subtitle',
      type: 'string',
      initialValue: 'Pick an answer below to trigger a celebration!',
      group: 'game',
    }),

    // CURATED STORE PREVIEW
    defineField({
      name: 'storeBadge',
      title: 'Store Badge Label',
      type: 'string',
      initialValue: 'Quriosity Store',
      group: 'store',
    }),
    defineField({
      name: 'storeHeading',
      title: 'Store Section Heading',
      type: 'string',
      initialValue: 'Books, Games & Thinking Kits.',
      group: 'store',
    }),
    defineField({
      name: 'storeSubtitle',
      title: 'Store Section Subtitle',
      type: 'text',
      rows: 2,
      initialValue: 'Curated conversation decks, financial literacy storybooks, and STEM lab kits designed for homes and classrooms.',
      group: 'store',
    }),

    // QQL CLUB NEWSLETTER
    defineField({
      name: 'newsletterHeading',
      title: 'Newsletter Heading',
      type: 'string',
      initialValue: 'Subscribe to QQL Club',
      group: 'newsletter',
    }),
    defineField({
      name: 'newsletterLine',
      title: 'Newsletter Description & Pricing Line',
      type: 'text',
      rows: 2,
      initialValue: 'Five questions in your inbox every day, and a Monthly Mega Quiz every month. ₹499 for six months.',
      group: 'newsletter',
    }),
    defineField({
      name: 'newsletterButtonLabel',
      title: 'Newsletter Button Label',
      type: 'string',
      initialValue: 'Subscribe',
      group: 'newsletter',
    }),

    // REAL IMPACT STORIES
    defineField({
      name: 'impactBadge',
      title: 'Impact Stories Badge',
      type: 'string',
      initialValue: 'Real Impact Stories',
      group: 'impact',
    }),
    defineField({
      name: 'impactHeading',
      title: 'Impact Stories Heading',
      type: 'string',
      initialValue: 'Quriosity in Action.',
      group: 'impact',
    }),
    defineField({
      name: 'impactButtonLabel',
      title: 'Impact Stories Button Label',
      type: 'string',
      initialValue: 'See Our Work',
      group: 'impact',
    }),
    defineField({
      name: 'impactButtonUrl',
      title: 'Impact Stories Link URL',
      type: 'string',
      initialValue: '/case-studies',
      group: 'impact',
    }),

    // FAQS
    defineField({
      name: 'faqBadge',
      title: 'FAQ Section Badge',
      type: 'string',
      initialValue: 'How can we help?',
      group: 'faqs',
    }),
    defineField({
      name: 'faqHeading',
      title: 'FAQ Section Heading',
      type: 'string',
      initialValue: 'Frequently Asked Questions',
      group: 'faqs',
    }),
    defineField({
      name: 'faqButtonLabel',
      title: 'FAQ Button Label',
      type: 'string',
      initialValue: 'View All FAQs & Help Center',
      group: 'faqs',
    }),
    defineField({
      name: 'faqButtonUrl',
      title: 'FAQ Page Link URL',
      type: 'string',
      initialValue: '/faq',
      group: 'faqs',
    }),

    // SEO
    defineField({
      name: 'seo',
      title: 'Homepage SEO Overrides',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'heroIntro',
    },
  },
});
