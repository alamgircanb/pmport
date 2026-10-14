import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {CALC_STYLES,CalcMoreComponent,money} from './calc-shared';
import {emv,type RiskRow} from './calc-math';

@Component({
  standalone:true,selector:'app-emv-calculator',imports:[FormsModule,RouterLink,CalcMoreComponent],
  template:`
  <section class="page calc">
    <a routerLink="/pm-calculators" class="back">← PM Calculators</a>
    <header class="calc-head"><p class="eyebrow">Free PM calculator · Risk</p><h1>Risk EMV Calculator</h1>
      <p class="lead">List your risks with their probability and cost impact. The calculator gives the expected monetary value (EMV) of each one, the total for threats and opportunities, and a suggested contingency reserve.</p></header>
    <div class="card">
      <div class="table-wrap"><table class="grid-input">
        <thead><tr><th>Risk</th><th>Type</th><th>Probability %</th><th>Impact ($)</th><th>EMV</th><th></th></tr></thead>
        <tbody>@for(row of rows;track $index;let i=$index){<tr>
          <td><input [(ngModel)]="row.name" [attr.aria-label]="'Risk '+(i+1)+' name'"></td>
          <td><select [(ngModel)]="row.type" [attr.aria-label]="'Risk '+(i+1)+' type'"><option value="threat">Threat</option><option value="opportunity">Opportunity</option></select></td>
          <td><input type="number" min="0" max="100" [(ngModel)]="row.pct" [attr.aria-label]="'Risk '+(i+1)+' probability'"></td>
          <td><input type="number" min="0" [(ngModel)]="row.impact" [attr.aria-label]="'Risk '+(i+1)+' impact'"></td>
          <td>{{money(result.items[i].emv)}}</td>
          <td><button type="button" (click)="remove(i)" [attr.aria-label]="'Remove risk '+(i+1)">✕</button></td></tr>}</tbody>
      </table></div>
      <div class="row-actions"><button type="button" class="button secondary small" (click)="add()">+ Add risk</button></div>
    </div>
    <div class="results" style="margin-top:1rem" aria-live="polite">
      <div class="r bad"><span>Threats EMV</span><strong>{{money(result.threats)}}</strong></div>
      <div class="r good"><span>Opportunities EMV</span><strong>{{money(result.opportunities)}}</strong></div>
      <div class="r"><span>Net EMV</span><strong>{{money(result.net)}}</strong></div>
      <div class="r warn"><span>Suggested contingency</span><strong>{{money(result.contingency)}}</strong><small>Covers the net expected threat exposure</small></div>
    </div>
    <div class="explain">
      <h2>What is expected monetary value?</h2>
      <p>Expected monetary value (EMV) puts a dollar figure on uncertainty. For each risk, multiply the probability that it happens by its financial impact. Threats have a negative EMV and opportunities a positive one. Adding them gives the overall risk exposure of the project, a common basis for the contingency reserve.</p>
      <div class="formula">EMV = Probability × Impact<br>Net EMV = Σ opportunity EMVs − Σ threat EMVs</div>
      <h3>Worked example</h3>
      <p>A 70% chance that a supplier delays delivery, costing $150,000, has an EMV of −$105,000. A 20% chance of a $20,000 saving from a new software release has an EMV of +$4,000. The net exposure is −$101,000, so a contingency reserve of about $101,000 covers the expected cost of these risks.</p>
      <h3>Good practice</h3>
      <ul><li>Use EMV for individual risks you have identified (known unknowns). Unknown unknowns are covered by the management reserve.</li>
        <li>Review probabilities and impacts regularly, and close risks that have passed.</li>
        <li>EMV is an average. A single large threat can still hit in full, so plan responses for high-impact risks even if their EMV is small.</li></ul>
      <p>Related: <a routerLink="/pm-glossary/expected-monetary-value-emv">EMV</a>, <a routerLink="/pm-glossary/contingency-reserve">contingency reserve</a>, <a routerLink="/pm-glossary/decision-tree">decision tree</a>, <a routerLink="/pm-glossary/risk-response-strategies">risk response strategies</a>.</p>
    </div>
    <app-calc-more current="risk-emv-calculator"></app-calc-more>
  </section>`,
  styles:[CALC_STYLES+`.grid-input td:nth-child(1){min-width:200px}.grid-input td:nth-child(5){white-space:nowrap;font-weight:700;color:#fff}`]
})
export class EmvCalculatorComponent{
  readonly money=money;
  rows=[{name:'Supplier delivers conveyor late',type:'threat',pct:70,impact:150000},{name:'Integration vendor unavailable',type:'threat',pct:50,impact:90000},
    {name:'Data quality issues delay migration',type:'threat',pct:60,impact:40000},{name:'New platform release saves build time',type:'opportunity',pct:20,impact:20000}] as {name:string;type:'threat'|'opportunity';pct:number;impact:number}[];
  get result(){return emv(this.rows.map(r=>({name:r.name,type:r.type,probability:Math.min(100,Math.max(0,+r.pct||0))/100,impact:+r.impact||0} as RiskRow)));}
  add(){this.rows=[...this.rows,{name:'',type:'threat',pct:10,impact:0}];}
  remove(i:number){this.rows=this.rows.filter((_,j)=>j!==i);}
}
