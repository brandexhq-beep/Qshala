import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'footer',
  title: 'Footer Configuration',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Document Title',
      type: 'string',
      initialValue: 'Global Site Footer',
      readOnly: true,
    }),
    defineField({
      name: 'bannerBadge',
      title: 'Top Banner Badge Label',
      type: 'string',
      initialValue: 'Joy of Quest',
    }),
    defineField({
      name: 'bannerHeading',
      title: 'Top Banner Heading',
      type: 'string',
      initialValue: 'Ready to replace rote learning with quriosity?',
    }),
    defineField({
      name: 'bannerDescription',
      title: 'Top Banner Description',
      type: 'text',
      rows: 2,
      initialValue: 'Partner with our team for consultative school programs, corporate trivia offsites, or custom quests.',
    }),
    defineField({
      name: 'bannerCtaText',
      title: 'Top Banner CTA Text',
      type: 'string',
      initialValue: 'Talk to us →',
    }),
    defineField({
      name: 'bannerCtaUrl',
      title: 'Top Banner CTA URL',
      type: 'string',
      initialValue: '/contact',
    }),
    defineField({
      name: 'companyName',
      title: 'Legal Entity Name',
      type: 'string',
      initialValue: 'Walnut Knowledge Solutions',
    }),
    defineField({
      name: 'companyDescription',
      title: 'Company Brief Description',
      type: 'text',
      rows: 2,
      initialValue: 'QShala is India\'s premier quriosity learning platform built by Walnut Knowledge Solutions.',
    }),
    defineField({
      name: 'copyrightText',
      title: 'Copyright Line',
      type: 'string',
      initialValue: '© 2026 QShala • Walnut Knowledge Solutions Private Limited. All rights reserved.',
    }),
    defineField({
      name: 'quickLinks',
      title: 'Quick Links (Column 2)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', type: 'string', title: 'Label' },
            { name: 'href', type: 'string', title: 'Route' },
          ],
        },
      ],
    }),
    defineField({
      name: 'programLinks',
      title: 'Programs & Audiences (Column 3)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', type: 'string', title: 'Label' },
            { name: 'href', type: 'string', title: 'Route' },
          ],
        },
      ],
    }),
    defineField({
      name: 'resourcesLinks',
      title: 'Resources & Free Quizzes (Column 4)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', type: 'string', title: 'Label' },
            { name: 'href', type: 'string', title: 'Route' },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'bannerHeading',
    },
  },
});
