import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';

type Step={number:string;title:string;text:string;tip:string};
type UseCase={task:string;how:string;prompt:string};
type Phase={id:string;number:string;label:string;title:string;intro:string;uses:UseCase[]};
type Rule={title:string;text:string};

@Component({
  standalone:true,
  selector:'app-claude-pm-ba-article',
  imports:[RouterLink],
  template:`
  <article class="page guide-article">
    <a routerLink="/resources" class="back">← PM Knowledge Lake</a>

    <header class="article-hero">
      <img src="claude-pm-ba-guide.webp" alt="Project team collaborating around a laptop running an AI assistant, with floating panels for a timeline, risk heat map, story board, process flow, stakeholder map and dashboard">
      <div class="hero-overlay">
        <p class="eyebrow">AI in practice · Field manual</p>
        <h1>Using Claude in Project Management and Business Analysis</h1>
        <p class="hero-lead">A practical guide to working with an AI assistant across the project lifecycle—from charter to lessons learned—without giving up judgment, governance or accountability.</p>
        <p class="byline">Md Alamgir Hossain, PMP®, CSM®, ITIL® · October 9, 2026 · 15–18 minute read</p>
      </div>
    </header>

    <section class="intro card">
      <p>Claude is an AI assistant made by Anthropic. You can talk to it in plain language, give it documents to work from, and ask it to draft, summarize, analyze, compare and explain. For project managers and business analysts, that makes it a capable <strong>thinking partner and drafting assistant</strong>: it can turn rough meeting notes into minutes, a problem statement into a first-draft charter, or a list of needs into user stories with acceptance criteria.</p>
      <p>This article is both a feature and a short manual. It explains how to set Claude up for project work, shows where it adds value in each phase of a project and in business analysis, gives you a ready-to-use prompt library, and closes with the guardrails that keep AI use professional and responsible.</p>
      <p class="principle"><strong>The guiding principle:</strong> Claude drafts; you decide. Use AI to accelerate thinking and documentation, and keep the professional accountability for every decision, number and commitment that leaves your hands.</p>
    </section>

    <nav class="toc card" aria-label="Article contents">
      <p class="eyebrow">In this manual</p>
      <div class="toc-grid">
        <a routerLink="/resources/claude-for-project-management-business-analysis" fragment="setup">01 · Set up Claude for project work</a>
        <a routerLink="/resources/claude-for-project-management-business-analysis" fragment="prompting">02 · Write prompts that work</a>
        @for(phase of phases;track phase.id){<a routerLink="/resources/claude-for-project-management-business-analysis" [fragment]="phase.id">{{phase.number}} · {{phase.title}}</a>}
        <a routerLink="/resources/claude-for-project-management-business-analysis" fragment="example">06 · Worked example</a>
        <a routerLink="/resources/claude-for-project-management-business-analysis" fragment="guardrails">07 · Responsible use guardrails</a>
      </div>
    </nav>

    <section id="setup" class="guide-section">
      <div class="section-heading"><span>01</span><div><p class="eyebrow">Getting started</p><h2>Set up Claude for project work in five steps</h2></div></div>
      <ol class="steps">
        @for(step of setupSteps;track step.number){
          <li class="step"><span class="step-number">{{step.number}}</span><div><h3>{{step.title}}</h3><p>{{step.text}}</p><p class="tip"><strong>Tip</strong>{{step.tip}}</p></div></li>
        }
      </ol>
      <div class="instructions card">
        <p class="eyebrow">Example project instructions</p>
        <pre>{{sampleInstructions}}</pre>
        <button class="copy" type="button" (click)="copy(sampleInstructions,'instructions')">{{copied==='instructions'?'Copied ✓':'Copy instructions'}}</button>
      </div>
    </section>

    <section id="prompting" class="guide-section">
      <div class="section-heading"><span>02</span><div><p class="eyebrow">Prompting</p><h2>Write prompts that work: the C-T-C-F-R pattern</h2></div></div>
      <p class="section-intro">Vague requests produce generic answers. A good project prompt gives Claude the same briefing you would give a new team member. Use five building blocks:</p>
      <div class="pattern">
        @for(part of promptPattern;track part.title){<div class="pattern-part"><strong>{{part.title}}</strong><p>{{part.text}}</p></div>}
      </div>
      <div class="compare">
        <div class="weak"><p class="eyebrow">Weak prompt</p><p>“Write a risk register for my project.”</p></div>
        <div class="strong"><p class="eyebrow">Strong prompt</p><p>“<strong>Context:</strong> We are migrating a 40-user finance team from spreadsheets to a cloud accounting system by March; the vendor is new to us and month-end close cannot be disrupted. <strong>Task:</strong> Identify the top 10 risks. <strong>Constraints:</strong> Focus on schedule, data quality, adoption and vendor risks; do not invent costs. <strong>Format:</strong> A table with risk statement (cause–event–effect), probability, impact, owner role, response strategy and trigger. <strong>Review:</strong> Then list three questions I should ask the vendor to validate these risks.”</p></div>
      </div>
    </section>

    @for(phase of phases;track phase.id){
      <section [id]="phase.id" class="guide-section">
        <div class="section-heading"><span>{{phase.number}}</span><div><p class="eyebrow">{{phase.label}}</p><h2>{{phase.title}}</h2></div></div>
        <p class="section-intro">{{phase.intro}}</p>
        <div class="use-grid">
          @for(use of phase.uses;track use.task){
            <article class="use">
              <h3>{{use.task}}</h3>
              <p>{{use.how}}</p>
              <div class="prompt"><p class="prompt-label">Try this prompt</p><p class="prompt-text">“{{use.prompt}}”</p><button class="copy small" type="button" (click)="copy(use.prompt,use.task)">{{copied===use.task?'Copied ✓':'Copy'}}</button></div>
            </article>
          }
        </div>
      </section>
    }

    <section id="example" class="guide-section">
      <div class="section-heading"><span>06</span><div><p class="eyebrow">From input to output</p><h2>Worked example: one stakeholder note, three artifacts</h2></div></div>
      <div class="example-grid">
        <div class="example-box card"><p class="eyebrow">You provide</p><p class="quote">“Customer service leads say agents re-type client details into three systems. Average call handling is too long, and errors cause duplicate accounts. They want one intake screen. Launch must avoid the March peak.”</p><p class="muted">Prompt: “From this note, draft one user story with acceptance criteria, one risk entry and two clarifying questions for the stakeholders.”</p></div>
        <div class="example-box card output"><p class="eyebrow">Claude drafts (you review)</p>
          <p><strong>User story:</strong> As a customer service agent, I want to enter client details once on a single intake screen so that I can serve clients faster without duplicate data entry.</p>
          <p><strong>Acceptance criteria:</strong> Given a new client call, when the agent saves the intake screen, then the client record is created in all three connected systems; given an existing client, when the agent searches by phone or email, then the existing record is shown and no duplicate is created.</p>
          <p><strong>Risk:</strong> Because launch is close to the March peak, a defect at go-live could disrupt service during the busiest period, resulting in longer wait times. Response: avoid—set a go-live freeze window before March and plan a pilot team.</p>
          <p><strong>Questions:</strong> What is today’s average handling time, so we can set a measurable target? Which of the three systems is the source of truth for client data?</p>
        </div>
      </div>
      <p class="section-intro"><strong>Your job next:</strong> confirm the story with the product owner, validate the acceptance criteria with real scenarios, and replace assumptions with measured baselines before anything enters the backlog.</p>
    </section>

    <section id="guardrails" class="guardrails card">
      <p class="eyebrow">Responsible use</p>
      <h2>Seven guardrails for professional AI use</h2>
      <div class="rule-grid">@for(rule of guardrails;track rule.title;let i=$index){<div class="rule"><span>{{i+1}}</span><div><h3>{{rule.title}}</h3><p>{{rule.text}}</p></div></div>}</div>
    </section>

    <section class="do-dont">
      <div class="do card"><p class="eyebrow">Do</p><ul>@for(item of doList;track item){<li>{{item}}</li>}</ul></div>
      <div class="dont card"><p class="eyebrow">Don’t</p><ul>@for(item of dontList;track item){<li>{{item}}</li>}</ul></div>
    </section>

    <section class="golden">
      <p class="eyebrow">Key lesson</p>
      <blockquote>AI will not replace the project manager or business analyst who brings judgment, relationships and accountability. It will strengthen the ones who learn to use it well—and who never stop verifying.</blockquote>
    </section>

    <footer class="disclaimer"><p>PMPORT is an independent project-management learning platform. Claude is a product of Anthropic; this article is not endorsed by or affiliated with Anthropic. Features such as Projects, file uploads, web search and connectors vary by plan and change over time—check <a href="https://support.claude.com" target="_blank" rel="noreferrer">support.claude.com</a> for current details. Always follow your organization’s policies on AI tools and data. PMP® and PMI® are registered marks of Project Management Institute, Inc.</p><a routerLink="/resources" class="button primary">Back to PM Knowledge Lake</a></footer>
  </article>`,
  styles:[`
    .guide-article{max-width:1180px}.back{display:inline-block;margin-bottom:1rem;color:var(--accent);font-weight:700}
    .article-hero{position:relative;min-height:590px;overflow:hidden;border-radius:24px;margin-bottom:2rem;background:#071a33}.article-hero>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:70% center}
    .hero-overlay{position:relative;z-index:1;display:flex;min-height:590px;width:60%;padding:clamp(2rem,6vw,5rem);flex-direction:column;justify-content:center;background:linear-gradient(90deg,rgba(4,18,35,.97),rgba(4,18,35,.8) 70%,transparent);color:#fff}
    .hero-overlay h1{font-size:clamp(2.2rem,4.4vw,4.2rem);line-height:1.04;margin:.7rem 0 1rem}.hero-lead{font-size:clamp(1.05rem,2vw,1.3rem);line-height:1.6;color:#d8e8f5}.byline{font-size:.88rem;color:#a9bfd2;line-height:1.6}
    .intro{margin-bottom:2rem}.intro p,.section-intro{font-size:1.05rem;line-height:1.85;color:#c4d4e2}.principle{padding:1rem 1.2rem;border-left:4px solid #f0a35e;border-radius:8px;background:rgba(240,163,94,.08)}
    .toc{margin-bottom:3rem}.toc-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.75rem}.toc a{padding:.85rem 1rem;border:1px solid var(--line);border-radius:10px;color:#d9eef7;background:#082039}
    .guide-section{padding-top:1rem;margin-bottom:3.5rem;scroll-margin-top:80px}.section-heading{display:flex;align-items:center;gap:1rem;margin-bottom:1.2rem}.section-heading>span{display:grid;place-items:center;flex:0 0 56px;height:56px;border-radius:16px;background:linear-gradient(135deg,#f0a35e,var(--accent));color:#041223;font-size:1.15rem;font-weight:800}.section-heading h2{font-size:clamp(1.7rem,3vw,2.5rem);margin:.2rem 0}.section-heading p{margin:0}
    .steps{list-style:none;padding:0;margin:0 0 1.5rem;display:grid;gap:1rem}.step{display:flex;gap:1rem;padding:1.3rem;border:1px solid var(--line);border-radius:14px;background:#0b2340}.step-number{display:grid;place-items:center;flex:0 0 40px;height:40px;border-radius:50%;border:2px solid #f0a35e;color:#ffc994;font-weight:800}.step h3{margin:.3rem 0 .5rem;font-size:1.15rem}.step p{margin:0 0 .6rem;line-height:1.65;color:#c9d9e7}
    .tip,.prompt{padding:.75rem .9rem;border-left:3px solid var(--accent);border-radius:6px;background:rgba(73,204,225,.07)}.tip strong{display:block;margin-bottom:.2rem;font-size:.74rem;letter-spacing:.08em;text-transform:uppercase;color:var(--accent)}
    .instructions pre{white-space:pre-wrap;margin:0 0 1rem;padding:1rem;border-radius:10px;background:#061629;color:#dcebf7;font:inherit;font-size:.95rem;line-height:1.7}
    .copy{padding:.55rem .9rem;border:1px solid var(--accent);border-radius:8px;background:transparent;color:var(--accent);font-weight:700;cursor:pointer}.copy.small{margin-top:.6rem;padding:.35rem .7rem;font-size:.82rem}
    .pattern{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:.75rem;margin:1.2rem 0 1.5rem}.pattern-part{padding:1rem;border-radius:12px;background:#0b2340;border:1px solid var(--line)}.pattern-part strong{color:#ffc994;font-size:1.05rem}.pattern-part p{margin:.4rem 0 0;color:#c9d9e7;line-height:1.55;font-size:.95rem}
    .compare{display:grid;grid-template-columns:1fr 2fr;gap:1rem}.compare>div{padding:1.2rem;border-radius:14px;line-height:1.7}.weak{border:1px solid #6b3a3a;background:rgba(255,122,107,.06)}.weak .eyebrow{color:#ff9c90}.strong{border:1px solid #2c6b62;background:rgba(43,212,196,.06)}.compare p{margin:0;color:#dcebf7}.compare .eyebrow{margin-bottom:.6rem}
    .use-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}.use{display:flex;flex-direction:column;gap:.6rem;padding:1.3rem;border:1px solid var(--line);border-radius:14px;background:#0b2340}.use h3{margin:0;font-size:1.12rem}.use>p{margin:0;line-height:1.6;color:#c9d9e7}.use .prompt{margin-top:auto}.prompt-label{margin:0 0 .3rem;font-size:.74rem;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);font-weight:800}.prompt-text{margin:0;color:#e6f1fa;line-height:1.6;font-style:italic}
    .example-grid{display:grid;grid-template-columns:1fr 1.4fr;gap:1rem;margin-bottom:1rem}.example-box p{line-height:1.7;color:#d6e4ef}.quote{font-style:italic;font-size:1.05rem}.output{border-color:#2c6b62}
    .guardrails{margin:1rem 0 3rem;scroll-margin-top:80px}.guardrails h2{font-size:clamp(1.8rem,3vw,2.5rem)}.rule-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem 2rem;margin-top:1.2rem}.rule{display:flex;gap:.9rem}.rule>span{display:grid;place-items:center;flex:0 0 32px;height:32px;border-radius:50%;background:#f0a35e;color:#041223;font-weight:800}.rule h3{margin:.2rem 0 .3rem;font-size:1.05rem}.rule p{margin:0;line-height:1.6;color:#c9d9e7}
    .do-dont{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin:3rem 0}.do-dont li{padding:.4rem 0;line-height:1.6;color:#d6e4ef}.do{border-color:#2c6b62}.dont{border-color:#6b3a3a}.dont .eyebrow{color:#ff9c90}
    .golden{padding:2.5rem;border-radius:20px;background:linear-gradient(135deg,#10395b,#3a2a3f);margin:3rem 0}.golden blockquote{margin:1.5rem 0 0;padding:1.2rem 1.5rem;border-left:4px solid #f0a35e;background:#071a33;color:#dcebf7;line-height:1.7;font-size:clamp(1.2rem,2.4vw,1.7rem);font-weight:700}
    .disclaimer{padding-top:2rem;border-top:1px solid var(--line)}.disclaimer p{max-width:850px;color:#91a8bc;line-height:1.7;font-size:.88rem}.disclaimer a:not(.button){color:var(--accent)}.disclaimer .button{margin-top:1rem}
    @media(max-width:1000px){.use-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.pattern{grid-template-columns:repeat(2,minmax(0,1fr))}}
    @media(max-width:800px){.article-hero,.hero-overlay{min-height:660px}.hero-overlay{width:100%;justify-content:flex-end;background:linear-gradient(0deg,rgba(4,18,35,.99),rgba(4,18,35,.75) 60%,rgba(4,18,35,.08))}.toc-grid,.use-grid,.pattern,.compare,.example-grid,.rule-grid,.do-dont{grid-template-columns:1fr}.section-heading{align-items:flex-start}.golden{padding:1.5rem}.step{flex-direction:column}}
  `]
})
export class ClaudePmBaArticleComponent{
  copied='';
  async copy(text:string,key:string){try{await navigator.clipboard.writeText(text);this.copied=key;setTimeout(()=>{if(this.copied===key)this.copied=''},2000)}catch{this.copied=''}}

