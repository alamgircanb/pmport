/**
 * Google Analytics 4 events (the gtag snippet is in src/index.html).
 * Safe to call anywhere: nothing happens if analytics is blocked, not loaded yet, or the page is prerendering.
 *
 * Events PMPORT sends (mark the important ones as Key events in GA4: Admin › Events):
 *   simulator_start     exam, mode, form           a mock exam or practice set is started
 *   simulator_complete  exam, mode, form, score    a mock exam or practice set is finished
 *   file_download       file_name, file_extension  any export: Excel, PDF, Word, image, JSON, ZIP
 *   tool_use            tool, page_path            first real use of a calculator, simulation, lab or template on a page
 *   template_open       template, role             a template is opened in the Artifacts Lab
 *   article_complete    article                    a reader reaches the end of an article ("Keep reading" block)
 *   related_click       from, to                   a "Keep reading" link is followed
 *   home_click          area, link_text, link_path a link on the home page (banner, Start here, cards)
 *   search              search_term                site search
 */
export function trackEvent(name:string,params:Record<string,string|number>={}):void{
  if(typeof window==='undefined')return;
  try{const gtag=(window as unknown as {gtag?:(...args:unknown[])=>void}).gtag;gtag?.('event',name,params)}catch{}
  for(const fn of listeners){try{fn(name,params)}catch{}}
}

type Listener=(name:string,params:Record<string,string|number>)=>void;
const listeners=new Set<Listener>();
/** Lets other parts of the site (points and journeys) react to the same events GA receives. Works even when GA is blocked. */
export function onTrack(fn:Listener):()=>void{listeners.add(fn);return()=>listeners.delete(fn)}

/** Records a file the visitor saved (exports are made in the browser, so GA cannot see them as link downloads). */
export function trackDownload(fileName:string):void{
  const ext=(fileName.match(/\.([a-z0-9]+)$/i)?.[1]??'').toLowerCase();
  trackEvent('file_download',{file_name:fileName.slice(0,100),file_extension:ext,page_path:typeof location!=='undefined'?location.pathname:''});
}

/** Pages whose controls count as using a tool. Exam simulators send their own events. */
const TOOL_PAGES=/^\/(pm-calculators\/|pm-tools|pm-handaid|pm-playground|pm-datalab\/)/;

/**
 * Starts the site-wide listeners: one tool_use event per page view when a visitor first changes a control
 * (slider, number, text, select) or presses a button on a tool page, and home_click for links on the home page.
 * Call once, in the browser only.
 */
export function startInteractionTracking():void{
  if(typeof document==='undefined')return;
  let used='';
  const pageKey=()=>location.pathname+location.search;
  const toolName=()=>document.querySelector('#main-content h1')?.textContent?.trim().slice(0,100)||document.title;
  const onUse=(e:Event)=>{
    const t=e.target as HTMLElement|null;
    if(!t?.closest('#main-content')||!TOOL_PAGES.test(location.pathname)||used===pageKey())return;
    if(e.type==='click'&&!t.closest('button'))return;
    used=pageKey();
    trackEvent('tool_use',{tool:toolName(),page_path:location.pathname});
  };
  document.addEventListener('input',onUse,true);
  document.addEventListener('change',onUse,true);
  document.addEventListener('click',e=>{
    onUse(e);
    const t=e.target as HTMLElement|null;
    const link=t?.closest('a');
    if(location.pathname!=='/'||!link||!link.closest('#main-content'))return;
    const area=link.closest('.banner')?'banner':link.closest('.start')?'start_here':link.closest('section')?.className.split(' ')[0]||'other';
    trackEvent('home_click',{area,link_text:(link.textContent||'').trim().slice(0,80),link_path:link.getAttribute('href')||''});
  },true);
}
