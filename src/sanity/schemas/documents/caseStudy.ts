import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'caseStudy',
  title: 'Case Studies',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Case Study Headline',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'clientName',
      title: 'Client / Institution Name (e.g. Delhi Public School, Flipkart)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'clientType',
      title: 'Client Type',
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'impactMetrics',
      title: 'Impact Metrics (3 items recommended)',
      type: 'array',
      of: [{ type: 'metric' }],
      validation: (Rule) => Rule.min(1).max(4),
    }),
    defineField({
      name: 'quote',
      title: 'Client Testimonial Quote (Optional)',
      description: 'Optional quotation from a principal, HR leader, or client partner.',
      type: 'quote',
    }),
    defineField({
      name: 'tags',
      title: 'Category Tags',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'image',
      title: 'Hero / Feature Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'isFeatured',
      title: 'Show on Homepage Case Study Showcase',
      type: 'boolean',
      initialValue: true,
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
  },
});
