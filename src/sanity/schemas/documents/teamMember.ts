import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'teamMember',
  title: 'Team & Founders',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'role',
      title: 'Designation / Role',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Department / Team',
      type: 'string',
      options: {
        list: [
          { title: 'Founders / Leadership', value: 'Leadership' },
          { title: 'Curriculum & Pedagogy', value: 'Curriculum' },
          { title: 'Design & Creative', value: 'Design' },
          { title: 'School Partnerships', value: 'Partnerships' },
          { title: 'Technology & Gamification', value: 'Technology' },
          { title: 'Corporate Engagement', value: 'Corporate' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Short Biography',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Portrait Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'imageUrl',
      title: 'External / Static Image Path',
      type: 'string',
      description: 'Used when uploading locally or linking static public path like /assets/team/sachin-ravi.jpg',
    }),
    defineField({
      name: 'isCoFounder',
      title: 'Is this a Co-Founder?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'coFounderBadge',
      title: 'Co-Founder Accolade / Badge (e.g. NLSIU Alum • National Quiz Champion)',
      type: 'string',
      hidden: ({ document }) => !document?.isCoFounder,
    }),
    defineField({
      name: 'mascotVariant',
      title: 'QT Mascot Buddy Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Holding Money (Design)', value: 'holding_money' },
          { title: 'Curious (Partnerships)', value: 'curious' },
          { title: 'Professional (Tech)', value: 'professional' },
          { title: 'Reading (Curriculum)', value: 'reading' },
          { title: 'Trophy (Corporate)', value: 'trophy' },
          { title: 'Quizzing', value: 'quizzing' },
          { title: 'Sherlock', value: 'sherlock' },
          { title: 'Idea', value: 'idea' },
        ],
      },
      initialValue: 'curious',
    }),
    defineField({
      name: 'accentColor',
      title: 'Accent Color Hex (e.g. #FDB913, #30B2E7, #75B543, #EC4899)',
      type: 'string',
      initialValue: '#30B2E7',
    }),
    defineField({
      name: 'linkedInUrl',
      title: 'LinkedIn Profile URL',
      type: 'url',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram Profile URL',
      type: 'url',
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
      title: 'name',
      subtitle: 'role',
      media: 'image',
    },
  },
});
