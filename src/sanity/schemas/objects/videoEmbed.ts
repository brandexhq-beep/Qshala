import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'videoEmbed',
  title: 'Video Embed (YouTube / Instagram)',
  type: 'object',
  fields: [
    defineField({
      name: 'url',
      title: 'Video Link (YouTube or Instagram)',
      type: 'url',
      description: 'Paste a full YouTube link (https://www.youtube.com/watch?v=... or https://youtu.be/...) or an Instagram reel/post link.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption / Title (Optional)',
      type: 'string',
      description: 'Short caption or title describing the video clip.',
    }),
  ],
  preview: {
    select: {
      url: 'url',
      caption: 'caption',
    },
    prepare({ url, caption }) {
      const isInstagram = url && (url.includes('instagram.com') || url.includes('instagr.am'));
      return {
        title: caption || (isInstagram ? 'Instagram Video' : 'YouTube Video'),
        subtitle: url || 'No link added',
      };
    },
  },
});

