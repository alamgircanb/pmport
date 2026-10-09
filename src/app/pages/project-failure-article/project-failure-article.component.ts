import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';

type FailureCause={title:string;detail:string;signal:string;prevent:string};
type FailureTheme={id:string;number:string;label:string;title:string;start:number;causes:FailureCause[]};

@Component({
  standalone:true,
  selector:'app-project-failure-article',
  imports:[RouterLink],
  template:`
  <article class="page failure-article">
    <a routerLink="/resources" class="back">← PM Knowledge Lake</a>

    <header class="article-hero">
      <img src="project-failure-causes.webp" alt="Project team studying a holographic project path that breaks under warning signs and then recovers toward a summit">
      <div class="hero-overlay">
        <p class="eyebrow">Project delivery · Lessons learned</p>
        <h1>Top 21 Causes of Project Failure</h1>
        <p class="hero-lead">Why projects break down, the early warning signals, and the practical actions that keep delivery on course.</p>
        <p class="byline">Md Alamgir Hossain, PMP®, CSM®, ITIL® · October 9, 2026 · 14–16 minute read</p>
      </div>
    </header>

    <section class="intro card">
      <p>Projects rarely fail because of one dramatic event. They usually fail slowly, through small gaps in alignment, planning, leadership and governance that compound until recovery becomes expensive or impossible. By the time a project is formally declared “red,” the root causes have often been visible for months.</p>
      <p>This article groups 21 common causes of project failure into seven themes. For each cause, you will find what it looks like, the <strong>early warning signal</strong> to watch for and the <strong>prevention</strong> practice that addresses the root cause instead of the symptom.</p>
      <p><strong>Remember:</strong> failure is not only cancellation. A project also fails when it delivers on time and on budget but does not produce the business value, adoption or benefits that justified the investment.</p>
    </section>

    <nav class="toc card" aria-label="Article contents">
      <p class="eyebrow">In this article</p>
      <div class="toc-grid">@for(theme of themes;track theme.id){<a routerLink="/resources/21-causes-of-project-failure" [fragment]="theme.id">{{theme.number}} · {{theme.title}}</a>}<a routerLink="/resources/21-causes-of-project-failure" fragment="checklist">08 · Prevention Checklist</a></div>
    </nav>

    @for(theme of themes;track theme.id){
      <section [id]="theme.id" class="failure-section">
        <div class="section-heading"><span>{{theme.number}}</span><div><p class="eyebrow">{{theme.label}}</p><h2>{{theme.title}}</h2></div></div>
        <div class="cause-grid">
          @for(cause of theme.causes;track cause.title;let i=$index){
            <article class="cause">
              <div class="cause-head"><span class="cause-number">{{theme.start+i}}</span><h3>{{cause.title}}</h3></div>
              <p>{{cause.detail}}</p>
              <p class="signal"><strong>Warning signal</strong>{{cause.signal}}</p>
              <p class="prevent"><strong>Prevention</strong>{{cause.prevent}}</p>
            </article>
          }
        </div>
      </section>
    }

    <section id="checklist" class="checklist card">
      <p class="eyebrow">Practical tool</p>
      <h2>Project health checklist</h2>
      <p class="muted">Review these questions at initiation, at every phase gate and whenever a project begins to drift. Any “no” deserves a conversation and an owner.</p>
      <ol>@for(q of checklist;track q){<li>{{q}}</li>}</ol>
    </section>

    <section class="patterns">
      <h2>The pattern behind the 21 causes</h2>
      <p>Most of these causes share three roots: <strong>unclear intent</strong> (people do not agree on what success means), <strong>hidden reality</strong> (the true status, risks and constraints are not visible) and <strong>slow decisions</strong> (problems are known but nobody with authority acts in time). Strong project managers attack these roots early—by clarifying value, making work and risk transparent and creating a governance rhythm that turns information into timely decisions.</p>
    </section>

    <section class="golden">
      <p class="eyebrow">Key lesson</p>
      <blockquote>Projects seldom fail suddenly. They fail quietly, one ignored signal at a time. Make problems visible early, address their root causes and keep every decision connected to business value.</blockquote>
    </section>

    <footer class="disclaimer"><p>PMPORT is an independent project-management learning platform. PMP® and PMI® are registered marks of Project Management Institute, Inc. This educational article reflects practitioner experience and common project-management guidance; it is not endorsed by or affiliated with PMI.</p><a routerLink="/resources" class="button primary">Back to PM Knowledge Lake</a></footer>
  </article>`,
  styles:[`
    .failure-article{max-width:1180px}.back{display:inline-block;margin-bottom:1rem;color:var(--accent);font-weight:700}
    .article-hero{position:relative;min-height:590px;overflow:hidden;border-radius:24px;margin-bottom:2rem;background:#071a33}.article-hero>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:70% center}
    .hero-overlay{position:relative;z-index:1;display:flex;min-height:590px;width:58%;padding:clamp(2rem,6vw,5rem);flex-direction:column;justify-content:center;background:linear-gradient(90deg,rgba(4,18,35,.97),rgba(4,18,35,.8) 70%,transparent);color:#fff}
    .hero-overlay h1{font-size:clamp(2.4rem,5vw,4.6rem);line-height:1.02;margin:.7rem 0 1rem}.hero-lead{font-size:clamp(1.05rem,2vw,1.35rem);line-height:1.6;color:#d8e8f5}.byline{font-size:.88rem;color:#a9bfd2;line-height:1.6}
    .intro{margin-bottom:2rem}.intro p,.patterns p{font-size:1.05rem;line-height:1.85;color:#c4d4e2}
    .toc{margin-bottom:3rem}.toc-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.75rem}.toc a{padding:.85rem 1rem;border:1px solid var(--line);border-radius:10px;color:#d9eef7;background:#082039}
    .failure-section{padding-top:1rem;margin-bottom:3rem;scroll-margin-top:80px}.section-heading{display:flex;align-items:center;gap:1rem;margin-bottom:1.2rem}.section-heading>span{display:grid;place-items:center;flex:0 0 56px;height:56px;border-radius:16px;background:linear-gradient(135deg,var(--accent),var(--accent-2));color:#041223;font-size:1.15rem;font-weight:800}.section-heading h2{font-size:clamp(1.7rem,3vw,2.5rem);margin:.2rem 0}.section-heading p{margin:0}
    .cause-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}.cause{display:flex;flex-direction:column;gap:.7rem;padding:1.3rem;border:1px solid var(--line);border-radius:14px;background:#0b2340;color:#eaf3fc}
    .cause-head{display:flex;align-items:flex-start;gap:.75rem}.cause-number{display:grid;place-items:center;flex:0 0 36px;height:36px;border-radius:50%;border:2px solid #ff7a6b;color:#ffb3a8;font-weight:800}.cause h3{margin:.2rem 0 0;font-size:1.12rem;line-height:1.35}
    .cause p{margin:0;line-height:1.6;color:#c9d9e7}.cause strong{display:block;margin-bottom:.2rem;font-size:.74rem;letter-spacing:.08em;text-transform:uppercase}.signal{padding:.75rem .9rem;border-left:3px solid #ff7a6b;border-radius:6px;background:rgba(255,122,107,.08)}.signal strong{color:#ff9c90}.prevent{padding:.75rem .9rem;border-left:3px solid var(--accent);border-radius:6px;background:rgba(43,212,196,.07)}.prevent strong{color:var(--accent)}
    .checklist{margin:4rem 0 3rem;scroll-margin-top:80px}.checklist h2,.patterns h2{font-size:clamp(1.8rem,3vw,2.5rem)}.checklist ol{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.6rem 2rem;padding-left:1.4rem}.checklist li{line-height:1.6;color:#d6e4ef}.checklist li::marker{color:var(--accent);font-weight:800}
    .patterns{margin:3rem 0}
    .golden{padding:2.5rem;border-radius:20px;background:linear-gradient(135deg,#10395b,#142a55);margin:3rem 0}.golden blockquote{margin:1.5rem 0 0;padding:1.2rem 1.5rem;border-left:4px solid var(--accent);background:#071a33;color:#dcebf7;line-height:1.7;font-size:clamp(1.2rem,2.4vw,1.7rem);font-weight:700}
    .disclaimer{padding-top:2rem;border-top:1px solid var(--line)}.disclaimer p{max-width:850px;color:#91a8bc;line-height:1.7;font-size:.88rem}.disclaimer .button{margin-top:1rem}
    @media(max-width:1000px){.cause-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
    @media(max-width:800px){.article-hero,.hero-overlay{min-height:640px}.hero-overlay{width:100%;justify-content:flex-end;background:linear-gradient(0deg,rgba(4,18,35,.99),rgba(4,18,35,.72) 60%,rgba(4,18,35,.08))}.toc-grid,.cause-grid,.checklist ol{grid-template-columns:1fr}.section-heading{align-items:flex-start}.golden{padding:1.5rem}}
  `]
})
export class ProjectFailureArticleComponent{
  readonly themes:FailureTheme[]=[
    {id:'strategy',number:'01',label:'Why the project exists',title:'Strategy and Business Case',start:1,causes:[
      {title:'Unclear objectives and success criteria',detail:'The team starts work without a shared, measurable definition of what “done” and “successful” mean, so every stakeholder judges the project against a different standard.',signal:'Different leaders describe the project’s purpose differently, or success is described only as “go live.”',prevent:'Write SMART objectives and measurable success criteria in the charter, and confirm them with the sponsor and key stakeholders before planning begins.'},
      {title:'Weak business case or poor strategic alignment',detail:'The project is approved because of enthusiasm, politics or a technology trend rather than a clear link to organizational strategy and expected benefits.',signal:'Nobody can explain which strategic goal the project supports or how its benefits will be measured.',prevent:'Validate the business case before initiation, connect it to strategic objectives and reassess it at each phase gate when costs or assumptions change.'},
      {title:'Lack of active executive sponsorship',detail:'A sponsor exists on paper but is unavailable, disengaged or unwilling to make decisions, secure resources or remove organizational barriers.',signal:'Escalations wait weeks for a response, and the sponsor rarely attends steering meetings.',prevent:'Agree on the sponsor’s responsibilities at initiation, schedule a regular decision rhythm and escalate early when sponsorship weakens.'}
    ]},
    {id:'scope',number:'02',label:'What will be delivered',title:'Scope and Requirements',start:4,causes:[
      {title:'Poorly defined requirements',detail:'Requirements are vague, incomplete or based on assumptions, so the team builds the wrong thing correctly—and discovers it late.',signal:'Requirements use words such as “user-friendly,” “fast” or “flexible” without acceptance criteria.',prevent:'Use structured elicitation, document clear acceptance criteria, confirm understanding with users and maintain traceability to business objectives.'},
      {title:'Uncontrolled scope creep',detail:'Small additions are accepted informally until the work has grown well beyond the approved scope, budget and schedule.',signal:'Work is being done that nobody can trace to an approved requirement or change request.',prevent:'Baseline the scope, route every change through change control or backlog prioritization and assess each change for schedule, cost, risk and value impact.'},
      {title:'Insufficient customer and user involvement',detail:'The people who will use the product are consulted at the start and the end, but not during delivery, so feedback arrives when change is most expensive.',signal:'Users first see the product during final testing or training.',prevent:'Involve users throughout delivery with demonstrations, prototypes, incremental reviews and clearly identified business representatives.'}
    ]},
    {id:'planning',number:'03',label:'How the work is shaped',title:'Planning and Estimation',start:7,causes:[
      {title:'Unrealistic schedules and estimates',detail:'Deadlines are set by decree or optimism instead of analysis, so the plan is already behind on the first day.',signal:'The schedule has no contingency, and estimates were given by people who will not do the work.',prevent:'Estimate with the people doing the work, use historical data and techniques such as three-point estimating, and include schedule reserves based on risk.'},
      {title:'Inadequate planning and rushed initiation',detail:'Pressure to “start doing” causes teams to skip planning for dependencies, resources, communication, quality and risk.',signal:'There is a start date and an end date, but no clear work breakdown, dependency map or integrated plan.',prevent:'Tailor the planning effort to the project’s complexity, build a work breakdown structure or product backlog and identify critical dependencies before committing.'},
      {title:'Underfunding and weak cost control',detail:'The budget omits real costs—training, integration, change management or reserves—and spending is not tracked against value delivered.',signal:'Spending is reported only as a total, with no comparison to planned value or earned value.',prevent:'Build bottom-up cost estimates, include contingency and management reserves and track cost performance regularly with earned value or burn-rate measures.'}
    ]},
    {id:'people',number:'04',label:'Who does the work',title:'People and Leadership',start:10,causes:[
      {title:'Weak project leadership',detail:'The project manager focuses on administration and status reports instead of leading people, resolving conflicts and driving decisions.',signal:'Problems are recorded but not resolved, and the team is unsure who is actually leading.',prevent:'Assign a project manager with the right experience for the project’s complexity and support servant, situational leadership through coaching and mentoring.'},
      {title:'Resource shortages and overallocation',detail:'Key people are shared across too many initiatives, so project work competes with operational duties and constantly slips.',signal:'The same few experts appear on the critical path of several projects at the same time.',prevent:'Confirm resource commitments with functional managers, use resource leveling and capacity planning and escalate conflicts through portfolio governance.'},
      {title:'Skill gaps and missing expertise',detail:'The team lacks critical technical, domain or delivery skills, and the gap is discovered only when work stalls.',signal:'Tasks repeatedly wait for one external expert, or quality problems cluster around one area.',prevent:'Complete a skills assessment early, plan training or acquisition of expertise and reduce single points of knowledge through pairing and documentation.'}
    ]},
    {id:'stakeholders',number:'05',label:'Engagement and transparency',title:'Stakeholders and Communication',start:13,causes:[
      {title:'Poor communication',detail:'Information is shared too late, with the wrong audience or in the wrong format, causing misunderstandings, duplicated work and surprises.',signal:'Stakeholders learn about project decisions from rumours or are surprised by changes in meetings.',prevent:'Create a communication plan tailored to each audience, use interactive communication for complex topics and confirm understanding rather than only sending messages.'},
      {title:'Stakeholder resistance and disengagement',detail:'Influential stakeholders are overlooked or their concerns are dismissed, and their resistance appears later as delays, objections or withdrawn support.',signal:'Key stakeholders stop attending reviews, or the same objections keep returning.',prevent:'Identify and analyse stakeholders early, understand the reasons behind resistance and engage them continuously—not only at approval points.'},
      {title:'Hidden bad news and “watermelon” reporting',detail:'Status reports remain green on the outside while the project is red on the inside, because people fear blame or want to avoid uncomfortable conversations.',signal:'Every report is green, yet milestones keep moving and the team appears stressed.',prevent:'Report status against objective data, build psychological safety so issues are raised early and present problems with facts, impacts and options.'}
    ]},
    {id:'execution',number:'06',label:'Control and excellence',title:'Risk, Quality and Execution',start:16,causes:[
      {title:'Ignoring risk management',detail:'Risks are listed once for the charter and never revisited, so foreseeable threats become active issues without a planned response.',signal:'The risk register has not changed for weeks, and risks have no owners or triggers.',prevent:'Review risks regularly, assign owners, define triggers and response plans and reserve time and budget for uncertainty.'},
      {title:'Quality sacrificed to meet deadlines',detail:'Testing, reviews and documentation are cut to protect a date, creating defects and rework that cost more than the time saved.',signal:'Testing windows keep shrinking, and defect counts rise toward release.',prevent:'Define quality standards and acceptance criteria early, build quality into the process and never trade essential quality, safety or compliance for schedule.'},
      {title:'Weak monitoring and late detection of variance',detail:'Progress is measured by activity rather than results, so schedule and cost variances are discovered when they are too large to recover.',signal:'Tasks stay “90% complete” for weeks, and there are no leading indicators of performance.',prevent:'Track objective metrics—earned value, burn-up charts, milestone completion—and act on variance thresholds before they become crises.'}
    ]},
    {id:'governance',number:'07',label:'Decisions and adoption',title:'Governance, Approach and Change',start:19,causes:[
      {title:'Weak governance and slow decision-making',detail:'Roles, decision rights and escalation paths are unclear, so decisions are delayed, revisited or made by the wrong people.',signal:'Decisions are repeatedly deferred to the next meeting, or the same decision is reopened several times.',prevent:'Define governance, decision rights and escalation thresholds in the charter, and record decisions with owners and dates in a decision log.'},
      {title:'Wrong delivery approach, technology or vendor',detail:'A predictive, agile or hybrid approach—or a technology or vendor—is chosen by preference or habit instead of by fit with the project’s context.',signal:'The team is fighting its own process, or a vendor is consistently missing commitments.',prevent:'Tailor the delivery approach to uncertainty, complexity and regulation; validate technology through proofs of concept and manage vendors with clear contracts and performance measures.'},
      {title:'Neglecting organizational change and benefits realization',detail:'The solution is delivered, but people do not adopt it because training, communication and process changes were treated as an afterthought.',signal:'Users keep using old workarounds after go-live, and no one owns the expected benefits.',prevent:'Plan change management from the start, prepare and train users, assign benefit owners and measure adoption and benefits after the project closes.'}
    ]}
  ];

  readonly checklist=[
    'Can every key stakeholder describe the same objectives and success criteria?',
    'Is the business case still valid and connected to strategy?',
    'Is the sponsor actively making decisions and removing barriers?',
    'Do requirements have clear, testable acceptance criteria?',
    'Is every change assessed and approved through the agreed process?',
    'Were estimates produced by the people doing the work, with reserves for risk?',
    'Are resource commitments confirmed and free of serious overallocation?',
    'Do status reports reflect objective data rather than optimism?',
    'Is the risk register current, with owners, triggers and responses?',
    'Are quality activities protected from schedule pressure?',
    'Are decision rights and escalation paths clear and working?',
    'Is there a plan—and an owner—for adoption and benefits realization?'
  ];
}