  readonly setupSteps:Step[]=[
    {number:'1',title:'Create one Project per initiative',text:'In the Claude app, a Project is a workspace that groups related chats and shares the same background material and instructions. Create one for each project or engagement—for example “CRM Replacement 2026”—so every conversation starts with the right context.',tip:'Keep unrelated initiatives in separate Projects. Chats in different Projects do not share context, which reduces mix-ups and protects information.'},
    {number:'2',title:'Add project knowledge',text:'Upload the documents Claude should work from: charter, business case, scope statement, requirements, glossary, templates and approved standards. Claude uses this material across every chat in the Project.',tip:'Upload only what your organization’s policy allows. Remove or mask personal, confidential or contract-sensitive details first.'},
    {number:'3',title:'Write Project instructions',text:'Instructions tell Claude how to behave in every chat: your role, your methodology, terminology, quality standards and preferred formats. Good instructions save you from repeating the same briefing.',tip:'Include “ask clarifying questions when information is missing” and “label assumptions clearly” so gaps surface instead of being filled with guesses.'},
    {number:'4',title:'Ask with structure',text:'Brief Claude as you would a capable new colleague: give context, state the task, set constraints, specify the format and ask it to review its own work. The C-T-C-F-R pattern in the next section shows how.',tip:'Ask for one artifact at a time, then refine it. Iteration produces better results than one very long request.'},
    {number:'5',title:'Review, verify and own the result',text:'Treat every output as a first draft. Check facts against sources, recalculate numbers, confirm requirements with stakeholders and apply your professional judgment before anything is shared or approved.',tip:'Ask Claude to “list the assumptions you made and what I should verify.” It is one of the most valuable follow-up prompts you can use.'}
  ];

