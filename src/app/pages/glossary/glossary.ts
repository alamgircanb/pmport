import data from './glossary-data.json';
import deep from './glossary-deep.json';

export interface GlossaryTerm{term:string;slug:string;category:string;definition:string;example:string;related:string[]}
export const TERMS=data as GlossaryTerm[];
export const TERM_BY_SLUG=new Map(TERMS.map(t=>[t.slug,t]));
/** Extra in-depth content for the most-searched terms (src/app/pages/glossary/glossary-deep.json, also read by scripts/seo-pages.mjs). */
export interface DeepSection{h:string;p?:string;items?:string[]}
export interface TermDeep{updated:string;sections:DeepSection[];examTip?:string;faq?:{q:string;a:string}[]}
export const DEEP=deep as unknown as Record<string,TermDeep>;
export const CATEGORIES=[...new Set(TERMS.map(t=>t.category))].sort();

/** Search title and description for a term page (kept in sync with scripts/seo-pages.mjs). */
export function termSeo(t:GlossaryTerm){
  const short=t.term.replace(/\s*\([^)]*\)\s*$/,'');
  const title=`What Is ${t.term}? Definition & Example | PMPORT`;
  const desc=(`${short}: ${t.definition}`).replace(/\s+/g,' ');
  return {title:title.length<=70?title:`${t.term}: Definition | PMPORT`,description:desc.length<=158?desc:desc.slice(0,desc.lastIndexOf(' ',154))+'…'};
}
