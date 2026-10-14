import pages from './seo-pages.json';

/**
 * Search and social-sharing details for each public page live in seo-pages.json
 * (keys are the page path without a leading slash; '' is the home page).
 * The same file drives the sitemap and the per-page HTML generated at build time
 * (scripts/seo-pages.mjs), so a new page only needs an entry there.
 */
export interface SeoPage{title:string;description:string;image?:string;type?:'website'|'article';published?:string;noindex?:boolean;hero?:string;label?:string}

export const SITE_URL='https://pmport.ca';
export const SITE_NAME='PMPORT';
export const DEFAULT_IMAGE='og/default.jpg';
export const SEO_PAGES=pages as Record<string,SeoPage>;

/** Short name of a page for breadcrumbs: its label, or its title without the site name. */
export const pageName=(path:string):string=>{
  const page=SEO_PAGES[path];
  return page?.label??(page?page.title.replace(/ \| PMPORT$/,'').replace(/^PMPORT \| /,''):path.split('/').pop()??path);
};

/** schema.org BreadcrumbList for a page path (Home › section › page), or null for the home page. */
export function breadcrumbData(path:string){
  if(!path)return null;
  const parts=path.split('/');
  const items=[{name:'Home',url:`${SITE_URL}/`}];
  parts.forEach((_,i)=>{const p=parts.slice(0,i+1).join('/');if(SEO_PAGES[p])items.push({name:pageName(p),url:`${SITE_URL}/${p}`});});
  return {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:items.map((it,i)=>({'@type':'ListItem',position:i+1,name:it.name,item:it.url}))};
}
