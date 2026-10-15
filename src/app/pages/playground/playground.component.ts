import {Component,DestroyRef,OnInit,inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute,Router,RouterLink} from '@angular/router';
import {SimPanelComponent} from './sim-panel.component';
import {KANBAN} from './sims/kanban-sim';
import {RISK} from './sims/risk-sim';
import {ADOPTION} from './sims/adoption-sim';
import {DEBT} from './sims/debt-sim';
import {CHALLENGES,DEFAULT_PARAMS,addPeople,createSim,fromQuery,insights,step,toQuery,type Approach,type Challenge,type Params,type SimState,type WeekLog} from './playground-model';

type Lever='meetings'|'wip'|'overtime'|'testing'|'creep'|'risk'|'turnover';

/** Playground: an interactive, week-by-week project simulator inspired by TensorFlow Playground. */
@Component({
  standalone:true,selector:'app-pm-playground',imports:[FormsModule,RouterLink,SimPanelComponent],
  template:`
  <section class="page playground">
    <header class="pg-head"><p class="eyebrow">Practice · Project simulations</p><h1>Playground: see how project decisions play out</h1>
      <p class="lead">Five interactive simulators for project managers. Pick one, set it up, press play and watch your decisions play out week by week. Change the settings at any time and see the effect straight away.</p>
      <nav class="pg-nav" aria-label="Playgrounds">@for(n of navItems;track n.id){<button type="button" (click)="jump(n.id)"><span>{{n.n}}</span>{{n.label}}</button>}</nav></header>

    <div class="pg-section" id="pg-delivery">
    <p class="eyebrow">Playground 1 · Project delivery</p><h2>Project delivery: scope, team, schedule and cost</h2>
    <p class="intro">Set up a project, shape how the team works, then watch it unfold. Change team size, WIP, overtime, testing or scope change at any time and see the effect on the schedule, cost, quality and team morale.</p>

    <div class="bar card">
      <div class="transport">
        <button type="button" class="round play" (click)="toggle()" [attr.aria-label]="playing?'Pause':'Play'">{{playing?'❚❚':'▶'}}</button>
        <button type="button" class="round" (click)="stepOnce()" [disabled]="done" aria-label="Step one week">⏭</button>
        <button type="button" class="round" (click)="reset()" aria-label="Reset">↺</button>
        <div class="week"><span>Week</span><strong>{{sim.week}}</strong><small>plan: {{p.deadline}}</small></div>
        <label class="speed">Speed <select [(ngModel)]="speed" (ngModelChange)="restartTimer()"><option [ngValue]="900">Slow</option><option [ngValue]="400">Normal</option><option [ngValue]="120">Fast</option></select></label>
      </div>
      <div class="challenge">
        <label>Challenge <select [ngModel]="challengeId" (ngModelChange)="pickChallenge($event)"><option value="">Free play (sandbox)</option>@for(c of challenges;track c.id){<option [value]="c.id">{{c.title}}</option>}</select></label>
        <button type="button" class="button secondary small" (click)="copyLink()">{{copied?'Link copied ✓':'Copy link to this scenario'}}</button>
      </div>
    </div>
    @if(challenge){<div class="mission card"><p class="eyebrow">Challenge</p><p><strong>{{challenge.title}}.</strong> {{challenge.story}}</p><p class="goal">🎯 Goal: {{challenge.goal}}</p>
      @if(result){<p class="verdict" [class.win]="result.ok" [class.lose]="!result.ok">{{result.ok?'✅ Challenge complete!':'❌ Not this time.'}} {{result.detail}} @if(!result.ok){<span>Tip: {{challenge.hint}}</span>}</p>}</div>}

    <div class="grid3">
      <!-- Column 1: project setup (changing it restarts the run) -->
      <section class="col card" aria-label="Project setup">
        <h2>1 · Project</h2><p class="note">Changing these restarts the simulation.</p>
        <label>Scope <b>{{p.scope}} points</b><input type="range" min="60" max="900" step="10" [ngModel]="p.scope" (ngModelChange)="setup('scope',$event)"></label>
        <label>Planned duration <b>{{p.deadline}} weeks</b><input type="range" min="4" max="40" step="1" [ngModel]="p.deadline" (ngModelChange)="setup('deadline',$event)"></label>
        <label>Budget <b>{{k(p.budget)}}</b><input type="range" min="50000" max="2000000" step="10000" [ngModel]="p.budget" (ngModelChange)="setup('budget',$event)"></label>
        <label>Starting team <b>{{p.team}} people</b><input type="range" min="1" max="20" step="1" [ngModel]="p.team" (ngModelChange)="setup('team',$event)"></label>
        <div class="seg" role="radiogroup" aria-label="Delivery approach">
          @for(a of approaches;track a.id){<button type="button" role="radio" [attr.aria-checked]="p.approach===a.id" [class.on]="p.approach===a.id" (click)="setup('approach',a.id)">{{a.label}}</button>}
        </div>
        <details><summary>More settings</summary>
          <label>Output per person <b>{{p.rate}} pts/week</b><input type="range" min="2" max="20" step="1" [ngModel]="p.rate" (ngModelChange)="setup('rate',$event)"></label>
          <label>Cost per person <b>{{k(p.costPerWeek)}}/week</b><input type="range" min="1000" max="15000" step="500" [ngModel]="p.costPerWeek" (ngModelChange)="setup('costPerWeek',$event)"></label>
          <button type="button" class="button secondary small" (click)="setup('seed',newSeed())">New random run</button>
        </details>
      </section>

      <!-- Column 2: how the team works (changes apply from next week) -->
      <section class="col card" aria-label="Way of working">
        <h2>2 · Way of working</h2><p class="note">Change these any time, even mid-run.</p>
        <label>Meetings &amp; admin <b>{{p.meetings}}%</b><input type="range" min="0" max="50" step="1" [ngModel]="p.meetings" (ngModelChange)="lever('meetings',$event)"></label>
        <label>Work in progress <b>{{p.wip}} item{{p.wip===1?'':'s'}} / person</b><input type="range" min="1" max="8" step="1" [ngModel]="p.wip" (ngModelChange)="lever('wip',$event)"></label>
        <label>Overtime <b>{{p.overtime}}%</b><input type="range" min="0" max="50" step="5" [ngModel]="p.overtime" (ngModelChange)="lever('overtime',$event)"></label>
        <label>Testing &amp; reviews <b>{{p.testing}}%</b><input type="range" min="0" max="45" step="1" [ngModel]="p.testing" (ngModelChange)="lever('testing',$event)"></label>
        <label class="check"><input type="checkbox" [ngModel]="p.changeControl" (ngModelChange)="setFlag($event)"> Formal change control</label>
        <div class="add"><span>Add people now</span><button type="button" class="button secondary small" (click)="add(1)">+1</button><button type="button" class="button secondary small" (click)="add(3)">+3</button>@if(sim.pendingAdds){<small>{{sim.pendingAdds}} joining next week</small>}</div>
        <h3>Disturbances</h3>
        <label>Scope creep <b>{{p.creep}}% / week</b><input type="range" min="0" max="5" step="0.5" [ngModel]="p.creep" (ngModelChange)="lever('creep',$event)"></label>
        <label>Risk events <b>{{p.risk}}% chance / week</b><input type="range" min="0" max="40" step="5" [ngModel]="p.risk" (ngModelChange)="lever('risk',$event)"></label>
        <label>Staff turnover <b>{{p.turnover}}% / week</b><input type="range" min="0" max="15" step="1" [ngModel]="p.turnover" (ngModelChange)="lever('turnover',$event)"></label>
      </section>

      <!-- Column 3: outputs -->
      <section class="col card out" aria-label="Results" aria-live="polite">
        <h2>3 · Results</h2>
        <div class="tiles">
          <div class="t"><span>Done / scope</span><strong>{{r0(last?.done??0)}} / {{r0(sim.scope)}}</strong></div>
          <div class="t" [class.bad]="(fc??0)>p.deadline" [class.good]="fc!==null&&fc<=p.deadline"><span>{{sim.finishWeek?'Finished':'Forecast finish'}}</span><strong>{{fc===null?'–':'Week '+fc}}</strong></div>
          <div class="t" [class.bad]="sim.cost>p.budget"><span>Spent</span><strong>{{k(sim.cost)}}</strong><small>of {{k(p.budget)}}</small></div>
          <div class="t" [class.bad]="(last?.cpi??1)<0.9" [class.good]="(last?.cpi??1)>=1"><span>CPI · SPI</span><strong>{{(last?.cpi??1).toFixed(2)}} · {{(last?.spi??1).toFixed(2)}}</strong></div>
          <div class="t" [class.bad]="(last?.bugs??0)>20"><span>Open defects</span><strong>{{r0(last?.bugs??0)}} pts</strong>@if((last?.hiddenBugs??0)>1){<small>+ hidden, not yet found</small>}</div>
          <div class="t" [class.bad]="(last?.morale??0.8)<0.5"><span>Morale · fatigue</span><strong>{{pc(last?.morale??0.8)}} · {{pc(last?.fatigue??0)}}</strong></div>
        </div>
        <div class="cap"><p class="mini">Where this week's capacity went ({{last?r0(last.capacity.gross):0}} pts)</p>
          <div class="stack">@for(sg of capacity;track sg.label){<i [style.width.%]="sg.pct" [style.background]="sg.color" [title]="sg.label+': '+sg.pct.toFixed(0)+'%'"></i>}</div>
          <div class="legend">@for(sg of capacity;track sg.label){<span><i [style.background]="sg.color"></i>{{sg.label}} {{sg.pct.toFixed(0)}}%</span>}</div></div>
      </section>
    </div>

    <div class="charts">
      <figure class="card"><figcaption>Burn-up: work done vs scope</figcaption>
        <svg viewBox="0 0 560 230" role="img" aria-label="Burn-up chart"><rect width="560" height="230" fill="none"/>
          @for(g of yGrid(maxScope);track $index){<line x1="44" x2="550" [attr.y1]="g.y" [attr.y2]="g.y" class="grid"/><text x="40" [attr.y]="g.y+4" class="ax" text-anchor="end">{{r0(g.v)}}</text>}
          <line [attr.x1]="x(p.deadline)" [attr.x2]="x(p.deadline)" y1="10" y2="200" class="deadline"/><text [attr.x]="x(p.deadline)+4" y="20" class="ax warn">Plan</text>
          <path [attr.d]="path('scope',maxScope)" class="l-scope"/><path [attr.d]="area('done',maxScope)" class="a-done"/><path [attr.d]="path('done',maxScope)" class="l-done"/>
          @if(fc&&!sim.finishWeek&&last){<line [attr.x1]="x(last.week)" [attr.y1]="y(last.done,maxScope)" [attr.x2]="x(fc)" [attr.y2]="y(sim.scope,maxScope)" class="l-fc"/><circle [attr.cx]="x(fc)" [attr.cy]="y(sim.scope,maxScope)" r="4" class="dot-fc"/>}
          @for(t of xTicks;track t){<text [attr.x]="x(t)" y="218" class="ax" text-anchor="middle">{{t}}</text>}
        </svg><div class="key"><span class="k-done">Done</span><span class="k-scope">Scope</span><span class="k-fc">Forecast</span><span class="k-dl">Planned end</span></div></figure>
      <figure class="card"><figcaption>Cost: earned value vs actual cost</figcaption>
        <svg viewBox="0 0 560 230" role="img" aria-label="Cost chart">
          @for(g of yGrid(maxCost);track $index){<line x1="44" x2="550" [attr.y1]="g.y" [attr.y2]="g.y" class="grid"/><text x="40" [attr.y]="g.y+4" class="ax" text-anchor="end">{{k(g.v)}}</text>}
          <line x1="44" x2="550" [attr.y1]="y(p.budget,maxCost)" [attr.y2]="y(p.budget,maxCost)" class="deadline"/><text x="48" [attr.y]="y(p.budget,maxCost)-4" class="ax warn">Budget</text>
          <path [attr.d]="path('pv',maxCost)" class="l-pv"/><path [attr.d]="path('ev',maxCost)" class="l-ev"/><path [attr.d]="path('cost',maxCost)" class="l-ac"/>
          @for(t of xTicks;track t){<text [attr.x]="x(t)" y="218" class="ax" text-anchor="middle">{{t}}</text>}
        </svg><div class="key"><span class="k-pv">PV (planned)</span><span class="k-ev">EV (earned)</span><span class="k-ac">AC (actual)</span></div></figure>
      <figure class="card"><figcaption>Team health and quality</figcaption>
        <svg viewBox="0 0 560 230" role="img" aria-label="Morale, fatigue and defects chart">
          @for(g of yGrid(1);track $index){<line x1="44" x2="550" [attr.y1]="g.y" [attr.y2]="g.y" class="grid"/><text x="40" [attr.y]="g.y+4" class="ax" text-anchor="end">{{pc(g.v)}}</text>}
          @for(h of sim.history;track h.week){<rect [attr.x]="x(h.week)-3" [attr.y]="y(Math.min(1,h.bugs/Math.max(1,maxBugs)),1)" width="6" [attr.height]="200-y(Math.min(1,h.bugs/Math.max(1,maxBugs)),1)" class="b-bug"/>}
          <path [attr.d]="path('morale',1)" class="l-morale"/><path [attr.d]="path('fatigue',1)" class="l-fatigue"/>
          @for(t of xTicks;track t){<text [attr.x]="x(t)" y="218" class="ax" text-anchor="middle">{{t}}</text>}
        </svg><div class="key"><span class="k-morale">Morale</span><span class="k-fatigue">Fatigue</span><span class="k-bug">Open defects (scaled, max {{r0(maxBugs)}})</span></div></figure>
      <div class="card log"><p class="mini">What happened</p>
        @if(!events.length){<p class="note">Press ▶ to start. Events such as risks, new people joining and late changes will appear here.</p>}
        <ol reversed>@for(e of events;track $index){<li><b>W{{e.week}}</b> {{e.text}}</li>}</ol></div>
    </div>

    @if(lessons.length){<section class="card lessons"><p class="eyebrow">Debrief</p><h3>What this run shows</h3><ul>@for(l of lessons;track $index){<li>{{l}}</li>}</ul></section>}
    </div>

    @for(d of sims;track d.id){<app-sim-panel [def]="d"></app-sim-panel>}

    <section class="explain">
      <h2>How the Playground works</h2>
      <p>Each playground is a teaching model built on well-known project management principles. At every step it applies the effects of your choices and of random events. The models show the direction and shape of effects, not exact forecasts for a real project. Each run uses a fixed random seed, so you can compare decisions fairly; press "New random run" for a different set of events.</p>
      <h3>The project delivery model</h3>
      <div class="effects">
        <div class="card"><h3>Brooks's law</h3><p>New people need about 6 weeks to reach full speed and take mentoring time from the existing team. Communication channels grow as n(n − 1) ÷ 2. Adding people late can slow a project down before it helps.</p></div>
        <div class="card"><h3>Work in progress</h3><p>Juggling many items causes context switching. Very low WIP leaves people idle when work is blocked. One or two items per person is usually the sweet spot (Little's law).</p></div>
        <div class="card"><h3>Overtime and fatigue</h3><p>Overtime adds output for a week or two, but fatigue builds up, cutting productivity and raising defects and cost. Morale falls when the team is exhausted or the project runs late.</p></div>
        <div class="card"><h3>Quality</h3><p>Testing uses capacity now but prevents defects. Defects found later cost more to fix, especially in predictive projects, where they surface in a late testing phase.</p></div>
        <div class="card"><h3>Scope change</h3><p>Agile absorbs new scope into the backlog. Predictive plans also pay for rework of finished work, more so the later the change arrives. Change control filters out about half of the requests, for a small overhead.</p></div>
        <div class="card"><h3>Earned value</h3><p>PV assumes even progress to the planned end. EV is the budget share of the work done; AC is the money spent. CPI and SPI below 1.0 mean over budget and behind schedule.</p></div>
      </div>
      <p>Learn the terms in the <a routerLink="/pm-glossary">Glossary</a>: <a routerLink="/pm-glossary/communication-channels">communication channels</a>, <a routerLink="/pm-glossary/work-in-progress-wip-limit">WIP limit</a>, <a routerLink="/pm-glossary/cost-of-quality-coq">cost of quality</a>, <a routerLink="/pm-glossary/scope-creep">scope creep</a> and <a routerLink="/pm-glossary/earned-value-management-evm">earned value</a>. Related terms for the other playgrounds: <a routerLink="/pm-glossary/kanban">Kanban</a>, <a routerLink="/pm-glossary/expected-monetary-value-emv">expected monetary value</a>, <a routerLink="/pm-glossary/contingency-reserve">contingency reserve</a>, <a routerLink="/pm-glossary/adkar">ADKAR</a> and <a routerLink="/pm-glossary/definition-of-done-dod">definition of done</a>. Run the numbers for a real project with the <a routerLink="/pm-calculators">PM calculators</a>.</p>
    </section>
  </section>`,
  styleUrl:'./playground-shared.css'
})
export class PlaygroundComponent implements OnInit{
  private route=inject(ActivatedRoute);private router=inject(Router);private destroy=inject(DestroyRef);
  readonly challenges=CHALLENGES;readonly Math=Math;readonly sims=[KANBAN,RISK,ADOPTION,DEBT];
  readonly navItems=[{id:'delivery',n:1,label:'Project delivery'},{id:'kanban',n:2,label:'Kanban flow'},{id:'risk',n:3,label:'Risk and reserve'},{id:'adoption',n:4,label:'Change adoption'},{id:'debt',n:5,label:'Technical debt'}];
  jump(id:string){document.getElementById('pg-'+id)?.scrollIntoView({behavior:'smooth',block:'start'});}
  readonly approaches:{id:Approach;label:string}[]=[{id:'agile',label:'Agile'},{id:'hybrid',label:'Hybrid'},{id:'predictive',label:'Predictive'}];
  p:Params={...DEFAULT_PARAMS};sim:SimState=createSim(this.p);
  playing=false;speed=400;challengeId='';challenge?:Challenge;result?:{ok:boolean;detail:string};copied=false;
  events:{week:number;text:string}[]=[];lessons:string[]=[];
  private timer?:ReturnType<typeof setInterval>;private urlTimer?:ReturnType<typeof setTimeout>;

