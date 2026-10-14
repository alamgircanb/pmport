import pages from './seo-pages.json';

/**
 * Search and social-sharing details for each public page live in seo-pages.json
 * (keys are the page path without a leading slash; '' is the home page).
 * The same file drives the sitemap and the per-page HTML generated at build time
 * (scripts/seo-pages.mjs), so a new page only needs an entry there.
 */
export interface SeoPage{title:string;description:string;image?:string;type?:'website'|'article';published?:string;noindex?:boolean;hero?:string}

export const SITE_URL='https://pmport.ca';
export const SITE_NAME='PMPORT';
export const DEFAULT_IMAGE='og/default.jpg';
export const SEO_PAGES=pages as Record<string,SeoPage>;
