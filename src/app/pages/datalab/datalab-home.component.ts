import {Component,OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {DATALAB_MODULES,DatalabNavComponent,progress,type ModuleId} from './datalab-shared';
import {DATASET} from './datalab-data';
import {SQL_EXERCISES} from './sql-lab-data';
import {EXCEL_EXERCISES} from './excel-lab-data';
import {DAX_QUESTIONS} from './dax-data';
import {PY_EXERCISES} from './python-lab-data';

const TOTALS:Record<ModuleId,number>={sql:SQL_EXERCISES.length,excel:EXCEL_EXERCISES.length,dax:DAX_QUESTIONS.length,python:PY_EXERCISES.length,report:5};

/** PM DataLab overview: the five practice modules and the shared sample dataset. */
@Component({
  standalone:true,selector:'app-datalab-home',imports:[RouterLink,DatalabNavComponent],
  template:`
  <section class="page">
    <app-datalab-nav></app-datalab-nav>
    <header class="page-header"><p class="eyebrow">PM DataLab</p><h1>Data skills practice for project managers and analysts</h1>
      <p class="lead">Practise SQL, Excel, Power BI (DAX), Python and status reporting on one realistic project portfolio. Every exercise is checked instantly in your browser. It's free, with no sign-up, and your progress is saved on this device.</p>
      <div class="actions"><a class="button primary" routerLink="/pm-datalab/sql">Start with SQL</a><button type="button" class="button secondary" (click)="toDataset()">See the dataset</button></div>
    </header>

    <div class="modules">
      @for(m of modules;track m.id;let i=$index){
        <a class="card module" [routerLink]="m.path">
          <span class="step">{{i+1}}</span>
          <h2>{{m.title}}</h2>
          <p class="muted">{{m.blurb}}</p>
          <span class="meter" [attr.aria-label]="count(m.id)+' of '+total(m.id)+' done'"><span [style.width.%]="count(m.id)/total(m.id)*100"></span></span>
          <small>{{count(m.id)}} of {{total(m.id)}} {{m.id==='dax'?'questions':m.id==='report'?'steps':'exercises'}} done</small>
        </a>
      }
    </div>

    <section class="section-block" id="dataset">
      <p class="eyebrow">The dataset</p><h2>One portfolio, five ways to analyse it</h2>
      <p class="lead">Every module uses the same fictional company, Prairie Logistics: 8 projects, 31 tasks, 10 people and 12 risks. Learn a question in SQL, then answer it again in Excel, DAX and Python.</p>
      <div class="tables">
        @for(t of tables;track t.name){<div class="card"><h3>{{t.name}} <small>{{t.rows}} rows</small></h3><p class="cols">{{t.columns}}</p><a class="button secondary small" [href]="'datalab/'+t.name+'.csv'" [attr.download]="t.name+'.csv'">Download {{t.name}}.csv</a></div>}
      </div>
      <div class="card workbook">
        <div><h3>Excel practice workbook</h3><p class="muted">All four tables in one workbook, plus an Exercises sheet with yellow cells to fill in and an Answers sheet with the model formulas. Use it in Excel or Google Sheets.</p></div>
        <a class="button primary" href="datalab/pm-datalab-practice.xlsx" download>Download workbook (.xlsx)</a>
      </div>
      <p class="muted small">For Power BI: load the four CSV files with Get data → Text/CSV. The <a routerLink="/pm-datalab/power-bi-dax">Power BI &amp; DAX</a> page shows the relationships to create.</p>
    </section>

    <section class="section-block">
      <p class="eyebrow">Why this matters</p><h2>Data skills that PMO and BA roles ask for</h2>
      <div class="grid three why">
        <div class="card"><h3>Answer your own questions</h3><p class="muted">SQL and pandas let you pull the numbers yourself instead of waiting for a report.</p></div>
        <div class="card"><h3>Report with confidence</h3><p class="muted">Earned value, RAG rules and risk exposure, calculated correctly and explained clearly.</p></div>
        <div class="card"><h3>Stand out in interviews</h3><p class="muted">Practise the exact tasks hiring managers test for PMO analyst, project analyst and BA roles.</p></div>
      </div>
    </section>
  </section>`,
  styles:[`
    .modules{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem}
    .module{display:flex;flex-direction:column;gap:.5rem;text-decoration:none;color:inherit;transition:border-color .2s,transform .2s}
    .module:hover,.module:focus-visible{border-color:var(--accent);transform:translateY(-2px)}
    .module h2{font-size:1.4rem!important;letter-spacing:-.02em!important;margin:0!important}
    .module p{margin:0;flex:1}
    .step{width:2rem;height:2rem;display:grid;place-items:center;border-radius:8px;background:#14365a;color:var(--accent);font-weight:800}
    .meter{height:6px;background:#0c2b49;border-radius:99px;overflow:hidden}.meter span{display:block;height:100%;background:var(--accent)}
    small{color:var(--muted)}
    .tables{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem;margin:1.5rem 0}
    .tables h3{margin:0 0 .4rem}.tables h3 small{font-weight:500;font-size:.8rem}
    .cols{font-family:Consolas,monospace;font-size:.8rem;color:#bfe9f3;line-height:1.6;word-break:break-word}
    .workbook{display:flex;flex-wrap:wrap;gap:1rem;align-items:center;justify-content:space-between}
    .workbook h3{margin:0 0 .3rem}.workbook p{margin:0;max-width:640px}
    .small{font-size:.9rem;margin-top:1rem}.small a{color:var(--accent)}
    .why h3{margin-top:0}
  `]
})
export class DatalabHomeComponent implements OnInit{
  readonly modules=DATALAB_MODULES;
  readonly tables=Object.entries(DATASET).map(([name,t])=>({name,rows:t.rows.length,columns:t.columns.join(', ')}));
  private counts:Record<string,number>={};
  ngOnInit(){for(const m of DATALAB_MODULES)this.counts[m.id]=progress.get(m.id).length;}
  count(id:ModuleId){return Math.min(this.counts[id]??0,TOTALS[id]);}
  total(id:ModuleId){return TOTALS[id];}
  toDataset(){document.getElementById('dataset')?.scrollIntoView({behavior:'smooth'});}
}
