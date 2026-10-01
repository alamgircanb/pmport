import {AsyncPipe} from '@angular/common';
import {Component,inject} from '@angular/core';
import {map,combineLatest} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {PortfolioArea} from '../../core/models/portfolio.models';
import {ContentService} from '../../core/services/content.service';

@Component({
  standalone:true,
  selector:'app-portfolio',
  imports:[AsyncPipe],
  template:`
    <section class="page">
      <header class="page-header">
        <p class="eyebrow">Portfolio</p>
        <h1>{{heading}}</h1>
        <p class="lead">Explore projects spanning business analysis, technology, project leadership and applied learning.</p>
        <div class="actions">
          <a class="button secondary" href="https://github.com/hossain8078" target="_blank" rel="noreferrer">hossain8078 GitHub ↗</a>
          <a class="button secondary" href="https://github.com/alamgircanb" target="_blank" rel="noreferrer">alamgircanb GitHub ↗</a>
        </div>
      </header>

      @if(areas$|async;as areas){
        <div class="areas">
          @for(area of areas;track area.id){
            <article class="work card">
              <img [src]="area.image" [alt]="area.imageAlt" loading="lazy">
              <div>
                <span class="eyebrow">{{area.number}} / {{area.category}}</span>
                <h2>{{area.category}}</h2>
                <p class="muted">{{area.description}}</p>
                <ul class="tag-list">@for(tool of area.tools;track tool){<li class="tag">{{tool}}</li>}</ul>

                <!-- This list becomes scrollable as more projects are added. -->
                <div class="items scroll-list" tabindex="0">
                  @for(work of sorted(area.workItems);track work.title){
                    <div class="item">
                      <div><strong>{{work.title}}</strong><p>{{work.description}}</p></div>
                      @if(work.repositoryUrl){
                        <a class="button small secondary" [href]="work.repositoryUrl" target="_blank" rel="noreferrer">Repository ↗</a>
                      }@else{
                        <span class="placeholder">Add repository URL</span>
                      }
                    </div>
                  }
                </div>
              </div>
            </article>
          }
        </div>
      }
    </section>
  `,
  styles:[`
    .areas{display:grid;gap:1.5rem}
    .work{display:grid;grid-template-columns:minmax(230px,.75fr) 1.25fr;gap:2rem}
    .work>img{width:100%;height:100%;max-height:420px;object-fit:contain;object-position:center;border-radius:13px;background:#06182c}
    .work h2{font-size:clamp(1.8rem,4vw,3.2rem)}
    code{color:var(--accent)}
    .items{max-height:360px;margin-top:1.2rem}
    .item{border-top:1px solid var(--line);padding:1rem 0;display:flex;justify-content:space-between;gap:1rem;align-items:center}
    .item p{margin:.35rem 0;color:var(--muted);font-size:.87rem}
    .placeholder{color:#7590aa;font-size:.76rem}
    @media(max-width:760px){.work{grid-template-columns:1fr}.work>img{max-height:300px}}
  `]
})
export class PortfolioComponent{
  private readonly content=inject(ContentService);
  private readonly route=inject(ActivatedRoute);
  get heading(){return this.route.snapshot.data['area']==='course'?'Course Work':this.route.snapshot.data['area']==='professional'?'Professional Work':'Selected work'}

  // Portfolio content lives in public/data/portfolio.json so new work can be
  // added without changing this component. Lower priority numbers appear first.
  readonly areas$=combineLatest([this.content.load<PortfolioArea[]>('portfolio.json'),inject(ActivatedRoute).data]).pipe(map(([areas,data])=>areas.filter(a=>data['area']==='course'?a.id!=='project-program-change-leadership':data['area']==='professional'?a.id==='project-program-change-leadership':true).sort((a,b)=>a.priority-b.priority))); 

  sorted<T extends {priority:number}>(items:T[]):T[]{
    return [...items].sort((a,b)=>a.priority-b.priority);
  }
}
