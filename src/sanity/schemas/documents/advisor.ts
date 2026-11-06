import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'advisor',
  title: 'Investors & Advisors',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role / Designation (e.g. Co-Founder & CEO, Zerodha)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'company',
      title: 'Company / Organization (e.g. Zerodha, Mindtree)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'badge',
      title: 'Backer Badge (e.g. Angel Backer, Strategic Advisor)',
      type: 'string',
      initialValue: 'Angel Backer',
    }),
    defineField({
      name: 'color',
      title: 'Accent Brand Color Hex (e.g. #387ED1, #FDB913, #75B543)',
      type: 'string',
      initialValue: '#387ED1',
    }),
    defineField({
      name: 'logo',
      title: 'Company Logo File',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'logoUrl',
      title: 'Company Logo Static URL Path',
      type: 'string',
      description: 'e.g. /assets/logos/zerodha.svg',
    }),
    defineField({
      name: 'image',
      title: 'Advisor Portrait Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'avatarUrl',
      title: 'Advisor Portrait Static URL Path',
      type: 'string',
      description: 'e.g. /assets/advisors/nithin-kamath.webp',
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
