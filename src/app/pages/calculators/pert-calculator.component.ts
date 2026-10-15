import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {CALC_STYLES,CalcMoreComponent,num} from './calc-shared';
import {pert} from './calc-math';

@Component({
  standalone:true,selector:'app-pert-calculator',imports:[FormsModule,RouterLink,CalcMoreComponent],
  template:`
  <section class="page calc">
    <a routerLink="/pm-calculators" class="back">← Calculators</a>
    <header class="calc-head"><p class="eyebrow">Free PM calculator · Estimating</p><h1>PERT Three-Point Estimate Calculator</h1>
      <p class="lead">Enter optimistic, most likely and pessimistic estimates for a task, in days, hours or dollars. You get the PERT (beta) estimate, the triangular average, the standard deviation and confidence ranges.</p></header>
    <div class="tool">
      <div class="card inputs">
        <label>Optimistic (O) <small>Best case, if everything goes well</small><input type="number" min="0" [(ngModel)]="o" inputmode="decimal"></label>
        <label>Most likely (M) <small>Realistic, normal conditions</small><input type="number" min="0" [(ngModel)]="m" inputmode="decimal"></label>
        <label>Pessimistic (P) <small>Worst realistic case</small><input type="number" min="0" [(ngModel)]="p" inputmode="decimal"></label>
        <label>Unit <input type="text" [(ngModel)]="unit" maxlength="12"></label>
      </div>
      <div>
        @if(valid){
          <div class="results" aria-live="polite">
            <div class="r good"><span>PERT estimate</span><strong>{{num(r.mean)}} {{unit}}</strong><small>(O + 4M + P) ÷ 6</small></div>
            <div class="r"><span>Triangular estimate</span><strong>{{num(r.triangular)}} {{unit}}</strong><small>(O + M + P) ÷ 3</small></div>
            <div class="r"><span>Standard deviation</span><strong>{{num(r.sd)}} {{unit}}</strong><small>(P − O) ÷ 6</small></div>
            <div class="r"><span>Variance</span><strong>{{num(r.variance)}}</strong><small>σ²: add variances to combine tasks</small></div>
            <div class="r"><span>~68% range (±1σ)</span><strong>{{num(r.range68[0],1)}} – {{num(r.range68[1],1)}}</strong></div>
            <div class="r"><span>~95% range (±2σ)</span><strong>{{num(r.range95[0],1)}} – {{num(r.range95[1],1)}}</strong></div>
            <div class="r"><span>~99.7% range (±3σ)</span><strong>{{num(r.range99[0],1)}} – {{num(r.range99[1],1)}}</strong></div>
          </div>
          <p class="verdict">Plan for about {{num(r.mean,1)}} {{unit}}. If you commit to {{num(r.range95[1],1)}} {{unit}} (mean + 2σ), you have roughly a 95% chance of finishing within it, assuming the estimate follows a normal shape.</p>
        }@else{<p class="verdict">Enter values where optimistic ≤ most likely ≤ pessimistic.</p>}
      </div>
    </div>
    <div class="explain">
      <h2>What is a PERT three-point estimate?</h2>
      <p>PERT (Program Evaluation and Review Technique) handles uncertainty by asking for three estimates instead of one. The weighted average gives the most likely value four times the weight of the extremes. The standard deviation shows how uncertain the estimate is.</p>
      <div class="formula">PERT (beta) mean = (O + 4M + P) ÷ 6<br>Triangular mean = (O + M + P) ÷ 3<br>Standard deviation σ = (P − O) ÷ 6 &nbsp;·&nbsp; Variance = σ²</div>
      <h3>Worked example</h3>
      <p>A data migration could take 4 days if all goes well, most likely 6 days, and 14 days in the worst case. PERT = (4 + 24 + 14) ÷ 6 = 7 days. The triangular average is 8 days. σ = (14 − 4) ÷ 6 ≈ 1.67 days, so there is about a 95% chance of finishing between 3.7 and 10.3 days.</p>
      <h3>Combining several tasks</h3>
      <p>For tasks in sequence, add their PERT means to get the total. To get the total standard deviation, add the <strong>variances</strong> (not the standard deviations) and take the square root. For a full picture of many uncertain tasks, use the <a routerLink="/pm-calculators/monte-carlo-schedule-simulator">Monte Carlo schedule simulator</a>. For a network of tasks with dependencies, use the <a routerLink="/pm-tools/pert-cpm">PERT/CPM critical path tool</a>.</p>
      <p>Related terms: <a routerLink="/pm-glossary/pert">PERT</a>, <a routerLink="/pm-glossary/three-point-estimate">three-point estimate</a>, <a routerLink="/pm-glossary/standard-deviation">standard deviation</a>.</p>
    </div>
    <app-calc-more current="pert-three-point-estimate-calculator"></app-calc-more>
  </section>`,
  styles:[CALC_STYLES]
})
export class PertCalculatorComponent{
  o=4;m=6;p=14;unit='days';
  readonly num=num;
  get valid(){return +this.o>=0&&+this.o<=+this.m&&+this.m<=+this.p&&+this.p>+this.o;}
  get r(){return pert(+this.o,+this.m,+this.p);}
}
