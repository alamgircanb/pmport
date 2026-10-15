import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {CALC_STYLES,CalcMoreComponent,money,num,pct} from './calc-shared';
import {evm} from './calc-math';

@Component({
  standalone:true,selector:'app-evm-calculator',imports:[FormsModule,RouterLink,CalcMoreComponent],
  template:`
  <section class="page calc">
    <a routerLink="/pm-calculators" class="back">← Calculators</a>
    <header class="calc-head"><p class="eyebrow">Free PM calculator · Cost</p><h1>Earned Value (EVM) Calculator</h1>
      <p class="lead">Enter your budget at completion, planned value, earned value and actual cost. You get every earned value metric (CV, SV, CPI, SPI, EAC, ETC, VAC and TCPI) with a plain-English summary of where your project stands.</p></header>
    <div class="tool">
      <div class="card inputs">
        <label>Budget at completion (BAC) <small>Total approved budget</small><input type="number" min="0" [(ngModel)]="bac" inputmode="decimal"></label>
        <label>Planned value (PV) <small>Budget for work scheduled to date</small><input type="number" min="0" [(ngModel)]="pv" inputmode="decimal"></label>
        <label>Earned value (EV) <small>Budget for work actually done (BAC × % complete)</small><input type="number" min="0" [(ngModel)]="ev" inputmode="decimal"></label>
        <label>Actual cost (AC) <small>What the work done has actually cost</small><input type="number" min="0" [(ngModel)]="ac" inputmode="decimal"></label>
      </div>
      <div>
        <div class="results" aria-live="polite">
          <div class="r" [class.good]="r.cv>=0" [class.bad]="r.cv<0"><span>Cost variance (CV)</span><strong>{{money(r.cv)}}</strong><small>{{r.cv<0?'Over budget':'Under or on budget'}}</small></div>
          <div class="r" [class.good]="r.sv>=0" [class.bad]="r.sv<0"><span>Schedule variance (SV)</span><strong>{{money(r.sv)}}</strong><small>{{r.sv<0?'Behind schedule':'Ahead or on schedule'}}</small></div>
          <div class="r" [class.good]="r.cpi>=1" [class.warn]="r.cpi<1&&r.cpi>=0.9" [class.bad]="r.cpi<0.9"><span>CPI</span><strong>{{num(r.cpi)}}</strong><small>EV ÷ AC</small></div>
          <div class="r" [class.good]="r.spi>=1" [class.warn]="r.spi<1&&r.spi>=0.9" [class.bad]="r.spi<0.9"><span>SPI</span><strong>{{num(r.spi)}}</strong><small>EV ÷ PV</small></div>
          <div class="r"><span>EAC (BAC ÷ CPI)</span><strong>{{money(r.eacCpi)}}</strong><small>If current cost performance continues</small></div>
          <div class="r"><span>EAC (AC + BAC − EV)</span><strong>{{money(r.eacAtypical)}}</strong><small>If the variance was a one-off</small></div>
          <div class="r"><span>EAC (CPI × SPI)</span><strong>{{money(r.eacCpiSpi)}}</strong><small>If cost and schedule both drive the rest</small></div>
          <div class="r"><span>ETC</span><strong>{{money(r.etc)}}</strong><small>EAC − AC: cost to finish</small></div>
          <div class="r" [class.good]="r.vac>=0" [class.bad]="r.vac<0"><span>VAC</span><strong>{{money(r.vac)}}</strong><small>BAC − EAC</small></div>
          <div class="r" [class.bad]="r.tcpiBac>1.1" [class.warn]="r.tcpiBac>1&&r.tcpiBac<=1.1"><span>TCPI (to hit BAC)</span><strong>{{num(r.tcpiBac)}}</strong><small>Efficiency needed on remaining work</small></div>
          <div class="r"><span>% complete / % spent</span><strong>{{pct(r.percentComplete,0)}} / {{pct(r.percentSpent,0)}}</strong><small>EV ÷ BAC and AC ÷ BAC</small></div>
        </div>
        <p class="verdict">{{verdict}}</p>
      </div>
    </div>

    <div class="explain">
      <h2>How earned value works</h2>
      <p>Earned value management (EVM) compares three numbers at a status date: what you planned to do (planned value), what you actually did, valued at its budget (earned value), and what it actually cost (actual cost). Comparing them shows whether a project is ahead or behind schedule and over or under budget, and forecasts the final cost.</p>
      <div class="formula">CV = EV − AC &nbsp;·&nbsp; SV = EV − PV<br>CPI = EV ÷ AC &nbsp;·&nbsp; SPI = EV ÷ PV<br>EAC = BAC ÷ CPI &nbsp;·&nbsp; ETC = EAC − AC &nbsp;·&nbsp; VAC = BAC − EAC<br>TCPI = (BAC − EV) ÷ (BAC − AC)</div>
      <h3>Worked example</h3>
      <p>A CRM upgrade has a budget (BAC) of $250,000. By the status date, $187,500 of work was planned (PV). The team has finished 68% of the work, so EV = $170,000, and has spent $182,000 (AC). CV = −$12,000 and SV = −$17,500: the project is over budget and behind schedule. CPI = 0.93, so each dollar spent earns about 93 cents of work. If that continues, EAC = $250,000 ÷ 0.934 ≈ $267,650, about $17,650 over budget. These are the default values in the calculator above.</p>
      <h3>Which EAC formula should I use?</h3>
      <ul>
        <li><strong>BAC ÷ CPI</strong> when the current cost performance is expected to continue. This is the most common.</li>
        <li><strong>AC + (BAC − EV)</strong> when the variance was a one-off and the rest of the work will go to plan.</li>
        <li><strong>AC + (BAC − EV) ÷ (CPI × SPI)</strong> when both cost and schedule problems will affect the remaining work.</li>
      </ul>
      <h3>How to read CPI and SPI</h3>
      <p>A value of 1.0 means exactly on plan. Below 1.0 is unfavourable: over budget for CPI, behind schedule for SPI. Above 1.0 is favourable. A TCPI above about 1.1 means the remaining work must be done far more efficiently than so far, which is rarely realistic. Consider re-baselining or asking for more budget.</p>
      <p>Learn the terms: <a routerLink="/pm-glossary/earned-value-management-evm">earned value management</a>, <a routerLink="/pm-glossary/cost-performance-index-cpi">CPI</a>, <a routerLink="/pm-glossary/schedule-performance-index-spi">SPI</a>, <a routerLink="/pm-glossary/estimate-at-completion-eac">EAC</a> and <a routerLink="/pm-glossary/to-complete-performance-index-tcpi">TCPI</a>. Practise EVM formulas in the <a routerLink="/pm-datalab/excel">DataLab Excel lab</a>.</p>
    </div>
    <app-calc-more current="earned-value-calculator"></app-calc-more>
  </section>`,
  styles:[CALC_STYLES]
})
export class EvmCalculatorComponent{
  bac=250000;pv=187500;ev=170000;ac=182000;
  readonly money=money;readonly num=num;readonly pct=pct;
  get r(){return evm(+this.bac||0,+this.pv||0,+this.ev||0,+this.ac||0);}
  get verdict(){
    const r=this.r;if(!(+this.bac>0))return 'Enter a budget at completion to begin.';
    const cost=!isFinite(r.cpi)?'no cost has been recorded yet':r.cpi>=1?`under budget (CPI ${num(r.cpi)})`:`over budget (CPI ${num(r.cpi)})`;
    const time=!isFinite(r.spi)?'no work was planned yet':r.spi>=1?`ahead of or on schedule (SPI ${num(r.spi)})`:`behind schedule (SPI ${num(r.spi)})`;
    return `The project is ${cost} and ${time}. If current cost performance continues, it will finish at about ${money(r.eacCpi)}, which is ${r.vac>=0?money(r.vac)+' under':money(-r.vac)+' over'} budget.`;
  }
}
