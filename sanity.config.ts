import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './src/sanity/schemas';

const defaultProjectId = 
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.PUBLIC_SANITY_PROJECT_ID) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.SANITY_PROJECT_ID) ||
  (typeof process !== 'undefined' && process.env?.PUBLIC_SANITY_PROJECT_ID) ||
  (typeof process !== 'undefined' && process.env?.SANITY_PROJECT_ID) ||
  '';

const defaultDataset = 
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.PUBLIC_SANITY_DATASET) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.SANITY_DATASET) ||
  (typeof process !== 'undefined' && process.env?.PUBLIC_SANITY_DATASET) ||
  (typeof process !== 'undefined' && process.env?.SANITY_DATASET) ||
  'production';

export function getSanityConfig(
  projectIdOverride?: string, 
  datasetOverride?: string, 
  basePathOverride?: string
) {
  const activeProjectId = projectIdOverride || defaultProjectId || 'your-project-id';
  const activeDataset = datasetOverride || defaultDataset || 'production';

  return defineConfig({
    name: 'qshala-studio',
    title: 'QShala Content Studio',
    ...(basePathOverride ? { basePath: basePathOverride } : {}),

    projectId: activeProjectId,
    dataset: activeDataset,

    plugins: [structureTool()],

    schema: {
      types: schemaTypes,
    },
  });
}

// Default export has no basePath so `sanity deploy` and `sanity dev` run cleanly at root '/'
export default getSanityConfig();
