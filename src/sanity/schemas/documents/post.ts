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
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Blog', value: 'Blog' },
          { title: 'Events', value: 'Events' },
          { title: 'Case Study', value: 'Case Study' },
          { title: 'Insights', value: 'Insights' },
          { title: 'Careers', value: 'Careers' },
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
      of: [{ type: 'galleryImage' }],
    }),
    defineField({
      name: 'seo',
      title: 'SEO Overrides',
      type: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'mainImage',
    },
  },
});
