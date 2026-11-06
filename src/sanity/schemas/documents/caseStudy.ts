import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'caseStudy',
  title: 'Case Studies',
  type: 'document',
  fields: [
    defineField({
      name: 'clientName',
      title: 'Client / Institution Name (Flip Card Title: e.g. Delhi Public School)',
      type: 'string',
      description: 'The school, company, or institution name (e.g. Delhi Public School, Flipkart). This directly controls the "Delhi Public School" title on the homepage flip card, showcase cards, and in the Sanity sidebar.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Case Study Headline (e.g. How DPS Transformed General Knowledge...)',
      type: 'string',
      description: 'The main story headline shown beneath the client name on the flip card and as the main headline on the case study page.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Click "Generate" to auto-create from the headline or client name. This forms the web link (qshala.com/case-studies/your-slug). Do not type slashes.',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input: string) =>
          input
            .toLowerCase()
            .replace(/^\/+/g, '')
            .replace(/case-studies\//g, '')
            .replace(/blog\//g, '')
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .slice(0, 96),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'clientType',
      title: 'Client / Audience Type',
      type: 'string',
      options: {
        list: [
          { title: 'School', value: 'School' },
          { title: 'Corporate', value: 'Corporate' },
          { title: 'College', value: 'College' },
          { title: 'Community', value: 'Community' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Executive Summary',
      type: 'text',
      rows: 3,
      description: 'Short 1-2 sentence impact overview shown on cards and previews.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Full Story & Detailed Writeup (Portable Text)',
      type: 'blockContent',
      description: 'Full case study narrative, challenge, execution strategy, and outcomes. Editors only write this once!',
    }),
    defineField({
      name: 'gallery',
      title: 'Event & Classroom Photo Gallery',
      type: 'array',
      of: [{ type: 'galleryImage' }],
      description: 'Photographs from this project. Shown in a full-screen gallery lightbox on the case study page.',
    }),
    defineField({
      name: 'impactMetrics',
      title: 'Impact Metrics (3 items recommended)',
      type: 'array',
      of: [{ type: 'metric' }],
      validation: (Rule) => Rule.max(4),
    }),
    defineField({
      name: 'quote',
      title: 'Client Testimonial Quote (Optional)',
      description: 'Optional quotation from a principal, HR leader, or client partner.',
      type: 'quote',
    }),
    defineField({
      name: 'showInBlogFeed',
      title: 'Also Display in Blog & Event Stories Feed',
      type: 'boolean',
      description: 'Turn ON to automatically surface this case study in the main Blog stories stream without writing it twice.',
      initialValue: true,
    }),
    defineField({
      name: 'isFeatured',
      title: 'Feature on Homepage Carousel Showcase',
      type: 'boolean',
      description: 'Showcase this story in the homepage interactive case studies slider.',
      initialValue: true,
    }),
    defineField({
      name: 'image',
      title: 'Hero / Feature Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'tags',
      title: 'Category Tags',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'publishedDate',
      title: 'Publication Date',
      type: 'datetime',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'seo',
      title: 'SEO Overrides',
      type: 'seo',
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'clientName',
      subtitle: 'title',
      media: 'image',
    },
    prepare({ title, subtitle, media }: any) {
      return {
        title: title || 'Untitled Client / School',
        subtitle: subtitle || 'No headline set',
        media,
      };
    },
  },
});
