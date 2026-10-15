import {Component,inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {ActivatedRoute,RouterLink,TitleStrategy} from '@angular/router';
import {map,tap} from 'rxjs';
import {SITE_URL} from '../../core/seo/seo-pages';
import type {SeoTitleStrategy} from '../../core/seo/seo-title.strategy';
import {TERM_BY_SLUG,TERMS,termSeo,type GlossaryTerm} from './glossary';

/** One glossary term on its own page, with its own search title, description and structured data. */
@Component({
  standalone:true,selector:'app-glossary-term',imports:[RouterLink],
  template:`
  <article class="page term-page">
    <a routerLink="/pm-glossary" class="back">← Glossary</a>
    @if(term();as t){
      <p class="eyebrow">{{t.category}}</p>
      <h1>{{t.term}}</h1>
      <p class="definition">{{t.definition}}</p>
      <div class="example card"><p class="eyebrow">Example</p><p>{{t.example}}</p></div>
      @if(related(t).length){<section class="related"><h2>Related terms</h2><div class="chips">@for(r of related(t);track r.slug){<a [routerLink]="'/pm-glossary/'+r.slug">{{r.term}}</a>}</div></section>}
      <nav class="prevnext" aria-label="Browse terms">
        @if(neighbour(t,-1);as p){<a [routerLink]="'/pm-glossary/'+p.slug">‹ {{p.term}}</a>}@else{<span></span>}
        @if(neighbour(t,1);as n){<a [routerLink]="'/pm-glossary/'+n.slug">{{n.term}} ›</a>}
      </nav>
      <div class="practice card"><p><strong>Test yourself:</strong> practise these concepts with the <a routerLink="/pm-faciliter/pmp-exam-simulator">free PMP exam simulator</a>, or work the numbers with the free <a routerLink="/pm-calculators">PM calculators</a>.</p></div>
    }@else{
      <h1>Term not found</h1><p class="muted">This term isn't in the glossary yet. <a routerLink="/pm-glossary">Browse all terms</a>.</p>
    }
  </article>`,
  styles:[`
    .term-page{max-width:860px}.back{display:inline-block;margin-bottom:1.5rem;color:var(--accent);font-weight:700}
    h1{font-size:clamp(2.2rem,5vw,3.6rem)!important;line-height:1.05!important;margin-bottom:1rem!important}
    .definition{font-size:1.2rem;line-height:1.75;color:#e1edf7}
    .example{margin:1.5rem 0}.example p:last-child{margin:0;line-height:1.7;color:#d0e0ee}
    .related h2{font-size:1.3rem!important;letter-spacing:0!important;margin:1.5rem 0 .7rem!important}
    .chips{display:flex;flex-wrap:wrap;gap:.5rem}.chips a{padding:.5rem .85rem;border:1px solid var(--line);border-radius:99px;background:#082039;color:#d9eef7;text-decoration:none;font-weight:700;font-size:.9rem}
    .chips a:hover{border-color:var(--accent)}
    .prevnext{display:flex;justify-content:space-between;gap:1rem;margin:2rem 0 1rem}.prevnext a{color:var(--accent);font-weight:700}
    .practice p{margin:0;line-height:1.7}.practice a,.muted a{color:var(--accent)}
  `]
})
export class GlossaryTermComponent{
  private seo=inject(TitleStrategy) as SeoTitleStrategy;
  readonly term=toSignal(inject(ActivatedRoute).paramMap.pipe(
    map(p=>TERM_BY_SLUG.get(p.get('slug')??'')),
    tap(t=>this.setSeo(t))
  ));
  related(t:GlossaryTerm){return t.related.map(s=>TERM_BY_SLUG.get(s)).filter((x):x is GlossaryTerm=>!!x);}
  neighbour(t:GlossaryTerm,d:number){return TERMS[TERMS.indexOf(t)+d];}
  private setSeo(t:GlossaryTerm|undefined){
    if(typeof this.seo.apply!=='function')return;
    if(!t){this.seo.apply('pm-glossary',{title:'Term not found | PMPORT',description:'This term is not in the PMPORT project management glossary.',noindex:true});this.seo.setJsonLd('seo-term',null);return;}
    const path=`pm-glossary/${t.slug}`;const s=termSeo(t);
    this.seo.apply(path,{title:s.title,description:s.description},[{name:'Home',url:`${SITE_URL}/`},{name:'Glossary',url:`${SITE_URL}/pm-glossary`},{name:t.term,url:`${SITE_URL}/${path}`}]);
    this.seo.setJsonLd('seo-term',{'@context':'https://schema.org','@type':'DefinedTerm',name:t.term,description:t.definition,url:`${SITE_URL}/${path}`,
      inDefinedTermSet:{'@type':'DefinedTermSet',name:'PMPORT Project Management Glossary',url:`${SITE_URL}/pm-glossary`}});
  }
}
