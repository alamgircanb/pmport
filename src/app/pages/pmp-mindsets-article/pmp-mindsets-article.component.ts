import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';

type MindsetSection={id:string;number:string;label:string;title:string;start:number;items:string[]};

@Component({
  standalone:true,
  selector:'app-pmp-mindsets-article',
  imports:[RouterLink],
  template:`
  <article class="page mindset-article">
    <a routerLink="/resources" class="back">← PM Knowledge Lake</a>

    <header class="article-hero">
      <img src="pmp-111-mindsets.webp" alt="Project leader and collaborative team progressing toward project management excellence">
      <div class="hero-overlay">
        <p class="eyebrow">PMP exam preparation</p>
        <h1>111 Essential PMP Mindsets for Exam Excellence</h1>
        <p class="hero-lead">Think like a project leader. Choose the best answer. Approach situational questions with confidence.</p>
        <p class="byline">Md Alamgir Hossain, PMP®, CSM®, ITIL® · October 3, 2026 · 15–18 minute read</p>
      </div>
    </header>

    <section class="intro card">
      <p>PMP situational questions rarely test memorization alone. They assess whether a candidate can understand a situation, engage the appropriate people, apply the correct process and make an accountable decision.</p>
      <p><strong>Important:</strong> These mindsets are decision guides, not absolute rules. Immediate threats involving safety, ethics, law, security or compliance may require action before detailed analysis.</p>
    </section>

    <nav class="toc card" aria-label="Article contents">
      <p class="eyebrow">In this article</p>
      <div class="toc-grid">@for(section of sections;track section.id){<a routerLink="/resources/111-essential-pmp-mindsets" [fragment]="section.id">{{section.number}} · {{section.title}}</a>}</div>
    </nav>

    @for(section of sections;track section.id){
      <section [id]="section.id" class="mindset-section">
        <div class="section-heading"><span>{{section.number}}</span><div><p class="eyebrow">{{section.label}}</p><h2>{{section.title}}</h2></div></div>
        <ol class="mindset-grid" [start]="section.start">@for(item of section.items;track $index){<li>{{item}}</li>}</ol>
      </section>
    }

    <section class="decision-formula card">
      <p class="eyebrow">Master PMP decision sequence</p>
      <h2>Use this sequence for situational questions</h2>
      <div class="formula">@for(step of decisionSequence;track step){<span>{{step}}</span>}</div>
      <blockquote>When safety, ethics, law, security or regulatory compliance is immediately threatened, protect people and contain the danger first—then analyze and document.</blockquote>
    </section>

    <section class="choice-guide">
      <h2>When two answers appear correct</h2>
      <p>Usually choose the answer that investigates before reacting, addresses the root cause, involves the appropriate people, follows governance, protects value and quality, avoids unnecessary escalation and includes follow-up monitoring.</p>
    </section>

    <section class="danger card">
      <p class="eyebrow">Exam warning signs</p>
      <h2>Seven dangerous answer patterns</h2>
      <ol><li>Immediately escalate to the sponsor.</li><li>Replace or punish a team member.</li><li>Implement an unapproved change.</li><li>Ignore the process to save time.</li><li>Hide bad news from stakeholders.</li><li>Make a unilateral decision that belongs to the team or product owner.</li><li>Sacrifice ethics, safety, compliance or quality to protect the schedule.</li></ol>
    </section>

    <section class="golden">
      <p class="eyebrow">Golden PMP mindset</p>
      <blockquote>First understand the situation and its root cause; then collaborate with the appropriate people, follow the applicable process, protect project value and take accountable action.</blockquote>
    </section>

    <footer class="disclaimer"><p>PMPORT is an independent project-management learning platform. PMP®, PMBOK® Guide and PMI® are registered marks of Project Management Institute, Inc. This educational article is not endorsed by or affiliated with PMI.</p><a routerLink="/resources" class="button primary">Back to PM Knowledge Lake</a></footer>
  </article>`,
  styles:[`
    .mindset-article{max-width:1180px}.back{display:inline-block;margin-bottom:1rem;color:var(--accent);font-weight:700}.article-hero{position:relative;min-height:590px;overflow:hidden;border-radius:24px;margin-bottom:2rem;background:#071a33}.article-hero>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.hero-overlay{position:relative;z-index:1;display:flex;min-height:590px;width:62%;padding:clamp(2rem,6vw,5rem);flex-direction:column;justify-content:center;background:linear-gradient(90deg,rgba(4,18,35,.98),rgba(4,18,35,.83) 68%,transparent);color:#fff}.hero-overlay h1{font-size:clamp(2.4rem,5vw,4.8rem);line-height:1.02;margin:.7rem 0 1rem}.hero-lead{font-size:clamp(1.05rem,2vw,1.35rem);line-height:1.6;color:#d8e8f5}.byline{font-size:.88rem;color:#a9bfd2;line-height:1.6}.intro{margin-bottom:2rem}.intro p,.choice-guide p{font-size:1.05rem;line-height:1.85;color:#c4d4e2}.toc{margin-bottom:3rem}.toc-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.75rem}.toc a{padding:.85rem 1rem;border:1px solid var(--line);border-radius:10px;color:#d9eef7;background:#082039}.mindset-section{padding-top:1rem;margin-bottom:3rem;scroll-margin-top:80px}.section-heading{display:flex;align-items:center;gap:1rem;margin-bottom:1.2rem}.section-heading>span{display:grid;place-items:center;flex:0 0 56px;height:56px;border-radius:16px;background:linear-gradient(135deg,var(--accent),var(--accent-2));color:#041223;font-size:1.15rem;font-weight:800}.section-heading h2{font-size:clamp(1.7rem,3vw,2.5rem);margin:.2rem 0}.section-heading p{margin:0}.mindset-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem;padding-left:0;list-style-position:inside}.mindset-grid li{padding:1.15rem 1.25rem;border:1px solid var(--line);border-radius:14px;background:#0b2340;color:#eaf3fc;line-height:1.55}.mindset-grid li::marker{color:var(--accent);font-weight:800}.decision-formula{margin:4rem 0 3rem}.decision-formula h2,.danger h2,.choice-guide h2{font-size:clamp(1.8rem,3vw,2.5rem)}.formula{display:flex;flex-wrap:wrap;gap:.65rem;margin:1.5rem 0}.formula span{padding:.65rem 1rem;border-radius:999px;background:var(--accent);color:#041223;font-weight:800}.decision-formula blockquote,.golden blockquote{margin:1.5rem 0 0;padding:1.2rem 1.5rem;border-left:4px solid var(--accent);background:#071a33;color:#dcebf7;line-height:1.7}.choice-guide{margin:3rem 0}.danger{margin:3rem 0}.danger li{padding:.55rem 0;line-height:1.6;color:#d6e4ef}.golden{padding:2.5rem;border-radius:20px;background:linear-gradient(135deg,#10395b,#142a55);margin:3rem 0}.golden blockquote{font-size:clamp(1.25rem,2.5vw,1.8rem);font-weight:700}.disclaimer{padding-top:2rem;border-top:1px solid var(--line)}.disclaimer p{max-width:850px;color:#91a8bc;line-height:1.7;font-size:.88rem}.disclaimer .button{margin-top:1rem}@media(max-width:800px){.article-hero,.hero-overlay{min-height:680px}.hero-overlay{width:100%;justify-content:flex-end;background:linear-gradient(0deg,rgba(4,18,35,.99),rgba(4,18,35,.72) 60%,rgba(4,18,35,.08))}.toc-grid,.mindset-grid{grid-template-columns:1fr}.section-heading{align-items:flex-start}.golden{padding:1.5rem}}
  `]
})
export class PmpMindsetsArticleComponent{
  readonly decisionSequence=['Assess','Analyze','Review','Collaborate','Evaluate','Decide','Act','Document','Communicate','Monitor'];
  readonly sections:MindsetSection[]=[
    {id:'core',number:'01',label:'PMP decision-making',title:'Core Situational Mindset',start:1,items:[
      'Assess before acting.','Understand the situation before selecting a response.','Identify the root cause instead of treating only the symptom.','Review relevant plans, agreements and records before deciding.','Gather facts rather than relying on assumptions.','Determine whether you are dealing with a risk, issue, change or defect.','Consider the project context before applying a method.','Tailor the response to the project’s complexity, urgency and risk.','Choose proactive prevention over reactive correction.','Take ownership instead of immediately transferring the problem.','Do not ignore a problem and hope it disappears.','Address problems early, while they are still manageable.','Prefer a sustainable solution over a convenient temporary fix.','Consider downstream consequences before acting.','Protect people, value, quality and relationships when choosing an answer.'
    ]},
    {id:'leadership',number:'02',label:'People and responsibility',title:'Leadership and Accountability',start:16,items:[
      'Lead through service, support and facilitation.','Coach before commanding.','Empower people to make decisions within their authority.','Maintain accountability even when authority is shared.','Remove impediments that prevent the team from succeeding.','Shield the team from unnecessary interruptions.','Create psychological safety for raising concerns.','Listen actively before forming a conclusion.','Model honesty, respect, fairness and responsibility.','Recognize team and individual contributions.','Understand what motivates different team members.','Provide training when a performance problem comes from a skill gap.','Clarify expectations when a problem comes from misunderstanding.','Investigate before blaming anyone.','Treat honest mistakes as opportunities for learning.','Do not replace a team member before coaching and understanding the cause.','Use emotional intelligence when handling difficult situations.','Adapt your leadership style to the team’s maturity and circumstances.','Support diversity, inclusion and cultural awareness.','Accept responsibility for decisions and their consequences.'
    ]},
    {id:'team',number:'03',label:'Collaboration',title:'Team and Conflict Management',start:36,items:[
      'Encourage shared ownership of project outcomes.','Let the people doing the work participate in estimating it.','Allow self-organizing teams to determine how work will be completed.','Resolve conflict early rather than allowing it to grow.','Discuss sensitive conflict directly and privately.','Focus on the problem, not personalities.','Listen to all parties before proposing a solution.','Use collaboration and problem-solving as the preferred conflict approach.','Use compromise when collaboration is impractical and time is limited.','Use forcing only when urgency, safety or authority genuinely requires it.','Do not escalate conflict before attempting appropriate resolution.','Create clear working agreements and team norms.','Use retrospectives and lessons learned to improve performance.','Avoid micromanaging competent team members.','Promote knowledge sharing to eliminate dependency on one individual.'
    ]},
    {id:'stakeholders',number:'04',label:'Engagement',title:'Stakeholders and Communication',start:51,items:[
      'Identify stakeholders as early as possible.','Continuously reassess stakeholders because influence and attitudes change.','Engage stakeholders throughout the project—not only at approval points.','Understand the reason behind stakeholder resistance.','Tailor communication to the audience’s needs and preferences.','Use interactive communication for sensitive, complex or urgent matters.','Confirm that the receiver understood the message.','Communicate directly before escalating through organizational authority.','Never hide bad news or manipulate project information.','Present problems with facts, impacts and possible options.','Manage expectations instead of making unrealistic promises.','Involve affected stakeholders in relevant decisions.','Seek clarification when requirements or expectations are unclear.','Use negotiation and facilitation before relying on positional power.','Update the stakeholder engagement and communication approaches when conditions change.'
    ]},
    {id:'value',number:'05',label:'Outcomes',title:'Value, Scope and Requirements',start:66,items:[
      'Focus on outcomes and value—not merely activities and outputs.','Connect requirements to business objectives and expected benefits.','Reassess the business case when expected value is threatened.','Prioritize work based on value, risk, urgency and dependencies.','Engage customers and users when clarifying requirements.','Use progressive elaboration when complete information is unavailable.','Validate deliverables with the authorized customer or product owner.','Do not gold-plate by adding unrequested features.','Protect the project from uncontrolled scope creep.','Use the requirements traceability matrix when formal traceability is needed.','Define acceptance criteria before evaluating deliverables.','A technically completed deliverable is not necessarily an accepted deliverable.','Project success includes benefits, usability and stakeholder value—not only the triple constraint.'
    ]},
    {id:'change',number:'06',label:'Governed adaptation',title:'Change Management',start:79,items:[
      'Evaluate a proposed change before approving or rejecting it.','Assess the change’s effects on scope, schedule, finance, quality, resources, risk and value.','In predictive work, do not implement a change before formal approval.','A sponsor’s request is not automatically an approved change.','Follow integrated change control when the governance model requires it.','Submit significant changes to the authorized decision-making body.','Update baselines, plans and documents after approval.','Communicate approved changes to affected people.','Do not secretly absorb a change to satisfy a stakeholder.','In agile work, place new requests in the backlog for prioritization.','Do not automatically interrupt a sprint for every new request.','Support organizational change through engagement, communication, training and reinforcement.'
    ]},
    {id:'risk',number:'07',label:'Uncertainty and excellence',title:'Risk, Issues and Quality',start:91,items:[
      'A risk is uncertain; an issue has already occurred.','Record identified risks in the risk register.','Record active problems in the issue log.','Assign an appropriate owner to each significant risk or issue.','Implement the planned risk response when its trigger occurs.','Identify secondary and residual risks after responding.','Reassess risks throughout the project.','Escalate a threat when it exceeds the team’s authority or tolerance.','Build quality into the work instead of depending only on final inspection.','Use root-cause analysis for recurring defects or failures.','Prevent defects when possible; correction and rework are more expensive.','Never sacrifice safety, ethics, compliance or essential quality to meet a deadline.'
    ]},
    {id:'agile',number:'08',label:'Ways of working',title:'Agile, Hybrid and Adaptive Delivery',start:103,items:[
      'The product owner orders and prioritizes the product backlog.','The development team determines how to perform the work.','Deliver small, usable increments and obtain feedback early.','Measure progress through completed, valuable outcomes—not documentation alone.','Use retrospectives to improve the team’s methods, relationships and performance.','Use predictive, agile or hybrid delivery based on context—not personal preference.'
    ]},
    {id:'governance',number:'09',label:'Modern project leadership',title:'Governance, Sustainability and AI',start:109,items:[
      'Align decisions with governance, ethics, law, contracts, strategy and organizational value.','Consider environmental, social, economic and long-term sustainability—not only immediate project results.','Use AI as decision support, verify its outputs, protect confidential data, check for bias and retain accountable human oversight.'
    ]}
  ];
}
