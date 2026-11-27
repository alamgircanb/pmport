import {Component,Input} from '@angular/core';
import pageFaq from './page-faq.json';

interface PageFaq{summary:string;faq:{q:string;a:string}[]}
const DATA=pageFaq as Record<string,PageFaq>;

/**
 * Answer-first summary ("Quick answer") and a visible FAQ for a page, from page-faq.json.
 * The build script (scripts/seo-pages.mjs) reads the same file and writes matching FAQPage structured data,
 * so the questions Google and AI assistants read are the same ones visitors see.
 * Pages without an entry render nothing.
 */
@Component({selector:'app-page-faq',standalone:true,template:`
@if(data;as d){
  @if(part==='summary'){<p class="quick-answer"><strong>Quick answer:</strong> {{d.summary}}</p>}
  @else{<section class="page-faq" aria-labelledby="page-faq-title"><p class="eyebrow">FAQ</p><h2 id="page-faq-title">Frequently asked questions</h2>
    @for(f of d.faq;track f.q){<details><summary><h3>{{f.q}}</h3></summary><p>{{f.a}}</p></details>}</section>}
}`,styles:[`
:host{display:block}
.quick-answer{margin:1.25rem 0;padding:1rem 1.25rem;border-left:4px solid #49cce1;border-radius:0 12px 12px 0;background:#0b2340;color:#c5d4e5;line-height:1.65}
.quick-answer strong{color:#fff}
.page-faq{margin:2rem 0;padding:1.5rem;border:1px solid #1b4267;border-radius:18px;background:#0b2340}
.page-faq h2{margin:.25rem 0 1rem}
details{border-top:1px solid #1b4267;padding:.85rem 0}
summary{cursor:pointer;list-style:none;display:flex;justify-content:space-between;gap:1rem;align-items:center}
summary::-webkit-details-marker{display:none}
summary::after{content:'+';color:#49cce1;font-size:1.4rem;font-weight:700;flex:none}
details[open] summary::after{content:'−'}
summary h3{margin:0;font-size:1.05rem;color:#fff;line-height:1.4}
details p{margin:.6rem 0 0;color:#b1c3d7;line-height:1.65}
`]})
export class PageFaqComponent{
  data?:PageFaq;
  @Input() part:'summary'|'faq'='faq';
  /** Page path without the leading slash, as in seo-pages.json. */
  @Input({required:true}) set path(value:string){this.data=DATA[value];}
}