  ngOnInit(){
    const q=this.route.snapshot.queryParamMap;const obj:Record<string,string>={};for(const key of q.keys)obj[key]=q.get(key)!;
    const ch=CHALLENGES.find(c=>c.id===obj['challenge']);
    if(ch){this.challengeId=ch.id;this.challenge=ch;this.p={...DEFAULT_PARAMS,...ch.params};}
    else this.p=fromQuery(obj);
    this.reset(false);
    this.destroy.onDestroy(()=>this.stop());
  }

  get last():WeekLog|undefined{return this.sim.history[this.sim.history.length-1];}
  get done(){return this.sim.finished||this.sim.week>=80;}
  get fc(){return this.sim.finishWeek??this.last?.forecast??null;}

  // ---- controls ----
  toggle(){if(this.playing)this.stop();else{if(this.done)this.reset(false);this.playing=true;this.restartTimer();}}
  restartTimer(){if(this.timer)clearInterval(this.timer);if(this.playing)this.timer=setInterval(()=>this.tick(),this.speed);}
  stop(){this.playing=false;if(this.timer){clearInterval(this.timer);this.timer=undefined;}}
  stepOnce(){this.stop();this.tick();}
  reset(sync=true){this.stop();this.sim=createSim(this.p);this.events=[];this.lessons=[];this.result=undefined;if(sync)this.syncUrl();}
  private tick(){
    if(this.done){this.finish();return;}
    const log=step(this.sim);
    for(const e of log.events)this.events.unshift({week:log.week,text:e});
    if(this.events.length>60)this.events.length=60;
    if(this.done)this.finish();
  }
  private finish(){this.stop();this.lessons=insights(this.sim);if(this.challenge)this.result=this.challenge.check(this.sim);
    if(!this.sim.finished&&this.sim.week>=80)this.events.unshift({week:this.sim.week,text:'Stopped after 80 weeks: the project is not converging. Try different settings.'});}

