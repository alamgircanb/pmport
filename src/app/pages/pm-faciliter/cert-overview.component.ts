import {Component,inject} from '@angular/core';
import {ActivatedRoute,RouterLink} from '@angular/router';
import certs from './certifications.json';

export interface Certification{
  id:string;code:string;name:string;body:string;bodyUrl:string;level:string;eyebrow:string;title:string;lead:string;hero:string;heroAlt:string;
  simulator:string;simulatorLabel:string;facts:{big:string;text:string}[];outline:{name:string;weight:string;items:string}[];
  audience:string;eligibility:string;format:string[];plan:{title:string;text:string}[];related:{label:string;path:string}[];faq:{q:string;a:string}[];
}
export const CERTIFICATIONS=certs as Certification[];

/** Overview page for one certification under Exam Faciliter (PMP, CAPM, ECBA, CBAP, ITIL 5 Foundation). */
@Component({
  standalone:true,selector:'app-cert-overview',imports:[RouterLink],
  template:`
  @if(c;as c){
  <article class="page cert">
    <a routerLink="/pm-faciliter" class="back">← Exam Faciliter</a>
    <header class="cert-hero">
      <img [src]="c.hero" [alt]="c.heroAlt" width="1600" height="900" fetchpriority="high">
      <div class="hero-overlay">
        <p class="eyebrow">{{c.eyebrow}}</p>
        <h1>{{c.title}}</h1>
        <p class="hero-lead">{{c.lead}}</p>
        <div class="hero-actions"><a class="button primary" [routerLink]="c.simulator">{{c.simulatorLabel}}</a></div>
      </div>
    </header>

    <section class="facts">@for(f of c.facts;track f.big){<div class="fact"><strong>{{f.big}}</strong><span>{{f.text}}</span></div>}</section>

    <section class="grid-2">
      <article class="card"><p class="eyebrow">About the certification</p><h2>{{c.name}}</h2>
        <p>Awarded by <a [href]="c.bodyUrl" target="_blank" rel="noopener">{{c.body}}</a>. Level: {{c.level}}.</p>
        <p><strong>Who it is for:</strong> {{c.audience}}</p>
        <p><strong>Eligibility:</strong> {{c.eligibility}}</p>
      </article>
      <article class="card"><p class="eyebrow">Exam format</p><h2>What to expect</h2>
        <ul class="ticks">@for(f of c.format;track f){<li>{{f}}</li>}</ul>
        <a class="button secondary small" [routerLink]="c.simulator">Practise with a full mock exam</a>
      </article>
    </section>

    <section class="card outline"><p class="eyebrow">Exam content</p><h2>What the exam covers</h2>
      @for(o of c.outline;track o.name){<div class="o-row"><div class="o-head"><strong>{{o.name}}</strong><span>{{o.weight}}</span></div><p>{{o.items}}</p></div>}
    </section>

    <section><p class="eyebrow">Study plan</p><h2>A simple way to prepare</h2>
      <div class="plan">@for(p of c.plan;track p.title;let i=$index){<div class="step card"><span class="n">{{i+1}}</span><h3>{{p.title}}</h3><p>{{p.text}}</p></div>}</div>
    </section>

    <section class="cta card"><div><p class="eyebrow">Free practice</p><h2>Five full-length {{c.code}} mock exams</h2><p>Timed like the real exam, with explanations for every answer, results by area and a practice mode to drill weak topics. Your progress is saved in your browser.</p></div><a class="button primary" [routerLink]="c.simulator">{{c.simulatorLabel}}</a></section>

    <section class="grid-2">
      <article class="card"><p class="eyebrow">Keep learning</p><h2>Related on PMPORT</h2><ul class="links">@for(r of c.related;track r.path){<li><a [routerLink]="r.path">{{r.label}}</a></li>}</ul></article>
      <article class="card"><p class="eyebrow">FAQ</p><h2>Common questions</h2>@for(f of c.faq;track f.q){<h3>{{f.q}}</h3><p>{{f.a}}</p>}</article>
    </section>

    <nav class="others" aria-label="Other certifications"><p class="eyebrow">Other certifications</p><div>@for(o of others;track o.id){<a [routerLink]="'/pm-faciliter/'+(o.id==='itil'?'itil-foundation':o.id)">{{o.code}}</a>}</div></nav>
    <p class="note">PMPORT is not affiliated with PMI, IIBA or PeopleCert. Exam details can change; always confirm them with the certification body before you apply. PMP®, CAPM® and PMBOK® are registered marks of Project Management Institute, Inc. IIBA®, BABOK®, CBAP® and ECBA™ are trademarks of the International Institute of Business Analysis. ITIL® is a registered trademark of PeopleCert group.</p>
  </article>
  }`,
  styles:[`
    .cert{max-width:1180px}.back{display:inline-block;margin-bottom:1rem;color:var(--accent);font-weight:700}
    .cert-hero{position:relative;min-height:520px;overflow:hidden;border-radius:24px;margin-bottom:1.5rem;background:#041223}
    .cert-hero>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:75% center}
    .hero-overlay{position:relative;z-index:1;display:flex;min-height:520px;width:58%;padding:clamp(2rem,6vw,4.5rem);flex-direction:column;justify-content:center;background:linear-gradient(90deg,rgba(4,18,35,.97),rgba(4,18,35,.82) 70%,transparent)}
    .hero-overlay h1{font-size:clamp(2.2rem,4.4vw,3.9rem);line-height:1.04;margin:.6rem 0 1rem}
    .hero-lead{font-size:clamp(1.02rem,1.8vw,1.22rem);line-height:1.6;color:#d8e8f5}.hero-actions{margin-top:1rem}
    .facts{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.8rem;margin:0 0 1.5rem}
    .fact{background:#0b2340;border:1px solid var(--line);border-radius:14px;padding:1rem}.fact strong{display:block;font-size:1.9rem;color:#fff}.fact span{color:var(--muted);font-size:.9rem;line-height:1.4;display:block}
    .grid-2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem;margin-bottom:1.5rem}
    .cert section{margin-bottom:1.5rem}.cert h2{font-size:clamp(1.4rem,2.6vw,2rem)!important;margin:.2rem 0 .8rem!important;letter-spacing:-.01em}
    .cert p,.cert li{line-height:1.75;color:#c9d9e7}.cert a:not(.button){color:var(--accent)}
    .ticks{padding-left:1.1rem}.links{padding-left:1.1rem}.links li{margin:.3rem 0}
    .o-row{padding:.8rem 0;border-top:1px solid var(--line)}.o-head{display:flex;justify-content:space-between;gap:1rem}.o-head span{color:var(--accent);font-weight:800;white-space:nowrap}.o-row p{margin:.3rem 0 0}
    .plan{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:.8rem}.step h3{margin:.2rem 0 .4rem;font-size:1.05rem}.step p{margin:0;font-size:.95rem}
    .n{display:inline-grid;place-items:center;width:30px;height:30px;border-radius:50%;background:var(--accent);color:#041223;font-weight:800}
    .cta{display:flex;justify-content:space-between;align-items:center;gap:1.5rem;flex-wrap:wrap}.cta p{margin:0;max-width:640px}
    .others div{display:flex;gap:.5rem;flex-wrap:wrap}.others a{border:1px solid #315370;border-radius:999px;padding:.45rem .9rem;font-weight:700;color:#d9eef7!important;background:#0b2340}
    .note{font-size:.85rem!important;color:#8aa2b8!important;margin-top:2rem}
    @media(max-width:800px){.cert-hero,.hero-overlay{min-height:560px}.hero-overlay{width:100%;justify-content:flex-end;background:linear-gradient(0deg,rgba(4,18,35,.99),rgba(4,18,35,.75) 60%,rgba(4,18,35,.08))}.facts{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-2{grid-template-columns:minmax(0,1fr)}}
  `]
})
export class CertOverviewComponent{
  private route=inject(ActivatedRoute);
  readonly c=CERTIFICATIONS.find(x=>x.id===this.route.snapshot.data['cert']);
  readonly others=CERTIFICATIONS.filter(x=>x.id!==this.c?.id);
}
