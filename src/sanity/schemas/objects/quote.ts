import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'quote',
  title: 'Client / Stakeholder Quote (Optional)',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Quotation Text',
      type: 'text',
      rows: 3,
      description: 'Optional quotation text. Leave blank if this case study has no testimonial.',
    }),
    defineField({
      name: 'author',
      title: 'Author Name',
      type: 'string',
      description: 'Optional — e.g. Sunita Sharma',
    }),
    defineField({
      name: 'role',
      title: 'Author Role / Organization',
      type: 'string',
      description: 'Optional — e.g. Principal, DPS Bangalore East',
    }),
  ],
});
