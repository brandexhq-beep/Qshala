import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'postButton',
  title: 'Call to Action Button',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Button Label',
      type: 'string',
      description: 'e.g. "Register Now", "Explore Case Study", "Book a Quiz"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Target Link URL',
      type: 'string',
      description: 'e.g. /book-a-quiz, /services, or external URL https://...',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'style',
      title: 'Button Color Style',
      type: 'string',
      options: {
        list: [
          { title: 'Signature Yellow (#FDB913)', value: 'yellow' },
          { title: 'Curiosity Blue (#30B2E7)', value: 'blue' },
          { title: 'Growth Green (#75B543)', value: 'green' },
          { title: 'Dark Monochrome', value: 'dark' },
        ],
      },
      initialValue: 'yellow',
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab?',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'url',
    },
  },
});

