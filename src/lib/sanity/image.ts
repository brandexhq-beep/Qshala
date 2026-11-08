import { createImageUrlBuilder } from '@sanity/image-url';
import { sanityClient, isSanityConfigured } from './client';

const builder = isSanityConfigured() ? createImageUrlBuilder(sanityClient) : null;

export function getImageUrl(
  source: any,
  widthOrFallback?: number | string,
  height?: number,
  fit: 'crop' | 'max' | 'fill' | 'clip' = 'crop'
): string {
  const fallback = typeof widthOrFallback === 'string' ? widthOrFallback : '';
  if (!source) return fallback;
  if (typeof source === 'string') return source;

  // Direct string URL on object
  if (source.url && typeof source.url === 'string' && (source.url.startsWith('http') || source.url.startsWith('/'))) {
    return source.url;
  }

  // Handle nested gallery image wrapper { image: { asset: ... } }
  const target = source.image ? source.image : source;
  if (target?.url && typeof target.url === 'string' && (target.url.startsWith('http') || target.url.startsWith('/'))) {
    return target.url;
  }

  // Target must have asset reference for Sanity image builder
  const hasAsset = Boolean(target?.asset?._ref || target?.asset?._id || target?._ref);
  if (!builder || !hasAsset) {
    return fallback;
  }

  try {
    let img = builder.image(target).auto('format');
    if (typeof widthOrFallback === 'number') img = img.width(widthOrFallback);
    if (typeof height === 'number') img = img.height(height);
    
    // When both width and height are given, use fit('crop') to respect Sanity's hotspot & crop metadata
    const activeFit = (typeof widthOrFallback === 'number' && typeof height === 'number') ? fit : 'max';
    return img.fit(activeFit).url();
  } catch {
    return fallback;
  }
}
