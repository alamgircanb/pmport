import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {CALC_STYLES,CalcMoreComponent,money,num,pct} from './calc-shared';
import {finance} from './calc-math';

@Component({
  standalone:true,selector:'app-npv-calculator',imports:[FormsModule,RouterLink,CalcMoreComponent],
  template:`
  <section class="page calc">
    <a routerLink="/pm-calculators" class="back">← PM Calculators</a>
    <header class="calc-head"><p class="eyebrow">Free PM calculator · Business case</p><h1>NPV, ROI, IRR &amp; Payback Calculator</h1>
      <p class="lead">Build the numbers for a business case. Enter the initial investment, the yearly net benefits and your discount rate. You get net present value, ROI, internal rate of return, payback and discounted payback.</p></header>
    <div class="tool">
      <div class="card inputs">
        <label>Initial investment ($) <input type="number" min="0" [(ngModel)]="investment" inputmode="decimal"></label>
        <label>Discount rate (%) <small>Your organization's cost of capital or hurdle rate</small><input type="number" step="0.5" [(ngModel)]="rate" inputmode="decimal"></label>
        <div><table class="grid-input"><thead><tr><th>Year</th><th>Net cash flow ($)</th><th></th></tr></thead>
          <tbody>@for(f of flows;track $index;let i=$index){<tr><td>{{i+1}}</td><td><input type="number" [(ngModel)]="flows[i]" [attr.aria-label]="'Year '+(i+1)+' cash flow'"></td><td><button type="button" (click)="remove(i)" [attr.aria-label]="'Remove year '+(i+1)">✕</button></td></tr>}</tbody></table>
          <div class="row-actions"><button type="button" class="button secondary small" (click)="add()">+ Add year</button></div></div>
      </div>
      <div>
        <div class="results" aria-live="polite">
          <div class="r" [class.good]="r.npv>=0" [class.bad]="r.npv<0"><span>Net present value (NPV)</span><strong>{{money(r.npv)}}</strong><small>{{r.npv>=0?'Adds value at this rate':'Destroys value at this rate'}}</small></div>
          <div class="r" [class.good]="r.roi>=0" [class.bad]="r.roi<0"><span>ROI</span><strong>{{pct(r.roi)}}</strong><small>(Total benefit − investment) ÷ investment</small></div>
          <div class="r"><span>IRR</span><strong>{{r.irr===null?'n/a':pct(r.irr)}}</strong><small>Rate where NPV = 0</small></div>
          <div class="r"><span>Payback period</span><strong>{{r.payback===null?'Not within period':num(r.payback,1)+' years'}}</strong></div>
          <div class="r"><span>Discounted payback</span><strong>{{r.discountedPayback===null?'Not within period':num(r.discountedPayback,1)+' years'}}</strong></div>
          <div class="r"><span>Total benefit</span><strong>{{money(r.totalBenefit)}}</strong><small>Undiscounted</small></div>
        </div>
        <p class="verdict">{{verdict}}</p>
      </div>
    </div>
    <div class="explain">
      <h2>How to read these business case numbers</h2>
      <p><strong>Net present value</strong> converts future benefits into today's dollars using a discount rate, then subtracts the investment. A positive NPV means the project earns more than your cost of capital. It is the measure most finance teams prefer.</p>
      <div class="formula">NPV = Σ [ Cash flowₜ ÷ (1 + r)ᵗ ] − Initial investment<br>ROI = (Total benefits − Investment) ÷ Investment<br>IRR = the rate r where NPV = 0</div>
      <p><strong>IRR</strong> is the break-even discount rate. If it is higher than your hurdle rate, the project is attractive. <strong>Payback</strong> is how long it takes to earn back the investment; <strong>discounted payback</strong> does the same using discounted cash flows, so it is always longer.</p>
      <h3>Worked example</h3>
      <p>A new customer portal costs $500,000 and saves $200,000 a year for four years. At an 8% discount rate, NPV ≈ $162,425, ROI = 60%, IRR ≈ 21.9%, payback = 2.5 years and discounted payback ≈ 2.9 years. These are the default values above.</p>
      <h3>Comparing projects</h3>
      <p>When choosing between projects, pick the higher NPV. IRR can mislead when projects differ in size or timing, and payback ignores benefits that arrive after the payback point. Remember that benefits must be realized after delivery, so track them in a <a routerLink="/pm-glossary/benefits-register">benefits register</a>.</p>
      <p>Related: <a routerLink="/pm-glossary/net-present-value-npv">NPV</a>, <a routerLink="/pm-glossary/internal-rate-of-return-irr">IRR</a>, <a routerLink="/pm-glossary/return-on-investment-roi">ROI</a>, <a routerLink="/pm-glossary/payback-period">payback period</a>, <a routerLink="/pm-glossary/business-case">business case</a>.</p>
    </div>
    <app-calc-more current="npv-roi-payback-calculator"></app-calc-more>
  </section>`,
  styles:[CALC_STYLES]
})
export class NpvCalculatorComponent{
  investment=500000;rate=8;flows:number[]=[200000,200000,200000,200000];
  readonly money=money;readonly num=num;readonly pct=pct;
  get r(){return finance(+this.investment||0,this.flows.map(f=>+f||0),(+this.rate||0)/100);}
  get verdict(){const r=this.r;
    return r.npv>=0?`At ${this.rate}% the project creates about ${money(r.npv)} of value in today's dollars${r.irr!==null?` and returns ${pct(r.irr)} a year (IRR)`:''}. It pays back ${r.payback===null?'after the period shown':'in '+num(r.payback,1)+' years'}.`
      :`At ${this.rate}% the project does not cover its cost of capital (NPV ${money(r.npv)}). Look for more benefits, lower costs or a phased approach.`;}
  add(){this.flows=[...this.flows,this.flows[this.flows.length-1]??0];}
  remove(i:number){this.flows=this.flows.filter((_,j)=>j!==i);}
  trackYear(i:number){return i;}
}