  /** Project setup changes restart the run (like changing the dataset in TensorFlow Playground). */
  setup<K extends keyof Params>(key:K,value:Params[K]){this.p={...this.p,[key]:typeof this.p[key]==='number'?Number(value):value};this.leaveChallenge();this.reset();}
  /** Way-of-working changes apply from the next week without restarting. */
  lever(key:Lever,value:number){this.p={...this.p,[key]:Number(value)};this.sim.params={...this.sim.params,[key]:Number(value)};
    if(this.sim.week>0)this.sim.pendingEvents.push(`You changed ${this.leverName(key)} to ${value}${key==='wip'?' per person':key==='creep'||key==='risk'||key==='turnover'?'% / week':'%'}.`);this.syncUrl();}
  setFlag(v:boolean){this.p={...this.p,changeControl:v};this.sim.params={...this.sim.params,changeControl:v};if(this.sim.week>0)this.sim.pendingEvents.push(`You turned change control ${v?'on':'off'}.`);this.syncUrl();}
  add(n:number){addPeople(this.sim,n);}
  pickChallenge(id:string){this.challengeId=id;this.challenge=CHALLENGES.find(c=>c.id===id);if(this.challenge)this.p={...DEFAULT_PARAMS,...this.challenge.params};else this.p={...DEFAULT_PARAMS};this.reset();}
  private leaveChallenge(){if(this.challenge){this.challenge=undefined;this.challengeId='';}}
  newSeed(){return Math.round(Math.random()*1000);}
  private leverName(k:Lever){return ({meetings:'meetings',wip:'WIP',overtime:'overtime',testing:'testing',creep:'scope creep',risk:'risk events',turnover:'turnover'})[k];}

