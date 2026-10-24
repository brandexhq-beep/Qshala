import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings & Branding',
  type: 'document',
  groups: [
    { name: 'general', title: 'General & Contact' },
    { name: 'social', title: 'Social Media' },
    { name: 'seo', title: 'Default SEO' },
  ],
  fields: [
    defineField({
      name: 'brandName',
      title: 'Brand Name',
      type: 'string',
      initialValue: 'QShala',
      group: 'general',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Brand Tagline',
      type: 'string',
      initialValue: 'Questions • Quriosity • Quests — India\'s Quriosity Company',
      group: 'general',
    }),
    defineField({
      name: 'logo',
      title: 'Main Brand Logo',
      type: 'image',
      group: 'general',
      options: { hotspot: true },
    }),
    defineField({
      name: 'logoDark',
      title: 'White / Dark-Mode Logo',
      type: 'image',
      group: 'general',
      options: { hotspot: true },
    }),
    defineField({
      name: 'contactPhone',
      title: 'Contact Phone Number',
      type: 'string',
      initialValue: '+91 89716 76100',
      group: 'general',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email Address',
      type: 'string',
      initialValue: 'qshala@walnuts.co.in',
      group: 'general',
    }),
    defineField({
      name: 'officeAddress',
      title: 'Physical Office Address',
      type: 'text',
      rows: 3,
      initialValue: '1st Floor, 680, Fortuna 1, 8th Main Road, 14th Cross Road, Near Delmia Circle, 3rd Phase, J.P. Nagar, Bengaluru, Karnataka - 560078',
      group: 'general',
    }),
    defineField({
      name: 'googleMapsUrl',
      title: 'Google Maps Link',
      type: 'url',
      initialValue: 'https://maps.google.com/?q=Walnut+Knowledge+Solutions+JP+Nagar+Bengaluru',
      group: 'general',
    }),
    defineField({
      name: 'qqlPaymentUrl',
      title: 'QQL Club Payment URL (Razorpay)',
      type: 'url',
      description: 'The direct Razorpay payment link for QQL Club membership subscriptions.',
      initialValue: 'https://pages.razorpay.com/QQLClub',
      group: 'general',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Profiles',
      type: 'array',
      group: 'social',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'platform', type: 'string', title: 'Platform (e.g. LinkedIn, Instagram, YouTube, X)' },
            { name: 'url', type: 'url', title: 'Profile URL' },
          ],
        },
      ],
      initialValue: [
        { platform: 'LinkedIn', url: 'https://www.linkedin.com/company/qshala/' },
        { platform: 'Instagram', url: 'https://www.instagram.com/qshala_curiosity/' },
        { platform: 'YouTube', url: 'https://www.youtube.com/@QShala' },
        { platform: 'Facebook', url: 'https://www.facebook.com/QShala/' },
      ],
    }),
    defineField({
      name: 'defaultSeo',
      title: 'Default Site SEO & OpenGraph',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'brandName',
      subtitle: 'tagline',
      media: 'logo',
    },
  },
});
