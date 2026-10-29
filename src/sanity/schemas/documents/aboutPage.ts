import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'aboutPage',
  title: 'About Page Content',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'stats', title: 'Impact Stats' },
    { name: 'founders', title: 'Founders Section' },
    { name: 'team', title: 'The Quriosity Crew Team Section' },
    { name: 'story', title: 'Our Story' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      initialValue: 'About Us Page',
      readOnly: true,
    }),
    defineField({
      name: 'heroBadge',
      title: 'Hero Badge',
      type: 'string',
      initialValue: 'Our Story',
      group: 'hero',
    }),
    defineField({
      name: 'heroHeading',
      title: 'Hero Main Heading',
      type: 'string',
      initialValue: 'It Started With a Love of Questions.',
      group: 'hero',
    }),
    defineField({
      name: 'heroIntro',
      title: 'Hero Intro Paragraph',
      type: 'text',
      rows: 3,
      initialValue: 'QShala began in 2014 with two law school friends and a love of quizzing.',
      group: 'hero',
    }),
    defineField({
      name: 'stats',
      title: 'Impact Number Milestones',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', type: 'string', title: 'Value (e.g. 250+, 80+, 1,000+, 2.5L+)' },
            { name: 'label', type: 'string', title: 'Label' },
            { name: 'color', type: 'string', title: 'Accent Color Hex' },
          ],
        },
      ],
      group: 'stats',
      initialValue: [
        { value: '250+', label: 'Partner Schools', color: '#30B2E7' },
        { value: '80+', label: 'Top Corporates', color: '#75B543' },
        { value: '1,000+', label: 'Live Quests Hosted', color: '#FDB913' },
        { value: '2.5L+', label: 'Curious Learners', color: '#9333EA' },
      ],
    }),
    defineField({
      name: 'foundersHeading',
      title: 'Founders Section Heading',
      type: 'string',
      initialValue: 'Meet the Co-Founders',
      group: 'founders',
    }),
    defineField({
      name: 'foundersSubtitle',
      title: 'Founders Section Subtitle',
      type: 'string',
      initialValue: 'Lawyers by training. Quizzers at heart.',
      group: 'founders',
    }),

    // TEAM SECTION (THE QURIOSITY CREW)
    defineField({
      name: 'teamSectionLabel',
      title: 'Team Section Label Badge',
      type: 'string',
      initialValue: 'Meet Our Team',
      group: 'team',
    }),
    defineField({
      name: 'teamSectionHeading',
      title: 'Team Section Main Heading',
      type: 'string',
      initialValue: 'The Quriosity Crew.',
      group: 'team',
    }),
    defineField({
      name: 'teamSectionSubheading',
      title: 'Team Section Subheading',
      type: 'text',
      rows: 2,
      initialValue: 'Archaeologists, architects, lawyers, educators and more, sparking Quriosity across India.',
      group: 'team',
    }),

    defineField({
      name: 'storyHeadline',
      title: 'Origin Story Headline',
      type: 'string',
      initialValue: 'From Law School Quizzers to a National Socratic Movement.',
      group: 'story',
    }),
    defineField({
      name: 'storyContent',
      title: 'Origin Story Narrative',
      type: 'blockContent',
      group: 'story',
    }),
    defineField({
      name: 'seo',
      title: 'About Page SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'heroHeading',
    },
  },
});
