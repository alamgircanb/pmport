import {AsyncPipe} from '@angular/common';
import {Component,inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import {RouterLink} from '@angular/router';
import {map,tap} from 'rxjs';
import {ContentService} from '../../core/services/content.service';
import {TrainingModule,TrainingVideo} from '../../core/models/portfolio.models';
import {buildQuestionBank,PracticeQuestion,PracticeQuestionType} from './pm-question-bank';

@Component({
  standalone:true,selector:'app-pm-faciliter',imports:[AsyncPipe,FormsModule,RouterLink],
  template:`
    <section class="page">
      <header class="page-header"><p class="eyebrow">PM Faciliter</p><h1>Learn by doing.</h1><p class="lead">Training modules combine organized YouTube lessons with quizzes, sequencing, diagrams, project-math practice and a 100-question practice bank.</p></header>
      @if(modules$|async;as modules){
        <div class="module-tabs scroll-list" tabindex="0">@for(m of modules;track m.id){<button type="button" [class.active]="selected?.id===m.id" (click)="choose(m)"><small>{{m.level}}</small><strong>{{m.title}}</strong><span>{{m.videos.length}} videos</span></button>}</div>
        @if(selected;as m){
          <div class="learning-grid">
            <article class="card lesson"><span class="eyebrow">{{m.level}} module</span><h2>{{m.title}}</h2><p class="muted">{{m.summary}}</p>
              @if(activeVideo?.youtubeVideoId){<iframe [src]="embed(activeVideo!.youtubeVideoId)" [title]="activeVideo!.title" allowfullscreen></iframe>}@else{<div class="empty-frame">Add YouTube IDs to <code>public/data/pm-faciliter-modules.json</code></div>}
              <div class="video-scroll scroll-list" tabindex="0">@for(v of sortedVideos(m.videos);track v.title){<button type="button" (click)="activeVideo=v"><span>▶</span>{{v.title}} <small>{{v.duration}}</small></button>}@empty{<p class="empty">No videos yet. Add videos to this module’s JSON array.</p>}</div>
            </article>
            <aside class="practice card"><span class="eyebrow">Practice lab</span><h3>Quick quiz</h3><p>{{m.quiz.question}}</p>
              @for(option of m.quiz.options;track option;let i=$index){<label class="option"><input type="radio" name="quiz" [value]="i" [(ngModel)]="quizAnswer"> {{option}}</label>}
              <button class="button small secondary" type="button" (click)="checkQuiz(m)">Check answer</button>@if(feedback){<p class="status">{{feedback}}</p>}
              <h3>Sequence the work</h3><p class="muted">Use the arrows to arrange the steps.</p>
              @for(step of steps;track step;let i=$index){<div class="step"><span>{{i+1}}. {{step}}</span><span><button type="button" (click)="move(i,-1)" aria-label="Move up">↑</button><button type="button" (click)="move(i,1)" aria-label="Move down">↓</button></span></div>}
              <h3>Calculation</h3><p>{{m.calculation.question}}</p><div class="calc"><input type="number" step="0.01" [(ngModel)]="calculation"><button class="button small secondary" type="button" (click)="checkCalculation(m)">Check</button></div>@if(calcFeedback){<p class="status">{{calcFeedback}}</p>}
              <h3>Make a diagram</h3><div class="calc"><input [(ngModel)]="nodeText" placeholder="Add a process node"><button class="button small secondary" type="button" (click)="addNode()">Add</button></div><div class="diagram">@for(node of nodes;track $index){<span>{{node}}</span>}</div>
              <a class="button primary member" routerLink="/pm-faciliter/member">Open member progress</a>
            </aside>
          </div>
        }
      }

      <!-- The mixed bank is independent of the module quiz, so it can grow without changing module data. -->
      <section class="question-bank section-block">
        <div class="bank-heading"><div><p class="eyebrow">Practice bank</p><h2>100 project-management questions</h2><p class="muted">Multiple-choice, dropdown and scenario questions covering delivery, people, business analysis, risk, agile and project calculations.</p></div><div class="score"><strong>{{score}}</strong><span>correct of {{attempted}} attempted</span></div></div>
        <div class="bank-filters">
          <label>Question type<select [(ngModel)]="questionType" (ngModelChange)="applyFilters()"><option value="All">All types</option>@for(type of questionTypes;track type){<option [value]="type">{{type}}</option>}</select></label>
          <label>Topic<select [(ngModel)]="questionCategory" (ngModelChange)="applyFilters()"><option value="All">All topics</option>@for(category of categories;track category){<option [value]="category">{{category}}</option>}</select></label>
        </div>
        @if(currentQuestion;as question){
          <article class="card bank-card">
            <div class="question-meta"><span>Question {{currentIndex+1}} of {{filteredQuestions.length}}</span><span>{{question.type}} · {{question.category}}</span></div>
            <h3>{{question.question}}</h3>
            @if(question.type==='Dropdown'){
              <label class="dropdown-answer">Select your answer<select [(ngModel)]="practiceAnswer"><option [ngValue]="null">Choose an answer</option>@for(option of question.options;track option;let i=$index){<option [ngValue]="i">{{option}}</option>}</select></label>
            }@else{
              <div class="answer-grid">@for(option of question.options;track option;let i=$index){<label class="option"><input type="radio" name="practice-answer" [value]="i" [(ngModel)]="practiceAnswer"> {{option}}</label>}</div>
            }
            <div class="bank-actions"><button class="button primary" type="button" [disabled]="practiceAnswer===null||practiceChecked" (click)="checkPractice(question)">Check answer</button><button class="button secondary" type="button" (click)="nextQuestion()">Next question</button><button class="button secondary" type="button" (click)="previousQuestion()">Previous</button></div>
            @if(practiceFeedback){<p class="status" [class.error]="practiceAnswer!==question.answer"><strong>{{practiceFeedback}}</strong><br>{{question.explanation}}</p>}
          </article>
        }@else{<p class="empty">No questions match those filters.</p>}
      </section>
    </section>
  `,
  styles:[`
    .module-tabs{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(230px,1fr);gap:.8rem;overflow-x:auto;padding-bottom:.7rem}.module-tabs button{display:grid;gap:.35rem;text-align:left;border:1px solid var(--line);border-radius:14px;background:#0a2039;color:#fff;padding:1rem;cursor:pointer}.module-tabs button.active{border-color:var(--accent)}.module-tabs small,.module-tabs span{color:var(--muted)}
    .learning-grid{display:grid;grid-template-columns:1.35fr .65fr;gap:1rem;margin-top:1.2rem}.lesson iframe,.empty-frame{width:100%;aspect-ratio:16/9;border:0;border-radius:12px;background:#03101f;margin:1rem 0}.empty-frame{display:grid;place-items:center;text-align:center;color:var(--muted);padding:1rem}.video-scroll{max-height:310px}.video-scroll button{width:100%;text-align:left;background:none;color:#fff;border:0;border-top:1px solid var(--line);padding:.9rem;cursor:pointer}.video-scroll small{float:right;color:var(--muted)}
    .practice h3{margin-top:1.8rem}.option{display:block;padding:.65rem;border-radius:8px;background:#09213b;margin:.4rem 0;cursor:pointer}.step{display:flex;justify-content:space-between;gap:.5rem;border-top:1px solid var(--line);padding:.65rem 0}.step button{background:#12385c;color:#fff;border:0;border-radius:5px;margin-left:.25rem}.calc{display:flex;gap:.5rem}.calc input{min-width:0;flex:1;background:#061a30;color:#fff;border:1px solid var(--line);border-radius:8px;padding:.65rem}.diagram{display:flex;align-items:center;gap:.5rem;overflow-x:auto;margin-top:.8rem}.diagram span{white-space:nowrap;border:1px solid var(--accent);border-radius:8px;padding:.6rem}.diagram span+span:before{content:'→';color:var(--accent);margin-right:.5rem}.member{margin-top:1.5rem}
    .bank-heading{display:flex;justify-content:space-between;align-items:end;gap:2rem}.score{min-width:145px;text-align:center;padding:1rem;border:1px solid var(--line);border-radius:14px;background:#0a2039}.score strong,.score span{display:block}.score strong{font-size:2rem;color:var(--accent)}.score span{font-size:.76rem;color:var(--muted)}.bank-filters{display:flex;gap:.8rem;margin:1.2rem 0}.bank-filters label,.dropdown-answer{display:grid;gap:.4rem;color:#b8cada;font-size:.8rem;font-weight:700}.bank-filters select,.dropdown-answer select{min-width:210px;background:#061a30;color:#fff;border:1px solid #315370;border-radius:9px;padding:.72rem}.bank-card{max-width:900px}.question-meta{display:flex;justify-content:space-between;gap:1rem;color:var(--accent);font-size:.78rem}.bank-card h3{font-size:clamp(1.15rem,2vw,1.45rem);line-height:1.45;margin:1.2rem 0}.answer-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.35rem}.bank-actions{display:flex;flex-wrap:wrap;gap:.6rem;margin-top:1.2rem}
    @media(max-width:900px){.learning-grid{grid-template-columns:1fr}}@media(max-width:650px){.bank-heading{align-items:stretch;flex-direction:column}.score{text-align:left}.bank-filters{display:grid}.bank-filters select{width:100%}.answer-grid{grid-template-columns:1fr}.bank-actions{display:grid}.bank-actions .button{width:100%}.question-meta{display:grid;gap:.3rem}}
  `]
})
export class PMFaciliterComponent{
  private content=inject(ContentService);private sanitizer=inject(DomSanitizer);
  selected?:TrainingModule;activeVideo?:TrainingVideo;quizAnswer:number|null=null;feedback='';calculation:number|null=null;calcFeedback='';steps:string[]=[];nodeText='';nodes:string[]=[];
  modules$=this.content.load<TrainingModule[]>('pm-faciliter-modules.json').pipe(map(items=>items.sort((a,b)=>a.priority-b.priority)),tap(items=>{if(!this.selected&&items[0])this.choose(items[0])}));

  readonly allQuestions=buildQuestionBank();readonly questionTypes:PracticeQuestionType[]=['Multiple choice','Dropdown','Scenario'];
  readonly categories=[...new Set(this.allQuestions.map(question=>question.category))].sort();
  filteredQuestions=[...this.allQuestions];questionType='All';questionCategory='All';currentIndex=0;practiceAnswer:number|null=null;practiceFeedback='';practiceChecked=false;attempted=0;score=0;
  get currentQuestion(){return this.filteredQuestions[this.currentIndex];}

  choose(module:TrainingModule){this.selected=module;this.activeVideo=this.sortedVideos(module.videos)[0];this.steps=[...module.steps].reverse();this.feedback='';this.calcFeedback='';this.quizAnswer=null;}
  sortedVideos(videos:TrainingVideo[]){return [...videos].sort((a,b)=>a.priority-b.priority);}
  embed(id:string){return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube-nocookie.com/embed/'+id);}
  checkQuiz(module:TrainingModule){this.feedback=this.quizAnswer===module.quiz.answer?'Correct — well done.':'Not yet. Review the lesson and try again.';}
  checkCalculation(module:TrainingModule){this.calcFeedback=Math.abs(Number(this.calculation)-module.calculation.answer)<.001?`Correct: ${module.calculation.answer} ${module.calculation.unit}`:'Check the formula and try again.';}
  move(index:number,direction:number){const next=index+direction;if(next<0||next>=this.steps.length)return;[this.steps[index],this.steps[next]]=[this.steps[next],this.steps[index]];}
  addNode(){if(this.nodeText.trim()){this.nodes.push(this.nodeText.trim());this.nodeText='';}}
  applyFilters(){this.filteredQuestions=this.allQuestions.filter(question=>(this.questionType==='All'||question.type===this.questionType)&&(this.questionCategory==='All'||question.category===this.questionCategory));this.currentIndex=0;this.resetPracticeAnswer();}
  checkPractice(question:PracticeQuestion){if(this.practiceAnswer===null||this.practiceChecked)return;this.practiceChecked=true;this.attempted++;if(this.practiceAnswer===question.answer){this.score++;this.practiceFeedback='Correct.';}else{this.practiceFeedback=`Not quite. Correct answer: ${question.options[question.answer]}.`;}}
  nextQuestion(){if(!this.filteredQuestions.length)return;this.currentIndex=(this.currentIndex+1)%this.filteredQuestions.length;this.resetPracticeAnswer();}
  previousQuestion(){if(!this.filteredQuestions.length)return;this.currentIndex=(this.currentIndex-1+this.filteredQuestions.length)%this.filteredQuestions.length;this.resetPracticeAnswer();}
  private resetPracticeAnswer(){this.practiceAnswer=null;this.practiceFeedback='';this.practiceChecked=false;}
}
