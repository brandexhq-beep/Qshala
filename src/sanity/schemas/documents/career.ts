import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'career',
  title: 'Careers & Job Openings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Job Title / Role',
      type: 'string',
      description: 'e.g. Video Editor & Visual Storyteller, Operations Associate, Marketing Manager',
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
            .replace(/careers\//g, '')
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .slice(0, 96),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'department',
      title: 'Department / Team',
      type: 'string',
      options: {
        list: [
          { title: 'Pedagogy & Quizmastering', value: 'Pedagogy & Quizmastering' },
          { title: 'Creative & Video Production', value: 'Creative & Video Production' },
          { title: 'Operations & Event Logistics', value: 'Operations & Event Logistics' },
          { title: 'Marketing & School Outreach', value: 'Marketing & School Outreach' },
          { title: 'Technology & Curriculum', value: 'Technology & Curriculum' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Work Location',
      type: 'string',
      initialValue: 'Bengaluru, Karnataka (On-site / Hybrid)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'employmentType',
      title: 'Employment Type',
      type: 'string',
      options: {
        list: [
          { title: 'Full-time', value: 'Full-time' },
          { title: 'Part-time', value: 'Part-time' },
          { title: 'Contract / Project', value: 'Contract' },
          { title: 'Internship', value: 'Internship' },
        ],
      },
      initialValue: 'Full-time',
    }),
    defineField({
      name: 'shortSummary',
      title: 'Short Role Summary',
      type: 'text',
      rows: 3,
      description: '1-2 sentences displayed on the Careers card on the Contact page.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Full Job Description & Responsibilities',
      type: 'blockContent',
      description: 'Detailed role requirements, expectations, and culture overview.',
    }),
    defineField({
      name: 'color',
      title: 'Card Accent Color (Hex)',
      type: 'string',
      initialValue: '#EDF7E5',
    }),
    defineField({
      name: 'imageSrc',
      title: 'Role Feature Image URL',
      type: 'string',
      description: 'Static or media image path (e.g. /assets/media/corporate/photo-2026-10-09-16-30-24.webp)',
    }),
    defineField({
      name: 'applyEmail',
      title: 'Application Contact Email / Link',
      type: 'string',
      initialValue: 'mailto:work@walnuts.co.in',
    }),
    defineField({
      name: 'isActive',
      title: 'Currently Hiring (Active)',
      type: 'boolean',
      description: 'Turn off when this position has been filled to remove it from the website.',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
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
      subtitle: 'department',
      active: 'isActive',
    },
    prepare({ title, subtitle, active }) {
      return {
        title,
        subtitle: `${subtitle || 'Role'} ${active ? '🟢 (Hiring)' : '⚪ (Closed)'}`,
      };
    },
  },
});