  // ---- URL sharing ----
  private syncUrl(){if(this.urlTimer)clearTimeout(this.urlTimer);this.urlTimer=setTimeout(()=>{
    const qp=this.challenge?{challenge:this.challenge.id}:toQuery(this.p);
    this.router.navigate([],{relativeTo:this.route,queryParams:qp,replaceUrl:true});},300);}
  async copyLink(){this.syncUrl();await new Promise(r=>setTimeout(r,350));
    try{await navigator.clipboard.writeText(location.href);this.copied=true;setTimeout(()=>this.copied=false,2000);}catch{this.copied=false;}}

  // ---- charts ----
  get maxWeek(){return Math.max(this.p.deadline+4,this.sim.week+2,Math.min(80,this.fc??0)+1);}
  get maxScope(){return Math.max(this.p.scope,...this.sim.history.map(h=>h.scope))*1.1;}
  get maxCost(){return Math.max(this.p.budget,this.sim.cost)*1.15;}
  get maxBugs(){return Math.max(10,...this.sim.history.map(h=>h.bugs));}
  get xTicks(){const m=this.maxWeek,s=m<=20?2:m<=40?5:10;const out:number[]=[];for(let t=0;t<=m;t+=s)out.push(t);return out;}
  x(w:number){return 44+w/this.maxWeek*506;}
  y(v:number,max:number){return 200-Math.max(0,Math.min(1,v/max))*190;}
  yGrid(max:number){return [0,.25,.5,.75,1].map(f=>({v:max*f,y:this.y(max*f,max)}));}
  private series(key:'scope'|'done'|'pv'|'ev'|'cost'|'morale'|'fatigue'){
    const start={scope:this.p.scope,done:0,pv:0,ev:0,cost:0,morale:0.8,fatigue:0}[key];
    return [{w:0,v:start},...this.sim.history.map(h=>({w:h.week,v:h[key]}))];
  }
  path(key:'scope'|'done'|'pv'|'ev'|'cost'|'morale'|'fatigue',max:number){
    if(key==='pv'){const pts=[0,this.p.deadline,this.maxWeek].map(w=>({w,v:this.p.budget*Math.min(1,w/this.p.deadline)}));return pts.map((p,i)=>`${i?'L':'M'}${this.x(p.w).toFixed(1)},${this.y(p.v,max).toFixed(1)}`).join(' ');}
    return this.series(key).map((p,i)=>`${i?'L':'M'}${this.x(p.w).toFixed(1)},${this.y(p.v,max).toFixed(1)}`).join(' ');
  }
  area(key:'done',max:number){const s=this.series(key);if(s.length<2)return '';return this.path(key,max)+` L${this.x(s[s.length-1].w).toFixed(1)},200 L${this.x(0)},200 Z`;}
  get capacity(){
    const c=this.last?.capacity;if(!c||c.gross<=0)return [] as {label:string;pct:number;color:string}[];
    const delivered=Math.max(0,c.net-c.bugfix);
    const parts=[{label:'New work',v:delivered,color:'#49cce1'},{label:'Bug fixing',v:c.bugfix,color:'#ff8f8f'},{label:'Testing',v:c.testing,color:'#5fd68a'},{label:'Meetings',v:c.meetings,color:'#7aa7d6'},
      {label:'Communication',v:c.communication,color:'#9b8cff'},{label:'Context switching',v:c.switching,color:'#f6c35b'},{label:'Mentoring',v:c.mentoring,color:'#d38cff'}];
    const used=parts.reduce((s,x)=>s+x.v,0);parts.push({label:'Idle (no work left)',v:Math.max(0,c.gross-used),color:'#2a4a6a'});
    return parts.filter(x=>x.v>0.05).map(x=>({label:x.label,pct:x.v/c.gross*100,color:x.color}));
  }
  // ---- formatting ----
  k(v:number){return v>=1e6?'$'+(v/1e6).toFixed(2)+'M':'$'+Math.round(v/1000)+'k';}
  r0(v:number){return Math.round(v).toLocaleString('en-CA');}
  pc(v:number){return Math.round(v*100)+'%';}
}