  readonly sampleInstructions=`You are supporting me as a project manager and business analyst on [project name].
- Methodology: hybrid (predictive phases with two-week agile sprints for development).
- Use PMI-aligned terminology and Canadian English spelling.
- Write requirements as user stories with Given/When/Then acceptance criteria.
- Write risks as cause–event–effect statements with an owner role and response strategy.
- When information is missing, ask up to three clarifying questions before drafting.
- Clearly label assumptions, and never invent costs, dates or names.
- Prefer concise tables and bullet points suitable for executives.`;

  readonly promptPattern:Rule[]=[
    {title:'Context',text:'The project, audience, situation and what is already known.'},
    {title:'Task',text:'The specific artifact or decision support you need.'},
    {title:'Constraints',text:'Scope, standards, methodology, length and what to avoid.'},
    {title:'Format',text:'Table, bullet list, email, user story, RACI or diagram.'},
    {title:'Review',text:'Ask for assumptions, gaps, risks or questions to verify.'}
  ];

  readonly phases:Phase[]=[
    {id:'initiating-planning',number:'03',label:'Project management · Part 1',title:'Initiating and planning',intro:'Early in a project, Claude is most useful for turning scattered inputs into structured first drafts that you then validate with the sponsor and team.',uses:[
      {task:'Draft a project charter',how:'Turn a problem statement, sponsor notes and constraints into a structured charter with objectives, success criteria, high-level scope, milestones, risks and assumptions.',prompt:'Using the attached sponsor notes, draft a one-page project charter with SMART objectives, measurable success criteria, in-scope and out-of-scope items, key milestones, top risks and assumptions. Flag anything you had to assume.'},
      {task:'Build a work breakdown structure',how:'Decompose deliverables into work packages, and check for missing work such as training, data migration, testing and change management.',prompt:'Create a three-level WBS for this scope statement. Then list any work packages commonly forgotten in similar projects, such as data migration, training, testing and hypercare.'},
      {task:'Map stakeholders and communication',how:'Analyse stakeholders by power, interest and attitude, and propose a tailored communication plan for each group.',prompt:'From this stakeholder list, create a power–interest grid, suggest an engagement strategy for each stakeholder, and draft a communication plan table with audience, purpose, channel, frequency and owner.'}
    ]},
    {id:'executing-controlling',number:'04',label:'Project management · Part 2',title:'Executing, monitoring and closing',intro:'During delivery, Claude helps you communicate clearly, spot patterns in project information and keep documentation current—without replacing the conversations and decisions that lead a project.',uses:[
      {task:'Turn meeting notes into minutes and actions',how:'Convert rough notes or a transcript into decisions, action items with owners and due dates, open issues and risks.',prompt:'Summarize these meeting notes into: decisions made, action items (owner, due date), open issues, new risks and items needing escalation. Do not add anything that is not in the notes.'},
      {task:'Write status reports for different audiences',how:'Produce an executive summary, a team update and a sponsor escalation from the same status information.',prompt:'Using this status data, write a five-line executive summary with RAG status, the reason for any amber or red status, the decision needed from leadership, and next steps. Keep it factual and avoid optimistic wording.'},
      {task:'Analyse variance and lessons learned',how:'Explain schedule or cost variance, propose corrective actions and structure lessons learned for future projects.',prompt:'Our CPI is 0.88 and SPI is 0.93 at 60% complete. Explain what this means in plain language, list likely causes to investigate, and propose three corrective-action options with their trade-offs.'}
    ]},
    {id:'business-analysis',number:'05',label:'Business analysis',title:'Business analysis from elicitation to solution evaluation',intro:'For business analysts, Claude is a strong partner for preparing elicitation, structuring requirements and challenging them for quality. The relationship with stakeholders—and the confirmation of what they actually need—remains yours.',uses:[
      {task:'Prepare elicitation sessions',how:'Generate interview guides, workshop agendas and questions that uncover goals, pain points, exceptions and non-functional needs.',prompt:'I am interviewing the accounts payable manager about invoice approval delays. Create a 45-minute interview guide with open questions about the current process, pain points, exceptions, volumes, controls and success measures.'},
      {task:'Write and refine requirements',how:'Turn needs into user stories with acceptance criteria, and review requirements for ambiguity, missing cases and testability.',prompt:'Review these requirements for ambiguity, missing edge cases, conflicts and testability. Rewrite each one as a user story with Given/When/Then acceptance criteria, and list questions for the product owner.'},
      {task:'Model processes and analyse gaps',how:'Describe as-is and to-be processes, generate diagram code for tools that accept it, and compare current and future states.',prompt:'From this description of our current onboarding process, list the as-is steps with roles, identify bottlenecks and handoffs, propose a to-be process, and summarize the gaps in a table with impact and recommended change.'},
      {task:'Analyse data and explain logic',how:'Explain SQL queries, DAX measures or spreadsheet formulas; draft queries from a described need; and summarize what a dataset shows.',prompt:'Explain this DAX measure line by line in plain language, identify any filter-context issues, and suggest a clearer version with comments.'},
      {task:'Build a business case',how:'Structure costs, benefits, options and risks so decision-makers can compare alternatives consistently.',prompt:'Create a business case structure comparing three options: do nothing, upgrade the current system and replace it. Include cost categories, benefit categories, risks, assumptions and the evaluation criteria a steering committee should use. Do not invent figures.'},
      {task:'Prepare for solution evaluation',how:'Define measures that show whether the solution delivered value after go-live, and draft a benefits-tracking plan.',prompt:'For a new self-service customer portal, propose leading and lagging KPIs, their definitions, data sources, baseline needs and review frequency for a six-month benefits-realization plan.'}
    ]}
  ];

