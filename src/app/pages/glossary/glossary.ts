import data from './glossary-data.json';
import deep from './glossary-deep.json';

export interface GlossaryTerm{term:string;slug:string;category:string;definition:string;example:string;related:string[]}
export const TERMS=data as GlossaryTerm[];
export const TERM_BY_SLUG=new Map(TERMS.map(t=>[t.slug,t]));
/** Extra in-depth content for the most-searched terms (src/app/pages/glossary/glossary-deep.json, also read by scripts/seo-pages.mjs). */
export interface DeepSection{h:string;p?:string;items?:string[]}
/** seoTitle/seoDescription override the generated search title and description (write them to match what people search for).
 *  tools links the term to the PMPORT calculator, simulator or lab where it can be practised. */
export interface TermDeep{updated:string;sections:DeepSection[];examTip?:string;faq?:{q:string;a:string}[];seoTitle?:string;seoDescription?:string;tools?:{label:string;path:string;text:string}[]}
export const DEEP=deep as unknown as Record<string,TermDeep>;
export const CATEGORIES=[...new Set(TERMS.map(t=>t.category))].sort();

/** Search title and description for a term page (kept in sync with scripts/seo-pages.mjs). */
export function termSeo(t:GlossaryTerm){
  const short=t.term.replace(/\s*\([^)]*\)\s*$/,'');
  const title=`What Is ${t.term}? Definition & Example | PMPORT`;
  const desc=(`${short}: ${t.definition}`).replace(/\s+/g,' ');
  const d=DEEP[t.slug];if(d?.seoTitle&&d.seoDescription)return {title:d.seoTitle+' | PMPORT',description:d.seoDescription};
  return {title:title.length<=70?title:`${t.term}: Definition | PMPORT`,description:desc.length<=158?desc:desc.slice(0,desc.lastIndexOf(' ',154))+'…'};
}
