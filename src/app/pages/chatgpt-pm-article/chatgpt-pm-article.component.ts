import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {PMP_GUIDE_STYLES} from '../pmp-guides/pmp-guide-styles';

/** Article: how project managers can use ChatGPT across the project life cycle, with copy-ready prompts and guardrails.
 * The text is static so it is also copied into the pre-built HTML for search engines. */
@Component({
  standalone:true,selector:'app-chatgpt-pm-article',imports:[RouterLink],
  template:`
  <article class="page guide">
    <a routerLink="/resources" class="back">← PM Knowledge Lake</a>
    <header class="article-hero">
      <img src="chatgpt-for-project-managers.webp" alt="An AI co-pilot chat drafting a project status update for review, beside a project manager's checklist: validate facts, protect data, decide and sign off, be transparent" width="1600" height="900" fetchpriority="high">
      <div class="hero-overlay">
        <p class="eyebrow">AI in practice · Project management</p>
        <h1>How Project Managers Can Use ChatGPT</h1>
        <p class="hero-lead">Twelve practical uses from initiation to closure, a prompt for each one, what AI gets wrong, and five rules for using it safely.</p>
        <p class="byline">Md Alamgir Hossain, PMP® · October 14, 2026 · 8-minute read</p>
      </div>
    </header>

    <section class="card">
      <h2>A co-pilot, not a replacement</h2>
      <p>Most project managers do not lose their week to big decisions. They lose it to writing: status reports, meeting summaries, risk logs, and emails that say the same thing three ways for three audiences. That is the work ChatGPT and similar tools do well.</p>
      <p>What these tools cannot do is lead. They do not know your sponsor's priorities, the history between two departments, or which vendor always delivers late. They cannot be accountable for a decision. The best way to think about them is as a quick, well-read assistant who has never met your stakeholders: useful for a first draft, never the final word.</p>
      <div class="callout"><p><strong>The working rule: draft, check, decide.</strong> Let AI produce the first draft. Check every fact, name and number against your own sources. Then make the decision yourself, in your own words.</p></div>
    </section>

    <nav class="card toc" aria-label="In this article">
      <p class="eyebrow">In this article</p>
      <ol>
        <li><a routerLink="/resources/how-project-managers-can-use-chatgpt" fragment="initiating">Initiating: uses 1–2</a></li>
        <li><a routerLink="/resources/how-project-managers-can-use-chatgpt" fragment="planning">Planning: uses 3–5</a></li>
        <li><a routerLink="/resources/how-project-managers-can-use-chatgpt" fragment="executing">Executing: uses 6–8</a></li>
        <li><a routerLink="/resources/how-project-managers-can-use-chatgpt" fragment="monitoring">Monitoring and controlling: uses 9–10</a></li>
        <li><a routerLink="/resources/how-project-managers-can-use-chatgpt" fragment="closing">Closing and growing: uses 11–12</a></li>
        <li><a routerLink="/resources/how-project-managers-can-use-chatgpt" fragment="limits">What AI gets wrong</a></li>
        <li><a routerLink="/resources/how-project-managers-can-use-chatgpt" fragment="rules">Five rules for safe use</a></li>
        <li><a routerLink="/resources/how-project-managers-can-use-chatgpt" fragment="start">A 30-day starter plan</a></li>
      </ol>
    </nav>

    <section class="card">
      <h2>How to use the prompts</h2>
      <p>Each use below comes with a prompt you can copy. Replace the parts in [square brackets] with your own details. The more context you give (the project, the audience, the format you want), the better the draft. Remove names, contract values and anything confidential before you paste.</p>
    </section>

    <section id="initiating">
      <p class="eyebrow">Initiating</p>
      <h2>Start projects on a clear footing</h2>
      <h3>1. Turn a vague request into a draft charter</h3>
      <p>Projects often begin as an email or a hallway conversation. Paste the request and ask for a draft charter. The value is not the document itself but the gaps it exposes: missing objectives, no success measures, no named sponsor. Those gaps become your questions for the kickoff.</p>
      <div class="prompt"><p>Here is a project request: [paste request]. Draft a one-page project charter with purpose, objectives, high-level scope, out of scope, success measures, key stakeholders, assumptions and constraints. Then list the questions I must answer before the charter can be approved.</p><button type="button" class="copy" (click)="copy($any($event.target).previousElementSibling.textContent,1)">{{label(1)}}</button></div>
      <h3>2. Map stakeholders and what they care about</h3>
      <p>Describe the groups affected by the project and ask what each one is likely to worry about. You will get a starting stakeholder register and a sense of where resistance may come from. Then correct it with what you actually know about the people involved.</p>
      <div class="prompt"><p>For a project that will [describe the change], list the likely stakeholder groups. For each one, give their main interests, likely concerns, level of influence and a suggested way to engage them. Present it as a table.</p><button type="button" class="copy" (click)="copy($any($event.target).previousElementSibling.textContent,2)">{{label(2)}}</button></div>
    </section>

    <section id="planning">
      <p class="eyebrow">Planning</p>
      <h2>Plan faster without skipping the thinking</h2>
      <h3>3. Break the scope into a first-cut WBS</h3>
      <p>A work breakdown structure is tedious to start from nothing. Ask for a draft with deliverables and work packages, then refine it with your team. The team's corrections are where the real estimates come from. You can build the final version in the free <a routerLink="/pm-tools">PM Artifacts Lab</a>, which draws the WBS tree for you.</p>
      <div class="prompt"><p>Create a work breakdown structure for [project and main deliverables], three levels deep, with WBS codes. Mark the work packages that usually carry the most estimating uncertainty and explain why.</p><button type="button" class="copy" (click)="copy($any($event.target).previousElementSibling.textContent,3)">{{label(3)}}</button></div>
      <h3>4. Stress-test the schedule</h3>
      <p>Instead of asking AI to build your schedule, ask it to attack one. Share the main milestones and durations and ask what could make them wrong. It is a quick way to find optimistic assumptions before your sponsor does. For a numeric view of schedule risk, try the <a routerLink="/pm-calculators/monte-carlo-schedule-simulator">Monte Carlo schedule simulator</a>.</p>
      <div class="prompt"><p>Here are my milestones and durations: [paste list]. Act as a sceptical reviewer. Which estimates look optimistic, which dependencies are missing, and what three questions should I ask the team before I commit to these dates?</p><button type="button" class="copy" (click)="copy($any($event.target).previousElementSibling.textContent,4)">{{label(4)}}</button></div>
      <h3>5. Widen your risk list</h3>
      <p>Everyone has blind spots. AI is good at listing the risks that are common to a type of project: vendor dependence, data migration, key-person loss, low adoption. It cannot know the risks that live inside your organization. Use it to widen the list, then score each risk and give it an owner in your register.</p>
      <div class="prompt"><p>List 15 risks for a [type of project] in [industry], grouped by category. For each, give the cause, the possible effect, an early warning sign and one response. Leave probability and impact blank so my team can score them.</p><button type="button" class="copy" (click)="copy($any($event.target).previousElementSibling.textContent,5)">{{label(5)}}</button></div>
    </section>

    <section id="executing">
      <p class="eyebrow">Executing</p>
      <h2>Communicate more, write less</h2>
      <h3>6. Write one update for several audiences</h3>
      <p>Executives want decisions and status at a glance. The team wants priorities and blockers. Clients want progress and next steps. Write the facts once, then ask for a version for each audience. You keep control of the facts; AI only changes the framing.</p>
      <div class="prompt"><p>Here are this week's facts: [paste bullet points]. Write three short updates: one for executives (status, decisions needed, top risk), one for the team (priorities and blockers) and one for the client (progress and next steps). Do not add any facts that are not in my notes.</p><button type="button" class="copy" (click)="copy($any($event.target).previousElementSibling.textContent,6)">{{label(6)}}</button></div>
      <h3>7. Turn meeting notes into decisions and actions</h3>
      <p>Rough notes become a clean summary in seconds. Read it before you send it: AI sometimes gives an action to the wrong person or turns a discussion into a decision that was never made.</p>
      <div class="prompt"><p>Turn these meeting notes into a summary with three sections: decisions made, action items (owner and due date) and open questions. If an owner or date is unclear, write "to confirm" instead of guessing. Notes: [paste notes].</p><button type="button" class="copy" (click)="copy($any($event.target).previousElementSibling.textContent,7)">{{label(7)}}</button></div>
      <h3>8. Rehearse a difficult conversation</h3>
      <p>Before telling a sponsor that the date will slip, practise. Ask the AI to play a sceptical sponsor and push back on your message. It helps you find the weak points in your argument and prepare clear options.</p>
      <div class="prompt"><p>Play the role of a demanding project sponsor. I need to tell you that [the issue] and recommend [your option]. Push back the way a busy executive would. After five exchanges, tell me where my message was weak and how to make it stronger.</p><button type="button" class="copy" (click)="copy($any($event.target).previousElementSibling.textContent,8)">{{label(8)}}</button></div>
    </section>

    <section id="monitoring">
      <p class="eyebrow">Monitoring and controlling</p>
      <h2>Make sense of the numbers and the changes</h2>
      <h3>9. Explain variances in plain language</h3>
      <p>Share anonymized figures and ask for a plain-language explanation of what they mean and what to look into next. Always recalculate the numbers yourself, because AI can misread a column or invent a total. The free <a routerLink="/pm-calculators/earned-value-calculator">earned value calculator</a> gives you CPI, SPI and forecasts you can trust.</p>
      <div class="prompt"><p>My project has these figures: planned value [PV], earned value [EV], actual cost [AC], budget at completion [BAC]. Explain in plain language what they say about cost and schedule, what the likely final cost is, and which three questions I should ask the team. Show your calculations so I can check them.</p><button type="button" class="copy" (click)="copy($any($event.target).previousElementSibling.textContent,9)">{{label(9)}}</button></div>
      <h3>10. Assess a change request</h3>
      <p>When a change request arrives, AI can help you think through its full impact before it reaches the change board. It will not know your real capacity, but it will remind you of the knock-on effects people forget: testing, training, documentation and other teams.</p>
      <div class="prompt"><p>A stakeholder has asked to [describe the change] on a project that is [current status]. List the possible impacts on scope, schedule, cost, quality, risk and other teams, and the questions the change board should ask before deciding.</p><button type="button" class="copy" (click)="copy($any($event.target).previousElementSibling.textContent,10)">{{label(10)}}</button></div>
    </section>

    <section id="closing">
      <p class="eyebrow">Closing and growing</p>
      <h2>Capture the learning, and keep learning</h2>
      <h3>11. Draft lessons learned and the closure report</h3>
      <p>Lessons learned are often skipped because the team has already moved on. Collect quick notes from the retrospective and ask AI to organize them. Make sure each lesson ends with something specific the next project should do differently.</p>
      <div class="prompt"><p>Organize these retrospective notes into lessons learned: [paste notes]. Group them into what went well, what did not and what to change. Turn each lesson into one specific, actionable recommendation for future projects.</p><button type="button" class="copy" (click)="copy($any($event.target).previousElementSibling.textContent,11)">{{label(11)}}</button></div>
      <h3>12. Learn a concept and test yourself</h3>
      <p>AI is a patient tutor. Ask it to explain a framework with an example from your own industry, then ask it to quiz you. If you are preparing for the PMP exam, confirm key points against the PMBOK® Guide and practise with the free <a routerLink="/pm-faciliter/pmp-exam-simulator">PMPORT exam simulator</a>.</p>
      <div class="prompt"><p>Explain [concept, for example earned value or Kanban] using an example from [your industry]. Then ask me five questions, one at a time, and tell me after each answer whether I am right and why.</p><button type="button" class="copy" (click)="copy($any($event.target).previousElementSibling.textContent,12)">{{label(12)}}</button></div>
    </section>

    <section id="limits">
      <p class="eyebrow">Know the limits</p>
      <h2>What AI gets wrong</h2>
      <div class="table-wrap"><table class="data">
        <thead><tr><th>Weakness</th><th>What it looks like</th><th>What to do</th></tr></thead>
        <tbody>
          <tr><td><strong>Invented facts</strong></td><td>A confident date, figure, name or reference that does not exist.</td><td>Check every fact against your own sources before you use it.</td></tr>
          <tr><td><strong>Generic answers</strong></td><td>Risk lists and plans that would fit any project.</td><td>Give more context and ask it to be specific to your situation.</td></tr>
          <tr><td><strong>No organizational context</strong></td><td>Advice that ignores politics, history and culture.</td><td>Treat the output as a starting point and apply your judgment.</td></tr>
          <tr><td><strong>Out-of-date knowledge</strong></td><td>Old versions of standards, tools or exam content.</td><td>Confirm against the latest official source.</td></tr>
          <tr><td><strong>Agreeing too easily</strong></td><td>It supports whatever you suggest.</td><td>Ask it to argue the other side or to find flaws in your plan.</td></tr>
        </tbody>
      </table></div>
    </section>

    <section id="rules">
      <p class="eyebrow">Governance</p>
      <h2>Five rules for safe use</h2>
      <div class="facts">
        <div class="fact"><strong>Protect data</strong><span>Never paste personal information, client names, contract values or internal financials into a public AI tool. Use the tools your organization has approved.</span></div>
        <div class="fact"><strong>Verify</strong><span>Check every fact, number, name and date before anything leaves your desk.</span></div>
        <div class="fact"><strong>Own decisions</strong><span>AI drafts; you decide, sign off and stay accountable for the result.</span></div>
        <div class="fact"><strong>Be open</strong><span>Tell your team and sponsor when AI helped shape a deliverable, in line with your organization's policy.</span></div>
        <div class="fact"><strong>Keep your voice</strong><span>Edit drafts so they sound like you. Stakeholders trust people, not polished text.</span></div>
      </div>
    </section>

    <section id="start">
      <p class="eyebrow">Getting started</p>
      <h2>A 30-day starter plan</h2>
      <div class="weeks">
        <div class="week"><h3>Week 1: Status reports</h3><p>Write this week's update from your bullet points with use 6. Note how long it took compared with usual.</p></div>
        <div class="week"><h3>Week 2: Meetings</h3><p>Summarize two meetings with use 7. Check every action owner before sending.</p></div>
        <div class="week"><h3>Week 3: Risks</h3><p>Run use 5 before your next risk review and bring the new ideas to the team to score.</p></div>
        <div class="week"><h3>Week 4: Review</h3><p>Add up the time saved and the errors you caught. Keep what worked, drop what did not, and agree simple team rules for AI use.</p></div>
      </div>
    </section>

    <section class="card">
      <h2>The bottom line</h2>
      <p>AI will not make anyone a better project manager on its own. It gives back time, and what matters is how you spend it: more time with stakeholders, more thought on the decisions that matter, and less on formatting documents. Draft with AI, check with care, and lead in your own voice.</p>
      <div class="cta"><a class="button primary" routerLink="/resources/claude-for-project-management-business-analysis">Read: Using Claude in PM and BA</a><a class="button secondary" routerLink="/resources/ai-super-coworker-project-manager-business-analyst">Read: AI as a super coworker</a></div>
    </section>
  </article>`,
  styles:[PMP_GUIDE_STYLES+`
    .prompt{display:flex;gap:1rem;align-items:flex-start;background:#071a30;border:1px solid #24507a;border-left:4px solid var(--accent);border-radius:12px;padding:1rem 1.1rem;margin:.6rem 0 1.4rem}
    .prompt p{margin:0;flex:1;font-family:Consolas,'Courier New',monospace;font-size:.93rem!important;line-height:1.65!important;color:#d9eef7!important}
    .copy{border:1px solid #315370;background:#0b2340;color:#d9eef7;border-radius:8px;padding:.4rem .75rem;font-weight:700;cursor:pointer;white-space:nowrap}
    .copy:hover{background:#12385f}
    .guide .fact strong{font-size:1.3rem}
    .week p{margin:.3rem 0 0;font-size:.97rem}
    @media(max-width:600px){.prompt{flex-direction:column}}
  `]
})
export class ChatgptPmArticleComponent{
  copiedIndex=0;
  label(i:number){return this.copiedIndex===i?'Copied ✓':'Copy prompt';}
  async copy(text:string|null,i:number){
    try{await navigator.clipboard.writeText((text??'').trim());this.copiedIndex=i;setTimeout(()=>{if(this.copiedIndex===i)this.copiedIndex=0;},2000);}catch{this.copiedIndex=0;}
  }
}
