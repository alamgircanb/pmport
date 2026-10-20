import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';

interface Step{label:string;path:string;note:string}
interface Path{id:string;eyebrow:string;title:string;intro:string;steps:Step[];action:string;actionPath:string}

/** First-visit guide: three short paths through PMPORT, depending on what the visitor needs today. */
@Component({standalone:true,selector:'app-start-here',imports:[RouterLink],template:`
<section class="page">
  <header class="page-header"><p class="eyebrow">Start here</p><h1>New to PMPORT? Pick your path.</h1>
    <p class="lead">PMPORT is a free place to learn, practise and use project management, business analysis and data skills. Choose the path that matches what you need today. Each one takes three steps.</p></header>
  <div class="paths">
    @for(p of paths;track p.id){<article class="card path" [attr.aria-labelledby]="'path-'+p.id">
      <p class="eyebrow">{{p.eyebrow}}</p><h2 [id]="'path-'+p.id">{{p.title}}</h2><p class="muted">{{p.intro}}</p>
      <ol>@for(s of p.steps;track s.path){<li><a [routerLink]="s.path">{{s.label}}</a><span>{{s.note}}</span></li>}</ol>
      <a class="button primary" [routerLink]="p.actionPath">{{p.action}}</a>
    </article>}
  </div>
  <section class="section-block more"><h2>Everything else</h2>
    <p class="muted">Browse the <a routerLink="/pm-glossary">glossary</a> for plain-English definitions, watch short <a routerLink="/media">videos</a>, practise with real project data in <a routerLink="/pm-datalab">DataLab</a>, or prepare for interviews with <a routerLink="/pm-jobs-prep">Job prep</a>. Press <kbd>/</kbd> on any page to search.</p></section>
</section>`,styles:[`
.paths{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}
.path{display:flex;flex-direction:column}
.path h2{font-size:1.5rem;letter-spacing:-.02em;margin:0 0 .5rem}
.path ol{margin:1rem 0 1.5rem;padding-left:1.3rem;display:grid;gap:.8rem}
.path li a{color:#8fe8f5;font-weight:700;text-decoration:none}.path li a:hover{text-decoration:underline}
.path li span{display:block;color:#9db1c7;font-size:.9rem;line-height:1.5;margin-top:.15rem}
.path .button{margin-top:auto;align-self:flex-start}
.more h2{font-size:1.6rem}.more a{color:#8fe8f5}
kbd{padding:.1rem .4rem;border:1px solid #315370;border-radius:6px;background:#071a30;font-size:.85rem}
@media(max-width:900px){.paths{grid-template-columns:1fr}}
`]})
export class StartHereComponent{
  readonly paths:Path[]=[
    {id:'exam',eyebrow:'Certification',title:'I’m preparing for an exam',intro:'PMP, CAPM, ECBA, CBAP or ITIL 5 Foundation. Practise under real exam conditions, then fix your weak areas.',
      steps:[
        {label:'Follow the PMP 8-week study plan',path:'/resources/pmp-study-guide-8-week-plan',note:'What to study each week, and when to take mock exams.'},
        {label:'Take a timed mock exam',path:'/pm-faciliter',note:'Full-length simulators with explanations for every answer.'},
        {label:'Review the 111 PMP mindsets',path:'/resources/111-essential-pmp-mindsets',note:'How PMI expects a project manager to think on situational questions.'}],
      action:'Choose your exam',actionPath:'/pm-faciliter'},
    {id:'learn',eyebrow:'Learning',title:'I’m new to project management',intro:'Build the vocabulary and the core ideas first, then see how they work on a real project.',
      steps:[
        {label:'Learn the key terms in the glossary',path:'/pm-glossary',note:'Over 200 terms in plain English, each with an example.'},
        {label:'Read why projects fail',path:'/resources/21-causes-of-project-failure',note:'The 21 most common causes, and how to prevent each one.'},
        {label:'Try the project simulations',path:'/pm-playground',note:'Play with delivery, Kanban flow, risk and change, and watch the results week by week.'}],
      action:'Start learning',actionPath:'/pm-glossary'},
    {id:'tools',eyebrow:'Work',title:'I need a template or calculator now',intro:'Free, ready-to-use tools for real project work. No sign-up needed.',
      steps:[
        {label:'Project templates',path:'/pm-tools',note:'Charter, WBS, RAID log, status report and more.'},
        {label:'Project calculators',path:'/pm-calculators',note:'Earned value, PERT, risk EMV, NPV/ROI, Monte Carlo and more.'},
        {label:'Critical path (PERT / CPM)',path:'/pm-tools/pert-cpm',note:'Enter activities and dependencies to find the critical path.'}],
      action:'Open the tools',actionPath:'/pm-tools'},
  ];
}
