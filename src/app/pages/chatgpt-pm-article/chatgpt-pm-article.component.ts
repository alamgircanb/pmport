import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {PMP_GUIDE_STYLES} from '../pmp-guides/pmp-guide-styles';

/** Article: 12 practical ways project managers can use ChatGPT, with starter prompts and guardrails.
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
        <p class="hero-lead">AI is a co-pilot, not the project manager. Twelve practical ways to use it, starter prompts you can copy, and the guardrails that keep it safe.</p>
        <p class="byline">Md Alamgir Hossain, PMP® · October 14, 2026 · 6-minute read</p>
      </div>
    </header>

    <section class="card">
      <h2>AI is a co-pilot, not the project manager</h2>
      <p>ChatGPT can take hours of drafting, summarizing and first-pass analysis off a project manager's week. It cannot own a decision, read the room in a steering committee, or be accountable for delivery. That accountability stays with us.</p>
      <p>Used well, generative AI works like a fast, tireless junior analyst. It produces a solid first draft in seconds, and the project manager brings the context, judgment and stakeholder knowledge that turn the draft into something usable.</p>
      <p>Below are 12 practical ways to put it to work, grouped into five areas of everyday PM practice, followed by the guardrails that keep it safe.</p>
    </section>

    <nav class="card toc" aria-label="In this article">
      <p class="eyebrow">In this article</p>
      <ol>
        <li><a routerLink="/resources/how-project-managers-can-use-chatgpt" fragment="planning">Planning and ideation</a></li>
        <li><a routerLink="/resources/how-project-managers-can-use-chatgpt" fragment="risk">Risk and problem solving</a></li>
        <li><a routerLink="/resources/how-project-managers-can-use-chatgpt" fragment="communication">Communication and meetings</a></li>
        <li><a routerLink="/resources/how-project-managers-can-use-chatgpt" fragment="data">Data, productivity and people</a></li>
        <li><a routerLink="/resources/how-project-managers-can-use-chatgpt" fragment="guardrails">Guardrails: use AI with governance</a></li>
        <li><a routerLink="/resources/how-project-managers-can-use-chatgpt" fragment="prompts">12 starter prompts</a></li>
      </ol>
    </nav>

    <section id="planning">
      <p class="eyebrow">Area 1</p>
      <h2>Planning and ideation</h2>
      <p>The blank page is the slowest part of planning, and it is where AI helps most.</p>
      <h3>1. Create project plans</h3>
      <p>Ask for a draft plan with phases, tasks, milestones and owners, or a first-cut work breakdown structure. Then check it against your scope statement, your team's real capacity and your organization's methodology. Treat the output as a skeleton, never as a baseline.</p>
      <h3>2. Brainstorm ideas</h3>
      <p>When delivery stalls, ask for ten ways to improve flow or collaboration. Most suggestions will be generic, but one or two usually lead to a better conversation with the team.</p>
      <h3>3. Create templates</h3>
      <p>Charters, status reports, RAID logs, meeting agendas and lessons-learned forms can be drafted in minutes. Align them with your PMO's standards before you share them. You can also start from the free templates in <a routerLink="/pm-tools">PM Artifacts Lab</a>.</p>
    </section>

    <section id="risk">
      <p class="eyebrow">Area 2</p>
      <h2>Risk and problem solving</h2>
      <p>AI is a useful second pair of eyes on what could go wrong.</p>
      <h3>4. Identify risks</h3>
      <p>Describe the project and ask for likely risks with mitigation options. It is good at surfacing the common categories: vendor dependency, resourcing, integration and change adoption. It will miss the risks only insiders know about. Use it to widen the list, then score and assign an owner to each risk in your register.</p>
      <h3>5. Solve problems</h3>
      <p>For issues like scope creep, ask for structured options and next steps. A prompt such as "We are facing scope creep from two business units; what are our options and the trade-offs of each?" gives you a framework to bring to the sponsor. The decision still follows your change control process.</p>
    </section>

    <section id="communication">
      <p class="eyebrow">Area 3</p>
      <h2>Communication and meetings</h2>
      <p>Project managers spend most of their time communicating, so this is where the time savings add up fastest.</p>
      <h3>6. Stakeholder communication</h3>
      <p>Give it the facts and the audience, and ask for a concise status email. An executive version leads with decisions needed and RAG status. A team version leads with priorities and blockers. You supply the facts; AI adjusts the tone.</p>
      <h3>7. Prepare meeting notes</h3>
      <p>Paste rough notes and ask for key decisions, action items, owners and due dates. Review the result before sending, because AI can confidently assign an action to the wrong person.</p>
      <h3>8. Ask better questions</h3>
      <p>Ask for strong questions for a kickoff, a retrospective or a difficult sponsor conversation. Good questions uncover hidden assumptions early, which costs far less than finding them in testing.</p>
    </section>

    <section id="data">
      <p class="eyebrow">Area 4</p>
      <h2>Data, productivity and people</h2>
      <h3>9. Analyze data</h3>
      <p>Share an anonymized schedule or budget extract and ask for trends, variances and questions worth investigating. Always check the numbers yourself or in your BI tool, because AI can misread a column or invent a total. To check earned value figures, use the <a routerLink="/pm-calculators/earned-value-calculator">earned value calculator</a>.</p>
      <h3>10. Save time on routine work</h3>
      <p>Turn bullet points into a polished status report, reformat a risk log, or tighten a long email. These small wins return hours every month.</p>
      <h3>11. Improve team performance</h3>
      <p>When a project is delayed and morale drops, ask for ways to rebuild momentum, recognize effort and reset expectations. The ideas are a starting point; trust comes from how you act on them.</p>
      <h3>12. Learn and stay updated</h3>
      <p>Ask it to explain Agile, earned value or a new framework in plain terms with real examples. It is a strong study partner for certifications such as PMP, as long as you confirm key points against official sources like the PMBOK® Guide. Then test yourself with the free <a routerLink="/pm-faciliter/pmp-exam-simulator">PMP exam simulator</a>.</p>
    </section>

    <section id="guardrails">
      <p class="eyebrow">Area 5</p>
      <h2>Guardrails: use AI with governance</h2>
      <p>AI is only as valuable as the discipline around it. Four rules keep it safe and credible:</p>
      <div class="facts">
        <div class="fact"><strong>Protect</strong><span>Never paste client names, personal information, contract values or internal financials into a public AI tool. Follow your organization's AI policy and use approved enterprise tools where they exist.</span></div>
        <div class="fact"><strong>Validate</strong><span>AI can produce answers that are confident, plausible and wrong. Check facts, figures, dates and names before anything leaves your desk.</span></div>
        <div class="fact"><strong>Own it</strong><span>Keep accountability human. AI drafts; the project manager decides, signs off and owns the outcome.</span></div>
        <div class="fact"><strong>Disclose</strong><span>Be transparent. If AI shaped a deliverable, tell your team and sponsor, in line with your organization's norms.</span></div>
      </div>
      <div class="callout"><p><strong>Getting started.</strong> Start small. Pick one routine task this week, such as a status report or meeting summary, and let AI draft it. Measure the time saved, review the quality, and expand from there.</p></div>
    </section>

    <section id="prompts">
      <p class="eyebrow">Copy and adapt</p>
      <h2>12 starter prompts for project managers</h2>
      <p>Add your own context to each prompt: the project, the audience and the format you want. Remove anything confidential first.</p>
      <div class="table-wrap"><table class="data">
        <thead><tr><th>Use case</th><th>Starter prompt</th><th><span class="sr">Copy</span></th></tr></thead>
        <tbody>
          <tr><td><strong>Project plan</strong></td><td>Create a detailed project plan with phases, tasks, milestones and owners for a new project.</td><td><button type="button" class="copy" (click)="copy(0)" aria-label="Copy the project plan prompt">{{label(0)}}</button></td></tr>
          <tr><td><strong>Brainstorming</strong></td><td>Give me 10 creative ideas to improve project delivery and team collaboration.</td><td><button type="button" class="copy" (click)="copy(1)" aria-label="Copy the brainstorming prompt">{{label(1)}}</button></td></tr>
          <tr><td><strong>Risks</strong></td><td>What are the key risks in this project and how can we mitigate them?</td><td><button type="button" class="copy" (click)="copy(2)" aria-label="Copy the risks prompt">{{label(2)}}</button></td></tr>
          <tr><td><strong>Status update</strong></td><td>Write a concise project status update email for stakeholders.</td><td><button type="button" class="copy" (click)="copy(3)" aria-label="Copy the status update prompt">{{label(3)}}</button></td></tr>
          <tr><td><strong>Data analysis</strong></td><td>Analyze this project data and highlight key trends, issues and recommendations.</td><td><button type="button" class="copy" (click)="copy(4)" aria-label="Copy the data analysis prompt">{{label(4)}}</button></td></tr>
          <tr><td><strong>Templates</strong></td><td>Create a project charter template with all essential sections.</td><td><button type="button" class="copy" (click)="copy(5)" aria-label="Copy the templates prompt">{{label(5)}}</button></td></tr>
          <tr><td><strong>Meeting notes</strong></td><td>Summarize these meeting notes and list key decisions and action items.</td><td><button type="button" class="copy" (click)="copy(6)" aria-label="Copy the meeting notes prompt">{{label(6)}}</button></td></tr>
          <tr><td><strong>Questions</strong></td><td>Give me 10 powerful questions to ask in a project kickoff meeting.</td><td><button type="button" class="copy" (click)="copy(7)" aria-label="Copy the questions prompt">{{label(7)}}</button></td></tr>
          <tr><td><strong>Routine work</strong></td><td>Turn these bullet points into a professional project status report.</td><td><button type="button" class="copy" (click)="copy(8)" aria-label="Copy the routine work prompt">{{label(8)}}</button></td></tr>
          <tr><td><strong>Team morale</strong></td><td>Suggest ways to improve team morale when the project is delayed.</td><td><button type="button" class="copy" (click)="copy(9)" aria-label="Copy the team morale prompt">{{label(9)}}</button></td></tr>
          <tr><td><strong>Learning</strong></td><td>Explain the Agile methodology in simple terms with real examples.</td><td><button type="button" class="copy" (click)="copy(10)" aria-label="Copy the learning prompt">{{label(10)}}</button></td></tr>
          <tr><td><strong>Problem solving</strong></td><td>We are facing scope creep. What are the possible solutions and next steps?</td><td><button type="button" class="copy" (click)="copy(11)" aria-label="Copy the problem solving prompt">{{label(11)}}</button></td></tr>
        </tbody>
      </table></div>
    </section>

    <section class="card">
      <p>The project managers who gain most from AI will not be the ones who use it most. They will be the ones who pair it with sound judgment, strong governance and real stakeholder relationships.</p>
      <div class="cta"><a class="button primary" routerLink="/resources/claude-for-project-management-business-analysis">Read: Using Claude in PM and BA</a><a class="button secondary" routerLink="/resources/ai-super-coworker-project-manager-business-analyst">Read: AI as a super coworker</a></div>
    </section>
  </article>`,
  styles:[PMP_GUIDE_STYLES+`
    .copy{border:1px solid #315370;background:#0b2340;color:#d9eef7;border-radius:8px;padding:.35rem .7rem;font-weight:700;cursor:pointer;white-space:nowrap}
    .copy:hover{background:#12385f}.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
    .guide .fact strong{font-size:1.35rem}
  `]
})
export class ChatgptPmArticleComponent{
  readonly prompts=[
    {use:'Project plan',text:'Create a detailed project plan with phases, tasks, milestones and owners for a new project.'},
    {use:'Brainstorming',text:'Give me 10 creative ideas to improve project delivery and team collaboration.'},
    {use:'Risks',text:'What are the key risks in this project and how can we mitigate them?'},
    {use:'Status update',text:'Write a concise project status update email for stakeholders.'},
    {use:'Data analysis',text:'Analyze this project data and highlight key trends, issues and recommendations.'},
    {use:'Templates',text:'Create a project charter template with all essential sections.'},
    {use:'Meeting notes',text:'Summarize these meeting notes and list key decisions and action items.'},
    {use:'Questions',text:'Give me 10 powerful questions to ask in a project kickoff meeting.'},
    {use:'Routine work',text:'Turn these bullet points into a professional project status report.'},
    {use:'Team morale',text:'Suggest ways to improve team morale when the project is delayed.'},
    {use:'Learning',text:'Explain the Agile methodology in simple terms with real examples.'},
    {use:'Problem solving',text:'We are facing scope creep. What are the possible solutions and next steps?'},
  ];
  copiedIndex=-1;
  label(i:number){return this.copiedIndex===i?'Copied ✓':'Copy';}
  async copy(i:number){try{await navigator.clipboard.writeText(this.prompts[i].text);this.copiedIndex=i;setTimeout(()=>{if(this.copiedIndex===i)this.copiedIndex=-1;},2000);}catch{this.copiedIndex=-1;}}
}
