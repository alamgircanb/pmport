import {Component} from '@angular/core';
import {INTERVIEW_QUESTIONS} from './interview-questions';
@Component({
 selector:'app-pm-jobs-prep',standalone:true,
 template:`
 <section class="prep">
 <img class="banner" src="pm-jobs-prep-banner.jpg" alt="Project management candidate preparing for a professional interview" width="1942" height="809">
 <header><p class="eyebrow">Prepare · Practice · Succeed</p><h1>PM JOBS Prep</h1><p>51 behavioral interview questions with sample STAR answers for program and project managers.</p></header>
 <p class="tip">Use these sample answers as a starting point. Adapt each story to your own experience and results.</p>
 <label for="question-search">Find a question</label>
 <input id="question-search" type="search" placeholder="Search questions and answers…" (input)="search=$any($event.target).value">
 <p aria-live="polite">{{filtered.length}} of 51 questions</p>
 @for(category of categories;track category){
 @if(group(category).length){
 <section class="category"><h2>{{category}}</h2>
 @for(item of group(category);track item.id){
 <details><summary><span class="number">{{item.id}}</span>{{item.question}}</summary>
 <div class="answer"><h3>Sample STAR answer</h3>
 <dl><dt>Situation</dt><dd>{{item.situation}}</dd><dt>Task</dt><dd>{{item.task}}</dd><dt>Action</dt><dd>{{item.action}}</dd><dt>Result</dt><dd>{{item.result}}</dd></dl>
 </div></details>}
 </section>}}
 @if(!filtered.length){<p>No matching questions. Try another keyword.</p>}
 </section>`,
 styles:[`
 .prep{max-width:1100px;margin:auto;padding:24px}
 .banner{display:block;width:100%;height:clamp(180px,30vw,350px);object-fit:cover;border-radius:18px}
 header{margin:30px 0 20px}h1{font-size:clamp(2rem,5vw,3rem);margin:8px 0}
 .eyebrow{color:#147d8b;font-weight:700;letter-spacing:.08em}.tip{padding:16px;background:#eef6f8;border-left:4px solid #147d8b;border-radius:8px;color:#153c4d}
 label{display:block;font-weight:700;margin:24px 0 8px}input{box-sizing:border-box;width:100%;padding:14px;border:1px solid #8198aa;border-radius:8px;font:inherit}
 .category{margin:32px 0}h2{font-size:1.4rem}details{margin:12px 0;border:1px solid #d4e1e7;border-radius:12px;background:#fff;color:#173349}
 summary{cursor:pointer;padding:18px;font-weight:650;line-height:1.6}summary:focus-visible,input:focus-visible{outline:3px solid #147d8b;outline-offset:3px}
 .number{display:inline-block;min-width:32px;color:#147d8b}.answer{padding:0 22px 20px}h3{font-size:1rem}
 dt{font-weight:700;color:#147d8b;margin-top:16px}dd{margin:6px 0;line-height:1.75}
 @media(max-width:600px){.prep{padding:16px}.answer{padding:0 16px 16px}summary{padding:14px}}
 `]
})
export class PMJobsPrepComponent{
 search='';
 readonly categories=[...new Set(INTERVIEW_QUESTIONS.map(item=>item.category))];
 get filtered(){const query=this.search.trim().toLowerCase();return INTERVIEW_QUESTIONS.filter(item=>[item.category,item.question,item.situation,item.task,item.action,item.result].join(' ').toLowerCase().includes(query));}
 group(category:string){return this.filtered.filter(item=>item.category===category);}
}