  readonly guardrails:Rule[]=[
    {title:'Follow your organization’s AI policy',text:'Use only approved tools and accounts, and respect rules on which information may be shared with AI services.'},
    {title:'Protect sensitive information',text:'Do not paste personal data, credentials, confidential contracts or security details unless your organization has explicitly approved it.'},
    {title:'Verify facts, figures and sources',text:'AI can be confidently wrong. Check numbers, dates, regulations and citations against authoritative sources before using them.'},
    {title:'Keep humans accountable',text:'Decisions, approvals and commitments belong to people with the authority to make them—not to an AI-generated recommendation.'},
    {title:'Check for bias and missing voices',text:'Review outputs for one-sided assumptions, and confirm that every affected stakeholder group is represented.'},
    {title:'Be transparent',text:'Where it matters, tell stakeholders that AI assisted in drafting, and never present unverified AI content as confirmed analysis.'},
    {title:'Validate with real stakeholders',text:'Requirements, estimates and risks drafted with AI are hypotheses until the people doing and using the work confirm them.'}
  ];

  readonly doList=[
    'Give rich context: goals, audience, constraints and standards.',
    'Ask for assumptions, gaps and clarifying questions.',
    'Iterate: draft, critique, refine.',
    'Use Projects to keep each initiative’s context organized.',
    'Recalculate every number before it appears in a report.'
  ];
  readonly dontList=[
    'Paste confidential or personal data without approval.',
    'Send AI output to stakeholders without reviewing it.',
    'Let AI make or approve decisions that need human authority.',
    'Accept invented costs, dates, names or citations.',
    'Skip stakeholder validation because a draft “looks complete.”'
  ];
}
