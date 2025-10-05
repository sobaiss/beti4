// Image optimization utilities for SEO and performance

import { CURRENCY } from "../config";

export interface ImageSEOConfig {
  alt: string;
  title?: string;
  caption?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  sizes?: string;
  quality?: number;
}

export interface ResponsiveImageConfig extends ImageSEOConfig {
  src: string;
  width: number;
  height: number;
  breakpoints?: number[];
}

/**
 * Generate SEO-friendly filename from property title
 */
export function generateSEOFilename(propertyTitle: string, imageType: string, index: number = 0): string {
  const cleanTitle = propertyTitle
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  const suffix = index > 0 ? `-${index + 1}` : '';
  return `${cleanTitle}-${imageType}${suffix}`;
}

/**
 * Generate responsive image srcset
 */
export function generateSrcSet(baseUrl: string, breakpoints: number[] = [320, 640, 768, 1024, 1280, 1920]): string {
  return breakpoints
    .map(width => `${baseUrl}?w=${width}&q=80 ${width}w`)
    .join(', ');
}

/**
 * Generate sizes attribute for responsive images
 */
export function generateSizes(breakpoints: { [key: string]: string } = {
  '(max-width: 640px)': '100vw',
  '(max-width: 1024px)': '50vw',
  '(max-width: 1280px)': '33vw',
  'default': '25vw'
}): string {
  const entries = Object.entries(breakpoints);
  const mediaQueries = entries.slice(0, -1).map(([query, size]) => `${query} ${size}`);
  const defaultSize = entries[entries.length - 1][1];
  
  return [...mediaQueries, defaultSize].join(', ');
}

/**
 * Compress and optimize image URL
 */
export function optimizeImageUrl(url: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpg' | 'png';
} = {}): string {
  const { width, height, quality = 80, format = 'webp' } = options;
  
  // For external URLs (Pexels, etc.), use URL parameters
  if (url.includes('pexels.com')) {
    const params = new URLSearchParams();
    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    params.append('auto', 'compress');
    params.append('cs', 'tinysrgb');
    
    return `${url}${url.includes('?') ? '&' : '?'}${params.toString()}`;
  }
  
  // For local images, use Next.js Image Optimization API
  const params = new URLSearchParams();
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  params.append('q', quality.toString());
  params.append('f', format);
  
  return `/_next/image?url=${encodeURIComponent(url)}&${params.toString()}`;
}

/**
 * Generate structured data for images
 */
export function generateImageStructuredData(property: any, images: any[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "contentUrl": images[0]?.url,
    "license": "https://beti.com/license",
    "acquireLicensePage": "https://beti.com/license",
    "creditText": "Beti",
    "creator": {
      "@type": "Organization",
      "name": "Beti"
    },
    "copyrightNotice": "© Beti",
    "description": `${property.title} - ${property.location}`,
    "name": property.title,
    "caption": `${property.type} à ${property.location} - ${property.price}${CURRENCY}`,
    "representativeOfPage": true,
    "isPartOf": {
      "@type": "RealEstateListing",
      "name": property.title,
      "url": `https://beti.com/property/${property.id}`
    }
  };
}