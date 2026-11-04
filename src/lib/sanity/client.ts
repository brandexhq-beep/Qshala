import { createClient } from '@sanity/client';

const projectId = 
  (typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_SANITY_PROJECT_ID) || 
  (typeof import.meta !== 'undefined' && import.meta.env?.SANITY_PROJECT_ID) || 
  (typeof process !== 'undefined' && process.env?.PUBLIC_SANITY_PROJECT_ID) || 
  (typeof process !== 'undefined' && process.env?.SANITY_PROJECT_ID) || 
  '';

const dataset = 
  (typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_SANITY_DATASET) || 
  (typeof import.meta !== 'undefined' && import.meta.env?.SANITY_DATASET) || 
  (typeof process !== 'undefined' && process.env?.PUBLIC_SANITY_DATASET) || 
  (typeof process !== 'undefined' && process.env?.SANITY_DATASET) || 
  'production';

const apiVersion = 
  (typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_SANITY_API_VERSION) || 
  (typeof import.meta !== 'undefined' && import.meta.env?.SANITY_API_VERSION) || 
  (typeof process !== 'undefined' && process.env?.PUBLIC_SANITY_API_VERSION) || 
  (typeof process !== 'undefined' && process.env?.SANITY_API_VERSION) || 
  '2024-03-01';

const token = 
  (typeof import.meta !== 'undefined' && import.meta.env?.SANITY_API_TOKEN) || 
  (typeof process !== 'undefined' && process.env?.SANITY_API_TOKEN) || 
  '';

export function isSanityConfigured(): boolean {
  return Boolean(
    projectId && 
    projectId !== 'your-project-id' && 
    projectId !== 'placeholder' &&
    projectId.trim().length > 3
  );
}

export const sanityClient = createClient({
  projectId: isSanityConfigured() ? projectId : 'placeholder-id',
  dataset,
  apiVersion,
  useCdn: true,
  token: typeof window === 'undefined' ? (token || undefined) : undefined,
  perspective: 'published',
});
