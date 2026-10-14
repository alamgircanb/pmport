import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {CALCULATORS} from './calc-shared';

@Component({
  standalone:true,selector:'app-calculators-hub',imports:[RouterLink],
  template:`
  <section class="page">
    <header class="page-header"><p class="eyebrow">PM Calculators</p><h1>Free project management calculators</h1>
      <p class="lead">Quick, accurate calculators for the numbers project managers and business analysts use every week: earned value, PERT estimates, risk EMV, business case NPV and ROI, Monte Carlo schedule risk, sprint capacity and communication channels. Each one explains the formula with a worked example. No sign-up needed.</p></header>
    <div class="calc-grid">
      @for(c of calculators;track c.slug;let i=$index){
        <a class="card calc-card" [routerLink]="'/pm-calculators/'+c.slug"><span class="n">{{i+1}}</span><h2>{{c.title}}</h2><p class="muted">{{c.blurb}}</p><span class="go">Open calculator →</span></a>
      }
    </div>
    <section class="section-block">
      <p class="eyebrow">Also on PMPORT</p><h2>Learn the terms behind the numbers</h2>
      <p class="lead">Not sure what TCPI, float or EMV means? The <a routerLink="/pm-glossary">PM glossary</a> explains more than 200 project management, agile and business analysis terms in plain English, each with an example. Practise the formulas in <a routerLink="/pm-datalab">PM DataLab</a>, and test yourself with the <a routerLink="/pm-faciliter/pmp-exam-simulator">free PMP exam simulator</a>.</p>
    </section>
  </section>`,
  styles:[`
    .calc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1rem}
    .calc-card{display:flex;flex-direction:column;gap:.5rem;text-decoration:none;color:inherit;transition:border-color .2s,transform .2s}
    .calc-card:hover,.calc-card:focus-visible{border-color:var(--accent);transform:translateY(-2px)}
    .calc-card h2{font-size:1.3rem!important;letter-spacing:-.01em!important;margin:0!important;line-height:1.25!important}.calc-card p{margin:0;flex:1}
    .n{width:2rem;height:2rem;display:grid;place-items:center;border-radius:8px;background:#14365a;color:var(--accent);font-weight:800}
    .go{color:var(--accent);font-weight:700}.lead a{color:var(--accent)}
  `]
})
export class CalculatorsHubComponent{readonly calculators=CALCULATORS;}
