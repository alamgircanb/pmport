import {Component,OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {CALC_STYLES,CalcMoreComponent,num,pct} from './calc-shared';
import {monteCarlo,type McResult} from './calc-math';

@Component({
  standalone:true,selector:'app-monte-carlo',imports:[FormsModule,RouterLink,CalcMoreComponent],
  template:`
  <section class="page calc">
    <a routerLink="/pm-calculators" class="back">← Calculators</a>
    <header class="calc-head"><p class="eyebrow">Free PM calculator · Schedule risk</p><h1>Monte Carlo Schedule Simulator</h1>
      <p class="lead">Enter three-point estimates for tasks done one after another. The simulator runs thousands of random scenarios and shows how likely you are to finish by any date: P50, P80, P90 and the chance of meeting your deadline.</p></header>
    <div class="card">
      <div class="table-wrap"><table class="grid-input">
        <thead><tr><th>Task</th><th>Optimistic</th><th>Most likely</th><th>Pessimistic</th><th></th></tr></thead>
        <tbody>@for(t of tasks;track $index;let i=$index){<tr>
          <td><input [(ngModel)]="t.name" [attr.aria-label]="'Task '+(i+1)+' name'"></td>
          <td><input type="number" min="0" [(ngModel)]="t.o" [attr.aria-label]="'Task '+(i+1)+' optimistic'"></td>
          <td><input type="number" min="0" [(ngModel)]="t.m" [attr.aria-label]="'Task '+(i+1)+' most likely'"></td>
          <td><input type="number" min="0" [(ngModel)]="t.p" [attr.aria-label]="'Task '+(i+1)+' pessimistic'"></td>
          <td><button type="button" (click)="remove(i)" [attr.aria-label]="'Remove task '+(i+1)">✕</button></td></tr>}</tbody>
      </table></div>
      <div class="row-actions"><button type="button" class="button secondary small" (click)="add()">+ Add task</button></div>
      <div class="inputs opts">
        <label>Distribution <select [(ngModel)]="dist"><option value="pert">Beta-PERT (recommended)</option><option value="triangular">Triangular</option></select></label>
        <label>Simulations <select [(ngModel)]="runs"><option [ngValue]="1000">1,000</option><option [ngValue]="10000">10,000</option><option [ngValue]="50000">50,000</option></select></label>
        <label>Deadline (total units) <input type="number" min="0" [(ngModel)]="deadline"></label>
      </div>
      <div class="row-actions"><button type="button" class="button primary" (click)="run()">Run simulation</button></div>
      @if(error){<p class="verdict">{{error}}</p>}
    </div>
    @if(result){
      <div class="results" style="margin-top:1rem" aria-live="polite">
        <div class="r"><span>Single-point plan</span><strong>{{num(result.deterministic,1)}}</strong><small>Sum of most likely values</small></div>
        <div class="r"><span>P50 (median)</span><strong>{{num(result.p50,1)}}</strong><small>50% chance to finish by this</small></div>
        <div class="r warn"><span>P80</span><strong>{{num(result.p80,1)}}</strong><small>Common commitment level</small></div>
        <div class="r"><span>P90</span><strong>{{num(result.p90,1)}}</strong></div>
        <div class="r" [class.good]="chance>=0.8" [class.warn]="chance<0.8&&chance>=0.5" [class.bad]="chance<0.5"><span>Chance to meet deadline</span><strong>{{pct(chance,0)}}</strong><small>Deadline: {{deadline}}</small></div>
        <div class="r"><span>Range</span><strong>{{num(result.min,1)}} – {{num(result.max,1)}}</strong><small>Across {{result.runs.toLocaleString('en-CA')}} runs</small></div>
      </div>
      <div class="card hist-card">
        <p class="eyebrow">Distribution of total duration</p>
        <div class="hist" role="img" [attr.aria-label]="'Histogram of simulated durations from '+num(result.min,1)+' to '+num(result.max,1)">
          @for(b of result.bins;track $index){<div class="bar" [class.over]="b.from>=deadline" [style.height.%]="b.count/maxBin*100" [title]="num(b.from,1)+'–'+num(b.to,1)+': '+b.count+' runs'"></div>}
        </div>
        <div class="axis"><span>{{num(result.min,1)}}</span><span>{{num(result.max,1)}}</span></div>
        <p class="kbd">Bars past the deadline are shown in red.</p>
      </div>
      <p class="verdict">{{verdict}}</p>
    }
    <div class="explain">
      <h2>Why use Monte Carlo for schedules?</h2>
      <p>Adding up "most likely" estimates gives a plan that you will usually miss, because delays add up faster than savings. Monte Carlo simulation picks a random duration for every task, within your optimistic and pessimistic range, thousands of times. The result is a probability curve: how likely you are to finish by each possible date.</p>
      <div class="formula">Each run: total = Σ random(Oᵢ, Mᵢ, Pᵢ)<br>P80 = the value 80% of runs finish within</div>
      <h3>How to use the results</h3>
      <ul><li><strong>Commit to P80 or P90</strong> for external dates, and plan internally to P50.</li>
        <li>The gap between the single-point plan and P80 is a good basis for <strong>schedule contingency</strong>.</li>
        <li>If the chance of meeting the deadline is low, look at the tasks with the widest ranges first. Reducing their uncertainty helps most.</li></ul>
      <h3>Limits of this simulator</h3>
      <p>Tasks are treated as one sequence with no parallel paths, and as independent of each other. Real schedules have parallel paths that merge, which makes delays even more likely. For networks of tasks, find the critical path with the <a routerLink="/pm-tools/pert-cpm">PERT/CPM tool</a> first, then simulate that path here.</p>
      <p>Related: <a routerLink="/pm-glossary/monte-carlo-simulation">Monte Carlo simulation</a>, <a routerLink="/pm-glossary/quantitative-risk-analysis">quantitative risk analysis</a>, <a routerLink="/pm-calculators/pert-three-point-estimate-calculator">PERT estimate calculator</a>.</p>
    </div>
    <app-calc-more current="monte-carlo-schedule-simulator"></app-calc-more>
  </section>`,
  styles:[CALC_STYLES+`
    .opts{grid-template-columns:repeat(auto-fit,minmax(180px,1fr));margin-top:1rem}
    .hist-card{margin-top:1rem}.hist{display:flex;align-items:flex-end;gap:3px;height:180px;border-bottom:1px solid #3b5874}
    .bar{flex:1;background:var(--accent);border-radius:3px 3px 0 0;min-height:1px}.bar.over{background:#e5585b}
    .axis{display:flex;justify-content:space-between;color:var(--muted);font-size:.8rem;margin-top:.3rem}.kbd{font-size:.8rem;color:var(--muted)}
  `]
})
export class MonteCarloComponent implements OnInit{
  tasks=[{name:'Requirements',o:8,m:10,p:16},{name:'Design',o:6,m:8,p:14},{name:'Build',o:15,m:20,p:35},{name:'Testing',o:8,m:10,p:20},{name:'Deployment',o:2,m:3,p:6}];
  dist:'pert'|'triangular'='pert';runs=10000;deadline=55;
  result?:McResult;error='';maxBin=1;
  get chance(){return this.result?this.result.probabilityBy(+this.deadline):0;}
  readonly num=num;readonly pct=pct;
  ngOnInit(){this.run();}
  add(){this.tasks=[...this.tasks,{name:'',o:1,m:2,p:4}];}
  remove(i:number){this.tasks=this.tasks.filter((_,j)=>j!==i);}
  run(){
    const t=this.tasks.map(x=>({name:x.name,o:+x.o,m:+x.m,p:+x.p}));
    if(!t.length){this.error='Add at least one task.';return;}
    const bad=t.findIndex(x=>!(x.o>=0&&x.o<=x.m&&x.m<=x.p));
    if(bad>=0){this.error=`Task ${bad+1}: optimistic must be ≤ most likely ≤ pessimistic.`;return;}
    this.error='';this.result=monteCarlo(t,+this.runs,this.dist,Date.now()%100000);
    this.maxBin=Math.max(...this.result.bins.map(b=>b.count));
  }
  get verdict(){const r=this.result!;
    return `Your single-point plan of ${num(r.deterministic,1)} has only about a ${pct(r.probabilityBy(r.deterministic),0)} chance of being met. To be 80% confident, plan for ${num(r.p80,1)}: a buffer of ${num(r.p80-r.deterministic,1)} over the single-point plan.`;}
}
