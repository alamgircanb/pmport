import {Component,OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {DatalabNavComponent,LAB_STYLES,progress} from './datalab-shared';
import {DAX_QUESTIONS,type DaxQuestion} from './dax-data';

/** PM DataLab, Power BI & DAX module: case-style DAX questions with explanations. */
@Component({
  standalone:true,selector:'app-dax-lab',imports:[RouterLink,DatalabNavComponent],
  template:`
  <section class="page">
    <app-datalab-nav></app-datalab-nav>
    <header class="lab-head"><p class="eyebrow">PM DataLab · Power BI & DAX</p><h1>Power BI & DAX</h1>
      <p class="lead">Twenty case-style questions on the DAX you need for project dashboards: measures vs columns, iterators, CALCULATE, filter context, relationships and time intelligence. All questions use the same project data model.</p></header>
    <div class="lab">
      <aside class="ex-list" aria-label="DAX questions">
        <p class="progress-line">{{correct.length}} of {{questions.length}} answered correctly</p>
        @for(g of groups;track g.topic){
          <h3>{{g.topic}}</h3>
          @for(q of g.items;track q.id){<button type="button" [class.active]="q.id===current.id" (click)="open(q)"><span class="tick">{{correct.includes(q.id)?'✓':''}}</span><span class="num">{{index(q)+1}}.</span><span>{{short(q)}}</span></button>}
        }
      </aside>
      <div class="task">
        <p class="eyebrow">{{current.topic}} · Question {{index(current)+1}} of {{questions.length}}</p>
        <h2 class="q">{{current.question}}</h2>
        @if(current.code){<pre class="code">{{current.code}}</pre>}
        <div class="options" role="radiogroup" [attr.aria-label]="'Answers for question '+(index(current)+1)">
          @for(o of current.options;track $index){
            <button type="button" role="radio" [attr.aria-checked]="picked===$index" [disabled]="picked!==null"
              [class.right]="picked!==null&&$index===current.answer" [class.wrong]="picked===$index&&$index!==current.answer" (click)="pick($index)">
              <span class="letter">{{letters[$index]}}</span><span class="opt">{{o}}</span></button>
          }
        </div>
        @if(picked!==null){
          <div class="feedback" [class.ok]="picked===current.answer" [class.bad]="picked!==current.answer" role="status">
            <strong>{{picked===current.answer?'Correct.':'Not quite. The answer is '+letters[current.answer]+'.'}}</strong> {{current.explanation}}</div>
        }
        <div class="nav-row">
          <button type="button" class="button secondary small" (click)="step(-1)" [disabled]="index(current)===0">‹ Previous</button>
          @if(picked!==null&&index(current)<questions.length-1){<button type="button" class="button primary small" (click)="step(1)">Next question ›</button>}
          @else{<button type="button" class="button secondary small" (click)="step(1)" [disabled]="index(current)===questions.length-1">Next ›</button>}
        </div>
        <details class="panel"><summary>Practise in Power BI Desktop</summary>
          <p class="muted">Download the four CSV files from the <a routerLink="/pm-datalab">PM DataLab overview</a> and load them into Power BI Desktop (Get data → Text/CSV). Create these relationships, then build the measures from the questions:</p>
          <pre class="code">Projects[project_id]   1 ─ * Tasks[project_id]
Projects[project_id]   1 ─ * Risks[project_id]
Resources[resource_id] 1 ─ * Tasks[owner_id]
'Date'[Date]           1 ─ * Tasks[end_date]   (Date = CALENDARAUTO(), mark as date table)</pre>
          <p class="muted">Try building a one-page portfolio dashboard: cards for Budget, EV, AC, CPI and SPI; a bar chart of CPI by project; a table of open risks by EMV; and a slicer for department.</p>
        </details>
        <button type="button" class="button secondary small" (click)="reset()">Reset my answers</button>
      </div>
    </div>
  </section>`,
  styles:[LAB_STYLES+`
    h2.q{font-size:clamp(1.25rem,2.4vw,1.6rem)!important;line-height:1.35!important;letter-spacing:-.01em!important}
    .options{display:grid;gap:.55rem;margin:1rem 0}
    .options button{display:flex;gap:.8rem;align-items:flex-start;text-align:left;background:#0b2340;color:#e6f0f8;border:1px solid var(--line);border-radius:10px;padding:.8rem .9rem;cursor:pointer;line-height:1.5}
    .options button:hover:not(:disabled){border-color:var(--accent)}
    .options button:disabled{cursor:default}
    .options button.right{border-color:#2f8a5f;background:#0f3b2b}
    .options button.wrong{border-color:#8a3a4e;background:#401c2a}
    .letter{flex:none;width:1.7rem;height:1.7rem;display:grid;place-items:center;border-radius:6px;background:#14365a;font-weight:800;color:var(--accent)}
    .opt{font-family:inherit}
  `]
})
export class DaxLabComponent implements OnInit{
  readonly questions=DAX_QUESTIONS;
  readonly groups=[...new Set(DAX_QUESTIONS.map(q=>q.topic))].map(topic=>({topic,items:DAX_QUESTIONS.filter(q=>q.topic===topic)}));
  readonly letters=['A','B','C','D'];current:DaxQuestion=DAX_QUESTIONS[0];picked:number|null=null;correct:string[]=[];

  ngOnInit(){this.correct=progress.get('dax');const first=DAX_QUESTIONS.find(q=>!this.correct.includes(q.id));if(first)this.open(first);}
  index(q:DaxQuestion){return this.questions.indexOf(q);}
  short(q:DaxQuestion){const s=q.question.replace(/\s+/g,' ');return s.length>58?s.slice(0,56)+'…':s;}
  open(q:DaxQuestion){this.current=q;this.picked=null;}
  step(d:number){const i=this.index(this.current)+d;if(this.questions[i])this.open(this.questions[i]);}
  pick(i:number){if(this.picked!==null)return;this.picked=i;if(i===this.current.answer)this.correct=progress.mark('dax',this.current.id);}
  reset(){progress.clear('dax');this.correct=[];this.open(DAX_QUESTIONS[0]);}
}
