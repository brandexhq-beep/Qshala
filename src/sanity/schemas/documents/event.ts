import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'event',
  title: 'Events & Quests',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Event Title',
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
      title: 'Audience / Category',
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
      name: 'date',
      title: 'Event Date (Display String e.g. Nov 11, 2026)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isoDate',
      title: 'ISO Event Date (for chronological sorting)',
      type: 'datetime',
    }),
    defineField({
      name: 'desc',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'venue',
      title: 'Venue / Location',
      type: 'string',
      initialValue: 'Bengaluru / Online',
    }),
    defineField({
      name: 'isPrivate',
      title: 'Private / Closed Event?',
      type: 'boolean',
      description: 'Displays a sleek "Private Session • Invite Only" badge on the card.',
      initialValue: false,
    }),
    defineField({
      name: 'buttonType',
      title: 'Call to Action Button Type',
      type: 'string',
      options: {
        list: [
          { title: 'Register Now (Public Registration)', value: 'register' },
          { title: 'Learn More (Service / Info Page)', value: 'learn_more' },
          { title: 'Host Similar Event (Book for Team / School)', value: 'host_similar' },
          { title: 'No Button / Private Event (Shows Status & Host Inquiry)', value: 'none' },
        ],
      },
      initialValue: 'register',
    }),
    defineField({
      name: 'hideHostCta',
      title: 'Completely hide "Host for Your Team" button when "No Button" is chosen?',
      type: 'boolean',
      description: 'When checked, renders a clean, balanced info summary footer without any button.',
      initialValue: false,
    }),
    defineField({
      name: 'buttonText',
      title: 'Custom Button Label',
      type: 'string',
      initialValue: 'Register Now',
    }),
    defineField({
      name: 'buttonUrl',
      title: 'Button Target URL',
      type: 'string',
      description: 'Relative link (e.g. /book-a-quiz, /companies) or external link (https://...)',
      initialValue: '/book-a-quiz',
      validation: (Rule) =>
        Rule.custom((url) => {
          if (!url) return true;
          if (typeof url !== 'string') return 'URL must be a string';
          const trimmed = url.trim();
          if (
            trimmed.startsWith('/') ||
            trimmed.startsWith('https://') ||
            trimmed.startsWith('http://') ||
            trimmed.startsWith('mailto:') ||
            trimmed.startsWith('tel:')
          ) {
            return true;
          }
          return 'URL must start with /, https://, or http://';
        }),
    }),
    defineField({
      name: 'heroImage',
      title: 'Event Poster / Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'isFeatured',
      title: 'Feature on Homepage Slider',
      type: 'boolean',
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
      subtitle: 'date',
      media: 'heroImage',
    },
  },
});
