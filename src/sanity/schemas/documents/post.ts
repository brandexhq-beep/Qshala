import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'post',
  title: 'Blog & Event Stories',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Article / Story Title',
      type: 'string',
      description: 'The headline for this article or event photo story.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Click "Generate" to create a web-friendly URL. Do not type slashes.',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input: string) =>
          input
            .toLowerCase()
            .replace(/^\/+/g, '')
            .replace(/blog\//g, '')
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .slice(0, 96),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Blog', value: 'Blog' },
          { title: 'Events', value: 'Events' },
          { title: 'Case Study', value: 'Case Study' },
          { title: 'Insights', value: 'Insights' },
          { title: 'School', value: 'School' },
          { title: 'Corporate', value: 'Corporate' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'readTime',
      title: 'Read Time or Badge (e.g. 5 min read, Photo Gallery)',
      type: 'string',
      initialValue: '5 min read',
    }),
    defineField({
      name: 'date',
      title: 'Display Date (e.g. July 2026)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isoDate',
      title: 'Publication Date (ISO format)',
      type: 'datetime',
    }),
    defineField({
      name: 'author',
      title: 'Author Name',
      type: 'string',
      initialValue: 'QShala Editorial Team',
    }),
    defineField({
      name: 'authorRole',
      title: 'Author Role',
      type: 'string',
      initialValue: 'Curiosity Research & Pedagogy',
    }),
    defineField({
      name: 'summary',
      title: 'Summary / Excerpt',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'color',
      title: 'Card Accent Color Hex (e.g. #FDB913, #30B2E7, #75B543)',
      type: 'string',
      initialValue: '#FDB913',
    }),
    defineField({
      name: 'mainImage',
      title: 'Featured Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'mainImageUrl',
      title: 'External / Static Image URL',
      type: 'url',
    }),
    defineField({
      name: 'body',
      title: 'Body Content (Portable Text)',
      type: 'blockContent',
    }),
    defineField({
      name: 'rawHtmlContent',
      title: 'Raw HTML Content (Legacy Migration Fallback)',
      type: 'text',
      description: 'Used for migrated rich post HTML where Portable Text has not yet been formatted.',
    }),
    defineField({
      name: 'gallery',
      title: 'Event Photo Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Caption / Alt Text',
            },
          ],
        },
        { type: 'galleryImage' },
      ],
      description: 'Drag & drop multiple photos at once directly here, or add gallery items individually.',
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
      title: 'title',
      subtitle: 'category',
      media: 'mainImage',
    },
  },
});
