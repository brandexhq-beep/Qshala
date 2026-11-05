// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://qshala.com',
  prefetch: true,
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/admin'),
      serialize(item) {
        const url = item.url.replace(/\/+$/, '');
        if (url === 'https://qshala.com') {
          item.changefreq = ChangeFreqEnum.DAILY;
          item.priority = 1.0;
        } else if (['https://qshala.com/schools', 'https://qshala.com/companies', 'https://qshala.com/services', 'https://qshala.com/about'].includes(url)) {
          item.changefreq = ChangeFreqEnum.WEEKLY;
          item.priority = 0.9;
        } else if (['https://qshala.com/colleges', 'https://qshala.com/communities', 'https://qshala.com/custom', 'https://qshala.com/case-studies', 'https://qshala.com/blog', 'https://qshala.com/learn', 'https://qshala.com/shop'].includes(url)) {
          item.changefreq = ChangeFreqEnum.WEEKLY;
          item.priority = 0.8;
        } else {
          item.changefreq = ChangeFreqEnum.MONTHLY;
          item.priority = 0.7;
        }
        item.lastmod = new Date().toISOString();
        return item;
      }
    })
  ],
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: true,
    },
  },
});
