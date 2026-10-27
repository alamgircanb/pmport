import {Component,inject} from '@angular/core';
import {ActivatedRoute,RouterLink} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {JOURNEYS,Journey,JourneyStep,ProgressService,StepKind} from '../../core/progress/progress.service';

const KIND:Record<StepKind,{icon:string;label:string}>={learn:{icon:'📖',label:'Learn'},try:{icon:'🧪',label:'Try'},prove:{icon:'✅',label:'Prove'},use:{icon:'🧰',label:'Use'}};
/** Sideways offsets that make the path wind, Coddy/Duolingo style (repeats every four steps). */
const WIND=[0,1,2,1];

/** One learning journey drawn as a winding path of steps. Steps complete automatically when the visitor does them. */
@Component({standalone:true,selector:'app-journey',imports:[RouterLink],template:`
@if(journey();as j){
<section class="page journey">
  <header class="page-header"><p class="eyebrow"><a routerLink="/journeys">Learning journeys</a> · {{j.level}}</p>
    <h1><span aria-hidden="true">{{j.icon}}</span> {{j.title}}</h1><p class="lead">{{j.summary}}</p></header>

  @let pr=progress.journeyProgress(j);
  <div class="card status">
    <div><strong>{{pr.done}} of {{pr.total}} steps</strong><span class="muted"> · {{earned(j)}} of {{total(j)}} points</span></div>
    <div class="bar" role="progressbar" [attr.aria-valuenow]="pr.pct" aria-valuemin="0" aria-valuemax="100" aria-label="Journey progress"><span [style.width.%]="pr.pct"></span></div>
    @if(progress.nextStep(j);as next){<a class="button primary" [routerLink]="next.path" [queryParams]="next.query">Next: {{next.title}}</a>}
    @else{<p class="done-msg">🏁 Journey complete. You earned the 200-point completion bonus.</p>}
  </div>

  <ol class="path">
    @for(s of j.steps;track s.id;let i=$index){
      <li class="step" [class.done]="progress.stepDone(j,s)" [class.current]="progress.nextStep(j)?.id===s.id" [style.--wind]="wind(i)">
        <span class="node" aria-hidden="true">{{progress.stepDone(j,s)?'✓':kind(s).icon}}</span>
        <div class="card body">
          <p class="kind">{{kind(s).label}} · +{{s.xp}} points{{progress.stepDone(j,s)?' · done':''}}</p>
          <h2>{{s.title}}</h2>
          <p class="muted">{{s.text}}</p>
          <div class="acts">
            <a class="button small" [class.primary]="progress.nextStep(j)?.id===s.id" [class.secondary]="progress.nextStep(j)?.id!==s.id" [routerLink]="s.path" [queryParams]="s.query">{{progress.stepDone(j,s)?'Open again':'Open step'}}</a>
            @if(!progress.stepDone(j,s)){<button type="button" class="link" (click)="progress.completeStep(j,s)">I've done this</button>}
          </div>
          @if(!progress.stepDone(j,s)){<p class="hint">{{hint(s)}}</p>}
        </div>
      </li>
    }
    <li class="step finish" [class.done]="progress.journeyDone(j)" [style.--wind]="wind(j.steps.length)"><span class="node" aria-hidden="true">🏁</span><div class="card body"><p class="kind">Finish · +200 points</p><h2>Journey complete</h2><p class="muted">Finish every step to earn the bonus and the Pathfinder badge.</p></div></li>
  </ol>

  <p class="more muted">More paths: @for(o of others(j);track o.id;let last=$last){<a [routerLink]="'/journeys/'+o.id">{{o.title}}</a>{{last?'':' · '}}}</p>
</section>
}@else{
<section class="page"><header class="page-header"><h1>Journey not found</h1><p class="lead"><a routerLink="/journeys">See all learning journeys</a>.</p></header></section>
}`,styles:[`
.page-header .eyebrow a{color:inherit}
.status{display:grid;gap:.75rem;padding:1.25rem 1.5rem;margin-bottom:2rem}
.bar{height:10px;border-radius:10px;background:#12304d;overflow:hidden}.bar span{display:block;height:100%;background:var(--accent);transition:width .4s}
.status .button{justify-self:start}.done-msg{margin:0;font-weight:700;color:#3ecf8e}
.path{list-style:none;margin:0;padding:0;display:grid;gap:1.25rem;position:relative}
.step{display:flex;gap:1.1rem;align-items:flex-start;margin-left:calc(var(--wind,0) * 28px);position:relative}
.node{flex:none;width:64px;height:64px;border-radius:50%;display:grid;place-items:center;font-size:1.6rem;background:#0b2340;border:3px solid #2a4a69;position:relative;z-index:1}
.step.done .node{background:#3ecf8e;border-color:#3ecf8e;color:#04170f;font-weight:900}
.step.current .node{border-color:var(--accent);box-shadow:0 0 0 6px rgba(73,204,225,.18);animation:pulse 2s ease-in-out infinite}
.body{flex:1;min-width:0;padding:1rem 1.2rem}
.step.current .body{border-color:var(--accent)}
.kind{margin:0;color:#8fe8f5;font-size:.78rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
.step.done .kind{color:#3ecf8e}
.body h2{font-size:1.15rem;margin:.3rem 0 .25rem;letter-spacing:-.01em}
.body p{margin:0;line-height:1.55}
.acts{display:flex;flex-wrap:wrap;gap:.75rem;align-items:center;margin-top:.75rem}
.link{background:none;border:0;color:#8fe8f5;font:inherit;font-size:.92rem;cursor:pointer;text-decoration:underline;padding:.4rem 0}
.hint{margin-top:.5rem!important;color:#7f98b0;font-size:.84rem}
.finish .node{font-size:1.5rem}.finish.done .node{background:#f6c860;border-color:#f6c860}
.more{margin-top:2rem}.more a{color:#8fe8f5}
@keyframes pulse{50%{box-shadow:0 0 0 12px rgba(73,204,225,.06)}}
@media(max-width:650px){.step{margin-left:calc(var(--wind,0) * 10px);gap:.75rem}.node{width:48px;height:48px;font-size:1.2rem}}
@media(prefers-reduced-motion:reduce){.step.current .node{animation:none}}
`]})
export class JourneyComponent{
  readonly progress=inject(ProgressService);
  readonly journey=toSignal(inject(ActivatedRoute).paramMap.pipe(map(p=>JOURNEYS.find(j=>j.id===p.get('id'))??null)),{initialValue:null});
  kind(s:JourneyStep){return KIND[s.kind]}
  wind(i:number){return WIND[i%WIND.length]}
  total(j:Journey){return j.steps.reduce((n,s)=>n+s.xp,0)+200}
  earned(j:Journey){return j.steps.filter(s=>this.progress.stepDone(j,s)).reduce((n,s)=>n+s.xp,0)+(this.progress.journeyDone(j)?200:0)}
  others(j:Journey){return JOURNEYS.filter(o=>o.id!==j.id)}
  hint(s:JourneyStep){
    switch(s.done.event){
      case 'visit':return 'Ticks itself when you open the page.';
      case 'article_complete':return 'Ticks itself when you reach the end of the article.';
      case 'tool_use':return 'Ticks itself when you change a setting or press a button in the tool.';
      case 'simulator_complete':return 'Ticks itself when you finish the set and see your results.';
      case 'daily_practice_complete':return "Ticks itself when you finish today's five questions.";
      default:return 'Ticks itself when you finish it.';
    }
  }
}
