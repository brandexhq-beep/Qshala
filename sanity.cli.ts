import { defineCliConfig } from 'sanity/cli';

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || '7fw1qn07';
const dataset = process.env.PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production';

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  deployment: {
    appId: 'cidntwzgth0qhb57xptec78n',
  },
});
