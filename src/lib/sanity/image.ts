import imageUrlBuilder from '@sanity/image-url';
import { sanityClient, isSanityConfigured } from './client';

const builder = isSanityConfigured() ? imageUrlBuilder(sanityClient) : null;

export function getImageUrl(
  source: any,
  widthOrFallback?: number | string,
  height?: number,
  fit: 'crop' | 'max' | 'fill' | 'clip' = 'crop'
): string {
  const fallback = typeof widthOrFallback === 'string' ? widthOrFallback : '';
  if (!source) return fallback;
  if (typeof source === 'string') return source;
  if (source?.url) return source.url;

  if (!builder || !source?.asset) return fallback;

  try {
    let img = builder.image(source).auto('format');
    if (typeof widthOrFallback === 'number') img = img.width(widthOrFallback);
    if (typeof height === 'number') img = img.height(height);
    
    // When both width and height are given, use fit('crop') to respect Sanity's hotspot & crop metadata
    const activeFit = (typeof widthOrFallback === 'number' && typeof height === 'number') ? fit : 'max';
    return img.fit(activeFit).url();
  } catch {
    return fallback;
  }
}

