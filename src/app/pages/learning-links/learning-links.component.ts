import {Component,inject} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {ContentService} from '../../core/services/content.service';

type LearningLink={type:'YouTube'|'Website';title:string;url:string;note?:string};
type LinkFilter='All'|'YouTube'|'Websites';
type LinkCategory={id:string;title:string;links:LearningLink[]};

/** PM LearningLink: curated YouTube channels and websites, edited in public/data/learning-links.json. */
@Component({
  standalone:true,
  selector:'app-learning-links',
  imports:[AsyncPipe,RouterLink],
  template:`
  <section class="page learning-links">
    <header class="page-header"><p class="eyebrow">PM LearningLink</p><h1>Learning links</h1><p class="lead">Popular YouTube channels and websites for project management, business analysis, data analytics and coding, all in one place.</p></header>
    @if(categories$|async;as categories){
      <nav class="jump" aria-label="Categories">
        @for(c of categories;track c.id){<a routerLink="/pm-learninglink" [fragment]="c.id">{{c.title}} <small>{{c.links.length}}</small></a>}
      </nav>
      <div class="filter" role="group" aria-label="Show">
        @for(f of filters;track f){<button type="button" [class.active]="filter===f" [attr.aria-pressed]="filter===f" (click)="filter=f">{{f}}</button>}
      </div>
      @for(c of categories;track c.id){
        <section class="category" [id]="c.id">
          <h2>{{c.title}}</h2>
          <ol>
            @for(l of shown(c.links);track l.url){
              <li><a [href]="l.url" target="_blank" rel="noopener noreferrer"><span class="tag" [class.yt]="l.type==='YouTube'">{{l.type==='YouTube'?'YouTube':'Web'}}</span><span class="text"><strong>{{l.title}}</strong>@if(l.note){<small>{{l.note}}</small>}</span><span class="out" aria-hidden="true">↗</span></a></li>
            }
          </ol>
        </section>
      }
      <p class="muted note">Links open external sites in a new tab. PMPORT is not affiliated with these providers.</p>
    }
  </section>`,
  styles:[`
    .jump{display:flex;flex-wrap:wrap;gap:.6rem;margin-bottom:1rem}.jump a{padding:.55rem .9rem;border:1px solid var(--line);border-radius:99px;background:#082039;color:#d9eef7;text-decoration:none;font-weight:700}.jump small{color:var(--accent);margin-left:.25rem}
    .filter{display:flex;gap:.4rem;margin-bottom:2rem}.filter button{border:1px solid #3b5874;background:transparent;color:#c9d9e7;border-radius:8px;padding:.45rem .8rem;cursor:pointer}.filter button.active{background:var(--accent);border-color:var(--accent);color:#041223;font-weight:700}
    .category{margin-bottom:2.5rem;scroll-margin-top:80px}.category h2{font-size:clamp(1.6rem,3vw,2.2rem);margin-bottom:1rem}
    .category ol{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.5rem}
    .category li a{display:flex;align-items:center;gap:.75rem;padding:.7rem .9rem;border:1px solid var(--line);border-radius:10px;background:#0b2340;color:#eaf3fc;text-decoration:none;height:100%}
    .category li a:hover,.category li a:focus-visible{border-color:var(--accent)}
    .tag{flex:none;min-width:4.6rem;text-align:center;font-size:.72rem;font-weight:800;padding:.25rem .4rem;border-radius:6px;background:#1b4267;color:#cfe3f3}.tag.yt{background:#b3261e;color:#fff}
    .text{flex:1;min-width:0}.text strong{display:block;line-height:1.35}.text small{display:block;color:var(--muted);margin-top:.15rem;line-height:1.4}
    .out{color:var(--accent)}.note{font-size:.85rem}
    @media(max-width:760px){.category ol{grid-template-columns:1fr}}
  `]
})
export class LearningLinksComponent{
  private content=inject(ContentService);
  readonly filters:LinkFilter[]=['All','YouTube','Websites'];
  filter:LinkFilter='All';
  categories$=this.content.load<LinkCategory[]>('learning-links.json');
  shown(links:LearningLink[]){return this.filter==='All'?links:links.filter(l=>this.filter==='YouTube'?l.type==='YouTube':l.type==='Website');}
}
