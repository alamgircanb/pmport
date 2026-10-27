import {Component,inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AREAS,AreaId,JOURNEYS,ProgressService} from '../../core/progress/progress.service';

/** Learning journeys hub: step-by-step paths through PMPORT, grouped by area. */
@Component({standalone:true,selector:'app-journeys',imports:[RouterLink],template:`
<section class="page journeys">
  <header class="page-header"><p class="eyebrow">Learn by doing · step by step</p><h1>Learning journeys</h1>
    <p class="lead">Short guided paths through PMPORT. Each step is something to read, try, prove or use, and you earn points as you go. Pick a journey for your area and level.</p></header>

  <a class="me card" routerLink="/my-progress" aria-label="Open my progress">
    <span class="lvl">Level {{progress.level.number}}</span>
    <span class="who"><strong>{{progress.level.name}}</strong><span>{{summary}}</span></span>
    <span class="go">My progress →</span>
  </a>

  <div class="areas" role="radiogroup" aria-label="Filter by area">
    <button type="button" role="radio" [attr.aria-checked]="area===null" [class.on]="area===null" (click)="area=null">All areas</button>
    @for(a of areas;track a.id){<button type="button" role="radio" [attr.aria-checked]="area===a.id" [class.on]="area===a.id" (click)="area=a.id">{{a.label}}</button>}
  </div>

  <div class="grid-j">
    @for(j of shown;track j.id){
      @let pr=progress.journeyProgress(j);
      <article class="card journey" [class.complete]="pr.done===pr.total">
        <div class="top"><span class="icon" aria-hidden="true">{{j.icon}}</span><span class="tag">{{areaLabel(j.area)}}</span><span class="tag quiet">{{j.level}}</span></div>
        <h2><a [routerLink]="'/journeys/'+j.id">{{j.title}}</a></h2>
        <p class="muted">{{j.summary}}</p>
        <div class="meta"><span>{{j.steps.length}} steps</span><span>{{points(j)}} points</span></div>
        <div class="bar" role="progressbar" [attr.aria-valuenow]="pr.pct" aria-valuemin="0" aria-valuemax="100" [attr.aria-label]="j.title+' progress'"><span [style.width.%]="pr.pct"></span></div>
        <p class="state">{{pr.done===pr.total?'Completed':pr.done?pr.done+' of '+pr.total+' steps done':'Not started'}}</p>
        <a class="button" [class.primary]="pr.done!==pr.total" [class.secondary]="pr.done===pr.total" [routerLink]="'/journeys/'+j.id">{{pr.done===pr.total?'Review':pr.done?'Continue':'Start journey'}}</a>
      </article>
    }
  </div>
  <p class="muted note">Your progress is saved in this browser. No account needed.</p>
</section>`,styles:[`
.me{display:flex;align-items:center;gap:1rem;padding:1rem 1.25rem;margin-bottom:1.25rem;text-decoration:none;color:inherit}
.me:hover{border-color:var(--accent)}
.lvl{flex:none;display:grid;place-items:center;width:64px;height:64px;border-radius:50%;background:var(--accent);color:#041223;font-weight:800;font-size:.8rem;text-align:center;line-height:1.1;padding:.4rem}
.who{display:grid;gap:.15rem}.who strong{font-size:1.15rem}.who span{color:#9db1c7;font-size:.92rem}
.go{margin-left:auto;color:#8fe8f5;font-weight:700}
.areas{display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:1.25rem}
.areas button{min-height:40px;padding:0 1rem;border:1px solid #2a4a69;border-radius:999px;background:#0a1f38;color:#c5d4e5;font:inherit;font-size:.92rem;cursor:pointer}
.areas button.on{background:var(--accent);border-color:var(--accent);color:#041223;font-weight:700}
.grid-j{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1rem}
.journey{display:flex;flex-direction:column;gap:.55rem}
.journey.complete{border-color:#3ecf8e}
.top{display:flex;gap:.5rem;align-items:center;flex-wrap:wrap}.icon{font-size:1.8rem;margin-right:.25rem}
.tag.quiet{background:transparent;border:1px solid #2a4a69;color:#9db1c7}
.journey h2{font-size:1.3rem;margin:.25rem 0 0;letter-spacing:-.02em}.journey h2 a{color:#fff;text-decoration:none}.journey h2 a:hover{text-decoration:underline}
.journey p{margin:0;line-height:1.55}
.meta{display:flex;gap:1rem;color:#9db1c7;font-size:.88rem}
.bar{height:8px;border-radius:8px;background:#12304d;overflow:hidden}.bar span{display:block;height:100%;background:var(--accent)}
.complete .bar span{background:#3ecf8e}
.state{color:#9db1c7;font-size:.88rem}
.journey .button{margin-top:auto;align-self:flex-start}
.note{margin-top:1.5rem;font-size:.88rem}
@media(max-width:650px){.me{flex-wrap:wrap}.go{margin-left:0;width:100%}.grid-j{grid-template-columns:1fr}}
`]})
export class JourneysComponent{
  readonly progress=inject(ProgressService);readonly areas=AREAS;area:AreaId|null=null;
  get summary(){const f=this.progress.freezes;return `${this.progress.xp} points · ${this.progress.streak}-day streak`+(f?` · ${f} streak freeze${f===1?'':'s'}`:'')}
  get shown(){return this.area?JOURNEYS.filter(j=>j.area===this.area):JOURNEYS}
  areaLabel(id:AreaId){return AREAS.find(a=>a.id===id)?.label??id}
  points(j:(typeof JOURNEYS)[number]){return j.steps.reduce((n,s)=>n+s.xp,0)+200}
}
